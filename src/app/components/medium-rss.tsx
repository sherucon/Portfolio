import React from "react";

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  readTime?: string;
}

// ── Lightweight RSS parser (no extra deps) ─────────────────────────────────────
function extractCdata(str: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[(.*?)\\]\\]><\\/${tag}>`,
    "s",
  );
  const plain = new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, "s");
  return (str.match(re)?.[1] ?? str.match(plain)?.[1] ?? "").trim();
}

function extractAttr(str: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  return str.match(re)?.[1] ?? "";
}

async function fetchArticles(username: string): Promise<Article[]> {
  const res = await fetch(`https://medium.com/feed/@${username}`, {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3);

  return items.map((m) => {
    const body = m[1];
    const title = extractCdata(body, "title");
    const link =
      extractCdata(body, "link") || extractAttr(body, "link", "href");
    const pubDate = extractCdata(body, "pubDate");
    const thumbnail =
      extractAttr(body, "media:thumbnail", "url") ||
      extractAttr(body, "media:content", "url");

    // Rough read-time: count words in content:encoded
    const content = extractCdata(body, "content:encoded").replace(
      /<[^>]+>/g,
      "",
    );
    const words = content.split(/\s+/).filter(Boolean).length;
    const readTime =
      words > 0
        ? `${Math.max(1, Math.round(words / 200))} min read`
        : undefined;

    return {
      title,
      link,
      pubDate,
      thumbnail: thumbnail || undefined,
      readTime,
    };
  });
}

function fmtDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ── Widget ─────────────────────────────────────────────────────────────────────
export default async function MediumRSS() {
  const username = "singhshreyansh288";

  let articles: Article[] = [];
  let error = false;
  try {
    articles = await fetchArticles(username);
  } catch {
    error = true;
  }

  return (
    <div
      className="relative w-full h-full rounded-3xl flex flex-col select-none overflow-hidden p-5"
      style={{ background: "#f7f7f9" }}
    >
      {/* ── Medium badge — top right ── */}
      {/* <div className="absolute top-3 right-3 z-10">
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 0 rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.10)",
          }}
        >

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <g transform="translate(5 5) scale(3.75)">
              <path d="M4.21 0A4.201 4.201 0 0 0 0 4.21v15.58A4.201 4.201 0 0 0 4.21 24h15.58A4.201 4.201 0 0 0 24 19.79v-1.093c-.137.013-.278.02-.422.02-2.577 0-4.027-2.146-4.09-4.832a7.592 7.592 0 0 1 .022-.708c.093-1.186.475-2.241 1.105-3.022a3.885 3.885 0 0 1 1.395-1.1c.468-.237 1.127-.367 1.664-.367h.023c.101 0 .202.004.303.01V4.211A4.201 4.201 0 0 0 19.79 0Zm.198 5.583h4.165l3.588 8.435 3.59-8.435h3.864v.146l-.019.004c-.705.16-1.063.397-1.063 1.254h-.003l.003 10.274c.06.676.424.885 1.063 1.03l.02.004v.145h-4.923v-.145l.019-.005c.639-.144.994-.353 1.054-1.03V7.267l-4.745 11.15h-.261L6.15 7.569v9.445c0 .857.358 1.094 1.063 1.253l.02.004v.147H4.405v-.147l.019-.004c.705-.16 1.065-.397 1.065-1.253V6.987c0-.857-.358-1.094-1.064-1.254l-.018-.004zm19.25 3.668c-1.086.023-1.733 1.323-1.813 3.124H24V9.298a1.378 1.378 0 0 0-.342-.047Zm-1.862 3.632c-.1 1.756.86 3.239 2.204 3.634v-3.634z" />
            </g>
          </svg>
        </div>
      </div> */}

      {/* ── Header ── */}
      <p
        className="font-semibold tracking-widest uppercase text-[#aaa] mb-3"
        style={{ fontSize: "clamp(0.55rem, 1.2vw, 0.65rem)" }}
      >
        Latest Articles
      </p>

      {/* ── Article list ── */}
      {error || articles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#bbb] text-sm">
          No articles found
        </div>
      ) : (
        <div className="flex flex-col gap-0 flex-1 overflow-hidden">
          {articles.map((article, i) => (
            <React.Fragment key={i}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 no-underline group py-2"
                style={{ textDecoration: "none" }}
              >
                {/* Thumbnail */}
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="flex-shrink-0 rounded-xl object-cover"
                    style={{
                      width: "clamp(40px, 8vw, 52px)",
                      height: "clamp(40px, 8vw, 52px)",
                    }}
                  />
                ) : (
                  /* Placeholder when no thumbnail */
                  <div
                    className="flex-shrink-0 rounded-xl bg-[#e8e8ec] flex items-center justify-center"
                    style={{
                      width: "clamp(40px, 8vw, 52px)",
                      height: "clamp(40px, 8vw, 52px)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bbb"
                      strokeWidth="1.5"
                      style={{ width: 18, height: 18 }}
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                )}

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-[#1a1a1a] leading-snug line-clamp-2"
                    style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.82rem)" }}
                  >
                    {article.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      style={{
                        fontSize: "clamp(0.55rem, 1.1vw, 0.65rem)",
                        color: "#aaa",
                      }}
                    >
                      {fmtDate(article.pubDate)}
                    </span>
                    {article.readTime && (
                      <>
                        <span style={{ color: "#ccc", fontSize: "0.6rem" }}>
                          ·
                        </span>
                        <span
                          style={{
                            fontSize: "clamp(0.55rem, 1.1vw, 0.65rem)",
                            color: "#aaa",
                          }}
                        >
                          {article.readTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </a>

              {/* Divider — skip after last */}
              {i < articles.length - 1 && (
                <div style={{ height: 1, background: "#ebebed" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* ── Footer pill ── */}
      <a
        href={`https://medium.com/@${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 no-underline self-center"
        style={{
          marginTop: "0.75rem",
          background: "#e4e4e9",
          borderRadius: "9999px",
          padding: "0.3rem 0.9rem",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "clamp(9px, 1.2vw, 12px)",
            height: "clamp(9px, 1.2vw, 12px)",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span
          style={{
            color: "#888",
            fontSize: "clamp(0.5rem, 1.1vw, 0.7rem)",
            whiteSpace: "nowrap",
          }}
        >
          medium.com/@{username}
        </span>
      </a>
    </div>
  );
}

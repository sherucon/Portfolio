import React from "react";
import GhStreakWidget from "./gh-streak-widget";

// ── Fire temperature color scale mapped across 1–30 streak days ──────────────
// Dark Red (1–4) → Dull Red (5–8) → Bright Red (9–13) → Orange (14–17)
// → Yellow (18–21) → White (22–26) → Blue (27–30+)
function getStreakColor(streak: number) {
  if (streak <= 0)
    return {
      ring: "#444",
      ringAlt: "#333",
      flameOuter: "#555",
      flameInner: "#444",
      glow: "rgba(0,0,0,0)",
    };
  if (streak <= 4)
    return {
      ring: "#8B1010",
      ringAlt: "#6B0000",
      flameOuter: "#8B1010",
      flameInner: "#C02020",
      glow: "rgba(139,16,16,0.25)",
    }; // Dark Red
  if (streak <= 8)
    return {
      ring: "#C83010",
      ringAlt: "#A01800",
      flameOuter: "#C83010",
      flameInner: "#E04030",
      glow: "rgba(200,48,16,0.28)",
    }; // Dull Red
  if (streak <= 13)
    return {
      ring: "#FF3214",
      ringAlt: "#DD1A00",
      flameOuter: "#FF3214",
      flameInner: "#FF6040",
      glow: "rgba(255,50,20,0.32)",
    }; // Bright Red
  if (streak <= 17)
    return {
      ring: "#FF6500",
      ringAlt: "#E04400",
      flameOuter: "#FF6500",
      flameInner: "#FFA040",
      glow: "rgba(255,101,0,0.35)",
    }; // Orange
  if (streak <= 21)
    return {
      ring: "#FFD000",
      ringAlt: "#FFAA00",
      flameOuter: "#FFD000",
      flameInner: "#FFE880",
      glow: "rgba(255,208,0,0.35)",
    }; // Yellow
  if (streak <= 26)
    return {
      ring: "#F0F0FF",
      ringAlt: "#C8C8FF",
      flameOuter: "#FFFFFF",
      flameInner: "#E8E8FF",
      glow: "rgba(220,220,255,0.40)",
    }; // White
  return {
    ring: "#4FA8FF",
    ringAlt: "#82C8FF",
    flameOuter: "#4FA8FF",
    flameInner: "#A8D8FF",
    glow: "rgba(79,168,255,0.40)",
  }; // Blue
}

// ── GitHub GraphQL streak fetch ───────────────────────────────────────────────
async function fetchStreak(username: string, token: string): Promise<number> {
  const now = new Date();
  const yearAgo = new Date(now);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const query = `{
      user(login: "${username}") {
        contributionsCollection(from: "${yearAgo.toISOString()}", to: "${now.toISOString()}") {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch GitHub streak");

  const json = await res.json();
  const weeks =
    json.data.user.contributionsCollection.contributionCalendar.weeks;

  const days: { date: string; count: number }[] = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push({ date: day.date, count: day.contributionCount });
    }
  }
  days.sort((a, b) => a.date.localeCompare(b.date));

  const todayStr = now.toISOString().split("T")[0];
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.date === todayStr && day.count === 0) continue;
    if (day.count > 0) streak++;
    else break;
  }

  return streak;
}

// ── Server component — fetches data, renders client widget ────────────────────
export default async function GhStreak() {
  const username = "sherucon";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a1628] text-[#8f969f] p-4 text-center text-sm rounded-3xl">
        <p>Missing GitHub Token</p>
        <p className="text-xs mt-2">
          Add{" "}
          <code className="bg-[#0d1117] px-1 rounded text-white">
            GITHUB_TOKEN
          </code>{" "}
          to .env.local
        </p>
      </div>
    );
  }

  let streak = 0;
  try {
    streak = await fetchStreak(username, token);
  } catch {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a1628] text-red-400 p-4 text-sm rounded-3xl">
        Error loading streak
      </div>
    );
  }

  // streak = 7;

  return (
    <GhStreakWidget
      streak={streak}
      username={username}
      colors={getStreakColor(streak)}
    />
  );
}

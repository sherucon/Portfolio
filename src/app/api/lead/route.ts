import { NextResponse } from "next/server";

const LIMITS = {
  name: 120,
  topic: 500,
  phone: 40,
  email: 200,
  notes: 1000,
} as const;

type Field = keyof typeof LIMITS;

function readString(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? "";
  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "Google Sheets is not configured" },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 10_000) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 10_000) {
      return NextResponse.json(
        { ok: false, error: "Payload too large" },
        { status: 413 },
      );
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  const sessionId = readString(record.sessionId, 64);
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(sessionId)) {
    return NextResponse.json(
      { ok: false, error: "Invalid session" },
      { status: 400 },
    );
  }

  const fields = Object.fromEntries(
    (Object.keys(LIMITS) as Field[]).map((field) => [
      field,
      readString(record[field], LIMITS[field]),
    ]),
  ) as Record<Field, string>;

  if (!Object.values(fields).some(Boolean)) {
    return NextResponse.json(
      { ok: false, error: "Nothing to save" },
      { status: 400 },
    );
  }

  const payload = {
    secret,
    sessionId,
    ...fields,
    complete: record.complete === true,
    userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? "",
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true) {
      console.error("Sheet webhook rejected the entry", response.status, result);
      return NextResponse.json(
        { ok: false, error: "Sheet rejected the entry" },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Sheet webhook request failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not reach Google Sheets" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

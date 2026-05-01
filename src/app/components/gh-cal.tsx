"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Day {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

const LEVEL_COLORS: Record<number, string> = {
    0: "#151b23",
    1: "#033a16",
    2: "#196c2e",
    3: "#2ea043",
    4: "#56d364",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeeks(days: Day[]): (Day | null)[][] {
    if (days.length === 0) return [];
    const firstDayOfWeek = new Date(days[0].date).getDay();
    const padded: (Day | null)[] = [...Array(firstDayOfWeek).fill(null), ...days];
    const weeks: (Day | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
        const week = padded.slice(i, i + 7);
        while (week.length < 7) week.push(null);
        weeks.push(week);
    }
    return weeks;
}

function getMonthLabels(weeks: (Day | null)[][]): { weekIdx: number; label: string }[] {
    const labels: { weekIdx: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
        const firstDay = week.find((d) => d !== null);
        if (!firstDay) return;
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
            labels.push({
                weekIdx: wi,
                label: new Date(firstDay.date).toLocaleString("default", { month: "short" }),
            });
            lastMonth = month;
        }
    });
    return labels;
}

export default function GitHubCalendar({ username = "sherucon" }: { username?: string }) {
    const [weeks, setWeeks] = useState<(Day | null)[][]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
    const [cellSize, setCellSize] = useState(16);

    const outerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
            .then((r) => r.json())
            .then((data: { contributions: Day[] }) => {
                const last63 = data.contributions.slice(-63);
                setWeeks(buildWeeks(last63));
                setTotal(last63.reduce((sum, d) => sum + d.count, 0));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [username]);

    // Recompute cell size whenever the container resizes (zoom, window resize, etc.)
    useEffect(() => {
        const outer = outerRef.current;
        if (!outer || weeks.length === 0) return;

        const compute = () => {
            const { width, height } = outer.getBoundingClientRect();
            const headerH = headerRef.current?.getBoundingClientRect().height ?? 72;
            const legendH = legendRef.current?.getBoundingClientRect().height ?? 20;

            // Fixed layout estimates (independent of cellSize to avoid circular deps)
            const DAY_COL = 24;   // width of "Mon" label column
            const MONTH_ROW = 13; // height of month label row
            const GAP = 3;
            const MARGINS = 24;   // mb-3 + mt-3 between sections

            const nw = weeks.length;
            const availW = width - DAY_COL - GAP;
            const availH = height - headerH - legendH - MARGINS - MONTH_ROW;

            const cW = Math.floor((availW - GAP * (nw - 1)) / nw);
            const cH = Math.floor((availH - GAP * 6) / 7);

            setCellSize(Math.max(4, Math.min(cW, cH)));
        };

        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(outer);
        return () => ro.disconnect();
    }, [weeks.length]);

    const monthLabels = getMonthLabels(weeks);

    // All sizing derived from measured cellSize — zoom-invariant
    const GAP = Math.max(2, Math.round(cellSize * 0.14));
    const DAY_COL = Math.round(cellSize * 1.3);
    const FONT = Math.max(7, Math.round(cellSize * 0.45));
    const LEGEND_CELL = Math.max(6, Math.round(cellSize * 0.5));

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col gap-3 animate-pulse">
                <div className="h-4 w-1/2 bg-[#e0e0e4] rounded" />
                <div className="flex gap-1 flex-1 items-end">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-1 flex-1">
                            {Array.from({ length: 7 }).map((_, j) => (
                                <div key={j} className="rounded-sm flex-1" style={{ backgroundColor: "#0d1117" }} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div ref={outerRef} className="w-full h-full flex flex-col justify-between select-none">
            {/* Header */}
            <div ref={headerRef} className="mb-3">
                <p className="text-xs text-[#8f969f] font-medium uppercase tracking-widest">
                    GitHub Activity
                </p>
                <p className="text-2xl graphik-medium text-[#8f969f] leading-tight mt-0.5">
                    {total}{" "}
                    <span className="text-sm font-normal text-[#8f969f]">contributions</span>
                </p>
                <p className="text-xs text-[#8f969f] mt-0.5">
                    Last 9 weeks ·{" "}
                    <Link className="underline graphik-medium text-[#8f969f] hover:text-[#4493f8]" href="https://github.com/sherucon">
                        {username} ⤷
                    </Link>
                </p>
            </div>

            {/* Calendar */}
            <div className="flex-1 flex flex-col justify-end">
                <div>
                    {/* Month labels — overflow: visible so text bleeds into adjacent empty columns */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
                            gap: GAP,
                            marginBottom: GAP,
                            marginLeft: DAY_COL + GAP,
                            overflow: "visible",
                        }}
                    >
                        {weeks.map((_, wi) => {
                            const label = monthLabels.find((m) => m.weekIdx === wi);
                            return (
                                <div
                                    key={wi}
                                    style={{
                                        fontSize: FONT,
                                        color: "#ffffff",
                                        whiteSpace: "nowrap",
                                        overflow: "visible",
                                    }}
                                >
                                    {label?.label ?? ""}
                                </div>
                            );
                        })}
                    </div>

                    {/* Day labels + grid */}
                    <div style={{ display: "flex", gap: GAP }}>
                        {/* Day-of-week labels */}
                        <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                            {DAY_LABELS.map((d, i) => (
                                <div
                                    key={d}
                                    style={{
                                        width: DAY_COL,
                                        height: cellSize,
                                        fontSize: FONT,
                                        color: i % 2 === 0 ? "transparent" : "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Week columns */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
                                gridTemplateRows: `repeat(7, ${cellSize}px)`,
                                gridAutoFlow: "column",
                                gap: GAP,
                            }}
                        >
                            {weeks.flatMap((week, wi) =>
                                week.map((day, di) => (
                                    <div
                                        key={`${wi}-${di}`}
                                        onMouseEnter={(e) => {
                                            if (!day) return;
                                            const r = (e.target as HTMLElement).getBoundingClientRect();
                                            setTooltip({
                                                text: day.count === 0
                                                    ? `No contributions on ${day.date}`
                                                    : `${day.count} contribution${day.count > 1 ? "s" : ""} on ${day.date}`,
                                                x: r.left + r.width / 2,
                                                y: r.top - 8,
                                            });
                                        }}
                                        onMouseLeave={() => setTooltip(null)}
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                            borderRadius: Math.max(2, Math.round(cellSize * 0.18)),
                                            backgroundColor: day ? LEVEL_COLORS[day.level] : "transparent",
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div ref={legendRef} className="flex items-center gap-1.5 mt-3">
                    <span style={{ fontSize: FONT, color: "#ababab" }}>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                        <div
                            key={l}
                            style={{
                                width: LEGEND_CELL,
                                height: LEGEND_CELL,
                                borderRadius: 2,
                                backgroundColor: LEVEL_COLORS[l],
                            }}
                        />
                    ))}
                    <span style={{ fontSize: FONT, color: "#ababab" }}>More</span>
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    style={{
                        position: "fixed",
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: "translate(-50%, -100%)",
                        backgroundColor: "#24292f",
                        color: "#fff",
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 6,
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        zIndex: 9999,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}

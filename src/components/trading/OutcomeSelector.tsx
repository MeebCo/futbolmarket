"use client";

import { cn, formatPercent } from "@/lib/utils";

interface OutcomeSelectorProps {
  outcomes: string[];
  prices: number[];
  selected: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export function OutcomeSelector({
  outcomes,
  prices,
  selected,
  onSelect,
  disabled,
}: OutcomeSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Select Outcome
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {outcomes.map((outcome, i) => {
          const isYes = i === 0;
          const isSelected = selected === i;
          return (
            <button
              key={outcome}
              onClick={() => onSelect(i)}
              disabled={disabled}
              className={cn(
                "relative flex flex-col items-center rounded-xl border-2 p-4 transition-all cursor-pointer",
                isSelected
                  ? isYes
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-red-500 bg-red-50 dark:bg-red-950/30"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  isSelected
                    ? isYes
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500"
                    : "text-zinc-700 dark:text-zinc-300"
                )}
              >
                {formatPercent(prices[i] ?? 0)}
              </span>
              <span
                className={cn(
                  "text-sm font-medium mt-1",
                  isSelected
                    ? isYes
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-red-600 dark:text-red-400"
                    : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                {outcome}
              </span>
              {isSelected && (
                <div
                  className={cn(
                    "absolute top-2 right-2 h-2 w-2 rounded-full",
                    isYes ? "bg-emerald-500" : "bg-red-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

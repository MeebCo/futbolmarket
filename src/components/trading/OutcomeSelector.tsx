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
      <h3 className="text-sm font-semibold text-silver">
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
                    ? "border-buy-green bg-buy-green/10"
                    : "border-sell-red bg-sell-red/10"
                  : "border-border hover:border-silver",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  isSelected
                    ? isYes
                      ? "text-buy-green"
                      : "text-sell-red"
                    : "text-silver"
                )}
              >
                {formatPercent(prices[i] ?? 0)}
              </span>
              <span
                className={cn(
                  "text-sm font-medium mt-1",
                  isSelected
                    ? isYes
                      ? "text-buy-green"
                      : "text-sell-red"
                    : "text-silver"
                )}
              >
                {outcome}
              </span>
              {isSelected && (
                <div
                  className={cn(
                    "absolute top-2 right-2 h-2 w-2 rounded-full",
                    isYes ? "bg-buy-green" : "bg-sell-red"
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

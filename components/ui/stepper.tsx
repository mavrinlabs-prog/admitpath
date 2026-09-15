"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { springBounce } from "@/lib/motion-presets";

type Step = { id: string; label: string; description?: string };

type StepperProps = {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
};

const BRAND = "#4A6FA5";
const BRAND_LIGHT = "rgba(74,111,165,0.15)";
const GRAY = "#8890A5";
const GRAY_BG = "rgba(136,144,165,0.18)";

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = "horizontal",
}: StepperProps) {
  const isH = orientation === "horizontal";

  return (
    <div
      className={
        isH
          ? "flex items-start w-full"
          : "flex flex-col items-start"
      }
      role="list"
      aria-label={`Progress: step ${currentStep + 1} of ${steps.length}`}
    >
      {steps.map((step, i) => {
        const status: "completed" | "current" | "upcoming" =
          i < currentStep ? "completed" : i === currentStep ? "current" : "upcoming";
        const isLast = i === steps.length - 1;
        const clickable = onStepClick && status !== "current";

        return (
          <div
            key={step.id}
            role="listitem"
            aria-current={status === "current" ? "step" : undefined}
            className={
              isH
                ? "flex flex-1 items-start"
                : "flex items-start"
            }
          >
            {/* Circle + connector column */}
            <div
              className={
                isH
                  ? "flex flex-col items-center flex-1"
                  : "flex flex-col items-center mr-3"
              }
            >
              {/* Circle */}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(i)}
                className="relative flex items-center justify-center rounded-full transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  width: 32,
                  height: 32,
                  cursor: clickable ? "pointer" : "default",
                  // Focus ring color applied via focus-visible:ring class
                  "--tw-ring-color": BRAND,
                } as React.CSSProperties}
                aria-label={`${step.label} — ${status}`}
              >
                {status === "completed" && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springBounce}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      background: BRAND,
                    }}
                  >
                    <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </motion.span>
                )}

                {status === "current" && (
                  <>
                    {/* Pulse glow ring */}
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `2px solid ${BRAND}`,
                        background: BRAND_LIGHT,
                      }}
                      animate={{ boxShadow: [
                        `0 0 0 0px rgba(74,111,165,0.3)`,
                        `0 0 0 6px rgba(74,111,165,0)`,
                      ]}}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                    <span
                      className="relative z-10 text-xs font-semibold"
                      style={{ color: BRAND }}
                    >
                      {i + 1}
                    </span>
                  </>
                )}

                {status === "upcoming" && (
                  <span
                    className="flex items-center justify-center rounded-full text-xs font-medium"
                    style={{
                      width: 32,
                      height: 32,
                      background: GRAY_BG,
                      color: GRAY,
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </button>

              {/* Connecting line (horizontal: to the right, vertical: downward) */}
              {!isLast && isH && (
                <div
                  className="w-full mt-4"
                  style={{ height: 2, position: "relative" }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: GRAY_BG }}
                  />
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: BRAND }}
                    initial={{ width: "0%" }}
                    animate={{
                      width: status === "completed" ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              )}
            </div>

            {/* Vertical connector */}
            {!isLast && !isH && (
              <div
                className="ml-[15px] my-1"
                style={{
                  width: 2,
                  height: 24,
                  position: "relative",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: GRAY_BG }}
                />
                <motion.div
                  className="absolute inset-x-0 top-0 rounded-full"
                  style={{ background: BRAND }}
                  initial={{ height: "0%" }}
                  animate={{
                    height: status === "completed" ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Labels row (horizontal only — vertical labels sit beside circles) */}
      {isH && (
        <div className="sr-only">
          {steps.map((step) => (
            <span key={step.id}>
              {step.label}
              {step.description ? ` — ${step.description}` : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* Re-render the labels visibly below the stepper track in horizontal mode.
 * This is a companion component so the parent can lay things out freely. */
export function StepperLabels({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <div className="flex w-full">
      {steps.map((step, i) => {
        const status =
          i < currentStep ? "completed" : i === currentStep ? "current" : "upcoming";
        return (
          <div key={step.id} className="flex-1 text-center mt-2">
            <p
              className="text-xs font-medium leading-tight"
              style={{
                color:
                  status === "current"
                    ? BRAND
                    : status === "completed"
                      ? "var(--dl-text-primary, #1B2030)"
                      : GRAY,
              }}
            >
              {step.label}
            </p>
            {step.description && (
              <p
                className="text-[11px] mt-0.5 leading-tight"
                style={{ color: GRAY }}
              >
                {step.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

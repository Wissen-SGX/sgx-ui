import React from "react";

const STRIPES = [
  { color: "#0B236B", height: 32, delay: "0s" },
  { color: "#0094B3", height: 44, delay: "0.15s" },
  { color: "#A4DD36", height: 52, delay: "0.3s" },
  { color: "#0094B3", height: 44, delay: "0.45s" },
  { color: "#0B236B", height: 32, delay: "0.6s" },
];

const STRIPE_WIDTH = 8;
const STRIPE_GAP = 5;
const MAX_HEIGHT = 52;

const SVG_WIDTH =
  STRIPES.length * STRIPE_WIDTH + (STRIPES.length - 1) * STRIPE_GAP;

export interface SgxLogoSpinnerProps {
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

const SgxLogoSpinner: React.FC<SgxLogoSpinnerProps> = ({
  message = "Loading",
  fullscreen = false,
  className = "",
}) => {
  return (
    <div
      className={`${
        fullscreen ? "min-h-screen py-12" : ""
      } flex items-center justify-center ${className}`.trim()}
    >
      <div className="flex flex-col items-center gap-3" style={{ flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        {/* Animated stripe logo */}
        <svg
          width={SVG_WIDTH}
          height={MAX_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${MAX_HEIGHT}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Loading"
          role="status"
        >
          <style>
            {`
              @keyframes sgx-stripe-pulse {
                0%, 100% { transform: scaleY(0.35); }
                50% { transform: scaleY(1); }
              }
            `}
          </style>

          {STRIPES.map((stripe, i) => {
            const x = i * (STRIPE_WIDTH + STRIPE_GAP);
            const y = MAX_HEIGHT - stripe.height;

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={STRIPE_WIDTH}
                height={stripe.height}
                rx={STRIPE_WIDTH / 2}
                fill={stripe.color}
                style={{
                  transformOrigin: `${x + STRIPE_WIDTH / 2}px ${MAX_HEIGHT}px`,
                  animation: `sgx-stripe-pulse 1.1s linear ${stripe.delay} infinite`,
                }}
              />
            );
          })}
        </svg>

        {/* Loading label */}
        {message && (
          <p className="text-sm font-medium tracking-wide text-sgx-blue select-none">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SgxLogoSpinner;

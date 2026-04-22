import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isFading?: boolean;
}

export default function LoadingScreen({
  isFading = false,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger mount animation
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // Slower progress animation to match longer loading time
        const increment = Math.max(0.5, Math.floor((100 - prev) / 12));
        return Math.min(prev + increment, isFading ? 100 : 95);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [isFading]);

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-400 ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#0a1628" }}
    >
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-emerald-900/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle glow effects - optimized for performance */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%)",
          top: "20%",
          left: "20%",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)",
          bottom: "20%",
          right: "20%",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease-out 0.1s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo */}
        <div
          className="mb-12"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.4s ease-out",
          }}
        >
          <SGXLogo className="w-48 sm:w-64 md:w-72 h-auto" animate={mounted} />
        </div>

        {/* Spinner */}
        <div
          className="relative mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.4s ease-out 0.1s",
          }}
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 56 56">
            <defs>
              <linearGradient
                id="spinner-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#a4dd36" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Background track */}
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3"
            />
            {/* Animated arc */}
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="url(#spinner-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="90 60"
              style={{
                animation: "spin 1.2s linear infinite",
                transformOrigin: "center",
              }}
            />
          </svg>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2 h-2 rounded-full bg-[#a4dd36]"
              style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Text */}
        <div
          className="text-center mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.4s ease-out 0.15s",
          }}
        >
          <h2 className="text-white text-base sm:text-lg font-semibold tracking-wide mb-1">
            SGX Index Studio
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">Initializing...</p>
        </div>

        {/* Progress bar */}
        <div
          className="w-44 sm:w-56"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.4s ease-out 0.2s",
          }}
        >
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #a4dd36, #22c55e)",
              }}
            />
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-2">
            {progress < 100 ? "Loading resources..." : "Ready"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.4s ease-out 0.25s",
        }}
      >
        <p className="text-slate-600 text-[10px] sm:text-xs">
          © 2025 Singapore Exchange Limited
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}

function SGXLogo({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1151.55 210.53"
      className={className}
    >
      <defs>
        <clipPath id="stripe-clip">
          <rect width="157.63" height="167.29" x="36.37" y="36.37" />
        </clipPath>
      </defs>

      <g transform="translate(-31.51 -31.51)">
        {/* SGX Text */}
        <g
          style={{
            opacity: animate ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.3s",
          }}
        >
          <path
            d="M341.55,144.8q0,23.47-17.41,37.65T278,196.62a104.06,104.06,0,0,1-52.45-13.94l11.54-24.12q23.66,12.34,42.28,12.34,27,0,27-21c0-9.63-6.69-16.25-20.14-19.93l-17-4.65c-14.72-4-24.88-10.51-30.32-19.51a44.24,44.24,0,0,1-6.44-23.47c0-14,5.09-25.52,15.38-34.33s23.5-13.28,39.8-13.28q29.85,0,51.35,15.47L324.4,72.35c-13-7.82-25-11.74-35.88-11.74q-9.56,0-15.53,5a15.77,15.77,0,0,0-6,12.72c0,4,1.24,7.11,3.76,9.41s6.94,4.32,13.31,6.09L302.61,99Q341.56,109.6,341.55,144.8Z"
            fill="#ffffff"
          />
          <path
            d="M473,182a100.42,100.42,0,0,1-52.13,14q-34.83,0-53.53-24-16.72-21.41-16.71-54.88,0-49.41,32.75-71.35c11-7.36,23.71-11.09,38.15-11.09q29.13,0,49.93,18.13L454.7,72.49c-9.92-8.11-20.89-12.21-32.74-12.21-9.48,0-17,2.68-22.59,7.9Q386.1,81.1,386.05,118.79q0,33.18,11.7,44.72,9,8.81,24.66,8.82a38.63,38.63,0,0,0,17.83-3.84V132.8H416.32L412.21,107H473Z"
            fill="#ffffff"
          />
          <path
            d="M611,193.27H573.62L545.93,139l-27.47,54.23H479.92l48.28-82.38L486.58,39.37h37.88L545.23,80.8l21.08-41.43h37L563.23,108.9Z"
            fill="#ffffff"
          />
        </g>

        {/* Icon background */}
        <rect
          width="167.35"
          height="167.29"
          transform="translate(31.51 31.51)"
          fill="#ffffff"
        />

        {/* Icon stripes */}
        <g clipPath="url(#stripe-clip)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              width="157.63"
              height="31.51"
              x="36.37"
              y={36.37 + i * 31.51}
              fill={i % 2 === 0 ? "#a4dd36" : "#0b236b"}
              style={{
                transform: animate ? "translateX(0)" : "translateX(-100%)",
                transition: `transform 0.4s ease-out ${i * 0.06}s`,
              }}
            />
          ))}
        </g>

        {/* Group text */}
        <g
          style={{
            opacity: animate ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.4s",
          }}
        >
          <path
            d="M744.38,50.4l-8.52,11.75C723,53.4,713.75,49.94,701.54,49.94c-18.42,0-32.93,8.52-39.38,26.71q-6.21,17.63-6.22,40.08c0,20.72,3.92,37.53,11.06,47.89s23.26,16.82,38.23,16.82c9.9,0,18.42-2.08,25.1-6.22V127.09H698.55l-3.69-15.66h53.2v73.69c-11.29,7.37-28.33,12-44.45,12-19.8,0-36.61-6.91-48.59-19.81-13.36-14.51-19.57-34.08-19.57-61.26,0-30.16,7.83-51.81,24.41-66.32,11.28-10.13,24.87-15,41.22-15C717.89,34.74,732.4,40,744.38,50.4Z"
            fill="#ffffff"
          />
          <path
            d="M770.87,81.26l18-4.84c2.76,6,3.91,9.45,3.91,17v1.62C801,83.33,813.24,76,825,76a21.43,21.43,0,0,1,6.22,1.16l-7.37,19.57a13.92,13.92,0,0,0-5.07-.92,27.32,27.32,0,0,0-19.11,8.29c-5.29,5.29-6.67,8.75-6.67,18.19V194.1H775V106.59C775,93.46,774.09,88.63,770.87,81.26Z"
            fill="#ffffff"
          />
          <path
            d="M886.93,76.89c19.11,0,31.55,8.74,39.38,20,7.13,10.36,10.59,24,10.59,42.6,0,22.34-5.3,36.39-18,47.44-9,7.83-18.42,11-31.31,11-30.63,0-49.52-23.25-49.52-61C838.1,99.68,856.76,76.89,886.93,76.89Zm-.23,14.74c-10.14,0-19.35,5.06-23.49,12.43-3.69,7.14-5.53,16.35-5.53,29.94,0,16.12,2.76,30.4,7.14,37.53,4.14,6.91,13.36,11.52,23.26,11.52,12,0,21-6.22,24.87-17.27,2.53-7.14,3.45-13.59,3.45-24.88,0-16.11-1.61-26.94-5.29-34.54C906.27,96.23,896.14,91.63,886.7,91.63Z"
            fill="#ffffff"
          />
          <path
            d="M968,80.34l17.73-3.45v82.44c0,11.28,1.38,15.43,6.68,18.88a26.81,26.81,0,0,0,14.27,4.38c11.29,0,23-8.29,29.25-20.73V80.57l17.74-3v81.3c0,13.12.45,17,2.76,21.42,1.15,2.53,2.07,3.68,5.07,6.44L1050,198.94c-7.6-6.22-10.82-10.82-12.43-18.43-8.76,11.75-20.73,17.5-36.39,17.5-14.51,0-25.79-6-30.17-16.34-2.07-4.38-3-10.37-3-17Z"
            fill="#ffffff"
          />
          <path
            d="M1086.11,79.65l18.65-3.23a75.735,75.735,0,0,1,1.16,14.51v3c9.44-11.06,21.18-16.81,33.85-16.81a40.34,40.34,0,0,1,30.63,14.27c8.52,10.6,12.66,24.64,12.66,45.14,0,18.42-2.76,29-9.21,39.61-8.29,13.36-20.49,21-35.46,21a44.83,44.83,0,0,1-31.55-13.36v54.81l-18,3.45V107.28C1088.87,94.62,1088,85.18,1086.11,79.65Zm20.73,87.51c8.52,9.67,18.42,15,28.09,15,10.6,0,20.27-5.75,24.18-14.27,3.46-7.37,4.84-16.12,4.84-29,0-13.81-1.84-26.25-5.3-32.93-3.68-7.83-12-12.66-21.18-12.66-11.52,0-21.88,5.52-30.63,16.11Z"
            fill="#ffffff"
          />
        </g>
      </g>
    </svg>
  );
}

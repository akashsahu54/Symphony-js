import './IntroLogo.css';

/**
 * IntroLogo component displays an abstract SVG logo combining waveform and code elements
 * with a subtle pulse animation for the Symphony.js intro screen.
 */
export function IntroLogo() {
  return (
    <div className="intro-logo" role="presentation" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Code brackets */}
        <path
          d="M 60 50 L 40 100 L 60 150"
          stroke="#00D9FF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 140 50 L 160 100 L 140 150"
          stroke="#00D9FF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Waveform in the center */}
        <path
          d="M 70 100 Q 80 80, 90 100 T 110 100 T 130 100"
          stroke="#FF00FF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Additional waveform layer for depth */}
        <path
          d="M 75 100 Q 85 120, 95 100 T 115 100 T 125 100"
          stroke="#00D9FF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        
        {/* Center dot representing sound origin */}
        <circle
          cx="100"
          cy="100"
          r="4"
          fill="#FF00FF"
        />
      </svg>
    </div>
  );
}

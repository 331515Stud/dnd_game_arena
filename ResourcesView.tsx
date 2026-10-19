@import "tailwindcss";

@layer base {
  html,
  body {
    background: #080b11;
    color: #e2e8f0;
  }

  body {
    font-family: var(--font-sans), system-ui, sans-serif;
  }

  h1,
  h2,
  h3,
  .font-fantasy {
    font-family: var(--font-fantasy), Georgia, serif;
    letter-spacing: 0.02em;
  }

  .font-book {
    font-family: var(--font-book), Georgia, serif;
  }
}

.parchment {
  background-color: #f6ecd7;
  background-image:
    radial-gradient(ellipse at 18% 12%, rgba(255, 252, 240, 0.85) 0%, rgba(255, 252, 240, 0) 55%),
    radial-gradient(ellipse at 82% 88%, rgba(160, 116, 62, 0.16) 0%, rgba(160, 116, 62, 0) 60%),
    url("/images/parchment-bg.jpg");
  background-size: cover;
  background-position: center;
}

.dropcap::first-letter {
  font-family: var(--font-fantasy), Georgia, serif;
  float: left;
  font-size: 3.2em;
  line-height: 0.78;
  padding-right: 0.09em;
  margin-top: 0.04em;
  color: #8c3a1e;
}

@keyframes resultPop {
  0% {
    opacity: 0;
    transform: translate3d(0, 10px, 0) scale(0.92);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1.03);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

.result-pop {
  animation: resultPop 0.42s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes candleFlicker {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.candle-glow {
  animation: candleFlicker 5.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

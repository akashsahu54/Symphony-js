import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import IntroScreen from './components/IntroScreen.tsx'

const Root = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showApp, setShowApp] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Small delay to ensure intro is fully hidden before showing app
    setTimeout(() => {
      setShowApp(true);
    }, 50);
  };

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      {showApp && (
        <div className="app-container fade-in">
          <App />
        </div>
      )}
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

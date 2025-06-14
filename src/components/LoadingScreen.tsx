import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  backgroundImage: string;
  logoImage: string;
}

const LoadingScreen = ({ onComplete, backgroundImage, logoImage }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 1;
        return nextProgress > 100 ? 100 : nextProgress;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div 
      className="fixed inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute bottom-[30%] left-0 right-0 flex flex-col items-center px-4">
        {/* Logo with bounce animation */}
        <img 
          src={logoImage} 
          alt="WhosThat Logo" 
          className="w-[70%] max-w-[220px] mb-8 animate-bounce" 
          style={{ 
            animationDuration: '2s',
            animationTimingFunction: 'cubic-bezier(0.28, 0.84, 0.42, 1)'
          }}
        />

        {/* Loading Bar with custom colors */}
        <div className="w-full max-w-md h-2.5 bg-gray-200 bg-opacity-20 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(to right, #021833, #4C5199)',
            }}
          />
        </div>

        {/* Loading Percentage Text */}
        <p className="text-white text-sm font-mono drop-shadow-md">
          Loading... {progress}%
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
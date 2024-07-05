import React, { useEffect, useState } from 'react';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 2;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background transition-colors duration-300">
      <div className="w-full max-w-md p-6 text-center">
        <h1 className="text-3xl font-bold mb-4 animate-fade-in">
          Iniciando el sistema...
        </h1>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-foreground">
            <div 
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-primary transition-all duration-300 ease-out"
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 animate-pulse">
          Estamos reactivando el servidor. Esto podría tomar hasta un minuto.
        </p>
        <div className="mt-8 flex justify-center space-x-3">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
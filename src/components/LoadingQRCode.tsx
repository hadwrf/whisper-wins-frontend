'use client';

import { useEffect, useState } from 'react';

const LoadingQRCode = () => {
  const [dots, setDots] = useState<boolean[][]>([]);
  const qrSize = 22; // Size of the QR code grid

  // Initialize the grid with false (no active dots)
  useEffect(() => {
    const initDots = Array.from({ length: qrSize }, () => Array.from({ length: qrSize }, () => false));
    setDots(initDots);

    const interval = setInterval(() => {
      // Randomly change dots to create a liquid-like wave movement
      setDots((prev) =>
        prev.map((row) =>
          row.map(() => {
            // Simulate fluid movement by changing states randomly
            const randomChance = Math.random();
            return randomChance > 0.5;
          }),
        ),
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex items-center justify-items-center'>
      <div className='relative'>
        <div
          className='grid'
          style={{ gridTemplateColumns: `repeat(${qrSize}, 1fr)`, gridTemplateRows: `repeat(${qrSize}, 1fr)` }}
        >
          {dots.map((row, rowIndex) =>
            row.map((dot, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`size-4 ${dot ? 'bg-indigo-950' : 'bg-transparent'} transition-all duration-300`}
                style={{
                  gridColumn: colIndex + 1,
                  gridRow: rowIndex + 1,
                  opacity: dot ? 1 : 0.2, // Fluid-like fading effect
                  transform: `scale(${dot ? 1.1 : 1})`, // Simulating a fluid wave with scaling
                }}
              ></div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingQRCode;

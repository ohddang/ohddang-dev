import React, { useState, useEffect, useRef } from "react";

const Contact = () => {
  // const [threshold, setThreshold] = useState<number>(128);
  const threshold = useRef<number>(128);
  const mosaicSize = useRef<number>(10);
  const incrMosaicSize = useRef<number>(10);
  const waveOffset = useRef<number>(0);

  const outlineCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const mosaicCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const waveCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [waveCenter, setWaveCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTimer = useRef<number>(0);

  const handleOutlineMouseOut = (e: React.MouseEvent) => {
    cancelAnimationFrame(handleTimer.current);
    threshold.current = 128;
    drawOutline();
  };

  const handleOutlineMouseOver = (e: React.MouseEvent) => {
    const updateThreshold = () => {
      threshold.current = (threshold.current + 0.5) % 129;
      drawOutline();
      handleTimer.current = requestAnimationFrame(updateThreshold);
    };
    handleTimer.current = requestAnimationFrame(updateThreshold);
  };

  const handleMosaicMouseOut = (e: React.MouseEvent) => {
    cancelAnimationFrame(handleTimer.current);
    mosaicSize.current = 10;
    drawMosaic();
  };

  const handleMosaicMouseOver = (e: React.MouseEvent) => {
    const updateMosaicSize = () => {
      incrMosaicSize.current = Math.max(1, (incrMosaicSize.current + 0.1) % 21);
      mosaicSize.current = Math.floor(incrMosaicSize.current);
      drawMosaic();
      handleTimer.current = requestAnimationFrame(updateMosaicSize);
    };
    handleTimer.current = requestAnimationFrame(updateMosaicSize);
  };

  const handleWaveMouseOut = (e: React.MouseEvent) => {
    cancelAnimationFrame(handleTimer.current);
    waveOffset.current = 0;
    drawWave();
  };

  const handleWaveMouseOver = (e: React.MouseEvent) => {
    const updateWave = () => {
      waveOffset.current = waveOffset.current + 1;
      drawWave();
      handleTimer.current = requestAnimationFrame(updateWave);
    };
    handleTimer.current = requestAnimationFrame(updateWave);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (waveCanvasRef.current) {
      const rect = waveCanvasRef.current.getBoundingClientRect();
      setWaveCenter({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      cancelAnimationFrame(handleTimer.current);
      const updateWaveCenter = () => {
        waveOffset.current = waveOffset.current + 1;
        drawWave({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
        handleTimer.current = requestAnimationFrame(updateWaveCenter);
      };
      handleTimer.current = requestAnimationFrame(updateWaveCenter);
    }
  };

  // circular wave
  const drawWave = (centerRatio: { x: number; y: number } = { x: 0.5, y: 0.5 }) => {
    const image = new Image();
    image.src = "images/509.png";

    const amplitude = 3;
    const speed = 2.5;

    if (waveCanvasRef.current) {
      const waveCanvas = waveCanvasRef.current;
      const waveCtx = waveCanvas.getContext("2d");
      if (waveCtx) {
        waveCtx.drawImage(image, 0, 0, waveCanvas.width, waveCanvas.height);
        const imageData = waveCtx.getImageData(0, 0, waveCanvas.width, waveCanvas.height);
        const data = imageData.data;
        const { x: centerX, y: centerY } = { x: waveCanvas.width * centerRatio.x, y: waveCanvas.height * centerRatio.y };

        for (let y = 0; y < waveCanvas.height; y++) {
          for (let x = 0; x < waveCanvas.width; x++) {
            const index = (y * waveCanvas.width + x) * 4;
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const wave = Math.sin((distance * amplitude - waveOffset.current * speed) * 0.1) * 10;
            const newX = Math.min(waveCanvas.width - 1, Math.max(0, x + wave));
            const newY = Math.min(waveCanvas.height - 1, Math.max(0, y + wave));
            const newIndex = (Math.floor(newY) * waveCanvas.width + Math.floor(newX)) * 4;

            data[index] = data[newIndex];
            data[index + 1] = data[newIndex + 1];
            data[index + 2] = data[newIndex + 2];
          }
        }

        waveCtx.putImageData(imageData, 0, 0);
      }
    }
  };

  const drawMosaic = () => {
    const image = new Image();
    image.src = "images/509.png";

    if (mosaicCanvasRef.current) {
      const mosaicCanvas = mosaicCanvasRef.current;
      const mosaicCtx = mosaicCanvas.getContext("2d");
      if (mosaicCtx) {
        mosaicCtx.drawImage(image, 0, 0, mosaicCanvas.width, mosaicCanvas.height);
        const imageData = mosaicCtx.getImageData(0, 0, mosaicCanvas.width, mosaicCanvas.height);
        const data = imageData.data;

        for (let y = 0; y < mosaicCanvas.height; y += mosaicSize.current) {
          for (let x = 0; x < mosaicCanvas.width; x += mosaicSize.current) {
            let r = 0,
              g = 0,
              b = 0,
              count = 0;

            for (let dy = 0; dy < mosaicSize.current; dy++) {
              for (let dx = 0; dx < mosaicSize.current; dx++) {
                const px = x + dx;
                const py = y + dy;
                if (px < mosaicCanvas.width && py < mosaicCanvas.height) {
                  const index = (py * mosaicCanvas.width + px) * 4;
                  r += data[index];
                  g += data[index + 1];
                  b += data[index + 2];
                  count++;
                }
              }
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            for (let dy = 0; dy < mosaicSize.current; dy++) {
              for (let dx = 0; dx < mosaicSize.current; dx++) {
                const px = x + dx;
                const py = y + dy;
                if (px < mosaicCanvas.width && py < mosaicCanvas.height) {
                  const index = (py * mosaicCanvas.width + px) * 4;
                  data[index] = r;
                  data[index + 1] = g;
                  data[index + 2] = b;
                }
              }
            }
          }
        }

        mosaicCtx.putImageData(imageData, 0, 0);
      }
    }
  };

  const drawOutline = () => {
    const image = new Image();
    image.src = "images/509.png";

    if (outlineCanvasRef.current) {
      const outlineCanvas = outlineCanvasRef.current;
      const outlineCtx = outlineCanvas.getContext("2d");
      if (outlineCtx) {
        outlineCtx.drawImage(image, 0, 0, outlineCanvas.width, outlineCanvas.height);
        const imageData = outlineCtx.getImageData(0, 0, outlineCanvas.width, outlineCanvas.height);
        const data = imageData.data;
        const th = threshold.current;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const avg = (r + g + b) / 3;
          if (avg > th) {
            data[i] = data[i + 1] = data[i + 2] = 255;
          } else {
            data[i] = data[i + 1] = data[i + 2] = 0;
          }
        }
        outlineCtx.putImageData(imageData, 0, 0);
      }
    }
  };

  useEffect(() => {
    drawOutline();
    drawMosaic();
    drawWave();
  }, []);

  console.log("debug", 13 & 1);
  console.log("debug", 13 & 2);
  console.log("debug", 13 & 4);
  console.log("debug", 13 & 8);

  // use offscreen canvas
  // 물결 효과
  return (
    <section id="contact" className="relative h-screen bg-mono-gray-900 flex flex-row justify-center items-center">
      <div className="absolute top-5 left-5 w-11/12 flex flex-row justify-start">
        <div className="bg-blue-500 text-sm md:text-lg xl:text-xl 2xl:text-2xl rounded-full font-bold p-3 md:p-4 border-blue-400 border-b-4">Contact</div>
      </div>
      <div className="w-full h-full  flex flex-row">
        <div className="w-full h-full p-32">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-4/5 h-4/5 aspect-1 aspect-ratio-1/1">
            <img className="w-full h-full rounded object-fit" src="images/509.png" />
            <canvas className="w-full h-full rounded" ref={outlineCanvasRef} onMouseOver={handleOutlineMouseOver} onMouseOut={handleOutlineMouseOut}></canvas>
            <canvas className="w-full h-full rounded" ref={mosaicCanvasRef} onMouseOver={handleMosaicMouseOver} onMouseOut={handleMosaicMouseOut}></canvas>
            <canvas className="w-full h-full rounded" ref={waveCanvasRef} onMouseOver={handleWaveMouseOver} onMouseOut={handleWaveMouseOut} onMouseDown={handleMouseDown}></canvas>
          </div>
        </div>
        <div className="w-full h-full">
          <div>email</div>
          <div>phone</div>
          <div>github</div>
          <div>blog</div>
          <div>resume</div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

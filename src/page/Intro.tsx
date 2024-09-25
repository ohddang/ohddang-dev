import { useEffect, useRef, useState } from "react";

const Intro = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [color, setColor] = useState<string>("");
  const profileRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = profileRef?.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    const midX = width / 2;
    const midY = height / 2;

    const angleX = (x - midX) / midX;
    const angleY = (y - midY) / midY;

    const rotateY = angleX * 15;
    const rotateX = angleY * -15;

    element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    element.style.boxShadow = `${angleX * -5}px ${angleY * -5}px 8px 5px rgba(202, 138, 4, 1)`;
  };

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) {
        return;
      }

      setWidth(img.width);
      setHeight(img.height);

      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height).data;

      let sumR = 0,
        sumG = 0,
        sumB = 0;
      for (let w = 0; w < img.width; ++w) {
        for (let h = 0; h < img.height; ++h) {
          const index = (w + h * img.width) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          sumR += r;
          sumG += g;
          sumB += b;
        }
      }
      sumR /= data.length / 4;
      sumG /= data.length / 4;
      sumB /= data.length / 4;
      setColor(`rgb(${sumR}, ${sumG}, ${sumB})`);
    };

    img.src = "images/509.png";
    if (profileRef?.current) profileRef.current.style.boxShadow = `0 0 10px 5px rgba(202, 138, 4, 1)`;

    return () => {
      img.onload = null;
    };
  }, []);

  return (
    <div className="h-[calc(120vh)] bg-black/90">
      <div className="relative flex flex-row gap-5 justify-center">
        <svg className="absolute w-full h-full mt-10" viewBox="0 0 1440 320">
          <line x1="0" y1="0" x2="1440" y2="320" stroke="rgba(202, 138, 4, 1)" strokeWidth="2" />
          <line x1="0" y1="250" x2="1440" y2="0" stroke="rgba(202, 138, 4, 1)" strokeWidth="2" />
          <circle cx="0" cy="250" r="5" fill="rgba(202, 138, 4, 1)" />
        </svg>
        <div className="w-96 h-96 rounded-full overflow-hidden z-10" ref={profileRef} onMouseMove={handleMouseMove}>
          <img className="w-full h-full" src="images/509.png" alt="509" />
        </div>
        <div>
          <p>Frontend</p>
          <p>Canvas</p>
          <p>3D</p>
          <p>AI</p>
          <p>Stock</p>
        </div>
      </div>
    </div>
  );
};

export default Intro;

import React, { Suspense, useEffect, useRef, useState } from "react";

interface CardProps {
  url: string;
}

export const Card = (props: CardProps) => {
  const cardRef = useRef<HTMLImageElement>(null);
  const [bgColor, setBgColor] = useState<string>("");
  const [darkColor, setDarkColor] = useState<string>("");

  const onMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = cardRef?.current;
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
    element.style.boxShadow = `${angleX * -3}px ${angleY * -3}px 1px 1px ${darkColor}`;
  };

  const onMouseOut = () => {
    const element = cardRef?.current;
    if (!element) return;

    element.style.transform = `rotateX(0deg) rotateY(0deg)`;
    element.style.boxShadow = `1px 1px 1px 1px rgba(0, 0, 0, 0.1)`;
  };

  useEffect(() => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) {
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0,
        g = 0,
        b = 0,
        a = 0;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) {
          r += 255;
          g += 255;
          b += 255;
          a += data[i + 3];
        } else {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
        }
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));
      a = Math.floor(a / (data.length / 4));
      setBgColor(`rgb(${r},${g},${b})`);
      setDarkColor(`rgb(${r * 0.7},${g * 0.7},${b * 0.7})`);
    };
    img.src = props.url;
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        ref={cardRef}
        style={{ backgroundColor: `${bgColor}` }}
        className={`relative w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 xl:w-14 xl:h-14 bg-white rounded-md xl:rounded-lg shadow-md flex justify-center items-center `}
        onMouseMove={onMouseOver}
        onMouseOut={onMouseOut}>
        <img className={` absolute  rounded w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 xl:w-11 xl:h-11`} src={props.url} />
      </div>
    </div>
  );
};

interface CardGroupProps {
  title: string;
  children: React.ReactNode;
}

export const CardGroup = (props: CardGroupProps) => {
  return (
    <div className="relative flex flex-col justify-start flex-wrap gap-1 sm:gap-2 bg-gradient-to-tr from-mono-gray-950 to-mono-gray-850 rounded-md border border-gray-600 p-1 sm:p-2">
      <div className="w-full bg-mono-gray-950 text-xs sm:text-sm xl:text-xl font-notoSans font-bold text-center rounded-md border border-gray-500 p-2">
        <p>{props.title}</p>
      </div>
      <div className="flex flex-row justify-start flex-wrap gap-1 sm:gap-3 xl:gap-5 p-1 sm:p-2 mt-1">{props.children}</div>
    </div>
  );
};

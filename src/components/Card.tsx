import { useEffect, useRef, useState } from "react";

interface CardProps {
  url: string;
}

export default function Card(props: CardProps) {
  const cardRef = useRef<HTMLImageElement>(null);
  const [cardScale, setCardScale] = useState<string>("scale-0");
  const [bgColor, setBgColor] = useState<string>("");

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
    element.style.boxShadow = `${angleX * -5}px ${angleY * -5}px 1px 1px #3a6aa8`;
    // element.style.boxShadow.replace("rgb", "rgba").replace(")", ", 0.1)");
  };

  function onMouseOut() {
    const element = cardRef?.current;
    if (!element) return;

    element.style.transform = `rotateX(0deg) rotateY(0deg)`;
    element.style.boxShadow = `1px 1px 1px 1px rgba(0, 0, 0, 0.1)`;
  }

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
    };
    img.src = props.url;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCardScale("scale-100");
    }, 1000);
  }, [cardScale]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        ref={cardRef}
        style={{ backgroundColor: `${bgColor}` }}
        className={`w-20 h-20 rounded-lg shadow-md flex justify-center items-center transition-all duration-300 ${cardScale}`}
        onMouseMove={onMouseOver}
        onMouseOut={onMouseOut}
      >
        <img className="rounded w-16 h-16" src={props.url} />
      </div>
    </div>
  );
}

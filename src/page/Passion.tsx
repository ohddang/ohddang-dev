import { useEffect, useRef, useState } from "react";

const Passion = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [color, setColor] = useState<string>("");
  const profileRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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

  useEffect(() => {
    const initialPositions: { x2: number; y2: number; speed: number }[] = [];

    const animate = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const lines = svg.querySelectorAll("line");
      const circles = svg.querySelectorAll("circle");
      const texts = svg.querySelectorAll("text");

      if (initialPositions.length === 0) {
        lines.forEach((line) => {
          const x2 = parseFloat(line.getAttribute("x2") || "0");
          const y2 = parseFloat(line.getAttribute("y2") || "0");
          const speed = Math.random() * 10 + 10;
          initialPositions.push({ x2, y2, speed });
        });
      }

      lines.forEach((line, index) => {
        const { x2, y2, speed } = initialPositions[index];

        const newX2 = x2 + Math.sin(Date.now() / 1000 + index) * speed * 1.5;
        const newY2 = y2 + Math.cos(Date.now() / 1000 + index) * speed * 1.5;

        line.setAttribute("x2", newX2.toString());
        line.setAttribute("y2", newY2.toString());

        const circle = circles[index];
        circle.setAttribute("cx", newX2.toString());
        circle.setAttribute("cy", newY2.toString());

        const text = texts[index];
        text.setAttribute("x", newX2.toString());
        text.setAttribute("y", newY2.toString());
      });

      const rect1 = svg.querySelector("#rect1");
      const rect2 = svg.querySelector("#rect2");

      const time = Date.now() / 1000;
      const scale = 1.05 + 0.05 * Math.sin(time);

      if (rect1) {
        rect1.setAttribute("width", `${50 * scale}%`);
        rect1.setAttribute("height", `${50 * scale}%`);
        rect1.setAttribute("x", `${25 + 25 * (1 - scale)}%`);
        rect1.setAttribute("y", `${25 + 25 * (1 - scale)}%`);
      }
      if (rect2) {
        rect2.setAttribute("width", `${50 * scale}%`);
        rect2.setAttribute("height", `${50 * scale}%`);
        rect2.setAttribute("x", `${25 + 25 * (1 - scale)}%`);
        rect2.setAttribute("y", `${25 + 25 * (1 - scale)}%`);
      }

      requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const grad1 = svg.querySelector("#grad1");
      const grad2 = svg.querySelector("#grad2");

      const scrollPosition = window.scrollY;
      const angle = scrollPosition / 500;

      if (grad1) {
        const fx = 50 + 22 * Math.cos(angle);
        const fy = 50 + 22 * Math.sin(angle);
        grad1.setAttribute("fx", `${fx}%`);
        grad1.setAttribute("fy", `${fy}%`);
      }
      if (grad2) {
        const fx = 50 - 22 * Math.cos(angle);
        const fy = 50 - 22 * Math.sin(angle);
        grad2.setAttribute("fx", `${fx}%`);
        grad2.setAttribute("fy", `${fy}%`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative h-[calc(120vh)] bg-mono-gray-900">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1000 1000" ref={svgRef}>
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="rgba(202, 138, 4, 0.8)" />
          </filter>
          <radialGradient id="grad1" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="25%" style={{ stopColor: "rgb(202, 138, 4)", stopOpacity: 0.15 }} />
            <stop offset="60%" style={{ stopColor: "rgb(255, 255, 255)", stopOpacity: 0.0 }} />
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="25%" style={{ stopColor: "rgb(0, 110, 255)", stopOpacity: 0.15 }} />
            <stop offset="60%" style={{ stopColor: "rgb(255, 255, 255)", stopOpacity: 0.0 }} />
          </radialGradient>
        </defs>

        <rect id="rect1" width="50%" height="50%" x="25%" y="25%" fill="url(#grad1)" filter="url(#shadow)" />
        <rect id="rect2" width="50%" height="50%" x="25%" y="25%" fill="url(#grad2)" filter="url(#shadow)" />

        <line x1="500" y1="500" x2="500" y2="250" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="500" cy="250" r="30" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" style={{ cursor: "pointer" }} filter="url(#shadow)" />
        <text x="500" y="250" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          AI
        </text>

        <line x1="500" y1="500" x2="200" y2="650" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="200" cy="650" r="40" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <text x="200" y="650" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          3D
        </text>

        <line x1="500" y1="500" x2="100" y2="500" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="100" cy="500" r="40" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <text x="100" y="500" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          AWS
        </text>

        <line x1="500" y1="500" x2="300" y2="300" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="300" cy="300" r="70" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <text x="300" y="300" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          FrontEnd
        </text>

        <line x1="500" y1="500" x2="800" y2="250" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="800" cy="250" r="70" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <text x="800" y="250" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          Javascript
        </text>

        <line x1="500" y1="500" x2="850" y2="700" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="850" cy="700" r="60" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <text x="850" y="700" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          Canvas
        </text>

        <line x1="500" y1="500" x2="850" y2="500" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="850" cy="500" r="35" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <text x="850" y="500" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          Golang
        </text>

        <line x1="500" y1="500" x2="550" y2="750" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <circle cx="550" cy="750" r="40" fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
        <text x="550" y="750" fill="rgb(202, 138, 4)" fontSize="16" textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
          Stock
        </text>
      </svg>
      <div className="relative flex flex-row gap-5 justify-center">
        <div className="w-96 h-96 rounded-full overflow-hidden z-1" ref={profileRef} onMouseMove={handleMouseMove}>
          <img className="w-full h-full" src="images/509.png" alt="509" />
        </div>
      </div>
    </div>
  );
};

export default Passion;

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const Passion = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const profileWrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [disapper, setDisapper] = useState<boolean>(false);

  const LineCircleText = ({ x1, y1, x2, y2, r, text, fontSize }: { x1: string; y1: string; x2: string; y2: string; r: string; text: string; fontSize: string }) => (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
      <circle cx={x2} cy={y2} r={r} fill="#222" stroke="rgba(202, 138, 4, 1)" strokeWidth="3" filter="url(#shadow)" />
      <text x={x2} y={y2} fill="rgb(202, 138, 4)" fontSize={fontSize} textAnchor="middle" dominantBaseline="middle" filter="url(#shadow)">
        {text}
      </text>
    </>
  );

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
    setDisapper(true);
  }, []);

  useEffect(() => {
    const initialPositions: { x2: number; y2: number; speed: number }[] = [];
    const svg = svgRef.current;
    if (!svg) return;

    const createStar = (cx: number, cy: number, r: number, duration: number) => {
      const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      star.setAttribute("cx", cx.toString());
      star.setAttribute("cy", cy.toString());
      star.setAttribute("r", r.toString());
      star.setAttribute("fill", "white");

      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animate.setAttribute("attributeName", "opacity");
      animate.setAttribute("values", "0;1;0");
      animate.setAttribute("dur", `${duration}s`);
      animate.setAttribute("repeatCount", "indefinite");

      star.appendChild(animate);
      return star;
    };

    const starGroup = svg.querySelector("#star-group");
    if (starGroup) {
      for (let i = 0; i < 20; i++) {
        const cx = Math.random() * 1000;
        const cy = Math.random() * 1000;
        const r = Math.random() * 2 + 0.5; // 반지름을 2에서 5 사이로 설정
        const duration = Math.random() * 3 + 1; // 지속 시간을 1에서 4초 사이로 설정
        const star = createStar(cx, cy, r, duration);
        starGroup.appendChild(star);
      }
    }

    const animate = () => {
      const floatingGroup = svg.querySelector("#floating-group");
      if (!floatingGroup) return;

      const lines = floatingGroup.querySelectorAll("line");
      const circles = floatingGroup.querySelectorAll("circle");
      const texts = floatingGroup.querySelectorAll("text");

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

      const rect1 = floatingGroup.querySelector("#rect1");
      const rect2 = floatingGroup.querySelector("#rect2");

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

    const initGradient = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const grad1 = svg.querySelector("#grad1");
      const grad2 = svg.querySelector("#grad2");

      if (grad1) {
        const fx = 50 + 22 * Math.cos(0);
        const fy = 50 + 22 * Math.sin(0);
        grad1.setAttribute("fx", `${fx}%`);
        grad1.setAttribute("fy", `${fy}%`);
      }
      if (grad2) {
        const fx = 50 - 22 * Math.cos(0);
        const fy = 50 - 22 * Math.sin(0);
        grad2.setAttribute("fx", `${fx}%`);
        grad2.setAttribute("fy", `${fy}%`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    requestAnimationFrame(animate);
    initGradient();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        let size = Math.min(entry.contentRect.width, entry.contentRect.height);
        size = Math.min(250, size / 4);

        profileRef.current?.style.setProperty("width", `${size}px`);
        profileRef.current?.style.setProperty("height", `${size}px`);
      }
    });
    if (profileWrapperRef.current) {
      resizeObserver.observe(profileWrapperRef.current);
    }

    return () => {
      if (profileWrapperRef.current) {
        resizeObserver.unobserve(profileWrapperRef.current);
      }
    };
  }, []);

  return (
    <div id="passion" className="relative h-screen bg-mono-gray-900">
      <div className={`w-full h-full flex flex-row transition-transform duration-500 ${disapper ? "scale-100" : "scale-0"}`}>
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

          <g id="star-group"></g>

          <g id="floating-group">
            <rect id="rect1" width="50%" height="50%" x="25%" y="25%" fill="url(#grad1)" filter="url(#shadow)" />
            <rect id="rect2" width="50%" height="50%" x="25%" y="25%" fill="url(#grad2)" filter="url(#shadow)" />

            <LineCircleText x1="500" y1="500" x2="500" y2="250" r="30" text="AI" fontSize="16" />
            <LineCircleText x1="500" y1="500" x2="200" y2="650" r="40" text="3D" fontSize="16" />
            <LineCircleText x1="500" y1="500" x2="150" y2="480" r="40" text="AWS" fontSize="16" />
            <LineCircleText x1="500" y1="500" x2="300" y2="300" r="70" text="FrontEnd" fontSize="16" />
            <LineCircleText x1="500" y1="500" x2="800" y2="250" r="70" text="Javascript" fontSize="16" />
            <LineCircleText x1="500" y1="500" x2="850" y2="700" r="60" text="Canvas" fontSize="16" />
            <LineCircleText x1="500" y1="500" x2="850" y2="500" r="35" text="Golang" fontSize="16" />
            <LineCircleText x1="500" y1="500" x2="550" y2="750" r="40" text="Stock" fontSize="16" />
          </g>
        </svg>

        <div className="relative w-full h-full flex flex-row gap-5 justify-center items-center" ref={profileWrapperRef}>
          <div className="rounded-full overflow-hidden z-1" ref={profileRef} onMouseMove={handleMouseMove}>
            <img className="w-full h-full" src="images/509.png" alt="509" />
          </div>
        </div>
        <div className="hidden 2xl:flex gap-1 absolute top-1/4 left-32 text-black text-3xl text-center font-extrabold rounded transform flex-col animate-swing">
          <p className="bg-white shadow-md shadow-mono-gray-100 p-3 rounded">My Interests</p>
          <p className="bg-white -scale-y-100 opacity-10 p-3 rounded">My Interests</p>
        </div>

        <div className="hidden 2xl:flex gap-1 absolute top-3/4 right-32 text-black text-3xl text-center font-extrabold rounded transform flex-col animate-swing-inverse">
          <p className="bg-white shadow-md shadow-mono-gray-100 p-3 rounded">My Interests</p>
          <p className="bg-white -scale-y-100 opacity-10 p-3 rounded">My Interests</p>
        </div>
      </div>
    </div>
  );
};

export default Passion;

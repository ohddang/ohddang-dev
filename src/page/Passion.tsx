import { useEffect, useLayoutEffect, useRef, useState } from "react";

const Passion = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const profileWrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [disapper, setDisapper] = useState<boolean>(false);

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
      <div className={`w-full h-full transition-transform duration-500 ${disapper ? "scale-100" : "scale-0"}`}>
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
          </g>
        </svg>
        <div className="relative w-full h-full flex flex-row gap-5 justify-center items-center" ref={profileWrapperRef}>
          <div className="rounded-full overflow-hidden z-1" ref={profileRef} onMouseMove={handleMouseMove}>
            <img className="w-full h-full" src="images/509.png" alt="509" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passion;

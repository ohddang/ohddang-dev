import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ToolSVG from "../assets/tool.svg?react";
import PassionSVG from "../assets/fire.svg?react";
import ProjectsSVG from "../assets/projects.svg?react";
import ExperienceSVG from "../assets/experience.svg?react";

const Nav = () => {
  const { pathname, hash } = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [isRoundedFull, setIsRoundedFull] = useState<boolean>(false);
  const [resizable, setResizable] = useState<boolean>(false);
  const [scaleUp, setScaleUp] = useState<boolean>(window.innerWidth > 1279);
  const [hide, setHide] = useState<boolean>(false);

  const handleMouseOver = (e: React.MouseEvent, className: string) => {
    const target = e.target as HTMLElement;
    if (target.parentElement?.firstChild) {
      const svgComponent = target.parentElement.firstChild as SVGSVGElement;
      svgComponent.classList.add(className);
    }
  };

  const handleMouseOut = (e: React.MouseEvent, className: string) => {
    const target = e.target as HTMLElement;
    if (target.parentElement?.firstChild) {
      const svgComponent = target.parentElement.firstChild as SVGSVGElement;
      svgComponent.classList.remove(className);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setScaleUp(!scaleUp);
  };

  useEffect(() => {
    navRef.current?.classList.remove("slide-down");
    setTimeout(() => {
      navRef.current?.classList.add("slide-down");
    }, 50);

    if (pathname === "/" || hash === "") {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    const soccerIcon = document.querySelector("#tool-icon");
    if (soccerIcon) {
      const paths = soccerIcon.querySelectorAll("path");
      for (let i = 0; i < paths.length; i++) {
        // console.log(soccerIcon, i, paths[i].getTotalLength());
      }
    }

    const element = document.querySelector(".color-morph-border");
    let hue = 0;

    const changeColor = () => {
      if (!element) return;

      hue += 1;
      (element as HTMLElement).style.filter = `hue-rotate(${hue}deg)`;
      if (hue >= 360) hue = 0;
      requestAnimationFrame(changeColor);
    };

    changeColor();
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        setIsRoundedFull(height <= 64); // 예시로 높이가 64px 이상일 때 rounded-full 적용
      }
    });
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => {
      if (navRef.current) {
        resizeObserver.unobserve(navRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1279) {
        setScaleUp(false);
      }

      setResizable(window.innerWidth <= 1279);
    });
    setResizable(window.innerWidth <= 1279);
  }, []);

  useLayoutEffect(() => {
    if (resizable && !scaleUp) setHide(true);
    else setHide(false);
  }, [resizable, scaleUp]);

  return (
    <div
      className={`bg-mono-gray-900 ${hide ? "scale-0" : "scale-100"} w-fit xl:w-1/2 xl:h-16 min-h-16 position: fixed top-5 left-1/2 -translate-x-1/2 ${
        isRoundedFull ? "rounded-full" : "rounded-[32px]"
      } border-transparent font-bold text-xs sm:text-sm md:text-base xl:text-lg z-10 transition-all duration-500`}
      ref={navRef}>
      <div
        className={`absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-yellow-500 ${
          isRoundedFull ? "rounded-full" : "rounded-[32px]"
        } color-morph-border p-[3px]`}></div>
      <div className={`relative w-full h-full flex flex-row justify-between items-start xl:items-center gap-1 p-2 overflow-hidden`}>
        <div className="rotate-z">
          <div className="w-12 h-12 border-[3px] border-white rounded-full bg-gradient-to-r from-purple-500 to-yellow-500 text-base text-center transition duration-300 cursor-pointer rotate-gradient">
            <div onPointerDown={handlePointerDown}>ODD</div>
          </div>
        </div>
        <div className={`flex flex-row justify-end items-center gap-2 sm:gap-3 md:gap-4 xl:gap-6 m-2 xl:mt-0 xl:mb-0 transition-all duration-500`}>
          <div className={`  flex flex-row items-center gap-2 transition-all duration-500 `}>
            <ToolSVG id="tool-icon" className={`  w-6 h-6 md:w-8 md:h-8 `} />
            <Link
              className={` underline-offset-8 hover:underline transition-all duration-500`}
              to="/garage"
              onMouseOver={(e) => handleMouseOver(e, "soccer-path")}
              onMouseOut={(e) => handleMouseOut(e, "soccer-path")}>
              Garage
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <PassionSVG id="passion-icon" className="w-6 h-6 md:w-8 md:h-8" />
            <Link
              className="underline-offset-8 hover:underline"
              to="/#passion"
              onMouseOver={(e) => handleMouseOver(e, "fire-path")}
              onMouseOut={(e) => handleMouseOut(e, "fire-path")}>
              Passion
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <ProjectsSVG id="projects-icon" className="w-6 h-6 md:w-8 md:h-8" />
            <Link
              className="underline-offset-8 hover:underline"
              to="/#projects"
              onMouseOver={(e) => handleMouseOver(e, "projects-path")}
              onMouseOut={(e) => handleMouseOut(e, "projects-path")}>
              Projects
            </Link>
          </div>
        </div>
        <div className={` xl:flex h-12  bg-blue-500 border-b-4 border-blue-400 rounded-full px-4 hover:bg-blue-600 transition-all duration-500`}>
          <Link to="/#contact">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;

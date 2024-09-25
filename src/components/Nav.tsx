import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SoccerSVG from "../assets/soccer.svg?react";
import PassionSVG from "../assets/fire.svg?react";
import ProjectsSVG from "../assets/projects.svg?react";
import ExperienceSVG from "../assets/experience.svg?react";

const Nav = () => {
  const { pathname, hash } = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    navRef.current?.classList.remove("slide-down");
    setTimeout(() => {
      navRef.current?.classList.add("slide-down");
    }, 50);
  }, [pathname, hash]);

  useEffect(() => {
    const soccerIcon = document.querySelector("#soccer-icon");
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

  return (
    <div className="bg-mono-gray-900 w-8/12 h-16 position: fixed top-5 left-1/2 -translate-x-1/2 rounded-full border-transparent font-bold text-lg z-10" ref={navRef}>
      <div className=" absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-yellow-500 rounded-full color-morph-border p-[3px]"></div>
      <div className="relative w-full h-full flex flex-row justify-between items-center p-2">
        <div className="rotate-z">
          <div className="w-12 h-12 border-[3px] border-white rounded-full bg-gradient-to-r from-purple-500 to-yellow-500 text-base text-center transition duration-300 cursor-pointer rotate-gradient">
            <Link to="/">ODD</Link>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <div className="flex flex-row items-center gap-2">
            <SoccerSVG id="soccer-icon" className="w-8 h-8" />
            <Link to="/playground" onMouseOver={(e) => handleMouseOver(e, "soccer-path")} onMouseOut={(e) => handleMouseOut(e, "soccer-path")}>
              Playground
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <PassionSVG id="passion-icon" className="w-8 h-8" />
            <Link to="/#passion" onMouseOver={(e) => handleMouseOver(e, "fire-path")} onMouseOut={(e) => handleMouseOut(e, "fire-path")}>
              Passion
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <ProjectsSVG id="projects-icon" className="w-8 h-8" />
            <Link to="/#projects" onMouseOver={(e) => handleMouseOver(e, "projects-path")} onMouseOut={(e) => handleMouseOut(e, "projects-path")}>
              Projects
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <ExperienceSVG id="experience-icon" className="w-8 h-8" />
            <Link to="/#experience" onMouseOver={(e) => handleMouseOver(e, "experience-path")} onMouseOut={(e) => handleMouseOut(e, "experience-path")}>
              Experience
            </Link>
          </div>
        </div>
        <div className="h-full bg-blue-500 border-r-4 border-b-4 border-blue-400 rounded-full px-4 hover:bg-blue-600">
          <Link to="/#contact">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;

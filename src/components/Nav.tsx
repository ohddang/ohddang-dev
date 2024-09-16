import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SoccerSVG from "../assets/soccer.svg?react";
import PassionSVG from "../assets/fire.svg?react";
import ProjectsSVG from "../assets/projects.svg?react";
import ExperienceSVG from "../assets/experience.svg?react";

const Nav = () => {
  const { pathname, hash } = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

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
        console.log(soccerIcon, i, paths[i].getTotalLength());
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
    <div className="bg-transparent w-8/12 h-20 position: fixed top-5 left-1/2 -translate-x-1/2 rounded-full border-4 border-transparent font-bold text-lg" ref={navRef}>
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-yellow-500 rounded-full color-morph-border p-[2px]"></div>
      <div className="relative w-full h-full flex flex-row justify-between items-center p-2">
        <div className="rotate-z">
          <div className="w-14 h-14 border-4 border-white rounded-full bg-gradient-to-r from-purple-500 to-yellow-500 text-center transition duration-300 cursor-pointer rotate-gradient">
            <Link to="/">ODD</Link>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-6 -webkit-mask-none mask-none">
          <div className="flex flex-row items-center gap-2">
            <SoccerSVG id="soccer-icon" className="w-8 h-8 cursor-pointer soccer-path" />
            <Link to="/playground">Playground</Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <PassionSVG id="passion-icon" className="w-8 h-8 cursor-pointer fire-path" />
            <Link to="/#passion">Passion</Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <ProjectsSVG id="projects-icon" className="w-8 h-8 cursor-pointer projects-path" />
            <Link to="/#projects">Projects</Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <ExperienceSVG id="experience-icon" className="w-8 h-8 cursor-pointer experience-path" />
            <Link to="/#experience">Experience</Link>
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

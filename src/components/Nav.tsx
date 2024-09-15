import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="bg-black/90 w-8/12 h-16 position: fixed top-5 left-1/2 -translate-x-1/2 rounded-full border-4 border-pink-700 text-white font-bold text-lg ">
      <div className="w-full h-full flex flex-row justify-center items-center gap-6 font-notoSans">
        <div className="flex flex-row items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <Link to="/playground">Playground</Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <Link to="/#passion">Passion</Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <Link to="/#projects">Projects</Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <Link to="/#experience">Experience</Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;

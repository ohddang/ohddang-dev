import { useLocation } from "react-router-dom";
import Contact from "./Contact";
import Experience from "./Experience";
import Intro from "./Intro";
import Passion from "./Passion";
import Projects from "./Projects";
import { useEffect } from "react";

const Home = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [hash]);

  return (
    <div>
      <Intro />
      <Passion />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
};

export default Home;

import { useLocation } from "react-router-dom";
import Contact from "./Contact";

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
      <Passion />
      <Projects />

      <Contact />
    </div>
  );
};

export default Home;

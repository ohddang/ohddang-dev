import { useEffect, useLayoutEffect, useRef, useState } from "react";
import LinkSVG from "../assets/link.svg?react";
import ArrowLeft from "../assets/arrow-left.svg?react";
import ArrowRight from "../assets/arrow-right.svg?react";
import { Card, CardGroup } from "../components/Card";

const Projects = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const itemRef = useRef<HTMLDivElement>(null);
  const itemWrapRef = useRef<HTMLDivElement>(null);
  const scrollX = useRef(0);

  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const skillRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // scroll 위치에따라 skillRef와 slideRef가 각각 왼쪽과 오른쪽에서 나타나고 사라지는 효과를 주기 위한 코드
  useEffect(() => {
    const handleScroll = () => {
      if (skillRef.current && slideRef.current) {
        if (window.scrollY >= skillRef.current.offsetTop) {
          slideRef.current.classList.add("slide-in-left");
        } else {
          slideRef.current.classList.remove("slide-in-left");
        }
      }

      if (window.scrollY >= skillRef.current!.offsetTop + 100) {
        skillRef.current!.classList.add("slide-in-right");
      } else {
        skillRef.current!.classList.remove("slide-in-right");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const projects = [
    { image: "tetris.webp", url: "https://ohddang.github.io/react-tetris/tetris" },
    { image: "whiteboard.webp", url: "https://ohddang.github.io/whiteboard" },
    { image: "pq.webp", url: "https://github.com/Codeit-part4-team3" },
    { image: "upbit.webp", url: "https://chromewebstore.google.com/detail/upbit-gazua/hnjekbfjeongcjipokedmkkjpgffpjop?hl=ko&authuser=0" },
  ];

  const calculateShowCount = () => {
    if (window.innerWidth >= 1536) {
      setShowCount(4);
    } else if (window.innerWidth >= 1024) {
      setShowCount(3);
    } else if (window.innerWidth >= 640) {
      setShowCount(2);
    } else {
      setShowCount(1);
    }
  };

  const easeInOutQuad = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const smoothScrollTo = (target: number, duration: number) => {
    const start = carouselRef.current!.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuad(progress);

      carouselRef.current!.scrollLeft = start + change * ease;

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleResize = () => {
    calculateShowCount();

    if (itemRef.current) {
      scrollX.current = itemRef.current.clientWidth;
    }
  };

  useLayoutEffect(() => {
    const hideCount = projects.length - showCount;
    setCurrentIndex((prevIndex) => (prevIndex >= hideCount ? hideCount : prevIndex));

    const prevSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
    };

    const nextSlide = () => {
      const hideCount = projects.length - showCount;

      setCurrentIndex((prevIndex) => {
        return prevIndex === hideCount ? prevIndex : prevIndex + 1;
      });
    };

    const prevButton = document.querySelector(".prev-button")!;
    const nextButton = document.querySelector(".next-button")!;

    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);
    window.addEventListener("resize", handleResize);

    return () => {
      prevButton.removeEventListener("click", prevSlide);
      nextButton.removeEventListener("click", nextSlide);
      window.removeEventListener("resize", handleResize);
    };
  }, [showCount]);

  useLayoutEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - carouselElement.offsetLeft;
      scrollLeft.current = carouselElement.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();

      const x = e.pageX - carouselElement.offsetLeft;
      const walk = x - startX.current; // Scroll-fast

      const hideCount = projects.length - showCount;
      if (scrollLeft.current - walk > hideCount * scrollX.current) return;

      carouselElement.scrollLeft = scrollLeft.current - walk;
    };

    const handleEnd = () => {
      isDragging.current = false;

      const alignIndex = Math.round(carouselElement.scrollLeft / scrollX.current);
      const alignLeft = alignIndex * scrollX.current;
      setCurrentIndex(alignIndex);
      smoothScrollTo(alignLeft, 300);
    };

    carouselElement.addEventListener("mousedown", handleMouseDown);
    carouselElement.addEventListener("mousemove", handleMouseMove);
    carouselElement.addEventListener("mouseup", handleEnd);
    carouselElement.addEventListener("mouseleave", handleEnd);
    carouselElement.addEventListener("touchend", handleEnd);

    return () => {
      carouselElement.removeEventListener("mousedown", handleMouseDown);
      carouselElement.removeEventListener("mousemove", handleMouseMove);
      carouselElement.removeEventListener("mouseup", handleEnd);
      carouselElement.removeEventListener("mouseleave", handleEnd);
      carouselElement.removeEventListener("touchend", handleEnd);
    };
  }, [showCount]);

  useEffect(() => {
    if (carouselRef.current) {
      smoothScrollTo(currentIndex * scrollX.current, 300);
    }
    const hideCount = projects.length - showCount;

    if (currentIndex === hideCount) {
      nextButtonRef.current!.classList.add("pointer-events-none");
      nextButtonRef.current!.style.opacity = "0.5";
    } else {
      nextButtonRef.current!.classList.remove("pointer-events-none");
      nextButtonRef.current!.style.opacity = "1";
    }

    if (currentIndex === 0) {
      prevButtonRef.current!.classList.add("pointer-events-none");
      prevButtonRef.current!.style.opacity = "0.5";
    } else {
      prevButtonRef.current!.classList.remove("pointer-events-none");
      prevButtonRef.current!.style.opacity = "1";
    }
  }, [currentIndex, showCount]);

  useLayoutEffect(() => {
    calculateShowCount();
    scrollX.current = itemRef.current!.clientWidth;
  }, []);

  const frontendList = ["javascript.png", "typescript.png", "react.png", "nextjs.png", "tailwind.png", "threejs.png", "pixijs.svg", "rspack.svg"];

  return (
    <section id="projects" className="relative min-h-[800px] h-screen bg-gradient-to-b from-mono-gray-950 to-mono-gray-850 aspect-w-16 aspect-h-9">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="absolute top-5 left-5 w-11/12 flex flex-row justify-start">
          <div className="bg-orange-500 text-sm md:text-lg xl:text-xl 2xl:text-2xl rounded-full font-bold p-3 md:p-4 border-orange-400 border-b-4">Projects</div>
        </div>
        <div className="w-11/12 border-b border-mono-gray-600 text-5xl font-notoSans font-bold p-12" ref={skillRef}>
          <div className="flex flex-row justify-center gap-1 sm:gap-3 xl:gap-5">
            <div className="flex flex-col justify-end items-end">
              <CardGroup title="Frontend">
                {frontendList.map((logo, index) => (
                  <Card key={index} url={`images/logo/${logo}`} />
                ))}
              </CardGroup>
            </div>
            <div className="flex flex-row-reverse justify-end flex-wrap gap-1 sm:gap-3 xl:gap-5">
              <CardGroup title="DevOps">
                <Card url="images/logo/aws.svg" />
                <Card url="images/logo/docker.png" />
              </CardGroup>
              <CardGroup title="DB">
                <Card url="images/logo/mysql.png" />
                <Card url="images/logo/prisma.svg" />
              </CardGroup>

              <CardGroup title="Backend">
                <Card url="images/logo/nodejs.svg" />
                <Card url="images/logo/nestjs.svg" />
                <Card url="images/logo/golang.png" />
              </CardGroup>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start gap-3 items-center p-12" ref={slideRef}>
          <div
            className="w-[300px] sm:w-[600px] lg:w-[900px] 2xl:w-4/5 h-auto flex flex-col justify-start items-center bg-gradient-to-tr from-mono-gray-950 to-mono-gray-850 rounded-md border border-gray-600 overflow-scroll scrollbar-hide"
            ref={carouselRef}>
            <div className={`w-full h-full  flex flex-row justify-start items-center transition-all duration-500`} ref={itemWrapRef}>
              {projects.map((project, index) => (
                <div key={index} className="pointer-events-none min-w-[300px] 2xl:min-w-[25%] w-full h-auto flex flex-col justify-center items-end p-5" ref={itemRef}>
                  <div className="w-full h-auto rounded-md overflow-hidden aspect-1">
                    <img
                      src={`images/${project.image}`}
                      className="pointer-events-auto w-full h-full  transition-all duration-500 grayscale hover:grayscale-0 hover:scale-105"
                      onDragStart={(e) => {
                        e.preventDefault();
                      }}></img>
                  </div>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="pointer-events-auto text-blue-500 underline mt-2">
                    <LinkSVG className="w-8 h-8 inline-block" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="button-group flex flex-row gap-2">
            <button className="prev-button rounded border border-white p-2 from-mono-gray-950 to-mono-gray-700 bg-transparent hover:bg-gradient-to-tr" ref={prevButtonRef}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="next-button rounded border border-white p-2 from-mono-gray-950 to-mono-gray-700 bg-transparent hover:bg-gradient-to-tr" ref={nextButtonRef}>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

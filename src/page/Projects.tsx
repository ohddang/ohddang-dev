import { useEffect, useRef, useState } from "react";
import LinkSVG from "../assets/link.svg?react";
import ArrowLeft from "../assets/arrow-left.svg?react";
import ArrowRight from "../assets/arrow-right.svg?react";
import Card from "../components/Card";

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

  const projects = [
    { image: "tetris.png", url: "https://ohddang.github.io/react-tetris/tetris" },
    { image: "whiteboard.png", url: "https://ohddang.github.io/whiteboard" },
    { image: "pq.png", url: "https://github.com/Codeit-part4-team3" },
    { image: "upbit.png", url: "https://chromewebstore.google.com/detail/upbit-gazua/hnjekbfjeongcjipokedmkkjpgffpjop?hl=ko&authuser=0" },
    { image: "tetris.png", url: "https://ohddang.github.io/react-tetris/tetris" },
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
      console.log(scrollX.current);
    }
    if (itemWrapRef.current) {
      const width = scrollX.current * showCount;
      itemWrapRef.current.style.width = `${width}px`;
    }
  };

  useEffect(() => {
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

  useEffect(() => {
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
  }, [currentIndex]);

  useEffect(() => {
    calculateShowCount();
    scrollX.current = itemRef.current!.clientWidth;
  }, []);

  // 스크롤에 따른 프로젝트 타임라인 애니메이션
  //
  // 기술스택 나열 + Pixi, Rspack
  return (
    <section id="projects" className="h-screen bg-mono-gray-950 aspect-w-16 aspect-h-9">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[300px] sm:w-[600px] lg:w-[900px] 2xl:w-[1200px] text-5xl font-notoSans font-bold mb-10">
          <p>Since 2024</p>
        </div>

        <div className="w-[300px] sm:w-[600px] lg:w-[900px] 2xl:w-[1200px] h-auto flex flex-row justify-start items-center overflow-scroll scrollbar-hide" ref={carouselRef}>
          <div className={`w-[1200px] 2xl:w-full h-fit  flex flex-row justify-start items-center transition-all duration-500`} ref={itemWrapRef}>
            {projects.map((project, index) => (
              <div key={index} className="pointer-events-none min-w-[300px] w-full h-auto flex flex-col justify-center items-end p-3" ref={itemRef}>
                <div className="w-[276px] h-[276px] rounded-md overflow-hidden">
                  <img
                    src={`images/${project.image}`}
                    className="pointer-events-auto w-full h-full  transition-all duration-500 grayscale hover:grayscale-0 hover:scale-105"
                    onDragStart={(e) => {
                      e.preventDefault();
                    }}
                  ></img>
                </div>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="pointer-events-auto text-blue-500 underline mt-2">
                  <LinkSVG className="w-8 h-8 inline-block" />
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="button-group flex flex-row gap-5 mb-36">
          <button className="prev-button">
            <ArrowLeft className="w-8 h-8 transition-transform hover:scale-125" />
          </button>
          <button className="next-button">
            <ArrowRight className="w-8 h-8 transition-transform hover:scale-125" />
          </button>
        </div>

        <div className="w-[300px] sm:w-[600px] lg:w-[900px] 2xl:w-[1200px] text-5xl font-notoSans font-bold border border-white p-5">
          <p className="mb-10">Skill</p>
          <div className="flex flex-row justify-start flex-wrap gap-5">
            <Card url="images/logo/javascript.png" />
            <Card url="images/logo/typescript.png" />
            <Card url="images/logo/react.png" />
            <Card url="images/logo/nextjs.png" />
            <Card url="images/logo/css.png" />
            <Card url="images/logo/styledComponents.png" />
            <Card url="images/logo/tailwind.png" />
            <Card url="images/logo/nodejs.svg" />
            <Card url="images/logo/aws.svg" />
            <Card url="images/logo/mysql.png" />
            <Card url="images/logo/prisma.svg" />
            <Card url="images/logo/docker.png" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

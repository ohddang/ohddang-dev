import { useEffect, useRef, useState } from "react";

const Projects = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 캐로셀 구현

  // size 300

  // 375px 이하에서는 1개
  // 680px 이하에서는 2개
  // 1024px 이하에서는 3개
  // 1279px 이하에서는 4개
  // 이후 스케일업

  // 가운데 중심으로 정렬

  // 좌우 여백이 유동적으로 변함

  const projects = ["테트리스", "화이트보드", "피큐", "업비트", "주식"];

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? projects.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === projects.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const prevButton = document.querySelector(".prev-button")!;
    const nextButton = document.querySelector(".next-button")!;

    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);

    return () => {
      prevButton.removeEventListener("click", prevSlide);
      nextButton.removeEventListener("click", nextSlide);
    };
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * 300}px)`;
    }
  }, [currentIndex]);

  return (
    <section id="projects" className="h-screen bg-mono-gray-850 aspect-w-16 aspect-h-9">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold">Projects</h2>
        <div className="w-[300px] sm:w-[640px] lg:w-[1024px] 2xl:w-[1536px] h-96 flex flex-row justify-start items-center gap-4 overflow-hidden">
          <div className="w-fit h-full bg-mono-gray-800 flex flex-row justify-center items-center transition-all duration-500" ref={carouselRef}>
            {projects.map((project, index) => (
              <div key={index} className="min-w-[300px] sm:min-w-[318px] lg:min-w-[338px] 2xl:min-w-[372px] h-96 bg-mono-gray-800 flex flex-col justify-center items-center">
                <h3 className="text-2xl font-bold">{project}</h3>
                <p className="text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptas.</p>
              </div>
            ))}
          </div>
        </div>
        <div className="button-group">
          <button className="prev-button">Prev</button>
          <button className="next-button">Next</button>
        </div>
      </div>
    </section>
  );
};

export default Projects;

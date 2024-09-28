const Projects = () => {
  // 캐로셀 구현

  const projects = ["project1", "project2", "project3", "project4", "project5"];

  return (
    <section id="projects" className="h-[calc(120vh)]  bg-mono-gray-850">
      <div className="w-full h-64 overflow-hidden p-5">
        <div className="w-fit h-full flex flex-row justify-center gap-5">
          {projects.map((project, index) => (
            <div key={index} className="w-80 h-full bg-yellow-800">
              {project}
            </div>
          ))}
        </div>
      </div>
      <div>
        <button>prev</button>
        <button>next</button>
      </div>
    </section>
  );
};

export default Projects;

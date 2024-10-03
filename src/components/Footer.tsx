const Footer = () => {
  return (
    <div className="h-24 flex flex-row justify-between p-5 bg-mono-gray-900">
      <div>©2024 ohddang</div>
      <div className="flex flex-row gap-3">
        <a href="https://github.com/ohddang" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
          <img className="w-6 h-6" src="images/logo/github.svg" alt="github" />
        </a>
        <a href="https://nth-challenge.tistory.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
          <img className="w-6 h-6" src="images/logo/blog.svg" alt="blog" />
        </a>
      </div>
    </div>
  );
};

export default Footer;

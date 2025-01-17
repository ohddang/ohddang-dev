import { lazy, Suspense } from "react";

const PolygonCollider = lazy(() => import("./PolygonCollider"));
const ThreeSlider = lazy(() => import("./ThreeSlider"));

// TODO : 3x3 puzzle game
const Garage = () => {
  return (
    <div className="min-h-[800px] h-screen flex flex-row bg-white pt-20">
      <div className="w-full h-full flex flex-row gap-10 p-10 pr-5">
        <div className="w-1/4 h-full bg-gradient-to-b from-mono-gray-100 to-mono-gray-500 rounded border-2 border-mono-gray-800"></div>
        <div className="relative w-3/4 h-full bg-gradient-to-b from-mono-gray-100 to-mono-gray-500 rounded border-2 border-mono-gray-800 ">
          <Suspense
            fallback={
              <div className="flex justify-center items-center animate-spin">
                <img className="w-20 h-20" src="images/logo/threejs.png" />
              </div>
            }>
            <ThreeSlider />
          </Suspense>
        </div>
      </div>
      <div className="min-w-[600px] w-[600px] h-full flex flex-col p-10 pl-5 gap-10">
        <div className="relative w-full h-3/4 bg-gradient-to-b from-mono-gray-100 to-mono-gray-500 rounded border-2 border-mono-gray-800">
          <Suspense
            fallback={
              <div className="flex justify-center items-center animate-spin">
                <img className="w-20 h-20" src="images/logo/pixijs.svg" />
              </div>
            }>
            <PolygonCollider />
          </Suspense>
        </div>
        <div className="w-full h-1/4 bg-gradient-to-b from-mono-gray-100 to-mono-gray-500 rounded border-2 border-mono-gray-800"></div>
      </div>
    </div>
  );
};

export default Garage;

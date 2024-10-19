import { useEffect, useRef, useState } from "react";
import { Stage, Sprite, Graphics, useTick } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js";

export default function PolygonCollider() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [targetImageUrl, setTargetImageUrl] = useState<string>("images/logo/zustand.png");
  const inputRef = useRef<HTMLInputElement>(null);
  const resizeWidth = 200;

  useEffect(() => {
    if (wrapRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          const width = entry.contentRect.width;

          setWidth(width);
          setHeight(height);
        }
      });
      resizeObserver.observe(wrapRef.current);
      setWidth(wrapRef.current.clientWidth);
      setHeight(wrapRef.current.clientHeight);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const targetImage = new Image();
    targetImage.src = targetImageUrl;
    targetImage.onload = () => {
      setImageWidth(targetImage.width);
      setImageHeight(targetImage.height);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = targetImage.width;
      canvas.height = targetImage.height;

      const scale = resizeWidth / targetImage.width;

      const translateX = width / 2 - (targetImage.width / 2) * scale;
      const translateY = height / 2 - (targetImage.height / 2) * scale;

      if (ctx) {
        ctx.drawImage(targetImage, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const threshold = 0.5; // Define your threshold here
        const points: { x: number; y: number }[] = [];

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const alpha = imageData.data[index + 3] / 255;

            if (alpha === 0) {
              const neighbors = [
                { x: x - 1, y: y },
                { x: x + 1, y: y },
                { x: x, y: y - 1 },
                { x: x, y: y + 1 },
              ];

              for (const neighbor of neighbors) {
                if (neighbor.x >= 0 && neighbor.x < canvas.width && neighbor.y >= 0 && neighbor.y < canvas.height) {
                  const neighborIndex = (neighbor.y * canvas.width + neighbor.x) * 4;
                  const neighborAlpha = imageData.data[neighborIndex + 3] / 255;

                  if (neighborAlpha > threshold) {
                    points.push({ x: x * scale + translateX, y: y * scale + translateY });
                    break;
                  }
                }
              }
            }
          }
        }

        if (points.length === 0) return;

        const polygonPoints = [{ x: points[0].x, y: points[0].y }];
        let currentPoint = points[0];
        points.splice(0, 1);

        const findNearestPoint = (currentPoint: { x: number; y: number }, points: { x: number; y: number }[]) => {
          let nearestPoint = points[0];
          let nearestDistance = Math.sqrt((currentPoint.x - nearestPoint.x) ** 2 + (currentPoint.y - nearestPoint.y) ** 2);

          for (const point of points) {
            const distance = Math.sqrt((currentPoint.x - point.x) ** 2 + (currentPoint.y - point.y) ** 2);

            if (distance < nearestDistance) {
              nearestPoint = point;
              nearestDistance = distance;
            }
          }

          return nearestPoint;
        };

        while (points.length > 0) {
          const nearestPoint = findNearestPoint(currentPoint, points);
          if (nearestPoint === currentPoint) break;

          polygonPoints.push(nearestPoint);
          currentPoint = nearestPoint;

          const index = points.indexOf(nearestPoint);
          if (index > -1) points.splice(index, 1);
        }
        setPolygonPoints(polygonPoints);

        return;
      }
    };
  }, [targetImageUrl, width, height]);

  interface triangleCollision {
    x: number;
    y: number;
    degree: number;
    dirX: number;
    dirY: number;
  }

  const randomInit = () => {
    const startSite = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    const degree = Math.random() * 360;
    const dirX = Math.cos(degree);
    const dirY = Math.sin(degree);

    if (startSite === 0) {
      x = 10;
      y = 10;
    } else if (startSite === 1) {
      x = width - 10;
      y = height - 10;
    } else if (startSite === 2) {
      x = 10;
      y = height - 10;
    } else {
      x = width - 10;
      y = 10;
    }

    return { x, y, degree, dirX, dirY };
  };

  // 다수의 삼각형 생성 및 충돌 검사
  const Collision = ({ polygonPoints }: { polygonPoints: { x: number; y: number }[] }) => {
    const [triangles, setTriangles] = useState<triangleCollision[]>([]);

    useTick(() => {
      for (let i = 0; i < triangles.length; i++) {
        const triangle = triangles[i];
        let x = triangle.x + triangle.dirX * 0.4;
        let y = triangle.y + triangle.dirY * 0.4;
        let dirX = triangle.dirX;
        let dirY = triangle.dirY;

        if (x < 0 || x > width) {
          dirX *= -1;
        }

        if (y < 0 || y > height) {
          dirY *= -1;
        }

        const hit = polygonPoints.some((point) => {
          return Math.abs(point.x - x) + Math.abs(point.y - y) < 10;
        });

        if (hit) {
          const { x: randX, y: randY, dirX: randDirX, dirY: randDirY } = randomInit();

          x = randX;
          y = randY;
          dirX = randDirX;
          dirY = randDirY;
        }

        setTriangles((prev) => {
          prev[i].x = x;
          prev[i].y = y;
          prev[i].dirX = dirX;
          prev[i].dirY = dirY;

          return [...prev];
        });
      }
    });

    useEffect(() => {
      for (let i = 0; i < 200; ++i) {
        setTriangles((prev) => [...prev, randomInit()]);
      }
    }, []);

    const drawTriangles = (g: GraphicsType) => {
      g.clear();
      g.lineStyle(2, 0x00ff00, 1);
      g.beginFill(0xff00ff, 1);

      triangles.forEach((triangle) => {
        const size = 10; // Size of the triangle
        g.moveTo(triangle.x, triangle.y);
        g.lineTo(triangle.x + size * Math.cos(triangle.degree), triangle.y + size * Math.sin(triangle.degree));
        g.lineTo(triangle.x + size * Math.cos(triangle.degree + Math.PI / 3), triangle.y + size * Math.sin(triangle.degree + Math.PI / 3));
        g.lineTo(triangle.x, triangle.y);
      });

      g.endFill();
    };

    return <Graphics draw={drawTriangles} />;
  };

  const VisualizeHitArea = ({ polygonPoints }: { polygonPoints: { x: number; y: number }[] }) => {
    const handleDraw = (g: GraphicsType) => {
      if (polygonPoints.length === 0) return;

      g.lineStyle(2, 0xff0000, 1);
      g.beginFill(0x1099bb, 0.25);
      g.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) {
        g.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }
      g.lineTo(polygonPoints[0].x, polygonPoints[0].y);
      g.endFill();
    };

    return <Graphics draw={handleDraw} />;
  };

  const handleLoadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          console.log(result);
          setTargetImageUrl(result);
          e.target.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full" ref={wrapRef}>
      <Stage className="w-full h-full" width={width} height={height} options={{ background: 0x1099bb }}>
        <Sprite image={targetImageUrl} x={width / 2} y={height / 2} width={resizeWidth} height={(imageHeight / imageWidth) * resizeWidth} anchor={[0.5, 0.5]} />
        {/* {polygonPoints && <VisualizeHitArea polygonPoints={polygonPoints} />} */}
        {polygonPoints && <Collision polygonPoints={polygonPoints} />}
      </Stage>
      <div className="absolute top-3 left-3 text-black">
        <div className="flex flex-row gap-2">
          <img className="w-8 h-8" src="images/logo/pixijs.svg" />
          <span>Polygon Collider</span>
        </div>
      </div>
      <div
        className="absolute text-sm top-3 right-3 flex flex-row text-black cursor-pointer"
        onPointerDown={() => {
          inputRef.current?.click();
        }}>
        <img className="pointer-events-none w-8 h-8" src="images/logo/loadImage.png" alt="이미지" />
        <span className="pointer-events-none">Load Image</span>

        <input className="hidden" type="file" accept="image/*" ref={inputRef} onChange={handleLoadImage} />
      </div>
    </div>
  );
}

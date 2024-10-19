import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";

interface PictureProps {
  position: THREE.Vector3;
  textureUrl: string;
}

function Picture(props: PictureProps) {
  const [texture, setTexture] = useState<THREE.Texture>();
  const [material, setMaterial] = useState<THREE.ShaderMaterial | null>(null);
  const [position, setPosition] = useState<THREE.Vector3>(props.position);
  const [lookAt, setLookAt] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 1));
  const meshRef = useRef<THREE.Mesh>(null);
  const frameCountRef = useRef(Math.floor(Math.random() * 80));
  const boundDirectionRef = useRef(1);
  const [speed, setSpeed] = useState(Math.random() * 0.001 + 0.002);

  useFrame(() => {
    if (meshRef.current) {
      if (frameCountRef.current % 80 === 0) {
        boundDirectionRef.current = boundDirectionRef.current * -1;
      }
      if (boundDirectionRef.current === 1) {
        meshRef.current.position.y += speed;
      } else {
        meshRef.current.position.y -= speed;
      }
      frameCountRef.current += 1;
      meshRef.current.lookAt(lookAt);
    }
  });

  useEffect(() => {
    if (!texture) return;

    const cameraPos = new THREE.Vector3(-15, -5, 10);

    if (Math.abs(props.position.x) < 10) {
      const delta = Math.abs(props.position.x) / 10;
      const convertZ = props.position.z + (1 - delta) * 20;
      const convertY = props.position.y - (1 - delta) * props.position.y;

      const temp = new THREE.Vector3(props.position.x, props.position.y, props.position.z);
      temp.setZ(convertZ);
      temp.setY(convertY);

      const lookAtDirection = new THREE.Vector3(
        0 * delta + (1 - delta) * (cameraPos.x - temp.x),
        0 * delta + (1 - delta) * (cameraPos.y - temp.y),
        1 * delta + (1 - delta) * (cameraPos.z - temp.z)
      );

      setLookAt(lookAtDirection);
      setPosition(temp);
    } else {
      setPosition(props.position);
      setLookAt(new THREE.Vector3(0, 0, 1));
    }

    let fShader = "";
    if (Math.abs(props.position.x) > 10) {
      fShader = `
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            gl_FragColor = vec4(vec3(gray), 0.7);
          }
        `;
    } else {
      fShader = `
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            gl_FragColor = color;
          }
      `;
    }

    const shaders = {
      uniforms: {
        tDiffuse: { value: texture },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: fShader,
    };
    setMaterial(new THREE.ShaderMaterial(shaders));
  }, [texture, lookAt, props.position]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      props.textureUrl,
      (texture) => {
        setTexture(texture);
      },
      (error) => {
        console.error("An error occurred while loading the texture:", error);
      }
    );
  }, [props.textureUrl]);

  return (
    <mesh position={position} ref={meshRef}>
      {material && <planeGeometry args={[9, 16]} />}
      {material && <primitive object={material} attach="material" />}
    </mesh>
  );
}

const CameraSetup = () => {
  const { camera } = useThree();

  useEffect(() => {
    if (camera) {
      camera.position.set(-15, -5, 10);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return null;
};

const InitScene = () => {
  const { scene } = useThree();

  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color("rgb(236, 183, 9)");
    }
  }, [scene]);

  return null;
};

export default function ThreeSlider() {
  const [moveX, setMoveX] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [pictures, setPictures] = useState<PictureProps[]>([]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        setMoveX((prevMoveX) => prevMoveX + -event.deltaY / 100);
      });
    },
    [moveX]
  );

  useEffect(() => {
    if (moveX > 50) {
      setMoveX(50);
    } else if (moveX < -50) {
      setMoveX(-50);
    }
  }, [moveX]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        if (moveX < 50) setMoveX((prevMoveX) => prevMoveX + 1);
      } else if (event.key === "ArrowRight") {
        if (moveX > -50) setMoveX((prevMoveX) => prevMoveX - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [moveX]);

  const handleMouseDown = (event: MouseEvent) => {
    const startX = event.clientX;
    const initialMoveX = moveX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      setMoveX(initialMoveX + deltaX / 20); // Adjust the divisor to control the drag sensitivity
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel);
      canvas.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
        canvas.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [handleWheel, handleMouseDown]);

  useEffect(() => {
    const count = 9;

    const initialPictures: PictureProps[] = [];

    for (let i = 0; i < count; ++i) {
      initialPictures.push({
        position: new THREE.Vector3(-50 + 12.5 * i, Math.random() * 20 - 10, -20),
        textureUrl: `images/landscape/land${i + 1}.webp`,
      });
    }

    setPictures(initialPictures);
  }, []);

  return (
    <>
      <Canvas ref={canvasRef}>
        <InitScene />
        <CameraSetup />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {pictures.map((picture: any, index: number) => (
          <Picture key={index} position={new THREE.Vector3(picture.position.x + moveX, picture.position.y, picture.position.z)} textureUrl={picture.textureUrl} />
        ))}
      </Canvas>
      <div className="absolute top-3 left-3 text-black">
        <div className="flex flex-row gap-2">
          <img className="w-8 h-8" src="images/logo/threejs.png" />
          <span>3D Slide</span>
        </div>
      </div>
    </>
  );
}

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const Globe = () => {
  const globeRef = useRef();
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <Sphere ref={globeRef} args={[10, 64, 64]}>
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.2}
        roughness={0.8}
        wireframe={true}
      />
    </Sphere>
  );
};

export default Globe;
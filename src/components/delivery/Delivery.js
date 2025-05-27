import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

const Delivery = ({ stage, progress, origin, destination }) => {
  const packageRef = useRef();
  
  const getCountryPosition = (country) => {
    const positions = {
      'US': [0, 0, 10],
      'SG': [5, 0, 8],
      'UK': [-2, 0, 9],
      'JP': [8, 0, 8],
      'AU': [7, -2, 8],
      'DE': [-1, 0, 9],
      'FR': [-2, 0, 9],
      'IT': [-1, 0, 9],
      'ES': [-3, 0, 9],
      'CA': [-4, 0, 9],
      'BR': [-3, -2, 9],
      'IN': [4, 0, 8],
      'CN': [6, 0, 8],
      'RU': [3, 0, 9],
      'ZA': [-1, -2, 9],
      'MX': [-5, 0, 9],
      'AE': [2, 0, 8],
      'SA': [1, 0, 8],
      'TR': [1, 0, 9],
      'EG': [0, 0, 8]
    };
    
    return positions[country] || [0, 0, 10];
  };
  
  const getPosition = () => {
    const originPos = getCountryPosition(origin);
    const destPos = getCountryPosition(destination);
    
    switch(stage) {
      case 'warehouse':
        return [
          originPos[0],
          originPos[1] + Math.sin(progress * 0.1) * 0.5,
          originPos[2]
        ];
      case 'transit':
        const transitProgress = (progress - 30) / 40;
        return [
          originPos[0] + (destPos[0] - originPos[0]) * transitProgress,
          originPos[1] + (destPos[1] - originPos[1]) * transitProgress + Math.sin(transitProgress * Math.PI) * 5,
          originPos[2] + (destPos[2] - originPos[2]) * transitProgress
        ];
      case 'delivery':
        const deliveryProgress = (progress - 70) / 5;
        return [
          destPos[0],
          destPos[1] + Math.sin(deliveryProgress * Math.PI) * 0.5,
          destPos[2]
        ];
      case 'delivered':
        return destPos;
      default:
        return originPos;
    }
  };
  
  useFrame(() => {
    if (packageRef.current) {
      const [x, y, z] = getPosition();
      packageRef.current.position.set(x, y, z);
      packageRef.current.rotation.x += 0.01;
      packageRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <Box ref={packageRef} args={[0.5, 0.5, 0.5]}>
      <meshStandardMaterial
        color={stage === 'delivered' ? '#00ff00' : '#ff00ff'}
        metalness={0.8}
        roughness={0.2}
        emissive={stage === 'delivered' ? '#00ff00' : '#ff00ff'}
        emissiveIntensity={0.5}
      />
    </Box>
  );
};

export default Delivery;
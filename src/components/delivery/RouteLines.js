import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

const RouteLines = ({ origin, destination, progress, totalDuration, stageDurations }) => {
  const lineRef = useRef();
  
  // Get country position on globe
  const getCountryPosition = (country) => {
    // Simplified country positions (longitude, latitude)
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
  
  // Calculate route points
  const getRoutePoints = () => {
    const originPos = getCountryPosition(origin);
    const destPos = getCountryPosition(destination);
    
    // Create a curved path between origin and destination
    const points = [];
    const segments = 50;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = originPos[0] + (destPos[0] - originPos[0]) * t;
      const y = originPos[1] + (destPos[1] - originPos[1]) * t + Math.sin(t * Math.PI) * 5;
      const z = originPos[2] + (destPos[2] - originPos[2]) * t;
      points.push([x, y, z]);
    }
    
    return points;
  };
  
  // Calculate visible points based on progress
  const getVisiblePoints = () => {
    const points = getRoutePoints();
    const visibleCount = Math.floor((progress / 100) * points.length);
    return points.slice(0, visibleCount + 1);
  };
  
  useFrame(() => {
    if (lineRef.current) {
      const points = getVisiblePoints();
      lineRef.current.geometry.setFromPoints(points);
    }
  });
  
  return (
    <Line
      ref={lineRef}
      points={getVisiblePoints()}
      color="#00ffff"
      lineWidth={2}
      dashed={false}
    />
  );
};

export default RouteLines; 
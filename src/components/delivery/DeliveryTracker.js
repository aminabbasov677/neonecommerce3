import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Sphere, Box } from '@react-three/drei';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

// 3D Components
import Globe from './Globe';
import Delivery from './Delivery';
import RouteLines from './RouteLines';

const DeliveryTracker = ({ orderId, originCountry, destinationCountry }) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState('warehouse'); // warehouse, transit, delivery, delivered
  const [progress, setProgress] = useState(0); // 0-100
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cameraTarget, setCameraTarget] = useState([0, 0, 0]);
  const [cameraPosition, setCameraPosition] = useState([0, 20, 30]);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const pausedTimeRef = useRef(0);
  
  const totalDuration = 75; // Total seconds (30 + 40 + 5)
  const stageDurations = {
    warehouse: 30,
    transit: 40,
    delivery: 5
  };
  
  // Start animation loop
  useEffect(() => {
    startTimeRef.current = Date.now();
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Reset when isComplete changes
  useEffect(() => {
    if (isComplete) {
      // Animation is complete
    }
  }, [isComplete]);
  
  // Reset when isPaused changes
  useEffect(() => {
    if (isPaused) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    } else {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      if (!animationRef.current && !isComplete) {
        animate();
      }
    }
  }, [isPaused]);
  
  // Animation function
  const animate = () => {
    if (isComplete) return;
    
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - startTimeRef.current) / 1000;
    const newProgress = Math.min((elapsedSeconds / totalDuration) * 100, 100);
    
    setProgress(newProgress);
    
    // Update stage based on progress
    if (newProgress < (stageDurations.warehouse / totalDuration) * 100) {
      setStage('warehouse');
      // Zoom in on warehouse
      setZoomLevel(1.2);
      setCameraPosition([10, 15, 20]);
      setCameraTarget([5, 0, 0]);
    } else if (newProgress < ((stageDurations.warehouse + stageDurations.transit) / totalDuration) * 100) {
      setStage('transit');
      // Follow the package in air
      setZoomLevel(0.8);
      setCameraPosition([0, 25, 35]);
      setCameraTarget([0, 0, 0]);
    } else if (newProgress < 100) {
      setStage('delivery');
      // Zoom in on destination
      setZoomLevel(1.5);
      setCameraPosition([-10, 10, 15]);
      setCameraTarget([-5, 0, 0]);
    } else {
      setStage('delivered');
      setIsComplete(true);
      // Final camera position
      setZoomLevel(1);
      setCameraPosition([0, 20, 30]);
      setCameraTarget([0, 0, 0]);
    }
    
    if (newProgress < 100) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  // Reset animation
  const handleReset = () => {
    setStage('warehouse');
    setProgress(0);
    setIsPaused(false);
    setIsComplete(false);
    setZoomLevel(1);
    setCameraPosition([0, 20, 30]);
    setCameraTarget([0, 0, 0]);
    
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animate();
  };
  
  // Toggle pause/play
  const handlePlayPause = () => {
    setIsPaused(!isPaused);
  };
  
  // Get stage color
  const getStageColor = (stageId) => {
    switch(stageId) {
      case 'warehouse':
        return 'bg-neon-green';
      case 'transit':
        return 'bg-neon-cyan';
      case 'delivery':
        return 'bg-neon-pink';
      default:
        return 'bg-gray-400';
    }
  };
  
  // Render progress bar
  const renderProgressBar = () => {
    const stages = [
      { id: 'warehouse', name: t('delivery.stages.warehouse'), duration: stageDurations.warehouse },
      { id: 'transit', name: t('delivery.stages.transit'), duration: stageDurations.transit },
      { id: 'delivery', name: t('delivery.stages.delivery'), duration: stageDurations.delivery },
    ];
    
    let totalWidth = 0;
    
    return (
      <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden mt-4">
        {stages.map((s, index) => {
          const width = (s.duration / totalDuration) * 100;
          const isActive = s.id === stage || 
                          (s.id === 'warehouse' && stage === 'transit' && progress < ((stageDurations.warehouse + stageDurations.transit) / totalDuration) * 100) ||
                          (s.id === 'warehouse' && stage === 'delivery') ||
                          (s.id === 'transit' && stage === 'delivery');
          
          const prevWidth = totalWidth;
          totalWidth += width;
          
          return (
            <div
              key={s.id}
              className={`h-full float-left transition-all duration-300 ${getStageColor(s.id)}`}
              style={{ 
                width: `${width}%`,
                opacity: isActive ? 1 : 0.4
              }}
            >
              {s.id === stage && (
                <div
                  className="h-full bg-white/30"
                  style={{ 
                    width: `${((progress - prevWidth) / width) * 100}%`,
                    maxWidth: '100%'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="h-[70vh] relative">
        <Canvas shadows>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 20, 90]} />
          <ambientLight intensity={0.1} />
          <directionalLight
            position={[10, 20, 15]}
            intensity={2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <PerspectiveCamera
            makeDefault
            position={cameraPosition}
            fov={45}
            near={0.1}
            far={1000}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={!isComplete}
            target={cameraTarget}
          />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Globe />
          <RouteLines
            origin={originCountry}
            destination={destinationCountry}
            progress={progress}
            totalDuration={totalDuration}
            stageDurations={stageDurations}
          />
          <Delivery
            stage={stage}
            progress={progress}
            origin={originCountry}
            destination={destinationCountry}
          />
        </Canvas>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
            <div className="text-sm text-gray-400">
              {t(`delivery.stages.${stage}`)}
            </div>
          </div>
          {renderProgressBar()}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

import Globe from '../components/delivery/Globe';
import Delivery from '../components/delivery/Delivery';
import RouteLines from '../components/delivery/RouteLines';

const DeliveryTrackingPage = () => {
  const { t } = useTranslation();
  const { trackingNumber } = useParams();
  const [stage, setStage] = useState('warehouse');
  const [progress, setProgress] = useState(0);
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

  // Demo data - in a real app this would come from an API
  const demoDelivery = {
    origin: 'SG',
    destination: 'US',
    status: 'in_transit',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  };
  
  useEffect(() => {
    startTimeRef.current = Date.now();
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
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
  
  const animate = () => {
    if (isComplete) return;
    
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - startTimeRef.current) / 1000;
    const newProgress = Math.min((elapsedSeconds / totalDuration) * 100, 100);
    
    setProgress(newProgress);
    
    if (newProgress < (stageDurations.warehouse / totalDuration) * 100) {
      setStage('warehouse');
      setZoomLevel(1.2);
      setCameraPosition([10, 15, 20]);
      setCameraTarget([5, 0, 0]);
    } else if (newProgress < ((stageDurations.warehouse + stageDurations.transit) / totalDuration) * 100) {
      setStage('transit');
      setZoomLevel(0.8);
      setCameraPosition([0, 25, 35]);
      setCameraTarget([0, 0, 0]);
    } else if (newProgress < 100) {
      setStage('delivery');
      setZoomLevel(1.5);
      setCameraPosition([-10, 10, 15]);
      setCameraTarget([-5, 0, 0]);
    } else {
      setStage('delivered');
      setIsComplete(true);
      setZoomLevel(1);
      setCameraPosition([0, 20, 30]);
      setCameraTarget([0, 0, 0]);
    }
    
    if (newProgress < 100) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
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
  
  const handlePlayPause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto py-8">
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
                origin={demoDelivery.origin}
                destination={demoDelivery.destination}
                progress={progress}
                totalDuration={totalDuration}
                stageDurations={stageDurations}
              />
              <Delivery
                stage={stage}
                progress={progress}
                origin={demoDelivery.origin}
                destination={demoDelivery.destination}
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
              <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-cyan transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;
'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, AlertTriangle, ArrowLeft, MessageCircle, ClipboardList, Camera, Ban, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

const EFFECTS = [
  { name: 'Methamphetamine', desc: 'Skin sores, severe tooth decay, meth mites picking marks' },
  { name: 'Heroin / Opioids', desc: 'Severe dark circles under eyes, deathly paleness' },
  { name: 'Alcohol Abuse', desc: 'Sores around nose/cheeks, broken capillaries (Rosacea)' },
  { name: 'Cocaine / Crack', desc: 'Sunken gaunt cheeks, nasal septal destruction' }
];

export default function ARPage() {
  const [isActive, setIsActive] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState({ camera: false, faceMesh: false, drawing: false });

  const isLoaded = scriptsLoaded.camera && scriptsLoaded.faceMesh && scriptsLoaded.drawing;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive || !isLoaded || typeof window === 'undefined') return;
    
    // @ts-ignore
    if (!window.FaceMesh || !window.Camera) return;

    if (!faceMeshRef.current) {
      // @ts-ignore
      const faceMesh = new window.FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(onResults);
      faceMeshRef.current = faceMesh;
    }

    if (videoRef.current && !cameraRef.current) {
      // @ts-ignore
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && faceMeshRef.current) {
            await faceMeshRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720
      });
      camera.start().catch((e: any) => console.error("Camera start failed: ", e));
      cameraRef.current = camera;
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isLoaded]);

  const onResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, w, h);
    
    // Flip horizontally for natural mirror behavior
    canvasCtx.translate(w, 0);
    canvasCtx.scale(-1, 1);

    // Draw the raw webcam feed
    canvasCtx.drawImage(results.image, 0, 0, w, h);

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        
        // Draw the 3D FaceMesh Wireframe mapping
        // @ts-ignore
        if (window.drawConnectors && window.FACEMESH_TESSELATION) {
          // @ts-ignore
          window.drawConnectors(canvasCtx, landmarks, window.FACEMESH_TESSELATION, {
            color: 'rgba(0, 255, 150, 0.15)', // Sci-fi green mapping mesh
            lineWidth: 1
          });
        }

        // Draw Drug-Specific Physical Effects if one is active
        if (activeEffect) {
          drawRealisticEffects(canvasCtx, landmarks, w, h);
        }
      }
    }
    canvasCtx.restore();
  };

  const drawRealisticEffects = (ctx: CanvasRenderingContext2D, landmarks: any[], w: number, h: number) => {
    const getPos = (index: number) => ({ x: landmarks[index].x * w, y: landmarks[index].y * h });
    if (!landmarks[0]) return;

    const drawSore = (x: number, y: number, radius: number, color1: string, color2: string) => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    if (activeEffect === 'Methamphetamine') {
      const soreSpots = [205, 425, 116, 345, 9, 10, 151, 203, 423];
      soreSpots.forEach(idx => {
        const p = getPos(idx);
        drawSore(p.x, p.y, 14, 'rgba(180, 20, 0, 0.95)', 'rgba(80, 0, 0, 0)');
      });
      const mouthUpper = getPos(13);
      const mouthLower = getPos(14);
      drawSore((mouthUpper.x + mouthLower.x)/2, (mouthUpper.y + mouthLower.y)/2, 40, 'rgba(40, 10, 0, 0.95)', 'rgba(0,0,0,0)');
    }

    if (activeEffect === 'Heroin / Opioids') {
      const leftEyeBag = [110, 111, 117, 118, 119, 120, 121, 145, 153];
      const rightEyeBag = [339, 340, 346, 347, 348, 349, 350, 374, 380];
      
      ctx.fillStyle = 'rgba(50, 20, 70, 0.9)';
      ctx.filter = 'blur(8px)';
      ctx.beginPath();
      leftEyeBag.forEach((idx, i) => i === 0 ? ctx.moveTo(getPos(idx).x, getPos(idx).y) : ctx.lineTo(getPos(idx).x, getPos(idx).y));
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      rightEyeBag.forEach((idx, i) => i === 0 ? ctx.moveTo(getPos(idx).x, getPos(idx).y) : ctx.lineTo(getPos(idx).x, getPos(idx).y));
      ctx.closePath();
      ctx.fill();
      ctx.filter = 'none';

      ctx.fillStyle = 'rgba(230, 240, 255, 0.35)'; // Visible deathly pallor
      ctx.globalCompositeOperation = 'lighten';
      ctx.beginPath();
      const faceSilhouette = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
      faceSilhouette.forEach((idx, i) => i === 0 ? ctx.moveTo(getPos(idx).x, getPos(idx).y) : ctx.lineTo(getPos(idx).x, getPos(idx).y));
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    if (activeEffect === 'Alcohol Abuse') {
      const noseBridge = getPos(4);
      const leftInnerCheek = getPos(205);
      const rightInnerCheek = getPos(425);
      
      ctx.globalCompositeOperation = 'color-burn';
      drawSore(noseBridge.x, noseBridge.y + 15, 60, 'rgba(255, 40, 40, 0.7)', 'rgba(255, 40, 40, 0)');
      drawSore(leftInnerCheek.x, leftInnerCheek.y, 70, 'rgba(220, 20, 20, 0.65)', 'rgba(220, 20, 20, 0)');
      drawSore(rightInnerCheek.x, rightInnerCheek.y, 70, 'rgba(220, 20, 20, 0.65)', 'rgba(220, 20, 20, 0)');
      ctx.globalCompositeOperation = 'source-over';
    }

    if (activeEffect === 'Cocaine / Crack') {
      const leftHollow = getPos(205);
      const rightHollow = getPos(425);
      const leftCheekbone = getPos(147);
      const rightCheekbone = getPos(376);

      ctx.globalCompositeOperation = 'multiply';
      drawSore((leftHollow.x + leftCheekbone.x)/2, (leftHollow.y + leftCheekbone.y)/2 + 20, 60, 'rgba(10, 10, 15, 0.95)', 'rgba(0,0,0,0)');
      drawSore((rightHollow.x + rightCheekbone.x)/2, (rightHollow.y + rightCheekbone.y)/2 + 20, 60, 'rgba(10, 10, 15, 0.95)', 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'source-over';
      
      const noseTip = getPos(1);
      drawSore(noseTip.x, noseTip.y + 10, 25, 'rgba(200, 10, 10, 0.95)', 'rgba(0,0,0,0)');
    }
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="lazyOnload" onLoad={() => setScriptsLoaded(prev => ({ ...prev, camera: true }))} />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" strategy="lazyOnload" onLoad={() => setScriptsLoaded(prev => ({ ...prev, drawing: true }))} />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" strategy="lazyOnload" onLoad={() => setScriptsLoaded(prev => ({ ...prev, faceMesh: true }))} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-jeewan-calm flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">See What Drugs Do</h1>
                <p className="text-sm text-jeewan-muted mt-1 font-medium">Real-time educational physical simulations using AI face tracking.</p>
              </div>
            </div>
            <Link href="/" className="mt-4 md:mt-0 px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted transition flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          <div className="bg-card border border-border rounded-3xl p-4 md:p-6 shadow-xl relative grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Camera Viewport */}
            <div className={`col-span-1 border border-border/50 bg-[#0a0a14] rounded-2xl overflow-hidden relative flex items-center justify-center ${isActive ? 'md:col-span-8' : 'md:col-span-12'} transition-all duration-500`} style={{ minHeight: '480px' }}>
              <video ref={videoRef} className="hidden" playsInline muted autoPlay />
              <canvas ref={canvasRef} width="1280" height="720" className="w-full h-full object-cover" />

              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center h-full gap-4 bg-[#0a0a14]/90 backdrop-blur-sm z-10 p-8 text-center">
                  <div className="p-4 bg-jeewan-calm/10 rounded-full mb-2">
                    <Camera className="w-12 h-12 text-jeewan-calm" />
                  </div>
                  <h2 className="text-white text-lg font-bold">Face Simulation Camera</h2>
                  <p className="text-sm text-white/60 max-w-sm">
                    Allow camera access to map physical distortions directly onto your face in real-time.
                  </p>
                  <button
                    onClick={() => setIsActive(true)}
                    disabled={!isLoaded}
                    className="mt-4 px-8 py-4 bg-jeewan-calm hover:bg-blue-600 rounded-xl text-white font-bold transition shadow-lg shadow-jeewan-calm/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoaded ? 'Enable Camera Simulation' : 'Loading ML Engines...'}
                  </button>
                </div>
              )}
              
              {isActive && !activeEffect && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 rounded-full px-6 py-2 border border-white/10 text-white shadow-xl text-sm font-medium backdrop-blur-md z-20 whitespace-nowrap animate-bounce">
                  Select a substance to compute degradation 👇
                </div>
              )}
            </div>

            {/* Sidebar Controls */}
            {isActive && (
              <div className="col-span-1 md:col-span-4 flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="bg-surface border border-border rounded-2xl p-5">
                  <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider mb-4">Simulate Substances</p>
                  <div className="flex flex-col gap-3">
                    {EFFECTS.map((effect) => (
                      <button
                        key={effect.name}
                        onClick={() => setActiveEffect(activeEffect === effect.name ? null : effect.name)}
                        className={`px-4 py-3.5 rounded-xl text-sm font-bold transition flex flex-col text-left border ${
                          activeEffect === effect.name
                            ? 'bg-jeewan-warn border-jeewan-warn text-white shadow-lg'
                            : 'bg-card border-border hover:border-jeewan-warn/50 hover:bg-jeewan-warn-light/30 text-foreground'
                        }`}
                      >
                        {effect.name}
                        <span className={`text-[10px] font-medium mt-1 leading-relaxed ${activeEffect === effect.name ? 'text-white/80' : 'text-jeewan-muted'}`}>
                          {effect.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button
                    onClick={() => { setIsActive(false); setActiveEffect(null); }}
                    className="py-3.5 rounded-xl font-bold text-sm bg-surface border border-border text-foreground hover:bg-red-500 hover:text-white hover:border-red-500 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Ban className="w-4 h-4" /> Stop
                  </button>
                  <button
                    className="py-3.5 rounded-xl font-bold text-sm bg-jeewan-calm text-white hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Capture
                  </button>
                </div>
                
                <div className="bg-muted rounded-xl p-4 mt-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-jeewan-muted flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-jeewan-muted leading-relaxed">
                      <strong>Educational Context:</strong> These effects simulate documented long-term physical damage caused by drug abuse. 
                    </p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}

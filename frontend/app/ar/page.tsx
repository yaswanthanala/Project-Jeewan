'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, AlertTriangle, ArrowLeft, Camera, Ban } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { useLanguage } from '@/lib/i18n';

const EFFECTS = [
  {
    name: 'Methamphetamine',
    desc: 'Open skin sores, severe tooth decay, meth mites picking marks',
    color: '#dc2626',
  },
  {
    name: 'Heroin / Opioids',
    desc: 'Severe dark circles under eyes, hollow cheeks, ashen skin',
    color: '#7c3aed',
  },
  {
    name: 'Alcohol Abuse',
    desc: 'Rosacea flushing across nose & cheeks, broken capillaries',
    color: '#ea580c',
  },
  {
    name: 'Cocaine / Crack',
    desc: 'Sunken gaunt cheeks, nasal septal necrosis, grey pallor',
    color: '#475569',
  },
];

export default function ARPage() {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'running'>('idle');
  const [scriptsLoaded, setScriptsLoaded] = useState({
    camera: false,
    faceMesh: false,
    drawing: false,
  });

  const activeEffectRef = useRef<string | null>(null);
  const isLoaded = scriptsLoaded.camera && scriptsLoaded.faceMesh && scriptsLoaded.drawing;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const isCleaningUp = useRef(false);

  const handleSetEffect = (effect: string | null) => {
    setActiveEffect(effect);
    activeEffectRef.current = effect;
  };

  // Partially cleanup AR: MediaPipe WASM crashes if we destroy faceMesh entirely
  // So we only stop the camera tracks and let FaceMesh sit idle.
  const cleanupAR = useCallback(() => {
    isCleaningUp.current = true;
    try {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    } catch (_) {}
    
    // We explicitly DO NOT call faceMeshRef.current.close() to prevent the 
    // 'Module.arguments has been replaced' WASM crash on restart.
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    isCleaningUp.current = false;
  }, []);

  useEffect(() => {
    if (!isActive || !isLoaded || typeof window === 'undefined') return;
    if (isCleaningUp.current) return;

    // @ts-ignore
    if (!window.FaceMesh || !window.Camera) return;

    setStatus('loading');

    // Only instantiate FaceMesh once per page lifecycle to avoid WASM abort errors
    if (!faceMeshRef.current) {
      try {
        // @ts-ignore
        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        faceMesh.onResults(onResults);
        faceMeshRef.current = faceMesh;
      } catch (e) {
        console.error('FaceMesh init failed:', e);
        setStatus('idle');
        return;
      }
    }

    if (videoRef.current && !cameraRef.current) {
      try {
        // @ts-ignore
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMeshRef.current && !isCleaningUp.current) {
              try {
                await faceMeshRef.current.send({ image: videoRef.current });
              } catch (_) {}
            }
          },
          width: 1280,
          height: 720,
        });
        camera
          .start()
          .then(() => setStatus('running'))
          .catch((e: any) => {
            console.error('Camera start failed:', e);
            setStatus('idle');
          });
        cameraRef.current = camera;
      } catch (e) {
        console.error('Camera init failed:', e);
        setStatus('idle');
      }
    }

    return () => {
      cleanupAR();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isLoaded]);

  const onResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current || isCleaningUp.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Draw mirrored video feed only
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, w, h);
    ctx.restore();

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        // Mirror landmarks so mesh lines up with flipped video
        const mirrored = landmarks.map((lm: any) => ({ ...lm, x: 1 - lm.x }));

        // @ts-ignore
        if (window.drawConnectors && window.FACEMESH_TESSELATION) {
          // @ts-ignore
          window.drawConnectors(ctx, mirrored, window.FACEMESH_TESSELATION, {
            color: 'rgba(0, 255, 150, 0.18)',
            lineWidth: 1,
          });
        }

        if (activeEffectRef.current) {
          drawEffects(ctx, landmarks, w, h);
        }
      }
    }

    ctx.restore();
    if (status !== 'running') setStatus('running');
  };

  const drawEffects = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    w: number,
    h: number
  ) => {
    if (!landmarks[0]) return;

    // Mirror X to match the flipped video
    const pt = (index: number) => ({
      x: (1 - landmarks[index].x) * w,
      y: landmarks[index].y * h,
    });

    const effect = activeEffectRef.current;

    ctx.save();
    // Clip ALL effects to the physical face perimeter so they NEVER bleed outside the jaw/hairline
    const facePerimeter = [
      10,338,297,332,284,251,389,356,454,323,361,288,
      397,365,379,378,400,377,152,148,176,149,150,136,
      172,58,132,93,234,127,162,21,54,103,67,109
    ];
    ctx.beginPath();
    facePerimeter.forEach((idx, i) => {
      const p = pt(idx);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.clip();

    // Soft radial blotch for more natural skin blending
    const sore = (
      x: number,
      y: number,
      r: number,
      innerColor: string,
      outerColor: string,
      op: GlobalCompositeOperation = 'source-over'
    ) => {
      ctx.save();
      ctx.globalCompositeOperation = op;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, innerColor);
      g.addColorStop(0.5, innerColor.replace(/[\d.]+\)$/, '0.3)'));
      g.addColorStop(1, outerColor);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Filled region from landmark indices
    const region = (
      indices: number[],
      color: string,
      blur = 0,
      op: GlobalCompositeOperation = 'source-over'
    ) => {
      ctx.save();
      ctx.globalCompositeOperation = op;
      if (blur > 0) ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = color;
      ctx.beginPath();
      indices.forEach((idx, i) => {
        const p = pt(idx);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.filter = 'none';
      ctx.restore();
    };

    // ─── METHAMPHETAMINE ────────────────────────────────────────────
    if (effect === 'Methamphetamine') {
      // Many small picking sores (meth mites) distributed across face
      const sites: Array<[number, number, string, string]> = [
        // Forehead
        [109, 8, 'rgba(160, 20, 10, 0.8)', 'rgba(80, 0, 0, 0)'],
        [338, 10, 'rgba(150, 15, 15, 0.7)', 'rgba(80, 0, 0, 0)'],
        [9, 12, 'rgba(180, 25, 10, 0.85)', 'rgba(100, 0, 0, 0)'],
        [67, 9, 'rgba(170, 20, 20, 0.75)', 'rgba(90, 0, 0, 0)'],
        [297, 11, 'rgba(160, 15, 5, 0.8)', 'rgba(80, 0, 0, 0)'],
        
        // Cheeks
        [205, 14, 'rgba(190, 15, 10, 0.85)', 'rgba(120, 0, 0, 0)'],
        [425, 15, 'rgba(180, 10, 10, 0.85)', 'rgba(120, 0, 0, 0)'],
        [116, 12, 'rgba(150, 20, 15, 0.75)', 'rgba(80, 0, 0, 0)'],
        [345, 13, 'rgba(160, 15, 10, 0.8)', 'rgba(80, 0, 0, 0)'],
        [203, 10, 'rgba(140, 10, 10, 0.7)', 'rgba(60, 0, 0, 0)'],
        [423, 11, 'rgba(145, 12, 10, 0.75)', 'rgba(60, 0, 0, 0)'],
        [50, 13, 'rgba(170, 20, 10, 0.8)', 'rgba(90, 0, 0, 0)'],
        [280, 12, 'rgba(165, 15, 15, 0.75)', 'rgba(90, 0, 0, 0)'],
        
        // Chin / Lower jaw
        [200, 10, 'rgba(180, 10, 5, 0.8)', 'rgba(100, 0, 0, 0)'],
        [420, 9, 'rgba(170, 15, 10, 0.75)', 'rgba(100, 0, 0, 0)'],
        [14, 15, 'rgba(160, 20, 15, 0.8)', 'rgba(90, 0, 0, 0)'],
        [17, 12, 'rgba(150, 10, 10, 0.7)', 'rgba(80, 0, 0, 0)'],
      ];
      sites.forEach(([idx, r, c1, c2]) => {
        const p = pt(idx);
        sore(p.x, p.y, r, c1, c2, 'multiply');
      });
      // Rotting teeth area shadow
      const mouth = pt(13);
      sore(mouth.x, mouth.y + 10, 35, 'rgba(30, 10, 5, 0.6)', 'rgba(0,0,0,0)', 'multiply');
    }

    // ─── HEROIN / OPIOIDS ───────────────────────────────────────────
    if (effect === 'Heroin / Opioids') {
      // Soft ashen pallor
      region(
        [10,338,297,332,284,251,389,356,454,323,361,288,
         397,365,379,378,400,377,152,148,176,149,150,136,
         172,58,132,93,234,127,162,21,54,103,67,109],
        'rgba(180, 190, 210, 0.15)', 0, 'screen'
      );
      // Softer under-eye circles
      region(
        [110,111,117,118,119,120,121,145,153,154,155,133,173],
        'rgba(30, 20, 50, 0.5)', 8, 'multiply'
      );
      region(
        [339,340,346,347,348,349,350,374,380,381,382,362,398],
        'rgba(30, 20, 50, 0.5)', 8, 'multiply'
      );
      // Pale Blue-grey lips
      region(
        [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146],
        'rgba(120, 110, 140, 0.45)', 2
      );
    }

    // ─── ALCOHOL ABUSE ──────────────────────────────────────────────
    if (effect === 'Alcohol Abuse') {
      const nose  = pt(4);
      const lCheek = pt(205);
      const rCheek = pt(425);
      // Softer flush
      sore(nose.x,    nose.y,        80,  'rgba(220, 50, 40, 0.5)', 'rgba(200,20,10,0)', 'color-burn');
      sore(lCheek.x,  lCheek.y + 10, 90, 'rgba(210, 40, 30, 0.45)', 'rgba(180,0,0,0)',   'color-burn');
      sore(rCheek.x,  rCheek.y + 10, 90, 'rgba(210, 40, 30, 0.45)', 'rgba(180,0,0,0)',   'color-burn');
      // Reddened borders of eyes instead of whole socket
      region([33,7,163,144,145,153,154,155,133], 'rgba(200,40,30,0.25)', 4, 'color-burn');
      region([362,382,381,380,374,373,390,249,263], 'rgba(200,40,30,0.25)', 4, 'color-burn');
    }

    // ─── COCAINE / CRACK ────────────────────────────────────────────
    if (effect === 'Cocaine / Crack') {
      // Much softer grey pallor
      region(
        [10,338,297,332,284,251,389,356,454,323,361,288,
         397,365,379,378,400,377,152,148,176,149,150,136,
         172,58,132,93,234,127,162,21,54,103,67,109],
        'rgba(100, 100, 110, 0.15)', 0, 'multiply'
      );
      // Softened Gaunt Shadows (cheekbones) - much wider radius and lower opacity to avoid "black dots"
      const lH = pt(205), rH = pt(425), lC = pt(147), rC = pt(376);
      sore((lH.x+lC.x)/2, (lH.y+lC.y)/2+20, 80,
        'rgba(15, 15, 20, 0.4)', 'rgba(0,0,0,0)', 'multiply');
      sore((rH.x+rC.x)/2, (rH.y+rC.y)/2+20, 80,
        'rgba(15, 15, 20, 0.4)', 'rgba(0,0,0,0)', 'multiply');
      
      // Softened Nasal Damage - previously was a harsh red dot
      const noseTip = pt(1);
      const noseBase = pt(2);
      sore(noseTip.x, noseTip.y + 5, 25, 'rgba(160, 30, 20, 0.4)', 'rgba(0,0,0,0)', 'multiply');
      sore(noseBase.x, noseBase.y,   18, 'rgba(90, 10, 10, 0.35)', 'rgba(0,0,0,0)', 'multiply');
      
      // Softened under-eye darkening
      region([110,111,117,118,119,120,121,145,153], 'rgba(30,20,35,0.4)', 6, 'multiply');
      region([339,340,346,347,348,349,350,374,380], 'rgba(30,20,35,0.4)', 6, 'multiply');
    }

    ctx.restore(); // Ends the face Perimeter clipping
  };

  const handleCapture = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `jeewan-${activeEffect?.toLowerCase().replace(/[\s/]+/g, '-') ?? 'capture'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleStop = () => {
    cleanupAR();
    setIsActive(false);
    handleSetEffect(null);
    setStatus('idle');
  };

  const handleStart = () => {
    cleanupAR();
    setStatus('loading');
    setIsActive(true);
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        strategy="lazyOnload"
        onLoad={() => setScriptsLoaded((p) => ({ ...p, camera: true }))}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
        strategy="lazyOnload"
        onLoad={() => setScriptsLoaded((p) => ({ ...p, drawing: true }))}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js"
        strategy="lazyOnload"
        onLoad={() => setScriptsLoaded((p) => ({ ...p, faceMesh: true }))}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t('pg.ar.title' as any)}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('pg.ar.sub' as any)}
              </p>
            </div>
            <Link
              href="/"
              className="mt-4 md:mt-0 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition flex items-center gap-2 text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          {/* Main card */}
          <div className="bg-card border border-border rounded-3xl p-4 md:p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Camera viewport */}
            <div
              className={`col-span-1 border border-border/50 bg-[#0a0a14] rounded-2xl overflow-hidden relative flex items-center justify-center transition-all duration-500 ${
                isActive ? 'md:col-span-8' : 'md:col-span-12'
              }`}
              style={{ minHeight: '480px' }}
            >
              <video ref={videoRef} className="hidden" playsInline muted autoPlay />
              <canvas
                ref={canvasRef}
                width="1280"
                height="720"
                className="w-full h-full object-cover"
              />

              {/* Start screen */}
              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a14]/95 z-10 p-8 text-center">
                  <Camera className="w-14 h-14 text-blue-400 mb-2" />
                  <h2 className="text-white text-xl font-bold">
                    Educational Face Simulation
                  </h2>
                  <p className="text-sm text-white/60 max-w-sm leading-relaxed">
                    Your camera feed never leaves your device. The AI runs entirely
                    in your browser — private and instant.
                  </p>
                  <button
                    onClick={handleStart}
                    disabled={!isLoaded}
                    className="mt-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition disabled:opacity-40"
                  >
                    {isLoaded ? 'Start Simulation' : 'Loading AI Models…'}
                  </button>
                </div>
              )}

              {/* Warming up overlay */}
              {isActive && status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a14]/80 z-10">
                  <p className="text-white text-sm font-medium animate-pulse">
                    Initialising face tracking…
                  </p>
                </div>
              )}

              {/* Prompt once running */}
              {isActive && status === 'running' && !activeEffect && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/70 rounded-full px-5 py-2 border border-white/10 text-white text-sm font-medium backdrop-blur-md z-20 whitespace-nowrap">
                  Select a substance from the panel →
                </div>
              )}
            </div>

            {/* Sidebar */}
            {isActive && (
              <div className="col-span-1 md:col-span-4 flex flex-col gap-4">

                <div className="bg-muted/40 border border-border rounded-2xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    Simulate Substance
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {EFFECTS.map((effect) => {
                      const active = activeEffect === effect.name;
                      return (
                        <button
                          key={effect.name}
                          onClick={() => handleSetEffect(active ? null : effect.name)}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold text-left border transition-all ${
                            active
                              ? 'text-white border-transparent shadow-md'
                              : 'bg-card border-border hover:border-slate-400 text-foreground'
                          }`}
                          style={active ? { backgroundColor: effect.color, borderColor: effect.color } : {}}
                        >
                          {effect.name}
                          <span
                            className={`block text-[11px] font-normal mt-0.5 leading-snug ${
                              active ? 'text-white/75' : 'text-muted-foreground'
                            }`}
                          >
                            {effect.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col mt-2">
                  <button
                    onClick={handleStop}
                    className="w-full py-3.5 rounded-xl font-bold text-sm border-2 border-border bg-card hover:bg-red-500 hover:text-white hover:border-red-500 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Ban className="w-4 h-4" /> Stop Simulation
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 flex gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong>Educational use only.</strong> Simulates documented
                    physical damage from long-term drug abuse. No data leaves your
                    device.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
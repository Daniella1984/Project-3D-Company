import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Box,
  Video,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import * as THREE from 'three';

interface House3DVideoPlayerProps {
  onOpenEstimator: () => void;
  onExpandFullscreen?: () => void;
}

export const House3DVideoPlayer: React.FC<House3DVideoPlayerProps> = ({
  onOpenEstimator,
  onExpandFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'mesh' | 'blueprint'>('video');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Modern 3D architectural house video stream
  // Fast, reliable public CDN sources with multiple fallbacks
  const videoSources = [
    'https://cdn.coverr.co/videos/coverr-modern-house-architecture-5353/1080p.mp4',
    'https://cdn.coverr.co/videos/coverr-modern-minimalist-house-5682/1080p.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
  ];

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setVideoProgress((current / total) * 100);
    setVideoDuration(total);
  };

  // 3D Three.js fallback / mesh view
  useEffect(() => {
    if (activeTab !== 'mesh' && !videoError) return;
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(10, 8, 12);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xf59e0b, 1.3);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // Grid
    const grid = new THREE.GridHelper(24, 24, 0xd97706, 0x334155);
    scene.add(grid);

    // House group
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // Ground floor
    const gGeo = new THREE.BoxGeometry(6.8, 2.8, 10.5);
    const gMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
    const gMesh = new THREE.Mesh(gGeo, gMat);
    gMesh.position.y = 1.4;
    houseGroup.add(gMesh);

    // Upper floor with terrace overhang
    const uGeo = new THREE.BoxGeometry(6.8, 2.7, 9.2);
    const uMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const uMesh = new THREE.Mesh(uGeo, uMat);
    uMesh.position.set(0, 4.15, -0.65);
    houseGroup.add(uMesh);

    // Pergola
    const pGeo = new THREE.BoxGeometry(3.2, 0.15, 2.5);
    const pMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.position.set(-1.6, 2.7, 5.8);
    houseGroup.add(pMesh);

    // Technical wireframe overlay
    const wireGeo = new THREE.WireframeGeometry(gGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xd97706, opacity: 0.75, transparent: true });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    wireMesh.position.y = 1.4;
    houseGroup.add(wireMesh);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      houseGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeTab, videoError]);

  return (
    <div className="relative rounded-2xl bg-stone-900 border border-stone-800 p-5 shadow-2xl overflow-hidden group">
      
      {/* Card Header with View Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-stone-200 uppercase tracking-wider">
            RENDER 3D & RECORRIDO VIRTUAL
          </span>
        </div>

        {/* Tab switcher: Video vs Malla STL vs Sección */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mesh')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'mesh'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Malla 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blueprint')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'blueprint'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Planta BIM</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display Window */}
      <div className="relative my-4 aspect-[16/10] sm:aspect-[16/10] rounded-xl bg-stone-950 border border-stone-800 overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* ========================================================= */}
        {/* VIEW 1: VIDEO 3D DE LA CASA ADOSADA */}
        {/* ========================================================= */}
        {activeTab === 'video' && !videoError && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            >
              <source src={videoSources[0]} type="video/mp4" />
              <source src={videoSources[1]} type="video/mp4" />
            </video>

            {/* Subtle cinematic gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/40 pointer-events-none" />

            {/* Overlaid Live Badges & Dimensions */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-200">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-amber-400">REC 4K</span>
                <span className="text-stone-500">|</span>
                <span>Vivienda Adosada Torrijos (142 m²)</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-stone-950/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Calificación Energética A · Passivhaus</span>
              </div>
            </div>

            {/* Dimension marks */}
            <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none bg-stone-950/80 backdrop-blur px-2 py-1 rounded border border-stone-800 text-[10px] font-mono text-amber-300">
              h = 6.80m
            </div>
            <div className="absolute bottom-10 left-3 pointer-events-none bg-stone-950/80 backdrop-blur px-2 py-1 rounded border border-stone-800 text-[10px] font-mono text-amber-300">
              Fachada: 14.20m
            </div>

            {/* Player Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-stone-950 to-transparent flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 transition-colors text-stone-200"
                  title={isPlaying ? 'Pausar video' : 'Reproducir video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 transition-colors text-stone-200"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-150"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {onExpandFullscreen && (
                <button
                  type="button"
                  onClick={onExpandFullscreen}
                  className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 transition-colors text-stone-200"
                  title="Ver en pantalla completa"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: MALLA STL 3D INTERACTIVA (THREE.JS) */}
        {/* ========================================================= */}
        {(activeTab === 'mesh' || videoError) && (
          <div ref={canvasRef} className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <div className="absolute top-2 left-2 pointer-events-none bg-stone-950/80 px-2.5 py-1 rounded text-[10px] font-mono text-amber-400 border border-stone-800">
              Modelo STL 3D · 14.280 triángulos
            </div>
            <div className="absolute bottom-2 right-2 pointer-events-none bg-stone-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-stone-400">
              Rotación 360° en tiempo real
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: PLANTA BIM / SECCIÓN TÉCNICA */}
        {/* ========================================================= */}
        {activeTab === 'blueprint' && (
          <div className="w-full h-full bg-slate-950 p-6 flex flex-col items-center justify-center text-center relative select-none">
            <svg
              viewBox="0 0 240 160"
              className="w-full h-full text-cyan-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              {/* Outer plot boundary */}
              <rect x="20" y="15" width="200" height="130" stroke="#0284c7" strokeDasharray="3 3" />
              {/* Ground floor walls */}
              <rect x="40" y="30" width="160" height="100" stroke="#38bdf8" strokeWidth="2" fill="rgba(56,189,248,0.05)" />
              {/* Inner rooms */}
              <line x1="120" y1="30" x2="120" y2="130" stroke="#38bdf8" />
              <line x1="40" y1="80" x2="120" y2="80" stroke="#38bdf8" />
              <line x1="120" y1="85" x2="200" y2="85" stroke="#38bdf8" />
              {/* Room labels */}
              <text x="50" y="60" fill="#bae6fd" fontSize="8" fontFamily="monospace">Salón-Comedor (32 m²)</text>
              <text x="50" y="110" fill="#bae6fd" fontSize="8" fontFamily="monospace">Cocina Office (16 m²)</text>
              <text x="130" y="60" fill="#bae6fd" fontSize="8" fontFamily="monospace">Dormitorio Principal (18 m²)</text>
              <text x="130" y="110" fill="#bae6fd" fontSize="8" fontFamily="monospace">Patio / Porche (28 m²)</text>
              {/* Dimension text */}
              <text x="105" y="145" fill="#f59e0b" fontSize="7" fontFamily="monospace">L=14.20m</text>
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              Distribución Arquitectónica PGOU Torrijos
            </div>
          </div>
        )}

      </div>

      {/* Technical Summary Footer Box */}
      <div className="space-y-3 bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Proyecto Modelo: Vivienda Adosada Torrijos</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              142 m² construidos · 2 plantas · 3 hab. · 2 baños · Patio y Porche
            </div>
          </div>
          <span className="font-mono text-amber-400 font-bold text-xs bg-amber-950/60 border border-amber-800/80 px-2 py-1 rounded">
            +15% Margen
          </span>
        </div>

        {/* Action button */}
        <button
          onClick={onOpenEstimator}
          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
        >
          <span>Estimar este diseño con tus metros cuadrados</span>
        </button>
      </div>

    </div>
  );
};

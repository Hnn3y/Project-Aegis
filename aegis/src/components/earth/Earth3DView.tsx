// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as THREE from 'three';
import { Satellite, DebrisObject } from '../../types';
import { Globe, RotateCcw, Play, Pause, Layers, Eye, ShieldAlert, Zap, Radio, Sun } from 'lucide-react';

interface Earth3DViewProps {
  satellites: Satellite[];
  debris: DebrisObject[];
  selectedSatellite: Satellite | null;
  onSelectSatellite: (sat: Satellite) => void;
  onOpenDigitalTwin: (sat: Satellite) => void;
}

export const Earth3DView: React.FC<Earth3DViewProps> = ({
  satellites,
  debris,
  selectedSatellite,
  onSelectSatellite,
  onOpenDigitalTwin,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [showDebris, setShowDebris] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [spaceWeatherMode, setSpaceWeatherMode] = useState(false);
  const [focusedSat, setFocusedSat] = useState<Satellite | null>(selectedSatellite || satellites[0]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const satMeshesRef = useRef<{ id: string; mesh: THREE.Mesh; orbitGroup: THREE.Group }[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Very dark space navy
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(50, 30, 50);
    scene.add(sunLight);

    const cyanGlow = new THREE.PointLight(0x06b6d4, 1.2, 100);
    cyanGlow.position.set(-30, -20, -30);
    scene.add(cyanGlow);

    // 5. Starfield Background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 400;
      starPositions[i + 1] = (Math.random() - 0.5) * 400;
      starPositions[i + 2] = (Math.random() - 0.5) * 400;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.8 });
    const starParticles = new THREE.Points(starGeometry, starMaterial);
    scene.add(starParticles);

    // 6. Earth Mesh creation with procedural canvas texture
    const earthRadius = 8;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Ocean gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
      oceanGrad.addColorStop(0, '#0a192f');
      oceanGrad.addColorStop(0.5, '#020c1b');
      oceanGrad.addColorStop(1, '#0a192f');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Grid lines
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.25;
      for (let x = 0; x < 1024; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y < 512; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Draw stylized continent shapes
      ctx.fillStyle = '#0284c7';
      ctx.globalAlpha = 0.45;
      // North America
      ctx.beginPath();
      ctx.ellipse(250, 180, 100, 60, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // South America
      ctx.beginPath();
      ctx.ellipse(320, 320, 60, 90, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // Eurasia
      ctx.beginPath();
      ctx.ellipse(650, 160, 160, 80, -0.1, 0, Math.PI * 2);
      ctx.fill();
      // Africa
      ctx.beginPath();
      ctx.ellipse(550, 280, 80, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      // Australia
      ctx.beginPath();
      ctx.ellipse(820, 360, 50, 40, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 25,
      specular: new THREE.Color(0x0284c7),
      emissive: new THREE.Color(0x032b45),
      emissiveIntensity: 0.2,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Atmosphere Glow Atmosphere Shell
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.05, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);

    // 7. Render Satellites and Orbits
    satMeshesRef.current = [];
    satellites.forEach((sat, index) => {
      const orbitRadius = earthRadius + sat.position.altitudeKm / 100;
      const inclinationRad = (sat.position.inclinationDeg * Math.PI) / 180;

      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.z = inclinationRad;
      orbitGroup.rotation.y = (index * Math.PI) / 2.5; // Stagger orbits

      // Orbit Line Ring
      const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, 2 * Math.PI, false, 0);
      const points = orbitCurve.getPoints(128);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p: THREE.Vector2) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: sat.status === 'nominal' ? 0x06b6d4 : sat.status === 'warning' ? 0xf59e0b : 0xef4444,
        transparent: true,
        opacity: 0.5,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitGroup.add(orbitLine);

      // Satellite Marker Mesh
      const satGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: sat.status === 'nominal' ? 0x38bdf8 : sat.status === 'warning' ? 0xfbbf24 : 0xf87171,
        emissive: sat.status === 'nominal' ? 0x0284c7 : sat.status === 'warning' ? 0xd97706 : 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);

      // Initial position on orbit
      satMesh.position.set(orbitRadius, 0, 0);
      satMesh.userData = { satellite: sat };
      orbitGroup.add(satMesh);

      scene.add(orbitGroup);
      satMeshesRef.current.push({ id: sat.id, mesh: satMesh, orbitGroup });
    });

    // 8. Debris Field Cloud Particles
    if (showDebris) {
      const debrisGeo = new THREE.BufferGeometry();
      const debrisCount = 300;
      const debrisPos = new Float32Array(debrisCount * 3);
      for (let i = 0; i < debrisCount * 3; i += 3) {
        const radius = earthRadius + 1.2 + Math.random() * 3.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        debrisPos[i] = radius * Math.cos(phi) * Math.cos(theta);
        debrisPos[i + 1] = radius * Math.sin(phi);
        debrisPos[i + 2] = radius * Math.cos(phi) * Math.sin(theta);
      }
      debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
      const debrisMat = new THREE.PointsMaterial({
        color: 0xef4444,
        size: 0.35,
        transparent: true,
        opacity: 0.7,
      });
      const debrisPoints = new THREE.Points(debrisGeo, debrisMat);
      scene.add(debrisPoints);
    }

    // 9. Animation Loop
    let angle = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (isRotating && earthMeshRef.current) {
        earthMeshRef.current.rotation.y += 0.0015;
      }

      // Rotate satellite orbits
      angle += 0.003;
      satMeshesRef.current.forEach(({ mesh, orbitGroup }, idx) => {
        const speed = 0.002 + idx * 0.0005;
        mesh.rotation.y += 0.01;
        orbitGroup.rotation.y += speed;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, [isRotating, showDebris]);

  const activeSat = focusedSat || selectedSatellite || satellites[0];

  return (
    <div className="relative w-full h-[calc(100vh-105px)] bg-slate-950 overflow-hidden font-mono text-slate-100">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Control Overlay - Top Left */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-2xl max-w-xs">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-xs font-bold text-cyan-400">
          <Globe className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
          <span>3D ORBITAL SIMULATION</span>
        </div>

        <div className="space-y-2 text-xs">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              {isRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isRotating ? 'Pause Earth Rotation' : 'Resume Rotation'}</span>
            </span>
          </button>

          <button
            onClick={() => setShowDebris(!showDebris)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded border transition-colors ${
              showDebris
                ? 'bg-red-950/40 border-red-500/40 text-red-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Debris Cloud Layer</span>
            </span>
            <span className="text-[10px] font-bold">{showDebris ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setSpaceWeatherMode(!spaceWeatherMode)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded border transition-colors ${
              spaceWeatherMode
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Space Weather Grid</span>
            </span>
            <span className="text-[10px] font-bold">{spaceWeatherMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Satellite Selector Bar - Top Right */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-2xl w-80">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-200">
          <span className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>ORBITAL ASSETS ({satellites.length})</span>
          </span>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {satellites.map((sat) => {
            const isSelected = activeSat.id === sat.id;
            return (
              <button
                key={sat.id}
                onClick={() => {
                  setFocusedSat(sat);
                  onSelectSatellite(sat);
                }}
                className={`w-full text-left p-2 rounded-lg border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <span>{sat.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {sat.orbitType} | Alt: {sat.position.altitudeKm}km
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      sat.status === 'nominal'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : sat.status === 'warning'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-red-950 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {sat.telemetry.overallHealthScore}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Satellite Telemetry & Digital Twin Overlay - Bottom Center/Right */}
      {activeSat && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-10 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 shadow-2xl max-w-lg">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{activeSat.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  NORAD #{activeSat.noradId}
                </span>
              </div>
              <p className="text-xs text-slate-400">{activeSat.operator} | {activeSat.missionType}</p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">AI Health Score</div>
              <div
                className={`text-lg font-black font-mono ${
                  activeSat.telemetry.overallHealthScore >= 85
                    ? 'text-emerald-400'
                    : activeSat.telemetry.overallHealthScore >= 70
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {activeSat.telemetry.overallHealthScore}%
              </div>
            </div>
          </div>

          {/* Quick Telemetry Bar */}
          <div className="grid grid-cols-4 gap-2 my-3 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Power / Batt</div>
              <div className="font-bold text-cyan-300 font-mono mt-0.5">{activeSat.telemetry.batteryLevel}%</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Thermal Int</div>
              <div className="font-bold text-amber-300 font-mono mt-0.5">{activeSat.telemetry.internalTemp}°C</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Fuel Reserve</div>
              <div className="font-bold text-emerald-300 font-mono mt-0.5">{activeSat.telemetry.fuelRemaining}%</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">AI Risk Score</div>
              <div
                className={`font-bold font-mono mt-0.5 ${
                  activeSat.telemetry.aiRiskScore > 50 ? 'text-red-400' : 'text-slate-300'
                }`}
              >
                {activeSat.telemetry.aiRiskScore}/100
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-slate-400 font-mono">
              Altitude: <span className="text-slate-200">{activeSat.position.altitudeKm} km</span> | Orbit: <span className="text-slate-200">{activeSat.orbitType}</span>
            </div>

            <button
              onClick={() => onOpenDigitalTwin(activeSat)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold shadow-lg transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-200" />
              <span>Open Digital Twin</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
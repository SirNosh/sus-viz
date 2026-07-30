"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { area, curveBumpX, curveMonotoneX, line, scaleLinear, scaleSqrt } from "d3";

function useChartWidth(initialWidth = 860) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    if (!ref.current) return;
    let frame = 0;
    const element = ref.current;
    element.classList.add("reveal-on-entry");
    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.max(280, Math.round(entry.contentRect.width));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setWidth((currentWidth) => currentWidth === nextWidth ? currentWidth : nextWidth);
      });
    });
    let revealObserver: IntersectionObserver | null = null;
    revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("is-visible");
        revealObserver?.disconnect();
      }
    }, { threshold: 0.18 }) : null;
    resizeObserver.observe(element);
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("is-visible");
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      revealObserver?.disconnect();
    };
  }, []);

  return { ref, width };
}

export function HorizonVisualization() {
  const { ref, width } = useChartWidth(1100);
  const height = width < 560 ? 142 : 126;
  const margin = width < 560 ? 12 : 18;
  const x = scaleLinear().domain([2022, 2040]).range([margin, width - margin]);
  const years = [
    { year: 2022, label: "baseline", color: "#008767" },
    { year: 2024, label: "measurement", color: "#008767" },
    { year: 2030, label: "commitments", color: "#f1c400" },
    { year: 2040, label: "net zero", color: "#cf4520" },
  ];
  const lineY = 58;

  return (
    <div className="d3-horizon" ref={ref}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Target horizon from the 2022 baseline through the 2024 measurement to commitments in 2030 and net zero in 2040."
      >
        <line x1={x(2022)} x2={x(2040)} y1={lineY} y2={lineY} stroke="rgba(49,38,29,.18)" />
        <line className="horizon-observed-line" pathLength={1} x1={x(2022)} x2={x(2024)} y1={lineY} y2={lineY} stroke="#008767" strokeWidth={2} />
        <line
          className="horizon-target-line"
          x1={x(2024)}
          x2={x(2040)}
          y1={lineY}
          y2={lineY}
          stroke="#d6aa00"
          strokeWidth={1.5}
          strokeDasharray="4 5"
        />
        {years.map(({ year, label, color }, index) => {
          const anchor = index === 0 ? "start" : index === years.length - 1 ? "end" : "middle";
          const alternateBelow = width < 560 && index % 2 === 1;
          const yearY = alternateBelow ? 29 : -18;
          const labelY = alternateBelow ? 44 : width < 560 ? -4 : 27;
          return (
            <g key={year} transform={`translate(${x(year)},${lineY})`}>
              {year === 2024 && <circle r={10} fill="rgba(0,135,103,.12)" />}
              <circle r={5} fill={color} stroke="#f5f3ee" strokeWidth={2} />
              <text className="d3-year" y={yearY} textAnchor={anchor}>{year}</text>
              <text className="d3-note" y={labelY} textAnchor={anchor}>{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ClimateD3() {
  const { ref, width } = useChartWidth();
  const compact = width < 560;
  const height = compact ? 420 : 390;
  const margin = { top: 52, right: compact ? 28 : 45, bottom: 72, left: compact ? 38 : 48 };
  const x = scaleLinear().domain([2022, 2040]).range([margin.left, width - margin.right]);
  const y = scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);
  const observed = [{ year: 2022, value: 100 }, { year: 2024, value: 79 }];
  const future = [{ year: 2024, value: 79 }, { year: 2040, value: 0 }];
  const path = line<{ year: number; value: number }>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(curveMonotoneX);
  const ticks = [0, 50, 100];

  return (
    <div className="d3-chart climate-d3" ref={ref}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="D3 line chart showing emissions indexed at 100 in 2022, falling to 79 in 2024, followed by an explicitly unobserved target path to net zero in 2040."
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} className="d3-gridline" />
            <text x={margin.left - 12} y={y(tick) + 4} textAnchor="end" className="d3-axis-label">{tick}</text>
          </g>
        ))}
        <path className="climate-observed-path" pathLength={1} d={path(observed) ?? ""} fill="none" stroke="#008767" strokeWidth={3} />
        <path className="climate-target-path" d={path(future) ?? ""} fill="none" stroke="#d6aa00" strokeWidth={2} strokeDasharray="7 7" />

        {observed.map((point, index) => (
          <g key={point.year} transform={`translate(${x(point.year)},${y(point.value)})`}>
            <circle r={7} fill="#f5f3ee" stroke={index === 0 ? "#002d72" : "#008767"} strokeWidth={2} />
            <circle r={3} fill={index === 0 ? "#002d72" : "#008767"} />
            <text
              className="d3-value"
              x={index === 0 ? 0 : compact ? -8 : 0}
              y={index === 0 ? -18 : 28}
              textAnchor={index === 0 ? "start" : "middle"}
            >
              {point.value}
            </text>
            <text
              className="d3-note"
              x={index === 0 ? (compact ? 6 : 10) : compact ? -8 : 0}
              y={index === 0 ? -4 : 45}
              textAnchor={index === 0 ? "start" : "middle"}
            >
              {point.year} {index === 0 ? "baseline" : "current"}
            </text>
          </g>
        ))}

        <g transform={`translate(${x(2040)},${y(0)})`}>
          <circle r={7} fill="#f5f3ee" stroke="#d6aa00" strokeWidth={2} />
          <circle r={3} fill="#d6aa00" />
          <text className="d3-value" x={0} y={-28} textAnchor="end">0</text>
          <text className="d3-note" x={0} y={-13} textAnchor="end">2040 target</text>
        </g>

        <g transform={`translate(${x(2023.45)},${y(94)})`}>
          <text className="d3-callout" textAnchor="middle">−21 points</text>
          <text className="d3-note" x={10} y={16} textAnchor="start">observed reduction</text>
        </g>

        <g transform={`translate(${margin.left},${height - 27})`}>
          <line x1={0} x2={28} y1={0} y2={0} stroke="#008767" strokeWidth={3} />
          <text className="d3-note" x={38} y={4}>Observed</text>
          <line x1={compact ? 132 : 158} x2={compact ? 160 : 188} y1={0} y2={0} stroke="#d6aa00" strokeWidth={2} strokeDasharray="5 5" />
          <text className="d3-note" x={compact ? 170 : 198} y={4}>Target path · unobserved</text>
        </g>
      </svg>
      <div className="chart-context"><strong>77% clean electricity</strong><span>Context only — not a direct net-zero measure.</span></div>
    </div>
  );
}

export function WasteD3() {
  const { ref, width } = useChartWidth();
  const height = 340;
  const left = 18;
  const right = width - 18;
  const x = scaleLinear().domain([0, 100]).range([left, right]);
  const streamTop = 82;
  const streamBottom = 160;
  const divertedPath = area<number>()
    .x((d) => x(d))
    .y0((d) => streamTop + (d / 37) * 18)
    .y1((d) => streamBottom - (d / 37) * 18)
    .curve(curveBumpX)([0, 37]) ?? "";
  const remainingPath = area<number>()
    .x((d) => x(d))
    .y0((d) => streamTop + 18 - ((d - 37) / 63) * 18)
    .y1((d) => streamBottom - 18 + ((d - 37) / 63) * 18)
    .curve(curveBumpX)([37, 100]) ?? "";
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="d3-chart waste-d3" ref={ref}>
      <svg width={width} height={height} role="img" aria-label="D3 material-flow chart showing 37 of 100 waste units diverted and a 2030 target split at 50 units.">
        <path className="waste-stream-diverted" d={divertedPath} fill="#008767" opacity={0.95} />
        <path className="waste-stream-remaining" d={remainingPath} fill="#d7d0c4" />
        <line x1={x(50)} x2={x(50)} y1={44} y2={188} stroke="#d6aa00" strokeWidth={2} />
        <text x={x(50) + 8} y={39} className="d3-callout">50% target</text>
        <text x={x(50) + 8} y={55} className="d3-note">2030 commitment</text>
        <text x={x(18.5)} y={128} textAnchor="middle" className="stream-label stream-label-light">37% diverted</text>
        <text x={x(68.5)} y={128} textAnchor="middle" className="stream-label">63% incineration or landfill</text>
        {ticks.map((tick) => (
          <g key={tick} transform={`translate(${x(tick)},190)`}>
            <line y2={5} stroke="rgba(49,38,29,.3)" />
            <text y={19} textAnchor="middle" className="d3-axis-label">{tick}</text>
          </g>
        ))}

        <text x={left} y={254} className="d3-label">PER-CAPITA REDUCTION FROM 2022</text>
        <line x1={x(0)} x2={x(10)} y1={286} y2={286} stroke="#d7d0c4" strokeWidth={6} />
        <line x1={x(0)} x2={x(8.1)} y1={286} y2={286} stroke="#008767" strokeWidth={6} />
        <line x1={x(10)} x2={x(10)} y1={276} y2={296} stroke="#d6aa00" strokeWidth={2} />
        <circle cx={x(8.1)} cy={286} r={6} fill="#f5f3ee" stroke="#008767" strokeWidth={2} />
        <text x={x(8.1)} y={270} textAnchor="middle" className="d3-callout">8.1%</text>
        <text x={x(0)} y={316} textAnchor="start" className="d3-note">0% baseline</text>
        <text x={x(10) + 10} y={316} textAnchor="start" className="d3-note">10% target</text>
      </svg>
    </div>
  );
}

export function FoodD3() {
  const { ref, width } = useChartWidth();
  const compact = width < 600;
  const height = compact ? 470 : 410;
  const centerX = compact ? width / 2 : width * 0.47;
  const centerY = compact ? 158 : 196;
  const radiusScale = scaleSqrt().domain([0, 250]).range([0, compact ? 116 : 152]);
  const outerR = radiusScale(250);
  const hyperR = Math.max(43, radiusScale(25));
  const callout = line<[number, number]>().curve(curveBumpX);

  const leftTextX = compact ? 18 : Math.max(14, centerX - outerR - 148);
  const rightTextX = compact ? width / 2 + 12 : centerX + outerR + 28;
  const labelY = compact ? 350 : 152;

  return (
    <div className="d3-chart food-d3" ref={ref}>
      <svg width={width} height={height} role="img" aria-label="D3 sourcing-distance instrument: 8 percent hyperlocal food within 25 miles, another 22 percent local within 250 miles, and 70 percent outside the local category.">
        <circle className="food-radius food-radius-250" pathLength={1} cx={centerX} cy={centerY} r={outerR} fill="none" stroke="rgba(49,38,29,.18)" />
        <circle className="food-radius food-radius-25" pathLength={1} cx={centerX} cy={centerY} r={hyperR} fill="rgba(0,45,114,.08)" stroke="#002d72" strokeWidth={1.5} />
        <circle cx={centerX} cy={centerY} r={4} fill="#f1c400" />
        <text x={centerX} y={centerY + 17} textAnchor="middle" className="d3-origin">HOMEWOOD</text>
        <text x={centerX} y={centerY - outerR - 14} textAnchor="middle" className="d3-label">SOURCING DISTANCE</text>

        <path
          d={callout([[centerX - hyperR * 0.72, centerY - hyperR * 0.34], [centerX - outerR - 18, compact ? 296 : 112], [leftTextX + (compact ? 0 : 118), labelY]]) ?? ""}
          className="leader leader-blue"
        />
        <text x={leftTextX} y={labelY} className="d3-callout food-hyperlocal">8% hyperlocal</text>
        <text x={leftTextX} y={labelY + 17} className="d3-note">within 25 miles</text>

        <path
          d={callout([[centerX + outerR * 0.78, centerY - outerR * 0.38], [centerX + outerR + 18, compact ? 296 : 112], [rightTextX, labelY]]) ?? ""}
          className="leader leader-green"
        />
        <text x={rightTextX} y={labelY} className="d3-callout">22% additional local</text>
        <text x={rightTextX} y={labelY + 17} className="d3-note">within 250 miles</text>

        <text x={compact ? width / 2 : centerX} y={compact ? 422 : 384} textAnchor="middle" className="d3-callout">30% local in total · 70% outside local</text>
      </svg>
      <div className="food-share-strip" aria-label="Local sourcing share: 8 percent hyperlocal, 22 percent additional local, 70 percent outside local">
        <div className="food-share-track" aria-hidden="true"><i className="share-hyperlocal" /><i className="share-additional" /><i className="share-outside" /></div>
        <div className="food-share-labels"><span>8% hyperlocal</span><span>22% additional local</span><span>70% outside local</span></div>
      </div>
      <div className="food-bars">
        <D3Bullet label="Sustainable dining spend" current={20} target={35} currentLabel="20%" targetLabel="35% by 2030" />
        <D3Bullet label="Food procurement emissions" current={5690} target={4267.5} max={6500} direction="decrease" currentLabel="5,690" targetLabel="4,267.5 target" />
      </div>
    </div>
  );
}

function D3Bullet({
  label,
  current,
  target,
  max = 100,
  direction = "increase",
  currentLabel,
  targetLabel,
}: {
  label: string;
  current: number;
  target: number;
  max?: number;
  direction?: "increase" | "decrease";
  currentLabel: string;
  targetLabel: string;
}) {
  const x = scaleLinear().domain([0, max]).range([0, 100]);
  return (
    <div className="d3-bullet">
      <span>{label}</span>
      <div><strong>{currentLabel}</strong><small>{targetLabel}</small></div>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
        <rect x={0} y={4} width={100} height={4} fill="#d7d0c4" />
        <rect x={0} y={4} width={x(current)} height={4} fill={direction === "increase" ? "#008767" : "#cf4520"} />
        <line x1={x(target)} x2={x(target)} y1={1} y2={11} stroke="#d6aa00" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export function MobilityD3() {
  const { ref, width } = useChartWidth();
  const compact = width < 600;
  const height = compact ? 490 : 355;
  const margin = compact ? 42 : 55;
  const x = scaleLinear().domain([0, 3]).range([margin, width - margin]);
  const yValues = compact ? [100, 205, 310, 415] : [172, 116, 208, 152];
  const routePoints = yValues.map((y, index) => ({ index, x: x(index), y }));
  const routePath = line<{ x: number; y: number }>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(compact ? curveMonotoneX : curveBumpX)(routePoints) ?? "";
  const stations = [
    { value: "1.5M", label: "shuttle, bus + van rides" },
    { value: "5", label: "electric buses" },
    { value: "25%", label: "alternative commuting" },
    { value: "24%", label: "electric or hybrid purchases", warning: "≠ future all-electric target" },
  ];

  return (
    <div className="d3-chart mobility-d3" ref={ref}>
      <svg width={width} height={height} role="img" aria-label="D3 route connecting four distinct campus mobility measures.">
        <path className="mobility-route-path" pathLength={1} d={routePath} fill="none" stroke="#002d72" strokeWidth={2.5} />
        {routePoints.map((point, index) => {
          const station = stations[index];
          const above = compact ? false : index % 2 === 0;
          const textY = compact ? point.y - 18 : point.y + (above ? -42 : 48);
          return (
            <g className={`mobility-station mobility-station-${index}`} key={station.label}>
              <circle cx={point.x} cy={point.y} r={11} fill="#f5f3ee" stroke="#f1c400" strokeWidth={2} />
              <circle cx={point.x} cy={point.y} r={4} fill="#002d72" />
              <text x={point.x} y={textY} textAnchor="middle" className="route-value">{station.value}</text>
              <text x={point.x} y={textY + 16} textAnchor="middle" className="d3-note">{station.label}</text>
              {station.warning && <text x={point.x} y={textY + 33} textAnchor="middle" className="d3-warning">{station.warning}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BuiltEnvironment3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const canopyMask = useMemo(() => Array.from({ length: 100 }, (_, index) => ((index * 37) % 100) < 39), []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    element.classList.add("reveal-on-entry");
    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    async function mount() {
      try {
        const THREE = await import("three");
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas || disposed) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
        camera.position.set(8.8, 7.5, 10.5);
        camera.lookAt(0, 0, 0);

        scene.add(new THREE.HemisphereLight(0xffffff, 0x786f62, 2.3));
        const light = new THREE.DirectionalLight(0xffffff, 3.2);
        light.position.set(4, 10, 6);
        light.castShadow = true;
        scene.add(light);

        const campus = new THREE.Group();
        campus.rotation.y = -0.42;
        scene.add(campus);

        const tileGeometry = new THREE.BoxGeometry(0.58, 0.06, 0.58);
        const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x008767, roughness: 0.9 });
        const emptyMaterial = new THREE.MeshStandardMaterial({ color: 0xe3ddd2, roughness: 1 });
        canopyMask.forEach((filled, index) => {
          const tile = new THREE.Mesh(tileGeometry, filled ? greenMaterial : emptyMaterial);
          tile.position.set((index % 10 - 4.5) * 0.64, -0.05, (Math.floor(index / 10) - 4.5) * 0.64);
          tile.receiveShadow = true;
          campus.add(tile);
        });

        const levels = [
          ...Array.from({ length: 9 }, () => ({ color: 0xaeb3b8, height: 0.72 })),
          ...Array.from({ length: 9 }, () => ({ color: 0xf1c400, height: 1.05 })),
          { color: 0x002d72, height: 1.65 },
        ];
        const buildingPositions: Array<[number, number]> = [
          [-2.55, -2.55], [-1.25, -2.5], [0.05, -2.55], [1.35, -2.45], [2.5, -2.5],
          [-2.55, -0.95], [-1.05, -1.15], [0.55, -0.95], [2.2, -1.05],
          [-2.45, 0.55], [-1.1, 0.55], [0.25, 0.8], [1.55, 0.55], [2.55, 0.85],
          [-2.5, 2.25], [-1.15, 2.05], [0.25, 2.4], [1.65, 2.05], [2.55, 2.4],
        ];
        levels.forEach((level, index) => {
          const geometry = new THREE.BoxGeometry(0.38, level.height + (index % 3) * 0.15, 0.38);
          const material = new THREE.MeshStandardMaterial({ color: level.color, roughness: 0.68, metalness: 0.02 });
          const building = new THREE.Mesh(geometry, material);
          const [x, z] = buildingPositions[index];
          building.position.set(x, level.height / 2 + 0.03, z);
          building.castShadow = true;
          building.receiveShadow = true;
          campus.add(building);
        });

        const render = () => {
          const rect = container.getBoundingClientRect();
          const width = Math.max(280, Math.round(rect.width));
          const height = Math.max(360, Math.round(rect.height));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };

        let dragging = false;
        let previousX = 0;
        let previousY = 0;
        const onPointerDown = (event: PointerEvent) => {
          dragging = true;
          previousX = event.clientX;
          previousY = event.clientY;
          canvas.setPointerCapture(event.pointerId);
        };
        const onPointerMove = (event: PointerEvent) => {
          if (!dragging) return;
          campus.rotation.y += (event.clientX - previousX) * 0.008;
          campus.rotation.x = Math.max(-0.35, Math.min(0.35, campus.rotation.x + (event.clientY - previousY) * 0.004));
          previousX = event.clientX;
          previousY = event.clientY;
          render();
        };
        const onPointerUp = (event: PointerEvent) => {
          dragging = false;
          if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
        };
        const onKeyDown = (event: KeyboardEvent) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "ArrowLeft") campus.rotation.y -= 0.12;
          if (event.key === "ArrowRight") campus.rotation.y += 0.12;
          if (event.key === "ArrowUp") campus.rotation.x -= 0.08;
          if (event.key === "ArrowDown") campus.rotation.x += 0.08;
          render();
        };

        let resizeFrame = 0;
        const observer = new ResizeObserver(() => {
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(render);
        });
        observer.observe(container);
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);
        canvas.addEventListener("keydown", onKeyDown);
        render();

        cleanup = () => {
          cancelAnimationFrame(resizeFrame);
          observer.disconnect();
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerup", onPointerUp);
          canvas.removeEventListener("pointercancel", onPointerUp);
          canvas.removeEventListener("keydown", onKeyDown);
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              const material = object.material;
              if (Array.isArray(material)) material.forEach((item) => item.dispose());
              else material.dispose();
            }
          });
          renderer.dispose();
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    }

    void mount();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [canopyMask]);

  return (
    <div className="built-3d">
      <div className="visual-topline"><span>INTERACTIVE 3D CAMPUS FIELD</span><span>DRAG OR USE ARROW KEYS</span></div>
      <div className="three-stage" ref={containerRef}>
        {failed ? (
          <BuiltIsometricFallback canopyMask={canopyMask} />
        ) : (
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="img"
            aria-label="Interactive 3D campus field encoding 19 LEED-certified buildings above a 100-tile field with exactly 39 green tiles for tree-canopy coverage. Drag to rotate or use arrow keys."
          />
        )}
        <div className="three-annotation annotation-buildings"><b>19</b><span>LEED buildings</span></div>
        <div className="three-annotation annotation-canopy"><b>39%</b><span>canopy coverage</span></div>
      </div>
      <div className="three-key">
        <span><i className="key-silver" />9 Silver</span>
        <span><i className="key-gold" />9 Gold</span>
        <span><i className="key-platinum" />1 Platinum</span>
      </div>
    </div>
  );
}

function BuiltIsometricFallback({ canopyMask }: { canopyMask: boolean[] }) {
  const { ref, width } = useChartWidth();
  const height = width < 600 ? 430 : 540;
  const tile = Math.min(width < 600 ? 25 : 34, width / 24);
  const originX = width * 0.56;
  const originY = height * 0.7;
  const cos = Math.cos(Math.PI / 6);
  const sin = Math.sin(Math.PI / 6);
  const project = (x: number, z: number, y = 0) => [
    originX + (x - z) * tile * cos,
    originY + (x + z) * tile * sin - y * tile,
  ] as [number, number];
  const points = (values: Array<[number, number]>) => values.map(([x, y]) => `${x},${y}`).join(" ");
  const ground = Array.from({ length: 100 }, (_, index) => {
    const x = index % 10;
    const z = Math.floor(index / 10);
    return {
      index,
      x,
      z,
      depth: x + z,
      filled: canopyMask[index],
      polygon: points([project(x, z), project(x + 0.92, z), project(x + 0.92, z + 0.92), project(x, z + 0.92)]),
    };
  }).sort((a, b) => a.depth - b.depth);
  const buildingPositions: Array<[number, number]> = [
    [0.6, 0.6], [2.6, 0.8], [4.6, 0.6], [6.6, 0.8], [8.5, 0.6],
    [0.8, 3], [3, 2.7], [5.4, 3.1], [8.1, 2.8],
    [0.5, 5.4], [2.5, 5.2], [4.6, 5.7], [6.7, 5.2], [8.6, 5.6],
    [0.8, 8.1], [2.8, 7.8], [4.8, 8.4], [6.9, 7.9], [8.7, 8.5],
  ];
  const buildings = Array.from({ length: 19 }, (_, index) => {
    const [x, z] = buildingPositions[index];
    const h = index === 18 ? 2.3 : index >= 9 ? 1.35 + (index % 3) * 0.2 : 0.95 + (index % 3) * 0.16;
    const color = index === 18 ? "#002d72" : index >= 9 ? "#f1c400" : "#aeb3b8";
    const side = index === 18 ? "#001f50" : index >= 9 ? "#b99100" : "#787f85";
    const light = index === 18 ? "#33578e" : index >= 9 ? "#f6d94f" : "#d2d5d8";
    const b = project(x + 0.68, z);
    const c = project(x + 0.68, z + 0.68);
    const d = project(x, z + 0.68);
    const at = project(x, z, h);
    const bt = project(x + 0.68, z, h);
    const ct = project(x + 0.68, z + 0.68, h);
    const dt = project(x, z + 0.68, h);
    return {
      index,
      depth: x + z,
      color,
      side,
      light,
      top: points([at, bt, ct, dt]),
      left: points([d, c, ct, dt]),
      right: points([b, c, ct, bt]),
    };
  }).sort((a, b) => a.depth - b.depth);

  return (
    <div
      className="three-fallback"
      ref={ref}
      role="img"
      aria-label="D3 isometric 3D campus field encoding 19 LEED-certified buildings above 100 ground tiles, exactly 39 of which are green for tree-canopy coverage."
    >
      <svg width={width} height={height}>
        <g className="isometric-ground">
          {ground.map((cell) => (
            <polygon
              key={cell.index}
              points={cell.polygon}
              fill={cell.filled ? "#008767" : "#e3ddd2"}
              stroke="#f5f3ee"
              strokeWidth={0.8}
            />
          ))}
        </g>
        <g className="isometric-buildings">
          {buildings.map((building) => (
            <g key={building.index}>
              <title>{building.index === 18 ? "LEED Platinum" : building.index >= 9 ? "LEED Gold" : "LEED Silver"} building</title>
              <polygon points={building.left} fill={building.side} />
              <polygon points={building.right} fill={building.color} />
              <polygon points={building.top} fill={building.light} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

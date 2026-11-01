import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isHub: boolean;
  pulsePhase: number;
}

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 4) <= 4;
    const nodeCount = isMobile ? 18 : 42;
    const maxDistance = isMobile ? 100 : 140;
    const mouseRadius = 160;

    let width = 0;
    let height = 0;
    let animId = 0;
    let lastTime = performance.now();
    let themeColor = 'rgba(255, 255, 255, 0.85)';
    let lineBaseColor = '255, 255, 255';

    const mouse = { x: -9999, y: -9999, active: false };

    // Pre-allocate nodes
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * (window.innerWidth || 1000),
      y: Math.random() * (window.innerHeight || 800),
      vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.5),
      vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.5),
      radius: i % 7 === 0 ? 2.4 : 1.4,
      isHub: i % 7 === 0,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const updateColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const primaryVal = styles.getPropertyValue('--primary')?.trim();
      if (primaryVal) {
        themeColor = `hsl(${primaryVal})`;
        // Attempt to parse HSL lightness or use a clean cyber white/cyan fallback
        lineBaseColor = '255, 255, 255';
      } else {
        themeColor = 'rgba(255, 255, 255, 0.85)';
        lineBaseColor = '255, 255, 255';
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep nodes within new boundaries
      for (const n of nodes) {
        if (n.x > width) n.x = Math.random() * width;
        if (n.y > height) n.y = Math.random() * height;
      }

      updateColors();
      if (reducedMotion.matches) {
        renderFrame(0);
      }
    };

    const renderFrame = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);

      // Update positions
      if (!reducedMotion.matches) {
        for (let i = 0; i < nodeCount; i++) {
          const n = nodes[i];
          n.x += n.vx * (dt * 60);
          n.y += n.vy * (dt * 60);

          // Bounce off screen walls
          if (n.x <= 0) {
            n.x = 0;
            n.vx *= -1;
          } else if (n.x >= width) {
            n.x = width;
            n.vx *= -1;
          }

          if (n.y <= 0) {
            n.y = 0;
            n.vy *= -1;
          } else if (n.y >= height) {
            n.y = height;
            n.vy *= -1;
          }
        }
      }

      // Draw connection lines between nodes
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodeCount; i++) {
        const p1 = nodes[i];
        for (let j = i + 1; j < nodeCount; j++) {
          const p2 = nodes[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = maxDistance * maxDistance;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.strokeStyle = `rgba(${lineBaseColor}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to active mouse pointer
        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          if (mDistSq < mouseRadius * mouseRadius) {
            const mDist = Math.sqrt(mDistSq);
            const mAlpha = (1 - mDist / mouseRadius) * 0.28;
            ctx.strokeStyle = `rgba(${lineBaseColor}, ${mAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];

        // Core dot
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = n.isHub ? 0.6 : 0.35;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Hub pulse ring
        if (n.isHub && !reducedMotion.matches) {
          const pulse = (Math.sin(timestamp * 0.0025 + n.pulsePhase) + 1) * 0.5;
          const ringRadius = n.radius + 3 + pulse * 4;
          ctx.strokeStyle = themeColor;
          ctx.globalAlpha = 0.15 * (1 - pulse);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    };

    const loop = (timestamp: number) => {
      if (!document.hidden) {
        renderFrame(timestamp);
      }
      animId = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(animId);
      if (reducedMotion.matches) {
        renderFrame(0);
      } else {
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    };

    // Event listeners
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        start();
      }
    };

    const themeObserver = new MutationObserver(() => {
      updateColors();
      if (reducedMotion.matches) renderFrame(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    handleResize();
    start();

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
    />
  );
}

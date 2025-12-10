import { useEffect, useRef, useState } from 'react';

const PineappleEasterEgg = () => {
    const containerRef = useRef(null);
    const [pineapples, setPineapples] = useState([]);
    const requestRef = useRef();

    // Initialize pineapples
    useEffect(() => {
        const count = 3; // Number of pineapples
        const speed = 3; // Constant speed
        const initialPineapples = Array.from({ length: count }).map(() => ({
            id: Math.random(),
            x: Math.random() * (window.innerWidth - 50),
            y: Math.random() * (window.innerHeight - 50),
            vx: (Math.random() - 0.5) * speed * 2,
            vy: (Math.random() - 0.5) * speed * 2,
            size: 20 + Math.random() * 30,
            status: 'active', // active, exploding, hidden
            scale: 1,
            opacity: 1,
        }));
        setPineapples(initialPineapples);

        const handleResize = () => {
            // Optional: Handle resize if necessary
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePineappleClick = (id) => {
        setPineapples((prev) =>
            prev.map(p => p.id === id ? { ...p, status: 'exploding', explosionStart: Date.now() } : p)
        );
    };

    // Animation Loop
    useEffect(() => {
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            setPineapples((prevPineapples) => {
                const now = Date.now();
                return prevPineapples.map((p) => {
                    // Handle Hidden State (Respawn)
                    if (p.status === 'hidden') {
                        if (now > p.respawnTime) {
                            return {
                                ...p,
                                status: 'active',
                                x: Math.random() * (window.innerWidth - 50),
                                y: Math.random() * (window.innerHeight - 50),
                                vx: (Math.random() - 0.5) * 6, // New random velocity
                                vy: (Math.random() - 0.5) * 6,
                                scale: 1,
                                opacity: 1,
                            };
                        }
                        return p;
                    }

                    // Handle Exploding State
                    if (p.status === 'exploding') {
                        const progress = (now - p.explosionStart) / 300; // 300ms explosion
                        if (progress >= 1) {
                            return { ...p, status: 'hidden', respawnTime: now + 10000 }; // 100s respawn
                        }
                        return { ...p, scale: 1 + progress * 2, opacity: 1 - progress };
                    }

                    // Active State Logic
                    let { x, y, vx, vy } = p;

                    // 1. Mouse Repulsion
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const repulsionRadius = 150;

                    if (distance < repulsionRadius) {
                        const force = (repulsionRadius - distance) / repulsionRadius;
                        const angle = Math.atan2(dy, dx);
                        const pushStrength = 0.5;

                        vx += Math.cos(angle) * pushStrength * force;
                        vy += Math.sin(angle) * pushStrength * force;
                    }

                    // 2. Base Movement (Constant Speed Logic)
                    const currentSpeed = Math.sqrt(vx * vx + vy * vy);
                    const targetSpeed = 3.0;

                    if (currentSpeed > 0) {
                        const scale = (currentSpeed + (targetSpeed - currentSpeed) * 0.05) / currentSpeed;
                        vx *= scale;
                        vy *= scale;
                    }

                    // Move
                    x += vx;
                    y += vy;

                    // 3. Boundary Bounce
                    const padding = 50;
                    if (x <= 0) { x = 0; vx = Math.abs(vx); }
                    if (x >= window.innerWidth - padding) { x = window.innerWidth - padding; vx = -Math.abs(vx); }
                    if (y <= 0) { y = 0; vy = Math.abs(vy); }
                    if (y >= window.innerHeight - padding) { y = window.innerHeight - padding; vy = -Math.abs(vy); }

                    return { ...p, x, y, vx, vy, scale: 1, opacity: 1 };
                });
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
                overflow: 'hidden',
            }}
        >
            {pineapples.map((p) => (
                <div
                    key={p.id}
                    onMouseDown={(e) => {
                        // Prevent click from propagating if needed, though pointerEvents: none on parent handles most
                        e.stopPropagation();
                        handlePineappleClick(p.id);
                    }}
                    style={{
                        position: 'absolute',
                        transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                        opacity: p.opacity,
                        fontSize: `${p.size}px`,
                        userSelect: 'none',
                        willChange: 'transform, opacity',
                        pointerEvents: p.status === 'active' ? 'auto' : 'none', // Enable click
                        cursor: 'pointer',
                        display: p.status === 'hidden' ? 'none' : 'block',
                        transition: p.status === 'exploding' ? 'none' : 'transform 0.1s linear', // Smooth movement
                    }}
                >
                    🍍
                </div>
            ))}
        </div>
    );
};

export default PineappleEasterEgg;

import { useEffect, useRef } from 'react';

interface BubbleCursorProps {
    zIndex?: number;
}

class Particle {
    lifeSpan: number;
    initialLifeSpan: number;
    velocity: { x: number; y: number };
    position: { x: number; y: number };
    baseDimension: number;

    constructor(x: number, y: number) {
        this.initialLifeSpan = Math.floor(Math.random() * 60 + 60);
        this.lifeSpan = this.initialLifeSpan;
        this.velocity = {
            x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
            y: -0.4 + Math.random() * -1,
        };
        this.position = { x, y };
        this.baseDimension = 4;
    }

    update(context: CanvasRenderingContext2D) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75;
        this.velocity.y -= Math.random() / 600;
        this.lifeSpan--;

        const scale =
            0.2 + (this.initialLifeSpan - this.lifeSpan) / this.initialLifeSpan;

        context.fillStyle = '#e6f1f7';
        context.strokeStyle = '#3a92c5';
        context.beginPath();
        context.arc(
            this.position.x - (this.baseDimension / 2) * scale,
            this.position.y - this.baseDimension / 2,
            this.baseDimension * scale,
            0,
            2 * Math.PI,
        );

        context.stroke();
        context.fill();
        context.closePath();
    }
}

export default function BubbleCursor({ zIndex = 50 }: BubbleCursorProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const cursorRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );

        if (prefersReducedMotion.matches) {
            return;
        }

        let canvas: HTMLCanvasElement | null = null;
        let context: CanvasRenderingContext2D | null = null;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const init = () => {
            canvas = canvasRef.current;

            if (!canvas) {
                return;
            }

            context = canvas.getContext('2d');

            if (!context) {
                return;
            }

            canvas.style.top = '0px';
            canvas.style.left = '0px';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = zIndex.toString();
            canvas.width = width;
            canvas.height = height;

            bindEvents();
            loop();
        };

        const onMouseMove = (e: MouseEvent) => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;

            addParticle(cursorRef.current.x, cursorRef.current.y);
        };

        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                for (let i = 0; i < e.touches.length; i++) {
                    addParticle(e.touches[i].clientX, e.touches[i].clientY);
                }
            }
        };

        const onWindowResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            if (!canvasRef.current) {
                return;
            }

            canvasRef.current.width = width;
            canvasRef.current.height = height;
        };

        const addParticle = (x: number, y: number) => {
            particlesRef.current.push(new Particle(x, y));
        };

        const updateParticles = () => {
            if (!canvas || !context) {
                return;
            }

            if (particlesRef.current.length === 0) {
                return;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesRef.current.length; i++) {
                particlesRef.current[i].update(context);
            }

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                if (particlesRef.current[i].lifeSpan < 0) {
                    particlesRef.current.splice(i, 1);
                }
            }

            if (particlesRef.current.length === 0) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        const loop = () => {
            updateParticles();
            animationFrameRef.current = requestAnimationFrame(loop);
        };

        const bindEvents = () => {
            document.body.addEventListener('mousemove', onMouseMove);
            document.body.addEventListener('touchmove', onTouchMove, {
                passive: true,
            });
            document.body.addEventListener('touchstart', onTouchMove, {
                passive: true,
            });
            window.addEventListener('resize', onWindowResize);
        };

        init();

        return () => {
            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('touchmove', onTouchMove);
            document.body.removeEventListener('touchstart', onTouchMove);
            window.removeEventListener('resize', onWindowResize);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            particlesRef.current = [];
        };
    }, [zIndex]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 h-full w-full print:hidden"
        />
    );
}

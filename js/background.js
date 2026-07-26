export function initAmbientParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const particleCanvas = canvas;
    const drawingContext = ctx;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particleCount = window.innerWidth < 640 ? 14 : 28;
    const particles = createParticles(particleCount);
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastFrame = 0;

    function resizeCanvas() {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        particleCanvas.width = Math.round(width * ratio);
        particleCanvas.height = Math.round(height * ratio);
        particleCanvas.style.width = `${width}px`;
        particleCanvas.style.height = `${height}px`;
        drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    /** @param {number} time */
    function render(time) {
        if (time - lastFrame < 32) {
            animationFrame = requestAnimationFrame(render);
            return;
        }

        lastFrame = time;
        drawParticles(drawingContext, particles, width, height, !motionQuery.matches, time);
        if (!motionQuery.matches) animationFrame = requestAnimationFrame(render);
    }

    function updateAnimation() {
        cancelAnimationFrame(animationFrame);
        if (document.hidden) return;
        animationFrame = requestAnimationFrame(render);
    }

    resizeCanvas();
    updateAnimation();

    window.addEventListener('resize', () => {
        resizeCanvas();
        updateAnimation();
    }, { passive: true });
    document.addEventListener('visibilitychange', updateAnimation);
    motionQuery.addEventListener('change', updateAnimation);
}

/** @param {number} count */
function createParticles(count) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18 - 0.06,
            alpha: Math.random() * 0.3 + 0.08,
        });
    }
    return particles;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {ReturnType<typeof createParticles>} particles
 * @param {number} width
 * @param {number} height
 * @param {boolean} animate
 * @param {number} time
 */
function drawParticles(ctx, particles, width, height, animate, time) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
        if (animate) {
            particle.x += particle.vx / Math.max(width, 1);
            particle.y += particle.vy / Math.max(height, 1);
        }

        if (particle.x < 0) particle.x = 1;
        if (particle.x > 1) particle.x = 0;
        if (particle.y < 0) particle.y = 1;
        if (particle.y > 1) particle.y = 0;

        const pulse = Math.sin(time * 0.0015 + particle.x * 8) * 0.05;
        ctx.beginPath();
        ctx.arc(particle.x * width, particle.y * height, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 49, 49, ${Math.max(0.04, particle.alpha + pulse)})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff3131';
        ctx.fill();
    });
}

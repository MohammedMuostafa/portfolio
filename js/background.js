/* ==========================================================================
   BACKGROUND MODULE: MULTI-LAYER PARTICLES & AMBIENT AURORA CANVAS
   ========================================================================== */

export function initAmbientParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18 - 0.06,
            alpha: Math.random() * 0.4 + 0.1,
            pulse: Math.random() * 0.02
        });
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function render() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha += Math.sin(Date.now() * 0.002) * p.pulse * 0.05;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 30, 30, ${Math.max(0.05, Math.min(0.5, p.alpha))})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff1e1e';
            ctx.fill();
        });
        requestAnimationFrame(render);
    }
    render();
}

/**
 * Draws a lightweight, pointer-reactive Web3 network behind the document.
 * @returns {() => void}
 */
export function initNetworkBackground() {
    const canvasElement = document.getElementById('network-canvas');
    if (!(canvasElement instanceof HTMLCanvasElement)) return () => {};
    const canvas = canvasElement;

    const drawingContext = canvas.getContext('2d');
    if (!drawingContext) return () => {};
    const context = drawingContext;

    const controller = new AbortController();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    /** @type {Array<{x: number, y: number, vx: number, vy: number, radius: number, red: boolean}>} */
    let nodes = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let running = false;
    const pointer = { x: 0, y: 0, active: false };

    function resize() {
        width = Math.round(window.visualViewport?.width ?? document.documentElement.clientWidth);
        height = window.innerHeight;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        createNodes();
        draw(false);
    }

    function createNodes() {
        const nodeCount = width < 768 ? 20 : (width < 1280 ? 30 : 38);
        nodes = Array.from({ length: nodeCount }, (_, index) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            radius: index % 7 === 0 ? 1.7 : 1.1,
            red: index % 5 === 0,
        }));
    }

    /** @param {boolean} update */
    function draw(update) {
        context.clearRect(0, 0, width, height);

        if (pointer.active) {
            const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 220);
            glow.addColorStop(0, 'rgba(255, 61, 66, 0.07)');
            glow.addColorStop(1, 'rgba(255, 61, 66, 0)');
            context.fillStyle = glow;
            context.fillRect(pointer.x - 220, pointer.y - 220, 440, 440);
        }

        nodes.forEach((node) => {
            if (!update) return;
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < -10) node.x = width + 10;
            else if (node.x > width + 10) node.x = -10;
            if (node.y < -10) node.y = height + 10;
            else if (node.y > height + 10) node.y = -10;

            if (!pointer.active) return;
            const offsetX = node.x - pointer.x;
            const offsetY = node.y - pointer.y;
            const distance = Math.hypot(offsetX, offsetY);
            if (distance > 0 && distance < 150) {
                const force = (150 - distance) / 150;
                node.x += (offsetX / distance) * force * 0.55;
                node.y += (offsetY / distance) * force * 0.55;
            }
        });

        const connectionDistance = width < 768 ? 118 : 152;
        for (let first = 0; first < nodes.length; first++) {
            for (let second = first + 1; second < nodes.length; second++) {
                const nodeA = nodes[first];
                const nodeB = nodes[second];
                const distance = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
                if (distance >= connectionDistance) continue;

                context.beginPath();
                context.moveTo(nodeA.x, nodeA.y);
                context.lineTo(nodeB.x, nodeB.y);
                context.strokeStyle = `rgba(170, 180, 205, ${(1 - (distance / connectionDistance)) * 0.12})`;
                context.lineWidth = 0.7;
                context.stroke();
            }
        }

        nodes.forEach((node) => {
            context.beginPath();
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            context.fillStyle = node.red ? 'rgba(255, 91, 96, 0.72)' : 'rgba(160, 225, 244, 0.58)';
            context.fill();
        });
    }

    /** @param {number} timestamp */
    function animate(timestamp) {
        if (!running) return;
        frame = window.requestAnimationFrame(animate);
        if (timestamp - lastFrame < 32) return;
        lastFrame = timestamp;
        draw(true);
    }

    function updateAnimationState() {
        running = !motionQuery.matches && !document.hidden;
        window.cancelAnimationFrame(frame);
        if (running) frame = window.requestAnimationFrame(animate);
        else draw(false);
    }

    window.addEventListener('resize', resize, { signal: controller.signal });
    document.addEventListener('visibilitychange', updateAnimationState, { signal: controller.signal });
    motionQuery.addEventListener('change', updateAnimationState, { signal: controller.signal });

    if (finePointerQuery.matches) {
        window.addEventListener('pointermove', (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = true;
        }, { passive: true, signal: controller.signal });
        document.addEventListener('pointerleave', () => {
            pointer.active = false;
        }, { signal: controller.signal });
    }

    resize();
    updateAnimationState();

    return () => {
        running = false;
        window.cancelAnimationFrame(frame);
        controller.abort();
    };
}

import { clamp, lerp } from './motion.js';

const sceneProfiles = new Map([
    ['home', { energy: 0.8, connections: 1, focus: 0 }],
    ['about', { energy: 0.45, connections: 0.75, focus: 0 }],
    ['current-project', { energy: 0.7, connections: 0.95, focus: 0.08 }],
    ['experience', { energy: 1, connections: 1.15, focus: 0 }],
    ['education', { energy: 0.5, connections: 0.8, focus: 0 }],
    ['skills', { energy: 0.85, connections: 1.22, focus: 0.04 }],
    ['details', { energy: 0.5, connections: 0.82, focus: 0 }],
    ['connect', { energy: 0.7, connections: 1.05, focus: 0.2 }],
]);

export function initNetworkBackground() {
    const canvasElement = document.getElementById('network-canvas');
    const backgroundElement = document.querySelector('.site-background');
    if (!(canvasElement instanceof HTMLCanvasElement) || !(backgroundElement instanceof HTMLElement)) return () => {};
    const contextValue = canvasElement.getContext('2d');
    if (!contextValue) return () => {};

    const canvas = canvasElement;
    const background = backgroundElement;
    const context = contextValue;
    const controller = new AbortController();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    /** @type {Array<{x: number, y: number, vx: number, vy: number, radius: number, red: boolean}>} */
    let nodes = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let resizeFrame = 0;
    let lastFrame = 0;
    let running = false;
    const defaultProfile = sceneProfiles.get('home');
    if (!defaultProfile) return () => {};
    let activeProfile = defaultProfile;
    let energy = activeProfile.energy;
    let connections = activeProfile.connections;
    let focus = activeProfile.focus;
    let previousScrollY = window.scrollY;
    let previousScrollTime = performance.now();
    let targetScrollVelocity = 0;
    let scrollVelocity = 0;
    let scrollDirection = 0;
    let targetScrollProgress = 0;
    let scrollProgress = 0;
    const pointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2,
        active: false,
    };

    function resize() {
        const previousWidth = width;
        const previousHeight = height;
        width = Math.round(window.visualViewport?.width ?? document.documentElement.clientWidth);
        height = Math.round(window.visualViewport?.height ?? window.innerHeight);
        if (pointer.active && previousWidth && previousHeight) {
            pointer.x = (pointer.x / previousWidth) * width;
            pointer.y = (pointer.y / previousHeight) * height;
            pointer.targetX = (pointer.targetX / previousWidth) * width;
            pointer.targetY = (pointer.targetY / previousHeight) * height;
        } else {
            pointer.x = width / 2;
            pointer.y = height / 2;
            pointer.targetX = width / 2;
            pointer.targetY = height / 2;
        }
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        const expectedNodeCount = getNodeCount();
        if (!previousWidth || !previousHeight || nodes.length !== expectedNodeCount) {
            createNodes();
        } else {
            nodes.forEach((node) => {
                node.x = (node.x / previousWidth) * width;
                node.y = (node.y / previousHeight) * height;
            });
        }
        draw(false);
    }

    function getNodeCount() {
        return width < 480 ? 16 : (width < 768 ? 20 : (width < 1280 ? 28 : 36));
    }

    function createNodes() {
        const count = getNodeCount();
        nodes = Array.from({ length: count }, (_, index) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            radius: index % 7 === 0 ? 1.7 : 1.05,
            red: index % 5 === 0,
        }));
    }

    /** @param {boolean} update */
    function draw(update) {
        context.clearRect(0, 0, width, height);
        pointer.x = lerp(pointer.x, pointer.targetX, 0.075);
        pointer.y = lerp(pointer.y, pointer.targetY, 0.075);
        energy = lerp(energy, activeProfile.energy, 0.035);
        connections = lerp(connections, activeProfile.connections, 0.035);
        focus = lerp(focus, activeProfile.focus, 0.035);
        scrollVelocity = lerp(scrollVelocity, targetScrollVelocity, 0.09);
        scrollProgress = lerp(scrollProgress, targetScrollProgress, 0.045);
        targetScrollVelocity *= 0.92;

        background.style.setProperty('--bg-x', `${((pointer.x / Math.max(width, 1)) - 0.5) * -10}px`);
        background.style.setProperty('--bg-y', `${((pointer.y / Math.max(height, 1)) - 0.5) * -8}px`);
        background.style.setProperty('--bg-scroll', `${(scrollProgress - 0.5) * -18}px`);
        background.style.setProperty('--bg-accent', String(energy));

        const glowRadius = 190 + (scrollVelocity * 45);
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, glowRadius);
        glow.addColorStop(0, `rgba(255, 61, 66, ${pointer.active ? 0.075 : 0.035})`);
        glow.addColorStop(1, 'rgba(255, 61, 66, 0)');
        context.fillStyle = glow;
        context.fillRect(pointer.x - glowRadius, pointer.y - glowRadius, glowRadius * 2, glowRadius * 2);

        if (update) {
            const speed = 1 + (energy * 0.16) + (scrollVelocity * 0.85);
            nodes.forEach((node) => {
                node.x += node.vx * speed;
                node.y += (node.vy * speed) + (scrollDirection * scrollVelocity * 0.08);

                if (focus > 0) {
                    node.x += ((width / 2) - node.x) * focus * 0.00035;
                    node.y += ((height / 2) - node.y) * focus * 0.00035;
                }

                if (node.x < -12) node.x = width + 12;
                else if (node.x > width + 12) node.x = -12;
                if (node.y < -12) node.y = height + 12;
                else if (node.y > height + 12) node.y = -12;

                if (!pointer.active) return;
                const offsetX = node.x - pointer.x;
                const offsetY = node.y - pointer.y;
                const distance = Math.hypot(offsetX, offsetY);
                if (distance > 0 && distance < 165) {
                    const force = (165 - distance) / 165;
                    node.x += (offsetX / distance) * force * 0.5;
                    node.y += (offsetY / distance) * force * 0.5;
                }
            });
        }

        const connectionDistance = (width < 768 ? 112 : 148) * connections;
        for (let first = 0; first < nodes.length; first++) {
            for (let second = first + 1; second < nodes.length; second++) {
                const nodeA = nodes[first];
                const nodeB = nodes[second];
                const distance = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
                if (distance >= connectionDistance) continue;
                const pointerDistance = Math.min(
                    Math.hypot(nodeA.x - pointer.x, nodeA.y - pointer.y),
                    Math.hypot(nodeB.x - pointer.x, nodeB.y - pointer.y),
                );
                const pointerBoost = pointer.active && pointerDistance < 180 ? (1 - (pointerDistance / 180)) * 0.12 : 0;
                const opacity = ((1 - (distance / connectionDistance)) * 0.105 * energy) + pointerBoost;

                context.beginPath();
                context.moveTo(nodeA.x, nodeA.y);
                context.lineTo(nodeB.x, nodeB.y);
                context.strokeStyle = `rgba(170, 184, 210, ${opacity})`;
                context.lineWidth = 0.65 + (scrollVelocity * 0.12);
                context.stroke();
            }
        }

        nodes.forEach((node) => {
            context.beginPath();
            context.arc(node.x, node.y, node.radius + (scrollVelocity * 0.14), 0, Math.PI * 2);
            context.fillStyle = node.red
                ? `rgba(255, 91, 96, ${0.5 + (energy * 0.2)})`
                : `rgba(160, 225, 244, ${0.38 + (energy * 0.16)})`;
            context.fill();
        });
    }

    /** @param {number} timestamp */
    function animate(timestamp) {
        if (!running) return;
        frame = window.requestAnimationFrame(animate);
        const minimumFrameDuration = width < 768 ? 30 : 16;
        if (timestamp - lastFrame < minimumFrameDuration) return;
        lastFrame = timestamp;
        draw(true);
    }

    function updateAnimationState() {
        running = !motionQuery.matches && !document.hidden;
        window.cancelAnimationFrame(frame);
        if (running) frame = window.requestAnimationFrame(animate);
        else draw(false);
    }

    function handleScroll() {
        const now = performance.now();
        const currentY = window.scrollY;
        const delta = currentY - previousScrollY;
        const elapsed = Math.max(now - previousScrollTime, 16);
        targetScrollVelocity = clamp(Math.abs(delta) / elapsed, 0, 1.8);
        scrollDirection = Math.sign(delta);
        targetScrollProgress = currentY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        previousScrollY = currentY;
        previousScrollTime = now;
    }

    const scheduleResize = () => {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(resize);
    };
    window.addEventListener('resize', scheduleResize, { signal: controller.signal });
    window.visualViewport?.addEventListener('resize', scheduleResize, { signal: controller.signal });
    window.addEventListener('scroll', handleScroll, { passive: true, signal: controller.signal });
    window.addEventListener('portfolio:section-change', (event) => {
        const sectionId = event instanceof CustomEvent ? event.detail?.id : 'home';
        activeProfile = sceneProfiles.get(typeof sectionId === 'string' ? sectionId : 'home') ?? defaultProfile;
    }, { signal: controller.signal });
    document.addEventListener('visibilitychange', updateAnimationState, { signal: controller.signal });
    motionQuery.addEventListener('change', updateAnimationState, { signal: controller.signal });

    if (finePointerQuery.matches) {
        window.addEventListener('pointermove', (event) => {
            pointer.targetX = event.clientX;
            pointer.targetY = event.clientY;
            pointer.active = true;
        }, { passive: true, signal: controller.signal });
        document.addEventListener('pointerleave', () => {
            pointer.active = false;
            pointer.targetX = width / 2;
            pointer.targetY = height / 2;
        }, { signal: controller.signal });
    }

    resize();
    handleScroll();
    updateAnimationState();

    return () => {
        running = false;
        window.cancelAnimationFrame(frame);
        window.cancelAnimationFrame(resizeFrame);
        controller.abort();
    };
}

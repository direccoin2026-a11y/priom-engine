/**
 * Minimap.js — Priom v0.3
 * Minimapa 2D (canvas aparte, no toca el pipeline 3D): terreno de fondo
 * por altura/bioma, puntos por tipo de entidad, y un triángulo que
 * marca dónde está y hacia dónde mira la cámara. Se actualiza en un
 * temporizador propio, no cada frame — es solo una ayuda de
 * orientación, no necesita ser instantáneo.
 */
(function() {
    'use strict';

    class Minimap {
        constructor(engine, canvas, options = {}) {
            this.engine = engine;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.worldRange = options.worldRange || 250; // unidades de mundo visibles en el minimapa
            this.updateInterval = options.updateInterval || 0.4; // segundos
            this._timer = 0;
            this._bgDirty = true;
            this._bgCache = null;
        }

        update(delta) {
            this._timer += delta;
            if (this._timer < this.updateInterval) return;
            this._timer = 0;
            this._draw();
        }

        _worldToMap(x, z, cx, cz, size) {
            const scale = size / (this.worldRange * 2);
            return {
                x: size / 2 + (x - cx) * scale,
                y: size / 2 + (z - cz) * scale
            };
        }

        _draw() {
            try {
                const renderer = this.engine.getModule('renderer');
                const gameWorld = this.engine.getModule('gameWorld');
                const ecs = this.engine.getModule('ecs');
                if (!renderer) return;

                const size = this.canvas.width;
                const ctx = this.ctx;
                const camPos = renderer.camera.position;
                const cx = camPos.x, cz = camPos.z;

                ctx.clearRect(0, 0, size, size);

                // Fondo circular semitransparente
                ctx.save();
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
                ctx.clip();
                ctx.fillStyle = 'rgba(10, 15, 10, 0.55)';
                ctx.fillRect(0, 0, size, size);

                // Terreno de fondo (muestreo de bioma/altura en una grilla)
                const terrain = gameWorld && gameWorld.generators ? gameWorld.generators.terrain : null;
                if (terrain && terrain.getHeight) {
                    const grid = 24;
                    const step = size / grid;
                    for (let gx = 0; gx < grid; gx++) {
                        for (let gz = 0; gz < grid; gz++) {
                            const worldX = cx + ((gx / grid - 0.5) * this.worldRange * 2);
                            const worldZ = cz + ((gz / grid - 0.5) * this.worldRange * 2);
                            const h = terrain.getHeight(worldX, worldZ);
                            const biome = terrain.getBiome ? terrain.getBiome(worldX, worldZ) : 2;
                            
                            let color = '#3d6b2e'; // pradera por defecto
                            if (biome === 0) color = '#1c3a5e'; // océano
                            else if (biome === 1) color = '#c2a25a'; // playa
                            else if (biome === 3) color = '#1f4a1a'; // bosque
                            else if (biome === 4) color = '#8a8a92'; // montaña
                            else if (biome === 5) color = '#c2a25a'; // desierto
                            else if (biome === 6) color = '#c8d0d8'; // tundra
                            
                            ctx.fillStyle = color;
                            ctx.fillRect(gx * step, gz * step, step + 1, step + 1);
                        }
                    }
                }

                // Cuerpos de agua (lagos)
                if (gameWorld && gameWorld.ecosystems && gameWorld.ecosystems.waterBodies) {
                    ctx.fillStyle = 'rgba(50, 120, 200, 0.7)';
                    for (const body of gameWorld.ecosystems.waterBodies.values()) {
                        const p = this._worldToMap(body.x, body.z, cx, cz, size);
                        if (p.x >= 0 && p.x <= size && p.y >= 0 && p.y <= size) {
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }

                // Entidades (árboles, animales, bisontes) cerca del jugador
                if (ecs && gameWorld && gameWorld.ecosystems && gameWorld.ecosystems.entities) {
                    const drawSet = (set, color, radius) => {
                        ctx.fillStyle = color;
                        for (const id of set) {
                            const dx = ecs.posX[id] - cx;
                            const dz = ecs.posZ[id] - cz;
                            if (Math.abs(dx) > this.worldRange || Math.abs(dz) > this.worldRange) continue;
                            const p = this._worldToMap(ecs.posX[id], ecs.posZ[id], cx, cz, size);
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    };
                    drawSet(gameWorld.ecosystems.entities.trees, 'rgba(40,110,40,0.85)', 1.3);
                    drawSet(gameWorld.ecosystems.entities.animals, '#ffcc55', 2.2);
                }

                ctx.restore();

                // Borde del círculo
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(120,255,180,0.6)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Marcador de cámara (triángulo apuntando hacia donde mira)
                const dir = new THREE.Vector3();
                renderer.camera.getWorldDirection(dir);
                const angle = Math.atan2(dir.x, dir.z);
                
                ctx.save();
                ctx.translate(size / 2, size / 2);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, -7);
                ctx.lineTo(5, 6);
                ctx.lineTo(-5, 6);
                ctx.closePath();
                ctx.fillStyle = '#4fe0c0';
                ctx.fill();
                ctx.restore();
            } catch (e) {
                console.warn('⚠️ Minimap: error al dibujar', e);
            }
        }
    }

    window.Minimap = Minimap;
    console.log('🗺️ Minimap cargado (Priom v0.3)');
})();

/**
 * TextureFactory.js
 * Generador de texturas procedurales (canvas) sin depender de internet.
 * Utilidad compartida para nuevos módulos visuales (nubes, terreno, agua).
 */
(function() {
    'use strict';

    class TextureFactory {
        static _cache = new Map();

        static noise(size = 256, options = {}) {
            const key = 'noise_' + size + '_' + JSON.stringify(options);
            if (this._cache.has(key)) return this._cache.get(key);

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const imgData = ctx.createImageData(size, size);
            const base = options.base || 200;
            const variance = options.variance || 55;

            for (let i = 0; i < imgData.data.length; i += 4) {
                const v = base + (Math.random() - 0.5) * variance;
                imgData.data[i] = v;
                imgData.data[i + 1] = v;
                imgData.data[i + 2] = v;
                imgData.data[i + 3] = 255;
            }
            ctx.putImageData(imgData, 0, 0);

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cache.set(key, texture);
            return texture;
        }

        static cloudAlpha(size = 256) {
            const key = 'cloud_' + size;
            if (this._cache.has(key)) return this._cache.get(key);

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, size, size);

            // Blobs suaves superpuestos para simular nubes
            for (let i = 0; i < 40; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = size * (0.08 + Math.random() * 0.18);
                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                grad.addColorStop(0, 'rgba(255,255,255,0.9)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cache.set(key, texture);
            return texture;
        }

        static gradient(colorTop, colorBottom, size = 128) {
            const key = 'grad_' + colorTop + '_' + colorBottom;
            if (this._cache.has(key)) return this._cache.get(key);

            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 0, size);
            grad.addColorStop(0, colorTop);
            grad.addColorStop(1, colorBottom);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1, size);

            const texture = new THREE.CanvasTexture(canvas);
            this._cache.set(key, texture);
            return texture;
        }

        // Mapa de oclusión ambiental procedural (manchas suaves oscuras)
        static ambientOcclusion(size = 256, intensity = 0.6) {
            const key = 'ao_' + size + '_' + intensity;
            if (this._cache.has(key)) return this._cache.get(key);

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);

            for (let i = 0; i < 120; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = size * (0.02 + Math.random() * 0.06);
                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                const dark = 1 - intensity;
                grad.addColorStop(0, `rgba(${dark * 255},${dark * 255},${dark * 255},0.5)`);
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cache.set(key, texture);
            return texture;
        }

        // Mapa de altura/desplazamiento (grises de baja frecuencia, tipo colinas)
        static heightMap(size = 256, octaves = 4) {
            const key = 'height_' + size + '_' + octaves;
            if (this._cache.has(key)) return this._cache.get(key);

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const data = new Float32Array(size * size);

            for (let o = 0; o < octaves; o++) {
                const freq = Math.pow(2, o);
                const amp = 1 / freq;
                const cellsX = Math.max(2, Math.floor(size / (32 / freq)));
                const cellsY = cellsX;
                const cellW = size / cellsX;
                const cellH = size / cellsY;
                const cellValues = [];
                for (let cy = 0; cy <= cellsY; cy++) {
                    cellValues.push([]);
                    for (let cx = 0; cx <= cellsX; cx++) {
                        cellValues[cy].push(Math.random());
                    }
                }
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        const cx = Math.floor(x / cellW);
                        const cy = Math.floor(y / cellH);
                        const v = cellValues[cy][cx];
                        data[y * size + x] += v * amp;
                    }
                }
            }

            let maxVal = 0;
            for (let i = 0; i < data.length; i++) maxVal = Math.max(maxVal, data[i]);

            const imgData = ctx.createImageData(size, size);
            for (let i = 0; i < data.length; i++) {
                const v = (data[i] / maxVal) * 255;
                imgData.data[i * 4] = v;
                imgData.data[i * 4 + 1] = v;
                imgData.data[i * 4 + 2] = v;
                imgData.data[i * 4 + 3] = 255;
            }
            ctx.putImageData(imgData, 0, 0);

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cache.set(key, texture);
            return texture;
        }

        // Genera el set PBR completo (diffuse/roughness/normal/AO/height) para un material dado
        static pbrSet(options = {}) {
            const size = options.size || 256;
            return {
                map: this.noise(size, { base: options.base || 200, variance: options.variance || 55 }),
                roughnessMap: this.noise(size, { base: 180, variance: 90 }),
                normalMap: this.fakeNormalFromNoise(size, options.normalStrength || 1.0),
                aoMap: this.ambientOcclusion(size, options.aoIntensity || 0.6),
                displacementMap: this.heightMap(size, 3)
            };
        }
        // Silueta de árbol para impostores billboard (v0.3): tronco +
        // copa dibujados en canvas, con forma real (no un cuadrado verde)
        static treeBillboard(size = 128) {
            const key = 'tree_billboard_' + size;
            if (this._cache.has(key)) return this._cache.get(key);

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);

            const cx = size / 2;
            
            // Tronco
            ctx.fillStyle = '#4a3018';
            ctx.fillRect(cx - size * 0.035, size * 0.72, size * 0.07, size * 0.24);
            
            // 3 capas de copa (misma silueta que el árbol 3D, para que combine)
            const layers = [
                { r: size * 0.32, y: size * 0.62, shade: '#2f6524' },
                { r: size * 0.26, y: size * 0.42, shade: '#3a7a2e' },
                { r: size * 0.18, y: size * 0.24, shade: '#4a8f3a' }
            ];
            for (const layer of layers) {
                ctx.beginPath();
                ctx.moveTo(cx, layer.y - layer.r * 1.3);
                ctx.lineTo(cx - layer.r, layer.y + layer.r * 0.5);
                ctx.lineTo(cx + layer.r, layer.y + layer.r * 0.5);
                ctx.closePath();
                ctx.fillStyle = layer.shade;
                ctx.fill();
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            this._cache.set(key, texture);
            return texture;
        }

        static fakeNormalFromNoise(size = 256, strength = 1.0) {
            const key = 'normal_' + size + '_' + strength;
            if (this._cache.has(key)) return this._cache.get(key);

            const heightCanvas = document.createElement('canvas');
            heightCanvas.width = size;
            heightCanvas.height = size;
            const hctx = heightCanvas.getContext('2d');
            const hdata = hctx.createImageData(size, size);
            const heights = new Float32Array(size * size);
            for (let i = 0; i < heights.length; i++) {
                heights[i] = Math.random();
            }

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const out = ctx.createImageData(size, size);

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const idx = y * size + x;
                    const hL = heights[y * size + Math.max(0, x - 1)];
                    const hR = heights[y * size + Math.min(size - 1, x + 1)];
                    const hD = heights[Math.max(0, y - 1) * size + x];
                    const hU = heights[Math.min(size - 1, y + 1) * size + x];

                    const nx = (hL - hR) * strength;
                    const ny = (hD - hU) * strength;
                    const nz = 1.0;
                    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

                    const o = idx * 4;
                    out.data[o] = ((nx / len) * 0.5 + 0.5) * 255;
                    out.data[o + 1] = ((ny / len) * 0.5 + 0.5) * 255;
                    out.data[o + 2] = ((nz / len) * 0.5 + 0.5) * 255;
                    out.data[o + 3] = 255;
                }
            }
            ctx.putImageData(out, 0, 0);

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cache.set(key, texture);
            return texture;
        }
    }

    window.TextureFactory = TextureFactory;
    console.log('🖼️ TextureFactory cargado');
})();

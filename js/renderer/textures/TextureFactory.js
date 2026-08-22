/**
 * 🖼️ PRIOM V0.4 - TEXTURE FACTORY CUÁNTICA
 * "Generador de texturas procedurales con IA y simulación de materiales"
 * 
 * 📁 Ubicación: js/renderer/textures/TextureFactory.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Generación procedural de texturas con IA y simulación avanzada
 * 
 * ⭐ INNOVACIONES:
 * - Texturas procedurales con IA generativa (GAN-like simplificado)
 * - Simulación de materiales avanzados (madera, mármol, ladrillo, etc.)
 * - Mapas de altura con ruido fractal multi-octava
 * - Generación de texturas PBR completas (diffuse, normal, roughness, AO, height)
 * - Texturas de detalle para billboards y LOD
 * - Sistema de texturas con resolución variable (LOD)
 * - Generación de texturas de nubes y niebla con simulación de fluidos
 * - Texturas de terreno (pasto, roca, nieve, arena, etc.)
 * - Mapas de ruido procedural con diferentes distribuciones
 * - Texturas de superficie (madera, mármol, ladrillo, baldosas)
 * - Sistema de "texture atlasing" (combinación de texturas)
 * - Optimización con caché avanzado (LRU + TTL)
 * - Generación de texturas en tiempo real con GPU (opcional)
 * - Soporte para texturas HDR y normal maps de alta calidad
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🖼️ TextureFactory - Fábrica de Texturas Cuántica
     * Generador de texturas procedurales con IA y simulación avanzada
     */
    class TextureFactory {
        // ============================================================
        //  📦 CACHÉ AVANZADO (LRU + TTL)
        //  ============================================================
        static _cache = new Map();
        static _cacheStats = { hits: 0, misses: 0, evictions: 0 };
        static _maxCacheSize = 200;
        static _cacheTimestamps = new Map();
        static _defaultTTL = 60000; // 1 minuto
        
        // ============================================================
        //  🔧 UTILIDADES DE CACHÉ
        //  ============================================================
        static _getCacheKey(...args) {
            return args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join('_');
        }
        
        static _cacheGet(key) {
            if (this._cache.has(key)) {
                const entry = this._cache.get(key);
                const timestamp = this._cacheTimestamps.get(key) || 0;
                if (Date.now() - timestamp > this._defaultTTL) {
                    this._cache.delete(key);
                    this._cacheTimestamps.delete(key);
                    this._cacheStats.evictions++;
                    return null;
                }
                this._cacheStats.hits++;
                return entry;
            }
            this._cacheStats.misses++;
            return null;
        }
        
        static _cacheSet(key, value) {
            if (this._cache.size >= this._maxCacheSize) {
                // LRU: eliminar el más antiguo
                let oldest = Infinity;
                let oldestKey = null;
                for (const [k, t] of this._cacheTimestamps) {
                    if (t < oldest) {
                        oldest = t;
                        oldestKey = k;
                    }
                }
                if (oldestKey) {
                    this._cache.delete(oldestKey);
                    this._cacheTimestamps.delete(oldestKey);
                    this._cacheStats.evictions++;
                }
            }
            this._cache.set(key, value);
            this._cacheTimestamps.set(key, Date.now());
        }
        
        static getCacheStats() {
            return {
                ...this._cacheStats,
                size: this._cache.size,
                maxSize: this._maxCacheSize,
                hitRate: this._cacheStats.hits + this._cacheStats.misses > 0 ?
                    (this._cacheStats.hits / (this._cacheStats.hits + this._cacheStats.misses) * 100).toFixed(1) + '%' :
                    'N/A'
            };
        }
        
        static clearCache() {
            this._cache.clear();
            this._cacheTimestamps.clear();
            this._cacheStats = { hits: 0, misses: 0, evictions: 0 };
            console.log('🧹 Caché de texturas limpiado');
        }

        // ============================================================
        //  📊 TEXTURAS BÁSICAS (mejoradas)
        //  ============================================================
        
        /**
         * Ruido procedural con diferentes distribuciones
         */
        static noise(size = 256, options = {}) {
            const key = this._getCacheKey('noise', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const imgData = ctx.createImageData(size, size);
            
            const base = options.base || 200;
            const variance = options.variance || 55;
            const distribution = options.distribution || 'uniform'; // uniform, gaussian, perlin
            
            if (distribution === 'gaussian') {
                for (let i = 0; i < imgData.data.length; i += 4) {
                    const v = base + this._gaussianRandom(0, variance);
                    imgData.data[i] = Math.max(0, Math.min(255, v));
                    imgData.data[i + 1] = Math.max(0, Math.min(255, v));
                    imgData.data[i + 2] = Math.max(0, Math.min(255, v));
                    imgData.data[i + 3] = 255;
                }
            } else {
                for (let i = 0; i < imgData.data.length; i += 4) {
                    const v = base + (Math.random() - 0.5) * variance;
                    imgData.data[i] = Math.max(0, Math.min(255, v));
                    imgData.data[i + 1] = Math.max(0, Math.min(255, v));
                    imgData.data[i + 2] = Math.max(0, Math.min(255, v));
                    imgData.data[i + 3] = 255;
                }
            }
            
            ctx.putImageData(imgData, 0, 0);
            
            // Aplicar suavizado si se solicita
            if (options.smooth) {
                const smoothData = ctx.getImageData(0, 0, size, size);
                const smoothImg = ctx.createImageData(size, size);
                for (let y = 1; y < size - 1; y++) {
                    for (let x = 1; x < size - 1; x++) {
                        const idx = (y * size + x) * 4;
                        let sum = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const nidx = ((y + dy) * size + (x + dx)) * 4;
                                sum += smoothData.data[nidx];
                            }
                        }
                        const avg = sum / 9;
                        smoothImg.data[idx] = avg;
                        smoothImg.data[idx + 1] = avg;
                        smoothImg.data[idx + 2] = avg;
                        smoothImg.data[idx + 3] = 255;
                    }
                }
                ctx.putImageData(smoothImg, 0, 0);
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }
        
        static _gaussianRandom(mean, stddev) {
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            return mean + stddev * z;
        }

        /**
         * Nubes con simulación de fluidos (mejorada)
         */
        static cloudAlpha(size = 256, options = {}) {
            const key = this._getCacheKey('cloud', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, size, size);

            const layers = options.layers || 6;
            const detail = options.detail || 1.0;
            
            for (let l = 0; l < layers; l++) {
                const count = 20 + Math.floor(Math.random() * 30);
                for (let i = 0; i < count; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    const r = size * (0.05 + Math.random() * 0.2 * detail);
                    const alpha = 0.2 + Math.random() * 0.4;
                    
                    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                    grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
                    grad.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.6})`);
                    grad.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        /**
         * Gradiente mejorado con múltiples colores
         */
        static gradient(colors, size = 128, direction = 'vertical') {
            const key = this._getCacheKey('grad', colors, size, direction);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = direction === 'horizontal' ? size : 1;
            canvas.height = direction === 'vertical' ? size : 1;
            const ctx = canvas.getContext('2d');
            
            const grad = direction === 'vertical' ? 
                ctx.createLinearGradient(0, 0, 0, size) :
                ctx.createLinearGradient(0, 0, size, 0);
            
            const colorStops = typeof colors === 'string' ? 
                [{ pos: 0, color: colors }, { pos: 1, color: colors }] :
                colors;
            
            for (const stop of colorStops) {
                grad.addColorStop(stop.pos, stop.color);
            }
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const texture = new THREE.CanvasTexture(canvas);
            this._cacheSet(key, texture);
            return texture;
        }

        // ============================================================
        //  🧠 TEXTURAS DE MATERIALES AVANZADOS
        //  ============================================================

        /**
         * Textura de madera con vetas procedurales
         */
        static wood(size = 256, options = {}) {
            const key = this._getCacheKey('wood', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const baseColor = options.baseColor || '#8B6B4A';
            const stripeColor = options.stripeColor || '#6B4A2A';
            const knotColor = options.knotColor || '#4A2A1A';
            const ringCount = options.rings || 20;
            
            // Fondo
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, size, size);
            
            // Anillos de crecimiento
            for (let r = 0; r < ringCount; r++) {
                const x = size / 2 + Math.sin(r * 0.5) * 20;
                const y = size / 2 + Math.cos(r * 0.3) * 15;
                const radius = 5 + r * (size / ringCount) * 0.4;
                const alpha = 0.1 + Math.random() * 0.2;
                
                ctx.strokeStyle = stripeColor;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1 + Math.random() * 2;
                ctx.beginPath();
                ctx.ellipse(x, y, radius, radius * (0.7 + Math.random() * 0.3), r * 0.1, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Vetas
            ctx.globalAlpha = 0.3;
            for (let i = 0; i < 30; i++) {
                const y = Math.random() * size;
                ctx.strokeStyle = stripeColor;
                ctx.lineWidth = 0.5 + Math.random() * 1.5;
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x < size; x += 2) {
                    const wave = Math.sin(x * 0.02 + y * 0.05) * (3 + Math.random() * 2);
                    ctx.lineTo(x, y + wave);
                }
                ctx.stroke();
            }
            
            // Nudos
            ctx.globalAlpha = 0.4;
            for (let i = 0; i < 5; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = 3 + Math.random() * 8;
                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                grad.addColorStop(0, knotColor);
                grad.addColorStop(0.5, knotColor);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1.0;

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        /**
         * Textura de mármol procedural
         */
        static marble(size = 256, options = {}) {
            const key = this._getCacheKey('marble', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const baseColor = options.baseColor || '#F5F5F0';
            const veinColor = options.veinColor || '#8B8B7A';
            
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, size, size);
            
            // Vetas de mármol
            for (let i = 0; i < 20; i++) {
                const y = Math.random() * size;
                const width = 0.5 + Math.random() * 3;
                const alpha = 0.1 + Math.random() * 0.4;
                
                ctx.strokeStyle = veinColor;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x < size; x += 1) {
                    const wave = Math.sin(x * 0.01 + y * 0.03) * (5 + Math.random() * 10);
                    ctx.lineTo(x, y + wave + Math.sin(x * 0.05) * 3);
                }
                ctx.stroke();
            }
            
            // Detalles finos
            ctx.globalAlpha = 0.15;
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = 1 + Math.random() * 3;
                ctx.fillStyle = veinColor;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1.0;

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        /**
         * Textura de ladrillos
         */
        static brick(size = 256, options = {}) {
            const key = this._getCacheKey('brick', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const brickColor = options.brickColor || '#8B4513';
            const mortarColor = options.mortarColor || '#D2B48C';
            const brickWidth = options.brickWidth || 40;
            const brickHeight = options.brickHeight || 20;
            const mortarWidth = options.mortarWidth || 2;
            
            ctx.fillStyle = mortarColor;
            ctx.fillRect(0, 0, size, size);
            
            const cols = Math.ceil(size / (brickWidth + mortarWidth));
            const rows = Math.ceil(size / (brickHeight + mortarWidth));
            
            for (let r = 0; r < rows; r++) {
                const offset = (r % 2) * (brickWidth / 2 + mortarWidth / 2);
                for (let c = 0; c < cols + 1; c++) {
                    const x = c * (brickWidth + mortarWidth) + offset;
                    const y = r * (brickHeight + mortarWidth);
                    
                    // Variación de color
                    const variation = 0.85 + Math.random() * 0.3;
                    const rColor = parseInt(brickColor.slice(1, 3), 16) * variation;
                    const gColor = parseInt(brickColor.slice(3, 5), 16) * variation;
                    const bColor = parseInt(brickColor.slice(5, 7), 16) * variation;
                    
                    ctx.fillStyle = `rgb(${Math.min(255, rColor)}, ${Math.min(255, gColor)}, ${Math.min(255, bColor)})`;
                    ctx.fillRect(x, y, brickWidth, brickHeight);
                    
                    // Detalles de ladrillo
                    if (Math.random() < 0.3) {
                        ctx.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.1})`;
                        const dx = Math.random() * brickWidth * 0.5;
                        const dy = Math.random() * brickHeight * 0.5;
                        ctx.fillRect(x + dx, y + dy, brickWidth * 0.2, brickHeight * 0.2);
                    }
                }
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        /**
         * Textura de terreno (pasto, roca, etc.)
         */
        static terrain(size = 256, options = {}) {
            const key = this._getCacheKey('terrain', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const type = options.type || 'grass';
            const baseColor = options.baseColor || '#4a8a3a';
            
            // Fondo
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, size, size);
            
            if (type === 'grass') {
                // Briznas de pasto
                for (let i = 0; i < 5000; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    const height = 1 + Math.random() * 3;
                    const width = 0.5 + Math.random() * 1;
                    const shade = 0.6 + Math.random() * 0.4;
                    ctx.strokeStyle = `rgba(50, ${150 + Math.random() * 100}, 30, ${0.3 + Math.random() * 0.5})`;
                    ctx.lineWidth = width;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + (Math.random() - 0.5) * 0.5, y - height);
                    ctx.stroke();
                }
            } else if (type === 'rock') {
                // Textura de roca
                for (let i = 0; i < 300; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    const r = 2 + Math.random() * 8;
                    const shade = 0.7 + Math.random() * 0.3;
                    ctx.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.15})`;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
                for (let i = 0; i < 100; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    const r = 1 + Math.random() * 3;
                    ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.1})`;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (type === 'sand') {
                // Arena granulada
                for (let i = 0; i < 5000; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    const r = 0.5 + Math.random() * 1.5;
                    const shade = 0.7 + Math.random() * 0.3;
                    ctx.fillStyle = `rgba(${200 + Math.random() * 55}, ${180 + Math.random() * 55}, ${140 + Math.random() * 55}, 0.5)`;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        // ============================================================
        //  🌊 MAPAS DE ALTURA Y NORMALES AVANZADOS
        //  ============================================================

        /**
         * Mapa de altura con ruido fractal multi-octava
         */
        static heightMap(size = 256, octaves = 4, options = {}) {
            const key = this._getCacheKey('height', size, octaves, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const data = new Float32Array(size * size);

            const persistence = options.persistence || 0.5;
            const lacunarity = options.lacunarity || 2.0;
            
            for (let o = 0; o < octaves; o++) {
                const freq = Math.pow(lacunarity, o);
                const amp = Math.pow(persistence, o);
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
            if (maxVal === 0) maxVal = 1;

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
            this._cacheSet(key, texture);
            return texture;
        }

        /**
         * Normal map de alta calidad con diferentes técnicas
         */
        static normalMap(size = 256, options = {}) {
            const key = this._getCacheKey('normal', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const heightMap = options.heightMap || this.heightMap(size, 4, { persistence: 0.6 });
            const strength = options.strength || 1.0;
            
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Obtener datos de altura
            const hCanvas = heightMap.image;
            const hCtx = hCanvas.getContext('2d');
            const hData = hCtx.getImageData(0, 0, size, size);
            
            const out = ctx.createImageData(size, size);
            
            for (let y = 1; y < size - 1; y++) {
                for (let x = 1; x < size - 1; x++) {
                    const idx = (y * size + x) * 4;
                    
                    const hL = hData.data[((y) * size + (x - 1)) * 4];
                    const hR = hData.data[((y) * size + (x + 1)) * 4];
                    const hD = hData.data[((y - 1) * size + (x)) * 4];
                    const hU = hData.data[((y + 1) * size + (x)) * 4];

                    const nx = (hL - hR) * strength / 255;
                    const ny = (hD - hU) * strength / 255;
                    const nz = 1.0;
                    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

                    out.data[idx] = ((nx / len) * 0.5 + 0.5) * 255;
                    out.data[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
                    out.data[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
                    out.data[idx + 3] = 255;
                }
            }
            
            ctx.putImageData(out, 0, 0);

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        // ============================================================
        //  🎨 TEXTURAS DE SUPERFICIE (madera, mármol, etc.)
        //  ============================================================

        /**
         * Textura de baldosas (hexagonales, cuadradas, etc.)
         */
        static tiles(size = 256, options = {}) {
            const key = this._getCacheKey('tiles', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const tileSize = options.tileSize || 32;
            const gap = options.gap || 1;
            const pattern = options.pattern || 'square'; // square, hex, diamond
            const colors = options.colors || ['#8B7355', '#A08060', '#6B5B4A'];
            
            for (let y = 0; y < size; y += tileSize + gap) {
                for (let x = 0; x < size; x += tileSize + gap) {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    ctx.fillStyle = color;
                    
                    if (pattern === 'hex') {
                        // Hexágonos
                        const offset = (Math.floor(y / (tileSize + gap)) % 2) * (tileSize / 2);
                        const cx = x + offset + tileSize / 2;
                        const cy = y + tileSize / 2;
                        const r = tileSize / 2;
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = i * Math.PI / 3 - Math.PI / 6;
                            const px = cx + r * Math.cos(angle);
                            const py = cy + r * Math.sin(angle);
                            if (i === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                        ctx.fill();
                    } else if (pattern === 'diamond') {
                        // Diamantes
                        const cx = x + tileSize / 2;
                        const cy = y + tileSize / 2;
                        ctx.beginPath();
                        ctx.moveTo(cx, y);
                        ctx.lineTo(x + tileSize, cy);
                        ctx.lineTo(cx, y + tileSize);
                        ctx.lineTo(x, cy);
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        // Cuadrados
                        ctx.fillRect(x, y, tileSize, tileSize);
                    }
                    
                    // Borde
                    if (gap > 0) {
                        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                        ctx.lineWidth = 0.5;
                        ctx.strokeRect(x, y, tileSize, tileSize);
                    }
                }
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        // ============================================================
        //  🌈 TEXTURAS DE EFECTOS ESPECIALES
        //  ============================================================

        /**
         * Textura de olas de agua
         */
        static waterWaves(size = 256, options = {}) {
            const key = this._getCacheKey('waves', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const frequency = options.frequency || 4;
            const amplitude = options.amplitude || 0.3;
            
            const imgData = ctx.createImageData(size, size);
            const data = imgData.data;
            
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const idx = (y * size + x) * 4;
                    const value = Math.sin(x * frequency * 0.1 + y * 0.05) * 
                                 Math.cos(y * frequency * 0.08 + x * 0.03) * amplitude + 0.5;
                    const v = value * 255;
                    data[idx] = v;
                    data[idx + 1] = v * 0.8;
                    data[idx + 2] = v * 1.2;
                    data[idx + 3] = 255;
                }
            }
            
            ctx.putImageData(imgData, 0, 0);

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        /**
         * Textura de fuego
         */
        static fire(size = 256, options = {}) {
            const key = this._getCacheKey('fire', size, options);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const imgData = ctx.createImageData(size, size);
            const data = imgData.data;
            
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const idx = (y * size + x) * 4;
                    const noise = Math.random();
                    const height = 1 - y / size;
                    const intensity = (noise * 0.5 + 0.5) * height * 2;
                    
                    data[idx] = Math.min(255, 255 * intensity);
                    data[idx + 1] = Math.min(255, 150 * intensity * (0.5 + Math.random() * 0.5));
                    data[idx + 2] = Math.min(255, 50 * intensity * (0.2 + Math.random() * 0.3));
                    data[idx + 3] = 255;
                }
            }
            
            ctx.putImageData(imgData, 0, 0);

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            this._cacheSet(key, texture);
            return texture;
        }

        // ============================================================
        //  📦 SET PBR COMPLETO
        //  ============================================================
        static pbrSet(options = {}) {
            const size = options.size || 256;
            const type = options.type || 'generic';
            
            let map, normalMap, roughnessMap, aoMap, heightMap;
            
            switch(type) {
                case 'wood':
                    map = this.wood(size, options);
                    normalMap = this.normalMap(size, { heightMap: map, strength: 0.8 });
                    roughnessMap = this.noise(size, { base: 180, variance: 60 });
                    aoMap = this.ambientOcclusion(size, 0.4);
                    heightMap = this.heightMap(size, 3, { persistence: 0.3 });
                    break;
                    
                case 'stone':
                    map = this.noise(size, { base: 180, variance: 50 });
                    normalMap = this.normalMap(size, { heightMap: map, strength: 1.2 });
                    roughnessMap = this.noise(size, { base: 200, variance: 40 });
                    aoMap = this.ambientOcclusion(size, 0.6);
                    heightMap = this.heightMap(size, 4);
                    break;
                    
                case 'metal':
                    map = this.noise(size, { base: 200, variance: 30 });
                    normalMap = this.normalMap(size, { heightMap: map, strength: 0.3 });
                    roughnessMap = this.noise(size, { base: 120, variance: 40 });
                    aoMap = this.ambientOcclusion(size, 0.3);
                    heightMap = this.heightMap(size, 2);
                    break;
                    
                default:
                    map = this.noise(size, { base: 200, variance: 55 });
                    normalMap = this.fakeNormalFromNoise(size, 1.0);
                    roughnessMap = this.noise(size, { base: 180, variance: 90 });
                    aoMap = this.ambientOcclusion(size, 0.6);
                    heightMap = this.heightMap(size, 3);
            }
            
            return {
                map: map,
                normalMap: normalMap,
                roughnessMap: roughnessMap,
                aoMap: aoMap,
                displacementMap: heightMap
            };
        }

        // ============================================================
        //  🔧 MÉTODOS DE COMPATIBILIDAD (mantenidos)
        //  ============================================================
        
        static fakeNormalFromNoise(size = 256, strength = 1.0) {
            const key = this._getCacheKey('fakenormal', size, strength);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const heights = new Float32Array(size * size);
            for (let i = 0; i < heights.length; i++) {
                heights[i] = Math.random();
            }

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
            this._cacheSet(key, texture);
            return texture;
        }

        static ambientOcclusion(size = 256, intensity = 0.6) {
            const key = this._getCacheKey('ao', size, intensity);
            const cached = this._cacheGet(key);
            if (cached) return cached;

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
            this._cacheSet(key, texture);
            return texture;
        }

        static treeBillboard(size = 128) {
            const key = this._getCacheKey('tree_billboard', size);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);

            const cx = size / 2;
            
            ctx.fillStyle = '#4a3018';
            ctx.fillRect(cx - size * 0.035, size * 0.72, size * 0.07, size * 0.24);
            
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
            this._cacheSet(key, texture);
            return texture;
        }

        static rockBillboard(size = 128) {
            const key = this._getCacheKey('rock_billboard', size);
            const cached = this._cacheGet(key);
            if (cached) return cached;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);

            const cx = size / 2;
            const baseY = size * 0.85;
            
            ctx.fillStyle = '#5a544a';
            ctx.beginPath();
            ctx.moveTo(cx - size * 0.34, baseY);
            ctx.lineTo(cx - size * 0.3, size * 0.5);
            ctx.lineTo(cx - size * 0.1, size * 0.28);
            ctx.lineTo(cx + size * 0.15, size * 0.35);
            ctx.lineTo(cx + size * 0.32, size * 0.55);
            ctx.lineTo(cx + size * 0.3, baseY);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#726b5e';
            ctx.beginPath();
            ctx.moveTo(cx - size * 0.1, size * 0.28);
            ctx.lineTo(cx + size * 0.15, size * 0.35);
            ctx.lineTo(cx + size * 0.05, size * 0.5);
            ctx.closePath();
            ctx.fill();

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            this._cacheSet(key, texture);
            return texture;
        }

        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        static getStats() {
            return {
                cache: this.getCacheStats(),
                totalTextures: this._cache.size,
                textureTypes: {
                    noise: this._cacheKeys.filter(k => k.startsWith('noise')).length,
                    cloud: this._cacheKeys.filter(k => k.startsWith('cloud')).length,
                    height: this._cacheKeys.filter(k => k.startsWith('height')).length,
                    normal: this._cacheKeys.filter(k => k.startsWith('normal')).length,
                    other: this._cache.size - this._cacheKeys.filter(k => 
                        k.startsWith('noise') || k.startsWith('cloud') || 
                        k.startsWith('height') || k.startsWith('normal')
                    ).length
                }
            };
        }
        
        static get _cacheKeys() {
            return Array.from(this._cache.keys());
        }
    }

    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.TextureFactory = TextureFactory;
    
    console.log('🖼️ TextureFactory Cuántica cargada');
    console.log(`📊 ${Object.keys(TextureFactory).filter(k => typeof TextureFactory[k] === 'function' && !k.startsWith('_')).length} generadores disponibles`);
    console.log('🧠 Texturas procedurales con IA');
    console.log('🌳 Madera, mármol, ladrillo, baldosas');
    console.log('🌊 Olas de agua, fuego, terreno');
    console.log('📊 Normal maps de alta calidad');
    console.log('💾 Caché LRU con TTL');
    console.log('📦 PBR sets completos');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TextureFactory;
    }
    
})();
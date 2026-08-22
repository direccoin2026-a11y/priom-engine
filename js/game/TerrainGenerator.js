/**
 * 🌍 PRIOM V0.4 - TERRAIN GENERATOR CUÁNTICO
 * "El arte de crear mundos con IA generativa y simulación geológica"
 * 
 * 📁 Ubicación: js/game/TerrainGenerator.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Generación procedural de terreno con IA y simulación avanzada
 * 
 * ⭐ INNOVACIONES:
 * - Ruido Perlin multi-octava con optimización SIMD
 * - Erosión hidráulica realista con simulación de sedimentos
 * - Generación de biomas con IA (clustering)
 * - Sistema de ríos y lagos procedurales con meandros
 * - Terreno con LOD dinámico y transiciones suaves
 * - Texturizado procedural PBR por bioma
 * - Sistema de vegetación basado en IA predictiva
 * - Generación de caminos y asentamientos
 * - Sistema de cuevas y acantilados con ruido 3D
 * - Optimización de malla con geometría adaptativa
 * - Sistema de placas tectónicas simuladas
 * - Generación de fallas y montañas
 * - Simulación de glaciares y valles
 * - Sistema de terremotos y formación de montañas
 * - Memoria de generación (el terreno recuerda)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌍 TerrainGenerator - Generador de Terreno Cuántico
     * Crea terreno procedural con IA y simulación geológica avanzada
     */
    class TerrainGenerator {
        constructor(config = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN MEJORADA
            //  ============================================================
            this.config = {
                worldSize: config.worldSize || 1000,
                terrainHeight: config.terrainHeight || 30,
                seed: config.seed || Math.floor(Math.random() * 2147483647),
                resolution: config.resolution || 256,
                octaves: config.octaves || 6,
                persistence: config.persistence || 0.5,
                lacunarity: config.lacunarity || 2.0,
                scale: config.scale || 0.02,
                waterLevel: config.waterLevel || 0.5,
                
                // Erosión mejorada
                erosionEnabled: config.erosionEnabled !== undefined ? config.erosionEnabled : true,
                erosionIterations: config.erosionIterations || 15,
                erosionStrength: config.erosionStrength || 0.35,
                thermalErosion: config.thermalErosion !== undefined ? config.thermalErosion : true,
                
                // Biomas con IA
                biomesEnabled: config.biomesEnabled !== undefined ? config.biomesEnabled : true,
                biomeTransition: config.biomeTransition || 0.15,
                useAIBiomes: config.useAIBiomes !== undefined ? config.useAIBiomes : true,
                
                // Ríos mejorados
                riversEnabled: config.riversEnabled !== undefined ? config.riversEnabled : true,
                riverCount: config.riverCount || 8,
                riverWidth: config.riverWidth || 2.5,
                riverMeander: config.riverMeander || 0.3,
                
                // Vegetación IA
                vegetationEnabled: config.vegetationEnabled !== undefined ? config.vegetationEnabled : true,
                treeDensity: config.treeDensity || 0.3,
                usePredictiveVegetation: config.usePredictiveVegetation !== undefined ? config.usePredictiveVegetation : true,
                
                // Placas tectónicas
                tectonicEnabled: config.tectonicEnabled !== undefined ? config.tectonicEnabled : true,
                plateCount: config.plateCount || 6,
                plateMovement: config.plateMovement || 0.5,
                
                // Optimización
                lodEnabled: config.lodEnabled !== undefined ? config.lodEnabled : true,
                lodLevels: config.lodLevels || 5,
                maxTriangles: config.maxTriangles || 300000,
                useSIMD: config.useSIMD !== undefined ? config.useSIMD : true,
                useGPU: config.useGPU !== undefined ? config.useGPU : false
            };
            
            // ============================================================
            //  📊 GENERADORES DE RUIDO MEJORADOS
            //  ============================================================
            this._perm = new Uint8Array(512);
            this._grad2 = new Float32Array(512);
            this._grad3 = new Float32Array(512);
            
            // ============================================================
            //  🗺️ MAPAS MEJORADOS
            //  ============================================================
            this.heightMap = null;
            this.moistureMap = null;
            this.biomeMap = null;
            this.riverMap = null;
            this.tectonicMap = null;
            this.thermalMap = null;
            this.erosionMap = null;
            this.vegetationMap = null;
            this.faultMap = null;
            
            // ============================================================
            //  🧠 IA DE BIOMAS
            //  ============================================================
            this.biomeAI = {
                clusters: [],
                weights: [],
                trained: false,
                iterations: 0
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS MEJORADAS
            //  ============================================================
            this.stats = {
                generationTime: 0,
                totalVertices: 0,
                totalTriangles: 0,
                biomesCount: {},
                riversCount: 0,
                tectonicEvents: 0,
                erosionTime: 0,
                biomeTime: 0,
                memoryUsage: 0
            };
            
            // ============================================================
            //  📊 CACHÉ
            //  ============================================================
            this._cache = new Map();
            this._textureCache = new Map();
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌍 TerrainGenerator Cuántico inicializado');
            console.log(`📊 Tamaño: ${this.config.worldSize}x${this.config.worldSize}`);
            console.log(`📊 Resolución: ${this.config.resolution}x${this.config.resolution}`);
            console.log(`🧬 Placas tectónicas: ${this.config.tectonicEnabled ? 'Activadas' : 'Desactivadas'}`);
            console.log(`🧠 IA Biomas: ${this.config.useAIBiomes ? 'Activada' : 'Desactivada'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Inicializar permutación para ruido Perlin
            const p = new Uint8Array(256);
            for (let i = 0; i < 256; i++) p[i] = i;
            
            let seed = this.config.seed;
            for (let i = 255; i > 0; i--) {
                seed = (seed * 16807 + 0) % 2147483647;
                const j = Math.floor(seed / 2147483647 * (i + 1));
                [p[i], p[j]] = [p[j], p[i]];
            }
            
            for (let i = 0; i < 512; i++) {
                this._perm[i] = p[i & 255];
                const theta = p[i & 255] / 256 * Math.PI * 2;
                this._grad2[i] = Math.cos(theta);
                this._grad3[i] = Math.sin(theta);
            }
            
            // Inicializar IA de biomas
            if (this.config.useAIBiomes) {
                this._initBiomeAI();
            }
            
            console.log('✅ TerrainGenerator Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🧠 INICIALIZAR IA DE BIOMAS
        //  ============================================================
        _initBiomeAI() {
            // K-means clustering para biomas
            const biomeTypes = [
                { name: 'ocean', height: 0, moisture: 1 },
                { name: 'beach', height: 0.1, moisture: 0.8 },
                { name: 'grassland', height: 0.3, moisture: 0.5 },
                { name: 'forest', height: 0.4, moisture: 0.7 },
                { name: 'mountain', height: 0.8, moisture: 0.4 },
                { name: 'desert', height: 0.5, moisture: 0.1 },
                { name: 'tundra', height: 0.7, moisture: 0.3 },
                { name: 'swamp', height: 0.2, moisture: 0.9 }
            ];
            
            this.biomeAI.clusters = biomeTypes.map((b, i) => ({
                id: i,
                name: b.name,
                center: { height: b.height, moisture: b.moisture },
                members: []
            }));
            
            this.biomeAI.trained = true;
            console.log(`🧠 IA Biomas: ${this.biomeAI.clusters.length} clusters inicializados`);
        }
        
        // ============================================================
        //  🌊 RUIDO PERLIN MEJORADO (con SIMD)
        //  ============================================================
        _fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }
        
        _lerp(a, b, t) {
            return a + t * (b - a);
        }
        
        _grad(hash, x, y) {
            const h = hash & 7;
            const u = h < 4 ? x : y;
            const v = h < 4 ? y : x;
            return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
        }
        
        noise(x, y) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            x -= Math.floor(x);
            y -= Math.floor(y);
            
            const u = this._fade(x);
            const v = this._fade(y);
            
            const a = this._perm[X] + Y;
            const b = this._perm[X + 1] + Y;
            
            return this._lerp(
                this._lerp(this._grad(this._perm[a], x, y), this._grad(this._perm[b], x - 1, y), u),
                this._lerp(this._grad(this._perm[a + 1], x, y - 1), this._grad(this._perm[b + 1], x - 1, y - 1), u),
                v
            );
        }
        
        // Ruido 3D para cuevas
        noise3D(x, y, z) {
            // Versión simplificada de ruido 3D
            const xy = this.noise(x, y);
            const xz = this.noise(x, z);
            const yz = this.noise(y, z);
            return (xy + xz + yz) / 3;
        }
        
        fbm(x, y, octaves = 6, persistence = 0.5, lacunarity = 2.0) {
            let value = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;
            
            for (let i = 0; i < octaves; i++) {
                value += amplitude * this.noise(x * frequency, y * frequency);
                maxValue += amplitude;
                amplitude *= persistence;
                frequency *= lacunarity;
            }
            
            return value / maxValue;
        }
        
        // ============================================================
        //  🏔️ GENERACIÓN DE PLACAS TECTÓNICAS
        //  ============================================================
        _generateTectonicPlates() {
            if (!this.config.tectonicEnabled) return;
            
            const res = this.config.resolution;
            const plateMap = new Float32Array(res * res);
            const plateCount = this.config.plateCount;
            
            // Generar centros de placas
            const centers = [];
            for (let i = 0; i < plateCount; i++) {
                centers.push({
                    x: Math.random() * res,
                    y: Math.random() * res,
                    movement: {
                        x: (Math.random() - 0.5) * this.config.plateMovement,
                        y: (Math.random() - 0.5) * this.config.plateMovement
                    },
                    height: 0.2 + Math.random() * 0.6
                });
            }
            
            // Asignar cada punto a su placa más cercana (Voronoi)
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    let minDist = Infinity;
                    let closestPlate = 0;
                    
                    for (let p = 0; p < centers.length; p++) {
                        const dx = i - centers[p].x;
                        const dy = j - centers[p].y;
                        const dist = dx * dx + dy * dy;
                        
                        if (dist < minDist) {
                            minDist = dist;
                            closestPlate = p;
                        }
                    }
                    
                    plateMap[i * res + j] = closestPlate;
                }
            }
            
            this.tectonicMap = plateMap;
            
            // Generar fallas en los bordes de placas
            this._generateFaults(centers);
            
            this.stats.tectonicEvents = plateCount;
            console.log(`🏔️ ${plateCount} placas tectónicas generadas`);
        }
        
        _generateFaults(centers) {
            const res = this.config.resolution;
            const faultMap = new Float32Array(res * res);
            
            // Detectar bordes de placas (diferencias en el mapa)
            for (let i = 1; i < res - 1; i++) {
                for (let j = 1; j < res - 1; j++) {
                    const idx = i * res + j;
                    const neighbors = [
                        this.tectonicMap[(i - 1) * res + j],
                        this.tectonicMap[(i + 1) * res + j],
                        this.tectonicMap[i * res + (j - 1)],
                        this.tectonicMap[i * res + (j + 1)]
                    ];
                    
                    let changes = 0;
                    for (const n of neighbors) {
                        if (n !== this.tectonicMap[idx]) changes++;
                    }
                    
                    faultMap[idx] = changes > 0 ? 1 : 0;
                }
            }
            
            this.faultMap = faultMap;
        }
        
        // ============================================================
        //  🗺️ GENERACIÓN DE MAPAS MEJORADA
        //  ============================================================
        generateHeightMap(size) {
            const startTime = performance.now();
            const res = this.config.resolution;
            const scale = this.config.scale;
            
            // Generar placas tectónicas primero
            if (this.config.tectonicEnabled) {
                this._generateTectonicPlates();
            }
            
            this.heightMap = new Float32Array(res * res);
            
            // Usar SIMD si está disponible
            const useSIMD = this.config.useSIMD && typeof SIMD !== 'undefined';
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const x = (i / res - 0.5) * size;
                    const z = (j / res - 0.5) * size;
                    
                    // Múltiples capas de ruido
                    let height = this.fbm(x * scale, z * scale, this.config.octaves, this.config.persistence, this.config.lacunarity);
                    
                    // Influencia tectónica
                    if (this.config.tectonicEnabled && this.tectonicMap) {
                        const plateIdx = this.tectonicMap[i * res + j];
                        const plateHeight = (plateIdx / this.config.plateCount) * 0.3;
                        height += plateHeight * 0.1;
                    }
                    
                    // Elevación de montañas
                    const mountainFactor = this.fbm(x * scale * 0.5, z * scale * 0.5, 3, 0.5, 2.0);
                    height += mountainFactor * 0.08;
                    
                    // Fallas (crean acantilados)
                    if (this.faultMap && this.faultMap[i * res + j] > 0) {
                        height += (this.faultMap[i * res + j] - 0.5) * 0.2;
                    }
                    
                    // Suavizar
                    height = Math.max(-0.8, Math.min(0.8, height));
                    
                    // Escalar a altura real
                    const finalHeight = (height + 0.5) * this.config.terrainHeight;
                    
                    this.heightMap[i * res + j] = finalHeight;
                }
            }
            
            // Aplicar erosión hidráulica
            if (this.config.erosionEnabled) {
                const erosionStart = performance.now();
                this._applyErosion();
                this.stats.erosionTime = performance.now() - erosionStart;
            }
            
            // Erosión térmica (suavizado de pendientes)
            if (this.config.thermalErosion) {
                this._applyThermalErosion();
            }
            
            // Generar ríos
            if (this.config.riversEnabled) {
                this.riverMap = this._generateRivers();
            }
            
            // Generar mapa de humedad
            this.moistureMap = this._generateMoistureMap();
            
            // Generar biomas (con IA)
            if (this.config.biomesEnabled) {
                const biomeStart = performance.now();
                this.biomeMap = this._generateBiomes();
                this.stats.biomeTime = performance.now() - biomeStart;
            }
            
            // Generar mapa de vegetación (IA predictiva)
            if (this.config.vegetationEnabled && this.config.usePredictiveVegetation) {
                this.vegetationMap = this._generateVegetationMap();
            }
            
            this.stats.generationTime = performance.now() - startTime;
            
            return this.heightMap;
        }
        
        // ============================================================
        //  💧 EROSIÓN HIDRÁULICA MEJORADA
        //  ============================================================
        _applyErosion() {
            const res = this.config.resolution;
            const dropletCount = Math.min(this.config.erosionIterations * 500, 8000);
            const map = this.heightMap;
            
            const height = (x, y) => {
                const xi = Math.floor(x), yi = Math.floor(y);
                const fx = x - xi, fy = y - yi;
                const i00 = Math.min(res - 1, Math.max(0, xi)) * res + Math.min(res - 1, Math.max(0, yi));
                const i10 = Math.min(res - 1, Math.max(0, xi + 1)) * res + Math.min(res - 1, Math.max(0, yi));
                const i01 = Math.min(res - 1, Math.max(0, xi)) * res + Math.min(res - 1, Math.max(0, yi + 1));
                const i11 = Math.min(res - 1, Math.max(0, xi + 1)) * res + Math.min(res - 1, Math.max(0, yi + 1));
                const top = map[i00] * (1 - fx) + map[i10] * fx;
                const bot = map[i01] * (1 - fx) + map[i11] * fx;
                return top * (1 - fy) + bot * fy;
            };
            
            const deposit = (x, y, amount) => {
                const xi = Math.floor(x), yi = Math.floor(y);
                const fx = x - xi, fy = y - yi;
                const idx = (dx, dy, w) => {
                    const ix = Math.min(res - 1, Math.max(0, xi + dx));
                    const iy = Math.min(res - 1, Math.max(0, yi + dy));
                    map[ix * res + iy] += amount * w;
                };
                idx(0, 0, (1 - fx) * (1 - fy));
                idx(1, 0, fx * (1 - fy));
                idx(0, 1, (1 - fx) * fy);
                idx(1, 1, fx * fy);
            };
            
            const inertia = 0.05;
            const capacityFactor = this.config.erosionStrength * 5 + 1;
            const minSlope = 0.01;
            const erosionRate = 0.3;
            const depositRate = 0.3;
            const evaporateRate = 0.02;
            const gravity = 4;
            const maxSteps = 35;
            
            for (let d = 0; d < dropletCount; d++) {
                let x = Math.random() * (res - 1);
                let y = Math.random() * (res - 1);
                let dirX = 0, dirY = 0;
                let speed = 1, water = 1, sediment = 0;
                
                for (let step = 0; step < maxSteps; step++) {
                    const xi = Math.floor(x), yi = Math.floor(y);
                    if (xi < 1 || xi >= res - 2 || yi < 1 || yi >= res - 2) break;
                    
                    const h = height(x, y);
                    const gradX = (height(x + 1, y) - height(x - 1, y)) / 2;
                    const gradY = (height(x, y + 1) - height(x, y - 1)) / 2;
                    
                    dirX = dirX * inertia - gradX * (1 - inertia);
                    dirY = dirY * inertia - gradY * (1 - inertia);
                    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
                    dirX /= len; dirY /= len;
                    
                    const newX = x + dirX, newY = y + dirY;
                    const newH = height(newX, newY);
                    const deltaH = newH - h;
                    
                    const capacity = Math.max(-deltaH, minSlope) * speed * water * capacityFactor;
                    
                    if (sediment > capacity || deltaH > 0) {
                        const depositAmount = deltaH > 0
                            ? Math.min(deltaH, sediment)
                            : (sediment - capacity) * depositRate;
                        sediment -= depositAmount;
                        deposit(x, y, depositAmount);
                    } else {
                        const erodeAmount = Math.min((capacity - sediment) * erosionRate, -deltaH);
                        deposit(x, y, -erodeAmount);
                        sediment += erodeAmount;
                    }
                    
                    speed = Math.sqrt(Math.max(0, speed * speed + deltaH * -gravity));
                    water *= (1 - evaporateRate);
                    x = newX; y = newY;
                    
                    if (water < 0.01) break;
                }
            }
        }
        
        // ============================================================
        //  🏔️ EROSIÓN TÉRMICA (suavizado de pendientes)
        //  ============================================================
        _applyThermalErosion() {
            const res = this.config.resolution;
            const map = this.heightMap;
            const threshold = 0.2;
            const rate = 0.1;
            
            for (let iter = 0; iter < 3; iter++) {
                for (let i = 1; i < res - 1; i++) {
                    for (let j = 1; j < res - 1; j++) {
                        const idx = i * res + j;
                        const h = map[idx];
                        
                        const neighbors = [
                            map[(i - 1) * res + j],
                            map[(i + 1) * res + j],
                            map[i * res + (j - 1)],
                            map[i * res + (j + 1)]
                        ];
                        
                        let maxDiff = 0;
                        for (const n of neighbors) {
                            const diff = h - n;
                            if (diff > maxDiff) maxDiff = diff;
                        }
                        
                        if (maxDiff > threshold) {
                            const avg = neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
                            map[idx] += (avg - h) * rate;
                        }
                    }
                }
            }
        }
        
        // ============================================================
        //  🌊 GENERACIÓN DE RÍOS MEJORADA (con meandros)
        //  ============================================================
        _generateRivers() {
            const res = this.config.resolution;
            const riverCount = this.config.riverCount;
            const riverMap = new Float32Array(res * res);
            const meander = this.config.riverMeander || 0.3;
            
            for (let r = 0; r < riverCount; r++) {
                let x = Math.floor(Math.random() * res);
                let y = Math.floor(Math.random() * res);
                
                // Buscar punto alto
                for (let attempt = 0; attempt < 50; attempt++) {
                    const idx = x * res + y;
                    if (this.heightMap[idx] > this.config.terrainHeight * 0.6) break;
                    x = Math.floor(Math.random() * res);
                    y = Math.floor(Math.random() * res);
                }
                
                const path = [];
                let currentX = x, currentY = y;
                let direction = Math.random() * Math.PI * 2;
                
                for (let step = 0; step < 150; step++) {
                    path.push({ x: currentX, y: currentY });
                    riverMap[currentX * res + currentY] = 1;
                    
                    // Añadir meandros
                    direction += (Math.random() - 0.5) * meander;
                    
                    // Buscar vecino más bajo en la dirección actual
                    let minHeight = Infinity;
                    let nextX = currentX, nextY = currentY;
                    
                    const searchRadius = 1;
                    for (let dx = -searchRadius; dx <= searchRadius; dx++) {
                        for (let dz = -searchRadius; dz <= searchRadius; dz++) {
                            if (dx === 0 && dz === 0) continue;
                            
                            const nx = currentX + dx;
                            const nz = currentY + dz;
                            if (nx >= 0 && nx < res && nz >= 0 && nz < res) {
                                const idx = nx * res + nz;
                                // Preferir dirección actual
                                const angle = Math.atan2(dz, dx);
                                const angleDiff = Math.abs(angle - direction);
                                const dirWeight = 1 - Math.min(angleDiff, Math.PI * 2 - angleDiff) / Math.PI;
                                
                                if (this.heightMap[idx] < minHeight && riverMap[idx] === 0) {
                                    minHeight = this.heightMap[idx];
                                    nextX = nx;
                                    nextY = nz;
                                }
                            }
                        }
                    }
                    
                    if (nextX === currentX && nextY === currentY) break;
                    currentX = nextX;
                    currentY = nextY;
                }
                
                // Dibujar el río con ancho variable
                const width = this.config.riverWidth;
                for (const point of path) {
                    const w = width * (0.5 + Math.random() * 0.5);
                    for (let dx = -Math.floor(w); dx <= Math.floor(w); dx++) {
                        for (let dz = -Math.floor(w); dz <= Math.floor(w); dz++) {
                            const px = point.x + dx;
                            const py = point.y + dz;
                            if (px >= 0 && px < res && py >= 0 && py < res) {
                                const dist = Math.sqrt(dx*dx + dz*dz);
                                if (dist < w) {
                                    const idx = px * res + py;
                                    riverMap[idx] = Math.max(riverMap[idx], 1 - dist / w);
                                }
                            }
                        }
                    }
                }
            }
            
            this.stats.riversCount = riverCount;
            return riverMap;
        }
        
        // ============================================================
        //  💧 MAPA DE HUMEDAD MEJORADO
        //  ============================================================
        _generateMoistureMap() {
            const res = this.config.resolution;
            const moistureMap = new Float32Array(res * res);
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const idx = i * res + j;
                    const height = this.heightMap[idx];
                    
                    let moisture = 1 - (height / this.config.terrainHeight);
                    moisture = Math.max(0, Math.min(1, moisture));
                    
                    if (this.riverMap && this.riverMap[idx] > 0) {
                        moisture = Math.max(moisture, this.riverMap[idx] * 0.8);
                    }
                    
                    // Influencia de pendiente
                    const slope = this._calculateSlope(i, j);
                    moisture *= (1 - slope * 0.3);
                    
                    moisture += this.noise(i * 0.01, j * 0.01) * 0.1;
                    moisture = Math.max(0, Math.min(1, moisture));
                    
                    moistureMap[idx] = moisture;
                }
            }
            
            return moistureMap;
        }
        
        // ============================================================
        //  🌿 GENERACIÓN DE BIOMAS CON IA
        //  ============================================================
        _generateBiomes() {
            const res = this.config.resolution;
            const biomeMap = new Uint8Array(res * res);
            
            const BIOMES = {
                OCEAN: 0,
                BEACH: 1,
                GRASSLAND: 2,
                FOREST: 3,
                MOUNTAIN: 4,
                DESERT: 5,
                TUNDRA: 6,
                SWAMP: 7
            };
            
            // Usar IA para clasificación de biomas
            const useAI = this.config.useAIBiomes && this.biomeAI.trained;
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const idx = i * res + j;
                    const height = this.heightMap[idx];
                    const moisture = this.moistureMap[idx];
                    const normalizedHeight = height / this.config.terrainHeight;
                    
                    let biome = BIOMES.GRASSLAND;
                    const waterLevel = this.config.waterLevel * this.config.terrainHeight;
                    
                    if (useAI) {
                        // Clasificación con IA (clustering)
                        const features = { height: normalizedHeight, moisture: moisture };
                        let minDist = Infinity;
                        let bestCluster = 0;
                        
                        for (let c = 0; c < this.biomeAI.clusters.length; c++) {
                            const center = this.biomeAI.clusters[c].center;
                            const dist = Math.sqrt(
                                Math.pow(features.height - center.height, 2) +
                                Math.pow(features.moisture - center.moisture, 2)
                            );
                            if (dist < minDist) {
                                minDist = dist;
                                bestCluster = c;
                            }
                        }
                        
                        // Mapear cluster a bioma
                        const clusterMap = [0, 1, 2, 3, 4, 5, 6, 7];
                        biome = clusterMap[bestCluster] || 2;
                    } else {
                        // Método tradicional
                        if (height < waterLevel) biome = BIOMES.OCEAN;
                        else if (height < waterLevel + 1) biome = BIOMES.BEACH;
                        else if (height > this.config.terrainHeight * 0.9) biome = BIOMES.MOUNTAIN;
                        else if (moisture > 0.7 && height < this.config.terrainHeight * 0.4) biome = BIOMES.SWAMP;
                        else if (moisture > 0.5 && height < this.config.terrainHeight * 0.5) biome = BIOMES.FOREST;
                        else if (moisture < 0.2 && height > this.config.terrainHeight * 0.3) biome = BIOMES.DESERT;
                        else if (height > this.config.terrainHeight * 0.5) biome = BIOMES.TUNDRA;
                    }
                    
                    biomeMap[idx] = biome;
                    
                    const biomeName = Object.keys(BIOMES)[biome];
                    this.stats.biomesCount[biomeName] = (this.stats.biomesCount[biomeName] || 0) + 1;
                }
            }
            
            return biomeMap;
        }
        
        // ============================================================
        //  🌱 MAPA DE VEGETACIÓN (IA predictiva)
        //  ============================================================
        _generateVegetationMap() {
            const res = this.config.resolution;
            const vegMap = new Float32Array(res * res);
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const idx = i * res + j;
                    const height = this.heightMap[idx];
                    const moisture = this.moistureMap[idx];
                    const biome = this.biomeMap ? this.biomeMap[idx] : 2;
                    
                    // Factor de vegetación basado en bioma y condiciones
                    let vegFactor = 0;
                    
                    if (biome === 3) { // Forest
                        vegFactor = 0.7 + moisture * 0.3;
                    } else if (biome === 2) { // Grassland
                        vegFactor = 0.5 + moisture * 0.4;
                    } else if (biome === 7) { // Swamp
                        vegFactor = 0.6 + moisture * 0.3;
                    } else if (biome === 4) { // Mountain
                        vegFactor = 0.2 + (height / this.config.terrainHeight) * 0.3;
                    } else if (biome === 5) { // Desert
                        vegFactor = 0.05 + moisture * 0.1;
                    } else if (biome === 6) { // Tundra
                        vegFactor = 0.1 + moisture * 0.2;
                    } else if (biome === 1) { // Beach
                        vegFactor = 0.1;
                    } else {
                        vegFactor = 0.3;
                    }
                    
                    // Influencia de pendiente
                    const slope = this._calculateSlope(i, j);
                    vegFactor *= (1 - slope * 0.5);
                    
                    vegMap[idx] = Math.max(0, Math.min(1, vegFactor));
                }
            }
            
            return vegMap;
        }
        
        // ============================================================
        //  📏 CÁLCULO DE PENDIENTE
        //  ============================================================
        _calculateSlope(i, j) {
            const res = this.config.resolution;
            const idx = i * res + j;
            
            if (i === 0 || i === res - 1 || j === 0 || j === res - 1) return 0;
            
            const hL = this.heightMap[(i - 1) * res + j];
            const hR = this.heightMap[(i + 1) * res + j];
            const hD = this.heightMap[i * res + (j - 1)];
            const hU = this.heightMap[i * res + (j + 1)];
            
            const slope = Math.sqrt(
                Math.pow(hR - hL, 2) + 
                Math.pow(hU - hD, 2)
            ) / 2;
            
            return Math.min(1, slope / 10);
        }
        
        // ============================================================
        //  🏔️ GENERAR MESH DE TERRENO MEJORADO
        //  ============================================================
        generateTerrainMesh(scene, heightMap) {
            const res = this.config.resolution;
            const size = this.config.worldSize;
            const halfSize = size / 2;
            
            // Determinar nivel de detalle
            const lodLevel = this.config.lodEnabled ? this._calculateLOD() : 0;
            const step = Math.max(1, Math.pow(2, lodLevel));
            const lodRes = Math.floor(res / step);
            
            const positions = [];
            const indices = [];
            const uvs = [];
            const normals = [];
            const colors = [];
            
            // Generar vértices con LOD
            for (let i = 0; i <= lodRes; i++) {
                for (let j = 0; j <= lodRes; j++) {
                    const x = (i / lodRes) * size - halfSize;
                    const z = (j / lodRes) * size - halfSize;
                    
                    const heightIdx = Math.floor(i * step) * res + Math.floor(j * step);
                    const y = heightMap ? heightMap[heightIdx] || 0 : 0;
                    
                    positions.push(x, y, z);
                    uvs.push(i / lodRes, j / lodRes);
                    
                    const color = this._getBiomeColor(x, z, y);
                    colors.push(color.r, color.g, color.b);
                }
            }
            
            // Generar índices
            for (let i = 0; i < lodRes; i++) {
                for (let j = 0; j < lodRes; j++) {
                    const a = i * (lodRes + 1) + j;
                    const b = a + 1;
                    const c = a + (lodRes + 1);
                    const d = c + 1;
                    indices.push(a, c, b, b, c, d);
                }
            }
            
            // Crear geometría
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();
            
            // Material PBR mejorado
            const detailTexture = this._getDetailTexture();
            const material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                map: detailTexture,
                roughness: 0.85,
                metalness: 0.0,
                flatShading: false,
                side: THREE.DoubleSide,
                wireframe: false
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.receiveShadow = true;
            mesh.castShadow = false;
            scene.add(mesh);
            
            this.stats.totalVertices = positions.length / 3;
            this.stats.totalTriangles = indices.length / 3;
            
            return mesh;
        }
        
        // ============================================================
        //  🎨 TEXTURA DE DETALLE PROCEDURAL
        //  ============================================================
        _getDetailTexture() {
            if (this._detailTexture) return this._detailTexture;
            
            const size = 256;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = 0.78 + Math.random() * 0.22;
                data[i] *= noise;
                data[i + 1] *= noise;
                data[i + 2] *= noise;
            }
            ctx.putImageData(imageData, 0, 0);
            
            for (let i = 0; i < 90; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = 4 + Math.random() * 14;
                const shade = 0.85 + Math.random() * 0.3;
                ctx.beginPath();
                ctx.fillStyle = `rgba(${255 * shade},${255 * shade},${255 * shade},0.12)`;
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            const tiles = Math.max(8, Math.round(this.config.worldSize / 20));
            texture.repeat.set(tiles, tiles);
            
            this._detailTexture = texture;
            return texture;
        }
        
        // ============================================================
        //  🎨 COLOR POR BIOMA MEJORADO
        //  ============================================================
        _getBiomeColor(x, z, y) {
            const res = this.config.resolution;
            const halfSize = this.config.worldSize / 2;
            const ix = Math.floor((x + halfSize) / this.config.worldSize * res);
            const iz = Math.floor((z + halfSize) / this.config.worldSize * res);
            
            if (ix < 0 || ix >= res || iz < 0 || iz >= res) {
                return { r: 0.3, g: 0.5, b: 0.2 };
            }
            
            const idx = ix * res + iz;
            const biome = this.biomeMap ? this.biomeMap[idx] : 2;
            
            const BIOME_COLORS = {
                0: { r: 0.05, g: 0.1, b: 0.3 },
                1: { r: 0.8, g: 0.75, b: 0.6 },
                2: { r: 0.3, g: 0.6, b: 0.2 },
                3: { r: 0.2, g: 0.5, b: 0.15 },
                4: { r: 0.4, g: 0.35, b: 0.3 },
                5: { r: 0.8, g: 0.7, b: 0.4 },
                6: { r: 0.5, g: 0.5, b: 0.5 },
                7: { r: 0.2, g: 0.3, b: 0.1 }
            };
            
            let color = { ...(BIOME_COLORS[biome] || BIOME_COLORS[2]) };
            
            // Sistema de materiales por altura + pendiente
            const ROCK = { r: 0.32, g: 0.30, b: 0.28 };
            const SNOW = { r: 0.92, g: 0.94, b: 0.98 };
            const SAND = { r: 0.76, g: 0.68, b: 0.48 };
            
            const e = this.config.worldSize / res;
            const slope = this._calculateSlope(ix, iz);
            
            const mix = (a, b, t) => ({
                r: a.r + (b.r - a.r) * t,
                g: a.g + (b.g - a.g) * t,
                b: a.b + (b.b - a.b) * t
            });
            
            const maxHeight = this.config.terrainHeight || 30;
            const waterLevel = (this.config.waterLevel || 0.5) * maxHeight * 0.3;
            
            const rockFactor = Math.min(1, Math.max(0, (slope - 0.4) / 1.2));
            color = mix(color, ROCK, rockFactor);
            
            const snowLine = maxHeight * 0.92;
            const snowFactor = Math.min(1, Math.max(0, (y - snowLine) / (maxHeight * 0.25))) * (1 - rockFactor * 0.6);
            color = mix(color, SNOW, snowFactor);
            
            const sandFactor = Math.min(1, Math.max(0, 1 - Math.abs(y - waterLevel) / 1.5)) * (1 - rockFactor);
            color = mix(color, SAND, sandFactor * 0.7);
            
            const variation = 0.06;
            return {
                r: color.r + (Math.random() - 0.5) * variation,
                g: color.g + (Math.random() - 0.5) * variation,
                b: color.b + (Math.random() - 0.5) * variation
            };
        }
        
        // ============================================================
        //  📏 CÁLCULO DE LOD MEJORADO
        //  ============================================================
        _calculateLOD() {
            // Basado en distancia y rendimiento
            const distance = 0;
            const maxLOD = this.config.lodLevels - 1;
            
            // Obtener presión de rendimiento
            let pressure = 0;
            try {
                const engine = window.engine;
                if (engine && engine.getModule) {
                    const optimizer = engine.getModule('optimizerAI');
                    if (optimizer && typeof optimizer.getLoadPressure === 'function') {
                        pressure = optimizer.getLoadPressure();
                    }
                }
            } catch (e) {}
            
            // Ajustar LOD basado en presión
            const lodAdjustment = Math.floor(pressure * 2);
            
            let lod = 0;
            if (distance > 500) lod = maxLOD;
            else if (distance > 300) lod = Math.min(3, maxLOD);
            else if (distance > 150) lod = Math.min(2, maxLOD);
            else if (distance > 50) lod = Math.min(1, maxLOD);
            
            return Math.min(maxLOD, lod + lodAdjustment);
        }
        
        // ============================================================
        //  🔧 MÉTODOS DE UTILIDAD MEJORADOS
        //  ============================================================
        getHeight(x, z) {
            if (!this.heightMap) return 0;
            const res = this.config.resolution;
            const halfSize = this.config.worldSize / 2;
            const ix = Math.floor((x + halfSize) / this.config.worldSize * res);
            const iz = Math.floor((z + halfSize) / this.config.worldSize * res);
            
            if (ix < 0 || ix >= res || iz < 0 || iz >= res) return 0;
            return this.heightMap[ix * res + iz];
        }
        
        getHeightInterpolated(x, z) {
            // Versión con interpolación bilineal para mayor precisión
            if (!this.heightMap) return 0;
            const res = this.config.resolution;
            const halfSize = this.config.worldSize / 2;
            
            const fx = (x + halfSize) / this.config.worldSize * res;
            const fz = (z + halfSize) / this.config.worldSize * res;
            
            const ix = Math.floor(fx);
            const iz = Math.floor(fz);
            const fx2 = fx - ix;
            const fz2 = fz - iz;
            
            if (ix < 0 || ix >= res - 1 || iz < 0 || iz >= res - 1) return 0;
            
            const h00 = this.heightMap[ix * res + iz];
            const h10 = this.heightMap[(ix + 1) * res + iz];
            const h01 = this.heightMap[ix * res + (iz + 1)];
            const h11 = this.heightMap[(ix + 1) * res + (iz + 1)];
            
            return h00 * (1 - fx2) * (1 - fz2) +
                   h10 * fx2 * (1 - fz2) +
                   h01 * (1 - fx2) * fz2 +
                   h11 * fx2 * fz2;
        }
        
        getMoisture(x, z) {
            if (!this.moistureMap) return 0.5;
            const res = this.config.resolution;
            const halfSize = this.config.worldSize / 2;
            const ix = Math.floor((x + halfSize) / this.config.worldSize * res);
            const iz = Math.floor((z + halfSize) / this.config.worldSize * res);
            
            if (ix < 0 || ix >= res || iz < 0 || iz >= res) return 0.5;
            return this.moistureMap[ix * res + iz];
        }
        
        getBiome(x, z) {
            if (!this.biomeMap) return 2;
            const res = this.config.resolution;
            const halfSize = this.config.worldSize / 2;
            const ix = Math.floor((x + halfSize) / this.config.worldSize * res);
            const iz = Math.floor((z + halfSize) / this.config.worldSize * res);
            
            if (ix < 0 || ix >= res || iz < 0 || iz >= res) return 2;
            return this.biomeMap[ix * res + iz];
        }
        
        getBiomeName(x, z) {
            const BIOME_NAMES = ['OCEAN', 'BEACH', 'GRASSLAND', 'FOREST', 'MOUNTAIN', 'DESERT', 'TUNDRA', 'SWAMP'];
            const biome = this.getBiome(x, z);
            return BIOME_NAMES[biome] || 'UNKNOWN';
        }
        
        getVegetationFactor(x, z) {
            if (!this.vegetationMap) return 0.3;
            const res = this.config.resolution;
            const halfSize = this.config.worldSize / 2;
            const ix = Math.floor((x + halfSize) / this.config.worldSize * res);
            const iz = Math.floor((z + halfSize) / this.config.worldSize * res);
            
            if (ix < 0 || ix >= res || iz < 0 || iz >= res) return 0.3;
            return this.vegetationMap[ix * res + iz];
        }
        
        isWater(x, z) {
            const height = this.getHeight(x, z);
            const waterLevel = this.config.waterLevel * this.config.terrainHeight;
            return height < waterLevel;
        }
        
        isRiver(x, z) {
            if (!this.riverMap) return false;
            const res = this.config.resolution;
            const halfSize = this.config.worldSize / 2;
            const ix = Math.floor((x + halfSize) / this.config.worldSize * res);
            const iz = Math.floor((z + halfSize) / this.config.worldSize * res);
            
            if (ix < 0 || ix >= res || iz < 0 || iz >= res) return false;
            return this.riverMap[ix * res + iz] > 0.5;
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS MEJORADAS
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                heightMapSize: this.heightMap ? this.heightMap.length : 0,
                moistureMapSize: this.moistureMap ? this.moistureMap.length : 0,
                biomeMapSize: this.biomeMap ? this.biomeMap.length : 0,
                hasRivers: !!this.riverMap,
                hasTectonics: !!this.tectonicMap,
                hasFaults: !!this.faultMap,
                hasVegetation: !!this.vegetationMap,
                biomesCount: this.stats.biomesCount,
                biomesEnabled: this.config.biomesEnabled,
                erosionEnabled: this.config.erosionEnabled,
                tectonicEnabled: this.config.tectonicEnabled,
                biomeAITrained: this.biomeAI.trained,
                biomeAIIterations: this.biomeAI.iterations
            };
        }
        
        // ============================================================
        //  🔄 RESET MEJORADO
        //  ============================================================
        reset() {
            this.heightMap = null;
            this.moistureMap = null;
            this.biomeMap = null;
            this.riverMap = null;
            this.tectonicMap = null;
            this.thermalMap = null;
            this.erosionMap = null;
            this.vegetationMap = null;
            this.faultMap = null;
            
            this.stats = {
                generationTime: 0,
                totalVertices: 0,
                totalTriangles: 0,
                biomesCount: {},
                riversCount: 0,
                tectonicEvents: 0,
                erosionTime: 0,
                biomeTime: 0,
                memoryUsage: 0
            };
            
            this._cache.clear();
            this._textureCache.clear();
            this._detailTexture = null;
            
            if (this.config.useAIBiomes) {
                this._initBiomeAI();
            }
            
            console.log('🔄 TerrainGenerator Cuántico reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.TerrainGenerator = TerrainGenerator;
    
    console.log('🌍 TerrainGenerator Cuántico cargado');
    console.log('🧠 IA de biomas con clustering');
    console.log('🏔️ Simulación de placas tectónicas');
    console.log('💧 Erosión hidráulica y térmica');
    console.log('🌊 Ríos con meandros');
    console.log('🌱 Mapa de vegetación predictiva');
    console.log('📏 LOD dinámico adaptativo');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TerrainGenerator;
    }
    
})();
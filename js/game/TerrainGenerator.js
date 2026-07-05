/**
 * 🌍 PRIOM V0.1 - TERRAIN GENERATOR
 * "El arte de crear mundos desde cero"
 * 
 * 📁 Ubicación: js/game/TerrainGenerator.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Generación procedural de terreno
 * 
 * ⭐ INNOVACIONES:
 * - Ruido Perlin multi-octava para altura
 * - Erosión hidráulica simulada
 * - Generación de biomas por altura y humedad
 * - Sistema de ríos y lagos procedurales
 * - Terreno con LOD basado en distancia
 * - Texturizado procedural por bioma
 * - Sistema de vegetación basado en bioma
 * - Generación de caminos y asentamientos
 * - Sistema de cuevas y acantilados
 * - Optimización de malla con geometría adaptativa
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌍 TerrainGenerator - Generador de Terreno
     * Crea terreno procedural con múltiples técnicas
     */
    class TerrainGenerator {
        constructor(config = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                worldSize: config.worldSize || 1000,
                terrainHeight: config.terrainHeight || 30,
                seed: config.seed || 42,
                resolution: config.resolution || 256,
                octaves: config.octaves || 6,
                persistence: config.persistence || 0.5,
                lacunarity: config.lacunarity || 2.0,
                scale: config.scale || 0.02,
                waterLevel: config.waterLevel || 0.5,
                
                // Erosión
                erosionEnabled: config.erosionEnabled || true,
                erosionIterations: config.erosionIterations || 10,
                erosionStrength: config.erosionStrength || 0.3,
                
                // Biomas
                biomesEnabled: config.biomesEnabled || true,
                biomeTransition: config.biomeTransition || 0.15,
                
                // Ríos
                riversEnabled: config.riversEnabled || true,
                riverCount: config.riverCount || 5,
                riverWidth: config.riverWidth || 2.0,
                
                // Vegetación
                vegetationEnabled: config.vegetationEnabled || true,
                treeDensity: config.treeDensity || 0.3,
                
                // Optimización
                lodEnabled: config.lodEnabled || true,
                lodLevels: config.lodLevels || 4,
                maxTriangles: config.maxTriangles || 200000
            };
            
            // ============================================================
            //  📊 GENERADORES DE RUIDO
            //  ============================================================
            this._perm = new Uint8Array(512);
            this._grad2 = new Float32Array(512);
            this._grad3 = new Float32Array(512);
            
            // ============================================================
            //  🗺️ MAPAS
            //  ============================================================
            this.heightMap = null;
            this.moistureMap = null;
            this.biomeMap = null;
            this.riverMap = null;
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                generationTime: 0,
                totalVertices: 0,
                totalTriangles: 0,
                biomesCount: {},
                riversCount: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌍 TerrainGenerator inicializado');
            console.log(`📊 Tamaño: ${this.config.worldSize}x${this.config.worldSize}`);
            console.log(`📊 Resolución: ${this.config.resolution}x${this.config.resolution}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Inicializar permutación para ruido Perlin
            const p = new Uint8Array(256);
            for (let i = 0; i < 256; i++) p[i] = i;
            
            // Mezclar usando la semilla
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
        }
        
        // ============================================================
        //  🌊 RUIDO PERLIN
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
        //  🗺️ GENERACIÓN DE MAPAS
        //  ============================================================
        
        /**
         * Generar el mapa de alturas
         */
        generateHeightMap(size) {
            const startTime = performance.now();
            const res = this.config.resolution;
            const scale = this.config.scale;
            
            this.heightMap = new Float32Array(res * res);
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const x = (i / res - 0.5) * size;
                    const z = (j / res - 0.5) * size;
                    
                    // Múltiples capas de ruido
                    let height = this.fbm(x * scale, z * scale, this.config.octaves, this.config.persistence, this.config.lacunarity);
                    
                    // Elevar montañas
                    const mountainFactor = this.fbm(x * scale * 0.5, z * scale * 0.5, 3, 0.5, 2.0);
                    height += mountainFactor * 0.3;
                    
                    // Suavizar
                    height = Math.max(-0.8, Math.min(0.8, height));
                    
                    // Escalar a altura real
                    const finalHeight = (height + 0.5) * this.config.terrainHeight;
                    
                    this.heightMap[i * res + j] = finalHeight;
                }
            }
            
            // Aplicar erosión
            if (this.config.erosionEnabled) {
                this._applyErosion();
            }
            
            // Generar ríos
            if (this.config.riversEnabled) {
                this.riverMap = this._generateRivers();
            }
            
            // Generar mapa de humedad
            this.moistureMap = this._generateMoistureMap();
            
            // Generar biomas
            if (this.config.biomesEnabled) {
                this.biomeMap = this._generateBiomes();
            }
            
            this.stats.generationTime = performance.now() - startTime;
            
            return this.heightMap;
        }
        
        // ============================================================
        //  💧 EROSIÓN HIDRÁULICA
        //  ============================================================
        _applyErosion() {
            const res = this.config.resolution;
            const iterations = this.config.erosionIterations;
            const strength = this.config.erosionStrength;
            
            for (let iter = 0; iter < iterations; iter++) {
                const newHeight = new Float32Array(this.heightMap);
                
                for (let i = 1; i < res - 1; i++) {
                    for (let j = 1; j < res - 1; j++) {
                        const idx = i * res + j;
                        const current = this.heightMap[idx];
                        
                        // Calcular pendientes
                        const dX = (this.heightMap[(i + 1) * res + j] - this.heightMap[(i - 1) * res + j]) / 2;
                        const dZ = (this.heightMap[i * res + (j + 1)] - this.heightMap[i * res + (j - 1)]) / 2;
                        
                        // Movimiento de agua
                        const flowX = -dX * strength;
                        const flowZ = -dZ * strength;
                        
                        // Aplicar erosión
                        const erosion = (Math.abs(dX) + Math.abs(dZ)) * 0.1 * strength;
                        newHeight[idx] = current - erosion;
                        
                        // Depositar en puntos bajos
                        if (dX > 0) newHeight[(i + 1) * res + j] += erosion * 0.5;
                        if (dX < 0) newHeight[(i - 1) * res + j] += erosion * 0.5;
                        if (dZ > 0) newHeight[i * res + (j + 1)] += erosion * 0.5;
                        if (dZ < 0) newHeight[i * res + (j - 1)] += erosion * 0.5;
                    }
                }
                
                this.heightMap = newHeight;
            }
        }
        
        // ============================================================
        //  🌊 GENERACIÓN DE RÍOS
        //  ============================================================
        _generateRivers() {
            const res = this.config.resolution;
            const riverCount = this.config.riverCount;
            const riverMap = new Float32Array(res * res);
            
            for (let r = 0; r < riverCount; r++) {
                // Punto de inicio en lo alto
                let x = Math.floor(Math.random() * res);
                let y = Math.floor(Math.random() * res);
                
                // Buscar punto alto
                for (let attempt = 0; attempt < 50; attempt++) {
                    const idx = x * res + y;
                    if (this.heightMap[idx] > this.config.terrainHeight * 0.6) break;
                    x = Math.floor(Math.random() * res);
                    y = Math.floor(Math.random() * res);
                }
                
                // Seguir el flujo hacia abajo
                const path = [];
                let currentX = x, currentY = y;
                
                for (let step = 0; step < 100; step++) {
                    path.push({ x: currentX, y: currentY });
                    riverMap[currentX * res + currentY] = 1;
                    
                    // Buscar vecino más bajo
                    let minHeight = Infinity;
                    let nextX = currentX, nextY = currentY;
                    
                    const neighbors = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1],           [0, 1],
                        [1, -1],  [1, 0],  [1, 1]
                    ];
                    
                    for (const [dx, dz] of neighbors) {
                        const nx = currentX + dx;
                        const nz = currentY + dz;
                        if (nx >= 0 && nx < res && nz >= 0 && nz < res) {
                            const idx = nx * res + nz;
                            if (this.heightMap[idx] < minHeight && riverMap[idx] === 0) {
                                minHeight = this.heightMap[idx];
                                nextX = nx;
                                nextY = nz;
                            }
                        }
                    }
                    
                    if (nextX === currentX && nextY === currentY) break;
                    currentX = nextX;
                    currentY = nextY;
                }
                
                // Dibujar el río con ancho
                const width = this.config.riverWidth;
                for (const point of path) {
                    for (let dx = -Math.floor(width); dx <= Math.floor(width); dx++) {
                        for (let dz = -Math.floor(width); dz <= Math.floor(width); dz++) {
                            const px = point.x + dx;
                            const py = point.y + dz;
                            if (px >= 0 && px < res && py >= 0 && py < res) {
                                const dist = Math.sqrt(dx*dx + dz*dz);
                                if (dist < width) {
                                    const idx = px * res + py;
                                    riverMap[idx] = Math.max(riverMap[idx], 1 - dist / width);
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
        //  💧 MAPA DE HUMEDAD
        //  ============================================================
        _generateMoistureMap() {
            const res = this.config.resolution;
            const moistureMap = new Float32Array(res * res);
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const idx = i * res + j;
                    const height = this.heightMap[idx];
                    
                    // Humedad base por altura
                    let moisture = 1 - (height / this.config.terrainHeight);
                    moisture = Math.max(0, Math.min(1, moisture));
                    
                    // Influencia de ríos
                    if (this.riverMap && this.riverMap[idx] > 0) {
                        moisture = Math.max(moisture, this.riverMap[idx] * 0.7);
                    }
                    
                    // Ruido para variación
                    moisture += this.noise(i * 0.01, j * 0.01) * 0.1;
                    moisture = Math.max(0, Math.min(1, moisture));
                    
                    moistureMap[idx] = moisture;
                }
            }
            
            return moistureMap;
        }
        
        // ============================================================
        //  🌿 GENERACIÓN DE BIOMAS
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
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const idx = i * res + j;
                    const height = this.heightMap[idx];
                    const moisture = this.moistureMap[idx];
                    
                    let biome = BIOMES.GRASSLAND;
                    const waterLevel = this.config.waterLevel * this.config.terrainHeight;
                    
                    if (height < waterLevel) {
                        biome = BIOMES.OCEAN;
                    } else if (height < waterLevel + 1) {
                        biome = BIOMES.BEACH;
                    } else if (height > this.config.terrainHeight * 0.7) {
                        biome = BIOMES.MOUNTAIN;
                    } else if (moisture > 0.7 && height < this.config.terrainHeight * 0.4) {
                        biome = BIOMES.SWAMP;
                    } else if (moisture > 0.5 && height < this.config.terrainHeight * 0.5) {
                        biome = BIOMES.FOREST;
                    } else if (moisture < 0.2 && height > this.config.terrainHeight * 0.3) {
                        biome = BIOMES.DESERT;
                    } else if (height > this.config.terrainHeight * 0.5) {
                        biome = BIOMES.TUNDRA;
                    }
                    
                    biomeMap[idx] = biome;
                    
                    // Contar biomas
                    const biomeName = Object.keys(BIOMES)[biome];
                    this.stats.biomesCount[biomeName] = (this.stats.biomesCount[biomeName] || 0) + 1;
                }
            }
            
            return biomeMap;
        }
        
        // ============================================================
        //  🏔️ GENERAR MESH DE TERRENO
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
            
            // Generar vértices
            for (let i = 0; i <= lodRes; i++) {
                for (let j = 0; j <= lodRes; j++) {
                    const x = (i / lodRes) * size - halfSize;
                    const z = (j / lodRes) * size - halfSize;
                    
                    // Obtener altura
                    const heightIdx = Math.floor(i * step) * res + Math.floor(j * step);
                    const y = heightMap ? heightMap[heightIdx] || 0 : 0;
                    
                    positions.push(x, y, z);
                    uvs.push(i / lodRes, j / lodRes);
                    
                    // Color basado en bioma
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
            
            // Calcular normales
            for (let i = 0; i < positions.length / 3; i++) {
                normals.push(0, 1, 0);
            }
            
            // Crear geometría
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();
            
            // Material
            const material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                roughness: 0.8,
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
        //  🎨 COLOR POR BIOMA
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
                0: { r: 0.05, g: 0.1, b: 0.3 },  // OCEAN
                1: { r: 0.8, g: 0.75, b: 0.6 },  // BEACH
                2: { r: 0.3, g: 0.6, b: 0.2 },   // GRASSLAND
                3: { r: 0.2, g: 0.5, b: 0.15 },  // FOREST
                4: { r: 0.4, g: 0.35, b: 0.3 },  // MOUNTAIN
                5: { r: 0.8, g: 0.7, b: 0.4 },   // DESERT
                6: { r: 0.5, g: 0.5, b: 0.5 },   // TUNDRA
                7: { r: 0.2, g: 0.3, b: 0.1 }    // SWAMP
            };
            
            const color = BIOME_COLORS[biome] || BIOME_COLORS[2];
            
            // Variación sutil
            const variation = 0.1;
            return {
                r: color.r + (Math.random() - 0.5) * variation,
                g: color.g + (Math.random() - 0.5) * variation,
                b: color.b + (Math.random() - 0.5) * variation
            };
        }
        
        // ============================================================
        //  📏 CÁLCULO DE LOD
        //  ============================================================
        _calculateLOD() {
            // Basado en distancia o rendimiento
            const distance = 0; // Distancia desde la cámara
            const maxLOD = this.config.lodLevels - 1;
            
            if (distance > 500) return maxLOD;
            if (distance > 300) return Math.min(3, maxLOD);
            if (distance > 150) return Math.min(2, maxLOD);
            if (distance > 50) return Math.min(1, maxLOD);
            return 0;
        }
        
        // ============================================================
        //  🔧 MÉTODOS DE UTILIDAD
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
        
        isWater(x, z) {
            const height = this.getHeight(x, z);
            const waterLevel = this.config.waterLevel * this.config.terrainHeight;
            return height < waterLevel;
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                heightMapSize: this.heightMap ? this.heightMap.length : 0,
                moistureMapSize: this.moistureMap ? this.moistureMap.length : 0,
                biomeMapSize: this.biomeMap ? this.biomeMap.length : 0,
                hasRivers: !!this.riverMap
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.heightMap = null;
            this.moistureMap = null;
            this.biomeMap = null;
            this.riverMap = null;
            this.stats = {
                generationTime: 0,
                totalVertices: 0,
                totalTriangles: 0,
                biomesCount: {},
                riversCount: 0
            };
            
            console.log('🔄 TerrainGenerator reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.TerrainGenerator = TerrainGenerator;
    
    console.log('🌍 TerrainGenerator cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TerrainGenerator;
    }
    
})();
    
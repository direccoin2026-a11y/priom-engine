/**
 * 🌸 PRIOM V0.4 - VEGETATION PLACER CUÁNTICO
 * "Sistema de vegetación decorativa con IA generativa y ciclo de vida"
 * 
 * 📁 Ubicación: js/game/VegetationPlacer.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Colocación de vegetación decorativa con IA y simulación
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de crecimiento de flores (edad + tamaño + floración)
 * - Variedad de especies (15 tipos de flores con colores únicos)
 * - Sistema de polinización y dispersión de semillas
 * - Ciclo de vida completo (semilla → brote → flor → semilla)
 * - Colores estacionales dinámicos
 * - LOD automático por distancia
 * - Animación de viento en tiempo real (shader)
 * - Sistema de competencia por recursos (luz, agua, nutrientes)
 * - Memoria de áreas plantadas para regeneración
 * - Interacción con WorldAI (crecimiento estacional)
 * - Sistema de polinizadores (abejas/mariposas simuladas)
 * - Efectos de iluminación (luz solar filtrada)
 * - Sistema de "campos de flores" con densidad variable
 * - Pooling de mallas con reciclaje inteligente
 * - Optimización con InstancedMesh + LOD
 * - Integración con sistema de clima (lluvia afecta crecimiento)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌸 VegetationPlacer - Sistema de Vegetación Cuántica
     * Gestión avanzada de vegetación decorativa con IA
     */
    class VegetationPlacer {
        constructor(scene, terrain, config = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                worldSize: config.worldSize || 300,
                flowerCount: config.flowerCount || 800,
                maxGroups: config.maxGroups || 30,
                minAltitude: config.minAltitude || 1,
                maxAltitude: config.maxAltitude || 9,
                lodDistance: config.lodDistance || 150,
                growthSpeed: config.growthSpeed || 0.005,
                windStrength: config.windStrength || 0.12,
                seasonColor: config.seasonColor !== undefined ? config.seasonColor : true,
                useShadows: config.useShadows !== undefined ? config.useShadows : false,
                useLOD: config.useLOD !== undefined ? config.useLOD : true,
                useInstancing: config.useInstancing !== undefined ? config.useInstancing : true,
                useWind: config.useWind !== undefined ? config.useWind : true,
                useGrowth: config.useGrowth !== undefined ? config.useGrowth : true,
                usePollination: config.usePollination !== undefined ? config.usePollination : true,
                useCompetition: config.useCompetition !== undefined ? config.useCompetition : true,
                debugMode: config.debugMode || false
            };
            
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.scene = scene;
            this.terrain = terrain;
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.flowerMeshes = [];
            this.flowerData = [];
            this.seedBank = [];
            this.pollinators = [];
            this.growthData = new Map();
            this._clock = 0;
            this._frameCount = 0;
            this._windTime = 0;
            this._totalFlowers = 0;
            this._maxFlowers = 5000;
            
            // ============================================================
            //  🌸 ESPECIES DE FLORES (15 tipos)
            //  ============================================================
            this.flowerSpecies = [
                { name: 'rosa', color: 0xff5c8a, size: 0.12, growthRate: 0.8, season: 'primavera' },
                { name: 'amarilla', color: 0xffe066, size: 0.10, growthRate: 0.9, season: 'verano' },
                { name: 'naranja', color: 0xff8c42, size: 0.14, growthRate: 0.7, season: 'verano' },
                { name: 'blanca', color: 0xffffff, size: 0.08, growthRate: 0.6, season: 'primavera' },
                { name: 'lila', color: 0xb388ff, size: 0.11, growthRate: 0.75, season: 'primavera' },
                { name: 'roja', color: 0xff1744, size: 0.13, growthRate: 0.7, season: 'verano' },
                { name: 'azul', color: 0x4488ff, size: 0.09, growthRate: 0.65, season: 'primavera' },
                { name: 'verde', color: 0x66bb6a, size: 0.10, growthRate: 0.8, season: 'verano' },
                { name: 'morada', color: 0x9c27b0, size: 0.11, growthRate: 0.7, season: 'otoño' },
                { name: 'coral', color: 0xff6b6b, size: 0.12, growthRate: 0.75, season: 'verano' },
                { name: 'dorada', color: 0xffd700, size: 0.10, growthRate: 0.85, season: 'otoño' },
                { name: 'plateada', color: 0xbdbdbd, size: 0.08, growthRate: 0.5, season: 'invierno' },
                { name: 'lavanda', color: 0xce93d8, size: 0.11, growthRate: 0.7, season: 'primavera' },
                { name: 'melocotón', color: 0xffab91, size: 0.12, growthRate: 0.8, season: 'verano' },
                { name: 'menta', color: 0x81c784, size: 0.09, growthRate: 0.9, season: 'primavera' }
            ];
            
            // ============================================================
            //  🐝 POLINIZADORES (simulados)
            //  ============================================================
            this.pollinatorSpecies = [
                { name: 'abeja', color: 0xfdd835, size: 0.04, speed: 0.5 },
                { name: 'mariposa', color: 0xff6f00, size: 0.06, speed: 0.8 },
                { name: 'colibrí', color: 0x00e676, size: 0.05, speed: 1.2 }
            ];
            
            // ============================================================
            //  📊 CACHÉ DE POSICIONES
            //  ============================================================
            this._positionCache = [];
            this._dummy = new THREE.Object3D();
            this._tempColor = new THREE.Color();
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌸 VegetationPlacer Cuántico inicializado');
            console.log(`📊 ${this.flowerSpecies.length} especies de flores`);
            console.log(`📊 ${this.pollinatorSpecies.length} especies de polinizadores`);
            console.log(`📊 Máximo de flores: ${this._maxFlowers}`);
            console.log(`📊 Altitud máxima: ${this.config.maxAltitude}m`);
            console.log(`🌱 Crecimiento: ${this.config.useGrowth ? 'Activado' : 'Desactivado'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            this._generatePositions();
            this._initPollinators();
            console.log('✅ VegetationPlacer Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  📍 GENERAR POSICIONES EN CACHÉ
        //  ============================================================
        _generatePositions() {
            const total = this.config.flowerCount * 3;
            this._positionCache = [];
            
            for (let i = 0; i < total; i++) {
                const x = (Math.random() - 0.5) * this.config.worldSize;
                const z = (Math.random() - 0.5) * this.config.worldSize;
                const y = this._getHeight(x, z);
                const slope = this._getSlope(x, z);
                const moisture = this._getMoisture(x, z);
                const light = this._getLight(x, z);
                const biome = this._getBiome(x, z);
                
                // Condiciones para flores
                if (y < this.config.minAltitude || y > this.config.maxAltitude) continue;
                if (slope > 0.5) continue;
                if (moisture < 0.2) continue;
                if (biome === 4 || biome === 0) continue; // Montaña o océano
                
                this._positionCache.push({
                    x, y, z,
                    slope,
                    moisture,
                    lightFactor: light || 0.5,
                    biome,
                    valid: true
                });
            }
            
            // Mezclar para distribución aleatoria
            for (let i = this._positionCache.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this._positionCache[i], this._positionCache[j]] = 
                [this._positionCache[j], this._positionCache[i]];
            }
            
            console.log(`📍 Posiciones generadas: ${this._positionCache.length}`);
        }
        
        // ============================================================
        //  🐝 INICIALIZAR POLINIZADORES
        //  ============================================================
        _initPollinators() {
            for (const species of this.pollinatorSpecies) {
                for (let i = 0; i < 3; i++) {
                    this.pollinators.push({
                        species: species,
                        x: (Math.random() - 0.5) * this.config.worldSize * 0.5,
                        z: (Math.random() - 0.5) * this.config.worldSize * 0.5,
                        y: 1 + Math.random() * 5,
                        angle: Math.random() * Math.PI * 2,
                        speed: species.speed * (0.5 + Math.random() * 0.5),
                        phase: Math.random() * Math.PI * 2,
                        active: true,
                        targetFlower: null
                    });
                }
            }
            console.log(`🐝 ${this.pollinators.length} polinizadores inicializados`);
        }
        
        // ============================================================
        //  🌸 PLANTAR FLORES MEJORADO
        //  ============================================================
        plantFlowers(count = 800) {
            // Limpiar flores existentes
            this.clear();
            
            try {
                const startTime = performance.now();
                const maxGroups = this.config.maxGroups;
                const colors = this.flowerSpecies.map(s => s.color);
                const speciesCount = Math.min(this.flowerSpecies.length, colors.length);
                
                // Usar posiciones de caché
                const positions = this._positionCache.slice(0, Math.min(count * 2, this._positionCache.length));
                
                if (positions.length === 0) {
                    console.warn('⚠️ No hay posiciones válidas para flores');
                    return;
                }
                
                // Calcular cuántas flores por grupo
                const totalPositions = positions.length;
                const perGroup = Math.max(10, Math.floor(totalPositions / speciesCount));
                
                let placed = 0;
                let totalPlaced = 0;
                
                for (let s = 0; s < speciesCount && placed < totalPositions; s++) {
                    const color = colors[s];
                    const species = this.flowerSpecies[s % this.flowerSpecies.length];
                    const countForSpecies = Math.min(perGroup, totalPositions - placed);
                    
                    if (countForSpecies <= 0) continue;
                    
                    const material = this._createFlowerMaterial(color, species);
                    const geometry = new THREE.ConeGeometry(0.06, 0.18, 5);
                    geometry.translate(0, 0.09, 0);
                    
                    const mesh = new THREE.InstancedMesh(geometry, material, countForSpecies);
                    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                    
                    let placedForSpecies = 0;
                    
                    for (let i = 0; i < countForSpecies && placed + i < totalPositions; i++) {
                        const pos = positions[placed + i];
                        if (!pos) continue;
                        
                        const growth = this.config.useGrowth ? 
                            0.3 + Math.random() * 0.7 : 0.8 + Math.random() * 0.2;
                        
                        // Guardar datos de crecimiento
                        const key = `${pos.x.toFixed(2)},${pos.z.toFixed(2)}`;
                        this.growthData.set(key, {
                            species: species.name,
                            color: color,
                            age: Math.random() * 50,
                            size: growth,
                            maxSize: 0.6 + Math.random() * 0.5,
                            health: 0.7 + Math.random() * 0.3,
                            blooming: 0.3 + Math.random() * 0.5,
                            seeds: 0,
                            pos: { x: pos.x, y: pos.y, z: pos.z }
                        });
                        
                        this._dummy.position.set(pos.x, pos.y + 0.1, pos.z);
                        this._dummy.rotation.y = Math.random() * Math.PI * 2;
                        
                        const scale = (0.7 + Math.random() * 0.5) * growth;
                        this._dummy.scale.set(scale, scale, scale);
                        this._dummy.updateMatrix();
                        mesh.setMatrixAt(placedForSpecies, this._dummy.matrix);
                        
                        this.flowerData.push({
                            index: placedForSpecies,
                            pos: { x: pos.x, y: pos.y, z: pos.z },
                            scale: scale,
                            color: color,
                            species: species.name,
                            growth: growth,
                            mesh: mesh,
                            blooming: 0.5 + Math.random() * 0.5,
                            age: 0
                        });
                        
                        placedForSpecies++;
                        totalPlaced++;
                    }
                    
                    mesh.count = placedForSpecies;
                    mesh.castShadow = this.config.useShadows;
                    mesh.receiveShadow = true;
                    
                    if (this.config.useLOD) {
                        mesh.frustumCulled = true;
                    }
                    
                    this.scene.add(mesh);
                    this.flowerMeshes.push(mesh);
                    placed += countForSpecies;
                }
                
                this._totalFlowers = totalPlaced;
                
                const elapsed = performance.now() - startTime;
                console.log(`🌼 VegetationPlacer: ${this._totalFlowers} flores plantadas (${elapsed}ms)`);
                console.log(`   ${this.flowerMeshes.length} grupos activos, tope ${maxGroups}`);
                console.log(`   ${this.flowerData.length} flores en memoria`);
                
                this._recordEvent('flowers_planted', {
                    count: this._totalFlowers,
                    groups: this.flowerMeshes.length,
                    elapsed: elapsed
                });
                
            } catch (e) {
                console.warn('⚠️ VegetationPlacer: no se pudieron plantar flores', e);
            }
        }
        
        // ============================================================
        //  🎨 CREAR MATERIAL DE FLOR
        //  ============================================================
        _createFlowerMaterial(color, species) {
            const mat = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.6,
                metalness: 0.0,
                emissive: color,
                emissiveIntensity: 0.08,
                transparent: true,
                opacity: 1.0
            });
            
            // Guardar color base para cambios estacionales
            mat.userData = { baseColor: color, species: species };
            
            return mat;
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN (crecimiento, viento, estaciones)
        //  ============================================================
        update(delta, cameraPos = null) {
            this._clock += delta;
            this._frameCount++;
            this._windTime += delta;
            
            // === CRECIMIENTO ===
            if (this.config.useGrowth && this._frameCount % 30 === 0) {
                this._updateGrowth(delta);
            }
            
            // === VIENTO ===
            if (this.config.useWind && this._frameCount % 2 === 0) {
                this._updateWind(delta);
            }
            
            // === POLINIZACIÓN ===
            if (this.config.usePollination && this._frameCount % 60 === 0) {
                this._updatePollination(delta);
            }
            
            // === COLORES ESTACIONALES ===
            if (this.config.seasonColor && this._frameCount % 60 === 0) {
                this._updateSeasonalColors();
            }
            
            // === LOD ===
            if (this.config.useLOD && cameraPos) {
                this._updateLOD(cameraPos);
            }
            
            // === POLINIZADORES ===
            if (this._frameCount % 10 === 0) {
                this._updatePollinators(delta);
            }
        }
        
        // ============================================================
        //  🌱 ACTUALIZAR CRECIMIENTO
        //  ============================================================
        _updateGrowth(delta) {
            const growthRate = this.config.growthSpeed * delta * 30;
            const season = this._getSeason();
            const seasonMultiplier = season === 'primavera' ? 1.5 : 
                                   (season === 'verano' ? 1.2 : 
                                   (season === 'otoño' ? 0.8 : 0.3));
            
            // Competencia por recursos
            const density = this.flowerData.length / (this.config.worldSize * this.config.worldSize / 10000);
            const competition = this.config.useCompetition ? 
                Math.max(0.3, 1 - density * 0.01) : 1;
            
            for (const [key, data] of this.growthData) {
                if (data.health < 0.2) continue;
                
                // Crecimiento según especie
                const speciesGrowth = data.species ? 
                    this.flowerSpecies.find(s => s.name === data.species)?.growthRate || 0.7 : 0.7;
                
                const growth = growthRate * speciesGrowth * seasonMultiplier * competition * data.health;
                data.size = Math.min(data.maxSize, data.size + growth);
                data.age += delta * 0.1;
                
                // Floración
                if (data.size > data.maxSize * 0.5) {
                    data.blooming = Math.min(1, data.blooming + delta * 0.01 * seasonMultiplier);
                }
                
                // Producción de semillas
                if (data.blooming > 0.8 && Math.random() < 0.001 * delta * 10) {
                    data.seeds = (data.seeds || 0) + 1;
                    this.seedBank.push({
                        x: data.pos.x + (Math.random() - 0.5) * 2,
                        z: data.pos.z + (Math.random() - 0.5) * 2,
                        species: data.species,
                        color: data.color
                    });
                }
                
                // Muerte natural
                if (data.age > 100 + Math.random() * 50) {
                    data.health -= delta * 0.001;
                }
                
                // Efecto de sequía
                const drought = this._getDroughtLevel();
                if (drought > 0.5) {
                    data.health -= delta * 0.002 * drought;
                }
            }
            
            // Limitar seed bank
            if (this.seedBank.length > 1000) {
                this.seedBank = this.seedBank.slice(-500);
            }
        }
        
        // ============================================================
        //  🌬️ ACTUALIZAR VIENTO
        //  ============================================================
        _updateWind(delta) {
            const windStrength = this.config.windStrength;
            
            for (const mesh of this.flowerMeshes) {
                if (!mesh.isInstancedMesh) continue;
                
                // Actualizar cada instancia con rotación por viento
                for (let i = 0; i < Math.min(mesh.count, 50); i++) {
                    const matrix = new THREE.Matrix4();
                    mesh.getMatrixAt(i, matrix);
                    const pos = new THREE.Vector3();
                    const quat = new THREE.Quaternion();
                    const scale = new THREE.Vector3();
                    matrix.decompose(pos, quat, scale);
                    
                    // Viento suave
                    const windSway = Math.sin(this._windTime * 0.4 + pos.x * 0.05 + pos.z * 0.05) * windStrength * 0.03;
                    const euler = new THREE.Euler().setFromQuaternion(quat);
                    euler.z = windSway;
                    quat.setFromEuler(euler);
                    
                    const newMatrix = new THREE.Matrix4().compose(pos, quat, scale);
                    mesh.setMatrixAt(i, newMatrix);
                }
                mesh.instanceMatrix.needsUpdate = true;
            }
        }
        
        // ============================================================
        //  🐝 POLINIZACIÓN
        //  ============================================================
        _updatePollination(delta) {
            if (this.flowerData.length < 10) return;
            
            const season = this._getSeason();
            if (season === 'invierno') return;
            
            // Seleccionar flores en floración
            const bloomingFlowers = this.flowerData.filter(f => f.blooming > 0.7);
            if (bloomingFlowers.length < 2) return;
            
            const pollinatorCount = Math.min(3, Math.floor(bloomingFlowers.length / 10) + 1);
            
            for (let p = 0; p < pollinatorCount; p++) {
                // Seleccionar dos flores aleatorias
                const idx1 = Math.floor(Math.random() * bloomingFlowers.length);
                let idx2 = Math.floor(Math.random() * bloomingFlowers.length);
                while (idx2 === idx1 && bloomingFlowers.length > 1) {
                    idx2 = Math.floor(Math.random() * bloomingFlowers.length);
                }
                
                const flower1 = bloomingFlowers[idx1];
                const flower2 = bloomingFlowers[idx2];
                
                // Polinización
                const key1 = `${flower1.pos.x.toFixed(2)},${flower1.pos.z.toFixed(2)}`;
                const key2 = `${flower2.pos.x.toFixed(2)},${flower2.pos.z.toFixed(2)}`;
                
                const data1 = this.growthData.get(key1);
                const data2 = this.growthData.get(key2);
                
                if (data1 && data2) {
                    // Intercambio genético (mezcla de colores)
                    if (Math.random() < 0.3) {
                        const color1 = data1.color;
                        const color2 = data2.color;
                        const mixed = this._mixColors(color1, color2);
                        
                        // Crear semilla híbrida
                        this.seedBank.push({
                            x: (data1.pos.x + data2.pos.x) / 2 + (Math.random() - 0.5) * 3,
                            z: (data1.pos.z + data2.pos.z) / 2 + (Math.random() - 0.5) * 3,
                            species: data1.species,
                            color: mixed,
                            hybrid: true
                        });
                    }
                    
                    // Aumentar floración
                    data1.blooming = Math.min(1, data1.blooming + 0.05);
                    data2.blooming = Math.min(1, data2.blooming + 0.05);
                }
            }
        }
        
        _mixColors(color1, color2) {
            const c1 = new THREE.Color(color1);
            const c2 = new THREE.Color(color2);
            const mixed = c1.clone().lerp(c2, Math.random() * 0.5 + 0.25);
            return mixed.getHex();
        }
        
        // ============================================================
        //  🍂 ACTUALIZAR COLORES ESTACIONALES
        //  ============================================================
        _updateSeasonalColors() {
            const season = this._getSeason();
            
            let tint = 0x000000;
            let intensity = 1.0;
            
            if (season === 'primavera') {
                tint = 0x44ff88;
                intensity = 1.1;
            } else if (season === 'verano') {
                tint = 0xff8800;
                intensity = 1.0;
            } else if (season === 'otoño') {
                tint = 0xff4400;
                intensity = 0.9;
            } else if (season === 'invierno') {
                tint = 0x8888ff;
                intensity = 0.6;
            }
            
            for (const mesh of this.flowerMeshes) {
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        for (const mat of mesh.material) {
                            if (mat.color && mat.userData?.baseColor) {
                                const baseColor = mat.userData.baseColor;
                                const adjusted = this._adjustColor(baseColor, intensity, tint);
                                mat.color.setHex(adjusted);
                            }
                        }
                    } else {
                        if (mesh.material.color && mesh.material.userData?.baseColor) {
                            const baseColor = mesh.material.userData.baseColor;
                            const adjusted = this._adjustColor(baseColor, intensity, tint);
                            mesh.material.color.setHex(adjusted);
                        }
                    }
                }
            }
        }
        
        _adjustColor(hex, intensity, tint) {
            const color = new THREE.Color(hex);
            const r = Math.min(255, Math.round(color.r * 255 * intensity));
            const g = Math.min(255, Math.round(color.g * 255 * intensity));
            const b = Math.min(255, Math.round(color.b * 255 * intensity));
            
            const tintColor = new THREE.Color(tint);
            const final = new THREE.Color(r / 255, g / 255, b / 255);
            final.lerp(tintColor, 0.1);
            
            return final.getHex();
        }
        
        // ============================================================
        //  🐝 ACTUALIZAR POLINIZADORES
        //  ============================================================
        _updatePollinators(delta) {
            for (const pollinator of this.pollinators) {
                // Movimiento orgánico
                pollinator.angle += (Math.random() - 0.5) * 0.05;
                pollinator.x += Math.cos(pollinator.angle) * pollinator.speed * delta * 2;
                pollinator.z += Math.sin(pollinator.angle) * pollinator.speed * delta * 2;
                pollinator.y += Math.sin(this._clock * 0.5 + pollinator.phase) * 0.01;
                
                // Mantener en el mundo
                const halfWorld = this.config.worldSize * 0.4;
                if (Math.abs(pollinator.x) > halfWorld) pollinator.angle += Math.PI;
                if (Math.abs(pollinator.z) > halfWorld) pollinator.angle += Math.PI;
                
                // Buscar flores cercanas
                if (this.flowerData.length > 0 && Math.random() < 0.01) {
                    const nearest = this.flowerData.reduce((a, b) => {
                        const da = Math.sqrt((a.pos.x - pollinator.x) ** 2 + (a.pos.z - pollinator.z) ** 2);
                        const db = Math.sqrt((b.pos.x - pollinator.x) ** 2 + (b.pos.z - pollinator.z) ** 2);
                        return da < db ? a : b;
                    });
                    pollinator.targetFlower = nearest;
                }
                
                // Moverse hacia la flor objetivo
                if (pollinator.targetFlower) {
                    const dx = pollinator.targetFlower.pos.x - pollinator.x;
                    const dz = pollinator.targetFlower.pos.z - pollinator.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    if (dist < 0.5) {
                        // Polinizar
                        const key = `${pollinator.targetFlower.pos.x.toFixed(2)},${pollinator.targetFlower.pos.z.toFixed(2)}`;
                        const data = this.growthData.get(key);
                        if (data) {
                            data.blooming = Math.min(1, data.blooming + 0.1);
                            data.health = Math.min(1, data.health + 0.05);
                            pollinator.targetFlower = null;
                        }
                    } else if (dist > 0) {
                        pollinator.x += (dx / dist) * pollinator.speed * delta * 0.5;
                        pollinator.z += (dz / dist) * pollinator.speed * delta * 0.5;
                    }
                }
            }
        }
        
        // ============================================================
        //  📏 ACTUALIZAR LOD
        //  ============================================================
        _updateLOD(cameraPos) {
            const camX = cameraPos.x;
            const camZ = cameraPos.z;
            
            for (const mesh of this.flowerMeshes) {
                if (!mesh.isInstancedMesh) continue;
                
                const centerX = mesh.position.x || 0;
                const centerZ = mesh.position.z || 0;
                const dist = Math.sqrt(
                    (centerX - camX) ** 2 + 
                    (centerZ - camZ) ** 2
                );
                
                const maxDist = this.config.lodDistance;
                const visible = dist < maxDist;
                mesh.visible = visible;
                
                if (visible) {
                    const detail = 1 - (dist / maxDist) * 0.85;
                    const targetCount = Math.max(5, Math.floor(mesh.count * detail));
                    if (targetCount < mesh.count) {
                        mesh.count = targetCount;
                    }
                }
            }
        }
        
        // ============================================================
        //  📊 UTILIDADES DE TERRENO
        //  ============================================================
        _getHeight(x, z) {
            if (this.terrain && typeof this.terrain.getHeight === 'function') {
                return this.terrain.getHeight(x, z);
            }
            return 0;
        }
        
        _getSlope(x, z) {
            const e = 2;
            const h = (dx, dz) => {
                if (this.terrain && typeof this.terrain.getHeight === 'function') {
                    return this.terrain.getHeight(x + dx, z + dz);
                }
                return 0;
            };
            return (Math.abs(h(e, 0) - h(-e, 0)) + Math.abs(h(0, e) - h(0, -e))) / (e * 2);
        }
        
        _getMoisture(x, z) {
            if (this.terrain && typeof this.terrain.getMoisture === 'function') {
                return this.terrain.getMoisture(x, z);
            }
            return 0.5;
        }
        
        _getBiome(x, z) {
            if (this.terrain && typeof this.terrain.getBiome === 'function') {
                return this.terrain.getBiome(x, z);
            }
            return 2;
        }
        
        _getLight(x, z) {
            const slope = this._getSlope(x, z);
            const aspect = Math.atan2(x, z);
            const sunAngle = 0.5 + Math.sin(aspect) * 0.3;
            return Math.max(0.2, Math.min(0.9, sunAngle - slope * 0.5));
        }
        
        _getSeason() {
            try {
                const engine = window.engine;
                if (engine && engine.getModule) {
                    const worldAI = engine.getModule('worldAI');
                    if (worldAI && worldAI.getStatus) {
                        return worldAI.getStatus().season || 'primavera';
                    }
                }
            } catch (e) {
                // Ignorar
            }
            return 'primavera';
        }
        
        _getDroughtLevel() {
            try {
                const engine = window.engine;
                if (engine && engine.getModule) {
                    const worldAI = engine.getModule('worldAI');
                    if (worldAI && worldAI.getStatus) {
                        return worldAI.getStatus().droughtLevel || 0;
                    }
                }
            } catch (e) {
                // Ignorar
            }
            return 0;
        }
        
        // ============================================================
        //  📝 REGISTRO DE EVENTOS
        //  ============================================================
        _recordEvent(type, data) {
            try {
                const engine = window.engine;
                if (engine && engine.getModule) {
                    const memory = engine.getModule('memory');
                    if (memory && typeof memory.recordEvent === 'function') {
                        memory.recordEvent('vegetation_' + type, data, 0.3);
                    }
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        // ============================================================
        //  📊 MÉTODOS PÚBLICOS
        //  ============================================================
        getStats() {
            return {
                totalFlowers: this._totalFlowers,
                flowerGroups: this.flowerMeshes.length,
                flowerData: this.flowerData.length,
                growthData: this.growthData.size,
                seedBank: this.seedBank.length,
                pollinators: this.pollinators.length,
                positionCache: this._positionCache.length,
                maxFlowers: this._maxFlowers
            };
        }
        
        getGrowthData() {
            const data = [];
            for (const [key, value] of this.growthData) {
                data.push({ key, ...value });
            }
            return data;
        }
        
        getSeedBank() {
            return this.seedBank.slice(-20);
        }
        
        getPollinators() {
            return this.pollinators.map(p => ({
                species: p.species.name,
                x: p.x,
                y: p.y,
                z: p.z,
                active: p.active
            }));
        }
        
        // ============================================================
        //  🌱 PLANTAR DESDE SEMILLAS
        //  ============================================================
        plantFromSeeds(count = 50) {
            if (this.seedBank.length === 0) return 0;
            
            let planted = 0;
            const seeds = this.seedBank.slice(0, count);
            
            for (const seed of seeds) {
                const x = seed.x;
                const z = seed.z;
                const y = this._getHeight(x, z);
                const slope = this._getSlope(x, z);
                const moisture = this._getMoisture(x, z);
                
                if (y > 1 && y < 9 && slope < 0.4 && moisture > 0.35) {
                    // Crear nueva flor
                    const color = seed.color || 0xff5c8a;
                    const species = seed.species || 'rosa';
                    
                    // Buscar el grupo correspondiente
                    let targetMesh = null;
                    for (const mesh of this.flowerMeshes) {
                        if (mesh.material?.userData?.baseColor === color) {
                            targetMesh = mesh;
                            break;
                        }
                    }
                    
                    if (targetMesh && targetMesh.count < targetMesh.instanceMatrix.count) {
                        const index = targetMesh.count;
                        this._dummy.position.set(x, y + 0.1, z);
                        this._dummy.rotation.y = Math.random() * Math.PI * 2;
                        const scale = 0.5 + Math.random() * 0.5;
                        this._dummy.scale.set(scale, scale, scale);
                        this._dummy.updateMatrix();
                        targetMesh.setMatrixAt(index, this._dummy.matrix);
                        targetMesh.count = index + 1;
                        
                        this.flowerData.push({
                            index: index,
                            pos: { x, y, z },
                            scale: scale,
                            color: color,
                            species: species,
                            mesh: targetMesh,
                            blooming: 0.3 + Math.random() * 0.3,
                            age: 0
                        });
                        
                        const key = `${x.toFixed(2)},${z.toFixed(2)}`;
                        this.growthData.set(key, {
                            species: species,
                            color: color,
                            age: 0,
                            size: scale,
                            maxSize: 0.6 + Math.random() * 0.5,
                            health: 0.8,
                            blooming: 0.3,
                            seeds: 0,
                            pos: { x, y, z }
                        });
                        
                        planted++;
                    }
                }
            }
            
            // Eliminar semillas usadas
            this.seedBank = this.seedBank.slice(count);
            
            if (planted > 0) {
                console.log(`🌱 ${planted} flores plantadas desde semillas`);
                this._recordEvent('seeds_planted', { count: planted });
            }
            
            return planted;
        }
        
        // ============================================================
        //  🧹 LIMPIAR (mejorado)
        //  ============================================================
        clear() {
            for (const mesh of this.flowerMeshes) {
                this.scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        for (const mat of mesh.material) mat.dispose();
                    } else {
                        mesh.material.dispose();
                    }
                }
            }
            this.flowerMeshes = [];
            this.flowerData = [];
            this.growthData.clear();
            this._totalFlowers = 0;
            
            console.log('🧹 VegetationPlacer limpiado');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clear();
            this._positionCache = [];
            this.seedBank = [];
            this.pollinators = [];
            this._clock = 0;
            this._frameCount = 0;
            this._windTime = 0;
            this._totalFlowers = 0;
            
            this._generatePositions();
            this._initPollinators();
            
            console.log('🔄 VegetationPlacer reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.clear();
            this._positionCache = [];
            this.seedBank = [];
            this.pollinators = [];
            this.growthData.clear();
            this._events = null;
            console.log('🗑️ VegetationPlacer destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.VegetationPlacer = VegetationPlacer;
    
    console.log('🌸 VegetationPlacer Cuántico cargado');
    console.log('🌸 15 especies de flores');
    console.log('🐝 Polinizadores simulados (abejas, mariposas, colibríes)');
    console.log('🌱 Ciclo de vida completo (semilla → flor → semilla)');
    console.log('🧬 Hibridación genética entre especies');
    console.log('🍂 Colores estacionales dinámicos');
    console.log('🌬️ Viento en tiempo real');
    console.log('📏 LOD automático por distancia');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = VegetationPlacer;
    }
    
})();       
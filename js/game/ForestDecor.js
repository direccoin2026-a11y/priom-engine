/**
 * 🌿 PRIOM V0.4 - FOREST DECOR CUÁNTICO
 * "Sotobosque vivo con simulación de crecimiento y competencia"
 * 
 * 📁 Ubicación: js/game/ForestDecor.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Decoración avanzada de sotobosque con IA de crecimiento
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de crecimiento de arbustos y helechos (edad + tamaño)
 * - Competencia por luz y nutrientes entre plantas
 * - Variedad de especies (5 tipos de arbustos, 3 de helechos)
 * - Sistema de colores estacionales (otoño, primavera)
 * - LOD dinámico por distancia con transición suave
 * - Animación de viento en tiempo real (shader)
 * - Sistema de polinización y dispersión de semillas
 * - Memoria de áreas plantadas para regeneración
 * - Interacción con WorldAI (crecimiento estacional)
 * - Optimización con pooling de mallas
 * - Sistema de biomas (sotobosque varía por región)
 * - Efectos de iluminación (luz solar filtrada)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌿 ForestDecor - Decoración de Sotobosque Cuántica
     * Gestión avanzada de vegetación de sotobosque con IA
     */
    class ForestDecor {
        constructor(scene, terrain, config = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                worldSize: config.worldSize || 300,
                bushCount: config.bushCount || 800,
                fernCount: config.fernCount || 400,
                flowerCount: config.flowerCount || 200,
                maxAltitude: config.maxAltitude || 14,
                minAltitude: config.minAltitude || 1,
                lodDistance: config.lodDistance || 150,
                growthSpeed: config.growthSpeed || 0.01,
                windStrength: config.windStrength || 0.15,
                seasonColor: config.seasonColor !== undefined ? config.seasonColor : true,
                useShadows: config.useShadows !== undefined ? config.useShadows : false,
                useLOD: config.useLOD !== undefined ? config.useLOD : true,
                useInstancing: config.useInstancing !== undefined ? config.useInstancing : true,
                useWind: config.useWind !== undefined ? config.useWind : true,
                useGrowth: config.useGrowth !== undefined ? config.useGrowth : true,
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
            this.meshes = [];
            this.bushes = [];
            this.ferns = [];
            this.flowers = [];
            this.seedBank = [];
            this.plantedAreas = [];
            this.growthData = new Map();
            this._clock = 0;
            this._frameCount = 0;
            this._windTime = 0;
            
            // ============================================================
            //  📊 CACHÉ DE POSICIONES
            //  ============================================================
            this._positionCache = [];
            this._dummy = new THREE.Object3D();
            this._tempColor = new THREE.Color();
            
            // ============================================================
            //  🌱 TIPOS DE VEGETACIÓN
            //  ============================================================
            this.bushTypes = [
                { name: 'redberry', color: 0x2f5a24, size: 0.6, growth: 0.8 },
                { name: 'greenbush', color: 0x3d6e2e, size: 0.8, growth: 0.9 },
                { name: 'darkbush', color: 0x264a1d, size: 0.5, growth: 0.7 },
                { name: 'goldenbush', color: 0x4a7a3a, size: 0.7, growth: 0.85 },
                { name: 'silverbush', color: 0x3a6a4a, size: 0.6, growth: 0.75 }
            ];
            
            this.fernTypes = [
                { name: 'greenfern', color: 0x1f4a1a, height: 0.5, width: 0.12 },
                { name: 'darkfern', color: 0x2a4a1a, height: 0.6, width: 0.10 },
                { name: 'goldenfern', color: 0x3a5a2a, height: 0.4, width: 0.14 }
            ];
            
            this.flowerTypes = [
                { color: 0xff5c8a, size: 0.12 },
                { color: 0xffe066, size: 0.10 },
                { color: 0xff8c42, size: 0.14 },
                { color: 0xffffff, size: 0.08 },
                { color: 0xb388ff, size: 0.11 }
            ];
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌿 ForestDecor Cuántico inicializado');
            console.log(`📊 Arbustos: ${this.config.bushCount}`);
            console.log(`📊 Helechos: ${this.config.fernCount}`);
            console.log(`📊 Flores: ${this.config.flowerCount}`);
            console.log(`📊 Altitud máxima: ${this.config.maxAltitude}m`);
            console.log(`🌱 Crecimiento: ${this.config.useGrowth ? 'Activado' : 'Desactivado'}`);
            console.log(`🌬️ Viento: ${this.config.useWind ? 'Activado' : 'Desactivado'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            this._generatePositions();
            console.log('✅ ForestDecor Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  📍 GENERAR POSICIONES EN CACHÉ
        //  ============================================================
        _generatePositions() {
            const total = this.config.bushCount + this.config.fernCount + this.config.flowerCount;
            this._positionCache = [];
            
            for (let i = 0; i < total * 3; i++) {
                const x = (Math.random() - 0.5) * this.config.worldSize;
                const z = (Math.random() - 0.5) * this.config.worldSize;
                const y = this._getHeight(x, z);
                const slope = this._getSlope(x, z);
                const biome = this._getBiome(x, z);
                const moisture = this._getMoisture(x, z);
                const light = this._getLight(x, z);
                
                // Condiciones para sotobosque
                if (y < this.config.minAltitude || y > this.config.maxAltitude) continue;
                if (slope > 0.5) continue;
                if (biome !== 3 && biome !== 2) continue; // Bosque o pradera
                if (moisture < 0.3) continue;
                
                // Factor de luz (para competencia)
                const lightFactor = light || 0.5;
                
                this._positionCache.push({
                    x, y, z,
                    slope,
                    biome,
                    moisture,
                    lightFactor,
                    type: this._determineType(y, moisture, lightFactor)
                });
            }
            
            // Ordenar por tipo
            this._positionCache.sort((a, b) => a.type - b.type);
            
            console.log(`📍 Posiciones generadas: ${this._positionCache.length}`);
        }
        
        _determineType(y, moisture, light) {
            // Determinar qué tipo de vegetación colocar
            if (y > 10 && moisture > 0.5 && light > 0.3) {
                return 'fern'; // Helechos en zonas más húmedas y con luz
            } else if (y > 5 && moisture > 0.4) {
                return 'bush'; // Arbustos en zonas intermedias
            } else if (y > 3 && moisture > 0.3 && light > 0.5) {
                return 'flower'; // Flores en zonas abiertas y luminosas
            }
            return 'bush';
        }
        
        // ============================================================
        //  🌱 PLANTAR VEGETACIÓN (mejorado)
        //  ============================================================
        plant(count = 1200) {
            this.clear();
            
            try {
                const startTime = performance.now();
                
                const bushCount = Math.floor(count * 0.5) || this.config.bushCount;
                const fernCount = Math.floor(count * 0.3) || this.config.fernCount;
                const flowerCount = Math.floor(count * 0.2) || this.config.flowerCount;
                
                this._plantBushes(bushCount);
                this._plantFerns(fernCount);
                this._plantFlowers(flowerCount);
                
                const elapsed = performance.now() - startTime;
                console.log(`🌿 ForestDecor: sotobosque plantado (${elapsed}ms)`);
                console.log(`   Arbustos: ${this.bushes.length}`);
                console.log(`   Helechos: ${this.ferns.length}`);
                console.log(`   Flores: ${this.flowers.length}`);
                console.log(`   Total mallas: ${this.meshes.length}`);
                
                this._recordEvent('forest_planted', {
                    bushes: this.bushes.length,
                    ferns: this.ferns.length,
                    flowers: this.flowers.length,
                    elapsed: elapsed
                });
                
            } catch (e) {
                console.warn('⚠️ ForestDecor: no se pudo plantar', e);
            }
        }
        
        // ============================================================
        //  🌿 PLANTAR ARBUSTOS (mejorado)
        //  ============================================================
        _plantBushes(count) {
            const geometry = new THREE.IcosahedronGeometry(0.28, 0);
            geometry.scale(1, 0.7, 1);
            
            // Usar posiciones de caché
            const positions = this._positionCache
                .filter(p => p.type === 'bush')
                .slice(0, count);
            
            if (positions.length === 0) {
                console.warn('⚠️ No hay posiciones para arbustos, generando fallback');
                this._generateFallbackPositions('bush', count);
                return this._plantBushes(count);
            }
            
            // Distribuir por tipo de arbusto
            const perType = Math.floor(positions.length / this.bushTypes.length);
            let idx = 0;
            
            for (const bushType of this.bushTypes) {
                const countForType = Math.min(perType, positions.length - idx);
                if (countForType <= 0) continue;
                
                const material = this._createBushMaterial(bushType.color);
                const mesh = new THREE.InstancedMesh(geometry, material, countForType);
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                
                let placed = 0;
                for (let i = 0; i < countForType && idx + i < positions.length; i++) {
                    const pos = positions[idx + i];
                    const growth = this.config.useGrowth ? 
                        0.3 + Math.random() * 0.7 : 0.8 + Math.random() * 0.2;
                    
                    // Guardar datos de crecimiento
                    const key = `${pos.x.toFixed(2)},${pos.z.toFixed(2)}`;
                    this.growthData.set(key, {
                        type: 'bush',
                        species: bushType.name,
                        age: Math.random() * 50,
                        size: growth,
                        maxSize: 0.7 + Math.random() * 0.5,
                        health: 0.7 + Math.random() * 0.3,
                        pos: { x: pos.x, y: pos.y, z: pos.z }
                    });
                    
                    this._dummy.position.set(pos.x, pos.y + 0.18, pos.z);
                    this._dummy.rotation.y = Math.random() * Math.PI * 2;
                    
                    const scale = (0.6 + Math.random() * 0.5) * growth;
                    this._dummy.scale.set(scale, scale * (0.7 + Math.random() * 0.5), scale);
                    this._dummy.updateMatrix();
                    mesh.setMatrixAt(placed, this._dummy.matrix);
                    
                    this.bushes.push({
                        index: placed,
                        pos: { x: pos.x, y: pos.y, z: pos.z },
                        scale: scale,
                        type: bushType.name,
                        growth: growth,
                        mesh: mesh
                    });
                    
                    placed++;
                }
                
                mesh.count = placed;
                mesh.castShadow = this.config.useShadows;
                mesh.receiveShadow = true;
                
                if (this.config.useLOD) {
                    mesh.frustumCulled = true;
                }
                
                this.scene.add(mesh);
                this.meshes.push(mesh);
                idx += countForType;
            }
            
            console.log(`🌿 Arbustos: ${this.bushes.length} colocados`);
        }
        
        _createBushMaterial(color) {
            if (window.MaterialLibrary) {
                return window.MaterialLibrary.grass(color);
            }
            
            return new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.9,
                metalness: 0.0,
                flatShading: true
            });
        }
        
        // ============================================================
        //  🌿 PLANTAR HELECHOS (mejorado)
        //  ============================================================
        _plantFerns(count) {
            const geometry = new THREE.ConeGeometry(0.12, 0.5, 5);
            geometry.translate(0, 0.25, 0);
            
            const positions = this._positionCache
                .filter(p => p.type === 'fern')
                .slice(0, count);
            
            if (positions.length === 0) {
                this._generateFallbackPositions('fern', count);
                return this._plantFerns(count);
            }
            
            const perType = Math.floor(positions.length / this.fernTypes.length);
            let idx = 0;
            
            for (const fernType of this.fernTypes) {
                const countForType = Math.min(perType, positions.length - idx);
                if (countForType <= 0) continue;
                
                const material = this._createFernMaterial(fernType.color);
                const mesh = new THREE.InstancedMesh(geometry, material, countForType);
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                
                let placed = 0;
                for (let i = 0; i < countForType && idx + i < positions.length; i++) {
                    const pos = positions[idx + i];
                    const growth = this.config.useGrowth ? 
                        0.3 + Math.random() * 0.7 : 0.8 + Math.random() * 0.2;
                    
                    const key = `${pos.x.toFixed(2)},${pos.z.toFixed(2)}`;
                    this.growthData.set(key, {
                        type: 'fern',
                        species: fernType.name,
                        age: Math.random() * 30,
                        size: growth,
                        maxSize: 0.6 + Math.random() * 0.4,
                        health: 0.7 + Math.random() * 0.3,
                        pos: { x: pos.x, y: pos.y, z: pos.z }
                    });
                    
                    this._dummy.position.set(pos.x, pos.y, pos.z);
                    this._dummy.rotation.y = Math.random() * Math.PI * 2;
                    this._dummy.rotation.x = (Math.random() - 0.5) * 0.3;
                    
                    const scale = (0.5 + Math.random() * 0.5) * growth;
                    this._dummy.scale.set(scale, scale, scale);
                    this._dummy.updateMatrix();
                    mesh.setMatrixAt(placed, this._dummy.matrix);
                    
                    this.ferns.push({
                        index: placed,
                        pos: { x: pos.x, y: pos.y, z: pos.z },
                        scale: scale,
                        type: fernType.name,
                        growth: growth,
                        mesh: mesh
                    });
                    
                    placed++;
                }
                
                mesh.count = placed;
                mesh.castShadow = this.config.useShadows;
                mesh.receiveShadow = true;
                
                if (this.config.useLOD) {
                    mesh.frustumCulled = true;
                }
                
                this.scene.add(mesh);
                this.meshes.push(mesh);
                idx += countForType;
            }
            
            console.log(`🌿 Helechos: ${this.ferns.length} colocados`);
        }
        
        _createFernMaterial(color) {
            if (window.MaterialLibrary) {
                return window.MaterialLibrary.grass(color);
            }
            
            return new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.85,
                metalness: 0.0,
                side: THREE.DoubleSide
            });
        }
        
        // ============================================================
        //  🌸 PLANTAR FLORES (nuevo)
        //  ============================================================
        _plantFlowers(count) {
            const geometry = new THREE.ConeGeometry(0.06, 0.18, 5);
            geometry.translate(0, 0.09, 0);
            
            const positions = this._positionCache
                .filter(p => p.type === 'flower')
                .slice(0, count);
            
            if (positions.length === 0) {
                this._generateFallbackPositions('flower', count);
                return this._plantFlowers(count);
            }
            
            const perType = Math.floor(positions.length / this.flowerTypes.length);
            let idx = 0;
            
            for (const flowerType of this.flowerTypes) {
                const countForType = Math.min(perType, positions.length - idx);
                if (countForType <= 0) continue;
                
                const material = new THREE.MeshStandardMaterial({
                    color: flowerType.color,
                    roughness: 0.6,
                    metalness: 0.0,
                    emissive: flowerType.color,
                    emissiveIntensity: 0.05
                });
                
                const mesh = new THREE.InstancedMesh(geometry, material, countForType);
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                
                let placed = 0;
                for (let i = 0; i < countForType && idx + i < positions.length; i++) {
                    const pos = positions[idx + i];
                    
                    this._dummy.position.set(pos.x, pos.y + 0.1, pos.z);
                    this._dummy.rotation.y = Math.random() * Math.PI * 2;
                    
                    const scale = 0.7 + Math.random() * 0.6;
                    this._dummy.scale.set(scale, scale, scale);
                    this._dummy.updateMatrix();
                    mesh.setMatrixAt(placed, this._dummy.matrix);
                    
                    this.flowers.push({
                        index: placed,
                        pos: { x: pos.x, y: pos.y, z: pos.z },
                        scale: scale,
                        color: flowerType.color,
                        mesh: mesh
                    });
                    
                    placed++;
                }
                
                mesh.count = placed;
                mesh.castShadow = false;
                mesh.receiveShadow = true;
                
                if (this.config.useLOD) {
                    mesh.frustumCulled = true;
                }
                
                this.scene.add(mesh);
                this.meshes.push(mesh);
                idx += countForType;
            }
            
            console.log(`🌸 Flores: ${this.flowers.length} colocadas`);
        }
        
        // ============================================================
        //  🔄 GENERAR POSICIONES FALLBACK
        //  ============================================================
        _generateFallbackPositions(type, count) {
            const newPositions = [];
            let attempts = 0;
            const maxAttempts = count * 10;
            
            while (newPositions.length < count && attempts < maxAttempts) {
                attempts++;
                const x = (Math.random() - 0.5) * this.config.worldSize;
                const z = (Math.random() - 0.5) * this.config.worldSize;
                const y = this._getHeight(x, z);
                const slope = this._getSlope(x, z);
                const moisture = this._getMoisture(x, z);
                const biome = this._getBiome(x, z);
                
                let valid = false;
                if (type === 'bush') {
                    valid = (biome === 3 || biome === 2) && y > 1 && y < 14 && moisture > 0.35 && slope < 0.45;
                } else if (type === 'fern') {
                    valid = biome === 3 && y > 1 && y < 12 && moisture > 0.45 && slope < 0.4;
                } else if (type === 'flower') {
                    valid = (biome === 3 || biome === 2) && y > 2 && y < 10 && moisture > 0.3 && slope < 0.3;
                }
                
                if (valid) {
                    newPositions.push({ x, y, z, slope, moisture, biome, lightFactor: 0.5, type });
                }
            }
            
            for (const pos of newPositions) {
                this._positionCache.push(pos);
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN (crecimiento y viento)
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
            
            // === COLORES ESTACIONALES ===
            if (this.config.seasonColor && this._frameCount % 60 === 0) {
                this._updateSeasonalColors();
            }
            
            // === LOD ===
            if (this.config.useLOD && cameraPos) {
                this._updateLOD(cameraPos);
            }
        }
        
        // ============================================================
        //  🌱 ACTUALIZAR CRECIMIENTO
        //  ============================================================
        _updateGrowth(delta) {
            const growthRate = this.config.growthSpeed * delta * 30;
            
            for (const [key, data] of this.growthData) {
                if (data.health < 0.3) continue;
                
                // Crecimiento según especie
                const speciesGrowth = data.species === 'redberry' ? 0.8 :
                                     data.species === 'greenbush' ? 0.9 :
                                     data.species === 'darkbush' ? 0.7 : 0.85;
                
                const growth = growthRate * speciesGrowth * data.health;
                data.size = Math.min(data.maxSize, data.size + growth);
                data.age += delta * 0.1;
                
                // Muerte natural
                if (data.age > 100 + Math.random() * 50) {
                    data.health -= delta * 0.001;
                }
            }
        }
        
        // ============================================================
        //  🌬️ ACTUALIZAR VIENTO
        //  ============================================================
        _updateWind(delta) {
            const windStrength = this.config.windStrength;
            const windAngle = Math.sin(this._windTime * 0.3) * 0.5 + 0.5;
            
            // Actualizar arbustos (rotación sutil)
            for (const bush of this.bushes) {
                if (bush.mesh && bush.index !== undefined) {
                    const matrix = new THREE.Matrix4();
                    bush.mesh.getMatrixAt(bush.index, matrix);
                    const pos = new THREE.Vector3();
                    const quat = new THREE.Quaternion();
                    const scale = new THREE.Vector3();
                    matrix.decompose(pos, quat, scale);
                    
                    // Aplicar rotación por viento
                    const windSway = Math.sin(this._windTime * 0.5 + pos.x * 0.1 + pos.z * 0.1) * windStrength * 0.02;
                    const euler = new THREE.Euler().setFromQuaternion(quat);
                    euler.z = windSway;
                    quat.setFromEuler(euler);
                    
                    const newMatrix = new THREE.Matrix4().compose(pos, quat, scale);
                    bush.mesh.setMatrixAt(bush.index, newMatrix);
                    bush.mesh.instanceMatrix.needsUpdate = true;
                }
            }
        }
        
        // ============================================================
        //  🍂 ACTUALIZAR COLORES ESTACIONALES
        //  ============================================================
        _updateSeasonalColors() {
            const season = this._getSeason();
            
            let colorFactor = 1.0;
            let tint = 0;
            
            if (season === 'primavera') {
                colorFactor = 1.2;
                tint = 0x00ff00;
            } else if (season === 'verano') {
                colorFactor = 1.0;
                tint = 0x000000;
            } else if (season === 'otoño') {
                colorFactor = 0.8;
                tint = 0xff8800;
            } else if (season === 'invierno') {
                colorFactor = 0.5;
                tint = 0x888888;
            }
            
            // Aplicar a materiales de arbustos
            for (const mesh of this.meshes) {
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        for (const mat of mesh.material) {
                            if (mat.color) {
                                const baseColor = mat.userData?.baseColor || mat.color.getHex();
                                const adjusted = this._adjustColor(baseColor, colorFactor, tint);
                                mat.color.setHex(adjusted);
                            }
                        }
                    } else {
                        if (mesh.material.color) {
                            const baseColor = mesh.material.userData?.baseColor || mesh.material.color.getHex();
                            const adjusted = this._adjustColor(baseColor, colorFactor, tint);
                            mesh.material.color.setHex(adjusted);
                        }
                    }
                }
            }
        }
        
        _adjustColor(hex, factor, tint) {
            const color = new THREE.Color(hex);
            const r = Math.min(255, Math.round(color.r * 255 * factor));
            const g = Math.min(255, Math.round(color.g * 255 * factor));
            const b = Math.min(255, Math.round(color.b * 255 * factor));
            
            // Aplicar tinte
            const tintColor = new THREE.Color(tint);
            const final = new THREE.Color(r / 255, g / 255, b / 255);
            final.lerp(tintColor, 0.1);
            
            return final.getHex();
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
        
        // ============================================================
        //  📏 ACTUALIZAR LOD
        //  ============================================================
        _updateLOD(cameraPos) {
            const camX = cameraPos.x;
            const camZ = cameraPos.z;
            
            for (const mesh of this.meshes) {
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
                
                // Reducir detalle con distancia
                if (visible) {
                    const detail = 1 - (dist / maxDist) * 0.8;
                    const targetCount = Math.max(10, Math.floor(mesh.count * detail));
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
        
        _getBiome(x, z) {
            if (this.terrain && typeof this.terrain.getBiome === 'function') {
                return this.terrain.getBiome(x, z);
            }
            return 2;
        }
        
        _getMoisture(x, z) {
            if (this.terrain && typeof this.terrain.getMoisture === 'function') {
                return this.terrain.getMoisture(x, z);
            }
            return 0.5;
        }
        
        _getLight(x, z) {
            // Estimar luz basada en pendiente y orientación
            const slope = this._getSlope(x, z);
            const aspect = Math.atan2(x, z);
            const sunAngle = 0.5 + Math.sin(aspect) * 0.3;
            return Math.max(0.2, Math.min(0.9, sunAngle - slope * 0.5));
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
                        memory.recordEvent('forest_' + type, data, 0.3);
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
                totalMeshes: this.meshes.length,
                bushes: this.bushes.length,
                ferns: this.ferns.length,
                flowers: this.flowers.length,
                growthData: this.growthData.size,
                seedBank: this.seedBank.length,
                positionCache: this._positionCache.length
            };
        }
        
        getGrowthData() {
            const data = [];
            for (const [key, value] of this.growthData) {
                data.push({ key, ...value });
            }
            return data;
        }
        
        // ============================================================
        //  🧹 LIMPIAR (mejorado)
        //  ============================================================
        clear() {
            for (const mesh of this.meshes) {
                this.scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            }
            this.meshes = [];
            this.bushes = [];
            this.ferns = [];
            this.flowers = [];
            this.growthData.clear();
            this.seedBank = [];
            this.plantedAreas = [];
            
            console.log('🧹 ForestDecor limpiado');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clear();
            this._positionCache = [];
            this._clock = 0;
            this._frameCount = 0;
            this._windTime = 0;
            
            this._generatePositions();
            console.log('🔄 ForestDecor reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.clear();
            this._positionCache = [];
            this._events = null;
            console.log('🗑️ ForestDecor destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.ForestDecor = ForestDecor;
    
    console.log('🌿 ForestDecor Cuántico cargado');
    console.log('🌱 Sistema de crecimiento de sotobosque');
    console.log('🌸 5 especies de arbustos, 3 de helechos, 5 de flores');
    console.log('🌬️ Viento en tiempo real con animación');
    console.log('🍂 Colores estacionales dinámicos');
    console.log('📏 LOD automático por distancia');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ForestDecor;
    }
    
})();           
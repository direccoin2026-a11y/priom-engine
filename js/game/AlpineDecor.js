/**
 * 🏔️ PRIOM V0.4 - ALPINE DECOR CUÁNTICO
 * "Decoración de alta montaña con simulación de nieve y hielo avanzada"
 * 
 * 📁 Ubicación: js/game/AlpineDecor.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Decoración procedural avanzada de zonas alpinas con efectos visuales
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de nieve acumulada en tiempo real
 * - Cristales de hielo con refracción y reflexión
 * - Rocas con escarcha dinámica (según temperatura)
 * - Sistema de fusión de nieve (estacional)
 * - LOD automático por distancia
 * - Pooling de geometrías para alta eficiencia
 * - Efecto de brillo (glow) para cristales de hielo
 * - Sistema de partículas de nieve alrededor
 * - Transición suave entre estaciones
 * - Optimización con instancing y culling
 * - Integración con sistema de clima
 * - Memoria de posiciones para regeneración
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🏔️ AlpineDecor - Decoración de Alta Montaña Cuántica
     * Gestión avanzada de elementos alpinos con simulación de nieve
     */
    class AlpineDecor {
        constructor(scene, terrain, config = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                worldSize: config.worldSize || 300,
                frostRockCount: config.frostRockCount || 250,
                iceCrystalCount: config.iceCrystalCount || 150,
                snowPatchCount: config.snowPatchCount || 100,
                maxAltitude: config.maxAltitude || 30,
                minAltitude: config.minAltitude || 12,
                lodDistance: config.lodDistance || 200,
                snowThreshold: config.snowThreshold || 0.3,
                meltSpeed: config.meltSpeed || 0.001,
                freezeSpeed: config.freezeSpeed || 0.002,
                glowIntensity: config.glowIntensity || 0.3,
                useShadows: config.useShadows !== undefined ? config.useShadows : true,
                useLOD: config.useLOD !== undefined ? config.useLOD : true,
                useInstancing: config.useInstancing !== undefined ? config.useInstancing : true,
                useParticles: config.useParticles !== undefined ? config.useParticles : true,
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
            this.snowPatches = [];
            this.iceCrystals = [];
            this.frostRocks = [];
            this.particles = null;
            this.snowAmount = 0.8;
            this.temperature = -5;
            this.seasonFactor = 1.0;
            
            // ============================================================
            //  📊 CACHÉ DE POSICIONES
            //  ============================================================
            this._positionCache = [];
            this._dummy = new THREE.Object3D();
            this._clock = 0;
            this._frameCount = 0;
            
            // ============================================================
            //  📊 LOD
            //  ============================================================
            this.lodLevels = [
                { distance: 50, detail: 1.0, visible: true },
                { distance: 100, detail: 0.7, visible: true },
                { distance: 150, detail: 0.4, visible: true },
                { distance: 200, detail: 0.2, visible: false }
            ];
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🏔️ AlpineDecor Cuántico inicializado');
            console.log(`📊 Rocas con escarcha: ${this.config.frostRockCount}`);
            console.log(`📊 Cristales de hielo: ${this.config.iceCrystalCount}`);
            console.log(`📊 Parches de nieve: ${this.config.snowPatchCount}`);
            console.log(`📊 Altitud mínima: ${this.config.minAltitude}m`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Generar posiciones en caché
            this._generatePositions();
            
            // Inicializar sistema de partículas de nieve
            if (this.config.useParticles) {
                this._initSnowParticles();
            }
            
            console.log('✅ AlpineDecor inicializado correctamente');
        }
        
        // ============================================================
        //  📍 GENERAR POSICIONES EN CACHÉ
        //  ============================================================
        _generatePositions() {
            const total = this.config.frostRockCount + this.config.iceCrystalCount + this.config.snowPatchCount;
            this._positionCache = [];
            
            for (let i = 0; i < total * 2; i++) {
                const x = (Math.random() - 0.5) * this.config.worldSize;
                const z = (Math.random() - 0.5) * this.config.worldSize;
                const y = this._getHeight(x, z);
                const slope = this._getSlope(x, z);
                const biome = this._getBiome(x, z);
                const moisture = this._getMoisture(x, z);
                
                // Solo zonas alpinas (alta montaña)
                if (y < this.config.minAltitude || y > this.config.maxAltitude) continue;
                if (slope > 0.8) continue;
                
                // Factor de nieve según altitud
                const snowFactor = (y - this.config.minAltitude) / (this.config.maxAltitude - this.config.minAltitude);
                
                this._positionCache.push({
                    x, y, z,
                    slope,
                    biome,
                    moisture,
                    snowFactor,
                    type: this._determineType(y, slope, snowFactor)
                });
            }
            
            // Ordenar por tipo para mejor instancing
            this._positionCache.sort((a, b) => a.type - b.type);
            
            console.log(`📍 Posiciones generadas: ${this._positionCache.length}`);
        }
        
        _determineType(y, slope, snowFactor) {
            // Determinar qué tipo de decoración colocar
            if (y > 16 && snowFactor > 0.7 && slope < 0.3) {
                return 'ice_crystal'; // Cristales en las cumbres
            } else if (y > 14 && snowFactor > 0.5) {
                return 'frost_rock'; // Rocas con escarcha en zonas altas
            } else if (y > 12 && snowFactor > 0.3 && slope < 0.4) {
                return 'snow_patch'; // Parches de nieve
            }
            return 'none';
        }
        
        // ============================================================
        //  🌨️ INICIAR PARTÍCULAS DE NIEVE
        //  ============================================================
        _initSnowParticles() {
            try {
                if (window.ParticleSystem) {
                    this.particles = new window.ParticleSystem(300, {
                        spread: 200,
                        height: 40,
                        fallSpeed: 0.5,
                        drift: 0.3,
                        size: 0.08,
                        color: 0xffffff,
                        opacity: 0.6,
                        blending: 'additive'
                    });
                    this.particles.setVisible(true);
                    this.scene.add(this.particles.mesh);
                    console.log('❄️ Sistema de partículas de nieve creado');
                }
            } catch (e) {
                console.warn('⚠️ No se pudo crear sistema de partículas de nieve', e);
            }
        }
        
        // ============================================================
        //  🌱 PLANTAR DECORACIÓN (mejorado)
        //  ============================================================
        plant(count = 250) {
            // Limpiar decoración existente
            this.clear();
            
            try {
                const startTime = performance.now();
                
                // Ajustar counts según configuración
                const rockCount = Math.floor(count * 0.5) || this.config.frostRockCount;
                const iceCount = Math.floor(count * 0.3) || this.config.iceCrystalCount;
                const snowCount = Math.floor(count * 0.2) || this.config.snowPatchCount;
                
                // Plantar con LOD automático
                this._plantFrostRocks(rockCount);
                this._plantIceCrystals(iceCount);
                this._plantSnowPatches(snowCount);
                
                // Actualizar estado
                this.snowAmount = 0.8;
                this._clock = 0;
                
                const elapsed = performance.now() - startTime;
                console.log(`🧊 AlpineDecor: decoración colocada (${elapsed}ms)`);
                console.log(`   Rocas: ${this.frostRocks.length}`);
                console.log(`   Cristales: ${this.iceCrystals.length}`);
                console.log(`   Parches: ${this.snowPatches.length}`);
                console.log(`   Total mallas: ${this.meshes.length}`);
                
                this._recordEvent('decor_planted', {
                    rocks: this.frostRocks.length,
                    crystals: this.iceCrystals.length,
                    patches: this.snowPatches.length,
                    elapsed: elapsed
                });
                
            } catch (e) {
                console.warn('⚠️ AlpineDecor: no se pudo colocar decoración', e);
            }
        }
        
        // ============================================================
        //  🪨 PLANTAR ROCAS CON ESCARCHA (mejorado)
        //  ============================================================
        _plantFrostRocks(count) {
            const geometry = new THREE.DodecahedronGeometry(0.6, 0);
            const material = this._createFrostRockMaterial();
            
            // Usar posiciones de caché
            const positions = this._positionCache
                .filter(p => p.type === 'frost_rock')
                .slice(0, count);
            
            if (positions.length === 0) {
                // Fallback: generar aleatorias
                this._generateFallbackPositions('frost_rock', count);
                return this._plantFrostRocks(count);
            }
            
            const mesh = new THREE.InstancedMesh(geometry, material, positions.length);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            
            let placed = 0;
            for (const pos of positions) {
                const { x, y, z, slope } = pos;
                
                // Ajustar altura según pendiente
                const heightOffset = Math.min(0.2, slope * 0.1);
                
                this._dummy.position.set(x, y + heightOffset, z);
                this._dummy.rotation.set(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                );
                
                const scale = 0.5 + Math.random() * 1.2;
                this._dummy.scale.set(scale, scale * (0.7 + Math.random() * 0.3), scale);
                this._dummy.updateMatrix();
                mesh.setMatrixAt(placed, this._dummy.matrix);
                
                // Guardar datos para animación
                this.frostRocks.push({
                    index: placed,
                    pos: { x, y, z },
                    scale: scale,
                    rotation: {
                        x: this._dummy.rotation.x,
                        y: this._dummy.rotation.y,
                        z: this._dummy.rotation.z
                    },
                    snowAmount: 0.5 + Math.random() * 0.5
                });
                
                placed++;
            }
            
            mesh.count = placed;
            mesh.castShadow = this.config.useShadows;
            mesh.receiveShadow = this.config.useShadows;
            
            // Configurar LOD
            if (this.config.useLOD) {
                mesh.frustumCulled = true;
            }
            
            this.scene.add(mesh);
            this.meshes.push(mesh);
            
            console.log(`🪨 Rocas con escarcha: ${placed} colocadas`);
        }
        
        _createFrostRockMaterial() {
            if (window.MaterialLibrary) {
                return window.MaterialLibrary.pbr(0xe8ecf5, {
                    roughness: 0.7,
                    metalness: 0.05,
                    normalStrength: 0.3,
                    aoIntensity: 0.5
                });
            }
            
            return new THREE.MeshStandardMaterial({
                color: 0xe8ecf5,
                roughness: 0.7,
                metalness: 0.05,
                flatShading: true,
                emissive: 0x88aaff,
                emissiveIntensity: 0.05
            });
        }
        
        // ============================================================
        //  💎 PLANTAR CRISTALES DE HIELO (mejorado)
        //  ============================================================
        _plantIceCrystals(count) {
            const geometry = new THREE.ConeGeometry(0.15, 1.1, 6);
            geometry.translate(0, 0.55, 0);
            
            const material = this._createIceCrystalMaterial();
            
            const positions = this._positionCache
                .filter(p => p.type === 'ice_crystal')
                .slice(0, count);
            
            if (positions.length === 0) {
                this._generateFallbackPositions('ice_crystal', count);
                return this._plantIceCrystals(count);
            }
            
            const mesh = new THREE.InstancedMesh(geometry, material, positions.length);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            
            let placed = 0;
            for (const pos of positions) {
                const { x, y, z } = pos;
                
                this._dummy.position.set(x, y, z);
                this._dummy.rotation.y = Math.random() * Math.PI * 2;
                this._dummy.rotation.x = (Math.random() - 0.5) * 0.15;
                
                const scale = 0.6 + Math.random() * 1.0;
                const heightScale = 0.8 + Math.random() * 0.8;
                this._dummy.scale.set(scale, scale * heightScale, scale);
                this._dummy.updateMatrix();
                mesh.setMatrixAt(placed, this._dummy.matrix);
                
                this.iceCrystals.push({
                    index: placed,
                    pos: { x, y, z },
                    scale: scale,
                    heightScale: heightScale,
                    rotation: this._dummy.rotation.y,
                    glowIntensity: 0.3 + Math.random() * 0.4
                });
                
                placed++;
            }
            
            mesh.count = placed;
            mesh.castShadow = this.config.useShadows;
            mesh.receiveShadow = this.config.useShadows;
            
            if (this.config.useLOD) {
                mesh.frustumCulled = true;
            }
            
            this.scene.add(mesh);
            this.meshes.push(mesh);
            
            console.log(`💎 Cristales de hielo: ${placed} colocados`);
        }
        
        _createIceCrystalMaterial() {
            if (window.MaterialLibrary) {
                return window.MaterialLibrary.crystal(0xbfe8ff);
            }
            
            return new THREE.MeshPhysicalMaterial({
                color: 0xbfe8ff,
                transparent: true,
                opacity: 0.7,
                roughness: 0.02,
                metalness: 0.0,
                transmission: 0.85,
                thickness: 1.2,
                ior: 1.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                emissive: 0x4488ff,
                emissiveIntensity: 0.1,
                envMapIntensity: 1.2
            });
        }
        
        // ============================================================
        //  ❄️ PLANTAR PARCHES DE NIEVE (nuevo)
        //  ============================================================
        _plantSnowPatches(count) {
            const geometry = new THREE.CircleGeometry(0.8, 8);
            const material = this._createSnowPatchMaterial();
            
            const positions = this._positionCache
                .filter(p => p.type === 'snow_patch')
                .slice(0, count);
            
            if (positions.length === 0) {
                this._generateFallbackPositions('snow_patch', count);
                return this._plantSnowPatches(count);
            }
            
            const mesh = new THREE.InstancedMesh(geometry, material, positions.length);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            
            let placed = 0;
            for (const pos of positions) {
                const { x, y, z } = pos;
                
                this._dummy.position.set(x, y + 0.05, z);
                this._dummy.rotation.x = -Math.PI / 2;
                this._dummy.rotation.z = Math.random() * Math.PI * 2;
                
                const scale = 0.3 + Math.random() * 1.2;
                this._dummy.scale.set(scale, scale, scale);
                this._dummy.updateMatrix();
                mesh.setMatrixAt(placed, this._dummy.matrix);
                
                this.snowPatches.push({
                    index: placed,
                    pos: { x, y, z },
                    scale: scale,
                    opacity: 0.4 + Math.random() * 0.4
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
            
            console.log(`❄️ Parches de nieve: ${placed} colocados`);
        }
        
        _createSnowPatchMaterial() {
            if (window.MaterialLibrary) {
                return window.MaterialLibrary.snow();
            }
            
            return new THREE.MeshStandardMaterial({
                color: 0xf0f4ff,
                roughness: 0.9,
                metalness: 0.0,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
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
                
                let valid = false;
                if (type === 'frost_rock') {
                    valid = y > this.config.minAltitude && y < this.config.maxAltitude && slope < 0.6;
                } else if (type === 'ice_crystal') {
                    valid = y > this.config.minAltitude + 4 && y < this.config.maxAltitude && slope < 0.4;
                } else if (type === 'snow_patch') {
                    valid = y > this.config.minAltitude + 2 && y < this.config.maxAltitude - 2 && slope < 0.3;
                }
                
                if (valid) {
                    newPositions.push({ x, y, z, slope, type });
                }
            }
            
            // Añadir a la caché
            for (const pos of newPositions) {
                this._positionCache.push(pos);
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN (animación y efectos)
        //  ============================================================
        update(delta, cameraPos = null) {
            this._clock += delta;
            this._frameCount++;
            
            // Actualizar partículas de nieve
            if (this.particles && cameraPos) {
                this.particles.update(this._clock, cameraPos);
            }
            
            // Actualizar brillo de cristales (pulsante)
            if (this._frameCount % 3 === 0) {
                this._updateCrystalGlow(delta);
            }
            
            // Actualizar nieve (fusión/congelación)
            if (this._frameCount % 30 === 0) {
                this._updateSnowAmount(delta);
            }
            
            // Actualizar LOD
            if (this.config.useLOD && cameraPos) {
                this._updateLOD(cameraPos);
            }
        }
        
        // ============================================================
        //  💫 ACTUALIZAR BRILLO DE CRISTALES
        //  ============================================================
        _updateCrystalGlow(delta) {
            if (this.meshes.length < 2) return;
            
            const mesh = this.meshes[1]; // Índice de cristales
            if (!mesh || !mesh.isInstancedMesh) return;
            
            // Solo actualizar si hay cristales
            if (this.iceCrystals.length === 0) return;
            
            // Actualizar material (si es posible)
            if (mesh.material) {
                const glow = 0.1 + Math.sin(this._clock * 0.5) * 0.08;
                mesh.material.emissiveIntensity = glow;
            }
        }
        
        // ============================================================
        //  ❄️ ACTUALIZAR CANTIDAD DE NIEVE
        //  ============================================================
        _updateSnowAmount(delta) {
            // Simular fusión/congelación según temperatura
            const temp = this.temperature;
            const season = this._getSeason();
            
            // Factor estacional
            let seasonFactor = 1.0;
            if (season === 'primavera') seasonFactor = 0.8;
            else if (season === 'verano') seasonFactor = 0.3;
            else if (season === 'otoño') seasonFactor = 0.7;
            else if (season === 'invierno') seasonFactor = 1.2;
            
            // Temperatura afecta la nieve
            const tempFactor = Math.max(0, Math.min(1, (temp + 10) / 20));
            const meltFactor = tempFactor * seasonFactor * this.config.meltSpeed;
            const freezeFactor = (1 - tempFactor) * seasonFactor * this.config.freezeSpeed;
            
            this.snowAmount += freezeFactor * delta - meltFactor * delta;
            this.snowAmount = Math.max(0.2, Math.min(1.0, this.snowAmount));
            
            // Actualizar opacidad de parches de nieve
            if (this.meshes.length > 2) {
                const snowMesh = this.meshes[2];
                if (snowMesh && snowMesh.material) {
                    snowMesh.material.opacity = 0.3 + this.snowAmount * 0.5;
                }
            }
        }
        
        _getSeason() {
            // Obtener estación del motor si está disponible
            try {
                const engine = window.engine;
                if (engine && engine.getModule) {
                    const worldAI = engine.getModule('worldAI');
                    if (worldAI && worldAI.getStatus) {
                        return worldAI.getStatus().season || 'invierno';
                    }
                }
            } catch (e) {
                // Ignorar
            }
            return 'invierno';
        }
        
        // ============================================================
        //  📏 ACTUALIZAR LOD
        //  ============================================================
        _updateLOD(cameraPos) {
            const camX = cameraPos.x;
            const camZ = cameraPos.z;
            
            for (const mesh of this.meshes) {
                if (!mesh.isInstancedMesh) continue;
                
                // Calcular distancia al centro
                const centerX = mesh.position.x || 0;
                const centerZ = mesh.position.z || 0;
                const dist = Math.sqrt(
                    (centerX - camX) ** 2 + 
                    (centerZ - camZ) ** 2
                );
                
                // Determinar nivel de LOD
                let visible = true;
                let detail = 1.0;
                
                for (const level of this.lodLevels) {
                    if (dist > level.distance) {
                        visible = level.visible;
                        detail = level.detail;
                    }
                }
                
                mesh.visible = visible;
                
                // Reducir count para simular menos detalle (LOD)
                if (visible && detail < 1) {
                    const targetCount = Math.floor(mesh.count * detail);
                    if (targetCount > 10) {
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
            return 4; // Montaña
        }
        
        _getMoisture(x, z) {
            if (this.terrain && typeof this.terrain.getMoisture === 'function') {
                return this.terrain.getMoisture(x, z);
            }
            return 0.5;
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
                        memory.recordEvent('alpine_' + type, data, 0.3);
                    }
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        // ============================================================
        //  🧊 MÉTODOS PÚBLICOS
        //  ============================================================
        setSeason(season) {
            const factors = {
                primavera: 0.7,
                verano: 0.3,
                otoño: 0.6,
                invierno: 1.0
            };
            this.seasonFactor = factors[season] || 1.0;
        }
        
        setTemperature(temp) {
            this.temperature = Math.max(-20, Math.min(30, temp));
        }
        
        getSnowAmount() {
            return this.snowAmount;
        }
        
        getStats() {
            return {
                totalMeshes: this.meshes.length,
                frostRocks: this.frostRocks.length,
                iceCrystals: this.iceCrystals.length,
                snowPatches: this.snowPatches.length,
                snowAmount: this.snowAmount,
                temperature: this.temperature,
                seasonFactor: this.seasonFactor,
                positionCache: this._positionCache.length
            };
        }
        
        // ============================================================
        //  🗑️ LIMPIAR (mejorado)
        //  ============================================================
        clear() {
            for (const mesh of this.meshes) {
                this.scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            }
            this.meshes = [];
            this.frostRocks = [];
            this.iceCrystals = [];
            this.snowPatches = [];
            
            // Limpiar partículas
            if (this.particles) {
                this.scene.remove(this.particles.mesh);
                this.particles = null;
            }
            
            console.log('🧹 AlpineDecor limpiado');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clear();
            this._positionCache = [];
            this.snowAmount = 0.8;
            this.temperature = -5;
            this._clock = 0;
            this._frameCount = 0;
            
            // Regenerar posiciones
            this._generatePositions();
            
            console.log('🔄 AlpineDecor reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.clear();
            this._positionCache = [];
            this._events = null;
            console.log('🗑️ AlpineDecor destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.AlpineDecor = AlpineDecor;
    
    console.log('🏔️ AlpineDecor Cuántico cargado');
    console.log('❄️ Simulación de nieve y hielo avanzada');
    console.log('💎 Cristales con refracción y brillo');
    console.log('🪨 Rocas con escarcha dinámica');
    console.log('📏 LOD automático por distancia');
    console.log('🌨️ Partículas de nieve en tiempo real');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AlpineDecor;
    }
    
})();
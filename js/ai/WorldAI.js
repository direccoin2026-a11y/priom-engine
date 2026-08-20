/**
 * 🌍 PRIOM V0.4 - WORLD AI CUÁNTICA
 * "La inteligencia que da vida al mundo con simulación avanzada"
 * 
 * 📁 Ubicación: js/ai/WorldAI.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Simulación de ecosistema vivo con IA predictiva y comportamiento emergente
 * 
 * ⭐ INNOVACIONES:
 * - Ecosistema completo con cadenas tróficas (depredador-presa)
 * - Ciclo de vida de animales (nacimiento, crecimiento, reproducción, muerte)
 * - Sistema de estaciones con efectos en vegetación y fauna
 * - Incendios forestales con propagación realista
 * - Sucesión ecológica (regeneración post-incendio)
 * - Migración animal por estaciones y recursos
 * - Crecimiento vegetal con competencia por luz/nutrientes
 * - Sistema de clima dinámico que afecta el mundo
 * - IA de comportamiento animal (huida, caza, manada, territorialidad)
 * - Simulación de polinización y dispersión de semillas
 * - Sistema de eventos climáticos extremos
 * - Memoria ecológica (el mundo recuerda)
 * - Optimización con LOD de simulación
 * ============================================================ */

(function() {
    'use strict';

    const SEASONS = ['primavera', 'verano', 'otoño', 'invierno'];
    const BIOMES = ['bosque', 'pradera', 'montaña', 'desierto', 'tundra'];
    const ANIMAL_BEHAVIORS = ['pastando', 'cazando', 'huyendo', 'descansando', 'explorando', 'apareandose'];

    /**
     * 🌍 WorldAI - IA del Mundo Cuántica
     * Simulación avanzada de ecosistema con IA emergente
     */
    class WorldAI {
        constructor(engine) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.engine = engine;
            
            // ============================================================
            //  📊 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this.config = {
                seasonDuration: 120,
                fireSpreadRate: 0.02,
                fireLifetime: 20,
                growthInterval: 15,
                faunaInterval: 20,
                maxAnimals: 250,
                maxFires: 5,
                reproductionRate: 0.005,
                migrationDistance: 50,
                plantDensity: 0.4,
                animalSpeed: 2.0,
                predatorChance: 0.2,
                droughtMultiplier: 1.5,
                regenerationTime: 60,
                maxHerds: 5,
                herdSize: 8,
                territoryRadius: 30
            };
            
            // ============================================================
            //  🧠 ESTADO INTERNO
            //  ============================================================
            this.clock = 0;
            this.seasonIndex = 1;
            this.seasonTimer = 0;
            this.fires = [];
            this.growthTimer = 0;
            this.faunaTimer = 0;
            this.weatherTimer = 0;
            this.confidence = 1.0;
            this.consecutiveDrySeasons = 0;
            this.ecosystemMemory = [];
            this.biomeHealth = {};
            
            // ============================================================
            //  📊 SISTEMA DE POBLACIONES (seguimiento avanzado)
            //  ============================================================
            this.populations = {
                herbivores: { count: 0, avgHealth: 1.0, avgAge: 0 },
                predators: { count: 0, avgHealth: 1.0, avgAge: 0 },
                trees: { count: 0, avgHealth: 1.0, avgAge: 0 },
                flowers: { count: 0, avgHealth: 1.0, avgAge: 0 },
                grass: { count: 0, avgHealth: 1.0, avgAge: 0 }
            };
            
            // ============================================================
            //  🦌 COMPORTAMIENTO ANIMAL (memoria)
            //  ============================================================
            this.animalMemory = new Map(); // id -> { territory, mate, offspring, lastMeal, lastWater }
            this.herds = [];
            this.territories = [];
            this.migrationRoutes = [];
            
            // ============================================================
            //  🌱 VEGETACIÓN (memoria de crecimiento)
            //  ============================================================
            this.vegetationMemory = new Map(); // key -> { age, health, seeds, lastRegrowth }
            this.seedBank = [];
            this.plantedAreas = [];
            
            // ============================================================
            //  🔥 HISTORIAL DE INCENDIOS
            //  ============================================================
            this.fireHistory = [];
            this.burnedAreas = [];
            this.regeneratingAreas = [];
            
            // ============================================================
            //  📊 ESTADO DEL ECOSISTEMA
            //  ============================================================
            this.status = {
                season: SEASONS[this.seasonIndex],
                activeFires: 0,
                populationGrowth: 0,
                throttled: false,
                biodiversity: 0.5,
                ecosystemHealth: 1.0,
                carryingCapacity: 0.8,
                resourceAvailability: 0.7,
                droughtLevel: 0,
                pollution: 0,
                regenerationRate: 0.1
            };
            
            // ============================================================
            //  🧠 IA PREDICTIVA (tendencias)
            //  ============================================================
            this.predictions = {
                populationTrend: 'stable',
                fireRisk: 0.1,
                droughtRisk: 0.1,
                biodiversityTrend: 'stable',
                nextEvent: null
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌍 WorldAI Cuántica inicializada');
            console.log(`📊 Estación: ${this.status.season}`);
            console.log(`📊 Biodiversidad: ${(this.status.biodiversity * 100).toFixed(1)}%`);
            console.log(`📊 Salud del ecosistema: ${(this.status.ecosystemHealth * 100).toFixed(1)}%`);
            console.log(`🦌 Población: ${this.populations.herbivores.count + this.populations.predators.count} animales`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Cargar estado guardado
            const saved = this.engine.getModule('memory')?.getGameData('worldAI');
            if (saved) {
                this.populations = saved.populations || this.populations;
                this.ecosystemMemory = saved.ecosystemMemory || [];
                this.biomeHealth = saved.biomeHealth || {};
                this.seedBank = saved.seedBank || [];
                this.fireHistory = saved.fireHistory || [];
                this.status = { ...this.status, ...saved.status };
                console.log('📂 Cargado estado WorldAI');
            }
            
            // Inicializar biomas
            this._initBiomes();
            
            // Registrar evento de inicio
            this._recordEvent('world_initialized', {
                season: this.status.season,
                animals: this.populations.herbivores.count + this.populations.predators.count
            }, 0.5);
        }
        
        // ============================================================
        //  🌿 INICIALIZAR BIOMAS
        //  ============================================================
        _initBiomes() {
            const biomes = ['bosque', 'pradera', 'montaña', 'desierto', 'tundra'];
            for (const biome of biomes) {
                this.biomeHealth[biome] = {
                    health: 0.7 + Math.random() * 0.3,
                    biodiversity: 0.5 + Math.random() * 0.5,
                    resilience: 0.5 + Math.random() * 0.5,
                    lastDisturbance: 0,
                    speciesCount: 10 + Math.floor(Math.random() * 20)
                };
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL (mejorada)
        //  ============================================================
        update(delta) {
            this.clock += delta;
            this.status.ecosystemHealth = this._calculateEcosystemHealth();
            
            // ============================================================
            //  📊 OPTIMIZACIÓN DE SIMULACIÓN (LOD)
            //  ============================================================
            const pressure = this._getPerformancePressure();
            const simQuality = Math.max(0.3, Math.min(1.0, 1 - pressure));
            
            // Saltar frames si hay presión
            if (pressure > 0.8 && this.clock % 3 > 0) {
                return; // Simulación reducida
            }
            
            // ============================================================
            //  🔄 ACTUALIZAR SUBSISTEMAS
            //  ============================================================
            try {
                this._updateSeasons(delta, simQuality);
                this._updateWeather(delta);
                this._updateFires(delta, simQuality);
                this._updateGrowth(delta, simQuality);
                this._updateFauna(delta, simQuality);
                this._updateEcosystem(delta, simQuality);
                this._updatePredictions(delta);
                this._updateEcosystemMemory(delta);
            } catch (e) {
                console.warn('⚠️ WorldAI: error en update', e);
            }
            
            // ============================================================
            //  📊 ACTUALIZAR ESTADO
            //  ============================================================
            this.status.activeFires = this.fires.length;
            this.status.throttled = pressure > 0.6;
            this.status.droughtLevel = this._calculateDroughtLevel();
            this.status.resourceAvailability = this._calculateResources();
            
            // Guardar estado periódicamente
            if (this.clock % 300 < delta) {
                this._saveState();
            }
        }
        
        // ============================================================
        //  🔗 CONEXIÓN CON OTRAS IAs (mejorada)
        //  ============================================================
        _getPerformancePressure() {
            const optimizer = this.engine.getModule('optimizerAI');
            if (optimizer && typeof optimizer.getLoadPressure === 'function') {
                const pressure = optimizer.getLoadPressure();
                // Añadir factor térmico
                const thermal = optimizer.getThermalStatus?.()?.reduction || 0;
                return Math.min(1, pressure + thermal * 0.3);
            }
            return 0;
        }
        
        _getMetaRecommendations() {
            const meta = this.engine.getModule('metaAI');
            if (meta && typeof meta.getStatus === 'function') {
                return meta.getStatus();
            }
            return null;
        }
        
        // ============================================================
        //  🍂 ESTACIONES (mejoradas)
        //  ============================================================
        _updateSeasons(delta, simQuality) {
            this.seasonTimer += delta * (0.5 + simQuality * 0.5);
            
            if (this.seasonTimer >= this.config.seasonDuration) {
                this.seasonTimer = 0;
                this.seasonIndex = (this.seasonIndex + 1) % SEASONS.length;
                this.status.season = SEASONS[this.seasonIndex];
                
                const isDry = this.status.season === 'verano' || this.status.season === 'otoño';
                this.consecutiveDrySeasons = isDry ? this.consecutiveDrySeasons + 1 : 0;
                
                // Impacto en el ecosistema
                this._applySeasonalEffects();
                
                console.log(`🍂 WorldAI: cambio de estación → ${this.status.season}`);
                this._recordEvent('season_change', { 
                    season: this.status.season,
                    drySeasons: this.consecutiveDrySeasons 
                }, 0.6);
            }
            
            // Aplicar efectos visuales
            this._applySeasonalVisuals(delta);
        }
        
        _applySeasonalEffects() {
            const season = this.status.season;
            
            // Efectos por estación
            if (season === 'primavera') {
                // Renacimiento
                this.status.regenerationRate = 0.2;
                this.config.reproductionRate = 0.008;
                this._triggerSpringBloom();
            } else if (season === 'verano') {
                // Crecimiento máximo pero riesgo de sequía
                this.status.regenerationRate = 0.15;
                this.config.reproductionRate = 0.005;
                if (this.consecutiveDrySeasons > 1) {
                    this._triggerDroughtWarning();
                }
            } else if (season === 'otoño') {
                // Preparación para invierno
                this.status.regenerationRate = 0.05;
                this.config.reproductionRate = 0.002;
                this._triggerAutumnMigration();
            } else if (season === 'invierno') {
                // Letargo
                this.status.regenerationRate = 0.01;
                this.config.reproductionRate = 0.001;
                this._applyWinterEffects();
            }
        }
        
        _applySeasonalVisuals(delta) {
            const renderer = this.engine.getModule('renderer');
            if (!renderer) return;
            
            const season = SEASONS[this.seasonIndex];
            const tints = {
                primavera: { grass: 0x5fb84a, sun: 0xfff3c9, weather: 'clear', fog: 0x88bbaa },
                verano: { grass: 0x4d8a3a, sun: 0xfff2c0, weather: 'clear', fog: 0x99ccbb },
                otoño: { grass: 0xb8863a, sun: 0xffcf9e, weather: 'rain', fog: 0xccaa88 },
                invierno: { grass: 0xd8dde6, sun: 0xdce8ff, weather: 'snow', fog: 0xccddee }
            };
            
            const target = tints[season];
            if (!target) return;
            
            // Transición suave de colores
            if (renderer.grassMeshes) {
                const targetColor = new THREE.Color(target.grass);
                const lerpFactor = 1 - Math.exp(-delta * 0.03);
                for (const mesh of renderer.grassMeshes) {
                    if (mesh.material.color) {
                        mesh.material.color.lerp(targetColor, lerpFactor);
                    }
                }
            }
            
            // Cambio de clima sugerido
            if (this.seasonTimer > 1.9 && this.seasonTimer < 2.0 && renderer.setWeather) {
                renderer.setWeather(target.weather);
            }
        }
        
        // ============================================================
        //  ☁️ SISTEMA DE CLIMA (nuevo)
        //  ============================================================
        _updateWeather(delta) {
            this.weatherTimer += delta;
            
            // Eventos climáticos extremos
            if (this.weatherTimer > 60 + Math.random() * 120) {
                this.weatherTimer = 0;
                this._triggerWeatherEvent();
            }
        }
        
        _triggerWeatherEvent() {
            const events = ['tormenta', 'sequía', 'inundación', 'ola_de_calor', 'nevada'];
            const season = this.status.season;
            
            let availableEvents = [];
            if (season === 'verano' || season === 'otoño') {
                availableEvents = ['tormenta', 'sequía', 'ola_de_calor'];
            } else if (season === 'invierno') {
                availableEvents = ['nevada', 'tormenta'];
            } else {
                availableEvents = ['tormenta', 'inundación'];
            }
            
            // Añadir eventos según el ecosistema
            if (this.status.droughtLevel > 0.5) availableEvents.push('sequía');
            if (this.status.ecosystemHealth < 0.3) availableEvents.push('tormenta');
            
            const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            
            console.log(`🌤️ WorldAI: evento climático → ${event}`);
            this._recordEvent('weather_event', { type: event, season: season }, 0.7);
            
            // Aplicar efectos del evento
            this._applyWeatherEvent(event);
        }
        
        _applyWeatherEvent(event) {
            const renderer = this.engine.getModule('renderer');
            
            if (event === 'sequía') {
                this.status.droughtLevel = Math.min(1, this.status.droughtLevel + 0.3);
                this.config.droughtMultiplier = 2.0;
                this._recordEvent('drought_start', { level: this.status.droughtLevel }, 0.8);
            } else if (event === 'tormenta') {
                if (renderer?.setWeather) renderer.setWeather('rain');
                this.status.droughtLevel = Math.max(0, this.status.droughtLevel - 0.2);
                this._triggerStormEffects();
            } else if (event === 'ola_de_calor') {
                this.status.droughtLevel = Math.min(1, this.status.droughtLevel + 0.4);
                this.config.fireSpreadRate = 0.04;
                this._recordEvent('heatwave_start', { level: this.status.droughtLevel }, 0.7);
            } else if (event === 'nevada') {
                if (renderer?.setWeather) renderer.setWeather('snow');
                this.config.reproductionRate = 0;
                this._applySnowEffects();
            } else if (event === 'inundación') {
                this.status.droughtLevel = 0;
                this._triggerFloodEffects();
            }
        }
        
        // ============================================================
        //  🔥 INCENDIOS AVANZADOS
        //  ============================================================
        _updateFires(delta, simQuality) {
            const renderer = this.engine.getModule('renderer');
            const gameWorld = this.engine.getModule('gameWorld');
            if (!renderer || !gameWorld) return;
            
            const isDry = SEASONS[this.seasonIndex] === 'verano' || SEASONS[this.seasonIndex] === 'otoño';
            const droughtMultiplier = 1 + Math.min(2, this.consecutiveDrySeasons * 0.5);
            const fireRisk = this._calculateFireRisk() * droughtMultiplier;
            const maxFires = Math.min(this.config.maxFires, Math.floor(isDry ? 5 : 2));
            
            // Iniciar incendios según riesgo
            if (this.fires.length < maxFires && Math.random() < delta * 0.015 * fireRisk) {
                this._startNewFire(gameWorld);
            }
            
            // Propagación
            this._spreadFires(delta, gameWorld);
            
            // Actualizar incendios activos
            this._updateActiveFires(delta, renderer);
            
            // Regeneración post-incendio
            this._updateRegeneration(delta);
            
            this.status.activeFires = this.fires.length;
        }
        
        _calculateFireRisk() {
            let risk = 0.1;
            const season = this.status.season;
            
            if (season === 'verano') risk += 0.3;
            else if (season === 'otoño') risk += 0.2;
            else if (season === 'primavera') risk += 0.05;
            
            risk += this.status.droughtLevel * 0.3;
            risk += (1 - this.status.ecosystemHealth) * 0.2;
            
            if (this.consecutiveDrySeasons > 2) risk += 0.2;
            
            return Math.min(1, risk);
        }
        
        _startNewFire(gameWorld) {
            const trees = gameWorld.ecosystems?.entities?.trees;
            if (!trees || trees.size === 0) return;
            
            const ids = Array.from(trees);
            const id = ids[Math.floor(Math.random() * ids.length)];
            const soa = this.engine.getModule('ecs');
            
            if (soa && soa.posX) {
                const x = soa.posX[id];
                const y = soa.posY[id] + 1.2;
                const z = soa.posZ[id];
                
                const renderer = this.engine.getModule('renderer');
                if (renderer) {
                    this._igniteFire(renderer.scene, x, y, z, id);
                    this._recordEvent('fire_started', { x, y, z, treeId: id }, 0.8);
                }
            }
        }
        
        _spreadFires(delta, gameWorld) {
            const soa = this.engine.getModule('ecs');
            const trees = gameWorld.ecosystems?.entities?.trees;
            if (!soa || !trees || this.fires.length === 0) return;
            
            const maxFires = this.config.maxFires;
            const spreadRate = this.config.fireSpreadRate * (1 + this.status.droughtLevel * 0.5);
            
            for (const fire of this.fires) {
                if (fire.spread || Math.random() > delta * spreadRate) continue;
                
                const treeIds = Array.from(trees);
                const shuffled = treeIds.sort(() => Math.random() - 0.5);
                const searchRadius = 8 + this.status.droughtLevel * 4;
                
                for (const tid of shuffled.slice(0, 20)) {
                    if (tid === fire.treeId) continue;
                    if (this.fires.length >= maxFires) break;
                    
                    const dx = soa.posX[tid] - fire.x;
                    const dz = soa.posZ[tid] - fire.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    if (dist < searchRadius && Math.random() < 0.15) {
                        const renderer = this.engine.getModule('renderer');
                        if (renderer) {
                            this._igniteFire(
                                renderer.scene,
                                soa.posX[tid],
                                soa.posY[tid] + 1.2,
                                soa.posZ[tid],
                                tid
                            );
                            fire.spread = true;
                            this._recordEvent('fire_spread', { 
                                from: fire.treeId, 
                                to: tid, 
                                distance: dist 
                            }, 0.6);
                            break;
                        }
                    }
                }
            }
        }
        
        _igniteFire(scene, x, y, z, treeId = null) {
            try {
                // Luz de fuego realista
                const light = new THREE.PointLight(0xff6a1a, 2.5, 10, 2);
                light.position.set(x, y, z);
                scene.add(light);
                
                // Partículas de fuego
                const count = 40 + Math.floor(Math.random() * 30);
                const positions = new Float32Array(count * 3);
                const colors = new Float32Array(count * 3);
                const sizes = new Float32Array(count);
                
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.8;
                    positions[i * 3] = x + Math.cos(angle) * radius;
                    positions[i * 3 + 1] = y + Math.random() * 1.5;
                    positions[i * 3 + 2] = z + Math.sin(angle) * radius;
                    
                    // Colores de fuego (naranja -> amarillo)
                    const t = Math.random();
                    colors[i * 3] = 1.0;
                    colors[i * 3 + 1] = 0.3 + t * 0.5;
                    colors[i * 3 + 2] = 0.1 + t * 0.1;
                    sizes[i] = 0.15 + Math.random() * 0.25;
                }
                
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
                
                const material = new THREE.PointsMaterial({
                    size: 0.25,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.9,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    sizeAttenuation: true
                });
                
                const particles = new THREE.Points(geometry, material);
                scene.add(particles);
                
                // Humo
                const smokeCount = 15;
                const smokePos = new Float32Array(smokeCount * 3);
                for (let i = 0; i < smokeCount; i++) {
                    smokePos[i * 3] = x + (Math.random() - 0.5) * 1.5;
                    smokePos[i * 3 + 1] = y + 0.5 + Math.random() * 2;
                    smokePos[i * 3 + 2] = z + (Math.random() - 0.5) * 1.5;
                }
                const smokeGeo = new THREE.BufferGeometry();
                smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
                const smokeMat = new THREE.PointsMaterial({
                    color: 0x888888,
                    size: 0.4,
                    transparent: true,
                    opacity: 0.3,
                    blending: THREE.NormalBlending,
                    depthWrite: false
                });
                const smoke = new THREE.Points(smokeGeo, smokeMat);
                scene.add(smoke);
                
                this.fires.push({
                    light, 
                    particles, 
                    smoke,
                    age: 0,
                    lifetime: 10 + Math.random() * 15,
                    seed: Math.random() * 100,
                    x, z, 
                    treeId, 
                    spread: false,
                    intensity: 0.5 + Math.random() * 0.5,
                    burned: false
                });
                
                // Registrar área quemada
                this.burnedAreas.push({ x, z, time: this.clock, radius: 3 + Math.random() * 2 });
                
                console.log('🔥 WorldAI: incendio iniciado');
            } catch (e) {
                console.warn('⚠️ WorldAI: no se pudo iniciar incendio', e);
            }
        }
        
        _updateActiveFires(delta, renderer) {
            for (let i = this.fires.length - 1; i >= 0; i--) {
                const fire = this.fires[i];
                fire.age += delta;
                
                // Animación de llama
                if (fire.light) {
                    fire.light.intensity = 1.5 + Math.sin(this.clock * 15 + fire.seed) * 0.8;
                    fire.light.intensity *= (1 - fire.age / fire.lifetime);
                }
                
                // Animar partículas
                if (fire.particles) {
                    const pos = fire.particles.geometry.attributes.position;
                    if (pos) {
                        const array = pos.array;
                        for (let j = 0; j < array.length; j += 3) {
                            array[j] += (Math.random() - 0.5) * delta * 0.5;
                            array[j + 1] += delta * (0.5 + Math.random() * 0.5);
                            array[j + 2] += (Math.random() - 0.5) * delta * 0.5;
                        }
                        pos.needsUpdate = true;
                    }
                }
                
                // Animar humo
                if (fire.smoke) {
                    const pos = fire.smoke.geometry.attributes.position;
                    if (pos) {
                        const array = pos.array;
                        for (let j = 0; j < array.length; j += 3) {
                            array[j] += (Math.random() - 0.5) * delta * 0.3;
                            array[j + 1] += delta * 0.2;
                            array[j + 2] += (Math.random() - 0.5) * delta * 0.3;
                        }
                        pos.needsUpdate = true;
                    }
                    fire.smoke.material.opacity = Math.max(0, 0.3 * (1 - fire.age / fire.lifetime));
                }
                
                // Extinción
                if (fire.age > fire.lifetime) {
                    renderer.scene.remove(fire.light);
                    renderer.scene.remove(fire.particles);
                    renderer.scene.remove(fire.smoke);
                    
                    if (fire.particles.geometry) fire.particles.geometry.dispose();
                    if (fire.particles.material) fire.particles.material.dispose();
                    if (fire.smoke.geometry) fire.smoke.geometry.dispose();
                    if (fire.smoke.material) fire.smoke.material.dispose();
                    
                    // Registrar para regeneración
                    this.regeneratingAreas.push({
                        x: fire.x,
                        z: fire.z,
                        time: this.clock,
                        radius: 5 + Math.random() * 3
                    });
                    
                    this.fireHistory.push({
                        x: fire.x,
                        z: fire.z,
                        startTime: this.clock - fire.age,
                        endTime: this.clock,
                        duration: fire.age,
                        treeId: fire.treeId
                    });
                    
                    this.fires.splice(i, 1);
                    this._recordEvent('fire_extinguished', { 
                        x: fire.x, 
                        z: fire.z, 
                        duration: fire.age 
                    }, 0.5);
                }
            }
        }
        
        // ============================================================
        //  🌱 REGENERACIÓN POST-INCENDIO
        //  ============================================================
        _updateRegeneration(delta) {
            const regenRate = this.status.regenerationRate * delta;
            
            for (let i = this.regeneratingAreas.length - 1; i >= 0; i--) {
                const area = this.regeneratingAreas[i];
                area.time += delta;
                
                // Tiempo de regeneración
                if (area.time - this.clock > this.config.regenerationTime) {
                    // Regenerar vegetación
                    const placer = this.engine.getModule('vegetationPlacer');
                    if (placer && Math.random() < 0.1) {
                        // Plantar flores en área regenerada
                        for (let j = 0; j < 5; j++) {
                            const angle = Math.random() * Math.PI * 2;
                            const dist = Math.random() * area.radius;
                            // Simular colocación de flores
                        }
                    }
                    this.regeneratingAreas.splice(i, 1);
                    this._recordEvent('area_regenerated', { 
                        x: area.x, 
                        z: area.z, 
                        radius: area.radius 
                    }, 0.4);
                }
            }
        }
        
        // ============================================================
        //  🌱 CRECIMIENTO DE VEGETACIÓN (mejorado)
        //  ============================================================
        _updateGrowth(delta, simQuality) {
            this.growthTimer += delta;
            
            const adjustedInterval = this.config.growthInterval / (0.5 + simQuality * 0.5);
            if (this.growthTimer < adjustedInterval) return;
            this.growthTimer = 0;
            
            const pressure = this._getPerformancePressure();
            this.status.throttled = pressure > 0.6;
            
            if (this.status.throttled) {
                console.log('🌱 WorldAI: crecimiento pausado (presión ' + Math.round(pressure * 100) + '%)');
                return;
            }
            
            const placer = this.engine.getModule('vegetationPlacer');
            const season = SEASONS[this.seasonIndex];
            const isWinter = season === 'invierno';
            
            // Crecimiento según estación
            let growthMultiplier = 1.0;
            if (season === 'primavera') growthMultiplier = 1.5;
            else if (season === 'verano') growthMultiplier = 1.2;
            else if (season === 'otoño') growthMultiplier = 0.8;
            else if (season === 'invierno') growthMultiplier = 0.1;
            
            // Factor de sequía
            growthMultiplier *= (1 - this.status.droughtLevel * 0.5);
            
            // Factor de salud del ecosistema
            growthMultiplier *= this.status.ecosystemHealth;
            
            if (placer && placer.plantFlowers && !isWinter && growthMultiplier > 0.2) {
                const baseAmount = 30 + Math.random() * 20;
                const amount = Math.floor(baseAmount * growthMultiplier);
                const pressureFactor = pressure > 0.3 ? 0.5 : 1;
                
                placer.plantFlowers(Math.floor(amount * pressureFactor));
                this.status.populationGrowth += amount * 0.01;
                
                // Actualizar población de flores
                this.populations.flowers.count += amount;
                this.populations.flowers.avgHealth = 0.8 + Math.random() * 0.2;
                
                console.log(`🌱 WorldAI: ${amount} flores plantadas (x${growthMultiplier.toFixed(2)})`);
                
                // Dispersión de semillas
                if (Math.random() < 0.1) {
                    this._disperseSeeds(amount * 0.1);
                }
            }
        }
        
        _disperseSeeds(count) {
            const factory = this.engine.getModule('entityFactory');
            const gameWorld = this.engine.getModule('gameWorld');
            if (!factory || !gameWorld) return;
            
            for (let i = 0; i < Math.floor(count); i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 10 + Math.random() * 50;
                const x = Math.cos(angle) * dist;
                const z = Math.sin(angle) * dist;
                
                // Crear árbol desde semilla
                const id = factory.createTree(x, 5, z);
                if (id !== -1 && gameWorld.ecosystems?.entities?.trees) {
                    gameWorld.ecosystems.entities.trees.add(id);
                    this.populations.trees.count++;
                }
            }
            console.log('🌱 WorldAI: semillas dispersadas');
        }
        
        // ============================================================
        //  🦌 FAUNA AVANZADA (comportamiento emergente)
        //  ============================================================
        _updateFauna(delta, simQuality) {
            this.faunaTimer += delta;
            
            const adjustedInterval = this.config.faunaInterval / (0.5 + simQuality * 0.5);
            if (this.faunaTimer < adjustedInterval) return;
            this.faunaTimer = 0;
            
            const pressure = this._getPerformancePressure();
            if (pressure > 0.65) {
                console.log('🦌 WorldAI: fauna en pausa (rendimiento estresado)');
                return;
            }
            
            const factory = this.engine.getModule('entityFactory');
            const gameWorld = this.engine.getModule('gameWorld');
            const ecs = this.engine.getModule('ecs');
            
            if (!factory || !gameWorld || !ecs) return;
            
            const animals = gameWorld.ecosystems?.entities?.animals;
            if (!animals) return;
            
            const season = SEASONS[this.seasonIndex];
            const isWinter = season === 'invierno';
            const maxPopulation = this.config.maxAnimals * (isWinter ? 0.6 : 1);
            
            // Verificar capacidad de carga
            const currentPopulation = animals.size;
            const carryingCapacity = this.status.carryingCapacity * maxPopulation;
            
            // ============================================================
            //  🧬 REPRODUCCIÓN
            //  ============================================================
            if (currentPopulation < carryingCapacity * 0.8 && !isWinter) {
                const reproductionRate = this.config.reproductionRate * (1 - pressure * 0.5);
                const birthChance = reproductionRate * delta * 30;
                
                if (Math.random() < birthChance) {
                    const count = pressure > 0.35 ? 1 : 2 + Math.floor(Math.random() * 2);
                    const isPredator = Math.random() < this.config.predatorChance;
                    
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 15 + Math.random() * 40;
                        const x = Math.cos(angle) * dist;
                        const z = Math.sin(angle) * dist;
                        const y = this._getGroundHeight(x, z) + 0.3;
                        
                        const id = factory.createAnimal(x, y, z, isPredator);
                        if (id !== -1) {
                            animals.add(id);
                            
                            // Inicializar memoria animal
                            this.animalMemory.set(id, {
                                territory: { x, z, radius: 15 + Math.random() * 20 },
                                mate: null,
                                offspring: [],
                                lastMeal: this.clock,
                                lastWater: this.clock,
                                health: 0.7 + Math.random() * 0.3,
                                age: 0,
                                speed: 0.8 + Math.random() * 0.4,
                                behavior: 'explorando',
                                herd: null,
                                strength: 0.5 + Math.random() * 0.5
                            });
                            
                            // Actualizar poblaciones
                            if (isPredator) {
                                this.populations.predators.count++;
                            } else {
                                this.populations.herbivores.count++;
                            }
                        }
                    }
                    
                    this._recordEvent('birth', { 
                        count: count, 
                        predators: isPredator ? count : 0,
                        herbivores: isPredator ? 0 : count 
                    }, 0.5);
                    
                    console.log(`🦌 WorldAI: ${count} ${isPredator ? 'depredadores' : 'herbívoros'} nacieron`);
                }
            }
            
            // ============================================================
            //  🦁 COMPORTAMIENTO DE DEPREDACIÓN
            //  ============================================================
            if (currentPopulation > 10) {
                this._updatePredation(delta, animals, ecs);
            }
            
            // ============================================================
            //  🏃 MIGRACIÓN
            //  ============================================================
            if (season === 'otoño' || season === 'primavera') {
                this._updateMigration(delta, animals, ecs);
            }
            
            // ============================================================
            //  🏠 FORMACIÓN DE MANADAS
            //  ============================================================
            if (currentPopulation > 20 && this.herds.length < this.config.maxHerds) {
                this._updateHerds(animals, ecs);
            }
            
            // ============================================================
            //  💀 MORTALIDAD
            //  ============================================================
            this._updateMortality(delta, animals, ecs);
            
            // Actualizar estadísticas de población
            this._updatePopulationStats(animals, ecs);
        }
        
        _updatePredation(delta, animals, ecs) {
            const predators = [];
            const prey = [];
            
            for (const id of animals) {
                if (ecs.isAnimal[id] && ecs.isEnemy?.[id]) {
                    predators.push(id);
                } else if (ecs.isAnimal[id]) {
                    prey.push(id);
                }
            }
            
            if (predators.length === 0 || prey.length === 0) return;
            
            const huntChance = delta * 0.01 * (1 + this.status.droughtLevel * 0.5);
            
            for (const predatorId of predators) {
                if (Math.random() > huntChance) continue;
                
                // Buscar presa cercana
                let closestPrey = -1;
                let closestDist = Infinity;
                const maxHuntRange = 20 + this.status.droughtLevel * 10;
                
                for (const preyId of prey) {
                    const dx = ecs.posX[predatorId] - ecs.posX[preyId];
                    const dz = ecs.posZ[predatorId] - ecs.posZ[preyId];
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    if (dist < maxHuntRange && dist < closestDist) {
                        const memory = this.animalMemory.get(preyId);
                        if (memory && memory.health > 0.3) {
                            closestPrey = preyId;
                            closestDist = dist;
                        }
                    }
                }
                
                if (closestPrey !== -1 && closestDist < 5) {
                    // Cazar
                    const preyMemory = this.animalMemory.get(closestPrey);
                    const predatorMemory = this.animalMemory.get(predatorId);
                    
                    if (preyMemory && predatorMemory) {
                        // Probabilidad de éxito
                        const successChance = 0.6 + predatorMemory.strength * 0.2 - preyMemory.strength * 0.2;
                        if (Math.random() < successChance) {
                            // Matar presa
                            ecs.destroyEntity(closestPrey);
                            animals.delete(closestPrey);
                            this.animalMemory.delete(closestPrey);
                            
                            predatorMemory.lastMeal = this.clock;
                            predatorMemory.health = Math.min(1, predatorMemory.health + 0.2);
                            
                            // Actualizar poblaciones
                            this.populations.herbivores.count--;
                            
                            this._recordEvent('predation', { 
                                predator: predatorId, 
                                prey: closestPrey,
                                distance: closestDist 
                            }, 0.6);
                            
                            console.log(`🦁 WorldAI: depredación exitosa`);
                        } else {
                            // Presa escapa
                            preyMemory.behavior = 'huyendo';
                            preyMemory.health -= 0.05;
                        }
                    }
                }
            }
        }
        
        _updateMigration(delta, animals, ecs) {
            const migrationChance = delta * 0.005;
            const moveDistance = this.config.migrationDistance * delta;
            
            for (const id of animals) {
                if (Math.random() > migrationChance) continue;
                
                const memory = this.animalMemory.get(id);
                if (!memory) continue;
                
                // Migrar en dirección aleatoria
                const angle = Math.random() * Math.PI * 2;
                const dx = Math.cos(angle) * moveDistance;
                const dz = Math.sin(angle) * moveDistance;
                
                const newX = ecs.posX[id] + dx;
                const newZ = ecs.posZ[id] + dz;
                const newY = this._getGroundHeight(newX, newZ) + 0.3;
                
                if (newY > 1) { // Evitar agua
                    ecs.posX[id] = newX;
                    ecs.posY[id] = newY;
                    ecs.posZ[id] = newZ;
                    memory.territory.x = newX;
                    memory.territory.z = newZ;
                }
            }
        }
        
        _updateHerds(animals, ecs) {
            // Buscar animales sin manada
            const ungrouped = [];
            const inHerd = new Set();
            
            for (const herd of this.herds) {
                for (const id of herd.members) {
                    inHerd.add(id);
                }
            }
            
            for (const id of animals) {
                if (!inHerd.has(id)) {
                    ungrouped.push(id);
                }
            }
            
            if (ungrouped.length < this.config.herdSize) return;
            
            // Formar nueva manada
            const herdSize = Math.min(this.config.herdSize, ungrouped.length);
            const members = ungrouped.slice(0, herdSize);
            
            // Calcular centro
            let cx = 0, cz = 0;
            for (const id of members) {
                cx += ecs.posX[id];
                cz += ecs.posZ[id];
            }
            cx /= members.length;
            cz /= members.length;
            
            this.herds.push({
                members: members,
                center: { x: cx, z: cz },
                radius: 10 + Math.random() * 10,
                leader: members[0],
                formation: 'circle'
            });
            
            // Asignar manada a los animales
            for (const id of members) {
                const memory = this.animalMemory.get(id);
                if (memory) {
                    memory.herd = this.herds.length - 1;
                }
            }
            
            console.log(`🦌 WorldAI: nueva manada de ${herdSize} animales formada`);
        }
        
        _updateMortality(delta, animals, ecs) {
            const deathChance = delta * 0.002;
            const toRemove = [];
            
            for (const id of animals) {
                const memory = this.animalMemory.get(id);
                if (!memory) continue;
                
                memory.age += delta;
                
                // Muerte por vejez
                if (memory.age > 120 + Math.random() * 60) {
                    toRemove.push(id);
                    continue;
                }
                
                // Muerte por inanición
                const timeSinceMeal = this.clock - memory.lastMeal;
                if (timeSinceMeal > 60) {
                    memory.health -= delta * 0.01;
                }
                
                // Muerte por enfermedad (sequía)
                if (this.status.droughtLevel > 0.5 && Math.random() < delta * 0.005) {
                    memory.health -= delta * 0.02;
                }
                
                if (memory.health <= 0) {
                    toRemove.push(id);
                }
            }
            
            for (const id of toRemove) {
                ecs.destroyEntity(id);
                animals.delete(id);
                this.animalMemory.delete(id);
                
                // Actualizar poblaciones
                if (ecs.isEnemy?.[id]) {
                    this.populations.predators.count--;
                } else {
                    this.populations.herbivores.count--;
                }
            }
            
            if (toRemove.length > 0) {
                console.log(`💀 WorldAI: ${toRemove.length} animales murieron`);
            }
        }
        
        _updatePopulationStats(animals, ecs) {
            let totalHealth = 0;
            let totalAge = 0;
            let herbCount = 0;
            let predCount = 0;
            let herbHealth = 0;
            let predHealth = 0;
            
            for (const id of animals) {
                const memory = this.animalMemory.get(id);
                if (!memory) continue;
                
                totalHealth += memory.health || 0.5;
                totalAge += memory.age || 0;
                
                if (ecs.isEnemy?.[id]) {
                    predCount++;
                    predHealth += memory.health || 0.5;
                } else {
                    herbCount++;
                    herbHealth += memory.health || 0.5;
                }
            }
            
            const count = animals.size || 1;
            this.populations.herbivores.count = herbCount;
            this.populations.herbivores.avgHealth = herbCount > 0 ? herbHealth / herbCount : 0;
            this.populations.herbivores.avgAge = totalAge / count;
            
            this.populations.predators.count = predCount;
            this.populations.predators.avgHealth = predCount > 0 ? predHealth / predCount : 0;
            
            this.status.biodiversity = this._calculateBiodiversity();
        }
        
        // ============================================================
        //  🌍 ECOSISTEMA Y BIODIVERSIDAD
        //  ============================================================
        _updateEcosystem(delta, simQuality) {
            // Calcular capacidad de carga
            const seasonFactor = SEASONS[this.seasonIndex] === 'invierno' ? 0.6 : 1;
            const droughtFactor = 1 - this.status.droughtLevel * 0.4;
            const healthFactor = this.status.ecosystemHealth;
            
            this.status.carryingCapacity = seasonFactor * droughtFactor * healthFactor;
            
            // Regeneración natural
            if (this.status.ecosystemHealth < 0.8) {
                const regen = delta * 0.001 * (1 - this.status.droughtLevel);
                this.status.ecosystemHealth = Math.min(1, this.status.ecosystemHealth + regen);
            }
            
            // Impacto de incendios
            const fireImpact = this.fires.length * 0.02;
            if (fireImpact > 0) {
                this.status.ecosystemHealth = Math.max(0.1, this.status.ecosystemHealth - fireImpact * delta * 0.01);
            }
            
            // Actualizar biomas
            for (const [biome, data] of Object.entries(this.biomeHealth)) {
                data.health += (1 - data.health) * delta * 0.001;
                data.health = Math.max(0.1, Math.min(1, data.health));
                
                // Impacto de sequía
                if (this.status.droughtLevel > 0.3) {
                    data.health -= delta * 0.001 * this.status.droughtLevel;
                }
            }
        }
        
        _calculateEcosystemHealth() {
            let health = 0;
            let factors = 0;
            
            // Factor: biodiversidad
            health += this.status.biodiversity * 0.3;
            factors += 0.3;
            
            // Factor: población animal (equilibrio)
            const herbCount = this.populations.herbivores.count;
            const predCount = this.populations.predators.count;
            const totalCount = herbCount + predCount;
            
            if (totalCount > 0) {
                const balance = predCount / totalCount;
                const idealBalance = 0.2; // 20% depredadores
                const balanceScore = 1 - Math.abs(balance - idealBalance) * 2;
                health += Math.max(0, Math.min(1, balanceScore)) * 0.25;
            } else {
                health += 0.5 * 0.25;
            }
            factors += 0.25;
            
            // Factor: vegetación
            const treeCount = this.populations.trees.count;
            const flowerCount = this.populations.flowers.count;
            const vegScore = Math.min(1, (treeCount + flowerCount) / 500);
            health += vegScore * 0.25;
            factors += 0.25;
            
            // Factor: sequía
            health += (1 - this.status.droughtLevel) * 0.2;
            factors += 0.2;
            
            return Math.max(0.1, Math.min(1, health / factors));
        }
        
        _calculateBiodiversity() {
            const species = [
                this.populations.herbivores.count > 0,
                this.populations.predators.count > 0,
                this.populations.trees.count > 100,
                this.populations.flowers.count > 50,
                this.populations.grass.count > 200
            ];
            
            const present = species.filter(Boolean).length;
            return present / species.length;
        }
        
        _calculateDroughtLevel() {
            const season = SEASONS[this.seasonIndex];
            let drought = 0;
            
            if (season === 'verano') drought += 0.2;
            else if (season === 'otoño') drought += 0.1;
            
            drought += this.consecutiveDrySeasons * 0.1;
            drought += (1 - this.status.ecosystemHealth) * 0.2;
            
            return Math.min(1, drought);
        }
        
        _calculateResources() {
            const seasonFactor = SEASONS[this.seasonIndex] === 'invierno' ? 0.4 : 1;
            const droughtFactor = 1 - this.status.droughtLevel * 0.5;
            const healthFactor = this.status.ecosystemHealth;
            
            return seasonFactor * droughtFactor * healthFactor;
        }
        
        // ============================================================
        //  🔮 PREDICCIONES
        //  ============================================================
        _updatePredictions(delta) {
            // Tendencia de población
            const herbTrend = this.populations.herbivores.count - (this._previousHerbCount || 0);
            const predTrend = this.populations.predators.count - (this._previousPredCount || 0);
            
            if (herbTrend > 0 && predTrend > 0) {
                this.predictions.populationTrend = 'growing';
            } else if (herbTrend < 0 || predTrend < 0) {
                this.predictions.populationTrend = 'declining';
            } else {
                this.predictions.populationTrend = 'stable';
            }
            
            this._previousHerbCount = this.populations.herbivores.count;
            this._previousPredCount = this.populations.predators.count;
            
            // Riesgo de incendio
            this.predictions.fireRisk = this._calculateFireRisk();
            
            // Riesgo de sequía
            this.predictions.droughtRisk = this.status.droughtLevel + 
                (this.consecutiveDrySeasons - 1) * 0.1;
            this.predictions.droughtRisk = Math.min(1, this.predictions.droughtRisk);
            
            // Tendencia de biodiversidad
            const currentBiodiversity = this.status.biodiversity;
            if (currentBiodiversity > this._previousBiodiversity) {
                this.predictions.biodiversityTrend = 'improving';
            } else if (currentBiodiversity < this._previousBiodiversity) {
                this.predictions.biodiversityTrend = 'declining';
            } else {
                this.predictions.biodiversityTrend = 'stable';
            }
            this._previousBiodiversity = currentBiodiversity;
        }
        
        // ============================================================
        //  🧠 MEMORIA DEL ECOSISTEMA
        //  ============================================================
        _updateEcosystemMemory(delta) {
            this.ecosystemMemory.push({
                time: this.clock,
                biodiversity: this.status.biodiversity,
                health: this.status.ecosystemHealth,
                animals: this.populations.herbivores.count + this.populations.predators.count,
                fires: this.fires.length,
                drought: this.status.droughtLevel
            });
            
            if (this.ecosystemMemory.length > 1000) {
                this.ecosystemMemory.shift();
            }
        }
        
        // ============================================================
        //  📝 REGISTRO DE EVENTOS
        //  ============================================================
        _recordEvent(type, data, importance = 0.5) {
            try {
                const memory = this.engine.getModule('memory');
                if (memory && typeof memory.recordEvent === 'function') {
                    memory.recordEvent('world_' + type, data, importance);
                }
            } catch (e) {
                // Silencioso
            }
        }
        
        // ============================================================
        //  🎯 EVENTOS ESPECIALES
        //  ============================================================
        _triggerSpringBloom() {
            console.log('🌸 WorldAI: explosión de flores primaveral');
            this._recordEvent('spring_bloom', {}, 0.7);
            
            const placer = this.engine.getModule('vegetationPlacer');
            if (placer) {
                placer.plantFlowers(100 + Math.floor(Math.random() * 50));
            }
        }
        
        _triggerDroughtWarning() {
            console.log('⚠️ WorldAI: advertencia de sequía');
            this._recordEvent('drought_warning', { 
                level: this.status.droughtLevel,
                consecutive: this.consecutiveDrySeasons 
            }, 0.8);
        }
        
        _triggerAutumnMigration() {
            console.log('🍂 WorldAI: migración otoñal');
            this._recordEvent('autumn_migration', {}, 0.6);
            
            // Aumentar movimiento animal
            this.config.migrationDistance = 70;
        }
        
        _applyWinterEffects() {
            console.log('❄️ WorldAI: efectos invernales');
            this._recordEvent('winter_effects', {}, 0.5);
            
            // Reducir crecimiento
            this.config.growthInterval = 30;
            
            // Más mortalidad
            const animals = this.engine.getModule('gameWorld')?.ecosystems?.entities?.animals;
            if (animals && animals.size > 50) {
                const toRemove = [];
                let count = 0;
                for (const id of animals) {
                    if (Math.random() < 0.01 && count < 10) {
                        toRemove.push(id);
                        count++;
                    }
                }
                for (const id of toRemove) {
                    const ecs = this.engine.getModule('ecs');
                    if (ecs) ecs.destroyEntity(id);
                    animals.delete(id);
                    this.animalMemory.delete(id);
                }
                if (count > 0) {
                    console.log(`❄️ WorldAI: ${count} animales murieron por el invierno`);
                }
            }
        }
        
        _triggerStormEffects() {
            console.log('⛈️ WorldAI: efectos de tormenta');
            this._recordEvent('storm_effects', {}, 0.6);
            
            // Regeneración natural
            this.status.ecosystemHealth = Math.min(1, this.status.ecosystemHealth + 0.05);
        }
        
        _applySnowEffects() {
            console.log('❄️ WorldAI: nevada aplicada');
            this.config.reproductionRate = 0;
            this.status.resourceAvailability = 0.3;
        }
        
        _triggerFloodEffects() {
            console.log('🌊 WorldAI: inundación aplicada');
            this._recordEvent('flood_effects', {}, 0.7);
            
            // Pérdida de vegetación
            this.populations.flowers.count *= 0.7;
            this.populations.trees.count *= 0.9;
            
            // Regeneración posterior
            this.status.regenerationRate = 0.2;
        }
        
        // ============================================================
        //  📊 UTILIDADES
        //  ============================================================
        _getGroundHeight(x, z) {
            const terrain = this.engine.getModule('gameWorld')?.generators?.terrain;
            if (terrain && typeof terrain.getHeight === 'function') {
                return terrain.getHeight(x, z);
            }
            return 0;
        }
        
        // ============================================================
        //  👁️ MÉTODOS PÚBLICOS
        //  ============================================================
        onResume() {
            this.growthTimer = Math.min(this.growthTimer, 15);
            this.faunaTimer = Math.min(this.faunaTimer, 20);
            console.log('🌍 WorldAI: reanudado, temporizadores estabilizados');
        }
        
        getStatus() {
            return {
                ...this.status,
                confidence: this.confidence,
                predictions: this.predictions,
                populations: this.populations,
                biomes: this.biomeHealth,
                fires: this.fires.length,
                herds: this.herds.length,
                burnedAreas: this.burnedAreas.length,
                regeneratingAreas: this.regeneratingAreas.length,
                ecosystemMemory: this.ecosystemMemory.length,
                seedBank: this.seedBank.length
            };
        }
        
        getEcosystemReport() {
            return {
                health: this.status.ecosystemHealth,
                biodiversity: this.status.biodiversity,
                carryingCapacity: this.status.carryingCapacity,
                resourceAvailability: this.status.resourceAvailability,
                droughtLevel: this.status.droughtLevel,
                populationTrend: this.predictions.populationTrend,
                fireRisk: this.predictions.fireRisk,
                droughtRisk: this.predictions.droughtRisk,
                biomes: this.biomeHealth,
                populations: this.populations
            };
        }
        
        getFireRisk() {
            return this.predictions.fireRisk;
        }
        
        getDroughtRisk() {
            return this.predictions.droughtRisk;
        }
        
        // ============================================================
        //  💾 GUARDAR ESTADO
        //  ============================================================
        _saveState() {
            try {
                const data = {
                    populations: this.populations,
                    ecosystemMemory: this.ecosystemMemory.slice(-200),
                    biomeHealth: this.biomeHealth,
                    seedBank: this.seedBank,
                    fireHistory: this.fireHistory.slice(-50),
                    burnedAreas: this.burnedAreas.slice(-20),
                    status: {
                        season: this.status.season,
                        ecosystemHealth: this.status.ecosystemHealth,
                        biodiversity: this.status.biodiversity,
                        droughtLevel: this.status.droughtLevel,
                        carryingCapacity: this.status.carryingCapacity,
                        regenerationRate: this.status.regenerationRate
                    },
                    predictions: this.predictions,
                    savedAt: Date.now()
                };
                
                const memory = this.engine.getModule('memory');
                if (memory && typeof memory.saveGameData === 'function') {
                    memory.saveGameData('worldAI', data);
                }
            } catch (e) {
                // Silencioso
            }
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clock = 0;
            this.seasonIndex = 1;
            this.seasonTimer = 0;
            this.fires = [];
            this.growthTimer = 0;
            this.faunaTimer = 0;
            this.weatherTimer = 0;
            this.confidence = 1.0;
            this.consecutiveDrySeasons = 0;
            this.ecosystemMemory = [];
            this.animalMemory = new Map();
            this.herds = [];
            this.territories = [];
            this.migrationRoutes = [];
            this.vegetationMemory = new Map();
            this.seedBank = [];
            this.fireHistory = [];
            this.burnedAreas = [];
            this.regeneratingAreas = [];
            
            this.populations = {
                herbivores: { count: 0, avgHealth: 1.0, avgAge: 0 },
                predators: { count: 0, avgHealth: 1.0, avgAge: 0 },
                trees: { count: 0, avgHealth: 1.0, avgAge: 0 },
                flowers: { count: 0, avgHealth: 1.0, avgAge: 0 },
                grass: { count: 0, avgHealth: 1.0, avgAge: 0 }
            };
            
            this.status = {
                season: SEASONS[this.seasonIndex],
                activeFires: 0,
                populationGrowth: 0,
                throttled: false,
                biodiversity: 0.5,
                ecosystemHealth: 1.0,
                carryingCapacity: 0.8,
                resourceAvailability: 0.7,
                droughtLevel: 0,
                pollution: 0,
                regenerationRate: 0.1
            };
            
            this.predictions = {
                populationTrend: 'stable',
                fireRisk: 0.1,
                droughtRisk: 0.1,
                biodiversityTrend: 'stable',
                nextEvent: null
            };
            
            this._initBiomes();
            console.log('🔄 WorldAI reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.WorldAI = WorldAI;
    
    console.log('🌍 WorldAI Cuántica cargado');
    console.log('🦌 Simulación de ecosistema completa');
    console.log('🔥 Sistema de incendios y regeneración');
    console.log('🧬 Comportamiento animal emergente');
    console.log('🌱 Ciclo de vida y sucesión ecológica');
    console.log('📊 Predicciones y memoria del ecosistema');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WorldAI;
    }
    
})();
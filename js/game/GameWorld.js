/**
 * 🎯 PRIOM V0.1 - GAME WORLD
 * "El corazón vivo del universo de juego"
 * 
 * 📁 Ubicación: js/game/GameWorld.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Gestión del mundo de juego y sus ecosistemas
 * 
 * ⭐ INNOVACIONES:
 * - Ecosistema vivo con ciclos de vida
 * - Generación procedural de biomas
 * - Sistema de clima dinámico
 * - Poblaciones autoreguladas
 * - Comportamiento emergente de entidades
 * - Ciclo día/noche con efectos ecológicos
 * - Sistema de eventos mundiales
 * - Simulación de ecosistemas complejos
 * - Interacciones entre especies
 * - Evolución de poblaciones
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎯 GameWorld - Mundo de Juego
     * Gestiona el mundo vivo y sus ecosistemas
     */
    class GameWorld {
        constructor(soa, renderer, memory) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.soa = soa;
            this.renderer = renderer;
            this.memory = memory;
            
            // ============================================================
            //  📊 CONFIGURACIÓN DEL MUNDO
            //  ============================================================
            this.config = {
                worldSize: CONFIG?.worldSize || 1000,
                terrainHeight: CONFIG?.terrainHeight || 30,
                treeDensity: CONFIG?.treeDensity || 0.3,
                animalCount: CONFIG?.animalCount || 100,
                waterLevel: CONFIG?.waterLevel || 0.5,
                seed: CONFIG?.worldSeed || 42,
                
                // Ecosistemas
                forestDensity: 0.4,
                mountainDensity: 0.15,
                waterDensity: 0.1,
                desertDensity: 0.05,
                
                // Poblaciones
                maxAnimals: 200,
                maxTrees: 15000,
                maxRocks: 800,
                maxBuildings: 50,
                maxParticles: 5000,
                
                // Ciclos
                dayLength: 600, // segundos
                seasonLength: 3600, // segundos
                
                // Comportamiento
                animalSpeed: 2.0,
                animalWanderRadius: 50,
                predatorChaseRange: 30,
                preyFleeRange: 20,
                treeGrowthRate: 0.001,
                waterEvaporationRate: 0.0001,
                
                // Simulación
                simulationEnabled: true,
                ecosystemEnabled: true,
                weatherEnabled: true,
                seasonsEnabled: true
            };
            
            // ============================================================
            //  🌍 ESTADO DEL MUNDO
            //  ============================================================
            this.state = {
                time: 0,
                dayTime: 0.5, // 0-1
                season: 0, // 0-3 (primavera, verano, otoño, invierno)
                temperature: 20,
                humidity: 0.5,
                windSpeed: 0,
                weather: 'clear', // clear | cloudy | rainy | stormy | snowy
                generationProgress: 0,
                isReady: false,
                entitiesCount: 0,
                lastUpdate: 0,
                events: []
            };
            
            // ============================================================
            //  🧬 ECOSISTEMAS
            //  ============================================================
            this.ecosystems = {
                forests: new Map(),
                mountains: new Map(),
                waterBodies: new Map(),
                deserts: new Map(),
                grasslands: new Map(),
                entities: {
                    trees: new Set(),
                    rocks: new Set(),
                    animals: new Set(),
                    buildings: new Set(),
                    particles: new Set(),
                    water: new Set()
                }
            };
            
            // ============================================================
            //  🧠 COMPORTAMIENTOS
            //  ============================================================
            this.behaviors = {
                animals: new Map(), // id -> { state, target, timer }
                trees: new Map(), // id -> { growth, health, age }
                water: new Map() // id -> { level, flow }
            };
            
            // ============================================================
            //  📊 GENERADORES
            //  ============================================================
            this.generators = {
                terrain: null,
                entities: null,
                weather: null
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🎯 GameWorld inicializado');
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Configurar generadores
            this.generators.terrain = new TerrainGenerator(this.config);
            this.generators.entities = new EntityFactory(this.soa, this.config);
            this.generators.weather = new WeatherSystem(this.config);
            
            // Generar mundo
            this._generateWorld();
            
            console.log('✅ GameWorld listo');
            console.log(`🌍 Tamaño: ${this.config.worldSize}x${this.config.worldSize}`);
            console.log(`🌳 Densidad de árboles: ${this.config.treeDensity}`);
            console.log(`🐾 Animales: ${this.config.animalCount}`);
        }
        
        // ============================================================
        //  🌍 GENERAR MUNDO
        //  ============================================================
        _generateWorld() {
            console.log('🌍 Generando mundo...');
            this.state.generationProgress = 0;
            
            // ===== 1. GENERAR TERRENO =====
            this.state.generationProgress = 20;
            this._generateTerrain();
            
            // ===== 2. GENERAR ECOSISTEMAS =====
            this.state.generationProgress = 40;
            this._generateEcosystems();
            
            // ===== 3. GENERAR ENTIDADES =====
            this.state.generationProgress = 60;
            this._generateEntities();
            
            // ===== 4. GENERAR AGUA =====
            this.state.generationProgress = 80;
            this._generateWater();
            
            // ===== 5. GENERAR PARTÍCULAS =====
            this.state.generationProgress = 90;
            this._generateParticles();
            
            // ===== 6. FINALIZAR =====
            this.state.generationProgress = 100;
            this.state.isReady = true;
            
            console.log('✅ Mundo generado correctamente');
            console.log(`📊 Entidades totales: ${this.soa.count}`);
            console.log(`🌳 Árboles: ${this.ecosystems.entities.trees.size}`);
            console.log(`🐾 Animales: ${this.ecosystems.entities.animals.size}`);
            console.log(`💧 Agua: ${this.ecosystems.entities.water.size}`);
        }
        
        // ============================================================
        //  🏔️ GENERAR TERRENO
        //  ============================================================
        _generateTerrain() {
            const terrain = this.generators.terrain;
            const heightMap = terrain.generateHeightMap(this.config.worldSize);
            
            // Almacenar mapa de altura para referencias futuras
            this._heightMap = heightMap;
            
            // Generar geometría del terreno
            terrain.generateTerrainMesh(this.renderer.scene, heightMap);
            
            console.log('🏔️ Terreno generado');
        }
        
        // ============================================================
        //  🌿 GENERAR ECOSISTEMAS
        //  ============================================================
        _generateEcosystems() {
            const size = this.config.worldSize;
            const halfSize = size / 2;
            
            // Determinar biomas basados en ruido
            for (let x = -halfSize; x < halfSize; x += 10) {
                for (let z = -halfSize; z < halfSize; z += 10) {
                    const height = this._getHeight(x, z);
                    const moisture = this._getMoisture(x, z);
                    
                    // Clasificar bioma
                    if (height > 20 && moisture > 0.5) {
                        // Montaña boscosa
                        this.ecosystems.mountains.set(`${x},${z}`, { x, z, height, moisture, type: 'mountain' });
                    } else if (height > 15 && moisture > 0.3) {
                        // Bosque
                        this.ecosystems.forests.set(`${x},${z}`, { x, z, height, moisture, type: 'forest' });
                    } else if (height < 2 && moisture > 0.7) {
                        // Agua
                        this.ecosystems.waterBodies.set(`${x},${z}`, { x, z, height, moisture, type: 'water' });
                    } else if (height > 5 && moisture < 0.2) {
                        // Desierto
                        this.ecosystems.deserts.set(`${x},${z}`, { x, z, height, moisture, type: 'desert' });
                    } else {
                        // Pradera
                        this.ecosystems.grasslands.set(`${x},${z}`, { x, z, height, moisture, type: 'grassland' });
                    }
                }
            }
            
            console.log(`🌿 Ecosistemas: ${this.ecosystems.forests.size} bosques, ${this.ecosystems.mountains.size} montañas`);
        }
        
        // ============================================================
        //  🧬 GENERAR ENTIDADES
        //  ============================================================
        _generateEntities() {
            const factory = this.generators.entities;
            
            // ===== ÁRBOLES =====
            const treeCount = Math.floor(this.config.worldSize * this.config.treeDensity);
            for (let i = 0; i < Math.min(treeCount, this.config.maxTrees); i++) {
                const pos = this._getRandomPositionInBiome('forest');
                if (pos) {
                    const id = factory.createTree(pos.x, pos.y, pos.z);
                    if (id !== -1) {
                        this.ecosystems.entities.trees.add(id);
                        this.behaviors.trees.set(id, {
                            growth: 0.5 + Math.random() * 0.5,
                            health: 1.0,
                            age: Math.random() * 100
                        });
                    }
                }
            }
            
            // ===== ROCAS =====
            const rockCount = Math.floor(this.config.worldSize * 0.05);
            for (let i = 0; i < Math.min(rockCount, this.config.maxRocks); i++) {
                const pos = this._getRandomPositionInBiome('mountain');
                if (pos) {
                    const id = factory.createRock(pos.x, pos.y, pos.z);
                    if (id !== -1) {
                        this.ecosystems.entities.rocks.add(id);
                    }
                }
            }
            
            // ===== ANIMALES =====
            for (let i = 0; i < Math.min(this.config.animalCount, this.config.maxAnimals); i++) {
                const pos = this._getRandomPositionInBiome('grassland');
                if (pos) {
                    const isPredator = Math.random() < 0.2;
                    const id = factory.createAnimal(pos.x, pos.y, pos.z, isPredator);
                    if (id !== -1) {
                        this.ecosystems.entities.animals.add(id);
                        this._animalIdsDirty = true;
                        this.behaviors.animals.set(id, {
                            state: 'wandering',
                            target: { x: pos.x, z: pos.z },
                            timer: 0,
                            speed: 0.5 + Math.random() * 0.5,
                            hunger: 0.5,
                            energy: 0.8,
                            isPredator: isPredator
                        });
                    }
                }
            }
            
            // ===== EDIFICIOS =====
            for (let i = 0; i < Math.min(50, this.config.maxBuildings); i++) {
                const pos = this._getRandomPositionInBiome('grassland');
                if (pos) {
                    const id = factory.createBuilding(pos.x, pos.y, pos.z);
                    if (id !== -1) {
                        this.ecosystems.entities.buildings.add(id);
                    }
                }
            }
            
            console.log(`🧬 Entidades generadas: ${this.soa.count}`);
        }
        
        // ============================================================
        //  💧 GENERAR AGUA
        //  ============================================================
        _generateWater() {
            const waterBodies = Array.from(this.ecosystems.waterBodies.values());
            const maxWaterEntities = this.config.maxWaterEntities || 400;
            
            // Muestrear un subconjunto de celdas de agua en vez de procesarlas todas
            // (evita generar decenas de miles de entidades y saturar el renderer)
            const sampleSize = Math.min(waterBodies.length, 80);
            let created = 0;
            
            for (let i = 0; i < sampleSize && created < maxWaterEntities; i++) {
                const idx = Math.floor((i / sampleSize) * waterBodies.length);
                const body = waterBodies[idx];
                if (!body) continue;
                
                const count = Math.min(3 + Math.floor(Math.random() * 3), maxWaterEntities - created);
                for (let j = 0; j < count; j++) {
                    const x = body.x + (Math.random() - 0.5) * 15;
                    const z = body.z + (Math.random() - 0.5) * 15;
                    const y = this._getHeight(x, z) + 0.5;
                    
                    const id = this.generators.entities.createWater(x, y, z);
                    if (id !== -1) {
                        this.ecosystems.entities.water.add(id);
                        this.behaviors.water.set(id, {
                            level: 0.5 + Math.random() * 0.5,
                            flow: 0
                        });
                        created++;
                    }
                }
            }
        }
        
        // ============================================================
        //  ✨ GENERAR PARTÍCULAS
        //  ============================================================
        _generateParticles() {
            const count = Math.min(3000, this.config.maxParticles);
            
            for (let i = 0; i < count; i++) {
                const x = (Math.random() - 0.5) * this.config.worldSize;
                const z = (Math.random() - 0.5) * this.config.worldSize;
                const y = 1 + Math.random() * 15;
                
                const id = this.generators.entities.createParticle(x, y, z);
                if (id !== -1) {
                    this.ecosystems.entities.particles.add(id);
                }
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN DEL MUNDO
        //  ============================================================
        update(delta) {
            if (!this.state.isReady) return;
            
            const now = performance.now();
            this.state.lastUpdate = now;
            
            // ===== 1. ACTUALIZAR TIEMPO =====
            this._updateTime(delta);
            
            // ===== 2. ACTUALIZAR CLIMA =====
            if (this.config.weatherEnabled) {
                this._updateWeather(delta);
            }
            
            // ===== 3. ACTUALIZAR ECOSISTEMAS =====
            if (this.config.ecosystemEnabled) {
                this._updateEcosystems(delta);
            }
            
            // ===== 4. ACTUALIZAR ANIMALES =====
            this._updateAnimals(delta);
            
            // ===== 5. ACTUALIZAR ÁRBOLES =====
            this._updateTrees(delta);
            
            // ===== 6. ACTUALIZAR AGUA =====
            this._updateWater(delta);
            
            // ===== 7. ACTUALIZAR PARTÍCULAS =====
            this._updateParticles(delta);
            
            // ===== 8. ACTUALIZAR EVENTOS =====
            this._updateEvents(delta);
        }
        
        // ============================================================
        //  📅 ACTUALIZAR EVENTOS DEL MUNDO
        // ============================================================
        _updateEvents(delta) {
            // Purgar eventos antiguos (más de 30s de vida)
            const now = this.state.time;
            if (this.state.events.length > 0) {
                this.state.events = this.state.events.filter(ev => (now - ev.time) < 30);
            }
            
            // Generar eventos aleatorios ocasionales (clima extremo, migraciones, etc.)
            if (Math.random() < delta * 0.01) {
                const kinds = ['migración animal', 'tormenta acercándose', 'floración', 'sequía leve'];
                this.state.events.push({
                    type: kinds[Math.floor(Math.random() * kinds.length)],
                    time: now
                });
                if (this.state.events.length > 20) {
                    this.state.events.shift();
                }
            }
        }
        
        // ============================================================
        //  ⏰ ACTUALIZAR TIEMPO
        //  ============================================================
        _updateTime(delta) {
            this.state.time += delta;
            
            // Ciclo día/noche
            const dayProgress = (this.state.time % this.config.dayLength) / this.config.dayLength;
            this.state.dayTime = dayProgress;
            
            // Estaciones
            const seasonProgress = (this.state.time % this.config.seasonLength) / this.config.seasonLength;
            this.state.season = Math.floor(seasonProgress * 4) % 4;
            
            // Temperatura según estación
            const seasonTemps = [20, 30, 15, 5]; // Primavera, Verano, Otoño, Invierno
            this.state.temperature = seasonTemps[this.state.season] + (Math.random() - 0.5) * 5;
        }
        
        // ============================================================
        //  ☁️ ACTUALIZAR CLIMA
        //  ============================================================
        _updateWeather(delta) {
            const weatherData = this.generators.weather.update(delta, this.state);
            this.state.weather = weatherData.type;
            this.state.humidity = weatherData.humidity;
            this.state.windSpeed = weatherData.windSpeed;
            
            // Aplicar efectos del clima
            if (this.state.weather === 'rainy' || this.state.weather === 'stormy') {
                // Aumentar humedad
                this.state.humidity = Math.min(1, this.state.humidity + delta * 0.01);
            } else if (this.state.weather === 'clear') {
                // Disminuir humedad lentamente
                this.state.humidity = Math.max(0, this.state.humidity - delta * 0.005);
            }
        }
        
        // ============================================================
        //  🌿 ACTUALIZAR ECOSISTEMAS
        //  ============================================================
        _updateEcosystems(delta) {
            // Regeneración de árboles
            if (this.ecosystems.entities.trees.size < this.config.maxTrees * 0.8) {
                if (Math.random() < 0.001) {
                    const pos = this._getRandomPositionInBiome('forest');
                    if (pos) {
                        const id = this.generators.entities.createTree(pos.x, pos.y, pos.z);
                        if (id !== -1) {
                            this.ecosystems.entities.trees.add(id);
                            this.behaviors.trees.set(id, {
                                growth: 0.1,
                                health: 1.0,
                                age: 0
                            });
                        }
                    }
                }
            }
            
            // Control de población animal
            const animalCount = this.ecosystems.entities.animals.size;
            if (animalCount < this.config.maxAnimals * 0.6) {
                // Reproducción
                if (Math.random() < 0.005) {
                    const pos = this._getRandomPositionInBiome('grassland');
                    if (pos) {
                        const isPredator = Math.random() < 0.2;
                        const id = this.generators.entities.createAnimal(pos.x, pos.y, pos.z, isPredator);
                        if (id !== -1) {
                            this.ecosystems.entities.animals.add(id);
                        this._animalIdsDirty = true;
                            this.behaviors.animals.set(id, {
                                state: 'wandering',
                                target: { x: pos.x, z: pos.z },
                                timer: 0,
                                speed: 0.5 + Math.random() * 0.5,
                                hunger: 0.3,
                                energy: 0.8,
                                isPredator: isPredator
                            });
                        }
                    }
                }
            } else if (animalCount > this.config.maxAnimals * 0.9) {
                // Mortalidad por sobrepoblación
                const toRemove = Array.from(this.ecosystems.entities.animals)
                    .filter(() => Math.random() < 0.001);
                
                for (const id of toRemove) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.animals.delete(id);
                    this._animalIdsDirty = true;
                    this.behaviors.animals.delete(id);
                }
            }
        }
        
        // ============================================================
        //  🐾 ACTUALIZAR ANIMALES
        //  ============================================================
        _updateAnimals(delta) {
            // Cachear la conversión Set->Array: antes se reasignaba
            // por completo CADA tick sin importar si la población cambió
            if (this._animalIdsDirty !== false) {
                this._cachedAnimalIds = Array.from(this.ecosystems.entities.animals);
                this._animalIdsDirty = false;
            }
            const ids = this._cachedAnimalIds || [];
            
            this._simTick = (this._simTick || 0) + 1;
            const camPos = this.renderer && this.renderer.camera ? this.renderer.camera.position : null;
            
            for (const id of ids) {
                const behavior = this.behaviors.animals.get(id);
                if (!behavior) continue;
                
                // ============================================================
                //  🧠 LOD DE SIMULACIÓN: animales lejos de cámara piensan
                //  menos seguido (misma lógica, menos frecuencia) — el
                //  resultado visual es indistinguible pero el costo de CPU
                //  baja mucho con cientos de animales activos a la vez
                // ============================================================
                if (camPos) {
                    const dx = this.soa.posX[id] - camPos.x;
                    const dz = this.soa.posZ[id] - camPos.z;
                    const distSq = dx * dx + dz * dz;
                    
                    if (distSq > 22500) { // > 150 unidades: piensa 1 de cada 8 ticks
                        if (this._simTick % 8 !== 0) continue;
                        behavior.timer += delta * 8; // compensar el tiempo saltado
                    } else if (distSq > 6400) { // > 80 unidades: 1 de cada 3 ticks
                        if (this._simTick % 3 !== 0) continue;
                        behavior.timer += delta * 3;
                    } else {
                        behavior.timer += delta;
                    }
                } else {
                    behavior.timer += delta;
                }
                
                switch(behavior.state) {
                    case 'wandering':
                        this._animalWander(id, behavior, delta);
                        break;
                    case 'chasing':
                        this._animalChase(id, behavior, delta);
                        break;
                    case 'fleeing':
                        this._animalFlee(id, behavior, delta);
                        break;
                    case 'eating':
                        this._animalEat(id, behavior, delta);
                        break;
                    case 'resting':
                        this._animalRest(id, behavior, delta);
                        break;
                }
                
                // Actualizar hambre y energía
                behavior.hunger += delta * 0.01;
                behavior.energy -= delta * 0.02;
                
                // Transiciones de estado
                if (behavior.hunger > 0.8) {
                    behavior.state = 'eating';
                } else if (behavior.energy < 0.3) {
                    behavior.state = 'resting';
                } else if (behavior.isPredator && behavior.hunger > 0.5) {
                    // Buscar presa
                    const prey = this._findPrey(id);
                    if (prey !== -1) {
                        behavior.state = 'chasing';
                        behavior.target = { x: this.soa.posX[prey], z: this.soa.posZ[prey] };
                    }
                } else if (!behavior.isPredator && Math.random() < 0.002) {
                    // Presa huye de depredador cercano
                    const predator = this._findPredator(id);
                    if (predator !== -1) {
                        behavior.state = 'fleeing';
                        behavior.target = { 
                            x: this.soa.posX[predator], 
                            z: this.soa.posZ[predator] 
                        };
                    }
                }
                
                // Guardar comportamiento actualizado
                this.behaviors.animals.set(id, behavior);
            }
        }
        
        _animalWander(id, behavior, delta) {
            // Moverse hacia el objetivo
            const dx = behavior.target.x - this.soa.posX[id];
            const dz = behavior.target.z - this.soa.posZ[id];
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist < 1 || behavior.timer > 3) {
                // Nuevo objetivo
                const angle = Math.random() * Math.PI * 2;
                const radius = 10 + Math.random() * this.config.animalWanderRadius;
                behavior.target = {
                    x: this.soa.posX[id] + Math.cos(angle) * radius,
                    z: this.soa.posZ[id] + Math.sin(angle) * radius
                };
                behavior.timer = 0;
            } else {
                // Moverse
                const speed = behavior.speed * this.config.animalSpeed * delta;
                this.soa.posX[id] += (dx / dist) * speed;
                this.soa.posZ[id] += (dz / dist) * speed;
                this.soa.rotY[id] = Math.atan2(dz, dx);
            }
        }
        
        _animalChase(id, behavior, delta) {
            const target = behavior.target;
            const dx = target.x - this.soa.posX[id];
            const dz = target.z - this.soa.posZ[id];
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist < 2) {
                // Atrapar presa
                behavior.hunger = 0;
                behavior.state = 'eating';
                behavior.timer = 0;
                return;
            }
            
            // Perseguir
            const speed = behavior.speed * this.config.animalSpeed * 1.5 * delta;
            this.soa.posX[id] += (dx / dist) * speed;
            this.soa.posZ[id] += (dz / dist) * speed;
            this.soa.rotY[id] = Math.atan2(dz, dx);
            
            // Si se aleja demasiado, rendirse
            if (dist > this.config.predatorChaseRange * 2) {
                behavior.state = 'wandering';
                behavior.timer = 0;
            }
        }
        
        _animalFlee(id, behavior, delta) {
            const target = behavior.target;
            const dx = this.soa.posX[id] - target.x;
            const dz = this.soa.posZ[id] - target.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist > this.config.preyFleeRange * 3) {
                behavior.state = 'wandering';
                behavior.timer = 0;
                return;
            }
            
            // Huir
            const speed = behavior.speed * this.config.animalSpeed * 1.2 * delta;
            this.soa.posX[id] += (dx / dist) * speed;
            this.soa.posZ[id] += (dz / dist) * speed;
            this.soa.rotY[id] = Math.atan2(dz, dx);
        }
        
        _animalEat(id, behavior, delta) {
            behavior.timer += delta;
            if (behavior.timer > 2) {
                behavior.hunger = Math.max(0, behavior.hunger - 0.3);
                behavior.state = 'wandering';
                behavior.timer = 0;
            }
        }
        
        _animalRest(id, behavior, delta) {
            behavior.timer += delta;
            behavior.energy += delta * 0.05;
            if (behavior.energy > 0.8 || behavior.timer > 5) {
                behavior.state = 'wandering';
                behavior.timer = 0;
            }
        }
        
        // ============================================================
        //  🌳 ACTUALIZAR ÁRBOLES
        //  ============================================================
        _updateTrees(delta) {
            const ids = Array.from(this.ecosystems.entities.trees);
            
            for (const id of ids) {
                const tree = this.behaviors.trees.get(id);
                if (!tree) continue;
                
                // Crecimiento
                tree.growth += this.config.treeGrowthRate * delta * (0.5 + this.state.humidity * 0.5);
                tree.growth = Math.min(1, tree.growth);
                
                // Edad
                tree.age += delta;
                
                // Salud según edad
                if (tree.age > 200) {
                    tree.health -= delta * 0.001;
                }
                tree.health = Math.max(0, Math.min(1, tree.health));
                
                // Si muere, desaparece
                if (tree.health <= 0) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.trees.delete(id);
                    this.behaviors.trees.delete(id);
                }
                
                // Actualizar escala según crecimiento
                const scale = 0.5 + tree.growth * 2.5;
                this.soa.scaleX[id] = scale;
                this.soa.scaleY[id] = scale;
                this.soa.scaleZ[id] = scale;
            }
        }
        
        // ============================================================
        //  💧 ACTUALIZAR AGUA
        //  ============================================================
        _updateWater(delta) {
            const ids = Array.from(this.ecosystems.entities.water);
            
            for (const id of ids) {
                const water = this.behaviors.water.get(id);
                if (!water) continue;
                
                // Evaporación
                water.level -= this.config.waterEvaporationRate * delta * (1 + this.state.temperature / 100);
                water.level = Math.max(0, water.level);
                
                // Si se seca, desaparece
                if (water.level <= 0) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.water.delete(id);
                    this.behaviors.water.delete(id);
                }
                
                // Actualizar escala
                this.soa.scaleX[id] = 1 + water.level;
                this.soa.scaleZ[id] = 1 + water.level;
            }
        }
        
        // ============================================================
        //  ✨ ACTUALIZAR PARTÍCULAS
        //  ============================================================
        _updateParticles(delta) {
            const ids = Array.from(this.ecosystems.entities.particles);
            
            for (const id of ids) {
                // Movimiento de partículas
                this.soa.posY[id] += (Math.random() - 0.5) * delta;
                this.soa.posX[id] += Math.sin(this.state.time + id) * delta * 0.2;
                this.soa.posZ[id] += Math.cos(this.state.time + id * 0.7) * delta * 0.2;
                
                // Renovar partículas fuera de rango
                if (Math.abs(this.soa.posX[id]) > this.config.worldSize / 2 ||
                    Math.abs(this.soa.posZ[id]) > this.config.worldSize / 2 ||
                    this.soa.posY[id] > 20) {
                    
                    this.soa.posX[id] = (Math.random() - 0.5) * this.config.worldSize;
                    this.soa.posZ[id] = (Math.random() - 0.5) * this.config.worldSize;
                    this.soa.posY[id] = 1 + Math.random() * 5;
                }
            }
        }
        
        // ============================================================
        //  🎯 MÉTODOS DE UTILIDAD
        //  ============================================================
        _getHeight(x, z) {
            if (this._heightMap) {
                const halfSize = this.config.worldSize / 2;
                const scale = this._heightMap.length / this.config.worldSize;
                const ix = Math.floor((x + halfSize) * scale);
                const iz = Math.floor((z + halfSize) * scale);
                
                if (ix >= 0 && ix < this._heightMap.length && 
                    iz >= 0 && iz < this._heightMap[0].length) {
                    return this._heightMap[ix][iz];
                }
            }
            return 0;
        }
        
        _getMoisture(x, z) {
            // Simular humedad basada en ruido
            const noise = Math.sin(x * 0.01) * Math.cos(z * 0.015) * 0.5 + 0.5;
            return Math.max(0, Math.min(1, noise + Math.random() * 0.1));
        }
        
        _getSlope(x, z) {
            const e = 2;
            const hL = this._getHeight(x - e, z);
            const hR = this._getHeight(x + e, z);
            const hD = this._getHeight(x, z - e);
            const hU = this._getHeight(x, z + e);
            return (Math.abs(hR - hL) + Math.abs(hU - hD)) / (e * 2);
        }
        
        _getRandomPositionInBiome(biome) {
            const maxAttempts = 100;
            const halfSize = this.config.worldSize / 2;
            
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const x = (Math.random() - 0.5) * this.config.worldSize;
                const z = (Math.random() - 0.5) * this.config.worldSize;
                const y = this._getHeight(x, z);
                
                // Verificar bioma en esta posición
                let isCorrectBiome = false;
                switch(biome) {
                    case 'forest':
                        isCorrectBiome = y > 5 && y < 20 && this._getMoisture(x, z) > 0.4 && this._getSlope(x, z) < 0.6;
                        break;
                    case 'mountain':
                        isCorrectBiome = y > 20 && this._getMoisture(x, z) > 0.3;
                        break;
                    case 'grassland':
                        isCorrectBiome = y > 2 && y < 10 && this._getMoisture(x, z) > 0.3 && this._getMoisture(x, z) < 0.7 && this._getSlope(x, z) < 0.5;
                        break;
                    case 'water':
                        isCorrectBiome = y < 2 && this._getMoisture(x, z) > 0.7;
                        break;
                    case 'desert':
                        isCorrectBiome = y > 5 && this._getMoisture(x, z) < 0.2;
                        break;
                    default:
                        isCorrectBiome = true;
                }
                
                if (isCorrectBiome) {
                    return { x, y: y + 0.5, z };
                }
            }
            
            return null;
        }
        
        _findPrey(animalId) {
            const ids = Array.from(this.ecosystems.entities.animals);
            let closest = -1;
            let closestDist = Infinity;
            
            for (const id of ids) {
                if (id === animalId) continue;
                const behavior = this.behaviors.animals.get(id);
                if (behavior && !behavior.isPredator) {
                    const dx = this.soa.posX[id] - this.soa.posX[animalId];
                    const dz = this.soa.posZ[id] - this.soa.posZ[animalId];
                    const dist = Math.sqrt(dx*dx + dz*dz);
                    
                    if (dist < this.config.predatorChaseRange && dist < closestDist) {
                        closest = id;
                        closestDist = dist;
                    }
                }
            }
            
            return closest;
        }
        
        _findPredator(animalId) {
            const ids = Array.from(this.ecosystems.entities.animals);
            let closest = -1;
            let closestDist = Infinity;
            
            for (const id of ids) {
                if (id === animalId) continue;
                const behavior = this.behaviors.animals.get(id);
                if (behavior && behavior.isPredator) {
                    const dx = this.soa.posX[id] - this.soa.posX[animalId];
                    const dz = this.soa.posZ[id] - this.soa.posZ[animalId];
                    const dist = Math.sqrt(dx*dx + dz*dz);
                    
                    if (dist < this.config.predatorChaseRange * 1.5 && dist < closestDist) {
                        closest = id;
                        closestDist = dist;
                    }
                }
            }
            
            return closest;
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return {
                entities: this.soa.count,
                trees: this.ecosystems.entities.trees.size,
                rocks: this.ecosystems.entities.rocks.size,
                animals: this.ecosystems.entities.animals.size,
                water: this.ecosystems.entities.water.size,
                particles: this.ecosystems.entities.particles.size,
                buildings: this.ecosystems.entities.buildings.size,
                time: this.state.time,
                dayTime: this.state.dayTime,
                season: this.state.season,
                temperature: this.state.temperature,
                humidity: this.state.humidity,
                weather: this.state.weather,
                windSpeed: this.state.windSpeed,
                isReady: this.state.isReady
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            // Limpiar entidades
            this.soa.reset();
            this.ecosystems.entities.trees.clear();
            this.ecosystems.entities.rocks.clear();
            this.ecosystems.entities.animals.clear();
            this.ecosystems.entities.water.clear();
            this.ecosystems.entities.particles.clear();
            this.ecosystems.entities.buildings.clear();
            
            this.behaviors.animals.clear();
            this.behaviors.trees.clear();
            this.behaviors.water.clear();
            
            // Reiniciar estado
            this.state.time = 0;
            this.state.dayTime = 0.5;
            this.state.season = 0;
            this.state.weather = 'clear';
            this.state.isReady = false;
            
            // Regenerar mundo
            this._generateWorld();
            
            console.log('🔄 GameWorld reseteado');
        }
    }
    
    // ============================================================
    //  🌤️ SISTEMA DE CLIMA
    //  ============================================================
    class WeatherSystem {
        constructor(config) {
            this.config = config;
            this.currentWeather = 'clear';
            this.transitionTime = 0;
            this.duration = 0;
            this._nextWeather();
        }
        
        update(delta, state) {
            this.transitionTime += delta;
            
            if (this.transitionTime > this.duration) {
                this._nextWeather();
            }
            
            // Calcular transición suave
            const progress = Math.min(1, this.transitionTime / this.duration);
            
            return {
                type: this.currentWeather,
                humidity: 0.2 + progress * 0.6,
                windSpeed: 2 + progress * 8,
                intensity: progress
            };
        }
        
        _nextWeather() {
            const weathers = ['clear', 'cloudy', 'rainy', 'stormy', 'snowy'];
            const weights = [0.4, 0.3, 0.15, 0.1, 0.05];
            
            let total = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * total;
            
            for (let i = 0; i < weights.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    this.currentWeather = weathers[i];
                    break;
                }
            }
            
            this.duration = 10 + Math.random() * 30;
            this.transitionTime = 0;
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.GameWorld = GameWorld;
    
    console.log('🎯 GameWorld cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GameWorld;
    }
    
})();
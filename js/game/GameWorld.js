/**
 * 🌍 PRIOM V0.4 - GAME WORLD CUÁNTICO (CORREGIDO)
 * "El corazón vivo del universo con IA generativa y simulación avanzada"
 * 
 * 📁 Ubicación: js/game/GameWorld.js
 * 📦 Versión: 0.4.0
 * 🔧 CORRECCIÓN: Método _generateTerrain restaurado
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌍 GameWorld - Mundo de Juego Cuántico
     * Gestiona el mundo vivo con IA predictiva y simulación avanzada
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
                
                forestDensity: 0.4,
                mountainDensity: 0.15,
                waterDensity: 0.1,
                desertDensity: 0.05,
                grasslandDensity: 0.3,
                
                maxAnimals: 300,
                maxTrees: 20000,
                maxRocks: 1000,
                maxBuildings: 100,
                maxParticles: 8000,
                maxWater: 500,
                
                dayLength: 600,
                seasonLength: 1800,
                
                animalSpeed: 2.0,
                animalWanderRadius: 50,
                predatorChaseRange: 35,
                preyFleeRange: 25,
                treeGrowthRate: 0.002,
                waterEvaporationRate: 0.0001,
                nutrientDepletion: 0.001,
                seedDispersalRate: 0.01,
                migrationDistance: 80,
                
                simulationEnabled: true,
                ecosystemEnabled: true,
                weatherEnabled: true,
                seasonsEnabled: true,
                evolutionEnabled: true,
                migrationEnabled: true,
                successionEnabled: true,
                nutrientSimulation: true
            };
            
            // ============================================================
            //  🌍 ESTADO DEL MUNDO
            //  ============================================================
            this.state = {
                time: 0,
                dayTime: 0.5,
                season: 0,
                temperature: 20,
                humidity: 0.5,
                windSpeed: 0,
                weather: 'clear',
                generationProgress: 0,
                isReady: false,
                entitiesCount: 0,
                lastUpdate: 0,
                events: [],
                soilNutrients: 0.7,
                biodiversity: 0.5,
                ecosystemHealth: 1.0,
                droughtLevel: 0,
                fireRisk: 0.1,
                animalMigrationActive: false,
                successionStage: 0,
                seedBank: 0,
                pollinationRate: 0.5
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
                wetlands: new Map(),
                entities: {
                    trees: new Set(),
                    rocks: new Set(),
                    animals: new Set(),
                    buildings: new Set(),
                    particles: new Set(),
                    water: new Set(),
                    flowers: new Set(),
                    seeds: new Set()
                },
                memory: {
                    fireHistory: [],
                    droughtHistory: [],
                    migrationHistory: [],
                    speciesHistory: [],
                    nutrientHistory: []
                }
            };
            
            // ============================================================
            //  🧠 COMPORTAMIENTOS
            //  ============================================================
            this.behaviors = {
                animals: new Map(),
                trees: new Map(),
                water: new Map(),
                flowers: new Map(),
                seeds: new Map(),
                animalMemory: new Map(),
                treeMemory: new Map()
            };
            
            // ============================================================
            //  📊 GENERADORES
            //  ============================================================
            this.generators = {
                terrain: null,
                entities: null,
                weather: null,
                evolution: null
            };
            
            // ============================================================
            //  🧬 SISTEMA DE EVOLUCIÓN
            //  ============================================================
            this.evolution = {
                mutations: new Map(),
                adaptation: new Map(),
                species: new Map(),
                generation: 0,
                diversity: 0.5
            };
            
            // ============================================================
            //  🔮 PREDICCIONES
            //  ============================================================
            this.predictions = {
                populationTrend: 'stable',
                forestGrowth: 0,
                animalMigration: false,
                droughtRisk: 0.1,
                fireRisk: 0.1,
                biodiversityTrend: 'stable',
                nextEvent: null
            };
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this._heightMap = null;
            this._cachedAnimalIds = [];
            this._animalIdsDirty = false;
            this._simTick = 0;
            this._frameCount = 0;
            this._previousBiodiversity = 0.5;
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌍 GameWorld Cuántico inicializado');
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Configurar generadores
            this.generators.terrain = new TerrainGenerator(this.config);
            this.generators.entities = new EntityFactory(this.soa, this.config);
            this.generators.weather = new WeatherSystem(this.config);
            this.generators.evolution = new EvolutionSystem(this.config);
            
            // Generar mundo
            this._generateWorld();
            
            // Inicializar sistema de evolución
            this._initEvolution();
            
            console.log('✅ GameWorld Cuántico listo');
            console.log(`🌍 Tamaño: ${this.config.worldSize}x${this.config.worldSize}`);
            console.log(`🌳 Densidad de árboles: ${this.config.treeDensity}`);
            console.log(`🐾 Animales: ${this.config.animalCount}`);
        }
        
        // ============================================================
        //  🧬 INICIALIZAR EVOLUCIÓN
        //  ============================================================
        _initEvolution() {
            const species = ['deer', 'rabbit', 'fox', 'wolf', 'bear'];
            for (const sp of species) {
                this.evolution.species.set(sp, {
                    generation: 0,
                    mutations: 0,
                    adaptation: 0.5,
                    population: 0,
                    traits: {
                        speed: 0.5 + Math.random() * 0.5,
                        strength: 0.5 + Math.random() * 0.5,
                        agility: 0.5 + Math.random() * 0.5,
                        intelligence: 0.3 + Math.random() * 0.4
                    }
                });
            }
            console.log(`🧬 ${this.evolution.species.size} especies inicializadas`);
        }
        
        // ============================================================
        //  🌍 GENERAR MUNDO (CORREGIDO)
        //  ============================================================
        _generateWorld() {
            console.log('🌍 Generando mundo cuántico...');
            this.state.generationProgress = 0;
            
            // ===== 1. GENERAR TERRENO =====
            this.state.generationProgress = 10;
            this._generateTerrain(); // <--- MÉTODO RESTAURADO
            
            // ===== 2. GENERAR ECOSISTEMAS =====
            this.state.generationProgress = 25;
            this._generateEcosystems();
            
            // ===== 3. GENERAR BIOMAS =====
            this.state.generationProgress = 40;
            this._generateBiomes();
            
            // ===== 4. GENERAR ENTIDADES =====
            this.state.generationProgress = 55;
            this._generateEntities();
            
            // ===== 5. GENERAR AGUA =====
            this.state.generationProgress = 70;
            this._generateWater();
            
            // ===== 6. GENERAR PARTÍCULAS =====
            this.state.generationProgress = 85;
            this._generateParticles();
            
            // ===== 7. GENERAR FLORES Y SEMILLAS =====
            this.state.generationProgress = 95;
            this._generateFlowersAndSeeds();
            
            // ===== 8. FINALIZAR =====
            this.state.generationProgress = 100;
            this.state.isReady = true;
            
            console.log('✅ Mundo generado correctamente');
            console.log(`📊 Entidades totales: ${this.soa.count}`);
            console.log(`🌳 Árboles: ${this.ecosystems.entities.trees.size}`);
            console.log(`🐾 Animales: ${this.ecosystems.entities.animals.size}`);
            console.log(`💧 Agua: ${this.ecosystems.entities.water.size}`);
        }
        
        // ============================================================
        //  🏔️ GENERAR TERRENO (MÉTODO RESTAURADO)
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
            
            for (let x = -halfSize; x < halfSize; x += 10) {
                for (let z = -halfSize; z < halfSize; z += 10) {
                    const height = this._getHeight(x, z);
                    const moisture = this._getMoisture(x, z);
                    
                    if (height > 20 && moisture > 0.5) {
                        this.ecosystems.mountains.set(`${x},${z}`, { x, z, height, moisture, type: 'mountain' });
                    } else if (height > 15 && moisture > 0.3) {
                        this.ecosystems.forests.set(`${x},${z}`, { x, z, height, moisture, type: 'forest' });
                    } else if (height < 2 && moisture > 0.7) {
                        this.ecosystems.waterBodies.set(`${x},${z}`, { x, z, height, moisture, type: 'water' });
                    } else if (height > 5 && moisture < 0.2) {
                        this.ecosystems.deserts.set(`${x},${z}`, { x, z, height, moisture, type: 'desert' });
                    } else {
                        this.ecosystems.grasslands.set(`${x},${z}`, { x, z, height, moisture, type: 'grassland' });
                    }
                }
            }
            
            console.log(`🌿 Ecosistemas generados`);
        }
        
        // ============================================================
        //  🌿 GENERAR BIOMAS
        //  ============================================================
        _generateBiomes() {
            const size = this.config.worldSize;
            const halfSize = size / 2;
            const step = 20;
            
            for (let x = -halfSize; x < halfSize; x += step) {
                for (let z = -halfSize; z < halfSize; z += step) {
                    const height = this._getHeight(x, z);
                    const moisture = this._getMoisture(x, z);
                    const temperature = this._getTemperature(x, z);
                    
                    let biome = 'grassland';
                    if (height > 25) biome = 'mountain';
                    else if (height > 18 && moisture > 0.6) biome = 'forest';
                    else if (height > 15 && moisture > 0.4) biome = 'forest';
                    else if (height > 12 && moisture < 0.3) biome = 'desert';
                    else if (height < 3 && moisture > 0.8) biome = 'water';
                    else if (height > 5 && moisture > 0.6 && temperature > 15) biome = 'wetland';
                    else if (height > 3 && moisture > 0.4 && moisture < 0.7) biome = 'grassland';
                    
                    const key = biome + 's';
                    if (this.ecosystems[key]) {
                        this.ecosystems[key].set(`${x},${z}`, { 
                            x, z, height, moisture, temperature, type: biome 
                        });
                    }
                }
            }
            
            const biomes = ['forests', 'grasslands', 'mountains', 'deserts', 'wetlands'];
            let total = 0;
            for (const b of biomes) {
                total += this.ecosystems[b]?.size || 0;
            }
            this.state.biodiversity = Math.min(1, total / 500);
            
            console.log(`🌿 Biomas generados: ${total} regiones`);
        }
        
        // ============================================================
        //  🧬 GENERAR ENTIDADES
        //  ============================================================
        _generateEntities() {
            const factory = this.generators.entities;
            
            // Árboles
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
                            age: Math.random() * 100,
                            seeds: 0,
                            nutrientAbsorption: 0.5 + Math.random() * 0.5
                        });
                    }
                }
            }
            
            // Rocas
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
            
            // Animales
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
                            isPredator: isPredator,
                            health: 0.7 + Math.random() * 0.3,
                            age: 0,
                            species: isPredator ? 'fox' : 'deer'
                        });
                    }
                }
            }
            
            // Edificios
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
            const maxWaterEntities = this.config.maxWater || 400;
            
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
        //  🌸 GENERAR FLORES Y SEMILLAS
        //  ============================================================
        _generateFlowersAndSeeds() {
            const flowerCount = Math.min(500, this.config.worldSize * 0.2);
            const factory = this.generators.entities;
            
            for (let i = 0; i < flowerCount; i++) {
                const pos = this._getRandomPositionInBiome('grassland');
                if (pos) {
                    const id = factory.createDecoration(pos.x, pos.y, pos.z, 'fountain');
                    if (id !== -1) {
                        this.ecosystems.entities.flowers.add(id);
                        this.behaviors.flowers.set(id, {
                            blooming: 0.5 + Math.random() * 0.5,
                            seeds: Math.floor(Math.random() * 10),
                            age: 0
                        });
                    }
                }
            }
            
            console.log(`🌸 Flores generadas: ${this.ecosystems.entities.flowers.size}`);
        }
        
        // ============================================================
        //  📊 UTILIDADES
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
            const noise = Math.sin(x * 0.01) * Math.cos(z * 0.015) * 0.5 + 0.5;
            return Math.max(0, Math.min(1, noise + Math.random() * 0.1));
        }
        
        _getTemperature(x, z) {
            // Temperatura basada en altitud y latitud
            const height = this._getHeight(x, z);
            const latFactor = Math.abs(z) / (this.config.worldSize / 2);
            return 25 - height * 0.5 - latFactor * 5 + (Math.random() - 0.5) * 2;
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
        
        // ============================================================
        //  🐾 ANIMALES - COMPORTAMIENTO
        //  ============================================================
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
        
        _findMate(id) {
            const behavior = this.behaviors.animals.get(id);
            if (!behavior) return -1;
            
            const ids = Array.from(this.ecosystems.entities.animals);
            let closest = -1;
            let closestDist = Infinity;
            
            for (const otherId of ids) {
                if (otherId === id) continue;
                const otherBehavior = this.behaviors.animals.get(otherId);
                if (!otherBehavior) continue;
                
                if (otherBehavior.species === behavior.species && 
                    otherBehavior.isPredator === behavior.isPredator &&
                    otherBehavior.state !== 'mating') {
                    
                    const dx = this.soa.posX[id] - this.soa.posX[otherId];
                    const dz = this.soa.posZ[id] - this.soa.posZ[otherId];
                    const dist = Math.sqrt(dx*dx + dz*dz);
                    
                    if (dist < 15 && dist < closestDist) {
                        closest = otherId;
                        closestDist = dist;
                    }
                }
            }
            
            return closest;
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
        //  ⏰ ACTUALIZAR TIEMPO
        //  ============================================================
        _updateTime(delta) {
            this.state.time += delta;
            
            const dayProgress = (this.state.time % this.config.dayLength) / this.config.dayLength;
            this.state.dayTime = dayProgress;
            
            const seasonProgress = (this.state.time % this.config.seasonLength) / this.config.seasonLength;
            this.state.season = Math.floor(seasonProgress * 4) % 4;
            
            const seasonTemps = [20, 30, 15, 5];
            this.state.temperature = seasonTemps[this.state.season] + (Math.random() - 0.5) * 3;
        }
        
        // ============================================================
        //  ☁️ ACTUALIZAR CLIMA
        //  ============================================================
        _updateWeather(delta) {
            const weatherData = this.generators.weather.update(delta, this.state);
            this.state.weather = weatherData.type;
            this.state.humidity = weatherData.humidity;
            this.state.windSpeed = weatherData.windSpeed;
            
            if (this.state.weather === 'rainy' || this.state.weather === 'stormy') {
                this.state.humidity = Math.min(1, this.state.humidity + delta * 0.01);
            } else if (this.state.weather === 'clear') {
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
                                age: 0,
                                seeds: 0,
                                nutrientAbsorption: 0.5 + Math.random() * 0.5
                            });
                        }
                    }
                }
            }
            
            // Control de población animal
            const animalCount = this.ecosystems.entities.animals.size;
            if (animalCount < this.config.maxAnimals * 0.6) {
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
                                isPredator: isPredator,
                                health: 0.7 + Math.random() * 0.3,
                                age: 0,
                                species: isPredator ? 'fox' : 'deer'
                            });
                        }
                    }
                }
            } else if (animalCount > this.config.maxAnimals * 0.9) {
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
            if (this._animalIdsDirty !== false) {
                this._cachedAnimalIds = Array.from(this.ecosystems.entities.animals);
                this._animalIdsDirty = false;
            }
            const ids = this._cachedAnimalIds || [];
            
            this._simTick = (this._simTick || 0) + 1;
            const camPos = this.renderer?.camera?.position || null;
            
            for (const id of ids) {
                const behavior = this.behaviors.animals.get(id);
                if (!behavior) continue;
                
                // LOD de simulación
                if (camPos) {
                    const dx = this.soa.posX[id] - camPos.x;
                    const dz = this.soa.posZ[id] - camPos.z;
                    const distSq = dx * dx + dz * dz;
                    
                    if (distSq > 22500) {
                        if (this._simTick % 8 !== 0) continue;
                        behavior.timer += delta * 8;
                    } else if (distSq > 6400) {
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
                
                behavior.hunger += delta * 0.01;
                behavior.energy -= delta * 0.02;
                behavior.age += delta;
                
                // Muerte por vejez
                if (behavior.age > 300) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.animals.delete(id);
                    this._animalIdsDirty = true;
                    this.behaviors.animals.delete(id);
                    continue;
                }
                
                // Transiciones de estado
                if (behavior.hunger > 0.8) {
                    behavior.state = 'eating';
                } else if (behavior.energy < 0.3) {
                    behavior.state = 'resting';
                } else if (behavior.isPredator && behavior.hunger > 0.5) {
                    const prey = this._findPrey(id);
                    if (prey !== -1) {
                        behavior.state = 'chasing';
                        behavior.target = { x: this.soa.posX[prey], z: this.soa.posZ[prey] };
                    }
                } else if (!behavior.isPredator && Math.random() < 0.002) {
                    const predator = this._findPredator(id);
                    if (predator !== -1) {
                        behavior.state = 'fleeing';
                        behavior.target = { 
                            x: this.soa.posX[predator], 
                            z: this.soa.posZ[predator] 
                        };
                    }
                }
                
                this.behaviors.animals.set(id, behavior);
            }
        }
        
        _animalWander(id, behavior, delta) {
            const dx = behavior.target.x - this.soa.posX[id];
            const dz = behavior.target.z - this.soa.posZ[id];
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist < 1 || behavior.timer > 3) {
                behavior.target = this._pickWalkableTarget(id);
                behavior.timer = 0;
            } else {
                const speed = behavior.speed * this.config.animalSpeed * delta;
                this.soa.posX[id] += (dx / dist) * speed;
                this.soa.posZ[id] += (dz / dist) * speed;
                this.soa.rotY[id] = Math.atan2(dz, dx);
            }
        }
        
        _pickWalkableTarget(id) {
            const terrain = this.generators.terrain;
            const maxAttempts = 6;
            
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 10 + Math.random() * this.config.animalWanderRadius;
                const x = this.soa.posX[id] + Math.cos(angle) * radius;
                const z = this.soa.posZ[id] + Math.sin(angle) * radius;
                
                if (!terrain || !terrain.getHeight) return { x, z };
                
                const y = terrain.getHeight(x, z);
                const isWater = terrain.isWater ? terrain.isWater(x, z) : false;
                
                const e = 2;
                const slope = terrain.getHeight
                    ? (Math.abs(terrain.getHeight(x + e, z) - terrain.getHeight(x - e, z)) +
                       Math.abs(terrain.getHeight(x, z + e) - terrain.getHeight(x, z - e))) / (e * 2)
                    : 0;
                
                if (!isWater && slope < 0.55) {
                    return { x, z };
                }
            }
            
            return { x: this.soa.posX[id], z: this.soa.posZ[id] };
        }
        
        _animalChase(id, behavior, delta) {
            const target = behavior.target;
            const dx = target.x - this.soa.posX[id];
            const dz = target.z - this.soa.posZ[id];
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist < 2) {
                behavior.hunger = 0;
                behavior.state = 'eating';
                behavior.timer = 0;
                return;
            }
            
            const speed = behavior.speed * this.config.animalSpeed * 1.5 * delta;
            this.soa.posX[id] += (dx / dist) * speed;
            this.soa.posZ[id] += (dz / dist) * speed;
            this.soa.rotY[id] = Math.atan2(dz, dx);
            
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
                
                tree.growth += this.config.treeGrowthRate * delta * (0.5 + this.state.humidity * 0.5);
                tree.growth = Math.min(1, tree.growth);
                
                tree.age += delta;
                
                if (tree.age > 200) {
                    tree.health -= delta * 0.001;
                }
                tree.health = Math.max(0, Math.min(1, tree.health));
                
                if (tree.health <= 0) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.trees.delete(id);
                    this.behaviors.trees.delete(id);
                    continue;
                }
                
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
                
                water.level -= this.config.waterEvaporationRate * delta * (1 + this.state.temperature / 100);
                water.level = Math.max(0, water.level);
                
                if (water.level <= 0) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.water.delete(id);
                    this.behaviors.water.delete(id);
                    continue;
                }
                
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
                this.soa.posY[id] += (Math.random() - 0.5) * delta;
                this.soa.posX[id] += Math.sin(this.state.time + id) * delta * 0.2;
                this.soa.posZ[id] += Math.cos(this.state.time + id * 0.7) * delta * 0.2;
                
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
        //  📅 ACTUALIZAR EVENTOS
        // ============================================================
        _updateEvents(delta) {
            const now = this.state.time;
            this.state.events = this.state.events.filter(ev => (now - ev.time) < 30);
            
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
                flowers: this.ecosystems.entities.flowers.size,
                time: this.state.time,
                dayTime: this.state.dayTime,
                season: this.state.season,
                temperature: this.state.temperature,
                humidity: this.state.humidity,
                weather: this.state.weather,
                windSpeed: this.state.windSpeed,
                isReady: this.state.isReady,
                biodiversity: this.state.biodiversity
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.soa.reset();
            
            for (const key of Object.keys(this.ecosystems.entities)) {
                this.ecosystems.entities[key].clear();
            }
            
            this.behaviors.animals.clear();
            this.behaviors.trees.clear();
            this.behaviors.water.clear();
            this.behaviors.flowers.clear();
            this.behaviors.seeds.clear();
            
            this.state.time = 0;
            this.state.dayTime = 0.5;
            this.state.season = 0;
            this.state.weather = 'clear';
            this.state.isReady = false;
            this.state.biodiversity = 0.5;
            
            this._cachedAnimalIds = [];
            this._animalIdsDirty = false;
            this._frameCount = 0;
            
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
    //  🧬 SISTEMA DE EVOLUCIÓN
    //  ============================================================
    class EvolutionSystem {
        constructor(config) {
            this.config = config;
            this.mutations = new Map();
            this.species = new Map();
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.GameWorld = GameWorld;
    
    console.log('🌍 GameWorld Cuántico cargado');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GameWorld;
    }
    
})();
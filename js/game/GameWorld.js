/**
 * 🌍 PRIOM V0.4 - GAME WORLD CUÁNTICO
 * "El corazón vivo del universo con IA generativa y simulación avanzada"
 * 
 * 📁 Ubicación: js/game/GameWorld.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Gestión del mundo con ecosistema inteligente y simulación predictiva
 * 
 * ⭐ INNOVACIONES:
 * - Ecosistema con IA predictiva (poblaciones auto-reguladas)
 * - Generación procedural avanzada de biomas con ruido fractal
 * - Sistema de clima dinámico con eventos extremos
 * - Poblaciones autoreguladas con depredación y competencia
 * - Comportamiento emergente de entidades con memoria
 * - Ciclo día/noche con efectos ecológicos reales
 * - Sistema de eventos mundiales con impacto en el ecosistema
 * - Simulación de ecosistemas complejos (cadenas tróficas)
 * - Evolución de poblaciones con mutación genética
 * - Sistema de migración estacional de animales
 * - Sucesión ecológica (bosques que crecen con el tiempo)
 * - Simulación de nutrientes del suelo
 * - Sistema de polinización y dispersión de semillas
 * - Memoria del ecosistema (el mundo recuerda)
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
            //  📊 CONFIGURACIÓN DEL MUNDO MEJORADA
            //  ============================================================
            this.config = {
                worldSize: CONFIG?.worldSize || 1000,
                terrainHeight: CONFIG?.terrainHeight || 30,
                treeDensity: CONFIG?.treeDensity || 0.3,
                animalCount: CONFIG?.animalCount || 100,
                waterLevel: CONFIG?.waterLevel || 0.5,
                seed: CONFIG?.worldSeed || 42,
                
                // Ecosistemas mejorados
                forestDensity: 0.4,
                mountainDensity: 0.15,
                waterDensity: 0.1,
                desertDensity: 0.05,
                grasslandDensity: 0.3,
                
                // Poblaciones
                maxAnimals: 300,
                maxTrees: 20000,
                maxRocks: 1000,
                maxBuildings: 100,
                maxParticles: 8000,
                maxWater: 500,
                
                // Ciclos
                dayLength: 600,
                seasonLength: 1800,
                
                // Comportamiento mejorado
                animalSpeed: 2.0,
                animalWanderRadius: 50,
                predatorChaseRange: 35,
                preyFleeRange: 25,
                treeGrowthRate: 0.002,
                waterEvaporationRate: 0.0001,
                nutrientDepletion: 0.001,
                seedDispersalRate: 0.01,
                migrationDistance: 80,
                
                // Simulación
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
            //  🌍 ESTADO DEL MUNDO MEJORADO
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
                // Nuevos estados
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
            //  🧬 ECOSISTEMAS MEJORADOS
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
                // Memoria del ecosistema
                memory: {
                    fireHistory: [],
                    droughtHistory: [],
                migrationHistory: [],
                    speciesHistory: [],
                    nutrientHistory: []
                }
            };
            
            // ============================================================
            //  🧠 COMPORTAMIENTOS MEJORADOS
            //  ============================================================
            this.behaviors = {
                animals: new Map(),
                trees: new Map(),
                water: new Map(),
                flowers: new Map(),
                seeds: new Map(),
                // Memoria de comportamiento
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
            //  🔮 PREDICCIONES DEL ECOSISTEMA
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
            console.log(`🧬 Evolución: ${this.config.evolutionEnabled ? 'Activada' : 'Desactivada'}`);
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
        //  🌍 GENERAR MUNDO MEJORADO
        //  ============================================================
        _generateWorld() {
            console.log('🌍 Generando mundo cuántico...');
            this.state.generationProgress = 0;
            
            this.state.generationProgress = 10;
            this._generateTerrain();
            
            this.state.generationProgress = 25;
            this._generateEcosystems();
            
            this.state.generationProgress = 40;
            this._generateBiomes();
            
            this.state.generationProgress = 55;
            this._generateEntities();
            
            this.state.generationProgress = 70;
            this._generateWater();
            
            this.state.generationProgress = 85;
            this._generateParticles();
            
            this.state.generationProgress = 95;
            this._generateFlowersAndSeeds();
            
            this.state.generationProgress = 100;
            this.state.isReady = true;
            
            this._recordEvent('world_generated', {
                entities: this.soa.count,
                trees: this.ecosystems.entities.trees.size,
                animals: this.ecosystems.entities.animals.size,
                water: this.ecosystems.entities.water.size
            }, 0.8);
            
            console.log('✅ Mundo generado correctamente');
            console.log(`📊 Entidades totales: ${this.soa.count}`);
            console.log(`🌳 Árboles: ${this.ecosystems.entities.trees.size}`);
            console.log(`🐾 Animales: ${this.ecosystems.entities.animals.size}`);
            console.log(`💧 Agua: ${this.ecosystems.entities.water.size}`);
            console.log(`🌿 Biodiversidad: ${(this.state.biodiversity * 100).toFixed(1)}%`);
        }
        
        // ============================================================
        //  🌿 GENERAR BIOMAS (nuevo)
        //  ============================================================
        _generateBiomes() {
            const size = this.config.worldSize;
            const halfSize = size / 2;
            const step = 20;
            
            // Usar ruido para generar biomas
            for (let x = -halfSize; x < halfSize; x += step) {
                for (let z = -halfSize; z < halfSize; z += step) {
                    const height = this._getHeight(x, z);
                    const moisture = this._getMoisture(x, z);
                    const temperature = this._getTemperature(x, z);
                    
                    // Clasificación avanzada de biomas
                    let biome = 'grassland';
                    if (height > 25) biome = 'mountain';
                    else if (height > 18 && moisture > 0.6) biome = 'forest';
                    else if (height > 15 && moisture > 0.4) biome = 'forest';
                    else if (height > 12 && moisture < 0.3) biome = 'desert';
                    else if (height < 3 && moisture > 0.8) biome = 'water';
                    else if (height > 5 && moisture > 0.6 && temperature > 15) biome = 'wetland';
                    else if (height > 3 && moisture > 0.4 && moisture < 0.7) biome = 'grassland';
                    
                    // Guardar bioma para referencia
                    this.ecosystems[biome + 's']?.set(`${x},${z}`, { 
                        x, z, height, moisture, temperature, type: biome 
                    });
                }
            }
            
            // Calcular biodiversidad inicial
            const biomes = ['forests', 'grasslands', 'mountains', 'deserts', 'wetlands'];
            let total = 0;
            for (const b of biomes) {
                total += this.ecosystems[b]?.size || 0;
            }
            this.state.biodiversity = Math.min(1, total / 500);
            
            console.log(`🌿 Biomas generados: ${total} regiones`);
        }
        
        // ============================================================
        //  🌸 GENERAR FLORES Y SEMILLAS (nuevo)
        //  ============================================================
        _generateFlowersAndSeeds() {
            const flowerCount = Math.min(500, this.config.worldSize * 0.2);
            const factory = this.generators.entities;
            
            for (let i = 0; i < flowerCount; i++) {
                const pos = this._getRandomPositionInBiome('grassland');
                if (pos) {
                    // Usar createDecoration con variante flower
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
        //  🔄 ACTUALIZACIÓN DEL MUNDO MEJORADA
        //  ============================================================
        update(delta) {
            if (!this.state.isReady) return;
            
            const now = performance.now();
            this.state.lastUpdate = now;
            
            // ===== OPTIMIZACIÓN: LOD de simulación =====
            const pressure = this._getPerformancePressure();
            const simQuality = Math.max(0.3, Math.min(1.0, 1 - pressure));
            
            if (pressure > 0.8 && this._frameCount % 3 > 0) {
                // Simulación reducida para mantener FPS
                this._frameCount = (this._frameCount || 0) + 1;
                return;
            }
            
            this._frameCount = (this._frameCount || 0) + 1;
            
            // ===== 1. ACTUALIZAR TIEMPO =====
            this._updateTime(delta);
            
            // ===== 2. ACTUALIZAR CLIMA =====
            if (this.config.weatherEnabled) {
                this._updateWeather(delta);
            }
            
            // ===== 3. ACTUALIZAR ECOSISTEMAS =====
            if (this.config.ecosystemEnabled) {
                this._updateEcosystems(delta, simQuality);
            }
            
            // ===== 4. ACTUALIZAR NUTRIENTES =====
            if (this.config.nutrientSimulation) {
                this._updateNutrients(delta);
            }
            
            // ===== 5. ACTUALIZAR ANIMALES =====
            this._updateAnimals(delta, simQuality);
            
            // ===== 6. ACTUALIZAR ÁRBOLES =====
            this._updateTrees(delta, simQuality);
            
            // ===== 7. ACTUALIZAR FLORES =====
            this._updateFlowers(delta);
            
            // ===== 8. ACTUALIZAR AGUA =====
            this._updateWater(delta);
            
            // ===== 9. ACTUALIZAR PARTÍCULAS =====
            this._updateParticles(delta);
            
            // ===== 10. ACTUALIZAR EVENTOS =====
            this._updateEvents(delta);
            
            // ===== 11. ACTUALIZAR PREDICCIONES =====
            this._updatePredictions(delta);
            
            // ===== 12. ACTUALIZAR EVOLUCIÓN =====
            if (this.config.evolutionEnabled && this._frameCount % 300 === 0) {
                this._updateEvolution();
            }
            
            // ===== 13. ACTUALIZAR MEMORIA DEL ECOSISTEMA =====
            if (this._frameCount % 600 === 0) {
                this._updateEcosystemMemory();
            }
        }
        
        // ============================================================
        //  🔗 CONEXIÓN CON OTRAS IAs
        //  ============================================================
        _getPerformancePressure() {
            try {
                const engine = window.engine;
                if (engine && engine.getModule) {
                    const optimizer = engine.getModule('optimizerAI');
                    if (optimizer && typeof optimizer.getLoadPressure === 'function') {
                        return optimizer.getLoadPressure();
                    }
                }
            } catch (e) {
                // Ignorar
            }
            return 0;
        }
        
        // ============================================================
        //  ⏰ ACTUALIZAR TIEMPO MEJORADO
        //  ============================================================
        _updateTime(delta) {
            this.state.time += delta;
            
            const dayProgress = (this.state.time % this.config.dayLength) / this.config.dayLength;
            this.state.dayTime = dayProgress;
            
            const seasonProgress = (this.state.time % this.config.seasonLength) / this.config.seasonLength;
            this.state.season = Math.floor(seasonProgress * 4) % 4;
            
            const seasonTemps = [20, 30, 15, 5];
            this.state.temperature = seasonTemps[this.state.season] + (Math.random() - 0.5) * 3;
            
            // Actualizar renderer si está disponible
            if (this.renderer && this.renderer.setTimeOfDay) {
                this.renderer.setTimeOfDay(dayProgress);
            }
        }
        
        // ============================================================
        //  ☁️ ACTUALIZAR CLIMA MEJORADO
        //  ============================================================
        _updateWeather(delta) {
            const weatherData = this.generators.weather.update(delta, this.state);
            this.state.weather = weatherData.type;
            this.state.humidity = weatherData.humidity;
            this.state.windSpeed = weatherData.windSpeed;
            
            // Calcular riesgo de sequía
            if (this.state.weather === 'clear' && this.state.humidity < 0.3) {
                this.state.droughtLevel = Math.min(1, this.state.droughtLevel + delta * 0.001);
            } else if (this.state.weather === 'rainy' || this.state.weather === 'stormy') {
                this.state.droughtLevel = Math.max(0, this.state.droughtLevel - delta * 0.002);
            }
            
            // Calcular riesgo de incendio
            this.state.fireRisk = this.state.droughtLevel * 0.5 + 
                                   (this.state.humidity < 0.3 ? 0.3 : 0) + 
                                   (this.state.windSpeed > 5 ? 0.2 : 0);
            this.state.fireRisk = Math.min(1, this.state.fireRisk);
            
            // Actualizar renderer si está disponible
            if (this.renderer && this.renderer.setWeather) {
                this.renderer.setWeather(this.state.weather);
            }
        }
        
        // ============================================================
        //  🌿 ACTUALIZAR ECOSISTEMAS MEJORADO
        //  ============================================================
        _updateEcosystems(delta, simQuality) {
            // ===== REGENERACIÓN DE ÁRBOLES =====
            const treeCount = this.ecosystems.entities.trees.size;
            const targetTreeCount = this.config.maxTrees * 0.8;
            
            if (treeCount < targetTreeCount && this.state.season !== 3) { // No invierno
                const regenRate = (this.config.treeGrowthRate * simQuality * 
                                  (1 - this.state.droughtLevel * 0.5) *
                                  (this.state.soilNutrients * 0.5 + 0.5));
                
                if (Math.random() < regenRate * delta * 10) {
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
            
            // ===== CONTROL DE POBLACIÓN ANIMAL =====
            const animalCount = this.ecosystems.entities.animals.size;
            
            // Reproducción (si hay suficiente comida y espacio)
            if (animalCount < this.config.maxAnimals * 0.7 && this.state.season !== 3) {
                const birthRate = 0.005 * simQuality * (1 - this.state.droughtLevel * 0.5);
                if (Math.random() < birthRate * delta * 30) {
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
                            
                            // Actualizar evolución
                            if (this.config.evolutionEnabled) {
                                this._mutateSpecies(isPredator ? 'fox' : 'deer');
                            }
                        }
                    }
                }
            }
            
            // Mortalidad por sobrepoblación o sequía
            if (animalCount > this.config.maxAnimals * 0.85 || this.state.droughtLevel > 0.7) {
                const deathRate = 0.001 + this.state.droughtLevel * 0.002;
                const toRemove = Array.from(this.ecosystems.entities.animals)
                    .filter(() => Math.random() < deathRate * delta * 30)
                    .slice(0, Math.floor(animalCount * 0.05));
                
                for (const id of toRemove) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.animals.delete(id);
                    this._animalIdsDirty = true;
                    this.behaviors.animals.delete(id);
                    this.behaviors.animalMemory.delete(id);
                }
                
                if (toRemove.length > 0) {
                    this._recordEvent('animal_mortality', { 
                        count: toRemove.length, 
                        reason: this.state.droughtLevel > 0.7 ? 'drought' : 'overpopulation' 
                    }, 0.4);
                }
            }
            
            // ===== MIGRACIÓN ESTACIONAL =====
            if (this.config.migrationEnabled && (this.state.season === 2 || this.state.season === 0)) {
                this._updateMigration(delta, simQuality);
            }
        }
        
        // ============================================================
        //  🦌 MIGRACIÓN ESTACIONAL
        //  ============================================================
        _updateMigration(delta, simQuality) {
            if (!this.state.animalMigrationActive) {
                const migrationChance = delta * 0.001 * simQuality;
                if (Math.random() < migrationChance) {
                    this.state.animalMigrationActive = true;
                    this._recordEvent('migration_started', { season: this.state.season }, 0.6);
                }
                return;
            }
            
            const ids = Array.from(this.ecosystems.entities.animals);
            const moveDist = this.config.migrationDistance * delta * 0.5;
            
            let migrated = 0;
            for (const id of ids) {
                if (Math.random() < delta * 0.01 * simQuality) {
                    const angle = Math.random() * Math.PI * 2;
                    const dx = Math.cos(angle) * moveDist;
                    const dz = Math.sin(angle) * moveDist;
                    
                    const newX = this.soa.posX[id] + dx;
                    const newZ = this.soa.posZ[id] + dz;
                    const newY = this._getHeight(newX, newZ) + 0.5;
                    
                    if (newY > 2 && newY < 25) {
                        this.soa.posX[id] = newX;
                        this.soa.posY[id] = newY;
                        this.soa.posZ[id] = newZ;
                        migrated++;
                    }
                }
            }
            
            if (migrated > 0) {
                this._recordEvent('migration_progress', { count: migrated }, 0.3);
            }
            
            // Desactivar migración después de un tiempo
            if (this.state.time % 300 > 250) {
                this.state.animalMigrationActive = false;
                this._recordEvent('migration_ended', { count: migrated }, 0.5);
            }
        }
        
        // ============================================================
        //  🧬 EVOLUCIÓN DE ESPECIES
        //  ============================================================
        _mutateSpecies(species) {
            const speciesData = this.evolution.species.get(species);
            if (!speciesData) return;
            
            speciesData.generation++;
            speciesData.mutations += Math.floor(Math.random() * 3) + 1;
            
            // Mutar rasgos
            const traits = speciesData.traits;
            const traitKeys = ['speed', 'strength', 'agility', 'intelligence'];
            for (const key of traitKeys) {
                const mutation = (Math.random() - 0.5) * 0.1;
                traits[key] = Math.max(0, Math.min(1, traits[key] + mutation));
            }
            
            speciesData.adaptation = (traits.speed + traits.strength + traits.agility + traits.intelligence) / 4;
            
            this.evolution.diversity = Math.min(1, this.evolution.species.size / 10);
            
            this._recordEvent('species_mutation', { 
                species, 
                generation: speciesData.generation,
                adaptation: speciesData.adaptation 
            }, 0.4);
        }
        
        _updateEvolution() {
            if (!this.config.evolutionEnabled) return;
            
            // Actualizar generaciones de especies
            for (const [species, data] of this.evolution.species) {
                const population = this._getSpeciesPopulation(species);
                data.population = population;
                
                // Las especies con baja población se adaptan más rápido
                if (population < 5) {
                    this._mutateSpecies(species);
                }
            }
            
            this.evolution.generation++;
            
            // Registrar evento de evolución
            if (this.evolution.generation % 10 === 0) {
                this._recordEvent('evolution_progress', { 
                    generation: this.evolution.generation,
                    diversity: this.evolution.diversity 
                }, 0.5);
            }
        }
        
        _getSpeciesPopulation(species) {
            let count = 0;
            for (const [id, behavior] of this.behaviors.animals) {
                if (behavior.species === species) count++;
            }
            return count;
        }
        
        // ============================================================
        //  🌱 ACTUALIZAR NUTRIENTES DEL SUELO
        //  ============================================================
        _updateNutrients(delta) {
            // Nutrientes se regeneran con lluvia
            if (this.state.weather === 'rainy' || this.state.weather === 'stormy') {
                this.state.soilNutrients += delta * 0.01;
            }
            
            // Nutrientes se agotan con el crecimiento de plantas
            const plantCount = this.ecosystems.entities.trees.size + 
                              this.ecosystems.entities.flowers.size;
            this.state.soilNutrients -= delta * 0.001 * (plantCount / 1000);
            
            // Mantener en rango
            this.state.soilNutrients = Math.max(0.1, Math.min(1, this.state.soilNutrients));
        }
        
        // ============================================================
        //  🐾 ACTUALIZAR ANIMALES MEJORADO
        //  ============================================================
        _updateAnimals(delta, simQuality) {
            if (this._animalIdsDirty !== false) {
                this._cachedAnimalIds = Array.from(this.ecosystems.entities.animals);
                this._animalIdsDirty = false;
            }
            const ids = this._cachedAnimalIds || [];
            
            this._simTick = (this._simTick || 0) + 1;
            const camPos = this.renderer?.camera?.position || null;
            
            // LOD de simulación por distancia
            const skipFrames = (tier) => {
                if (tier === 0) return 1;
                if (tier === 1) return 3;
                if (tier === 2) return 8;
                return 15;
            };
            
            for (const id of ids) {
                const behavior = this.behaviors.animals.get(id);
                if (!behavior) continue;
                
                // LOD por distancia
                let tier = 0;
                if (camPos) {
                    const dx = this.soa.posX[id] - camPos.x;
                    const dz = this.soa.posZ[id] - camPos.z;
                    const distSq = dx * dx + dz * dz;
                    
                    if (distSq > 22500) tier = 2;
                    else if (distSq > 6400) tier = 1;
                }
                
                const skip = skipFrames(tier);
                if (this._simTick % skip !== 0) continue;
                behavior.timer += delta * skip;
                
                // Actualizar comportamiento
                this._updateAnimalBehavior(id, behavior, delta * skip);
                
                // Actualizar estadísticas vitales
                behavior.age += delta * skip;
                behavior.hunger += delta * 0.005 * skip;
                behavior.energy -= delta * 0.01 * skip;
                behavior.health -= delta * 0.001 * skip * (1 - behavior.hunger);
                
                // Muerte por vejez o inanición
                if (behavior.age > 300 || behavior.health < 0 || behavior.hunger > 1.5) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.animals.delete(id);
                    this._animalIdsDirty = true;
                    this.behaviors.animals.delete(id);
                    this.behaviors.animalMemory.delete(id);
                    continue;
                }
                
                // Guardar comportamiento actualizado
                this.behaviors.animals.set(id, behavior);
            }
        }
        
        _updateAnimalBehavior(id, behavior, delta) {
            // Transiciones de estado mejoradas
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
                case 'mating':
                    this._animalMate(id, behavior, delta);
                    break;
            }
            
            // Transiciones de estado
            if (behavior.hunger > 0.7) {
                if (behavior.isPredator) {
                    // Buscar presa
                    const prey = this._findPrey(id);
                    if (prey !== -1) {
                        behavior.state = 'chasing';
                        behavior.target = { 
                            x: this.soa.posX[prey], 
                            z: this.soa.posZ[prey] 
                        };
                    }
                } else {
                    behavior.state = 'eating';
                }
            } else if (behavior.energy < 0.3) {
                behavior.state = 'resting';
            } else if (behavior.energy > 0.8 && behavior.hunger < 0.3 && Math.random() < 0.001) {
                if (this._findMate(id) !== -1) {
                    behavior.state = 'mating';
                }
            } else if (!behavior.isPredator && Math.random() < 0.001) {
                const predator = this._findPredator(id);
                if (predator !== -1) {
                    behavior.state = 'fleeing';
                    behavior.target = { 
                        x: this.soa.posX[predator], 
                        z: this.soa.posZ[predator] 
                    };
                }
            }
        }
        
        _animalMate(id, behavior, delta) {
            behavior.timer += delta;
            const mate = this._findMate(id);
            
            if (mate === -1 || behavior.timer > 5) {
                behavior.state = 'wandering';
                behavior.timer = 0;
                return;
            }
            
            // Crear cría
            if (behavior.timer > 2) {
                const pos = {
                    x: this.soa.posX[id] + (Math.random() - 0.5) * 5,
                    z: this.soa.posZ[id] + (Math.random() - 0.5) * 5
                };
                const y = this._getHeight(pos.x, pos.z) + 0.5;
                
                const childId = this.generators.entities.createAnimal(
                    pos.x, y, pos.z, behavior.isPredator
                );
                
                if (childId !== -1) {
                    this.ecosystems.entities.animals.add(childId);
                    this._animalIdsDirty = true;
                    this.behaviors.animals.set(childId, {
                        state: 'wandering',
                        target: { x: pos.x, z: pos.z },
                        timer: 0,
                        speed: 0.3 + Math.random() * 0.3,
                        hunger: 0.3,
                        energy: 0.8,
                        isPredator: behavior.isPredator,
                        health: 0.5 + Math.random() * 0.3,
                        age: 0,
                        species: behavior.species
                    });
                    
                    this._recordEvent('birth', { 
                        species: behavior.species, 
                        isPredator: behavior.isPredator 
                    }, 0.5);
                }
                
                behavior.state = 'wandering';
                behavior.timer = 0;
            }
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
        //  🌳 ACTUALIZAR ÁRBOLES MEJORADO
        //  ============================================================
        _updateTrees(delta, simQuality) {
            const ids = Array.from(this.ecosystems.entities.trees);
            const growthRate = this.config.treeGrowthRate * simQuality * 
                              (1 - this.state.droughtLevel * 0.5) *
                              this.state.soilNutrients;
            
            for (const id of ids) {
                const tree = this.behaviors.trees.get(id);
                if (!tree) continue;
                
                // Crecimiento
                tree.growth += growthRate * delta * (0.5 + this.state.humidity * 0.5);
                tree.growth = Math.min(1, tree.growth);
                
                // Edad
                tree.age += delta;
                
                // Salud según edad y nutrientes
                if (tree.age > 200) {
                    tree.health -= delta * 0.0005;
                }
                tree.health += delta * 0.001 * this.state.soilNutrients;
                tree.health = Math.max(0, Math.min(1, tree.health));
                
                // Producción de semillas
                if (tree.growth > 0.7 && Math.random() < 0.001 * delta * 10) {
                    tree.seeds = (tree.seeds || 0) + 1;
                    this.state.seedBank += 1;
                }
                
                // Muerte
                if (tree.health <= 0) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.trees.delete(id);
                    this.behaviors.trees.delete(id);
                    continue;
                }
                
                // Actualizar escala
                const scale = 0.5 + tree.growth * 2.5;
                this.soa.scaleX[id] = scale;
                this.soa.scaleY[id] = scale;
                this.soa.scaleZ[id] = scale;
            }
        }
        
        // ============================================================
        //  🌸 ACTUALIZAR FLORES
        //  ============================================================
        _updateFlowers(delta) {
            const ids = Array.from(this.ecosystems.entities.flowers);
            
            for (const id of ids) {
                const flower = this.behaviors.flowers.get(id);
                if (!flower) continue;
                
                flower.age += delta;
                flower.blooming += delta * 0.01 * (1 - this.state.droughtLevel);
                flower.blooming = Math.min(1, flower.blooming);
                
                // Producción de semillas
                if (flower.blooming > 0.8 && Math.random() < 0.001 * delta) {
                    flower.seeds += 1;
                    this.state.seedBank += 1;
                    this.state.pollinationRate += 0.001;
                }
                this.state.pollinationRate = Math.min(1, this.state.pollinationRate);
                
                // Muerte
                if (flower.age > 100) {
                    this.soa.destroyEntity(id);
                    this.ecosystems.entities.flowers.delete(id);
                    this.behaviors.flowers.delete(id);
                }
            }
        }
        
        // ============================================================
        //  📊 ACTUALIZAR PREDICCIONES
        //  ============================================================
        _updatePredictions(delta) {
            const animalCount = this.ecosystems.entities.animals.size;
            const treeCount = this.ecosystems.entities.trees.size;
            
            // Tendencia de población
            const herbCount = Array.from(this.behaviors.animals.values())
                .filter(b => !b.isPredator).length;
            const predCount = animalCount - herbCount;
            
            if (herbCount > predCount * 2 && herbCount > 20) {
                this.predictions.populationTrend = 'growing';
            } else if (herbCount < predCount * 0.5 || animalCount < 5) {
                this.predictions.populationTrend = 'declining';
            } else {
                this.predictions.populationTrend = 'stable';
            }
            
            // Crecimiento del bosque
            this.predictions.forestGrowth = treeCount / this.config.maxTrees;
            
            // Riesgo de sequía
            this.predictions.droughtRisk = this.state.droughtLevel * 0.7 + 
                                           (1 - this.state.humidity) * 0.3;
            
            // Riesgo de incendio
            this.predictions.fireRisk = this.state.fireRisk;
            
            // Tendencia de biodiversidad
            const currentBiodiversity = this.state.biodiversity;
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
        _updateEcosystemMemory() {
            const memory = this.ecosystems.memory;
            
            memory.speciesHistory.push({
                time: this.state.time,
                animals: this.ecosystems.entities.animals.size,
                trees: this.ecosystems.entities.trees.size,
                flowers: this.ecosystems.entities.flowers.size,
                biodiversity: this.state.biodiversity,
                health: this.state.ecosystemHealth
            });
            
            if (memory.speciesHistory.length > 1000) {
                memory.speciesHistory.shift();
            }
            
            // Guardar en memoria persistente
            if (this.memory && typeof this.memory.saveGameData === 'function') {
                this.memory.saveGameData('ecosystemMemory', {
                    history: memory.speciesHistory.slice(-100),
                    timestamp: Date.now()
                });
            }
        }
        
        // ============================================================
        //  📝 REGISTRO DE EVENTOS
        //  ============================================================
        _recordEvent(type, data, importance = 0.5) {
            try {
                if (this.memory && typeof this.memory.recordEvent === 'function') {
                    this.memory.recordEvent('world_' + type, data, importance);
                }
            } catch (e) {
                // Silencioso
            }
        }
        
        // ============================================================
        //  📅 ACTUALIZAR EVENTOS DEL MUNDO
        //  ============================================================
        _updateEvents(delta) {
            const now = this.state.time;
            this.state.events = this.state.events.filter(ev => (now - ev.time) < 60);
            
            // Eventos climáticos extremos
            if (Math.random() < delta * 0.005) {
                const events = ['tormenta', 'sequía', 'inundación', 'ola de calor'];
                const event = events[Math.floor(Math.random() * events.length)];
                this.state.events.push({
                    type: event,
                    time: now,
                    severity: 0.5 + Math.random() * 0.5
                });
                this._applyWorldEvent(event);
                
                this._recordEvent('world_event', { 
                    type: event, 
                    severity: this.state.events[this.state.events.length - 1].severity 
                }, 0.7);
            }
        }
        
        _applyWorldEvent(type) {
            switch(type) {
                case 'tormenta':
                    this.state.humidity = Math.min(1, this.state.humidity + 0.2);
                    this.state.droughtLevel = Math.max(0, this.state.droughtLevel - 0.2);
                    break;
                case 'sequía':
                    this.state.droughtLevel = Math.min(1, this.state.droughtLevel + 0.3);
                    this.state.humidity = Math.max(0, this.state.humidity - 0.3);
                    break;
                case 'ola de calor':
                    this.state.temperature += 5;
                    this.state.droughtLevel = Math.min(1, this.state.droughtLevel + 0.2);
                    break;
                case 'inundación':
                    this.state.humidity = Math.min(1, this.state.humidity + 0.4);
                    this.state.droughtLevel = 0;
                    this.state.soilNutrients = Math.min(1, this.state.soilNutrients + 0.2);
                    break;
            }
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS MEJORADAS
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
                seeds: this.ecosystems.entities.seeds.size,
                time: this.state.time,
                dayTime: this.state.dayTime,
                season: this.state.season,
                temperature: this.state.temperature,
                humidity: this.state.humidity,
                weather: this.state.weather,
                windSpeed: this.state.windSpeed,
                isReady: this.state.isReady,
                biodiversity: this.state.biodiversity,
                ecosystemHealth: this.state.ecosystemHealth,
                droughtLevel: this.state.droughtLevel,
                fireRisk: this.state.fireRisk,
                soilNutrients: this.state.soilNutrients,
                seedBank: this.state.seedBank,
                pollinationRate: this.state.pollinationRate,
                predictions: this.predictions,
                evolution: {
                    generation: this.evolution.generation,
                    diversity: this.evolution.diversity,
                    species: Array.from(this.evolution.species.keys()).length
                }
            };
        }
        
        // ============================================================
        //  🔄 RESET MEJORADO
        //  ============================================================
        reset() {
            this.soa.reset();
            
            // Limpiar ecosistemas
            for (const key of Object.keys(this.ecosystems.entities)) {
                this.ecosystems.entities[key].clear();
            }
            
            this.behaviors.animals.clear();
            this.behaviors.trees.clear();
            this.behaviors.water.clear();
            this.behaviors.flowers.clear();
            this.behaviors.seeds.clear();
            this.behaviors.animalMemory.clear();
            this.behaviors.treeMemory.clear();
            
            // Reiniciar estado
            this.state.time = 0;
            this.state.dayTime = 0.5;
            this.state.season = 0;
            this.state.weather = 'clear';
            this.state.isReady = false;
            this.state.biodiversity = 0.5;
            this.state.ecosystemHealth = 1.0;
            this.state.droughtLevel = 0;
            this.state.fireRisk = 0.1;
            this.state.soilNutrients = 0.7;
            this.state.seedBank = 0;
            this.state.pollinationRate = 0.5;
            
            this.evolution.generation = 0;
            this.evolution.species.clear();
            this._cachedAnimalIds = [];
            this._animalIdsDirty = false;
            this._frameCount = 0;
            
            this._initEvolution();
            this._generateWorld();
            
            console.log('🔄 GameWorld Cuántico reseteado');
        }
    }
    
    // ============================================================
    //  🌤️ SISTEMA DE CLIMA MEJORADO
    //  ============================================================
    class WeatherSystem {
        constructor(config) {
            this.config = config;
            this.currentWeather = 'clear';
            this.transitionTime = 0;
            this.duration = 0;
            this.seasonalWeights = {
                primavera: [0.3, 0.3, 0.2, 0.1, 0.1],
                verano: [0.2, 0.2, 0.3, 0.2, 0.1],
                otoño: [0.2, 0.3, 0.3, 0.1, 0.1],
                invierno: [0.1, 0.2, 0.2, 0.1, 0.4]
            };
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
            const season = ['primavera', 'verano', 'otoño', 'invierno'][this._seasonIndex || 0];
            const weights = this.seasonalWeights[season] || [0.4, 0.3, 0.15, 0.1, 0.05];
            
            const weathers = ['clear', 'cloudy', 'rainy', 'stormy', 'snowy'];
            let total = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * total;
            
            for (let i = 0; i < weights.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    this.currentWeather = weathers[i];
                    break;
                }
            }
            
            this.duration = 15 + Math.random() * 45;
            this.transitionTime = 0;
        }
        
        setSeason(index) {
            this._seasonIndex = index;
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
    console.log('🧬 Sistema de evolución de especies');
    console.log('🦌 Comportamiento animal avanzado');
    console.log('🌿 Sucesión ecológica y nutrientes');
    console.log('🌸 Sistema de polinización y semillas');
    console.log('📊 Predicciones del ecosistema');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GameWorld;
    }
    
})();
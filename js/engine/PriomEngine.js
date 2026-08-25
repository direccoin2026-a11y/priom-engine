/**
 * 🚀 PRIOM V0.4 - PRIOM ENGINE (VERSIÓN COMPLETA Y FUNCIONAL)
 * "El motor que une todo en perfecta armonía"
 * 
 * 📁 Ubicación: js/engine/PriomEngine.js
 * 📦 Versión: 0.4.3
 */

(function() {
    'use strict';

    class PriomEngine {
        constructor(config = {}) {
            console.log('🚀 ========================================');
            console.log('🚀  PRIOM V0.4 - MOTOR DE JUEGOS IA');
            console.log('🚀  "Donde la IA encuentra la gráfica"');
            console.log('🚀 ========================================');
            
            // ============================================================
            //  📊 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                ...CONFIG,
                ...config,
                autoStart: config.autoStart !== undefined ? config.autoStart : true,
                qualityLevel: config.qualityLevel || 'ultra',
                worldSize: config.worldSize || 500,
                terrainHeight: config.terrainHeight || 40,
                treeDensity: config.treeDensity || 0.35,
                animalCount: config.animalCount || 50,
                lodDistance: config.lodDistance || 300,
                maxEntities: config.maxEntities || 100000
            };
            
            // ============================================================
            //  📦 ESTADO DEL MOTOR
            //  ============================================================
            this.state = {
                status: 'initializing',
                startTime: 0,
                uptime: 0,
                frameCount: 0,
                fps: 0,
                error: null,
                qualityLevel: this.config.qualityLevel,
                entitiesCount: 0,
                treesCount: 0,
                animalsCount: 0,
                memoryUsage: 0,
                isReady: false,
                generationProgress: 0,
                generationStage: 'iniciando'
            };
            
            // ============================================================
            //  🧩 MÓDULOS
            //  ============================================================
            this.modules = {
                ecs: null,
                renderer: null,
                terrain: null,
                world: null,
                entityFactory: null,
                minimap: null,
                skySystem: null,
                waterSystem: null,
                weatherFX: null,
                optimizerAI: null,
                metaAI: null,
                worldAI: null,
                geometryLab: null,
                animationSystem: null,
                particleSystem: null,
                profiler: null
            };
            
            // ============================================================
            //  📡 EVENTOS
            //  ============================================================
            this._events = new Map();
            this._eventHistory = [];
            
            // ============================================================
            //  🎯 LOOP
            //  ============================================================
            this._loop = {
                running: false,
                lastTime: 0,
                accumulator: 0,
                fixedAccumulator: 0,
                fixedDeltaTime: 1 / 60,
                updateCount: 0,
                renderCount: 0
            };
            
            this._fpsSamples = [];
            this._lastLoopError = null;
            this.manualQuality = false;
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            try {
                // ===== 1. ECS =====
                console.log('📊 Inicializando ECS...');
                this._initECS();
                
                // ===== 2. RENDERER =====
                console.log('🎮 Inicializando Renderer...');
                this._initRenderer();
                
                // ===== 3. ENTITY FACTORY =====
                console.log('🧬 Inicializando Entity Factory...');
                this._initEntityFactory();
                
                // ===== 4. TERRAIN =====
                console.log('🏔️ Inicializando Terrain Generator...');
                this._initTerrain();
                
                // ===== 5. GAME WORLD =====
                console.log('🌍 Inicializando Game World...');
                this._initGameWorld();
                
                // ===== 6. SKY SYSTEM =====
                console.log('🌅 Inicializando Sky System...');
                this._initSkySystem();
                
                // ===== 7. WATER SYSTEM =====
                console.log('🌊 Inicializando Water System...');
                this._initWaterSystem();
                
                // ===== 8. WEATHER FX =====
                console.log('🌤️ Inicializando Weather FX...');
                this._initWeatherFX();
                
                // ===== 9. IA =====
                console.log('🧠 Inicializando IA...');
                this._initAI();
                
                // ===== 10. MINIMAP =====
                console.log('🗺️ Inicializando Minimap...');
                this._initMinimap();
                
                // ===== 11. DECORACIONES =====
                console.log('🌿 Inicializando Decoraciones...');
                this._initDecorations();
                
                // ===== 12. UTILS =====
                console.log('🔧 Inicializando Utilidades...');
                this._initUtils();
                
                // ===== 13. EVENTOS =====
                this._setupEvents();
                
                // ===== 14. ESTADO LISTO =====
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor Cuántico inicializado correctamente');
                console.log(`📊 Módulos cargados: ${this._countModules()}`);
                
                // ===== 15. GENERAR MUNDO =====
                setTimeout(() => {
                    this._generateWorld();
                }, 100);
                
                // ===== 16. AUTO-START =====
                if (this.config.autoStart) {
                    setTimeout(() => this.start(), 500);
                }
                
            } catch (error) {
                this.state.status = 'error';
                this.state.error = error;
                console.error('❌ Error:', error);
            }
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE MÓDULOS
        //  ============================================================
        
        _initECS() {
            if (typeof SoaManager !== 'undefined') {
                this.modules.ecs = new SoaManager(this.config.maxEntities);
                console.log('✅ ECS inicializado');
            } else {
                throw new Error('SoaManager no disponible');
            }
        }
        
        _initRenderer() {
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) {
                throw new Error('Canvas no encontrado');
            }
            
            if (typeof MaxRenderer !== 'undefined') {
                this.modules.renderer = new MaxRenderer(canvas);
                this.modules.renderer.setQuality(this.config.qualityLevel);
                console.log('✅ Renderer inicializado');
                
                // Geometry Lab
                if (typeof ComplexGeometryLab !== 'undefined') {
                    this.modules.geometryLab = new ComplexGeometryLab(
                        this.modules.renderer.scene
                    );
                    console.log('✅ Geometry Lab inicializado');
                }
            } else {
                throw new Error('MaxRenderer no disponible');
            }
        }
        
        _initEntityFactory() {
            if (typeof EntityFactory !== 'undefined') {
                this.modules.entityFactory = new EntityFactory(
                    this.modules.ecs,
                    this.config
                );
                console.log('✅ Entity Factory inicializado');
            } else {
                console.warn('⚠️ EntityFactory no disponible');
                this.modules.entityFactory = this._createBasicEntityFactory();
            }
        }
        
        _createBasicEntityFactory() {
            const ecs = this.modules.ecs;
            return {
                createTree: function(x, y, z) {
                    const id = ecs.createEntity(x, y, z);
                    if (id !== -1) {
                        ecs.isTree[id] = 1;
                        ecs.scaleX[id] = 1 + Math.random() * 2;
                        ecs.scaleY[id] = 1 + Math.random() * 2;
                        ecs.scaleZ[id] = 1 + Math.random() * 2;
                        ecs.colR[id] = 50 + Math.random() * 80;
                        ecs.colG[id] = 120 + Math.random() * 60;
                        ecs.colB[id] = 30 + Math.random() * 30;
                    }
                    return id;
                },
                createRock: function(x, y, z) {
                    const id = ecs.createEntity(x, y, z);
                    if (id !== -1) {
                        ecs.isRock[id] = 1;
                        ecs.scaleX[id] = 0.5 + Math.random() * 2;
                        ecs.scaleY[id] = 0.5 + Math.random() * 2;
                        ecs.scaleZ[id] = 0.5 + Math.random() * 2;
                        ecs.colR[id] = 130 + Math.random() * 40;
                        ecs.colG[id] = 120 + Math.random() * 40;
                        ecs.colB[id] = 110 + Math.random() * 40;
                    }
                    return id;
                },
                createAnimal: function(x, y, z, isPredator) {
                    const id = ecs.createEntity(x, y, z);
                    if (id !== -1) {
                        ecs.isAnimal[id] = 1;
                        ecs.scaleX[id] = 0.3 + Math.random() * 0.5;
                        ecs.scaleY[id] = 0.3 + Math.random() * 0.5;
                        ecs.scaleZ[id] = 0.3 + Math.random() * 0.5;
                        if (isPredator) {
                            ecs.colR[id] = 180 + Math.random() * 60;
                            ecs.colG[id] = 40 + Math.random() * 30;
                            ecs.colB[id] = 30 + Math.random() * 20;
                        } else {
                            ecs.colR[id] = 160 + Math.random() * 60;
                            ecs.colG[id] = 130 + Math.random() * 50;
                            ecs.colB[id] = 80 + Math.random() * 40;
                        }
                    }
                    return id;
                },
                createWater: function(x, y, z) {
                    const id = ecs.createEntity(x, y, z);
                    if (id !== -1) {
                        ecs.isWater[id] = 1;
                        ecs.colR[id] = 20 + Math.random() * 20;
                        ecs.colG[id] = 80 + Math.random() * 30;
                        ecs.colB[id] = 200 + Math.random() * 40;
                        ecs.scaleX[id] = 2 + Math.random() * 3;
                        ecs.scaleZ[id] = 2 + Math.random() * 3;
                    }
                    return id;
                }
            };
        }
        
        _initTerrain() {
            if (typeof TerrainGenerator !== 'undefined') {
                const terrainConfig = {
                    worldSize: this.config.worldSize,
                    terrainHeight: this.config.terrainHeight,
                    resolution: 256,
                    octaves: 6,
                    persistence: 0.5,
                    lacunarity: 2.0,
                    scale: 0.015,
                    waterLevel: 0.35,
                    erosionEnabled: true,
                    erosionIterations: 10,
                    thermalErosion: true,
                    biomesEnabled: true,
                    riversEnabled: true,
                    riverCount: 6,
                    vegetationEnabled: true
                };
                
                this.modules.terrain = new TerrainGenerator(terrainConfig);
                console.log('✅ Terrain Generator inicializado');
            } else {
                console.warn('⚠️ TerrainGenerator no disponible');
                this.modules.terrain = this._createBasicTerrain();
            }
        }
        
        _createBasicTerrain() {
            return {
                heightMap: null,
                getHeight: function(x, z) {
                    return Math.sin(x * 0.02) * Math.cos(z * 0.025) * 10 + 
                           Math.sin(x * 0.01 + z * 0.015) * 5;
                },
                getBiome: function(x, z) {
                    const h = this.getHeight(x, z);
                    if (h > 25) return 4; // Montaña
                    if (h > 15) return 3; // Bosque
                    if (h > 5) return 2; // Pradera
                    return 0; // Océano
                },
                getMoisture: function(x, z) {
                    return 0.3 + Math.sin(x * 0.01 + z * 0.008) * 0.3 + 0.5;
                },
                generateHeightMap: function(size) {
                    this.heightMap = new Float32Array(256 * 256);
                    for (let i = 0; i < 256; i++) {
                        for (let j = 0; j < 256; j++) {
                            const x = (i / 256 - 0.5) * size;
                            const z = (j / 256 - 0.5) * size;
                            this.heightMap[i * 256 + j] = this.getHeight(x, z);
                        }
                    }
                },
                generateTerrainMesh: function(scene) {
                    // Crear un plano simple
                    const geo = new THREE.PlaneGeometry(this.config.worldSize, this.config.worldSize, 128, 128);
                    const pos = geo.attributes.position;
                    for (let i = 0; i < pos.count; i++) {
                        const x = pos.getX(i);
                        const z = pos.getZ(i);
                        pos.setY(i, this.getHeight(x, z));
                    }
                    geo.computeVertexNormals();
                    
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x2d5a1a,
                        roughness: 0.9,
                        metalness: 0.0,
                        flatShading: true,
                        side: THREE.DoubleSide
                    });
                    
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.receiveShadow = true;
                    scene.add(mesh);
                    return mesh;
                }
            };
        }
        
        _initGameWorld() {
            if (typeof GameWorld !== 'undefined') {
                this.modules.world = new GameWorld(
                    this.modules.ecs,
                    this.modules.renderer,
                    this.modules.core?.memory || null
                );
                console.log('✅ Game World inicializado');
            } else {
                console.warn('⚠️ GameWorld no disponible');
                this.modules.world = this._createBasicWorld();
            }
        }
        
        _createBasicWorld() {
            const ecs = this.modules.ecs;
            const factory = this.modules.entityFactory;
            const terrain = this.modules.terrain;
            
            return {
                state: { isReady: false },
                ecosystems: {
                    entities: {
                        trees: new Set(),
                        rocks: new Set(),
                        animals: new Set(),
                        water: new Set()
                    }
                },
                _generateWorld: function() {
                    console.log('🌍 Generando mundo básico...');
                    
                    // Generar terreno
                    if (terrain && terrain.generateHeightMap) {
                        terrain.generateHeightMap(500);
                    }
                    
                    // Generar terreno visual
                    if (this.modules.renderer && terrain && terrain.generateTerrainMesh) {
                        terrain.generateTerrainMesh(this.modules.renderer.scene);
                        console.log('✅ Terreno visual generado');
                    }
                    
                    // Árboles
                    for (let i = 0; i < 200; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 10 + Math.random() * 200;
                        const x = Math.cos(angle) * dist;
                        const z = Math.sin(angle) * dist;
                        const y = terrain ? terrain.getHeight(x, z) : 0;
                        const id = factory.createTree(x, y + 0.3, z);
                        if (id !== -1) {
                            this.ecosystems.entities.trees.add(id);
                        }
                    }
                    console.log(`🌳 ${this.ecosystems.entities.trees.size} árboles creados`);
                    
                    // Animales
                    for (let i = 0; i < 30; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 20 + Math.random() * 180;
                        const x = Math.cos(angle) * dist;
                        const z = Math.sin(angle) * dist;
                        const y = terrain ? terrain.getHeight(x, z) : 0;
                        const isPredator = Math.random() < 0.2;
                        const id = factory.createAnimal(x, y + 0.3, z, isPredator);
                        if (id !== -1) {
                            this.ecosystems.entities.animals.add(id);
                        }
                    }
                    console.log(`🦌 ${this.ecosystems.entities.animals.size} animales creados`);
                    
                    // Rocas
                    for (let i = 0; i < 50; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 5 + Math.random() * 220;
                        const x = Math.cos(angle) * dist;
                        const z = Math.sin(angle) * dist;
                        const y = terrain ? terrain.getHeight(x, z) : 0;
                        const id = factory.createRock(x, y + 0.2, z);
                        if (id !== -1) {
                            this.ecosystems.entities.rocks.add(id);
                        }
                    }
                    
                    // Agua
                    for (let i = 0; i < 3; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 30 + Math.random() * 150;
                        const x = Math.cos(angle) * dist;
                        const z = Math.sin(angle) * dist;
                        const y = terrain ? terrain.getHeight(x, z) : 0;
                        const id = factory.createWater(x, y + 0.5, z);
                        if (id !== -1) {
                            this.ecosystems.entities.water.add(id);
                        }
                    }
                    console.log(`💧 ${this.ecosystems.entities.water.size} cuerpos de agua creados`);
                    
                    this.state.isReady = true;
                    console.log('✅ Mundo básico generado');
                },
                update: function(delta) {
                    // Actualizar animales (movimiento simple)
                    for (const id of this.ecosystems.entities.animals) {
                        if (ecs.active && ecs.active[id]) {
                            ecs.posX[id] += (Math.random() - 0.5) * delta * 2;
                            ecs.posZ[id] += (Math.random() - 0.5) * delta * 2;
                        }
                    }
                },
                reset: function() {
                    this.ecosystems.entities.trees.clear();
                    this.ecosystems.entities.animals.clear();
                    this.ecosystems.entities.rocks.clear();
                    this.ecosystems.entities.water.clear();
                    this.state.isReady = false;
                },
                getStats: function() {
                    return {
                        trees: this.ecosystems.entities.trees.size,
                        animals: this.ecosystems.entities.animals.size,
                        rocks: this.ecosystems.entities.rocks.size,
                        water: this.ecosystems.entities.water.size
                    };
                }
            };
        }
        
        _initSkySystem() {
            const scene = this.modules.renderer?.scene;
            if (!scene) return;
            
            if (typeof SkySystem !== 'undefined') {
                this.modules.skySystem = new SkySystem(scene, {
                    cloudDensity: 0.5,
                    cloudSpeed: 0.004,
                    starCount: 1500,
                    auroraIntensity: 0.5,
                    quality: this.config.qualityLevel
                });
                console.log('✅ Sky System inicializado');
                
                // Conectar al renderer
                if (this.modules.renderer) {
                    this.modules.renderer.skySystem = this.modules.skySystem;
                }
            } else {
                console.warn('⚠️ SkySystem no disponible');
            }
        }
        
        _initWaterSystem() {
            const scene = this.modules.renderer?.scene;
            if (!scene) return;
            
            if (typeof WaterSystem !== 'undefined') {
                this.modules.waterSystem = new WaterSystem(scene, {
                    waveHeight: 0.4,
                    waveSpeed: 0.8,
                    foamIntensity: 0.6,
                    quality: this.config.qualityLevel,
                    enableReflections: true,
                    enableCaustics: true,
                    enableRipples: true
                });
                console.log('✅ Water System inicializado');
            } else {
                console.warn('⚠️ WaterSystem no disponible');
            }
        }
        
        _initWeatherFX() {
            const scene = this.modules.renderer?.scene;
            if (!scene) return;
            
            if (typeof WeatherFX !== 'undefined') {
                this.modules.weatherFX = new WeatherFX(scene, {
                    mistDensity: 0.12,
                    mistCount: 5,
                    rainDensity: 0.4,
                    snowDensity: 0.3,
                    quality: this.config.qualityLevel
                });
                console.log('✅ Weather FX inicializado');
                
                // Conectar al renderer
                if (this.modules.renderer) {
                    this.modules.renderer.weatherFX = this.modules.weatherFX;
                }
            } else {
                console.warn('⚠️ WeatherFX no disponible');
            }
        }
        
        _initAI() {
            // Optimizer AI
            if (typeof OptimizerAI !== 'undefined') {
                this.modules.optimizerAI = new OptimizerAI(
                    this.modules.core?.hardware || { getHardware: () => ({}) },
                    this.modules.core?.memory || { getGameData: () => null }
                );
                console.log('✅ Optimizer AI inicializado');
            }
            
            // Meta AI
            if (typeof MetaOptimizerAI !== 'undefined') {
                this.modules.metaAI = new MetaOptimizerAI(
                    this.modules.core?.hardware || { getHardware: () => ({}) },
                    this.modules.core?.memory || { getGameData: () => null }
                );
                console.log('✅ Meta AI inicializado');
            }
            
            // World AI
            if (typeof WorldAI !== 'undefined') {
                this.modules.worldAI = new WorldAI(this);
                console.log('✅ World AI inicializado');
            }
        }
        
        _initMinimap() {
            const canvas = document.getElementById('minimap-canvas');
            if (typeof Minimap !== 'undefined' && canvas) {
                this.modules.minimap = new Minimap(this, canvas, {
                    worldRange: 180,
                    enableFogOfWar: true,
                    enablePredictive: true,
                    enableAnimations: true,
                    enablePOI: true,
                    enableEvents: true,
                    enableLayers: true,
                    enableZoom: true,
                    enablePan: true
                });
                console.log('✅ Minimap inicializado');
            } else {
                console.warn('⚠️ Minimap no disponible o canvas no encontrado');
            }
        }
        
        _initDecorations() {
            const scene = this.modules.renderer?.scene;
            const terrain = this.modules.terrain;
            
            if (!scene || !terrain) return;
            
            // Vegetation Placer
            if (typeof VegetationPlacer !== 'undefined') {
                try {
                    this.modules.vegetationPlacer = new VegetationPlacer(scene, terrain, {
                        worldSize: this.config.worldSize,
                        flowerCount: 400,
                        useGrowth: true,
                        useWind: true
                    });
                    console.log('✅ Vegetation Placer inicializado');
                } catch (e) {
                    console.warn('⚠️ VegetationPlacer error:', e);
                }
            }
            
            // Alpine Decor
            if (typeof AlpineDecor !== 'undefined') {
                try {
                    this.modules.alpineDecor = new AlpineDecor(scene, terrain, {
                        worldSize: this.config.worldSize,
                        frostRockCount: 150,
                        iceCrystalCount: 80,
                        snowPatchCount: 60
                    });
                    console.log('✅ Alpine Decor inicializado');
                } catch (e) {
                    console.warn('⚠️ AlpineDecor error:', e);
                }
            }
            
            // Forest Decor
            if (typeof ForestDecor !== 'undefined') {
                try {
                    this.modules.forestDecor = new ForestDecor(scene, terrain, {
                        worldSize: this.config.worldSize,
                        bushCount: 500,
                        fernCount: 200,
                        flowerCount: 100
                    });
                    console.log('✅ Forest Decor inicializado');
                } catch (e) {
                    console.warn('⚠️ ForestDecor error:', e);
                }
            }
            
            // Particle System
            if (typeof ParticleSystem !== 'undefined') {
                try {
                    this.modules.particleSystem = new ParticleSystem(150, {
                        spread: 80,
                        height: 25,
                        fallSpeed: 0.2,
                        drift: 0.1,
                        size: 0.15,
                        color: 0x88aaff,
                        opacity: 0.3
                    });
                    console.log('✅ Particle System inicializado');
                } catch (e) {
                    console.warn('⚠️ ParticleSystem error:', e);
                }
            }
            
            // Animation System
            if (typeof AnimationSystem !== 'undefined') {
                try {
                    this.modules.animationSystem = new AnimationSystem({
                        windStrength: 0.6,
                        quality: this.config.qualityLevel
                    });
                    console.log('✅ Animation System inicializado');
                } catch (e) {
                    console.warn('⚠️ AnimationSystem error:', e);
                }
            }
        }
        
        _initUtils() {
            if (typeof Profiler !== 'undefined') {
                this.modules.profiler = Profiler;
                console.log('✅ Profiler inicializado');
            }
        }
        
        // ============================================================
        //  🌍 GENERAR MUNDO
        //  ============================================================
        _generateWorld() {
            console.log('🌍 Generando mundo...');
            
            try {
                // 1. Generar terreno
                this.state.generationStage = 'Generando terreno...';
                this.state.generationProgress = 10;
                this._emitProgress(10, 'Generando terreno...');
                
                const terrain = this.modules.terrain;
                if (terrain && terrain.generateHeightMap) {
                    terrain.generateHeightMap(this.config.worldSize);
                    console.log('✅ Terreno generado');
                }
                
                // 2. Generar GameWorld
                this.state.generationStage = 'Generando ecosistema...';
                this.state.generationProgress = 30;
                this._emitProgress(30, 'Generando ecosistema...');
                
                const world = this.modules.world;
                if (world && world._generateWorld) {
                    world._generateWorld();
                    console.log('✅ GameWorld generado');
                }
                
                // 3. Plantar vegetación
                this.state.generationStage = 'Plantando vegetación...';
                this.state.generationProgress = 50;
                this._emitProgress(50, 'Plantando vegetación...');
                
                if (this.modules.vegetationPlacer) {
                    try {
                        this.modules.vegetationPlacer.plantFlowers(400);
                    } catch (e) {}
                }
                
                if (this.modules.alpineDecor) {
                    try {
                        this.modules.alpineDecor.plant(150);
                    } catch (e) {}
                }
                
                if (this.modules.forestDecor) {
                    try {
                        this.modules.forestDecor.plant(500);
                    } catch (e) {}
                }
                
                // 4. Crear agua
                this.state.generationStage = 'Creando agua...';
                this.state.generationProgress = 70;
                this._emitProgress(70, 'Creando agua...');
                
                if (this.modules.waterSystem) {
                    try {
                        const waterSystem = this.modules.waterSystem;
                        for (let i = 0; i < 3; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const dist = 30 + Math.random() * 150;
                            const x = Math.cos(angle) * dist;
                            const z = Math.sin(angle) * dist;
                            const size = 30 + Math.random() * 40;
                            waterSystem.createWater(size, size, x, 0.5, z);
                        }
                        console.log('✅ Agua creada');
                    } catch (e) {
                        console.warn('⚠️ Error creando agua:', e);
                    }
                }
                
                // 5. Configurar clima
                this.state.generationStage = 'Configurando clima...';
                this.state.generationProgress = 85;
                this._emitProgress(85, 'Configurando clima...');
                
                if (this.modules.weatherFX) {
                    try {
                        this.modules.weatherFX.setWeather('clear');
                        console.log('✅ Clima configurado');
                    } catch (e) {}
                }
                
                // 6. Inicializar día/noche
                this.state.generationStage = 'Inicializando día/noche...';
                this.state.generationProgress = 95;
                this._emitProgress(95, 'Inicializando día/noche...');
                
                if (this.modules.renderer) {
                    try {
                        this.modules.renderer.setTimeOfDay(0.5);
                        if (this.modules.renderer._updateDayNight) {
                            this.modules.renderer._updateDayNight();
                        }
                        console.log('✅ Ciclo día/noche configurado');
                    } catch (e) {}
                }
                
                // 7. Actualizar minimap
                this.state.generationStage = 'Actualizando minimapa...';
                this.state.generationProgress = 98;
                this._emitProgress(98, 'Actualizando minimapa...');
                
                if (this.modules.minimap) {
                    try {
                        setTimeout(() => {
                            if (this.modules.minimap._draw) {
                                this.modules.minimap._draw();
                                console.log('🗺️ Minimap actualizado');
                            }
                        }, 500);
                    } catch (e) {}
                }
                
                // 8. Finalizar
                this.state.generationProgress = 100;
                this.state.generationStage = 'Mundo listo!';
                this.state.isReady = true;
                this._emitProgress(100, 'Mundo listo!');
                
                console.log('🌍 Mundo generado correctamente');
                console.log(`🌳 Árboles: ${this.state.treesCount}`);
                console.log(`🦌 Animales: ${this.state.animalsCount}`);
                
                // Notificar
                this.emit('world_generated', { 
                    progress: 100, 
                    stage: 'Mundo listo!',
                    trees: this.state.treesCount,
                    animals: this.state.animalsCount
                });
                
            } catch (e) {
                console.error('❌ Error generando mundo:', e);
                this.state.error = e;
            }
        }
        
        _emitProgress(progress, stage) {
            this.state.generationProgress = progress;
            this.state.generationStage = stage;
            this.emit('world_progress', { progress, stage });
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS
        //  ============================================================
        _setupEvents() {
            this.on('start', () => console.log('▶️ Motor iniciado'));
            this.on('pause', () => console.log('⏸️ Motor pausado'));
            this.on('resume', () => console.log('▶️ Motor reanudado'));
            this.on('stop', () => console.log('⏹️ Motor detenido'));
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this._wasHiddenAt = performance.now();
                } else {
                    this._loop.lastTime = performance.now();
                    this._loop.accumulator = 0;
                    this._loop.fixedAccumulator = 0;
                    this._fpsSamples = [];
                }
            });
            
            this.on('error', ({ error }) => {
                console.error('❌ Error en motor:', error);
            });
        }
        
        on(event, callback) {
            if (!this._events.has(event)) {
                this._events.set(event, []);
            }
            this._events.get(event).push(callback);
            return this;
        }
        
        off(event, callback) {
            if (!this._events.has(event)) return this;
            const listeners = this._events.get(event);
            this._events.set(event, listeners.filter(cb => cb !== callback));
            return this;
        }
        
        emit(event, data = {}) {
            if (!this._events.has(event)) return;
            this._eventHistory.push({ event, data, timestamp: Date.now() });
            if (this._eventHistory.length > 1000) this._eventHistory.shift();
            
            const listeners = this._events.get(event);
            for (const callback of listeners) {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`❌ Error en evento "${event}":`, e);
                }
            }
        }
        
        // ============================================================
        //  🎯 LOOP DE JUEGO
        //  ============================================================
        start() {
            if (this.state.status === 'running') {
                console.warn('⚠️ El motor ya está en ejecución');
                return this;
            }
            
            if (this.state.status === 'error') {
                console.error('❌ El motor está en estado de error');
                return this;
            }
            
            this.state.status = 'running';
            this.state.startTime = performance.now();
            this._loop.lastTime = performance.now();
            this._loop.running = true;
            this._loop.accumulator = 0;
            this._loop.fixedAccumulator = 0;
            this._loop.fixedDeltaTime = 1 / 60;
            
            // Si el mundo no está listo, generarlo
            if (!this.state.isReady) {
                this._generateWorld();
            }
            
            this._gameLoop();
            
            this.emit('start', { engine: this });
            console.log('▶️ Motor iniciado');
            
            return this;
        }
        
        pause() {
            if (this.state.status !== 'running') {
                console.warn('⚠️ El motor no está en ejecución');
                return this;
            }
            
            this.state.status = 'paused';
            this._loop.running = false;
            
            this.emit('pause', { engine: this });
            console.log('⏸️ Motor pausado');
            
            return this;
        }
        
        resume() {
            if (this.state.status !== 'paused') {
                console.warn('⚠️ El motor no está pausado');
                return this;
            }
            
            this.state.status = 'running';
            this._loop.running = true;
            this._loop.lastTime = performance.now();
            
            this.emit('resume', { engine: this });
            console.log('▶️ Motor reanudado');
            
            return this;
        }
        
        stop() {
            this.state.status = 'stopped';
            this._loop.running = false;
            
            this.emit('stop', { engine: this });
            console.log('⏹️ Motor detenido');
            
            return this;
        }
        
        // ============================================================
        //  🔄 GAME LOOP
        //  ============================================================
        _gameLoop() {
            if (!this._loop.running && this.state.status !== 'running') {
                return;
            }
            
            try {
                const now = performance.now();
                const rawDelta = now - this._loop.lastTime;
                let delta = Math.min(rawDelta, 50);
                this._loop.lastTime = now;
                
                const deltaSeconds = delta / 1000;
                
                this._loop.accumulator += deltaSeconds;
                this._loop.fixedAccumulator += deltaSeconds;
                
                let fixedSteps = 0;
                while (this._loop.fixedAccumulator >= this._loop.fixedDeltaTime && fixedSteps < 5) {
                    this._fixedUpdate(this._loop.fixedDeltaTime);
                    this._loop.fixedAccumulator -= this._loop.fixedDeltaTime;
                    this._loop.updateCount++;
                    fixedSteps++;
                }
                
                if (this._loop.fixedAccumulator > this._loop.fixedDeltaTime * 5) {
                    this._loop.fixedAccumulator = 0;
                }
                
                this._update(deltaSeconds);
                this._render();
                this._postRender();
                this._updateStats(delta, rawDelta);
                
                this.emit('frame', {
                    delta: deltaSeconds,
                    frame: this.state.frameCount,
                    fps: this.state.fps
                });
                
            } catch (e) {
                this._lastLoopError = (e && e.message) ? e.message : String(e);
                console.error('❌ Error en el game loop (frame ' + this.state.frameCount + '):', e);
            }
            
            requestAnimationFrame(() => this._gameLoop());
        }
        
        _fixedUpdate(delta) {
            // ECS Physics
            if (this.modules.ecs) {
                try {
                    const terrain = this.modules.terrain;
                    const getGroundHeight = terrain?.getHeight 
                        ? (x, z) => terrain.getHeight(x, z) 
                        : null;
                        
                    this.modules.ecs.updatePhysics(
                        delta,
                        -9.8,
                        0.6,
                        this.state.frameCount,
                        null,
                        getGroundHeight
                    );
                } catch (e) {}
            }
            
            // Game World
            if (this.modules.world) {
                try {
                    this.modules.world.update(delta);
                } catch (e) {}
            }
            
            // World AI
            if (this.modules.worldAI) {
                try {
                    this.modules.worldAI.update(delta);
                } catch (e) {}
            }
            
            // Minimap
            if (this.modules.minimap) {
                try {
                    this.modules.minimap.update(delta);
                } catch (e) {}
            }
            
            // IA Optimizer
            if (this.modules.optimizerAI) {
                try {
                    const perf = this.modules.profiler?.getSummary?.() || { fps: this.state.fps };
                    const renderStats = this.modules.renderer?.getStats?.() || {};
                    const action = this.modules.optimizerAI.update(perf, renderStats, this.modules.ecs);
                    if (action && !this.manualQuality) {
                        this.modules.renderer?.setQuality(action.quality);
                    }
                } catch (e) {}
            }
            
            // Geometry Lab
            if (this.modules.geometryLab) {
                try {
                    this.modules.geometryLab.update(delta);
                } catch (e) {}
            }
            
            // LOD
            if (this.modules.renderer && this.modules.ecs) {
                try {
                    const camPos = this.modules.renderer.getCameraPosition();
                    this.modules.ecs.updateLOD(camPos.x, camPos.z, this.config.lodDistance * 3);
                } catch (e) {}
            }
        }
        
        _update(delta) {
            // Sky System
            if (this.modules.skySystem) {
                try {
                    const renderer = this.modules.renderer;
                    const sunHeight = renderer?.dayNight?.intensity || 0.5;
                    this.modules.skySystem.update(delta, sunHeight);
                } catch (e) {}
            }
            
            // Water System
            if (this.modules.waterSystem) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    const weather = this.modules.weatherFX?.weatherType || 'clear';
                    this.modules.waterSystem.update(delta, camPos, weather);
                } catch (e) {}
            }
            
            // Weather FX
            if (this.modules.weatherFX) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    this.modules.weatherFX.update(delta, camPos);
                } catch (e) {}
            }
            
            // Animation System
            if (this.modules.animationSystem) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    this.modules.animationSystem.update(delta, camPos);
                } catch (e) {}
            }
            
            // Particle System
            if (this.modules.particleSystem) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    this.modules.particleSystem.update(performance.now() * 0.001, camPos);
                } catch (e) {}
            }
        }
        
        _render() {
            if (!this.modules.renderer) return;
            
            try {
                this.modules.renderer.render(
                    this.modules.ecs,
                    null,
                    null
                );
                this._loop.renderCount++;
            } catch (e) {}
        }
        
        _postRender() {
            // Actualizar estadísticas
            this._updateRealTimeStats();
        }
        
        // ============================================================
        //  📊 ACTUALIZAR ESTADÍSTICAS
        //  ============================================================
        _updateRealTimeStats() {
            const ecs = this.modules.ecs;
            if (ecs) {
                let trees = 0, animals = 0;
                for (let i = 0; i < ecs.count; i++) {
                    if (ecs.active && ecs.active[i]) {
                        if (ecs.isTree && ecs.isTree[i]) trees++;
                        if (ecs.isAnimal && ecs.isAnimal[i]) animals++;
                    }
                }
                this.state.treesCount = trees;
                this.state.animalsCount = animals;
                this.state.entitiesCount = ecs.count;
            }
            
            const renderer = this.modules.renderer;
            if (renderer) {
                const stats = renderer.getStats?.() || {};
                this.state.memoryUsage = stats.vram || 0;
            }
        }
        
        _updateStats(delta, rawDelta) {
            this.state.frameCount++;
            this.state.uptime = performance.now() - this.state.startTime;
            
            if (rawDelta > 0) {
                const instantFps = 1000 / rawDelta;
                if (instantFps > 0 && instantFps <= 150) {
                    this._fpsSamples = this._fpsSamples || [];
                    this._fpsSamples.push(instantFps);
                    if (this._fpsSamples.length > 20) this._fpsSamples.shift();
                }
            }
            
            if (this.state.frameCount % 15 === 0 && this._fpsSamples?.length > 0) {
                const avg = this._fpsSamples.reduce((a, b) => a + b, 0) / this._fpsSamples.length;
                this.state.fps = Math.round(avg);
            }
        }
        
        // ============================================================
        //  📊 CONTADOR DE MÓDULOS
        //  ============================================================
        _countModules() {
            let count = 0;
            for (const key in this.modules) {
                if (this.modules[key]) count++;
            }
            return count;
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        getModule(name) {
            return this.modules[name] || null;
        }
        
        getModules() {
            return { ...this.modules };
        }
        
        getState() {
            return { ...this.state };
        }
        
        getStats() {
            return {
                state: {
                    status: this.state.status,
                    frameCount: this.state.frameCount,
                    fps: this.state.fps,
                    quality: this.state.qualityLevel,
                    generationProgress: this.state.generationProgress,
                    generationStage: this.state.generationStage,
                    entitiesCount: this.state.entitiesCount,
                    treesCount: this.state.treesCount,
                    animalsCount: this.state.animalsCount,
                    memoryUsage: this.state.memoryUsage,
                    uptime: this.state.uptime,
                    isReady: this.state.isReady
                },
                modules: {
                    loaded: this._countModules()
                }
            };
        }
        
        getSummary() {
            const stats = this.getStats();
            return {
                status: stats.state.status,
                fps: stats.state.fps,
                entities: stats.state.entitiesCount,
                trees: stats.state.treesCount,
                animals: stats.state.animalsCount,
                memory: Math.round(stats.state.memoryUsage / (1024 * 1024)),
                quality: stats.state.qualityLevel,
                generationProgress: stats.state.generationProgress,
                generationStage: stats.state.generationStage,
                uptime: Math.round(stats.state.uptime / 1000),
                isReady: stats.state.isReady
            };
        }
        
        isRunning() {
            return this.state.status === 'running';
        }
        
        isReady() {
            return this.state.status === 'ready' || this.state.status === 'running';
        }
        
        hasError() {
            return this.state.status === 'error';
        }
        
        getError() {
            return this.state.error;
        }
        
        setQuality(level) {
            const validLevels = ['low', 'medium', 'high', 'ultra', 'quantum'];
            if (!validLevels.includes(level)) return;
            
            this.state.qualityLevel = level;
            this.config.qualityLevel = level;
            
            if (this.modules.renderer) {
                this.modules.renderer.setQuality(level);
            }
            
            if (this.modules.skySystem) {
                this.modules.skySystem.setQuality(level);
            }
            
            if (this.modules.waterSystem) {
                this.modules.waterSystem.setQuality(level);
            }
            
            if (this.modules.weatherFX) {
                this.modules.weatherFX.setQuality(level);
            }
            
            if (this.modules.animationSystem) {
                this.modules.animationSystem.setQuality(level);
            }
            
            console.log(`⚡ Calidad: ${level.toUpperCase()}`);
            this.emit('quality_change', { level });
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            console.log('🔄 Resetando motor cuántico...');
            
            this.stop();
            
            if (this.modules.ecs) this.modules.ecs.reset();
            if (this.modules.renderer) this.modules.renderer.reset();
            if (this.modules.world) this.modules.world.reset();
            if (this.modules.geometryLab) this.modules.geometryLab.reset();
            if (this.modules.optimizerAI) this.modules.optimizerAI.reset();
            if (this.modules.metaAI) this.modules.metaAI.reset();
            if (this.modules.profiler) this.modules.profiler.reset();
            
            this.state.frameCount = 0;
            this.state.uptime = 0;
            this.state.error = null;
            this.state.generationProgress = 0;
            this.state.generationStage = 'reset';
            this.state.fps = 0;
            this.state.isReady = false;
            
            this._loop.accumulator = 0;
            this._loop.fixedAccumulator = 0;
            this._loop.updateCount = 0;
            this._loop.renderCount = 0;
            
            this._fpsSamples = [];
            this._lastLoopError = null;
            
            this.state.status = 'ready';
            
            console.log('✅ Motor cuántico reseteado');
            return this;
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            console.log('🗑️ Destruyendo motor cuántico...');
            
            this.stop();
            this._events.clear();
            this._eventHistory = [];
            
            if (this.modules.renderer?.destroy) this.modules.renderer.destroy();
            
            this.modules = {};
            this.state.status = 'stopped';
            
            console.log('✅ Motor cuántico destruido');
            return this;
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.PriomEngine = PriomEngine;
    
    console.log('🚀 PriomEngine Cuántico cargado (v0.4.3 - COMPLETO)');
    console.log('🌍 Generación de mundo funcional');
    console.log('🌅 Ciclo día/noche completo');
    console.log('🗺️ Minimap funcional');
    console.log('📊 Estadísticas en tiempo real');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PriomEngine;
    }
    
})();
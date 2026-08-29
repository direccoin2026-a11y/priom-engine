/**
 * 🚀 PRIOM V0.4 - PRIOM ENGINE (CORREGIDO)
 * "El motor que une todo en perfecta armonía"
 * 
 * 📁 Ubicación: js/engine/PriomEngine.js
 * 📦 Versión: 0.5.2
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
            const globalConfig = (typeof CONFIG !== 'undefined' && CONFIG) ? CONFIG : {};
            this.config = {
                ...globalConfig,
                ...config,
                autoStart: config.autoStart !== undefined ? config.autoStart : true,
                qualityLevel: config.qualityLevel || 'ultra',
                worldSize: config.worldSize || 400,
                terrainHeight: config.terrainHeight || 30,
                treeDensity: config.treeDensity || 0.4,
                animalCount: config.animalCount || 50,
                lodDistance: config.lodDistance || 250,
                maxEntities: config.maxEntities || 80000
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
                entityFactory: null,
                terrain: null,
                world: null,
                skySystem: null,
                waterSystem: null,
                weatherFX: null,
                optimizerAI: null,
                metaAI: null,
                worldAI: null,
                minimap: null,
                vegetationPlacer: null,
                alpineDecor: null,
                forestDecor: null,
                particleSystem: null,
                animationSystem: null,
                geometryLab: null,
                profiler: null,
                helpers: null
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
                console.log('📦 Inicializando módulos...');
                
                // 1. ECS
                this._initECS();
                
                // 2. Renderer
                this._initRenderer();
                
                // 3. Entity Factory
                this._initEntityFactory();
                
                // 4. Terrain
                this._initTerrain();
                
                // 5. Game World
                this._initGameWorld();
                
                // 6. Sky System
                this._initSkySystem();
                
                // 7. Water System
                this._initWaterSystem();
                
                // 8. Weather FX
                this._initWeatherFX();
                
                // 9. IA
                this._initAI();
                
                // 10. Decoraciones
                this._initDecorations();
                
                // 11. Minimap
                this._initMinimap();
                
                // 12. Utils
                this._initUtils();
                
                this._setupEvents();
                
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor Cuántico inicializado correctamente');
                console.log(`📊 Módulos cargados: ${this._countModules()}`);
                
                // Generar mundo
                setTimeout(() => this._generateWorld(), 200);
                
                if (this.config.autoStart) {
                    setTimeout(() => this.start(), 500);
                }
                
            } catch (error) {
                this.state.status = 'error';
                this.state.error = error;
                console.error('❌ Error en _init:', error);
                console.error('Stack:', error.stack);
            }
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE MÓDULOS
        //  ============================================================
        
        _initECS() {
            if (typeof SoaManager !== 'undefined') {
                this.modules.ecs = new SoaManager(this.config.maxEntities);
                console.log('✅ ECS (SoaManager) inicializado');
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
                console.log('✅ Renderer (MaxRenderer) inicializado');
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
                console.log('✅ EntityFactory inicializado');
            } else {
                throw new Error('EntityFactory no disponible');
            }
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
                    erosionIterations: 8,
                    thermalErosion: true,
                    biomesEnabled: true,
                    riversEnabled: true,
                    riverCount: 4,
                    vegetationEnabled: true
                };
                this.modules.terrain = new TerrainGenerator(terrainConfig);
                console.log('✅ TerrainGenerator inicializado');
            } else {
                throw new Error('TerrainGenerator no disponible');
            }
        }
        
        _initGameWorld() {
            if (typeof GameWorld !== 'undefined') {
                this.modules.world = new GameWorld(
                    this.modules.ecs,
                    this.modules.renderer,
                    null
                );
                console.log('✅ GameWorld inicializado');
            } else {
                throw new Error('GameWorld no disponible');
            }
        }
        
        _initSkySystem() {
            const scene = this.modules.renderer?.scene;
            if (!scene) return;
            
            if (typeof SkySystem !== 'undefined') {
                try {
                    this.modules.skySystem = new SkySystem(scene, {
                        cloudDensity: 0.4,
                        cloudSpeed: 0.003,
                        starCount: 1500,
                        auroraIntensity: 0.3,
                        quality: this.config.qualityLevel
                    });
                    console.log('✅ SkySystem inicializado');
                    
                    if (this.modules.renderer) {
                        this.modules.renderer.skySystem = this.modules.skySystem;
                    }
                } catch (e) {
                    console.warn('⚠️ Error en SkySystem:', e);
                }
            }
        }
        
        _initWaterSystem() {
            const scene = this.modules.renderer?.scene;
            if (!scene) return;
            
            if (typeof WaterSystem !== 'undefined') {
                try {
                    this.modules.waterSystem = new WaterSystem(scene, {
                        waveHeight: 0.3,
                        waveSpeed: 0.8,
                        foamIntensity: 0.5,
                        quality: this.config.qualityLevel
                    });
                    console.log('✅ WaterSystem inicializado');
                } catch (e) {
                    console.warn('⚠️ Error en WaterSystem:', e);
                }
            }
        }
        
        _initWeatherFX() {
            const scene = this.modules.renderer?.scene;
            if (!scene) return;
            
            if (typeof WeatherFX !== 'undefined') {
                try {
                    this.modules.weatherFX = new WeatherFX(scene, {
                        mistDensity: 0.1,
                        mistCount: 4,
                        rainDensity: 0.3,
                        snowDensity: 0.2,
                        quality: this.config.qualityLevel
                    });
                    this.modules.weatherFX.setWeather('clear');
                    console.log('✅ WeatherFX inicializado');
                    
                    if (this.modules.renderer) {
                        this.modules.renderer.weatherFX = this.modules.weatherFX;
                    }
                } catch (e) {
                    console.warn('⚠️ Error en WeatherFX:', e);
                }
            }
        }
        
        _initAI() {
            try {
                // Optimizer AI
                if (typeof OptimizerAI !== 'undefined') {
                    this.modules.optimizerAI = new OptimizerAI(
                        { getHardware: () => ({}) },
                        { getGameData: () => null }
                    );
                    console.log('✅ OptimizerAI inicializado');
                }
                
                // Meta AI
                if (typeof MetaOptimizerAI !== 'undefined') {
                    this.modules.metaAI = new MetaOptimizerAI(
                        { getHardware: () => ({}) },
                        { getGameData: () => null }
                    );
                    console.log('✅ MetaOptimizerAI inicializado');
                }
                
                // World AI
                if (typeof WorldAI !== 'undefined') {
                    this.modules.worldAI = new WorldAI(this);
                    console.log('✅ WorldAI inicializado');
                }
            } catch (e) {
                console.warn('⚠️ Error en IA:', e);
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
                    console.log('✅ VegetationPlacer inicializado');
                } catch (e) {
                    console.warn('⚠️ Error en VegetationPlacer:', e);
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
                    console.log('✅ AlpineDecor inicializado');
                } catch (e) {
                    console.warn('⚠️ Error en AlpineDecor:', e);
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
                    console.log('✅ ForestDecor inicializado');
                } catch (e) {
                    console.warn('⚠️ Error en ForestDecor:', e);
                }
            }
            
            // Particle System
            if (typeof ParticleSystem !== 'undefined') {
                try {
                    this.modules.particleSystem = new ParticleSystem(200, {
                        spread: 100,
                        height: 30,
                        fallSpeed: 0.2,
                        drift: 0.1,
                        size: 0.15,
                        color: 0x88aaff,
                        opacity: 0.3
                    });
                    console.log('✅ ParticleSystem inicializado');
                } catch (e) {
                    console.warn('⚠️ Error en ParticleSystem:', e);
                }
            }
            
            // Animation System
            if (typeof AnimationSystem !== 'undefined') {
                try {
                    this.modules.animationSystem = new AnimationSystem({
                        windStrength: 0.6,
                        quality: this.config.qualityLevel
                    });
                    console.log('✅ AnimationSystem inicializado');
                } catch (e) {
                    console.warn('⚠️ Error en AnimationSystem:', e);
                }
            }
        }
        
        _initMinimap() {
            const canvas = document.getElementById('minimap-canvas');
            if (typeof Minimap !== 'undefined' && canvas) {
                try {
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
                } catch (e) {
                    console.warn('⚠️ Error en Minimap:', e);
                }
            }
        }
        
        _initUtils() {
            try {
                if (typeof Profiler !== 'undefined') {
                    this.modules.profiler = Profiler;
                    console.log('✅ Profiler inicializado');
                }
                
                if (typeof Helpers !== 'undefined') {
                    this.modules.helpers = Helpers;
                    console.log('✅ Helpers inicializado');
                }
            } catch (e) {
                console.warn('⚠️ Error en Utils:', e);
            }
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
        //  🌍 GENERAR MUNDO - CORREGIDO
        //  ============================================================
        _generateWorld() {
            console.log('🌍 Generando mundo...');
            
            try {
                const terrain = this.modules.terrain;
                const world = this.modules.world;
                const renderer = this.modules.renderer;
                const ecs = this.modules.ecs;
                const factory = this.modules.entityFactory;
                
                if (!terrain) {
                    throw new Error('TerrainGenerator no disponible');
                }
                if (!world) {
                    throw new Error('GameWorld no disponible');
                }
                if (!renderer) {
                    throw new Error('Renderer no disponible');
                }
                
                // === PASO 1: GENERAR TERRENO ===
                this.state.generationStage = 'Generando terreno...';
                this.state.generationProgress = 10;
                console.log('🏔️ Generando terreno...');
                
                // Generar mapa de altura
                terrain.generateHeightMap(this.config.worldSize);
                console.log('✅ Mapa de altura generado');
                
                // Generar malla de terreno
                if (terrain.heightMap) {
                    terrain.generateTerrainMesh(renderer.scene, terrain.heightMap);
                    console.log('✅ Malla de terreno generada');
                } else {
                    console.warn('⚠️ No hay mapa de altura para generar malla');
                }
                
                // === PASO 2: INICIALIZAR MUNDO ===
                this.state.generationStage = 'Inicializando ecosistema...';
                this.state.generationProgress = 30;
                
                // Forzar generación del mundo en GameWorld
                if (world._generateWorld) {
                    // Reemplazar generadores con los que tenemos
                    world.generators.terrain = terrain;
                    world.generators.entities = factory;
                    
                    // Forzar generación
                    world._generateWorld();
                    console.log('✅ GameWorld generado');
                } else {
                    console.warn('⚠️ GameWorld no tiene _generateWorld');
                }
                
                // === PASO 3: PLANTAR VEGETACIÓN ===
                this.state.generationStage = 'Plantando vegetación...';
                this.state.generationProgress = 50;
                
                if (this.modules.vegetationPlacer) {
                    try {
                        this.modules.vegetationPlacer.plantFlowers(400);
                        console.log('✅ Flores plantadas');
                    } catch (e) {
                        console.warn('⚠️ Error plantando flores:', e);
                    }
                }
                
                if (this.modules.alpineDecor) {
                    try {
                        this.modules.alpineDecor.plant(150);
                        console.log('✅ Decoración alpina plantada');
                    } catch (e) {
                        console.warn('⚠️ Error en AlpineDecor:', e);
                    }
                }
                
                if (this.modules.forestDecor) {
                    try {
                        this.modules.forestDecor.plant(500);
                        console.log('✅ Decoración forestal plantada');
                    } catch (e) {
                        console.warn('⚠️ Error en ForestDecor:', e);
                    }
                }
                
                // === PASO 4: CREAR AGUA ===
                this.state.generationStage = 'Creando agua...';
                this.state.generationProgress = 70;
                
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
                
                // === PASO 5: CONFIGURAR CLIMA ===
                this.state.generationStage = 'Configurando clima...';
                this.state.generationProgress = 85;
                
                if (this.modules.weatherFX) {
                    try {
                        this.modules.weatherFX.setWeather('clear');
                        console.log('✅ Clima configurado');
                    } catch (e) {
                        console.warn('⚠️ Error configurando clima:', e);
                    }
                }
                
                // === PASO 6: DÍA/NOCHE ===
                this.state.generationStage = 'Inicializando día/noche...';
                this.state.generationProgress = 95;
                
                try {
                    renderer.setTimeOfDay(0.5);
                    if (renderer._updateDayNight) {
                        renderer._updateDayNight();
                    }
                    console.log('✅ Ciclo día/noche configurado');
                } catch (e) {
                    console.warn('⚠️ Error configurando día/noche:', e);
                }
                
                // === PASO 7: FINALIZAR ===
                this.state.generationProgress = 100;
                this.state.generationStage = 'Mundo listo!';
                this.state.isReady = true;
                
                // Actualizar estadísticas
                this._updateRealTimeStats();
                
                // Actualizar minimap
                setTimeout(() => {
                    if (this.modules.minimap && this.modules.minimap._draw) {
                        this.modules.minimap._draw();
                        console.log('🗺️ Minimap actualizado');
                    }
                }, 500);
                
                this.emit('world_generated', { 
                    progress: 100, 
                    stage: 'Mundo listo!',
                    trees: this.state.treesCount,
                    animals: this.state.animalsCount
                });
                
                console.log('🌍 Mundo generado correctamente');
                console.log(`🌳 Árboles: ${this.state.treesCount}`);
                console.log(`🦌 Animales: ${this.state.animalsCount}`);
                
            } catch (e) {
                console.error('❌ Error generando mundo:', e);
                console.error('Stack:', e.stack);
                this.state.error = e;
                this.state.isReady = false;
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
                console.error('❌ Error en el game loop:', e);
            }
            
            requestAnimationFrame(() => this._gameLoop());
        }
        
        _fixedUpdate(delta) {
            // ECS Física
            if (this.modules.ecs) {
                try {
                    const terrain = this.modules.terrain;
                    const getGroundHeight = terrain?.getHeight 
                        ? (x, z) => terrain.getHeight(x, z) 
                        : null;
                    this.modules.ecs.updatePhysics(
                        delta, -9.8, 0.6, this.state.frameCount, null, getGroundHeight
                    );
                } catch (e) {
                    // Silencioso
                }
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
                this.modules.renderer.render(this.modules.ecs);
                this._loop.renderCount++;
            } catch (e) {
                // Silencioso
            }
        }
        
        _postRender() {
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
                    this._fpsSamples.push(instantFps);
                    if (this._fpsSamples.length > 20) this._fpsSamples.shift();
                }
            }
            
            if (this.state.frameCount % 15 === 0 && this._fpsSamples.length > 0) {
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
            
            console.log(`⚡ Calidad: ${level.toUpperCase()}`);
            this.emit('quality_change', { level });
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            console.log('🔄 Resetando motor cuántico...');
            
            this.stop();
            
            if (this.modules.ecs) {
                this.modules.ecs.count = 0;
                this.modules.ecs.active.fill(0);
            }
            
            if (this.modules.renderer) {
                this.modules.renderer.reset();
            }
            
            if (this.modules.world) {
                this.modules.world.reset();
            }
            
            this.state.frameCount = 0;
            this.state.uptime = 0;
            this.state.error = null;
            this.state.generationProgress = 0;
            this.state.generationStage = 'reset';
            this.state.fps = 0;
            this.state.isReady = false;
            this.state.treesCount = 0;
            this.state.animalsCount = 0;
            this.state.entitiesCount = 0;
            
            this._loop.accumulator = 0;
            this._loop.fixedAccumulator = 0;
            this._fpsSamples = [];
            this._lastLoopError = null;
            
            this.state.status = 'ready';
            
            setTimeout(() => this._generateWorld(), 200);
            
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
            
            if (this.modules.renderer?.renderer?.dispose) {
                this.modules.renderer.renderer.dispose();
            }
            
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
    
    console.log('🚀 PriomEngine Cuántico cargado (v0.5.2 - CORREGIDO)');
    console.log('✅ Inicialización secuencial de módulos');
    console.log('🌍 Generación de mundo funcional');
    console.log('📊 Estadísticas en tiempo real');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PriomEngine;
    }
    
})();
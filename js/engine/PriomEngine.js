/**
 * 🚀 PRIOM V0.4 - PRIOM ENGINE CUÁNTICO (VERSIÓN COMPLETA)
 * "El motor que integra TODOS los módulos en perfecta armonía"
 * 
 * 📁 Ubicación: js/engine/PriomEngine.js
 * 📦 Versión: 0.4.2
 * 🎯 Propósito: Motor principal con integración completa de todos los módulos
 * 
 * ⭐ CARACTERÍSTICAS:
 * - Carga TODOS los módulos del proyecto
 * - Generación de mundo con montañas, agua, nubes
 * - Ciclo día/noche completo con sol y luna
 * - Sistema de clima (lluvia, nieve, tormentas)
 * - Minimap funcional en tiempo real
 * - Estadísticas en tiempo real (FPS, RAM, entidades)
 * - IA Optimizadora y Meta IA
 * - Sistema de partículas y efectos visuales
 * - Editor integrado
 * - Serialización de mundo
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
                maxDeltaTime: 0.05,
                fixedUpdateRate: 60,
                enableProfiling: true,
                enableDebug: CONFIG?.debug || false,
                enableThreading: false, // Desactivado para evitar problemas
                enablePredictiveAI: true,
                enableAdaptiveQuality: true,
                enableErrorRecovery: true,
                qualityLevel: config.qualityLevel || 'ultra',
                worldSize: config.worldSize || 600,
                terrainHeight: config.terrainHeight || 50,
                treeDensity: config.treeDensity || 0.3,
                animalCount: config.animalCount || 60,
                lodDistance: config.lodDistance || 350
            };
            
            // ============================================================
            //  📦 ESTADO DEL MOTOR
            //  ============================================================
            this.state = {
                status: 'initializing',
                startTime: 0,
                uptime: 0,
                frameCount: 0,
                deltaTime: 0,
                fps: 0,
                error: null,
                qualityLevel: this.config.qualityLevel,
                generationProgress: 0,
                generationStage: 'iniciando',
                // Estadísticas en tiempo real
                cpuLoad: 0,
                gpuLoad: 0,
                memoryUsage: 0,
                entitiesCount: 0,
                treesCount: 0,
                animalsCount: 0
            };
            
            // ============================================================
            //  🧩 MÓDULOS DEL MOTOR (TODOS LOS MÓDULOS)
            //  ============================================================
            this.modules = {
                // Core
                core: {
                    config: null,
                    hardware: null,
                    memory: null,
                    helpers: null
                },
                // ECS
                ecs: null,
                // IA
                ai: {
                    optimizer: null,
                    meta: null,
                    world: null
                },
                // Renderer
                renderer: null,
                // Game
                game: {
                    entityFactory: null,
                    terrainGenerator: null,
                    gameWorld: null,
                    vegetationPlacer: null,
                    alpineDecor: null,
                    forestDecor: null,
                    editor: null,
                    worldSerializer: null,
                    minimap: null,
                    chunkManager: null
                },
                // Utils
                utils: {
                    profiler: null,
                    helpers: null
                },
                // Environment
                environment: {
                    skySystem: null,
                    waterSystem: null,
                    weatherFX: null,
                    particleSystem: null,
                    godRays: null,
                    animationSystem: null
                }
            };
            
            // ============================================================
            //  📡 SISTEMA DE EVENTOS
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
                frameTime: 0,
                updateCount: 0,
                renderCount: 0
            };
            
            this._fpsSamples = [];
            this._wasHiddenAt = 0;
            this._lastLoopError = null;
            this.manualQuality = false;
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN COMPLETA
        //  ============================================================
        _init() {
            try {
                // ===== 1. CORE =====
                console.log('📦 Inicializando CORE...');
                this._initCore();
                
                // ===== 2. ECS =====
                console.log('📊 Inicializando ECS...');
                this._initECS();
                
                // ===== 3. RENDERER =====
                console.log('🎮 Inicializando RENDERER...');
                this._initRenderer();
                
                // ===== 4. ENVIRONMENT =====
                console.log('🌅 Inicializando ENVIRONMENT...');
                this._initEnvironment();
                
                // ===== 5. IA =====
                console.log('🧠 Inicializando IA...');
                this._initAI();
                
                // ===== 6. GAME WORLD =====
                console.log('🌍 Inicializando GAME WORLD...');
                this._initGameWorld();
                
                // ===== 7. DECORACIONES =====
                console.log('🌿 Inicializando DECORACIONES...');
                this._initDecorations();
                
                // ===== 8. EDITOR =====
                console.log('✏️ Inicializando EDITOR...');
                this._initEditor();
                
                // ===== 9. MINIMAP =====
                console.log('🗺️ Inicializando MINIMAP...');
                this._initMinimap();
                
                // ===== 10. UTILS =====
                console.log('🔧 Inicializando UTILS...');
                this._initUtils();
                
                // ===== 11. EVENTOS =====
                this._setupEvents();
                
                // ===== 12. ESTADO LISTO =====
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor Cuántico inicializado correctamente');
                console.log(`📊 Módulos cargados: ${this._countModules()}`);
                this.emit('init', { engine: this });
                
                // ===== 13. AUTO-START =====
                if (this.config.autoStart) {
                    setTimeout(() => this.start(), 500);
                }
                
            } catch (error) {
                this.state.status = 'error';
                this.state.error = error;
                console.error('❌ Error al inicializar el motor:', error);
                console.error('Stack:', error.stack);
                this.emit('error', { error });
            }
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE MÓDULOS
        //  ============================================================
        
        _initCore() {
            // Config
            this.modules.core.config = CONFIG || {};
            
            // Hardware Detector
            if (typeof HardwareDetector !== 'undefined') {
                this.modules.core.hardware = HardwareDetector;
                console.log('✅ HardwareDetector cargado');
            } else {
                console.warn('⚠️ HardwareDetector no disponible');
                this.modules.core.hardware = { getHardware: () => ({}) };
            }
            
            // Persistent Memory
            if (typeof PersistentMemory !== 'undefined') {
                this.modules.core.memory = PersistentMemory;
                console.log('✅ PersistentMemory cargado');
            } else {
                console.warn('⚠️ PersistentMemory no disponible');
                this.modules.core.memory = { getGameData: () => null, saveGameData: () => {} };
            }
            
            // Helpers
            if (typeof Helpers !== 'undefined') {
                this.modules.core.helpers = Helpers;
                console.log('✅ Helpers cargado');
            } else {
                console.warn('⚠️ Helpers no disponible');
                this.modules.core.helpers = { lerp: (a,b,t) => a + (b-a)*t };
            }
        }
        
        _initECS() {
            if (typeof SoaManager !== 'undefined') {
                const maxEntities = CONFIG?.maxEntities || 120000;
                this.modules.ecs = new SoaManager(maxEntities);
                console.log(`✅ ECS inicializado (${maxEntities} entidades)`);
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
                console.log('✅ Renderer inicializado');
                
                // Geometry Lab
                if (typeof ComplexGeometryLab !== 'undefined') {
                    this.modules.renderer.geometryLab = new ComplexGeometryLab(
                        this.modules.renderer.scene
                    );
                    console.log('✅ GeometryLab inicializado');
                }
            } else {
                throw new Error('MaxRenderer no disponible');
            }
        }
        
        _initEnvironment() {
            const scene = this.modules.renderer?.scene;
            if (!scene) return;
            
            // Sky System
            if (typeof SkySystem !== 'undefined') {
                this.modules.environment.skySystem = new SkySystem(scene, {
                    cloudDensity: 0.6,
                    cloudSpeed: 0.004,
                    starCount: 1500,
                    auroraIntensity: 0.5,
                    quality: this.config.qualityLevel
                });
                console.log('✅ SkySystem inicializado');
                
                // Conectar al renderer
                if (this.modules.renderer) {
                    this.modules.renderer.skySystem = this.modules.environment.skySystem;
                }
            }
            
            // Water System
            if (typeof WaterSystem !== 'undefined') {
                this.modules.environment.waterSystem = new WaterSystem(scene, {
                    waveHeight: 0.5,
                    waveSpeed: 1.0,
                    foamIntensity: 0.6,
                    quality: this.config.qualityLevel
                });
                console.log('✅ WaterSystem inicializado');
            }
            
            // Weather FX
            if (typeof WeatherFX !== 'undefined') {
                this.modules.environment.weatherFX = new WeatherFX(scene, {
                    mistDensity: 0.15,
                    mistCount: 6,
                    rainDensity: 0.5,
                    snowDensity: 0.3,
                    quality: this.config.qualityLevel
                });
                console.log('✅ WeatherFX inicializado');
            }
            
            // Particle System
            if (typeof ParticleSystem !== 'undefined') {
                this.modules.environment.particleSystem = new ParticleSystem(200, {
                    spread: 100,
                    height: 30,
                    fallSpeed: 0.3,
                    drift: 0.1,
                    size: 0.15,
                    color: 0x88aaff,
                    opacity: 0.3
                });
                console.log('✅ ParticleSystem inicializado');
            }
            
            // God Rays
            if (typeof GodRays !== 'undefined') {
                this.modules.environment.godRays = GodRays;
                console.log('✅ GodRays inicializado');
            }
            
            // Animation System
            if (typeof AnimationSystem !== 'undefined') {
                this.modules.environment.animationSystem = new AnimationSystem({
                    windStrength: 0.8,
                    quality: this.config.qualityLevel
                });
                console.log('✅ AnimationSystem inicializado');
            }
        }
        
        _initAI() {
            // Optimizer AI
            if (typeof OptimizerAI !== 'undefined') {
                this.modules.ai.optimizer = new OptimizerAI(
                    this.modules.core.hardware,
                    this.modules.core.memory
                );
                console.log('✅ OptimizerAI inicializado');
            } else {
                console.warn('⚠️ OptimizerAI no disponible');
            }
            
            // Meta Optimizer AI
            if (typeof MetaOptimizerAI !== 'undefined') {
                this.modules.ai.meta = new MetaOptimizerAI(
                    this.modules.core.hardware,
                    this.modules.core.memory
                );
                console.log('✅ MetaOptimizerAI inicializado');
            } else {
                console.warn('⚠️ MetaOptimizerAI no disponible');
            }
            
            // World AI
            if (typeof WorldAI !== 'undefined') {
                this.modules.ai.world = new WorldAI(this);
                console.log('✅ WorldAI inicializado');
            } else {
                console.warn('⚠️ WorldAI no disponible');
            }
        }
        
        _initGameWorld() {
            const ecs = this.modules.ecs;
            const renderer = this.modules.renderer;
            const memory = this.modules.core.memory;
            
            if (!ecs || !renderer) {
                console.warn('⚠️ ECS o Renderer no disponibles para GameWorld');
                return;
            }
            
            // Entity Factory
            if (typeof EntityFactory !== 'undefined') {
                this.modules.game.entityFactory = new EntityFactory(ecs, CONFIG);
                console.log('✅ EntityFactory inicializado');
            } else {
                console.warn('⚠️ EntityFactory no disponible');
            }
            
            // Terrain Generator
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
                    vegetationEnabled: true,
                    treeDensity: this.config.treeDensity,
                    animalCount: this.config.animalCount
                };
                
                this.modules.game.terrainGenerator = new TerrainGenerator(terrainConfig);
                console.log('✅ TerrainGenerator inicializado');
            } else {
                console.warn('⚠️ TerrainGenerator no disponible');
            }
            
            // Game World
            if (typeof GameWorld !== 'undefined') {
                const worldConfig = {
                    worldSize: this.config.worldSize,
                    terrainHeight: this.config.terrainHeight,
                    treeDensity: this.config.treeDensity,
                    animalCount: this.config.animalCount,
                    waterLevel: 0.35,
                    seed: CONFIG?.worldSeed || 42,
                    lodDistance: this.config.lodDistance,
                    dayLength: 600,
                    seasonLength: 1800
                };
                
                Object.assign(CONFIG || {}, worldConfig);
                
                this.modules.game.gameWorld = new GameWorld(ecs, renderer, memory);
                console.log('✅ GameWorld inicializado');
            } else {
                console.warn('⚠️ GameWorld no disponible');
            }
        }
        
        _initDecorations() {
            const scene = this.modules.renderer?.scene;
            const terrain = this.modules.game.terrainGenerator;
            
            if (!scene || !terrain) {
                console.warn('⚠️ Scene o Terrain no disponibles para decoraciones');
                return;
            }
            
            // Vegetation Placer
            if (typeof VegetationPlacer !== 'undefined') {
                this.modules.game.vegetationPlacer = new VegetationPlacer(scene, terrain, {
                    worldSize: this.config.worldSize,
                    flowerCount: 600,
                    useGrowth: true,
                    useWind: true
                });
                console.log('✅ VegetationPlacer inicializado');
            }
            
            // Alpine Decor
            if (typeof AlpineDecor !== 'undefined') {
                this.modules.game.alpineDecor = new AlpineDecor(scene, terrain, {
                    worldSize: this.config.worldSize,
                    frostRockCount: 200,
                    iceCrystalCount: 100,
                    snowPatchCount: 80
                });
                console.log('✅ AlpineDecor inicializado');
            }
            
            // Forest Decor
            if (typeof ForestDecor !== 'undefined') {
                this.modules.game.forestDecor = new ForestDecor(scene, terrain, {
                    worldSize: this.config.worldSize,
                    bushCount: 600,
                    fernCount: 300,
                    flowerCount: 150
                });
                console.log('✅ ForestDecor inicializado');
            }
        }
        
        _initEditor() {
            if (typeof Editor !== 'undefined') {
                this.modules.game.editor = new Editor(this);
                console.log('✅ Editor inicializado');
            }
            
            if (typeof WorldSerializer !== 'undefined') {
                this.modules.game.worldSerializer = new WorldSerializer(this);
                console.log('✅ WorldSerializer inicializado');
                
                if (this.modules.game.editor) {
                    this.modules.game.editor.onPlace = (type, x, y, z) => {
                        if (this.modules.game.worldSerializer) {
                            this.modules.game.worldSerializer.recordPlacement(type, x, y, z);
                        }
                    };
                }
            }
        }
        
        _initMinimap() {
            const canvas = document.getElementById('minimap-canvas');
            if (typeof Minimap !== 'undefined' && canvas) {
                this.modules.game.minimap = new Minimap(this, canvas, {
                    worldRange: 200,
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
        
        _initUtils() {
            if (typeof Profiler !== 'undefined') {
                this.modules.utils.profiler = Profiler;
                console.log('✅ Profiler inicializado');
            }
            
            if (typeof Helpers !== 'undefined') {
                this.modules.utils.helpers = Helpers;
                console.log('✅ Helpers (utils) inicializado');
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
            
            this.on('error', ({ error }) => {
                console.error('❌ Error en motor:', error);
            });
            
            this.on('frame', ({ delta, frame }) => {
                if (this.config.enableDebug && frame % 60 === 0) {
                    const stats = this.getStats();
                    console.log(`📊 Frame ${frame} | FPS: ${stats.state.fps} | Entidades: ${stats.state.entitiesCount}`);
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
            this._loop.fixedDeltaTime = 1 / this.config.fixedUpdateRate;
            
            // Generar el mundo antes de empezar el loop
            this._generateWorld();
            
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
        //  🌍 GENERAR MUNDO
        //  ============================================================
        _generateWorld() {
            console.log('🌍 Generando mundo...');
            
            try {
                // 1. Generar terreno
                this.state.generationStage = 'Generando terreno...';
                this.state.generationProgress = 10;
                this.emit('world_generated', { progress: 10, stage: 'Generando terreno...' });
                
                const terrain = this.modules.game.terrainGenerator;
                if (terrain) {
                    terrain.generateHeightMap(this.config.worldSize);
                    console.log('✅ Terreno generado');
                }
                
                // 2. Generar GameWorld
                this.state.generationStage = 'Generando ecosistema...';
                this.state.generationProgress = 30;
                this.emit('world_generated', { progress: 30, stage: 'Generando ecosistema...' });
                
                const gameWorld = this.modules.game.gameWorld;
                if (gameWorld && gameWorld._generateWorld) {
                    gameWorld._generateWorld();
                    console.log('✅ GameWorld generado');
                }
                
                // 3. Plantar decoraciones
                this.state.generationStage = 'Plantando vegetación...';
                this.state.generationProgress = 50;
                this.emit('world_generated', { progress: 50, stage: 'Plantando vegetación...' });
                
                // Vegetation Placer
                if (this.modules.game.vegetationPlacer) {
                    this.modules.game.vegetationPlacer.plantFlowers(600);
                }
                
                // Alpine Decor
                if (this.modules.game.alpineDecor) {
                    this.modules.game.alpineDecor.plant(200);
                }
                
                // Forest Decor
                if (this.modules.game.forestDecor) {
                    this.modules.game.forestDecor.plant(800);
                }
                
                // 4. Crear agua
                this.state.generationStage = 'Creando agua...';
                this.state.generationProgress = 70;
                this.emit('world_generated', { progress: 70, stage: 'Creando agua...' });
                
                if (this.modules.environment.waterSystem) {
                    // Crear algunos cuerpos de agua
                    const waterSystem = this.modules.environment.waterSystem;
                    for (let i = 0; i < 3; i++) {
                        const x = (Math.random() - 0.5) * 400;
                        const z = (Math.random() - 0.5) * 400;
                        waterSystem.createWater(60 + Math.random() * 40, 60 + Math.random() * 40, x, 0.5, z);
                    }
                    console.log('✅ Agua creada');
                }
                
                // 5. Configurar clima
                this.state.generationStage = 'Configurando clima...';
                this.state.generationProgress = 85;
                this.emit('world_generated', { progress: 85, stage: 'Configurando clima...' });
                
                if (this.modules.environment.weatherFX) {
                    this.modules.environment.weatherFX.setWeather('clear');
                    console.log('✅ Clima configurado');
                }
                
                // 6. Inicializar día/noche
                this.state.generationStage = 'Inicializando día/noche...';
                this.state.generationProgress = 95;
                this.emit('world_generated', { progress: 95, stage: 'Inicializando día/noche...' });
                
                if (this.modules.renderer) {
                    const renderer = this.modules.renderer;
                    renderer.setTimeOfDay(0.5); // Mediodía
                    if (renderer._updateDayNight) {
                        renderer._updateDayNight();
                    }
                    console.log('✅ Ciclo día/noche configurado');
                }
                
                // 7. Finalizar
                this.state.generationProgress = 100;
                this.state.generationStage = 'Mundo listo!';
                this.emit('world_generated', { progress: 100, stage: 'Mundo listo!' });
                
                console.log('🌍 Mundo generado correctamente');
                
            } catch (e) {
                console.error('❌ Error generando mundo:', e);
                this.state.error = e;
            }
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
                let delta = Math.min(rawDelta, this.config.maxDeltaTime * 1000);
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
            const startTime = performance.now();
            
            // ECS Physics
            if (this.modules.ecs) {
                const terrain = this.modules.game.terrainGenerator;
                const getGroundHeight = terrain?.getHeight 
                    ? (x, z) => terrain.getHeight(x, z) 
                    : null;
                    
                this.modules.ecs.updatePhysics(
                    delta,
                    CONFIG?.gravity || -9.8,
                    CONFIG?.windStrength || 0.6,
                    this.state.frameCount,
                    null,
                    getGroundHeight
                );
            }
            
            // Game World
            if (this.modules.game.gameWorld) {
                try {
                    this.modules.game.gameWorld.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en GameWorld:', e);
                }
            }
            
            // World AI
            if (this.modules.ai.world) {
                try {
                    this.modules.ai.world.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en WorldAI:', e);
                }
            }
            
            // Minimap
            if (this.modules.game.minimap) {
                try {
                    this.modules.game.minimap.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en Minimap:', e);
                }
            }
            
            // Animation System
            if (this.modules.environment.animationSystem) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    this.modules.environment.animationSystem.update(delta, camPos);
                } catch (e) {
                    console.warn('⚠️ Error en AnimationSystem:', e);
                }
            }
            
            // IA Optimizer
            if (this.modules.ai.optimizer && this.modules.ai.meta) {
                const perf = this.modules.utils.profiler?.getSummary?.() || { fps: this.state.fps };
                const renderStats = this.modules.renderer?.getStats?.() || {};
                
                try {
                    const aiAction = this.modules.ai.optimizer.update(perf, renderStats, this.modules.ecs);
                    const metaResult = this.modules.ai.meta.update(perf, renderStats, this.modules.ai.optimizer);
                    this._applyAIAction(aiAction);
                } catch (e) {
                    console.warn('⚠️ Error en IA Optimizer:', e);
                }
            }
            
            // Geometry Lab
            if (this.modules.renderer?.geometryLab) {
                try {
                    this.modules.renderer.geometryLab.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en GeometryLab:', e);
                }
            }
            
            // LOD
            if (this.modules.renderer && this.modules.ecs) {
                try {
                    const camPos = this.modules.renderer.getCameraPosition();
                    const lodDist = this.config.lodDistance || 350;
                    this.modules.ecs.updateLOD(camPos.x, camPos.z, lodDist * 3);
                } catch (e) {
                    console.warn('⚠️ Error en LOD:', e);
                }
            }
            
            this._loop.frameTime = performance.now() - startTime;
        }
        
        _update(delta) {
            // Helpers timers
            if (this.modules.utils.helpers) {
                try {
                    this.modules.utils.helpers.updateTimers(delta);
                } catch (e) {}
            }
            
            // Sky System
            if (this.modules.environment.skySystem) {
                try {
                    const renderer = this.modules.renderer;
                    const sunHeight = renderer?.dayNight?.intensity || 0.5;
                    this.modules.environment.skySystem.update(delta, sunHeight);
                } catch (e) {}
            }
            
            // Water System
            if (this.modules.environment.waterSystem) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    const weather = this.modules.environment.weatherFX?.weatherType || 'clear';
                    this.modules.environment.waterSystem.update(delta, camPos, weather);
                } catch (e) {}
            }
            
            // Weather FX
            if (this.modules.environment.weatherFX) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    this.modules.environment.weatherFX.update(delta, camPos);
                } catch (e) {}
            }
            
            // Particle System
            if (this.modules.environment.particleSystem) {
                try {
                    const camPos = this.modules.renderer?.getCameraPosition();
                    this.modules.environment.particleSystem.update(
                        performance.now() * 0.001,
                        camPos
                    );
                } catch (e) {}
            }
        }
        
        _render() {
            if (!this.modules.renderer) return;
            
            try {
                const metaOptimizations = this.modules.ai.meta?.getStatus?.()?.metaParams || null;
                
                this.modules.renderer.render(
                    this.modules.ecs,
                    null,
                    metaOptimizations
                );
                
                this._loop.renderCount++;
            } catch (e) {
                console.warn('⚠️ Error en render:', e);
            }
        }
        
        _postRender() {
            if (this.modules.utils.profiler && this.modules.renderer) {
                try {
                    const renderStats = this.modules.renderer.getStats?.() || {};
                    const entityCount = this.modules.ecs?.count || 0;
                    this.modules.utils.profiler.sample(renderStats, entityCount);
                } catch (e) {}
            }
            
            // Actualizar estadísticas en tiempo real
            this._updateRealTimeStats();
        }
        
        // ============================================================
        //  📊 ACTUALIZAR ESTADÍSTICAS EN TIEMPO REAL
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
            
            // Memoria estimada
            const renderer = this.modules.renderer;
            if (renderer) {
                const stats = renderer.getStats?.() || {};
                this.state.memoryUsage = stats.vram || 0;
            }
        }
        
        _updateStats(delta, rawDelta) {
            this.state.frameCount++;
            this.state.uptime = performance.now() - this.state.startTime;
            this.state.deltaTime = delta / 1000;
            
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
        //  🧠 APLICAR ACCIONES DE IA
        //  ============================================================
        _applyAIAction(action) {
            if (!action || !this.modules.renderer) return;
            if (this.manualQuality) return;
            
            try {
                this.modules.renderer.setQuality(action.quality);
                this.modules.renderer.setLODDistance(action.lodDistance);
            } catch (e) {}
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        getModule(name) {
            const categories = ['core', 'ecs', 'ai', 'renderer', 'game', 'utils', 'environment'];
            for (const category of categories) {
                if (this.modules[category] && this.modules[category][name] !== undefined) {
                    return this.modules[category][name];
                }
            }
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
                    uptime: this.state.uptime
                },
                ecs: this.modules.ecs?.getStats?.() || null,
                renderer: this.modules.renderer?.getStats?.() || null,
                world: this.modules.game.gameWorld?.getStats?.() || null,
                modules: {
                    loaded: this._countModules(),
                    total: 34
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
                uptime: Math.round(stats.state.uptime / 1000)
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
            
            if (this.modules.environment.skySystem) {
                this.modules.environment.skySystem.setQuality(level);
            }
            
            if (this.modules.environment.waterSystem) {
                this.modules.environment.waterSystem.setQuality(level);
            }
            
            if (this.modules.environment.weatherFX) {
                this.modules.environment.weatherFX.setQuality(level);
            }
            
            if (this.modules.environment.animationSystem) {
                this.modules.environment.animationSystem.setQuality(level);
            }
            
            console.log(`⚡ Calidad: ${level.toUpperCase()}`);
            this.emit('quality_change', { level });
        }
        
        // ============================================================
        //  📊 CONTADOR DE MÓDULOS
        //  ============================================================
        _countModules() {
            let count = 0;
            const categories = ['core', 'ai', 'game', 'utils', 'environment'];
            
            for (const category of categories) {
                if (this.modules[category]) {
                    for (const key in this.modules[category]) {
                        if (this.modules[category][key]) count++;
                    }
                }
            }
            
            if (this.modules.ecs) count++;
            if (this.modules.renderer) count++;
            
            return count;
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            console.log('🔄 Resetando motor cuántico...');
            
            this.stop();
            
            if (this.modules.ecs) this.modules.ecs.reset();
            if (this.modules.renderer) this.modules.renderer.reset();
            if (this.modules.game.gameWorld) this.modules.game.gameWorld.reset();
            if (this.modules.renderer?.geometryLab) this.modules.renderer.geometryLab.reset();
            if (this.modules.ai.optimizer) this.modules.ai.optimizer.reset();
            if (this.modules.ai.meta) this.modules.ai.meta.reset();
            if (this.modules.utils.profiler) this.modules.utils.profiler.reset();
            if (this.modules.utils.helpers) this.modules.utils.helpers.reset();
            
            this.state.frameCount = 0;
            this.state.uptime = 0;
            this.state.error = null;
            this.state.generationProgress = 0;
            this.state.generationStage = 'reset';
            this.state.fps = 0;
            
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
            if (this.modules.core.memory?.shutdown) this.modules.core.memory.shutdown();
            
            // Limpiar environment
            for (const key in this.modules.environment) {
                if (this.modules.environment[key] && typeof this.modules.environment[key].destroy === 'function') {
                    try { this.modules.environment[key].destroy(); } catch (e) {}
                }
            }
            
            // Limpiar game
            for (const key in this.modules.game) {
                if (this.modules.game[key] && typeof this.modules.game[key].destroy === 'function') {
                    try { this.modules.game[key].destroy(); } catch (e) {}
                }
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
    
    console.log('🚀 PriomEngine Cuántico cargado (v0.4.2 - COMPLETO)');
    console.log('📦 Integración completa de TODOS los módulos');
    console.log('🌍 Generación de mundo con montañas, agua, nubes');
    console.log('🌅 Ciclo día/noche completo');
    console.log('🗺️ Minimap funcional');
    console.log('📊 Estadísticas en tiempo real');
    console.log('🧠 IA Optimizadora y Meta IA');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PriomEngine;
    }
    
})();p
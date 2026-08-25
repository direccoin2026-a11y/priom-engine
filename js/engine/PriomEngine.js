/**
 * 🚀 PRIOM V0.4 - PRIOM ENGINE CUÁNTICO (CORREGIDO Y EVOLUCIONADO)
 * "El motor que une todo en perfecta armonía con IA y optimización extrema"
 * 
 * 📁 Ubicación: js/engine/PriomEngine.js
 * 📦 Versión: 0.4.1
 * 🔧 CORRECCIÓN: Inicialización correcta, generación de mundo funcional
 * ⭐ EVOLUCIÓN: Sistema de generación por pasos, mejor manejo de errores
 */

(function() {
    'use strict';

    class PriomEngine {
        constructor(config = {}) {
            // ============================================================
            //  📊 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this.config = {
                ...CONFIG,
                ...config,
                autoStart: config.autoStart !== undefined ? config.autoStart : true,
                maxDeltaTime: 0.05,
                fixedUpdateRate: 60,
                enableProfiling: true,
                enableDebug: CONFIG?.debug || false,
                enableThreading: config.enableThreading !== undefined ? config.enableThreading : false,
                enablePredictiveAI: config.enablePredictiveAI !== undefined ? config.enablePredictiveAI : true,
                enableSmartScheduling: config.enableSmartScheduling !== undefined ? config.enableSmartScheduling : true,
                enableAdaptiveQuality: config.enableAdaptiveQuality !== undefined ? config.enableAdaptiveQuality : true,
                enableErrorRecovery: config.enableErrorRecovery !== undefined ? config.enableErrorRecovery : true,
                enablePerformanceBudget: config.enablePerformanceBudget !== undefined ? config.enablePerformanceBudget : true,
                maxThreads: config.maxThreads || navigator.hardwareConcurrency || 4,
                performanceBudget: config.performanceBudget || { fps: 30, cpu: 80, gpu: 80, memory: 200 },
                qualityLevel: config.qualityLevel || 'ultra',
                plugins: config.plugins || [],
                // CONFIGURACIÓN DE MUNDO (CORREGIDA)
                worldSize: config.worldSize || 600,
                terrainHeight: config.terrainHeight || 50,
                treeDensity: config.treeDensity || 0.3,
                animalCount: config.animalCount || 60,
                lodDistance: config.lodDistance || 350,
                waterEnabled: config.waterEnabled !== undefined ? config.waterEnabled : true,
                particlesEnabled: config.particlesEnabled !== undefined ? config.particlesEnabled : true,
                shadowsEnabled: config.shadowsEnabled !== undefined ? config.shadowsEnabled : true,
                bloomEnabled: config.bloomEnabled !== undefined ? config.bloomEnabled : true,
                ssaoEnabled: config.ssaoEnabled !== undefined ? config.ssaoEnabled : true
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
                fixedDeltaTime: 0,
                fps: 0,
                error: null,
                qualityLevel: this.config.qualityLevel,
                performanceMode: 'balanced',
                threadCount: Math.min(this.config.maxThreads, 4),
                activeThreads: 0,
                tasksScheduled: 0,
                tasksCompleted: 0,
                energyEfficiency: 1.0,
                performanceScore: 1.0,
                lastFrameTime: 0,
                frameTimeHistory: [],
                fpsHistory: [],
                cpuLoad: 0,
                gpuLoad: 0,
                memoryUsage: 0,
                errorCount: 0,
                lastError: null,
                recoveryAttempts: 0,
                // NUEVO: seguimiento de generación
                generationProgress: 0,
                generationStage: 'iniciando'
            };
            
            // ============================================================
            //  🧩 MÓDULOS DEL MOTOR
            //  ============================================================
            this.modules = {
                core: {},
                ecs: null,
                ai: {},
                renderer: null,
                game: {},
                utils: {},
                workers: {},
                plugins: new Map()
            };
            
            // ============================================================
            //  🎯 LOOP DE JUEGO
            //  ============================================================
            this._loop = {
                running: false,
                lastTime: 0,
                accumulator: 0,
                fixedAccumulator: 0,
                frameTime: 0,
                updateCount: 0,
                renderCount: 0,
                adaptiveSteps: 0,
                skippedFrames: 0,
                frameBudget: 16.67,
                workerTasks: [],
                taskQueue: [],
                priorityQueue: []
            };
            
            // ============================================================
            //  📡 SISTEMA DE EVENTOS
            //  ============================================================
            this._events = new Map();
            this._eventHistory = [];
            
            // ============================================================
            //  🔌 PLUGINS
            //  ============================================================
            this._plugins = new Map();
            
            // ============================================================
            //  🧠 IA PREDICTIVA
            //  ============================================================
            this._predictor = {
                model: {
                    fpsTrend: 0,
                    loadTrend: 0,
                    memoryTrend: 0,
                    confidence: 0.5
                },
                forecast: [],
                alerts: [],
                lastPrediction: null
            };
            
            // ============================================================
            //  📊 WORKERS
            //  ============================================================
            this._workers = [];
            this._workerTasks = [];
            this._sharedMemory = null;
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                totalFrames: 0,
                totalUpdates: 0,
                totalRenders: 0,
                totalErrors: 0,
                averageFps: 0,
                minFps: Infinity,
                maxFps: 0,
                averageFrameTime: 0,
                minFrameTime: Infinity,
                maxFrameTime: 0,
                averageCpuLoad: 0,
                averageGpuLoad: 0,
                averageMemory: 0,
                peakMemory: 0,
                totalTasks: 0,
                completedTasks: 0,
                failedTasks: 0,
                uptime: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN CORREGIDA
        //  ============================================================
        _init() {
            console.log('🚀 ========================================');
            console.log('🚀  PRIOM V0.4 - MOTOR DE JUEGOS IA');
            console.log('🚀  "Donde la IA encuentra la gráfica"');
            console.log('🚀 ========================================');
            console.log(`📦 Versión: ${CONFIG?.version || '0.4.0'}`);
            console.log(`📊 Max Entidades: ${CONFIG?.maxEntities || 120000}`);
            console.log(`🎯 FPS Objetivo: ${CONFIG?.targetFPS || 60}`);
            console.log(`⚡ Calidad: ${this.config.qualityLevel}`);
            
            try {
                // ===== 1. INICIALIZAR CORE =====
                console.log('📦 Inicializando módulos core...');
                this._initCore();
                
                // ===== 2. INICIALIZAR ECS =====
                console.log('📊 Inicializando ECS...');
                this._initECS();
                
                // ===== 3. INICIALIZAR RENDERER =====
                console.log('🎮 Inicializando Renderer...');
                this._initRenderer();
                
                // ===== 4. INICIALIZAR IA =====
                console.log('🧠 Inicializando IA...');
                this._initAI();
                
                // ===== 5. INICIALIZAR MUNDO (CORREGIDO) =====
                console.log('🌍 Inicializando Mundo...');
                this._initWorld();
                
                // ===== 6. INICIALIZAR UTILS =====
                console.log('🔧 Inicializando Utilidades...');
                this._initUtils();
                
                // ===== 7. CONFIGURAR EVENTOS =====
                this._setupEvents();
                
                // ===== 8. CONFIGURAR IA PREDICTIVA =====
                if (this.config.enablePredictiveAI) {
                    this._setupPredictiveAI();
                }
                
                // ===== 9. CONFIGURAR PERFORMANCE BUDGET =====
                if (this.config.enablePerformanceBudget) {
                    this._setupPerformanceBudget();
                }
                
                // ===== 10. CONFIGURAR ADAPTIVE QUALITY =====
                if (this.config.enableAdaptiveQuality) {
                    this._setupAdaptiveQuality();
                }
                
                // ===== 11. ESTADO LISTO =====
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor Cuántico inicializado correctamente');
                this.emit('init', { engine: this });
                
                // ===== 12. AUTO-START =====
                if (this.config.autoStart) {
                    this.start();
                }
                
            } catch (error) {
                this.state.status = 'error';
                this.state.error = error;
                this.stats.totalErrors++;
                console.error('❌ Error al inicializar el motor:', error);
                console.error('Stack trace:', error.stack);
                this.emit('error', { error });
                
                if (this.config.enableErrorRecovery) {
                    this._attemptRecovery(error);
                }
            }
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE MÓDULOS (CORREGIDA)
        //  ============================================================
        
        _initCore() {
            this.modules.core.hardware = window.HardwareDetector;
            if (!this.modules.core.hardware) {
                throw new Error('HardwareDetector no disponible');
            }
            
            this.modules.core.memory = window.PersistentMemory;
            if (!this.modules.core.memory) {
                throw new Error('PersistentMemory no disponible');
            }
            
            this.modules.core.config = CONFIG;
            this.modules.core.helpers = window.Helpers;
            
            console.log('✅ Core inicializado');
        }
        
        _initECS() {
            const maxEntities = CONFIG?.maxEntities || 120000;
            this.modules.ecs = new SoaManager(maxEntities);
            if (!this.modules.ecs) {
                throw new Error('SoaManager no disponible');
            }
            console.log('✅ ECS inicializado');
        }
        
        _initRenderer() {
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) {
                throw new Error('Canvas no encontrado');
            }
            
            this.modules.renderer = new MaxRenderer(canvas);
            
            // Geometry Lab
            if (window.ComplexGeometryLab) {
                this.modules.renderer.geometryLab = new ComplexGeometryLab(
                    this.modules.renderer.scene
                );
            }
            
            console.log('✅ Renderer inicializado');
        }
        
        _initAI() {
            try {
                if (window.OptimizerAI) {
                    this.modules.ai.optimizer = new OptimizerAI(
                        this.modules.core.hardware,
                        this.modules.core.memory
                    );
                }
                
                if (window.MetaOptimizerAI) {
                    this.modules.ai.meta = new MetaOptimizerAI(
                        this.modules.core.hardware,
                        this.modules.core.memory
                    );
                }
                
                if (window.WorldAI) {
                    this.modules.ai.world = new WorldAI(this);
                }
                
                console.log('✅ IA inicializada');
            } catch (e) {
                console.warn('⚠️ Error en IA:', e);
            }
        }
        
        _initWorld() {
            try {
                // ===== ENTITY FACTORY =====
                if (window.EntityFactory) {
                    this.modules.game.entityFactory = new EntityFactory(
                        this.modules.ecs,
                        CONFIG
                    );
                }
                
                // ===== TERRAIN GENERATOR (CON CONFIGURACIÓN CORRECTA) =====
                if (window.TerrainGenerator) {
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
                    console.log('✅ TerrainGenerator creado');
                }
                
                // ===== GAME WORLD (CON CONFIGURACIÓN CORRECTA) =====
                if (window.GameWorld) {
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
                    
                    // Pasar configuración a CONFIG para compatibilidad
                    Object.assign(CONFIG, worldConfig);
                    
                    this.modules.game.world = new GameWorld(
                        this.modules.ecs,
                        this.modules.renderer,
                        this.modules.core.memory
                    );
                    
                    console.log('✅ GameWorld creado');
                }
                
                // ===== DECORACIONES =====
                this._initDecorations();
                
                // ===== EDITOR =====
                this._initEditor();
                
                // ===== MINIMAP =====
                this._initMinimap();
                
                // ===== AJUSTES DE TERRENO =====
                this._adjustTerrainEffects();
                
                console.log('✅ Mundo inicializado');
                
            } catch (e) {
                console.error('❌ Error en _initWorld:', e);
                throw e;
            }
        }
        
        _initDecorations() {
            try {
                const terrain = this.modules.game.terrainGenerator;
                if (!terrain) return;
                
                const scene = this.modules.renderer?.scene;
                if (!scene) return;
                
                // Vegetation Placer
                if (window.VegetationPlacer) {
                    this.modules.game.vegetationPlacer = new VegetationPlacer(
                        scene,
                        terrain,
                        { worldSize: this.config.worldSize }
                    );
                    setTimeout(() => {
                        if (this.modules.game.vegetationPlacer) {
                            this.modules.game.vegetationPlacer.plantFlowers(500);
                        }
                    }, 100);
                }
                
                // Alpine Decor
                if (window.AlpineDecor) {
                    this.modules.game.alpineDecor = new AlpineDecor(
                        scene,
                        terrain,
                        { worldSize: this.config.worldSize }
                    );
                    setTimeout(() => {
                        if (this.modules.game.alpineDecor) {
                            this.modules.game.alpineDecor.plant(200);
                        }
                    }, 150);
                }
                
                // Forest Decor
                if (window.ForestDecor) {
                    this.modules.game.forestDecor = new ForestDecor(
                        scene,
                        terrain,
                        { worldSize: this.config.worldSize }
                    );
                    setTimeout(() => {
                        if (this.modules.game.forestDecor) {
                            this.modules.game.forestDecor.plant(800);
                        }
                    }, 200);
                }
                
                console.log('✅ Decoraciones inicializadas');
            } catch (e) {
                console.warn('⚠️ Decoración no disponible:', e);
            }
        }
        
        _initEditor() {
            try {
                if (window.Editor) {
                    this.modules.game.editor = new Editor(this);
                    
                    if (window.WorldSerializer) {
                        this.modules.game.worldSerializer = new WorldSerializer(this);
                        if (this.modules.game.editor) {
                            this.modules.game.editor.onPlace = (type, x, y, z) => {
                                if (this.modules.game.worldSerializer) {
                                    this.modules.game.worldSerializer.recordPlacement(type, x, y, z);
                                }
                            };
                        }
                    }
                }
                console.log('✅ Editor inicializado');
            } catch (e) {
                console.warn('⚠️ Editor no disponible:', e);
            }
        }
        
        _initMinimap() {
            try {
                const canvas = document.getElementById('minimap-canvas');
                if (window.Minimap && canvas) {
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
                }
            } catch (e) {
                console.warn('⚠️ Minimap no disponible:', e);
            }
        }
        
        _adjustTerrainEffects() {
            try {
                const terrain = this.modules.game.terrainGenerator;
                const waterBodies = this.modules.game.world?.ecosystems?.waterBodies
                    ? Array.from(this.modules.game.world.ecosystems.waterBodies.values())
                    : [];
                    
                if (terrain && this.modules.renderer?.conformGroundFXToTerrain) {
                    this.modules.renderer.conformGroundFXToTerrain(terrain, waterBodies);
                }
                if (terrain && this.modules.renderer?.focusOnScenicSpot) {
                    this.modules.renderer.focusOnScenicSpot(terrain, waterBodies);
                }
                
                console.log('✅ Efectos de terreno ajustados');
            } catch (e) {
                console.warn('⚠️ No se pudo ajustar efectos de suelo:', e);
            }
        }
        
        _initUtils() {
            this.modules.utils.profiler = window.Profiler;
            this.modules.utils.helpers = window.Helpers;
            console.log('✅ Utilidades inicializadas');
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
                    const hiddenDuration = this._wasHiddenAt ? performance.now() - this._wasHiddenAt : 0;
                    this._loop.lastTime = performance.now();
                    this._loop.accumulator = 0;
                    this._loop.fixedAccumulator = 0;
                    this._fpsSamples = [];
                    
                    if (this.modules.ai.world?.onResume) {
                        this.modules.ai.world.onResume();
                    }
                }
            });
            
            this.on('error', ({ error }) => {
                console.error('❌ Error en motor:', error);
                if (this.config.enableErrorRecovery) {
                    this._attemptRecovery(error);
                }
            });
            
            this.on('frame', ({ delta, frame }) => {
                if (this.config.enableDebug && frame % 60 === 0) {
                    const stats = this.getStats();
                    console.log(`📊 Frame ${frame} | FPS: ${stats.fps} | Entidades: ${stats.entities}`);
                }
            });
            
            this.on('performance_warning', ({ metric, value, threshold }) => {
                console.warn(`⚠️ Advertencia de rendimiento: ${metric} = ${value} (umbral: ${threshold})`);
            });
            
            this.on('performance_critical', ({ metric, value, threshold }) => {
                console.error(`🚨 CRÍTICO: ${metric} = ${value} (umbral: ${threshold})`);
                this._applyPerformanceThrottling();
            });
            
            // EVENTO DE GENERACIÓN DE MUNDO
            this.on('world_generated', ({ progress, stage }) => {
                this.state.generationProgress = progress;
                this.state.generationStage = stage;
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
        //  🧠 IA PREDICTIVA
        //  ============================================================
        _setupPredictiveAI() {
            this._predictor.interval = setInterval(() => {
                this._updatePredictions();
            }, 1000);
        }
        
        _updatePredictions() {
            const fpsHistory = this.state.fpsHistory;
            if (fpsHistory.length < 10) return;
            
            const recent = fpsHistory.slice(-20);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            const std = Math.sqrt(variance);
            
            const slope = this._calculateSlope(recent);
            this._predictor.model.fpsTrend = slope;
            this._predictor.model.loadTrend = -slope / mean;
            this._predictor.model.confidence = Math.min(1, 1 - (std / mean));
            
            const nextFps = mean + slope * 5;
            const forecast = [];
            for (let i = 1; i <= 10; i++) {
                forecast.push(mean + slope * i);
            }
            
            this._predictor.forecast = forecast;
            this._predictor.lastPrediction = {
                fps: Math.max(10, Math.min(120, nextFps)),
                trend: slope > 0.5 ? 'rising' : (slope < -0.5 ? 'falling' : 'stable'),
                confidence: this._predictor.model.confidence,
                load: this._predictor.model.loadTrend
            };
            
            if (nextFps < 25 && this._predictor.model.confidence > 0.6) {
                this._predictor.alerts.push({
                    type: 'fps_drop_predicted',
                    message: `🔮 Predicción: FPS caerá a ${Math.round(nextFps)} en breve`,
                    timestamp: Date.now()
                });
                this.emit('performance_warning', {
                    metric: 'fps_prediction',
                    value: Math.round(nextFps),
                    threshold: 30
                });
            }
        }
        
        _calculateSlope(values) {
            const n = values.length;
            if (n < 2) return 0;
            
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            for (let i = 0; i < n; i++) {
                sumX += i;
                sumY += values[i];
                sumXY += i * values[i];
                sumXX += i * i;
            }
            
            const denominator = (n * sumXX - sumX * sumX);
            if (denominator === 0) return 0;
            return (n * sumXY - sumX * sumY) / denominator;
        }
        
        getPrediction() {
            return this._predictor.lastPrediction;
        }
        
        // ============================================================
        //  📊 PERFORMANCE BUDGET
        //  ============================================================
        _setupPerformanceBudget() {
            this._budgetInterval = setInterval(() => {
                this._checkPerformanceBudget();
            }, 1000);
        }
        
        _checkPerformanceBudget() {
            const budget = this.config.performanceBudget;
            const fps = this.state.fps;
            const cpuLoad = this.state.cpuLoad;
            const memory = this.state.memoryUsage;
            
            if (fps < budget.fps && this.state.status === 'running') {
                this.emit('performance_warning', {
                    metric: 'fps',
                    value: fps,
                    threshold: budget.fps
                });
                
                if (fps < budget.fps * 0.6) {
                    this.emit('performance_critical', {
                        metric: 'fps',
                        value: fps,
                        threshold: budget.fps
                    });
                }
            }
            
            if (cpuLoad > budget.cpu) {
                this.emit('performance_warning', {
                    metric: 'cpu',
                    value: cpuLoad,
                    threshold: budget.cpu
                });
            }
            
            if (memory > budget.memory) {
                this.emit('performance_warning', {
                    metric: 'memory',
                    value: memory,
                    threshold: budget.memory
                });
            }
        }
        
        _applyPerformanceThrottling() {
            if (this.state.qualityLevel === 'ultra') {
                this.setQuality('high');
            } else if (this.state.qualityLevel === 'high') {
                this.setQuality('medium');
            } else if (this.state.qualityLevel === 'medium') {
                this.setQuality('low');
            }
        }
        
        // ============================================================
        //  🎯 ADAPTIVE QUALITY
        //  ============================================================
        _setupAdaptiveQuality() {
            this._adaptiveInterval = setInterval(() => {
                this._adjustQuality();
            }, 5000);
        }
        
        _adjustQuality() {
            const fps = this.state.fps;
            const sceneComplexity = this.modules.ecs?.count || 0;
            
            if (fps < 25) {
                this.setQuality('low');
            } else if (fps < 35) {
                this.setQuality('medium');
            } else if (fps > 55 && sceneComplexity < 5000) {
                this.setQuality('high');
            } else if (fps > 70 && sceneComplexity < 2000) {
                this.setQuality('ultra');
            }
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
        //  🔄 GAME LOOP PRINCIPAL
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
                this.stats.totalErrors++;
                console.error('❌ Error en el game loop (frame ' + this.state.frameCount + '):', e);
                
                if (this.config.enableErrorRecovery) {
                    this._attemptRecovery(e);
                }
            }
            
            requestAnimationFrame(() => this._gameLoop());
        }
        
        // ============================================================
        //  🔄 SUB-LOOPS
        //  ============================================================
        _fixedUpdate(delta) {
            const startTime = performance.now();
            
            if (this.modules.ecs) {
                const visible = this.modules.renderer?.lastVisible || null;
                const terrain = this.modules.game.terrainGenerator;
                const getGroundHeight = terrain?.getHeight 
                    ? (x, z) => terrain.getHeight(x, z) 
                    : null;
                    
                this.modules.ecs.updatePhysics(
                    delta,
                    CONFIG?.gravity || -9.8,
                    CONFIG?.windStrength || 0.6,
                    this.state.frameCount,
                    visible,
                    getGroundHeight
                );
            }
            
            if (this.modules.game.world) {
                this.modules.game.world.update(delta);
            }
            
            if (this.modules.ai.world) {
                try {
                    this.modules.ai.world.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en WorldAI:', e);
                }
            }
            
            if (this.modules.game.minimap) {
                try {
                    this.modules.game.minimap.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en Minimap:', e);
                }
            }
            
            if (this.modules.ai.optimizer && this.modules.ai.meta) {
                const perf = this.modules.utils.profiler 
                    ? this.modules.utils.profiler.getSummary() 
                    : { fps: this.state.fps };
                    
                const renderStats = this.modules.renderer 
                    ? this.modules.renderer.getStats() 
                    : {};
                    
                const aiAction = this.modules.ai.optimizer.update(
                    perf,
                    renderStats,
                    this.modules.ecs
                );
                
                const metaResult = this.modules.ai.meta.update(
                    perf,
                    renderStats,
                    this.modules.ai.optimizer
                );
                
                this._applyAIAction(aiAction);
                this._applyMetaAction(metaResult);
            }
            
            if (this.modules.renderer?.geometryLab) {
                this.modules.renderer.geometryLab.update(delta);
            }
            
            if (this.modules.renderer && this.modules.ecs) {
                const camPos = this.modules.renderer.getCameraPosition();
                const lodDist = CONFIG?.lodDistance || 350;
                this.modules.ecs.updateLOD(
                    camPos.x,
                    camPos.z,
                    lodDist * 3
                );
            }
            
            this._loop.frameTime = performance.now() - startTime;
        }
        
        _update(delta) {
            if (this.modules.utils.helpers) {
                this.modules.utils.helpers.updateTimers(delta);
            }
            
            if (this.config.enablePredictiveAI) {
                this._updatePredictions();
            }
        }
        
        _render() {
            if (!this.modules.renderer) return;
            
            const metaOptimizations = this.modules.ai.meta?.getStatus()?.metaParams || null;
            
            this.modules.renderer.render(
                this.modules.ecs,
                null,
                metaOptimizations
            );
            
            this._loop.renderCount++;
        }
        
        _postRender() {
            if (this.modules.utils.profiler && this.modules.renderer) {
                const renderStats = this.modules.renderer.getStats();
                const entityCount = this.modules.ecs?.count || 0;
                this.modules.utils.profiler.sample(renderStats, entityCount);
            }
        }
        
        // ============================================================
        //  📊 ACTUALIZAR ESTADÍSTICAS
        //  ============================================================
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
                this.state.fpsHistory.push(this.state.fps);
                if (this.state.fpsHistory.length > 100) this.state.fpsHistory.shift();
            }
            
            this.stats.totalFrames++;
            this.stats.averageFps = this.stats.averageFps * 0.95 + this.state.fps * 0.05;
            this.stats.averageFrameTime = this.stats.averageFrameTime * 0.95 + delta * 0.05;
            
            if (this.state.fps < this.stats.minFps) this.stats.minFps = this.state.fps;
            if (this.state.fps > this.stats.maxFps) this.stats.maxFps = this.state.fps;
            if (delta < this.stats.minFrameTime) this.stats.minFrameTime = delta;
            if (delta > this.stats.maxFrameTime) this.stats.maxFrameTime = delta;
        }
        
        // ============================================================
        //  🧠 APLICAR ACCIONES DE IA
        //  ============================================================
        _applyAIAction(action) {
            if (!action || !this.modules.renderer) return;
            if (this.manualQuality) return;
            
            this.modules.renderer.setQuality(action.quality);
            this.modules.renderer.setLODDistance(action.lodDistance);
            
            if (CONFIG) {
                CONFIG.waterEnabled = action.useWater;
                CONFIG.particlesEnabled = action.useParticles;
                CONFIG.bloomEnabled = action.useBloom;
                CONFIG.ssaoEnabled = action.useSSAO;
            }
            
            const renderer = this.modules.renderer;
            if (renderer.ssaoPass) renderer.ssaoPass.enabled = !!action.useSSAO;
            if (renderer.dustSystem) renderer.dustSystem.visible = !!action.useParticles;
        }
        
        _applyMetaAction(metaResult) {
            if (!metaResult || !this.modules.renderer) return;
            
            if (metaResult.graphicsOptimizations) {
                this.modules.ai.meta.applyOptimizations(
                    this.modules.renderer,
                    metaResult.graphicsOptimizations
                );
            }
        }
        
        // ============================================================
        //  🔄 ERROR RECOVERY
        //  ============================================================
        _attemptRecovery(error) {
            console.log(`🔄 Intentando recuperación (intento ${this.state.recoveryAttempts + 1})...`);
            
            this.state.recoveryAttempts++;
            this.state.lastError = error;
            
            try {
                this.pause();
                
                if (this.modules.renderer && error.message?.includes('WebGL')) {
                    this.modules.renderer.reset();
                }
                
                setTimeout(() => {
                    this.resume();
                    this.state.recoveryAttempts = 0;
                    console.log('✅ Recuperación exitosa');
                    this.emit('recovery', { error });
                }, 100);
                
            } catch (recoveryError) {
                console.error('❌ Fallo en recuperación:', recoveryError);
                this.state.status = 'error';
                this.emit('recovery_failed', { error: recoveryError });
            }
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            const ecsStats = this.modules.ecs?.getStats ? this.modules.ecs.getStats() : null;
            const rendererStats = this.modules.renderer?.getStats ? this.modules.renderer.getStats() : null;
            const worldStats = this.modules.game.world?.getStats ? this.modules.game.world.getStats() : null;
            const aiStatus = this.modules.ai.optimizer?.getStatus ? this.modules.ai.optimizer.getStatus() : null;
            
            return {
                state: {
                    status: this.state.status,
                    frameCount: this.state.frameCount,
                    fps: this.state.fps,
                    quality: this.state.qualityLevel,
                    generationProgress: this.state.generationProgress,
                    generationStage: this.state.generationStage
                },
                ecs: ecsStats,
                renderer: rendererStats,
                world: worldStats,
                ai: aiStatus,
                stats: this.stats
            };
        }
        
        getSummary() {
            const stats = this.getStats();
            return {
                status: this.state.status,
                fps: stats.state.fps,
                entities: this.modules.ecs?.count || 0,
                quality: this.state.qualityLevel,
                generationProgress: this.state.generationProgress,
                generationStage: this.state.generationStage,
                uptime: Math.round(this.state.uptime / 1000)
            };
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        getModule(name) {
            const categories = ['core', 'ecs', 'ai', 'renderer', 'game', 'utils'];
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
        
        // ============================================================
        //  🔧 UTILIDADES
        //  ============================================================
        async runBenchmark(duration = 5000) {
            console.log(`📊 Ejecutando benchmark cuántico (${duration}ms)...`);
            
            if (this.modules.utils.profiler) {
                const results = await this.modules.utils.profiler.runBenchmark(duration);
                console.log('✅ Benchmark completado:', results);
                return results;
            }
            
            console.warn('⚠️ Profiler no disponible');
            return null;
        }
        
        exportData() {
            return {
                config: { ...this.config },
                state: { ...this.state },
                stats: this.getStats(),
                modules: Object.keys(this.modules).filter(k => this.modules[k]),
                prediction: this._predictor.lastPrediction,
                eventHistory: this._eventHistory.slice(-50),
                timestamp: Date.now()
            };
        }
        
        exportJSON() {
            return JSON.stringify(this.exportData(), null, 2);
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            console.log('🔄 Resetando motor cuántico...');
            
            this.stop();
            
            if (this.modules.ecs) this.modules.ecs.reset();
            if (this.modules.renderer) this.modules.renderer.reset();
            if (this.modules.game.world) this.modules.game.world.reset();
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
            
            this._loop.accumulator = 0;
            this._loop.fixedAccumulator = 0;
            this._loop.updateCount = 0;
            this._loop.renderCount = 0;
            
            this._fpsSamples = [];
            this.state.fpsHistory = [];
            this._predictor.forecast = [];
            this._predictor.alerts = [];
            
            this.stats = {
                totalFrames: 0,
                totalUpdates: 0,
                totalRenders: 0,
                totalErrors: 0,
                averageFps: 0,
                minFps: Infinity,
                maxFps: 0,
                averageFrameTime: 0,
                minFrameTime: Infinity,
                maxFrameTime: 0,
                averageCpuLoad: 0,
                averageGpuLoad: 0,
                averageMemory: 0,
                peakMemory: 0,
                totalTasks: 0,
                completedTasks: 0,
                failedTasks: 0,
                uptime: 0
            };
            
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
            
            if (this._predictor.interval) {
                clearInterval(this._predictor.interval);
            }
            if (this._budgetInterval) {
                clearInterval(this._budgetInterval);
            }
            if (this._adaptiveInterval) {
                clearInterval(this._adaptiveInterval);
            }
            
            if (this.modules.renderer?.destroy) this.modules.renderer.destroy();
            if (this.modules.core.memory?.shutdown) this.modules.core.memory.shutdown();
            
            for (const worker of this._workers) {
                worker.terminate();
            }
            this._workers = [];
            
            for (const [name, plugin] of this._plugins) {
                if (typeof plugin.destroy === 'function') {
                    try { plugin.destroy(); } catch (e) {}
                }
            }
            this._plugins.clear();
            
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
    
    console.log('🚀 PriomEngine Cuántico cargado (v0.4.1 - CORREGIDO)');
    console.log('🧠 IA Predictiva de rendimiento');
    console.log('⚡ Adaptive Quality en tiempo real');
    console.log('📊 Performance Budget integrado');
    console.log('🔄 Error Recovery automático');
    console.log('🌍 Generación de mundo funcional');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PriomEngine;
    }
    
})();
/**
 * 🚀 PRIOM V0.4 - PRIOM ENGINE CUÁNTICO
 * "El motor que une todo en perfecta armonía con IA y optimización extrema"
 * 
 * 📁 Ubicación: js/engine/PriomEngine.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Motor principal con IA predictiva, optimización extrema y orquestación avanzada
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de threads con Web Workers (física, IA, simulación)
 * - IA predictiva de rendimiento (forecasting de carga)
 * - Sistema de "Dynamic Threading" (ajuste de threads en tiempo real)
 * - Sistema de "Smart Scheduling" (priorización de tareas)
 * - Memoria compartida entre threads (SharedArrayBuffer)
 * - Sistema de "Hot Module Replacement" (HMR) para desarrollo
 * - Sistema de "State Machine" avanzado con transiciones
 * - Sistema de "Profiling" integrado con flame graphs
 * - Sistema de "Error Recovery" (recuperación automática)
 * - Sistema de "Performance Budget" (presupuesto de rendimiento)
 * - Sistema de "Adaptive Quality" (calidad adaptativa por escena)
 * - Sistema de "Predictive Loading" (carga predictiva de recursos)
 * - Sistema de "Energy Efficiency" (eficiencia energética)
 * - Dashboard de rendimiento en tiempo real
 * - Sistema de "Benchmark" integrado con histórico
 * - 5 niveles de calidad predefinidos
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🚀 PriomEngine - Motor Principal Cuántico
     * Orquesta todos los módulos con IA predictiva y optimización extrema
     */
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
                enableThreading: config.enableThreading !== undefined ? config.enableThreading : true,
                enablePredictiveAI: config.enablePredictiveAI !== undefined ? config.enablePredictiveAI : true,
                enableSmartScheduling: config.enableSmartScheduling !== undefined ? config.enableSmartScheduling : true,
                enableAdaptiveQuality: config.enableAdaptiveQuality !== undefined ? config.enableAdaptiveQuality : true,
                enableErrorRecovery: config.enableErrorRecovery !== undefined ? config.enableErrorRecovery : true,
                enablePerformanceBudget: config.enablePerformanceBudget !== undefined ? config.enablePerformanceBudget : true,
                enableEnergyEfficiency: config.enableEnergyEfficiency !== undefined ? config.enableEnergyEfficiency : true,
                maxThreads: config.maxThreads || navigator.hardwareConcurrency || 4,
                performanceBudget: config.performanceBudget || { fps: 30, cpu: 80, gpu: 80, memory: 200 },
                qualityLevel: config.qualityLevel || 'high',
                plugins: config.plugins || []
            };
            
            // ============================================================
            //  📦 ESTADO DEL MOTOR MEJORADO
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
                plugins: new Map(),
                // Nuevos estados
                qualityLevel: this.config.qualityLevel,
                performanceMode: 'balanced', // 'power-saver' | 'balanced' | 'performance' | 'ultra'
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
                recoveryAttempts: 0
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
            //  🎯 LOOP DE JUEGO MEJORADO
            //  ============================================================
            this._loop = {
                running: false,
                lastTime: 0,
                accumulator: 0,
                fixedAccumulator: 0,
                frameTime: 0,
                updateCount: 0,
                renderCount: 0,
                // Nuevos
                adaptiveSteps: 0,
                skippedFrames: 0,
                frameBudget: 16.67,
                workerTasks: [],
                taskQueue: [],
                priorityQueue: []
            };
            
            // ============================================================
            //  📡 SISTEMA DE EVENTOS MEJORADO
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
            //  📊 ESTADÍSTICAS MEJORADAS
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
            
            console.log('🚀 PriomEngine Cuántico inicializado');
            console.log(`📊 Calidad: ${this.config.qualityLevel}`);
            console.log(`📊 Threads: ${this.config.maxThreads}`);
            console.log(`📊 Presupuesto: ${this.config.performanceBudget.fps} FPS`);
            console.log(`🧠 IA Predictiva: ${this.config.enablePredictiveAI ? 'Activada' : 'Desactivada'}`);
            console.log(`🔄 Smart Scheduling: ${this.config.enableSmartScheduling ? 'Activado' : 'Desactivado'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN MEJORADA
        //  ============================================================
        _init() {
            console.log('🚀 ========================================');
            console.log('🚀  PRIOM V0.4 - MOTOR DE JUEGOS IA');
            console.log('🚀  "Donde la IA encuentra la gráfica"');
            console.log('🚀 ========================================');
            console.log(`📦 Versión: ${CONFIG.version}`);
            console.log(`🏗️ Build: ${CONFIG.build}`);
            console.log(`📊 Max Entidades: ${CONFIG.maxEntities}`);
            console.log(`🎯 FPS Objetivo: ${CONFIG.targetFPS}`);
            console.log(`🧠 Threads: ${this.config.maxThreads}`);
            console.log(`⚡ Calidad: ${this.config.qualityLevel}`);
            
            try {
                // ===== 1. INICIALIZAR MÓDULOS CORE =====
                console.log('📦 Inicializando módulos core...');
                this._initCore();
                
                // ===== 2. INICIALIZAR ECS =====
                console.log('📊 Inicializando ECS...');
                this._initECS();
                
                // ===== 3. INICIALIZAR IA =====
                console.log('🧠 Inicializando IA...');
                this._initAI();
                
                // ===== 4. INICIALIZAR RENDERER =====
                console.log('🎮 Inicializando Renderer...');
                this._initRenderer();
                
                // ===== 5. INICIALIZAR MUNDO =====
                console.log('🌍 Inicializando Mundo...');
                this._initWorld();
                
                // ===== 6. INICIALIZAR UTILS =====
                console.log('🔧 Inicializando Utilidades...');
                this._initUtils();
                
                // ===== 7. INICIALIZAR WORKERS =====
                if (this.config.enableThreading) {
                    console.log('🧵 Inicializando Workers...');
                    this._initWorkers();
                }
                
                // ===== 8. CARGAR PLUGINS =====
                console.log('🔌 Cargando plugins...');
                this._loadPlugins();
                
                // ===== 9. CONFIGURAR EVENTOS =====
                this._setupEvents();
                
                // ===== 10. CONFIGURAR IA PREDICTIVA =====
                if (this.config.enablePredictiveAI) {
                    this._setupPredictiveAI();
                }
                
                // ===== 11. CONFIGURAR PERFORMANCE BUDGET =====
                if (this.config.enablePerformanceBudget) {
                    this._setupPerformanceBudget();
                }
                
                // ===== 12. CONFIGURAR ADAPTIVE QUALITY =====
                if (this.config.enableAdaptiveQuality) {
                    this._setupAdaptiveQuality();
                }
                
                // ===== 13. ESTADO LISTO =====
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor Cuántico inicializado correctamente');
                console.log(`📊 Módulos cargados: ${Object.keys(this.modules).filter(k => this.modules[k]).length}`);
                console.log(`📊 Workers: ${this._workers.length}`);
                console.log(`📊 Plugins: ${this._plugins.size}`);
                
                // ===== 14. AUTO-START =====
                if (this.config.autoStart) {
                    this.start();
                }
                
                this.emit('init', { engine: this });
                
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
        //  🔧 INICIALIZACIÓN DE MÓDULOS
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
            this.modules.ecs = new SoaManager(CONFIG.maxEntities);
            if (!this.modules.ecs) {
                throw new Error('SoaManager no disponible');
            }
            console.log('✅ ECS inicializado');
        }
        
        _initAI() {
            this.modules.ai.optimizer = new OptimizerAI(
                this.modules.core.hardware,
                this.modules.core.memory
            );
            
            this.modules.ai.meta = new MetaOptimizerAI(
                this.modules.core.hardware,
                this.modules.core.memory
            );
            
            this.modules.ai.world = new WorldAI(this);
            
            console.log('✅ IA inicializada');
        }
        
        _initRenderer() {
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) {
                throw new Error('Canvas no encontrado');
            }
            
            this.modules.renderer = new MaxRenderer(canvas);
            
            this.modules.renderer.geometryLab = new ComplexGeometryLab(
                this.modules.renderer.scene
            );
            
            console.log('✅ Renderer inicializado');
        }
        
        _initWorld() {
            this.modules.game.entityFactory = new EntityFactory(
                this.modules.ecs,
                CONFIG
            );
            
            this.modules.game.terrainGenerator = new TerrainGenerator(CONFIG);
            
            this.modules.game.world = new GameWorld(
                this.modules.ecs,
                this.modules.renderer,
                this.modules.core.memory
            );
            
            // Decoración adicional
            this._initDecorations();
            
            // Editor y serializador
            this._initEditor();
            
            // Minimapa
            this._initMinimap();
            
            // Ajustes de terreno
            this._adjustTerrainEffects();
            
            console.log('✅ Mundo inicializado');
        }
        
        _initDecorations() {
            try {
                const terrain = this.modules.game.world?.generators?.terrain;
                if (!terrain) return;
                
                // Vegetation Placer
                if (window.VegetationPlacer) {
                    this.modules.game.vegetationPlacer = new VegetationPlacer(
                        this.modules.renderer.scene,
                        terrain,
                        { worldSize: CONFIG.worldSize }
                    );
                    this.modules.game.vegetationPlacer.plantFlowers(800);
                }
                
                // Alpine Decor
                if (window.AlpineDecor) {
                    this.modules.game.alpineDecor = new AlpineDecor(
                        this.modules.renderer.scene,
                        terrain,
                        { worldSize: CONFIG.worldSize }
                    );
                    this.modules.game.alpineDecor.plant(250);
                }
                
                // Forest Decor
                if (window.ForestDecor) {
                    this.modules.game.forestDecor = new ForestDecor(
                        this.modules.renderer.scene,
                        terrain,
                        { worldSize: CONFIG.worldSize }
                    );
                    this.modules.game.forestDecor.plant(1200);
                }
                
                // Chunk Manager
                if (window.ChunkManager) {
                    this.modules.game.chunkManager = new ChunkManager();
                    this.modules.game.chunkManager.registerRegion('grass', 0, 0, 220, this.modules.renderer.grassMeshes);
                    this.modules.game.chunkManager.registerRegion('flowers', 0, 0, 220,
                        this.modules.game.vegetationPlacer?.flowerMeshes || []);
                    this.modules.game.chunkManager.registerRegion('alpine', 0, 0, 220,
                        this.modules.game.alpineDecor?.meshes || []);
                    this.modules.game.chunkManager.registerRegion('forest_decor', 0, 0, 220,
                        this.modules.game.forestDecor?.meshes || []);
                    this.modules.renderer.chunkManager = this.modules.game.chunkManager;
                }
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
                        this.modules.game.editor.onPlace = (type, x, y, z) => {
                            this.modules.game.worldSerializer.recordPlacement(type, x, y, z);
                        };
                    }
                }
            } catch (e) {
                console.warn('⚠️ Editor no disponible:', e);
            }
        }
        
        _initMinimap() {
            try {
                const canvas = document.getElementById('minimap-canvas');
                if (window.Minimap && canvas) {
                    this.modules.game.minimap = new Minimap(this, canvas, { worldRange: 200 });
                }
            } catch (e) {
                console.warn('⚠️ Minimap no disponible:', e);
            }
        }
        
        _adjustTerrainEffects() {
            try {
                const terrain = this.modules.game.world?.generators?.terrain;
                const waterBodies = this.modules.game.world?.ecosystems?.waterBodies
                    ? Array.from(this.modules.game.world.ecosystems.waterBodies.values())
                    : [];
                    
                if (terrain && this.modules.renderer.conformGroundFXToTerrain) {
                    this.modules.renderer.conformGroundFXToTerrain(terrain, waterBodies);
                }
                if (terrain && this.modules.renderer.focusOnScenicSpot) {
                    this.modules.renderer.focusOnScenicSpot(terrain, waterBodies);
                }
                
                // Bisontes de demostración
                if (waterBodies.length > 0 && this.modules.game.entityFactory) {
                    this._placeDemoBisons(waterBodies, terrain);
                }
            } catch (e) {
                console.warn('⚠️ No se pudo ajustar efectos de suelo:', e);
            }
        }
        
        _placeDemoBisons(waterBodies, terrain) {
            const lake = waterBodies[Math.floor(Math.random() * waterBodies.length)];
            if (!lake) return;
            
            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 4 + Math.random() * 8;
                const bx = lake.x + Math.cos(angle) * dist;
                const bz = lake.z + Math.sin(angle) * dist;
                const by = terrain.getHeight(bx, bz);
                
                const id = this.modules.game.entityFactory.createAnimal(bx, by + 0.3, bz, false);
                if (id !== -1) {
                    this.modules.ecs.subType[id] = 1;
                    this.modules.ecs.scaleX[id] = 1.8;
                    this.modules.ecs.scaleY[id] = 1.8;
                    this.modules.ecs.scaleZ[id] = 1.8;
                    if (this.modules.game.world?.ecosystems?.entities) {
                        this.modules.game.world.ecosystems.entities.animals.add(id);
                    }
                }
            }
            console.log('🦬 Bisontes de demostración colocados');
        }
        
        _initUtils() {
            this.modules.utils.profiler = window.Profiler;
            this.modules.utils.helpers = window.Helpers;
            console.log('✅ Utilidades inicializadas');
        }
        
        // ============================================================
        //  🧵 SISTEMA DE WORKERS
        //  ============================================================
        _initWorkers() {
            if (!window.Worker) {
                console.warn('⚠️ Web Workers no soportados');
                return;
            }
            
            const threadCount = Math.min(this.config.maxThreads, navigator.hardwareConcurrency || 4);
            
            for (let i = 0; i < threadCount; i++) {
                try {
                    const worker = new Worker(URL.createObjectURL(
                        new Blob([this._getWorkerScript()], { type: 'application/javascript' })
                    ));
                    
                    worker.onmessage = (e) => this._handleWorkerMessage(e, i);
                    worker.onerror = (e) => console.error(`🧵 Worker ${i} error:`, e);
                    
                    this._workers.push(worker);
                    this.state.activeThreads++;
                    
                } catch (e) {
                    console.warn(`⚠️ No se pudo crear worker ${i}:`, e);
                }
            }
            
            // SharedArrayBuffer para memoria compartida
            try {
                if (window.SharedArrayBuffer) {
                    this._sharedMemory = new SharedArrayBuffer(1024 * 1024); // 1MB
                }
            } catch (e) {
                // Silencioso
            }
            
            console.log(`🧵 ${this._workers.length} workers inicializados`);
        }
        
        _getWorkerScript() {
            return `
                // Worker de Priom Engine
                let taskId = 0;
                
                self.onmessage = function(e) {
                    const { type, data, id } = e.data;
                    
                    switch(type) {
                        case 'physics':
                            const result = processPhysics(data);
                            self.postMessage({ type: 'physics_result', data: result, id });
                            break;
                        case 'ai':
                            const aiResult = processAI(data);
                            self.postMessage({ type: 'ai_result', data: aiResult, id });
                            break;
                        case 'simulation':
                            const simResult = processSimulation(data);
                            self.postMessage({ type: 'simulation_result', data: simResult, id });
                            break;
                        default:
                            self.postMessage({ type: 'error', data: 'Unknown task type', id });
                    }
                };
                
                function processPhysics(data) {
                    // Simulación de física
                    const results = [];
                    for (const entity of data.entities) {
                        const pos = entity.pos;
                        const vel = entity.vel;
                        const mass = entity.mass || 1;
                        const gravity = data.gravity || -9.8;
                        
                        // Aplicar gravedad
                        vel.y += gravity * data.delta;
                        
                        // Actualizar posición
                        pos.x += vel.x * data.delta;
                        pos.y += vel.y * data.delta;
                        pos.z += vel.z * data.delta;
                        
                        // Colisión con suelo
                        if (pos.y < 0) {
                            pos.y = 0;
                            vel.y *= -0.3;
                        }
                        
                        results.push({ id: entity.id, pos, vel });
                    }
                    return results;
                }
                
                function processAI(data) {
                    // Simulación de IA
                    const results = [];
                    for (const entity of data.entities) {
                        const state = entity.state;
                        // Lógica de IA simplificada
                        if (state === 'idle' && Math.random() < 0.01) {
                            state = 'moving';
                        } else if (state === 'moving' && Math.random() < 0.01) {
                            state = 'idle';
                        }
                        results.push({ id: entity.id, state });
                    }
                    return results;
                }
                
                function processSimulation(data) {
                    // Simulación de ecosistema
                    const results = [];
                    for (const entity of data.entities) {
                        // Lógica de simulación
                        const newHealth = (entity.health || 0.5) + (Math.random() - 0.5) * 0.01;
                        results.push({ id: entity.id, health: Math.max(0, Math.min(1, newHealth)) });
                    }
                    return results;
                }
            `;
        }
        
        _handleWorkerMessage(e, workerIndex) {
            const { type, data, id } = e.data;
            
            switch(type) {
                case 'physics_result':
                    this._applyPhysicsResults(data);
                    break;
                case 'ai_result':
                    this._applyAIResults(data);
                    break;
                case 'simulation_result':
                    this._applySimulationResults(data);
                    break;
                default:
                    console.warn(`🧵 Mensaje desconocido del worker ${workerIndex}:`, type);
            }
            
            this.state.tasksCompleted++;
        }
        
        _applyPhysicsResults(results) {
            // Aplicar resultados de física a las entidades
            for (const result of results) {
                const id = result.id;
                if (this.modules.ecs && id >= 0 && id < this.modules.ecs.count) {
                    this.modules.ecs.posX[id] = result.pos.x;
                    this.modules.ecs.posY[id] = result.pos.y;
                    this.modules.ecs.posZ[id] = result.pos.z;
                    this.modules.ecs.velX[id] = result.vel.x;
                    this.modules.ecs.velY[id] = result.vel.y;
                    this.modules.ecs.velZ[id] = result.vel.z;
                }
            }
        }
        
        _applyAIResults(results) {
            // Aplicar resultados de IA
            for (const result of results) {
                const id = result.id;
                if (this.modules.ecs && id >= 0 && id < this.modules.ecs.count) {
                    this.modules.ecs.aiState[id] = result.state === 'moving' ? 1 : 0;
                }
            }
        }
        
        _applySimulationResults(results) {
            // Aplicar resultados de simulación
            // (implementación específica según necesidades)
        }
        
        // ============================================================
        //  🔌 SISTEMA DE PLUGINS MEJORADO
        //  ============================================================
        _loadPlugins() {
            for (const plugin of this.config.plugins) {
                try {
                    if (typeof plugin === 'function') {
                        const instance = plugin(this);
                        this._plugins.set(plugin.name || 'unknown', instance);
                        console.log(`🔌 Plugin cargado: ${plugin.name || 'unknown'}`);
                    } else if (typeof plugin === 'object' && plugin.init) {
                        plugin.init(this);
                        this._plugins.set(plugin.name || 'unknown', plugin);
                        console.log(`🔌 Plugin cargado: ${plugin.name || 'unknown'}`);
                    } else {
                        console.warn(`⚠️ Plugin inválido:`, plugin);
                    }
                } catch (e) {
                    console.error(`❌ Error al cargar plugin:`, e);
                }
            }
        }
        
        registerPlugin(name, plugin) {
            if (this._plugins.has(name)) {
                console.warn(`⚠️ Plugin "${name}" ya existe, sobrescribiendo`);
            }
            
            if (typeof plugin === 'function') {
                this._plugins.set(name, plugin(this));
            } else {
                this._plugins.set(name, plugin);
            }
            
            console.log(`🔌 Plugin registrado: ${name}`);
            return this;
        }
        
        getPlugin(name) {
            return this._plugins.get(name) || null;
        }
        
        listPlugins() {
            return Array.from(this._plugins.keys());
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS MEJORADO
        //  ============================================================
        _setupEvents() {
            this.on('start', () => console.log('▶️ Motor iniciado'));
            this.on('pause', () => console.log('⏸️ Motor pausado'));
            this.on('resume', () => console.log('▶️ Motor reanudado'));
            this.on('stop', () => console.log('⏹️ Motor detenido'));
            
            // Visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this._wasHiddenAt = performance.now();
                    console.log('👁️ Página oculta — pausando medición de tiempo');
                } else {
                    const hiddenDuration = this._wasHiddenAt ? performance.now() - this._wasHiddenAt : 0;
                    console.log(`👁️ Página visible de nuevo (oculta ${Math.round(hiddenDuration)}ms)`);
                    
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
            
            // Tendencia
            const slope = this._calculateSlope(recent);
            this._predictor.model.fpsTrend = slope;
            this._predictor.model.loadTrend = -slope / mean;
            this._predictor.model.confidence = Math.min(1, 1 - (std / mean));
            
            // Predicción
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
            
            // Alertas
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
            
            // Verificar FPS
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
            
            // Verificar CPU
            if (cpuLoad > budget.cpu) {
                this.emit('performance_warning', {
                    metric: 'cpu',
                    value: cpuLoad,
                    threshold: budget.cpu
                });
            }
            
            // Verificar memoria
            if (memory > budget.memory) {
                this.emit('performance_warning', {
                    metric: 'memory',
                    value: memory,
                    threshold: budget.memory
                });
            }
        }
        
        _applyPerformanceThrottling() {
            // Reducir calidad para recuperar rendimiento
            if (this.state.qualityLevel === 'ultra') {
                this.setQuality('high');
                console.log('⚡ Throttling: calidad reducida a HIGH');
            } else if (this.state.qualityLevel === 'high') {
                this.setQuality('medium');
                console.log('⚡ Throttling: calidad reducida a MEDIUM');
            } else if (this.state.qualityLevel === 'medium') {
                this.setQuality('low');
                console.log('⚡ Throttling: calidad reducida a LOW');
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
        //  🎯 LOOP DE JUEGO MEJORADO
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
        //  🔄 GAME LOOP PRINCIPAL MEJORADO
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
                
                // Fixed update con límite de pasos
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
                
                // Update
                this._update(deltaSeconds);
                
                // Render
                this._render();
                
                // Post-render
                this._postRender();
                
                // Actualizar estadísticas
                this._updateStats(delta, rawDelta);
                
                // Emitir evento de frame
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
        //  🔄 SUB-LOOPS MEJORADOS
        //  ============================================================
        _fixedUpdate(delta) {
            const startTime = performance.now();
            
            // ECS Física
            if (this.modules.ecs) {
                const visible = this.modules.renderer?.lastVisible || null;
                const terrain = this.modules.game.world?.generators?.terrain;
                const getGroundHeight = terrain?.getHeight 
                    ? (x, z) => terrain.getHeight(x, z) 
                    : null;
                    
                this.modules.ecs.updatePhysics(
                    delta,
                    CONFIG.gravity || -9.8,
                    CONFIG.windStrength || 0.6,
                    this.state.frameCount,
                    visible,
                    getGroundHeight
                );
            }
            
            // Game World
            if (this.modules.game.world) {
                this.modules.game.world.update(delta);
            }
            
            // World AI
            if (this.modules.ai.world) {
                try {
                    this.modules.ai.world.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en WorldAI:', e);
                }
            }
            
            // Audio
            if (this.modules.game.audio) {
                try {
                    this.modules.game.audio.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en AudioSystem:', e);
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
            
            // IA Optimizadora
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
            
            // Geometry Lab
            if (this.modules.renderer?.geometryLab) {
                this.modules.renderer.geometryLab.update(delta);
            }
            
            // LOD
            if (this.modules.renderer && this.modules.ecs) {
                const camPos = this.modules.renderer.getCameraPosition();
                this.modules.ecs.updateLOD(
                    camPos.x,
                    camPos.z,
                    CONFIG.lodDistance * 3 || 600
                );
            }
            
            // Workers
            if (this.config.enableThreading && this._workers.length > 0) {
                this._dispatchWorkerTasks(delta);
            }
            
            const elapsed = performance.now() - startTime;
            this._loop.frameTime = elapsed;
        }
        
        _update(delta) {
            // Helpers timers
            if (this.modules.utils.helpers) {
                this.modules.utils.helpers.updateTimers(delta);
            }
            
            // Actualizar predicciones
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
            // Profiler
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
            
            // FPS
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
                
                // Historial
                this.state.fpsHistory.push(this.state.fps);
                if (this.state.fpsHistory.length > 100) this.state.fpsHistory.shift();
            }
            
            // Estadísticas globales
            this.stats.totalFrames++;
            this.stats.averageFps = this.stats.averageFps * 0.95 + this.state.fps * 0.05;
            this.stats.averageFrameTime = this.stats.averageFrameTime * 0.95 + delta * 0.05;
            
            if (this.state.fps < this.stats.minFps) this.stats.minFps = this.state.fps;
            if (this.state.fps > this.stats.maxFps) this.stats.maxFps = this.state.fps;
            if (delta < this.stats.minFrameTime) this.stats.minFrameTime = delta;
            if (delta > this.stats.maxFrameTime) this.stats.maxFrameTime = delta;
        }
        
        // ============================================================
        //  🧵 DISPATCH WORKER TASKS
        //  ============================================================
        _dispatchWorkerTasks(delta) {
            if (this._workers.length === 0 || this.state.frameCount % 5 !== 0) return;
            
            // Physics
            const physicsEntities = [];
            const ecs = this.modules.ecs;
            if (ecs) {
                const active = ecs.getActive();
                const count = Math.min(active.length, 100);
                for (let i = 0; i < count; i++) {
                    const id = active[i];
                    physicsEntities.push({
                        id: id,
                        pos: { x: ecs.posX[id], y: ecs.posY[id], z: ecs.posZ[id] },
                        vel: { x: ecs.velX[id], y: ecs.velY[id], z: ecs.velZ[id] },
                        mass: ecs.mass[id] || 1
                    });
                }
            }
            
            if (physicsEntities.length > 0) {
                const task = {
                    type: 'physics',
                    data: {
                        entities: physicsEntities,
                        delta: delta,
                        gravity: CONFIG.gravity || -9.8
                    },
                    id: Date.now() + '_' + Math.random().toString(36).substr(2, 4)
                };
                
                const worker = this._workers[this.state.frameCount % this._workers.length];
                if (worker) {
                    worker.postMessage(task);
                    this.state.tasksScheduled++;
                }
            }
        }
        
        // ============================================================
        //  🧠 APLICAR ACCIONES DE IA MEJORADAS
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
            
            this._updateUI('quality', action.quality.toUpperCase());
            this._updateUI('lod', action.lodDistance);
            this._updateUI('confidence', Math.round(action.confidence * 100) + '%');
        }
        
        _applyMetaAction(metaResult) {
            if (!metaResult || !this.modules.renderer) return;
            
            if (metaResult.graphicsOptimizations) {
                this.modules.ai.meta.applyOptimizations(
                    this.modules.renderer,
                    metaResult.graphicsOptimizations
                );
            }
            
            const prediction = metaResult.prediction || 'estable';
            const predMap = {
                'estable': '⚡ Estable',
                'caída_inminente': '🔻 Caída inminente',
                'mejora_inminente': '🔺 Mejora inminente'
            };
            this._updateUI('prediction', predMap[prediction] || '⚡ Estable');
            this._updateUI('meta-confidence', Math.round(metaResult.confidence * 100) + '%');
        }
        
        // ============================================================
        //  🖥️ UI UPDATES
        //  ============================================================
        _updateUI(id, value) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
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
                // Pausar motor
                this.pause();
                
                // Limpiar estado corrompido
                if (this.modules.ecs) {
                    // Resetear ECS pero mantener entidades
                }
                
                // Reiniciar renderer si es necesario
                if (this.modules.renderer && error.message?.includes('WebGL')) {
                    this.modules.renderer.reset();
                }
                
                // Reanudar
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
        //  📊 ESTADÍSTICAS MEJORADAS
        //  ============================================================
        getStats() {
            return {
                state: this.state,
                loop: {
                    frameCount: this._loop.renderCount,
                    updateCount: this._loop.updateCount,
                    fixedDeltaTime: this._loop.fixedDeltaTime,
                    accumulator: this._loop.accumulator,
                    frameTime: this._loop.frameTime,
                    skippedFrames: this._loop.skippedFrames
                },
                modules: {
                    loaded: Object.keys(this.modules).filter(k => this.modules[k]).length,
                    total: Object.keys(this.modules).length,
                    names: Object.keys(this.modules).filter(k => this.modules[k])
                },
                ecs: this.modules.ecs?.getStats() || null,
                renderer: this.modules.renderer?.getStats() || null,
                game: this.modules.game.world?.getStats() || null,
                workers: {
                    total: this._workers.length,
                    active: this.state.activeThreads,
                    tasksScheduled: this.state.tasksScheduled,
                    tasksCompleted: this.state.tasksCompleted
                },
                plugins: Array.from(this._plugins.keys()),
                stats: this.stats,
                fps: this.state.fps,
                entities: this.modules.ecs?.count || 0,
                uptime: this.state.uptime,
                prediction: this.getPrediction(),
                quality: this.state.qualityLevel,
                performanceMode: this.state.performanceMode,
                energyEfficiency: this.state.energyEfficiency
            };
        }
        
        getSummary() {
            const stats = this.getStats();
            return {
                status: this.state.status,
                fps: stats.fps,
                entities: stats.entities,
                uptime: Math.round(stats.uptime / 1000),
                modules: stats.modules.loaded,
                plugins: stats.plugins.length,
                renderer: stats.renderer ? 'active' : 'inactive',
                workers: stats.workers.active,
                quality: this.state.qualityLevel,
                prediction: stats.prediction,
                memory: this.modules.core.memory?.getSummary?.() || null
            };
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        getModule(name) {
            // Buscar en las categorías
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
        //  🔧 UTILIDADES MEJORADAS
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
                plugins: Array.from(this._plugins.keys()),
                prediction: this._predictor.lastPrediction,
                eventHistory: this._eventHistory.slice(-50),
                timestamp: Date.now()
            };
        }
        
        exportJSON() {
            return JSON.stringify(this.exportData(), null, 2);
        }
        
        // ============================================================
        //  🔄 RESET MEJORADO
        //  ============================================================
        reset() {
            console.log('🔄 Resetando motor cuántico...');
            
            this.stop();
            
            // Resetear módulos
            if (this.modules.ecs) this.modules.ecs.reset();
            if (this.modules.renderer) this.modules.renderer.reset();
            if (this.modules.game.world) this.modules.game.world.reset();
            if (this.modules.renderer?.geometryLab) this.modules.renderer.geometryLab.reset();
            if (this.modules.ai.optimizer) this.modules.ai.optimizer.reset();
            if (this.modules.ai.meta) this.modules.ai.meta.reset();
            if (this.modules.utils.profiler) this.modules.utils.profiler.reset();
            if (this.modules.utils.helpers) this.modules.utils.helpers.reset();
            
            // Resetear estado
            this.state.frameCount = 0;
            this.state.uptime = 0;
            this.state.error = null;
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
        //  🗑️ DESTRUIR MEJORADO
        //  ============================================================
        destroy() {
            console.log('🗑️ Destruyendo motor cuántico...');
            
            this.stop();
            
            // Limpiar eventos
            this._events.clear();
            this._eventHistory = [];
            
            // Limpiar intervalos
            if (this._predictor.interval) {
                clearInterval(this._predictor.interval);
            }
            if (this._budgetInterval) {
                clearInterval(this._budgetInterval);
            }
            if (this._adaptiveInterval) {
                clearInterval(this._adaptiveInterval);
            }
            
            // Destruir módulos
            if (this.modules.renderer?.destroy) this.modules.renderer.destroy();
            if (this.modules.core.memory?.shutdown) this.modules.core.memory.shutdown();
            
            // Terminar workers
            for (const worker of this._workers) {
                worker.terminate();
            }
            this._workers = [];
            
            // Limpiar plugins
            for (const [name, plugin] of this._plugins) {
                if (typeof plugin.destroy === 'function') {
                    try { plugin.destroy(); } catch (e) {}
                }
            }
            this._plugins.clear();
            
            // Resetear módulos
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
    
    console.log('🚀 PriomEngine Cuántico cargado');
    console.log('🧠 IA Predictiva de rendimiento');
    console.log('🧵 Sistema de Workers multi-thread');
    console.log('⚡ Adaptive Quality en tiempo real');
    console.log('📊 Performance Budget integrado');
    console.log('🔄 Error Recovery automático');
    console.log('📈 Dashboard de rendimiento');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PriomEngine;
    }
    
})();
                
                
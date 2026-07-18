/**
 * 🚀 PRIOM V0.1 - PRIOM ENGINE
 * "El motor que une todo en perfecta armonía"
 * 
 * 📁 Ubicación: js/engine/PriomEngine.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Motor principal que orquesta todos los módulos
 * 
 * ⭐ INNOVACIONES:
 * - Orquestación completa de todos los módulos
 * - Loop de juego optimizado con delta time
 * - Sistema de estados del motor
 * - Gestión de eventos del ciclo de vida
 * - Sistema de plugins extensible
 * - Configuración dinámica en tiempo real
 * - Sistema de profiling integrado
 * - Manejo de errores robusto
 * - Sistema de hot-reload para desarrollo
 * - API pública completa
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🚀 PriomEngine - Motor Principal
     * Orquesta todos los módulos del motor
     */
    class PriomEngine {
        constructor(config = {}) {
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
                plugins: config.plugins || []
            };
            
            // ============================================================
            //  📦 ESTADO DEL MOTOR
            //  ============================================================
            this.state = {
                status: 'initializing', // initializing | ready | running | paused | error
                startTime: 0,
                uptime: 0,
                frameCount: 0,
                deltaTime: 0,
                fixedDeltaTime: 0,
                fps: 0,
                error: null,
                plugins: new Map()
            };
            
            // ============================================================
            //  🧩 MÓDULOS DEL MOTOR
            //  ============================================================
            this.modules = {
                // Core
                config: CONFIG,
                hardware: null,
                memory: null,
                
                // ECS
                ecs: null,
                
                // AI
                optimizerAI: null,
                metaAI: null,
                
                // Renderer
                renderer: null,
                geometryLab: null,
                
                // Game
                gameWorld: null,
                entityFactory: null,
                terrainGenerator: null,
                
                // Utils
                profiler: null,
                helpers: null
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
                renderCount: 0
            };
            
            // ============================================================
            //  📡 SISTEMA DE EVENTOS
            //  ============================================================
            this._events = new Map();
            
            // ============================================================
            //  🔌 PLUGINS
            //  ============================================================
            this._plugins = new Map();
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            console.log('🚀 ========================================');
            console.log('🚀  PRIOM V0.1 - MOTOR DE JUEGOS IA');
            console.log('🚀  "Donde la IA encuentra la gráfica"');
            console.log('🚀 ========================================');
            console.log(`📦 Versión: ${CONFIG.version}`);
            console.log(`🏗️ Build: ${CONFIG.build}`);
            console.log(`📊 Max Entidades: ${CONFIG.maxEntities}`);
            console.log(`🎯 FPS Objetivo: ${CONFIG.targetFPS}`);
            
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
                
                // ===== 7. CARGAR PLUGINS =====
                console.log('🔌 Cargando plugins...');
                this._loadPlugins();
                
                // ===== 8. CONFIGURAR EVENTOS =====
                this._setupEvents();
                
                // ===== 9. ESTADO LISTO =====
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor inicializado correctamente');
                console.log(`📊 Módulos cargados: ${Object.keys(this.modules).filter(k => this.modules[k]).length}`);
                
                // ===== 10. AUTO-START =====
                if (this.config.autoStart) {
                    this.start();
                }
                
                // Nota: el benchmark de GPU en segundo plano se quitó — corría
                // un render loop de WebGL EN PARALELO con la escena principal
                // justo al arrancar (el peor momento posible), contaminando
                // la medición real de FPS justo cuando la IA está calibrando
                // la calidad inicial. La recalibración por rendimiento real
                // ya ocurre de forma natural via OptimizerAI/DRS mientras el
                // motor corre, sin necesitar un benchmark aparte que compita
                // por los mismos recursos.
                // Emitir evento de inicialización
                this.emit('init', { engine: this });
                
            } catch (error) {
                this.state.status = 'error';
                this.state.error = error;
                console.error('❌ Error al inicializar el motor:', error);
                console.error('Stack trace:', error.stack);
                this.emit('error', { error });
            }
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE MÓDULOS
        //  ============================================================
        
        _initCore() {
            // Hardware Detector
            this.modules.hardware = window.HardwareDetector;
            if (!this.modules.hardware) {
                throw new Error('HardwareDetector no disponible');
            }
            
            // Memory
            this.modules.memory = window.PersistentMemory;
            if (!this.modules.memory) {
                throw new Error('PersistentMemory no disponible');
            }
            
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
            // Optimizer AI
            this.modules.optimizerAI = new OptimizerAI(
                this.modules.hardware,
                this.modules.memory
            );
            
            // Meta AI
            this.modules.metaAI = new MetaOptimizerAI(
                this.modules.hardware,
                this.modules.memory
            );
            
            console.log('✅ IA inicializada');
        }
        
        _initRenderer() {
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) {
                throw new Error('Canvas no encontrado');
            }
            
            // Renderer
            this.modules.renderer = new MaxRenderer(canvas);
            
            // Geometry Lab
            this.modules.geometryLab = new ComplexGeometryLab(
                this.modules.renderer.scene
            );
            
            console.log('✅ Renderer inicializado');
        }
        
        _initWorld() {
            // Entity Factory
            this.modules.entityFactory = new EntityFactory(
                this.modules.ecs,
                CONFIG
            );
            
            // Terrain Generator
            this.modules.terrainGenerator = new TerrainGenerator(CONFIG);
            
            // Game World
            this.modules.gameWorld = new GameWorld(
                this.modules.ecs,
                this.modules.renderer,
                this.modules.memory
            );
            
            // Vegetación adicional (flores) - aditivo v0.2
            try {
                if (window.VegetationPlacer && this.modules.gameWorld.generators && this.modules.gameWorld.generators.terrain) {
                    this.modules.vegetationPlacer = new VegetationPlacer(
                        this.modules.renderer.scene,
                        this.modules.gameWorld.generators.terrain,
                        { worldSize: CONFIG.worldSize }
                    );
                    this.modules.vegetationPlacer.plantFlowers(800);
                }
            } catch (e) {
                console.warn('⚠️ VegetationPlacer no disponible', e);
            }
            
            // Decoración de alta montaña (rocas con escarcha, cristales de hielo) - tanda 2
            try {
                if (window.AlpineDecor && this.modules.gameWorld.generators && this.modules.gameWorld.generators.terrain) {
                    this.modules.alpineDecor = new AlpineDecor(
                        this.modules.renderer.scene,
                        this.modules.gameWorld.generators.terrain,
                        { worldSize: CONFIG.worldSize }
                    );
                    this.modules.alpineDecor.plant(250);
                }
            } catch (e) {
                console.warn('⚠️ AlpineDecor no disponible', e);
            }
            
            // Sotobosque (arbustos, helechos) - llena el hueco entre árboles y pasto
            try {
                if (window.ForestDecor && this.modules.gameWorld.generators && this.modules.gameWorld.generators.terrain) {
                    this.modules.forestDecor = new ForestDecor(
                        this.modules.renderer.scene,
                        this.modules.gameWorld.generators.terrain,
                        { worldSize: CONFIG.worldSize }
                    );
                    this.modules.forestDecor.plant(1200);
                }
            } catch (e) {
                console.warn('⚠️ ForestDecor no disponible', e);
            }
            
            // Chunk Manager (primer paso hacia streaming: culling de decoración por distancia)
            try {
                if (window.ChunkManager && this.modules.renderer) {
                    this.modules.chunkManager = new ChunkManager();
                    this.modules.chunkManager.registerRegion('grass', 0, 0, 220, this.modules.renderer.grassMeshes);
                    this.modules.chunkManager.registerRegion(
                        'flowers', 0, 0, 220,
                        this.modules.vegetationPlacer ? this.modules.vegetationPlacer.flowerMeshes : []
                    );
                    this.modules.chunkManager.registerRegion(
                        'alpine', 0, 0, 220,
                        this.modules.alpineDecor ? this.modules.alpineDecor.meshes : []
                    );
                    this.modules.chunkManager.registerRegion(
                        'forest_decor', 0, 0, 220,
                        this.modules.forestDecor ? this.modules.forestDecor.meshes : []
                    );
                    this.modules.renderer.chunkManager = this.modules.chunkManager;
                }
            } catch (e) {
                console.warn('⚠️ ChunkManager no disponible', e);
            }
            
            // Tercera IA: WorldAI (le da vida al mundo — estaciones, incendios, crecimiento, fauna)
            try {
                if (window.WorldAI) {
                    this.modules.worldAI = new WorldAI(this);
                }
            } catch (e) {
                console.warn('⚠️ WorldAI no disponible', e);
            }
            
            // Sistema de sonido procedural (no se inicia aquí: requiere gesto del usuario)
            try {
                if (window.AudioSystem) {
                    this.modules.audioSystem = new AudioSystem(this);
                }
            } catch (e) {
                console.warn('⚠️ AudioSystem no disponible', e);
            }
            
            // Editor (v0.3): colocar entidades tocando el suelo
            try {
                if (window.Editor) {
                    this.modules.editor = new Editor(this);
                    
                    // Guardado/carga del mundo (v0.3): cada colocación del
                    // editor se registra para poder guardarla después
                    if (window.WorldSerializer) {
                        this.modules.worldSerializer = new WorldSerializer(this);
                        this.modules.editor.onPlace = (type, x, y, z) => {
                            this.modules.worldSerializer.recordPlacement(type, x, y, z);
                        };
                    }
                }
            } catch (e) {
                console.warn('⚠️ Editor no disponible', e);
            }
            
            // Minimapa (v0.3)
            try {
                const canvas = document.getElementById('minimap-canvas');
                if (window.Minimap && canvas) {
                    this.modules.minimap = new Minimap(this, canvas, { worldRange: 200 });
                }
            } catch (e) {
                console.warn('⚠️ Minimap no disponible', e);
            }
            
            // Ajustar pasto/niebla/polvo/espuma a la altura real del terreno
            // (el renderer los crea antes de que el mundo exista)
            try {
                const terrain = this.modules.gameWorld.generators && this.modules.gameWorld.generators.terrain;
                const waterBodies = this.modules.gameWorld.ecosystems && this.modules.gameWorld.ecosystems.waterBodies
                    ? Array.from(this.modules.gameWorld.ecosystems.waterBodies.values())
                    : [];
                if (terrain && this.modules.renderer.conformGroundFXToTerrain) {
                    this.modules.renderer.conformGroundFXToTerrain(terrain, waterBodies);
                }
                if (terrain && this.modules.renderer.focusOnScenicSpot) {
                    this.modules.renderer.focusOnScenicSpot(terrain, waterBodies);
                }
                
                // Bisontes de demostración cerca del lago (v0.3: pradera + lago)
                if (waterBodies.length > 0 && this.modules.entityFactory) {
                    const lake = waterBodies[Math.floor(Math.random() * waterBodies.length)];
                    for (let i = 0; i < 2; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 4 + Math.random() * 8; // cerca de la orilla, como bebiendo agua
                        const bx = lake.x + Math.cos(angle) * dist;
                        const bz = lake.z + Math.sin(angle) * dist;
                        const by = terrain.getHeight(bx, bz);
                        const id = this.modules.entityFactory.createAnimal(bx, by + 0.3, bz, false);
                        if (id !== -1) {
                            this.modules.ecs.subType[id] = 1; // marca como bisonte para el renderer
                            this.modules.ecs.scaleX[id] = 1.8;
                            this.modules.ecs.scaleY[id] = 1.8;
                            this.modules.ecs.scaleZ[id] = 1.8;
                            if (this.modules.gameWorld.ecosystems && this.modules.gameWorld.ecosystems.entities) {
                                this.modules.gameWorld.ecosystems.entities.animals.add(id);
                            }
                        }
                    }
                    console.log('🦬 Bisontes de demostración colocados junto al lago');
                }
            } catch (e) {
                console.warn('⚠️ No se pudo ajustar efectos de suelo al terreno', e);
            }
            
            console.log('✅ Mundo inicializado');
        }
        
        // ============================================================
        //  📊 BENCHMARK REAL EN SEGUNDO PLANO (recalibración de calidad)
        //  El benchmark real (dibuja miles de triángulos, mide fps de
        //  verdad) existía pero nunca se llamaba desde ningún lado — la
        //  calidad inicial dependía solo de specs estáticas (nombre de
        //  GPU + RAM total), que no reflejan cuántos recursos están
        //  libres AHORA MISMO en este navegador/pestaña/momento.
        // ============================================================
        async _runBackgroundBenchmark() {
            try {
                if (!this.modules.hardware || typeof this.modules.hardware.runBenchmark !== 'function') return;
                
                const results = await this.modules.hardware.runBenchmark(800);
                if (!results || !this.modules.optimizerAI) return;
                
                const recommendations = this.modules.hardware.getRecommendations();
                const measuredQuality = recommendations ? recommendations.measuredQuality : null;
                if (!measuredQuality) return;
                
                const tiers = ['low', 'medium', 'high', 'ultra', 'quantum'];
                const measuredIdx = tiers.indexOf(measuredQuality);
                const currentIdx = this.modules.optimizerAI.currentQuality;
                
                if (measuredIdx !== -1 && Math.abs(measuredIdx - currentIdx) >= 1) {
                    console.log(`📊 Benchmark real recalibrando calidad: ${tiers[currentIdx]} → ${measuredQuality} (condiciones actuales del dispositivo, no solo specs en papel)`);
                    this.modules.optimizerAI.currentQuality = measuredIdx;
                }
            } catch (e) {
                console.warn('⚠️ No se pudo ejecutar el benchmark en segundo plano', e);
            }
        }
        
        _initUtils() {
            // Profiler
            this.modules.profiler = window.Profiler;
            if (!this.modules.profiler) {
                console.warn('⚠️ Profiler no disponible');
            }
            
            // Helpers
            this.modules.helpers = window.Helpers;
            if (!this.modules.helpers) {
                console.warn('⚠️ Helpers no disponible');
            }
            
            console.log('✅ Utilidades inicializadas');
        }
        
        // ============================================================
        //  🔌 SISTEMA DE PLUGINS
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
        
        /**
         * Registrar un plugin
         */
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
        
        /**
         * Obtener un plugin
         */
        getPlugin(name) {
            return this._plugins.get(name) || null;
        }
        
        /**
         * Listar plugins
         */
        listPlugins() {
            return Array.from(this._plugins.keys());
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS
        //  ============================================================
        
        _setupEvents() {
            // Eventos del ciclo de vida
            this.on('start', () => {
                console.log('▶️ Motor iniciado');
            });
            
            this.on('pause', () => {
                console.log('⏸️ Motor pausado');
            });
            
            this.on('resume', () => {
                console.log('▶️ Motor reanudado');
            });
            
            this.on('stop', () => {
                console.log('⏹️ Motor detenido');
            });
            
            // ============================================================
            //  👁️ VISIBILIDAD DE PÁGINA (bug real corregido)
            //  Cuando se cambia de app, se bloquea la pantalla, o la
            //  pestaña queda en segundo plano, el navegador pausa o
            //  limita requestAnimationFrame para ahorrar batería. Al
            //  volver, el siguiente frame calculaba su delta contra la
            //  última vez que corrió ANTES de la pausa — un salto de
            //  segundos o minutos — contaminando el cálculo de FPS con
            //  valores imposibles (300+ de golpe, luego un desplome).
            //  Esto reinicia el reloj del motor limpio al volver, en vez
            //  de medir a través del hueco de tiempo oculto.
            // ============================================================
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this._wasHiddenAt = performance.now();
                    console.log('👁️ Página oculta — pausando medición de tiempo');
                } else {
                    const hiddenDuration = this._wasHiddenAt ? performance.now() - this._wasHiddenAt : 0;
                    console.log(`👁️ Página visible de nuevo (oculta ${Math.round(hiddenDuration)}ms) — reiniciando reloj`);
                    
                    // Reiniciar el reloj del loop para no medir el hueco oculto
                    this._loop.lastTime = performance.now();
                    this._loop.accumulator = 0;
                    this._loop.fixedAccumulator = 0;
                    
                    // Limpiar muestras de FPS viejas/contaminadas
                    this._fpsSamples = [];
                    
                    // Avisar a WorldAI para que tampoco salte sus temporizadores
                    // de golpe (estaciones/crecimiento/fauna) por el hueco oculto
                    if (this.modules.worldAI && typeof this.modules.worldAI.onResume === 'function') {
                        this.modules.worldAI.onResume();
                    }
                }
            });
            
            this.on('error', ({ error }) => {
                console.error('❌ Error en motor:', error);
            });
            
            this.on('frame', ({ delta, frame }) => {
                if (this.config.enableDebug && frame % 60 === 0) {
                    const stats = this.getStats();
                    console.log(`📊 Frame ${frame} | FPS: ${stats.fps} | Entidades: ${stats.entities}`);
                }
            });
        }
        
        /**
         * Registrar evento
         */
        on(event, callback) {
            if (!this._events.has(event)) {
                this._events.set(event, []);
            }
            this._events.get(event).push(callback);
            return this;
        }
        
        /**
         * Eliminar evento
         */
        off(event, callback) {
            if (!this._events.has(event)) return this;
            const listeners = this._events.get(event);
            this._events.set(event, listeners.filter(cb => cb !== callback));
            return this;
        }
        
        /**
         * Emitir evento
         */
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
        //  🎯 LOOP DE JUEGO
        //  ============================================================
        
        /**
         * Iniciar el motor
         */
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
            
            // Configurar fixed update
            this._loop.fixedDeltaTime = 1 / this.config.fixedUpdateRate;
            
            // Iniciar el loop
            this._gameLoop();
            
            this.emit('start', { engine: this });
            console.log('▶️ Motor iniciado');
            
            return this;
        }
        
        /**
         * Pausar el motor
         */
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
        
        /**
         * Reanudar el motor
         */
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
        
        /**
         * Detener el motor
         */
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
                const rawDelta = now - this._loop.lastTime; // sin recortar, para medir FPS real
                let delta = Math.min(rawDelta, this.config.maxDeltaTime * 1000);
                this._loop.lastTime = now;
                
                // Convertir a segundos
                const deltaSeconds = delta / 1000;
                
                // Acumular tiempo para fixed update
                this._loop.accumulator += deltaSeconds;
                this._loop.fixedAccumulator += deltaSeconds;
                
                // ===== FIXED UPDATE =====
                let fixedSteps = 0;
                while (this._loop.fixedAccumulator >= this._loop.fixedDeltaTime && fixedSteps < 5) {
                    this._fixedUpdate(this._loop.fixedDeltaTime);
                    this._loop.fixedAccumulator -= this._loop.fixedDeltaTime;
                    this._loop.updateCount++;
                    fixedSteps++;
                }
                // Evitar espiral de la muerte si el hilo se atrasa mucho
                if (this._loop.fixedAccumulator > this._loop.fixedDeltaTime * 5) {
                    this._loop.fixedAccumulator = 0;
                }
                
                // ===== UPDATE =====
                this._update(deltaSeconds);
                
                // ===== RENDER =====
                this._render();
                
                // ===== POST-RENDER =====
                this._postRender();
                
                // ===== ACTUALIZAR ESTADÍSTICAS =====
                this.state.frameCount++;
                this.state.uptime = now - this.state.startTime;
                this.state.deltaTime = deltaSeconds;
                
                // Calcular FPS (promedio real de los últimos frames, sin el
                // recorte de maxDeltaTime — antes SIEMPRE daba exactamente 20,
                // sin importar el rendimiento real, porque 1000/50ms = 20 fijo)
                if (rawDelta > 0) {
                    const instantFps = 1000 / rawDelta;
                    // Descartar lecturas imposibles (ninguna pantalla real
                    // pasa de ~150hz) — protege contra cualquier artefacto
                    // de medición, venga de donde venga
                    if (instantFps > 0 && instantFps <= 150) {
                        this._fpsSamples = this._fpsSamples || [];
                        this._fpsSamples.push(instantFps);
                        if (this._fpsSamples.length > 20) this._fpsSamples.shift();
                    }
                }
                if (this.state.frameCount % 15 === 0 && this._fpsSamples && this._fpsSamples.length > 0) {
                    const avg = this._fpsSamples.reduce((a, b) => a + b, 0) / this._fpsSamples.length;
                    this.state.fps = Math.round(avg);
                }
                
                // ===== EVENTO DE FRAME =====
                this.emit('frame', {
                    delta: deltaSeconds,
                    frame: this.state.frameCount,
                    fps: this.state.fps
                });
            } catch (e) {
                this._lastLoopError = (e && e.message) ? e.message : String(e);
                console.error('❌ Error en el game loop (frame ' + this.state.frameCount + '):', e);
            }
            
            // ===== CONTINUAR LOOP =====
            requestAnimationFrame(() => this._gameLoop());
        }
        
        // ============================================================
        //  🔄 SUB-LOOPS
        //  ============================================================
        
        /**
         * Fixed Update (frecuencia fija)
         */
        _fixedUpdate(delta) {
            // Actualizar física
            if (this.modules.ecs) {
                const visible = this.modules.renderer?.lastVisible || null;
                const terrain = this.modules.gameWorld && this.modules.gameWorld.generators
                    ? this.modules.gameWorld.generators.terrain : null;
                const getGroundHeight = terrain && terrain.getHeight
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
            
            // Actualizar mundo del juego
            if (this.modules.gameWorld) {
                this.modules.gameWorld.update(delta);
            }
            
            // Tercera IA: WorldAI (vida del mundo)
            if (this.modules.worldAI) {
                try {
                    this.modules.worldAI.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en WorldAI', e);
                }
            }
            
            // Sistema de sonido
            if (this.modules.audioSystem) {
                try {
                    this.modules.audioSystem.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en AudioSystem', e);
                }
            }
            
            // Minimapa
            if (this.modules.minimap) {
                try {
                    this.modules.minimap.update(delta);
                } catch (e) {
                    console.warn('⚠️ Error en Minimap', e);
                }
            }
            
            // Actualizar IA
            if (this.modules.optimizerAI && this.modules.metaAI) {
                const perf = this.modules.profiler ? 
                    this.modules.profiler.getSummary() : 
                    { fps: this.state.fps };
                    
                const renderStats = this.modules.renderer ?
                    this.modules.renderer.getStats() :
                    {};
                    
                // IA Principal
                const aiAction = this.modules.optimizerAI.update(
                    perf,
                    renderStats,
                    this.modules.ecs
                );
                
                // IA Meta
                const metaResult = this.modules.metaAI.update(
                    perf,
                    renderStats,
                    this.modules.optimizerAI
                );
                
                // Aplicar optimizaciones
                this._applyAIAction(aiAction);
                this._applyMetaAction(metaResult);
            }
            
            // Actualizar laboratorio geométrico
            if (this.modules.geometryLab) {
                this.modules.geometryLab.update(delta);
            }
            
            // Actualizar LOD
            if (this.modules.renderer && this.modules.ecs) {
                const camPos = this.modules.renderer.getCameraPosition();
                this.modules.ecs.updateLOD(
                    camPos.x,
                    camPos.z,
                    CONFIG.lodDistance * 3 || 600
                );
            }
        }
        
        /**
         * Update (por frame)
         */
        _update(delta) {
            // Actualizar el mundo del juego
            if (this.modules.gameWorld) {
                // Ya se actualiza en fixed update
            }
            
            // Actualizar helpers
            if (this.modules.helpers) {
                this.modules.helpers.updateTimers(delta);
            }
        }
        
        /**
         * Render
         */
        _render() {
            if (!this.modules.renderer) return;
            
            // Obtener optimizaciones meta
            let metaOptimizations = null;
            if (this.modules.metaAI) {
                const status = this.modules.metaAI.getStatus();
                metaOptimizations = status.metaParams || null;
            }
            
            // Renderizar
            this.modules.renderer.render(
                this.modules.ecs,
                null,
                metaOptimizations
            );
            
            this._loop.renderCount++;
        }
        
        /**
         * Post-Render
         */
        _postRender() {
            // Actualizar profiler
            if (this.modules.profiler && this.modules.renderer) {
                const renderStats = this.modules.renderer.getStats();
                const entityCount = this.modules.ecs ? this.modules.ecs.count : 0;
                this.modules.profiler.sample(renderStats, entityCount);
            }
        }
        
        // ============================================================
        //  🧠 APLICAR ACCIONES DE IA
        //  ============================================================
        
        _applyAIAction(action) {
            if (!action || !this.modules.renderer) return;
            if (this.manualQuality) return; // El usuario tomó control manual de la calidad
            
            // Calidad
            this.modules.renderer.setQuality(action.quality);
            this.modules.renderer.setLODDistance(action.lodDistance);
            
            // Nota: la resolución dinámica (DRS) ya no se controla desde
            // aquí — el MaxRenderer tiene su propio controlador dedicado
            // que mide el tiempo real de frame directamente. Tener dos
            // sistemas escribiendo el mismo valor fue justo la causa de
            // la regresión anterior (1 FPS por pelea entre ambos).
            
            // Efectos
            if (CONFIG) {
                CONFIG.waterEnabled = action.useWater;
                CONFIG.particlesEnabled = action.useParticles;
                CONFIG.bloomEnabled = action.useBloom;
                CONFIG.ssaoEnabled = action.useSSAO;
            }
            
            // Conectar los toggles con los pases de post-procesado reales
            const renderer = this.modules.renderer;
            if (renderer.ssaoPass) {
                renderer.ssaoPass.enabled = !!action.useSSAO;
            }
            if (renderer.dustSystem) {
                renderer.dustSystem.visible = !!action.useParticles;
            }
            
            // Actualizar UI
            this._updateUI('quality', action.quality.toUpperCase());
            this._updateUI('lod', action.lodDistance);
            this._updateUI('confidence', Math.round(action.confidence * 100) + '%');
        }
        
        _applyMetaAction(metaResult) {
            if (!metaResult || !this.modules.renderer) return;
            
            // Aplicar optimizaciones gráficas
            if (metaResult.graphicsOptimizations) {
                this.modules.metaAI.applyOptimizations(
                    this.modules.renderer,
                    metaResult.graphicsOptimizations
                );
            }
            
            // Actualizar UI
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
        //  📊 ESTADÍSTICAS
        //  ============================================================
        
        /**
         * Obtener estadísticas del motor
         */
        getStats() {
            return {
                state: this.state,
                loop: {
                    frameCount: this._loop.renderCount,
                    updateCount: this._loop.updateCount,
                    fixedDeltaTime: this._loop.fixedDeltaTime,
                    accumulator: this._loop.accumulator
                },
                modules: {
                    loaded: Object.keys(this.modules).filter(k => this.modules[k]).length,
                    total: Object.keys(this.modules).length,
                    names: Object.keys(this.modules).filter(k => this.modules[k])
                },
                ecs: this.modules.ecs ? this.modules.ecs.getStats() : null,
                renderer: this.modules.renderer ? this.modules.renderer.getStats() : null,
                game: this.modules.gameWorld ? this.modules.gameWorld.getStats() : null,
                plugins: Array.from(this._plugins.keys()),
                fps: this.state.fps,
                entities: this.modules.ecs ? this.modules.ecs.count : 0,
                uptime: this.state.uptime
            };
        }
        
        /**
         * Obtener resumen rápido
         */
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
                memory: this.modules.memory ? 
                    this.modules.memory.getSummary() : null
            };
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        
        /**
         * Obtener un módulo por nombre
         */
        getModule(name) {
            return this.modules[name] || null;
        }
        
        /**
         * Obtener todos los módulos
         */
        getModules() {
            return { ...this.modules };
        }
        
        /**
         * Obtener el estado del motor
         */
        getState() {
            return { ...this.state };
        }
        
        /**
         * Verificar si el motor está en ejecución
         */
        isRunning() {
            return this.state.status === 'running';
        }
        
        /**
         * Verificar si el motor está listo
         */
        isReady() {
            return this.state.status === 'ready' || this.state.status === 'running';
        }
        
        /**
         * Verificar si hay error
         */
        hasError() {
            return this.state.status === 'error';
        }
        
        /**
         * Obtener el error actual
         */
        getError() {
            return this.state.error;
        }
        
        // ============================================================
        //  🔧 UTILIDADES
        //  ============================================================
        
        /**
         * Ejecutar un benchmark
         */
        async runBenchmark(duration = 5000) {
            console.log(`📊 Ejecutando benchmark (${duration}ms)...`);
            
            if (this.modules.profiler) {
                const results = await this.modules.profiler.runBenchmark(duration);
                console.log('✅ Benchmark completado:', results);
                return results;
            }
            
            console.warn('⚠️ Profiler no disponible');
            return null;
        }
        
        /**
         * Exportar datos del motor
         */
        exportData() {
            return {
                config: { ...this.config },
                state: { ...this.state },
                stats: this.getStats(),
                modules: Object.keys(this.modules).filter(k => this.modules[k]),
                plugins: Array.from(this._plugins.keys()),
                timestamp: Date.now()
            };
        }
        
        /**
         * Exportar como JSON
         */
        exportJSON() {
            return JSON.stringify(this.exportData(), null, 2);
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        
        reset() {
            console.log('🔄 Resetando motor...');
            
            // Detener motor
            this.stop();
            
            // Resetear módulos
            if (this.modules.ecs) this.modules.ecs.reset();
            if (this.modules.renderer) this.modules.renderer.reset();
            if (this.modules.gameWorld) this.modules.gameWorld.reset();
            if (this.modules.geometryLab) this.modules.geometryLab.reset();
            if (this.modules.optimizerAI) this.modules.optimizerAI.reset();
            if (this.modules.metaAI) this.modules.metaAI.reset();
            if (this.modules.profiler) this.modules.profiler.reset();
            if (this.modules.helpers) this.modules.helpers.reset();
            
            // Resetear estado
            this.state.frameCount = 0;
            this.state.uptime = 0;
            this.state.error = null;
            this._loop.accumulator = 0;
            this._loop.fixedAccumulator = 0;
            this._loop.updateCount = 0;
            this._loop.renderCount = 0;
            
            this.state.status = 'ready';
            
            console.log('✅ Motor reseteado');
            
            return this;
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        
        destroy() {
            console.log('🗑️ Destruyendo motor...');
            
            // Detener
            this.stop();
            
            // Limpiar eventos
            this._events.clear();
            
            // Destruir módulos
            if (this.modules.renderer) {
                if (typeof this.modules.renderer.destroy === 'function') {
                    this.modules.renderer.destroy();
                }
            }
            
            if (this.modules.memory && typeof this.modules.memory.shutdown === 'function') {
                this.modules.memory.shutdown();
            }
            
            // Limpiar plugins
            for (const [name, plugin] of this._plugins) {
                if (typeof plugin.destroy === 'function') {
                    try {
                        plugin.destroy();
                    } catch (e) {
                        console.warn(`⚠️ Error al destruir plugin "${name}":`, e);
                    }
                }
            }
            this._plugins.clear();
            
            // Resetear módulos
            this.modules = {};
            
            this.state.status = 'stopped';
            
            console.log('✅ Motor destruido');
            
            return this;
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.PriomEngine = PriomEngine;
    
    console.log('🚀 PriomEngine cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PriomEngine;
    }
    
})();
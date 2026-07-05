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
                status: 'initializing',
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
                config: CONFIG,
                hardware: null,
                memory: null,
                ecs: null,
                optimizerAI: null,
                metaAI: null,
                renderer: null,
                geometryLab: null,
                gameWorld: null,
                entityFactory: null,
                terrainGenerator: null,
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
                
                // ===== 9. CONFIGURAR CONTROLES =====
                this.setupControls();
                
                // ===== 10. ESTADO LISTO =====
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor inicializado correctamente');
                console.log(`📊 Módulos cargados: ${Object.keys(this.modules).filter(k => this.modules[k]).length}`);
                
                // ===== 11. AUTO-START =====
                if (this.config.autoStart) {
                    this.start();
                }
                
                // Emitir evento de inicialización
                this.emit('init', { engine: this });
                
                // ============================================================
                //  🌍 GENERAR MUNDO DEMO AUTOMÁTICAMENTE
                //  ============================================================
                setTimeout(() => {
                    try {
                        console.log('🌍 Auto-spawn: generando mundo demo...');
                        const btn = document.getElementById('btn-spawn');
                        if (btn) {
                            btn.click();
                            console.log('✅ Auto-spawn: click en Spawn ejecutado');
                        } else {
                            console.warn('⚠️ Botón Spawn no encontrado, generando directamente...');
                            this._generateWorldDirect();
                        }
                    } catch(e) {
                        console.warn('⚠️ Auto-spawn falló:', e);
                    }
                }, 2500);
                
            } catch (error) {
                this.state.status = 'error';
                this.state.error = error;
                console.error('❌ Error al inicializar el motor:', error);
                console.error('Stack trace:', error.stack);
                this.emit('error', { error });
            }
        }
        
        // ============================================================
        //  🌍 GENERAR MUNDO DIRECTO (FALLBACK)
        //  ============================================================
        _generateWorldDirect() {
            console.log('🌍 Generando mundo directo...');
            
            const ecs = this.modules.ecs;
            const factory = this.modules.entityFactory;
            
            if (!ecs || !factory) {
                console.error('❌ ECS o Factory no disponibles');
                this.showNotification('❌ Error: Módulos no disponibles');
                return;
            }
            
            ecs.reset();
            let total = 0;
            
            // Árboles (500)
            for (let i = 0; i < 500; i++) {
                const x = (Math.random() - 0.5) * 400;
                const z = (Math.random() - 0.5) * 400;
                const y = 0.5 + Math.random() * 4;
                const id = factory.createTree(x, y, z);
                if (id !== -1) {
                    ecs.isTree[id] = 1;
                    ecs.scale[id] = 0.5 + Math.random() * 3;
                    total++;
                }
            }
            
            // Rocas (100)
            for (let i = 0; i < 100; i++) {
                const x = (Math.random() - 0.5) * 400;
                const z = (Math.random() - 0.5) * 400;
                const y = 0.5 + Math.random() * 3;
                const id = factory.createRock(x, y, z);
                if (id !== -1) {
                    ecs.isRock[id] = 1;
                    ecs.scale[id] = 0.5 + Math.random() * 4;
                    total++;
                }
            }
            
            // Animales (50)
            for (let i = 0; i < 50; i++) {
                const x = (Math.random() - 0.5) * 300;
                const z = (Math.random() - 0.5) * 300;
                const y = 0.5 + Math.random() * 0.5;
                const id = factory.createAnimal(x, y, z, Math.random() < 0.2);
                if (id !== -1) {
                    ecs.isAnimal[id] = 1;
                    ecs.scale[id] = 0.2 + Math.random() * 0.5;
                    total++;
                }
            }
            
            // Figuras geométricas (30)
            for (let i = 0; i < 30; i++) {
                const angle = (i / 30) * Math.PI * 2;
                const x = Math.cos(angle) * 40;
                const z = Math.sin(angle) * 40;
                const y = 5 + Math.sin(i * 0.5) * 3;
                const id = factory.createEntity('geometry', x, y, z);
                if (id !== -1) {
                    ecs.isGeometry[id] = 1;
                    ecs.scale[id] = 0.5 + Math.random() * 1.5;
                    ecs.rotY[id] = Math.random() * Math.PI * 2;
                    total++;
                }
            }
            
            // Actualizar UI
            const entitiesEl = document.getElementById('entities');
            if (entitiesEl) entitiesEl.textContent = ecs.count;
            
            console.log(`✅ Mundo generado con ${ecs.count} entidades`);
            this.showNotification(`🌍 Mundo creado con ${ecs.count} entidades`);
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE MÓDULOS
        //  ============================================================
        
        _initCore() {
            this.modules.hardware = window.HardwareDetector;
            this.modules.memory = window.PersistentMemory;
            console.log('✅ Core inicializado');
        }
        
        _initECS() {
            this.modules.ecs = new SoaManager(CONFIG.maxEntities);
            console.log('✅ ECS inicializado');
        }
        
        _initAI() {
            this.modules.optimizerAI = new OptimizerAI(
                this.modules.hardware,
                this.modules.memory
            );
            this.modules.metaAI = new MetaOptimizerAI(
                this.modules.hardware,
                this.modules.memory
            );
            console.log('✅ IA inicializada');
        }
        
        _initRenderer() {
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) throw new Error('Canvas no encontrado');
            
            this.modules.renderer = new MaxRenderer(canvas);
            this.modules.renderer.init();
            
            this.modules.geometryLab = new ComplexGeometryLab(
                this.modules.renderer.scene
            );
            console.log('✅ Renderer inicializado');
        }
        
        _initWorld() {
            this.modules.entityFactory = new EntityFactory(
                this.modules.ecs,
                CONFIG
            );
            this.modules.terrainGenerator = new TerrainGenerator(CONFIG);
            this.modules.gameWorld = new GameWorld(
                this.modules.ecs,
                this.modules.renderer,
                this.modules.memory
            );
            console.log('✅ Mundo inicializado');
        }
        
        _initUtils() {
            this.modules.profiler = window.Profiler;
            this.modules.helpers = window.Helpers;
            console.log('✅ Utilidades inicializadas');
        }
        
        _loadPlugins() {
            for (const plugin of this.config.plugins) {
                try {
                    if (typeof plugin === 'function') {
                        this._plugins.set(plugin.name || 'unknown', plugin(this));
                    } else if (typeof plugin === 'object' && plugin.init) {
                        plugin.init(this);
                        this._plugins.set(plugin.name || 'unknown', plugin);
                    }
                } catch(e) {
                    console.error(`❌ Error al cargar plugin:`, e);
                }
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
            this.on('error', ({ error }) => console.error('❌ Error:', error));
        }
        
        on(event, callback) {
            if (!this._events.has(event)) this._events.set(event, []);
            this._events.get(event).push(callback);
            return this;
        }
        
        off(event, callback) {
            if (!this._events.has(event)) return this;
            this._events.set(event, this._events.get(event).filter(cb => cb !== callback));
            return this;
        }
        
        emit(event, data = {}) {
            if (!this._events.has(event)) return;
            for (const callback of this._events.get(event)) {
                try { callback(data); } catch(e) { console.error(`❌ Error en evento "${event}":`, e); }
            }
        }
        
        // ============================================================
        //  🎯 LOOP DE JUEGO
        //  ============================================================
        
        start() {
            if (this.state.status === 'running') return this;
            if (this.state.status === 'error') {
                console.error('❌ Motor en estado de error');
                return this;
            }
            
            this.state.status = 'running';
            this.state.startTime = performance.now();
            this._loop.lastTime = performance.now();
            this._loop.running = true;
            this._loop.fixedDeltaTime = 1 / this.config.fixedUpdateRate;
            
            this._gameLoop();
            this.emit('start', { engine: this });
            console.log('▶️ Motor iniciado');
            return this;
        }
        
        pause() {
            if (this.state.status !== 'running') return this;
            this.state.status = 'paused';
            this._loop.running = false;
            this.emit('pause', { engine: this });
            console.log('⏸️ Motor pausado');
            return this;
        }
        
        resume() {
            if (this.state.status !== 'paused') return this;
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
        
        _gameLoop() {
            if (!this._loop.running && this.state.status !== 'running') return;
            
            const now = performance.now();
            const delta = Math.min(now - this._loop.lastTime, this.config.maxDeltaTime * 1000);
            this._loop.lastTime = now;
            const deltaSeconds = delta / 1000;
            
            this._loop.accumulator += deltaSeconds;
            this._loop.fixedAccumulator += deltaSeconds;
            
            while (this._loop.fixedAccumulator >= this._loop.fixedDeltaTime) {
                this._fixedUpdate(this._loop.fixedDeltaTime);
                this._loop.fixedAccumulator -= this._loop.fixedDeltaTime;
                this._loop.updateCount++;
            }
            
            this._update(deltaSeconds);
            this._render();
            this._postRender();
            
            this.state.frameCount++;
            this.state.uptime = now - this.state.startTime;
            this.state.deltaTime = deltaSeconds;
            
            if (this.state.frameCount % 60 === 0) {
                this.state.fps = Math.round(1000 / delta);
            }
            
            this.emit('frame', { delta: deltaSeconds, frame: this.state.frameCount, fps: this.state.fps });
            requestAnimationFrame(() => this._gameLoop());
        }
        
        _fixedUpdate(delta) {
            if (this.modules.ecs) {
                const visible = this.modules.renderer?.lastVisible || null;
                this.modules.ecs.updatePhysics(
                    delta,
                    CONFIG.gravity || -9.8,
                    CONFIG.windStrength || 0.6,
                    this.state.frameCount,
                    visible
                );
            }
            
            if (this.modules.gameWorld) {
                this.modules.gameWorld.update(delta);
            }
            
            if (this.modules.optimizerAI && this.modules.metaAI) {
                const perf = this.modules.profiler ? this.modules.profiler.getSummary() : { fps: this.state.fps };
                const renderStats = this.modules.renderer ? this.modules.renderer.getStats() : {};
                
                const aiAction = this.modules.optimizerAI.update(perf, renderStats, this.modules.ecs);
                const metaResult = this.modules.metaAI.update(perf, renderStats, this.modules.optimizerAI);
                
                this._applyAIAction(aiAction);
                this._applyMetaAction(metaResult);
            }
            
            if (this.modules.geometryLab) {
                this.modules.geometryLab.update(delta);
            }
        }
        
        _update(delta) {
            if (this.modules.helpers) {
                this.modules.helpers.updateTimers(delta);
            }
        }
        
        _render() {
            if (!this.modules.renderer) return;
            
            let metaOptimizations = null;
            if (this.modules.metaAI) {
                const status = this.modules.metaAI.getStatus();
                metaOptimizations = status.metaParams || null;
            }
            
            this.modules.renderer.render(
                this.modules.ecs,
                null,
                metaOptimizations
            );
            this._loop.renderCount++;
        }
        
        _postRender() {
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
            this.modules.renderer.setQuality(action.quality);
            this.modules.renderer.setLODDistance(action.lodDistance);
            
            if (CONFIG) {
                CONFIG.waterEnabled = action.useWater;
                CONFIG.particlesEnabled = action.useParticles;
                CONFIG.bloomEnabled = action.useBloom;
                CONFIG.ssaoEnabled = action.useSSAO;
            }
            
            this._updateUI('quality', action.quality.toUpperCase());
            this._updateUI('lod', action.lodDistance);
            this._updateUI('confidence', Math.round(action.confidence * 100) + '%');
        }
        
        _applyMetaAction(metaResult) {
            if (!metaResult || !this.modules.renderer) return;
            
            if (metaResult.graphicsOptimizations) {
                this.modules.metaAI.applyOptimizations(
                    this.modules.renderer,
                    metaResult.graphicsOptimizations
                );
            }
            
            const predMap = {
                'estable': '⚡ Estable',
                'caída_inminente': '🔻 Caída inminente',
                'mejora_inminente': '🔺 Mejora inminente'
            };
            this._updateUI('prediction', predMap[metaResult.prediction] || '⚡ Estable');
            this._updateUI('meta-confidence', Math.round(metaResult.confidence * 100) + '%');
        }
        
        // ============================================================
        //  🖥️ UI UPDATES
        //  ============================================================
        
        _updateUI(id, value) {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        }
        
        // ============================================================
        //  🔔 NOTIFICACIONES
        //  ============================================================
        
        showNotification(msg) {
            const container = document.getElementById('notifications');
            if (!container) return;
            const div = document.createElement('div');
            div.className = 'notification';
            div.textContent = msg;
            container.appendChild(div);
            setTimeout(() => { if (div.parentNode) div.remove(); }, 4000);
        }
        
        // ============================================================
        //  🎮 CONTROLES - BOTÓN SPAWN ARREGLADO
        //  ============================================================
        
        setupControls() {
            const controls = {
                'btn-dual': () => {
                    if (this.modules.renderer) {
                        this.modules.renderer.setQuality('ultra');
                    }
                    if (this.modules.optimizerAI) {
                        this.modules.optimizerAI.currentQuality = 3;
                    }
                    this.showNotification('🧠 IA Dual Activada');
                },
                'btn-low': () => {
                    if (this.modules.renderer) {
                        this.modules.renderer.setQuality('low');
                    }
                    if (this.modules.optimizerAI) {
                        this.modules.optimizerAI.currentQuality = 0;
                    }
                    this.showNotification('🔽 Calidad: Bajo');
                },
                'btn-medium': () => {
                    if (this.modules.renderer) {
                        this.modules.renderer.setQuality('medium');
                    }
                    if (this.modules.optimizerAI) {
                        this.modules.optimizerAI.currentQuality = 1;
                    }
                    this.showNotification('🔄 Calidad: Medio');
                },
                'btn-high': () => {
                    if (this.modules.renderer) {
                        this.modules.renderer.setQuality('high');
                    }
                    if (this.modules.optimizerAI) {
                        this.modules.optimizerAI.currentQuality = 2;
                    }
                    this.showNotification('🔼 Calidad: Alto');
                },
                'btn-ultra': () => {
                    if (this.modules.renderer) {
                        this.modules.renderer.setQuality('ultra');
                    }
                    if (this.modules.optimizerAI) {
                        this.modules.optimizerAI.currentQuality = 3;
                    }
                    this.showNotification('⚡ Calidad: Ultra');
                },
                'btn-spawn': () => {
                    console.log('🔄 Spawn clickeado!');
                    try {
                        // Opción 1: Usar GameWorld
                        if (this.modules.gameWorld && typeof this.modules.gameWorld._generateWorld === 'function') {
                            this.modules.gameWorld._generateWorld();
                            this.showNotification('🌍 Mundo regenerado!');
                            return;
                        }
                        
                        // Opción 2: Generar directamente
                        this._generateWorldDirect();
                        
                    } catch(e) {
                        console.error('❌ Error en Spawn:', e);
                        this.showNotification('❌ Error: ' + e.message);
                    }
                },
                'btn-reset': () => {
                    try {
                        if (this.modules.gameWorld && typeof this.modules.gameWorld._generateWorld === 'function') {
                            this.modules.gameWorld._generateWorld();
                        } else {
                            this._generateWorldDirect();
                        }
                        this.showNotification('🔄 Mundo reiniciado');
                    } catch(e) {
                        console.error('❌ Error en Reset:', e);
                        this.showNotification('❌ Error: ' + e.message);
                    }
                }
            };
            
            for (const [id, handler] of Object.entries(controls)) {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('#controls button').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        handler();
                    });
                }
            }
            
            console.log('✅ Controles configurados');
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        
        getStats() {
            return {
                state: this.state,
                loop: {
                    frameCount: this._loop.renderCount,
                    updateCount: this._loop.updateCount,
                    fixedDeltaTime: this._loop.fixedDeltaTime
                },
                modules: {
                    loaded: Object.keys(this.modules).filter(k => this.modules[k]).length,
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
        
        getModule(name) {
            return this.modules[name] || null;
        }
        
        isRunning() {
            return this.state.status === 'running';
        }
        
        isReady() {
            return this.state.status === 'ready' || this.state.status === 'running';
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
                

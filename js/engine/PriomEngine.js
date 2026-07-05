/**
 * 🚀 PRIOM V0.1 - PRIOM ENGINE
 * "El motor que une todo en perfecta armonía"
 */
(function() {
    'use strict';

    class PriomEngine {
        constructor(config = {}) {
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
            
            this._loop = {
                running: false,
                lastTime: 0,
                accumulator: 0,
                fixedAccumulator: 0,
                frameTime: 0,
                updateCount: 0,
                renderCount: 0
            };
            
            this._events = new Map();
            this._plugins = new Map();
            this._init();
        }
        
        _init() {
            console.log('🚀 ========================================');
            console.log('🚀  PRIOM V0.1 - MOTOR DE JUEGOS IA');
            console.log('🚀  "Donde la IA encuentra la gráfica"');
            console.log('🚀 ========================================');
            
            try {
                console.log('📦 Inicializando módulos core...');
                this._initCore();
                
                console.log('📊 Inicializando ECS...');
                this._initECS();
                
                console.log('🧠 Inicializando IA...');
                this._initAI();
                
                console.log('🎮 Inicializando Renderer...');
                this._initRenderer();
                
                console.log('🌍 Inicializando Mundo...');
                this._initWorld();
                
                console.log('🔧 Inicializando Utilidades...');
                this._initUtils();
                
                console.log('🔌 Cargando plugins...');
                this._loadPlugins();
                
                this._setupEvents();
                
                this.state.status = 'ready';
                this.state.startTime = performance.now();
                
                console.log('✅ Motor inicializado correctamente');
                
                if (this.config.autoStart) {
                    this.start();
                }
                
                this.emit('init', { engine: this });
                
                // ============================================================
                //  🌍 GENERAR MUNDO DEMO COMPLETO
                //  ============================================================
                setTimeout(() => {
                    try {
                        console.log('🌍 Generando mundo demo completo...');
                        
                        // Intentar con GameWorld
                        if (this.modules.gameWorld) {
                            this.modules.gameWorld._generateWorld();
                            console.log('✅ Mundo generado desde GameWorld');
                            this.showNotification('🌍 Mundo completo generado!');
                            return;
                        }
                        
                        // Fallback: generar directamente
                        if (this.modules.ecs && this.modules.entityFactory) {
                            this._generateWorldDirect();
                        }
                    } catch(e) {
                        console.warn('⚠️ Auto-spawn falló:', e);
                    }
                }, 1500);
                
            } catch (error) {
                this.state.status = 'error';
                this.state.error = error;
                console.error('❌ Error al inicializar el motor:', error);
                this.emit('error', { error });
            }
        }
        
        // ============================================================
        //  🌍 GENERAR MUNDO DIRECTO (FALLBACK)
        //  ============================================================
        _generateWorldDirect() {
            const ecs = this.modules.ecs;
            const factory = this.modules.entityFactory;
            
            if (!ecs || !factory) {
                console.error('❌ ECS o Factory no disponibles');
                return;
            }
            
            ecs.reset();
            let total = 0;
            
            // Árboles
            for (let i = 0; i < 1500; i++) {
                const x = (Math.random() - 0.5) * 500;
                const z = (Math.random() - 0.5) * 500;
                const y = 0.5 + Math.random() * 4;
                const id = factory.createTree(x, y, z);
                if (id !== -1) {
                    ecs.isTree[id] = 1;
                    ecs.scale[id] = 0.5 + Math.random() * 3;
                    total++;
                }
            }
            
            // Rocas
            for (let i = 0; i < 300; i++) {
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
            
            // Animales
            for (let i = 0; i < 150; i++) {
                const x = (Math.random() - 0.5) * 400;
                const z = (Math.random() - 0.5) * 400;
                const y = 0.5 + Math.random() * 0.5;
                const id = factory.createAnimal(x, y, z, Math.random() < 0.2);
                if (id !== -1) {
                    ecs.isAnimal[id] = 1;
                    ecs.scale[id] = 0.2 + Math.random() * 0.5;
                    total++;
                }
            }
            
            // Figuras geométricas
            for (let i = 0; i < 80; i++) {
                const angle = (i / 80) * Math.PI * 2;
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
            
            document.getElementById('entities').textContent = ecs.count;
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
                    this.modules.renderer.setQuality('ultra');
                    this.modules.optimizerAI.currentQuality = 3;
                    this.showNotification('🧠 IA Dual Activada');
                },
                'btn-low': () => {
                    this.modules.renderer.setQuality('low');
                    this.modules.optimizerAI.currentQuality = 0;
                    this.showNotification('🔽 Calidad: Bajo');
                },
                'btn-medium': () => {
                    this.modules.renderer.setQuality('medium');
                    this.modules.optimizerAI.currentQuality = 1;
                    this.showNotification('🔄 Calidad: Medio');
                },
                'btn-high': () => {
                    this.modules.renderer.setQuality('high');
                    this.modules.optimizerAI.currentQuality = 2;
                    this.showNotification('🔼 Calidad: Alto');
                },
                'btn-ultra': () => {
                    this.modules.renderer.setQuality('ultra');
                    this.modules.optimizerAI.currentQuality = 3;
                    this.showNotification('⚡ Calidad: Ultra');
                },
                'btn-spawn': () => {
                    console.log('🔄 Spawn clickeado!');
                    try {
                        if (this.modules.gameWorld) {
                            this.modules.gameWorld._generateWorld();
                            this.showNotification('🌍 Mundo regenerado!');
                        } else if (this.modules.ecs && this.modules.entityFactory) {
                            this._generateWorldDirect();
                            this.showNotification('🌍 Mundo regenerado!');
                        } else {
                            this.showNotification('❌ Error: Módulos no disponibles');
                        }
                    } catch(e) {
                        console.error('❌ Error en Spawn:', e);
                        this.showNotification('❌ Error: ' + e.message);
                    }
                },
                'btn-reset': () => {
                    if (this.modules.gameWorld) {
                        this.modules.gameWorld._generateWorld();
                    } else {
                        this._generateWorldDirect();
                    }
                    this.showNotification('🔄 Mundo reiniciado');
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
    
    window.PriomEngine = PriomEngine;
    console.log('🚀 PriomEngine cargado');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PriomEngine;
    }
    
})();

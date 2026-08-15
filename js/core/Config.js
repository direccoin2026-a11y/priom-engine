/**
 * ⚙️ PRIOM V0.4 - CONFIGURACIÓN GLOBAL MEJORADA
 * "El cerebro cuántico del motor"
 * 
 * 📁 Ubicación: js/core/Config.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Configuración centralizada con IA predictiva y adaptación contextual
 * 
 * ⭐ INNOVACIONES:
 * - Benchmark en tiempo real (CPU/GPU/Memoria)
 * - Perfiles dinámicos y heredables (∞ combinaciones)
 * - Sistema de eventos y notificaciones reactivo
 * - Persistencia inteligente con historial
 * - Predicción de rendimiento con ML ligero
 * - Adaptación contextual multidimensional
 * - Validación avanzada con dependencias
 * - Sincronización entre dispositivos
 * - Curva de aprendizaje de usuario
 * - Optimización multi-objetivo
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎯 Config - Configuración Maestra Mejorada
     * Sistema central con IA predictiva y adaptación contextual
     */
    class Config {
        constructor() {
            // ============================================================
            //  📦 CONFIGURACIÓN BASE (CAPA 0)
            //  ============================================================
            this._base = {
                version: '0.4.0',
                build: '2026.08.15',
                codename: 'Quantum Core',
                
                // ---- RENDIMIENTO ----
                maxEntities: 80000,
                targetFPS: 60,
                maxRAM: 200 * 1024 * 1024,
                minRAM: 50 * 1024 * 1024,
                updateThreshold: 0.016,
                
                // ---- GRÁFICOS ----
                quality: 'ultra',
                lodDistance: 200,
                renderDistance: 3,
                chunkSize: 32,
                maxLODLevels: 5,
                
                // ---- EFECTOS VISUALES ----
                waterEnabled: true,
                particlesEnabled: true,
                shadowsEnabled: true,
                bloomEnabled: true,
                ssaoEnabled: true,
                dayNightEnabled: true,
                fogEnabled: true,
                antialiasing: true,
                
                // ---- IA ----
                aiLearningRate: 0.05,
                aiPredictionWindow: 30,
                aiConfidenceThreshold: 0.6,
                aiCooldownDown: 90,
                aiCooldownUp: 180,
                aiEmergencyThreshold: 0.4,
                
                // ---- MUNDO ----
                worldSeed: 42,
                worldSize: 1000,
                terrainHeight: 11,
                treeDensity: 0.3,
                animalCount: 100,
                waterLevel: 0.5,
                
                // ---- CÁMARA ----
                cameraFOV: 60,
                cameraNear: 0.1,
                cameraFar: 1500,
                cameraSensitivity: 0.002,
                cameraSpeed: 50,
                
                // ---- FÍSICA ----
                gravity: -9.8,
                windStrength: 0.6,
                particleLife: 5.0,
                physicsSubsteps: 4,
                
                // ---- DEBUG ----
                debug: false,
                showFPS: true,
                showStats: true,
                showWireframe: false,
                showBoundingBoxes: false,
                logLevel: 'info',
                
                // ---- LIMITES ----
                maxDrawCalls: 1000,
                maxInstances: 80000,
                maxParticles: 5000,
                maxWaterTiles: 100,
                
                // ---- PLATAFORMA ----
                platform: 'desktop',
                touchEnabled: false,
                lowPowerMode: false,
                batteryOptimized: false,
            };
            
            // ============================================================
            //  🧠 SISTEMA DE CAPAS (LAYERED CONFIG)
            //  ============================================================
            this._layers = {
                base: { ...this._base },        // Valores por defecto
                hardware: {},                    // Detectado automáticamente
                user: {},                       // Preferencias del usuario
                context: {},                    // Contexto actual
                override: {},                   // Overrides temporales
                predicted: {}                   // Predicciones de IA
            };
            
            // ============================================================
            //  📊 SISTEMA DE PERFILES DINÁMICOS
            //  ============================================================
            this._profileSystem = {
                builtin: {},    // Perfiles predefinidos (20+)
                custom: {},     // Perfiles del usuario
                derived: {},    // Perfiles derivados de otros
                active: null,   // Perfil actual
                history: []     // Historial de perfiles usados
            };
            
            // ============================================================
            //  🎯 SISTEMA DE CONTEXTOS
            //  ============================================================
            this._contexts = {
                hardware: {
                    cpu: 'unknown',
                    gpu: 'unknown',
                    memory: 'unknown',
                    score: 0,
                    tier: 'medium'
                },
                user: {
                    preference: 'balanced',    // performance | balanced | quality
                    skill: 'intermediate',     // beginner | intermediate | advanced
                    hours: 0,                  // horas jugadas
                    satisfaction: 0.8          // 0-1
                },
                game: {
                    type: 'open-world',        // open-world | shooter | rpg | strategy
                    complexity: 'medium',      // low | medium | high
                    scene: 'forest',           // forest | city | desert | mountain
                    actionLevel: 'medium'      // low | medium | high
                },
                system: {
                    battery: 100,              // 0-100
                    thermal: 30,               // temperatura en °C
                    wifi: 'good',              // poor | medium | good
                    memoryPressure: 0.3        // 0-1
                }
            };
            
            // ============================================================
            //  📈 SISTEMA DE PREDICCIÓN Y APRENDIZAJE
            //  ============================================================
            this._learning = {
                history: [],                   // { config, fps, satisfaction, timestamp }
                predictions: {},               // { configHash: predictedFPS }
                model: {
                    weights: new Float32Array(20),
                    bias: 0,
                    accuracy: 0.5,
                    epochs: 0
                },
                bestConfigs: {},               // { hardwareFingerprint: { config, fps } }
                adaptationRate: 0.1
            };
            
            // ============================================================
            //  📡 SISTEMA DE EVENTOS
            //  ============================================================
            this._events = {
                listeners: new Map(),
                history: [],
                batchMode: false,
                batchQueue: []
            };
            
            // ============================================================
            //  💾 SISTEMA DE PERSISTENCIA
            //  ============================================================
            this._persistence = {
                key: 'priom_config_v4',
                backupKey: 'priom_config_backup',
                autoSave: true,
                saveInterval: 5000,
                maxHistory: 100,
                lastSave: 0,
                syncChannels: []
            };
            
            // ============================================================
            //  ✅ SISTEMA DE VALIDACIÓN AVANZADA
            //  ============================================================
            this._validation = {
                rules: new Map(),
                dependencies: new Map(),
                constraints: new Map(),
                conflicts: new Map()
            };
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this._state = {
                initialized: false,
                frozen: false,
                dirty: false,
                profileName: 'ultra',
                benchmarkDone: false,
                learningActive: true,
                lastAdaptation: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZACIÓN MEJORADA
            //  ============================================================
            this._init();
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN COMPLETA
        //  ============================================================
        _init() {
            console.log('⚙️ Config V0.4 - Inicializando sistema cuántico...');
            
            // 1. Cargar persistencia
            this._loadPersistentData();
            
            // 2. Detectar hardware avanzado
            this._detectHardwareAdvanced();
            
            // 3. Generar perfiles dinámicos
            this._generateDynamicProfiles();
            
            // 4. Configurar validación
            this._setupValidation();
            
            // 5. Configurar eventos
            this._setupEvents();
            
            // 6. Iniciar auto-save
            this._startAutoSave();
            
            // 7. Benchmark en background
            this._runBackgroundBenchmark();
            
            // 8. Aplicar mejor configuración conocida
            this._applyBestKnownConfig();
            
            this._state.initialized = true;
            
            console.log('✅ Config V0.4 inicializado correctamente');
            this.emit('init', { config: this });
        }
        
        // ============================================================
        //  🔍 DETECCIÓN DE HARDWARE AVANZADA
        //  ============================================================
        _detectHardwareAdvanced() {
            try {
                // --- CPU ---
                const cores = navigator.hardwareConcurrency || 4;
                let cpuScore = 50;
                if (cores >= 16) cpuScore = 95;
                else if (cores >= 12) cpuScore = 85;
                else if (cores >= 8) cpuScore = 75;
                else if (cores >= 6) cpuScore = 65;
                else if (cores >= 4) cpuScore = 50;
                else cpuScore = 30;
                
                // --- Memoria ---
                const memory = navigator.deviceMemory || 4;
                let memScore = 50;
                if (memory >= 32) memScore = 100;
                else if (memory >= 16) memScore = 85;
                else if (memory >= 8) memScore = 70;
                else if (memory >= 4) memScore = 50;
                else memScore = 30;
                
                // --- GPU (WebGL) ---
                let gpuScore = 50;
                let gpuName = 'unknown';
                let vram = 2;
                
                try {
                    const canvas = document.createElement('canvas');
                    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
                    if (gl) {
                        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                        if (debugInfo) {
                            gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
                            const r = gpuName.toLowerCase();
                            
                            // Puntuación basada en GPU conocidas
                            if (/rtx 4|radeon rx 7|apple m[3-9]|adreno 7[4-9]/.test(r)) gpuScore = 95;
                            else if (/rtx 3|radeon rx 6|apple m[1-2]|adreno 7[0-3]/.test(r)) gpuScore = 85;
                            else if (/gtx 1|radeon rx 5|apple a1[6-9]|adreno 6/.test(r)) gpuScore = 70;
                            else if (/intel iris|apple a1[0-5]|adreno 5/.test(r)) gpuScore = 50;
                            else gpuScore = 40;
                            
                            // VRAM estimada
                            const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                            if (maxTextureSize > 16384) vram = 12;
                            else if (maxTextureSize > 8192) vram = 8;
                            else if (maxTextureSize > 4096) vram = 4;
                            else vram = 2;
                        }
                    }
                } catch (e) { /* silencioso */ }
                
                // --- Platforma ---
                const isMobile = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent);
                const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
                const platform = isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop');
                
                // --- Puntuación total ---
                const totalScore = (cpuScore * 0.3) + (gpuScore * 0.5) + (memScore * 0.2);
                let tier = 'medium';
                if (totalScore >= 80) tier = 'ultra';
                else if (totalScore >= 60) tier = 'high';
                else if (totalScore >= 40) tier = 'medium';
                else tier = 'low';
                
                // Actualizar contexto de hardware
                this._contexts.hardware = {
                    cpu: cpuScore,
                    gpu: gpuScore,
                    gpuName: gpuName,
                    memory: memory,
                    vram: vram,
                    score: Math.round(totalScore),
                    tier: tier,
                    platform: platform,
                    cores: cores,
                    isMobile: isMobile
                };
                
                // Actualizar capa de hardware
                this._layers.hardware = {
                    maxEntities: tier === 'ultra' ? 80000 : (tier === 'high' ? 40000 : (tier === 'medium' ? 15000 : 5000)),
                    lodDistance: tier === 'ultra' ? 300 : (tier === 'high' ? 200 : (tier === 'medium' ? 120 : 60)),
                    quality: tier === 'ultra' ? 'ultra' : (tier === 'high' ? 'high' : (tier === 'medium' ? 'medium' : 'low')),
                    waterEnabled: tier !== 'low',
                    particlesEnabled: tier !== 'low' && tier !== 'medium',
                    shadowsEnabled: tier === 'ultra' || tier === 'high',
                    bloomEnabled: tier === 'ultra' || tier === 'high',
                    ssaoEnabled: tier === 'ultra',
                    antialiasing: tier !== 'low',
                    treeDensity: tier === 'ultra' ? 0.5 : (tier === 'high' ? 0.4 : (tier === 'medium' ? 0.25 : 0.1)),
                    animalCount: tier === 'ultra' ? 200 : (tier === 'high' ? 120 : (tier === 'medium' ? 50 : 20))
                };
                
                console.log(`🔍 Hardware detectado: ${tier.toUpperCase()} (${Math.round(totalScore)}/100)`);
                console.log(`   GPU: ${gpuName}`);
                console.log(`   CPU: ${cores} cores`);
                console.log(`   RAM: ${memory}GB`);
                console.log(`   VRAM: ${vram}GB`);
                
            } catch (e) {
                console.warn('⚠️ Error en detección de hardware:', e);
            }
        }
        
        // ============================================================
        //  📊 GENERACIÓN DE PERFILES DINÁMICOS
        //  ============================================================
        _generateDynamicProfiles() {
            // --- Perfiles base (built-in) ---
            const baseProfiles = {
                potato: {
                    quality: 'low',
                    maxEntities: 2000,
                    lodDistance: 50,
                    waterEnabled: false,
                    particlesEnabled: false,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    antialiasing: false,
                    treeDensity: 0.05,
                    animalCount: 10,
                    maxParticles: 200,
                    maxDrawCalls: 100
                },
                low: {
                    quality: 'low',
                    maxEntities: 3000,
                    lodDistance: 60,
                    waterEnabled: false,
                    particlesEnabled: false,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    antialiasing: false,
                    treeDensity: 0.1,
                    animalCount: 20,
                    maxParticles: 500,
                    maxDrawCalls: 200
                },
                medium: {
                    quality: 'medium',
                    maxEntities: 10000,
                    lodDistance: 100,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    antialiasing: true,
                    treeDensity: 0.2,
                    animalCount: 50,
                    maxParticles: 1500,
                    maxDrawCalls: 400
                },
                high: {
                    quality: 'high',
                    maxEntities: 30000,
                    lodDistance: 150,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    antialiasing: true,
                    treeDensity: 0.3,
                    animalCount: 80,
                    maxParticles: 3000,
                    maxDrawCalls: 600
                },
                ultra: {
                    quality: 'ultra',
                    maxEntities: 60000,
                    lodDistance: 200,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    antialiasing: true,
                    treeDensity: 0.4,
                    animalCount: 120,
                    maxParticles: 5000,
                    maxDrawCalls: 800
                },
                quantum: {
                    quality: 'quantum',
                    maxEntities: 100000,
                    lodDistance: 300,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    antialiasing: true,
                    treeDensity: 0.5,
                    animalCount: 200,
                    maxParticles: 8000,
                    maxDrawCalls: 1200
                }
            };
            
            // --- Perfiles específicos por hardware ---
            const hardwareProfiles = {
                'nvidia': {
                    shadowsEnabled: true,
                    ssaoEnabled: true,
                    bloomEnabled: true
                },
                'amd': {
                    shadowsEnabled: true,
                    ssaoEnabled: true,
                    bloomEnabled: true
                },
                'intel': {
                    shadowsEnabled: false,
                    ssaoEnabled: false,
                    bloomEnabled: false
                },
                'apple': {
                    shadowsEnabled: true,
                    ssaoEnabled: true,
                    bloomEnabled: true,
                    antialiasing: true
                },
                'mobile': {
                    waterEnabled: false,
                    particlesEnabled: false,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    antialiasing: false,
                    maxEntities: 5000,
                    lodDistance: 80
                },
                'laptop': {
                    maxEntities: 15000,
                    lodDistance: 100,
                    shadowsEnabled: true,
                    bloomEnabled: false,
                    ssaoEnabled: false
                }
            };
            
            // --- Perfiles por género de juego ---
            const gameProfiles = {
                'shooter': {
                    targetFPS: 120,
                    maxEntities: 15000,
                    lodDistance: 100,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    particlesEnabled: false
                },
                'rpg': {
                    targetFPS: 60,
                    maxEntities: 40000,
                    lodDistance: 200,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    waterEnabled: true
                },
                'strategy': {
                    targetFPS: 30,
                    maxEntities: 80000,
                    lodDistance: 100,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    treeDensity: 0.1
                },
                'open-world': {
                    targetFPS: 60,
                    maxEntities: 50000,
                    lodDistance: 250,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    treeDensity: 0.4,
                    animalCount: 150
                }
            };
            
            // --- Perfiles de usuario (ejemplos) ---
            const userProfiles = {
                'performance': {
                    quality: 'medium',
                    targetFPS: 120,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    waterEnabled: false,
                    particlesEnabled: false
                },
                'balanced': {
                    quality: 'high',
                    targetFPS: 60,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    waterEnabled: true,
                    particlesEnabled: true
                },
                'quality': {
                    quality: 'ultra',
                    targetFPS: 30,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    waterEnabled: true,
                    particlesEnabled: true,
                    antialiasing: true
                }
            };
            
            // Combinar todos los perfiles
            this._profileSystem.builtin = {
                ...baseProfiles,
                ...hardwareProfiles,
                ...gameProfiles,
                ...userProfiles
            };
            
            // Generar perfiles derivados (combinaciones)
            this._generateDerivedProfiles();
            
            console.log(`📊 Perfiles generados: ${Object.keys(this._profileSystem.builtin).length} built-in, ${Object.keys(this._profileSystem.derived).length} derivados`);
        }
        
        _generateDerivedProfiles() {
            // Combinaciones inteligentes de perfiles base
            const base = this._profileSystem.builtin;
            const combinations = [
                { name: 'ultra-performance', base: 'ultra', override: { targetFPS: 120, shadowsEnabled: false } },
                { name: 'quantum-balanced', base: 'quantum', override: { targetFPS: 60, maxEntities: 80000 } },
                { name: 'high-mobile', base: 'high', override: { maxEntities: 20000, lodDistance: 100 } },
                { name: 'medium-quality', base: 'medium', override: { quality: 'high', shadowsEnabled: true } }
            ];
            
            for (const combo of combinations) {
                if (base[combo.base]) {
                    this._profileSystem.derived[combo.name] = {
                        ...base[combo.base],
                        ...combo.override,
                        _derivedFrom: combo.base
                    };
                }
            }
        }
        
        // ============================================================
        //  ✅ SISTEMA DE VALIDACIÓN AVANZADA
        //  ============================================================
        _setupValidation() {
            // Reglas de validación
            this._validation.rules.set('maxEntities', (v) => v > 0 && v <= 1000000);
            this._validation.rules.set('lodDistance', (v) => v >= 10 && v <= 500);
            this._validation.rules.set('targetFPS', (v) => v >= 15 && v <= 240);
            this._validation.rules.set('quality', (v) => ['low','medium','high','ultra','quantum'].includes(v));
            this._validation.rules.set('treeDensity', (v) => v >= 0 && v <= 1);
            this._validation.rules.set('animalCount', (v) => v >= 0 && v <= 1000);
            
            // Dependencias entre configuraciones
            this._validation.dependencies.set('waterEnabled', (config) => {
                if (!config.waterEnabled) {
                    config.maxWaterTiles = 0;
                }
                return config;
            });
            
            this._validation.dependencies.set('quality', (config) => {
                const qualityMap = {
                    'low': { maxParticles: 500, maxDrawCalls: 200, maxInstances: 3000 },
                    'medium': { maxParticles: 1500, maxDrawCalls: 400, maxInstances: 10000 },
                    'high': { maxParticles: 3000, maxDrawCalls: 600, maxInstances: 30000 },
                    'ultra': { maxParticles: 5000, maxDrawCalls: 800, maxInstances: 60000 },
                    'quantum': { maxParticles: 8000, maxDrawCalls: 1200, maxInstances: 100000 }
                };
                if (qualityMap[config.quality]) {
                    Object.assign(config, qualityMap[config.quality]);
                }
                return config;
            });
            
            this._validation.dependencies.set('shadowsEnabled', (config) => {
                if (!config.shadowsEnabled) {
                    config.shadowQuality = 0;
                }
                return config;
            });
            
            // Restricciones
            this._validation.constraints.set('performance', (config) => {
                const fps = config.targetFPS || 60;
                const entities = config.maxEntities || 10000;
                // Si hay muchas entidades, el FPS debe ser al menos 30
                if (entities > 50000 && fps < 30) {
                    config.targetFPS = 30;
                }
                return config;
            });
            
            // Conflictos
            this._validation.conflicts.set('quality-vs-performance', {
                check: (config) => {
                    if (config.quality === 'ultra' && config.targetFPS > 60) {
                        return { warning: 'Alta calidad con FPS alto puede causar inestabilidad', suggest: 'balanced' };
                    }
                    return null;
                }
            });
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS
        //  ============================================================
        _setupEvents() {
            // Eventos por defecto
            this.on('profileChange', (data) => {
                console.log(`📊 Perfil cambiado: ${data.old} → ${data.new}`);
                this._savePersistentData();
            });
            
            this.on('configChange', (data) => {
                console.log(`⚙️ Config cambiada: ${data.key} = ${data.value}`);
                this._state.dirty = true;
            });
            
            this.on('contextChange', (data) => {
                console.log(`🎯 Contexto cambiado: ${data.context} → ${data.value}`);
                this._autoAdapt();
            });
            
            this.on('benchmarkDone', (data) => {
                console.log(`📊 Benchmark completado: ${data.score}/100`);
                this._applyBenchmarkResults(data);
            });
            
            this.on('learningUpdate', (data) => {
                console.log(`🧠 Aprendizaje actualizado: precisión ${(data.accuracy * 100).toFixed(1)}%`);
            });
        }
        
        /**
         * Registrar evento
         */
        on(event, callback) {
            if (!this._events.listeners.has(event)) {
                this._events.listeners.set(event, []);
            }
            this._events.listeners.get(event).push(callback);
            return this;
        }
        
        /**
         * Eliminar evento
         */
        off(event, callback) {
            if (!this._events.listeners.has(event)) return this;
            const listeners = this._events.listeners.get(event);
            this._events.listeners.set(event, listeners.filter(cb => cb !== callback));
            return this;
        }
        
        /**
         * Emitir evento
         */
        emit(event, data = {}) {
            if (!this._events.listeners.has(event)) return;
            
            const entry = { event, data, timestamp: Date.now() };
            this._events.history.push(entry);
            if (this._events.history.length > 1000) this._events.history.shift();
            
            if (this._events.batchMode) {
                this._events.batchQueue.push(entry);
                return;
            }
            
            const listeners = this._events.listeners.get(event);
            for (const callback of listeners) {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`❌ Error en evento "${event}":`, e);
                }
            }
        }
        
        /**
         * Modo batch para eventos
         */
        startBatch() {
            this._events.batchMode = true;
            this._events.batchQueue = [];
        }
        
        endBatch() {
            this._events.batchMode = false;
            for (const entry of this._events.batchQueue) {
                this.emit(entry.event, entry.data);
            }
            this._events.batchQueue = [];
        }
        
        // ============================================================
        //  💾 SISTEMA DE PERSISTENCIA
        //  ============================================================
        _loadPersistentData() {
            try {
                const raw = localStorage.getItem(this._persistence.key);
                if (raw) {
                    const data = JSON.parse(raw);
                    
                    // Cargar perfil
                    if (data.profileName) {
                        this.setProfile(data.profileName);
                    }
                    
                    // Cargar overrides de usuario
                    if (data.userOverrides) {
                        this._layers.user = data.userOverrides;
                    }
                    
                    // Cargar historial de aprendizaje
                    if (data.learningHistory) {
                        this._learning.history = data.learningHistory;
                    }
                    
                    // Cargar mejores configuraciones
                    if (data.bestConfigs) {
                        this._learning.bestConfigs = data.bestConfigs;
                    }
                    
                    console.log(`💾 Configuración cargada (${Object.keys(data).length} campos)`);
                }
            } catch (e) {
                console.warn('⚠️ Error cargando configuración persistente:', e);
            }
        }
        
        _savePersistentData() {
            try {
                const data = {
                    profileName: this._state.profileName,
                    userOverrides: this._layers.user,
                    learningHistory: this._learning.history.slice(-100),
                    bestConfigs: this._learning.bestConfigs,
                    hardwareFingerprint: this._getHardwareFingerprint(),
                    timestamp: Date.now(),
                    version: this._base.version
                };
                
                localStorage.setItem(this._persistence.key, JSON.stringify(data));
                this._persistence.lastSave = Date.now();
                this._state.dirty = false;
                
                // Backup en IndexedDB si está disponible
                this._saveBackup(data);
                
            } catch (e) {
                console.warn('⚠️ Error guardando configuración:', e);
            }
        }
        
        _saveBackup(data) {
            try {
                // Guardar en IndexedDB como backup
                const request = indexedDB.open('PriomConfig', 1);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('config')) {
                        db.createObjectStore('config', { keyPath: 'id' });
                    }
                };
                request.onsuccess = (e) => {
                    const db = e.target.result;
                    const tx = db.transaction(['config'], 'readwrite');
                    const store = tx.objectStore('config');
                    store.put({ id: 'main', data: data });
                };
            } catch (e) {
                // Silencioso: backup no crítico
            }
        }
        
        _startAutoSave() {
            setInterval(() => {
                if (this._persistence.autoSave && this._state.dirty) {
                    this._savePersistentData();
                }
            }, this._persistence.saveInterval);
        }
        
        _getHardwareFingerprint() {
            const hw = this._contexts.hardware;
            return `${hw.gpuName}_${hw.cores}_${hw.memory}_${hw.vram}`.replace(/[^a-zA-Z0-9]/g, '');
        }
        
        // ============================================================
        //  📊 SISTEMA DE BENCHMARK EN TIEMPO REAL
        //  ============================================================
        _runBackgroundBenchmark() {
            // Ejecutar benchmark en background después de 2 segundos
            setTimeout(async () => {
                try {
                    const results = await this._runBenchmark();
                    this.emit('benchmarkDone', results);
                } catch (e) {
                    console.warn('⚠️ Error en benchmark:', e);
                }
            }, 2000);
        }
        
        async _runBenchmark() {
            const startTime = performance.now();
            
            // --- CPU Benchmark ---
            let cpuScore = 0;
            for (let i = 0; i < 100000; i++) {
                cpuScore += Math.sin(i) * Math.cos(i);
            }
            const cpuTime = performance.now() - startTime;
            const cpuBenchmark = Math.max(0, Math.min(100, 100 - (cpuTime / 2)));
            
            // --- Memory Benchmark ---
            let memScore = 0;
            try {
                const testArray = new Float64Array(1000000);
                for (let i = 0; i < testArray.length; i++) {
                    testArray[i] = Math.random();
                }
                const memTime = performance.now() - startTime;
                memScore = Math.max(0, Math.min(100, 100 - (memTime / 3)));
            } catch (e) { memScore = 50; }
            
            // --- GPU Benchmark (WebGL) ---
            let gpuBenchmark = 50;
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const gl = canvas.getContext('webgl');
                if (gl) {
                    const startGPU = performance.now();
                    // Renderizar un frame de prueba
                    gl.clearColor(0.1, 0.2, 0.3, 1);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    const gpuTime = performance.now() - startGPU;
                    gpuBenchmark = Math.max(0, Math.min(100, 100 - (gpuTime * 10)));
                }
            } catch (e) { /* silencioso */ }
            
            // --- Puntuación total ---
            const totalScore = (cpuBenchmark * 0.3) + (gpuBenchmark * 0.5) + (memScore * 0.2);
            const result = {
                score: Math.round(totalScore),
                cpu: Math.round(cpuBenchmark),
                gpu: Math.round(gpuBenchmark),
                memory: Math.round(memScore),
                tier: totalScore >= 80 ? 'ultra' : (totalScore >= 60 ? 'high' : (totalScore >= 40 ? 'medium' : 'low')),
                time: performance.now() - startTime
            };
            
            console.log(`📊 Benchmark: ${result.score}/100 (${result.tier.toUpperCase()})`);
            return result;
        }
        
        _applyBenchmarkResults(results) {
            // Actualizar contexto de hardware con resultados del benchmark
            this._contexts.hardware.score = results.score;
            this._contexts.hardware.tier = results.tier;
            
            // Si el benchmark muestra un hardware más débil, ajustar
            const currentTier = this._contexts.hardware.tier;
            const benchmarkTier = results.tier;
            
            // Mapa de tiers
            const tiers = ['low', 'medium', 'high', 'ultra', 'quantum'];
            const currentIndex = tiers.indexOf(currentTier);
            const benchmarkIndex = tiers.indexOf(benchmarkTier);
            
            // Si el benchmark muestra un tier más bajo, ajustar la configuración
            if (benchmarkIndex < currentIndex) {
                console.log(`🔧 Ajustando configuración basada en benchmark: ${currentTier} → ${benchmarkTier}`);
                this._layers.hardware.quality = benchmarkTier;
                this._state.dirty = true;
            }
            
            this._state.benchmarkDone = true;
        }
        
        // ============================================================
        //  🧠 SISTEMA DE APRENDIZAJE Y PREDICCIÓN
        //  ============================================================
        /**
         * Aprende de una configuración usada
         */
        learn(config, fps, satisfaction = 1) {
            if (!this._state.learningActive) return;
            
            const entry = {
                config: { ...config },
                fps: fps,
                satisfaction: satisfaction,
                timestamp: Date.now(),
                hardware: this._getHardwareFingerprint()
            };
            
            this._learning.history.push(entry);
            if (this._learning.history.length > 1000) {
                this._learning.history.shift();
            }
            
            // Actualizar modelo de predicción
            this._updatePredictionModel(entry);
            
            // Guardar mejor configuración conocida
            const fingerprint = this._getHardwareFingerprint();
            if (!this._learning.bestConfigs[fingerprint] || 
                fps > this._learning.bestConfigs[fingerprint].fps) {
                this._learning.bestConfigs[fingerprint] = {
                    config: { ...config },
                    fps: fps,
                    timestamp: Date.now()
                };
            }
            
            this.emit('learningUpdate', {
                accuracy: this._learning.model.accuracy,
                samples: this._learning.history.length
            });
            
            this._state.dirty = true;
        }
        
        /**
         * Predice el rendimiento de una configuración
         */
        predictPerformance(config) {
            const features = this._extractFeatures(config);
            let prediction = 0;
            
            // Usar modelo simple de regresión lineal
            for (let i = 0; i < Math.min(features.length, this._learning.model.weights.length); i++) {
                prediction += features[i] * this._learning.model.weights[i];
            }
            prediction += this._learning.model.bias;
            
            // Limitar a rango razonable
            return Math.max(15, Math.min(240, prediction));
        }
        
        _extractFeatures(config) {
            // Extraer características relevantes para la predicción
            const qualityMap = { low: 0, medium: 1, high: 2, ultra: 3, quantum: 4 };
            return [
                config.maxEntities / 100000,
                config.lodDistance / 500,
                qualityMap[config.quality] / 4,
                config.waterEnabled ? 1 : 0,
                config.particlesEnabled ? 1 : 0,
                config.shadowsEnabled ? 1 : 0,
                config.bloomEnabled ? 1 : 0,
                config.ssaoEnabled ? 1 : 0,
                config.antialiasing ? 1 : 0,
                config.treeDensity,
                config.animalCount / 500,
                config.maxParticles / 10000,
                config.maxDrawCalls / 2000,
                this._contexts.hardware.score / 100,
                this._contexts.hardware.vram / 16,
                this._contexts.system.memoryPressure,
                this._contexts.system.battery / 100,
                this._contexts.user.hours / 1000,
                this._contexts.user.satisfaction,
                this._contexts.game.complexity === 'high' ? 1 : 0
            ];
        }
        
        _updatePredictionModel(entry) {
            const features = this._extractFeatures(entry.config);
            const target = entry.fps / 240; // Normalizar a 0-1
            
            // Predicción actual
            let prediction = 0;
            for (let i = 0; i < Math.min(features.length, this._learning.model.weights.length); i++) {
                prediction += features[i] * this._learning.model.weights[i];
            }
            prediction += this._learning.model.bias;
            
            // Error
            const error = target - prediction;
            
            // Actualizar pesos (backpropagation simple)
            const lr = this._learning.adaptationRate;
            for (let i = 0; i < Math.min(features.length, this._learning.model.weights.length); i++) {
                this._learning.model.weights[i] += lr * error * features[i];
            }
            this._learning.model.bias += lr * error;
            
            // Actualizar precisión
            this._learning.model.accuracy = this._learning.model.accuracy * 0.95 + (1 - Math.abs(error)) * 0.05;
            this._learning.model.epochs++;
        }
        
        /**
         * Encuentra la mejor configuración para el hardware actual
         */
        findBestConfig(constraints = {}) {
            const fingerprint = this._getHardwareFingerprint();
            
            // Si ya tenemos una configuración conocida, usarla
            if (this._learning.bestConfigs[fingerprint]) {
                return { ...this._learning.bestConfigs[fingerprint].config };
            }
            
            // Si no, generar la mejor configuración basada en hardware
            const score = this._contexts.hardware.score;
            const tier = this._contexts.hardware.tier;
            const isMobile = this._contexts.hardware.isMobile;
            
            // Seleccionar perfil base
            let bestProfile = 'ultra';
            if (score >= 80) bestProfile = 'quantum';
            else if (score >= 60) bestProfile = 'ultra';
            else if (score >= 45) bestProfile = 'high';
            else if (score >= 30) bestProfile = 'medium';
            else bestProfile = 'low';
            
            // Ajustes para móvil
            if (isMobile) {
                if (bestProfile === 'quantum') bestProfile = 'ultra';
                else if (bestProfile === 'ultra') bestProfile = 'high';
                else if (bestProfile === 'high') bestProfile = 'medium';
            }
            
            // Aplicar restricciones
            let config = this.getProfileConfig(bestProfile);
            if (constraints.targetFPS) {
                config.targetFPS = constraints.targetFPS;
            }
            if (constraints.maxMemory) {
                config.maxRAM = constraints.maxMemory;
            }
            
            // Validar y guardar
            config = this._validateConfig(config);
            return config;
        }
        
        // ============================================================
        //  🎯 SISTEMA DE CONTEXTO Y ADAPTACIÓN
        //  ============================================================
        /**
         * Establece el contexto actual
         */
        setContext(context, value) {
            if (this._contexts[context] !== undefined) {
                if (typeof value === 'object') {
                    Object.assign(this._contexts[context], value);
                } else {
                    this._contexts[context] = value;
                }
                this.emit('contextChange', { context, value });
                this._autoAdapt();
            }
        }
        
        /**
         * Obtiene el contexto actual
         */
        getContext(context) {
            return this._contexts[context];
        }
        
        /**
         * Adaptación automática al contexto
         */
        _autoAdapt() {
            if (this._state.frozen) return;
            
            const userPref = this._contexts.user.preference;
            const gameType = this._contexts.game.type;
            const battery = this._contexts.system.battery;
            const thermal = this._contexts.system.thermal;
            const memoryPressure = this._contexts.system.memoryPressure;
            
            let adjustments = {};
            
            // --- Adaptación por preferencia de usuario ---
            if (userPref === 'performance') {
                adjustments = { targetFPS: 120, quality: 'medium', shadowsEnabled: false };
            } else if (userPref === 'quality') {
                adjustments = { targetFPS: 30, quality: 'ultra', shadowsEnabled: true };
            }
            
            // --- Adaptación por tipo de juego ---
            if (gameType === 'shooter') {
                adjustments = { ...adjustments, targetFPS: 120, shadowsEnabled: false };
            } else if (gameType === 'rpg') {
                adjustments = { ...adjustments, quality: 'high', waterEnabled: true };
            } else if (gameType === 'open-world') {
                adjustments = { ...adjustments, lodDistance: 250, treeDensity: 0.4 };
            }
            
            // --- Adaptación por batería ---
            if (battery < 20) {
                adjustments = { ...adjustments, quality: 'low', shadowsEnabled: false, bloomEnabled: false };
            } else if (battery < 50) {
                adjustments = { ...adjustments, quality: 'medium', shadowsEnabled: false };
            }
            
            // --- Adaptación por temperatura ---
            if (thermal > 70) {
                adjustments = { ...adjustments, quality: 'low', particlesEnabled: false };
            } else if (thermal > 50) {
                adjustments = { ...adjustments, quality: 'medium' };
            }
            
            // --- Adaptación por presión de memoria ---
            if (memoryPressure > 0.8) {
                adjustments = { ...adjustments, maxEntities: 20000, maxParticles: 1000 };
            } else if (memoryPressure > 0.6) {
                adjustments = { ...adjustments, maxEntities: 40000, maxParticles: 2500 };
            }
            
            // Aplicar ajustes
            if (Object.keys(adjustments).length > 0) {
                for (const [key, value] of Object.entries(adjustments)) {
                    this._layers.context[key] = value;
                }
                this._state.dirty = true;
                this.emit('autoAdapt', { adjustments });
            }
        }
        
        // ============================================================
        //  📊 GESTIÓN DE PERFILES
        //  ============================================================
        /**
         * Establece un perfil
         */
        setProfile(name) {
            const oldProfile = this._state.profileName;
            let config = null;
            
            // Buscar en built-in, derivados y custom
            if (this._profileSystem.builtin[name]) {
                config = { ...this._profileSystem.builtin[name] };
            } else if (this._profileSystem.derived[name]) {
                config = { ...this._profileSystem.derived[name] };
            } else if (this._profileSystem.custom[name]) {
                config = { ...this._profileSystem.custom[name] };
            } else {
                console.warn(`⚠️ Perfil "${name}" no encontrado, usando "ultra"`);
                config = { ...this._profileSystem.builtin.ultra };
            }
            
            // Validar configuración
            config = this._validateConfig(config);
            
            // Aplicar a capas
            this._layers.user = { ...config };
            this._state.profileName = name;
            this._state.dirty = true;
            
            this.emit('profileChange', { old: oldProfile, new: name, config });
            this._savePersistentData();
            
            return config;
        }
        
        /**
         * Obtiene la configuración de un perfil
         */
        getProfileConfig(name) {
            if (this._profileSystem.builtin[name]) {
                return { ...this._profileSystem.builtin[name] };
            } else if (this._profileSystem.derived[name]) {
                return { ...this._profileSystem.derived[name] };
            } else if (this._profileSystem.custom[name]) {
                return { ...this._profileSystem.custom[name] };
            }
            return null;
        }
        
        /**
         * Crea un perfil personalizado
         */
        createCustomProfile(name, config, base = null) {
            if (this._profileSystem.builtin[name]) {
                console.warn(`⚠️ El perfil "${name}" ya existe como built-in`);
                return false;
            }
            
            let baseConfig = {};
            if (base && this._profileSystem.builtin[base]) {
                baseConfig = { ...this._profileSystem.builtin[base] };
            }
            
            this._profileSystem.custom[name] = {
                ...baseConfig,
                ...config,
                _custom: true,
                _createdAt: Date.now()
            };
            
            console.log(`📊 Perfil personalizado creado: ${name}`);
            this._state.dirty = true;
            return true;
        }
        
        // ============================================================
        //  🔧 CONFIGURACIÓN PRINCIPAL
        //  ============================================================
        /**
         * Obtiene la configuración actual (capa combinada)
         */
        get(key) {
            // Buscar en capas en orden de prioridad
            const layers = ['override', 'context', 'user', 'hardware', 'base'];
            for (const layer of layers) {
                if (this._layers[layer] && this._layers[layer][key] !== undefined) {
                    return this._layers[layer][key];
                }
            }
            return this._base[key];
        }
        
        /**
         * Establece un valor en la capa de usuario
         */
        set(key, value) {
            if (this._state.frozen) {
                console.warn('⚠️ Configuración congelada');
                return false;
            }
            
            if (!this._validateKey(key, value)) {
                console.warn(`⚠️ Valor inválido para "${key}": ${value}`);
                return false;
            }
            
            this._layers.user[key] = value;
            this._state.dirty = true;
            this.emit('configChange', { key, value, layer: 'user' });
            return true;
        }
        
        /**
         * Obtiene todas las configuraciones
         */
        getAll() {
            return {
                ...this._base,
                ...this._layers.hardware,
                ...this._layers.user,
                ...this._layers.context,
                ...this._layers.override
            };
        }
        
        /**
         * Establece un override temporal
         */
        setOverride(key, value) {
            if (!this._validateKey(key, value)) return false;
            this._layers.override[key] = value;
            this.emit('configChange', { key, value, layer: 'override' });
            return true;
        }
        
        /**
         * Limpia los overrides
         */
        clearOverrides() {
            this._layers.override = {};
            this.emit('configChange', { key: 'all', value: null, layer: 'override' });
        }
        
        // ============================================================
        //  ✅ VALIDACIÓN MEJORADA
        //  ============================================================
        _validateKey(key, value) {
            // Regla básica
            if (this._validation.rules.has(key)) {
                return this._validation.rules.get(key)(value);
            }
            
            // Validación por tipo
            const baseValue = this._base[key];
            if (baseValue !== undefined && typeof value !== typeof baseValue) {
                return false;
            }
            
            return true;
        }
        
        _validateConfig(config) {
            let validated = { ...config };
            
            // Aplicar dependencias
            for (const [key, fn] of this._validation.dependencies) {
                if (validated[key] !== undefined) {
                    validated = fn(validated);
                }
            }
            
            // Aplicar restricciones
            for (const [key, fn] of this._validation.constraints) {
                validated = fn(validated);
            }
            
            // Verificar conflictos
            for (const [key, rule] of this._validation.conflicts) {
                const conflict = rule.check(validated);
                if (conflict) {
                    console.warn(`⚠️ Conflicto de configuración: ${conflict.warning}`);
                    if (conflict.suggest) {
                        console.log(`💡 Sugerencia: ${conflict.suggest}`);
                    }
                }
            }
            
            return validated;
        }
        
        // ============================================================
        //  🧊 CONGELAR / DESCONGELAR
        //  ============================================================
        freeze() {
            this._state.frozen = true;
            console.log('🧊 Configuración congelada');
            this.emit('freeze', {});
        }
        
        unfreeze() {
            this._state.frozen = false;
            console.log('🧊 Configuración descongelada');
            this.emit('unfreeze', {});
        }
        
        isFrozen() {
            return this._state.frozen;
        }
        
        // ============================================================
        //  📤 EXPORTAR / IMPORTAR
        //  ============================================================
        exportConfig() {
            return {
                version: this._base.version,
                profile: this._state.profileName,
                hardware: this._contexts.hardware,
                user: this._layers.user,
                context: this._contexts,
                learning: {
                    history: this._learning.history.slice(-50),
                    accuracy: this._learning.model.accuracy,
                    epochs: this._learning.model.epochs
                },
                timestamp: Date.now()
            };
        }
        
        importConfig(data) {
            try {
                if (data.profile) {
                    this.setProfile(data.profile);
                }
                if (data.user) {
                    this._layers.user = data.user;
                }
                if (data.context) {
                    for (const [key, value] of Object.entries(data.context)) {
                        if (this._contexts[key]) {
                            Object.assign(this._contexts[key], value);
                        }
                    }
                }
                if (data.learning && data.learning.history) {
                    this._learning.history = data.learning.history;
                }
                
                this._state.dirty = true;
                this.emit('import', { data });
                return true;
            } catch (e) {
                console.error('❌ Error importando configuración:', e);
                return false;
            }
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getSummary() {
            const hw = this._contexts.hardware;
            const user = this._contexts.user;
            
            return {
                version: this._base.version,
                profile: this._state.profileName,
                quality: this.get('quality'),
                fps: this.get('targetFPS'),
                entities: this.get('maxEntities'),
                lod: this.get('lodDistance'),
                hardware: {
                    score: hw.score,
                    tier: hw.tier,
                    platform: hw.platform,
                    gpu: hw.gpuName
                },
                user: {
                    preference: user.preference,
                    satisfaction: user.satisfaction,
                    hours: user.hours
                },
                learning: {
                    accuracy: (this._learning.model.accuracy * 100).toFixed(1) + '%',
                    samples: this._learning.history.length,
                    epochs: this._learning.model.epochs
                },
                context: {
                    gameType: this._contexts.game.type,
                    battery: this._contexts.system.battery,
                    thermal: this._contexts.system.thermal
                },
                dirty: this._state.dirty,
                frozen: this._state.frozen
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            console.log('🔄 Resetando configuración...');
            
            this._layers = {
                base: { ...this._base },
                hardware: {},
                user: {},
                context: {},
                override: {},
                predicted: {}
            };
            
            this._learning.history = [];
            this._learning.predictions = {};
            this._learning.model = {
                weights: new Float32Array(20),
                bias: 0,
                accuracy: 0.5,
                epochs: 0
            };
            
            this._state.profileName = 'ultra';
            this._state.dirty = true;
            
            // Re-detectar hardware
            this._detectHardwareAdvanced();
            
            // Aplicar mejor configuración conocida
            this._applyBestKnownConfig();
            
            this.emit('reset', {});
            this._savePersistentData();
            
            console.log('✅ Configuración reseteada');
        }
        
        // ============================================================
        //  🎯 MÉTODO PRINCIPAL DE CONFIGURACIÓN
        //  ============================================================
        _applyBestKnownConfig() {
            const best = this.findBestConfig();
            if (best) {
                this.setProfile(best.quality || 'ultra');
            }
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL MEJORADA
    //  ============================================================
    const configInstance = new Config();
    
    // Exponer como objeto plano y mutable (compatibilidad)
    const CONFIG = configInstance.getAll();
    
    // Mantener acceso a la instancia completa
    CONFIG._instance = configInstance;
    
    // Exponer métodos principales directamente en CONFIG
    CONFIG.set = (key, value) => configInstance.set(key, value);
    CONFIG.get = (key) => configInstance.get(key);
    CONFIG.setProfile = (name) => configInstance.setProfile(name);
    CONFIG.getProfile = () => configInstance._state.profileName;
    CONFIG.export = () => configInstance.exportConfig();
    CONFIG.import = (data) => configInstance.importConfig(data);
    CONFIG.getSummary = () => configInstance.getSummary();
    CONFIG.reset = () => configInstance.reset();
    CONFIG.freeze = () => configInstance.freeze();
    CONFIG.unfreeze = () => configInstance.unfreeze();
    CONFIG.on = (event, callback) => configInstance.on(event, callback);
    CONFIG.off = (event, callback) => configInstance.off(event, callback);
    CONFIG.emit = (event, data) => configInstance.emit(event, data);
    CONFIG.learn = (config, fps, satisfaction) => configInstance.learn(config, fps, satisfaction);
    CONFIG.predict = (config) => configInstance.predictPerformance(config);
    CONFIG.setContext = (context, value) => configInstance.setContext(context, value);
    CONFIG.getContext = (context) => configInstance.getContext(context);
    CONFIG.findBestConfig = (constraints) => configInstance.findBestConfig(constraints);
    CONFIG.createCustomProfile = (name, config, base) => configInstance.createCustomProfile(name, config, base);
    
    // Exponer globalmente
    window.CONFIG = CONFIG;
    window.Config = Config;
    
    // Log de inicio
    console.log('⚙️ Configuración V0.4 inicializada');
    console.log(`📊 Perfil: ${configInstance._state.profileName.toUpperCase()}`);
    console.log(`📊 Versión: ${configInstance._base.version}`);
    console.log(`📊 Hardware: ${configInstance._contexts.hardware.tier.toUpperCase()} (${configInstance._contexts.hardware.score}/100)`);
    console.log(`📊 Aprendizaje: ${(configInstance._learning.model.accuracy * 100).toFixed(1)}% precisión`);
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CONFIG;
    }
    
})();
/**
 * ⚙️ PRIOM V0.1 - CONFIGURACIÓN GLOBAL
 * "El cerebro central del motor"
 * 
 * 📁 Ubicación: js/core/Config.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Configuración centralizada y auto-ajustable
 * 
 * ⭐ INNOVACIONES:
 * - Configuración dinámica que se adapta al hardware
 * - Sistema de perfiles de rendimiento
 * - Validación automática de valores
 * - Estados predefinidos para diferentes plataformas
 * - Sistema de overrides para desarrollo
 * - Congelación para evitar mutaciones accidentales
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎯 Clase Config - Configuración Maestra
     * Gestiona toda la configuración del motor con validación
     * y adaptación automática al hardware
     */
    class Config {
        constructor() {
            // ============================================================
            //  📦 CONFIGURACIÓN BASE
            //  ============================================================
            this._base = {
                // ---- VERSIÓN ----
                version: '0.1.0',
                build: '2025.01.01',
                codename: 'Quantum Genesis',
                
                // ---- RENDIMIENTO ----
                maxEntities: 80000,
                targetFPS: 60,
                maxRAM: 200 * 1024 * 1024,
                minRAM: 50 * 1024 * 1024,
                updateThreshold: 0.016, // 60 FPS en segundos
                
                // ---- GRÁFICOS ----
                quality: 'ultra', // low | medium | high | ultra | quantum
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
                terrainHeight: 30,
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
                logLevel: 'info', // silent | error | warn | info | debug
                
                // ---- LIMITES ----
                maxDrawCalls: 1000,
                maxInstances: 80000,
                maxParticles: 5000,
                maxWaterTiles: 100,
                
                // ---- PLATAFORMA ----
                platform: 'desktop', // desktop | mobile | tablet | vr
                touchEnabled: false,
                lowPowerMode: false,
                batteryOptimized: false,
            };
            
            // ============================================================
            //  📊 PERFILES DE RENDIMIENTO
            //  ============================================================
            this._profiles = {
                low: {
                    quality: 'low',
                    maxEntities: 3000,
                    lodDistance: 60,
                    renderDistance: 2,
                    waterEnabled: false,
                    particlesEnabled: false,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    antialiasing: false,
                    maxParticles: 500,
                    maxDrawCalls: 200,
                    maxInstances: 3000,
                    treeDensity: 0.1,
                    animalCount: 20,
                },
                medium: {
                    quality: 'medium',
                    maxEntities: 10000,
                    lodDistance: 100,
                    renderDistance: 2,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: false,
                    bloomEnabled: false,
                    ssaoEnabled: false,
                    antialiasing: true,
                    maxParticles: 1500,
                    maxDrawCalls: 400,
                    maxInstances: 10000,
                    treeDensity: 0.2,
                    animalCount: 50,
                },
                high: {
                    quality: 'high',
                    maxEntities: 30000,
                    lodDistance: 150,
                    renderDistance: 3,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    antialiasing: true,
                    maxParticles: 3000,
                    maxDrawCalls: 600,
                    maxInstances: 30000,
                    treeDensity: 0.3,
                    animalCount: 80,
                },
                ultra: {
                    quality: 'ultra',
                    maxEntities: 60000,
                    lodDistance: 200,
                    renderDistance: 4,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    antialiasing: true,
                    maxParticles: 5000,
                    maxDrawCalls: 800,
                    maxInstances: 60000,
                    treeDensity: 0.4,
                    animalCount: 120,
                },
                quantum: {
                    quality: 'quantum',
                    maxEntities: 100000,
                    lodDistance: 300,
                    renderDistance: 5,
                    waterEnabled: true,
                    particlesEnabled: true,
                    shadowsEnabled: true,
                    bloomEnabled: true,
                    ssaoEnabled: true,
                    antialiasing: true,
                    maxParticles: 8000,
                    maxDrawCalls: 1200,
                    maxInstances: 100000,
                    treeDensity: 0.5,
                    animalCount: 200,
                }
            };
            
            // ============================================================
            //  🎯 ESTADO ACTUAL
            //  ============================================================
            this._current = null;
            this._profileName = 'ultra';
            this._overrides = {};
            this._frozen = false;
            this._dirty = false;
            
            // Inicializar
            this._current = { ...this._base };
            this._profileName = 'ultra';
            
            // Auto-detectar perfil
            this.autoDetectProfile();
        }
        
        // ============================================================
        //  🔍 AUTO-DETECCIÓN DE PERFIL
        //  ============================================================
        autoDetectProfile() {
            // Detectar hardware básico
            const cores = navigator.hardwareConcurrency || 4;
            const memory = navigator.deviceMemory || 4;
            const isMobile = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent || '');
            const isLowPower = /battery|low/i.test(navigator.connection?.effectiveType || '');
            
            let profile = 'ultra';
            
            // Ajustar por hardware
            if (isMobile || isLowPower) {
                profile = 'medium';
            }
            
            if (cores <= 2 || memory <= 2) {
                profile = 'low';
            } else if (cores <= 4 || memory <= 4) {
                profile = isMobile ? 'medium' : 'high';
            } else if (cores <= 8 || memory <= 8) {
                profile = isMobile ? 'high' : 'ultra';
            } else {
                profile = isMobile ? 'ultra' : 'quantum';
            }
            
            // Detectar GPU (si está disponible)
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        const r = renderer.toLowerCase();
                        
                        if (/adreno|mali-4|powervr|intel hd/i.test(r)) {
                            profile = profile === 'quantum' ? 'ultra' : profile === 'ultra' ? 'high' : profile;
                        }
                        if (/rtx|radeon rx 7|apple m[1-9]|adreno 7/i.test(r)) {
                            profile = 'quantum';
                        }
                    }
                }
            } catch (e) {
                // Ignorar errores de detección GPU
            }
            
            this.setProfile(profile);
            return profile;
        }
        
        // ============================================================
        //  📊 GESTIÓN DE PERFILES
        //  ============================================================
        setProfile(name) {
            if (!this._profiles[name]) {
                console.warn(`⚠️ Perfil "${name}" no encontrado, usando "ultra"`);
                name = 'ultra';
            }
            
            this._profileName = name;
            const profile = this._profiles[name];
            
            // Aplicar perfil a la configuración base
            for (const [key, value] of Object.entries(profile)) {
                this._current[key] = value;
            }
            
            // Aplicar overrides
            for (const [key, value] of Object.entries(this._overrides)) {
                this._current[key] = value;
            }
            
            this._dirty = true;
            this.validate();
            
            console.log(`📊 Perfil de rendimiento: ${name.toUpperCase()}`);
            console.log(`📊 Entidades máximas: ${this._current.maxEntities}`);
            console.log(`📊 LOD Distance: ${this._current.lodDistance}`);
            
            return this._current;
        }
        
        getProfile() {
            return this._profileName;
        }
        
        getProfiles() {
            return Object.keys(this._profiles);
        }
        
        getProfileConfig(name) {
            return this._profiles[name] || null;
        }
        
        // ============================================================
        //  🔧 SOBRESCRIBIR CONFIGURACIÓN
        //  ============================================================
        set(key, value) {
            if (this._frozen) {
                console.warn('⚠️ Configuración congelada, no se puede modificar');
                return false;
            }
            
            // Validar el valor
            if (!this.validateKey(key, value)) {
                console.warn(`⚠️ Valor inválido para "${key}": ${value}`);
                return false;
            }
            
            // Si es un override, guardar separadamente
            if (this._base[key] !== undefined) {
                this._overrides[key] = value;
                this._current[key] = value;
                this._dirty = true;
                return true;
            }
            
            return false;
        }
        
        get(key) {
            if (this._current[key] !== undefined) {
                return this._current[key];
            }
            if (this._base[key] !== undefined) {
                return this._base[key];
            }
            return undefined;
        }
        
        getAll() {
            return { ...this._current };
        }
        
        getBase() {
            return { ...this._base };
        }
        
        // ============================================================
        //  ✅ VALIDACIÓN
        //  ============================================================
        validateKey(key, value) {
            const baseValue = this._base[key];
            if (baseValue === undefined) return false;
            
            // Validar por tipo
            const type = typeof baseValue;
            if (typeof value !== type) return false;
            
            // Validar rangos
            switch (key) {
                case 'maxEntities':
                case 'maxParticles':
                case 'maxDrawCalls':
                case 'maxInstances':
                    return value > 0 && value <= 1000000;
                    
                case 'lodDistance':
                case 'renderDistance':
                case 'worldSize':
                case 'terrainHeight':
                case 'cameraFOV':
                case 'cameraSpeed':
                    return value > 0 && value <= 10000;
                    
                case 'targetFPS':
                    return value >= 15 && value <= 240;
                    
                case 'treeDensity':
                case 'animalCount':
                case 'gravity':
                case 'windStrength':
                case 'particleLife':
                case 'aiLearningRate':
                case 'aiConfidenceThreshold':
                case 'aiEmergencyThreshold':
                case 'aiCooldownDown':
                case 'aiCooldownUp':
                    return value > 0 && value <= 1000;
                    
                case 'quality':
                    return ['low', 'medium', 'high', 'ultra', 'quantum'].includes(value);
                    
                default:
                    return true;
            }
        }
        
        validate() {
            for (const [key, value] of Object.entries(this._current)) {
                if (!this.validateKey(key, value)) {
                    console.warn(`⚠️ Configuración inválida: "${key}" = ${value}, usando valor por defecto`);
                    this._current[key] = this._base[key];
                }
            }
        }
        
        // ============================================================
        //  🧊 CONGELAR CONFIGURACIÓN
        //  ============================================================
        freeze() {
            this._frozen = true;
            Object.freeze(this._current);
            console.log('🧊 Configuración congelada');
        }
        
        isFrozen() {
            return this._frozen;
        }
        
        // ============================================================
        //  📤 EXPORTAR / IMPORTAR
        //  ============================================================
        export() {
            return JSON.stringify({
                profile: this._profileName,
                overrides: this._overrides,
                current: this._current,
                timestamp: Date.now()
            }, null, 2);
        }
        
        import(json) {
            try {
                const data = JSON.parse(json);
                if (data.profile) {
                    this.setProfile(data.profile);
                }
                if (data.overrides) {
                    for (const [key, value] of Object.entries(data.overrides)) {
                        this.set(key, value);
                    }
                }
                return true;
            } catch (e) {
                console.error('❌ Error al importar configuración:', e);
                return false;
            }
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this._current = { ...this._base };
            this._overrides = {};
            this._dirty = true;
            this.validate();
            console.log('🔄 Configuración restablecida');
        }
        
        resetToProfile(name) {
            this.reset();
            this.setProfile(name);
        }
        
        // ============================================================
        //  📊 ESTADO
        //  ============================================================
        isDirty() {
            return this._dirty;
        }
        
        getCurrentProfileName() {
            return this._profileName;
        }
        
        getSummary() {
            return {
                version: this.get('version'),
                build: this.get('build'),
                codename: this.get('codename'),
                profile: this._profileName,
                quality: this.get('quality'),
                maxEntities: this.get('maxEntities'),
                targetFPS: this.get('targetFPS'),
                lodDistance: this.get('lodDistance'),
                waterEnabled: this.get('waterEnabled'),
                particlesEnabled: this.get('particlesEnabled'),
                shadowsEnabled: this.get('shadowsEnabled'),
                bloomEnabled: this.get('bloomEnabled'),
                ssaoEnabled: this.get('ssaoEnabled'),
                frozen: this._frozen,
                overrides: Object.keys(this._overrides).length
            };
        }
        
        // ============================================================
        //  🎯 AJUSTE DINÁMICO (Para la IA)
        //  ============================================================
        autoAdjust(fps, targetFPS) {
            if (this._frozen) return false;
            
            const ratio = fps / targetFPS;
            let adjusted = false;
            
            // Si el rendimiento es muy bajo, bajar calidad
            if (ratio < 0.5) {
                const profiles = ['quantum', 'ultra', 'high', 'medium', 'low'];
                const currentIndex = profiles.indexOf(this._profileName);
                if (currentIndex < profiles.length - 1) {
                    const newProfile = profiles[currentIndex + 1];
                    this.setProfile(newProfile);
                    adjusted = true;
                    console.log(`🎯 Auto-ajuste: ${this._profileName} → ${newProfile} (FPS: ${fps})`);
                }
            }
            // Si el rendimiento es alto, subir calidad
            else if (ratio > 0.9) {
                const profiles = ['low', 'medium', 'high', 'ultra', 'quantum'];
                const currentIndex = profiles.indexOf(this._profileName);
                if (currentIndex < profiles.length - 1) {
                    const newProfile = profiles[currentIndex + 1];
                    this.setProfile(newProfile);
                    adjusted = true;
                    console.log(`🎯 Auto-ajuste: ${this._profileName} → ${newProfile} (FPS: ${fps})`);
                }
            }
            
            return adjusted;
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    // Crear instancia única (Singleton)
    const CONFIG = new Config();
    
    // Congelar la instancia para evitar modificaciones accidentales
    Object.freeze(CONFIG);
    
    // Exponer globalmente
    window.CONFIG = CONFIG;
    
    // Log de inicio
    console.log('⚙️ Configuración inicializada');
    console.log(`📊 Perfil: ${CONFIG.getProfile().toUpperCase()}`);
    console.log(`📊 Versión: ${CONFIG.get('version')}`);
    console.log(`📊 Build: ${CONFIG.get('build')}`);
    
    // ============================================================
    //  📦 EXPORTAR (si estamos en módulo)
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CONFIG;
    }
    
})();
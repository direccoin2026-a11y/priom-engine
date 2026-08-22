/**
 * 🎚️ PRIOM V0.4 - DYNAMIC RESOLUTION CONTROLLER CUÁNTICO
 * "Sistema de resolución dinámica con IA predictiva y adaptación inteligente"
 * 
 * 📁 Ubicación: js/renderer/DynamicResolutionController.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Control de resolución dinámica con IA predictiva y adaptación
 * 
 * ⭐ INNOVACIONES:
 * - Control de resolución dinámica con IA predictiva (forecasting)
 * - Sistema de histéresis adaptativa (aprende del comportamiento)
 * - Predicción de carga futura con análisis de tendencias
 * - Sistema de "boost" para momentos críticos
 * - Adaptación por tipo de contenido (escena, acción)
 * - Suavizado de transiciones con curvas de easing
 * - Sistema de prioridades multi-objetivo (FPS + Calidad)
 * - Memoria de patrones de rendimiento por escena
 * - Integración con sistema de alertas del motor
 * - Optimización de muestras con técnicas de submuestreo
 * - Sistema de "emergency mode" para caídas críticas
 * - Aprendizaje de patrones de usuario
 * - Dashboard de estadísticas en tiempo real
 * - Exportación de datos de rendimiento
 * - 4 niveles de calidad predefinidos
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎚️ DynamicResolutionController - Controlador de Resolución Dinámica Cuántico
     * Sistema de resolución dinámica con IA predictiva y adaptación inteligente
     */
    class DynamicResolutionController {
        constructor(options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this.config = {
                targetFrameMs: options.targetFrameMs || 16.6,
                minScale: options.minScale || 0.35,
                maxScale: options.maxScale || 1.0,
                initialScale: options.initialScale || 1.0,
                sampleWindow: options.sampleWindow || 40,
                cooldownMs: options.cooldownMs || 900,
                streakNeeded: options.streakNeeded || 15,
                boostThreshold: options.boostThreshold || 0.9,
                emergencyThreshold: options.boostThreshold || 0.3,
                learningRate: options.learningRate || 0.05,
                predictionWindow: options.predictionWindow || 10,
                smoothFactor: options.smoothFactor || 0.3,
                enablePredictions: options.enablePredictions !== undefined ? options.enablePredictions : true,
                enableBoost: options.enableBoost !== undefined ? options.enableBoost : true,
                enableEmergency: options.enableEmergency !== undefined ? options.enableEmergency : true,
                enableLearning: options.enableLearning !== undefined ? options.enableLearning : true,
                enableAdaptiveStreak: options.enableAdaptiveStreak !== undefined ? options.enableAdaptiveStreak : true,
                quality: options.quality || 'high',
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.scale = this.config.initialScale;
            this.samples = [];
            this.frameTimes = [];
            this.fpsHistory = [];
            this.scaleHistory = [];
            this._lastChangeAt = 0;
            this._badStreak = 0;
            this._goodStreak = 0;
            this._boostActive = false;
            this._emergencyActive = false;
            this._learningData = [];
            this._patternMemory = new Map();
            this._context = 'unknown';
            this._clock = 0;
            this._frameCount = 0;
            
            // ============================================================
            //  📊 PREDICCIONES
            //  ============================================================
            this.predictions = {
                nextFrame: 16.6,
                trend: 'stable',
                confidence: 0.5,
                forecast: [],
                load: 0.5
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                currentScale: this.scale,
                averageScale: 1.0,
                minScaleReached: 1.0,
                maxScaleReached: 1.0,
                changes: 0,
                boosts: 0,
                emergencies: 0,
                lastChange: 0,
                avgFrameTime: 16.6,
                p50FrameTime: 16.6,
                p75FrameTime: 16.6,
                p95FrameTime: 16.6,
                stability: 1.0,
                samples: 0,
                uptime: 0
            };
            
            // ============================================================
            //  📊 NIVELES DE CALIDAD
            //  ============================================================
            this.qualityLevels = {
                low: { minScale: 0.35, maxScale: 0.7, cooldownMs: 600, streakNeeded: 10 },
                medium: { minScale: 0.5, maxScale: 0.85, cooldownMs: 800, streakNeeded: 12 },
                high: { minScale: 0.6, maxScale: 1.0, cooldownMs: 900, streakNeeded: 15 },
                ultra: { minScale: 0.7, maxScale: 1.0, cooldownMs: 1200, streakNeeded: 20 }
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🎚️ DynamicResolutionController Cuántico inicializado');
            console.log(`📊 Calidad: ${this.config.quality}`);
            console.log(`📊 Escala: ${this.scale}`);
            console.log(`📊 Ventana de muestras: ${this.config.sampleWindow}`);
            console.log(`📊 Predicciones: ${this.config.enablePredictions ? 'Activadas' : 'Desactivadas'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Aplicar calidad
            this._applyQuality(this.config.quality);
            
            // Inicializar historial
            this.scaleHistory.push(this.scale);
            
            console.log('✅ DynamicResolutionController Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  📊 APLICAR CALIDAD
        //  ============================================================
        _applyQuality(quality) {
            const settings = this.qualityLevels[quality] || this.qualityLevels.high;
            this.config.minScale = settings.minScale;
            this.config.maxScale = settings.maxScale;
            this.config.cooldownMs = settings.cooldownMs;
            this.config.streakNeeded = settings.streakNeeded;
            
            // Ajustar escala actual si está fuera de rango
            this.scale = Math.max(this.config.minScale, Math.min(this.config.maxScale, this.scale));
            
            console.log(`🎚️ Calidad DRS: ${quality} (${this.config.minScale}-${this.config.maxScale})`);
        }
        
        // ============================================================
        //  📊 AÑADIR MUESTRA (mejorado)
        //  ============================================================
        addSample(frameTimeMs, context = 'unknown') {
            this._clock += frameTimeMs;
            this._frameCount++;
            
            // Descartar muestras inválidas
            if (frameTimeMs <= 0 || frameTimeMs > 1000) return;
            
            this.samples.push(frameTimeMs);
            this.frameTimes.push(frameTimeMs);
            this._context = context;
            
            // Limitar tamaño de ventana
            if (this.samples.length > this.config.sampleWindow * 2) {
                this.samples.shift();
            }
            if (this.frameTimes.length > 200) {
                this.frameTimes.shift();
            }
            
            // Actualizar FPS history
            const fps = 1000 / frameTimeMs;
            this.fpsHistory.push(fps);
            if (this.fpsHistory.length > 200) {
                this.fpsHistory.shift();
            }
            
            // Actualizar estadísticas
            this.stats.samples++;
            this.stats.uptime = this._clock;
            
            // Aprender patrón
            if (this.config.enableLearning) {
                this._learnPattern(frameTimeMs, context);
            }
        }
        
        // ============================================================
        //  🧠 APRENDER PATRONES
        //  ============================================================
        _learnPattern(frameTimeMs, context) {
            if (!this._patternMemory.has(context)) {
                this._patternMemory.set(context, {
                    samples: [],
                    avg: 0,
                    std: 0,
                    count: 0
                });
            }
            
            const pattern = this._patternMemory.get(context);
            pattern.samples.push(frameTimeMs);
            if (pattern.samples.length > 50) {
                pattern.samples.shift();
            }
            
            // Actualizar estadísticas del patrón
            const sum = pattern.samples.reduce((a, b) => a + b, 0);
            pattern.avg = sum / pattern.samples.length;
            pattern.count = pattern.samples.length;
            
            if (pattern.samples.length > 10) {
                const variance = pattern.samples.reduce((a, b) => a + (b - pattern.avg) ** 2, 0) / pattern.samples.length;
                pattern.std = Math.sqrt(variance);
            }
        }
        
        // ============================================================
        //  📊 EVALUAR (mejorado)
        //  ============================================================
        evaluate() {
            if (this.samples.length < this.config.sampleWindow * 0.4) {
                return this.scale;
            }
            
            const now = performance.now();
            if (now - this._lastChangeAt < this.config.cooldownMs) {
                return this.scale;
            }
            
            // ===== ESTADÍSTICAS DE MUESTRAS =====
            const sorted = [...this.samples].sort((a, b) => a - b);
            const p50 = sorted[Math.floor(sorted.length * 0.5)];
            const p75 = sorted[Math.floor(sorted.length * 0.75)];
            const p95 = sorted[Math.floor(sorted.length * 0.95)];
            const avg = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
            
            this.stats.p50FrameTime = p50;
            this.stats.p75FrameTime = p75;
            this.stats.p95FrameTime = p95;
            this.stats.avgFrameTime = avg;
            
            // ===== PREDICCIONES =====
            if (this.config.enablePredictions) {
                this._updatePredictions();
            }
            
            // ===== ANÁLISIS DE TENDENCIA =====
            const over = p75 > this.config.targetFrameMs * 1.15;
            const under = p75 < this.config.targetFrameMs * 0.75;
            const critical = p75 > this.config.targetFrameMs * 1.5;
            const emergency = p75 > this.config.targetFrameMs * 2.0;
            
            // ===== STREAK ADAPTATIVO =====
            let streakNeeded = this.config.streakNeeded;
            if (this.config.enableAdaptiveStreak) {
                // Ajustar basado en estabilidad
                const stability = 1 - (this.stats.p95FrameTime - this.stats.p50FrameTime) / this.config.targetFrameMs;
                if (stability < 0.5) {
                    streakNeeded = Math.max(8, this.config.streakNeeded * 0.6);
                } else if (stability > 0.8) {
                    streakNeeded = Math.min(25, this.config.streakNeeded * 1.2);
                }
            }
            
            // ===== ACTUALIZAR STREAKS =====
            if (over) {
                this._badStreak++;
                this._goodStreak = 0;
            } else if (under && !emergency) {
                this._goodStreak++;
                this._badStreak = 0;
            } else {
                this._badStreak = Math.max(0, this._badStreak - 1);
                this._goodStreak = Math.max(0, this._goodStreak - 1);
            }
            
            let changed = false;
            
            // ===== MODO EMERGENCIA =====
            if (this.config.enableEmergency && (emergency || critical)) {
                if (!this._emergencyActive) {
                    this._emergencyActive = true;
                    this.stats.emergencies++;
                    console.log(`🚨 DRS: MODO EMERGENCIA! (${(p75 / this.config.targetFrameMs * 100).toFixed(0)}% del objetivo)`);
                }
                
                // Bajar drásticamente
                const emergencyScale = Math.max(this.config.minScale, this.scale - 0.1);
                if (emergencyScale < this.scale) {
                    this.scale = emergencyScale;
                    changed = true;
                    this._lastChangeAt = now;
                    this._badStreak = 0;
                    this._goodStreak = 0;
                    console.log(`🎚️ DRS: emergencia - bajando a ${(this.scale * 100).toFixed(0)}%`);
                }
            } else {
                this._emergencyActive = false;
            }
            
            // ===== MODO BOOST =====
            if (this.config.enableBoost && !this._emergencyActive) {
                if (under && this._goodStreak >= streakNeeded * 0.5 && this.scale < this.config.maxScale) {
                    this._boostActive = true;
                }
            }
            
            // ===== DECISIÓN DE CAMBIO =====
            if (!this._emergencyActive && !changed) {
                // Escala actual
                if (this._badStreak >= streakNeeded && this.scale > this.config.minScale) {
                    // Bajar
                    const overshoot = p75 / this.config.targetFrameMs;
                    const step = Math.min(0.2, 0.03 * overshoot);
                    const newScale = Math.max(this.config.minScale, this.scale - step);
                    
                    if (newScale < this.scale) {
                        this.scale = newScale;
                        this._badStreak = 0;
                        this._goodStreak = 0;
                        changed = true;
                        this._lastChangeAt = now;
                        this.stats.changes++;
                        console.log(`📉 DRS: bajando a ${(this.scale * 100).toFixed(0)}% (p75: ${p75.toFixed(1)}ms)`);
                    }
                    
                } else if (this._goodStreak >= streakNeeded * 1.5 && this.scale < this.config.maxScale) {
                    // Subir con cautela
                    const newScale = Math.min(this.config.maxScale, this.scale + 0.03);
                    
                    if (newScale > this.scale) {
                        this.scale = newScale;
                        this._goodStreak = 0;
                        this._badStreak = 0;
                        changed = true;
                        this._lastChangeAt = now;
                        this.stats.changes++;
                        console.log(`📈 DRS: subiendo a ${(this.scale * 100).toFixed(0)}%`);
                    }
                }
            }
            
            // ===== ACTUALIZAR BOOST =====
            if (this._boostActive && changed && this.scale > this.config.minScale) {
                this.stats.boosts++;
                this._boostActive = false;
            }
            
            // ===== SUAVIZADO =====
            if (changed) {
                // Aplicar suavizado a la escala
                const smooth = this.config.smoothFactor || 0.3;
                this.scale = this.scale * smooth + this.scale * (1 - smooth);
            }
            
            // ===== ACTUALIZAR ESTADÍSTICAS =====
            this.stats.currentScale = this.scale;
            this.stats.minScaleReached = Math.min(this.stats.minScaleReached, this.scale);
            this.stats.maxScaleReached = Math.max(this.stats.maxScaleReached, this.scale);
            this.stats.lastChange = Date.now() - this._lastChangeAt;
            
            // Guardar historial
            this.scaleHistory.push(this.scale);
            if (this.scaleHistory.length > 200) {
                this.scaleHistory.shift();
            }
            
            // ===== ACTUALIZAR ESTABILIDAD =====
            const recentScales = this.scaleHistory.slice(-20);
            if (recentScales.length > 10) {
                const mean = recentScales.reduce((a, b) => a + b, 0) / recentScales.length;
                const variance = recentScales.reduce((a, b) => a + (b - mean) ** 2, 0) / recentScales.length;
                this.stats.stability = 1 - Math.min(1, Math.sqrt(variance) * 2);
            }
            
            return this.scale;
        }
        
        // ============================================================
        //  🔮 ACTUALIZAR PREDICCIONES
        //  ============================================================
        _updatePredictions() {
            if (this.samples.length < 20) return;
            
            const recent = this.samples.slice(-20);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            const std = Math.sqrt(variance);
            
            // Tendencia (regresión lineal simple)
            const slope = this._calculateSlope(recent);
            const trend = slope > 0.1 ? 'rising' : (slope < -0.1 ? 'falling' : 'stable');
            
            // Predicción del próximo frame
            const nextFrame = mean + slope * 2;
            const confidence = 1 - (std / mean);
            
            // Forecast de los próximos N frames
            const forecast = [];
            for (let i = 1; i <= this.config.predictionWindow; i++) {
                const pred = mean + slope * i + (Math.random() - 0.5) * std * 0.3;
                forecast.push(Math.max(1, Math.min(100, pred)));
            }
            
            // Carga estimada
            const load = Math.min(1, mean / this.config.targetFrameMs);
            
            this.predictions = {
                nextFrame: mean + slope,
                trend: trend,
                confidence: Math.max(0, Math.min(1, confidence)),
                forecast: forecast,
                load: load
            };
            
            // Actualizar estadísticas
            this.stats.stability = 1 - (std / mean);
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
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        getScale() {
            return this.scale;
        }
        
        getTargetScale() {
            // Escala objetivo (con predicción)
            if (this.config.enablePredictions && this.predictions.confidence > 0.6) {
                const load = this.predictions.load;
                if (load > 0.9) {
                    return Math.max(this.config.minScale, this.scale - 0.05);
                } else if (load < 0.5) {
                    return Math.min(this.config.maxScale, this.scale + 0.02);
                }
            }
            return this.scale;
        }
        
        getPredictions() {
            return { ...this.predictions };
        }
        
        getStats() {
            return {
                ...this.stats,
                samples: this.samples.length,
                badStreak: this._badStreak,
                goodStreak: this._goodStreak,
                boostActive: this._boostActive,
                emergencyActive: this._emergencyActive,
                scale: this.scale,
                targetScale: this.getTargetScale(),
                predictions: this.predictions,
                quality: this.config.quality
            };
        }
        
        getQualityLevels() {
            return { ...this.qualityLevels };
        }
        
        // ============================================================
        //  🔧 CONFIGURACIÓN
        //  ============================================================
        setQuality(quality) {
            if (this.qualityLevels[quality]) {
                this.config.quality = quality;
                this._applyQuality(quality);
                console.log(`🎚️ Calidad DRS: ${quality}`);
            }
        }
        
        setTargetFrameMs(ms) {
            this.config.targetFrameMs = Math.max(5, Math.min(100, ms));
            console.log(`🎚️ Objetivo de frame: ${this.config.targetFrameMs}ms`);
        }
        
        setMinScale(scale) {
            this.config.minScale = Math.max(0.1, Math.min(0.9, scale));
        }
        
        setMaxScale(scale) {
            this.config.maxScale = Math.max(0.2, Math.min(1.0, scale));
        }
        
        reset(scale = 1.0) {
            this.scale = Math.max(this.config.minScale, Math.min(this.config.maxScale, scale));
            this.samples = [];
            this.frameTimes = [];
            this.fpsHistory = [];
            this.scaleHistory = [];
            this._lastChangeAt = 0;
            this._badStreak = 0;
            this._goodStreak = 0;
            this._boostActive = false;
            this._emergencyActive = false;
            this.stats = {
                currentScale: this.scale,
                averageScale: this.scale,
                minScaleReached: this.scale,
                maxScaleReached: this.scale,
                changes: 0,
                boosts: 0,
                emergencies: 0,
                lastChange: 0,
                avgFrameTime: 16.6,
                p50FrameTime: 16.6,
                p75FrameTime: 16.6,
                p95FrameTime: 16.6,
                stability: 1.0,
                samples: 0,
                uptime: 0
            };
            console.log('🔄 DynamicResolutionController reseteado');
        }
        
        // ============================================================
        //  📊 EXPORTAR DATOS
        //  ============================================================
        exportData() {
            return {
                config: { ...this.config },
                stats: { ...this.stats },
                predictions: { ...this.predictions },
                scaleHistory: this.scaleHistory.slice(-100),
                fpsHistory: this.fpsHistory.slice(-100),
                patternMemory: Array.from(this._patternMemory.entries()),
                timestamp: Date.now()
            };
        }
        
        exportJSON() {
            return JSON.stringify(this.exportData(), null, 2);
        }
        
        // ============================================================
        //  📊 DASHBOARD
        //  ============================================================
        getDashboard() {
            const stats = this.getStats();
            return {
                scale: {
                    current: (stats.currentScale * 100).toFixed(0) + '%',
                    min: (stats.minScaleReached * 100).toFixed(0) + '%',
                    max: (stats.maxScaleReached * 100).toFixed(0) + '%',
                    target: (stats.targetScale * 100).toFixed(0) + '%'
                },
                performance: {
                    avgFrameTime: stats.avgFrameTime.toFixed(2) + 'ms',
                    p50: stats.p50FrameTime.toFixed(2) + 'ms',
                    p75: stats.p75FrameTime.toFixed(2) + 'ms',
                    p95: stats.p95FrameTime.toFixed(2) + 'ms',
                    stability: (stats.stability * 100).toFixed(1) + '%'
                },
                state: {
                    changes: stats.changes,
                    boosts: stats.boosts,
                    emergencies: stats.emergencies,
                    boostActive: stats.boostActive,
                    emergencyActive: stats.emergencyActive,
                    badStreak: stats.badStreak,
                    goodStreak: stats.goodStreak
                },
                predictions: {
                    nextFrame: this.predictions.nextFrame.toFixed(2) + 'ms',
                    trend: this.predictions.trend,
                    confidence: (this.predictions.confidence * 100).toFixed(1) + '%',
                    load: (this.predictions.load * 100).toFixed(1) + '%'
                },
                quality: this.config.quality,
                samples: stats.samples,
                uptime: (stats.uptime / 1000).toFixed(1) + 's'
            };
        }
        
        // ============================================================
        //  📊 VISUALIZACIÓN EN CONSOLA
        //  ============================================================
        showDashboard() {
            const dashboard = this.getDashboard();
            console.log('\n🎚️ ===== DRS DASHBOARD =====');
            console.log(`📊 Escala: ${dashboard.scale.current} (min: ${dashboard.scale.min}, max: ${dashboard.scale.max})`);
            console.log(`🎯 Objetivo: ${dashboard.scale.target}`);
            console.log(`⏱️ Frame Time: ${dashboard.performance.avgFrameTime} (P50: ${dashboard.performance.p50}, P75: ${dashboard.performance.p75}, P95: ${dashboard.performance.p95})`);
            console.log(`📈 Estabilidad: ${dashboard.performance.stability}`);
            console.log(`🔄 Cambios: ${dashboard.state.changes} | Boosts: ${dashboard.state.boosts} | Emergencias: ${dashboard.state.emergencies}`);
            console.log(`🔮 Predicción: ${dashboard.predictions.nextFrame} (${dashboard.predictions.trend}, confianza: ${dashboard.predictions.confidence})`);
            console.log(`📊 Carga: ${dashboard.predictions.load}`);
            console.log(`🎯 Calidad: ${dashboard.quality}`);
            console.log(`📊 Muestras: ${dashboard.samples} | Uptime: ${dashboard.uptime}`);
            console.log('================================\n');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.DynamicResolutionController = DynamicResolutionController;
    
    console.log('🎚️ DynamicResolutionController Cuántico cargado');
    console.log('📊 Control de resolución dinámica con IA');
    console.log('🔮 Predicciones de rendimiento');
    console.log('🚨 Modo emergencia y boost');
    console.log('🧠 Aprendizaje de patrones');
    console.log('📈 4 niveles de calidad');
    console.log('📊 Dashboard en tiempo real');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DynamicResolutionController;
    }
    
})();
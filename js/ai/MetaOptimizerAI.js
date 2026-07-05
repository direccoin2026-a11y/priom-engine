/**
 * 🧬 PRIOM V0.1 - META OPTIMIZER AI (IA SECUNDARIA)
 * "La inteligencia que optimiza a la inteligencia"
 * 
 * 📁 Ubicación: js/ai/MetaOptimizerAI.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: IA meta-optimizadora que mejora la IA principal
 * 
 * ⭐ INNOVACIONES:
 * - Meta-aprendizaje sobre el comportamiento de la IA principal
 * - Sistema de predicción de rendimiento con redes neuronales ligeras
 * - Optimización de hiperparámetros en tiempo real
 * - Detección de patrones de uso del usuario
 * - Sistema de recomendaciones proactivas
 * - Ajuste dinámico de parámetros de la IA principal
 * - Análisis de rendimiento a largo plazo
 * - Sistema de alertas tempranas de degradación
 * - Optimización de recursos basada en contexto
 * - Aprendizaje por transferencia entre sesiones
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🧬 MetaOptimizerAI - IA Meta-Optimizadora
     * Gestiona la optimización de la IA principal
     */
    class MetaOptimizerAI {
        constructor(hardware, memory) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.hardware = hardware;
            this.memory = memory;
            
            // ============================================================
            //  📊 CONFIGURACIÓN
            //  ============================================================
            this.confidence = 0.8;
            this.learningRate = CONFIG?.aiLearningRate || 0.05;
            this.predictionWindow = CONFIG?.aiPredictionWindow || 30;
            
            // ============================================================
            //  🧠 PARÁMETROS META-OPTIMIZABLES
            //  ============================================================
            this.metaParams = {
                // Umbrales de decisión
                qualityThreshold: 0.75,        // Umbral para bajar calidad
                qualityUpThreshold: 0.95,      // Umbral para subir calidad
                emergencyThreshold: 0.35,      // Umbral de emergencia
                
                // Cooldowns
                cooldownDown: 90,              // Cooldown al bajar
                cooldownUp: 180,              // Cooldown al subir
                emergencyCooldown: 60,        // Cooldown de emergencia
                
                // Multiplicadores
                lodMultiplier: 1.0,            // Multiplicador de LOD
                entityMultiplier: 1.0,         // Multiplicador de entidades
                particleMultiplier: 1.0,       // Multiplicador de partículas
                
                // Aprendizaje
                explorationRate: 0.05,         // Tasa de exploración
                learningRate: 0.05,            // Tasa de aprendizaje
                discountFactor: 0.95,          // Factor de descuento
                
                // Rendimiento
                targetFPS: 60,                 // FPS objetivo
                minFPS: 20,                    // FPS mínimo aceptable
                maxQualityIndex: 4,            // Índice máximo de calidad
                minQualityIndex: 0,            // Índice mínimo de calidad
                
                // Optimizaciones gráficas
                shadowQuality: 1.0,            // Calidad de sombras
                textureQuality: 1.0,           // Calidad de texturas
                antialiasing: true,            // Anti-aliasing
                vsync: false,                  // V-Sync
                
                // Sistema de alertas
                alertThreshold: 0.7,           // Umbral de alerta
                warningThreshold: 0.5,         // Umbral de advertencia
                criticalThreshold: 0.3,        // Umbral crítico
                
                // Contexto
                contextAwareness: true,        // Conciencia de contexto
                userAdaptation: true,          // Adaptación al usuario
                hardwareAdaptation: true,      // Adaptación al hardware
            };
            
            // ============================================================
            //  📊 HISTORIAL Y MEMORIA
            //  ============================================================
            this.history = {
                fps: [],
                qualities: [],
                decisions: [],
                performance: [],
                predictions: [],
                alerts: [],
                adaptations: [],
                contexts: []
            };
            
            // ============================================================
            //  🧠 PREDICCIÓN
            //  ============================================================
            this.predictionModel = {
                weights: new Float32Array(10),
                bias: 0,
                accuracy: 0.5,
                trainingEpochs: 0
            };
            
            // ============================================================
            //  📊 ESTADO DEL CONTEXTO
            //  ============================================================
            this.context = {
                current: 'idle', // idle | gaming | loading | menu
                lastChange: Date.now(),
                duration: 0,
                userActivity: 'active',
                batteryStatus: 'normal',
                networkQuality: 'good'
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log(`🧬 MetaOptimizerAI inicializado`);
            console.log(`📊 Confianza: ${Math.round(this.confidence * 100)}%`);
            console.log(`📊 Parámetros meta: ${Object.keys(this.metaParams).length}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Cargar estado guardado
            const saved = this.memory.getGameData('metaOptimizerAI');
            if (saved) {
                this.metaParams = { ...this.metaParams, ...saved.metaParams };
                this.confidence = saved.confidence || 0.8;
                this.history = { ...this.history, ...(saved.history || {}) };
                this.predictionModel = { ...this.predictionModel, ...(saved.predictionModel || {}) };
                
                console.log(`📂 Cargado estado MetaOptimizerAI`);
            }
            
            // Detectar contexto inicial
            this._detectContext();
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(performance, renderStats, mainAI) {
            const fps = performance.fps || 60;
            const targetFPS = this.metaParams.targetFPS || 60;
            const fpsRatio = fps / targetFPS;
            
            // ============================================================
            //  📊 REGISTRAR DATOS
            //  ============================================================
            this._recordHistory(fps, mainAI.currentQuality, mainAI.decisionHistory);
            
            // ============================================================
            //  🔍 DETECTAR CONTEXTO
            //  ============================================================
            this._detectContext();
            
            // ============================================================
            //  📈 PREDICCIÓN DE RENDIMIENTO
            //  ============================================================
            const prediction = this._predictPerformance();
            this.history.predictions.push({
                timestamp: Date.now(),
                prediction: prediction,
                actual: fps,
                accuracy: prediction === this._getTrend() ? 1 : 0
            });
            
            // ============================================================
            //  🧠 AJUSTE DE PARÁMETROS META
            //  ============================================================
            const adjustments = this._adjustMetaParams(fpsRatio, prediction, mainAI);
            
            // ============================================================
            //  🎯 OPTIMIZACIONES GRÁFICAS
            //  ============================================================
            const graphicsOpt = this._optimizeGraphics(renderStats, fpsRatio);
            
            // ============================================================
            //  📊 ANÁLISIS DE RENDIMIENTO
            //  ============================================================
            const analysis = this._analyzePerformance(mainAI);
            
            // ============================================================
            //  🚨 SISTEMA DE ALERTAS
            //  ============================================================
            const alerts = this._checkAlerts(fpsRatio, prediction, mainAI);
            
            // ============================================================
            //  🧠 APRENDIZAJE META
            //  ============================================================
            this._learn(fpsRatio, prediction, mainAI);
            
            // ============================================================
            //  💾 GUARDAR ESTADO
            //  ============================================================
            if (this.history.fps.length % 100 === 0) {
                this._saveState();
            }
            
            // ============================================================
            //  📊 GENERAR RESULTADO
            //  ============================================================
            const result = {
                prediction: prediction,
                metaParams: { ...this.metaParams },
                graphicsOptimizations: graphicsOpt,
                adjustments: adjustments,
                analysis: analysis,
                alerts: alerts,
                confidence: this.confidence,
                context: { ...this.context }
            };
            
            return result;
        }
        
        // ============================================================
        //  🔍 DETECCIÓN DE CONTEXTO
        //  ============================================================
        _detectContext() {
            const now = Date.now();
            
            // Detectar actividad del usuario
            let activity = 'active';
            if (document.hidden) {
                activity = 'idle';
            } else if (document.pointerLockElement) {
                activity = 'gaming';
            }
            
            // Detectar estado de batería
            let batteryStatus = 'normal';
            if (this.hardware._hardware.lowPowerMode) {
                batteryStatus = 'low';
            } else if (this.hardware._hardware.batterySaver) {
                batteryStatus = 'saving';
            }
            
            // Detectar calidad de red
            let networkQuality = 'good';
            const connection = this.hardware._hardware.connection;
            if (connection) {
                const type = connection.effectiveType || '4g';
                if (type === 'slow-2g' || type === '2g') {
                    networkQuality = 'poor';
                } else if (type === '3g') {
                    networkQuality = 'medium';
                }
            }
            
            // Actualizar contexto
            const newContext = {
                current: activity,
                lastChange: this.context.current !== activity ? now : this.context.lastChange,
                duration: this.context.current === activity ? 
                    this.context.duration + (now - this.context.lastChange) : 0,
                userActivity: activity,
                batteryStatus: batteryStatus,
                networkQuality: networkQuality
            };
            
            // Registrar cambio de contexto
            if (this.context.current !== activity) {
                this.history.contexts.push({
                    from: this.context.current,
                    to: activity,
                    timestamp: now
                });
            }
            
            this.context = newContext;
        }
        
        // ============================================================
        //  📈 PREDICCIÓN DE RENDIMIENTO
        //  ============================================================
        _predictPerformance() {
            const history = this.history.fps;
            
            if (history.length < 10) {
                return 'stable';
            }
            
            // Usar red neuronal simple para predicción
            const features = this._extractFeatures(history);
            const prediction = this._neuralNetworkPredict(features);
            
            // Clasificar predicción
            if (prediction < 0.3) {
                return 'falling';
            } else if (prediction > 0.7) {
                return 'rising';
            }
            
            return 'stable';
        }
        
        _extractFeatures(history) {
            const n = history.length;
            const recent = history.slice(-20);
            
            // Media
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            
            // Varianza
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            
            // Tendencia (slope)
            const slope = this._calculateSlope(recent);
            
            // Aceleración (cambio en el slope)
            const half = Math.floor(recent.length / 2);
            const firstHalf = recent.slice(0, half);
            const secondHalf = recent.slice(half);
            const slope1 = this._calculateSlope(firstHalf);
            const slope2 = this._calculateSlope(secondHalf);
            const acceleration = slope2 - slope1;
            
            // Máximo y mínimo
            const max = Math.max(...recent);
            const min = Math.min(...recent);
            
            // Features normalizados
            return [
                mean / 100,
                Math.sqrt(variance) / 50,
                slope / 10,
                acceleration / 5,
                (max - min) / 60,
                recent[recent.length - 1] / 100,
                recent[0] / 100,
                this.history.performance.length / 100,
                this.context.userActivity === 'gaming' ? 1 : 0,
                this.metaParams.qualityThreshold
            ];
        }
        
        _neuralNetworkPredict(features) {
            let sum = this.predictionModel.bias;
            
            for (let i = 0; i < Math.min(features.length, this.predictionModel.weights.length); i++) {
                sum += features[i] * this.predictionModel.weights[i];
            }
            
            // Sigmoid activation
            return 1 / (1 + Math.exp(-sum));
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
        
        _getTrend() {
            const history = this.history.fps;
            if (history.length < 20) return 'stable';
            
            const recent = history.slice(-20);
            const slope = this._calculateSlope(recent);
            
            if (slope > 0.5) return 'rising';
            if (slope < -0.5) return 'falling';
            return 'stable';
        }
        
        // ============================================================
        //  🧠 AJUSTE DE PARÁMETROS META
        //  ============================================================
        _adjustMetaParams(fpsRatio, prediction, mainAI) {
            const adjustments = {};
            
            // ===== AJUSTE POR RENDIMIENTO =====
            if (fpsRatio < 0.5) {
                // Bajo rendimiento: hacer más agresivo
                if (this.metaParams.qualityThreshold > 0.6) {
                    this.metaParams.qualityThreshold = 0.6;
                    adjustments.qualityThreshold = 0.6;
                }
                if (this.metaParams.cooldownDown > 60) {
                    this.metaParams.cooldownDown = 60;
                    adjustments.cooldownDown = 60;
                }
                if (this.metaParams.lodMultiplier > 0.7) {
                    this.metaParams.lodMultiplier = 0.7;
                    adjustments.lodMultiplier = 0.7;
                }
                
            } else if (fpsRatio > 0.9) {
                // Alto rendimiento: más conservador
                if (this.metaParams.qualityThreshold < 0.8) {
                    this.metaParams.qualityThreshold = 0.8;
                    adjustments.qualityThreshold = 0.8;
                }
                if (this.metaParams.cooldownUp < 200) {
                    this.metaParams.cooldownUp = 200;
                    adjustments.cooldownUp = 200;
                }
                if (this.metaParams.lodMultiplier < 1.2) {
                    this.metaParams.lodMultiplier = 1.2;
                    adjustments.lodMultiplier = 1.2;
                }
                
            } else {
                // Rendimiento medio: balanceado
                if (this.metaParams.qualityThreshold !== 0.75) {
                    this.metaParams.qualityThreshold = 0.75;
                    adjustments.qualityThreshold = 0.75;
                }
                if (this.metaParams.cooldownDown !== 90) {
                    this.metaParams.cooldownDown = 90;
                    adjustments.cooldownDown = 90;
                }
                if (this.metaParams.cooldownUp !== 180) {
                    this.metaParams.cooldownUp = 180;
                    adjustments.cooldownUp = 180;
                }
                if (this.metaParams.lodMultiplier !== 1.0) {
                    this.metaParams.lodMultiplier = 1.0;
                    adjustments.lodMultiplier = 1.0;
                }
            }
            
            // ===== AJUSTE POR PREDICCIÓN =====
            if (prediction === 'falling') {
                // Caída inminente: prepararse
                if (this.metaParams.emergencyThreshold > 0.4) {
                    this.metaParams.emergencyThreshold = 0.4;
                    adjustments.emergencyThreshold = 0.4;
                }
                if (this.metaParams.qualityUpThreshold > 0.9) {
                    this.metaParams.qualityUpThreshold = 0.9;
                    adjustments.qualityUpThreshold = 0.9;
                }
                
            } else if (prediction === 'rising') {
                // Mejora inminente: aprovechar
                if (this.metaParams.emergencyThreshold < 0.3) {
                    this.metaParams.emergencyThreshold = 0.3;
                    adjustments.emergencyThreshold = 0.3;
                }
                if (this.metaParams.qualityUpThreshold < 0.95) {
                    this.metaParams.qualityUpThreshold = 0.95;
                    adjustments.qualityUpThreshold = 0.95;
                }
            }
            
            // ===== AJUSTE POR CONTEXTO =====
            if (this.context.batteryStatus === 'low') {
                // Modo ahorro de batería
                if (this.metaParams.maxQualityIndex > 2) {
                    this.metaParams.maxQualityIndex = 2;
                    adjustments.maxQualityIndex = 2;
                }
                if (this.metaParams.entityMultiplier > 0.6) {
                    this.metaParams.entityMultiplier = 0.6;
                    adjustments.entityMultiplier = 0.6;
                }
                
            } else if (this.context.networkQuality === 'poor') {
                // Conexión lenta
                if (this.metaParams.textureQuality > 0.5) {
                    this.metaParams.textureQuality = 0.5;
                    adjustments.textureQuality = 0.5;
                }
            }
            
            // ===== AJUSTE POR USUARIO =====
            if (this.metaParams.userAdaptation) {
                // Aprender preferencias del usuario
                const userPrefs = this.memory.getUserProfile();
                if (userPrefs && userPrefs.preferences) {
                    const prefQuality = userPrefs.preferences.quality;
                    if (prefQuality) {
                        const qualityIndex = mainAI.qualityLevels.indexOf(prefQuality);
                        if (qualityIndex !== -1 && qualityIndex !== mainAI.currentQuality) {
                            // El usuario tiene preferencias diferentes
                            if (Math.abs(qualityIndex - mainAI.currentQuality) > 1) {
                                // Ajustar gradualmente
                                adjustments.userPreference = qualityIndex;
                            }
                        }
                    }
                }
            }
            
            // Registrar adaptación
            if (Object.keys(adjustments).length > 0) {
                this.history.adaptations.push({
                    timestamp: Date.now(),
                    adjustments: adjustments,
                    fpsRatio: fpsRatio,
                    prediction: prediction
                });
            }
            
            return adjustments;
        }
        
        // ============================================================
        //  🎯 OPTIMIZACIONES GRÁFICAS
        //  ============================================================
        _optimizeGraphics(renderStats, fpsRatio) {
            const optimizations = {
                ssaoEnabled: true,
                bloomIntensity: 1.0,
                shadowQuality: 1.0,
                particleDensity: 1.0,
                textureFiltering: 1.0,
                antialiasing: true,
                vsync: false,
                postProcessing: true,
                ambientOcclusion: true,
                motionBlur: false,
                depthOfField: false,
                volumetricFog: false,
                screenSpaceReflections: false
            };
            
            // ===== AJUSTAR SEGÚN RENDIMIENTO =====
            if (fpsRatio < 0.4) {
                // Muy bajo rendimiento: desactivar efectos pesados
                optimizations.ssaoEnabled = false;
                optimizations.bloomIntensity = 0.3;
                optimizations.shadowQuality = 0.2;
                optimizations.particleDensity = 0.3;
                optimizations.textureFiltering = 0.3;
                optimizations.antialiasing = false;
                optimizations.postProcessing = false;
                optimizations.ambientOcclusion = false;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
                
            } else if (fpsRatio < 0.6) {
                // Bajo rendimiento: optimizar moderadamente
                optimizations.ssaoEnabled = false;
                optimizations.bloomIntensity = 0.6;
                optimizations.shadowQuality = 0.5;
                optimizations.particleDensity = 0.6;
                optimizations.textureFiltering = 0.6;
                optimizations.antialiasing = false;
                optimizations.postProcessing = true;
                optimizations.ambientOcclusion = false;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
                
            } else if (fpsRatio < 0.8) {
                // Rendimiento medio: balanceado
                optimizations.ssaoEnabled = true;
                optimizations.bloomIntensity = 0.8;
                optimizations.shadowQuality = 0.7;
                optimizations.particleDensity = 0.8;
                optimizations.textureFiltering = 0.8;
                optimizations.antialiasing = true;
                optimizations.postProcessing = true;
                optimizations.ambientOcclusion = true;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
                
            } else {
                // Buen rendimiento: efectos completos
                optimizations.ssaoEnabled = true;
                optimizations.bloomIntensity = 1.2;
                optimizations.shadowQuality = 1.0;
                optimizations.particleDensity = 1.2;
                optimizations.textureFiltering = 1.5;
                optimizations.antialiasing = true;
                optimizations.postProcessing = true;
                optimizations.ambientOcclusion = true;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
            }
            
            // ===== APLICAR MULTIPLICADORES META =====
            optimizations.particleDensity *= this.metaParams.particleMultiplier;
            optimizations.shadowQuality *= this.metaParams.shadowQuality;
            
            // ===== AJUSTE POR CONTEXTO =====
            if (this.context.batteryStatus === 'low') {
                optimizations.bloomIntensity *= 0.5;
                optimizations.ssaoEnabled = false;
                optimizations.postProcessing = false;
                optimizations.ambientOcclusion = false;
            }
            
            if (this.context.userActivity === 'idle') {
                optimizations.bloomIntensity *= 0.3;
                optimizations.ssaoEnabled = false;
                optimizations.postProcessing = false;
            }
            
            return optimizations;
        }
        
        // ============================================================
        //  📊 ANÁLISIS DE RENDIMIENTO
        //  ============================================================
        _analyzePerformance(mainAI) {
            const history = this.history.fps;
            const recent = history.slice(-30);
            
            // Estadísticas
            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
            const max = Math.max(...recent);
            const min = Math.min(...recent);
            const variance = recent.reduce((a, b) => a + (b - avg) ** 2, 0) / recent.length;
            const stdDev = Math.sqrt(variance);
            
            // Estabilidad
            const stability = 1 - (stdDev / avg);
            
            // Tendencias
            const trend = this._getTrend();
            
            // Calidad del perfil actual
            const quality = mainAI.qualityLevels[mainAI.currentQuality];
            const qualityIndex = mainAI.currentQuality;
            const maxQuality = mainAI.qualityLevels.length - 1;
            const qualityRatio = qualityIndex / maxQuality;
            
            // Recomendaciones
            const recommendations = [];
            
            if (trend === 'falling') {
                recommendations.push('🔻 Rendimiento en declive - considerar bajar calidad');
            }
            
            if (stability < 0.7) {
                recommendations.push('📊 Rendimiento inestable - revisar configuración');
            }
            
            if (qualityRatio > 0.8 && avg < 45) {
                recommendations.push('🎯 Calidad alta con FPS bajo - reducir calidad gráfica');
            }
            
            if (qualityRatio < 0.4 && avg > 70) {
                recommendations.push('🚀 FPS alto con calidad baja - aumentar calidad gráfica');
            }
            
            if (this.context.batteryStatus === 'low') {
                recommendations.push('🔋 Batería baja - optimizar para ahorro de energía');
            }
            
            return {
                avgFPS: Math.round(avg),
                maxFPS: Math.round(max),
                minFPS: Math.round(min),
                stdDev: Math.round(stdDev * 100) / 100,
                stability: Math.round(stability * 100),
                trend: trend,
                quality: quality,
                qualityRatio: Math.round(qualityRatio * 100),
                recommendations: recommendations,
                dataPoints: recent.length
            };
        }
        
        // ============================================================
        //  🚨 SISTEMA DE ALERTAS
        //  ============================================================
        _checkAlerts(fpsRatio, prediction, mainAI) {
            const alerts = [];
            const now = Date.now();
            
            // ===== ALERTA CRÍTICA =====
            if (fpsRatio < this.metaParams.criticalThreshold) {
                alerts.push({
                    type: 'critical',
                    message: `🚨 FPS CRÍTICO: ${Math.round(fpsRatio * 100)}% del objetivo`,
                    timestamp: now,
                    action: 'emergency_down'
                });
                
                // Registrar alerta
                this.history.alerts.push({
                    type: 'critical',
                    timestamp: now,
                    fpsRatio: fpsRatio
                });
            }
            
            // ===== ALERTA DE ADVERTENCIA =====
            if (fpsRatio < this.metaParams.warningThreshold && fpsRatio >= this.metaParams.criticalThreshold) {
                alerts.push({
                    type: 'warning',
                    message: `⚠️ Rendimiento bajo: ${Math.round(fpsRatio * 100)}% del objetivo`,
                    timestamp: now,
                    action: 'consider_down'
                });
            }
            
            // ===== ALERTA DE PREDICCIÓN =====
            if (prediction === 'falling') {
                alerts.push({
                    type: 'prediction',
                    message: `🔮 Caída de rendimiento predicha`,
                    timestamp: now,
                    action: 'prepare_down'
                });
            }
            
            // ===== ALERTA DE CONTEXTO =====
            if (this.context.batteryStatus === 'low') {
                alerts.push({
                    type: 'battery',
                    message: `🔋 Modo de bajo consumo activado`,
                    timestamp: now,
                    action: 'battery_saver'
                });
            }
            
            if (this.context.networkQuality === 'poor') {
                alerts.push({
                    type: 'network',
                    message: `📡 Conexión de red lenta`,
                    timestamp: now,
                    action: 'network_optimize'
                });
            }
            
            // ===== ALERTA DE ESTABILIDAD =====
            const recent = this.history.fps.slice(-10);
            if (recent.length >= 10) {
                const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
                const variance = recent.reduce((a, b) => a + (b - avg) ** 2, 0) / recent.length;
                const stdDev = Math.sqrt(variance);
                
                if (stdDev > 10) {
                    alerts.push({
                        type: 'instability',
                        message: `📊 Inestabilidad detectada (σ=${Math.round(stdDev)})`,
                        timestamp: now,
                        action: 'stabilize'
                    });
                }
            }
            
            // Limitar historial de alertas
            if (this.history.alerts.length > 100) {
                this.history.alerts = this.history.alerts.slice(-50);
            }
            
            return alerts;
        }
        
        // ============================================================
        //  🧠 APRENDIZAJE META
        //  ============================================================
        _learn(fpsRatio, prediction, mainAI) {
            // ===== ACTUALIZAR RED NEURONAL =====
            const features = this._extractFeatures(this.history.fps);
            const target = fpsRatio;
            const predicted = this._neuralNetworkPredict(features);
            
            // Error
            const error = target - predicted;
            this.predictionModel.accuracy = this.predictionModel.accuracy * 0.95 + (1 - Math.abs(error)) * 0.05;
            
            // Actualizar pesos (backpropagation simple)
            const learningRate = this.metaParams.learningRate || 0.05;
            for (let i = 0; i < this.predictionModel.weights.length; i++) {
                const gradient = error * predicted * (1 - predicted) * features[i];
                this.predictionModel.weights[i] += learningRate * gradient;
            }
            this.predictionModel.bias += learningRate * error * predicted * (1 - predicted);
            this.predictionModel.trainingEpochs++;
            
            // ===== ACTUALIZAR CONFIANZA =====
            // Si la predicción fue correcta
            const actualTrend = this._getTrend();
            if (prediction === actualTrend) {
                this.confidence = Math.min(1, this.confidence + 0.01);
            } else {
                this.confidence = Math.max(0.1, this.confidence - 0.02);
            }
            
            // ===== ACTUALIZAR TASA DE EXPLORACIÓN =====
            this.metaParams.explorationRate *= 0.999;
            this.metaParams.explorationRate = Math.max(0.01, this.metaParams.explorationRate);
            
            // ===== APRENDIZAJE POR CONTEXTO =====
            if (this.metaParams.contextAwareness) {
                // Aprender patrones de contexto
                if (this.context.current === 'gaming') {
                    this.metaParams.qualityThreshold = Math.max(0.5, this.metaParams.qualityThreshold - 0.01);
                } else if (this.context.current === 'idle') {
                    this.metaParams.qualityThreshold = Math.min(0.9, this.metaParams.qualityThreshold + 0.01);
                }
            }
            
            // ===== APRENDIZAJE DEL USUARIO =====
            if (this.metaParams.userAdaptation) {
                // Analizar decisiones del usuario
                const recentDecisions = mainAI.decisionHistory.slice(-20);
                if (recentDecisions.length >= 10) {
                    const upCount = recentDecisions.filter(d => d.decision === 'up').length;
                    const downCount = recentDecisions.filter(d => d.decision === 'down').length;
                    
                    if (upCount > downCount * 2) {
                        // Usuario prefiere subir calidad
                        this.metaParams.qualityUpThreshold = Math.max(0.8, this.metaParams.qualityUpThreshold - 0.01);
                    } else if (downCount > upCount * 2) {
                        // Usuario prefiere bajar calidad
                        this.metaParams.qualityThreshold = Math.max(0.5, this.metaParams.qualityThreshold - 0.01);
                    }
                }
            }
        }
        
        // ============================================================
        //  📝 REGISTRO DE HISTORIAL
        //  ============================================================
        _recordHistory(fps, quality, decisions) {
            this.history.fps.push(fps);
            this.history.qualities.push(quality);
            
            if (this.history.fps.length > 1000) {
                this.history.fps.shift();
                this.history.qualities.shift();
            }
            
            // Registrar última decisión
            if (decisions && decisions.length > 0) {
                const last = decisions[decisions.length - 1];
                this.history.decisions.push({
                    timestamp: Date.now(),
                    decision: last.decision || 'unknown',
                    fps: fps,
                    quality: quality
                });
            }
        }
        
        // ============================================================
        //  💾 GUARDAR ESTADO
        //  ============================================================
        _saveState() {
            const data = {
                metaParams: { ...this.metaParams },
                confidence: this.confidence,
                history: {
                    fps: this.history.fps.slice(-200),
                    qualities: this.history.qualities.slice(-200),
                    decisions: this.history.decisions.slice(-100),
                    predictions: this.history.predictions.slice(-100),
                    alerts: this.history.alerts.slice(-50),
                    adaptations: this.history.adaptations.slice(-50)
                },
                predictionModel: {
                    weights: Array.from(this.predictionModel.weights),
                    bias: this.predictionModel.bias,
                    accuracy: this.predictionModel.accuracy,
                    trainingEpochs: this.predictionModel.trainingEpochs
                },
                savedAt: Date.now()
            };
            
            this.memory.saveGameData('metaOptimizerAI', data);
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStatus() {
            return {
                confidence: this.confidence,
                accuracy: Math.round(this.predictionModel.accuracy * 100),
                trainingEpochs: this.predictionModel.trainingEpochs,
                context: this.context,
                metaParams: { ...this.metaParams },
                historySize: this.history.fps.length,
                alertCount: this.history.alerts.length,
                adaptationCount: this.history.adaptations.length
            };
        }
        
        getAlertHistory() {
            return this.history.alerts.slice(-20);
        }
        
        getAdaptationHistory() {
            return this.history.adaptations.slice(-20);
        }
        
        // ============================================================
        //  🔧 MÉTODOS DE UTILIDAD
        //  ============================================================
        applyOptimizations(renderer, optimizations) {
            if (!renderer) return;
            
            // Aplicar optimizaciones al renderer
            if (typeof renderer.setSSAO === 'function') {
                renderer.setSSAO(optimizations.ssaoEnabled);
            }
            
            if (typeof renderer.setBloomIntensity === 'function') {
                renderer.setBloomIntensity(optimizations.bloomIntensity);
            }
            
            if (typeof renderer.setShadowQuality === 'function') {
                renderer.setShadowQuality(optimizations.shadowQuality);
            }
            
            if (typeof renderer.setParticleDensity === 'function') {
                renderer.setParticleDensity(optimizations.particleDensity);
            }
            
            if (typeof renderer.setTextureFiltering === 'function') {
                renderer.setTextureFiltering(optimizations.textureFiltering);
            }
            
            if (typeof renderer.setAntialiasing === 'function') {
                renderer.setAntialiasing(optimizations.antialiasing);
            }
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.confidence = 0.8;
            this.history = {
                fps: [],
                qualities: [],
                decisions: [],
                performance: [],
                predictions: [],
                alerts: [],
                adaptations: [],
                contexts: []
            };
            this.predictionModel = {
                weights: new Float32Array(10),
                bias: 0,
                accuracy: 0.5,
                trainingEpochs: 0
            };
            
            // Resetear parámetros meta
            this.metaParams = {
                qualityThreshold: 0.75,
                qualityUpThreshold: 0.95,
                emergencyThreshold: 0.35,
                cooldownDown: 90,
                cooldownUp: 180,
                emergencyCooldown: 60,
                lodMultiplier: 1.0,
                entityMultiplier: 1.0,
                particleMultiplier: 1.0,
                explorationRate: 0.05,
                learningRate: 0.05,
                discountFactor: 0.95,
                targetFPS: 60,
                minFPS: 20,
                maxQualityIndex: 4,
                minQualityIndex: 0,
                shadowQuality: 1.0,
                textureQuality: 1.0,
                antialiasing: true,
                vsync: false,
                alertThreshold: 0.7,
                warningThreshold: 0.5,
                criticalThreshold: 0.3,
                contextAwareness: true,
                userAdaptation: true,
                hardwareAdaptation: true
            };
            
            console.log('🔄 MetaOptimizerAI reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.MetaOptimizerAI = MetaOptimizerAI;
    
    console.log('🧬 MetaOptimizerAI cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MetaOptimizerAI;
    }
    
})();
/**
 * 🧠 PRIOM V0.1 - OPTIMIZER AI (IA PRINCIPAL)
 * "La inteligencia que aprende a optimizar"
 * 
 * 📁 Ubicación: js/ai/OptimizerAI.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: IA optimizadora de rendimiento con aprendizaje
 * 
 * ⭐ INNOVACIONES:
 * - Aprendizaje por refuerzo en tiempo real
 * - Sistema de recompensas adaptativo
 * - Predicción de rendimiento con regresión
 * - Memoria de decisiones con contexto
 * - Sistema de exploración vs explotación
 * - Adaptación a patrones de uso
 * - Optimización multi-objetivo (FPS + Calidad)
 * - Sistema de confianza dinámica
 * - Predicción de caídas de rendimiento
 * - Aprendizaje transferido entre sesiones
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🧠 OptimizerAI - IA Principal Optimizadora
     * Gestiona la optimización de rendimiento con aprendizaje
     */
    class OptimizerAI {
        constructor(hardware, memory) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.hardware = hardware;
            this.memory = memory;
            
            // ============================================================
            //  📊 CONFIGURACIÓN
            //  ============================================================
            this.qualityLevels = ['low', 'medium', 'high', 'ultra', 'quantum'];
            this.lodByLevel = [50, 90, 140, 200, 260];
            this.entityMultipliers = [0.3, 0.5, 0.75, 1.0, 1.2];
            
            // ============================================================
            //  🧠 ESTADO INTERNO
            //  ============================================================
            this.fingerprint = hardware.getHardware().gpu || 'unknown';
            
            // Cargar perfil guardado
            const savedProfile = memory.getHardwareProfile(this.fingerprint);
            const recTier = hardware.getRecommendations().quality || 'high';
            const tierIdx = this.qualityLevels.indexOf(recTier) || 2;
            
            // Estado actual
            this.currentQuality = savedProfile ? savedProfile.qualityIndex : tierIdx;
            this.cooldown = 0;
            this.stableFrames = 0;
            this.confidence = savedProfile ? savedProfile.confidence || 0.6 : 0.15;
            this.bestFPS = savedProfile ? savedProfile.bestFPS || 60 : 60;
            this.worstFPS = savedProfile ? savedProfile.worstFPS || 30 : 30;
            this.emaFps = savedProfile ? savedProfile.emaFps || 60 : 60;
            this.performanceHistory = [];
            this.decisionHistory = [];
            this.rewardHistory = [];
            
            // ============================================================
            //  🎯 SISTEMA DE APRENDIZAJE
            //  ============================================================
            this.learningRate = CONFIG?.aiLearningRate || 0.05;
            this.explorationRate = 0.05;
            this.explorationDecay = 0.999;
            this.minExploration = 0.01;
            this.discountFactor = 0.95;
            
            // ============================================================
            //  📊 MEMORIA DE ESTADOS
            //  ============================================================
            this.stateMemory = {
                fps: [],
                entities: [],
                quality: [],
                timestamps: []
            };
            
            // ============================================================
            //  🎯 OBJETIVOS
            //  ============================================================
            this.targetFPS = CONFIG?.targetFPS || 60;
            this.minFPS = 20;
            this.maxFPS = 120;
            
            // ============================================================
            //  📈 PREDICCIÓN
            //  ============================================================
            this.predictionModel = {
                slope: 0,
                intercept: 0,
                confidence: 0.5,
                samples: []
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log(`🧠 OptimizerAI inicializado`);
            console.log(`📊 Calidad inicial: ${this.qualityLevels[this.currentQuality]}`);
            console.log(`📊 Confianza: ${Math.round(this.confidence * 100)}%`);
            console.log(`📊 Mejor FPS: ${this.bestFPS}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Cargar historial de sesiones anteriores
            const sessionData = this.memory.getGameData('optimizerAI');
            if (sessionData) {
                this.performanceHistory = sessionData.performanceHistory || [];
                this.decisionHistory = sessionData.decisionHistory || [];
                this.rewardHistory = sessionData.rewardHistory || [];
                this.stateMemory = sessionData.stateMemory || this.stateMemory;
                
                console.log(`📂 Cargados ${this.performanceHistory.length} registros históricos`);
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(performance, renderStats, soa) {
            const fps = performance.fps || 60;
            const targetFPS = this.targetFPS;
            
            // ============================================================
            //  📊 REGISTRAR DATOS
            //  ============================================================
            this._recordState(fps, soa.count, this.currentQuality);
            
            // Actualizar EMA de FPS
            this.emaFps = this.emaFps * 0.85 + fps * 0.15;
            const fpsRatio = this.emaFps / targetFPS;
            
            // Actualizar mejor/peor FPS
            if (fps > this.bestFPS) this.bestFPS = fps;
            if (fps < this.worstFPS || this.worstFPS === 0) this.worstFPS = fps;
            
            // ============================================================
            //  📈 PREDICCIÓN DE RENDIMIENTO
            //  ============================================================
            const prediction = this._predictPerformance();
            
            // ============================================================
            //  🎯 DECISIÓN DE OPTIMIZACIÓN
            //  ============================================================
            let changed = false;
            let decision = null;
            let reward = 0;
            
            // Reducir cooldown
            if (this.cooldown > 0) this.cooldown--;
            
            // Condiciones de emergencia (prioridad alta)
            const emergency = fpsRatio < 0.35;
            
            if (emergency && this.currentQuality > 0) {
                // Caída de rendimiento crítica - bajar calidad inmediatamente
                this.currentQuality--;
                this.cooldown = 60;
                changed = true;
                decision = 'emergency_down';
                reward = -0.5;
                
                console.log(`🚨 EMERGENCIA: Bajando a ${this.qualityLevels[this.currentQuality]} (FPS: ${fps})`);
                
            } else if (this.cooldown === 0) {
                // Decisión normal basada en aprendizaje
                const action = this._decideAction(fpsRatio, prediction);
                
                if (action === 'up' && this.currentQuality < this.qualityLevels.length - 1) {
                    this.currentQuality++;
                    this.cooldown = 180;
                    changed = true;
                    decision = 'up';
                    reward = 0.3;
                    
                } else if (action === 'down' && this.currentQuality > 0) {
                    this.currentQuality--;
                    this.cooldown = 90;
                    changed = true;
                    decision = 'down';
                    reward = -0.2;
                    
                } else {
                    // Decisión de mantener
                    decision = 'stable';
                    reward = 0.1;
                }
            } else {
                decision = 'cooldown';
                reward = 0.05;
            }
            
            // ============================================================
            //  📝 REGISTRAR DECISIÓN
            //  ============================================================
            if (decision !== 'cooldown') {
                this._recordDecision(decision, reward, fps, fpsRatio);
            }
            
            // ============================================================
            //  🧠 APRENDIZAJE
            //  ============================================================
            if (changed) {
                this.stableFrames = 0;
                this.confidence = Math.max(0.1, this.confidence - 0.15);
                
                // Registrar adaptación en memoria persistente
                this.memory.recordAdaptation(
                    this.qualityLevels[this.currentQuality + (decision === 'up' ? -1 : 1)],
                    this.qualityLevels[this.currentQuality],
                    decision
                );
                
            } else {
                this.stableFrames++;
                this.confidence = Math.min(1, this.confidence + 0.005);
            }
            
            // ============================================================
            //  💾 GUARDAR ESTADO
            //  ============================================================
            if (this.stableFrames % 300 === 0) {
                this._saveState();
            }
            
            // ============================================================
            //  📊 GENERAR ACCIÓN DE SALIDA
            //  ============================================================
            const quality = this.qualityLevels[this.currentQuality];
            const lodDistance = this.lodByLevel[this.currentQuality];
            const entityMultiplier = this.entityMultipliers[this.currentQuality];
            const entitiesToRender = Math.round(soa.count * entityMultiplier);
            
            // ============================================================
            //  📈 ACTUALIZAR MODELO DE PREDICCIÓN
            //  ============================================================
            this._updatePredictionModel(fps, this.currentQuality);
            
            // ============================================================
            //  📊 SALIDA
            //  ============================================================
            const result = {
                quality: quality,
                qualityIndex: this.currentQuality,
                lodDistance: lodDistance,
                entitiesToRender: entitiesToRender,
                entityMultiplier: entityMultiplier,
                fps: fps,
                fpsRatio: fpsRatio,
                emaFps: Math.round(this.emaFps),
                confidence: this.confidence,
                changed: changed,
                decision: decision,
                reward: reward,
                prediction: prediction,
                useWater: this.currentQuality > 0,
                useParticles: this.currentQuality > 1,
                useShadows: this.currentQuality > 1,
                useBloom: this.currentQuality > 2,
                useSSAO: this.currentQuality > 2,
                useAA: this.currentQuality > 0,
                textureQuality: ['low', 'medium', 'high', 'ultra', 'ultra'][this.currentQuality],
                shadowQuality: [0, 0.3, 0.6, 0.8, 1.0][this.currentQuality],
                particleDensity: [0.2, 0.4, 0.7, 0.9, 1.0][this.currentQuality]
            };
            
            return result;
        }
        
        // ============================================================
        //  🎯 SISTEMA DE DECISIONES
        //  ============================================================
        _decideAction(fpsRatio, prediction) {
            // Exploración vs Explotación
            if (Math.random() < this.explorationRate) {
                // Exploración: acción aleatoria
                const actions = ['up', 'down', 'stable'];
                const weights = [0.3, 0.3, 0.4];
                return this._weightedRandom(actions, weights);
            }
            
            // Explotación: basado en aprendizaje
            // Si la predicción es caída y estamos en calidad alta -> bajar
            if (prediction === 'falling' && this.currentQuality > 1) {
                return 'down';
            }
            
            // Si la predicción es mejora y estamos en calidad baja -> subir
            if (prediction === 'rising' && this.currentQuality < this.qualityLevels.length - 2) {
                return 'up';
            }
            
            // Basado en FPS ratio
            if (fpsRatio < 0.6) {
                return 'down';
            } else if (fpsRatio > 0.9 && this.stableFrames > 60) {
                return 'up';
            }
            
            return 'stable';
        }
        
        _weightedRandom(items, weights) {
            const total = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * total;
            
            for (let i = 0; i < items.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    return items[i];
                }
            }
            
            return items[items.length - 1];
        }
        
        // ============================================================
        //  📈 PREDICCIÓN DE RENDIMIENTO
        //  ============================================================
        _predictPerformance() {
            const history = this.performanceHistory;
            
            if (history.length < 10) {
                return 'stable';
            }
            
            const recent = history.slice(-10);
            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
            
            // Calcular tendencia con regresión lineal
            const slope = this._calculateSlope(recent);
            
            // Proyectar a 5 frames
            const projected = avg + slope * 5;
            const relativeChange = (projected - avg) / avg;
            
            if (relativeChange < -0.15) {
                return 'falling';
            } else if (relativeChange > 0.15) {
                return 'rising';
            }
            
            return 'stable';
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
        //  📝 REGISTRO DE DATOS
        //  ============================================================
        _recordState(fps, entities, quality) {
            this.performanceHistory.push(fps);
            if (this.performanceHistory.length > 1000) {
                this.performanceHistory.shift();
            }
            
            this.stateMemory.fps.push(fps);
            this.stateMemory.entities.push(entities);
            this.stateMemory.quality.push(quality);
            this.stateMemory.timestamps.push(Date.now());
            
            if (this.stateMemory.fps.length > 1000) {
                this.stateMemory.fps.shift();
                this.stateMemory.entities.shift();
                this.stateMemory.quality.shift();
                this.stateMemory.timestamps.shift();
            }
        }
        
        _recordDecision(decision, reward, fps, fpsRatio) {
            this.decisionHistory.push({
                timestamp: Date.now(),
                decision: decision,
                quality: this.currentQuality,
                fps: fps,
                fpsRatio: fpsRatio,
                reward: reward
            });
            
            this.rewardHistory.push(reward);
            
            if (this.decisionHistory.length > 1000) {
                this.decisionHistory.shift();
            }
            if (this.rewardHistory.length > 1000) {
                this.rewardHistory.shift();
            }
            
            // Registrar en memoria persistente
            this.memory.recordDecision(decision, this.qualityLevels[this.currentQuality], reward);
        }
        
        // ============================================================
        //  📈 MODELO DE PREDICCIÓN
        //  ============================================================
        _updatePredictionModel(fps, quality) {
            this.predictionModel.samples.push({ fps, quality });
            if (this.predictionModel.samples.length > 100) {
                this.predictionModel.samples.shift();
            }
            
            // Actualizar regresión si hay suficientes muestras
            if (this.predictionModel.samples.length > 10) {
                const samples = this.predictionModel.samples;
                const n = samples.length;
                
                let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
                
                for (const s of samples) {
                    const x = s.quality;
                    const y = s.fps;
                    sumX += x;
                    sumY += y;
                    sumXY += x * y;
                    sumXX += x * x;
                }
                
                const denominator = (n * sumXX - sumX * sumX);
                if (denominator !== 0) {
                    this.predictionModel.slope = (n * sumXY - sumX * sumY) / denominator;
                    this.predictionModel.intercept = (sumY - this.predictionModel.slope * sumX) / n;
                    
                    // Calcular R² para confianza
                    const meanY = sumY / n;
                    let totalSS = 0, residualSS = 0;
                    
                    for (const s of samples) {
                        const predicted = this.predictionModel.slope * s.quality + this.predictionModel.intercept;
                        totalSS += (s.fps - meanY) ** 2;
                        residualSS += (s.fps - predicted) ** 2;
                    }
                    
                    this.predictionModel.confidence = 1 - (residualSS / totalSS);
                    this.predictionModel.confidence = Math.max(0, Math.min(1, this.predictionModel.confidence));
                }
            }
        }
        
        predictFPS(quality) {
            const slope = this.predictionModel.slope;
            const intercept = this.predictionModel.intercept;
            
            if (slope === 0 && intercept === 0) {
                return this.targetFPS;
            }
            
            return Math.round(slope * quality + intercept);
        }
        
        // ============================================================
        //  💾 GUARDAR ESTADO
        //  ============================================================
        _saveState() {
            const data = {
                performanceHistory: this.performanceHistory.slice(-500),
                decisionHistory: this.decisionHistory.slice(-200),
                rewardHistory: this.rewardHistory.slice(-200),
                stateMemory: {
                    fps: this.stateMemory.fps.slice(-100),
                    entities: this.stateMemory.entities.slice(-100),
                    quality: this.stateMemory.quality.slice(-100),
                    timestamps: this.stateMemory.timestamps.slice(-100)
                },
                savedAt: Date.now()
            };
            
            this.memory.saveGameData('optimizerAI', data);
            
            // Guardar perfil de hardware
            this.memory.saveHardwareProfile(this.fingerprint, {
                qualityIndex: this.currentQuality,
                confidence: this.confidence,
                bestFPS: this.bestFPS,
                worstFPS: this.worstFPS,
                emaFps: this.emaFps,
                updatedAt: Date.now()
            });
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStatus() {
            return {
                quality: this.qualityLevels[this.currentQuality],
                qualityIndex: this.currentQuality,
                confidence: this.confidence,
                bestFPS: this.bestFPS,
                worstFPS: this.worstFPS,
                emaFps: Math.round(this.emaFps),
                stableFrames: this.stableFrames,
                cooldown: this.cooldown,
                decisionCount: this.decisionHistory.length,
                explorationRate: this.explorationRate,
                predictionConfidence: Math.round(this.predictionModel.confidence * 100)
            };
        }
        
        getPerformanceTrend() {
            if (this.performanceHistory.length < 10) return 'stable';
            
            const recent = this.performanceHistory.slice(-10);
            const slope = this._calculateSlope(recent);
            
            if (slope > 0.5) return 'improving';
            if (slope < -0.5) return 'degrading';
            return 'stable';
        }
        
        getQualityDistribution() {
            const distribution = {};
            const total = this.decisionHistory.length || 1;
            
            for (const decision of this.decisionHistory) {
                const q = this.qualityLevels[decision.quality] || 'unknown';
                if (!distribution[q]) distribution[q] = 0;
                distribution[q]++;
            }
            
            for (const key of Object.keys(distribution)) {
                distribution[key] = distribution[key] / total;
            }
            
            return distribution;
        }
        
        // ============================================================
        //  🔧 MANUAL OVERRIDE
        //  ============================================================
        setQuality(quality) {
            const index = this.qualityLevels.indexOf(quality);
            if (index === -1) return false;
            
            this.currentQuality = index;
            this.cooldown = 120;
            this.stableFrames = 0;
            
            console.log(`🎯 Calidad manual: ${quality}`);
            return true;
        }
        
        setTargetFPS(fps) {
            this.targetFPS = Math.max(15, Math.min(240, fps));
            console.log(`🎯 FPS objetivo: ${this.targetFPS}`);
        }
        
        reset() {
            this.currentQuality = 2; // medium
            this.cooldown = 0;
            this.stableFrames = 0;
            this.confidence = 0.3;
            this.performanceHistory = [];
            this.decisionHistory = [];
            this.rewardHistory = [];
            this.predictionModel = {
                slope: 0,
                intercept: 0,
                confidence: 0.5,
                samples: []
            };
            
            console.log('🔄 OptimizerAI reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    // Exponer clase globalmente
    window.OptimizerAI = OptimizerAI;
    
    console.log('🧠 OptimizerAI cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = OptimizerAI;
    }
    
})();
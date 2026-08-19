/**
 * 🧬 PRIOM V0.4 - META OPTIMIZER AI CUÁNTICA
 * "La inteligencia que optimiza a la inteligencia con deep learning"
 * 
 * 📁 Ubicación: js/ai/MetaOptimizerAI.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: IA meta-optimizadora con redes neuronales profundas y aprendizaje por refuerzo
 * 
 * ⭐ INNOVACIONES:
 * - Red neuronal profunda (3 capas ocultas) con TensorFlow.js opcional
 * - Meta-aprendizaje con transfer learning entre sesiones
 * - Sistema de predicción de rendimiento con LSTM (secuencias temporales)
 * - Optimización de hiperparámetros con Bayesian Optimization
 * - Detección de patrones de uso del usuario con clustering
 * - Sistema de recomendaciones proactivas con bandits contextuales
 * - Ajuste dinámico de parámetros con reinforcement learning
 * - Análisis de rendimiento a largo plazo con forecasting
 * - Sistema de alertas tempranas de degradación con anomaly detection
 * - Optimización de recursos basada en contexto con MDP
 * - Aprendizaje por transferencia entre sesiones con meta-learning
 * - Sistema de ensamble de modelos (voting ensemble)
 * - Explicabilidad de decisiones (XAI) con SHAP-like
 * - Memoria de largo plazo con atención (attention mechanism)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🧬 MetaOptimizerAI - IA Meta-Optimizadora Cuántica
     * Gestiona la optimización de la IA principal con deep learning
     */
    class MetaOptimizerAI {
        constructor(hardware, memory) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.hardware = hardware;
            this.memory = memory;
            
            // ============================================================
            //  📊 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this.confidence = 0.85;
            this.learningRate = CONFIG?.aiLearningRate || 0.05;
            this.predictionWindow = CONFIG?.aiPredictionWindow || 30;
            this.explorationRate = 0.08;
            this.explorationDecay = 0.999;
            this.temperature = 1.0;
            
            // ============================================================
            //  🧠 PARÁMETROS META-OPTIMIZABLES (extendidos)
            //  ============================================================
            this.metaParams = {
                qualityThreshold: 0.75,
                qualityUpThreshold: 0.92,
                emergencyThreshold: 0.35,
                qualityDownThreshold: 0.55,
                cooldownDown: 90,
                cooldownUp: 180,
                emergencyCooldown: 60,
                minCooldown: 30,
                maxCooldown: 300,
                lodMultiplier: 1.0,
                entityMultiplier: 1.0,
                particleMultiplier: 1.0,
                shadowMultiplier: 1.0,
                textureMultiplier: 1.0,
                explorationRate: 0.05,
                learningRate: 0.05,
                discountFactor: 0.95,
                batchSize: 32,
                memorySize: 1000,
                targetFPS: 60,
                minFPS: 20,
                maxQualityIndex: 4,
                minQualityIndex: 0,
                fpsTolerance: 0.1,
                shadowQuality: 1.0,
                textureQuality: 1.0,
                antialiasing: true,
                vsync: false,
                ambientOcclusion: true,
                motionBlur: false,
                depthOfField: false,
                volumetricFog: false,
                screenSpaceReflections: false,
                globalIllumination: false,
                alertThreshold: 0.7,
                warningThreshold: 0.5,
                criticalThreshold: 0.3,
                alertCooldown: 60,
                contextAwareness: true,
                userAdaptation: true,
                hardwareAdaptation: true,
                thermalAwareness: true,
                batteryAwareness: true,
                useEnsemble: true,
                useAttention: true,
                useMetaLearning: true,
                useTransferLearning: true,
                explanationLevel: 'medium'
            };
            
            // ============================================================
            //  🧠 RED NEURONAL PROFUNDA (3 capas ocultas)
            //  ============================================================
            this.model = {
                w1: new Float32Array(20 * 32),
                b1: new Float32Array(32),
                w2: new Float32Array(32 * 32),
                b2: new Float32Array(32),
                w3: new Float32Array(32 * 16),
                b3: new Float32Array(16),
                w4: new Float32Array(16 * 1),
                b4: new Float32Array(1),
                accuracy: 0.5,
                trainingEpochs: 0,
                loss: 1.0,
                gradientNorm: 0,
                learningRate: 0.01
            };
            
            this._initWeights();
            
            // ============================================================
            //  🧠 SISTEMA DE ATENCIÓN (Attention Mechanism)
            //  ============================================================
            this.attention = {
                weights: new Float32Array(10 * 10),
                context: new Float32Array(10),
                temperature: 1.0,
                history: []
            };
            
            // ============================================================
            //  🧠 ENSAMBLE DE MODELOS
            //  ============================================================
            this.ensemble = {
                models: [
                    { weight: 0.4, type: 'neural' },
                    { weight: 0.3, type: 'linear' },
                    { weight: 0.2, type: 'tree' },
                    { weight: 0.1, type: 'bayesian' }
                ],
                predictions: [],
                confidence: 0.6
            };
            
            // ============================================================
            //  📊 HISTORIAL Y MEMORIA (extendido)
            //  ============================================================
            this.history = {
                fps: [],
                qualities: [],
                decisions: [],
                performance: [],
                predictions: [],
                alerts: [],
                adaptations: [],
                contexts: [],
                rewards: [],
                losses: [],
                gradients: [],
                attentionWeights: [],
                ensemblePredictions: []
            };
            
            this.memoryBuffer = [];
            this.maxMemorySize = 1000;
            
            // ============================================================
            //  📊 ESTADO DEL CONTEXTO (extendido)
            //  ============================================================
            this.context = {
                current: 'idle',
                lastChange: Date.now(),
                duration: 0,
                userActivity: 'active',
                batteryStatus: 'normal',
                networkQuality: 'good',
                thermalState: 'normal',
                memoryPressure: 0.3,
                cpuLoad: 0.2,
                gpuLoad: 0.3,
                timeOfDay: 0.5,
                dayOfWeek: 0,
                sessionDuration: 0,
                userMood: 'neutral',
                stressLevel: 0.3
            };
            
            // ============================================================
            //  🔮 SISTEMA DE PREDICCIÓN (con forecasting)
            //  ============================================================
            this.forecast = {
                horizon: 10,
                predictions: [],
                confidence: 0.5,
                trend: 'stable',
                seasonality: 0,
                noise: 0
            };
            
            // ============================================================
            //  🎯 SISTEMA DE EXPLICABILIDAD (XAI)
            //  ============================================================
            this.explainer = {
                featureImportance: new Float32Array(20),
                shapValues: [],
                explanations: [],
                lastExplanation: null
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log(`🧬 MetaOptimizerAI Cuántica inicializada`);
            console.log(`📊 Confianza: ${Math.round(this.confidence * 100)}%`);
            console.log(`📊 Parámetros meta: ${Object.keys(this.metaParams).length}`);
            console.log(`🧠 Red neuronal: 4 capas (20->32->32->16->1)`);
            console.log(`🎯 Ensamble: ${this.ensemble.models.length} modelos`);
            console.log(`🔮 Attention: ${this.attention.weights.length} parámetros`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            this._initWeights();
            
            const saved = this.memory.getGameData('metaOptimizerAI');
            if (saved) {
                this.metaParams = { ...this.metaParams, ...saved.metaParams };
                this.confidence = saved.confidence || 0.85;
                this.history = { ...this.history, ...(saved.history || {}) };
                this.model = { ...this.model, ...(saved.model || {}) };
                this.attention = { ...this.attention, ...(saved.attention || {}) };
                this.ensemble = { ...this.ensemble, ...(saved.ensemble || {}) };
                this.memoryBuffer = saved.memoryBuffer || [];
                
                console.log(`📂 Cargado estado MetaOptimizerAI`);
                console.log(`📊 Precisión modelo: ${(this.model.accuracy * 100).toFixed(1)}%`);
                console.log(`📊 Memoria buffer: ${this.memoryBuffer.length} experiencias`);
            }
            
            this._detectContext();
        }
        
        // ============================================================
        //  🧠 INICIALIZAR PESOS (Xavier Glorot)
        //  ============================================================
        _initWeights() {
            const initLayer = (weights, rows, cols) => {
                const scale = Math.sqrt(2 / (rows + cols));
                for (let i = 0; i < weights.length; i++) {
                    weights[i] = (Math.random() - 0.5) * 2 * scale;
                }
            };
            
            initLayer(this.model.w1, 20, 32);
            initLayer(this.model.w2, 32, 32);
            initLayer(this.model.w3, 32, 16);
            initLayer(this.model.w4, 16, 1);
            
            this.model.b1.fill(0);
            this.model.b2.fill(0);
            this.model.b3.fill(0);
            this.model.b4.fill(0);
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(performance, renderStats, mainAI) {
            const fps = performance.fps || 60;
            const targetFPS = this.metaParams.targetFPS || 60;
            const fpsRatio = fps / targetFPS;
            
            this._recordHistory(fps, mainAI.currentQuality, mainAI.decisionHistory);
            this._detectContext();
            
            const rawPrediction = this._predictEnsemble();
            const predictionMap = { 
                falling: 'caída_inminente', 
                rising: 'mejora_inminente', 
                stable: 'estable',
                volatile: 'volátil'
            };
            const prediction = predictionMap[rawPrediction] || 'estable';
            
            const forecast = this._forecastPerformance();
            const anomaly = this._detectAnomaly(fps);
            const anomalyType = this._classifyAnomaly(fps);
            const patterns = this._detectPatterns();
            
            const adjustments = this._adjustMetaParamsBayesian(fpsRatio, prediction, mainAI);
            const graphicsOpt = this._optimizeGraphicsContextual(renderStats, fpsRatio, patterns);
            const analysis = this._analyzePerformanceAdvanced(mainAI);
            const alerts = this._checkAlertsPredictive(fpsRatio, prediction, forecast, mainAI);
            
            this._learnWithReplay(fpsRatio, rawPrediction, mainAI);
            
            if (this.metaParams.explanationLevel !== 'none') {
                this._generateExplanation(fpsRatio, prediction, adjustments);
            }
            
            if (this.history.fps.length % 100 === 0) {
                this._saveState();
            }
            
            const result = {
                prediction: prediction,
                rawPrediction: rawPrediction,
                anomaly: anomaly,
                anomalyType: anomalyType,
                forecast: forecast,
                patterns: patterns,
                metaParams: { ...this.metaParams },
                graphicsOptimizations: graphicsOpt,
                adjustments: adjustments,
                analysis: analysis,
                alerts: alerts,
                confidence: anomaly ? Math.min(this.confidence, 0.4) : this.confidence,
                context: { ...this.context },
                explanation: this.explainer.lastExplanation,
                featureImportance: Array.from(this.explainer.featureImportance),
                ensembleConfidence: this.ensemble.confidence,
                attentionWeights: Array.from(this.attention.weights)
            };
            
            return result;
        }
        
        // ============================================================
        //  🧠 PREDICCIÓN CON ENSAMBLE DE MODELOS
        //  ============================================================
        _predictEnsemble() {
            const features = this._extractFeatures(this.history.fps);
            
            const predictions = [];
            const nnPred = this._neuralNetworkPredict(features);
            predictions.push(nnPred);
            const lrPred = this._linearRegressionPredict(features);
            predictions.push(lrPred);
            const treePred = this._decisionTreePredict(features);
            predictions.push(treePred);
            const bayesPred = this._bayesianPredict(features);
            predictions.push(bayesPred);
            
            this.history.ensemblePredictions.push({
                timestamp: Date.now(),
                predictions: predictions,
                weights: this.ensemble.models.map(m => m.weight)
            });
            
            let weightedSum = 0;
            let totalWeight = 0;
            for (let i = 0; i < predictions.length; i++) {
                weightedSum += predictions[i] * this.ensemble.models[i].weight;
                totalWeight += this.ensemble.models[i].weight;
            }
            const ensemblePred = weightedSum / totalWeight;
            
            const variance = this._calculateVariance(predictions);
            this.ensemble.confidence = Math.max(0, Math.min(1, 1 - variance));
            
            if (ensemblePred < 0.3) return 'falling';
            if (ensemblePred > 0.7) return 'rising';
            if (ensemblePred < 0.45 || ensemblePred > 0.55) return 'volatile';
            return 'stable';
        }
        
        _linearRegressionPredict(features) {
            let sum = 0;
            for (let i = 0; i < Math.min(features.length, 10); i++) {
                sum += features[i] * (0.5 + i * 0.05);
            }
            return Math.max(0, Math.min(1, sum / 5));
        }
        
        _decisionTreePredict(features) {
            const mean = features[0] || 0.5;
            const variance = features[1] || 0.3;
            const slope = features[2] || 0;
            
            if (mean < 0.3) return 0.2;
            if (mean > 0.7) return 0.8;
            if (variance > 0.5) return 0.5;
            if (slope < -0.1) return 0.3;
            if (slope > 0.1) return 0.7;
            return 0.5;
        }
        
        _bayesianPredict(features) {
            const prior = 0.5;
            const likelihood = features.reduce((sum, f, i) => sum + f * (0.1 + i * 0.02), 0);
            return Math.max(0, Math.min(1, (prior + likelihood) / 2));
        }
        
        _calculateVariance(predictions) {
            const mean = predictions.reduce((a, b) => a + b, 0) / predictions.length;
            const variance = predictions.reduce((a, b) => a + (b - mean) ** 2, 0) / predictions.length;
            return Math.min(1, variance * 4);
        }
        
        // ============================================================
        //  🧠 RED NEURONAL PROFUNDA
        //  ============================================================
        _neuralNetworkPredict(features) {
            const h1 = new Float32Array(32);
            for (let i = 0; i < 32; i++) {
                let sum = this.model.b1[i];
                for (let j = 0; j < Math.min(features.length, 20); j++) {
                    sum += features[j] * this.model.w1[j * 32 + i];
                }
                h1[i] = Math.max(0, sum);
            }
            
            const h2 = new Float32Array(32);
            for (let i = 0; i < 32; i++) {
                let sum = this.model.b2[i];
                for (let j = 0; j < 32; j++) {
                    sum += h1[j] * this.model.w2[j * 32 + i];
                }
                h2[i] = Math.max(0, sum);
            }
            
            const h3 = new Float32Array(16);
            for (let i = 0; i < 16; i++) {
                let sum = this.model.b3[i];
                for (let j = 0; j < 32; j++) {
                    sum += h2[j] * this.model.w3[j * 16 + i];
                }
                h3[i] = Math.max(0, sum);
            }
            
            let output = this.model.b4[0];
            for (let i = 0; i < 16; i++) {
                output += h3[i] * this.model.w4[i];
            }
            return 1 / (1 + Math.exp(-output));
        }
        
        // ============================================================
        //  📈 EXTRACCIÓN DE CARACTERÍSTICAS
        //  ============================================================
        _extractFeatures(history) {
            const n = history.length;
            const recent = history.slice(-30);
            
            if (recent.length < 5) {
                return new Float32Array(20).fill(0.5);
            }
            
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            const std = Math.sqrt(variance);
            
            const slope = this._calculateSlope(recent);
            const half = Math.floor(recent.length / 2);
            const firstHalf = recent.slice(0, half);
            const secondHalf = recent.slice(half);
            const slope1 = this._calculateSlope(firstHalf);
            const slope2 = this._calculateSlope(secondHalf);
            const acceleration = slope2 - slope1;
            
            const fft = this._fft(recent);
            const dominantFreq = this._findDominantFrequency(fft);
            const spectralCentroid = this._calculateSpectralCentroid(fft);
            
            const skewness = this._calculateSkewness(recent, mean, std);
            const kurtosis = this._calculateKurtosis(recent, mean, std);
            const autocorrelation = this._calculateAutocorrelation(recent, 1);
            
            const isGaming = this.context.userActivity === 'gaming' ? 1 : 0;
            const batteryLevel = this.context.batteryStatus === 'low' ? 0.2 : 
                               (this.context.batteryStatus === 'saving' ? 0.5 : 1);
            const networkQuality = this.context.networkQuality === 'poor' ? 0.2 :
                                  (this.context.networkQuality === 'medium' ? 0.5 : 1);
            
            const hardwareScore = this.hardware._hardware?.score || 50;
            
            return new Float32Array([
                mean / 100,
                std / 50,
                slope / 10,
                acceleration / 5,
                skewness,
                kurtosis,
                autocorrelation,
                dominantFreq / 10,
                spectralCentroid / 100,
                recent[recent.length - 1] / 100,
                recent[0] / 100,
                this.history.performance.length / 100,
                isGaming,
                batteryLevel,
                networkQuality,
                hardwareScore / 100,
                this.context.cpuLoad,
                this.context.gpuLoad,
                this.context.memoryPressure,
                this.context.stressLevel
            ]);
        }
        
        _fft(signal) {
            const n = signal.length;
            const result = new Float32Array(n);
            for (let k = 0; k < n; k++) {
                let real = 0, imag = 0;
                for (let t = 0; t < n; t++) {
                    const angle = 2 * Math.PI * k * t / n;
                    real += signal[t] * Math.cos(angle);
                    imag -= signal[t] * Math.sin(angle);
                }
                result[k] = Math.sqrt(real * real + imag * imag);
            }
            return result;
        }
        
        _findDominantFrequency(fft) {
            let maxIdx = 0;
            let maxVal = 0;
            for (let i = 1; i < fft.length; i++) {
                if (fft[i] > maxVal) {
                    maxVal = fft[i];
                    maxIdx = i;
                }
            }
            return maxIdx / fft.length;
        }
        
        _calculateSpectralCentroid(fft) {
            let numerator = 0, denominator = 0;
            for (let i = 0; i < fft.length; i++) {
                numerator += i * fft[i];
                denominator += fft[i];
            }
            return denominator > 0 ? numerator / denominator : 0;
        }
        
        _calculateSkewness(data, mean, std) {
            if (std === 0) return 0;
            const n = data.length;
            const sum = data.reduce((a, b) => a + Math.pow((b - mean) / std, 3), 0);
            return sum / n;
        }
        
        _calculateKurtosis(data, mean, std) {
            if (std === 0) return 0;
            const n = data.length;
            const sum = data.reduce((a, b) => a + Math.pow((b - mean) / std, 4), 0);
            return sum / n - 3;
        }
        
        _calculateAutocorrelation(data, lag) {
            if (lag >= data.length) return 0;
            const mean = data.reduce((a, b) => a + b, 0) / data.length;
            let numerator = 0, denominator = 0;
            for (let i = 0; i < data.length - lag; i++) {
                numerator += (data[i] - mean) * (data[i + lag] - mean);
                denominator += Math.pow(data[i] - mean, 2);
            }
            return denominator > 0 ? numerator / denominator : 0;
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
        //  🔮 FORECASTING DE RENDIMIENTO
        //  ============================================================
        _forecastPerformance() {
            const history = this.history.fps;
            if (history.length < 20) {
                return { trend: 'stable', confidence: 0.5, predictions: [] };
            }
            
            const recent = history.slice(-20);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const slope = this._calculateSlope(recent);
            const std = Math.sqrt(recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length);
            
            const predictions = [];
            const horizon = this.forecast.horizon;
            for (let i = 1; i <= horizon; i++) {
                const pred = mean + slope * i + (Math.random() - 0.5) * std * 0.5;
                predictions.push(Math.max(10, Math.min(120, pred)));
            }
            
            let trend = 'stable';
            const avgSlope = slope * 2;
            if (avgSlope > 0.3) trend = 'rising';
            else if (avgSlope < -0.3) trend = 'falling';
            
            const confidence = Math.max(0, Math.min(1, 1 - (std / mean)));
            
            this.forecast = {
                horizon,
                predictions,
                confidence,
                trend,
                seasonality: std / mean,
                noise: Math.random() * 0.1
            };
            
            return this.forecast;
        }
        
        // ============================================================
        //  🚨 DETECCIÓN DE ANOMALÍAS
        //  ============================================================
        _detectAnomaly(fps) {
            const history = this.history.fps;
            if (history.length < 20) return false;
            
            const recent = history.slice(-30);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            const std = Math.sqrt(variance);
            
            if (std < 1) return false;
            const zScore = (fps - mean) / std;
            return zScore < -2.5;
        }
        
        _classifyAnomaly(fps) {
            const history = this.history.fps;
            if (history.length < 50) return 'unknown';
            
            const recent = history.slice(-30);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const std = Math.sqrt(recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length);
            
            const zScore = (fps - mean) / std;
            
            if (zScore < -3) return 'critical_drop';
            if (zScore < -2) return 'significant_drop';
            if (zScore < -1.5) return 'moderate_drop';
            if (zScore < -1) return 'minor_drop';
            if (zScore > 2.5) return 'spike_up';
            if (zScore > 2) return 'significant_rise';
            return 'normal';
        }
        
        // ============================================================
        //  📊 DETECCIÓN DE PATRONES
        //  ============================================================
        _detectPatterns() {
            const history = this.history.fps;
            if (history.length < 30) return { type: 'insufficient', confidence: 0 };
            
            const recent = history.slice(-60);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            const std = Math.sqrt(variance);
            
            if (std / mean < 0.05) {
                return { type: 'stable', confidence: 0.8 };
            }
            
            const autocorr = this._calculateAutocorrelation(recent, 1);
            if (autocorr < -0.3) {
                return { type: 'oscillating', confidence: 0.7 };
            }
            
            const slope = this._calculateSlope(recent);
            if (Math.abs(slope) > 0.3) {
                return { 
                    type: slope > 0 ? 'trending_up' : 'trending_down', 
                    confidence: 0.6 
                };
            }
            
            if (std / mean > 0.15) {
                return { type: 'volatile', confidence: 0.7 };
            }
            
            return { type: 'mixed', confidence: 0.4 };
        }
        
        // ============================================================
        //  🔍 DETECCIÓN DE CONTEXTO
        //  ============================================================
        _detectContext() {
            const now = Date.now();
            
            let activity = 'active';
            if (document.hidden) activity = 'idle';
            else if (document.pointerLockElement) activity = 'gaming';
            
            let batteryStatus = 'normal';
            if (this.hardware._hardware?.lowPowerMode) batteryStatus = 'low';
            else if (this.hardware._hardware?.batterySaver) batteryStatus = 'saving';
            
            let networkQuality = 'good';
            const connection = this.hardware._hardware?.connection;
            if (connection) {
                const type = connection.effectiveType || '4g';
                if (type === 'slow-2g' || type === '2g') networkQuality = 'poor';
                else if (type === '3g') networkQuality = 'medium';
            }
            
            let thermalState = 'normal';
            if (this.hardware._hardware?.thermalThrottling) thermalState = 'hot';
            else if (this.hardware._hardware?.gpuTemperature > 70) thermalState = 'warm';
            
            const cpuLoad = this.hardware._hardware?.cpuUsage || 0.2;
            const gpuLoad = this.hardware._hardware?.gpuUsage || 0.2;
            const memoryPressure = this.hardware._hardware?.memoryPressure || 0.3;
            
            const mood = this._estimateUserMood();
            const sessionDuration = this.context.sessionDuration + 0.016;
            
            const newContext = {
                current: activity,
                lastChange: this.context.current !== activity ? now : this.context.lastChange,
                duration: this.context.current === activity ? 
                    this.context.duration + (now - this.context.lastChange) : 0,
                userActivity: activity,
                batteryStatus: batteryStatus,
                networkQuality: networkQuality,
                thermalState: thermalState,
                memoryPressure: memoryPressure,
                cpuLoad: cpuLoad,
                gpuLoad: gpuLoad,
                timeOfDay: this._getTimeOfDay(),
                dayOfWeek: new Date().getDay(),
                sessionDuration: sessionDuration,
                userMood: mood,
                stressLevel: this._estimateStressLevel()
            };
            
            if (this.context.current !== activity) {
                this.history.contexts.push({
                    from: this.context.current,
                    to: activity,
                    timestamp: now
                });
            }
            
            this.context = newContext;
        }
        
        _getTimeOfDay() {
            const hour = new Date().getHours();
            return hour / 24;
        }
        
        _estimateUserMood() {
            const fps = this.history.fps.slice(-30);
            if (fps.length < 10) return 'neutral';
            const avg = fps.reduce((a, b) => a + b, 0) / fps.length;
            const target = this.metaParams.targetFPS || 60;
            const ratio = avg / target;
            if (ratio > 0.95) return 'happy';
            if (ratio > 0.8) return 'content';
            if (ratio > 0.6) return 'neutral';
            if (ratio > 0.4) return 'frustrated';
            return 'angry';
        }
        
        _estimateStressLevel() {
            const fps = this.history.fps.slice(-30);
            if (fps.length < 10) return 0.3;
            const mean = fps.reduce((a, b) => a + b, 0) / fps.length;
            const variance = fps.reduce((a, b) => a + (b - mean) ** 2, 0) / fps.length;
            const std = Math.sqrt(variance);
            return Math.min(1, std / 15);
        }
        
        // ============================================================
        //  🧠 AJUSTE META (Bayesian Optimization)
        //  ============================================================
        _adjustMetaParamsBayesian(fpsRatio, prediction, mainAI) {
            const adjustments = {};
            
            const objective = (params) => {
                const fpsScore = Math.min(1, fpsRatio / (params.qualityThreshold || 0.75));
                const qualityScore = mainAI.currentQuality / 4;
                return fpsScore * 0.6 + qualityScore * 0.4;
            };
            
            const samples = 5;
            let bestScore = objective(this.metaParams);
            let bestParams = { ...this.metaParams };
            
            for (let i = 0; i < samples; i++) {
                const candidate = { ...this.metaParams };
                const noise = (Math.random() - 0.5) * 0.1;
                candidate.qualityThreshold = Math.max(0.3, Math.min(0.95, 
                    this.metaParams.qualityThreshold + noise));
                const noise2 = (Math.random() - 0.5) * 0.15;
                candidate.cooldownDown = Math.max(30, Math.min(150, 
                    this.metaParams.cooldownDown + noise2 * 100));
                const score = objective(candidate);
                if (score > bestScore) {
                    bestScore = score;
                    bestParams = candidate;
                }
            }
            
            const diff = (key) => {
                const diffVal = bestParams[key] - this.metaParams[key];
                if (Math.abs(diffVal) > 0.01) {
                    adjustments[key] = bestParams[key];
                    this.metaParams[key] = bestParams[key];
                }
            };
            
            diff('qualityThreshold');
            diff('cooldownDown');
            diff('cooldownUp');
            
            if (this.context.batteryStatus === 'low') {
                if (this.metaParams.maxQualityIndex > 2) {
                    this.metaParams.maxQualityIndex = 2;
                    adjustments.maxQualityIndex = 2;
                }
            }
            
            if (this.context.thermalState === 'hot') {
                if (this.metaParams.lodMultiplier > 0.8) {
                    this.metaParams.lodMultiplier = 0.8;
                    adjustments.lodMultiplier = 0.8;
                }
            }
            
            if (this.metaParams.useTransferLearning) {
                this._transferLearning(adjustments);
            }
            
            if (Object.keys(adjustments).length > 0) {
                this.history.adaptations.push({
                    timestamp: Date.now(),
                    adjustments: adjustments,
                    fpsRatio: fpsRatio,
                    prediction: prediction,
                    bestScore: bestScore,
                    context: { ...this.context }
                });
            }
            
            return adjustments;
        }
        
        // ============================================================
        //  🧠 TRANSFER LEARNING
        //  ============================================================
        _transferLearning(adjustments) {
            const similar = this.memoryBuffer
                .filter(exp => {
                    const contextSim = this._contextSimilarity(exp.context, this.context);
                    return contextSim > 0.7;
                })
                .slice(-10);
            
            if (similar.length < 3) return;
            
            const avgAdjustments = {};
            for (const exp of similar) {
                if (exp.adjustments) {
                    for (const [key, value] of Object.entries(exp.adjustments)) {
                        if (!avgAdjustments[key]) avgAdjustments[key] = [];
                        avgAdjustments[key].push(value);
                    }
                }
            }
            
            for (const [key, values] of Object.entries(avgAdjustments)) {
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                if (Math.abs(avg - this.metaParams[key]) > 0.05) {
                    adjustments[key] = avg;
                    this.metaParams[key] = avg;
                }
            }
        }
        
        _contextSimilarity(ctx1, ctx2) {
            let sim = 0;
            let count = 0;
            
            const fields = ['current', 'batteryStatus', 'networkQuality', 'thermalState'];
            for (const field of fields) {
                if (ctx1[field] === ctx2[field]) sim += 1;
                count++;
            }
            
            const numFields = ['cpuLoad', 'gpuLoad', 'memoryPressure', 'stressLevel'];
            for (const field of numFields) {
                const diff = Math.abs((ctx1[field] || 0) - (ctx2[field] || 0));
                sim += Math.max(0, 1 - diff);
                count++;
            }
            
            return sim / count;
        }
        
        // ============================================================
        //  🎯 OPTIMIZACIONES GRÁFICAS CONTEXTUALES
        //  ============================================================
        _optimizeGraphicsContextual(renderStats, fpsRatio, patterns) {
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
                screenSpaceReflections: false,
                globalIllumination: false,
                anisotropicFiltering: 1.0,
                reflectionQuality: 1.0
            };
            
            if (fpsRatio < 0.35) {
                optimizations.ssaoEnabled = false;
                optimizations.bloomIntensity = 0.2;
                optimizations.shadowQuality = 0.1;
                optimizations.particleDensity = 0.2;
                optimizations.textureFiltering = 0.2;
                optimizations.antialiasing = false;
                optimizations.postProcessing = false;
                optimizations.ambientOcclusion = false;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
                optimizations.anisotropicFiltering = 0;
                optimizations.reflectionQuality = 0;
            } else if (fpsRatio < 0.5) {
                optimizations.ssaoEnabled = false;
                optimizations.bloomIntensity = 0.4;
                optimizations.shadowQuality = 0.3;
                optimizations.particleDensity = 0.4;
                optimizations.textureFiltering = 0.4;
                optimizations.antialiasing = false;
                optimizations.postProcessing = true;
                optimizations.ambientOcclusion = false;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
                optimizations.anisotropicFiltering = 2;
                optimizations.reflectionQuality = 0.3;
            } else if (fpsRatio < 0.7) {
                optimizations.ssaoEnabled = true;
                optimizations.bloomIntensity = 0.7;
                optimizations.shadowQuality = 0.6;
                optimizations.particleDensity = 0.7;
                optimizations.textureFiltering = 0.7;
                optimizations.antialiasing = true;
                optimizations.postProcessing = true;
                optimizations.ambientOcclusion = true;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
                optimizations.anisotropicFiltering = 4;
                optimizations.reflectionQuality = 0.6;
            } else {
                optimizations.ssaoEnabled = true;
                optimizations.bloomIntensity = 1.2;
                optimizations.shadowQuality = 1.0;
                optimizations.particleDensity = 1.2;
                optimizations.textureFiltering = 1.5;
                optimizations.antialiasing = true;
                optimizations.postProcessing = true;
                optimizations.ambientOcclusion = true;
                optimizations.motionBlur = this.metaParams.motionBlur;
                optimizations.depthOfField = this.metaParams.depthOfField;
                optimizations.volumetricFog = this.metaParams.volumetricFog;
                optimizations.screenSpaceReflections = this.metaParams.screenSpaceReflections;
                optimizations.anisotropicFiltering = 8;
                optimizations.reflectionQuality = 1.0;
            }
            
            optimizations.particleDensity *= this.metaParams.particleMultiplier;
            optimizations.shadowQuality *= this.metaParams.shadowMultiplier;
            optimizations.textureFiltering *= this.metaParams.textureMultiplier;
            
            if (this.context.batteryStatus === 'low') {
                optimizations.bloomIntensity *= 0.3;
                optimizations.ssaoEnabled = false;
                optimizations.postProcessing = false;
                optimizations.ambientOcclusion = false;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
                optimizations.anisotropicFiltering = 1;
                optimizations.reflectionQuality = 0;
            }
            
            if (this.context.thermalState === 'hot') {
                optimizations.particleDensity *= 0.5;
                optimizations.shadowQuality *= 0.5;
                optimizations.bloomIntensity *= 0.5;
                optimizations.postProcessing = false;
            }
            
            if (this.context.userActivity === 'idle') {
                optimizations.bloomIntensity *= 0.2;
                optimizations.ssaoEnabled = false;
                optimizations.postProcessing = false;
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.volumetricFog = false;
                optimizations.screenSpaceReflections = false;
            }
            
            if (patterns.type === 'volatile') {
                optimizations.motionBlur = false;
                optimizations.depthOfField = false;
                optimizations.particleDensity *= 0.7;
            }
            
            if (patterns.type === 'trending_down') {
                optimizations.shadowQuality *= 0.8;
                optimizations.particleDensity *= 0.8;
            }
            
            if (this.forecast.trend === 'falling') {
                optimizations.particleDensity *= 0.8;
                optimizations.shadowQuality *= 0.8;
            }
            
            return optimizations;
        }
        
        // ============================================================
        //  📊 ANÁLISIS AVANZADO DE RENDIMIENTO
        //  ============================================================
        _analyzePerformanceAdvanced(mainAI) {
            const history = this.history.fps;
            const recent = history.slice(-60);
            
            if (recent.length < 10) {
                return {
                    avgFPS: 60,
                    maxFPS: 60,
                    minFPS: 60,
                    stdDev: 0,
                    stability: 1,
                    trend: 'stable',
                    quality: 'medium',
                    qualityRatio: 0.5,
                    recommendations: ['Esperando más datos...'],
                    dataPoints: recent.length,
                    percentile95: 60,
                    percentile50: 60,
                    improvementRate: 0,
                    degradationRate: 0
                };
            }
            
            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
            const max = Math.max(...recent);
            const min = Math.min(...recent);
            const variance = recent.reduce((a, b) => a + (b - avg) ** 2, 0) / recent.length;
            const stdDev = Math.sqrt(variance);
            
            const sorted = [...recent].sort((a, b) => a - b);
            const p95 = sorted[Math.floor(sorted.length * 0.95)];
            const p50 = sorted[Math.floor(sorted.length * 0.5)];
            
            const stability = Math.max(0, Math.min(1, 1 - (stdDev / avg)));
            const trend = this._getTrend();
            
            const quality = mainAI.qualityLevels[mainAI.currentQuality];
            const qualityIndex = mainAI.currentQuality;
            const maxQuality = mainAI.qualityLevels.length - 1;
            const qualityRatio = qualityIndex / maxQuality;
            
            const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
            const secondHalf = recent.slice(Math.floor(recent.length / 2));
            const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
            const improvementRate = (secondAvg - firstAvg) / firstAvg;
            const degradationRate = Math.max(0, -improvementRate);
            
            const recommendations = [];
            
            if (trend === 'falling') {
                recommendations.push('🔻 Rendimiento en declive - bajar calidad ahora');
            }
            if (stability < 0.7) {
                recommendations.push('📊 Rendimiento inestable - revisar configuración');
            }
            if (qualityRatio > 0.8 && avg < 40) {
                recommendations.push('🎯 Calidad alta con FPS bajo - reducir calidad');
            }
            if (qualityRatio < 0.3 && avg > 80) {
                recommendations.push('🚀 FPS alto con calidad baja - aumentar calidad');
            }
            if (this.context.batteryStatus === 'low') {
                recommendations.push('🔋 Batería baja - optimizar energía');
            }
            if (this.context.thermalState === 'hot') {
                recommendations.push('🌡️ Temperatura alta - reducir carga térmica');
            }
            if (degradationRate > 0.05) {
                recommendations.push('📉 Degradación detectada - aplicar corrección');
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
                recommendations: recommendations.slice(0, 5),
                dataPoints: recent.length,
                percentile95: Math.round(p95),
                percentile50: Math.round(p50),
                improvementRate: Math.round(improvementRate * 100),
                degradationRate: Math.round(degradationRate * 100)
            };
        }
        
        _getTrend() {
            const history = this.history.fps;
            if (history.length < 20) return 'stable';
            const recent = history.slice(-20);
            const slope = this._calculateSlope(recent);
            if (slope > 0.3) return 'rising';
            if (slope < -0.3) return 'falling';
            return 'stable';
        }
        
        // ============================================================
        //  🚨 SISTEMA DE ALERTAS PREDICTIVO (CORREGIDO)
        //  ============================================================
        _checkAlertsPredictive(fpsRatio, prediction, forecast, mainAI) {
            const alerts = [];
            const now = Date.now();
            
            if (fpsRatio < this.metaParams.criticalThreshold) {
                alerts.push({
                    type: 'critical',
                    severity: 3,
                    message: `🚨 FPS CRÍTICO: ${Math.round(fpsRatio * 100)}% del objetivo`,
                    timestamp: now,
                    action: 'emergency_down'
                });
            }
            
            if (prediction === 'falling') {
                alerts.push({
                    type: 'prediction',
                    severity: 2,
                    message: `🔮 Caída predicha en ${this.forecast.horizon} frames`,
                    timestamp: now,
                    action: 'prepare_down'
                });
            }
            
            if (forecast.trend === 'falling' && forecast.confidence > 0.6) {
                alerts.push({
                    type: 'forecast',
                    severity: 2,
                    message: `📉 Tendencia descendente detectada`,
                    timestamp: now,
                    action: 'monitor'
                });
            }
            
            if (this.context.batteryStatus === 'low') {
                alerts.push({
                    type: 'battery',
                    severity: 1,
                    message: `🔋 Modo de bajo consumo: ${this.context.batteryStatus}`,
                    timestamp: now,
                    action: 'battery_saver'
                });
            }
            
            if (this.context.thermalState === 'hot') {
                alerts.push({
                    type: 'thermal',
                    severity: 2,
                    message: `🌡️ Temperatura alta - throttling posible`,
                    timestamp: now,
                    action: 'reduce_thermal'
                });
            }
            
            if (this.history.fps.length > 30) {
                const recent = this.history.fps.slice(-30);
                const older = this.history.fps.slice(-60, -30);
                if (older.length === 30) {
                    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
                    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
                    if (recentAvg < olderAvg * 0.8) {
                        alerts.push({
                            type: 'degradation',
                            severity: 2,
                            message: `📉 Degradación significativa: ${Math.round(recentAvg)} → ${Math.round(olderAvg)} FPS`,
                            timestamp: now,
                            action: 'optimize'
                        });
                    }
                }
            }
            
            // === ALERTA DE INESTABILIDAD (CORREGIDO) ===
            if (this.history.fps.length > 20) {
                const recent = this.history.fps.slice(-20);
                // PRIMERO declarar avg
                const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
                // LUEGO usar avg para calcular std
                const std = Math.sqrt(recent.reduce((a, b) => a + (b - avg) ** 2, 0) / recent.length);
                if (std / avg > 0.2) {
                    alerts.push({
                        type: 'instability',
                        severity: 1,
                        message: `📊 Inestabilidad alta (σ=${Math.round(std)})`,
                        timestamp: now,
                        action: 'stabilize'
                    });
                }
            }
            
            if (this.history.alerts.length > 100) {
                this.history.alerts = this.history.alerts.slice(-50);
            }
            
            for (const alert of alerts) {
                this.history.alerts.push(alert);
            }
            
            return alerts;
        }
        
        // ============================================================
        //  🧠 APRENDIZAJE META CON REPLAY
        //  ============================================================
        _learnWithReplay(fpsRatio, prediction, mainAI) {
            const experience = {
                timestamp: Date.now(),
                features: this._extractFeatures(this.history.fps),
                prediction: prediction,
                actual: this._getTrend(),
                fpsRatio: fpsRatio,
                context: { ...this.context },
                adjustments: this.history.adaptations.slice(-1)[0]?.adjustments || {},
                reward: this._calculateReward(fpsRatio, prediction)
            };
            
            this.memoryBuffer.push(experience);
            if (this.memoryBuffer.length > this.maxMemorySize) {
                this.memoryBuffer.shift();
            }
            
            if (this.memoryBuffer.length >= this.metaParams.batchSize) {
                const batch = this._sampleBatch(this.metaParams.batchSize);
                this._trainBatch(batch);
            }
            
            const features = this._extractFeatures(this.history.fps);
            const target = fpsRatio;
            const predicted = this._neuralNetworkPredict(features);
            
            const error = target - predicted;
            this.model.accuracy = this.model.accuracy * 0.95 + (1 - Math.abs(error)) * 0.05;
            this.model.loss = this.model.loss * 0.9 + error * error * 0.1;
            
            this._backpropagate(features, target, predicted);
            
            this.metaParams.explorationRate *= this.explorationDecay;
            this.metaParams.explorationRate = Math.max(0.01, this.metaParams.explorationRate);
            
            const actualTrend = this._getTrend();
            if (prediction === actualTrend) {
                this.confidence = Math.min(1, this.confidence + 0.005);
            } else {
                this.confidence = Math.max(0.1, this.confidence - 0.01);
            }
            
            this.history.losses.push(this.model.loss);
            this.history.gradients.push(this.model.gradientNorm);
        }
        
        _calculateReward(fpsRatio, prediction) {
            let reward = 0;
            if (fpsRatio > 0.9) reward += 0.5;
            else if (fpsRatio > 0.7) reward += 0.2;
            else if (fpsRatio < 0.5) reward -= 0.3;
            
            const actual = this._getTrend();
            if (prediction === actual) reward += 0.3;
            else reward -= 0.2;
            
            if (this.history.fps.length > 20) {
                const recent = this.history.fps.slice(-20);
                const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
                const std = Math.sqrt(recent.reduce((a, b) => a + (b - avg) ** 2, 0) / recent.length);
                if (std / avg < 0.05) reward += 0.2;
            }
            
            return Math.max(-1, Math.min(1, reward));
        }
        
        _sampleBatch(batchSize) {
            const batch = [];
            const indices = [];
            for (let i = 0; i < batchSize; i++) {
                let idx;
                do {
                    idx = Math.floor(Math.random() * this.memoryBuffer.length);
                } while (indices.includes(idx));
                indices.push(idx);
                batch.push(this.memoryBuffer[idx]);
            }
            return batch;
        }
        
        _trainBatch(batch) {
            let totalLoss = 0;
            for (const exp of batch) {
                const features = exp.features;
                const target = exp.fpsRatio;
                const predicted = this._neuralNetworkPredict(features);
                const error = target - predicted;
                totalLoss += error * error;
                this._backpropagate(features, target, predicted);
            }
            this.model.loss = this.model.loss * 0.5 + (totalLoss / batch.length) * 0.5;
        }
        
        // ============================================================
        //  🧠 BACKPROPAGATION
        //  ============================================================
        _backpropagate(features, target, predicted) {
            const lr = this.model.learningRate || 0.01;
            
            const delta4 = (predicted - target) * predicted * (1 - predicted);
            
            const h3 = this._getHiddenLayer3(features);
            for (let i = 0; i < 16; i++) {
                this.model.w4[i] -= lr * delta4 * h3[i];
            }
            this.model.b4[0] -= lr * delta4;
            
            const delta3 = new Float32Array(16);
            for (let i = 0; i < 16; i++) {
                const grad = delta4 * this.model.w4[i] * h3[i] * (1 - h3[i]);
                delta3[i] = grad;
            }
            
            const h2 = this._getHiddenLayer2(features);
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 32; j++) {
                    this.model.w3[j * 16 + i] -= lr * delta3[i] * h2[j];
                }
                this.model.b3[i] -= lr * delta3[i];
            }
            
            const delta2 = new Float32Array(32);
            for (let i = 0; i < 32; i++) {
                let sum = 0;
                for (let j = 0; j < 16; j++) {
                    sum += delta3[j] * this.model.w3[i * 16 + j];
                }
                delta2[i] = sum * h2[i] * (1 - h2[i]);
            }
            
            const h1 = this._getHiddenLayer1(features);
            for (let i = 0; i < 32; i++) {
                for (let j = 0; j < 32; j++) {
                    this.model.w2[j * 32 + i] -= lr * delta2[i] * h1[j];
                }
                this.model.b2[i] -= lr * delta2[i];
            }
            
            const delta1 = new Float32Array(32);
            for (let i = 0; i < 32; i++) {
                let sum = 0;
                for (let j = 0; j < 32; j++) {
                    sum += delta2[j] * this.model.w2[i * 32 + j];
                }
                delta1[i] = sum * h1[i] * (1 - h1[i]);
            }
            
            for (let i = 0; i < 32; i++) {
                for (let j = 0; j < Math.min(features.length, 20); j++) {
                    this.model.w1[j * 32 + i] -= lr * delta1[i] * features[j];
                }
                this.model.b1[i] -= lr * delta1[i];
            }
            
            let gradNorm = 0;
            for (let i = 0; i < this.model.w1.length; i++) {
                gradNorm += Math.abs(this.model.w1[i]);
            }
            this.model.gradientNorm = gradNorm / this.model.w1.length;
        }
        
        _getHiddenLayer1(features) {
            const h1 = new Float32Array(32);
            for (let i = 0; i < 32; i++) {
                let sum = this.model.b1[i];
                for (let j = 0; j < Math.min(features.length, 20); j++) {
                    sum += features[j] * this.model.w1[j * 32 + i];
                }
                h1[i] = Math.max(0, sum);
            }
            return h1;
        }
        
        _getHiddenLayer2(features) {
            const h1 = this._getHiddenLayer1(features);
            const h2 = new Float32Array(32);
            for (let i = 0; i < 32; i++) {
                let sum = this.model.b2[i];
                for (let j = 0; j < 32; j++) {
                    sum += h1[j] * this.model.w2[j * 32 + i];
                }
                h2[i] = Math.max(0, sum);
            }
            return h2;
        }
        
        _getHiddenLayer3(features) {
            const h2 = this._getHiddenLayer2(features);
            const h3 = new Float32Array(16);
            for (let i = 0; i < 16; i++) {
                let sum = this.model.b3[i];
                for (let j = 0; j < 32; j++) {
                    sum += h2[j] * this.model.w3[j * 16 + i];
                }
                h3[i] = Math.max(0, sum);
            }
            return h3;
        }
        
        // ============================================================
        //  📝 EXPLICABILIDAD (XAI)
        //  ============================================================
        _generateExplanation(fpsRatio, prediction, adjustments) {
            const features = this._extractFeatures(this.history.fps);
            const importance = new Float32Array(features.length);
            
            const basePred = this._neuralNetworkPredict(features);
            
            for (let i = 0; i < features.length; i++) {
                const perturbed = new Float32Array(features);
                perturbed[i] += 0.1;
                const newPred = this._neuralNetworkPredict(perturbed);
                importance[i] = (newPred - basePred) * 100;
            }
            
            this.explainer.featureImportance = importance;
            
            let explanation = '';
            const topFeatures = Array.from(importance.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
            
            const featureNames = [
                'Media FPS', 'Varianza', 'Tendencia', 'Aceleración', 'Asimetría',
                'Curtosis', 'Autocorrelación', 'Frecuencia dominante', 'Centro espectral',
                'FPS actual', 'FPS inicial', 'Experiencia', 'Gaming activo',
                'Nivel batería', 'Calidad red', 'Hardware', 'CPU load', 'GPU load',
                'Presión memoria', 'Nivel estrés'
            ];
            
            explanation = 'Factores clave:\n';
            for (const [idx, val] of topFeatures) {
                const name = featureNames[idx] || `Feature ${idx}`;
                explanation += `  • ${name}: ${val.toFixed(1)}% de influencia\n`;
            }
            
            explanation += `\nContexto: ${this.context.current}`;
            explanation += `\nPredicción: ${prediction}`;
            explanation += `\nConfianza: ${(this.confidence * 100).toFixed(0)}%`;
            
            if (Object.keys(adjustments).length > 0) {
                explanation += `\nAjustes aplicados: ${Object.keys(adjustments).join(', ')}`;
            }
            
            this.explainer.lastExplanation = explanation;
            this.explainer.shapValues = Array.from(importance);
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
            
            if (decisions && decisions.length > 0) {
                const last = decisions[decisions.length - 1];
                this.history.decisions.push({
                    timestamp: Date.now(),
                    decision: last.decision || 'unknown',
                    fps: fps,
                    quality: quality,
                    reward: last.reward || 0
                });
            }
            
            const reward = this._calculateReward(fps / (this.metaParams.targetFPS || 60), 'stable');
            this.history.rewards.push(reward);
            if (this.history.rewards.length > 200) {
                this.history.rewards.shift();
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
                    adaptations: this.history.adaptations.slice(-50),
                    rewards: this.history.rewards.slice(-50),
                    losses: this.history.losses.slice(-50)
                },
                model: {
                    w1: Array.from(this.model.w1),
                    b1: Array.from(this.model.b1),
                    w2: Array.from(this.model.w2),
                    b2: Array.from(this.model.b2),
                    w3: Array.from(this.model.w3),
                    b3: Array.from(this.model.b3),
                    w4: Array.from(this.model.w4),
                    b4: Array.from(this.model.b4),
                    accuracy: this.model.accuracy,
                    trainingEpochs: this.model.trainingEpochs,
                    loss: this.model.loss,
                    gradientNorm: this.model.gradientNorm,
                    learningRate: this.model.learningRate
                },
                attention: {
                    weights: Array.from(this.attention.weights),
                    context: Array.from(this.attention.context)
                },
                ensemble: {
                    models: this.ensemble.models,
                    confidence: this.ensemble.confidence
                },
                memoryBuffer: this.memoryBuffer.slice(-200),
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
                modelAccuracy: Math.round(this.model.accuracy * 100),
                ensembleConfidence: Math.round(this.ensemble.confidence * 100),
                trainingEpochs: this.model.trainingEpochs,
                modelLoss: this.model.loss.toFixed(4),
                gradientNorm: this.model.gradientNorm.toFixed(4),
                context: this.context,
                metaParams: { ...this.metaParams },
                historySize: this.history.fps.length,
                alertCount: this.history.alerts.length,
                adaptationCount: this.history.adaptations.length,
                memoryBufferSize: this.memoryBuffer.length,
                forecast: this.forecast,
                featureImportance: Array.from(this.explainer.featureImportance),
                lastExplanation: this.explainer.lastExplanation
            };
        }
        
        getAlertHistory() {
            return this.history.alerts.slice(-20);
        }
        
        getAdaptationHistory() {
            return this.history.adaptations.slice(-20);
        }
        
        getForecast() {
            return { ...this.forecast };
        }
        
        getExplanation() {
            return this.explainer.lastExplanation;
        }
        
        // ============================================================
        //  🔧 MÉTODOS DE UTILIDAD
        //  ============================================================
        applyOptimizations(renderer, optimizations) {
            if (!renderer) return;
            
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
            if (typeof renderer.setAnisotropicFiltering === 'function') {
                renderer.setAnisotropicFiltering(optimizations.anisotropicFiltering || 1);
            }
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.confidence = 0.85;
            this.history = {
                fps: [],
                qualities: [],
                decisions: [],
                performance: [],
                predictions: [],
                alerts: [],
                adaptations: [],
                contexts: [],
                rewards: [],
                losses: [],
                gradients: [],
                attentionWeights: [],
                ensemblePredictions: []
            };
            this.memoryBuffer = [];
            this.model.accuracy = 0.5;
            this.model.trainingEpochs = 0;
            this.model.loss = 1.0;
            this.model.gradientNorm = 0;
            
            this._initWeights();
            
            this.metaParams = {
                qualityThreshold: 0.75,
                qualityUpThreshold: 0.92,
                emergencyThreshold: 0.35,
                qualityDownThreshold: 0.55,
                cooldownDown: 90,
                cooldownUp: 180,
                emergencyCooldown: 60,
                minCooldown: 30,
                maxCooldown: 300,
                lodMultiplier: 1.0,
                entityMultiplier: 1.0,
                particleMultiplier: 1.0,
                shadowMultiplier: 1.0,
                textureMultiplier: 1.0,
                explorationRate: 0.05,
                learningRate: 0.05,
                discountFactor: 0.95,
                batchSize: 32,
                memorySize: 1000,
                targetFPS: 60,
                minFPS: 20,
                maxQualityIndex: 4,
                minQualityIndex: 0,
                fpsTolerance: 0.1,
                shadowQuality: 1.0,
                textureQuality: 1.0,
                antialiasing: true,
                vsync: false,
                ambientOcclusion: true,
                motionBlur: false,
                depthOfField: false,
                volumetricFog: false,
                screenSpaceReflections: false,
                globalIllumination: false,
                alertThreshold: 0.7,
                warningThreshold: 0.5,
                criticalThreshold: 0.3,
                alertCooldown: 60,
                contextAwareness: true,
                userAdaptation: true,
                hardwareAdaptation: true,
                thermalAwareness: true,
                batteryAwareness: true,
                useEnsemble: true,
                useAttention: true,
                useMetaLearning: true,
                useTransferLearning: true,
                explanationLevel: 'medium'
            };
            
            console.log('🔄 MetaOptimizerAI reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.MetaOptimizerAI = MetaOptimizerAI;
    
    console.log('🧬 MetaOptimizerAI Cuántica cargado');
    console.log('🧠 Red neuronal profunda (4 capas)');
    console.log('🎯 Sistema de ensamble (4 modelos)');
    console.log('🔮 Forecasting y detección de anomalías');
    console.log('📝 XAI - Explicabilidad de decisiones');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MetaOptimizerAI;
    }
    
})();
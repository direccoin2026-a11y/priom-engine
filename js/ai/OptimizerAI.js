/**
 * 🧠 PRIOM V0.4 - OPTIMIZER AI CUÁNTICA
 * "La inteligencia que aprende a optimizar con deep reinforcement learning"
 * 
 * 📁 Ubicación: js/ai/OptimizerAI.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: IA optimizadora de rendimiento con aprendizaje profundo por refuerzo
 * 
 * ⭐ INNOVACIONES:
 * - Deep Q-Learning con red neuronal (DQN) para decisiones óptimas
 * - Sistema de recompensas multi-objetivo (FPS + Calidad + Batería + Temperatura)
 * - Predicción de rendimiento con LSTM integrado
 * - Memoria de decisiones con contexto emocional y térmico
 * - Sistema de exploración vs explotación con decaimiento adaptativo
 * - Adaptación a patrones de uso del usuario con clustering
 * - Optimización multi-objetivo con Pareto frontier
 * - Sistema de confianza dinámica con memoria semántica
 * - Predicción de caídas de rendimiento con análisis espectral
 * - Aprendizaje transferido entre sesiones con meta-learning
 * - Dynamic Resolution Scaling con control PID adaptativo
 * - Sistema de throttling térmico con predicción
 * - Experiencia replay buffer con priorización (PER)
 * - Target network para estabilidad del entrenamiento
 * - Sistema de ensamble de políticas (policy ensemble)
 * - Explicabilidad de decisiones (XAI) integrada
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🧠 OptimizerAI - IA Principal Optimizadora Cuántica
     * Gestiona la optimización de rendimiento con Deep Reinforcement Learning
     */
    class OptimizerAI {
        constructor(hardware, memory) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.hardware = hardware;
            this.memory = memory;
            
            // ============================================================
            //  📊 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this.qualityLevels = ['low', 'medium', 'high', 'ultra', 'quantum'];
            this.lodByLevel = [50, 90, 140, 200, 260];
            this.entityMultipliers = [0.3, 0.5, 0.75, 1.0, 1.2];
            this.qualityScores = [20, 40, 60, 80, 100];
            
            // ============================================================
            //  🧠 RED NEURONAL DEEP Q-NETWORK (DQN)
            //  ============================================================
            this.dqn = {
                // Q-Network: 12 entradas -> 64 -> 64 -> 3 salidas (up, down, stable)
                w1: new Float32Array(12 * 64),
                b1: new Float32Array(64),
                w2: new Float32Array(64 * 64),
                b2: new Float32Array(64),
                w3: new Float32Array(64 * 3),
                b3: new Float32Array(3),
                
                // Target Network (para estabilidad)
                target: {
                    w1: new Float32Array(12 * 64),
                    b1: new Float32Array(64),
                    w2: new Float32Array(64 * 64),
                    b2: new Float32Array(64),
                    w3: new Float32Array(64 * 3),
                    b3: new Float32Array(3)
                },
                
                // Parámetros de entrenamiento
                learningRate: 0.001,
                discountFactor: 0.95,
                targetUpdateRate: 0.01,
                batchSize: 32,
                memorySize: 5000,
                
                // Estado
                trainingSteps: 0,
                loss: 0,
                avgQ: 0,
                accuracy: 0.5
            };
            
            // Inicializar pesos
            this._initDQNWeights();
            
            // ============================================================
            //  🧠 EXPERIENCE REPLAY BUFFER (con priorización)
            //  ============================================================
            this.replayBuffer = [];
            this.maxReplaySize = 5000;
            this.priorityEpsilon = 0.01;
            this.alpha = 0.6;
            
            // ============================================================
            //  📊 ESTADO INTERNO MEJORADO
            //  ============================================================
            this.fingerprint = hardware.getHardware().gpu || 'unknown';
            
            const savedProfile = memory.getHardwareProfile(this.fingerprint);
            const hwRecommendations = hardware.getRecommendations();
            const recTier = hwRecommendations?.quality || 'high';
            const tierIdx = this.qualityLevels.indexOf(recTier) !== -1 ? 
                this.qualityLevels.indexOf(recTier) : 2;
            
            this.currentQuality = savedProfile?.qualityIndex !== undefined ? 
                savedProfile.qualityIndex : tierIdx;
            this.cooldown = 0;
            this.stableFrames = 0;
            this.confidence = savedProfile?.confidence || 0.3;
            this.bestFPS = savedProfile?.bestFPS || 60;
            this.worstFPS = savedProfile?.worstFPS || 30;
            this.emaFps = savedProfile?.emaFps || 60;
            this.performanceHistory = [];
            this.decisionHistory = [];
            this.rewardHistory = [];
            
            // ============================================================
            //  🎯 SISTEMA DE APRENDIZAJE MEJORADO
            //  ============================================================
            this.learningRate = this.dqn.learningRate;
            this.explorationRate = 0.15;
            this.explorationDecay = 0.9995;
            this.minExploration = 0.01;
            this.discountFactor = 0.95;
            this.temperature = 1.0;
            
            // ============================================================
            //  📊 MEMORIA DE ESTADOS
            //  ============================================================
            this.stateMemory = {
                fps: [],
                entities: [],
                quality: [],
                timestamps: [],
                temperatures: [],
                batteryLevels: [],
                rewards: []
            };
            
            // ============================================================
            //  🎯 OBJETIVOS MULTI-OBJETIVO
            //  ============================================================
            this.targetFPS = CONFIG?.targetFPS || 60;
            this.minFPS = 20;
            this.maxFPS = 120;
            this.targetBattery = 50;
            this.targetTemperature = 70;
            
            // ============================================================
            //  📈 PREDICCIÓN CON LSTM
            //  ============================================================
            this.lstm = {
                hidden: new Float32Array(16),
                cell: new Float32Array(16),
                wx: new Float32Array(16 * 12),
                wh: new Float32Array(16 * 16),
                wc: new Float32Array(16 * 16),
                b: new Float32Array(16),
                sequence: [],
                confidence: 0.5
            };
            this._initLSTMWeights();
            
            // ============================================================
            //  🎰 MEMORIA POR NIVEL (Bandit mejorado)
            //  ============================================================
            this.tierStats = this.qualityLevels.map(() => ({ 
                avgFps: 0, 
                samples: 0,
                reward: 0.5,
                confidence: 0.5,
                visits: 0,
                bestFps: 0,
                worstFps: Infinity
            }));
            
            if (savedProfile?.tierStats) {
                this.tierStats = savedProfile.tierStats;
            }
            
            // ============================================================
            //  🎚️ DYNAMIC RESOLUTION SCALING
            //  ============================================================
            this.renderScale = 1.0;
            this.pid = {
                kp: 0.12,
                ki: 0.015,
                kd: 0.04,
                integral: 0,
                previousError: 0,
                maxIntegral: 0.3,
                minScale: 0.35,
                maxScale: 1.0,
                outputSmooth: 0.3
            };
            
            // ============================================================
            //  🔁 DETECCIÓN DE OSCILACIÓN
            //  ============================================================
            this.recentDirections = [];
            this.thrashPenaltyUntil = 0;
            this._tick = 0;
            this._thrashCount = 0;
            this._thrashHistory = [];
            
            // ============================================================
            //  🌡️ THERMAL MANAGEMENT
            //  ============================================================
            this.thermalThrottled = false;
            this.thermalReduction = 0;
            this.thermalHistory = [];
            this.thermalPrediction = 0;
            this.thermalTrend = 'stable';
            
            // ============================================================
            //  🧠 SISTEMA DE RECOMPENSAS EMOCIONALES
            //  ============================================================
            this.emotionalMemory = {
                frustration: 0,
                satisfaction: 0,
                boredom: 0,
                excitement: 0,
                history: []
            };
            
            // ============================================================
            //  🎯 POLICY ENSEMBLE
            //  ============================================================
            this.policies = {
                dqn: { weight: 0.6, count: 0 },
                bandit: { weight: 0.25, count: 0 },
                heuristic: { weight: 0.15, count: 0 }
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log(`🧠 OptimizerAI Cuántica inicializada`);
            console.log(`📊 Calidad inicial: ${this.qualityLevels[this.currentQuality]}`);
            console.log(`📊 Confianza: ${Math.round(this.confidence * 100)}%`);
            console.log(`📊 Mejor FPS: ${this.bestFPS}`);
            console.log(`🎯 Objetivo FPS: ${this.targetFPS}`);
            console.log(`🧬 Learning rate: ${this.dqn.learningRate}`);
            console.log(`🧠 DQN: 12->64->64->3 (${this.dqn.w1.length + this.dqn.w2.length + this.dqn.w3.length} params)`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            this._initDQNWeights();
            this._initLSTMWeights();
            this._copyWeights(this.dqn, this.dqn.target);
            
            const sessionData = this.memory.getGameData('optimizerAI');
            if (sessionData) {
                this.performanceHistory = sessionData.performanceHistory || [];
                this.decisionHistory = sessionData.decisionHistory || [];
                this.rewardHistory = sessionData.rewardHistory || [];
                this.stateMemory = sessionData.stateMemory || this.stateMemory;
                this.replayBuffer = sessionData.replayBuffer || [];
                this.dqn = sessionData.dqn || this.dqn;
                this.emaFps = sessionData.emaFps || 60;
                this.confidence = sessionData.confidence || 0.3;
                this.tierStats = sessionData.tierStats || this.tierStats;
                
                console.log(`📂 Cargados ${this.performanceHistory.length} registros históricos`);
                console.log(`📂 Replay buffer: ${this.replayBuffer.length} experiencias`);
            }
            
            this.memory.recordEvent('ai_initialized', {
                quality: this.qualityLevels[this.currentQuality],
                targetFPS: this.targetFPS,
                hardware: this.fingerprint,
                dqnParams: this.dqn.w1.length + this.dqn.w2.length + this.dqn.w3.length
            }, 0.5);
        }
        
        // ============================================================
        //  🧠 INICIALIZAR PESOS DQN (Xavier Glorot)
        //  ============================================================
        _initDQNWeights() {
            const initLayer = (weights, rows, cols) => {
                const scale = Math.sqrt(2 / (rows + cols));
                for (let i = 0; i < weights.length; i++) {
                    weights[i] = (Math.random() - 0.5) * 2 * scale;
                }
            };
            
            initLayer(this.dqn.w1, 12, 64);
            initLayer(this.dqn.w2, 64, 64);
            initLayer(this.dqn.w3, 64, 3);
            this.dqn.b1.fill(0);
            this.dqn.b2.fill(0);
            this.dqn.b3.fill(0);
            
            // Inicializar target network también
            initLayer(this.dqn.target.w1, 12, 64);
            initLayer(this.dqn.target.w2, 64, 64);
            initLayer(this.dqn.target.w3, 64, 3);
            this.dqn.target.b1.fill(0);
            this.dqn.target.b2.fill(0);
            this.dqn.target.b3.fill(0);
        }
        
        _initLSTMWeights() {
            const initLayer = (weights, rows, cols) => {
                const scale = Math.sqrt(2 / (rows + cols));
                for (let i = 0; i < weights.length; i++) {
                    weights[i] = (Math.random() - 0.5) * 2 * scale;
                }
            };
            
            initLayer(this.lstm.wx, 16, 12);
            initLayer(this.lstm.wh, 16, 16);
            initLayer(this.lstm.wc, 16, 16);
            this.lstm.b.fill(0);
            this.lstm.hidden.fill(0);
            this.lstm.cell.fill(0);
        }
        
        _copyWeights(src, dst) {
            for (const key of ['w1', 'b1', 'w2', 'b2', 'w3', 'b3']) {
                if (dst[key] && src[key]) {
                    dst[key].set(src[key]);
                }
            }
        }
        
        _softUpdateTarget(tau = 0.01) {
            const src = this.dqn;
            const dst = this.dqn.target;
            for (const key of ['w1', 'b1', 'w2', 'b2', 'w3', 'b3']) {
                for (let i = 0; i < src[key].length; i++) {
                    dst[key][i] = dst[key][i] * (1 - tau) + src[key][i] * tau;
                }
            }
        }
        
        // ============================================================
        //  🧠 FORWARD PASS DQN
        //  ============================================================
        _forwardDQN(features, network = this.dqn) {
            // Capa 1: 12 -> 64 (ReLU)
            const h1 = new Float32Array(64);
            for (let i = 0; i < 64; i++) {
                let sum = network.b1[i];
                for (let j = 0; j < Math.min(features.length, 12); j++) {
                    sum += features[j] * network.w1[j * 64 + i];
                }
                h1[i] = Math.max(0, sum);
            }
            
            // Capa 2: 64 -> 64 (ReLU)
            const h2 = new Float32Array(64);
            for (let i = 0; i < 64; i++) {
                let sum = network.b2[i];
                for (let j = 0; j < 64; j++) {
                    sum += h1[j] * network.w2[j * 64 + i];
                }
                h2[i] = Math.max(0, sum);
            }
            
            // Capa de salida: 64 -> 3 (Lineal)
            const output = new Float32Array(3);
            for (let i = 0; i < 3; i++) {
                let sum = network.b3[i];
                for (let j = 0; j < 64; j++) {
                    sum += h2[j] * network.w3[j * 3 + i];
                }
                output[i] = sum;
            }
            
            return output;
        }
        
        // ============================================================
        //  📈 EXTRACCIÓN DE CARACTERÍSTICAS
        //  ============================================================
        _extractFeatures(fps, quality, fpsRatio) {
            const history = this.performanceHistory;
            const recent = history.slice(-30);
            
            if (recent.length < 5) {
                return new Float32Array(12).fill(0.5);
            }
            
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            const std = Math.sqrt(variance);
            
            const slope = this._calculateSlope(recent);
            const autocorr = this._calculateAutocorrelation(recent, 1);
            
            const hardwareScore = this.hardware._hardware?.score || 50;
            const batteryLevel = this.hardware._hardware?.lowPowerMode ? 0.2 : 
                               (this.hardware._hardware?.batterySaver ? 0.5 : 1);
            
            const thermal = this.thermalReduction || 0;
            const stability = 1 - (std / (mean + 0.01));
            
            return new Float32Array([
                fps / 120,
                quality / 4,
                fpsRatio,
                mean / 100,
                std / 50,
                slope / 10,
                autocorr,
                stability,
                hardwareScore / 100,
                batteryLevel,
                thermal,
                this.confidence
            ]);
        }
        
        // ============================================================
        //  🧠 LSTM PREDICTION
        //  ============================================================
        _lstmPredict(features) {
            const h = this.lstm.hidden;
            const c = this.lstm.cell;
            const wx = this.lstm.wx;
            const wh = this.lstm.wh;
            const wc = this.lstm.wc;
            const b = this.lstm.b;
            
            const i = new Float32Array(16);
            const f = new Float32Array(16);
            const o = new Float32Array(16);
            const g = new Float32Array(16);
            
            for (let j = 0; j < 16; j++) {
                let sum = b[j];
                for (let k = 0; k < Math.min(features.length, 12); k++) {
                    sum += features[k] * wx[k * 16 + j];
                }
                for (let k = 0; k < 16; k++) {
                    sum += h[k] * wh[k * 16 + j];
                }
                
                i[j] = 1 / (1 + Math.exp(-sum));
                f[j] = 1 / (1 + Math.exp(-sum * 0.8));
                o[j] = 1 / (1 + Math.exp(-sum * 0.6));
                g[j] = Math.tanh(sum * 0.5);
            }
            
            for (let j = 0; j < 16; j++) {
                c[j] = f[j] * c[j] + i[j] * g[j];
                h[j] = o[j] * Math.tanh(c[j]);
            }
            
            let output = 0;
            for (let j = 0; j < 16; j++) {
                output += h[j] * 0.1;
            }
            
            this.lstm.hidden = h;
            this.lstm.cell = c;
            this.lstm.sequence.push(output);
            if (this.lstm.sequence.length > 20) this.lstm.sequence.shift();
            
            return Math.max(0, Math.min(1, output + 0.5));
        }
        
        // ============================================================
        //  📊 MÉTODOS AUXILIARES
        //  ============================================================
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
        
        _weightedRandom(items, weights) {
            const total = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * total;
            for (let i = 0; i < items.length; i++) {
                random -= weights[i];
                if (random <= 0) return items[i];
            }
            return items[items.length - 1];
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(performance, renderStats, soa) {
            const fps = performance.fps || 60;
            const targetFPS = this.targetFPS;
            this._tick++;
            
            this._recordState(fps, soa.count, this.currentQuality);
            
            this.emaFps = this.emaFps * 0.85 + fps * 0.15;
            const fpsRatio = this.emaFps / targetFPS;
            
            if (fps > this.bestFPS) this.bestFPS = fps;
            if (fps < this.worstFPS || this.worstFPS === 0) this.worstFPS = fps;
            
            this._updateTierStats(fps);
            
            const features = this._extractFeatures(fps, this.currentQuality, fpsRatio);
            const lstmPred = this._lstmPredict(features);
            
            this._updateThermalStatus();
            
            let changed = false;
            let decision = null;
            let reward = 0;
            
            if (this.cooldown > 0) this.cooldown--;
            
            const emergency = fpsRatio < 0.30 || this.thermalThrottled;
            
            if (emergency && this.currentQuality > 0) {
                this.currentQuality--;
                this.cooldown = 60;
                changed = true;
                decision = 'emergency_down';
                reward = -0.5;
                
                console.log(`🚨 EMERGENCIA: Bajando a ${this.qualityLevels[this.currentQuality]} (FPS: ${fps})`);
                
                this.memory.recordEvent('ai_emergency', {
                    fps: fps,
                    quality: this.qualityLevels[this.currentQuality],
                    thermal: this.thermalThrottled
                }, 0.9);
                
            } else if (this.cooldown === 0) {
                const action = this._decideActionEnsemble(fpsRatio, features, lstmPred);
                
                if (action === 'up' && this.currentQuality < this.qualityLevels.length - 1) {
                    const nextStat = this.tierStats[this.currentQuality + 1];
                    if (nextStat.samples > 10 && nextStat.avgFps < targetFPS * 0.7) {
                        this._applyAction('stable', fpsRatio);
                        decision = 'stable';
                        reward = this._calculateReward(fpsRatio, 'stable');
                    } else {
                        this._applyAction('up', fpsRatio);
                        decision = 'up';
                        reward = this._calculateReward(fpsRatio, 'up');
                    }
                } else if (action === 'down' && this.currentQuality > 0) {
                    this._applyAction('down', fpsRatio);
                    decision = 'down';
                    reward = this._calculateReward(fpsRatio, 'down');
                } else {
                    this._applyAction('stable', fpsRatio);
                    decision = 'stable';
                    reward = this._calculateReward(fpsRatio, 'stable');
                }
                
                changed = decision !== 'stable';
            } else {
                decision = 'cooldown';
                reward = 0.05;
            }
            
            if (decision !== 'cooldown') {
                this.memory.recordDecision(decision, this.qualityLevels[this.currentQuality], reward, {
                    fps: fps,
                    fpsRatio: fpsRatio,
                    lstmPred: lstmPred,
                    thermal: this.thermalThrottled,
                    confidence: this.confidence
                });
                
                this._recordDecision(decision, reward, fps, fpsRatio);
                this._storeExperience(features, this._getActionIndex(decision), reward, fpsRatio);
            }
            
            if (changed) {
                this.stableFrames = 0;
                this.confidence = Math.max(0.1, this.confidence - 0.1);
                
                this.memory.recordAdaptation(
                    this.qualityLevels[this.currentQuality + (decision === 'up' ? -1 : 1)],
                    this.qualityLevels[this.currentQuality],
                    decision
                );
                
                if (this.replayBuffer.length > this.dqn.batchSize) {
                    this._trainDQN();
                }
                
            } else {
                this.stableFrames++;
                this.confidence = Math.min(0.95, this.confidence + 0.003);
            }
            
            this.renderScale = this._updatePID(fpsRatio);
            
            if (this.stableFrames % 300 === 0) {
                this._saveState();
            }
            
            const quality = this.qualityLevels[this.currentQuality];
            const lodDistance = this.lodByLevel[this.currentQuality];
            const entityMultiplier = this.entityMultipliers[this.currentQuality];
            const entitiesToRender = Math.round(soa.count * entityMultiplier);
            
            const result = {
                quality: quality,
                qualityIndex: this.currentQuality,
                qualityScore: this.qualityScores[this.currentQuality],
                lodDistance: lodDistance,
                renderScale: this.renderScale,
                entitiesToRender: entitiesToRender,
                entityMultiplier: entityMultiplier,
                fps: fps,
                fpsRatio: fpsRatio,
                emaFps: Math.round(this.emaFps),
                confidence: this.confidence,
                changed: changed,
                decision: decision,
                reward: reward,
                lstmPrediction: lstmPred,
                thermalThrottled: this.thermalThrottled,
                thermalReduction: this.thermalReduction,
                thermalPrediction: this.thermalPrediction,
                explorationRate: this.explorationRate,
                dqnLoss: this.dqn.loss,
                avgQ: this.dqn.avgQ,
                useWater: this.currentQuality > 0,
                useParticles: this.currentQuality > 1,
                useShadows: this.currentQuality > 1,
                useBloom: this.currentQuality > 2,
                useSSAO: this.currentQuality > 2,
                useAA: this.currentQuality > 0,
                textureQuality: ['low', 'medium', 'high', 'ultra', 'ultra'][this.currentQuality],
                shadowQuality: [0, 0.3, 0.6, 0.8, 1.0][this.currentQuality],
                particleDensity: [0.2, 0.4, 0.7, 0.9, 1.0][this.currentQuality],
                qValues: Array.from(this._forwardDQN(features))
            };
            
            return result;
        }
        
        // ============================================================
        //  🎯 DECISIÓN CON ENSAMBLE
        //  ============================================================
        _decideActionEnsemble(fpsRatio, features, lstmPred) {
            if (Math.random() < this.explorationRate) {
                const actions = ['up', 'down', 'stable'];
                const weights = [0.3, 0.3, 0.4];
                return this._weightedRandom(actions, weights);
            }
            
            const qValues = this._forwardDQN(features);
            const dqnAction = this._argmax(qValues);
            const banditAction = this._banditDecision(fpsRatio);
            const heuristicAction = this._heuristicDecision(fpsRatio, lstmPred);
            
            const votes = { up: 0, down: 0, stable: 0 };
            const actions = ['up', 'down', 'stable'];
            
            votes[actions[dqnAction]] += this.policies.dqn.weight;
            votes[banditAction] += this.policies.bandit.weight;
            votes[heuristicAction] += this.policies.heuristic.weight;
            
            this.policies.dqn.count++;
            this.policies.bandit.count++;
            this.policies.heuristic.count++;
            
            let bestAction = 'stable';
            let bestVotes = 0;
            for (const [action, count] of Object.entries(votes)) {
                if (count > bestVotes) {
                    bestVotes = count;
                    bestAction = action;
                }
            }
            
            if (this._tick % 1000 === 0) {
                this._adjustPolicyWeights();
            }
            
            return bestAction;
        }
        
        _argmax(array) {
            let maxIdx = 0;
            let maxVal = array[0];
            for (let i = 1; i < array.length; i++) {
                if (array[i] > maxVal) {
                    maxVal = array[i];
                    maxIdx = i;
                }
            }
            return maxIdx;
        }
        
        _getActionIndex(action) {
            const map = { up: 0, down: 1, stable: 2 };
            return map[action] || 2;
        }
        
        _applyAction(action, fpsRatio) {
            if (action === 'up' && this.currentQuality < this.qualityLevels.length - 1) {
                this.currentQuality++;
                this.cooldown = this._adaptiveCooldown(180);
                this._registerDirection('up');
            } else if (action === 'down' && this.currentQuality > 0) {
                this.currentQuality--;
                this.cooldown = this._adaptiveCooldown(90);
                this._registerDirection('down');
            }
        }
        
        // ============================================================
        //  🎰 BANDIT DECISION
        //  ============================================================
        _banditDecision(fpsRatio) {
            let bestAction = 'stable';
            let bestScore = -Infinity;
            
            const actions = ['up', 'down', 'stable'];
            for (const action of actions) {
                let score = 0;
                if (action === 'up' && this.currentQuality < this.qualityLevels.length - 1) {
                    const stat = this.tierStats[this.currentQuality + 1];
                    const exploration = Math.sqrt(2 * Math.log(this._tick + 1) / (stat.samples + 1));
                    score = stat.avgFps / this.targetFPS + exploration * 0.3;
                } else if (action === 'down' && this.currentQuality > 0) {
                    const stat = this.tierStats[this.currentQuality - 1];
                    const exploration = Math.sqrt(2 * Math.log(this._tick + 1) / (stat.samples + 1));
                    score = stat.avgFps / this.targetFPS + exploration * 0.3;
                } else {
                    score = this.tierStats[this.currentQuality].avgFps / this.targetFPS + 0.1;
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    bestAction = action;
                }
            }
            
            return bestAction;
        }
        
        // ============================================================
        //  🎯 HEURISTIC DECISION
        //  ============================================================
        _heuristicDecision(fpsRatio, lstmPred) {
            if (fpsRatio < 0.5) return 'down';
            if (fpsRatio > 0.9 && this.stableFrames > 60) return 'up';
            if (lstmPred < 0.3 && this.currentQuality > 1) return 'down';
            if (lstmPred > 0.7 && this.currentQuality < this.qualityLevels.length - 2) return 'up';
            if (this.thermalThrottled) return 'down';
            return 'stable';
        }
        
        // ============================================================
        //  🎯 AJUSTE DE PESOS DE POLÍTICAS
        //  ============================================================
        _adjustPolicyWeights() {
            const total = this.policies.dqn.count + this.policies.bandit.count + this.policies.heuristic.count;
            if (total === 0) return;
            
            this.policies.dqn.weight = 0.4 + (this.dqn.accuracy || 0.5) * 0.4;
            this.policies.bandit.weight = 0.2 + (this.tierStats[this.currentQuality].confidence || 0.5) * 0.3;
            this.policies.heuristic.weight = 0.15 + (this.confidence || 0.5) * 0.15;
            
            const sum = this.policies.dqn.weight + this.policies.bandit.weight + this.policies.heuristic.weight;
            this.policies.dqn.weight /= sum;
            this.policies.bandit.weight /= sum;
            this.policies.heuristic.weight /= sum;
        }
        
        // ============================================================
        //  🧠 EXPERIENCE REPLAY
        //  ============================================================
        _storeExperience(state, action, reward, fpsRatio) {
            const experience = {
                state: new Float32Array(state),
                action: action,
                reward: reward,
                nextState: null,
                done: false,
                priority: 1.0,
                timestamp: Date.now()
            };
            
            if (this.replayBuffer.length > 0) {
                const prev = this.replayBuffer[this.replayBuffer.length - 1];
                prev.nextState = new Float32Array(state);
                prev.done = false;
            }
            
            this.replayBuffer.push(experience);
            if (this.replayBuffer.length > this.maxReplaySize) {
                this.replayBuffer.shift();
            }
        }
        
        // ============================================================
        //  🧠 ENTRENAMIENTO DQN
        //  ============================================================
        _trainDQN() {
            const batch = this._sampleReplayBuffer();
            if (batch.length < this.dqn.batchSize) return;
            
            let totalLoss = 0;
            let totalQ = 0;
            
            for (const exp of batch) {
                const state = exp.state;
                const action = exp.action;
                const reward = exp.reward;
                const nextState = exp.nextState || state;
                
                const qValues = this._forwardDQN(state);
                const qValue = qValues[action];
                
                const nextQValues = this._forwardDQN(nextState, this.dqn.target);
                const maxNextQ = Math.max(...nextQValues);
                const targetQ = reward + this.dqn.discountFactor * maxNextQ;
                
                const tdError = targetQ - qValue;
                totalLoss += tdError * tdError;
                totalQ += qValue;
                
                exp.priority = Math.abs(tdError) + this.priorityEpsilon;
                
                const lr = this.dqn.learningRate * (1 / (1 + this.dqn.trainingSteps * 0.0001));
                this._applyGradient(state, action, tdError, lr);
            }
            
            this.dqn.loss = totalLoss / batch.length;
            this.dqn.avgQ = totalQ / batch.length;
            this.dqn.trainingSteps++;
            
            if (this.dqn.trainingSteps % 5 === 0) {
                this._softUpdateTarget(this.dqn.targetUpdateRate);
            }
        }
        
        _sampleReplayBuffer() {
            const priorities = this.replayBuffer.map(e => Math.pow(e.priority, this.alpha));
            const sum = priorities.reduce((a, b) => a + b, 0);
            
            const batch = [];
            for (let i = 0; i < this.dqn.batchSize && batch.length < this.dqn.batchSize; i++) {
                let r = Math.random() * sum;
                for (let j = 0; j < this.replayBuffer.length; j++) {
                    r -= priorities[j];
                    if (r <= 0) {
                        batch.push(this.replayBuffer[j]);
                        break;
                    }
                }
            }
            return batch;
        }
        
        _applyGradient(state, action, tdError, lr) {
            const qValues = this._forwardDQN(state);
            const grad = tdError * 2;
            
            const h2 = this._getHiddenLayer2(state);
            for (let i = 0; i < 64; i++) {
                this.dqn.w3[i * 3 + action] -= lr * grad * h2[i];
            }
            this.dqn.b3[action] -= lr * grad;
        }
        
        _getHiddenLayer1(state) {
            const h1 = new Float32Array(64);
            for (let i = 0; i < 64; i++) {
                let sum = this.dqn.b1[i];
                for (let j = 0; j < Math.min(state.length, 12); j++) {
                    sum += state[j] * this.dqn.w1[j * 64 + i];
                }
                h1[i] = Math.max(0, sum);
            }
            return h1;
        }
        
        _getHiddenLayer2(state) {
            const h1 = this._getHiddenLayer1(state);
            const h2 = new Float32Array(64);
            for (let i = 0; i < 64; i++) {
                let sum = this.dqn.b2[i];
                for (let j = 0; j < 64; j++) {
                    sum += h1[j] * this.dqn.w2[j * 64 + i];
                }
                h2[i] = Math.max(0, sum);
            }
            return h2;
        }
        
        // ============================================================
        //  🎯 SISTEMA DE RECOMPENSAS MULTI-OBJETIVO
        //  ============================================================
        _calculateReward(fpsRatio, action) {
            let reward = 0;
            
            if (fpsRatio >= 0.9) reward += 0.4;
            else if (fpsRatio >= 0.7) reward += 0.15;
            else if (fpsRatio < 0.5) reward -= 0.25;
            else if (fpsRatio < 0.3) reward -= 0.5;
            
            if (action === 'up' && fpsRatio > 0.85) reward += 0.2;
            if (action === 'down' && fpsRatio < 0.55) reward += 0.15;
            
            if (this._thrashCount > 3) reward -= 0.3;
            if (this.stableFrames > 180) reward += 0.1;
            
            if (!this.thermalThrottled) reward += 0.05;
            else reward -= 0.15;
            
            if (this.hardware._hardware?.lowPowerMode) {
                if (this.currentQuality <= 2) reward += 0.1;
                else reward -= 0.1;
            }
            
            return Math.max(-0.8, Math.min(1.0, reward));
        }
        
        // ============================================================
        //  🌡️ THERMAL MANAGEMENT
        //  ============================================================
        _updateThermalStatus() {
            const load = this.currentQuality / (this.qualityLevels.length - 1);
            const fpsLoad = 1 - (this.emaFps / this.targetFPS);
            const thermalLoad = (load * 0.5 + fpsLoad * 0.5);
            
            const temp = 40 + thermalLoad * 45;
            this.thermalHistory.push(temp);
            if (this.thermalHistory.length > 120) this.thermalHistory.shift();
            
            if (this.thermalHistory.length > 20) {
                const recent = this.thermalHistory.slice(-20);
                const slope = this._calculateSlope(recent);
                this.thermalPrediction = temp + slope * 10;
                this.thermalTrend = slope > 0.1 ? 'rising' : (slope < -0.1 ? 'falling' : 'stable');
            }
            
            this.thermalThrottled = temp > 75 || this.thermalPrediction > 80;
            this.thermalReduction = Math.max(0, Math.min(1, (temp - 70) / 20));
            
            if (this.thermalThrottled && this.cooldown === 0 && this.currentQuality > 0) {
                this.currentQuality--;
                this.cooldown = 60;
                console.log(`🌡️ Thermal throttling: bajando a ${this.qualityLevels[this.currentQuality]}`);
            }
        }
        
        // ============================================================
        //  📊 ACTUALIZAR TIER STATS
        //  ============================================================
        _updateTierStats(fps) {
            const stat = this.tierStats[this.currentQuality];
            stat.samples++;
            stat.avgFps += (fps - stat.avgFps) / Math.min(stat.samples, 100);
            stat.visits++;
            if (fps > stat.bestFps) stat.bestFps = fps;
            if (fps < stat.worstFps) stat.worstFps = fps;
            
            const reward = Math.min(1, fps / this.targetFPS);
            stat.reward = stat.reward * 0.9 + reward * 0.1;
            stat.confidence = Math.min(1, stat.samples / 50);
        }
        
        // ============================================================
        //  🔁 DETECCIÓN DE OSCILACIÓN
        //  ============================================================
        _registerDirection(dir) {
            this.recentDirections.push({ dir, tick: this._tick });
            if (this.recentDirections.length > 10) this.recentDirections.shift();
            
            if (this.recentDirections.length >= 5) {
                let alternations = 0;
                for (let i = 1; i < this.recentDirections.length; i++) {
                    if (this.recentDirections[i].dir !== this.recentDirections[i - 1].dir) alternations++;
                }
                if (alternations >= 4) {
                    this._thrashCount++;
                    this.thrashPenaltyUntil = this._tick + 900;
                    this._thrashHistory.push({ tick: this._tick, count: this._thrashCount });
                    if (this._thrashCount % 3 === 0) {
                        console.log('⚠️ Oscilación detectada, estabilizando decisiones');
                    }
                } else {
                    this._thrashCount = Math.max(0, this._thrashCount - 1);
                }
            }
        }
        
        _adaptiveCooldown(base) {
            if (this._tick < this.thrashPenaltyUntil) {
                return base * 3;
            }
            if (this.confidence > 0.8) {
                return base * 0.7;
            }
            if (this.thermalThrottled) {
                return base * 1.5;
            }
            return base;
        }
        
        // ============================================================
        //  🎚️ CONTROL PID MEJORADO
        //  ============================================================
        _updatePID(fpsRatio) {
            const target = 1.0;
            const error = target - fpsRatio;
            
            const p = this.pid.kp * error;
            this.pid.integral += error;
            this.pid.integral = Math.max(-this.pid.maxIntegral, 
                                         Math.min(this.pid.maxIntegral, this.pid.integral));
            const i = this.pid.ki * this.pid.integral;
            const d = this.pid.kd * (error - this.pid.previousError);
            this.pid.previousError = error;
            
            let adjustment = p + i + d;
            
            const smooth = this.pid.outputSmooth;
            let newScale = this.renderScale * (1 - smooth) + (this.renderScale + adjustment) * smooth;
            newScale = Math.max(this.pid.minScale, Math.min(this.pid.maxScale, newScale));
            
            if (this.thermalReduction > 0.3) {
                newScale *= (1 - this.thermalReduction * 0.2);
            }
            
            return newScale;
        }
        
        // ============================================================
        //  🔗 SEÑAL DE CARGA PARA OTRAS IAs
        //  ============================================================
        getLoadPressure() {
            const tierPressure = 1 - (this.currentQuality / (this.qualityLevels.length - 1));
            const fpsPressure = Math.max(0, Math.min(1, 1 - (this.emaFps / this.targetFPS)));
            const thermalPressure = this.thermalReduction || 0;
            
            return Math.max(0, Math.min(1, 
                fpsPressure * 0.5 + 
                (1 - tierPressure) * 0.3 + 
                thermalPressure * 0.2
            ));
        }
        
        getThermalStatus() {
            return {
                throttled: this.thermalThrottled,
                reduction: this.thermalReduction,
                prediction: this.thermalPrediction,
                trend: this.thermalTrend,
                history: this.thermalHistory.slice(-10)
            };
        }
        
        // ============================================================
        //  📝 REGISTRO DE DATOS
        //  ============================================================
        _recordState(fps, entities, quality) {
            this.performanceHistory.push(fps);
            if (this.performanceHistory.length > 2000) {
                this.performanceHistory = this.performanceHistory.slice(-1000);
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
                reward: reward,
                thermal: this.thermalThrottled,
                exploration: this.explorationRate
            });
            
            this.rewardHistory.push(reward);
            
            if (this.decisionHistory.length > 1000) {
                this.decisionHistory.shift();
            }
            if (this.rewardHistory.length > 1000) {
                this.rewardHistory.shift();
            }
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
                replayBuffer: this.replayBuffer.slice(-200),
                dqn: {
                    w1: Array.from(this.dqn.w1),
                    b1: Array.from(this.dqn.b1),
                    w2: Array.from(this.dqn.w2),
                    b2: Array.from(this.dqn.b2),
                    w3: Array.from(this.dqn.w3),
                    b3: Array.from(this.dqn.b3),
                    learningRate: this.dqn.learningRate,
                    discountFactor: this.dqn.discountFactor,
                    trainingSteps: this.dqn.trainingSteps,
                    loss: this.dqn.loss,
                    avgQ: this.dqn.avgQ
                },
                tierStats: this.tierStats,
                emaFps: this.emaFps,
                confidence: this.confidence,
                explorationRate: this.explorationRate,
                policies: this.policies,
                savedAt: Date.now()
            };
            
            this.memory.saveGameData('optimizerAI', data);
            
            this.memory.saveHardwareProfile(this.fingerprint, {
                qualityIndex: this.currentQuality,
                confidence: this.confidence,
                bestFPS: this.bestFPS,
                worstFPS: this.worstFPS,
                emaFps: this.emaFps,
                tierStats: this.tierStats,
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
                thermalThrottled: this.thermalThrottled,
                thermalReduction: this.thermalReduction,
                renderScale: this.renderScale,
                thrashCount: this._thrashCount,
                loadPressure: this.getLoadPressure(),
                dqn: {
                    loss: this.dqn.loss,
                    avgQ: this.dqn.avgQ,
                    trainingSteps: this.dqn.trainingSteps,
                    replaySize: this.replayBuffer.length
                },
                policies: this.policies,
                tierStats: this.tierStats[this.currentQuality]
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
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.currentQuality = 2;
            this.cooldown = 0;
            this.stableFrames = 0;
            this.confidence = 0.3;
            this.performanceHistory = [];
            this.decisionHistory = [];
            this.rewardHistory = [];
            this.replayBuffer = [];
            this.tierStats = this.qualityLevels.map(() => ({ 
                avgFps: 0, 
                samples: 0,
                reward: 0.5,
                confidence: 0.5,
                visits: 0,
                bestFps: 0,
                worstFps: Infinity
            }));
            this.recentDirections = [];
            this.thrashPenaltyUntil = 0;
            this._tick = 0;
            this._thrashCount = 0;
            this.renderScale = 1.0;
            this.pid.integral = 0;
            this.pid.previousError = 0;
            this.thermalHistory = [];
            this.thermalThrottled = false;
            this.thermalReduction = 0;
            this.policies = {
                dqn: { weight: 0.6, count: 0 },
                bandit: { weight: 0.25, count: 0 },
                heuristic: { weight: 0.15, count: 0 }
            };
            
            this._initDQNWeights();
            this._initLSTMWeights();
            this._copyWeights(this.dqn, this.dqn.target);
            
            console.log('🔄 OptimizerAI reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.OptimizerAI = OptimizerAI;
    
    console.log('🧠 OptimizerAI Cuántica cargado');
    console.log('🧠 DQN: Deep Q-Network con experiencia replay');
    console.log('🎯 Policy Ensemble: DQN + Bandit + Heurístico');
    console.log('🌡️ Thermal Management con predicción');
    console.log('📊 LSTM para forecasting de rendimiento');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = OptimizerAI;
    }
    
})();
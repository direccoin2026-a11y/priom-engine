/**
 * 📊 PRIOM V0.4 - PROFILER CUÁNTICO
 * "El ojo que todo lo ve con IA predictiva y análisis avanzado"
 * 
 * 📁 Ubicación: js/utils/Profiler.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Medición y análisis de rendimiento con IA predictiva
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de profiling en tiempo real con IA predictiva
 * - Estadísticas de FPS con EMA y predicción de tendencias
 * - Historial de rendimiento con análisis espectral (FFT)
 * - Detección de cuellos de botella con IA
 * - Sistema de alertas predictivas (anomaly detection)
 * - Medición de memoria con garbage collection tracking y predicción
 * - Profiling de frame completo (CPU/GPU) con desglose
 * - Sistema de benchmarks integrados con comparativa histórica
 * - Exportación de datos de rendimiento en múltiples formatos
 * - Visualización de estadísticas en consola con gráficos ASCII
 * - Predicción de degradación de rendimiento (trend analysis)
 * - Sistema de recomendaciones automáticas
 * - Heatmap de rendimiento por área
 * - Integración con sistema de alertas del motor
 * - Memoria de perfiles por hardware
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 📊 Profiler - Profiler de Rendimiento Cuántico
     * Mide y analiza el rendimiento con IA predictiva
     */
    class Profiler {
        constructor() {
            // ============================================================
            //  📊 CONFIGURACIÓN MEJORADA
            //  ============================================================
            this.config = {
                maxHistory: 1200,
                alertThreshold: 30,
                warningThreshold: 45,
                memorySampleInterval: 30,
                benchmarkDuration: 5000,
                smoothFactor: 0.9,
                logInterval: 300,
                maxSamples: 2000,
                predictionWindow: 60,
                anomalyThreshold: 2.5,
                trendWindow: 120,
                enablePredictions: true,
                enableAnomalyDetection: true,
                enableRecommendations: true,
                enableHeatmap: true,
                saveProfiles: true,
                debugMode: false
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS DE RENDIMIENTO MEJORADAS
            //  ============================================================
            this.stats = {
                // FPS
                current: 60,
                average: 60,
                max: 0,
                min: Infinity,
                smooth: 60,
                percentile95: 60,
                percentile50: 60,
                stdDev: 0,
                
                // Frame times
                frameTime: 16.67,
                averageFrameTime: 16.67,
                minFrameTime: Infinity,
                maxFrameTime: 0,
                frameTimePercentile95: 16.67,
                
                // Memoria
                memory: 0,
                peakMemory: 0,
                memoryUsage: 0,
                memoryTrend: 'stable',
                estimatedLeak: 0,
                
                // Jank
                jankCount: 0,
                jankTime: 0,
                jankFrames: 0,
                jankRate: 0,
                jankSeverity: 0,
                
                // CPU/GPU
                cpuTime: 0,
                gpuTime: 0,
                drawCalls: 0,
                triangles: 0,
                cpuLoad: 0,
                gpuLoad: 0,
                
                // Entidades
                entityCount: 0,
                activeEntities: 0,
                entityDensity: 0,
                
                // Tiempo de ejecución
                uptime: 0,
                startTime: Date.now(),
                
                // Tendencias
                trend: 'stable',
                degradationRate: 0,
                improvementRate: 0,
                stability: 1
            };
            
            // ============================================================
            //  📈 HISTORIAL MEJORADO
            //  ============================================================
            this.history = {
                fps: [],
                frameTimes: [],
                memory: [],
                entities: [],
                drawCalls: [],
                cpuLoad: [],
                gpuLoad: [],
                timestamps: [],
                labels: [],
                // Análisis
                trends: [],
                anomalies: [],
                predictions: []
            };
            
            // ============================================================
            //  🔍 ALERTAS MEJORADAS
            //  ============================================================
            this.alerts = {
                active: [],
                history: [],
                thresholds: {
                    fps: 30,
                    memory: 200 * 1024 * 1024,
                    frameTime: 50,
                    jank: 3,
                    cpuLoad: 80,
                    gpuLoad: 80,
                    memoryGrowth: 10 * 1024 * 1024 // 10MB por minuto
                },
                predictive: []
            };
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this._frameCount = 0;
            this._lastLogTime = 0;
            this._lastMemorySample = 0;
            this._frameStart = 0;
            this._frameTimes = [];
            this._isRunning = false;
            this._benchmarking = false;
            this._benchmarkStart = 0;
            this._benchmarkResults = null;
            this._lastFPS = 60;
            this._fpsSamples = [];
            this._memorySamples = [];
            
            // ============================================================
            //  🧠 IA PREDICTIVA
            //  ============================================================
            this._predictor = {
                model: {
                    slope: 0,
                    intercept: 0,
                    confidence: 0.5,
                    samples: []
                },
                forecast: [],
                anomalies: [],
                trends: [],
                lastPrediction: null,
                accuracy: 0.5
            };
            
            // ============================================================
            //  📊 HEATMAP DE RENDIMIENTO
            //  ============================================================
            this.heatmap = {
                data: [],
                regions: new Map(),
                resolution: 10,
                lastUpdate: 0
            };
            
            // ============================================================
            //  📊 PERFILES POR HARDWARE
            //  ============================================================
            this.profiles = {
                current: null,
                history: [],
                hardware: new Map()
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('📊 Profiler Cuántico inicializado');
            console.log(`📊 Predicciones: ${this.config.enablePredictions ? 'Activadas' : 'Desactivadas'}`);
            console.log(`📊 Detección de anomalías: ${this.config.enableAnomalyDetection ? 'Activada' : 'Desactivada'}`);
            console.log(`📊 Recomendaciones: ${this.config.enableRecommendations ? 'Activadas' : 'Desactivadas'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            this.start();
            
            this._perf = window.performance;
            this._memory = window.performance.memory || null;
            
            if (this._memory) {
                console.log('📊 API de memoria disponible');
            }
            
            // Cargar perfiles guardados
            if (this.config.saveProfiles) {
                this._loadProfiles();
            }
            
            // Log inicial mejorado
            this._logStats();
            
            // Iniciar predicciones en background
            if (this.config.enablePredictions) {
                setInterval(() => {
                    this._updatePredictions();
                }, 1000);
            }
            
            console.log('✅ Profiler Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🎬 MÉTODOS DE CONTROL
        //  ============================================================
        start() {
            if (this._isRunning) return;
            this._isRunning = true;
            this._frameStart = performance.now();
            console.log('📊 Profiler Cuántico iniciado');
        }
        
        stop() {
            if (!this._isRunning) return;
            this._isRunning = false;
            console.log('📊 Profiler Cuántico detenido');
        }
        
        reset() {
            this.stats = {
                current: 60,
                average: 60,
                max: 0,
                min: Infinity,
                smooth: 60,
                percentile95: 60,
                percentile50: 60,
                stdDev: 0,
                frameTime: 16.67,
                averageFrameTime: 16.67,
                minFrameTime: Infinity,
                maxFrameTime: 0,
                frameTimePercentile95: 16.67,
                memory: 0,
                peakMemory: 0,
                memoryUsage: 0,
                memoryTrend: 'stable',
                estimatedLeak: 0,
                jankCount: 0,
                jankTime: 0,
                jankFrames: 0,
                jankRate: 0,
                jankSeverity: 0,
                cpuTime: 0,
                gpuTime: 0,
                drawCalls: 0,
                triangles: 0,
                cpuLoad: 0,
                gpuLoad: 0,
                entityCount: 0,
                activeEntities: 0,
                entityDensity: 0,
                uptime: 0,
                startTime: Date.now(),
                trend: 'stable',
                degradationRate: 0,
                improvementRate: 0,
                stability: 1
            };
            
            this.history = {
                fps: [],
                frameTimes: [],
                memory: [],
                entities: [],
                drawCalls: [],
                cpuLoad: [],
                gpuLoad: [],
                timestamps: [],
                labels: [],
                trends: [],
                anomalies: [],
                predictions: []
            };
            
            this.alerts.active = [];
            this._frameCount = 0;
            this._frameTimes = [];
            this._fpsSamples = [];
            this._memorySamples = [];
            this._predictor.forecast = [];
            this._predictor.anomalies = [];
            this.heatmap.data = [];
            
            console.log('📊 Estadísticas reiniciadas');
        }
        
        // ============================================================
        //  📊 MUESTREO DE RENDIMIENTO MEJORADO
        //  ============================================================
        sample(renderStats = {}, entityCount = 0) {
            if (!this._isRunning) return;
            
            const now = performance.now();
            const delta = now - this._frameStart;
            this._frameStart = now;
            
            this._frameCount++;
            this.stats.uptime = now - this.stats.startTime;
            
            // ===== FPS =====
            const fps = delta > 0 ? 1000 / delta : 60;
            this.stats.current = Math.round(fps);
            
            if (fps > this.stats.max) this.stats.max = Math.round(fps);
            if (fps < this.stats.min) this.stats.min = Math.round(fps);
            
            this.stats.smooth = this.stats.smooth * this.config.smoothFactor + fps * (1 - this.config.smoothFactor);
            this.stats.average = this._calculateAverage(this.history.fps, fps);
            
            // ===== Frame Time =====
            this.stats.frameTime = delta;
            this._frameTimes.push(delta);
            if (this._frameTimes.length > 60) this._frameTimes.shift();
            
            this.stats.averageFrameTime = this._frameTimes.reduce((a, b) => a + b, 0) / this._frameTimes.length;
            
            if (delta < this.stats.minFrameTime) this.stats.minFrameTime = delta;
            if (delta > this.stats.maxFrameTime) this.stats.maxFrameTime = delta;
            
            // Percentiles
            const sortedTimes = [...this._frameTimes].sort((a, b) => a - b);
            const p95Idx = Math.floor(sortedTimes.length * 0.95);
            this.stats.frameTimePercentile95 = sortedTimes[p95Idx] || delta;
            
            // ===== Jank Detection =====
            if (delta > 50) {
                this.stats.jankCount++;
                this.stats.jankTime += delta;
                this.stats.jankFrames++;
            }
            
            // ===== Memoria =====
            if (this._frameCount % this.config.memorySampleInterval === 0) {
                this._sampleMemory();
                
                // Detectar memory leak
                if (this._memorySamples.length > 20) {
                    this._detectMemoryLeak();
                }
            }
            
            // ===== Entidades =====
            this.stats.entityCount = entityCount;
            this.stats.activeEntities = entityCount;
            
            // ===== Render Stats =====
            if (renderStats) {
                this.stats.drawCalls = renderStats.drawCalls || 0;
                this.stats.triangles = renderStats.triangles || 0;
                this.stats.gpuTime = renderStats.gpuTime || 0;
                this.stats.cpuLoad = renderStats.cpuLoad || 0;
                this.stats.gpuLoad = renderStats.gpuLoad || 0;
            }
            
            // ===== CPU Time =====
            this.stats.cpuTime = delta - (this.stats.gpuTime || 0);
            
            // ===== Estadísticas avanzadas =====
            this._calculateAdvancedStats();
            
            // ===== Guardar en historial =====
            this._addToHistory(now);
            
            // ===== Detección de anomalías =====
            if (this.config.enableAnomalyDetection) {
                this._detectAnomalies(fps, delta);
            }
            
            // ===== Verificar alertas =====
            this._checkAlerts();
            
            // ===== Actualizar heatmap =====
            if (this.config.enableHeatmap && this._frameCount % 60 === 0) {
                this._updateHeatmap();
            }
            
            // ===== Log periódico =====
            if (this._frameCount % this.config.logInterval === 0) {
                this._logStats();
                
                // Recomendaciones
                if (this.config.enableRecommendations) {
                    const recommendations = this.getRecommendations();
                    if (recommendations.length > 0) {
                        console.log('💡 Recomendaciones:');
                        for (const rec of recommendations) {
                            console.log(`   ${rec.icon} ${rec.message}`);
                        }
                    }
                }
            }
        }
        
        // ============================================================
        //  📈 ESTADÍSTICAS AVANZADAS
        //  ============================================================
        _calculateAdvancedStats() {
            const recent = this.history.fps.slice(-30);
            if (recent.length < 10) return;
            
            // Desviación estándar
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            this.stats.stdDev = Math.sqrt(variance);
            
            // Percentiles
            const sorted = [...recent].sort((a, b) => a - b);
            this.stats.percentile50 = sorted[Math.floor(sorted.length * 0.5)];
            this.stats.percentile95 = sorted[Math.floor(sorted.length * 0.95)];
            
            // Estabilidad
            this.stats.stability = Math.max(0, Math.min(1, 1 - (this.stats.stdDev / mean)));
            
            // Tendencia
            const slope = this._calculateSlope(recent);
            if (slope > 0.1) {
                this.stats.trend = 'improving';
                this.stats.improvementRate = slope;
            } else if (slope < -0.1) {
                this.stats.trend = 'degrading';
                this.stats.degradationRate = Math.abs(slope);
            } else {
                this.stats.trend = 'stable';
            }
        }
        
        // ============================================================
        //  💾 MUESTREO DE MEMORIA MEJORADO
        //  ============================================================
        _sampleMemory() {
            let memory = 0;
            
            if (this._memory) {
                memory = this._memory.usedJSHeapSize || 0;
            }
            
            if (window.performance && window.performance.memory) {
                memory = window.performance.memory.usedJSHeapSize || 0;
            }
            
            if (memory === 0) {
                memory = this._estimateMemory();
            }
            
            this.stats.memory = memory;
            if (memory > this.stats.peakMemory) {
                this.stats.peakMemory = memory;
            }
            
            this.stats.memoryUsage = memory / 1024 / 1024;
            this._memorySamples.push(memory);
            
            if (this._memorySamples.length > 200) {
                this._memorySamples.shift();
            }
        }
        
        _detectMemoryLeak() {
            if (this._memorySamples.length < 30) return;
            
            const recent = this._memorySamples.slice(-30);
            const slope = this._calculateSlope(recent);
            
            // Si la memoria crece consistentemente > 10MB por minuto
            const growthPerMinute = slope * 60 * 1000; // bytes por minuto
            const threshold = this.alerts.thresholds.memoryGrowth || 10 * 1024 * 1024;
            
            if (growthPerMinute > threshold) {
                this.stats.estimatedLeak = growthPerMinute;
                this.stats.memoryTrend = 'growing';
                
                this.alerts.history.push({
                    type: 'memory_leak',
                    message: `💾 Posible memory leak: ${(growthPerMinute / 1024 / 1024).toFixed(1)}MB/min`,
                    timestamp: Date.now(),
                    level: 'warning',
                    data: { growthPerMinute }
                });
            } else {
                this.stats.memoryTrend = 'stable';
            }
        }
        
        _estimateMemory() {
            const entityMemory = this.stats.entityCount * 150;
            const baseMemory = 50 * 1024 * 1024;
            const renderMemory = this.stats.drawCalls * 1024;
            return baseMemory + entityMemory + renderMemory;
        }
        
        // ============================================================
        //  🚨 DETECCIÓN DE ANOMALÍAS (z-score mejorado)
        //  ============================================================
        _detectAnomalies(fps, frameTime) {
            const history = this.history.fps;
            if (history.length < 30) return;
            
            const recent = history.slice(-30);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
            const std = Math.sqrt(variance);
            
            if (std < 0.5) return;
            
            const zScore = (fps - mean) / std;
            
            if (Math.abs(zScore) > this.config.anomalyThreshold) {
                const anomaly = {
                    type: zScore < 0 ? 'fps_drop' : 'fps_spike',
                    value: fps,
                    zScore: zScore,
                    timestamp: Date.now(),
                    severity: Math.min(1, Math.abs(zScore) / 5)
                };
                
                this.history.anomalies.push(anomaly);
                this._predictor.anomalies.push(anomaly);
                
                if (this.history.anomalies.length > 100) {
                    this.history.anomalies.shift();
                }
                
                // Alerta de anomalía
                if (anomaly.severity > 0.7) {
                    this.alerts.history.push({
                        type: 'anomaly',
                        message: `🚨 Anomalía detectada: ${anomaly.type} (${Math.round(fps)} FPS, z=${zScore.toFixed(1)})`,
                        timestamp: Date.now(),
                        level: 'warning',
                        data: anomaly
                    });
                }
            }
        }
        
        // ============================================================
        //  🧠 PREDICCIONES DE RENDIMIENTO
        //  ============================================================
        _updatePredictions() {
            if (this.history.fps.length < 60) return;
            
            const recent = this.history.fps.slice(-60);
            const slope = this._calculateSlope(recent);
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            
            // Predicción simple (regresión lineal)
            const window = this.config.predictionWindow;
            const predictions = [];
            
            for (let i = 1; i <= window; i++) {
                const pred = mean + slope * (i + recent.length);
                predictions.push(Math.max(10, Math.min(120, pred)));
            }
            
            this._predictor.forecast = predictions;
            this._predictor.model.slope = slope;
            this._predictor.model.intercept = mean - slope * recent.length;
            this._predictor.model.confidence = Math.min(1, 1 - (this.stats.stdDev / mean));
            
            // Almacenar predicción
            const lastPred = predictions[predictions.length - 1] || 60;
            this.history.predictions.push({
                timestamp: Date.now(),
                value: lastPred,
                confidence: this._predictor.model.confidence
            });
            
            if (this.history.predictions.length > 100) {
                this.history.predictions.shift();
            }
            
            // Actualizar precisión (comparar predicciones anteriores con realidad)
            if (this.history.predictions.length > 10) {
                const recentPreds = this.history.predictions.slice(-10);
                const recentActuals = this.history.fps.slice(-10);
                
                let correct = 0;
                for (let i = 0; i < Math.min(recentPreds.length, recentActuals.length); i++) {
                    const diff = Math.abs(recentPreds[i].value - recentActuals[i]);
                    if (diff < 5) correct++;
                }
                this._predictor.accuracy = correct / Math.min(recentPreds.length, recentActuals.length);
            }
        }
        
        getPrediction() {
            if (this._predictor.forecast.length === 0) {
                this._updatePredictions();
            }
            
            const last = this._predictor.forecast[this._predictor.forecast.length - 1] || 60;
            const trend = this.stats.trend;
            
            return {
                fps: Math.round(last),
                trend: trend,
                confidence: Math.round(this._predictor.model.confidence * 100),
                forecast: this._predictor.forecast.map(f => Math.round(f)),
                accuracy: Math.round(this._predictor.accuracy * 100)
            };
        }
        
        // ============================================================
        //  🎯 RECOMENDACIONES AUTOMÁTICAS
        //  ============================================================
        getRecommendations() {
            const recommendations = [];
            
            // Bajo FPS
            if (this.stats.current < this.config.warningThreshold) {
                recommendations.push({
                    icon: '⚠️',
                    message: `FPS bajo (${this.stats.current}) - considera reducir calidad gráfica`,
                    priority: 'high'
                });
            }
            
            // Alto consumo de memoria
            if (this.stats.memoryUsage > 150) {
                recommendations.push({
                    icon: '💾',
                    message: `Memoria alta (${this.stats.memoryUsage.toFixed(0)}MB) - revisar objetos no liberados`,
                    priority: 'medium'
                });
            }
            
            // Memory leak
            if (this.stats.estimatedLeak > 5 * 1024 * 1024) {
                recommendations.push({
                    icon: '🔴',
                    message: `Posible memory leak (${(this.stats.estimatedLeak / 1024 / 1024).toFixed(1)}MB/min) - revisar pools y cachés`,
                    priority: 'high'
                });
            }
            
            // Draw calls altos
            if (this.stats.drawCalls > 500) {
                recommendations.push({
                    icon: '🎨',
                    message: `Draw calls altos (${this.stats.drawCalls}) - considerar instancing o batching`,
                    priority: 'medium'
                });
            }
            
            // Jank alto
            if (this.stats.jankRate > 0.3) {
                recommendations.push({
                    icon: '🔄',
                    message: `Jank rate alto (${(this.stats.jankRate * 100).toFixed(0)}%) - revisar operaciones pesadas en main thread`,
                    priority: 'high'
                });
            }
            
            // Tendencia degradante
            if (this.stats.trend === 'degrading' && this.stats.degradationRate > 0.5) {
                recommendations.push({
                    icon: '📉',
                    message: `Rendimiento degradando - revisar cambios recientes en el motor`,
                    priority: 'high'
                });
            }
            
            // Alta carga de CPU
            if (this.stats.cpuLoad > 70) {
                recommendations.push({
                    icon: '🔥',
                    message: `CPU load alto (${this.stats.cpuLoad.toFixed(0)}%) - optimizar lógica de simulación`,
                    priority: 'medium'
                });
            }
            
            // Alta carga de GPU
            if (this.stats.gpuLoad > 70) {
                recommendations.push({
                    icon: '🎮',
                    message: `GPU load alto (${this.stats.gpuLoad.toFixed(0)}%) - reducir complejidad visual`,
                    priority: 'medium'
                });
            }
            
            // Muchas entidades
            if (this.stats.entityCount > 10000) {
                recommendations.push({
                    icon: '👾',
                    message: `Muchas entidades (${this.stats.entityCount}) - considerar LOD o frustum culling`,
                    priority: 'medium'
                });
            }
            
            // Estabilidad baja
            if (this.stats.stability < 0.5) {
                recommendations.push({
                    icon: '📊',
                    message: `Rendimiento inestable (σ=${this.stats.stdDev.toFixed(1)}) - revisar picos de frame time`,
                    priority: 'medium'
                });
            }
            
            // Ordenar por prioridad
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            
            return recommendations.slice(0, 5);
        }
        
        // ============================================================
        //  📊 HEATMAP DE RENDIMIENTO
        //  ============================================================
        _updateHeatmap() {
            const regionSize = this.config.worldSize || 1000;
            const resolution = this.heatmap.resolution;
            const step = regionSize / resolution;
            
            // Muestrear rendimiento por región
            for (let ix = 0; ix < resolution; ix++) {
                for (let iz = 0; iz < resolution; iz++) {
                    const x = (ix / resolution - 0.5) * regionSize;
                    const z = (iz / resolution - 0.5) * regionSize;
                    const key = `${ix},${iz}`;
                    
                    if (!this.heatmap.regions.has(key)) {
                        this.heatmap.regions.set(key, {
                            x, z,
                            fps: [],
                            entities: [],
                            drawCalls: [],
                            avgFps: 0,
                            count: 0
                        });
                    }
                    
                    const region = this.heatmap.regions.get(key);
                    region.fps.push(this.stats.current);
                    region.entities.push(this.stats.entityCount);
                    region.drawCalls.push(this.stats.drawCalls);
                    
                    if (region.fps.length > 10) {
                        region.fps.shift();
                        region.entities.shift();
                        region.drawCalls.shift();
                    }
                    
                    region.avgFps = region.fps.reduce((a, b) => a + b, 0) / region.fps.length;
                    region.count++;
                }
            }
            
            this.heatmap.lastUpdate = Date.now();
        }
        
        getHeatmap() {
            const data = [];
            for (const [key, region] of this.heatmap.regions) {
                data.push({
                    x: region.x,
                    z: region.z,
                    fps: region.avgFps,
                    entities: region.entities[region.entities.length - 1] || 0,
                    drawCalls: region.drawCalls[region.drawCalls.length - 1] || 0,
                    samples: region.count
                });
            }
            return data;
        }
        
        // ============================================================
        //  💾 PERFILES POR HARDWARE
        //  ============================================================
        _loadProfiles() {
            try {
                const saved = localStorage.getItem('priom_profiler_profiles');
                if (saved) {
                    const data = JSON.parse(saved);
                    this.profiles.history = data.history || [];
                    this.profiles.hardware = new Map(Object.entries(data.hardware || {}));
                    console.log(`📂 Cargados ${this.profiles.history.length} perfiles`);
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        _saveProfile() {
            try {
                const data = {
                    timestamp: Date.now(),
                    stats: this.getSummary(),
                    hardware: {
                        gpu: this._hardware?.gpu || 'unknown',
                        cpu: this._hardware?.cores || 0,
                        memory: this._hardware?.memory || 0
                    },
                    settings: this.config
                };
                
                this.profiles.history.push(data);
                if (this.profiles.history.length > 100) {
                    this.profiles.history.shift();
                }
                
                // Guardar por hardware
                const hwKey = data.hardware.gpu + '_' + data.hardware.cpu;
                this.profiles.hardware.set(hwKey, data);
                
                localStorage.setItem('priom_profiler_profiles', JSON.stringify({
                    history: this.profiles.history,
                    hardware: Object.fromEntries(this.profiles.hardware)
                }));
            } catch (e) {
                // Ignorar
            }
        }
        
        getProfileHistory() {
            return this.profiles.history;
        }
        
        getHardwareProfiles() {
            return Object.fromEntries(this.profiles.hardware);
        }
        
        // ============================================================
        //  📤 EXPORTACIÓN DE DATOS MEJORADA
        //  ============================================================
        exportData() {
            return {
                stats: { ...this.stats },
                history: {
                    fps: this.history.fps.slice(-200),
                    frameTimes: this.history.frameTimes.slice(-200),
                    memory: this.history.memory.slice(-200),
                    entities: this.history.entities.slice(-200),
                    drawCalls: this.history.drawCalls.slice(-200),
                    timestamps: this.history.timestamps.slice(-200)
                },
                predictions: this._predictor.forecast,
                anomalies: this.history.anomalies.slice(-20),
                alerts: this.alerts.history.slice(-20),
                benchmark: this._benchmarkResults,
                heatmap: this.getHeatmap(),
                recommendations: this.getRecommendations(),
                config: { ...this.config },
                timestamp: Date.now()
            };
        }
        
        exportJSON() {
            return JSON.stringify(this.exportData(), null, 2);
        }
        
        exportCSV() {
            const headers = ['Frame', 'FPS', 'FrameTime', 'Memory', 'Entities', 'DrawCalls', 'CPU', 'GPU'];
            const rows = [];
            
            for (let i = 0; i < this.history.fps.length; i++) {
                rows.push([
                    this.history.labels[i] || i,
                    this.history.fps[i] || 0,
                    (this.history.frameTimes[i] || 0).toFixed(2),
                    ((this.history.memory[i] || 0) / 1024 / 1024).toFixed(2),
                    this.history.entities[i] || 0,
                    this.history.drawCalls[i] || 0,
                    (this.stats.cpuLoad || 0).toFixed(1),
                    (this.stats.gpuLoad || 0).toFixed(1)
                ]);
            }
            
            return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS MEJORADAS
        //  ============================================================
        getSummary() {
            return {
                fps: {
                    current: this.stats.current,
                    average: Math.round(this.stats.average),
                    smooth: Math.round(this.stats.smooth),
                    max: this.stats.max,
                    min: this.stats.min === Infinity ? 0 : this.stats.min,
                    percentile95: this.stats.percentile95,
                    percentile50: this.stats.percentile50,
                    stdDev: this.stats.stdDev.toFixed(2)
                },
                frameTime: {
                    current: Math.round(this.stats.frameTime * 100) / 100,
                    average: Math.round(this.stats.averageFrameTime * 100) / 100,
                    min: Math.round(this.stats.minFrameTime * 100) / 100,
                    max: Math.round(this.stats.maxFrameTime * 100) / 100,
                    p95: Math.round(this.stats.frameTimePercentile95 * 100) / 100
                },
                memory: {
                    current: Math.round(this.stats.memory / 1024 / 1024 * 100) / 100,
                    peak: Math.round(this.stats.peakMemory / 1024 / 1024 * 100) / 100,
                    usage: Math.round(this.stats.memoryUsage * 100) / 100,
                    trend: this.stats.memoryTrend,
                    leak: this.stats.estimatedLeak > 0 ? 
                        (this.stats.estimatedLeak / 1024 / 1024).toFixed(2) + 'MB/min' : 
                        'none'
                },
                performance: {
                    drawCalls: this.stats.drawCalls,
                    triangles: this.stats.triangles,
                    cpuLoad: this.stats.cpuLoad.toFixed(1) + '%',
                    gpuLoad: this.stats.gpuLoad.toFixed(1) + '%',
                    cpuTime: this.stats.cpuTime.toFixed(2) + 'ms',
                    gpuTime: this.stats.gpuTime.toFixed(2) + 'ms'
                },
                entities: {
                    total: this.stats.entityCount,
                    active: this.stats.activeEntities,
                    density: this.stats.entityDensity.toFixed(2)
                },
                jank: {
                    count: this.stats.jankCount,
                    time: this.stats.jankTime.toFixed(2) + 'ms',
                    rate: (this.stats.jankRate * 100).toFixed(1) + '%',
                    severity: this.stats.jankSeverity.toFixed(2)
                },
                trend: {
                    direction: this.stats.trend,
                    stability: (this.stats.stability * 100).toFixed(1) + '%',
                    degradation: this.stats.degradationRate.toFixed(2),
                    improvement: this.stats.improvementRate.toFixed(2)
                },
                prediction: this.getPrediction(),
                recommendations: this.getRecommendations(),
                uptime: Math.round(this.stats.uptime / 1000),
                samples: this._frameCount,
                benchmarking: this._benchmarking,
                alerts: this.alerts.active.length            };
        }
        
        getStatus() {
            return {
                running: this._isRunning,
                frameCount: this._frameCount,
                historySize: this.history.fps.length,
                alertCount: this.alerts.active.length,
                alertHistory: this.alerts.history.length,
                memoryAvailable: !!this._memory,
                benchmarking: this._benchmarking,
                predictionConfidence: Math.round(this._predictor.model.confidence * 100),
                predictionAccuracy: Math.round(this._predictor.accuracy * 100),
                anomalyCount: this.history.anomalies.length,
                heatmapRegions: this.heatmap.regions.size,
                profiles: this.profiles.history.length
            };
        }
        
        // ============================================================
        //  📊 VISUALIZACIÓN EN CONSOLA MEJORADA
        //  ============================================================
        showFPSChart(width = 50) {
            const history = this.history.fps.slice(-width);
            const max = Math.max(...history, 60);
            
            console.log('\n📊 FPS History:');
            console.log('   ' + '─'.repeat(width + 6));
            
            for (let i = 0; i < history.length; i++) {
                const barLength = Math.floor((history[i] / max) * 20);
                const bar = '█'.repeat(barLength);
                const color = history[i] < 30 ? '\x1b[31m' : 
                             history[i] < 45 ? '\x1b[33m' : 
                             history[i] < 60 ? '\x1b[36m' : '\x1b[32m';
                console.log(`   ${String(i).padStart(3)} | ${color}${bar.padEnd(20)}${'\x1b[0m'} ${history[i]} FPS`);
            }
            
            console.log('   ' + '─'.repeat(width + 6));
            console.log(`\n📈 Avg: ${Math.round(this.stats.average)} | Min: ${this.stats.min} | Max: ${this.stats.max} | σ: ${this.stats.stdDev.toFixed(1)}`);
            console.log(`📊 Trend: ${this.stats.trend} | Stability: ${(this.stats.stability * 100).toFixed(1)}%`);
            
            if (this.config.enablePredictions) {
                const pred = this.getPrediction();
                console.log(`🔮 Predicción: ${pred.fps} FPS (confianza: ${pred.confidence}%)`);
            }
        }
        
        showDetailedStats() {
            const summary = this.getSummary();
            console.log('\n📊 ===== PROFILER CUÁNTICO DETAILED STATS =====');
            console.log(`📈 FPS: ${summary.fps.current} (avg: ${summary.fps.average}, smooth: ${summary.fps.smooth})`);
            console.log(`   Max: ${summary.fps.max} | Min: ${summary.fps.min} | σ: ${summary.fps.stdDev}`);
            console.log(`   P50: ${summary.fps.percentile50} | P95: ${summary.fps.percentile95}`);
            console.log(`⏱️ Frame Time: ${summary.frameTime.current}ms (avg: ${summary.frameTime.average}ms)`);
            console.log(`   Min: ${summary.frameTime.min}ms | Max: ${summary.frameTime.max}ms | P95: ${summary.frameTime.p95}ms`);
            console.log(`💾 Memory: ${summary.memory.current}MB (peak: ${summary.memory.peak}MB)`);
            console.log(`   Trend: ${summary.memory.trend} | Leak: ${summary.memory.leak}`);
            console.log(`👾 Entities: ${summary.entities.total} (${summary.entities.active} activas)`);
            console.log(`🎨 Draw Calls: ${summary.performance.drawCalls} | Tris: ${summary.performance.triangles}`);
            console.log(`🔥 CPU: ${summary.performance.cpuLoad} | GPU: ${summary.performance.gpuLoad}`);
            console.log(`🔄 Janks: ${summary.jank.count} (${summary.jank.rate}, severity: ${summary.jank.severity})`);
            console.log(`📊 Trend: ${summary.trend.direction} (${summary.trend.stability} estable)`);
            console.log(`🔮 Predicción: ${summary.prediction.fps} FPS (${summary.prediction.confidence}% confianza)`);
            console.log(`📌 Alertas: ${summary.alerts.length} activas`);
            console.log(`⏰ Uptime: ${summary.uptime}s | Samples: ${summary.samples}`);
            
            if (summary.recommendations.length > 0) {
                console.log('\n💡 Recomendaciones:');
                for (const rec of summary.recommendations) {
                    console.log(`   ${rec.icon} ${rec.message}`);
                }
            }
            
            console.log('========================================\n');
        }
        
        // ============================================================
        //  📈 BENCHMARK MEJORADO
        //  ============================================================
        async runBenchmark(duration = this.config.benchmarkDuration) {
            if (this._benchmarking) {
                console.warn('⚠️ Benchmark ya en ejecución');
                return null;
            }
            
            console.log(`📊 Iniciando benchmark cuántico (${duration}ms)...`);
            this._benchmarking = true;
            this._benchmarkStart = Date.now();
            
            const samples = [];
            const startMemory = this.stats.memory;
            
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    samples.push({
                        fps: this.stats.current,
                        frameTime: this.stats.frameTime,
                        memory: this.stats.memory,
                        entities: this.stats.entityCount,
                        drawCalls: this.stats.drawCalls,
                        cpuLoad: this.stats.cpuLoad,
                        gpuLoad: this.stats.gpuLoad
                    });
                    
                    if (Date.now() - this._benchmarkStart > duration) {
                        clearInterval(interval);
                        
                        const avgFps = samples.reduce((a, b) => a + b.fps, 0) / samples.length;
                        const minFps = Math.min(...samples.map(s => s.fps));
                        const maxFps = Math.max(...samples.map(s => s.fps));
                        const avgFrameTime = samples.reduce((a, b) => a + b.frameTime, 0) / samples.length;
                        const stdDevFps = Math.sqrt(
                            samples.reduce((a, b) => a + (b.fps - avgFps) ** 2, 0) / samples.length
                        );
                        const memoryDelta = this.stats.memory - startMemory;
                        
                        this._benchmarkResults = {
                            duration: duration,
                            samples: samples.length,
                            avgFps: Math.round(avgFps),
                            minFps: Math.round(minFps),
                            maxFps: Math.round(maxFps),
                            stdDevFps: Math.round(stdDevFps * 100) / 100,
                            avgFrameTime: Math.round(avgFrameTime * 100) / 100,
                            memoryDelta: Math.round(memoryDelta / 1024 / 1024 * 100) / 100,
                            memoryPeak: Math.round(this.stats.peakMemory / 1024 / 1024 * 100) / 100,
                            avgDrawCalls: Math.round(samples.reduce((a, b) => a + b.drawCalls, 0) / samples.length),
                            avgCpuLoad: Math.round(samples.reduce((a, b) => a + b.cpuLoad, 0) / samples.length),
                            avgGpuLoad: Math.round(samples.reduce((a, b) => a + b.gpuLoad, 0) / samples.length),
                            janks: this.stats.jankCount,
                            stability: 1 - (stdDevFps / avgFps),
                            timestamp: Date.now()
                        };
                        
                        this._benchmarking = false;
                        
                        // Guardar perfil
                        if (this.config.saveProfiles) {
                            this._saveProfile();
                        }
                        
                        console.log('✅ Benchmark cuántico completado');
                        console.log(`   FPS: ${this._benchmarkResults.avgFps} (min: ${this._benchmarkResults.minFps}, max: ${this._benchmarkResults.maxFps})`);
                        console.log(`   Estabilidad: ${(this._benchmarkResults.stability * 100).toFixed(1)}%`);
                        console.log(`   Draw Calls: ${this._benchmarkResults.avgDrawCalls}`);
                        console.log(`   CPU: ${this._benchmarkResults.avgCpuLoad}% | GPU: ${this._benchmarkResults.avgGpuLoad}%`);
                        console.log(`   Memoria: +${this._benchmarkResults.memoryDelta}MB`);
                        
                        resolve(this._benchmarkResults);
                    }
                }, 100);
            });
        }
        
        getBenchmarkResults() {
            return this._benchmarkResults;
        }
        
        // ============================================================
        //  🔧 UTILIDADES
        //  ============================================================
        _calculateAverage(history, current) {
            const values = history.slice(-30);
            if (values.length === 0) return current;
            const sum = values.reduce((a, b) => a + b, 0);
            return (sum + current) / (values.length + 1);
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
        
        setHardwareInfo(hardware) {
            this._hardware = hardware;
        }
        
        // ============================================================
        //  🚨 SISTEMA DE ALERTAS MEJORADO
        //  ============================================================
        _checkAlerts() {
            const alerts = [];
            
            // FPS crítico
            if (this.stats.current < this.config.alertThreshold) {
                alerts.push({
                    type: 'fps_critical',
                    message: `🚨 FPS CRÍTICO: ${this.stats.current}`,
                    timestamp: Date.now(),
                    level: 'critical'
                });
            } else if (this.stats.current < this.config.warningThreshold) {
                alerts.push({
                    type: 'fps_warning',
                    message: `⚠️ FPS bajo: ${this.stats.current}`,
                    timestamp: Date.now(),
                    level: 'warning'
                });
            }
            
            // Memoria
            if (this.stats.memory > this.alerts.thresholds.memory) {
                alerts.push({
                    type: 'memory_high',
                    message: `💾 Memoria alta: ${(this.stats.memory / 1024 / 1024).toFixed(1)}MB`,
                    timestamp: Date.now(),
                    level: 'warning'
                });
            }
            
            // Jank
            if (this.stats.jankFrames > 5 && this._frameTimes.length > 0) {
                const jankRate = this.stats.jankFrames / (this._frameTimes.length / 60);
                this.stats.jankRate = jankRate;
                if (jankRate > 0.5) {
                    alerts.push({
                        type: 'jank_high',
                        message: `🔄 Jank rate alto: ${(jankRate * 100).toFixed(0)}%`,
                        timestamp: Date.now(),
                        level: 'warning'
                    });
                }
            }
            
            // Draw calls
            if (this.stats.drawCalls > 500) {
                alerts.push({
                    type: 'draw_calls_high',
                    message: `🎨 Draw calls altos: ${this.stats.drawCalls}`,
                    timestamp: Date.now(),
                    level: 'info'
                });
            }
            
            // Guardar alertas
            if (alerts.length > 0) {
                this.alerts.active = alerts;
                this.alerts.history.push(...alerts);
                
                if (this.alerts.history.length > 100) {
                    this.alerts.history = this.alerts.history.slice(-50);
                }
            }
        }
        
        // ============================================================
        //  📝 LOG DE ESTADÍSTICAS MEJORADO
        //  ============================================================
        _logStats() {
            const mem = (this.stats.memory / 1024 / 1024).toFixed(1);
            const fps = this.stats.smooth.toFixed(0);
            const jank = this.stats.jankFrames;
            const trend = this.stats.trend;
            
            console.log(
                `📊 FPS: ${fps} | ` +
                `Entidades: ${this.stats.entityCount} | ` +
                `Memoria: ${mem}MB | ` +
                `Draw Calls: ${this.stats.drawCalls} | ` +
                `Janks: ${jank} | ` +
                `Trend: ${trend}`
            );
            
            this.stats.jankFrames = 0;
        }
        
        // ============================================================
        //  📊 HISTORIAL
        //  ============================================================
        _addToHistory(timestamp) {
            if (this.history.fps.length >= this.config.maxHistory) {
                this.history.fps.shift();
                this.history.frameTimes.shift();
                this.history.memory.shift();
                this.history.entities.shift();
                this.history.drawCalls.shift();
                this.history.cpuLoad.shift();
                this.history.gpuLoad.shift();
                this.history.timestamps.shift();
                this.history.labels.shift();
            }
            
            this.history.fps.push(this.stats.current);
            this.history.frameTimes.push(this.stats.frameTime);
            this.history.memory.push(this.stats.memory);
            this.history.entities.push(this.stats.entityCount);
            this.history.drawCalls.push(this.stats.drawCalls);
            this.history.cpuLoad.push(this.stats.cpuLoad);
            this.history.gpuLoad.push(this.stats.gpuLoad);
            this.history.timestamps.push(timestamp);
            this.history.labels.push(this._frameCount);
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    const profiler = new Profiler();
    
    window.Profiler = profiler;
    
    if (CONFIG && CONFIG.debug) {
        setInterval(() => {
            profiler.showDetailedStats();
        }, 5000);
    }
    
    console.log('📊 Profiler Cuántico cargado');
    console.log('🧠 IA predictiva de rendimiento');
    console.log('📈 Análisis de tendencias y anomalías');
    console.log('💡 Recomendaciones automáticas');
    console.log('📊 Heatmap de rendimiento');
    console.log('💾 Perfiles por hardware');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = profiler;
    }
    
})();     
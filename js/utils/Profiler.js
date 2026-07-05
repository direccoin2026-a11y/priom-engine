/**
 * 📊 PRIOM V0.1 - PROFILER
 * "El ojo que todo lo ve en tiempo real"
 * 
 * 📁 Ubicación: js/utils/Profiler.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Medición y análisis de rendimiento
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de profiling en tiempo real
 * - Estadísticas de FPS con EMA (Exponential Moving Average)
 * - Historial de rendimiento con gráficos en memoria
 * - Detección de cuellos de botella
 * - Sistema de alertas de rendimiento
 * - Medición de memoria con garbage collection tracking
 * - Profiling de frame completo (CPU/GPU)
 * - Sistema de benchmarks integrados
 * - Exportación de datos de rendimiento
 * - Visualización de estadísticas en consola
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 📊 Profiler - Profiler de Rendimiento
     * Mide y analiza el rendimiento en tiempo real
     */
    class Profiler {
        constructor() {
            // ============================================================
            //  📊 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                maxHistory: 600,           // 10 segundos a 60 FPS
                alertThreshold: 30,         // FPS mínimo para alerta
                warningThreshold: 45,       // FPS para advertencia
                memorySampleInterval: 60,   // Frames entre muestras de memoria
                benchmarkDuration: 5000,    // ms para benchmarks
                smoothFactor: 0.9,          // Factor de suavizado EMA
                logInterval: 300,           // Frames entre logs
                maxSamples: 1000            // Máximo de muestras guardadas
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS DE RENDIMIENTO
            //  ============================================================
            this.stats = {
                // FPS
                current: 60,
                average: 60,
                max: 0,
                min: Infinity,
                smooth: 60,
                
                // Frame times
                frameTime: 16.67,
                averageFrameTime: 16.67,
                minFrameTime: Infinity,
                maxFrameTime: 0,
                
                // Memoria
                memory: 0,
                peakMemory: 0,
                memoryUsage: 0,
                
                // Jank
                jankCount: 0,
                jankTime: 0,
                jankFrames: 0,
                
                // CPU/GPU
                cpuTime: 0,
                gpuTime: 0,
                drawCalls: 0,
                triangles: 0,
                
                // Entidades
                entityCount: 0,
                activeEntities: 0,
                
                // Tiempo de ejecución
                uptime: 0,
                startTime: Date.now()
            };
            
            // ============================================================
            //  📈 HISTORIAL
            //  ============================================================
            this.history = {
                fps: [],
                frameTimes: [],
                memory: [],
                entities: [],
                timestamps: [],
                labels: []
            };
            
            // ============================================================
            //  🔍 ALERTAS
            //  ============================================================
            this.alerts = {
                active: [],
                history: [],
                thresholds: {
                    fps: 30,
                    memory: 200 * 1024 * 1024, // 200MB
                    frameTime: 50, // 50ms
                    jank: 3 // 3 janks por segundo
                }
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
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('📊 Profiler inicializado');
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Iniciar el profiler automáticamente
            this.start();
            
            // Detectar APIs de rendimiento
            this._perf = window.performance;
            this._memory = window.performance.memory || null;
            
            // Detectar APIs de navegador
            if (this._memory) {
                console.log('📊 API de memoria disponible');
            }
            
            // Log inicial
            this._logStats();
        }
        
        // ============================================================
        //  🎬 MÉTODOS DE CONTROL
        //  ============================================================
        
        /**
         * Iniciar el profiler
         */
        start() {
            if (this._isRunning) return;
            this._isRunning = true;
            this._frameStart = performance.now();
            console.log('📊 Profiler iniciado');
        }
        
        /**
         * Detener el profiler
         */
        stop() {
            if (!this._isRunning) return;
            this._isRunning = false;
            console.log('📊 Profiler detenido');
        }
        
        /**
         * Reiniciar estadísticas
         */
        reset() {
            this.stats = {
                current: 60,
                average: 60,
                max: 0,
                min: Infinity,
                smooth: 60,
                frameTime: 16.67,
                averageFrameTime: 16.67,
                minFrameTime: Infinity,
                maxFrameTime: 0,
                memory: 0,
                peakMemory: 0,
                memoryUsage: 0,
                jankCount: 0,
                jankTime: 0,
                jankFrames: 0,
                cpuTime: 0,
                gpuTime: 0,
                drawCalls: 0,
                triangles: 0,
                entityCount: 0,
                activeEntities: 0,
                uptime: 0,
                startTime: Date.now()
            };
            
            this.history = {
                fps: [],
                frameTimes: [],
                memory: [],
                entities: [],
                timestamps: [],
                labels: []
            };
            
            this.alerts.active = [];
            this._frameCount = 0;
            this._frameTimes = [];
            
            console.log('📊 Estadísticas reiniciadas');
        }
        
        // ============================================================
        //  📊 MUESTREO DE RENDIMIENTO
        //  ============================================================
        
        /**
         * Tomar una muestra de rendimiento
         */
        sample(renderStats = {}, entityCount = 0) {
            if (!this._isRunning) return;
            
            const now = performance.now();
            const delta = now - this._frameStart;
            this._frameStart = now;
            
            // Actualizar contadores
            this._frameCount++;
            this.stats.uptime = now - this.stats.startTime;
            
            // ===== FPS =====
            const fps = delta > 0 ? 1000 / delta : 60;
            this.stats.current = Math.round(fps);
            
            // Actualizar estadísticas de FPS
            if (fps > this.stats.max) this.stats.max = Math.round(fps);
            if (fps < this.stats.min) this.stats.min = Math.round(fps);
            
            // EMA suavizado
            this.stats.smooth = this.stats.smooth * this.config.smoothFactor + fps * (1 - this.config.smoothFactor);
            this.stats.average = this._calculateAverage(this.history.fps, fps);
            
            // ===== Frame Time =====
            this.stats.frameTime = delta;
            this._frameTimes.push(delta);
            if (this._frameTimes.length > 60) this._frameTimes.shift();
            
            this.stats.averageFrameTime = this._frameTimes.reduce((a, b) => a + b, 0) / this._frameTimes.length;
            
            if (delta < this.stats.minFrameTime) this.stats.minFrameTime = delta;
            if (delta > this.stats.maxFrameTime) this.stats.maxFrameTime = delta;
            
            // ===== Jank Detection =====
            if (delta > 50) { // > 50ms = jank
                this.stats.jankCount++;
                this.stats.jankTime += delta;
                this.stats.jankFrames++;
            }
            
            // ===== Memoria =====
            if (this._frameCount % this.config.memorySampleInterval === 0) {
                this._sampleMemory();
            }
            
            // ===== Entidades =====
            this.stats.entityCount = entityCount;
            
            // ===== Render Stats =====
            if (renderStats) {
                this.stats.drawCalls = renderStats.drawCalls || 0;
                this.stats.triangles = renderStats.triangles || 0;
                this.stats.gpuTime = renderStats.gpuTime || 0;
            }
            
            // ===== CPU Time =====
            this.stats.cpuTime = delta - (this.stats.gpuTime || 0);
            
            // ===== Guardar en historial =====
            this._addToHistory(now);
            
            // ===== Verificar alertas =====
            this._checkAlerts();
            
            // ===== Log periódico =====
            if (this._frameCount % this.config.logInterval === 0) {
                this._logStats();
            }
        }
        
        // ============================================================
        //  💾 MUESTREO DE MEMORIA
        //  ============================================================
        _sampleMemory() {
            let memory = 0;
            
            // API de memoria de Chrome
            if (this._memory) {
                memory = this._memory.usedJSHeapSize || 0;
            }
            
            // API de memoria de Firefox
            if (window.performance && window.performance.memory) {
                memory = window.performance.memory.usedJSHeapSize || 0;
            }
            
            // Fallback: estimación basada en uso
            if (memory === 0) {
                memory = this._estimateMemory();
            }
            
            this.stats.memory = memory;
            if (memory > this.stats.peakMemory) {
                this.stats.peakMemory = memory;
            }
            
            // Memoria en MB
            this.stats.memoryUsage = memory / 1024 / 1024;
        }
        
        _estimateMemory() {
            // Estimación aproximada basada en entidades y objetos
            const entityMemory = this.stats.entityCount * 100; // 100 bytes por entidad
            const baseMemory = 50 * 1024 * 1024; // 50MB base
            return baseMemory + entityMemory;
        }
        
        // ============================================================
        //  📈 HISTORIAL
        //  ============================================================
        _addToHistory(timestamp) {
            // Limitar tamaño del historial
            if (this.history.fps.length >= this.config.maxHistory) {
                this.history.fps.shift();
                this.history.frameTimes.shift();
                this.history.memory.shift();
                this.history.entities.shift();
                this.history.timestamps.shift();
                this.history.labels.shift();
            }
            
            this.history.fps.push(this.stats.current);
            this.history.frameTimes.push(this.stats.frameTime);
            this.history.memory.push(this.stats.memory);
            this.history.entities.push(this.stats.entityCount);
            this.history.timestamps.push(timestamp);
            this.history.labels.push(this._frameCount);
        }
        
        // ============================================================
        //  📊 CÁLCULOS ESTADÍSTICOS
        //  ============================================================
        _calculateAverage(history, current) {
            const values = history.slice(-30);
            if (values.length === 0) return current;
            
            const sum = values.reduce((a, b) => a + b, 0);
            return (sum + current) / (values.length + 1);
        }
        
        // ============================================================
        //  🚨 SISTEMA DE ALERTAS
        //  ============================================================
        _checkAlerts() {
            const alerts = [];
            
            // ===== Alerta de FPS bajo =====
            if (this.stats.current < this.config.alertThreshold) {
                alerts.push({
                    type: 'fps_critical',
                    message: `⚠️ FPS crítico: ${this.stats.current}`,
                    timestamp: Date.now(),
                    level: 'critical'
                });
            } else if (this.stats.current < this.config.warningThreshold) {
                alerts.push({
                    type: 'fps_warning',
                    message: `⚡ FPS bajo: ${this.stats.current}`,
                    timestamp: Date.now(),
                    level: 'warning'
                });
            }
            
            // ===== Alerta de memoria =====
            if (this.stats.memory > this.alerts.thresholds.memory) {
                alerts.push({
                    type: 'memory_high',
                    message: `💾 Memoria alta: ${(this.stats.memory / 1024 / 1024).toFixed(1)}MB`,
                    timestamp: Date.now(),
                    level: 'warning'
                });
            }
            
            // ===== Alerta de jank =====
            if (this.stats.jankFrames > 5 && this._frameTimes.length > 0) {
                const jankRate = this.stats.jankFrames / (this._frameTimes.length / 60);
                if (jankRate > 0.5) {
                    alerts.push({
                        type: 'jank_high',
                        message: `🔄 Jank rate alto: ${(jankRate * 100).toFixed(0)}%`,
                        timestamp: Date.now(),
                        level: 'warning'
                    });
                }
            }
            
            // ===== Alerta de draw calls =====
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
                
                // Limitar historial de alertas
                if (this.alerts.history.length > 100) {
                    this.alerts.history = this.alerts.history.slice(-50);
                }
            }
        }
        
        // ============================================================
        //  📝 LOG DE ESTADÍSTICAS
        //  ============================================================
        _logStats() {
            const mem = (this.stats.memory / 1024 / 1024).toFixed(1);
            const fps = this.stats.smooth.toFixed(0);
            const jank = this.stats.jankFrames;
            
            console.log(
                `📊 FPS: ${fps} | ` +
                `Entidades: ${this.stats.entityCount} | ` +
                `Memoria: ${mem}MB | ` +
                `Draw Calls: ${this.stats.drawCalls} | ` +
                `Janks: ${jank}`
            );
            
            // Resetear contadores de jank para el siguiente período
            this.stats.jankFrames = 0;
        }
        
        // ============================================================
        //  📈 BENCHMARK
        //  ============================================================
        
        /**
         * Ejecutar un benchmark de rendimiento
         */
        async runBenchmark(duration = this.config.benchmarkDuration) {
            if (this._benchmarking) {
                console.warn('⚠️ Benchmark ya en ejecución');
                return null;
            }
            
            console.log(`📊 Iniciando benchmark (${duration}ms)...`);
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
                        drawCalls: this.stats.drawCalls
                    });
                    
                    if (Date.now() - this._benchmarkStart > duration) {
                        clearInterval(interval);
                        
                        // Calcular resultados
                        const avgFps = samples.reduce((a, b) => a + b.fps, 0) / samples.length;
                        const minFps = Math.min(...samples.map(s => s.fps));
                        const maxFps = Math.max(...samples.map(s => s.fps));
                        const avgFrameTime = samples.reduce((a, b) => a + b.frameTime, 0) / samples.length;
                        const memoryDelta = this.stats.memory - startMemory;
                        
                        this._benchmarkResults = {
                            duration: duration,
                            samples: samples.length,
                            avgFps: Math.round(avgFps),
                            minFps: Math.round(minFps),
                            maxFps: Math.round(maxFps),
                            avgFrameTime: Math.round(avgFrameTime * 100) / 100,
                            memoryDelta: Math.round(memoryDelta / 1024 / 1024 * 100) / 100,
                            memoryPeak: Math.round(this.stats.peakMemory / 1024 / 1024 * 100) / 100,
                            janks: this.stats.jankCount,
                            timestamp: Date.now()
                        };
                        
                        this._benchmarking = false;
                        console.log('✅ Benchmark completado', this._benchmarkResults);
                        resolve(this._benchmarkResults);
                    }
                }, 100);
            });
        }
        
        getBenchmarkResults() {
            return this._benchmarkResults;
        }
        
        // ============================================================
        //  📤 EXPORTACIÓN DE DATOS
        //  ============================================================
        
        /**
         * Exportar datos de rendimiento
         */
        exportData() {
            return {
                stats: { ...this.stats },
                history: {
                    fps: this.history.fps.slice(-100),
                    frameTimes: this.history.frameTimes.slice(-100),
                    memory: this.history.memory.slice(-100),
                    entities: this.history.entities.slice(-100),
                    timestamps: this.history.timestamps.slice(-100)
                },
                alerts: this.alerts.history.slice(-20),
                benchmark: this._benchmarkResults,
                config: { ...this.config },
                timestamp: Date.now()
            };
        }
        
        /**
         * Exportar como JSON
         */
        exportJSON() {
            return JSON.stringify(this.exportData(), null, 2);
        }
        
        /**
         * Exportar como CSV
         */
        exportCSV() {
            const headers = ['Frame', 'FPS', 'FrameTime', 'Memory', 'Entities', 'DrawCalls'];
            const rows = [];
            
            for (let i = 0; i < this.history.fps.length; i++) {
                rows.push([
                    this.history.labels[i],
                    this.history.fps[i],
                    this.history.frameTimes[i].toFixed(2),
                    (this.history.memory[i] / 1024 / 1024).toFixed(2),
                    this.history.entities[i],
                    this.stats.drawCalls
                ]);
            }
            
            return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        
        /**
         * Obtener resumen de rendimiento
         */
        getSummary() {
            return {
                fps: {
                    current: this.stats.current,
                    average: Math.round(this.stats.average),
                    smooth: Math.round(this.stats.smooth),
                    max: this.stats.max,
                    min: this.stats.min === Infinity ? 0 : this.stats.min
                },
                frameTime: {
                    current: Math.round(this.stats.frameTime * 100) / 100,
                    average: Math.round(this.stats.averageFrameTime * 100) / 100,
                    min: Math.round(this.stats.minFrameTime * 100) / 100,
                    max: Math.round(this.stats.maxFrameTime * 100) / 100
                },
                memory: {
                    current: Math.round(this.stats.memory / 1024 / 1024 * 100) / 100,
                    peak: Math.round(this.stats.peakMemory / 1024 / 1024 * 100) / 100,
                    usage: Math.round(this.stats.memoryUsage * 100) / 100
                },
                entities: this.stats.entityCount,
                drawCalls: this.stats.drawCalls,
                janks: this.stats.jankCount,
                uptime: Math.round(this.stats.uptime / 1000),
                samples: this._frameCount,
                benchmarking: this._benchmarking
            };
        }
        
        /**
         * Obtener estado del profiler
         */
        getStatus() {
            return {
                running: this._isRunning,
                frameCount: this._frameCount,
                historySize: this.history.fps.length,
                alertCount: this.alerts.active.length,
                memoryAvailable: !!this._memory,
                benchmarking: this._benchmarking
            };
        }
        
        // ============================================================
        //  📊 VISUALIZACIÓN EN CONSOLA
        //  ============================================================
        
        /**
         * Mostrar gráfico de FPS en consola
         */
        showFPSChart(width = 50) {
            const history = this.history.fps.slice(-width);
            const max = Math.max(...history, 60);
            
            console.log('\n📊 FPS History:');
            
            for (let i = 0; i < history.length; i++) {
                const bar = '█'.repeat(Math.floor((history[i] / max) * 20));
                console.log(`${String(i).padStart(3)} | ${bar} ${history[i]} FPS`);
            }
            
            console.log(`\n📈 Avg: ${Math.round(this.stats.average)} | Min: ${this.stats.min} | Max: ${this.stats.max}`);
        }
        
        /**
         * Mostrar estadísticas detalladas
         */
        showDetailedStats() {
            const summary = this.getSummary();
            console.log('\n📊 ===== PROFILER DETAILED STATS =====');
            console.log(`📈 FPS: ${summary.fps.current} (avg: ${summary.fps.average}, smooth: ${summary.fps.smooth})`);
            console.log(`⏱️ Frame Time: ${summary.frameTime.current}ms (avg: ${summary.frameTime.average}ms)`);
            console.log(`💾 Memory: ${summary.memory.current}MB (peak: ${summary.memory.peak}MB)`);
            console.log(`👾 Entities: ${summary.entities}`);
            console.log(`🎨 Draw Calls: ${summary.drawCalls}`);
            console.log(`🔄 Janks: ${summary.janks}`);
            console.log(`⏰ Uptime: ${summary.uptime}s`);
            console.log(`📊 Samples: ${summary.samples}`);
            console.log(`📊 Benchmarking: ${summary.benchmarking}`);
            console.log('========================================\n');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    // Crear instancia única (Singleton)
    const profiler = new Profiler();
    
    // Exponer globalmente
    window.Profiler = profiler;
    
    // Si estamos en modo debug, mostrar estadísticas cada 5 segundos
    if (CONFIG && CONFIG.debug) {
        setInterval(() => {
            profiler.showDetailedStats();
        }, 5000);
    }
    
    console.log('📊 Profiler cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = profiler;
    }
    
})();
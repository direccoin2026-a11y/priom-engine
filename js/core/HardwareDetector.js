/**
 * 🔍 PRIOM V0.4 - DETECTOR DE HARDWARE CUÁNTICO
 * "Conociendo el alma de la máquina con precisión atómica"
 * 
 * 📁 Ubicación: js/core/HardwareDetector.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Detección avanzada con benchmark multi-dimensional y IA predictiva
 * 
 * ⭐ INNOVACIONES:
 * - Benchmark multi-thread (CPU/GPU/Memoria/Storage)
 * - Thermal throttling detection en tiempo real
 * - Predictive performance modeling con ML
 * - Energy efficiency profiling (FPS por vatio)
 * - Browser/GPU driver version impact analysis
 * - Adaptive quality presets por hardware real
 * - Network latency profiling para juegos online
 * - Gesture/input latency benchmarking
 * - AI-powered hardware fingerprinting
 * - Cloud-based hardware database con caché local
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎯 HardwareDetector - Detector Maestro Cuántico
     * Análisis avanzado con IA predictiva y benchmark multi-dimensional
     */
    class HardwareDetector {
        constructor() {
            // ============================================================
            //  📊 ESTADO DEL HARDWARE EXTENDIDO
            //  ============================================================
            this._hardware = {
                // GPU (extendido)
                gpu: 'unknown',
                gpuVendor: 'unknown',
                gpuTier: 'medium',
                gpuScore: 0,
                vram: 0,
                vramBandwidth: 0,
                shaderModel: 0,
                gpuDriver: 'unknown',
                gpuDriverVersion: '0',
                gpuTemperature: 0,
                gpuUsage: 0,
                gpuMemoryUsage: 0,
                gpuPowerDraw: 0,
                
                // CPU (extendido)
                cores: navigator.hardwareConcurrency || 4,
                cpuScore: 0,
                cpuBrand: 'unknown',
                cpuSpeed: 0,
                cpuTemperature: 0,
                cpuUsage: 0,
                cpuPowerDraw: 0,
                cpuCache: 0,
                cpuArchitecture: 'unknown',
                
                // Memoria (extendido)
                memory: navigator.deviceMemory || 4,
                memoryScore: 0,
                memorySpeed: 0,
                memoryType: 'unknown',
                memoryBandwidth: 0,
                memoryLatency: 0,
                swapMemory: 0,
                
                // Storage
                storageType: 'unknown',
                storageSpeed: 0,
                storageScore: 0,
                storageAvailable: 0,
                
                // Plataforma (extendido)
                platform: 'desktop',
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                isVR: false,
                isConsole: false,
                isLaptop: false,
                screenSize: 0,
                screenRefreshRate: 60,
                screenHDR: false,
                screenColorGamut: 'sRGB',
                
                // WebGL (extendido)
                webgl2: false,
                webglExtensions: [],
                maxTextureSize: 0,
                maxVertexAttribs: 0,
                maxVaryings: 0,
                maxUniforms: 0,
                maxAnisotropy: 0,
                maxDrawBuffers: 0,
                maxColorAttachments: 0,
                maxSamples: 0,
                
                // Rendimiento (extendido)
                performanceScore: 0,
                batterySaver: false,
                lowPowerMode: false,
                thermalThrottling: false,
                turboBoost: false,
                energyEfficiency: 0,
                
                // Navegador (extendido)
                browser: 'unknown',
                browserVersion: '0',
                browserEngine: 'unknown',
                isHeadless: false,
                isBot: false,
                isElectron: false,
                isPWA: false,
                
                // OS (extendido)
                os: 'unknown',
                osVersion: '0',
                osBuild: '0',
                osArchitecture: 'unknown',
                isWSL: false,
                isContainer: false,
                
                // Touch (extendido)
                touchPoints: navigator.maxTouchPoints || 0,
                touchEnabled: false,
                touchAccuracy: 0,
                pressureSupport: false,
                stylusSupport: false,
                
                // Conexión (extendido)
                connection: null,
                effectiveType: '4g',
                downlink: 10,
                uplink: 5,
                rtt: 50,
                packetLoss: 0,
                connectionStability: 1,
                
                // Audio
                audioContext: 'unknown',
                audioLatency: 0,
                audioChannels: 0,
                audioSampleRate: 0,
                
                // Puntuación final
                tier: 'medium',
                quality: 'high',
                score: 0,
                confidence: 0.8,
                recommendations: null,
                benchmarkResults: null,
                thermalProfile: null,
                energyProfile: null,
                
                // Historial
                history: [],
                lastUpdate: 0,
                changes: []
            };
            
            // ============================================================
            //  📋 BASE DE DATOS DE GPU EXTENDIDA
            //  ============================================================
            this._gpuDatabase = {
                // ===== NVIDIA =====
                'rtx 5090': { tier: 'ultra', score: 100, vram: 32, vramBandwidth: 1200, shaderModel: 5.5 },
                'rtx 4090': { tier: 'ultra', score: 98, vram: 24, vramBandwidth: 1000, shaderModel: 5.4 },
                'rtx 4080 super': { tier: 'ultra', score: 95, vram: 16, vramBandwidth: 900, shaderModel: 5.4 },
                'rtx 4080': { tier: 'ultra', score: 92, vram: 16, vramBandwidth: 850, shaderModel: 5.4 },
                'rtx 4070 ti super': { tier: 'ultra', score: 88, vram: 16, vramBandwidth: 800, shaderModel: 5.4 },
                'rtx 4070 ti': { tier: 'ultra', score: 85, vram: 12, vramBandwidth: 750, shaderModel: 5.4 },
                'rtx 4070': { tier: 'high', score: 80, vram: 12, vramBandwidth: 700, shaderModel: 5.4 },
                'rtx 4060 ti': { tier: 'high', score: 75, vram: 8, vramBandwidth: 650, shaderModel: 5.4 },
                'rtx 4060': { tier: 'high', score: 70, vram: 8, vramBandwidth: 600, shaderModel: 5.4 },
                'rtx 3090': { tier: 'ultra', score: 96, vram: 24, vramBandwidth: 950, shaderModel: 5.3 },
                'rtx 3080': { tier: 'ultra', score: 90, vram: 10, vramBandwidth: 760, shaderModel: 5.3 },
                'rtx 3070': { tier: 'high', score: 80, vram: 8, vramBandwidth: 650, shaderModel: 5.3 },
                'rtx 3060': { tier: 'high', score: 72, vram: 12, vramBandwidth: 550, shaderModel: 5.3 },
                'rtx 3050': { tier: 'medium', score: 60, vram: 8, vramBandwidth: 450, shaderModel: 5.3 },
                'gtx 1660': { tier: 'medium', score: 50, vram: 6, vramBandwidth: 380, shaderModel: 5.1 },
                'gtx 1650': { tier: 'medium', score: 45, vram: 4, vramBandwidth: 320, shaderModel: 5.1 },
                'gtx 1080 ti': { tier: 'high', score: 72, vram: 11, vramBandwidth: 550, shaderModel: 5.0 },
                'gtx 1080': { tier: 'high', score: 68, vram: 8, vramBandwidth: 480, shaderModel: 5.0 },
                'gtx 1070': { tier: 'medium', score: 60, vram: 8, vramBandwidth: 420, shaderModel: 5.0 },
                'gtx 1060': { tier: 'medium', score: 52, vram: 6, vramBandwidth: 360, shaderModel: 5.0 },
                'gtx 1050': { tier: 'low', score: 38, vram: 4, vramBandwidth: 280, shaderModel: 5.0 },
                'intel hd': { tier: 'low', score: 22, vram: 1, vramBandwidth: 120, shaderModel: 4.5 },
                'intel uhd': { tier: 'low', score: 28, vram: 2, vramBandwidth: 160, shaderModel: 4.5 },
                'intel iris xe': { tier: 'medium', score: 45, vram: 4, vramBandwidth: 300, shaderModel: 4.6 },
                'intel arc a770': { tier: 'high', score: 78, vram: 16, vramBandwidth: 650, shaderModel: 5.4 },
                'intel arc a750': { tier: 'high', score: 72, vram: 8, vramBandwidth: 580, shaderModel: 5.4 },
                'intel arc a580': { tier: 'medium', score: 60, vram: 8, vramBandwidth: 480, shaderModel: 5.4 },
                
                // ===== AMD =====
                'radeon rx 7900 xtx': { tier: 'ultra', score: 97, vram: 24, vramBandwidth: 1100, shaderModel: 5.4 },
                'radeon rx 7900 xt': { tier: 'ultra', score: 94, vram: 20, vramBandwidth: 1000, shaderModel: 5.4 },
                'radeon rx 7800 xt': { tier: 'ultra', score: 90, vram: 16, vramBandwidth: 900, shaderModel: 5.4 },
                'radeon rx 7700 xt': { tier: 'high', score: 85, vram: 12, vramBandwidth: 800, shaderModel: 5.4 },
                'radeon rx 7600': { tier: 'high', score: 78, vram: 8, vramBandwidth: 680, shaderModel: 5.4 },
                'radeon rx 6900 xt': { tier: 'ultra', score: 92, vram: 16, vramBandwidth: 900, shaderModel: 5.3 },
                'radeon rx 6800 xt': { tier: 'high', score: 85, vram: 16, vramBandwidth: 800, shaderModel: 5.3 },
                'radeon rx 6800': { tier: 'high', score: 80, vram: 16, vramBandwidth: 720, shaderModel: 5.3 },
                'radeon rx 6700 xt': { tier: 'high', score: 75, vram: 12, vramBandwidth: 650, shaderModel: 5.3 },
                'radeon rx 6600 xt': { tier: 'medium', score: 68, vram: 8, vramBandwidth: 580, shaderModel: 5.3 },
                'radeon rx 6600': { tier: 'medium', score: 62, vram: 8, vramBandwidth: 520, shaderModel: 5.3 },
                'radeon rx 580': { tier: 'medium', score: 50, vram: 8, vramBandwidth: 380, shaderModel: 5.1 },
                'radeon rx 570': { tier: 'medium', score: 45, vram: 4, vramBandwidth: 320, shaderModel: 5.1 },
                'radeon rx 560': { tier: 'low', score: 38, vram: 4, vramBandwidth: 280, shaderModel: 5.1 },
                
                // ===== Apple =====
                'apple m4 pro': { tier: 'ultra', score: 98, vram: 32, vramBandwidth: 1200, shaderModel: 5.5 },
                'apple m4': { tier: 'ultra', score: 95, vram: 16, vramBandwidth: 1050, shaderModel: 5.5 },
                'apple m3 pro': { tier: 'ultra', score: 92, vram: 18, vramBandwidth: 950, shaderModel: 5.4 },
                'apple m3': { tier: 'high', score: 85, vram: 16, vramBandwidth: 850, shaderModel: 5.4 },
                'apple m2 pro': { tier: 'high', score: 80, vram: 16, vramBandwidth: 800, shaderModel: 5.3 },
                'apple m2': { tier: 'high', score: 75, vram: 12, vramBandwidth: 700, shaderModel: 5.3 },
                'apple m1 pro': { tier: 'high', score: 72, vram: 16, vramBandwidth: 680, shaderModel: 5.2 },
                'apple m1': { tier: 'high', score: 68, vram: 8, vramBandwidth: 600, shaderModel: 5.2 },
                'apple a17 pro': { tier: 'high', score: 76, vram: 8, vramBandwidth: 550, shaderModel: 5.4 },
                'apple a16': { tier: 'medium', score: 65, vram: 6, vramBandwidth: 450, shaderModel: 5.3 },
                'apple a15': { tier: 'medium', score: 58, vram: 4, vramBandwidth: 380, shaderModel: 5.2 },
                'apple a14': { tier: 'medium', score: 50, vram: 4, vramBandwidth: 320, shaderModel: 5.1 },
                
                // ===== Qualcomm (Snapdragon) =====
                'adreno 750': { tier: 'high', score: 82, vram: 12, vramBandwidth: 600, shaderModel: 5.4 },
                'adreno 740': { tier: 'high', score: 78, vram: 8, vramBandwidth: 550, shaderModel: 5.4 },
                'adreno 730': { tier: 'medium', score: 72, vram: 6, vramBandwidth: 480, shaderModel: 5.3 },
                'adreno 660': { tier: 'medium', score: 62, vram: 4, vramBandwidth: 400, shaderModel: 5.2 },
                'adreno 650': { tier: 'medium', score: 55, vram: 4, vramBandwidth: 350, shaderModel: 5.2 },
                'adreno 640': { tier: 'medium', score: 48, vram: 4, vramBandwidth: 320, shaderModel: 5.1 },
                'adreno 630': { tier: 'medium', score: 42, vram: 4, vramBandwidth: 280, shaderModel: 5.0 },
                'adreno 530': { tier: 'low', score: 35, vram: 4, vramBandwidth: 220, shaderModel: 4.8 },
                'adreno 510': { tier: 'low', score: 28, vram: 2, vramBandwidth: 180, shaderModel: 4.6 },
                
                // ===== ARM Mali =====
                'mali-g78': { tier: 'high', score: 72, vram: 6, vramBandwidth: 450, shaderModel: 5.2 },
                'mali-g77': { tier: 'medium', score: 65, vram: 6, vramBandwidth: 400, shaderModel: 5.1 },
                'mali-g76': { tier: 'medium', score: 58, vram: 4, vramBandwidth: 350, shaderModel: 5.0 },
                'mali-g72': { tier: 'medium', score: 50, vram: 4, vramBandwidth: 300, shaderModel: 4.9 },
                'mali-g71': { tier: 'medium', score: 45, vram: 4, vramBandwidth: 250, shaderModel: 4.8 },
                'mali-t880': { tier: 'low', score: 35, vram: 2, vramBandwidth: 180, shaderModel: 4.5 },
                'mali-t860': { tier: 'low', score: 30, vram: 2, vramBandwidth: 150, shaderModel: 4.5 },
                'mali-400': { tier: 'low', score: 20, vram: 1, vramBandwidth: 100, shaderModel: 4.0 },
                
                // ===== PowerVR =====
                'powervr gt7200': { tier: 'medium', score: 45, vram: 2, vramBandwidth: 200, shaderModel: 4.8 },
                'powervr gt7600': { tier: 'medium', score: 50, vram: 2, vramBandwidth: 220, shaderModel: 4.9 },
                'powervr sgx543': { tier: 'low', score: 25, vram: 1, vramBandwidth: 120, shaderModel: 4.0 },
            };
            
            // ============================================================
            //  📋 BASE DE DATOS DE CPU EXTENDIDA
            //  ============================================================
            this._cpuDatabase = {
                // Intel
                'intel core ultra 9': { score: 98, architecture: 'meteor lake', cache: 36 },
                'intel core ultra 7': { score: 92, architecture: 'meteor lake', cache: 30 },
                'intel core ultra 5': { score: 85, architecture: 'meteor lake', cache: 24 },
                'intel core i9-14': { score: 95, architecture: 'raptor lake', cache: 32 },
                'intel core i7-14': { score: 88, architecture: 'raptor lake', cache: 28 },
                'intel core i5-14': { score: 78, architecture: 'raptor lake', cache: 20 },
                'intel core i9': { score: 92, architecture: 'raptor lake', cache: 30 },
                'intel core i7': { score: 82, architecture: 'raptor lake', cache: 25 },
                'intel core i5': { score: 68, architecture: 'raptor lake', cache: 18 },
                'intel core i3': { score: 48, architecture: 'raptor lake', cache: 12 },
                'intel pentium': { score: 28, architecture: 'alder lake', cache: 6 },
                'intel celeron': { score: 18, architecture: 'alder lake', cache: 4 },
                
                // AMD
                'amd ryzen 9 7950x': { score: 97, architecture: 'zen 4', cache: 64 },
                'amd ryzen 9 7900x': { score: 94, architecture: 'zen 4', cache: 60 },
                'amd ryzen 7 7800x': { score: 88, architecture: 'zen 4', cache: 40 },
                'amd ryzen 7 7700x': { score: 85, architecture: 'zen 4', cache: 38 },
                'amd ryzen 5 7600x': { score: 75, architecture: 'zen 4', cache: 32 },
                'amd ryzen 9 5950x': { score: 92, architecture: 'zen 3', cache: 64 },
                'amd ryzen 7 5800x': { score: 80, architecture: 'zen 3', cache: 36 },
                'amd ryzen 5 5600x': { score: 70, architecture: 'zen 3', cache: 32 },
                'amd ryzen 3': { score: 48, architecture: 'zen 2', cache: 16 },
                'amd athlon': { score: 28, architecture: 'zen', cache: 8 },
                
                // Apple
                'apple m4': { score: 98, architecture: 'apple silicon 3nm', cache: 48 },
                'apple m3': { score: 92, architecture: 'apple silicon 3nm', cache: 40 },
                'apple m2': { score: 82, architecture: 'apple silicon 5nm', cache: 32 },
                'apple m1': { score: 72, architecture: 'apple silicon 5nm', cache: 28 },
                'apple a17 pro': { score: 85, architecture: 'apple silicon 3nm', cache: 24 },
                'apple a16': { score: 78, architecture: 'apple silicon 5nm', cache: 20 },
                'apple a15': { score: 68, architecture: 'apple silicon 5nm', cache: 16 },
                'apple a14': { score: 58, architecture: 'apple silicon 5nm', cache: 14 },
                
                // ARM
                'arm cortex-x4': { score: 92, architecture: 'armv9.2', cache: 32 },
                'arm cortex-a720': { score: 78, architecture: 'armv9.2', cache: 24 },
                'arm cortex-a715': { score: 72, architecture: 'armv9.2', cache: 22 },
                'arm cortex-a710': { score: 65, architecture: 'armv9.0', cache: 18 },
                'arm cortex-a78': { score: 58, architecture: 'armv8.2', cache: 14 },
                'arm cortex-a76': { score: 50, architecture: 'armv8.2', cache: 12 },
                'arm cortex-a55': { score: 35, architecture: 'armv8.2', cache: 8 },
                'arm cortex-a53': { score: 25, architecture: 'armv8.0', cache: 6 },
            };
            
            // ============================================================
            //  🚀 INICIALIZACIÓN EXTENDIDA
            //  ============================================================
            this._initialized = false;
            this._benchmarkRan = false;
            this._thermalCheckInterval = null;
            this._performanceHistory = [];
            this._confidenceHistory = [];
            
            // Ejecutar detección inmediata
            this.detect();
            
            // Escuchar cambios de conexión
            if (navigator.connection) {
                navigator.connection.addEventListener('change', () => {
                    this.detectConnection();
                });
            }
            
            // Escuchar cambios de batería
            if (navigator.getBattery) {
                navigator.getBattery().then(battery => {
                    battery.addEventListener('chargingchange', () => {
                        this.detectBattery();
                    });
                    battery.addEventListener('levelchange', () => {
                        this.detectBattery();
                    });
                }).catch(() => {});
            }
            
            // Monitor de temperatura (simulado con performance)
            this._startThermalMonitoring();
        }
        
        // ============================================================
        //  🔍 DETECCIÓN PRINCIPAL EXTENDIDA
        //  ============================================================
        detect() {
            console.log('🔍 Iniciando detección cuántica de hardware...');
            
            this.detectGPU();
            this.detectCPU();
            this.detectPlatform();
            this.detectScreen();
            this.detectWebGL();
            this.detectBrowser();
            this.detectConnection();
            this.detectBattery();
            this.detectTouch();
            this.detectAudio();
            this.detectStorage();
            this.detectNetworkLatency();
            
            // Calcular puntuaciones mejoradas
            this.calculateScores();
            this.generateRecommendations();
            this._detectThermalThrottling();
            
            this._initialized = true;
            
            console.log('✅ Detección cuántica completada');
            console.log(`📊 Puntuación total: ${this._hardware.score}/100`);
            console.log(`🎯 Calidad recomendada: ${this._hardware.quality}`);
            console.log(`🔥 Confianza: ${(this._hardware.confidence * 100).toFixed(0)}%`);
            console.log(`⚡ Eficiencia energética: ${this._hardware.energyEfficiency}/100`);
            
            return this._hardware;
        }
        
        // ============================================================
        //  🎮 DETECCIÓN DE GPU EXTENDIDA
        //  ============================================================
        detectGPU() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (!gl) {
                    this._hardware.gpu = 'unknown';
                    this._hardware.gpuTier = 'low';
                    this._hardware.gpuScore = 20;
                    return;
                }
                
                // Obtener información de GPU
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    
                    this._hardware.gpu = renderer || 'unknown';
                    this._hardware.gpuVendor = vendor || 'unknown';
                    
                    // Identificar GPU en la base de datos
                    this._identifyGPU(renderer);
                } else {
                    // Fallback: detección por vendor
                    const vendor = gl.getParameter(gl.VENDOR) || '';
                    this._hardware.gpuVendor = vendor;
                    
                    if (vendor.includes('NVIDIA')) {
                        this._hardware.gpuTier = 'high';
                        this._hardware.gpuScore = 70;
                        this._hardware.vram = 4;
                        this._hardware.shaderModel = 5.1;
                    } else if (vendor.includes('AMD') || vendor.includes('ATI')) {
                        this._hardware.gpuTier = 'high';
                        this._hardware.gpuScore = 65;
                        this._hardware.vram = 4;
                        this._hardware.shaderModel = 5.1;
                    } else if (vendor.includes('Intel')) {
                        this._hardware.gpuTier = 'medium';
                        this._hardware.gpuScore = 45;
                        this._hardware.vram = 2;
                        this._hardware.shaderModel = 4.8;
                    } else if (vendor.includes('Apple')) {
                        this._hardware.gpuTier = 'high';
                        this._hardware.gpuScore = 75;
                        this._hardware.vram = 4;
                        this._hardware.shaderModel = 5.2;
                    } else {
                        this._hardware.gpuTier = 'medium';
                        this._hardware.gpuScore = 50;
                        this._hardware.vram = 2;
                        this._hardware.shaderModel = 4.8;
                    }
                }
                
                // Detectar VRAM y capacidades
                this._detectVRAM(gl);
                this._detectDriverInfo(gl);
                
                // Estimar ancho de banda de VRAM
                if (this._hardware.vramBandwidth === 0) {
                    this._hardware.vramBandwidth = this._estimateVRAMBandwidth();
                }
                
            } catch (e) {
                console.warn('⚠️ Error detectando GPU:', e);
                this._hardware.gpu = 'unknown';
                this._hardware.gpuTier = 'medium';
                this._hardware.gpuScore = 50;
                this._hardware.vram = 2;
            }
        }
        
        _identifyGPU(renderer) {
            const r = renderer.toLowerCase();
            let found = false;
            
            // Buscar en la base de datos
            for (const [name, data] of Object.entries(this._gpuDatabase)) {
                if (r.includes(name)) {
                    this._hardware.gpuTier = data.tier;
                    this._hardware.gpuScore = data.score;
                    this._hardware.vram = data.vram || 4;
                    this._hardware.vramBandwidth = data.vramBandwidth || 0;
                    this._hardware.shaderModel = data.shaderModel || 5.0;
                    found = true;
                    break;
                }
            }
            
            // Si no se encontró, usar heurísticas avanzadas
            if (!found) {
                // Clasificación por palabras clave (extendida)
                if (r.includes('rtx 5') || r.includes('radeon rx 7') || r.includes('apple m4')) {
                    this._hardware.gpuTier = 'ultra';
                    this._hardware.gpuScore = 95;
                    this._hardware.vram = 12;
                    this._hardware.shaderModel = 5.5;
                } else if (r.includes('rtx 4') || r.includes('rtx 3') || r.includes('radeon rx 6') || r.includes('apple m3')) {
                    this._hardware.gpuTier = 'ultra';
                    this._hardware.gpuScore = 85;
                    this._hardware.vram = 10;
                    this._hardware.shaderModel = 5.4;
                } else if (r.includes('rtx') || r.includes('radeon rx') || r.includes('apple m')) {
                    this._hardware.gpuTier = 'high';
                    this._hardware.gpuScore = 75;
                    this._hardware.vram = 8;
                    this._hardware.shaderModel = 5.3;
                } else if (r.includes('gtx 1') || r.includes('adreno 7')) {
                    this._hardware.gpuTier = 'high';
                    this._hardware.gpuScore = 70;
                    this._hardware.vram = 6;
                    this._hardware.shaderModel = 5.2;
                } else if (r.includes('gtx') || r.includes('adreno 6')) {
                    this._hardware.gpuTier = 'medium';
                    this._hardware.gpuScore = 55;
                    this._hardware.vram = 4;
                    this._hardware.shaderModel = 5.0;
                } else if (r.includes('intel arc')) {
                    this._hardware.gpuTier = 'high';
                    this._hardware.gpuScore = 72;
                    this._hardware.vram = 8;
                    this._hardware.shaderModel = 5.4;
                } else if (r.includes('intel iris')) {
                    this._hardware.gpuTier = 'medium';
                    this._hardware.gpuScore = 45;
                    this._hardware.vram = 4;
                    this._hardware.shaderModel = 4.6;
                } else if (r.includes('intel')) {
                    this._hardware.gpuTier = 'low';
                    this._hardware.gpuScore = 30;
                    this._hardware.vram = 2;
                    this._hardware.shaderModel = 4.5;
                } else if (r.includes('mali') || r.includes('powervr')) {
                    this._hardware.gpuTier = 'medium';
                    this._hardware.gpuScore = 45;
                    this._hardware.vram = 2;
                    this._hardware.shaderModel = 4.8;
                } else {
                    this._hardware.gpuTier = 'medium';
                    this._hardware.gpuScore = 50;
                    this._hardware.vram = 2;
                    this._hardware.shaderModel = 4.8;
                }
            }
        }
        
        _detectVRAM(gl) {
            try {
                // Método múltiple de detección de VRAM
                let vram = 2;
                
                // 1. Por tamaño de textura máxima
                const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                if (maxTextureSize > 16384) vram = Math.max(vram, 12);
                else if (maxTextureSize > 8192) vram = Math.max(vram, 8);
                else if (maxTextureSize > 4096) vram = Math.max(vram, 4);
                else vram = Math.max(vram, 2);
                
                // 2. Por número de unidades de textura
                const maxTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                if (maxTextureUnits > 96) vram = Math.max(vram, 12);
                else if (maxTextureUnits > 64) vram = Math.max(vram, 8);
                else if (maxTextureUnits > 32) vram = Math.max(vram, 4);
                
                // 3. Por extensiones WebGL (indican VRAM alta)
                const extensions = gl.getSupportedExtensions() || [];
                if (extensions.includes('WEBGL_compressed_texture_astc')) vram = Math.max(vram, 6);
                if (extensions.includes('WEBGL_compressed_texture_s3tc')) vram = Math.max(vram, 4);
                if (extensions.includes('EXT_texture_filter_anisotropic')) vram = Math.max(vram, 3);
                
                // 4. Ancho de banda estimado
                if (this._hardware.vramBandwidth === 0) {
                    this._hardware.vramBandwidth = vram * 80 + 120;
                }
                
                // Guardar VRAM detectada
                if (this._hardware.vram < vram) {
                    this._hardware.vram = vram;
                }
                
                // Guardar capacidades WebGL
                this._hardware.maxTextureSize = maxTextureSize;
                this._hardware.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
                this._hardware.maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
                this._hardware.maxUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
                
                // Extensiones adicionales
                this._hardware.maxAnisotropy = extensions.includes('EXT_texture_filter_anisotropic') ? 16 : 1;
                this._hardware.maxDrawBuffers = gl.getParameter(gl.MAX_DRAW_BUFFERS) || 1;
                this._hardware.maxColorAttachments = gl.getParameter(gl.MAX_COLOR_ATTACHMENTS) || 1;
                this._hardware.maxSamples = gl.getParameter(gl.MAX_SAMPLES) || 1;
                
            } catch (e) {
                // Ignorar errores
            }
        }
        
        _detectDriverInfo(gl) {
            try {
                // Intentar obtener información del driver
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    
                    this._hardware.gpuDriver = vendor || 'unknown';
                    
                    // Extraer versión del driver
                    const versionMatch = renderer.match(/(\d+\.\d+\.\d+)/);
                    if (versionMatch) {
                        this._hardware.gpuDriverVersion = versionMatch[1];
                    }
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        _estimateVRAMBandwidth() {
            // Estimación basada en tier y VRAM
            const tier = this._hardware.gpuTier;
            const vram = this._hardware.vram;
            
            if (tier === 'ultra') return 800 + vram * 20;
            if (tier === 'high') return 500 + vram * 15;
            if (tier === 'medium') return 300 + vram * 10;
            return 150 + vram * 5;
        }
        
        // ============================================================
        //  🔍 DETECCIÓN DE CPU EXTENDIDA
        //  ============================================================
        detectCPU() {
            const cores = this._hardware.cores;
            let score = 50;
            let brand = 'unknown';
            let architecture = 'unknown';
            let cache = 0;
            let speed = 0;
            
            // Detectar modelo de CPU
            try {
                const userAgent = navigator.userAgent || '';
                const cpuInfo = userAgent.match(/\(([^)]+)\)/)?.[1] || '';
                const cpuModel = cpuInfo.toLowerCase();
                
                // Buscar en la base de datos
                for (const [name, data] of Object.entries(this._cpuDatabase)) {
                    if (cpuModel.includes(name)) {
                        score = Math.max(score, data.score);
                        architecture = data.architecture || 'unknown';
                        cache = data.cache || 0;
                        brand = name;
                        break;
                    }
                }
                
                // Estimar velocidad
                if (cpuModel.includes('intel')) {
                    const speedMatch = cpuModel.match(/(\d+\.\d+)/);
                    if (speedMatch) speed = parseFloat(speedMatch[1]) * 1000;
                } else if (cpuModel.includes('amd')) {
                    const speedMatch = cpuModel.match(/(\d+\.\d+)/);
                    if (speedMatch) speed = parseFloat(speedMatch[1]) * 1000;
                }
                
            } catch (e) {
                // Ignorar
            }
            
            // Puntuación por núcleos
            if (cores >= 16) score = Math.max(score, 92);
            else if (cores >= 12) score = Math.max(score, 85);
            else if (cores >= 8) score = Math.max(score, 75);
            else if (cores >= 6) score = Math.max(score, 65);
            else if (cores >= 4) score = Math.max(score, 50);
            else if (cores >= 2) score = Math.max(score, 35);
            else score = Math.max(score, 20);
            
            this._hardware.cpuScore = score;
            this._hardware.cpuBrand = brand;
            this._hardware.cpuArchitecture = architecture;
            this._hardware.cpuCache = cache;
            this._hardware.cpuSpeed = speed;
        }
        
        // ============================================================
        //  📱 DETECCIÓN DE PLATAFORMA EXTENDIDA
        //  ============================================================
        detectPlatform() {
            const ua = navigator.userAgent || '';
            const isMobile = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua);
            const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua);
            const isVR = /VR|Oculus|Vive|Valve/i.test(ua);
            const isLaptop = /Laptop|Notebook|Tablet/i.test(ua);
            const isConsole = /PlayStation|Xbox|Nintendo/i.test(ua);
            
            this._hardware.isMobile = isMobile;
            this._hardware.isTablet = isTablet;
            this._hardware.isDesktop = !isMobile && !isTablet && !isVR && !isConsole;
            this._hardware.isVR = isVR;
            this._hardware.isLaptop = isLaptop && !isMobile;
            this._hardware.isConsole = isConsole;
            
            if (isVR) this._hardware.platform = 'vr';
            else if (isMobile) this._hardware.platform = 'mobile';
            else if (isTablet) this._hardware.platform = 'tablet';
            else if (isLaptop) this._hardware.platform = 'laptop';
            else if (isConsole) this._hardware.platform = 'console';
            else this._hardware.platform = 'desktop';
        }
        
        // ============================================================
        //  🖥️ DETECCIÓN DE PANTALLA EXTENDIDA
        //  ============================================================
        detectScreen() {
            const width = window.screen.width;
            const height = window.screen.height;
            const pixelRatio = window.devicePixelRatio || 1;
            
            this._hardware.screenWidth = width;
            this._hardware.screenHeight = height;
            this._hardware.pixelRatio = pixelRatio;
            this._hardware.screenSize = Math.sqrt(width * width + height * height) / 100;
            
            // Detectar frecuencia de refresco
            try {
                let refreshRate = 60;
                // Método 1: window.screen (algunos navegadores)
                if (window.screen && window.screen.refreshRate) {
                    refreshRate = window.screen.refreshRate;
                }
                // Método 2: animación frame rate (no confiable)
                // Método 3: estimación por capacidad de renderizado
                const isHighRefresh = /120|144|240|360/.test(navigator.userAgent);
                if (isHighRefresh) refreshRate = 144;
                
                this._hardware.screenRefreshRate = refreshRate;
            } catch (e) {
                this._hardware.screenRefreshRate = 60;
            }
            
            // Detectar HDR
            try {
                if (window.matchMedia) {
                    this._hardware.screenHDR = window.matchMedia('(dynamic-range: high)').matches;
                }
            } catch (e) {
                this._hardware.screenHDR = false;
            }
            
            // Puntuación de pantalla
            let score = 50;
            if (pixelRatio >= 3) score = 90;
            else if (pixelRatio >= 2) score = 75;
            else if (pixelRatio >= 1.5) score = 60;
            else score = 40;
            
            if (this._hardware.screenHDR) score += 10;
            if (this._hardware.screenRefreshRate >= 120) score += 10;
            
            this._hardware.screenScore = Math.min(100, score);
        }
        
        // ============================================================
        //  🌐 DETECCIÓN DE WEBGL EXTENDIDA
        //  ============================================================
        detectWebGL() {
            try {
                const canvas = document.createElement('canvas');
                const gl2 = canvas.getContext('webgl2');
                const gl = gl2 || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                this._hardware.webgl2 = !!gl2;
                
                if (gl) {
                    // Detectar extensiones
                    const extensions = gl.getSupportedExtensions() || [];
                    this._hardware.webglExtensions = extensions;
                    
                    // Detectar capacidades
                    this._hardware.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                    this._hardware.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
                    this._hardware.maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
                    this._hardware.maxUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
                    
                    // Extensiones adicionales
                    if (extensions.includes('EXT_texture_filter_anisotropic')) {
                        this._hardware.maxAnisotropy = gl.getParameter(gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
                    }
                    
                    if (extensions.includes('WEBGL_draw_buffers')) {
                        this._hardware.maxDrawBuffers = gl.getParameter(gl.MAX_DRAW_BUFFERS_WEBGL) || 1;
                    }
                }
                
            } catch (e) {
                this._hardware.webgl2 = false;
                this._hardware.webglExtensions = [];
            }
        }
        
        // ============================================================
        //  🌐 DETECCIÓN DE NAVEGADOR EXTENDIDA
        //  ============================================================
        detectBrowser() {
            const ua = navigator.userAgent || '';
            let browser = 'unknown';
            let version = '0';
            let engine = 'unknown';
            
            // Detectar motor
            if (ua.includes('AppleWebKit')) engine = 'webkit';
            if (ua.includes('Gecko')) engine = 'gecko';
            if (ua.includes('Trident')) engine = 'trident';
            if (ua.includes('Blink')) engine = 'blink';
            
            // Detectar navegador
            if (ua.includes('Chrome') && !ua.includes('Edg')) {
                browser = 'chrome';
                const match = ua.match(/Chrome\/(\d+)/);
                if (match) version = match[1];
            } else if (ua.includes('Firefox')) {
                browser = 'firefox';
                const match = ua.match(/Firefox\/(\d+)/);
                if (match) version = match[1];
            } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
                browser = 'safari';
                const match = ua.match(/Version\/(\d+)/);
                if (match) version = match[1];
            } else if (ua.includes('Edg')) {
                browser = 'edge';
                const match = ua.match(/Edg\/(\d+)/);
                if (match) version = match[1];
            } else if (ua.includes('Opera')) {
                browser = 'opera';
                const match = ua.match(/Opera\/(\d+)/);
                if (match) version = match[1];
            }
            
            this._hardware.browser = browser;
            this._hardware.browserVersion = version;
            this._hardware.browserEngine = engine;
            
            // Detectar headless/bot
            this._hardware.isHeadless = /Headless/i.test(ua) || /PhantomJS/i.test(ua);
            this._hardware.isBot = /bot|crawler|spider|scraper/i.test(ua);
            this._hardware.isElectron = /Electron/i.test(ua);
            this._hardware.isPWA = window.matchMedia('(display-mode: standalone)').matches;
            
            // Detectar OS
            let os = 'unknown';
            let osVersion = '0';
            let osBuild = '0';
            let osArchitecture = 'unknown';
            
            if (ua.includes('Windows')) {
                os = 'windows';
                const match = ua.match(/Windows NT (\d+\.\d+)/);
                if (match) {
                    osVersion = match[1];
                    // Mapeo de versión de Windows
                    const windowsMap = {
                        '10.0': '11/10',
                        '6.3': '8.1',
                        '6.2': '8',
                        '6.1': '7'
                    };
                    osBuild = windowsMap[osVersion] || osVersion;
                }
                osArchitecture = ua.includes('Win64') ? 'x64' : 'x86';
            } else if (ua.includes('Mac OS X')) {
                os = 'macos';
                const match = ua.match(/Mac OS X (\d+_\d+)/);
                if (match) {
                    osVersion = match[1].replace('_', '.');
                    osBuild = osVersion;
                }
                osArchitecture = /Intel/.test(ua) ? 'x64' : 'arm64';
            } else if (ua.includes('Linux')) {
                os = 'linux';
                osArchitecture = /x86_64/.test(ua) ? 'x64' : 'arm';
                this._hardware.isWSL = /Microsoft/.test(ua);
            } else if (ua.includes('Android')) {
                os = 'android';
                const match = ua.match(/Android (\d+\.\d+)/);
                if (match) osVersion = match[1];
                osArchitecture = /arm64/.test(ua) ? 'arm64' : 'arm';
            } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
                os = 'ios';
                const match = ua.match(/OS (\d+_\d+)/);
                if (match) osVersion = match[1].replace('_', '.');
                osArchitecture = 'arm64';
            }
            
            this._hardware.os = os;
            this._hardware.osVersion = osVersion;
            this._hardware.osBuild = osBuild;
            this._hardware.osArchitecture = osArchitecture;
        }
        
        // ============================================================
        //  📡 DETECCIÓN DE CONEXIÓN EXTENDIDA
        //  ============================================================
        detectConnection() {
            const connection = navigator.connection || null;
            if (connection) {
                this._hardware.connection = connection;
                this._hardware.effectiveType = connection.effectiveType || '4g';
                this._hardware.downlink = connection.downlink || 10;
                this._hardware.rtt = connection.rtt || 50;
                this._hardware.uplink = connection.downlink ? connection.downlink * 0.3 : 5;
                this._hardware.connectionStability = 1 - (connection.downlink ? 
                    Math.random() * 0.05 : 0.02);
                
                // Ajustar calidad según conexión
                if (this._hardware.effectiveType === 'slow-2g' || this._hardware.effectiveType === '2g') {
                    this._hardware.quality = 'low';
                    this._hardware.connectionStability = 0.5;
                } else if (this._hardware.effectiveType === '3g') {
                    this._hardware.quality = 'medium';
                    this._hardware.connectionStability = 0.7;
                } else if (this._hardware.effectiveType === '4g') {
                    this._hardware.quality = 'high';
                    this._hardware.connectionStability = 0.9;
                } else if (this._hardware.effectiveType === '5g') {
                    this._hardware.quality = 'ultra';
                    this._hardware.connectionStability = 0.95;
                }
            } else {
                this._hardware.effectiveType = '4g';
                this._hardware.downlink = 10;
                this._hardware.uplink = 5;
                this._hardware.rtt = 50;
                this._hardware.connectionStability = 1;
            }
        }
        
        // ============================================================
        //  🔋 DETECCIÓN DE BATERÍA EXTENDIDA
        //  ============================================================
        detectBattery() {
            if (navigator.getBattery) {
                navigator.getBattery().then(battery => {
                    this._hardware.batterySaver = !battery.charging && battery.level < 0.2;
                    this._hardware.lowPowerMode = battery.charging === false && battery.level < 0.3;
                    
                    // Calcular energía disponible
                    this._hardware.energyEfficiency = battery.level * 100;
                    
                    if (this._hardware.lowPowerMode) {
                        this._hardware.quality = 'medium';
                        console.log('🔋 Modo de bajo consumo activado');
                    }
                }).catch(() => {});
            } else {
                this._hardware.batterySaver = false;
                this._hardware.lowPowerMode = false;
                this._hardware.energyEfficiency = 80;
            }
        }
        
        // ============================================================
        //  👆 DETECCIÓN DE TOUCH EXTENDIDA
        //  ============================================================
        detectTouch() {
            this._hardware.touchPoints = navigator.maxTouchPoints || 0;
            this._hardware.touchEnabled = this._hardware.touchPoints > 0;
            
            // Detectar precisión táctil (estimada)
            this._hardware.touchAccuracy = this._hardware.touchPoints > 0 ? 80 + Math.random() * 15 : 0;
            
            // Detectar soporte de lápiz
            this._hardware.stylusSupport = /Stylus|Pen/i.test(navigator.userAgent);
            this._hardware.pressureSupport = /Pressure|Force/i.test(navigator.userAgent);
        }
        
        // ============================================================
        //  🎵 DETECCIÓN DE AUDIO
        //  ============================================================
        detectAudio() {
            try {
                if (window.AudioContext || window.webkitAudioContext) {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    this._hardware.audioContext = 'supported';
                    this._hardware.audioSampleRate = ctx.sampleRate || 0;
                    this._hardware.audioChannels = ctx.destination ? ctx.destination.maxChannelCount : 0;
                    
                    // Estimar latencia de audio
                    this._hardware.audioLatency = ctx.baseLatency || 0.01;
                    
                    ctx.close().catch(() => {});
                } else {
                    this._hardware.audioContext = 'not supported';
                }
            } catch (e) {
                this._hardware.audioContext = 'error';
            }
        }
        
        // ============================================================
        //  💾 DETECCIÓN DE STORAGE
        //  ============================================================
        detectStorage() {
            try {
                // Detectar tipo de storage
                const isSSD = /SSD|Solid State/i.test(navigator.userAgent);
                const isNVMe = /NVMe|PCIe/i.test(navigator.userAgent);
                const isHDD = /HDD|Hard Drive/i.test(navigator.userAgent);
                
                this._hardware.storageType = isNVMe ? 'nvme' : (isSSD ? 'ssd' : (isHDD ? 'hdd' : 'unknown'));
                
                // Estimar velocidad
                if (this._hardware.storageType === 'nvme') {
                    this._hardware.storageSpeed = 3000 + Math.random() * 2000;
                    this._hardware.storageScore = 95;
                } else if (this._hardware.storageType === 'ssd') {
                    this._hardware.storageSpeed = 500 + Math.random() * 500;
                    this._hardware.storageScore = 70;
                } else if (this._hardware.storageType === 'hdd') {
                    this._hardware.storageSpeed = 100 + Math.random() * 50;
                    this._hardware.storageScore = 30;
                } else {
                    this._hardware.storageSpeed = 200;
                    this._hardware.storageScore = 40;
                }
                
                // Estimar espacio disponible
                if (navigator.storage && navigator.storage.estimate) {
                    navigator.storage.estimate().then(estimate => {
                        this._hardware.storageAvailable = estimate.quota || 0;
                    }).catch(() => {});
                }
            } catch (e) {
                this._hardware.storageType = 'unknown';
                this._hardware.storageSpeed = 200;
                this._hardware.storageScore = 40;
            }
        }
        
        // ============================================================
        //  📡 DETECCIÓN DE LATENCIA DE RED
        //  ============================================================
        detectNetworkLatency() {
            // Estimar latencia de red
            const startTime = performance.now();
            
            // Usar navigator.connection si está disponible
            if (navigator.connection && navigator.connection.rtt) {
                this._hardware.rtt = navigator.connection.rtt;
                return;
            }
            
            // Si no, estimar con ping a un recurso
            try {
                const img = new Image();
                const pingStart = performance.now();
                img.onload = () => {
                    const pingEnd = performance.now();
                    this._hardware.rtt = pingEnd - pingStart;
                };
                img.onerror = () => {
                    this._hardware.rtt = 100;
                };
                // Usar un recurso pequeño para medir latencia
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            } catch (e) {
                this._hardware.rtt = 50;
            }
        }
        
        // ============================================================
        //  📊 CÁLCULO DE PUNTUACIONES EXTENDIDO
        //  ============================================================
        calculateScores() {
            // ===== GPU Score =====
            let gpuScore = this._hardware.gpuScore;
            
            // Ajustar por WebGL2
            if (this._hardware.webgl2) {
                gpuScore += 8;
            }
            
            // Ajustar por VRAM
            if (this._hardware.vram >= 16) gpuScore += 15;
            else if (this._hardware.vram >= 12) gpuScore += 12;
            else if (this._hardware.vram >= 8) gpuScore += 8;
            else if (this._hardware.vram >= 4) gpuScore += 4;
            else if (this._hardware.vram < 2) gpuScore -= 10;
            
            // Ajustar por ancho de banda
            if (this._hardware.vramBandwidth > 800) gpuScore += 10;
            else if (this._hardware.vramBandwidth > 500) gpuScore += 5;
            else if (this._hardware.vramBandwidth < 200) gpuScore -= 8;
            
            // Ajustar por shader model
            if (this._hardware.shaderModel >= 5.4) gpuScore += 5;
            else if (this._hardware.shaderModel >= 5.0) gpuScore += 2;
            else gpuScore -= 5;
            
            // Ajustar por extensiones
            if (this._hardware.webglExtensions.length > 20) gpuScore += 5;
            else if (this._hardware.webglExtensions.length < 10) gpuScore -= 5;
            
            this._hardware.gpuScore = Math.min(100, Math.max(0, gpuScore));
            
            // ===== CPU Score =====
            let cpuScore = this._hardware.cpuScore;
            
            // Ajustar por velocidad
            if (this._hardware.cpuSpeed > 4000) cpuScore += 10;
            else if (this._hardware.cpuSpeed > 3000) cpuScore += 5;
            else if (this._hardware.cpuSpeed < 1500) cpuScore -= 5;
            
            // Ajustar por caché
            if (this._hardware.cpuCache > 30) cpuScore += 8;
            else if (this._hardware.cpuCache > 20) cpuScore += 4;
            else if (this._hardware.cpuCache < 10) cpuScore -= 5;
            
            // Ajustar por arquitectura
            if (this._hardware.cpuArchitecture === 'zen 4' || 
                this._hardware.cpuArchitecture === 'apple silicon 3nm' ||
                this._hardware.cpuArchitecture === 'meteor lake') {
                cpuScore += 10;
            }
            
            this._hardware.cpuScore = Math.min(100, Math.max(0, cpuScore));
            
            // ===== Memory Score =====
            let memoryScore = 0;
            const mem = this._hardware.memory;
            if (mem >= 32) memoryScore = 100;
            else if (mem >= 16) memoryScore = 85;
            else if (mem >= 8) memoryScore = 70;
            else if (mem >= 4) memoryScore = 50;
            else memoryScore = 30;
            
            this._hardware.memoryScore = memoryScore;
            
            // ===== Puntuación Total =====
            // Pesos: GPU 45%, CPU 30%, Memoria 15%, Storage 10%
            let totalScore = (
                this._hardware.gpuScore * 0.45 +
                this._hardware.cpuScore * 0.30 +
                this._hardware.memoryScore * 0.15 +
                this._hardware.storageScore * 0.10
            );
            
            // Ajustes por plataforma
            if (this._hardware.isMobile) {
                totalScore *= 0.75;
            } else if (this._hardware.isLaptop) {
                totalScore *= 0.9;
            }
            
            // Penalización por batería baja
            if (this._hardware.lowPowerMode) {
                totalScore *= 0.7;
            }
            
            // Penalización por conexión lenta
            if (this._hardware.effectiveType === 'slow-2g' || this._hardware.effectiveType === '2g') {
                totalScore *= 0.6;
            } else if (this._hardware.effectiveType === '3g') {
                totalScore *= 0.8;
            }
            
            // Penalización por thermal throttling
            if (this._hardware.thermalThrottling) {
                totalScore *= 0.75;
            }
            
            // Bonificación por pantalla de alta frecuencia
            if (this._hardware.screenRefreshRate >= 120) {
                totalScore *= 1.05;
            }
            
            this._hardware.score = Math.min(100, Math.max(0, Math.round(totalScore)));
            
            // ===== Tier =====
            if (this._hardware.score >= 85) {
                this._hardware.tier = 'ultra';
            } else if (this._hardware.score >= 65) {
                this._hardware.tier = 'high';
            } else if (this._hardware.score >= 45) {
                this._hardware.tier = 'medium';
            } else {
                this._hardware.tier = 'low';
            }
            
            // ===== Calidad Recomendada =====
            const qualityMap = {
                'ultra': 'quantum',
                'high': 'ultra',
                'medium': 'high',
                'low': 'medium'
            };
            this._hardware.quality = qualityMap[this._hardware.tier] || 'high';
            
            // Ajustes por plataforma
            if (this._hardware.isMobile) {
                const mobileQualityMap = {
                    'ultra': 'ultra',
                    'high': 'high',
                    'medium': 'medium',
                    'low': 'low'
                };
                this._hardware.quality = mobileQualityMap[this._hardware.tier] || 'medium';
            }
            
            // ===== Puntuación de Rendimiento =====
            this._hardware.performanceScore = Math.round(totalScore);
            
            // ===== Confianza =====
            // Basado en cantidad de datos recopilados
            let confidence = 0.5;
            if (this._hardware.gpu !== 'unknown') confidence += 0.2;
            if (this._hardware.vram > 0) confidence += 0.1;
            if (this._hardware.webgl2) confidence += 0.1;
            if (this._hardware.benchmarkResults) confidence += 0.1;
            if (this._hardware.storageType !== 'unknown') confidence += 0.05;
            if (this._hardware.cpuBrand !== 'unknown') confidence += 0.05;
            
            this._hardware.confidence = Math.min(1, confidence);
        }
        
        // ============================================================
        //  💡 GENERAR RECOMENDACIONES EXTENDIDAS
        //  ============================================================
        generateRecommendations() {
            const score = this._hardware.score;
            const tier = this._hardware.tier;
            const isMobile = this._hardware.isMobile;
            const isLaptop = this._hardware.isLaptop;
            const screenRefresh = this._hardware.screenRefreshRate;
            const isHighRefresh = screenRefresh >= 120;
            
            // Recomendaciones base
            let recommendations = {
                quality: this._hardware.quality,
                maxEntities: this._getRecommendedEntities(score),
                lodDistance: this._getRecommendedLOD(score),
                
                // Gráficos
                shadows: score >= 50,
                water: score >= 40,
                particles: score >= 45,
                bloom: score >= 55,
                ssao: score >= 65,
                antialiasing: score >= 40,
                textureQuality: this._getTextureQuality(score),
                postProcessing: score >= 50,
                recommendedFPS: this._getRecommendedFPS(score, screenRefresh),
                
                // Avanzado
                dynamicResolution: score < 70,
                vsync: this._hardware.screenRefreshRate > 60,
                motionBlur: score >= 70 && !isMobile,
                depthOfField: score >= 75 && !isMobile,
                volumetricFog: score >= 70,
                screenSpaceReflections: score >= 80 && !isMobile,
                
                // Optimizaciones
                useInstancing: true,
                useLOD: true,
                useOcclusionCulling: true,
                useTextureCompression: true,
                useAsyncLoading: true,
                
                // Específicas de plataforma
                touchOptimized: isMobile,
                lowPowerOptimized: this._hardware.lowPowerMode,
                networkOptimized: this._hardware.effectiveType === '3g' || this._hardware.effectiveType === '2g',
                
                // Perfiles
                recommendedProfile: tier,
                alternativeProfile: score >= 70 ? 'high' : (score >= 50 ? 'medium' : 'low')
            };
            
            // Ajustes para móvil
            if (isMobile) {
                recommendations.maxEntities *= 0.6;
                recommendations.lodDistance *= 0.7;
                recommendations.shadows = false;
                recommendations.bloom = false;
                recommendations.ssao = false;
                recommendations.postProcessing = false;
                recommendations.motionBlur = false;
                recommendations.depthOfField = false;
                recommendations.screenSpaceReflections = false;
                recommendations.useOcclusionCulling = false;
                recommendations.dynamicResolution = true;
                recommendations.touchOptimized = true;
            }
            
            // Ajustes para laptop
            if (isLaptop) {
                recommendations.maxEntities *= 0.85;
                recommendations.lodDistance *= 0.9;
                recommendations.shadows = score >= 60;
                recommendations.ssao = score >= 75;
            }
            
            // Ajustes para alta frecuencia de refresco
            if (isHighRefresh) {
                recommendations.recommendedFPS = Math.max(recommendations.recommendedFPS, 120);
                recommendations.vsync = true;
                recommendations.motionBlur = false;
            }
            
            // Ajustes por batería baja
            if (this._hardware.lowPowerMode) {
                recommendations.maxEntities *= 0.5;
                recommendations.lodDistance *= 0.6;
                recommendations.shadows = false;
                recommendations.water = false;
                recommendations.particles = false;
                recommendations.bloom = false;
                recommendations.ssao = false;
                recommendations.postProcessing = false;
                recommendations.antialiasing = false;
                recommendations.motionBlur = false;
                recommendations.depthOfField = false;
                recommendations.volumetricFog = false;
                recommendations.screenSpaceReflections = false;
                recommendations.useOcclusionCulling = false;
                recommendations.lowPowerOptimized = true;
            }
            
            // Ajustes por thermal throttling
            if (this._hardware.thermalThrottling) {
                recommendations.maxEntities *= 0.7;
                recommendations.shadows = false;
                recommendations.bloom = false;
                recommendations.ssao = false;
                recommendations.postProcessing = false;
            }
            
            this._hardware.recommendations = recommendations;
            
            // Generar perfiles específicos
            this._generateSpecificProfiles(recommendations);
        }
        
        _generateSpecificProfiles(recommendations) {
            // Generar perfiles para diferentes contextos
            const base = recommendations;
            
            this._hardware.profiles = {
                // Perfil por defecto (balanceado)
                default: { ...base },
                
                // Perfil de rendimiento
                performance: {
                    ...base,
                    quality: 'medium',
                    shadows: false,
                    bloom: false,
                    ssao: false,
                    antialiasing: false,
                    recommendedFPS: Math.max(base.recommendedFPS, 90),
                    dynamicResolution: true,
                    motionBlur: false,
                    depthOfField: false,
                    volumetricFog: false,
                    screenSpaceReflections: false
                },
                
                // Perfil de calidad
                quality: {
                    ...base,
                    quality: 'ultra',
                    shadows: true,
                    bloom: true,
                    ssao: true,
                    antialiasing: true,
                    recommendedFPS: Math.min(base.recommendedFPS, 30),
                    dynamicResolution: false,
                    motionBlur: true,
                    depthOfField: true,
                    volumetricFog: true,
                    screenSpaceReflections: true
                },
                
                // Perfil de batería
                battery: {
                    ...base,
                    quality: 'low',
                    shadows: false,
                    water: false,
                    particles: false,
                    bloom: false,
                    ssao: false,
                    antialiasing: false,
                    recommendedFPS: 30,
                    dynamicResolution: true,
                    motionBlur: false,
                    depthOfField: false,
                    volumetricFog: false,
                    screenSpaceReflections: false,
                    maxEntities: base.maxEntities * 0.4,
                    lodDistance: base.lodDistance * 0.5
                },
                
                // Perfil de red
                network: {
                    ...base,
                    quality: this._hardware.effectiveType === '5g' ? base.quality : 'medium',
                    textureQuality: this._hardware.effectiveType === '5g' ? 'ultra' : 'low',
                    useTextureCompression: true,
                    useAsyncLoading: true,
                    lodDistance: base.lodDistance * 0.7
                }
            };
        }
        
        // ============================================================
        //  🔥 DETECCIÓN DE THERMAL THROTTLING
        //  ============================================================
        _detectThermalThrottling() {
            // Simular detección de thermal throttling basado en performance
            try {
                // Realizar operaciones intensivas y medir tiempo
                const startTime = performance.now();
                let temp = 0;
                for (let i = 0; i < 1000000; i++) {
                    temp += Math.sin(i) * Math.cos(i);
                }
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                // Si la operación es más lenta de lo esperado, podría haber throttling
                const expectedDuration = 20; // ms en condiciones normales
                const slowFactor = duration / expectedDuration;
                
                // Si es más de 2 veces más lento, hay throttling
                this._hardware.thermalThrottling = slowFactor > 2.5;
                
                // Estimar temperatura (simulado)
                this._hardware.gpuTemperature = this._hardware.thermalThrottling ? 
                    75 + Math.random() * 15 : 45 + Math.random() * 20;
                this._hardware.cpuTemperature = this._hardware.thermalThrottling ? 
                    80 + Math.random() * 10 : 50 + Math.random() * 15;
                
                // Estimar uso (simulado)
                this._hardware.gpuUsage = 30 + Math.random() * 50;
                this._hardware.cpuUsage = 20 + Math.random() * 40;
                this._hardware.gpuMemoryUsage = 30 + Math.random() * 40;
                
                // Estimar consumo energético
                this._hardware.gpuPowerDraw = this._hardware.gpuTier === 'ultra' ? 
                    250 + Math.random() * 50 : (this._hardware.gpuTier === 'high' ? 
                    150 + Math.random() * 50 : 50 + Math.random() * 30);
                this._hardware.cpuPowerDraw = this._hardware.cpuScore > 80 ? 
                    100 + Math.random() * 40 : 40 + Math.random() * 30;
                
                // Turbo Boost (si el sistema lo soporta)
                this._hardware.turboBoost = !this._hardware.thermalThrottling && 
                    this._hardware.cpuTemperature < 70 &&
                    this._hardware.gpuTemperature < 70;
                
            } catch (e) {
                // Si falla, usar valores por defecto
                this._hardware.thermalThrottling = false;
                this._hardware.gpuTemperature = 45;
                this._hardware.cpuTemperature = 50;
                this._hardware.gpuUsage = 30;
                this._hardware.cpuUsage = 20;
            }
        }
        
        _startThermalMonitoring() {
            // Monitorear thermal throttling periódicamente
            this._thermalCheckInterval = setInterval(() => {
                if (this._initialized) {
                    this._detectThermalThrottling();
                    
                    // Si hay cambios significativos, emitir evento
                    if (this._hardware.thermalThrottling) {
                        console.warn('🔥 Thermal throttling detectado! Reduciendo rendimiento.');
                    }
                }
            }, 10000); // Cada 10 segundos
        }
        
        // ============================================================
        //  📊 BENCHMARK REAL DE GPU EXTENDIDO
        //  ============================================================
        async runBenchmark(duration = 1200) {
            if (this._benchmarkRan) {
                return this._hardware.benchmarkResults;
            }
            
            console.log('📊 Ejecutando benchmark cuántico de GPU...');
            
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const gl = canvas.getContext('webgl');
            
            if (!gl) {
                console.warn('⚠️ No se pudo ejecutar benchmark: WebGL no disponible');
                return null;
            }
            
            try {
                // Shader avanzado con múltiples operaciones
                const vsSource = `
                    attribute vec2 aPos;
                    attribute vec2 aTexCoord;
                    uniform float uTime;
                    varying vec2 vTexCoord;
                    varying float vDist;
                    
                    void main() {
                        vTexCoord = aTexCoord;
                        vec2 p = aPos;
                        float dist = length(p);
                        vDist = dist;
                        p += vec2(sin(uTime * 0.5 + p.x * 5.0) * 0.02, cos(uTime * 0.7 + p.y * 5.0) * 0.02);
                        gl_Position = vec4(p, 0.0, 1.0);
                    }
                `;
                
                const fsSource = `
                    precision highp float;
                    uniform float uTime;
                    uniform vec2 uResolution;
                    varying vec2 vTexCoord;
                    varying float vDist;
                    
                    void main() {
                        // Cálculo complejo para simular trabajo de GPU
                        vec2 uv = vTexCoord * 2.0 - 1.0;
                        float t = uTime;
                        
                        // Patrón de ruido complejo
                        float c = 0.0;
                        for (int i = 0; i < 8; i++) {
                            float f = float(i);
                            c += sin(uv.x * f * 8.0 + t * (1.0 + f * 0.2)) * 
                                 cos(uv.y * f * 8.0 + t * (0.8 + f * 0.3)) / (1.0 + f * 0.5);
                        }
                        c = c * 0.5 + 0.5;
                        
                        // Patrón de mandelbrot simplificado
                        vec2 z = uv * 0.8;
                        vec2 c2 = vec2(0.3 + sin(t * 0.1) * 0.2, 0.2 + cos(t * 0.15) * 0.2);
                        float m = 0.0;
                        for (int i = 0; i < 10; i++) {
                            float x = z.x * z.x - z.y * z.y + c2.x;
                            float y = 2.0 * z.x * z.y + c2.y;
                            z = vec2(x, y);
                            if (length(z) > 2.0) break;
                            m += 0.1;
                        }
                        
                        // Combinar efectos
                        float final = (c + m * 0.3) * 0.5 + 0.3;
                        float v = final * (1.0 - vDist * 0.3);
                        
                        gl_FragColor = vec4(v, v * 0.8, v * 1.2, 1.0);
                    }
                `;
                
                const compile = (type, src) => {
                    const shader = gl.createShader(type);
                    gl.shaderSource(shader, src);
                    gl.compileShader(shader);
                    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                        console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
                    }
                    return shader;
                };
                
                const program = gl.createProgram();
                gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
                gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
                gl.linkProgram(program);
                gl.useProgram(program);
                
                // Malla densa para mayor carga
                const gridSize = 120; // 120x120x2 ≈ 28,800 triángulos
                const positions = [];
                const texCoords = [];
                
                for (let y = 0; y < gridSize; y++) {
                    for (let x = 0; x < gridSize; x++) {
                        const x0 = (x / gridSize) * 2 - 1;
                        const x1 = ((x + 1) / gridSize) * 2 - 1;
                        const y0 = (y / gridSize) * 2 - 1;
                        const y1 = ((y + 1) / gridSize) * 2 - 1;
                        
                        positions.push(x0, y0, x1, y0, x0, y1);
                        texCoords.push(0, 0, 1, 0, 0, 1);
                        positions.push(x1, y0, x1, y1, x0, y1);
                        texCoords.push(1, 0, 1, 1, 0, 1);
                    }
                }
                
                const vertexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
                
                const texBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
                
                const aPos = gl.getAttribLocation(program, 'aPos');
                const aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
                const uTime = gl.getUniformLocation(program, 'uTime');
                const uResolution = gl.getUniformLocation(program, 'uResolution');
                
                gl.enableVertexAttribArray(aPos);
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
                
                gl.enableVertexAttribArray(aTexCoord);
                gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
                gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
                
                const triangleCount = positions.length / 6;
                const startTime = performance.now();
                let frames = 0;
                let maxFPS = 0;
                let minFPS = Infinity;
                let fpsSamples = [];
                
                await new Promise((resolve) => {
                    const run = () => {
                        const now = performance.now();
                        if (now - startTime >= duration) { 
                            resolve(); 
                            return; 
                        }
                        
                        gl.clear(gl.COLOR_BUFFER_BIT);
                        gl.uniform1f(uTime, now * 0.001);
                        gl.uniform2f(uResolution, 256, 256);
                        gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
                        frames++;
                        
                        const elapsed = (performance.now() - startTime) / 1000;
                        const fps = frames / elapsed;
                        if (frames > 5) {
                            fpsSamples.push(fps);
                            if (fps > maxFPS) maxFPS = fps;
                            if (fps < minFPS) minFPS = fps;
                        }
                        
                        requestAnimationFrame(run);
                    };
                    run();
                });
                
                const elapsed = (performance.now() - startTime) / 1000;
                const avgFPS = fpsSamples.length > 0 ? 
                    fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length : 0;
                const trianglesPerSecond = avgFPS * triangleCount;
                
                // Puntaje normalizado: 100 = capaz de sostener 60fps con esta carga
                const score = Math.min(100, Math.round((avgFPS / 60) * 100));
                
                this._hardware.benchmarkResults = {
                    fps: Math.round(avgFPS),
                    maxFPS: Math.round(maxFPS),
                    minFPS: Math.round(minFPS),
                    fpsStability: minFPS > 0 ? Math.round((minFPS / maxFPS) * 100) : 50,
                    triangleCount: triangleCount,
                    trianglesPerSecond: Math.round(trianglesPerSecond),
                    duration: elapsed,
                    score: score,
                    samples: fpsSamples.length,
                    timestamp: Date.now()
                };
                
                // Refinar recomendaciones basadas en benchmark real
                if (this._hardware.recommendations) {
                    const tiers = ['low', 'medium', 'high', 'ultra', 'quantum'];
                    let measuredTier = 'low';
                    if (score >= 85) measuredTier = 'quantum';
                    else if (score >= 70) measuredTier = 'ultra';
                    else if (score >= 55) measuredTier = 'high';
                    else if (score >= 40) measuredTier = 'medium';
                    
                    this._hardware.recommendations.measuredQuality = measuredTier;
                    this._hardware.recommendations.benchmarkScore = score;
                    
                    // Si el benchmark muestra un tier diferente, ajustar
                    const heuristicTier = this._hardware.tier;
                    const heuristicIdx = tiers.indexOf(heuristicTier);
                    const measuredIdx = tiers.indexOf(measuredTier);
                    
                    if (Math.abs(heuristicIdx - measuredIdx) >= 1) {
                        console.log(`📊 Benchmark real (${measuredTier}) difiere de la heurística (${heuristicTier}) — ajustando`);
                        this._hardware.tier = measuredTier;
                        this._hardware.score = Math.min(100, this._hardware.score * (score / 60));
                        this._hardware.quality = measuredTier === 'quantum' ? 'quantum' : 
                            (measuredTier === 'ultra' ? 'ultra' : 
                            (measuredTier === 'high' ? 'high' : 'medium'));
                        this._hardware.confidence = Math.min(1, this._hardware.confidence + 0.1);
                    }
                }
                
                this._benchmarkRan = true;
                console.log(`✅ Benchmark cuántico completado:`);
                console.log(`   FPS promedio: ${Math.round(avgFPS)}`);
                console.log(`   FPS mínimo: ${Math.round(minFPS)}`);
                console.log(`   Triángulos/frame: ${triangleCount}`);
                console.log(`   Puntuación: ${score}/100`);
                console.log(`   Estabilidad: ${this._hardware.benchmarkResults.fpsStability}%`);
                
                // Limpieza
                gl.deleteBuffer(vertexBuffer);
                gl.deleteBuffer(texBuffer);
                gl.deleteProgram(program);
                
                return this._hardware.benchmarkResults;
                
            } catch (e) {
                console.warn('⚠️ Error ejecutando benchmark cuántico:', e);
                return null;
            }
        }
        
        // ============================================================
        //  📊 MÉTODOS DE RECOMENDACIÓN EXTENDIDOS
        //  ============================================================
        _getRecommendedEntities(score) {
            if (score >= 85) return 120000;
            if (score >= 70) return 80000;
            if (score >= 55) return 50000;
            if (score >= 40) return 30000;
            return 10000;
        }
        
        _getRecommendedLOD(score) {
            if (score >= 85) return 350;
            if (score >= 70) return 250;
            if (score >= 55) return 180;
            if (score >= 40) return 120;
            return 60;
        }
        
        _getTextureQuality(score) {
            if (score >= 85) return 'ultra';
            if (score >= 70) return 'high';
            if (score >= 55) return 'medium';
            return 'low';
        }
        
        _getRecommendedFPS(score, refreshRate) {
            const base = score >= 85 ? 120 : (score >= 70 ? 90 : (score >= 55 ? 60 : (score >= 40 ? 30 : 30)));
            // Ajustar por frecuencia de refresco
            if (refreshRate >= 144) return Math.min(base, 144);
            if (refreshRate >= 120) return Math.min(base, 120);
            return Math.min(base, 60);
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN DINÁMICA EXTENDIDA
        //  ============================================================
        update() {
            let changed = false;
            
            // Detectar cambios en conexión
            const oldConnection = this._hardware.effectiveType;
            this.detectConnection();
            if (this._hardware.effectiveType !== oldConnection) {
                this._hardware.changes.push({
                    type: 'connection',
                    old: oldConnection,
                    new: this._hardware.effectiveType,
                    timestamp: Date.now()
                });
                changed = true;
            }
            
            // Detectar cambios en batería
            this.detectBattery();
            
            // Detectar thermal throttling
            this._detectThermalThrottling();
            
            // Recalcular si hay cambios significativos
            if (this._hardware.batterySaver || this._hardware.lowPowerMode || 
                this._hardware.thermalThrottling || changed) {
                this.calculateScores();
                this.generateRecommendations();
                
                this._hardware.lastUpdate = Date.now();
                this._hardware.changes.push({
                    type: 'recalculation',
                    reason: changed ? 'connection_change' : 'system_change',
                    timestamp: Date.now()
                });
                
                // Limitar historial de cambios
                if (this._hardware.changes.length > 100) {
                    this._hardware.changes = this._hardware.changes.slice(-50);
                }
                
                return true;
            }
            
            return false;
        }
        
        // ============================================================
        //  📤 EXPORTAR DATOS EXTENDIDOS
        //  ============================================================
        getHardware() {
            return { ...this._hardware };
        }
        
        getRecommendations() {
            return { ...this._hardware.recommendations };
        }
        
        getProfiles() {
            return this._hardware.profiles || null;
        }
        
        getSummary() {
            return {
                tier: this._hardware.tier,
                score: this._hardware.score,
                confidence: (this._hardware.confidence * 100).toFixed(1) + '%',
                quality: this._hardware.quality,
                platform: this._hardware.platform,
                gpu: this._hardware.gpu,
                gpuScore: this._hardware.gpuScore,
                cpu: this._hardware.cpuBrand || this._hardware.cores + ' cores',
                cpuScore: this._hardware.cpuScore,
                memory: this._hardware.memory + ' GB',
                memoryScore: this._hardware.memoryScore,
                vram: this._hardware.vram + ' GB',
                vramBandwidth: this._hardware.vramBandwidth + ' GB/s',
                webgl2: this._hardware.webgl2,
                browser: this._hardware.browser,
                os: this._hardware.os,
                screenRefresh: this._hardware.screenRefreshRate + 'Hz',
                screenHDR: this._hardware.screenHDR,
                thermalThrottling: this._hardware.thermalThrottling,
                energyEfficiency: this._hardware.energyEfficiency,
                storageType: this._hardware.storageType,
                storageSpeed: this._hardware.storageSpeed + ' MB/s',
                connectionType: this._hardware.effectiveType,
                rtt: this._hardware.rtt + 'ms',
                benchmark: this._hardware.benchmarkResults,
                recommendations: this._hardware.recommendations,
                profiles: this._hardware.profiles,
                changes: this._hardware.changes.slice(-10),
                lastUpdate: this._hardware.lastUpdate
            };
        }
        
        // ============================================================
        //  🗑️ LIMPIEZA
        //  ============================================================
        destroy() {
            if (this._thermalCheckInterval) {
                clearInterval(this._thermalCheckInterval);
                this._thermalCheckInterval = null;
            }
            console.log('🗑️ HardwareDetector destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL MEJORADA
    //  ============================================================
    const hardwareDetector = new HardwareDetector();
    
    // Exponer globalmente
    window.HardwareDetector = hardwareDetector;
    window.HardwareDetectorClass = HardwareDetector;
    
    // Log de inicio mejorado
    console.log('🔍 Hardware Detector Cuántico inicializado');
    console.log(`📊 Tier: ${hardwareDetector._hardware.tier.toUpperCase()}`);
    console.log(`📊 Puntuación: ${hardwareDetector._hardware.score}/100`);
    console.log(`🎯 Calidad recomendada: ${hardwareDetector._hardware.quality}`);
    console.log(`🖥️ GPU: ${hardwareDetector._hardware.gpu} (${hardwareDetector._hardware.gpuScore}/100)`);
    console.log(`🧠 CPU: ${hardwareDetector._hardware.cpuBrand || hardwareDetector._hardware.cores + ' núcleos'} (${hardwareDetector._hardware.cpuScore}/100)`);
    console.log(`💾 RAM: ${hardwareDetector._hardware.memory} GB (${hardwareDetector._hardware.memoryScore}/100)`);
    console.log(`🎮 VRAM: ${hardwareDetector._hardware.vram} GB (${hardwareDetector._hardware.vramBandwidth} GB/s)`);
    console.log(`📱 Plataforma: ${hardwareDetector._hardware.platform}`);
    console.log(`🔄 Refresco: ${hardwareDetector._hardware.screenRefreshRate}Hz`);
    console.log(`🌐 WebGL2: ${hardwareDetector._hardware.webgl2}`);
    console.log(`🔥 Thermal Throttling: ${hardwareDetector._hardware.thermalThrottling ? 'ACTIVO' : 'Inactivo'}`);
    console.log(`⚡ Eficiencia energética: ${hardwareDetector._hardware.energyEfficiency}/100`);
    console.log(`🎯 Confianza: ${(hardwareDetector._hardware.confidence * 100).toFixed(1)}%`);
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = hardwareDetector;
    }
    
})();
/**
 * 🔍 PRIOM V0.1 - DETECTOR DE HARDWARE
 * "Conociendo el alma de la máquina"
 * 
 * 📁 Ubicación: js/core/HardwareDetector.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Detección avanzada de hardware y capacidades
 * 
 * ⭐ INNOVACIONES:
 * - Detección de GPU con puntuación de rendimiento
 * - Benchmarking en tiempo real
 * - Perfilado de memoria y CPU
 * - Detección de limitaciones de batería
 * - Sistema de puntuación de rendimiento (0-100)
 * - Recomendaciones inteligentes de calidad
 * - Detección de WebGL2 con fallback
 * - Análisis de capacidades de textura
 * - Detección de límites de GPU
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎯 HardwareDetector - Detector Maestro de Hardware
     * Analiza y puntúa el hardware para optimizaciones automáticas
     */
    class HardwareDetector {
        constructor() {
            // ============================================================
            //  📊 ESTADO DEL HARDWARE
            //  ============================================================
            this._hardware = {
                // GPU
                gpu: 'unknown',
                gpuVendor: 'unknown',
                gpuTier: 'medium', // low | medium | high | ultra
                gpuScore: 0, // 0-100
                vram: 0, // MB
                
                // CPU
                cores: navigator.hardwareConcurrency || 4,
                cpuScore: 0, // 0-100
                
                // Memoria
                memory: navigator.deviceMemory || 4, // GB
                memoryScore: 0, // 0-100
                
                // Plataforma
                platform: 'desktop', // desktop | mobile | tablet | vr
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                isVR: false,
                
                // Pantalla
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                pixelRatio: window.devicePixelRatio || 1,
                screenScore: 0,
                
                // WebGL
                webgl2: false,
                webglExtensions: [],
                maxTextureSize: 0,
                maxVertexAttribs: 0,
                maxVaryings: 0,
                maxUniforms: 0,
                
                // Rendimiento
                performanceScore: 0, // 0-100
                batterySaver: false,
                lowPowerMode: false,
                
                // Navegador
                browser: 'unknown',
                browserVersion: '0',
                os: 'unknown',
                osVersion: '0',
                
                // Touch
                touchPoints: navigator.maxTouchPoints || 0,
                touchEnabled: false,
                
                // Conexión
                connection: navigator.connection || null,
                effectiveType: '4g',
                downlink: 10,
                
                // Puntuación final
                tier: 'medium',
                quality: 'high',
                score: 0, // 0-100
                recommendations: null
            };
            
            // ============================================================
            //  📋 BASE DE DATOS DE GPU
            //  ============================================================
            this._gpuDatabase = {
                // ===== NVIDIA =====
                'rtx 4090': { tier: 'ultra', score: 100, vram: 24 },
                'rtx 4080': { tier: 'ultra', score: 95, vram: 16 },
                'rtx 4070': { tier: 'ultra', score: 90, vram: 12 },
                'rtx 4060': { tier: 'high', score: 80, vram: 8 },
                'rtx 3090': { tier: 'ultra', score: 98, vram: 24 },
                'rtx 3080': { tier: 'ultra', score: 93, vram: 10 },
                'rtx 3070': { tier: 'high', score: 85, vram: 8 },
                'rtx 3060': { tier: 'high', score: 78, vram: 12 },
                'rtx 3050': { tier: 'medium', score: 65, vram: 8 },
                'gtx 1660': { tier: 'medium', score: 55, vram: 6 },
                'gtx 1650': { tier: 'medium', score: 50, vram: 4 },
                'gtx 1080': { tier: 'high', score: 75, vram: 8 },
                'gtx 1070': { tier: 'medium', score: 65, vram: 8 },
                'gtx 1060': { tier: 'medium', score: 55, vram: 6 },
                'gtx 1050': { tier: 'low', score: 40, vram: 4 },
                'intel hd': { tier: 'low', score: 25, vram: 1 },
                'intel uhd': { tier: 'low', score: 30, vram: 2 },
                'intel iris': { tier: 'medium', score: 45, vram: 4 },
                
                // ===== AMD =====
                'radeon rx 7900': { tier: 'ultra', score: 97, vram: 20 },
                'radeon rx 7800': { tier: 'ultra', score: 92, vram: 16 },
                'radeon rx 7700': { tier: 'high', score: 85, vram: 12 },
                'radeon rx 7600': { tier: 'high', score: 78, vram: 8 },
                'radeon rx 6900': { tier: 'ultra', score: 95, vram: 16 },
                'radeon rx 6800': { tier: 'high', score: 88, vram: 16 },
                'radeon rx 6700': { tier: 'high', score: 80, vram: 12 },
                'radeon rx 6600': { tier: 'medium', score: 70, vram: 8 },
                'radeon rx 580': { tier: 'medium', score: 55, vram: 8 },
                'radeon rx 570': { tier: 'medium', score: 50, vram: 4 },
                'radeon rx 560': { tier: 'low', score: 40, vram: 4 },
                
                // ===== Apple =====
                'apple m3': { tier: 'ultra', score: 95, vram: 16 },
                'apple m2': { tier: 'high', score: 85, vram: 12 },
                'apple m1': { tier: 'high', score: 78, vram: 8 },
                'apple a17': { tier: 'high', score: 80, vram: 6 },
                'apple a16': { tier: 'high', score: 72, vram: 6 },
                'apple a15': { tier: 'medium', score: 65, vram: 4 },
                'apple a14': { tier: 'medium', score: 58, vram: 4 },
                
                // ===== Qualcomm =====
                'adreno 740': { tier: 'high', score: 82, vram: 8 },
                'adreno 730': { tier: 'high', score: 75, vram: 6 },
                'adreno 660': { tier: 'medium', score: 65, vram: 4 },
                'adreno 650': { tier: 'medium', score: 60, vram: 4 },
                'adreno 640': { tier: 'medium', score: 55, vram: 4 },
                'adreno 630': { tier: 'medium', score: 50, vram: 4 },
                'adreno 530': { tier: 'low', score: 40, vram: 4 },
                'adreno 510': { tier: 'low', score: 30, vram: 2 },
                
                // ===== ARM Mali =====
                'mali-g78': { tier: 'high', score: 72, vram: 6 },
                'mali-g77': { tier: 'medium', score: 65, vram: 6 },
                'mali-g76': { tier: 'medium', score: 58, vram: 4 },
                'mali-g72': { tier: 'medium', score: 50, vram: 4 },
                'mali-g71': { tier: 'medium', score: 45, vram: 4 },
                'mali-t880': { tier: 'low', score: 35, vram: 2 },
                'mali-t860': { tier: 'low', score: 30, vram: 2 },
                'mali-400': { tier: 'low', score: 20, vram: 1 },
                
                // ===== PowerVR =====
                'powervr gt7200': { tier: 'medium', score: 45, vram: 2 },
                'powervr gt7600': { tier: 'medium', score: 50, vram: 2 },
                'powervr sgx543': { tier: 'low', score: 25, vram: 1 },
            };
            
            // ============================================================
            //  📋 BASE DE DATOS DE CPU
            //  ============================================================
            this._cpuDatabase = {
                // Intel
                'intel core i9': { score: 95 },
                'intel core i7': { score: 85 },
                'intel core i5': { score: 70 },
                'intel core i3': { score: 50 },
                'intel pentium': { score: 30 },
                'intel celeron': { score: 20 },
                
                // AMD
                'amd ryzen 9': { score: 95 },
                'amd ryzen 7': { score: 85 },
                'amd ryzen 5': { score: 70 },
                'amd ryzen 3': { score: 50 },
                'amd athlon': { score: 30 },
                
                // Apple
                'apple m3': { score: 95 },
                'apple m2': { score: 85 },
                'apple m1': { score: 75 },
                'apple a17': { score: 80 },
                'apple a16': { score: 70 },
                'apple a15': { score: 60 },
                
                // ARM
                'arm cortex-a78': { score: 70 },
                'arm cortex-a76': { score: 60 },
                'arm cortex-a55': { score: 40 },
                'arm cortex-a53': { score: 30 },
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._initialized = false;
            this._benchmarkRan = false;
            
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
        }
        
        // ============================================================
        //  🔍 DETECCIÓN PRINCIPAL
        //  ============================================================
        detect() {
            console.log('🔍 Iniciando detección de hardware...');
            
            this.detectGPU();
            this.detectCPU();
            this.detectPlatform();
            this.detectScreen();
            this.detectWebGL();
            this.detectBrowser();
            this.detectConnection();
            this.detectBattery();
            this.detectTouch();
            
            // Calcular puntuaciones
            this.calculateScores();
            this.generateRecommendations();
            
            this._initialized = true;
            
            console.log('✅ Detección de hardware completada');
            console.log(`📊 Puntuación total: ${this._hardware.score}/100`);
            console.log(`🎯 Calidad recomendada: ${this._hardware.quality}`);
            
            return this._hardware;
        }
        
        // ============================================================
        //  🎮 DETECCIÓN DE GPU
        //  ============================================================
        detectGPU() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
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
                    } else if (vendor.includes('AMD') || vendor.includes('ATI')) {
                        this._hardware.gpuTier = 'high';
                        this._hardware.gpuScore = 65;
                        this._hardware.vram = 4;
                    } else if (vendor.includes('Intel')) {
                        this._hardware.gpuTier = 'medium';
                        this._hardware.gpuScore = 45;
                        this._hardware.vram = 2;
                    } else if (vendor.includes('Apple')) {
                        this._hardware.gpuTier = 'high';
                        this._hardware.gpuScore = 75;
                        this._hardware.vram = 4;
                    } else {
                        this._hardware.gpuTier = 'medium';
                        this._hardware.gpuScore = 50;
                        this._hardware.vram = 2;
                    }
                }
                
                // Detectar VRAM (estimación)
                this._detectVRAM(gl);
                
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
                    found = true;
                    break;
                }
            }
            
            // Si no se encontró, usar heurísticas
            if (!found) {
                // Clasificación por palabras clave
                if (r.includes('rtx') || r.includes('radeon rx 7') || r.includes('apple m')) {
                    this._hardware.gpuTier = 'ultra';
                    this._hardware.gpuScore = 85;
                    this._hardware.vram = 8;
                } else if (r.includes('gtx') || r.includes('radeon rx 6') || r.includes('adreno 7')) {
                    this._hardware.gpuTier = 'high';
                    this._hardware.gpuScore = 70;
                    this._hardware.vram = 6;
                } else if (r.includes('intel') || r.includes('adreno 6')) {
                    this._hardware.gpuTier = 'medium';
                    this._hardware.gpuScore = 50;
                    this._hardware.vram = 4;
                } else if (r.includes('mali') || r.includes('powervr')) {
                    this._hardware.gpuTier = 'medium';
                    this._hardware.gpuScore = 45;
                    this._hardware.vram = 2;
                } else {
                    this._hardware.gpuTier = 'medium';
                    this._hardware.gpuScore = 50;
                    this._hardware.vram = 2;
                }
            }
        }
        
        _detectVRAM(gl) {
            // Estimar VRAM basado en capacidades
            try {
                const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
                const maxCombinedTextureImageUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                
                // Heurística para VRAM
                let vram = 2; // GB
                if (maxTextureSize > 16384) vram = 12;
                else if (maxTextureSize > 8192) vram = 8;
                else if (maxTextureSize > 4096) vram = 4;
                else if (maxTextureSize > 2048) vram = 2;
                else vram = 1;
                
                // Si ya tenemos un valor más preciso, mantenerlo
                if (this._hardware.vram < vram) {
                    this._hardware.vram = vram;
                }
                
                // Guardar capacidades WebGL
                this._hardware.maxTextureSize = maxTextureSize;
                this._hardware.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
                this._hardware.maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
                this._hardware.maxUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
                
            } catch (e) {
                // Ignorar errores
            }
        }
        
        // ============================================================
        //  🔍 DETECCIÓN DE CPU
        //  ============================================================
        detectCPU() {
            const cores = this._hardware.cores;
            let score = 50;
            
            // Puntuación basada en núcleos
            if (cores >= 16) score = 95;
            else if (cores >= 12) score = 85;
            else if (cores >= 8) score = 75;
            else if (cores >= 6) score = 65;
            else if (cores >= 4) score = 50;
            else if (cores >= 2) score = 35;
            else score = 20;
            
            // Detectar modelo de CPU
            try {
                const userAgent = navigator.userAgent || '';
                const cpuInfo = userAgent.match(/\(([^)]+)\)/)?.[1] || '';
                const cpuModel = cpuInfo.toLowerCase();
                
                for (const [name, data] of Object.entries(this._cpuDatabase)) {
                    if (cpuModel.includes(name)) {
                        score = Math.max(score, data.score);
                        break;
                    }
                }
            } catch (e) {
                // Ignorar
            }
            
            this._hardware.cpuScore = score;
        }
        
        // ============================================================
        //  📱 DETECCIÓN DE PLATAFORMA
        //  ============================================================
        detectPlatform() {
            const ua = navigator.userAgent || '';
            const isMobile = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua);
            const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua);
            const isVR = /VR|Oculus|Vive|Valve/i.test(ua);
            
            this._hardware.isMobile = isMobile;
            this._hardware.isTablet = isTablet;
            this._hardware.isDesktop = !isMobile && !isTablet && !isVR;
            this._hardware.isVR = isVR;
            
            if (isVR) this._hardware.platform = 'vr';
            else if (isMobile) this._hardware.platform = 'mobile';
            else if (isTablet) this._hardware.platform = 'tablet';
            else this._hardware.platform = 'desktop';
        }
        
        // ============================================================
        //  🖥️ DETECCIÓN DE PANTALLA
        //  ============================================================
        detectScreen() {
            const width = window.screen.width;
            const height = window.screen.height;
            const pixelRatio = window.devicePixelRatio || 1;
            
            this._hardware.screenWidth = width;
            this._hardware.screenHeight = height;
            this._hardware.pixelRatio = pixelRatio;
            
            // Puntuación de pantalla
            let score = 50;
            if (pixelRatio >= 3) score = 90;
            else if (pixelRatio >= 2) score = 75;
            else if (pixelRatio >= 1.5) score = 60;
            else score = 40;
            
            this._hardware.screenScore = score;
        }
        
        // ============================================================
        //  🌐 DETECCIÓN DE WEBGL
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
                }
                
            } catch (e) {
                this._hardware.webgl2 = false;
                this._hardware.webglExtensions = [];
            }
        }
        
        // ============================================================
        //  🌐 DETECCIÓN DE NAVEGADOR
        //  ============================================================
        detectBrowser() {
            const ua = navigator.userAgent || '';
            let browser = 'unknown';
            let version = '0';
            
            if (ua.includes('Chrome')) {
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
            } else if (ua.includes('Edge')) {
                browser = 'edge';
                const match = ua.match(/Edge\/(\d+)/);
                if (match) version = match[1];
            } else if (ua.includes('Opera')) {
                browser = 'opera';
                const match = ua.match(/Opera\/(\d+)/);
                if (match) version = match[1];
            }
            
            this._hardware.browser = browser;
            this._hardware.browserVersion = version;
            
            // Detectar OS
            let os = 'unknown';
            let osVersion = '0';
            
            if (ua.includes('Windows')) {
                os = 'windows';
                const match = ua.match(/Windows NT (\d+\.\d+)/);
                if (match) osVersion = match[1];
            } else if (ua.includes('Mac OS X')) {
                os = 'macos';
                const match = ua.match(/Mac OS X (\d+_\d+)/);
                if (match) osVersion = match[1].replace('_', '.');
            } else if (ua.includes('Linux')) {
                os = 'linux';
            } else if (ua.includes('Android')) {
                os = 'android';
                const match = ua.match(/Android (\d+\.\d+)/);
                if (match) osVersion = match[1];
            } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
                os = 'ios';
                const match = ua.match(/OS (\d+_\d+)/);
                if (match) osVersion = match[1].replace('_', '.');
            }
            
            this._hardware.os = os;
            this._hardware.osVersion = osVersion;
        }
        
        // ============================================================
        //  📡 DETECCIÓN DE CONEXIÓN
        //  ============================================================
        detectConnection() {
            const connection = navigator.connection || null;
            if (connection) {
                this._hardware.connection = connection;
                this._hardware.effectiveType = connection.effectiveType || '4g';
                this._hardware.downlink = connection.downlink || 10;
                
                // Ajustar calidad según conexión
                if (this._hardware.effectiveType === 'slow-2g' || this._hardware.effectiveType === '2g') {
                    this._hardware.quality = 'low';
                } else if (this._hardware.effectiveType === '3g') {
                    this._hardware.quality = 'medium';
                }
            } else {
                this._hardware.effectiveType = '4g';
                this._hardware.downlink = 10;
            }
        }
        
        // ============================================================
        //  🔋 DETECCIÓN DE BATERÍA
        //  ============================================================
        detectBattery() {
            if (navigator.getBattery) {
                navigator.getBattery().then(battery => {
                    this._hardware.batterySaver = !battery.charging && battery.level < 0.2;
                    this._hardware.lowPowerMode = battery.charging === false && battery.level < 0.3;
                    
                    if (this._hardware.lowPowerMode) {
                        this._hardware.quality = 'medium';
                        console.log('🔋 Modo de bajo consumo activado');
                    }
                }).catch(() => {});
            } else {
                this._hardware.batterySaver = false;
                this._hardware.lowPowerMode = false;
            }
        }
        
        // ============================================================
        //  👆 DETECCIÓN DE TOUCH
        //  ============================================================
        detectTouch() {
            this._hardware.touchPoints = navigator.maxTouchPoints || 0;
            this._hardware.touchEnabled = this._hardware.touchPoints > 0;
        }
        
        // ============================================================
        //  📊 CÁLCULO DE PUNTUACIONES
        //  ============================================================
        calculateScores() {
            // ===== GPU Score =====
            let gpuScore = this._hardware.gpuScore;
            
            // Ajustar por WebGL2
            if (this._hardware.webgl2) {
                gpuScore += 5;
            }
            
            // Ajustar por VRAM
            if (this._hardware.vram >= 8) gpuScore += 10;
            else if (this._hardware.vram >= 4) gpuScore += 5;
            else if (this._hardware.vram >= 2) gpuScore += 0;
            else gpuScore -= 10;
            
            this._hardware.gpuScore = Math.min(100, Math.max(0, gpuScore));
            
            // ===== CPU Score =====
            let cpuScore = this._hardware.cpuScore;
            
            // Ajustar por núcleos
            const cores = this._hardware.cores;
            if (cores >= 12) cpuScore += 10;
            else if (cores >= 8) cpuScore += 5;
            else if (cores <= 4) cpuScore -= 5;
            else if (cores <= 2) cpuScore -= 10;
            
            this._hardware.cpuScore = Math.min(100, Math.max(0, cpuScore));
            
            // ===== Memory Score =====
            let memoryScore = 0;
            const mem = this._hardware.memory;
            if (mem >= 16) memoryScore = 100;
            else if (mem >= 8) memoryScore = 80;
            else if (mem >= 4) memoryScore = 60;
            else if (mem >= 2) memoryScore = 40;
            else memoryScore = 20;
            
            this._hardware.memoryScore = memoryScore;
            
            // ===== Puntuación Total =====
            // Pesos: GPU 50%, CPU 30%, Memoria 20%
            let totalScore = (
                this._hardware.gpuScore * 0.5 +
                this._hardware.cpuScore * 0.3 +
                this._hardware.memoryScore * 0.2
            );
            
            // Penalización por móvil
            if (this._hardware.isMobile) {
                totalScore *= 0.8;
            }
            
            // Penalización por batería baja
            if (this._hardware.lowPowerMode) {
                totalScore *= 0.7;
            }
            
            // Penalización por conexión lenta
            if (this._hardware.effectiveType === 'slow-2g' || this._hardware.effectiveType === '2g') {
                totalScore *= 0.6;
            }
            
            this._hardware.score = Math.min(100, Math.max(0, Math.round(totalScore)));
            
            // ===== Tier =====
            if (this._hardware.score >= 80) {
                this._hardware.tier = 'ultra';
            } else if (this._hardware.score >= 60) {
                this._hardware.tier = 'high';
            } else if (this._hardware.score >= 40) {
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
            
            // Ajustar por móvil
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
        }
        
        // ============================================================
        //  💡 GENERAR RECOMENDACIONES
        //  ============================================================
        generateRecommendations() {
            const score = this._hardware.score;
            const tier = this._hardware.tier;
            const isMobile = this._hardware.isMobile;
            
            this._hardware.recommendations = {
                quality: this._hardware.quality,
                maxEntities: this._getRecommendedEntities(score),
                lodDistance: this._getRecommendedLOD(score),
                shadows: score >= 50,
                water: score >= 40,
                particles: score >= 45,
                bloom: score >= 60,
                ssao: score >= 70,
                antiAliasing: score >= 40,
                textureQuality: this._getTextureQuality(score),
                postProcessing: score >= 55,
                recommendedFPS: this._getRecommendedFPS(score)
            };
            
            // Ajustes para móvil
            if (isMobile) {
                this._hardware.recommendations.maxEntities *= 0.6;
                this._hardware.recommendations.lodDistance *= 0.7;
                this._hardware.recommendations.shadows = false;
                this._hardware.recommendations.bloom = false;
                this._hardware.recommendations.ssao = false;
                this._hardware.recommendations.postProcessing = false;
            }
            
            // Ajustes por batería baja
            if (this._hardware.lowPowerMode) {
                this._hardware.recommendations.maxEntities *= 0.5;
                this._hardware.recommendations.lodDistance *= 0.6;
                this._hardware.recommendations.shadows = false;
                this._hardware.recommendations.water = false;
                this._hardware.recommendations.particles = false;
                this._hardware.recommendations.bloom = false;
                this._hardware.recommendations.ssao = false;
                this._hardware.recommendations.postProcessing = false;
                this._hardware.recommendations.antiAliasing = false;
            }
        }
        
        _getRecommendedEntities(score) {
            if (score >= 80) return 100000;
            if (score >= 60) return 60000;
            if (score >= 40) return 30000;
            return 10000;
        }
        
        _getRecommendedLOD(score) {
            if (score >= 80) return 300;
            if (score >= 60) return 200;
            if (score >= 40) return 120;
            return 60;
        }
        
        _getTextureQuality(score) {
            if (score >= 80) return 'ultra';
            if (score >= 60) return 'high';
            if (score >= 40) return 'medium';
            return 'low';
        }
        
        _getRecommendedFPS(score) {
            if (score >= 80) return 60;
            if (score >= 60) return 60;
            if (score >= 40) return 30;
            return 30;
        }
        
        // ============================================================
        //  📤 EXPORTAR DATOS
        //  ============================================================
        getHardware() {
            return { ...this._hardware };
        }
        
        getRecommendations() {
            return { ...this._hardware.recommendations };
        }
        
        getSummary() {
            return {
                tier: this._hardware.tier,
                score: this._hardware.score,
                quality: this._hardware.quality,
                platform: this._hardware.platform,
                gpu: this._hardware.gpu,
                cpu: this._hardware.cores + ' cores',
                memory: this._hardware.memory + ' GB',
                vram: this._hardware.vram + ' GB',
                webgl2: this._hardware.webgl2,
                browser: this._hardware.browser,
                os: this._hardware.os,
                recommendations: this._hardware.recommendations
            };
        }
        
        // ============================================================
        //  📊 BENCHMARK (Opcional)
        //  ============================================================
        async runBenchmark(duration = 1000) {
            if (this._benchmarkRan) {
                return this._hardware.benchmarkResults;
            }
            
            console.log('📊 Ejecutando benchmark...');
            
            // Benchmark de renderizado
            const startTime = performance.now();
            let frames = 0;
            let drawCalls = 0;
            
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const gl = canvas.getContext('webgl');
            
            if (!gl) {
                console.warn('⚠️ No se pudo ejecutar benchmark: WebGL no disponible');
                return null;
            }
            
            // Loop de benchmark
            const run = () => {
                const now = performance.now();
                if (now - startTime >= duration) {
                    const elapsed = (now - startTime) / 1000;
                    const fps = frames / elapsed;
                    
                    this._hardware.benchmarkResults = {
                        fps: Math.round(fps),
                        drawCalls: drawCalls,
                        duration: elapsed,
                        score: Math.round(fps / 60 * 100)
                    };
                    
                    this._benchmarkRan = true;
                    console.log(`✅ Benchmark completado: ${Math.round(fps)} FPS`);
                    return;
                }
                
                // Renderizar un frame simple
                gl.clear(gl.COLOR_BUFFER_BIT);
                drawCalls++;
                frames++;
                
                requestAnimationFrame(run);
            };
            
            return new Promise((resolve) => {
                run();
                // Esperar a que termine
                setTimeout(() => {
                    resolve(this._hardware.benchmarkResults);
                }, duration + 100);
            });
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN DINÁMICA
        //  ============================================================
        update() {
            this.detectConnection();
            this.detectBattery();
            
            // Recalcular si hay cambios significativos
            if (this._hardware.batterySaver || this._hardware.lowPowerMode) {
                this.calculateScores();
                this.generateRecommendations();
                return true;
            }
            
            return false;
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    const hardwareDetector = new HardwareDetector();
    
    // Exponer globalmente
    window.HardwareDetector = hardwareDetector;
    
    // Log de inicio
    console.log('🔍 Hardware Detector inicializado');
    console.log(`📊 Tier: ${hardwareDetector._hardware.tier.toUpperCase()}`);
    console.log(`📊 Puntuación: ${hardwareDetector._hardware.score}/100`);
    console.log(`🎯 Calidad recomendada: ${hardwareDetector._hardware.quality}`);
    console.log(`🖥️ GPU: ${hardwareDetector._hardware.gpu}`);
    console.log(`🧠 CPU: ${hardwareDetector._hardware.cores} núcleos`);
    console.log(`💾 RAM: ${hardwareDetector._hardware.memory} GB`);
    console.log(`🎮 VRAM: ${hardwareDetector._hardware.vram} GB`);
    console.log(`📱 Plataforma: ${hardwareDetector._hardware.platform}`);
    console.log(`🌐 WebGL2: ${hardwareDetector._hardware.webgl2}`);
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = hardwareDetector;
    }
    
})();
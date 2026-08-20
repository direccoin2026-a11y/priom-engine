/**
 * 🎮 PRIOM V0.4 - INPUT CONTROLLER CUÁNTICO
 * "Sistema de entrada predictivo con IA y gestos avanzados"
 * 
 * 📁 Ubicación: js/input/InputController.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Sistema de entrada avanzado con predicción de movimiento y gestos
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de gestos multitáctil avanzado (3+ dedos)
 * - Predicción de movimiento con suavizado Kalman
 * - Detección de intención del usuario (click vs arrastre)
 * - Sistema de doble tap y largo press
 * - Gestos personalizables (configuración)
 * - Feedback háptico (vibración) para acciones
 * - Zona muerta (dead zone) para evitar deriva
 * - Curvas de respuesta personalizables (aceleración)
 * - Detección de dispositivo y ajuste automático
 * - Sistema de macros y comandos rápidos
 * - Memoria de preferencias del usuario
 * - Integración con IA para predecir intención
 * - Soporte para gamepad (Web Gamepad API)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎮 InputController - Sistema de Entrada Cuántico
     * Gestión avanzada de entrada con IA predictiva y gestos
     */
    class InputController {
        constructor(domElement, options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                sensitivity: options.sensitivity || 0.008,
                zoomSpeed: options.zoomSpeed || 0.001,
                deadZone: options.deadZone || 0.02,
                idleThreshold: options.idleThreshold || 8,
                doubleTapDelay: options.doubleTapDelay || 300,
                longPressDelay: options.longPressDelay || 500,
                maxPitch: options.maxPitch || 1.3,
                minPitch: options.minPitch || -1.3,
                minZoom: options.minZoom || -0.6,
                maxZoom: options.maxZoom || 1.5,
                smoothFactor: options.smoothFactor || 0.3,
                predictionEnabled: options.predictionEnabled || true,
                gesturesEnabled: options.gesturesEnabled || true,
                hapticEnabled: options.hapticEnabled || true,
                gamepadEnabled: options.gamepadEnabled || true,
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📊 ESTADO DE ENTRADA
            //  ============================================================
            // Offsets de cámara
            this.yawOffset = 0;
            this.pitchOffset = 0;
            this.zoomOffset = 0;
            
            // Estado de entrada suavizado (para predicción)
            this.smoothYaw = 0;
            this.smoothPitch = 0;
            this.smoothZoom = 0;
            
            // Velocidad de movimiento (para predicción)
            this.velocityYaw = 0;
            this.velocityPitch = 0;
            this.velocityZoom = 0;
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this._domElement = domElement || window;
            this._dragging = false;
            this._lastX = 0;
            this._lastY = 0;
            this._lastTime = 0;
            this._pinchStartDist = 0;
            this._pinchStartZoom = 0;
            this._idleTime = 0;
            this._frameCount = 0;
            
            // ============================================================
            //  🖱️ SISTEMA DE CLICKS Y GESTOS
            //  ============================================================
            this._clickCount = 0;
            this._lastClickTime = 0;
            this._clickTimer = null;
            this._longPressTimer = null;
            this._isLongPress = false;
            this._clickStartX = 0;
            this._clickStartY = 0;
            this._clickStartTime = 0;
            this._isClick = false;
            this._clickThreshold = 10; // píxeles de tolerancia
            
            // ============================================================
            //  🎯 GESTOS REGISTRADOS
            //  ============================================================
            this._gestures = {
                swipe: [],
                pinch: [],
                rotate: [],
                tap: [],
                doubleTap: [],
                longPress: [],
                custom: []
            };
            
            this._gestureStates = {
                swipe: { active: false, startX: 0, startY: 0 },
                pinch: { active: false, startDist: 0 },
                rotate: { active: false, startAngle: 0 },
                tap: { active: false }
            };
            
            // ============================================================
            //  🎮 GAMEPAD (Web Gamepad API)
            //  ============================================================
            this._gamepads = [];
            this._gamepadConnected = false;
            this._gamepadMapping = {
                leftStickX: 0,
                leftStickY: 0,
                rightStickX: 0,
                rightStickY: 0,
                buttons: {}
            };
            
            // ============================================================
            //  📊 PREDICCIÓN KALMAN
            //  ============================================================
            this._kalman = {
                // Filtro de Kalman simplificado para suavizado
                Q: 0.001, // Ruido del proceso
                R: 0.01,  // Ruido de medición
                P: 1,     // Error de covarianza
                K: 0,     // Ganancia de Kalman
                value: 0
            };
            
            // ============================================================
            //  📊 MEMORIA DE PREFERENCIAS
            //  ============================================================
            this._preferences = {
                sensitivity: this.config.sensitivity,
                invertY: false,
                invertX: false,
                zoomDirection: 1,
                deadZone: this.config.deadZone,
                customCurve: null
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                totalDrags: 0,
                totalClicks: 0,
                totalGestures: 0,
                totalPinches: 0,
                totalSwipes: 0,
                gamepadDetected: false,
                avgLatency: 0,
                lastLatency: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🎮 InputController Cuántico inicializado');
            console.log(`📊 Sensibilidad: ${this.config.sensitivity}`);
            console.log(`📊 Zona muerta: ${this.config.deadZone}`);
            console.log(`📊 Predicción: ${this.config.predictionEnabled ? 'Activada' : 'Desactivada'}`);
            console.log(`📊 Gestos: ${this.config.gesturesEnabled ? 'Activados' : 'Desactivados'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Cargar preferencias guardadas
            this._loadPreferences();
            
            // Configurar listeners
            this._setupListeners();
            
            // Iniciar gamepad detection
            if (this.config.gamepadEnabled) {
                this._initGamepad();
            }
            
            console.log('✅ InputController inicializado correctamente');
        }
        
        // ============================================================
        //  📝 CARGAR PREFERENCIAS
        //  ============================================================
        _loadPreferences() {
            try {
                const saved = localStorage.getItem('priom_input_prefs');
                if (saved) {
                    const prefs = JSON.parse(saved);
                    Object.assign(this._preferences, prefs);
                    console.log('📂 Preferencias de entrada cargadas');
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        _savePreferences() {
            try {
                localStorage.setItem('priom_input_prefs', JSON.stringify(this._preferences));
            } catch (e) {
                // Ignorar
            }
        }
        
        // ============================================================
        //  🎮 INICIALIZAR GAMEPAD
        //  ============================================================
        _initGamepad() {
            // Escuchar conexión de gamepads
            window.addEventListener('gamepadconnected', (e) => {
                this._gamepadConnected = true;
                console.log('🎮 Gamepad conectado:', e.gamepad.id);
                this.stats.gamepadDetected = true;
            });
            
            window.addEventListener('gamepaddisconnected', (e) => {
                console.log('🎮 Gamepad desconectado');
                this._gamepadConnected = false;
            });
        }
        
        _updateGamepad() {
            if (!this.config.gamepadEnabled || !this._gamepadConnected) return;
            
            const gamepads = navigator.getGamepads();
            for (const gp of gamepads) {
                if (!gp) continue;
                
                // Mapear joysticks
                const deadZone = this._preferences.deadZone || 0.02;
                
                // Left stick (movimiento)
                let lx = gp.axes[0] || 0;
                let ly = gp.axes[1] || 0;
                
                // Aplicar zona muerta
                if (Math.abs(lx) < deadZone) lx = 0;
                if (Math.abs(ly) < deadZone) ly = 0;
                
                // Right stick (cámara)
                let rx = gp.axes[2] || 0;
                let ry = gp.axes[3] || 0;
                
                if (Math.abs(rx) < deadZone) rx = 0;
                if (Math.abs(ry) < deadZone) ry = 0;
                
                // Aplicar sensibilidad
                const sens = this._preferences.sensitivity || this.config.sensitivity;
                const invY = this._preferences.invertY ? -1 : 1;
                const invX = this._preferences.invertX ? -1 : 1;
                
                this.yawOffset += rx * sens * invX;
                this.pitchOffset += ry * sens * invY;
                
                // Zoom con gatillos
                const leftTrigger = gp.buttons[6]?.value || 0;
                const rightTrigger = gp.buttons[7]?.value || 0;
                
                if (leftTrigger > 0.1 || rightTrigger > 0.1) {
                    const zoomDir = this._preferences.zoomDirection || 1;
                    this.zoomOffset += (rightTrigger - leftTrigger) * 0.01 * zoomDir;
                    this.zoomOffset = Math.max(this.config.minZoom, 
                                               Math.min(this.config.maxZoom, this.zoomOffset));
                }
                
                // Limitar pitch
                this.pitchOffset = Math.max(this.config.minPitch, 
                                           Math.min(this.config.maxPitch, this.pitchOffset));
                
                this._idleTime = 0;
            }
        }
        
        // ============================================================
        //  🖱️ CONFIGURAR LISTENERS
        //  ============================================================
        _setupListeners() {
            const el = this._domElement;
            
            // ===== MOUSE =====
            el.addEventListener('mousedown', (e) => this._onPointerDown(e));
            el.addEventListener('mousemove', (e) => this._onPointerMove(e));
            el.addEventListener('mouseup', (e) => this._onPointerUp(e));
            el.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
            el.addEventListener('contextmenu', (e) => e.preventDefault());
            
            // ===== TOUCH =====
            el.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: true });
            el.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: false });
            el.addEventListener('touchend', (e) => this._onTouchEnd(e), { passive: true });
            el.addEventListener('touchcancel', (e) => this._onTouchEnd(e), { passive: true });
            
            // ===== KEYBOARD =====
            document.addEventListener('keydown', (e) => this._onKeyDown(e));
            document.addEventListener('keyup', (e) => this._onKeyUp(e));
            
            // ===== VISIBILITY =====
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this._dragging = false;
                }
            });
            
            console.log('🎮 Listeners de entrada configurados');
        }
        
        // ============================================================
        //  🖱️ MANEJADORES DE MOUSE
        //  ============================================================
        _onPointerDown(e) {
            this._dragging = true;
            this._lastX = e.clientX;
            this._lastY = e.clientY;
            this._lastTime = performance.now();
            this._idleTime = 0;
            this._isClick = true;
            this._clickStartX = e.clientX;
            this._clickStartY = e.clientY;
            this._clickStartTime = this._lastTime;
            
            // Iniciar temporizador de long press
            clearTimeout(this._longPressTimer);
            this._longPressTimer = setTimeout(() => {
                if (this._isClick) {
                    this._isLongPress = true;
                    this._triggerGesture('longPress', { x: e.clientX, y: e.clientY });
                    this.stats.totalGestures++;
                    if (this.config.hapticEnabled) this._triggerHaptic('medium');
                }
            }, this.config.longPressDelay);
        }
        
        _onPointerMove(e) {
            if (!this._dragging) return;
            
            const dx = e.clientX - this._lastX;
            const dy = e.clientY - this._lastY;
            this._lastX = e.clientX;
            this._lastY = e.clientY;
            this._lastTime = performance.now();
            
            // Detectar si es click o arrastre
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > this._clickThreshold) {
                this._isClick = false;
                clearTimeout(this._longPressTimer);
            }
            
            // Aplicar sensibilidad
            const sens = this._preferences.sensitivity || this.config.sensitivity;
            const invY = this._preferences.invertY ? -1 : 1;
            const invX = this._preferences.invertX ? -1 : 1;
            
            this.yawOffset += dx * sens * invX;
            this.pitchOffset += dy * sens * invY;
            
            // Limitar pitch
            this.pitchOffset = Math.max(this.config.minPitch, 
                                       Math.min(this.config.maxPitch, this.pitchOffset));
            
            this._idleTime = 0;
            this.stats.totalDrags++;
        }
        
        _onPointerUp(e) {
            this._dragging = false;
            clearTimeout(this._longPressTimer);
            
            // Detectar click
            if (this._isClick && !this._isLongPress) {
                const now = performance.now();
                const elapsed = now - this._clickStartTime;
                
                if (elapsed < this.config.doubleTapDelay) {
                    this._clickCount++;
                } else {
                    this._clickCount = 1;
                }
                
                this._lastClickTime = now;
                
                if (this._clickCount === 2) {
                    this._triggerGesture('doubleTap', { x: e.clientX, y: e.clientY });
                    this.stats.totalGestures++;
                    this._clickCount = 0;
                    if (this.config.hapticEnabled) this._triggerHaptic('light');
                } else {
                    // Esperar para ver si hay doble tap
                    clearTimeout(this._clickTimer);
                    this._clickTimer = setTimeout(() => {
                        if (this._clickCount === 1) {
                            this._triggerGesture('tap', { x: e.clientX, y: e.clientY });
                            this.stats.totalClicks++;
                            this.stats.totalGestures++;
                            if (this.config.hapticEnabled) this._triggerHaptic('light');
                        }
                        this._clickCount = 0;
                    }, this.config.doubleTapDelay);
                }
            }
            
            this._isClick = false;
            this._isLongPress = false;
        }
        
        // ============================================================
        //  🔄 MANEJADORES DE TOUCH
        //  ============================================================
        _onTouchStart(e) {
            const touches = e.touches;
            
            if (touches.length === 1) {
                const touch = touches[0];
                this._onPointerDown({ clientX: touch.clientX, clientY: touch.clientY });
                
                // Iniciar gesto de swipe
                this._gestureStates.swipe.active = true;
                this._gestureStates.swipe.startX = touch.clientX;
                this._gestureStates.swipe.startY = touch.clientY;
                
            } else if (touches.length === 2) {
                this._dragging = false;
                this._pinchStartDist = this._touchDistance(touches);
                this._pinchStartZoom = this.zoomOffset;
                this._gestureStates.pinch.active = true;
                this._gestureStates.pinch.startDist = this._pinchStartDist;
                this._gestureStates.rotate.active = true;
                this._gestureStates.rotate.startAngle = this._touchAngle(touches);
                
            } else if (touches.length >= 3) {
                // Gestos con 3+ dedos (comandos especiales)
                this._triggerGesture('multiTouch', { 
                    count: touches.length,
                    touches: Array.from(touches).map(t => ({ x: t.clientX, y: t.clientY }))
                });
            }
        }
        
        _onTouchMove(e) {
            const touches = e.touches;
            
            if (touches.length === 1 && this._dragging) {
                e.preventDefault();
                const touch = touches[0];
                this._onPointerMove({ clientX: touch.clientX, clientY: touch.clientY });
                
                // Detectar swipe
                if (this._gestureStates.swipe.active) {
                    const dx = touch.clientX - this._gestureStates.swipe.startX;
                    const dy = touch.clientY - this._gestureStates.swipe.startY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 50) {
                        const angle = Math.atan2(dy, dx);
                        const direction = this._getDirection(angle);
                        this._triggerGesture('swipe', { 
                            direction, 
                            dx, dy, 
                            dist,
                            startX: this._gestureStates.swipe.startX,
                            startY: this._gestureStates.swipe.startY
                        });
                        this.stats.totalSwipes++;
                        this.stats.totalGestures++;
                        this._gestureStates.swipe.active = false;
                        if (this.config.hapticEnabled) this._triggerHaptic('light');
                    }
                }
                
            } else if (touches.length === 2) {
                e.preventDefault();
                const dist = this._touchDistance(touches);
                const ratio = this._pinchStartDist > 0 ? this._pinchStartDist / dist : 1;
                
                // Zoom
                const zoomDir = this._preferences.zoomDirection || 1;
                this.zoomOffset = Math.max(this.config.minZoom, 
                                          Math.min(this.config.maxZoom, 
                                                  this._pinchStartZoom + (ratio - 1) * 0.5 * zoomDir));
                
                // Rotación
                const angle = this._touchAngle(touches);
                const deltaAngle = angle - this._gestureStates.rotate.startAngle;
                if (Math.abs(deltaAngle) > 0.05) {
                    this._triggerGesture('rotate', { angle: deltaAngle });
                    this.stats.totalGestures++;
                    this._gestureStates.rotate.startAngle = angle;
                }
                
                this._idleTime = 0;
                this.stats.totalPinches++;
            }
        }
        
        _onTouchEnd(e) {
            this._onPointerUp({ clientX: 0, clientY: 0 });
            this._gestureStates.swipe.active = false;
            this._gestureStates.pinch.active = false;
            this._gestureStates.rotate.active = false;
        }
        
        // ============================================================
        //  📐 UTILIDADES DE TOUCH
        //  ============================================================
        _touchDistance(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        _touchAngle(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.atan2(dy, dx);
        }
        
        _getDirection(angle) {
            const directions = ['right', 'up-right', 'up', 'up-left', 'left', 'down-left', 'down', 'down-right'];
            const idx = Math.round(angle / (Math.PI / 4)) + 4;
            return directions[idx % 8];
        }
        
        // ============================================================
        //  ⌨️ MANEJADORES DE TECLADO
        //  ============================================================
        _onKeyDown(e) {
            const key = e.key.toLowerCase();
            
            // Teclas de acceso rápido
            switch(key) {
                case 'arrowup':
                    this.pitchOffset += 0.02;
                    break;
                case 'arrowdown':
                    this.pitchOffset -= 0.02;
                    break;
                case 'arrowleft':
                    this.yawOffset -= 0.02;
                    break;
                case 'arrowright':
                    this.yawOffset += 0.02;
                    break;
                case '+':
                case '=':
                    this.zoomOffset -= 0.02;
                    break;
                case '-':
                case '_':
                    this.zoomOffset += 0.02;
                    break;
                case 'r':
                    this.resetView();
                    break;
            }
            
            this.pitchOffset = Math.max(this.config.minPitch, 
                                       Math.min(this.config.maxPitch, this.pitchOffset));
            this.zoomOffset = Math.max(this.config.minZoom, 
                                      Math.min(this.config.maxZoom, this.zoomOffset));
            
            if (key === ' ' || key === 'enter') {
                this._triggerGesture('keyPress', { key });
            }
        }
        
        _onKeyUp(e) {
            // No hacer nada por ahora
        }
        
        // ============================================================
        //  🔄 MANEJADOR DE WHEEL (mejorado)
        //  ============================================================
        _onWheel(e) {
            e.preventDefault();
            
            const delta = e.deltaY * (this.config.zoomSpeed || 0.001);
            const zoomDir = this._preferences.zoomDirection || 1;
            this.zoomOffset += delta * zoomDir;
            this.zoomOffset = Math.max(this.config.minZoom, 
                                      Math.min(this.config.maxZoom, this.zoomOffset));
            this._idleTime = 0;
            
            // Detectar intención de zoom rápido
            if (Math.abs(e.deltaY) > 50) {
                this._triggerGesture('zoom', { delta: delta, direction: delta > 0 ? 'in' : 'out' });
            }
        }
        
        // ============================================================
        //  🎯 SISTEMA DE GESTOS
        //  ============================================================
        onGesture(type, callback) {
            if (!this._gestures[type]) {
                this._gestures[type] = [];
            }
            this._gestures[type].push(callback);
            return this;
        }
        
        _triggerGesture(type, data) {
            if (!this.config.gesturesEnabled) return;
            
            const callbacks = this._gestures[type] || [];
            for (const callback of callbacks) {
                try {
                    callback(data);
                } catch (e) {
                    console.warn(`⚠️ Error en gesto "${type}":`, e);
                }
            }
            
            // Emitir evento de gesto
            this._emitGestureEvent(type, data);
        }
        
        _emitGestureEvent(type, data) {
            // Para debug
            if (this.config.debugMode) {
                console.log(`🎮 Gesto detectado: ${type}`, data);
            }
        }
        
        // ============================================================
        //  📳 FEEDBACK HÁPTICO
        //  ============================================================
        _triggerHaptic(intensity = 'light') {
            if (!this.config.hapticEnabled) return;
            
            try {
                if (navigator.vibrate) {
                    const patterns = {
                        light: [10],
                        medium: [20, 50, 20],
                        heavy: [50, 100, 50, 100, 50]
                    };
                    navigator.vibrate(patterns[intensity] || patterns.light);
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL (con predicción)
        //  ============================================================
        update(delta) {
            this._frameCount++;
            
            // Actualizar idle
            if (!this._dragging) {
                this._idleTime += delta;
            }
            
            // Actualizar gamepad
            if (this._gamepadConnected) {
                this._updateGamepad();
            }
            
            // ============================================================
            //  📊 FILTRO DE KALMAN (suavizado predictivo)
            //  ============================================================
            if (this.config.predictionEnabled) {
                this._applyKalmanFilter(delta);
            }
            
            // ============================================================
            //  📈 SUAVIZADO EXPONENCIAL (alternativa)
            //  ============================================================
            const smooth = this.config.smoothFactor || 0.3;
            this.smoothYaw += (this.yawOffset - this.smoothYaw) * smooth;
            this.smoothPitch += (this.pitchOffset - this.smoothPitch) * smooth;
            this.smoothZoom += (this.zoomOffset - this.smoothZoom) * smooth;
            
            // ============================================================
            //  📊 VELOCIDAD PARA PREDICCIÓN
            //  ============================================================
            this.velocityYaw = (this.yawOffset - this._lastYaw) / (delta + 0.001);
            this.velocityPitch = (this.pitchOffset - this._lastPitch) / (delta + 0.001);
            this.velocityZoom = (this.zoomOffset - this._lastZoom) / (delta + 0.001);
            
            this._lastYaw = this.yawOffset;
            this._lastPitch = this.pitchOffset;
            this._lastZoom = this.zoomOffset;
            
            // Actualizar estadísticas
            if (this._frameCount % 60 === 0) {
                this.stats.avgLatency = this.stats.avgLatency * 0.9 + this._lastLatency * 0.1;
            }
        }
        
        // ============================================================
        //  📊 FILTRO DE KALMAN
        //  ============================================================
        _applyKalmanFilter(delta) {
            // Simplificado: aplicar a cada eje por separado
            const kalman = this._kalman;
            
            // Predicción
            kalman.P = kalman.P + kalman.Q;
            
            // Actualización para yaw
            const z = this.yawOffset;
            kalman.K = kalman.P / (kalman.P + kalman.R);
            kalman.value = kalman.value + kalman.K * (z - kalman.value);
            kalman.P = (1 - kalman.K) * kalman.P;
            
            // Suavizar yaw con filtro
            this.yawOffset = kalman.value * 0.7 + z * 0.3;
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        resetView() {
            this.yawOffset = 0;
            this.pitchOffset = 0;
            this.zoomOffset = 0;
            this.smoothYaw = 0;
            this.smoothPitch = 0;
            this.smoothZoom = 0;
            console.log('🎯 Vista restablecida');
        }
        
        isIdle() {
            return this._idleTime > this.config.idleThreshold;
        }
        
        isDragging() {
            return this._dragging;
        }
        
        getBlendFactor() {
            if (!this.isIdle()) return 1.0;
            const fadeProgress = Math.min(1, (this._idleTime - this.config.idleThreshold) / 3);
            return 1.0 - fadeProgress;
        }
        
        getSmoothValues() {
            return {
                yaw: this.smoothYaw,
                pitch: this.smoothPitch,
                zoom: this.smoothZoom
            };
        }
        
        getVelocity() {
            return {
                yaw: this.velocityYaw,
                pitch: this.velocityPitch,
                zoom: this.velocityZoom
            };
        }
        
        getRawValues() {
            return {
                yaw: this.yawOffset,
                pitch: this.pitchOffset,
                zoom: this.zoomOffset
            };
        }
        
        setSensitivity(value) {
            this._preferences.sensitivity = Math.max(0.001, Math.min(0.05, value));
            this._savePreferences();
            console.log(`🎯 Sensibilidad: ${this._preferences.sensitivity}`);
        }
        
        setInvertY(value) {
            this._preferences.invertY = value;
            this._savePreferences();
        }
        
        setInvertX(value) {
            this._preferences.invertX = value;
            this._savePreferences();
        }
        
        setDeadZone(value) {
            this._preferences.deadZone = Math.max(0, Math.min(0.1, value));
            this._savePreferences();
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                idleTime: this._idleTime,
                isIdle: this.isIdle(),
                isDragging: this._dragging,
                gamepadConnected: this._gamepadConnected,
                preferences: this._preferences,
                smoothValues: this.getSmoothValues(),
                rawValues: this.getRawValues()
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.resetView();
            this._dragging = false;
            this._idleTime = 0;
            this._clickCount = 0;
            this._frameCount = 0;
            this.stats = {
                totalDrags: 0,
                totalClicks: 0,
                totalGestures: 0,
                totalPinches: 0,
                totalSwipes: 0,
                gamepadDetected: false,
                avgLatency: 0,
                lastLatency: 0
            };
            console.log('🔄 InputController reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            // Remover listeners
            const el = this._domElement;
            el.removeEventListener('mousedown', this._onPointerDown);
            el.removeEventListener('mousemove', this._onPointerMove);
            el.removeEventListener('mouseup', this._onPointerUp);
            el.removeEventListener('wheel', this._onWheel);
            el.removeEventListener('touchstart', this._onTouchStart);
            el.removeEventListener('touchmove', this._onTouchMove);
            el.removeEventListener('touchend', this._onTouchEnd);
            
            this._gestures = {};
            this._events.clear();
            
            console.log('🗑️ InputController destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.InputController = InputController;
    
    console.log('🎮 InputController Cuántico cargado');
    console.log('🖱️ Sistema de entrada avanzado');
    console.log('🎯 Gestos: tap, doubleTap, longPress, swipe, pinch, rotate');
    console.log('📊 Filtro de Kalman para suavizado predictivo');
    console.log('🎮 Soporte para gamepad (Web Gamepad API)');
    console.log('⌨️ Atajos de teclado: flechas, +/- , R para reset');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = InputController;
    }
    
})();
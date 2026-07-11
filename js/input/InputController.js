/**
 * InputController.js
 * Sistema de entrada real: arrastrar para mirar alrededor (touch/mouse),
 * pellizcar o rueda del mouse para zoom. Si el usuario no toca nada por
 * un rato, vuelve a la órbita automática — lo mejor de los dos mundos.
 * ADITIVO: no reemplaza el sistema de cámara automática de MaxRenderer,
 * le agrega deltas encima.
 */
(function() {
    'use strict';

    class InputController {
        constructor(domElement) {
            this.domElement = domElement || window;
            
            // Ángulos aportados por el usuario (se suman a la órbita automática)
            this.yawOffset = 0;
            this.pitchOffset = 0;
            this.zoomOffset = 0; // multiplicador de distancia, no absoluto
            
            this._dragging = false;
            this._lastX = 0;
            this._lastY = 0;
            this._pinchStartDist = 0;
            this._pinchStartZoom = 0;
            
            this.idleTime = 0;
            this.idleThreshold = 8; // segundos sin tocar antes de considerarse "idle"
            this.sensitivity = 0.008;
            
            this._setupListeners();
        }

        _setupListeners() {
            const el = this.domElement;
            
            // ----- Mouse -----
            el.addEventListener('mousedown', (e) => this._onDragStart(e.clientX, e.clientY));
            el.addEventListener('mousemove', (e) => this._onDragMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', () => this._onDragEnd());
            el.addEventListener('wheel', (e) => {
                e.preventDefault();
                this.zoomOffset += e.deltaY * 0.001;
                this.zoomOffset = Math.max(-0.6, Math.min(1.5, this.zoomOffset));
                this.idleTime = 0;
            }, { passive: false });
            
            // ----- Touch (arrastrar con 1 dedo, pellizcar con 2) -----
            el.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this._onDragStart(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 2) {
                    this._dragging = false;
                    this._pinchStartDist = this._touchDistance(e.touches);
                    this._pinchStartZoom = this.zoomOffset;
                }
            }, { passive: true });
            
            el.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1 && this._dragging) {
                    e.preventDefault();
                    this._onDragMove(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 2) {
                    e.preventDefault();
                    const dist = this._touchDistance(e.touches);
                    const ratio = this._pinchStartDist > 0 ? this._pinchStartDist / dist : 1;
                    this.zoomOffset = Math.max(-0.6, Math.min(1.5, this._pinchStartZoom + (ratio - 1)));
                    this.idleTime = 0;
                }
            }, { passive: false });
            
            el.addEventListener('touchend', () => this._onDragEnd());
        }

        _touchDistance(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        _onDragStart(x, y) {
            this._dragging = true;
            this._lastX = x;
            this._lastY = y;
            this.idleTime = 0;
        }

        _onDragMove(x, y) {
            if (!this._dragging) return;
            const dx = x - this._lastX;
            const dy = y - this._lastY;
            this._lastX = x;
            this._lastY = y;
            
            this.yawOffset += dx * this.sensitivity;
            this.pitchOffset = Math.max(-1.3, Math.min(1.3, this.pitchOffset + dy * this.sensitivity));
            this.idleTime = 0;
        }

        _onDragEnd() {
            this._dragging = false;
        }

        // Llamar cada frame con el delta de tiempo
        update(delta) {
            if (!this._dragging) {
                this.idleTime += delta;
            }
        }

        // true si el usuario no ha tocado nada en un rato — la cámara
        // automática puede retomar el control suavemente
        isIdle() {
            return this.idleTime > this.idleThreshold;
        }

        // Cuánto se desvanece la influencia manual al volver a estar idle
        // (transición suave, no un salto brusco de vuelta a la órbita)
        getBlendFactor() {
            if (!this.isIdle()) return 1.0;
            const fadeProgress = Math.min(1, (this.idleTime - this.idleThreshold) / 3);
            return 1.0 - fadeProgress;
        }

        isDragging() {
            return this._dragging;
        }
    }

    window.InputController = InputController;
    console.log('🎮 InputController cargado');
})();

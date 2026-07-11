/**
 * DynamicResolutionController.js
 * Controlador dedicado de resolución dinámica (DRS), inspirado en cómo
 * lo hacen los motores de consola: en vez de reaccionar a cada lectura
 * suelta de FPS (lo que causaba una pelea de ida-y-vuelta con la IA),
 * mide el PRESUPUESTO DE TIEMPO DE FRAME (16.6ms = 60fps) con una
 * ventana de muestras, decide con histéresis (solo cambia si el
 * problema es sostenido, no un pico) y aplica el cambio de resolución
 * con muy poca frecuencia (nunca más de una vez cada ~1 segundo),
 * evitando por diseño la reconstrucción constante de buffers de GPU.
 */
(function() {
    'use strict';

    class DynamicResolutionController {
        constructor(options = {}) {
            this.targetFrameMs = options.targetFrameMs || 16.6; // 60fps
            this.minScale = options.minScale || 0.35;
            this.maxScale = options.maxScale || 1.0;
            this.scale = options.initialScale || 1.0;
            
            this.samples = [];
            this.sampleWindow = 40; // ~0.6-1.3s de muestras según el FPS real
            
            this.cooldownMs = 900; // nunca cambiar más de una vez por segundo
            this._lastChangeAt = 0;
            
            // Histéresis: hace falta estar sostenidamente mal/bien, no
            // un solo pico, para que el controlador actúe de verdad
            this._badStreak = 0;
            this._goodStreak = 0;
            this._streakNeeded = 15;
        }

        // frameTimeMs: tiempo real del último frame (sin recortar)
        addSample(frameTimeMs) {
            if (frameTimeMs <= 0 || frameTimeMs > 1000) return; // descartar basura
            this.samples.push(frameTimeMs);
            if (this.samples.length > this.sampleWindow) this.samples.shift();
        }

        // Llamar periódicamente (no hace falta cada frame). Devuelve la
        // escala actual, y solo cambia de verdad cuando corresponde.
        evaluate() {
            if (this.samples.length < this.sampleWindow * 0.5) return this.scale;
            
            const now = performance.now();
            if (now - this._lastChangeAt < this.cooldownMs) return this.scale;
            
            // Percentil 75 en vez de promedio: nos importa más "qué tan
            // seguido se atrasa" que el promedio, que un solo pico puede
            // disimular fácilmente
            const sorted = [...this.samples].sort((a, b) => a - b);
            const p75 = sorted[Math.floor(sorted.length * 0.75)];
            
            const over = p75 > this.targetFrameMs * 1.15;
            const under = p75 < this.targetFrameMs * 0.75;
            
            if (over) {
                this._badStreak++;
                this._goodStreak = 0;
            } else if (under) {
                this._goodStreak++;
                this._badStreak = 0;
            } else {
                this._badStreak = 0;
                this._goodStreak = 0;
            }
            
            let changed = false;
            
            if (this._badStreak >= this._streakNeeded && this.scale > this.minScale) {
                // Bajar de forma proporcional a qué tan lejos estamos del presupuesto
                const overshoot = p75 / this.targetFrameMs;
                const step = Math.min(0.25, 0.05 * overshoot);
                this.scale = Math.max(this.minScale, this.scale - step);
                this._badStreak = 0;
                changed = true;
                console.log(`🎚️ DRS: bajando a ${(this.scale * 100).toFixed(0)}% (frame ${p75.toFixed(1)}ms vs objetivo ${this.targetFrameMs}ms)`);
                
            } else if (this._goodStreak >= this._streakNeeded * 2 && this.scale < this.maxScale) {
                // Subir con más cautela que al bajar (mejor sobrar margen)
                this.scale = Math.min(this.maxScale, this.scale + 0.05);
                this._goodStreak = 0;
                changed = true;
                console.log(`🎚️ DRS: subiendo a ${(this.scale * 100).toFixed(0)}%`);
            }
            
            if (changed) this._lastChangeAt = now;
            return this.scale;
        }

        getScale() {
            return this.scale;
        }

        reset(scale = 1.0) {
            this.scale = scale;
            this.samples = [];
            this._badStreak = 0;
            this._goodStreak = 0;
            this._lastChangeAt = 0;
        }
    }

    window.DynamicResolutionController = DynamicResolutionController;
    console.log('🎚️ DynamicResolutionController cargado');
})();

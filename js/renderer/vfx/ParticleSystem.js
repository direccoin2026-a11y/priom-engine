/**
 * ParticleSystem.js — Priom v0.3
 * Sistema unificado de partículas en GPU. Antes, polvo ambiental y
 * clima (lluvia/nieve) cada uno tenía su propio bucle en JavaScript
 * que recorría cientos/miles de partículas cada frame, actualizaba su
 * posición en un Float32Array, y forzaba `needsUpdate = true` — lo que
 * reenvía el buffer COMPLETO a la GPU en cada frame, sin importar que
 * el movimiento sea perfectamente predecible.
 *
 * Aquí el movimiento se calcula en el VERTEX SHADER a partir de:
 * posición base + velocidad (fija por partícula) + tiempo transcurrido,
 * con envoltura (wrap-around) mediante módulo — así la partícula
 * "recicla" sola dentro de un volumen, sin que la CPU tenga que
 * intervenir jamás. Solo se actualiza un uniform (`uTime`) por sistema
 * por frame, sin importar cuántas partículas tenga.
 */
(function() {
    'use strict';

    class ParticleSystem {
        /**
         * @param {number} count - cantidad de partículas
         * @param {object} options - { spread, height, fallSpeed, drift, size, color, opacity, blending }
         */
        constructor(count, options = {}) {
            this.count = count;
            this.spread = options.spread || 140;
            this.height = options.height || 40;
            this.fallSpeed = options.fallSpeed ?? 0.3; // unidades/seg hacia abajo (0 = sin caída, ej. polvo)
            this.drift = options.drift ?? 0.15; // vaivén horizontal
            this.mesh = this._build(options);
        }

        _build(options) {
            const geometry = new THREE.BufferGeometry();
            const basePos = new Float32Array(this.count * 3);
            const seed = new Float32Array(this.count);

            for (let i = 0; i < this.count; i++) {
                basePos[i * 3] = (Math.random() - 0.5) * this.spread;
                basePos[i * 3 + 1] = Math.random() * this.height;
                basePos[i * 3 + 2] = (Math.random() - 0.5) * this.spread;
                seed[i] = Math.random() * 100;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(basePos, 3));
            geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uCameraPos: { value: new THREE.Vector3() },
                    uHeight: { value: this.height },
                    uSpread: { value: this.spread },
                    uFallSpeed: { value: this.fallSpeed },
                    uDrift: { value: this.drift },
                    uSize: { value: options.size || 0.15 },
                    uColor: { value: new THREE.Color(options.color ?? 0xffffff) },
                    uOpacity: { value: options.opacity ?? 0.6 }
                },
                vertexShader: `
                    uniform float uTime;
                    uniform vec3 uCameraPos;
                    uniform float uHeight;
                    uniform float uSpread;
                    uniform float uFallSpeed;
                    uniform float uDrift;
                    uniform float uSize;
                    attribute float aSeed;
                    
                    void main() {
                        // Caída + vaivén, calculados en GPU — sin CPU
                        float fallOffset = mod(uTime * uFallSpeed + aSeed, uHeight);
                        float sway = sin(uTime * 0.8 + aSeed) * uDrift;
                        
                        vec3 pos = position;
                        pos.y = uHeight - fallOffset; // cae y se recicla sola (módulo)
                        pos.x += sway;
                        
                        // Reciclar horizontalmente alrededor de la cámara,
                        // para que nunca "se acaben" las partículas visibles
                        // sin importar hacia dónde te muevas
                        vec3 relativeToCam = pos - uCameraPos;
                        relativeToCam.x = mod(relativeToCam.x + uSpread * 0.5, uSpread) - uSpread * 0.5;
                        relativeToCam.z = mod(relativeToCam.z + uSpread * 0.5, uSpread) - uSpread * 0.5;
                        pos = uCameraPos + relativeToCam;
                        
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                        gl_PointSize = uSize * (300.0 / -mvPosition.z);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    
                    void main() {
                        // Punto redondeado en vez de cuadrado
                        vec2 c = gl_PointCoord - 0.5;
                        float d = length(c);
                        if (d > 0.5) discard;
                        float alpha = (1.0 - d * 2.0) * uOpacity;
                        gl_FragColor = vec4(uColor, alpha);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: options.blending === 'additive' ? THREE.AdditiveBlending : THREE.NormalBlending
            });

            const points = new THREE.Points(geometry, material);
            points.frustumCulled = false; // se recicla alrededor de cámara, siempre "visible" en algún punto
            return points;
        }

        // Llamar cada frame — costo constante sin importar cuántas partículas haya
        update(elapsedTime, cameraPos) {
            this.mesh.material.uniforms.uTime.value = elapsedTime;
            if (cameraPos) this.mesh.material.uniforms.uCameraPos.value.copy(cameraPos);
        }

        setFallSpeed(v) { this.mesh.material.uniforms.uFallSpeed.value = v; }
        setOpacity(v) { this.mesh.material.uniforms.uOpacity.value = v; }
        setColor(hex) { this.mesh.material.uniforms.uColor.value.set(hex); }
        setVisible(v) { this.mesh.visible = v; }

        dispose() {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
    }

    window.ParticleSystem = ParticleSystem;
    console.log('✨ ParticleSystem cargado (Priom v0.3, GPU-driven)');
})();

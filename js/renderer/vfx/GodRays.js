/**
 * GodRays.js
 * Rayos de luz volumétricos (crepusculares) desde el sol, vía un pase
 * de blur radial en pantalla. ADITIVO: se agrega al composer existente,
 * no reemplaza el bloom/SSAO/cinematic ya montados en MaxRenderer.
 */
(function() {
    'use strict';

    class GodRays {
        static create() {
            const shader = {
                uniforms: {
                    tDiffuse: { value: null },
                    uSunScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
                    uSunVisible: { value: 0.0 },
                    uExposure: { value: 0.35 },
                    uDecay: { value: 0.95 },
                    uDensity: { value: 0.8 },
                    uWeight: { value: 0.4 },
                    uSamples: { value: 40.0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D tDiffuse;
                    uniform vec2 uSunScreenPos;
                    uniform float uSunVisible;
                    uniform float uExposure;
                    uniform float uDecay;
                    uniform float uDensity;
                    uniform float uWeight;
                    uniform float uSamples;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 base = texture2D(tDiffuse, vUv);
                        
                        if (uSunVisible < 0.01) {
                            gl_FragColor = base;
                            return;
                        }
                        
                        vec2 delta = (vUv - uSunScreenPos) * uDensity / uSamples;
                        vec2 coord = vUv;
                        float illum = 1.0;
                        vec3 accum = vec3(0.0);
                        
                        for (int i = 0; i < 40; i++) {
                            if (float(i) >= uSamples) break;
                            coord -= delta;
                            vec3 sample_ = texture2D(tDiffuse, coord).rgb;
                            sample_ *= illum * uWeight;
                            accum += sample_;
                            illum *= uDecay;
                        }
                        
                        vec3 result = base.rgb + accum * uExposure * uSunVisible;
                        gl_FragColor = vec4(result, base.a);
                    }
                `
            };

            return new THREE.ShaderPass(shader);
        }

        // Actualiza la posición del sol en pantalla (0..1) y si es visible
        static update(pass, sunWorldPos, camera) {
            if (!pass) return;
            try {
                if (!this._tempVec) this._tempVec = new THREE.Vector3();
                this._tempVec.copy(sunWorldPos).project(camera);
                const pos = this._tempVec;
                const visible = pos.z < 1 && pos.x > -1.2 && pos.x < 1.2 && pos.y > -1.2 && pos.y < 1.2;
                pass.uniforms.uSunScreenPos.value.set((pos.x + 1) / 2, (pos.y + 1) / 2);
                pass.uniforms.uSunVisible.value = visible ? Math.max(0, Math.min(1, 1.2 - Math.abs(pos.z))) : 0.0;
            } catch (e) {
                pass.uniforms.uSunVisible.value = 0.0;
            }
        }
    }

    window.GodRays = GodRays;
    console.log('☀️ GodRays cargado');
})();

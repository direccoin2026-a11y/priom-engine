/**
 * SkySystem.js
 * Capas extra de cielo: nubes que se desplazan y auroras nocturnas.
 * ADITIVO: se agrega encima del skybox que ya existe en MaxRenderer,
 * no lo reemplaza. Si algo falla aquí, el cielo base sigue funcionando.
 */
(function() {
    'use strict';

    class SkySystem {
        constructor(scene) {
            this.scene = scene;
            this.clock = 0;
            this._setupClouds();
            this._setupAurora();
        }

        _setupClouds() {
            try {
                const texture = window.TextureFactory ? window.TextureFactory.cloudAlpha(256) : null;

                const geometry = new THREE.SphereGeometry(450, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0.35,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    fog: false
                });

                this.cloudDome = new THREE.Mesh(geometry, material);
                this.cloudDome.position.y = 0;
                this.scene.add(this.cloudDome);
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudieron crear las nubes', e);
            }
        }

        _setupAurora() {
            try {
                const geometry = new THREE.PlaneGeometry(600, 120, 32, 8);
                const material = new THREE.ShaderMaterial({
                    transparent: true,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending,
                    uniforms: {
                        uTime: { value: 0 },
                        uNightAmount: { value: 0 }
                    },
                    vertexShader: `
                        uniform float uTime;
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            vec3 pos = position;
                            pos.z += sin(pos.x * 0.03 + uTime * 0.6) * 8.0;
                            pos.z += cos(pos.x * 0.07 + uTime * 0.3) * 4.0;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float uTime;
                        uniform float uNightAmount;
                        varying vec2 vUv;
                        void main() {
                            float band = sin(vUv.x * 6.0 + uTime * 0.5) * 0.5 + 0.5;
                            float fade = sin(vUv.y * 3.14159);
                            vec3 color = mix(vec3(0.1, 0.9, 0.6), vec3(0.4, 0.3, 0.9), band);
                            float alpha = fade * band * 0.5 * uNightAmount;
                            gl_FragColor = vec4(color, alpha);
                        }
                    `
                });

                this.aurora = new THREE.Mesh(geometry, material);
                this.aurora.rotation.x = Math.PI / 2.3;
                this.aurora.position.set(0, 140, -180);
                this.scene.add(this.aurora);
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudo crear la aurora', e);
            }
        }

        // sunHeight: componente Y normalizada de la dirección del sol (-1..1)
        update(delta, sunHeight) {
            this.clock += delta;

            if (this.cloudDome) {
                this.cloudDome.rotation.y += delta * 0.006;
                this.cloudDome.material.opacity = 0.22 + Math.max(0, sunHeight) * 0.25;
            }

            if (this.aurora && this.aurora.material.uniforms) {
                this.aurora.material.uniforms.uTime.value = this.clock;
                const nightAmount = THREE.MathUtils
                    ? THREE.MathUtils.clamp(-sunHeight * 1.5, 0, 1)
                    : Math.max(0, Math.min(1, -sunHeight * 1.5));
                this.aurora.material.uniforms.uNightAmount.value = nightAmount;
            }
        }
    }

    window.SkySystem = SkySystem;
    console.log('☁️ SkySystem cargado');
})();

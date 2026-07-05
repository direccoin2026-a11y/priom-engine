/**
 * WeatherFX.js
 * Niebla baja / neblina de suelo (aproximación barata a niebla
 * volumétrica). ADITIVO: no reemplaza el sistema de lluvia/nieve
 * ya existente en MaxRenderer, lo complementa.
 */
(function() {
    'use strict';

    class WeatherFX {
        constructor(scene) {
            this.scene = scene;
            this.patches = [];
            this._setupGroundMist();
        }

        _setupGroundMist() {
            try {
                const texture = window.TextureFactory ? window.TextureFactory.cloudAlpha(128) : null;
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0.18,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    fog: false
                });
                const geometry = new THREE.PlaneGeometry(120, 120);

                for (let i = 0; i < 4; i++) {
                    const mesh = new THREE.Mesh(geometry, material.clone());
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.position.set(
                        (Math.random() - 0.5) * 100,
                        0.6 + Math.random() * 0.4,
                        (Math.random() - 0.5) * 100
                    );
                    mesh.rotation.z = Math.random() * Math.PI;
                    this.scene.add(mesh);
                    this.patches.push({ mesh, speed: 0.002 + Math.random() * 0.003 });
                }
            } catch (e) {
                console.warn('⚠️ WeatherFX: no se pudo crear niebla de suelo', e);
            }
        }

        update(delta) {
            for (const patch of this.patches) {
                patch.mesh.rotation.z += patch.speed;
            }
        }

        setIntensity(value) {
            for (const patch of this.patches) {
                patch.mesh.material.opacity = 0.18 * value;
            }
        }
    }

    window.WeatherFX = WeatherFX;
    console.log('🌫️ WeatherFX cargado');
})();

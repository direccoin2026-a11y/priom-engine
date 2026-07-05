/**
 * WaterSystem.js
 * Efecto de espuma cerca de la orilla, ADITIVO al agua que ya existe
 * en MaxRenderer (el shader de olas/Fresnel no se toca).
 */
(function() {
    'use strict';

    class WaterSystem {
        constructor(scene) {
            this.scene = scene;
            this.foamRings = [];
        }

        // Crea un anillo de espuma alrededor de un punto (ej. orilla de un lago)
        addFoamRing(x, z, radius = 8) {
            try {
                const geometry = new THREE.RingGeometry(radius * 0.85, radius, 32);
                const material = window.MaterialLibrary
                    ? window.MaterialLibrary.foam()
                    : new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });

                const ring = new THREE.Mesh(geometry, material);
                ring.rotation.x = -Math.PI / 2;
                ring.position.set(x, 0.55, z);
                this.scene.add(ring);
                this.foamRings.push({ mesh: ring, seed: Math.random() * 100 });
                return ring;
            } catch (e) {
                console.warn('⚠️ WaterSystem: no se pudo crear espuma', e);
                return null;
            }
        }

        update(time) {
            for (const foam of this.foamRings) {
                const pulse = 0.35 + Math.sin(time * 1.5 + foam.seed) * 0.15;
                foam.mesh.material.opacity = Math.max(0, pulse);
            }
        }

        clear() {
            for (const foam of this.foamRings) {
                this.scene.remove(foam.mesh);
            }
            this.foamRings = [];
        }
    }

    window.WaterSystem = WaterSystem;
    console.log('🌊 WaterSystem cargado');
})();

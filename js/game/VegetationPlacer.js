/**
 * VegetationPlacer.js
 * Vegetación decorativa adicional (flores) colocada según altura/
 * pendiente/humedad. ADITIVO y autónomo: no usa el ECS ni toca
 * GameWorld.js — genera su propia malla instanciada y la agrega
 * directamente a la escena. Si no se llama, no afecta nada.
 */
(function() {
    'use strict';

    class VegetationPlacer {
        /**
         * @param {THREE.Scene} scene
         * @param {object} terrain - objeto con getHeight(x,z) y getMoisture(x,z)
         * @param {object} config - { worldSize }
         */
        constructor(scene, terrain, config = {}) {
            this.scene = scene;
            this.terrain = terrain;
            this.worldSize = config.worldSize || 300;
            this.flowerMeshes = [];
        }

        _getSlope(x, z) {
            const e = 2;
            const h = (dx, dz) => (this.terrain.getHeight ? this.terrain.getHeight(x + dx, z + dz) : 0);
            return (Math.abs(h(e, 0) - h(-e, 0)) + Math.abs(h(0, e) - h(0, -e))) / (e * 2);
        }

        // Genera un campo de flores dentro de las reglas de bioma bajo/húmedo/plano
        plantFlowers(count = 800) {
            try {
                const colors = [0xff5c8a, 0xffe066, 0xff8c42, 0xffffff, 0xb388ff];
                const geometry = new THREE.ConeGeometry(0.06, 0.18, 5);
                geometry.translate(0, 0.09, 0);

                for (const color of colors) {
                    const material = new THREE.MeshStandardMaterial({
                        color,
                        roughness: 0.6,
                        metalness: 0.0,
                        emissive: color,
                        emissiveIntensity: 0.08
                    });

                    const perColor = Math.floor(count / colors.length);
                    const mesh = new THREE.InstancedMesh(geometry, material, perColor);
                    const dummy = new THREE.Object3D();
                    let placed = 0;
                    let attempts = 0;

                    while (placed < perColor && attempts < perColor * 6) {
                        attempts++;
                        const x = (Math.random() - 0.5) * this.worldSize;
                        const z = (Math.random() - 0.5) * this.worldSize;
                        const y = this.terrain.getHeight ? this.terrain.getHeight(x, z) : 0;
                        const moisture = this.terrain.getMoisture ? this.terrain.getMoisture(x, z) : 0.5;
                        const slope = this._getSlope(x, z);

                        const validSpot = y > 1 && y < 9 && moisture > 0.35 && slope < 0.4;
                        if (!validSpot) continue;

                        dummy.position.set(x, y + 0.1, z);
                        dummy.rotation.y = Math.random() * Math.PI * 2;
                        const scale = 0.7 + Math.random() * 0.8;
                        dummy.scale.set(scale, scale, scale);
                        dummy.updateMatrix();
                        mesh.setMatrixAt(placed, dummy.matrix);
                        placed++;
                    }

                    mesh.count = placed;
                    mesh.castShadow = false;
                    this.scene.add(mesh);
                    this.flowerMeshes.push(mesh);
                }

                console.log(`🌼 VegetationPlacer: flores plantadas (${this.flowerMeshes.length} grupos)`);
            } catch (e) {
                console.warn('⚠️ VegetationPlacer: no se pudieron plantar flores', e);
            }
        }

        clear() {
            for (const mesh of this.flowerMeshes) {
                this.scene.remove(mesh);
            }
            this.flowerMeshes = [];
        }
    }

    window.VegetationPlacer = VegetationPlacer;
    console.log('🌱 VegetationPlacer cargado');
})();

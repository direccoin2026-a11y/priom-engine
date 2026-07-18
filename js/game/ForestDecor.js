/**
 * ForestDecor.js
 * Arbustos y maleza de sotobosque — hoy el bosque solo tenía árboles y
 * pasto, sin nada intermedio, así que se veía vacío por abajo. Mismo
 * patrón seguro que VegetationPlacer/AlpineDecor: autónomo, InstancedMesh
 * propio, no toca el ECS ni el pipeline de renderizado existente.
 */
(function() {
    'use strict';

    class ForestDecor {
        constructor(scene, terrain, config = {}) {
            this.scene = scene;
            this.terrain = terrain;
            this.worldSize = config.worldSize || 300;
            this.meshes = [];
        }

        _getSlope(x, z) {
            const e = 2;
            const h = (dx, dz) => (this.terrain.getHeight ? this.terrain.getHeight(x + dx, z + dz) : 0);
            return (Math.abs(h(e, 0) - h(-e, 0)) + Math.abs(h(0, e) - h(0, -e))) / (e * 2);
        }

        plant(count = 1200) {
            try {
                this._plantBushes(Math.floor(count * 0.7));
                this._plantFerns(Math.floor(count * 0.3));
                console.log('🌿 ForestDecor: sotobosque plantado');
            } catch (e) {
                console.warn('⚠️ ForestDecor: no se pudo plantar', e);
            }
        }

        // Arbustos redondeados (cúmulo de esferas achatadas)
        _plantBushes(count) {
            const geometry = new THREE.IcosahedronGeometry(0.28, 0);
            geometry.scale(1, 0.7, 1); // achatado, más parecido a arbusto
            
            const tones = [0x2f5a24, 0x3d6e2e, 0x264a1d];
            const perTone = Math.floor(count / tones.length);
            
            for (const tone of tones) {
                const material = window.MaterialLibrary
                    ? window.MaterialLibrary.grass(tone)
                    : new THREE.MeshStandardMaterial({ color: tone, roughness: 0.9 });
                
                const mesh = new THREE.InstancedMesh(geometry, material, perTone);
                const dummy = new THREE.Object3D();
                let placed = 0;
                let attempts = 0;

                while (placed < perTone && attempts < perTone * 6) {
                    attempts++;
                    const x = (Math.random() - 0.5) * this.worldSize;
                    const z = (Math.random() - 0.5) * this.worldSize;
                    const y = this.terrain.getHeight ? this.terrain.getHeight(x, z) : 0;
                    const moisture = this.terrain.getMoisture ? this.terrain.getMoisture(x, z) : 0.5;
                    const biome = this.terrain.getBiome ? this.terrain.getBiome(x, z) : 2;
                    const slope = this._getSlope(x, z);

                    // Bosque (3) o pasto húmedo, plano, no muy alto
                    const validSpot = (biome === 3 || biome === 2) && y > 1 && y < 14 && moisture > 0.35 && slope < 0.45;
                    if (!validSpot) continue;

                    dummy.position.set(x, y + 0.18, z);
                    dummy.rotation.y = Math.random() * Math.PI * 2;
                    const scale = 0.6 + Math.random() * 1.1;
                    dummy.scale.set(scale, scale * (0.7 + Math.random() * 0.5), scale);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(placed, dummy.matrix);
                    placed++;
                }

                mesh.count = placed;
                mesh.castShadow = false;
                mesh.receiveShadow = true;
                this.scene.add(mesh);
                this.meshes.push(mesh);
            }
        }

        // Helechos (grupos de "hojas" tipo cono aplanado, más altos y delgados)
        _plantFerns(count) {
            const geometry = new THREE.ConeGeometry(0.12, 0.5, 5);
            geometry.translate(0, 0.25, 0);
            const material = window.MaterialLibrary
                ? window.MaterialLibrary.grass(0x1f4a1a)
                : new THREE.MeshStandardMaterial({ color: 0x1f4a1a, roughness: 0.85, side: THREE.DoubleSide });
            if (!material.side) material.side = THREE.DoubleSide;

            const mesh = new THREE.InstancedMesh(geometry, material, count);
            const dummy = new THREE.Object3D();
            let placed = 0;
            let attempts = 0;

            while (placed < count && attempts < count * 6) {
                attempts++;
                const x = (Math.random() - 0.5) * this.worldSize;
                const z = (Math.random() - 0.5) * this.worldSize;
                const y = this.terrain.getHeight ? this.terrain.getHeight(x, z) : 0;
                const moisture = this.terrain.getMoisture ? this.terrain.getMoisture(x, z) : 0.5;
                const biome = this.terrain.getBiome ? this.terrain.getBiome(x, z) : 2;

                const validSpot = biome === 3 && y > 1 && y < 12 && moisture > 0.45;
                if (!validSpot) continue;

                dummy.position.set(x, y, z);
                dummy.rotation.y = Math.random() * Math.PI * 2;
                dummy.rotation.x = (Math.random() - 0.5) * 0.3;
                const scale = 0.5 + Math.random() * 0.7;
                dummy.scale.set(scale, scale, scale);
                dummy.updateMatrix();
                mesh.setMatrixAt(placed, dummy.matrix);
                placed++;
            }

            mesh.count = placed;
            mesh.castShadow = false;
            this.scene.add(mesh);
            this.meshes.push(mesh);
        }

        clear() {
            for (const m of this.meshes) this.scene.remove(m);
            this.meshes = [];
        }
    }

    window.ForestDecor = ForestDecor;
    console.log('🌿 ForestDecor cargado');
})();

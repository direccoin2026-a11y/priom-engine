/**
 * AlpineDecor.js
 * Decoración de alta montaña (rocas con escarcha, picos de cristal/hielo)
 * para las zonas nevadas, que hasta ahora se veían vacías. ADITIVO y
 * autónomo, mismo patrón que VegetationPlacer.
 */
(function() {
    'use strict';

    class AlpineDecor {
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

        plant(count = 250) {
            try {
                this._plantFrostRocks(Math.floor(count * 0.6));
                this._plantIceCrystals(Math.floor(count * 0.4));
                console.log('🧊 AlpineDecor: decoración de montaña colocada');
            } catch (e) {
                console.warn('⚠️ AlpineDecor: no se pudo colocar decoración', e);
            }
        }

        _plantFrostRocks(count) {
            const geometry = new THREE.DodecahedronGeometry(0.6, 0);
            const material = window.MaterialLibrary ? window.MaterialLibrary.snow() : new THREE.MeshStandardMaterial({ color: 0xe8ecf5 });
            const mesh = new THREE.InstancedMesh(geometry, material, count);
            const dummy = new THREE.Object3D();
            let placed = 0;
            let attempts = 0;

            while (placed < count && attempts < count * 8) {
                attempts++;
                const x = (Math.random() - 0.5) * this.worldSize;
                const z = (Math.random() - 0.5) * this.worldSize;
                const y = this.terrain.getHeight ? this.terrain.getHeight(x, z) : 0;
                if (y < 14 || this._getSlope(x, z) > 0.9) continue;

                dummy.position.set(x, y + 0.2, z);
                dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
                const scale = 0.5 + Math.random() * 1.4;
                dummy.scale.set(scale, scale * 0.8, scale);
                dummy.updateMatrix();
                mesh.setMatrixAt(placed, dummy.matrix);
                placed++;
            }

            mesh.count = placed;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
            this.meshes.push(mesh);
        }

        _plantIceCrystals(count) {
            const geometry = new THREE.ConeGeometry(0.15, 1.1, 6);
            geometry.translate(0, 0.55, 0);
            const material = window.MaterialLibrary ? window.MaterialLibrary.crystal(0xbfe8ff) : new THREE.MeshPhysicalMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.7 });
            const mesh = new THREE.InstancedMesh(geometry, material, count);
            const dummy = new THREE.Object3D();
            let placed = 0;
            let attempts = 0;

            while (placed < count && attempts < count * 8) {
                attempts++;
                const x = (Math.random() - 0.5) * this.worldSize;
                const z = (Math.random() - 0.5) * this.worldSize;
                const y = this.terrain.getHeight ? this.terrain.getHeight(x, z) : 0;
                if (y < 18 || this._getSlope(x, z) > 0.5) continue;

                dummy.position.set(x, y, z);
                dummy.rotation.y = Math.random() * Math.PI * 2;
                dummy.rotation.x = (Math.random() - 0.5) * 0.2;
                const scale = 0.6 + Math.random() * 1.2;
                dummy.scale.set(scale, scale * (0.8 + Math.random() * 0.6), scale);
                dummy.updateMatrix();
                mesh.setMatrixAt(placed, dummy.matrix);
                placed++;
            }

            mesh.count = placed;
            mesh.castShadow = true;
            this.scene.add(mesh);
            this.meshes.push(mesh);
        }

        clear() {
            for (const m of this.meshes) this.scene.remove(m);
            this.meshes = [];
        }
    }

    window.AlpineDecor = AlpineDecor;
    console.log('🏔️ AlpineDecor cargado');
})();

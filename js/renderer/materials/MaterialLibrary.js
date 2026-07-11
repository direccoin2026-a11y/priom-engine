/**
 * MaterialLibrary.js
 * Catálogo central de materiales PBR reutilizables para Priom Engine.
 * No reemplaza materiales existentes: agrega nuevos tipos disponibles
 * para props/decoración/futuras entidades sin tocar código actual.
 */
(function() {
    'use strict';

    class MaterialLibrary {
        static rock(tint = 0x4a4640) {
            return new THREE.MeshStandardMaterial({
                color: tint,
                roughness: 0.95,
                metalness: 0.05,
                flatShading: true
            });
        }

        static snow() {
            return new THREE.MeshStandardMaterial({
                color: 0xf2f6ff,
                roughness: 0.65,
                metalness: 0.0,
                envMapIntensity: 0.8
            });
        }

        static sand() {
            return new THREE.MeshStandardMaterial({
                color: 0xd8c58f,
                roughness: 1.0,
                metalness: 0.0
            });
        }

        static grass(tint = 0x4d8a3a) {
            return new THREE.MeshStandardMaterial({
                color: tint,
                roughness: 0.9,
                metalness: 0.0,
                side: THREE.DoubleSide
            });
        }

        static crystal(tint = 0x66e0ff) {
            return new THREE.MeshPhysicalMaterial({
                color: tint,
                roughness: 0.05,
                metalness: 0.0,
                transmission: 0.85,
                thickness: 1.2,
                ior: 1.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                emissive: tint,
                emissiveIntensity: 0.25
            });
        }

        static metal(tint = 0xb0b4bb) {
            return new THREE.MeshStandardMaterial({
                color: tint,
                roughness: 0.3,
                metalness: 0.9
            });
        }

        static emissive(color = 0xffcc66, intensity = 1.5) {
            return new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: intensity,
                roughness: 0.4,
                metalness: 0.0,
                toneMapped: false
            });
        }

        static glass(tint = 0xffffff) {
            return new THREE.MeshPhysicalMaterial({
                color: tint,
                roughness: 0.02,
                metalness: 0.0,
                transmission: 0.95,
                thickness: 0.4,
                ior: 1.45,
                transparent: true,
                opacity: 0.35
            });
        }

        static foam() {
            return new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5,
                depthWrite: false
            });
        }

        // Material PBR completo generado proceduralmente (sin assets externos)
        // tint: color base | options: { size, repeat, roughness, metalness, normalStrength, aoIntensity, displacementScale }
        static pbr(tint = 0xffffff, options = {}) {
            if (!window.TextureFactory) {
                return new THREE.MeshStandardMaterial({ color: tint, roughness: 0.8, metalness: 0.0 });
            }

            const set = window.TextureFactory.pbrSet({
                size: options.size || 256,
                normalStrength: options.normalStrength || 1.0,
                aoIntensity: options.aoIntensity || 0.6
            });

            const repeat = options.repeat || 8;
            [set.map, set.roughnessMap, set.normalMap, set.aoMap, set.displacementMap].forEach(tex => {
                if (tex) tex.repeat.set(repeat, repeat);
            });

            return new THREE.MeshStandardMaterial({
                color: tint,
                map: set.map,
                roughnessMap: set.roughnessMap,
                normalMap: set.normalMap,
                normalScale: new THREE.Vector2(options.normalStrength || 0.7, options.normalStrength || 0.7),
                aoMap: set.aoMap,
                aoMapIntensity: options.aoIntensity ?? 0.8,
                displacementMap: options.useDisplacement ? set.displacementMap : null,
                displacementScale: options.displacementScale || 0.15,
                roughness: options.roughness ?? 0.85,
                metalness: options.metalness ?? 0.0
            });
        }

        // Ayuda: copia el atributo UV como UV2 (requerido por Three.js para que aoMap funcione)
        static ensureUV2(geometry) {
            if (geometry.attributes.uv && !geometry.attributes.uv2) {
                geometry.setAttribute('uv2', geometry.attributes.uv);
            }
            return geometry;
        }

        static wood(tint = 0x5b3a22) {
            return new THREE.MeshStandardMaterial({
                color: tint,
                roughness: 0.85,
                metalness: 0.0
            });
        }
    }

    window.MaterialLibrary = MaterialLibrary;
    console.log('🎨 MaterialLibrary cargado');
})();

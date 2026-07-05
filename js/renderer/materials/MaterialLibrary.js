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

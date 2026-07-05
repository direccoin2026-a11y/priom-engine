/**
 * AnimationSystem.js
 * Sistema de movimiento ligero: viento en pasto/árboles.
 * ADITIVO: registra objetos existentes (ej. this.grassMeshes de
 * MaxRenderer) y los mece sin tocar su geometría ni su material.
 * Costo por frame muy bajo (solo rotación/escala del objeto completo
 * o de un pequeño grupo, no por-vértice).
 */
(function() {
    'use strict';

    class AnimationSystem {
        constructor() {
            this.swayGroups = [];
            this.clock = 0;
        }

        // Registra una malla (o InstancedMesh) para que se mezca con el viento
        registerSway(mesh, options = {}) {
            if (!mesh) return;
            this.swayGroups.push({
                mesh,
                amplitude: options.amplitude ?? 0.03,
                speed: options.speed ?? 1.2,
                seed: Math.random() * Math.PI * 2,
                axis: options.axis || 'z'
            });
        }

        // Registra varias mallas de una vez (ej. this.grassMeshes)
        registerSwayGroup(meshes, options = {}) {
            if (!meshes) return;
            for (const m of meshes) this.registerSway(m, options);
        }

        update(delta) {
            this.clock += delta;
            for (const group of this.swayGroups) {
                const angle = Math.sin(this.clock * group.speed + group.seed) * group.amplitude;
                if (group.axis === 'x') group.mesh.rotation.x = angle;
                else if (group.axis === 'y') group.mesh.rotation.y = angle;
                else group.mesh.rotation.z = angle;
            }
        }

        // Ciclo de caminata simple para un mesh de animal (sube/baja + leve giro)
        walkCycle(mesh, time, speed = 4) {
            if (!mesh) return;
            mesh.position.y += Math.abs(Math.sin(time * speed)) * 0.02;
            mesh.rotation.z = Math.sin(time * speed) * 0.05;
        }
    }

    window.AnimationSystem = AnimationSystem;
    console.log('🏃 AnimationSystem cargado');
})();

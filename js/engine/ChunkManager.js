/**
 * ChunkManager.js
 * PRIMER PASO hacia streaming de mundo — no es streaming completo
 * (eso implica regenerar/descargar terreno y entidades por región,
 * un rediseño de arquitectura que dejamos para una sesión dedicada).
 * Esto sí es real y seguro: activa/desactiva mallas de decoración
 * (pasto, flores, decoración alpina) según la distancia del jugador,
 * para no pagar el costo de render de cosas lejos de la cámara.
 */
(function() {
    'use strict';

    class ChunkManager {
        constructor() {
            this.regions = [];
            this.checkInterval = 0.5; // revisar 2 veces por segundo, no cada frame
            this._timer = 0;
            this._lastCamXZ = new THREE.Vector2(0, 0);
        }

        // meshes: array de THREE.Object3D (o InstancedMesh) a mostrar/ocultar en bloque
        // lodTiers opcional: [{ distance, scaleMultiplier }] de más cerca a más lejos
        registerRegion(label, centerX, centerZ, radius, meshes, lodTiers = null) {
            this.regions.push({
                label,
                center: new THREE.Vector2(centerX, centerZ),
                radius,
                meshes: (meshes || []).filter(Boolean),
                lodTiers: lodTiers || [
                    { distance: radius * 0.4, opacity: 1.0 },
                    { distance: radius * 0.75, opacity: 0.6 },
                    { distance: radius, opacity: 0.25 }
                ],
                currentTier: -1
            });
            console.log(`📦 ChunkManager: región "${label}" registrada (${(meshes || []).length} mallas)`);
        }

        update(delta, cameraPos) {
            this._lastCamXZ.set(cameraPos.x, cameraPos.z);
            
            this._timer += delta;
            if (this._timer < this.checkInterval) return;
            this._timer = 0;

            for (const region of this.regions) {
                const dist = this._lastCamXZ.distanceTo(region.center);
                const visible = dist < region.radius;
                
                // ============================================================
                //  🎚️ LOD REAL POR NIVELES (no solo on/off): más cerca de la
                //  transición de radio, la decoración se desvanece en vez de
                //  aparecer/desaparecer de golpe, y pierde detalle gradual
                // ============================================================
                let tier = 0;
                if (visible && region.lodTiers) {
                    for (let i = 0; i < region.lodTiers.length; i++) {
                        if (dist <= region.lodTiers[i].distance) { tier = i; break; }
                        tier = region.lodTiers.length - 1;
                    }
                }
                
                if (region.currentTier !== tier || region.currentTier === -1) {
                    region.currentTier = tier;
                    const opacity = visible && region.lodTiers ? region.lodTiers[tier].opacity : (visible ? 1 : 0);
                    
                    for (const mesh of region.meshes) {
                        if (mesh.visible !== visible) mesh.visible = visible;
                        if (mesh.material && mesh.material.opacity !== undefined && !mesh.material.transparent) {
                            // no forzar transparencia en materiales opacos por defecto
                        } else if (mesh.material && 'opacity' in mesh.material) {
                            mesh.material.opacity = opacity;
                        }
                    }
                }
            }
        }
        
        // ============================================================
        //  🔗 API PARA OTRAS IAs: qué tan lejos está el jugador de una
        //  región con nombre, para que WorldAI (u otros sistemas futuros)
        //  puedan acotar su simulación solo a zonas cercanas al jugador
        //  — el paso conceptual real hacia streaming de mundo
        // ============================================================
        distanceToRegion(label) {
            const region = this.regions.find(r => r.label === label);
            if (!region) return Infinity;
            return this._lastCamXZ.distanceTo(region.center);
        }
        
        isPlayerNear(x, z, radius) {
            const dx = this._lastCamXZ.x - x;
            const dz = this._lastCamXZ.y - z;
            return (dx * dx + dz * dz) <= radius * radius;
        }
    }

    window.ChunkManager = ChunkManager;
    console.log('📦 ChunkManager cargado (base para streaming futuro)');
})();

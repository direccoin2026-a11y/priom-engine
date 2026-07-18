/**
 * WorldSerializer.js — Priom v0.3
 * Guarda y carga lo que el usuario construye con el Editor. No guarda
 * el mundo procedural completo (sería enorme e innecesario, ya se
 * regenera solo con la misma semilla si hiciera falta) — guarda
 * SOLO las entidades colocadas manualmente, como una capa encima del
 * mundo generado.
 */
(function() {
    'use strict';

    const STORAGE_KEY = 'priom_world_build_v1';

    class WorldSerializer {
        constructor(engine) {
            this.engine = engine;
            this.placedEntities = []; // { type, x, y, z, scale, timestamp }
        }

        // Llamar desde Editor.onPlace cada vez que se coloca algo
        recordPlacement(type, x, y, z, scale = 1) {
            this.placedEntities.push({ type, x, y, z, scale, timestamp: Date.now() });
        }

        save() {
            try {
                const data = {
                    version: 'v0.3',
                    savedAt: Date.now(),
                    entities: this.placedEntities
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                console.log(`💾 Mundo guardado: ${this.placedEntities.length} entidad(es) colocada(s)`);
                return true;
            } catch (e) {
                console.warn('⚠️ No se pudo guardar el mundo', e);
                return false;
            }
        }

        hasSavedWorld() {
            try {
                return !!localStorage.getItem(STORAGE_KEY);
            } catch (e) {
                return false;
            }
        }

        // Reconstruye lo guardado creando las entidades reales vía EntityFactory
        load() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) {
                    console.log('💾 No hay ningún mundo guardado todavía');
                    return false;
                }

                const data = JSON.parse(raw);
                const factory = this.engine.getModule('entityFactory');
                const ecs = this.engine.getModule('ecs');
                const gameWorld = this.engine.getModule('gameWorld');
                if (!factory) return false;

                let restored = 0;
                for (const entry of (data.entities || [])) {
                    let id = -1;
                    switch (entry.type) {
                        case 'tree': id = factory.createTree(entry.x, entry.y, entry.z); break;
                        case 'rock': id = factory.createRock(entry.x, entry.y, entry.z); break;
                        case 'animal':
                            id = factory.createAnimal(entry.x, entry.y, entry.z, false);
                            break;
                    }
                    if (id !== -1) {
                        restored++;
                        if (entry.scale && entry.scale !== 1 && ecs) {
                            ecs.scaleX[id] = entry.scale;
                            ecs.scaleY[id] = entry.scale;
                            ecs.scaleZ[id] = entry.scale;
                        }
                        if (entry.type === 'animal' && gameWorld && gameWorld.ecosystems) {
                            gameWorld.ecosystems.entities.animals.add(id);
                        }
                    }
                }

                this.placedEntities = data.entities || [];
                console.log(`💾 Mundo cargado: ${restored} entidad(es) restaurada(s) de ${data.entities.length} guardadas`);
                return true;
            } catch (e) {
                console.warn('⚠️ No se pudo cargar el mundo guardado (puede estar corrupto)', e);
                return false;
            }
        }

        clear() {
            try {
                localStorage.removeItem(STORAGE_KEY);
                this.placedEntities = [];
                console.log('💾 Mundo guardado borrado');
                return true;
            } catch (e) {
                return false;
            }
        }

        getStats() {
            return {
                placedCount: this.placedEntities.length,
                hasSaved: this.hasSavedWorld()
            };
        }
    }

    window.WorldSerializer = WorldSerializer;
    console.log('💾 WorldSerializer cargado (Priom v0.3)');
})();

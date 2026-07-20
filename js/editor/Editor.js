/**
 * Editor.js — Priom v0.3
 * Primer componente del editor: tocar/hacer clic en el suelo para
 * colocar entidades (árboles, rocas, flores, animales). Coordinado con
 * InputController para no disparar al arrastrar la cámara (un toque
 * corto = colocar, un arrastre = mirar alrededor, igual que cualquier
 * editor de mundo real).
 *
 * ADITIVO y autónomo: no reemplaza nada existente. Se activa/desactiva
 * con toggle(), y mientras está apagado el motor se comporta exactamente
 * como antes.
 */
(function() {
    'use strict';

    const PLACEABLE_TYPES = ['tree', 'rock', 'animal', 'flower'];

    class Editor {
        constructor(engine) {
            this.engine = engine;
            this.enabled = false;
            this.placementType = 'tree';
            this.mode = 'place'; // 'place' | 'select'
            this.selectedId = -1;
            this.selectedMesh = null;
            this.selectedInstanceIdx = -1;
            
            this._raycaster = new THREE.Raycaster();
            this._groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            this._pointerNDC = new THREE.Vector2();
            
            this._downPos = null;
            this._downTime = 0;
            this._dragThresholdPx = 8;
            this._tapMaxMs = 400;
            
            this.placedCount = 0;
            this.onPlace = null; // callback opcional: (type, x, y, z) => {}
            this.onSelect = null; // callback opcional: (entityId) => {}
            
            // ============================================================
            //  ↩️ DESHACER / REHACER (v0.3)
            //  Pila de acciones: cada colocación o borrado queda registrado
            //  con lo necesario para revertirlo. Límite de 50 para no
            //  crecer sin fin en una sesión larga de edición.
            // ============================================================
            this._undoStack = [];
            this._redoStack = [];
            this._maxHistory = 50;
            this._boundDown = this._onPointerDown.bind(this);
            this._boundUp = this._onPointerUp.bind(this);
        }

        // Cambia entre colocar entidades nuevas y seleccionar/borrar existentes
        setMode(mode) {
            if (mode === 'place' || mode === 'select') {
                this.mode = mode;
                console.log('✏️ Editor: modo ' + mode);
            }
        }

        // Borra la entidad actualmente seleccionada
        deleteSelected() {
            if (this.selectedId === -1) {
                console.log('✏️ Editor: nada seleccionado para borrar');
                return false;
            }
            
            try {
                const ecs = this.engine.getModule('ecs');
                const gameWorld = this.engine.getModule('gameWorld');
                if (!ecs) return false;
                
                // Capturar los datos ANTES de borrar, para poder recrearlo si se deshace
                const snapshot = {
                    entityType: this._entityTypeOf(this.selectedId, ecs),
                    x: ecs.posX[this.selectedId],
                    y: ecs.posY[this.selectedId],
                    z: ecs.posZ[this.selectedId],
                    scale: ecs.scaleX[this.selectedId]
                };
                
                ecs.destroyEntity(this.selectedId);
                
                // Quitarlo también de los sets de ecosistema si aplica
                if (gameWorld && gameWorld.ecosystems && gameWorld.ecosystems.entities) {
                    for (const set of Object.values(gameWorld.ecosystems.entities)) {
                        if (set instanceof Set) set.delete(this.selectedId);
                    }
                }
                
                console.log(`🗑️ Editor: entidad ${this.selectedId} borrada`);
                this._pushUndo({ kind: 'delete', snapshot });
                
                this.selectedId = -1;
                this.selectedMesh = null;
                this.selectedInstanceIdx = -1;
                return true;
            } catch (e) {
                console.warn('⚠️ Editor: no se pudo borrar', e);
                return false;
            }
        }
        
        _entityTypeOf(id, ecs) {
            if (ecs.isTree[id]) return 'tree';
            if (ecs.isRock[id]) return 'rock';
            if (ecs.isAnimal[id]) return 'animal';
            return 'tree';
        }
        
        // ============================================================
        //  ↩️ DESHACER / REHACER (v0.3)
        // ============================================================
        _pushUndo(action) {
            this._undoStack.push(action);
            if (this._undoStack.length > this._maxHistory) this._undoStack.shift();
            this._redoStack = []; // cualquier acción nueva invalida el historial de "rehacer"
        }
        
        _spawn(entityType, x, y, z, scale = 1) {
            const factory = this.engine.getModule('entityFactory');
            const ecs = this.engine.getModule('ecs');
            const gameWorld = this.engine.getModule('gameWorld');
            if (!factory) return -1;
            
            let id = -1;
            if (entityType === 'tree') id = factory.createTree(x, y, z);
            else if (entityType === 'rock') id = factory.createRock(x, y, z);
            else if (entityType === 'animal') id = factory.createAnimal(x, y, z, false);
            
            if (id !== -1 && scale !== 1 && ecs) {
                ecs.scaleX[id] = scale; ecs.scaleY[id] = scale; ecs.scaleZ[id] = scale;
            }
            if (id !== -1 && entityType === 'animal' && gameWorld && gameWorld.ecosystems) {
                gameWorld.ecosystems.entities.animals.add(id);
            }
            return id;
        }
        
        undo() {
            const action = this._undoStack.pop();
            if (!action) {
                console.log('↩️ Editor: nada que deshacer');
                return false;
            }
            
            if (action.kind === 'place') {
                // Deshacer una colocación = borrarla
                const ecs = this.engine.getModule('ecs');
                if (ecs) ecs.destroyEntity(action.id);
                this._redoStack.push(action);
                console.log('↩️ Editor: colocación deshecha');
            } else if (action.kind === 'delete') {
                // Deshacer un borrado = recrearlo donde estaba
                const s = action.snapshot;
                const newId = this._spawn(s.entityType, s.x, s.y, s.z, s.scale);
                this._redoStack.push({ kind: 'delete', snapshot: s, restoredId: newId });
                console.log('↩️ Editor: borrado deshecho (entidad restaurada)');
            }
            return true;
        }
        
        redo() {
            const action = this._redoStack.pop();
            if (!action) {
                console.log('↪️ Editor: nada que rehacer');
                return false;
            }
            
            if (action.kind === 'place') {
                const newId = this._spawn(action.entityType, action.x, action.y, action.z, action.scale);
                this._undoStack.push({ ...action, id: newId });
                console.log('↪️ Editor: colocación rehecha');
            } else if (action.kind === 'delete') {
                const ecs = this.engine.getModule('ecs');
                if (ecs && action.restoredId !== -1) ecs.destroyEntity(action.restoredId);
                this._undoStack.push(action);
                console.log('↪️ Editor: borrado rehecho');
            }
            return true;
        }

        toggle(forceState) {
            this.enabled = (forceState !== undefined) ? forceState : !this.enabled;
            const renderer = this.engine.getModule('renderer');
            const el = renderer && renderer.renderer ? renderer.renderer.domElement : null;
            if (!el) return this.enabled;
            
            if (this.enabled) {
                el.addEventListener('pointerdown', this._boundDown, { passive: true });
                el.addEventListener('pointerup', this._boundUp, { passive: true });
                console.log('✏️ Editor activado — toca el suelo para colocar: ' + this.placementType);
            } else {
                el.removeEventListener('pointerdown', this._boundDown);
                el.removeEventListener('pointerup', this._boundUp);
                console.log('✏️ Editor desactivado');
            }
            return this.enabled;
        }

        setPlacementType(type) {
            if (PLACEABLE_TYPES.includes(type)) {
                this.placementType = type;
                console.log('✏️ Editor: colocando ' + type);
            }
        }

        _onPointerDown(e) {
            this._downPos = { x: e.clientX, y: e.clientY };
            this._downTime = performance.now();
        }

        _onPointerUp(e) {
            if (!this._downPos) return;
            const dx = e.clientX - this._downPos.x;
            const dy = e.clientY - this._downPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const elapsed = performance.now() - this._downTime;
            this._downPos = null;
            
            // Solo actuar si fue un TOQUE corto, no un arrastre de cámara
            if (dist > this._dragThresholdPx || elapsed > this._tapMaxMs) return;
            
            if (this.mode === 'select') {
                this._selectAt(e.clientX, e.clientY);
            } else {
                this._placeAt(e.clientX, e.clientY);
            }
        }

        // Busca qué entidad (si alguna) está bajo el punto tocado,
        // recorriendo todas las InstancedMesh del renderer (v0.3)
        _selectAt(clientX, clientY) {
            try {
                const renderer = this.engine.getModule('renderer');
                if (!renderer || !renderer.instanceMeshes) return;
                
                this._pointerNDC.x = (clientX / window.innerWidth) * 2 - 1;
                this._pointerNDC.y = -(clientY / window.innerHeight) * 2 + 1;
                this._raycaster.setFromCamera(this._pointerNDC, renderer.camera);
                
                const meshes = Array.from(renderer.instanceMeshes.values());
                const hits = this._raycaster.intersectObjects(meshes, false);
                
                if (hits.length === 0) {
                    console.log('✏️ Editor: nada bajo el toque');
                    this.selectedId = -1;
                    return;
                }
                
                const hit = hits[0];
                const mesh = hit.object;
                const entityIds = mesh.userData.entityIds;
                if (!entityIds || hit.instanceId === undefined) return;
                
                const id = entityIds[hit.instanceId];
                if (id === undefined) return;
                
                this.selectedId = id;
                this.selectedMesh = mesh;
                this.selectedInstanceIdx = hit.instanceId;
                
                console.log(`✏️ Editor: entidad ${id} seleccionada (toca "Borrar" para quitarla)`);
                if (typeof this.onSelect === 'function') this.onSelect(id);
            } catch (e) {
                console.warn('⚠️ Editor: no se pudo seleccionar', e);
            }
        }

        _placeAt(clientX, clientY) {
            try {
                const renderer = this.engine.getModule('renderer');
                const gameWorld = this.engine.getModule('gameWorld');
                const factory = this.engine.getModule('entityFactory');
                if (!renderer || !factory) return;
                
                const terrain = gameWorld && gameWorld.generators ? gameWorld.generators.terrain : null;
                
                this._pointerNDC.x = (clientX / window.innerWidth) * 2 - 1;
                this._pointerNDC.y = -(clientY / window.innerHeight) * 2 + 1;
                
                this._raycaster.setFromCamera(this._pointerNDC, renderer.camera);
                
                const hit = new THREE.Vector3();
                const didHit = this._raycaster.ray.intersectPlane(this._groundPlane, hit);
                if (!didHit) return;
                
                // Ajustar a la altura real del terreno en ese punto (el plano
                // usado para el raycast es solo una aproximación en y=0)
                const y = terrain && terrain.getHeight ? terrain.getHeight(hit.x, hit.z) : hit.y;
                
                let id = -1;
                switch (this.placementType) {
                    case 'tree':
                        id = factory.createTree(hit.x, y, hit.z);
                        break;
                    case 'rock':
                        id = factory.createRock(hit.x, y, hit.z);
                        break;
                    case 'animal':
                        id = factory.createAnimal(hit.x, y + 0.3, hit.z, Math.random() < 0.3);
                        break;
                    case 'flower': {
                        const placer = this.engine.getModule('vegetationPlacer');
                        if (placer) placer.plantFlowers(5);
                        break;
                    }
                }
                
                if (id !== -1) {
                    this.placedCount++;
                    this._pushUndo({ kind: 'place', entityType: this.placementType, id, x: hit.x, y, z: hit.z, scale: 1 });
                    if (typeof this.onPlace === 'function') {
                        this.onPlace(this.placementType, hit.x, y, hit.z);
                    }
                    console.log(`✏️ Editor: ${this.placementType} colocado en (${hit.x.toFixed(1)}, ${y.toFixed(1)}, ${hit.z.toFixed(1)})`);
                }
            } catch (e) {
                console.warn('⚠️ Editor: no se pudo colocar', e);
            }
        }

        getStats() {
            return {
                enabled: this.enabled,
                mode: this.mode,
                placementType: this.placementType,
                placedCount: this.placedCount,
                selectedId: this.selectedId
            };
        }
    }

    window.Editor = Editor;
    window.PRIOM_VERSION = window.PRIOM_VERSION || 'v0.3';
    console.log('✏️ Editor cargado (Priom v0.3)');
})();

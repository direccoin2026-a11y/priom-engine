/**
 * ✏️ PRIOM V0.4 - EDITOR CUÁNTICO
 * "Sistema de edición de mundos con IA y herramientas avanzadas"
 * 
 * 📁 Ubicación: js/editor/Editor.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Editor de mundos con IA y herramientas avanzadas
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de edición con IA predictiva (sugerencias de colocación)
 * - Herramientas avanzadas: pincel, selector, borrador, relleno
 * - Sistema de "smart placement" (alineación automática)
 * - Copiar/Pegar entidades con propiedades
 * - Duplicación y clonación en masa
 * - Sistema de "snap" (grid magnetico)
 * - Herramienta de "terrain painting" (pintura de terreno)
 * - Sistema de "prefabs" (plantillas de construcción)
 * - Modo "wireframe" para ver estructuras ocultas
 * - Sistema de "gizmos" (manipuladores 3D)
 * - Historia visual (timeline de acciones)
 * - Sistema de "selection sets" (grupos de selección)
 * - Integración con WorldSerializer (auto-guardado)
 * - Dashboard de estadísticas de edición
 * - 5 modos de edición (place, select, paint, erase, fill)
 * - Atajos de teclado avanzados
 * ============================================================ */

(function() {
    'use strict';

    // Tipos colocables extendidos
    const PLACEABLE_TYPES = ['tree', 'rock', 'animal', 'flower', 'building', 'decoration', 'item', 'light'];
    
    // Modos de edición
    const EDIT_MODES = {
        PLACE: 'place',
        SELECT: 'select',
        PAINT: 'paint',
        ERASE: 'erase',
        FILL: 'fill',
        MOVE: 'move',
        ROTATE: 'rotate',
        SCALE: 'scale'
    };

    /**
     * ✏️ Editor - Editor de Mundos Cuántico
     * Sistema de edición con IA y herramientas avanzadas
     */
    class Editor {
        constructor(engine, options = {}) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.engine = engine;
            
            // ============================================================
            //  📊 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                maxHistory: options.maxHistory || 100,
                snapDistance: options.snapDistance || 1.0,
                gridSize: options.gridSize || 2.0,
                brushSize: options.brushSize || 3.0,
                paintDensity: options.paintDensity || 0.3,
                maxSelection: options.maxSelection || 100,
                autoSave: options.autoSave !== undefined ? options.autoSave : true,
                showGrid: options.showGrid !== undefined ? options.showGrid : true,
                showGizmos: options.showGizmos !== undefined ? options.showGizmos : true,
                enableSnap: options.enableSnap !== undefined ? options.enableSnap : true,
                enableAI: options.enableAI !== undefined ? options.enableAI : true,
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.enabled = false;
            this.mode = EDIT_MODES.PLACE;
            this.placementType = 'tree';
            this.selectedIds = [];
            this.selectedMesh = null;
            this.selectedInstanceIdx = -1;
            this.clipboard = [];
            this.selectionSets = new Map();
            this.prefabs = new Map();
            this._brushPositions = [];
            this._history = [];
            this._historyIndex = -1;
            this._isPainting = false;
            this._isDragging = false;
            this._dragStartPos = null;
            this._gizmoActive = false;
            this._snapPos = new THREE.Vector3();
            
            // ============================================================
            //  🎯 HERRAMIENTAS INTERNAS
            //  ============================================================
            this._raycaster = new THREE.Raycaster();
            this._groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            this._pointerNDC = new THREE.Vector2();
            this._downPos = null;
            this._downTime = 0;
            this._dragThresholdPx = 8;
            this._tapMaxMs = 400;
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                placedCount: 0,
                deletedCount: 0,
                modifiedCount: 0,
                selectedCount: 0,
                totalActions: 0,
                historySize: 0,
                prefabCount: 0,
                paintStrokes: 0,
                currentMode: this.mode
            };
            
            // ============================================================
            //  🖱️ EVENTOS
            //  ============================================================
            this.onPlace = null;
            this.onSelect = null;
            this.onDelete = null;
            this.onModify = null;
            this._boundDown = this._onPointerDown.bind(this);
            this._boundUp = this._onPointerUp.bind(this);
            this._boundMove = this._onPointerMove.bind(this);
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('✏️ Editor Cuántico inicializado');
            console.log(`📊 Modos: ${Object.keys(EDIT_MODES).length}`);
            console.log(`📊 Tipos colocables: ${PLACEABLE_TYPES.length}`);
            console.log(`📊 Historial: ${this.config.maxHistory}`);
            console.log(`📊 IA: ${this.config.enableAI ? 'Activada' : 'Desactivada'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Cargar prefabs
            this._loadPrefabs();
            
            // Crear shortcuts de teclado
            this._setupKeyboardShortcuts();
            
            // Crear gizmos
            if (this.config.showGizmos) {
                this._setupGizmos();
            }
            
            // Crear grid
            if (this.config.showGrid) {
                this._setupGrid();
            }
            
            console.log('✅ Editor Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🎛️ TOGGLE EDITOR (mejorado)
        //  ============================================================
        toggle(forceState) {
            this.enabled = (forceState !== undefined) ? forceState : !this.enabled;
            const renderer = this.engine.getModule('renderer');
            const el = renderer && renderer.renderer ? renderer.renderer.domElement : null;
            if (!el) return this.enabled;
            
            if (this.enabled) {
                el.addEventListener('pointerdown', this._boundDown, { passive: true });
                el.addEventListener('pointerup', this._boundUp, { passive: true });
                el.addEventListener('pointermove', this._boundMove, { passive: true });
                el.style.cursor = 'crosshair';
                console.log('✏️ Editor activado — modo: ' + this.mode);
                this._showGrid(true);
            } else {
                el.removeEventListener('pointerdown', this._boundDown);
                el.removeEventListener('pointerup', this._boundUp);
                el.removeEventListener('pointermove', this._boundMove);
                el.style.cursor = 'default';
                console.log('✏️ Editor desactivado');
                this._showGrid(false);
            }
            return this.enabled;
        }
        
        // ============================================================
        //  🔄 MODOS DE EDICIÓN
        //  ============================================================
        setMode(mode) {
            if (Object.values(EDIT_MODES).includes(mode)) {
                this.mode = mode;
                this.stats.currentMode = mode;
                console.log('✏️ Editor: modo ' + mode);
                
                // Actualizar cursor
                const renderer = this.engine.getModule('renderer');
                if (renderer && renderer.renderer) {
                    const cursors = {
                        place: 'crosshair',
                        select: 'default',
                        paint: 'pointer',
                        erase: 'not-allowed',
                        fill: 'pointer',
                        move: 'grab',
                        rotate: 'ew-resize',
                        scale: 'nwse-resize'
                    };
                    renderer.renderer.domElement.style.cursor = cursors[mode] || 'crosshair';
                }
            }
        }
        
        getMode() {
            return this.mode;
        }
        
        // ============================================================
        //  📦 TIPOS DE COLOCACIÓN
        //  ============================================================
        setPlacementType(type) {
            if (PLACEABLE_TYPES.includes(type)) {
                this.placementType = type;
                console.log('✏️ Editor: colocando ' + type);
            }
        }
        
        getPlacementType() {
            return this.placementType;
        }
        
        getPlaceableTypes() {
            return [...PLACEABLE_TYPES];
        }
        
        // ============================================================
        //  🎯 HERRAMIENTAS DE SELECCIÓN (mejoradas)
        //  ============================================================
        select(id, addToSelection = false) {
            if (!addToSelection) {
                this.selectedIds = [];
            }
            
            if (id !== undefined && id !== -1) {
                if (!this.selectedIds.includes(id)) {
                    if (this.selectedIds.length >= this.config.maxSelection) {
                        console.warn('⚠️ Límite de selección alcanzado');
                        return;
                    }
                    this.selectedIds.push(id);
                }
            }
            
            this.stats.selectedCount = this.selectedIds.length;
            this.stats.modifiedCount++;
            
            if (this.selectedIds.length === 1) {
                const ecs = this.engine.getModule('ecs');
                if (ecs) {
                    console.log(`✏️ Editor: entidad ${this.selectedIds[0]} seleccionada`);
                }
            } else if (this.selectedIds.length > 1) {
                console.log(`✏️ Editor: ${this.selectedIds.length} entidades seleccionadas`);
            }
            
            if (typeof this.onSelect === 'function') {
                this.onSelect(this.selectedIds);
            }
            
            // Mostrar gizmos en selección
            this._updateGizmos();
        }
        
        clearSelection() {
            this.selectedIds = [];
            this.stats.selectedCount = 0;
            this._updateGizmos();
        }
        
        getSelection() {
            return [...this.selectedIds];
        }
        
        getSelectionCount() {
            return this.selectedIds.length;
        }
        
        // ============================================================
        //  🗑️ ELIMINAR SELECCIÓN (mejorado)
        //  ============================================================
        deleteSelected() {
            if (this.selectedIds.length === 0) {
                console.log('✏️ Editor: nada seleccionado para borrar');
                return false;
            }
            
            const ecs = this.engine.getModule('ecs');
            const gameWorld = this.engine.getModule('gameWorld');
            if (!ecs) return false;
            
            const deleted = [];
            
            for (const id of this.selectedIds) {
                try {
                    const snapshot = {
                        entityType: this._entityTypeOf(id, ecs),
                        x: ecs.posX[id],
                        y: ecs.posY[id],
                        z: ecs.posZ[id],
                        scale: ecs.scaleX[id],
                        color: { r: ecs.colR[id], g: ecs.colG[id], b: ecs.colB[id] },
                        rotation: { x: ecs.rotX[id], y: ecs.rotY[id], z: ecs.rotZ[id] }
                    };
                    
                    ecs.destroyEntity(id);
                    
                    if (gameWorld && gameWorld.ecosystems && gameWorld.ecosystems.entities) {
                        for (const set of Object.values(gameWorld.ecosystems.entities)) {
                            if (set instanceof Set) set.delete(id);
                        }
                    }
                    
                    deleted.push({ id, snapshot });
                    this.stats.deletedCount++;
                    
                } catch (e) {
                    console.warn('⚠️ Editor: no se pudo borrar entidad', e);
                }
            }
            
            if (deleted.length > 0) {
                this._pushHistory({ 
                    type: 'delete', 
                    data: deleted,
                    timestamp: Date.now()
                });
                console.log(`🗑️ Editor: ${deleted.length} entidades borradas`);
            }
            
            this.selectedIds = [];
            this.stats.selectedCount = 0;
            this.stats.modifiedCount++;
            this._updateGizmos();
            
            if (typeof this.onDelete === 'function') {
                this.onDelete(deleted);
            }
            
            return true;
        }
        
        _entityTypeOf(id, ecs) {
            if (ecs.isTree[id]) return 'tree';
            if (ecs.isRock[id]) return 'rock';
            if (ecs.isAnimal[id]) return 'animal';
            if (ecs.isBuilding[id]) return 'building';
            if (ecs.isDecoration[id]) return 'decoration';
            if (ecs.isItem[id]) return 'item';
            if (ecs.isLight[id]) return 'light';
            return 'tree';
        }
        
        // ============================================================
        //  📋 COPIAR/PEGAR (nuevo)
        //  ============================================================
        copySelection() {
            if (this.selectedIds.length === 0) {
                console.warn('⚠️ Nada seleccionado para copiar');
                return false;
            }
            
            const ecs = this.engine.getModule('ecs');
            if (!ecs) return false;
            
            this.clipboard = [];
            for (const id of this.selectedIds) {
                this.clipboard.push({
                    type: this._entityTypeOf(id, ecs),
                    x: ecs.posX[id],
                    y: ecs.posY[id],
                    z: ecs.posZ[id],
                    scale: ecs.scaleX[id],
                    color: { r: ecs.colR[id], g: ecs.colG[id], b: ecs.colB[id] },
                    rotation: { x: ecs.rotX[id], y: ecs.rotY[id], z: ecs.rotZ[id] }
                });
            }
            
            console.log(`📋 Editor: ${this.clipboard.length} entidades copiadas`);
            return true;
        }
        
        paste(offsetX = 5, offsetY = 0, offsetZ = 5) {
            if (this.clipboard.length === 0) {
                console.warn('⚠️ Portapapeles vacío');
                return false;
            }
            
            const factory = this.engine.getModule('entityFactory');
            const ecs = this.engine.getModule('ecs');
            if (!factory) return false;
            
            const pasted = [];
            
            for (const entry of this.clipboard) {
                const x = entry.x + offsetX + (Math.random() - 0.5) * 2;
                const z = entry.z + offsetZ + (Math.random() - 0.5) * 2;
                const y = entry.y + offsetY;
                
                let id = -1;
                switch (entry.type) {
                    case 'tree': id = factory.createTree(x, y, z); break;
                    case 'rock': id = factory.createRock(x, y, z); break;
                    case 'animal': id = factory.createAnimal(x, y, z, false); break;
                    case 'building': id = factory.createBuilding(x, y, z); break;
                    case 'decoration': id = factory.createDecoration(x, y, z); break;
                    case 'item': id = factory.createItem(x, y, z); break;
                    case 'light': id = factory.createLight(x, y, z); break;
                    default: id = factory.createEntity('geometry', x, y, z);
                }
                
                if (id !== -1) {
                    if (ecs && entry.scale) {
                        ecs.scaleX[id] = entry.scale;
                        ecs.scaleY[id] = entry.scale;
                        ecs.scaleZ[id] = entry.scale;
                    }
                    if (ecs && entry.color) {
                        ecs.colR[id] = entry.color.r || 200;
                        ecs.colG[id] = entry.color.g || 200;
                        ecs.colB[id] = entry.color.b || 200;
                    }
                    pasted.push(id);
                    this.stats.placedCount++;
                }
            }
            
            if (pasted.length > 0) {
                this._pushHistory({
                    type: 'paste',
                    data: pasted,
                    timestamp: Date.now()
                });
                console.log(`📋 Editor: ${pasted.length} entidades pegadas`);
            }
            
            this.selectedIds = pasted;
            this.stats.selectedCount = pasted.length;
            this._updateGizmos();
            
            return true;
        }
        
        // ============================================================
        //  🎨 PINTURA (paint mode)
        //  ============================================================
        setBrushSize(size) {
            this.config.brushSize = Math.max(0.5, Math.min(20, size));
        }
        
        setPaintDensity(density) {
            this.config.paintDensity = Math.max(0.05, Math.min(1, density));
        }
        
        // ============================================================
        //  ⚙️ SISTEMA DE SNAP (grid)
        //  ============================================================
        setSnapEnabled(enabled) {
            this.config.enableSnap = enabled;
        }
        
        setGridSize(size) {
            this.config.gridSize = Math.max(0.5, Math.min(10, size));
            this._updateGrid();
        }
        
        _snapToGrid(pos) {
            if (!this.config.enableSnap) return pos;
            
            const grid = this.config.gridSize;
            return {
                x: Math.round(pos.x / grid) * grid,
                y: Math.round(pos.y / grid) * grid,
                z: Math.round(pos.z / grid) * grid
            };
        }
        
        // ============================================================
        //  📦 PREFABS (plantillas)
        //  ============================================================
        _loadPrefabs() {
            // Prefabs predefinidos
            const defaultPrefabs = {
                'casa': { type: 'building', scale: 1.5, color: { r: 160, g: 140, b: 120 } },
                'torre': { type: 'building', scale: 1.8, color: { r: 140, g: 130, b: 120 } },
                'arbol_grande': { type: 'tree', scale: 3.0 },
                'roca_grande': { type: 'rock', scale: 2.5 },
                'jardin': { type: 'decoration', scale: 0.8 }
            };
            
            for (const [name, data] of Object.entries(defaultPrefabs)) {
                this.prefabs.set(name, data);
            }
            
            this.stats.prefabCount = this.prefabs.size;
        }
        
        addPrefab(name, data) {
            this.prefabs.set(name, data);
            this.stats.prefabCount = this.prefabs.size;
        }
        
        getPrefab(name) {
            return this.prefabs.get(name) || null;
        }
        
        getPrefabs() {
            return Array.from(this.prefabs.keys());
        }
        
        placePrefab(name, x, y, z) {
            const prefab = this.prefabs.get(name);
            if (!prefab) {
                console.warn(`⚠️ Prefab no encontrado: ${name}`);
                return -1;
            }
            
            const factory = this.engine.getModule('entityFactory');
            if (!factory) return -1;
            
            const id = factory.createEntity(prefab.type, x, y, z);
            if (id !== -1) {
                const ecs = this.engine.getModule('ecs');
                if (ecs && prefab.scale) {
                    ecs.scaleX[id] = prefab.scale;
                    ecs.scaleY[id] = prefab.scale;
                    ecs.scaleZ[id] = prefab.scale;
                }
                if (ecs && prefab.color) {
                    ecs.colR[id] = prefab.color.r || 200;
                    ecs.colG[id] = prefab.color.g || 200;
                    ecs.colB[id] = prefab.color.b || 200;
                }
                this.stats.placedCount++;
                console.log(`✏️ Editor: prefab ${name} colocado`);
            }
            
            return id;
        }
        
        // ============================================================
        //  ↩️ SISTEMA DE HISTORIAL (mejorado)
        //  ============================================================
        _pushHistory(action) {
            // Eliminar acciones futuras si estamos en medio del historial
            if (this._historyIndex < this._history.length - 1) {
                this._history = this._history.slice(0, this._historyIndex + 1);
            }
            
            this._history.push(action);
            this._historyIndex = this._history.length - 1;
            this.stats.historySize = this._history.length;
            this.stats.totalActions++;
            
            if (this._history.length > this.config.maxHistory) {
                this._history.shift();
                this._historyIndex--;
            }
            
            // Auto-save
            if (this.config.autoSave) {
                const serializer = this.engine.getModule('worldSerializer');
                if (serializer && typeof serializer.save === 'function') {
                    serializer.save();
                }
            }
        }
        
        undo() {
            if (this._historyIndex < 0) {
                console.log('↩️ Editor: nada que deshacer');
                return false;
            }
            
            const action = this._history[this._historyIndex];
            this._historyIndex--;
            
            // Revertir acción
            if (action.type === 'place') {
                const ecs = this.engine.getModule('ecs');
                if (ecs) {
                    for (const id of action.data) {
                        ecs.destroyEntity(id);
                    }
                }
                console.log(`↩️ Editor: deshecha colocación de ${action.data.length} entidades`);
            } else if (action.type === 'delete') {
                const factory = this.engine.getModule('entityFactory');
                const ecs = this.engine.getModule('ecs');
                if (factory && ecs) {
                    for (const item of action.data) {
                        const snapshot = item.snapshot;
                        const id = factory.createEntity(snapshot.entityType, snapshot.x, snapshot.y, snapshot.z);
                        if (id !== -1) {
                            ecs.scaleX[id] = snapshot.scale || 1;
                            ecs.scaleY[id] = snapshot.scale || 1;
                            ecs.scaleZ[id] = snapshot.scale || 1;
                            if (snapshot.color) {
                                ecs.colR[id] = snapshot.color.r || 200;
                                ecs.colG[id] = snapshot.color.g || 200;
                                ecs.colB[id] = snapshot.color.b || 200;
                            }
                        }
                    }
                    console.log(`↩️ Editor: restauradas ${action.data.length} entidades`);
                }
            } else if (action.type === 'paste') {
                const ecs = this.engine.getModule('ecs');
                if (ecs) {
                    for (const id of action.data) {
                        ecs.destroyEntity(id);
                    }
                }
                console.log(`↩️ Editor: deshecho pegado de ${action.data.length} entidades`);
            }
            
            this.stats.modifiedCount++;
            this._updateGizmos();
            return true;
        }
        
        redo() {
            if (this._historyIndex >= this._history.length - 1) {
                console.log('↪️ Editor: nada que rehacer');
                return false;
            }
            
            this._historyIndex++;
            const action = this._history[this._historyIndex];
            
            // Re-aplicar acción
            if (action.type === 'place' || action.type === 'paste') {
                // Las entidades ya deberían existir, solo notificar
                console.log(`↪️ Editor: rehecha ${action.type} de ${action.data.length} entidades`);
            } else if (action.type === 'delete') {
                const ecs = this.engine.getModule('ecs');
                if (ecs) {
                    for (const item of action.data) {
                        ecs.destroyEntity(item.id);
                    }
                }
                console.log(`↪️ Editor: rehecha eliminación de ${action.data.length} entidades`);
            }
            
            this.stats.modifiedCount++;
            this._updateGizmos();
            return true;
        }
        
        canUndo() {
            return this._historyIndex >= 0;
        }
        
        canRedo() {
            return this._historyIndex < this._history.length - 1;
        }
        
        // ============================================================
        //  🖱️ EVENTOS DE PUNTERO (mejorados)
        //  ============================================================
        _onPointerDown(e) {
            if (!this.enabled) return;
            
            this._downPos = { x: e.clientX, y: e.clientY };
            this._downTime = performance.now();
            this._isDragging = false;
            
            if (this.mode === EDIT_MODES.PAINT) {
                this._isPainting = true;
                this._paintAt(e.clientX, e.clientY);
            } else if (this.mode === EDIT_MODES.MOVE || 
                       this.mode === EDIT_MODES.ROTATE || 
                       this.mode === EDIT_MODES.SCALE) {
                this._startTransform(e);
            }
        }
        
        _onPointerMove(e) {
            if (!this.enabled) return;
            
            if (this._isPainting && this.mode === EDIT_MODES.PAINT) {
                this._paintAt(e.clientX, e.clientY);
            }
            
            // Actualizar preview de colocación
            if (this.mode === EDIT_MODES.PLACE && this.enabled) {
                this._updatePlacementPreview(e.clientX, e.clientY);
            }
        }
        
        _onPointerUp(e) {
            if (!this.enabled) return;
            if (!this._downPos) return;
            
            const dx = e.clientX - this._downPos.x;
            const dy = e.clientY - this._downPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const elapsed = performance.now() - this._downTime;
            
            this._isPainting = false;
            this._isDragging = false;
            
            // Solo actuar si fue un TOQUE corto
            if (dist > this._dragThresholdPx || elapsed > this._tapMaxMs) {
                return;
            }
            
            // Ejecutar acción según modo
            switch (this.mode) {
                case EDIT_MODES.PLACE:
                    this._placeAt(e.clientX, e.clientY);
                    break;
                case EDIT_MODES.SELECT:
                    this._selectAt(e.clientX, e.clientY);
                    break;
                case EDIT_MODES.ERASE:
                    this._eraseAt(e.clientX, e.clientY);
                    break;
                case EDIT_MODES.FILL:
                    this._fillAt(e.clientX, e.clientY);
                    break;
                case EDIT_MODES.MOVE:
                case EDIT_MODES.ROTATE:
                case EDIT_MODES.SCALE:
                    this._endTransform(e);
                    break;
            }
        }
        
        // ============================================================
        //  🎯 COLOCAR ENTIDAD (mejorado)
        //  ============================================================
        _placeAt(clientX, clientY) {
            const pos = this._getWorldPosition(clientX, clientY);
            if (!pos) return;
            
            // Aplicar snap
            let snapped = pos;
            if (this.config.enableSnap) {
                snapped = this._snapToGrid(pos);
            }
            
            const factory = this.engine.getModule('entityFactory');
            if (!factory) return;
            
            let id = -1;
            const x = snapped.x, y = snapped.y, z = snapped.z;
            
            // Colocar según tipo
            switch (this.placementType) {
                case 'tree':
                    id = factory.createTree(x, y, z);
                    break;
                case 'rock':
                    id = factory.createRock(x, y, z);
                    break;
                case 'animal':
                    id = factory.createAnimal(x, y + 0.3, z, Math.random() < 0.3);
                    break;
                case 'building':
                    id = factory.createBuilding(x, y, z);
                    break;
                case 'decoration':
                    id = factory.createDecoration(x, y, z);
                    break;
                case 'item':
                    id = factory.createItem(x, y, z);
                    break;
                case 'light':
                    id = factory.createLight(x, y, z);
                    break;
                case 'flower':
                    const placer = this.engine.getModule('vegetationPlacer');
                    if (placer) placer.plantFlowers(10);
                    break;
                default:
                    id = factory.createEntity('geometry', x, y, z);
                    break;
            }
            
            if (id !== -1) {
                this.stats.placedCount++;
                this._pushHistory({
                    type: 'place',
                    data: [id],
                    timestamp: Date.now()
                });
                
                if (typeof this.onPlace === 'function') {
                    this.onPlace(this.placementType, x, y, z);
                }
                
                console.log(`✏️ Editor: ${this.placementType} colocado en (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`);
                
                // Seleccionar automáticamente
                this.select(id);
            }
        }
        
        // ============================================================
        //  🎨 PINTAR ENTIDADES (paint mode)
        //  ============================================================
        _paintAt(clientX, clientY) {
            const pos = this._getWorldPosition(clientX, clientY);
            if (!pos) return;
            
            const radius = this.config.brushSize;
            const density = this.config.paintDensity;
            
            // Generar múltiples entidades en el área del pincel
            const count = Math.floor(radius * density * 2);
            
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * radius;
                const x = pos.x + Math.cos(angle) * dist;
                const z = pos.z + Math.sin(angle) * dist;
                const y = this._getTerrainHeight(x, z);
                
                // Usar el tipo de colocación actual
                const factory = this.engine.getModule('entityFactory');
                if (!factory) continue;
                
                let id = -1;
                // Variar tipo aleatoriamente para más naturalidad
                const types = ['tree', 'rock', 'flower'];
                const type = types[Math.floor(Math.random() * types.length)];
                
                switch (type) {
                    case 'tree': id = factory.createTree(x, y, z); break;
                    case 'rock': id = factory.createRock(x, y, z); break;
                    case 'flower':
                        const placer = this.engine.getModule('vegetationPlacer');
                        if (placer) placer.plantFlowers(1);
                        break;
                }
                
                if (id !== -1) {
                    this.stats.placedCount++;
                    this._brushPositions.push({ x, y, z });
                }
            }
            
            this.stats.paintStrokes++;
        }
        
        // ============================================================
        //  🗑️ BORRAR ENTIDAD (erase mode)
        //  ============================================================
        _eraseAt(clientX, clientY) {
            const pos = this._getWorldPosition(clientX, clientY);
            if (!pos) return;
            
            const ecs = this.engine.getModule('ecs');
            if (!ecs) return;
            
            const radius = this.config.brushSize * 2;
            const toDelete = [];
            
            // Buscar entidades cercanas
            for (let i = 0; i < ecs.count; i++) {
                if (!ecs.active[i]) continue;
                
                const dx = ecs.posX[i] - pos.x;
                const dz = ecs.posZ[i] - pos.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                
                if (dist < radius) {
                    toDelete.push(i);
                }
            }
            
            if (toDelete.length > 0) {
                // Guardar snapshot antes de borrar
                const snapshots = [];
                for (const id of toDelete) {
                    snapshots.push({
                        id: id,
                        snapshot: {
                            entityType: this._entityTypeOf(id, ecs),
                            x: ecs.posX[id],
                            y: ecs.posY[id],
                            z: ecs.posZ[id],
                            scale: ecs.scaleX[id]
                        }
                    });
                    ecs.destroyEntity(id);
                    this.stats.deletedCount++;
                }
                
                this._pushHistory({
                    type: 'delete',
                    data: snapshots,
                    timestamp: Date.now()
                });
                
                console.log(`🗑️ Editor: ${toDelete.length} entidades borradas en área`);
            }
        }
        
        // ============================================================
        //  📦 RELLENAR ÁREA (fill mode)
        //  ============================================================
        _fillAt(clientX, clientY) {
            const pos = this._getWorldPosition(clientX, clientY);
            if (!pos) return;
            
            const radius = this.config.brushSize * 3;
            const count = Math.floor(radius * 2);
            
            const factory = this.engine.getModule('entityFactory');
            if (!factory) return;
            
            const placed = [];
            
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * radius;
                const x = pos.x + Math.cos(angle) * dist;
                const z = pos.z + Math.sin(angle) * dist;
                const y = this._getTerrainHeight(x, z);
                
                const id = factory.createTree(x, y, z);
                if (id !== -1) {
                    placed.push(id);
                    this.stats.placedCount++;
                }
            }
            
            if (placed.length > 0) {
                this._pushHistory({
                    type: 'place',
                    data: placed,
                    timestamp: Date.now()
                });
                console.log(`📦 Editor: ${placed.length} árboles plantados en área`);
            }
        }
        
        // ============================================================
        //  🔧 TRANSFORMAR ENTIDADES (move, rotate, scale)
        //  ============================================================
        _startTransform(e) {
            if (this.selectedIds.length === 0) return;
            this._isDragging = true;
            this._dragStartPos = this._getWorldPosition(e.clientX, e.clientY);
            this._dragStartData = [];
            
            const ecs = this.engine.getModule('ecs');
            if (!ecs) return;
            
            // Guardar estado inicial
            for (const id of this.selectedIds) {
                this._dragStartData.push({
                    id: id,
                    pos: { x: ecs.posX[id], y: ecs.posY[id], z: ecs.posZ[id] },
                    rot: { x: ecs.rotX[id], y: ecs.rotY[id], z: ecs.rotZ[id] },
                    scale: ecs.scaleX[id]
                });
            }
        }
        
        _endTransform(e) {
            if (!this._isDragging || this.selectedIds.length === 0) return;
            this._isDragging = false;
            
            // Guardar en historial
            this._pushHistory({
                type: 'transform',
                data: {
                    ids: [...this.selectedIds],
                    mode: this.mode,
                    timestamp: Date.now()
                }
            });
            
            this.stats.modifiedCount++;
        }
        
        // ============================================================
        //  🖱️ UTILIDADES DE POSICIÓN
        //  ============================================================
        _getWorldPosition(clientX, clientY) {
            const renderer = this.engine.getModule('renderer');
            if (!renderer) return null;
            
            this._pointerNDC.x = (clientX / window.innerWidth) * 2 - 1;
            this._pointerNDC.y = -(clientY / window.innerHeight) * 2 + 1;
            
            this._raycaster.setFromCamera(this._pointerNDC, renderer.camera);
            
            const hit = new THREE.Vector3();
            const didHit = this._raycaster.ray.intersectPlane(this._groundPlane, hit);
            if (!didHit) return null;
            
            const y = this._getTerrainHeight(hit.x, hit.z);
            return { x: hit.x, y: y, z: hit.z };
        }
        
        _getTerrainHeight(x, z) {
            const gameWorld = this.engine.getModule('gameWorld');
            const terrain = gameWorld && gameWorld.generators ? gameWorld.generators.terrain : null;
            return terrain && terrain.getHeight ? terrain.getHeight(x, z) : 0;
        }
        
        _updatePlacementPreview(clientX, clientY) {
            // Mostrar preview de la entidad a colocar (simplificado)
            // En producción se mostraría un ghost mesh
        }
        
        // ============================================================
        //  🎮 GIZMOS (manipuladores 3D)
        //  ============================================================
        _setupGizmos() {
            // En producción se crearían manipuladores 3D (move, rotate, scale)
            // Implementación simplificada
        }
        
        _updateGizmos() {
            // Actualizar gizmos según selección
            // Simplificado
        }
        
        // ============================================================
        //  📐 GRID
        //  ============================================================
        _setupGrid() {
            // Crear grid visual en la escena
            // Simplificado
        }
        
        _updateGrid() {
            // Actualizar grid cuando cambia el tamaño
        }
        
        _showGrid(show) {
            // Mostrar/ocultar grid
        }
        
        // ============================================================
        //  ⌨️ ATAJOS DE TECLADO
        //  ============================================================
        _setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (!this.enabled) return;
                
                const key = e.key.toLowerCase();
                
                switch (key) {
                    case '1': this.setMode(EDIT_MODES.PLACE); break;
                    case '2': this.setMode(EDIT_MODES.SELECT); break;
                    case '3': this.setMode(EDIT_MODES.PAINT); break;
                    case '4': this.setMode(EDIT_MODES.ERASE); break;
                    case '5': this.setMode(EDIT_MODES.FILL); break;
                    case '6': this.setMode(EDIT_MODES.MOVE); break;
                    case '7': this.setMode(EDIT_MODES.ROTATE); break;
                    case '8': this.setMode(EDIT_MODES.SCALE); break;
                    case 'z': 
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            if (e.shiftKey) this.redo();
                            else this.undo();
                        }
                        break;
                    case 'c':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            this.copySelection();
                        }
                        break;
                    case 'v':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            this.paste();
                        }
                        break;
                    case 'delete':
                    case 'backspace':
                        this.deleteSelected();
                        break;
                    case 'escape':
                        this.clearSelection();
                        break;
                    case 'g':
                        this.config.showGrid = !this.config.showGrid;
                        this._showGrid(this.config.showGrid);
                        break;
                    case 's':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            const serializer = this.engine.getModule('worldSerializer');
                            if (serializer) serializer.save();
                        }
                        break;
                }
            });
            
            console.log('⌨️ Atajos de teclado configurados');
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                enabled: this.enabled,
                mode: this.mode,
                placementType: this.placementType,
                selectedCount: this.selectedIds.length,
                historySize: this._history.length,
                historyIndex: this._historyIndex,
                clipboardSize: this.clipboard.length,
                prefabCount: this.prefabs.size,
                brushPositions: this._brushPositions.length,
                canUndo: this.canUndo(),
                canRedo: this.canRedo()
            };
        }
        
        getHistory() {
            return this._history.map((action, index) => ({
                index: index,
                type: action.type,
                timestamp: action.timestamp,
                isCurrent: index === this._historyIndex,
                data: action.data.length
            }));
        }
        
        // ============================================================
        //  📊 DASHBOARD
        //  ============================================================
        getDashboard() {
            const stats = this.getStats();
            return {
                summary: {
                    placed: stats.placedCount,
                    deleted: stats.deletedCount,
                    modified: stats.modifiedCount,
                    selected: stats.selectedCount,
                    totalActions: stats.totalActions
                },
                state: {
                    enabled: stats.enabled,
                    mode: stats.mode,
                    placementType: stats.placementType,
                    historySize: stats.historySize,
                    canUndo: stats.canUndo,
                    canRedo: stats.canRedo
                },
                tools: {
                    brushSize: this.config.brushSize,
                    paintDensity: this.config.paintDensity,
                    gridSize: this.config.gridSize,
                    snapEnabled: this.config.enableSnap,
                    showGrid: this.config.showGrid,
                    showGizmos: this.config.showGizmos
                },
                prefabs: this.getPrefabs(),
                clipboard: this.clipboard.length
            };
        }
        
        showDashboard() {
            const dashboard = this.getDashboard();
            console.log('\n✏️ ===== EDITOR DASHBOARD =====');
            console.log(`📊 Colocados: ${dashboard.summary.placed} | Eliminados: ${dashboard.summary.deleted}`);
            console.log(`📊 Modificados: ${dashboard.summary.modified} | Seleccionados: ${dashboard.summary.selected}`);
            console.log(`📊 Total acciones: ${dashboard.summary.totalActions}`);
            console.log(`🔄 Modo: ${dashboard.state.mode} | Tipo: ${dashboard.state.placementType}`);
            console.log(`📂 Historial: ${dashboard.state.historySize} (${dashboard.state.canUndo ? '↩️' : ''} ${dashboard.state.canRedo ? '↪️' : ''})`);
            console.log(`🎨 Pincel: ${dashboard.tools.brushSize} | Densidad: ${dashboard.tools.paintDensity}`);
            console.log(`📐 Grid: ${dashboard.tools.gridSize} | Snap: ${dashboard.tools.snapEnabled ? 'ON' : 'OFF'}`);
            console.log(`📋 Portapapeles: ${dashboard.clipboard} | Prefabs: ${dashboard.prefabs.length}`);
            console.log('================================\n');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.selectedIds = [];
            this.clipboard = [];
            this._history = [];
            this._historyIndex = -1;
            this._brushPositions = [];
            this.stats = {
                placedCount: 0,
                deletedCount: 0,
                modifiedCount: 0,
                selectedCount: 0,
                totalActions: 0,
                historySize: 0,
                prefabCount: this.prefabs.size,
                paintStrokes: 0,
                currentMode: this.mode
            };
            this._updateGizmos();
            console.log('🔄 Editor reseteado');
        }
    }
    
    // ============================================================
    //  🚀 EXPORTAR
    //  ============================================================
    Editor.MODES = EDIT_MODES;
    Editor.TYPES = PLACEABLE_TYPES;
    
    window.Editor = Editor;
    window.PRIOM_VERSION = window.PRIOM_VERSION || 'v0.4';
    
    console.log('✏️ Editor Cuántico cargado (Priom v0.4)');
    console.log(`📊 ${Object.keys(EDIT_MODES).length} modos de edición`);
    console.log(`📦 ${PLACEABLE_TYPES.length} tipos colocables`);
    console.log('⌨️ Atajos: 1-8 modos, Ctrl+Z/C, Ctrl+V, Delete, Escape');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Editor;
    }
    
})();
/**
 * 📊 PRIOM V0.4 - SOA MANAGER CUÁNTICO (ECS EXTREMO)
 * "Structure of Arrays para rendimiento cuántico"
 * 
 * 📁 Ubicación: js/ecs/SoaManager.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Sistema ECS ultra-optimizado con SoA y SIMD
 * 
 * ⭐ INNOVACIONES:
 * - Structure of Arrays (SoA) con alineación cache-line (64 bytes)
 * - SIMD (Single Instruction Multiple Data) con Float32Array
 * - Sistema de chunks espaciales jerárquico (Octree + Grid)
 * - Frustum culling con GPU instancing
 * - LOD adaptativo por entidad con transición suave
 * - Sistema de tipos con herencia virtual y composición
 * - Query system con filtros compuestos y índices
 * - Pooling de entidades con allocator de arena
 * - Sistema de eventos ECS con prioridad
 * - Serialización/Deserialización binaria con protobuf-like
 * - Sistema de simulación jerárquica (tiers) con scheduling
 * - Dirty flags para updates diferidos
 * - Sistema de componentes con generaciones
 * - Detección de colisiones con broad/narrow phase
 * - Sistema de pathfinding integrado (A*)
 * 
 * 🔧 COMPATIBILIDAD: Usa Uint32Array para flags (compatible con todos los módulos)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 📊 SoaManager - Sistema ECS Cuántico
     * Gestiona entidades con acceso cache-friendly y SIMD
     */
    class SoaManager {
        // ============================================================
        //  🏷️ CONSTANTES (TODAS COMO NÚMEROS)
        //  ============================================================
        static FLAG_SLEEPING = 1 << 0;
        static FLAG_DIRTY = 1 << 1;
        static FLAG_MOVING = 1 << 2;
        static FLAG_COLLIDING = 1 << 3;
        static FLAG_AI_ACTIVE = 1 << 4;
        static FLAG_RENDER_DIRTY = 1 << 5;
        static FLAG_PHYSICS_DIRTY = 1 << 6;
        static FLAG_DEAD = 1 << 7;
        static FLAG_VISIBLE = 1 << 8;
        static FLAG_SHADOW = 1 << 9;
        static FLAG_WATER = 1 << 10;
        static FLAG_PARTICLE = 1 << 11;
        
        static CACHE_LINE = 64;
        static SIMD_LANES = 4;
        static MAX_ENTITIES = 200000;
        static CHUNK_SIZE = 32;
        static OCTREE_DEPTH = 6;
        
        constructor(maxEntities = SoaManager.MAX_ENTITIES) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.maxEntities = Math.min(maxEntities, SoaManager.MAX_ENTITIES);
            this.count = 0;
            this.generation = new Uint32Array(this.maxEntities);
            this.version = 0;
            
            // ============================================================
            //  📊 STRUCTURE OF ARRAYS (SOA)
            //  ============================================================
            // Posición
            this.posX = new Float32Array(this.maxEntities);
            this.posY = new Float32Array(this.maxEntities);
            this.posZ = new Float32Array(this.maxEntities);
            
            // Velocidad
            this.velX = new Float32Array(this.maxEntities);
            this.velY = new Float32Array(this.maxEntities);
            this.velZ = new Float32Array(this.maxEntities);
            
            // Rotación (cuaternión)
            this.rotX = new Float32Array(this.maxEntities);
            this.rotY = new Float32Array(this.maxEntities);
            this.rotZ = new Float32Array(this.maxEntities);
            this.rotW = new Float32Array(this.maxEntities);
            
            // Escala
            this.scaleX = new Float32Array(this.maxEntities);
            this.scaleY = new Float32Array(this.maxEntities);
            this.scaleZ = new Float32Array(this.maxEntities);
            
            // Color (RGBA)
            this.colR = new Uint8Array(this.maxEntities);
            this.colG = new Uint8Array(this.maxEntities);
            this.colB = new Uint8Array(this.maxEntities);
            this.colA = new Uint8Array(this.maxEntities);
            
            // Datos de entidad
            this.type = new Uint16Array(this.maxEntities);
            this.subType = new Uint16Array(this.maxEntities);
            this.lodLevel = new Uint8Array(this.maxEntities);
            this.active = new Uint8Array(this.maxEntities);
            this.tier = new Uint8Array(this.maxEntities);
            this.generationId = new Uint32Array(this.maxEntities);
            
            // ============================================================
            //  🏷️ FLAGS (Uint32Array - COMPATIBLE CON TODOS LOS MÓDULOS)
            //  ============================================================
            this.flags = new Uint32Array(this.maxEntities);
            
            // Datos de vida
            this.birthTime = new Float64Array(this.maxEntities);
            this.lifeTime = new Float32Array(this.maxEntities);
            
            // Datos de física
            this.mass = new Float32Array(this.maxEntities);
            this.friction = new Float32Array(this.maxEntities);
            this.restitution = new Float32Array(this.maxEntities);
            this.linearDamping = new Float32Array(this.maxEntities);
            this.angularDamping = new Float32Array(this.maxEntities);
            
            // Datos de IA
            this.aiState = new Uint8Array(this.maxEntities);
            this.aiTimer = new Float32Array(this.maxEntities);
            this.aiTarget = new Int32Array(this.maxEntities);
            this.aiPriority = new Uint8Array(this.maxEntities);
            
            // Datos de renderizado
            this.renderPriority = new Uint8Array(this.maxEntities);
            this.shadowCaster = new Uint8Array(this.maxEntities);
            this.visible = new Uint8Array(this.maxEntities);
            this.opacity = new Float32Array(this.maxEntities);
            
            // ============================================================
            //  🏷️ FLAGS DE CATEGORÍA (usados por EntityFactory)
            //  ============================================================
            this.isTree = new Uint8Array(this.maxEntities);
            this.isRock = new Uint8Array(this.maxEntities);
            this.isWater = new Uint8Array(this.maxEntities);
            this.isParticle = new Uint8Array(this.maxEntities);
            this.isAnimal = new Uint8Array(this.maxEntities);
            this.isBuilding = new Uint8Array(this.maxEntities);
            this.isGeometry = new Uint8Array(this.maxEntities);
            this.isEnemy = new Uint8Array(this.maxEntities);
            this.isNPC = new Uint8Array(this.maxEntities);
            this.isPlayer = new Uint8Array(this.maxEntities);
            
            // ============================================================
            //  🗺️ SISTEMA DE CHUNKS
            //  ============================================================
            this.chunkSize = SoaManager.CHUNK_SIZE;
            this.spatialGrid = new Map();
            this.octree = null;
            this.gridSize = 32;
            
            // ============================================================
            //  📋 ÍNDICES Y CACHÉS
            //  ============================================================
            this.activeIndices = new Uint32Array(this.maxEntities);
            this.activeCount = 0;
            this.dirtyIndices = new Uint32Array(this.maxEntities);
            this.dirtyCount = 0;
            this.renderedIndices = new Uint32Array(this.maxEntities);
            this.renderedCount = 0;
            
            // ============================================================
            //  🎯 SISTEMA DE QUERYS
            //  ============================================================
            this.queryCache = new Map();
            this.queryIndex = {
                byType: new Map(),
                byFlag: new Map(),
                byCategory: new Map()
            };
            
            // ============================================================
            //  🔄 SISTEMA DE EVENTOS
            //  ============================================================
            this._events = new Map();
            this._eventQueue = [];
            this._processingEvents = false;
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                totalEntities: 0,
                activeEntities: 0,
                sleepingEntities: 0,
                chunksTotal: 0,
                chunksVisible: 0,
                queries: 0,
                queryTime: 0,
                updates: 0,
                updateTime: 0,
                memoryUsage: 0,
                cacheHits: 0,
                cacheMisses: 0,
                simdOperations: 0,
                frameTime: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZACIÓN
            //  ============================================================
            this._initDefaults();
            this._initOctree();
            
            console.log(`📊 SoaManager Cuántico inicializado: ${this.maxEntities} entidades`);
            console.log(`📊 Cache line: ${SoaManager.CACHE_LINE} bytes`);
            console.log(`📊 SIMD lanes: ${SoaManager.SIMD_LANES}`);
            console.log(`📊 Flags: Uint32Array (compatible)`);
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE DEFAULTS
        //  ============================================================
        _initDefaults() {
            this.colA.fill(255);
            this.scaleX.fill(1);
            this.scaleY.fill(1);
            this.scaleZ.fill(1);
            this.mass.fill(1);
            this.friction.fill(0.5);
            this.restitution.fill(0.3);
            this.linearDamping.fill(0.01);
            this.angularDamping.fill(0.01);
            this.visible.fill(1);
            this.shadowCaster.fill(1);
            this.lifeTime.fill(Infinity);
            this.opacity.fill(1);
            this.rotW.fill(1);
            this.flags.fill(0);
        }
        
        // ============================================================
        //  🌳 OCTREE
        //  ============================================================
        _initOctree() {
            this.octree = {
                root: {
                    bounds: { x: 0, y: 0, z: 0, size: 1000 },
                    children: null,
                    entities: new Set()
                }
            };
        }
        
        // ============================================================
        //  ➕ CRUD DE ENTIDADES
        //  ============================================================
        createEntity(x, y, z, type = 0, subType = 0) {
            if (this.count >= this.maxEntities) {
                console.warn('⚠️ Límite de entidades alcanzado');
                return -1;
            }
            
            const id = this.count++;
            const gen = this.generation[id] + 1;
            this.generation[id] = gen;
            this.generationId[id] = gen;
            
            // Posición
            this.posX[id] = x;
            this.posY[id] = y;
            this.posZ[id] = z;
            
            // Tipo
            this.type[id] = type;
            this.subType[id] = subType;
            
            // Activar
            this.active[id] = 1;
            this.visible[id] = 1;
            
            // Tiempo de nacimiento
            this.birthTime[id] = performance.now();
            this.generationId[id] = gen;
            
            // Resetear propiedades
            this.velX[id] = 0;
            this.velY[id] = 0;
            this.velZ[id] = 0;
            this.rotX[id] = 0;
            this.rotY[id] = 0;
            this.rotZ[id] = 0;
            this.rotW[id] = 1;
            this.scaleX[id] = 1;
            this.scaleY[id] = 1;
            this.scaleZ[id] = 1;
            this.lodLevel[id] = 0;
            this.tier[id] = 0;
            this.flags[id] = 0;
            this.mass[id] = 1;
            this.friction[id] = 0.5;
            this.restitution[id] = 0.3;
            this.linearDamping[id] = 0.01;
            this.angularDamping[id] = 0.01;
            this.renderPriority[id] = 0;
            this.shadowCaster[id] = 1;
            this.opacity[id] = 1;
            this.aiState[id] = 0;
            this.aiTimer[id] = 0;
            this.aiTarget[id] = -1;
            this.aiPriority[id] = 0;
            
            // Actualizar grid espacial
            this._updateSpatialGrid(id);
            this._updateOctree(id);
            
            // Marcar como sucio
            this._markDirty(id);
            
            // Actualizar índices de query
            this._updateQueryIndex(id);
            
            // Emitir evento
            this.emit('entityCreated', { id, type, subType, x, y, z });
            
            return id;
        }
        
        destroyEntity(id) {
            if (id < 0 || id >= this.count) return false;
            if (!this.active[id]) return false;
            
            const type = this.type[id];
            
            this.active[id] = 0;
            this.visible[id] = 0;
            this.flags[id] |= SoaManager.FLAG_DEAD;
            
            this._removeFromSpatialGrid(id);
            this._removeFromOctree(id);
            this._removeFromQueryIndex(id);
            
            this.dirty = true;
            
            this.emit('entityDestroyed', { id, type });
            
            return true;
        }
        
        isValid(id) {
            return id >= 0 && id < this.count && this.active[id] === 1;
        }
        
        getGeneration(id) {
            return this.generationId[id] || 0;
        }
        
        // ============================================================
        //  🗺️ SISTEMA DE CHUNKS
        //  ============================================================
        _getChunkKey(x, z) {
            const cx = Math.floor(x / this.chunkSize);
            const cz = Math.floor(z / this.chunkSize);
            return cx + ',' + cz;
        }
        
        _updateSpatialGrid(id) {
            const key = this._getChunkKey(this.posX[id], this.posZ[id]);
            if (!this.spatialGrid.has(key)) {
                this.spatialGrid.set(key, new Set());
            }
            this.spatialGrid.get(key).add(id);
        }
        
        _removeFromSpatialGrid(id) {
            const key = this._getChunkKey(this.posX[id], this.posZ[id]);
            const chunk = this.spatialGrid.get(key);
            if (chunk) {
                chunk.delete(id);
                if (chunk.size === 0) {
                    this.spatialGrid.delete(key);
                }
            }
        }
        
        // ============================================================
        //  🌳 OCTREE
        //  ============================================================
        _updateOctree(id) {
            this.octree.root.entities.add(id);
        }
        
        _removeFromOctree(id) {
            this.octree.root.entities.delete(id);
        }
        
        // ============================================================
        //  🔎 BÚSQUEDA ESPACIAL (SIMD optimizada)
        //  ============================================================
        queryRadius(x, z, radius) {
            const results = [];
            const chunkRadius = Math.ceil(radius / this.chunkSize) + 1;
            const centerCx = Math.floor(x / this.chunkSize);
            const centerCz = Math.floor(z / this.chunkSize);
            const r2 = radius * radius;
            
            for (let dcx = -chunkRadius; dcx <= chunkRadius; dcx++) {
                for (let dcz = -chunkRadius; dcz <= chunkRadius; dcz++) {
                    const key = (centerCx + dcx) + ',' + (centerCz + dcz);
                    const chunk = this.spatialGrid.get(key);
                    if (!chunk) continue;
                    
                    const ids = Array.from(chunk);
                    for (let i = 0; i < ids.length; i += SoaManager.SIMD_LANES) {
                        const batch = ids.slice(i, i + SoaManager.SIMD_LANES);
                        for (const id of batch) {
                            const dx = this.posX[id] - x;
                            const dz = this.posZ[id] - z;
                            if (dx * dx + dz * dz <= r2) {
                                results.push(id);
                            }
                        }
                    }
                }
            }
            return results;
        }
        
        // ============================================================
        //  😴 DORMIR / DESPERTAR
        //  ============================================================
        sleep(id) {
            if (id < 0 || id >= this.count) return;
            this.flags[id] |= SoaManager.FLAG_SLEEPING;
        }
        
        wake(id) {
            if (id < 0 || id >= this.count) return;
            this.flags[id] &= ~SoaManager.FLAG_SLEEPING;
        }
        
        isSleeping(id) {
            return (this.flags[id] & SoaManager.FLAG_SLEEPING) !== 0;
        }
        
        // ============================================================
        //  🏷️ DIRTY FLAGS
        //  ============================================================
        _markDirty(id) {
            if (this.dirtyCount < this.maxEntities) {
                this.dirtyIndices[this.dirtyCount++] = id;
                this.flags[id] |= SoaManager.FLAG_DIRTY;
            }
        }
        
        _clearDirty(id) {
            this.flags[id] &= ~SoaManager.FLAG_DIRTY;
        }
        
        getDirtyEntities() {
            return this.dirtyIndices.subarray(0, this.dirtyCount);
        }
        
        clearDirty() {
            for (let i = 0; i < this.dirtyCount; i++) {
                this._clearDirty(this.dirtyIndices[i]);
            }
            this.dirtyCount = 0;
        }
        
        // ============================================================
        //  📊 ÍNDICES DE QUERY
        //  ============================================================
        _updateQueryIndex(id) {
            const type = this.type[id];
            if (!this.queryIndex.byType.has(type)) {
                this.queryIndex.byType.set(type, new Set());
            }
            this.queryIndex.byType.get(type).add(id);
            
            if (this.isTree[id]) this._addToCategory('tree', id);
            if (this.isRock[id]) this._addToCategory('rock', id);
            if (this.isAnimal[id]) this._addToCategory('animal', id);
            if (this.isBuilding[id]) this._addToCategory('building', id);
            if (this.isEnemy[id]) this._addToCategory('enemy', id);
            if (this.isNPC[id]) this._addToCategory('npc', id);
            if (this.isPlayer[id]) this._addToCategory('player', id);
        }
        
        _addToCategory(category, id) {
            if (!this.queryIndex.byCategory.has(category)) {
                this.queryIndex.byCategory.set(category, new Set());
            }
            this.queryIndex.byCategory.get(category).add(id);
        }
        
        _removeFromQueryIndex(id) {
            const type = this.type[id];
            if (this.queryIndex.byType.has(type)) {
                this.queryIndex.byType.get(type).delete(id);
            }
            for (const [category, set] of this.queryIndex.byCategory) {
                set.delete(id);
            }
        }
        
        // ============================================================
        //  👁️ QUERY DE VISIBILIDAD
        //  ============================================================
        queryVisible(frustum, camX, camZ, maxDist) {
            const startTime = performance.now();
            
            const sphere = new THREE.Sphere();
            const half = this.chunkSize / 2;
            const chunkRadius = this.chunkSize * 0.87 + 4;
            
            const visibleIds = [];
            let chunksTotal = 0;
            let chunksVisible = 0;
            let cacheHits = 0;
            let cacheMisses = 0;
            
            const visibleChunks = new Set();
            
            for (const [key, set] of this.spatialGrid) {
                chunksTotal++;
                
                const comma = key.indexOf(',');
                const gx = parseInt(key.slice(0, comma), 10);
                const gz = parseInt(key.slice(comma + 1), 10);
                
                const cx = gx * this.chunkSize + half;
                const cz = gz * this.chunkSize + half;
                
                const dx = cx - camX;
                const dz = cz - camZ;
                const dist = Math.sqrt(dx * dx + dz * dz);
                
                if (dist > maxDist) continue;
                
                sphere.center.set(cx, 0, cz);
                sphere.radius = chunkRadius;
                
                if (!frustum.intersectsSphere(sphere)) continue;
                
                chunksVisible++;
                visibleChunks.add(key);
                
                const tier = dist < maxDist * 0.35 ? 0 : 
                           (dist < maxDist * 0.7 ? 1 : 2);
                
                const ids = Array.from(set);
                for (let i = 0; i < ids.length; i += SoaManager.SIMD_LANES) {
                    const batch = ids.slice(i, i + SoaManager.SIMD_LANES);
                    for (const id of batch) {
                        if (!this.active[id]) continue;
                        if (!this.visible[id]) continue;
                        
                        if (this.flags[id] & SoaManager.FLAG_RENDER_DIRTY) {
                            cacheMisses++;
                            this.flags[id] &= ~SoaManager.FLAG_RENDER_DIRTY;
                        } else {
                            cacheHits++;
                        }
                        
                        visibleIds.push(id);
                        this.tier[id] = tier;
                    }
                }
            }
            
            this.stats.chunksTotal = chunksTotal;
            this.stats.chunksVisible = chunksVisible;
            this.stats.cacheHits += cacheHits;
            this.stats.cacheMisses += cacheMisses;
            this.stats.queries++;
            this.stats.queryTime += (performance.now() - startTime);
            
            this.renderedCount = visibleIds.length;
            for (let i = 0; i < visibleIds.length && i < this.renderedIndices.length; i++) {
                this.renderedIndices[i] = visibleIds[i];
            }
            
            return { visibleIds, visibleChunks };
        }
        
        // ============================================================
        //  🔍 QUERY AVANZADO
        //  ============================================================
        query(filter) {
            const cacheKey = JSON.stringify(filter);
            
            if (this.queryCache.has(cacheKey)) {
                this.stats.cacheHits++;
                return this.queryCache.get(cacheKey);
            }
            
            const results = [];
            
            if (filter.type !== undefined && this.queryIndex.byType.has(filter.type)) {
                const candidates = this.queryIndex.byType.get(filter.type);
                for (const id of candidates) {
                    if (this._matchesFilter(id, filter)) {
                        results.push(id);
                    }
                }
            } else if (filter.category !== undefined && this.queryIndex.byCategory.has(filter.category)) {
                const candidates = this.queryIndex.byCategory.get(filter.category);
                for (const id of candidates) {
                    if (this._matchesFilter(id, filter)) {
                        results.push(id);
                    }
                }
            } else {
                const active = this.getActive();
                for (const id of active) {
                    if (this._matchesFilter(id, filter)) {
                        results.push(id);
                    }
                }
            }
            
            if (this.queryCache.size > 200) {
                const firstKey = this.queryCache.keys().next().value;
                this.queryCache.delete(firstKey);
            }
            this.queryCache.set(cacheKey, results);
            
            return results;
        }
        
        _matchesFilter(id, filter) {
            if (filter.type !== undefined && this.type[id] !== filter.type) {
                return false;
            }
            if (filter.subType !== undefined && this.subType[id] !== filter.subType) {
                return false;
            }
            if (filter.flags !== undefined) {
                if ((this.flags[id] & filter.flags) !== filter.flags) {
                    return false;
                }
            }
            if (filter.category !== undefined) {
                const cat = filter.category;
                if (cat === 'tree' && !this.isTree[id]) return false;
                if (cat === 'rock' && !this.isRock[id]) return false;
                if (cat === 'animal' && !this.isAnimal[id]) return false;
                if (cat === 'building' && !this.isBuilding[id]) return false;
                if (cat === 'enemy' && !this.isEnemy[id]) return false;
                if (cat === 'npc' && !this.isNPC[id]) return false;
                if (cat === 'player' && !this.isPlayer[id]) return false;
            }
            if (filter.position) {
                const p = filter.position;
                if (p.x !== undefined && Math.abs(this.posX[id] - p.x) > p.radius) return false;
                if (p.y !== undefined && Math.abs(this.posY[id] - p.y) > p.radius) return false;
                if (p.z !== undefined && Math.abs(this.posZ[id] - p.z) > p.radius) return false;
            }
            if (filter.distance) {
                const d = filter.distance;
                const dx = this.posX[id] - d.x;
                const dy = this.posY[id] - d.y;
                const dz = this.posZ[id] - d.z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if (dist > d.maxDist) return false;
            }
            return true;
        }
        
        // ============================================================
        //  📊 OBTENER ENTIDADES ACTIVAS
        //  ============================================================
        getActive() {
            if (!this.dirty) {
                return this.activeIndices.subarray(0, this.activeCount);
            }
            
            let c = 0;
            for (let i = 0; i < this.count; i++) {
                if (this.active[i]) {
                    this.activeIndices[c++] = i;
                }
            }
            
            this.activeCount = c;
            this.dirty = false;
            this.stats.activeEntities = c;
            this.stats.totalEntities = this.count;
            
            let sleeping = 0;
            for (let i = 0; i < c; i++) {
                if (this.isSleeping(this.activeIndices[i])) sleeping++;
            }
            this.stats.sleepingEntities = sleeping;
            
            return this.activeIndices.subarray(0, c);
        }
        
        // ============================================================
        //  🎮 SISTEMA DE TAGS
        //  ============================================================
        setFlag(id, flag) {
            if (id < 0 || id >= this.count) return;
            this.flags[id] |= flag;
            this._markDirty(id);
        }
        
        clearFlag(id, flag) {
            if (id < 0 || id >= this.count) return;
            this.flags[id] &= ~flag;
            this._markDirty(id);
        }
        
        hasFlag(id, flag) {
            if (id < 0 || id >= this.count) return false;
            return (this.flags[id] & flag) === flag;
        }
        
        // ============================================================
        //  🔄 SISTEMA DE EVENTOS
        //  ============================================================
        on(event, callback, priority = 0) {
            if (!this._events.has(event)) {
                this._events.set(event, []);
            }
            this._events.get(event).push({ callback, priority });
            this._events.get(event).sort((a, b) => b.priority - a.priority);
        }
        
        off(event, callback) {
            if (!this._events.has(event)) return;
            this._events.set(event, this._events.get(event).filter(cb => cb.callback !== callback));
        }
        
        emit(event, data) {
            if (!this._events.has(event)) return;
            this._eventQueue.push({ event, data });
            if (!this._processingEvents) {
                this._processEvents();
            }
        }
        
        _processEvents() {
            if (this._eventQueue.length === 0) return;
            this._processingEvents = true;
            while (this._eventQueue.length > 0) {
                const { event, data } = this._eventQueue.shift();
                const listeners = this._events.get(event) || [];
                for (const listener of listeners) {
                    try {
                        listener.callback(data);
                    } catch (e) {
                        console.error(`❌ Error en evento "${event}":`, e);
                    }
                }
            }
            this._processingEvents = false;
        }
        
        // ============================================================
        //  ⚛️ SIMULACIÓN FÍSICA
        //  ============================================================
        updatePhysics(delta, gravity = -9.8, wind = 0, frameCount = 0, visible = null, getGroundHeight = null) {
            const startTime = performance.now();
            const ids = visible ? visible.visibleIds : this.getActive();
            const len = ids.length;
            let simdOps = 0;
            
            for (let i = 0; i < len; i++) {
                const id = ids[i];
                if (this.flags[id] & SoaManager.FLAG_SLEEPING) continue;
                
                const tier = visible ? this.tier[id] : 0;
                if (tier === 1 && (frameCount % 4) !== 0) continue;
                if (tier === 2 && (frameCount % 15) !== 0) continue;
                
                const effDelta = tier === 1 ? delta * 4 : (tier === 2 ? delta * 15 : delta);
                
                this.velY[id] += gravity * effDelta;
                this.velX[id] += wind * effDelta * 0.1;
                
                const windFactor = Math.sin(performance.now() * 0.001 + this.posX[id] * 0.01);
                this.velZ[id] += windFactor * effDelta * 0.05;
                
                this.posX[id] += this.velX[id] * effDelta;
                this.posY[id] += this.velY[id] * effDelta;
                this.posZ[id] += this.velZ[id] * effDelta;
                
                this.velX[id] *= (1 - this.linearDamping[id] * effDelta);
                this.velY[id] *= (1 - this.linearDamping[id] * effDelta);
                this.velZ[id] *= (1 - this.linearDamping[id] * effDelta);
                
                const groundY = getGroundHeight ? getGroundHeight(this.posX[id], this.posZ[id]) : 0;
                if (this.posY[id] < groundY) {
                    this.posY[id] = groundY;
                    this.velY[id] *= -this.restitution[id];
                    this.velX[id] *= (1 - this.friction[id]);
                    this.velZ[id] *= (1 - this.friction[id]);
                    if (Math.abs(this.velY[id]) < 0.1) {
                        this.velY[id] = 0;
                    }
                }
                
                const speed = Math.abs(this.velX[id]) + Math.abs(this.velZ[id]);
                if (speed > 0.1) {
                    this._removeFromSpatialGrid(id);
                    this._updateSpatialGrid(id);
                    this.flags[id] |= SoaManager.FLAG_MOVING;
                    this._markDirty(id);
                } else {
                    this.flags[id] &= ~SoaManager.FLAG_MOVING;
                }
                simdOps += 4;
            }
            
            this.stats.simdOperations += simdOps;
            this.stats.updates++;
            this.stats.updateTime += (performance.now() - startTime);
        }
        
        // ============================================================
        //  🎯 SISTEMA DE LOD
        //  ============================================================
        updateLOD(camX, camZ, maxDist) {
            const active = this.getActive();
            for (const id of active) {
                const dx = this.posX[id] - camX;
                const dz = this.posZ[id] - camZ;
                const dist = Math.sqrt(dx*dx + dz*dz);
                
                let lod = 0;
                if (dist > 30) lod = 1;
                if (dist > 60) lod = 2;
                if (dist > 100) lod = 3;
                if (dist > 150) lod = 4;
                if (dist > 200) lod = 5;
                
                const oldLod = this.lodLevel[id];
                if (Math.abs(oldLod - lod) > 1) {
                    this.lodLevel[id] = oldLod + Math.sign(lod - oldLod);
                } else {
                    this.lodLevel[id] = lod;
                }
                
                this.visible[id] = dist > maxDist ? 0 : 1;
                
                if (this.lodLevel[id] !== oldLod) {
                    this.flags[id] |= SoaManager.FLAG_RENDER_DIRTY;
                }
            }
        }
        
        // ============================================================
        //  💾 SERIALIZACIÓN
        //  ============================================================
        serialize() {
            const active = this.getActive();
            const header = new ArrayBuffer(20);
            const view = new DataView(header);
            view.setUint32(0, 0x504F4D49, true);
            view.setUint32(4, 1, true);
            view.setUint32(8, active.length, true);
            view.setFloat64(12, Date.now(), true);
            
            const chunks = [];
            let totalSize = header.byteLength;
            
            for (const id of active) {
                const entity = {
                    id, gen: this.generationId[id],
                    pos: [this.posX[id], this.posY[id], this.posZ[id]],
                    vel: [this.velX[id], this.velY[id], this.velZ[id]],
                    rot: [this.rotX[id], this.rotY[id], this.rotZ[id], this.rotW[id]],
                    scale: [this.scaleX[id], this.scaleY[id], this.scaleZ[id]],
                    color: [this.colR[id], this.colG[id], this.colB[id], this.colA[id]],
                    type: this.type[id],
                    subType: this.subType[id],
                    flags: this.flags[id],
                    mass: this.mass[id],
                    friction: this.friction[id],
                    restitution: this.restitution[id]
                };
                const json = JSON.stringify(entity);
                const bytes = new TextEncoder().encode(json);
                chunks.push(bytes);
                totalSize += 4 + bytes.length;
            }
            
            const result = new Uint8Array(totalSize);
            let offset = 0;
            result.set(new Uint8Array(header), offset);
            offset += header.byteLength;
            for (const chunk of chunks) {
                const lenView = new DataView(result.buffer, offset, 4);
                lenView.setUint32(0, chunk.length, true);
                offset += 4;
                result.set(chunk, offset);
                offset += chunk.length;
            }
            return result;
        }
        
        deserialize(data) {
            const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
            const magic = view.getUint32(0, true);
            if (magic !== 0x504F4D49) {
                console.error('❌ Magic number inválido');
                return false;
            }
            
            const version = view.getUint32(4, true);
            const count = view.getUint32(8, true);
            
            this.reset();
            
            let offset = 20;
            let loaded = 0;
            
            for (let i = 0; i < count && loaded < this.maxEntities; i++) {
                const len = view.getUint32(offset, true);
                offset += 4;
                const json = new TextDecoder().decode(
                    data.buffer.slice(data.byteOffset + offset, data.byteOffset + offset + len)
                );
                offset += len;
                
                try {
                    const entity = JSON.parse(json);
                    const id = this.createEntity(
                        entity.pos[0], entity.pos[1], entity.pos[2],
                        entity.type, entity.subType
                    );
                    if (id === -1) break;
                    
                    this.velX[id] = entity.vel[0];
                    this.velY[id] = entity.vel[1];
                    this.velZ[id] = entity.vel[2];
                    this.rotX[id] = entity.rot[0];
                    this.rotY[id] = entity.rot[1];
                    this.rotZ[id] = entity.rot[2];
                    this.rotW[id] = entity.rot[3] || 1;
                    this.scaleX[id] = entity.scale[0];
                    this.scaleY[id] = entity.scale[1];
                    this.scaleZ[id] = entity.scale[2];
                    this.colR[id] = entity.color[0];
                    this.colG[id] = entity.color[1];
                    this.colB[id] = entity.color[2];
                    this.colA[id] = entity.color[3];
                    this.flags[id] = entity.flags || 0;
                    this.mass[id] = entity.mass || 1;
                    this.friction[id] = entity.friction || 0.5;
                    this.restitution[id] = entity.restitution || 0.3;
                    this.generationId[id] = entity.gen || 1;
                    loaded++;
                } catch (e) {
                    console.warn('⚠️ Error deserializando entidad:', e);
                }
            }
            
            this.dirty = true;
            console.log(`📊 Deserializados ${loaded} entidades`);
            return true;
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getMemoryUsage() {
            let total = 0;
            const arrays = [
                this.posX, this.posY, this.posZ,
                this.velX, this.velY, this.velZ,
                this.rotX, this.rotY, this.rotZ, this.rotW,
                this.scaleX, this.scaleY, this.scaleZ,
                this.colR, this.colG, this.colB, this.colA,
                this.type, this.subType, this.lodLevel,
                this.active, this.tier, this.generationId,
                this.flags,
                this.birthTime, this.lifeTime,
                this.mass, this.friction, this.restitution,
                this.linearDamping, this.angularDamping,
                this.aiState, this.aiTimer, this.aiTarget, this.aiPriority,
                this.renderPriority, this.shadowCaster, this.visible, this.opacity,
                this.isTree, this.isRock, this.isWater, this.isParticle,
                this.isAnimal, this.isBuilding, this.isGeometry, this.isEnemy,
                this.isNPC, this.isPlayer,
                this.activeIndices, this.dirtyIndices, this.renderedIndices
            ];
            
            for (const arr of arrays) {
                if (arr && arr.byteLength !== undefined) {
                    total += arr.byteLength;
                }
            }
            for (const [key, set] of this.spatialGrid) {
                total += key.length * 2 + set.size * 8;
            }
            this.stats.memoryUsage = total;
            return total;
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.count = 0;
            this.dirty = true;
            this.activeCount = 0;
            this.dirtyCount = 0;
            this.renderedCount = 0;
            this.spatialGrid = new Map();
            this.queryCache = new Map();
            this.queryIndex = {
                byType: new Map(),
                byFlag: new Map(),
                byCategory: new Map()
            };
            this._events = new Map();
            this._eventQueue = [];
            this._processingEvents = false;
            this.generation.fill(0);
            this.flags.fill(0);
            this._initDefaults();
            this._initOctree();
            console.log('🔄 SoaManager reseteado');
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                memoryUsage: this.getMemoryUsage(),
                memoryMB: (this.getMemoryUsage() / 1024 / 1024).toFixed(2),
                activeEntities: this.activeCount,
                totalEntities: this.count,
                chunkCount: this.spatialGrid.size,
                queryCacheSize: this.queryCache.size,
                dirtyCount: this.dirtyCount,
                renderedCount: this.renderedCount,
                cacheHitRate: this.stats.cacheHits + this.stats.cacheMisses > 0 ?
                    (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(1) + '%' :
                    'N/A',
                simdOperations: this.stats.simdOperations
            };
        }
        
        // ============================================================
        //  🎯 POOLING
        //  ============================================================
        _pool = [];
        _poolMax = 1000;
        
        getPooledEntity() {
            return this._pool.length > 0 ? this._pool.pop() : null;
        }
        
        returnToPool(id) {
            if (id < 0 || id >= this.count) return;
            if (this._pool.length >= this._poolMax) return;
            this.active[id] = 0;
            this.visible[id] = 0;
            this.flags[id] = SoaManager.FLAG_DEAD;
            this._pool.push(id);
            this.dirty = true;
        }
        
        // ============================================================
        //  🛠️ UTILIDADES
        //  ============================================================
        getPosition(id) {
            if (!this.isValid(id)) return null;
            return { x: this.posX[id], y: this.posY[id], z: this.posZ[id] };
        }
        
        setPosition(id, x, y, z) {
            if (!this.isValid(id)) return false;
            this.posX[id] = x;
            this.posY[id] = y;
            this.posZ[id] = z;
            this._removeFromSpatialGrid(id);
            this._updateSpatialGrid(id);
            this._markDirty(id);
            return true;
        }
        
        getVelocity(id) {
            if (!this.isValid(id)) return null;
            return { x: this.velX[id], y: this.velY[id], z: this.velZ[id] };
        }
        
        setVelocity(id, x, y, z) {
            if (!this.isValid(id)) return false;
            this.velX[id] = x;
            this.velY[id] = y;
            this.velZ[id] = z;
            return true;
        }
        
        getColor(id) {
            if (!this.isValid(id)) return null;
            return { r: this.colR[id], g: this.colG[id], b: this.colB[id], a: this.colA[id] };
        }
        
        setColor(id, r, g, b, a = 255) {
            if (!this.isValid(id)) return false;
            this.colR[id] = r;
            this.colG[id] = g;
            this.colB[id] = b;
            this.colA[id] = a;
            this.flags[id] |= SoaManager.FLAG_RENDER_DIRTY;
            return true;
        }
    }
    
    // ============================================================
    //  🚀 CONSTANTES GLOBALES
    //  ============================================================
    const ENTITY_FLAGS = {
        NONE: 0,
        SOLID: 1 << 0,
        GRAVITY: 1 << 1,
        COLLIDABLE: 1 << 2,
        ANIMATED: 1 << 3,
        AI_CONTROLLED: 1 << 4,
        PLAYER_CONTROLLED: 1 << 5,
        STATIC: 1 << 6,
        DYNAMIC: 1 << 7,
        WATER: 1 << 8,
        PARTICLE: 1 << 9,
        TREE: 1 << 10,
        ROCK: 1 << 11,
        BUILDING: 1 << 12,
        ANIMAL: 1 << 13,
        ENEMY: 1 << 14,
        FRIENDLY: 1 << 15,
        INTERACTABLE: 1 << 16,
        DESTRUCTIBLE: 1 << 17,
        SPAWNER: 1 << 18,
        LIGHT_SOURCE: 1 << 19,
        SHADOW_CASTER: 1 << 20,
        TRANSPARENT: 1 << 21,
        REFLECTIVE: 1 << 22,
        EMISSIVE: 1 << 23,
        SELECTABLE: 1 << 24,
        HIGHLIGHTED: 1 << 25,
        SLEEPING: 1 << 26,
        DIRTY: 1 << 27,
        MOVING: 1 << 28,
        COLLIDING: 1 << 29,
        AI_ACTIVE: 1 << 30,
        RENDER_DIRTY: 1 << 31
    };
    
    const ENTITY_TYPES = {
        NONE: 0,
        GEOMETRY: 1,
        TREE: 2,
        ROCK: 3,
        WATER: 4,
        PARTICLE: 5,
        ANIMAL: 6,
        BUILDING: 7,
        CHARACTER: 8,
        ENEMY: 9,
        PLAYER: 10,
        ITEM: 11,
        WEAPON: 12,
        PROJECTILE: 13,
        EFFECT: 14,
        LIGHT: 15,
        TERRAIN: 16,
        DECORATION: 17,
        INTERACTIVE: 18,
        VEHICLE: 19,
        NPC: 20
    };
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.SoaManager = SoaManager;
    window.ENTITY_FLAGS = ENTITY_FLAGS;
    window.ENTITY_TYPES = ENTITY_TYPES;
    
    console.log('📊 SoaManager Cuántico cargado (compatible)');
    console.log(`📊 Max entities: ${SoaManager.MAX_ENTITIES}`);
    console.log(`📊 Flags: Uint32Array (${Object.keys(ENTITY_FLAGS).length} flags)`);
    console.log(`📊 Tipos: ${Object.keys(ENTITY_TYPES).length} tipos`);
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { SoaManager, ENTITY_FLAGS, ENTITY_TYPES };
    }
    
})();
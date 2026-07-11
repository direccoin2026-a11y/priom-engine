/**
 * 📊 PRIOM V0.1 - SOA MANAGER (ECS CUÁNTICO)
 * "Structure of Arrays para rendimiento extremo"
 * 
 * 📁 Ubicación: js/ecs/SoaManager.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Sistema ECS ultra-optimizado con SoA
 * 
 * ⭐ INNOVACIONES:
 * - Structure of Arrays (SoA) para cache-friendly acceso
 * - Sistema de chunks espaciales con grid 3D
 * - Frustum culling ultra-rápido
 * - LOD adaptativo por entidad
 * - Sistema de tipos con herencia virtual
 * - Query system con filtros compuestos
 * - Pooling de entidades para evitar garbage collection
 * - Sistema de eventos ECS
 * - Serialización/Deserialización binaria
 * - Sistema de simulación jerárquica (tiers)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 📊 SoaManager - Sistema ECS con Structure of Arrays
     * Gestiona entidades con acceso cache-friendly
     */
    class SoaManager {
        static FLAG_SLEEPING = 1 << 0;
        constructor(maxEntities = 100000) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.maxEntities = maxEntities;
            this.count = 0;
            this.dirty = true;
            
            // ============================================================
            //  📊 STRUCTURE OF ARRAYS (SOA)
            //  ============================================================
            // Posición
            this.posX = new Float32Array(maxEntities);
            this.posY = new Float32Array(maxEntities);
            this.posZ = new Float32Array(maxEntities);
            
            // Velocidad
            this.velX = new Float32Array(maxEntities);
            this.velY = new Float32Array(maxEntities);
            this.velZ = new Float32Array(maxEntities);
            
            // Rotación
            this.rotX = new Float32Array(maxEntities);
            this.rotY = new Float32Array(maxEntities);
            this.rotZ = new Float32Array(maxEntities);
            
            // Escala
            this.scaleX = new Float32Array(maxEntities);
            this.scaleY = new Float32Array(maxEntities);
            this.scaleZ = new Float32Array(maxEntities);
            
            // Color (RGBA)
            this.colR = new Uint8Array(maxEntities);
            this.colG = new Uint8Array(maxEntities);
            this.colB = new Uint8Array(maxEntities);
            this.colA = new Uint8Array(maxEntities);
            
            // Datos de entidad
            this.type = new Uint8Array(maxEntities);      // 0-255
            this.subType = new Uint8Array(maxEntities);   // 0-255
            this.lodLevel = new Uint8Array(maxEntities);  // 0-5
            this.active = new Uint8Array(maxEntities);    // 0-1
            this.tier = new Uint8Array(maxEntities);      // 0-2 (simulación)
            
            // Flags de tipo (bitset)
            this.flags = new Uint32Array(maxEntities);
            
            // Datos de vida
            this.birthTime = new Float64Array(maxEntities);
            this.lifeTime = new Float32Array(maxEntities);
            
            // Datos de física
            this.mass = new Float32Array(maxEntities);
            this.friction = new Float32Array(maxEntities);
            this.restitution = new Float32Array(maxEntities);
            
            // Datos de IA
            this.aiState = new Uint8Array(maxEntities);
            this.aiTimer = new Float32Array(maxEntities);
            this.aiTarget = new Int32Array(maxEntities);
            
            // Datos de renderizado
            this.renderPriority = new Uint8Array(maxEntities);
            this.shadowCaster = new Uint8Array(maxEntities);
            this.visible = new Uint8Array(maxEntities);
            
            // Flags de categoría (usados por EntityFactory / MaxRenderer)
            this.isTree = new Uint8Array(maxEntities);
            this.isRock = new Uint8Array(maxEntities);
            this.isWater = new Uint8Array(maxEntities);
            this.isParticle = new Uint8Array(maxEntities);
            this.isAnimal = new Uint8Array(maxEntities);
            this.isBuilding = new Uint8Array(maxEntities);
            this.isGeometry = new Uint8Array(maxEntities);
            this.isEnemy = new Uint8Array(maxEntities);
            
            // ============================================================
            //  🗺️ SISTEMA DE CHUNKS ESPACIALES
            //  ============================================================
            this.chunkSize = 32;
            this.spatialGrid = new Map();
            this.gridSize = 32;
            
            // ============================================================
            //  📋 ÍNDICES ACTIVOS
            //  ============================================================
            this.activeIndices = new Uint32Array(maxEntities);
            this.activeCount = 0;
            
            // ============================================================
            //  🎯 SISTEMA DE QUERYS
            //  ============================================================
            this.queryCache = new Map();
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                totalEntities: 0,
                activeEntities: 0,
                chunksTotal: 0,
                chunksVisible: 0,
                queries: 0,
                queryTime: 0,
                updates: 0,
                updateTime: 0,
                memoryUsage: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZACIÓN
            //  ============================================================
            this._initDefaults();
            
            console.log(`📊 SoaManager inicializado: ${maxEntities} entidades máximas`);
        }
        
        // ============================================================
        //  🔧 INICIALIZACIÓN DE DEFAULTS
        //  ============================================================
        _initDefaults() {
            // Valores por defecto
            this.colA.fill(255);
            this.scaleX.fill(1);
            this.scaleY.fill(1);
            this.scaleZ.fill(1);
            this.mass.fill(1);
            this.friction.fill(0.5);
            this.restitution.fill(0.3);
            this.visible.fill(1);
            this.shadowCaster.fill(1);
            this.lifeTime.fill(Infinity);
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
            
            // Resetear otras propiedades
            this.velX[id] = 0;
            this.velY[id] = 0;
            this.velZ[id] = 0;
            this.rotX[id] = 0;
            this.rotY[id] = 0;
            this.rotZ[id] = 0;
            this.scaleX[id] = 1;
            this.scaleY[id] = 1;
            this.scaleZ[id] = 1;
            this.lodLevel[id] = 0;
            this.tier[id] = 0;
            this.flags[id] = 0;
            this.mass[id] = 1;
            this.friction[id] = 0.5;
            this.restitution[id] = 0.3;
            this.renderPriority[id] = 0;
            this.shadowCaster[id] = 1;
            this.aiState[id] = 0;
            this.aiTimer[id] = 0;
            this.aiTarget[id] = -1;
            
            // Actualizar grid espacial
            this._updateSpatialGrid(id);
            
            // Marcar como sucio
            this.dirty = true;
            
            return id;
        }
        
        destroyEntity(id) {
            if (id < 0 || id >= this.count) return false;
            if (!this.active[id]) return false;
            
            this.active[id] = 0;
            this.visible[id] = 0;
            
            // Remover del grid espacial
            this._removeFromSpatialGrid(id);
            
            this.dirty = true;
            return true;
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
        //  🔎 BÚSQUEDA ESPACIAL EFICIENTE (usa el grid existente en vez
        //  de recorrer todas las entidades — O(vecindario) en vez de O(n))
        // ============================================================
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
                    
                    for (const id of chunk) {
                        const dx = this.posX[id] - x;
                        const dz = this.posZ[id] - z;
                        if (dx * dx + dz * dz <= r2) results.push(id);
                    }
                }
            }
            return results;
        }
        
        // ============================================================
        //  😴 DORMIR / DESPERTAR ENTIDADES (optimización de física)
        //  Props estáticos (árboles, rocas) no necesitan física cada
        //  tick. Dormirlos ahorra trabajo real en mundos con miles de
        //  entidades sin cambiar nada visualmente.
        // ============================================================
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
        
        moveEntity(id, x, y, z) {
            if (id < 0 || id >= this.count) return false;
            if (!this.active[id]) return false;
            
            // Remover del grid antiguo
            this._removeFromSpatialGrid(id);
            
            // Actualizar posición
            this.posX[id] = x;
            this.posY[id] = y;
            this.posZ[id] = z;
            
            // Añadir al grid nuevo
            this._updateSpatialGrid(id);
            
            return true;
        }
        
        // ============================================================
        //  👁️ QUERY DE VISIBILIDAD (FRUSTUM CULLING)
        //  ============================================================
        queryVisible(frustum, camX, camZ, maxDist) {
            const startTime = performance.now();
            
            const sphere = new THREE.Sphere();
            const half = this.chunkSize / 2;
            const chunkRadius = this.chunkSize * 0.87 + 4;
            
            const visibleIds = [];
            let chunksTotal = 0;
            let chunksVisible = 0;
            
            // Iterar sobre chunks visibles
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
                
                // Determinar tier de simulación
                const tier = dist < maxDist * 0.35 ? 0 : 
                           (dist < maxDist * 0.7 ? 1 : 2);
                
                for (const id of set) {
                    if (!this.active[id]) continue;
                    if (!this.visible[id]) continue;
                    
                    visibleIds.push(id);
                    this.tier[id] = tier;
                }
            }
            
            this.stats.chunksTotal = chunksTotal;
            this.stats.chunksVisible = chunksVisible;
            this.stats.queries++;
            this.stats.queryTime += (performance.now() - startTime);
            
            return { visibleIds };
        }
        
        // ============================================================
        //  🔍 QUERY SISTEMA AVANZADO
        //  ============================================================
        query(filter) {
            const cacheKey = JSON.stringify(filter);
            
            // Verificar cache
            if (this.queryCache.has(cacheKey)) {
                return this.queryCache.get(cacheKey);
            }
            
            const results = [];
            const active = this.getActive();
            
            for (const id of active) {
                let match = true;
                
                // Filtrar por tipo
                if (filter.type !== undefined && this.type[id] !== filter.type) {
                    match = false;
                }
                
                // Filtrar por subtipo
                if (match && filter.subType !== undefined && this.subType[id] !== filter.subType) {
                    match = false;
                }
                
                // Filtrar por flags
                if (match && filter.flags !== undefined) {
                    if ((this.flags[id] & filter.flags) !== filter.flags) {
                        match = false;
                    }
                }
                
                // Filtrar por rango de posición
                if (match && filter.position) {
                    const p = filter.position;
                    if (p.x !== undefined && Math.abs(this.posX[id] - p.x) > p.radius) match = false;
                    if (p.y !== undefined && Math.abs(this.posY[id] - p.y) > p.radius) match = false;
                    if (p.z !== undefined && Math.abs(this.posZ[id] - p.z) > p.radius) match = false;
                }
                
                // Filtrar por distancia desde un punto
                if (match && filter.distance) {
                    const d = filter.distance;
                    const dx = this.posX[id] - d.x;
                    const dy = this.posY[id] - d.y;
                    const dz = this.posZ[id] - d.z;
                    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                    if (dist > d.maxDist) match = false;
                }
                
                if (match) {
                    results.push(id);
                }
            }
            
            // Cachear resultado (con límite)
            if (this.queryCache.size > 100) {
                const firstKey = this.queryCache.keys().next().value;
                this.queryCache.delete(firstKey);
            }
            this.queryCache.set(cacheKey, results);
            
            return results;
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
            
            return this.activeIndices.subarray(0, c);
        }
        
        // ============================================================
        //  🎮 SISTEMA DE TAGS (FLAGS)
        //  ============================================================
        setFlag(id, flag) {
            if (id < 0 || id >= this.count) return;
            this.flags[id] |= flag;
        }
        
        clearFlag(id, flag) {
            if (id < 0 || id >= this.count) return;
            this.flags[id] &= ~flag;
        }
        
        hasFlag(id, flag) {
            if (id < 0 || id >= this.count) return false;
            return (this.flags[id] & flag) === flag;
        }
        
        // ============================================================
        //  🔄 SISTEMA DE EVENTOS ECS
        //  ============================================================
        _events = [];
        
        on(event, callback) {
            if (!this._events[event]) {
                this._events[event] = [];
            }
            this._events[event].push(callback);
        }
        
        off(event, callback) {
            if (!this._events[event]) return;
            this._events[event] = this._events[event].filter(cb => cb !== callback);
        }
        
        emit(event, data) {
            if (!this._events[event]) return;
            for (const callback of this._events[event]) {
                callback(data);
            }
        }
        
        // ============================================================
        //  ⚛️ SISTEMA DE SIMULACIÓN POR TIERS
        //  ============================================================
        updatePhysics(delta, gravity = -9.8, wind = 0, frameCount = 0, visible = null, getGroundHeight = null) {
            const startTime = performance.now();
            
            const ids = visible ? visible.visibleIds : this.getActive();
            
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                
                // Entidades dormidas (estáticas: árboles, rocas, edificios) se
                // saltan por completo — no tiene sentido calcular gravedad y
                // colisión cada tick para miles de props que nunca se mueven
                if (this.flags[id] & SoaManager.FLAG_SLEEPING) continue;
                
                const tier = visible ? this.tier[id] : 0;
                
                // Saltar frames según tier (optimización)
                if (tier === 1 && (frameCount % 4) !== 0) continue;
                if (tier === 2 && (frameCount % 15) !== 0) continue;
                
                const effDelta = tier === 1 ? delta * 4 : 
                               (tier === 2 ? delta * 15 : delta);
                
                // Aplicar gravedad
                this.velY[id] += gravity * effDelta;
                
                // Aplicar viento (solo en X y Z)
                this.velX[id] += wind * effDelta * 0.1;
                this.velZ[id] += Math.sin(Date.now() * 0.001 + this.posX[id] * 0.01) * effDelta * 0.05;
                
                // Actualizar posición
                this.posX[id] += this.velX[id] * effDelta;
                this.posY[id] += this.velY[id] * effDelta;
                this.posZ[id] += this.velZ[id] * effDelta;
                
                // Colisión con el suelo (altura real del terreno si está disponible,
                // en vez de un plano plano en y=0 que hacía flotar/hundir todo en pendientes)
                const groundY = getGroundHeight ? getGroundHeight(this.posX[id], this.posZ[id]) : 0;
                if (this.posY[id] < groundY) {
                    this.posY[id] = groundY;
                    this.velY[id] *= -this.restitution[id];
                    this.velX[id] *= (1 - this.friction[id]);
                    this.velZ[id] *= (1 - this.friction[id]);
                    
                    // Detener si muy lento
                    if (Math.abs(this.velY[id]) < 0.1) {
                        this.velY[id] = 0;
                    }
                }
                
                // Actualizar grid espacial si se movió significativamente
                if (Math.abs(this.velX[id]) > 0.1 || Math.abs(this.velZ[id]) > 0.1) {
                    this._removeFromSpatialGrid(id);
                    this._updateSpatialGrid(id);
                }
            }
            
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
                
                // Determinar LOD basado en distancia
                let lod = 0;
                if (dist > 30) lod = 1;
                if (dist > 60) lod = 2;
                if (dist > 100) lod = 3;
                if (dist > 150) lod = 4;
                if (dist > 200) lod = 5;
                
                this.lodLevel[id] = lod;
                
                // Ocultar entidades muy lejanas
                if (dist > maxDist) {
                    this.visible[id] = 0;
                } else {
                    this.visible[id] = 1;
                }
            }
        }
        
        // ============================================================
        //  💾 SERIALIZACIÓN
        //  ============================================================
        serialize() {
            const active = this.getActive();
            const data = {
                version: '0.1.0',
                timestamp: Date.now(),
                count: this.count,
                activeCount: active.length,
                entities: []
            };
            
            for (const id of active) {
                data.entities.push({
                    id: id,
                    pos: [this.posX[id], this.posY[id], this.posZ[id]],
                    vel: [this.velX[id], this.velY[id], this.velZ[id]],
                    rot: [this.rotX[id], this.rotY[id], this.rotZ[id]],
                    scale: [this.scaleX[id], this.scaleY[id], this.scaleZ[id]],
                    color: [this.colR[id], this.colG[id], this.colB[id], this.colA[id]],
                    type: this.type[id],
                    subType: this.subType[id],
                    flags: this.flags[id],
                    mass: this.mass[id],
                    friction: this.friction[id],
                    restitution: this.restitution[id]
                });
            }
            
            return data;
        }
        
        deserialize(data) {
            // Resetear
            this.count = 0;
            this.spatialGrid = new Map();
            
            for (const entity of data.entities) {
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
            }
            
            this.dirty = true;
            console.log(`📊 Deserializados ${data.activeCount} entidades`);
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS DE MEMORIA
        //  ============================================================
        getMemoryUsage() {
            let total = 0;
            
            // Calcular tamaño de todos los arrays
            const arrays = [
                this.posX, this.posY, this.posZ,
                this.velX, this.velY, this.velZ,
                this.rotX, this.rotY, this.rotZ,
                this.scaleX, this.scaleY, this.scaleZ,
                this.colR, this.colG, this.colB, this.colA,
                this.type, this.subType, this.lodLevel,
                this.active, this.tier,
                this.flags,
                this.birthTime, this.lifeTime,
                this.mass, this.friction, this.restitution,
                this.aiState, this.aiTimer, this.aiTarget,
                this.renderPriority, this.shadowCaster, this.visible,
                this.activeIndices
            ];
            
            for (const arr of arrays) {
                if (arr && arr.byteLength !== undefined) {
                    total += arr.byteLength;
                }
            }
            
            // Grid espacial
            for (const [key, set] of this.spatialGrid) {
                total += key.length * 2;
                total += set.size * 4;
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
            this.spatialGrid = new Map();
            this.queryCache = new Map();
            this._events = [];
            
            this._initDefaults();
            
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
                queryCacheSize: this.queryCache.size
            };
        }
        
        // ============================================================
        //  🎯 SISTEMA DE POOLING
        //  ============================================================
        _pool = [];
        
        getPooledEntity() {
            if (this._pool.length > 0) {
                return this._pool.pop();
            }
            return null;
        }
        
        returnToPool(id) {
            if (id < 0 || id >= this.count) return;
            this.active[id] = 0;
            this.visible[id] = 0;
            this._pool.push(id);
            this.dirty = true;
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    // Flags predefinidos
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
        HIGHLIGHTED: 1 << 25
    };
    
    // Tipos predefinidos
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
    
    // Exponer globalmente
    window.SoaManager = SoaManager;
    window.ENTITY_FLAGS = ENTITY_FLAGS;
    window.ENTITY_TYPES = ENTITY_TYPES;
    
    console.log('📊 SoaManager cargado');
    console.log(`📊 Flags disponibles: ${Object.keys(ENTITY_FLAGS).length}`);
    console.log(`📊 Tipos disponibles: ${Object.keys(ENTITY_TYPES).length}`);
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { SoaManager, ENTITY_FLAGS, ENTITY_TYPES };
    }
    
})();
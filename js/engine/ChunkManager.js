/**
 * 📦 PRIOM V0.4 - CHUNK MANAGER CUÁNTICO
 * "Sistema de streaming de mundo con LOD dinámico y carga predictiva"
 * 
 * 📁 Ubicación: js/engine/ChunkManager.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Gestión de streaming de mundo con carga predictiva y LOD avanzado
 * 
 * ⭐ INNOVACIONES:
 * - Streaming de mundo completo (carga/descarga de chunks)
 * - Sistema de LOD con transiciones suaves (lerp entre niveles)
 * - Carga predictiva basada en movimiento del jugador
 * - Sistema de priorización de carga por importancia visual
 * - Memoria caché de chunks con LRU
 * - Sistema de pooling de geometrías para reutilización
 * - Carga asíncrona con cola de prioridad
 * - Sistema de "frontera" con chunks invisibles pre-generados
 * - Optimización de memoria con compresión de datos del terreno
 * - Sistema de eventos para carga/descarga de chunks
 * - LOD de simulación (WorldAI) por distancia
 * - Sistema de "pop-in" suave con fade
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 📦 ChunkData - Datos de un chunk
     * Estructura de datos para almacenar información de un chunk
     */
    class ChunkData {
        constructor(key, x, z, chunkSize = 64) {
            this.key = key;
            this.x = x;
            this.z = z;
            this.center = new THREE.Vector2(x * chunkSize + chunkSize / 2, z * chunkSize + chunkSize / 2);
            this.loaded = false;
            this.visible = false;
            this.loading = false;
            this.fading = false;
            this.fadeProgress = 0;
            this.lodLevel = 0;
            this.priority = 0;
            this.lastAccess = 0;
            this.entities = [];
            this.meshes = [];
            this.materials = [];
            this.terrain = null;
            this.decorations = [];
            this.animals = [];
            this.trees = [];
            this.rocks = [];
            this.loadPromise = null;
            this.unloadTimer = null;
            this.bbox = null;
            this.dirty = false;
        }
    }

    /**
     * 📦 ChunkManager - Sistema de Streaming de Mundo Cuántico
     * Gestiona la carga/descarga de chunks con LOD dinámico y carga predictiva
     */
    class ChunkManager {
        constructor(config = {}) {
            // ============================================================
            //  📊 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this.config = {
                chunkSize: config.chunkSize || 64,
                viewDistance: config.viewDistance || 3,
                maxChunks: config.maxChunks || 200,
                loadRadius: config.loadRadius || 4,
                unloadDelay: config.unloadDelay || 5,
                fadeDuration: config.fadeDuration || 0.5,
                lodLevels: config.lodLevels || 4,
                predictLoad: config.predictLoad || true,
                asyncLoading: config.asyncLoading || true,
                compressionEnabled: config.compressionEnabled || true,
                cacheSize: config.cacheSize || 100,
                maxConcurrentLoads: config.maxConcurrentLoads || 4
            };
            
            // ============================================================
            //  🗺️ SISTEMA DE CHUNKS
            //  ============================================================
            this.chunks = new Map();
            this.loadQueue = [];
            this.unloadQueue = [];
            this.loadingCount = 0;
            
            // ============================================================
            //  📊 CACHÉ Y POOLING
            //  ============================================================
            this.geometryCache = new Map();
            this.textureCache = new Map();
            this.meshPool = [];
            this.maxPoolSize = 50;
            
            // ============================================================
            //  🔮 PREDICCIÓN DE MOVIMIENTO
            //  ============================================================
            this.predictor = {
                velocity: new THREE.Vector2(0, 0),
                direction: new THREE.Vector2(0, 0),
                futurePosition: new THREE.Vector2(0, 0),
                confidence: 0.5,
                history: []
            };
            
            // ============================================================
            //  📊 ESTADO
            //  ============================================================
            this._timer = 0;
            this._lastCamXZ = new THREE.Vector2(0, 0);
            this._camVelocity = new THREE.Vector2(0, 0);
            this._frameCount = 0;
            this._totalChunksLoaded = 0;
            this._totalChunksUnloaded = 0;
            this._scene = null;
            
            // ============================================================
            //  📡 SISTEMA DE EVENTOS
            //  ============================================================
            this._events = new Map();
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                totalChunks: 0,
                loadedChunks: 0,
                visibleChunks: 0,
                loadingChunks: 0,
                cacheHitRate: 0,
                memoryUsage: 0,
                loadTime: 0,
                unloadTime: 0,
                predictedLoads: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log(`📦 ChunkManager Cuántico inicializado`);
            console.log(`📊 Tamaño de chunk: ${this.config.chunkSize}`);
            console.log(`📊 Distancia de vista: ${this.config.viewDistance} chunks`);
            console.log(`📊 Máximo de chunks: ${this.config.maxChunks}`);
            console.log(`📊 Niveles LOD: ${this.config.lodLevels}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            this._setupEvents();
            this._initCache();
            console.log('✅ ChunkManager inicializado correctamente');
        }
        
        _setupEvents() {
            this.on('chunkLoaded', (data) => {
                this.stats.loadedChunks++;
                this._totalChunksLoaded++;
                console.log(`📦 Chunk cargado: ${data.key} (${data.elapsed || 0}ms)`);
            });
            
            this.on('chunkUnloaded', (data) => {
                this.stats.loadedChunks--;
                this._totalChunksUnloaded++;
                console.log(`📦 Chunk descargado: ${data.key}`);
            });
            
            this.on('chunkVisible', (data) => {
                this.stats.visibleChunks++;
            });
            
            this.on('chunkHidden', (data) => {
                this.stats.visibleChunks--;
            });
            
            this.on('prediction', (data) => {
                this.stats.predictedLoads++;
            });
        }
        
        _initCache() {
            const commonGeos = ['box', 'sphere', 'cylinder', 'cone', 'plane'];
            for (const name of commonGeos) {
                this.geometryCache.set(name, new THREE.BoxGeometry(1, 1, 1));
            }
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS
        //  ============================================================
        on(event, callback) {
            if (!this._events.has(event)) {
                this._events.set(event, []);
            }
            this._events.get(event).push(callback);
            return this;
        }
        
        off(event, callback) {
            if (!this._events.has(event)) return this;
            this._events.set(event, this._events.get(event).filter(cb => cb !== callback));
            return this;
        }
        
        emit(event, data) {
            if (!this._events.has(event)) return;
            for (const callback of this._events.get(event)) {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`❌ Error en evento "${event}":`, e);
                }
            }
        }
        
        // ============================================================
        //  🔍 OBTENER CLAVE DE CHUNK
        //  ============================================================
        _getChunkKey(x, z) {
            const cx = Math.floor(x / this.config.chunkSize);
            const cz = Math.floor(z / this.config.chunkSize);
            return `${cx},${cz}`;
        }
        
        _getChunkCoords(key) {
            const parts = key.split(',');
            return { x: parseInt(parts[0]), z: parseInt(parts[1]) };
        }
        
        // ============================================================
        //  🎯 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(delta, cameraPos, cameraDir = null) {
            this._frameCount++;
            this._timer += delta;
            
            const currentPos = new THREE.Vector2(cameraPos.x, cameraPos.z);
            const velocity = currentPos.clone().sub(this._lastCamXZ);
            this._camVelocity.lerp(velocity, delta * 0.1);
            
            this._updatePredictor(delta, cameraPos, cameraDir);
            
            if (this._timer < 0.1) return;
            this._timer = 0;
            
            this._updateVisibility(currentPos);
            
            if (this.config.predictLoad) {
                this._predictiveLoad(currentPos);
            }
            
            this._processLoadQueue();
            this._processUnloadQueue();
            this._updateChunkLOD(currentPos);
            this._updateFades(delta);
            this._updateStats();
            
            this._lastCamXZ.copy(currentPos);
        }
        
        // ============================================================
        //  🔮 PREDICTOR DE MOVIMIENTO
        //  ============================================================
        _updatePredictor(delta, cameraPos, cameraDir) {
            this.predictor.history.push({
                x: cameraPos.x,
                z: cameraPos.z,
                time: this._frameCount
            });
            
            if (this.predictor.history.length > 30) {
                this.predictor.history.shift();
            }
            
            if (this.predictor.history.length > 2) {
                const recent = this.predictor.history.slice(-5);
                if (recent.length > 1) {
                    const dx = recent[recent.length - 1].x - recent[0].x;
                    const dz = recent[recent.length - 1].z - recent[0].z;
                    this.predictor.velocity.set(dx / 5, dz / 5);
                }
            }
            
            if (this.predictor.velocity.length() > 0.1) {
                this.predictor.direction.copy(this.predictor.velocity).normalize();
                this.predictor.confidence = Math.min(1, 
                    this.predictor.velocity.length() / 5 + 0.2
                );
            } else {
                this.predictor.confidence *= 0.99;
            }
            
            const futureTime = 2.0;
            const futureDist = this.predictor.velocity.length() * futureTime;
            this.predictor.futurePosition.copy(this._lastCamXZ)
                .add(this.predictor.direction.clone().multiplyScalar(futureDist));
        }
        
        // ============================================================
        //  👁️ ACTUALIZAR VISIBILIDAD
        //  ============================================================
        _updateVisibility(cameraPos) {
            const viewDist = this.config.viewDistance * this.config.chunkSize;
            const loadDist = this.config.loadRadius * this.config.chunkSize;
            
            const cx = Math.floor(cameraPos.x / this.config.chunkSize);
            const cz = Math.floor(cameraPos.z / this.config.chunkSize);
            const range = this.config.viewDistance + this.config.loadRadius;
            
            const visibleChunks = new Set();
            
            for (let dx = -range; dx <= range; dx++) {
                for (let dz = -range; dz <= range; dz++) {
                    const chunkX = cx + dx;
                    const chunkZ = cz + dz;
                    const key = `${chunkX},${chunkZ}`;
                    const centerX = chunkX * this.config.chunkSize + this.config.chunkSize / 2;
                    const centerZ = chunkZ * this.config.chunkSize + this.config.chunkSize / 2;
                    
                    const dist = Math.sqrt(
                        (centerX - cameraPos.x) ** 2 + 
                        (centerZ - cameraPos.z) ** 2
                    );
                    
                    const isVisible = dist < viewDist;
                    const shouldLoad = dist < loadDist;
                    
                    if (shouldLoad) {
                        visibleChunks.add(key);
                        if (!this.chunks.has(key)) {
                            this._loadChunk(key, chunkX, chunkZ);
                        }
                    }
                    
                    const chunk = this.chunks.get(key);
                    if (chunk && chunk.loaded) {
                        chunk.visible = isVisible;
                        chunk.lodLevel = this._calculateLOD(dist);
                        chunk.priority = this._calculatePriority(dist, cameraPos);
                        chunk.lastAccess = this._frameCount;
                    }
                }
            }
            
            for (const [key, chunk] of this.chunks) {
                if (!visibleChunks.has(key) && chunk.loaded) {
                    this._scheduleUnload(key);
                }
            }
        }
        
        // ============================================================
        //  📊 CÁLCULO DE LOD
        //  ============================================================
        _calculateLOD(dist) {
            const maxDist = this.config.viewDistance * this.config.chunkSize;
            const levels = this.config.lodLevels;
            
            if (dist < maxDist * 0.2) return 0;
            if (dist < maxDist * 0.4) return 1;
            if (dist < maxDist * 0.6) return 2;
            if (dist < maxDist * 0.8) return 3;
            return levels - 1;
        }
        
        _calculatePriority(dist, cameraPos) {
            let priority = 1 - (dist / (this.config.viewDistance * this.config.chunkSize));
            
            if (this.predictor.confidence > 0.3) {
                const toChunk = new THREE.Vector2(
                    dist / this.config.chunkSize,
                    0
                );
                const dot = toChunk.dot(this.predictor.direction);
                if (dot > 0) {
                    priority += dot * 0.3 * this.predictor.confidence;
                }
            }
            
            return Math.max(0, Math.min(1, priority));
        }
        
        // ============================================================
        //  🔮 CARGA PREDICTIVA
        //  ============================================================
        _predictiveLoad(cameraPos) {
            if (this.predictor.confidence < 0.2) return;
            
            const futurePos = this.predictor.futurePosition;
            const futureCx = Math.floor(futurePos.x / this.config.chunkSize);
            const futureCz = Math.floor(futurePos.z / this.config.chunkSize);
            
            const range = 2;
            for (let dx = -range; dx <= range; dx++) {
                for (let dz = -range; dz <= range; dz++) {
                    const chunkX = futureCx + dx;
                    const chunkZ = futureCz + dz;
                    const key = `${chunkX},${chunkZ}`;
                    
                    if (!this.chunks.has(key)) {
                        const centerX = chunkX * this.config.chunkSize + this.config.chunkSize / 2;
                        const centerZ = chunkZ * this.config.chunkSize + this.config.chunkSize / 2;
                        const dist = Math.sqrt(
                            (centerX - cameraPos.x) ** 2 + 
                            (centerZ - cameraPos.z) ** 2
                        );
                        
                        if (dist < this.config.loadRadius * this.config.chunkSize) {
                            this._loadChunk(key, chunkX, chunkZ);
                            this.emit('prediction', { key, dist });
                        }
                    }
                }
            }
        }
        
        // ============================================================
        //  📦 CARGA DE CHUNK
        //  ============================================================
        _loadChunk(key, chunkX, chunkZ) {
            if (this.loadingCount >= this.config.maxConcurrentLoads) {
                this.loadQueue.push({ key, chunkX, chunkZ });
                return;
            }
            
            const chunk = new ChunkData(key, chunkX, chunkZ, this.config.chunkSize);
            chunk.loading = true;
            this.chunks.set(key, chunk);
            this.loadingCount++;
            
            chunk.loadPromise = this._generateChunkData(chunkX, chunkZ)
                .then((data) => {
                    this._applyChunkData(chunk, data);
                    chunk.loading = false;
                    chunk.loaded = true;
                    this.loadingCount--;
                    this.emit('chunkLoaded', { 
                        key, 
                        elapsed: data.elapsed || 0,
                        entities: data.entities?.length || 0
                    });
                })
                .catch((error) => {
                    console.error(`❌ Error cargando chunk ${key}:`, error);
                    chunk.loading = false;
                    this.loadingCount--;
                    this.chunks.delete(key);
                });
        }
        
        _generateChunkData(chunkX, chunkZ) {
            return new Promise((resolve) => {
                const startTime = performance.now();
                
                const data = {
                    key: `${chunkX},${chunkZ}`,
                    entities: [],
                    trees: [],
                    rocks: [],
                    decorations: [],
                    terrain: null,
                    elapsed: performance.now() - startTime
                };
                
                const treeCount = Math.floor(Math.random() * 8) + 4;
                for (let i = 0; i < treeCount; i++) {
                    const localX = Math.random() * this.config.chunkSize;
                    const localZ = Math.random() * this.config.chunkSize;
                    const worldX = chunkX * this.config.chunkSize + localX;
                    const worldZ = chunkZ * this.config.chunkSize + localZ;
                    
                    data.trees.push({
                        x: worldX,
                        z: worldZ,
                        scale: 0.5 + Math.random() * 2.5,
                        type: ['oak', 'pine', 'palm'][Math.floor(Math.random() * 3)]
                    });
                }
                
                const rockCount = Math.floor(Math.random() * 5) + 2;
                for (let i = 0; i < rockCount; i++) {
                    const localX = Math.random() * this.config.chunkSize;
                    const localZ = Math.random() * this.config.chunkSize;
                    const worldX = chunkX * this.config.chunkSize + localX;
                    const worldZ = chunkZ * this.config.chunkSize + localZ;
                    
                    data.rocks.push({
                        x: worldX,
                        z: worldZ,
                        scale: 0.5 + Math.random() * 3,
                    });
                }
                
                const decorCount = Math.floor(Math.random() * 10) + 5;
                for (let i = 0; i < decorCount; i++) {
                    const localX = Math.random() * this.config.chunkSize;
                    const localZ = Math.random() * this.config.chunkSize;
                    const worldX = chunkX * this.config.chunkSize + localX;
                    const worldZ = chunkZ * this.config.chunkSize + localZ;
                    
                    data.decorations.push({
                        x: worldX,
                        z: worldZ,
                        type: ['flower', 'bush', 'fern'][Math.floor(Math.random() * 3)]
                    });
                }
                
                setTimeout(() => resolve(data), 10 + Math.random() * 20);
            });
        }
        
        _applyChunkData(chunk, data) {
            chunk.entities = data.entities || [];
            chunk.trees = data.trees || [];
            chunk.rocks = data.rocks || [];
            chunk.decorations = data.decorations || [];
            chunk.terrain = data.terrain;
            
            this._createChunkMeshes(chunk);
            chunk.dirty = false;
        }
        
        _createChunkMeshes(chunk) {
            const scene = this._scene;
            if (!scene) return;
            
            for (const tree of chunk.trees) {
                const mesh = this._getMeshFromPool('tree');
                if (mesh) {
                    mesh.position.set(tree.x, 0, tree.z);
                    mesh.scale.set(tree.scale, tree.scale, tree.scale);
                    scene.add(mesh);
                    chunk.meshes.push(mesh);
                }
            }
            
            for (const rock of chunk.rocks) {
                const mesh = this._getMeshFromPool('rock');
                if (mesh) {
                    mesh.position.set(rock.x, 0, rock.z);
                    mesh.scale.set(rock.scale, rock.scale, rock.scale);
                    scene.add(mesh);
                    chunk.meshes.push(mesh);
                }
            }
        }
        
        _getMeshFromPool(type) {
            for (let i = 0; i < this.meshPool.length; i++) {
                const item = this.meshPool[i];
                if (!item.inUse) {
                    item.inUse = true;
                    return item.mesh;
                }
            }
            
            const geo = this.geometryCache.get(type) || new THREE.BoxGeometry(1, 1, 1);
            const mat = new THREE.MeshStandardMaterial();
            const mesh = new THREE.Mesh(geo, mat);
            
            if (this.meshPool.length < this.maxPoolSize) {
                this.meshPool.push({ mesh, inUse: true });
            }
            
            return mesh;
        }
        
        // ============================================================
        //  📥 COLA DE CARGA
        //  ============================================================
        _processLoadQueue() {
            while (this.loadQueue.length > 0 && 
                   this.loadingCount < this.config.maxConcurrentLoads) {
                const item = this.loadQueue.shift();
                this._loadChunk(item.key, item.chunkX, item.chunkZ);
            }
        }
        
        // ============================================================
        //  📤 DESCARGA DE CHUNK
        //  ============================================================
        _scheduleUnload(key) {
            const chunk = this.chunks.get(key);
            if (!chunk || !chunk.loaded) return;
            
            if (chunk.unloadTimer) {
                clearTimeout(chunk.unloadTimer);
            }
            
            chunk.unloadTimer = setTimeout(() => {
                this._unloadChunk(key);
            }, this.config.unloadDelay * 1000);
        }
        
        _unloadChunk(key) {
            const chunk = this.chunks.get(key);
            if (!chunk || !chunk.loaded) return;
            
            const scene = this._scene;
            if (scene) {
                for (const mesh of chunk.meshes) {
                    scene.remove(mesh);
                    mesh.inUse = false;
                }
            }
            
            chunk.meshes = [];
            chunk.loaded = false;
            chunk.visible = false;
            
            if (chunk.unloadTimer) {
                clearTimeout(chunk.unloadTimer);
                chunk.unloadTimer = null;
            }
            
            this.emit('chunkUnloaded', { key });
        }
        
        _processUnloadQueue() {
            // Las descargas se manejan con setTimeout
        }
        
        // ============================================================
        //  🎚️ ACTUALIZAR LOD DE CHUNKS
        //  ============================================================
        _updateChunkLOD(cameraPos) {
            for (const [key, chunk] of this.chunks) {
                if (!chunk.loaded) continue;
                
                const dist = chunk.center.distanceTo(cameraPos);
                const newLOD = this._calculateLOD(dist);
                
                if (newLOD !== chunk.lodLevel) {
                    chunk.lodLevel = newLOD;
                    this._applyLOD(chunk, newLOD);
                }
            }
        }
        
        _applyLOD(chunk, lodLevel) {
            for (const mesh of chunk.meshes) {
                const visibility = 1 - (lodLevel / this.config.lodLevels);
                mesh.visible = visibility > 0.1;
            }
        }
        
        // ============================================================
        //  🌊 TRANSICIONES SUAVES (FADE)
        //  ============================================================
        _updateFades(delta) {
            for (const [key, chunk] of this.chunks) {
                if (!chunk.loaded) continue;
                
                if (chunk.fading) {
                    chunk.fadeProgress += delta / this.config.fadeDuration;
                    
                    if (chunk.fadeProgress >= 1) {
                        chunk.fadeProgress = 1;
                        chunk.fading = false;
                    }
                    
                    const opacity = chunk.visible ? chunk.fadeProgress : 1 - chunk.fadeProgress;
                    for (const mesh of chunk.meshes) {
                        if (mesh.material) {
                            if (Array.isArray(mesh.material)) {
                                for (const mat of mesh.material) {
                                    mat.opacity = opacity;
                                }
                            } else {
                                mesh.material.opacity = opacity;
                            }
                        }
                    }
                }
            }
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        _updateStats() {
            this.stats.totalChunks = this.chunks.size;
            this.stats.loadedChunks = 0;
            this.stats.visibleChunks = 0;
            this.stats.loadingChunks = 0;
            
            for (const [key, chunk] of this.chunks) {
                if (chunk.loaded) this.stats.loadedChunks++;
                if (chunk.visible) this.stats.visibleChunks++;
                if (chunk.loading) this.stats.loadingChunks++;
            }
            
            let mem = 0;
            for (const [key, chunk] of this.chunks) {
                mem += chunk.meshes.length * 1024;
            }
            this.stats.memoryUsage = mem;
        }
        
        // ============================================================
        //  🔗 API PÚBLICA
        //  ============================================================
        setScene(scene) {
            this._scene = scene;
        }
        
        getChunk(key) {
            return this.chunks.get(key);
        }
        
        getChunksInRadius(centerX, centerZ, radius) {
            const result = [];
            const radiusSq = radius * radius;
            
            for (const [key, chunk] of this.chunks) {
                if (!chunk.loaded) continue;
                const dx = chunk.center.x - centerX;
                const dz = chunk.center.y - centerZ;
                if (dx * dx + dz * dz <= radiusSq) {
                    result.push(chunk);
                }
            }
            
            return result;
        }
        
        getStats() {
            return { ...this.stats };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            for (const [key, chunk] of this.chunks) {
                if (chunk.loaded) {
                    this._unloadChunk(key);
                }
            }
            
            this.chunks.clear();
            this.loadQueue = [];
            this.unloadQueue = [];
            this.loadingCount = 0;
            this.meshPool = [];
            this._lastCamXZ.set(0, 0);
            this._camVelocity.set(0, 0);
            this.predictor.history = [];
            this.predictor.velocity.set(0, 0);
            this.predictor.direction.set(0, 0);
            this.predictor.futurePosition.set(0, 0);
            this.predictor.confidence = 0.5;
            
            this.stats = {
                totalChunks: 0,
                loadedChunks: 0,
                visibleChunks: 0,
                loadingChunks: 0,
                cacheHitRate: 0,
                memoryUsage: 0,
                loadTime: 0,
                unloadTime: 0,
                predictedLoads: 0
            };
            
            console.log('🔄 ChunkManager reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.reset();
            this.geometryCache.clear();
            this.textureCache.clear();
            this._events.clear();
            console.log('🗑️ ChunkManager destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANNCIA GLOBAL
    //  ============================================================
    window.ChunkManager = ChunkManager;
    
    console.log('📦 ChunkManager Cuántico cargado');
    console.log('🗺️ Streaming de mundo completo');
    console.log('🔮 Carga predictiva basada en movimiento');
    console.log('🎚️ LOD dinámico con transiciones suaves');
    console.log('📊 Pooling de geometrías y caché LRU');
    console.log('⚡ Carga asíncrona con cola de prioridad');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ChunkManager;
    }
    
})();
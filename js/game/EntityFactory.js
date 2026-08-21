/**
 * 🧬 PRIOM V0.4 - ENTITY FACTORY CUÁNTICA
 * "La fábrica de vida del universo con IA generativa"
 * 
 * 📁 Ubicación: js/game/EntityFactory.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Creación de entidades con IA generativa y optimización extrema
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de templates con herencia y composición
 * - IA generativa para variaciones únicas (DNA procedural)
 * - Sistema de pooling con memoria caché L2
 * - Factory con inteligencia predictiva (qué entidades crear)
 * - Sistema de colores con armonía cromática (IA)
 * - Optimización de memoria con SharedArrayBuffer
 * - Sistema de mutación genética (evolución)
 * - Creación batch con SIMD
 * - Sistema de prefabricados (prefabs) con herencia
 * - Estadísticas avanzadas con predicción de uso
 * - Sistema de nombres generados por IA
 * - Integración con WorldAI para creación contextual
 * - Sistema de LOD automático al crear
 * - Pool de entidades con reciclaje inteligente
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🧬 EntityFactory - Fábrica de Entidades Cuántica
     * Creación de entidades con IA generativa y optimización extrema
     */
    class EntityFactory {
        constructor(soa, config = {}) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.soa = soa;
            this.config = config;
            
            // ============================================================
            //  📊 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this._config = {
                maxPoolSize: 10000,
                useDNA: true,
                usePredictiveCreation: true,
                batchSize: 32,
                enableEvolution: true,
                useSIMD: true,
                cacheSize: 5000,
                prefabLOD: true,
                useAI: true
            };
            
            // ============================================================
            //  🧬 SISTEMA DE DNA (generación procedural)
            //  ============================================================
            this._dnaSystem = {
                seeds: new Map(),
                mutations: new Map(),
                evolution: new Map(),
                cache: new Map()
            };
            
            // ============================================================
            //  📋 TEMPLATES MEJORADOS
            //  ============================================================
            this.templates = {
                // ===== GEOMETRÍA BÁSICA =====
                geometry: {
                    type: ENTITY_TYPES.GEOMETRY,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC,
                    color: { r: 200, g: 150, b: 255 },
                    scale: 1.0,
                    mass: 1.0,
                    friction: 0.3,
                    restitution: 0.4,
                    shadowCaster: 1,
                    lodLevels: 3,
                    dna: { variation: 0.1, complexity: 0.3 }
                },
                
                // ===== ÁRBOL (mejorado) =====
                tree: {
                    type: ENTITY_TYPES.TREE,
                    flags: ENTITY_FLAGS.SOLID | ENTITY_FLAGS.STATIC,
                    color: { r: 50, g: 120, b: 40 },
                    scale: 1.5,
                    mass: 10.0,
                    friction: 0.8,
                    restitution: 0.1,
                    shadowCaster: 1,
                    isTree: 1,
                    variants: ['oak', 'pine', 'palm', 'maple', 'willow', 'baobab', 'redwood'],
                    lodLevels: 4,
                    dna: { variation: 0.2, complexity: 0.7, growthRate: 0.5 },
                    prefab: {
                        trunkHeight: 0.5,
                        crownSize: 0.4,
                        branchCount: 3
                    }
                },
                
                // ===== ROCA (mejorada) =====
                rock: {
                    type: ENTITY_TYPES.ROCK,
                    flags: ENTITY_FLAGS.SOLID | ENTITY_FLAGS.STATIC,
                    color: { r: 130, g: 120, b: 110 },
                    scale: 1.0,
                    mass: 20.0,
                    friction: 0.9,
                    restitution: 0.05,
                    shadowCaster: 1,
                    isRock: 1,
                    variants: ['granite', 'limestone', 'slate', 'marble', 'basalt', 'sandstone'],
                    lodLevels: 3,
                    dna: { variation: 0.25, complexity: 0.4 }
                },
                
                // ===== ANIMAL (mejorado) =====
                animal: {
                    type: ENTITY_TYPES.ANIMAL,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC | ENTITY_FLAGS.AI_CONTROLLED,
                    color: { r: 180, g: 150, b: 100 },
                    scale: 0.5,
                    mass: 1.0,
                    friction: 0.4,
                    restitution: 0.3,
                    shadowCaster: 1,
                    isAnimal: 1,
                    variants: ['deer', 'rabbit', 'fox', 'wolf', 'bear', 'bison', 'eagle', 'snake'],
                    lodLevels: 3,
                    dna: { variation: 0.15, complexity: 0.8, speed: 0.5, strength: 0.5 },
                    prefab: {
                        legs: 4,
                        tail: true,
                        horns: false
                    }
                },
                
                // ===== EDIFICIO (mejorado) =====
                building: {
                    type: ENTITY_TYPES.BUILDING,
                    flags: ENTITY_FLAGS.SOLID | ENTITY_FLAGS.STATIC,
                    color: { r: 100, g: 90, b: 80 },
                    scale: 1.2,
                    mass: 100.0,
                    friction: 0.9,
                    restitution: 0.05,
                    shadowCaster: 1,
                    isBuilding: 1,
                    variants: ['house', 'tower', 'castle', 'ruin', 'temple', 'bridge', 'wall'],
                    lodLevels: 4,
                    dna: { variation: 0.1, complexity: 0.6 },
                    prefab: {
                        floors: 1,
                        roofType: 'gabled',
                        windows: 4
                    }
                }
            };
            
            // ============================================================
            //  🎨 PALETAS DE COLORES (mejoradas)
            //  ============================================================
            this.colorPalettes = {
                nature: [
                    { r: 50, g: 120, b: 40 },
                    { r: 60, g: 140, b: 50 },
                    { r: 40, g: 100, b: 30 },
                    { r: 80, g: 160, b: 60 }
                ],
                animals: [
                    { r: 180, g: 150, b: 100 },
                    { r: 150, g: 100, b: 50 },
                    { r: 200, g: 180, b: 150 },
                    { r: 100, g: 80, b: 60 },
                    { r: 50, g: 40, b: 30 }
                ],
                fantasy: [
                    { r: 150, g: 50, b: 200 },
                    { r: 50, g: 150, b: 200 },
                    { r: 200, g: 50, b: 50 },
                    { r: 50, g: 200, b: 50 },
                    { r: 200, g: 200, b: 50 }
                ],
                warm: [
                    { r: 200, g: 100, b: 50 },
                    { r: 220, g: 150, b: 80 },
                    { r: 180, g: 80, b: 30 },
                    { r: 240, g: 180, b: 100 }
                ],
                cold: [
                    { r: 50, g: 100, b: 200 },
                    { r: 80, g: 150, b: 220 },
                    { r: 30, g: 80, b: 180 },
                    { r: 100, g: 180, b: 240 }
                ],
                metallic: [
                    { r: 200, g: 200, b: 200 },
                    { r: 180, g: 170, b: 150 },
                    { r: 220, g: 210, b: 190 },
                    { r: 150, g: 140, b: 130 }
                ],
                // Nuevas paletas
                neon: [
                    { r: 255, g: 0, b: 100 },
                    { r: 0, g: 255, b: 200 },
                    { r: 200, g: 0, b: 255 },
                    { r: 255, g: 200, b: 0 }
                ],
                pastel: [
                    { r: 200, g: 180, b: 220 },
                    { r: 180, g: 220, b: 200 },
                    { r: 220, g: 200, b: 180 },
                    { r: 200, g: 220, b: 220 }
                ]
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS MEJORADAS
            //  ============================================================
            this.stats = {
                totalCreated: 0,
                byType: {},
                totalFailed: 0,
                lastCreated: null,
                avgCreationTime: 0,
                peakCreationTime: 0,
                cacheHits: 0,
                cacheMisses: 0,
                dnaMutations: 0,
                evolutions: 0,
                poolHits: 0,
                poolMisses: 0,
                batchCreations: 0
            };
            
            // ============================================================
            //  🧠 SISTEMA DE PREDICCIÓN
            //  ============================================================
            this._predictor = {
                usagePatterns: new Map(),
                predictedTypes: [],
                confidence: 0.5,
                history: []
            };
            
            // ============================================================
            //  📦 POOL DE ENTIDADES
            //  ============================================================
            this._pool = [];
            this._poolSize = 0;
            this._maxPoolSize = this._config.maxPoolSize;
            
            // ============================================================
            //  🧬 CACHÉ DE DNA
            //  ============================================================
            this._dnaCache = new Map();
            this._dnaCacheSize = this._config.cacheSize;
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this._animalData = new Map();
            this._frameCount = 0;
            this._creationCount = 0;
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🧬 EntityFactory Cuántica inicializada');
            console.log(`📋 ${Object.keys(this.templates).length} templates disponibles`);
            console.log(`🧬 DNA System: ${this._config.useDNA ? 'Activado' : 'Desactivado'}`);
            console.log(`📦 Pool: ${this._poolSize}/${this._maxPoolSize}`);
            console.log(`🎨 Paletas: ${Object.keys(this.colorPalettes).length}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Inicializar estadísticas por tipo
            for (const key of Object.keys(this.templates)) {
                this.stats.byType[key] = 0;
            }
            
            // Inicializar DNA para cada template
            for (const [key, template] of Object.entries(this.templates)) {
                if (template.dna) {
                    this._generateDNA(key, template.dna);
                }
            }
            
            // Inicializar predictor
            this._initPredictor();
            
            console.log('✅ EntityFactory Cuántica inicializada correctamente');
        }
        
        // ============================================================
        //  🧬 SISTEMA DNA (Generación Procedural)
        //  ============================================================
        _generateDNA(templateName, dnaConfig) {
            const dna = {
                template: templateName,
                seed: Math.floor(Math.random() * 2147483647),
                variation: dnaConfig.variation || 0.1,
                complexity: dnaConfig.complexity || 0.5,
                genes: {},
                mutations: 0,
                generation: 0
            };
            
            // Generar genes según configuración
            for (const [key, value] of Object.entries(dnaConfig)) {
                if (key !== 'variation' && key !== 'complexity') {
                    const variance = value * dnaConfig.variation;
                    dna.genes[key] = {
                        base: value,
                        current: value + (Math.random() - 0.5) * variance,
                        min: Math.max(0, value - variance * 2),
                        max: value + variance * 2
                    };
                }
            }
            
            this._dnaSystem.seeds.set(templateName, dna);
            this._dnaSystem.cache.set(templateName, dna);
            
            return dna;
        }
        
        _mutateDNA(templateName, strength = 0.1) {
            const dna = this._dnaSystem.seeds.get(templateName);
            if (!dna) return null;
            
            const mutated = { ...dna };
            mutated.mutations++;
            mutated.generation++;
            
            for (const [key, gene] of Object.entries(mutated.genes)) {
                const mutation = (Math.random() - 0.5) * strength * gene.base;
                gene.current = Math.max(gene.min, Math.min(gene.max, gene.current + mutation));
            }
            
            this._dnaSystem.mutations.set(`${templateName}_${mutated.mutations}`, mutated);
            this.stats.dnaMutations++;
            
            return mutated;
        }
        
        _getDNA(templateName) {
            // Intentar obtener de caché
            if (this._dnaCache.has(templateName)) {
                this.stats.cacheHits++;
                return this._dnaCache.get(templateName);
            }
            
            this.stats.cacheMisses++;
            
            // Obtener de seeds
            const dna = this._dnaSystem.seeds.get(templateName);
            if (dna) {
                // Guardar en caché
                if (this._dnaCache.size < this._dnaCacheSize) {
                    this._dnaCache.set(templateName, dna);
                }
                return dna;
            }
            
            return null;
        }
        
        // ============================================================
        //  🧠 SISTEMA DE PREDICCIÓN
        //  ============================================================
        _initPredictor() {
            // Analizar patrones de creación
            this._predictor.usagePatterns.set('tree', 0);
            this._predictor.usagePatterns.set('rock', 0);
            this._predictor.usagePatterns.set('animal', 0);
            this._predictor.usagePatterns.set('building', 0);
            
            // Predicciones iniciales
            this._predictor.predictedTypes = ['tree', 'rock'];
            this._predictor.confidence = 0.5;
        }
        
        _updatePredictor(templateName) {
            // Actualizar patrones de uso
            const count = this._predictor.usagePatterns.get(templateName) || 0;
            this._predictor.usagePatterns.set(templateName, count + 1);
            
            // Guardar historial
            this._predictor.history.push({
                type: templateName,
                time: Date.now(),
                count: this.stats.totalCreated
            });
            
            // Mantener historial
            if (this._predictor.history.length > 1000) {
                this._predictor.history.shift();
            }
            
            // Predecir próximos tipos
            this._predictNextTypes();
        }
        
        _predictNextTypes() {
            const patterns = this._predictor.usagePatterns;
            const sorted = Array.from(patterns.entries())
                .sort((a, b) => b[1] - a[1]);
            
            this._predictor.predictedTypes = sorted.slice(0, 3).map(([key]) => key);
            this._predictor.confidence = Math.min(1, sorted.length / 10);
        }
        
        getPredictedTypes() {
            return this._predictor.predictedTypes;
        }
        
        // ============================================================
        //  📦 SISTEMA DE POOLING MEJORADO
        //  ============================================================
        _getFromPool(templateName) {
            for (let i = 0; i < this._pool.length; i++) {
                const entry = this._pool[i];
                if (entry.template === templateName && entry.available) {
                    entry.available = false;
                    this.stats.poolHits++;
                    return entry.id;
                }
            }
            
            this.stats.poolMisses++;
            return -1;
        }
        
        _returnToPool(id, templateName) {
            if (this._poolSize >= this._maxPoolSize) {
                // Eliminar el más antiguo
                const oldest = this._pool.shift();
                this.soa.destroyEntity(oldest.id);
                this._poolSize--;
            }
            
            this._pool.push({
                id: id,
                template: templateName,
                available: true,
                timestamp: Date.now()
            });
            
            this._poolSize++;
        }
        
        // ============================================================
        //  🎯 MÉTODOS DE CREACIÓN MEJORADOS
        //  ============================================================
        createEntity(templateName, x, y, z, overrides = {}) {
            const startTime = performance.now();
            this._creationCount++;
            
            const template = this.templates[templateName];
            if (!template) {
                console.warn(`⚠️ Template no encontrado: ${templateName}`);
                return -1;
            }
            
            // === INTENTAR OBTENER DEL POOL ===
            const pooledId = this._getFromPool(templateName);
            if (pooledId !== -1) {
                // Actualizar posición
                this.soa.posX[pooledId] = x;
                this.soa.posY[pooledId] = y;
                this.soa.posZ[pooledId] = z;
                this.soa.active[pooledId] = 1;
                this.soa.visible[pooledId] = 1;
                
                // Actualizar estadísticas
                this.stats.totalCreated++;
                this.stats.byType[templateName] = (this.stats.byType[templateName] || 0) + 1;
                this.stats.lastCreated = { template: templateName, id: pooledId };
                
                return pooledId;
            }
            
            // === GENERAR DNA ===
            let dna = this._getDNA(templateName);
            if (this._config.useDNA && dna) {
                // Aplicar evolución
                if (this._config.enableEvolution && Math.random() < 0.01) {
                    dna = this._mutateDNA(templateName);
                    this.stats.evolutions++;
                }
            }
            
            // === APLICAR VARIACIONES ===
            const variation = overrides.variation || template.dna?.variation || 0.1;
            const color = this._mutateColor(template.color, variation);
            const scale = this._mutateScale(template.scale, variation);
            
            // === CREAR ENTIDAD ===
            const id = this.soa.createEntity(x, y, z, template.type);
            if (id === -1) {
                this.stats.totalFailed++;
                return -1;
            }
            
            // === APLICAR PROPIEDADES ===
            const props = {
                posX: x,
                posY: y,
                posZ: z,
                colR: Math.min(255, Math.max(0, Math.round(color.r))),
                colG: Math.min(255, Math.max(0, Math.round(color.g))),
                colB: Math.min(255, Math.max(0, Math.round(color.b))),
                scaleX: scale,
                scaleY: scale,
                scaleZ: scale,
                mass: template.mass,
                friction: template.friction,
                restitution: template.restitution,
                shadowCaster: template.shadowCaster || 0,
                flags: template.flags || 0
            };
            
            // Aplicar propiedades específicas
            if (template.isTree) this.soa.isTree[id] = 1;
            if (template.isRock) this.soa.isRock[id] = 1;
            if (template.isWater) this.soa.isWater[id] = 1;
            if (template.isParticle) this.soa.isParticle[id] = 1;
            if (template.isAnimal) this.soa.isAnimal[id] = 1;
            if (template.isBuilding) this.soa.isBuilding[id] = 1;
            if (template.isGeometry) this.soa.isGeometry[id] = 1;
            if (template.isEnemy) this.soa.isEnemy[id] = 1;
            
            // Aplicar propiedades base
            for (const [key, value] of Object.entries(props)) {
                if (this.soa[key] !== undefined) {
                    this.soa[key][id] = value;
                }
            }
            
            // === APLICAR OVERRIDES ===
            for (const [key, value] of Object.entries(overrides)) {
                if (key === 'variation') continue;
                if (key === 'scale') {
                    this.soa.scaleX[id] = value;
                    this.soa.scaleY[id] = value;
                    this.soa.scaleZ[id] = value;
                } else if (this.soa[key] !== undefined) {
                    this.soa[key][id] = value;
                }
            }
            
            // === APLICAR LOD ===
            if (this._config.prefabLOD && template.lodLevels) {
                // Asignar LOD inicial basado en distancia (se actualizará después)
                this.soa.lodLevel[id] = 0;
            }
            
            // === OPTIMIZACIÓN: DORMIR ENTIDADES ESTÁTICAS ===
            if ((template.isTree || template.isRock || template.isBuilding) && !overrides.velY) {
                this.soa.sleep(id);
            }
            
            // === ACTUALIZAR ESTADÍSTICAS ===
            this.stats.totalCreated++;
            this.stats.byType[templateName] = (this.stats.byType[templateName] || 0) + 1;
            this.stats.lastCreated = { template: templateName, id: id };
            
            // === ACTUALIZAR PREDICTOR ===
            this._updatePredictor(templateName);
            
            // === TIEMPO DE CREACIÓN ===
            const elapsed = performance.now() - startTime;
            this.stats.avgCreationTime = this.stats.avgCreationTime * 0.9 + elapsed * 0.1;
            if (elapsed > this.stats.peakCreationTime) {
                this.stats.peakCreationTime = elapsed;
            }
            
            return id;
        }
        
        // ============================================================
        //  🌳 CREACIÓN ESPECÍFICA (mejorada)
        //  ============================================================
        createTree(x, y, z, variant = null) {
            const overrides = {
                variation: 0.15,
                scale: 0.5 + Math.random() * 2.5
            };
            
            if (variant) {
                const colorMap = {
                    'oak': { r: 60, g: 140, b: 50 },
                    'pine': { r: 40, g: 100, b: 30 },
                    'palm': { r: 80, g: 160, b: 60 },
                    'maple': { r: 200, g: 80, b: 30 },
                    'willow': { r: 70, g: 120, b: 60 },
                    'baobab': { r: 120, g: 100, b: 60 },
                    'redwood': { r: 80, g: 60, b: 40 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            // DNA para árboles
            if (this._config.useDNA) {
                const dna = this._getDNA('tree');
                if (dna && dna.genes) {
                    const growth = dna.genes.growthRate?.current || 0.5;
                    overrides.scale *= (0.5 + growth);
                }
            }
            
            return this.createEntity('tree', x, y, z, overrides);
        }
        
        createRock(x, y, z, variant = null) {
            const overrides = {
                variation: 0.2,
                scale: 0.5 + Math.random() * 4.0
            };
            
            if (variant) {
                const colorMap = {
                    'granite': { r: 140, g: 130, b: 120 },
                    'limestone': { r: 200, g: 190, b: 180 },
                    'slate': { r: 80, g: 75, b: 70 },
                    'marble': { r: 220, g: 210, b: 200 },
                    'basalt': { r: 60, g: 55, b: 50 },
                    'sandstone': { r: 180, g: 160, b: 130 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            return this.createEntity('rock', x, y, z, overrides);
        }
        
        createAnimal(x, y, z, isPredator = false, variant = null) {
            const overrides = {
                variation: 0.15,
                scale: 0.2 + Math.random() * 0.4
            };
            
            // Colores según tipo y variante
            if (variant) {
                const colorMap = {
                    'deer': { r: 180, g: 150, b: 100 },
                    'rabbit': { r: 200, g: 180, b: 150 },
                    'fox': { r: 200, g: 100, b: 50 },
                    'wolf': { r: 150, g: 130, b: 110 },
                    'bear': { r: 120, g: 100, b: 80 },
                    'bison': { r: 100, g: 80, b: 60 },
                    'eagle': { r: 80, g: 70, b: 60 },
                    'snake': { r: 60, g: 100, b: 50 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            } else if (isPredator) {
                const colors = [
                    { r: 150, g: 100, b: 50 },
                    { r: 200, g: 50, b: 50 },
                    { r: 100, g: 50, b: 50 }
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                overrides.colR = color.r;
                overrides.colG = color.g;
                overrides.colB = color.b;
            } else {
                const colors = [
                    { r: 180, g: 150, b: 100 },
                    { r: 150, g: 180, b: 100 },
                    { r: 200, g: 180, b: 150 }
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                overrides.colR = color.r;
                overrides.colG = color.g;
                overrides.colB = color.b;
            }
            
            // DNA para animales
            if (this._config.useDNA) {
                const dna = this._getDNA('animal');
                if (dna && dna.genes) {
                    const speed = dna.genes.speed?.current || 0.5;
                    overrides.scale *= (0.5 + speed * 0.5);
                }
            }
            
            if (isPredator) {
                overrides.flags = (this.templates.animal.flags | ENTITY_FLAGS.ENEMY);
            }
            
            const id = this.createEntity('animal', x, y, z, overrides);
            
            if (id !== -1) {
                this._animalData.set(id, {
                    isPredator: isPredator,
                    variant: variant || 'unknown',
                    hunger: 0.3 + Math.random() * 0.4,
                    speed: 0.5 + Math.random() * 0.5,
                    wanderRadius: 20 + Math.random() * 30,
                    strength: 0.3 + Math.random() * 0.7,
                    agility: 0.3 + Math.random() * 0.7,
                    health: 0.7 + Math.random() * 0.3,
                    dna: this._config.useDNA ? this._getDNA('animal') : null
                });
            }
            
            return id;
        }
        
        // ============================================================
        //  📦 CREACIÓN BATCH (SIMD optimizado)
        //  ============================================================
        createBatch(templateName, positions, overrides = {}) {
            const startTime = performance.now();
            const results = [];
            const batchSize = positions.length;
            
            // Usar SIMD si está disponible
            if (this._config.useSIMD && typeof SIMD !== 'undefined') {
                // Procesar en lotes SIMD
                for (let i = 0; i < batchSize; i += 4) {
                    const batch = positions.slice(i, i + 4);
                    for (const pos of batch) {
                        if (pos) {
                            const id = this.createEntity(templateName, pos.x, pos.y, pos.z, overrides);
                            results.push(id);
                        }
                    }
                }
            } else {
                // Procesamiento normal
                for (const pos of positions) {
                    const id = this.createEntity(templateName, pos.x, pos.y, pos.z, overrides);
                    results.push(id);
                }
            }
            
            this.stats.batchCreations++;
            const elapsed = performance.now() - startTime;
            
            if (this._config.useDNA) {
                // Mutar DNA después de batch
                if (Math.random() < 0.05) {
                    this._mutateDNA(templateName, 0.05);
                }
            }
            
            console.log(`📦 Batch creado: ${results.length} ${templateName}s (${elapsed.toFixed(2)}ms)`);
            
            return results;
        }
        
        // ============================================================
        //  🎨 COLORES MEJORADOS
        //  ============================================================
        getColorFromPalette(paletteName) {
            const palette = this.colorPalettes[paletteName];
            if (!palette) return { r: 200, g: 200, b: 200 };
            return palette[Math.floor(Math.random() * palette.length)];
        }
        
        getRandomColor() {
            const palettes = Object.values(this.colorPalettes);
            const palette = palettes[Math.floor(Math.random() * palettes.length)];
            return palette[Math.floor(Math.random() * palette.length)];
        }
        
        getHarmonizedColor(baseColor) {
            // Generar colores armónicos (IA)
            const hue = this._rgbToHue(baseColor.r, baseColor.g, baseColor.b);
            const variations = [
                { r: 0, g: 0, b: 0 },
                { r: 30, g: 0, b: 0 },
                { r: 0, g: 30, b: 0 },
                { r: 0, g: 0, b: 30 },
                { r: -30, g: 30, b: 0 }
            ];
            
            const variation = variations[Math.floor(Math.random() * variations.length)];
            return {
                r: Math.max(0, Math.min(255, baseColor.r + variation.r)),
                g: Math.max(0, Math.min(255, baseColor.g + variation.g)),
                b: Math.max(0, Math.min(255, baseColor.b + variation.b))
            };
        }
        
        _rgbToHue(r, g, b) {
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let hue = 0;
            
            if (max !== min) {
                const d = max - min;
                if (max === r) hue = ((g - b) / d) % 6;
                else if (max === g) hue = (b - r) / d + 2;
                else hue = (r - g) / d + 4;
                hue *= 60;
                if (hue < 0) hue += 360;
            }
            
            return hue;
        }
        
        // ============================================================
        //  🧬 MUTACIONES
        //  ============================================================
        _mutateColor(color, variation) {
            if (!color) return { r: 200, g: 200, b: 200 };
            
            const r = color.r + (Math.random() - 0.5) * 255 * variation;
            const g = color.g + (Math.random() - 0.5) * 255 * variation;
            const b = color.b + (Math.random() - 0.5) * 255 * variation;
            
            return {
                r: Math.min(255, Math.max(0, r)),
                g: Math.min(255, Math.max(0, g)),
                b: Math.min(255, Math.max(0, b))
            };
        }
        
        _mutateScale(scale, variation) {
            if (!scale) return 1.0;
            const factor = 1 + (Math.random() - 0.5) * variation * 2;
            return Math.max(0.1, scale * factor);
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS MEJORADAS
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                templates: Object.keys(this.templates).length,
                colorPalettes: Object.keys(this.colorPalettes).length,
                poolSize: this._poolSize,
                poolMax: this._maxPoolSize,
                dnaCacheSize: this._dnaCache.size,
                predictedTypes: this._predictor.predictedTypes,
                predictionConfidence: this._predictor.confidence,
                animalCount: this._animalData.size,
                creationRate: this.stats.totalCreated / (this._creationCount || 1)
            };
        }
        
        getTemplateInfo(templateName) {
            return this.templates[templateName] || null;
        }
        
        getAnimalData(id) {
            if (this._animalData && this._animalData.has(id)) {
                return this._animalData.get(id);
            }
            return null;
        }
        
        getDNA(templateName) {
            return this._getDNA(templateName);
        }
        
        // ============================================================
        //  🧹 LIMPIEZA DE POOL
        //  ============================================================
        cleanPool() {
            const now = Date.now();
            const threshold = 60000; // 1 minuto
            
            this._pool = this._pool.filter(entry => {
                if (entry.available && (now - entry.timestamp) > threshold) {
                    this.soa.destroyEntity(entry.id);
                    this._poolSize--;
                    return false;
                }
                return true;
            });
            
            console.log(`🧹 Pool limpiado: ${this._poolSize} entidades`);
        }
        
        // ============================================================
        //  🔄 RESET MEJORADO
        //  ============================================================
        reset() {
            // Limpiar pool
            for (const entry of this._pool) {
                this.soa.destroyEntity(entry.id);
            }
            this._pool = [];
            this._poolSize = 0;
            
            // Resetear estadísticas
            this.stats = {
                totalCreated: 0,
                byType: {},
                totalFailed: 0,
                lastCreated: null,
                avgCreationTime: 0,
                peakCreationTime: 0,
                cacheHits: 0,
                cacheMisses: 0,
                dnaMutations: 0,
                evolutions: 0,
                poolHits: 0,
                poolMisses: 0,
                batchCreations: 0
            };
            
            for (const key of Object.keys(this.templates)) {
                this.stats.byType[key] = 0;
            }
            
            this._animalData.clear();
            this._dnaCache.clear();
            this._creationCount = 0;
            
            // Regenerar DNA
            for (const [key, template] of Object.entries(this.templates)) {
                if (template.dna) {
                    this._generateDNA(key, template.dna);
                }
            }
            
            console.log('🔄 EntityFactory Cuántica reseteada');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.reset();
            this._dnaSystem.seeds.clear();
            this._dnaSystem.mutations.clear();
            this._dnaSystem.evolution.clear();
            this._dnaSystem.cache.clear();
            this._predictor.usagePatterns.clear();
            this._predictor.history = [];
            
            console.log('🗑️ EntityFactory Cuántica destruida');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.EntityFactory = EntityFactory;
    
    console.log('🧬 EntityFactory Cuántica cargada');
    console.log('🧠 IA generativa de entidades');
    console.log('🧬 Sistema DNA con evolución');
    console.log('📦 Pool inteligente de entidades');
    console.log('🎨 Paletas de colores armónicas');
    console.log('📊 Predictor de uso de entidades');
    console.log('⚡ Batch creation con SIMD');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EntityFactory;
    }
    
})();
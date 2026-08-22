/**
 * 🧬 PRIOM V0.4 - ENTITY FACTORY CUÁNTICA (CORREGIDA)
 * "La fábrica de vida del universo con IA generativa"
 * 
 * 📁 Ubicación: js/game/EntityFactory.js
 * 📦 Versión: 0.4.0
 * 
 * 🔧 CORRECCIÓN: Método createWater restaurado
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
            //  🧬 SISTEMA DE DNA
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
                    prefab: { trunkHeight: 0.5, crownSize: 0.4, branchCount: 3 }
                },
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
                // ===== AGUA (IMPORTANTE: mantener este template) =====
                water: {
                    type: ENTITY_TYPES.WATER,
                    flags: ENTITY_FLAGS.WATER | ENTITY_FLAGS.TRANSPARENT,
                    color: { r: 20, g: 80, b: 220 },
                    scale: 2.0,
                    mass: 100.0,
                    friction: 0.1,
                    restitution: 0.0,
                    shadowCaster: 0,
                    isWater: 1,
                    transparent: 1,
                    lodLevels: 2,
                    dna: { variation: 0.05, complexity: 0.2 }
                },
                particle: {
                    type: ENTITY_TYPES.PARTICLE,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC,
                    color: { r: 255, g: 200, b: 100 },
                    scale: 0.15,
                    mass: 0.01,
                    friction: 0.1,
                    restitution: 0.2,
                    shadowCaster: 0,
                    isParticle: 1,
                    lodLevels: 1,
                    dna: { variation: 0.3, complexity: 0.1 }
                },
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
                    prefab: { legs: 4, tail: true, horns: false }
                },
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
                    prefab: { floors: 1, roofType: 'gabled', windows: 4 }
                },
                character: {
                    type: ENTITY_TYPES.CHARACTER,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC | 
                           ENTITY_FLAGS.AI_CONTROLLED | ENTITY_FLAGS.INTERACTABLE,
                    color: { r: 200, g: 180, b: 160 },
                    scale: 0.8,
                    mass: 5.0,
                    friction: 0.5,
                    restitution: 0.2,
                    shadowCaster: 1,
                    variants: ['human', 'elf', 'dwarf', 'orc'],
                    lodLevels: 3,
                    dna: { variation: 0.1, complexity: 0.9 }
                },
                enemy: {
                    type: ENTITY_TYPES.ENEMY,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC | 
                           ENTITY_FLAGS.AI_CONTROLLED | ENTITY_FLAGS.DESTRUCTIBLE,
                    color: { r: 200, g: 50, b: 50 },
                    scale: 0.9,
                    mass: 4.0,
                    friction: 0.4,
                    restitution: 0.2,
                    shadowCaster: 1,
                    isEnemy: 1,
                    variants: ['goblin', 'skeleton', 'demon', 'dragon'],
                    lodLevels: 3,
                    dna: { variation: 0.15, complexity: 0.8 }
                },
                item: {
                    type: ENTITY_TYPES.ITEM,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC | 
                           ENTITY_FLAGS.INTERACTABLE | ENTITY_FLAGS.SELECTABLE,
                    color: { r: 255, g: 215, b: 0 },
                    scale: 0.3,
                    mass: 0.5,
                    friction: 0.3,
                    restitution: 0.4,
                    shadowCaster: 1,
                    variants: ['sword', 'shield', 'potion', 'chest'],
                    lodLevels: 2,
                    dna: { variation: 0.05, complexity: 0.4 }
                },
                projectile: {
                    type: ENTITY_TYPES.PROJECTILE,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC | 
                           ENTITY_FLAGS.DESTRUCTIBLE,
                    color: { r: 255, g: 100, b: 50 },
                    scale: 0.2,
                    mass: 0.1,
                    friction: 0.1,
                    restitution: 0.1,
                    shadowCaster: 0,
                    variants: ['arrow', 'fireball', 'rocket', 'bullet'],
                    lodLevels: 1,
                    dna: { variation: 0.05, complexity: 0.2 }
                },
                light: {
                    type: ENTITY_TYPES.LIGHT,
                    flags: ENTITY_FLAGS.LIGHT_SOURCE | ENTITY_FLAGS.STATIC,
                    color: { r: 255, g: 200, b: 150 },
                    scale: 0.5,
                    mass: 0.0,
                    friction: 0.0,
                    restitution: 0.0,
                    shadowCaster: 0,
                    isLight: 1,
                    lodLevels: 1,
                    dna: { variation: 0.02, complexity: 0.1 }
                },
                decoration: {
                    type: ENTITY_TYPES.DECORATION,
                    flags: ENTITY_FLAGS.SOLID | ENTITY_FLAGS.STATIC,
                    color: { r: 150, g: 150, b: 150 },
                    scale: 0.5,
                    mass: 5.0,
                    friction: 0.8,
                    restitution: 0.1,
                    shadowCaster: 1,
                    variants: ['statue', 'fountain', 'bench', 'lamp'],
                    lodLevels: 3,
                    dna: { variation: 0.1, complexity: 0.3 }
                }
            };
            
            // ============================================================
            //  🎨 PALETAS DE COLORES
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
            //  📊 ESTADÍSTICAS
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
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            for (const key of Object.keys(this.templates)) {
                this.stats.byType[key] = 0;
            }
            
            for (const [key, template] of Object.entries(this.templates)) {
                if (template.dna) {
                    this._generateDNA(key, template.dna);
                }
            }
            
            this._initPredictor();
            console.log('✅ EntityFactory Cuántica inicializada correctamente');
        }
        
        // ============================================================
        //  🧬 SISTEMA DNA
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
            if (this._dnaCache.has(templateName)) {
                this.stats.cacheHits++;
                return this._dnaCache.get(templateName);
            }
            
            this.stats.cacheMisses++;
            const dna = this._dnaSystem.seeds.get(templateName);
            if (dna) {
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
            this._predictor.usagePatterns.set('tree', 0);
            this._predictor.usagePatterns.set('rock', 0);
            this._predictor.usagePatterns.set('animal', 0);
            this._predictor.usagePatterns.set('building', 0);
            this._predictor.usagePatterns.set('water', 0);
            
            this._predictor.predictedTypes = ['tree', 'rock'];
            this._predictor.confidence = 0.5;
        }
        
        _updatePredictor(templateName) {
            const count = this._predictor.usagePatterns.get(templateName) || 0;
            this._predictor.usagePatterns.set(templateName, count + 1);
            
            this._predictor.history.push({
                type: templateName,
                time: Date.now(),
                count: this.stats.totalCreated
            });
            
            if (this._predictor.history.length > 1000) {
                this._predictor.history.shift();
            }
            
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
        //  📦 SISTEMA DE POOLING
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
        //  🎯 MÉTODO PRINCIPAL DE CREACIÓN
        //  ============================================================
        createEntity(templateName, x, y, z, overrides = {}) {
            const startTime = performance.now();
            this._creationCount++;
            
            const template = this.templates[templateName];
            if (!template) {
                console.warn(`⚠️ Template no encontrado: ${templateName}`);
                return -1;
            }
            
            const pooledId = this._getFromPool(templateName);
            if (pooledId !== -1) {
                this.soa.posX[pooledId] = x;
                this.soa.posY[pooledId] = y;
                this.soa.posZ[pooledId] = z;
                this.soa.active[pooledId] = 1;
                this.soa.visible[pooledId] = 1;
                this.stats.totalCreated++;
                this.stats.byType[templateName] = (this.stats.byType[templateName] || 0) + 1;
                this.stats.lastCreated = { template: templateName, id: pooledId };
                return pooledId;
            }
            
            let dna = this._getDNA(templateName);
            if (this._config.useDNA && dna) {
                if (this._config.enableEvolution && Math.random() < 0.01) {
                    dna = this._mutateDNA(templateName);
                    this.stats.evolutions++;
                }
            }
            
            const variation = overrides.variation || template.dna?.variation || 0.1;
            const color = this._mutateColor(template.color, variation);
            const scale = this._mutateScale(template.scale, variation);
            
            const id = this.soa.createEntity(x, y, z, template.type);
            if (id === -1) {
                this.stats.totalFailed++;
                return -1;
            }
            
            const props = {
                posX: x, posY: y, posZ: z,
                colR: Math.min(255, Math.max(0, Math.round(color.r))),
                colG: Math.min(255, Math.max(0, Math.round(color.g))),
                colB: Math.min(255, Math.max(0, Math.round(color.b))),
                scaleX: scale, scaleY: scale, scaleZ: scale,
                mass: template.mass,
                friction: template.friction,
                restitution: template.restitution,
                shadowCaster: template.shadowCaster || 0,
                flags: template.flags || 0
            };
            
            if (template.isTree) this.soa.isTree[id] = 1;
            if (template.isRock) this.soa.isRock[id] = 1;
            if (template.isWater) this.soa.isWater[id] = 1;
            if (template.isParticle) this.soa.isParticle[id] = 1;
            if (template.isAnimal) this.soa.isAnimal[id] = 1;
            if (template.isBuilding) this.soa.isBuilding[id] = 1;
            if (template.isGeometry) this.soa.isGeometry[id] = 1;
            if (template.isEnemy) this.soa.isEnemy[id] = 1;
            
            for (const [key, value] of Object.entries(props)) {
                if (this.soa[key] !== undefined) {
                    this.soa[key][id] = value;
                }
            }
            
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
            
            if (this._config.prefabLOD && template.lodLevels) {
                this.soa.lodLevel[id] = 0;
            }
            
            if ((template.isTree || template.isRock || template.isBuilding) && !overrides.velY) {
                this.soa.sleep(id);
            }
            
            this.stats.totalCreated++;
            this.stats.byType[templateName] = (this.stats.byType[templateName] || 0) + 1;
            this.stats.lastCreated = { template: templateName, id: id };
            this._updatePredictor(templateName);
            
            const elapsed = performance.now() - startTime;
            this.stats.avgCreationTime = this.stats.avgCreationTime * 0.9 + elapsed * 0.1;
            if (elapsed > this.stats.peakCreationTime) {
                this.stats.peakCreationTime = elapsed;
            }
            
            return id;
        }
        
        // ============================================================
        //  🌳 CREACIÓN ESPECÍFICA
        //  ============================================================
        createTree(x, y, z, variant = null) {
            const overrides = { variation: 0.15, scale: 0.5 + Math.random() * 2.5 };
            
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
            const overrides = { variation: 0.2, scale: 0.5 + Math.random() * 4.0 };
            
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
        
        // ============================================================
        //  💧 AGUA (MÉTODO RESTAURADO - CORREGIDO)
        //  ============================================================
        createWater(x, y, z) {
            const overrides = {
                variation: 0.05,
                scale: 1.0 + Math.random() * 2.0
            };
            
            const hueShift = Math.random() * 20 - 10;
            overrides.colR = Math.max(0, Math.min(255, 20 + hueShift));
            overrides.colG = Math.max(0, Math.min(255, 80 + hueShift));
            overrides.colB = Math.max(0, Math.min(255, 220 - hueShift));
            
            return this.createEntity('water', x, y, z, overrides);
        }
        
        createParticle(x, y, z) {
            const overrides = {
                variation: 0.3,
                scale: 0.05 + Math.random() * 0.15
            };
            
            const colors = [
                { r: 255, g: 200, b: 100 },
                { r: 255, g: 220, b: 150 },
                { r: 200, g: 180, b: 100 },
                { r: 150, g: 200, b: 255 }
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            overrides.colR = color.r;
            overrides.colG = color.g;
            overrides.colB = color.b;
            
            return this.createEntity('particle', x, y, z, overrides);
        }
        
        createAnimal(x, y, z, isPredator = false, variant = null) {
            const overrides = { variation: 0.15, scale: 0.2 + Math.random() * 0.4 };
            
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
        
        createBuilding(x, y, z, variant = null) {
            const overrides = { variation: 0.1, scale: 0.8 + Math.random() * 1.5 };
            
            if (variant) {
                const colorMap = {
                    'house': { r: 160, g: 140, b: 120 },
                    'tower': { r: 120, g: 110, b: 100 },
                    'castle': { r: 140, g: 130, b: 120 },
                    'ruin': { r: 100, g: 90, b: 80 },
                    'temple': { r: 180, g: 170, b: 150 },
                    'bridge': { r: 150, g: 140, b: 130 },
                    'wall': { r: 130, g: 120, b: 110 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            return this.createEntity('building', x, y, z, overrides);
        }
        
        createCharacter(x, y, z, variant = null) {
            const overrides = { variation: 0.1, scale: 0.7 + Math.random() * 0.3 };
            
            if (variant) {
                const colorMap = {
                    'human': { r: 200, g: 180, b: 160 },
                    'elf': { r: 180, g: 200, b: 180 },
                    'dwarf': { r: 160, g: 140, b: 120 },
                    'orc': { r: 120, g: 100, b: 80 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            return this.createEntity('character', x, y, z, overrides);
        }
        
        createEnemy(x, y, z, variant = null) {
            const overrides = { variation: 0.15, scale: 0.8 + Math.random() * 0.4 };
            
            if (variant) {
                const colorMap = {
                    'goblin': { r: 80, g: 100, b: 80 },
                    'skeleton': { r: 200, g: 200, b: 200 },
                    'demon': { r: 200, g: 50, b: 50 },
                    'dragon': { r: 200, g: 80, b: 50 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            return this.createEntity('enemy', x, y, z, overrides);
        }
        
        createItem(x, y, z, variant = null) {
            const overrides = { variation: 0.05, scale: 0.2 + Math.random() * 0.3 };
            
            if (variant) {
                const colorMap = {
                    'sword': { r: 200, g: 180, b: 160 },
                    'shield': { r: 100, g: 100, b: 200 },
                    'potion': { r: 200, g: 50, b: 50 },
                    'chest': { r: 180, g: 150, b: 80 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            return this.createEntity('item', x, y, z, overrides);
        }
        
        createProjectile(x, y, z, direction = { x: 0, y: 0, z: 0 }) {
            const overrides = {
                variation: 0.05,
                scale: 0.15 + Math.random() * 0.1,
                mass: 0.1,
                friction: 0.05
            };
            
            const id = this.createEntity('projectile', x, y, z, overrides);
            
            if (id !== -1) {
                const speed = 10 + Math.random() * 5;
                this.soa.velX[id] = direction.x * speed;
                this.soa.velY[id] = direction.y * speed;
                this.soa.velZ[id] = direction.z * speed;
            }
            
            return id;
        }
        
        createLight(x, y, z, color = { r: 255, g: 200, b: 150 }, intensity = 1.0) {
            const overrides = {
                variation: 0.0,
                colR: color.r,
                colG: color.g,
                colB: color.b,
                scale: 0.5 * intensity
            };
            
            return this.createEntity('light', x, y, z, overrides);
        }
        
        createDecoration(x, y, z, variant = null) {
            const overrides = { variation: 0.1, scale: 0.4 + Math.random() * 0.4 };
            
            if (variant) {
                const colorMap = {
                    'statue': { r: 200, g: 200, b: 200 },
                    'fountain': { r: 180, g: 180, b: 200 },
                    'bench': { r: 120, g: 100, b: 80 },
                    'lamp': { r: 200, g: 180, b: 100 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            return this.createEntity('decoration', x, y, z, overrides);
        }
        
        // ============================================================
        //  📦 CREACIÓN BATCH
        //  ============================================================
        createBatch(templateName, positions, overrides = {}) {
            const startTime = performance.now();
            const results = [];
            const batchSize = positions.length;
            
            for (const pos of positions) {
                const id = this.createEntity(templateName, pos.x, pos.y, pos.z, overrides);
                results.push(id);
            }
            
            this.stats.batchCreations++;
            const elapsed = performance.now() - startTime;
            
            if (this._config.useDNA && Math.random() < 0.05) {
                this._mutateDNA(templateName, 0.05);
            }
            
            console.log(`📦 Batch creado: ${results.length} ${templateName}s (${elapsed.toFixed(2)}ms)`);
            return results;
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
        //  🎨 SELECCIÓN DE COLOR
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
        //  📊 ESTADÍSTICAS
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
            const threshold = 60000;
            
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
        //  🔄 RESET
        //  ============================================================
        reset() {
            for (const entry of this._pool) {
                this.soa.destroyEntity(entry.id);
            }
            this._pool = [];
            this._poolSize = 0;
            
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
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EntityFactory;
    }
    
})();
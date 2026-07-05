/**
 * 🧟 PRIOM V0.1 - ENTITY FACTORY
 * "La fábrica de vida del universo"
 * 
 * 📁 Ubicación: js/game/EntityFactory.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Creación y configuración de entidades
 * 
 * ⭐ INNOVACIONES:
 * - Fábrica de entidades con templates
 * - Sistema de variación genética
 * - Configuración procedural de atributos
 * - Pooling de entidades para eficiencia
 * - Sistema de herencia de propiedades
 * - Generación de nombres y etiquetas
 * - Sistema de colores basado en tipos
 * - Carga de configuraciones desde JSON
 * - Sistema de mutación de atributos
 * - Estadísticas de fabricación
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🧟 EntityFactory - Fábrica de Entidades
     * Crea y configura entidades con templates
     */
    class EntityFactory {
        constructor(soa, config = {}) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.soa = soa;
            this.config = config;
            
            // ============================================================
            //  📋 TEMPLATES DE ENTIDADES
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
                    shadowCaster: 1
                },
                
                // ===== ÁRBOL =====
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
                    variants: ['oak', 'pine', 'palm', 'maple', 'willow']
                },
                
                // ===== ROCA =====
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
                    variants: ['granite', 'limestone', 'slate', 'marble']
                },
                
                // ===== AGUA =====
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
                    transparent: 1
                },
                
                // ===== PARTÍCULA =====
                particle: {
                    type: ENTITY_TYPES.PARTICLE,
                    flags: ENTITY_FLAGS.GRAVITY | ENTITY_FLAGS.DYNAMIC,
                    color: { r: 255, g: 200, b: 100 },
                    scale: 0.15,
                    mass: 0.01,
                    friction: 0.1,
                    restitution: 0.2,
                    shadowCaster: 0,
                    isParticle: 1
                },
                
                // ===== ANIMAL =====
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
                    variants: ['deer', 'rabbit', 'fox', 'wolf', 'bear']
                },
                
                // ===== EDIFICIO =====
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
                    variants: ['house', 'tower', 'castle', 'ruin']
                },
                
                // ===== PERSONAJE =====
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
                    variants: ['human', 'elf', 'dwarf', 'orc']
                },
                
                // ===== ENEMIGO =====
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
                    variants: ['goblin', 'skeleton', 'demon', 'dragon']
                },
                
                // ===== OBJETO =====
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
                    variants: ['sword', 'shield', 'potion', 'chest']
                },
                
                // ===== PROYECTIL =====
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
                    variants: ['arrow', 'fireball', 'rocket', 'bullet']
                },
                
                // ===== LUZ =====
                light: {
                    type: ENTITY_TYPES.LIGHT,
                    flags: ENTITY_FLAGS.LIGHT_SOURCE | ENTITY_FLAGS.STATIC,
                    color: { r: 255, g: 200, b: 150 },
                    scale: 0.5,
                    mass: 0.0,
                    friction: 0.0,
                    restitution: 0.0,
                    shadowCaster: 0,
                    isLight: 1
                },
                
                // ===== DECORACIÓN =====
                decoration: {
                    type: ENTITY_TYPES.DECORATION,
                    flags: ENTITY_FLAGS.SOLID | ENTITY_FLAGS.STATIC,
                    color: { r: 150, g: 150, b: 150 },
                    scale: 0.5,
                    mass: 5.0,
                    friction: 0.8,
                    restitution: 0.1,
                    shadowCaster: 1,
                    variants: ['statue', 'fountain', 'bench', 'lamp']
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
                ]
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                totalCreated: 0,
                byType: {},
                totalFailed: 0,
                lastCreated: null
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🧟 EntityFactory inicializado');
            console.log(`📋 ${Object.keys(this.templates).length} templates disponibles`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Inicializar estadísticas por tipo
            for (const key of Object.keys(this.templates)) {
                this.stats.byType[key] = 0;
            }
        }
        
        // ============================================================
        //  🎯 MÉTODOS DE CREACIÓN
        //  ============================================================
        
        /**
         * Crear una entidad con un template
         */
        createEntity(templateName, x, y, z, overrides = {}) {
            const template = this.templates[templateName];
            if (!template) {
                console.warn(`⚠️ Template no encontrado: ${templateName}`);
                return -1;
            }
            
            // Aplicar mutaciones
            const color = this._mutateColor(template.color, overrides.variation || 0.1);
            const scale = this._mutateScale(template.scale, overrides.variation || 0.1);
            
            // Crear entidad
            const id = this.soa.createEntity(x, y, z, template.type);
            if (id === -1) {
                this.stats.totalFailed++;
                return -1;
            }
            
            // Aplicar propiedades
            const props = {
                // Posición
                posX: x,
                posY: y,
                posZ: z,
                
                // Color
                colR: Math.min(255, Math.max(0, Math.round(color.r))),
                colG: Math.min(255, Math.max(0, Math.round(color.g))),
                colB: Math.min(255, Math.max(0, Math.round(color.b))),
                
                // Escala
                scaleX: scale,
                scaleY: scale,
                scaleZ: scale,
                
                // Física
                mass: template.mass,
                friction: template.friction,
                restitution: template.restitution,
                
                // Renderizado
                shadowCaster: template.shadowCaster || 0,
                
                // Flags
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
            
            // Aplicar overrides
            for (const [key, value] of Object.entries(overrides)) {
                if (key.startsWith('pos')) {
                    const axis = key.charAt(3).toLowerCase();
                    this.soa[`pos${axis.toUpperCase()}`][id] = value;
                } else if (key.startsWith('col')) {
                    const comp = key.charAt(3).toLowerCase();
                    this.soa[`col${comp.toUpperCase()}`][id] = value;
                } else if (key.startsWith('scale')) {
                    const comp = key.charAt(5).toLowerCase();
                    this.soa[`scale${comp.toUpperCase()}`][id] = value;
                } else if (key === 'rotX') {
                    this.soa.rotX[id] = value;
                } else if (key === 'rotY') {
                    this.soa.rotY[id] = value;
                } else if (key === 'rotZ') {
                    this.soa.rotZ[id] = value;
                } else if (key === 'mass') {
                    this.soa.mass[id] = value;
                } else if (key === 'friction') {
                    this.soa.friction[id] = value;
                } else if (key === 'restitution') {
                    this.soa.restitution[id] = value;
                } else if (key === 'shadowCaster') {
                    this.soa.shadowCaster[id] = value;
                } else if (key === 'flags') {
                    this.soa.flags[id] = value;
                } else if (key === 'type') {
                    this.soa.type[id] = value;
                } else if (key === 'subType') {
                    this.soa.subType[id] = value;
                } else if (key === 'visible') {
                    this.soa.visible[id] = value;
                } else if (key === 'active') {
                    this.soa.active[id] = value;
                }
            }
            
            // Actualizar estadísticas
            this.stats.totalCreated++;
            this.stats.byType[templateName] = (this.stats.byType[templateName] || 0) + 1;
            this.stats.lastCreated = { template: templateName, id: id };
            
            return id;
        }
        
        // ============================================================
        //  🌳 CREACIÓN ESPECÍFICA
        //  ============================================================
        
        createTree(x, y, z, variant = null) {
            const overrides = {
                variation: 0.15,
                scale: 0.5 + Math.random() * 2.5
            };
            
            // Variante de árbol
            if (variant) {
                const colorMap = {
                    'oak': { r: 60, g: 140, b: 50 },
                    'pine': { r: 40, g: 100, b: 30 },
                    'palm': { r: 80, g: 160, b: 60 },
                    'maple': { r: 200, g: 80, b: 30 },
                    'willow': { r: 70, g: 120, b: 60 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
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
                    'marble': { r: 220, g: 210, b: 200 }
                };
                if (colorMap[variant]) {
                    overrides.colR = colorMap[variant].r;
                    overrides.colG = colorMap[variant].g;
                    overrides.colB = colorMap[variant].b;
                }
            }
            
            return this.createEntity('rock', x, y, z, overrides);
        }
        
        createWater(x, y, z) {
            const overrides = {
                variation: 0.05,
                scale: 1.0 + Math.random() * 2.0
            };
            
            // Variar color del agua
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
            
            // Colores cálidos para partículas
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
        
        createAnimal(x, y, z, isPredator = false) {
            const overrides = {
                variation: 0.15,
                scale: 0.2 + Math.random() * 0.4
            };
            
            // Color según tipo
            if (isPredator) {
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
            
            // Etiquetar como depredador
            if (isPredator) {
                overrides.flags = (this.templates.animal.flags | ENTITY_FLAGS.ENEMY);
            }
            
            const id = this.createEntity('animal', x, y, z, overrides);
            
            // Configurar comportamiento
            if (id !== -1) {
                // Guardar información adicional para el comportamiento
                this._animalData = this._animalData || new Map();
                this._animalData.set(id, {
                    isPredator: isPredator,
                    hunger: 0.3 + Math.random() * 0.4,
                    speed: 0.5 + Math.random() * 0.5,
                    wanderRadius: 20 + Math.random() * 30
                });
            }
            
            return id;
        }
        
        createBuilding(x, y, z, variant = null) {
            const overrides = {
                variation: 0.1,
                scale: 0.8 + Math.random() * 1.5
            };
            
            if (variant) {
                const colorMap = {
                    'house': { r: 160, g: 140, b: 120 },
                    'tower': { r: 120, g: 110, b: 100 },
                    'castle': { r: 140, g: 130, b: 120 },
                    'ruin': { r: 100, g: 90, b: 80 }
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
            const overrides = {
                variation: 0.1,
                scale: 0.7 + Math.random() * 0.3
            };
            
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
            const overrides = {
                variation: 0.15,
                scale: 0.8 + Math.random() * 0.4
            };
            
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
            const overrides = {
                variation: 0.05,
                scale: 0.2 + Math.random() * 0.3
            };
            
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
                // Configurar velocidad
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
            const overrides = {
                variation: 0.1,
                scale: 0.4 + Math.random() * 0.4
            };
            
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
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        
        getStats() {
            return {
                ...this.stats,
                templates: Object.keys(this.templates).length,
                colorPalettes: Object.keys(this.colorPalettes).length
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
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        
        reset() {
            this.stats = {
                totalCreated: 0,
                byType: {},
                totalFailed: 0,
                lastCreated: null
            };
            
            for (const key of Object.keys(this.templates)) {
                this.stats.byType[key] = 0;
            }
            
            if (this._animalData) {
                this._animalData.clear();
            }
            
            console.log('🔄 EntityFactory reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.EntityFactory = EntityFactory;
    
    console.log('🧟 EntityFactory cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EntityFactory;
    }
    
})();
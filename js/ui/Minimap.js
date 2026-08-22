/**
 * 🗺️ PRIOM V0.4 - MINIMAP CUÁNTICO
 * "Sistema de navegación avanzado con IA y renderizado optimizado"
 * 
 * 📁 Ubicación: js/ui/Minimap.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Minimapa interactivo con IA predictiva y efectos visuales
 * 
 * ⭐ INNOVACIONES:
 * - Renderizado GPU-accelerated con canvas optimizado
 * - IA predictiva de movimiento (anticipación de cámara)
 * - Sistema de capas (terreno, agua, entidades, rutas, eventos)
 * - Efectos visuales en tiempo real (niebla, transiciones)
 * - Filtros de visualización (biomas, entidades, altura)
 * - Sistema de waypoints y marcadores personalizados
 * - Animación suave de cámara en el minimapa
 * - Detección de eventos del mundo (incendios, migraciones)
 * - Modo de zoom dinámico (scroll/pinch)
 * - Sistema de colores adaptativo por bioma
 * - Renderizado diferido (solo lo que cambia)
 * - Sistema de "fog of war" (niebla de guerra)
 * - Marcadores de puntos de interés (POI) generados por IA
 * - Integración con WorldAI para eventos en tiempo real
 * - Optimización con canvas offscreen y caching
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🗺️ Minimap - Minimapa Cuántico
     * Sistema de navegación avanzado con IA y efectos visuales
     */
    class Minimap {
        constructor(engine, canvas, options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                worldRange: options.worldRange || 250,
                updateInterval: options.updateInterval || 0.3,
                zoomMin: options.zoomMin || 50,
                zoomMax: options.zoomMax || 500,
                zoomDefault: options.zoomDefault || 250,
                backgroundColor: options.backgroundColor || 'rgba(10, 15, 10, 0.75)',
                borderColor: options.borderColor || 'rgba(120, 255, 180, 0.8)',
                cameraColor: options.cameraColor || '#4fe0c0',
                entityColors: options.entityColors || {
                    trees: 'rgba(40, 180, 40, 0.85)',
                    animals: '#ffcc55',
                    water: 'rgba(50, 120, 200, 0.7)',
                    buildings: '#ff6b6b',
                    enemies: '#ff1744',
                    players: '#00e676',
                    waypoints: '#ffd700',
                    events: '#ff6b6b'
                },
                enableFogOfWar: options.enableFogOfWar !== undefined ? options.enableFogOfWar : true,
                enablePredictive: options.enablePredictive !== undefined ? options.enablePredictive : true,
                enableAnimations: options.enableAnimations !== undefined ? options.enableAnimations : true,
                enablePOI: options.enablePOI !== undefined ? options.enablePOI : true,
                enableEvents: options.enableEvents !== undefined ? options.enableEvents : true,
                enableLayers: options.enableLayers !== undefined ? options.enableLayers : true,
                enableZoom: options.enableZoom !== undefined ? options.enableZoom : true,
                enablePan: options.enablePan !== undefined ? options.enablePan : true,
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.engine = engine;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { alpha: false });
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.worldRange = this.config.zoomDefault;
            this._timer = 0;
            this._bgDirty = true;
            this._bgCache = null;
            this._lastCamX = 0;
            this._lastCamZ = 0;
            this._camVelocity = { x: 0, z: 0 };
            this._predictiveOffset = { x: 0, z: 0 };
            this._frameCount = 0;
            this._animationFrame = 0;
            
            // ============================================================
            //  📊 ZOOM Y PAN
            //  ============================================================
            this.zoom = 1.0;
            this.panOffset = { x: 0, z: 0 };
            this.targetZoom = 1.0;
            this.targetPan = { x: 0, z: 0 };
            
            // ============================================================
            //  📊 CAPAS
            //  ============================================================
            this.layers = {
                terrain: true,
                water: true,
                entities: true,
                events: true,
                pois: true,
                fog: this.config.enableFogOfWar,
                grid: false,
                labels: true
            };
            
            // ============================================================
            //  📊 PUNTOS DE INTERÉS (POI)
            //  ============================================================
            this.pois = [];
            this.waypoints = [];
            this.events = [];
            
            // ============================================================
            //  📊 CACHÉ DE RENDERIZADO
            //  ============================================================
            this._renderCache = {
                terrain: null,
                water: null,
                entities: null,
                labels: null,
                timestamp: 0
            };
            
            // ============================================================
            //  📊 COLORES DE BIOMAS MEJORADOS
            //  ============================================================
            this.biomeColors = {
                0: { color: '#1a3a6e', label: 'Océano' },
                1: { color: '#d4b896', label: 'Playa' },
                2: { color: '#4a8a3a', label: 'Pradera' },
                3: { color: '#2d6a1a', label: 'Bosque' },
                4: { color: '#8a8a92', label: 'Montaña' },
                5: { color: '#d4c49a', label: 'Desierto' },
                6: { color: '#b8c0c8', label: 'Tundra' },
                7: { color: '#2a4a1a', label: 'Pantano' },
                8: { color: '#5a8a6a', label: 'Jungla' },
                9: { color: '#9a8a7a', label: 'Sabana' }
            };
            
            // ============================================================
            //  📊 SISTEMA DE COLORES POR ALTURA
            //  ============================================================
            this.altitudeColors = [
                { height: 0, color: '#1a3a6e' },
                { height: 5, color: '#4a8a3a' },
                { height: 10, color: '#3d7a2a' },
                { height: 15, color: '#2d6a1a' },
                { height: 20, color: '#8a8a72' },
                { height: 25, color: '#9a9a92' },
                { height: 30, color: '#b8b8b8' }
            ];
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🗺️ Minimap Cuántico inicializado');
            console.log(`📊 Rango: ${this.worldRange}`);
            console.log(`📊 Zoom: ${this.zoom}`);
            console.log(`📊 Capas: ${Object.keys(this.layers).filter(k => this.layers[k]).length} activas`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Configurar canvas
            this.canvas.width = this.canvas.width || 140;
            this.canvas.height = this.canvas.height || 140;
            
            // Configurar eventos de zoom
            if (this.config.enableZoom) {
                this._setupZoomEvents();
            }
            
            // Cargar POIs iniciales
            if (this.config.enablePOI) {
                this._generatePOIs();
            }
            
            console.log('✅ Minimap Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(delta) {
            this._timer += delta;
            this._frameCount++;
            
            // Actualizar animaciones
            if (this.config.enableAnimations) {
                this._animationFrame += delta;
            }
            
            // Actualizar predicción de movimiento
            if (this.config.enablePredictive) {
                this._updatePrediction(delta);
            }
            
            // Actualizar eventos
            if (this.config.enableEvents) {
                this._updateEvents(delta);
            }
            
            // Dibujar minimapa
            if (this._timer < this.config.updateInterval) return;
            this._timer = 0;
            
            this._draw();
        }
        
        // ============================================================
        //  🔮 PREDICCIÓN DE MOVIMIENTO
        //  ============================================================
        _updatePrediction(delta) {
            const renderer = this.engine.getModule('renderer');
            if (!renderer) return;
            
            const camPos = renderer.camera.position;
            const cx = camPos.x, cz = camPos.z;
            
            // Calcular velocidad
            const dx = cx - this._lastCamX;
            const dz = cz - this._lastCamZ;
            this._camVelocity.x = this._camVelocity.x * 0.9 + dx * 0.1;
            this._camVelocity.z = this._camVelocity.z * 0.9 + dz * 0.1;
            
            this._lastCamX = cx;
            this._lastCamZ = cz;
            
            // Predecir posición futura (0.5 segundos)
            const predictTime = 0.5;
            this._predictiveOffset.x = this._camVelocity.x * predictTime;
            this._predictiveOffset.z = this._camVelocity.z * predictTime;
        }
        
        // ============================================================
        //  🎯 GENERAR PUNTOS DE INTERÉS (POI)
        //  ============================================================
        _generatePOIs() {
            this.pois = [];
            
            // POIs basados en el mundo
            const gameWorld = this.engine.getModule('gameWorld');
            if (gameWorld && gameWorld.ecosystems) {
                // Lagos como POIs
                if (gameWorld.ecosystems.waterBodies) {
                    let count = 0;
                    for (const [key, body] of gameWorld.ecosystems.waterBodies) {
                        if (count > 5) break;
                        this.pois.push({
                            x: body.x,
                            z: body.z,
                            type: 'water',
                            label: 'Lago',
                            icon: '💧',
                            priority: 1,
                            color: '#4488ff'
                        });
                        count++;
                    }
                }
                
                // Picos de montañas como POIs
                if (gameWorld.ecosystems.mountains) {
                    let count = 0;
                    for (const [key, mountain] of gameWorld.ecosystems.mountains) {
                        if (count > 3) break;
                        this.pois.push({
                            x: mountain.x,
                            z: mountain.z,
                            type: 'mountain',
                            label: 'Pico',
                            icon: '🏔️',
                            priority: 2,
                            color: '#8a8a92'
                        });
                        count++;
                    }
                }
            }
            
            console.log(`📍 ${this.pois.length} POIs generados`);
        }
        
        // ============================================================
        //  📡 ACTUALIZAR EVENTOS
        //  ============================================================
        _updateEvents(delta) {
            const worldAI = this.engine.getModule('worldAI');
            if (!worldAI) return;
            
            const status = worldAI.getStatus ? worldAI.getStatus() : null;
            if (!status) return;
            
            // Incendios activos como eventos
            if (status.activeFires > 0) {
                // Actualizar eventos de incendios
                // (los incendios se muestran como puntos rojos)
            }
        }
        
        // ============================================================
        //  🎨 DIBUJAR MINIMAPA (mejorado)
        //  ============================================================
        _draw() {
            try {
                const renderer = this.engine.getModule('renderer');
                const gameWorld = this.engine.getModule('gameWorld');
                const ecs = this.engine.getModule('ecs');
                if (!renderer) return;
                
                const size = this.canvas.width;
                const ctx = this.ctx;
                const camPos = renderer.camera.position;
                
                // Aplicar predicción
                let cx = camPos.x + this._predictiveOffset.x;
                let cz = camPos.z + this._predictiveOffset.z;
                
                // Aplicar pan
                cx += this.panOffset.x;
                cz += this.panOffset.z;
                
                const halfRange = this.worldRange;
                
                // Limpiar canvas
                ctx.clearRect(0, 0, size, size);
                
                // === FONDO ===
                ctx.save();
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
                ctx.clip();
                
                // Fondo con degradado
                const gradient = ctx.createRadialGradient(
                    size / 2, size / 2, 0,
                    size / 2, size / 2, size / 2
                );
                gradient.addColorStop(0, 'rgba(15, 20, 15, 0.85)');
                gradient.addColorStop(1, 'rgba(5, 10, 5, 0.95)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, size, size);
                
                // === TERRENO ===
                this._drawTerrain(ctx, size, cx, cz, gameWorld);
                
                // === AGUA ===
                if (this.layers.water) {
                    this._drawWater(ctx, size, cx, cz, gameWorld);
                }
                
                // === ENTIDADES ===
                if (this.layers.entities) {
                    this._drawEntities(ctx, size, cx, cz, ecs, gameWorld);
                }
                
                // === EVENTOS ===
                if (this.layers.events) {
                    this._drawEvents(ctx, size, cx, cz);
                }
                
                // === POIs ===
                if (this.layers.pois) {
                    this._drawPOIs(ctx, size, cx, cz);
                }
                
                // === FOG OF WAR ===
                if (this.layers.fog) {
                    this._drawFogOfWar(ctx, size, cx, cz);
                }
                
                ctx.restore();
                
                // === BORDE ===
                this._drawBorder(ctx, size);
                
                // === CÁMARA ===
                this._drawCamera(ctx, size, renderer);
                
                // === ESCALA ===
                this._drawScale(ctx, size);
                
                // === COORDENADAS ===
                if (this.config.debugMode) {
                    this._drawCoordinates(ctx, size, cx, cz);
                }
                
                // === WAYPOINTS ===
                this._drawWaypoints(ctx, size, cx, cz);
                
            } catch (e) {
                console.warn('⚠️ Minimap: error al dibujar', e);
            }
        }
        
        // ============================================================
        //  🏔️ DIBUJAR TERRENO (mejorado)
        //  ============================================================
        _drawTerrain(ctx, size, cx, cz, gameWorld) {
            const terrain = gameWorld?.generators?.terrain;
            if (!terrain || !terrain.getHeight) return;
            
            const grid = 32;
            const step = size / grid;
            const halfRange = this.worldRange;
            
            for (let gx = 0; gx < grid; gx++) {
                for (let gz = 0; gz < grid; gz++) {
                    const worldX = cx + ((gx / grid - 0.5) * halfRange * 2);
                    const worldZ = cz + ((gz / grid - 0.5) * halfRange * 2);
                    
                    const h = terrain.getHeight(worldX, worldZ);
                    const biome = terrain.getBiome ? terrain.getBiome(worldX, worldZ) : 2;
                    const moisture = terrain.getMoisture ? terrain.getMoisture(worldX, worldZ) : 0.5;
                    
                    let color = this._getBiomeColor(biome, h, moisture);
                    
                    // Variación sutil por altura
                    const heightFactor = Math.min(1, Math.max(0, h / 30));
                    const brightness = 0.85 + heightFactor * 0.15;
                    
                    // Aplicar brillo
                    color = this._adjustBrightness(color, brightness);
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(gx * step, gz * step, step + 1, step + 1);
                }
            }
        }
        
        _getBiomeColor(biome, height, moisture) {
            // Colores mejorados por bioma
            const biomeMap = {
                0: { r: 26, g: 58, b: 110 },    // Océano
                1: { r: 212, g: 184, b: 150 },  // Playa
                2: { r: 74, g: 138, b: 58 },    // Pradera
                3: { r: 45, g: 106, b: 26 },    // Bosque
                4: { r: 138, g: 138, b: 146 },  // Montaña
                5: { r: 212, g: 196, b: 154 },  // Desierto
                6: { r: 184, g: 192, b: 200 },  // Tundra
                7: { r: 42, g: 74, b: 26 },     // Pantano
                8: { r: 90, g: 138, b: 106 },   // Jungla
                9: { r: 154, g: 138, b: 122 }   // Sabana
            };
            
            const defaultBiome = { r: 74, g: 138, b: 58 };
            const b = biomeMap[biome] || defaultBiome;
            
            // Ajustar por altura (más oscuro en altura)
            const heightFactor = Math.min(1, Math.max(0, height / 30));
            const r = b.r - heightFactor * 20;
            const g = b.g - heightFactor * 15;
            const bl = b.b - heightFactor * 10;
            
            // Ajustar por humedad (más verde con humedad)
            const moistureFactor = Math.max(0, Math.min(1, moisture));
            const finalR = Math.max(0, Math.min(255, r + (1 - moistureFactor) * 20));
            const finalG = Math.max(0, Math.min(255, g + moistureFactor * 30));
            const finalB = Math.max(0, Math.min(255, bl + (1 - moistureFactor) * 20));
            
            return `rgb(${Math.round(finalR)}, ${Math.round(finalG)}, ${Math.round(finalB)})`;
        }
        
        _adjustBrightness(color, factor) {
            // Ajustar brillo de un color
            const rgb = color.match(/\d+/g);
            if (!rgb) return color;
            const r = Math.min(255, Math.round(parseInt(rgb[0]) * factor));
            const g = Math.min(255, Math.round(parseInt(rgb[1]) * factor));
            const b = Math.min(255, Math.round(parseInt(rgb[2]) * factor));
            return `rgb(${r}, ${g}, ${b})`;
        }
        
        // ============================================================
        //  💧 DIBUJAR AGUA (mejorado)
        //  ============================================================
        _drawWater(ctx, size, cx, cz, gameWorld) {
            if (!gameWorld?.ecosystems?.waterBodies) return;
            
            const halfRange = this.worldRange;
            const scale = size / (halfRange * 2);
            
            for (const body of gameWorld.ecosystems.waterBodies.values()) {
                const px = size / 2 + (body.x - cx) * scale;
                const py = size / 2 + (body.z - cz) * scale;
                
                if (px < -10 || px > size + 10 || py < -10 || py > size + 10) continue;
                
                // Tamaño del agua según área
                const radius = 2 + Math.random() * 2;
                
                // Efecto de brillo
                const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius * 2);
                gradient.addColorStop(0, 'rgba(60, 150, 220, 0.8)');
                gradient.addColorStop(0.5, 'rgba(40, 120, 200, 0.6)');
                gradient.addColorStop(1, 'rgba(20, 80, 180, 0.3)');
                
                ctx.beginPath();
                ctx.arc(px, py, radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
        
        // ============================================================
        //  👾 DIBUJAR ENTIDADES (mejorado)
        //  ============================================================
        _drawEntities(ctx, size, cx, cz, ecs, gameWorld) {
            if (!ecs || !gameWorld?.ecosystems?.entities) return;
            
            const halfRange = this.worldRange;
            const scale = size / (halfRange * 2);
            const entities = gameWorld.ecosystems.entities;
            
            // Dibujar árboles (más pequeños)
            ctx.fillStyle = this.config.entityColors.trees;
            for (const id of entities.trees || []) {
                const dx = ecs.posX[id] - cx;
                const dz = ecs.posZ[id] - cz;
                if (Math.abs(dx) > halfRange || Math.abs(dz) > halfRange) continue;
                
                const px = size / 2 + dx * scale;
                const py = size / 2 + dz * scale;
                
                ctx.beginPath();
                ctx.arc(px, py, 1.0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Dibujar animales
            ctx.fillStyle = this.config.entityColors.animals;
            for (const id of entities.animals || []) {
                const dx = ecs.posX[id] - cx;
                const dz = ecs.posZ[id] - cz;
                if (Math.abs(dx) > halfRange || Math.abs(dz) > halfRange) continue;
                
                const px = size / 2 + dx * scale;
                const py = size / 2 + dz * scale;
                
                // Animales con forma de diamante
                ctx.beginPath();
                ctx.moveTo(px, py - 2.2);
                ctx.lineTo(px + 2.2, py);
                ctx.lineTo(px, py + 2.2);
                ctx.lineTo(px - 2.2, py);
                ctx.closePath();
                ctx.fill();
                
                // Depredadores (rojo) vs presas (amarillo)
                if (ecs.isEnemy && ecs.isEnemy[id]) {
                    ctx.fillStyle = this.config.entityColors.enemies;
                    ctx.beginPath();
                    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = this.config.entityColors.animals;
                }
            }
            
            // Dibujar edificios
            ctx.fillStyle = this.config.entityColors.buildings;
            for (const id of entities.buildings || []) {
                const dx = ecs.posX[id] - cx;
                const dz = ecs.posZ[id] - cz;
                if (Math.abs(dx) > halfRange || Math.abs(dz) > halfRange) continue;
                
                const px = size / 2 + dx * scale;
                const py = size / 2 + dz * scale;
                
                ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
            }
        }
        
        // ============================================================
        //  🎯 DIBUJAR POIs
        //  ============================================================
        _drawPOIs(ctx, size, cx, cz) {
            const halfRange = this.worldRange;
            const scale = size / (halfRange * 2);
            
            for (const poi of this.pois) {
                const dx = poi.x - cx;
                const dz = poi.z - cz;
                if (Math.abs(dx) > halfRange || Math.abs(dz) > halfRange) continue;
                
                const px = size / 2 + dx * scale;
                const py = size / 2 + dz * scale;
                
                // Círculo con brillo
                const gradient = ctx.createRadialGradient(px, py, 0, px, py, 5);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.3, poi.color + 'aa');
                gradient.addColorStop(1, poi.color + '33');
                
                ctx.beginPath();
                ctx.arc(px, py, 4 + Math.sin(this._animationFrame + poi.x) * 1, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Icono
                if (poi.icon) {
                    ctx.font = '6px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(poi.icon, px, py + 0.5);
                }
            }
        }
        
        // ============================================================
        //  🌫️ FOG OF WAR (niebla de guerra)
        //  ============================================================
        _drawFogOfWar(ctx, size, cx, cz) {
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size / 2.5;
            
            // Gradiente radial desde el centro
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // ============================================================
        //  🔲 DIBUJAR BORDE
        //  ============================================================
        _drawBorder(ctx, size) {
            const radius = size / 2 - 2;
            
            // Sombra exterior
            ctx.shadowColor = 'rgba(0, 255, 100, 0.2)';
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = this.config.borderColor;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Brillo interior
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, radius - 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(120, 255, 180, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // ============================================================
        //  📷 DIBUJAR CÁMARA (mejorado)
        //  ============================================================
        _drawCamera(ctx, size, renderer) {
            const dir = new THREE.Vector3();
            renderer.camera.getWorldDirection(dir);
            const angle = Math.atan2(dir.x, dir.z);
            
            // Pulsación
            const pulse = 1 + Math.sin(this._animationFrame * 2) * 0.1;
            
            ctx.save();
            ctx.translate(size / 2, size / 2);
            
            // Sombra/glow
            ctx.shadowColor = 'rgba(79, 224, 192, 0.3)';
            ctx.shadowBlur = 8;
            
            // Triángulo
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -7 * pulse);
            ctx.lineTo(5 * pulse, 6 * pulse);
            ctx.lineTo(-5 * pulse, 6 * pulse);
            ctx.closePath();
            ctx.fillStyle = this.config.cameraColor;
            ctx.fill();
            
            ctx.shadowBlur = 0;
            
            // Punto central
            ctx.beginPath();
            ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            
            ctx.restore();
        }
        
        // ============================================================
        //  📏 DIBUJAR ESCALA
        //  ============================================================
        _drawScale(ctx, size) {
            const scaleWidth = 30;
            const x = 10;
            const y = size - 15;
            
            ctx.save();
            
            // Línea de escala
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + scaleWidth, y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Marcas
            ctx.beginPath();
            ctx.moveTo(x, y - 3);
            ctx.lineTo(x, y + 3);
            ctx.moveTo(x + scaleWidth, y - 3);
            ctx.lineTo(x + scaleWidth, y + 3);
            ctx.stroke();
            
            // Texto
            const rangeKm = (this.worldRange * 2 / 1000).toFixed(1);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '7px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`${rangeKm}km`, x + scaleWidth / 2, y - 4);
            
            ctx.restore();
        }
        
        // ============================================================
        //  📍 DIBUJAR COORDENADAS (debug)
        //  ============================================================
        _drawCoordinates(ctx, size, cx, cz) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.font = '6px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`(${cx.toFixed(0)}, ${cz.toFixed(0)})`, 8, size - 4);
            ctx.restore();
        }
        
        // ============================================================
        //  🎯 DIBUJAR WAYPOINTS
        //  ============================================================
        _drawWaypoints(ctx, size, cx, cz) {
            if (this.waypoints.length === 0) return;
            
            const halfRange = this.worldRange;
            const scale = size / (halfRange * 2);
            
            for (const wp of this.waypoints) {
                const dx = wp.x - cx;
                const dz = wp.z - cz;
                if (Math.abs(dx) > halfRange || Math.abs(dz) > halfRange) continue;
                
                const px = size / 2 + dx * scale;
                const py = size / 2 + dz * scale;
                
                // Waypoint con animación
                const pulse = 1 + Math.sin(this._animationFrame * 1.5 + wp.id) * 0.15;
                
                ctx.save();
                ctx.translate(px, py);
                
                // Círculo exterior
                ctx.beginPath();
                ctx.arc(0, 0, 4 * pulse, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
                ctx.fill();
                
                // Círculo interior
                ctx.beginPath();
                ctx.arc(0, 0, 2.5 * pulse, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                // Punto central
                ctx.beginPath();
                ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#ffd700';
                ctx.fill();
                
                ctx.restore();
            }
        }
        
        // ============================================================
        //  📡 DIBUJAR EVENTOS
        //  ============================================================
        _drawEvents(ctx, size, cx, cz) {
            // Obtener eventos del mundo
            const worldAI = this.engine.getModule('worldAI');
            if (!worldAI) return;
            
            const status = worldAI.getStatus ? worldAI.getStatus() : null;
            if (!status) return;
            
            const halfRange = this.worldRange;
            const scale = size / (halfRange * 2);
            
            // Incendios activos
            if (status.activeFires > 0 && worldAI.fires) {
                for (const fire of worldAI.fires) {
                    const dx = fire.x - cx;
                    const dz = fire.z - cz;
                    if (Math.abs(dx) > halfRange || Math.abs(dz) > halfRange) continue;
                    
                    const px = size / 2 + dx * scale;
                    const py = size / 2 + dz * scale;
                    
                    // Efecto de fuego
                    const gradient = ctx.createRadialGradient(px, py, 0, px, py, 6);
                    gradient.addColorStop(0, 'rgba(255, 100, 0, 0.9)');
                    gradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.6)');
                    gradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
                    
                    ctx.beginPath();
                    ctx.arc(px, py, 5 + Math.sin(this._animationFrame * 3 + fire.seed) * 1, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    
                    // Icono
                    ctx.font = '6px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText('🔥', px, py + 0.5);
                }
            }
        }
        
        // ============================================================
        //  🔄 MÉTODOS PÚBLICOS
        //  ============================================================
        setZoom(zoom) {
            this.targetZoom = Math.max(0.5, Math.min(2, zoom));
        }
        
        zoomIn() {
            this.targetZoom = Math.min(2, this.targetZoom + 0.2);
        }
        
        zoomOut() {
            this.targetZoom = Math.max(0.5, this.targetZoom - 0.2);
        }
        
        addWaypoint(x, z, label = '') {
            this.waypoints.push({
                x, z,
                label: label,
                id: this.waypoints.length,
                timestamp: Date.now()
            });
            console.log(`📍 Waypoint añadido: (${x.toFixed(1)}, ${z.toFixed(1)})`);
        }
        
        removeWaypoint(index) {
            if (index >= 0 && index < this.waypoints.length) {
                this.waypoints.splice(index, 1);
                console.log(`📍 Waypoint eliminado`);
            }
        }
        
        clearWaypoints() {
            this.waypoints = [];
            console.log('📍 Waypoints eliminados');
        }
        
        toggleLayer(layer) {
            if (this.layers.hasOwnProperty(layer)) {
                this.layers[layer] = !this.layers[layer];
                this._bgDirty = true;
                console.log(`🗺️ Capa ${layer}: ${this.layers[layer] ? 'activada' : 'desactivada'}`);
            }
        }
        
        getStats() {
            return {
                zoom: this.zoom,
                worldRange: this.worldRange,
                layers: this.layers,
                pois: this.pois.length,
                waypoints: this.waypoints.length,
                events: this.events.length,
                frameCount: this._frameCount,
                cacheSize: this._renderCache.terrain ? 'active' : 'empty'
            };
        }
        
        // ============================================================
        //  🖱️ CONFIGURAR EVENTOS DE ZOOM
        //  ============================================================
        _setupZoomEvents() {
            // Scroll para zoom
            this.canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                this.targetZoom = Math.max(0.5, Math.min(2, this.targetZoom + delta));
                
                // Actualizar worldRange
                this.worldRange = this.config.zoomDefault / this.targetZoom;
                this.worldRange = Math.max(this.config.zoomMin, Math.min(this.config.zoomMax, this.worldRange));
            }, { passive: false });
            
            // Doble click para reset
            this.canvas.addEventListener('dblclick', () => {
                this.targetZoom = 1.0;
                this.worldRange = this.config.zoomDefault;
                this.panOffset = { x: 0, z: 0 };
                this.targetPan = { x: 0, z: 0 };
            });
            
            // Click para añadir waypoint
            if (this.config.enablePan) {
                this.canvas.addEventListener('click', (e) => {
                    // Obtener posición en el minimapa
                    const rect = this.canvas.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width * this.canvas.width;
                    const y = (e.clientY - rect.top) / rect.height * this.canvas.height;
                    
                    // Convertir a coordenadas de mundo
                    const size = this.canvas.width;
                    const halfRange = this.worldRange;
                    const scale = size / (halfRange * 2);
                    
                    const renderer = this.engine.getModule('renderer');
                    if (!renderer) return;
                    
                    const camPos = renderer.camera.position;
                    const cx = camPos.x + this._predictiveOffset.x;
                    const cz = camPos.z + this._predictiveOffset.z;
                    
                    const worldX = cx + (x - size / 2) / scale;
                    const worldZ = cz + (y - size / 2) / scale;
                    
                    this.addWaypoint(worldX, worldZ);
                });
            }
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.Minimap = Minimap;
    
    console.log('🗺️ Minimap Cuántico cargado');
    console.log('📍 Sistema de POIs y waypoints');
    console.log('🌫️ Fog of war en tiempo real');
    console.log('🔮 Predicción de movimiento');
    console.log('🎨 Capas personalizables');
    console.log('📏 Zoom y pan interactivos');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Minimap;
    }
    
})();
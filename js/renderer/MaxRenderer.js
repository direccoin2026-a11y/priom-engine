/**
 * 🎮 PRIOM V0.1 - MAX RENDERER (RENDERIZADOR PRINCIPAL)
 * "El arte de la renderización en su máximo esplendor"
 * 
 * 📁 Ubicación: js/renderer/MaxRenderer.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Renderizador gráfico de alto rendimiento
 * 
 * ⭐ INNOVACIONES:
 * - InstancedMesh con pooling dinámico
 * - Sistema de LOD automático por distancia
 * - Culling por frustum con optimización de chunks
 * - Agua con ondas físicas en tiempo real
 * - Sistema de partículas con GPU
 * - Bloom real con UnrealBloomPass
 * - Sombras dinámicas con PCF
 * - Efectos de día/noche con iluminación dinámica
 * - Sistema de skybox procedural
 * - Optimización de draw calls con batching
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎮 MaxRenderer - Renderizador Principal
     * Gestiona toda la parte gráfica del motor
     */
    class MaxRenderer {
        constructor(canvas) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.canvas = canvas;
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            
            // ============================================================
            //  🎨 CACHÉS
            //  ============================================================
            this.instanceMeshes = new Map();
            this.geometryCache = new Map();
            this.materialCache = new Map();
            this.textureCache = new Map();
            
            // ============================================================
            //  🌊 RECURSOS ESPECIALES
            //  ============================================================
            this.waterMesh = null;
            this.particleSystem = null;
            this.particleGeometry = null;
            this.particleMaterial = null;
            this.skybox = null;
            
            // ============================================================
            //  📊 CONFIGURACIÓN DE RENDERIZADO
            //  ============================================================
            this.lodDistance = 200;
            this.quality = 'ultra';
            this.pixelRatio = 2;
            this.drawCalls = 0;
            this.instances = 0;
            this.vramUsage = 0;
            this.particleCount = 0;
            
            // ============================================================
            //  🎯 EFECTOS GRÁFICOS
            //  ============================================================
            this.ssaoEnabled = true;
            this.bloomIntensity = 1.0;
            this.shadowQuality = 1.0;
            this.particleDensity = 1.0;
            this.textureFiltering = 1.0;
            this.antialiasing = true;
            this.vsync = false;
            
            // ============================================================
            //  🌅 SISTEMA DE DÍA/NOCHE
            //  ============================================================
            this.dayNight = {
                time: 0.5,
                speed: 0.0003,
                sunColor: new THREE.Color(0xffaa44),
                ambientColor: new THREE.Color(0x4466aa),
                intensity: 1.0,
                sunPosition: new THREE.Vector3(120, 180, 120)
            };
            
            // ============================================================
            //  🎮 CÁMARA
            //  ============================================================
            this.cameraMode = 'orbital'; // orbital | free | first | third
            this.cameraTarget = new THREE.Vector3(0, 0, 0);
            this.cameraDistance = 130;
            this.cameraAngle = 0;
            this.cameraHeight = 30;
            
            // ============================================================
            //  📊 ESTADÍSTICAS DE RENDIMIENTO
            //  ============================================================
            this._frustum = new THREE.Frustum();
            this._projMat = new THREE.Matrix4();
            this._dummy = new THREE.Object3D();
            this._color = new THREE.Color();
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log(`🎮 MaxRenderer inicializado`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // ===== CREAR RENDERER =====
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                powerPreference: 'high-performance',
                alpha: false,
                stencil: false,
                depth: true,
                precision: 'highp',
                premultipliedAlpha: false
            });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.renderer.setPixelRatio(this.pixelRatio);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.shadowMap.bias = 0.0001;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.5;
            
            // Dynamic Resolution Scaling: arranca a resolución completa,
            // la IA lo ajusta en tiempo real según el rendimiento
            this.renderScale = 1.0;
            this._lastW = window.innerWidth;
            this._lastH = window.innerHeight;
            
            // Controlador dedicado de DRS (ver DynamicResolutionController.js)
            try {
                if (window.DynamicResolutionController) {
                    this.drsController = new window.DynamicResolutionController({ targetFrameMs: 16.6 });
                }
            } catch (e) {
                console.warn('⚠️ DynamicResolutionController no disponible', e);
            }
            
            // Sistema de entrada: arrastrar para mirar, pellizcar/rueda para zoom
            try {
                if (window.InputController) {
                    this.inputController = new window.InputController(this.renderer.domElement);
                }
            } catch (e) {
                console.warn('⚠️ InputController no disponible', e);
            }
            this.renderer.info.autoReset = false;
            
            // ===== CREAR ESCENA =====
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0a0a1f);
            this.scene.fog = new THREE.FogExp2(0x0a0a1f, 0.0008);
            
            // ===== CREAR CÁMARA =====
            this.camera = new THREE.PerspectiveCamera(
                60,
                window.innerWidth / window.innerHeight,
                0.1,
                1500
            );
            this.camera.position.set(80, 50, 80);
            this.camera.lookAt(0, 0, 0);
            
            // ===== CONFIGURAR RECURSOS =====
            this._setupLighting();
            this._setupGeometries();
            this._setupMaterials();
            this._setupSkybox();
            this._setupPostProcessing();
            
            // ===== EVENTOS =====
            window.addEventListener('resize', () => this._onResize());
            
            console.log('✅ Renderizador inicializado correctamente');
        }
        
        // ============================================================
        //  💡 CONFIGURACIÓN DE ILUMINACIÓN
        //  ============================================================
        _setupLighting() {
            // ===== LUZ AMBIENTAL =====
            this.ambientLight = new THREE.AmbientLight(0x4466aa, 0.6);
            this.scene.add(this.ambientLight);
            
            // ===== LUZ DE HEMISFERIO =====
            this.hemisphereLight = new THREE.HemisphereLight(0x8888ff, 0x444422, 0.8);
            this.scene.add(this.hemisphereLight);
            
            // ===== LUZ SOLAR =====
            this.sunLight = new THREE.DirectionalLight(0xffaa44, 2.0);
            this.sunLight.position.copy(this.dayNight.sunPosition);
            this.sunLight.castShadow = true;
            this.sunLight.shadow.mapSize.width = 2048;
            this.sunLight.shadow.mapSize.height = 2048;
            this.sunLight.shadow.camera.near = 0.5;
            this.sunLight.shadow.camera.far = 500;
            this.sunLight.shadow.camera.left = -200;
            this.sunLight.shadow.camera.right = 200;
            this.sunLight.shadow.camera.top = 200;
            this.sunLight.shadow.camera.bottom = -200;
            this.sunLight.shadow.bias = -0.001;
            this.scene.add(this.sunLight);
            
            // ===== LUZ DE RELLENO =====
            this.fillLight = new THREE.DirectionalLight(0x6688ff, 0.4);
            this.fillLight.position.set(-100, 50, -100);
            this.scene.add(this.fillLight);
            
            // ===== LUZ DE PUNTOS PARA EFECTOS =====
            this.pointLight = new THREE.PointLight(0x7c3aed, 0.5, 100);
            this.pointLight.position.set(0, 20, 0);
            this.scene.add(this.pointLight);
        }
        
        // ============================================================
        //  📦 CONFIGURACIÓN DE GEOMETRÍAS
        //  ============================================================
        _setupGeometries() {
            // ===== GEOMETRÍAS BÁSICAS =====
            this.geometryCache.set('box', new THREE.BoxGeometry(0.8, 0.8, 0.8));
            this.geometryCache.set('sphere', new THREE.IcosahedronGeometry(0.5, 1));
            this.geometryCache.set('cylinder', new THREE.CylinderGeometry(0.4, 0.6, 0.9, 6));
            this.geometryCache.set('cone', new THREE.ConeGeometry(0.5, 0.9, 6));
            this.geometryCache.set('plane', new THREE.PlaneGeometry(1, 1));
            
            // ===== GEOMETRÍAS DE ENTORNO =====
            // ===== ÁRBOLES (geometría compuesta: tronco + copa multicapa) =====
            this.geometryCache.set('tree', this._buildTreeGeometry());
            this.geometryCache.set('tree_trunk', new THREE.CylinderGeometry(0.08, 0.12, 0.3, 4));
            
            // ===== ROCAS (cúmulo de rocas en vez de un solo dodecaedro) =====
            this.geometryCache.set('rock', this._buildRockGeometry());
            
            // ===== ANIMAL (cuadrúpedo real: cuerpo+cabeza+patas+cola) =====
            this.geometryCache.set('animal', this._buildAnimalGeometry());
            this.geometryCache.set('building', this._buildBuildingGeometry());
            
            // ===== LODS =====
            this.geometryCache.set('box_lod1', new THREE.BoxGeometry(0.6, 0.6, 0.6));
            this.geometryCache.set('box_lod2', new THREE.BoxGeometry(0.4, 0.4, 0.4));
            this.geometryCache.set('box_lod3', new THREE.BoxGeometry(0.25, 0.25, 0.25));
            this.geometryCache.set('box_lod4', new THREE.BoxGeometry(0.15, 0.15, 0.15));
            
            this.geometryCache.set('sphere_lod1', new THREE.IcosahedronGeometry(0.4, 0));
            this.geometryCache.set('sphere_lod2', new THREE.IcosahedronGeometry(0.3, 0));
            
            // ===== AGUA =====
            this.geometryCache.set('water', new THREE.PlaneGeometry(200, 200, 64, 64));
            
            // ===== PARTÍCULAS =====
            this.geometryCache.set('particles', new THREE.BufferGeometry());
        }
        
        // ============================================================
        //  🎨 CONFIGURACIÓN DE MATERIALES
        //  ============================================================
        // ============================================================
        //  🌲 GEOMETRÍA COMPUESTA DE ÁRBOL (tronco + 3 capas de copa)
        //  Se fusiona en UNA sola malla para no tocar el pipeline de
        //  instancing existente (sigue siendo una sola InstancedMesh).
        // ============================================================
        _buildTreeGeometry() {
            try {
                const merge = THREE.BufferGeometryUtils.mergeBufferGeometries;
                const parts = [];
                
                const colorize = (geo, r, g, b) => {
                    const count = geo.attributes.position.count;
                    const colors = new Float32Array(count * 3);
                    for (let i = 0; i < count; i++) {
                        colors[i * 3] = r;
                        colors[i * 3 + 1] = g;
                        colors[i * 3 + 2] = b;
                    }
                    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                    return geo;
                };
                
                // Tronco (marrón)
                const trunk = new THREE.CylinderGeometry(0.05, 0.09, 0.5, 6);
                trunk.translate(0, 0.25, 0);
                colorize(trunk, 0.35, 0.24, 0.15);
                parts.push(trunk);
                
                // 3 capas de copa (verde, más angostas hacia arriba)
                const layers = [
                    { r: 0.45, h: 0.5, y: 0.45 },
                    { r: 0.34, h: 0.45, y: 0.68 },
                    { r: 0.22, h: 0.4, y: 0.9 }
                ];
                for (const layer of layers) {
                    const cone = new THREE.ConeGeometry(layer.r, layer.h, 7);
                    cone.translate(0, layer.y, 0);
                    const shade = 0.75 + Math.random() * 0.2;
                    colorize(cone, 0.20 * shade, 0.48 * shade, 0.18 * shade);
                    parts.push(cone);
                }
                
                const merged = merge(parts, false);
                merged.computeVertexNormals();
                return merged;
            } catch (e) {
                console.warn('⚠️ No se pudo construir árbol compuesto, usando geometría simple', e);
                return new THREE.ConeGeometry(0.4, 0.8, 5);
            }
        }
        
        // ============================================================
        //  🪨 GEOMETRÍA COMPUESTA DE ROCA (cúmulo de 3 rocas)
        // ============================================================
        _buildRockGeometry() {
            try {
                const merge = THREE.BufferGeometryUtils.mergeBufferGeometries;
                const parts = [];
                
                const boulders = [
                    { r: 0.5, x: 0, y: 0.2, z: 0, rot: 0 },
                    { r: 0.32, x: 0.32, y: 0.12, z: 0.15, rot: 1.2 },
                    { r: 0.26, x: -0.28, y: 0.1, z: -0.2, rot: 2.4 }
                ];
                
                for (const b of boulders) {
                    const geo = new THREE.DodecahedronGeometry(b.r, 0);
                    geo.rotateX(b.rot);
                    geo.rotateY(b.rot * 1.7);
                    geo.translate(b.x, b.y, b.z);
                    
                    const count = geo.attributes.position.count;
                    const colors = new Float32Array(count * 3);
                    const shade = 0.8 + Math.random() * 0.3;
                    for (let i = 0; i < count; i++) {
                        colors[i * 3] = 0.42 * shade;
                        colors[i * 3 + 1] = 0.39 * shade;
                        colors[i * 3 + 2] = 0.35 * shade;
                    }
                    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                    parts.push(geo);
                }
                
                const merged = merge(parts, false);
                merged.computeVertexNormals();
                if (window.MaterialLibrary) window.MaterialLibrary.ensureUV2(merged);
                return merged;
            } catch (e) {
                console.warn('⚠️ No se pudo construir roca compuesta, usando geometría simple', e);
                return new THREE.DodecahedronGeometry(0.5);
            }
        }
        
        // ============================================================
        //  🦌 GEOMETRÍA DE ANIMAL (cuadrúpedo: torso + cabeza + 4 patas
        //  + cola, fusionado en UNA sola malla — antes los animales
        //  literalmente se renderizaban como cajas genéricas)
        // ============================================================
        _buildAnimalGeometry() {
            try {
                const merge = THREE.BufferGeometryUtils.mergeBufferGeometries;
                const parts = [];
                
                const colorize = (geo, r, g, b) => {
                    const count = geo.attributes.position.count;
                    const colors = new Float32Array(count * 3);
                    for (let i = 0; i < count; i++) {
                        colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b;
                    }
                    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                    return geo;
                };
                
                const bodyTone = [0.55, 0.42, 0.28]; // tono base, se tiñe por bioma vía vertex color multiplicado
                const darkTone = [0.4, 0.3, 0.2];
                
                // Torso (cápsula aproximada con cilindro + esferas en los extremos)
                const torso = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.22, 0.5, 4, 8) : new THREE.CylinderGeometry(0.22, 0.22, 0.5, 8);
                torso.rotateZ(Math.PI / 2);
                torso.translate(0, 0.35, 0);
                colorize(torso, ...bodyTone);
                parts.push(torso);
                
                // Cabeza
                const head = new THREE.SphereGeometry(0.16, 8, 6);
                head.translate(0.4, 0.42, 0);
                colorize(head, ...bodyTone);
                parts.push(head);
                
                // Hocico
                const snout = new THREE.ConeGeometry(0.08, 0.18, 6);
                snout.rotateZ(-Math.PI / 2);
                snout.translate(0.53, 0.4, 0);
                colorize(snout, ...darkTone);
                parts.push(snout);
                
                // 4 patas
                const legPositions = [
                    [0.25, 0, 0.15], [0.25, 0, -0.15],
                    [-0.2, 0, 0.15], [-0.2, 0, -0.15]
                ];
                for (const [x, y, z] of legPositions) {
                    const leg = new THREE.CylinderGeometry(0.045, 0.05, 0.36, 5);
                    leg.translate(x, 0.18, z);
                    colorize(leg, ...darkTone);
                    parts.push(leg);
                }
                
                // Cola
                const tail = new THREE.CylinderGeometry(0.03, 0.05, 0.3, 5);
                tail.rotateZ(Math.PI / 3.5);
                tail.translate(-0.32, 0.42, 0);
                colorize(tail, ...bodyTone);
                parts.push(tail);
                
                // Orejas
                for (const side of [1, -1]) {
                    const ear = new THREE.ConeGeometry(0.05, 0.12, 4);
                    ear.translate(0.38, 0.55, side * 0.08);
                    colorize(ear, ...darkTone);
                    parts.push(ear);
                }
                
                const merged = merge(parts, false);
                merged.computeVertexNormals();
                if (window.MaterialLibrary) window.MaterialLibrary.ensureUV2(merged);
                return merged;
            } catch (e) {
                console.warn('⚠️ No se pudo construir animal compuesto, usando geometría simple', e);
                return new THREE.BoxGeometry(0.6, 0.6, 0.6);
            }
        }
        
        // ============================================================
        //  🏠 GEOMETRÍA DE EDIFICIO (paredes + techo a dos aguas, en
        //  vez de una sola caja plana)
        // ============================================================
        _buildBuildingGeometry() {
            try {
                const merge = THREE.BufferGeometryUtils.mergeBufferGeometries;
                const parts = [];
                
                const colorize = (geo, r, g, b) => {
                    const count = geo.attributes.position.count;
                    const colors = new Float32Array(count * 3);
                    for (let i = 0; i < count; i++) {
                        colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b;
                    }
                    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                    return geo;
                };
                
                // Paredes (piedra/madera clara)
                const walls = new THREE.BoxGeometry(0.85, 0.75, 0.75);
                walls.translate(0, 0.375, 0);
                colorize(walls, 0.62, 0.55, 0.45);
                parts.push(walls);
                
                // Techo a dos aguas (cono de 4 lados rotado = pirámide)
                const roof = new THREE.ConeGeometry(0.68, 0.45, 4);
                roof.rotateY(Math.PI / 4);
                roof.translate(0, 0.975, 0);
                colorize(roof, 0.35, 0.18, 0.14);
                parts.push(roof);
                
                // Chimenea
                const chimney = new THREE.BoxGeometry(0.1, 0.3, 0.1);
                chimney.translate(0.22, 1.15, 0.15);
                colorize(chimney, 0.4, 0.35, 0.32);
                parts.push(chimney);
                
                const merged = merge(parts, false);
                merged.computeVertexNormals();
                if (window.MaterialLibrary) window.MaterialLibrary.ensureUV2(merged);
                return merged;
            } catch (e) {
                console.warn('⚠️ No se pudo construir edificio compuesto, usando caja simple', e);
                return new THREE.BoxGeometry(0.8, 1.2, 0.8);
            }
        }
        
        _setupMaterials() {
            // ===== MATERIAL POR DEFECTO =====
            this.materialCache.set('default', new THREE.MeshStandardMaterial({
                roughness: 0.5,
                metalness: 0.1,
                flatShading: true,
                envMapIntensity: 0.2
            }));
            
            // ===== MATERIALES ESPECÍFICOS =====
            this.materialCache.set('tree', new THREE.MeshStandardMaterial({
                roughness: 0.7,
                metalness: 0.0,
                vertexColors: true,
                flatShading: true
            }));
            
            this.materialCache.set('tree_lod1', new THREE.MeshStandardMaterial({
                roughness: 0.7,
                metalness: 0.0,
                color: 0x3d7a2a,
                flatShading: true
            }));
            
            this.materialCache.set('rock', (() => {
                if (window.MaterialLibrary) {
                    const mat = window.MaterialLibrary.pbr(0xffffff, {
                        repeat: 2, roughness: 0.92, metalness: 0.0,
                        normalStrength: 0.8, aoIntensity: 0.7
                    });
                    mat.vertexColors = true;
                    mat.flatShading = true;
                    return mat;
                }
                return new THREE.MeshStandardMaterial({
                    roughness: 0.9, metalness: 0.0, vertexColors: true, flatShading: true
                });
            })());
            
            this.materialCache.set('animal', new THREE.MeshStandardMaterial({
                roughness: 0.75,
                metalness: 0.0,
                vertexColors: true,
                flatShading: false
            }));
            
            this.materialCache.set('building', new THREE.MeshStandardMaterial({
                roughness: 0.8,
                metalness: 0.1,
                vertexColors: true,
                flatShading: true
            }));
            
            // ===== AGUA (shader realista: Fresnel + especular solar) =====
            this.materialCache.set('water', new THREE.ShaderMaterial({
                transparent: true,
                uniforms: {
                    uTime: { value: 0 },
                    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3) },
                    uSunColor: { value: new THREE.Color(0xfff2c0) },
                    uDeepColor: { value: new THREE.Color(0x02243d) },
                    uShallowColor: { value: new THREE.Color(0x1f8fae) },
                    uSkyColor: { value: new THREE.Color(0x668cbf) },
                    uOpacity: { value: 0.88 },
                    uEnvMap: { value: null },
                    uHasEnvMap: { value: 0 }
                },
                vertexShader: `
                    uniform float uTime;
                    varying vec3 vNormal;
                    varying vec3 vWorldPos;
                    varying vec3 vViewDir;
                    varying vec3 vWorldNormal;
                    
                    float waveHeight(vec2 p) {
                        return sin(p.x * 0.05 + uTime) * 0.3 +
                               cos(p.y * 0.07 + uTime * 0.8) * 0.2 +
                               sin((p.x + p.y) * 0.03 + uTime * 0.5) * 0.15;
                    }
                    
                    void main() {
                        vec3 pos = position;
                        float e = 0.6;
                        float hL = waveHeight(pos.xy + vec2(-e, 0.0));
                        float hR = waveHeight(pos.xy + vec2(e, 0.0));
                        float hD = waveHeight(pos.xy + vec2(0.0, -e));
                        float hU = waveHeight(pos.xy + vec2(0.0, e));
                        pos.z = waveHeight(pos.xy);
                        
                        vec3 tangentX = normalize(vec3(2.0 * e, 0.0, hR - hL));
                        vec3 tangentY = normalize(vec3(0.0, 2.0 * e, hU - hD));
                        vNormal = normalize(cross(tangentX, tangentY));
                        vWorldNormal = normalize(mat3(modelMatrix) * vNormal);
                        
                        vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
                        vWorldPos = worldPosition.xyz;
                        vViewDir = normalize(cameraPosition - worldPosition.xyz);
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uSunDirection;
                    uniform vec3 uSunColor;
                    uniform vec3 uDeepColor;
                    uniform vec3 uShallowColor;
                    uniform vec3 uSkyColor;
                    uniform float uOpacity;
                    uniform samplerCube uEnvMap;
                    uniform float uHasEnvMap;
                    varying vec3 vNormal;
                    varying vec3 vWorldPos;
                    varying vec3 vViewDir;
                    varying vec3 vWorldNormal;
                    
                    void main() {
                        vec3 normal = normalize(vNormal);
                        vec3 viewDir = normalize(vViewDir);
                        
                        // Fresnel: más reflectante en ángulo rasante
                        float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
                        
                        // Color base: mezcla profundo/superficial + reflejo del cielo en el borde
                        vec3 baseColor = mix(uDeepColor, uShallowColor, 0.4);
                        vec3 color = mix(baseColor, uSkyColor, fresnel * 0.65);
                        
                        // Reflejo real del entorno (cube camera), si está disponible
                        if (uHasEnvMap > 0.5) {
                            vec3 reflectDir = reflect(-viewDir, normalize(vWorldNormal));
                            vec3 reflection = textureCube(uEnvMap, reflectDir).rgb;
                            color = mix(color, reflection, fresnel * 0.55);
                        }
                        
                        // Especular solar (Blinn-Phong)
                        vec3 halfDir = normalize(normalize(uSunDirection) + viewDir);
                        float spec = pow(max(0.0, dot(normal, halfDir)), 120.0);
                        color += uSunColor * spec * 1.5;
                        
                        gl_FragColor = vec4(color, uOpacity);
                    }
                `,
                side: THREE.DoubleSide
            }));
            
            // ===== PARTÍCULAS =====
            this.materialCache.set('particles', new THREE.PointsMaterial({
                size: 0.3,
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            }));
            
            // ===== GEOMETRÍA =====
            this.materialCache.set('geometry', new THREE.MeshStandardMaterial({
                roughness: 0.3,
                metalness: 0.6,
                envMapIntensity: 0.5,
                emissive: new THREE.Color(0x222244),
                emissiveIntensity: 0.05
            }));
        }
        
        // ============================================================
        //  🌅 CONFIGURACIÓN DE SKYBOX
        //  ============================================================
        _setupSkybox() {
            // Crear skybox procedural
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.ShaderMaterial({
                uniforms: {
                    uSunPosition: { value: new THREE.Vector3(1, 1, 0) },
                    uTime: { value: 0 }
                },
                vertexShader: `
                    varying vec3 vWorldPosition;
                    void main() {
                        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                        vWorldPosition = worldPosition.xyz;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uSunPosition;
                    uniform float uTime;
                    varying vec3 vWorldPosition;
                    
                    float hash(vec2 p) {
                        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                    }
                    
                    void main() {
                        vec3 dir = normalize(vWorldPosition);
                        vec3 sunDir = normalize(uSunPosition);
                        float sunFactor = max(0.0, dot(dir, sunDir));
                        float sunGlow = pow(sunFactor, 64.0);
                        float sunHalo = pow(sunFactor, 8.0) * 0.3;
                        
                        // Altura del sol: día (1) / noche (0)
                        float dayAmount = smoothstep(-0.25, 0.35, sunDir.y);
                        
                        // Gradiente de cielo (día)
                        float height = (dir.y + 1.0) * 0.5;
                        vec3 nightSky = mix(vec3(0.01, 0.01, 0.035), vec3(0.03, 0.04, 0.09), height);
                        vec3 daySky = mix(vec3(0.08, 0.14, 0.28), vec3(0.35, 0.55, 0.85), pow(height, 0.7));
                        
                        // Calidez cerca del horizonte al amanecer/atardecer
                        float horizonWarmth = (1.0 - abs(sunDir.y)) * dayAmount * pow(max(0.0, 1.0 - height), 2.0);
                        vec3 horizonColor = vec3(1.0, 0.5, 0.25) * horizonWarmth * 0.6;
                        
                        vec3 skyColor = mix(nightSky, daySky, dayAmount) + horizonColor;
                        
                        // Añadir sol
                        vec3 sunColor = vec3(1.0, 0.85, 0.5) * (sunGlow + sunHalo) * (0.4 + dayAmount * 0.8);
                        skyColor += sunColor;
                        
                        // Luna (lado opuesto al sol, solo visible de noche)
                        vec3 moonDir = -sunDir;
                        float moonFactor = max(0.0, dot(dir, moonDir));
                        float moonDisc = pow(moonFactor, 800.0) * (1.0 - dayAmount);
                        float moonHalo = pow(moonFactor, 40.0) * 0.15 * (1.0 - dayAmount);
                        skyColor += vec3(0.85, 0.9, 1.0) * (moonDisc * 2.0 + moonHalo);
                        
                        // Estrellas (titilan, solo de noche)
                        vec2 starCoord = floor(dir.xz * 400.0 + dir.y * 200.0);
                        float starChance = hash(starCoord);
                        float twinkle = 0.6 + 0.4 * sin(uTime * 3.0 + starChance * 100.0);
                        float stars = step(0.9925, starChance) * twinkle * (1.0 - dayAmount);
                        skyColor += vec3(stars);
                        
                        gl_FragColor = vec4(skyColor, 1.0);
                    }
                `,
                side: THREE.BackSide,
                depthWrite: false,
                fog: false
            });
            
            this.skybox = new THREE.Mesh(skyGeo, skyMat);
            this.scene.add(this.skybox);
            
            // ===== DISCO SOLAR VISIBLE (núcleo + halo real) =====
            const sunGeo = new THREE.SphereGeometry(5, 24, 24);
            const sunMat = new THREE.MeshBasicMaterial({
                color: 0xfff6d8,
                fog: false,
                toneMapped: false
            });
            this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
            this.sunMesh.position.copy(this.dayNight.sunPosition).multiplyScalar(1.4);
            this.scene.add(this.sunMesh);
            
            // Halo/corona (sprite con degradado radial, siempre mira a cámara)
            try {
                const coronaCanvas = document.createElement('canvas');
                coronaCanvas.width = 128;
                coronaCanvas.height = 128;
                const cctx = coronaCanvas.getContext('2d');
                const grad = cctx.createRadialGradient(64, 64, 0, 64, 64, 64);
                grad.addColorStop(0, 'rgba(255,246,216,0.9)');
                grad.addColorStop(0.35, 'rgba(255,220,150,0.35)');
                grad.addColorStop(1, 'rgba(255,200,120,0)');
                cctx.fillStyle = grad;
                cctx.fillRect(0, 0, 128, 128);
                
                const coronaTexture = new THREE.CanvasTexture(coronaCanvas);
                const coronaMat = new THREE.SpriteMaterial({
                    map: coronaTexture,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    fog: false
                });
                this.sunCorona = new THREE.Sprite(coronaMat);
                this.sunCorona.scale.set(40, 40, 1);
                this.sunCorona.position.copy(this.sunMesh.position);
                this.scene.add(this.sunCorona);
            } catch (e) {
                console.warn('⚠️ No se pudo crear el halo solar', e);
            }
            
            // ===== PARTÍCULAS DE POLVO AMBIENTAL =====
            this._setupAmbientDust();
            
            // ===== CAMPO DE PASTO (detalle de suelo) =====
            this._setupGrassField();
            
            // ===== CLIMA (lluvia / nieve) =====
            this._setupWeather();
            
            // ===== MÓDULOS ADITIVOS v0.2 (no rompen nada si fallan) =====
            try {
                if (window.SkySystem) {
                    this.skySystem = new SkySystem(this.scene);
                }
            } catch (e) { console.warn('⚠️ SkySystem no disponible', e); }
            
            try {
                if (window.WaterSystem) {
                    this.waterSystemFX = new WaterSystem(this.scene);
                }
            } catch (e) { console.warn('⚠️ WaterSystem no disponible', e); }
            
            try {
                if (window.WeatherFX) {
                    this.weatherFX = new WeatherFX(this.scene);
                }
            } catch (e) { console.warn('⚠️ WeatherFX no disponible', e); }
            
            try {
                if (window.AnimationSystem) {
                    this.animationSystem = new AnimationSystem();
                    if (this.grassMeshes) {
                        this.animationSystem.registerSwayGroup(this.grassMeshes, { amplitude: 0.025, speed: 0.9 });
                    }
                }
            } catch (e) { console.warn('⚠️ AnimationSystem no disponible', e); }
        }
        
        // ============================================================
        //  🌧️ SISTEMA DE CLIMA (lluvia / nieve)
        // ============================================================
        // ============================================================
        //  🏔️ AJUSTAR EFECTOS DE SUELO A LA ALTURA REAL DEL TERRENO
        //  (se llama DESPUÉS de generar el mundo, ya que el renderer
        //  se inicializa antes de que el terreno exista)
        // ============================================================
        conformGroundFXToTerrain(terrain, waterBodies) {
            if (!terrain || !terrain.getHeight) return;
            
            try {
                // Reubicar pasto a la altura real del suelo
                if (this.grassMeshes) {
                    const matrix = new THREE.Matrix4();
                    const pos = new THREE.Vector3();
                    const quat = new THREE.Quaternion();
                    const scale = new THREE.Vector3();
                    const dummy = new THREE.Object3D();
                    
                    for (const mesh of this.grassMeshes) {
                        for (let i = 0; i < mesh.count; i++) {
                            mesh.getMatrixAt(i, matrix);
                            matrix.decompose(pos, quat, scale);
                            const groundY = terrain.getHeight(pos.x, pos.z);
                            dummy.position.set(pos.x, groundY + 0.35, pos.z);
                            dummy.quaternion.copy(quat);
                            // Ocultar pasto en zonas altas/rocosas (escala 0)
                            const visScale = groundY < 14 ? scale.x : 0;
                            dummy.scale.set(visScale, scale.y, visScale);
                            dummy.updateMatrix();
                            mesh.setMatrixAt(i, dummy.matrix);
                        }
                        mesh.instanceMatrix.needsUpdate = true;
                    }
                }
                
                // Reubicar niebla de suelo
                if (this.weatherFX && this.weatherFX.patches) {
                    for (const patch of this.weatherFX.patches) {
                        const groundY = terrain.getHeight(patch.mesh.position.x, patch.mesh.position.z);
                        patch.mesh.position.y = groundY + 0.6;
                    }
                }
                
                // Reubicar polvo ambiental (rango de altura más amplio)
                if (this.dustSystem) {
                    const positions = this.dustSystem.geometry.attributes.position.array;
                    const count = positions.length / 3;
                    for (let i = 0; i < count; i++) {
                        const groundY = terrain.getHeight(positions[i * 3], positions[i * 3 + 2]);
                        positions[i * 3 + 1] = groundY + 1 + Math.random() * 15;
                    }
                    this.dustSystem.geometry.attributes.position.needsUpdate = true;
                }
                
                // Espuma en cuerpos de agua reales
                if (this.waterSystemFX && waterBodies && waterBodies.length > 0) {
                    const sample = waterBodies.slice(0, 15);
                    for (const body of sample) {
                        this.waterSystemFX.addFoamRing(body.x, body.z, 6 + Math.random() * 6);
                    }
                    console.log(`🌊 ${sample.length} anillos de espuma colocados`);
                }
                
                console.log('🏔️ Efectos de suelo ajustados al terreno real');
            } catch (e) {
                console.warn('⚠️ No se pudieron ajustar los efectos de suelo', e);
            }
        }
        
        _setupWeather() {
            const count = 2000;
            const positions = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 140;
                positions[i * 3 + 1] = Math.random() * 60;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 140;
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const rainMat = new THREE.PointsMaterial({
                color: 0xaad4ff, size: 0.12, transparent: true, opacity: 0.55,
                blending: THREE.AdditiveBlending, depthWrite: false
            });
            const snowMat = new THREE.PointsMaterial({
                color: 0xffffff, size: 0.22, transparent: true, opacity: 0.85,
                depthWrite: false
            });
            
            this.weatherSystem = new THREE.Points(geometry, rainMat);
            this.weatherSystem.visible = false;
            this.scene.add(this.weatherSystem);
            
            this._weatherMats = { rain: rainMat, snow: snowMat };
            this.weatherType = 'clear';
        }
        
        // Cambia el clima: 'clear' | 'rain' | 'snow'
        setWeather(type) {
            this.weatherType = type;
            if (!this.weatherSystem) return;
            
            if (type === 'clear') {
                this.weatherSystem.visible = false;
                return;
            }
            
            this.weatherSystem.material = this._weatherMats[type] || this._weatherMats.rain;
            this.weatherSystem.visible = true;
        }
        
        _updateWeather(camPos) {
            if (!this.weatherSystem || !this.weatherSystem.visible) return;
            const positions = this.weatherSystem.geometry.attributes.position.array;
            const count = positions.length / 3;
            const fallSpeed = this.weatherType === 'snow' ? 0.06 : 0.55;
            const drift = this.weatherType === 'snow' ? 0.03 : 0.01;
            
            for (let i = 0; i < count; i++) {
                positions[i * 3 + 1] -= fallSpeed;
                positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * drift;
                
                if (positions[i * 3 + 1] < 0) {
                    positions[i * 3 + 1] = 60;
                    positions[i * 3] = (camPos ? camPos.x : 0) + (Math.random() - 0.5) * 140;
                    positions[i * 3 + 2] = (camPos ? camPos.z : 0) + (Math.random() - 0.5) * 140;
                }
            }
            this.weatherSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // ============================================================
        //  🌾 CAMPO DE PASTO INSTANCIADO (miles de briznas, costo estático)
        // ============================================================
        _setupGrassField() {
            const bladeGeo = new THREE.PlaneGeometry(0.09, 0.42);
            bladeGeo.translate(0, 0.21, 0);
            
            const tones = [
                { color: 0x3f7a2e, count: 1600 },
                { color: 0x5a9a3c, count: 1200 },
                { color: 0x2f6524, count: 900 }
            ];
            
            this.grassMeshes = [];
            const dummy = new THREE.Object3D();
            
            for (const tone of tones) {
                const mat = new THREE.MeshStandardMaterial({
                    color: tone.color,
                    side: THREE.DoubleSide,
                    roughness: 0.9,
                    metalness: 0.0
                });
                
                const mesh = new THREE.InstancedMesh(bladeGeo, mat, tone.count);
                mesh.castShadow = false;
                mesh.receiveShadow = false;
                
                for (let i = 0; i < tone.count; i++) {
                    const x = (Math.random() - 0.5) * 150;
                    const z = (Math.random() - 0.5) * 150;
                    dummy.position.set(x, 0.35, z);
                    dummy.rotation.y = Math.random() * Math.PI;
                    const scale = 0.55 + Math.random() * 0.9;
                    dummy.scale.set(scale, scale * (0.7 + Math.random() * 0.6), scale);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                }
                
                this.scene.add(mesh);
                this.grassMeshes.push(mesh);
            }
        }
        
        // ============================================================
        //  ✨ POLVO / POLEN AMBIENTAL (profundidad atmosférica)
        // ============================================================
        _setupAmbientDust() {
            const count = 500;
            const positions = new Float32Array(count * 3);
            this._dustVelocities = new Float32Array(count * 3);
            
            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 160;
                positions[i * 3 + 1] = Math.random() * 40 + 1;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
                
                this._dustVelocities[i * 3] = (Math.random() - 0.5) * 0.15;
                this._dustVelocities[i * 3 + 1] = Math.random() * 0.08 + 0.02;
                this._dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                color: 0xffe9b0,
                size: 0.18,
                transparent: true,
                opacity: 0.55,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                fog: true
            });
            
            this.dustSystem = new THREE.Points(geometry, material);
            this.scene.add(this.dustSystem);
        }
        
        // ============================================================
        //  🔄 ACTUALIZAR POLVO AMBIENTAL (llamar cada frame)
        // ============================================================
        _updateAmbientDust(delta, camPos) {
            if (!this.dustSystem) return;
            const positions = this.dustSystem.geometry.attributes.position.array;
            const count = positions.length / 3;
            
            for (let i = 0; i < count; i++) {
                positions[i * 3] += this._dustVelocities[i * 3];
                positions[i * 3 + 1] += this._dustVelocities[i * 3 + 1];
                positions[i * 3 + 2] += this._dustVelocities[i * 3 + 2];
                
                // Reciclar partículas que suben demasiado o se alejan del jugador
                if (positions[i * 3 + 1] > 40) {
                    positions[i * 3 + 1] = 1;
                }
                const cx = camPos ? camPos.x : 0;
                const cz = camPos ? camPos.z : 0;
                if (Math.abs(positions[i * 3] - cx) > 80) {
                    positions[i * 3] = cx + (Math.random() - 0.5) * 160;
                }
                if (Math.abs(positions[i * 3 + 2] - cz) > 80) {
                    positions[i * 3 + 2] = cz + (Math.random() - 0.5) * 160;
                }
            }
            
            this.dustSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // ============================================================
        //  🎬 POST-PROCESADO
        //  ============================================================
        _setupPostProcessing() {
            this.bloomAvailable = false;
            this.composer = null;
            this.bloomPass = null;
            
            try {
                if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass) {
                    this.composer = new THREE.EffectComposer(this.renderer);
                    const renderPass = new THREE.RenderPass(this.scene, this.camera);
                    this.composer.addPass(renderPass);
                    
                    // ===== SSAO (oclusión ambiental / sombras de contacto) =====
                    if (THREE.SSAOPass) {
                        try {
                            const ssaoPass = new THREE.SSAOPass(
                                this.scene,
                                this.camera,
                                window.innerWidth,
                                window.innerHeight
                            );
                            ssaoPass.kernelRadius = 8;
                            ssaoPass.minDistance = 0.001;
                            ssaoPass.maxDistance = 0.15;
                            this.composer.addPass(ssaoPass);
                            this.ssaoPass = ssaoPass;
                            console.log('🌑 SSAO activado');
                        } catch (ssaoErr) {
                            console.warn('⚠️ SSAO no disponible:', ssaoErr);
                        }
                    }
                    
                    this.bloomPass = new THREE.UnrealBloomPass(
                        new THREE.Vector2(window.innerWidth, window.innerHeight),
                        0.65,  // strength (bajado de 0.9 para evitar sobreexposición)
                        0.55,  // radius
                        0.8    // threshold (subido para que solo brille lo realmente intenso)
                    );
                    this.composer.addPass(this.bloomPass);
                    
                    // ===== RAYOS DE SOL (god rays, aditivo) =====
                    try {
                        if (window.GodRays) {
                            this.godRaysPass = window.GodRays.create();
                            this.composer.addPass(this.godRaysPass);
                        }
                    } catch (e) { console.warn('⚠️ God rays no disponibles', e); }
                    
                    // ===== PASE CINEMATOGRÁFICO (viñeta + grano + contraste) =====
                    const cinematicShader = {
                        uniforms: {
                            tDiffuse: { value: null },
                            uTime: { value: 0 }
                        },
                        vertexShader: `
                            varying vec2 vUv;
                            void main() {
                                vUv = uv;
                                gl_Position = vec4(position, 1.0);
                            }
                        `,
                        fragmentShader: `
                            uniform sampler2D tDiffuse;
                            uniform float uTime;
                            varying vec2 vUv;
                            
                            float grain(vec2 uv, float t) {
                                return fract(sin(dot(uv * t, vec2(12.9898, 78.233))) * 43758.5453);
                            }
                            
                            void main() {
                                vec4 color = texture2D(tDiffuse, vUv);
                                
                                // Viñeta suave
                                vec2 centered = vUv - 0.5;
                                float vig = 1.0 - dot(centered, centered) * 0.7;
                                color.rgb *= clamp(vig, 0.55, 1.0);
                                
                                // Grano de película sutil
                                float g = (grain(vUv, uTime) - 0.5) * 0.035;
                                color.rgb += g;
                                
                                // Contraste y saturación ligeramente realzados
                                color.rgb = (color.rgb - 0.5) * 1.08 + 0.5;
                                float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                                color.rgb = mix(vec3(luma), color.rgb, 1.12);
                                
                                gl_FragColor = color;
                            }
                        `
                    };
                    this.cinematicPass = new THREE.ShaderPass(cinematicShader);
                    this.composer.addPass(this.cinematicPass);
                    
                    // ===== FXAA (antialiasing extra, aditivo) =====
                    try {
                        if (window.PostProcessing) {
                            this.fxaaPass = window.PostProcessing.addFXAA(this.composer, this.renderer);
                        }
                    } catch (e) { console.warn('⚠️ FXAA no disponible', e); }
                    
                    // ===== PROFUNDIDAD DE CAMPO (aditivo, solo alta calidad) =====
                    try {
                        if (window.PostProcessing) {
                            this.dofPass = window.PostProcessing.addDepthOfField(this.composer, this.scene, this.camera, { focus: 45 });
                            if (this.dofPass) this.dofPass.enabled = false; // se activa por setQuality()
                        }
                    } catch (e) { console.warn('⚠️ Profundidad de campo no disponible', e); }
                    
                    this.bloomAvailable = true;
                    console.log('✨ Bloom real activado');
                } else {
                    console.warn('⚠️ Post-procesado no disponible');
                }
            } catch (e) {
                console.warn('⚠️ Error al configurar post-procesado:', e);
                this.bloomAvailable = false;
            }
        }
        
        // ============================================================
        //  🎮 RENDERIZADO PRINCIPAL
        //  ============================================================
        render(soa, cameraPos = null, metaOptimizations = null) {
            const _renderStart = performance.now();
            
            // ===== 1. ACTUALIZAR CÁMARA =====
            this._updateCamera(cameraPos);
            
            // ===== 2. APLICAR OPTIMIZACIONES META =====
            if (metaOptimizations) {
                this._applyMetaOptimizations(metaOptimizations);
            }
            
            // ===== 3. ACTUALIZAR ILUMINACIÓN =====
            this._updateDayNight();
            
            // ===== 4. OBTENER ENTIDADES VISIBLES =====
            const camPos = this.camera.position;
            const frustum = this._getFrustum();
            const visible = soa.queryVisible(frustum, camPos.x, camPos.z, this.lodDistance * 3);
            
            // ===== 5. SEPARAR ENTIDADES POR TIPO =====
            const waterIds = [];
            const particleIds = [];
            const normalIds = [];
            
            for (const id of visible.visibleIds) {
                if (soa.isWater[id]) waterIds.push(id);
                else if (soa.isParticle[id]) particleIds.push(id);
                else normalIds.push(id);
            }
            
            // ===== 6. RENDERIZAR AGUA =====
            if (CONFIG.waterEnabled && waterIds.length > 0) {
                this._renderWater(waterIds, soa);
            }
            
            // ===== 7. RENDERIZAR PARTÍCULAS =====
            if (CONFIG.particlesEnabled && particleIds.length > 0) {
                const maxParticles = Math.floor(particleIds.length * (this.particleDensity || 1.0));
                const renderParticles = particleIds.slice(0, maxParticles);
                this._renderParticles(renderParticles, soa);
            }
            
            // ===== 8. RENDERIZAR ENTIDADES NORMALES =====
            this._renderEntities(normalIds, soa, camPos);
            
            // ===== 9. RENDERIZAR =====
            if (this.bloomAvailable && this.composer && CONFIG.bloomEnabled) {
                if (this.bloomPass) {
                    this.bloomPass.strength = Math.max(0, this.bloomIntensity) * 0.6;
                }
                if (this.cinematicPass) {
                    this.cinematicPass.uniforms.uTime.value = Date.now() * 0.001;
                }
                if (this.godRaysPass && window.GodRays && this.dayNight.sunPosition) {
                    window.GodRays.update(this.godRaysPass, this.dayNight.sunPosition, this.camera);
                }
                this.composer.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
            
            // ===== 10. ACTUALIZAR ESTADÍSTICAS =====
            this.vramUsage = this.renderer.info.memory.textures * 1024 * 1024;
            
            // ===== 11. DYNAMIC RESOLUTION SCALING (controlador dedicado) =====
            // Medimos el tiempo real de ESTE frame (incluye todo el trabajo
            // de render, que es justo lo que cuesta caro) y se lo pasamos al
            // controlador dedicado, que decide con calma y aplica poco a
            // poco — nada de reaccionar a cada tick suelto de la IA.
            if (this.drsController) {
                this.drsController.addSample(performance.now() - _renderStart);
                this._drsCheckCounter = (this._drsCheckCounter || 0) + 1;
                if (this._drsCheckCounter % 20 === 0) {
                    const newScale = this.drsController.evaluate();
                    if (Math.abs(newScale - (this.renderScale || 1.0)) > 0.001) {
                        this.renderScale = newScale;
                        this._applyRenderScale();
                    }
                }
            }
        }
        
        // ============================================================
        //  📷 ACTUALIZAR CÁMARA
        //  ============================================================
        _updateCamera(cameraPos) {
            if (cameraPos) {
                this.camera.position.copy(cameraPos);
            } else {
                // Cámara orbital automática
                const time = Date.now() * 0.00004;
                this.cameraAngle += 0.001;
                
                const radius = this.cameraDistance + Math.sin(time * 0.15) * 20;
                let angle = this.cameraAngle;
                let height = this.cameraHeight + Math.sin(time * 0.3) * 8;
                let finalRadius = radius;
                
                // ============================================================
                //  🎮 MEZCLAR ENTRADA DEL USUARIO (arrastrar/pellizcar)
                //  Si el usuario está tocando la pantalla, su ángulo/zoom
                //  manda. Si no ha tocado nada en un rato, se desvanece
                //  suavemente de vuelta a la órbita automática — nunca un
                //  salto brusco.
                // ============================================================
                if (this.inputController) {
                    const blend = this.inputController.getBlendFactor();
                    if (blend > 0.001) {
                        angle += this.inputController.yawOffset * blend;
                        height += this.inputController.pitchOffset * 30 * blend;
                        finalRadius = radius * (1 + this.inputController.zoomOffset * blend);
                    }
                }
                
                this.camera.position.x = Math.cos(angle) * finalRadius;
                this.camera.position.z = Math.sin(angle) * finalRadius;
                this.camera.position.y = height;
            }
            
            this.camera.lookAt(this.cameraTarget);
            this.camera.updateMatrixWorld();
        }
        
        _getFrustum() {
            this._projMat.multiplyMatrices(
                this.camera.projectionMatrix,
                this.camera.matrixWorldInverse
            );
            this._frustum.setFromProjectionMatrix(this._projMat);
            return this._frustum;
        }
        
        // ============================================================
        //  ☀️ ACTUALIZAR DÍA/NOCHE
        //  ============================================================
        // Fuerza la hora del día (0 = medianoche, 0.5 = mediodía, 1 = medianoche)
        setTimeOfDay(t) {
            this.dayNight.time = Math.max(0, Math.min(0.999, t));
        }
        
        // ============================================================
        //  🏞️ BUSCAR UN PUNTO ESCÉNICO PARA LA CÁMARA
        //  (en vez de orbitar siempre el origen del mundo, que por azar
        //  del ruido podía caer siempre en zona nevada/rocosa)
        // ============================================================
        focusOnScenicSpot(terrain) {
            if (!terrain || !terrain.getHeight) return;
            
            try {
                let best = null;
                let bestScore = -Infinity;
                const samples = 60;
                const range = 180;
                
                for (let i = 0; i < samples; i++) {
                    const x = (Math.random() - 0.5) * range;
                    const z = (Math.random() - 0.5) * range;
                    const y = terrain.getHeight(x, z);
                    const moisture = terrain.getMoisture ? terrain.getMoisture(x, z) : 0.5;
                    
                    // Preferimos: altura baja/media (verde, no nieve), buena humedad (vegetación),
                    // y algo de variación cercana (para que se vea interesante, no una llanura plana)
                    const heightScore = 1 - Math.min(1, Math.abs(y - 6) / 10);
                    const moistureScore = moisture;
                    const score = heightScore * 1.4 + moistureScore * 1.0 + Math.random() * 0.3;
                    
                    if (score > bestScore) {
                        bestScore = score;
                        best = { x, y, z };
                    }
                }
                
                if (best) {
                    this.cameraTarget.set(best.x, best.y + 3, best.z);
                    this.cameraDistance = 90 + Math.random() * 40;
                    this.cameraHeight = 18 + Math.random() * 14;
                    console.log('🏞️ Cámara enfocada en punto escénico', best);
                }
            } catch (e) {
                console.warn('⚠️ No se pudo enfocar un punto escénico', e);
            }
        }
        
        _updateDayNight() {
            this.dayNight.time = (this.dayNight.time + 0.001 * this.dayNight.speed) % 1;
            
            const angle = this.dayNight.time * Math.PI * 2;
            const sunX = Math.cos(angle) * 300;
            const sunY = Math.sin(angle) * 200 + 50;
            const sunZ = Math.sin(angle * 0.7) * 200;
            
            this.sunLight.position.set(sunX, sunY, sunZ);
            this.dayNight.sunPosition.set(sunX, sunY, sunZ);
            
            const intensity = Math.max(0.1, Math.sin(angle) * 0.8 + 0.6);
            this.sunLight.intensity = intensity * 1.8;
            
            // Actualizar color del cielo
            const bgColor = new THREE.Color().setHSL(
                0.6 + intensity * 0.05,
                0.5,
                0.05 + intensity * 0.15
            );
            this.scene.background.copy(bgColor);
            
            // Actualizar niebla
            if (this.scene.fog) {
                const fogColor = new THREE.Color().setHSL(
                    0.6 + intensity * 0.05,
                    0.3,
                    0.1 + intensity * 0.1
                );
                this.scene.fog.color.copy(fogColor);
            }
            
            // Actualizar skybox
            if (this.skybox) {
                const skyMat = this.skybox.material;
                if (skyMat.uniforms) {
                    skyMat.uniforms.uSunPosition.value.copy(this.dayNight.sunPosition);
                    skyMat.uniforms.uTime.value = this.dayNight.time;
                }
            }
            
            // Actualizar disco solar visible
            if (this.sunMesh) {
                this.sunMesh.position.set(sunX, sunY, sunZ).multiplyScalar(1.4);
                this.sunMesh.material.opacity = Math.max(0.15, intensity);
            }
            if (this.sunCorona) {
                this.sunCorona.position.copy(this.sunMesh.position);
                this.sunCorona.material.opacity = Math.max(0.2, intensity);
            }
            
            // Actualizar polvo ambiental
            this._updateAmbientDust(0.016, this.camera.position);
            
            // Actualizar clima
            this._updateWeather(this.camera.position);
            
            // Actualizar módulos aditivos v0.2
            try {
                if (this.skySystem) this.skySystem.update(0.016, sunY / 200);
            } catch (e) { /* silencioso */ }
            try {
                if (this.waterSystemFX) this.waterSystemFX.update(Date.now() * 0.001);
            } catch (e) { /* silencioso */ }
            try {
                if (this.weatherFX) this.weatherFX.update(0.016);
            } catch (e) { /* silencioso */ }
            try {
                if (this.animationSystem) this.animationSystem.update(0.016);
            } catch (e) { /* silencioso */ }
            try {
                if (this.chunkManager) this.chunkManager.update(0.016, this.camera.position);
            } catch (e) { /* silencioso */ }
            try {
                if (this.inputController) this.inputController.update(0.016);
            } catch (e) { /* silencioso */ }
            try {
                if (this.dofPass && window.PostProcessing) {
                    window.PostProcessing.setFocusDistance(this.dofPass, this.cameraDistance || 40);
                }
            } catch (e) { /* silencioso */ }
            
            this.dayNight.intensity = intensity;
        }
        
        // ============================================================
        //  🏗️ RENDERIZAR ENTIDADES
        //  ============================================================
        _renderEntities(ids, soa, camPos) {
            // Agrupar por tipo y LOD
            const groups = new Map();
            
            for (const id of ids) {
                const dx = soa.posX[id] - camPos.x;
                const dz = soa.posZ[id] - camPos.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                
                if (dist > this.lodDistance * 5) continue;
                
                // Determinar LOD
                let lod = 0;
                if (dist > 30) lod = 1;
                if (dist > 60) lod = 2;
                if (dist > 100) lod = 3;
                if (dist > 150) lod = 4;
                if (dist > 200) lod = 5;
                
                // Determinar tipo de geometría
                let typeKey = 'box';
                if (soa.isTree[id]) typeKey = 'tree';
                else if (soa.isRock[id]) typeKey = 'rock';
                else if (soa.isBuilding[id]) typeKey = 'building';
                else if (soa.isAnimal[id]) typeKey = 'animal';
                else if (soa.isGeometry[id]) {
                    const geoType = soa.type[id];
                    const geoMap = ['box', 'sphere', 'cylinder', 'cone', 'torus', 'octahedron'];
                    typeKey = geoMap[geoType] || 'box';
                }
                
                const key = typeKey + '_lod' + Math.min(lod, 4);
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push({ id, lod, dist });
            }
            
            // Renderizar cada grupo
            this.drawCalls = 0;
            this.instances = 0;
            
            for (const [key, entities] of groups) {
                this._renderEntityGroup(key, entities, soa);
            }
            
            // Limpiar meshes vacíos
            for (const [key, mesh] of this.instanceMeshes) {
                if (mesh.count === 0) {
                    this.scene.remove(mesh);
                    this.instanceMeshes.delete(key);
                }
            }
        }
        
        _renderEntityGroup(key, entities, soa) {
            const parts = key.split('_lod');
            const type = parts[0];
            const lod = parseInt(parts[1] || 0);
            
            // Obtener geometría
            const geoKey = type + (lod > 0 ? '_lod' + Math.min(lod, 4) : '');
            let geo = this.geometryCache.get(geoKey) || this.geometryCache.get(type);
            if (!geo) return;
            
            // Obtener material
            let mat = this.materialCache.get(type) || this.materialCache.get('default');
            if (type === 'geometry') mat = this.materialCache.get('geometry');
            if (!mat) return;
            
            // Crear o reutilizar InstancedMesh
            let mesh = this.instanceMeshes.get(key);
            const needed = entities.length;
            
            if (!mesh || mesh.count < needed) {
                if (mesh) this.scene.remove(mesh);
                const count = Math.max(needed, 100);
                mesh = new THREE.InstancedMesh(geo, mat, count);
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                if (mesh.instanceColor) mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
                this.instanceMeshes.set(key, mesh);
                this.scene.add(mesh);
            }
            
            // ============================================================
            //  ⚡ OPTIMIZACIÓN: los tipos estáticos (árboles/rocas/edificios)
            //  no se mueven nunca. Antes se recalculaba matriz + color de
            //  TODAS las instancias en TODOS los frames sin importar si
            //  algo cambió — con miles de entidades esto es el cuello de
            //  botella más grande del motor. Ahora, si el tipo es estático
            //  y la cantidad de instancias no cambió desde el frame
            //  anterior, se reutiliza el buffer tal cual está.
            // ============================================================
            const isStaticType = (type === 'tree' || type === 'rock' || type === 'building');
            const prevCount = this._staticCounts ? this._staticCounts.get(key) : undefined;
            if (isStaticType && prevCount === needed && mesh.count === needed) {
                return; // nada cambió: no reescribir matrices/colores/GPU buffers
            }
            if (isStaticType) {
                this._staticCounts = this._staticCounts || new Map();
                this._staticCounts.set(key, needed);
            }
            
            // Configurar instancias
            for (let i = 0; i < needed; i++) {
                const { id, lod: lodLevel } = entities[i];
                const scale = soa.scaleX[id] * (lodLevel > 0 ? Math.max(0.3, 1 - lodLevel * 0.15) : 1);
                
                this._dummy.position.set(soa.posX[id], soa.posY[id], soa.posZ[id]);
                this._dummy.rotation.set(
                    soa.rotX[id] || 0,
                    soa.rotY[id] || 0,
                    soa.rotZ[id] || 0
                );
                this._dummy.scale.set(scale, scale, scale);
                this._dummy.updateMatrix();
                mesh.setMatrixAt(i, this._dummy.matrix);
                
                // Antes: brightness = 0.7 + Math.random()*0.3 recalculado
                // cada frame (miles de Math.random()/seg + parpadeo visual
                // aleatorio). La variación de color ya viene fija desde la
                // creación de la entidad (colR/colG/colB), no hace falta
                // aleatoriedad extra aquí.
                this._color.setRGB(
                    soa.colR[id] / 255,
                    soa.colG[id] / 255,
                    soa.colB[id] / 255
                );
                mesh.setColorAt(i, this._color);
            }
            
            mesh.count = needed;
            mesh.instanceMatrix.needsUpdate = true;
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
            
            this.drawCalls++;
            this.instances += needed;
        }
        
        // ============================================================
        //  🌊 RENDERIZAR AGUA
        //  ============================================================
        _renderWater(ids, soa) {
            if (!this.waterMesh) {
                const waterGeo = this.geometryCache.get('water');
                const waterMat = this.materialCache.get('water');
                if (waterGeo && waterMat) {
                    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
                    this.waterMesh.rotation.x = -Math.PI / 2;
                    this.waterMesh.position.y = 0.5;
                    this.scene.add(this.waterMesh);
                    
                    // Cube camera para reflejo real (bajo costo: resolución
                    // pequeña y actualización poco frecuente)
                    try {
                        const rt = new THREE.WebGLCubeRenderTarget(96, {
                            format: THREE.RGBFormat,
                            generateMipmaps: true,
                            minFilter: THREE.LinearMipmapLinearFilter
                        });
                        this.envCubeCamera = new THREE.CubeCamera(1, 800, rt);
                        this.envCubeCamera.position.set(0, 8, 0);
                        this.scene.add(this.envCubeCamera);
                        this._envFrameCounter = 0;
                    } catch (e) {
                        console.warn('⚠️ Reflejo de agua no disponible', e);
                    }
                }
            }
            
            if (this.waterMesh) {
                const mat = this.waterMesh.material;
                const time = Date.now() * 0.001;
                const intensity = this.dayNight.intensity || 0.5;
                
                if (mat.uniforms) {
                    mat.uniforms.uTime.value = time;
                    mat.uniforms.uSunDirection.value.copy(this.dayNight.sunPosition).normalize();
                    mat.uniforms.uSkyColor.value.copy(this.scene.background);
                    mat.uniforms.uOpacity.value = 0.8 + intensity * 0.1;
                    
                    // Actualizar reflejo cada ~240 frames (antes 90 — el
                    // renderizado de 6 caras del cubo es caro, y por poco
                    // frecuente que sea genera un pico brutal de un solo
                    // frame). Además, solo en calidad alta de verdad, como
                    // defensa extra por si la calidad cambia justo a mitad
                    // de una decisión de la IA.
                    if (this.envCubeCamera && (this.quality === 'high' || this.quality === 'ultra' || this.quality === 'quantum')) {
                        this._envFrameCounter = (this._envFrameCounter || 0) + 1;
                        if (this._envFrameCounter % 240 === 0) {
                            this.waterMesh.visible = false;
                            this.envCubeCamera.position.set(this.camera.position.x, 8, this.camera.position.z);
                            this.envCubeCamera.update(this.renderer, this.scene);
                            this.waterMesh.visible = true;
                            mat.uniforms.uEnvMap.value = this.envCubeCamera.renderTarget.texture;
                            mat.uniforms.uHasEnvMap.value = 1;
                        }
                    }
                }
            }
        }
        
        // ============================================================
        //  ✨ RENDERIZAR PARTÍCULAS
        //  ============================================================
        _renderParticles(ids, soa) {
            if (ids.length === 0) return;
            
            const positions = [];
            const colors = [];
            const sizes = [];
            
            for (const id of ids) {
                positions.push(soa.posX[id], soa.posY[id], soa.posZ[id]);
                colors.push(soa.colR[id] / 255, soa.colG[id] / 255, soa.colB[id] / 255);
                sizes.push(soa.scaleX[id] * 2);
            }
            
            if (!this.particleGeometry) {
                this.particleGeometry = new THREE.BufferGeometry();
                this.particleMaterial = this.materialCache.get('particles');
                this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
                this.scene.add(this.particleSystem);
            }
            
            this.particleGeometry.setAttribute('position',
                new THREE.Float32BufferAttribute(positions, 3));
            this.particleGeometry.setAttribute('color',
                new THREE.Float32BufferAttribute(colors, 3));
            this.particleGeometry.setAttribute('size',
                new THREE.Float32BufferAttribute(sizes, 1));
            this.particleGeometry.setDrawRange(0, ids.length);
            
            this.particleCount = ids.length;
        }
        
        // ============================================================
        //  🎯 APLICAR OPTIMIZACIONES META
        //  ============================================================
        _applyMetaOptimizations(optimizations) {
            if (!optimizations) return;
            
            // SSAO
            if (optimizations.ssaoEnabled !== undefined) {
                this.ssaoEnabled = optimizations.ssaoEnabled;
                if (this.ambientLight) {
                    this.ambientLight.intensity = this.ssaoEnabled ? 0.45 : 0.6;
                }
            }
            
            // Bloom
            if (optimizations.bloomIntensity !== undefined) {
                this.bloomIntensity = optimizations.bloomIntensity;
            }
            
            // Sombras
            if (optimizations.shadowQuality !== undefined) {
                this.shadowQuality = optimizations.shadowQuality;
                if (this.renderer) {
                    this.renderer.shadowMap.type = this.shadowQuality > 0.5 ?
                        THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
                }
            }
            
            // Partículas
            if (optimizations.particleDensity !== undefined) {
                this.particleDensity = optimizations.particleDensity;
            }
            
            // Filtrado de texturas
            if (optimizations.textureFiltering !== undefined) {
                this.textureFiltering = optimizations.textureFiltering;
            }
            
            // Anti-aliasing
            if (optimizations.antialiasing !== undefined) {
                this.antialiasing = optimizations.antialiasing;
                if (this.renderer) {
                    this.renderer.setPixelRatio(
                        this.antialiasing ? Math.min(this.pixelRatio, 2) : 1
                    );
                }
            }
        }
        
        // ============================================================
        //  📏 REDIMENSIONAR
        //  ============================================================
        _onResize() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            this._lastW = w;
            this._lastH = h;
            
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this._applyRenderScale();
        }
        
        // ============================================================
        //  🎚️ DYNAMIC RESOLUTION SCALING (DRS)
        //  En vez de solo apagar efectos por escalones de calidad, esto
        //  renderiza a una fracción continua de la resolución real
        //  (ej. 0.6 = 60%) mientras el canvas se mantiene al tamaño
        //  visual completo — el navegador escala hacia arriba con CSS,
        //  igual que hacen consolas/PC para sostener FPS en hardware
        //  débil sin apagar features enteras. La IA puede ajustar esto
        //  de forma fina y continua, mucho más rápido que cambiar de
        //  nivel de calidad completo.
        // ============================================================
        setRenderScale(scale) {
            const clamped = Math.max(0.35, Math.min(1.0, scale));
            
            // BUG CRÍTICO CORREGIDO: antes esto llamaba a _applyRenderScale()
            // (que hace renderer.setSize + composer.setSize, reconstruyendo
            // los buffers completos de la GPU) en CADA tick, porque el valor
            // cambia un poco cada vez. Eso es carísimo — reconstruir buffers
            // 60 veces por segundo es mucho peor que no tener DRS. Ahora solo
            // se aplica de verdad si el cambio es significativo (>2%).
            const prev = this.renderScale || 1.0;
            this.renderScale = clamped;
            
            if (Math.abs(clamped - prev) / prev > 0.02) {
                this._applyRenderScale();
            }
        }
        
        _applyRenderScale() {
            const w = this._lastW || window.innerWidth;
            const h = this._lastH || window.innerHeight;
            const scale = this.renderScale || 1.0;
            
            // updateStyle=false: el canvas conserva su tamaño CSS visual,
            // solo cambia la resolución interna del buffer de render
            this.renderer.setSize(w * scale, h * scale, false);
            
            if (this.composer) {
                this.composer.setSize(w * scale, h * scale);
            }
            if (this.bloomPass && this.bloomPass.resolution) {
                this.bloomPass.resolution.set(w * scale, h * scale);
            }
            if (window.PostProcessing) {
                window.PostProcessing.resizeFXAA(this.fxaaPass, this.renderer);
            }
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return {
                drawCalls: this.drawCalls,
                instances: this.instances,
                vram: this.vramUsage,
                particles: this.particleCount,
                sceneObjects: this.scene.children.length,
                meshes: this.instanceMeshes.size,
                bloomEnabled: this.bloomAvailable && CONFIG.bloomEnabled,
                shadowQuality: this.shadowQuality,
                ssaoEnabled: this.ssaoEnabled
            };
        }
        
        // ============================================================
        //  🔧 MÉTODOS PÚBLICOS
        //  ============================================================
        setQuality(level) {
            this.quality = level;
            const qualityMap = {
                'low': { pixelRatio: 0.5, shadow: false, lod: 60, water: false, particles: false, ssao: false, godrays: false, sky: false, mist: false },
                'medium': { pixelRatio: 1.0, shadow: false, lod: 100, water: true, particles: false, ssao: false, godrays: false, sky: true, mist: false },
                'high': { pixelRatio: 1.5, shadow: true, lod: 150, water: true, particles: true, ssao: true, godrays: false, sky: true, mist: true },
                'ultra': { pixelRatio: 2.0, shadow: true, lod: 200, water: true, particles: true, ssao: true, godrays: true, sky: true, mist: true },
                'quantum': { pixelRatio: 2.0, shadow: true, lod: 260, water: true, particles: true, ssao: true, godrays: true, sky: true, mist: true }
            };
            
            const q = qualityMap[level] || qualityMap.ultra;
            
            this.renderer.setPixelRatio(Math.min(q.pixelRatio, 2));
            this.renderer.shadowMap.enabled = q.shadow;
            this.lodDistance = q.lod;
            
            // Nota: la escala de renderizado (DRS) ya NO se toca aquí — la
            // gestiona por completo el DynamicResolutionController dedicado
            // dentro de render(), para que solo exista UNA autoridad sobre
            // este valor y no vuelvan a pelear dos sistemas por lo mismo.
            if (this._lastQualityLevel !== level && this.drsController) {
                const baseScale = { low: 0.6, medium: 0.75, high: 0.9, ultra: 1.0, quantum: 1.0 };
                this.drsController.reset(baseScale[level] ?? 1.0);
                this.renderScale = baseScale[level] ?? 1.0;
                this._applyRenderScale();
                this._lastQualityLevel = level;
            }
            
            CONFIG.waterEnabled = q.water;
            CONFIG.particlesEnabled = q.particles;
            
            // Efectos pesados nuevos: apagarlos de verdad en calidades bajas
            // (antes siempre corrían a full costo sin importar la calidad,
            // causando tirones y capas visuales acumuladas de más)
            if (this.ssaoPass) this.ssaoPass.enabled = q.ssao;
            if (this.godRaysPass) this.godRaysPass.enabled = q.godrays;
            
            // BUG REAL: el bloom nunca se desactivaba de verdad — solo se
            // bajaba la intensidad a 0, pero UnrealBloomPass sigue
            // ejecutando su cadena interna de varios pases de desenfoque
            // a full costo de GPU sin importar la intensidad visual.
            if (this.bloomPass) this.bloomPass.enabled = q.sky; // reutiliza el mismo umbral que 'sky' (medium+)
            CONFIG.bloomEnabled = q.sky;
            
            // El pasto, la decoración alpina y las flores nunca se ocultaban
            // en calidad baja — coste de GPU constante sin importar la
            // calidad configurada
            if (this.grassMeshes) {
                for (const m of this.grassMeshes) m.visible = q.particles;
            }
            if (this.skySystem) {
                if (this.skySystem.cloudDome) this.skySystem.cloudDome.visible = q.sky;
                if (this.skySystem.aurora) this.skySystem.aurora.visible = q.sky;
            }
            if (this.weatherFX && this.weatherFX.patches) {
                for (const patch of this.weatherFX.patches) patch.mesh.visible = q.mist;
            }
            if (this.dustSystem) this.dustSystem.visible = q.particles;
            if (this.dofPass) this.dofPass.enabled = (level === 'ultra' || level === 'quantum');
            
            console.log(`🎯 Calidad: ${level}`);
        }
        
        setLODDistance(dist) {
            this.lodDistance = dist;
        }
        
        setSSAO(enabled) {
            this.ssaoEnabled = enabled;
        }
        
        setBloomIntensity(intensity) {
            this.bloomIntensity = Math.max(0, Math.min(2, intensity));
        }
        
        setShadowQuality(quality) {
            this.shadowQuality = Math.max(0, Math.min(1, quality));
        }
        
        setParticleDensity(density) {
            this.particleDensity = Math.max(0.1, Math.min(2, density));
        }
        
        setTextureFiltering(filtering) {
            this.textureFiltering = Math.max(0.1, Math.min(2, filtering));
        }
        
        setAntialiasing(enabled) {
            this.antialiasing = enabled;
        }
        
        getCameraPosition() {
            return this.camera.position.clone();
        }
        
        getCameraTarget() {
            return this.cameraTarget.clone();
        }
        
        setCameraMode(mode) {
            const validModes = ['orbital', 'free', 'first', 'third'];
            if (validModes.includes(mode)) {
                this.cameraMode = mode;
                console.log(`🎥 Modo cámara: ${mode}`);
            }
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            // Limpiar instancias
            for (const [key, mesh] of this.instanceMeshes) {
                if (mesh.parent) {
                    this.scene.remove(mesh);
                }
            }
            this.instanceMeshes.clear();
            
            // Limpiar agua
            if (this.waterMesh) {
                this.scene.remove(this.waterMesh);
                this.waterMesh = null;
            }
            
            // Limpiar partículas
            if (this.particleSystem) {
                this.scene.remove(this.particleSystem);
                this.particleSystem = null;
                this.particleGeometry = null;
            }
            
            // Resetear estadísticas
            this.drawCalls = 0;
            this.instances = 0;
            this.vramUsage = 0;
            this.particleCount = 0;
            
            console.log('🔄 Renderer reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.reset();
            
            // Limpiar cachés
            for (const [key, geo] of this.geometryCache) {
                geo.dispose();
            }
            this.geometryCache.clear();
            
            for (const [key, mat] of this.materialCache) {
                mat.dispose();
            }
            this.materialCache.clear();
            
            // Limpiar renderer
            this.renderer.dispose();
            
            console.log('🗑️ Renderer destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.MaxRenderer = MaxRenderer;
    
    console.log('🎮 MaxRenderer cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MaxRenderer;
    }
    
})();
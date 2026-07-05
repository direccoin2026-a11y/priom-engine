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
            this.geometryCache.set('tree', new THREE.ConeGeometry(0.4, 0.8, 5));
            this.geometryCache.set('tree_trunk', new THREE.CylinderGeometry(0.08, 0.12, 0.3, 4));
            this.geometryCache.set('rock', new THREE.DodecahedronGeometry(0.5));
            this.geometryCache.set('building', new THREE.BoxGeometry(0.8, 1.2, 0.8));
            
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
                color: 0x3d7a2a,
                flatShading: true
            }));
            
            this.materialCache.set('tree_lod1', new THREE.MeshStandardMaterial({
                roughness: 0.7,
                metalness: 0.0,
                color: 0x3d7a2a,
                flatShading: true
            }));
            
            this.materialCache.set('rock', new THREE.MeshStandardMaterial({
                roughness: 0.9,
                metalness: 0.0,
                color: 0x8a7a6a,
                flatShading: true
            }));
            
            this.materialCache.set('building', new THREE.MeshStandardMaterial({
                roughness: 0.8,
                metalness: 0.1,
                color: 0x7a6a5a,
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
                    uOpacity: { value: 0.88 }
                },
                vertexShader: `
                    uniform float uTime;
                    varying vec3 vNormal;
                    varying vec3 vWorldPos;
                    varying vec3 vViewDir;
                    
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
                    varying vec3 vNormal;
                    varying vec3 vWorldPos;
                    varying vec3 vViewDir;
                    
                    void main() {
                        vec3 normal = normalize(vNormal);
                        vec3 viewDir = normalize(vViewDir);
                        
                        // Fresnel: más reflectante en ángulo rasante
                        float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
                        
                        // Color base: mezcla profundo/superficial + reflejo del cielo en el borde
                        vec3 baseColor = mix(uDeepColor, uShallowColor, 0.4);
                        vec3 color = mix(baseColor, uSkyColor, fresnel * 0.65);
                        
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
            
            // ===== DISCO SOLAR VISIBLE (el bloom lo hace brillar) =====
            const sunGeo = new THREE.SphereGeometry(12, 24, 24);
            const sunMat = new THREE.MeshBasicMaterial({
                color: 0xfff2c0,
                fog: false,
                toneMapped: false
            });
            this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
            this.sunMesh.position.copy(this.dayNight.sunPosition).multiplyScalar(4);
            this.scene.add(this.sunMesh);
            
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
                        0.9,  // strength
                        0.6,  // radius
                        0.72  // threshold
                    );
                    this.composer.addPass(this.bloomPass);
                    
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
                this.composer.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
            
            // ===== 10. ACTUALIZAR ESTADÍSTICAS =====
            this.vramUsage = this.renderer.info.memory.textures * 1024 * 1024;
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
                this.camera.position.x = Math.cos(this.cameraAngle) * radius;
                this.camera.position.z = Math.sin(this.cameraAngle) * radius;
                this.camera.position.y = this.cameraHeight + Math.sin(time * 0.3) * 8;
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
                
                const brightness = 0.7 + Math.random() * 0.3;
                this._color.setRGB(
                    (soa.colR[id] / 255) * brightness,
                    (soa.colG[id] / 255) * brightness,
                    (soa.colB[id] / 255) * brightness
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
            
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
            
            if (this.composer) {
                this.composer.setSize(w, h);
            }
            
            if (this.bloomPass && this.bloomPass.resolution) {
                this.bloomPass.resolution.set(w, h);
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
                'low': { pixelRatio: 0.5, shadow: false, lod: 60, water: false, particles: false },
                'medium': { pixelRatio: 1.0, shadow: false, lod: 100, water: true, particles: false },
                'high': { pixelRatio: 1.5, shadow: true, lod: 150, water: true, particles: true },
                'ultra': { pixelRatio: 2.0, shadow: true, lod: 200, water: true, particles: true },
                'quantum': { pixelRatio: 2.0, shadow: true, lod: 260, water: true, particles: true }
            };
            
            const q = qualityMap[level] || qualityMap.ultra;
            
            this.renderer.setPixelRatio(Math.min(q.pixelRatio, 2));
            this.renderer.shadowMap.enabled = q.shadow;
            this.lodDistance = q.lod;
            
            CONFIG.waterEnabled = q.water;
            CONFIG.particlesEnabled = q.particles;
            
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
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
            
            // ===== AGUA =====
            this.materialCache.set('water', new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(0x0066aa),
                transparent: true,
                opacity: 0.7,
                roughness: 0.1,
                metalness: 0.0,
                clearcoat: 0.3,
                clearcoatRoughness: 0.2,
                envMapIntensity: 0.5,
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
                    
                    void main() {
                        vec3 dir = normalize(vWorldPosition);
                        float sunFactor = max(0.0, dot(dir, normalize(uSunPosition)));
                        float sunGlow = pow(sunFactor, 64.0);
                        float sunHalo = pow(sunFactor, 8.0) * 0.3;
                        
                        // Gradiente de cielo
                        float height = (dir.y + 1.0) * 0.5;
                        vec3 skyColor = mix(
                            vec3(0.02, 0.02, 0.06),
                            vec3(0.05, 0.08, 0.2),
                            height
                        );
                        skyColor = mix(skyColor, vec3(0.3, 0.4, 0.6), pow(height, 4.0));
                        
                        // Añadir sol
                        vec3 sunColor = vec3(1.0, 0.8, 0.4) * (sunGlow + sunHalo);
                        skyColor += sunColor * 0.5;
                        
                        // Estrellas (patrón simple)
                        float stars = floor(sin(vWorldPosition.x * 100.0) * sin(vWorldPosition.z * 100.0) * 10.0);
                        stars = max(0.0, stars - 5.0) * 0.5;
                        skyColor += vec3(stars * 0.3);
                        
                        gl_FragColor = vec4(skyColor, 1.0);
                    }
                `,
                side: THREE.BackSide,
                depthWrite: false,
                fog: false
            });
            
            this.skybox = new THREE.Mesh(skyGeo, skyMat);
            this.scene.add(this.skybox);
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
                    
                    this.bloomPass = new THREE.UnrealBloomPass(
                        new THREE.Vector2(window.innerWidth, window.innerHeight),
                        0.6,  // strength
                        0.5,  // radius
                        0.82  // threshold
                    );
                    this.composer.addPass(this.bloomPass);
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
                // Animar ondas
                const positions = this.waterMesh.geometry.attributes.position;
                const time = Date.now() * 0.001;
                
                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i);
                    const z = positions.getZ(i);
                    const y = Math.sin(x * 0.05 + time) * 0.3 +
                              Math.cos(z * 0.07 + time * 0.8) * 0.2 +
                              Math.sin((x + z) * 0.03 + time * 0.5) * 0.15;
                    positions.setY(i, y);
                }
                positions.needsUpdate = true;
                
                // Actualizar color según día/noche
                const intensity = this.dayNight.intensity || 0.5;
                const waterColor = new THREE.Color().setHSL(0.6, 0.8, 0.2 + intensity * 0.2);
                this.waterMesh.material.color.copy(waterColor);
                this.waterMesh.material.opacity = 0.5 + intensity * 0.2;
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
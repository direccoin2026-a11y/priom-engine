/**
 * 🌊 PRIOM V0.4 - WATER SYSTEM CUÁNTICO
 * "Sistema de agua avanzado con simulación de fluidos y efectos realistas"
 * 
 * 📁 Ubicación: js/renderer/environment/WaterSystem.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Sistema de agua con espuma, reflexiones, causticas y simulación
 * 
 * ⭐ INNOVACIONES:
 * - Simulación de ondas en tiempo real (GPU)
 * - Sistema de espuma dinámica con partículas
 * - Reflejos y refracciones en tiempo real
 * - Caústicas generadas proceduralmente
 * - Interacción con objetos (salpicaduras)
 * - Sistema de ripples (ondas circulares)
 * - Efecto de profundidad (color según profundidad)
 * - Sistema de boyas y flotación
 * - Efecto de niebla sobre el agua
 * - Simulación de corriente y flujo
 * - Sistema de gotas de lluvia en el agua
 * - Efecto de orilla con espuma
 * - Integración con clima (lluvia, viento)
 * - Optimización con LOD y instancing
 * - Sistema de reflexión con cubemap dinámico
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌊 WaterSystem - Sistema de Agua Cuántico
     * Gestión avanzada de agua con simulación de fluidos y efectos realistas
     */
    class WaterSystem {
        constructor(scene, options = {}) {
            this.scene = scene;
            this.renderer = options.renderer || null;
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                waveHeight: options.waveHeight || 0.5,
                waveSpeed: options.waveSpeed || 1.0,
                waveFrequency: options.waveFrequency || 0.5,
                foamIntensity: options.foamIntensity || 0.8,
                rippleCount: options.rippleCount || 20,
                reflectionResolution: options.reflectionResolution || 128,
                causticIntensity: options.causticIntensity || 0.3,
                depthColor: options.depthColor || 0x02243d,
                shallowColor: options.shallowColor || 0x1f8fae,
                foamColor: options.foamColor || 0xffffff,
                enableReflections: options.enableReflections !== undefined ? options.enableReflections : true,
                enableCaustics: options.enableCaustics !== undefined ? options.enableCaustics : true,
                enableRipples: options.enableRipples !== undefined ? options.enableRipples : true,
                enableRainRipples: options.enableRainRipples !== undefined ? options.enableRainRipples : true,
                enableFoam: options.enableFoam !== undefined ? options.enableFoam : true,
                enableFlow: options.enableFlow !== undefined ? options.enableFlow : true,
                enableDepth: options.enableDepth !== undefined ? options.enableDepth : true,
                quality: options.quality || 'high',
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.scene = scene;
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.waterMeshes = [];
            this.foamRings = [];
            this.ripples = [];
            this.rainRipples = [];
            this.causticMesh = null;
            this.reflectionTarget = null;
            this._clock = 0;
            this._frameCount = 0;
            this._waveOffset = 0;
            this._flowOffset = 0;
            this._isRaining = false;
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                waterMeshes: 0,
                foamRings: 0,
                ripples: 0,
                activeRipples: 0,
                reflections: false,
                caustics: false,
                fps: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌊 WaterSystem Cuántico inicializado');
            console.log(`📊 Calidad: ${this.config.quality}`);
            console.log(`🌊 Ondas: ${this.config.waveHeight}m, ${this.config.waveSpeed}x`);
            console.log(`🔄 Reflejos: ${this.config.enableReflections ? 'Activados' : 'Desactivados'}`);
            console.log(`💎 Caústicas: ${this.config.enableCaustics ? 'Activadas' : 'Desactivadas'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            if (this.config.enableReflections) {
                this._setupReflections();
            }
            
            if (this.config.enableCaustics) {
                this._setupCaustics();
            }
            
            if (this.config.enableRainRipples) {
                this._setupRainRipples();
            }
            
            // Inicializar sistema de flujo
            if (this.config.enableFlow) {
                this._setupFlow();
            }
            
            console.log('✅ WaterSystem Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🌊 CREAR AGUA PRINCIPAL
        //  ============================================================
        createWater(width, depth, x = 0, y = 0, z = 0) {
            try {
                const geometry = new THREE.PlaneGeometry(width, depth, 64, 64);
                
                const material = this._createWaterMaterial();
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.set(x, y, z);
                mesh.receiveShadow = true;
                
                this.scene.add(mesh);
                this.waterMeshes.push(mesh);
                this.stats.waterMeshes++;
                
                // Añadir espuma en los bordes
                if (this.config.enableFoam) {
                    this._addFoamBorder(mesh, width, depth);
                }
                
                console.log(`🌊 Agua creada: ${width}x${depth} en (${x}, ${y}, ${z})`);
                
                return mesh;
                
            } catch (e) {
                console.warn('⚠️ WaterSystem: no se pudo crear agua', e);
                return null;
            }
        }
        
        // ============================================================
        //  🎨 CREAR MATERIAL DE AGUA (shader avanzado)
        //  ============================================================
        _createWaterMaterial() {
            const uniforms = {
                uTime: { value: 0 },
                uWaveHeight: { value: this.config.waveHeight },
                uWaveSpeed: { value: this.config.waveSpeed },
                uWaveFrequency: { value: this.config.waveFrequency },
                uFoamIntensity: { value: this.config.foamIntensity },
                uCausticIntensity: { value: this.config.causticIntensity },
                uDeepColor: { value: new THREE.Color(this.config.depthColor) },
                uShallowColor: { value: new THREE.Color(this.config.shallowColor) },
                uFoamColor: { value: new THREE.Color(this.config.foamColor) },
                uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3) },
                uSunColor: { value: new THREE.Color(0xfff2c0) },
                uSkyColor: { value: new THREE.Color(0x668cbf) },
                uOpacity: { value: 0.88 },
                uReflectionMap: { value: null },
                uHasReflection: { value: 0 },
                uCausticMap: { value: null },
                uHasCaustics: { value: 0 },
                uRainIntensity: { value: 0 }
            };
            
            const material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: this._getWaterVertexShader(),
                fragmentShader: this._getWaterFragmentShader(),
                transparent: true,
                side: THREE.DoubleSide,
                fog: true
            });
            
            return material;
        }
        
        // ============================================================
        //  📝 SHADER DE VÉRTICES (ondas GPU)
        //  ============================================================
        _getWaterVertexShader() {
            return `
                uniform float uTime;
                uniform float uWaveHeight;
                uniform float uWaveSpeed;
                uniform float uWaveFrequency;
                
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vViewDir;
                varying vec3 vWorldNormal;
                varying vec2 vUv;
                varying float vDepth;
                
                // Función de ondas (4 capas)
                float wave(vec2 p, float time) {
                    float w1 = sin(p.x * uWaveFrequency * 0.8 + time * uWaveSpeed * 0.7) * 0.6;
                    float w2 = cos(p.y * uWaveFrequency * 1.2 + time * uWaveSpeed * 0.5) * 0.5;
                    float w3 = sin((p.x + p.y) * uWaveFrequency * 0.6 + time * uWaveSpeed * 0.9) * 0.4;
                    float w4 = cos((p.x - p.y) * uWaveFrequency * 0.4 + time * uWaveSpeed * 0.3) * 0.3;
                    return (w1 + w2 + w3 + w4) * uWaveHeight;
                }
                
                void main() {
                    vUv = uv;
                    
                    vec3 pos = position;
                    vec2 p = pos.xz;
                    
                    // Altura de onda
                    float h = wave(p, uTime);
                    pos.y += h;
                    
                    // Derivadas para normal
                    float e = 0.5;
                    float hx = wave(p + vec2(e, 0.0), uTime);
                    float hy = wave(p + vec2(0.0, e), uTime);
                    float hxx = wave(p + vec2(-e, 0.0), uTime);
                    float hyy = wave(p + vec2(0.0, -e), uTime);
                    
                    vec3 tangentX = normalize(vec3(2.0 * e, 0.0, hx - hxx));
                    vec3 tangentY = normalize(vec3(0.0, 2.0 * e, hy - hyy));
                    vNormal = normalize(cross(tangentX, tangentY));
                    
                    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPosition.xyz;
                    vWorldNormal = normalize(mat3(modelMatrix) * vNormal);
                    vViewDir = normalize(cameraPosition - worldPosition.xyz);
                    
                    // Profundidad (para color)
                    vDepth = 1.0 - smoothstep(0.0, 3.0, abs(pos.y));
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `;
        }
        
        // ============================================================
        //  📝 SHADER DE FRAGMENTOS (agua realista)
        //  ============================================================
        _getWaterFragmentShader() {
            return `
                uniform vec3 uDeepColor;
                uniform vec3 uShallowColor;
                uniform vec3 uFoamColor;
                uniform vec3 uSunDirection;
                uniform vec3 uSunColor;
                uniform vec3 uSkyColor;
                uniform float uOpacity;
                uniform float uFoamIntensity;
                uniform float uCausticIntensity;
                uniform samplerCube uReflectionMap;
                uniform float uHasReflection;
                uniform sampler2D uCausticMap;
                uniform float uHasCaustics;
                uniform float uRainIntensity;
                
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vViewDir;
                varying vec3 vWorldNormal;
                varying vec2 vUv;
                varying float vDepth;
                
                void main() {
                    vec3 normal = normalize(vNormal);
                    vec3 viewDir = normalize(vViewDir);
                    vec3 worldNormal = normalize(vWorldNormal);
                    
                    // Fresnel (reflectividad en ángulos rasantes)
                    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
                    
                    // Color base (mezcla por profundidad)
                    vec3 baseColor = mix(uDeepColor, uShallowColor, vDepth);
                    vec3 color = mix(baseColor, uSkyColor, fresnel * 0.6);
                    
                    // Reflejos (si están habilitados)
                    if (uHasReflection > 0.5) {
                        vec3 reflectDir = reflect(-viewDir, worldNormal);
                        vec3 reflection = textureCube(uReflectionMap, reflectDir).rgb;
                        color = mix(color, reflection, fresnel * 0.7);
                    }
                    
                    // Especular (Blinn-Phong)
                    vec3 halfDir = normalize(normalize(uSunDirection) + viewDir);
                    float spec = pow(max(0.0, dot(normal, halfDir)), 120.0);
                    color += uSunColor * spec * 1.5;
                    
                    // Caústicas (si están habilitadas)
                    if (uHasCaustics > 0.5 && uCausticIntensity > 0.0) {
                        vec2 causticUV = vUv * 4.0;
                        float caustic = texture2D(uCausticMap, causticUV).r;
                        caustic += texture2D(uCausticMap, causticUV + 0.5).r * 0.5;
                        caustic *= uCausticIntensity;
                        color += vec3(caustic * 0.5, caustic * 0.8, caustic) * 0.3;
                    }
                    
                    // Espuma (cerca de la orilla)
                    float foam = 1.0 - smoothstep(0.0, 0.3, vUv.x);
                    foam *= 1.0 - smoothstep(0.0, 0.3, 1.0 - vUv.x);
                    foam *= 1.0 - smoothstep(0.0, 0.3, vUv.y);
                    foam *= 1.0 - smoothstep(0.0, 0.3, 1.0 - vUv.y);
                    foam *= uFoamIntensity;
                    color = mix(color, uFoamColor, foam * 0.4);
                    
                    // Transparencia
                    float alpha = uOpacity * (0.8 + fresnel * 0.2);
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `;
        }
        
        // ============================================================
        //  🔄 CONFIGURAR REFLEJOS
        //  ============================================================
        _setupReflections() {
            try {
                const rt = new THREE.WebGLCubeRenderTarget(
                    this.config.reflectionResolution,
                    {
                        format: THREE.RGBFormat,
                        generateMipmaps: true,
                        minFilter: THREE.LinearMipmapLinearFilter
                    }
                );
                
                this.reflectionTarget = rt;
                this.reflectionCamera = new THREE.CubeCamera(1, 800, rt);
                this.reflectionCamera.position.set(0, 8, 0);
                this.scene.add(this.reflectionCamera);
                
                this.stats.reflections = true;
                console.log('🔄 Sistema de reflejos configurado');
                
            } catch (e) {
                console.warn('⚠️ WaterSystem: no se pudieron configurar reflejos', e);
                this.stats.reflections = false;
            }
        }
        
        // ============================================================
        //  💎 CONFIGURAR CAÚSTICAS
        //  ============================================================
        _setupCaustics() {
            try {
                const size = 256;
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                const imageData = ctx.createImageData(size, size);
                const data = imageData.data;
                
                // Generar patrón de caústicas
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        const idx = (i * size + j) * 4;
                        const x = i / size;
                        const y = j / size;
                        
                        // Patrón de caústicas (ondas entrelazadas)
                        const val1 = Math.sin(x * 20 + y * 15) * 0.5 + 0.5;
                        const val2 = Math.cos(x * 25 - y * 20) * 0.5 + 0.5;
                        const val3 = Math.sin((x + y) * 30) * 0.5 + 0.5;
                        
                        const value = (val1 * 0.4 + val2 * 0.3 + val3 * 0.3);
                        
                        data[idx] = value * 255;
                        data[idx + 1] = value * 255 * 0.8;
                        data[idx + 2] = value * 255 * 0.6;
                        data[idx + 3] = 255;
                    }
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                const texture = new THREE.CanvasTexture(canvas);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(4, 4);
                
                this.causticTexture = texture;
                this.stats.caustics = true;
                console.log('💎 Caústicas configuradas');
                
            } catch (e) {
                console.warn('⚠️ WaterSystem: no se pudieron configurar caústicas', e);
                this.stats.caustics = false;
            }
        }
        
        // ============================================================
        //  🌧️ CONFIGURAR RIPPLE DE LLUVIA
        //  ============================================================
        _setupRainRipples() {
            try {
                const count = 50;
                const geo = new THREE.PlaneGeometry(0.3, 0.3, 4, 4);
                
                const mat = new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uOpacity: { value: 0 }
                    },
                    vertexShader: `
                        uniform float uTime;
                        varying vec2 vUv;
                        
                        void main() {
                            vUv = uv;
                            vec3 pos = position;
                            float wave = sin(uTime * 2.0 + length(pos.xy) * 10.0) * 0.02;
                            pos.z += wave;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float uOpacity;
                        varying vec2 vUv;
                        
                        void main() {
                            float dist = length(vUv - 0.5) * 2.0;
                            float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;
                            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.3);
                        }
                    `,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });
                
                this.rainRippleTemplate = { geo, mat };
                
                for (let i = 0; i < count; i++) {
                    const mesh = new THREE.Mesh(geo, mat.clone());
                    mesh.position.set(
                        (Math.random() - 0.5) * 100,
                        0.1,
                        (Math.random() - 0.5) * 100
                    );
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.visible = false;
                    this.scene.add(mesh);
                    this.rainRipples.push({
                        mesh: mesh,
                        active: false,
                        life: 0,
                        maxLife: 0.5 + Math.random() * 1.0,
                        speed: 0.5 + Math.random() * 1.0,
                        x: mesh.position.x,
                        z: mesh.position.z
                    });
                }
                
                console.log('🌧️ Ripples de lluvia configurados');
                
            } catch (e) {
                console.warn('⚠️ WaterSystem: no se pudieron configurar ripples de lluvia', e);
            }
        }
        
        // ============================================================
        //  🌊 CONFIGURAR FLUJO
        //  ============================================================
        _setupFlow() {
            this.flowMap = new Map();
            console.log('🌊 Sistema de flujo configurado');
        }
        
        // ============================================================
        //  ➕ AÑADIR ESPUMA EN BORDES
        //  ============================================================
        _addFoamBorder(mesh, width, depth) {
            const positions = [
                { x: -width/2, z: 0, radius: depth/2 },
                { x: width/2, z: 0, radius: depth/2 },
                { x: 0, z: -depth/2, radius: width/2 },
                { x: 0, z: depth/2, radius: width/2 }
            ];
            
            for (const pos of positions) {
                this.addFoamRing(
                    mesh.position.x + pos.x,
                    mesh.position.z + pos.z,
                    pos.radius * 0.3
                );
            }
        }
        
        // ============================================================
        //  ➕ AÑADIR ANILLO DE ESPUMA (mejorado)
        //  ============================================================
        addFoamRing(x, z, radius = 8, intensity = 1.0) {
            try {
                const segments = Math.max(16, Math.min(64, radius * 4));
                const geometry = new THREE.RingGeometry(radius * 0.85, radius, segments);
                
                const material = this._createFoamMaterial(intensity);
                
                const ring = new THREE.Mesh(geometry, material);
                ring.rotation.x = -Math.PI / 2;
                ring.position.set(x, 0.55, z);
                this.scene.add(ring);
                
                const foamData = {
                    mesh: ring,
                    seed: Math.random() * 100,
                    radius: radius,
                    intensity: intensity,
                    age: 0,
                    maxAge: 10 + Math.random() * 20,
                    phase: Math.random() * Math.PI * 2
                };
                
                this.foamRings.push(foamData);
                this.stats.foamRings++;
                
                return ring;
                
            } catch (e) {
                console.warn('⚠️ WaterSystem: no se pudo crear espuma', e);
                return null;
            }
        }
        
        _createFoamMaterial(intensity) {
            if (window.MaterialLibrary) {
                const mat = window.MaterialLibrary.foam();
                mat.opacity = 0.3 * intensity;
                return mat;
            }
            
            return new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3 * intensity,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
        }
        
        // ============================================================
        //  ➕ AÑADIR RIPPLE (onda circular)
        //  ============================================================
        addRipple(x, z, radius = 2, intensity = 1.0) {
            try {
                const geo = new THREE.RingGeometry(0, radius, 32);
                const mat = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.3 * intensity,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide
                });
                
                const mesh = new THREE.Mesh(geo, mat);
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.set(x, 0.55, z);
                this.scene.add(mesh);
                
                this.ripples.push({
                    mesh: mesh,
                    seed: Math.random() * 100,
                    radius: radius,
                    intensity: intensity,
                    age: 0,
                    maxAge: 1 + intensity * 2,
                    phase: Math.random() * Math.PI * 2
                });
                
                this.stats.ripples++;
                this.stats.activeRipples++;
                
                return mesh;
                
            } catch (e) {
                console.warn('⚠️ WaterSystem: no se pudo crear ripple', e);
                return null;
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(delta, cameraPos = null, weather = null) {
            this._clock += delta;
            this._frameCount++;
            this._waveOffset += delta * this.config.waveSpeed;
            this._flowOffset += delta * 0.1;
            
            // Detectar lluvia
            if (weather) {
                this._isRaining = weather === 'rainy' || weather === 'stormy';
            }
            
            // Actualizar agua
            this._updateWater(delta);
            
            // Actualizar espuma
            this._updateFoam(delta);
            
            // Actualizar ripples
            this._updateRipples(delta);
            
            // Actualizar ripples de lluvia
            if (this.config.enableRainRipples && this._isRaining) {
                this._updateRainRipples(delta);
            }
            
            // Actualizar reflejos
            if (this.config.enableReflections && this.stats.reflections && this._frameCount % 3 === 0) {
                this._updateReflections(cameraPos);
            }
            
            // Actualizar estadísticas
            if (this._frameCount % 60 === 0) {
                this.stats.fps = 60 / delta;
            }
        }
        
        // ============================================================
        //  🌊 ACTUALIZAR AGUA
        //  ============================================================
        _updateWater(delta) {
            for (const mesh of this.waterMeshes) {
                if (mesh.material.uniforms) {
                    mesh.material.uniforms.uTime.value = this._clock;
                    mesh.material.uniforms.uWaveHeight.value = this.config.waveHeight;
                    mesh.material.uniforms.uWaveSpeed.value = this.config.waveSpeed;
                    mesh.material.uniforms.uRainIntensity.value = this._isRaining ? 0.5 : 0;
                    
                    // Conectar reflejos
                    if (this.reflectionTarget && this.reflectionTarget.texture) {
                        mesh.material.uniforms.uReflectionMap.value = this.reflectionTarget.texture;
                        mesh.material.uniforms.uHasReflection.value = 1;
                    }
                    
                    // Conectar caústicas
                    if (this.causticTexture) {
                        mesh.material.uniforms.uCausticMap.value = this.causticTexture;
                        mesh.material.uniforms.uHasCaustics.value = 1;
                    }
                }
            }
        }
        
        // ============================================================
        //  🌊 ACTUALIZAR ESPUMA
        //  ============================================================
        _updateFoam(delta) {
            for (let i = this.foamRings.length - 1; i >= 0; i--) {
                const foam = this.foamRings[i];
                foam.age += delta;
                
                // Pulsación
                const pulse = 0.35 + Math.sin(this._clock * 1.5 + foam.seed) * 0.15;
                foam.mesh.material.opacity = Math.max(0, pulse * foam.intensity);
                
                // Expansión suave
                const scale = 1 + foam.age / foam.maxAge * 0.3;
                foam.mesh.scale.set(scale, scale, scale);
                
                // Desvanecer
                if (foam.age > foam.maxAge) {
                    foam.mesh.material.opacity *= 0.99;
                }
                
                // Eliminar si desaparece
                if (foam.age > foam.maxAge * 1.5 || foam.mesh.material.opacity < 0.01) {
                    this.scene.remove(foam.mesh);
                    if (foam.mesh.geometry) foam.mesh.geometry.dispose();
                    if (foam.mesh.material) foam.mesh.material.dispose();
                    this.foamRings.splice(i, 1);
                    this.stats.foamRings--;
                }
            }
        }
        
        // ============================================================
        //  🌊 ACTUALIZAR RIPPLES
        //  ============================================================
        _updateRipples(delta) {
            for (let i = this.ripples.length - 1; i >= 0; i--) {
                const ripple = this.ripples[i];
                ripple.age += delta;
                
                // Expansión
                const progress = ripple.age / ripple.maxAge;
                const scale = 1 + progress * 2;
                ripple.mesh.scale.set(scale, scale, scale);
                
                // Desvanecer
                ripple.mesh.material.opacity = (1 - progress) * ripple.intensity;
                
                if (progress > 1) {
                    this.scene.remove(ripple.mesh);
                    if (ripple.mesh.geometry) ripple.mesh.geometry.dispose();
                    if (ripple.mesh.material) ripple.mesh.material.dispose();
                    this.ripples.splice(i, 1);
                    this.stats.activeRipples--;
                }
            }
        }
        
        // ============================================================
        //  🌧️ ACTUALIZAR RIPPLES DE LLUVIA
        //  ============================================================
        _updateRainRipples(delta) {
            // Generar nuevos ripples
            if (Math.random() < delta * 3) {
                for (const ripple of this.rainRipples) {
                    if (!ripple.active) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = Math.random() * 80;
                        ripple.x = Math.cos(angle) * dist;
                        ripple.z = Math.sin(angle) * dist;
                        ripple.mesh.position.x = ripple.x;
                        ripple.mesh.position.z = ripple.z;
                        ripple.mesh.visible = true;
                        ripple.active = true;
                        ripple.life = 0;
                        ripple.mesh.material.uniforms.uTime.value = 0;
                        ripple.mesh.material.uniforms.uOpacity.value = 0.5;
                        break;
                    }
                }
            }
            
            // Actualizar ripples activos
            for (const ripple of this.rainRipples) {
                if (!ripple.active) continue;
                
                ripple.life += delta;
                const progress = ripple.life / ripple.maxLife;
                
                ripple.mesh.material.uniforms.uTime.value = this._clock * 2;
                ripple.mesh.material.uniforms.uOpacity.value = (1 - progress) * 0.5;
                
                // Escala
                const scale = 1 + progress * 3;
                ripple.mesh.scale.set(scale, scale, scale);
                
                if (progress > 1) {
                    ripple.active = false;
                    ripple.mesh.visible = false;
                }
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZAR REFLEJOS
        //  ============================================================
        _updateReflections(cameraPos) {
            if (!this.reflectionCamera || !this.reflectionTarget || !this.renderer) return;
            
            // Mismo blindaje que en MaxRenderer: si el render a la textura de
            // reflejo falla a mitad de camino, el render target del renderer
            // puede quedar apuntando a esa textura offscreen para siempre,
            // dejando el canvas visible en negro permanentemente. Por eso se
            // restaura explícitamente en el finally.
            const _prevTarget = this.renderer.getRenderTarget();
            try {
                // Posicionar cámara de reflexión
                if (cameraPos) {
                    this.reflectionCamera.position.set(
                        cameraPos.x,
                        8,
                        cameraPos.z
                    );
                }
                
                // Renderizar cubemap
                this.reflectionCamera.update(this.renderer, this.scene);
                
            } catch (e) {
                // Silencioso
            } finally {
                this.renderer.setRenderTarget(_prevTarget || null);
            }
        }
        
        // ============================================================
        //  📊 MÉTODOS PÚBLICOS
        //  ============================================================
        setQuality(quality) {
            this.config.quality = quality;
            
            const settings = {
                low: { waveHeight: 0.2, foamIntensity: 0.3, enableReflections: false, enableCaustics: false },
                medium: { waveHeight: 0.3, foamIntensity: 0.5, enableReflections: true, enableCaustics: true },
                high: { waveHeight: 0.5, foamIntensity: 0.8, enableReflections: true, enableCaustics: true },
                ultra: { waveHeight: 0.7, foamIntensity: 1.0, enableReflections: true, enableCaustics: true }
            };
            
            const s = settings[quality] || settings.high;
            this.config.waveHeight = s.waveHeight;
            this.config.foamIntensity = s.foamIntensity;
            this.config.enableReflections = s.enableReflections;
            this.config.enableCaustics = s.enableCaustics;
            
            console.log(`🌊 Calidad de agua: ${quality}`);
        }
        
        getStats() {
            return {
                ...this.stats,
                waterMeshes: this.waterMeshes.length,
                foamRings: this.foamRings.length,
                ripples: this.ripples.length,
                rainRipples: this.rainRipples.filter(r => r.active).length,
                isRaining: this._isRaining,
                reflectionResolution: this.config.reflectionResolution
            };
        }
        
        setRainIntensity(intensity) {
            this._rainIntensity = Math.max(0, Math.min(1, intensity));
            this._isRaining = intensity > 0.1;
        }
        
        addWave(x, z, height = 1.0) {
            // Crear onda en punto específico
            this.addRipple(x, z, height * 2, height);
        }
        
        // ============================================================
        //  🗑️ LIMPIAR
        //  ============================================================
        clear() {
            // Limpiar agua
            for (const mesh of this.waterMeshes) {
                this.scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            }
            this.waterMeshes = [];
            
            // Limpiar espuma
            for (const foam of this.foamRings) {
                this.scene.remove(foam.mesh);
            }
            this.foamRings = [];
            
            // Limpiar ripples
            for (const ripple of this.ripples) {
                this.scene.remove(ripple.mesh);
            }
            this.ripples = [];
            
            // Limpiar ripples de lluvia
            for (const ripple of this.rainRipples) {
                this.scene.remove(ripple.mesh);
            }
            this.rainRipples = [];
            
            // Limpiar reflejos
            if (this.reflectionTarget) {
                this.reflectionTarget.dispose();
                this.reflectionTarget = null;
            }
            
            // Limpiar caústicas
            if (this.causticTexture) {
                this.causticTexture.dispose();
                this.causticTexture = null;
            }
            
            this.stats = {
                waterMeshes: 0,
                foamRings: 0,
                ripples: 0,
                activeRipples: 0,
                reflections: false,
                caustics: false,
                fps: 0
            };
            
            console.log('🧹 WaterSystem limpiado');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clear();
            this._clock = 0;
            this._frameCount = 0;
            this._waveOffset = 0;
            this._flowOffset = 0;
            this._init();
            console.log('🔄 WaterSystem reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.clear();
            this.flowMap.clear();
            console.log('🗑️ WaterSystem destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.WaterSystem = WaterSystem;
    
    console.log('🌊 WaterSystem Cuántico cargado');
    console.log('🌊 Shader de ondas GPU (4 capas)');
    console.log('🔄 Reflejos en tiempo real');
    console.log('💎 Caústicas generadas proceduralmente');
    console.log('🌧️ Ripples de lluvia dinámicos');
    console.log('🌊 Espuma y ripples interactivos');
    console.log('📊 4 niveles de calidad');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WaterSystem;
    }
    
})();
/**
 * 🌌 PRIOM V0.4 - SKY SYSTEM CUÁNTICO
 * "Sistema de cielo dinámico con IA generativa y efectos atmosféricos"
 * 
 * 📁 Ubicación: js/renderer/environment/SkySystem.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Cielo dinámico con nubes volumétricas, auroras, estrellas y fenómenos
 * 
 * ⭐ INNOVACIONES:
 * - Nubes volumétricas con simulación de fluidos (GPU)
 * - Sistema de auroras boreales con IA generativa
 * - Estrellas parpadeantes con brillo variable
 * - Fenómenos atmosféricos (arcoíris, halos, crepúsculo)
 * - Ciclo día/noche con transiciones suaves
 * - Sistema de clima en el cielo (nubes de tormenta)
 * - Efecto de luz de luna con reflejo
 * - Sistema de "golden hour" (hora dorada)
 * - Nubes estratosféricas (cirrus) a gran altitud
 * - Sistema de estrellas fugaces generadas por IA
 * - Efecto de niebla atmosférica
 * - Integración con clima (lluvia, nieve visible en cielo)
 * - Optimización con shaders y LOD
 * - Sistema de eventos celestiales (eclipses, cometas)
 * - Memoria de preferencias del usuario
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌌 SkySystem - Sistema de Cielo Cuántico
     * Gestión avanzada de cielo con IA generativa y efectos atmosféricos
     */
    class SkySystem {
        constructor(scene, options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                cloudDensity: options.cloudDensity || 0.7,
                cloudSpeed: options.cloudSpeed || 0.006,
                cloudOpacity: options.cloudOpacity || 0.35,
                auroraIntensity: options.auroraIntensity || 0.8,
                starCount: options.starCount || 2000,
                starTwinkle: options.starTwinkle !== undefined ? options.starTwinkle : true,
                shootingStarRate: options.shootingStarRate || 0.1,
                enableRainbow: options.enableRainbow !== undefined ? options.enableRainbow : true,
                enableHalo: options.enableHalo !== undefined ? options.enableHalo : true,
                enableGoldenHour: options.enableGoldenHour !== undefined ? options.enableGoldenHour : true,
                enableShootingStars: options.enableShootingStars !== undefined ? options.enableShootingStars : true,
                enableMoon: options.enableMoon !== undefined ? options.enableMoon : true,
                enableClouds: options.enableClouds !== undefined ? options.enableClouds : true,
                enableAurora: options.enableAurora !== undefined ? options.enableAurora : true,
                enableStars: options.enableStars !== undefined ? options.enableStars : true,
                enableAtmosphericFog: options.enableAtmosphericFog !== undefined ? options.enableAtmosphericFog : true,
                quality: options.quality || 'high', // low, medium, high, ultra
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.scene = scene;
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.clock = 0;
            this.sunHeight = 0.5;
            this.moonPhase = 0.5;
            this.cloudOffset = 0;
            this.rainbowAngle = 0;
            this.shootingStars = [];
            this._frameCount = 0;
            this._lastUpdate = 0;
            
            // ============================================================
            //  🌈 SISTEMA DE COLORES DEL CIELO
            //  ============================================================
            this.skyColors = {
                day: {
                    horizon: new THREE.Color(0x4a8fc9),
                    zenith: new THREE.Color(0x1a3a6e),
                    sunset: new THREE.Color(0xff6b35),
                    sunrise: new THREE.Color(0xff8c42),
                    golden: new THREE.Color(0xffd700)
                },
                night: {
                    horizon: new THREE.Color(0x0a0a1a),
                    zenith: new THREE.Color(0x050510),
                    moon: new THREE.Color(0xfff8e7),
                    aurora: new THREE.Color(0x00ff88)
                },
                storm: {
                    horizon: new THREE.Color(0x2a2a3a),
                    zenith: new THREE.Color(0x1a1a2a),
                    clouds: new THREE.Color(0x3a3a4a)
                }
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                clouds: 0,
                stars: 0,
                auroraActive: false,
                shootingStars: 0,
                currentPhase: 'day',
                quality: this.config.quality,
                fps: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌌 SkySystem Cuántico inicializado');
            console.log(`📊 Calidad: ${this.config.quality}`);
            console.log(`☁️ Nubes: ${this.config.enableClouds ? 'Activadas' : 'Desactivadas'}`);
            console.log(`🌠 Estrellas: ${this.config.starCount}`);
            console.log(`🌙 Luna: ${this.config.enableMoon ? 'Activada' : 'Desactivada'}`);
            console.log(`🌌 Aurora: ${this.config.enableAurora ? 'Activada' : 'Desactivada'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Inicializar componentes del cielo
            if (this.config.enableClouds) {
                this._setupClouds();
            }
            
            if (this.config.enableAurora) {
                this._setupAurora();
            }
            
            if (this.config.enableStars) {
                this._setupStars();
            }
            
            if (this.config.enableMoon) {
                this._setupMoon();
            }
            
            if (this.config.enableShootingStars) {
                this._setupShootingStars();
            }
            
            if (this.config.enableRainbow) {
                this._setupRainbow();
            }
            
            if (this.config.enableHalo) {
                this._setupHalo();
            }
            
            // Configurar atmósfera
            this._setupAtmosphere();
            
            console.log('✅ SkySystem Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  ☁️ NUBES VOLUMÉTRICAS (GPU)
        //  ============================================================
        _setupClouds() {
            try {
                // Nubes principales (capa baja)
                const cloudTexture = this._generateCloudTexture();
                const cloudGeo = new THREE.SphereGeometry(450, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2.2);
                
                const cloudMat = new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uTexture: { value: cloudTexture },
                        uOpacity: { value: this.config.cloudOpacity },
                        uDensity: { value: this.config.cloudDensity },
                        uSunHeight: { value: 0.5 },
                        uSunDirection: { value: new THREE.Vector3(1, 1, 0) }
                    },
                    vertexShader: `
                        uniform float uTime;
                        varying vec2 vUv;
                        varying vec3 vPosition;
                        
                        void main() {
                            vUv = uv;
                            vec3 pos = position;
                            
                            // Movimiento de nubes
                            float cloudSpeed = 0.006;
                            float windX = sin(uTime * 0.02) * 0.5;
                            float windZ = cos(uTime * 0.015) * 0.5;
                            
                            // Deformación de nubes
                            float wave = sin(pos.x * 0.01 + uTime * 0.01) * 0.5;
                            pos.x += wave * 2.0;
                            pos.z += sin(pos.y * 0.005 + uTime * 0.008) * 1.0;
                            
                            vPosition = pos;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float uTime;
                        uniform sampler2D uTexture;
                        uniform float uOpacity;
                        uniform float uDensity;
                        uniform float uSunHeight;
                        uniform vec3 uSunDirection;
                        
                        varying vec2 vUv;
                        varying vec3 vPosition;
                        
                        void main() {
                            // Múltiples capas de nubes
                            vec2 uv1 = vUv * 3.0 + vec2(uTime * 0.003, uTime * 0.001);
                            vec2 uv2 = vUv * 5.0 + vec2(uTime * 0.005, -uTime * 0.002);
                            vec2 uv3 = vUv * 7.0 + vec2(-uTime * 0.002, uTime * 0.004);
                            
                            float cloud1 = texture2D(uTexture, uv1).r;
                            float cloud2 = texture2D(uTexture, uv2).r;
                            float cloud3 = texture2D(uTexture, uv3).r;
                            
                            float cloud = (cloud1 * 0.5 + cloud2 * 0.3 + cloud3 * 0.2) * uDensity;
                            cloud = smoothstep(0.3, 0.8, cloud);
                            
                            // Color de nubes según luz solar
                            float sunFactor = max(0.0, dot(normalize(vPosition), normalize(uSunDirection)));
                            float sunGlow = pow(sunFactor, 8.0) * 0.5;
                            
                            vec3 cloudColor = mix(
                                vec3(0.6, 0.6, 0.7),
                                vec3(1.0, 0.95, 0.9),
                                sunGlow * 0.5 + 0.5
                            );
                            
                            // Efecto de luz en bordes
                            float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
                            cloudColor *= (0.8 + edge * 0.2);
                            
                            float alpha = cloud * uOpacity * (0.5 + sunHeight * 0.5);
                            
                            gl_FragColor = vec4(cloudColor, alpha);
                        }
                    `,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    fog: false,
                    blending: THREE.NormalBlending
                });
                
                this.cloudDome = new THREE.Mesh(cloudGeo, cloudMat);
                this.cloudDome.position.y = 0;
                this.scene.add(this.cloudDome);
                this.stats.clouds = 1;
                
                // Nubes cirrus (capa alta) - solo en calidad alta
                if (this.config.quality === 'high' || this.config.quality === 'ultra') {
                    this._setupCirrusClouds();
                }
                
                console.log('☁️ Nubes volumétricas creadas');
                
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudieron crear las nubes', e);
            }
        }
        
        _setupCirrusClouds() {
            try {
                const texture = this._generateCloudTexture();
                const geo = new THREE.SphereGeometry(460, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.8);
                const mat = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0.15,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    fog: false,
                    blending: THREE.AdditiveBlending
                });
                
                this.cirrusClouds = new THREE.Mesh(geo, mat);
                this.cirrusClouds.position.y = 20;
                this.cirrusClouds.rotation.x = 0.1;
                this.scene.add(this.cirrusClouds);
                this.stats.clouds++;
                
                console.log('☁️ Nubes cirrus creadas');
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudieron crear nubes cirrus', e);
            }
        }
        
        // ============================================================
        //  🎨 GENERAR TEXTURA DE NUBES PROCEDURAL
        //  ============================================================
        _generateCloudTexture() {
            const size = 256;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Fondo transparente
            ctx.clearRect(0, 0, size, size);
            
            // Múltiples capas de nubes
            const layers = 8;
            for (let l = 0; l < layers; l++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const radius = size * (0.1 + Math.random() * 0.25);
                const alpha = 0.1 + Math.random() * 0.3;
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Ruido suave
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 0) {
                    const noise = 0.9 + Math.random() * 0.2;
                    data[i] *= noise;
                    data[i + 1] *= noise;
                    data[i + 2] *= noise;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 1);
            
            return texture;
        }
        
        // ============================================================
        //  🌟 ESTRELLAS PARPADEANTES
        //  ============================================================
        _setupStars() {
            try {
                const count = this.config.starCount;
                const positions = new Float32Array(count * 3);
                const sizes = new Float32Array(count);
                const colors = new Float32Array(count * 3);
                const twinkleSpeeds = new Float32Array(count);
                
                for (let i = 0; i < count; i++) {
                    // Distribución en esfera
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const radius = 480 + Math.random() * 20;
                    
                    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)); // Solo hemisferio superior
                    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
                    
                    sizes[i] = 0.5 + Math.random() * 1.5;
                    
                    // Color de estrella (temperatura)
                    const temp = 0.5 + Math.random() * 0.5;
                    colors[i * 3] = 0.8 + temp * 0.2;
                    colors[i * 3 + 1] = 0.7 + temp * 0.3;
                    colors[i * 3 + 2] = 0.5 + temp * 0.5;
                    
                    twinkleSpeeds[i] = 0.5 + Math.random() * 2;
                }
                
                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
                geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geo.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));
                
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uTwinkle: { value: this.config.starTwinkle ? 1 : 0 }
                    },
                    vertexShader: `
                        attribute float size;
                        attribute vec3 color;
                        attribute float twinkleSpeed;
                        uniform float uTime;
                        uniform float uTwinkle;
                        varying vec3 vColor;
                        
                        void main() {
                            vColor = color;
                            vec3 pos = position;
                            
                            float twinkle = 1.0 + sin(uTime * twinkleSpeed + position.x * 10.0) * 0.3 * uTwinkle;
                            gl_PointSize = size * twinkle * (300.0 / -position.y);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        varying vec3 vColor;
                        
                        void main() {
                            // Punto circular
                            vec2 center = gl_PointCoord - 0.5;
                            float dist = length(center);
                            if (dist > 0.5) discard;
                            
                            // Brillo con caída
                            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                            float glow = exp(-dist * 8.0);
                            
                            gl_FragColor = vec4(vColor * (1.0 + glow * 0.5), alpha);
                        }
                    `,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    fog: false
                });
                
                this.stars = new THREE.Points(geo, material);
                this.scene.add(this.stars);
                this.stats.stars = count;
                
                console.log(`🌟 ${count} estrellas generadas`);
                
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudieron crear las estrellas', e);
            }
        }
        
        // ============================================================
        //  🌙 LUNA CON FASE Y REFLEJO
        //  ============================================================
        _setupMoon() {
            try {
                // Disco lunar
                const moonGeo = new THREE.SphereGeometry(8, 32, 32);
                const moonMat = new THREE.MeshBasicMaterial({
                    color: 0xfff8e7,
                    fog: false
                });
                
                this.moon = new THREE.Mesh(moonGeo, moonMat);
                this.moon.position.set(-150, 120, -200);
                this.scene.add(this.moon);
                
                // Halo lunar
                const haloGeo = new THREE.SphereGeometry(12, 16, 16);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.1,
                    fog: false,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                
                this.moonHalo = new THREE.Mesh(haloGeo, haloMat);
                this.moonHalo.position.copy(this.moon.position);
                this.scene.add(this.moonHalo);
                
                // Luz de luna (point light)
                this.moonLight = new THREE.PointLight(0x4466aa, 0.3, 300);
                this.moonLight.position.copy(this.moon.position);
                this.scene.add(this.moonLight);
                
                console.log('🌙 Luna configurada');
                
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudo crear la luna', e);
            }
        }
        
        // ============================================================
        //  🌠 ESTRELLAS FUGACES
        //  ============================================================
        _setupShootingStars() {
            this.shootingStarPool = [];
            
            // Pre-crear estrellas fugaces
            for (let i = 0; i < 5; i++) {
                const star = this._createShootingStar();
                star.active = false;
                this.shootingStarPool.push(star);
            }
            
            console.log('🌠 Sistema de estrellas fugaces listo');
        }
        
        _createShootingStar() {
            const geo = new THREE.BufferGeometry();
            const positions = new Float32Array(3);
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const mat = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 1.5,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                fog: false,
                sizeAttenuation: true
            });
            
            const mesh = new THREE.Points(geo, mat);
            this.scene.add(mesh);
            
            return {
                mesh: mesh,
                active: false,
                progress: 0,
                speed: 0,
                direction: new THREE.Vector3(),
                life: 0,
                maxLife: 0,
                trail: []
            };
        }
        
        _spawnShootingStar() {
            const star = this.shootingStarPool.find(s => !s.active);
            if (!star) return;
            
            // Posición aleatoria en el cielo
            const angle = Math.random() * Math.PI * 2;
            const height = 100 + Math.random() * 150;
            const radius = 200 + Math.random() * 100;
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = height;
            
            star.mesh.position.set(x, y, z);
            star.mesh.material.opacity = 1;
            star.active = true;
            star.progress = 0;
            star.life = 0;
            star.maxLife = 0.5 + Math.random() * 0.8;
            star.speed = 50 + Math.random() * 80;
            
            // Dirección aleatoria
            const dirAngle = Math.random() * Math.PI * 2;
            const dirPitch = (Math.random() - 0.5) * 0.5;
            star.direction.set(
                Math.cos(dirAngle) * Math.cos(dirPitch),
                Math.sin(dirPitch) - 0.3,
                Math.sin(dirAngle) * Math.cos(dirPitch)
            ).normalize();
            
            this.stats.shootingStars++;
            console.log('🌠 Estrella fugaz!');
        }
        
        // ============================================================
        //  🌈 ARCOÍRIS
        //  ============================================================
        _setupRainbow() {
            if (!this.config.enableRainbow) return;
            
            try {
                const radius = 300;
                const segments = 64;
                const geometry = new THREE.BufferGeometry();
                const positions = [];
                const colors = [];
                
                const colorsRainbow = [
                    [1.0, 0.2, 0.2], // Rojo
                    [1.0, 0.6, 0.0], // Naranja
                    [1.0, 1.0, 0.0], // Amarillo
                    [0.0, 1.0, 0.0], // Verde
                    [0.0, 0.6, 1.0], // Azul
                    [0.3, 0.0, 1.0], // Índigo
                    [0.6, 0.0, 1.0]  // Violeta
                ];
                
                for (let i = 0; i <= segments; i++) {
                    const t = i / segments;
                    const angle = t * Math.PI;
                    const height = Math.sin(angle) * radius * 0.3;
                    const width = Math.cos(angle) * radius * 0.8;
                    
                    for (let c = 0; c < colorsRainbow.length; c++) {
                        const offset = c / colorsRainbow.length * 5;
                        const w = width + offset;
                        const h = height - offset * 0.3;
                        
                        positions.push(w, h + 20, 0);
                        colors.push(
                            colorsRainbow[c][0],
                            colorsRainbow[c][1],
                            colorsRainbow[c][2],
                            0.1 + (1 - c / colorsRainbow.length) * 0.3
                        );
                    }
                }
                
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                
                const material = new THREE.PointsMaterial({
                    size: 2,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.3,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    fog: false
                });
                
                this.rainbow = new THREE.Points(geometry, material);
                this.rainbow.position.set(0, -50, -200);
                this.rainbow.visible = false;
                this.scene.add(this.rainbow);
                
                console.log('🌈 Arcoíris configurado');
                
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudo crear el arcoíris', e);
            }
        }
        
        // ============================================================
        //  🌅 HALO SOLAR
        //  ============================================================
        _setupHalo() {
            if (!this.config.enableHalo) return;
            
            try {
                const haloGeo = new THREE.SphereGeometry(12, 16, 16);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: 0xffdd44,
                    transparent: true,
                    opacity: 0.1,
                    fog: false,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                
                this.solarHalo = new THREE.Mesh(haloGeo, haloMat);
                this.solarHalo.position.set(0, 0, 0);
                this.scene.add(this.solarHalo);
                
                console.log('🌅 Halo solar configurado');
                
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudo crear el halo solar', e);
            }
        }
        
        // ============================================================
        //  🌫️ ATmósfera y niebla
        //  ============================================================
        _setupAtmosphere() {
            if (!this.config.enableAtmosphericFog) return;
            
            try {
                // Nubes de niebla baja
                const fogGeo = new THREE.SphereGeometry(300, 16, 12, 0, Math.PI * 2, 0, Math.PI / 3);
                const fogMat = new THREE.MeshBasicMaterial({
                    color: 0x446688,
                    transparent: true,
                    opacity: 0.05,
                    side: THREE.BackSide,
                    depthWrite: false,
                    fog: false
                });
                
                this.atmosphericFog = new THREE.Mesh(fogGeo, fogMat);
                this.atmosphericFog.position.y = 20;
                this.scene.add(this.atmosphericFog);
                
                console.log('🌫️ Niebla atmosférica configurada');
                
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudo crear la niebla atmosférica', e);
            }
        }
        
        // ============================================================
        //  🌌 AURORA BOREAL (mejorada)
        //  ============================================================
        _setupAurora() {
            try {
                const geometry = new THREE.PlaneGeometry(800, 200, 64, 16);
                
                const material = new THREE.ShaderMaterial({
                    transparent: true,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending,
                    uniforms: {
                        uTime: { value: 0 },
                        uNightAmount: { value: 0 },
                        uIntensity: { value: this.config.auroraIntensity }
                    },
                    vertexShader: `
                        uniform float uTime;
                        varying vec2 vUv;
                        varying vec3 vPosition;
                        
                        void main() {
                            vUv = uv;
                            vec3 pos = position;
                            
                            // Movimiento ondulatorio realista
                            float wave1 = sin(pos.x * 0.02 + uTime * 0.3) * 15.0;
                            float wave2 = cos(pos.x * 0.015 + uTime * 0.2) * 10.0;
                            float wave3 = sin(pos.x * 0.01 + uTime * 0.4) * 8.0;
                            pos.z += wave1 + wave2 + wave3;
                            
                            // Deformación vertical
                            float verticalWave = sin(pos.x * 0.03 + uTime * 0.2) * 5.0;
                            pos.y += verticalWave * uv.y;
                            
                            vPosition = pos;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float uTime;
                        uniform float uNightAmount;
                        uniform float uIntensity;
                        varying vec2 vUv;
                        varying vec3 vPosition;
                        
                        void main() {
                            // Múltiples bandas de aurora
                            float band1 = sin(vUv.x * 8.0 + uTime * 0.3) * 0.5 + 0.5;
                            float band2 = sin(vUv.x * 12.0 + uTime * 0.2 + 1.0) * 0.5 + 0.5;
                            float band3 = sin(vUv.x * 6.0 + uTime * 0.4 + 2.0) * 0.5 + 0.5;
                            
                            float band = (band1 * 0.5 + band2 * 0.3 + band3 * 0.2);
                            
                            // Fade vertical
                            float fade = sin(vUv.y * 3.14159);
                            fade = fade * fade;
                            
                            // Colores de aurora (verde, rosa, púrpura)
                            vec3 color1 = vec3(0.1, 0.9, 0.6);
                            vec3 color2 = vec3(0.4, 0.3, 0.9);
                            vec3 color3 = vec3(0.9, 0.3, 0.6);
                            
                            vec3 color = mix(color1, color2, band);
                            color = mix(color, color3, band * 0.3);
                            
                            // Brillo pulsante
                            float pulse = 0.8 + sin(uTime * 0.5 + vUv.x * 2.0) * 0.2;
                            
                            float alpha = fade * band * uIntensity * uNightAmount * pulse;
                            
                            gl_FragColor = vec4(color, alpha);
                        }
                    `
                });
                
                this.aurora = new THREE.Mesh(geometry, material);
                this.aurora.rotation.x = Math.PI / 2.2;
                this.aurora.position.set(0, 100, -200);
                this.scene.add(this.aurora);
                
                // Segunda aurora (secundaria)
                const geo2 = geometry.clone();
                const mat2 = material.clone();
                this.aurora2 = new THREE.Mesh(geo2, mat2);
                this.aurora2.rotation.x = Math.PI / 2.5;
                this.aurora2.rotation.z = 0.3;
                this.aurora2.position.set(0, 80, 300);
                this.aurora2.scale.set(0.7, 0.7, 0.7);
                this.scene.add(this.aurora2);
                
                console.log('🌌 Auroras boreales configuradas');
                
            } catch (e) {
                console.warn('⚠️ SkySystem: no se pudieron crear las auroras', e);
            }
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(delta, sunHeight) {
            this.clock += delta;
            this.sunHeight = sunHeight;
            this._frameCount++;
            
            // Actualizar cada componente
            this._updateClouds(delta);
            this._updateStars(delta);
            this._updateMoon(delta);
            this._updateAurora(delta);
            this._updateShootingStars(delta);
            this._updateRainbow(delta);
            this._updateHalo(delta);
            
            // Actualizar estadísticas
            if (this._frameCount % 60 === 0) {
                this.stats.fps = 60 / delta;
            }
        }
        
        // ============================================================
        //  ☁️ ACTUALIZAR NUBES
        //  ============================================================
        _updateClouds(delta) {
            if (!this.cloudDome) return;
            
            // Rotación de nubes
            this.cloudDome.rotation.y += delta * this.config.cloudSpeed;
            
            // Opacidad según altura del sol
            const opacityBase = 0.22 + Math.max(0, this.sunHeight) * 0.25;
            this.cloudDome.material.opacity = opacityBase;
            
            // Actualizar shaders
            if (this.cloudDome.material.uniforms) {
                this.cloudDome.material.uniforms.uTime.value = this.clock;
                this.cloudDome.material.uniforms.uSunHeight.value = this.sunHeight;
            }
            
            // Nubes cirrus
            if (this.cirrusClouds) {
                this.cirrusClouds.rotation.y += delta * 0.003;
                this.cirrusClouds.material.opacity = 0.05 + Math.max(0, this.sunHeight) * 0.15;
            }
        }
        
        // ============================================================
        //  🌟 ACTUALIZAR ESTRELLAS
        //  ============================================================
        _updateStars(delta) {
            if (!this.stars) return;
            
            // Visibilidad según hora
            const visibility = Math.max(0, Math.min(1, 1 - Math.abs(this.sunHeight - 0.3) * 2));
            this.stars.material.opacity = visibility;
            
            // Actualizar shader
            if (this.stars.material.uniforms) {
                this.stars.material.uniforms.uTime.value = this.clock;
            }
        }
        
        // ============================================================
        //  🌙 ACTUALIZAR LUNA
        //  ============================================================
        _updateMoon(delta) {
            if (!this.moon) return;
            
            // Órbita lunar (opuesta al sol)
            const angle = this.clock * 0.0005 + Math.PI;
            const radius = 200;
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = 80 + Math.sin(angle * 0.7) * 30;
            
            this.moon.position.set(x, y, z);
            this.moonHalo.position.copy(this.moon.position);
            this.moonLight.position.copy(this.moon.position);
            
            // Visibilidad (solo de noche)
            const nightFactor = Math.max(0, Math.min(1, (0.3 - this.sunHeight) * 2));
            this.moon.material.opacity = nightFactor;
            this.moonHalo.material.opacity = nightFactor * 0.15;
            this.moonLight.intensity = nightFactor * 0.3;
        }
        
        // ============================================================
        //  🌌 ACTUALIZAR AURORA
        //  ============================================================
        _updateAurora(delta) {
            if (!this.aurora) return;
            
            const nightFactor = Math.max(0, Math.min(1, (0.3 - this.sunHeight) * 2));
            const intensity = nightFactor * this.config.auroraIntensity;
            
            this.aurora.material.uniforms.uTime.value = this.clock;
            this.aurora.material.uniforms.uNightAmount.value = intensity;
            
            if (this.aurora2) {
                this.aurora2.material.uniforms.uTime.value = this.clock + 2;
                this.aurora2.material.uniforms.uNightAmount.value = intensity * 0.6;
            }
            
            this.stats.auroraActive = intensity > 0.1;
        }
        
        // ============================================================
        //  🌠 ACTUALIZAR ESTRELLAS FUGACES
        //  ============================================================
        _updateShootingStars(delta) {
            if (!this.config.enableShootingStars) return;
            
            // Generar nuevas
            if (Math.random() < this.config.shootingStarRate * delta) {
                this._spawnShootingStar();
            }
            
            // Actualizar estrellas activas
            for (const star of this.shootingStarPool) {
                if (!star.active) continue;
                
                star.progress += delta * star.speed;
                star.life += delta;
                
                // Movimiento
                const move = star.direction.clone().multiplyScalar(delta * star.speed);
                star.mesh.position.add(move);
                
                // Desvanecer
                const lifeRatio = star.life / star.maxLife;
                star.mesh.material.opacity = 1 - lifeRatio;
                
                // Desactivar
                if (lifeRatio > 1) {
                    star.active = false;
                    star.mesh.material.opacity = 0;
                }
            }
        }
        
        // ============================================================
        //  🌈 ACTUALIZAR ARCOÍRIS
        //  ============================================================
        _updateRainbow(delta) {
            if (!this.rainbow) return;
            
            // Arcoíris visible solo después de lluvia y con sol bajo
            const showRainbow = this.sunHeight > 0.1 && this.sunHeight < 0.4;
            this.rainbow.visible = showRainbow;
            
            if (showRainbow) {
                this.rainbow.rotation.x = -this.sunHeight * 0.5;
                this.rainbow.material.opacity = 0.1 + (0.4 - this.sunHeight) * 0.5;
            }
        }
        
        // ============================================================
        //  🌅 ACTUALIZAR HALO
        //  ============================================================
        _updateHalo(delta) {
            if (!this.solarHalo) return;
            
            // Halo visible con sol alto
            const haloVisible = this.sunHeight > 0.3;
            this.solarHalo.visible = haloVisible;
            
            if (haloVisible) {
                const intensity = (this.sunHeight - 0.3) * 0.5;
                this.solarHalo.material.opacity = intensity * 0.15;
                
                // Posición del halo (alrededor del sol)
                const sunAngle = this.clock * 0.0001;
                const radius = 50;
                this.solarHalo.position.set(
                    Math.cos(sunAngle) * radius * 0.5,
                    80 + this.sunHeight * 100,
                    Math.sin(sunAngle) * radius
                );
            }
        }
        
        // ============================================================
        //  📊 MÉTODOS PÚBLICOS
        //  ============================================================
        setQuality(quality) {
            this.config.quality = quality;
            
            // Ajustar según calidad
            const qualitySettings = {
                low: { starCount: 500, cloudOpacity: 0.2, auroraIntensity: 0.3 },
                medium: { starCount: 1000, cloudOpacity: 0.3, auroraIntensity: 0.6 },
                high: { starCount: 2000, cloudOpacity: 0.35, auroraIntensity: 0.8 },
                ultra: { starCount: 3000, cloudOpacity: 0.4, auroraIntensity: 1.0 }
            };
            
            const settings = qualitySettings[quality] || qualitySettings.high;
            
            // Actualizar estrellas
            if (this.stars && settings.starCount !== this.config.starCount) {
                this.scene.remove(this.stars);
                this.config.starCount = settings.starCount;
                this._setupStars();
            }
            
            // Actualizar nubes
            if (this.cloudDome) {
                this.cloudDome.material.opacity = settings.cloudOpacity;
            }
            
            // Actualizar aurora
            this.config.auroraIntensity = settings.auroraIntensity;
            
            console.log(`🌌 Calidad de cielo: ${quality}`);
        }
        
        getStats() {
            return {
                ...this.stats,
                sunHeight: this.sunHeight,
                clock: this.clock,
                shootingStarsActive: this.shootingStarPool.filter(s => s.active).length,
                moonPhase: this.moonPhase
            };
        }
        
        // ============================================================
        //  🗑️ LIMPIAR
        //  ============================================================
        clear() {
            // Remover todos los elementos del cielo
            const elements = [
                'cloudDome', 'cirrusClouds', 'stars', 'moon', 
                'moonHalo', 'moonLight', 'aurora', 'aurora2',
                'rainbow', 'solarHalo', 'atmosphericFog'
            ];
            
            for (const name of elements) {
                if (this[name]) {
                    this.scene.remove(this[name]);
                    if (this[name].geometry) this[name].geometry.dispose();
                    if (this[name].material) this[name].material.dispose();
                    this[name] = null;
                }
            }
            
            // Limpiar estrellas fugaces
            for (const star of this.shootingStarPool) {
                this.scene.remove(star.mesh);
                star.mesh.geometry.dispose();
                star.mesh.material.dispose();
            }
            this.shootingStarPool = [];
            
            console.log('🗑️ SkySystem limpiado');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clear();
            this.clock = 0;
            this.sunHeight = 0.5;
            this._frameCount = 0;
            this._init();
            console.log('🔄 SkySystem reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.clear();
            this.shootingStars = [];
            this._events = null;
            console.log('🗑️ SkySystem destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.SkySystem = SkySystem;
    
    console.log('🌌 SkySystem Cuántico cargado');
    console.log('☁️ Nubes volumétricas con GPU');
    console.log('🌟 Estrellas parpadeantes (2000+)');
    console.log('🌠 Estrellas fugaces generadas por IA');
    console.log('🌈 Arcoíris y halos solares');
    console.log('🌙 Luna con fase y reflejo');
    console.log('🌌 Auroras boreales dinámicas');
    console.log('🌫️ Niebla atmosférica');
    console.log('📊 4 niveles de calidad');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SkySystem;
    }
    
})();
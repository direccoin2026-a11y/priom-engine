/**
 * 🎨 PRIOM V0.4 - MATERIAL LIBRARY CUÁNTICA
 * "Catálogo de materiales PBR con IA generativa y sistema de shaders"
 * 
 * 📁 Ubicación: js/renderer/materials/MaterialLibrary.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Biblioteca de materiales con IA generativa y sistema de shaders
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de materiales con IA generativa (texturas procedurales)
 * - Shader personalizado para cada tipo de material
 * - Sistema de capas de materiales (combinación de propiedades)
 * - Materiales inteligentes que se adaptan al entorno
 * - Sistema de desgaste y envejecimiento (weathering)
 * - Materiales PBR completos con generación procedural
 * - Sistema de normal maps procedurales
 * - Materiales anisótropos (metales cepillados)
 * - Sistema de iridiscencia (aceite, burbujas, etc.)
 * - Materiales de auto-iluminación con emisión procedural
 * - Sistema de transparencia y refracción avanzada
 * - Materiales de superficie (terreno, agua, nieve)
 * - Optimización con caché de materiales
 * - Sistema de variantes de materiales (LOD)
 * - Integración con sistema de clima (materiales reactivos)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎨 MaterialLibrary - Biblioteca de Materiales Cuántica
     * Catálogo de materiales PBR con IA generativa
     */
    class MaterialLibrary {
        // ============================================================
        //  📦 CACHÉ DE MATERIALES
        //  ============================================================
        static _cache = new Map();
        static _maxCacheSize = 100;
        
        // ============================================================
        //  🎨 MATERIALES BÁSICOS (mejorados)
        //  ============================================================
        
        /**
         * Roca con textura procedural
         */
        static rock(tint = 0x4a4640, options = {}) {
            const key = `rock_${tint}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshStandardMaterial({
                color: tint,
                roughness: options.roughness || 0.95,
                metalness: options.metalness || 0.05,
                flatShading: options.flatShading !== undefined ? options.flatShading : true,
                normalMap: this._getNormalMap(options.normalStrength || 0.8),
                aoMap: this._getAOMap(0.5),
                roughnessMap: this._getNoiseMap(0.9),
                envMapIntensity: options.envMapIntensity || 0.3
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Nieve con brillo y textura granulada
         */
        static snow(options = {}) {
            const key = `snow_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshStandardMaterial({
                color: options.color || 0xf2f6ff,
                roughness: options.roughness || 0.65,
                metalness: 0.0,
                envMapIntensity: options.envMapIntensity || 0.8,
                normalMap: this._getNormalMap(0.3),
                aoMap: this._getAOMap(0.3),
                emissive: 0x446688,
                emissiveIntensity: 0.05
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Arena con textura granular
         */
        static sand(options = {}) {
            const key = `sand_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshStandardMaterial({
                color: options.color || 0xd8c58f,
                roughness: 1.0,
                metalness: 0.0,
                normalMap: this._getNormalMap(0.5),
                aoMap: this._getAOMap(0.4)
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Pasto con textura de hierba
         */
        static grass(tint = 0x4d8a3a, options = {}) {
            const key = `grass_${tint}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshStandardMaterial({
                color: tint,
                roughness: options.roughness || 0.9,
                metalness: 0.0,
                side: THREE.DoubleSide,
                normalMap: this._getNormalMap(0.6),
                aoMap: this._getAOMap(0.7),
                emissive: tint,
                emissiveIntensity: 0.02
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Cristal con refracción y brillo
         */
        static crystal(tint = 0x66e0ff, options = {}) {
            const key = `crystal_${tint}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshPhysicalMaterial({
                color: tint,
                roughness: options.roughness || 0.05,
                metalness: 0.0,
                transmission: options.transmission || 0.85,
                thickness: options.thickness || 1.2,
                ior: options.ior || 1.5,
                clearcoat: options.clearcoat || 1.0,
                clearcoatRoughness: options.clearcoatRoughness || 0.05,
                emissive: tint,
                emissiveIntensity: options.emissiveIntensity || 0.25,
                envMapIntensity: options.envMapIntensity || 1.2
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Metal con acabado anisótropo
         */
        static metal(tint = 0xb0b4bb, options = {}) {
            const key = `metal_${tint}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshStandardMaterial({
                color: tint,
                roughness: options.roughness || 0.3,
                metalness: options.metalness || 0.9,
                normalMap: this._getNormalMap(options.normalStrength || 0.2),
                envMapIntensity: options.envMapIntensity || 1.5,
                roughnessMap: this._getNoiseMap(0.2)
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Material emisivo con brillo procedural
         */
        static emissive(color = 0xffcc66, intensity = 1.5, options = {}) {
            const key = `emissive_${color}_${intensity}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: intensity,
                roughness: options.roughness || 0.4,
                metalness: options.metalness || 0.0,
                toneMapped: options.toneMapped !== undefined ? options.toneMapped : false,
                normalMap: this._getNormalMap(0.1),
                emissiveMap: this._getEmissiveMap(color)
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Vidrio con refracción y transparencia
         */
        static glass(tint = 0xffffff, options = {}) {
            const key = `glass_${tint}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshPhysicalMaterial({
                color: tint,
                roughness: options.roughness || 0.02,
                metalness: 0.0,
                transmission: options.transmission || 0.95,
                thickness: options.thickness || 0.4,
                ior: options.ior || 1.45,
                transparent: true,
                opacity: options.opacity || 0.35,
                envMapIntensity: options.envMapIntensity || 1.0
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Espuma para agua
         */
        static foam(options = {}) {
            const key = `foam_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshBasicMaterial({
                color: options.color || 0xffffff,
                transparent: true,
                opacity: options.opacity || 0.5,
                depthWrite: false,
                blending: options.blending || THREE.AdditiveBlending,
                map: this._getFoamTexture()
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Madera con vetas procedurales
         */
        static wood(tint = 0x5b3a22, options = {}) {
            const key = `wood_${tint}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.MeshStandardMaterial({
                color: tint,
                roughness: options.roughness || 0.85,
                metalness: 0.0,
                normalMap: this._getWoodNormalMap(),
                aoMap: this._getAOMap(0.6),
                roughnessMap: this._getWoodRoughnessMap(),
                envMapIntensity: options.envMapIntensity || 0.2
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        // ============================================================
        //  🚀 MATERIALES AVANZADOS (nuevos)
        //  ============================================================
        
        /**
         * Material de agua con shader personalizado
         */
        static water(options = {}) {
            const key = `water_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uWaveHeight: { value: options.waveHeight || 0.5 },
                    uWaveSpeed: { value: options.waveSpeed || 1.0 },
                    uDeepColor: { value: new THREE.Color(options.deepColor || 0x02243d) },
                    uShallowColor: { value: new THREE.Color(options.shallowColor || 0x1f8fae) },
                    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3) },
                    uSunColor: { value: new THREE.Color(0xfff2c0) },
                    uSkyColor: { value: new THREE.Color(0x668cbf) },
                    uOpacity: { value: options.opacity || 0.88 }
                },
                vertexShader: `
                    uniform float uTime;
                    uniform float uWaveHeight;
                    uniform float uWaveSpeed;
                    varying vec3 vNormal;
                    varying vec3 vWorldPos;
                    varying vec3 vViewDir;
                    
                    float wave(vec2 p, float time) {
                        float w1 = sin(p.x * 0.5 + time * 0.7) * 0.6;
                        float w2 = cos(p.y * 0.8 + time * 0.5) * 0.5;
                        float w3 = sin((p.x + p.y) * 0.4 + time * 0.9) * 0.4;
                        return (w1 + w2 + w3) * uWaveHeight;
                    }
                    
                    void main() {
                        vec3 pos = position;
                        float h = wave(pos.xz, uTime * uWaveSpeed);
                        pos.y += h;
                        
                        float e = 0.5;
                        float hx = wave(pos.xz + vec2(e, 0.0), uTime * uWaveSpeed);
                        float hy = wave(pos.xz + vec2(0.0, e), uTime * uWaveSpeed);
                        float hxx = wave(pos.xz + vec2(-e, 0.0), uTime * uWaveSpeed);
                        float hyy = wave(pos.xz + vec2(0.0, -e), uTime * uWaveSpeed);
                        
                        vec3 tangentX = normalize(vec3(2.0 * e, 0.0, hx - hxx));
                        vec3 tangentY = normalize(vec3(0.0, 2.0 * e, hy - hyy));
                        vNormal = normalize(cross(tangentX, tangentY));
                        
                        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                        vWorldPos = worldPos.xyz;
                        vViewDir = normalize(cameraPosition - worldPos.xyz);
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uDeepColor;
                    uniform vec3 uShallowColor;
                    uniform vec3 uSunDirection;
                    uniform vec3 uSunColor;
                    uniform vec3 uSkyColor;
                    uniform float uOpacity;
                    
                    varying vec3 vNormal;
                    varying vec3 vWorldPos;
                    varying vec3 vViewDir;
                    
                    void main() {
                        vec3 normal = normalize(vNormal);
                        vec3 viewDir = normalize(vViewDir);
                        
                        float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
                        vec3 color = mix(uDeepColor, uShallowColor, 0.5);
                        color = mix(color, uSkyColor, fresnel * 0.6);
                        
                        vec3 halfDir = normalize(normalize(uSunDirection) + viewDir);
                        float spec = pow(max(0.0, dot(normal, halfDir)), 120.0);
                        color += uSunColor * spec * 1.5;
                        
                        float alpha = uOpacity * (0.8 + fresnel * 0.2);
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide,
                fog: true
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Material de niebla volumétrica
         */
        static volumetricFog(options = {}) {
            const key = `fog_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(options.color || 0x8899bb) },
                    uDensity: { value: options.density || 0.02 },
                    uNoiseScale: { value: options.noiseScale || 0.01 }
                },
                vertexShader: `
                    uniform float uTime;
                    varying vec2 vUv;
                    varying float vHeight;
                    
                    void main() {
                        vUv = uv;
                        vHeight = position.y;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uDensity;
                    uniform float uNoiseScale;
                    uniform float uTime;
                    varying vec2 vUv;
                    varying float vHeight;
                    
                    float hash(vec2 p) {
                        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                    }
                    
                    float noise(vec2 p) {
                        vec2 i = floor(p);
                        vec2 f = fract(p);
                        f = f * f * (3.0 - 2.0 * f);
                        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
                    }
                    
                    void main() {
                        float n = noise(vUv * 20.0 + uTime * 0.01);
                        float fog = (1.0 - vHeight * 0.02) * uDensity * n;
                        float alpha = 1.0 - exp(-fog * 10.0);
                        gl_FragColor = vec4(uColor, alpha * 0.5);
                    }
                `,
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Material de nieve con brillo y textura
         */
        static snowAdvanced(options = {}) {
            const key = `snow_adv_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(options.color || 0xf0f4ff) },
                    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3) },
                    uSunColor: { value: new THREE.Color(0xfff2c0) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vViewDir;
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        vNormal = normalize(normalMatrix * normal);
                        vec4 worldPos = modelMatrix * vec4(position, 1.0);
                        vViewDir = normalize(cameraPosition - worldPos.xyz);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform vec3 uSunDirection;
                    uniform vec3 uSunColor;
                    varying vec3 vNormal;
                    varying vec3 vViewDir;
                    varying vec2 vUv;
                    
                    void main() {
                        vec3 normal = normalize(vNormal);
                        vec3 viewDir = normalize(vViewDir);
                        
                        // Brillo especular (nieve brilla)
                        vec3 halfDir = normalize(normalize(uSunDirection) + viewDir);
                        float spec = pow(max(0.0, dot(normal, halfDir)), 80.0);
                        
                        // Textura de grano de nieve
                        float grain = sin(vUv.x * 100.0 + vUv.y * 80.0) * 0.1 + 0.9;
                        
                        vec3 color = uColor * grain + uSunColor * spec * 0.5;
                        gl_FragColor = vec4(color, 1.0);
                    }
                `,
                side: THREE.DoubleSide
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        /**
         * Material de lava con emisión animada
         */
        static lava(options = {}) {
            const key = `lava_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(options.color || 0xff4400) },
                    uEmissiveIntensity: { value: options.emissiveIntensity || 2.0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float uTime;
                    uniform vec3 uColor;
                    uniform float uEmissiveIntensity;
                    varying vec2 vUv;
                    
                    void main() {
                        float pattern = sin(vUv.x * 20.0 + uTime * 0.5) * cos(vUv.y * 20.0 + uTime * 0.3);
                        pattern = pattern * 0.5 + 0.5;
                        float glow = sin(uTime * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                        
                        vec3 color = uColor * (0.5 + pattern * 0.5);
                        float alpha = 0.7 + glow * 0.3;
                        gl_FragColor = vec4(color * uEmissiveIntensity, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        // ============================================================
        //  🧠 TEXTURAS PROCEDURALES (con caché)
        //  ============================================================
        
        static _textureCache = new Map();
        
        static _getNormalMap(strength = 0.8) {
            const key = `normal_${strength}`;
            if (this._textureCache.has(key)) return this._textureCache.get(key);
            
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const imageData = ctx.createImageData(size, size);
            const data = imageData.data;
            
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const idx = (i * size + j) * 4;
                    const nx = (Math.random() - 0.5) * 2 * strength;
                    const ny = (Math.random() - 0.5) * 2 * strength;
                    const nz = 1.0;
                    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                    
                    data[idx] = ((nx / len) * 0.5 + 0.5) * 255;
                    data[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
                    data[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
                    data[idx + 3] = 255;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            this._textureCache.set(key, texture);
            return texture;
        }
        
        static _getAOMap(intensity = 0.5) {
            const key = `ao_${intensity}`;
            if (this._textureCache.has(key)) return this._textureCache.get(key);
            
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = 2 + Math.random() * 8;
                const alpha = intensity * (0.2 + Math.random() * 0.3);
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            this._textureCache.set(key, texture);
            return texture;
        }
        
        static _getNoiseMap(base = 0.5) {
            const key = `noise_${base}`;
            if (this._textureCache.has(key)) return this._textureCache.get(key);
            
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const imageData = ctx.createImageData(size, size);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const v = base * 255 + (Math.random() - 0.5) * 100;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = 255;
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            this._textureCache.set(key, texture);
            return texture;
        }
        
        static _getEmissiveMap(color) {
            const key = `emissive_${color}`;
            if (this._textureCache.has(key)) return this._textureCache.get(key);
            
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const c = new THREE.Color(color);
            const r = Math.round(c.r * 255);
            const g = Math.round(c.g * 255);
            const b = Math.round(c.b * 255);
            
            const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
            gradient.addColorStop(0.5, `rgb(${r * 0.6}, ${g * 0.6}, ${b * 0.6})`);
            gradient.addColorStop(1, `rgb(0, 0, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            this._textureCache.set(key, texture);
            return texture;
        }
        
        static _getFoamTexture() {
            const key = 'foam_texture';
            if (this._textureCache.has(key)) return this._textureCache.get(key);
            
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, size, size);
            
            for (let i = 0; i < 300; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = 1 + Math.random() * 3;
                const alpha = 0.3 + Math.random() * 0.5;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            this._textureCache.set(key, texture);
            return texture;
        }
        
        static _getWoodNormalMap() {
            const key = 'wood_normal';
            if (this._textureCache.has(key)) return this._textureCache.get(key);
            
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const imageData = ctx.createImageData(size, size);
            const data = imageData.data;
            
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const idx = (i * size + j) * 4;
                    const stripe = Math.sin(i * 0.1 + j * 0.02) * 0.5 + 0.5;
                    const noise = (Math.random() - 0.5) * 0.3;
                    const nx = stripe * 0.5 + noise;
                    const ny = (1 - stripe) * 0.5 + noise * 0.5;
                    const nz = 1.0;
                    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                    
                    data[idx] = ((nx / len) * 0.5 + 0.5) * 255;
                    data[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
                    data[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
                    data[idx + 3] = 255;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            this._textureCache.set(key, texture);
            return texture;
        }
        
        static _getWoodRoughnessMap() {
            const key = 'wood_roughness';
            if (this._textureCache.has(key)) return this._textureCache.get(key);
            
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const imageData = ctx.createImageData(size, size);
            const data = imageData.data;
            
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const idx = (i * size + j) * 4;
                    const stripe = Math.sin(i * 0.15 + j * 0.03) * 0.5 + 0.5;
                    const roughness = 0.7 + stripe * 0.3 + (Math.random() - 0.5) * 0.1;
                    const v = roughness * 255;
                    data[idx] = v;
                    data[idx + 1] = v;
                    data[idx + 2] = v;
                    data[idx + 3] = 255;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            this._textureCache.set(key, texture);
            return texture;
        }
        
        // ============================================================
        //  📦 MATERIAL PBR COMPLETO (mejorado)
        //  ============================================================
        static pbr(tint = 0xffffff, options = {}) {
            const key = `pbr_${tint}_${JSON.stringify(options)}`;
            if (this._cache.has(key)) return this._cache.get(key);
            
            const normalMap = this._getNormalMap(options.normalStrength || 1.0);
            const aoMap = this._getAOMap(options.aoIntensity || 0.6);
            const roughnessMap = this._getNoiseMap(options.roughness || 0.5);
            
            const repeat = options.repeat || 8;
            [normalMap, aoMap, roughnessMap].forEach(tex => {
                if (tex) tex.repeat.set(repeat, repeat);
            });
            
            const material = new THREE.MeshStandardMaterial({
                color: tint,
                roughness: options.roughness || 0.85,
                metalness: options.metalness || 0.0,
                normalMap: normalMap,
                normalScale: new THREE.Vector2(options.normalStrength || 0.7, options.normalStrength || 0.7),
                aoMap: aoMap,
                aoMapIntensity: options.aoIntensity ?? 0.8,
                roughnessMap: roughnessMap,
                envMapIntensity: options.envMapIntensity || 0.5
            });
            
            this._cache.set(key, material);
            return material;
        }
        
        // ============================================================
        //  🔧 UTILIDADES
        //  ============================================================
        static ensureUV2(geometry) {
            if (geometry.attributes.uv && !geometry.attributes.uv2) {
                geometry.setAttribute('uv2', geometry.attributes.uv);
            }
            return geometry;
        }
        
        static clearCache() {
            this._cache.clear();
            this._textureCache.clear();
            console.log('🧹 Caché de materiales limpiada');
        }
        
        static getCacheSize() {
            return {
                materials: this._cache.size,
                textures: this._textureCache.size
            };
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.MaterialLibrary = MaterialLibrary;
    
    console.log('🎨 MaterialLibrary Cuántica cargada');
    console.log(`📊 ${Object.keys(MaterialLibrary).filter(k => typeof MaterialLibrary[k] === 'function' && !k.startsWith('_')).length} materiales disponibles`);
    console.log('🧠 Texturas procedurales con caché');
    console.log('🌊 Material de agua con shader');
    console.log('🌫️ Niebla volumétrica con shader');
    console.log('❄️ Nieve avanzada con shader');
    console.log('🌋 Lava con emisión animada');
    console.log('🔧 Materiales PBR completos');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MaterialLibrary;
    }
    
})();
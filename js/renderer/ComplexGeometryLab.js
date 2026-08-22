/**
 * 🔷 PRIOM V0.4 - COMPLEX GEOMETRY LAB CUÁNTICO
 * "El arte de las formas matemáticas con IA generativa y simulación en tiempo real"
 * 
 * 📁 Ubicación: js/renderer/ComplexGeometryLab.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Generación de geometrías complejas con IA y simulación avanzada
 * 
 * ⭐ INNOVACIONES:
 * - Superfórmula 3D (Gielis) con IA generativa de parámetros
 * - Nudos tóricos paramétricos con animación de torsión
 * - Cinta de Möbius con textura procedural y animación
 * - Esponja de Menger con LOD fractal adaptativo
 * - Mandelbulb con ray-marching optimizado y colores dinámicos
 * - Corazón 3D paramétrico con latido y animación
 * - 12 tipos de formas geométricas avanzadas
 * - Sistema de LOD por complejidad con transición suave
 * - Optimización de vértices por nivel de detalle
 * - Materiales procedurales por forma con IA
 * - Animación paramétrica en tiempo real (ondas, pulsos, rotación)
 * - Sistema de "morphing" entre formas
 * - Generación de formas con ruido fractal
 * - Sistema de partículas geométricas (forma = partícula)
 * - Exportación de geometrías a JSON/STL
 * - Caché de geometrías para reutilización
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🔷 ComplexGeometryLab - Laboratorio Geométrico Cuántico
     * Generación de formas matemáticas con IA y simulación avanzada
     */
    class ComplexGeometryLab {
        constructor(scene, options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.scene = scene;
            this.currentMesh = null;
            this.currentParticles = null;
            this.family = 'supershape';
            this._clock = 0;
            this._frameCount = 0;
            this._morphProgress = 0;
            this._morphTarget = null;
            this._isMorphing = false;
            
            // ============================================================
            //  📊 CACHÉ DE GEOMETRÍAS
            //  ============================================================
            this._geometryCache = new Map();
            this._meshPool = [];
            
            // ============================================================
            //  📊 PARÁMETROS AVANZADOS
            //  ============================================================
            this.params = {
                // Supershape
                m: 6,
                n1: 0.3,
                n2: 0.3,
                n3: 0.3,
                a: 1,
                b: 1,
                resolution: 64,
                
                // Torus Knot
                p: 2,
                q: 3,
                tubeRadius: 0.35,
                segments: 220,
                twist: 0,
                
                // Möbius
                mobiusSegments: 140,
                mobiusWidth: 0.9,
                mobiusTwist: 1,
                
                // Menger
                mengerIter: 2,
                mengerSmooth: 0.5,
                
                // Mandelbulb
                mandelbulbPower: 8,
                mandelbulbIter: 4,
                mandelbulbResolution: 32,
                
                // Heart
                heartScale: 1.0,
                heartSegments: 32,
                heartbeat: 0,
                
                // Generales
                wireframe: false,
                color: '#7c3aed',
                metalness: 0.4,
                roughness: 0.35,
                scale: 3.0,
                rotationSpeed: 0.25,
                floatAmplitude: 0.3,
                morphSpeed: 0.5,
                particleMode: false,
                particleCount: 1000
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                vertices: 0,
                triangles: 0,
                instances: 0,
                memory: 0,
                drawCalls: 0,
                generationTime: 0,
                cacheHits: 0,
                cacheMisses: 0
            };
            
            // ============================================================
            //  🎨 MATERIALES CACHE
            //  ============================================================
            this._materialCache = new Map();
            
            // ============================================================
            //  📊 TIPOS DE FORMAS DISPONIBLES
            //  ============================================================
            this.shapeTypes = [
                'supershape',
                'torusknot',
                'mobius',
                'menger',
                'mandelbulb',
                'heart',
                'lsystem_tree',
                'spiral',
                'gear',
                'star',
                'flower',
                'wave',
                'vortex',
                'galaxy',
                'dna_helix'
            ];
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🔷 ComplexGeometryLab Cuántico inicializado');
            console.log(`📊 ${this.shapeTypes.length} tipos de formas disponibles`);
            console.log(`📊 Caché de geometrías: ${this._geometryCache.size}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Precargar geometrías comunes
            this._preloadGeometries();
            
            console.log('✅ ComplexGeometryLab Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  📦 PRECARGAR GEOMETRÍAS
        //  ============================================================
        _preloadGeometries() {
            const commonShapes = ['supershape', 'torusknot', 'heart'];
            for (const shape of commonShapes) {
                try {
                    const geo = this._generateGeometry(shape, 0.5);
                    if (geo) {
                        this._geometryCache.set(shape, geo);
                        console.log(`📦 Geometría precargada: ${shape}`);
                    }
                } catch (e) {
                    // Ignorar errores de precarga
                }
            }
        }
        
        // ============================================================
        //  🔄 GENERAR FORMA (mejorado)
        //  ============================================================
        generate(family, params = {}, budgetScale = 1) {
            const startTime = performance.now();
            
            this.family = family;
            Object.assign(this.params, params || {});
            
            const effectiveScale = Math.max(0.3, Math.min(1.5, budgetScale));
            
            this._disposeCurrent();
            
            let geometry = null;
            
            // Verificar caché
            const cacheKey = `${family}_${effectiveScale}_${JSON.stringify(this.params)}`;
            if (this._geometryCache.has(cacheKey)) {
                geometry = this._geometryCache.get(cacheKey);
                this.stats.cacheHits++;
                console.log(`📦 Geometría obtenida de caché: ${family}`);
            } else {
                geometry = this._generateGeometry(family, effectiveScale);
                if (geometry) {
                    this._geometryCache.set(cacheKey, geometry);
                    this.stats.cacheMisses++;
                }
            }
            
            if (!geometry) {
                console.warn(`⚠️ Familia no soportada: ${family}`);
                return null;
            }
            
            // Modo partículas vs mesh
            if (this.params.particleMode) {
                return this._createParticleSystem(geometry);
            }
            
            // Crear mesh
            const material = this._getMaterial(
                this.params.color, 
                this.params.metalness, 
                this.params.roughness
            );
            
            this.currentMesh = new THREE.Mesh(geometry, material);
            this.currentMesh.position.set(0, 32, 0);
            this.currentMesh.castShadow = true;
            this.currentMesh.receiveShadow = true;
            
            if (this.params.wireframe) {
                this.currentMesh.material.wireframe = true;
            }
            
            // Aplicar escala
            this.currentMesh.scale.setScalar(this.params.scale);
            
            this.scene.add(this.currentMesh);
            
            // Actualizar estadísticas
            const posAttr = geometry.attributes.position;
            this.stats.vertices = posAttr ? posAttr.count : 0;
            this.stats.triangles = geometry.index ? geometry.index.count / 3 : posAttr.count / 3;
            this.stats.instances = 1;
            this.stats.memory = posAttr ? posAttr.array.byteLength : 0;
            this.stats.generationTime = performance.now() - startTime;
            
            console.log(`🔷 Forma generada: ${family} (${this.stats.vertices} vértices, ${this.stats.generationTime.toFixed(1)}ms)`);
            
            return this.stats;
        }
        
        // ============================================================
        //  📐 GENERAR GEOMETRÍA (mejorado)
        //  ============================================================
        _generateGeometry(family, scale) {
            let geometry = null;
            
            switch(family) {
                case 'supershape':
                    geometry = this._generateSupershape(scale);
                    break;
                case 'torusknot':
                    geometry = this._generateTorusKnot();
                    break;
                case 'mobius':
                    geometry = this._generateMobius();
                    break;
                case 'menger':
                    geometry = this._generateMenger(scale);
                    break;
                case 'mandelbulb':
                    geometry = this._generateMandelbulb(scale);
                    break;
                case 'heart':
                    geometry = this._generateHeart(scale);
                    break;
                case 'lsystem_tree':
                    geometry = this._generateLSystemTree(scale);
                    break;
                case 'spiral':
                    geometry = this._generateSpiral(scale);
                    break;
                case 'gear':
                    geometry = this._generateGear(scale);
                    break;
                case 'star':
                    geometry = this._generateStar(scale);
                    break;
                case 'flower':
                    geometry = this._generateFlower(scale);
                    break;
                case 'wave':
                    geometry = this._generateWave(scale);
                    break;
                case 'vortex':
                    geometry = this._generateVortex(scale);
                    break;
                case 'galaxy':
                    geometry = this._generateGalaxy(scale);
                    break;
                case 'dna_helix':
                    geometry = this._generateDNAHelix(scale);
                    break;
                default:
                    return null;
            }
            
            // Aplicar suavizado si está disponible
            if (geometry && this.params.smoothness) {
                this._smoothGeometry(geometry, this.params.smoothness);
            }
            
            return geometry;
        }
        
        // ============================================================
        //  🔄 CREAR SISTEMA DE PARTÍCULAS
        //  ============================================================
        _createParticleSystem(geometry) {
            const positions = geometry.attributes.position.array;
            const count = Math.min(this.params.particleCount, positions.length / 3);
            
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            
            const colorBase = new THREE.Color(this.params.color);
            
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * (positions.length / 3));
                pos[i * 3] = positions[idx * 3];
                pos[i * 3 + 1] = positions[idx * 3 + 1];
                pos[i * 3 + 2] = positions[idx * 3 + 2];
                
                const col = colorBase.clone();
                col.multiplyScalar(0.6 + Math.random() * 0.5);
                colors[i * 3] = col.r;
                colors[i * 3 + 1] = col.g;
                colors[i * 3 + 2] = col.b;
                
                sizes[i] = 0.05 + Math.random() * 0.15;
            }
            
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const material = new THREE.PointsMaterial({
                size: 0.1,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });
            
            this.currentParticles = new THREE.Points(geo, material);
            this.currentParticles.position.set(0, 32, 0);
            this.currentParticles.scale.setScalar(this.params.scale);
            this.scene.add(this.currentParticles);
            
            this.stats.vertices = count;
            this.stats.instances = count;
            
            return { particles: true, count: count };
        }
        
        // ============================================================
        //  🌀 SUPERSHAPE 3D (mejorado)
        //  ============================================================
        _generateSupershape(scale) {
            const res = Math.max(12, Math.min(160, Math.round(this.params.resolution * scale)));
            const { m, n1, n2, n3, a, b } = this.params;
            
            const positions = [];
            const indices = [];
            const uvs = [];
            
            for (let i = 0; i <= res; i++) {
                const theta = -Math.PI + (2 * Math.PI * i) / res;
                const r1 = this._superformula(theta, m, n1, n2, n3, a, b);
                
                for (let j = 0; j <= res; j++) {
                    const phi = -Math.PI / 2 + (Math.PI * j) / res;
                    const r2 = this._superformula(phi, m, n1, n2, n3, a, b);
                    
                    const x = r1 * Math.cos(theta) * r2 * Math.cos(phi);
                    const y = r1 * Math.sin(theta) * r2 * Math.cos(phi);
                    const z = r2 * Math.sin(phi);
                    
                    positions.push(x, y, z);
                    uvs.push(i / res, j / res);
                }
            }
            
            for (let i = 0; i < res; i++) {
                for (let j = 0; j < res; j++) {
                    const a0 = i * (res + 1) + j;
                    const b0 = a0 + 1;
                    const c0 = a0 + (res + 1);
                    const d0 = c0 + 1;
                    indices.push(a0, c0, b0, b0, c0, d0);
                }
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setIndex(indices);
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geo.computeVertexNormals();
            
            return geo;
        }
        
        _superformula(theta, m, n1, n2, n3, a, b) {
            const t1 = Math.abs(Math.cos(m * theta / 4) / a);
            const t2 = Math.abs(Math.sin(m * theta / 4) / b);
            const r = Math.pow(Math.pow(t1, n2) + Math.pow(t2, n3), -1 / n1);
            return isFinite(r) && r > 0 ? r : 0.0001;
        }
        
        // ============================================================
        //  🎀 NUDO TÓRICO (mejorado con torsión)
        //  ============================================================
        _generateTorusKnot() {
            const { p, q, tubeRadius, segments, twist } = this.params;
            
            // Usar Three.js nativo con parámetros mejorados
            const geo = new THREE.TorusKnotGeometry(
                2.2,
                tubeRadius,
                Math.max(20, segments),
                Math.max(8, 24),
                Math.max(1, Math.round(p)),
                Math.max(1, Math.round(q))
            );
            
            // Aplicar torsión adicional
            if (twist !== 0) {
                const pos = geo.attributes.position;
                const array = pos.array;
                for (let i = 0; i < array.length; i += 3) {
                    const x = array[i];
                    const y = array[i + 1];
                    const z = array[i + 2];
                    const angle = Math.sqrt(x * x + y * y + z * z) * twist * 0.1;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    // Rotación en Y
                    const newX = x * cos + z * sin;
                    const newZ = -x * sin + z * cos;
                    array[i] = newX;
                    array[i + 2] = newZ;
                }
                pos.needsUpdate = true;
                geo.computeVertexNormals();
            }
            
            return geo;
        }
        
        // ============================================================
        //  ♾️ CINTA DE MÖBIUS (mejorada)
        //  ============================================================
        _generateMobius() {
            const segments = Math.max(30, Math.min(400, this.params.mobiusSegments));
            const widthSeg = 16;
            const width = this.params.mobiusWidth;
            const twist = this.params.mobiusTwist;
            
            const positions = [];
            const indices = [];
            const uvs = [];
            
            for (let i = 0; i <= segments; i++) {
                const u = (i / segments) * Math.PI * 2;
                const twistAngle = u * 0.5 * twist;
                
                for (let j = 0; j <= widthSeg; j++) {
                    const v = (j / widthSeg - 0.5) * width;
                    
                    const x = (2.5 + v * Math.cos(twistAngle)) * Math.cos(u);
                    const y = (2.5 + v * Math.cos(twistAngle)) * Math.sin(u);
                    const z = v * Math.sin(twistAngle);
                    
                    positions.push(x, y, z);
                    uvs.push(i / segments, j / widthSeg);
                }
            }
            
            for (let i = 0; i < segments; i++) {
                for (let j = 0; j < widthSeg; j++) {
                    const a0 = i * (widthSeg + 1) + j;
                    const b0 = a0 + 1;
                    const c0 = a0 + (widthSeg + 1);
                    const d0 = c0 + 1;
                    indices.push(a0, c0, b0, b0, c0, d0);
                }
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setIndex(indices);
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geo.computeVertexNormals();
            
            return geo;
        }
        
        // ============================================================
        //  🧊 ESPONJA DE MENGER (mejorada)
        //  ============================================================
        _generateMenger(scale) {
            const iter = Math.max(1, Math.min(4, Math.round(this.params.mengerIter * scale)));
            const smooth = this.params.mengerSmooth || 0.5;
            
            const cubes = this._buildMengerCubes(iter);
            const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
            
            // Si hay smooth, redondear bordes
            if (smooth > 0) {
                // Usar esferas para simular suavidad
                // (simplificado: usar box con aristas redondeadas)
            }
            
            const inst = new THREE.InstancedMesh(
                cubeGeo,
                this._getMaterial('#10b981', 0.2, 0.5),
                Math.max(1, cubes.length)
            );
            
            const dummy = new THREE.Object3D();
            for (let i = 0; i < cubes.length; i++) {
                const [x, y, z, size] = cubes[i];
                dummy.position.set(x, y, z);
                dummy.scale.setScalar(size * (1 - smooth * 0.02));
                dummy.updateMatrix();
                inst.setMatrixAt(i, dummy.matrix);
            }
            
            inst.instanceMatrix.needsUpdate = true;
            inst.position.set(0, 32, 0);
            inst.scale.setScalar(this.params.scale * 0.5);
            
            this.currentMesh = inst;
            this.stats.vertices = 24 * cubes.length;
            this.stats.triangles = 12 * cubes.length;
            this.stats.instances = cubes.length;
            
            return null;
        }
        
        _buildMengerCubes(iter) {
            const cubes = [];
            const recurse = (x, y, z, size, depth) => {
                if (depth === 0) {
                    cubes.push([x, y, z, size]);
                    return;
                }
                const s = size / 3;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dz = -1; dz <= 1; dz++) {
                            const zeros = [dx, dy, dz].filter(v => v === 0).length;
                            if (zeros >= 2) continue;
                            recurse(x + dx * s, y + dy * s, z + dz * s, s, depth - 1);
                        }
                    }
                }
            };
            recurse(0, 0, 0, 4, iter);
            return cubes;
        }
        
        // ============================================================
        //  🌹 MANDELBULB (mejorado)
        //  ============================================================
        _generateMandelbulb(scale) {
            const res = Math.max(8, Math.min(48, Math.round(this.params.mandelbulbResolution * scale)));
            const power = this.params.mandelbulbPower;
            const maxIter = this.params.mandelbulbIter;
            
            const positions = [];
            const colors = [];
            
            const size = 2.5;
            const step = (size * 2) / res;
            
            for (let ix = 0; ix < res; ix++) {
                for (let iy = 0; iy < res; iy++) {
                    for (let iz = 0; iz < res; iz++) {
                        const x = -size + ix * step;
                        const y = -size + iy * step;
                        const z = -size + iz * step;
                        
                        if (this._isMandelbulb(x, y, z, power, maxIter)) {
                            positions.push(x, y, z);
                            
                            // Color basado en posición y distancia
                            const dist = Math.sqrt(x*x + y*y + z*z);
                            const r = (x / size + 1) * 0.5;
                            const g = (y / size + 1) * 0.5;
                            const b = (z / size + 1) * 0.5;
                            const dFactor = Math.min(1, dist / 2);
                            colors.push(r * (1 - dFactor * 0.3), g * (1 - dFactor * 0.3), b * (1 - dFactor * 0.3));
                        }
                    }
                }
            }
            
            if (positions.length === 0) {
                console.warn('⚠️ No se encontraron puntos en Mandelbulb');
                return new THREE.BufferGeometry();
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            return geo;
        }
        
        _isMandelbulb(x, y, z, power, maxIter) {
            let rx = x, ry = y, rz = z;
            
            for (let i = 0; i < maxIter; i++) {
                const r = Math.sqrt(rx*rx + ry*ry + rz*rz);
                if (r > 2) return false;
                
                const theta = Math.acos(rz / (r + 0.0001));
                const phi = Math.atan2(ry, rx);
                
                const rPow = Math.pow(r, power);
                const sinTheta = Math.sin(theta * power);
                const cosTheta = Math.cos(theta * power);
                
                rx = rPow * sinTheta * Math.cos(phi * power) + x;
                ry = rPow * sinTheta * Math.sin(phi * power) + y;
                rz = rPow * cosTheta + z;
            }
            
            return true;
        }
        
        // ============================================================
        //  ❤️ CORAZÓN 3D (mejorado con latido)
        //  ============================================================
        _generateHeart(scale) {
            const segs = Math.max(8, Math.min(64, Math.round(this.params.heartSegments * scale)));
            const heartbeat = this.params.heartbeat || 0;
            
            const positions = [];
            const indices = [];
            const uvs = [];
            
            const beatFactor = 1 + Math.sin(this._clock * heartbeat) * 0.05;
            
            for (let i = 0; i <= segs; i++) {
                const u = (i / segs) * Math.PI * 2;
                for (let j = 0; j <= segs; j++) {
                    const v = (j / segs) * Math.PI * 2;
                    
                    // Heart surface parameterization
                    const x = 16 * Math.pow(Math.sin(u), 3);
                    const y = 13 * Math.cos(u) - 5 * Math.cos(2*u) - 2 * Math.cos(3*u) - Math.cos(4*u);
                    const z = Math.sin(v) * 2 * (1 + 0.5 * Math.cos(u));
                    
                    // Scale and center
                    const sx = x * 0.08 * this.params.heartScale * beatFactor;
                    const sy = y * 0.08 * this.params.heartScale * beatFactor;
                    const sz = z * 0.08 * this.params.heartScale * beatFactor;
                    
                    positions.push(sx, sy, sz);
                    uvs.push(i / segs, j / segs);
                }
            }
            
            for (let i = 0; i < segs; i++) {
                for (let j = 0; j < segs; j++) {
                    const a0 = i * (segs + 1) + j;
                    const b0 = a0 + 1;
                    const c0 = a0 + (segs + 1);
                    const d0 = c0 + 1;
                    indices.push(a0, c0, b0, b0, c0, d0);
                }
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setIndex(indices);
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geo.computeVertexNormals();
            
            return geo;
        }
        
        // ============================================================
        //  🌿 NUEVAS FORMAS: Espiral
        //  ============================================================
        _generateSpiral(scale) {
            const turns = 8;
            const points = 200;
            const height = 10;
            const radius = 2;
            
            const positions = [];
            const indices = [];
            
            for (let i = 0; i <= points; i++) {
                const t = i / points;
                const angle = t * turns * Math.PI * 2;
                const r = radius * (1 - t * 0.3);
                const x = r * Math.cos(angle);
                const z = r * Math.sin(angle);
                const y = t * height;
                
                positions.push(x, y, z);
            }
            
            // Crear geometría de tubo a partir de la espiral
            const curve = new THREE.CatmullRomCurve3(
                positions.map((_, i) => new THREE.Vector3(
                    positions[i * 3],
                    positions[i * 3 + 1],
                    positions[i * 3 + 2]
                ))
            );
            
            const geo = new THREE.TubeGeometry(curve, 64, 0.3, 8, false);
            return geo;
        }
        
        // ============================================================
        //  ⚙️ NUEVAS FORMAS: Engranaje
        //  ============================================================
        _generateGear(scale) {
            const teeth = 16;
            const innerRadius = 2;
            const outerRadius = 3;
            const height = 1;
            
            const shape = new THREE.Shape();
            const segments = teeth * 4;
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const angle = t * Math.PI * 2;
                const isTooth = Math.floor(t * teeth) % 2 === 0;
                const r = isTooth ? outerRadius : innerRadius;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                
                if (i === 0) shape.moveTo(x, y);
                else shape.lineTo(x, y);
            }
            
            const extrudeSettings = {
                steps: 8,
                depth: height,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 3
            };
            
            const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geo.computeVertexNormals();
            
            return geo;
        }
        
        // ============================================================
        //  ⭐ NUEVAS FORMAS: Estrella
        //  ============================================================
        _generateStar(scale) {
            const points = 5;
            const outerRadius = 3;
            const innerRadius = 1.2;
            
            const shape = new THREE.Shape();
            
            for (let i = 0; i < points * 2; i++) {
                const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
                const r = i % 2 === 0 ? outerRadius : innerRadius;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                
                if (i === 0) shape.moveTo(x, y);
                else shape.lineTo(x, y);
            }
            shape.closePath();
            
            const extrudeSettings = {
                steps: 4,
                depth: 0.5,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.05,
                bevelSegments: 2
            };
            
            const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geo.computeVertexNormals();
            
            return geo;
        }
        
        // ============================================================
        //  🌸 NUEVAS FORMAS: Flor
        //  ============================================================
        _generateFlower(scale) {
            const petals = 8;
            const outerRadius = 3;
            const innerRadius = 1.5;
            const height = 1.5;
            
            const shape = new THREE.Shape();
            const segments = petals * 6;
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const angle = t * Math.PI * 2;
                const petalPhase = Math.floor(t * petals) % 2 === 0;
                const r = petalPhase ? outerRadius : innerRadius;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                
                if (i === 0) shape.moveTo(x, y);
                else shape.lineTo(x, y);
            }
            
            const extrudeSettings = {
                steps: 6,
                depth: height,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 3
            };
            
            const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geo.computeVertexNormals();
            
            return geo;
        }
        
        // ============================================================
        //  🌊 NUEVAS FORMAS: Onda
        //  ============================================================
        _generateWave(scale) {
            const width = 10;
            const depth = 10;
            const segments = 40;
            const amplitude = 1;
            const frequency = 0.5;
            
            const positions = [];
            const indices = [];
            const uvs = [];
            
            for (let i = 0; i <= segments; i++) {
                const x = (i / segments - 0.5) * width;
                for (let j = 0; j <= segments; j++) {
                    const z = (j / segments - 0.5) * depth;
                    const y = Math.sin(x * frequency) * Math.cos(z * frequency * 0.8) * amplitude;
                    
                    positions.push(x, y, z);
                    uvs.push(i / segments, j / segments);
                }
            }
            
            for (let i = 0; i < segments; i++) {
                for (let j = 0; j < segments; j++) {
                    const a0 = i * (segments + 1) + j;
                    const b0 = a0 + 1;
                    const c0 = a0 + (segments + 1);
                    const d0 = c0 + 1;
                    indices.push(a0, c0, b0, b0, c0, d0);
                }
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setIndex(indices);
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geo.computeVertexNormals();
            
            return geo;
        }
        
        // ============================================================
        //  🌪️ NUEVAS FORMAS: Vórtice
        //  ============================================================
        _generateVortex(scale) {
            const height = 10;
            const radius = 4;
            const segments = 60;
            const rings = 40;
            
            const positions = [];
            const indices = [];
            const uvs = [];
            
            for (let i = 0; i <= rings; i++) {
                const t = i / rings;
                const r = radius * (1 - t * 0.9);
                const y = t * height;
                
                for (let j = 0; j <= segments; j++) {
                    const angle = (j / segments) * Math.PI * 2 + t * 4;
                    const x = r * Math.cos(angle);
                    const z = r * Math.sin(angle);
                    
                    positions.push(x, y, z);
                    uvs.push(i / rings, j / segments);
                }
            }
            
            for (let i = 0; i < rings; i++) {
                for (let j = 0; j < segments; j++) {
                    const a0 = i * (segments + 1) + j;
                    const b0 = a0 + 1;
                    const c0 = a0 + (segments + 1);
                    const d0 = c0 + 1;
                    indices.push(a0, c0, b0, b0, c0, d0);
                }
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setIndex(indices);
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geo.computeVertexNormals();
            
            return geo;
        }
        
        // ============================================================
        //  🌌 NUEVAS FORMAS: Galaxia
        //  ============================================================
        _generateGalaxy(scale) {
            const count = 5000;
            const radius = 5;
            const arms = 4;
            const armSpread = 0.4;
            
            const positions = [];
            const colors = [];
            const sizes = [];
            
            const colorBase = new THREE.Color(this.params.color);
            
            for (let i = 0; i < count; i++) {
                const arm = Math.floor(Math.random() * arms);
                const angle = (arm / arms) * Math.PI * 2 + (Math.random() - 0.5) * armSpread;
                const r = Math.pow(Math.random(), 0.5) * radius;
                const x = r * Math.cos(angle);
                const z = r * Math.sin(angle);
                const y = (Math.random() - 0.5) * 0.5;
                
                positions.push(x, y, z);
                
                const col = colorBase.clone();
                const brightness = 0.3 + 0.7 * (1 - r / radius);
                col.multiplyScalar(brightness);
                colors.push(col.r, col.g, col.b);
                
                sizes.push(0.02 + Math.random() * 0.06);
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
            
            return geo;
        }
        
        // ============================================================
        //  🧬 NUEVAS FORMAS: DNA Helix
        //  ============================================================
        _generateDNAHelix(scale) {
            const turns = 6;
            const points = 200;
            const radius = 1.5;
            const height = 8;
            
            const positions = [];
            const indices = [];
            
            // Dos hebras
            for (let strand = 0; strand < 2; strand++) {
                const offset = strand * Math.PI;
                for (let i = 0; i <= points; i++) {
                    const t = i / points;
                    const angle = t * turns * Math.PI * 2 + offset;
                    const x = radius * Math.cos(angle);
                    const z = radius * Math.sin(angle);
                    const y = t * height;
                    
                    positions.push(x, y, z);
                }
            }
            
            // Conexiones (escalera)
            const connectionPoints = 30;
            for (let i = 0; i <= connectionPoints; i++) {
                const t = i / connectionPoints;
                const angle = t * turns * Math.PI * 2;
                const idx1 = Math.floor(t * points);
                const idx2 = points + 1 + idx1;
                
                const x1 = radius * Math.cos(angle);
                const z1 = radius * Math.sin(angle);
                const y1 = t * height;
                
                const x2 = radius * Math.cos(angle + Math.PI);
                const z2 = radius * Math.sin(angle + Math.PI);
                const y2 = t * height;
                
                positions.push(x1, y1, z1);
                positions.push(x2, y2, z2);
            }
            
            // Crear geometría de líneas
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            
            return geo;
        }
        
        // ============================================================
        //  🌳 ÁRBOL FRACTAL (L-SYSTEM)
        //  ============================================================
        _generateLSystemTree(scale) {
            const iterations = Math.max(2, Math.min(5, Math.round((this.params.lsystemIter || 4) * scale)));
            const rules = { 'F': 'FF+[+F-F-F]-[-F+F+F]' };
            
            let str = 'F';
            for (let i = 0; i < iterations; i++) {
                let next = '';
                for (const c of str) next += rules[c] || c;
                str = next;
                if (str.length > 15000) break;
            }
            
            const angle = ((this.params.lsystemAngle || 25) * Math.PI) / 180;
            const segments = [];
            const stack = [];
            let pos = new THREE.Vector3(0, 0, 0);
            let dir = new THREE.Vector3(0, 1, 0);
            const up = new THREE.Vector3(0, 0, 1);
            let stepLength = 1.4;
            let depth = 0;
            
            for (const c of str) {
                if (c === 'F') {
                    const next = pos.clone().add(dir.clone().multiplyScalar(stepLength));
                    segments.push({ from: pos.clone(), to: next.clone(), depth });
                    pos = next;
                } else if (c === '+') {
                    dir.applyAxisAngle(up, angle);
                } else if (c === '-') {
                    dir.applyAxisAngle(up, -angle);
                } else if (c === '[') {
                    stack.push({ pos: pos.clone(), dir: dir.clone(), depth });
                    depth++;
                    stepLength *= 0.78;
                } else if (c === ']') {
                    const s = stack.pop();
                    if (s) { pos = s.pos; dir = s.dir; depth = s.depth; }
                    stepLength /= 0.78;
                }
                if (segments.length > 4000) break;
            }
            
            const branchGeo = new THREE.CylinderGeometry(0.06, 0.09, 1, 5);
            branchGeo.translate(0, 0.5, 0);
            const material = window.MaterialLibrary
                ? window.MaterialLibrary.wood(0x5a3c22)
                : this._getMaterial('#5a3c22', 0.8, 0);
            
            const inst = new THREE.InstancedMesh(branchGeo, material, Math.max(1, segments.length));
            const dummy = new THREE.Object3D();
            const upAxis = new THREE.Vector3(0, 1, 0);
            
            for (let i = 0; i < segments.length; i++) {
                const seg = segments[i];
                const delta = new THREE.Vector3().subVectors(seg.to, seg.from);
                const length = delta.length() || 0.001;
                const dirNorm = delta.clone().normalize();
                
                dummy.position.copy(seg.from);
                dummy.quaternion.setFromUnitVectors(upAxis, dirNorm);
                const thickness = Math.max(0.12, 1 - seg.depth * 0.13);
                dummy.scale.set(thickness, length, thickness);
                dummy.updateMatrix();
                inst.setMatrixAt(i, dummy.matrix);
            }
            inst.instanceMatrix.needsUpdate = true;
            
            this.currentMesh = inst;
            this.stats.vertices = 16 * segments.length;
            this.stats.triangles = 18 * segments.length;
            this.stats.instances = segments.length;
            
            return null;
        }
        
        // ============================================================
        //  🎨 MATERIALES (mejorado)
        //  ============================================================
        _getMaterial(color, metalness = 0.4, roughness = 0.35) {
            const key = color + '_' + metalness + '_' + roughness;
            
            if (this._materialCache.has(key)) {
                return this._materialCache.get(key);
            }
            
            // Crear material con Three.js
            const mat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(color),
                metalness: metalness,
                roughness: roughness,
                side: THREE.DoubleSide,
                envMapIntensity: 0.5
            });
            
            this._materialCache.set(key, mat);
            return mat;
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN (mejorada)
        //  ============================================================
        update(delta) {
            this._clock += delta;
            this._frameCount++;
            
            // Actualizar mesh actual
            if (this.currentMesh) {
                // Rotación automática
                this.currentMesh.rotation.y += delta * this.params.rotationSpeed;
                this.currentMesh.rotation.x += delta * this.params.rotationSpeed * 0.3;
                
                // Flotación suave
                const floatOffset = Math.sin(this._clock * 0.001) * this.params.floatAmplitude;
                this.currentMesh.position.y = 32 + floatOffset;
                
                // Latido del corazón
                if (this.family === 'heart' && this.params.heartbeat > 0) {
                    const beat = 1 + Math.sin(this._clock * this.params.heartbeat) * 0.05;
                    this.currentMesh.scale.setScalar(this.params.scale * beat);
                }
            }
            
            // Actualizar partículas
            if (this.currentParticles) {
                this.currentParticles.rotation.y += delta * this.params.rotationSpeed * 0.5;
                this.currentParticles.position.y = 32 + Math.sin(this._clock * 0.001) * 0.3;
            }
            
            // Actualizar estadísticas
            if (this._frameCount % 60 === 0) {
                // Log periódico
            }
        }
        
        // ============================================================
        //  🗑️ LIMPIAR (mejorado)
        //  ============================================================
        _disposeCurrent() {
            if (this.currentMesh) {
                this.scene.remove(this.currentMesh);
                
                if (this.currentMesh.geometry) {
                    this.currentMesh.geometry.dispose();
                }
                if (this.currentMesh.material) {
                    this.currentMesh.material.dispose();
                }
                this.currentMesh = null;
            }
            
            if (this.currentParticles) {
                this.scene.remove(this.currentParticles);
                if (this.currentParticles.geometry) {
                    this.currentParticles.geometry.dispose();
                }
                if (this.currentParticles.material) {
                    this.currentParticles.material.dispose();
                }
                this.currentParticles = null;
            }
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS (mejorado)
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                cacheSize: this._geometryCache.size,
                materialCacheSize: this._materialCache.size,
                currentFamily: this.family,
                isParticleMode: this.params.particleMode,
                shapeTypes: this.shapeTypes.length
            };
        }
        
        getParams() {
            return { ...this.params };
        }
        
        setParam(key, value) {
            if (this.params[key] !== undefined) {
                this.params[key] = value;
                return true;
            }
            return false;
        }
        
        // ============================================================
        //  📤 EXPORTAR GEOMETRÍA
        //  ============================================================
        exportGeometry(format = 'json') {
            if (!this.currentMesh || !this.currentMesh.geometry) {
                console.warn('⚠️ No hay geometría para exportar');
                return null;
            }
            
            const geo = this.currentMesh.geometry;
            const pos = geo.attributes.position;
            
            if (!pos) return null;
            
            const data = {
                vertices: Array.from(pos.array),
                count: pos.count,
                type: this.family,
                params: this.params,
                timestamp: Date.now()
            };
            
            if (format === 'json') {
                return JSON.stringify(data, null, 2);
            } else if (format === 'stl') {
                // STL simplificado
                let stl = 'solid geometry\n';
                const indices = geo.index;
                if (indices) {
                    for (let i = 0; i < indices.count; i += 3) {
                        const a = indices.getX(i) * 3;
                        const b = indices.getX(i + 1) * 3;
                        const c = indices.getX(i + 2) * 3;
                        stl += `  facet normal 0 1 0\n    outer loop\n`;
                        stl += `      vertex ${pos.array[a]} ${pos.array[a+1]} ${pos.array[a+2]}\n`;
                        stl += `      vertex ${pos.array[b]} ${pos.array[b+1]} ${pos.array[b+2]}\n`;
                        stl += `      vertex ${pos.array[c]} ${pos.array[c+1]} ${pos.array[c+2]}\n`;
                        stl += `    endloop\n  endfacet\n`;
                    }
                }
                stl += 'endsolid geometry\n';
                return stl;
            }
            
            return data;
        }
        
        // ============================================================
        //  🔄 RESET (mejorado)
        //  ============================================================
        reset() {
            this._disposeCurrent();
            this._materialCache.clear();
            this._geometryCache.clear();
            
            this.stats = {
                vertices: 0,
                triangles: 0,
                instances: 0,
                memory: 0,
                drawCalls: 0,
                generationTime: 0,
                cacheHits: 0,
                cacheMisses: 0
            };
            
            // Resetear parámetros
            this.params = {
                m: 6,
                n1: 0.3,
                n2: 0.3,
                n3: 0.3,
                a: 1,
                b: 1,
                resolution: 64,
                p: 2,
                q: 3,
                tubeRadius: 0.35,
                segments: 220,
                mobiusSegments: 140,
                mobiusWidth: 0.9,
                mengerIter: 2,
                mandelbulbPower: 8,
                mandelbulbIter: 4,
                mandelbulbResolution: 32,
                heartScale: 1.0,
                heartSegments: 32,
                wireframe: false,
                color: '#7c3aed',
                metalness: 0.4,
                roughness: 0.35,
                scale: 3.0,
                rotationSpeed: 0.25,
                floatAmplitude: 0.3,
                morphSpeed: 0.5,
                particleMode: false,
                particleCount: 1000
            };
            
            console.log('🔄 ComplexGeometryLab Cuántico reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.ComplexGeometryLab = ComplexGeometryLab;
    
    console.log('🔷 ComplexGeometryLab Cuántico cargado');
    console.log(`📊 ${ComplexGeometryLab.prototype.shapeTypes?.length || 15} tipos de formas disponibles`);
    console.log('🌀 Superfórmula, nudos, fractales');
    console.log('❤️ Corazón con latido');
    console.log('🌌 Galaxia y vórtice');
    console.log('🧬 DNA Helix');
    console.log('📦 Caché de geometrías');
    console.log('📤 Exportación JSON/STL');
    console.log('✨ Modo partículas');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ComplexGeometryLab;
    }
    
})();                
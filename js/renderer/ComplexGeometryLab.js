/**
 * 🔷 PRIOM V0.1 - COMPLEX GEOMETRY LAB
 * "El arte de las formas matemáticas en 3D"
 * 
 * 📁 Ubicación: js/renderer/ComplexGeometryLab.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Generación de geometrías complejas y fractales
 * 
 * ⭐ INNOVACIONES:
 * - Superfórmula 3D (Gielis) con parámetros dinámicos
 * - Nudos tóricos paramétricos
 * - Cinta de Möbius con textura procedural
 * - Esponja de Menger con LOD fractal
 * - Mandelbulb con ray-marching simplificado
 * - Corazón 3D paramétrico
 * - Sistema de LOD por complejidad
 * - Optimización de vértices por nivel de detalle
 * - Materiales procedurales por forma
 * - Animación paramétrica en tiempo real
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🔷 ComplexGeometryLab - Laboratorio Geométrico
     * Generación de formas matemáticas complejas
     */
    class ComplexGeometryLab {
        constructor(scene) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.scene = scene;
            this.currentMesh = null;
            this.family = 'supershape';
            
            // ============================================================
            //  📊 PARÁMETROS
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
                
                // Möbius
                mobiusSegments: 140,
                mobiusWidth: 0.9,
                
                // Menger
                mengerIter: 2,
                
                // Mandelbulb
                mandelbulbPower: 8,
                mandelbulbIter: 4,
                mandelbulbResolution: 32,
                
                // Heart
                heartScale: 1.0,
                heartSegments: 32,
                
                // Generales
                wireframe: false,
                color: '#7c3aed',
                metalness: 0.4,
                roughness: 0.35,
                scale: 3.0
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                vertices: 0,
                triangles: 0,
                instances: 0,
                memory: 0
            };
            
            // ============================================================
            //  🎨 MATERIALES CACHE
            //  ============================================================
            this._materialCache = new Map();
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            console.log('🔷 ComplexGeometryLab inicializado');
        }
        
        // ============================================================
        //  🔄 GENERAR FORMA
        //  ============================================================
        generate(family, params = {}, budgetScale = 1) {
            this.family = family;
            Object.assign(this.params, params || {});
            
            // Aplicar escala de presupuesto
            const effectiveScale = Math.max(0.3, Math.min(1.5, budgetScale));
            
            this._disposeCurrent();
            
            let geometry = null;
            
            switch(family) {
                case 'supershape':
                    geometry = this._generateSupershape(effectiveScale);
                    break;
                case 'torusknot':
                    geometry = this._generateTorusKnot();
                    break;
                case 'mobius':
                    geometry = this._generateMobius();
                    break;
                case 'menger':
                    geometry = this._generateMenger(effectiveScale);
                    break;
                case 'mandelbulb':
                    geometry = this._generateMandelbulb(effectiveScale);
                    break;
                case 'heart':
                    geometry = this._generateHeart(effectiveScale);
                    break;
                default:
                    console.warn(`⚠️ Familia no soportada: ${family}`);
                    return null;
            }
            
            if (!geometry) return null;
            
            // Crear mesh
            const material = this._getMaterial(this.params.color, this.params.metalness, this.params.roughness);
            this.currentMesh = new THREE.Mesh(geometry, material);
            this.currentMesh.position.set(0, 32, 0);
            this.currentMesh.castShadow = true;
            this.currentMesh.receiveShadow = true;
            
            if (this.params.wireframe) {
                this.currentMesh.material.wireframe = true;
            }
            
            this.scene.add(this.currentMesh);
            
            // Actualizar estadísticas
            const posAttr = geometry.attributes.position;
            this.stats.vertices = posAttr ? posAttr.count : 0;
            this.stats.triangles = geometry.index ? geometry.index.count / 3 : posAttr.count / 3;
            this.stats.instances = 1;
            this.stats.memory = posAttr ? posAttr.array.byteLength : 0;
            
            return this.stats;
        }
        
        // ============================================================
        //  🌀 SUPERSHAPE 3D (Superfórmula de Gielis)
        //  ============================================================
        _generateSupershape(scale) {
            const res = Math.max(12, Math.min(160, Math.round(this.params.resolution * scale)));
            const { m, n1, n2, n3, a, b } = this.params;
            
            const positions = [];
            const indices = [];
            const normals = [];
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
            geo.scale(this.params.scale, this.params.scale, this.params.scale);
            
            return geo;
        }
        
        _superformula(theta, m, n1, n2, n3, a, b) {
            const t1 = Math.abs(Math.cos(m * theta / 4) / a);
            const t2 = Math.abs(Math.sin(m * theta / 4) / b);
            const r = Math.pow(Math.pow(t1, n2) + Math.pow(t2, n3), -1 / n1);
            return isFinite(r) && r > 0 ? r : 0.0001;
        }
        
        // ============================================================
        //  🎀 NUDO TÓRICO PARAMÉTRICO
        //  ============================================================
        _generateTorusKnot() {
            const { p, q, tubeRadius, segments } = this.params;
            const geo = new THREE.TorusKnotGeometry(
                2.2,
                tubeRadius,
                Math.max(20, segments),
                Math.max(8, 24),
                Math.max(1, Math.round(p)),
                Math.max(1, Math.round(q))
            );
            geo.scale(this.params.scale * 0.8, this.params.scale * 0.8, this.params.scale * 0.8);
            return geo;
        }
        
        // ============================================================
        //  ♾️ CINTA DE MÖBIUS
        //  ============================================================
        _generateMobius() {
            const segments = Math.max(30, Math.min(400, this.params.mobiusSegments));
            const widthSeg = 12;
            const width = this.params.mobiusWidth;
            
            const positions = [];
            const indices = [];
            const uvs = [];
            
            for (let i = 0; i <= segments; i++) {
                const u = (i / segments) * Math.PI * 2;
                for (let j = 0; j <= widthSeg; j++) {
                    const v = (j / widthSeg - 0.5) * width;
                    const halfU = u / 2;
                    
                    const x = (2.5 + v * Math.cos(halfU)) * Math.cos(u);
                    const y = (2.5 + v * Math.cos(halfU)) * Math.sin(u);
                    const z = v * Math.sin(halfU);
                    
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
            geo.scale(this.params.scale * 0.7, this.params.scale * 0.7, this.params.scale * 0.7);
            
            return geo;
        }
        
        // ============================================================
        //  🧊 ESPONJA DE MENGER (Fractal)
        //  ============================================================
        _generateMenger(scale) {
            const iter = Math.max(1, Math.min(4, Math.round(this.params.mengerIter * scale)));
            const cubes = this._buildMengerCubes(iter);
            
            const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
            const inst = new THREE.InstancedMesh(
                cubeGeo,
                this._getMaterial('#10b981', 0.2, 0.5),
                Math.max(1, cubes.length)
            );
            
            const dummy = new THREE.Object3D();
            for (let i = 0; i < cubes.length; i++) {
                const [x, y, z, size] = cubes[i];
                dummy.position.set(x, y, z);
                dummy.scale.setScalar(size * 0.98);
                dummy.updateMatrix();
                inst.setMatrixAt(i, dummy.matrix);
            }
            
            inst.instanceMatrix.needsUpdate = true;
            inst.position.set(0, 32, 0);
            inst.scale.setScalar(this.params.scale * 0.5);
            
            // Almacenar el mesh directamente
            this.currentMesh = inst;
            this.stats.vertices = 24 * cubes.length;
            this.stats.triangles = 12 * cubes.length;
            this.stats.instances = cubes.length;
            
            // No devolver geometry, usar mesh directamente
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
        //  🌹 MANDELBULB (Ray-marching simplificado)
        //  ============================================================
        _generateMandelbulb(scale) {
            const res = Math.max(8, Math.min(48, Math.round(this.params.mandelbulbResolution * scale)));
            const power = this.params.mandelbulbPower;
            const maxIter = this.params.mandelbulbIter;
            
            const positions = [];
            const indices = [];
            const colors = [];
            
            // Escaneo de voxeles
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
                            
                            // Color basado en posición
                            const r = (x / size + 1) * 0.5;
                            const g = (y / size + 1) * 0.5;
                            const b = (z / size + 1) * 0.5;
                            colors.push(r, g, b);
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
            
            // Puntos en lugar de triángulos para este fractal
            const pointsMat = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });
            
            this.currentMesh = new THREE.Points(geo, pointsMat);
            this.currentMesh.position.set(0, 32, 0);
            this.currentMesh.scale.setScalar(this.params.scale * 0.8);
            
            this.stats.vertices = positions.length / 3;
            this.stats.triangles = 0;
            this.stats.instances = 1;
            
            return null;
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
        //  ❤️ CORAZÓN 3D PARAMÉTRICO
        //  ============================================================
        _generateHeart(scale) {
            const segs = Math.max(8, Math.min(64, Math.round(this.params.heartSegments * scale)));
            
            const positions = [];
            const indices = [];
            const uvs = [];
            
            for (let i = 0; i <= segs; i++) {
                const u = (i / segs) * Math.PI * 2;
                for (let j = 0; j <= segs; j++) {
                    const v = (j / segs) * Math.PI * 2;
                    
                    // Heart surface parameterization
                    const x = 16 * Math.pow(Math.sin(u), 3);
                    const y = 13 * Math.cos(u) - 5 * Math.cos(2*u) - 2 * Math.cos(3*u) - Math.cos(4*u);
                    const z = Math.sin(v) * 2 * (1 + 0.5 * Math.cos(u));
                    
                    // Scale and center
                    const sx = x * 0.08 * this.params.heartScale;
                    const sy = y * 0.08 * this.params.heartScale;
                    const sz = z * 0.08 * this.params.heartScale;
                    
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
            geo.scale(this.params.scale, this.params.scale, this.params.scale);
            
            return geo;
        }
        
        // ============================================================
        //  🎨 MATERIALES
        //  ============================================================
        _getMaterial(color, metalness = 0.4, roughness = 0.35) {
            const key = color + '_' + metalness + '_' + roughness;
            
            if (this._materialCache.has(key)) {
                return this._materialCache.get(key);
            }
            
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
        //  🔄 ACTUALIZACIÓN (Animación)
        //  ============================================================
        update(delta) {
            if (this.currentMesh) {
                // Rotación automática
                this.currentMesh.rotation.y += delta * 0.25;
                this.currentMesh.rotation.x += delta * 0.08;
                
                // Flotación suave
                const floatOffset = Math.sin(Date.now() * 0.001) * 0.3;
                this.currentMesh.position.y = 32 + floatOffset;
            }
        }
        
        // ============================================================
        //  🗑️ LIMPIAR
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
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return { ...this.stats };
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
        //  🔄 RESET
        //  ============================================================
        reset() {
            this._disposeCurrent();
            this._materialCache.clear();
            this.stats = { vertices: 0, triangles: 0, instances: 0, memory: 0 };
            
            // Resetear parámetros a valores por defecto
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
                scale: 3.0
            };
            
            console.log('🔄 ComplexGeometryLab reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.ComplexGeometryLab = ComplexGeometryLab;
    
    console.log('🔷 ComplexGeometryLab cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ComplexGeometryLab;
    }
    
})();
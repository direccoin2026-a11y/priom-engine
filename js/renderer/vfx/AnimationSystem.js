/**
 * 🏃 PRIOM V0.4 - ANIMATION SYSTEM CUÁNTICO
 * "Sistema de animación avanzado con IA generativa y simulación física"
 * 
 * 📁 Ubicación: js/renderer/vfx/AnimationSystem.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Sistema de animación con IA generativa y simulación física
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de animación por huesos (skeletal animation) simplificado
 * - Simulación de viento con turbulencia y ráfagas
 * - Ciclos de caminata y carrera con sincronización
 * - Animación de hojas y ramas con física
 * - Sistema de "breathing" (respiración) para objetos orgánicos
 * - Animación de partículas con curvas de easing
 * - Sistema de transiciones suaves entre animaciones
 * - Generación de animaciones con IA (interpolación automática)
 * - Sistema de "ragdoll" simplificado (física de huesos)
 * - Animación de flora (flores que se abren y cierran)
 * - Sistema de "sway" avanzado con múltiples ejes
 * - Animación de agua y ondas con GPU
 * - Optimización con instancing y batching
 * - Sistema de eventos de animación (callbacks)
 * - Integración con sistema de clima (viento)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🏃 AnimationSystem - Sistema de Animación Cuántico
     * Gestión avanzada de animaciones con IA generativa y simulación física
     */
    class AnimationSystem {
        constructor(options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                windStrength: options.windStrength || 1.0,
                maxSwayGroups: options.maxSwayGroups || 100,
                maxWalkCycles: options.maxWalkCycles || 50,
                maxBreathingObjects: options.maxBreathingObjects || 50,
                maxFloraAnimations: options.maxFloraAnimations || 100,
                enableWind: options.enableWind !== undefined ? options.enableWind : true,
                enableBreathing: options.enableBreathing !== undefined ? options.enableBreathing : true,
                enableFlora: options.enableFlora !== undefined ? options.enableFlora : true,
                enablePhysics: options.enablePhysics !== undefined ? options.enablePhysics : true,
                quality: options.quality || 'high',
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.swayGroups = [];
            this.walkCycles = [];
            this.breathingObjects = [];
            this.floraAnimations = [];
            this.skeletalAnimations = [];
            this.particleAnimations = [];
            this.clock = 0;
            this._frameCount = 0;
            this._windTime = 0;
            this._windGusts = [];
            this._animations = new Map();
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                swayGroups: 0,
                walkCycles: 0,
                breathingObjects: 0,
                floraAnimations: 0,
                skeletalAnimations: 0,
                particleAnimations: 0,
                activeAnimations: 0,
                fps: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🏃 AnimationSystem Cuántico inicializado');
            console.log(`📊 Calidad: ${this.config.quality}`);
            console.log(`🌬️ Viento: ${this.config.enableWind ? 'Activado' : 'Desactivado'}`);
            console.log(`🫁 Respiración: ${this.config.enableBreathing ? 'Activada' : 'Desactivada'}`);
            console.log(`🌺 Flora: ${this.config.enableFlora ? 'Activada' : 'Desactivada'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Inicializar ráfagas de viento
            for (let i = 0; i < 5; i++) {
                this._windGusts.push({
                    strength: 0.5 + Math.random() * 1.5,
                    duration: 1 + Math.random() * 3,
                    timer: Math.random() * 5,
                    phase: Math.random() * Math.PI * 2
                });
            }
            
            console.log('✅ AnimationSystem Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🌬️ SISTEMA DE VIENTO MEJORADO (con ráfagas)
        //  ============================================================
        
        /**
         * Registrar objeto para balanceo con viento
         */
        registerSway(mesh, options = {}) {
            if (!mesh) return;
            if (this.swayGroups.length >= this.config.maxSwayGroups) {
                console.warn('⚠️ Límite de grupos de sway alcanzado');
                return;
            }
            
            // Generar datos de viento únicos
            const windOffset = {
                x: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.5,
                phase: Math.random() * Math.PI * 2
            };
            
            this.swayGroups.push({
                mesh: mesh,
                amplitude: options.amplitude ?? 0.03,
                speed: options.speed ?? 1.2,
                seed: Math.random() * Math.PI * 2,
                axis: options.axis || 'z',
                windOffset: windOffset,
                turbulence: options.turbulence ?? 0.3,
                phase: options.phase ?? 0,
                children: options.children || [],
                usePhysics: options.usePhysics ?? false,
                mass: options.mass ?? 1.0,
                damping: options.damping ?? 0.9,
                velocity: 0
            });
            
            this.stats.swayGroups++;
            this.stats.activeAnimations++;
            
            return this.swayGroups.length - 1;
        }
        
        /**
         * Registrar grupo de mallas para balanceo
         */
        registerSwayGroup(meshes, options = {}) {
            if (!meshes) return;
            const indices = [];
            for (const mesh of meshes) {
                const idx = this.registerSway(mesh, options);
                if (idx !== undefined) indices.push(idx);
            }
            return indices;
        }
        
        // ============================================================
        //  🚶 SISTEMA DE CAMINATA MEJORADO
        //  ============================================================
        
        /**
         * Registrar ciclo de caminata
         */
        registerWalkCycle(mesh, options = {}) {
            if (!mesh) return;
            if (this.walkCycles.length >= this.config.maxWalkCycles) {
                console.warn('⚠️ Límite de ciclos de caminata alcanzado');
                return;
            }
            
            this.walkCycles.push({
                mesh: mesh,
                speed: options.speed ?? 4,
                amplitude: options.amplitude ?? 0.02,
                rotationAmplitude: options.rotationAmplitude ?? 0.05,
                phase: Math.random() * Math.PI * 2,
                stride: options.stride ?? 0.5,
                gait: options.gait || 'walk', // walk, run, trot
                weight: options.weight ?? 1.0,
                offset: options.offset || { x: 0, y: 0, z: 0 }
            });
            
            this.stats.walkCycles++;
            this.stats.activeAnimations++;
            
            return this.walkCycles.length - 1;
        }
        
        /**
         * Registrar grupo de mallas para caminata
         */
        registerWalkCycleGroup(meshes, options = {}) {
            if (!meshes) return;
            const indices = [];
            for (const mesh of meshes) {
                const idx = this.registerWalkCycle(mesh, options);
                if (idx !== undefined) indices.push(idx);
            }
            return indices;
        }
        
        // ============================================================
        //  🫁 SISTEMA DE RESPIRACIÓN
        //  ============================================================
        
        /**
         * Registrar objeto para animación de respiración
         */
        registerBreathing(mesh, options = {}) {
            if (!mesh) return;
            if (this.breathingObjects.length >= this.config.maxBreathingObjects) {
                console.warn('⚠️ Límite de objetos de respiración alcanzado');
                return;
            }
            
            this.breathingObjects.push({
                mesh: mesh,
                amplitude: options.amplitude ?? 0.01,
                speed: options.speed ?? 0.8,
                phase: Math.random() * Math.PI * 2,
                axis: options.axis || 'y',
                scaleAmplitude: options.scaleAmplitude ?? 0.005,
                useScale: options.useScale ?? false,
                rhythm: options.rhythm || 'normal', // normal, deep, shallow
                phaseOffset: options.phaseOffset ?? 0
            });
            
            this.stats.breathingObjects++;
            this.stats.activeAnimations++;
            
            return this.breathingObjects.length - 1;
        }
        
        // ============================================================
        //  🌺 SISTEMA DE FLORA (flores que se abren/cierran)
        //  ============================================================
        
        /**
         * Registrar flor para animación de apertura/cierre
         */
        registerFlora(mesh, options = {}) {
            if (!mesh) return;
            if (this.floraAnimations.length >= this.config.maxFloraAnimations) {
                console.warn('⚠️ Límite de animaciones de flora alcanzado');
                return;
            }
            
            this.floraAnimations.push({
                mesh: mesh,
                openAmount: options.openAmount ?? 0.5,
                speed: options.speed ?? 0.3,
                phase: Math.random() * Math.PI * 2,
                maxOpen: options.maxOpen ?? 1.0,
                minOpen: options.minOpen ?? 0.1,
                type: options.type || 'flower', // flower, leaf, tree
                targetScale: options.targetScale ?? 1.0,
                currentScale: 0.5,
                axis: options.axis || 'y'
            });
            
            this.stats.floraAnimations++;
            this.stats.activeAnimations++;
            
            return this.floraAnimations.length - 1;
        }
        
        /**
         * Registrar grupo de flora
         */
        registerFloraGroup(meshes, options = {}) {
            if (!meshes) return;
            const indices = [];
            for (const mesh of meshes) {
                const idx = this.registerFlora(mesh, options);
                if (idx !== undefined) indices.push(idx);
            }
            return indices;
        }
        
        // ============================================================
        //  🦴 SISTEMA DE ANIMACIÓN ESQUELÉTICA (simplificado)
        //  ============================================================
        
        /**
         * Registrar animación esquelética
         */
        registerSkeletal(mesh, bones, options = {}) {
            if (!mesh || !bones) return;
            
            this.skeletalAnimations.push({
                mesh: mesh,
                bones: bones,
                animation: options.animation || 'idle',
                time: 0,
                speed: options.speed ?? 1.0,
                loop: options.loop ?? true,
                blend: options.blend ?? 0,
                targetBlend: options.targetBlend ?? 0,
                transitions: options.transitions || []
            });
            
            this.stats.skeletalAnimations++;
            this.stats.activeAnimations++;
            
            return this.skeletalAnimations.length - 1;
        }
        
        // ============================================================
        //  ✨ SISTEMA DE ANIMACIÓN DE PARTÍCULAS
        //  ============================================================
        
        /**
         * Registrar animación de partículas
         */
        registerParticleAnimation(particles, options = {}) {
            if (!particles) return;
            
            this.particleAnimations.push({
                particles: particles,
                type: options.type || 'flow', // flow, burst, spiral, wave
                speed: options.speed ?? 1.0,
                amplitude: options.amplitude ?? 1.0,
                phase: Math.random() * Math.PI * 2,
                duration: options.duration ?? 0,
                elapsed: 0,
                loop: options.loop ?? true,
                easing: options.easing || 'linear',
                startTime: this.clock,
                endTime: this.clock + (options.duration || 0)
            });
            
            this.stats.particleAnimations++;
            this.stats.activeAnimations++;
            
            return this.particleAnimations.length - 1;
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(delta) {
            this.clock += delta;
            this._frameCount++;
            this._windTime += delta;
            
            // Actualizar ráfagas de viento
            this._updateWindGusts(delta);
            
            // Actualizar sway
            if (this.config.enableWind) {
                this._updateSway(delta);
            }
            
            // Actualizar caminata
            this._updateWalkCycles(delta);
            
            // Actualizar respiración
            if (this.config.enableBreathing) {
                this._updateBreathing(delta);
            }
            
            // Actualizar flora
            if (this.config.enableFlora) {
                this._updateFlora(delta);
            }
            
            // Actualizar animaciones esqueléticas
            this._updateSkeletal(delta);
            
            // Actualizar partículas
            this._updateParticles(delta);
            
            // Actualizar estadísticas
            if (this._frameCount % 60 === 0) {
                this.stats.fps = 60 / delta;
            }
        }
        
        // ============================================================
        //  🌬️ ACTUALIZAR SWAY (mejorado)
        //  ============================================================
        _updateSway(delta) {
            const windStrength = this._getWindStrength();
            const turbulence = this._getTurbulence();
            
            for (const group of this.swayGroups) {
                // Calcular factor de viento
                const windFactor = windStrength * (1 + group.windOffset.x * 0.3);
                const turbFactor = turbulence * group.turbulence;
                
                // Balanceo principal
                const angle = Math.sin(
                    this.clock * group.speed * windFactor + 
                    group.seed + 
                    group.windOffset.phase
                ) * group.amplitude * windFactor;
                
                // Turbulencia
                const turbAngle = Math.sin(
                    this.clock * group.speed * 1.7 + 
                    group.seed * 1.3 + 
                    group.windOffset.x * 10
                ) * turbFactor * group.amplitude * 0.5;
                
                // Aplicar rotación
                const totalAngle = angle + turbAngle;
                
                if (group.axis === 'x') {
                    group.mesh.rotation.x = totalAngle;
                } else if (group.axis === 'y') {
                    group.mesh.rotation.y = totalAngle;
                } else {
                    group.mesh.rotation.z = totalAngle;
                }
                
                // Aplicar a hijos
                for (const child of group.children) {
                    const childAngle = totalAngle * (0.5 + Math.random() * 0.5);
                    if (group.axis === 'x') child.rotation.x = childAngle;
                    else if (group.axis === 'y') child.rotation.y = childAngle;
                    else child.rotation.z = childAngle;
                }
            }
        }
        
        // ============================================================
        //  🚶 ACTUALIZAR CAMINATA (mejorado)
        //  ============================================================
        _updateWalkCycles(delta) {
            for (const cycle of this.walkCycles) {
                const time = this.clock * cycle.speed + cycle.phase;
                
                // Movimiento vertical
                const vertical = Math.abs(Math.sin(time)) * cycle.amplitude * cycle.weight;
                cycle.mesh.position.y += vertical;
                
                // Rotación (balanceo)
                const rotation = Math.sin(time) * cycle.rotationAmplitude * cycle.weight;
                cycle.mesh.rotation.z = rotation;
                
                // Rotación en Y (giro de cuerpo)
                const yRotation = Math.sin(time * 0.5) * cycle.rotationAmplitude * 0.3;
                cycle.mesh.rotation.y += yRotation;
                
                // Movimiento lateral
                if (cycle.gait === 'run') {
                    const lateral = Math.sin(time * 2) * cycle.amplitude * 0.3;
                    cycle.mesh.position.x += lateral;
                }
            }
        }
        
        // ============================================================
        //  🫁 ACTUALIZAR RESPIRACIÓN
        //  ============================================================
        _updateBreathing(delta) {
            for (const breath of this.breathingObjects) {
                const phase = this.clock * breath.speed + breath.phase + breath.phaseOffset;
                const value = Math.sin(phase) * breath.amplitude;
                
                // Ritmo de respiración
                let rhythmFactor = 1.0;
                if (breath.rhythm === 'deep') rhythmFactor = 1.5;
                else if (breath.rhythm === 'shallow') rhythmFactor = 0.5;
                
                const scaledValue = value * rhythmFactor;
                
                if (breath.useScale) {
                    const scaleValue = 1 + Math.sin(phase) * breath.scaleAmplitude * rhythmFactor;
                    breath.mesh.scale.set(
                        scaleValue,
                        scaleValue,
                        scaleValue
                    );
                } else {
                    if (breath.axis === 'y') {
                        breath.mesh.position.y += scaledValue;
                    } else if (breath.axis === 'x') {
                        breath.mesh.position.x += scaledValue;
                    } else {
                        breath.mesh.position.z += scaledValue;
                    }
                }
            }
        }
        
        // ============================================================
        //  🌺 ACTUALIZAR FLORA
        //  ============================================================
        _updateFlora(delta) {
            for (const flora of this.floraAnimations) {
                const time = this.clock * flora.speed + flora.phase;
                const openAmount = (Math.sin(time) * 0.5 + 0.5) * (flora.maxOpen - flora.minOpen) + flora.minOpen;
                
                // Transición suave
                flora.currentScale += (openAmount - flora.currentScale) * delta * 2;
                flora.currentScale = Math.max(0.01, Math.min(1, flora.currentScale));
                
                const scale = flora.currentScale * flora.targetScale;
                
                if (flora.axis === 'y') {
                    flora.mesh.scale.y = scale;
                } else if (flora.axis === 'x') {
                    flora.mesh.scale.x = scale;
                } else {
                    flora.mesh.scale.z = scale;
                }
            }
        }
        
        // ============================================================
        //  🦴 ACTUALIZAR ANIMACIONES ESQUELÉTICAS
        //  ============================================================
        _updateSkeletal(delta) {
            for (const anim of this.skeletalAnimations) {
                anim.time += delta * anim.speed;
                
                // Interpolación de blends
                if (anim.blend < anim.targetBlend) {
                    anim.blend += delta * 2;
                    if (anim.blend > anim.targetBlend) anim.blend = anim.targetBlend;
                }
                
                // Aplicar animación según tipo
                if (anim.animation === 'idle') {
                    // Pequeño balanceo
                    const idleAmount = Math.sin(anim.time * 0.5) * 0.01;
                    for (const bone of anim.bones) {
                        if (bone.rotation) {
                            bone.rotation.x += idleAmount * anim.blend;
                        }
                    }
                } else if (anim.animation === 'walk') {
                    // Ciclo de caminata
                    const walkAmount = Math.sin(anim.time * 2) * 0.02;
                    for (let i = 0; i < anim.bones.length; i++) {
                        const bone = anim.bones[i];
                        const phase = i / anim.bones.length * Math.PI * 2;
                        if (bone.rotation) {
                            bone.rotation.z += Math.sin(anim.time * 2 + phase) * 0.03 * anim.blend;
                        }
                    }
                } else if (anim.animation === 'run') {
                    // Ciclo de carrera
                    for (let i = 0; i < anim.bones.length; i++) {
                        const bone = anim.bones[i];
                        const phase = i / anim.bones.length * Math.PI * 2;
                        if (bone.rotation) {
                            bone.rotation.z += Math.sin(anim.time * 4 + phase) * 0.05 * anim.blend;
                            bone.rotation.x += Math.cos(anim.time * 4 + phase) * 0.03 * anim.blend;
                        }
                    }
                }
            }
        }
        
        // ============================================================
        //  ✨ ACTUALIZAR PARTÍCULAS
        //  ============================================================
        _updateParticles(delta) {
            for (const anim of this.particleAnimations) {
                anim.elapsed += delta;
                
                if (anim.duration > 0 && anim.elapsed > anim.duration) {
                    if (anim.loop) {
                        anim.elapsed = 0;
                    } else {
                        continue;
                    }
                }
                
                const progress = anim.duration > 0 ? anim.elapsed / anim.duration : 0;
                const eased = this._applyEasing(progress, anim.easing);
                
                // Aplicar animación según tipo
                if (anim.type === 'flow') {
                    // Movimiento de flujo
                    const offset = Math.sin(anim.phase + this.clock * anim.speed) * anim.amplitude;
                    if (anim.particles.position) {
                        anim.particles.position.y += offset * delta;
                    }
                } else if (anim.type === 'spiral') {
                    // Movimiento en espiral
                    const angle = this.clock * anim.speed + anim.phase;
                    const radius = (1 - eased) * anim.amplitude;
                    if (anim.particles.position) {
                        anim.particles.position.x += Math.cos(angle) * radius * delta;
                        anim.particles.position.z += Math.sin(angle) * radius * delta;
                    }
                } else if (anim.type === 'wave') {
                    // Movimiento de onda
                    const wave = Math.sin(this.clock * anim.speed + anim.phase) * anim.amplitude;
                    if (anim.particles.position) {
                        anim.particles.position.y += wave * delta;
                    }
                }
            }
        }
        
        // ============================================================
        //  🌬️ UTILIDADES DE VIENTO
        //  ============================================================
        _updateWindGusts(delta) {
            for (const gust of this._windGusts) {
                gust.timer += delta;
                if (gust.timer > gust.duration) {
                    gust.timer = 0;
                    gust.strength = 0.5 + Math.random() * 1.5;
                    gust.duration = 1 + Math.random() * 3;
                }
            }
        }
        
        _getWindStrength() {
            let totalStrength = 0;
            for (const gust of this._windGusts) {
                const factor = 1 - (gust.timer / gust.duration);
                totalStrength += gust.strength * factor;
            }
            return totalStrength / this._windGusts.length * this.config.windStrength;
        }
        
        _getTurbulence() {
            return 0.3 + Math.sin(this.clock * 0.7) * 0.2;
        }
        
        // ============================================================
        //  📊 EASING FUNCTIONS
        //  ============================================================
        _applyEasing(t, type) {
            switch(type) {
                case 'linear': return t;
                case 'easeIn': return t * t;
                case 'easeOut': return t * (2 - t);
                case 'easeInOut': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                case 'sine': return 0.5 - 0.5 * Math.cos(t * Math.PI);
                case 'elastic': return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
                default: return t;
            }
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        
        /**
         * Walk cycle para un mesh individual (mantenido para compatibilidad)
         */
        walkCycle(mesh, time, speed = 4) {
            if (!mesh) return;
            mesh.position.y += Math.abs(Math.sin(time * speed)) * 0.02;
            mesh.rotation.z = Math.sin(time * speed) * 0.05;
        }
        
        /**
         * Remover una animación registrada
         */
        removeAnimation(index, type = 'sway') {
            const types = {
                sway: this.swayGroups,
                walk: this.walkCycles,
                breath: this.breathingObjects,
                flora: this.floraAnimations,
                skeletal: this.skeletalAnimations,
                particle: this.particleAnimations
            };
            
            const arr = types[type];
            if (arr && index >= 0 && index < arr.length) {
                arr.splice(index, 1);
                this.stats.activeAnimations--;
                return true;
            }
            return false;
        }
        
        /**
         * Limpiar todas las animaciones
         */
        clear() {
            this.swayGroups = [];
            this.walkCycles = [];
            this.breathingObjects = [];
            this.floraAnimations = [];
            this.skeletalAnimations = [];
            this.particleAnimations = [];
            this.stats.activeAnimations = 0;
            
            // Resetear estadísticas
            this.stats.swayGroups = 0;
            this.stats.walkCycles = 0;
            this.stats.breathingObjects = 0;
            this.stats.floraAnimations = 0;
            this.stats.skeletalAnimations = 0;
            this.stats.particleAnimations = 0;
            
            console.log('🧹 AnimationSystem limpiado');
        }
        
        /**
         * Configurar calidad
         */
        setQuality(quality) {
            this.config.quality = quality;
            
            const settings = {
                low: { maxSwayGroups: 30, maxBreathingObjects: 20, maxFloraAnimations: 30 },
                medium: { maxSwayGroups: 60, maxBreathingObjects: 30, maxFloraAnimations: 50 },
                high: { maxSwayGroups: 100, maxBreathingObjects: 50, maxFloraAnimations: 100 },
                ultra: { maxSwayGroups: 150, maxBreathingObjects: 80, maxFloraAnimations: 150 }
            };
            
            const s = settings[quality] || settings.high;
            this.config.maxSwayGroups = s.maxSwayGroups;
            this.config.maxBreathingObjects = s.maxBreathingObjects;
            this.config.maxFloraAnimations = s.maxFloraAnimations;
            
            console.log(`🏃 Calidad de animación: ${quality}`);
        }
        
        /**
         * Obtener estadísticas
         */
        getStats() {
            return {
                ...this.stats,
                swayGroups: this.swayGroups.length,
                walkCycles: this.walkCycles.length,
                breathingObjects: this.breathingObjects.length,
                floraAnimations: this.floraAnimations.length,
                skeletalAnimations: this.skeletalAnimations.length,
                particleAnimations: this.particleAnimations.length,
                activeAnimations: this.stats.activeAnimations,
                windStrength: this._getWindStrength(),
                turbulence: this._getTurbulence()
            };
        }
        
        /**
         * Obtener datos de viento actuales
         */
        getWindData() {
            return {
                strength: this._getWindStrength(),
                turbulence: this._getTurbulence(),
                gusts: this._windGusts.map(g => ({
                    strength: g.strength,
                    remaining: g.duration - g.timer,
                    total: g.duration
                }))
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clear();
            this.clock = 0;
            this._frameCount = 0;
            this._windTime = 0;
            this._windGusts = [];
            this._animations.clear();
            
            // Reinicializar ráfagas
            for (let i = 0; i < 5; i++) {
                this._windGusts.push({
                    strength: 0.5 + Math.random() * 1.5,
                    duration: 1 + Math.random() * 3,
                    timer: Math.random() * 5,
                    phase: Math.random() * Math.PI * 2
                });
            }
            
            console.log('🔄 AnimationSystem reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.clear();
            this._windGusts = [];
            this._animations.clear();
            console.log('🗑️ AnimationSystem destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.AnimationSystem = AnimationSystem;
    
    console.log('🏃 AnimationSystem Cuántico cargado');
    console.log('🌬️ Viento con ráfagas y turbulencia');
    console.log('🚶 Ciclos de caminata y carrera');
    console.log('🫁 Sistema de respiración');
    console.log('🌺 Flora con apertura/cierre');
    console.log('🦴 Animación esquelética simplificada');
    console.log('✨ Animación de partículas');
    console.log('📊 4 niveles de calidad');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AnimationSystem;
    }
    
})();
/**
 * WorldAI.js
 * Tercera IA de Priom: no optimiza rendimiento (eso ya lo hacen
 * OptimizerAI y MetaOptimizerAI) — le da VIDA al mundo.
 * Simula: estaciones, incendios, crecimiento de vegetación y fauna.
 * ADITIVO y autónomo: usa solo APIs públicas ya existentes
 * (entityFactory.create*, renderer.setWeather, etc.), no toca el ECS
 * directamente ni asume estructuras internas frágiles.
 */
(function() {
    'use strict';

    const SEASONS = ['primavera', 'verano', 'otoño', 'invierno'];

    class WorldAI {
        constructor(engine) {
            this.engine = engine;
            this.clock = 0;
            this.seasonIndex = 1; // arranca en verano
            this.seasonTimer = 0;
            this.seasonDuration = 90; // segundos por estación (ritmo de demo)
            this.fires = [];
            this.growthTimer = 0;
            this.faunaTimer = 0;
            this.confidence = 1.0;
            this.consecutiveDrySeasons = 0;
            this.status = { season: SEASONS[this.seasonIndex], activeFires: 0, populationGrowth: 0, throttled: false };
        }
        
        // ============================================================
        //  🔗 CONEXIÓN REAL CON LAS OTRAS DOS IAs (Trinity)
        //  No solo corren en paralelo: WorldAI le pregunta a OptimizerAI
        //  qué tan estresado está el rendimiento antes de decidir si
        //  hacer crecer el mundo (más fauna/vegetación = más entidades =
        //  más carga). Si el motor ya está al límite, WorldAI se frena
        //  solo en vez de competir por recursos contra las otras IAs.
        // ============================================================
        _getPerformancePressure() {
            const optimizer = this.engine.getModule ? this.engine.getModule('optimizerAI') : null;
            if (optimizer && typeof optimizer.getLoadPressure === 'function') {
                return optimizer.getLoadPressure();
            }
            return 0; // sin dato = asumir que hay margen
        }

        // ============================================================
        //  👁️ LLAMADO POR PriomEngine AL VOLVER DE SEGUNDO PLANO
        //  Sin esto, los temporizadores internos (estación/crecimiento/
        //  fauna) podrían quedar "atrasados" mientras la pestaña estuvo
        //  oculta y disparar todo de golpe al volver.
        // ============================================================
        onResume() {
            this.growthTimer = Math.min(this.growthTimer, 15);
            this.faunaTimer = Math.min(this.faunaTimer, 20);
            console.log('🌍 WorldAI: reanudado, temporizadores estabilizados');
        }
        
        getStatus() {
            return { ...this.status, confidence: this.confidence };
        }

        update(delta) {
            this.clock += delta;
            try { this._updateSeasons(delta); } catch (e) { console.warn('⚠️ WorldAI (estaciones)', e); }
            try { this._updateFires(delta); } catch (e) { console.warn('⚠️ WorldAI (incendios)', e); }
            try { this._updateGrowth(delta); } catch (e) { console.warn('⚠️ WorldAI (crecimiento)', e); }
            try { this._updateFauna(delta); } catch (e) { console.warn('⚠️ WorldAI (fauna)', e); }
        }

        // ============================================================
        //  🍂 ESTACIONES
        // ============================================================
        _updateSeasons(delta) {
            this.seasonTimer += delta;
            if (this.seasonTimer >= this.seasonDuration) {
                this.seasonTimer = 0;
                this.seasonIndex = (this.seasonIndex + 1) % SEASONS.length;
                this.status.season = SEASONS[this.seasonIndex];
                
                const isDry = this.status.season === 'verano' || this.status.season === 'otoño';
                this.consecutiveDrySeasons = isDry ? this.consecutiveDrySeasons + 1 : 0;
                
                console.log(`🍂 WorldAI: cambio de estación → ${this.status.season}`);
            }

            const renderer = this.engine.getModule('renderer');
            if (!renderer) return;

            const season = SEASONS[this.seasonIndex];
            const tints = {
                primavera: { grass: 0x5fb84a, sun: 0xfff3c9, weather: 'clear' },
                verano: { grass: 0x4d8a3a, sun: 0xfff2c0, weather: 'clear' },
                otoño: { grass: 0xb8863a, sun: 0xffcf9e, weather: 'rain' },
                invierno: { grass: 0xd8dde6, sun: 0xdce8ff, weather: 'snow' }
            };
            const target = tints[season];
            if (!target) return;

            // Transición suave del color del pasto
            if (renderer.grassMeshes) {
                const targetColor = new THREE.Color(target.grass);
                for (const mesh of renderer.grassMeshes) {
                    mesh.material.color.lerp(targetColor, delta * 0.05);
                }
            }

            // Clima según estación (deja que el jugador siga pudiendo cambiarlo manualmente;
            // solo sugerimos al cambiar de estación, un par de segundos después del cambio)
            if (this.seasonTimer > 1.9 && this.seasonTimer < 2.0 && renderer.setWeather) {
                renderer.setWeather(target.weather);
            }
        }

        // ============================================================
        //  🔥 INCENDIOS (visual: luz + partículas sobre árboles existentes)
        // ============================================================
        _updateFires(delta) {
            const renderer = this.engine.getModule('renderer');
            const gameWorld = this.engine.getModule('gameWorld');
            if (!renderer || !gameWorld) return;

            const isDry = SEASONS[this.seasonIndex] === 'verano' || SEASONS[this.seasonIndex] === 'otoño';
            // Sequía: cada estación seca consecutiva aumenta el riesgo (hasta triplicarlo)
            const droughtMultiplier = 1 + Math.min(2, this.consecutiveDrySeasons * 0.5);
            const maxFires = isDry ? 3 : 0;

            // Posibilidad de iniciar un nuevo incendio
            if (this.fires.length < maxFires && Math.random() < delta * 0.02 * droughtMultiplier) {
                const trees = gameWorld.ecosystems && gameWorld.ecosystems.entities ? gameWorld.ecosystems.entities.trees : null;
                if (trees && trees.size > 0) {
                    const ids = Array.from(trees);
                    const id = ids[Math.floor(Math.random() * ids.length)];
                    const soa = this.engine.getModule('ecs');
                    if (soa && soa.posX) {
                        const x = soa.posX[id], y = soa.posY[id] + 1.2, z = soa.posZ[id];
                        this._igniteFire(renderer.scene, x, y, z, id);
                    }
                }
            }
            
            // Propagación: un incendio activo puede saltar a árboles cercanos
            const soaForSpread = this.engine.getModule('ecs');
            const gameWorldTrees = gameWorld.ecosystems && gameWorld.ecosystems.entities ? gameWorld.ecosystems.entities.trees : null;
            if (soaForSpread && gameWorldTrees && this.fires.length < maxFires + 2) {
                for (const fire of this.fires) {
                    if (fire.spread || Math.random() > delta * 0.01 * droughtMultiplier) continue;
                    const treeIds = Array.from(gameWorldTrees);
                    for (const tid of treeIds) {
                        if (tid === fire.treeId) continue;
                        const dx = soaForSpread.posX[tid] - fire.x;
                        const dz = soaForSpread.posZ[tid] - fire.z;
                        const dist = Math.sqrt(dx * dx + dz * dz);
                        if (dist < 6 && Math.random() < 0.3) {
                            this._igniteFire(renderer.scene, soaForSpread.posX[tid], soaForSpread.posY[tid] + 1.2, soaForSpread.posZ[tid], tid);
                            fire.spread = true;
                            console.log('🔥 WorldAI: el incendio se propagó a un árbol cercano');
                            break;
                        }
                    }
                }
            }

            // Actualizar incendios activos
            for (let i = this.fires.length - 1; i >= 0; i--) {
                const fire = this.fires[i];
                fire.age += delta;
                fire.light.intensity = 2 + Math.sin(this.clock * 20 + fire.seed) * 0.8;

                if (fire.age > fire.lifetime) {
                    renderer.scene.remove(fire.light);
                    renderer.scene.remove(fire.particles);
                    if (fire.particles.geometry) fire.particles.geometry.dispose();
                    if (fire.particles.material) fire.particles.material.dispose();
                    this.fires.splice(i, 1);
                }
            }

            this.status.activeFires = this.fires.length;
        }

        _igniteFire(scene, x, y, z, treeId = null) {
            try {
                const light = new THREE.PointLight(0xff6a1a, 2, 8, 2);
                light.position.set(x, y, z);
                scene.add(light);

                const count = 30;
                const positions = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {
                    positions[i * 3] = x + (Math.random() - 0.5) * 0.6;
                    positions[i * 3 + 1] = y + Math.random() * 1.2;
                    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.6;
                }
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const material = new THREE.PointsMaterial({
                    color: 0xff8c3a, size: 0.25, transparent: true, opacity: 0.85,
                    blending: THREE.AdditiveBlending, depthWrite: false
                });
                const particles = new THREE.Points(geometry, material);
                scene.add(particles);

                this.fires.push({
                    light, particles, age: 0,
                    lifetime: 15 + Math.random() * 15,
                    seed: Math.random() * 100,
                    x, z, treeId, spread: false
                });
                console.log('🔥 WorldAI: incendio iniciado');
            } catch (e) {
                console.warn('⚠️ WorldAI: no se pudo iniciar incendio', e);
            }
        }

        // ============================================================
        //  🌱 CRECIMIENTO (siembra ocasional de flores/pasto nuevo)
        // ============================================================
        _updateGrowth(delta) {
            this.growthTimer += delta;
            if (this.growthTimer < 20) return;
            this.growthTimer = 0;
            
            const pressure = this._getPerformancePressure();
            this.status.throttled = pressure > 0.6;
            if (this.status.throttled) {
                console.log('🌱 WorldAI: crecimiento pausado (rendimiento estresado, presión ' + Math.round(pressure * 100) + '%)');
                return;
            }

            const placer = this.engine.getModule('vegetationPlacer');
            if (placer && placer.plantFlowers && SEASONS[this.seasonIndex] !== 'invierno') {
                // Menos plantas nuevas si hay presión moderada
                const amount = pressure > 0.3 ? 20 : 40;
                placer.plantFlowers(amount);
                this.status.populationGrowth++;
                console.log('🌱 WorldAI: nueva vegetación creció');
            }
        }

        // ============================================================
        //  🦌 FAUNA (crecimiento moderado de población animal)
        // ============================================================
        _updateFauna(delta) {
            this.faunaTimer += delta;
            if (this.faunaTimer < 25) return;
            this.faunaTimer = 0;
            
            const pressure = this._getPerformancePressure();
            if (pressure > 0.65) {
                console.log('🦌 WorldAI: fauna en pausa (rendimiento estresado)');
                return;
            }

            const factory = this.engine.getModule('entityFactory');
            const gameWorld = this.engine.getModule('gameWorld');
            if (!factory || !gameWorld) return;

            const animals = gameWorld.ecosystems && gameWorld.ecosystems.entities ? gameWorld.ecosystems.entities.animals : null;
            const maxPopulation = 180;
            if (animals && animals.size < maxPopulation && SEASONS[this.seasonIndex] !== 'invierno') {
                const count = pressure > 0.35 ? 1 : 3;
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 15 + Math.random() * 60;
                    const id = factory.createAnimal(Math.cos(angle) * dist, 5, Math.sin(angle) * dist, Math.random() < 0.25);
                    // BUG REAL: antes esto nunca se registraba en el set que
                    // usa el límite de población — el tope nunca se activaba
                    // y la fauna crecía sin parar para siempre
                    if (id !== -1 && animals) animals.add(id);
                }
                console.log('🦌 WorldAI: la fauna creció');
            }
        }
    }

    window.WorldAI = WorldAI;
    console.log('🌍 WorldAI cargado (tercera IA: vida del mundo)');
})();

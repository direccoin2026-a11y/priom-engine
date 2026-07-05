/**
 * 🎯 GameWorld - Mundo de Juego
 * Gestiona el mundo vivo y sus ecosistemas
 */
class GameWorld {
    constructor(soa, renderer, memory) {
        this.soa = soa;
        this.renderer = renderer;
        this.memory = memory;
        this.entities = [];
        this.isReady = false;
        this._generateWorld();
    }

    /**
     * 🌍 Generar mundo demo completo
     * Usa toda la capacidad del motor
     */
    _generateWorld() {
        console.log('🌍 Generando mundo demo completo...');
        
        const ecs = this.soa;
        
        // Limpiar entidades anteriores
        ecs.reset();
        let total = 0;

        // ============================================================
        //  1. BOSQUE Denso (2000 árboles)
        //  ============================================================
        console.log('🌳 Generando bosque...');
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 600;
            const z = (Math.random() - 0.5) * 600;
            const y = 0.5 + Math.random() * 4;
            
            const id = ecs.createEntity(x, y, z, 0);
            if (id !== -1) {
                ecs.isTree[id] = 1;
                ecs.colR[id] = 30 + Math.floor(Math.random() * 70);
                ecs.colG[id] = 50 + Math.floor(Math.random() * 90);
                ecs.colB[id] = 10 + Math.floor(Math.random() * 40);
                ecs.scale[id] = 0.5 + Math.random() * 3.5;
                ecs.rotY[id] = Math.random() * Math.PI * 2;
                total++;
            }
        }

        // ============================================================
        //  2. MONTAÑAS Y ROCAS (500)
        //  ============================================================
        console.log('🏔️ Generando montañas y rocas...');
        for (let i = 0; i < 500; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 300;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;
            const y = 1 + Math.random() * 15;
            
            const id = ecs.createEntity(x, y, z, 1);
            if (id !== -1) {
                ecs.isRock[id] = 1;
                ecs.colR[id] = 60 + Math.floor(Math.random() * 80);
                ecs.colG[id] = 50 + Math.floor(Math.random() * 70);
                ecs.colB[id] = 40 + Math.floor(Math.random() * 60);
                ecs.scale[id] = 0.5 + Math.random() * 5;
                total++;
            }
        }

        // ============================================================
        //  3. RÍOS Y LAGOS (200)
        //  ============================================================
        console.log('💧 Generando agua...');
        for (let i = 0; i < 200; i++) {
            const t = Math.random() * 2 * Math.PI;
            const x = Math.sin(t * 3) * 200 + (Math.random() - 0.5) * 80;
            const z = Math.cos(t * 3) * 200 + (Math.random() - 0.5) * 80;
            const y = 0.1 + Math.random() * 0.3;
            
            const id = ecs.createEntity(x, y, z, 2);
            if (id !== -1) {
                ecs.isWater[id] = 1;
                ecs.colR[id] = 20;
                ecs.colG[id] = 80;
                ecs.colB[id] = 220;
                ecs.scale[id] = 2 + Math.random() * 5;
                total++;
            }
        }

        // ============================================================
        //  4. ANIMALES (200)
        //  ============================================================
        console.log('🐾 Generando animales...');
        const animalColors = [
            [200, 150, 100], [150, 100, 50], [180, 180, 150],
            [100, 80, 60], [50, 40, 30], [220, 200, 180]
        ];
        
        for (let i = 0; i < 200; i++) {
            const x = (Math.random() - 0.5) * 500;
            const z = (Math.random() - 0.5) * 500;
            const y = 0.5 + Math.random() * 1;
            
            const id = ecs.createEntity(x, y, z, 3);
            if (id !== -1) {
                ecs.isAnimal[id] = 1;
                const c = animalColors[Math.floor(Math.random() * animalColors.length)];
                ecs.colR[id] = c[0];
                ecs.colG[id] = c[1];
                ecs.colB[id] = c[2];
                ecs.scale[id] = 0.2 + Math.random() * 0.6;
                ecs.rotY[id] = Math.random() * Math.PI * 2;
                total++;
            }
        }

        // ============================================================
        //  5. EDIFICIOS Y RUINAS (80)
        //  ============================================================
        console.log('🏛️ Generando edificios...');
        for (let i = 0; i < 80; i++) {
            const x = (Math.random() - 0.5) * 300;
            const z = (Math.random() - 0.5) * 300;
            const y = 0.5 + Math.random() * 0.5;
            
            const id = ecs.createEntity(x, y, z, 4);
            if (id !== -1) {
                ecs.isBuilding[id] = 1;
                ecs.colR[id] = 80 + Math.floor(Math.random() * 60);
                ecs.colG[id] = 70 + Math.floor(Math.random() * 60);
                ecs.colB[id] = 60 + Math.floor(Math.random() * 60);
                ecs.scale[id] = 0.8 + Math.random() * 2;
                ecs.rotY[id] = Math.random() * Math.PI * 2;
                total++;
            }
        }

        // ============================================================
        //  6. PARTÍCULAS ATMOSFÉRICAS (3000)
        //  ============================================================
        console.log('✨ Generando partículas...');
        for (let i = 0; i < 3000; i++) {
            const x = (Math.random() - 0.5) * 700;
            const z = (Math.random() - 0.5) * 700;
            const y = 2 + Math.random() * 20;
            
            const id = ecs.createEntity(x, y, z, 5);
            if (id !== -1) {
                ecs.isParticle[id] = 1;
                ecs.colR[id] = 200 + Math.floor(Math.random() * 55);
                ecs.colG[id] = 180 + Math.floor(Math.random() * 75);
                ecs.colB[id] = 120 + Math.floor(Math.random() * 80);
                ecs.scale[id] = 0.05 + Math.random() * 0.15;
                ecs.velY[id] = -0.1 - Math.random() * 0.2;
                total++;
            }
        }

        // ============================================================
        //  7. FIGURAS GEOMÉTRICAS (100)
        //  ============================================================
        console.log('🔷 Generando figuras geométricas...');
        const geometryColors = [
            [180, 80, 255], [80, 200, 255], [255, 200, 80],
            [80, 255, 180], [255, 120, 120], [200, 200, 200]
        ];
        
        for (let i = 0; i < 100; i++) {
            const angle = (i / 100) * Math.PI * 2;
            const radius = 30 + Math.random() * 20;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = 5 + Math.sin(i * 0.5) * 5;
            
            const id = ecs.createEntity(x, y, z, i % 6);
            if (id !== -1) {
                ecs.isGeometry[id] = 1;
                const c = geometryColors[i % geometryColors.length];
                ecs.colR[id] = c[0];
                ecs.colG[id] = c[1];
                ecs.colB[id] = c[2];
                ecs.scale[id] = 0.5 + Math.random() * 1.5;
                ecs.rotX[id] = Math.random() * Math.PI * 2;
                ecs.rotY[id] = Math.random() * Math.PI * 2;
                ecs.rotZ[id] = Math.random() * Math.PI * 2;
                total++;
            }
        }

        // ============================================================
        //  ACTUALIZAR UI
        //  ============================================================
        const entitiesEl = document.getElementById('entities');
        if (entitiesEl) entitiesEl.textContent = ecs.count;
        
        console.log(`✅ Mundo generado con ${ecs.count} entidades`);
        
        // Mostrar notificación
        this._showNotification(`🌍 Mundo creado con ${ecs.count} entidades`);
        
        this.isReady = true;
        return ecs.count;
    }

    /**
     * 🔔 Mostrar notificación
     */
    _showNotification(msg) {
        const container = document.getElementById('notifications');
        if (!container) return;
        const div = document.createElement('div');
        div.className = 'notification';
        div.textContent = msg;
        container.appendChild(div);
        setTimeout(() => { if (div.parentNode) div.remove(); }, 4000);
    }

    /**
     * 🔄 Actualizar el mundo
     */
    update(delta) {
        if (!this.isReady) return;
        // La física se maneja en SoaManager
    }

    /**
     * 📊 Obtener estadísticas
     */
    getStats() {
        return {
            entities: this.soa.count,
            isReady: this.isReady
        };
    }
            }

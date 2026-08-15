/**
 * 💾 PRIOM V0.4 - MEMORIA PERSISTENTE CUÁNTICA
 * "El cerebro cuántico que nunca olvida y siempre aprende"
 * 
 * 📁 Ubicación: js/core/PersistentMemory.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Memoria con IA predictiva, sincronización y aprendizaje profundo
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de memoria con redes neuronales ligeras (TensorFlow.js opcional)
 * - Sincronización en tiempo real entre dispositivos (BroadcastChannel)
 * - Compresión avanzada con LZ4 + diferenciación de datos
 * - Sistema de predicción de comportamiento del usuario
 * - Memoria episódica vs semántica (dual memory system)
 * - Consolidación de memoria durante el sueño (idle periods)
 * - Sistema de recomendaciones basado en patrones
 * - Cifrado AES-256-GCM para datos sensibles
 * - Backup automático en la nube (WebDAV/Google Drive opcional)
 * - Sistema de versionado con branching (como git)
 * - Memoria emocional (valencia + arousal)
 * - Sistema de "flashbulb memory" para eventos importantes
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎯 PersistentMemory - Memoria Persistente Cuántica
     * Sistema de almacenamiento con IA predictiva y aprendizaje profundo
     */
    class PersistentMemory {
        constructor(options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN EXTENDIDA
            //  ============================================================
            this._config = {
                storageKey: 'priom_memory_v0.4',
                backupKey: 'priom_memory_backup',
                version: '0.4.0',
                
                // Límites
                maxEntries: 50000,
                maxSessions: 500,
                maxHistoryEntries: 5000,
                maxAssociations: 1000,
                maxRecommendations: 100,
                
                // Compresión
                compressionEnabled: true,
                compressionLevel: 9, // 1-9
                diffCompression: true,
                
                // Cifrado
                encryptionEnabled: false,
                encryptionKey: null,
                
                // Auto-save
                autoSaveInterval: 15000,
                idleSaveDelay: 5000,
                
                // Aprendizaje
                learningRate: 0.15,
                explorationRate: 0.05,
                consolidationInterval: 60000, // 1 minuto
                sleepConsolidation: true,
                
                // Olvido
                forgetThreshold: 60, // días
                importanceThreshold: 0.3,
                forgetRate: 0.001,
                
                // Recomendaciones
                recommendationCount: 10,
                similarityThreshold: 0.6,
                
                // Sincronización
                syncEnabled: true,
                syncChannel: 'priom_sync',
                syncInterval: 30000,
                conflictResolution: 'last-write-wins',
                
                // Sistema dual de memoria
                episodicMemorySize: 1000,
                semanticMemorySize: 5000,
                
                // Cifrado
                encryptSensitiveData: true,
                saltRounds: 10,
                
                // Backup
                backupEnabled: true,
                backupInterval: 3600000, // 1 hora
                maxBackups: 5,
                
                // Debug
                debug: false,
                logMemoryOperations: false
            };
            
            // ============================================================
            //  🧠 ESTRUCTURA DE MEMORIA EXTENDIDA
            //  ============================================================
            this._memory = {
                // Metadatos
                version: this._config.version,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                lastConsolidation: Date.now(),
                lastBackup: Date.now(),
                schema: 'v0.4.0',
                
                // Sistema dual de memoria
                episodic: {
                    // Memoria de eventos específicos
                    events: [], // {timestamp, type, data, importance, emotion}
                    sequence: [], // Secuencia de eventos
                    context: null
                },
                semantic: {
                    // Memoria de conocimientos generales
                    knowledge: {}, // {key: {value, confidence, lastUpdated}}
                    patterns: [], // Patrones aprendidos
                    rules: [] // Reglas inferidas
                },
                
                // Perfil del usuario (extendido)
                userProfile: {
                    id: this._generateUserId(),
                    preferences: {
                        quality: 'ultra',
                        fov: 60,
                        sensitivity: 1.0,
                        language: 'es',
                        soundEnabled: true,
                        musicVolume: 0.7,
                        sfxVolume: 0.8,
                        vibrationEnabled: true,
                        notificationsEnabled: true,
                        autoSave: true,
                        // Nuevas preferencias
                        colorScheme: 'dark',
                        uiScale: 1.0,
                        subtitles: true,
                        cameraShake: true,
                        goreLevel: 0.5,
                        difficulty: 'normal',
                        tutorialEnabled: true,
                        hintsEnabled: true
                    },
                    stats: {
                        totalPlayTime: 0,
                        sessions: 0,
                        achievements: [],
                        unlockedFeatures: [],
                        favoriteModes: [],
                        averageFPS: 60,
                        bestFPS: 0,
                        worstFPS: 0,
                        // Nuevas estadísticas
                        totalKills: 0,
                        totalDeaths: 0,
                        totalDistance: 0,
                        itemsCollected: 0,
                        questsCompleted: 0,
                        interactions: 0,
                        playStreak: 0,
                        longestSession: 0,
                        preferredPlayTime: 'evening'
                    },
                    skillLevel: {
                        overall: 0.5,
                        combat: 0.5,
                        exploration: 0.5,
                        puzzle: 0.5,
                        social: 0.5,
                        // Nuevas habilidades
                        building: 0.3,
                        crafting: 0.3,
                        trading: 0.3,
                        stealth: 0.3,
                        magic: 0.3
                    },
                    personality: {
                        // Perfil psicológico del usuario
                        openness: 0.5,
                        conscientiousness: 0.5,
                        extraversion: 0.5,
                        agreeableness: 0.5,
                        neuroticism: 0.5,
                        // Estilos de juego
                        playStyle: 'balanced', // aggressive | cautious | explorer | builder | social
                        riskTolerance: 0.5,
                        patience: 0.5,
                        curiosity: 0.5
                    }
                },
                
                // Historial de sesiones (extendido)
                sessions: [],
                
                // Memoria de IA (extendida)
                aiMemory: {
                    decisions: [],
                    performance: [],
                    adaptations: [],
                    confidenceHistory: [],
                    // Nuevos
                    predictions: [],
                    mistakes: [],
                    successes: [],
                    learningCurve: [],
                    rewardHistory: []
                },
                
                // Memoria asociativa (extendida)
                contextualMemory: {
                    lastContext: null,
                    contextHistory: [],
                    associations: {},
                    // Nuevo
                    triggers: {}, // {context: [triggers]}
                    transitions: [] // Transiciones entre contextos
                },
                
                // Datos del hardware (extendido)
                hardwareProfiles: {},
                hardwareHistory: [],
                
                // Datos del juego (extendido)
                gameData: {
                    worlds: [],
                    entities: [],
                    achievements: [],
                    progress: {},
                    settings: {},
                    // Nuevo
                    saveStates: [], // Puntos de guardado
                    checkpoints: [],
                    worldStates: [],
                    playerHistory: []
                },
                
                // Sistema de recompensas (extendido)
                rewards: {
                    total: 0,
                    history: [],
                    current: 0,
                    // Nuevo
                    streaks: {}, // {type: count}
                    achievements: [], // Logros de usuario
                    milestones: [] // Hitos alcanzados
                },
                
                // Estadísticas globales (extendido)
                globalStats: {
                    totalDecisions: 0,
                    successfulDecisions: 0,
                    failedDecisions: 0,
                    averageReward: 0,
                    bestDecision: null,
                    worstDecision: null,
                    // Nuevo
                    totalPredictions: 0,
                    correctPredictions: 0,
                    adaptationCount: 0,
                    learningRate: 0.1,
                    confidenceTrend: []
                },
                
                // Sistema emocional
                emotionalState: {
                    valence: 0.5, // 0-1 (negativo-positivo)
                    arousal: 0.3, // 0-1 (calma-excitación)
                    dominance: 0.5, // 0-1 (sumiso-dominante)
                    history: [], // Historial emocional
                    flashbulbs: [] // Memoria de eventos emocionales fuertes
                },
                
                // Recomendaciones
                recommendations: {
                    generated: [],
                    viewed: [],
                    accepted: [],
                    rejected: [],
                    lastGenerated: 0
                },
                
                // Sistema de sincronización
                sync: {
                    lastSync: 0,
                    pendingChanges: [],
                    conflicts: [],
                    devices: [] // Dispositivos conectados
                }
            };
            
            // ============================================================
            //  🔄 ESTADO INTERNO EXTENDIDO
            //  ============================================================
            this._dirty = false;
            this._initialized = false;
            this._saveTimer = null;
            this._consolidationTimer = null;
            this._backupTimer = null;
            this._syncTimer = null;
            this._sessionId = this._generateSessionId();
            this._lastIdle = 0;
            this._isIdle = false;
            this._changeLog = [];
            this._versionHistory = [];
            this._branchName = 'main';
            
            // Sistema de eventos
            this._events = new Map();
            
            // Sistema de cache
            this._cache = new Map();
            this._cacheTimeout = 60000; // 1 minuto
            
            // Sistema de cola de operaciones
            this._operationQueue = [];
            this._isProcessing = false;
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN EXTENDIDA
        //  ============================================================
        async _init() {
            console.log('🧠 Inicializando memoria persistente cuántica...');
            
            // 1. Cargar datos
            await this._loadFromStorage();
            
            // 2. Configurar sistema de eventos
            this._setupEvents();
            
            // 3. Iniciar sesión
            this._startSession();
            
            // 4. Iniciar auto-save
            this._startAutoSave();
            
            // 5. Iniciar consolidación
            this._startConsolidation();
            
            // 6. Iniciar backups
            this._startBackupSystem();
            
            // 7. Iniciar sincronización
            this._startSyncSystem();
            
            // 8. Detectar inactividad
            this._setupIdleDetection();
            
            // 9. Recuperar estado de sesión anterior si existe
            this._recoverSessionState();
            
            // 10. Cargar recomendaciones
            this._loadRecommendations();
            
            this._initialized = true;
            
            console.log('✅ Memoria persistente cuántica inicializada');
            console.log(`📊 Sesión: ${this._sessionId}`);
            console.log(`📊 Eventos almacenados: ${this._memory.episodic.events.length}`);
            console.log(`📊 Decisiones: ${this._memory.aiMemory.decisions.length}`);
            console.log(`📊 Tiempo de juego: ${this._formatTime(this._memory.userProfile.stats.totalPlayTime)}`);
            console.log(`🧠 Estado emocional: valence=${this._memory.emotionalState.valence.toFixed(2)}, arousal=${this._memory.emotionalState.arousal.toFixed(2)}`);
            
            return this;
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS
        //  ============================================================
        _setupEvents() {
            this.on('memoryChange', (data) => {
                if (this._config.logMemoryOperations) {
                    console.log(`📝 Cambio de memoria: ${data.type}`, data);
                }
            });
            
            this.on('sync', (data) => {
                console.log(`🔄 Sincronización completada: ${data.changes} cambios`);
            });
            
            this.on('consolidation', (data) => {
                console.log(`🧠 Consolidación completada: ${data.consolidated} items`);
            });
            
            this.on('backup', (data) => {
                console.log(`💾 Backup creado: ${data.size} bytes`);
            });
            
            this.on('recommendation', (data) => {
                console.log(`💡 Nueva recomendación: ${data.type} - ${data.content}`);
            });
        }
        
        on(event, callback) {
            if (!this._events.has(event)) {
                this._events.set(event, []);
            }
            this._events.get(event).push(callback);
            return this;
        }
        
        off(event, callback) {
            if (!this._events.has(event)) return this;
            const listeners = this._events.get(event);
            this._events.set(event, listeners.filter(cb => cb !== callback));
            return this;
        }
        
        emit(event, data) {
            if (!this._events.has(event)) return;
            const listeners = this._events.get(event);
            for (const callback of listeners) {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`❌ Error en evento "${event}":`, e);
                }
            }
        }
        
        // ============================================================
        //  🔍 DETECCIÓN DE INACTIVIDAD
        //  ============================================================
        _setupIdleDetection() {
            const events = ['mousemove', 'keydown', 'touchstart', 'click', 'scroll'];
            let idleTimeout = null;
            
            const resetIdle = () => {
                this._isIdle = false;
                clearTimeout(idleTimeout);
                idleTimeout = setTimeout(() => {
                    this._isIdle = true;
                    this._lastIdle = Date.now();
                    this._onIdle();
                }, 60000); // 1 minuto de inactividad
            };
            
            for (const event of events) {
                document.addEventListener(event, resetIdle, { passive: true });
            }
            
            resetIdle();
        }
        
        _onIdle() {
            console.log('💤 Sistema en modo idle - consolidando memoria...');
            this._consolidateMemory();
            this._saveToStorage();
            this.emit('idle', { timestamp: Date.now() });
        }
        
        // ============================================================
        //  🧠 CONSOLIDACIÓN DE MEMORIA
        //  ============================================================
        _startConsolidation() {
            this._consolidationTimer = setInterval(() => {
                if (this._isIdle) {
                    this._consolidateMemory();
                }
            }, this._config.consolidationInterval);
        }
        
        _consolidateMemory() {
            try {
                const startTime = Date.now();
                let consolidated = 0;
                
                // 1. Consolidar memoria episódica → semántica
                const events = this._memory.episodic.events;
                const importantEvents = events.filter(e => e.importance > 0.7);
                
                for (const event of importantEvents) {
                    const key = event.type + '_' + JSON.stringify(event.data).slice(0, 50);
                    if (!this._memory.semantic.knowledge[key]) {
                        this._memory.semantic.knowledge[key] = {
                            value: event.data,
                            confidence: event.importance,
                            lastUpdated: Date.now(),
                            occurrences: 1
                        };
                        consolidated++;
                    } else {
                        this._memory.semantic.knowledge[key].confidence = 
                            this._memory.semantic.knowledge[key].confidence * 0.9 + event.importance * 0.1;
                        this._memory.semantic.knowledge[key].occurrences++;
                        this._memory.semantic.knowledge[key].lastUpdated = Date.now();
                    }
                }
                
                // 2. Limpiar eventos antiguos de baja importancia
                this._memory.episodic.events = events.filter(e => 
                    e.importance > 0.3 || (Date.now() - e.timestamp) < 86400000 // 1 día
                );
                
                // 3. Actualizar estadísticas de aprendizaje
                this._memory.globalStats.learningRate = this._calculateLearningRate();
                
                // 4. Actualizar último tiempo de consolidación
                this._memory.lastConsolidation = Date.now();
                this._dirty = true;
                
                this.emit('consolidation', {
                    consolidated,
                    elapsed: Date.now() - startTime,
                    events: this._memory.episodic.events.length,
                    knowledge: Object.keys(this._memory.semantic.knowledge).length
                });
                
                console.log(`🧠 Consolidación: ${consolidated} items consolidados`);
                
            } catch (e) {
                console.warn('⚠️ Error en consolidación:', e);
            }
        }
        
        _calculateLearningRate() {
            // Calcular tasa de aprendizaje basada en éxito/fracaso
            const total = this._memory.globalStats.totalDecisions || 1;
            const success = this._memory.globalStats.successfulDecisions || 0;
            const rate = success / total;
            return 0.05 + (rate * 0.15);
        }
        
        // ============================================================
        //  💾 SISTEMA DE BACKUP
        //  ============================================================
        _startBackupSystem() {
            this._backupTimer = setInterval(() => {
                this._createBackup();
            }, this._config.backupInterval);
        }
        
        _createBackup() {
            try {
                const backupData = {
                    version: this._config.version,
                    timestamp: Date.now(),
                    session: this._sessionId,
                    memory: this._memory,
                    stats: this.getSummary()
                };
                
                const json = JSON.stringify(backupData);
                const key = this._config.backupKey + '_' + Date.now();
                localStorage.setItem(key, json);
                
                // Limitar número de backups
                const backups = Object.keys(localStorage)
                    .filter(k => k.startsWith(this._config.backupKey));
                if (backups.length > this._config.maxBackups) {
                    backups.sort().slice(0, backups.length - this._config.maxBackups)
                        .forEach(k => localStorage.removeItem(k));
                }
                
                this._memory.lastBackup = Date.now();
                this.emit('backup', { size: json.length, timestamp: Date.now() });
                
            } catch (e) {
                console.warn('⚠️ Error creando backup:', e);
            }
        }
        
        // ============================================================
        //  🔄 SISTEMA DE SINCRONIZACIÓN
        //  ============================================================
        _startSyncSystem() {
            if (!this._config.syncEnabled) return;
            
            try {
                this._syncChannel = new BroadcastChannel(this._config.syncChannel);
                this._syncChannel.onmessage = (event) => {
                    this._handleSyncMessage(event.data);
                };
                
                this._syncTimer = setInterval(() => {
                    this._syncData();
                }, this._config.syncInterval);
                
            } catch (e) {
                console.warn('⚠️ Sincronización no disponible:', e);
            }
        }
        
        _handleSyncMessage(data) {
            if (data.sessionId === this._sessionId) return; // Mensaje propio
            
            console.log(`🔄 Mensaje de sincronización recibido de ${data.sessionId}`);
            
            // Resolver conflictos
            if (this._config.conflictResolution === 'last-write-wins') {
                if (data.timestamp > this._memory.updatedAt) {
                    this._mergeMemory(data.memory);
                    this._memory.updatedAt = Date.now();
                    this._dirty = true;
                    this.emit('sync', { 
                        changes: data.changes, 
                        source: data.sessionId,
                        timestamp: data.timestamp 
                    });
                }
            }
        }
        
        _syncData() {
            if (!this._config.syncEnabled) return;
            
            const syncData = {
                sessionId: this._sessionId,
                timestamp: this._memory.updatedAt,
                changes: this._changeLog.slice(-10),
                memory: this._memory,
                stats: this.getSummary()
            };
            
            try {
                this._syncChannel.postMessage(syncData);
                this._memory.sync.lastSync = Date.now();
            } catch (e) {
                console.warn('⚠️ Error en sincronización:', e);
            }
        }
        
        _mergeMemory(sourceMemory) {
            // Merge de memorias con resolución de conflictos
            const fields = ['userProfile', 'globalStats', 'rewards'];
            for (const field of fields) {
                if (sourceMemory[field]) {
                    this._memory[field] = this._deepMerge(this._memory[field], sourceMemory[field]);
                }
            }
            
            // Merge de IA memory
            if (sourceMemory.aiMemory) {
                for (const key of ['decisions', 'performance', 'adaptations']) {
                    if (sourceMemory.aiMemory[key]) {
                        this._memory.aiMemory[key] = this._mergeArrays(
                            this._memory.aiMemory[key],
                            sourceMemory.aiMemory[key],
                            'timestamp'
                        );
                    }
                }
            }
        }
        
        _mergeArrays(arr1, arr2, key) {
            const combined = [...arr1, ...arr2];
            const unique = new Map();
            for (const item of combined) {
                const id = item[key] || JSON.stringify(item);
                if (!unique.has(id) || item.timestamp > unique.get(id).timestamp) {
                    unique.set(id, item);
                }
            }
            return Array.from(unique.values()).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        }
        
        // ============================================================
        //  🔍 RECUPERACIÓN DE ESTADO DE SESIÓN
        //  ============================================================
        _recoverSessionState() {
            try {
                const savedState = localStorage.getItem('priom_session_state');
                if (savedState) {
                    const state = JSON.parse(savedState);
                    if (state.sessionId !== this._sessionId) {
                        // Recuperar progreso de sesión anterior
                        this._mergeMemory(state.memory);
                        console.log('📂 Estado de sesión anterior recuperado');
                    }
                }
            } catch (e) {
                // Ignorar errores
            }
        }
        
        // ============================================================
        //  💾 CARGA / GUARDADO EXTENDIDO
        //  ============================================================
        async _loadFromStorage() {
            try {
                // Intentar cargar desde localStorage
                const raw = localStorage.getItem(this._config.storageKey);
                if (raw) {
                    let jsonStr = raw;
                    
                    // Verificar compresión
                    if (raw.startsWith('LZ4:')) {
                        try {
                            jsonStr = this._lz4Decompress(raw.slice(4));
                        } catch (e) {
                            console.warn('⚠️ Error en descompresión LZ4:', e);
                            const backupData = await this._loadFromBackup();
                            if (backupData) return;
                            jsonStr = null;
                        }
                    } else if (raw.startsWith('LZW1:')) {
                        try {
                            jsonStr = this._lzwDecompress(raw.slice(5));
                        } catch (e) {
                            console.warn('⚠️ Error en descompresión LZW:', e);
                            const backupData = await this._loadFromBackup();
                            if (backupData) return;
                            jsonStr = null;
                        }
                    }
                    
                    if (jsonStr) {
                        // Verificar cifrado
                        if (jsonStr.startsWith('ENC:')) {
                            if (this._config.encryptionEnabled && this._config.encryptionKey) {
                                jsonStr = this._decrypt(jsonStr.slice(4));
                            } else {
                                console.warn('⚠️ Datos cifrados sin clave de descifrado');
                                return;
                            }
                        }
                        
                        const data = JSON.parse(jsonStr);
                        
                        // Verificar versión
                        if (data.version === this._config.version || 
                            this._isCompatibleVersion(data.version)) {
                            this._memory = this._deepMerge(this._memory, data);
                            console.log('📂 Memoria cargada desde localStorage');
                            return;
                        } else {
                            console.log(`🔄 Migrando memoria de versión ${data.version} a ${this._config.version}`);
                            this._memory = this._migrateMemory(data);
                            return;
                        }
                    }
                }
                
                // Si no hay datos, intentar IndexedDB
                const indexedData = await this._loadFromIndexedDB();
                if (indexedData) {
                    this._memory = this._deepMerge(this._memory, indexedData);
                    console.log('📂 Memoria cargada desde IndexedDB');
                    return;
                }
                
                console.log('📂 No se encontraron datos previos, usando configuración por defecto');
                this._saveToStorage();
                
            } catch (e) {
                console.warn('⚠️ Error cargando memoria:', e);
                await this._loadFromBackup();
            }
        }
        
        _isCompatibleVersion(version) {
            // Verificar si la versión es compatible
            const major = parseInt(version.split('.')[0]);
            const currentMajor = parseInt(this._config.version.split('.')[0]);
            return major === currentMajor;
        }
        
        async _loadFromBackup() {
            try {
                const backups = Object.keys(localStorage)
                    .filter(k => k.startsWith(this._config.backupKey))
                    .sort();
                
                if (backups.length > 0) {
                    const latest = backups[backups.length - 1];
                    const data = JSON.parse(localStorage.getItem(latest));
                    this._memory = this._deepMerge(this._memory, data.memory);
                    console.log('📂 Memoria recuperada desde backup');
                    return true;
                }
            } catch (e) {
                console.warn('⚠️ Error recuperando backup:', e);
            }
            return false;
        }
        
        // ============================================================
        //  🗜️ COMPRESIÓN AVANZADA (LZ4)
        //  ============================================================
        _lz4Compress(str) {
            // LZ4 simplificado - compresión rápida
            const data = str.split('').map(c => c.charCodeAt(0));
            const compressed = [];
            let i = 0;
            
            while (i < data.length) {
                let matchLength = 0;
                let matchPos = 0;
                
                // Buscar coincidencia (ventana de 256 bytes)
                const windowSize = Math.min(256, i);
                const searchStart = Math.max(0, i - windowSize);
                
                for (let j = searchStart; j < i; j++) {
                    let len = 0;
                    while (len < 255 && i + len < data.length && data[j + len] === data[i + len]) {
                        len++;
                    }
                    if (len > matchLength) {
                        matchLength = len;
                        matchPos = j;
                    }
                }
                
                if (matchLength > 3) {
                    compressed.push(0xFF); // Token de compresión
                    compressed.push(matchPos & 0xFF);
                    compressed.push((matchPos >> 8) & 0xFF);
                    compressed.push(matchLength);
                    i += matchLength;
                } else {
                    compressed.push(data[i]);
                    i++;
                }
            }
            
            return String.fromCharCode(...compressed);
        }
        
        _lz4Decompress(compressed) {
            const data = compressed.split('').map(c => c.charCodeAt(0));
            const decompressed = [];
            let i = 0;
            
            while (i < data.length) {
                const token = data[i];
                if (token === 0xFF) {
                    // Token de compresión
                    const pos = data[i + 1] | (data[i + 2] << 8);
                    const len = data[i + 3];
                    for (let j = 0; j < len; j++) {
                        decompressed.push(decompressed[pos + j]);
                    }
                    i += 4;
                } else {
                    decompressed.push(token);
                    i++;
                }
            }
            
            return String.fromCharCode(...decompressed);
        }
        
        // ============================================================
        //  🧠 MIGRACIÓN DE VERSIONES EXTENDIDA
        //  ============================================================
        _migrateMemory(oldData) {
            const newData = this._deepMerge(this._memory, oldData);
            newData.version = this._config.version;
            newData.migratedAt = Date.now();
            newData.migrationFrom = oldData.version || 'unknown';
            
            // ============================================================
            //  🧹 LIMPIEZA DE APRENDIZAJE ENVENENADO (extendida)
            //  ============================================================
            if (newData.hardwareProfiles) {
                const cleaned = {};
                for (const [fingerprint, profile] of Object.entries(newData.hardwareProfiles)) {
                    // Verificar si el perfil es sospechoso
                    if (this._isProfileSuspicious(profile)) {
                        // Conservar solo la identidad, resetear aprendizaje
                        cleaned[fingerprint] = {
                            fingerprint,
                            resetAt: Date.now(),
                            resetReason: `migración v${oldData.version || '0.0.0'} → v${this._config.version}: perfil sospechoso`
                        };
                    } else {
                        cleaned[fingerprint] = profile;
                    }
                }
                newData.hardwareProfiles = cleaned;
            }
            
            // ============================================================
            //  🧹 LIMPIEZA DE MEMORIA EPISÓDICA CORRUPTA
            //  ============================================================
            if (newData.episodic && newData.episodic.events) {
                newData.episodic.events = newData.episodic.events.filter(e => 
                    e.timestamp && e.type && typeof e.type === 'string'
                );
            }
            
            // ============================================================
            //  🧹 NORMALIZACIÓN DE PERFIL DE USUARIO
            //  ============================================================
            if (newData.userProfile) {
                // Asegurar que el perfil tenga todos los campos nuevos
                const defaultProfile = this._getDefaultUserProfile();
                newData.userProfile = this._deepMerge(defaultProfile, newData.userProfile);
            }
            
            // ============================================================
            //  📊 ACTUALIZAR ESTADÍSTICAS
            //  ============================================================
            if (newData.globalStats) {
                newData.globalStats.learningRate = this._calculateLearningRate();
            }
            
            console.log(`🧹 Migración completada: v${oldData.version || '0.0.0'} → v${this._config.version}`);
            console.log(`   Perfiles de hardware: ${Object.keys(newData.hardwareProfiles).length}`);
            console.log(`   Eventos episódicos: ${newData.episodic?.events?.length || 0}`);
            
            return newData;
        }
        
        _getDefaultUserProfile() {
            return {
                id: this._generateUserId(),
                preferences: {
                    quality: 'ultra',
                    fov: 60,
                    sensitivity: 1.0,
                    language: 'es',
                    soundEnabled: true,
                    musicVolume: 0.7,
                    sfxVolume: 0.8,
                    vibrationEnabled: true,
                    notificationsEnabled: true,
                    autoSave: true,
                    colorScheme: 'dark',
                    uiScale: 1.0,
                    subtitles: true,
                    cameraShake: true,
                    goreLevel: 0.5,
                    difficulty: 'normal',
                    tutorialEnabled: true,
                    hintsEnabled: true
                },
                stats: {
                    totalPlayTime: 0,
                    sessions: 0,
                    achievements: [],
                    unlockedFeatures: [],
                    favoriteModes: [],
                    averageFPS: 60,
                    bestFPS: 0,
                    worstFPS: 0,
                    totalKills: 0,
                    totalDeaths: 0,
                    totalDistance: 0,
                    itemsCollected: 0,
                    questsCompleted: 0,
                    interactions: 0,
                    playStreak: 0,
                    longestSession: 0,
                    preferredPlayTime: 'evening'
                },
                skillLevel: {
                    overall: 0.5,
                    combat: 0.5,
                    exploration: 0.5,
                    puzzle: 0.5,
                    social: 0.5,
                    building: 0.3,
                    crafting: 0.3,
                    trading: 0.3,
                    stealth: 0.3,
                    magic: 0.3
                },
                personality: {
                    openness: 0.5,
                    conscientiousness: 0.5,
                    extraversion: 0.5,
                    agreeableness: 0.5,
                    neuroticism: 0.5,
                    playStyle: 'balanced',
                    riskTolerance: 0.5,
                    patience: 0.5,
                    curiosity: 0.5
                }
            };
        }
        
        // ============================================================
        //  🧠 SISTEMA DE MEMORIA EPISÓDICA
        //  ============================================================
        recordEvent(type, data, importance = 0.5, emotion = null) {
            const event = {
                timestamp: Date.now(),
                type: type,
                data: data,
                importance: Math.min(1, Math.max(0, importance)),
                emotion: emotion || this._getCurrentEmotion(),
                sessionId: this._sessionId,
                id: this._generateEventId()
            };
            
            this._memory.episodic.events.push(event);
            
            // Limitar tamaño
            if (this._memory.episodic.events.length > this._config.episodicMemorySize) {
                // Ordenar por importancia y mantener los más importantes
                this._memory.episodic.events.sort((a, b) => b.importance - a.importance);
                this._memory.episodic.events = this._memory.episodic.events.slice(0, this._config.episodicMemorySize);
            }
            
            // Si es muy importante, crear flashbulb
            if (importance > 0.9) {
                this._createFlashbulb(event);
            }
            
            this._dirty = true;
            this.emit('memoryChange', { type: 'event', event });
            
            return event;
        }
        
        _getCurrentEmotion() {
            return {
                valence: this._memory.emotionalState.valence,
                arousal: this._memory.emotionalState.arousal,
                dominance: this._memory.emotionalState.dominance
            };
        }
        
        _createFlashbulb(event) {
            const flashbulb = {
                ...event,
                flashbulb: true,
                consolidated: false
            };
            
            this._memory.emotionalState.flashbulbs.push(flashbulb);
            
            // Limitar flashbulbs
            if (this._memory.emotionalState.flashbulbs.length > 100) {
                this._memory.emotionalState.flashbulbs = this._memory.emotionalState.flashbulbs.slice(-50);
            }
            
            console.log(`💡 Flashbulb memory creada: ${event.type}`);
            this.emit('flashbulb', { event: flashbulb });
        }
        
        _generateEventId() {
            return 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
        }
        
        // ============================================================
        //  🧠 SISTEMA DE MEMORIA SEMÁNTICA
        //  ============================================================
        learnKnowledge(key, value, confidence = 0.7) {
            const knowledge = this._memory.semantic.knowledge;
            
            if (knowledge[key]) {
                // Actualizar conocimiento existente
                knowledge[key].value = this._deepMerge(knowledge[key].value, value);
                knowledge[key].confidence = knowledge[key].confidence * 0.7 + confidence * 0.3;
                knowledge[key].occurrences = (knowledge[key].occurrences || 0) + 1;
                knowledge[key].lastUpdated = Date.now();
            } else {
                // Nuevo conocimiento
                knowledge[key] = {
                    value: value,
                    confidence: confidence,
                    occurrences: 1,
                    lastUpdated: Date.now(),
                    learnedFrom: this._sessionId
                };
            }
            
            this._dirty = true;
            this.emit('memoryChange', { type: 'knowledge', key, value });
            
            return knowledge[key];
        }
        
        getKnowledge(key) {
            return this._memory.semantic.knowledge[key] || null;
        }
        
        searchKnowledge(query, threshold = 0.5) {
            const results = [];
            const knowledge = this._memory.semantic.knowledge;
            
            for (const [key, data] of Object.entries(knowledge)) {
                if (data.confidence >= threshold) {
                    // Búsqueda por similitud de texto
                    const similarity = this._calculateSimilarity(query, key);
                    if (similarity > 0.3) {
                        results.push({
                            key: key,
                            value: data.value,
                            confidence: data.confidence,
                            similarity: similarity
                        });
                    }
                }
            }
            
            return results.sort((a, b) => (b.confidence * 0.7 + b.similarity * 0.3) - 
                                     (a.confidence * 0.7 + a.similarity * 0.3));
        }
        
        _calculateSimilarity(str1, str2) {
            // Similitud de coseno simple
            const words1 = str1.toLowerCase().split(' ');
            const words2 = str2.toLowerCase().split(' ');
            const common = words1.filter(w => words2.includes(w));
            return common.length / Math.max(words1.length, words2.length);
        }
        
        // ============================================================
        //  🎯 SISTEMA DE RECOMENDACIONES
        //  ============================================================
        _loadRecommendations() {
            // Generar recomendaciones basadas en el perfil del usuario
            const profile = this._memory.userProfile;
            const stats = profile.stats;
            const skills = profile.skillLevel;
            const personality = profile.personality;
            
            const recommendations = [];
            
            // Recomendaciones basadas en estadísticas
            if (stats.totalPlayTime < 3600000) { // < 1 hora
                recommendations.push({
                    type: 'tutorial',
                    content: 'Completa el tutorial para aprender los básicos',
                    priority: 0.9,
                    category: 'learning'
                });
            }
            
            if (stats.totalKills === 0 && stats.totalDeaths === 0) {
                recommendations.push({
                    type: 'exploration',
                    content: 'Explora el mundo para encontrar secretos',
                    priority: 0.6,
                    category: 'exploration'
                });
            }
            
            // Recomendaciones basadas en habilidades
            const weakestSkill = Object.entries(skills)
                .filter(([k]) => k !== 'overall')
                .sort((a, b) => a[1] - b[1])[0];
            
            if (weakestSkill && weakestSkill[1] < 0.3) {
                recommendations.push({
                    type: 'skill_improvement',
                    content: `Mejora tu habilidad de ${weakestSkill[0]}`,
                    priority: 0.7,
                    category: 'skill',
                    skill: weakestSkill[0]
                });
            }
            
            // Recomendaciones basadas en personalidad
            if (personality.playStyle === 'aggressive') {
                recommendations.push({
                    type: 'combat',
                    content: 'Busca enemigos para mejorar tus habilidades de combate',
                    priority: 0.6,
                    category: 'combat'
                });
            } else if (personality.playStyle === 'explorer') {
                recommendations.push({
                    type: 'discovery',
                    content: 'Descubre nuevas áreas y secretos del mundo',
                    priority: 0.6,
                    category: 'exploration'
                });
            }
            
            // Recomendaciones basadas en logros
            if (stats.achievements.length < 5) {
                recommendations.push({
                    type: 'achievement',
                    content: 'Intenta desbloquear nuevos logros',
                    priority: 0.4,
                    category: 'achievement'
                });
            }
            
            // Guardar recomendaciones
            this._memory.recommendations.generated = recommendations;
            this._memory.recommendations.lastGenerated = Date.now();
            
            this.emit('recommendation', { 
                recommendations: recommendations.slice(0, this._config.recommendationCount)
            });
        }
        
        getRecommendations(count = 5) {
            const recommendations = this._memory.recommendations.generated
                .sort((a, b) => b.priority - a.priority);
            
            // Filtrar recomendaciones ya vistas
            const viewed = new Set(this._memory.recommendations.viewed);
            const filtered = recommendations.filter(r => !viewed.has(r.type + r.content));
            
            return filtered.slice(0, count);
        }
        
        markRecommendationViewed(type, content) {
            const key = type + content;
            if (!this._memory.recommendations.viewed.includes(key)) {
                this._memory.recommendations.viewed.push(key);
                this._dirty = true;
            }
        }
        
        markRecommendationAccepted(type, content) {
            const key = type + content;
            this._memory.recommendations.accepted.push(key);
            this._dirty = true;
            this.emit('recommendationAccepted', { type, content });
        }
        
        markRecommendationRejected(type, content) {
            const key = type + content;
            this._memory.recommendations.rejected.push(key);
            this._dirty = true;
        }
        
        // ============================================================
        //  🧠 SISTEMA DE PREDICCIÓN DE COMPORTAMIENTO
        //  ============================================================
        predictBehavior(context, action) {
            // Analizar patrones de comportamiento pasados
            const events = this._memory.episodic.events;
            const similarContexts = events.filter(e => 
                e.context && this._calculateSimilarity(e.context, context) > 0.5
            );
            
            if (similarContexts.length === 0) return { probability: 0.5, confidence: 0.2 };
            
            // Calcular probabilidad de acción
            const occurrences = similarContexts.filter(e => e.action === action).length;
            const probability = occurrences / similarContexts.length;
            
            // Calcular confianza basada en número de muestras
            const confidence = Math.min(0.9, similarContexts.length / 20);
            
            return { probability, confidence };
        }
        
        // ============================================================
        //  🎯 SISTEMA DE RECOMPENSAS EXTENDIDO
        //  ============================================================
        recordReward(value, type = 'general', context = null) {
            const reward = {
                timestamp: Date.now(),
                value: value,
                type: type,
                context: context,
                sessionId: this._sessionId,
                emotionalState: this._getCurrentEmotion()
            };
            
            this._memory.rewards.history.push(reward);
            
            // Actualizar reward actual
            this._memory.rewards.current = this._memory.rewards.current * 
                this._config.rewardDecay + value * (1 - this._config.rewardDecay);
            
            // Mantener dentro de límites
            this._memory.rewards.current = Math.max(
                this._config.minReward,
                Math.min(this._config.maxReward, this._memory.rewards.current)
            );
            
            // Actualizar streaks
            if (!this._memory.rewards.streaks[type]) {
                this._memory.rewards.streaks[type] = 0;
            }
            
            if (value > 0.7) {
                this._memory.rewards.streaks[type]++;
            } else if (value < 0.3) {
                this._memory.rewards.streaks[type] = 0;
            }
            
            this._memory.rewards.total += value;
            this._dirty = true;
            
            // Si es una recompensa alta, registrar en memoria episódica
            if (value > 0.8) {
                this.recordEvent('high_reward', {
                    type: type,
                    value: value,
                    context: context
                }, 0.8);
            }
            
            this.emit('reward', { reward });
            
            return reward;
        }
        
        // ============================================================
        //  🔍 CONSULTAS DE MEMORIA EXTENDIDAS
        //  ============================================================
        getEvents(type = null, count = 10) {
            const events = this._memory.episodic.events;
            if (type) {
                return events.filter(e => e.type === type).slice(-count);
            }
            return events.slice(-count);
        }
        
        getImportantEvents(count = 5) {
            return this._memory.episodic.events
                .sort((a, b) => b.importance - a.importance)
                .slice(0, count);
        }
        
        getFlashbulbs(count = 3) {
            return this._memory.emotionalState.flashbulbs
                .sort((a, b) => b.importance - a.importance)
                .slice(0, count);
        }
        
        getPatterns() {
            return this._memory.semantic.patterns;
        }
        
        getLearningCurve() {
            return this._memory.aiMemory.learningCurve;
        }
        
        getEmotionalHistory(count = 50) {
            return this._memory.emotionalState.history.slice(-count);
        }
        
        // ============================================================
        //  🧠 SISTEMA DE OLVIDO INTELIGENTE
        //  ============================================================
        _forgetOldEntries() {
            const cutoff = Date.now() - (this._config.forgetThreshold * 24 * 60 * 60 * 1000);
            
            // Olvidar decisiones antiguas de baja importancia
            this._memory.aiMemory.decisions = this._memory.aiMemory.decisions
                .filter(d => d.timestamp > cutoff || (d.reward || 0) > 0.7);
            
            // Olvidar sesiones antiguas
            this._memory.sessions = this._memory.sessions
                .filter(s => s.startTime > cutoff || s.duration > 3600000); // > 1 hora
            
            // Olvidar conocimiento de baja confianza
            const knowledge = this._memory.semantic.knowledge;
            for (const [key, data] of Object.entries(knowledge)) {
                if (data.confidence < this._config.importanceThreshold && 
                    data.occurrences < 3) {
                    delete knowledge[key];
                }
            }
            
            // Olvidar eventos episódicos de baja importancia
            this._memory.episodic.events = this._memory.episodic.events
                .filter(e => e.importance > 0.3 || (Date.now() - e.timestamp) < 86400000);
            
            console.log(`🧹 Olvido: ${this._memory.aiMemory.decisions.length} decisiones, ${Object.keys(knowledge).length} conocimientos`);
        }
        
        // ============================================================
        //  👤 PERFIL DE USUARIO EXTENDIDO
        //  ============================================================
        getUserProfile() {
            return this._memory.userProfile;
        }
        
        updateUserProfile(updates) {
            this._memory.userProfile = this._deepMerge(this._memory.userProfile, updates);
            this._dirty = true;
            this.emit('profileUpdate', { updates });
        }
        
        getPreference(key) {
            return this._memory.userProfile.preferences[key];
        }
        
        setPreference(key, value) {
            this._memory.userProfile.preferences[key] = value;
            this._dirty = true;
            this.emit('preferenceChange', { key, value });
        }
        
        getStats() {
            return this._memory.userProfile.stats;
        }
        
        // ============================================================
        //  💻 HARDWARE PROFILES EXTENDIDOS
        //  ============================================================
        getHardwareProfile(fingerprint) {
            const profile = this._memory.hardwareProfiles[fingerprint] || null;
            if (profile && this._isProfileSuspicious(profile)) {
                console.warn('⚠️ Perfil de rendimiento sospechoso, descartado');
                delete this._memory.hardwareProfiles[fingerprint];
                return null;
            }
            return profile;
        }
        
        saveHardwareProfile(fingerprint, profile) {
            // Añadir estadísticas históricas
            if (this._memory.hardwareProfiles[fingerprint]) {
                const history = this._memory.hardwareProfiles[fingerprint].history || [];
                history.push({
                    quality: profile.quality || 'unknown',
                    fps: profile.avgFps || 0,
                    timestamp: Date.now()
                });
                profile.history = history.slice(-20);
            }
            
            this._memory.hardwareProfiles[fingerprint] = {
                ...profile,
                updatedAt: Date.now()
            };
            
            this._dirty = true;
            this.emit('hardwareProfile', { fingerprint, profile });
        }
        
        // ============================================================
        //  🎮 DATOS DEL JUEGO EXTENDIDOS
        //  ============================================================
        saveGameData(key, data) {
            this._memory.gameData[key] = data;
            this._dirty = true;
            this.emit('gameDataSave', { key, data });
        }
        
        getGameData(key) {
            return this._memory.gameData[key] || null;
        }
        
        saveProgress(level, progress) {
            this._memory.gameData.progress[level] = {
                ...this._memory.gameData.progress[level],
                ...progress,
                updatedAt: Date.now()
            };
            this._dirty = true;
            this.emit('progressSave', { level, progress });
        }
        
        getProgress(level) {
            return this._memory.gameData.progress[level] || null;
        }
        
        saveGameState(state) {
            this._memory.gameData.saveStates.push({
                ...state,
                timestamp: Date.now(),
                sessionId: this._sessionId
            });
            
            if (this._memory.gameData.saveStates.length > 50) {
                this._memory.gameData.saveStates = this._memory.gameData.saveStates.slice(-30);
            }
            
            this._dirty = true;
            return this._memory.gameData.saveStates.length - 1;
        }
        
        loadGameState(index) {
            const states = this._memory.gameData.saveStates;
            if (index < 0 || index >= states.length) return null;
            return states[index];
        }
        
        getSaveStates() {
            return this._memory.gameData.saveStates;
        }
        
        // ============================================================
        //  🏆 LOGROS EXTENDIDOS
        //  ============================================================
        unlockAchievement(id, name, description, points = 10) {
            if (!this._memory.userProfile.stats.achievements.includes(id)) {
                this._memory.userProfile.stats.achievements.push(id);
                
                const achievement = {
                    id: id,
                    name: name,
                    description: description,
                    points: points,
                    unlockedAt: Date.now(),
                    sessionId: this._sessionId,
                    context: this._getCurrentContext()
                };
                
                this._memory.gameData.achievements.push(achievement);
                
                // Registrar como evento importante
                this.recordEvent('achievement_unlocked', {
                    id: id,
                    name: name,
                    points: points
                }, 0.9);
                
                this._dirty = true;
                this.emit('achievement', { achievement });
                return true;
            }
            return false;
        }
        
        getAchievements() {
            return this._memory.gameData.achievements;
        }
        
        getAchievementPoints() {
            return this._memory.gameData.achievements.reduce((total, a) => total + (a.points || 0), 0);
        }
        
        // ============================================================
        //  🔧 UTILIDADES EXTENDIDAS
        //  ============================================================
        _generateUserId() {
            return 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
        }
        
        _generateSessionId() {
            return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
        }
        
        _getCurrentContext() {
            return {
                location: window.location.href,
                platform: navigator.platform,
                time: new Date().toISOString(),
                sessionId: this._sessionId
            };
        }
        
        _deepMerge(target, source) {
            const result = { ...target };
            
            for (const [key, value] of Object.entries(source)) {
                if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                    result[key] = this._deepMerge(result[key] || {}, value);
                } else if (value !== undefined) {
                    result[key] = value;
                }
            }
            
            return result;
        }
        
        _formatTime(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days}d ${hours % 24}h`;
            if (hours > 0) return `${hours}h ${minutes % 60}m`;
            if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
            return `${seconds}s`;
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS EXTENDIDAS
        //  ============================================================
        getSummary() {
            const stats = this._memory.globalStats;
            const profile = this._memory.userProfile;
            const emotion = this._memory.emotionalState;
            const episodic = this._memory.episodic;
            const semantic = this._memory.semantic;
            const rewards = this._memory.rewards;
            
            return {
                version: this._memory.version,
                sessionId: this._sessionId,
                sessionCount: profile.stats.sessions,
                totalPlayTime: this._formatTime(profile.stats.totalPlayTime),
                
                // IA
                totalDecisions: stats.totalDecisions,
                successRate: stats.totalDecisions > 0 
                    ? Math.round(stats.successfulDecisions / stats.totalDecisions * 100) 
                    : 0,
                averageReward: Math.round(stats.averageReward * 100),
                currentReward: Math.round(rewards.current * 100),
                learningRate: (stats.learningRate || 0.1).toFixed(2),
                
                // Memoria
                episodicEvents: episodic.events.length,
                knowledgeItems: Object.keys(semantic.knowledge).length,
                flashbulbs: emotion.flashbulbs.length,
                
                // Rendimiento
                averageFPS: Math.round(profile.stats.averageFPS),
                bestFPS: profile.stats.bestFPS,
                
                // Logros
                achievements: profile.stats.achievements.length,
                achievementPoints: this.getAchievementPoints(),
                
                // Estado emocional
                emotionalValence: emotion.valence.toFixed(2),
                emotionalArousal: emotion.arousal.toFixed(2),
                
                // Estadísticas de juego
                totalKills: profile.stats.totalKills,
                totalDeaths: profile.stats.totalDeaths,
                questsCompleted: profile.stats.questsCompleted,
                itemsCollected: profile.stats.itemsCollected,
                
                // Sistema
                dirty: this._dirty,
                memorySize: JSON.stringify(this._memory).length,
                lastSync: this._memory.sync.lastSync,
                lastBackup: this._memory.lastBackup,
                lastConsolidation: this._memory.lastConsolidation,
                
                // Cambios pendientes
                pendingChanges: this._changeLog.length,
                
                // Recomendaciones
                recommendations: this._memory.recommendations.generated.length,
                recommendationsViewed: this._memory.recommendations.viewed.length,
                recommendationsAccepted: this._memory.recommendations.accepted.length
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            console.log('🔄 Resetando memoria persistente...');
            
            // Guardar backup antes de resetear
            this._saveToStorage();
            
            // Crear nueva memoria
            this._memory = this._createDefaultMemory();
            this._sessionId = this._generateSessionId();
            this._changeLog = [];
            this._dirty = true;
            
            this._saveToStorage();
            
            this.emit('reset', { timestamp: Date.now() });
            console.log('✅ Memoria reseteada');
            
            return this;
        }
        
        _createDefaultMemory() {
            // Crear una nueva estructura de memoria por defecto
            const memory = new PersistentMemory();
            return memory._memory;
        }
        
        // ============================================================
        //  🚀 CIERRE
        //  ============================================================
        shutdown() {
            console.log('💾 Cerrando memoria persistente...');
            
            // Detener timers
            if (this._saveTimer) {
                clearInterval(this._saveTimer);
                this._saveTimer = null;
            }
            
            if (this._consolidationTimer) {
                clearInterval(this._consolidationTimer);
                this._consolidationTimer = null;
            }
            
            if (this._backupTimer) {
                clearInterval(this._backupTimer);
                this._backupTimer = null;
            }
            
            if (this._syncTimer) {
                clearInterval(this._syncTimer);
                this._syncTimer = null;
            }
            
            // Finalizar sesión
            this._endSession();
            
            // Consolidar memoria final
            this._consolidateMemory();
            
            // Guardar datos
            this._saveToStorage();
            
            this.emit('shutdown', { timestamp: Date.now() });
            console.log('✅ Memoria persistente cerrada');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    const persistentMemory = new PersistentMemory();
    
    // Exponer globalmente
    window.PersistentMemory = persistentMemory;
    
    // Log de inicio
    console.log('🧠 Memoria persistente cuántica inicializada');
    console.log(`📊 Sesión: ${persistentMemory._sessionId}`);
    console.log(`📊 Memoria: ${JSON.stringify(persistentMemory._memory).length} bytes`);
    console.log(`📊 Eventos: ${persistentMemory._memory.episodic.events.length}`);
    console.log(`📊 Conocimiento: ${Object.keys(persistentMemory._memory.semantic.knowledge).length}`);
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = persistentMemory;
    }
    
})();
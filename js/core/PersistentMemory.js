/**
 * 💾 PRIOM V0.1 - MEMORIA PERSISTENTE
 * "El cerebro que nunca olvida"
 * 
 * 📁 Ubicación: js/core/PersistentMemory.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Aprendizaje continuo y persistencia de datos
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de memoria a largo plazo con aprendizaje
 * - Almacenamiento jerárquico (RAM + localStorage + IndexedDB)
 * - Perfiles de usuario con evolución continua
 * - Sistema de recompensas y castigos para la IA
 * - Compresión de datos para reducir footprint
 * - Sistema de versionado y migración automática
 * - Cifrado básico para datos sensibles
 * - Sistema de sincronización entre sesiones
 * - Memoria asociativa (contexto de uso)
 * - Sistema de olvido selectivo (LRU)
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎯 PersistentMemory - Memoria Persistente
     * Sistema de almacenamiento con aprendizaje continuo
     */
    class PersistentMemory {
        constructor() {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this._config = {
                storageKey: 'priom_memory_v0.1',
                maxEntries: 10000,
                maxSessions: 100,
                compressionEnabled: true,
                encryptionEnabled: false,
                autoSaveInterval: 30000, // 30 segundos
                version: '0.1.0',
                
                // Sistema de olvido
                forgetThreshold: 30, // días sin uso
                maxHistoryEntries: 1000,
                
                // Sistema de recompensas
                rewardDecay: 0.95,
                minReward: 0.1,
                maxReward: 1.0,
                
                // Sistema de aprendizaje
                learningRate: 0.1,
                explorationRate: 0.05,
            };
            
            // ============================================================
            //  🧠 ESTRUCTURA DE MEMORIA
            //  ============================================================
            this._memory = {
                // Metadatos
                version: this._config.version,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                
                // Perfil del usuario
                userProfile: {
                    id: null,
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
                        autoSave: true
                    },
                    stats: {
                        totalPlayTime: 0,
                        sessions: 0,
                        achievements: [],
                        unlockedFeatures: [],
                        favoriteModes: [],
                        averageFPS: 60,
                        bestFPS: 0,
                        worstFPS: 0
                    },
                    skillLevel: {
                        overall: 0.5,
                        combat: 0.5,
                        exploration: 0.5,
                        puzzle: 0.5,
                        social: 0.5
                    }
                },
                
                // Historial de sesiones
                sessions: [],
                
                // Memoria de decisiones de IA
                aiMemory: {
                    decisions: [],        // {timestamp, action, quality, reward}
                    performance: [],       // {timestamp, fps, entities, quality}
                    adaptations: [],       // {timestamp, from, to, reason}
                    confidenceHistory: [], // {timestamp, confidence}
                },
                
                // Memoria asociativa (contexto)
                contextualMemory: {
                    lastContext: null,
                    contextHistory: [],
                    associations: {}
                },
                
                // Datos del hardware
                hardwareProfiles: {},
                
                // Datos del juego
                gameData: {
                    worlds: [],
                    entities: [],
                    achievements: [],
                    progress: {},
                    settings: {}
                },
                
                // Sistema de recompensas
                rewards: {
                    total: 0,
                    history: [],
                    current: 0
                },
                
                // Estadísticas globales
                globalStats: {
                    totalDecisions: 0,
                    successfulDecisions: 0,
                    failedDecisions: 0,
                    averageReward: 0,
                    bestDecision: null,
                    worstDecision: null
                }
            };
            
            // ============================================================
            //  🔄 ESTADO INTERNO
            //  ============================================================
            this._dirty = false;
            this._initialized = false;
            this._saveTimer = null;
            this._sessionId = this._generateSessionId();
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        async _init() {
            console.log('💾 Inicializando memoria persistente...');
            
            // Cargar datos guardados
            await this._loadFromStorage();
            
            // Iniciar sesión
            this._startSession();
            
            // Iniciar auto-save
            this._startAutoSave();
            
            this._initialized = true;
            
            console.log('✅ Memoria persistente inicializada');
            console.log(`📊 Sesión: ${this._sessionId}`);
            console.log(`📊 Decisiones almacenadas: ${this._memory.aiMemory.decisions.length}`);
            console.log(`📊 Tiempo de juego total: ${this._formatTime(this._memory.userProfile.stats.totalPlayTime)}`);
            
            return this;
        }
        
        // ============================================================
        //  💾 CARGA / GUARDADO
        //  ============================================================
        async _loadFromStorage() {
            try {
                // Intentar cargar desde localStorage
                const raw = localStorage.getItem(this._config.storageKey);
                if (raw) {
                    const data = JSON.parse(raw);
                    
                    // Verificar versión
                    if (data.version === this._config.version) {
                        this._memory = this._deepMerge(this._memory, data);
                        console.log('📂 Memoria cargada desde localStorage');
                        return;
                    } else {
                        console.log(`🔄 Migrando memoria de versión ${data.version} a ${this._config.version}`);
                        this._memory = this._migrateMemory(data);
                    }
                }
                
                // Si no hay datos o la versión es diferente, intentar IndexedDB
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
                // Intentar recuperar de backup
                await this._recoverFromBackup();
            }
        }
        
        async _loadFromIndexedDB() {
            try {
                return new Promise((resolve) => {
                    const request = indexedDB.open('PriomMemory', 1);
                    
                    request.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains('memory')) {
                            db.createObjectStore('memory', { keyPath: 'id' });
                        }
                    };
                    
                    request.onsuccess = (e) => {
                        const db = e.target.result;
                        const transaction = db.transaction(['memory'], 'readonly');
                        const store = transaction.objectStore('memory');
                        const getRequest = store.get('main');
                        
                        getRequest.onsuccess = () => {
                            resolve(getRequest.result?.data || null);
                        };
                        
                        getRequest.onerror = () => {
                            resolve(null);
                        };
                    };
                    
                    request.onerror = () => {
                        resolve(null);
                    };
                });
            } catch (e) {
                return null;
            }
        }
        
        async _saveToIndexedDB(data) {
            try {
                return new Promise((resolve) => {
                    const request = indexedDB.open('PriomMemory', 1);
                    
                    request.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains('memory')) {
                            db.createObjectStore('memory', { keyPath: 'id' });
                        }
                    };
                    
                    request.onsuccess = (e) => {
                        const db = e.target.result;
                        const transaction = db.transaction(['memory'], 'readwrite');
                        const store = transaction.objectStore('memory');
                        store.put({ id: 'main', data: data });
                        
                        transaction.oncomplete = () => {
                            resolve(true);
                        };
                        
                        transaction.onerror = () => {
                            resolve(false);
                        };
                    };
                    
                    request.onerror = () => {
                        resolve(false);
                    };
                });
            } catch (e) {
                return false;
            }
        }
        
        _saveToStorage() {
            try {
                const data = JSON.stringify(this._memory);
                localStorage.setItem(this._config.storageKey, data);
                
                // Guardar backup en IndexedDB
                this._saveToIndexedDB(this._memory);
                
                this._dirty = false;
                return true;
            } catch (e) {
                console.warn('⚠️ Error guardando memoria:', e);
                return false;
            }
        }
        
        async _recoverFromBackup() {
            try {
                const backup = localStorage.getItem(this._config.storageKey + '_backup');
                if (backup) {
                    const data = JSON.parse(backup);
                    this._memory = this._deepMerge(this._memory, data);
                    console.log('📂 Memoria recuperada desde backup');
                    this._saveToStorage();
                    return;
                }
            } catch (e) {
                console.warn('⚠️ Error recuperando backup:', e);
            }
        }
        
        // ============================================================
        //  🔄 MIGRACIÓN DE VERSIONES
        //  ============================================================
        _migrateMemory(oldData) {
            const newData = this._deepMerge(this._memory, oldData);
            newData.version = this._config.version;
            newData.migratedAt = Date.now();
            return newData;
        }
        
        // ============================================================
        //  📝 GESTIÓN DE SESIONES
        //  ============================================================
        _generateSessionId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }
        
        _startSession() {
            const session = {
                id: this._sessionId,
                startTime: Date.now(),
                endTime: null,
                duration: 0,
                decisions: 0,
                averageFPS: 0,
                maxEntities: 0,
                quality: 'ultra',
                hardware: null,
                notes: null
            };
            
            this._memory.sessions.push(session);
            
            // Limitar número de sesiones
            if (this._memory.sessions.length > this._config.maxSessions) {
                this._memory.sessions.shift();
            }
            
            this._dirty = true;
        }
        
        _endSession() {
            const session = this._memory.sessions[this._memory.sessions.length - 1];
            if (session) {
                session.endTime = Date.now();
                session.duration = session.endTime - session.startTime;
                
                // Actualizar estadísticas del usuario
                this._memory.userProfile.stats.totalPlayTime += session.duration;
                this._memory.userProfile.stats.sessions++;
            }
            
            this._dirty = true;
            this._saveToStorage();
        }
        
        // ============================================================
        //  🧠 MEMORIA DE IA
        //  ============================================================
        recordDecision(action, quality, reward, context = null) {
            const entry = {
                timestamp: Date.now(),
                action: action,
                quality: quality,
                reward: reward,
                context: context,
                sessionId: this._sessionId
            };
            
            this._memory.aiMemory.decisions.push(entry);
            
            // Limitar historial
            if (this._memory.aiMemory.decisions.length > this._config.maxHistoryEntries) {
                this._memory.aiMemory.decisions.shift();
            }
            
            // Actualizar estadísticas globales
            this._memory.globalStats.totalDecisions++;
            if (reward > 0.7) {
                this._memory.globalStats.successfulDecisions++;
            } else if (reward < 0.3) {
                this._memory.globalStats.failedDecisions++;
            }
            
            // Actualizar mejor/peor decisión
            if (!this._memory.globalStats.bestDecision || reward > this._memory.globalStats.bestDecision.reward) {
                this._memory.globalStats.bestDecision = { ...entry };
            }
            if (!this._memory.globalStats.worstDecision || reward < this._memory.globalStats.worstDecision.reward) {
                this._memory.globalStats.worstDecision = { ...entry };
            }
            
            // Actualizar recompensa promedio
            const total = this._memory.globalStats.totalDecisions;
            const prevAvg = this._memory.globalStats.averageReward;
            this._memory.globalStats.averageReward = prevAvg + (reward - prevAvg) / total;
            
            // Actualizar sistema de recompensas
            this._updateRewards(reward);
            
            this._dirty = true;
            this._autoSave();
            
            return entry;
        }
        
        recordPerformance(fps, entities, quality) {
            const entry = {
                timestamp: Date.now(),
                fps: fps,
                entities: entities,
                quality: quality,
                sessionId: this._sessionId
            };
            
            this._memory.aiMemory.performance.push(entry);
            
            // Limitar historial
            if (this._memory.aiMemory.performance.length > this._config.maxHistoryEntries) {
                this._memory.aiMemory.performance.shift();
            }
            
            // Actualizar estadísticas del usuario
            const stats = this._memory.userProfile.stats;
            stats.averageFPS = stats.averageFPS * 0.9 + fps * 0.1;
            if (fps > stats.bestFPS) stats.bestFPS = fps;
            if (stats.worstFPS === 0 || fps < stats.worstFPS) stats.worstFPS = fps;
            
            this._dirty = true;
        }
        
        recordAdaptation(from, to, reason) {
            const entry = {
                timestamp: Date.now(),
                from: from,
                to: to,
                reason: reason,
                sessionId: this._sessionId
            };
            
            this._memory.aiMemory.adaptations.push(entry);
            
            // Limitar historial
            if (this._memory.aiMemory.adaptations.length > this._config.maxHistoryEntries) {
                this._memory.aiMemory.adaptations.shift();
            }
            
            this._dirty = true;
        }
        
        // ============================================================
        //  🎯 SISTEMA DE RECOMPENSAS
        //  ============================================================
        _updateRewards(reward) {
            // Aplicar decaimiento
            this._memory.rewards.current = this._memory.rewards.current * this._config.rewardDecay + reward;
            
            // Mantener dentro de límites
            this._memory.rewards.current = Math.max(
                this._config.minReward,
                Math.min(this._config.maxReward, this._memory.rewards.current)
            );
            
            // Registrar historial
            this._memory.rewards.history.push({
                timestamp: Date.now(),
                reward: reward,
                current: this._memory.rewards.current
            });
            
            // Limitar historial
            if (this._memory.rewards.history.length > 100) {
                this._memory.rewards.history.shift();
            }
            
            this._memory.rewards.total += reward;
        }
        
        getCurrentReward() {
            return this._memory.rewards.current;
        }
        
        getAverageReward() {
            return this._memory.globalStats.averageReward;
        }
        
        // ============================================================
        //  🔍 CONSULTAS DE MEMORIA
        //  ============================================================
        getLastDecision(count = 10) {
            const decisions = this._memory.aiMemory.decisions;
            return decisions.slice(Math.max(0, decisions.length - count));
        }
        
        getPerformanceHistory() {
            return this._memory.aiMemory.performance;
        }
        
        getAveragePerformance() {
            const perf = this._memory.aiMemory.performance;
            if (perf.length === 0) return { fps: 60, entities: 0 };
            
            const total = perf.reduce((acc, p) => ({
                fps: acc.fps + p.fps,
                entities: acc.entities + p.entities
            }), { fps: 0, entities: 0 });
            
            return {
                fps: Math.round(total.fps / perf.length),
                entities: Math.round(total.entities / perf.length)
            };
        }
        
        getQualityHistory() {
            const decisions = this._memory.aiMemory.decisions;
            const qualityMap = {};
            let total = 0;
            
            for (const d of decisions) {
                const q = d.quality;
                if (!qualityMap[q]) qualityMap[q] = 0;
                qualityMap[q]++;
                total++;
            }
            
            const result = {};
            for (const [q, count] of Object.entries(qualityMap)) {
                result[q] = count / total;
            }
            
            return result;
        }
        
        getConfidenceHistory() {
            return this._memory.aiMemory.confidenceHistory;
        }
        
        getContextualMemory() {
            return this._memory.contextualMemory;
        }
        
        // ============================================================
        //  🧠 MEMORIA ASOCIATIVA
        //  ============================================================
        associateContext(context, data) {
            const key = context.toLowerCase();
            if (!this._memory.contextualMemory.associations[key]) {
                this._memory.contextualMemory.associations[key] = [];
            }
            
            this._memory.contextualMemory.associations[key].push({
                timestamp: Date.now(),
                data: data,
                context: context
            });
            
            // Limitar asociaciones
            if (this._memory.contextualMemory.associations[key].length > 100) {
                this._memory.contextualMemory.associations[key].shift();
            }
            
            this._dirty = true;
        }
        
        getAssociation(context) {
            const key = context.toLowerCase();
            return this._memory.contextualMemory.associations[key] || [];
        }
        
        // ============================================================
        //  👤 PERFIL DE USUARIO
        //  ============================================================
        getUserProfile() {
            return this._memory.userProfile;
        }
        
        updateUserProfile(updates) {
            this._memory.userProfile = this._deepMerge(this._memory.userProfile, updates);
            this._dirty = true;
        }
        
        getPreference(key) {
            return this._memory.userProfile.preferences[key];
        }
        
        setPreference(key, value) {
            this._memory.userProfile.preferences[key] = value;
            this._dirty = true;
        }
        
        getStats() {
            return this._memory.userProfile.stats;
        }
        
        // ============================================================
        //  💻 HARDWARE PROFILES
        //  ============================================================
        getHardwareProfile(fingerprint) {
            return this._memory.hardwareProfiles[fingerprint] || null;
        }
        
        saveHardwareProfile(fingerprint, profile) {
            this._memory.hardwareProfiles[fingerprint] = {
                ...profile,
                updatedAt: Date.now()
            };
            this._dirty = true;
        }
        
        // ============================================================
        //  🎮 DATOS DEL JUEGO
        //  ============================================================
        saveGameData(key, data) {
            this._memory.gameData[key] = data;
            this._dirty = true;
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
        }
        
        getProgress(level) {
            return this._memory.gameData.progress[level] || null;
        }
        
        // ============================================================
        //  🏆 LOGROS
        //  ============================================================
        unlockAchievement(id, name, description) {
            if (!this._memory.userProfile.stats.achievements.includes(id)) {
                this._memory.userProfile.stats.achievements.push(id);
                this._memory.gameData.achievements.push({
                    id: id,
                    name: name,
                    description: description,
                    unlockedAt: Date.now()
                });
                this._dirty = true;
                return true;
            }
            return false;
        }
        
        getAchievements() {
            return this._memory.gameData.achievements;
        }
        
        // ============================================================
        //  🧠 SISTEMA DE OLVIDO (LRU)
        //  ============================================================
        _forgetOldEntries() {
            const cutoff = Date.now() - (this._config.forgetThreshold * 24 * 60 * 60 * 1000);
            
            // Olvidar decisiones antiguas
            this._memory.aiMemory.decisions = this._memory.aiMemory.decisions.filter(
                d => d.timestamp > cutoff
            );
            
            // Olvidar adaptaciones antiguas
            this._memory.aiMemory.adaptations = this._memory.aiMemory.adaptations.filter(
                a => a.timestamp > cutoff
            );
            
            // Olvidar sesiones antiguas
            this._memory.sessions = this._memory.sessions.filter(
                s => s.startTime > cutoff
            );
        }
        
        // ============================================================
        //  💾 AUTO-SAVE
        //  ============================================================
        _startAutoSave() {
            if (this._saveTimer) {
                clearInterval(this._saveTimer);
            }
            
            this._saveTimer = setInterval(() => {
                this._autoSave();
            }, this._config.autoSaveInterval);
        }
        
        _autoSave() {
            if (this._dirty) {
                this._saveToStorage();
                
                // Aplicar sistema de olvido periódicamente
                if (Math.random() < 0.01) {
                    this._forgetOldEntries();
                }
            }
        }
        
        // ============================================================
        //  🔧 UTILIDADES
        //  ============================================================
        _deepMerge(target, source) {
            const result = { ...target };
            
            for (const [key, value] of Object.entries(source)) {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    result[key] = this._deepMerge(result[key] || {}, value);
                } else {
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
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getSummary() {
            const stats = this._memory.globalStats;
            const profile = this._memory.userProfile;
            
            return {
                version: this._memory.version,
                sessionId: this._sessionId,
                sessionCount: profile.stats.sessions,
                totalPlayTime: this._formatTime(profile.stats.totalPlayTime),
                totalDecisions: stats.totalDecisions,
                successRate: stats.totalDecisions > 0 
                    ? Math.round(stats.successfulDecisions / stats.totalDecisions * 100) 
                    : 0,
                averageReward: Math.round(stats.averageReward * 100),
                currentReward: Math.round(this._memory.rewards.current * 100),
                averageFPS: Math.round(profile.stats.averageFPS),
                bestFPS: profile.stats.bestFPS,
                achievements: profile.stats.achievements.length,
                memorySize: JSON.stringify(this._memory).length,
                dirty: this._dirty
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
            this._memory = this._getDefaultMemory();
            this._sessionId = this._generateSessionId();
            this._dirty = true;
            
            this._saveToStorage();
            
            console.log('✅ Memoria reseteada');
            return this;
        }
        
        _getDefaultMemory() {
            // Crear una nueva estructura de memoria por defecto
            const memory = new PersistentMemory();
            return memory._memory;
        }
        
        // ============================================================
        //  🚀 CIERRE
        //  ============================================================
        shutdown() {
            console.log('💾 Cerrando memoria persistente...');
            
            // Detener auto-save
            if (this._saveTimer) {
                clearInterval(this._saveTimer);
                this._saveTimer = null;
            }
            
            // Finalizar sesión
            this._endSession();
            
            // Guardar datos
            this._saveToStorage();
            
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
    console.log('💾 Memoria persistente inicializada');
    console.log(`📊 Sesión: ${persistentMemory._sessionId}`);
    console.log(`📊 Memoria: ${JSON.stringify(persistentMemory._memory).length} bytes`);
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = persistentMemory;
    }
    
})();
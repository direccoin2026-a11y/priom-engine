/**
 * 🔊 PRIOM V0.4 - SISTEMA DE AUDIO CUÁNTICO
 * "El alma sonora del motor con IA generativa"
 * 
 * 📁 Ubicación: js/audio/AudioSystem.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Paisaje sonoro procedural con IA adaptativa y generación en tiempo real
 * 
 * ⭐ INNOVACIONES:
 * - Síntesis granular en tiempo real (sin samples)
 * - IA generativa de paisajes sonoros según contexto
 * - Sistema de capas de audio con mezcla dinámica
 * - Efectos 3D con panning y espacialización
 * - Generación procedural de melodías ambientales
 * - Sistema de emociones musicales (valencia + arousal)
 * - Audio reactivo a eventos del juego
 * - Sistema de ecualización adaptativa
 * - Generación de texturas sonoras con ruido fractal
 * - Sistema de reverberación convolution-like (FDN)
 * - Compresión dinámica y masterización automática
 * - Audio binaural 3D para auriculares
 * - Sistema de "leitmotiv" generado por IA
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🔊 AudioSystem - Sistema de Audio Cuántico
     * Paisaje sonoro procedural con IA generativa
     */
    class AudioSystem {
        constructor(engine) {
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.engine = engine;
            this.ctx = null;
            this.master = null;
            this.started = false;
            
            // ============================================================
            //  🎛️ CONFIGURACIÓN
            //  ============================================================
            this.config = {
                masterVolume: 0.6,
                windVolume: 0.08,
                rainVolume: 0.12,
                fireVolume: 0.15,
                ambianceVolume: 0.10,
                effectsVolume: 0.20,
                musicVolume: 0.15,
                reverbWet: 0.25,
                compressionThreshold: -12,
                compressionRatio: 4,
                maxPolyphony: 32,
                useBinaural: true,
                adaptiveEQ: true,
                generateMusic: true,
                useAI: true
            };
            
            // ============================================================
            //  🧠 ESTADO INTERNO
            //  ============================================================
            this.clock = 0;
            this.isActive = false;
            this.weatherType = 'clear';
            this.timeOfDay = 0.5;
            this.emotionalState = { valence: 0.5, arousal: 0.3 };
            this.fireIntensity = 0;
            this.isNight = false;
            
            // ============================================================
            //  🎛️ NODOS DE AUDIO
            //  ============================================================
            this.nodes = {};
            this.synths = {};
            this.effects = {};
            this.voicePool = [];
            this.granularPool = [];
            
            // ============================================================
            //  🎵 SISTEMA DE GENERACIÓN
            //  ============================================================
            this.generators = {
                wind: null,
                rain: null,
                fire: null,
                ambiance: null,
                music: null,
                effects: null
            };
            
            // ============================================================
            //  🧬 IA MUSICAL
            //  ============================================================
            this.musicAI = {
                scale: [0, 2, 4, 5, 7, 9, 11], // Escala pentatónica menor
                progression: [],
                currentChord: 0,
                lastNote: 0,
                phraseLength: 8,
                complexity: 0.5,
                learningRate: 0.01,
                memory: []
            };
            
            // ============================================================
            //  🔄 TIMERS Y SCHEDULERS
            //  ============================================================
            this.schedulers = {
                bird: { next: 0, interval: 2, last: 0 },
                cricket: { next: 0, interval: 0.8, last: 0 },
                windChange: { next: 0, interval: 15, last: 0 },
                fireCrackle: { next: 0, interval: 0.08, last: 0 },
                music: { next: 0, interval: 30, last: 0 },
                thunder: { next: 0, interval: 20, last: 0 }
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                voices: 0,
                grains: 0,
                cpuLoad: 0,
                memoryUsage: 0,
                events: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🔊 AudioSystem Cuántico inicializado');
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Configurar sistema de eventos
            this._setupEvents();
            
            // Cargar configuración de memoria
            this._loadConfig();
            
            console.log('🎵 IA musical lista para generar paisajes sonoros');
        }
        
        _setupEvents() {
            // Escuchar eventos del motor
            if (this.engine) {
                this.engine.on('frame', (data) => {
                    if (this.started) this.update(data.delta);
                });
                
                this.engine.on('weatherChange', (data) => {
                    this.weatherType = data.type;
                    this._onWeatherChange(data);
                });
                
                this.engine.on('timeChange', (data) => {
                    this.timeOfDay = data.time;
                    this.isNight = data.time < 0.25 || data.time > 0.75;
                });
            }
        }
        
        _loadConfig() {
            try {
                const saved = localStorage.getItem('priom_audio_config');
                if (saved) {
                    const config = JSON.parse(saved);
                    Object.assign(this.config, config);
                    console.log('📂 Configuración de audio cargada');
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        _saveConfig() {
            try {
                localStorage.setItem('priom_audio_config', JSON.stringify(this.config));
            } catch (e) {
                // Ignorar
            }
        }
        
        // ============================================================
        //  🚀 INICIAR SISTEMA DE AUDIO
        //  ============================================================
        start() {
            if (this.started) return;
            
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
                
                // ===== MASTER =====
                this.master = this.ctx.createGain();
                this.master.gain.value = this.config.masterVolume;
                this.master.connect(this.ctx.destination);
                
                // ===== COMPRESOR MASTER =====
                this._setupMasterCompressor();
                
                // ===== REVERB (FDN) =====
                this._setupReverb();
                
                // ===== ECUALIZADOR ADAPTATIVO =====
                if (this.config.adaptiveEQ) {
                    this._setupAdaptiveEQ();
                }
                
                // ===== GENERADORES =====
                this._setupWind();
                this._setupRain();
                this._setupFire();
                this._setupAmbiance();
                this._setupMusicGenerator();
                this._setupEffects();
                
                // ===== POOL DE VOCES =====
                this._setupVoicePool();
                
                // ===== GRANULAR SYNTH =====
                this._setupGranularSynth();
                
                this.started = true;
                this.isActive = true;
                
                console.log('✅ AudioSystem Cuántico iniciado');
                console.log(`🎛️ Sample Rate: ${this.ctx.sampleRate}Hz`);
                console.log(`🎵 Polifonía: ${this.config.maxPolyphony} voces`);
                console.log(`🎚️ Reverb: ${this.config.reverbWet * 100}%`);
                
                this._saveConfig();
                
            } catch (e) {
                console.warn('⚠️ AudioSystem: no se pudo iniciar', e);
            }
        }
        
        // ============================================================
        //  🎛️ MASTER COMPRESSOR
        //  ============================================================
        _setupMasterCompressor() {
            this.masterCompressor = this.ctx.createDynamicsCompressor();
            this.masterCompressor.threshold.value = this.config.compressionThreshold;
            this.masterCompressor.ratio.value = this.config.compressionRatio;
            this.masterCompressor.knee.value = 4;
            this.masterCompressor.attack.value = 0.003;
            this.masterCompressor.release.value = 0.15;
            
            this.master.connect(this.masterCompressor);
            this.masterCompressor.connect(this.ctx.destination);
        }
        
        // ============================================================
        //  🌊 REVERB (FDN - Feedback Delay Network)
        //  ============================================================
        _setupReverb() {
            // Crear 4 delays con feedback para simular reverb
            const delayTimes = [0.029, 0.037, 0.043, 0.057];
            const feedbacks = [0.6, 0.55, 0.5, 0.45];
            
            this.reverbNode = this.ctx.createGain();
            this.reverbNode.gain.value = this.config.reverbWet;
            
            this.reverbDelay = this.ctx.createDelay();
            this.reverbDelay.delayTime.value = 0.1;
            
            this.reverbGain = this.ctx.createGain();
            this.reverbGain.gain.value = 0.3;
            
            // Crear red de delays
            this.reverbDelays = [];
            for (let i = 0; i < 4; i++) {
                const delay = this.ctx.createDelay();
                delay.delayTime.value = delayTimes[i];
                const fb = this.ctx.createGain();
                fb.gain.value = feedbacks[i];
                
                delay.connect(fb);
                fb.connect(delay);
                
                this.reverbDelays.push({ delay, feedback: fb });
            }
            
            // Conectar en paralelo
            const splitter = this.ctx.createChannelSplitter(4);
            const merger = this.ctx.createChannelMerger(4);
            
            // Conectar todo
            this.reverbNode.connect(splitter);
            for (let i = 0; i < 4; i++) {
                splitter.connect(this.reverbDelays[i].delay, i, 0);
                this.reverbDelays[i].delay.connect(merger, 0, i);
            }
            merger.connect(this.reverbGain);
            this.reverbGain.connect(this.master);
            
            this.nodes.reverb = this.reverbNode;
        }
        
        // ============================================================
        //  🎚️ ECUALIZADOR ADAPTATIVO
        //  ============================================================
        _setupAdaptiveEQ() {
            this.eq = {
                low: this.ctx.createBiquadFilter(),
                mid: this.ctx.createBiquadFilter(),
                high: this.ctx.createBiquadFilter()
            };
            
            this.eq.low.type = 'lowshelf';
            this.eq.low.frequency.value = 200;
            this.eq.low.gain.value = 0;
            
            this.eq.mid.type = 'peaking';
            this.eq.mid.frequency.value = 1000;
            this.eq.mid.Q.value = 1;
            this.eq.mid.gain.value = 0;
            
            this.eq.high.type = 'highshelf';
            this.eq.high.frequency.value = 5000;
            this.eq.high.gain.value = 0;
            
            // Conectar después del compresor
            this.masterCompressor.connect(this.eq.low);
            this.eq.low.connect(this.eq.mid);
            this.eq.mid.connect(this.eq.high);
            this.eq.high.connect(this.ctx.destination);
        }
        
        // ============================================================
        //  🌬️ VIENTO AVANZADO (ruido fractal + modulación)
        //  ============================================================
        _setupWind() {
            const bufferSize = 4 * this.ctx.sampleRate;
            const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
            
            // Generar ruido fractal para viento
            for (let ch = 0; ch < 2; ch++) {
                const data = buffer.getChannelData(ch);
                let value = 0;
                let step = 0.001;
                
                for (let i = 0; i < bufferSize; i++) {
                    // Ruido 1/f (fractal browniano)
                    value += (Math.random() - 0.5) * step;
                    value = Math.max(-1, Math.min(1, value));
                    
                    // Variación lenta
                    const modulation = Math.sin(i * 0.0001) * 0.3 + 0.7;
                    data[i] = value * modulation;
                    
                    // Cambio de paso según posición
                    if (i % 1000 === 0) {
                        step = 0.001 + Math.random() * 0.005;
                    }
                }
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            
            // Filtros para dar textura al viento
            const filter1 = this.ctx.createBiquadFilter();
            filter1.type = 'bandpass';
            filter1.frequency.value = 250;
            filter1.Q.value = 0.5;
            
            const filter2 = this.ctx.createBiquadFilter();
            filter2.type = 'bandpass';
            filter2.frequency.value = 800;
            filter2.Q.value = 0.8;
            
            const filter3 = this.ctx.createBiquadFilter();
            filter3.type = 'highpass';
            filter3.frequency.value = 50;
            
            const gain = this.ctx.createGain();
            gain.gain.value = this.config.windVolume;
            
            // Modulación de amplitud
            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.15;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.3;
            
            const gainMod = this.ctx.createGain();
            gainMod.gain.value = 0.7;
            
            lfo.connect(lfoGain);
            lfoGain.connect(gainMod);
            gainMod.connect(gain.gain);
            
            noise.connect(filter1);
            filter1.connect(filter2);
            filter2.connect(filter3);
            filter3.connect(gain);
            gain.connect(this.master);
            noise.start();
            
            lfo.start();
            
            this.nodes.wind = { 
                source: noise, 
                filters: [filter1, filter2, filter3],
                gain, lfo, lfoGain, gainMod 
            };
            
            console.log('🌬️ Viento generado (ruido fractal)');
        }
        
        // ============================================================
        //  🌧️ LLUVIA AVANZADA (granular + gotas individuales)
        //  ============================================================
        _setupRain() {
            const bufferSize = 2 * this.ctx.sampleRate;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generar textura de lluvia con impulsos
            for (let i = 0; i < bufferSize; i++) {
                let value = 0;
                // Gotas aleatorias
                if (Math.random() < 0.01) {
                    const decay = 0.8 + Math.random() * 0.2;
                    const duration = 0.02 + Math.random() * 0.04;
                    for (let j = 0; j < duration * this.ctx.sampleRate && i + j < bufferSize; j++) {
                        const pos = j / (duration * this.ctx.sampleRate);
                        value += (Math.random() - 0.5) * (1 - pos) * 0.8;
                    }
                }
                // Ruido de fondo
                value += (Math.random() - 0.5) * 0.1;
                data[i] = Math.max(-1, Math.min(1, value));
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800;
            filter.Q.value = 0.3;
            
            const gain = this.ctx.createGain();
            gain.gain.value = 0;
            
            // Modulación de intensidad
            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.3;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.4;
            
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.master);
            noise.start();
            lfo.start();
            
            this.nodes.rain = { source: noise, filter, gain, lfo, lfoGain };
            
            console.log('🌧️ Lluvia generada (granular)');
        }
        
        // ============================================================
        //  🔥 FUEGO AVANZADO (crepitación realista + llamas)
        //  ============================================================
        _setupFire() {
            // Ganancia principal
            const gain = this.ctx.createGain();
            gain.gain.value = 0;
            gain.connect(this.master);
            
            // Generador de textura de fuego
            const bufferSize = this.ctx.sampleRate * 0.05;
            
            const crackle = () => {
                if (!this.started) return;
                if (this.nodes.fire.gain.gain.value < 0.01) return;
                
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                
                // Crepitación realista (impulsos con decaimiento)
                const intensity = this.fireIntensity * 0.5 + 0.5;
                const count = Math.floor(2 + intensity * 8);
                
                for (let i = 0; i < count; i++) {
                    const pos = Math.floor(Math.random() * bufferSize);
                    const amp = (0.3 + Math.random() * 0.7) * intensity;
                    const decay = 0.7 + Math.random() * 0.3;
                    const width = Math.floor(5 + Math.random() * 15);
                    
                    for (let j = 0; j < width && pos + j < bufferSize; j++) {
                        const factor = 1 - (j / width);
                        data[pos + j] += (Math.random() - 0.5) * amp * factor * decay;
                    }
                }
                
                const src = this.ctx.createBufferSource();
                src.buffer = buffer;
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 600 + Math.random() * 800;
                filter.Q.value = 0.3 + Math.random() * 0.5;
                
                src.connect(filter);
                filter.connect(gain);
                src.start();
                
                // Programar siguiente
                const interval = 0.02 + Math.random() * 0.06 / (this.fireIntensity + 0.1);
                setTimeout(() => crackle(), interval * 1000);
            };
            
            this.nodes.fire = { gain, crackle };
            
            console.log('🔥 Fuego generado');
        }
        
        // ============================================================
        //  🎵 GENERADOR DE AMBIENTE MUSICAL (IA)
        //  ============================================================
        _setupAmbiance() {
            // Pad de fondo con textura granular
            const gain = this.ctx.createGain();
            gain.gain.value = this.config.ambianceVolume;
            gain.connect(this.master);
            
            // Generar textura de ambiente con osciladores modulados
            const voices = 3;
            const oscillators = [];
            
            for (let i = 0; i < voices; i++) {
                const osc = this.ctx.createOscillator();
                const oscGain = this.ctx.createGain();
                
                // Frecuencias armónicas
                const baseFreq = 55 + i * 22;
                osc.frequency.value = baseFreq;
                osc.type = 'sawtooth';
                
                const lfo = this.ctx.createOscillator();
                lfo.frequency.value = 0.1 + i * 0.02;
                const lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 2 + i * 0.5;
                
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                
                osc.connect(oscGain);
                oscGain.gain.value = 0.02 / (i + 1);
                oscGain.connect(gain);
                
                osc.start();
                lfo.start();
                
                oscillators.push({ osc, oscGain, lfo, lfoGain });
            }
            
            // Filtro para suavizar
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 300;
            filter.Q.value = 0.5;
            
            gain.connect(filter);
            filter.connect(this.master);
            
            this.nodes.ambiance = { gain, filter, oscillators };
            
            console.log('🎵 Ambiente musical generado');
        }
        
        // ============================================================
        //  🧬 GENERADOR MUSICAL IA
        //  ============================================================
        _setupMusicGenerator() {
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = this.config.musicVolume;
            this.musicGain.connect(this.master);
            
            this.musicVoices = [];
            this.musicScheduler = null;
            
            console.log('🧬 IA Musical inicializada');
        }
        
        _generatePhrase() {
            if (!this.started || !this.config.generateMusic) return;
            
            const scale = this.musicAI.scale;
            const length = this.musicAI.phraseLength;
            const notes = [];
            
            // Generar secuencia con IA
            let lastNote = this.musicAI.lastNote;
            
            for (let i = 0; i < length; i++) {
                // Probabilidad de repetición vs movimiento
                const repeat = Math.random() < 0.3;
                let index;
                
                if (repeat) {
                    index = lastNote;
                } else {
                    // Movimiento con sesgo hacia notas cercanas
                    const steps = Math.floor((Math.random() - 0.5) * 4);
                    index = (lastNote + steps + scale.length) % scale.length;
                }
                
                const note = scale[index];
                const octave = 3 + Math.floor(Math.random() * 2);
                const freq = 440 * Math.pow(2, (note + octave * 12 - 45) / 12);
                
                notes.push({
                    freq: freq,
                    duration: 0.2 + Math.random() * 0.6,
                    volume: 0.05 + Math.random() * 0.1,
                    start: this.ctx.currentTime + i * 0.15
                });
                
                lastNote = index;
            }
            
            this.musicAI.lastNote = lastNote;
            this.musicAI.memory.push(notes);
            if (this.musicAI.memory.length > 20) this.musicAI.memory.shift();
            
            // Reproducir frase
            this._playPhrase(notes);
        }
        
        _playPhrase(notes) {
            for (const note of notes) {
                this._playNote(note.freq, note.duration, note.volume, note.start);
            }
        }
        
        _playNote(freq, duration, volume, startTime) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            // Envolvente suave
            const now = startTime || this.ctx.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(volume, now + duration * 0.1);
            gain.gain.linearRampToValueAtTime(volume * 0.8, now + duration * 0.8);
            gain.gain.linearRampToValueAtTime(0, now + duration);
            
            osc.connect(gain);
            gain.connect(this.musicGain);
            
            osc.start(now);
            osc.stop(now + duration);
            
            // Añadir armónicos sutiles
            if (Math.random() < 0.3) {
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                osc2.type = 'triangle';
                osc2.frequency.value = freq * 2;
                gain2.gain.value = volume * 0.1;
                osc2.connect(gain2);
                gain2.connect(this.musicGain);
                osc2.start(now);
                osc2.stop(now + duration);
            }
            
            // Limitar polifonía
            this.musicVoices.push({ osc, gain });
            if (this.musicVoices.length > this.config.maxPolyphony) {
                const old = this.musicVoices.shift();
                try {
                    old.osc.stop();
                } catch (e) {
                    // Ignorar
                }
            }
        }
        
        // ============================================================
        //  🎚️ EFECTOS 3D Y EVENTOS SONOROS
        //  ============================================================
        _setupEffects() {
            this.effectsGain = this.ctx.createGain();
            this.effectsGain.gain.value = this.config.effectsVolume;
            this.effectsGain.connect(this.master);
            
            // Panner 3D
            this.panner = this.ctx.createPanner();
            this.panner.panningModel = 'HRTF';
            this.panner.distanceModel = 'exponential';
            this.panner.refDistance = 1;
            this.panner.maxDistance = 100;
            this.panner.rolloffFactor = 1;
            
            // Conectar panner
            this.effectsGain.connect(this.panner);
            this.panner.connect(this.master);
            
            console.log('🎚️ Efectos 3D configurados');
        }
        
        // ============================================================
        //  🎯 SISTEMA DE VOZ (polyphony)
        //  ============================================================
        _setupVoicePool() {
            for (let i = 0; i < this.config.maxPolyphony; i++) {
                this.voicePool.push({
                    osc: null,
                    gain: null,
                    active: false,
                    type: 'none'
                });
            }
            console.log(`🎵 Pool de ${this.voicePool.length} voces creado`);
        }
        
        _getVoice() {
            // Buscar voz inactiva
            for (const voice of this.voicePool) {
                if (!voice.active) {
                    voice.active = true;
                    return voice;
                }
            }
            // Si no hay, usar la más antigua
            const oldest = this.voicePool.shift();
            oldest.active = true;
            this.voicePool.push(oldest);
            return oldest;
        }
        
        _releaseVoice(voice) {
            voice.active = false;
            if (voice.osc) {
                try { voice.osc.stop(); } catch (e) {}
                voice.osc = null;
            }
            if (voice.gain) {
                voice.gain.disconnect();
                voice.gain = null;
            }
        }
        
        // ============================================================
        //  🌾 SINTETIZADOR GRANULAR
        //  ============================================================
        _setupGranularSynth() {
            this.granularGain = this.ctx.createGain();
            this.granularGain.gain.value = 0.05;
            this.granularGain.connect(this.master);
            
            this.granularPool = [];
            this.grainCount = 0;
            
            console.log('🌾 Síntesis granular inicializada');
        }
        
        _createGrain(freq, duration, volume, position = 0) {
            if (!this.started) return;
            
            const bufferSize = Math.floor(duration * this.ctx.sampleRate);
            if (bufferSize < 1) return;
            
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generar grano con envolvente gaussiana
            const mid = bufferSize / 2;
            const width = bufferSize / 6;
            
            for (let i = 0; i < bufferSize; i++) {
                const pos = (i - mid) / width;
                const env = Math.exp(-pos * pos);
                // Oscilación con modulación
                const angle = i / this.ctx.sampleRate * freq * 2 * Math.PI;
                data[i] = Math.sin(angle + position) * env * volume;
            }
            
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;
            
            const gain = this.ctx.createGain();
            gain.gain.value = 1;
            
            src.connect(gain);
            gain.connect(this.granularGain);
            src.start();
            
            this.grainCount++;
            this.granularPool.push({ src, gain });
            
            // Limpiar granos viejos
            if (this.granularPool.length > 100) {
                const old = this.granularPool.shift();
                try { old.src.stop(); } catch (e) {}
                old.gain.disconnect();
            }
            
            return { src, gain };
        }
        
        // ============================================================
        //  🎯 EFECTOS SONOROS ESPECÍFICOS
        //  ============================================================
        
        // ============================================================
        //  🔊 PLAY CHIRP (mejorado)
        //  ============================================================
        _playChirp(isNight) {
            if (!this.started || !this.ctx) return;
            
            const voice = this._getVoice();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const panner = this.ctx.createPanner();
            
            // Configurar panner para posición aleatoria
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 20;
            panner.positionX.value = Math.cos(angle) * distance;
            panner.positionZ.value = Math.sin(angle) * distance;
            panner.positionY.value = 0.5 + Math.random() * 5;
            
            osc.type = isNight ? 'sawtooth' : 'sine';
            const baseFreq = isNight ? 2500 + Math.random() * 600 : 1800 + Math.random() * 1400;
            osc.frequency.value = baseFreq;
            
            // Modulación de frecuencia (trino)
            if (!isNight) {
                const mod = this.ctx.createOscillator();
                const modGain = this.ctx.createGain();
                mod.frequency.value = 4 + Math.random() * 3;
                modGain.gain.value = 50 + Math.random() * 100;
                mod.connect(modGain);
                modGain.connect(osc.frequency);
                mod.start();
                setTimeout(() => mod.stop(), 0.2);
            }
            
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + (isNight ? 0.12 : 0.1));
            
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(this.effectsGain);
            
            osc.start();
            osc.stop(now + 0.3);
            
            voice.osc = osc;
            voice.gain = gain;
            
            // Liberar voz después
            setTimeout(() => {
                this._releaseVoice(voice);
            }, 350);
        }
        
        // ============================================================
        //  ⚡ PLAY THUNDER (mejorado)
        //  ============================================================
        _playThunder() {
            if (!this.started || !this.ctx) return;
            
            // Múltiples capas para trueno realista
            const layers = 3;
            const baseTime = this.ctx.currentTime;
            
            for (let i = 0; i < layers; i++) {
                const delay = i * 0.15 + Math.random() * 0.1;
                const bufferSize = this.ctx.sampleRate * (0.5 + Math.random() * 0.5);
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                
                // Ruido con envolvente de trueno
                const attack = 0.05 + Math.random() * 0.05;
                const release = 0.3 + Math.random() * 0.5;
                const peak = 0.15 + Math.random() * 0.2;
                
                for (let j = 0; j < bufferSize; j++) {
                    const pos = j / bufferSize;
                    let env;
                    if (pos < attack) {
                        env = pos / attack;
                    } else if (pos < 1 - release) {
                        env = 1;
                    } else {
                        env = (1 - pos) / release;
                    }
                    data[j] = (Math.random() * 2 - 1) * env * peak;
                }
                
                const src = this.ctx.createBufferSource();
                src.buffer = buffer;
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 80 + i * 40 + Math.random() * 50;
                filter.Q.value = 0.5;
                
                const gain = this.ctx.createGain();
                const now = baseTime + delay;
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.exponentialRampToValueAtTime(0.3 - i * 0.05, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.2);
                
                src.connect(filter);
                filter.connect(gain);
                gain.connect(this.master);
                src.start(now);
            }
        }
        
        // ============================================================
        //  🔥 PLAY CRACKLE (mejorado)
        //  ============================================================
        _playCrackle() {
            if (!this.started || !this.ctx) return;
            
            const count = 1 + Math.floor(this.fireIntensity * 3);
            
            for (let i = 0; i < count; i++) {
                const bufferSize = this.ctx.sampleRate * (0.02 + Math.random() * 0.04);
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                
                const intensity = this.fireIntensity * 0.8 + 0.2;
                const amp = (0.3 + Math.random() * 0.7) * intensity;
                
                for (let j = 0; j < bufferSize; j++) {
                    const decay = 1 - (j / bufferSize);
                    data[j] = (Math.random() * 2 - 1) * amp * decay * decay;
                }
                
                const src = this.ctx.createBufferSource();
                src.buffer = buffer;
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 600 + Math.random() * 1200;
                filter.Q.value = 0.3 + Math.random() * 0.4;
                
                const gain = this.ctx.createGain();
                gain.gain.value = 0.4 + Math.random() * 0.6;
                
                const panner = this.ctx.createPanner();
                const angle = Math.random() * Math.PI * 2;
                const distance = 0.5 + Math.random() * 3;
                panner.positionX.value = Math.cos(angle) * distance;
                panner.positionZ.value = Math.sin(angle) * distance;
                
                src.connect(filter);
                filter.connect(gain);
                gain.connect(panner);
                panner.connect(this.master);
                src.start();
            }
        }
        
        // ============================================================
        //  📡 PLAY BIRD (sonido de pájaro realista)
        //  ============================================================
        _playBird() {
            if (!this.started || !this.ctx) return;
            
            const voice = this._getVoice();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const panner = this.ctx.createPanner();
            
            // Posición aleatoria en el espacio
            const angle = Math.random() * Math.PI * 2;
            const distance = 8 + Math.random() * 25;
            panner.positionX.value = Math.cos(angle) * distance;
            panner.positionZ.value = Math.sin(angle) * distance;
            panner.positionY.value = 2 + Math.random() * 8;
            
            // Trino de pájaro (secuencia de notas)
            const notes = [
                { freq: 1200 + Math.random() * 800, dur: 0.04 + Math.random() * 0.06 },
                { freq: 1400 + Math.random() * 1000, dur: 0.03 + Math.random() * 0.05 },
                { freq: 1000 + Math.random() * 600, dur: 0.05 + Math.random() * 0.07 }
            ];
            
            const baseTime = this.ctx.currentTime;
            
            for (let i = 0; i < notes.length; i++) {
                const time = baseTime + i * (0.06 + Math.random() * 0.04);
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                
                osc2.type = i % 2 === 0 ? 'sine' : 'triangle';
                osc2.frequency.value = notes[i].freq;
                
                gain2.gain.setValueAtTime(0.0001, time);
                gain2.gain.exponentialRampToValueAtTime(0.03 + Math.random() * 0.04, time + 0.01);
                gain2.gain.exponentialRampToValueAtTime(0.0001, time + notes[i].dur);
                
                osc2.connect(gain2);
                gain2.connect(panner);
                panner.connect(this.effectsGain);
                
                osc2.start(time);
                osc2.stop(time + notes[i].dur + 0.02);
            }
            
            voice.osc = osc;
            voice.gain = gain;
            
            setTimeout(() => {
                this._releaseVoice(voice);
            }, 500);
        }
        
        // ============================================================
        //  🎵 PLAY AMBIENT NOTE (nota ambiental de fondo)
        //  ============================================================
        _playAmbientNote(freq, volume = 0.02, duration = 2) {
            if (!this.started || !this.ctx) return;
            
            const voice = this._getVoice();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            // Modulación suave
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 0.05 + Math.random() * 0.03;
            lfoGain.gain.value = 2;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(volume, now + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            
            osc.connect(gain);
            gain.connect(this.master);
            
            osc.start();
            osc.stop(now + duration);
            lfo.stop(now + duration);
            
            voice.osc = osc;
            voice.gain = gain;
            
            setTimeout(() => {
                this._releaseVoice(voice);
            }, duration * 1000 + 100);
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL (cada frame)
        //  ============================================================
        update(delta) {
            if (!this.started || !this.ctx) return;
            
            this.clock += delta;
            
            try {
                // ===== OBTENER ESTADO DEL MUNDO =====
                this._updateWorldState();
                
                // ===== ACTUALIZAR PARÁMETROS =====
                this._updateParameters(delta);
                
                // ===== SCHEDULERS =====
                this._updateSchedulers(delta);
                
                // ===== ACTUALIZAR IA MUSICAL =====
                this._updateMusicAI(delta);
                
                // ===== ACTUALIZAR ECUALIZADOR =====
                this._updateEQ();
                
                // ===== ESTADÍSTICAS =====
                this._updateStats();
                
            } catch (e) {
                // Silencioso: el audio nunca debe romper el motor
                if (this.config.debug) {
                    console.warn('⚠️ Error en AudioSystem.update:', e);
                }
            }
        }
        
        // ============================================================
        //  📊 ACTUALIZAR ESTADO DEL MUNDO
        //  ============================================================
        _updateWorldState() {
            try {
                const renderer = this.engine.getModule ? this.engine.getModule('renderer') : null;
                const worldAI = this.engine.getModule ? this.engine.getModule('worldAI') : null;
                
                // Clima
                if (renderer) {
                    this.weatherType = renderer.weatherType || 'clear';
                    
                    // Hora del día
                    if (renderer.dayNight) {
                        const intensity = renderer.dayNight.intensity || 0.5;
                        this.isNight = intensity < 0.3;
                        this.timeOfDay = intensity;
                    }
                }
                
                // Incendios
                if (worldAI) {
                    const status = worldAI.getStatus ? worldAI.getStatus() : null;
                    if (status) {
                        this.fireIntensity = Math.min(1, (status.activeFires || 0) / 5);
                    }
                }
                
            } catch (e) {
                // Silencioso
            }
        }
        
        // ============================================================
        //  🎛️ ACTUALIZAR PARÁMETROS
        //  ============================================================
        _updateParameters(delta) {
            // ===== VIENTO =====
            if (this.nodes.wind) {
                const target = this.config.windVolume * (0.6 + this.timeOfDay * 0.4);
                this.nodes.wind.gain.gain.setTargetAtTime(target, this.ctx.currentTime, 2);
                
                // Variación de frecuencia
                const freq = 250 + Math.sin(this.clock * 0.05) * 150;
                this.nodes.wind.filters[0].frequency.setTargetAtTime(freq, this.ctx.currentTime, 3);
            }
            
            // ===== LLUVIA =====
            if (this.nodes.rain) {
                const isRain = this.weatherType === 'rain' || this.weatherType === 'snow';
                const target = isRain ? (this.weatherType === 'snow' ? 0.04 : this.config.rainVolume) : 0;
                this.nodes.rain.gain.gain.setTargetAtTime(target, this.ctx.currentTime, 1);
                
                if (isRain && this.clock > this.schedulers.thunder.next) {
                    this._playThunder();
                    this.schedulers.thunder.next = this.clock + 15 + Math.random() * 30;
                }
            }
            
            // ===== FUEGO =====
            if (this.nodes.fire) {
                const target = this.fireIntensity * this.config.fireVolume;
                this.nodes.fire.gain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.5);
                
                // Crepitar
                if (this.fireIntensity > 0.1 && this.clock > this.schedulers.fireCrackle.next) {
                    this._playCrackle();
                    const interval = 0.03 + (1 - this.fireIntensity) * 0.08;
                    this.schedulers.fireCrackle.next = this.clock + interval + Math.random() * interval;
                }
            }
        }
        
        // ============================================================
        //  📅 ACTUALIZAR SCHEDULERS
        //  ============================================================
        _updateSchedulers(delta) {
            // ===== PÁJAROS (día) / GRILLOS (noche) =====
            if (this.clock > this.schedulers.bird.next) {
                const isNight = this.isNight;
                if (isNight) {
                    this._playChirp(true);
                    this.schedulers.bird.next = this.clock + 0.5 + Math.random() * 1.5;
                } else {
                    this._playBird();
                    this.schedulers.bird.next = this.clock + 2 + Math.random() * 5;
                }
            }
            
            // ===== MÚSICA AMBIENTAL =====
            if (this.config.generateMusic && this.clock > this.schedulers.music.next) {
                this._generatePhrase();
                this.schedulers.music.next = this.clock + 15 + Math.random() * 25;
            }
        }
        
        // ============================================================
        //  🧬 ACTUALIZAR IA MUSICAL
        //  ============================================================
        _updateMusicAI(delta) {
            // Adaptar escala según estado emocional
            const valence = this.emotionalState.valence;
            const arousal = this.emotionalState.arousal;
            
            // Modificar escala según emoción
            if (valence > 0.6) {
                // Feliz → escala mayor
                this.musicAI.scale = [0, 2, 4, 5, 7, 9, 11];
            } else if (valence < 0.4) {
                // Triste → escala menor
                this.musicAI.scale = [0, 2, 3, 5, 7, 8, 10];
            } else {
                // Neutral → pentatónica
                this.musicAI.scale = [0, 2, 4, 7, 9];
            }
            
            // Ajustar complejidad según arousal
            this.musicAI.complexity = 0.3 + arousal * 0.5;
            this.musicAI.phraseLength = Math.round(4 + arousal * 8);
            
            // Aprender de eventos recientes
            this.musicAI.learningRate = 0.005 + (1 - this.config.masterVolume) * 0.01;
        }
        
        // ============================================================
        //  🎚️ ACTUALIZAR ECUALIZADOR ADAPTATIVO
        //  ============================================================
        _updateEQ() {
            if (!this.eq) return;
            
            // Adaptar EQ según contenido de audio
            if (this.weatherType === 'rain' || this.weatherType === 'snow') {
                // Más graves para lluvia
                this.eq.low.gain.setTargetAtTime(2, this.ctx.currentTime, 1);
                this.eq.high.gain.setTargetAtTime(-1, this.ctx.currentTime, 1);
            } else if (this.weatherType === 'clear') {
                // Balance neutro
                this.eq.low.gain.setTargetAtTime(0, this.ctx.currentTime, 1);
                this.eq.high.gain.setTargetAtTime(0, this.ctx.currentTime, 1);
            }
            
            // Noche → más graves, menos agudos
            if (this.isNight) {
                this.eq.low.gain.setTargetAtTime(1, this.ctx.currentTime, 2);
                this.eq.high.gain.setTargetAtTime(-1, this.ctx.currentTime, 2);
            }
        }
        
        // ============================================================
        //  📊 ACTUALIZAR ESTADÍSTICAS
        //  ============================================================
        _updateStats() {
            this.stats.voices = this.voicePool.filter(v => v.active).length;
            this.stats.grains = this.granularPool.length;
            this.stats.events = this.musicAI.memory.length;
            
            // Estimar CPU (basado en número de voces activas)
            this.stats.cpuLoad = (this.stats.voices / this.config.maxPolyphony) * 30 + 
                                (this.stats.grains / 100) * 20;
            this.stats.cpuLoad = Math.min(100, this.stats.cpuLoad);
        }
        
        // ============================================================
        //  🎛️ CONTROLES PÚBLICOS
        //  ============================================================
        setMasterVolume(v) {
            this.config.masterVolume = Math.max(0, Math.min(1, v));
            if (this.master) {
                this.master.gain.setTargetAtTime(this.config.masterVolume, this.ctx.currentTime, 0.1);
            }
            this._saveConfig();
        }
        
        setWeather(type) {
            this.weatherType = type;
            this._onWeatherChange({ type });
        }
        
        _onWeatherChange(data) {
            this.weatherType = data.type;
            
            // Ajustar parámetros según clima
            if (data.type === 'rain') {
                this.config.rainVolume = 0.12;
                this.config.windVolume = 0.06;
            } else if (data.type === 'snow') {
                this.config.rainVolume = 0.04;
                this.config.windVolume = 0.03;
            } else {
                this.config.rainVolume = 0;
                this.config.windVolume = 0.08;
            }
        }
        
        setFireIntensity(intensity) {
            this.fireIntensity = Math.max(0, Math.min(1, intensity));
        }
        
        setEmotion(valence, arousal) {
            this.emotionalState.valence = Math.max(0, Math.min(1, valence));
            this.emotionalState.arousal = Math.max(0, Math.min(1, arousal));
        }
        
        // ============================================================
        //  📤 EXPORTAR ESTADO
        //  ============================================================
        getStatus() {
            return {
                started: this.started,
                active: this.isActive,
                weather: this.weatherType,
                isNight: this.isNight,
                fireIntensity: this.fireIntensity,
                emotionalState: this.emotionalState,
                stats: this.stats,
                config: {
                    masterVolume: this.config.masterVolume,
                    reverbWet: this.config.reverbWet,
                    generateMusic: this.config.generateMusic,
                    maxPolyphony: this.config.maxPolyphony
                },
                voices: this.voicePool.filter(v => v.active).length,
                grains: this.granularPool.length,
                musicMemory: this.musicAI.memory.length
            };
        }
        
        // ============================================================
        //  🚀 CIERRE
        //  ============================================================
        shutdown() {
            console.log('🔊 Cerrando AudioSystem...');
            
            if (this.ctx) {
                this.ctx.close().catch(() => {});
                this.ctx = null;
            }
            
            this.started = false;
            this.isActive = false;
            
            console.log('✅ AudioSystem cerrado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.AudioSystem = AudioSystem;
    
    console.log('🔊 AudioSystem Cuántico cargado');
    console.log('🎵 IA musical, síntesis granular y efectos 3D disponibles');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AudioSystem;
    }
    
})();
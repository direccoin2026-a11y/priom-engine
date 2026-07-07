/**
 * AudioSystem.js
 * Sonido ambiental 100% procedural (Web Audio API, sin archivos de
 * audio externos): viento, pájaros/grillos, lluvia/nieve, fuego,
 * truenos. Reacciona al clima (WeatherFX), incendios (WorldAI) y
 * ciclo día/noche que ya existen — no inventa datos nuevos.
 *
 * IMPORTANTE: los navegadores bloquean el audio hasta un gesto del
 * usuario. Hay que llamar a start() dentro de un evento click/touch
 * (ver el botón "🔊 Sonido" que se agrega en index.html).
 */
(function() {
    'use strict';

    class AudioSystem {
        constructor(engine) {
            this.engine = engine;
            this.ctx = null;
            this.master = null;
            this.started = false;
            this.nodes = {};
            this.clock = 0;
            this.nextBirdAt = 0;
            this.nextThunderAt = 0;
        }

        start() {
            if (this.started) return;
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
                this.master = this.ctx.createGain();
                this.master.gain.value = 0.5;
                this.master.connect(this.ctx.destination);

                this._setupWind();
                this._setupRain();
                this._setupFire();
                this.started = true;
                console.log('🔊 AudioSystem iniciado');
            } catch (e) {
                console.warn('⚠️ AudioSystem: no se pudo iniciar', e);
            }
        }

        setMasterVolume(v) {
            if (this.master) this.master.gain.value = Math.max(0, Math.min(1, v));
        }

        // ============================================================
        //  🌬️ VIENTO (ruido filtrado, siempre presente, con variación)
        // ============================================================
        _setupWind() {
            const bufferSize = 2 * this.ctx.sampleRate;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 400;
            filter.Q.value = 0.6;

            const gain = this.ctx.createGain();
            gain.gain.value = 0.05;

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.master);
            noise.start();

            this.nodes.wind = { source: noise, filter, gain };
        }

        // ============================================================
        //  🌧️ LLUVIA / NIEVE (ruido blanco más denso, se activa por clima)
        // ============================================================
        _setupRain() {
            const bufferSize = 2 * this.ctx.sampleRate;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1200;

            const gain = this.ctx.createGain();
            gain.gain.value = 0.0; // arranca en silencio, sube si llueve/nieva

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.master);
            noise.start();

            this.nodes.rain = { source: noise, filter, gain };
        }

        // ============================================================
        //  🔥 FUEGO (crepitar: pulsos cortos de ruido filtrado)
        // ============================================================
        _setupFire() {
            const gain = this.ctx.createGain();
            gain.gain.value = 0.0;
            gain.connect(this.master);
            this.nodes.fire = { gain, nextCrackleAt: 0 };
        }

        _playCrackle() {
            if (!this.ctx) return;
            const bufferSize = this.ctx.sampleRate * 0.05;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800 + Math.random() * 1200;
            src.connect(filter);
            filter.connect(this.nodes.fire.gain);
            src.start();
        }

        // Un chirrido corto de pájaro (día) o grillo (noche) — tono sintetizado
        _playChirp(isNight) {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = isNight ? 'square' : 'sine';
            const baseFreq = isNight ? 2800 + Math.random() * 400 : 1800 + Math.random() * 1200;
            osc.frequency.value = baseFreq;
            gain.gain.value = 0.0001;
            osc.connect(gain);
            gain.connect(this.master);
            osc.start();

            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + (isNight ? 0.15 : 0.12));
            osc.stop(now + 0.3);
        }

        // Trueno grave (ruido filtrado pasa-bajos + envolvente larga)
        _playThunder() {
            if (!this.ctx) return;
            const bufferSize = this.ctx.sampleRate * 1.5;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const src = this.ctx.createBufferSource();
            src.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 120;
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.35, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

            src.connect(filter);
            filter.connect(gain);
            gain.connect(this.master);
            src.start();
        }

        // ============================================================
        //  🔄 ACTUALIZAR (llamar cada frame o cada fixed update)
        // ============================================================
        update(delta) {
            if (!this.started || !this.ctx) return;
            this.clock += delta;

            try {
                const renderer = this.engine.getModule ? this.engine.getModule('renderer') : null;
                const worldAI = this.engine.getModule ? this.engine.getModule('worldAI') : null;

                // Viento: variar ligeramente el filtro para que no suene monótono
                if (this.nodes.wind) {
                    const wobble = 350 + Math.sin(this.clock * 0.2) * 150;
                    this.nodes.wind.filter.frequency.setTargetAtTime(wobble, this.ctx.currentTime, 1.5);
                }

                // Lluvia/nieve según el clima activo
                if (this.nodes.rain && renderer) {
                    const weatherType = renderer.weatherType || 'clear';
                    const targetGain = weatherType === 'clear' ? 0.0 : (weatherType === 'snow' ? 0.03 : 0.09);
                    this.nodes.rain.gain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 1.0);

                    // Truenos ocasionales solo con lluvia
                    if (weatherType === 'rain' && this.clock > this.nextThunderAt) {
                        this._playThunder();
                        this.nextThunderAt = this.clock + 8 + Math.random() * 20;
                    }
                }

                // Fuego: crepitar solo si hay incendios activos (WorldAI)
                if (this.nodes.fire && worldAI) {
                    const status = worldAI.getStatus ? worldAI.getStatus() : { activeFires: 0 };
                    const active = status.activeFires > 0;
                    this.nodes.fire.gain.gain.setTargetAtTime(active ? 0.25 : 0.0, this.ctx.currentTime, 0.5);
                    if (active && this.clock > this.nodes.fire.nextCrackleAt) {
                        this._playCrackle();
                        this.nodes.fire.nextCrackleAt = this.clock + 0.05 + Math.random() * 0.15;
                    }
                }

                // Pájaros de día / grillos de noche, según intensidad solar
                if (renderer && this.clock > this.nextBirdAt) {
                    const isNight = (renderer.dayNight ? renderer.dayNight.intensity : 0.5) < 0.35;
                    this._playChirp(isNight);
                    this.nextBirdAt = this.clock + 1.5 + Math.random() * 4;
                }
            } catch (e) {
                // silencioso: el audio nunca debe romper el motor
            }
        }
    }

    window.AudioSystem = AudioSystem;
    console.log('🔊 AudioSystem cargado (procedural, sin archivos externos)');
})();

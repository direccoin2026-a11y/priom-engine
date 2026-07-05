/**
 * PostProcessing.js
 * Utilidades extra de post-procesado (FXAA). ADITIVO: se agrega al
 * final del composer que ya existe en MaxRenderer (bloom/SSAO/
 * cinematic no se tocan).
 */
(function() {
    'use strict';

    class PostProcessing {
        // Agrega un pase de FXAA al composer existente. Devuelve el pase o null.
        static addFXAA(composer, renderer) {
            try {
                if (!THREE.ShaderPass || !THREE.FXAAShader) {
                    console.warn('⚠️ PostProcessing: FXAAShader no disponible');
                    return null;
                }
                const pass = new THREE.ShaderPass(THREE.FXAAShader);
                const pixelRatio = renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
                const size = renderer.getSize ? renderer.getSize(new THREE.Vector2()) : { x: window.innerWidth, y: window.innerHeight };
                pass.material.uniforms['resolution'].value.set(
                    1 / (size.x * pixelRatio),
                    1 / (size.y * pixelRatio)
                );
                composer.addPass(pass);
                console.log('🪄 FXAA activado');
                return pass;
            } catch (e) {
                console.warn('⚠️ PostProcessing: no se pudo activar FXAA', e);
                return null;
            }
        }

        static resizeFXAA(pass, renderer) {
            if (!pass) return;
            try {
                const pixelRatio = renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
                const size = renderer.getSize ? renderer.getSize(new THREE.Vector2()) : { x: window.innerWidth, y: window.innerHeight };
                pass.material.uniforms['resolution'].value.set(
                    1 / (size.x * pixelRatio),
                    1 / (size.y * pixelRatio)
                );
            } catch (e) {
                // silencioso: no crítico
            }
        }
    }

    window.PostProcessing = PostProcessing;
    console.log('🎬 PostProcessing (extra) cargado');
})();

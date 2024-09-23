//// Função para mudar a velocidade do áudio sem alterar o tom
//function changeSpeedWithoutPitch(audioBuffer, speed) {
//    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//    var source = audioCtx.createBufferSource();
//    source.buffer = audioBuffer;

//    var tempo = 1 / speed;

//    var playbackRate = tempo / source.duration;

//    source.playbackRate.value = playbackRate;

//    source.connect(audioCtx.destination);
//    source.start();

//    return source;
//}

//// Função para mudar o tom do áudio sem alterar a velocidade
//function changePitchWithoutSpeed(audioBuffer, pitch) {
//    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//    var source = audioCtx.createBufferSource();
//    source.buffer = audioBuffer;

//    var pitchShifter = new Jungle(audioCtx);

//    source.connect(pitchShifter.input);
//    pitchShifter.connect(audioCtx.destination);

//    pitchShifter.setPitchOffset(pitch);

//    source.start();

//    return source;
//}


//// Carregar o arquivo de áudio
//async function loadAudioFile(url) {
//    const response = await fetch(url);
//    const arrayBuffer = await response.arrayBuffer();
//    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//    return audioBuffer;
//}

//// Usar a função para mudar a velocidade sem alterar o tom
//async function changeSpeed(url, speed) {
//    const audioBuffer = await loadAudioFile(url);
//    changeSpeedWithoutPitch(audioBuffer, speed);
//}

//// Usar a função para mudar o tom sem alterar a velocidade
//async function changePitch(url, pitch) {
//    const audioBuffer = await loadAudioFile(url);
//    changePitchWithoutSpeed(audioBuffer, pitch);
//}


const BUFFER_SIZE = 8192;

class AudioPlayer {
    constructor({ emitter, pitch, tempo, reverbImpulseResponse }) {
        this.emitter = emitter;

        this.context = new AudioContext();
        this.scriptProcessor = this.context.createScriptProcessor(BUFFER_SIZE, 2, 2);
        this.scriptProcessor.onaudioprocess = e => {
            const l = e.outputBuffer.getChannelData(0);
            const r = e.outputBuffer.getChannelData(1);
            const framesExtracted = this.simpleFilter.extract(this.samples, BUFFER_SIZE);
            if (framesExtracted === 0) {
                this.emitter.emit('stop');
            }
            for (let i = 0; i < framesExtracted; i++) {
                l[i] = this.samples[i * 2];
                r[i] = this.samples[i * 2 + 1];
            }
        };


        this.soundTouch = new SoundTouch();
        this.soundTouch.pitch = pitch;
        this.soundTouch.tempo = tempo;

        this.duration = undefined;


        this.volumeNode = this.context.createGain();
        this.volumeNode.gain.value = 0.5;

        this.convolverNode = this.context.createConvolver();
        this.convolverNode.buffer = reverbImpulseResponse;

        this.dryWetGainNode = this.context.createGain();
        this.dryWetGainNode.gain.value = 0.6;
    }


    setImpulseResponse(buffer) {
        if (this.convolverNode) {
            this.convolverNode.buffer = buffer;
        }
    }

    get pitch() {
        return this.soundTouch.pitch;
    }
    set pitch(pitch) {
        this.soundTouch.pitch = pitch;
    }

    get tempo() {
        return this.soundTouch.tempo;
    }
    set tempo(tempo) {
        this.soundTouch.tempo = tempo;
    }

    set dwGainNode(dwgnValue) {
        this.dryWetGainNode.gain.value = dwgnValue;
    }

    decodeAudioData(data) {
        return this.context.decodeAudioData(data);
    }

    setBuffer(buffer) {
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = buffer;

        this.samples = new Float32Array(BUFFER_SIZE * 2);
        this.source = {
            extract: (target, numFrames, position) => {
                this.emitter.emit('state', { t: position / this.context.sampleRate });
                const l = buffer.getChannelData(0);
                const r = buffer.getChannelData(1);
                for (let i = 0; i < numFrames; i++) {
                    target[i * 2] = l[i + position];
                    target[i * 2 + 1] = r[i + position];
                }
                return Math.min(numFrames, l.length - position);
            },
        };
        this.simpleFilter = new SimpleFilter(this.source, this.soundTouch);

        this.duration = buffer.duration;
        this.emitter.emit('state', { duration: buffer.duration });
    }


    playViolao() {

        this.scriptProcessor.connect(this.volumeNode);
        this.volumeNode.connect(this.context.destination)

        this.context.resume().then(() => {
            this.scriptProcessor.connect(this.convolverNode);

            this.convolverNode.connect(this.dryWetGainNode);
            this.dryWetGainNode.connect(this.context.destination);
        });
    }

    pauseViolao() {
        this.scriptProcessor.disconnect(this.volumeNode);
        this.volumeNode.disconnect(this.context.destination);
        this.scriptProcessor.disconnect(this.convolverNode);
        this.convolverNode.disconnect(this.dryWetGainNode);
        this.dryWetGainNode.disconnect(this.context.destination);
    }

    toggle(statement) {
        if (statement == true) {
            this.scriptProcessor.disconnect(this.volumeNode);
            this.volumeNode.disconnect(this.context.destination);
            this.convolverNode.connect(this.dryWetGainNode);
            this.dryWetGainNode.connect(this.context.destination);
        }
        else {
            this.scriptProcessor.connect(this.volumeNode);
            this.volumeNode.connect(this.context.destination)
        }
    }

    get durationVal() {
        return this.simpleFilter.sourcePosition;
    }

    seekPercent(percent) {
        if (this.simpleFilter !== undefined) {
            this.simpleFilter.sourcePosition = Math.round(
                percent / 100 * this.duration * this.context.sampleRate
            );
        }
    }
}

function updateSeek(audioPlayer, seekSlider) {
    //if (audioPlayer) {
    //    console.log("seeking");
    //    let sourcePostion = audioPlayer.durationVal;
    //    seekSlider.value = sourcePostion / 48000 / audioPlayer.duration;
    //}
}

const seekSlider = document.getElementById('seekSlider');
let myInterval;

let isPlaying = false;

let toggleRev = false;
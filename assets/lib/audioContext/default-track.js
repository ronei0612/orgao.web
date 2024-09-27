const path = location.origin;

const defaultTrack = {
  beat: [
    { rowId: '0', colId: '0', enabled: false },
  ],
  settings: {
    // sampleSet: '../assets/audio/studio/samples.json',
    sampleSet: 'https://roneicostasoares.com.br/Orgao/assets/audio/studio/samples.json',
    measureLength: 16,
    bpm: 90,
    detune: 0,
    gainEnabled: 'gain',
    attackAmp: 0,
    sustainAmp: 0.4,
    decayAmp: 0.7,
    releaseAmp: 1,
    attackTime: 0,
    decayTime: 0,
    sustainTime: 2,
    releaseTime: 2,
    adsrInterval: 0.1,
    delay: 0.01,
    filter: 1000,
  },
};
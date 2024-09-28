function AdsrGainNode(ctx) {
  this.ctx = ctx;
  this.mode = 'exponentialRampToValueAtTime';
  this.options = {
    attackAmp: 0.1,
    decayAmp: 0.3,
    sustainAmp: 0.7,
    releaseAmp: 0.01,
    attackTime: 0.1,
    decayTime: 0.2,
    sustainTime: 1.0,
    releaseTime: 3.4,
    autoRelease: true
  };

  this.setOptions = options => this.options = Object.assign(this.options, options);

  this.gainNode;
  this.audioTime;

  this.getGainNode = audioTime => {
    this.gainNode = this.ctx.createGain();
    this.audioTime = audioTime;

    this.gainNode.gain.setValueAtTime(0.0000001, audioTime);
    this.gainNode.gain[this.mode](this.options.attackAmp, audioTime + this.options.attackTime);
    this.gainNode.gain[this.mode](this.options.decayAmp, audioTime + this.options.attackTime + this.options.decayTime);
    this.gainNode.gain[this.mode](this.options.sustainAmp, audioTime + this.options.attackTime + this.options.sustainTime);

    if (this.options.autoRelease) {
      this.gainNode.gain[this.mode](this.options.releaseAmp, audioTime + this.releaseTime());
      this.disconnect(audioTime + this.releaseTime());
    }

    return this.gainNode;
  };

  this.releaseNow = () => {
    this.gainNode.gain[this.mode](this.options.releaseAmp, this.ctx.currentTime + this.options.releaseTime);
    this.disconnect(this.options.releaseTime);
  };

  this.releaseTime = () => this.options.attackTime + this.options.decayTime + this.options.sustainTime + this.options.releaseTime;

  this.releaseTimeNow = () => this.ctx.currentTime + this.releaseTime();

  this.disconnect = disconnectTime => setTimeout(() => this.gainNode.disconnect(), disconnectTime * 1000);
}

function audioBufferInstrument(context, buffer) {
  this.context = context;
  this.buffer = buffer;
}

audioBufferInstrument.prototype.setup = function () {
  this.source = this.context.createBufferSource();
  this.source.buffer = this.buffer;
  this.source.connect(this.context.destination);
};

audioBufferInstrument.prototype.get = function () {
  this.source = this.context.createBufferSource();
  this.source.buffer = this.buffer;
  return this.source;
};

audioBufferInstrument.prototype.trigger = function (time) {
  this.setup();
  this.source.start(time);
};
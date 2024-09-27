// getSetControls.js
function getSetControls() {
  const trackerControls = JSON.parse(
    '{ "": 90, "adsrInterval": 0.1, "attackTime": 0, "bpm": 90, "decayAmp": 0.7, "decayTime": 0, "delay": 0.01, "filter": 1000, "releaseAmp": 1, "releaseTime": 2, "sustainAmp": 0.4, "sustainTime": 2 }'
  );

  this.getTrackerControls = function () {
    return trackerControls;
  };

  this.setTrackerControls = function (values) {
    if (!values) {
      values = this.getTrackerControls();
    }
    this.options = values;
  };
}
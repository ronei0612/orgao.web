// tinySampleLoader.js
function sampleLoader(context, url) {
  var promise = new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
      if (request.status === 200) {
        context.decodeAudioData(request.response, function (buffer) {
          resolve(buffer);
        });
      } else {
        reject('tiny-sample-loader request failed');
      }
    };
    request.send();
  });
  return promise;
}

// loadSampleSet.js
function loadSampleSet(ctx, dataUrl) {
  var promise = new Promise((resolve, reject) => {
    var jsonPromise = getJSONPromise(dataUrl);
    jsonPromise.then(function (data) {
      var samplePromises = getSamplePromises(ctx, data);
      Promise.all(samplePromises)
        .then(function () {
          resolve({ data: data, buffers: buffers });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
      .catch(function (error) {
        reject(error);
      });
  });

  return promise;
}

var buffers = {}; // Global variable to store audio buffers

function getSamplePromises(ctx, data) {
  var baseUrl = data.samples;
  var promises = [];
  data.filename = [];
  var i = 0;
  data.files.forEach(function (val) {
    var filename = val.replace(/\.[^/.]+$/, '');
    data.filename.push(filename);
    var remoteUrl = baseUrl + val;

    let loaderPromise = sampleLoader(ctx, remoteUrl);
    loaderPromise.then(function (buffer) {
      buffers[filename] = new audioBufferInstrument(ctx, buffer);
    });

    promises.push(loaderPromise);
  });
  return promises;
}
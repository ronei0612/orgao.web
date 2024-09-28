function sampleLoader(context, url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => request.status === 200 
      ? context.decodeAudioData(request.response, resolve) 
      : reject('tiny-sample-loader request failed');
    request.send();
  });
}

function getJSONPromise(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'text';
    request.onload = () => request.status === 200 
      ? resolve(JSON.parse(request.responseText)) 
      : reject('JSON could not be loaded ' + url);
    request.send();
  });
}

function loadSampleSet(ctx, dataUrl) {
  return new Promise((resolve, reject) => {
    getJSONPromise(dataUrl)
      .then(data => {
        const samplePromises = getSamplePromises(ctx, data);
        Promise.all(samplePromises)
          .then(() => resolve({ data, buffers }))
          .catch(error => console.log(error));
      })
      .catch(reject);
  });
}

var buffers = {};

function getSamplePromises(ctx, data) {
  const baseUrl = data.samples;
  const promises = [];
  data.filename = [];

  data.files.forEach(val => {
    const filename = val.replace(/\.[^/.]+$/, '');
    data.filename.push(filename);
    const remoteUrl = baseUrl + val;
    
    const loaderPromise = sampleLoader(ctx, remoteUrl);
    loaderPromise.then(buffer => buffers[filename] = new audioBufferInstrument(ctx, buffer));
    promises.push(loaderPromise);
  });

  return promises;
}
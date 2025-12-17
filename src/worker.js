// need to create the AI transcriber here, cannot pass
// complex objects from main thread to here
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

// for AI transcription
let transcriber = null;
let loadingPromise = null;

async function loadModel() {
  if (transcriber) return transcriber;

  if (!loadingPromise) {
    console.log('Loading model...');
    loadingPromise = pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
      device: 'webgpu',
      chunk_length_s: 5,
      stride_length_s: 1,
    }).then((model) => {
      console.log('Model loaded.');

      transcriber = model;
      return model;
    });
  }

  return loadingPromise;
}

async function processAudio(pcmArray) {
  const model = await loadModel();

  try {
    const result = await model(pcmArray);

    return result.text;
  } catch (error) {
    console.error('Transcription error:', error);

    // return empty string on error
    return '';
  }
}

// receives request every 4 seconds
// main thread in audioEngine sends an audio recording to the worker
onmessage = async function (event) {
  const { array, sampleRate } = event.data;

  if (!(array instanceof Float32Array)) {
    // nothing to process
    return;
  }

  const text = await processAudio(array, sampleRate);
  postMessage({ text });
};

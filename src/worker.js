//need to create the AI transcriber here, cannot pass
//complex objects from main thread to here
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;

// Init AI transcriber as early as we can
let transcriber = null;
try {
  console.log('Loading model...');
  transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
    device: 'webgpu',
    chunk_length_s: 4,
    stride_length_s: 3,
  });
  console.log('Model loaded.');
} catch (e) {
  console.error('Failed to load model:', e);
  throw new Error('unable to init model:', e);
}

//for downsampling to 16KHZ
function downsample16k(originalData, originalSampleRate) {
  let targetSampleRate = 16000;
  const ratio = originalSampleRate / targetSampleRate;
  const newLength = Math.round(originalData.length / ratio);

  const downsampled = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const originalIndexFloat = i * ratio;

    const indexFloor = Math.floor(originalIndexFloat);
    const indexCeil = Math.min(indexFloor + 1, originalData.length - 1);

    const weight2 = originalIndexFloat - indexFloor;
    const weight1 = 1 - weight2;

    downsampled[i] = originalData[indexFloor] * weight1 + originalData[indexCeil] * weight2;
  }

  return downsampled;
}

//computes the db of a pcm array
//skip silent arrays

function measureDb(pcm) {
  let sum = 0;
  for (let i = 0; i < pcm.length; i++) {
    sum += pcm[i] * pcm[i];
  }

  const rms = Math.sqrt(sum / pcm.length);
  const db = 20 * Math.log10(rms + 1e-10);

  return db;
}

//call loadModel inside worker
// loadModel();

async function processAudio(pcmArray, sampleRate) {
  if (!transcriber) {
    console.warn('Transcriber not ready yet');
    //return empty string
    return '';
  }

  try {
    const downsampled = downsample16k(pcmArray, sampleRate);
    //skip if too quiet
    if (measureDb(downsampled) < -50) {
      return '';
    }
    const result = await transcriber(downsampled);
    return result.text;
  } catch (error) {
    console.error('Transcription error:', error);
    //return empty string on error
    return '';
  }
}

//receives request every 4 seconds
//main thread in audioEngine sends an audio recording to the worker
onmessage = async function (event) {
  const audioData = event.data;

  // if (!(array instanceof Float32Array)) {
  //   //nothing to process
  //   return;
  // }

  // const text = await processAudio(array, sampleRate);

  const res = await transcriber(audioData);

  postMessage(res.text);
};

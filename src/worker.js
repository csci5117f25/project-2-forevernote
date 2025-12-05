//need to create the AI transcriber here, cannot pass
//complex objects from main thread to here
import { pipeline, env } from '@xenova/transformers';



//for AI transcription
let transcriber = null;

//for loading the AI audio transcription
async function loadModel() {
  env.allowLocalModels = false;

  env.useBrowserCache = false;

  console.log("Loading model...");
  try {
    transcriber = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en", {
        device: 'webgpu',
        chunk_length_s: 6,
      }
    );
    console.log("Model loaded.");
  } catch (err) {
    console.error("Error loading model:", err);
  }
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

    downsampled[i] =
      originalData[indexFloor] * weight1 +
      originalData[indexCeil] * weight2;
  }

  return downsampled;
}




//call loadModel inside worker

loadModel();

async function processAudio(pcmArray, sampleRate) {
  if (!transcriber) {
    console.warn("Transcriber not ready yet");
    //return empty string
    return "";
  }

  try {
    const downsampled = downsample16k(pcmArray, sampleRate);
    const result = await transcriber(downsampled);
    return result.text;

  } catch (error) {
    console.error("Transcription error:", error);
    //return empty string on error
    return "";
  }
}



//receives request every 4 seconds
//main thread in audioEngine sends an audio recording to the worker
onmessage = async function (event) {

  const {array, sampleRate} = event.data;

  if (!(array instanceof Float32Array)) {
    return;
  }

  const text = await processAudio(array, sampleRate);

  postMessage({text});

}



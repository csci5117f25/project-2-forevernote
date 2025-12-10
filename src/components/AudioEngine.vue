<script setup>
import { watch, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isRecording: Boolean,
});

const emit = defineEmits(['newTranscript']);

watch(
  () => props.isRecording,
  (newVal) => {
    if (newVal == true) {
      initAudio();
    } else {
      //close buffer and resources
      stopAudio();
    }
  },
);

//add web audio variables here need to be strict
let audioContext = null;
let analyser = null;
let dataArray = null;
let bufferLength = null;
let stream = null;
//make the canvas reactive
let canvasRef = ref(null);
let canvas = null;
let ctx = null;
//microphone variables
let recorder = null;
let audioChunks = [];
//let allChunks = [];

//for webworker thread
let worker = null;

//for preventing overlapping Timeouts
//and for preventing microphone timeouts from going
//on longer than they should
let recordingInterval = null;

// for making a webworker (depends on whether the browser supports it or not)
if (window.Worker) {
  worker = new Worker(new URL('../worker.js', import.meta.url), {
    type: 'module',
  });
} else {
  console.error('your browser does not support web worker api!');
}

//only bother communicating with worker thread
//if a worker thread was made
if (worker) {
  worker.onmessage = (event) => {
    const { text } = event.data;
    console.log('Transcribed:', text);

    //emit transcript back to parent
    emit('newTranscript', event.data);
  };
}

//wait until DOM is loaded
onMounted(() => {
  canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
});

async function initAudio() {
  //this needs to be here to test if the browser supports web audio
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (error) {
    //send an alert to html
    console.log('Web audio api does not work on your browser, sorry', error);
    return;
  }

  if (audioContext !== undefined) {
    //get the audio device
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    source.connect(analyser);

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    recordAudio(stream);

    drawAudio();
  }
}

async function blobToPCM(blob, audioContext) {
  if (!blob || blob.size === 0) {
    //just return an empty PCM array
    return new Float32Array(0);
  }
  const arrayBuffer = await blob.arrayBuffer();
  //audioBuffer can fail depending on browser
  let audioBuffer;

  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error('failed to decode audio', error);
    return new Float32Array(0);
  }

  const pcm = audioBuffer.getChannelData(0);
  return pcm;
}

//https://stackoverflow.com/questions/51325136/record-5-seconds-segments-of-audio-using-mediarecorder-and-then-upload-to-the-se

async function recordAudio(stream) {
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  // pause recording for one small instance in time
  // to pass data to audio transcriber
  // before re-recording
  recorder.onstop = async () => {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });

    audioChunks.length = 0;

    //start recording immediately
    if (props.isRecording) {
      //start recording again
      recorder.start();
    }

    const pcm = await blobToPCM(blob, audioContext);
    //make thread safe duplicate
    const pcmCopy = new Float32Array(pcm.length);
    pcmCopy.set(pcm);
    //send to worker
    worker.postMessage(
      {
        array: pcmCopy,
        sampleRate: audioContext.sampleRate,
      },
      [pcmCopy.buffer],
    );
  };
  //initial recording before entering on/off loop
  recorder.start();

  recordingInterval = setInterval(() => {
    if (!props.isRecording) return;

    if (recorder.state === 'recording') {
      recorder.stop();
    }
  }, 3000);
}

function drawAudio() {
  requestAnimationFrame(drawAudio);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  //const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  //gradient.addColorStop(0, "#673ab7");
  //gradient.addColorStop(1, "#512da8");

  //ctx.fillStyle = gradient;
  //make it white
  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 3;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    // barHeight = Math.pow(dataArray[i] / 16, 2);

    // ctx.fillStyle = "rgb(215,255,255)";
    // ctx.fillRect(x, HEIGHT / 2 - barHeight, barWidth, barHeight * 2);
    barHeight = Math.pow(dataArray[i] / 8, 1.5);

    ctx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
    ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
    x += barWidth + 1;
  }
}

function stopAudio() {
  //clear whatever was inside previously
  if (recordingInterval) {
    clearInterval(recordingInterval);
    recordingInterval = null;
  }
  if (recorder && recorder.state != 'inactive') {
    //prevent restart
    recorder.onstop = null;
    recorder.stop();
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  const tracks = stream.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });
}

onUnmounted(() => {
  stopAudio();
  if (worker) {
    worker.terminate();
  }
});
</script>

<template>
  <div class="visualizer-wrapper">
    <canvas ref="canvasRef" width="600" height="400"></canvas>
  </div>
</template>

<style scoped>
.visualizer-wrapper {
  display: flex;
  justify-content: center;
}
</style>

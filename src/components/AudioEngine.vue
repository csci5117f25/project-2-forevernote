<script setup>

import { watch, defineProps, ref, onMounted } from 'vue'

//for removing worker threads when not in use
import { onUnmounted } from 'vue';



const props = defineProps({
  isRecording: Boolean,
  mode: String
})

const emit = defineEmits(['newTranscript'])


watch (() => props.isRecording, (newVal) => {
  if (newVal == true) {
    initAudio();

  }
  else{
    //close buffer and resources
    stopAudio();
  }
});

//second watch to prevent both online and private
//transcribers from running at the same time
watch(() => props.mode, () => {
  if (props.isRecording) {
    stopAudio();
    initAudio();
  }
});

//for google speech recognition
let recognition = null;

  //add web audio variables here need to be strict
let audioContext = null;
let analyser = null;
let dataArray = null;
let bufferLength = null;
let stream = null;
//make the canvas reactive
let canvasRef = ref(null);
let canvas =null;
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
  worker = new Worker(new URL("../worker.js", import.meta.url), {
    type: "module"
  });
}
else{
  console.error("your browser does not support web worker api!")
}

//only bother communicating with worker thread
//if a worker thread was made
if (worker){
  worker.onmessage = (event) => {
    const {text} = event.data;
    console.log("Transcribed:", text);

    //emit transcript back to parent
    emit('newTranscript', event.data);
  }

}


//wait until DOM is loaded
onMounted(() => {
  canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
});

//delete worker thread
onUnmounted(() => {
  stopAudio();
  if (worker) {
    worker.terminate();
  }

});

async function initAudio(){
  //this needs to be here to test if the browser supports web audio
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  catch (error) {
    //send an alert to html
    console.log("Web audio api does not work on your browser, sorry", error);
    return
  }


  if (audioContext !== undefined) {
  //get the audio device
     stream = await navigator.mediaDevices.getUserMedia({audio : true});
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    source.connect(analyser);

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    //pick the right transcriber first
    startTranscriber(stream);

    drawAudio();
  }

}

async function blobToPCM(blob) {

  if (!blob || blob.size === 0) {
    //just return an empty PCM array
    return new Float32Array(0);
  }
  const arrayBuffer = await blob.arrayBuffer();

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();

  const renderedBuffer = await offlineContext.startRendering();


  return renderedBuffer.getChannelData(0);
}

//function to manage transcribers
function startTranscriber(stream) {
  if (props.mode === "google") {
    googleSpeechRecognition();
  } else {
    recordAudio(stream);
  }

};

function googleSpeechRecognition(){
  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  //to continuallly write transcript
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const last = event.results[event.results.length - 1];
    const text = last[0].transcript.trim();

    emit("newTranscript", {text, isFinal: last.isFinal});

  };

  recognition.onerror = (event) => {
    console.error("Google Speech Error:", event.error);
    if (event.error === 'not-allowed' || event.error === 'audio-capture') {
       console.log("Microphone error!");
    }
  }

  recognition.onend = () => {
    if (props.isRecording) {
      recognition.start();
    }
  }
  recognition.start();
}

//prevent empty audio frames from ever entering
//the transcriber in the first place (moved from worker.js)
function measureDb(pcm) {
  let sum = 0;
  for (let i = 0; i < pcm.length; i++) {
    sum += pcm[i] * pcm[i];
  }
  const rms = Math.sqrt(sum / pcm.length);
  const db = 20 * Math.log10(rms + 1e-10);
  return db;
}


async function recordAudio(stream) {
  recorder = new MediaRecorder(stream);


  recorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  }
  // pause recording for one small instance in time
  // to pass data to audio transcriber
  // before re-recording
  recorder.onstop = async () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });

    audioChunks.length = 0;

    //start recording immediately
     if (props.isRecording) {
      //start recording again
     recorder.start();
     }

    const pcm = await blobToPCM(blob);
    const db = measureDb(pcm);

    if (db < -50) {
       console.log("dropping silent frame");
       return;
    }


    //make thread safe duplicate
    const pcmCopy = new Float32Array(pcm.length);
    pcmCopy.set(pcm);
    //send to worker
    worker.postMessage( {
      array: pcmCopy,
    sampleRate: 16000},
      [pcmCopy.buffer]
    );

  };
  //initial recording before entering on/off loop
  recorder.start();

  recordingInterval = setInterval(() => {
    if (!props.isRecording) return;

    if (recorder.state ==="recording") {
      recorder.stop();
    }
  }, 6000);
}

function drawAudio() {
   requestAnimationFrame(drawAudio);

  if (!analyser) return;


  analyser.getByteFrequencyData(dataArray);

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  //make it white
  ctx.fillStyle = "rgb(255,255,255)"
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 2;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {

    barHeight = Math.pow(dataArray[i]/8, 0.9);

    ctx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }

}

function stopAudio(){
  //stop google speech recognition
  if (recognition) {
    recognition.stop();
    recognition = null;
  }

  //clear whatever was inside previously
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null;
  }
  if (recorder && recorder.state !== "inactive") {
    //prevent restart
    recorder.onstop = null;
    recorder.stop();
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  if (stream) {
     const tracks = stream.getTracks();
    tracks.forEach((track) => {track.stop()});
    stream = null;
  }



};

</script>

<template>

<div class="visualizer-wrapper">
    <canvas ref="canvasRef" width="150" height="40"></canvas>
  </div>
</template>


<style scoped>

.visualizer-wrapper {
  display: flex;
  justify-content: center;
}
</style>

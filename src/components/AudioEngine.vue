<script setup>

import { watch, defineProps, ref, onMounted } from 'vue'
import { pipeline, env } from '@xenova/transformers';




const props = defineProps({
  isRecording: Boolean
})

watch (() => props.isRecording, (newVal) => {
  if (newVal == true) {
    initAudio();

  }
  else{
    //close buffer and resources
    stopAudio();
  }
});

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
let allChunks = [];


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
      "Xenova/whisper-tiny.en"
    );
    console.log("Model loaded.");
  } catch (err) {
    console.error("Error loading model:", err);
  }
}


//wait until DOM is loaded
onMounted(() => {
  canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
  loadModel();
});

async function initAudio(){
  //this needs to be here to test if the browser supports web audio
  try {
    audioContext = new  (window.AudioContext || window.webkitAudioContext)();

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

    recordAudio(stream);

    drawAudio();
  }

}



//https://stackoverflow.com/questions/51325136/record-5-seconds-segments-of-audio-using-mediarecorder-and-then-upload-to-the-se



async function recordAudio(stream) {
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  }

  recorder.onstop = () => {
     if (!props.isRecording) return;

     const blob = new Blob(audioChunks, { type: "audio/webm" });
     processAudio(blob);
     //clear buffer

     audioChunks.length = 0;
     recorder.start();
     //prevent a timeout from misfiring if recording is disabled and staying in a hanging state
      if (props.isRecording) {
      setTimeout(() => {if (!props.isRecording) return; recorder.stop();}, 4000);
       }
  }
  //initial recording before entering on/off loop

  recorder.start();
   if (props.isRecording) {
      setTimeout(() => {if (!props.isRecording) return; recorder.stop();}, 4000);
     }
}

function drawAudio() {
 /**  requestAnimationFrame(drawAudio);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  //const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  //gradient.addColorStop(0, "#673ab7");
  //gradient.addColorStop(1, "#512da8");

  //ctx.fillStyle = gradient;
  ctx.fillStyle = "rgb(0,0,0)"
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 3;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
   // barHeight = Math.pow(dataArray[i] / 16, 2);

   // ctx.fillStyle = "rgb(215,255,255)";
   // ctx.fillRect(x, HEIGHT / 2 - barHeight, barWidth, barHeight * 2);
    barHeight = Math.pow(dataArray[i]/8, 1.5);

    ctx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
    ctx.fillRect(x, HEIGHT - barHeight/ 2, barWidth, barHeight);
    x += barWidth + 1;
  }
    */
}


async function processAudio(audioChunk) {
  if (!transcriber) {
    console.warn("Transcriber not ready yet");
    return;
  }
  // The pipeline cannot read a Blob directly. It needs a URL.
  const audioUrl = URL.createObjectURL(audioChunk);
  try {
    const result = await transcriber(audioUrl);
    console.log("Transcription:", result.text);

    allChunks.push(result.text);
  } catch (error) {
    console.error("Transcription error:", error);
  } finally {
    //clean up
    setTimeout(() => URL.revokeObjectURL(audioUrl), 18000);
  }
}

function stopAudio(){
  if (recorder && recorder.state != "inactive") {
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



</script>

<template>

<div class="visualizer-wrapper">
    <canvas ref="canvasRef" width="600" height="400"></canvas>
  </div>
</template>

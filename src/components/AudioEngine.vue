<script setup>

import { watch, defineProps, ref, onMounted } from 'vue'

const props = defineProps({
  isRecording: Boolean
})

watch (() => props.isRecording, (newVal) => {
  if (newVal == true) {
    initAudio();

  }
  else{
    //close buffer and resources
  }
});

  //add web audio variables here need to be strict
let audioContext = null;
let analyser = null;
let dataArray = null;
let bufferLength = null;
//make the canvas reactive
let canvasRef = ref(null);
let canvas =null;
let ctx = null;

//wait until DOM is loaded
onMounted(() => {
  canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
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
    const stream = await navigator.mediaDevices.getUserMedia({audio : true});
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    source.connect(analyser);

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    drawAudio();

  }

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
  ctx.fillStyle = "rgb(0,0,0)"
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 3;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
   // barHeight = Math.pow(dataArray[i] / 16, 2);

   // ctx.fillStyle = "rgb(215,255,255)";
   // ctx.fillRect(x, HEIGHT / 2 - barHeight, barWidth, barHeight * 2);
    barHeight = dataArray[i]/2;

    ctx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
    ctx.fillRect(x, HEIGHT - barHeight/ 2, barWidth, barHeight);
    x += barWidth + 1;
  }
}



</script>

<template>

<div class="visualizer-wrapper">
    <canvas ref="canvasRef" width="600" height="400"></canvas>
  </div>
</template>

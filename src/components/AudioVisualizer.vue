<script setup>
import { onMounted, onUnmounted, ref} from 'vue'

import AudioEngine from '@/components/AudioEngine.vue'
import TypeWriter from '@/components/TypeWriter.vue'


//DOM element for canvas
const audioCanvas = ref(null);
const audio = ref(null);


const emit = defineEmits(['sendTranscript', 'toggleRecording'])


defineProps({
  transcript: String,
  isRecording: Boolean,
})

//local variable
const isSending = ref(false);



/*event handler that displays transcribed audio onto canvas
and emits the transcribed audio-text back up to parent
if disabled no text appears on canvas and nothing gets sent back to parent*/
const handleTranscribed = () => {
  isSending.value= !isSending.value;

  if (isSending.value) {
    emit('sendTranscript', 'lorem ipsum');
  }
}

const toggle = async () => {
  emit('toggleRecording');

  if (!audioContext) {
    //if no audioContext exists initialize one
    await initAudio();
  }
  else if (audioContext.state == "suspended") {
    await audioContext.resume;
  }
}

//resource: https://medium.com/@simphiwenkabinde.dev/creating-an-audio-visualizer-with-javascript-9287a1d91336

  //add web audio variables here need to be strict
let audioContext = null;
let analyser = null;
let dataArray = null;
let bufferLength = null;
let canvas = null;
let ctx = null;

onMounted(()=> {
  //access canvas only once it is safe to manipulate DOM elements
  canvas = audioCanvas.value;
  ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 500;
})




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


function closeAudio() {
  audioContext.close().then()


}
</script>

<template>
  <div class="audio-visuals">
        <canvas  ref="audioCanvas"></canvas>
        <AudioEngine :isRecording="isRecording" />

        <h2 v-if="isSending">{{ transcript }}</h2>

        <button @click="toggle">
          <span v-if="isRecording">

            Stop Recording</span>
          <span v-else>Start Recording</span>
        </button>

        <button @click="handleTranscribed">
          <span v-if="isSending"> Transcription Enabled</span>
          <span v-else>Transcription Disabled</span>

        </button>

  </div>
</template>


<style scoped>

</style>

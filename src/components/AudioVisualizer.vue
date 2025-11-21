<script setup>
import { onMounted, ref} from 'vue'

//vue model for toggling record button
const isRecording = defineModel('isRecording')
//DOM element
const audioCanvas = ref(null);

const isSending = ref(false);


//event handler for toggling record button
const toggle = ()=> {
  isRecording.value = !isRecording.value
}


defineProps({
  transcript: String,
})

const emit = defineEmits(['send'])

onMounted(()=> {
  //access canvas only once it is safe to manipulate DOM elements
  const canvas = audioCanvas.value;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red'
  ctx.fillRect(50, 50, 150, 150)

})

//event handler that displays transcribed audio onto canvas
//and emits the transcribed audio-text back up to parent
//if disabled no text appears on canvas and nothing gets sent back to parent
const handleTranscribed = () => {
  isSending.value= !isSending.value;

  if (isSending.value) {
    emit('send', 'lorem ipsum');
  }
}


</script>

<template>
  <div class="audio-visuals">

        <h2>Live Audio Transcription</h2>

        <canvas  ref="audioCanvas"></canvas>

        <h2 v-if="isSending">{{ transcript }}</h2>


        <button @click="toggle">
          <span v-if="isRecording">Stop Recording</span>
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

<script setup>
import { onMounted, ref} from 'vue'

//for toggling record button
const isRecording = defineModel('isRecording')
//DOM element for canvas
const audioCanvas = ref(null);
//for toggling transcription
const isSending = ref(false);

const emit = defineEmits(['send'])


defineProps({
  transcript: String,
})


//event handler for toggling record button
const toggle = ()=> {
  isRecording.value = !isRecording.value
}


onMounted(()=> {
  //access canvas only once it is safe to manipulate DOM elements
  const canvas = audioCanvas.value;
  const ctx = canvas.getContext('2d');

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

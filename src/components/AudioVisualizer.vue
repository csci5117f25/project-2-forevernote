<script setup>
import { onMounted, ref} from 'vue'

import AudioEngine from '@/components/AudioEngine.vue'
import TypeWriter from '@/components/TypeWriter.vue'


//DOM element for canvas
const audioCanvas = ref(null);


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

const toggle = () => {
  emit('toggleRecording');
}

onMounted(()=> {
  //access canvas only once it is safe to manipulate DOM elements
  const canvas = audioCanvas.value;
  const ctx = canvas.getContext('2d');

})



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

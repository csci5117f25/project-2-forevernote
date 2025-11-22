<script setup>
import { ref} from 'vue'

import AudioEngine from '@/components/AudioEngine.vue'
import TypeWriter from '@/components/TypeWriter.vue'


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

}

//resource: https://medium.com/@simphiwenkabinde.dev/creating-an-audio-visualizer-with-javascript-9287a1d9133

</script>

<template>
  <div class="audio-visuals">

        <AudioEngine :isRecording="isRecording" />

        <h2 v-if="isSending">{{ transcript }}</h2>

        <button @click="toggle">
          <span v-if="isRecording"> Stop Recording</span>
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

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import AudioEngine from '@/components/AudioEngine.vue';

const emit = defineEmits(['sendTranscript', 'toggleRecording']);

defineProps({
  transcript: String,
  isRecording: Boolean,
});

const isSending = ref(true);

const scrollComponent = ref(null);

const transcriptLines = ref([]);

/*event handler that displays transcribed audio onto canvas
and emits the transcribed audio-text back up to parent
if disabled no text appears on canvas and nothing gets sent back to parent*/
const handleTranscribed = (event) => {
  const element = scrollComponent.value;
  const text = event.text;

  //add to array
  transcriptLines.value.push(text);

  emit('sendTranscript', event.text);

  const bottom = element.scrollTop + element.clientHeight;
  const threshold = element.scrollHeight - 10;

  if (bottom >= threshold) {
    element.scrollTop = element.scrollHeight;
  }
};

const toggle = async () => {
  emit('toggleRecording');
};
/*event handlers for infinite scroll using vue lifecyclehooks
https://learnvue.co/articles/vue-infinite-scrolling
 */
const handleScroll = () => {
  const element = scrollComponent.value;

  if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
    console.log('bottom reached');
  }
};

onMounted(() => {
  scrollComponent.value.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  scrollComponent.value.removeEventListener('scroll', handleScroll);
});

//resource: https://medium.com/@simphiwenkabinde.dev/creating-an-audio-visualizer-with-javascript-9287a1d9133
</script>

<template>
  <div class="wrapper">
    <div class="audio-visuals">
      <AudioEngine :isRecording="isRecording" @newTranscript="handleTranscribed" />
    </div>

    <div ref="scrollComponent" class="transcript-box">
      <div v-for="(line, index) in transcriptLines" :key="index" class="transcriptLine">
        {{ line }}
      </div>
    </div>

    <div class="controls">
      <button @click="toggle">
        <span v-if="isRecording"> Stop Recording</span>
        <span v-else>Start Recording</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.transcript-box {
  height: 300px;
  width: 100%;
  max-width: 600px;
  overflow-y: auto;
}
.audio-visuals {
  display: flex;
  justify-content: center;
  width: 100%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  width: 100%;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

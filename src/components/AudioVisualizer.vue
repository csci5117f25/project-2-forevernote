<script setup>
const isRecording = defineModel('isRecording')   // maps to v-model:isRecording

function toggle() {
  isRecording.value = !isRecording.value
}
</script>

<template>
  <div class="audio-visuals">

        <h2>Live Audio Transcription</h2>

        <canvas class="visualizer"></canvas>

        <button @click="toggle">
          <span v-if="isRecording">Stop Recording</span>
          <span v-else>Start Recording</span>
        </button>

  </div>
</template>

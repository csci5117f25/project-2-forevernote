<script setup>

import { ref } from 'vue'
import AudioVisualizer from '@/components/AudioVisualizer.vue'

const isRecording = ref(false);
const transcript = ref('');

const handleSent = (text) => {
  transcript.value = text
}

const handleToggle = () => {
  isRecording.value = !isRecording.value;
}

</script>


<template>
  <header>

    <div class="card has-text-centered">

      <h2>This is the live audio transcription page</h2>
    </div>
  </header>

  <main>

    <div class="columns">
      <div class="column is-hidden-mobile is-one-fifths">
      </div>

      <div class="column is-full-mobile is-three-fifths">
        <section class="audio-visuals hero is-light is-fullheight">
          <div class="hero-body">
            <AudioVisualizer :isRecording="isRecording" :transcript="transcript" @toggle-recording="handleToggle"
              @send-transcript="handleSent" />

          </div>
        </section>

      </div>
      <div class="column is-hidden-mobile is-one-fifths">
      </div>
    </div>

  </main>

</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;


}

.hero {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card {

  min-height: 50px;
}
</style>

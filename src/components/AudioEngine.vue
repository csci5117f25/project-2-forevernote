<script setup>

import { watch, defineProps } from 'vue'

const props = defineProps({
  isRecording: Boolean
})

// This is the key part: Watch for changes in the prop
watch(() => props.isRecording, (newValue) => {
  if (newValue === true) {
    startMicrophone();
  } else {
    stopMicrophone();
  }
})

const startMicrophone = async () => {
  console.log("Microphone starting...")

}

const stopMicrophone = () => {
  console.log("Microphone stopping...")
}

</script>

<template>
<span><h2>Recording state from bottom most child: {{ isRecording }}</h2></span>

</template>

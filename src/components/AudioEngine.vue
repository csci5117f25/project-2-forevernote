<script setup>

import { watch, defineProps } from 'vue'

const props = defineProps({
  isRecording: Boolean
})

const plotFrequency = async () => {
  let stream =await navigator.mediaDevices.getUserMedia({
     audio: true,
   });

}


watch (() => props.isRecording, (newVal) => {
  if (newVal) {
    plotFrequency()
  }
  else{
    //close buffer and resources
  }



});

</script>

<template>
<span><h2>Recording state from bottom most child: {{ isRecording }}</h2></span>

</template>

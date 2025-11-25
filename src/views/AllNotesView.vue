<script setup> 
import AllNotes from '@/components/AllNotes.vue';
import { ref } from 'vue';
const user = ref('Joshua Cheng')
console.log(`Hello ${user.value} from DashboardView`)
</script>

<template>
    <AllNotes :user="user"></AllNotes>
</template>
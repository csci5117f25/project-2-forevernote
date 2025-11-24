<script setup>
import Dashboard from '@/components/DashboardComponent.vue';
import { ref } from 'vue';
const user = ref('Yaseen')
console.log(`Hello ${user.value} from DashboardView`)
</script>

<template>
  <Dashboard :user="user"></Dashboard>
</template>

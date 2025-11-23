<template>
  <svg
    :width="size"
    :height="size"
    viewBox="-5 -10 110 135"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
    :style="{ color }">
    <path
      d="m8.0625 25.801c-1.2148-1.207-3.1758-1.1992-4.3789 0.011719-1.2109 1.2109-1.2109 3.1719 0 4.3789l44.125 44.008c1.2109 1.2109 3.168 1.2109 4.3789 0l44.125-44.008h0.003906c1.207-1.207 1.207-3.168 0-4.3789-0.58203-0.58594-1.3711-0.91797-2.1953-0.91797-0.82422-0.003906-1.6172 0.32422-2.1992 0.90625l-41.941 41.824z"
      fill="currentColor"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  size: { type: [Number, String], default: 18 },
  className: { type: String, default: '' },
  color: { type: String, default: 'currentColor' }
})

const { size, className, color } = props
</script>

<style scoped>
.expand-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>

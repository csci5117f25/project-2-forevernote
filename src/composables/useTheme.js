import { ref, watch } from 'vue';
const isDark = ref(false);

export function useTheme() {
  const setLightMode = () => {
    isDark.value = false;
  };

  const setDarkMode = () => {
    isDark.value = true;
  };

  const toggle = () => {
    const isDarkMode = isDark.value;

    isDark.value = !isDarkMode;
  };

  watch(
    isDark,
    (newVal) => {
      document.documentElement.classList.toggle('dark', newVal);
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
    },
    { immediate: true },
  );

  return {
    setLightMode,
    setDarkMode,
    isDark,
    toggle,
  };
}

/**
 * 全局通知 composable
 */

import { ref } from "vue";

const toastRef = ref(null);

export function useToast() {
  function setRef(ref) {
    toastRef.value = ref;
  }

  function success(message, duration) {
    return toastRef.value?.success(message, duration);
  }

  function error(message, duration) {
    return toastRef.value?.error(message, duration);
  }

  function warning(message, duration) {
    return toastRef.value?.warning(message, duration);
  }

  function info(message, duration) {
    return toastRef.value?.info(message, duration);
  }

  return {
    setRef,
    success,
    error,
    warning,
    info,
  };
}

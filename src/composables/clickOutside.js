import { onMounted, onBeforeUnmount } from 'vue'

export function useClickOutside(el, callback) {
  if (!el) return

  const listener = (e) => {
    if (e.target === el.value || e.composedPath().includes(el.value)) return

    if (typeof callback === 'function') {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('click', listener)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener)
  })

  return {
    listener
  }
}

<template functional>
  <span
    :class="
      props.secondary ? 'bg-orange-100 dark:bg-orange-900 text-orange-500' : 'bg-primary-100 dark:bg-primary-900 text-primary-500'
    "
    class="inline-flex items-center px-3 py-1 leading-5 rounded-full text-base tracking-tight"
  >
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    secondary: { type: Boolean, default: false }
  }
}
</script>

<template functional>
  <span
    :class="`bg-${props.color}-100 dark:bg-${props.color}-900 text-${props.color}-500`"
    class="inline-flex items-center px-3 py-1 leading-5 rounded-full text-base tracking-tight"
  >
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    color: { type: String, default: 'primary' }
  }
}
</script>

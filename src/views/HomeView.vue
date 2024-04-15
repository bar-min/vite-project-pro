<script setup>
import AppAutocomplete from '@/components/Reusable/Fields/AppAutocomplete.vue'
</script>

<template>
  <main :class="$style.wrapper">
    <AppAutocomplete placeholder="Region" :list="['Red', 'Orange', 'Green', 'Yellow']" />
  </main>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  gap: 12px;
  max-width: 1200px;
  margin: 50px auto;
}
</style>

<script setup>
import AppAutocomplete from '@/components/Reusable/Fields/AppAutocomplete.vue'
import AppRoomField from '@/components/Reusable/Room/AppRoomField.vue'
</script>

<template>
  <main>
    <div :class="$style.wrapper">
      <AppAutocomplete placeholder="Region (all)" :list="['Red', 'Orange', 'Green', 'Yellow']" />
      <AppAutocomplete placeholder="City (all)" :list="['Red', 'Orange', 'Green', 'Yellow']" />
      <AppAutocomplete placeholder="Hotel (all)" :list="['Red', 'Orange', 'Green', 'Yellow']" />
      <AppRoomField />
    </div>
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

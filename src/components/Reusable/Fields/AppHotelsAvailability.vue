<script setup>
import AppIcon from '../AppIcon.vue'
</script>

<template>
  <div class="hotels-availability">
    <button class="hotels-availability-btn">Hotels Availability</button>

    <div class="hotels-availability-angle">
      <AppIcon name="angle" color="grey" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hotels-availability {
  position: relative;
}

.hotels-availability-btn {
  cursor: pointer;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  background-color: #05ff0563;
  padding: 10px 25px 10px 10px;
  max-height: 40px;
  width: 100%;
}

.hotels-availability-angle {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 5px;
  width: 20px;
  height: 20px;
  transform: translateY(-50%);
}
</style>

<script setup>
import { ref, computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import AppIcon from '../AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: [Array, null],
    required: true
  },
  datesRange: {
    type: Object,
    default: () => {}
  },
  isValid: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const date = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const datepicker = ref(null)

function formatDate(date, raw = false) {
  if (!date?.length) return
  const dates = date.map((el) => {
    const intl = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long'
    })

    return intl.format(el)
  })

  if (raw) {
    return dates
  }

  return dates.join(' - ')
}

function getDiffDays(date) {
  if (!date || date?.length < 2) return
  const timeDiff = Math.abs(date[1].getTime() - date[0].getTime())
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return `(${diffDays}-night stay)`
}

function clearValues() {
  if (datepicker.value) {
    datepicker.value.clearValue()
    datepicker.value.openMenu()
  }
}

function closeDatepicker() {
  if (datepicker.value) {
    datepicker.value.selectDate()
  }
}
</script>

<template>
  <div class="datepicker">
    <VueDatePicker
      class="picker"
      :class="{ invalid: !isValid }"
      ref="datepicker"
      v-model="date"
      range
      multi-calendars
      :start-date="datesRange.from"
      :min-date="datesRange.from"
      :max-date="datesRange.to"
      :hide-offset-dates="true"
      placeholder="Select range"
      month-name-format="long"
      :enable-time-picker="false"
      :prevent-min-max-navigation="true"
      :clearable="false"
      @closed="closeDatepicker"
    >
      <template #action-row="{ selectDate, closePicker, internalModelValue }">
        <p class="current-selection">
          {{ formatDate(internalModelValue) }} {{ getDiffDays(internalModelValue) }}
        </p>

        <div class="current-selection-mobile" v-if="formatDate(internalModelValue, true)?.length">
          <p>{{ formatDate(internalModelValue, true)[0] }} -</p>
          <p>{{ formatDate(internalModelValue, true)[1] }}</p>
          <span>{{ getDiffDays(internalModelValue) }}</span>
        </div>

        <div class="action-buttons">
          <button class="clear-button" @click="clearValues">Clear</button>
          <button class="select-button" @click="((e) => selectDate(e), closePicker)">Done</button>
        </div>
      </template>
    </VueDatePicker>

    <div class="datepicker-angle" @click="datepicker.openMenu()">
      <AppIcon name="angle" color="grey" />
    </div>
  </div>
</template>

<style lang="scss">
.datepicker {
  position: relative;
  max-width: 300px;
}

.datepicker-angle {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

.current-selection {
  @media (max-width: 600px) {
    display: none;
  }
}

.current-selection-mobile {
  display: none;
  font-size: 12px;

  @media (max-width: 600px) {
    display: block;
  }
}

.invalid .dp__input {
  border-color: red;
}

.dp__menu {
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
}

.dp__outer_menu_wrap {
  @media (max-width: 415px) {
    max-width: 270px;
  }
}

.dp__month_year_wrap {
  justify-content: center;
}

.action-row {
  display: flex;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex: 0;
  white-space: nowrap;
  align-items: center;
  justify-content: flex-end;
  margin-inline-start: auto;
}

.clear-button {
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 5px 10px;
  background-color: hsla(0, 0%, 11%, 0.4);
  color: white;
}

.select-button {
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 11%, 0.2);
  border-radius: 4px;
  padding: 5px 10px;
  background-color: #ff7715;
  color: white;
}

.dp__theme_dark {
  --dp-background-color: #212121;
  --dp-text-color: #fff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #005cb2;
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-marker-color: #e53935;
  --dp-tooltip-color: #3e3e3e;
  --dp-highlight-color: rgb(0 92 178 / 20%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
  --dp-range-between-border-color: var(--dp-hover-color, #fff);
}

.dp__theme_light {
  --dp-background-color: #fff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #ff7715;
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}

.picker {
  /*Sizing*/
  --dp-button-height: 35px; /*Size for buttons in overlays*/
  --dp-month-year-row-height: 35px; /*Height of the month-year select row*/
  --dp-month-year-row-button-size: 35px; /*Specific height for the next/previous buttons*/
  --dp-button-icon-height: 20px; /*Icon sizing in buttons*/
  --dp-cell-size: 35px; /*Width and height of calendar cell*/
  --dp-cell-padding: 5px; /*Padding in the cell*/
  --dp-common-padding: 10px; /*Common padding used*/
  --dp-input-icon-padding: 35px; /*Padding on the left side of the input if icon is present*/
  --dp-input-padding: 10px 30px 10px 12px; /*Padding in the input*/
  --dp-menu-min-width: 260px; /*Adjust the min width of the menu*/
  --dp-action-buttons-padding: 2px 5px; /*Adjust padding for the action buttons in action row*/
  --dp-row-margin: 5px 0; /*Adjust the spacing between rows in the calendar*/
  --dp-calendar-header-cell-padding: 0.5rem; /*Adjust padding in calendar header cells*/
  --dp-two-calendars-spacing: 10px; /*Space between multiple calendars*/
  --dp-overlay-col-padding: 3px; /*Padding in the overlay column*/
  --dp-time-inc-dec-button-size: 32px; /*Sizing for arrow buttons in the time picker*/
  --dp-menu-padding: 6px 8px; /*Menu padding*/

  /*Font sizes*/
  --dp-font-size: 1rem; /*Default font-size*/
  --dp-preview-font-size: 0.8rem; /*Font size of the date preview in the action row*/
  --dp-time-font-size: 0.8rem; /*Font size in the time picker*/

  /*Transitions*/
  --dp-animation-duration: 0.1s; /*Transition duration*/
  --dp-menu-appear-transition-timing: cubic-bezier(
    0.4,
    0,
    1,
    1
  ); /*Timing on menu appear animation*/
  --dp-transition-timing: ease-out; /*Timing on slide animations*/
}
</style>

<script setup lang="ts">
import { PropType } from "vue";

const rows = Array.from({ length: 10 }, (_, index) => index + 1);
const cols = Array.from({ length: 10 }, (_, index) => index + 1);
const props = defineProps({
  firedCoords: {
    type: Array as PropType<{ x: number; y: number }[]>,
    required: true,
  },
});
const emit = defineEmits(["fire"]);

function coordIsHit(x: number, y: number) {
  return props.firedCoords.some((coords) => coords.x === x && coords.y === y);
}
</script>

<template>
  <h2>Board</h2>
  <div class="grid grid-cols-10">
    <div v-for="(_, row) in rows" :key="row">
      <div v-for="(_, col) in cols" :key="col" :class="`border border-gray-500 h-8 w-8 flex items-center justify-center text-white font-bold ${coordIsHit(col, row) ? 'bg-red-500' : 'bg-blue-500'
        }`" @click="$emit('fire', { x: col, y: row })">
        {{ String.fromCharCode(65 + col) }}{{ row + 1 }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

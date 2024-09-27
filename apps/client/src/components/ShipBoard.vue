<script setup lang="ts">
import { PropType } from "vue";

const rows = Array.from({ length: 10 }, (_, index) => index + 1);
const cols = Array.from({ length: 10 }, (_, index) => index + 1);

const props = defineProps({
  firedCoords: {
    type: Array as PropType<{ x: number; y: number }[]>,
    required: true,
  },
  ships: {
    type: Array as PropType<{ position: { start: { x: number; y: number }; end: { x: number; y: number } }; length: number }[]>,
    required: true,
  },
});
const emit = defineEmits(["fire"]);

function coordContainsAShipPart(x: number, y: number) {
  return props.ships.some((ship) => {
    const { start, end } = ship.position;
    if (start.x === end.x) {
      return x === start.x && y >= start.y && y <= end.y;
    }
    return y === start.y && x >= start.x && x <= end.x;
  });

}

function shipPartIsHit(x: number, y: number) {
  return props.firedCoords.some((coords) => coords.x === x && coords.y === y);
}
</script>

<template>
  <h2>Board</h2>
  <div class="flex">
    <div class="flex flex-col">
      <div class="h-8 w-8 flex items-center justify-center" v-for="number in 11">{{ number > 1 ? String.fromCharCode(64
        +
        number) : '' }}
      </div>
    </div>
    <div class="grid grid-cols-10">
      <div class="h-8 w-8 flex items-center justify-center" v-for="index in 10">{{ index }}</div>
      <div v-for="(_, row) in rows" :key="row">
        <div v-for="(_, col) in cols" :key="col" :class="`border border-gray-500 h-8 w-8 flex items-center justify-center text-white font-bold ${shipPartIsHit(col, row) ? 'bg-red-500' : coordContainsAShipPart(col, row) ? 'bg-gray-500' : 'bg-blue-500'
          }`" @click="$emit('fire', { x: col, y: row })">
          {{ String.fromCharCode(65 + col) }}{{ row + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

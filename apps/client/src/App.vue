<script setup lang="ts">
import { setup } from './utils/socket';
import Board from './components/Board.vue';
import { IncomingEvent, OutgoingEvent } from './enums/Event';
import { ref } from 'vue';

const firedCoordsList = ref<{ x: number; y: number }[]>([]);

const GAME_ID = 1;

const { sendMessage } = setup({ onEvent, onConnected });

function onConnected() {
  sendMessage(OutgoingEvent.Join, { gameId: GAME_ID });
}

function onEvent(type: IncomingEvent, payload: { x: number, y: number }) {
  if (type === IncomingEvent.PlayerFired) {
    firedCoordsList.value = [...firedCoordsList.value, payload];
  }
}

</script>

<template>
  <div>
    <Board @fire="(coords) => sendMessage(OutgoingEvent.Fire, coords)" :fired-coords="firedCoordsList" />
  </div>
</template>

<script setup lang="ts">
import { setup } from './utils/socket';
import Board from './components/Board.vue';
import { IncomingEvent, OutgoingEvent } from './enums/Event';
import { ref } from 'vue';
import ShipBoard from './components/ShipBoard.vue';

const outgoingFiredCoordsList = ref<{ x: number; y: number, hit: boolean }[]>([]);
const inComingFiredCoordsList = ref<{ x: number; y: number }[]>([]);

const GAME_ID = 1;

const SHIPS = [{
  position: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 2 },
  },
  length: 2,
}];

const { sendMessage } = setup({ onEvent, onConnected });

function onConnected() {
  sendMessage(OutgoingEvent.Join, { gameId: GAME_ID });
  sendMessage(OutgoingEvent.Ready, { ships: SHIPS });
}

function onEvent(type: IncomingEvent, payload: any) {
  if (type === IncomingEvent.PlayerFired) {
    inComingFiredCoordsList.value = [...inComingFiredCoordsList.value, payload];
  }
  if (type === IncomingEvent.Result) {
    console.log({ payload })
    outgoingFiredCoordsList.value = [...outgoingFiredCoordsList.value, payload];
  }
}

function onFire(coords: { x: number; y: number }) {
  sendMessage(OutgoingEvent.Fire, coords);
}

</script>

<template>
  <div>
    <Board @fire="onFire" :fired-coords="outgoingFiredCoordsList" />
    <ShipBoard :fired-coords="inComingFiredCoordsList" :ships="SHIPS" />
  </div>
</template>

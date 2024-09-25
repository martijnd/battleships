<script setup lang="ts">
import { ref } from 'vue';
import { setup } from './utils/socket';

const message = ref('');
const received = ref('');
const { sendMessage } = setup({ onMessage });

function onMessage(message: string) {
  console.log('Received message:', message);
  received.value = message;
}

function onSubmit() {
  sendMessage(message.value);
  message.value = '';
}

</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <h2>Received: {{ received }}</h2>
      <input type="text" v-model="message">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { setup } from './utils/socket';

const message = ref('');
const { sendMessage } = setup({ onMessage });

function onMessage(message: string) {
  console.log('Received message:', message);
}

function onSubmit() {
  sendMessage(message.value);
  message.value = '';
}

</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="message">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

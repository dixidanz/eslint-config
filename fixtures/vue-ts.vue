<script setup lang="ts">
// Define reactive data and props
import { ref } from 'vue'

const greeting = ref('Hello, Vue 3!')
const counter = ref<number | 1>(0)

// Define a function
const incrementCounter = () => {
  counter.value++
}
</script>

<template>
  <div>
    <h1
      class="text-sm"
      style="color: red">
      {{ greeting }}
    </h1>
    <button @click="incrementCounter">
      Click me!
    </button>
    <p>Counter: {{ counter }}</p>
    <!-- <MyComponent :foo="foo" /> -->
  </div>
  <my-component v-slot="data">
    {{ data }}
  </my-component>
  <my-component>
    <template #default>
      content
    </template>
    <template #one>
      content
    </template>
    <template #two>
      content
    </template>
  </my-component>
</template>

<style>
.a {  color:   red }
</style>

<style lang="scss">
$font-stack: Helvetica, sans-serif;
$primary-color:   #333;

body { font: 100% $font-stack;
  color: $primary-color;
}
</style>

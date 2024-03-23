<template>
  <div class="about">
    <h1>This is an about page</h1>

    <vz-button></vz-button>
  </div>
</template>

<script lang="ts" setup>
import type { VzButtonProps } from "viaz";

const abc: VzButtonProps = {
  text: "xxx",
  msg: "aaa",
};

console.info("abc =>", abc);
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

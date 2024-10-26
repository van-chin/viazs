import { VzButton } from 'viaz';
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <vz-button msg="aaa" :text="1"></vz-button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

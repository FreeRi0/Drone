<template>
  <div>
    <canvas></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import BasicScene  from "../babylon/basicScene";

export default defineComponent({
  name: "IndexPage",
  setup() {
    return {};
  },
 async mounted() {

    const canvas = document.querySelector("canvas")!;
    const scene = new BasicScene(canvas);
    // const scene =  await basic.CreateScene();
  },
});
</script>

<style lang="scss">
canvas {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  border: none;
  outline: none;
  box-shadow: 8px 8px 10px -6px #000000;
}
</style>

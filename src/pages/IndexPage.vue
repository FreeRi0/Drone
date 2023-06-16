<template>
  <div>
    <canvas></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { BasicScene } from "../babylon/basicScene";

export default defineComponent({
  name: "IndexPage",
  setup() {
    return {};
  },
 async mounted() {

    const canvas = document.querySelector("canvas")!;
    const basic = new BasicScene(canvas);
    const scene =  await basic.CreateScene();
    console.log(scene);
  },
});
</script>

<style lang="scss">
canvas {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  box-shadow: 8px 8px 10px -6px #000000;
}
</style>

<template>
  <div ref="mathjax">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMathJax } from "./mathjax";

const mathjax = ref<HTMLElement>();
useMathJax(mathjax);
</script>

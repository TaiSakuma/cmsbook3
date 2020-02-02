<template>
  <div class="redirect">
    <v-container>
      <p>redirecting..</p>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "redirect",
  beforeCreate() {
    const pathTop = "http://localhost/~sakuma/cmsbook";
    const path = pathTop + this.$route.path;
    window.location = path;
  }
};
</script>

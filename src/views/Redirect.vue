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
    let path = import.meta.env.VITE_CMSBOOK_URL;
    path = path + this.$route.path;
    window.location = path;
  },
};
</script>

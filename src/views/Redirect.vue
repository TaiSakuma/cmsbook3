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
    let path = process.env.VUE_APP_CMSBOOK_URL;
    path = path + this.$route.path;
    window.location = path;
  }
};
</script>

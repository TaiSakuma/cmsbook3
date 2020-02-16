<template>
  <div class="home"></div>
</template>

<script>
import axios from "axios";
import router from "../router/index.js";

export default {
  name: "home",
  created: function() {
    this.redirectToDefaultPage();
  },
  methods: {
    redirectToDefaultPage() {
      const cmsbookUrl = process.env.VUE_APP_CMSBOOK_URL;
      const configUrl = cmsbookUrl + "/.cmsbook3/home.json";
      const defaultHome = "index/web.md";
      let path = this.$route.path + defaultHome;
      axios
        .get(configUrl)
        .then(response => {
          if (response.data.home) {
            path = this.$route.path + response.data.home;
          }
        })
        .then(() => {
          router.push(path);
        });
    }
  }
};
</script>

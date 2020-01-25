<template>
  <div class="page">
    <v-container>
      <p>Page</p>
      <p>{{ $route.params.chapter }}</p>
      <p>{{ $route.params.section }}</p>
      <p>{{ $route.params.page }}</p>
      <div>
        <VueShowdown :markdown="markdown" flavor="github"></VueShowdown>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { VueShowdown } from "vue-showdown";

export default {
  name: "page",
  components: {
    VueShowdown
  },
  data() {
    return {
      markdown: ""
    };
  },
  created: function() {
    this.loadData();
  },
  methods: {
    loadData() {
      const pathTop =
        "http://localhost/~sakuma/cmsbook/help/s0000_index_001/log.md";
      const path = pathTop;
      axios.get(path).then(response => {
        this.markdown = response.data;
      });
    }
  }
};
</script>

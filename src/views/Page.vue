<template>
  <div class="page">
    <v-container>
      <p>Page</p>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "page",
  data() {
    return {
      headers: [],
      items: [],
      shows: {}
    };
  },
  computed: {
    showsAny: {
      get: function() {
        return Object.keys(this.shows).some(i => this.shows[i]);
      },
      set: function(v) {
        for (const k in this.shows) {
          this.shows[k] = v;
        }
      }
    }
  },
  created: function() {
    this.loadData();
  },
  methods: {
    loadData() {
      const path = "http://localhost:5000/maps";
      axios.get(path).then(response => {
        this.headers = response.data.schema.fields.map(f => ({
          text: f.name,
          value: f.name
        }));
        this.items = response.data.data;
        this.items.sort((a, b) => (a.date_posted > b.date_posted ? -1 : 1));
        this.shows = this.items.reduce((obj, x) => ({ ...obj, [x.id]: false }), {});
      });
    },
  }
};
</script>

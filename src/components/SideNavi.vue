<template>
  <v-card flat>
    <v-toolbar flat>
          <v-toolbar-title v-text="$route.params.chapter"></v-toolbar-title>      
    </v-toolbar>
    <v-list>
      <v-list-item link router v-for="page in pages" :key="page.path" :to="page.path">
        <v-list-item-action>
          <v-icon >mdi-book-open</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="page.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <p>{{ $route.path }}</p>
  </v-card>
</template>

<script>
export default {
  name: "SideNavi",
  data: () => ({
    pages: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Page", path: "/page" },
      { name: "log", path: "/help/s0000_index_001/log" }
    ]
  })
};
</script>

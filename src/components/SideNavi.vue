<template>
  <v-card flat>
    <v-toolbar flat>
          <v-toolbar-title v-text="$route.params.chapter"></v-toolbar-title>      
    </v-toolbar>
    <v-list>
      <v-list-item link router v-for="page in pages" :key="page.path" :to="page.path">
        <v-list-item-action>
          <v-icon v-text="page.icon"></v-icon>
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
      { name: "Home", icon: "mdi-book-open", path: "/" },
      { name: "About", icon: "mdi-information", path: "/about" },
      { name: "Page", icon: "mdi-book-open", path: "/page" },
      { name: "log", icon: "mdi-book-open", path: "/help/s0000_index_001/log" }
    ]
  })
};
</script>

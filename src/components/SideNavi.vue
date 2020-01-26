<template>
  <v-card flat>
    <v-toolbar flat>
          <v-toolbar-title v-text="$route.params.chapter"></v-toolbar-title>      
    </v-toolbar>
    <v-list>
      <v-list-item link router v-for="page in pages" :key="page.title" :to="page.to">
        <v-list-item-action>
          <v-icon v-text="page.icon"></v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="page.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "SideNavi",
  data: () => ({
    pages: [
      { title: "Home", icon: "mdi-book-open", to: "/" },
      { title: "About", icon: "mdi-information", to: "/about" },
      { title: "Page", icon: "mdi-book-open", to: "/page" },
      { title: "log", icon: "mdi-book-open", to: "/help/s0000_index_001/log" }
    ]
  })
};
</script>
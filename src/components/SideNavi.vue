<template>
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
</template>

<script>
export default {
  name: "SideNavi",
  data: () => ({
      pages: [
          {title: "Home", icon: "mdi-book-open", to: "/"},
          {title: "About", icon: "mdi-information", to: "/about"}
      ]
  })
};
</script>
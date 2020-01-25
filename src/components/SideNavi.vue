<template>
  <v-list>
    <v-list-item link router :to="'/'">
      <v-list-item-action>
        <v-icon>mdi-book-open</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item link router :to="'/about'">
      <v-list-item-action>
        <v-icon>mdi-information</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>About</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "SideNavi",
  data: () => ({})
};
</script>
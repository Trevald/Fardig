<template>
  <div class="app-shortcuts">
    <ul class="no-style">
      <li
        v-for="shortcut in shortcuts"
        :key="shortcut.id"
      >
        <span>{{shortcut.description}}</span>
        <span>{{getOptionShortcut(shortcut)}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// import commands from "./../commands/default-commands";

export default {
  name: "AppShortcuts",

  computed: {
    shortcuts() {
      return this.$genie.commands.filter(
        (command) => command.shortcut !== undefined
      );
    },
  },

  methods: {
    getOptionShortcut(option) {
      if (option.shortcut === undefined) {
        return "";
      }

      var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      let metaKey = isMacLike ? "⌘" : "⊞ Win";

      return option.shortcut
        .replace("+", " + ")
        .replace("ctrl", "^")
        .replace("meta", metaKey);
    },
  },
};
</script>

<style scoped>
.app-shortcuts {
  position: fixed;
  bottom: 2rem;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
}

.app-shortcuts li {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto;
  column-gap: 1rem;
}

.app-shortcuts li:not(:last-child) {
  margin-bottom: 1rem;
}

.app-shortcuts li span:first-child {
  grid-column: 1;
}

.app-shortcuts li span:last-child {
  grid-column: 2;
}
</style>
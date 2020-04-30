<template>
    <div id="app" class="container">
        <header class="app-header">
            <AppLogo />
        </header>
        <AppEditor />
    </div>
</template>

<script>

import AppEditor from './components/AppEditor.vue'
import AppLogo from './components/AppLogo.vue'

export default {
  name: 'App',

  components: {
    AppEditor,
    AppLogo
  }
}
</script>

<style>

</style>

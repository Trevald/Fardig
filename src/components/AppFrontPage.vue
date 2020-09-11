<template>
  <div class="page-front">
    <header>
      <AppLogo size="large" />
    </header>

    <section>
      <h2>Turn notes with action points into a todo list</h2>
      <img src="./../assets/front-docs-todo.svg">
    </section>

    <section>
      <h2>Minimized GUI – Cmd/Win + p for control</h2>
      <div class="app-command">
        <input
          type="text"
          class="app-command-input"
          placeholder="Your wish..."
        />
        <ul class="app-command-results no-style">
          <li>
            <button
              type="button"
              class="option no-style"
            >
              <span class="title">
                <AppIcon :svg="iconNew" /> New
              </span>
              <span class="shortcut"></span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="option no-style"
            >
              <span class="title">
                <AppIcon :svg="iconSun" /> Switch to light mode
              </span>
              <span class="shortcut"></span>
            </button>
          </li>
        </ul>
        <h4 class="app-command-results-heading no-style">3 of 21 files</h4>
        <ul class="app-command-results no-style">
          <li>
            <button
              type="button"
              class="option no-style"
            >
              <span class="title">
                <AppIcon :svg="iconDocument" />
                Insights from visit
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="option no-style"
            >
              <span class="title">
                <AppIcon :svg="iconDocument" />
                Meeting with HQ
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              class="option no-style"
            >
              <span class="title">
                <AppIcon :svg="iconDocument" />
                Questions from workshop
              </span>
            </button>
          </li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Own your data</h2>
      <p>Connect with the cloud of your choice (ATM only Dropbox). We provide you with a GUI for Markdown and Plain Text. Your data never touches our server.</p>
    </section>

    <section>
      <h2>Also…</h2>
      <p>Tags, dark/light mode and a lot more on the todo list. Feel free to contribute in any way you’ld like: <a
          target="github"
          href="https://github.com/Trevald/Fardig"
        >https://github.com/Trevald/Fardig</a></p>
    </section>

    <section>
      <p>Made by Benjamin Holfve <a
          href="https://twitter.com/trevald"
          target="twitter"
        >@trevald</a></p>
    </section>

    <div class="app-login-wrapper">
      <AppLogin />
    </div>

  </div>
</template>

<script>
import AppIcon from "./AppIcon";
import AppLogin from "./AppLogin";
import AppLogo from "./AppLogo";

export default {
  name: "AppFrontPage",

  components: {
    AppIcon,
    AppLogin,
    AppLogo,
  },

  data() {
    return {
      iconNew:
        '<path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"></path>',
      iconSun:
        '<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>',
      iconDocument:
        '<path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path>',
    };
  },
};
</script>

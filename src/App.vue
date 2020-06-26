<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import './_variables.scss';
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;300;400;500;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  button, input[type='submit'], select {
    cursor: pointer;
  }

  *::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto Mono', monospace;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  #app {
    width: 800px;
    margin: 0 auto;
    padding: 85px 0 0 0;
  }

  #nav {
    margin: 0 auto;
    text-align: center;
  }

  @media (max-width: 820px) {
    #app {
      width: 630px;
    }
  }

  @media (max-width: 640px) {
    #app {
      width: 90%;
    }
  }

  @media (max-width: 500px) {
    #app {
      width: calc(100% - 10px);
      padding: 80px 5px 5px 5px;
    }
  }
</style>

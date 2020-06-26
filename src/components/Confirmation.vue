<template>
<div class="confirmationBlockWrapper">
  <div class="confirmationBlock">
    <h3>{{message}}</h3>
    <div>
      <router-link :to="'/'">
        <button @click="$emit('confirm')">Yes</button>
      </router-link>
      <button @click="$emit('abort')">No</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Confirmation',
  // message - текст сообщения в окне подтверждения операции
  props: ['message']
}
</script>

<style lang="scss" scoped>
  @import '../_mixins.scss';

  .confirmationBlockWrapper {
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, .9);
    display: flex;
    justify-content: center;
    align-items: center;

    .confirmationBlock {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 300px;
      height: 100px;
      padding: 10px;
      background-color: #fff;
      box-shadow: 0 2px 5px 0 #ccc;
      border-radius: 10px;
      text-align: center;

      h3 {
        @include Roboto(12px, 300);
        margin-bottom: 10px;
      }

      button {
        @include noborder;
        background-color: transparent;
        text-transform: uppercase;

        &:nth-child(1) {
          margin-right: 10px;
          @include btn($decline);
        }

        &:nth-child(2) {
          @include btn($accept);
        }
      }
    }
  }
</style>

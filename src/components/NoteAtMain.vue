<template>
  <li class="note" :class="`${note.typeOfNote}Note`">
    <h2 class="noteHeader">{{ note.noteHeader }}</h2>
    <ul>
      <TodoItem v-for="(todo, index) of note.todos" v-if="index < 2" :todo="todo" :noteId="note.noteId" :key="todo.todoId" :type="'home'" />
      <span class="todosPlaceholder" v-if="note.todos.length === 0">no todos in this note</span>
    </ul>
    <button @click.prevent="showConfirmation" class="removeNoteBtn" title="Remove this note"><font-awesome-icon icon="trash-alt" /></button>
  </li>
</template>

<script>
  import TodoItem from '@/components/TodoItem.vue';

  export default {
    name: 'NoteAtMain',
    components: {
      TodoItem,
    },
    // note - объект текущей заметки
    props: ['note'],
    methods: {
      // Метод для удаления заметки по ее id. Вызывает мутацию store 'removeNote'. id - string. id удаляемой заметки
      removeNote(id) {
        this.$store.commit('removeNote', id);
      },
      // Метод для переключения параметра showConfirmationForDelete, для отображения окна подтверждения удаления заметки
      // Передает в свойство родителя родителя deletingNoteId id удаляемой заметки, для использования в качестве аргумента
      // при вызове метода removeNote
      showConfirmation() {
        this.$parent.$parent.showConfirmationForDelete = true;
        this.$parent.$parent.deletingNoteId = this.note.noteId;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../_mixins.scss';

  .note {
    position: relative;
    list-style: none;
    background-color: rgb(250, 250, 250);
    padding: 10px;
    padding-right: 30px;
    box-sizing: border-box;
    border-radius: 5px;
    border-top-right-radius : 5px;
    border-bottom-right-radius: 5px;
    box-shadow: 0 1px 3px 1px #ccc;
    margin-bottom: 10px;
    transition: background .3s;
    border-left-width: 10px;
    border-left-style: solid;
    transition: background .3s, filter .3s, transform .1s;

    &:active {
      transform: scale(.995) translateY(2px);
    }

    &.done {
      filter: opacity(.15);

      &:hover {
        filter: opacity(.5) brightness(1);
      }
    }

    .noteHeader {
      @include Roboto(14px, 400);
      margin: 0;
      margin-bottom: 5px;
      color: #333;
    }

    @media (max-width: 640px) {
      .noteHeader {
        font-size: 12px;
        margin-bottom: 5px;
      }
    }

    ul {
      padding-left: 10px;

      .todosPlaceholder {
        @include Roboto(12px, 300);
        color: #aaa;
        margin-left: 30px;
      }

      @media (max-width: 820px) {
        .todosPlaceholder {
          margin-left: 15px;
        }
      }
    }

    @media (max-width: 500px) {
      ul {
        padding-left: 5px;
      }
    }

    .removeNoteBtn {
      @include Roboto(12px, 400);
      @include noborder;
      position: absolute;
      height: 20px;
      top: calc(50% - 10px);
      background-color: transparent;
      transition: transform .3s;
      color: rgba(0, 0, 0, .5);

      &:hover {
        transform: scale(1.15);
      }
    }

    @media (max-width: 640px) {
      .removeNoteBtn {
        font-size: 10px;
      }
    }

    .removeNoteBtn {
      right: 20px;
    }

    .editNoteBtn {
      right: 40px;
    }
  }

  @media (max-width: 640px) {
      .note {
        padding: 5px 30px 5px 5px
      }
    }

  .workNote {
    border-left-color: transparentize($work, .3);

    &:hover {
      background:  transparentize($work, .9);
    }
  }

  .personalNote {
    border-left-color: transparentize($personal, .3);

    &:hover {
      background:transparentize($personal, .9);
    }
  }

  .importantNote {
    border-left-color: transparentize($important, .3);

    &:hover {
      background: transparentize($important, .9);
    }
  }

  .defaultNote {
    border-left-color: transparentize($default, .3);

    &:hover {
      background: transparentize($default, .9);
    }
  }
</style>

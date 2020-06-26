<template>
  <div class="wrapper">
    <div class="addNoteBlock">
      <button class="clsBtn" @click="toggleVisibleAddnote">back</button>
      <form @submit.prevent="addNote">
        <p class="description">
          Print name for your note, add todos, choose type of note (default, personal, work, important) and press 'Save'
        </p>
        <input type="text" id="" placeholder="Note name" class="noteNameInput" v-model="noteName">
        <fieldset class="todoInputWrapper">
          <input class="todoInput" type="text" id="" placeholder="Todo" v-model="currentTodo">
          <button @click.prevent="addTodo" @keyup.enter="addTodo" class="todoAdderBtn">+</button>
        </fieldset>
        <div class="typeOfNoteWrapper">
          <div class="typeOfNoteItemWrapper">
            <input type="radio" name="typeOfNote" id="personalNote" value="personal" v-model="typeOfNote">
            <label for="personalNote"><span>personal</span></label>
          </div>
          <div class="typeOfNoteItemWrapper">
            <input type="radio" name="typeOfNote" id="workNote" value="work" v-model="typeOfNote">
            <label for="workNote"><span>work</span></label>
          </div>
          <div class="typeOfNoteItemWrapper">
            <input type="radio" name="typeOfNote" id="importantNote" value="important" v-model="typeOfNote">
            <label for="importantNote"><span>important</span></label>
          </div>
          <div class="typeOfNoteItemWrapper">
            <input type="radio" name="typeOfNote" id="defaultNote" value="default" v-model="typeOfNote">
            <label for="defaultNote"><span>default</span></label>
          </div>
        </div>
          <h2 class="noteNameDisplay" v-show="noteName">{{ noteName }}</h2>
          <ul class="todosDisplay" v-show="todos.length > 0">
            <li v-for="todo of todos">
              <span>{{ todo }}</span>
              <button class="removeTodoBtn" @click.prevent="removeTodo(todo)"><font-awesome-icon :icon="['far', 'times-circle']" /></button>
            </li>
          </ul>
        <input type="submit" value="Save" :disabled="!noteName">
      </form>
    </div>
  </div>
</template>

<script>
import NoteAtMain from '@/components/NoteAtMain.vue';

export default {
  name: 'AddNote',
  components: {
    NoteAtMain
  },
  props: ['toggleVisibleAddnote'],
  //noteName - поле, связанное с названием новой заметки
  // currentTodo -  поле, связанное с названием создаваемого todo
  // todos - массив, в который добавляются todos создаваемой заметки
  // notes - массив всех заметок, подгружаемый из store
  // typeOfNote - поле связанное с select выбора типа заметки (personal, work, important, default)
  data() {
    return {
      noteName: '',
      currentTodo: '',
      todos: [],
      notes: this.$store.state.notes,
      typeOfNote: 'default'
    }
  },
  methods: {
    // метод добавляет введенный новый todo в массив todos, откуда в последствии будет добавлен во Vuex и localStorage
    addTodo() {     
      if (this.currentTodo) {
        this.todos.push(this.currentTodo);
        this.currentTodo = '';
      }
    },
    // метод для удаления todo из списка введенных (из массива todos) до момента сохранения
    // item - string. Текст удаляемого todo
    removeTodo(item) {
      this.todos = this.todos.filter(todo => todo !== item);
    },
    // метод для сохранения новой заметки, добавления ее во Vuex и localStorage
    // метод инициирует мутацию store 'addNote'
    // метод запускает метод toggleVisibleAddnote (передается пропом из родителя) для закрытия окна добавления заметки
    addNote() {
      this.$store.commit('addNote', {
        name: this.noteName,
        todos: this.todos,
        typeOfNote: this.typeOfNote
      });
      this.todos = [];
      this.toggleVisibleAddnote();
    }
  }
}
</script>

<style lang="scss" >
  @import '../_mixins.scss';

  .addNoteBlock {
    width: 70%;
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px 0 #ccc;
    background-color: #fff;

    .description {
      @include Roboto(13px, 300);
      width: 80%;
      margin: 20px auto;
      color: darken(rgba(53, 129, 201, .6), 20%);
    }

    @media (max-width: 500px) {
      .description {
        font-size: 14px;
      }
    }

    @media (max-width: 400px) {
      .description {
        font-size: 13px;
      }
    }

    input:not([type='submit']) {
      @include Roboto(14px, 300);
      @include noborder;
      margin: 0 auto;
      background-color: transparent;
      border-radius: 0;
      border-bottom: 1px solid #888;
      margin-bottom: 20px;
      padding: 0 10px;
      color: #888;
    }

    .typeOfNoteWrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      .typeOfNoteItemWrapper {
        margin: 0 5px;

        label {
          @include Roboto(12px, 300);
          color: rgb(138, 138, 138);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          span {
            display: block;
            padding-top: 10px;
          }

          &::before {
            content: '';
            display: block;
            position: absolute;
            left: calc(50% - 6px);
            top: 0;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid grey;
          }
        }

        @media (max-width: 500px) {
          label {
            font-size: 13px;
          }
        }
      }

      input {
        display: none;

        &:checked + label::after {
          content: '';
          display: block;
          position: absolute;
          top: 3px;
          left: calc(50% - 3px);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: grey;
        }

        &#workNote:checked {
          & + label::before {
            border-color: transparentize($work, $amount: .3);
          }
          & + label::after {
            background-color: transparentize($work, $amount: .3);
          }
        } 

        &#personalNote:checked {
          & + label::before {
            border-color: transparentize($personal, $amount: .3);
          }
          & + label::after {
            background-color: transparentize($personal, $amount: .3);
          }
        } 

        &#importantNote:checked {
          & + label::before {
            border-color: transparentize($important, $amount: .3);
          }
          & + label::after {
            background-color: transparentize($important, $amount: .3);
          }
        } 

        &#defaultNote:checked {
          & + label::before {
            border-color: transparentize($default, $amount: .3);
          }
          & + label::after {
            background-color: transparentize($default, $amount: .3);
          }
        } 
      }
    }

    .noteNameInput {
      display: block;
      width: 90%;
    }

    .todoInputWrapper {
      @include noborder;
      width: 90%;
      margin: 0 auto;
      padding: 0;
    }
    
    .todoInput {
      display: inline-block;
      width: calc(100% - 20px)
    }

    .todoAdderBtn {
      @include Roboto(14px, 300);
      @include noborder;
      background-color: transparent;
      color: rgba(53, 129, 201, .6);
      border-bottom: 1px solid #888;
      width: 20px;
      transition: color .3s;

      &:hover {
        color: rgb(211, 84, 84);
      }
    }

    @media (max-width: 640px) {
      p.description {
        width: 90%;
      }
    }

    @media (max-width: 500px) {
      p.description {
        width: calc(100% - 10px);
      }
    }

    .displayWrapper {
      overflow: auto;
      max-height: 70px;
    }

    .noteNameDisplay {
      @include Roboto(14px, 400);
      color: #888;
    }

    @media (max-width: 500px) {
      .noteNameDisplay {
        font-size: 14px;
      }
    }

    .todosDisplay {
      width: 80%;
      margin: 0 auto;

      li {
        @include Roboto(13px, 300);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,.05);
        margin-bottom: 5px;
        list-style: none;
        color: #888;

        span {
          text-align: left;
        }

        .removeTodoBtn {
          @include Roboto(10px, 100);
          @include noborder;
          color: rgba(201, 95, 53, .8);
          background-color: transparent;
          vertical-align: baseline;
        }

        @media (max-width: 640px) {
          .removeTodoBtn {
            font-size: 12px;
          }
        }
      }
    }

    @media (max-width: 640px) {
      .noteNameDisplay {
        font-size: 13px;
      }

      .todosDisplay {
        font-size: 12px;
      }
    }

    @media (max-width: 500px) {
      #typeOfNote {
        margin: 10px auto;
      }
    }

    input[type="submit"] {
      @include Roboto(14px, 400);
      @include noborder;
      @include btn($accept);
      background-color: transparent;
      margin-top: 20px;
      text-transform: uppercase;
      transition: opacity .3s;
    }

    .clsBtn {
      @include noborder;
      @include btn($back);
      align-self: flex-end;
      background-color: transparent;
      text-transform: uppercase;
    }
  }

  @media (max-width: 820px) {
    .addNoteBlock {
      width: 85%;
      max-width: 600px;
    }
  }

  @media (max-width: 640px) {
    .addNoteBlock {
      width: 85%;
    }
  }

  @media (max-width: 500px) {
    .addNoteBlock {
      padding: 5px 5px 10px 5px;
    }
  }
</style>

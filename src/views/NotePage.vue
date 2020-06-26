<template>
  <div class="note">
    <Confirmation 
      v-show="showConfirmationForDelete" 
      :message="'Delete this note?'"
      @confirm="removeNote(note.noteId)"
      @abort="showConfirmationForDelete = false"
    />
    <Confirmation 
      v-show="showConfirmationForAbort"
      :message="'Save changes?'"
      @abort="$router.push('/')"
      @confirm="saveNote"
    />
    <div class="fixedHeader">
      <header class="noteHeader" :class="[`${note.typeOfNote}Note`, editMode ? `editing` : '']">
        <h1 @dblclick="runEditMode" title="double click for editing">{{ note.noteHeader }}</h1>
        <input type="text" class="inputNoteName" v-show="editMode" v-model.lazy="note.noteHeader" v-input-focus="editMode" @focus="recName" @blur="cacheName">
      </header>
      <div class="controls">
        <div class="typeOfNoteBlock">
          <input type="radio" name="noteType" id="typePersonal" value="personal" v-model="note.typeOfNote" @click="changeType">
          <label for="typePersonal"></label>
          <input type="radio" name="noteType" id="typeWork" value="work" v-model="note.typeOfNote" @click="changeType">
          <label for="typeWork"></label>
          <input type="radio" name="noteType" id="typeImportant" value="important" v-model="note.typeOfNote" @click="changeType">
          <label for="typeImportant"></label>
          <input type="radio" name="noteType" id="typeDefault" value="default" v-model="note.typeOfNote" @click="changeType">
          <label for="typeDefault"></label>
        </div>
        <div class="undoRedoWrapper">
          <button :disabled="cache.length === 0" @click="undo"><font-awesome-icon icon="undo-alt" class="undoRedoBtn" /></button>
          <button :disabled="fromCache.length === 0" @click="redo"><font-awesome-icon icon="redo-alt" class="undoRedoBtn" /></button>
        </div>
      </div>
    </div>
    <ul class="todos">
      <TodoItem @removingTodoStatus="(currentTodoStatus) => action.status = currentTodoStatus" :type="'note'" :noteId="note.noteId" v-for="todo of note.todos" :todo="todo" :removeTodo="removeTodo" :key="todo.todoId" />
      <fieldset class="todoAddBlock">
        <input type="text" class="todoAddInput" v-model="newTodoText" placeholder="add todo" @keyup.enter="addTodo">
        <button @click.prevent="addTodo" class="todoAddBtn">+</button>
      </fieldset>
    </ul>
    <div class="saveNoteBtnWrapper">
      <router-link :to="'/'">
        <button class="saveNoteBtn noteBtn" @click="saveNote">Save</button>
      </router-link>
      <router-link :to="'/'" v-show="cache.length === 0 && fromCache.length === 0 && !checkBoxUsed">
        <span class="cancelNoteBtn noteBtn">back</span>
      </router-link>
        <span v-show="cache.length !== 0 || fromCache.length !== 0 || checkBoxUsed" class="cancelNoteBtn noteBtn" @click="showConfirmationForAbort = true"> cancel </span>
        <span class="deleteNoteBtn noteBtn" @click="showConfirmationForDelete = true">Delete</span>
    </div>
    <p class="description">*Double click on note name or todos to edit it</p>
  </div>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue';
import Confirmation from '@/components/Confirmation.vue';

export default {
  name: 'NotePage',
  components: {
    TodoItem,
    Confirmation
  },
  data() {
    // newTodo - объект для создания нового todo
    // note - объект текущей заметки
    // editMode - флаг, отвечающий за установку режима редактирования заголовка или todos
    // showConfirmationForDelete - флаг, отвечающий за отображение окна подтверждения операции удаления заметки
    // showConfirmationForAbort - флаг, отвечающий за отображение окна подтверждения выхода без сохранения изменений
    // cache - массив, в который записываются операции пользователя
    // fromCache - массив, в который записываются отмены операций пользователя
    // action - объект, с помощью которого происходит добавление в кэш
    // checkboxUsed - флаг, говорящий о том, что пользователь отметил какие-то чекбоксы и нужно предложить сохранить изменения при выходе
    return {
      // newTodo: {
      //   done: false,
      //   todoId: '',
      //   todoText: ''
      // },
      newTodoText: '',
      note: JSON.parse(JSON.stringify(this.$store.state.notes.find(note => note.noteId === this.$route.params.noteId))),
      editMode: false,
      showConfirmationForDelete: false,
      showConfirmationForAbort: false,
      cache: [],
      action: {
        type: '',
        previousVal: '',
        currentVal: '',
        id: '',
        status: ''
      },
      fromCache: [],
      checkBoxUsed: false
    }
  },
  methods: {
    // метод очищает объект action, который используется для записи в кэш
    clearAction() {
      this.action.type = '';
      this.action.previousVal = '';
      this.action.currentVal = '';
      this.action.id = '';
      this.action.status = '';
    },
    // метод очищает кэш
    clearFromCache() {
      (this.fromCache.length > 0) && (this.fromCache = []);
    },
    // метод записывает изменения, хранящиеся в объекте action в кэш
    toCache() {
      this.cache.push({...this.action});
    },
    // метод записывает исходное название заметки если пользователь приступил к его редактированию
    recName() {
      this.action.previousVal  = this.note.noteHeader;
    },
    // метод записывает в кэш операцию переименования названия заметки, если были какие-то изменения
    // записывает изменения в соответствующие поля объекта action и вызывает метод toCache для записи в кэш
    // если пользователь оставил название пустым, метод вернет исходное название
    // в конце вызывается метод clearAction для очистки полей объекта action
    cacheName() {
      this.clearFromCache();
      this.editMode = false;
      if (this.note.noteHeader) {
        this.action.type = 'changeNoteName';
        this.action.currentVal = this.note.noteHeader;
        (this.action.previousVal !== this.action.currentVal) && this.toCache();
      } else {
        this.note.noteHeader = this.action.previousVal;
      }
      this.clearAction();
    },
    // метод для кэширования операции изменения типа заметки
    // сначала чистим кэш, если пользователь возвращал операции
    changeType(e) {
      this.clearFromCache();
      this.action.type = 'changeNoteType';
      this.action.previousVal = this.note.typeOfNote;
      this.action.currentVal = e.target.value;
      this.toCache();
      this.clearAction();
    },
    // метод для отмены внесенных изменений
    // если в кэше ничего нет, ничего не произойдет
    // если в кэшэ есть записи то они переносятся в массив fromCache, чтобы использовать их для возврата изменений
    // кэшируются следующие опреации: изменение названия заметки, изменения текста todo, добавление todo, удаление todo, изменение типа заметки
    undo() {
      if (this.cache.length === 0) {
        return;
      }
      let last = this.cache.pop();
      this.fromCache.push(last);
      let { type, previousVal, currentVal, id, status } = last;
      switch(type) {
        case 'changeNoteName':
          this.note.noteHeader = previousVal;
          break;
        case 'changeTodo':
          this.note.todos = this.note.todos.map(todo => {
            (todo.todoId === id) && (todo.todoText = previousVal);
            return todo;
          });
          break;
        case 'addTodo':
          this.note.todos.pop();
          break;
        case 'deleteTodo':
          this.note.todos.push({
            done: status,
            todoId: id,
            todoText: currentVal
          });
          break;
        case 'changeNoteType':
          this.note.typeOfNote = previousVal;
          break;
      }
    },
    // метод для возврата отмененных действий
    // работает аналогично методу undo, но в обратную сторону
    redo() {
      if (this.fromCache.length === 0) {
        return;
      }
      let last = this.fromCache.pop();
      this.cache.push(last);
      let { type, previousVal, currentVal, id, status } = last;
      switch(type) {
        case 'changeNoteName':
          this.note.noteHeader = currentVal;
          break;
        case 'changeTodo':
          this.note.todos = this.note.todos.map(todo => {
            (todo.todoId === id) && (todo.todoText = currentVal);
            return todo;
          });
          break;
        case 'addTodo':
          this.note.todos.push({
            done: status,
            todoId: id,
            todoText: currentVal
          });
          break;
        case 'deleteTodo':
          this.note.todos.pop();
          break;
        case 'changeNoteType':
          this.note.typeOfNote = last.currentVal;
          break;
      }
    },
    // метод для добавления todo в список todo
    // если пользователь возвращал операции, сначала обновляется кэш (метод clearFromCache)
    // метод присваивает id создаваемому todo и добавляет в массив todos
    // заполняет соовтетствующие поля в объекте action и записывает операцию в кэш
    // в конце очищает объект action (метод clearAction) и поле todoText
    addTodo() {
      this.clearFromCache();
      this.action.id = `td${Date.now()}${Math.random()}`;
      this.note.todos.push({
        todoId: this.action.id,
        todoText: this.newTodoText,
        done: false
      });
      this.action.type = 'addTodo';
      this.action.currentVal = this.newTodoText;
      this.toCache();
      this.clearAction();
      this.newTodoText = '';
    },
    // метод для удаления пунктов todo
    // параметр deletingTodo - Object (объект удаляемого todo)
    // если пользователь возвращал отмененные операции, сначала обновляется кэш (метод clearFromCache)
    // вносит изменения в соответствующие поля объекта action для последующего добавления в кэш
    // в конце отправляет операцию в кэш (метод toCache) и очищает action (метод clearAction)
    removeTodo(deletingTodo) {
      this.clearFromCache();
      this.note.todos = this.note.todos.filter(todo => todo.todoId !== deletingTodo.todoId);
      this.action.type = 'deleteTodo';
      this.action.id = deletingTodo.todoId;
      this.action.currentVal = deletingTodo.todoText;
      this.toCache();
      this.clearAction();
    },
    // метод переводящий поле editMode в true (включающий режим редактирования)
    runEditMode() {
      this.editMode = true;
    },
    // метод для инициирования мутации 'removeNote' в store (удаление заметки)
    // id - string (id удаляемой заметки)
    removeNote(id) {
      this.$store.commit('removeNote', id);
    },
    // метод для сохранения состояния заметки
    // помечает заметку, как выполненную, если все todos выполнены
    // инициирует мутацию 'saveNote' в store
    saveNote() {
      let inProgress = !!this.note.todos.find(el => !el.done);
      this.note.noteStatus = (inProgress || this.note.todos.length === 0) ? 'in progress' : 'done';
      this.$store.commit('saveNote', {
        note: this.note
      });
    }
  },
  // директива для установки фокуса в поле ввода при включении режима редактирования
  directives: {
    "input-focus": function(el, binding) {
      if (binding.value && !binding.oldValue) {
        el.focus();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../_mixins.scss';

  .fixedHeader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 3;
  }

  @media (max-width: 820px) {
    .fixedHeader .noteHeader {
      width: 630px;
    }
  }

  @media (max-width: 640px) {
    .fixedHeader .noteHeader {
      width: 90%;
    }
  }

  @media (max-width: 500px) {
    .fixedHeader .noteHeader {
      width: 100%;
    }
  }

  .noteHeader {
    margin: 0 auto;
    margin-bottom: 10px;
    padding: 0 15px;
    width: 800px;
    text-align: center;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    min-height: 22px;

    &.importantNote {
      background: linear-gradient(transparentize($important, .75), transparent);
    }

    &.workNote {
      background: linear-gradient(transparentize($work, .75), transparent);
    }

    &.personalNote {
      background: linear-gradient(transparentize($personal, .75), transparent);
    }

    &.defaultNote {
      background: linear-gradient(transparentize($default, .75), transparent);
    }

    h1 {
      @include Roboto(13px, 300);
      margin: 0 auto 10px auto;
      text-align: center;
      word-break: break-word;
      max-width: 95%;
      color: rgb(68, 68, 68);
    }

    &.editing h1 {
      display: none;
    }

    .inputNoteName {
      @include Roboto(13px, 300);
      @include noborder;
      display: block;
      margin: 0 auto 10px auto;
      width: 95%;
      background-color: transparent;
      text-align: center;
    }
  }

  .controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 12px;

    .typeOfNoteBlock {
      display: flex;
      justify-content: space-between;
      width: 100px;
      margin-bottom: 10px;

      input {
        display: none;

        & + label {
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          cursor: pointer;
          transition: box-shadow .2s;
        }

        &#typeWork {
          &:checked + label {
            background-color: $work;
          }

          & + label {
            border: 1px solid $work;

            &:hover {
              box-shadow: 0 0 5px 0 $work;
            }
          }
        } 

        &#typePersonal {
          &:checked + label {
            background-color: $personal;
          }

          & + label {
            border: 1px solid $personal;

            &:hover {
              box-shadow: 0 0 5px 0 $personal;
            }
          }
        } 

        &#typeImportant {
          &:checked + label {
            background-color: $important;
          }

          & + label {
            border: 1px solid $important;

            &:hover {
              box-shadow: 0 0 5px 0 $important;
            }
          }
        } 

        &#typeDefault {
          &:checked + label {
            background-color: $default;
          }

          & + label {
            border: 1px solid $default;

            &:hover {
              box-shadow: 0 0 5px 0 $default;
            }
          }
        } 
      }
    }

    @media (max-width: 820px) {
      .typeOfNoteBlock {
        width: 150px;
      }
    }

    @media (max-width: 500px) {
      .typeOfNoteBlock {
        width: 50%;
      }
    }

    button {
      @include noborder;
      color: #ccc;
      background-color: transparent;
      transition: color .2s, opacity .2s;

      &:disabled {
        opacity: .2;
        cursor: default;
      }

      &:not(:disabled):hover {
        color: #888;
      }

      &:nth-child(1) {
        margin-right: 10px;
      }
    }
  }

  .todos {
    list-style: none;
    width: 80%;
    margin: 0 auto;
    margin-top: -10px;
    padding: 10px 20px;
  }

  @media (max-width: 820px) {
    .todos {
      width: 95%;
    }
  }

  .todoAddBlock {
    @include noborder;
    width: 100%;

    .todoAddInput {
      @include noborder;
      @include Roboto(12px, 300);
      width: calc(100% - 20px);
      margin-top: 30px;
      padding-left: 15px;
      border-radius: 0;
      border-bottom: 1px solid grey;
      filter: opacity(0.25);
      transition: filter .3s;

      &:focus {
        filter: none;

        &:focus + .todoAddBtn {
          filter: none;
        }
      }
    }

    .todoAddBtn {
      @include noborder;
      width: 20px;
      border-bottom: 1px solid grey;
      background-color: transparent;
      color: rgba(53, 129, 201, .6);
      font-weight: 300;
      filter: opacity(0.25);
      transition: filter .3s, color .3s;

      &:hover {
        color: darken($color: rgba(53, 129, 201, .6), $amount: 30%);
      }
    }
  }

  .saveNoteBtnWrapper {
    text-align: center;

    .noteBtn {
      @include Roboto(14px, 400);
      @include noborder;
      min-width: 50px;
      height: 30px;
      padding: 0 10px;
      text-transform: uppercase;
      background-color: transparent;
      cursor: pointer;
    }

    .saveNoteBtn {
      @include btn($accept);
    }

    .cancelNoteBtn {
      @include btn($back);
    }

    .deleteNoteBtn {
      @include btn($decline);
    }
  }

  .description {
    @include Roboto(11px, 300);
    width: 80%;
    margin: 20px auto;
    text-align: center;
    color: darken(rgba(53, 129, 201, .5), 20%);
  }
</style>

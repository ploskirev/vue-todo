<template>
  <li class="noteItem" :class="{editing: editMode}">
    <template v-if="type === 'home'">
      <p class="todoItemHome">- {{ todo.todoText }}</p>
    </template>
    <template v-else-if="type === 'note'">
      <div class="viewTodo">
        <div>
          <input type="checkbox"  :id="`${noteId}${todo.todoId}input`" v-model="todo.done">
          <label @click.prevent="checkTodoStatus()" :for="`${noteId}${todo.todoId}input`"></label>
          <p @dblclick="editMode = true" title="double click for editing">{{ todo.todoText }}</p>
        </div>
        <button @click="$emit('removingTodoStatus', currentTodoStatus)" @click.prevent="removeTodo(todo)" class="removeTodoBtn"><font-awesome-icon :icon="['far', 'times-circle']" /></button>
      </div>
      <input v-input-focus="editMode == true" type="text" class="editTodo" @focus="recTodo" @blur="cacheTodo" @keyup.enter="cacheTodo" @keyup.esc="cacheTodo" v-model.lazy="todo.todoText">
    </template>
  </li>
</template>

<script>
export default {
  name: 'TodoItem',
  // todo - объект текущего todo
  // noteId - id заметки, к которой принадлежит текущий todo
  // type - тип, в зависимости от которого выбирается шаблон для рендера ('home' или 'note')
  // removeTodo - метод для инициации мутации 'removeTodo' в store
  props: ['todo', 'noteId', 'type', 'removeTodo'],
  data() {
    // editMode - флаг, отвечающий за включение/выключение режима редактирования текста todo
    return {
      editMode: false,
    }
  },
  methods: {
    // метод для установления статуса todo при переключении чекбокса
    // изменяет свойство родителя checkboxUsed, для фиксации изменения статуса todo
    checkTodoStatus() {
      this.todo.done = !this.todo.done;
      this.$parent.checkBoxUsed = true;
    },
    // метод, записывает исходное значение текста в todo при начале его редактирования
    // для дальнейшей возможности использовать отмену
    recTodo() {
      this.$parent.action.type = 'changeTodo';
      this.$parent.action.previousVal = this.todo.todoText;
    },
    // метод включает режим редактирования текста для todo, записывает операцию в кэш, если были внесены изменения
    // для добавления в кэш (объект cache родителя) сначала изменения записываются в соответствующие свойства объекта action родителя
    // и в кэш добавляется копия объекта action.
    // После этого вызывается метод clearAction родителя для очистки объекта action
    cacheTodo() {
      this.$parent.clearFromCache();
      this.editMode = false;
      if (this.todo.todoText) {
        this.$parent.action.currentVal = this.todo.todoText;
        this.$parent.action.id = this.todo.todoId;
        if (this.$parent.action.currentVal !== this.$parent.action.previousVal) {
          this.$parent.cache.push({...this.$parent.action});
        }
      } else {
        this.todo.todoText = this.$parent.action.previousVal;
      }
      this.$parent.clearAction();
    }
  },
  // директива для установки фокуса на инпуте с редактируемым todo при переходе в режим редактирования
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

  .noteItem {
    @include Roboto(13px, 300);
    list-style: none;

    input {
      display: none;
    }
    
    label {
      display: inline-block;
      position: relative;
      margin-bottom: 10px;
      transition: color .2s;
      cursor: pointer;

      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: -1px;
        width: 14px;
        height: 14px;
        border: 2px solid grey;
        border-radius: 3px;
        transition: border-color .2s, transform .1s;
      }

      &:hover::before {
        border-color: rgb(110, 156, 120);
      }

      &:active::before {
        transform: scale(.8);
      }
    }

    p.todoItemHome {
      display: inline-block;
      padding: 0 10px 0 30px;
      word-break: break-word;
      line-height: 1.05;
      color: #555
    }

    @media (max-width: 800px) {
      p.todoItemHome {
        padding-left: 15px;
      }
    }

    @media (max-width: 640px) {
      p.todoItemHome {
        padding-left: 5px;
        margin-bottom: 5px;
      }
    }

    @media (max-width: 500px) {
      p.todoItemHome {
        margin-bottom: 10px;
      }
    }
    

    input:checked + label {
      & + p {
        color: rgba(0, 0, 0, .1);
      }

      &::before {
        border-color: rgb(110, 156, 120);
      }
    
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 4px;
        top: 3px;
        width: 6px;
        height: 4px;
        border-left: 2px solid rgba(63, 158, 92, .705);
        border-bottom: 2px solid rgba(63, 158, 92, .705);
        transform: rotate(-45deg);
      }
    }
  }

  .viewTodo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    div {
      display: flex;
      align-items: center;

      p {
        padding-left: 30px;
        padding-right: 10px;
        color: #555;
      }
    }

    .removeTodoBtn {
      @include Roboto(11px, 100);
      @include noborder;
      @include btn($decline);
      background-color: transparent;
    }
  }

  .editing .viewTodo {
    display: none;
  }

  .editing .editTodo {
    @include Roboto(13px, 300);
    @include noborder;
    display: block;
    width: 90%;
    height: 18px;
    margin-left: 30px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(53, 129, 201, 0.6);
  }

  #checker {
    display: inline;
  }
</style>

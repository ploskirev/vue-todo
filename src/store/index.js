import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// функция для загрузки заметок из localStorage
const loadStore = () => {
  try {
    let data = localStorage.getItem('notes');
    return data === null ? [] : JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export default new Vuex.Store({
  strict: true,
  state: {
    notes: loadStore()
  },
  mutations: {
    // метод для для удаления заметки
    // удаляет заметку по ее id
    // также обновляет localstorage
    // id - string
    removeNote(state, id) {
      state.notes = state.notes.filter(note => note.noteId !== id);
      let parsed = JSON.stringify(state.notes);
      localStorage.setItem('notes', parsed);
    },
    // метод для добавления новой заметки в store 
    // в payload пуют поля name, todos, typeOfNote
    // name - название заметки
    // todos - массив todo элементов
    // typeOfNote - тип заметки (personal, work, important, default)
    // в процессе записи каждой заметке и каждому todo присваивается id
    // устанавливается статус заметки
    // обновляет запись в localStorage
    addNote(state, payload) {
      let {name, todos, typeOfNote} = payload;
      todos = todos.map(todo => {
        return {
          todoId: `td${Date.now()}${Math.random()}`,
          todoText: todo,
          done: false
        }
      });
      state.notes.push({
        noteId: `nt${Date.now()}`,
        noteHeader: name,
        typeOfNote: typeOfNote,
        noteStatus: 'in progress',
        todos: todos
      });
      localStorage.setItem('notes', JSON.stringify(state.notes));
    },
    // метод для сохранения заметки во Vuex после внесения в нее каких-либо изменений на странице заметки
    // в payload приходит объект с заметкой в поле note
    // обновляет соответствующее поле в localStorage
    saveNote(state, payload) {
      let {note} = payload;
      state.notes = state.notes.map(n => {
        if (n.noteId === note.noteId) {
          return note;
        } else {
          return n;
        }
      });
      localStorage.setItem('notes', JSON.stringify(state.notes));
    }
  }
});

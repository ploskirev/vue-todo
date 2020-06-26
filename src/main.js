// Приложение сделано при помощи vue.js, vue-router, vuex
// СТРАНИЦЫ:
// HomePage - главная страница с перечнем всех заметок
// NotePage = страница открытой заметки
// КОМПОНЕНТЫ:
// AddNote - компонент для создания новых заметок. Открывается как модальное окно из homePage
// Confirmation - компонент для подтверждения действий (удаление заметки, отмены всех внесенных изменений)
// NoteAtMain - компонент, отвечающий за отображение заметки на главной странице
// TodoItem - компонент, отвечающий за отображение пунктов todo, как на главной, так и на странице заметки (вид зависит от пропсов)
// Для некоторых иконок использован fontawesome

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faTrashAlt, faUndoAlt, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTrash, faTrashAlt, faUndoAlt, faRedoAlt, faTimesCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

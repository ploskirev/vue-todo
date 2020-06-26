<template>
  <div class="home">
    <Confirmation 
      v-show="showConfirmationForDelete" 
      :message="'Delete this note?'"
      @confirm="removeNote(deletingNoteId)"
      @abort="showConfirmationForDelete = false"
    />
    <div class="fixedHeader">
      <header class="homeHeader">
        <h1>Vue Notes</h1>
      </header>
      <div class="controls">
        <button class="showAdderBtn" @click="toggleVisibleAddnote">New</button>
        <ul class="filterMenu">
          <li @click="setMode('all')" class="filterMenuItem" :class="{active: mode == 'all'}">all</li> |
          <li @click="setMode('active')" class="filterMenuItem" :class="{active: mode == 'active'}">active</li> |
          <li @click="setMode('done')" class="filterMenuItem" :class="{active: mode == 'done'}">done</li>
        </ul>
      </div>
    </div>
    <ul class="noteList">
      <template>
        <router-link :to="`/note/${note.noteId}`" v-for="note of notes" :key="note.noteId" >
          <NoteAtMain :class="{done: note.noteStatus === 'done'}" :note="note" />
        </router-link>
      </template>
    </ul>
    <AddNote :toggleVisibleAddnote="toggleVisibleAddnote" v-if="adderVisible" class="modal"/>
  </div>
</template>

<script>
import NoteAtMain from '@/components/NoteAtMain.vue';
import AddNote from '@/components/AddNote.vue';
import Confirmation from '@/components/Confirmation.vue';

export default {
  name: 'Home',
  components: {
    NoteAtMain,
    AddNote,
    Confirmation
  },
  data() {
    // adderVisible - флаг, отвчающий за отображение модального окна добавления заметки
    // mode - режим отображение заметок, фильтр. Может быть 'all', 'done', 'active'
    // showConfirmationForDelete - флаг, отвечающий за отображение окна подтверждения удаления заметки
    // deletingNoteId - id удаляемой заметки, приходит из потомка
    return {
      adderVisible: false,
      mode: 'all',
      showConfirmationForDelete: false,
      deletingNoteId: ''
    }
  },
  computed: {
    // используется для отображения заметок в зависимости от установленного фильтра
    notes() {
      if (this.mode === 'done') {
        return this.$store.state.notes.filter(note => note.noteStatus === 'done');
      } else if (this.mode === 'active') {
        return this.$store.state.notes.filter(note => note.noteStatus !== 'done');
      } else {
        return this.$store.state.notes;
      }
    }
  },
  methods: {
    // метод инициирует мутацию 'removeNote' в store
    // id - string; id удаляемой заметки
    // переводит флаг showConfirmationForDelete в false (закрывает окно подтверждения операции удаления)
    removeNote(id) {
        this.$store.commit('removeNote', id);
        this.showConfirmationForDelete = false;
      },
      // переключает флаг отвечающий за показ окна для создания новой заметки
    toggleVisibleAddnote() {
      this.adderVisible = !this.adderVisible;
    },
    // устанавливает режим, от которого зависит отображение заметок
    // mode - string; может быть 'all', 'done', 'active'
    setMode(mode) {
      this.mode = mode;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../_mixins.scss';

  .home {
    .fixedHeader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      z-index: 1;
    }

    @media (max-width: 820px) {
      .fixedHeader .homeHeader {
        width: 630px;
      }
    }

    @media (max-width: 640px) {
      .fixedHeader .homeHeader {
        width: 90%;
      }
    }

    @media (max-width: 500px) {
      .fixedHeader .homeHeader {
        width: 100%;
      }
    }

    .homeHeader {
      margin: 0 auto;
      margin-bottom: 5px;
      width: 800px;
      min-height: 22px;
      text-align: center;
      background: linear-gradient(rgba(100, 170, 250, .25), transparent);
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }

    h1 {
      @include Roboto(14px, 300);
      margin: 0 auto 10px auto;
      text-align: center;
      color: rgb(98, 110, 129);
      text-transform: uppercase;
      cursor: default;
    }

    .controls {
      margin: 0 auto;
      margin-bottom: 5px;
      text-align: center;

      .filterMenu {
        @include Roboto(12px, 300);
        margin-top: 5px;
        list-style: none;
        display: flex;
        justify-content: center;

        .filterMenuItem {
          cursor: pointer;
          color: rgb(170, 170, 170);
          transition: color .3s;

          &.active {
            color: rgb(78, 78, 78)
          }

          &:hover {
            color: rgb(78, 78, 78);
          }
        }
      }
    }

    .showAdderBtn {
      @include Roboto(12px, 400);
      @include noborder;
      @include btn(darken($main, 5%));
      cursor: pointer;
      background-color: #fff;
      text-transform: uppercase;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
      width: 100vw;
      height: 100vh;
      overflow: auto;
      padding: 40px 0;
      background-color: rgba(255, 255, 255, .95);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: center;
    }
  }
</style>

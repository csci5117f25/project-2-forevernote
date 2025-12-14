<script setup>
import 'vue-select/dist/vue-select.css';

import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCollection, useCurrentUser, useDocument, useFirestore } from 'vuefire';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import AudioEngine from './AudioEngine.vue';

import PlayIcon from './icons/IconPlay.vue';
import StopIcon from './icons/IconStop.vue';
import CancelIcon from './icons/IconCross.vue';

import tinymce from 'tinymce';

// TinyMCE default icons (required)
import 'tinymce/icons/default/icons.min.js';

// TinyMCE components (required)
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

// TinyMCE skin
import 'tinymce/skins/ui/oxide/skin.js';

// TinyMCE plugins
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';

// TinyMCE UI CSS (required)
import 'tinymce/skins/ui/oxide/content.js';

// TinyMCE Default CSS
import 'tinymce/skins/content/default/content.js';

// TinyMCE Vue Setup
import Editor from '@tinymce/tinymce-vue';

const tinyMCEConfig = {
  plugins:
    'advlist anchor autolink autoresize charmap code fullscreen image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
  toolbar:
    'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  // height: 500,
  resize: false,
  promotion: false,
};

const transcriptionSupport = typeof Worker !== 'undefined' && typeof AudioContext !== 'undefined';

const router = useRouter();
const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();

const noteId = computed(() => route.params.id);
const isLoaded = ref(noteId.value ? false : true);

const notesRef = collection(db, 'users', user.value.uid, 'notes');
const notes = useCollection(notesRef);
const subjects = computed(() =>
  notes.value.filter((note) => note.subject).map((note) => note.subject),
);
const tags = computed(() => notes.value.filter((note) => note.tags).flatMap((note) => note.tags));

const noteRef = noteId.value ? doc(db, 'users', user.value.uid, 'notes', noteId.value) : undefined;
const note = useDocument(noteRef);
const noteTitle = computed(() => {
  if (!note.value) return '';

  return note.value.title;
});
const noteContent = computed(() => {
  if (!note.value) return '';

  return note.value.htmlContent ? note.value.htmlContent : note.value.notes;
});

const isEditingTitle = ref(false);
const isTranscribing = ref(false);

function startRecording() {
  isTranscribing.value = true;
}
function stopRecording() {
  isTranscribing.value = false;
}

const currTitle = ref(noteId.value ? '' : 'Untitled Note');
function resetTitle() {
  if (noteId.value) currTitle.value = noteTitle.value;
  else currTitle.value = 'Untitled Note';

  isEditingTitle.value = false;
}

const currSubject = ref('');

const currTags = ref([]);

function appendToEditor(text) {
  if (!tinymce.activeEditor) {
    console.error('Failed to get editor content: editor has not been initialized');

    return;
  }

  tinymce.activeEditor.execCommand('mceInsertContent', false, text);
}

function transcriptionHandler(text) {
  console.log(`In handler: ${text} (${typeof text})`);
  if (text.includes('[')) return;
  if (text.includes('(')) return;

  appendToEditor(text);
}

async function submitNote() {
  if (!tinymce.activeEditor) {
    console.error('Failed to get editor content: editor has not been initialized');

    return;
  }

  const data = {
    title: currTitle.value,
    notes: tinymce.activeEditor.getContent({ format: 'text' }),
    htmlContent: tinymce.activeEditor.getContent(),
    createdAt: serverTimestamp(),
    lastEdited: serverTimestamp(),
  };

  try {
    const res = await addDoc(collection(db, 'users', user.value.uid, 'notes'), data);

    router.push({ name: 'note', params: { id: res.id } });
  } catch (e) {
    console.error('error:', e);
  }
}
async function updateNote() {
  if (!tinymce.activeEditor) {
    console.error('Failed to get editor content: editor has not been initialized');

    return;
  }

  const data = {
    title: currTitle.value,
    notes: tinymce.activeEditor.getContent({ format: 'text' }),
    subject: currSubject.value,
    tags: currTags.value,
    htmlContent: tinymce.activeEditor.getContent(),
    lastEdited: serverTimestamp(),
  };

  try {
    await setDoc(noteRef, data);
  } catch (e) {
    console.error('error:', e);
  }
}

watch(note, () => {
  if (noteId.value && note.value) {
    currTitle.value = note.value.title;

    currSubject.value = note.value.subject ?? '';
    currTags.value = note.value.tags ?? [];

    isLoaded.value = true;
  }
});
</script>

<template>
  <AudioEngine :isRecording="isTranscribing" @newTranscript="transcriptionHandler" />

  <main v-if="isLoaded">
    <div id="button-set">
      <div class="">
        <button
          v-if="!isTranscribing"
          class="button is-success"
          @click="startRecording"
          :disabled="!transcriptionSupport"
        >
          <PlayIcon />
          <span>Start Transcription</span>
        </button>
        <button
          v-else
          class="button is-danger"
          @click="stopRecording"
          :disabled="!transcriptionSupport"
        >
          <StopIcon />
          <span>Stop Transcription</span>
        </button>
      </div>

      <div class="button-set-center">
        <div id="title-edit" v-if="isEditingTitle">
          <input class="input has-background-light has-text-dark" type="text" v-model="currTitle" />

          <button
            v-if="noteId ? currTitle !== noteTitle : currTitle !== 'Untitled Note'"
            class="button"
            @click="resetTitle"
          >
            <CancelIcon />
          </button>
        </div>
        <span v-else id="title-edit" class="has-text-dark" @click="isEditingTitle = true">
          {{ currTitle }}
        </span>

        <v-select
          id="subject-edit"
          class="subject-edit has-background-light has-text-dark"
          placeholder="Subject"
          :options="subjects"
          taggable
          v-model="currSubject"
        >
          <template #search="{ attributes, events }">
            <input class="vs__search" v-bind="attributes" v-on="events" />
          </template>

          <template #no-options="{ search }">Add: {{ search }}</template>
        </v-select>

        <v-select
          id="tag-edit"
          class="has-background-light has-text-dark"
          placeholder="Tags"
          :options="tags"
          multiple
          taggable
          v-model="currTags"
        >
          <template #search="{ attributes, events }">
            <input class="vs__search" v-bind="attributes" v-on="events" />
          </template>

          <template #no-options="{ search }">Add: {{ search }}</template>
        </v-select>
      </div>

      <div class="">
        <button v-if="noteId" class="button is-warning" @click="updateNote">Update</button>
        <button v-else class="button is-primary" @click="submitNote">Submit</button>
      </div>
    </div>

    <Editor
      id="uuid"
      licenseKey="gpl"
      :init="tinyMCEConfig"
      style="z-index: 29"
      :initialValue="noteContent"
    />
  </main>
  <main v-else>
    <div>Note is loading...</div>
  </main>

  <div v-if="isEditingTitle" id="click-exit" @click="isEditingTitle = false"></div>
</template>

<style scoped>
#click-exit {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 31;

  width: 100vw;
  height: 100vh;
}

#button-set {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  margin-bottom: 1rem;
}

.button-set-center {
  flex-grow: 1;

  display: grid;
  grid-template-columns: 3fr 1fr 1.5fr;
  gap: 0.5rem;
}

#title-edit {
  flex-grow: 2;

  position: relative;
  z-index: 32;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

span#title-edit {
  padding: 7px 11px;
}

.vs__search {
  line-height: 1.75;
}
.vs__search {
  color: var(--bulma-input-placeholder-color);
}
</style>

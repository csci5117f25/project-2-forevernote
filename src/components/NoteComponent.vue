<script>
// let speechObj = null;
</script>

<script setup>
import 'vue-select/dist/vue-select.css';

import { computed, onUnmounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useCollection, useCurrentUser, useDocument, useFirestore } from 'vuefire';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

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
  resize: false,
  promotion: false,
  setup: (e) => {
    editorRef.value = e;
  },
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const transcriptionSupport =
  typeof SpeechRecognition !== 'undefined' && typeof window.Worker !== 'undefined';
const isFirefox = navigator.userAgent.includes('Firefox');

const router = useRouter();
const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();

window.onbeforeunload = onExit;
onBeforeRouteLeave(onExit);

function onExit() {
  if (isTranscribing.value) {
    if (!confirm('You are currently transcribing? Are you sure?')) return false;

    return true;
  }

  if (isChanged()) {
    if (!confirm('You have unsaved changes! Are you sure?')) return false;

    return true;
  }

  return true;
}

function isChanged() {
  // Check for title changes
  if (currTitle.value !== noteTitle.value) return true;

  // Check for editor changes
  if (editorRef.value && editorRef.value.isDirty()) return true;

  // Check for subject changes
  if (note.value && note.value.subject && currSubject.value !== note.value.subject) return true;

  // Check for tag changes
  const noteSet = new Set(note.value.tags);
  const currSet = new Set(currTags.value);
  if (
    note.value &&
    note.value.tags &&
    (noteSet.size !== currSet.size || !(noteSet.isSubsetOf(currSet) && currSet.isSubsetOf(noteSet)))
  )
    return true;

  return false;
}

const editorRef = ref(null);

const noteId = computed(() => route.params.id);
const isLoaded = ref(noteId.value ? false : true);

const notesRef = collection(db, 'users', user.value.uid, 'notes');
const notes = useCollection(notesRef);
const subjects = computed(() => [
  ...new Set(notes.value.filter((note) => note.subject).map((note) => note.subject)),
]);
const tags = computed(() => [
  ...new Set(notes.value.filter((note) => note.tags).flatMap((note) => note.tags)),
]);

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

const isEditing = ref(0);
const isTranscribing = ref(false);

const tooltipX = ref(0);
const tooltipY = ref(0);

function startRecording() {
  isTranscribing.value = true;

  // speechObj = new SpeechRecognition();
  // speechObj.start();
  // speechObj.onresult = (e) => {
  //   const transcript = e.results[0][0].transcript;

  //   appendToEditor(transcript);
  // };
  // speechObj.onend = () => {
  //   if (speechObj !== null && isTranscribing.value) {
  //     speechObj.start();
  //   }
  // };
}
function stopRecording() {
  // speechObj.stop();
  // speechObj = null;

  isTranscribing.value = false;
}

const currTitle = ref(noteId.value ? '' : 'Untitled Note');
const currSubject = ref('');
const currTags = ref([]);

function resetTitle() {
  if (noteId.value) currTitle.value = noteTitle.value;
  else currTitle.value = 'Untitled Note';

  isEditing.value = 0;
}

function appendToEditor(text) {
  if (!tinymce.activeEditor) {
    console.error('Failed to get editor content: editor has not been initialized');

    return;
  }

  editorRef.value.selection.select(editorRef.value.getBody(), true);
  editorRef.value.selection.collapse(false);
  editorRef.value.focus();

  editorRef.value.insertContent(text);
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
    subject: currSubject.value,
    tags: currTags.value,
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
    htmlContent: tinymce.activeEditor.getContent(),
    subject: currSubject.value,
    tags: currTags.value,
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

onUnmounted(() => {
  // if (speechObj !== null) {
  //   speechObj.stop();
  //   speechObj = null;
  // }
});
</script>

<template>
  <main v-if="isLoaded">
    <div id="header">
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
            <!-- TOOD: Put Frequencey Plot Here -->
            <span>Stop Transcription</span>
          </button>
        </div>

        <div class="button-set-center">
          <div id="title-edit" v-if="isEditing === 1">
            <input
              class="input has-background-light has-text-dark"
              type="text"
              v-model="currTitle"
            />

            <button
              v-if="noteId ? currTitle !== noteTitle : currTitle !== 'Untitled Note'"
              class="button"
              @click="resetTitle"
            >
              <CancelIcon />
            </button>
          </div>
          <span v-else id="title-edit" class="has-text-dark" @click="isEditing = 1">
            {{ currTitle }}
          </span>
        </div>

        <div>
          <button v-if="noteId" class="button is-warning" @click="updateNote" :disabled="isChanged">
            Update
          </button>
          <button v-else class="button is-primary" @click="submitNote">Submit</button>
        </div>
      </div>

      <div id="label-set">
        <span
          v-if="note.subject"
          class="course-pill"
          @click="
            (e) => {
              tooltipX = e.clientX;
              tooltipY = e.clientY;

              isEditing = 2;
            }
          "
        >
          {{ note.subject }}
        </span>

        <div
          id="tag-set"
          @click="
            (e) => {
              tooltipX = e.clientX;
              tooltipY = e.clientY;

              isEditing = 3;
            }
          "
        >
          <span v-for="(tag, idx) in currTags.sort()" :key="`${tag}-${idx}`" class="tag-pill">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <Editor
      id="uuid"
      licenseKey="gpl"
      :init="tinyMCEConfig"
      style="z-index: 29"
      :initial-value="noteContent"
    />
  </main>
  <main v-else>
    <div>Note is loading...</div>
  </main>

  <div v-if="isEditing !== 0" id="click-exit" @click="isEditing = 0"></div>
  <div
    v-if="isEditing === 2"
    id="subject-tooltip"
    class="tooltip"
    :style="'left: ' + (tooltipX + 10) + 'px; top: ' + (tooltipY + 10) + 'px;'"
  >
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

      <template #no-options="{ search }">{{ search }}</template>
    </v-select>
  </div>
  <div
    v-if="isEditing === 3"
    id="tag-tooltip"
    class="tooltip"
    :style="'left: ' + (tooltipX + 10) + 'px; top: ' + (tooltipY + 10) + 'px;'"
  >
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

      <template #no-options="{ search }">{{ search }}</template>
    </v-select>
  </div>
</template>

<style>
.vs__dropdown-toggle {
  border: 0;
}

.vs__search {
  line-height: 1.75;
  color: var(--bulma-input-placeholder-color);
}

.vs__selected-options {
  flex-wrap: nowrap;
  overflow: hidden;
}

#tag-edit .vs__selected-options {
  flex-wrap: wrap;
}

.vs__selected {
  text-wrap: nowrap;
}
</style>

<style scoped>
#click-exit {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 31;

  width: 100vw;
  height: 100vh;
}

#header {
  margin-bottom: 1rem;
}

#button-set {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  margin-bottom: 0.5rem;
}

.button-set-center {
  flex-grow: 1;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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

#label-set {
  width: 100%;
}

#tag-set {
  width: 100%;

  margin-top: 0.5rem;
}

.course-pill {
  border: 1px solid #000;
  border-radius: 999px;
  padding: 0.1rem 0.4rem;

  color: rgb(50, 50, 50);
  background: #f8b377;
  font-size: 1rem;
}

.tag-pill {
  margin-right: 0.5rem;
  border: 1px solid #000;
  border-radius: 999px;
  padding: 0.05rem 0.4rem;

  color: rgb(100, 100, 50);
  background: #ffd9b5;
  font-size: 0.9rem;
}

#subject-edit {
  min-width: 15rem;

  border-radius: var(--vs-border-radius);
}

#tag-edit {
  width: 25rem;

  border-radius: var(--vs-border-radius);
}

#tag-edit .vs__selected-options {
  flex-wrap: wrap;
}

#tooltip-container {
  position: relative;
}

#tooltip {
  min-width: 15rem;

  display: hidden;

  position: absolute;
  z-index: 32;
  right: 2.5rem;

  border: 3px solid black;
  border-radius: 15px;
  padding: 1rem;

  background-color: gray;
}

.tooltip {
  position: fixed;
  z-index: 32;

  border: 3px solid black;
  border-radius: 15px;
  padding: 1rem;

  background-color: gray;
}
</style>

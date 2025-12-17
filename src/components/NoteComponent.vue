<script>
// let speechObj = null;
</script>

<script setup>
import 'vue-select/dist/vue-select.css';

// import { nextTick } from 'vue';
import { computed, onUnmounted, ref, watch, onMounted } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useCollection, useCurrentUser, useDocument, useFirestore } from 'vuefire';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import PlayIcon from './icons/IconPlay.vue';
import StopIcon from './icons/IconStop.vue';
import CancelIcon from './icons/IconCross.vue';
import TagIcon from './icons/IconTag.vue';

// AUDIO TRANSCRIPTION ENGINE IMPORT
import AudioEngine from '@/components/AudioEngine.vue';

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
import 'tinymce/skins/ui/oxide/content';

// TinyMCE Default CSS
import 'tinymce/skins/content/default/content';

// TinyMCE Vue Setup
import Editor from '@tinymce/tinymce-vue';

/**
 * BEGIN AUDIO VARIABLES AND FUNCTIONS
 */

const isTranscribing = ref(false);
const transcriptionMode = ref('google'); // default
const apiSupport = ref(true);

let interimSpanId = null; // Temp span for interim results

// const setTranscriptionMode = async (mode) => {
//   if (transcriptionMode.value === mode) return;

//   const wasRecording = isTranscribing.value;

//   if (wasRecording) {
//     isTranscribing.value = false;
//     await nextTick(); // Wait for watchers to cleanup
//   }

//   // switch modes
//   transcriptionMode.value = mode;
//   if (wasRecording) {
//     isTranscribing.value = true;
//   }
// };

const handleTranscribed = (event) => {
  const { text, isFinal } = event;
  if (!text) return;

  const editor = tinymce.activeEditor;

  if (transcriptionMode.value === 'google') {
    if (isFinal) {
      // remove interim span if it exists
      if (interimSpanId) {
        editor.dom.remove(interimSpanId);

        interimSpanId = null;
      }

      appendToEditor(text + ' ');
    } else {
      showInterimText(text);
    }
  } else {
    appendToEditor(text + ' ');
  }
};

function showInterimText(text) {
  const editor = tinymce.activeEditor;

  if (!editor) return;

  editor.undoManager.ignore(() => {
    if (interimSpanId) {
      editor.dom.remove(interimSpanId);
    }

    interimSpanId = editor.dom.uniqueId('interim');

    editor.selection.select(editor.getBody(), true);
    editor.selection.collapse(false);

    editor.insertContent(
      `<span id="${interimSpanId}" style="opacity:0.5;">${editor.dom.encode(text)}</span>`,
    );
  });
}

const startRecording = () => {
  isTranscribing.value = true;
};

const stopRecording = () => {
  isTranscribing.value = false;
};

/**
 * END AUDIO VARIABLES AND FUNCTIONS
 */

const tinyMCEConfig = {
  plugins:
    'advlist anchor autolink autoresize charmap code fullscreen image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
  toolbar:
    'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  // height: 500,
  resize: false,
  promotion: false,
  branding: false,
  content_css: '/css/editorstyle.css',
};

const isFirefox = navigator.userAgent.includes('Firefox');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const transcriptionSupport =
  !isFirefox && typeof SpeechRecognition !== 'undefined' && typeof window.Worker !== 'undefined';

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

  if (isChanged.value) {
    if (!confirm('You have unsaved changes! Are you sure?')) return false;

    return true;
  }

  return true;
}

const isChanged = computed(() => {
  if (!note.value) return false;

  // Check for title changes
  if (currTitle.value !== note.value.title) return true;

  // Check for editor changes
  if (note.value.htmlContent && currContent.value !== note.value.htmlContent) return true;
  if (note.value.notes && !note.value.htmlContent) {
    console.warn(
      'This note contains only a notes entry, but new notes all contain htmlContent along with notes. Please update now!',
    );

    return true;
  }

  // Check for subject changes
  if (note.value.subject && currSubject.value !== note.value.subject) return true;

  // Check for tag changes
  const currSet = new Set(currTags.value);
  const noteSet = new Set(note.value.tags);
  if (
    note.value.tags &&
    (noteSet.size !== currSet.size || !(noteSet.isSubsetOf(currSet) && currSet.isSubsetOf(noteSet)))
  )
    return true;

  return false;
});

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

const isEditing = ref(0);
// const isTranscribing = ref(false);

const tooltipSide = ref('right');
const tooltipX = ref(0);
const tooltipY = ref(0);

// function startRecording() {
//   isTranscribing.value = true;

//   speechObj = new SpeechRecognition();
//   speechObj.continuous = true;
//   speechObj.start();
//   speechObj.onresult = (e) => {
//     const transcript = e.results[0][0].transcript;

//     appendToEditor(transcript);
//   };
//   speechObj.onend = () => {
//     if (speechObj !== null && isTranscribing.value) {
//       speechObj.start();
//     }
//   };
// }
// function stopRecording() {
//   speechObj.stop();
//   speechObj = null;

//   isTranscribing.value = false;
// }

const currTitle = ref(noteId.value ? '' : 'Untitled Note');
const currContent = ref('');
const currSubject = ref('');
const currTags = ref([]);

function appendToEditor(text) {
  if (!tinymce.activeEditor) {
    console.error('Failed to get editor content: editor has not been initialized');

    return;
  }

  const editor = tinymce.activeEditor;

  editor.selection.select(editor.getBody(), true);
  editor.selection.collapse(false);
  editor.focus();

  editor.insertContent(text);
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

function onEditClick(i, e) {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  // const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  tooltipX.value = e.clientX;
  tooltipY.value = e.clientY;

  if (vw - tooltipX.value < (vw * 40) / 100) {
    tooltipSide.value = 'left';
  } else {
    tooltipSide.value = 'right';
  }

  isEditing.value = i;
}

watch(note, () => {
  if (noteId.value && note.value) {
    currTitle.value = note.value.title;
    currContent.value = note.value.htmlContent ? note.value.htmlContent : note.value.notes;

    currSubject.value = note.value.subject ?? '';
    currTags.value = note.value.tags ?? [];

    isLoaded.value = true;
  }
});

// onUnmounted(() => {
//   if (speechObj !== null) {
//     speechObj.stop();
//     speechObj = null;
//   }
// });

onMounted(() => {
  if (SpeechRecognition !== undefined) {
    transcriptionMode.value = 'google';
    apiSupport.value = true;
  } else {
    transcriptionMode.value = 'private';
    apiSupport.value = false;
  }
});

onUnmounted(() => {
  isTranscribing.value = false;
});
</script>

<template>
  <main v-if="isLoaded">
    <div id="button-set">
      <div>
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

        <!-- <div class="mode-switch">
          <button
            class="button is-small"
            :disabled="!apiSupport"
            :class="transcriptionMode === 'google' ? 'is-info is-selected' : ''"
            @click="setTranscriptionMode('google')"
          >
            Online
          </button>

          <button
            class="button is-small"
            :class="transcriptionMode === 'private' ? 'is-info is-selected' : ''"
            @click="setTranscriptionMode('private')"
          >
            Local
          </button>
        </div> -->

        <div class="engine-wrapper" v-show="isTranscribing">
          <AudioEngine
            :isRecording="isTranscribing"
            :mode="transcriptionMode"
            @newTranscript="handleTranscribed"
          />
        </div>
      </div>

      <div class="button-set-center">
        <div id="title-edit" v-if="isEditing === 1">
          <input class="input" type="text" v-model="currTitle" />

          <button
            v-if="noteId ? currTitle !== note.title : currTitle !== ''"
            class="button"
            @click="currTitle = note.title"
          >
            <CancelIcon />
          </button>
        </div>
        <span v-else id="title-edit" @click="isEditing = 1">
          {{ currTitle.length !== 0 ? currTitle : 'Untitled Note' }}
        </span>
      </div>

      <div id="desktop-buttons">
        <button v-if="noteId" class="button is-warning" @click="updateNote" :disabled="!isChanged">
          Update
        </button>
        <button v-else class="button is-primary" @click="submitNote">Submit</button>
      </div>
    </div>

    <div id="label-set">
      <div id="subject-set" @click="(e) => onEditClick(2, e)">
        <span class="course-pill">
          {{ currSubject ? currSubject : 'No Subject' }}
        </span>
      </div>

      <div id="tag-set">
        <span
          v-for="(tag, idx) in currTags.sort()"
          :key="`${tag}-${idx}`"
          class="tag-pill"
          @click="(e) => onEditClick(3, e)"
        >
          <TagIcon class="is-small" /> {{ tag }}
        </span>

        <span v-if="currTags.length === 0" class="tag-pill" @click="(e) => onEditClick(3, e)">
          <TagIcon size="is-small" /> No Tags
        </span>
      </div>
    </div>

    <Editor
      id="uuid"
      licenseKey="gpl"
      :init="tinyMCEConfig"
      style="z-index: 29"
      v-model="currContent"
    />

    <div id="mobile-buttons" class="buttons is-centered">
      <button
        v-if="noteId"
        id="mobile-update-btn"
        class="button is-warning"
        @click="updateNote"
        :disabled="!isChanged"
      >
        Update
      </button>
      <button v-else id="mobile-update-btn" class="button is-primary" @click="submitNote">
        Submit
      </button>
    </div>
  </main>
  <main v-else>
    <div>Note is loading...</div>
  </main>

  <div v-if="isEditing !== 0" id="click-exit" @click="isEditing = 0"></div>
  <div
    v-if="isEditing === 2"
    id="subject-tooltip"
    class="tooltip"
    :style="
      tooltipSide === 'right'
        ? 'left: ' + (tooltipX + 10) + 'px; top: ' + (tooltipY + 10) + 'px;'
        : 'left: ' + (tooltipX - 450) + 'px; top: ' + (tooltipY + 10) + 'px;'
    "
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

    <button
      v-if="noteId && note.subject ? currSubject !== note.subject : false"
      class="button"
      @click="currSubject = note.subject"
    >
      <CancelIcon />
    </button>
  </div>
  <div
    v-if="isEditing === 3"
    id="tag-tooltip"
    class="tooltip"
    :style="
      tooltipSide === 'right'
        ? 'left: ' + (tooltipX + 10) + 'px; top: ' + (tooltipY + 10) + 'px;'
        : 'left: ' + (tooltipX - 450) + 'px; top: ' + (tooltipY + 10) + 'px;'
    "
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

    <button
      v-if="noteId && note.tags ? currTags !== note.tags : false"
      class="button"
      @click="currTags = note.tags"
    >
      <CancelIcon />
    </button>
  </div>
</template>

<style>
.tox-tinymce {
  border-color: var(--border) !important;

  background-color: var(--editor) !important;
}

.tox-editor-header,
.tox-sidebar-wrap,
.tox-promotion,
.tox-menubar,
.tox-toolbar-overlord,
.tox-toolbar__primary,
.tox-anchorbar,
.tox-statusbar {
  border-color: var(--border) !important;

  background-color: var(--card) !important;
}

.tox-mbtn,
.tox-tbtn {
  color: var(--text) !important;

  background-color: var(--editor-btn-bg) !important;
}

.tox-mbtn,
.tox-tbtn svg {
  fill: var(--text) !important;
}

.tox-edit-area__iframe {
  color: var(--text) !important;

  background-color: var(--editor) !important;
}

.tox-statusbar__path-item,
.tox-statusbar__wordcount {
  color: var(--text) !important;
}

body#tinymce {
  color: var(--text) !important;
}

.vs__dropdown-toggle {
  border: 0;
}

.vs__search {
  line-height: 1.75;
  color: var(--bulma-input-placeholder-color);
}

.vs__selected-options {
  flex-wrap: wrap;
  overflow: hidden;
}

.vs__selected {
  text-wrap: nowrap;
}
</style>

<style scoped>
main {
  margin: 0 1rem;
  padding-bottom: 3rem;
}

#click-exit {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 28;

  width: 100vw;
  height: 100vh;
}

#button-set {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  margin-bottom: 0.5em;
}

.button-set-center {
  flex-grow: 1;

  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

#title-edit {
  flex-grow: 2;

  position: relative;
  z-index: 29;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  cursor: pointer;
}

#title-edit input {
  color: var(--text);
  background-color: var(--bg);
}

span#title-edit {
  padding: 7px 11px;

  color: var(--text);
  background-color: var(--bg);
}

#label-set {
  width: 100%;

  margin-bottom: 1rem;
}

#subject-set {
  width: 100%;
}

#tag-set {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.75rem;

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

  cursor: pointer;
}

.tag-pill {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;

  width: fit-content;

  border: 1px solid #000;
  border-radius: 999px;
  padding: 0.05rem 0.4rem;

  color: rgb(100, 100, 50);
  background: #ffd9b5;
  font-size: 0.9rem;

  cursor: pointer;
}

#subject-edit {
  width: 100%;

  border-radius: var(--vs-border-radius);
}

#tag-edit {
  width: 100%;

  border-radius: var(--vs-border-radius);
}

#tag-edit .vs__selected-options {
  flex-wrap: wrap;
}

.tooltip {
  width: 40vw;

  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  position: fixed;
  z-index: 32;

  border: 3px solid black;
  border-radius: 15px;
  padding: 1rem;

  background-color: var(--modal-color);
}

#mobile-buttons {
  display: none;
}

@media (max-width: 768px) {
  #button-set {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #desktop-buttons {
    display: none;
  }

  #mobile-buttons {
    display: flex;

    margin-top: 1rem;
  }

  .tooltip {
    width: 100vw;
    left: 0px !important;
  }

  #tag-edit {
    width: 100%;
  }
}
</style>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrentUser, useDocument, useFirestore } from 'vuefire';
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
    'advlist anchor autolink charmap code fullscreen image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
  toolbar:
    'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  height: 500,
  resize: false,
  promotion: false,
};

const router = useRouter();
const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();

const noteId = computed(() => route.params.id);
const isLoaded = ref(noteId.value ? false : true);

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

const isTranscribing = ref(false);
const isEditingTitle = ref(false);

const currTitle = ref(noteId.value ? '' : 'Untitled Note');
function resetTitle() {
  if (noteId.value) currTitle.value = noteTitle.value;
  else currTitle.value = 'Untitled Note';

  isEditingTitle.value = false;
}

function appendToEditor(text) {
  if (!tinymce.activeEditor) {
    console.error('Failed to get editor content: editor has not been initialized');

    return;
  }

  tinymce.activeEditor.execCommand('mceInsertContent', false, text);
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

    isLoaded.value = true;
  }
});
</script>

<template>
  <main v-if="isLoaded">
    <div id="button-set">
      <div class="">
        <button v-if="!isTranscribing" class="button is-success" @click="isTranscribing = true">
          <PlayIcon />
          <span>Start Transcription</span>
        </button>
        <button v-else class="button is-danger" @click="isTranscribing = false">
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
        <span v-else id="title-edit" @click="isEditingTitle = true">
          {{ currTitle }}
        </span>
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
}

#title-edit {
  position: relative;
  z-index: 32;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
</style>

<script setup>
import { computed, ref } from 'vue';
import { useCurrentUser, useFirestore } from 'vuefire';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import PlayIcon from './icons/IconPlay.vue';
import StopIcon from './icons/IconStop.vue';
import CancelIcon from '@/components/icons/IconCross.vue';
import SaveIcon from '@/components/icons/IconSave.vue';

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

const db = useFirestore();
const user = useCurrentUser();

const isTranscribing = ref(false);

const isEditingTitle = ref(false);
const title = ref('');
const newTitle = ref('');

const contentTitle = computed(() => (title.value ? title.value : 'Untitled Note'));
function resetTitle() {
  newTitle.value = '';

  isEditingTitle.value = false;
}
function updateTitle() {
  title.value = newTitle.value;

  isEditingTitle.value = false;
}

async function submit() {
  if (!tinymce.activeEditor) {
    console.error('Failed to get editor content: editor has not been initialized');

    return;
  }

  const data = {
    title: title.value,
    notes: tinymce.activeEditor.getContent({ format: 'text' }),
    html: tinymce.activeEditor.getContent(),
    createdAt: serverTimestamp(),
    lastEdited: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, 'users', user.value.uid, 'notes'), data);
  } catch (e) {
    console.error('error:', e);
  }
}
</script>

<template>
  <main>
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
          <input class="input has-background-light has-text-dark" type="text" v-model="newTitle" />
          <button class="button" @click="resetTitle">
            <CancelIcon />
          </button>
          <button class="button" @click="updateTitle">
            <SaveIcon />
          </button>
        </div>
        <span v-else id="title-edit" @click="isEditingTitle = true">{{ contentTitle }}</span>
      </div>

      <div class="">
        <button class="button is-primary" @click="submit">Submit</button>
      </div>
    </div>

    <editor id="uuid" licenseKey="gpl" :init="tinyMCEConfig" style="z-index: 29" />
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

<script setup>
// eslint-disable-next-line no-unused-vars
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
</script>

<template>
  <editor id="uuid" licenseKey="gpl" :init="tinyMCEConfig" />
</template>

<style scoped></style>

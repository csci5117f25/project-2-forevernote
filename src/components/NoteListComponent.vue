<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCollection, useCurrentUser, useFirestore } from 'vuefire';
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import PlusIcon from './icons/IconPlus.vue';
import PinIcon from './icons/IconPin.vue';
import PinFillIcon from './icons/IconPinFill.vue';
import TrashIcon from './icons/IconTrashFill.vue';
import DownIcon from './icons/IconDownCheveron.vue';

const router = useRouter();

const user = useCurrentUser();
const db = useFirestore();

const notesRef = collection(db, 'users', user.value.uid, 'notes');
const notes = useCollection(notesRef);

const selectionSet = ref(new Set());
const anySelected = computed(() => selectionSet.value && selectionSet.value.size > 0);

const expandedSet = ref(new Set());

watch(
  notes,
  (newNotes) => {
    if (!newNotes) return;
    newNotes.forEach((n) => {
      if (n && n.isSelected === undefined) { n.isSelected = false; };
    });
  },
  { immediate: true, deep: true }
);


// ---------- FILTER STATE ----------
const titleFilter = ref('');
const subjectFilter = ref('');
const pinnedOnly = ref(false);
const sortBy = ref('updatedDesc'); // updatedDesc | updatedAsc | titleAsc | titleDesc

// ---------- CORE FILTER FUNCTION ----------
function sortByFn(a, b) {
  switch (sortBy.value) {
    case 'updatedDesc':
      return b.lastEdited - a.lastEdited;
    case 'updatedAsc':
      return a.lastEdited - b.lastEdited;
    case 'titleAsc':
      return a.title.localeCompare(b.title);
    case 'titleDesc':
      return b.title.localeCompare(a.title);
  }
}
const filteredNotes = computed(() => {
  const titleLc = titleFilter.value.trim().toLowerCase();
  const classLc = subjectFilter.value.trim().toLowerCase();

  let filtered = notes.value.filter((note) => {
    // If only showing pinned
    if (pinnedOnly.value) {
      if (!note.pinned) return false;
    }

    // If query by title
    if (titleLc.length !== 0) {
      if (!note.title) return false;

      if (!note.title.trim().toLowerCase().includes(titleLc)) return false;
    }

    // If query by subject
    if (classLc.length !== 0) {
      if (!note.subject && !note.tags) return false;
      if (!`${note.subject.trim().toLowerCase()} ${(note.tags || []).join(' ')}`.includes(classLc)) return false;
    }

    return true;
  });

  let [pinned, unpinned] = filtered.reduce(
    (acc, note) => {
      acc[note.pinned ? 0 : 1].push(note);

      return acc;
    },
    [[], []],
  );

  pinned.sort(sortByFn);
  unpinned.sort(sortByFn);

  const out = [...pinned, ...unpinned]

  return out;
});

// ---------- UI ACTIONS ----------
function toggleSelected(note) {
  note.isSelected = !note.isSelected;

  if (note.isSelected) {
    selectionSet.value.add(note);
  } else {
    selectionSet.value.delete(note);
  }
}

async function pinNote(id) {
  try {
    await updateDoc(doc(db, 'users', user.value.uid, 'notes', id), {
      pinned: true,
    });
  } catch (e) {
    console.error('unable to pin note:', e);
  }
}

async function pinSelectedNotes() {
  const promises = [];

  const is_all_pinned = Array.from(selectionSet.value).every((note) => note.pinned);

  selectionSet.value.forEach((note) => {
    if (is_all_pinned){

      promises.push(
        updateDoc(doc(db, 'users', user.value.uid, 'notes', note.id), {
          pinned: false,
        })
      );
    } else {
      promises.push(
        updateDoc(doc(db, 'users', user.value.uid, 'notes', note.id), {
          pinned: true,
        })
      );
    }

  });

  try {
    await Promise.all(promises);
    selectionSet.value.clear();
  } catch (e) {
    console.error('unable to pin notes:', e);
  }
}

async function unpinNote(id) {
  try {
    await updateDoc(doc(db, 'users', user.value.uid, 'notes', id), {
      pinned: false,
    });
  } catch (e) {
    console.error('unable to unpin note:', e);
  }
}

async function deleteNote(id) {
  try {
    await deleteDoc(doc(db, 'users', user.value.uid, 'notes', id));
  } catch (e) {
    console.error('unable to delete note:', e);
  }
}

async function deleteSelectedNotes() {
  const promises = [];

  selectionSet.value.forEach((note) => {
    promises.push(
      deleteDoc(doc(db, 'users', user.value.uid, 'notes', note.id))
    );
  });

  try {
    await Promise.all(promises);
    selectionSet.value.clear();
  } catch (e) {
    console.error('unable to delete notes:', e);
  }
}

function togglePreview(note) {
  const s = expandedSet.value || new Set();
  if (s.has(note.id)) s.delete(note.id);
  else s.add(note.id);
  expandedSet.value = new Set(s);

  console.log("expandedSet.value: ", expandedSet.value);
}

</script>

<template>
  <div class="notes-page">
    <!-- searching features -->
    <section class="search-row">
      <div class="search-box">
        <input v-model="titleFilter" type="text" placeholder="<search by title>" />
      </div>
      <div class="search-box">
        <input v-model="subjectFilter" type="text" placeholder="<search by class or tags>" />
      </div>
    </section>

    <section class="controls-row">
      <label class="control-chip">
        <input type="checkbox" v-model="pinnedOnly" />
        <span>Pinned only</span>
      </label>

      <select v-model="sortBy" autocomplete="off">
        <option value="updatedDesc">Sort: Last edited ↓</option>
        <option value="updatedAsc">Sort: Last edited ↑</option>
        <option value="titleAsc">Sort: Title A-Z</option>
        <option value="titleDesc">Sort: Title Z-A</option>
      </select>

      <div v-if="anySelected">
        <button class="selected-text-functionality" @click="pinSelectedNotes"><PinFillIcon color="red" />Pin notes</button>
        <button class="selected-text-functionality" @click="deleteSelectedNotes"><TrashIcon />Delete notes</button>
      </div>
    </section>

    <!-- NOTES LIST -->
    <section class="notes-list">
      <article v-for="note in filteredNotes" :key="note.id" class="note-row">
        <button
          class="select-circle"
          :class="{ selected: note.isSelected }"
          @click.stop="toggleSelected(note)"
        />

        <div class="note-main" @click="router.push({ name: 'note', params: { id: note.id } })">
          <div class="note-title">
            {{ note.title }}
          </div>
          <div class="note-subline">
            <span v-if="note.subject" class="course-pill">
              {{ note.subject }}
            </span>

            <span
              v-for="(tag, idx) in note.tags"
              :key="`${tag}-${idx}`"
              :class="idx === 0 ? 'tag-pill' : 'tag-pill'"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="note-meta">
          <div class="meta-line">Last Edited: {{ note.lastEdited.toDate().toLocaleString() }}</div>
        </div>

        <!-- notes actions -->
        <div class="note-actions">
          <button v-if="note.pinned" class="icon-btn active" @click="unpinNote(note.id)">
            <PinFillIcon color="red" />
          </button>
          <button v-else @click="pinNote(note.id)">
            <PinIcon />
          </button>

          <button class="icon-btn icon-delete" title="Delete" @click="deleteNote(note.id)">
            <TrashIcon />
          </button>

          <button class="icon-btn expand" title="More" @click.stop="togglePreview(note)">
            <DownIcon :class="['expand-icon', { rotated: expandedSet.has(note.id) }]"/>
          </button>
        </div>

        <transition name="slide-fade">
          <div class="note-preview-row" :class="{ open: expandedSet.has(note.id) }" v-if="note.htmlContent">
            <div class="note-preview" v-html="note.htmlContent"></div>
          </div>

          <div class="note-preview-row" :class="{ open: expandedSet.has(note.id) }" v-else>
            <div class="note-preview">{{ note.notes }}</div>
          </div>
        </transition>
      </article>
    </section>
  </div>

  <button id="new-note" @click="router.push({ name: 'new_note' })">
    <PlusIcon class="is-large" />
  </button>
</template>

<style scoped>
.notes-page {
  position: relative;
  width: 98%;
  margin: 1% auto;
  padding: 1.2rem 1.8rem 4rem;
  background: #f5f5f5;
  box-sizing: border-box;
}

/* SEARCH BAR ROW (purple rectangles) */
.search-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.search-box {
  background: #ffffff;
  /* border-color: #00D1B2; */
  border: 3px solid #00d1b2;
  border-radius: 1rem;
  padding: 0.35rem 0.6rem;
}

.search-box input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.3rem 0.4rem;
  font-size: 0.95rem;
}

.search-box input:focus {
  outline: none;
}

/* CONTROLS ROW */
.controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-bottom: 0.8rem;
  align-items: center;
  font-family: sans-serif;
  color: #000;
  font-size: 0.8rem;
}

.control-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  /* border: 1px solid #ccc; */
  border: 1px solid #00d1b2;
  background: #fff;
  font-size: 0.8rem;
  cursor: pointer;
}

.control-chip input {
  margin: 0;
}

.controls-row select {
  border-radius: 999px;
  border: 1px solid #00d1b2;
  /* border: 1px solid #ccc; */
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  background: #fff;
}

.selected-text-functionality{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.9rem;
}
/* NOTES LIST */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.note-row {
  display: grid;
  grid-template-columns: auto minmax(0, 2.5fr) minmax(0, 1.3fr) auto;
  align-items: center;
  column-gap: 0.6rem;
  background: rgb(252, 164, 0);
  background-image: linear-gradient(to right, rgb(252, 164, 0), rgb(183, 119, 0));
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
}

.note-preview-row {
  margin: 0.25rem 0 0 0;
  grid-column: 2 / -1;
  color: #000;
  background: #FFF;
  overflow: hidden;
  max-height: 0;
  transition: max-height 300ms ease;
  border-radius: 0.25rem;
}

.note-preview-row.open {
  max-height: 1000px;
}

.note-preview {
  padding: 0.5rem;
  max-height: 50vh;
  overflow: auto;   /* allow scrolling if content is tall */
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 1s cubic-bezier(.2,.9,.2,1), transform 1s cubic-bezier(.2,.9,.2,1), max-height 1s cubic-bezier(.2,.9,.2,1);
  overflow: hidden;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 400px; /* large enough to contain preview */
}

/* Notion-style checkbox */
.select-circle {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid #000;
  background: #fff;
  cursor: pointer;
}

.select-circle.selected {
  background: #000;
}

/* Main note content */
.note-main {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  cursor: pointer;
}

.note-title {
  background: rgb(252, 143, 0);
  /* background-image: linear-gradient(to right, rgb(252, 164, 0), rgb(183, 119, 0)); */
  border: 1.5px solid #000;
  padding: 0.25rem 0.4rem;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #000;
}

.note-subline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.course-pill {
  border-radius: 999px;
  border: 1px solid #000;
  padding: 0.1rem 0.4rem;
  background: #f8b377;
  font-size: 0.75rem;
  color: rgb(50, 50, 50);
}

.tag-pill {
  border-radius: 999px;
  border: 1px solid #000;
  padding: 0.05rem 0.4rem;
  background: #ffd9b5;
  font-size: 0.7rem;
  color: rgb(100, 100, 50);
}

/* Meta info */
.note-meta {
  font-size: 0.75rem;
  color: #2b2b2b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.1rem;
}

.meta-line {
  line-height: 1.1;
}

.meta-line.due-soon {
  color: #c62828;
  font-weight: 700;
}

.meta-line.overdue {
  color: #b71c1c;
  font-weight: 800;
}

/* Actions */
.note-actions {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.05rem;
  padding: 0.15rem;
}

.icon-btn.active {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6));
}

.icon-btn.icon-delete {
  font-size: 1.2rem;
  /* font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', system-ui, sans-serif; */
}

.icon-btn.expand {
  font-size: 1.2rem;
}

.expand-icon {
  display: inline-block;
  transition: transform 1s cubic-bezier(.2,.9,.2,1);
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* Floating add button */
#new-note {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;

  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .search-row {
    grid-template-columns: 1fr;
  }

  .note-row {
    grid-template-columns: auto minmax(0, 2fr);
    grid-template-rows: auto auto;
    grid-template-areas:
      'circle main actions'
      'circle meta actions';
  }

  .select-circle {
    grid-area: circle;
  }

  .note-main {
    grid-area: main;
  }

  .note-meta {
    grid-area: meta;
  }

  .note-actions {
    grid-area: actions;
    justify-content: flex-end;
  }
}
</style>

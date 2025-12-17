<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCollection, useCurrentUser, useFirestore } from 'vuefire';
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import PlusIcon from './icons/IconPlus.vue';
import PinIcon from './icons/IconPin.vue';
import PinFillIcon from './icons/IconPinFill.vue';
import TrashIcon from './icons/IconTrashFill.vue';
import DownIcon from './icons/IconDownCheveron.vue';
import TagIcon from './icons/IconTag.vue';

const router = useRouter();

const user = useCurrentUser();
const db = useFirestore();

const notesRef = collection(db, 'users', user.value.uid, 'notes');
const notes = useCollection(notesRef);

// === Filter State ===
const titleFilter = ref('');
const subjectFilter = ref('');
const pinnedOnly = ref(false);
const sortBy = ref('updatedDesc'); // updatedDesc | updatedAsc | titleAsc | titleDesc

// === Core Filter Function ===
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
      if (!note.subject) return false;

      if (!note.subject.trim().toLowerCase().includes(classLc)) return false;
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

  return [...pinned, ...unpinned];
});

// === UI Actions ===
function toggleSelected(note) {
  note.isSelected = !note.isSelected;
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
</script>

<template>
  <div class="notes-page">
    <!-- Searching Features -->
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
    </section>

    <!-- Notes List -->
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
              <TagIcon class="is-small" /> {{ tag }}
            </span>
          </div>
        </div>

        <div class="note-meta">
          <div class="meta-line">Last Edited: {{ note.lastEdited.toDate().toLocaleString() }}</div>
        </div>

        <!-- notes actions -->
        <div class="note-actions">
          <button v-if="note.pinned" class="button" @click="unpinNote(note.id)">
            <PinFillIcon color="red" />
          </button>
          <button v-else class="button" @click="pinNote(note.id)">
            <PinIcon />
          </button>

          <button class="button" title="Delete" @click="deleteNote(note.id)">
            <TrashIcon />
          </button>

          <button class="icon-btn expand" title="More">
            <DownIcon />
          </button>
        </div>
      </article>
    </section>
  </div>

  <button id="new-note" @click="router.push({ name: 'new_note' })">
    <PlusIcon class="is-large" />
  </button>
</template>

<style scoped>
.notes-page {
  width: 98%;
  position: relative;

  margin: 1% auto;
  padding: 1.2rem 1.8rem 4rem;
  box-sizing: border-box;

  background-color: var(--bg);
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
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  align-items: center;
}

.control-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  border-radius: 999px;
  border: 1px solid #00d1b2;
  padding: 0.25rem 0.6rem;

  font-size: 0.8rem;
  background: #fff;
  color: #121212;

  cursor: pointer;
}

.control-chip input {
  margin: 0;
}

.controls-row select {
  border: 1px solid #00d1b2;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;

  font-family: inherit;
  font-size: 0.8rem;
  background: #fff;

  cursor: pointer;
}

/* Notes List */
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  width: fit-content;

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

.button {
  background-color: transparent;
  border: 0px;
  box-shadow: none;
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
    margin-top: 0.25rem;
  }

  .note-actions {
    grid-area: actions;
    justify-content: flex-end;
  }
}
</style>

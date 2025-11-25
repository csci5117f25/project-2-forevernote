<script setup>
import { ref, computed } from 'vue';

import NoteDropdownIcon from '@/components/icons/NoteDropdownIcon.vue';

// TODO: replace with real data from backend or local storage
const notes = ref(
  [
    {
      id: 1,
      title: 'Linear Algebra — Eigenvalues & Eigenvectors',
      subject: 'CSCI 4511',
      tags: ['Linear Algebra', 'Lecture'],
      lastEdited: '2026-10-22',
      isPinned: true,

      notes:
        'Eigenvalues and eigenvectors describe how linear transformations stretch or rotate vectors. They are essential in PCA, differential equations, and analyzing systems that evolve over time. Understanding them helps simplify complex matrix operations.',
    },
    {
      id: 2,
      title: 'Cognitive Psychology — Memory Encoding',
      subject: 'PSY 3041',
      tags: ['Psych', 'Reading'],
      lastEdited: '2026-10-12',
      isPinned: false,

      notes:
        'Memory encoding is the process of converting sensory input into a form the brain can store. Encoding quality is influenced by attention, depth of processing, and emotional context. It forms the foundation for later retrieval and long-term learning.',
    },
    {
      id: 3,
      title: 'Organic Chemistry — SN1 vs SN2',
      subject: 'CHEM 2301',
      tags: ['Organic Chem', 'Exam Prep'],
      lastEdited: '2026-09-30',
      isPinned: false,
      notes:
        'SN1 reactions proceed through a carbocation intermediate and are favored by stable intermediates and polar protic solvents. SN2 reactions occur in one concerted step and require strong nucleophiles. The substrate structure determines which mechanism occurs.',
    },
    {
      id: 4,
      title: 'Computer Networks — TCP Congestion Control',
      subject: 'CSCI 4211',
      tags: ['Networks', 'Project'],
      lastEdited: '2026-10-01',
      isPinned: true,

      notes:
        'TCP uses algorithms like slow start, congestion avoidance, and fast recovery to regulate packet flow. These mechanisms adjust transmission speed based on perceived network congestion, improving reliability and preventing network overload during communication.',
    },
    {
      id: 5,
      title: 'Microeconomics — Elasticity of Demand',
      subject: 'ECON 1101',
      tags: ['Econ', 'Lecture'],
      lastEdited: '2026-09-10',
      isPinned: false,

      notes:
        'Elasticity measures how sensitive consumer demand is to price changes. Goods with close substitutes tend to have higher elasticity. Understanding elasticity helps predict revenue changes and guides pricing strategies in competitive markets.',
    },
  ].map((n) => ({
    ...n,
    _titleLc: `${n.title.toLowerCase()} ${n.subject.toLowerCase()}`,
    _classLc: `${n.tags.join(' ')} ${n.subject.toLowerCase()}`.toLowerCase(),
    lastEditedTs: new Date(n.lastEdited).getTime(),
    isSelected: false,
  })),
);

// ---------- FILTER STATE ----------
const filters = ref({
  titleQuery: '',
  classQuery: '',
  showPinnedOnly: false,
  sortBy: 'updatedDesc', // updatedDesc | updatedAsc | titleAsc | titleDesc
});

// ---------- CORE FILTER FUNCTION ----------
const filteredNotes = computed(() => {
  const {
    titleQuery,
    classQuery,
    showPinnedOnly,
    sortBy, // updatedDesc | updatedAsc | titleAsc | titleDesc
  } = filters.value;

  const titleLc = titleQuery.trim().toLowerCase();
  const classLc = classQuery.trim().toLowerCase();

  let result = notes.value.filter((note) => {
    if (showPinnedOnly && !note.isPinned) return false;
    if (titleLc && !note._titleLc.includes(titleLc)) return false;
    if (classLc && !note._classLc.includes(classLc)) return false;

    return true;
  });
  // console.log("result", result)

  result = [...result].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    switch (sortBy) {
      case 'updatedDesc':
        return b.lastEditedTs - a.lastEditedTs;
      case 'updatedAsc':
        return a.lastEditedTs - b.lastEditedTs;
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return result;
});

// ---------- UI ACTIONS ----------
function toggleSelected(note) {
  note.isSelected = !note.isSelected;
}

function togglePinned(note) {
  note.isPinned = !note.isPinned;
}

function deleteNote(id) {
  notes.value = notes.value.filter((n) => n.id !== id);
}

function openNote(note) {
  console.log('open note', note.id);
}

function createNewNote() {
  console.log('create new note');
}
</script>

<template>
  <div class="notes-page">
    <!-- searching features -->
    <section class="search-row">
      <div class="search-box">
        <input v-model="filters.titleQuery" type="text" placeholder="<search by title>" />
      </div>
      <div class="search-box">
        <input v-model="filters.classQuery" type="text" placeholder="<search by class or tags>" />
      </div>
    </section>

    <section class="controls-row">
      <label class="control-chip">
        <input type="checkbox" v-model="filters.showPinnedOnly" />
        <span>Pinned only</span>
      </label>

      <select v-model="filters.sortBy">
        <option value="updatedDesc">Sort: Last edited ↓</option>
        <option value="updatedAsc">Sort: Last edited ↑</option>
        <!-- <option value="dueAsc">Sort: Due date ↑</option>
        <option value="dueDesc">Sort: Due date ↓</option> -->
        <option value="titleAsc">Sort: Title A-Z</option>
        <option value="titleDesc">Sort: Title Z-A</option>
      </select>
    </section>

    <!-- NOTES LIST -->
    <section class="notes-list">
      <article v-for="note in filteredNotes" :key="note.id" class="note-row">
        <button
          class="select-circle"
          :class="{ selected: note.isSelected }"
          @click.stop="toggleSelected(note)"
        />
        <!-- TODO: add a global delete or pin button here -->

        <!-- TODO: clicking on this note should redirect to the /editor route? -->
        <div class="note-main" @click="openNote(note)">
          <div class="note-title">
            {{ note.title }}
          </div>
          <div class="note-subline">
            <span class="course-pill">
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
          <div class="meta-line">last edited: {{ note.lastEdited }}</div>
          <!-- <div class="meta-line" :class="{ 'due-soon': isDueSoon(note), overdue: isOverdue(note) }">
            due: {{ note.dueDate || '—' }}
          </div> -->
        </div>

        <!-- notes actions -->
        <div class="note-actions">
          <button
            class="icon-btn"
            :class="{ active: note.isPinned }"
            title="Pin"
            @click.stop="togglePinned(note)"
          >
            📌
          </button>
          <!-- TODO: might remove this and just have a global delete or pin button with the select multiple notes features -->

          <button
            class="icon-btn icon-delete"
            title="Delete"
            @click.stop="deleteNote(note.id)"
            aria-label="Delete note"
          >
            <span aria-hidden="true">🗑</span>
            <!-- TODO: make this trash a little transparent when it is not hovered on -->
          </button>
          <!-- TODO: might remove this and just have a global delete or pin button with the select multiple notes features -->

          <button class="icon-btn expand" title="More">
            <!-- TODO: display the notes slightly? or redirect the the edit page -->
            <NoteDropdownIcon :size="18" className="expand-icon" />
          </button>
        </div>
      </article>
    </section>

    <button class="add-note-btn" @click="createNewNote">+</button>
    <!-- TODO: add the functionality for this button. redirect to the /editor route??? -->
  </div>
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
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  align-items: center;
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
  font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', system-ui, sans-serif;
}

.icon-btn.expand {
  font-size: 1.2rem;
}

/* Floating add button */
.add-note-btn {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 54px;
  height: 54px;
  border-radius: 999px;
  border: 3px solid #000;
  background: #fff;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
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

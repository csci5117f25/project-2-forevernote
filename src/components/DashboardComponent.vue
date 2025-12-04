<script setup>
import 'vue3-carousel/carousel.css';

import { ref, computed } from 'vue';
import { useCollection, useCurrentUser, useFirestore } from 'vuefire';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { collection } from 'firebase/firestore';

import CreateExamModal from './NewExamModal.vue';

const user = useCurrentUser();
const db = useFirestore();

// const emits = defineEmits("close-new-modal");

const notesRef = computed(() => collection(db, 'users', user.value.uid, 'notes'));
const notes = useCollection(notesRef);
const examsRef = computed(() => collection(db, 'users', user.value.uid, 'exams'));
const exams = useCollection(examsRef);
console.log(`exams for user: ${user.value.uid}: ${exams.value}`);

const carouselConfig = {
  itemsToShow: 1.20,
  mouseWheel: true,
  wrapAround: true,
  gap: 50,
};

// const carouselConfigForOne = {
//   itemsToShow: 0.75,
//   wrapAround: false,
// };

const showModal = ref(false);
function showNewExamModal() {
  showModal.value = true;
}
</script>

<template>
  <div id="dashboard-container">
    <div id="greeting">
      <h1>Hey {{ user.displayName }}!</h1>
    </div>

    <div id="recent-notes">
      <h2>Recently Viewed Notes</h2>

      <Carousel id="note-carousel" class="gallery" v-bind="carouselConfig">
        <Slide v-for="note in notes" :key="note.id" class="gallery-cell note-cell">
          <div class="gallery-cell-header">
            <h2>{{ note.title }}</h2>
          </div>

          <div class="note-preview">
            <p>{{ note.notes }}</p>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>

    <div id="upcoming-exams">
      <div id="upcoming-exams-h">
        <h2>Upcoming Exams⏳</h2>

        <button
          id="add-exam-button"
          class="button is-primary is-dark is-small is-rounded"
          @click="showNewExamModal"
        >
          Create New Exam
        </button>
      </div>

      <Carousel id="exam-carousel" class="gallery" v-bind="carouselConfig">
        <Slide v-for="exam in exams" :key="exam.id" class="gallery-cell exam-cell">
          <div class="gallery-cell-header">
            <h2>{{ exam.subject }}</h2>
          </div>

          <div class="exam-details">
            <h2 v-if="exam.examDate">🗓️ {{ exam.examDate.toDate().toLocaleDateString() }}</h2>
            <h2 v-if="exam.examDate">🕐 {{ exam.examDate.toDate().toLocaleTimeString() }}</h2>
            <h2 v-if="exam.location">📍 {{ exam.location }}</h2>
            <h2 v-if="exam.topics.length !== 0">💡 Topics:</h2>
            <ul v-if="exam.topics.length !== 0">
              <li v-for="topic in exam.topics" :key="topic">💡{{ topic }}</li>
            </ul>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>

    <CreateExamModal v-if="showModal" @close-modal="showModal = false"></CreateExamModal>
  </div>
</template>

<style scoped>
#dashboard-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: left;

  padding: 0rem 2rem 10rem;
  width: 98%;
  margin: 1%;
  gap: 1rem;
}

#greeting {
  display: flex;
  flex-direction: row;
  text-align: left;
}

#greeting > h1 {
  color: rgb(0, 0, 0);
  width: 100%;
  font-size: 4rem;
  font-weight: 700;
}

/* #recent-notes {} */

/* #upcoming-exams {} */
#upcoming-exams-h {
  display: flex;
  flex-direction: row;

  margin-bottom: 2%;
}

#add-exam-button {
  align-items: flex-end;
}

/* #note-carousel {} */
/* #exam-carousel {} */

/* Generic Class CSS */
.gallery {
  height: 40vh;
}

.gallery-cell {
  display: flex;
  flex-direction: column;
  justify-content: start;

  width: 60%;

  border-radius: 25px;

  background-color: rgb(237, 237, 232);
}

.note-cell {
  border: 3px solid rgb(252, 164, 0);
}

.exam-cell {
  border: 3px solid rgb(5, 166, 58);
}

.gallery-cell-header {
  width: 100%;

  border-radius: 22px 22px 0 0;
  padding: 0.8rem;
}

.gallery-cell-header > h2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;

  font-size: 1.2rem;
  font-weight: bold;
  color: white;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-clamp: 1;
  -webkit-line-clamp: 1;
}

.note-cell .gallery-cell-header {
  background-image: linear-gradient(to right, rgb(252, 164, 0), rgb(183, 119, 0));
}

.exam-cell .gallery-cell-header {
  background-image: linear-gradient(to right, rgb(29, 99, 33), rgb(5, 166, 58));
}

.note-preview {
  height: 100%;

  border-radius: 0 0 22px 22px;
  padding: 0.6rem;

  color: black;
  background-color: rgb(231, 230, 216);

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.exam-details {
  width: 100%;
}

.exam-details li {
  color: black;

  text-indent: 4%;
}

@media (max-width: 480px) {
  .gallery-cell {
    width: 80vw;
  }

  .gallery {
    height: 50vh;
    width: 80vw;
  }

  .hello-message-div h1 {
    color: rgb(0, 0, 0);
    width: 100%;
    font-size: 2.4rem;
    font-weight: 700;
  }
}
</style>

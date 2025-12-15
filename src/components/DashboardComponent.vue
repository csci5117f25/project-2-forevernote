<script setup>
import 'vue3-carousel/carousel.css';

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCollection, useCurrentUser, useFirestore } from 'vuefire';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { collection, orderBy, query, Timestamp, where } from 'firebase/firestore';

import CreateExamModal from './NewExamModal.vue';

const user = useCurrentUser();
const db = useFirestore();
const router = useRouter();

const notesRef = computed(() => collection(db, 'users', user.value.uid, 'notes'));
const notes = useCollection(notesRef);
const examsRef = computed(() =>
  query(
    collection(db, 'users', user.value.uid, 'exams'),
    where('examDate', '>=', Timestamp.now()),
    orderBy('examDate'),
  ),
);
const exams = useCollection(examsRef);

const carouselConfig = {
  itemsToShow: 1.2,
  mouseWheel: true,
  wrapAround: true,
  gap: 50,
};

const showModal = ref(false);
function showNewExamModal() {
  showModal.value = true;
}
</script>

<template>
  <div id="dashboard-container">
    <div id="greeting">
      <h1>Hey 
      <span class="greeting-name">{{ user.displayName }}</span>,</h1>
    </div>

    <div id="recent-notes">
      <h2>Recently Viewed Notes</h2>

      <Carousel
        v-if="notes.length !== 0"
        id="note-carousel"
        class="gallery"
        v-bind="carouselConfig"
      >
        <Slide
          v-for="note in notes"
          :key="note.id"
          class="gallery-cell note-cell"
          @click="router.push({ name: 'note', params: { id: note.id } })"
        >
          <div class="gallery-cell-header">
            <h2>{{ note.title }}</h2>
          </div>

          <div class="gallery-cell-body note-preview">
            <p>{{ note.notes }}</p>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>

      <div v-else class="gallery">You have no notes!</div>
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

      <Carousel
        v-if="exams.length !== 0"
        id="exam-carousel"
        class="gallery"
        v-bind="carouselConfig"
      >
        <Slide v-for="exam in exams" :key="exam.id" class="gallery-cell exam-cell">
          <div class="gallery-cell-header">
            <h2>{{ exam.subject }}</h2>
          </div>

          <div class="gallery-cell-body exam-details">
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
      <div v-else class="gallery">
        <p class="no-upcoming-exam">You have no upcoming exams!</p>
      </div>
    </div>

    <CreateExamModal v-if="showModal" @close-modal="showModal = false"></CreateExamModal>
  </div>
</template>

<style scoped>
#dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding-bottom: 10rem;
}

#greeting,
#recent-notes > h2,
#upcoming-exams-h, 
.no-upcoming-exam {
  padding-inline: 1.5rem;
}

#note-carousel,
#exam-carousel {
  width: 100vw;
}

#greeting {
  display: flex;
  flex-direction: row;
  text-align: left;
}

.greeting-name {
  color: rgb(247, 165, 12)
}

#greeting > h1 {
  color: var(--dash-h1-color);
  width: 100%;
  font-size: 4rem;
  font-weight: 700;
}

#upcoming-exams-h {
  display: flex;
  flex-direction: row;
  margin-bottom: 2%;
  justify-content: space-between;
}

#recent-notes, #upcoming-exams {
  font-size: 1.3rem;
}

#add-exam-button {
  align-items: flex-end;

}
.gallery {
  height: 40vh;
}

.gallery-cell {
  display: flex;
  flex-direction: column;
  justify-content: start;

  width: 60%;

  border-radius: 25px;

  background-color: var(--modal-color);
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

  font-size: 2.0rem;
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

.gallery-cell-body {
  width: 100%;
  height: 100%;

  border-radius: 0 0 22px 22px;
  padding: 0.6rem;

  color: var(--text);
  background-color: var(--bg);

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.exam-details li {
  color: var(--text);
  font-weight: 400;
  text-indent: 4%;
}

@media (max-width: 480px) {

  #greeting > h1 {
  font-size: clamp(2.5rem, 8vw, 4rem);
  line-height: 1.0;
  word-break: break-word;
  }

  #recent-notes, #upcoming-exams {
  font-size: 1.0rem;
}

  .gallery-cell {
    width: 85%;
    max-height: 300px;
  }
  .gallery {
    height: auto;
    max-height: 320px;
  }

  .hello-message-div h1 {
    color: var(--h1-color);
    width: 100%;
    font-size: 1rem;
    font-weight: 700;
  }

  .gallery-cell-header > h2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;

    font-size: 1.3rem;
    font-weight: bold;
    color: white;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-clamp: 1;
    -webkit-line-clamp: 1;
  }
  #add-exam-button {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}
</style>

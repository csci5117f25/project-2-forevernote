<script setup>
import { ref, defineEmits } from 'vue';
import { useCurrentUser, useFirestore } from 'vuefire';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const emit = defineEmits(['close-modal']);
const user = useCurrentUser();

// ALL REFS
const newExamTitle = ref('');
const newExamLocation = ref('');
const newExamType = ref('');
const newExamDatetime = ref('');
const newExamTopics = ref('');

const db = useFirestore();
console.log(`Exams from ${user.value.uid} in new exam modal`)
const examCollection = collection(db, 'users', user.value.uid, 'exams');
console.log(`exam collection loaded: ${Object.entries(examCollection)} from new exam modal`)

async function addExam() {
  console.log("raw:", newExamDatetime.value);

  const dt = new Date(newExamDatetime.value);

  console.log("converted:", dt);
  const newExamPromise = await addDoc(examCollection, {
    subject: newExamTitle.value,
    location: newExamLocation.value,
    examDate: dt,
    topics: newExamTopics.value.split(',').map((t) => t.trim()),
  });
  console.log(`new exam promise: ${newExamPromise}`)

  emit('close-modal');
}
</script>

<template>
  <div class="modal-backdrop" @click="emit('close-modal')">
    <div class="modal-content frosted-container" @click.stop>
      <h1 class="title is-4 has-text-centered">New Exam📝</h1>
      <form class="form-area" @submit.prevent="addExam">
        <div class="field">
          <label class="label">Exam:</label>
          <div class="control">
            <input
              class="input is-rounded"
              type="text"
              required
              placeholder="exam name"
              v-model="newExamTitle"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Type of Exam:</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="newExamType">
                <option>Midterm</option>
                <option>Final</option>
                <option>Quiz</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">Date & Time:</label>
          <div class="control">
            <input class="input is-rounded" type="datetime-local" v-model="newExamDatetime" />
          </div>
        </div>
        <div class="field">
          <label class="label">Location:</label>
          <div class="control">
            <input
              class="input is-rounded"
              type="text"
              placeholder="room or hall"
              v-model="newExamLocation"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Topics:</label>
          <div class="control">
            <input
              class="input is-rounded"
              type="text"
              placeholder="covered topics"
              v-model="newExamTopics"
            />
          </div>
        </div>

        <div class="field has-text-centered mt-5">
          <button class="button is-primary is-fullwidth rounded-btn" @click="addExam">
            Save Exam
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

/* Frosted container */
.frosted-container {
  background: rgba(255, 245, 245, 0.743);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 40vw;
  color: black;
}

.title {
  color: rgb(193, 132, 20);
}

label {
  color: rgb(0, 0, 0);
}

input,
select {
  background-color: rgba(70, 69, 68, 0.605);
}

/* Rounded Button */
.rounded-btn {
  border-radius: 12px !important;
}

/* Mobile tweaks */
@media (max-width: 480px) {
  .frosted-container {
    padding: 1.5rem;
  }
}
</style>

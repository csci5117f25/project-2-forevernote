<script setup>
import { ref } from 'vue';
import { useCurrentUser, useFirestore } from 'vuefire';
import { collection, addDoc } from 'firebase/firestore';

const emit = defineEmits(['close-modal']);
const user = useCurrentUser();

// ALL REFS
const newExamTitle = ref('');
const newExamLocation = ref('');
const newExamType = ref('');
const newExamDatetime = ref('');
const newExamTopics = ref('');

const db = useFirestore();
console.log(`Exams from ${user.value.uid} in new exam modal`);
const examCollection = collection(db, 'users', user.value.uid, 'exams');
console.log(`exam collection loaded: ${Object.entries(examCollection)} from new exam modal`);

async function addExam() {
  console.log('raw:', newExamDatetime.value);

  const dt = new Date(newExamDatetime.value);

  console.log('converted:', dt);
  const newExamPromise = await addDoc(examCollection, {
    subject: newExamTitle.value,
    location: newExamLocation.value,
    examDate: dt,
    topics: newExamTopics.value.split(',').map((t) => t.trim()),
  });
  console.log(`new exam promise: ${newExamPromise}`);

  emit('close-modal');
}

function onBackdropClick() {
  const isLargeScreen = window.matchMedia('(min-width: 768px)').matches
  const isFinePointer = window.matchMedia('(pointer: fine)').matches

  if (isLargeScreen || isFinePointer) {
    emit('close-modal')
  }
}
</script>

<template>
  <div class="modal-backdrop" @click="onBackdropClick">
    <div class="modal-content frosted-container" @click.stop>
    <button class="modal-close" @click="emit('close-modal')"></button>
      <h1 class="title is-4 has-text-centered">New Exam📝</h1>
      <form class="form-area" @submit.prevent="addExam">
        <div class="field">
          <label class="label">Exam:</label>
          <div class="control">
            <input
              class="input"
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
            <input class="input" type="datetime-local" v-model="newExamDatetime" />
            <small class="hint">Select date & time after the current time</small>
          </div>
        </div>
        <div class="field">
          <label class="label">Location:</label>
          <div class="control">
            <input
              class="input"
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
              class="input"
              type="text"
              placeholder="covered topics"
              v-model="newExamTopics"
            />
          </div>
        </div>

        <div class="field has-text-centered mt-5">
          <button class="button is-primary is-fullwidth rounded-btn">
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

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  cursor: pointer;  
  background: black;
  border: none;
  font-size: 3rem;
  color: var(--text);
  z-index: 2;
}

.frosted-container {
  background: var(--modal-color);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 40vw;
}

.frosted-container {
  width: 100%;
  max-width: 520px;   /* desktop */
  max-height: 90vh;   /* critical for phones */
  overflow-y: auto;   /* allow scrolling */
}

#add-exam-button {
  touch-action: manipulation;
}


.title {
  color: var(--h1-color);
}

label {
  color: var(--text);
}

input,
select {
  background-color: rgba(82, 76, 68, 0.812);
  color: var(--text);

}
.hint {
  color: var(--text);
  font-size: 0.85rem;
}

.rounded-btn {
  border-radius: 12px !important;
}

@media (max-width: 480px) {
  .modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .frosted-container {
    border-radius: 16px 16px 0 0;
    padding: 1.25rem;
    max-height: 85vh;
  }
}

.field {
  margin-bottom: 1rem;
}

.input,
select {
  min-height: 44px; 
  font-size: 1rem;
}
</style>

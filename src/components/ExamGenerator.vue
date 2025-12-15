<script setup>
import { number } from "motion";
import { ref } from "vue";

const FUNCTION_URL = "https://on-request-api-key-zixtq6tzqq-uc.a.run.app"

// Refs for input.
const examTopic = ref("")
const numberOfQuestions = ref(null);
const genExamDetails = ref([]);
const statusMessage = ref("");
const displayGrade = ref(false);


async function generateExam() {
  // Function to call generative AI model to create exam questions.
  console.log("Generating exam...")
  statusMessage.value = ""
  displayGrade.value = false;
  genExamDetails.value = [];
  if (!examTopic.value || !numberOfQuestions.value){
    statusMessage.value = "😬 Please enter a valid Exam Question and Number of Questions"
    return;
  }
  const url = `${FUNCTION_URL}?topic=${encodeURIComponent(examTopic.value)}&no_of_questions=${numberOfQuestions.value}`;
  statusMessage.value = "📝Working hard on your exam. 🐻 with us..."
  const response = await fetch(url);
  console.log(`Response: ${response}`)
  statusMessage.value = ""
  if (!response.status === 200){
    statusMessage.value = "🥷 Our server was raided by a pack of ninjas! Try to resubmit your request while we defend our dojo!"
    console.error("Error generating exam:", response.statusText);
    return;
  }
  const responseJson = await response.json();
  genExamDetails.value = responseJson.map((detail) => ({
    ...detail,
    selected: null 
  }));
  console.log("Response: ", responseJson)
  displayGrade.value = false;
  console.log("Display grade ", displayGrade.value)
}

function gradeAnswers() {
  displayGrade.value = true;
}
</script>
<template>
  <div class="exam-container">
    <h1>✨AI-powered Exam Generation</h1>

    <div class="form-card">
      <form @submit.prevent="generateExam" class="gen-exam-form">
        <label>Practice Exam Topic:</label>
        <input type="text" required placeholder="Topic Name" v-model="examTopic" />

        <label>Number of Multiple-Choice Questions:</label>
        <select v-model="numberOfQuestions">
          <option>5</option>
          <option>10</option>
        </select>
        <span v-if="statusMessage !== ''">{{ statusMessage }}</span>

        <button type="submit" class="button is-primary" >Generate Exam</button>
      </form>
    </div>

    <div v-if="genExamDetails.length" class="exam-card">
      <div class="question-block" v-for="examDetail in genExamDetails" :key="examDetail.question">
        <div class="question-text">{{ examDetail.question }}</div>

        <select v-model="examDetail.selected">
          <option v-for="choice in examDetail.choices" :key="choice" :value="choice">
            {{ choice }}
          </option>
        </select>
        <div
          v-if="displayGrade && genExamDetails.length"
          class="solution-block"
          :class="examDetail.selected === examDetail.correct_answer ? 'correct' : 'incorrect'"
          >
            <h2 class="right-answer" v-if="examDetail.selected === examDetail.correct_answer">
              ✅You're Right
            </h2>
            <h2 class="wrong-answer" v-else>❌Oops...Nice Try</h2>
            <h2>You selected: {{ examDetail.selected }}</h2>
            <h2>Correct Answer: {{ examDetail.correct_answer }}</h2>
        </div>
      </div>
      <button class="button is-info" @click="gradeAnswers">📝Grade Me!</button>
    </div>
  </div>
</template>

<style scoped>
.exam-container {
  max-width: 70%;
  margin: 0 auto;
  padding: 1.5rem;
  background: var(--bg);
  border-radius: 20px;
  border: 2pt solid rgba(247, 168, 22, 0.682);
}

h1 {
  text-align: center;
  margin-bottom: 1.2rem;
  font-weight: 700;
  font-size: 2rem;
}

.exam-card {
  margin-top: 2rem;
  color: var(--text);
  font-weight: 200;
}

.form-card {
  display: flex;
  flex-direction: column;
}

.gen-exam-form {
  display: flex;
  flex-direction: column;
  color: var(--text);
  padding: 0.3rem;
  justify-content: center;
  gap: 0.5rem;
}

.gen-exam-form input {
  height: 2rem;
  border-radius: 10px;
  border: 2pt solid rgba(0, 0, 0, 0.198);
  font-size: 1rem;
  padding: 0.2rem;
}

.gen-exam-form select {
  height: 2rem;
  border-radius: 10px;
  border: 2pt solid rgba(0, 0, 0, 0.198);
}

.question-block {
  margin-bottom: 1.75rem;
  padding: 1.25rem;
  border-radius: 12px;
  background: var(--question-block-bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.question-text {
  color: var(--text);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.solution-block {
  border-radius: 10px;
  padding: 0.5rem;
  margin-top: 0.8rem;
  background-color: var(--modal-bg);
  font-weight: 100;
}

.wrong-answer {
  color: rgba(240, 32, 32, 0.57);
  font-weight: 100;
  font-size: 1rem;
}

.right-answer {
  color: rgba(59, 216, 74, 0.57);
  font-weight: 100;
  font-size: 1rem;
}

.correct {
  border: 2pt solid rgba(4, 241, 4, 0.532);
}

.incorrect {
  border: 2pt solid rgba(241, 60, 60, 0.532);
}

@media (max-width: 480px) {
  .question-block {
    padding: 1rem;
  }
  h1 {
    font-size: 1.6rem;
  }
}
</style>

<script setup>
// import { GoogleGenAI } from "@google/genai";
import { ref } from "vue";

const FUNCTION_URL = "https://on-request-api-key-zixtq6tzqq-uc.a.run.app"

const fetchKey = async () => {
  try {
    const response = await fetch(FUNCTION_URL)
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    // Since your python function returns a raw string, we use .text()
    // If you change python to return JSON, use .json()
    const data = await response.text()
    apiKey.value = data
    
  } catch (err) {
    console.error(err)
    error.value = "Failed to load API key"
  }
}

// Dependencies for the addMessage function.
const examTopic = ref("")
const numberOfQuestions = ref(null);
const genExamDetails = ref([]);
const loadingIndicator = ref(false);
const displayGrade = ref(false);
const correctAnswers = ref([]);
// const ai = new GoogleGenAI({apiKey: "AIzaSyCYCdk39X3t1z3bJWaRvzI64KyTb-kGQpg"});

// const ai = new GoogleGenAI({apiKey: "AIzaSyBv6Y7Vkwr3_P8f6-ekwoaY9qiOxzBwg34"});


async function generateExam() {
  /*
  YS: Refactor: Account for Catching Exceptions, Firebase functions
  */
  const apiKeyResponse = await fetch(FUNCTION_URL);
  console.log(apiKeyResponse.text())
  const prompt = `Generate ${numberOfQuestions.value} multiple choice questions about "${examTopic.value}".
    Return the result strictly as a JSON array of objects.
    Each object must use the following structure:
    {
      "question": "string",
      "choices": ["A", "B", "C", "D"],
      "correct_answer": "string"
      }
      Do NOT include explanations, prose, or anything outside the JSON.
      Do NOT include letter demarkation in the possible choices.
      Do NOT include letter demarkation in the correct_answer.
      Return ONLY valid JSON.`
  loadingIndicator.value = true
  displayGrade.value = false
  // const response = await ai.models.generateContent({
  //   model: "gemini-2.5-flash",
  //   contents: [{
  //                       parts: [{ text: prompt }]
  //                   }],
  // });
  // loadingIndicator.value = false
  // let textResponse = response.text;
  // textResponse = textResponse
  //   .replace(/```json/g, "")
  //   .replace(/```/g, "")
  //   .replace(/`/g, "")
  //   .trim();
  // const examDetails = JSON.parse(textResponse);
  // console.log(examDetails)
  // genExamDetails.value = examDetails
  // genExamDetails.value = examDetails.map((detail) => ({
  //   ...detail, 
  //   selected: null

  // }));
  // correctAnswers.value = examDetails.map((examDetail) => {return examDetail.correct_answer});
  // console.log(correctAnswers);
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
        <span v-if="loadingIndicator"
          >We're working hard on writing your exam questions. 🐻 with us...</span
        >

        <button class="button is-primary">Generate Exam</button>
      </form>
    </div>

    <div v-if="genExamDetails.length != 0" class="exam-card">
      <div class="question-block" v-for="examDetail in genExamDetails" :key="examDetail.question">
        <div class="question-text">{{ examDetail.question }}</div>

        <select v-model="examDetail.selected">
          <option v-for="choice in examDetail.choices" :key="choice" :value="choice">
            {{ choice }}
          </option>
        </select>
        <div
          class="solution-block"
          v-if="displayGrade"
          :class="{
            correct: examDetail.selected === examDetail.correct_answer,
            incorrect: examDetail.selected !== examDetail.correct_answer,
          }"
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
  background: #f5f6fa;
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
  color: black;
  font-weight: 200;
}

.form-card {
  display: flex;
  flex-direction: column;
}

.gen-exam-form {
  display: flex;
  flex-direction: column;
  color: black;
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
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.question-text {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.solution-block {
  border-radius: 10px;
  padding: 0.5rem;
  margin-top: 0.8rem;
  background-color: #d8d9df5b;
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

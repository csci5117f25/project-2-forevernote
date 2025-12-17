<script setup>
import imgSrc from '@/assets/img/scratch_notes.jpg';
import audioImgSrc from '@/assets/img/audio.jpeg';

import geminiImgSrc from '@/assets/img/gemini.jpg';

</script>

<template>
  <div id="splash-page-container">
    <div class="splash-box">
      <div class="splash-text">
        <h1>It's 2025...</h1>
        <span class="college-notes-span">Time to start taking college notes like it.</span>
      </div>
      <div class="splash-img">
        <img :src="imgSrc" id="scratch-notes-img" />
      </div>
    </div>

    <div class="intro-card-div">
      <div class="features-card">
        <div class="forever-note-title-div">
          <h1>Introducing ForeverNote</h1>
          <span class="college-notes-span">Making notes better...forever🌈</span>
        </div>
      </div>
    </div>
    <div class="editor-box">
      <div class="editor-demo">
        <video autoplay muted loop playsinline>
          <source src="/editor_demo.mp4" type="video/mp4" />
        </video>
      </div>
      <div class="editor-description-div">
        <h2 class="feature-h2">Extensive and Powerful Editor</h2>
        <p>Want to highlight that note your professor told you not to forget? Or quickly add an image of Benzene for your chemistry class?
          Our rich-text editor, powered by TinyMCE, has you covered with a plethora of text styling options, image embedding, and more to revamp your notes to perfection.
        </p>

      </div>
    </div>
    <div class="audio-feature-div">
      <div class="audio-img-div">
        <img :src="audioImgSrc" id="audio-img" />
      </div>
      <div class="audio-feature-desc-div">
        <h2 class="feature-h2">AI-Powered Audio Transcription</h2>
        <p>Ever wished you could focus on Lectures without taking notes? Our OpenAI-powered audio transcription tool accurately converts speech to text in real-time, allowing you to capture every detail of your lectures. Just click record, and let ForeverNote handle the rest! 
        </p>

      </div>
    </div>
    <div class="ai-exam-gen-feature-div">
      <div class="gemini-img-div">
        <img :src="geminiImgSrc" id="gemini-img" />
      </div>
      <div class="audio-feature-desc-div">
        <h2 class="feature-h2">AI-Powered Exam Generation</h2>
        <p>Need to prepare for that exam? Our Gemini-powered exam generation tool creates and grades multiple-choice exams based on topics, helping you prepare for tests with confidence.
        </p>
      </div>
    </div>
    <div class="footer-div">
      <h2>...And so much more! Revamp your note-taking lifestyle - Try Forever Note today! ♾️</h2>
    </div>
  </div>
</template>

<style scoped>
#splash-page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 96%;
  margin: 0 auto;
}

.splash-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  background-color: #e6e5e17a;
  border-radius: 24px;
  padding: 2rem;
}

.splash-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.splash-text h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
}

.college-notes-span {
  font-size: 1.8rem;
  font-weight: 300;
  font-style: italic;
}

.splash-img {
  flex: 1;
  display: flex;
  justify-content: center;
}

.splash-img img {
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}


.features-card {
  background: #db6307f0;
  border: 2px solid #f5a62333;
  color: white;
  width: 100%;
  padding: 1rem;
  border-radius: 24px;
  text-align: center;
}

.features-card h1 {
  font-size: 4rem;
  color: rgb(249, 249, 249);
  margin-bottom: 1rem;
}

.features-card span {
  font-size: 1.6rem;
}

/* ---------- FEATURE ROWS ---------- */
.editor-box,
.audio-feature-div, 
.ai-exam-gen-feature-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.editor-demo,
.audio-img-div,
.gemini-img-div{
  flex: 1;
  display: flex;
  justify-content: center;
}

.editor-demo video {
  width: 100%;
  max-width: 560px;
  border-radius: 16px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.15);
}

.audio-img-div img {
  width: 100%;
  max-width: 420px;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}


.gemini-img{
  width: 100%;
  max-width: 420px;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.editor-description-div,
.audio-feature-desc-div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-h2 {
  font-size: 2.4rem;
  font-weight: 700;
}

.editor-description-div p,
.audio-feature-desc-div p {
  font-size: 1.15rem;
  line-height: 1.6;
  color: #222;
}

.footer-div {
  font-size: 1.8rem;
}

/* ---------- MOBILE ---------- */
@media (max-width: 768px) {
  #splash-page-container {
    padding: 1rem;
    gap: 2.0rem;
  }

  .splash-box {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
  }

  .splash-text h1 {
    font-size: 2.4rem;
  }

  .college-notes-span {
    font-size: 1.2rem;
  }

  .features-card h1 {
    font-size: 2.4rem;
  }

  .editor-box,
  .audio-feature-div, 
  .ai-exam-gen-feature-div {
    flex-direction: column;
    gap: 2rem;
  }

  .feature-h2 {
    font-size: 2rem;
  }

  .editor-description-div p,
  .audio-feature-desc-div p, 
  .ai-exam-gen-feature-div p {
    font-size: 1rem;
  }

  .editor-demo video,
  .audio-img-div img, 
  .gemini-img-div img {
    max-width: 100%;
  }
}
</style>
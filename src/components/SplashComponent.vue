<script setup>
import imgSrc from '@/assets/img/scratch_notes.jpg';
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

    <div class="splash-box">
      <div class="features-card">
        <div class="forever-note-title-div">
          <h1>Introducing ForeverNote</h1>
          <span class="college-notes-span">We Make Notes Better - Forever🌈</span>
        </div>
        <h3>✨Our Features</h3>
        <ul>
          <li>⭐️ TinyMCE-integrated editor with custom text styling options</li>
          <li>⭐️ AI Integrated Cheat sheet generation for those hard exam days</li>
          <li>⭐️ Voice-Integrated Note generation capabilities</li>
          <li>⭐️ Focus Mode for those Zen Study sessions</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
#splash-page-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
  padding: 0.8rem 2rem;
  width: 98%;
  margin: 1%;
  gap: 1rem;
}

.splash-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  /* padding: 1rem 1rem; */
  height: 70vh;
  background-color: #e6e5e1;
  border-radius: 10px;
}

.splash-text {
  text-align: center;
}

.splash-text h1 {
  color: rgb(0, 0, 0);
  font-size: 4rem;
  font-weight: 700;
}

.college-notes-span {
  font-size: 2rem;
  color: black;
  font-weight: 300;
  font-style: italic;
}

/* Make text take equal space but not stretch weirdly */
.tagline {
  flex: 1;
  text-align: left;
}

/* Make images take equal width and match vertically */
.splash-img {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash-img img {
  width: 100%;
  max-width: 70vh;
  height: auto;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.features-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.features-card {
  background: #1e1b1b;
  border: 2pt solid #f5a62333;
  color: white;
  padding: 2rem;
  width: 100%;
  height: 100%;
  /* border-radius: 20px; */
}

.forever-note-title-div {
  text-align: center;
}

.features-card h1 {
  font-size: 4rem;
  color: rgb(210, 140, 11);
  font-weight: 700;
}

.features-card span {
  font-size: 1.8rem;
  margin-bottom: 0.6rem;
  color: white;
}

.features-card h3 {
  font-size: 1.8rem;
  margin-bottom: 0.6rem;
}

.features-card li {
  margin: 0.5rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #dcdcdc;
}

@media (max-width: 768px) {
  #splash-page-container {
    padding: 1.5rem 1rem;
    gap: 2rem;
  }

  .column {
    flex-direction: column;
  }

  .tagline h1 {
    font-size: 2rem;
  }

  .tagline h2 {
    font-size: 1.2rem;
  }

  .splash-img img {
    max-width: 90%;
  }
}
</style>

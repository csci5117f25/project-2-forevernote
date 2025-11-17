<script setup>
import imgSrc from '../assets/images/scratch_notes.jpg'
</script>

<template>
    <div class="columns" id="splash-page-container">

        <div class="column splash-tagline">
            <div class="tagline">
              <h1>Tired of this?</h1>
              <h2>So are we...</h2>
            </div>
            <div class="splash-img">
                <img :src=imgSrc id="scratch-notes-img"></img>
            </div>
        </div>
        <div class="column splash-tagline">
          <div class="splash-img">
            <img></img>
          </div>
          <div class="tagline">
            <h1>Introducing ForeverNote!</h1>
            <h2>Making your notes better...forever</h2>
          </div>
        </div>
    </div>

    <div class="column splash-img"></div>
  </div>
</template>

<style scoped>

#splash-page-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 3rem 2rem;
}

.column {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
  text-align: left;
}

.splash-img{
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
}

.splash-tagline h1{
    font-size: 6.5rem;
}

.splash-tagline h2{
    font-size: 3rem;
}


#scratch-notes-img {
  width: 100%;
  max-width: 70vh;  
  height: auto;
  border-radius: 20px;
  object-fit: contain;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  object-fit: contain;
}


@media (max-width: 768px) {
  .columns {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .splash-tagline h1 {
    font-size: 2.5rem;
  }

  .splash-tagline h2 {
    font-size: 1.5rem;
  }

  #scratch-notes-img {
    max-width: 90%;
    margin: 0 auto;
  }
}

.splash-img {
  border: 2px solid black;
}
</style>

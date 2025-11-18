<script setup>
import imgSrc from '../assets/images/scratch_notes.jpg'
import logoSrc from '../assets/images/Logo.png'
import { scroll } from 'motion';
import { onMounted } from 'vue';
import Flickity from 'flickity'; 
import 'flickity/css/flickity.css'
import { ref } from 'vue';
console.log("I'm from the Dashboard Component")
const props = defineProps(
    {
        user: String
    });
const sampleNotes = ref([
  {
    title: "Linear Algebra — Eigenvalues & Eigenvectors",
    notes:
      "Eigenvalues and eigenvectors describe how linear transformations stretch or rotate vectors. They are essential in PCA, differential equations, and analyzing systems that evolve over time. Understanding them helps simplify complex matrix operations."
  },
  {
    title: "Cognitive Psychology — Memory Encoding",
    notes:
      "Memory encoding is the process of converting sensory input into a form the brain can store. Encoding quality is influenced by attention, depth of processing, and emotional context. It forms the foundation for later retrieval and long-term learning."
  },
  {
    title: "Organic Chemistry — SN1 vs SN2 Reactions",
    notes:
      "SN1 reactions proceed through a carbocation intermediate and are favored by stable intermediates and polar protic solvents. SN2 reactions occur in one concerted step and require strong nucleophiles. The substrate structure determines which mechanism occurs."
  },
  {
    title: "Computer Networks — TCP Congestion Control",
    notes:
      "TCP uses algorithms like slow start, congestion avoidance, and fast recovery to regulate packet flow. These mechanisms adjust transmission speed based on perceived network congestion, improving reliability and preventing network overload during communication."
  },
  {
    title: "Microeconomics — Elasticity of Demand",
    notes:
      "Elasticity measures how sensitive consumer demand is to price changes. Goods with close substitutes tend to have higher elasticity. Understanding elasticity helps predict revenue changes and guides pricing strategies in competitive markets."
  }
]);

const exams = ref([
    {
        subject: "CSCI5511", 
        date: "24th November 2025", 
        time: "4:00pm", 
        location: "Fraser 120", 
        topics: ["Propositional Logic", "First Order Logic", "Planning"]

    }, 
    {
        subject: "CSCI5517", 
        date: "25th November 2025", 
        time: "6:00pm", 
        location: "Bruininks 120", 
        topics: ["Vue", "Firebase"]

    }, 
    {
        subject: "CSCI5521", 
        date: "24th November 2025", 
        time: "4:00pm", 
        location: "Anderson 330", 
        topics: ["Multilayer Perceptron", "Convolutional Neural Networks"]

    }

]);
const galleryEl = ref(null); 
const examGallery = ref(null);
onMounted(() => {
    new Flickity(galleryEl.value, {
        freeScroll: true, 
        wrapAround: true,
    })
    new Flickity(examGallery.value, {
        freeScroll: true, 
        wrapAround: true,
    })
})

</script>
<template>
    <div id="dashboard-page-container">
        <div class="hello-message-div">
            <h1>Hey {{ props.user }}</h1>
        </div>
        <div class="recent-notes-div">
            <h2>Recently Viewed Notes</h2>
            <div class="gallery" ref="galleryEl">
                <div v-for="note in sampleNotes" class="gallery-cell">
                    <div class="gallery-cell-title-div">
                        <h2>{{ note.title }}</h2>
                    </div>
                    <div class="note-preview">
                        <p>{{ note.notes }}</p>
                    </div>
                </div>
                
            </div>

        </div>
        <div class="dash-exams-div">
            <h2>Upcoming Exams⏳</h2>
            <div class="gallery exam-gallery" ref="examGallery">
                <div v-for="exam in exams" class="gallery-cell exam-cell">
                    <div class="gallery-cell-title-div dash-exam-title-div">
                        <h2>{{ exam.subject}}</h2>
                    </div>
                    <div class="exam-details-div">
                        <h2>🕐 {{ exam.date }} @ {{ exam.time }}</h2>
                        <h2>📍 {{exam.location}}</h2>
                        <h2>💡 Topics:</h2>
                        <ul v-if="exam.topics != []">
                            <li v-for="topic in exam.topics">💡{{ topic }}</li>
                        </ul>

                        
                    </div>
                </div>
                
            </div>


        </div>
    </div>

</template>

<style scoped>

#dashboard-page-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: space-between;
    padding: 0.8rem 2rem;
    width: 98%; 
    margin: 1%;
    gap: 1rem;
}

.hello-message-div{
    display: flex; 
    flex-direction: row; 
    text-align: left;
}

.hello-message-div h1{ 
    color: rgb(0, 0, 0);
    width: 100%;
    font-size: 4rem;
    font-weight:700;

}

.gallery{
    height: 50vh;
}
.gallery-cell {
  width: 60%;
  height: 100%;
  border-radius: 23px;
  margin-right: 2%;
  display: flex;
  flex-direction: column;
  background-color: rgb(237, 237, 232);
  border: 2pt solid rgb(252, 164, 0);
}


.gallery-cell-title-div {
  width: 100%;
  padding: 0.8rem;
  border-radius: 20px 20px 0 0;
  background-image: linear-gradient(to right, rgb(252, 164, 0), rgb(183, 119, 0));
}

.gallery-cell-title-div h2 {
  display: -webkit-box;
  -webkit-line-clamp: 1;   
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-weight: bold;
  color: white;
  font-size: 1.2rem;
}

.note-preview{ 
    background-color: rgb(231, 230, 216);
    color: black; 
    padding: 0.6rem;
    height: 100%;
    border-radius: 0 0 20px 20px;

}

* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.dash-exam-title-div{
    background-image: linear-gradient(to right, rgb(29, 99, 33), rgb(5, 166, 58));
}

.exam-cell {
  width: 40%;
  height: 100%;
  border-radius: 23px;
  margin-right: 2%;
  display: flex;
  flex-direction: column;
  background-color: rgb(237, 237, 232);
  border: 2pt solid rgb(5, 166, 58);
  overflow-y: auto;
}

.exam-cell li{
  color: black; 
  text-indent: 2%;;
}

.exam-gallery{
    height: 30vh;
}

@media (max-width: 480px) {
  .gallery-cell {
    width: 80vw;    
    /* padding: 1rem; */
  }

  .gallery{
    height: 50vh;
    width: 80vw;
    }

    .hello-message-div h1{ 
    color: rgb(0, 0, 0);
    width: 100%;
    font-size: 2.4rem;
    font-weight:700;

}
}
</style>
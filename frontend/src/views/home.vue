<script setup>
import {
    ref
} from 'vue'
import Header from '../components/Header.vue'
/*import 'bootstrap'*/
import {
    useRouter
} from 'vue-router'
const router = useRouter()

const activo = ref(1)
</script>

<template>
<Header />
<div class="home-container mt-5">
    <h1>Salas del Museo</h1>

    <div class="accordion" id="accordionPanelsStayOpenExample">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                    Sala #1
                </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
                <div class="accordion-body">
                    <strong>Esta es la primera sala del museo.</strong> Aquí puedes encontrar una variedad de exposiciones y actividades.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/1')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                    Sala #2
                </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <strong>Esta es la segunda sala del museo.</strong> Aquí puedes explorar más sobre nuestras colecciones y eventos.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/2')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                    Sala #3
                </button>
            </h2>
            <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <strong>Esta es la tercera sala del museo.</strong> Aquí puedes descubrir más sobre nuestras exposiciones y actividades.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/3')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                    Sala #4
                </button>
            </h2>
            <div id="panelsStayOpen-collapseFour" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <strong>Esta es la cuarta sala del museo.</strong> Aquí puedes aprender más sobre nuestras colecciones y eventos.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/4')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFive" aria-expanded="false" aria-controls="panelsStayOpen-collapseFive">
                    Sala #5
                </button>
            </h2>
            <div id="panelsStayOpen-collapseFive" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <strong>Esta es la quinta sala del museo.</strong> Aquí puedes explorar más sobre nuestras colecciones y eventos.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/5')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSix" aria-expanded="false" aria-controls="panelsStayOpen-collapseSix">
                    Sala #6
                </button>
            </h2>
            <div id="panelsStayOpen-collapseSix" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <strong>Esta es la sexta sala del museo.</strong> Aquí puedes descubrir más sobre nuestras exposiciones y actividades.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/6')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSeven" aria-expanded="false" aria-controls="panelsStayOpen-collapseSeven">
                    Sala #7
                </button>
            </h2>
            <div id="panelsStayOpen-collapseSeven" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <strong>Esta es la séptima sala del museo.</strong> Aquí puedes aprender más sobre nuestras colecciones y eventos.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/7')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseEight" aria-expanded="false" aria-controls="panelsStayOpen-collapseEight">
                    Sala #8
                </button>
            </h2>
            <div id="panelsStayOpen-collapseEight" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <strong>Esta es la octava sala del museo.</strong> Aquí puedes explorar más sobre nuestras colecciones y eventos.
                    <div class="vermas mt-3">
                        <button class="btn btn-vermas" @click="router.push('/sala/8')">Ver más</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>  
.btn-vermas{
  background-color: #E8670B;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

</style>

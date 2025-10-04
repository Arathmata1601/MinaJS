<!-- src/components/Header.vue -->
<script setup>
</script>

<template>
  <div class="header">
  <div class="header-row">
   <!--<img class="logo "src="../assets/minaeleden.png" alt="Logo" />-->
   <img class="logo "src="../assets/mina.svg" alt="Logo" />
    <div class="titulo">Sistema de Gestión de Mina El Edén</div>
   <img class="logo "src="../assets/mina.svg" alt="Logo" />
   </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background-color: #e8670b;
  /*background-color: #757676;*/
  z-index: 1000;
  text-align: center;
}

.logo {
  width: 150px;
  height: 150px;
  margin: 0 20px;
}

.header-row {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 100%;
}

.titulo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0 20px;
}
</style>

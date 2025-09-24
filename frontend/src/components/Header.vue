<!-- src/components/Header.vue -->
<script setup>
</script>

<template>
  <div class="header">
  <div class="header-row">
   <img class="logo "src="../assets/ejemplo.png" alt="Logo" />
    <p>MINA DEL EDEN</p>
   <img class="logo "src="../assets/ejemplo.png" alt="Logo" />
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
  z-index: 1000;
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
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

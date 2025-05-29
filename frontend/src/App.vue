<template>
  <div id="app">
    <!-- Верхняя панель -->
    <nav class="main-nav">
      <router-link to="/" class="nav-link">Профиль</router-link>
    </nav>

    <!-- Основная разметка: меню + контент -->
    <div class="layout">
      <!-- Левое меню -->
      <aside class="sidebar">
        <router-link to="/" class="menu-item"  exact>
          Пользователи
        </router-link>
        <router-link to="/" class="menu-item" >
          Уведомления и напоминания
        </router-link>
        <router-link to="/" class="menu-item" >
          Настройки АИС ОГПА
        </router-link>
        <router-link to="/" class="menu-item" >
          Справочник погрузчиков
        </router-link>
        <router-link to="/" class="menu-item" >
          Резервное копирование и восстановление
        </router-link>
        <router-link to="/" class="menu-item" >
          Справочники
        </router-link>
      </aside>

      <!-- Контент -->
      <main class="app-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Сброс */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html, #app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  transform-origin: top left;
  display: flex;
  flex-direction: column;

}

/* Верхняя навигация */
.main-nav {
  height: 60px;
  background: #42b983;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 5px;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}


.nav-link.router-link-exact-active {
  background-color: white;
  color: #42b983;
}

/* Макет */
.layout {
  display: flex;
  flex: 1;
  height: calc(100vh - 50px);
}

/* Боковое меню */
.sidebar {
  width: 120px;
  background-color: #f0f0f0;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  text-decoration: none;
  color: #333;
}

.active-link {
  background-color: #d0d0d0;
  font-weight: bold;
}

/* Контент */
.app-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>

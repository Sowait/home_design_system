<template>
  <div class="home">
    <el-container>
      <el-header>
        <nav>
          <div class="logo">家装设计网站</div>
          <div class="nav-links">
            <router-link to="/">首页</router-link>
            <router-link to="/cases">设计案例</router-link>
            <router-link to="/designers">设计师</router-link>
            <router-link to="/articles">装修资讯</router-link>
          </div>
          <div class="user-actions">
            <router-link to="/login" v-if="!isLoggedIn">登录</router-link>
            <router-link to="/register" v-if="!isLoggedIn">注册</router-link>
            <el-dropdown v-if="isLoggedIn">
              <span class="el-dropdown-link">
                {{ userInfo.username }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="userRole === 'user'">
                    <router-link to="/user/profile">个人中心</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="userRole === 'designer'">
                    <router-link to="/designer/profile">设计师中心</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="userRole === 'admin'">
                    <router-link to="/admin">管理员后台</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </nav>
      </el-header>
      
      <el-main>
        <div class="banner">
          <h1>专业的家装设计服务平台</h1>
          <p>为您提供优质的设计方案和专业的装修服务</p>
        </div>
        
        <div class="features">
          <div class="feature">
            <h3>设计案例</h3>
            <p>浏览海量优质设计案例</p>
            <router-link to="/cases">查看更多</router-link>
          </div>
          <div class="feature">
            <h3>专业设计师</h3>
            <p>预约资深设计师服务</p>
            <router-link to="/designers">查看更多</router-link>
          </div>
          <div class="feature">
            <h3>装修资讯</h3>
            <p>获取最新装修知识和技巧</p>
            <router-link to="/articles">查看更多</router-link>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Home',
  setup() {
    const isLoggedIn = computed(() => !!localStorage.getItem('token'))
    const userRole = computed(() => localStorage.getItem('userRole') || '')
    const userInfo = computed(() => {
      const userStr = localStorage.getItem('userInfo')
      return userStr ? JSON.parse(userStr) : { username: '用户' }
    })

    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }

    return {
      isLoggedIn,
      userRole,
      userInfo,
      logout
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-links a:hover {
  color: #409EFF;
}

.user-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.user-actions a {
  text-decoration: none;
  color: #409EFF;
}

.banner {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 40px;
}

.banner h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.banner p {
  font-size: 18px;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.feature {
  text-align: center;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,.1);
}

.feature h3 {
  margin-bottom: 15px;
  color: #333;
}

.feature p {
  margin-bottom: 20px;
  color: #666;
}

.feature a {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
}

.feature a:hover {
  text-decoration: underline;
}
</style>
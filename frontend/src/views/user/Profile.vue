<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="user-info">
        <img :src="userInfo.avatar" :alt="userInfo.username" class="user-avatar">
        <div class="user-details">
          <h2>{{ userInfo.username }}</h2>
          <p>{{ userInfo.email }}</p>
          <p>注册时间：{{ userInfo.registerTime }}</p>
        </div>
      </div>
      <el-button type="primary" @click="editProfile">编辑资料</el-button>
    </div>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="个人信息" name="info">
        <div class="info-section">
          <el-descriptions title="基本信息" :column="2" border>
            <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ userInfo.gender }}</el-descriptions-item>
            <el-descriptions-item label="生日">{{ userInfo.birthday }}</el-descriptions-item>
            <el-descriptions-item label="所在地">{{ userInfo.location }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="收藏的案例" name="favorites">
        <div class="favorites-section">
          <div class="case-grid">
            <div v-for="caseItem in favoriteCases" :key="caseItem.id" class="case-item" @click="viewCaseDetail(caseItem.id)">
              <img :src="caseItem.coverImage" :alt="caseItem.title" class="case-image">
              <div class="case-info">
                <h4>{{ caseItem.title }}</h4>
                <p>{{ caseItem.style }} · {{ caseItem.area }}㎡</p>
                <div class="case-actions">
                  <el-button size="small" @click.stop="removeFavorite(caseItem.id)">取消收藏</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="预约记录" name="appointments">
        <div class="appointments-section">
          <el-table :data="appointments" border>
            <el-table-column prop="designerName" label="设计师" width="150"></el-table-column>
            <el-table-column prop="appointmentTime" label="预约时间" width="180"></el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="需求描述"></el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" @click="viewAppointmentDetail(scope.row)">查看详情</el-button>
                <el-button size="small" type="danger" v-if="scope.row.status === 'pending'" @click="cancelAppointment(scope.row)">取消预约</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 编辑资料对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑个人资料" width="500px">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择性别">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            placeholder="选择生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="所在地" prop="location">
          <el-input v-model="editForm.location"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile" :loading="saveLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserProfile',
  setup() {
    const router = useRouter()
    const activeTab = ref('info')
    const editDialogVisible = ref(false)
    const editFormRef = ref()
    const saveLoading = ref(false)
    
    const userInfo = ref({})
    const favoriteCases = ref([])
    const appointments = ref([])
    
    const editForm = reactive({
      username: '',
      email: '',
      phone: '',
      gender: '',
      birthday: '',
      location: ''
    })
    
    const editRules = {
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
      ]
    }
    
    const loadUserInfo = async () => {
      try {
        // TODO: 调用API获取用户信息
        userInfo.value = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          phone: '13800138000',
          gender: '男',
          birthday: '1990-01-01',
          location: '北京市',
          avatar: 'https://via.placeholder.com/80x80',
          registerTime: '2023-01-01'
        }
        
        // 复制到编辑表单
        Object.assign(editForm, userInfo.value)
        
      } catch (error) {
        console.error('加载用户信息失败:', error)
      }
    }
    
    const loadFavoriteCases = async () => {
      try {
        // TODO: 调用API获取收藏的案例
        favoriteCases.value = [
          {
            id: 1,
            title: '现代简约三居室',
            style: '现代简约',
            area: 120,
            coverImage: 'https://via.placeholder.com/300x200'
          },
          {
            id: 2,
            title: '北欧风两居室',
            style: '北欧风格',
            area: 80,
            coverImage: 'https://via.placeholder.com/300x200'
          }
        ]
      } catch (error) {
        console.error('加载收藏案例失败:', error)
      }
    }
    
    const loadAppointments = async () => {
      try {
        // TODO: 调用API获取预约记录
        appointments.value = [
          {
            id: 1,
            designerName: '张设计师',
            appointmentTime: '2024-01-20 14:00',
            status: 'pending',
            description: '三居室现代简约风格设计'
          },
          {
            id: 2,
            designerName: '李设计师',
            appointmentTime: '2024-01-15 10:00',
            status: 'accepted',
            description: '两居室北欧风格设计'
          },
          {
            id: 3,
            designerName: '王设计师',
            appointmentTime: '2024-01-10 15:00',
            status: 'completed',
            description: '一居室小户型改造'
          }
        ]
      } catch (error) {
        console.error('加载预约记录失败:', error)
      }
    }
    
    const handleTabClick = (tab) => {
      if (tab.name === 'favorites') {
        loadFavoriteCases()
      } else if (tab.name === 'appointments') {
        loadAppointments()
      }
    }
    
    const editProfile = () => {
      editDialogVisible.value = true
    }
    
    const saveProfile = async () => {
      try {
        await editFormRef.value.validate()
        saveLoading.value = true
        
        // TODO: 调用API保存用户信息
        console.log('保存用户信息:', editForm)
        
        // 更新本地用户信息
        Object.assign(userInfo.value, editForm)
        
        editDialogVisible.value = false
        ElMessage.success('保存成功')
      } catch (error) {
        console.error('保存失败:', error)
      } finally {
        saveLoading.value = false
      }
    }
    
    const viewCaseDetail = (id) => {
      router.push(`/case/${id}`)
    }
    
    const removeFavorite = async (caseId) => {
      try {
        await ElMessageBox.confirm('确定要取消收藏这个案例吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API取消收藏
        const index = favoriteCases.value.findIndex(item => item.id === caseId)
        if (index > -1) {
          favoriteCases.value.splice(index, 1)
        }
        
        ElMessage.success('取消收藏成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消收藏失败:', error)
        }
      }
    }
    
    const viewAppointmentDetail = (appointment) => {
      // TODO: 显示预约详情
      ElMessage.info('预约详情功能开发中')
    }
    
    const cancelAppointment = async (appointment) => {
      try {
        await ElMessageBox.confirm('确定要取消这个预约吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API取消预约
        appointment.status = 'cancelled'
        
        ElMessage.success('取消预约成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消预约失败:', error)
        }
      }
    }
    
    const getStatusType = (status) => {
      const statusMap = {
        pending: 'warning',
        accepted: 'success',
        completed: 'info',
        cancelled: 'danger'
      }
      return statusMap[status] || 'info'
    }
    
    const getStatusText = (status) => {
      const statusMap = {
        pending: '待处理',
        accepted: '已接受',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || '未知'
    }
    
    onMounted(() => {
      loadUserInfo()
    })
    
    return {
      activeTab,
      userInfo,
      favoriteCases,
      appointments,
      editDialogVisible,
      editForm,
      editRules,
      editFormRef,
      saveLoading,
      handleTabClick,
      editProfile,
      saveProfile,
      viewCaseDetail,
      removeFavorite,
      viewAppointmentDetail,
      cancelAppointment,
      getStatusType,
      getStatusText
    }
  }
}
</script>

<style scoped>
.user-profile {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-details p {
  margin: 5px 0;
  color: #666;
}

.info-section {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.favorites-section {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.case-item {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.case-item:hover {
  transform: translateY(-5px);
}

.case-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.case-info {
  padding: 15px;
}

.case-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

.case-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 12px;
}

.case-actions {
  display: flex;
  justify-content: center;
}

.appointments-section {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
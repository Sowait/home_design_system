<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h2>管理员后台</h2>
      <p>系统管理和数据监控</p>
    </div>
    
    <div class="dashboard-content">
      <div class="stats-overview">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalUsers }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalDesigners }}</div>
                <div class="stat-label">设计师数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalCases }}</div>
                <div class="stat-label">设计案例</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalAppointments }}</div>
                <div class="stat-label">预约总数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="用户管理" name="users">
          <div class="users-section">
            <div class="section-header">
              <el-input
                v-model="userSearchKeyword"
                placeholder="搜索用户..."
                style="width: 300px"
                @input="searchUsers"
              >
                <template #prefix>
                  <el-icon><search /></el-icon>
                </template>
              </el-input>
            </div>
            
            <el-table :data="userList" border>
              <el-table-column prop="username" label="用户名" width="150"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
              <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
              <el-table-column prop="role" label="角色" width="100">
                <template #default="scope">
                  <el-tag :type="getRoleType(scope.row.role)">{{ getRoleText(scope.row.role) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="registerTime" label="注册时间" width="180"></el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination">
              <el-pagination
                v-model:current-page="userCurrentPage"
                v-model:page-size="userPageSize"
                :page-sizes="[10, 20, 50]"
                :total="userTotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleUserSizeChange"
                @current-change="handleUserCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="内容审核" name="content">
          <div class="content-section">
            <el-tabs v-model="contentTab">
              <el-tab-pane label="案例审核" name="cases">
                <el-table :data="pendingCases" border>
                  <el-table-column prop="title" label="案例标题" width="200"></el-table-column>
                  <el-table-column prop="designerName" label="设计师" width="150"></el-table-column>
                  <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getCaseStatusType(scope.row.status)">{{ getCaseStatusText(scope.row.status) }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200">
                    <template #default="scope">
                      <el-button size="small" @click="viewCaseDetail(scope.row)">查看</el-button>
                      <el-button size="small" type="success" @click="approveCase(scope.row)" v-if="scope.row.status === 'pending'">通过</el-button>
                      <el-button size="small" type="danger" @click="rejectCase(scope.row)" v-if="scope.row.status === 'pending'">拒绝</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              
              <el-tab-pane label="文章审核" name="articles">
                <el-table :data="pendingArticles" border>
                  <el-table-column prop="title" label="文章标题" width="250"></el-table-column>
                  <el-table-column prop="author" label="作者" width="150"></el-table-column>
                  <el-table-column prop="category" label="分类" width="120"></el-table-column>
                  <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getArticleStatusType(scope.row.status)">{{ getArticleStatusText(scope.row.status) }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200">
                    <template #default="scope">
                      <el-button size="small" @click="viewArticleDetail(scope.row)">查看</el-button>
                      <el-button size="small" type="success" @click="approveArticle(scope.row)" v-if="scope.row.status === 'pending'">通过</el-button>
                      <el-button size="small" type="danger" @click="rejectArticle(scope.row)" v-if="scope.row.status === 'pending'">拒绝</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 编辑用户对话框 -->
    <el-dialog v-model="editUserDialogVisible" title="编辑用户信息" width="500px">
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editUserForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="设计师" value="designer"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser" :loading="saveUserLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const activeTab = ref('users')
    const contentTab = ref('cases')
    const userSearchKeyword = ref('')
    const editUserDialogVisible = ref(false)
    const editUserFormRef = ref()
    const saveUserLoading = ref(false)
    
    const stats = ref({})
    const userList = ref([])
    const pendingCases = ref([])
    const pendingArticles = ref([])
    
    const userCurrentPage = ref(1)
    const userPageSize = ref(10)
    const userTotal = ref(0)
    
    const editUserForm = reactive({
      id: '',
      username: '',
      email: '',
      phone: '',
      role: ''
    })
    
    const editUserRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
      ],
      role: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ]
    }
    
    const loadStats = async () => {
      try {
        // TODO: 调用API获取统计数据
        stats.value = {
          totalUsers: 1234,
          totalDesigners: 56,
          totalCases: 789,
          totalAppointments: 234
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    }
    
    const loadUserList = async () => {
      try {
        // TODO: 调用API获取用户列表
        userList.value = [
          {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            phone: '13800138000',
            role: 'user',
            registerTime: '2023-01-01 10:00:00'
          },
          {
            id: 2,
            username: 'designer1',
            email: 'designer1@example.com',
            phone: '13800138001',
            role: 'designer',
            registerTime: '2023-01-02 10:00:00'
          }
        ]
        userTotal.value = 100
      } catch (error) {
        console.error('加载用户列表失败:', error)
      }
    }
    
    const loadPendingCases = async () => {
      try {
        // TODO: 调用API获取待审核案例
        pendingCases.value = [
          {
            id: 1,
            title: '现代简约三居室',
            designerName: '张设计师',
            submitTime: '2024-01-15 10:00:00',
            status: 'pending'
          }
        ]
      } catch (error) {
        console.error('加载待审核案例失败:', error)
      }
    }
    
    const loadPendingArticles = async () => {
      try {
        // TODO: 调用API获取待审核文章
        pendingArticles.value = [
          {
            id: 1,
            title: '现代简约风格装修完全指南',
            author: '张设计师',
            category: '风格介绍',
            submitTime: '2024-01-15 10:00:00',
            status: 'pending'
          }
        ]
      } catch (error) {
        console.error('加载待审核文章失败:', error)
      }
    }
    
    const handleTabClick = (tab) => {
      if (tab.name === 'users') {
        loadUserList()
      } else if (tab.name === 'content') {
        loadPendingCases()
        loadPendingArticles()
      }
    }
    
    const searchUsers = () => {
      // TODO: 实现用户搜索
      console.log('搜索用户:', userSearchKeyword.value)
    }
    
    const getRoleType = (role) => {
      const typeMap = {
        admin: 'danger',
        designer: 'warning',
        user: 'info'
      }
      return typeMap[role] || 'info'
    }
    
    const getRoleText = (role) => {
      const textMap = {
        admin: '管理员',
        designer: '设计师',
        user: '普通用户'
      }
      return textMap[role] || '未知'
    }
    
    const getCaseStatusType = (status) => {
      const typeMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      }
      return typeMap[status] || 'info'
    }
    
    const getCaseStatusText = (status) => {
      const textMap = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝'
      }
      return textMap[status] || '未知'
    }
    
    const getArticleStatusType = (status) => {
      const typeMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      }
      return typeMap[status] || 'info'
    }
    
    const getArticleStatusText = (status) => {
      const textMap = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝'
      }
      return textMap[status] || '未知'
    }
    
    const editUser = (user) => {
      Object.assign(editUserForm, user)
      editUserDialogVisible.value = true
    }
    
    const saveUser = async () => {
      try {
        await editUserFormRef.value.validate()
        saveUserLoading.value = true
        
        // TODO: 调用API保存用户信息
        console.log('保存用户信息:', editUserForm)
        
        editUserDialogVisible.value = false
        ElMessage.success('保存成功')
        loadUserList()
        
      } catch (error) {
        console.error('保存用户信息失败:', error)
      } finally {
        saveUserLoading.value = false
      }
    }
    
    const deleteUser = async (user) => {
      try {
        await ElMessageBox.confirm(`确定要删除用户 ${user.username} 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API删除用户
        const index = userList.value.findIndex(item => item.id === user.id)
        if (index > -1) {
          userList.value.splice(index, 1)
        }
        
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除用户失败:', error)
        }
      }
    }
    
    const viewCaseDetail = (caseItem) => {
      // TODO: 跳转到案例详情页
      router.push(`/case/${caseItem.id}`)
    }
    
    const approveCase = async (caseItem) => {
      try {
        // TODO: 调用API通过案例审核
        caseItem.status = 'approved'
        ElMessage.success('案例审核通过')
      } catch (error) {
        console.error('案例审核失败:', error)
      }
    }
    
    const rejectCase = async (caseItem) => {
      try {
        await ElMessageBox.confirm('确定要拒绝这个案例吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API拒绝案例审核
        caseItem.status = 'rejected'
        ElMessage.success('已拒绝案例')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('拒绝案例失败:', error)
        }
      }
    }
    
    const viewArticleDetail = (article) => {
      // TODO: 跳转到文章详情页
      router.push(`/article/${article.id}`)
    }
    
    const approveArticle = async (article) => {
      try {
        // TODO: 调用API通过文章审核
        article.status = 'approved'
        ElMessage.success('文章审核通过')
      } catch (error) {
        console.error('文章审核失败:', error)
      }
    }
    
    const rejectArticle = async (article) => {
      try {
        await ElMessageBox.confirm('确定要拒绝这篇文章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API拒绝文章审核
        article.status = 'rejected'
        ElMessage.success('已拒绝文章')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('拒绝文章失败:', error)
        }
      }
    }
    
    const handleUserSizeChange = (val) => {
      userPageSize.value = val
      loadUserList()
    }
    
    const handleUserCurrentChange = (val) => {
      userCurrentPage.value = val
      loadUserList()
    }
    
    onMounted(() => {
      loadStats()
    })
    
    return {
      activeTab,
      contentTab,
      stats,
      userList,
      pendingCases,
      pendingArticles,
      userSearchKeyword,
      userCurrentPage,
      userPageSize,
      userTotal,
      editUserDialogVisible,
      editUserForm,
      editUserRules,
      editUserFormRef,
      saveUserLoading,
      handleTabClick,
      searchUsers,
      getRoleType,
      getRoleText,
      getCaseStatusType,
      getCaseStatusText,
      getArticleStatusType,
      getArticleStatusText,
      editUser,
      saveUser,
      deleteUser,
      viewCaseDetail,
      approveCase,
      rejectCase,
      viewArticleDetail,
      approveArticle,
      rejectArticle,
      handleUserSizeChange,
      handleUserCurrentChange
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.dashboard-header p {
  color: #666;
  font-size: 16px;
}

.stats-overview {
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.dashboard-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.users-section,
.content-section {
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
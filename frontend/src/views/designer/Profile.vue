<template>
  <div class="designer-profile">
    <div class="profile-header">
      <div class="designer-info">
        <img :src="designerInfo.avatar" :alt="designerInfo.name" class="designer-avatar">
        <div class="designer-details">
          <h2>{{ designerInfo.name }}</h2>
          <p>{{ designerInfo.title }}</p>
          <div class="designer-stats">
            <span>从业{{ designerInfo.experience }}年</span>
            <span>完成{{ designerInfo.completedCases }}套案例</span>
            <span>获赞{{ designerInfo.likes }}次</span>
          </div>
        </div>
      </div>
      <el-button type="primary" @click="editProfile">编辑资料</el-button>
    </div>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="工作室信息" name="studio">
        <div class="studio-section">
          <el-descriptions title="工作室信息" :column="2" border>
            <el-descriptions-item label="工作室名称">{{ studioInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="服务区域">{{ studioInfo.serviceArea }}</el-descriptions-item>
            <el-descriptions-item label="设计风格">{{ studioInfo.style }}</el-descriptions-item>
            <el-descriptions-item label="设计价格">{{ studioInfo.price }}</el-descriptions-item>
            <el-descriptions-item label="服务范围" :span="2">{{ studioInfo.serviceScope }}</el-descriptions-item>
          </el-descriptions>
          
          <div class="studio-description">
            <h3>工作室简介</h3>
            <p>{{ studioInfo.description }}</p>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="作品集管理" name="portfolio">
        <div class="portfolio-section">
          <div class="section-header">
            <h3>我的作品集</h3>
            <el-button type="primary" @click="showCaseDialog">发布案例</el-button>
          </div>
          
          <div class="case-grid">
            <div v-for="caseItem in caseList" :key="caseItem.id" class="case-item">
              <img :src="caseItem.coverImage" :alt="caseItem.title" class="case-image">
              <div class="case-info">
                <h4>{{ caseItem.title }}</h4>
                <p>{{ caseItem.style }} · {{ caseItem.area }}㎡</p>
                <div class="case-stats">
                  <span><el-icon><view /></el-icon> {{ caseItem.views }}</span>
                  <span><el-icon><star /></el-icon> {{ caseItem.likes }}</span>
                  <span><el-icon><collection /></el-icon> {{ caseItem.favorites }}</span>
                </div>
                <div class="case-actions">
                  <el-button size="small" @click="editCase(caseItem)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteCase(caseItem)">删除</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="预约管理" name="appointments">
        <div class="appointments-section">
          <div class="appointment-tabs">
            <el-tabs v-model="appointmentTab">
              <el-tab-pane label="待处理" name="pending">
                <el-table :data="pendingAppointments" border>
                  <el-table-column prop="userName" label="用户" width="150"></el-table-column>
                  <el-table-column prop="appointmentTime" label="预约时间" width="180"></el-table-column>
                  <el-table-column prop="description" label="需求描述"></el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="scope">
                      <el-button size="small" type="success" @click="acceptAppointment(scope.row)">接受</el-button>
                      <el-button size="small" type="danger" @click="rejectAppointment(scope.row)">拒绝</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              
              <el-tab-pane label="已接受" name="accepted">
                <el-table :data="acceptedAppointments" border>
                  <el-table-column prop="userName" label="用户" width="150"></el-table-column>
                  <el-table-column prop="appointmentTime" label="预约时间" width="180"></el-table-column>
                  <el-table-column prop="description" label="需求描述"></el-table-column>
                  <el-table-column label="操作" width="120">
                    <template #default="scope">
                      <el-button size="small" @click="completeAppointment(scope.row)">完成</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              
              <el-tab-pane label="已完成" name="completed">
                <el-table :data="completedAppointments" border>
                  <el-table-column prop="userName" label="用户" width="150"></el-table-column>
                  <el-table-column prop="appointmentTime" label="预约时间" width="180"></el-table-column>
                  <el-table-column prop="description" label="需求描述"></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="文章管理" name="articles">
        <div class="articles-section">
          <div class="section-header">
            <h3>我的文章</h3>
            <el-button type="primary" @click="showArticleDialog">发布文章</el-button>
          </div>
          
          <el-table :data="articleList" border>
            <el-table-column prop="title" label="标题" width="300"></el-table-column>
            <el-table-column prop="category" label="分类" width="120"></el-table-column>
            <el-table-column prop="publishTime" label="发布时间" width="180"></el-table-column>
            <el-table-column prop="views" label="阅读量" width="100"></el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" @click="editArticle(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteArticle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 发布案例对话框 -->
    <el-dialog v-model="caseDialogVisible" title="发布案例" width="800px">
      <el-form :model="caseForm" :rules="caseRules" ref="caseFormRef" label-width="100px">
        <el-form-item label="案例标题" prop="title">
          <el-input v-model="caseForm.title" placeholder="请输入案例标题"></el-input>
        </el-form-item>
        <el-form-item label="设计风格" prop="style">
          <el-select v-model="caseForm.style" placeholder="请选择设计风格">
            <el-option label="现代简约" value="现代简约"></el-option>
            <el-option label="北欧风格" value="北欧风格"></el-option>
            <el-option label="中式风格" value="中式风格"></el-option>
            <el-option label="欧式风格" value="欧式风格"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户型" prop="layout">
          <el-select v-model="caseForm.layout" placeholder="请选择户型">
            <el-option label="一室一厅" value="一室一厅"></el-option>
            <el-option label="两室一厅" value="两室一厅"></el-option>
            <el-option label="三室两厅" value="三室两厅"></el-option>
            <el-option label="四室两厅" value="四室两厅"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model="caseForm.area" placeholder="请输入面积" suffix-icon="平方米"></el-input>
        </el-form-item>
        <el-form-item label="案例图片" prop="images">
          <el-upload
            v-model:file-list="caseForm.images"
            class="upload-demo"
            drag
            :action="uploadUrl"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :on-success="handleImageUploadSuccess"
            accept=".jpg,.jpeg,.png"
          >
            <el-icon class="el-icon--upload"><plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="设计理念" prop="designConcept">
          <el-input
            v-model="caseForm.designConcept"
            type="textarea"
            placeholder="请输入设计理念..."
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="caseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCase" :loading="caseLoading">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 发布文章对话框 -->
    <el-dialog v-model="articleDialogVisible" title="发布文章" width="800px">
      <el-form :model="articleForm" :rules="articleRules" ref="articleFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="category">
          <el-select v-model="articleForm.category" placeholder="请选择分类">
            <el-option label="装修攻略" value="装修攻略"></el-option>
            <el-option label="风格介绍" value="风格介绍"></el-option>
            <el-option label="材料选择" value="材料选择"></el-option>
            <el-option label="施工工艺" value="施工工艺"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input
            v-model="articleForm.content"
            type="textarea"
            placeholder="请输入文章内容..."
            :rows="10"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="articleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveArticle" :loading="articleLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'DesignerProfile',
  setup() {
    const router = useRouter()
    const activeTab = ref('studio')
    const appointmentTab = ref('pending')
    const caseDialogVisible = ref(false)
    const articleDialogVisible = ref(false)
    const caseFormRef = ref()
    const articleFormRef = ref()
    const caseLoading = ref(false)
    const articleLoading = ref(false)
    
    const designerInfo = ref({})
    const studioInfo = ref({})
    const caseList = ref([])
    const pendingAppointments = ref([])
    const acceptedAppointments = ref([])
    const completedAppointments = ref([])
    const articleList = ref([])
    
    const uploadUrl = 'http://localhost:8080/api/upload'
    
    const caseForm = reactive({
      title: '',
      style: '',
      layout: '',
      area: '',
      images: [],
      designConcept: ''
    })
    
    const articleForm = reactive({
      title: '',
      category: '',
      content: ''
    })
    
    const caseRules = {
      title: [
        { required: true, message: '请输入案例标题', trigger: 'blur' }
      ],
      style: [
        { required: true, message: '请选择设计风格', trigger: 'change' }
      ],
      layout: [
        { required: true, message: '请选择户型', trigger: 'change' }
      ],
      area: [
        { required: true, message: '请输入面积', trigger: 'blur' }
      ],
      designConcept: [
        { required: true, message: '请输入设计理念', trigger: 'blur' }
      ]
    }
    
    const articleRules = {
      title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请选择文章分类', trigger: 'change' }
      ],
      content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' }
      ]
    }
    
    const loadDesignerInfo = async () => {
      try {
        // TODO: 调用API获取设计师信息
        designerInfo.value = {
          id: 1,
          name: '张设计师',
          title: '资深室内设计师',
          avatar: 'https://via.placeholder.com/80x80',
          experience: 8,
          completedCases: 156,
          likes: 892
        }
        
        studioInfo.value = {
          name: '张设计师工作室',
          serviceArea: '北京、天津、河北',
          style: '现代简约、北欧风格、新中式',
          price: '300-500元/㎡',
          serviceScope: '室内设计、软装搭配、施工监理',
          description: '拥有8年室内设计经验，擅长现代简约和北欧风格设计。注重空间的实用性和美观性的结合，致力于为客户打造温馨舒适的居住环境。'
        }
      } catch (error) {
        console.error('加载设计师信息失败:', error)
      }
    }
    
    const loadCaseList = async () => {
      try {
        // TODO: 调用API获取案例列表
        caseList.value = [
          {
            id: 1,
            title: '现代简约三居室',
            style: '现代简约',
            area: 120,
            layout: '三室两厅',
            coverImage: 'https://via.placeholder.com/300x200',
            views: 1234,
            likes: 56,
            favorites: 23
          }
        ]
      } catch (error) {
        console.error('加载案例列表失败:', error)
      }
    }
    
    const loadAppointments = async () => {
      try {
        // TODO: 调用API获取预约列表
        pendingAppointments.value = [
          {
            id: 1,
            userName: '用户A',
            appointmentTime: '2024-01-20 14:00',
            description: '三居室现代简约风格设计'
          }
        ]
        
        acceptedAppointments.value = [
          {
            id: 2,
            userName: '用户B',
            appointmentTime: '2024-01-15 10:00',
            description: '两居室北欧风格设计'
          }
        ]
        
        completedAppointments.value = [
          {
            id: 3,
            userName: '用户C',
            appointmentTime: '2024-01-10 15:00',
            description: '一居室小户型改造'
          }
        ]
      } catch (error) {
        console.error('加载预约列表失败:', error)
      }
    }
    
    const loadArticleList = async () => {
      try {
        // TODO: 调用API获取文章列表
        articleList.value = [
          {
            id: 1,
            title: '现代简约风格装修完全指南',
            category: '风格介绍',
            publishTime: '2024-01-15',
            views: 1234
          }
        ]
      } catch (error) {
        console.error('加载文章列表失败:', error)
      }
    }
    
    const handleTabClick = (tab) => {
      if (tab.name === 'portfolio') {
        loadCaseList()
      } else if (tab.name === 'appointments') {
        loadAppointments()
      } else if (tab.name === 'articles') {
        loadArticleList()
      }
    }
    
    const editProfile = () => {
      // TODO: 实现编辑资料功能
      ElMessage.info('编辑资料功能开发中')
    }
    
    const showCaseDialog = () => {
      caseDialogVisible.value = true
    }
    
    const showArticleDialog = () => {
      articleDialogVisible.value = true
    }
    
    const beforeUpload = (file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isValidType) {
        ElMessage.error('只能上传 JPG/PNG 格式的文件!')
        return false
      }
      if (!isLt5M) {
        ElMessage.error('上传文件大小不能超过 5MB!')
        return false
      }
      return true
    }
    
    const handleImageUploadSuccess = (response, file) => {
      console.log('图片上传成功:', response)
    }
    
    const saveCase = async () => {
      try {
        await caseFormRef.value.validate()
        caseLoading.value = true
        
        // TODO: 调用API保存案例
        console.log('保存案例:', caseForm)
        
        caseDialogVisible.value = false
        ElMessage.success('案例发布成功')
        loadCaseList()
        
      } catch (error) {
        console.error('保存案例失败:', error)
      } finally {
        caseLoading.value = false
      }
    }
    
    const editCase = (caseItem) => {
      // TODO: 实现编辑案例功能
      ElMessage.info('编辑案例功能开发中')
    }
    
    const deleteCase = async (caseItem) => {
      try {
        await ElMessageBox.confirm('确定要删除这个案例吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API删除案例
        const index = caseList.value.findIndex(item => item.id === caseItem.id)
        if (index > -1) {
          caseList.value.splice(index, 1)
        }
        
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
        }
      }
    }
    
    const acceptAppointment = async (appointment) => {
      try {
        // TODO: 调用API接受预约
        appointment.status = 'accepted'
        const index = pendingAppointments.value.findIndex(item => item.id === appointment.id)
        if (index > -1) {
          pendingAppointments.value.splice(index, 1)
          acceptedAppointments.value.push(appointment)
        }
        
        ElMessage.success('已接受预约')
      } catch (error) {
        console.error('接受预约失败:', error)
      }
    }
    
    const rejectAppointment = async (appointment) => {
      try {
        await ElMessageBox.confirm('确定要拒绝这个预约吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API拒绝预约
        const index = pendingAppointments.value.findIndex(item => item.id === appointment.id)
        if (index > -1) {
          pendingAppointments.value.splice(index, 1)
        }
        
        ElMessage.success('已拒绝预约')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('拒绝预约失败:', error)
        }
      }
    }
    
    const completeAppointment = async (appointment) => {
      try {
        // TODO: 调用API完成预约
        appointment.status = 'completed'
        const index = acceptedAppointments.value.findIndex(item => item.id === appointment.id)
        if (index > -1) {
          acceptedAppointments.value.splice(index, 1)
          completedAppointments.value.push(appointment)
        }
        
        ElMessage.success('预约已完成')
      } catch (error) {
        console.error('完成预约失败:', error)
      }
    }
    
    const saveArticle = async () => {
      try {
        await articleFormRef.value.validate()
        articleLoading.value = true
        
        // TODO: 调用API保存文章
        console.log('保存文章:', articleForm)
        
        articleDialogVisible.value = false
        ElMessage.success('文章发布成功')
        loadArticleList()
        
      } catch (error) {
        console.error('保存文章失败:', error)
      } finally {
        articleLoading.value = false
      }
    }
    
    const editArticle = (article) => {
      // TODO: 实现编辑文章功能
      ElMessage.info('编辑文章功能开发中')
    }
    
    const deleteArticle = async (article) => {
      try {
        await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用API删除文章
        const index = articleList.value.findIndex(item => item.id === article.id)
        if (index > -1) {
          articleList.value.splice(index, 1)
        }
        
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
        }
      }
    }
    
    onMounted(() => {
      loadDesignerInfo()
    })
    
    return {
      activeTab,
      appointmentTab,
      designerInfo,
      studioInfo,
      caseList,
      pendingAppointments,
      acceptedAppointments,
      completedAppointments,
      articleList,
      caseDialogVisible,
      articleDialogVisible,
      caseForm,
      caseRules,
      caseFormRef,
      caseLoading,
      articleForm,
      articleRules,
      articleFormRef,
      articleLoading,
      uploadUrl,
      handleTabClick,
      editProfile,
      showCaseDialog,
      showArticleDialog,
      beforeUpload,
      handleImageUploadSuccess,
      saveCase,
      editCase,
      deleteCase,
      acceptAppointment,
      rejectAppointment,
      completeAppointment,
      saveArticle,
      editArticle,
      deleteArticle
    }
  }
}
</script>

<style scoped>
.designer-profile {
  max-width: 1200px;
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

.designer-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.designer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.designer-details h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.designer-details p {
  margin: 5px 0;
  color: #666;
}

.designer-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.studio-section {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.studio-description {
  margin-top: 30px;
}

.studio-description h3 {
  margin-bottom: 15px;
  color: #333;
}

.studio-description p {
  color: #666;
  line-height: 1.6;
}

.portfolio-section,
.appointments-section,
.articles-section {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #333;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.case-item {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.case-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.case-info {
  padding: 15px;
}

.case-info h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.case-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.case-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  color: #999;
  font-size: 12px;
}

.case-stats span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.case-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.appointment-tabs {
  margin-top: 20px;
}
</style>
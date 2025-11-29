<template>
  <div class="appointment">
    <div class="appointment-header">
      <h2>预约设计师</h2>
      <p>填写以下信息预约心仪的设计师</p>
    </div>
    
    <div class="appointment-content">
      <div class="designer-info" v-if="selectedDesigner">
        <img :src="selectedDesigner.avatar" :alt="selectedDesigner.name" class="designer-avatar">
        <div class="designer-details">
          <h3>{{ selectedDesigner.name }}</h3>
          <p>{{ selectedDesigner.title }}</p>
          <p>服务区域：{{ selectedDesigner.serviceArea }}</p>
          <p>设计价格：{{ selectedDesigner.price }}</p>
        </div>
      </div>
      
      <el-form :model="appointmentForm" :rules="rules" ref="appointmentFormRef" label-width="100px">
        <el-form-item label="选择设计师" prop="designerId" v-if="!selectedDesigner">
          <el-select v-model="appointmentForm.designerId" placeholder="请选择设计师" @change="onDesignerChange">
            <el-option
              v-for="designer in designerOptions"
              :key="designer.id"
              :label="designer.name"
              :value="designer.id"
            >
              <div class="designer-option">
                <img :src="designer.avatar" :alt="designer.name" class="option-avatar">
                <div class="option-info">
                  <span>{{ designer.name }}</span>
                  <span>{{ designer.title }}</span>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-date-picker
            v-model="appointmentForm.appointmentTime"
            type="datetime"
            placeholder="选择预约时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled-date="disabledDate"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
          ></el-date-picker>
        </el-form-item>
        
        <el-form-item label="户型图" prop="floorPlan">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :file-list="fileList"
            accept=".jpg,.jpeg,.png,.pdf"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 jpg/png/pdf 文件，且不超过 10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="需求描述" prop="description">
          <el-input
            v-model="appointmentForm.description"
            type="textarea"
            placeholder="请详细描述您的装修需求..."
            :rows="6"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
        
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="appointmentForm.contact" placeholder="请输入联系方式（手机号或微信）"></el-input>
        </el-form-item>
        
        <el-form-item label="预算范围" prop="budget">
          <el-select v-model="appointmentForm.budget" placeholder="请选择预算范围">
            <el-option label="5万以下" value="under5"></el-option>
            <el-option label="5-10万" value="5to10"></el-option>
            <el-option label="10-20万" value="10to20"></el-option>
            <el-option label="20-50万" value="20to50"></el-option>
            <el-option label="50万以上" value="over50"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitAppointment" :loading="submitLoading">提交预约</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Appointment',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const appointmentFormRef = ref()
    const submitLoading = ref(false)
    const fileList = ref([])
    const designerOptions = ref([])
    const selectedDesigner = ref(null)
    
    const uploadUrl = 'http://localhost:8080/api/upload'
    
    const appointmentForm = reactive({
      designerId: '',
      appointmentTime: '',
      floorPlan: '',
      description: '',
      contact: '',
      budget: ''
    })
    
    const rules = {
      designerId: [
        { required: true, message: '请选择设计师', trigger: 'change' }
      ],
      appointmentTime: [
        { required: true, message: '请选择预约时间', trigger: 'change' }
      ],
      description: [
        { required: true, message: '请填写需求描述', trigger: 'blur' },
        { min: 10, message: '需求描述至少10个字符', trigger: 'blur' }
      ],
      contact: [
        { required: true, message: '请填写联系方式', trigger: 'blur' }
      ],
      budget: [
        { required: true, message: '请选择预算范围', trigger: 'change' }
      ]
    }
    
    const loadDesignerOptions = async () => {
      try {
        // TODO: 调用API获取设计师列表
        designerOptions.value = [
          {
            id: 1,
            name: '张设计师',
            title: '资深室内设计师',
            avatar: 'https://via.placeholder.com/40x40',
            serviceArea: '北京、天津、河北',
            price: '300-500元/㎡'
          },
          {
            id: 2,
            name: '李设计师',
            title: '高级室内设计师',
            avatar: 'https://via.placeholder.com/40x40',
            serviceArea: '上海、江苏、浙江',
            price: '500-800元/㎡'
          }
        ]
      } catch (error) {
        console.error('加载设计师列表失败:', error)
      }
    }
    
    const loadDesignerDetail = async (designerId) => {
      try {
        // TODO: 调用API获取设计师详情
        const designer = designerOptions.value.find(d => d.id === parseInt(designerId))
        selectedDesigner.value = designer
      } catch (error) {
        console.error('加载设计师详情失败:', error)
      }
    }
    
    const onDesignerChange = (designerId) => {
      loadDesignerDetail(designerId)
    }
    
    const disabledDate = (time) => {
      return time.getTime() < Date.now() - 8.64e7 // 不能选择今天之前的日期
    }
    
    const disabledHours = () => {
      const hours = []
      const now = new Date()
      if (appointmentForm.appointmentTime && 
          new Date(appointmentForm.appointmentTime).toDateString() === now.toDateString()) {
        for (let i = 0; i < now.getHours(); i++) {
          hours.push(i)
        }
      }
      return hours
    }
    
    const disabledMinutes = (hour) => {
      const minutes = []
      const now = new Date()
      if (appointmentForm.appointmentTime && 
          new Date(appointmentForm.appointmentTime).toDateString() === now.toDateString() &&
          hour === now.getHours()) {
        for (let i = 0; i < now.getMinutes(); i++) {
          minutes.push(i)
        }
      }
      return minutes
    }
    
    const beforeUpload = (file) => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isValidType) {
        ElMessage.error('只能上传 JPG/PNG/PDF 格式的文件!')
        return false
      }
      if (!isLt10M) {
        ElMessage.error('上传文件大小不能超过 10MB!')
        return false
      }
      return true
    }
    
    const handleUploadSuccess = (response, file) => {
      appointmentForm.floorPlan = response.data.url
      ElMessage.success('文件上传成功')
    }
    
    const handleUploadError = (error, file) => {
      ElMessage.error('文件上传失败')
      console.error('上传错误:', error)
    }
    
    const submitAppointment = async () => {
      try {
        await appointmentFormRef.value.validate()
        submitLoading.value = true
        
        // 如果是从设计师页面过来的，设置designerId
        if (route.query.designer) {
          appointmentForm.designerId = route.query.designer
        }
        
        // TODO: 调用API提交预约
        console.log('提交预约:', appointmentForm)
        
        ElMessage.success('预约提交成功，请等待设计师确认')
        router.push('/user/profile')
        
      } catch (error) {
        console.error('提交预约失败:', error)
      } finally {
        submitLoading.value = false
      }
    }
    
    const resetForm = () => {
      appointmentFormRef.value.resetFields()
      fileList.value = []
    }
    
    onMounted(() => {
      loadDesignerOptions()
      
      // 如果从设计师页面跳转过来，预选设计师
      if (route.query.designer) {
        appointmentForm.designerId = route.query.designer
        loadDesignerDetail(route.query.designer)
      }
    })
    
    return {
      appointmentForm,
      rules,
      appointmentFormRef,
      submitLoading,
      fileList,
      designerOptions,
      selectedDesigner,
      uploadUrl,
      onDesignerChange,
      disabledDate,
      disabledHours,
      disabledMinutes,
      beforeUpload,
      handleUploadSuccess,
      handleUploadError,
      submitAppointment,
      resetForm
    }
  }
}
</script>

<style scoped>
.appointment {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.appointment-header {
  text-align: center;
  margin-bottom: 40px;
}

.appointment-header h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.appointment-header p {
  color: #666;
  font-size: 16px;
}

.appointment-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.designer-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 30px;
}

.designer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.designer-details h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.designer-details p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.designer-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.option-info {
  display: flex;
  flex-direction: column;
}

.option-info span:first-child {
  font-weight: bold;
  color: #333;
}

.option-info span:last-child {
  font-size: 12px;
  color: #666;
}

.upload-demo {
  width: 100%;
}

.el-form-item:last-child {
  margin-bottom: 0;
}
</style>
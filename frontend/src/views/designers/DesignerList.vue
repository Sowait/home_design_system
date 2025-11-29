<template>
  <div class="designer-list">
    <div class="filter-section">
      <el-form :model="filterForm" inline>
        <el-form-item label="服务区域">
          <el-select v-model="filterForm.area" placeholder="选择服务区域" clearable>
            <el-option label="北京" value="beijing"></el-option>
            <el-option label="上海" value="shanghai"></el-option>
            <el-option label="广州" value="guangzhou"></el-option>
            <el-option label="深圳" value="shenzhen"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="设计风格">
          <el-select v-model="filterForm.style" placeholder="选择设计风格" clearable>
            <el-option label="现代简约" value="modern"></el-option>
            <el-option label="北欧风格" value="nordic"></el-option>
            <el-option label="中式风格" value="chinese"></el-option>
            <el-option label="欧式风格" value="european"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="价格区间">
          <el-select v-model="filterForm.priceRange" placeholder="选择价格区间" clearable>
            <el-option label="100-300元/㎡" value="low"></el-option>
            <el-option label="300-500元/㎡" value="medium"></el-option>
            <el-option label="500-800元/㎡" value="high"></el-option>
            <el-option label="800元以上" value="premium"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-input v-model="filterForm.keyword" placeholder="搜索设计师"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="searchDesigners">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="designer-grid">
      <div v-for="designer in designerList" :key="designer.id" class="designer-card">
        <div class="designer-header">
          <img :src="designer.avatar" :alt="designer.name" class="designer-avatar">
          <div class="designer-info">
            <h3>{{ designer.name }}</h3>
            <p class="designer-title">{{ designer.title }}</p>
            <div class="designer-rating">
              <el-rate v-model="designer.rating" disabled text-color="#ff9900"></el-rate>
              <span class="rating-text">{{ designer.rating }}分</span>
            </div>
          </div>
        </div>
        
        <div class="designer-details">
          <div class="detail-item">
            <strong>服务区域：</strong>{{ designer.serviceArea }}
          </div>
          <div class="detail-item">
            <strong>设计风格：</strong>{{ designer.style }}
          </div>
          <div class="detail-item">
            <strong>设计价格：</strong>{{ designer.price }}
          </div>
          <div class="detail-item">
            <strong>从业年限：</strong>{{ designer.experience }}年
          </div>
          <div class="detail-item">
            <strong>完成案例：</strong>{{ designer.completedCases }}套
          </div>
        </div>
        
        <div class="designer-portfolio">
          <h4>作品展示</h4>
          <div class="portfolio-images">
            <img v-for="work in designer.portfolio" :key="work.id" :src="work.image" :alt="work.title" @click="viewCase(work.id)">
          </div>
        </div>
        
        <div class="designer-actions">
          <el-button type="primary" @click="viewDesignerDetail(designer.id)">查看详情</el-button>
          <el-button type="success" @click="makeAppointment(designer.id)">立即预约</el-button>
        </div>
      </div>
    </div>
    
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 36]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'DesignerList',
  setup() {
    const router = useRouter()
    const designerList = ref([])
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)
    
    const filterForm = reactive({
      area: '',
      style: '',
      priceRange: '',
      keyword: ''
    })
    
    const searchDesigners = () => {
      // TODO: 调用API搜索设计师
      console.log('搜索设计师:', filterForm)
      
      // 模拟数据
      designerList.value = [
        {
          id: 1,
          name: '张设计师',
          title: '资深室内设计师',
          avatar: 'https://via.placeholder.com/80x80',
          rating: 4.8,
          serviceArea: '北京',
          style: '现代简约、北欧风格',
          price: '300-500元/㎡',
          experience: 8,
          completedCases: 156,
          portfolio: [
            { id: 1, image: 'https://via.placeholder.com/100x100', title: '现代简约客厅' },
            { id: 2, image: 'https://via.placeholder.com/100x100', title: '北欧风卧室' },
            { id: 3, image: 'https://via.placeholder.com/100x100', title: '简约书房' }
          ]
        },
        {
          id: 2,
          name: '李设计师',
          title: '高级室内设计师',
          avatar: 'https://via.placeholder.com/80x80',
          rating: 4.9,
          serviceArea: '上海',
          style: '中式风格、欧式风格',
          price: '500-800元/㎡',
          experience: 10,
          completedCases: 203,
          portfolio: [
            { id: 4, image: 'https://via.placeholder.com/100x100', title: '中式客厅' },
            { id: 5, image: 'https://via.placeholder.com/100x100', title: '欧式餐厅' },
            { id: 6, image: 'https://via.placeholder.com/100x100', title: '新中式书房' }
          ]
        }
      ]
      total.value = 50
    }
    
    const resetFilter = () => {
      Object.keys(filterForm).forEach(key => {
        filterForm[key] = ''
      })
      searchDesigners()
    }
    
    const viewDesignerDetail = (id) => {
      router.push(`/designer/${id}`)
    }
    
    const makeAppointment = (id) => {
      const isLoggedIn = localStorage.getItem('token')
      if (!isLoggedIn) {
        ElMessage.warning('请先登录')
        router.push('/login')
        return
      }
      router.push(`/appointment?designer=${id}`)
    }
    
    const viewCase = (id) => {
      router.push(`/case/${id}`)
    }
    
    const handleSizeChange = (val) => {
      pageSize.value = val
      searchDesigners()
    }
    
    const handleCurrentChange = (val) => {
      currentPage.value = val
      searchDesigners()
    }
    
    onMounted(() => {
      searchDesigners()
    })
    
    return {
      designerList,
      filterForm,
      currentPage,
      pageSize,
      total,
      searchDesigners,
      resetFilter,
      viewDesignerDetail,
      makeAppointment,
      viewCase,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.designer-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.designer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.designer-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.designer-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.designer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.designer-info {
  flex: 1;
}

.designer-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.designer-title {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
}

.designer-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-text {
  color: #ff9900;
  font-weight: bold;
}

.designer-details {
  margin-bottom: 20px;
}

.detail-item {
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.detail-item strong {
  color: #666;
  min-width: 80px;
  display: inline-block;
}

.designer-portfolio h4 {
  margin-bottom: 10px;
  color: #333;
}

.portfolio-images {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.portfolio-images img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
}

.portfolio-images img:hover {
  transform: scale(1.1);
}

.designer-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  text-align: center;
}
</style>

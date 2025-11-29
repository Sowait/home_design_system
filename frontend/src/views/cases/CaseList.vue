<template>
  <div class="case-list">
    <div class="filter-section">
      <el-form :model="filterForm" inline>
        <el-form-item label="风格">
          <el-select v-model="filterForm.style" placeholder="选择风格" clearable>
            <el-option label="现代简约" value="modern"></el-option>
            <el-option label="北欧风格" value="nordic"></el-option>
            <el-option label="中式风格" value="chinese"></el-option>
            <el-option label="欧式风格" value="european"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="户型">
          <el-select v-model="filterForm.layout" placeholder="选择户型" clearable>
            <el-option label="一室一厅" value="1bedroom"></el-option>
            <el-option label="两室一厅" value="2bedroom"></el-option>
            <el-option label="三室两厅" value="3bedroom"></el-option>
            <el-option label="四室两厅" value="4bedroom"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="面积">
          <el-select v-model="filterForm.area" placeholder="选择面积" clearable>
            <el-option label="60㎡以下" value="small"></el-option>
            <el-option label="60-90㎡" value="medium"></el-option>
            <el-option label="90-120㎡" value="large"></el-option>
            <el-option label="120㎡以上" value="xlarge"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-input v-model="filterForm.keyword" placeholder="搜索案例"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="searchCases">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="case-grid">
      <div v-for="caseItem in caseList" :key="caseItem.id" class="case-item" @click="viewCaseDetail(caseItem.id)">
        <img :src="caseItem.coverImage" :alt="caseItem.title" class="case-image">
        <div class="case-info">
          <h3>{{ caseItem.title }}</h3>
          <p class="case-style">{{ caseItem.style }}</p>
          <p class="case-meta">{{ caseItem.layout }} · {{ caseItem.area }}㎡ · {{ caseItem.designer }}</p>
          <div class="case-stats">
            <span><el-icon><view /></el-icon> {{ caseItem.views }}</span>
            <span><el-icon><star /></el-icon> {{ caseItem.likes }}</span>
            <span><el-icon><collection /></el-icon> {{ caseItem.favorites }}</span>
          </div>
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

export default {
  name: 'CaseList',
  setup() {
    const router = useRouter()
    const caseList = ref([])
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)
    
    const filterForm = reactive({
      style: '',
      layout: '',
      area: '',
      keyword: ''
    })
    
    const searchCases = () => {
      // TODO: 调用API搜索案例
      console.log('搜索案例:', filterForm)
      // 模拟数据
      caseList.value = [
        {
          id: 1,
          title: '现代简约三居室',
          style: '现代简约',
          layout: '三室两厅',
          area: 120,
          designer: '张设计师',
          coverImage: 'https://via.placeholder.com/300x200',
          views: 1234,
          likes: 56,
          favorites: 23
        },
        {
          id: 2,
          title: '北欧风小户型',
          style: '北欧风格',
          layout: '两室一厅',
          area: 80,
          designer: '李设计师',
          coverImage: 'https://via.placeholder.com/300x200',
          views: 856,
          likes: 34,
          favorites: 12
        }
      ]
      total.value = 50
    }
    
    const resetFilter = () => {
      Object.keys(filterForm).forEach(key => {
        filterForm[key] = ''
      })
      searchCases()
    }
    
    const viewCaseDetail = (id) => {
      router.push(`/case/${id}`)
    }
    
    const handleSizeChange = (val) => {
      pageSize.value = val
      searchCases()
    }
    
    const handleCurrentChange = (val) => {
      currentPage.value = val
      searchCases()
    }
    
    onMounted(() => {
      searchCases()
    })
    
    return {
      caseList,
      filterForm,
      currentPage,
      pageSize,
      total,
      searchCases,
      resetFilter,
      viewCaseDetail,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.case-list {
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

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.case-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.case-item:hover {
  transform: translateY(-5px);
}

.case-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.case-info {
  padding: 15px;
}

.case-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.case-style {
  color: #409EFF;
  font-weight: bold;
  margin: 5px 0;
}

.case-meta {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.case-stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  color: #999;
  font-size: 12px;
}

.case-stats span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.pagination {
  text-align: center;
}
</style>
<template>
  <div class="article-list">
    <div class="filter-section">
      <el-form :model="filterForm" inline>
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="选择分类" clearable>
            <el-option label="装修攻略" value="strategy"></el-option>
            <el-option label="风格介绍" value="style"></el-option>
            <el-option label="材料选择" value="material"></el-option>
            <el-option label="施工工艺" value="construction"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签">
          <el-select v-model="filterForm.tag" placeholder="选择标签" clearable>
            <el-option label="客厅" value="living_room"></el-option>
            <el-option label="卧室" value="bedroom"></el-option>
            <el-option label="厨房" value="kitchen"></el-option>
            <el-option label="卫生间" value="bathroom"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-input v-model="filterForm.keyword" placeholder="搜索文章"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="searchArticles">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="article-container">
      <div class="article-main">
        <div v-for="article in articleList" :key="article.id" class="article-item" @click="viewArticleDetail(article.id)">
          <div class="article-image">
            <img :src="article.coverImage" :alt="article.title">
          </div>
          <div class="article-content">
            <div class="article-category">{{ article.category }}</div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="author">
                <el-icon><user /></el-icon>
                {{ article.author }}
              </span>
              <span class="date">
                <el-icon><calendar /></el-icon>
                {{ article.publishTime }}
              </span>
              <span class="views">
                <el-icon><view /></el-icon>
                {{ article.views }}
              </span>
              <span class="likes">
                <el-icon><star /></el-icon>
                {{ article.likes }}
              </span>
            </div>
            <div class="article-tags">
              <el-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <div class="article-sidebar">
        <div class="sidebar-section">
          <h3>热门文章</h3>
          <div class="hot-articles">
            <div v-for="hot in hotArticles" :key="hot.id" class="hot-item" @click="viewArticleDetail(hot.id)">
              <span class="hot-rank">{{ hot.rank }}</span>
              <span class="hot-title">{{ hot.title }}</span>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h3>推荐设计师</h3>
          <div class="recommended-designers">
            <div v-for="designer in recommendedDesigners" :key="designer.id" class="designer-item" @click="viewDesignerDetail(designer.id)">
              <img :src="designer.avatar" :alt="designer.name" class="designer-avatar">
              <div class="designer-info">
                <div class="designer-name">{{ designer.name }}</div>
                <div class="designer-title">{{ designer.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
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
  name: 'ArticleList',
  setup() {
    const router = useRouter()
    const articleList = ref([])
    const hotArticles = ref([])
    const recommendedDesigners = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    
    const filterForm = reactive({
      category: '',
      tag: '',
      keyword: ''
    })
    
    const searchArticles = () => {
      // TODO: 调用API搜索文章
      console.log('搜索文章:', filterForm)
      
      // 模拟数据
      articleList.value = [
        {
          id: 1,
          title: '现代简约风格装修完全指南',
          summary: '现代简约风格追求简洁明快，注重空间的实用性和美观性。本文将详细介绍现代简约风格的特点、色彩搭配、家具选择等关键要素...',
          coverImage: 'https://via.placeholder.com/200x150',
          category: '风格介绍',
          author: '张设计师',
          publishTime: '2024-01-15',
          views: 1234,
          likes: 56,
          tags: ['现代简约', '客厅', '装修指南']
        },
        {
          id: 2,
          title: '小户型装修的10个实用技巧',
          summary: '小户型装修需要合理利用空间，通过巧妙的设计让小空间显得宽敞舒适。本文分享了10个实用的小户型装修技巧...',
          coverImage: 'https://via.placeholder.com/200x150',
          category: '装修攻略',
          author: '李设计师',
          publishTime: '2024-01-12',
          views: 892,
          likes: 43,
          tags: ['小户型', '装修技巧', '空间利用']
        }
      ]
      total.value = 50
    }
    
    const loadHotArticles = () => {
      // 模拟热门文章数据
      hotArticles.value = [
        { id: 1, rank: 1, title: '2024年最流行的装修风格' },
        { id: 2, rank: 2, title: '装修预算控制完全指南' },
        { id: 3, rank: 3, title: '厨房装修的5个注意事项' },
        { id: 4, rank: 4, title: '卧室色彩搭配技巧' },
        { id: 5, rank: 5, title: '卫生间防水施工要点' }
      ]
    }
    
    const loadRecommendedDesigners = () => {
      // 模拟推荐设计师数据
      recommendedDesigners.value = [
        {
          id: 1,
          name: '张设计师',
          title: '资深室内设计师',
          avatar: 'https://via.placeholder.com/40x40'
        },
        {
          id: 2,
          name: '李设计师',
          title: '高级室内设计师',
          avatar: 'https://via.placeholder.com/40x40'
        },
        {
          id: 3,
          name: '王设计师',
          title: '创意设计师',
          avatar: 'https://via.placeholder.com/40x40'
        }
      ]
    }
    
    const resetFilter = () => {
      Object.keys(filterForm).forEach(key => {
        filterForm[key] = ''
      })
      searchArticles()
    }
    
    const viewArticleDetail = (id) => {
      router.push(`/article/${id}`)
    }
    
    const viewDesignerDetail = (id) => {
      router.push(`/designer/${id}`)
    }
    
    const handleSizeChange = (val) => {
      pageSize.value = val
      searchArticles()
    }
    
    const handleCurrentChange = (val) => {
      currentPage.value = val
      searchArticles()
    }
    
    onMounted(() => {
      searchArticles()
      loadHotArticles()
      loadRecommendedDesigners()
    })
    
    return {
      articleList,
      hotArticles,
      recommendedDesigners,
      filterForm,
      currentPage,
      pageSize,
      total,
      searchArticles,
      resetFilter,
      viewArticleDetail,
      viewDesignerDetail,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.article-list {
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

.article-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  margin-bottom: 30px;
}

.article-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.article-item:hover {
  transform: translateY(-3px);
}

.article-image {
  overflow: hidden;
  border-radius: 8px;
}

.article-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-item:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-category {
  color: #409EFF;
  font-weight: bold;
  font-size: 12px;
}

.article-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  line-height: 1.4;
}

.article-summary {
  color: #666;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 12px;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.sidebar-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 8px;
}

.hot-articles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: color 0.3s;
}

.hot-item:hover {
  color: #409EFF;
}

.hot-rank {
  width: 20px;
  height: 20px;
  background: #409EFF;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.hot-title {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommended-designers {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.designer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.designer-item:hover {
  transform: translateX(5px);
}

.designer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.designer-info {
  flex: 1;
}

.designer-name {
  font-weight: bold;
  color: #333;
}

.designer-title {
  font-size: 12px;
  color: #666;
}

.pagination {
  text-align: center;
}
</style>
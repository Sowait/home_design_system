<template>
  <div class="case-detail">
    <div class="case-header">
      <h1>{{ caseDetail.title }}</h1>
      <div class="case-meta">
        <span>{{ caseDetail.style }}</span>
        <span>{{ caseDetail.layout }}</span>
        <span>{{ caseDetail.area }}㎡</span>
        <span>设计师：{{ caseDetail.designer }}</span>
      </div>
    </div>
    
    <div class="case-content">
      <div class="case-images">
        <el-carousel :interval="4000" type="card" height="400px">
          <el-carousel-item v-for="image in caseDetail.images" :key="image.id">
            <img :src="image.url" :alt="image.description" class="carousel-image">
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <div class="case-info-section">
        <div class="design-concept">
          <h3>设计理念</h3>
          <p>{{ caseDetail.designConcept }}</p>
        </div>
        
        <div class="materials">
          <h3>材料清单</h3>
          <el-table :data="caseDetail.materials" border>
            <el-table-column prop="name" label="材料名称" width="200"></el-table-column>
            <el-table-column prop="brand" label="品牌" width="150"></el-table-column>
            <el-table-column prop="price" label="价格" width="120"></el-table-column>
            <el-table-column prop="usage" label="使用部位"></el-table-column>
          </el-table>
        </div>
        
        <div class="interactions">
          <h3>互动区域</h3>
          <div class="action-buttons">
            <el-button @click="toggleLike" :type="isLiked ? 'danger' : 'default'">
              <el-icon><star /></el-icon> 点赞 {{ caseDetail.likes }}
            </el-button>
            <el-button @click="toggleFavorite" :type="isFavorited ? 'warning' : 'default'">
              <el-icon><collection /></el-icon> 收藏 {{ caseDetail.favorites }}
            </el-button>
          </div>
          
          <div class="comments-section">
            <h4>评论</h4>
            <div class="comment-form">
              <el-input
                v-model="commentContent"
                type="textarea"
                placeholder="请输入评论..."
                :rows="3"
              ></el-input>
              <el-button type="primary" @click="submitComment" :loading="commentLoading">发表评论</el-button>
            </div>
            
            <div class="comment-list">
              <div v-for="comment in caseDetail.comments" :key="comment.id" class="comment-item">
                <div class="comment-header">
                  <strong>{{ comment.username }}</strong>
                  <span class="comment-time">{{ comment.createTime }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'CaseDetail',
  setup() {
    const route = useRoute()
    const caseDetail = ref({})
    const isLiked = ref(false)
    const isFavorited = ref(false)
    const commentContent = ref('')
    const commentLoading = ref(false)
    
    const loadCaseDetail = async () => {
      try {
        // TODO: 调用API获取案例详情
        const caseId = route.params.id
        console.log('加载案例详情:', caseId)
        
        // 模拟数据
        caseDetail.value = {
          id: caseId,
          title: '现代简约三居室设计',
          style: '现代简约',
          layout: '三室两厅',
          area: 120,
          designer: '张设计师',
          images: [
            { id: 1, url: 'https://via.placeholder.com/600x400', description: '客厅' },
            { id: 2, url: 'https://via.placeholder.com/600x400', description: '主卧' },
            { id: 3, url: 'https://via.placeholder.com/600x400', description: '厨房' }
          ],
          designConcept: '本设计采用现代简约风格，注重空间的实用性和美观性的结合，通过合理的空间布局和色彩搭配，打造出温馨舒适的居住环境。',
          materials: [
            { name: '瓷砖', brand: '马可波罗', price: '120元/㎡', usage: '客厅、厨房地面' },
            { name: '乳胶漆', brand: '立邦', price: '35元/桶', usage: '墙面涂刷' },
            { name: '地板', brand: '圣象', price: '180元/㎡', usage: '卧室地面' }
          ],
          likes: 56,
          favorites: 23,
          views: 1234,
          comments: [
            { id: 1, username: '用户A', content: '设计很棒，非常实用！', createTime: '2024-01-15 10:30' },
            { id: 2, username: '用户B', content: '简约而不简单，很喜欢这种风格', createTime: '2024-01-15 14:20' }
          ]
        }
      } catch (error) {
        console.error('加载案例详情失败:', error)
      }
    }
    
    const toggleLike = async () => {
      try {
        // TODO: 调用API点赞
        isLiked.value = !isLiked.value
        caseDetail.value.likes += isLiked.value ? 1 : -1
        ElMessage.success(isLiked.value ? '点赞成功' : '取消点赞')
      } catch (error) {
        console.error('点赞失败:', error)
      }
    }
    
    const toggleFavorite = async () => {
      try {
        // TODO: 调用API收藏
        isFavorited.value = !isFavorited.value
        caseDetail.value.favorites += isFavorited.value ? 1 : -1
        ElMessage.success(isFavorited.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        console.error('收藏失败:', error)
      }
    }
    
    const submitComment = async () => {
      if (!commentContent.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }
      
      try {
        commentLoading.value = true
        // TODO: 调用API提交评论
        
        // 模拟添加评论
        const newComment = {
          id: Date.now(),
          username: '当前用户',
          content: commentContent.value,
          createTime: new Date().toLocaleString()
        }
        caseDetail.value.comments.unshift(newComment)
        commentContent.value = ''
        ElMessage.success('评论发表成功')
      } catch (error) {
        console.error('发表评论失败:', error)
      } finally {
        commentLoading.value = false
      }
    }
    
    onMounted(() => {
      loadCaseDetail()
    })
    
    return {
      caseDetail,
      isLiked,
      isFavorited,
      commentContent,
      commentLoading,
      toggleLike,
      toggleFavorite,
      submitComment
    }
  }
}
</script>

<style scoped>
.case-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.case-header {
  margin-bottom: 30px;
}

.case-header h1 {
  margin: 0 0 15px 0;
  color: #333;
}

.case-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.case-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.design-concept {
  margin-bottom: 30px;
}

.design-concept h3 {
  margin-bottom: 15px;
  color: #333;
}

.materials {
  margin-bottom: 30px;
}

.materials h3 {
  margin-bottom: 15px;
  color: #333;
}

.interactions h3 {
  margin-bottom: 15px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.comment-form {
  margin-bottom: 20px;
}

.comment-form .el-textarea {
  margin-bottom: 10px;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  color: #333;
  line-height: 1.5;
}
</style>
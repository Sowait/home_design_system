<template>
  <div class="designer-detail">
    <div class="designer-header">
      <img :src="designerDetail.avatar" :alt="designerDetail.name" class="designer-avatar">
      <div class="designer-info">
        <h1>{{ designerDetail.name }}</h1>
        <p class="designer-title">{{ designerDetail.title }}</p>
        <div class="designer-rating">
          <el-rate v-model="designerDetail.rating" disabled text-color="#ff9900"></el-rate>
          <span class="rating-text">{{ designerDetail.rating }}分</span>
        </div>
        <div class="designer-stats">
          <span>从业{{ designerDetail.experience }}年</span>
          <span>完成{{ designerDetail.completedCases }}套案例</span>
          <span>获赞{{ designerDetail.likes }}次</span>
        </div>
      </div>
      <div class="designer-actions">
        <el-button type="success" size="large" @click="makeAppointment">立即预约</el-button>
        <el-button @click="followDesigner" :type="isFollowed ? 'warning' : 'default'">
          {{ isFollowed ? '已关注' : '关注' }}
        </el-button>
      </div>
    </div>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="个人简介" name="profile">
        <div class="profile-section">
          <h3>设计师简介</h3>
          <p>{{ designerDetail.bio }}</p>
          
          <h3>教育背景</h3>
          <div class="education-list">
            <div v-for="edu in designerDetail.education" :key="edu.id" class="education-item">
              <strong>{{ edu.school }}</strong> - {{ edu.major }} ({{ edu.period }})
            </div>
          </div>
          
          <h3>获奖经历</h3>
          <div class="awards-list">
            <div v-for="award in designerDetail.awards" :key="award.id" class="award-item">
              <span class="award-year">{{ award.year }}</span>
              <span class="award-name">{{ award.name }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="作品集" name="portfolio">
        <div class="portfolio-section">
          <div class="filter-options">
            <el-select v-model="portfolioFilter" placeholder="筛选作品" @change="filterPortfolio">
              <el-option label="全部" value="all"></el-option>
              <el-option label="客厅" value="living_room"></el-option>
              <el-option label="卧室" value="bedroom"></el-option>
              <el-option label="厨房" value="kitchen"></el-option>
              <el-option label="卫生间" value="bathroom"></el-option>
            </el-select>
          </div>
          
          <div class="portfolio-grid">
            <div v-for="work in filteredPortfolio" :key="work.id" class="portfolio-item" @click="viewCase(work.id)">
              <img :src="work.image" :alt="work.title" class="work-image">
              <div class="work-info">
                <h4>{{ work.title }}</h4>
                <p>{{ work.style }} · {{ work.area }}㎡</p>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="服务信息" name="service">
        <div class="service-section">
          <div class="service-info">
            <div class="info-item">
              <h3>服务区域</h3>
              <p>{{ designerDetail.serviceArea }}</p>
            </div>
            <div class="info-item">
              <h3>设计风格</h3>
              <p>{{ designerDetail.style }}</p>
            </div>
            <div class="info-item">
              <h3>设计价格</h3>
              <p>{{ designerDetail.price }}</p>
            </div>
            <div class="info-item">
              <h3>服务范围</h3>
              <p>{{ designerDetail.serviceScope }}</p>
            </div>
          </div>
          
          <div class="service-process">
            <h3>服务流程</h3>
            <el-steps :active="4" align-center>
              <el-step title="初步沟通" description="了解客户需求"></el-step>
              <el-step title="方案设计" description="提供设计方案"></el-step>
              <el-step title="方案确认" description="确认最终方案"></el-step>
              <el-step title="施工跟进" description="监督施工过程"></el-step>
              <el-step title="完工验收" description="最终验收交付"></el-step>
            </el-steps>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="用户评价" name="reviews">
        <div class="reviews-section">
          <div class="review-summary">
            <div class="summary-item">
              <span class="score">{{ designerDetail.rating }}</span>
              <el-rate v-model="designerDetail.rating" disabled text-color="#ff9900"></el-rate>
              <span>总体评分</span>
            </div>
            <div class="rating-distribution">
              <div v-for="item in ratingDistribution" :key="item.star" class="rating-item">
                <span>{{ item.star }}星</span>
                <el-progress :percentage="item.percentage" :show-text="false"></el-progress>
                <span>{{ item.count }}</span>
              </div>
            </div>
          </div>
          
          <div class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <img :src="review.avatar" :alt="review.username" class="reviewer-avatar">
                  <div>
                    <strong>{{ review.username }}</strong>
                    <el-rate v-model="review.rating" disabled text-color="#ff9900"></el-rate>
                  </div>
                </div>
                <span class="review-time">{{ review.createTime }}</span>
              </div>
              <div class="review-content">{{ review.content }}</div>
              <div class="review-project">
                <strong>评价项目：</strong>{{ review.projectTitle }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'DesignerDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const activeTab = ref('profile')
    const portfolioFilter = ref('all')
    const isFollowed = ref(false)
    
    const designerDetail = ref({})
    const portfolio = ref([])
    const reviews = ref([])
    
    const ratingDistribution = ref([
      { star: 5, percentage: 75, count: 150 },
      { star: 4, percentage: 15, count: 30 },
      { star: 3, percentage: 7, count: 14 },
      { star: 2, percentage: 2, count: 4 },
      { star: 1, percentage: 1, count: 2 }
    ])
    
    const filteredPortfolio = computed(() => {
      if (portfolioFilter.value === 'all') {
        return portfolio.value
      }
      return portfolio.value.filter(item => item.type === portfolioFilter.value)
    })
    
    const loadDesignerDetail = async () => {
      try {
        const designerId = route.params.id
        console.log('加载设计师详情:', designerId)
        
        // 模拟数据
        designerDetail.value = {
          id: designerId,
          name: '张设计师',
          title: '资深室内设计师',
          avatar: 'https://via.placeholder.com/100x100',
          rating: 4.8,
          experience: 8,
          completedCases: 156,
          likes: 892,
          bio: '拥有8年室内设计经验，擅长现代简约和北欧风格设计。注重空间的实用性和美观性的结合，致力于为客户打造温馨舒适的居住环境。',
          education: [
            { id: 1, school: '清华大学美术学院', major: '环境艺术设计', period: '2012-2016' },
            { id: 2, school: '中央美术学院', major: '室内设计', period: '2016-2018' }
          ],
          awards: [
            { id: 1, year: '2023', name: '中国室内设计大奖赛金奖' },
            { id: 2, year: '2022', name: '亚太室内设计精英赛银奖' }
          ],
          serviceArea: '北京、天津、河北',
          style: '现代简约、北欧风格、新中式',
          price: '300-500元/㎡',
          serviceScope: '室内设计、软装搭配、施工监理'
        }
        
        portfolio.value = [
          {
            id: 1,
            title: '现代简约三居室',
            style: '现代简约',
            area: 120,
            type: 'living_room',
            image: 'https://via.placeholder.com/300x200'
          },
          {
            id: 2,
            title: '北欧风主卧',
            style: '北欧风格',
            area: 20,
            type: 'bedroom',
            image: 'https://via.placeholder.com/300x200'
          }
        ]
        
        reviews.value = [
          {
            id: 1,
            username: '用户A',
            avatar: 'https://via.placeholder.com/40x40',
            rating: 5,
            content: '设计师非常专业，沟通顺畅，设计效果超出预期！',
            projectTitle: '现代简约三居室设计',
            createTime: '2024-01-15 10:30'
          },
          {
            id: 2,
            username: '用户B',
            avatar: 'https://via.placeholder.com/40x40',
            rating: 4,
            content: '设计理念很好，施工跟进也很及时，总体满意。',
            projectTitle: '北欧风两居室改造',
            createTime: '2024-01-10 14:20'
          }
        ]
        
      } catch (error) {
        console.error('加载设计师详情失败:', error)
      }
    }
    
    const handleTabClick = (tab) => {
      console.log('切换到标签:', tab.name)
    }
    
    const filterPortfolio = () => {
      console.log('筛选作品:', portfolioFilter.value)
    }
    
    const makeAppointment = () => {
      const isLoggedIn = localStorage.getItem('token')
      if (!isLoggedIn) {
        ElMessage.warning('请先登录')
        router.push('/login')
        return
      }
      router.push(`/appointment?designer=${designerDetail.value.id}`)
    }
    
    const followDesigner = () => {
      // TODO: 调用API关注/取消关注
      isFollowed.value = !isFollowed.value
      ElMessage.success(isFollowed.value ? '关注成功' : '取消关注')
    }
    
    const viewCase = (id) => {
      router.push(`/case/${id}`)
    }
    
    onMounted(() => {
      loadDesignerDetail()
    })
    
    return {
      activeTab,
      portfolioFilter,
      designerDetail,
      portfolio,
      reviews,
      ratingDistribution,
      filteredPortfolio,
      isFollowed,
      handleTabClick,
      filterPortfolio,
      makeAppointment,
      followDesigner,
      viewCase
    }
  }
}
</script>

<style scoped>
.designer-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.designer-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.designer-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.designer-info {
  flex: 1;
}

.designer-info h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.designer-title {
  color: #666;
  font-size: 16px;
  margin: 10px 0;
}

.designer-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.rating-text {
  color: #ff9900;
  font-weight: bold;
}

.designer-stats {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  color: #666;
}

.designer-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.profile-section h3 {
  margin: 30px 0 15px 0;
  color: #333;
}

.education-item, .award-item {
  margin-bottom: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.award-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.award-year {
  color: #409EFF;
  font-weight: bold;
  min-width: 60px;
}

.filter-options {
  margin-bottom: 20px;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.portfolio-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.portfolio-item:hover {
  transform: translateY(-5px);
}

.work-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.work-info {
  padding: 15px;
}

.work-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.work-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.service-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-item {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.info-item h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.info-item p {
  margin: 0;
  color: #666;
}

.service-process {
  margin-top: 30px;
}

.service-process h3 {
  margin-bottom: 20px;
  color: #333;
}

.review-summary {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.summary-item {
  text-align: center;
}

.summary-item .score {
  font-size: 48px;
  font-weight: bold;
  color: #ff9900;
  display: block;
  margin-bottom: 10px;
}

.rating-distribution {
  flex: 1;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.rating-item span:first-child {
  min-width: 40px;
}

.rating-item .el-progress {
  flex: 1;
}

.rating-item span:last-child {
  min-width: 30px;
  text-align: right;
}

.review-item {
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.review-time {
  color: #999;
  font-size: 12px;
}

.review-content {
  margin-bottom: 10px;
  line-height: 1.5;
}

.review-project {
  color: #666;
  font-size: 14px;
}
</style>
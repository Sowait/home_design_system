<template>
  <div class="article-detail">
    <div class="article-header">
      <div class="article-category">{{ articleDetail.category }}</div>
      <h1>{{ articleDetail.title }}</h1>
      <div class="article-meta">
        <span class="author">
          <el-icon><user /></el-icon>
          {{ articleDetail.author }}
        </span>
        <span class="date">
          <el-icon><calendar /></el-icon>
          {{ articleDetail.publishTime }}
        </span>
        <span class="views">
          <el-icon><view /></el-icon>
          {{ articleDetail.views }}
        </span>
        <span class="likes">
          <el-icon><star /></el-icon>
          {{ articleDetail.likes }}
        </span>
      </div>
      <div class="article-tags">
        <el-tag v-for="tag in articleDetail.tags" :key="tag" size="small">{{ tag }}</el-tag>
      </div>
    </div>
    
    <div class="article-content">
      <div class="article-image" v-if="articleDetail.coverImage">
        <img :src="articleDetail.coverImage" :alt="articleDetail.title">
      </div>
      
      <div class="article-body" v-html="articleDetail.content"></div>
    </div>
    
    <div class="article-actions">
      <el-button @click="toggleLike" :type="isLiked ? 'danger' : 'default'">
        <el-icon><star /></el-icon> {{ isLiked ? '已点赞' : '点赞' }} {{ articleDetail.likes }}
      </el-button>
      <el-button @click="shareArticle">
        <el-icon><share /></el-icon> 分享
      </el-button>
      <el-button @click="collectArticle" :type="isCollected ? 'warning' : 'default'">
        <el-icon><collection /></el-icon> {{ isCollected ? '已收藏' : '收藏' }}
      </el-button>
    </div>
    
    <div class="author-section">
      <h3>作者信息</h3>
      <div class="author-card" @click="viewAuthorProfile">
        <img :src="articleDetail.authorAvatar" :alt="articleDetail.author" class="author-avatar">
        <div class="author-info">
          <div class="author-name">{{ articleDetail.author }}</div>
          <div class="author-title">{{ articleDetail.authorTitle }}</div>
          <div class="author-bio">{{ articleDetail.authorBio }}</div>
        </div>
        <el-button type="primary">查看详情</el-button>
      </div>
    </div>
    
    <div class="related-articles">
      <h3>相关文章</h3>
      <div class="related-grid">
        <div v-for="article in relatedArticles" :key="article.id" class="related-item" @click="viewArticleDetail(article.id)">
          <img :src="article.coverImage" :alt="article.title" class="related-image">
          <div class="related-info">
            <h4>{{ article.title }}</h4>
            <p>{{ article.summary }}</p>
            <div class="related-meta">
              <span>{{ article.author }}</span>
              <span>{{ article.publishTime }}</span>
              <span>{{ article.views }}阅读</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="comments-section">
      <h3>评论</h3>
      <div class="comment-form">
        <el-input
          v-model="commentContent"
          type="textarea"
          placeholder="请输入评论..."
          :rows="4"
          maxlength="500"
          show-word-limit
        ></el-input>
        <el-button type="primary" @click="submitComment" :loading="commentLoading">发表评论</el-button>
      </div>
      
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <img :src="comment.avatar" :alt="comment.username" class="comment-avatar">
            <div class="comment-info">
              <div class="comment-user">
                <strong>{{ comment.username }}</strong>
                <span class="comment-time">{{ comment.createTime }}</span>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <el-button size="small" text @click="replyComment(comment)">
                  <el-icon><chat-dot-round /></el-icon> 回复
                </el-button>
                <el-button size="small" text @click="likeComment(comment)">
                  <el-icon><star /></el-icon> {{ comment.likes }}
                </el-button>
              </div>
            </div>
          </div>
          
          <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
            <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
              <img :src="reply.avatar" :alt="reply.username" class="reply-avatar">
              <div class="reply-info">
                <div class="reply-user">
                  <strong>{{ reply.username }}</strong>
                  <span class="reply-time">{{ reply.createTime }}</span>
                </div>
                <div class="reply-content">
                  <span v-if="reply.replyTo">@{{ reply.replyTo }}：</span>{{ reply.content }}
                </div>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'ArticleDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const articleDetail = ref({})
    const relatedArticles = ref([])
    const comments = ref([])
    const isLiked = ref(false)
    const isCollected = ref(false)
    const commentContent = ref('')
    const commentLoading = ref(false)
    
    const loadArticleDetail = async () => {
      try {
        const articleId = route.params.id
        console.log('加载文章详情:', articleId)
        
        // 模拟数据
        articleDetail.value = {
          id: articleId,
          title: '现代简约风格装修完全指南',
          category: '风格介绍',
          author: '张设计师',
          authorTitle: '资深室内设计师',
          authorAvatar: 'https://via.placeholder.com/60x60',
          authorBio: '拥有8年室内设计经验，擅长现代简约和北欧风格设计。',
          coverImage: 'https://via.placeholder.com/800x400',
          publishTime: '2024-01-15',
          views: 1234,
          likes: 56,
          tags: ['现代简约', '客厅', '装修指南'],
          content: `
            <h2>什么是现代简约风格</h2>
            <p>现代简约风格追求简洁明快，注重空间的实用性和美观性的结合。它强调"少即是多"的设计理念，通过简洁的线条、纯粹的色彩和实用的功能来营造舒适的生活空间。</p>
            
            <h2>现代简约风格的特点</h2>
            <ul>
              <li><strong>色彩简洁：</strong>以黑、白、灰为主色调，偶尔使用明亮的色彩作为点缀</li>
              <li><strong>线条流畅：</strong>注重线条的简洁性和流畅性，避免复杂的装饰</li>
              <li><strong>功能实用：</strong>强调空间的实用性和功能性</li>
              <li><strong>材质自然：</strong>多使用天然材料，如实木、石材等</li>
            </ul>
            
            <h2>如何打造现代简约风格</h2>
            <p>想要打造现代简约风格的家居空间，需要注意以下几个方面：</p>
            <ol>
              <li>选择简洁的家具款式，避免过多装饰</li>
              <li>控制色彩数量，保持整体色调的统一</li>
              <li>合理利用空间，避免过度拥挤</li>
              <li>注重采光和通风，营造明亮舒适的环境</li>
            </ol>
          `
        }
        
        relatedArticles.value = [
          {
            id: 2,
            title: '小户型装修的10个实用技巧',
            summary: '小户型装修需要合理利用空间，通过巧妙的设计让小空间显得宽敞舒适...',
            coverImage: 'https://via.placeholder.com/200x150',
            author: '李设计师',
            publishTime: '2024-01-12',
            views: 892
          },
          {
            id: 3,
            title: '北欧风格的色彩搭配指南',
            summary: '北欧风格以清新自然著称，色彩搭配是打造北欧风的关键...',
            coverImage: 'https://via.placeholder.com/200x150',
            author: '王设计师',
            publishTime: '2024-01-10',
            views: 678
          }
        ]
        
        comments.value = [
          {
            id: 1,
            username: '用户A',
            avatar: 'https://via.placeholder.com/40x40',
            content: '文章写得很详细，对我帮助很大！',
            createTime: '2024-01-15 10:30',
            likes: 5,
            replies: [
              {
                id: 1,
                username: '张设计师',
                avatar: 'https://via.placeholder.com/40x40',
                content: '谢谢支持，有问题可以随时交流',
                createTime: '2024-01-15 11:00',
                replyTo: '用户A'
              }
            ]
          },
          {
            id: 2,
            username: '用户B',
            avatar: 'https://via.placeholder.com/40x40',
            content: '现代简约风格确实很适合现在的年轻人，简洁实用',
            createTime: '2024-01-15 14:20',
            likes: 3,
            replies: []
          }
        ]
        
      } catch (error) {
        console.error('加载文章详情失败:', error)
      }
    }
    
    const toggleLike = async () => {
      try {
        // TODO: 调用API点赞
        isLiked.value = !isLiked.value
        articleDetail.value.likes += isLiked.value ? 1 : -1
        ElMessage.success(isLiked.value ? '点赞成功' : '取消点赞')
      } catch (error) {
        console.error('点赞失败:', error)
      }
    }
    
    const shareArticle = () => {
      // TODO: 实现分享功能
      ElMessage.info('分享功能开发中')
    }
    
    const collectArticle = async () => {
      try {
        // TODO: 调用API收藏
        isCollected.value = !isCollected.value
        ElMessage.success(isCollected.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        console.error('收藏失败:', error)
      }
    }
    
    const viewAuthorProfile = () => {
      // TODO: 跳转到作者主页
      ElMessage.info('作者主页功能开发中')
    }
    
    const viewArticleDetail = (id) => {
      router.push(`/article/${id}`)
    }
    
    const submitComment = async () => {
      if (!commentContent.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }
      
      try {
        commentLoading.value = true
        // TODO: 调用API提交评论
        
        const newComment = {
          id: Date.now(),
          username: '当前用户',
          avatar: 'https://via.placeholder.com/40x40',
          content: commentContent.value,
          createTime: new Date().toLocaleString(),
          likes: 0,
          replies: []
        }
        comments.value.unshift(newComment)
        commentContent.value = ''
        ElMessage.success('评论发表成功')
      } catch (error) {
        console.error('发表评论失败:', error)
      } finally {
        commentLoading.value = false
      }
    }
    
    const replyComment = (comment) => {
      // TODO: 实现回复功能
      ElMessage.info('回复功能开发中')
    }
    
    const likeComment = async (comment) => {
      try {
        // TODO: 调用API点赞评论
        comment.likes += 1
        ElMessage.success('点赞成功')
      } catch (error) {
        console.error('点赞评论失败:', error)
      }
    }
    
    onMounted(() => {
      loadArticleDetail()
    })
    
    return {
      articleDetail,
      relatedArticles,
      comments,
      isLiked,
      isCollected,
      commentContent,
      commentLoading,
      toggleLike,
      shareArticle,
      collectArticle,
      viewAuthorProfile,
      viewArticleDetail,
      submitComment,
      replyComment,
      likeComment
    }
  }
}
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.article-category {
  color: #409EFF;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
}

.article-header h1 {
  margin: 0 0 15px 0;
  color: #333;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
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

.article-content {
  margin-bottom: 30px;
}

.article-image {
  margin-bottom: 20px;
}

.article-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.article-body {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

.article-body :deep(h2) {
  color: #333;
  margin: 30px 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.article-body :deep(p) {
  margin-bottom: 15px;
  text-align: justify;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin-bottom: 15px;
  padding-left: 20px;
}

.article-body :deep(li) {
  margin-bottom: 8px;
}

.article-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.author-section {
  margin-bottom: 40px;
}

.author-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.author-card:hover {
  transform: translateX(5px);
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.author-title {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.author-bio {
  color: #999;
  font-size: 12px;
}

.related-articles {
  margin-bottom: 40px;
}

.related-articles h3 {
  margin-bottom: 20px;
  color: #333;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.related-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.related-item:hover {
  transform: translateY(-3px);
}

.related-image {
  width: 120px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.related-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.related-info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  display: flex;
  gap: 10px;
  color: #999;
  font-size: 11px;
}

.comments-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form .el-textarea {
  margin-bottom: 10px;
}

.comment-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-info {
  flex: 1;
}

.comment-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  gap: 15px;
}

.reply-list {
  margin-top: 15px;
  padding-left: 55px;
}

.reply-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.reply-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.reply-info {
  flex: 1;
}

.reply-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.reply-time {
  color: #999;
  font-size: 11px;
}

.reply-content {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.reply-content span {
  color: #409EFF;
  font-weight: bold;
}
</style>
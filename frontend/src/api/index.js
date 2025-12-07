import request from './request';

// 用户相关API
export const userApi = {
  // 用户登录
  login: (data) => request.post('/auth/login', data),
  
  // 用户注册
  register: (data) => request.post('/auth/register', data),
  
  // 获取用户信息
  getUserInfo: () => request.get('/auth/me'),
  
  // 更新用户信息
  updateUserInfo: (data) => request.put('/user/profile', data),
  
  // 上传头像
  uploadAvatar: (data) => request.post('/user/avatar', data),
  
  // 获取收藏列表
  getFavorites: (params) => request.get('/user/favorites', { params }),
  
  // 获取评论列表
  getComments: (params) => request.get('/user/comments', { params }),
  
  // 添加收藏
  addFavorite: (data) => request.post('/user/favorite', data),
  
  // 取消收藏
  removeFavorite: (id) => request.delete(`/user/favorite/${id}`),
  
  // 获取用户统计
  getUserStats: () => request.get('/user/stats'),
};

// 设计案例相关API
export const caseApi = {
  // 获取案例列表
  getCases: (params) => request.get('/cases', { params }),
  
  // 获取案例详情
  getCaseDetail: (id) => request.get(`/cases/${id}`),
  
  // 点赞案例
  likeCase: (id) => request.post(`/cases/${id}/like`),
  
  // 获取我的案例
  getMyCases: (params) => request.get('/cases/my', { params }),
  
  // 创建案例
  createCase: (data) => request.post('/cases', data),
  
  // 更新案例
  updateCase: (id, data) => request.put(`/cases/${id}`, data),
  
  // 删除案例
  deleteCase: (id) => request.delete(`/cases/${id}`),
  
  // 发布案例
  publishCase: (id) => request.put(`/cases/${id}/publish`),
};

// 设计师相关API
export const designerApi = {
  // 获取设计师列表
  getDesigners: (params) => request.get('/designers', { params }),
  
  // 获取设计师详情
  getDesignerDetail: (id) => request.get(`/designers/${id}`),
  
  // 点赞设计师
  likeDesigner: (id) => request.post(`/designers/${id}/like`),
  
  // 获取我的设计师信息
  getMyDesigners: () => request.get('/designers/my'),
  
  // 更新设计师信息
  updateDesignerProfile: (data) => request.put('/designers/profile', data),
  
  // 获取热门设计师
  getTopDesigners: (params) => request.get('/designers/top', { params }),
};

// 文章相关API
export const articleApi = {
  // 获取文章列表
  getArticles: (params) => request.get('/articles', { params }),
  
  // 获取文章详情
  getArticleDetail: (id) => request.get(`/articles/${id}`),
  
  // 点赞文章
  likeArticle: (id) => request.post(`/articles/${id}/like`),
  
  // 创建文章
  createArticle: (data) => request.post('/articles', data),
  
  // 更新文章
  updateArticle: (id, data) => request.put(`/articles/${id}`, data),
  
  // 删除文章
  deleteArticle: (id) => request.delete(`/articles/${id}`),
  
  // 发布文章
  publishArticle: (id) => request.put(`/articles/${id}/publish`),
  
  // 获取文章分类
  getCategories: () => request.get('/articles/categories'),
  
  // 获取热门文章
  getHotArticles: (params) => request.get('/articles/hot', { params }),
};

// 预约相关API
export const appointmentApi = {
  // 创建预约
  createAppointment: (data) => request.post('/appointments', data),
  
  // 获取我的预约
  getMyAppointments: (params) => request.get('/appointments/my', { params }),
  
  // 获取设计师预约
  getDesignerAppointments: (params) => request.get('/appointments/designer', { params }),
  
  // 获取预约详情
  getAppointmentDetail: (id) => request.get(`/appointments/${id}`),
  
  // 取消预约
  cancelAppointment: (id, data) => request.put(`/appointments/${id}/cancel`, data),
  
  // 确认预约
  confirmAppointment: (id, data) => request.put(`/appointments/${id}/confirm`, data),
  
  // 拒绝预约
  rejectAppointment: (id, data) => request.put(`/appointments/${id}/reject`, data),
  
  // 完成预约
  completeAppointment: (id, data) => request.put(`/appointments/${id}/complete`, data),
  
  // 获取预约历史记录
  getAppointmentHistory: (id) => request.get(`/appointments/${id}/history`),
  
  // 获取预约统计
  getAppointmentStats: () => request.get('/appointments/stats'),
  
  // 批量更新预约状态
  batchUpdateStatus: (data) => request.put('/appointments/batch-update', data),
  
  // 获取所有预约（管理员）
  getAllAppointments: (params) => request.get('/appointments/admin', { params }),
};

// 管理员相关API
export const adminApi = {
  // 获取仪表板统计
  getDashboardStats: () => request.get('/admin/dashboard/stats'),
  
  // 获取用户列表
  getUserList: (params) => request.get('/admin/users', { params }),
  
  // 删除用户
  deleteUser: (id) => request.delete(`/admin/users/${id}`),
  
  // 更新用户
  updateUser: (id, data) => request.put(`/admin/users/${id}`, data),
  
  // 获取设计师信息
  getDesignerByUserId: (userId) => request.get(`/admin/designers/user/${userId}`),
  
  // 更新设计师信息
  updateDesignerByUserId: (userId, data) => request.put(`/admin/designers/user/${userId}`, data),
  
  // 获取案例列表
  getCaseList: (params) => request.get('/admin/cases', { params }),
  
  // 审核案例
  reviewCase: (id, status) => request.put(`/admin/cases/${id}/review`, null, { params: { status } }),
  
  // 获取文章列表
  getArticleList: (params) => request.get('/admin/articles', { params }),
  
  // 审核文章
  reviewArticle: (id, status) => request.put(`/admin/articles/${id}/review`, null, { params: { status } }),
  
  // 获取预约列表
  getAppointmentList: (params) => request.get('/admin/appointments', { params }),
  
  // 处理预约
  handleAppointment: (id, status) => request.put(`/admin/appointments/${id}/handle`, null, { params: { status } }),
};

// 审核相关API
export const reviewApi = {
  // 案例审核
  getPendingCases: (params) => request.get('/admin/review/cases/pending', { params }),
  reviewCase: (caseId, data) => request.post(`/admin/review/cases/${caseId}/review`, data),
  getCaseReviewHistory: (caseId) => request.get(`/admin/review/cases/${caseId}/history`),
  batchReviewCases: (data) => request.post('/admin/review/cases/batch-review', data),
  submitCaseForReview: (caseId) => request.post(`/admin/review/cases/${caseId}/submit`),
  autoReviewCase: (caseId) => request.post(`/admin/review/cases/${caseId}/auto-review`),
  
  // 文章审核
  getPendingArticles: (params) => request.get('/admin/review/articles/pending', { params }),
  reviewArticle: (articleId, data) => request.post(`/admin/review/articles/${articleId}/review`, data),
  getArticleReviewHistory: (articleId) => request.get(`/admin/review/articles/${articleId}/history`),
  batchReviewArticles: (data) => request.post('/admin/review/articles/batch-review', data),
  submitArticleForReview: (articleId) => request.post(`/admin/review/articles/${articleId}/submit`),
  autoReviewArticle: (articleId) => request.post(`/admin/review/articles/${articleId}/auto-review`),
  
  // 审核统计
  getReviewStats: () => request.get('/admin/review/stats'),
  getReviewerStats: () => request.get('/admin/review/reviewer-stats'),
  
  // 通知测试
  testNotification: (data) => request.post('/admin/review/test-notification', data),
};

// 设计师控制台相关API
export const designerDashboardApi = {
  // 获取统计信息
  getStats: () => request.get('/designer/dashboard/stats'),
  
  // 获取我的案例
  getMyCases: (params) => request.get('/designer/dashboard/cases', { params }),
  
  // 创建案例
  createCase: (data) => request.post('/designer/dashboard/cases', data),
  
  // 更新案例
  updateCase: (id, data) => request.put(`/designer/dashboard/cases/${id}`, data),
  
  // 删除案例
  deleteCase: (id) => request.delete(`/designer/dashboard/cases/${id}`),
  
  // 发布案例
  publishCase: (id) => request.put(`/designer/dashboard/cases/${id}/publish`),
  
  // 获取我的预约
  getMyAppointments: (params) => request.get('/designer/dashboard/appointments', { params }),
  
  // 处理预约
  handleAppointment: (id, params) => request.put(`/designer/dashboard/appointments/${id}/handle`, null, { params }),
};

// 评论相关API
export const commentApi = {
  // 获取评论列表
  getComments: (params) => request.get('/comments', { params }),
  
  // 获取评论树（支持多级评论）
  getCommentTree: (params) => request.get('/comments/tree', { params }),
  
  // 创建评论（支持回复）
  createComment: (data) => request.post('/comments/create', data),
  
  // 回复评论
  replyComment: (parentId, data) => request.post(`/comments/reply/${parentId}`, data),
  
  // 更新评论
  updateComment: (id, data) => request.put(`/comments/${id}/update`, data),
  
  // 删除评论
  deleteComment: (id) => request.delete(`/comments/${id}/delete`),
  
  // 点赞评论
  likeComment: (id) => request.post(`/comments/${id}/like`),
  
  // 获取子评论
  getChildComments: (parentId) => request.get(`/comments/${parentId}/replies`),
  
  // 获取案例评论
  getCaseComments: (caseId, params) => request.get(`/comments/case/${caseId}`, { params }),
  
  // 获取文章评论
  getArticleComments: (articleId, params) => request.get(`/comments/article/${articleId}`, { params }),
  
  // 获取用户评论列表
  getUserComments: (userId, params) => request.get(`/comments/user/${userId}`, { params }),
};

// 收藏相关API
export const favoriteApi = {
  // 获取我的收藏
  getMyFavorites: (params) => request.get('/favorites', { params }),
  
  // 添加收藏
  addFavorite: (data) => request.post('/favorites/add', data),
  
  // 取消收藏
  removeFavorite: (id) => request.delete(`/favorites/${id}`),
  
  // 检查是否收藏
  checkFavorite: (params) => request.get('/favorites/check', { params }),
  
  // 获取收藏的案例
  getFavoriteCases: (params) => request.get('/favorites/cases', { params }),
  
  // 获取收藏的设计师
  getFavoriteDesigners: (params) => request.get('/favorites/designers', { params }),
  
  // 获取收藏的文章
  getFavoriteArticles: (params) => request.get('/favorites/articles', { params }),
};

// 搜索相关API
export const searchApi = {
  // 综合搜索
  searchAll: (params) => request.get('/search/all', { params }),
  
  // 搜索案例
  searchCases: (params) => request.get('/search/cases', { params }),
  
  // 搜索设计师
  searchDesigners: (params) => request.get('/search/designers', { params }),
  
  // 搜索文章
  searchArticles: (params) => request.get('/search/articles', { params }),
  
  // 获取搜索建议
  getSearchSuggestions: (keyword) => request.get('/search/suggestions', { params: { keyword } }),
};

  // 通知相关API
export const notificationApi = {
  // 获取通知列表
  getNotifications: (params) => request.get('/notifications', { params }),
  
  // 获取未读通知数量
  getUnreadCount: () => request.get('/notifications/unread-count'),
  
  // 标记通知为已读
  markAsRead: (id) => request.put(`/notifications/${id}/read`),
  
  // 标记所有通知为已读
  markAllAsRead: () => request.put('/notifications/read-all'),
  
  // 删除通知
  deleteNotification: (id) => request.delete(`/notifications/${id}`),
  
  // 批量删除通知
  batchDeleteNotifications: (ids) => request.delete('/notifications/batch', { data: ids }),
  
  // 获取通知详情
  getNotificationById: (id) => request.get(`/notifications/${id}`),
  
  // 搜索通知
  searchNotifications: (params) => request.get('/notifications/search', { params }),
  
  // 获取通知统计
  getNotificationStats: () => request.get('/notifications/stats'),
  
  // 获取通知设置
  getNotificationSettings: () => request.get('/notifications/settings'),
  
  // 更新通知设置
  updateNotificationSettings: (settings) => request.put('/notifications/settings', settings),
  
  // 管理员功能
  sendGlobalNotification: (data) => request.post('/notifications/admin/global', data),
  sendNotificationToUsers: (data) => request.post('/notifications/admin/users', data),
  cleanupExpiredNotifications: (days) => request.delete('/notifications/admin/cleanup', { params: { days } }),
  getAdminNotificationStats: () => request.get('/notifications/admin/stats'),
  
  // 便捷通知接口
  sendAppointmentNotification: (data) => request.post('/notifications/appointment', data),
  sendCommentNotification: (data) => request.post('/notifications/comment', data),
  sendFavoriteNotification: (data) => request.post('/notifications/favorite', data),
  sendSystemNotification: (data) => request.post('/notifications/system', data),
  sendReviewNotification: (data) => request.post('/notifications/review', data),
  sendLikeNotification: (data) => request.post('/notifications/like', data),
};

export default {
  userApi,
  caseApi,
  designerApi,
  articleApi,
  appointmentApi,
  adminApi,
  designerDashboardApi,
  commentApi,
  favoriteApi,
  reviewApi,
  notificationApi,
};
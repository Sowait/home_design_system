import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { data } = response;
    
    // 如果后端返回的data中有统一的数据结构，可以在这里处理
    if (data && data.code !== undefined) {
      if (data.code === 200) {
        return data.data;
      } else {
        throw new Error(data.message || '请求失败');
      }
    }
    
    return data;
  },
  (error) => {
    // 处理401未授权错误
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    
    // 处理其他错误
    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

// 认证相关API
export const authAPI = {
  // 用户登录
  login: (credentials) => api.post('/auth/login', credentials),
  
  // 用户注册
  register: (userData) => api.post('/auth/register', userData),
  
  // 获取当前用户信息
  getCurrentUser: () => api.get('/auth/me'),
  
  // 退出登录
  logout: () => api.post('/auth/logout'),
  
  // 修改密码
  changePassword: (passwords) => api.put('/auth/password', passwords),
};

// 设计案例相关API
export const caseAPI = {
  // 获取案例列表
  getList: (params) => api.get('/cases', { params }),
  
  // 获取案例详情
  getCaseById: (id) => api.get(`/cases/${id}`),
  
  // 案例点赞
  likeCase: (id) => api.post(`/cases/${id}/like`),
  
  // 案例收藏
  favorite: (id) => api.post(`/cases/${id}/favorite`),
};

// 设计师相关API
export const designerAPI = {
  // 获取设计师列表
  getList: (params) => api.get('/designers', { params }),
  
  // 获取设计师详情
  getDetail: (id) => api.get(`/designers/${id}`),
  
  // 设计师点赞
  like: (id) => api.post(`/designers/${id}/like`),
};

// 文章相关API
export const articleAPI = {
  // 获取文章列表
  getList: (params) => api.get('/articles', { params }),
  
  // 获取文章详情
  getDetail: (id) => api.get(`/articles/${id}`),
  
  // 文章点赞
  like: (id) => api.post(`/articles/${id}/like`),
};

// 预约相关API
export const appointmentAPI = {
  // 创建预约
  create: (data) => api.post('/appointments', data),
  
  // 获取我的预约列表
  getMyList: (params) => api.get('/appointments/my', { params }),
  
  // 取消预约
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

// 评论相关API
export const commentAPI = {
  // 获取评论列表
  getList: (params) => api.get('/comments', { params }),
  
  // 获取案例评论
  getCaseComments: (caseId, params = {}) => api.get(`/comments/case/${caseId}`, { params }),
  
  // 添加评论
  add: (data) => api.post('/comments/create', data),
  
  // 删除评论
  delete: (id) => api.delete(`/comments/${id}/delete`),
  
  // 评论点赞
  like: (id) => api.post(`/comments/${id}/like`),
};

// 收藏相关API
export const favoriteAPI = {
  // 添加收藏
  addFavorite: (targetType, targetId) => {
    return api.post('/favorites/add', {
      targetType: targetType,
      targetId: targetId
    });
  },
  
  // 取消收藏
  removeFavorite: (id) => api.delete(`/favorites/${id}`),
  
  // 获取我的收藏列表
  getMyFavorites: (params) => api.get('/favorites', { params }),
  
  // 检查是否已收藏
  checkFavorite: (targetType, targetId) => {
    return api.get('/favorites/check', {
      params: {
        targetType: targetType,
        targetId: targetId
      }
    });
  },
  
  // 获取收藏的案例
  getFavoriteCases: (params) => api.get('/favorites/cases', { params }),
  
  // 获取收藏的设计师
  getFavoriteDesigners: (params) => api.get('/favorites/designers', { params }),
  
  // 获取收藏的文章
  getFavoriteArticles: (params) => api.get('/favorites/articles', { params }),
};

// 管理员相关API
export const adminAPI = {
  // 获取用户列表
  getUserList: (params) => api.get('/admin/users', { params }),
  
  // 获取案例管理列表
  getCaseList: (params) => api.get('/admin/cases', { params }),
  
  // 审核案例
  reviewCase: (id, status) => api.put(`/admin/cases/${id}/review`, { status }),
  
  // 获取文章管理列表
  getArticleList: (params) => api.get('/admin/articles', { params }),
  
  // 审核文章
  reviewArticle: (id, status) => api.put(`/admin/articles/${id}/review`, { status }),
  
  // 获取预约管理列表
  getAppointmentList: (params) => api.get('/admin/appointments', { params }),
  
  // 处理预约
  handleAppointment: (id, status) => api.put(`/admin/appointments/${id}/handle`, { status }),
};

// 设计师相关API
export const designerDashboardAPI = {
  // 获取设计师统计信息
  getStats: () => api.get('/designer/dashboard/stats'),
  
  // 获取我的案例列表
  getMyCases: (params) => api.get('/designer/dashboard/cases', { params }),
  
  // 创建案例
  createCase: (data) => api.post('/designer/dashboard/cases', data),
  
  // 更新案例
  updateCase: (id, data) => api.put(`/designer/dashboard/cases/${id}`, data),
  
  // 删除案例
  deleteCase: (id) => api.delete(`/designer/dashboard/cases/${id}`),
  
  // 发布案例
  publishCase: (id) => api.put(`/designer/dashboard/cases/${id}/publish`),
  
  // 获取我的预约列表
  getMyAppointments: (params) => api.get('/designer/dashboard/appointments', { params }),
  // 处理预约
  handleAppointment: (id, status) => api.put(`/designer/dashboard/appointments/${id}/handle`, null, { params: { status } }),
  
  // 获取我的文章列表
  getMyArticles: (params) => api.get('/articles/my', params),
  
  // 创建文章
  createArticle: (data) => api.post('/articles', data),
  
  // 更新文章
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  
  // 删除文章
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  
  // 发布文章
  publishArticle: (id) => api.put(`/designer/dashboard/articles/${id}/publish`),
  
  // 获取我的案例评论
  getMyCaseComments: (params) => api.get('/comments/designer/cases', params),
  
  // 回复评论
  replyComment: (id, content) => api.put(`/comments/${id}/reply`, { content }),
  
  // 删除评论
  deleteComment: (id) => api.delete(`/comments/${id}`),
  
  // 获取设计师个人信息
  getProfile: () => api.get('/designers/profile'),
  
  // 更新设计师个人信息
  updateProfile: (data) => api.put('/designers/profile', data),
  
  // 更新头像
  updateAvatar: (avatarUrl) => api.put('/designers/avatar', { avatarUrl }),
};

// 用户相关API
export const userAPI = {
  // 获取用户统计信息
  getStats: () => api.get('/user/stats'),
  
  // 获取我的收藏列表
  getMyFavorites: (params) => api.get('/user/favorites', { params }),
  
  // 获取我的评论列表
  getMyComments: (params) => api.get('/user/comments', { params }),
  
  // 更新用户信息
  updateProfile: (data) => api.put('/user/profile', data),
  
  // 更新头像
  updateAvatar: (avatarUrl) => api.put('/user/avatar', null, {
    params: {
      avatarUrl: avatarUrl
    }
  }),
  
  // 添加收藏
  addFavorite: (targetType, targetId) => api.post('/user/favorite', {
    targetType: targetType,
    targetId: targetId
  }),
  
  // 取消收藏
  removeFavorite: (id) => api.delete(`/user/favorite/${id}`),
};

export default api;
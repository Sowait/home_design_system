import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userInfoStr = localStorage.getItem('userInfo');
  
  // 检查是否登录
  if (!token || !userInfoStr) {
    // 避免从登录页重定向到登录页
    if (location.pathname !== '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  try {
    const userInfo = JSON.parse(userInfoStr);
    
    // 检查用户角色权限
    if (roles.length > 0 && !roles.includes(userInfo.role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  } catch (error) {
    // 如果解析用户信息失败，清除无效数据并重定向到登录页
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    if (location.pathname !== '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }
};

export default ProtectedRoute;
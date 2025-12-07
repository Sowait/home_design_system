import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DesignCases from './pages/DesignCases/DesignCases';
import CaseDetail from './pages/DesignCases/CaseDetail';
import Designers from './pages/Designers/Designers';
import DesignerDetail from './pages/Designers/DesignerDetail';
import DesignerCaseDetail from './pages/Designer/DesignerCaseDetail';
import Articles from './pages/Articles/Articles';
import ArticleDetail from './pages/Articles/ArticleDetail';
import Appointment from './pages/Appointment/Appointment';
import UserProfile from './pages/User/UserProfile';
import Comments from './pages/Comments/MyComments';
import Favorites from './pages/User/Favorites';
import MyAppointments from './pages/Appointment/MyAppointments_fixed';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import CaseManagement from './pages/Admin/CaseManagement';
import DesignerDashboard from './pages/Designer/DesignerDashboard';
import DesignerCaseManagement from './pages/Designer/CaseManagement';
import DesignerArticleManagement from './pages/Designer/ArticleManagement';
import DesignerAppointmentManagement from './pages/Designer/AppointmentManagement';
import DesignerProfileManagement from './pages/Designer/ProfileManagement';
import DesignerCommentManagement from './pages/Designer/CommentManagement';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 独立的登录和注册页面 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 需要主布局的页面，受登录保护 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="cases" element={<DesignCases />} />
          <Route path="cases/:id" element={<CaseDetail />} />
          <Route path="designers" element={<Designers />} />
          <Route path="designers/:id" element={<DesignerDetail />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:id" element={<ArticleDetail />} />
          
          {/* 需要登录的子路由 */}
          <Route path="appointment" element={<Appointment />} />
          <Route path="my-appointments" element={<MyAppointments />} />
          <Route path="comments" element={<Comments />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<UserProfile />} />
          
          {/* 设计师路由 */}
          <Route path="designer-dashboard" element={<DesignerDashboard />} />
          <Route path="designer/cases" element={<DesignerCaseManagement />} />
          <Route path="designer/cases/:id" element={<DesignerCaseDetail />} />
          <Route path="designer/appointments" element={<DesignerAppointmentManagement />} />
          <Route path="designer/articles" element={<DesignerArticleManagement />} />
          <Route path="designer/comments" element={<DesignerCommentManagement />} />
          <Route path="designer/profile" element={<DesignerProfileManagement />} />
          
          {/* 管理员路由 */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/cases" element={<CaseManagement />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
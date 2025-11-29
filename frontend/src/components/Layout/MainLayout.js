import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, message } from 'antd';
import {
  HomeOutlined,
  FileSearchOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  UserAddOutlined,
  SettingOutlined,
  BellOutlined,
  FormOutlined,
  StarOutlined
} from '@ant-design/icons';
import { authAPI } from '../../utils/api';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查用户登录状态
    const token = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (token && storedUserInfo) {
      // 先从localStorage获取用户信息，避免延迟
      try {
        const user = JSON.parse(storedUserInfo);
        setUserInfo(user);
        
        // 设计师登录后自动跳转到设计师控制台
        if (user.role === 'DESIGNER' && location.pathname === '/') {
          setTimeout(() => navigate('/designer-dashboard'), 100);
        }
      } catch (error) {
        console.error('解析localStorage用户信息失败:', error);
        // 清除无效数据
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }
      // 然后从服务器获取最新用户信息
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      setUserInfo(user);
      localStorage.setItem('userInfo', JSON.stringify(user));
    } catch (error) {
      console.error('获取用户信息失败:', error);
      // 如果API调用失败，尝试从localStorage获取用户信息
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const user = JSON.parse(storedUserInfo);
          setUserInfo(user);
        } catch (parseError) {
          console.error('解析用户信息失败:', parseError);
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
        }
      } else {
        localStorage.removeItem('token');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      setUserInfo(null);
      message.success('退出登录成功');
      navigate('/');
    } catch (error) {
      console.error('退出登录失败:', error);
      // 即使接口失败，也清除本地数据
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      setUserInfo(null);
      navigate('/');
    }
  };

  const getMenuItems = () => {
    if (!userInfo) {
      return [
        {
          key: '/',
          icon: <HomeOutlined />,
          label: '首页',
        },
        {
          key: '/cases',
          icon: <FileSearchOutlined />,
          label: '设计案例',
        },
        {
          key: '/designers',
          icon: <TeamOutlined />,
          label: '设计师',
        },
        {
          key: '/articles',
          icon: <BookOutlined />,
          label: '装修文章',
        },
      ];
    }

    if (userInfo.role === 'DESIGNER') {
      return [
        {
          key: '/designer-dashboard',
          icon: <SettingOutlined />,
          label: '设计师控制台',
        },
        {
          key: '/designer/cases',
          icon: <FileSearchOutlined />,
          label: '案例管理',
        },
        {
          key: '/designer/appointments',
          icon: <CalendarOutlined />,
          label: '预约管理',
        },
        {
          key: '/designer/articles',
          icon: <BookOutlined />,
          label: '文章管理',
        },
        {
          key: '/designer/comments',
          icon: <FormOutlined />,
          label: '评论管理',
        },
        {
          key: '/designer/profile',
          icon: <UserOutlined />,
          label: '工作室信息',
        },
      ];
    }

    // 普通用户和管理员
    return [
      {
        key: '/',
        icon: <HomeOutlined />,
        label: '首页',
      },
      {
        key: '/cases',
        icon: <FileSearchOutlined />,
        label: '设计案例',
      },
      {
        key: '/designers',
        icon: <TeamOutlined />,
        label: '设计师',
      },
      {
        key: '/articles',
        icon: <BookOutlined />,
        label: '装修文章',
      },
      {
        key: '/appointments',
        icon: <CalendarOutlined />,
        label: '我的预约',
      },
      {
        key: '/favorites',
        icon: <StarOutlined />,
        label: '我的收藏',
      },
      {
        key: '/comments',
        icon: <FormOutlined />,
        label: '我的评论',
      },
    ];
  };

  const menuItems = getMenuItems();

  const userMenuItems = userInfo ? [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'dashboard',
      icon: <SettingOutlined />,
      label: '控制台',
      onClick: () => {
        if (userInfo.role === 'ADMIN') {
          navigate('/admin');
        } else if (userInfo.role === 'DESIGNER') {
          navigate('/designer-dashboard');
        }
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ] : [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: '登录',
      onClick: () => navigate('/login'),
    },
    {
      key: 'register',
      icon: <UserAddOutlined />,
      label: '注册',
      onClick: () => navigate('/register'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          padding: 0,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h1 style={{ margin: 0, fontSize: '20px', color: '#1890ff' }}>
            家装设计网站
          </h1>
        </div>
        
        <div style={{ marginRight: '24px' }}>
          {userInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Badge count={0} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{ fontSize: '18px' }}
                />
              </Badge>
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'background-color 0.3s'
                }}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Avatar
                    size="small"
                    src={userInfo.avatar}
                    icon={<UserOutlined />}
                    style={{ marginRight: '8px' }}
                  />
                  <span>{userInfo.username}</span>
                </div>
              </Dropdown>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="text"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
              >
                登录
              </Button>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => navigate('/register')}
              >
                注册
              </Button>
            </div>
          )}
        </div>
      </Header>
      
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ height: '100%', borderRight: 0 }}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              borderRadius: '8px',
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
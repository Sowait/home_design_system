import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import { 
  UserOutlined, 
  FileSearchOutlined
} from '@ant-design/icons';
import { adminApi } from '../../api';

// 兼容命名
const adminAPI = adminApi;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    userCount: 0,
    designerCount: 0,
    adminCount: 0,
    todayUsers: 0,
    totalCases: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
      message.error('获取统计数据失败');
      // 使用默认值作为后备
      setStats({
        totalUsers: 0,
        userCount: 0,
        designerCount: 0,
        adminCount: 0,
        todayUsers: 0,
        totalCases: 0
      });
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>管理员控制台</h1>
      </div>

      {/* 统计数据 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="普通用户"
              value={stats.userCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设计师"
              value={stats.designerCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={stats.todayUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="管理员数量"
              value={stats.adminCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="设计案例"
              value={stats.totalCases || 0}
              prefix={<FileSearchOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <h3>欢迎使用管理员控制台</h3>
          <p>请使用左侧导航菜单访问具体功能模块</p>
          <p>用户管理和案例管理功能已移至导航栏</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
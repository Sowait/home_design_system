import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Tag, Tabs, message, Space } from 'antd';
import { 
  UserOutlined, 
  FileSearchOutlined, 
  BookOutlined, 
  CalendarOutlined,
  EyeOutlined,
  StarOutlined
} from '@ant-design/icons';
import { adminApi } from '../../api';

// 兼容命名
const adminAPI = adminApi;

const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCases: 0,
    totalArticles: 0,
    totalAppointments: 0
  });
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [articles, setArticles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取统计数据
      setStats({
        totalUsers: 1234,
        totalCases: 567,
        totalArticles: 89,
        totalAppointments: 234
      });

      // 获取统计数据
      const statsResponse = await adminAPI.getDashboardStats();
      setStats(statsResponse.data || {
        totalUsers: 0,
        totalCases: 0,
        totalArticles: 0,
        totalAppointments: 0
      });

      // 获取用户列表
      const usersResponse = await adminAPI.getUserList({ page: 1, size: 10 });
      setUsers(usersResponse.data?.records || []);

      // 获取案例管理列表
      const casesResponse = await adminAPI.getCaseList({ page: 1, size: 10 });
      setCases(casesResponse.data?.records || []);

      // 获取文章管理列表
      const articlesResponse = await adminAPI.getArticleList({ page: 1, size: 10 });
      setArticles(articlesResponse.data?.records || []);

      // 获取预约管理列表
      const appointmentsResponse = await adminAPI.getAppointmentList({ page: 1, size: 10 });
      setAppointments(appointmentsResponse.data?.records || []);
    } catch (error) {
      message.error('获取数据失败');
      // 使用模拟数据
      setUsers([
        {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          createTime: '2024-01-15'
        }
      ]);
      
      setCases([
        {
          id: 1,
          title: '现代简约三居室',
          designerName: '张设计师',
          status: 'PENDING',
          createTime: '2024-01-15'
        }
      ]);
      
      setArticles([
        {
          id: 1,
          title: '装修要点解析',
          authorName: '装修小助手',
          status: 'PUBLISHED',
          createTime: '2024-01-15'
        }
      ]);
      
      setAppointments([
        {
          id: 1,
          userName: 'testuser',
          designerName: '张设计师',
          appointmentTime: '2024-01-20',
          status: 'PENDING'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewCase = async (caseId, status) => {
    try {
      await adminAPI.reviewCase(caseId, status);
      message.success('审核操作成功');
      fetchDashboardData();
    } catch (error) {
      message.error('审核操作失败');
    }
  };

  const handleReviewArticle = async (articleId, status) => {
    try {
      await adminAPI.reviewArticle(articleId, status);
      message.success('审核操作成功');
      fetchDashboardData();
    } catch (error) {
      message.error('审核操作失败');
    }
  };

  const handleHandleAppointment = async (appointmentId, status) => {
    try {
      await adminAPI.handleAppointment(appointmentId, status);
      message.success('操作成功');
      fetchDashboardData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 用户管理处理函数
  const handleViewUser = (user) => {
    message.info(`查看用户详情: ${user.username}`);
    // TODO: 实现用户详情弹窗
  };

  const handleEditUser = (user) => {
    message.info(`编辑用户: ${user.username}`);
    // TODO: 实现用户编辑弹窗
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      message.success('用户删除成功');
      fetchDashboardData();
    } catch (error) {
      message.error('用户删除失败');
    }
  };

  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => {
        const roleMap = {
          'USER': { color: 'blue', text: '普通用户' },
          'DESIGNER': { color: 'green', text: '设计师' },
          'ADMIN': { color: 'red', text: '管理员' }
        };
        const roleInfo = roleMap[role] || { color: 'default', text: role };
        return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
      }
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => handleViewUser(record)}>
            查看详情
          </Button>
          <Button type="link" size="small" onClick={() => handleEditUser(record)}>
            编辑
          </Button>
          <Button 
            danger 
            type="link" 
            size="small" 
            onClick={() => handleDeleteUser(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const caseColumns = [
    {
      title: '案例标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '设计师',
      dataIndex: 'designerName',
      key: 'designerName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusMap = {
          'PENDING': { color: 'orange', text: '待审核' },
          'APPROVED': { color: 'green', text: '已通过' },
          'REJECTED': { color: 'red', text: '已拒绝' }
        };
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="primary" 
                size="small"
                onClick={() => handleReviewCase(record.id, 'APPROVED')}
              >
                通过
              </Button>
              <Button 
                danger 
                size="small"
                onClick={() => handleReviewCase(record.id, 'REJECTED')}
              >
                拒绝
              </Button>
            </>
          )}
          <Button type="link" size="small">
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const articleColumns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusMap = {
          'PENDING': { color: 'orange', text: '待审核' },
          'PUBLISHED': { color: 'green', text: '已发布' },
          'DRAFT': { color: 'blue', text: '草稿' }
        };
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="primary" 
                size="small"
                onClick={() => handleReviewArticle(record.id, 'PUBLISHED')}
              >
                发布
              </Button>
              <Button 
                danger 
                size="small"
                onClick={() => handleReviewArticle(record.id, 'REJECTED')}
              >
                拒绝
              </Button>
            </>
          )}
          <Button type="link" size="small">
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const appointmentColumns = [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '设计师',
      dataIndex: 'designerName',
      key: 'designerName',
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusMap = {
          'PENDING': { color: 'orange', text: '待确认' },
          'CONFIRMED': { color: 'green', text: '已确认' },
          'COMPLETED': { color: 'blue', text: '已完成' },
          'CANCELLED': { color: 'red', text: '已取消' }
        };
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="primary" 
                size="small"
                onClick={() => handleHandleAppointment(record.id, 'CONFIRMED')}
              >
                确认
              </Button>
              <Button 
                danger 
                size="small"
                onClick={() => handleHandleAppointment(record.id, 'CANCELLED')}
              >
                取消
              </Button>
            </>
          )}
          <Button type="link" size="small">
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>管理员控制台</h2>
      
      {/* 统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="设计案例"
              value={stats.totalCases}
              prefix={<FileSearchOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="文章数量"
              value={stats.totalArticles}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="预约数量"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 管理内容 */}
      <Card>
        <Tabs defaultActiveKey="userManagement">
          <TabPane tab="用户信息管理" key="userManagement">
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              title={() => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>用户信息管理</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>管理普通用户和设计师信息（查看、编辑、删除）</span>
                </div>
              )}
            />
          </TabPane>
          
          <TabPane tab="内容审核管理" key="contentReview">
            <Tabs
              defaultActiveKey="caseReview"
              items={[
                {
                  key: 'caseReview',
                  label: '设计案例审核',
                  children: (
                    <Table
                      columns={caseColumns}
                      dataSource={cases}
                      rowKey="id"
                      loading={loading}
                      pagination={{
                        pageSize: 10,
                        showTotal: (total) => `共 ${total} 条记录`,
                      }}
                      title={() => (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>设计案例审核</span>
                          <span style={{ fontSize: '12px', color: '#666' }}>审核设计师发布的设计案例</span>
                        </div>
                      )}
                    />
                  ),
                },
                {
                  key: 'articleReview',
                  label: '文章内容审核',
                  children: (
                    <Table
                      columns={articleColumns}
                      dataSource={articles}
                      rowKey="id"
                      loading={loading}
                      pagination={{
                        pageSize: 10,
                        showTotal: (total) => `共 ${total} 条记录`,
                      }}
                      title={() => (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>文章内容审核</span>
                          <span style={{ fontSize: '12px', color: '#666' }}>审核装修资讯文章内容</span>
                        </div>
                      )}
                    />
                  ),
                },
              ]}
            />
          </TabPane>
          
          <TabPane tab="违规内容管理" key="violationManagement">
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <h3>违规内容管理</h3>
              <p>管理违规内容和用户举报</p>
              <p>此功能模块正在开发中...</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminDashboard;

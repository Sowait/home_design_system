import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../utils/api';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values);
      
      // 保存token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      
      message.success('登录成功');
      
      // 根据用户角色跳转到对应页面
      const userRole = response.user.role;
      let targetPath = '/'; // 默认首页
      
      switch (userRole) {
        case 'ADMIN':
          targetPath = '/admin';
          break;
        case 'DESIGNER':
          targetPath = '/designer-dashboard';
          break;
        case 'USER':
        default:
          targetPath = '/'; // 普通用户跳转到首页
          break;
      }
      
      // 重定向到角色对应的页面
      navigate(targetPath, { replace: true });
    } catch (error) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWechatLogin = () => {
    message.info('微信登录功能开发中...');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            家装设计网站
          </Title>
          <Text type="secondary">
            欢迎回来，请登录您的账户
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="用户名/邮箱"
            rules={[
              { required: true, message: '请输入用户名或邮箱' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名或邮箱"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            >
              登录
            </Button>
          </Form.Item>

          <Divider>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              其他登录方式
            </Text>
          </Divider>

          <Form.Item>
            <Button
              icon={<WechatOutlined />}
              onClick={handleWechatLogin}
              block
              style={{
                height: '48px',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#52c41a',
                borderColor: '#52c41a'
              }}
            >
              微信登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Space split={<Divider type="vertical" />}>
            <Text type="secondary">
              还没有账户？
            </Text>
            <Link to="/register">
              <Text type="primary" strong>
                立即注册
              </Text>
            </Link>
          </Space>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            登录即表示您同意我们的
            <Link to="/terms" style={{ margin: '0 4px' }}>
              服务条款
            </Link>
            和
            <Link to="/privacy" style={{ marginLeft: '4px' }}>
              隐私政策
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider, Space, Select, Radio } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, WechatOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await authAPI.register({
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role || 'USER'
      });
      
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      message.error(error.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWechatRegister = () => {
    message.info('微信注册功能开发中...');
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
          maxWidth: '450px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            家装设计网站
          </Title>
          <Text type="secondary">
            创建您的账户，开启装修之旅
          </Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          initialValues={{
            role: 'USER'
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' },
              { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: false, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入手机号（选填）"
              autoComplete="tel"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为6-20个字符' },
              { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码必须包含字母和数字' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="用户类型"
            rules={[{ required: true, message: '请选择用户类型' }]}
          >
            <Radio.Group>
              <Radio value="USER">普通用户</Radio>
              <Radio value="DESIGNER">设计师</Radio>
            </Radio.Group>
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
              注册
            </Button>
          </Form.Item>

          <Divider>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              其他注册方式
            </Text>
          </Divider>

          <Form.Item>
            <Button
              icon={<WechatOutlined />}
              onClick={handleWechatRegister}
              block
              style={{
                height: '48px',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#52c41a',
                borderColor: '#52c41a'
              }}
            >
              微信注册
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Space split={<Divider type="vertical" />}>
            <Text type="secondary">
              已有账户？
            </Text>
            <Link to="/login">
              <Text type="primary" strong>
                立即登录
              </Text>
            </Link>
          </Space>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            注册即表示您同意我们的
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

export default Register;
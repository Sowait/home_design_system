import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Form, Input, Button, message, Modal, Tag } from 'antd';
import { UserOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import { userAPI, appointmentAPI } from '../../utils/api';
import { authAPI } from '../../utils/api';

const { TextArea } = Input;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      setUserInfo(user);
      form.setFieldsValue(user);
    } catch (error) {
      message.error('获取用户信息失败');
      // 使用模拟数据
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800138000',
        avatar: '',
        nickname: '装修爱好者',
        bio: '热爱家装设计，正在准备装修自己的小窝'
      };
      setUserInfo(mockUser);
      form.setFieldsValue(mockUser);
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      await userAPI.updateProfile(values);
      await fetchUserInfo();
      setEditMode(false);
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = async () => {
    if (!avatarUrl.trim()) {
      message.error('请输入头像URL地址');
      return;
    }
    
    setAvatarLoading(true);
    try {
      await userAPI.updateAvatar(avatarUrl);
      await fetchUserInfo();
      setAvatarModalVisible(false);
      setAvatarUrl('');
      message.success('头像更新成功');
    } catch (error) {
      message.error('头像更新失败');
    } finally {
      setAvatarLoading(false);
    }
  };

  const openAvatarModal = () => {
    setAvatarModalVisible(true);
    setAvatarUrl(userInfo.avatar || '');
  };

  const getStatusTag = (status) => {
    const statusMap = {
      'PENDING': { color: 'orange', text: '待确认' },
      'CONFIRMED': { color: 'green', text: '已确认' },
      'COMPLETED': { color: 'blue', text: '已完成' },
      'CANCELLED': { color: 'red', text: '已取消' }
    };
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  if (!userInfo) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <Card>
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar
                size={120}
                src={userInfo.avatar}
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <Button icon={<LinkOutlined />} size="small" onClick={openAvatarModal}>
                更换头像
              </Button>

              <Modal
                title="更新头像"
                visible={avatarModalVisible}
                onOk={handleAvatarUpdate}
                onCancel={() => {
                  setAvatarModalVisible(false);
                  setAvatarUrl('');
                }}
                confirmLoading={avatarLoading}
              >
                <Form layout="vertical">
                  <Form.Item label="头像URL地址" required>
                    <Input
                      placeholder="请输入头像图片的URL地址"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      prefix={<LinkOutlined />}
                    />
                  </Form.Item>
                  {avatarUrl && (
                    <Form.Item label="预览">
                      <Avatar
                        size={80}
                        src={avatarUrl}
                        icon={<UserOutlined />}
                        style={{ display: 'block', margin: '0 auto' }}
                      />
                    </Form.Item>
                  )}
                </Form>
              </Modal>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>个人信息</h3>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? '取消编辑' : '编辑资料'}
              </Button>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="username"
                    label="用户名"
                  >
                    <Input disabled={!editMode} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="nickname"
                    label="昵称"
                  >
                    <Input disabled={!editMode} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="邮箱"
                  >
                    <Input disabled={!editMode} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="手机号"
                  >
                    <Input disabled={!editMode} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="bio"
                    label="个人简介"
                  >
                    <TextArea
                      rows={3}
                      disabled={!editMode}
                      placeholder="介绍一下自己..."
                    />
                  </Form.Item>
                </Col>
              </Row>

              {editMode && (
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    保存修改
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserProfile;
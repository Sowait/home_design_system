import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Avatar, Divider, Descriptions, Space } from 'antd';
import { UserOutlined, UploadOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { designerDashboardAPI } from '../../utils/api';

const { TextArea } = Input;

const ProfileManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    realName: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    experience: '',
    specialties: '',
    serviceArea: '',
    priceRange: '',
    designStyle: '',
    achievements: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await designerDashboardAPI.getProfile();
      if (response) {
        setProfile(response);
        form.setFieldsValue(response);
      } else {
        // 如果API返回空，使用默认模拟数据
        const mockProfile = {
          username: 'designer001',
          realName: '张设计师',
          email: 'designer@example.com',
          phone: '13800138000',
          avatar: null,
          bio: '专注于现代简约和北欧风格设计，拥有8年室内设计经验，致力于为客户打造舒适、实用的居住空间。',
          experience: '8年',
          specialties: '现代简约、北欧风格、小户型设计',
          serviceArea: '北京市、天津市、河北省',
          priceRange: '300-800元/平方米',
          designStyle: '现代简约、北欧风格、日式风格',
          achievements: '2023年度最佳室内设计师奖、2022年亚太设计大赛银奖'
        };
        setProfile(mockProfile);
        form.setFieldsValue(mockProfile);
      }
    } catch (error) {
      console.error('获取个人信息失败:', error);
      message.error('获取个人信息失败');
      // API失败时使用模拟数据
      const mockProfile = {
        username: 'designer001',
        realName: '张设计师',
        email: 'designer@example.com',
        phone: '13800138000',
        avatar: null,
        bio: '专注于现代简约和北欧风格设计，拥有8年室内设计经验，致力于为客户打造舒适、实用的居住空间。',
        experience: '8年',
        specialties: '现代简约、北欧风格、小户型设计',
        serviceArea: '北京市、天津市、河北省',
        priceRange: '300-800元/平方米',
        designStyle: '现代简约、北欧风格、日式风格',
        achievements: '2023年度最佳室内设计师奖、2022年亚太设计大赛银奖'
      };
      setProfile(mockProfile);
      form.setFieldsValue(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    form.setFieldsValue(profile);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await designerDashboardAPI.updateProfile(values);
      setProfile(values);
      setEditing(false);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        // TODO: 更新头像URL
        message.success('头像上传成功');
      }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="工作室信息" loading={loading}>
        {!editing ? (
          // 查看模式
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={120} 
                src={profile.avatar} 
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <h2>{profile.realName || profile.username}</h2>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                编辑信息
              </Button>
            </div>

            <Divider />

            <Descriptions column={1} bordered>
              <Descriptions.Item label="用户名">{profile.username}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{profile.realName}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{profile.email}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{profile.phone}</Descriptions.Item>
              <Descriptions.Item label="从业经验">{profile.experience}</Descriptions.Item>
              <Descriptions.Item label="擅长领域">{profile.specialties}</Descriptions.Item>
              <Descriptions.Item label="服务区域">{profile.serviceArea}</Descriptions.Item>
              <Descriptions.Item label="价格区间">{profile.priceRange}</Descriptions.Item>
              <Descriptions.Item label="设计风格">{profile.designStyle}</Descriptions.Item>
              <Descriptions.Item label="个人简介">{profile.bio}</Descriptions.Item>
              <Descriptions.Item label="获奖经历">{profile.achievements}</Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          // 编辑模式
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={120} 
                src={profile.avatar} 
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <div>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>更换头像</Button>
                </Upload>
              </div>
            </div>

            <Divider />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <Form.Item
                name="realName"
                label="真实姓名"
                rules={[{ required: true, message: '请输入真实姓名' }]}
              >
                <Input placeholder="请输入真实姓名" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>

              <Form.Item
                name="experience"
                label="从业经验"
                rules={[{ required: true, message: '请输入从业经验' }]}
              >
                <Input placeholder="如：8年" />
              </Form.Item>

              <Form.Item
                name="serviceArea"
                label="服务区域"
                rules={[{ required: true, message: '请输入服务区域' }]}
              >
                <Input placeholder="如：北京市、天津市" />
              </Form.Item>

              <Form.Item
                name="priceRange"
                label="价格区间"
                rules={[{ required: true, message: '请输入价格区间' }]}
              >
                <Input placeholder="如：300-800元/平方米" />
              </Form.Item>
            </div>

            <Form.Item
              name="specialties"
              label="擅长领域"
              rules={[{ required: true, message: '请输入擅长领域' }]}
            >
              <Input placeholder="如：现代简约、北欧风格" />
            </Form.Item>

            <Form.Item
              name="designStyle"
              label="设计风格"
              rules={[{ required: true, message: '请输入设计风格' }]}
            >
              <Input placeholder="如：现代简约、北欧风格、日式风格" />
            </Form.Item>

            <Form.Item
              name="bio"
              label="个人简介"
              rules={[{ required: true, message: '请输入个人简介' }]}
            >
              <TextArea rows={4} placeholder="请输入个人简介" />
            </Form.Item>

            <Form.Item
              name="achievements"
              label="获奖经历"
            >
              <TextArea rows={4} placeholder="请输入获奖经历（选填）" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  保存
                </Button>
                <Button onClick={handleCancel}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfileManagement;
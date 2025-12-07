import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, message, Modal, Form, Input, Select, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { adminApi } from '../../api';

// 兼容命名
const adminAPI = adminApi;

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingDesigner, setEditingDesigner] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUserList({ page: 1, size: 100 });
      setUsers(response.data?.records || []);
    } catch (error) {
      message.error('获取用户列表失败');
      // 使用模拟数据
      setUsers([
        {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          createTime: '2024-01-15'
        },
        {
          id: 2,
          username: 'designer1',
          email: 'designer@example.com',
          role: 'DESIGNER',
          createTime: '2024-01-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (user) => {
    setEditingUser(user);
    let formData = { ...user };
    
    // 如果是设计师，获取设计师详细信息
    if (user.role === 'DESIGNER') {
      try {
        const response = await adminAPI.getDesignerByUserId(user.id);
        const designerInfo = response.data;
        setEditingDesigner(designerInfo);
        
        // 合并设计师信息到表单数据
        formData = {
          ...formData,
          name: designerInfo.name,
          title: designerInfo.title,
          avatar: designerInfo.avatar,
          serviceArea: designerInfo.serviceArea,
          style: designerInfo.style,
          price: designerInfo.price,
          experience: designerInfo.experience,
          completedCases: designerInfo.completedCases,
          bio: designerInfo.bio,
          education: designerInfo.education,
          awards: designerInfo.awards,
          serviceScope: designerInfo.serviceScope,
        };
      } catch (error) {
        console.error('获取设计师信息失败:', error);
      }
    }
    
    form.setFieldsValue(formData);
    setEditModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      message.success('用户删除成功');
      fetchUsers();
    } catch (error) {
      message.error('用户删除失败');
    }
  };

  const handleSaveUser = async (values) => {
    try {
      if (editingUser) {
        // 更新用户基本信息
        await adminAPI.updateUser(editingUser.id, {
          email: values.email
        });
        
        // 如果是设计师，更新设计师信息
        if (editingUser.role === 'DESIGNER') {
          const designerData = {
            name: values.name,
            title: values.title,
            avatar: values.avatar,
            serviceArea: values.serviceArea,
            style: values.style,
            price: values.price,
            experience: values.experience,
            completedCases: values.completedCases,
            bio: values.bio,
            education: values.education,
            awards: values.awards,
            serviceScope: values.serviceScope,
          };
          
          await adminAPI.updateDesignerByUserId(editingUser.id, designerData);
        }
        
        message.success('用户更新成功');
      }
      setEditModalVisible(false);
      setEditingUser(null);
      setEditingDesigner(null);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('用户操作失败');
    }
  };

  const columns = [
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger type="link" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="用户管理" 
        extra={
          <span style={{ fontSize: '12px', color: '#666' }}>
            管理所有用户信息（编辑、删除）
          </span>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 用户编辑弹窗 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveUser}
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
          
          {/* 设计师专用字段 */}
          {editingUser?.role === 'DESIGNER' && (
            <>
              <Form.Item
                name="name"
                label="设计师姓名"
                rules={[{ required: true, message: '请输入设计师姓名' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="title"
                label="职称"
              >
                <Input placeholder="如：高级设计师、设计总监" />
              </Form.Item>
              
              <Form.Item
                name="avatar"
                label="头像URL"
              >
                <Input placeholder="设计师头像图片地址" />
              </Form.Item>
              
              <Form.Item
                name="serviceArea"
                label="服务区域"
              >
                <Input placeholder="如：北京、上海、深圳" />
              </Form.Item>
              
              <Form.Item
                name="style"
                label="设计风格"
              >
                <Input placeholder="如：现代简约、北欧风格" />
              </Form.Item>
              
              <Form.Item
                name="price"
                label="价格范围"
              >
                <Input placeholder="如：500-1000元/平米" />
              </Form.Item>
              
              <Form.Item
                name="experience"
                label="工作经验（年）"
              >
                <Input type="number" placeholder="设计经验年限" />
              </Form.Item>
              
              <Form.Item
                name="completedCases"
                label="完成案例数"
              >
                <Input type="number" placeholder="已完成的设计案例数量" />
              </Form.Item>
              
              <Form.Item
                name="bio"
                label="个人简介"
              >
                <Input.TextArea rows={3} placeholder="设计师个人介绍" />
              </Form.Item>
              
              <Form.Item
                name="education"
                label="教育背景"
              >
                <Input placeholder="如：清华大学美术学院" />
              </Form.Item>
              
              <Form.Item
                name="awards"
                label="获奖经历"
              >
                <Input.TextArea rows={2} placeholder="设计奖项和荣誉" />
              </Form.Item>
              
              <Form.Item
                name="serviceScope"
                label="服务范围"
              >
                <Input placeholder="如：住宅设计、商业空间" />
              </Form.Item>
            </>
          )}
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setEditingUser(null);
                setEditingDesigner(null);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
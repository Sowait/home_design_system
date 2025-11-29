import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tag, Popconfirm, Image, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined, MessageOutlined, HeartOutlined, StarOutlined, CalendarOutlined } from '@ant-design/icons';
import { designerDashboardAPI, commentAPI, favoriteAPI, caseAPI } from '../../utils/api';
import CaseImage from '../../components/CaseImage';

const { Option } = Select;
const { TextArea } = Input;

// 预定义的设计风格选项
const designStyles = [
  '现代简约',
  '北欧风格',
  '新中式',
  '欧式古典',
  '美式乡村',
  '日式风格',
  '工业风格',
  '地中海风格',
  '东南亚风格',
  '田园风格',
  '轻奢风格',
  '极简风格'
];

const CaseManagement = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await designerDashboardAPI.getMyCases({
        page: 1,
        size: 10
      });
      setCases(response.records || []);
    } catch (error) {
      console.error('获取案例列表失败:', error);
      message.error('获取案例列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCase(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCase(record);
    
    // 解析封面图片JSON字符串为逗号分隔的字符串
    const formData = { ...record };
    if (record.coverImage) {
      try {
        const images = JSON.parse(record.coverImage);
        formData.coverImages = images.join(','); // 转换为逗号分隔的字符串
      } catch (e) {
        // 如果解析失败，直接使用原字符串
        formData.coverImages = record.coverImage;
      }
    } else {
      formData.coverImages = '';
    }
    
    form.setFieldsValue(formData);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个案例吗？',
      onOk: async () => {
        try {
          await designerDashboardAPI.deleteCase(id);
          message.success('删除成功');
          fetchCases();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      console.log('原始表单值:', values);
      console.log('coverImages字段:', values.coverImages);
      
      // 处理图片字符串，转换为JSON数组
      const submitData = { ...values };
      
      // 移除coverImages字段，因为后端不认识这个字段
      delete submitData.coverImages;
      
      // 处理逗号分隔的图片URL
      if (values.coverImages && values.coverImages.trim()) {
        // 按逗号分割并过滤空值
        const imageUrls = values.coverImages
          .split(',')
          .map(url => url.trim())
          .filter(url => url.length > 0);
        
        console.log('分割后的图片URLs:', imageUrls);
        
        // 只有当有有效图片URL时才设置coverImage
        if (imageUrls.length > 0) {
          submitData.coverImage = JSON.stringify(imageUrls);
          console.log('设置的图片URLs:', imageUrls);
          console.log('转换后的JSON:', submitData.coverImage);
        } else {
          // 如果分割后没有有效URL，不设置coverImage字段
          delete submitData.coverImage;
          console.log('图片URL为空，删除coverImage字段');
        }
      } else {
        // 如果没有coverImages字符串，不设置coverImage字段
        delete submitData.coverImage;
        console.log('没有有效的coverImages字段，删除coverImage字段');
      }
      
      console.log('最终提交的数据:', submitData);
      
      if (editingCase) {
        await designerDashboardAPI.updateCase(editingCase.id, submitData);
        message.success('更新成功');
      } else {
        await designerDashboardAPI.createCase(submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchCases();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '案例图片',
      dataIndex: 'coverImage',
      render: (coverImage) => <CaseImage coverImage={coverImage} />
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '风格',
      dataIndex: 'style',
      key: 'style'
    },
    {
      title: '户型',
      dataIndex: 'layout',
      key: 'layout'
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      render: (area) => `${area}m²`
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views'
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      key: 'likes'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'APPROVED' ? 'green' : 'orange'}>
          {status === 'APPROVED' ? '已发布' : '草稿'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" wrap>
          <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/designer/cases/${record.id}`)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="案例管理" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            发布案例
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={cases}
          rowKey="id"
          loading={loading}
          pagination={{
            total: cases.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      <Modal
        title={editingCase ? '编辑案例' : '发布案例'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="案例标题"
            rules={[{ required: true, message: '请输入案例标题' }]}
          >
            <Input placeholder="请输入案例标题" />
          </Form.Item>

          <Form.Item
            name="style"
            label="设计风格"
            rules={[{ required: true, message: '请选择设计风格' }]}
          >
            <Select placeholder="请选择设计风格">
              {designStyles.map(style => (
                <Option key={style} value={style}>{style}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="layout"
            label="户型"
            rules={[{ required: true, message: '请输入户型' }]}
          >
            <Input placeholder="如：三居室、两居室等" />
          </Form.Item>

          <Form.Item
            name="area"
            label="面积"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <Input placeholder="请输入面积（平方米）" type="number" />
          </Form.Item>

          <Form.Item
            name="designConcept"
            label="设计理念"
          >
            <TextArea rows={4} placeholder="请输入设计理念" />
          </Form.Item>

          <Form.Item
            name="materials"
            label="材料清单"
          >
            <TextArea rows={4} placeholder="请输入材料清单" />
          </Form.Item>

          <Form.Item
            name="coverImages"
            label="封面图片"
            rules={[{ required: false, message: '请输入封面图片URL' }]}
            help="多个图片URL请用逗号分隔，如：https://example.com/1.jpg,https://example.com/2.jpg"
          >
            <TextArea 
              rows={3} 
              placeholder="请输入图片URL，多个图片用逗号分隔" 
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCase ? '更新' : '发布'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CaseManagement;

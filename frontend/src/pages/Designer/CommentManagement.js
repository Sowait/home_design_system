import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Input, Space, message, Avatar, Rate } from 'antd';
import { MessageOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { designerDashboardAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await designerDashboardAPI.getMyCaseComments({
        page: 1,
        size: 10
      });
      setComments(response.records || []);
    } catch (error) {
      console.error('获取评论列表失败:', error);
      message.error('获取评论列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      onOk: async () => {
        try {
          await designerDashboardAPI.deleteComment(id);
          message.success('删除成功');
          fetchComments();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const filteredComments = comments.filter(comment => 
    (comment.userName && comment.userName.toLowerCase().includes(searchText.toLowerCase())) ||
    (comment.content && comment.content.toLowerCase().includes(searchText.toLowerCase())) ||
    ((comment.caseTitle || comment.targetTitle) && (comment.caseTitle || comment.targetTitle).toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: '用户',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar size="small" src={record.userAvatar} icon={<MessageOutlined />} />
          <span>{record.userName}</span>
        </Space>
      )
    },
    {
      title: '案例',
      dataIndex: 'caseTitle',
      key: 'caseTitle',
      ellipsis: true,
      width: 200,
      render: (text, record) => record.caseTitle || record.targetTitle || '未知案例'
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 250
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />
    },
    {
      title: '回复状态',
      key: 'replyStatus',
      render: (_, record) => (
        <Tag color={record.replyContent ? 'green' : 'orange'}>
          {record.replyContent ? '已回复' : '待回复'}
        </Tag>
      )
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/designer/cases/${record.targetId}`)}
          >
            查看案例
          </Button>
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="评论管理">
        <div style={{ marginBottom: '16px' }}>
          <Input
            placeholder="搜索用户名、评论内容或案例标题"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredComments}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredComments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  );
};

export default CommentManagement;
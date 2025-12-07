import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, message, Popconfirm } from 'antd';
import { FileSearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminApi } from '../../api';

// 兼容命名
const adminAPI = adminApi;

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getCaseList({ page: 1, size: 100 });
      setCases(response.data?.records || []);
    } catch (error) {
      message.error('获取案例列表失败');
      // 使用模拟数据
      setCases([
        {
          id: 1,
          title: '现代简约三居室',
          designerName: '张设计师',
          status: 'APPROVED',
          createTime: '2024-01-15'
        },
        {
          id: 2,
          title: '北欧风格两居室',
          designerName: '李设计师',
          status: 'PENDING',
          createTime: '2024-01-14'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewCase = async (caseId, status) => {
    try {
      await adminAPI.reviewCase(caseId, status);
      message.success('案例审核成功');
      fetchCases();
    } catch (error) {
      message.error('案例审核失败');
    }
  };

  const handleDeleteCase = async (caseId) => {
    try {
      await adminAPI.deleteCase(caseId);
      message.success('案例删除成功');
      fetchCases();
    } catch (error) {
      message.error('案例删除失败');
    }
  };

  const columns = [
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
          <Button type="link" icon={<EyeOutlined />}>
            查看详情
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                onClick={() => handleReviewCase(record.id, 'APPROVED')}
              >
                通过
              </Button>
              <Button 
                danger 
                type="link" 
                onClick={() => handleReviewCase(record.id, 'REJECTED')}
              >
                拒绝
              </Button>
            </>
          )}
          <Popconfirm
            title="确定要删除这个案例吗？"
            onConfirm={() => handleDeleteCase(record.id)}
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
        title="案例管理" 
        extra={
          <span style={{ fontSize: '12px', color: '#666' }}>
            管理设计案例（审核、删除）
          </span>
        }
      >
        <Table
          columns={columns}
          dataSource={cases}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default CaseManagement;
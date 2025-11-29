import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message, Space, Descriptions } from 'antd';
import { CalendarOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { designerDashboardAPI } from '../../utils/api';

const { Option } = Select;
const { TextArea } = Input;

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await designerDashboardAPI.getMyAppointments({
        page: 1,
        size: 10
      });
      setAppointments(response.records || []);
    } catch (error) {
      console.error('获取预约列表失败:', error);
      message.error('获取预约列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedAppointment(record);
    setDetailModalVisible(true);
  };
  const handleAccept = async (id) => {
    Modal.confirm({
      title: '确认接受预约',
      content: '确定要接受这个预约请求吗？',
      onOk: async () => {
        try {
          await designerDashboardAPI.handleAppointment(id, 'ACCEPTED');
          message.success('预约已接受');
          setDetailModalVisible(false); // 关闭详情弹窗
          fetchAppointments(); // 刷新列表
        } catch (error) {
          message.error('操作失败');
        }
      }
    });
  };

  const handleReject = (id) => {
    Modal.confirm({
      title: '拒绝预约',
      content: (
        <div>
          <p>确定要拒绝这个预约请求吗？</p>
          <TextArea 
            placeholder="请输入拒绝原因（选填）" 
            id="rejectReason"
            rows={3}
          />
        </div>
      ),
      onOk: async () => {
        const rejectReason = document.getElementById('rejectReason')?.value;
        try {
          await designerDashboardAPI.handleAppointment(id, 'REJECTED');
          message.success('预约已拒绝');
          setDetailModalVisible(false); // 关闭详情弹窗
          fetchAppointments(); // 刷新列表
        } catch (error) {
          message.error('操作失败');
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return '待处理';
      case 'ACCEPTED':
        return '已接受';
      case 'REJECTED':
        return '已拒绝';
      default:
        return '未知';
    }
  };

  const columns = [
    {
      title: '用户姓名',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '联系电话',
      dataIndex: 'contact',
      key: 'contact'
    },
    {
      title: '需求描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 300
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '预约时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" wrap>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />} 
                onClick={() => handleAccept(record.id)}
                style={{ color: '#52c41a' }}
              >
                接受
              </Button>
              <Button 
                type="link" 
                danger
                icon={<CloseOutlined />} 
                onClick={() => handleReject(record.id)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="预约管理">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{
            total: appointments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 预约详情弹窗 */}
      <Modal
        title="预约详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          selectedAppointment?.status === 'PENDING' && (
            <Button key="accept" type="primary" icon={<CheckOutlined />} onClick={() => handleAccept(selectedAppointment.id)}>
              接受预约
            </Button>
          ),
          selectedAppointment?.status === 'PENDING' && (
            <Button key="reject" danger icon={<CloseOutlined />} onClick={() => handleReject(selectedAppointment.id)}>
              拒绝预约
            </Button>
          ),
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedAppointment && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户姓名">{selectedAppointment.userName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{selectedAppointment.contact}</Descriptions.Item>
            <Descriptions.Item label="需求描述">{selectedAppointment.description}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getStatusColor(selectedAppointment.status)}>
                {getStatusText(selectedAppointment.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="预约时间">{selectedAppointment.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{selectedAppointment.updateTime}</Descriptions.Item>
            {selectedAppointment.rejectReason && (
              <Descriptions.Item label="拒绝原因">{selectedAppointment.rejectReason}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentManagement;
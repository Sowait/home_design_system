import React, { useState, useEffect } from 'react';
import { Card, List, Tag, message, Empty, Spin, Avatar, Button, Drawer, Descriptions, Typography } from 'antd';
import { CalendarOutlined, UserOutlined, EyeOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';
import { appointmentAPI } from '../../utils/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentAPI.getMyList();
      console.log('预约API返回:', response);
      setAppointments(response.data?.records || response.records || []);
    } catch (error) {
      message.error('获取预约列表失败');
      // 使用模拟数据
      setAppointments([
        {
          id: 1,
          designerName: '张设计师',
          designerId: 1,
          userName: '张三',
          phone: '13800138000',
          style: '现代简约',
          floorPlan: '三室',
          appointmentTime: '2024-01-20T14:00:00',
          status: 'CONFIRMED',
          address: '北京市朝阳区某某小区',
          description: '需要现代简约风格装修，客厅要宽敞明亮',
          budget: '20万元',
          area: 120,
          createTime: '2024-01-15T10:00:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      'PENDING': { color: 'orange', text: '待确认' },
      'ACCEPTED': { color: 'green', text: '已接受' },
      'CONFIRMED': { color: 'green', text: '已确认' },
      'COMPLETED': { color: 'blue', text: '已完成' },
      'CANCELLED': { color: 'red', text: '已取消' },
      'REJECTED': { color: 'gray', text: '已拒绝' }
    };
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const showAppointmentDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedAppointment(null);
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    return dayjs(dateTimeStr).format('YYYY-MM-DD HH:mm');
  };

  return (
    <div>
      <Card title="我的预约">
        <Spin spinning={loading}>
          {appointments.length > 0 ? (
            <List
              dataSource={appointments}
              renderItem={appointment => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => showAppointmentDetail(appointment)}
                    >
                      查看详情
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`预约 ${appointment.designerName}`}
                    description={
                      <div>
                        <div><strong>装修风格：</strong>{appointment.style}</div>
                        <div><strong>预约时间：</strong>{formatDateTime(appointment.appointmentTime)}</div>
                        <div><strong>装修地址：</strong>{appointment.address}</div>
                        <div style={{ marginTop: '8px' }}>
                          {getStatusTag(appointment.status)}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无预约记录" />
          )}
        </Spin>
      </Card>

      {/* 预约详情抽屉 */}
      <Drawer
        title="预约详情"
        placement="right"
        width={600}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {selectedAppointment && (
          <div>
            <Title level={4}>基本信息</Title>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="预约编号">{selectedAppointment.id}</Descriptions.Item>
              <Descriptions.Item label="预约人">{selectedAppointment.userName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedAppointment.phone}</Descriptions.Item>
              <Descriptions.Item label="设计师">{selectedAppointment.designerName}</Descriptions.Item>
              <Descriptions.Item label="预约状态">
                {getStatusTag(selectedAppointment.status)}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: '24px' }}>项目信息</Title>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="装修风格">{selectedAppointment.style}</Descriptions.Item>
              <Descriptions.Item label="房屋户型">{selectedAppointment.floorPlan}</Descriptions.Item>
              <Descriptions.Item label="房屋面积">{selectedAppointment.area} m²</Descriptions.Item>
              <Descriptions.Item label="预算范围">{selectedAppointment.budget}</Descriptions.Item>
              <Descriptions.Item label="装修地址">{selectedAppointment.address}</Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: '24px' }}>详细需求</Title>
            <Card size="small">
              <Text>{selectedAppointment.description}</Text>
            </Card>

            <Title level={4} style={{ marginTop: '24px' }}>时间信息</Title>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="预约时间">
                {formatDateTime(selectedAppointment.appointmentTime)}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDateTime(selectedAppointment.createTime)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default MyAppointments;
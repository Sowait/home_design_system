import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Avatar, Tag, Rate, Button, Tabs, List, Space, Typography } from 'antd';
import { UserOutlined, StarOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const DesignerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [designer, setDesigner] = useState(null);

  useEffect(() => {
    // 模拟获取设计师详情
    setDesigner({
      id: id,
      name: '张设计师',
      title: '高级设计师',
      avatar: '',
      style: '现代简约',
      serviceArea: '全市',
      price: '200-500元/平米',
      experience: 8,
      completedCases: 156,
      likes: 892,
      rating: 4.8,
      phone: '13800138000',
      email: 'designer@example.com',
      bio: '专注于现代简约风格设计，擅长空间规划和色彩搭配。有丰富的家装设计经验，致力于为客户创造舒适美观的居住环境。',
      education: '中央美术学院 室内设计专业 本科',
      awards: ['2023年度最佳设计师', '2022室内设计大赛金奖'],
      cases: [
        {
          id: 1,
          title: '现代简约三居室',
          style: '现代简约',
          area: 120,
          coverImage: 'https://via.placeholder.com/200x150?text=案例1'
        },
        {
          id: 2,
          title: '北欧风格两居室',
          style: '北欧',
          area: 85,
          coverImage: 'https://via.placeholder.com/200x150?text=案例2'
        }
      ]
    });
  }, [id]);

  if (!designer) {
    return <div>加载中...</div>;
  }

  const handleAppointmentClick = () => {
    // 跳转到预约页面，并预选当前设计师
    navigate('/appointment', { 
      state: { 
        designerId: designer.id,
        designerName: designer.name 
      } 
    });
  };

  return (
    <div>
      <Card>
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar
                size={120}
                src={designer.avatar}
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <Title level={3}>{designer.name}</Title>
              <Tag color="blue" style={{ marginBottom: '8px' }}>
                {designer.title}
              </Tag>
              <div style={{ marginBottom: '16px' }}>
                <Rate disabled defaultValue={designer.rating} />
                <span style={{ marginLeft: '8px' }}>{designer.rating}分</span>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" block onClick={handleAppointmentClick}>
                  立即预约
                </Button>
                <Button block>
                  <StarOutlined /> 关注设计师
                </Button>
              </Space>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <Tabs defaultActiveKey="info">
              <TabPane tab="基本信息" key="info">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <div><strong>从业经验：</strong>{designer.experience}年</div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div><strong>设计风格：</strong>{designer.style}</div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div><strong>服务区域：</strong>{designer.serviceArea}</div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div><strong>设计费用：</strong>{designer.price}</div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div><strong>完成案例：</strong>{designer.completedCases}套</div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div><strong>获得点赞：</strong>{designer.likes}个</div>
                  </Col>
                  <Col xs={24}>
                    <div><strong>联系方式：</strong></div>
                    <div><PhoneOutlined /> {designer.phone}</div>
                    <div><MailOutlined /> {designer.email}</div>
                  </Col>
                </Row>

                <div style={{ marginTop: '24px' }}>
                  <Title level={4}>个人简介</Title>
                  <Paragraph>{designer.bio}</Paragraph>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Title level={4}>教育背景</Title>
                  <Paragraph>{designer.education}</Paragraph>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Title level={4}>获奖经历</Title>
                  <List
                    dataSource={designer.awards}
                    renderItem={award => (
                      <List.Item>
                        <StarOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                        {award}
                      </List.Item>
                    )}
                  />
                </div>
              </TabPane>

              <TabPane tab="设计案例" key="cases">
                <Row gutter={[16, 16]}>
                  {designer.cases.map(caseItem => (
                    <Col xs={24} sm={12} md={8} key={caseItem.id}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={caseItem.title}
                            src={caseItem.coverImage}
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                        }
                      >
                        <Card.Meta
                          title={caseItem.title}
                          description={
                            <Space>
                              <Tag color="blue">{caseItem.style}</Tag>
                              <span>{caseItem.area}m²</span>
                            </Space>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DesignerDetail;
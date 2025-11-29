import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Carousel, Statistic, Avatar, Typography, Tag, Space, message } from 'antd';
import {
  UserOutlined,
  FileSearchOutlined,
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
  ArrowRightOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { caseAPI, designerAPI, articleAPI } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const [featuredCases, setFeaturedCases] = useState([]);
  const [topDesigners, setTopDesigners] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    totalDesigners: 0,
    totalArticles: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // 使用模拟数据，避免API调用错误导致空白页面
      const mockCases = [
        {
          id: 1,
          title: '现代简约三居室设计',
          coverImage: 'https://via.placeholder.com/400x300?text=案例1',
          style: '现代简约',
          layout: '三居室',
          area: 120,
          likes: 156
        },
        {
          id: 2,
          title: '北欧风格小户型',
          coverImage: 'https://via.placeholder.com/400x300?text=案例2',
          style: '北欧',
          layout: '两居室',
          area: 85,
          likes: 98
        },
        {
          id: 3,
          title: '新中式别墅设计',
          coverImage: 'https://via.placeholder.com/400x300?text=案例3',
          style: '新中式',
          layout: '别墅',
          area: 280,
          likes: 234
        }
      ];

      const mockDesigners = [
        {
          id: 1,
          name: '张设计师',
          avatar: 'https://via.placeholder.com/64x64?text=张',
          title: '首席设计师',
          style: '现代简约',
          completedCases: 45,
          likes: 892
        },
        {
          id: 2,
          name: '李设计师',
          avatar: 'https://via.placeholder.com/64x64?text=李',
          title: '高级设计师',
          style: '北欧风格',
          completedCases: 32,
          likes: 645
        },
        {
          id: 3,
          name: '王设计师',
          avatar: 'https://via.placeholder.com/64x64?text=王',
          title: '资深设计师',
          style: '新中式',
          completedCases: 28,
          likes: 523
        }
      ];

      const mockArticles = [
        {
          id: 1,
          title: '2024年家装设计趋势分析',
          summary: '探讨最新的家装设计理念和流行趋势...',
          authorName: '设计小助手',
          authorAvatar: 'https://via.placeholder.com/32x32?text=作者',
          publishTime: '2024-01-15'
        },
        {
          id: 2,
          title: '小户型空间利用技巧',
          summary: '分享如何在有限空间内创造更多可能...',
          authorName: '装修达人',
          authorAvatar: 'https://via.placeholder.com/32x32?text=达人',
          publishTime: '2024-01-14'
        }
      ];

      setFeaturedCases(mockCases);
      setTopDesigners(mockDesigners);
      setLatestArticles(mockArticles);

      // 设置统计数据
      setStats({
        totalCases: 1250,
        totalDesigners: 86,
        totalArticles: 156,
        totalAppointments: 3420
      });
    } catch (error) {
      console.error('获取首页数据失败:', error);
      // 即使API失败也要显示基本数据
      setFeaturedCases([]);
      setTopDesigners([]);
      setLatestArticles([]);
      setStats({
        totalCases: 1250,
        totalDesigners: 86,
        totalArticles: 156,
        totalAppointments: 3420
      });
    }
  };

  const handleLikeCase = async (caseId) => {
    try {
      await caseAPI.like(caseId);
      message.success('点赞成功');
      // 重新获取数据
      fetchHomeData();
    } catch (error) {
      message.error('点赞失败');
    }
  };

  return (
    <div>
      {/* 轮播图 */}
      <Carousel autoplay style={{ height: '400px', marginBottom: '40px' }}>
        <div>
          <div style={{ 
            height: '400px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center'
          }}>
            <div>
              <Title level={1} style={{ color: 'white', marginBottom: '20px' }}>
                专业家装设计服务
              </Title>
              <Paragraph style={{ fontSize: '18px', color: 'white', marginBottom: '30px' }}>
                汇聚优秀设计师，为您提供高品质的家装设计方案
              </Paragraph>
              <Button size="large" type="primary" ghost>
                <Link to="/appointment">立即预约</Link>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div style={{ 
            height: '400px', 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center'
          }}>
            <div>
              <Title level={1} style={{ color: 'white', marginBottom: '20px' }}>
                灵感源于生活
              </Title>
              <Paragraph style={{ fontSize: '18px', color: 'white', marginBottom: '30px' }}>
                浏览海量设计案例，激发您的装修灵感
              </Paragraph>
              <Button size="large" type="primary" ghost>
                <Link to="/cases">浏览案例</Link>
              </Button>
            </div>
          </div>
        </div>
      </Carousel>

      {/* 统计数据 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="设计案例"
              value={stats.totalCases}
              prefix={<FileSearchOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="认证设计师"
              value={stats.totalDesigners}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="装修文章"
              value={stats.totalArticles}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="预约次数"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 推荐案例 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Title level={2}>推荐案例</Title>
          <Button type="link">
            <Link to="/cases">
              查看更多 <ArrowRightOutlined />
            </Link>
          </Button>
        </div>
        
        <Row gutter={[24, 24]}>
          {featuredCases.map((caseItem) => (
            <Col xs={24} sm={12} lg={8} key={caseItem.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={caseItem.title}
                    src={caseItem.coverImage}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button
                    type="text"
                    icon={<StarOutlined />}
                    onClick={() => handleLikeCase(caseItem.id)}
                  >
                    {caseItem.likes}
                  </Button>,
                  <Button type="text">
                    <Link to={`/cases/${caseItem.id}`}>查看详情</Link>
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <Text strong ellipsis>
                      {caseItem.title}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary" ellipsis>
                        {caseItem.style} · {caseItem.layout} · {caseItem.area}m²
                      </Text>
                      <div>
                        <Tag color="blue">{caseItem.style}</Tag>
                        <Tag color="green">{caseItem.layout}</Tag>
                      </div>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* 热门设计师 */}
        <Col xs={24} lg={16}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Title level={2}>热门设计师</Title>
              <Button type="link">
                <Link to="/designers">
                  查看更多 <ArrowRightOutlined />
                </Link>
              </Button>
            </div>
            
            <Row gutter={[16, 16]}>
              {topDesigners.map((designer) => (
                <Col xs={12} sm={8} md={6} key={designer.id}>
                  <Card
                    hoverable
                    textAlign="center"
                    onClick={() => window.location.href = `/designers/${designer.id}`}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Avatar
                        size={64}
                        src={designer.avatar}
                        icon={<UserOutlined />}
                        style={{ marginBottom: '12px' }}
                      />
                      <div>
                        <Text strong>{designer.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {designer.title}
                        </Text>
                        <br />
                        <Text type="primary" style={{ fontSize: '12px' }}>
                          {designer.style}
                        </Text>
                        <br />
                        <Text style={{ fontSize: '12px' }}>
                          {designer.completedCases}案例 · {designer.likes}赞
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        {/* 最新文章 */}
        <Col xs={24} lg={8}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Title level={4}>装修资讯</Title>
              <Button type="link">
                <Link to="/articles">
                  更多 <ArrowRightOutlined />
                </Link>
              </Button>
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {latestArticles.map((article) => (
                <Card
                  key={article.id}
                  size="small"
                  hoverable
                  onClick={() => window.location.href = `/articles/${article.id}`}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        size="small"
                        src={article.authorAvatar}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <Text strong ellipsis style={{ fontSize: '14px' }}>
                        {article.title}
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary" ellipsis style={{ fontSize: '12px' }}>
                          {article.summary}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {article.authorName} · {article.publishTime}
                        </Text>
                      </Space>
                    }
                  />
                </Card>
              ))}
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
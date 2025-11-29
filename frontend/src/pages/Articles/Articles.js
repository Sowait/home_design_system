import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Button, Pagination, Avatar, Tag, Typography, Space } from 'antd';
import { SearchOutlined, CalendarOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons';
import { articleAPI } from '../../utils/api';

const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    size: 12,
    keyword: '',
    category: '',
    sortBy: 'createTime'
  });

  const categories = ['装修知识', '设计理念', '材料选择', '风水布局', '软装配饰', '施工工艺'];
  const sortOptions = [
    { value: 'createTime', label: '最新发布' },
    { value: 'views', label: '最多浏览' },
    { value: 'likes', label: '最受欢迎' }
  ];

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await articleAPI.getList(params);
      setArticles(response.records || []);
      setTotal(response.total || 0);
    } catch (error) {
      // 使用模拟数据
      setArticles([
        {
          id: 1,
          title: '现代简约风格装修要点解析',
          summary: '现代简约风格以简洁的线条和明快的色彩为主，注重功能性和实用性，是当前最受欢迎的装修风格之一。',
          category: '设计理念',
          coverImage: 'https://via.placeholder.com/300x200?text=现代简约',
          authorId: 1,
          authorName: '装修小助手',
          authorAvatar: '',
          publishTime: '2024-01-15',
          views: 1250,
          likes: 89,
          content: '现代简约风格强调"少即是多"的设计理念...'
        },
        {
          id: 2,
          title: '小户型装修空间利用技巧',
          summary: '小户型装修如何最大化利用空间？本文分享一些实用的空间利用技巧，让您的家更显宽敞明亮。',
          category: '装修知识',
          coverImage: 'https://via.placeholder.com/300x200?text=小户型装修',
          authorId: 2,
          authorName: '设计达人',
          authorAvatar: '',
          publishTime: '2024-01-12',
          views: 980,
          likes: 76,
          content: '小户型装修的关键在于合理规划空间布局...'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, keyword: value, page: 1 });
  };

  const handleCategoryChange = (value) => {
    setFilters({ ...filters, category: value, page: 1 });
  };

  const handleSortChange = (value) => {
    setFilters({ ...filters, sortBy: value, page: 1 });
  };

  const handlePageChange = (page, pageSize) => {
    setFilters({ ...filters, page, size: pageSize });
  };

  const handleLikeArticle = async (articleId) => {
    try {
      await articleAPI.like(articleId);
      fetchArticles();
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* 页面标题区域 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        padding: '24px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
          装修文章
        </Title>
        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '16px' }}>
          学习装修知识，了解设计理念，获取实用装修技巧
        </p>
      </div>

      {/* 搜索和筛选区域 */}
      <Card 
        style={{ 
          marginBottom: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Search
              placeholder="搜索文章标题、作者"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
          <Col xs={24} md={7}>
            <Select
              placeholder="文章分类"
              allowClear
              style={{ width: '100%' }}
              onChange={handleCategoryChange}
              size="large"
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={7}>
            <Select
              placeholder="排序方式"
              style={{ width: '100%' }}
              value={filters.sortBy}
              onChange={handleSortChange}
              size="large"
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Row gutter={[32, 32]}>
        {/* 主内容区域 - 文章列表 */}
        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            {articles.map(article => (
              <Col xs={24} key={article.id}>
                <Card
                  hoverable
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #f0f0f0'
                  }}
                  className="article-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => window.location.href = `/articles/${article.id}`}
                >
                  <Row gutter={20} align="middle">
                    <Col xs={24} sm={8}>
                      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                        <img
                          alt={article.title}
                          src={article.coverImage}
                          style={{ 
                            width: '100%', 
                            height: '180px', 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={16}>
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ marginBottom: '12px' }}>
                            <Tag color="blue" style={{ borderRadius: '4px' }}>{article.category}</Tag>
                          </div>
                          <Title 
                            level={4} 
                            ellipsis 
                            style={{ 
                              marginBottom: '12px',
                              lineHeight: '1.4',
                              fontWeight: 600
                            }}
                          >
                            {article.title}
                          </Title>
                          <Paragraph 
                            ellipsis={{ rows: 2 }} 
                            style={{ 
                              marginBottom: '16px', 
                              color: '#666',
                              lineHeight: '1.6'
                            }}
                          >
                            {article.summary}
                          </Paragraph>
                        </div>
                        <div>
                          <Space split={<span style={{ color: '#e8e8e8' }}>•</span>}>
                            <Space size={4}>
                              <Avatar
                                size="small"
                                src={article.authorAvatar}
                                style={{ backgroundColor: '#87d068' }}
                              >
                                {article.authorName.charAt(0)}
                              </Avatar>
                              <Text type="secondary" style={{ fontSize: '13px' }}>
                                {article.authorName}
                              </Text>
                            </Space>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                              <CalendarOutlined /> {article.publishTime}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                              <EyeOutlined /> {article.views}
                            </Text>
                            <Button
                              type="text"
                              size="small"
                              icon={<StarOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeArticle(article.id);
                              }}
                              style={{ 
                                fontSize: '13px', 
                                padding: '0 4px',
                                color: '#fa8c16'
                              }}
                            >
                              {article.likes}
                            </Button>
                          </Space>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 分页 */}
          {total > 0 && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Pagination
                current={filters.page}
                total={total}
                pageSize={filters.size}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                size="default"
              />
            </div>
          )}
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1890ff' }}>🔥</span>
                <span style={{ marginLeft: '8px' }}>热门分类</span>
              </div>
            }
            style={{ 
              marginBottom: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  type="text"
                  block
                  style={{ 
                    textAlign: 'left',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f6ffed';
                    e.currentTarget.style.color = '#52c41a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'inherit';
                  }}
                  onClick={() => setFilters({ ...filters, category, page: 1 })}
                >
                  <span style={{ marginRight: '8px' }}>{['📚', '🎨', '🏗️', '🏮', '🛋️', '🔧'][index]}</span>
                  {category}
                </Button>
              ))}
            </Space>
          </Card>

          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#fa8c16' }}>📈</span>
                <span style={{ marginLeft: '8px' }}>热门文章</span>
              </div>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {articles.slice(0, 5).map((article, index) => (
                <div
                  key={article.id}
                  style={{ 
                    cursor: 'pointer',
                    padding: '12px 0',
                    borderBottom: index < 4 ? '1px solid #f5f5f5' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                  onClick={() => window.location.href = `/articles/${article.id}`}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <Text 
                      ellipsis 
                      style={{ 
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '1.4'
                      }}
                    >
                      {index + 1}. {article.title}
                    </Text>
                  </div>
                  <Space size="large">
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <CalendarOutlined /> {article.publishTime}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <EyeOutlined /> {article.views}
                    </Text>
                  </Space>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {articles.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#999',
          backgroundColor: '#fafafa',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <Title level={4} type="secondary">暂无文章数据</Title>
          <Text type="secondary">请尝试调整筛选条件或稍后再试</Text>
        </div>
      )}
    </div>
  );
};

export default Articles;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Avatar, Tag, Button, Space, Typography, Divider, message } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined, StarOutlined, LikeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { articleAPI } from '../../utils/api';

const { Title, Paragraph, Text } = Typography;

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleDetail();
  }, [id]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      const response = await articleAPI.getDetail(id);
      setArticle(response);
    } catch (error) {
      message.error('获取文章详情失败');
      console.error('获取文章详情错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await articleAPI.like(id);
      message.success('点赞成功');
      // 重新获取文章详情以更新点赞数
      fetchArticleDetail();
    } catch (error) {
      message.error('点赞失败');
    }
  };

  const handleBack = () => {
    navigate('/articles');
  };

  if (loading || !article) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title>加载中...</Title>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          返回文章列表
        </Button>
      </div>
      
      <Card 
        style={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: 'none'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* 文章头部 */}
        <div style={{ 
          padding: '40px 40px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Title 
              level={1} 
              style={{ 
                color: 'white', 
                marginBottom: '20px',
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: '1.3'
              }}
            >
              {article.title}
            </Title>
            <Space size="large" split={<span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>}>
              <Space>
                <Avatar
                  size="small"
                  src={article.authorAvatar}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.9)' }}>{article.authorName}</span>
              </Space>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                <CalendarOutlined /> {article.publishTime}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                <EyeOutlined /> {article.views}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                <StarOutlined /> {article.likes}
              </span>
            </Space>
          </div>
        </div>

        {/* 封面图片 */}
        <div style={{ padding: '0 40px', marginTop: '-10px' }}>
          <img
            src={article.coverImage}
            alt={article.title}
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}
          />
        </div>

        {/* 文章内容区域 */}
        <Row gutter={[32, 0]} style={{ padding: '40px' }}>
          <Col xs={24} lg={16}>
            {/* 文章标签 */}
            <div style={{ marginBottom: '24px' }}>
              <Space wrap size={[8, 8]}>
                <Tag color="blue" style={{ borderRadius: '20px', padding: '4px 12px' }}>
                  {article.category}
                </Tag>
                {Array.isArray(article.tags) && article.tags.map(tag => (
                  <Tag key={tag} color="default" style={{ borderRadius: '20px', padding: '4px 12px' }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>

            {/* 文章正文 */}
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{ 
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#333',
                minHeight: '400px'
              }}
            />

            <Divider style={{ margin: '40px 0' }} />

            {/* 互动区域 */}
            <div style={{ 
              textAlign: 'center',
              padding: '20px 0',
              background: '#fafafa',
              borderRadius: '12px'
            }}>
              <Space size="large">
                <Button 
                  icon={<LikeOutlined />} 
                  onClick={handleLike}
                  type="primary"
                  size="large"
                  style={{ 
                    borderRadius: '8px',
                    height: '44px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }}
                >
                  点赞 ({article.likes})
                </Button>
                <Button 
                  icon={<StarOutlined />}
                  size="large"
                  style={{ 
                    borderRadius: '8px',
                    height: '44px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }}
                >
                  收藏
                </Button>
                <Button 
                  size="large"
                  style={{ 
                    borderRadius: '8px',
                    height: '44px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }}
                >
                  分享
                </Button>
              </Space>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            {/* 作者信息卡片 */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1890ff' }}>👤</span>
                  <span style={{ marginLeft: '8px' }}>作者信息</span>
                </div>
              }
              style={{ 
                marginBottom: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={80}
                  src={article.authorAvatar}
                  icon={<UserOutlined />}
                  style={{ 
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <div>
                  <Title level={5} style={{ margin: '8px 0', fontWeight: 600 }}>
                    {article.authorName}
                  </Title>
                  <Paragraph 
                    type="secondary" 
                    style={{ 
                      fontSize: '14px', 
                      marginBottom: '16px',
                      lineHeight: '1.5'
                    }}
                  >
                    {article.authorBio || '暂无作者简介'}
                  </Paragraph>
                  <Button type="primary" block style={{ borderRadius: '8px' }}>
                    关注作者
                  </Button>
                </div>
              </div>
            </Card>

            {/* 相关文章 */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#fa8c16' }}>📚</span>
                  <span style={{ marginLeft: '8px' }}>相关文章</span>
                </div>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {Array.isArray(article.relatedArticles) && article.relatedArticles.map(related => (
                  <div
                    key={related.id}
                    style={{ 
                      cursor: 'pointer',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                      e.currentTarget.style.borderColor = '#1890ff';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = '#f0f0f0';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    onClick={() => window.location.href = `/articles/${related.id}`}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <img
                        src={related.coverImage}
                        alt={related.title}
                        style={{ 
                          width: '80px', 
                          height: '60px', 
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          marginBottom: '8px'
                        }}>
                          {related.title}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {related.publishTime || '2024-01-01'}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
                {(!Array.isArray(article.relatedArticles) || article.relatedArticles.length === 0) && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#999', 
                    padding: '30px 20px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                    <div>暂无相关文章</div>
                  </div>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ArticleDetail;
import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Avatar, Tag, Button, Space, message, List } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { UserOutlined, EyeOutlined, ArrowLeftOutlined, CommentOutlined } from '@ant-design/icons';
import { caseAPI, commentAPI } from '../../utils/api';
import CaseImage from '../../components/CaseImage';

const { Title, Paragraph } = Typography;

const DesignerCaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getCaseComments(id);
      setComments(response.records || []);
    } catch (error) {
      console.error('获取评论列表失败:', error);
    }
  };

  useEffect(() => {
    fetchCaseDetail();
    fetchComments(); // 获取评论列表
  }, [id]);

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const response = await caseAPI.getCaseById(id);
      setCaseData(response);
    } catch (error) {
      message.error('获取案例详情失败');
      console.error('获取案例详情错误:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title>加载中...</Title>
      </div>
    );
  }

  // 解析images字段（可能是JSON字符串）
  const images = caseData.images ? 
    (typeof caseData.images === 'string' ? JSON.parse(caseData.images) : caseData.images) : [];
  
  // 解析coverImage字段，支持JSON数组和单个URL
  let coverImageUrl = null;
  if (caseData.coverImage) {
    try {
      const parsed = JSON.parse(caseData.coverImage);
      if (Array.isArray(parsed) && parsed.length > 0) {
        coverImageUrl = parsed[0]; // 取第一张作为封面
      }
    } catch (e) {
      // 如果解析失败，直接使用原字符串
      coverImageUrl = caseData.coverImage;
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        返回
      </Button>
      
      <Card>
        <Title level={2}>{caseData.title}</Title>
        
        <div style={{ marginBottom: '24px' }}>
          <Tag color="blue">{caseData.style}</Tag>
          <Tag color="green">{caseData.layout}</Tag>
          <Tag>{caseData.area}m²</Tag>
        </div>

        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={caseData.title}
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '24px'
            }}
            onError={(e) => {
              console.log('封面图片加载失败:', coverImageUrl);
            }}
          />
        )}

        {images.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            {images.map((image, index) => (
              <Col xs={24} sm={8} key={index}>
                <div style={{ width: '100%', height: '200px' }}>
                  <CaseImage coverImage={image} />
                </div>
              </Col>
            ))}
          </Row>
        )}

        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Card title="案例介绍" style={{ marginBottom: '24px' }}>
              <Paragraph>{caseData.designConcept || '暂无介绍'}</Paragraph>
            </Card>

            <Card title="材料清单">
              <Paragraph>{caseData.materials || '暂无材料信息'}</Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="案例信息" style={{ marginBottom: '24px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>设计师：</strong>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <Avatar
                      size="small"
                      src={caseData.designerAvatar}
                      icon={<UserOutlined />}
                      style={{ marginRight: '8px' }}
                    />
                    <span>{caseData.designerName}</span>
                  </div>
                </div>
                <div><strong>风格：</strong>{caseData.style || '未知'}</div>
                <div><strong>户型：</strong>{caseData.layout || '未知'}</div>
                <div><strong>面积：</strong>{caseData.area || 0}m²</div>
                <div><strong>材料：</strong>{caseData.materials || '未知'}</div>
                <div><strong>发布时间：</strong>{new Date(caseData.createTime).toLocaleDateString()}</div>
              </Space>
            </Card>

            <Card title="互动统计">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <EyeOutlined /> 浏览量：{caseData.views || 0}
                </div>
                <div>
                  <CommentOutlined /> 评论数：{comments.length}
                </div>
                <div style={{ 
                  padding: '8px', 
                  background: '#f0f8ff', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  color: '#666' 
                }}>
                  这是设计师视图，不能进行互动操作
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 评论区域 - 只显示评论列表，不提供发表评论功能 */}
      <Card title={<><CommentOutlined /> 评论 ({comments.length})</>} style={{ marginTop: '24px' }}>
        {/* 设计师视图提示 */}
        <div style={{ 
          marginBottom: '16px',
          padding: '8px', 
          background: '#f0f8ff', 
          borderRadius: '4px', 
          fontSize: '12px', 
          color: '#666' 
        }}>
          这是设计师视图，只能查看评论，不能发表评论
        </div>

        {/* 评论列表 */}
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={comment.avatar}
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{comment.username}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(comment.create_time).toLocaleString()}
                    </span>
                  </div>
                }
                description={comment.content}
              />
            </List.Item>
          )}
          locale={{ emptyText: '暂无评论' }}
        />
      </Card>
    </div>
  );
};

export default DesignerCaseDetail;

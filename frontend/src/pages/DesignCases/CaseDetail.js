import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Avatar, Tag, Button, Space, message, Input, List } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { UserOutlined, StarOutlined, EyeOutlined, ArrowLeftOutlined, HeartOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons';
import { caseAPI, userAPI, favoriteAPI, commentAPI } from '../../utils/api';
import UserCaseImage from '../../components/UserCaseImage';

const { Title, Paragraph } = Typography;

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getCaseComments(id);
      setComments(response.records || []);
    } catch (error) {
      console.error('获取评论列表失败:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const result = await favoriteAPI.checkFavorite('case', parseInt(id));
      setIsFavorited(result.isFavorited);
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userInfo = await userAPI.getCurrentUser();
      console.log('获取到的用户信息:', userInfo);
      setCurrentUser(userInfo);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  useEffect(() => {
    fetchCaseDetail();
    checkFavoriteStatus();
    fetchComments(); // 获取评论列表
    fetchCurrentUser(); // 获取当前用户信息
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

  const handleLike = async () => {
    try {
      await caseAPI.likeCase(id);
      message.success('点赞成功');
      // 重新获取案例详情以更新点赞数
      fetchCaseDetail();
    } catch (error) {
      message.error('点赞失败');
    }
  };

  const handleAppointment = () => {
    navigate('/appointment');
  };

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        // 取消收藏 - 需要先获取收藏记录的ID
        const favorites = await favoriteAPI.getMyFavorites({ targetType: 'case' });
        const currentFavorite = favorites.records.find(fav => 
          fav.targetId === parseInt(id) && fav.targetType === 'case'
        );
        
        if (currentFavorite) {
          await favoriteAPI.removeFavorite(currentFavorite.id);
          message.success('取消收藏成功');
          setIsFavorited(false);
        } else {
          message.error('收藏记录不存在');
        }
      } else {
        // 添加收藏 - 使用favoriteAPI的addFavorite方法
        await favoriteAPI.addFavorite('case', parseInt(id));
        message.success('收藏成功');
        setIsFavorited(true);
      }
    } catch (error) {
      message.error(isFavorited ? '取消收藏失败' : '收藏失败');
      console.error('收藏操作错误:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    try {
      setSubmittingComment(true);
      const commentData = {
        target_type: 'case',
        target_id: parseInt(id),
        content: commentInput.trim()
      };
      
      // 调用评论API
      const newComment = await commentAPI.add(commentData);
      
      setComments([newComment, ...comments]);
      setCommentInput('');
      message.success('评论发表成功');
    } catch (error) {
      message.error('评论发表失败');
      console.error('评论错误:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // 判断是否为设计师角色
  const isDesigner = currentUser && (currentUser.role === 'DESIGNER' || currentUser.role === 'designer');
  
  console.log('当前用户:', currentUser);
  console.log('用户角色:', currentUser?.role);
  console.log('是否为设计师:', isDesigner);

  if (loading || !caseData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title>加载中...</Title>
      </div>
    );
  }

  // 解析所有图片，包括封面图和其他图片
  let allImages = [];
  let coverImageUrl = null;
  
  // 处理封面图片
  if (caseData.coverImage) {
    try {
      console.log('原始coverImage:', caseData.coverImage);
      
      // 第一次解析，去除转义
      const firstParse = JSON.parse(caseData.coverImage);
      console.log('第一次解析结果:', firstParse);
      
      let imageUrls = [];
      
      if (typeof firstParse === 'string') {
        // 如果是字符串，需要再次解析
        imageUrls = JSON.parse(firstParse);
        console.log('第二次解析结果:', imageUrls);
      } else if (Array.isArray(firstParse)) {
        // 如果已经是数组，直接使用
        imageUrls = firstParse;
      }
      
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        allImages = allImages.concat(imageUrls);
        coverImageUrl = imageUrls[0];
        console.log('封面图片解析成功:', imageUrls);
      }
    } catch (e) {
      console.log('封面图片解析失败:', e);
      // 尝试另一种解析方法
      try {
        const imageUrls = JSON.parse(caseData.coverImage.replace(/\\"/g, '"'));
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          allImages = allImages.concat(imageUrls);
          coverImageUrl = imageUrls[0];
          console.log('封面图片备用解析成功:', imageUrls);
        }
      } catch (e2) {
        console.log('封面图片备用解析也失败:', e2);
        // 最后作为单个URL处理
        allImages = [caseData.coverImage];
        coverImageUrl = caseData.coverImage;
      }
    }
  }
  
  // 处理其他图片
  // if (caseData.images) {
  //   try {
  //     const imagesData = typeof caseData.images === 'string' ? JSON.parse(caseData.images) : caseData.images;
  //     if (Array.isArray(imagesData) && imagesData.length > 0) {
  //       allImages = allImages.concat(imagesData);
  //       console.log('其他图片解析成功:', imagesData);
  //     }
  //   } catch (e) {
  //     console.log('其他图片解析失败:', e);
  //   }
  // }
  
  // 去重
  allImages = [...new Set(allImages)];
  console.log('最终所有图片:', allImages);

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

        {/* 显示所有图片，包括封面图和其他图片 */}
        {allImages.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            {allImages.map((image, index) => (
              <Col xs={24} sm={8} key={index}>
                <div style={{ width: '100%', height: '200px' }}>
                  <UserCaseImage coverImage={image} />
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
                  <StarOutlined /> 点赞数：{caseData.likes || 0}
                </div>
                
                {/* 只有非设计师用户才能进行互动操作 */}
                {!isDesigner && (
                  <>
                    <Button 
                      type="primary" 
                      block 
                      onClick={handleLike}
                      style={{ marginBottom: '8px' }}
                    >
                      点赞
                    </Button>
                    <Button 
                      type={isFavorited ? 'default' : 'primary'} 
                      block 
                      onClick={handleFavorite}
                      icon={isFavorited ? null : <HeartOutlined />}
                      style={{ marginBottom: '8px' }}
                    >
                      {isFavorited ? '已收藏' : '收藏'}
                    </Button>
                    <Button 
                      type="default" 
                      block 
                      onClick={handleAppointment}
                    >
                      立即预约
                    </Button>
                  </>
                )}
                
                {/* 设计师看到提示信息 */}
                {isDesigner && (
                  <div style={{ 
                    padding: '8px', 
                    background: '#f0f8ff', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    color: '#666' 
                  }}>
                    您是设计师，不能进行点赞、收藏、预约操作
                  </div>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 评论区域 */}
      <Card title={<><CommentOutlined /> 评论 ({comments.length})</>} style={{ marginTop: '24px' }}>
        {/* 只有非设计师用户才能发表评论 */}
        {!isDesigner && (
          <div style={{ marginBottom: '16px' }}>
            <Input.TextArea
              rows={3}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="发表你的评论..."
              style={{ marginBottom: '8px' }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleCommentSubmit}
              loading={submittingComment}
            >
              发表评论
            </Button>
          </div>
        )}

        {/* 设计师看到提示信息 */}
        {isDesigner && (
          <div style={{ 
            marginBottom: '16px',
            padding: '8px', 
            background: '#f0f8ff', 
            borderRadius: '4px', 
            fontSize: '12px', 
            color: '#666' 
          }}>
            您是设计师，不能发表评论
          </div>
        )}

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
          locale={{ emptyText: '暂无评论，快来发表第一条评论吧！' }}
        />
      </Card>
    </div>
  );
};

export default CaseDetail;
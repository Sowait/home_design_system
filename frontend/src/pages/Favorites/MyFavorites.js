import React, { useState, useEffect } from 'react';
import { Card, List, Empty, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../utils/api';

const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getMyFavorites();
      console.log('收藏数据:', response); // 调试日志
      setFavorites(response.records || []);
    } catch (error) {
      message.error('获取收藏列表失败');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    console.log('点击的收藏项:', item); // 调试日志
    
    // 使用后端实际返回的字段名
    const targetType = item.type;
    const targetId = item.targetId;
    
    console.log('targetType:', targetType, 'targetId:', targetId); // 调试日志
    
    if (targetType === 'case') {
      navigate(`/cases/${targetId}`);
    } else if (targetType === 'designer') {
      navigate(`/designers/${targetId}`);
    } else if (targetType === 'article') {
      navigate(`/articles/${targetId}`);
    } else {
      message.warning(`未知的收藏类型: ${targetType}`);
    }
  };

  return (
    <div>
      <Card title="我的收藏">
        <Spin spinning={loading}>
          {favorites.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={favorites}
              renderItem={item => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => handleItemClick(item)}
                    style={{ cursor: 'pointer' }}
                    cover={
                      <img
                        alt={item.title}
                        src={item.coverImage}
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      title={item.title}
                      description={
                        item.type === 'case' ? '设计案例' : 
                        item.type === 'designer' ? '设计师' : 
                        item.type === 'article' ? '文章' : '未知类型'
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无收藏内容" />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default MyFavorites;
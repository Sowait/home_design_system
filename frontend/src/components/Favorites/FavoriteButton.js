import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { favoriteApi } from '../../api';
import './FavoriteButton.css';

const FavoriteButton = ({ targetType, targetId, size = 'middle' }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // 检查是否已收藏
  const checkFavoriteStatus = async () => {
    try {
      const params = { targetType, targetId };
      const response = await favoriteApi.checkFavorite(params);
      if (response.data.code === 200) {
        setIsFavorited(response.data.data.isFavorited);
      }
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  useEffect(() => {
    if (targetType && targetId) {
      checkFavoriteStatus();
    }
  }, [targetType, targetId]);

  // 切换收藏状态
  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorited) {
        // 取消收藏 - 这里需要实际的收藏ID，暂时使用targetId
        // 注意：实际应该获取收藏记录的ID，这里简化处理
        await favoriteApi.removeFavorite(targetId);
        message.success('已取消收藏');
      } else {
        // 添加收藏
        const data = { targetType, targetId };
        await favoriteApi.addFavorite(data);
        message.success('收藏成功');
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      message.error(isFavorited ? '取消收藏失败' : '收藏失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
      type={isFavorited ? 'primary' : 'default'}
      icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
      size={size}
      loading={loading}
      onClick={toggleFavorite}
    >
      {isFavorited ? '已收藏' : '收藏'}
    </Button>
  );
};

export default FavoriteButton;
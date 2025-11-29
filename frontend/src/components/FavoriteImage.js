import React from 'react';

const FavoriteImage = ({ coverImage, title, type, getIcon }) => {
  let imageUrl = coverImage;

  // 处理双重转义的JSON字符串
  if (coverImage && typeof coverImage === 'string' && coverImage.startsWith('[')) {
    try {
      // 第一次解析，去除转义
      const firstParse = JSON.parse(coverImage);
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
        imageUrl = imageUrls[0]; // 取第一张作为封面
        console.log('最终图片URL:', imageUrl);
      }
    } catch (e) {
      console.log('JSON解析失败:', e);
      imageUrl = coverImage;
    }
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '48px', 
      height: '48px',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onError={() => {
          console.log('收藏图片加载失败:', imageUrl);
        }}
      />
      <div style={{
        position: 'absolute',
        top: '2px',
        right: '2px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {getIcon()}
      </div>
    </div>
  );
};

export default FavoriteImage;
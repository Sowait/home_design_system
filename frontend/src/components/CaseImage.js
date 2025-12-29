import React, { useState } from 'react';

const CaseImage = ({ coverImage, style = { width: '100%', height: '200px' } }) => {
  const [imageError, setImageError] = useState(false);

  if (!coverImage) {
    return <div style={{ width: '100%', height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>暂无图片</div>;
  }
  
  // 如果是JSON字符串，解析取第一张图片
  let imageUrl = coverImage;
  try {
    const images = JSON.parse(coverImage);
    if (Array.isArray(images) && images.length > 0) {
      imageUrl = images[0];
    }
  } catch (e) {
    // 如果解析失败，直接使用原字符串
    imageUrl = coverImage;
  }
  
  const handleImageError = () => {
    console.log('图片加载失败:', imageUrl);
    setImageError(true);
  };
  
  if (imageError) {
    return <div style={{ width: '100%', height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>加载失败</div>;
  }
  
  return (
      <img 
        src={imageUrl} 
        alt="案例图片"
        style={{ 
          width: '100%', 
          height: '200px', 
          objectFit: 'cover',
          ...style
        }}
        onError={handleImageError}
      />
  );
};

export default CaseImage;
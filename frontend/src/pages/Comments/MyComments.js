import React, { useState, useEffect } from 'react';
import { Card, List, Empty, Spin, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { userAPI } from '../../utils/api';

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

 const fetchComments = async () => {
  setLoading(true);
  try {
    const response = await userAPI.getMyComments({ page: 1, size: 100 });
    console.log('评论API返回:', response);
    // 修改这里：
    setComments(response.records || []);
  } catch (error) {
    message.error('获取评论列表失败');
    // 保留模拟数据作为备用
    setComments([
      {
        id: 1,
        targetType: 'case',
        targetTitle: '现代简约三居室装修案例',
        content: '这个设计很不错，很喜欢这个风格',
        createTime: '2024-01-15'
      }
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <Card title="我的评论">
        <Spin spinning={loading}>
          {comments.length > 0 ? (
            <List
              dataSource={comments}
              renderItem={comment => (
                <List.Item>
                  <List.Item.Meta
                    title={`评论: ${comment.targetTitle}`}
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>{comment.content}</div>
                        <div style={{ color: '#999', fontSize: '12px' }}>
                          {comment.createTime}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无评论记录" />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default MyComments;
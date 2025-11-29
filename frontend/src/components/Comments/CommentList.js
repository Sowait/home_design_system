import React, { useState, useEffect } from 'react';
import { List, Comment, Tooltip, message, Button, Input, Avatar, Space, Divider, Popconfirm } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { commentApi } from '../../api';
import moment from 'moment';
import './CommentList.css';

const { TextArea } = Input;

const CommentItem = ({ 
  comment, 
  onReply, 
  onLike, 
  onDelete, 
  onUpdate,
  currentUserId,
  showReplies = true 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) {
      message.warning('回复内容不能为空');
      return;
    }

    setLoading(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
      message.success('回复成功');
    } catch (error) {
      message.error('回复失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      await onLike(comment.id);
      setIsLiked(!isLiked);
      comment.likes += isLiked ? -1 : 1;
      message.success(isLiked ? '取消点赞' : '点赞成功');
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(comment.id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      message.warning('评论内容不能为空');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(comment.id, editContent);
      setIsEditing(false);
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    <Tooltip key="like" title="点赞">
      <span onClick={handleLike} style={{ cursor: 'pointer' }}>
        {isLiked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
        <span style={{ paddingLeft: 8 }}>{comment.likes || 0}</span>
      </span>
    </Tooltip>,
    <Tooltip key="reply" title="回复">
      <span onClick={() => setIsReplying(!isReplying)} style={{ cursor: 'pointer' }}>
        <MessageOutlined />
        <span style={{ paddingLeft: 8 }}>回复</span>
      </span>
    </Tooltip>
  ];

  // 只有评论作者才能编辑和删除
  if (currentUserId === comment.userId) {
    actions.push(
      <Tooltip key="edit" title="编辑">
        <span onClick={() => {
          setIsEditing(!isEditing);
          if (!isEditing) {
            setEditContent(comment.content);
          }
        }} style={{ cursor: 'pointer' }}>
          <EditOutlined />
        </span>
      </Tooltip>,
      <Popconfirm
        key="delete"
        title="确定要删除这条评论吗？"
        onConfirm={handleDelete}
        okText="确定"
        cancelText="取消"
      >
        <Tooltip title="删除">
          <span style={{ cursor: 'pointer' }}>
            <DeleteOutlined />
          </span>
        </Tooltip>
      </Popconfirm>
    );
  }

  return (
    <div className="comment-item">
      <Comment
        actions={actions}
        author={comment.username}
        avatar={
          <Avatar 
            src={comment.avatar} 
            alt={comment.username}
            icon={!comment.avatar && <MessageOutlined />}
          />
        }
        content={
          <div>
            {isEditing ? (
              <div className="edit-comment">
                <TextArea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  placeholder="编辑评论..."
                />
                <div className="edit-actions">
                  <Space>
                    <Button 
                      type="primary" 
                      size="small" 
                      onClick={handleUpdate}
                      loading={loading}
                    >
                      保存
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => setIsEditing(false)}
                    >
                      取消
                    </Button>
                  </Space>
                </div>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
            
            {comment.replyTo && (
              <div className="reply-to">
                回复 <span className="reply-user">@{comment.replyTo}</span>
              </div>
            )}
          </div>
        }
        datetime={
          <Tooltip title={moment(comment.createTime).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(comment.createTime).fromNow()}</span>
          </Tooltip>
        }
      >
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="child-comments">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                onDelete={onDelete}
                onUpdate={onUpdate}
                currentUserId={currentUserId}
                showReplies={false}
              />
            ))}
          </div>
        )}
        
        {isReplying && (
          <div className="reply-form">
            <TextArea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              placeholder={`回复 @${comment.username}...`}
            />
            <div className="reply-actions">
              <Space>
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={handleReply}
                  loading={loading}
                >
                  回复
                </Button>
                <Button 
                  size="small" 
                  onClick={() => setIsReplying(false)}
                >
                  取消
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Comment>
    </div>
  );
};

const CommentList = ({ 
  targetType, 
  targetId, 
  currentUserId,
  onCommentChange 
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取评论列表
  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await commentApi.getCommentTree({
        targetType,
        targetId,
        page,
        size: pagination.pageSize
      });
      
      if (response.data.code === 200) {
        const data = response.data.data;
        setComments(data.records || []);
        setPagination({
          current: data.current,
          pageSize: data.size,
          total: data.total
        });
      }
    } catch (error) {
      message.error('获取评论失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建评论
  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      message.warning('评论内容不能为空');
      return;
    }

    try {
      const response = await commentApi.createComment({
        targetType,
        targetId,
        content: newComment
      });
      
      if (response.data.code === 200) {
        setNewComment('');
        fetchComments(1);
        onCommentChange && onCommentChange();
        message.success('评论成功');
      }
    } catch (error) {
      message.error('评论失败');
    }
  };

  // 回复评论
  const handleReply = async (parentId, content) => {
    const response = await commentApi.replyComment(parentId, {
      content,
      targetType,
      targetId
    });
    
    if (response.data.code === 200) {
      fetchComments(pagination.current);
      onCommentChange && onCommentChange();
    }
  };

  // 点赞评论
  const handleLike = async (commentId) => {
    await commentApi.likeComment(commentId);
  };

  // 删除评论
  const handleDelete = async (commentId) => {
    await commentApi.deleteComment(commentId);
    fetchComments(pagination.current);
    onCommentChange && onCommentChange();
  };

  // 更新评论
  const handleUpdate = async (commentId, content) => {
    await commentApi.updateComment(commentId, { content });
    fetchComments(pagination.current);
  };

  // 分页变化
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
    fetchComments(page);
  };

  useEffect(() => {
    if (targetType && targetId) {
      fetchComments();
    }
  }, [targetType, targetId]);

  return (
    <div className="comment-list">
      <div className="comment-form">
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          placeholder="写下你的评论..."
        />
        <div className="form-actions">
          <Button 
            type="primary" 
            onClick={handleCreateComment}
            disabled={!newComment.trim()}
          >
            发表评论
          </Button>
        </div>
      </div>

      <Divider>评论列表 ({pagination.total})</Divider>

      <List
        loading={loading}
        dataSource={comments}
        renderItem={comment => (
          <List.Item key={comment.id}>
            <CommentItem
              comment={comment}
              onReply={handleReply}
              onLike={handleLike}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              currentUserId={currentUserId}
            />
          </List.Item>
        )}
        pagination={{
          ...pagination,
          onChange: handlePageChange,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条评论`
        }}
      />
    </div>
  );
};

export default CommentList;
package com.homedesign.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.homedesign.dto.CommentDTO;
import com.homedesign.entity.Comment;

import java.util.List;
import java.util.Map;

public interface CommentService extends IService<Comment> {
    
    // 创建评论（支持回复）
    Comment createComment(Comment comment);
    
    // 获取评论列表（支持多级评论）
    Map<String, Object> getCommentTree(String targetType, Long targetId, Integer page, Integer size);
    
    // 点赞评论
    void likeComment(Long commentId, Long userId);
    
    // 获取子评论
    List<Comment> getChildComments(Long parentId);
    
    // 删除评论（级联删除子评论）
    void deleteComment(Long commentId, Long userId);
    
    // 更新评论
    void updateComment(Long commentId, Long userId, String content);
    
    // 获取用户评论列表
    IPage<CommentDTO> getUserComments(Long userId, Integer page, Integer size);
    
    // 获取设计师案例评论
    IPage<CommentDTO> getDesignerCaseComments(Long designerId, Integer page, Integer size);
    
    // 回复评论
    void replyToComment(Long commentId, String content);
    
    // 删除评论（设计师使用）
    void deleteCommentById(Long commentId);
}
package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.dto.CommentDTO;
import com.homedesign.entity.Comment;
import com.homedesign.service.CommentService;
import com.homedesign.service.UserService;
import com.homedesign.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;


    @Autowired
    private com.homedesign.service.DesignerService designerService;

    @GetMapping
    public Result<IPage<Comment>> getComments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) Long targetId) {
        
        Page<Comment> pageInfo = new Page<>(page, size);
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        
        if (targetType != null) {
            queryWrapper.eq("target_type", targetType);
        }
        if (targetId != null) {
            queryWrapper.eq("target_id", targetId);
        }
        
        queryWrapper.orderByDesc("create_time");
        
        IPage<Comment> result = commentService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }


    @GetMapping("/case/{caseId}")
    public Result<IPage<Comment>> getCaseComments(
            @PathVariable Long caseId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Page<Comment> pageInfo = new Page<>(page, size);
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("target_type", "case")
                   .eq("target_id", caseId)
                   .orderByDesc("create_time");
        
        IPage<Comment> result = commentService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @GetMapping("/article/{articleId}")
    public Result<IPage<Comment>> getArticleComments(
            @PathVariable Long articleId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Page<Comment> pageInfo = new Page<>(page, size);
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("target_type", "article")
                   .eq("target_id", articleId)
                   .orderByDesc("create_time");
        
        IPage<Comment> result = commentService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    // 获取评论树（支持多级评论）
    @GetMapping("/tree")
    public Result<Map<String, Object>> getCommentTree(
            @RequestParam String targetType,
            @RequestParam Long targetId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Map<String, Object> result = commentService.getCommentTree(targetType, targetId, page, size);
        return Result.success(result);
    }

    // 创建评论（支持回复）
    @PostMapping("/create")
    public Result<Comment> createComment(@RequestBody Map<String, Object> requestData) {
        System.out.println("Controller接收到的原始数据: " + requestData);
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        // 手动创建Comment对象并设置字段
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setContent((String) requestData.get("content"));
        
        // 处理字段名映射（支持驼峰和下划线）
        String targetType = (String) requestData.get("targetType");
        if (targetType == null) {
            targetType = (String) requestData.get("target_type");
        }
        comment.setTargetType(targetType);
        
        Object targetIdObj = requestData.get("targetId");
        if (targetIdObj == null) {
            targetIdObj = requestData.get("target_id");
        }
        if (targetIdObj != null) {
            comment.setTargetId(Long.valueOf(targetIdObj.toString()));
        }
        
        System.out.println("处理后的Comment对象: " + comment);
        
        Comment createdComment = commentService.createComment(comment);
        return Result.success(createdComment);
    }

    // 回复评论
    @PostMapping("/reply/{parentId}")
    public Result<Comment> replyComment(
            @PathVariable Long parentId,
            @RequestBody Map<String, Object> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        String content = (String) params.get("content");
        String targetType = (String) params.get("targetType");
        Long targetId = Long.valueOf(params.get("targetId").toString());
        
        Comment parentComment = commentService.getById(parentId);
        if (parentComment == null) {
            return Result.error("父评论不存在");
        }
        
        Comment reply = new Comment();
        reply.setTargetType(targetType);
        reply.setTargetId(targetId);
        reply.setUserId(userId);
        reply.setParentId(parentId);
        reply.setReplyTo(parentComment.getUsername());
        reply.setContent(content);
        
        Comment createdReply = commentService.createComment(reply);
        return Result.success(createdReply);
    }

    // 点赞评论
    @PostMapping("/{id}/like")
    public Result<String> likeComment(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        commentService.likeComment(id, userId);
        return Result.success("点赞成功");
    }

    // 获取子评论
    @GetMapping("/{parentId}/replies")
    public Result<java.util.List<Comment>> getChildComments(@PathVariable Long parentId) {
        java.util.List<Comment> replies = commentService.getChildComments(parentId);
        return Result.success(replies);
    }

    // 删除评论（级联删除子评论）
    @DeleteMapping("/{id}/delete")
    public Result<String> deleteComment(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        try {
            commentService.deleteComment(id, userId);
            return Result.success("删除成功");
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 更新评论
    @PutMapping("/{id}/update")
    public Result<String> updateComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        String content = params.get("content");
        
        try {
            commentService.updateComment(id, userId, content);
            return Result.success("更新成功");
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 获取用户评论列表
    @GetMapping("/user/{userId}")
    public Result<IPage<CommentDTO>> getUserComments(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        IPage<CommentDTO> comments = commentService.getUserComments(userId, page, size);
        return Result.success(comments);
    }

    // 获取当前用户的评论列表
    @GetMapping("/user/me")
    public Result<IPage<CommentDTO>> getMyComments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        IPage<CommentDTO> comments = commentService.getUserComments(userId, page, size);
        return Result.success(comments);
    }

    // 获取设计师案例评论（用于评论管理）
    @GetMapping("/designer/cases")
    public Result<IPage<CommentDTO>> getDesignerCaseComments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        // 从SecurityContext获取当前设计师ID
        Long userId = SecurityUtil.getCurrentUserId();
            // 根据用户ID查找对应的设计师记录
        QueryWrapper<com.homedesign.entity.Designer> designerQuery = new QueryWrapper<>();
        designerQuery.eq("user_id", userId);
        com.homedesign.entity.Designer designer = designerService.getOne(designerQuery);
        
        if (designer == null) {
            return Result.error("您还不是认证设计师");
        }
        
        IPage<CommentDTO> comments = commentService.getDesignerCaseComments(designer.getId(), page, size);
        return Result.success(comments);
    }

    // 回复评论（设计师使用）
    @PutMapping("/{id}/reply")
    public Result<String> replyToComment(@PathVariable Long id, @RequestBody Map<String, String> params) {
        String content = params.get("content");
        if (content == null || content.trim().isEmpty()) {
            return Result.error("回复内容不能为空");
        }
        
        try {
            commentService.replyToComment(id, content);
            return Result.success("回复成功");
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 删除评论（设计师使用）
    @DeleteMapping("/{id}")
    public Result<String> deleteCommentById(@PathVariable Long id) {
        try {
            commentService.deleteCommentById(id);
            return Result.success("删除成功");
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
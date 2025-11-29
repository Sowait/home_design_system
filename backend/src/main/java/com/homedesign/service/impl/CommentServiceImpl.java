package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.Comment;
import com.homedesign.entity.User;
import com.homedesign.entity.Case;
import com.homedesign.entity.Designer;
import com.homedesign.mapper.CommentMapper;
import com.homedesign.service.CommentService;
import com.homedesign.service.UserService;
import com.homedesign.service.CaseService;
import com.homedesign.service.DesignerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.homedesign.dto.CommentDTO;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CaseService caseService;
    
    @Autowired
    private DesignerService designerService;

    @Override
    public Comment createComment(Comment comment) {
        // 打印调试信息
        System.out.println("接收到的评论数据: " + comment);
        
        // 设置用户信息
        User user = userService.getById(comment.getUserId());
        if (user != null) {
            comment.setUsername(user.getUsername());
            comment.setAvatar(user.getAvatar());
        }
        
        // 确保必需字段不为null
        if (comment.getTargetType() == null) {
            throw new RuntimeException("target_type不能为空");
        }
        if (comment.getTargetId() == null) {
            throw new RuntimeException("target_id不能为空");
        }
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            throw new RuntimeException("content不能为空");
        }
        
        // 设置初始值
        comment.setLikes(0);
        comment.setCreateTime(LocalDateTime.now());
        comment.setUpdateTime(LocalDateTime.now());
        comment.setDeleted(0);
        
        System.out.println("准备保存的评论: " + comment);
        save(comment);
        return comment;
    }

    @Override
    public Map<String, Object> getCommentTree(String targetType, Long targetId, Integer page, Integer size) {
        // 获取顶级评论（parent_id为null或0）
        Page<Comment> pageInfo = new Page<>(page, size);
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("target_type", targetType)
                   .eq("target_id", targetId)
                   .and(wrapper -> wrapper.isNull("parent_id").or().eq("parent_id", 0))
                   .orderByDesc("create_time");
        
        IPage<Comment> topComments = page(pageInfo, queryWrapper);
        
        // 为每个顶级评论获取子评论
        List<Comment> commentsWithReplies = new ArrayList<>();
        for (Comment comment : topComments.getRecords()) {
            List<Comment> childComments = getChildComments(comment.getId());
            
            // 创建包含子评论的评论对象
            Comment commentWithChildren = new Comment();
            commentWithChildren.setId(comment.getId());
            commentWithChildren.setTargetType(comment.getTargetType());
            commentWithChildren.setTargetId(comment.getTargetId());
            commentWithChildren.setUserId(comment.getUserId());
            commentWithChildren.setUsername(comment.getUsername());
            commentWithChildren.setAvatar(comment.getAvatar());
            commentWithChildren.setContent(comment.getContent());
            commentWithChildren.setLikes(comment.getLikes());
            commentWithChildren.setParentId(comment.getParentId());
            commentWithChildren.setReplyTo(comment.getReplyTo());
            commentWithChildren.setCreateTime(comment.getCreateTime());
            commentWithChildren.setUpdateTime(comment.getUpdateTime());
            
            // 将子评论作为属性存储
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("comment", commentWithChildren);
            commentMap.put("replies", childComments);
            
            commentsWithReplies.add(commentWithChildren);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("records", commentsWithReplies);
        result.put("total", topComments.getTotal());
        result.put("pages", topComments.getPages());
        result.put("current", topComments.getCurrent());
        result.put("size", topComments.getSize());
        
        return result;
    }

    @Override
    public List<Comment> getChildComments(Long parentId) {
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("parent_id", parentId)
                   .orderByAsc("create_time");
        
        return list(queryWrapper);
    }

    @Override
    public void likeComment(Long commentId, Long userId) {
        Comment comment = getById(commentId);
        if (comment != null) {
            comment.setLikes(comment.getLikes() + 1);
            updateById(comment);
        }
    }

    @Override
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = getById(commentId);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除此评论");
        }
        
        // 级联删除子评论
        List<Comment> childComments = getChildComments(commentId);
        for (Comment child : childComments) {
            deleteComment(child.getId(), userId); // 递归删除子评论
        }
        
        // 删除父评论
        removeById(commentId);
    }

    @Override
    public void updateComment(Long commentId, Long userId, String content) {
        Comment comment = getById(commentId);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("无权限修改此评论");
        }
        
        comment.setContent(content);
        comment.setUpdateTime(LocalDateTime.now());
        updateById(comment);
    }

    @Override
    public IPage<CommentDTO> getUserComments(Long userId, Integer page, Integer size) {
        Page<Comment> pageInfo = new Page<>(page, size);
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                   .orderByDesc("create_time");
        
        IPage<Comment> commentPage = page(pageInfo, queryWrapper);
        
        // 转换为CommentDTO并设置targetTitle
        List<CommentDTO> commentDTOs = new ArrayList<>();
        for (Comment comment : commentPage.getRecords()) {
            String targetTitle = getTargetTitle(comment.getTargetType(), comment.getTargetId());
            CommentDTO dto = CommentDTO.fromEntity(comment, targetTitle);
            commentDTOs.add(dto);
        }
        
        // 创建新的CommentDTO分页对象
        Page<CommentDTO> dtoPage = new Page<>(page, size);
        dtoPage.setRecords(commentDTOs);
        dtoPage.setTotal(commentPage.getTotal());
        dtoPage.setPages(commentPage.getPages());
        dtoPage.setCurrent(commentPage.getCurrent());
        dtoPage.setSize(commentPage.getSize());
        
        return dtoPage;
    }
    
    private String getTargetTitle(String targetType, Long targetId) {
        if ("case".equals(targetType)) {
            // 查询真实的案例标题
            try {
                Case caseEntity = caseService.getById(targetId);
                if (caseEntity != null && caseEntity.getTitle() != null) {
                    return caseEntity.getTitle();
                }
            } catch (Exception e) {
                System.out.println("查询案例标题失败: " + e.getMessage());
            }
            return "设计案例";
        } else if ("article".equals(targetType)) {
            return "文章";
        } else if ("designer".equals(targetType)) {
            return "设计师";
        }
        return "未知对象";
    }

    @Override
    public IPage<CommentDTO> getDesignerCaseComments(Long designerId, Integer page, Integer size) {
        // 检查designerId是否为null
        if (designerId == null) {
            Page<CommentDTO> emptyPage = new Page<>(page, size);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }
        
        // 查询该设计师的所有案例
        QueryWrapper<Case> caseQueryWrapper = new QueryWrapper<>();
        caseQueryWrapper.eq("designer_id", designerId)
                       .select("id", "title");
        List<Case> designerCases = caseService.list(caseQueryWrapper);
        
        if (designerCases.isEmpty()) {
            // 如果该设计师没有案例，返回空结果
            Page<CommentDTO> emptyPage = new Page<>(page, size);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }
        
        // 获取案例ID列表和标题映射
        List<Long> caseIds = new ArrayList<>();
        Map<Long, String> caseTitleMap = new HashMap<>();
        for (Case caseEntity : designerCases) {
            caseIds.add(caseEntity.getId());
            caseTitleMap.put(caseEntity.getId(), caseEntity.getTitle());
        }
        
        // 查询这些案例下的所有评论
        Page<Comment> pageInfo = new Page<>(page, size);
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("target_type", "case")
                   .in("target_id", caseIds)
                   .orderByDesc("create_time");
        
        IPage<Comment> commentPage = page(pageInfo, queryWrapper);
        
        // 转换为CommentDTO并设置targetTitle
        List<CommentDTO> commentDTOs = new ArrayList<>();
        for (Comment comment : commentPage.getRecords()) {
            String targetTitle = caseTitleMap.getOrDefault(comment.getTargetId(), "设计案例");
            CommentDTO dto = CommentDTO.fromEntity(comment, targetTitle);
            commentDTOs.add(dto);
        }
        
        // 创建新的CommentDTO分页对象
        Page<CommentDTO> dtoPage = new Page<>(page, size);
        dtoPage.setRecords(commentDTOs);
        dtoPage.setTotal(commentPage.getTotal());
        dtoPage.setPages(commentPage.getPages());
        dtoPage.setCurrent(commentPage.getCurrent());
        dtoPage.setSize(commentPage.getSize());
        
        return dtoPage;
    }

    @Override
    public void replyToComment(Long commentId, String content) {
        Comment comment = getById(commentId);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }
        
        // 验证该评论是否是对案例的评论
        if (!"case".equals(comment.getTargetType())) {
            throw new RuntimeException("只能回复案例下的评论");
        }
        
        // 验证该案例是否属于当前设计师
        Case targetCase = caseService.getById(comment.getTargetId());
        if (targetCase == null) {
            throw new RuntimeException("评论对应的案例不存在");
        }
        
        // 获取当前登录的设计师ID（从SecurityContext获取）
        Long currentDesignerId = com.homedesign.util.SecurityUtil.getCurrentUserId();
        
        // 验证案例是否属于当前设计师
        if (!currentDesignerId.equals(targetCase.getDesignerId())) {
            throw new RuntimeException("无权限回复此评论（不属于您的案例）");
        }
        
        // 创建回复评论
        Comment reply = new Comment();
        reply.setTargetType(comment.getTargetType());
        reply.setTargetId(comment.getTargetId());
        reply.setParentId(commentId);
        reply.setReplyTo(comment.getUsername());
        reply.setContent(content);
        reply.setLikes(0);
        reply.setCreateTime(LocalDateTime.now());
        reply.setUpdateTime(LocalDateTime.now());
        reply.setDeleted(0);
        
        // 设置为当前设计师的用户信息
        reply.setUserId(currentDesignerId);
        
        // 获取当前设计师的用户名
        try {
            User designerUser = userService.getById(currentDesignerId);
            if (designerUser != null) {
                reply.setUsername(designerUser.getUsername());
                reply.setAvatar(designerUser.getAvatar());
            } else {
                reply.setUsername("设计师回复");
            }
        } catch (Exception e) {
            reply.setUsername("设计师回复");
        }
        
        save(reply);
    }

    @Override
    public void deleteCommentById(Long commentId) {
        Comment comment = getById(commentId);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }
        
        // 级联删除子评论
        List<Comment> childComments = getChildComments(commentId);
        for (Comment child : childComments) {
            deleteCommentById(child.getId()); // 递归删除子评论
        }
        
        // 删除评论
        removeById(commentId);
    }
}
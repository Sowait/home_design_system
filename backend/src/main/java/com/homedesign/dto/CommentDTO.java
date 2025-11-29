package com.homedesign.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private String targetType;
    private Long targetId;
    private String targetTitle; // 新增字段：目标对象的标题
    private Long userId;
    private String username;
    private String avatar;
    private String content;
    private Integer likes;
    private Long parentId;
    private String replyTo;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    // 从Comment实体转换
    public static CommentDTO fromEntity(com.homedesign.entity.Comment comment, String targetTitle) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setTargetType(comment.getTargetType());
        dto.setTargetId(comment.getTargetId());
        dto.setTargetTitle(targetTitle);
        dto.setUserId(comment.getUserId());
        dto.setUsername(comment.getUsername());
        dto.setAvatar(comment.getAvatar());
        dto.setContent(comment.getContent());
        dto.setLikes(comment.getLikes());
        dto.setParentId(comment.getParentId());
        dto.setReplyTo(comment.getReplyTo());
        dto.setCreateTime(comment.getCreateTime());
        dto.setUpdateTime(comment.getUpdateTime());
        return dto;
    }
}
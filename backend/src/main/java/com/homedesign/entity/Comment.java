package com.homedesign.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("comment")
public class Comment {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("target_type")
    private String targetType; // case, article
    
    @TableField("target_id")
    private Long targetId;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("username")
    private String username;
    
    @TableField("avatar")
    private String avatar;
    
    @TableField("content")
    private String content;
    
    @TableField("likes")
    private Integer likes;
    
    @TableField("parent_id")
    private Long parentId;
    
    @TableField("reply_to")
    private String replyTo;
    
    @TableField("create_time")
    private LocalDateTime createTime;
    
    @TableField("update_time")
    private LocalDateTime updateTime;
    
    @TableField(value = "deleted", fill = FieldFill.INSERT)
    @TableLogic
    private Integer deleted;
}
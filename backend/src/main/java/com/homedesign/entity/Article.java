package com.homedesign.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("article")
public class Article {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("title")
    private String title;
    
    @TableField("category")
    private String category;
    
    @TableField("author_id")
    private Long authorId;
    
    @TableField("author_name")
    private String authorName;
    
    @TableField("author_avatar")
    private String authorAvatar;
    
    @TableField("author_title")
    private String authorTitle;
    
    @TableField("author_bio")
    private String authorBio;
    
    @TableField("cover_image")
    private String coverImage;
    
    @TableField("summary")
    private String summary;
    
    @TableField("content")
    private String content;
    
    @TableField("tags")
    private String tags;
    
    @TableField("views")
    private Integer views;
    
    @TableField("likes")
    private Integer likes;
    
    @TableField("status")
    private String status;
    
    @TableField("publish_time")
    private LocalDateTime publishTime;
    
    @TableField("create_time")
    private LocalDateTime createTime;
    
    @TableField("update_time")
    private LocalDateTime updateTime;
    
    @TableField(value = "deleted", fill = FieldFill.INSERT)
    @TableLogic
    private Integer deleted;
}
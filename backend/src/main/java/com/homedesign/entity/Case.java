package com.homedesign.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("design_case")
public class Case {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("title")
    private String title;
    
    @TableField("style")
    private String style;
    
    @TableField("layout")
    private String layout;
    
    @TableField("area")
    private Integer area;
    
    @TableField("designer_id")
    private Long designerId;
    
    @TableField("designer_name")
    private String designerName;
    
    @TableField("cover_image")
    private String coverImage;
    
    @TableField("images")
    private String images;
    
    @TableField("design_concept")
    private String designConcept;
    
    @TableField("materials")
    private String materials;
    
    @TableField("views")
    private Integer views;
    
    @TableField("likes")
    private Integer likes;
    
    @TableField("favorites")
    private Integer favorites;
    
    @TableField("status")
    private String status;
    
    @TableField("create_time")
    private LocalDateTime createTime;
    
    @TableField("update_time")
    private LocalDateTime updateTime;
    
    // 移除publish_time字段，因为数据库表中没有这个字段
    
    @TableField(value = "deleted", fill = FieldFill.INSERT)
    @TableLogic
    private Integer deleted;
}
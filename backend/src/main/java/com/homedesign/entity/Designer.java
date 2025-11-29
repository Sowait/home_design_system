package com.homedesign.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("designer")
public class Designer {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("name")
    private String name;
    
    @TableField("title")
    private String title;
    
    @TableField("avatar")
    private String avatar;
    
    // 移除phone和email字段，因为数据库表中没有这些字段
    // 设计师的联系方式应该在user表中
    
    @TableField("service_area")
    private String serviceArea;
    
    @TableField("style")
    private String style;
    
    @TableField("price")
    private String price;
    
    @TableField("experience")
    private Integer experience;
    
    @TableField("completed_cases")
    private Integer completedCases;
    
    @TableField("likes")
    private Integer likes;
    
    @TableField("bio")
    private String bio;
    
    @TableField("education")
    private String education;
    
    @TableField("awards")
    private String awards;
    
    @TableField("service_scope")
    private String serviceScope;
    
    @TableField("rating")
    private Double rating;
    
    @TableField("create_time")
    private LocalDateTime createTime;
    
    @TableField("update_time")
    private LocalDateTime updateTime;
    
    @TableField(value = "deleted", fill = FieldFill.INSERT)
    @TableLogic
    private Integer deleted;
}
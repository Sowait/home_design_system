package com.homedesign.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("appointment")
public class Appointment {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("user_name")
    private String userName;
    
    @TableField("designer_id")
    private Long designerId;
    
    @TableField("designer_name")
    private String designerName;
    
    @TableField("appointment_time")
    private LocalDateTime appointmentTime;
    
    @TableField("floor_plan")
    private String floorPlan;
    
    @TableField("description")
    private String description;
    
    @TableField("contact")
    private String contact;
    
    @TableField("budget")
    private String budget;
    
    @TableField("status")
    private String status;
    
    @TableField("create_time")
    private LocalDateTime createTime;
    
    @TableField("update_time")
    private LocalDateTime updateTime;
    
    @TableField(value = "deleted", fill = FieldFill.INSERT)
    @TableLogic
    private Integer deleted;
    
    // 额外字段，用于前端显示（不对应数据库字段）
    @TableField(exist = false)
    private String style;
    
    @TableField(exist = false)
    private String address;
    
    @TableField(exist = false)
    private String area;
    
    @TableField(exist = false)
    private String remarks;
}
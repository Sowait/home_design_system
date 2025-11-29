package com.homedesign.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 搜索历史实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("search_history")
public class SearchHistory {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("keyword")
    private String keyword;

    @TableField("search_type")
    private String searchType;

    @TableField("user_id")
    private Long userId;

    @TableField("search_time")
    private LocalDateTime searchTime;

    @TableField("frequency")
    private Integer frequency;

    @TableLogic
    @TableField("deleted")
    private Integer deleted;
}
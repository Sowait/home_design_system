package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.entity.User;

import java.util.Map;

/**
 * 管理员服务接口
 */
public interface AdminService {
    
    /**
     * 获取用户列表
     */
    IPage<User> getUserList(Integer page, Integer size, String keyword, String role, String status);
    

    
    /**
     * 获取系统统计信息
     */
    Map<String, Object> getSystemStats();
    
    /**
     * 获取系统分析数据
     */
    Map<String, Object> getSystemAnalytics();
    
    /**
     * 批量更新内容状态
     */
    boolean batchUpdateContentStatus(String contentType, java.util.List<Long> ids, String status);
}
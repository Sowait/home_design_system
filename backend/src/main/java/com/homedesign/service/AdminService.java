package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.homedesign.entity.User;

import java.util.Map;

/**
 * 管理员服务接口
 * 负责用户管理和系统统计功能
 */
public interface AdminService {
    
    /**
     * 获取用户列表
     * @param page 页码
     * @param size 每页大小
     * @param keyword 关键词搜索（用户名、邮箱）
     * @param role 角色筛选
     * @return 用户分页列表
     */
    IPage<User> getUserList(Integer page, Integer size, String keyword, String role);
    
    /**
     * 获取系统统计信息
     * @return 统计数据Map
     */
    Map<String, Object> getSystemStats();
    
    /**
     * 批量操作用户
     * @param userIds 用户ID列表
     * @param operation 操作类型（delete）
     * @return 操作是否成功
     */
    boolean batchOperateUsers(java.util.List<Long> userIds, String operation);
    
    /**
     * 获取用户详细统计
     * @return 用户统计数据
     */
    Map<String, Object> getUserStats();
    
    /**
     * 检查用户名是否已存在
     * @param username 用户名
     * @param excludeId 排除的用户ID（用于更新时检查）
     * @return 是否已存在
     */
    boolean isUsernameExists(String username, Long excludeId);
    
    /**
     * 检查邮箱是否已存在
     * @param email 邮箱
     * @param excludeId 排除的用户ID（用于更新时检查）
     * @return 是否已存在
     */
    boolean isEmailExists(String email, Long excludeId);
}

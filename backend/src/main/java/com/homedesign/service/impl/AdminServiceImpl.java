package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.entity.User;
import com.homedesign.entity.Case;
import com.homedesign.service.AdminService;
import com.homedesign.service.UserService;
import com.homedesign.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理员服务实现类
 * 负责用户管理和系统统计功能
 */
@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserService userService;

    @Autowired
    private CaseService caseService;
    

    @Override
    public IPage<User> getUserList(Integer page, Integer size, String keyword, String role) {
        Page<User> pageInfo = new Page<>(page, size);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        
        // 关键词搜索（用户名、邮箱）
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.and(wrapper -> wrapper.like("username", keyword)
                                            .or()
                                            .like("email", keyword));
        }
        
        // 角色筛选
        if (role != null && !role.trim().isEmpty()) {
            queryWrapper.eq("role", role);
        }
        
        queryWrapper.orderByDesc("create_time");
        return userService.page(pageInfo, queryWrapper);
    }

    @Override
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 用户总数
        long totalUsers = userService.count();
        stats.put("totalUsers", totalUsers);
        
        // 各角色用户数量
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("role", "USER");
        long userCount = userService.count(userQuery);
        stats.put("userCount", userCount);
        
        userQuery = new QueryWrapper<>();
        userQuery.eq("role", "DESIGNER");
        long designerCount = userService.count(userQuery);
        stats.put("designerCount", designerCount);
        
        userQuery = new QueryWrapper<>();
        userQuery.eq("role", "ADMIN");
        long adminCount = userService.count(userQuery);
        stats.put("adminCount", adminCount);
        
        // 今日注册用户数
        QueryWrapper<User> todayQuery = new QueryWrapper<>();
        todayQuery.ge("create_time", LocalDateTime.now().toLocalDate().atStartOfDay());
        long todayUsers = userService.count(todayQuery);
        stats.put("todayUsers", todayUsers);
        
        // 案例总数
        long totalCases = caseService.count();
        stats.put("totalCases", totalCases);
        
        return stats;
    }



    @Override
    public boolean batchOperateUsers(List<Long> userIds, String operation) {
        if (userIds == null || userIds.isEmpty()) {
            return false;
        }
        
        if ("delete".equals(operation)) {
            return userService.removeBatchByIds(userIds);
        }
        
        return false;
    }

    @Override
    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 用户总数
        long totalUsers = userService.count();
        stats.put("totalUsers", totalUsers);
        
        // 各角色用户数量
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role", "USER");
        long userCount = userService.count(queryWrapper);
        stats.put("userCount", userCount);
        
        queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role", "DESIGNER");
        long designerCount = userService.count(queryWrapper);
        stats.put("designerCount", designerCount);
        
        queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role", "ADMIN");
        long adminCount = userService.count(queryWrapper);
        stats.put("adminCount", adminCount);
        
        // 今日注册用户数
        queryWrapper = new QueryWrapper<>();
        queryWrapper.ge("create_time", LocalDateTime.now().toLocalDate().atStartOfDay());
        long todayUsers = userService.count(queryWrapper);
        stats.put("todayUsers", todayUsers);
        
        // 本月新增用户数
        queryWrapper = new QueryWrapper<>();
        queryWrapper.ge("create_time", LocalDateTime.now().minusDays(30));
        long monthUsers = userService.count(queryWrapper);
        stats.put("monthUsers", monthUsers);
        
        return stats;
    }

    @Override
    public boolean isUsernameExists(String username, Long excludeId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        return userService.count(queryWrapper) > 0;
    }

    @Override
    public boolean isEmailExists(String email, Long excludeId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        return userService.count(queryWrapper) > 0;
    }

    /**
     * 生成随机密码
     */
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return password.toString();
    }
}
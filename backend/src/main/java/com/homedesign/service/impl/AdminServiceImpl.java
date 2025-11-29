package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.entity.User;
import com.homedesign.entity.Case;
import com.homedesign.entity.Designer;
import com.homedesign.entity.Article;
import com.homedesign.entity.Appointment;
import com.homedesign.entity.Notification;
import com.homedesign.service.AdminService;
import com.homedesign.service.UserService;
import com.homedesign.service.CaseService;
import com.homedesign.service.DesignerService;
import com.homedesign.service.ArticleService;
import com.homedesign.service.AppointmentService;
import com.homedesign.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CaseService caseService;
    
    @Autowired
    private DesignerService designerService;
    
    @Autowired
    private ArticleService articleService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private NotificationService notificationService;

    @Override
    public IPage<User> getUserList(Integer page, Integer size, String keyword, String role, String status) {
        Page<User> pageInfo = new Page<>(page, size);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.and(wrapper -> wrapper.like("username", keyword)
                                            .or()
                                            .like("email", keyword));
        }
        
        if (role != null && !role.trim().isEmpty()) {
            queryWrapper.eq("role", role);
        }
        
        if (status != null && !status.trim().isEmpty()) {
            queryWrapper.eq("status", status);
        }
        
        queryWrapper.orderByDesc("create_time");
        return userService.page(pageInfo, queryWrapper);
    }



    @Override
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 用户统计
        stats.put("totalUsers", userService.count());
        stats.put("activeUsers", userService.count(new QueryWrapper<User>().eq("status", "ACTIVE")));
        
        // 设计师统计
        stats.put("totalDesigners", designerService.count());
        stats.put("verifiedDesigners", designerService.count(new QueryWrapper<Designer>().eq("verified", true)));
        
        // 案例统计
        stats.put("totalCases", caseService.count());
        stats.put("publishedCases", caseService.count(new QueryWrapper<Case>().eq("status", "PUBLISHED")));
        
        // 文章统计
        stats.put("totalArticles", articleService.count());
        stats.put("publishedArticles", articleService.count(new QueryWrapper<Article>().eq("status", "PUBLISHED")));
        
        // 预约统计
        stats.put("totalAppointments", appointmentService.count());
        stats.put("pendingAppointments", appointmentService.count(new QueryWrapper<Appointment>().eq("status", "PENDING")));
        
        // 通知统计
        // 暂时使用默认值，因为NotificationService没有count方法
        stats.put("totalNotifications", 0);
        stats.put("unreadNotifications", 0);
        
        return stats;
    }

    @Override
    public Map<String, Object> getSystemAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // 这里可以添加更复杂的分析逻辑
        // 暂时返回基础统计
        analytics.put("userGrowth", getUserGrowthStats());
        analytics.put("contentStats", getContentStats());
        analytics.put("activityStats", getActivityStats());
        
        return analytics;
    }

    @Override
    public boolean batchUpdateContentStatus(String contentType, List<Long> ids, String status) {
        switch (contentType.toUpperCase()) {
            case "CASE":
                return updateCasesStatus(ids, status);
            case "ARTICLE":
                return updateArticlesStatus(ids, status);
            case "DESIGNER":
                return updateDesignersStatus(ids, status);
            default:
                return false;
        }
    }

    // 私有辅助方法

    private boolean updateCasesStatus(List<Long> ids, String status) {
        List<Case> cases = caseService.listByIds(ids);
        for (Case designCase : cases) {
            designCase.setStatus(status);
        }
        return caseService.updateBatchById(cases);
    }

    private boolean updateArticlesStatus(List<Long> ids, String status) {
        List<Article> articles = articleService.listByIds(ids);
        for (Article article : articles) {
            article.setStatus(status);
        }
        return articleService.updateBatchById(articles);
    }

    private boolean updateDesignersStatus(List<Long> ids, String status) {
        List<Designer> designers = designerService.listByIds(ids);
        for (Designer designer : designers) {
        }
        return designerService.updateBatchById(designers);
    }

    private Map<String, Object> getUserGrowthStats() {
        Map<String, Object> growth = new HashMap<>();
        // 这里应该实现真实的用户增长统计
        growth.put("newUsersThisMonth", 0);
        growth.put("newUsersThisWeek", 0);
        growth.put("newUsersToday", 0);
        return growth;
    }

    private Map<String, Object> getContentStats() {
        Map<String, Object> content = new HashMap<>();
        content.put("totalViews", 0);
        content.put("totalLikes", 0);
        content.put("totalComments", 0);
        return content;
    }

    private Map<String, Object> getActivityStats() {
        Map<String, Object> activity = new HashMap<>();
        activity.put("activeUsersToday", 0);
        activity.put("newAppointmentsToday", 0);
        activity.put("newCommentsToday", 0);
        return activity;
    }
}
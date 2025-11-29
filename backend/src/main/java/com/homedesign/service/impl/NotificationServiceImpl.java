package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.Notification;
import com.homedesign.mapper.NotificationMapper;
import com.homedesign.service.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class NotificationServiceImpl extends ServiceImpl<NotificationMapper, Notification> implements NotificationService {

    @Override
    public boolean createNotification(Notification notification) {
        if (notification.getCreateTime() == null) {
            notification.setCreateTime(LocalDateTime.now());
        }
        if (notification.getUpdateTime() == null) {
            notification.setUpdateTime(LocalDateTime.now());
        }
        return save(notification);
    }

    @Override
    public boolean batchCreateNotifications(List<Notification> notifications) {
        for (Notification notification : notifications) {
            if (notification.getCreateTime() == null) {
                notification.setCreateTime(LocalDateTime.now());
            }
            if (notification.getUpdateTime() == null) {
                notification.setUpdateTime(LocalDateTime.now());
            }
        }
        return saveBatch(notifications);
    }

    @Override
    public IPage<Notification> getUserNotifications(Long userId, Integer page, Integer size, Boolean isRead) {
        Page<Notification> pageInfo = new Page<>(page != null ? page : 1, size != null ? size : 10);
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        
        if (isRead != null) {
            queryWrapper.eq("is_read", isRead);
        }
        
        queryWrapper.orderByDesc("create_time");
        return page(pageInfo, queryWrapper);
    }

    @Override
    public Integer getUnreadCount(Long userId) {
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId).eq("is_read", false);
        return Math.toIntExact(count(queryWrapper));
    }

    @Override
    public boolean markAsRead(Long notificationId) {
        Notification notification = getById(notificationId);
        if (notification == null) {
            return false;
        }
        
        notification.setIsRead(true);
        notification.setReadTime(LocalDateTime.now());
        notification.setUpdateTime(LocalDateTime.now());
        
        return updateById(notification);
    }

    @Override
    public boolean markAllAsRead(Long userId) {
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId).eq("is_read", false);
        
        List<Notification> notifications = list(queryWrapper);
        for (Notification notification : notifications) {
            notification.setIsRead(true);
            notification.setReadTime(LocalDateTime.now());
            notification.setUpdateTime(LocalDateTime.now());
        }
        
        return updateBatchById(notifications);
    }

    @Override
    public boolean deleteNotification(Long notificationId) {
        return removeById(notificationId);
    }

    @Override
    public boolean batchDeleteNotifications(List<Long> notificationIds) {
        return removeByIds(notificationIds);
    }

    @Override
    public boolean sendAppointmentNotification(Long userId, Long appointmentId, String type, String title, String content) {
        return createNotification(userId, title, content, "APPOINTMENT", appointmentId);
    }

    @Override
    public boolean sendCommentNotification(Long userId, Long commentId, String type, String title, String content) {
        return createNotification(userId, title, content, "COMMENT", commentId);
    }

    @Override
    public boolean sendFavoriteNotification(Long userId, Long targetId, String targetType, String title, String content) {
        return createNotification(userId, title, content, "FAVORITE", targetId);
    }

    @Override
    public boolean sendSystemNotification(Long userId, String title, String content) {
        return createNotification(userId, title, content, "SYSTEM", null);
    }

    @Override
    public boolean sendReviewNotification(Long userId, Long targetId, String targetType, String status, String title, String content) {
        return createNotification(userId, title, content, "REVIEW", targetId);
    }

    @Override
    public boolean sendLikeNotification(Long userId, Long targetId, String targetType, String title, String content) {
        return createNotification(userId, title, content, "LIKE", targetId);
    }

    @Override
    public boolean sendNotificationToUsers(List<Long> userIds, String title, String content, String type) {
        List<Notification> notifications = new ArrayList<>();
        for (Long userId : userIds) {
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setTitle(title);
            notification.setContent(content);
            notification.setType(type);
            notification.setIsRead(false);
            notification.setCreateTime(LocalDateTime.now());
            notification.setUpdateTime(LocalDateTime.now());
            notifications.add(notification);
        }
        return saveBatch(notifications);
    }

    @Override
    public boolean sendGlobalNotification(String title, String content, String type) {
        // 这里应该获取所有用户ID，暂时返回true
        return true;
    }

    @Override
    public Map<String, Object> getNotificationStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // 总通知数
        stats.put("total", count(new QueryWrapper<Notification>().eq("user_id", userId)));
        
        // 未读通知数
        stats.put("unread", getUnreadCount(userId));
        
        // 各类型通知统计
        stats.put("appointment", count(new QueryWrapper<Notification>().eq("user_id", userId).eq("type", "APPOINTMENT")));
        stats.put("comment", count(new QueryWrapper<Notification>().eq("user_id", userId).eq("type", "COMMENT")));
        stats.put("favorite", count(new QueryWrapper<Notification>().eq("user_id", userId).eq("type", "FAVORITE")));
        stats.put("system", count(new QueryWrapper<Notification>().eq("user_id", userId).eq("type", "SYSTEM")));
        stats.put("review", count(new QueryWrapper<Notification>().eq("user_id", userId).eq("type", "REVIEW")));
        stats.put("like", count(new QueryWrapper<Notification>().eq("user_id", userId).eq("type", "LIKE")));
        
        return stats;
    }

    @Override
    public Map<String, Object> getNotificationSettings(Long userId) {
        Map<String, Object> settings = new HashMap<>();
        settings.put("appointmentNotification", true);
        settings.put("commentNotification", true);
        settings.put("favoriteNotification", true);
        settings.put("systemNotification", true);
        settings.put("reviewNotification", true);
        settings.put("likeNotification", true);
        return settings;
    }

    @Override
    public boolean updateNotificationSettings(Long userId, Map<String, Object> settings) {
        // 这里应该保存到设置表，暂时返回true
        return true;
    }

    @Override
    public boolean cleanupExpiredNotifications(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_read", true).lt("create_time", cutoffDate);
        return remove(queryWrapper);
    }

    @Override
    public Notification getNotificationById(Long notificationId) {
        return getById(notificationId);
    }

    @Override
    public IPage<Notification> searchNotifications(Long userId, String keyword, Integer page, Integer size) {
        Page<Notification> pageInfo = new Page<>(page != null ? page : 1, size != null ? size : 10);
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.and(wrapper -> wrapper.like("title", keyword)
                                            .or()
                                            .like("content", keyword));
        }
        
        queryWrapper.orderByDesc("create_time");
        return page(pageInfo, queryWrapper);
    }

    private boolean createNotification(Long userId, String title, String content, String type, Long targetId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notification.setTargetId(targetId);
        notification.setIsRead(false);
        notification.setCreateTime(LocalDateTime.now());
        notification.setUpdateTime(LocalDateTime.now());
        
        return save(notification);
    }
}
package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.entity.Notification;

import java.util.List;
import java.util.Map;

public interface NotificationService {
    
    // 基础通知操作
    
    // 创建通知
    boolean createNotification(Notification notification);
    
    // 批量创建通知
    boolean batchCreateNotifications(List<Notification> notifications);
    
    // 获取用户通知列表
    IPage<Notification> getUserNotifications(Long userId, Integer page, Integer size, Boolean isRead);
    
    // 获取未读通知数量
    Integer getUnreadCount(Long userId);
    
    // 标记通知为已读
    boolean markAsRead(Long notificationId);
    
    // 标记所有通知为已读
    boolean markAllAsRead(Long userId);
    
    // 删除通知
    boolean deleteNotification(Long notificationId);
    
    // 批量删除通知
    boolean batchDeleteNotifications(List<Long> notificationIds);
    
    // 便捷通知方法
    
    // 预约相关通知
    boolean sendAppointmentNotification(Long userId, Long appointmentId, String type, String title, String content);
    
    // 评论相关通知
    boolean sendCommentNotification(Long userId, Long commentId, String type, String title, String content);
    
    // 收藏相关通知
    boolean sendFavoriteNotification(Long userId, Long targetId, String targetType, String title, String content);
    
    // 系统通知
    boolean sendSystemNotification(Long userId, String title, String content);
    
    // 审核相关通知
    boolean sendReviewNotification(Long userId, Long targetId, String targetType, String status, String title, String content);
    
    // 点赞相关通知
    boolean sendLikeNotification(Long userId, Long targetId, String targetType, String title, String content);
    
    // 高级通知功能
    
    // 发送通知给多个用户
    boolean sendNotificationToUsers(List<Long> userIds, String title, String content, String type);
    
    // 发送全局通知（所有用户）
    boolean sendGlobalNotification(String title, String content, String type);
    
    // 获取通知统计
    Map<String, Object> getNotificationStats(Long userId);
    
    // 获取通知设置
    Map<String, Object> getNotificationSettings(Long userId);
    
    // 更新通知设置
    boolean updateNotificationSettings(Long userId, Map<String, Object> settings);
    
    // 清理过期通知
    boolean cleanupExpiredNotifications(int days);
    
    // 获取通知详情
    Notification getNotificationById(Long notificationId);
    
    // 搜索通知
    IPage<Notification> searchNotifications(Long userId, String keyword, Integer page, Integer size);
}
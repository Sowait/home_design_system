package com.homedesign.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.homedesign.common.Result;
import com.homedesign.entity.Notification;
import com.homedesign.service.NotificationService;
import com.homedesign.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    // 基础通知操作

    @GetMapping
    public Result<IPage<Notification>> getNotifications(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Boolean isRead) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        IPage<Notification> result = notificationService.getUserNotifications(userId, page, size, isRead);
        return Result.success(result);
    }

    @GetMapping("/unread-count")
    public Result<Integer> getUnreadCount() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        Integer count = notificationService.getUnreadCount(userId);
        return Result.success(count);
    }

    @PutMapping("/{id}/read")
    public Result<String> markAsRead(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        // 验证通知属于当前用户
        Notification notification = notificationService.getNotificationById(id);
        if (notification == null || !notification.getUserId().equals(userId)) {
            return Result.error("通知不存在或无权限");
        }
        
        boolean success = notificationService.markAsRead(id);
        if (success) {
            return Result.success("已标记为已读");
        } else {
            return Result.error("操作失败");
        }
    }

    @PutMapping("/read-all")
    public Result<String> markAllAsRead() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        boolean success = notificationService.markAllAsRead(userId);
        if (success) {
            return Result.success("所有通知已标记为已读");
        } else {
            return Result.error("操作失败");
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteNotification(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        // 验证通知属于当前用户
        Notification notification = notificationService.getNotificationById(id);
        if (notification == null || !notification.getUserId().equals(userId)) {
            return Result.error("通知不存在或无权限");
        }
        
        boolean success = notificationService.deleteNotification(id);
        if (success) {
            return Result.success("通知已删除");
        } else {
            return Result.error("删除失败");
        }
    }

    @DeleteMapping("/batch")
    public Result<String> batchDeleteNotifications(@RequestBody List<Long> notificationIds) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        // 验证所有通知都属于当前用户
        for (Long id : notificationIds) {
            Notification notification = notificationService.getNotificationById(id);
            if (notification == null || !notification.getUserId().equals(userId)) {
                return Result.error("通知不存在或无权限");
            }
        }
        
        boolean success = notificationService.batchDeleteNotifications(notificationIds);
        if (success) {
            return Result.success("批量删除成功");
        } else {
            return Result.error("批量删除失败");
        }
    }

    @GetMapping("/{id}")
    public Result<Notification> getNotificationById(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        Notification notification = notificationService.getNotificationById(id);
        if (notification == null || !notification.getUserId().equals(userId)) {
            return Result.error("通知不存在或无权限");
        }
        
        return Result.success(notification);
    }

    @GetMapping("/search")
    public Result<IPage<Notification>> searchNotifications(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        IPage<Notification> result = notificationService.searchNotifications(userId, keyword, page, size);
        return Result.success(result);
    }

    // 通知统计和设置

    @GetMapping("/stats")
    public Result<Map<String, Object>> getNotificationStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        Map<String, Object> stats = notificationService.getNotificationStats(userId);
        return Result.success(stats);
    }

    @GetMapping("/settings")
    public Result<Map<String, Object>> getNotificationSettings() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        Map<String, Object> settings = notificationService.getNotificationSettings(userId);
        return Result.success(settings);
    }

    @PutMapping("/settings")
    public Result<String> updateNotificationSettings(@RequestBody Map<String, Object> settings) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        boolean success = notificationService.updateNotificationSettings(userId, settings);
        if (success) {
            return Result.success("通知设置已更新");
        } else {
            return Result.error("更新失败");
        }
    }

    // 管理员通知功能

    @PostMapping("/admin/global")
    public Result<String> sendGlobalNotification(@RequestBody Map<String, Object> params) {
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        String type = (String) params.get("type");
        
        if (title == null || title.trim().isEmpty() || content == null || content.trim().isEmpty()) {
            return Result.error("标题和内容不能为空");
        }
        
        boolean success = notificationService.sendGlobalNotification(title, content, type);
        if (success) {
            return Result.success("全局通知发送成功");
        } else {
            return Result.error("发送失败");
        }
    }

    @PostMapping("/admin/users")
    public Result<String> sendNotificationToUsers(@RequestBody Map<String, Object> params) {
        @SuppressWarnings("unchecked")
        List<Long> userIds = (List<Long>) params.get("userIds");
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        String type = (String) params.get("type");
        
        if (userIds == null || userIds.isEmpty() || title == null || title.trim().isEmpty() || content == null || content.trim().isEmpty()) {
            return Result.error("参数不完整");
        }
        
        boolean success = notificationService.sendNotificationToUsers(userIds, title, content, type);
        if (success) {
            return Result.success("通知发送成功");
        } else {
            return Result.error("发送失败");
        }
    }

    @DeleteMapping("/admin/cleanup")
    public Result<String> cleanupExpiredNotifications(@RequestParam(defaultValue = "30") Integer days) {
        boolean success = notificationService.cleanupExpiredNotifications(days);
        if (success) {
            return Result.success("过期通知清理完成");
        } else {
            return Result.error("清理失败");
        }
    }

    @GetMapping("/admin/stats")
    public Result<Map<String, Object>> getAdminNotificationStats() {
        // 管理员可以查看全局通知统计
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalNotifications", 0); // 需要实现全局统计
        stats.put("unreadNotifications", 0);
        stats.put("activeUsers", 0);
        
        return Result.success(stats);
    }

    // 便捷通知接口（供其他服务调用）

    @PostMapping("/appointment")
    public Result<String> sendAppointmentNotification(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long appointmentId = Long.valueOf(params.get("appointmentId").toString());
        String type = (String) params.get("type");
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        
        boolean success = notificationService.sendAppointmentNotification(userId, appointmentId, type, title, content);
        return Result.success(success ? "通知发送成功" : "通知发送失败");
    }

    @PostMapping("/comment")
    public Result<String> sendCommentNotification(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long commentId = Long.valueOf(params.get("commentId").toString());
        String type = (String) params.get("type");
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        
        boolean success = notificationService.sendCommentNotification(userId, commentId, type, title, content);
        return Result.success(success ? "通知发送成功" : "通知发送失败");
    }

    @PostMapping("/favorite")
    public Result<String> sendFavoriteNotification(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long targetId = Long.valueOf(params.get("targetId").toString());
        String targetType = (String) params.get("targetType");
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        
        boolean success = notificationService.sendFavoriteNotification(userId, targetId, targetType, title, content);
        return Result.success(success ? "通知发送成功" : "通知发送失败");
    }

    @PostMapping("/system")
    public Result<String> sendSystemNotification(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        
        boolean success = notificationService.sendSystemNotification(userId, title, content);
        return Result.success(success ? "系统通知发送成功" : "系统通知发送失败");
    }

    @PostMapping("/review")
    public Result<String> sendReviewNotification(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long targetId = Long.valueOf(params.get("targetId").toString());
        String targetType = (String) params.get("targetType");
        String status = (String) params.get("status");
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        
        boolean success = notificationService.sendReviewNotification(userId, targetId, targetType, status, title, content);
        return Result.success(success ? "审核通知发送成功" : "审核通知发送失败");
    }

    @PostMapping("/like")
    public Result<String> sendLikeNotification(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long targetId = Long.valueOf(params.get("targetId").toString());
        String targetType = (String) params.get("targetType");
        String title = (String) params.get("title");
        String content = (String) params.get("content");
        
        boolean success = notificationService.sendLikeNotification(userId, targetId, targetType, title, content);
        return Result.success(success ? "点赞通知发送成功" : "点赞通知发送失败");
    }
}
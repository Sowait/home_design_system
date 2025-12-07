package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.User;
import com.homedesign.entity.Designer;
import com.homedesign.service.UserService;
import com.homedesign.service.AdminService;
import com.homedesign.service.DesignerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 管理员控制器
 * 负责用户管理和系统统计功能
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private DesignerService designerService;

    /**
     * 获取系统统计数据
     */
    @GetMapping("/dashboard/stats")
    public Result<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getSystemStats();
        return Result.success(stats);
    }

    /**
     * 获取用户列表
     */
    @GetMapping("/users")
    public Result<IPage<User>> getUserList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role) {
        
        IPage<User> result = adminService.getUserList(page, size, keyword, role);
        return Result.success(result);
    }

    /**
     * 根据ID获取用户详情
     */
    @GetMapping("/users/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/users/{id}")
    public Result<String> updateUser(@PathVariable Long id, @RequestBody User user) {
        // 获取原用户信息
        User existingUser = userService.getById(id);
        if (existingUser == null) {
            return Result.error("用户不存在");
        }
        
        // 设置更新字段
        user.setId(id);
        
        // 密码为空时不更新密码
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            user.setPassword(existingUser.getPassword());
        }
        
        boolean success = userService.updateById(user);
        if (success) {
            return Result.success("用户更新成功");
        } else {
            return Result.error("用户更新失败");
        }
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/users/{id}")
    public Result<String> deleteUser(@PathVariable Long id) {
        // 检查用户是否存在
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        // 防止删除管理员自己
        // TODO: 添加当前用户权限检查
        
        boolean success = userService.removeById(id);
        if (success) {
            return Result.success("用户删除成功");
        } else {
            return Result.error("用户删除失败");
        }
    }

    /**
     * 批量删除用户
     */
    @DeleteMapping("/users/batch")
    public Result<String> batchDeleteUsers(@RequestBody java.util.List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Result.error("请选择要删除的用户");
        }
        
        boolean success = userService.removeBatchByIds(ids);
        if (success) {
            return Result.success("批量删除成功");
        } else {
            return Result.error("批量删除失败");
        }
    }

    /**
     * 重置用户密码
     */
    @PutMapping("/users/{id}/reset-password")
    public Result<String> resetPassword(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        // 重置为默认密码或生成随机密码
        String newPassword = "123456"; // TODO: 生成随机密码
        
        user.setPassword(newPassword);
        
        boolean success = userService.updateById(user);
        if (success) {
            return Result.success("密码重置成功，新密码：" + newPassword);
        } else {
            return Result.error("密码重置失败");
        }
    }

    /**
     * 获取用户统计信息
     */
    @GetMapping("/users/stats")
    public Result<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new java.util.HashMap<>();
        
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
        queryWrapper.ge("create_time", java.time.LocalDateTime.now().toLocalDate().atStartOfDay());
        long todayUsers = userService.count(queryWrapper);
        stats.put("todayUsers", todayUsers);
        
        return Result.success(stats);
    }

    /**
     * 根据用户ID获取设计师信息
     */
    @GetMapping("/designers/user/{userId}")
    public Result<Designer> getDesignerByUserId(@PathVariable Long userId) {
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        Designer designer = designerService.getOne(queryWrapper);
        
        if (designer == null) {
            return Result.error("设计师信息不存在");
        }
        
        return Result.success(designer);
    }

    /**
     * 根据用户ID更新设计师信息
     */
    @PutMapping("/designers/user/{userId}")
    public Result<String> updateDesignerByUserId(@PathVariable Long userId, @RequestBody Designer designer) {
        // 先查找该用户对应的设计师记录
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        Designer existingDesigner = designerService.getOne(queryWrapper);
        
        if (existingDesigner == null) {
            return Result.error("设计师信息不存在");
        }
        
        // 更新设计师信息
        designer.setId(existingDesigner.getId());
        designer.setUserId(userId);
        
        boolean success = designerService.updateById(designer);
        if (success) {
            return Result.success("设计师信息更新成功");
        } else {
            return Result.error("设计师信息更新失败");
        }
    }
}
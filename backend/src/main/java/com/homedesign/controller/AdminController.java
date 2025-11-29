package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.Case;
import com.homedesign.entity.Article;
import com.homedesign.entity.Appointment;
import com.homedesign.entity.User;
import com.homedesign.service.CaseService;
import com.homedesign.service.ArticleService;
import com.homedesign.service.AppointmentService;
import com.homedesign.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CaseService caseService;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/dashboard/stats")
    public Result<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 统计数据
        stats.put("totalUsers", userService.count());
        stats.put("totalCases", caseService.count());
        stats.put("totalArticles", articleService.count());
        stats.put("totalAppointments", appointmentService.count());
        
        return Result.success(stats);
    }

    @GetMapping("/users")
    public Result<IPage<User>> getUserList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        
        Page<User> pageInfo = new Page<>(page, size);
        return Result.success(userService.getUserList(pageInfo, keyword));
    }

    @DeleteMapping("/users/{id}")
    public Result<String> deleteUser(@PathVariable Long id) {
        boolean success = userService.removeById(id);
        if (success) {
            return Result.success("用户删除成功");
        } else {
            return Result.error("用户删除失败");
        }
    }

    @GetMapping("/cases")
    public Result<IPage<Case>> getCaseList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Page<Case> pageInfo = new Page<>(page, size);
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("create_time");
        
        IPage<Case> result = caseService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @PutMapping("/cases/{id}/review")
    public Result<String> reviewCase(@PathVariable Long id, @RequestParam String status) {
        Case designCase = caseService.getById(id);
        if (designCase == null) {
            return Result.error("案例不存在");
        }
        
        designCase.setStatus(status);
        boolean success = caseService.updateById(designCase);
        
        if (success) {
            return Result.success("审核操作成功");
        } else {
            return Result.error("审核操作失败");
        }
    }

    @GetMapping("/articles")
    public Result<IPage<Article>> getArticleList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Page<Article> pageInfo = new Page<>(page, size);
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("create_time");
        
        IPage<Article> result = articleService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @PutMapping("/articles/{id}/review")
    public Result<String> reviewArticle(@PathVariable Long id, @RequestParam String status) {
        Article article = articleService.getById(id);
        if (article == null) {
            return Result.error("文章不存在");
        }
        
        article.setStatus(status);
        boolean success = articleService.updateById(article);
        
        if (success) {
            return Result.success("审核操作成功");
        } else {
            return Result.error("审核操作失败");
        }
    }

    @GetMapping("/appointments")
    public Result<IPage<Appointment>> getAppointmentList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Page<Appointment> pageInfo = new Page<>(page, size);
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("create_time");
        
        IPage<Appointment> result = appointmentService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @PutMapping("/appointments/{id}/handle")
    public Result<String> handleAppointment(@PathVariable Long id, @RequestParam String status) {
        Appointment appointment = appointmentService.getById(id);
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        
        appointment.setStatus(status);
        boolean success = appointmentService.updateById(appointment);
        
        if (success) {
            return Result.success("操作成功");
        } else {
            return Result.error("操作失败");
        }
    }
}
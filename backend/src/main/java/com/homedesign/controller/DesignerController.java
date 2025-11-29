package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.Designer;
import com.homedesign.service.DesignerService;
import com.homedesign.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designers")
@CrossOrigin(origins = "*")
public class DesignerController {

    @Autowired
    private DesignerService designerService;

    @GetMapping
    public Result<IPage<Designer>> getDesigners(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String sortBy) {
        
        Page<Designer> pageInfo = new Page<>(page, size);
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("name", keyword)
                      .or()
                      .like("title", keyword)
                      .or()
                      .like("bio", keyword);
        }
        
        if (style != null && !style.trim().isEmpty()) {
            queryWrapper.like("style", style);
        }
        
        // 设置排序
        if ("createTime".equals(sortBy)) {
            queryWrapper.orderByDesc("create_time");
        } else if ("likes".equals(sortBy)) {
            queryWrapper.orderByDesc("likes");
        } else if ("completed_cases".equals(sortBy)) {
            queryWrapper.orderByDesc("completed_cases");
        } else if ("rating".equals(sortBy)) {
            queryWrapper.orderByDesc("rating");
        } else {
            queryWrapper.orderByDesc("create_time");
        }
        
        IPage<Designer> result = designerService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Designer> getDesignerById(@PathVariable Long id) {
        Designer designer = designerService.getById(id);
        if (designer == null) {
            return Result.error("设计师不存在");
        }
        
        // 移除views字段相关逻辑，因为数据库表中没有views字段
        // designer.setViews(designer.getViews() + 1);
        // designerService.updateById(designer);
        
        return Result.success(designer);
    }

    @PostMapping("/{id}/like")
    public Result<String> likeDesigner(@PathVariable Long id) {
        Designer designer = designerService.getById(id);
        if (designer == null) {
            return Result.error("设计师不存在");
        }
        
        // 增加点赞数
        designer.setLikes(designer.getLikes() + 1);
        designerService.updateById(designer);
        
        return Result.success("点赞成功");
    }

    @PostMapping
    public Result<String> createDesigner(@RequestBody Designer designer) {
        // 设置默认值
        designer.setLikes(0);
        designer.setCompletedCases(0);
        designer.setRating(5.0);
        
        boolean success = designerService.save(designer);
        if (success) {
            return Result.success("设计师信息创建成功");
        } else {
            return Result.error("设计师信息创建失败");
        }
    }

    @GetMapping("/my")
    public Result<List<Designer>> getMyDesigners() {
        // 从SecurityContext获取当前设计师ID
        Long designerId = SecurityUtil.getCurrentUserId();
        
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", designerId);
        
        List<Designer> designers = designerService.list(queryWrapper);
        return Result.success(designers);
    }

    @GetMapping("/profile")
    public Result<Designer> getProfile() {
        // 从SecurityContext获取当前用户ID
        Long userId = SecurityUtil.getCurrentUserId();
         
        System.out.println("Current user ID: " + userId);
         
        System.out.println("Current user ID: " + userId);
         
        System.out.println("Current user ID: " + userId);
        System.out.println("Current user ID: " + userId);
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        Designer designer = designerService.getOne(queryWrapper);
        
        if (designer == null) {
            return Result.error("设计师信息不存在");
        }
        
        return Result.success(designer);
    }

    @PutMapping("/profile")
    public Result<String> updateProfile(@RequestBody Designer designer) {
        // 从SecurityContext获取当前用户ID
        Long userId = SecurityUtil.getCurrentUserId();
        
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        Designer existingDesigner = designerService.getOne(queryWrapper);
        
        if (existingDesigner == null) {
            return Result.error("设计师信息不存在");
        }
        
        designer.setId(existingDesigner.getId());
        designer.setUserId(userId);
        boolean success = designerService.updateById(designer);
        
        if (success) {
            return Result.success("个人信息更新成功");
        } else {
            return Result.error("个人信息更新失败");
        }
    }

    @GetMapping("/top")
    public Result<List<Designer>> getTopDesigners(@RequestParam(defaultValue = "8") Integer limit) {
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("likes")
                   .last("LIMIT " + limit);
        
        List<Designer> designers = designerService.list(queryWrapper);
        return Result.success(designers);
    }
}
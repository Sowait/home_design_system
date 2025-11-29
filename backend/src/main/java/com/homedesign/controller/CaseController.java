package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.Case;
import com.homedesign.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "*")
public class CaseController {

    @Autowired
    private CaseService caseService;

    @GetMapping
    public Result<IPage<Case>> getCases(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String layout,
            @RequestParam(required = false) Integer minArea,
            @RequestParam(required = false) Integer maxArea,
            @RequestParam(required = false) String sortBy) {
        
        Page<Case> pageInfo = new Page<>(page, size);
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("title", keyword)
                      .or()
                      .like("description", keyword);
        }
        
        if (style != null && !style.trim().isEmpty()) {
            queryWrapper.eq("style", style);
        }
        
        if (layout != null && !layout.trim().isEmpty()) {
            queryWrapper.eq("layout", layout);
        }
        
        if (minArea != null) {
            queryWrapper.ge("area", minArea);
        }
        
        if (maxArea != null) {
            queryWrapper.le("area", maxArea);
        }
        
        // 设置排序
        if ("createTime".equals(sortBy)) {
            queryWrapper.orderByDesc("create_time");
        } else if ("views".equals(sortBy)) {
            queryWrapper.orderByDesc("views");
        } else if ("likes".equals(sortBy)) {
            queryWrapper.orderByDesc("likes");
        } else {
            queryWrapper.orderByDesc("create_time");
        }
        
        // 只显示已审核通过的案例
        queryWrapper.eq("status", "APPROVED");
        
        IPage<Case> result = caseService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Case> getCaseById(@PathVariable Long id) {
        Case designCase = caseService.getById(id);
        if (designCase == null) {
            return Result.error("案例不存在");
        }
        
        // 增加浏览量
        designCase.setViews(designCase.getViews() + 1);
        caseService.updateById(designCase);
        
        return Result.success(designCase);
    }

    @PostMapping("/{id}/like")
    public Result<String> likeCase(@PathVariable Long id) {
        Case designCase = caseService.getById(id);
        if (designCase == null) {
            return Result.error("案例不存在");
        }
        
        // 增加点赞数
        designCase.setLikes(designCase.getLikes() + 1);
        caseService.updateById(designCase);
        
        return Result.success("点赞成功");
    }

    @GetMapping("/my")
    public Result<IPage<Case>> getMyCases(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        // 这里需要从SecurityContext获取当前用户ID
        // 暂时使用固定值，实际应该从JWT中获取
        Long designerId = 1L;
        
        Page<Case> pageInfo = new Page<>(page, size);
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("designer_id", designerId);
        queryWrapper.orderByDesc("create_time");
        
        IPage<Case> result = caseService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @PostMapping
    public Result<String> createCase(@RequestBody Case designCase) {
        // 这里需要从SecurityContext获取当前用户ID
        Long designerId = 1L;
        designCase.setDesignerId(designerId);
        designCase.setStatus("DRAFT");
        
        boolean success = caseService.save(designCase);
        if (success) {
            return Result.success("案例创建成功");
        } else {
            return Result.error("案例创建失败");
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateCase(@PathVariable Long id, @RequestBody Case designCase) {
        Case existingCase = caseService.getById(id);
        if (existingCase == null) {
            return Result.error("案例不存在");
        }
        
        // 检查是否是案例的创建者
        // 这里需要从SecurityContext获取当前用户ID进行比较
        // 暂时跳过权限检查
        
        designCase.setId(id);
        boolean success = caseService.updateById(designCase);
        if (success) {
            return Result.success("案例更新成功");
        } else {
            return Result.error("案例更新失败");
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteCase(@PathVariable Long id) {
        Case existingCase = caseService.getById(id);
        if (existingCase == null) {
            return Result.error("案例不存在");
        }
        
        // 检查是否是案例的创建者
        // 这里需要从SecurityContext获取当前用户ID进行比较
        // 暂时跳过权限检查
        
        boolean success = caseService.removeById(id);
        if (success) {
            return Result.success("案例删除成功");
        } else {
            return Result.error("案例删除失败");
        }
    }

    @PutMapping("/{id}/publish")
    public Result<String> publishCase(@PathVariable Long id) {
        Case existingCase = caseService.getById(id);
        if (existingCase == null) {
            return Result.error("案例不存在");
        }
        
        existingCase.setStatus("APPROVED");
        boolean success = caseService.updateById(existingCase);
        if (success) {
            return Result.success("案例审核通过成功");
        } else {
            return Result.error("案例审核通过失败");
        }
    }
}
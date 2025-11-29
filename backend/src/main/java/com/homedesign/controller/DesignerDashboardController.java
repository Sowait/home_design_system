package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.Case;
import com.homedesign.entity.Appointment;
import com.homedesign.service.CaseService;
import com.homedesign.service.AppointmentService;
import com.homedesign.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/designer/dashboard")
@CrossOrigin(origins = "*")
public class DesignerDashboardController {

    @Autowired
    private CaseService caseService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private com.homedesign.service.DesignerService designerService;

    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        // 从SecurityContext获取当前用户ID
        Long userId = SecurityUtil.getCurrentUserId();
        
        // 根据用户ID查找对应的设计师记录
        QueryWrapper<com.homedesign.entity.Designer> designerQuery = new QueryWrapper<>();
        designerQuery.eq("user_id", userId);
        com.homedesign.entity.Designer designer = designerService.getOne(designerQuery);
        
        if (designer == null) {
            return Result.error("您还不是认证设计师");
        }
        
        Map<String, Object> stats = new HashMap<>();
        
        // 统计数据
        QueryWrapper<Case> caseQuery = new QueryWrapper<>();
        caseQuery.eq("designer_id", designer.getId());
        stats.put("totalCases", caseService.count(caseQuery));
        
        QueryWrapper<Case> viewsQuery = new QueryWrapper<>();
        viewsQuery.eq("designer_id", designer.getId());
        List<Case> cases = caseService.list(viewsQuery);
        int totalViews = cases.stream().mapToInt(c -> c.getViews()).sum();
        int totalLikes = cases.stream().mapToInt(c -> c.getLikes()).sum();
        stats.put("totalViews", totalViews);
        stats.put("totalLikes", totalLikes);
        
        QueryWrapper<Appointment> appointmentQuery = new QueryWrapper<>();
        appointmentQuery.eq("designer_id", designer.getId());
        stats.put("totalAppointments", appointmentService.count(appointmentQuery));
        
        return Result.success(stats);
    }

    @GetMapping("/cases")
    public Result<IPage<Case>> getMyCases(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        // 从SecurityContext获取当前用户ID
        Long userId = SecurityUtil.getCurrentUserId();
        
        // 根据用户ID查找对应的设计师记录
        QueryWrapper<com.homedesign.entity.Designer> designerQuery = new QueryWrapper<>();
        designerQuery.eq("user_id", userId);
        com.homedesign.entity.Designer designer = designerService.getOne(designerQuery);
        
        if (designer == null) {
            return Result.error("您还不是认证设计师");
        }
        
        Page<Case> pageInfo = new Page<>(page, size);
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("designer_id", designer.getId());
        queryWrapper.orderByDesc("create_time");
        
        IPage<Case> result = caseService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @PostMapping("/cases")
    public Result<String> createCase(@RequestBody Case designCase) {
        // 从SecurityContext获取当前用户ID
        Long userId = SecurityUtil.getCurrentUserId();
        
        // 根据用户ID查找对应的设计师记录
        QueryWrapper<com.homedesign.entity.Designer> designerQuery = new QueryWrapper<>();
        designerQuery.eq("user_id", userId);
        com.homedesign.entity.Designer designer = designerService.getOne(designerQuery);
        
        if (designer == null) {
            return Result.error("您还不是认证设计师，无法创建案例");
        }
        
        designCase.setDesignerId(designer.getId());
        designCase.setDesignerName(designer.getName());
        designCase.setStatus("APPROVED");
        designCase.setDeleted(0);
        
        boolean success = caseService.save(designCase);
        if (success) {
            return Result.success("案例创建成功");
        } else {
            return Result.error("案例创建失败");
        }
    }

    @PutMapping("/cases/{id}")
    public Result<String> updateCase(@PathVariable Long id, @RequestBody Case designCase) {
        Case existingCase = caseService.getById(id);
        if (existingCase == null) {
            return Result.error("案例不存在");
        }
      
        
        // 保持原有字段值不变
        designCase.setId(id);
        designCase.setDesignerId(existingCase.getDesignerId());
        designCase.setDesignerName(existingCase.getDesignerName());
        designCase.setDeleted(existingCase.getDeleted());
        designCase.setCreateTime(existingCase.getCreateTime());
        
        // 设置更新时间
        designCase.setUpdateTime(null); // 让MyBatis-Plus自动更新
        
        boolean success = caseService.updateById(designCase);
        if (success) {
            return Result.success("案例更新成功");
        } else {
            return Result.error("案例更新失败");
        }
    }

    @DeleteMapping("/cases/{id}")
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

    @PutMapping("/cases/{id}/publish")
    public Result<String> publishCase(@PathVariable Long id) {
        Case existingCase = caseService.getById(id);
        if (existingCase == null) {
            return Result.error("案例不存在");
        }
        
        existingCase.setStatus("APPROVED");
        boolean success = caseService.updateById(existingCase);
        if (success) {
            return Result.success("案例发布成功");
        } else {
            return Result.error("案例发布失败");
        }
    }

    @GetMapping("/appointments")
    public Result<IPage<Appointment>> getMyAppointments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        // 从SecurityContext获取当前用户ID
        Long userId = SecurityUtil.getCurrentUserId();
        
        // 根据用户ID查找对应的设计师记录
        QueryWrapper<com.homedesign.entity.Designer> designerQuery = new QueryWrapper<>();
        designerQuery.eq("user_id", userId);
        com.homedesign.entity.Designer designer = designerService.getOne(designerQuery);
        
        if (designer == null) {
            return Result.error("您还不是认证设计师");
        }
        
        Page<Appointment> pageInfo = new Page<>(page, size);
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("designer_id", designer.getId());
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
        
        // 从SecurityContext获取当前用户ID
        Long userId = SecurityUtil.getCurrentUserId();
        
        // 根据用户ID查找对应的设计师记录
        QueryWrapper<com.homedesign.entity.Designer> designerQuery = new QueryWrapper<>();
        designerQuery.eq("user_id", userId);
        com.homedesign.entity.Designer designer = designerService.getOne(designerQuery);
        
        if (designer == null) {
            return Result.error("您还不是认证设计师");
        }
        
        // 检查是否是指定的设计师
        if (!designer.getId().equals(appointment.getDesignerId())) {
            return Result.error("无权限处理此预约");
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
package com.homedesign.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.homedesign.common.Result;
import com.homedesign.entity.Appointment;
import com.homedesign.service.AppointmentService;
import com.homedesign.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @PostMapping
    public Result<Appointment> createAppointment(@RequestBody Appointment appointment) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        appointment.setUserId(userId);
        
        // 检查时间冲突
        if (appointmentService.checkTimeConflict(appointment.getDesignerId(), appointment.getAppointmentTime())) {
            return Result.error("该时间段已被预约，请选择其他时间");
        }
        
        Appointment createdAppointment = appointmentService.createAppointment(appointment);
        return Result.success(createdAppointment);
    }

    @GetMapping("/my")
    public Result<IPage<Appointment>> getMyAppointments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String status) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        IPage<Appointment> result = appointmentService.getUserAppointments(userId, page, size, status);
        return Result.success(result);
    }

    @GetMapping("/designer")
    public Result<IPage<Appointment>> getDesignerAppointments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String status) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long designerId = userService.findByUsername(username).getId();
        
        IPage<Appointment> result = appointmentService.getDesignerAppointments(designerId, page, size, status);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Appointment> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentService.getById(id);
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        
        // 解析description字段，提取结构化数据
        //appointmentService.parseDescriptionToFields(appointment);
        
        return Result.success(appointment);
    }

    @PutMapping("/{id}/cancel")
    public Result<String> cancelAppointment(
            @PathVariable Long id, 
            @RequestBody(required = false) Map<String, String> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        Appointment appointment = appointmentService.getById(id);
        
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        
        if (!appointment.getUserId().equals(userId)) {
            return Result.error("无权限取消此预约");
        }
        
        String reason = params != null ? params.get("reason") : "用户取消";
        boolean success = appointmentService.cancelAppointment(id, reason);
        
        if (success) {
            return Result.success("预约已取消");
        } else {
            return Result.error("取消预约失败");
        }
    }

    @PutMapping("/{id}/confirm")
    public Result<String> confirmAppointment(
            @PathVariable Long id, 
            @RequestBody(required = false) Map<String, String> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long designerId = userService.findByUsername(username).getId();
        Appointment appointment = appointmentService.getById(id);
        
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        
        if (!appointment.getDesignerId().equals(designerId)) {
            return Result.error("无权限确认此预约");
        }
        
        String note = params != null ? params.get("note") : "设计师确认";
        boolean success = appointmentService.confirmAppointment(id, note);
        
        if (success) {
            return Result.success("预约已确认");
        } else {
            return Result.error("确认预约失败");
        }
    }

    @PutMapping("/{id}/reject")
    public Result<String> rejectAppointment(
            @PathVariable Long id, 
            @RequestBody Map<String, String> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long designerId = userService.findByUsername(username).getId();
        Appointment appointment = appointmentService.getById(id);
        
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        
        if (!appointment.getDesignerId().equals(designerId)) {
            return Result.error("无权限拒绝此预约");
        }
        
        String reason = params.get("reason");
        if (reason == null || reason.trim().isEmpty()) {
            return Result.error("拒绝原因不能为空");
        }
        
        boolean success = appointmentService.rejectAppointment(id, reason);
        
        if (success) {
            return Result.success("预约已拒绝");
        } else {
            return Result.error("拒绝预约失败");
        }
    }

    @PutMapping("/{id}/complete")
    public Result<String> completeAppointment(
            @PathVariable Long id, 
            @RequestBody(required = false) Map<String, String> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long designerId = userService.findByUsername(username).getId();
        Appointment appointment = appointmentService.getById(id);
        
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        
        if (!appointment.getDesignerId().equals(designerId)) {
            return Result.error("无权限完成此预约");
        }
        
        String feedback = params != null ? params.get("feedback") : "预约完成";
        boolean success = appointmentService.completeAppointment(id, feedback);
        
        if (success) {
            return Result.success("预约已完成");
        } else {
            return Result.error("完成预约失败");
        }
    }

    @GetMapping("/{id}/history")
    public Result<List<Map<String, Object>>> getAppointmentHistory(@PathVariable Long id) {
        List<Map<String, Object>> history = appointmentService.getAppointmentHistory(id);
        return Result.success(history);
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> getAppointmentStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        // 获取用户角色
        String role = "USER"; // 这里应该从用户信息中获取实际角色
        
        Map<String, Object> stats = appointmentService.getAppointmentStats(userId, role);
        return Result.success(stats);
    }

    @PutMapping("/batch-update")
    public Result<String> batchUpdateStatus(@RequestBody Map<String, Object> params) {
        @SuppressWarnings("unchecked")
        List<Long> appointmentIds = (List<Long>) params.get("appointmentIds");
        String status = (String) params.get("status");
        
        boolean success = appointmentService.batchUpdateStatus(appointmentIds, status);
        
        if (success) {
            return Result.success("批量更新成功");
        } else {
            return Result.error("批量更新失败");
        }
    }

    @GetMapping("/admin")
    public Result<IPage<Appointment>> getAllAppointments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String status) {
        
        IPage<Appointment> result = appointmentService.getUserAppointments(null, page, size, status);
        return Result.success(result);
    }
}
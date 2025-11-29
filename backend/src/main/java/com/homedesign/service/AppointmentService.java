package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.homedesign.entity.Appointment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AppointmentService extends IService<Appointment> {
    
    // 创建预约
    Appointment createAppointment(Appointment appointment);
    
    // 预约状态流转
    boolean updateAppointmentStatus(Long appointmentId, String newStatus, String reason);
    
    // 确认预约
    boolean confirmAppointment(Long appointmentId, String note);
    
    // 拒绝预约
    boolean rejectAppointment(Long appointmentId, String reason);
    
    // 完成预约
    boolean completeAppointment(Long appointmentId, String feedback);
    
    // 取消预约
    boolean cancelAppointment(Long appointmentId, String reason);
    
    // 获取用户的预约列表
    IPage<Appointment> getUserAppointments(Long userId, Integer page, Integer size, String status);
    
    // 获取设计师的预约列表
    IPage<Appointment> getDesignerAppointments(Long designerId, Integer page, Integer size, String status);
    
    // 获取预约历史记录
    List<Map<String, Object>> getAppointmentHistory(Long appointmentId);
    
    // 检查时间冲突
    boolean checkTimeConflict(Long designerId, LocalDateTime appointmentTime);
    
    // 获取预约统计
    Map<String, Object> getAppointmentStats(Long userId, String role);
    
    // 批量更新预约状态
    boolean batchUpdateStatus(List<Long> appointmentIds, String status);
    
    void parseDescriptionToFields(Appointment appointment);
}
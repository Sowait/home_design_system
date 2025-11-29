package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.Appointment;
import com.homedesign.entity.Designer;
import com.homedesign.entity.User;
import com.homedesign.mapper.AppointmentMapper;
import com.homedesign.service.AppointmentService;
import com.homedesign.service.DesignerService;
import com.homedesign.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AppointmentServiceImpl extends ServiceImpl<AppointmentMapper, Appointment> implements AppointmentService {

    @Autowired
    private UserService userService;

    @Autowired
    private DesignerService designerService;

    @Override
    public Appointment createAppointment(Appointment appointment) {
        // 设置用户和设计师信息
        User user = userService.getById(appointment.getUserId());
        if (user != null) {
            appointment.setUserName(user.getUsername());
        }
        
        Designer designer = designerService.getById(appointment.getDesignerId());
        if (designer != null) {
            appointment.setDesignerName(designer.getName());
        }
        
        // 将额外字段信息合并到description中保存
        StringBuilder descriptionBuilder = new StringBuilder();
        if (appointment.getDescription() != null) {
            descriptionBuilder.append(appointment.getDescription());
        }
        
        // 添加额外信息到描述中
        if (appointment.getStyle() != null) {
            if (descriptionBuilder.length() > 0) descriptionBuilder.append("\n");
            descriptionBuilder.append("装修风格：").append(appointment.getStyle());
        }
        
        if (appointment.getAddress() != null) {
            if (descriptionBuilder.length() > 0) descriptionBuilder.append("\n");
            descriptionBuilder.append("装修地址：").append(appointment.getAddress());
        }
        
        if (appointment.getArea() != null) {
            if (descriptionBuilder.length() > 0) descriptionBuilder.append("\n");
            descriptionBuilder.append("房屋面积：").append(appointment.getArea()).append("m²");
        }
        
        if (appointment.getRemarks() != null) {
            if (descriptionBuilder.length() > 0) descriptionBuilder.append("\n");
            descriptionBuilder.append("备注：").append(appointment.getRemarks());
        }
        
        appointment.setDescription(descriptionBuilder.toString());
        
        // 设置初始状态和时间
        appointment.setStatus("PENDING");
        appointment.setCreateTime(LocalDateTime.now());
        appointment.setUpdateTime(LocalDateTime.now());
        appointment.setDeleted(0); // 设置逻辑删除默认值
        
        save(appointment);
        return appointment;
    }

    @Override
    public boolean updateAppointmentStatus(Long appointmentId, String newStatus, String reason) {
        Appointment appointment = getById(appointmentId);
        if (appointment == null) {
            throw new RuntimeException("预约不存在");
        }
        
        // 状态流转验证
        if (!isValidStatusTransition(appointment.getStatus(), newStatus)) {
            throw new RuntimeException("无效的状态流转: " + appointment.getStatus() + " -> " + newStatus);
        }
        
        appointment.setStatus(newStatus);
        appointment.setUpdateTime(LocalDateTime.now());
        
        boolean result = updateById(appointment);
        
        // 这里可以添加通知逻辑
        // sendAppointmentStatusNotification(appointment, newStatus, reason);
        
        return result;
    }

    @Override
    public boolean confirmAppointment(Long appointmentId, String note) {
        return updateAppointmentStatus(appointmentId, "CONFIRMED", note);
    }

    @Override
    public boolean rejectAppointment(Long appointmentId, String reason) {
        return updateAppointmentStatus(appointmentId, "REJECTED", reason);
    }

    @Override
    public boolean completeAppointment(Long appointmentId, String feedback) {
        return updateAppointmentStatus(appointmentId, "COMPLETED", feedback);
    }

    @Override
    public boolean cancelAppointment(Long appointmentId, String reason) {
        return updateAppointmentStatus(appointmentId, "CANCELLED", reason);
    }

    @Override
    public IPage<Appointment> getUserAppointments(Long userId, Integer page, Integer size, String status) {
        Page<Appointment> pageInfo = new Page<>(page, size);
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        
        queryWrapper.eq("user_id", userId);
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("create_time");
        
        IPage<Appointment> result = page(pageInfo, queryWrapper);
        
        // 解析description字段，提取结构化数据
        for (Appointment appointment : result.getRecords()) {
            parseDescriptionToFields(appointment);
        }
        
        return result;
    }

    @Override
    public IPage<Appointment> getDesignerAppointments(Long designerId, Integer page, Integer size, String status) {
        Page<Appointment> pageInfo = new Page<>(page, size);
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        
        queryWrapper.eq("designer_id", designerId);
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("create_time");
        
        IPage<Appointment> result = page(pageInfo, queryWrapper);
        
        // 解析description字段，提取结构化数据
        for (Appointment appointment : result.getRecords()) {
            parseDescriptionToFields(appointment);
        }
        
        return result;
    }

    @Override
    public List<Map<String, Object>> getAppointmentHistory(Long appointmentId) {
        // 这里应该从专门的预约历史表查询
        // 暂时返回基本信息
        Appointment appointment = getById(appointmentId);
        if (appointment == null) {
            return new ArrayList<>();
        }
        
        List<Map<String, Object>> history = new ArrayList<>();
        Map<String, Object> record = new HashMap<>();
        record.put("appointmentId", appointment.getId());
        record.put("status", appointment.getStatus());
        record.put("updateTime", appointment.getUpdateTime());
        record.put("operator", "System");
        history.add(record);
        
        return history;
    }

    @Override
    public boolean checkTimeConflict(Long designerId, LocalDateTime appointmentTime) {
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("designer_id", designerId)
                   .eq("status", "CONFIRMED")
                   .eq("appointment_time", appointmentTime);
        
        return count(queryWrapper) > 0;
    }

    @Override
    public Map<String, Object> getAppointmentStats(Long userId, String role) {
        Map<String, Object> stats = new HashMap<>();
        
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        
        if ("USER".equals(role)) {
            queryWrapper.eq("user_id", userId);
        } else if ("DESIGNER".equals(role)) {
            queryWrapper.eq("designer_id", userId);
        }
        
        // 总预约数
        stats.put("total", count(queryWrapper));
        
        // 各状态统计
        stats.put("pending", count(new QueryWrapper<Appointment>().eq("user_id", userId).eq("status", "PENDING")));
        stats.put("confirmed", count(new QueryWrapper<Appointment>().eq("user_id", userId).eq("status", "CONFIRMED")));
        stats.put("completed", count(new QueryWrapper<Appointment>().eq("user_id", userId).eq("status", "COMPLETED")));
        stats.put("cancelled", count(new QueryWrapper<Appointment>().eq("user_id", userId).eq("status", "CANCELLED")));
        stats.put("rejected", count(new QueryWrapper<Appointment>().eq("user_id", userId).eq("status", "REJECTED")));
        
        // 本月统计
        LocalDateTime thisMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        QueryWrapper<Appointment> thisMonthQuery = new QueryWrapper<Appointment>().eq("user_id", userId).ge("create_time", thisMonth);
        stats.put("thisMonth", count(thisMonthQuery));
        
        return stats;
    }

    @Override
    public boolean batchUpdateStatus(List<Long> appointmentIds, String status) {
        if (appointmentIds == null || appointmentIds.isEmpty()) {
            return false;
        }
        
        List<Appointment> appointments = listByIds(appointmentIds);
        for (Appointment appointment : appointments) {
            if (!isValidStatusTransition(appointment.getStatus(), status)) {
                throw new RuntimeException("预约 " + appointment.getId() + " 状态流转无效");
            }
            appointment.setStatus(status);
            appointment.setUpdateTime(LocalDateTime.now());
        }
        
        return updateBatchById(appointments);
    }

    /**
     * 验证状态流转是否合法
     */
    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        // 定义允许的状态流转
        Map<String, List<String>> allowedTransitions = new HashMap<>();
        allowedTransitions.put("PENDING", Arrays.asList("CONFIRMED", "REJECTED", "CANCELLED"));
        allowedTransitions.put("CONFIRMED", Arrays.asList("COMPLETED", "CANCELLED"));
        allowedTransitions.put("COMPLETED", new ArrayList<>()); // 终态
        allowedTransitions.put("CANCELLED", new ArrayList<>());  // 终态
        allowedTransitions.put("REJECTED", new ArrayList<>());   // 终态
        
        List<String> allowedNewStatuses = allowedTransitions.get(currentStatus);
        return allowedNewStatuses != null && allowedNewStatuses.contains(newStatus);
    }
    
    /**
     * 解析description字段，提取结构化数据到对应字段
     */
    public void parseDescriptionToFields(Appointment appointment) {
        if (appointment.getDescription() == null) {
            return;
        }
        
        String description = appointment.getDescription();
        String[] lines = description.split("\n");
        
        // 提取原始需求描述（第一行或非结构化部分）
        StringBuilder originalDescription = new StringBuilder();
        boolean foundStructuredData = false;
        
        for (String line : lines) {
            line = line.trim();
            if (line.startsWith("装修风格：")) {
                appointment.setStyle(line.substring("装修风格：".length()));
                foundStructuredData = true;
            } else if (line.startsWith("装修地址：")) {
                appointment.setAddress(line.substring("装修地址：".length()));
                foundStructuredData = true;
            } else if (line.startsWith("房屋面积：")) {
                String areaStr = line.substring("房屋面积：".length());
                // 去掉"m²"单位
                if (areaStr.endsWith("m²")) {
                    areaStr = areaStr.substring(0, areaStr.length() - 2);
                }
                appointment.setArea(areaStr);
                foundStructuredData = true;
            } else if (line.startsWith("备注：")) {
                appointment.setRemarks(line.substring("备注：".length()));
                foundStructuredData = true;
            } else if (foundStructuredData) {
                // 如果已经找到结构化数据，这行可能是原始描述的后续部分
                if (originalDescription.length() > 0) {
                    originalDescription.append("\n");
                }
                originalDescription.append(line);
            } else {
                // 还没找到结构化数据，这行是原始描述的一部分
                if (originalDescription.length() > 0) {
                    originalDescription.append("\n");
                }
                originalDescription.append(line);
            }
        }
        
        // 设置原始需求描述（如果有结构化数据，则只保留非结构化部分）
        if (foundStructuredData && originalDescription.length() > 0) {
            appointment.setDescription(originalDescription.toString());
        }
        // 如果没有结构化数据，保持原description不变
    }
}
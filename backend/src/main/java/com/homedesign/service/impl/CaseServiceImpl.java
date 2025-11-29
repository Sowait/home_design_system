package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.Case;
import com.homedesign.mapper.CaseMapper;
import com.homedesign.service.CaseService;
import com.homedesign.service.DesignerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CaseServiceImpl extends ServiceImpl<CaseMapper, Case> implements CaseService {

    @Autowired
    private DesignerService designerService;

    @Override
    public boolean publishCase(Long caseId) {
        Case designCase = getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        designCase.setStatus("APPROVED");
        // 移除publishTime设置，因为数据库表中没有这个字段
        designCase.setUpdateTime(LocalDateTime.now());
        
        return updateById(designCase);
    }

    @Override
    public boolean unpublishCase(Long caseId) {
        Case designCase = getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        designCase.setStatus("DRAFT");
        designCase.setUpdateTime(LocalDateTime.now());
        
        return updateById(designCase);
    }

    @Override
    public boolean likeCase(Long caseId) {
        Case designCase = getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        designCase.setLikes(designCase.getLikes() + 1);
        designCase.setUpdateTime(LocalDateTime.now());
        
        return updateById(designCase);
    }

    @Override
    public boolean unlikeCase(Long caseId) {
        Case designCase = getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        if (designCase.getLikes() > 0) {
            designCase.setLikes(designCase.getLikes() - 1);
            designCase.setUpdateTime(LocalDateTime.now());
        }
        
        return updateById(designCase);
    }

    @Override
    public boolean increaseViews(Long caseId) {
        Case designCase = getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        designCase.setViews(designCase.getViews() + 1);
        designCase.setUpdateTime(LocalDateTime.now());
        
        return updateById(designCase);
    }

    @Override
    public IPage<Case> getDesignerCases(Long designerId, Integer page, Integer size, String status) {
        Page<Case> pageInfo = new Page<>(page, size);
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("designer_id", designerId);
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("create_time");
        
        return page(pageInfo, queryWrapper);
    }

    @Override
    public IPage<Case> getPublishedCases(Integer page, Integer size, String style, String layout) {
        Page<Case> pageInfo = new Page<>(page, size);
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "APPROVED");
        if (style != null && !style.isEmpty()) {
            queryWrapper.eq("style", style);
        }
        if (layout != null && !layout.isEmpty()) {
            queryWrapper.eq("layout", layout);
        }
        queryWrapper.orderByDesc("create_time"); // 改为create_time，因为数据库中没有publish_time字段
        
        return page(pageInfo, queryWrapper);
    }

    @Override
    public boolean updateCaseStatus(Long caseId, String status) {
        Case designCase = getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        designCase.setStatus(status);
        designCase.setUpdateTime(LocalDateTime.now());
        
        return updateById(designCase);
    }

    @Override
    public boolean createCase(Case designCase) {
        // 验证设计师是否存在
        if (designerService.getById(designCase.getDesignerId()) == null) {
            throw new RuntimeException("设计师不存在");
        }
        
        // 设置默认状态和时间
        if (designCase.getStatus() == null) {
            designCase.setStatus("DRAFT");
        }
        designCase.setCreateTime(LocalDateTime.now());
        designCase.setUpdateTime(LocalDateTime.now());
        
        // 设置默认值
        if (designCase.getViews() == null) {
            designCase.setViews(0);
        }
        if (designCase.getLikes() == null) {
            designCase.setLikes(0);
        }
        
        return save(designCase);
    }

    @Override
    public boolean updateCase(Case designCase) {
        Case existingCase = getById(designCase.getId());
        if (existingCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        // 更新时间
        designCase.setUpdateTime(LocalDateTime.now());
        
        // 保持创建时间不变
        designCase.setCreateTime(existingCase.getCreateTime());
        // 移除publishTime设置，因为数据库表中没有这个字段
        
        return updateById(designCase);
    }

    @Override
    public boolean deleteCase(Long caseId) {
        Case designCase = getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        return removeById(caseId);
    }
}
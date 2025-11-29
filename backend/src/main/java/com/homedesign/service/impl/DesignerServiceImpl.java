package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.Designer;
import com.homedesign.mapper.DesignerMapper;
import com.homedesign.service.DesignerService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DesignerServiceImpl extends ServiceImpl<DesignerMapper, Designer> implements DesignerService {

    @Override
    public Designer getDesignerDetail(Long id) {
        Designer designer = getById(id);
        if (designer != null) {
            // 增加浏览次数
            designer.setUpdateTime(LocalDateTime.now());
            updateById(designer);
        }
        return designer;
    }

    @Override
    public boolean updateDesignerProfile(Long id, Designer designer) {
        Designer existingDesigner = getById(id);
        if (existingDesigner == null) {
            return false;
        }
        
        designer.setId(id);
        designer.setUpdateTime(LocalDateTime.now());
        return updateById(designer);
    }

    @Override
    public boolean likeDesigner(Long id) {
        Designer designer = getById(id);
        if (designer == null) {
            return false;
        }
        
        designer.setLikes(designer.getLikes() + 1);
        designer.setUpdateTime(LocalDateTime.now());
        return updateById(designer);
    }

    @Override
    public IPage<Designer> getTopDesigners(Integer page, Integer size) {
        Page<Designer> pageInfo = new Page<>(page != null ? page : 1, size != null ? size : 10);
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "ACTIVE")
                   .orderByDesc("rating")
                   .orderByDesc("likes")
                   .orderByDesc("completed_cases");
        
        return page(pageInfo, queryWrapper);
    }

    @Override
    public Designer getMyDesignerInfo(Long userId) {
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.orderByDesc("create_time");
        queryWrapper.last("LIMIT 1");
        return getOne(queryWrapper);
    }

    @Override
    public Map<String, Object> getDesignerStats(Long designerId) {
        Designer designer = getById(designerId);
        if (designer == null) {
            return new HashMap<>();
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("views", 41);
        stats.put("likes", designer.getLikes());
        stats.put("completedCases", designer.getCompletedCases());
        stats.put("rating", designer.getRating());
        stats.put("experience", designer.getExperience());
        
        return stats;
    }

    @Override
    public boolean updateDesignerStatus(Long id, String status) {
        Designer designer = getById(id);
        if (designer == null) {
            return false;
        }
        
        designer.setUpdateTime(LocalDateTime.now());
        return updateById(designer);
    }

    @Override
    public boolean verifyDesigner(Long id) {
        return updateDesignerStatus(id, "VERIFIED");
    }
}
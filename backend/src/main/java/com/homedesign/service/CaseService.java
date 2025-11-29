package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.homedesign.entity.Case;

public interface CaseService extends IService<Case> {
    
    // 发布案例
    boolean publishCase(Long caseId);
    
    // 取消发布案例
    boolean unpublishCase(Long caseId);
    
    // 点赞案例
    boolean likeCase(Long caseId);
    
    // 取消点赞
    boolean unlikeCase(Long caseId);
    
    // 增加浏览量
    boolean increaseViews(Long caseId);
    
    // 获取设计师案例列表
    IPage<Case> getDesignerCases(Long designerId, Integer page, Integer size, String status);
    
    // 获取已发布案例列表
    IPage<Case> getPublishedCases(Integer page, Integer size, String style, String layout);
    
    // 更新案例状态
    boolean updateCaseStatus(Long caseId, String status);
    
    // 创建案例
    boolean createCase(Case designCase);
    
    // 更新案例
    boolean updateCase(Case designCase);
    
    // 删除案例
    boolean deleteCase(Long caseId);
}
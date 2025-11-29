package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.homedesign.entity.Designer;

import java.util.Map;

public interface DesignerService extends IService<Designer> {
    
    /**
     * 获取设计师详情
     */
    Designer getDesignerDetail(Long id);
    
    /**
     * 更新设计师资料
     */
    boolean updateDesignerProfile(Long id, Designer designer);
    
    /**
     * 点赞设计师
     */
    boolean likeDesigner(Long id);
    
    /**
     * 获取热门设计师
     */
    IPage<Designer> getTopDesigners(Integer page, Integer size);
    
    /**
     * 获取我的设计师信息
     */
    Designer getMyDesignerInfo(Long userId);
    
    /**
     * 获取设计师统计信息
     */
    Map<String, Object> getDesignerStats(Long designerId);
    
    /**
     * 更新设计师状态
     */
    boolean updateDesignerStatus(Long id, String status);
    
    /**
     * 验证设计师资质
     */
    boolean verifyDesigner(Long id);
}
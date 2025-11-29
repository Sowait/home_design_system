package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.entity.*;

import java.util.List;
import java.util.Map;

/**
 * 搜索服务接口
 */
public interface SearchService {
    
    /**
     * 综合搜索
     */
    Map<String, Object> searchAll(String keyword, Integer page, Integer size, Long userId);
    
    /**
     * 搜索案例
     */
    IPage<Case> searchCases(String keyword, String style, Integer page, Integer size);
    
    /**
     * 搜索设计师
     */
    IPage<Designer> searchDesigners(String keyword, String style, Integer page, Integer size);
    
    /**
     * 搜索文章
     */
    IPage<Article> searchArticles(String keyword, String category, Integer page, Integer size);
    
    /**
     * 获取搜索历史
     */
    List<SearchHistory> getSearchHistory(Long userId);
    
    /**
     * 清除搜索历史
     */
    boolean clearSearchHistory(Long userId);
    
    /**
     * 记录搜索历史
     */
    void recordSearchHistory(String keyword, String searchType);
    
    /**
     * 获取搜索建议
     */
    List<String> getSearchSuggestions(String keyword);
    
    /**
     * 获取热门关键词
     */
    List<String> getHotKeywords();
    
    /**
     * 搜索统计分析
     */
    Map<String, Object> getSearchAnalytics();
    
    /**
     * 获取搜索统计
     */
    Map<String, Object> getSearchStats();
}
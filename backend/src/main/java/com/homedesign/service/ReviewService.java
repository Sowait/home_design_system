package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.entity.Case;
import com.homedesign.entity.Article;

import java.util.List;
import java.util.Map;

public interface ReviewService {
    
    // 案例审核相关
    
    // 提交案例审核
    boolean submitCaseForReview(Long caseId);
    
    // 审核案例
    boolean reviewCase(Long caseId, String status, String reviewComment, Long reviewerId);
    
    // 获取待审核案例列表
    IPage<Case> getPendingCases(Integer page, Integer size);
    
    // 获取案例审核历史
    List<Map<String, Object>> getCaseReviewHistory(Long caseId);
    
    // 批量审核案例
    boolean batchReviewCases(List<Long> caseIds, String status, String reviewComment, Long reviewerId);
    
    // 文章审核相关
    
    // 提交文章审核
    boolean submitArticleForReview(Long articleId);
    
    // 审核文章
    boolean reviewArticle(Long articleId, String status, String reviewComment, Long reviewerId);
    
    // 获取待审核文章列表
    IPage<Article> getPendingArticles(Integer page, Integer size);
    
    // 获取文章审核历史
    List<Map<String, Object>> getArticleReviewHistory(Long articleId);
    
    // 批量审核文章
    boolean batchReviewArticles(List<Long> articleIds, String status, String reviewComment, Long reviewerId);
    
    // 审核统计
    
    // 获取审核统计
    Map<String, Object> getReviewStats();
    
    // 获取审核员工作量统计
    Map<String, Object> getReviewerStats(Long reviewerId);
    
    // 审核通知相关
    
    // 发送审核通知
    boolean sendReviewNotification(Long contentId, String contentType, String status, String reviewComment);
    
    // 自动审核规则
    
    // 自动审核案例
    boolean autoReviewCase(Long caseId);
    
    // 自动审核文章
    boolean autoReviewArticle(Long articleId);
}
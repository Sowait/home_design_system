package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.entity.Case;
import com.homedesign.entity.Article;
import com.homedesign.service.CaseService;
import com.homedesign.service.ArticleService;
import com.homedesign.service.UserService;
import com.homedesign.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private CaseService caseService;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private UserService userService;

    @Override
    public boolean submitCaseForReview(Long caseId) {
        Case designCase = caseService.getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        designCase.setStatus("PENDING_REVIEW");
        designCase.setUpdateTime(LocalDateTime.now());
        
        boolean result = caseService.updateById(designCase);
        
        // 发送提交审核通知
        if (result) {
            sendReviewNotification(caseId, "CASE", "PENDING_REVIEW", "案例已提交审核");
        }
        
        return result;
    }

    @Override
    public boolean reviewCase(Long caseId, String status, String reviewComment, Long reviewerId) {
        Case designCase = caseService.getById(caseId);
        if (designCase == null) {
            throw new RuntimeException("案例不存在");
        }
        
        if (!isValidReviewStatus(status)) {
            throw new RuntimeException("无效的审核状态: " + status);
        }
        
        // 记录审核历史
        recordReviewHistory(caseId, "CASE", status, reviewComment, reviewerId);
        
        designCase.setStatus(status);
        designCase.setUpdateTime(LocalDateTime.now());
        
        boolean result = caseService.updateById(designCase);
        
        // 发送审核结果通知
        if (result) {
            String notificationMessage = generateReviewNotificationMessage(status, reviewComment);
            sendReviewNotification(caseId, "CASE", status, notificationMessage);
        }
        
        return result;
    }

    @Override
    public IPage<Case> getPendingCases(Integer page, Integer size) {
        Page<Case> pageInfo = new Page<>(page, size);
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "PENDING_REVIEW")
                   .orderByDesc("create_time");
        
        return caseService.page(pageInfo, queryWrapper);
    }

    @Override
    public List<Map<String, Object>> getCaseReviewHistory(Long caseId) {
        // 这里应该从专门的审核历史表查询
        // 暂时返回基本信息
        Case designCase = caseService.getById(caseId);
        if (designCase == null) {
            return new ArrayList<>();
        }
        
        List<Map<String, Object>> history = new ArrayList<>();
        Map<String, Object> record = new HashMap<>();
        record.put("contentId", caseId);
        record.put("contentType", "CASE");
        record.put("status", designCase.getStatus());
        record.put("updateTime", designCase.getUpdateTime());
        record.put("reviewer", "System");
        history.add(record);
        
        return history;
    }

    @Override
    public boolean batchReviewCases(List<Long> caseIds, String status, String reviewComment, Long reviewerId) {
        if (caseIds == null || caseIds.isEmpty()) {
            return false;
        }
        
        List<Case> cases = caseService.listByIds(caseIds);
        for (Case designCase : cases) {
            if (!isValidReviewStatus(status)) {
                throw new RuntimeException("无效的审核状态: " + status);
            }
            
            // 记录审核历史
            recordReviewHistory(designCase.getId(), "CASE", status, reviewComment, reviewerId);
            
            designCase.setStatus(status);
            designCase.setUpdateTime(LocalDateTime.now());
        }
        
        boolean result = caseService.updateBatchById(cases);
        
        // 发送批量审核通知
        if (result) {
            for (Case designCase : cases) {
                String notificationMessage = generateReviewNotificationMessage(status, reviewComment);
                sendReviewNotification(designCase.getId(), "CASE", status, notificationMessage);
            }
        }
        
        return result;
    }

    @Override
    public boolean submitArticleForReview(Long articleId) {
        Article article = articleService.getById(articleId);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        
        article.setStatus("PENDING_REVIEW");
        article.setUpdateTime(LocalDateTime.now());
        
        boolean result = articleService.updateById(article);
        
        // 发送提交审核通知
        if (result) {
            sendReviewNotification(articleId, "ARTICLE", "PENDING_REVIEW", "文章已提交审核");
        }
        
        return result;
    }

    @Override
    public boolean reviewArticle(Long articleId, String status, String reviewComment, Long reviewerId) {
        Article article = articleService.getById(articleId);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        
        if (!isValidReviewStatus(status)) {
            throw new RuntimeException("无效的审核状态: " + status);
        }
        
        // 记录审核历史
        recordReviewHistory(articleId, "ARTICLE", status, reviewComment, reviewerId);
        
        article.setStatus(status);
        article.setUpdateTime(LocalDateTime.now());
        
        // 如果审核通过，设置发布时间
        if ("APPROVED".equals(status) && article.getPublishTime() == null) {
            article.setPublishTime(LocalDateTime.now());
        }
        
        boolean result = articleService.updateById(article);
        
        // 发送审核结果通知
        if (result) {
            String notificationMessage = generateReviewNotificationMessage(status, reviewComment);
            sendReviewNotification(articleId, "ARTICLE", status, notificationMessage);
        }
        
        return result;
    }

    @Override
    public IPage<Article> getPendingArticles(Integer page, Integer size) {
        Page<Article> pageInfo = new Page<>(page, size);
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "PENDING_REVIEW")
                   .orderByDesc("create_time");
        
        return articleService.page(pageInfo, queryWrapper);
    }

    @Override
    public List<Map<String, Object>> getArticleReviewHistory(Long articleId) {
        Article article = articleService.getById(articleId);
        if (article == null) {
            return new ArrayList<>();
        }
        
        List<Map<String, Object>> history = new ArrayList<>();
        Map<String, Object> record = new HashMap<>();
        record.put("contentId", articleId);
        record.put("contentType", "ARTICLE");
        record.put("status", article.getStatus());
        record.put("updateTime", article.getUpdateTime());
        record.put("reviewer", "System");
        history.add(record);
        
        return history;
    }

    @Override
    public boolean batchReviewArticles(List<Long> articleIds, String status, String reviewComment, Long reviewerId) {
        if (articleIds == null || articleIds.isEmpty()) {
            return false;
        }
        
        List<Article> articles = articleService.listByIds(articleIds);
        for (Article article : articles) {
            if (!isValidReviewStatus(status)) {
                throw new RuntimeException("无效的审核状态: " + status);
            }
            
            // 记录审核历史
            recordReviewHistory(article.getId(), "ARTICLE", status, reviewComment, reviewerId);
            
            article.setStatus(status);
            article.setUpdateTime(LocalDateTime.now());
            
            // 如果审核通过，设置发布时间
            if ("APPROVED".equals(status) && article.getPublishTime() == null) {
                article.setPublishTime(LocalDateTime.now());
            }
        }
        
        boolean result = articleService.updateBatchById(articles);
        
        // 发送批量审核通知
        if (result) {
            for (Article article : articles) {
                String notificationMessage = generateReviewNotificationMessage(status, reviewComment);
                sendReviewNotification(article.getId(), "ARTICLE", status, notificationMessage);
            }
        }
        
        return result;
    }

    @Override
    public Map<String, Object> getReviewStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 案例审核统计
        stats.put("totalCases", caseService.count());
        stats.put("pendingCases", caseService.count(new QueryWrapper<Case>().eq("status", "PENDING_REVIEW")));
        stats.put("approvedCases", caseService.count(new QueryWrapper<Case>().eq("status", "APPROVED")));
        stats.put("rejectedCases", caseService.count(new QueryWrapper<Case>().eq("status", "REJECTED")));
        
        // 文章审核统计
        stats.put("totalArticles", articleService.count());
        stats.put("pendingArticles", articleService.count(new QueryWrapper<Article>().eq("status", "PENDING_REVIEW")));
        stats.put("approvedArticles", articleService.count(new QueryWrapper<Article>().eq("status", "APPROVED")));
        stats.put("rejectedArticles", articleService.count(new QueryWrapper<Article>().eq("status", "REJECTED")));
        
        // 今日审核统计
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        stats.put("todayReviews", 0); // 需要从审核历史表统计
        
        return stats;
    }

    @Override
    public Map<String, Object> getReviewerStats(Long reviewerId) {
        Map<String, Object> stats = new HashMap<>();
        
        // 这里应该从审核历史表统计数据
        // 暂时返回基本信息
        stats.put("reviewerId", reviewerId);
        stats.put("totalReviews", 0);
        stats.put("todayReviews", 0);
        stats.put("approvals", 0);
        stats.put("rejections", 0);
        
        return stats;
    }

    @Override
    public boolean sendReviewNotification(Long contentId, String contentType, String status, String reviewComment) {
        // 这里应该调用通知服务发送通知
        // 暂时只记录日志
        System.out.println("发送审核通知: " + contentType + " ID:" + contentId + " 状态:" + status + " 评论:" + reviewComment);
        return true;
    }

    @Override
    public boolean autoReviewCase(Long caseId) {
        Case designCase = caseService.getById(caseId);
        if (designCase == null) {
            return false;
        }
        
        // 简单的自动审核规则
        if (isCaseAutoApprovable(designCase)) {
            return reviewCase(caseId, "APPROVED", "自动审核通过", 0L);
        } else {
            return submitCaseForReview(caseId);
        }
    }

    @Override
    public boolean autoReviewArticle(Long articleId) {
        Article article = articleService.getById(articleId);
        if (article == null) {
            return false;
        }
        
        // 简单的自动审核规则
        if (isArticleAutoApprovable(article)) {
            return reviewArticle(articleId, "APPROVED", "自动审核通过", 0L);
        } else {
            return submitArticleForReview(articleId);
        }
    }

    // 私有辅助方法

    private boolean isValidReviewStatus(String status) {
        return Arrays.asList("APPROVED", "REJECTED", "PENDING_REVIEW").contains(status);
    }

    private void recordReviewHistory(Long contentId, String contentType, String status, String reviewComment, Long reviewerId) {
        // 这里应该保存到审核历史表
        // 暂时只记录日志
        System.out.println("记录审核历史: " + contentType + " ID:" + contentId + " 状态:" + status + " 评论:" + reviewComment + " 审核员:" + reviewerId);
    }

    private String generateReviewNotificationMessage(String status, String reviewComment) {
        switch (status) {
            case "APPROVED":
                return "内容审核通过：" + (reviewComment != null ? reviewComment : "符合发布标准");
            case "REJECTED":
                return "内容审核未通过：" + (reviewComment != null ? reviewComment : "不符合发布标准，请修改后重新提交");
            default:
                return reviewComment != null ? reviewComment : "审核状态已更新";
        }
    }

    private boolean isCaseAutoApprovable(Case designCase) {
        // 简单的自动审核规则：如果有完整的信息则自动通过
        return designCase.getTitle() != null && !designCase.getTitle().trim().isEmpty() &&
               designCase.getCoverImage() != null && !designCase.getCoverImage().trim().isEmpty() &&
               designCase.getDesignConcept() != null && !designCase.getDesignConcept().trim().isEmpty() &&
               designCase.getImages() != null && !designCase.getImages().trim().isEmpty();
    }

    private boolean isArticleAutoApprovable(Article article) {
        // 简单的自动审核规则：如果有完整的信息则自动通过
        return article.getTitle() != null && !article.getTitle().trim().isEmpty() &&
               article.getSummary() != null && !article.getSummary().trim().isEmpty() &&
               article.getContent() != null && !article.getContent().trim().isEmpty() &&
               article.getCategory() != null && !article.getCategory().trim().isEmpty();
    }
}
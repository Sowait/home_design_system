package com.homedesign.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.homedesign.common.Result;
import com.homedesign.entity.Case;
import com.homedesign.entity.Article;
import com.homedesign.service.ReviewService;
import com.homedesign.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/review")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    // 案例审核相关

    @GetMapping("/cases/pending")
    public Result<IPage<Case>> getPendingCases(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        IPage<Case> result = reviewService.getPendingCases(page, size);
        return Result.success(result);
    }

    @PostMapping("/cases/{caseId}/review")
    public Result<String> reviewCase(
            @PathVariable Long caseId,
            @RequestBody Map<String, Object> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long reviewerId = userService.findByUsername(username).getId();
        String status = (String) params.get("status");
        String reviewComment = (String) params.get("reviewComment");
        
        if (status == null || status.trim().isEmpty()) {
            return Result.error("审核状态不能为空");
        }
        
        try {
            boolean success = reviewService.reviewCase(caseId, status, reviewComment, reviewerId);
            if (success) {
                return Result.success("案例审核完成");
            } else {
                return Result.error("案例审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/cases/{caseId}/history")
    public Result<List<Map<String, Object>>> getCaseReviewHistory(@PathVariable Long caseId) {
        List<Map<String, Object>> history = reviewService.getCaseReviewHistory(caseId);
        return Result.success(history);
    }

    @PostMapping("/cases/batch-review")
    public Result<String> batchReviewCases(@RequestBody Map<String, Object> params) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long reviewerId = userService.findByUsername(username).getId();
        
        @SuppressWarnings("unchecked")
        List<Long> caseIds = (List<Long>) params.get("caseIds");
        String status = (String) params.get("status");
        String reviewComment = (String) params.get("reviewComment");
        
        if (caseIds == null || caseIds.isEmpty()) {
            return Result.error("请选择要审核的案例");
        }
        
        if (status == null || status.trim().isEmpty()) {
            return Result.error("审核状态不能为空");
        }
        
        try {
            boolean success = reviewService.batchReviewCases(caseIds, status, reviewComment, reviewerId);
            if (success) {
                return Result.success("批量审核完成");
            } else {
                return Result.error("批量审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/cases/{caseId}/submit")
    public Result<String> submitCaseForReview(@PathVariable Long caseId) {
        try {
            boolean success = reviewService.submitCaseForReview(caseId);
            if (success) {
                return Result.success("案例已提交审核");
            } else {
                return Result.error("提交审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/cases/{caseId}/auto-review")
    public Result<String> autoReviewCase(@PathVariable Long caseId) {
        try {
            boolean success = reviewService.autoReviewCase(caseId);
            if (success) {
                return Result.success("案例自动审核完成");
            } else {
                return Result.error("自动审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 文章审核相关

    @GetMapping("/articles/pending")
    public Result<IPage<Article>> getPendingArticles(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        IPage<Article> result = reviewService.getPendingArticles(page, size);
        return Result.success(result);
    }

    @PostMapping("/articles/{articleId}/review")
    public Result<String> reviewArticle(
            @PathVariable Long articleId,
            @RequestBody Map<String, Object> params) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long reviewerId = userService.findByUsername(username).getId();
        String status = (String) params.get("status");
        String reviewComment = (String) params.get("reviewComment");
        
        if (status == null || status.trim().isEmpty()) {
            return Result.error("审核状态不能为空");
        }
        
        try {
            boolean success = reviewService.reviewArticle(articleId, status, reviewComment, reviewerId);
            if (success) {
                return Result.success("文章审核完成");
            } else {
                return Result.error("文章审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/articles/{articleId}/history")
    public Result<List<Map<String, Object>>> getArticleReviewHistory(@PathVariable Long articleId) {
        List<Map<String, Object>> history = reviewService.getArticleReviewHistory(articleId);
        return Result.success(history);
    }

    @PostMapping("/articles/batch-review")
    public Result<String> batchReviewArticles(@RequestBody Map<String, Object> params) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long reviewerId = userService.findByUsername(username).getId();
        
        @SuppressWarnings("unchecked")
        List<Long> articleIds = (List<Long>) params.get("articleIds");
        String status = (String) params.get("status");
        String reviewComment = (String) params.get("reviewComment");
        
        if (articleIds == null || articleIds.isEmpty()) {
            return Result.error("请选择要审核的文章");
        }
        
        if (status == null || status.trim().isEmpty()) {
            return Result.error("审核状态不能为空");
        }
        
        try {
            boolean success = reviewService.batchReviewArticles(articleIds, status, reviewComment, reviewerId);
            if (success) {
                return Result.success("批量审核完成");
            } else {
                return Result.error("批量审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/articles/{articleId}/submit")
    public Result<String> submitArticleForReview(@PathVariable Long articleId) {
        try {
            boolean success = reviewService.submitArticleForReview(articleId);
            if (success) {
                return Result.success("文章已提交审核");
            } else {
                return Result.error("提交审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/articles/{articleId}/auto-review")
    public Result<String> autoReviewArticle(@PathVariable Long articleId) {
        try {
            boolean success = reviewService.autoReviewArticle(articleId);
            if (success) {
                return Result.success("文章自动审核完成");
            } else {
                return Result.error("自动审核失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 审核统计相关

    @GetMapping("/stats")
    public Result<Map<String, Object>> getReviewStats() {
        Map<String, Object> stats = reviewService.getReviewStats();
        return Result.success(stats);
    }

    @GetMapping("/reviewer-stats")
    public Result<Map<String, Object>> getReviewerStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long reviewerId = userService.findByUsername(username).getId();
        
        Map<String, Object> stats = reviewService.getReviewerStats(reviewerId);
        return Result.success(stats);
    }

    // 通知测试
    @PostMapping("/test-notification")
    public Result<String> testNotification(@RequestBody Map<String, Object> params) {
        Long contentId = Long.valueOf(params.get("contentId").toString());
        String contentType = (String) params.get("contentType");
        String status = (String) params.get("status");
        String reviewComment = (String) params.get("reviewComment");
        
        boolean success = reviewService.sendReviewNotification(contentId, contentType, status, reviewComment);
        
        if (success) {
            return Result.success("通知发送成功");
        } else {
            return Result.error("通知发送失败");
        }
    }
}
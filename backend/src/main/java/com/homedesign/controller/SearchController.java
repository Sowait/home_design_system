package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.homedesign.common.Result;
import com.homedesign.entity.Case;
import com.homedesign.entity.Designer;
import com.homedesign.entity.Article;
import com.homedesign.entity.SearchHistory;
import com.homedesign.service.CaseService;
import com.homedesign.service.DesignerService;
import com.homedesign.service.ArticleService;
import com.homedesign.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private CaseService caseService;

    @Autowired
    private DesignerService designerService;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private SearchService searchService;

    @GetMapping("/all")
    public Result<Map<String, Object>> searchAll(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String sortBy) {
        
        // 记录搜索历史
        searchService.recordSearchHistory(keyword, "ALL");
        
        Map<String, Object> result = new HashMap<>();
        
        // 搜索案例
        QueryWrapper<Case> caseQuery = new QueryWrapper<>();
        caseQuery.like("title", keyword)
                 .or()
                 .like("description", keyword)
                 .or()
                 .like("design_concept", keyword)
                 .eq("status", "PUBLISHED");
        
        if (style != null && !style.isEmpty()) {
            caseQuery.eq("style", style);
        }
        
        // 排序
        if ("views".equals(sortBy)) {
            caseQuery.orderByDesc("views");
        } else if ("likes".equals(sortBy)) {
            caseQuery.orderByDesc("likes");
        } else {
            caseQuery.orderByDesc("create_time");
        }
        
        caseQuery.last("LIMIT " + size);
        List<Case> cases = caseService.list(caseQuery);
        result.put("cases", cases);
        
        // 搜索设计师
        QueryWrapper<Designer> designerQuery = new QueryWrapper<>();
        designerQuery.like("name", keyword)
                     .or()
                     .like("bio", keyword)
                     .or()
                     .like("style", keyword)
                     .eq("status", "ACTIVE");
        
        if ("rating".equals(sortBy)) {
            designerQuery.orderByDesc("rating");
        } else if ("experience".equals(sortBy)) {
            designerQuery.orderByDesc("experience");
        } else {
            designerQuery.orderByDesc("create_time");
        }
        
        designerQuery.last("LIMIT " + size);
        List<Designer> designers = designerService.list(designerQuery);
        result.put("designers", designers);
        
        // 搜索文章
        QueryWrapper<Article> articleQuery = new QueryWrapper<>();
        articleQuery.like("title", keyword)
                   .or()
                   .like("summary", keyword)
                   .or()
                   .like("content", keyword)
                   .eq("status", "PUBLISHED");
        
        if ("views".equals(sortBy)) {
            articleQuery.orderByDesc("views");
        } else if ("likes".equals(sortBy)) {
            articleQuery.orderByDesc("likes");
        } else {
            articleQuery.orderByDesc("publish_time");
        }
        
        articleQuery.last("LIMIT " + size);
        List<Article> articles = articleService.list(articleQuery);
        result.put("articles", articles);
        
        return Result.success(result);
    }

    @GetMapping("/cases")
    public Result<List<Case>> searchCases(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String layout,
            @RequestParam(required = false) String sortBy) {
        
        // 记录搜索历史
        searchService.recordSearchHistory(keyword, "CASE");
        
        QueryWrapper<Case> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("title", keyword)
                   .or()
                   .like("description", keyword)
                   .or()
                   .like("design_concept", keyword)
                   .eq("status", "PUBLISHED");
        
        if (style != null && !style.isEmpty()) {
            queryWrapper.eq("style", style);
        }
        
        if (layout != null && !layout.isEmpty()) {
            queryWrapper.eq("layout", layout);
        }
        
        // 排序
        if ("views".equals(sortBy)) {
            queryWrapper.orderByDesc("views");
        } else if ("likes".equals(sortBy)) {
            queryWrapper.orderByDesc("likes");
        } else if ("createTime".equals(sortBy)) {
            queryWrapper.orderByDesc("create_time");
        } else {
            queryWrapper.orderByDesc("publish_time");
        }
        
        return Result.success(caseService.list(queryWrapper));
    }

    @GetMapping("/designers")
    public Result<List<Designer>> searchDesigners(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String serviceArea,
            @RequestParam(required = false) String sortBy) {
        
        // 记录搜索历史
        searchService.recordSearchHistory(keyword, "DESIGNER");
        
        QueryWrapper<Designer> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("name", keyword)
                   .or()
                   .like("bio", keyword)
                   .or()
                   .like("style", keyword)
                   .eq("status", "ACTIVE");
        
        if (style != null && !style.isEmpty()) {
            queryWrapper.like("style", style);
        }
        
        if (serviceArea != null && !serviceArea.isEmpty()) {
            queryWrapper.like("service_area", serviceArea);
        }
        
        // 排序
        if ("rating".equals(sortBy)) {
            queryWrapper.orderByDesc("rating");
        } else if ("experience".equals(sortBy)) {
            queryWrapper.orderByDesc("experience");
        } else if ("cases".equals(sortBy)) {
            queryWrapper.orderByDesc("completed_cases");
        } else {
            queryWrapper.orderByDesc("create_time");
        }
        
        return Result.success(designerService.list(queryWrapper));
    }

    @GetMapping("/articles")
    public Result<List<Article>> searchArticles(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy) {
        
        // 记录搜索历史
        searchService.recordSearchHistory(keyword, "ARTICLE");
        
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("title", keyword)
                   .or()
                   .like("summary", keyword)
                   .or()
                   .like("content", keyword)
                   .eq("status", "PUBLISHED");
        
        if (category != null && !category.isEmpty()) {
            queryWrapper.eq("category", category);
        }
        
        // 排序
        if ("views".equals(sortBy)) {
            queryWrapper.orderByDesc("views");
        } else if ("likes".equals(sortBy)) {
            queryWrapper.orderByDesc("likes");
        } else if ("createTime".equals(sortBy)) {
            queryWrapper.orderByDesc("create_time");
        } else {
            queryWrapper.orderByDesc("publish_time");
        }
        
        return Result.success(articleService.list(queryWrapper));
    }

    @GetMapping("/suggestions")
    public Result<List<String>> getSearchSuggestions(@RequestParam String keyword) {
        List<String> suggestions = searchService.getSearchSuggestions(keyword);
        return Result.success(suggestions);
    }

    @GetMapping("/hot")
    public Result<List<String>> getHotKeywords() {
        List<String> hotKeywords = searchService.getHotKeywords();
        return Result.success(hotKeywords);
    }

    @GetMapping("/history")
    public Result<List<String>> getSearchHistory(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<SearchHistory> histories = searchService.getSearchHistory(userId);
        List<String> history = histories.stream()
                .map(SearchHistory::getKeyword)
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
        return Result.success(history);
    }

    @DeleteMapping("/history")
    public Result<String> clearSearchHistory(@RequestParam(required = false) Long userId) {
        searchService.clearSearchHistory(userId);
        return Result.success("搜索历史已清空");
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> getSearchStats() {
        Map<String, Object> stats = searchService.getSearchStats();
        return Result.success(stats);
    }
}
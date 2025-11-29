package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.Article;
import com.homedesign.service.ArticleService;
import com.homedesign.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public Result<IPage<Article>> getArticles(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy) {
        
        Page<Article> pageInfo = new Page<>(page, size);
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("title", keyword)
                      .or()
                      .like("summary", keyword);
        }
        
        if (category != null && !category.trim().isEmpty()) {
            queryWrapper.eq("category", category);
        }
        
        // 设置排序
        if ("createTime".equals(sortBy)) {
            queryWrapper.orderByDesc("create_time");
        } else if ("views".equals(sortBy)) {
            queryWrapper.orderByDesc("views");
        } else if ("likes".equals(sortBy)) {
            queryWrapper.orderByDesc("likes");
        } else {
            queryWrapper.orderByDesc("create_time");
        }
        
        // 只显示已审核通过的文章
        queryWrapper.eq("status", "APPROVED");
        
        IPage<Article> result = articleService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Article> getArticleById(@PathVariable Long id) {
        Article article = articleService.getById(id);
        if (article == null) {
            return Result.error("文章不存在");
        }
        
        // 增加浏览量
        article.setViews(article.getViews() + 1);
        articleService.updateById(article);
        
        return Result.success(article);
    }

    @PostMapping("/{id}/like")
    public Result<String> likeArticle(@PathVariable Long id) {
        Article article = articleService.getById(id);
        if (article == null) {
            return Result.error("文章不存在");
        }
        
        // 增加点赞数
        article.setLikes(article.getLikes() + 1);
        articleService.updateById(article);
        
        return Result.success("点赞成功");
    }

    @PostMapping
    public Result<String> createArticle(@RequestBody Article article) {
        // 从SecurityContext获取当前用户ID
        Long authorId = SecurityUtil.getCurrentUserId();
        article.setAuthorId(authorId);
        article.setStatus("DRAFT");
        article.setDeleted(0);
        
        boolean success = articleService.save(article);
        if (success) {
            return Result.success("文章创建成功");
        } else {
            return Result.error("文章创建失败");
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        Article existingArticle = articleService.getById(id);
        if (existingArticle == null) {
            return Result.error("文章不存在");
        }
        
        // 检查是否是文章的作者
        // 这里需要从SecurityContext获取当前用户ID进行比较
        // 暂时跳过权限检查
        
        article.setId(id);
        boolean success = articleService.updateById(article);
        if (success) {
            return Result.success("文章更新成功");
        } else {
            return Result.error("文章更新失败");
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteArticle(@PathVariable Long id) {
        Article existingArticle = articleService.getById(id);
        if (existingArticle == null) {
            return Result.error("文章不存在");
        }
        
        // 检查是否是文章的作者
        // 这里需要从SecurityContext获取当前用户ID进行比较
        // 暂时跳过权限检查
        
        boolean success = articleService.removeById(id);
        if (success) {
            return Result.success("文章删除成功");
        } else {
            return Result.error("文章删除失败");
        }
    }

    @PutMapping("/{id}/publish")
    public Result<String> publishArticle(@PathVariable Long id) {
        Article existingArticle = articleService.getById(id);
        if (existingArticle == null) {
            return Result.error("文章不存在");
        }
        
        existingArticle.setStatus("APPROVED");
        boolean success = articleService.updateById(existingArticle);
        if (success) {
            return Result.success("文章发布成功");
        } else {
            return Result.error("文章发布失败");
        }
    }

    @GetMapping("/categories")
    public Result<List<String>> getCategories() {
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("DISTINCT category");
        
        List<Object> categories = articleService.listObjs(queryWrapper);
        List<String> result = categories.stream()
                .map(obj -> obj.toString())
                .filter(str -> str != null && !str.trim().isEmpty())
                .collect(java.util.stream.Collectors.toList());
        
        return Result.success(result);
    }

    @GetMapping("/hot")
    public Result<List<Article>> getHotArticles(@RequestParam(defaultValue = "5") Integer limit) {
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "APPROVED")
                   .orderByDesc("views")
                   .last("LIMIT " + limit);
        
        List<Article> articles = articleService.list(queryWrapper);
        return Result.success(articles);
    }

    @GetMapping("/my")
    public Result<IPage<Article>> getMyArticles(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        
        // 从SecurityContext获取当前用户ID
        Long authorId = SecurityUtil.getCurrentUserId();
        
        Page<Article> pageInfo = new Page<>(page, size);
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        
        // 只查询当前用户的文章
        queryWrapper.eq("author_id", authorId);
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("title", keyword)
                      .or()
                      .like("summary", keyword);
        }
        
        if (status != null && !status.trim().isEmpty()) {
            queryWrapper.eq("status", status);
        }
        
        // 按创建时间倒序排列
        queryWrapper.orderByDesc("create_time");
        
        IPage<Article> result = articleService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }
}
package com.homedesign.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.Article;
import com.homedesign.mapper.ArticleMapper;
import com.homedesign.service.ArticleService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    // 基础CRUD操作由ServiceImpl提供
    
    /**
     * 发布文章
     */
    public boolean publishArticle(Long articleId) {
        Article article = getById(articleId);
        if (article == null) {
            return false;
        }
        
        article.setStatus("PUBLISHED");
        article.setPublishTime(LocalDateTime.now());
        article.setUpdateTime(LocalDateTime.now());
        
        return updateById(article);
    }
    
    /**
     * 获取推荐文章
     */
    public List<Article> getRecommendedArticles(String category, Integer limit) {
        return list().stream()
                .filter(article -> "PUBLISHED".equals(article.getStatus()))
                .filter(article -> category == null || category.isEmpty() || category.equals(article.getCategory()))
                .sorted((a, b) -> {
                    // 按浏览量、点赞数、发布时间排序
                    int viewsCompare = Long.compare(b.getViews(), a.getViews());
                    if (viewsCompare != 0) return viewsCompare;
                    
                    int likesCompare = Long.compare(b.getLikes(), a.getLikes());
                    if (likesCompare != 0) return likesCompare;
                    
                    return b.getPublishTime().compareTo(a.getPublishTime());
                })
                .limit(limit != null ? limit : 10)
                .collect(java.util.stream.Collectors.toList());
    }
}
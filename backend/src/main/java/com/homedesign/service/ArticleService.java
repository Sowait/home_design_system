package com.homedesign.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.homedesign.entity.Article;

import java.util.List;

public interface ArticleService extends IService<Article> {
    
    // 发布文章
    boolean publishArticle(Long articleId);
    
    // 获取推荐文章
    List<Article> getRecommendedArticles(String category, Integer limit);
}
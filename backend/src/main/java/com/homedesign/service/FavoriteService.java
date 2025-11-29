package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.homedesign.entity.Favorite;

public interface FavoriteService extends IService<Favorite> {
    
    void addFavorite(Long userId, String targetType, Long targetId);
    
    void removeFavorite(Long userId, Long favoriteId);
    
    boolean isFavorited(Long userId, String targetType, Long targetId);
    
    IPage<Favorite> getMyFavorites(Page<Favorite> page, Long userId, String targetType);
    
    long getFavoriteCount(String targetType, Long targetId);
}
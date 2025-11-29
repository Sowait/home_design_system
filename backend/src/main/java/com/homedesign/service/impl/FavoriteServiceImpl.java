package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.Favorite;
import com.homedesign.mapper.FavoriteMapper;
import com.homedesign.service.FavoriteService;
import org.springframework.stereotype.Service;

@Service
public class FavoriteServiceImpl extends ServiceImpl<FavoriteMapper, Favorite> implements FavoriteService {

    @Override
    public void addFavorite(Long userId, String targetType, Long targetId) {
        // 检查是否已经收藏
        if (isFavorited(userId, targetType, targetId)) {
            throw new RuntimeException("已经收藏过了");
        }
        
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setTargetType(targetType);
        favorite.setTargetId(targetId);
        favorite.setCreateTime(java.time.LocalDateTime.now());
        favorite.setDeleted(0);
        
        save(favorite);
    }

    @Override
    public void removeFavorite(Long userId, Long favoriteId) {
        QueryWrapper<Favorite> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                   .eq("id", favoriteId);
        
        Favorite favorite = getOne(queryWrapper);
        if (favorite == null) {
            throw new RuntimeException("收藏记录不存在");
        }
        
        removeById(favoriteId);
    }

    @Override
    public boolean isFavorited(Long userId, String targetType, Long targetId) {
        QueryWrapper<Favorite> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                   .eq("target_type", targetType)
                   .eq("target_id", targetId);
        
        return count(queryWrapper) > 0;
    }

    @Override
    public IPage<Favorite> getMyFavorites(Page<Favorite> page, Long userId, String targetType) {
        QueryWrapper<Favorite> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        if (targetType != null && !targetType.isEmpty()) {
            queryWrapper.eq("target_type", targetType);
        }
        queryWrapper.orderByDesc("create_time");
        
        return page(page, queryWrapper);
    }

    @Override
    public long getFavoriteCount(String targetType, Long targetId) {
        QueryWrapper<Favorite> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("target_type", targetType)
                   .eq("target_id", targetId);
        
        return count(queryWrapper);
    }
}
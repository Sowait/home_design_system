package com.homedesign.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.Favorite;
import com.homedesign.service.FavoriteService;
import com.homedesign.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private UserService userService;

    @GetMapping
    public Result<IPage<Favorite>> getMyFavorites(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String targetType) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        Page<Favorite> pageInfo = new Page<>(page, size);
        IPage<Favorite> favorites = favoriteService.getMyFavorites(pageInfo, userId, targetType);
        
        return Result.success(favorites);
    }

    @PostMapping("/add")
    public Result<String> addFavorite(@RequestBody Map<String, Object> params) {
        String targetType = (String) params.get("targetType");
        Long targetId = Long.valueOf(params.get("targetId").toString());
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        
        favoriteService.addFavorite(userId, targetType, targetId);
        return Result.success("收藏成功");
    }

    @DeleteMapping("/{id}")
    public Result<String> removeFavorite(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        favoriteService.removeFavorite(userId, id);
        return Result.success("取消收藏成功");
    }

    @GetMapping("/check")
    public Result<Map<String, Object>> checkFavorite(@RequestParam String targetType, @RequestParam Long targetId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        boolean isFavorited = favoriteService.isFavorited(userId, targetType, targetId);
        Map<String, Object> result = new HashMap<>();
        result.put("isFavorited", isFavorited);
        return Result.success(result);
    }

    @GetMapping("/cases")
    public Result<IPage<Favorite>> getFavoriteCases(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        Page<Favorite> pageInfo = new Page<>(page, size);
        IPage<Favorite> favorites = favoriteService.getMyFavorites(pageInfo, userId, "case");
        
        return Result.success(favorites);
    }

    @GetMapping("/designers")
    public Result<IPage<Favorite>> getFavoriteDesigners(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        Page<Favorite> pageInfo = new Page<>(page, size);
        IPage<Favorite> favorites = favoriteService.getMyFavorites(pageInfo, userId, "designer");
        
        return Result.success(favorites);
    }

    @GetMapping("/articles")
    public Result<IPage<Favorite>> getFavoriteArticles(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.findByUsername(username).getId();
        Page<Favorite> pageInfo = new Page<>(page, size);
        IPage<Favorite> favorites = favoriteService.getMyFavorites(pageInfo, userId, "article");
        
        return Result.success(favorites);
    }
}
package com.homedesign.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.homedesign.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Map;

public interface UserService extends IService<User>, UserDetailsService {
    
    User findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    User register(User user);
    
    String login(String username, String password);
    
    IPage<User> getUserList(Page<User> page, String keyword);
    
    boolean updateUser(User user);
    
    boolean deleteUser(Long id);
    
    void updateUserProfile(Long userId, Map<String, Object> profileData);
    
    void updateUserAvatar(Long userId, String avatarUrl);
    
    void addFavorite(Long userId, String targetType, Long targetId);
    
    void removeFavorite(Long userId, Long favoriteId);
    
    IPage<Map<String, Object>> getUserFavorites(Page<Map<String, Object>> page, Long userId);
    
    Map<String, Object> getUserStats(Long userId);
}
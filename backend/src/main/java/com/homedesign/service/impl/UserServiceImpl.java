package com.homedesign.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.homedesign.entity.User;
import com.homedesign.entity.Favorite;
import com.homedesign.entity.Case;
import com.homedesign.entity.Designer;
import com.homedesign.entity.Article;
import com.homedesign.mapper.UserMapper;
import com.homedesign.service.UserService;
import com.homedesign.service.FavoriteService;
import com.homedesign.service.CaseService;
import com.homedesign.service.DesignerService;
import com.homedesign.service.ArticleService;
import com.homedesign.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService, UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CaseService caseService;

    @Autowired
    private DesignerService designerService;

    @Autowired
    private ArticleService articleService;

    @Override
    public User findByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return userMapper.selectOne(queryWrapper);
    }

    @Override
    public boolean existsByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return userMapper.selectCount(queryWrapper) > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        return userMapper.selectCount(queryWrapper) > 0;
    }

    @Override
    public User register(User user) {
        // 检查用户名是否已存在
        if (existsByUsername(user.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (existsByEmail(user.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }
        
        // 设置默认角色
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        
        // 设置逻辑删除字段默认值
        if (user.getDeleted() == null) {
            user.setDeleted(0);
        }
        
        // 保存用户
        userMapper.insert(user);
        
        // 如果是设计师角色，创建对应的Designer记录
        if ("DESIGNER".equals(user.getRole())) {
            Designer designer = new Designer();
            designer.setUserId(user.getId());
            designer.setName(user.getUsername()); // 默认使用用户名
            designer.setTitle("室内设计师"); // 默认职称
            designer.setServiceArea("全国"); // 默认服务区域
            designer.setStyle("现代简约、北欧风格"); // 默认设计风格
            designer.setPrice("200-500元/平方米"); // 默认价格
            designer.setExperience(1); // 默认1年经验
            designer.setCompletedCases(0); // 默认0个完成案例
            designer.setLikes(0); // 默认0个点赞
            designer.setRating(5.0); // 默认满分
            designer.setDeleted(0); // 默认未删除
            
            designerService.save(designer);
        }
        
        // 清除密码返回
        user.setPassword(null);
        return user;
    }

    @Override
    public String login(String username, String password) {
        User user = findByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        System.out.println("user: " + user);
        
        // 使用明文密码比较
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        // 生成JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());
        
        return token;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }
        
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities
        );
    }

    @Override
    public IPage<User> getUserList(Page<User> page, String keyword) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("username", keyword)
                       .or()
                       .like("email", keyword)
                       .or()
                       .like("nickname", keyword);
        }
        queryWrapper.orderByDesc("create_time");
        
        return userMapper.selectPage(page, queryWrapper);
    }

    @Override
    public boolean updateUser(User user) {
        return userMapper.updateById(user) > 0;
    }

    @Override
    public boolean deleteUser(Long id) {
        return userMapper.deleteById(id) > 0;
    }

    @Override
    public void updateUserProfile(Long userId, Map<String, Object> profileData) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (profileData.containsKey("nickname")) {
            user.setNickname((String) profileData.get("nickname"));
        }
        if (profileData.containsKey("email")) {
            user.setEmail((String) profileData.get("email"));
        }
        if (profileData.containsKey("phone")) {
            user.setPhone((String) profileData.get("phone"));
        }
        if (profileData.containsKey("bio")) {
            user.setBio((String) profileData.get("bio"));
        }
        
        userMapper.updateById(user);
    }

    @Override
    public void updateUserAvatar(Long userId, String avatarUrl) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        user.setAvatar(avatarUrl);
        userMapper.updateById(user);
    }

    @Override
    public void addFavorite(Long userId, String targetType, Long targetId) {
        favoriteService.addFavorite(userId, targetType, targetId);
    }

    @Override
    public void removeFavorite(Long userId, Long favoriteId) {
        favoriteService.removeFavorite(userId, favoriteId);
    }

    @Override
    public IPage<Map<String, Object>> getUserFavorites(Page<Map<String, Object>> page, Long userId) {
        // 查询用户的收藏记录
        QueryWrapper<Favorite> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.orderByDesc("create_time");
        
        // 创建Favorite类型的Page对象来查询
        Page<Favorite> favoritePage = new Page<>(page.getCurrent(), page.getSize());
        IPage<Favorite> result = favoriteService.page(favoritePage, queryWrapper);
        
        // 转换为前端需要的格式
        Page<Map<String, Object>> resultPage = new Page<>(page.getCurrent(), page.getSize(), result.getTotal());
        List<Map<String, Object>> records = new ArrayList<>();
        
        for (Favorite favorite : result.getRecords()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", favorite.getId());
            item.put("type", favorite.getTargetType());
            item.put("targetId", favorite.getTargetId());

            if ("case".equals(favorite.getTargetType())) {
                Case c = caseService.getById(favorite.getTargetId());
                if (c != null) {
                    item.put("title", c.getTitle());
                    item.put("coverImage", c.getCoverImage());
                    item.put("designerName", c.getDesignerName());
                }
            } else if ("designer".equals(favorite.getTargetType())) {
                Designer d = designerService.getById(favorite.getTargetId());
                if (d != null) {
                    item.put("title", d.getName());
                    item.put("coverImage", d.getAvatar());
                    item.put("rating", d.getRating());
                }
            } else if ("article".equals(favorite.getTargetType())) {
                Article a = articleService.getById(favorite.getTargetId());
                if (a != null) {
                    item.put("title", a.getTitle());
                    item.put("coverImage", a.getCoverImage());
                    item.put("category", a.getCategory());
                }
            }
            
            records.add(item);
        }
        
        resultPage.setRecords(records);
        return resultPage;
    }

    @Override
    public Map<String, Object> getUserStats(Long userId) {
        // 获取用户统计数据
        Map<String, Object> stats = new HashMap<>();
        
        // 模拟统计数据
        stats.put("totalFavorites", 10);
        stats.put("totalComments", 5);
        stats.put("totalAppointments", 3);
        
        return stats;
    }
}
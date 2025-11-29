package com.homedesign.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.homedesign.common.Result;
import com.homedesign.entity.Comment;
import com.homedesign.entity.Case;
import com.homedesign.entity.Article;
import com.homedesign.service.UserService;
import com.homedesign.service.CommentService;
import com.homedesign.service.CaseService;
import com.homedesign.service.ArticleService;
import com.homedesign.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private CaseService caseService;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 从请求头中获取当前用户的userId
     * @param request HTTP请求
     * @return 用户ID
     */
    private Long getCurrentUserId(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null) {
            return jwtUtil.getUserIdFromToken(token);
        }
        throw new RuntimeException("用户未登录或token无效");
    }

    /**
     * 从请求头中提取JWT token
     * @param request HTTP请求
     * @return JWT token字符串
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @PutMapping("/profile")
    public Result<String> updateProfile(@RequestBody Map<String, Object> profileData, HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);
            userService.updateUserProfile(userId, profileData);
            return Result.success("个人信息更新成功");
        } catch (Exception e) {
            return Result.error("个人信息更新失败: " + e.getMessage());
        }
    }

    @PutMapping("/avatar")
    public Result<String> updateAvatar(@RequestParam String avatarUrl, HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);
            userService.updateUserAvatar(userId, avatarUrl);
            return Result.success("头像更新成功");
        } catch (Exception e) {
            return Result.error("头像更新失败: " + e.getMessage());
        }
    }

    @GetMapping("/favorites")
    public Result<IPage<Map<String, Object>>> getMyFavorites(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            HttpServletRequest request) {
        
        try {
            Long userId = getCurrentUserId(request);
            
            Page<Map<String, Object>> pageInfo = new Page<>(page, size);
            IPage<Map<String, Object>> result = userService.getUserFavorites(pageInfo, userId);
            
            return Result.success(result);
        } catch (Exception e) {
            return Result.error("获取收藏列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/comments")
    public Result<IPage<Map<String, Object>>> getMyComments(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            HttpServletRequest request) {
        
        try {
            Long userId = getCurrentUserId(request);
            
            Page<Comment> pageInfo = new Page<>(page, size);
            QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId);
            queryWrapper.orderByDesc("create_time");
            
            IPage<Comment> result = commentService.page(pageInfo, queryWrapper);
            
            // 转换为前端需要的格式，包含目标对象标题
            Page<Map<String, Object>> resultPage = new Page<>(page, size, result.getTotal());
            List<Map<String, Object>> records = new ArrayList<>();
            
            for (Comment comment : result.getRecords()) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", comment.getId());
                item.put("targetType", comment.getTargetType());
                item.put("targetId", comment.getTargetId());
                item.put("content", comment.getContent());
                item.put("createTime", comment.getCreateTime());
                
                // 根据目标类型获取对应的标题
                if ("case".equals(comment.getTargetType())) {
                    Case c = caseService.getById(comment.getTargetId());
                    if (c != null) {
                        item.put("targetTitle", c.getTitle());
                    } else {
                        item.put("targetTitle", "已删除的案例");
                    }
                } else if ("article".equals(comment.getTargetType())) {
                    Article a = articleService.getById(comment.getTargetId());
                    if (a != null) {
                        item.put("targetTitle", a.getTitle());
                    } else {
                        item.put("targetTitle", "已删除的文章");
                    }
                } else {
                    item.put("targetTitle", "未知对象");
                }
                
                records.add(item);
            }
            
            resultPage.setRecords(records);
            return Result.success(resultPage);
        } catch (Exception e) {
            return Result.error("获取评论列表失败: " + e.getMessage());
        }
    }

    @PostMapping("/favorite")
    public Result<String> addFavorite(@RequestBody Map<String, Object> favoriteData, HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);
            String targetType = (String) favoriteData.get("targetType");
            Long targetId = Long.valueOf(favoriteData.get("targetId").toString());
            
            userService.addFavorite(userId, targetType, targetId);
            return Result.success("收藏成功");
        } catch (Exception e) {
            return Result.error("收藏失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/favorite/{id}")
    public Result<String> removeFavorite(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);
            userService.removeFavorite(userId, id);
            return Result.success("取消收藏成功");
        } catch (Exception e) {
            return Result.error("取消收藏失败: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> getUserStats(HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);
            Map<String, Object> stats = userService.getUserStats(userId);
            return Result.success(stats);
        } catch (Exception e) {
            return Result.error("获取用户统计失败: " + e.getMessage());
        }
    }
}
package com.homedesign.controller;

import com.homedesign.common.Result;
import com.homedesign.entity.User;
import com.homedesign.service.UserService;
import com.homedesign.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            String token = jwtUtil.generateToken(
                registeredUser.getUsername(), 
                registeredUser.getRole(), 
                registeredUser.getId()
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("user", registeredUser);
            
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            String token = userService.login(username, password);
            User user = userService.findByUsername(username);
            
            // 清除密码信息，避免泄露
            user.setPassword(null);
            
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("user", user);
            
            return Result.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("用户名或密码错误");
        }
    }

    @GetMapping("/me")
    public Result<User> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                return Result.error("用户未登录 - SecurityContext为空");
            }
            
            if ("anonymousUser".equals(authentication.getName())) {
                return Result.error("用户未登录 - 匿名用户");
            }
            
            String username = authentication.getName();
            if (username == null || username.trim().isEmpty()) {
                return Result.error("用户名获取失败");
            }
            
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return Result.error("用户不存在 - 用户名: " + username);
            }
            
            // 清除密码信息，避免泄露
            user.setPassword(null);
            return Result.success(user);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取用户信息失败: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public Result<String> logout() {
        SecurityContextHolder.clearContext();
        return Result.success("退出登录成功");
    }
}
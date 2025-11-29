package com.homedesign.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    private static JwtUtil jwtUtil;

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        SecurityUtil.jwtUtil = jwtUtil;
    }

    /**
     * 获取当前用户ID
     * @return 当前登录用户的ID
     */
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof String) {
            String token = (String) authentication.getDetails();
            try {
                return jwtUtil.getUserIdFromToken(token);
            } catch (Exception e) {
                System.err.println("Error getting user ID from token: " + e.getMessage());
                return null; // token过期时返回null而不是默认值
            }
        }
        
        // 如果无法从token获取，返回null
        return null;
    }

    /**
     * 获取当前用户名
     * @return 当前登录用户的用户名
     */
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getName();
        }
        return null;
    }

    /**
     * 获取当前用户角色
     * @return 当前登录用户的角色
     */
    public static String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof String) {
            String token = (String) authentication.getDetails();
            try {
                return jwtUtil.getRoleFromToken(token);
            } catch (Exception e) {
                System.err.println("Error getting role from token: " + e.getMessage());
                return "USER"; // 开发阶段返回默认角色
            }
        }
        return null;
    }
}
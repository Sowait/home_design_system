package com.homedesign.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Data
@TableName("user")
public class User implements UserDetails {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("username")
    private String username;
    
    @TableField("password")
    private String password;
    
    @TableField("email")
    private String email;
    
    @TableField("phone")
    private String phone;
    
    @TableField("avatar")
    private String avatar;
    
    @TableField("nickname")
    private String nickname;
    
    @TableField("gender")
    private String gender;
    
    @TableField("birthday")
    private String birthday;
    
    @TableField("location")
    private String location;
    
    @TableField("bio")
    private String bio;
    
    @TableField("role")
    private String role;

    
    @TableField("register_time")
    private LocalDateTime registerTime;
    @TableField("create_time")
    private LocalDateTime createTime;
    
    @TableField(value = "deleted", fill = FieldFill.INSERT)
    @TableLogic
    private Integer deleted;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(() -> "ROLE_" + role);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
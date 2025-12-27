-- 创建数据库
CREATE DATABASE IF NOT EXISTS home_design CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE home_design;

-- 确保连接与结果使用UTF-8
SET NAMES utf8mb4;

-- 用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    avatar VARCHAR(255) COMMENT '头像URL',
    nickname VARCHAR(50) COMMENT '昵称',
    gender VARCHAR(10) COMMENT '性别',
    birthday DATE COMMENT '生日',
    location VARCHAR(100) COMMENT '所在地',
    bio TEXT COMMENT '个人简介',
    role VARCHAR(20) NOT NULL DEFAULT 'USER' COMMENT '角色：USER,DESIGNER,ADMIN',
    register_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 设计师表
CREATE TABLE IF NOT EXISTS designer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    name VARCHAR(50) NOT NULL COMMENT '设计师姓名',
    title VARCHAR(100) COMMENT '职称',
    avatar VARCHAR(255) COMMENT '头像URL',
    service_area VARCHAR(200) COMMENT '服务区域',
    style VARCHAR(200) COMMENT '设计风格',
    price VARCHAR(100) COMMENT '设计价格',
    experience INT COMMENT '从业年限',
    completed_cases INT DEFAULT 0 COMMENT '完成案例数',
    likes INT DEFAULT 0 COMMENT '获赞数',
    bio TEXT COMMENT '个人简介',
    education TEXT COMMENT '教育背景',
    awards TEXT COMMENT '获奖经历',
    service_scope VARCHAR(500) COMMENT '服务范围',
    rating DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_name (name),
    INDEX idx_style (style),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设计师表';

-- 设计案例表
CREATE TABLE IF NOT EXISTS design_case (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '案例标题',
    style VARCHAR(50) COMMENT '设计风格',
    layout VARCHAR(50) COMMENT '户型',
    area INT COMMENT '面积',
    designer_id BIGINT NOT NULL COMMENT '设计师ID',
    designer_name VARCHAR(50) COMMENT '设计师姓名',
    cover_image VARCHAR(255) COMMENT '封面图片URL',
    images TEXT COMMENT '图片列表JSON',
    design_concept TEXT COMMENT '设计理念',
    materials TEXT COMMENT '材料清单',
    views INT DEFAULT 0 COMMENT '浏览量',
    likes INT DEFAULT 0 COMMENT '点赞数',
    favorites INT DEFAULT 0 COMMENT '收藏数',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING,APPROVED,REJECTED',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_designer_id (designer_id),
    INDEX idx_style (style),
    INDEX idx_status (status),
    FOREIGN KEY (designer_id) REFERENCES designer(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设计案例表';

-- 预约表
CREATE TABLE IF NOT EXISTS appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    user_name VARCHAR(50) COMMENT '用户名',
    designer_id BIGINT NOT NULL COMMENT '设计师ID',
    designer_name VARCHAR(50) COMMENT '设计师姓名',
    appointment_time DATETIME NOT NULL COMMENT '预约时间',
    floor_plan VARCHAR(255) COMMENT '户型图URL',
    description TEXT COMMENT '需求描述',
    contact VARCHAR(100) COMMENT '联系方式',
    budget VARCHAR(50) COMMENT '预算范围',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING,ACCEPTED,REJECTED,COMPLETED',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_designer_id (designer_id),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (designer_id) REFERENCES designer(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

-- 文章表
CREATE TABLE IF NOT EXISTS article (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    category VARCHAR(50) COMMENT '文章分类',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    author_name VARCHAR(50) COMMENT '作者姓名',
    author_avatar VARCHAR(255) COMMENT '作者头像',
    author_title VARCHAR(100) COMMENT '作者职称',
    author_bio TEXT COMMENT '作者简介',
    cover_image VARCHAR(255) COMMENT '封面图片URL',
    summary VARCHAR(500) COMMENT '文章摘要',
    content LONGTEXT COMMENT '文章内容',
    tags VARCHAR(200) COMMENT '标签',
    views INT DEFAULT 0 COMMENT '浏览量',
    likes INT DEFAULT 0 COMMENT '点赞数',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING,APPROVED,REJECTED',
    publish_time DATETIME COMMENT '发布时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_author_id (author_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    FOREIGN KEY (author_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 评论表
CREATE TABLE IF NOT EXISTS comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型：case,article',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    username VARCHAR(50) COMMENT '用户名',
    avatar VARCHAR(255) COMMENT '头像URL',
    content TEXT NOT NULL COMMENT '评论内容',
    likes INT DEFAULT 0 COMMENT '点赞数',
    parent_id BIGINT COMMENT '父评论ID',
    reply_to VARCHAR(50) COMMENT '回复用户名',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_target (target_type, target_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 插入默认管理员用户
INSERT INTO user (username, password, email, role) 
VALUES ('admin', '123456', 'admin@example.com', 'ADMIN')
ON DUPLICATE KEY UPDATE username = username;

-- 插入测试用户
INSERT INTO user (username, password, email, role) 
VALUES ('testuser', '123456', 'test@example.com', 'USER')
ON DUPLICATE KEY UPDATE username = username;

-- 收藏表
CREATE TABLE IF NOT EXISTS favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型：case,designer,article',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id),
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 评分表
CREATE TABLE IF NOT EXISTS rating (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型：case,designer',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    rating INT NOT NULL COMMENT '评分1-5',
    comment TEXT COMMENT '评价内容',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id),
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评分表';

-- 通知表
CREATE TABLE IF NOT EXISTS notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT COMMENT '通知内容',
    type VARCHAR(50) NOT NULL COMMENT '通知类型：appointment,comment,favorite,system',
    target_type VARCHAR(20) COMMENT '目标类型',
    target_id BIGINT COMMENT '目标ID',
    is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已读',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';



-- 搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL COMMENT '搜索关键词',
    search_type VARCHAR(20) DEFAULT 'ALL' COMMENT '搜索类型：ALL,CASE,DESIGNER,ARTICLE',
    user_id BIGINT COMMENT '用户ID（可选，用于记录用户搜索历史）',
    search_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '搜索时间',
    frequency INT DEFAULT 1 COMMENT '搜索频率',
    INDEX idx_keyword (keyword),
    INDEX idx_search_time (search_time),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='搜索历史表';

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    description VARCHAR(255) COMMENT '配置描述',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 系统日志表
CREATE TABLE IF NOT EXISTS system_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    log_type VARCHAR(50) NOT NULL COMMENT '日志类型：USER_LOGIN,USER_REGISTER,ADMIN_ACTION,SYSTEM_ERROR',
    description TEXT COMMENT '日志描述',
    user_id BIGINT COMMENT '操作用户ID',
    username VARCHAR(50) COMMENT '操作用户名',
    ip VARCHAR(50) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    request_url VARCHAR(255) COMMENT '请求URL',
    request_method VARCHAR(10) COMMENT '请求方法',
    request_params TEXT COMMENT '请求参数',
    response_data TEXT COMMENT '响应数据',
    execution_time BIGINT COMMENT '执行时间（毫秒）',
    status_code INT COMMENT '状态码',
    error_message TEXT COMMENT '错误信息',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_log_type (log_type),
    INDEX idx_user_id (user_id),
    INDEX idx_create_time (create_time),
    INDEX idx_ip (ip),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统日志表';

-- 评分表
CREATE TABLE IF NOT EXISTS rating (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型：case,designer',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    rating INT NOT NULL COMMENT '评分1-5',
    comment TEXT COMMENT '评价内容',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id),
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评分表';

-- 通知表
CREATE TABLE IF NOT EXISTS notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT COMMENT '通知内容',
    type VARCHAR(50) NOT NULL COMMENT '通知类型：appointment,comment,favorite,like,review,follow,system',
    target_type VARCHAR(20) COMMENT '目标类型',
    target_id BIGINT COMMENT '目标ID',
    is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已读',
    read_time DATETIME COMMENT '阅读时间',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_target (target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

-- 收藏表
CREATE TABLE IF NOT EXISTS favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型：case,designer,article',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT NOT NULL DEFAULT 0 COMMENT '逻辑删除标志',
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id),
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 插入基础系统配置
INSERT INTO system_config (config_key, config_value, description) VALUES 
('site_name', '家装设计平台', '网站名称'),
('site_description', '专业的家装设计服务平台', '网站描述'),
('site_keywords', '家装,设计,装修,案例,设计师', '网站关键词'),
('site_logo', '/logo.png', '网站Logo'),
('site_icon', '/favicon.ico', '网站图标'),
('allow_register', 'true', '是否允许注册'),
('email_verify', 'false', '是否需要邮箱验证'),
('phone_verify', 'false', '是否需要手机验证'),
('auto_approve_cases', 'false', '案例是否自动审核通过'),
('auto_approve_articles', 'false', '文章是否自动审核通过'),
('auto_approve_designers', 'false', '设计师是否自动审核通过'),
('max_file_size', '10485760', '最大上传文件大小（字节）'),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf","doc","docx"]', '允许上传的文件类型'),
('default_page_size', '10', '默认分页大小'),
('max_search_results', '100', '最大搜索结果数'),
('session_timeout', '30', '会话超时时间（分钟）'),
('notification_email_enabled', 'true', '是否启用邮件通知'),
('sms_notification_enabled', 'false', '是否启用短信通知'),
('system_maintenance', 'false', '系统维护状态'),
('maintenance_message', '系统正在维护中，请稍后再试', '维护提示信息')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value), description = VALUES(description);

-- ========================================
-- 插入更多测试用户数据
-- ========================================
INSERT INTO user (username, password, email, phone, avatar, gender, birthday, location, role, register_time) VALUES
('zhangsan', '123456', 'zhangsan@example.com', '13800138001', '/avatars/user1.jpg', '男', '1990-05-15', '北京市', 'USER', '2023-01-15 10:30:00'),
('lisi', '123456', 'lisi@example.com', '13800138002', '/avatars/user2.jpg', '女', '1992-08-20', '上海市', 'USER', '2023-02-20 14:20:00'),
('wangwu', '123456', 'wangwu@example.com', '13800138003', '/avatars/user3.jpg', '男', '1988-12-10', '广州市', 'USER', '2023-03-10 09:15:00'),
('zhaoliu', '123456', 'zhaoliu@example.com', '13800138004', '/avatars/user4.jpg', '女', '1995-03-25', '深圳市', 'USER', '2023-04-05 16:45:00'),
('qianqi', '123456', 'qianqi@example.com', '13800138005', '/avatars/user5.jpg', '男', '1985-07-18', '杭州市', 'USER', '2023-05-12 11:30:00')
ON DUPLICATE KEY UPDATE username = username;

-- 插入测试设计师
INSERT INTO user (id,username, password, email, role) 
VALUES (7,'designer1', '123456', 'designer1@example.com', 'DESIGNER')
ON DUPLICATE KEY UPDATE username = username;
-- 插入更多设计师用户
INSERT INTO user (id,username, password, email, phone, avatar, gender, birthday, location, role, register_time) VALUES
(8,'designer_chen', '123456', 'chen@example.com', '13800138006', '/avatars/designer1.jpg', '男', '1980-06-15', '北京市', 'DESIGNER', '2023-01-20 10:00:00'),
(9,'designer_liu', '123456', 'liu@example.com', '13800138007', '/avatars/designer2.jpg', '女', '1985-11-28', '上海市', 'DESIGNER', '2023-02-15 14:30:00'),
(10,'designer_wang', '123456', 'wang@example.com', '13800138008', '/avatars/designer3.jpg', '男', '1982-09-10', '深圳市', 'DESIGNER', '2023-03-01 09:00:00'),
(11,'designer_zhang', '123456', 'zhang@example.com', '13800138009', '/avatars/designer4.jpg', '女', '1987-04-22', '广州市', 'DESIGNER', '2023-04-10 15:20:00')
ON DUPLICATE KEY UPDATE username = username;

-- 插入设计师详细信息
INSERT INTO designer (id, user_id, name, title, avatar, service_area, style, price, experience, completed_cases, likes, bio, education, awards, service_scope, rating, create_time, update_time) VALUES
(7, 7, '默认设计师', '首席设计师', '/avatars/designer1.jpg', '北京、天津、河北', '现代简约,北欧风格,新中式', '500-1000元/㎡', 15, 28, 156, '专注于现代简约和北欧风格设计，拥有丰富的家装设计经验，致力于为客户打造舒适、美观的居住空间。', '清华大学美术学院', '2022年中国室内设计大奖赛金奖', '住宅设计、商业空间设计、软装搭配', 4.8, '2023-01-20 10:00:00', '2024-01-20 10:00:00'),
(8, 8, '陈设计师', '首席设计师', '/avatars/designer1.jpg', '北京、天津、河北', '现代简约,北欧风格,新中式', '500-1000元/㎡', 15, 28, 156, '专注于现代简约和北欧风格设计，拥有丰富的家装设计经验，致力于为客户打造舒适、美观的居住空间。', '清华大学美术学院', '2022年中国室内设计大奖赛金奖', '住宅设计、商业空间设计、软装搭配', 4.8, '2023-01-20 10:00:00', '2024-01-20 10:00:00'),
(9, 9, '刘设计师', '高级设计师', '/avatars/designer2.jpg', '上海、苏州、杭州', '轻奢风格,现代简约,美式风格', '800-1500元/㎡', 12, 35, 234, '擅长轻奢和美式风格设计，注重空间的功能性和美观性的完美结合，为客户提供高品质的设计服务。', '同济大学建筑与城市规划学院', '2021年上海室内设计大赛一等奖', '高端住宅设计、别墅设计、样板间设计', 4.9, '2023-02-15 14:30:00', '2024-02-15 14:30:00'),
(10, 10, '王设计师', '资深设计师', '/avatars/designer3.jpg', '深圳、广州、东莞', '工业风,现代简约,地中海风格', '600-1200元/㎡', 18, 42, 189, '拥有18年设计经验，擅长工业风和地中海风格，设计理念前卫，善于运用创新的设计手法。', '中央美术学院', '2023年深圳室内设计年度设计师', '工业风装修、创意空间设计、商业设计', 4.7, '2023-03-01 09:00:00', '2024-03-01 09:00:00'),
(11, 11, '张设计师', '创意设计师', '/avatars/designer4.jpg', '广州、佛山、珠海', '新中式,古典中式,日式风格', '700-1300元/㎡', 10, 25, 145, '专注于新中式和日式风格设计，善于将传统文化元素与现代设计理念相结合，打造独特的设计风格。', '广州美术学院', '2022年新中式设计大赛银奖', '中式设计、禅意空间、茶室设计', 4.6, '2023-04-10 15:20:00', '2024-04-10 15:20:00');

-- 插入设计案例数据
INSERT INTO design_case (title, style, layout, area, designer_id, designer_name, cover_image, images, design_concept, materials, views, likes, favorites, status, create_time, update_time) VALUES
('现代简约三居室改造', '现代简约', '三居室', 120, 8, '陈设计师', '["https://qcloud.dpfile.com/pc/ABweRJIh6K8GDEmxBP9enB6AzP61l-8JzVQc6Sb4GcqetTJPCukyTGns-vo8-MYZ.jpg","https://img2.baidu.com/it/u=144191808,3946099891&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500"]', '["/cases/case1_1.jpg","/cases/case1_2.jpg","/cases/case1_3.jpg"]', '以简洁明快的设计手法，打造舒适现代的生活空间。整体采用白色调为主，搭配木质元素，营造温馨舒适的家居氛围。', '实木地板、乳胶漆、定制衣柜、现代家具、LED照明', 1250, 89, 23, 'APPROVED', '2023-06-15 10:00:00', '2024-06-15 10:00:00'),
('北欧风格温馨小窝', '北欧风格', '两居室', 85, 9, '刘设计师', '["https://img0.baidu.com/it/u=2149603857,3178675074&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067","https://img2.baidu.com/it/u=1992793685,467888531&fm=253&fmt=auto&app=138&f=JPEG?w=1067&h=800"]', '["/cases/case2_1.jpg","/cases/case2_2.jpg","/cases/case2_3.jpg"]', '运用北欧风格的设计理念，以白色和浅木色为主调，营造清新自然的生活空间。大量使用天然材质，注重采光和通风。', '橡木地板、白色乳胶漆、棉麻布艺、北欧家具、绿植装饰', 980, 145, 31, 'APPROVED', '2023-07-20 14:30:00', '2024-07-20 14:30:00'),
('轻奢风格大平层', '轻奢风格', '四居室', 180, 9, '刘设计师', '["https://img0.baidu.com/it/u=3397007468,3417172932&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750","https://img1.baidu.com/it/u=308532982,3259728900&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800"]', '["/cases/case3_1.jpg","/cases/case3_2.jpg","/cases/case3_3.jpg"]', '融合轻奢设计元素，采用高级灰色调和金属装饰，打造优雅奢华的居住环境。注重细节处理，体现品质和格调。', '大理石地板、金属装饰线、定制家具、水晶吊灯、高端布艺', 1580, 234, 45, 'APPROVED', '2023-08-10 09:15:00', '2024-08-10 09:15:00'),
('工业风LOFT改造', '工业风', '复式', 150, 10, '王设计师', '["https://img1.baidu.com/it/u=389902269,1096287280&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653","https://img0.baidu.com/it/u=1590071346,821150751&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=751"]', '["/cases/case4_1.jpg","/cases/case4_2.jpg","/cases/case4_3.jpg"]', '保留原始建筑结构，运用工业风设计元素，打造时尚前卫的居住空间。大量使用金属、混凝土等材质，展现原始粗犷的美感。', '水泥地面、金属管道、砖墙、工业风家具、轨道射灯', 1100, 167, 28, 'APPROVED', '2023-09-05 16:45:00', '2024-09-05 16:45:00'),
('新中式别墅设计', '新中式', '别墅', 280, 11, '张设计师', '["https://img0.baidu.com/it/u=2311262177,2581687103&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=664","https://img2.baidu.com/it/u=2694121278,957578209&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067"]', '["/cases/case5_1.jpg","/cases/case5_2.jpg","/cases/case5_3.jpg"]', '将传统中式元素与现代设计理念完美融合，打造既有文化底蕴又符合现代生活的居住空间。注重空间层次和意境营造。', '红木家具、中式屏风、青砖地面、古典灯具、传统字画', 2100, 298, 56, 'APPROVED', '2023-10-12 11:30:00', '2024-10-12 11:30:00'),
('地中海风格度假屋', '地中海风格', '三居室', 130, 11, '张设计师', '["https://img0.baidu.com/it/u=2311262177,2581687103&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=664","https://img2.baidu.com/it/u=2694121278,957578209&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067"]', '["/cases/case6_1.jpg","/cases/case6_2.jpg","/cases/case6_3.jpg"]', '运用地中海风格的蓝白色调，营造清新浪漫的海滨度假氛围。大量使用天然石材和木质元素，打造舒适宜人的居住环境。', '蓝色外墙、白色室内、陶土砖、藤编家具、海洋装饰', 1350, 178, 32, 'APPROVED', '2023-11-08 14:20:00', '2024-11-08 14:20:00');

-- 插入文章数据
INSERT INTO article (title, category, author_id, author_name, author_avatar, author_title, author_bio, cover_image, summary, content, tags, views, likes, status, publish_time, create_time, update_time) VALUES
('2024年家装设计趋势分析', '设计趋势', 8, '陈设计师', '/avatars/designer1.jpg', '首席设计师', '专注家装设计15年，曾获多项设计大奖', '/articles/article1_cover.jpg', '本文分析了2024年家装设计的最新趋势，包括色彩搭配、材料选择、空间布局等方面的变化，为家装爱好者提供专业指导。', '# 2024年家装设计趋势分析\n\n## 色彩趋势\n2024年的家装色彩趋势更加注重自然和舒适，大地色系、柔和的绿色和蓝色将成为主流。\n\n## 材料选择\n环保材料继续受到青睐，天然木材、竹材、石材等材料的使用将更加广泛。\n\n## 空间布局\n开放式空间设计仍然流行，但更注重功能区域的划分和隐私保护。\n\n## 智能家居\n智能家居设备的集成成为设计的重点，注重实用性和美观性的结合。', '家装设计,设计趋势,2024年,色彩搭配,材料选择', 890, 67, 'APPROVED', '2024-01-15 10:00:00', '2024-01-15 09:30:00', '2024-01-15 10:00:00'),
('小户型空间扩容技巧', '空间设计', 9, '刘设计师', '/avatars/designer2.jpg', '高级设计师', '擅长小户型和空间优化设计', '/articles/article2_cover.jpg', '分享实用的小户型空间扩容技巧，包括色彩运用、家具选择、收纳设计等方法，帮助小户型业主打造宽敞舒适的居住空间。', '# 小户型空间扩容技巧\n\n## 色彩运用\n选择浅色系作为主色调，可以视觉上扩大空间感。白色、米色、浅灰色都是不错的选择。\n\n## 家具选择\n选择多功能和可折叠的家具，既节省空间又满足多种使用需求。\n\n## 收纳设计\n充分利用垂直空间，定制合适的收纳系统，保持空间的整洁有序。', '小户型,空间扩容,收纳设计,家具选择,色彩运用', 1200, 89, 'APPROVED', '2024-02-20 14:30:00', '2024-02-20 14:00:00', '2024-02-20 14:30:00'),
('现代简约风格设计理念', '设计理念', 10, '王设计师', '/avatars/designer3.jpg', '资深设计师', '专注现代简约风格设计18年', '/articles/article3_cover.jpg', '深入解析现代简约风格的设计理念，包括少即是多的设计原则、功能性与美观性的平衡、材质和色彩的运用等。', '# 现代简约风格设计理念\n\n## 少即是多\n现代简约风格强调"少即是多"的设计理念，通过精简的设计元素，营造出纯粹、优雅的空间效果。\n\n## 功能性优先\n在追求美观的同时，更注重空间的实用性，每一个设计都要有其存在的意义。\n\n## 材质运用\n现代简约风格善于运用现代材料，如玻璃、金属、混凝土等，展现材料本身的质感。', '现代简约,设计理念,少即是多,功能性,材质运用', 750, 56, 'APPROVED', '2024-03-10 09:15:00', '2024-03-10 09:00:00', '2024-03-10 09:15:00'),
('新中式设计的文化内涵', '设计文化', 11, '张设计师', '/avatars/designer4.jpg', '创意设计师', '专注新中式和传统文化设计', '/articles/article4_cover.jpg', '探讨新中式设计背后的文化内涵，如何将传统文化元素与现代生活完美融合，打造具有文化底蕴的居住空间。', '# 新中式设计的文化内涵\n\n## 传统文化元素\n新中式设计善于运用传统文化元素，如山水画、书法、古典家具等，营造深厚的文化氛围。\n\n## 现代生活需求\n在保留传统元素的同时，充分考虑现代生活的实际需求，做到传统与现代的完美结合。\n\n## 意境营造\n新中式设计注重意境的营造，通过空间的层次感和细节处理，营造出宁静致远的居住环境。', '新中式,文化内涵,传统文化,现代生活,意境营造', 980, 78, 'APPROVED', '2024-04-05 16:45:00', '2024-04-05 16:30:00', '2024-04-05 16:45:00');

-- 插入评论数据
INSERT INTO comment (target_type, target_id, user_id, username, avatar, content, likes, parent_id, reply_to, create_time, update_time) VALUES
('case', 1, 2, 'zhangsan', '/avatars/user1.jpg', '这个设计真的很棒！简洁而不失温馨，特别喜欢客厅的配色方案。', 12, NULL, NULL, '2024-01-16 10:30:00', '2024-01-16 10:30:00'),
('case', 1, 2, 'lisi', '/avatars/user2.jpg', '请问这个案例的预算大概是多少呢？想参考一下。', 8, NULL, NULL, '2024-01-16 14:20:00', '2024-01-16 14:20:00'),
('case', 2, 2, 'wangwu', '/avatars/user3.jpg', '北欧风格真的很有魅力，感觉整个空间都很明亮通透！', 15, NULL, NULL, '2024-01-17 09:15:00', '2024-01-17 09:15:00'),
('case', 2, 2, 'zhaoliu', '/avatars/user4.jpg', '我也喜欢北欧风格，但不知道适不适合我家，设计师能给点建议吗？', 6, 3, 'wangwu', '2024-01-17 11:45:00', '2024-01-17 11:45:00'),
('case', 3, 2, 'qianqi', '/avatars/user5.jpg', '轻奢风格很大气，这个设计真的很用心，每个细节都很到位！', 18, NULL, NULL, '2024-01-18 15:30:00', '2024-01-18 15:30:00'),
('article', 1, 2, 'zhangsan', '/avatars/user1.jpg', '文章写得很专业，对2024年的设计趋势分析得很透彻，学到了很多！', 9, NULL, NULL, '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
('article', 2, 2, 'lisi', '/avatars/user2.jpg', '小户型扩容技巧很实用，正准备装修，这些方法对我很有帮助！', 14, NULL, NULL, '2024-01-17 16:20:00', '2024-01-17 16:20:00'),
('case', 4, 2, 'zhangsan', '/avatars/user1.jpg', '工业风真的很酷，保留原始结构的设计很有创意！', 11, NULL, NULL, '2024-01-18 10:15:00', '2024-01-18 10:15:00'),
('case', 5, 2, 'lisi', '/avatars/user2.jpg', '新中式设计真的很有文化底蕴，每个角落都散发着东方美学的魅力！', 20, NULL, NULL, '2024-01-19 14:30:00', '2024-01-19 14:30:00'),
('article', 3, 5, 'wangwu', '/avatars/user3.jpg', '现代简约的设计理念说得很清楚，"少即是多"确实很有道理！', 7, NULL, NULL, '2024-01-19 09:45:00', '2024-01-19 09:45:00');

-- 插入预约数据
INSERT INTO appointment (user_id, user_name, designer_id, designer_name, appointment_time, floor_plan, description, contact, budget, status, create_time, update_time) VALUES
(3, 'zhangsan', 8, '陈设计师', '2024-02-01 14:00:00', '/plans/plan1.jpg', '三居室装修，希望采用现代简约风格，注重储物空间的设计。', '13800138001', '10-15万', 'ACCEPTED', '2024-01-20 10:30:00', '2024-01-21 09:00:00'),
(4, 'lisi', 9, '刘设计师', '2024-02-03 10:00:00', '/plans/plan2.jpg', '两居室装修，喜欢北欧风格，希望空间看起来更宽敞。', '13800138002', '8-12万', 'PENDING', '2024-01-21 15:20:00', '2024-01-21 15:20:00'),
(5, 'wangwu', 10, '王设计师', '2024-02-05 16:00:00', '/plans/plan3.jpg', '复式楼装修，想尝试工业风格，保留原有的建筑结构。', '13800138003', '15-20万', 'COMPLETED', '2024-01-22 11:45:00', '2024-02-05 17:00:00'),
(6, 'zhaoliu', 11, '张设计师', '2024-02-08 13:30:00', '/plans/plan4.jpg', '别墅装修，希望采用新中式风格，要有书房和茶室。', '13800138004', '25-30万', 'ACCEPTED', '2024-01-23 14:30:00', '2024-01-24 10:15:00'),
(7, 'qianqi', 8, '陈设计师', '2024-02-10 09:30:00', '/plans/plan5.jpg', '小户型改造，需要在有限空间内实现多功能区域。', '13800138005', '6-8万', 'PENDING', '2024-01-24 16:20:00', '2024-01-24 16:20:00');

-- 插入收藏数据
INSERT INTO favorite (user_id, target_type, target_id, create_time) VALUES
(3, 'case', 1, '2024-01-16 10:30:00'),
(3, 'case', 3, '2024-01-18 15:30:00'),
(3, 'designer', 1, '2024-01-20 10:30:00'),
(4, 'case', 2, '2024-01-17 09:15:00'),
(4, 'case', 5, '2024-01-19 14:30:00'),
(4, 'designer', 4, '2024-01-19 14:30:00'),
(5, 'case', 4, '2024-01-18 10:15:00'),
(5, 'article', 1, '2024-01-16 11:00:00'),
(6, 'case', 5, '2024-01-19 14:30:00'),
(6, 'designer', 2, '2024-01-19 14:30:00'),
(7, 'case', 1, '2024-01-17 11:45:00'),
(7, 'article', 2, '2024-01-17 16:20:00'),
(7, 'designer', 3, '2024-01-18 10:15:00');

-- 插入评分数据
INSERT INTO rating (user_id, target_type, target_id, rating, comment, create_time, update_time) VALUES
(3, 'case', 1, 5, '设计很专业，施工质量也很好，非常满意！', '2024-01-20 10:30:00', '2024-01-20 10:30:00'),
(4, 'case', 2, 4, '整体效果不错，就是工期稍微有点长。', '2024-01-21 15:20:00', '2024-01-21 15:20:00'),
(5, 'case', 4, 5, '工业风格很酷，设计师很有创意！', '2024-02-05 17:00:00', '2024-02-05 17:00:00'),
(6, 'case', 5, 4, '新中式设计很有韵味，服务态度也很好。', '2024-02-08 15:00:00', '2024-02-08 15:00:00'),
(7, 'designer', 1, 5, '陈设计师很专业，给出的设计方案很符合我们的需求。', '2024-01-20 10:30:00', '2024-01-20 10:30:00'),
(4, 'designer', 2, 4, '刘设计师设计理念很先进，就是价格稍贵。', '2024-01-21 15:20:00', '2024-01-21 15:20:00'),
(5, 'designer', 3, 5, '王设计师很有创意，工业风设计得很成功！', '2024-02-05 17:00:00', '2024-02-05 17:00:00'),
(6, 'designer', 4, 4, '张设计师对新中式很有研究，设计效果很不错。', '2024-02-08 15:00:00', '2024-02-08 15:00:00');

-- 插入通知数据
INSERT INTO notification (user_id, title, content, type, target_type, target_id, is_read, create_time) VALUES
(1, '新预约提醒', '您有一个新的预约申请，请及时处理。', 'APPOINTMENT', 'appointment', 1, FALSE, '2024-01-20 10:30:00'),
(3, '预约确认', '您的预约已确认，请在约定时间准时到达。', 'APPOINTMENT', 'appointment', 1, TRUE, '2024-01-21 09:00:00'),
(8, '新评论通知', 'zhangsan评论了您的案例"现代简约三居室改造"。', 'COMMENT', 'case', 1, FALSE, '2024-01-16 10:30:00'),
(4, '预约申请', '您已成功预约刘设计师，请等待确认。', 'APPOINTMENT', 'appointment', 2, TRUE, '2024-01-21 15:20:00'),
(9, '新评论通知', 'wangwu评论了您的案例"北欧风格温馨小窝"。', 'COMMENT', 'case', 2, FALSE, '2024-01-17 09:15:00'),
(3, '点赞通知', 'lisi点赞了您的评论。', 'LIKE', 'comment', 2, TRUE, '2024-01-16 14:20:00'),
(5, '预约完成', '您的预约已完成，请对设计师服务进行评价。', 'APPOINTMENT', 'appointment', 3, FALSE, '2024-02-05 17:30:00'),
(10, '新评分通知', 'wangwu给您评分5星。', 'REVIEW', 'designer', 3, FALSE, '2024-02-05 17:00:00'),
(1, '系统维护通知', '系统将于今晚23:00-24:00进行维护升级。', 'SYSTEM', NULL, NULL, FALSE, '2024-01-25 20:00:00'),
(8, '案例审核通过', '您的案例"现代简约三居室改造"已通过审核。', 'REVIEW', 'case', 1, TRUE, '2023-06-15 11:00:00'),
(9, '案例审核通过', '您的案例"北欧风格温馨小窝"已通过审核。', 'REVIEW', 'case', 2, TRUE, '2023-07-20 15:00:00'),
(10, '案例审核通过', '您的案例"工业风LOFT改造"已通过审核。', 'REVIEW', 'case', 4, TRUE, '2023-09-05 17:00:00'),
(11, '案例审核通过', '您的案例"新中式别墅设计"已通过审核。', 'REVIEW', 'case', 5, TRUE, '2023-10-12 12:00:00'),
(8, '文章审核通过', '您的文章"2024年家装设计趋势分析"已通过审核。', 'REVIEW', 'article', 1, TRUE, '2024-01-15 10:30:00'),
(3, '收藏通知', 'lisi收藏了您的案例"现代简约三居室改造"。', 'FAVORITE', 'case', 1, FALSE, '2024-01-16 10:30:00');

-- 插入搜索历史数据
INSERT INTO search_history (keyword, search_type, user_id, search_time) VALUES
('现代简约', 'CASE', 3, '2024-01-16 10:00:00'),
('北欧风格', 'CASE', 4, '2024-01-17 09:15:00'),
('小户型', 'ARTICLE', 5, '2024-01-17 11:30:00'),
('陈设计师', 'DESIGNER', 3, '2024-01-18 14:20:00'),
('轻奢风格', 'CASE', 7, '2024-01-19 16:45:00'),
('装修预算', 'ARTICLE', 3, '2024-01-20 11:00:00'),
('新中式', 'CASE', 4, '2024-01-21 15:30:00'),
('工业风', 'DESIGNER', 5, '2024-01-22 09:45:00'),
('收纳设计', 'ARTICLE', 3, '2024-01-23 13:20:00'),
('别墅设计', 'CASE', 4, '2024-01-24 17:10:00'),
('设计趋势', 'ARTICLE', 5, '2024-01-25 10:30:00'),
('刘设计师', 'DESIGNER', 3, '2024-01-26 14:50:00'),
('空间扩容', 'ARTICLE', 4, '2024-01-27 09:15:00'),
('地中海', 'CASE', 5, '2024-01-28 16:25:00'),
('家装设计', 'ALL', 3, '2024-01-29 11:40:00');

-- ========================================
-- 数据导入完成统计信息
-- ========================================
SELECT '家居设计平台初始化数据导入完成！' AS message;
SELECT '=====================================' AS message;
SELECT CONCAT('用户总数: ', COUNT(*)) AS message FROM user;
SELECT CONCAT('设计师总数: ', COUNT(*)) AS message FROM designer;
SELECT CONCAT('设计案例总数: ', COUNT(*)) AS message FROM design_case;
SELECT CONCAT('文章总数: ', COUNT(*)) AS message FROM article;
SELECT CONCAT('评论总数: ', COUNT(*)) AS message FROM comment;
SELECT CONCAT('预约总数: ', COUNT(*)) AS message FROM appointment;
SELECT CONCAT('收藏总数: ', COUNT(*)) AS message FROM favorite;
SELECT CONCAT('评分总数: ', COUNT(*)) AS message FROM rating;
SELECT CONCAT('通知总数: ', COUNT(*)) AS message FROM notification;
SELECT CONCAT('搜索历史总数: ', COUNT(*)) AS message FROM search_history;
SELECT '=====================================' AS message;
SELECT '默认管理员账号: admin / 123456' AS message;
SELECT '默认用户账号: zhangsan / 123456' AS message;
SELECT '默认设计师账号: designer_chen / 123456' AS message;
SELECT '=====================================' AS message;

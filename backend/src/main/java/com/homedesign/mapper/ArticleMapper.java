package com.homedesign.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.homedesign.entity.Article;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
}
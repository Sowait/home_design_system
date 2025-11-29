package com.homedesign.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.homedesign.entity.SearchHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 搜索历史Mapper接口
 */
@Mapper
public interface SearchHistoryMapper extends BaseMapper<SearchHistory> {
    
    /**
     * 获取用户搜索历史
     */
    @Select("SELECT * FROM search_history WHERE user_id = #{userId} AND deleted = 0 ORDER BY search_time DESC LIMIT 20")
    List<SearchHistory> getUserSearchHistory(Long userId);
    
    /**
     * 获取热门搜索关键词
     */
    @Select("SELECT keyword, COUNT(*) as count FROM search_history WHERE deleted = 0 GROUP BY keyword ORDER BY count DESC LIMIT 10")
    List<SearchHistory> getHotKeywords();
}
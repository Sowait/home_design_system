import React, { useState, useEffect } from 'react';
import { Input, AutoComplete, Button, Space, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { searchApi } from '../../api';
import './SearchBox.css';

const { Option } = Select;
const { Search } = Input;

const SearchBox = ({ 
  onSearch, 
  onFilterChange,
  showFilters = true,
  placeholder = "搜索案例、设计师、文章...",
  style = {}
}) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    style: '',
    layout: '',
    minArea: null,
    maxArea: null
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 获取搜索建议
  const fetchSuggestions = async (value) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchApi.getSearchSuggestions(value);
      if (response.data.code === 200) {
        const data = response.data.data;
        const options = [];
        
        // 热门搜索
        if (data.hotSearches) {
          data.hotSearches.forEach(item => {
            options.push({
              value: item,
              label: (
                <div>
                  <SearchOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  {item}
                </div>
              )
            });
          });
        }
        
        // 风格建议
        if (data.styles) {
          data.styles.forEach(item => {
            if (item.includes(value)) {
              options.push({
                value: item,
                label: (
                  <div>
                    <span style={{ marginRight: 8, color: '#52c41a' }}>🎨</span>
                    {item}
                  </div>
                )
              });
            }
          });
        }
        
        setSuggestions(options);
      }
    } catch (error) {
      console.error('获取搜索建议失败:', error);
    }
  };

  // 处理搜索
  const handleSearch = (value) => {
    const searchParams = {
      keyword: value || keyword,
      ...filters
    };
    onSearch && onSearch(searchParams);
  };

  // 处理筛选变化
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  // 清空筛选
  const clearFilters = () => {
    setFilters({
      category: '',
      style: '',
      layout: '',
      minArea: null,
      maxArea: null
    });
    onFilterChange && onFilterChange({});
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <div className="search-box" style={style}>
      <div className="search-input-wrapper">
        <AutoComplete
          className="search-auto-complete"
          options={suggestions}
          onSearch={setKeyword}
          onSelect={(value) => {
            setKeyword(value);
            handleSearch(value);
          }}
          value={keyword}
        >
          <Search
            placeholder={placeholder}
            size="large"
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
        </AutoComplete>
        
        {showFilters && (
          <Button
            className="filter-toggle"
            icon={<FilterOutlined />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            筛选
          </Button>
        )}
      </div>

      {showFilters && showAdvancedFilters && (
        <div className="advanced-filters">
          <Space wrap>
            <Select
              placeholder="文章分类"
              style={{ width: 120 }}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              allowClear
            >
              <Option value="装修攻略">装修攻略</Option>
              <Option value="设计理念">设计理念</Option>
              <Option value="材料选择">材料选择</Option>
              <Option value="色彩搭配">色彩搭配</Option>
              <Option value="空间利用">空间利用</Option>
            </Select>

            <Select
              placeholder="设计风格"
              style={{ width: 120 }}
              value={filters.style}
              onChange={(value) => handleFilterChange('style', value)}
              allowClear
            >
              <Option value="现代简约">现代简约</Option>
              <Option value="北欧风格">北欧风格</Option>
              <Option value="新中式">新中式</Option>
              <Option value="欧式古典">欧式古典</Option>
              <Option value="美式乡村">美式乡村</Option>
              <Option value="日式和风">日式和风</Option>
              <Option value="地中海风情">地中海风情</Option>
              <Option value="工业风格">工业风格</Option>
            </Select>

            <Select
              placeholder="户型"
              style={{ width: 120 }}
              value={filters.layout}
              onChange={(value) => handleFilterChange('layout', value)}
              allowClear
            >
              <Option value="一居室">一居室</Option>
              <Option value="二居室">二居室</Option>
              <Option value="三居室">三居室</Option>
              <Option value="四居室">四居室</Option>
              <Option value="复式">复式</Option>
              <Option value="别墅">别墅</Option>
              <Option value="loft">loft</Option>
            </Select>

            <Input
              placeholder="最小面积(㎡)"
              style={{ width: 100 }}
              value={filters.minArea}
              onChange={(e) => handleFilterChange('minArea', e.target.value ? parseInt(e.target.value) : null)}
              type="number"
            />

            <Input
              placeholder="最大面积(㎡)"
              style={{ width: 100 }}
              value={filters.maxArea}
              onChange={(e) => handleFilterChange('maxArea', e.target.value ? parseInt(e.target.value) : null)}
              type="number"
            />

            <Button onClick={clearFilters}>清空筛选</Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
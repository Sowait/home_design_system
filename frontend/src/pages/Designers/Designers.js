import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Pagination, Avatar, Rate, Tag, message } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { designerAPI } from '../../utils/api';

const { Search } = Input;
const { Option } = Select;

const Designers = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    size: 12,
    keyword: '',
    style: '',
    sortBy: 'createTime'
  });

  const styles = ['现代简约', '北欧', '新中式', '美式', '欧式', '日式', '地中海', '工业风'];
  const sortOptions = [
    { value: 'createTime', label: '最新注册' },
    { value: 'likes', label: '最受欢迎' },
    { value: 'completedCases', label: '案例最多' },
    { value: 'rating', label: '评分最高' }
  ];

  useEffect(() => {
    fetchDesigners();
  }, [filters]);

  const fetchDesigners = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await designerAPI.getList(params);
      setDesigners(response.records || []);
      setTotal(response.total || 0);
    } catch (error) {
      message.error('获取设计师列表失败');
      // 使用模拟数据
      setDesigners([
        {
          id: 1,
          name: '张设计师',
          title: '高级设计师',
          avatar: '',
          style: '现代简约',
          serviceArea: '全市',
          price: '200-500元/平米',
          experience: 8,
          completedCases: 156,
          likes: 892,
          rating: 4.8,
          bio: '专注于现代简约风格设计，擅长空间规划和色彩搭配。'
        },
        {
          id: 2,
          name: '李设计师',
          title: '资深设计师',
          avatar: '',
          style: '北欧风格',
          serviceArea: '全市',
          price: '150-400元/平米',
          experience: 6,
          completedCases: 98,
          likes: 656,
          rating: 4.6,
          bio: '热爱北欧风格，追求自然、舒适的生活方式。'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, keyword: value, page: 1 });
  };

  const handleStyleChange = (value) => {
    setFilters({ ...filters, style: value, page: 1 });
  };

  const handleSortChange = (value) => {
    setFilters({ ...filters, sortBy: value, page: 1 });
  };

  const handlePageChange = (page, pageSize) => {
    setFilters({ ...filters, page, size: pageSize });
  };


  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2>设计师团队</h2>
        <p style={{ color: '#666' }}>专业的设计师团队，为您提供个性化的家装设计方案</p>
      </div>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="搜索设计师姓名、职称"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Select
              placeholder="设计风格"
              allowClear
              style={{ width: '100%' }}
              onChange={handleStyleChange}
            >
              {styles.map(style => (
                <Option key={style} value={style}>{style}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Select
              placeholder="排序方式"
              style={{ width: '100%' }}
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 设计师列表 */}
      <Row gutter={[24, 24]}>
        {designers.map(designer => (
          <Col xs={24} sm={12} lg={8} xl={6} key={designer.id}>
            <Card
              hoverable
              onClick={() => window.location.href = `/designers/${designer.id}`}
              style={{ textAlign: 'center' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Avatar
                  size={80}
                  src={designer.avatar}
                  icon={<UserOutlined />}
                  style={{ marginBottom: '12px' }}
                />
                <div>
                  <h4 style={{ margin: '8px 0' }}>{designer.name}</h4>
                  <Tag color="blue" style={{ marginBottom: '8px' }}>
                    {designer.title}
                  </Tag>
                  <div style={{ marginBottom: '8px' }}>
                    <Rate disabled defaultValue={designer.rating} style={{ fontSize: '14px' }} />
                    <span style={{ marginLeft: '8px', color: '#666' }}>
                      {designer.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>风格：</strong>{designer.style}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>经验：</strong>{designer.experience}年
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>案例：</strong>{designer.completedCases}套
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>区域：</strong>{designer.serviceArea}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>价格：</strong>{designer.price}
                </div>
                <div style={{ 
                  height: '40px', 
                  overflow: 'hidden',
                  fontSize: '12px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {designer.bio}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 分页 */}
      {total > 0 && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Pagination
            current={filters.page}
            total={total}
            pageSize={filters.size}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      )}

      {designers.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999'
        }}>
          <p>暂无设计师数据</p>
        </div>
      )}
    </div>
  );
};

export default Designers;
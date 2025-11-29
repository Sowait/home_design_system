import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Button, Pagination, Tag, Avatar, Space, message } from 'antd';
import { SearchOutlined, UserOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { caseAPI } from '../../utils/api';
import UserCaseImage from '../../components/UserCaseImage';

const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

const DesignCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    size: 12,
    keyword: '',
    style: '',
    layout: '',
    minArea: '',
    maxArea: ''
  });

  const styles = ['现代简约', '北欧', '新中式', '美式', '欧式', '日式', '地中海', '工业风'];
  const layouts = ['一室', '两室', '三室', '四室', '复式', '别墅'];

  useEffect(() => {
    fetchCases();
  }, [filters]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await caseAPI.getList(params);
      setCases(response.records || []);
      setTotal(response.total || 0);
    } catch (error) {
      message.error('获取案例列表失败');
      console.log('使用模拟数据');
      setCases([
        {
          id: 1,
          title: '现代简约三居室装修案例',
          style: '现代简约',
          layout: '三室',
          area: 120,
          coverImage: 'https://via.placeholder.com/300x200?text=现代简约',
          designerId: 1,
          designerName: '张设计师',
          designerAvatar: '',
          views: 1250,
          likes: 89,
          description: '简约而不简单，注重功能性与美观性的完美结合'
        },
        {
          id: 2,
          title: '北欧风格两居室设计',
          style: '北欧',
          layout: '两室',
          area: 85,
          coverImage: 'https://via.placeholder.com/300x200?text=北欧风格',
          designerId: 2,
          designerName: '李设计师',
          designerAvatar: '',
          views: 980,
          likes: 76,
          description: '清新自然，营造温馨舒适的居住环境'
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

  const handleLayoutChange = (value) => {
    setFilters({ ...filters, layout: value, page: 1 });
  };

  const handlePageChange = (page, pageSize) => {
    setFilters({ ...filters, page, size: pageSize });
  };

  const handleLikeCase = async (caseId) => {
    try {
      await caseAPI.likeCase(caseId);
      message.success('点赞成功');
      fetchCases();
    } catch (error) {
      message.error('点赞失败');
    }
  };

  const handleViewDetail = (caseId) => {
    navigate(`/cases/${caseId}`);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2>设计案例</h2>
        <p style={{ color: '#666' }}>发现精美的家装设计案例，获取装修灵感</p>
      </div>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索案例标题、设计师"
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
              placeholder="户型"
              allowClear
              style={{ width: '100%' }}
              onChange={handleLayoutChange}
            >
              {layouts.map(layout => (
                <Option key={layout} value={layout}>{layout}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 案例列表 */}
      <Row gutter={[24, 24]}>
        {cases.map(caseItem => (
          <Col xs={24} sm={12} lg={8} xl={6} key={caseItem.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <UserCaseImage coverImage={caseItem.coverImage} title={caseItem.title} />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    <EyeOutlined /> {caseItem.views}
                  </div>
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<StarOutlined />}
                  onClick={() => handleLikeCase(caseItem.id)}
                >
                  {caseItem.likes}
                </Button>,
                <Button type="primary" size="small" onClick={() => handleViewDetail(caseItem.id)}>
                  查看详情
                </Button>
              ]}
            >
              <Meta
                title={
                  <div style={{ height: '48px', overflow: 'hidden' }}>
                    {caseItem.title}
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <Tag color="blue">{caseItem.style}</Tag>
                      <Tag color="green">{caseItem.layout}</Tag>
                      <Tag>{caseItem.area}m²</Tag>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      marginBottom: '8px' 
                    }}>
                      <Avatar
                        size="small"
                        src={caseItem.designerAvatar}
                        icon={<UserOutlined />}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {caseItem.designerName}
                      </span>
                    </div>
                    <div style={{
                      height: '40px',
                      overflow: 'hidden',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {caseItem.description}
                    </div>
                  </div>
                }
              />
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

      {cases.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999'
        }}>
          <p>暂无案例数据</p>
        </div>
      )}
    </div>
  );
};

export default DesignCases;
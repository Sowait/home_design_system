import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, Card, Steps, message, Row, Col, Typography } from 'antd';
import { CalendarOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { appointmentAPI, designerAPI } from '../../utils/api';
import dayjs from 'dayjs';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const Appointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [designers, setDesigners] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchDesigners();
  }, []);

  useEffect(() => {
    // 如果从设计师详情页面跳转过来，预选设计师
    if (location.state && location.state.designerId && designers.length > 0) {
      form.setFieldsValue({
        designerId: location.state.designerId
      });
    }
  }, [location.state, designers, form]);

  const fetchDesigners = async () => {
    try {
      const response = await designerAPI.getList({ page: 1, size: 100 });
      setDesigners(response.records || []);
    } catch (error) {
      // 使用模拟数据
      setDesigners([
        {
          id: 1,
          name: '张设计师',
          title: '高级设计师',
          style: '现代简约',
          price: '200-500元/平米',
          experience: 8
        },
        {
          id: 2,
          name: '李设计师',
          title: '资深设计师',
          style: '北欧风格',
          price: '150-400元/平米',
          experience: 6
        }
      ]);
    }
  };

  const handleNext = () => {
    form.validateFields().then(() => {
      if (currentStep < 2) {
        // 保存当前步骤的数据
        const currentValues = form.getFieldsValue();
        setFormData(prevData => ({ ...prevData, ...currentValues }));
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }).catch(() => {
      message.error('请完善必填信息');
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    // 返回上一步时，恢复该步骤之前填写的数据
    setTimeout(() => {
      form.setFieldsValue(formData);
    }, 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 合并表单当前值和之前保存的步骤数据
      const currentValues = form.getFieldsValue(true);
      const allValues = { ...formData, ...currentValues };
      
      // 映射前端字段到后端字段
      const appointmentData = {
        userId: 1, // 这里应该从用户上下文获取
        designerId: allValues.designerId,
        appointmentTime: allValues.appointmentTime.format('YYYY-MM-DDTHH:mm:ss'),
        floorPlan: allValues.layout, // 映射 layout -> floorPlan
        description: allValues.requirements, // 映射 requirements -> description
        contact: allValues.phone, // 映射 phone -> contact
        budget: allValues.budget ? allValues.budget + '万元' : '', // 格式化预算
        status: 'PENDING',
        // 添加额外字段用于显示
        userName: allValues.name,
        address: allValues.address,
        style: allValues.style,
        area: allValues.area,
        remarks: allValues.remarks
      };
      
      console.log('提交的预约数据:', appointmentData); // 调试日志
      
      await appointmentAPI.create(appointmentData);
      message.success('预约提交成功，即将跳转到我的预约页面');
      form.resetFields();
      setFormData({}); // 清空保存的数据
      setCurrentStep(0);
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        navigate('/appointments');
      }, 500);
    } catch (error) {
      message.error(error.message || '预约提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      title: '基本信息',
      icon: <UserOutlined />
    },
    {
      title: '项目信息',
      icon: <HomeOutlined />
    },
    {
      title: '时间确认',
      icon: <CalendarOutlined />
    }
  ];

  return (
    <div>
      <Card>
        <Title level={2}>预约设计服务</Title>
        <p style={{ color: '#666' }}>请填写以下信息，我们将为您安排合适的设计师服务</p>

        <Steps current={currentStep} items={steps} style={{ marginBottom: '32px' }} />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            budget: '',
            area: '',
            appointmentTime: null,
            requirements: ''
          }}
        >
          {/* 第一步：基本信息 */}
          {currentStep === 0 && (
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="联系人姓名"
                  rules={[{ required: true, message: '请输入联系人姓名' }]}
                >
                  <Input placeholder="请输入您的真实姓名" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="联系电话"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                  ]}
                >
                  <Input placeholder="请输入您的手机号" />
                </Form.Item>
              </Col>
              <Col xs={24} >
                <Form.Item
                  name="designerId"
                  label="选择设计师"
                  rules={[{ required: true, message: '请选择设计师' }]}
                >
                  <Select 
                    placeholder="请选择您心仪的设计师" 
                    style={{ height: '50px' }}
                  >
                    {designers.map(designer => (
                      <Option key={designer.id} value={designer.id}>
                        <div>
                          <div>{designer.name} - {designer.title}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {designer.style} · {designer.price} · {designer.experience}年经验
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* 第二步：项目信息 */}
          {currentStep === 1 && (
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="style"
                  label="装修风格"
                  rules={[{ required: true, message: '请选择装修风格' }]}
                >
                  <Select placeholder="请选择您喜欢的装修风格">
                    <Option value="现代简约">现代简约</Option>
                    <Option value="北欧">北欧</Option>
                    <Option value="新中式">新中式</Option>
                    <Option value="美式">美式</Option>
                    <Option value="欧式">欧式</Option>
                    <Option value="日式">日式</Option>
                    <Option value="地中海">地中海</Option>
                    <Option value="工业风">工业风</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="layout"
                  label="房屋户型"
                  rules={[{ required: true, message: '请选择房屋户型' }]}
                >
                  <Select placeholder="请选择您的房屋户型">
                    <Option value="一室">一室</Option>
                    <Option value="两室">两室</Option>
                    <Option value="三室">三室</Option>
                    <Option value="四室">四室</Option>
                    <Option value="复式">复式</Option>
                    <Option value="别墅">别墅</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="area"
                  label="房屋面积(m²)"
                  rules={[
                    { required: true, message: '请输入房屋面积' },
                    { type: 'number', min: 1, message: '面积必须大于0' }
                  ]}
                >
                  <InputNumber
                    placeholder="请输入房屋面积"
                    style={{ width: '100%' }}
                    min={1}
                    max={1000}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="budget"
                  label="预算范围(万元)"
                  rules={[
                    { required: true, message: '请输入预算范围' },
                    { type: 'number', min: 1, message: '预算必须大于0' }
                  ]}
                >
                  <InputNumber
                    placeholder="请输入您的预算范围"
                    style={{ width: '100%' }}
                    min={1}
                    max={1000}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="requirements"
                  label="具体需求"
                  rules={[{ required: true, message: '请描述您的具体需求' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请详细描述您的装修需求，比如家庭成员、生活习惯、特殊要求等"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* 第三步：时间确认 */}
          {currentStep === 2 && (
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="appointmentTime"
                  label="预约时间"
                  rules={[{ required: true, message: '请选择预约时间' }]}
                >
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    placeholder="请选择预约时间"
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="address"
                  label="装修地址"
                  rules={[{ required: true, message: '请输入装修地址' }]}
                >
                  <Input placeholder="请输入详细的装修地址" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="remarks"
                  label="备注信息"
                >
                  <TextArea
                    rows={3}
                    placeholder="其他需要说明的信息（选填）"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>

        {/* 操作按钮 */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          {currentStep > 0 && (
            <Button
              style={{ marginRight: '8px' }}
              onClick={handlePrev}
            >
              上一步
            </Button>
          )}
          <Button
            type="primary"
            onClick={handleNext}
            loading={submitting}
          >
            {currentStep === 2 ? '提交预约' : '下一步'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Appointment;
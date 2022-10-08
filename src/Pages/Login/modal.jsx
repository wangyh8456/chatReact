import React from 'react'
import {Form,Input,Button,message} from 'antd'
import * as api from '../../api'
import './index.module.scss'

export default function Usermodal(props) {
    const [modalform]=Form.useForm();

    React.useEffect(()=>{
        
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    
    async function submit(val){
        const data={
            username:val.username,
            password:val.newpassword,
        }
        const result=await api.register(data);
        if(result.status===200){
            message.success({content:result.message,duration:2});
            props.close();
        }else{
            message.error({content:result.message,duration:2});
        }
    }

    return (
        <Form layout="vertical" form={modalform} name="modalform" onFinish={submit} onFinishFailed={(val)=>{console.log(val)}}>
            <Form.Item  name='username' label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
                hasFeedback
            >
                <Input/>
            </Form.Item>
            <Form.Item name='newpassword' label="新密码"
                rules={[
                    {
                        required: true,
                        message: '请输入新密码!',
                    },
                    {
                        type:'string',
                        max:16,
                        message:'密码为不超过16位的字符串'
                    }
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>
            <Form.Item name='repassword' label="确认密码" dependencies={['newpassword']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请再次输入新密码!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newpassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码输入不一致!'));
                    },
                  }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item style={{textAlign:'center'}}>
                <Button style={{marginRight:'30px'}} onClick={()=>{modalform.resetFields()}}>重置</Button>
                <Button type="primary" htmlType="submit">确认</Button>
            </Form.Item>
        </Form>
    )
}

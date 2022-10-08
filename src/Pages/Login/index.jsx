import React,{useState} from 'react';
import {Button,Input,Form,Modal,message} from 'antd';
import {useNavigate} from 'react-router-dom';
import css from './index.module.scss';
import Pwdmodal from './modal';
import * as api from '../../api';

function Login() {
    const navigate=useNavigate();

    const [isLoading,setIsLoading]=useState(false);
    const [index,setIndex]=useState(NaN);
    const [isModalVisible,setIsModalVisible]=useState(false);

    const onFinish =async (val) => {
        const data={
            username:val.username,
            password:val.password,
        }
        setIsLoading(true);
        const result=await api.Login(data);
        if(result.status===200){
            message.success({content:result.message,duration:2});
            localStorage.setItem('userToken',result.data.token);
            localStorage.setItem('userInfo',JSON.stringify(result.data));
            navigate('/');
        }else{
            message.error({content:result.message,duration:2});
        }
        setIsLoading(false);
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    

    return (
        <div className={css.page}>
            <div className={css.title}>
                <div>欢迎使用</div>
                <div style={{display:'flex',alignItems:'center',margin:'30px 0 70px',fontSize:'45px',fontWeight:'bold'}}>
                    <div className={css.icon}></div>
                    CHATS
                </div>
            </div>
            <Modal title="注册" visible={isModalVisible} onCancel={()=>{setIsModalVisible(false)}}
                bodyStyle={{maxHeight:'700px',overflowY:'auto'}}
                footer={null}
                style={{top:'50px'}}
                destroyOnClose={true}
            >
                <Pwdmodal close={()=>{setIsModalVisible(false)}}></Pwdmodal>
            </Modal>
            <div className={css.form+' loginpage'}>
                <Form
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        className={`${css.ipt} ${index===1?css.choose:''}`}
                    >
                        <Input bordered={false} placeholder="用户名" style={{height:'50px'}}  
                        onFocus={()=>{setIndex(1)}} onBlur={()=>{setIndex(NaN)}}/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className={`${css.ipt} ${index===2?css.choose:''}`}
                    >
                        <Input.Password bordered={false} placeholder="密码" style={{height:'50px'}}
                        onFocus={()=>{setIndex(2)}} onBlur={()=>{setIndex(NaN)}}/>
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width:'100%',height:'40px',borderRadius:'20px',marginTop:'40px'}} loading={isLoading}>
                        登录
                    </Button>
                    </Form.Item>
                </Form>
                <h3 onClick={()=>{setIsModalVisible(true)}} style={{color:'#1296db',position:'absolute',left:0,bottom:'-40px',cursor:'pointer'}}>免费注册</h3>
            </div>
        </div>
    )
}

export default React.memo(Login);

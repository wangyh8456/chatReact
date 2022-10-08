import React,{useState,useEffect,Suspense} from 'react';
import {Outlet,useNavigate} from 'react-router-dom';
import css from './index.module.scss';
import router from '../../router/index';
import Sider from './sider';
import Search from './search';
import Avatar from './avatar';
import Chatlist from '../chatlist/index';
import Friendlist from '../friendList/Index';
import Grouplist from '../grouplist/index';
import * as api from '../../api/index';
import {message,Drawer,Form,Button,Input,Space} from 'antd';
// import {constant} from '../../constant';
import socket from '../../utils/socket';
import {useSelector,useDispatch} from 'react-redux';
import {reacquire} from '../../store/features/avatarSlice';
import {getFriendList,getRequestList,getNewsCount} from '../../store/features/friendSlice';
import {getGroupList,getNewsCount as getGroupNewsCount} from '../../store/features/groupSlice';

export default function Homepage() {
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const [form] = Form.useForm();

    const [funcindex,setFuncindex]=useState(0);
    const [visible,setVisible]=useState(false);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const requestList=useSelector(state=>state.friend.requestList);
    const groupList=useSelector(state=>state.group.groupList);

    const changeUserInfo=async () =>{
        setLoading(true);
        const data={...form.getFieldsValue(),id:userinfo.id};
        const result=await api.updateUser(data);
        if(result.status===200){
            let anotheruserinfo={...userinfo,...form.getFieldsValue()};
            localStorage.setItem('userInfo',JSON.stringify(anotheruserinfo));
        }else{
            message.error({content:result.message,duration:2});
        }
        setLoading(false);
    }
    const onClose=()=>{
        setVisible(false);
    }
    useEffect(()=>{
        dispatch(getRequestList(userinfo.id));
        dispatch(getFriendList(userinfo.id));
        dispatch(getGroupList(userinfo.id));
        dispatch(reacquire());
        socket.on('friend request',data=>{
            if(data?.friendid===userinfo.id){
                dispatch(getRequestList(userinfo.id));
            }
        });
        socket.on('friend agree',data=>{
            if(data?.friendid===userinfo.id){
                dispatch(getRequestList(userinfo.id));
                dispatch(getFriendList(userinfo.id));
            }
        });
        socket.on('friend news',data=>{
            console.log(data)
            if(data?.friendid===userinfo.id){
                dispatch(getNewsCount({userid:userinfo.id,friendid:data.userid}));
            }
        });
        socket.on('group news',data=>{
            console.log(data)
            if(data.members.findIndex(e=>e===userinfo.id)>-1){
                dispatch(getGroupNewsCount({userid:userinfo.id,groupid:data.groupid}));
            }
        });
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        form.setFieldsValue({name:userinfo.name,phone:userinfo.phone})
    },[visible]) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className={css.bcg}>
            <div className={css.mask}>
                <div className={css.container}>
                    <div className={css.sider}>
                        <Sider requestBadge={requestList.length} funcindex={funcindex} changeFunc={(val)=>{setFuncindex(val);navigate(router[1].children[val].path)}} changeInfo={()=>{setVisible(true)}}/>
                    </div>
                    <div className={css.list}>
                        <Search/>
                        {funcindex===0?<Chatlist/>:funcindex===1?<Friendlist userid={userinfo.id}/>:<Grouplist userid={userinfo.id}/>}
                    </div>
                    <div className={css.body}>
                        <Drawer
                            title="个人信息"
                            placement='right'
                            width={300}
                            maskStyle={{background:'rgba(0,0,0,0)'}}
                            destroyOnClose={true}
                            onClose={onClose}
                            visible={visible}
                            getContainer={false}
                            closable={false}
                            forceRender
                            style={{
                                position: 'absolute',
                            }}
                            extra={
                                <Space>
                                    <Button onClick={onClose}>取消</Button>
                                    <Button type="primary" loading={loading} onClick={changeUserInfo}> 
                                        确认
                                    </Button>
                                </Space>
                            }
                        >
                            <div className={css.modify}>
                                <div style={{marginBottom:'20px'}}>
                                    <div style={{width:64,height:64,overflow:'hidden',marginRight:'15px'}}>
                                        <Avatar/>
                                    </div>
                                    <div style={{fontSize:'15px',color:'#c0c0c0',wordBreak:'break-all'}}>账号：{userinfo?.username}</div>
                                </div>
                                <Form
                                    form={form}
                                    name="basic"
                                    autoComplete="off"
                                    preserve={false}
                                >
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required:true,
                                                message:'昵称不能为空哦'
                                            }
                                        ]}
                                    >
                                        <Input placeholder="昵称"/>
                                    </Form.Item>
                                    <Form.Item
                                        name="phone"
                                        rules={[
                                            {
                                                max:15
                                            }
                                        ]}
                                    >
                                        <Input placeholder="手机号"/>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Drawer>
                        <Suspense>
                            <Outlet/>
                        </Suspense>
                    </div>
                    <div className={css.closemodal}>
                        <div className={css.close}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

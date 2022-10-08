import React,{useEffect,useState} from 'react';
import css from './index.module.scss';
import {Input,Image,Button,message} from 'antd';
import {useDispatch,useSelector} from 'react-redux';
import {getFriendList} from '../../store/features/friendSlice';
import {constant} from '../../constant';
import * as api from '../../api/index';

function Friend() {
    const dispatch = useDispatch();
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const choose=useSelector(state=>state.friend.index);
    const friendList=useSelector(state=>state.friend.friendList);
    const [info,setInfo]=useState({});
    const [loading,setLoading]=useState(false);
    const [remark,setRemark]=useState('');

    const getInfo=(id)=>{
        friendList.map(e=>{
            if(e.id===id){
                setInfo(e);
                setRemark(e.remark);
                return undefined;
            }
            return undefined;
        })
    }
    const changeRemark=async ()=>{
        if(loading){
            return;
        }
        const reqdata={
            userid:userinfo.id,
            friendid:info.id,
            remark:remark
        };
        setLoading(true);
        const result = await api.updateRemark(reqdata);
        if(result.status===200){
            await dispatch(getFriendList(userinfo.id));
        }else{
            message.error({content:result.message,duration:2});
        }
        setLoading(false);
    }

    useEffect(()=>{
        getInfo(choose);
    },[choose]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>{choose>0?<div className={css.container}>
            <div className={css.header}>
                <Image src={info.avatar?info.avatar:constant.defaultAvatar} className={css.avatar} preview={false}></Image>
                <div>
                    {info.remark?<div className={css.beizhu}>{info.remark}</div>:<></>}
                    <div className={css.text}>昵称：{info.name}</div>
                    <div className={css.text}>账号：{info.username}</div>
                </div>
            </div>
            <div className={css.mid}>
                <div className={css.item}>
                    <div className={css.name}>备注名</div>
                    <div className={css.value}>
                        <Input bordered={false} className={css.input} value={remark} onChange={(val)=>{setRemark(val.target.value)}}></Input>
                    </div>
                    <div className={css.icon} onClick={changeRemark}></div>
                </div>
                <div className={css.phone}>
                    <div className={css.name}>手机号</div>
                    <div className={css.value}>{info.phone}</div>
                </div>
            </div>
            <Button type="primary" className={css.btn}>发消息</Button>
        </div>:<></>}</>
    )
}

export default React.memo(Friend);

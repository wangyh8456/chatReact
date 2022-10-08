import React,{useState} from 'react';
import css from './index.module.scss';
import {Image,message} from 'antd';
import {constant} from '../../constant';
import socket from '../../utils/socket';
import * as api from '../../api/index';
import {useDispatch} from 'react-redux';
import {getFriendList,getRequestList,setIndex} from '../../store/features/friendSlice';

function Index(props) {
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};

    const [loading,setLoading]=useState(false);
    const dispatch = useDispatch();

    const sendRequest=async ()=>{
        if(props?.hasAdd===1||props?.hasAdd===2||loading===true){
            return;
        }
        const reqdata={userid:userinfo.id,friendid:props.id};
        setLoading(true);
        const result = await api.addFriend(reqdata);
        if(result.status===200){
            socket.emit('add friend',reqdata);
            message.success({content:'请求发送成功！',duration:2});
            props.refetch();
        }else{
            message.error({content:result.message,duration:2});
            setLoading(false);
        }
    }
    const handleRequest=async (val)=>{
        const reqdata={userid:userinfo.id,friendid:props.id,status:val};
        setLoading(true);
        const result = await api.updateFriendStatus(reqdata);
        if(result.status===200){
            socket.emit('agree friend',reqdata);
            dispatch(getRequestList(userinfo.id));
            dispatch(getFriendList(userinfo.id));
        }else{
            message.error({content:result.message,duration:2});
            dispatch(getRequestList(userinfo.id));
            setLoading(false);
        }
    }
    const getBtn=(val)=>{
        switch (val){
            case 1:
                return (
                    <div className={css.buttonzone}>
                        <div className={props?.hasAdd===1||props?.hasAdd===2?css.disablebtn:css.btn} onClick={sendRequest}>
                            {props?.hasAdd===1?'已申请':props?.hasAdd===2?'已添加':'添加'}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={css.buttonzone}>
                        <div className={css.agree} title="同意请求" onClick={()=>{handleRequest(1)}}></div>
                        <div className={css.disagree} title="拒绝请求" onClick={()=>{handleRequest(0)}}></div>
                    </div>
                );
            default: 
                return <></>
        }
    }
    const selectIndex=async ()=>{
        if(props.mode!==3){
            return
        }else{
            await dispatch(getFriendList(userinfo.id));
            dispatch(setIndex(props.id));
        }
    }

    return (
        <div className={`${css.container} ${props?.isChoose?css.choose:''}`} onClick={selectIndex}>
            <div className={css.avatar}>
                <Image style={{borderRadius:'3px'}} preview={false} src={props.avatar?props.avatar:constant.defaultAvatar}/>
            </div>
            <div className={css.mid}> 
                <div className={css.name}>{props.remark?props.remark:props.name}</div>
                {props.mode!==3?<div className={css.news}>{props.username}</div>:<></>}
            </div>
            {getBtn(props.mode)}
        </div>
    )
}

export default React.memo(Index);

import React,{useState,useEffect, useLayoutEffect} from 'react';
import {message,Image,Modal} from 'antd';
import {constant} from'../../constant';
// import css from './index.module.scss';
import * as api from '../../api/index';
import {useSelector,useDispatch} from 'react-redux';
import {reacquire,setAvatar} from '../../store/features/avatarSlice';

// function getLocalAvatar(){
//     return JSON.parse(localStorage.getItem('userInfo'))?.avatar?JSON.parse(localStorage.getItem('userInfo')).avatar:constant.defaultAvatar;
// }

function Avatar(props) {
    const avatar=useSelector(state=>state.avatar.avatar);
    const [avatarList,setAvatarList]=useState([]);
    const [visible,setVisible]=useState(false);
    const [chooseindex,setIndex]=useState(-1);
    const [loading,setLoading]=useState(false);
    let userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null;
    const dispatch=useDispatch();

    const getAvatarList=async ()=>{
        const result=await api.getAvatarList();
        if(result.status===200){
            setAvatarList(result.data.avatar);
            setIndex(result.data.avatar.findIndex(e=>e===avatar));
            // message.success({content:result.message,duration:2});
        }else{
            message.error({content:result.message,duration:2});
        }
    }

    const changeAvatar=(val)=>{
        dispatch(setAvatar(val));
    }

    const updateAvatar=async ()=>{
        const data={
            avatar,
            id:userinfo.id
        };
        setLoading(true);
        const result=await api.updateUser(data);
        if(result.status===200){
            userinfo={...userinfo,avatar};
            localStorage.setItem('userInfo',JSON.stringify(userinfo));
            dispatch(reacquire());
        }else{
            message.error({content:result.message,duration:2});
        }
        setLoading(false);
    }

    const modify=()=>{
        if(props.cantOperate){
            return
        }
        setVisible(true);
    }

    useEffect(()=>{
        getAvatarList();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    useLayoutEffect(()=>{
        setIndex(avatarList.findIndex(e=>e===avatar));
    },[avatar]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Image preview={false} style={{width:'100%',height:'100%'}} src={avatar} onClick={()=>{modify()}}></Image>
            <Modal title="修改头像" visible={visible} 
                okButtonProps={{loading:loading}}
                onOk={()=>{updateAvatar();setVisible(false);}}
                onCancel={()=>{setVisible(false);dispatch(reacquire())}}
                destroyOnClose={true}
                maskStyle={{background:'rgba(0,0,0,0)'}}
            >
                <div style={{maxHeight:'250px',overflowY:'auto'}}>
                    {avatarList.map((e,index)=>{
                        return (
                            <div key={index} onClick={()=>{changeAvatar(e)}} style={{padding:'10px',display:'inline-block',border:chooseindex===index?'2px solid #1296db':''}}>
                                <Image src={e} style={{width:64,height:64,overflow:'hidden'}} preview={false}></Image>
                            </div>
                        )
                    })}
                </div>
            </Modal>
        </div>
    )
}

export default React.memo(Avatar);

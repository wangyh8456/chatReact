import React,{useState} from 'react';
import css from './index.module.scss';
import {Image,Badge} from 'antd';
import {constant} from '../../constant';
import {useDispatch,useSelector} from 'react-redux';
import {updateCount,setChatIndex} from '../../store/features/friendSlice';

function Index(props) {
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const dispatch = useDispatch();
    const chatindex=useSelector(state=>state.friend.chatindex);

    const selectIndex=async ()=>{
        dispatch(updateCount({id:chatindex,count:0}));
        dispatch(setChatIndex(props.id));
        dispatch(updateCount({id:props.id,count:0}));
    }
    const getTime=(val)=>{
        if(!val) return '';
        const now=new Date(Date.now()),record=new Date(val*1000);
        const nowDate=now.getDate(),recordDate=record.getDate();
        if(nowDate-recordDate===0){
            return `${record.getHours()}:${record.getMinutes().toString().padStart(2, '0')}`;
        }else if(new Date(now.setDate(nowDate-1)).getDate()===recordDate){
            return '昨天';
        }else{
            return `${record.getFullYear().toString().substr(2,4)}/${record.getMonth()+1}/${record.getDate()}`;
        }
    }

    return (
        <div className={`${css.container} ${props?.isChoose?css.choose:''}`} onClick={selectIndex}>
                <div className={css.avatar}>
                    <Badge size="default" count={props.newsCount}>
                        <Image style={{borderRadius:'3px'}} preview={false} src={props.avatar?props.avatar:constant.defaultAvatar}/>
                    </Badge>
                </div>
            <div className={css.mid}> 
                <div className={css.name}>{props.remark?props.remark:props.name}</div>
                <div className={css.news}>{props?.latestMsg?.type===2?'[图片]':props?.latestMsg?.type===1?decodeURIComponent(props?.latestMsg?.content).replace(/<br\/>|<br>/g,"\r\n").replace(/<div>|<\/div>/g,``):' '}</div>
            </div>
            <div className={`${css.buttonzone}`}>
                <div className={css.time}>{getTime(props?.latestMsg?.time)}</div>
            </div>
        </div>
    )
}

export default React.memo(Index);

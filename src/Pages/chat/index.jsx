import React,{useState,useEffect,useRef,useLayoutEffect} from 'react';
import css from './index.module.scss';
import faceList from '../../utils/face';
import {Popover,Input,Button,message,Spin,Upload} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {useDispatch,useSelector} from 'react-redux';
import {updateCount} from '../../store/features/friendSlice';
import Messagebox from '../Messagebox/Index';
import * as api from '../../api/index';
import {debounce} from '../../utils/index';
import socket from '../../utils/socket';
import {getToken} from '../../utils/auth';

function Chat() {
    const scrollel=useRef(null);
    const instance=useRef(null);
    const ipt=useRef(null);
    const dispatch=useDispatch();
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const choose=useSelector(state=>state.friend.chatindex);
    const friendList=useSelector(state=>state.friend.friendList);
    const avatar=useSelector(state=>state.avatar.avatar);
    const [info,setInfo]=useState({});
    const [pageNum,setPageNum]=useState({pageNum:1});
    const [loading,setLoading]=useState(false);
    const [sendmessage,setMessage]=useState('');
    const [messageList,setMessageList]=useState([]);
    const [range,setRange]=useState(null);
    const [listload,setListload]=useState(false);
    const [hasfinished,setHasfinished]=useState(false);
    const [needReload,setNeedReload]=useState({});

    const headerobj={
        Authorization:'Bearer '+getToken()
    }

    const changeMessage=(val)=>{
        let img = document.createElement("div");
        img.className = `emoji_base bg-${val}`;
        img.contentEditable=false;
        if(!range){
            setEndFocus();
            let selection = window.getSelection();
            let temp=selection.getRangeAt(0)
            setRange(temp);
            temp.insertNode(img);
        }else{
            range.insertNode(img);
        }
        setEndFocus();
    }
    // 问题不详，焦点不对
    const setEndFocus=()=>{
        let srcObj = ipt.current;
        let selection = window.getSelection();
        let temprange = document.createRange();
        let len = srcObj.childNodes.length
        temprange.selectNodeContents(srcObj);
        temprange.setStart(srcObj, len);
        temprange.setEnd(srcObj, len);
        selection.removeAllRanges();
        selection.addRange(temprange);
    }
    const scrollToBottom=(val)=>{
        if (instance&&instance.current) {
            instance.current.scrollIntoView(false);
        }
    }
    const scrollListener=async ()=>{
        if(hasfinished||messageList.length<1){
            return;
        }
        if(scrollel.current.scrollTop<20){
            const temp=pageNum.pageNum;
            setPageNum({pageNum:temp+1});
        }
    }
    const sendMessage=async ()=>{
        const tempcontent=ipt.current.innerHTML;
        const msg=tempcontent.replace(/<div class="emoji_base bg-(.+?)" contenteditable="false"><\/div>/g,`[*${'$1'}'*]`);
        if(!msg){
            message.warning({content:'发送内容不能为空！',duration:2});
            return ;
        }
        if(msg.length>400){
            message.warning({content:'发送内容过长！',duration:2});
            return ;
        }
        if(loading){
            return ;
        }
        const reqdata={
            userid:userinfo.id,
            content:encodeURIComponent(msg),
            friendid:info.id,
            type:1
        };
        setLoading(true);
        const result = await api.addFriendMessage(reqdata);
        if(result.status===200){
            socket.emit('friend sendMsg',{userid:userinfo.id,friendid:info.id});
            dispatch(updateCount({id:result.data.friendid,count:0,latestMsg:result.data}));
            init();
            setNeedReload({});
        }else{
            message.error({content:result.message,duration:2});
        }
        setLoading(false);
    }
    const getInfo=(id)=>{
        friendList.map(e=>{
            if(e.id===id){
                setInfo(e);
                return undefined;
            }
            return undefined;
        })
    }
    const handleKeyDown = (e) => {
        if(e.keyCode!==8){
            console.log('return?')
            return
        }
        const lastnode=ipt?.current?.lastChild;
        console.log(lastnode);
        // console.log(lastnode.nodeName)
        if(lastnode!==null){
            const arr=ipt?.current.getElementsByTagName('br');
            for(let len=arr.length,i=len-1;i>-1;i--){
                if(!arr[i]) continue;
                ipt.current.removeChild(arr[i]);
            }
        }
    }
    const init=()=>{
        if(ipt.current){
            ipt.current.innerHTML=''
        }
        setPageNum({pageNum:1});
        setHasfinished(false);
    }
    const getMessage=async ()=>{
        if(!info?.id) return;
        const reqdata={
            userid:userinfo.id,
            friendid:info.id,
            pageSize:50,
            pageNum:pageNum.pageNum
        };
        setListload(true);
        const result = await api.getFriendMessage(reqdata);
        if(result.status===200){
            if(result.data.length<1){
                setHasfinished(true);
            }else{
                const temp=pageNum.pageNum===1?result.data:result.data.concat(messageList)
                setMessageList(temp);
            }
        }else{
            message.error({content:result.message,duration:2});
        }
        setListload(false);
    }
    const beforeUpload=(file) => {
        let imgfileType=['image/gif','image/jpeg','image/jpg','image/pjpeg','image/x-png','image/png'];
        const isJPG = imgfileType.findIndex(e=>e===file.type)>0;
        let isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
            message.error({content: '上传图片只支持jpg/png/gif格式',duration:2});
        } else if (!isLt2M) {
            message.error({content: '请上传小于2MB的图片！',duration:2});
        }
        return (isJPG  && isLt2M) || Upload.LIST_IGNORE;
    }
    const handleChange =async (val) => {
        if (val.file.status === 'uploading') {
          setLoading(true);
          return;
        }
    
        if (val.file.status === 'done') {
            const reqdata={
                userid:userinfo.id,
                address:val.file.response.data,
                friendid:info.id,
                type:2
            };
            const result = await api.addFriendMessage(reqdata);
            if(result.status===200){
                socket.emit('friend sendMsg',{userid:userinfo.id,friendid:info.id});
                dispatch(updateCount({id:result.data.friendid,count:0,latestMsg:result.data}));
                init();
                setNeedReload({});
            }else{
                message.error({content:result.message,duration:2});
            }
            setLoading(false);
        }
    }

    useEffect(()=>{
        getInfo(choose);
        init();
        setMessageList([]);
    },[choose]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        getMessage();
    },[info,pageNum,needReload]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        socket.on('friend getMsg',data=>{
            if(data?.friendid===userinfo.id){
                init();
                setNeedReload({});
            }
        })
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    useLayoutEffect(()=>{
        if(messageList.length<1){
            return ;
        }
        if(pageNum.pageNum===1){
            scrollToBottom();
        }else if(pageNum.pageNum>1){
            scrollel.current.scrollTo(0,30);
        }else{
            return;
        }
    },[messageList]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>{choose>0?<div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%'}}>
            <div className={css.top}>
                {friendList.find(e=>e.id===choose).remark||friendList.find(e=>e.id===choose).name}
            </div>
            <div className={css.mid} onScroll={debounce(scrollListener,50)} ref={scrollel}>
                <div ref={instance}>
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <Spin spinning={listload} indicator={<LoadingOutlined style={{fontSize:'24px'}}/>}/>
                    </div>
                    {
                        messageList.map(e=>{
                            let bool=e.userid===userinfo.id;
                            return (
                                <Messagebox key={e.id} float={bool?'right':'left'} avatar={bool?avatar:info.avatar} content={e.content} type={e.type} address={e.address}/>
                            )
                        })
                    }
                </div>
            </div>
            <div className={css.bot}>
                <div className={`${css.funczone} clearfix`}>
                    <Popover title="表情" placement="top" content={<Face setMessage={(val)=>{changeMessage(val)}}/>} trigger="hover">
                        <div className={`${css.icon} ${css.face}`}></div>
                    </Popover>
                    <div className={`${css.icon}`}>
                        <Upload
                            beforeUpload={beforeUpload}
                            action="/api/fmessage/uploadFile"
                            listType="picture-card"
                            showUploadList={false}
                            className={`${css.upload}`}
                            headers={headerobj}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <div className={`${css.icon} ${css.bg}`}></div>
                        </Upload>
                    </div>
                </div>
                <div className={`${css.textarea}`} contentEditable={true} suppressContentEditableWarning ref={ipt}
                    onBlur={() => {
                        let selection = window.getSelection();
                        setRange(selection.getRangeAt(0));
                    }}
                    onClick={() => {
                        let selection = window.getSelection();
                        setRange(selection.getRangeAt(0));
                    }}
                    onKeyDown={(e)=>handleKeyDown(e)}
                > 
                    {sendmessage}
                </div>
                <div className="clearfix">
                    <Button type="primary" style={{width:100,height:35,float:'right'}} onClick={()=>{sendMessage()}} loading={loading}>发送</Button>
                </div>
            </div>
        </div>:<></>}</>
    )
}

function Face(props){
    return (
        <div style={{width:'200px'}}>
        {
            faceList.map((e,i)=>
                <div className={'emoji_base bg-'+e} key={i} onClick={()=>{props.setMessage(e)}}></div>
            )
        }
        </div>
    )
}

export default React.memo(Chat);

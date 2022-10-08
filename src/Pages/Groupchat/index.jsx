import React,{useState,useEffect,useRef,useLayoutEffect,useCallback} from 'react';
import css from './index.module.scss';
import faceList from '../../utils/face';
import {Popover,Input,Button,message,Spin,Upload,Drawer,Image} from 'antd';
import { LoadingOutlined,PlusOutlined } from '@ant-design/icons';
import {useDispatch,useSelector} from 'react-redux';
import {updateCount,getGroupList} from '../../store/features/groupSlice';
import Messagebox from '../Messagebox/Index';
import * as api from '../../api/index';
import {debounce} from '../../utils/index';
import socket from '../../utils/socket';
import {getToken} from '../../utils/auth';
import {constant} from '../../constant';
import Transfer from '../Transfer/Index';

function Chat() {
    const scrollel=useRef(null);
    const instance=useRef(null);
    const ipt=useRef(null);
    const dispatch=useDispatch();
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const choose=useSelector(state=>state.group.chatindex);
    const groupList=useSelector(state=>state.group.groupList);
    const friendList=useSelector(state=>state.friend.friendList);
    const avatar=useSelector(state=>state.avatar.avatar);
    const [info,setInfo]=useState({});
    const [members,setMembers]=useState([]);
    const [pageNum,setPageNum]=useState({pageNum:1});
    const [loading,setLoading]=useState(false);
    const [sendmessage,setMessage]=useState('');
    const [messageList,setMessageList]=useState([]);
    const [range,setRange]=useState(null);
    const [listload,setListload]=useState(false);
    const [hasfinished,setHasfinished]=useState(false);
    const [needReload,setNeedReload]=useState({});
    const [visible,setVisible]=useState(false);
    const [gname,setGname]=useState('');

    const [anovisible,setAnoVisible]=useState(false);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [anoloading,setAnoLoading]=useState(false);

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
    const createGroup=useCallback(
        async (val) => {
            if(val&&val.length<1){
                return;
            }
            setAnoLoading(true);
            const reqdata={
                userid:userinfo.id,
                groupid:info.groupid,
                ids:val.join(',')
            }
            const result=await api.insertGroup(reqdata);
            if(result.status===200){
                message.success({content:'邀请成功！',duration:2});
                await dispatch(getGroupList(userinfo.id));
                // let temp=val.map(e=>friendList.find(el=>el.id===e));
                // let tempmember=members;
                // setMembers([...tempmember,...temp]);
                closeModal();
            }else{
                message.error({content:result.message,duration:2});
            }
            setAnoLoading(false);
        },
        [userinfo.id,dispatch,info.groupid],
    );

    const closeModal=useCallback(
        () => {
            setAnoVisible(false);
            setTargetKeys([]);
            setSelectedKeys([]);
            setAnoLoading(false);
        },
        [],
    )
    const setTarget=useCallback(
        (val)=>{
            setTargetKeys(val);
        },
        [],
    )
    const setSelect=useCallback(
        (val)=>{
            setSelectedKeys(val);
        },
        [],
    )
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
            groupid:info.groupid,
            type:1
        };
        setLoading(true);
        const result = await api.addGroupMessage(reqdata);
        if(result.status===200){
            socket.emit('group sendMsg',{userid:userinfo.id,groupid:info.groupid,members:info.members.map(e=>e.id)});
            dispatch(updateCount({id:result.data.groupid,count:0,latestMsg:result.data}));
            init();
            setNeedReload({});
        }else{
            message.error({content:result.message,duration:2});
        }
        setLoading(false);
    }
    const updateGroupname=async ()=>{
        const reqdata={
            id:info.groupid,
            groupname:gname
        }
        const result=await api.updateGroup(reqdata);
        if(result.status===200){
            await dispatch(getGroupList(userinfo.id));
        }else{
            message.error({content:result.message,duration:2});
        }
    }
    const getInfo=(id)=>{
        groupList.map(e=>{
            if(e.groupid===id){
                setInfo(e);
                setGname(e.groupname);
                let temp=e.members;
                setMembers(temp.map(el=>{
                    const idx=friendList.findIndex(e=>e.id===el.id);
                    if(idx>-1&&friendList[idx].remark){
                        return {...el,remark:friendList[idx].remark}
                    }else{
                        return el;
                    }
                }));
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
            groupid:info.groupid,
            pageSize:50,
            pageNum:pageNum.pageNum
        };
        setListload(true);
        const result = await api.getGroupMessage(reqdata);
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
    const onClose=()=>{
        setVisible(false);
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
                groupid:info.groupid,
                type:2
            };
            const result = await api.addGroupMessage(reqdata);
            if(result.status===200){
                socket.emit('group sendMsg',{userid:userinfo.id,groupid:info.groupid,members:info.members.map(e=>e.id)});
                dispatch(updateCount({id:result.data.groupid,count:0,latestMsg:result.data}));
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
        getInfo(choose);
    },[groupList]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        getMessage();
    },[info,pageNum,needReload]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        socket.on('group getMsg',data=>{
            if(data.members.findIndex(e=>e===userinfo.id)>-1){
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
                {groupList.find(e=>e.groupid===choose).groupname}
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
                                <Messagebox key={e.id} float={bool?'right':'left'} avatar={bool?avatar:e.avatar} content={e.content} type={e.type} address={e.address}/>
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
                            action="/api/gmessage/uploadFile"
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
                    <div className={`${css.icon} ${css.set}`} onClick={()=>{setVisible(true)}}></div>
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
                <Drawer
                    title="群聊信息"
                    placement='right'
                    width={250}
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
                >
                <div className={css.modify}>
                    <div style={{borderBottom:'1px solid #c0c0c0'}} className='clearfix'>
                        {members.map(e=>(
                            <div key={e.id} style={{margin:'0 15px 15px 0',float:'left',width:48}}>
                                <Image preview={false} style={{width:48,height:48,overflow:'hidden'}} src={e.avatar?e.avatar:constant.defaultAvatar}></Image>
                                <div style={{textAlign:'center',whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden',cursor:'pointer'}} title={e.remark?e.remark:e.name}>{e.remark?e.remark:e.name}</div>
                            </div>
                        )
                        )}
                        <div style={{margin:'0 15px 15px 0',float:'left',width:48,height:48,border:'1px dashed #c0c0c0',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>{setAnoVisible(true)}}>
                            <PlusOutlined style={{color:'#c0c0c0'}}/>
                        </div>
                    </div>
                    <div className={css.item}>
                        <div className={css.name}>群名称</div>
                        <div className={css.value}>
                            <Input className={css.input} value={gname} onChange={(val)=>{setGname(val.target.value)}}></Input>
                            <div className={css.seticon} onClick={()=>{updateGroupname()}}></div>
                        </div>
                    </div>
                </div>
            </Drawer>
            <Transfer title="邀请成员" visible={anovisible} loading={anoloading} dataSource={friendList.filter(e=>members.findIndex(el=>el.id===e.id)<0)} selectedKeys={selectedKeys} targetKeys={targetKeys} onOk={createGroup} onCancel={closeModal} setSelectedKeys={setSelect} setTargetKeys={setTarget}></Transfer>
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

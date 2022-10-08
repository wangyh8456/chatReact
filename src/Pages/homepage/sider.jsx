import React,{useState,useCallback} from 'react';
import css from './index.module.scss';
import {Popover,Badge, message,Modal} from 'antd';
import Avatar from './avatar';
import {useSelector,useDispatch} from 'react-redux';
import {getGroupList} from '../../store/features/groupSlice';
import Transfer from '../Transfer/Index';
import * as api from '../../api/index';
import Pwdmodal from './pwdmodal';

function Sider(props) {
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const {funcindex,changeFunc,requestBadge}=props;
    const [visible,setVisible]=useState(false);
    const [isModalVisible,setIsModalVisible]=useState(false);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [loading,setLoading]=useState(false);
    const msgCount=useSelector(state=>state.friend.msgCount);
    const groupmsgCount=useSelector(state=>state.group.msgCount);
    const friendList=useSelector(state=>state.friend.friendList);
    const dispatch=useDispatch();

    const content=(
        <div style={{cursor:'pointer'}}>
            <div style={{paddingBottom:'10px',borderBottom:'1px solid #e6e6e6'}} onClick={props.changeInfo}>修改资料</div>
            <div style={{margin:'10px 0'}} onClick={()=>{changepwd()}}>修改密码</div>
            <div style={{paddingTop:'10px',borderTop:'1px solid #e6e6e6'}} onClick={()=>{setVisible(true)}}>创建群聊</div>
            <div style={{paddingTop:'10px',margin:'10px 0',borderTop:'1px solid #e6e6e6'}} onClick={()=>{logout()}}>退出登录</div>
        </div>
    )
    const closeModal=useCallback(
        () => {
            setVisible(false);
            setTargetKeys([]);
            setSelectedKeys([]);
            setLoading(false);
        },
        [],
    )
    const createGroup=useCallback(
        async (val) => {
            if(val&&val.length<1){
                return;
            }
            setLoading(true);
            const reqdata={
                userid:userinfo.id,
                name:userinfo.name,
                ids:val.join(',')
            }
            const result=await api.addGroup(reqdata);
            if(result.status===200){
                message.success({content:'发起群聊成功！',duration:2});
                await dispatch(getGroupList(userinfo.id));
                closeModal();
            }else{
                message.error({content:result.message,duration:2});
            }
            setLoading(false);
        },
        [userinfo.id,userinfo.name,dispatch,closeModal],
    );
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
    const changepwd=()=>{
        setIsModalVisible(true);
    }
    const logout=()=>{
        localStorage.removeItem('userInfo');
        localStorage.removeItem('Token');
        window.history.replaceState(null, null, '/login');
        window.location.reload();
    }

    return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div className={css.avatar}>
                <Avatar/>
            </div>
            <Badge count={msgCount} size="small">
            <div className={`${css.icon} ${funcindex===0?css.iconChatActive:css.iconChat}`} onClick={()=>{changeFunc(0)}} title="聊天"></div>
            </Badge>
            <Badge count={requestBadge} size="small">
                <div className={`${css.icon} ${funcindex===1?css.iconFriendActive:css.iconFriend}`} onClick={()=>{changeFunc(1)}} title="通讯录"></div>
            </Badge>
            <Badge count={groupmsgCount} size="small">
                <div className={`${css.icon} ${funcindex===2?css.iconGroupActive:css.iconGroup}`} onClick={()=>{changeFunc(2)}} title="我的群聊"></div>
            </Badge>
            <Popover placement="rightBottom" content={content} trigger="click">
                <div className={`${css.icon} ${css.iconMenu}`} title="菜单"></div>
            </Popover>
            <Modal title="修改密码" visible={isModalVisible} onCancel={()=>{setIsModalVisible(false)}}
                bodyStyle={{maxHeight:'700px',overflowY:'auto'}}
                footer={null}
                style={{top:'50px'}}
                destroyOnClose={true}
            >
                <Pwdmodal close={()=>{setIsModalVisible(false);logout();}}></Pwdmodal>
            </Modal>
            <Transfer title="创建群聊" visible={visible} loading={loading} dataSource={friendList} selectedKeys={selectedKeys} targetKeys={targetKeys} onOk={createGroup} onCancel={closeModal} setSelectedKeys={setSelect} setTargetKeys={setTarget}></Transfer>
        </div>
    )
}

export default React.memo(Sider)

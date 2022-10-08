import React,{useState} from 'react';
import css from './search.module.scss';
import {Input,Popover,message} from 'antd';
import {debounce} from '../../utils/index';
import NewFriendCell from '../NewFriendCell/Index';
import * as api from '../../api/index';

function Search() {
    const userinfo=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{};
    const [users,setUsers]=useState([]);
    const [word,setWord]=useState('');
    const searchUser=async (val)=>{
        const keyword=val[0].target.value;
        setWord(val);
        if(!keyword){
            setUsers([]);
            return
        }
        const result=await api.searchNewFriend({userid:userinfo.id,keyword});
        if(result.status===200){
            setUsers(result.data);
        }else{
            message.error({content:result.message,duration:2});
        }
    }
    const refetch=()=>{
        searchUser(word);
    }

    return (
        <div className={css.search}>
            <div style={{background:'#ececec',width:'90%',height:'30px',borderRadius:'3px',position:'relative',padding:'0 0 0 25px'}}>
                <div className={css.searchIcon}></div>
                <Popover placement="bottomLeft" content={<NewFriend list={users} refetch={refetch}/>} trigger="click" title="添加好友">
                    <Input maxLength={16} bordered={false} style={{width:'100%',height:'100%',background:'#ececec'}} allowClear onChange={debounce(searchUser,100)}></Input>
                </Popover>
            </div>
        </div>
    )
}

const NewFriend=React.memo((props)=>{
    const {list,refetch} = props;
    return (
        <div style={{width:'300px'}}>
            {list.map(e=>{
                return <NewFriendCell key={e.id} mode={1} refetch={refetch} {...e}/>
            })}
        </div>
    )
})

export default React.memo(Search);
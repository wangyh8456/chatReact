import React from 'react';
import css from './index.module.scss';
import {Image} from 'antd';
import ChatCell from '../ChatCell/Index';
import {useSelector} from 'react-redux';

function Index() {
    const friendList=useSelector(state=>state.friend.friendList);
    const choose=useSelector(state=>state.friend.chatindex);

    return (
        <div className={css.container}> 
            {friendList.map(e=>{
                return <ChatCell isChoose={e.id===choose?true:false} key={e.id} {...e}/>
            })}
        </div>
    )
}

export default React.memo(Index)

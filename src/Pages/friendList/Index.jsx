import React from 'react';
import css from './index.module.scss';
import NewFriendCell from '../NewFriendCell/Index';
import {useSelector} from 'react-redux';
// import {getFriendList} from '../../store/features/friendSlice';

function Index(props) {
    const requestList=useSelector(state=>state.friend.requestList);
    const friendList=useSelector(state=>state.friend.friendList);
    const choose=useSelector(state=>state.friend.index);

    // const dispatch=useDispatch();

    return (
        <div className={css.container}>
            {requestList.length>0?<div className={css.title}>好友请求</div>:<></>}
            {requestList.map(e=>{
                return <NewFriendCell key={e.id} mode={2} {...e}/>
            })}
            <div className={css.title}>好友</div>
            {friendList.map(e=>{
                return <NewFriendCell key={e.id} isChoose={e.id===choose?true:false} mode={3} {...e}/>
            })}
        </div>
    )
}

export default React.memo(Index)

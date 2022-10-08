import React from 'react';
import css from './index.module.scss';
import GroupCell from '../GroupCell/Index';
import {useSelector} from 'react-redux';

function Index() {
    const groupList=useSelector(state=>state.group.groupList);
    const choose=useSelector(state=>state.group.chatindex);

    return (
        <div className={css.container}> 
            {groupList.map(e=>{
                return <GroupCell isChoose={e.groupid===choose?true:false} key={e.id} {...e}/>
            })}
        </div>
    )
}

export default React.memo(Index)

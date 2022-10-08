import React from 'react';
import {Image} from 'antd';
import {constant} from '../../constant';
import css from './index.module.scss';

function Index(props) {
    return (
        <div className='clearfix'>
            {props.float==='left'?(
                <div style={{float:props.float}} className={css.container}>
                    <Image preview={false} src={props.avatar?props.avatar:constant.defaultAvatar} className={css.avatar}></Image>
                    <div className={css.lrect}>
                        <div className={css.ltri}></div>
                        {props.type===1?(
                            <div className={css.lcontent}
                                dangerouslySetInnerHTML={{__html: decodeURIComponent(props.content).replace(/<br\/>/g,"\r\n").replace(/\[\*(.+?)\*\]/g,`<div class='emoji_base bg-${'$1'}'></div>`)}}>
                            </div>
                        ):(
                            <div className={css.lcontent}>
                                <Image src={props.address} className={css.imgbox}></Image>
                            </div>
                        )}
                    </div>
                </div>
            ):(
                <div style={{float:props.float}} className={css.container}>
                    <div className={css.rrect}>
                        <div className={css.rtri}></div>
                        {props.type===1?(
                            <div className={css.rcontent} style={{background:'#1296db'}}
                                dangerouslySetInnerHTML={{__html: decodeURIComponent(props.content).replace(/<br\/>/g,"\r\n").replace(/\[\*(.+?)\*\]/g,`<div class='emoji_base bg-${'$1'}'></div>`)}}>
                            </div>
                        ):(
                            <div className={css.rcontent} style={{background:'#1296db'}}>
                                <Image src={props.address} className={css.imgbox}></Image>
                            </div>
                        )}
                    </div>
                    <Image preview={false} src={props.avatar?props.avatar:constant.defaultAvatar} className={css.avatar}></Image>
                </div>
            )}
        </div>
    )
}

export default React.memo(Index);

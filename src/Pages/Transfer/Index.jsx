import React from 'react';
import css from './index.module.scss';
import {Transfer,Modal,message} from 'antd';
import { useState } from 'react';

function Index(props) {
    const {targetKeys,selectedKeys,setTargetKeys,setSelectedKeys}=props;

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    return (
        <div>
            <Modal title={props.title} visible={props.visible} 
                okButtonProps={{loading:props.loading}}
                onOk={()=>{props.onOk(targetKeys)}}
                onCancel={()=>{props.onCancel()}}
                destroyOnClose={true}
                maskStyle={{background:'rgba(0,0,0,0)'}}
            >
                <Transfer 
                    dataSource={props.dataSource}
                    titles={['好友列表', `已选择${targetKeys.length}人`]}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={onChange}
                    onSelectChange={onSelectChange}
                    render={(item) => item.remark?item.remark:item.name}
                    oneWay
                    style={{
                        marginBottom: 16,
                    }}
                    rowKey={record => record.id}
                ></Transfer>
            </Modal>
        </div>
    )
}

export default React.memo(Index);

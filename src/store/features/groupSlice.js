import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import * as api from '../../api/index';

const initialState={
    index:-1,
    chatindex:NaN,
    groupList:[],
    msgCount:0,
};

export const getGroupList=createAsyncThunk('group/groupList',async (userid)=>{
    let result = await api.getGroups({userid});
    return result;
})

export const getNewsCount=createAsyncThunk('group/getNewsCount',async (val)=>{
    const {userid,groupid}=val;
    const result=await api.getOneGroupNews({userid,groupid});
    return {...result,userid,groupid};
})

export const groupSlice = createSlice({
    name:'group',
    initialState,
    reducers:{
        setIndex(state,{payload}){
            state.index=payload;
        },
        setChatIndex(state,{payload}){
            state.chatindex=payload;
        },
        setGroupList(state,{payload}){
            state.groupList=payload;
        },
        updateCount(state,{payload}){
            const index=state.groupList.findIndex(e=>e.groupid===payload.id);
            if(index<0){
                return;
            }
            const temp={...state.groupList[index]};
            state.groupList[index]={...temp,newsCount:payload.count,latestMsg:payload.latestMsg?payload.latestMsg:temp.latestMsg};
            state.groupList.sort(function(a,b){
                if(a?.latestMsg?.time&&b?.latestMsg?.time){
                    return b?.latestMsg?.time-a?.latestMsg?.time;
                }else{
                    return 0;
                }
            });
            let tempCount=0;
            state.groupList.forEach(e=>{
                if(e.newsCount&&e.newsCount>0){
                    tempCount+=e.newsCount;
                }
            });
            state.msgCount=tempCount;
        },
        updateLatestMsg(state,{payload}){
            const index=state.groupList.findIndex(e=>e.groupid===payload.groupid);
            if(index<0){
                return;
            }
            state.groupList[index].latestMsg=payload;
            state.groupList.sort(function(a,b){
                if(a?.latestMsg?.time&&b?.latestMsg?.time){
                    return b?.latestMsg?.time-a?.latestMsg?.time;
                }else{
                    return 0;
                }
            });
        }
    },
    extraReducers:{
        [getGroupList.fulfilled](state, { payload }) {
            if(payload.status===200){
                state.groupList=payload.data.sort(function(a,b){
                    if(a?.latestMsg?.time&&b?.latestMsg?.time){
                        return b?.latestMsg?.time-a?.latestMsg?.time;
                    }else{
                        return 0;
                    }
                });
            }
        },
        [getNewsCount.fulfilled](state, { payload }) {
            if(!payload){
                return ;
            }
            if(payload.status===200){
                const index=state.groupList.findIndex(e=>e.groupid===payload.groupid);
                if(index<0){
                    return;
                }
                const temp={...state.groupList[index]};
                state.groupList[index]={...temp,newsCount:payload.data.newMsg,latestMsg:payload.data.latestMsg};
                state.groupList.sort(function(a,b){
                    if(a?.latestMsg?.time&&b?.latestMsg?.time){
                        return b?.latestMsg?.time-a?.latestMsg?.time;
                    }else{
                        return 0;
                    }
                });
            }
            let tempCount=0;
            state.groupList.forEach(e=>{
                if(e.newsCount&&e.newsCount>0){
                    tempCount+=e.newsCount;
                }
            });
            state.msgCount=tempCount;
        },
    }
})

export const {setIndex,setChatIndex,updateCount,updateLatestMsg} = groupSlice.actions;

export default groupSlice.reducer;
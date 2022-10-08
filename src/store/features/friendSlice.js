import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import * as api from '../../api/index';

const initialState={
    index:-1,
    chatindex:NaN,
    requestList:[],
    friendList:[],
    msgCount:0
};

export const getFriendList=createAsyncThunk('friend/friendList',async (userid)=>{
    let result = await api.getFriendList({userid});
    // console.log(result)
    return result;
})

export const getRequestList=createAsyncThunk('friend/requestList',async (userid)=>{
    const result = await api.getFriendRequest({userid});
    return result;
})

export const getNewsCount=createAsyncThunk('friend/getNewsCount',async (val)=>{
    const {userid,friendid}=val;
    const result=await api.getOneFriendNews({userid,friendid});
    return {...result,userid,friendid};
})

export const friendSlice = createSlice({
    name:'friend',
    initialState,
    reducers:{
        setIndex(state,{payload}){
            state.index=payload;
        },
        setChatIndex(state,{payload}){
            state.chatindex=payload;
        },
        setRequestList(state,{payload}){
            state.requestList=payload;
        },
        setFriendList(state,{payload}){
            state.friendList=payload;
        },
        updateCount(state,{payload}){
            const index=state.friendList.findIndex(e=>e.id===payload.id);
            if(index<0){
                return;
            }
            const temp={...state.friendList[index]};
            state.friendList[index]={...temp,newsCount:payload.count,latestMsg:payload.latestMsg?payload.latestMsg:temp.latestMsg};
            state.friendList.sort(function(a,b){
                if(a?.latestMsg?.time&&b?.latestMsg?.time){
                    return b?.latestMsg?.time-a?.latestMsg?.time;
                }else{
                    return 0;
                }
            });
            let tempCount=0;
            state.friendList.forEach(e=>{
                if(e.newsCount&&e.newsCount>0){
                    tempCount+=e.newsCount;
                }
            });
            state.msgCount=tempCount;
        },
        updateLatestMsg(state,{payload}){
            const index=state.friendList.findIndex(e=>e.id===payload.friendid);
            if(index<0){
                return;
            }
            state.friendList[index].latestMsg=payload;
            state.friendList.sort(function(a,b){
                if(a?.latestMsg?.time&&b?.latestMsg?.time){
                    return b?.latestMsg?.time-a?.latestMsg?.time;
                }else{
                    return 0;
                }
            });
        }
    },
    extraReducers:{
        [getFriendList.fulfilled](state, { payload }) {
            if(payload.status===200){
                state.friendList=payload.data.sort(function(a,b){
                    if(a?.latestMsg?.time&&b?.latestMsg?.time){
                        return b?.latestMsg?.time-a?.latestMsg?.time;
                    }else{
                        return 0;
                    }
                });
            }
        },
        [getRequestList.fulfilled](state, { payload }) {
            if(payload.status===200){
                state.requestList=payload.data;
            }
        },
        [getNewsCount.fulfilled](state, { payload }) {
            if(payload.status===200){
                const index=state.friendList.findIndex(e=>e.id===payload.friendid);
                if(index<0){
                    return;
                }
                const temp={...state.friendList[index]};
                state.friendList[index]={...temp,newsCount:payload.data.newMsg.length,latestMsg:payload.data.latestMsg};
                state.friendList.sort(function(a,b){
                    if(a?.latestMsg?.time&&b?.latestMsg?.time){
                        return b?.latestMsg?.time-a?.latestMsg?.time;
                    }else{
                        return 0;
                    }
                });
            }
            let tempCount=0;
            state.friendList.forEach(e=>{
                if(e.newsCount&&e.newsCount>0){
                    tempCount+=e.newsCount;
                }
            });
            state.msgCount=tempCount;
        },
    }
})

export const {setIndex,setChatIndex,updateCount,updateLatestMsg} = friendSlice.actions;

export default friendSlice.reducer;
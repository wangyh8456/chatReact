import {createSlice} from '@reduxjs/toolkit';
import {constant} from'../../constant';

function getLocalAvatar(){
    return JSON.parse(localStorage.getItem('userInfo'))?.avatar?JSON.parse(localStorage.getItem('userInfo')).avatar:constant.defaultAvatar;
}

const initialState={
    avatar:getLocalAvatar(),
};

export const avatarSlice = createSlice({
    name:'avatar',
    initialState,
    reducers:{
        reacquire(state){
            state.avatar=getLocalAvatar();
        },
        setAvatar(state,{payload}){
            state.avatar=payload;
        }
    }
})

export const {reacquire,setAvatar} = avatarSlice.actions;

export default avatarSlice.reducer;
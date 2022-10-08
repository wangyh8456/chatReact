import {configureStore} from '@reduxjs/toolkit';

import avatarSlice from './features/avatarSlice';
import friendSlice from './features/friendSlice';
import groupSlice from './features/groupSlice';

export const store = configureStore({
    reducer:{
        avatar:avatarSlice,
        friend:friendSlice,
        group:groupSlice
    }
})


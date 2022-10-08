/* 
    可配置多级路由，添加权限修改Layout中的createMenu方法，
    createMenu方法会将router数组第一个对象渲染到侧边栏，其它路由隐藏，如登录、打印、404页面
*/
import {lazy} from 'react'
import Login from '../Pages/Login';
import Home from '../Pages/homepage';
import {Navigate} from 'react-router-dom';

const Chat=lazy(()=>{return import('../Pages/chat')});
const Friend=lazy(()=>{return import('../Pages/Friend')});
const Groupchat=lazy(()=>{return import('../Pages/Groupchat')});

const router=[
    { path: "/login", element: <Login /> },
    {  element: <Home />,
        children:[
            {path: "/chat", element: <Chat />},
            {path: "/friend", element: <Friend />},
            {path: "/group", element: <Groupchat />},
        ]
    },
    { path:"*",element:<Navigate to="/chat"/>},
]
export default router
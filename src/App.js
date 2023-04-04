import {useRoutes} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN'; 
import router from './router/index';
import './App.css';

function App() {
  return (
    <div style={{width:'100%',height:'100%'}}>
      <ConfigProvider locale={zhCN}>  
          {useRoutes(router)}
      </ConfigProvider>
    </div>
  );
}

export default App;

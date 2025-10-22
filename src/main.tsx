import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'antd/dist/reset.css';
import { ConfigProvider, App as AntdApp } from "antd";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
           <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1e3a8a",
              borderRadius: 8,
            },
          }}
        >
          <AntdApp>
            <App />
          </AntdApp>
        </ConfigProvider>
  </StrictMode>,
)

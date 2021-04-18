import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

export const Portal = ({children} : {children: ReactNode}) => ReactDOM.createPortal(children, document.getElementById("portal") || document.createElement("portal"));


ReactDOM.render(
  <React.StrictMode>
    <App />
    <div id="portal"></div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

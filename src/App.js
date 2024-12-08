import { useScrollTrigger } from '@mui/material';
import './App.css';
import Chat from './Chat';
import { useState } from 'react';
// import { Login } from '@mui/icons-material';
import LoginForm from './LoginForm';
function App() {
const[menuSection, setMenuSection] = useState('login');

  // const handleLogin = (e) => {
  //   const code = e.target.value;
  //   if(code == 8111 || code == 8112){
  //       setMenuSection('chat');  
  //   }else{
  //     setMenuSection('login');
  //   }
  // }
  return (
  <>
 {menuSection == 'login' ?
  
  <LoginForm setMenuSection={setMenuSection}/>

   : menuSection == 'chat' ?
    <Chat setMenuSection={setMenuSection} />

  :
<h1>djdsh</h1>
  }
  </>
  );
}

export default App;

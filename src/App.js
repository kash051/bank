import {Routes, Route} from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Register from './components/Register';
import {UserContextProvider} from './UserContext'
import Signin from './components/Signin';
import Header from './Header';
import Account from './components/Account';
import Loan from './components/Loan';
import Transfer from './components/Transfer';


function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path = "/" element = {<Signin/>}/>
        <Route path ="/register" element = {<Register/>}/>
        <Route path ="/signin" element = {<Signin/>}/>
        <Route path ="/homepage" element = {<Homepage/>}/>
        <Route path ="/header" element = {<Header/>}/>
        <Route path ="/account" element = {<Account/>}/>
        <Route path ="/transfer" element = {<Transfer/>}/>
        <Route path ="/loan" element = {<Loan/>}/>
      </Routes>  
    </UserContextProvider>
    
  );
}
 
export default App;

import React from 'react'
import "./styles/Header.css"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from './UserContext';
import { signOut } from 'firebase/auth';
import {auth} from './config/firebase'


const Header = () => {
  const {setUserInfo,userInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  
  const signout=async()=>{
    try{
      await signOut(auth)
      console.log("succ logout")
      setUserInfo(null);
      setRedirect(true);
    }
    catch(err){
      console.log(err);
    }
  }
  return (
    <div>
      <nav>
        <div class="wrapper">
          <div class="logo"><Link to ="/homepage">MyBank</Link></div>
          <ul class="nav-links">
            <label for="close-btn" class="btn close-btn"><i class="fas fa-times"></i></label>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/transfer">Transfer</Link></li>
            <li><a href="http://localhost:8501/">Loan</a></li>
            <li><Link to="/">Logout</Link></li>


          </ul>
          <label for="menu-btn" class="btn menu-btn"><i class="fas fa-bars"></i></label>
        </div>
      </nav>

      
    </div>
  )
}

export default Header
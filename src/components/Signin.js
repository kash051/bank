import React, { useContext } from 'react'
import {auth} from '../config/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { useState } from 'react';
import {UserContext} from '../UserContext';
import { Link, Navigate } from 'react-router-dom';
import '../styles/Signin.css'


const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setUserInfo} = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);


    const signin= async()=>{
        try{
            let userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user= userCredentials.user;
            setUserInfo(user.email);
            console.log("signin succ");
            setRedirect(true);
      
          }catch(err){
            alert("Wrong credentials")
            console.error();  
          }
    }
    if(redirect===true){
      return <Navigate to ={"/homepage"}/>
    }
    return (
      <div className='Container'>
        <div className='formbox'>
          <h1>Sign In</h1>
          <input className="i" placeholder='Email' onChange={e=>setEmail(e.target.value)} value = {email}></input>
          <br/>
          <input className="i" placeholder='Password' onChange={e=>setPassword(e.target.value)} value = {password} type='password'></input>
          <br/>
          <button className='form-button' onClick={signin}>Sign In</button>
          <br></br>
          <br/>
          <br/>
          <br/>
          <p>Don't have an account?</p>
          <Link to='/register'>Register</Link>
        </div>
      </div>
      
    )
  
}

export default Signin
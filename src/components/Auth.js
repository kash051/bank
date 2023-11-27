import React from 'react';
import {auth} from '../config/firebase';
import {createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import { useState } from 'react';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = async ()=>{  
    try{
      await createUserWithEmailAndPassword(auth, email, password);

    }catch(err){
      console.error();  
    }
  };

  const logout= async()=>{
    try{
      await signOut(auth);

    }catch(err){
      console.error();  
    }
  }
  return (
    <div>
        <input placeholder='email' onChange={e=>setEmail(e.target.value)} value = {email}></input>
        <input placeholder='password' onChange={e=>setPassword(e.target.value)} value = {password} type='password'></input>
        <button onClick={signIn}>Register</button>
        <br/>
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Auth
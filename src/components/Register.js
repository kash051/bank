import React from 'react'
import {auth} from '../config/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {addDoc , collection} from 'firebase/firestore'
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
import {db} from '../config/firebase'
import '../styles/Register.css'
import Swal from 'sweetalert2';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("Male");
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo, userInfo} = useContext(UserContext);

  const usersCollectionRef = collection(db, "users");


    const accNoGenerator=()=>{
      const min = 234567;
      const max = 888888;
      const a = Math.floor(Math.random() * (max - min + 1)) + min;
      return a;
    }
    const register = async ()=>{  
      try{
        //creating new user
        let userCredentials=await createUserWithEmailAndPassword(auth, email, password);
        const user= userCredentials.user;
        setUserInfo(user.email);
        Swal.fire({
          title: "Registeration successful",
          text: "You have been logged in",
          icon: "success"
        });
        setRedirect(true);

        //adding information to firestore

        await addDoc(usersCollectionRef, {Email: user.email, 
          Name: name, 
          Gender: gender, 
          AccountNo: accNoGenerator(),
          AccountBal: 10000
        })
      }catch(err){
        console.error();  
      }
    };
  
    if(redirect===true){
      return <Navigate to ={"/homepage"}/>
    }
    return (
      <div className='Container'>
        <div className='formbox'>
          <h1>Register</h1>
          <input placeholder='Email' onChange={e=>setEmail(e.target.value)} value = {email}></input>
          <br/>
          <input placeholder='Password' onChange={e=>setPassword(e.target.value)} value = {password} type='password'></input>
          <br/>
          <input type = "text" placeholder='Name' onChange={e=>setName(e.target.value)} value = {name}></input>
          <br/>
          <select value={gender} onChange={e=>setGender(e.target.value)} >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <br/>
          <button className='form-button' onClick={register}>Register</button>
          <br/>
          <p>Already have an account?</p>
          <Link to='/signin'>Sign In</Link>
        </div>
      </div>
    )

}

export default Register
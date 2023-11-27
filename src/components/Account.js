import React from 'react'
import Header from '../Header'
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import {getDocs,collection , query , where, doc, deleteDoc} from 'firebase/firestore';
import {db} from '../config/firebase';
import Swal from 'sweetalert2';
import { Link, Navigate } from 'react-router-dom';
import {auth} from '../config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Account = () => {
  const {setUserInfo,userInfo} = useContext(UserContext);
  const usersCollectionRef = collection(db, "users");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [AccountBal, setAccountBal] = useState(0);
  const [AccountNo  , setAccountNo] = useState(0);
  const [redirect, setRedirect] = useState(false);

  

  useEffect(() => {
    const getUserInfo= async ()=>{
      try{  
        const A = getAuth();
        onAuthStateChanged(A, async (user) => {
          if (user) {
            console.log(user.email)

            setUserInfo(user.email);


            const q =query(usersCollectionRef , where("Email", "==" ,user.email));
            const userData = await getDocs(q);
            userData.forEach((doc) => {
              setGender(doc.data().Gender);
              setName(doc.data().Name);
              setAccountBal(doc.data().AccountBal);
              setAccountNo(doc.data().AccountNo);
              
            });
          } 
        });

        
      }catch(err){
        console.error(err);
      }
    }
    getUserInfo();
  }, [])

  const confirmDeleteAccount= async()=>{
    const q = query(usersCollectionRef, where("Email", "==", userInfo));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docu) => {
      const userId = docu.id;
      await deleteDoc(doc(db,"users",userId));
    });

    var user =auth.currentUser;

    user.delete().then(function() {
      console.log("user deleted succ")
    }).catch(function(err) {
      console.error(err)
    });

    setRedirect(true);
  }

  const handleDeleteAccount=()=>{
    Swal.fire({
      title: "This is a permanent action. Are you sure you want to delete account?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDeleteAccount()
      } 
    });
  }
  if(redirect===true){
    return <Navigate to ={"/"}/>
  }
  return (
    <div>
        <Header></Header>
        <div className='Container'>
        <div className='form'>
        <h1 style={{paddingTop: '100px'}}> Account Details</h1>
        <br/>
        <h3>Logged in as : {userInfo}</h3>
        <br/>
        <h3>Name : {name}</h3>
        <br/>
        <h3>Gender : {gender}</h3>
        <br/>
        <h3>Account number : {AccountNo}</h3>
        <br/>
        <h3>Account balance : {AccountBal}</h3>
        <br/>
        <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
        </div>
    </div>
  )
}

export default Account
import React, { useEffect } from 'react'
import Header from '../Header'
import { useState,useContext } from 'react';
import { UserContext } from '../UserContext';
import {getDocs,collection , query , where, doc, updateDoc, addDoc} from 'firebase/firestore';
import {db} from '../config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Swal from 'sweetalert2';

const Transfer = () => {
  const [transferAmount, setTransferAmount] = useState();
  const [transferAccountNumber, setTransferAccountNumber] = useState();
  const {setUserInfo,userInfo} = useContext(UserContext);
  const [AccountNo  , setAccountNo] = useState(0);
  const [Outgoing , setOutgoing] = useState();
  const [Incoming, setIncoming] = useState();
  const [counter, setCounter] = useState(0);
  const usersCollectionRef = collection(db, "users");
  const transactionCollectionRef = collection(db, "transactions");


  useEffect(() => {
    const getUserInfo= async ()=>{
      try{  
        const A = getAuth();
        onAuthStateChanged(A, async (user) => {
          if (user) {
            setUserInfo(user.email);
            
            const q =query(usersCollectionRef , where("Email", "==" ,user.email));
            const userData = await getDocs(q);
            userData.forEach(async (doc) => {
              setAccountNo(doc.data().AccountNo);
              const q=query(transactionCollectionRef, where("SenderAccountNo","==",doc.data().AccountNo));
              const data = await getDocs(q);

              const filteredData = data.docs.map((doc)=>({...doc.data()}));
              setOutgoing(filteredData);

              const q2=query(transactionCollectionRef, where("ReceiverAccountNo","==",doc.data().AccountNo));
              const data2 = await getDocs(q2);
              const filteredData2 = data2.docs.map((doc)=>({...doc.data()}));
              setIncoming(filteredData2);
            });
            
          } 
        });
      }catch(err){
        console.error(err);
      }
    }
    getUserInfo();
  }, [counter])


  const handleTransfer=async()=>{
    const q = query(usersCollectionRef, where("Email", "==", userInfo));
    var currBal;
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docu) => {
      currBal = docu.data().AccountBal;
      console.log(AccountNo);
      if(currBal>=transferAmount){
        await updateDoc(doc(db, "users", docu.id), {AccountBal: (currBal-transferAmount)});
      }
    });

    if(currBal<transferAmount){
      alert("Not enough money in account");
    }
    else{

      const q = query(usersCollectionRef, where("AccountNo", "==", parseInt(transferAccountNumber)));
      const querySnapshot = await getDocs(q);      
      querySnapshot.forEach(async (docu) => {
        const newBal=parseInt(docu.data().AccountBal)+parseInt(transferAmount);
          try{

            await updateDoc(doc(db, "users", docu.id), {AccountBal: parseInt(newBal)});
            Swal.fire({
              title: "Transfer successful",
              text: "The money has been sent",
              icon: "success"
            });

            addTransaction();
            setCounter(1);
          }
          catch(err){
            console.error(err);
          }
      });
    }
  }

  const dateHelper=()=>{
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    return(currentDate)
  }

  const addTransaction= async()=>{
    await addDoc(transactionCollectionRef, {
      SenderAccountNo:AccountNo,
      ReceiverAccountNo:parseInt(transferAccountNumber),
      TransferAmount: transferAmount,
      Date:dateHelper()
    })
  }

  return (
    <div>
        <Header></Header>
        <h1 style={{paddingTop: '100px'}}> transfer</h1>

        <input placeholder='Account number' onChange={e=>setTransferAccountNumber(e.target.value)} value = {transferAccountNumber}></input>
        <br/>
        <input placeholder='Transfer amount ₹' onChange={e=>setTransferAmount(e.target.value)} value = {transferAmount}></input>
        <br/>
        <button onClick={handleTransfer}>Send money!</button>



        <div class="container-table">
        <h2>Outgoing</h2>
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col col-2">Sent to</div>
            <div class="col col-3">Amount</div>
            <div class="col col-4">Date</div>
          </li>
          {Outgoing?.map((transaction)=>(
            <li class="table-row">
             <div class="col col-2" data-label="Customer Name">{transaction.ReceiverAccountNo}</div>
             <div class="col col-3" data-label="Amount">{transaction.TransferAmount}</div>
             <div class="col col-4" data-label="Payment Status">{transaction.Date}</div>
           </li>
          ))}
        </ul>
        </div>


        <div class="container-table">
        <h2>Incoming</h2>
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col col-2">Recieved from</div>
            <div class="col col-3">Amount</div>
            <div class="col col-4">Date</div>
          </li>
          {Incoming?.map((transaction)=>(
            <li class="table-row">
             <div class="col col-2" data-label="Customer Name">{transaction.ReceiverAccountNo}</div>
             <div class="col col-3" data-label="Amount">{transaction.TransferAmount}</div>
             <div class="col col-4" data-label="Payment Status">{transaction.Date}</div>
           </li>
          ))}
        </ul>
        </div>

    </div>
  )
}

export default Transfer
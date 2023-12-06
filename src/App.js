import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [creditCardNumber, setcreditCardNumber] = useState("")
  const [messageObj, setMessageObj] = useState(null)
  const [checkingInProgress, setCheckingInProgress] = useState(false);

  const checkCard = async (creditCardNumber) => {
    const parsedCreditCardNumber = (creditCardNumber || "").toString().trim().split(".").join("").split("-").join("")
    setMessageObj(null);
    setCheckingInProgress(true);
    try {
      // const response = await axios.post("http://localhost:8080/checkCreditCard", {
      //   card_number : parsedCreditCardNumber
      // });
      const response = await axios.post("https://creditcardbackend.onrender.com/checkCreditCard", {
        card_number : parsedCreditCardNumber
      });
      const { isCreditCardValid } =  response?.data || {};
      if(isCreditCardValid){
        setMessageObj({
          type : "success",
          message : "credit card is valid"
        })
      } else {
        setMessageObj({
          type : "error",
          message : "credit card is not valid"
        })
      }
      setCheckingInProgress(false);
    } catch (error) {
      const { errorMessage } = error?.response?.data || {};
      setMessageObj({
        type : "error",
        message : errorMessage
      })
      setCheckingInProgress(false);
    }
  }

  return (
    <div className="pageContainer">
      <div className="card">
        <p>Enter Credit Card Number</p>
        <input 
          placeholder="441712345XXXXXX" 
          value={creditCardNumber} 
          onChange={(e)=>{setcreditCardNumber(e.target.value)}}
          type="number"
        />
        {
          checkingInProgress ? 
          <p>Checking...</p> 
          :
          <button disabled={checkingInProgress} onClick={()=>{checkCard(creditCardNumber)}}>Check Card</button>
        }
        
        {messageObj && 
        <div className="messageWrapper">
          <p className={messageObj?.type === "success" ? "success" : "error"}>{messageObj?.message}</p>
        </div>
        }
      </div>
    </div>
  );
}

export default App;

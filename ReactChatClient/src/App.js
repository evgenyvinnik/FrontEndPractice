import React, {useEffect, useState} from 'react';
import axios from 'axios';

import './App.css';
import 'amazon-connect-chatjs';

function App() {
  let AmazonConnect = window.connect;
  const [chatResult, setChatResult] = useState({});
  const [session, setSession] = useState();


  const [inputValue, setInputValue] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  const apiGatewayEndpoint = 'https://ntdtxbt3vf.execute-api.us-east-1.amazonaws.com/Prod/'
  var initiateChatRequest = {
    ParticipantDetails: {
        DisplayName: 'AdrianCustomer'
    },
    ContactFlowId: '8b87d0de-9883-4745-9479-0abf68801bc8',
    InstanceId: 'ac9744f5-ee87-404c-85b6-40bacee5a018'
  };

  useEffect(() => {
    console.log('Setting global config');
    AmazonConnect.ChatSession.setGlobalConfig({
      region: "us-east-1"
    });
    console.log('global config set');
  },[AmazonConnect.ChatSession]);


  useEffect(() => {
    console.log('Requesting initiate chat');

    axios.post(apiGatewayEndpoint, initiateChatRequest).then(res => {
        console.log('Start Chat Result');
        console.log(res.data.data.startChatResult);
        setChatResult(res.data.data.startChatResult);
        setSession(AmazonConnect.ChatSession.create({
          chatDetails: res.data.data.startChatResult,
          type: 'CUSTOMER'
        }));
    })
  }, []);

  useEffect(() => {
    if(session) {
      console.log('Test');
      session.connect().then((response) => {
        console.log("successful connection: " + JSON.stringify(response));
      }, (error) => {
        console.log("unsuccessful connection " + JSON.stringify(error));
      });
      session.onMessage((message) => {
        console.log("Received message: " + JSON.stringify(message));

        setReceivedMessages(receivedMessages => [...receivedMessages, message.data.Content]);
      });
      session.onConnectionEstablished((data) => {
        setReceivedMessages(receivedMessages => [...receivedMessages, 'CONNECTION ESTABLISHED']);
      })
    }
  },[session]);

  const handleClick = () => {
    session.controller.sendMessage({
      message: inputValue,
      contentType: "text/plain"
    })
  }

  const handleInput = (e) => {
    setInputValue(e.target.value);
  }

console.log('receivedMessages', receivedMessages);
  return (
    <div>
      <header>
        <h1>Amazon Connect - REACT Test</h1>
      </header>
      <br></br>
      <br></br>
      <div>
        Test area for chat:
        <ul>
        {receivedMessages.map(message => {
          return <li>{message}</li>;
        })}
        </ul>
      </div>
      <input onChange={handleInput}></input>
      <button onClick={handleClick}>Send</button>
    </div>
  );
}

export default App;

import React, { useContext, useState, useRef, useEffect } from 'react'
import Contact from '../components/Contact';
import Logo from '../components/Logo';
import axios from 'axios';
import { uniqBy } from 'lodash';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const divUnderMessages = useRef();

  useEffect(() => {
    axios.get('/user/profile').then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket('wss://spotlounge-backend.onrender.com');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected, Trying to reconnect');
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      setMessages(prev => ([...prev, { ...messageData }]))
    }
  }

  function sendMessage(e, file = null) {
    if (e) { e.preventDefault() };
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file,
    }));
    if (file) {
      axios.get('/user/messages/' + selectedUserId).then(response => {
        setMessages(response.data);
      });
    } else {
      setNewMessageText('');
      setMessages(prev => ([...prev, {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      }]));
    }
  }

  function sendFile(e) {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behaviour: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/user/people').then(response => {
      const offlinePeopleArr = response.data
        .filter(p => p._id !== id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    })
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get('/user/messages/' + selectedUserId).then(response => {
        setMessages(response.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  return (
    <div className='flex h-screen'>
      <div className='bg-[#191414] w-1/3 flex flex-col'>
        <div className='flex-grow'>
          <Logo username={username} />
          {Object.keys(onlinePeopleExclOurUser).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId} />
          ))}
          {Object.keys(offlinePeople).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId} />
          ))}
        </div>
        <div className="p-2 text-[#00df9a]">
          Welcome, {username}!
        </div>
      </div>
      <div className='flex flex-col bg-[#212121] w-2/3 p-2'>
        <div className='flex-grow'>
          {!selectedUserId && (
            <div className='flex h-full flex-grow items-center justify-center'>
              <div className='text-gray-500'>&larr; Selected a person from the sidebar</div>
            </div>
          )}
          {!!selectedUserId && (
            <div className='relative h-full'>
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map(message => (
                  <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
                    <div className={"text-left inline-block p-2 my-2 rounded-md text-md " + (message.sender === id ? 'bg-green-500 text-white' : 'bg-white text-gray-500')}>
                      {message.text}
                      {message.file && (
                        <div className=''>
                          <a target="blank" className='flex items-center gap-1 border-b' href={axios.defaults.baseURL + '/uploads/' + message.file}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className='flex gap-2' onSubmit={sendMessage}>
            <input type='text'
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder='Type your message here'
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 bg-white flex-grow border p-2' />
            <label className="bg-green-200 p-2 text-gray-600 cursor-pointer">
              <input type="file" className='hidden' onChange={sendFile} />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>

            </label>
            <button type="submit" className='bg-green-500 p-2 text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Messages
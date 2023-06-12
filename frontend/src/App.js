import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/chats' element={<ChatPage/>}/>
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;

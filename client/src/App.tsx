import PersonaSelector from './components/PersonaSelector'
import ChatWindow from './components/ChatWindow'
import { ChatStore } from './store/chatStore';

const App = () => {
  const {selectedPersona} = ChatStore()
  return (
    <div>
      {selectedPersona ? (<ChatWindow/>): (<PersonaSelector/>)}
    </div>
  )
}

export default App
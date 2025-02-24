import { useState } from 'react'
import './App.css'
import FetchExaxmple from './components/FetchExample'
import Button from '@mui/material/Button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


// Create a client
const queryClient = new QueryClient()

function App() {
  const [count, setCount] = useState(0)

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Button variant="contained" onClick={() => setCount(count + 1)}>Hello world</Button>
      <p>Count: {count}</p>
      <FetchExaxmple count={count} />
    </QueryClientProvider>
  )
}

export default App

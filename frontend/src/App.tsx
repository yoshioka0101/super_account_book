import './index.css';
import { useState } from 'react'
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex flex-col'>
        <Button onClick={() => setCount((count) => count + 1)}>
          up
        </Button>
        <Button onClick={() => setCount((count)=> count -1 )}>
         down
         </Button>
         <p>
          {count}
         </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

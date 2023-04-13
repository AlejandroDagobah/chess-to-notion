import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <img src="/pieces-chess-1.png" className='fixed left-32'/>
        <img src="/pieces-chess-2.png" className='fixed right-24'/>
        <div className='bg-container w-3/4 h-[550px] flex flex-col items-center justify-between p-20 bg-glass-gradient rounded-lg backdrop-blur-md border border-white '>
          <img src="/chess-to-notion.png" className='w-80'/>
          <div className='flex flex-row gap-4'>
            <div>
              <label htmlFor="start_date" className='font-bold'>Start Date</label><br/>
              <input type="date" name='start_date'/>

            </div>
            <div>
              <label htmlFor="end_date" className='font-bold'>End Date</label><br/>
              <input type="date" name='end_date'/>
            
            </div>

          </div>
          <div>
              <label htmlFor="users" className='font-bold'>Usuarios</label><br/>
              <input type="text" name='users'/>
            </div>

        </div>
    </main>
  )
}

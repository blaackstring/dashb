import React from 'react'
import AiResponse from './AiResponse'

function Templatechildren({children, data}) {
  return (
    <div className='flex flex-col    sm:flex-col md:flex-col  justify-center items-center w-full'>
      {children}
      <div className=' w-full flex justify-center items-center p-4 rounded-lg shadow-lg'>
        <AiResponse data={data} />
      </div>
    </div>
  )
}

export default Templatechildren

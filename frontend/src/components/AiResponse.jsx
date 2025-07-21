import React, { useEffect, useState } from 'react'
import { SendingRequest } from '../../services/Request';

function AiResponse({data}) {
    const [isAsking, setIsAsking] = useState(false);
    const [response, setResponse] = useState(null);

   const handleAsk = async () => {
  try {
    setIsAsking(true);
    const response = await SendingRequest(data);

    if (response.content) {
      // Remove intro phrase
      let response1 = response.content.replace(/^Based on the provided data, here are some insights:\s*/i, '');

      // Split into numbered parts and trim
      const parts = response1.split(/\d+\.\s\n*/).filter(Boolean).map(point => point.trim());

      // Optional: remove section headers like "**Event Characteristics**"
      const cleanedParts = parts
        .map(p => p.replace(/\*\*.*?\*\*/g, '').trim())
        .filter(p => p.length > 0);

      // Join back with numbering and spacing
      const cleanedResponse = cleanedParts
        .map((point, idx) => `${idx + 1}. ${point}`)
        .join('\n\n');

      console.log("AI Response:", cleanedResponse);
      setResponse(cleanedResponse);
    }
  } catch (error) {
    console.error("Error during AI response:", error);
  } finally {
    setIsAsking(false);
  }
};


    useEffect(() => {
      console.log(response);
      
    }, [response]);
  return  <div>
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleAsk}>
          Ask AI
      </button>
    <div>
        {isAsking&&<>
        <div>
            Loading...
        </div>
        </>}
          {response && (
        <div className='mt-4 p-4 bg-gray-100 rounded'>
            <h3 className='text-lg font-semibold'>AI Response:</h3>
            <p>{response}</p>
        </div>
    )}
    </div>
  </div>
}

export default AiResponse

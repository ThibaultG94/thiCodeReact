import React from 'react'
import useChatStore from '../../store/chatStore'

const ErrorMessage = () => {
  const { error, clearError } = useChatStore()
  
  if (!error) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg flex items-center">
      <div className="mr-3">
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-bold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
      <button 
        onClick={clearError}
        className="ml-4 text-red-700 hover:text-red-900"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default ErrorMessage

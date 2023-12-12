import React from 'react'

export default function Pagination({goToNextPage, goToPreviousPage}) {
  return (
    <div>
      {goToPreviousPage && <button onClick={goToPreviousPage}> Previous</button>}
      {goToNextPage && <button onClick={goToNextPage}> Next </button> }
    
    </div>
  )
}

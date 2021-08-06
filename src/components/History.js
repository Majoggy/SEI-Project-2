function History({ fullHistory, handleLink }) {
  // Creates new object so original array is not reversed
  const reverseInput = (inputs) => {
    const outputs = [ ...inputs ]
    return (outputs.reverse())
  }

  
  return (
    <div className='container'>
      <div className='box border'>
        <div className='columns multiline'>
          {reverseInput(fullHistory).map((word, index) => {
            return (
              <div key={index} className='column'>
                <button className='button is-warning' onClick={handleLink}>{word}</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default History
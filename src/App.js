import Search from './components/Search'

function App() {
  console.log('My key', process.env.REACT_APP_MY_API_KEY)
  return (
    <>
      <Search />
    </>
  )
}

export default App

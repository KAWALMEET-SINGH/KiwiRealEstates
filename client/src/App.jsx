import { useState } from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoutes from './components/PrivateRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Header/>
                <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route element={<PrivateRoutes/>}>
            <Route path='/profile' element={<Profile/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

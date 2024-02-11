import { useState } from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoutes from './components/PrivateRoutes'
import CreateListing from './pages/CreateListing'
import UpdateLisitng from './pages/UpdateLisitng'
import Listing from './pages/Listing'
import Search from './pages/Search'

function App() {

  return (
    <>
      <Router>
        <Header/>
                <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/listing/:listingId' element={<Listing/>}/>
          <Route path='/search' element={<Search/>}/>

          <Route element={<PrivateRoutes/>}>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/create-listing' element={<CreateListing/>}/>
            <Route path='/update-listing/:listingId' element={<UpdateLisitng/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

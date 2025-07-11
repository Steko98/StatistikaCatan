import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import NavBarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'



function App() {


  return (
    <Container>
      <NavBarEdunova />

      <Routes>
        <Route path={RouteNames.HOME} element={<Pocetna />}/>
      </Routes>
      
    </Container>    
  )
}

export default App

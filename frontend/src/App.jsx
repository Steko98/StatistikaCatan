import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import NavBarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import TurniriPregled from './pages/turniri/TurniriPregled'



function App() {


  return (
    <Container>
      <NavBarEdunova />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />}/>
          <Route path={RouteNames.TURNIR_PREGLED} element={<TurniriPregled />}/>
        </Routes>
      </Container>
      <hr />

      &copy;Ivan Šteko

    </Container>    
  )
}

export default App

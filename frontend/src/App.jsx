import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import NavBarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import TurniriPregled from './pages/turniri/TurniriPregled'
import IgraciPregled from './pages/igraci/IgraciPregled'
import RekordiPregled from './pages/rekordi/RekordiPregled'



function App() {


  return (
    <Container>
      <NavBarEdunova />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />}/>
          <Route path={RouteNames.TURNIR_PREGLED} element={<TurniriPregled />}/>
          <Route path={RouteNames.IGRACI_PREGLED} element={<IgraciPregled />}/>
          <Route path={RouteNames.REKORDI_PREGLED} element={<RekordiPregled />}/>
        </Routes>
      </Container>
      <hr />

      &copy;Ivan Šteko

    </Container>    
  )
}

export default App

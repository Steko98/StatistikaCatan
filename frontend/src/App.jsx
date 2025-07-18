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
import TurniriDodaj from './pages/turniri/TurniriDodaj'
import IgraciDodaj from './pages/igraci/IgraciDodaj'
import RekordiDodaj from './pages/rekordi/RekordiDodaj'
import TurniriPromjeni from './pages/turniri/TurniriPromjeni'



function App() {


  return (
    <Container>
      <NavBarEdunova />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />}/>

          <Route path={RouteNames.TURNIR_PREGLED} element={<TurniriPregled />}/>
          <Route path={RouteNames.TURNIR_NOVI} element={<TurniriDodaj/>}/>
          <Route path={RouteNames.TURNIR_PROMJENI} element={<TurniriPromjeni/>} />

          <Route path={RouteNames.IGRACI_PREGLED} element={<IgraciPregled />}/>
          <Route path={RouteNames.IGRAC_NOVI} element={<IgraciDodaj/>}/>

          <Route path={RouteNames.REKORDI_PREGLED} element={<RekordiPregled />}/>
          <Route path={RouteNames.REKORD_NOVI} element={<RekordiDodaj/>}/>

        </Routes>
      </Container>
      <hr />

      &copy;Ivan Šteko

    </Container>    
  )
}

export default App

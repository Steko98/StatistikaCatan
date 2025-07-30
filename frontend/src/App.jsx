import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import NavBarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import TurniriPregled from './pages/turniri/TurniriPregled'
import TurniriDodaj from './pages/turniri/TurniriDodaj'
import TurniriPromjeni from './pages/turniri/TurniriPromjeni'
import IgraciPregled from './pages/igraci/IgraciPregled'
import IgraciDodaj from './pages/igraci/IgraciDodaj'
import IgraciPromjeni from './pages/igraci/IgraciPromjeni'
import IgrePregled from './pages/igre/IgrePregled'
import IgreDodaj from './pages/igre/IgreDodaj'
import IgrePromjeni from './pages/igre/IgrePromjeni'
import ClanoviPregled from './pages/igre/ClanoviPregled'
import ClanoviDodaj from './pages/igre/ClanoviDodaj'
import ClanoviPromjeni from './pages/igre/ClanoviPromjeni'

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

          <Route path={RouteNames.IGRE_PREGLED} element={<IgrePregled/>}/>
          <Route path={RouteNames.IGRE_NOVI} element={<IgreDodaj/>}/>
          <Route path={RouteNames.IGRE_PROMJENI} element={<IgrePromjeni/>}/>

          <Route path={RouteNames.IGRACI_PREGLED} element={<IgraciPregled />}/>
          <Route path={RouteNames.IGRAC_NOVI} element={<IgraciDodaj/>}/>
          <Route path={RouteNames.IGRAC_PROMJENI} element={<IgraciPromjeni/>}/>

          <Route path={RouteNames.CLAN_PREGLED} element={<ClanoviPregled/>}/>
          <Route path={RouteNames.CLAN_NOVI} element={<ClanoviDodaj/>}/>
          <Route path={RouteNames.CLAN_PROMJENI} element={<ClanoviPromjeni/>}/>
        </Routes>
      </Container>
      <hr />

      &copy;Ivan Šteko

    </Container>    
  )
}

export default App

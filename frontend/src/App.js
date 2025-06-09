import Container from 'react-bootstrap/Container';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route, Routes} from 'react-router-dom';
import {UserProvider} from './context/UserContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Catalog from './pages/Catalog';

function App() {
  return (
    <Router>
      <Container className='containerApp'>
        <Routes>
          {/* <Route path='' element={<Register />} /> */}
          {/* <Route path='' element={<Login />} /> */}
          <Route path='' element={<Catalog />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

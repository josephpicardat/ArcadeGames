import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Layout from './components/Routing/Layout';

const App = () => {
    return (
        <Router>
            <MainRoutes />
        </Router>
    );
};

const MainRoutes = () => {
    return (
        <Routes>
            <Route
                path='/'
                element={<Layout content='home' />}
            />
            <Route
                path='/pong'
                element={<Layout content='pong' />}
            />
            <Route
                path='/phaserPong'
                element={<Layout content='phaserTest' />}
            />
            <Route
                path='/snake'
                element={<Layout content='snake' />}
            />
        </Routes>
    );
};

Layout.propTypes = {
    content: PropTypes.string,
};

export default App;

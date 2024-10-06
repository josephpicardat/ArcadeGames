import { useLocation } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import Display from '../../assets/Display.jpeg';
import Pong from '../../pages/Pong/Pong';
import PhaserConfig from '../../pages/PhaserTurtorial/PhaserConfig';

const routeToMainComponents = {
    '/pong': () => (
        <section
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundImage: `url(${Display})`,
                backgroundRepeat:
                    'no-repeat' /* Prevent the image from repeating */,
                backgroundPosition:
                    'center center' /* Center the image both horizontally and vertically */,
                backgroundSize:
                    'cover' /* Ensure the image covers the entire container */,
            }}>
            <Pong />
        </section>
    ),
    '/phaserTutorial': () => (
        <section
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundImage: `url(${Display})`,
                backgroundRepeat:
                    'no-repeat' /* Prevent the image from repeating */,
                backgroundPosition:
                    'center center' /* Center the image both horizontally and vertically */,
                backgroundSize:
                    'cover' /* Ensure the image covers the entire container */,
            }}>
            <PhaserConfig />
        </section>
    ),

    '/': Home,
};

const MainContainer = () => {
    const location = useLocation();
    const MainComponent = routeToMainComponents[location.pathname];

    return (
        <main style={{ flex: '1' }}>{MainComponent && <MainComponent />}</main>
    );
};

export default MainContainer;

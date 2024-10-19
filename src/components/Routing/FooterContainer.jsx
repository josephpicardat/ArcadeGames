import { useLocation } from 'react-router-dom';

import SimpleFooter from '../SimpleFooter';

const routeToFooter = {
    '/pong': SimpleFooter,
    '/phaserPong': SimpleFooter,
    '/snake': SimpleFooter,
    '/flappybird': SimpleFooter,
};

const Footer = () => {
    const location = useLocation();
    const FooterComponent = routeToFooter[location.pathname];

    return (
        <footer style={{ display: 'flex', justifyContent: 'center' }}>
            {FooterComponent && <FooterComponent />}
        </footer>
    );
};

export default Footer;

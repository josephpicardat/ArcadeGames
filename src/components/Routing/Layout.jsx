import PropTypes from 'prop-types';
import Main from './MainContainer';
import Footer from './FooterContainer';

const Layout = ({ content }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
            <Main
                content={content}
                style={{ flex: 1 }}
            />
            <Footer content={content} />
        </div>
    );
};

Layout.propTypes = {
    content: PropTypes.string,
};

export default Layout;

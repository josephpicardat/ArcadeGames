import { Link } from 'react-router-dom';

const SimpleFooter = () => {
    return (
        <footer
            style={{
                position: 'fixed',
                bottom: '0',
                width: '100%',
                backgroundColor: 'black',
                zIndex: '5',
            }}>
            <div style={{ display: 'flex', width: '35%', margin: 'auto' }}>
                <ul
                    style={{
                        display: 'flex',
                        listStyleType: 'none',
                        width: '100%',
                        padding: '.8em',
                        margin: 'auto',
                        justifyContent: 'center',
                    }}>
                    <li style={{ margin: '0 1rem' }}>
                        <Link
                            to='/'
                            style={{
                                textDecoration: 'none',
                                color: '#cccccc',
                            }}>
                            Home
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default SimpleFooter;

import React from 'react';
import { Container } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import GitHub from './assets/github_icon.jpg';

// const styles = {
//     fontFamily: "'Press Start 2P'",
//     fontWeight: "16px",
// }    

const Home = () => {
    return (
        <Container align="center">
            <h1>trade money without any border</h1>

            <Container>
            <a href='https://github.com/Gernar/pear2pear'>
                <Image src={GitHub} />
            </a>
            </Container>
        </Container>
    );
}

export default Home;
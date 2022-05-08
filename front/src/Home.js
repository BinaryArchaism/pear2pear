import React from 'react';
import { Container } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import GitHub from './assets/github.png';

const Home = () => {
    return (
        <Container align="center" >
            <h1 className={"mt-5 mb-5"}>TRADE WITHOUT LIMITS</h1>
            <div className={"position-absolute top-50 start-50 translate-middle"}>
                <h3>Some text...</h3>
            </div>
            <div className={"row m-5 d-flex align-items-end w-25 position-absolute bottom-0 start-50 translate-middle-x"}>
                <h6 className={"col-sm"}>Watch source code on</h6>
                <a className={"col-sm"} href='https://github.com/BinaryArchaism/pear2pear'>
                    <Image src={GitHub} />
                </a>
            </div>
        </Container>
    );
}

export default Home;
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navibar from "./Components/Navibar";
import {Container} from "react-bootstrap";
import Sellers from "./Components/Sellers";

function App() {
    return (
        <Container>
            <Navibar />
            <Sellers />
        </Container>
    );
}

export default App;

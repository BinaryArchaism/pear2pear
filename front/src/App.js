import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navibar from "./Navibar";
import {Container} from "react-bootstrap";
import Sellers from "./Sellers";
import Home from "./Home";
import SellModal from './SellModal';

const App = () => {
    const [account, setAccount] = useState([]);
    const [currentPage, setCurrentPage] = useState();

    function showPageToRender() {
        switch(currentPage) {
            case 'Home':
                return <Home account={account} setAccount={setAccount}/>;
            case 'Sellers': 
                return <Sellers account={account} setAccount={setAccount}/>;
            case 'Sell': 
                return <SellModal account={account} setCurrentPage={setCurrentPage}/>;
            default:
                return <Home />;
          };
    }

    return (
        <Container>
            <Navibar account={account} setAccount={setAccount} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            {showPageToRender()}
        </Container>
    );
}

export default App;

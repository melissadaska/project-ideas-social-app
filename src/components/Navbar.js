import React, { Component } from 'react';
import Link from 'react-router-dom/Link';

import { AppBar } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
import { Button } from '@material-ui/core';

export class Navbar extends Component {
    render() {
        return (
            <AppBar position="fixed">
                <Toolbar className="container"> 
                    <Button color="inherit" component={Link} to="/login" >Login</Button>
                    <Button color="inherit" component={Link} to="/" >Home</Button>
                    <Button color="inherit" component={Link} to="/signup" >Sign Up</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Navbar;

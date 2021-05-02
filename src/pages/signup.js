import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = ({
    typography: {
        useNextVariants: true
      },
      form: {
        textAlign: 'center'
      },
      pageTitle: {
          margin: '10px auto 10px auto'
      },
      textField: {
          margin: '10px auto 10px auto'
      },
      Button: {
          marginTop: 20,
          position: 'relative'
      },
      customError: {
          color: 'red',
          fontSize: '0.8rem',
          marginTop: 10
      },
      progress: {
          position: 'absolute'
      }
})

export class signup extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            errors: {}
        }
 }
 

 handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
        loading: true
    });
    const newuserData = {
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
        handle: this.state.handle
    }
    axios.post('/signup', newuserData)
    .then( response => {
        console.log(response.data);
        localStorage.setItem('FBIdToken', `Bearer ${response.data.token}`);
        this.setState({
            loading: false
        });
        this.props.history.push('/');
    })
    .catch(err => {
        this.setState({
            error: err.response.data,
            loading: false
        })
    })
};

 handleChange = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    });
 };

    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;
        return (
            <Grid container className={classes.form}>
              <Grid item sm />
              <Grid item sm>
                <Typography variant="h2" className={classes.pageTitle}>
                  SignUp
                </Typography>
                <form noValidate onSubmit={this.handleSubmit}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    className={classes.textField}
                    helperText={errors.email}
                    error={errors.email ? true : false}
                    value={this.state.email}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    className={classes.textField}
                    helperText={errors.password}
                    error={errors.password ? true : false}
                    value={this.state.password}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    className={classes.textField}
                    helperText={errors.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="handle"
                    name="handle"
                    type="text"
                    label="Handle"
                    className={classes.textField}
                    helperText={errors.handle}
                    error={errors.handle ? true : false}
                    value={this.state.handle}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  {errors.general && (
                    <Typography variant="body2" className={classes.customError}>
                      {errors.general}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="default"
                    className={classes.button}
                    disabled={loading}
                  >
                    SignUp
                    {loading && (
                      <CircularProgress size={30} className={classes.progress} />
                    )}
                  </Button>
                  <br />
                  <small>
                    Already have an account ? Login <Link to="/login">here</Link>
                  </small>
                </form>
              </Grid>
              <Grid item sm />
            </Grid>
          );
    }
}

signup.propTypes = {
    classes: propTypes.object.isRequired
}

export default withStyles(styles)(signup);


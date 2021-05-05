import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import propTypes from 'prop-types';

import Project from '../components/Project';
import Profile from '../components/Profile';

import { connect } from 'react-redux';
import { getProjects } from '../redux/actions/dataActions';

class home extends Component {
    
  componentDidMount() {
    this.props.getProjects();
  }
  render() {
    const { projects, loading } = this.props.data;
    let recentProjectsMarkup = !loading ? (
        projects.map((project) =>  
        <Project key={project.projectId} project={project}/>)
    ) : ( 
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentProjectsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
            <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getProjects: propTypes.func.isRequired,
  data: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps, 
  { getProjects }
)(home);

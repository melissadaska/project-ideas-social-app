import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Project from '../components/Project';
import StaticProfile from '../components/StaticProfile';
import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
    state = {
        profile: null,
        projectIdParam: null
    };
    componentDidMount(){
        const handle = this.props.match.params.handle;
        const projectId = this.props.match.params.projectId;

    if(projectId) this.setState({ projectIdParam: projectId });

        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
        .then (response => {
            this.setState({
                project: response.data.user
            })
        })
        .catch(err => console.log(err));
    }
    render() {
        const { projects, loading } = this.props.data;
        const { projectIdParam } = this.state;

        const projectMarkup = loading ? (
            <p>loading data...</p>
        ) : projects === null ? (
            <p>No projects from this user</p>
        ) : !projectIdParam ? (
            projects.map(project => <Project key={project.projectId} project={project} />)
        ) : (
            projects.map(project => {
                if(project.projectId !== projectIdParam)
                return <Project key={project.projectId} project={project} />
                else return <Project key={project.projectId} project={project} openDialog />
            })
        )
        return (
            <Grid container spacing={10}>
            <Grid item sm={8} xs={12}>
              {projectMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {this.state.profile === null ? (
                    <p>Loading profile...</p>
                ) : (
                    <StaticProfile profile={this.state.profile} />
                )}
            </Grid>
          </Grid>  
        )
    }
}

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getUserData })(user);

import React from 'react';
import PropTypes from 'prop-types'
import noImg from '../assets/images/no-avatar.png';
import withStyles from "@material-ui/core/styles/withStyles";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";

// MUI
import CardMedia from '@material-ui/core/CardMedia';

const styles = (theme) => ({
    card: {
        display: 'flex',
        marginBottom: 20,
        filter: 'blur(1px)'
    },
    cardContent: {
        width: '100%',
        flexDirection: 'column',
        padding: 25
    },
    cover: {
        minWidth: 200,
        objectFit: 'cover'
    },
    handle: {
        width: 60,
        height: 18,
        backgroundColor: theme.palette.primary.main,
        marginBottom: 7
    },
    date: {
        height: 14,
        width: 100,
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginBottom: 10
    },
    fullLine: {
        height: 15,
        width: '90%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        marginBottom: 10
    },
    halfLine: {
        height: 15,
        width: '50%',
        marginBottom: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
    }

});

const ScreamSkeleton = (props) => {
    const {classes} = props;
    const content = Array.from({length: 5}).map((item, index) => {
        return (
            <Card className={classes.card} key={index}>
                <CardMedia className={classes.cover} image={noImg}>

                </CardMedia>
                <CardContent className={classes.cardContent}>
                    <div className={classes.handle}/>
                    <div className={classes.date}/>
                    <div className={classes.fullLine}/>
                    <div className={classes.fullLine}/>
                    <div className={classes.halfLine}/>
                </CardContent>
            </Card>
        )
    });
    return (
        <React.Fragment>
            {content}
        </React.Fragment>
    );
};

ScreamSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScreamSkeleton);
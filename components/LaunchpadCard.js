import { useState , useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import {IconButton, useTheme, Button} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ArrowUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown'
import { Typography } from "@material-ui/core";
import { makeStyles, StylesContext } from "@material-ui/core/styles";
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Link from "next/link";
import Image from "next/image";
import { SportsKabaddi } from "@material-ui/icons";
const useStyles = makeStyles(theme => { 
  
  const first = alpha(theme.palette.background.paper, 0.9);
  const second = alpha(theme.palette.background.default, 0.9);
  let bgi = 'url(/paper-texture-light.jpg)';
  if (theme.palette.type=='dark') { 
    bgi='';
  }
  return {
    root: {
      flexBasis: '50em',
      borderRadius: '2em !important',
      transition: 'all 0.8s ease',
      filter: 'drop-shadow(9px 5px 8px rgba(0,0,0,0.25))',
      backgroundColor: theme.palette.background.paper,
      backgroundImage: bgi,
      backgroundSize: '600px',
      width: '100%',
      //minHeight: '400px',
      display: 'flex',
      flexDirection:'column',
      width: '550px'
    },
    actionArea: { 
      height: '100%'
    },
    cardContent: { 
      '& a': { 
        '&:hover': { 
          color: theme.palette.secondary.main,
          transition: `color 0s ease`
        },
        transition: `color 0.8s ease`,
        textDecoration: 'none',
        color: theme.palette.primary.main,
      },
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'space-between',
      height:'100%',
      marginTop: 'auto',
      marginBottom:'auto',
      flexGrow: 1,
      gap: '10px'
    },
    media: {
      height: 490,
    },
  };
});
const LaunchpadCard = (props) => {
  const {page, categorySlug, categoryTitle} = props;
  const theme = useTheme();
  const classes = useStyles(props);

  return (
    <Card className={classes.root} raised={true} variant="elevation">
    <Link href={'/launchpad/'+categorySlug+'/'+page.slug}>
      <CardActionArea className={classes.actionArea}>
      <CardContent className={classes.cardContent}>
      <div style={{position:'relative', width: '100%', height: '400px', border:'1px solid rgba(0,0,0,0.5)', borderRadius: '7px', boxShadow: '1px 1px 5px 1px rgba(0,0,0,0.3)'}}>
      <Image
          className={classes.media}
          src={'/launchpad/'+page.thumbnail}
          layout="fill"
          title={categoryTitle}
          objectFit="cover"
          style={{borderRadius: '7px', border: '1px solid rgba(0,0,0,0.5)'}}
        />
      </div>
        <Typography variant="h5">
        {categoryTitle}
        </Typography>
        
        <Typography style={{flexGrow: 1}}>
          {page.description}
        </Typography>
        
      </CardContent>
      </CardActionArea>
      </Link>
      
    
  </Card>
  );
}
LaunchpadCard.propTypes = {
  page: PropTypes.object.isRequired,
  categorySlug: PropTypes.string.isRequired,
  categoryTitle: PropTypes.string.isRequired
};
export default LaunchpadCard;
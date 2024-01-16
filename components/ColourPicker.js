import { useState , useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import {IconButton, useTheme, Button, Popover} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ArrowUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown'
import {Modal} from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { makeStyles, StylesContext } from "@material-ui/core/styles";
import { alpha } from '@material-ui/core/styles/colorManipulator';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from "next/image";
import {useHeadingsData} from '../utils/Hooks';
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';

import { ChromePicker } from 'react-color'

const ColourPicker = (props) => {
  const {colour, onChange, disableAlpha} = props;
  const theme = useTheme();
  
  const [pickerOpen, setPickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const useStyles = makeStyles(theme => { 
    const first = alpha(theme.palette.background.paper, 0.9);
    const second = alpha(theme.palette.background.default, 0.9);
    let bgi = 'url(/paper-texture-light.jpg)';
    if (theme.palette.type=='dark') { 
      bgi='';
    }
    return {
      color: {
        width: '1.3em',
        height: '1.2em',
        borderRadius: '20px',
        background: `rgba(${ colour.rgb?.r }, ${ colour.rgb?.g }, ${ colour.rgb?.b }, ${ colour.rgb?.a })`,
      },
      swatch: {
        padding: '0.2em !important',
        margin: '0px !important',
        minWidth:'0px !important',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        
        cursor: 'pointer',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        width:'auto',
        height:'100%'
      },
      popover:{
        position:'relative',
        borderRadius:'0px'
      },
      root: {
        borderRadius: '2em !important',
        filter: 'drop-shadow(9px 5px 8px rgba(0,0,0,0.25))',
        background: `linear-gradient(120deg, ${first} 0%, ${second} 100%)`,
        backgroundImage: bgi,
        width: '100%',
        transition: 'all 0.8s ease'
      },
      cardContent: { 
        
      },
      markdown: { 
  
      },
      li: { 
  
      },
      menuLink: {
        '&:hover': { 
          color: theme.palette.secondary.main,
          transition: `color 0s ease`
          
        },
        transition: `color 0.8s ease`,
        color: theme.palette.primary.main
      },
      
    };
  });
  const styles = useStyles(props);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    setPickerOpen(!pickerOpen);
  };

  const handleClose = () => {
    setPickerOpen(false);
  };

  const handleChange = (color) => {
    console.log(color);
    onChange(color);
  };

return (
  <div style={{zIndex:10000}}>
    <Button variant="outlined" className={styles.swatch} onClick={ handleClick }>
      <div className={styles.color} />
    </Button>
    { pickerOpen ? 
     
      <Popover
        PaperProps={{square: true}}
        open={pickerOpen}
        className={styles.popover}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
    vertical: 'center',
    horizontal: 'left',
  }} 

      >
      <div style={{margin:'0em'}}>
      <ChromePicker disableAlpha={disableAlpha} color={ colour.rgb } onChange={ handleChange } />
      </div>
      </Popover>
     : null }

  </div>
)

}
ColourPicker.propTypes = {
  colour:PropTypes.object.isRequired,
  onChange:PropTypes.func.isRequired,
  disableAlpha:PropTypes.bool.isRequired
};
export default ColourPicker;
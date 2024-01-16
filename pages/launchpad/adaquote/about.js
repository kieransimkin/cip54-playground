import Head from 'next/head'
import { Container, Typography } from '@material-ui/core';
import { makeStyles, StylesContext } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import BuildIcon from '@material-ui/icons/Build';
import PublicIcon from '@material-ui/icons/Public';
import RemoteIcon from '@material-ui/icons/SettingsRemote';
import Divider from '@material-ui/core/Divider';
import PictureCard from '../../../components/PictureCard';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import ContentCard from '../../../components/ContentCard'
import BuyButton from '../../../components/BuyButton';

const useStyles = makeStyles(theme => { 
  const first = alpha(theme.palette.primary.main, 0.8);
  const second = alpha(theme.palette.secondary.main, 0.4);
  const darkfirst = alpha(theme.palette.primary.main, 0.2);
  const darksecond = alpha(theme.palette.secondary.main, 0.2);
  let bg=`linear-gradient(125deg, ${first} 0%, ${second} 100%),linear-gradient(0deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%),url('/web.jpg') !important`;
  if (theme.palette.type=='dark') { 
    bg = `linear-gradient(120deg, ${darkfirst} 0%, ${darksecond} 100%), linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 100%), url('/web.jpg') !important`;
   
  }
  return {
    root: {
      display: 'flex', 
      width:'100%'
    },
    row: { 
      display: 'flex',
      width: '100%',
      alignItems:'flex-start',
      gap: '3em'
    },
    smallCol: { 
      flexBasis: '50%'
    },
    bigCol: {
      flexBasis: '50%'
    },
    fullWidth: { 
      flexBasis: '100%'
    },
    bg: { 
      minHeight: '100vh',
      background: bg,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      '&:after': {
        content: "''",
        position: 'fixed',
        height: '25em',
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 1,
        backdropFilter: 'blur(30px)',
        mask: 'linear-gradient(transparent 0%, black 100%)',
        "-webkitMask":'-webkit-linear-gradient(transparent 0%, black 100%)'
      }
    },
    container: { 
      paddingBottom: '10em'
    },
    heading: { 
      position: 'absolute',
      top: '0.5em',
      right: 0,
      left: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    main: { 
      marginLeft: '2em',
      marginRight: '2em',
      marginTop:'8.5em'
    }
  };
});

export default function Launchpad() {
  const classes=useStyles();
  return (
    <div>
      <Head>
        <title>About ADAquote</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={classes.bg} />
      <Typography color="textPrimary" variant='h1' align="center" className={classes.heading}>
          ADAquote
        </Typography><br />
      <main className={classes.main}>
      
        &nbsp;<br />&nbsp;
        <Container maxWidth="xl" className={classes.container}>
          <div className={classes.row+' row'}>
            <div className={classes.smallCol+' column'}> 
              <PictureCard target="_blank" height={1810} width={3000} alt="Smart Life 90" src="/launchpad/smart-life-90-cropped.png" />
            </div>
            <div className={classes.bigCol+' column'}>
              <ContentCard>
              <Typography variant="h2" color="textSecondary">
                ADAquote
              </Typography><br />
              <Typography variant="body1">
                ADAquote v2 is a work in progress - launch date TBA. 
              </Typography>
            
              
             
              </ContentCard>
            </div> 
          </div>
          <br />&nbsp;<br />
          <br />&nbsp;<br />
          </Container>
    
    
      </main>
    </div>
    
  )
}

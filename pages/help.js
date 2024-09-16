import Head from 'next/head'
import WalletContext from '../components/WalletContext'
import { Container, Typography } from '@material-ui/core';
import { makeStyles, StylesContext } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import BuildIcon from '@material-ui/icons/Build';
import Image from 'next/image';
import PublicIcon from '@material-ui/icons/Public';
import RemoteIcon from '@material-ui/icons/SettingsRemote';
import Divider from '@material-ui/core/Divider';
import PictureCard from '../components/PictureCard';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import VideoCard from '../components/VideoCard'
import ContentCard from '../components/ContentCard'
import MintButton from '../components/MintButton'
import Link from 'next/link';
import TwitterFeed from '../components/TwitterFeed';
import BuyButton from '../components/BuyButton';
const useStyles = makeStyles(theme => { 
  const first = alpha(theme.palette.primary.main, 0.8);
  const second = alpha(theme.palette.secondary.main, 0.4);
  const darkfirst = alpha(theme.palette.primary.main, 0.2);
  const darksecond = alpha(theme.palette.secondary.main, 0.2);
  let bg=`linear-gradient(125deg, ${first} 0%, ${second} 100%),linear-gradient(0deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%),url('/paisley.jpg') !important`;
  if (theme.palette.type=='dark') { 
    bg = `linear-gradient(120deg, ${darkfirst} 0%, ${darksecond} 100%), linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 100%), url('/paisley.jpg') !important`;
   
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
      flexBasis: '25%'
    },
    bigCol: {
      flexBasis: '75%'
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
    },
    clgimage: { 
      filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate('+(theme.palette.type=='dark'?'190deg':'180deg')+')',
      '&:hover': { 
        filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate('+(theme.palette.type=='dark'?'240deg':'250deg')+')'
      }
    }
  };
});

export default function Help() {
  const classes=useStyles();
  return (
    <div>
      <Head>
        <title>CIP54 Help</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={classes.bg} />
      <Typography color="textPrimary" variant='h1' align="center" className={classes.heading}>
          About Arden <sup>(CIP54)</sup>
        </Typography><br />
      <main className={classes.main}>
      
        &nbsp;<br />&nbsp;
        <Container maxWidth="xl" className={classes.container}>
          <div className={classes.row+' row'}>
            <div className={classes.smallCol+' column'}> 
              <PictureCard href="https://cips.cardano.org/cips/cip54/" target="_blank" height={862} width={1498} alt="CIP54 screenshot" src="/cip54-screenshot.png" />
            </div>
            <div className={classes.bigCol+' column'}>
              <ContentCard>
              <Typography variant="h2" color="textSecondary">
                What is a Smart NFT?
              </Typography><br />
              <Typography variant="body1">
                The CIP54 standard allows a HTML+Javascript NFT to receive information about the current state of the blockchain, as well as import files and libraries from the blockchain.<br />
                &nbsp;<br />
                This enables NFTs to respond to their environment in new and interesting ways, including reacting to oracle data, or being triggered by certain events. The standard also greatly increases the amount of data that can be made available to NFTs - image libraries, sounds, videos - an NFT can read files or metadata from any other token - this opens up the blockchain and will allow more expressiveness, art, and utility for many projects.
              </Typography><br />
             
              
             
              </ContentCard>
            </div> 
          </div>
          <br />&nbsp;<br />
          <div className={classes.row+' row'}>
            
            <div className={classes.bigCol+' column'}>
            <ContentCard>
              <Typography variant="h2" color="textSecondary">
                The Playground
              </Typography><br />
              <Typography variant="body1">
              The Smart NFT Playground allows you to develop and test NFTs inside a runtime environment which is fully compliant with the CIP54 specification. In fact, this is the reference implementation of the specification.
              </Typography><br />
              
              <List className={classes.list}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BuildIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Write your code" secondary="Write code and test in realtime without having to mint NFTs" />
                </ListItem>
                <Divider variant="middle" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <RemoteIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Optimise and test" secondary="Optimize your NFT code and test parameter changes in simulation" />
                </ListItem>
                <Divider variant="middle" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PublicIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Mint NFT" secondary="When you are confident your NFT works, you can go ahead and mint one and test it on Plutus.art" />
                </ListItem>
              </List>
 
              
              </ContentCard>
            </div> 
            <div className={classes.smallCol+' column'}> 
              <PictureCard src="/token-cubes-screenshot.png" alt="Token cubes screenshot" width={2111} height={1907} />
            </div>
          </div>
          <br />&nbsp;<br />
          <div className={classes.row+' row'}>
            <div className={classes.smallCol+' column'}> 
              <PictureCard href="https://plutus.art/" target="_blank" height={288} width={288} alt="CIP54 screenshot" src="/plutus5x.png" />
            </div>
            <div className={classes.bigCol+' column'}>
              <ContentCard>
              <Typography variant="h2" color="textSecondary">
                Buy / Sell / Trade
              </Typography><br />
              <div style={{display: 'flex', gap:'2em'}}>
              
              <Typography variant="body1">
                Buy, sell or trade your Smart NFTs at <a href="https://plutus.art/" target="_blank" rel="noreferrer">Plutus.art</a>, with native support for CIP54 assets right in the marketplace.
                <ul className="infolist">
                <li><Link href="/launchpad/smart-life/about">Smart Life</Link> - The first CIP54 collection is now minting <BuyButton /></li>
                <li><Link href="/launchpad/smart-avatars/about">Smart Avatars</Link> - The first in a new series of true on-chain avatars <MintButton /></li>
                <li><Link href="/launchpad/adaquote/about">ADAquote</Link> - The first practical use of CIP54 to offer an enhanced version of an existing project.</li>
                </ul>
                
              </Typography>
                <a href="https://plutus.art/collection/smartlife" target="_blank" rel="noreferrer">
                  <img src="/examples/smart-life-thumb.png" width="250" height="227" alt="Smart Life" style={{borderRadius:'20px',border:'1px solid rgba(0,0,0,0.6)'}}/>
                </a>
              </div>
              
             
              </ContentCard>
            </div> 
          </div>
          <br />&nbsp;<br />
          <div className={classes.row+' row'}>
            
            <div className={classes.bigCol+' column'}>
            <ContentCard>
              <Typography variant="h2" color="textSecondary">
                Cardano Looking Glass
              </Typography><br />
              <Typography variant="body1">
              Cardano Looking Glass is a full blockchain explorer with CIP54 support built-in. Once you&apos;ve minted your collections on mainnet, you can view them here in all their glory.
              </Typography><br />
              <a href="https://clg.wtf/" target="_blank" rel="noreferrer">
                <Image className={classes.clgimage} src="/clg-logo.svg" width="200" height="100" alt="Cardano Looking Glass - A Visual Blockchain Explorer for Cardano" />
              </a>
              
              </ContentCard>
            </div> 
            <div className={classes.smallCol+' column'}> 
            
              <PictureCard  href="https://clg.wtf/" target="_blank" src="/clg.png" alt="Cardano Looking Glass" width={1702} height={1281} />
            </div>
          </div>
          <br />&nbsp;<br />
          <div className={classes.row+' row'}>
            
            <div>
              <ContentCard>
              <Typography variant="h2" color="textSecondary">
                Further reading
              </Typography><br />
              <Typography variant="body1">
                All of the parts of the Arden API including this website itself are provided opensource on Github - SmartNFTPortal and Libcip54 are also available as npm packages<br />&nbsp;
                <table style={{borderSpacing:'10px', marginLeft:'auto',marginRight:'auto'}} border={1} width="90%" className="linktable">
                  
                  <tr><td valign="top"><a href="https://github.com/kieransimkin/smartnftportal" target="_blank" rel="noreferrer"><Typography variant="body1">SmartNFTPortal</Typography></a></td><td>This is a react component which gives you everything you need to render a Smart NFT in the front end - this is the component used by the Playground, and by <a href="https://plutus.art/" target="_blank" rel="noreferrer">Plutus.art</a></td></tr>
                  <tr><td valign="top"><a href="https://github.com/kieransimkin/libcip54" target="_blank" rel="noreferrer"><Typography variant="body1">Libcip54</Typography></a></td><td>This library proves the backend queries needed to build the data for the SmartNFTPortal to render the NFT - the two work in tandem to render NFTs</td></tr>
                  <tr><td valign="top"><a href="https://github.com/kieransimkin/SimpleCip54Viewer" target="_blank" rel="noreferrer"><Typography variant="body1">SimpleCip54Viewer</Typography></a></td><td>This is a very simple React site which does nothing but render a specific NFT inside a SmartNFTPortal instance.</td></tr>
                  <tr><td valign="top"><a href="https://github.com/kieransimkin/SmartNFTThumbnailer" target="_blank" rel="noreferrer"><Typography variant="body1">SmartNFTThumbnailer</Typography></a></td><td>This is a library used for generating thumbnails of Smart NFTs, it can also generate short video clips of the NFT running.</td></tr>
                  <tr><td valign="top"><a href="https://github.com/kieransimkin/cip54-playground" target="_blank" rel="noreferrer"><Typography variant="body1">Playground</Typography></a></td><td>This is the sourcecode for this site - if you have a feature you&apos;d like to contribute, feel free to submit a pull request. This also contains a reference implementation of the backend API which generates the data for the frontend to render.</td></tr>                  
                  <tr><td valign="top"><a href="https://cips.cardano.org/cips/cip54" target="_blank" rel="noreferrer"><Typography variant="body1">CIP54</Typography></a></td><td>The actual Cardano Improvement Proposal that I wrote a couple of years ago at the start of this project</td></tr>
                </table>


              </Typography><br />
             
              
             
              </ContentCard>
            </div> 
   
          </div>
          <br />&nbsp;<br />
          </Container>
    
    
      </main>
    </div>
    
  )
}

import Head from 'next/head'
import WalletContext from '../components/WalletContext'
import { CircularProgress, Typography } from '@material-ui/core';
import { makeStyles, StylesContext } from "@material-ui/core/styles";
import { alpha } from '@material-ui/core/styles/colorManipulator';
import PauseIcon from '@material-ui/icons/Pause';
import Image from 'next/image';
import VideoCard from '../components/VideoCard';
import { Carousel } from 'react-responsive-carousel';
import { useState , useEffect, useRef } from "react";
import PictureCard from '../components/PictureCard'
import Card from '@material-ui/core/Card'
import ExamplesButton from '../components/ExamplesButton';
import PlaygroundButton from '../components/PlaygroundButton'
import BigBuyButton from '../components/BigBuyButton'
import AvatarExampleButton from '../components/AvatarExampleButton';

const useStyles = makeStyles(theme => { 
    const first = alpha(theme.palette.primary.main, 0.8);
    const second = alpha(theme.palette.secondary.main, 0.4);
    const darkfirst = alpha(theme.palette.primary.main, 0.2);
    const darksecond = alpha(theme.palette.secondary.main, 0.2);
    let bg=`linear-gradient(125deg, ${first} 0%, ${second} 100%),linear-gradient(0deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%),url('/flowers.jpg') !important`;
    if (theme.palette.type=='dark') { 
        bg = `linear-gradient(120deg, ${darkfirst} 0%, ${darksecond} 100%), linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 100%), url('/flowers.jpg') !important`;
    }
    let bg2=`linear-gradient(-95deg, ${first} 0%, ${second} 100%),linear-gradient(120deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.85) 100%),url('/circuit2.png') !important`;
    if (theme.palette.type=='dark') { 
        bg2 = `linear-gradient(-120deg, ${darkfirst} 0%, ${darksecond} 100%), linear-gradient(0deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), url('/circuit2.png') !important`;
    }
    return {
    bigHead: { 
        textShadow: `
                    1px 1px 15px rgba(0,0,0,1), 
                    1px 1px 25px rgba(0,0,0,1),
                    0px 0px 3px rgba(0,0,0,1), 
                    1px 1px 3px rgba(0,0,0,1),
                    -1px -1px 3px rgba(0,0,0,1),
                    0px -1px 3px rgba(0,0,0,1),
                    0px 1px 3px rgba(0,0,0,1),
                    1px 0px 3px rgba(0,0,0,1),
                    -1px 0px 3px rgba(0,0,0,1)
                    `,
        letterSpacing:'0.05em',
        fontSize: '100px',
        fontWeight: '900 !important',
    },
    subtleBigHead: { 
        wordBreak: 'break-word',
        textShadow: `
                    1px 1px 15px rgba(0,0,0,1), 
                    0px 0px 3px rgba(0,0,0,1), 
                    1px 1px 3px rgba(0,0,0,1),
                    -1px -1px 3px rgba(0,0,0,1),
                    0px -1px 3px rgba(0,0,0,1),
                    0px 1px 3px rgba(0,0,0,1),
                    1px 0px 3px rgba(0,0,0,1),
                    -1px 0px 3px rgba(0,0,0,1)
                    `,
        letterSpacing:'0.05em',
        fontSize: '80px',
        fontWeight: '900 !important',
    },
    littleHead: { 
        textShadow: `
        1px 1px 15px rgba(0,0,0,1), 
        1px 1px 10px rgba(0,0,0,1), 
        0px 0px 3px rgba(0,0,0,1), 
        1px 1px 3px rgba(0,0,0,1),
        -1px -1px 3px rgba(0,0,0,1),
        0px -1px 3px rgba(0,0,0,1),
        0px 1px 3px rgba(0,0,0,1),
        1px 0px 3px rgba(0,0,0,1),
        -1px 0px 3px rgba(0,0,0,1)
        `,
        letterSpacing:'0.05em',
        fontWeight: '600 !important',
        '& em': { 
            color: 'white !important'
        }
    },
    subtleLittleHead: { 
        wordBreak: 'break-word',
        textShadow: `
                    1px 1px 15px rgba(0,0,0,1), 
                    0px 0px 3px rgba(0,0,0,1), 
                    1px 1px 3px rgba(0,0,0,1),
                    -1px -1px 3px rgba(0,0,0,1),
                    0px -1px 3px rgba(0,0,0,1),
                    0px 1px 3px rgba(0,0,0,1),
                    1px 0px 3px rgba(0,0,0,1),
                    -1px 0px 3px rgba(0,0,0,1)
                    `,
        letterSpacing:'0.05em',
        fontWeight: '600 !important',
        '& em': { 
            color: 'white !important'
        }
    },
    bg: { 
      minHeight: '100vh',
      backgroundImage: bg,
      backgroundSize: `cover, cover, 990px`,
      backgroundRepeat: `no-repeat, no-repeat, repeat`,
      top: 0,
      left: 0,
      right: 0,
      minWidth:'100vw'
    },
    
    bg2: { 
        minHeight: '100vh',
        backgroundImage: bg2,
        backgroundSize: `cover, cover, 950px`,
        backgroundRepeat: `no-repeat, no-repeat, repeat`,
        top: 0,
        left: 0,
        right: 0,
        minWidth:'100vw'
    },
    bgImageCont: { 
        width: '100vw',
        height: '100vh',
        top:'0px',
        left:'0px',
        position: '',
        '& div': { 
            position: 'unset !important'
        }
    },
    bgImage: { 
        objectFit: 'cover', 
        width: '100vw', 
        height: '100vh'
    },
    content: { 
        position:'absolute',
        width:'100vw',
        top: '50%',
        textAlign: 'left',
        paddingLeft: '5em',
        paddingRight: '5em',
        transform: `translateY(-50%)`
    },
    wideContent: { 
        position:'absolute',
        width:'100vw',
        top: '50%',
        textAlign: 'left',
        paddingLeft: '2em',
        paddingRight: '2em',
        transform: `translateY(-50%)`
    },
    root: {
    }
  }});

export default function Home() {
    const classes=useStyles();
    const [autoPlay, setAutoplay] = useState(false);
    const [loadingContent, setLoadingContent] = useState((<><CircularProgress size="1em" style={{position: 'relative', top:'0.15em', marginRight: '0.3em', marginLeft:'0.2em'}} /> Loading slideshow&hellip;</>));
    const [currentSlide, setCurrentSlide] = useState(0);
    const onLoad = (e) => { 
        setAutoplay(true);
        setLoadingContent((<><PauseIcon /> Paused&hellip;</>));
    }
    const toggleOnOff = () => { 
        if (!autoPlay) { 
            setCurrentSlide(currentSlide+1);
        }
        setAutoplay(!autoPlay);
    }
    const updateCurrentSlide = (index) => { 
        if (currentSlide !== index) { 
            setCurrentSlide(index);
        }
    }
    return (
    <div>
      <Head>
        <title>Cardano Smart NFT Playground</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="fullscreen"> <Carousel 
        selectedItem={currentSlide}
        onChange={updateCurrentSlide}
        autoFocus={true} 
        showThumbs={false} 
        showStatus={false} 
        useKeyboardArrows 
        autoPlay={autoPlay} 
        stopOnHover={false} 
        infiniteLoop={true} 
        interval={7000} 
        className="presentation-mode"
        >
       <div key="content-1" className="my-slide content" onClick={toggleOnOff}>
            <div className={classes.bg}>
                
            </div>
            <div className={classes.wideContent + ' slide-content'}>
                <div className="row" style={{display:'flex', alignItems: 'center', gap:'4em', justifyContent:'space-around'}}>     
                    <div className="column" style={{marginLeft:'2em'}}>
                        <Typography variant="h1" classes={{root: classes.subtleBigHead}}>Smart NFTs</Typography><br /><div className="hiding-space">&nbsp;<br /></div>
                        <Typography variant="h3" classes={{root: classes.subtleLittleHead}}><em>Arden - a flexible framework for Javascript NFTs on Cardano</em></Typography><br /><div className="hiding-space">&nbsp;<br /></div>
                        
                    </div>
                    <div className="column" style={{minWidth:'40%', flexGrow: 1, marginRight:'2em'}}>
                        <VideoCard src="/cubes.mp4" onLoad={onLoad} />
                        
                    </div>
                </div>
            </div>
        </div>
        <div key="content-2" className="my-slide content" onClick={toggleOnOff}>
            <div className={classes.bg2}>
                
            </div>
            <div className={classes.wideContent + ' slide-content'}>
                <div className="row" style={{display:'flex', alignItems: 'center', gap:'4em', justifyContent:'space-around'}}>     
                    
                    <div className="column" style={{minWidth:'40%',maxWidth: '50%', marginLeft:'2em'}}>
                        <PictureCard src="/examples/smart-life-thumb.png" alt="Smart Life" width={952} height={865} />
                        
                    </div>
                    <div className="column">
                        <Typography variant="h1" classes={{root: classes.subtleBigHead}}>Smart Life</Typography><br /><div className="hiding-space">&nbsp;<br /></div>
                        <Typography variant="h2" classes={{root: classes.subtleLittleHead}}><em>The first CIP54 collection, minting now</em></Typography><br /><div className="hiding-space">&nbsp;<br /></div>
                        <BigBuyButton />
                        
                    </div>
                </div>
            </div>
        </div>
        <div key="content-3" className="my-slide content" onClick={toggleOnOff}>
            <div className={classes.bg}>
                
            </div>
            <div className={classes.wideContent + ' slide-content'}>
                <div style={{display:'flex', flexDirection:'column',alignItems: 'center', gap:'4em', justifyContent:'space-around'}}>     
                    
                    <div className="column" style={{minWidth:'60%',maxWidth: '60%', marginLeft:'2em'}}>
                        <VideoCard src="/smart-avatar.mp4" onLoad={onLoad} />
                        
                    </div>
                    <div className="column" style={{display:'flex', alignItems:'flex-start'}}>
                        <div><Typography variant="h1" classes={{root: classes.subtleBigHead}}>Smart Avatars</Typography><br /><div className="hiding-space">&nbsp;<br /></div>
                        <Typography variant="h4" classes={{root: classes.subtleLittleHead}}><em>Coming soon, a demonstration of the power of CIP54</em></Typography><br /><div className="hiding-space">&nbsp;<br /></div></div>

                        <AvatarExampleButton />
                    </div>
                </div>
            </div>
        </div>
        <div key="content-4" className="my-slide content" onClick={toggleOnOff}>
            <div className={classes.bg2}>
                
            </div>
            <div className={classes.wideContent + ' slide-content'}>
                <div className="row" style={{display:'flex', alignItems: 'center', gap:'2em', justifyContent:'space-around' }}>     
                    
                    <div className="column" style={{flexGrow:''}}>
                        <Typography variant="h1" classes={{root: classes.subtleBigHead}}>Get Started</Typography><br /><div className="hiding-space">&nbsp;<br /></div>
                        <Typography variant="h2" classes={{root: classes.subtleLittleHead}}><em>Press a button</em></Typography><br /><div className="hiding-space">&nbsp;<br /></div>
                        <ExamplesButton />
                    </div>                   
                    <div className="column" style={{minWidth:'40%',maxWidth: '50%'}}>
                        <PictureCard src="/token-cubes-screenshot.png" alt="Token cubes screenshot" width={2111} height={1907} />
                        
                    </div>
                </div>
            </div>
        </div>
       
    </Carousel>
    <div className="bottom-button" style={{position:'fixed', bottom:'3em', width:'100%', textAlign:'center', transition: `opacity 0.8s ease`, opacity: autoPlay ? 0 : 1 }}> 
    <Card style={{cursor: 'pointer', width:'fit-content', marginLeft:'auto', marginRight:'auto', padding:'1em', boxShadow:'2px 2px 15px 5px rgba(0,0,0,0.5)', border: '1px solid black'}} onClick={toggleOnOff}>
    <Typography variant="h4">
        {loadingContent}
        </Typography>
    </Card>
    </div>
      </main>
    </div>
  )
}

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { useRouter } from 'next/router'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MenuIcon from '@material-ui/icons/Menu';
import PowerIcon from '@material-ui/icons/Power';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import WalletSelector from './WalletSelector'
import React, { useEffect, useState,useCallback, useContext } from 'react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { useWindowDimensions } from '../utils/Hooks'
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import PropTypes from 'prop-types';
import WalletContext from '../components/WalletContext';
import { Drawer } from '@material-ui/core';
import { HelpOutline, HelpTwoTone, Home, KingBed, SportsKabaddi } from '@material-ui/icons';
import NestedMenuItem from './NestedMenuItem';
import ExamplesMenuItems from './ExamplesMenuItems';
import eventBus from '../utils/EventBus';
import ImportZipDialog from './dialogs/ImportZipDialog';
import ImportBlockchainDialog from './dialogs/ImportBlockchainDialog';
import NewDialog from './dialogs/NewDialog';
import SaveAsDialog from './dialogs/SaveAsDialog';
import LaunchpadMenuItems from './LaunchpadMenuItems';
const useStyles = makeStyles(theme => { 
    const first = alpha(theme.palette.background.default, 0.85);
    const second = alpha(theme.palette.background.paper, 0.85);
    let bgi = 'url(/paper-texture-light.jpg)';
    if (theme.palette.type=='dark') { 
      bgi='';
    }
    return {
    
    root: {
        display: 'inline',
        //backdropFilter: `blur(2px)`,
        boxShadow: `2px 2px 20px 7px rgba(0,0,0,0.20)`,
      //background:``,
      background: `linear-gradient(120deg, ${first} 0%, ${second} 50%) `,
     
      borderBottom: `2px solid rgba(0,0,0,0.4)`,
      transition: 'opacity 0.8s cubic-bezier(0.64, 0.63, 0.39, 1.19)'
    },
    menu: { 
        backgroundImage: bgi
    },
    title: { 
        fontSize: '1.5em',
        fontWeight: 600,
        fontFamily: "'MuseoModerno', cursive"
    },
    hidden: { 
        display: 'inline',
        //backdropFilter: `blur(2px)`,
        boxShadow: `2px 2px 20px 7px rgba(0,0,0,0.20)`,
        borderBottom: `2px solid rgba(0,0,0,0.4)`,
        background:`linear-gradient(120deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%)`,
        transition: 'opacity 0.8s cubic-bezier(0.64, 0.63, 0.39, 1.19)'
    },
    tools: { 
        position: 'relative',
        top: '-0px'
    },
    nominbtn: { 
        minWidth: `10px !important`
    },
    drawerPaper: { 
        height: 'auto',
        borderBottomLeftRadius: '1em',
        boxShadow: '2px 2px 25px 1px rgba(0,0,0,0.5)'
    },
    
    drawerPaperOpen: { 
        height: 'auto',
        borderBottomRightRadius: '1em',
        borderTopRightRadius: '1em',
        borderTopLeftRadius: '1em',
        boxShadow: '2px 2px 25px 1px rgba(0,0,0,0.5)'
    },
    menuPaper: {
        translate: '-2.0em',
        borderTopRightRadius: '0px !important'
    }
  }});

let timer = null;

const Header = (props) => {
    // Props: 
    const {onWalletChange, onThemeChange} = props;

    // State: 
    const [walletOpen, setWalletOpen] = React.useState(false);
    const [saveAsOpen, setSaveAsOpen] = React.useState(false);
    const [launchpadDialogIsOpen, setLaunchpadDialogIsOpen] = React.useState(false);
    const [newOpen, setNewOpen] = React.useState(false);
    const [importBlockchainOpen, setImportBlockchainOpen] = React.useState(false);
    const [importZipOpen, setImportZipOpen] = React.useState(false);
    const [wallet, setWallet] = React.useState(null);
    const [darkMode, setDarkMode] = React.useState('light');
    const [walletApi, setWalletAPI] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [callbackFn, setCallbackFn] = React.useState({'fn': () => { return; }, 'fail': () => {return; }});
    const [hide, setHide] = useState(false);
    const [hover, setHover] = useState(false);
    
    // Context: 
    const classes = useStyles(props);
    const router = useRouter();
    const walletCtx = useContext(WalletContext);
    
    let connectContent = <PowerIcon fontSize='small' sx={{padding: 0, margin: 0}} />;

    const buttonsize='medium';
    const buttonclass='nomwbtn';
    const doOnWalletChange=(props)=>{
        localStorage.setItem('cip54-wallet',JSON.stringify(props))
        return onWalletChange(props);
    }
    const connectWallet = useCallback((callback, failCallback) => { 
        if (!walletCtx || !walletCtx.api) { 
            setCallbackFn({fn: callback, fail: failCallback});
            setWalletOpen(true);
        } else { 
            
            callback(walletCtx);
        }
    });
    useEffect( () => { 
        if (!walletCtx) {  
            let wallet = null
            try { 
                wallet=JSON.parse(localStorage.getItem('cip54-wallet'));
            } catch (e) {} 
            if (wallet && wallet?.wallet) { 
                try { 
                    window.cardano[wallet.wallet].isEnabled().then((enabled)=> { 
                        if (enabled){
                            window.cardano[wallet.wallet].enable().catch((error) => { 
                                let terror = error;
                                if (typeof terror === 'object' && terror.info) { 
                                    terror=terror.info;
                                }
                                console.error(error);
                                alert('Wallet restore error: '+terror);
                                return false;
                            }).then((api) => { 
                            doOnWalletChange({
                                api:api,
                                wallet:wallet.wallet,
                                stakeAddrRaw:wallet.stakeAddrRaw,
                                returnAddrRaw:wallet.returnAddrRaw,
                                connectContent: connectWallet
                            })
                            setWalletAPI(api);
                            setWallet(wallet.wallet);
                            })
                        } else { 
                            doOnWalletChange({
                                'api': null, 
                                'wallet': null, 
                                'stakeAddrRaw':null,
                                'returnAddrRaw':null,
                                'connectWallet': connectWallet
                            });
                        }
                    });
                } catch (e) { 
                    console.log(e);
                }
            } else { 
                onWalletChange({
                    'api': null, 
                    'wallet': null, 
                    'stakeAddrRaw':null,
                    'returnAddrRaw':null,
                    'connectWallet': connectWallet
                });
            }
        }
        let dark = localStorage.getItem('cip54-darkmode');
            if (dark && dark=='light'||dark=='dark') { 
                setDarkMode(dark);
                onThemeChange(dark);
            }
    },[]);

    const className = (hide) ? classes.hidden : classes.root;
    
    const toggleVisibility = useCallback((hide, cursor) => {
      setHide(hide);
    }, []);
    
    const onMouseMove = useCallback(() => {
        clearTimeout(timer);
    
        if (hide) {
          toggleVisibility(!hide, 'default');
        }
    
        timer = setTimeout(() => {
          if (!hover && !launchpadDialogIsOpen) {
            toggleVisibility(true, 'none');
            setAnchorEl(null);
          }
        }, 5000);
      }, [hide, hover, setHide]);
    
   
    // Events:
    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onMouseMove);
        window.addEventListener('touchstart', onMouseMove);
        window.addEventListener('touchmove', onMouseMove);
        //window.addEventListener('keyup', onMouseMove);
        window.addEventListener('scroll', onMouseMove);

        return () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('click', onMouseMove);
          window.removeEventListener('touchstart', onMouseMove);
          window.removeEventListener('touchmove', onMouseMove);
          //window.removeEventListener('keyup', onMouseMove);
          window.removeEventListener('scroll', onMouseMove);
        };
    }, [onMouseMove]);
    const handleWalletClickOpen = () => {
      setCallbackFn({fn: () => { return; }, fail: () => { return; } });
      setWalletOpen(true);
    };
    const handleNewClick = () => { 
        setNewOpen(true);
    }
    const handleSaveAsClick = () => { 
        setSaveAsOpen(true);
    }
    const handleImportBlockchainClick = () => { 
        setImportBlockchainOpen(true);
    }
    const handleImportZipClick = () => { 
        setImportZipOpen(true);
    }
    const handleNewClose = (value) => { 
        setNewOpen(false)
    }
    const handleSaveAsClose = (value) => { 
        setSaveAsOpen(false);
    }
    const handleImportBlockchainClose = (value) => { 
        setImportBlockchainOpen(false);
    }
    const handleImportZipClose = (value) => { 
        setImportZipOpen(false);
    }
    const handleWalletClose = (value) => {
        setWalletOpen(false);
        callbackFn.fn(value);
        let walletIsEnabled = false;
        
        if (typeof value == "undefined" || !value) {
            callbackFn.fail();
            return; 
        };
        try {
            window.cardano[value].isEnabled().then((enabled) => {
                window.cardano[value].enable().catch((error) => { 
                        console.error(error);
                        let terror = error;
                        if (typeof terror === 'object' && terror.info) { 
                            terror=terror.info;
                        }
                        alert('Wallet connect error: '+terror);
                        callbackFn.fail();            
                        return false;
                    }).then((api) => { 
                    if (!api) return;
                    api.getRewardAddresses().then((addresses) => {
                        api.getChangeAddress().then((change) => {
                            doOnWalletChange({
                                'api': api, 
                                'wallet': value, 
                                'stakeAddrRaw':addresses[0],
                                'returnAddrRaw':change,
                                'stakeKey':change.slice(58, 114),
                                'connectWallet':connectWallet
                            });
                        });
                    });
                    setWalletAPI(api);
                });
                setWallet(value);
            });
        } catch (err) {
            callbackFn.fail();
            console.log(err)
        }
    };

    const handleClose = (value) => {
        setAnchorEl(null);
        
    }

    const handleClick = (value) => { 
        setAnchorEl(value.currentTarget);
    }

    const toggleDarkMode = (e) => { 
        const newMode = darkMode==='light'?'dark':'light';
        localStorage.setItem('cip54-darkmode',newMode)
        setDarkMode(newMode);
        onThemeChange(newMode);
    }

    const handleLogout = () => { 
        doOnWalletChange(null);
        setWalletAPI(null);
        setWallet(null);
        setAnchorEl(null);
    }
    const launchpadDialogOpen = () => { 
        setLaunchpadDialogIsOpen(true);
    } 
    const launchpadDialogClose = () => { 
        setLaunchpadDialogIsOpen(false);
    }
    const openNewDialog = () => { 

    }
    const exportZip = () => { 
        eventBus.dispatch("saveZip", { message: "saving zip" });
    }
    const exportHtml = () => { 
        eventBus.dispatch("saveHtml", {message: 'saving html'});
    }
    return (
        
            <Drawer id="drawer"  classes={{
                paper: anchorEl?classes.drawerPaperOpen:classes.drawerPaper,
              }}
                    
             variant="persistent" anchor='right' open={!hide} className={className}>
                {!walletApi &&
                        <div style={{marginLeft:'auto', marginRight: 'auto'}}>
                            <Button title="Connect Wallet" size={buttonsize} className={buttonclass} sx={{margin: 0, padding: 0}} variant='outlined' color="secondary" onClick={handleWalletClickOpen}>
                            {connectContent}
                            </Button>
                        </div>
                        
                }
                {walletApi &&
                        <div style={{marginLeft:'auto', marginRight: 'auto'}}>
                            <IconButton className={buttonclass} size={buttonsize} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                <MenuIcon fontSize={buttonsize} color="secondary" />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                classes={{
                                    paper: classes.menuPaper
                                }}
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                getContentAnchorEl={null} 
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                            <Link href="/"><MenuItem onClick={handleClose}>Home</MenuItem></Link>
                            <NestedMenuItem direction="left" label="File..." parentMenuOpen={Boolean(anchorEl)}>
                                <MenuItem onClick={handleNewClick}>New...</MenuItem>
                                {(router.route.substring(0,5)=='/play') &&
                                    <>
                                    <MenuItem onClick={openNewDialog}>Save</MenuItem>
                                    <MenuItem onClick={handleSaveAsClick}>Save As...</MenuItem>
                                    </>
                                }
                                <NestedMenuItem direction="left" label="Import..." parentMenuOpen={Boolean(anchorEl)}>
                                    <MenuItem onClick={handleImportBlockchainClick}>From blockchain...</MenuItem>
                                    <MenuItem onClick={handleImportZipClick}>From ZIP...</MenuItem>
                                </NestedMenuItem>
                                {(router.route.substring(0,5)=='/play') &&
                                    <NestedMenuItem direction="left" label="Export..." parentMenuOpen={Boolean(anchorEl)}>
                                        <MenuItem onClick={exportZip}>To ZIP...</MenuItem>
                                        <MenuItem onClick={exportHtml}>To HTML...</MenuItem>
                                    </NestedMenuItem>
                                }
                            </NestedMenuItem>                          
                            <Link href="/play"><MenuItem>Play</MenuItem></Link>
                            <Link href="/examples"><NestedMenuItem onClick={()=>router.push('/examples')} direction="left" label="Examples..." parentMenuOpen={Boolean(anchorEl)}>
                                <ExamplesMenuItems parentMenuOpen={Boolean(anchorEl)} />
                            </NestedMenuItem></Link>
                            <Link href="/launchpad"><NestedMenuItem onClick={()=>router.push('/launchpad')} direction="left" label="Launchpad..." parentMenuOpen={Boolean(anchorEl)}>
                                <LaunchpadMenuItems onDialogOpen={launchpadDialogOpen} onDialogClose={launchpadDialogClose} parentMenuOpen={Boolean(anchorEl)} />
                            </NestedMenuItem></Link>
                                <MenuItem onClick={toggleDarkMode}>{darkMode==='dark' ? 'Dark Mode':'Light Mode'}
                                <div style={{position: 'relative', top:'0px', width:'75px'}}>
                                <ToggleButtonGroup
                                    value='light'
                                    size="small"
                                    exclusive
                                    onChange={toggleDarkMode}
                                    aria-label="text alignment"
                                    style={{paddingLeft:'10px', position: 'absolute', top:'-1.1em'}}
                                    >
                                    <ToggleButton value="dark" aria-label="left aligned">
                                        🌞
                                    </ToggleButton>
                                    <ToggleButton value="light" aria-label="centered">
                                        🌙
                                    </ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                                </MenuItem>
                                <Link href="/help"><MenuItem>Help</MenuItem></Link>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    }
                    {!walletApi &&
                        <>
                        <Link href="/">
                            <Button size='large' startIcon=<Home /> color={(router.route=='/') ? 'primary' : 'secondary'} style={{marginLeft:'0.3em'}}>
                                Home
                            </Button>
                        </Link>
                        <Link href="/play">
                            <Button size='large' startIcon=<SportsKabaddi /> color={(router.route.substring(0,5)=='/play') ? 'primary' : 'secondary'} style={{marginLeft:'0.3em'}}>
                                Play
                            </Button>
                        </Link>
                        <Link href="/examples">
                            <Button size='large' startIcon=<CastForEducationIcon /> color={router.route=='/examples' ? 'primary' : 'secondary'}  style={{marginLeft:'0.3em'}}>
                                Examples
                            </Button>
                        </Link>
                        <Link href="/launchpad">
                            <Button size='large' startIcon=<WhatshotIcon /> color={(router.route.substring(0,10)=='/launchpad') ? 'primary' : 'secondary'}  style={{marginLeft:'0.3em'}}>
                                Launchpad
                            </Button>
                        </Link>
                        <Link href="/help">
                            <Button size='large' startIcon=<HelpOutline /> color={router.route=='/help' ? 'primary' : 'secondary'}  style={{marginLeft:'0.3em'}}>
                                Help
                            </Button>
                        </Link>
                        </>
                    }
                <WalletSelector selectedValue={wallet} open={walletOpen} onClose={handleWalletClose} />
                <ImportZipDialog open={importZipOpen} onClose={handleImportZipClose} />
                <ImportBlockchainDialog open={importBlockchainOpen} onClose={handleImportBlockchainClose} />
                <NewDialog open={newOpen} onClose={handleNewClose} />
                <SaveAsDialog open={saveAsOpen} onClose={handleSaveAsClose} />
            </Drawer>
    )
}
Header.propTypes = {
    onWalletChange: PropTypes.func.isRequired,
    onThemeChange: PropTypes.func.isRequired,
};
export default Header
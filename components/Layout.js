
import Header from './Header'
import { styled, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react'
import {ThemeProvider, createTheme} from '@material-ui/core/styles'
import WalletContext from './WalletContext'
import { mkBase, postData, buildWitnessed, getData, refreshWallet } from '../utils/Api';
const drawerWidth = 240;
const Main = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
 // marginRight:'100px',
  //padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
const Layout = ({children}) => {
    const [walletState, setWalletState] = useState(null);
    const [themeState, setThemeState] = useState('light');
    const [open, setOpen] = useState(true);
   
    // TODO XXX This is where you define the theme
    const lightTheme = createTheme({
        typography: {
            'fontFamily':  "'Baloo Thambi 2', cursive",
            'fontSize': 16,
            'letterSpacing':'0.3em',
            'button': {
                'fontSize': 18,
              'textTransform': "none"
            }
          },
          palette: { 
            
          }
          
    });
    
    const darkTheme = createTheme({
        typography: {
            'fontFamily': "'Baloo Thambi 2', cursive",
            'fontSize': 16,
            'button': {
                'fontSize': 18,
              'textTransform': "none"
            }
        },
        palette: {
            type: 'dark',
            primary: {
              main: '#ffaadd',
            },
            secondary: {
              main: '#ddccff',
            },
          },
    });

    const onWalletChange = (state) => {
        if (!state) { 
            return setWalletState(null);
        }
        state.assets={tokens:{},lovelace:0};
        setWalletState(state);
        if (!state.api) { 
            return;
        }
        state.api.getUtxos().then(us => {
            postData('/loadAssets', {utxos: us}).then(res => {
            if (res.status == 200) {
              res.json().then(body => {
                var newState = Object.assign({}, state);
                newState.assets=body;
                newState.touch=true;
                setWalletState(newState);
              });
            } else {
              state.assets={tokens:{},lovelace:0};
              setWalletState(state);
              console.error('Bad request');
            }
          })
        });
    };

    const onThemeChange = (state) => { 
        setThemeState(state);
    }
    let thisTheme = themeState==='light' ? lightTheme : darkTheme;
    return (
        <div style={{height: '100vh', fontFamily: "'MuseoModerno', cursive", backgroundColor:thisTheme.palette.background.default, color: thisTheme.palette.text.primary}}>
        <ThemeProvider theme={thisTheme}>
            <WalletContext.Provider value={walletState}>
                    <Header onThemeChange={onThemeChange} onWalletChange={onWalletChange} />
                    <Main open={true}>
                    {children}
                    </Main>
            </WalletContext.Provider>
        </ThemeProvider>
        </div>
    )
}
export default Layout
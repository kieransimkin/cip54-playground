import Head from 'next/head'
import { LinearProgress, Typography } from '@material-ui/core';
import { makeStyles, StylesContext } from "@material-ui/core/styles";
import { alpha } from '@material-ui/core/styles/colorManipulator';
import {lazy, Suspense, useEffect, useState, useRef} from 'react'
import { useTheme } from '@material-ui/core';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import PropTypes from 'prop-types';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import 'rc-dock/dist/rc-dock-dark.css';
import FeatureSelector from './FeatureSelector';
import SimulationSelector from './SimulationSelector';
import { postData, getData } from '../utils/Api'
import SmartNFTPortal from './SmartNFTPortal';
import MetadataEditor from './MetadataEditor';
import DividerBox from './DividerBox'
import * as cheerio from 'cheerio';
let programCodeTimer = null;
import * as React from "react";
import { getFeatureTree } from '../utils/Helpers';
import { minify } from 'html-minifier-terser';


const useStyles = makeStyles(theme => { 
  const first = alpha(theme.palette.primary.main, 0.8);
  const second = alpha(theme.palette.secondary.main, 0.4);
  const darkfirst = alpha(theme.palette.primary.main, 0.2);
  const darksecond = alpha(theme.palette.secondary.main, 0.2);
  let bg=`linear-gradient(125deg, ${first} 0%, ${second} 100%),linear-gradient(0deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%),url('/fibres-texture3.jpg') !important`;
  if (theme.palette.type=='dark') { 
    bg = `linear-gradient(120deg, ${darkfirst} 0%, ${darksecond} 100%), linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 100%), url('/fibres-texture3.jpg') !important`;
   
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
    halfCol: { 
      flexBasis: '50%'
    },
    fullWidth: { 
      flexBasis: '100%'
    },
    dividerClass: { 
        minWidth:'5px',
        minHeight:'5px'
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

const Playground = function (props) {
  const classes=useStyles();
  const defaultUses = props.uses;
  const defaultMetadata = props.metadata;

  const theme = useTheme();
  const defaultAddr = 'stake1uxyldhxclla0fpltcgjkak567hy93nm44vq6vxqryy9trtsv3mhl9'
  const [featureTree, setFeatureTree] = useState({});
  const [metadata, setMetadata] = useState({});
  const [programCode, setProgramCode] = useState('');
  const [smartImports, setSmartImports] = useState({});
  const [simulation, setSimulation] = useState(defaultAddr);
  const [metadataJSON, setMetadataJSON] = useState({});
  const [portalLoading, setPortalLoading] = useState(false);
  const [random, setRandom] = useState(Math.random());

  const updateMetadataJSON = (m, ft, s, programCode) => { 
    const json = { };
    const $ = cheerio.load(programCode);
    

    //console.log(min);
    console.log('XXXXXX');
    $('script').each(function(i, elm) {
      
    });
    const pc = programCode; // Todo - minify here
    const files = [];
    for (const [key,value] of Object.entries(m)) { 
      if (key=='uses') { 
        continue;
      }
      
      if (key=='files') { 
        // Always add the actual program code as the first file
        
        files.push({
          'mediaType': "text/html",
          'src': 'data:text/html,'+encodeURIComponent(pc)
        });
        if (typeof value == "string") { 
          continue;
        }
        for (const file of value) { 
          
          
          files.push(file);
        }
        continue;
      }
      json[key]=value;
    }
    json.uses = ft;
    if (files.length<1) { 
         // If we didn't add any files, we still need to add our program code:
      
      files.push({
        'mediaType': "text/html",
        'src': 'data:text/html,'+encodeURIComponent(pc)
      });
    }
    json.files = files;
    setMetadataJSON(json);
    return json;  
  }
  const defaultProgramCode = props.programCode;
  useEffect(() => { 
    if (defaultProgramCode && (!programCode || programCode=='')) { 
      setProgramCode(defaultProgramCode);
      updateMetadataJSON(defaultMetadata, getFeatureTree(defaultUses), simulation, defaultProgramCode);  
    }
  }); 

  const updateSmartImports = (metadata, simulation) => { 
    setPortalLoading(true);
    postData('/getSmartImports',{metadata, walletAddr: simulation}).then((data)=> { 
      data.json().then((json) => { 
        setSmartImports(json);        
        setPortalLoading(false);
      });
    });
  }

  const featureChange = (ft) => { 
    if (ft.transactions && ft.transactions.length===1) {
      ft.transactions = ft.transactions[0];
    }
    if (ft.tokens && ft.tokens.length===1) { 
      ft.tokens = ft.tokens[0];
    }
    setFeatureTree(ft);
    const mdJSON = updateMetadataJSON(metadata, ft, simulation, programCode);
    updateSmartImports(mdJSON, simulation);
  }
  const simulationChange = (s) => { 
    if (!s) return;
    setSimulation(s);
    const mdJSON = updateMetadataJSON(metadata, featureTree, s, programCode);
    updateSmartImports(mdJSON, s);
  }
  
  const programCodeChange = (e) => { 
    if (programCodeTimer) clearTimeout(programCodeTimer);
    programCodeTimer = setTimeout(()=> { 
      setProgramCode(e)
      if (!defaultProgramCode && props.loadStored) {
        localStorage.setItem('cip54-programCode', e); 
      }
      updateMetadataJSON(metadata,featureTree,simulation, e);
    }, 1000);    
  }
  const metadataChange = (e) => {    
    setMetadata(e);
    const mdJSON = updateMetadataJSON(e, featureTree, simulation, programCode);
    updateSmartImports(mdJSON, simulation);
  }
  const refreshProgram = (e) => { 
    setRandom(Math.random())
  }

  useEffect(() => { 
    window.addEventListener('resize', refreshProgram);
    return () => { 
      window.removeEventListener('resize', refreshProgram);
    };
  },[]);

  const progressValue = ((JSON.stringify(metadataJSON, null, "\t").length)/16000)*100;
  
  return (
    <div>
      <Head>
        <title>Smart NFT Playground</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />        
      </Head>      
      <div className={classes.bg} />      
      <DividerBox onDragEnd={refreshProgram} style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}>
        <DividerBox mode='vertical' style={{width: '20%', minWidth: 350}}>
        
          <div style={{outline:'1px solid rgba(0,0,0,0.5)', minHeight: '250px', border: '1px solid #ccc', padding: 5, display: 'flex', borderRadius: '5px', backgroundColor: theme.palette.background.default, overflowY: 'auto'}} >
            <FeatureSelector defaultUses={defaultUses} onChange={featureChange} loadStored={props.loadStored} />
          </div>
          <div style={{outline:'1px solid rgba(0,0,0,0.5)', minHeight: '250px', border: '1px solid #ccc', padding: 5, display: 'flex', flexDirection:'column', justifyContent:'flex-start', borderRadius: '5px', backgroundColor: theme.palette.background.default, overflowY: 'auto'}}> 
            <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Typography style={{}} variant='subtitle2'>NFT Metadata</Typography>
            <Typography style={{}} variant='caption'>{JSON.stringify(metadataJSON,null,"\t").length} bytes</Typography>
            </div>
            <div><LinearProgress variant='determinate' value={progressValue} /></div>
            <MetadataEditor defaultMetadata={defaultMetadata} onChange={metadataChange} loadStored={props.loadStored} />
            <CodeMirror
              editable={false}
              value={JSON.stringify(metadataJSON, null, "\t")}
              height="inherit"
              theme={theme.palette.type}
              extensions={[EditorView.lineWrapping, javascript({ json: true})]}          
            />
          </div>
        </DividerBox>
        <DividerBox onDragEnd={refreshProgram} mode='vertical' style={{width: '80%', minWidth: 100}}>
          <div style={{outline:'1px solid rgba(0,0,0,0.5)', minHeight: '350px', border: '1px solid #ccc', padding: 5, display: 'flex', alignItems:'stretch', borderRadius: '5px', backgroundColor: theme.palette.background.default, overflowY: 'auto'}}> 
            <CodeMirror  
            style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}
              value={programCode}
              onChange={programCodeChange}
              height="inherit"
              theme={theme.palette.type}
              extensions={[javascript({ jsx: true }),html(), css()]}
            />
          </div>
          <div style={{outline:'1px solid rgba(0,0,0,0.5)', minHeight: '350px', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: 5, borderRadius: '5px', backgroundColor: theme.palette.background.default}}>
            <SimulationSelector defaultAddr={defaultAddr} onChange={simulationChange} />
            <SmartNFTPortal random={random} loading={portalLoading} style={{flexGrow: 1, overflowY: 'hidden', overflowX: 'hidden', border:'1px solid black'}} smartImports={smartImports} metadata={metadataJSON} />
          </div>
        </DividerBox>
      </DividerBox>
      <br />      
    </div>
  )
}

Playground.propTypes = {
  programCode: PropTypes.string,
  metadata: PropTypes.object,
  uses: PropTypes.array,
  loadStored: PropTypes.bool
    
};
export default Playground;
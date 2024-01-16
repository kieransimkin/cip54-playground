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
import { SmartNFTPortal, version as smartPortalVersion} from 'smartnftportal';
import MetadataEditor from './MetadataEditor';
import DividerBox from './DividerBox'
let programCodeTimer = null;
import * as React from "react";
import { getFeatureTree, unicodeToBase64 } from '../utils/Helpers';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { minify as htmlMinify } from 'html-minifier-terser'
import eventBus from '../utils/EventBus';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
  const [portalLoading, setPortalLoading] = useState(true);
  const [random, setRandom] = useState(Math.random());
  const mini=async (programCode) => { 
    const retHTML = await htmlMinify(programCode,{
      removeAttributeQuotes:true,
      collapseBooleanAttributes:true,
       collapseInlineTagWhitespace:true,
       collapseWhitespace:true,
       minifyCSS:{level: {2: {all:true}}},
       minifyJS:{
        compress:{
          passes: 2, 
          toplevel:true, 
          booleans_as_integers:false, 
          hoist_funs: true, 
          hoist_vars:true,
          hoist_props: true,
          keep_fargs: false,
          unsafe_methods:true,
          unsafe_arrows:true,
          unsafe_comps:true,
          unsafe_Function:true,
          unsafe_proto:true,
          unsafe:true,
          dead_code:true
        },
        mangle:{
          toplevel:true
        }},
       noNewlinesBeforeTagClose:true,
       removeComments:true,
       removeScriptTypeAttributes:true,
       removeStyleLinkTypeAttributes:true,
       removeEmptyAttributes:false,
       removeEmptyElements:false,
       removeOptionalTags:false,
       removeTagWhitespace:false,
       sortAttributes:true,
       sortClassName:true,
       useShortDoctype:true,
       continueOnParseError:true,
       decodeEntities:true
    });
    const pct = +(Math.round((retHTML.length/programCode.length)*100).toFixed(2));
    console.log("Program Code minified: "+programCode.length+" -> "+retHTML.length+" bytes ("+pct+"%)");
    return retHTML;
  }
  const updateMetadataJSON = async (m, ft, s, programCode) => { 
    const json = { };
    
    const pc = await mini(programCode);
    const splitToLineLength = (string) => { 
      var l = string.length, lc = 0, chunks = [], c = 0, chunkSize = 64;
      for (; lc < l; c++) {
        chunks[c] = string.slice(lc, lc += chunkSize);
      }
      return chunks;
    }
    const files = [];
    if (!m) m={};
    for (const [key,value] of Object.entries(m)) { 
      if (key=='uses') { 
        continue;
      }
      
      if (key=='files') { 
        // Always add the actual program code as the first file
        
        files.push({
          'mediaType': "text/html",
          'src': splitToLineLength('data:text/html;charset=utf-8;base64,'+unicodeToBase64(pc))
        });
        if (typeof value == "string") { 
          continue;
        }
        for (const file of value) { 
          
          
          files.push(file);
        }
        continue;
      }
    
      if (typeof value == "string" && value.length>64) { 
        json[key]=splitToLineLength(value);
      } else { 
        json[key]=value;
      }
    }
    json.uses = ft;
    json.uses.portal=smartPortalVersion;
    json.uses.libcip54=undefined
    //json.uses.libcip54=getVersion();
    if (files.length<1) { 
         // If we didn't add any files, we still need to add our program code:
      
      files.push({
        'mediaType': "text/html",
        'src': splitToLineLength('data:text/html;charset=utf-8;base64,'+unicodeToBase64(pc))
      });
    }
    json.files = files;
    setMetadataJSON(json);
    localStorage.setItem('cip54-wmetadataJSON', JSON.stringify(json));
    return json;  
  }
  const defaultProgramCode = props.programCode;
  useEffect(() => { 
    if (defaultProgramCode && (!programCode || programCode=='')) { 
      process.nextTick(() => { 
        setProgramCode(defaultProgramCode);
        localStorage.setItem('cip54-wprogramCode', defaultProgramCode);
        updateMetadataJSON(defaultMetadata, getFeatureTree(defaultUses), simulation, defaultProgramCode);  
      })  
    }
  }); 
  useEffect(()=>{
    updateSmartImports(metadataJSON,simulation)
  },[])

  const updateSmartImports = (metadata, simulation) => { 
    setPortalLoading(true);
    postData('/getSmartImports',{metadata, walletAddr: simulation}).then((data)=> { 
      data.json().then((json) => { 
        setSmartImports(json);        
        localStorage.setItem('cip54-wsmartImports', JSON.stringify(json));
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
    updateMetadataJSON(metadata, ft, simulation, programCode).then((mdJSON)=>{
      updateSmartImports(mdJSON, simulation);
    })
    
  }
  const simulationChange = (s) => { 
    if (!s) return;
    setSimulation(s);
    updateMetadataJSON(metadata, featureTree, s, programCode).then((mdJSON)=>{
      updateSmartImports(mdJSON, s);
    })
  }
  
  const programCodeChange = (e) => { 
    if (programCodeTimer) clearTimeout(programCodeTimer);
    programCodeTimer = setTimeout(()=> { 
      setProgramCode(e)
      localStorage.setItem('cip54-wprogramCode', e); 
      if (!defaultProgramCode && props.loadStored) {
        localStorage.setItem('cip54-programCode', e); 
      }
      updateMetadataJSON(metadata,featureTree,simulation, e);
    }, 1000);    
  }
  const metadataChange = (e) => {    
    setMetadata(e);
    updateMetadataJSON(e, featureTree, simulation, programCode).then((mdJSON)=>{
      updateSmartImports(mdJSON, simulation);
    })
  }
  const refreshProgram = (e) => { 
    setRandom(Math.random())
  }
  const saveZip = (data) => { 
    const zip = new JSZip();
    zip.file('metadata.json',localStorage.getItem('cip54-wmetadata'));
    zip.file('programCode.html',localStorage.getItem('cip54-wprogramCode'));
    zip.file('nft.json',localStorage.getItem('cip54-wmetadataJSON'))
    zip.file('smartImports.json',localStorage.getItem('cip54-wsmartImports'))
    zip.file('uses.json',localStorage.getItem('cip54-wfeatures'));
    zip.generateAsync({type:'blob'}).then((blob)=>{
      saveAs(blob,"file.zip")
    }).catch((e)=>{
      console.log('ZIP ERROR');
      console.log(e);
    })
  }
  const saveHtml = (data) => { 
    getData("/getHtmlTemplate").then((file)=>{
      if (file.status == 200) {
        file.json().then(text => {
          const newFile = text.file.
              replace('\'{"%%METADATA_TEMPLATE%%":""}\'',JSON.stringify(localStorage.getItem('cip54-wmetadataJSON'))).
              replace('\'{"%%SMARTIMPORT_TEMPLATE%%":""}\'',JSON.stringify(localStorage.getItem('cip54-wsmartImports')));
          const blob = new Blob([newFile], { type : 'text/html' });
          saveAs(blob,"project.html")
        })
      } else { 
        console.log('error');
      }
    })

  }
  const onLink = (link,event) => { 
    window.open(link)
  }
  useEffect(() => { 
    window.addEventListener('resize', refreshProgram);
    eventBus.on("saveZip",saveZip);
    eventBus.on('saveHtml',saveHtml);
    return () => { 
      window.removeEventListener('resize', refreshProgram);
      eventBus.remove("saveZip");
      eventBus.remove('saveHtml',saveHtml);
    };
  },[]);

  const progressValue = ((JSON.stringify(metadataJSON).length)/16000)*100;
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
            <div style={{display: 'flex', flexDirection:'column'}}>
              <Typography variant='h5'>CIP54 features</Typography>
              <FeatureSelector defaultUses={defaultUses} onChange={featureChange} loadStored={props.loadStored} />
            </div>
          </div>
          <div style={{outline:'1px solid rgba(0,0,0,0.5)', minHeight: '250px', border: '1px solid #ccc', padding: 5, display: 'flex', flexDirection:'column', alignItems:'stretch', justifyContent:'flex-start', borderRadius: '5px', backgroundColor: theme.palette.background.default, overflowY: 'auto'}}> 
            <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Typography style={{}} variant='subtitle2'>NFT Metadata</Typography>
            <Typography style={{}} variant='caption'>{JSON.stringify(metadataJSON).length} bytes</Typography>
            </div>
            <div><LinearProgress variant='determinate' value={progressValue} color={progressValue>90?'secondary':'primary'} /></div>
            <MetadataEditor defaultMetadata={defaultMetadata} onChange={metadataChange} loadStored={props.loadStored} />
            <CodeMirror
              style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}
              editable={false}
              value={JSON.stringify(metadataJSON, null, "\t")}
              height="inherit"
              theme={theme.palette.type}
              extensions={[javascript({ json: true})]}          
            />
          </div>
        </DividerBox>
        <DividerBox onDragEnd={refreshProgram} mode='vertical' style={{width: '80%', minWidth: 100}}>
          <div style={{outline:'1px solid rgba(0,0,0,0.5)', minHeight: '40vh', border: '1px solid #ccc', padding: 5, display: 'flex', alignItems:'stretch', borderRadius: '5px', backgroundColor: theme.palette.background.default, overflowY: 'auto'}}> 
            <CodeMirror  
            style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}
              value={programCode}
              onChange={programCodeChange}
              height="inherit"
              theme={theme.palette.type}
              extensions={[EditorView.lineWrapping,html(),javascript({ jsx: true }),css()]}
            />
          </div>
          <div style={{outline:'1px solid rgba(0,0,0,0.5)', minHeight: '40vh', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: 5, borderRadius: '5px', backgroundColor: theme.palette.background.default}}>
            <SimulationSelector defaultAddr={defaultAddr} onChange={simulationChange} />
            <SmartNFTPortal onLink={onLink} loadingContent={<CircularProgress style={{marginTop: '2em', marginLeft: 'auto', marginRight: 'auto'}} />} random={random} loading={portalLoading} style={{flexGrow: 1, overflowY: 'hidden', overflowX: 'hidden', border:'none', outline: '1px solid black'}} smartImports={smartImports} metadata={metadataJSON} />
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
import React, { useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {useTheme, Button, CircularProgress, TextField, FormControl, FormLabel, FormControlLabel} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import StepWizard from "react-step-wizard";
import { Alert, AlertTitle } from '@material-ui/lab';
import WalletContext from '../WalletContext';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';
import { mkBase, postData, buildWitnessed, getData, refreshWallet } from '../../utils/Api';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CustomDialog from '../CustomDialog';
import { validBech32Address } from '../../utils/CSLBrowser'
import AvatarPreview from '../AvatarPreview';
import ColourPicker from '../ColourPicker';
import { ucfirst } from '../../utils/Helpers';
const useStyles = makeStyles(theme => {
  let bgImg='';

  if (theme.palette.type=='dark') { 
    bgImg=`linear-gradient(rgba(15, 14, 13, 0.972),rgba(15, 14, 13, 0.972)) , url('/texture.png')`;
  }
  
  return {
  root: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: '0em'
  },
  actionSelect: { 
    '& *': { 
      fontFamily: "'Baloo Thambi 2', cursive",
      fontSize: '0.9em',
      fontWeight: 600,
      letterSpacing: '0.02em',
      cursor: 'pointer'
    },
    marginTop:'0.5em',
    paddingLeft:'1em',
    paddingTop:'1em',
    paddingBottom:'1em',
    paddingRight:'3em',
    fontFamily: "'Baloo Thambi 2', cursive",
    fontSize:'0.9em',    
    fontWeight: 600,
    letterSpacing: '0.02em',
    borderRadius:'15px',
    appearance: 'none',
    cursor:'pointer',
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.9rem top 50%',
    backgroundSize: '0.65rem auto'
  },
  row: { 
    display: 'flex'
  },
  table: { 
    display: 'flex',
    flexDirection:'column'
  },
  column: { 
    display: 'flex',
    flexDirection: 'row'
  },
  closeButton: {
    position: 'relative',
    right: '-0.4em',
    top: '0em',
    color: theme.palette.grey[500],
  },
  dialog: {
    backgroundColor: theme.palette.background.paper, 
    color: theme.palette.text.primary,
    
    width: 'calc(100% - 3em)',
    maxWidth: 'none !important',
    minWidth: '600px',
  },
  button: {
    fontFamily: "'Baloo Thambi 2', cursive",
    fontWeight: 600,
    letterSpacing: '0.02em',
    borderRadius: '1.5em'
  },
  input: { 
      backgroundImage: bgImg,
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
      borderRadius: '15px',
      boxShadow: (theme.palette.type=='dark') ? `1px 1px 10px 5px inset rgba(0,0,0,0.4), 0px 0px 10px 1px rgba(0,0,0,0.5)` : ''
  },
  paper: {
      borderRadius: '5px !important',
      outline: '1px solid black',
      boxShadow: '2px 2px 15px 3px rgba(0,0,0,0.4)'
  }
}});


const Step1 = ({nextStep, onSpecChange, onFeatureTypeChange, goToStep, currentStep, handleClose}) => { 
  const wallet = useContext(WalletContext);
  
  const [enableNext, setEnableNext] = useState(false);
  const [bodyColour, setBodyColour] = useState({hex:'#7B746D',rgb:{r:123,g:116,b:109,a:1}})
  const [headColour, setHeadColour] = useState({hex:'#7D6658',rgb:{r:125,g:102,b:88,a:1}})
  const [avatarSpec, setAvatarSpec] = useState({body:'pregnant',head:'pig', bodyColour, headColour})
  

  const handleChange = (e, name) => { 
    setEnableNext(false);
    onFeatureTypeChange(e,name);
    const newSpec={...avatarSpec}
    newSpec.body = name;
    setAvatarSpec(newSpec)
    onSpecChange(e, newSpec);
    console.log(newSpec);
    setEnableNext(true);
  }
  const bodyColourChange=(col) => {
    setEnableNext(true); 
    setBodyColour(col);
    const newSpec={...avatarSpec}
    newSpec.bodyColour = col;
    onSpecChange(null, newSpec);
    setAvatarSpec(newSpec)
    console.log(col);
  }

  const headColourChange=(col) => {
    setEnableNext(true); 
    setHeadColour(col);
    const newSpec={...avatarSpec}
    newSpec.headColour = col;
    setAvatarSpec(newSpec)
    onSpecChange(null, newSpec);
    console.log(col);
  }
  const headChange = (e,head) => { 
    setEnableNext(true);
    const newSpec={...avatarSpec}
    newSpec.head=e.target.value;
    setAvatarSpec(newSpec);
    onSpecChange(e, newSpec);
    console.log(e.target.value);
  }
  const heads = ['alien','boarman','frankenstein','goblin','human_female','human_female_elderly','human_male','human_male_elderly','human_male_gaunt','jack','lizard_female','lizard_male','minotaur','minotaur_female','mouse','orc_female','orc_male','pig','rabbit','rat','sheep','skeleton','troll','vampire','wartotaur','wolf_female','wolf_male','zombie'];
  const classes = useStyles();
  const policies = Object.keys(wallet.assets.tokens);
  const theme = useTheme();
  const headOpts = heads.map((h)=><option key={h} value={h}>{ucfirst(h.replaceAll('_',' '))}</option>);

  return <>
    <DialogContent className={classes.dialog}>
      <DialogTitle currentStep={currentStep} id="customized-dialog-title" onClose={handleClose} goToStep={goToStep}>
        Mint New Avatar
      </DialogTitle>
      <div style={{display:'flex', gap:'2em', alignItems:'center'}}> 
      <AvatarPreview spec={avatarSpec} />
      <div>
      <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Build Type</FormLabel>
      &nbsp;
      <RadioGroup value={avatarSpec.body} aria-label="type" name="type" onChange={handleChange}>
      <div className={classes.row}>
        <FormControlLabel value="male" label="Male" control={<Radio/>} >Male</FormControlLabel>
        </div>
        <div className={classes.row}>
          <FormControlLabel value="female" label="Female" control={<Radio/>} >Female</FormControlLabel>
        </div>
        <div className={classes.row}>
            <FormControlLabel value="teen" label="Teen" control={<Radio/>} >Teen</FormControlLabel>
        </div>
        
        <div className={classes.row}>
        <FormControlLabel value="pregnant" label="Pregnant" control={<Radio/>} >Pregnant</FormControlLabel>
        </div>
        
        <div className={classes.row}>
        <FormControlLabel value="muscular" label="Muscular" control={<Radio/>} >Muscular</FormControlLabel>
        
        </div>
      </RadioGroup>
      </FormControl><br />
      
      <FormControl>
      <div style={{display:'flex', alignItems:'center',gap:'0.8em'}}>
      <FormLabel id="demo-head-label">Head</FormLabel>
      <select className={classes.actionSelect} value={avatarSpec.head} onChange={headChange}>
  {headOpts}
      </select>
      </div>
      </FormControl><br />&nbsp;<br />
      <div style={{display:'flex', alignItems:'center', gap:'0.8em'}}>
      <FormLabel id="demo-body-tone-label">Body Tone</FormLabel>
      <ColourPicker disableAlpha={true} colour={bodyColour} onChange={bodyColourChange}/>
      <FormLabel id="demo-head-tone-label">Head Tone</FormLabel>
      <ColourPicker disableAlpha={true} colour={headColour} onChange={headColourChange}/>
      </div>
      </div>
      </div>
     </DialogContent>
     <DialogButtons previousStep={null} nextStep={nextStep} enableNext={enableNext} />
  </>;
};
const Step2 = ({ spec, featureType, onSpecChange, previousStep, goToStep, nextStep, currentStep, handleClose, onImportChange }) => { 
  const classes = useStyles();
  const [enableNext, setEnableNext] = useState(false);
  const [name, setName] = useState('');
  const nameChange=(e,v)=>{
    setName(e.target.value);
    const newSpec={...spec}
    newSpec.name=e.target.value;
    onSpecChange(e, newSpec);
    if (e.target.value.length>0) { 
      setEnableNext(true); 
    } else { 
      setEnableNext(false); 
    }
  }
  return <>
  <DialogContent className={classes.dialog}>
      <DialogTitle currentStep={currentStep} id="customized-dialog-title" onClose={handleClose} goToStep={goToStep}>
        Choose Avatar Name
      </DialogTitle>
      <div style={{display:'flex', gap:'2em', alignItems:'center'}}>
      <div>
      <FormLabel id="demo-name-label">Name your Avatar</FormLabel><br />&nbsp;<br />
      <TextField variant="outlined" onChange={nameChange} value={name} placeholder="Choose Name" label="Name" /><br />&nbsp;<br />
      <Typography variant="caption">Clothes, weapons and batteries sold separately.</Typography>
      <br />&nbsp;<br />
      
      <Alert width="" severity="error" style={{position:'relative',top:'0em'}}>
      <AlertTitle>Technology demonstration alpha preview</AlertTitle>
      This project enters beta on the 7th September - until then, use at your own risk, no refunds will be issued if you receive a non-working NFT.
      </Alert>
      </div> 
      <AvatarPreview spec={spec} />
      
      </div>
      </DialogContent>
      <DialogButtons previousStep={previousStep} nextStep={nextStep} enableNext={enableNext} />
  </>
}


const Step3 = ({spec, previousStep, goToStep, nextStep, currentStep, isActive, handleClose, deviceName,address, country, device}) => { 
  const theme = useTheme();
  const wallet = useContext(WalletContext);
  const classes= useStyles();  
  
  
  const [transaction, setTransaction] = useState(false);

  useEffect(() => {
    

    if (isActive && !transaction) {
        console.log('generating transaction');
        mkBase(wallet).then(base => { 
          const dat = {
            spec,
            ...base
          };
          console.log(dat);
          
          postData('/buy', dat).then(res => {
            if (res.status == 200) {
              res.json().then(body => {
                console.log(body);
                wallet.api.signTx(body.tx, true).then(witness => {
                  const pl = { tx: body.tx, ref: body.ref, wit: witness, txBody: body.txBody, aux: body.aux };
                  buildWitnessed(pl,wallet.api, (txid) => { 
                    dat.txHash = txid;
                    postData('/complete', dat).then(res => { 

                    });
                  });
                }).catch(e => { 
                  if (typeof e == "object" && e.hasOwnProperty('message')) { 
                    alert(e.message);
                  } else if (typeof e == "object" && e.hasOwnProperty('info')) {
                    alert('Signature failed: '+e.info)
                  } else { 
                    alert('Signature cancelled');
                    console.log(e);
                  }
                  
                  console.error(e);
                });
              })
            } else {
              console.error('Bad request');
            }
          })
        });
        setTransaction(true);
    } else if (!isActive && transaction) { 
      setTransaction(false);
    }
});
  return <>
    <DialogContent className={classes.dialog}>
      <DialogTitle currentStep={currentStep} id="customized-dialog-title" goToStep={goToStep} onClose={handleClose}>
        Generating Transaction
      </DialogTitle>
      <Alert width="" severity="error" style={{position:'relative',top:'0em'}}>
      <AlertTitle>Technology demonstration alpha preview</AlertTitle>
      This project enters beta on the 7th September - until then, use at your own risk, no refunds will be issued if you receive a non-working NFT.
      </Alert><br />&nbsp;<br />
      <div style={{width:'100%', textAlign: 'center'}}>
      <Typography variant="body1">Please wait...</Typography><br />
      <CircularProgress color="primary" />
      </div>
     </DialogContent>

     <DialogButtons previousStep={previousStep} nextStep={nextStep} />
  </>;
};
const DialogButtons = ({previousStep, nextStep, enableNext, nextStepLabel}) => { 
  const theme = useTheme();
  const classes=useStyles();
  return (
    <DialogActions sx={{padding: '0px 8px 8px 8px', backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary}}>
      {previousStep &&
        <Button size="large" className={classes.button}  onClick={previousStep}>Previous</Button>  
      }
      {nextStep && 
        <Button size="large" endIcon=<ArrowForwardIcon /> disabled={!enableNext} className={classes.button} variant="contained" onClick={nextStep} autoFocus color="secondary">{nextStepLabel ? nextStepLabel : 'Next'}</Button>
      }
    </DialogActions>
  );
}

const DialogTitle = (props) => {
  const classes = useStyles();
  const { children, currentStep, goToStep, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography {...other} className={classes.root}>
      <div style={{display: 'flex', paddingRight:'-4em', justifyContent:'space-between'}}>
        <div style={{flexGrow:1}}> 
          <Typography variant="h6">{children}</Typography>
        </div>
        <div style={{position: 'relative',top:'-0.4em'}}>
          <Radio onChange={(e) => { if (e.target.checked) { goToStep(1); } }} checked={currentStep==1} disabled={!(currentStep>=1)} />
          <Radio onChange={(e) => { if (e.target.checked) { goToStep(2); } }} checked={currentStep==2} disabled={!(currentStep>=2)} />
          <Radio onChange={(e) => { if (e.target.checked) { goToStep(3); } }} checked={currentStep==3} disabled={!(currentStep>=3)} />
        </div>
        <div style={{position: 'relative', 'top':'-0.5em', 'right':'-0.5em'}}>
          {onClose ? (
            <IconButton aria-label="close" onClick={onClose} className={classes.closeButton} >
              <CloseIcon />
            </IconButton>
          ) : null}
        </div> 
      </div>
    </MuiDialogTitle>
  );
};


const MintSmartAvatarDialog = (props) => {
  const { onClose, open, onImportChange } = props;  
  const [featureType, setFeatureType] = useState(null);
  const [spec, setSpec] = useState(null);

  const theme = useTheme();
  const classes=useStyles();
    const handleClose =  (_, reason) => {
      if (reason !== "backdropClick") {
        onClose(null); 
      }
    };
    const onSpecChange = (e, val) => { 
      setSpec(val);
    }
    const onFeatureTypeChange = (e,val) => { 
      setFeatureType(val);
    }

    const importChange = (change) => { 
      onImportChange(change);
    }
    
    return (
      <div>
        <CustomDialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          
            <StepWizard>
              <Step1 onFeatureTypeChange={onFeatureTypeChange} onSpecChange={onSpecChange} handleClose={handleClose} />
              <Step2 spec={spec} featureType={featureType} onSpecChange={onSpecChange} onImportChange={importChange} handleClose={handleClose} />
              <Step3 spec={spec} handleClose={handleClose} />  
            </StepWizard>
          
        </CustomDialog>
      </div>
    );
}
MintSmartAvatarDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onImportChange: PropTypes.func.isRequired
};
export default MintSmartAvatarDialog;
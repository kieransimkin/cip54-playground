import React, { useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {useTheme, Button, CircularProgress, TextareaAutosize} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import StepWizard from "react-step-wizard";
import WalletContext from '../WalletContext';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {TextField} from '@material-ui/core';
import CustomDialog from '../CustomDialog';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';

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
  row: { 
    display: 'flex',
    alignItems: 'center'
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

const Step1 = ({nextStep, onSelectTypeChange, goToStep, currentStep, handleClose}) => { 
  const wallet = useContext(WalletContext);
  const [selectType, setSelectType] = useState(null);
  const [enableNext, setEnableNext] = useState(false);

  const handleChange = (e, name) => { 
    setEnableNext(false);
    setSelectType(name);
    onSelectTypeChange(e,name);
    setEnableNext(true);
  }

  const classes = useStyles();
  const policies = Object.keys(wallet.assets.tokens);
  
  const theme = useTheme();
  
  return <>
    <DialogContent className={classes.dialog}>
      <DialogTitle currentStep={currentStep} id="customized-dialog-title" onClose={handleClose} goToStep={goToStep}>
        Select where from
      </DialogTitle>    
      <Typography variant="body1">Would you like to import a token from your wallet, or any other token?</Typography>
      <br />&nbsp;<br />
      <RadioGroup aria-label="type" name="type" onChange={handleChange}>
        <div className={classes.row}>
          <Radio value="wallet" checked={selectType=='wallet'} onChange={handleChange} name="type-radio" />
          <div style={{cursor: 'pointer'}} onClick={()=> handleChange(null,'wallet')}>
            <Typography>My Wallet</Typography>
            <Typography variant='caption'>Import from my wallet</Typography>
          </div>
        </div>
        <br />
        <div className={classes.row}>
          <Radio value="other" checked={selectType=='other'} onChange={handleChange} name="type-radio" />
          <div style={{cursor: 'pointer'}} onClick={()=> handleChange(null,'other')}>
            <Typography>Any other token</Typography>
            <Typography variant='caption'>Specify the token by policy ID and token name</Typography>
          </div>
        </div>      
        <br />
      </RadioGroup>
     </DialogContent>
     <DialogButtons previousStep={null} nextStep={nextStep} enableNext={enableNext} />
  </>;
};
const Step2 = ({ selectType, previousStep, goToStep, nextStep, currentStep, handleClose, onImportChange }) => { 
  if (selectType=='wallet') { 
    return <Step2Wallet selectType={selectType} previousStep={previousStep} goToStep={goToStep} nextStep={nextStep} currentStep={currentStep} handleClose={handleClose} onImportChange={onImportChange}/>
  } else if (selectType=='other') { 
    return <Step2Other selectType={selectType} previousStep={previousStep} goToStep={goToStep} nextStep={nextStep} currentStep={currentStep} handleClose={handleClose} onImportChange={onImportChange}/>    
  
  }
}

const Step2Wallet = ({ previousStep, goToStep, nextStep, currentStep, handleClose, onImportChange }) => { 
  const theme = useTheme();
  const [enableNext, setEnableNext] = useState(false);
  const [string, setString] = useState('');
  const [fieldName, setFieldName] = useState('');
  const wallet = useContext(WalletContext);
  const classes = useStyles();
  
  const handleStringChange = (e) => { 
    setString(e.target.value);
    if (e.target.value.length>0 && fieldName?.length>0) { 
      setEnableNext(true);
    } else { 
      setEnableNext(false);
    }
  }
  const handleFieldNameChange = (e) => { 
    setFieldName(e.target.value);
    if (e.target.value.length>0 && string?.length>0) { 
      setEnableNext(true);
    } else { 
      setEnableNext(false);
    }
  }
  const complete = () => { 
    onImportChange({fieldName, string});
    handleClose();
  }
  return <>
    <DialogContent className={classes.dialog}>
      <DialogTitle currentStep={currentStep} id="customized-dialog-title" goToStep={goToStep} onClose={handleClose}>
        Enter string field
      </DialogTitle>
      <Typography variant="body1">Enter field name and a value for this field</Typography>
      <br />
      <TextField value={fieldName} style={{width:'300px'}} autoFocus onChange={handleFieldNameChange} label="Field Name" variant='outlined'/>
      <TextField value={string} style={{width:'300px'}} autoFocus onChange={handleStringChange} label="Value" variant='outlined'/>
      <br />
     </DialogContent>
     <DialogButtons previousStep={previousStep} nextStep={complete} nextStepLabel='Add' enableNext={enableNext} />    
  </>;
};
const Step2Other = ({ previousStep, goToStep, nextStep, currentStep, handleClose, onImportChange }) => { 
  const theme = useTheme();
  
  const [enableNext, setEnableNext] = useState(false);
  const [json, setJSON] = useState("{\n\n}");
  const [fieldName, setFieldName] = useState('');
  
  const wallet = useContext(WalletContext);
  
  const classes = useStyles();
  
  const handleJSONChange = (e) => { 
    setJSON(e);
    let parsed=true;
    try {
      JSON.parse(e);
    } catch (ex) { 
      parsed=false;
    }
    if (e.length>0 && fieldName?.length>0 && parsed) { 
      setEnableNext(true);
    } else { 
      setEnableNext(false);
    }
  }
  const handleFieldNameChange = (e) => { 
    setFieldName(e.target.value);
    if (e.target.value.length>0 && json?.length>0) { 
      setEnableNext(true);
    } else { 
      setEnableNext(false);
    }
  }
  const complete = () => { 
    onImportChange({fieldName, json});
    handleClose();
  }
  return <>
    <DialogContent className={classes.dialog}>
      <DialogTitle currentStep={currentStep} id="customized-dialog-title" goToStep={goToStep} onClose={handleClose}>
        Enter JSON field
      </DialogTitle>
      <Typography variant="body1">Enter field name and a value for this field</Typography>
      <br />&nbsp;<br />
      <TextField value={fieldName} style={{width:'500px'}} autoFocus onChange={handleFieldNameChange} label="Field Name" variant='outlined'/>
      <br />&nbsp;<br />
      <CodeMirror
              editable={true}
              value={json}
              style={{outline:'1px solid rgba(0,0,0,0.3)'}}
              height="inherit"
              theme={theme.palette.type}
              extensions={[EditorView.lineWrapping, javascript({ json: true})]}
              onChange={handleJSONChange}
            />
      <br />
     </DialogContent>
     <DialogButtons previousStep={previousStep} nextStep={complete} nextStepLabel='Add' enableNext={enableNext} />    
  </>;
};

const DialogButtons = ({previousStep, nextStep, enableNext, nextStepLabel}) => { 
  const theme = useTheme();
  const classes=useStyles();
  return (
    <DialogActions sx={{backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary}}>
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

const ImportBlockchainDialog = (props) => {
  const { onClose, open, onImportChange } = props;  
  const [selectType, setSelectType] = useState(null);

  const theme = useTheme();
  const classes=useStyles();
    const handleClose =  (_, reason) => {
      onClose(null); 
      if (reason !== "backdropClick") {
        
      }
    };
    const onSelectTypeChange = (e,val) => { 
      setSelectType(val);
    }

    const importChange = (change) => { 
      onImportChange(change);
    }
    
    return (
      <div>
      
        <CustomDialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          
            <StepWizard>
            <Step1 onSelectTypeChange={onSelectTypeChange} handleClose={handleClose} />
            <Step2 selectType={selectType} onImportChange={importChange} handleClose={handleClose} />
            </StepWizard>
          
        </CustomDialog>
      </div>
    );
}
ImportBlockchainDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onImportChange: PropTypes.func.isRequired
};
export default ImportBlockchainDialog;
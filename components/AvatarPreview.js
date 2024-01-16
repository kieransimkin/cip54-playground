import { useState , useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import {IconButton, useTheme, Button, Select} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MenuItem from "@material-ui/core";
import FormControl from "@material-ui/core";
import InputLabel from "@material-ui/core";
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import ArrowLeftIcon from '@material-ui/icons/ArrowBack';
import ArrowRightIcon from '@material-ui/icons/ArrowForward';
import { Typography } from "@material-ui/core";
import Link from "next/link";
import { makeStyles, StylesContext } from "@material-ui/core/styles";
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Image from "next/image";
import ColourPicker from "./ColourPicker";
const useStyles = makeStyles(theme => { 
  const first = alpha(theme.palette.background.paper, 1);
  const second = alpha(theme.palette.background.paper, 0);
  let buttonCol = theme.palette.primary;
  if (theme.palette.type=='dark') { 
    buttonCol = theme.palette.background.paper;
  }
  return {
    root: {
      borderRadius: '2em !important',
      transition: 'flex-basis 0.8s ease',
      filter: 'drop-shadow(9px 5px 8px rgba(0,0,0,0.25))',
      backgroundColor: '#000',
      backgroundImage: `url('/fractal-colorwaves-background.jpg') !important`,
      width: 'fit-content',
      outline:'1px solid #000000aa',
      overflow: 'visible !important'
    },
    button: { 
      borderRadius: '3em !important',
      marginLeft: '0.1em',
      marginRight:'0.1em',
      padding:0,
      color:buttonCol,
      minWidth: '0px !important',
      border:'1px solid white',
      background:'#fff'
    },
    cardContent: { 
      padding: '0 !important'
    },
    actionArea: { 
      height: '100%'
    },
    slider: { 
      position:'absolute',
      left:'-102px',
      top:'145px',
      
      opacity:'0.7',
      
      cursor:'pointer'
    },
    sliderContainer: { 
      position:'relative',
      width:'0',
      right:'0',
      marginRight:'0px'
    },
    actionSelect: {
      '& *': { 
        fontFamily: "'Baloo Thambi 2', cursive",
        fontSize:'0.9em',    
        fontWeight: 600,
        letterSpacing: '0.02em',
        cursor: 'pointer'
      }, 
      marginTop:'0.5em',
      cursor: 'pointer',
      paddingLeft:'1em',
      paddingTop:'1em',
      paddingBottom:'1em',
      paddingRight:'3em',
      borderRadius:'15px',
      appearance: 'none',
      
    fontFamily: "'Baloo Thambi 2', cursive",
    fontSize:'0.9em',    
    fontWeight: 600,
    letterSpacing: '0.02em',
      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.9rem top 50%',
      backgroundSize: '0.65rem auto'
    },
    canvas: { 
      borderRadius:'20px',
      boxShadow:'inset 2px 2px 2px rgba(0,0,0,0.5)',
      marginLeft:'1em',
      marginRight:'1em'
    }
  };
});
const AvatarPreview = (props) => {
  const {spec} = props;
  let stage,circle;
  const theme = useTheme();
  const stageRef = useRef();
  const zoomRef = useRef();
  const zoomLabelRef = useRef();
  const cardRef = useRef();
  const actionRef = useRef();
  const classes = useStyles(props);
  const [up, setUp]=useState(false);
  const [anims,setAnimations] = useState([]);
  const [direction,setDirection]=useState('down');
  const [action, setAction]=useState('walk');
  const [continueAction, setContinueAction]=useState('walk');
  const backgroundX=useRef(null);
  const backgroundY=useRef(null);
  const [colour, setColour] = useState({rgb:{r:93,g:32,b:224,a:0.3},hex:'#5D20E0'})
  const [zoom, setZoom] =useState(2);
  const getAnimations = () => { 
    return { 
      frames: {width:64,height:64}, 
      framerate: 9,
      animations:{
        walkright:[143,151],
        walkdown:[130,138],
        walkleft:[117,125],
        walkup:[104,112],
        castup:[0,6,'walkup'],
        castleft:[13,19,'walkleft'],
        castdown:[26,32,'walkdown'],
        castright:[39,45,'walkright'],
        thrustup:[52,59,'walkup'],
        thrustleft:[65,72,'walkleft'],
        thrustdown:[78,85,'walkdown'],
        thrustright:[91,98,'walkright'],
        slashup:[156,161,'walkup'],
        slashleft:[169,174,'walkleft'],
        slashdown:[182,187,'walkdown'],
        slashright:[195,200,'walkright'],
        shootup:[208,220,'walkup'],
        shootleft:[221,233,'walkleft'],
        shootdown:[234,246,'walkdown'],
        shootright:[247,259,'walkright'],
        hurtup:[260,265,'walkup'],
        hurtleft:[260,265,'walkleft'],
        hurtdown:[260,265,'walkdown'],
        hurtright:[260,265,'walkright']
        
      }
    }
  }
  const changeAction=()=>{
    for (const animation of anims) { 
      animation.gotoAndPlay(actionRef.current.value+direction);
    }
    setAction(actionRef.current.value);
    setContinueAction(actionRef.current.value);
  }
  
  var manifest = [
    {src:"/fractal-colorwaves-background.jpg", id:"fractal"}    
    ];
  
  if (spec?.body) { 
    manifest.push({src:"/LPC-spritesheet-collection/input/body/bodies/"+spec.body+"/universal.png",id:"body"});
  }
  if (spec?.head) { 
    manifest.push({src:"/LPC-spritesheet-collection/input/head/heads/"+spec.head+"/universal.png",id:'head'})
  }
  
  useEffect(()=> { 
    const ground = new createjs.Shape();
  
    const spriteSheets=[];
    const animations=[];
    
	  var queue = new createjs.LoadQueue(false);
    queue.loadManifest(manifest,true);
    function onScroll(e) { 
      
      console.log(e.deltaY)
      console.log(up);
      let newZoom = zoom;
      if (up && e.deltaY>0) { 
        newZoom = zoom+e.deltaY/2000;

      } else if (up && e.deltaY<0) { 
        newZoom=zoom+e.deltaY/2000;

      
      } else if (!up && e.deltaY<0) { 
        newZoom=zoom-e.deltaY/2000

      } else if (!up && e.deltaY>0) { 
        newZoom=zoom-e.deltaY/2000;

      }
      if (newZoom>=4) { 
        newZoom=4;
        console.log(up,!up);
        setUp(!up);
        
      }
      if (newZoom<=1) { 
        newZoom=1;
        console.log(up,!up);
        setUp(!up);
      }
      setZoom(newZoom);
      zoomRef.current.value=newZoom;
      
      zoomLabelRef.current.innerHTML='×'+Math.round(newZoom*10)/10
    }
    function handleTick(event) {
      if (!stage) createjs.Ticker.removeEventListener('tick',handleTick)
      if (action=='walk') { 

      if (direction=='right') { 
        ground.x = (ground.x - event.delta * 0.030 * zoom) % ground.tileW;
        backgroundX.current=ground.x;
      } else if (direction=='left') { 
        ground.x = (ground.x + event.delta * 0.030 * zoom) % ground.tileW;
        if (ground.x>0) ground.x-=ground.tileW
        backgroundX.current=ground.x;
      } else if (direction=='up') { 
        ground.y = (ground.y + event.delta * 0.012 * zoom) % ground.tileH;
        if (ground.y>0) ground.y-=ground.tileH;
        backgroundY.current=ground.y;
      } else if (direction=='down') { 
        ground.y = (ground.y - event.delta * 0.012 * zoom) % ground.tileH;
        backgroundY.current=ground.y;
      }
      
      }
      if (typeof stage != 'undefined') { 
        stage.update(event);
      }
  
    }
window.addEventListener('wheel',onScroll);
queue.addEventListener("complete",()=>{ 


  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", handleTick);
 
  //Create a stage by getting a reference to the canvas
  stage = new createjs.StageGL(stageRef.current);

  //Create a Shape DisplayObject.
  circle = new createjs.Shape();
  
  circle.graphics.beginFill(colour.hex+((Math.round(colour.rgb.a*255)).toString(16)).padStart(2,'0')).drawRect(0, 0, 256,256);
  //Set position of Shape instance.
  circle.x = 0;
  circle.y = 0;
  //Add Shape instance to stage display list.
  
  circle.cache(0,0,256,256)
  var groundImg = queue.getResult('fractal')
  if (backgroundX.current) { 
    ground.x=backgroundX.current; 
  } else { 
    ground.x=-groundImg.width;
    backgroundX.current=ground.x;
  }
  if (backgroundY.current) { 
    ground.y=backgroundY.current;
  } else { 
    ground.y=-groundImg.height;
    backgroundY.current=ground.y;
  }
  
  ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, groundImg.width*2, groundImg.height*2);
  ground.tileW = groundImg.width;
  ground.tileH = groundImg.height;
  
  
  //By default swapping between Stage for StageGL will not allow for vector drawing operation such as BitmapFill, useless you cache your shape.
  ground.cache(0, 0, groundImg.width*2, groundImg.height*2);
  stage.addChild(ground)
  stage.addChild(circle);
  const layers =[];

  layers.push({...getAnimations(), images:["/LPC-spritesheet-collection/input/shadow/adult/shadow.png"] })
  if (spec?.body) { 
    console.log('loading body');
    const bmp = new createjs.Bitmap("/LPC-spritesheet-collection/input/body/bodies/"+spec.body+"/universal.png");
    console.log(spec.bodyColour)
    bmp.filters = [
      new createjs.ColorFilter(1,1,1,1, spec.bodyColour.rgb.r-128,spec.bodyColour.rgb.g-128,spec.bodyColour.rgb.b-128,0)
    ];
    const bounds = bmp.getBounds();
    
    bmp.cache(0, 0,bounds?.width, bounds?.height);       // use our StageGL to cache
    
    layers.push({...getAnimations(), images:[bmp.cacheCanvas]})
  }
  if (spec?.head) { 
    const bmp = new createjs.Bitmap("/LPC-spritesheet-collection/input/head/heads/"+spec.head+"/universal.png");
    console.log(spec.headColour)
    bmp.filters = [
      new createjs.ColorFilter(1,1,1,1, spec.headColour.rgb.r-128,spec.headColour.rgb.g-128,spec.headColour.rgb.b-128,0)
    ];
    const bounds = bmp.getBounds();
    
    bmp.cache(0, 0,bounds?.width, bounds?.height);       // use our StageGL to cache
    
    layers.push({...getAnimations(), images:[bmp.cacheCanvas]})
  }
  for (const layer of layers) { 
    
    const sheet = new createjs.SpriteSheet(layer);
    
    const animation = new createjs.Sprite(sheet,action+direction);
    //animation.cache(0,0,animation.width,animation.height)
    animation.setTransform((256-64*zoom)/2,(256-64*zoom)/2-(8*zoom),zoom,zoom);
    animation.addEventListener('animationend',(e) => { 
      if (e.next=='walkup'||e.next=='walkdown'||e.next=='walkleft'||e.next=='walkright') { 
        setAction('walk')
      }
    })
    stage.addChild(animation);
    spriteSheets.push(sheet);
    animations.push(animation);
  }
  setAnimations(animations);
  
  //Update stage will render next frame
  if (typeof stage != 'undefined') { 
    stage.update();
  }
})

  return () => { 
    setAnimations([]);
    createjs.Ticker.removeAllEventListeners("tick")
    window.removeEventListener("wheel",onScroll)
    if (stage) { 
      stage.enableMouseOver(-1);
      stage.enableDOMEvents(false);
      stage.removeAllEventListeners();
      stage.removeAllChildren();
      //stage.canvas = null;
      //stage = null;
    }
  }
  },[direction,zoom,action,colour,spec])
  const goUp=() => { 
    if (continueAction) { 
      setAction(continueAction);
    }
    for (const animation of anims) { 
      animation.gotoAndPlay(continueAction+'up');
    }
    setDirection('up');
  }
  const goDown=()=> { 
    if (continueAction) { 
      setAction(continueAction);
    }
    for (const animation of anims) { 
      animation.gotoAndPlay(continueAction+'down');
    }
    setDirection('down');
  }
  const goLeft=()=>{
    if (continueAction) { 
      setAction(continueAction);
    }
    for (const animation of anims) { 
      animation.gotoAndPlay(continueAction+'left');
    }
    setDirection('left');
  }
  const goRight=()=>{
    if (continueAction) { 
      setAction(continueAction);
    }
    for (const animation of anims) { 
      animation.gotoAndPlay(continueAction+'right');
    }
    setDirection('right');
  }
  const colourChange=(colour) => { 
    setColour(colour);
  }
  const zoomChange=() => { 
    
    for (const animation of anims) { 
      animation.setTransform((256-64*zoomRef.current.value)/2,(256-64*zoomRef.current.value)/2-(8*zoomRef.current.value),zoomRef.current.value,zoomRef.current.value);
    }
    zoomLabelRef.current.innerHTML='×'+Math.round(zoomRef.current.value*100)/100
    //setUp(true);
    setZoom(Number(zoomRef.current.value));
  }
  return (
      <Card id="avatarpreviewcard" className={classes.root} raised={false} variant="elevation" ref={cardRef} style={{backgroundPositionX: 0, backgroundPositionY:0}}>
      <div style={{display:'flex',flexDirection:'column', alignItems:'center'}}> 
      <div style={{color:'white', position: 'relative',top:'0.01em'}}>
      <Typography variant="caption" style={{textShadow:'1px 1px 2px #000000ff, 1px 1px 2px #000000ff'}}>
        Zoom: <b><span ref={zoomLabelRef}>×2</span></b>
        </Typography>
        </div>
        <div style={{position:'relative'}}>
        <div style={{textAlign:'center', position:'relative',maxWidth: '230px', top:'0.7em',left:'0', translateX:'-50%', overflow: 'visible', height: '0px'}}>
        <Typography variant="h4" style={{textAlign: 'center',textShadow:'1px 1px 2px #000000ff, 1px 1px 2px #000000ff', color:'white'}}>
          {spec?.name}
          </Typography>
        </div>
      </div>
      <canvas ref={stageRef} className={classes.canvas} width="256" height="256" />
      <input ref={zoomRef} step="0.1" onChange={zoomChange} type="range" min="1" max="4" defaultValue={zoom} className={classes.slider} id="myRange"></input>
      <div style={{position:'relative', width:'100%'}}><div style={{zIndex: 20, marginLeft:'1em', top:'-256px', marginRight:'1em', width: '256px',height:'256px', position: 'absolute', outline: '1px solid #000000bb', backgroundImage:'linear-gradient(180deg,#00000030 0%,#ffffff0a 50%)', borderRadius:'20px', boxShadow:'inset 2px 2px 15px 5px rgba(0,0,0,0.5)',pointerEvents:'none'}}></div></div>
      <div style={{display:'flex', width:'100%',justifyContent:'center', margin:'auto', marginRight:'1em',marginLeft:'1em', marginBottom:'0.5em',marginTop:'0.5em'}}>
      
      <Button className={classes.button} color="primary" onClick={goLeft}><ArrowLeftIcon/></Button>
      <IconButton className={classes.button} color="primary" onClick={goUp}><ArrowUpIcon/></IconButton>
      <ColourPicker disableAlpha={false} colour={colour} onChange={colourChange} />
      <IconButton className={classes.button} color="primary" onClick={goDown}><ArrowDownIcon/></IconButton>
      <IconButton className={classes.button} color="primary" onClick={goRight}><ArrowRightIcon/></IconButton>
      
      </div>
      <select className={classes.actionSelect} ref={actionRef} value={action} onChange={changeAction}>
        <option value="walk">
          Walk
        </option>
        <option value="cast">
          Cast
        </option>
        <option value="thrust">
          Thrust
        </option>
        <option value="slash">
          Slash
        </option>
        <option value="shoot">
          Shoot
        </option>
        <option value="hurt">
          Hurt
        </option>
      </select><br />
      
            </div>
      
        
      </Card>
  );
  
}
AvatarPreview.propTypes = {
  spec: PropTypes.object.isRequired
};
export default AvatarPreview;
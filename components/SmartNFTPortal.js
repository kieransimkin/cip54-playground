import { makeStyles } from '@material-ui/core/styles';
import { StylesContext } from '@material-ui/styles';
import { CircularProgress, Dialog } from '@material-ui/core';
import PropTypes from 'prop-types';
import ReactDOMServer from "react-dom/server";
import { useEffect, useRef } from 'react';
function dataURItoString(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = decodeURIComponent(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    
    return new TextDecoder().decode(ia);
  
  }
const useStyles = makeStyles((theme) => {
    let bgImg='url(/paper-texture-light.jpg)';

    if (theme.palette.type=='dark') { 
        bgImg=`linear-gradient(rgba(20, 19, 18, 0.995),rgba(20, 19, 18, 0.995)) , url('/paper-texture.jpg')`;
    }
    return {
    root: {
      
    },
    paper: { 
        backgroundImage: bgImg,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundColor:'inherit !important',
        outline: '1px solid black',
        boxShadow: (theme.palette.type=='dark') ? `1px 1px 10px 5px inset rgba(0,0,0,0.4), 0px 0px 35px 10px rgba(0,0,0,0.3)` : '',
        
    }
  };});
const SmartNFTPortal = (props) => { 
    const {children, smartImports, metadata, style, loading, random} = props;
    const classes=useStyles();
    const iFrameRef = useRef();
    let src='';
    let librariesHTML ='';
    //console.log(metadata);
    
    useEffect(() => {
        window.addEventListener("message", onMessage);
        return () => { 
            window.removeEventListener("message", onMessage)
        }
      }, []);
      
    if (loading) { 
        return <CircularProgress style={{marginTop: '2em', marginLeft: 'auto', marginRight: 'auto'}} />;
    }
    const onMessage = (e) => { 
        switch (e.data.request) { 
            case 'getTokenThumb':
                return onGetTokenThumb(e);
            case 'getTokenImage': 
                return onGetTokenImage(e);
            case 'getFile':
                return onGetFile(e);
            case 'getTransactions':
                return onGetTransactions(e);
            case 'getTokens':
                return onGetTokens(e);
            case 'getUTXOs': 
                return onGetUTXOs(e);
            case 'getMetadata':
                return onGetMetadata(e);
            default:
                return;
        }
    }
    const onGetTokenThumb = (e) => { 
        const buffer = new ArrayBuffer(8);
        const uInt8View = new Uint8Array(buffer); const originalLength = uInt8View.length; for (var i = 0; i < originalLength; ++i) { uInt8View[i] = i; }
        iFrameRef.current.contentWindow.postMessage({'request':'getTokenThumb','unit':e.data.unit, buffer},'*', [buffer]);
    }
    const onGetTokenImage = (e) => { 
        const buffer = new ArrayBuffer(8);
        const uInt8View = new Uint8Array(buffer); const originalLength = uInt8View.length; for (var i = 0; i < originalLength; ++i) { uInt8View[i] = originalLength-i; }
        iFrameRef.current.contentWindow.postMessage({'request':'getTokenImage','unit':e.data.unit, buffer},'*', [buffer]);
    }
    const onGetFile = (e) => { 
        const buffer = new ArrayBuffer(8);
        const uInt8View = new Uint8Array(buffer); const originalLength = uInt8View.length; for (var i = 0; i < originalLength; ++i) { uInt8View[i] = originalLength-i; }
        iFrameRef.current.contentWindow.postMessage({'request':'getFile','id':e.data.id,'unit':e.data.unit, buffer},'*',[buffer]);
    }
    const onGetTransactions = (e) => { 
        const result = [1];
        iFrameRef.current.contentWindow.postMessage({'request':'getTransactions',which: e.data.which, page: e.data.page, result},'*');
    }
    const onGetTokens = (e) => { 
        const result=[2];
        iFrameRef.current.contentWindow.postMessage({'request':'getTokens', which: e.data.which, page: e.data.page, result },'*')
    }
    const onGetUTXOs = (e) => { 
        const result=[3];
        iFrameRef.current.contentWindow.postMessage({'request':'getUTXOs',which: e.data.which, page: e.data.page, result}, '*')
    }
    const onGetMetadata = (e) => { 
        const result=[4];
        iFrameRef.current.contentWindow.postMessage({'request':'getMetadata',unit: e.data.unit, result},'*')
    }

    if (smartImports && smartImports.libraries && smartImports.libraries.length>0) { 
        for (var c=0; c<smartImports.libraries.length; c++) {
            librariesHTML+='<script src="'+smartImports.libraries[c]+'"></script>'
        }
    }
    librariesHTML+=getPortalAPIScripts(smartImports, metadata);
    if (metadata && metadata.files && metadata.files[0]) { 
        let blob = dataURItoString(metadata.files[0].src);
        blob = '<html data-id="'+random+'" ><head>'+librariesHTML+'</head><body style="padding: 0; margin: 0px; min-width: 100%; min-height: 100%;"}>'+blob+'</body></html>';
    
        //console.log(blob);
        src='data:text/html,'+encodeURIComponent(blob)
            //console.log(src);
    }
    return (
        <iframe ref={iFrameRef} style={style}  sandbox="allow-scripts" src={src} />
    );
}
const getPortalAPIScripts = (smartImports, metadata) => { 

    let ret="<script>\n";
    ret+="if (!window.cardano) window.cardano={};\n";
    ret+="if (!window.cardano.nft) window.cardano.nft={};\n";
    ret+="if (!window.cardano.nft._data) window.cardano.nft._data={};\n";

    ret+="window.cardano.nft._data.ownerAddr="+JSON.stringify(smartImports?.ownerAddr)+";\n";
    ret+="window.cardano.nft._data.fetchedAt="+JSON.stringify(smartImports?.fetchedAt)+";\n";
    ret+="window.cardano.nft._data.metadata="+JSON.stringify(metadata)+";\n";
    if (smartImports?.utxos) { 
        ret+='window.cardano.nft._data.utxos='+JSON.stringify(smartImports.utxos)+";\n";
    }
    if (smartImports?.tokens) { 
        ret+='window.cardano.nft._data.tokens='+JSON.stringify(smartImports.tokens)+";\n";
    }
    if (smartImports?.transactions) { 
        ret+='window.cardano.nft._data.transactions='+JSON.stringify(smartImports.transactions)+";\n";   
    }
    if (smartImports?.mintTx) { 
        ret+='window.cardano.nft._data.mintTx='+JSON.stringify(smartImports.mintTx)+";\n";
    }
    // I wanna read this from a separate .js file, but I can't work out how to have it done in the preprocessor so that there's no need for an async call in the client side
    ret+='</script>';
    ret+=`
        <script>
            window.cardano.nft.getOwner = async () => { 
                return window.cardano.nft._data.ownerAddr;
            }
            window.cardano.nft.getMintTx = async () => { 
                if (window.cardano.nft._data.mintTx) return window.cardano.nft._data.mintTx;
                console.error('Attempt to use mintTx without importing it');
            }
            // This is a shortcut so you can get this data synchronously
            window.cardano.nft.mintTx = window.cardano.nft._data.mintTx;
            window.cardano.nft.getMetadata = async (unit='own') => { 
                if (unit=='own') return window.cardano.nft._data.metadata;
                return new Promise(async (resolve, reject) => { 
                    const messageHandler = (e) => { 
                        if (e.data.request=='getMetadata' && e.data.unit==unit) { 
                            window.removeEventListener('message',messageHandler);
                            resolve(e.data.result);
                        }
                    }
                    window.addEventListener('message',messageHandler);
                    parent.postMessage({request:'getMetadata', unit},'*')
                });
            }
            // This is a shortcut to get the metadata for the current token synchronously
            window.cardano.nft.metadata = window.cardano.nft._data.metadata;
            
            window.cardano.nft.getTransactions = async (which='own', page=0) => { 
                if (which=='own') { 
                    which=window.cardano.nft._data.ownerAddr;
                }
                if (page==0) { 
                    return {transactions: window.cardano.nft._data.transactions[which], fetchedAt: window.cardano.nft._data.fetchedAt};
                } else if (window.cardano.nft._data.transactions[which]) { 
                    return new Promise(async (resolve, reject) => { 
                        const messageHandler = (e) => { 
                            if (e.data.request=='getTransactions' && e.data.which==which && e.data.page==page) { 
                                window.removeEventListener('message',messageHandler);
                                resolve(e.data.result);
                            }
                        }
                        window.addEventListener('message',messageHandler);
                        parent.postMessage({request:'getTransactions', which, page},'*');
                    });
                } else { 
                    console.error('Attempt to access transactions that haven\\'t been imported');
                }
            }
            window.cardano.nft.getTokens = async (which='own', page=0) => { 
                if (which=='own') { 
                    which=window.cardano.nft._data.ownerAddr;
                }
                if (page==0) { 
                    return {tokens: window.cardano.nft._data.tokens[which], fetchedAt: window.cardano.nft._data.fetchedAt};
                } else if (window.cardano.nft._data.tokens[which]) { 
                    return new Promise(async (resolve, reject) => { 
                        const messageHandler = (e) => { 
                            if (e.data.request=='getTokens' && e.data.which==which && e.data.page==page) { 
                                window.removeEventListener('message',messageHandler);
                                resolve(e.data.result);
                            }
                        }
                        window.addEventListener('message',messageHandler);
                        parent.postMessage({request:'getTokens', which, page}, '*');
                    });
                } else { 
                    console.error('Attempt to access tokens that haven\\'t been imported');
                }
            }
            window.cardano.nft.getUTXOs = async (which='own', page=0) => { 
                if (which=='own') {
                    which=window.cardano.nft._data.ownerAddr;
                }
                if (page==0) { 
                    return {utxos: window.cardano.nft._data.utxos[which], fetchedAt: window.cardano.nft._data.fetchedAt};
                } else if (window.cardano.nft._data.utxos[which]) { 
                    return new Promise(async (resolve, reject) => { 
                        const messageHandler = (e) => { 
                            if (e.data.request=='getUTXOs' && e.data.which==which && e.data.page==page) { 
                                window.removeEventListener('message', messageHandler);
                                resolve(e.data.result);
                            }
                        }
                        window.addEventListener('message',messageHandler);
                        parent.postMessage({request:'getUTXOs', which, page}, '*');
                    });
                } else { 
                    console.error('Attempt to access UTXOs that haven\\'t been imported');
                }
            }

            
            window.cardano.nft.getTokenThumb = async (unit) => {
                return new Promise(async (resolve,reject) => { 
                    const messageHandler = (e) => { 
                        if (e.data.request=='getTokenThumb' && e.data.unit == unit) {
                            window.removeEventListener('message',messageHandler);
                            resolve(e.data.buffer);
                        }
                    }
                    window.addEventListener('message',messageHandler);
                    parent.postMessage({request:'getTokenThumb',unit},'*');
                });
            }
            window.cardano.nft.getTokenImage = async (unit) => { 
                return new Promise(async (resolve, reject) => { 
                    const messageHandler = (e) => { 
                        if (e.data.request=='getTokenImage' && e.data.unit == unit) { 
                            window.removeEventListener('message',messageHandler);
                            resolve(e.data.buffer);
                        }
                    }
                    window.addEventListener('message',messageHandler);
                    parent.postMessage({request:'getTokenImage',unit},'*')
                });
            }
            window.cardano.nft.getFile = async (id=null, unit=null) => { 
                return new Promise(async (resolve, reject) => { 
                    const messageHandler = (e) => { 
                        if (e.data.request=='getFile' && e.data.id == id && e.data.unit == unit) { 
                            window.removeEventListener('message',messageHandler);
                            resolve(e.data.buffer);
                        }
                    }
                    window.addEventListener('message',messageHandler);
                    parent.postMessage({request:'getFile',id,unit},'*');
                });
            }

            
        </script>
    `;
    return ret;
}


SmartNFTPortal.propTypes = {
    style: PropTypes.object,
    random: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    smartImports: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired
  };
export default SmartNFTPortal;
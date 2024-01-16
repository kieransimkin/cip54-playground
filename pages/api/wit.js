
import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import { Buffer } from 'buffer';
import cbor from "cbor";

export default async function Browse(req, res) {
  
    const body = req.body;
    // Todo - verify the transaction we're witnessing is the one we expect
    // Prepare minting policy:
    const policyPrivateKey = CardanoWasm.PrivateKey.from_normal_bytes(cbor.decodeFirstSync(process.env.POLICY_KEY));
    const policyPubKey = policyPrivateKey.to_public();
    const policyAddr = CardanoWasm.BaseAddress.new(
        CardanoWasm.NetworkInfo.mainnet().network_id(),
        CardanoWasm.StakeCredential.from_keyhash(policyPubKey.hash()),
        CardanoWasm.StakeCredential.from_keyhash(policyPubKey.hash())
    ).to_address();
    const policyKeyHash = CardanoWasm.BaseAddress.from_address(policyAddr).payment_cred().to_keyhash();
    const mintScript = CardanoWasm.NativeScript.new_script_pubkey(CardanoWasm.ScriptPubkey.new(policyKeyHash)); 

    // Load tx body from database        
    const txBody = CardanoWasm.TransactionBody.from_bytes(Buffer.from(record.data.txBody, "hex"));
    const txHash = CardanoWasm.hash_transaction(txBody);

    // Load witness set from client wallet
    const witnessSet = CardanoWasm.TransactionWitnessSet.from_bytes(Buffer.from(req.body.wit, "hex"));
    const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();
    // Add policy key
    vkeyWitnesses.add(CardanoWasm.make_vkey_witness(txHash, policyPrivateKey));
    // Add keys from client wallet:
    var vk = witnessSet.vkeys();
    for (var c=0; c<vk.len(); c++) { 
        vkeyWitnesses.add(vk.get(c));
    }
    // Set new witnesses
    witnessSet.set_vkeys(vkeyWitnesses);
    // Set policy script
    witnessSet.set_native_scripts;
    const witnessScripts = CardanoWasm.NativeScripts.new();
    witnessScripts.add(mintScript);
    witnessSet.set_native_scripts(witnessScripts);

    
    const signedTx = CardanoWasm.Transaction.new(
      txBody,
      witnessSet,
      CardanoWasm.AuxiliaryData.from_bytes(Buffer.from(record.data.aux, "hex"))
    );

    res.status(200).json(signedTx.to_hex());
  //res.status(200).json(Object.keys(req.query));
}

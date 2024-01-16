
import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import { Buffer } from 'buffer';
import cbor from "cbor";
import { ucfirst } from '../../utils/Helpers';

export default async function Browse(req, res) {
  
    const body = req.body;

  
    const assetName = `${ucfirst(body.spec.name)}`.substring(0,32);

    // Setup network parameters
    const linearFee = CardanoWasm.LinearFee.new(
        CardanoWasm.BigNum.from_str('44'),
        CardanoWasm.BigNum.from_str('155381')
    );
    const txBuilderCfg = CardanoWasm.TransactionBuilderConfigBuilder.new()
        .fee_algo(linearFee)
        .pool_deposit(CardanoWasm.BigNum.from_str('500000000'))
        .key_deposit(CardanoWasm.BigNum.from_str('2000000'))
        .max_value_size(5000)
        .max_tx_size(16384)
        .coins_per_utxo_word(CardanoWasm.BigNum.from_str('34482')) // 34482
        .build();
    const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderCfg);


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
    const policyId = Buffer.from(mintScript.hash().to_bytes()).toString("hex");


    // Return and payment addresses
    const shelleyOutputAddress = CardanoWasm.Address.from_bech32("addr1qy5wfftgqs6c0mtcqtdle9mc54293j9juv7k2e2phvgjy05f7mwd3ll67jr7hs39dmdf4awgtr8ht2cp5cvqxgg2kxhqx85xh2");
    const returnAddress = CardanoWasm.Address.from_bytes(Buffer.from(body.changeAddress, "hex"));


    // Add the payment output
    txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(
            shelleyOutputAddress,
            CardanoWasm.Value.new(CardanoWasm.BigNum.from_str('10000000'))    
        ),
    );
    
    // Add the mint output
    txBuilder.add_mint_asset_and_output_min_required_coin(
        mintScript,
        CardanoWasm.AssetName.new(Buffer.from(assetName)),
        CardanoWasm.Int.new_i32(1),
        CardanoWasm.TransactionOutputBuilder.new().with_address(returnAddress).next()
    );
    
    // Add metadata
    const metadata = {
        [policyId]: {
          [assetName]: {
            name: `${ucfirst(body.spec.name)}`,
            description: 'Initial Test',
            image: ["data:image/svg+xml;charset=UTF-8,%3csvg viewBox='0 0 22 41' wid",
                    "th='22' height='41' xmlns='http://www.w3.org/2000/svg'%3e%3cpat",
                    "h d='M11 41 c-2-20-10-22-10-30 a10 10 0 1 1 20 0c0 8-8 10-10 30",
                    "z' fill='tomato' stroke='%23000' stroke-width='1.5'/%3e%3ccircl",
                    "e cx='11' cy='11' r='3'/%3e%3c/svg%3e"],
            mediaType: 'image/svg',
          },
        },
    };
    txBuilder.add_json_metadatum(
        CardanoWasm.BigNum.from_str("721"),
        JSON.stringify(metadata)
    );


    // Add UTXOs from wallet
    const utxos = CardanoWasm.TransactionUnspentOutputs.new();
    for (var c=0; c<body.utxos.length; c++) { 
        utxos.add(CardanoWasm.TransactionUnspentOutput.from_hex(body.utxos[c]));
    }
    
    txBuilder.add_inputs_from(utxos, CardanoWasm.CoinSelectionStrategyCIP2.LargestFirstMultiAsset);



    // Add change and fees
    txBuilder.add_change_if_needed(returnAddress);

    // Build transaction
    let txBody, txHash, witnesses, unsignedTx, tx;
    try { 
    txBody = txBuilder.build();
    txHash = CardanoWasm.hash_transaction(txBody);

    // Empty witness set
     witnesses = CardanoWasm.TransactionWitnessSet.new();


    unsignedTx = txBuilder.build_tx();
    tx = CardanoWasm.Transaction.new(
      unsignedTx.body(),
      witnesses,
      unsignedTx.auxiliary_data()
    );
    } catch (e) { 
        return res.status(400).json({message:e});
    }
    res.status(200).json({tx: tx.to_hex(), body: body, txBody: tx.body().to_hex(), aux: tx.auxiliary_data().to_hex()});
  //res.status(200).json(Object.keys(req.query));
}

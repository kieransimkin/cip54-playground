## Smart NFT Playground

This is the source code for the [Smart NFT Playground](https://nft-playground.dev/) (a standard Next.js app) - for more information on Smart NFTs, CIP54 and this repository, please see the website, or [read the Cardano Improvement Proposal](https://cips.cardano.org/cips/cip54/).

You may also be interested in the first NFT collection to mint using this new standard, called [Smart Life](https://plutus.art/collection/smartlife).

This app provides both front end and backend necessary for the Playground, and uses both the [SmartNFTPortal React component](https://github.com/kieransimkin/smartnftportal) in the front end, as well as [libcip54](https://github.com/kieransimkin/libcip54) in the back end to do the blockchain queries. 

You will need a [DBSync](https://github.com/input-output-hk/cardano-db-sync) chain indexer for the libcip54 queries. The Playground also uses [nftcdn.io](https://nftcdn.io) for thumbnail image generation, so you will need a key for that as well if you want to run the playground locally. Generally it's easier to just use the playground online at the URL above. 

Probably the most interesting part of the Playground, if you're looking to implement a CIP54 renderer in your own website, is the [API folder](https://github.com/kieransimkin/cip54-playground/tree/main/pages/api). This gives you everything you need to use libcip54 to provide the backend API functions needed for the SmartNFTPortal - you should be able to directly copy the API from here into your own backend. Also of interest is the [`<Playground>`](https://github.com/kieransimkin/cip54-playground/blob/main/components/Playground.js) component, which is what builds the multi-pane environment with the `<SmartNFTPortal>` renderer within it. 

### Running

```bash
$ yarn run dev
or
$ npm run dev
```

An example config file can be found in [`.env.example`](https://github.com/kieransimkin/cip54-playground/blob/main/.env.example)

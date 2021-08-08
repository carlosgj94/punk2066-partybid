import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import punkImage from '../public/punk2066.png'

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import PartyBidPunk2066 from "../artifacts/contracts/PartyBidPunk2066.sol/PartyBidPunk2066.json";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA
    }
  }
}

export default function Home() {
  let [web3, setWeb3] = useState<any>({});
  let [account, setAccount] = useState('');
  let [chainId, setChainId] = useState(0);
  let [hasBalance, setHasBalance] = useState(false);
  let [hasMinted, setHasMinted] = useState(true);
  let [claimed, setClaimed] = useState(false);
  let [claiming, setClaiming] = useState(false);

  let web3Modal: any
  if (process.browser) {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      theme: 'dark',
      providerOptions
    });
  }

  const claimToken = async () => {
    setClaiming(true);
    let Contract = new web3.eth.Contract(PartyBidPunk2066.abi, '0x1003fCbA76b07bb978B79a71D11e957DCdD54EBD');
    await Contract.methods.mintCollectible().send({ from: account });
    setClaiming(false);
    setClaimed(true);
  }

  const connect = async () => {
    try {
      if (process.browser) {
        let provider = await web3Modal.connect();
        setWeb3(new Web3(provider));
        let web3: any = new Web3(provider);
        let chain = await web3.eth.getChainId();

        let Contract = new web3.eth.Contract(PartyBidPunk2066.abi, '0x1003fCbA76b07bb978B79a71D11e957DCdD54EBD');
        let accounts = await web3.eth.getAccounts()
        let balance = await Contract.methods.hasBalance().call({ from: accounts[0] })
        let minted = await Contract.methods.minted(accounts[0]).call({ from: accounts[0] })

        setAccount(accounts[0]);
        setChainId(chain);
        setHasBalance(balance)
        setHasMinted(minted)
      }
    } catch (err) {
      console.log('Err: ', err);
    }
  }
  const bottomButton = () => {
    if (claiming) {
      return <h5 className={styles.description}>NFT being claimed...</h5>
    } if (claimed) {
      return <h4 className={[styles.win, styles.tada].join(' ')}>Party Punk#2066 claimed!</h4>
    } else if (account === '') {
      return <button className={styles.btn} onClick={connect} >Connect Wallet </button>
    } else if (chainId !== 1) {
      return <h5 className={styles.description}> Please connect to the Ethereum Network</h5>
    } else if (!hasBalance) {
      return <h5 className={styles.description}>You must have participated in the Punk#2066 PartyBid</h5>
    } else if (hasMinted) {
      return <h5 className={styles.description}>You have already claimed</h5>
    } else {
      return <button className={styles.btn} onClick={claimToken} >Claim NFT</button>
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>PartyBid Punk#2066</title>
        <meta name="description" content="Participated in the Punk#2066 PartyBid? Claim your party punk!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.header}>
        <h1 className={styles.title}>PartyBid Punk#2066</h1>

        <a href="https://opensea.io/collection/partybid-punk2066" target="_blank" rel="noreferrer">
          <div className={styles.imageWrapper}>
            <Image src={punkImage} className={styles.hearts} alt="logo" />
          </div>
        </a>
        <h5 className={[styles.description, styles.descriptionSize].join(' ')}>
          Participated in the Punk#2066 PartyBid? Claim your party punk!
        </h5>
        {bottomButton()}
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

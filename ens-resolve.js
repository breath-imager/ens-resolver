import { ethers } from "ethers";
import 'dotenv/config'
import dotenv from 'dotenv'
import express from 'express'
import fs from "fs";

dotenv.config()
const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/" + process.env.INFURA_ID
  );

console.log(process.env.INFURA_ID)
async function resolve(ens) { 
  return await provider.resolveName(ens);
}


let rawdata = fs.readFileSync('test.json');
let addr = JSON.parse(rawdata);

let resolved, unresolved, resolvedSYNC = "";
resolved += ("[");

unresolved += ("[");

for (let a = 0; a < addr.length; a++) {
  let address = addr[a].toLowerCase();
console.log(address.search(".eth"));
  
  if (address.search(".eth")  > 0)
  { 
    await resolve(address).then( 
      response => {
        if (resolved != "null") {
              console.log(response + " resolved \n");
            resolved += ('"' + response + '",')} 
        else {
          console.log(address + " unresolved 1 \n");
          unresolved += ('"' + address + '"')  
        } 
      }
    )
  }
  else if (address.search("0x")> -1){
          console.log(address + " resolvedSYNC \n");
          resolvedSYNC += ('"' + address + '",');
        }
        else {
          console.log(address.search("0x"));
          console.log(address + " unresolved 2 \n");
          unresolved += ('"' + address + '",');
        }
}

resolved += resolvedSYNC + ("]");
unresolved += ("]");



fs.writeFile('whitelist_resolved.json', resolved, err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
})



fs.writeFile('whitelist_unesolved.json', unresolved, err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
})


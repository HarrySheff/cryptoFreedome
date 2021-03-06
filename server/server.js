
const express = require('express');
const app = express();
const fs = require('fs');
const TruffleContract = require("truffle-contract");
let rawdata = fs.readFileSync(process.cwd() + '/src/contracts/CryptoLife.json');
const wss = fs.readFileSync(process.cwd() + "/server/.wss").toString().trim();
const mnemonic = fs.readFileSync(process.cwd() + "/server/.secret").toString().trim();
let data = JSON.parse(rawdata, 'utf8');
const Web3 = require('web3');
let ws = new Web3.providers.WebsocketProvider(wss);
let web3 = new Web3(ws);
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";
const client = new MongoClient(uri);
const owner = '0xaD90d8090317BFEa17365470aD3507BB64001E63';
const myContractAddress = '0xE73E74c9d9A09b58F29E370dEe3c5648BDa8609d'; // old '0xdC3d6Cf792e562c341eA377f96B828Ea0d5A1831';


// Instance a new truffle contract from the artifact
//const cryptoLife = TruffleContract(data);
        
//Connect provider to interact with contract
//cryptoLife.setProvider(web3.currentProvider);


var instance;
var instance2;
var allEvents;
var currentBlock;
var startBlock;
var dbo;
var doubleContract;
var lastSeenBlock;
var lastLogIndex;

ws.on('close', async (code) => {
  console.log('ws closed reason:', code);
  await stop();
  setTimeout(() => { 
    ws = new Web3.providers.WebsocketProvider(wss);
    web3 = new Web3(ws);
    run();
  }, 2000);


})

app.use(express.static(process.cwd() + '/src/'));
app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).type('text/html')
  res.sendFile(process.cwd()+'/src/index.html');
});

app.get('/data', async function(req, res) {

  try {
    let membersCount = await dbo.collection('partners').count();
    let basicIncomeData = await instance2.methods.getbasicIncomeData().call({from:owner});

    let basicIncomeProgress = (basicIncomeData[0]/basicIncomeData[2])*80+12;

    res.json({members: membersCount,summ: basicIncomeData[1]/10**18, progress:basicIncomeProgress, minLevel:basicIncomeData[4]});
    console.log('Data send as JSON.');
  }
  catch (_error){
    console.warn(_error);
    await stop();
    await run();
    let membersCount = await dbo.collection('partners').count();
    let basicIncomeData = await instance2.methods.getbasicIncomeData().call({from:owner});

    let basicIncomeProgress = (basicIncomeData[0]/basicIncomeData[2])*80+12;

    res.json({members: membersCount,summ: basicIncomeData[1]/10**18, progress:basicIncomeProgress});
    console.log('Data send as JSON.');    
  }
});

run();

async function modifyEvent (_event){

  let block = await web3.eth.getBlock(_event.blockNumber);

  let mod = {
    event: _event.event,
    args: _event.returnValues,
    blockNumber: _event.blockNumber,
    logIndex:_event.logIndex, 
    timeStamp: block.timestamp*1000
  }
  if (mod.args["amount"]) mod.args["amount"] = parseFloat(web3.utils.fromWei(mod.args["amount"]));
  
  if (mod.args["mp"]) mod.args["mp"] =  parseInt(web3.utils.fromWei(mod.args["mp"],'wei'));
  if (mod.args["level"]) mod.args["level"] =  parseInt(web3.utils.fromWei(mod.args["level"],'wei'));
  if (mod.args["bonusType"]) mod.args["bonusType"] =  parseInt(web3.utils.fromWei(mod.args["bonusType"],'wei')); 
  if (mod.args["partnerID"]) mod.args["partnerID"] =  parseInt(web3.utils.fromWei(mod.args["partnerID"],'wei')); 
  if (mod.args["bonusMp"]) mod.args["bonusMp"] =  parseInt(web3.utils.fromWei(mod.args["bonusMp"],'wei')); 
  return mod;
}

async function handleEvents (event, _dbo){

  return new Promise(async function(resolve, reject){

    if (event.blockNumber > lastSeenBlock || (event.blockNumber == lastSeenBlock && event.logIndex > lastLogIndex)) {

      let eventMod = await modifyEvent(event);

      console.log('Event ', event.event, ' is catched in block ', event.blockNumber, ' with log logIndex ', event.logIndex);
        
      switch (eventMod.event){
        
        case 'registration': 
        if (eventMod.args["mp"] === 0) {

          try {

                
            result = await _dbo.collection('partners').find({_id:eventMod.args["partnerAddress"].toLowerCase()}).limit(1).toArray();

            if (result.length <1){
              await _dbo.collection('partners').insertOne({
                _id:eventMod.args["partnerAddress"].toLowerCase(),
                partnerId: eventMod.args["partnerID"]*1,
                    network:0,
                    referrals:0,
                    lastSeenBlock: event.blockNumber,
                    directIncome: 0,
                    networkIncome: 0,
                    lostProfit: 0,
                    events:[eventMod]
              })
            } 
            console.log('New Partner created');  
            resolve(true);
          } catch(_error){
            console.warn("Registration event log error: ", _error);
            reject(_error);
          };
        } else {
          
          try {

            await _dbo.collection('partners').updateOne({_id:eventMod.args["partnerAddress"].toLowerCase()}, {$push:{events:eventMod}});
            socketEmit(eventMod.args["partnerAddress"].toLowerCase(), eventMod);
            console.log('Event added to the database: activation', eventMod.args["mp"]);
            resolve(true);
          } catch (_error){
            
            console.warn("Activation event log error: ", _error);
            reject(_error);
          }
              
        }
            
        // Call new referal handling function
        if (eventMod.args["partnerAddress"] != eventMod.args["sponsorAddress"]){
        
          try {
            await _dbo.collection('partners').updateOne({_id:eventMod.args["sponsorAddress"].toLowerCase()}, {$push:{events:eventMod}});
            socketEmit(eventMod.args["sponsorAddress"].toLowerCase(), eventMod);
            console.log('Event added to the database: new referral registration');
            resolve(true);
          } catch (_error){
            console.warn("Referral registration event log error: ", _error);
            reject(_error);                
          }
              
        }
        break;
        case 'basicIncomeReadyToPay':
          if (await instance2.methods.isCommisionTransfered().call({from:owner})){
            let encoded = doubleContract.methods.basicIncomePay().encodeABI()

            var tx = {
                from: owner,
                to : myContractAddress,
                data : encoded,
                gas: await web3.eth.estimateGas({
                  from: owner,
                  to: myContractAddress,
                  data:encoded
                  })*2
            }

            web3.eth.accounts.signTransaction(tx, mnemonic)
            .then(signed => {
              web3.eth.sendSignedTransaction(signed.rawTransaction)
              .on('receipt', async ()=>{
                console.log('Basic Income summ',eventMod.args["amount"],'payed to', eventMod.args["receivers"]);
                resolve(true);
              })
            })
          } else {
            console.log('Basic Income payment logged: summ',eventMod.args["amount"],'payed to', eventMod.args["receivers"]);
            resolve(true);            
          }



        /*
          await instance.basicIncomePay({from:'0x3EA9278376634f0197F3fc90Bf75f63065C6c82E'})
          .then(()=>{
            console.log('Basic Income summ',event.args["amount"],'payed to', event.args["receivers"]);
            resolve(true);
          })
          .catch((_error)=>{
            console.warn("Event log error: ", _error);
            reject(_error);
          });


          */
        break;

        default:
          try {
            await _dbo.collection('partners').updateOne({_id:eventMod.args["partnerAddress"].toLowerCase()}, {$push:{events:eventMod}});
            socketEmit(eventMod.args["partnerAddress"].toLowerCase(), eventMod);
            console.log('Event added to the database', eventMod.event);
            resolve(true);
          } catch (_error){
            console.warn("Event log error: ", _error);
            reject(_error);
          }
        break;
      } 

      try {
        console.log('Udating lastSeenBlock of the server');
        lastSeenBlock = event.blockNumber;
        lastLogIndex = event.logIndex;
        await dbo.collection('server').updateOne({_id:0},{$set:{lastSeenBlock:lastSeenBlock, lastLogIndex:lastLogIndex}});
        console.log('Server\'s lastSeenBlock was updated');
      } catch (_error){

        console.log(_error);
      } 
    } else {
      resolve (true);
    }
  });

}

function socketEmit(_acc, _event){

  // Loop online users
  for (let [id, socket] of io.of("/").sockets) {

    // Check or online
    if (_acc == socket.account) {

      // User online 

      // Send the event to it
      socket.emit('event', _event);
      break;
    }        
  }  
}

async function run() {

  try {
    web3 = new Web3(new Web3.providers.WebsocketProvider(wss));
    doubleContract = new web3.eth.Contract(data.abi, myContractAddress, {from: owner});
    // Connect the client to the server
    dbo = await client.connect();
    dbo = dbo.db("cryptoLife");
    console.log("--- Connected to the database ---");
    instance2 = await doubleContract.deploy({data:data.bytecode})._parent;
    console.log("--- instance2 deployed ---");
    //instance = await cryptoLife.deployed();
    //console.log("--- instance deployed ---");
    console.log("--- Get block number ---");
    currentBlock = await web3.eth.getBlockNumber();
    console.log("--- Current block setted ---");
    let partner = await instance2.methods.getMyData().call({from:owner});
    startBlock = partner[5]*1;

      console.log("--- Initiating Contract ---");
      // Set starting block number
      let blockToRead;
      try {
        result = await dbo.collection('server').find({_id:0}).limit(1).toArray();
        lastSeenBlock = result[0].lastSeenBlock;
        lastLogIndex = result[0].lastLogIndex;
        blockToRead = lastSeenBlock;
      } catch (_error){

        console.log(_error);
        blockToRead = startBlock ;
        lastSeenBlock = startBlock;
        lastLogIndex = -1;
      }


      result = await dbo.collection('partners').find({_id:owner.toLowerCase()}).limit(1).toArray();

      if (result.length <1) {
        blockToRead = startBlock ;
        lastSeenBlock = startBlock;
        lastLogIndex = -1;
      }
      console.log('Start reading blockchain logs');
      // Loop until the range of the last blocks is reduced to 5000 or all new messages is in the list and list size above the limit
      while (blockToRead + 5000 < currentBlock){

        console.log( "Left to read: ", parseInt((currentBlock-blockToRead)/5000)+1);

        // Listern events in the current range
        all = await instance2.getPastEvents('allEvents',{fromBlock:blockToRead, toBlock:blockToRead+5000});
        
        for (event of all) await handleEvents(event, dbo);

        // Decrease start block number
        blockToRead+=5000;


        try {
          console.log('Udating lastSeenBlock of the server');
          lastSeenBlock = blockToRead;
          lastLogIndex = -1;
          await dbo.collection('server').updateOne({_id:0},{$set:{lastSeenBlock:lastSeenBlock, lastLogIndex:lastLogIndex}});
          console.log('Server\'s lastSeenBlock was updated');
        } catch (_error){

          console.log(_error);
        } 
      }
        
      console.log( "Left to read: ",1);
      // Listern events in the current range
      all = await instance2.getPastEvents('allEvents',{fromBlock:blockToRead, toBlock:currentBlock});
      for (event of all) await handleEvents(event, dbo);
      console.log('Blockchain logs read');

      try {
        console.log('Udating lastSeenBlock of the server');
        lastSeenBlock = currentBlock;
        lastLogIndex = -1;        
        await dbo.collection('server').updateOne({_id:0},{$set:{lastSeenBlock:lastSeenBlock, lastLogIndex:lastLogIndex}});
        console.log('Server\'s lastSeenBlock was updated');
      } catch (_error){

        console.log(_error);
      } 
      console.log('--- Contract initiated ---');

      console.log ('--- Watch for events ---');
      
      all = await instance2.events.allEvents({fromBlock:'latest'});
      all.on('data', function (_event){

        handleEvents(_event, dbo);
      });

      console.log('--- Running sokets ---');

      io.on('connection', async function(socket)  {
          
        const username = socket.handshake.auth.account;

        socket.account = username;
          
        result = await dbo.collection('partners').findOne({_id:socket.account});

        if (result != null){ 
      
          socket.on('setReferrals', async function ( _referrals){

            console.log('Udating refferals of the account',socket.account);

            await dbo.collection('partners').updateOne({_id:socket.account},{$set: {referrals:_referrals}});
            console.log("The referrals parameter of the account ", socket.account, " updated to - ", _referrals,'.');
          });

          socket.on('setNetwork', async function (_network){

            console.log('Udating network of the account ',socket.account);    
             await dbo.collection('partners').updateOne({_id:socket.account},{$set: {network:_network}});
            console.log("The network parameter of the account ", socket.account, " updated to - ", _network,'.');
          });

          socket.on('setLastSeenBlock', async function (_lastSeenBlock){

            console.log('Udating lastSeenBlock of the account ',socket.account);
            await dbo.collection('partners').updateOne({_id:socket.account},{$set: {lastSeenBlock:_lastSeenBlock}});
            console.log("The lastSeenBlock parameter of the account ", socket.account, " updated to - ", _lastSeenBlock,'.');  });

          socket.on('setDirectIncome', async function (_directIncome){
            console.log('Udating directIncome of the account ',socket.account);
            await dbo.collection('partners').updateOne({_id:socket.account},{$set: {directIncome:_directIncome}});
            console.log("The directIncome parameter of the account ", socket.account, " updated to - ", _directIncome,'.');
          });

          socket.on('setNetworkIncome', async function (_networkIncome){
            console.log('Udating networkIncome of the account',socket.account);
            await dbo.collection('partners').updateOne({_id:socket.account},{$set: {networkIncome:_networkIncome}});
            console.log("The networkIncome parameter of the account ", socket.account, " updated to - ", _networkIncome,'.');
          });

          socket.on('setLostProfit', async function ( _lostProfit){

            console.log('Udating lostProfit of the account ',socket.account);
            await dbo.collection('partners').updateOne({_id:socket.account},{$set: {lostProfit:_lostProfit}});
            console.log("The lostProfit parameter of the account ", socket.account, " updated to - ", _lostProfit,'.');

          });

          console.log(socket.account, ' connected.');
          socket.emit('setAccountData', {
            network: result.network,
            referrals: result.referrals,
            lastSeenBlock: result.lastSeenBlock,
            directIncome: result.directIncome,
            networkIncome: result.networkIncome,
            lostProfit: result.lostProfit,
            events: result.events,
            chats: result.chats
          });

          console.log('The data sent to the account ', socket.account);

          // Send a list of users to the connected user
          let users = [];
          for (let [id, socket] of io.of("/").sockets) {
            users.push({
              userID: id,
              account: socket.account,
            });
          }
          socket.emit("users", users);

          // notify existing users
          socket.broadcast.emit("user connected", {
            userID: socket.id,
            username: socket.account,
          });

          socket.on("private message", ({ _content, _to }) => {
            socket.to(_to).emit("private message", {
              _content,
              from: socket.id,
            });
          });
        }  
      });

      console.log('--- Sokets is running ---')  


      server.listen(3000, () => {
        console.log('--- Http is listening on *:3000 ---');
      });
  } catch (_error){
    console.warn(_error);
    await stop();
    //run();
  }
}

async function stop(){


  if (client) await client.close();
  console.log('--- The dabase connection close ---');
  //if (instance2) await instance2.stopWatching();
  //console.log('--- Blockchain wathing stoped ---');
  if (server) await server.close();
  console.log('--- Http listening stoped ---');


}


# whisper_demo

Run Geth:
`geth --shh --testnet --syncmode="light" --nodiscover console`

Add peer:
`admin.addPeer("enode://d25474361659861e9e651bc728a17e807a3359ca0d344afd544ed0f11a31faecaf4d74b55db53c6670fd624f08d5c79adfc8da5dd4a11b9213db49a3b750845e@52.178.209.125:30379")`

Potential bootnodes:
`enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303`


Or use wnode:

"You can use the -standalone option, then your wnode will be the bootnode. Then, use the dispalyed enode:// address as the -bootnodesv5 option to all other nodes."

bootnode:
`wnode --standalone -ip=127.0.0.1:30379 -idfile=<...>/whisper_demo/keystore/wnode.txt`

secondary node"
`wnode -boot=enode://a472e0a67a081ed50303226f673a3f57d0fb6e6020db1b1ff64e19953d80a3b1fb63cf11fb78b8ea89113da93ced37e017ff5691975a271c331b62efd48b5b84@127.0.0.1:30379`


Run the server:
`npm run devstart`


We could also use telehash.
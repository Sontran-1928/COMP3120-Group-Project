const az_identity = require('@azure/identity');
const az_kv = require('@azure/keyvault-secrets');

const credential = new az_identity.DefaultAzureCredential();
const client = new az_kv.SecretClient('https://newsecretvault.vault.azure.net/', credential)

client.getSecret('APIKEY').then(res =>{
    console.log(res);
}).catch(err => {
    console.log("error occurred, ", err)
});
const request1 = { headers: {}}
const request2 = { headers: { "x-real-ip": "127.0.0.1" }}
const request3 = { headers: { "x-real-ip": ["192.168.0.1", "127.0.0.1"] }}

function getIp(request){
  // your code...
}

console.log(getIp(request1)); // output: "not_auth"
console.log(getIp(request2)); // output: "127.0.0.1"
console.log(getIp(request3)); // output: "192.168.0.1"

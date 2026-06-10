let users = [];
let selected = 0;
let stability = 100;

/* INIT */
function init(){
const saved = localStorage.getItem("echo_save");

if(saved){
users = JSON.parse(saved);
} else {
users = [
{name:"User_88",bias:80,post:"THE SKY IS NOT REAL.",state:"active"},
{name:"Nostalgia_Bot",bias:70,post:"PAST WAS PERFECT LOOP.",state:"active"},
{name:"Quantum_Parrot",bias:90,post:"TIME IS COLLAPSING.",state:"active"},
{name:"GhostNode",bias:60,post:"NETWORK DREAMING.",state:"active"}
];
}

render();
log("SYSTEM BOOTED");
}

/* SAVE */
function save(){
localStorage.setItem("echo_save", JSON.stringify(users));
}

/* RENDER */
function render(){
renderUsers();
renderFeed();
updateStatus();
save();
}

/* USERS */
function renderUsers(){
const el = document.getElementById("users");
el.innerHTML = "";

users.forEach((u,i)=>{

let cls = u.state;

el.innerHTML += `
<div class="user ${cls} ${i===selected?'active':''}" onclick="selected=${i};render()">
<b>${u.name}</b><br>
Bias: ${Math.max(0,Math.min(100,u.bias))}%<br>
<small>${u.state.toUpperCase()}</small>
</div>
`;
});
}

/* FEED */
function renderFeed(){
const el = document.getElementById("feed");
el.innerHTML = "";

users.forEach(u=>{
el.innerHTML += `
<div class="post">
<div class="postUser">${u.name}</div>
<div>${u.post}</div>
</div>
`;
});
}

/* STATUS */
function updateStatus(){
const el = document.getElementById("status");

if(stability < 40){
el.textContent = "SYSTEM UNSTABLE";
el.style.color = "red";
} else {
el.textContent = "SYSTEM STABLE";
el.style.color = "lime";
}
}

/* LOG */
function log(msg){
const el = document.getElementById("log");
const div = document.createElement("div");
div.textContent = "[SYS] " + msg;
el.prepend(div);
}

/* SOUND */
function beep(freq){
try{
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.frequency.value = freq;
gain.gain.value = 0.05;

osc.connect(gain);
gain.connect(ctx.destination);

osc.start();
osc.stop(ctx.currentTime + 0.1);
}catch(e){}
}

/* ACTIONS */
function injectFactCheck(){
let u = users[selected];
if(u.state !== "active") return;

let d = rand(10,20);
u.bias -= d;
stability += 2;

log(`${u.name} questioned reality (-${d}%)`);
beep(600);

checkState(u);
render();
}

function algorithmBoost(){
let u = users[selected];
if(u.state !== "active") return;

let i = rand(10,25);
u.bias += i;
stability -= 5;

log(`${u.name} boosted (+${i}%)`);
beep(200);

checkState(u);
render();
}

function filterNoise(){
let u = users[selected];
if(u.state !== "active") return;

let d = rand(5,15);
u.bias -= d;

log(`Noise filtered (-${d}%)`);
beep(400);

checkState(u);
render();
}

/* STATE MACHINE */
function checkState(u){

if(u.bias <= 0){
u.state = "archived";
u.bias = 0;
log(`${u.name} ARCHIVED`);
}

if(u.bias >= 100){
u.state = "locked";
u.bias = 100;
stability -= 20;
glitch();
log(`${u.name} CORRUPTED`);
}
}

/* GLITCH EFFECT */
function glitch(){
document.body.classList.add("glitch");
setTimeout(()=>document.body.classList.remove("glitch"),500);
}

/* RANDOM DRIFT SYSTEM */
setInterval(()=>{
users.forEach(u=>{
if(u.state==="active"){
u.bias += rand(-3,4);
u.bias = Math.max(0,Math.min(100,u.bias));
}
});

stability -= 1;

render();
checkWinLose();

},2500);

/* WIN / LOSE */
function checkWinLose(){

let allArchived = users.every(u=>u.state==="archived");
let allLocked = users.every(u=>u.state==="locked");

if(allArchived){
log("MISSION COMPLETE: ALL USERS ARCHIVED");
document.getElementById("status").textContent = "SIMULATION CLEARED";
}

if(allLocked){
log("FAILURE: SYSTEM CORRUPTED");
document.getElementById("status").textContent = "SYSTEM FAILURE";
glitch();
}
}

/* RESET */
function resetGame(){
localStorage.removeItem("echo_save");
location.reload();
}

/* UTIL */
function rand(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

init();
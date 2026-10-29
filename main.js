(function(){
var tb=document.getElementById("rows");
if(tb){
var data=[["US-LCR-01","Northwind Telecom","Vendor A",96],["US-PREM-02","Harbor Voice","Vendor B",91],["CA-STD-01","Brightline","Vendor C",88],["MX-STD-03","Ridgeway Comms","Vendor D",93],["UK-STD-01","Aster Networks","Vendor E",84]];
var draw=function(){tb.innerHTML=data.map(function(r){var w=r[3]<88;return '<tr><td><span class="st'+(w?' w':'')+'"></span>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td class="n">'+r[3]+'%</td></tr>'}).join("")};
draw();
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){setInterval(function(){var i=Math.floor(Math.random()*data.length);var v=data[i][3]+Math.round(Math.random()*4-2);data[i][3]=Math.max(78,Math.min(98,v));draw()},2200)}
}
var cf=document.getElementById("cf");
if(cf&&/[?&]sent=1/.test(location.search)){var fm0=document.getElementById("fm");if(fm0)fm0.textContent="Thank you. We received your request and will reply soon."}
if(cf){cf.addEventListener("submit",function(e){e.preventDefault();var m=document.getElementById("fm"),f=cf.elements,b=cf.querySelector("button");
if(!f.name.value.trim()||!/^\S+@\S+\.\S+$/.test(f.email.value)){m.textContent="Enter your name and a valid email so we can reply.";return}
if(f.website.value){m.textContent="Thank you. We received your request and will reply soon.";cf.reset();return}
b.disabled=true;m.textContent="Sending...";
var fd=new FormData(cf);fd.delete("website");fd.set("replyto",f.email.value);fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Accept":"application/json"},body:fd}).then(function(r){return r.text().then(function(t){try{return JSON.parse(t)}catch(x){return {ok:false,error:"Server error (HTTP "+r.status+")."}}})}).then(function(d){
if(d&&(d.ok||d.success)){m.textContent="Thank you. We received your request and will reply soon.";cf.reset()}
else{m.textContent=((d&&(d.error||d.message))||"We could not send your request.")+" You can also email sales@celvesta.com."}
}).catch(function(){
/* fallback: classic form post, works when the browser or network blocks the background request */
m.textContent="Sending...";var r=document.createElement("input");r.type="hidden";r.name="redirect";r.value=location.origin+"/contact?sent=1";cf.appendChild(r);
var w=f.website;if(w&&w.parentNode)w.parentNode.removeChild(w);
cf.method="POST";cf.action="https://api.web3forms.com/submit";HTMLFormElement.prototype.submit.call(cf);return "fallback"}).then(function(){b.disabled=false})})}
var mb=document.querySelector(".menu-btn"),hd=document.querySelector("header");
if(mb&&hd){
var closeMenu=function(){hd.classList.remove("open");mb.setAttribute("aria-expanded","false")};
mb.addEventListener("click",function(){var o=hd.classList.toggle("open");mb.setAttribute("aria-expanded",o?"true":"false")});
document.querySelectorAll(".nav ul a").forEach(function(a){a.addEventListener("click",closeMenu)});
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu()});
}
var bill=document.querySelector(".bill"),plans=document.getElementById("plans");
if(bill&&plans){bill.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
var y=b.getAttribute("data-bill")==="y";plans.classList.toggle("yearly",y);
bill.querySelectorAll("button").forEach(function(x){var on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on?"true":"false")})})}
var y=document.getElementById("yr");if(y)y.textContent=new Date().getFullYear();
})();

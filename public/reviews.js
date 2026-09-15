(function(){
'use strict';
if(document.getElementById('yr-reviews'))return;

var css=document.createElement('style');
css.textContent=[
'#yr-reviews{padding:60px 20px;max-width:920px;margin:0 auto}',
'#yr-reviews h2{font-family:Georgia,serif;font-size:2rem;color:#e3c477;text-align:center;margin-bottom:8px}',
'#yr-reviews .live{display:inline-flex;align-items:center;gap:5px;font-size:.62rem;color:#4fb37a;letter-spacing:.15em;text-transform:uppercase;vertical-align:middle;margin-left:10px;font-family:-apple-system,sans-serif}',
'#yr-reviews .live::before{content:"";width:7px;height:7px;border-radius:50%;background:#4fb37a;animation:yrP 1.5s ease-in-out infinite}',
'@keyframes yrP{0%,100%{opacity:1}50%{opacity:.25}}',
'#yr-reviews .sub{color:#8d8a82;text-align:center;margin-bottom:32px}',
'#yr-reviews .list{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-bottom:32px}',
'#yr-reviews .card{background:#141418;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px}',
'#yr-reviews .card.new{animation:yrIn .6s cubic-bezier(.22,1,.36,1)}',
'@keyframes yrIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}',
'#yr-reviews .head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:10px}',
'#yr-reviews .name{font-family:Georgia,serif;font-size:1.05rem;color:#f5f3ee;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'#yr-reviews .stars{color:#c9a24a;letter-spacing:2px;font-size:.9rem;flex-shrink:0}',
'#yr-reviews .text{color:#b8b5ad;font-size:.9rem;line-height:1.55}',
'#yr-reviews .date{font-size:.72rem;color:#7d7a73;margin-top:8px}',
'#yr-reviews .form{background:#141418;border:1px solid rgba(201,162,74,.25);border-radius:16px;padding:24px;max-width:560px;margin:0 auto}',
'#yr-reviews .form h3{font-family:Georgia,serif;color:#e3c477;font-size:1.25rem;margin-bottom:16px}',
'#yr-reviews input,#yr-reviews textarea{width:100%;padding:12px;background:#17171b;border:1px solid rgba(255,255,255,.14);border-radius:10px;color:#fff;font-size:.95rem;margin-bottom:12px;font-family:inherit;resize:vertical}',
'#yr-reviews input:focus,#yr-reviews textarea:focus{outline:none;border-color:#c9a24a;box-shadow:0 0 0 3px rgba(201,162,74,.14)}',
'#yr-reviews .star-row{display:flex;gap:6px;margin-bottom:14px}',
'#yr-reviews .star{font-size:1.9rem;color:#3a3a3f;cursor:pointer;transition:color .15s,transform .15s;user-select:none;line-height:1}',
'#yr-reviews .star:hover{transform:scale(1.15)}',
'#yr-reviews .star.on{color:#c9a24a}',
'#yr-reviews .btn{width:100%;padding:14px;background:linear-gradient(135deg,#e3c477,#c9a24a);border:none;color:#0a0a0c;border-radius:99px;font-size:.95rem;font-weight:600;cursor:pointer;transition:transform .2s}',
'#yr-reviews .btn:hover:not(:disabled){transform:translateY(-1px)}',
'#yr-reviews .btn:disabled{opacity:.5;cursor:wait}',
'#yr-reviews .empty{text-align:center;padding:30px;color:#7d7a73;grid-column:1/-1}'
].join('');
document.head.appendChild(css);

var rating=5,reviews=[],seen={};
var sec=document.createElement('section');
sec.id='yr-reviews';
sec.innerHTML='<h2>Guest Reviews <span class="live">Live</span></h2>'+
'<p class="sub" id="yrSub">Loading reviews...</p>'+
'<div class="list" id="yrList"></div>'+
'<form class="form" id="yrForm" novalidate>'+
'<h3>Leave a review</h3>'+
'<input id="yrName" placeholder="Your name" maxlength="40" autocomplete="name">'+
'<div class="star-row" id="yrStars"></div>'+
'<textarea id="yrText" rows="3" placeholder="How was your meal?" maxlength="500"></textarea>'+
'<button class="btn" type="submit" id="yrBtn">Post review</button>'+
'</form>';

var footer=document.querySelector('footer');
if(footer&&footer.parentNode){footer.parentNode.insertBefore(sec,footer)}
else{document.body.appendChild(sec)}

var starRow=document.getElementById('yrStars');
function renderStars(){
  var h='';
  for(var i=1;i<=5;i++)h+='<span class="star'+(i<=rating?' on':'')+'" data-v="'+i+'">★</span>';
  starRow.innerHTML=h;
}
renderStars();
starRow.addEventListener('click',function(e){
  var s=e.target.closest('.star');
  if(!s)return;
  rating=+s.dataset.v;
  renderStars();
});

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fmt(iso){var d=new Date(iso);if(isNaN(d))return '';return d.toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})}

function card(r,isNew){
  var stars='★'.repeat(r.rating)+'☆'.repeat(5-r.rating);
  return '<div class="card'+(isNew?' new':'')+'">'+
  '<div class="head"><span class="name">'+esc(r.name)+'</span><span class="stars">'+stars+'</span></div>'+
  '<div class="text">'+esc(r.text)+'</div>'+
  '<div class="date">'+fmt(r.date)+'</div></div>';
}

function paint(newIds){
  var list=document.getElementById('yrList');
  var sub=document.getElementById('yrSub');
  if(!reviews.length){
    list.innerHTML='<div class="empty">No reviews yet — be the first!</div>';
    sub.textContent='Be the first to leave a review.';
    return;
  }
  var avg=reviews.reduce(function(s,r){return s+r.rating},0)/reviews.length;
  sub.textContent='Rated '+avg.toFixed(1)+' / 5 from '+reviews.length+' review'+(reviews.length===1?'':'s');
  list.innerHTML=reviews.slice(0,12).map(function(r){return card(r,newIds&&newIds[r.id])}).join('');
}

function fetchReviews(){
  fetch('/api/reviews').then(function(r){return r.json()}).then(function(d){
    var list=d.reviews||[];
    var prevIds={};
    reviews.forEach(function(r){prevIds[r.id]=1});
    var newIds={},hasNew=false;
    list.forEach(function(r){if(!prevIds[r.id]){newIds[r.id]=1;hasNew=true}});
    var changed=hasNew||list.length!==reviews.length;
    reviews=list;
    if(changed)paint(hasNew?newIds:null);
  }).catch(function(){});
}

document.getElementById('yrForm').addEventListener('submit',function(e){
  e.preventDefault();
  var name=document.getElementById('yrName').value.trim();
  var text=document.getElementById('yrText').value.trim();
  var btn=document.getElementById('yrBtn');
  if(name.length<2){alert('Please enter your name');return}
  if(text.length<5){alert('Please write a longer review');return}
  btn.disabled=true;btn.textContent='Posting...';
  fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,text:text,rating:rating})})
    .then(function(r){return r.json()})
    .then(function(d){
      if(!d.ok){alert(d.error||'Failed to post');return}
      document.getElementById('yrName').value='';
      document.getElementById('yrText').value='';
      rating=5;renderStars();
      if(!reviews.find(function(x){return x.id===d.review.id})){
        seen[d.review.id]=1;
        reviews.unshift(d.review);
        paint({[d.review.id]:1});
      }
    })
    .catch(function(){alert('Network error — please try again')})
    .finally(function(){btn.disabled=false;btn.textContent='Post review'});
});

fetchReviews();
setInterval(fetchReviews,4000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)fetchReviews()});
})();

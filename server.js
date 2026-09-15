const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=3000,WA='254718717172',USER='owner',PASS='12345678',SEC='yuri-secret',CUR='KES';
const DATA=path.join(__dirname,'data'),PUB=path.join(__dirname,'public');
if(!fs.existsSync(DATA))fs.mkdirSync(DATA);
const MENU=[
{id:'n1',name:'Nyama Choma (Goat)',cat:'Nyama Choma',price:850,desc:'Charcoal-grilled goat ribs with ugali and kachumbari.',img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80'},
{id:'n2',name:'Nyama Choma (Beef)',cat:'Nyama Choma',price:750,desc:'Slow-roasted beef ribs with ugali and sukuma wiki.',img:'https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80'},
{id:'n3',name:'Kuku Choma (Half)',cat:'Nyama Choma',price:950,desc:'Free-range kienyeji chicken grilled over charcoal.',img:'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=900&q=80'},
{id:'n4',name:'Mixed Grill (for 2)',cat:'Nyama Choma',price:2200,desc:'Goat, beef, chicken and sausage on a sizzling platter.',img:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80'},
{id:'m1',name:'Ugali & Nyama Wet Fry',cat:'Mains',price:650,desc:'Tender beef cubes in tomato-onion gravy with ugali.',img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80'},
{id:'m2',name:'Pilau ya Kuku',cat:'Mains',price:700,desc:'Fragrant Swahili-spiced rice with tender chicken.',img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=900&q=80'},
{id:'m3',name:'Pilau ya Nyama',cat:'Mains',price:680,desc:'Coastal pilau with slow-cooked beef chunks.',img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&q=80'},
{id:'m4',name:'Fried Tilapia & Ugali',cat:'Mains',price:900,desc:'Lake Victoria tilapia with ugali and greens.',img:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=900&q=80'},
{id:'m5',name:'Matumbo Wet Fry',cat:'Mains',price:550,desc:'Slow-cooked tripe in rich gravy with ugali.',img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=80'},
{id:'c1',name:'Biryani ya Kuku',cat:'Swahili',price:850,desc:'Layered spiced rice with marinated chicken.',img:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&q=80'},
{id:'c2',name:'Mahamri & Mbaazi',cat:'Swahili',price:350,desc:'Coconut doughnuts with creamy pigeon peas.',img:'https://images.unsplash.com/photo-1567337710282-00832b415979?w=900&q=80'},
{id:'s1',name:'Chapati (2 pcs)',cat:'Sides',price:120,desc:'Soft layered flatbread made fresh.',img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&q=80'},
{id:'s2',name:'Mandazi (5 pcs)',cat:'Sides',price:150,desc:'Sweet coconut doughnuts with cardamom.',img:'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=900&q=80'},
{id:'s3',name:'Sukuma Wiki',cat:'Sides',price:150,desc:'Kale sauteed with onions and tomatoes.',img:'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=900&q=80'},
{id:'s4',name:'Kachumbari',cat:'Sides',price:180,desc:'Fresh tomato, onion, coriander and chilli.',img:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80'},
{id:'s5',name:'Chips (Fries)',cat:'Sides',price:250,desc:'Golden hand-cut fries with kachumbari.',img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=80'},
{id:'s6',name:'Smokie Pasua',cat:'Sides',price:100,desc:'Split sausage stuffed with kachumbari.',img:'https://images.unsplash.com/photo-1612392062126-5f4c4c3b0a5e?w=900&q=80'},
{id:'d1',name:'Passion Juice',cat:'Drinks',price:300,desc:'Freshly pressed, no sugar added.',img:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&q=80'},
{id:'d2',name:'Chai ya Tangawizi',cat:'Drinks',price:200,desc:'Ginger tea with milk and cardamom.',img:'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=900&q=80'},
{id:'d3',name:'Tusker Lager 500ml',cat:'Drinks',price:350,desc:'Kenya favourite cold beer.',img:'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=900&q=80'},
{id:'d4',name:'Soda 300ml',cat:'Drinks',price:120,desc:'Coke, Fanta, Sprite or Krest.',img:'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=900&q=80'},
{id:'d5',name:'Bottled Water',cat:'Drinks',price:80,desc:'Chilled still water.',img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&q=80'}
];
function rd(f,d){try{return JSON.parse(fs.readFileSync(path.join(DATA,f),'utf8'))}catch(e){return d}}
function wr(f,d){fs.writeFileSync(path.join(DATA,f),JSON.stringify(d,null,2))}
function jn(res,c,o){const b=JSON.stringify(o);res.writeHead(c,{'Content-Type':'application/json','Content-Length':Buffer.byteLength(b)});res.end(b)}
function bd(req){return new Promise(r=>{let s='';req.on('data',c=>s+=c);req.on('end',()=>{try{r(JSON.parse(s||'{}'))}catch(e){r({})}})})}
function sg(o){const b=Buffer.from(JSON.stringify(o)).toString('base64url');const s=crypto.createHmac('sha256',SEC).update(b).digest('base64url');return b+'.'+s}
function vf(t){if(!t||t.indexOf('.')===-1)return null;const i=t.indexOf('.');const b=t.slice(0,i);const s=t.slice(i+1);const e=crypto.createHmac('sha256',SEC).update(b).digest('base64url');if(s!==e)return null;try{const p=JSON.parse(Buffer.from(b,'base64url').toString());return p.exp>Date.now()?p:null}catch(e){return null}}
function au(req){const h=req.headers.authorization||'';return vf(h.startsWith('Bearer ')?h.slice(7):'')}
if(!fs.existsSync(path.join(DATA,'menu.json')))wr('menu.json',MENU);
if(!fs.existsSync(path.join(DATA,'orders.json')))wr('orders.json',[]);
if(!fs.existsSync(path.join(DATA,'reviews.json')))wr('reviews.json',[
{id:'r1',name:'Wanjiru K.',rating:5,text:'The nyama choma is unreal! Tastes like home.',date:new Date().toISOString()},
{id:'r2',name:'Brian O.',rating:5,text:'Pilau ya kuku was perfect for family dinner.',date:new Date().toISOString()}
]);
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
const u=new URL(req.url,'http://x'),p=u.pathname,m=req.method;
if(p==='/api/config')return jn(res,200,{ok:true,currency:CUR,deliveryFee:200});
if(p==='/api/menu')return jn(res,200,{ok:true,menu:rd('menu.json',MENU)});
if(p==='/api/reviews'&&m==='GET')return jn(res,200,{ok:true,reviews:rd('reviews.json',[])});
if(p==='/api/reviews'&&m==='POST'){const b=await bd(req);if(!b.name||b.name.length<2)return jn(res,400,{ok:false,error:'Name required'});if(!b.text||b.text.length<5)return jn(res,400,{ok:false,error:'Review too short'});const r={id:'r'+Date.now(),name:String(b.name).slice(0,40),rating:Math.max(1,Math.min(5,+b.rating||5)),text:String(b.text).slice(0,500),date:new Date().toISOString()};const l=rd('reviews.json',[]);l.unshift(r);wr('reviews.json',l);return jn(res,201,{ok:true,review:r})}
if(p==='/api/order'&&m==='POST'){const b=await bd(req);if(!b.name||!b.phone||!b.items||!b.items.length)return jn(res,400,{ok:false,error:'Missing fields'});
const menu=rd('menu.json',MENU);
const items=b.items.map(i=>{const f=menu.find(x=>x.id===i.id);return f?{id:f.id,name:f.name,price:f.price,qty:Math.max(1,Math.min(20,+i.qty||1))}:null}).filter(Boolean);
if(!items.length)return jn(res,400,{ok:false,error:'No valid items'});
const sub=items.reduce((s,i)=>s+i.price*i.qty,0);
const fee=b.fulfillment==='delivery'?200:0;
const o={id:'YR-'+Date.now().toString(36).toUpperCase(),name:b.name,phone:b.phone,fulfillment:b.fulfillment||'delivery',address:b.address||'',note:b.note||'',items,subtotal:sub,deliveryFee:fee,total:sub+fee,status:'new',date:new Date().toISOString()};
const l=rd('orders.json',[]);l.unshift(o);wr('orders.json',l);
const L=['*NEW ORDER - YURI RESTAURANT*','','Receipt: '+o.id,'Name: '+o.name,'Phone: '+o.phone,'Type: '+(o.fulfillment==='delivery'?'DELIVERY':'PICKUP')];
if(o.address)L.push('Address: '+o.address);
L.push('','*ITEMS*');items.forEach(i=>L.push('- '+i.qty+' x '+i.name+' = '+CUR+' '+(i.price*i.qty)));
L.push('','Subtotal: '+CUR+' '+sub);if(fee)L.push('Delivery: '+CUR+' '+fee);
L.push('*TOTAL: '+CUR+' '+(sub+fee)+'*');if(o.note)L.push('','Note: '+o.note);
const wa='https://wa.me/'+WA+'?text='+encodeURIComponent(L.join('\n'));
console.log('[ORDER] '+o.id+' - '+CUR+' '+o.total);
return jn(res,201,{ok:true,id:o.id,total:o.total,subtotal:sub,deliveryFee:fee,currency:CUR,whatsapp:wa})}
if(p==='/api/admin/login'&&m==='POST'){const b=await bd(req);if(b.user!==USER||b.pass!==PASS)return jn(res,401,{ok:false,error:'Wrong credentials'});return jn(res,200,{ok:true,token:sg({role:'owner',exp:Date.now()+8*3600*1000})})}
if(p==='/api/admin/data'){if(!au(req))return jn(res,401,{ok:false,error:'Not signed in'});const o=rd('orders.json',[]),r=rd('reviews.json',[]);const a=o.filter(x=>x.status!=='cancelled');const rev=a.reduce((s,x)=>s+x.total,0);return jn(res,200,{ok:true,currency:CUR,orders:o,reviews:r,menu:rd('menu.json',MENU),stats:{revenue:rev,totalOrders:o.length,pending:o.filter(x=>x.status==='new').length,preparing:o.filter(x=>x.status==='preparing').length,delivered:o.filter(x=>x.status==='delivered').length,reviewCount:r.length,avgRating:r.length?r.reduce((s,x)=>s+x.rating,0)/r.length:0}})}
if(p==='/api/admin/order-status'&&m==='POST'){if(!au(req))return jn(res,401,{ok:false,error:'Not signed in'});const b=await bd(req);const o=rd('orders.json',[]);const x=o.find(y=>y.id===b.id);if(!x)return jn(res,404,{ok:false,error:'Not found'});x.status=b.status;wr('orders.json',o);return jn(res,200,{ok:true,order:x})}
if(p==='/api/admin/review'&&m==='DELETE'){if(!au(req))return jn(res,401,{ok:false,error:'Not signed in'});const b=await bd(req);wr('reviews.json',rd('reviews.json',[]).filter(r=>r.id!==b.id));return jn(res,200,{ok:true})}
let f=p==='/'?'/index.html':p;
f=path.join(PUB,f.replace(/\.\./g,''));
fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('404')}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});res.end(d)});
});
server.listen(PORT,'0.0.0.0',()=>console.log('Yuri Restaurant on http://localhost:'+PORT));

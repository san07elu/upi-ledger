(function(root){
const categories=['Food & dining','Groceries','Transport','Shopping','Bills & utilities','Health','Entertainment','Transfers','Other'];
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);
const day=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const validDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(new Date(s+'T00:00:00').getTime())&&day(new Date(s+'T00:00:00'))===s;
function classify(s){const x=s.toLowerCase();for(const [c,r] of [['Food & dining',/swiggy|zomato|restaurant|cafe|coffee|pizza|hotel|biryani/],['Groceries',/dmart|bigbasket|blinkit|zepto|grocery|grocer|supermarket/],['Transport',/uber|ola\b|rapido|metro|petrol|fuel|parking|fastag/],['Shopping',/amazon|flipkart|myntra|ajio|retail/],['Bills & utilities',/bescom|electric|airtel|jio\b|recharge|broadband|water bill/],['Health',/pharma|hospital|clinic|medical|apollo/],['Entertainment',/netflix|spotify|bookmyshow|cinema/]])if(r.test(x))return c;return 'Other';}
function parseSMS(text,date=day(new Date())){const s=String(text).replace(/\s+/g,' ').trim();if(!/\bupi\b|\bvpa\b/i.test(s)||!/\b(debit(?:ed)?|spent|paid|sent|withdrawn)\b/i.test(s)||/\b(failed|declined|reversed|refunded|unsuccessful|pending|credited|received|otp|collect request|payment request|not debited)\b/i.test(s))return null;
const amounts=[...s.matchAll(/(?:INR\s*|Rs\.?\s*|₹\s*)([\d,]+(?:\.\d{1,2})?)/gi)];if(!amounts.length)return null;const debit= s.search(/\b(?:debited|spent|paid|sent)\b/i);const first=amounts.filter(m=>!/\b(?:bal(?:ance)?|available|avl)\s*[:.]?\s*$/i.test(s.slice(Math.max(0,m.index-24),m.index))).sort((a,b)=>Math.abs(a.index-debit)-Math.abs(b.index-debit))[0];if(!first)return null;const amount=Number(first[1].replace(/,/g,''));if(!Number.isFinite(amount)||amount<=0)return null;
const ref=(s.match(/(?:UPI\s*)?(?:ref(?:erence)?(?:\s*(?:no|number))?|RRN|UTR|txn\s*id)\s*[.:#-]*\s*([0-9]{8,24})\b/i)||[])[1]||'';
let merchant=(s.match(/\b(?:to|at|towards)\s+(?!a\/c\b|account\b)([\w][\w .&@*+\/-]{1,70}?)(?=\s+(?:on\b|via\b|using\b|UPI\b|ref\b|RRN\b|UTR\b|avl\b|bal\b|txn\b)|[,;]|\.(?:\s|$)|$)/i)||[])[1]||'';if(!merchant)merchant=(s.match(/\b[\w.+-]+@[\w.-]+\b/)||[])[0]||'Unknown UPI payee';
return {date:validDay(date)?date:day(new Date()),amount,merchant:merchant.trim(),category:classify(merchant),ref,source:'UPI SMS'};}
function range(p,now=new Date()){let a=new Date(now),b=new Date(now);if(p==='week'){a.setDate(a.getDate()-((a.getDay()+6)%7));}else if(p==='month'){a.setDate(1);}else if(p==='lastMonth'){a=new Date(now.getFullYear(),now.getMonth()-1,1);b=new Date(now.getFullYear(),now.getMonth(),0);}else if(p==='year'){a=new Date(now.getFullYear(),0,1);}else if(p==='all'){return ['',''];}return [day(a),day(b)];}
function select(items,a,b){return items.filter(t=>(!a||t.date>=a)&&(!b||t.date<=b));}
function total(items){return items.reduce((s,t)=>s+Math.round(t.amount*100),0)/100;}
function duplicate(items,t){return !!t.ref&&items.some(x=>x.ref===t.ref);}
function csv(items){const q=v=>'"'+String(v??'').replace(/^[=+\-@\t\r]/,"'$&").replace(/"/g,'""')+'"';return ['Date,Merchant,Amount (INR),Category,Reference,Source',...items.map(t=>[t.date,t.merchant,t.amount.toFixed(2),t.category,t.ref,t.source].map(q).join(','))].join('\r\n');}
function readLog(s){return s.split(/\r?\n/).filter(x=>x.trim()).map(line=>{let m=line.match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*(.*)$/);return parseSMS(m?m[2]:line,m?m[1]:day(new Date()));});}
const api={categories,money,day,validDay,classify,parseSMS,range,select,total,duplicate,csv,readLog};if(typeof module!=='undefined')module.exports=api;else root.Ledger=api;
})(globalThis);

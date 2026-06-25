// Move the venn image to right after the "three overlapping circles" sentence,
// and remove the TED link line (it will be re-embedded fresh afterward).
const BASE=(process.env.OUTLINE_URL||'').replace(/\/$/,''), T=process.env.OUTLINE_API_TOKEN||''
if(!BASE||!T){console.error('Set OUTLINE_URL and OUTLINE_API_TOKEN');process.exit(1)}
const api=async(p,b)=>(await fetch(BASE+'/api/'+p,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+T},body:JSON.stringify(b)})).json()
const cols=await api('collections.list',{limit:100}); const list=await api('documents.list',{collectionId:cols.data[0].id,limit:100})
const doc=list.data.find(d=>/^Start Here/i.test(d.title))
const info=await api('documents.info',{id:doc.id})
let lines=(info.data.text||'').split('\n')

const imgLine=lines.find(l=>/!\[.*\]\(\/api\/attachments/.test(l))
if(!imgLine){ console.log('no image line found'); process.exit(1) }
// drop the image line(s) and the TED link line and any blank runs they leave
lines=lines.filter(l=>l!==imgLine && !l.includes('youtube.com/watch?v=4sZdcB6bjI8'))

// insert image after the sentence
const si=lines.findIndex(l=>l.includes('three overlapping circles'))
lines.splice(si+1,0,'',imgLine)

// collapse 3+ blank lines to 1
let text=lines.join('\n').replace(/\n{3,}/g,'\n\n')
await api('documents.update',{id:doc.id,text})
const after=await api('documents.info',{id:doc.id}); const al=(after.data.text||'').split('\n')
const i=al.findIndex(l=>l.includes('three overlapping circles'))
console.log('around sentence after update:'); al.slice(i,i+4).forEach((l,j)=>console.log('  '+(i+j)+': '+JSON.stringify(l.slice(0,70))))
console.log('TED present?', after.data.text.includes('4sZdcB6bjI8'))

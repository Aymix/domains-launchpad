import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/home/amine/.npm/_npx/705bc6b22212b352/node_modules/playwright')
const BASE=(process.env.OUTLINE_URL||'').replace(/\/$/,''), T=process.env.OUTLINE_API_TOKEN||''
if(!BASE||!T){console.error('Set OUTLINE_URL and OUTLINE_API_TOKEN');process.exit(1)}
const SHOT='/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad'
const api=async(p,b)=>(await fetch(BASE+'/api/'+p,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+T},body:JSON.stringify(b)})).json()
const cols=await api('collections.list',{limit:100}); const list=await api('documents.list',{collectionId:cols.data[0].id,limit:100})
const doc=list.data.find(d=>/^Start Here/i.test(d.title))
const ctx=await chromium.launchPersistentContext(SHOT+'/pwprofile',{headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],extraHTTPHeaders:{Authorization:'Bearer '+T},viewport:{width:1400,height:1100}})
const page=await ctx.newPage()
try{
  await page.goto(BASE+doc.url,{waitUntil:'networkidle',timeout:35000})
  await page.waitForSelector('.ProseMirror img',{timeout:20000})
  await page.waitForTimeout(2000)
  // select the image node (it's at the top) and cut it
  await page.click('.ProseMirror img')
  await page.waitForTimeout(400)
  await page.keyboard.press('Control+X')
  await page.waitForTimeout(800)
  // caret to end of the "three overlapping circles" sentence, new line, paste
  const ok=await page.evaluate(()=>{
    const ps=[...document.querySelectorAll('.ProseMirror p, .ProseMirror li')]
    const el=ps.find(e=>e.textContent.includes('three overlapping circles'))
    if(!el) return false
    el.scrollIntoView({block:'center'})
    el.closest('.ProseMirror').focus()
    const r=document.createRange(); r.selectNodeContents(el); r.collapse(false)
    const s=window.getSelection(); s.removeAllRanges(); s.addRange(r); return true
  })
  if(!ok) throw new Error('sentence not found after cut')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await page.keyboard.press('Control+V')
  await page.waitForTimeout(3500)
  await page.screenshot({path:SHOT+'/venn-final.png'})
  await page.waitForTimeout(2500)
}finally{ await ctx.close() }
const info=await api('documents.info',{id:doc.id}); const lines=(info.data.text||'').split('\n')
const si=lines.findIndex(l=>l.includes('three overlapping circles'))
console.log('around sentence now:'); lines.slice(si,si+4).forEach((l,j)=>console.log('  '+(si+j)+': '+JSON.stringify(l.slice(0,70))))
console.log('image count:', (info.data.text.match(/!\[[^\]]*\]\(/g)||[]).length, '| TED embed kept:', info.data.text.includes('[https://www.youtube.com/watch?v=4sZdcB6bjI8]'))

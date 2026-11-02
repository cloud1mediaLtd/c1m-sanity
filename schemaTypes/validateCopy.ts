import company from '../fixtures/company.json'
import provider from '../fixtures/provider.json'
export function validateCopy(kind:string,value:unknown):true|string {
 const payload=value&&typeof value==='object'&&'content' in value ? value.content : undefined
 const match=(expected:unknown,actual:unknown):boolean=>{
  if(typeof expected==='string')return typeof actual==='string'&&actual.trim().length>0
  if(Array.isArray(expected))return Array.isArray(actual)&&expected.length===actual.length&&expected.every((item,i)=>match(item,actual[i]))
  if(expected&&typeof expected==='object')return !!actual&&typeof actual==='object'&&Object.entries(expected).every(([key,item])=>key==='id' ? (actual as Record<string,unknown>)[key]===item : match(item,(actual as Record<string,unknown>)[key]))
  return false
 }
 return match(kind==='companyCopy'?company:provider,payload) ? true : 'Fill every copy field and retain the existing service/step counts.'
}

import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {createRemoteJWKSet,jwtVerify} from 'jose';
import {getChatGPTUser} from '../chatgpt-auth';
export function authConfig(){const e=env as any;return {ready:!!(e.ENTRA_TENANT_ID&&e.ENTRA_CLIENT_ID&&e.ENTRA_CLIENT_SECRET&&e.APP_ORIGIN),tenant:e.ENTRA_TENANT_ID||'',client:e.ENTRA_CLIENT_ID||'',secret:e.ENTRA_CLIENT_SECRET||'',origin:e.APP_ORIGIN||''};}
export async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
export const random=()=>crypto.randomUUID()+crypto.randomUUID();
export async function currentUser(){const c=await cookies(),token=c.get('discovery_session')?.value;if(token&&env.DB){const s=await env.DB.prepare('SELECT * FROM sessions WHERE hash=? AND expires>?').bind(await digest(token),new Date().toISOString()).first<any>();if(s)return {userId:s.user_id,displayName:s.name,email:s.email,fullName:s.name};}if(process.env.NODE_ENV==='development')return getChatGPTUser();return null;}
export function secureCookie(name:string,value:string,maxAge:number){return `${name}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;}
export async function validateIdToken(token:string,nonce:string){const cfg=authConfig();const issuer=`https://login.microsoftonline.com/${cfg.tenant}/v2.0`;const keys=createRemoteJWKSet(new URL(`https://login.microsoftonline.com/${cfg.tenant}/discovery/v2.0/keys`));const {payload}=await jwtVerify(token,keys,{issuer,audience:cfg.client,algorithms:['RS256'],clockTolerance:30,maxTokenAge:'10m'});if(payload.nonce!==nonce||payload.tid!==cfg.tenant||payload.ver!=='2.0'||typeof payload.oid!=='string'||typeof payload.sub!=='string')throw new Error('Identity validation failed');return payload;}

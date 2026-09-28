import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {authConfig,digest,secureCookie} from '../../../lib/auth';
export async function POST(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return new Response('Forbidden',{status:403});const token=(await cookies()).get('discovery_session')?.value;if(token&&env.DB)await env.DB.prepare('DELETE FROM sessions WHERE hash=?').bind(await digest(token)).run();const c=authConfig();const location=c.ready?`https://login.microsoftonline.com/${c.tenant}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(c.origin)}`:'/';return new Response(null,{status:303,headers:{Location:location,'Set-Cookie':secureCookie('discovery_session','',0)}});}

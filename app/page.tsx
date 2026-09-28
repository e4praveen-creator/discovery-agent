import Workbench from './workbench';
import {currentUser,authConfig} from './lib/auth';
export const dynamic='force-dynamic';
export default async function Home(){let user=null;try{user=await currentUser()}catch{}return <Workbench initialUser={user} authReady={authConfig().ready} development={process.env.NODE_ENV==='development'}/>;}

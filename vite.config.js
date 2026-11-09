import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import catalog from './api/catalog.js';
export default defineConfig({plugins:[react(),{name:'local-catalog-api',configureServer(server){server.middlewares.use('/api/catalog',(req,res)=>{const response={setHeader:(...args)=>res.setHeader(...args),status(code){res.statusCode=code;return this},json(data){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data))}};void catalog(req,response)})}}],build:{rollupOptions:{output:{manualChunks:{react:['react','react-dom'],supabase:['@supabase/supabase-js'],motion:['motion/react'],ui:['@radix-ui/react-dialog','@radix-ui/react-tabs','sonner']}}}}});

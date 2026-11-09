import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const photos=read('../src/photo-manifest.json'),courses=read('../src/academy-data.json'),credits=read('../public/image-credits.json');
test('every model guide has verified photos from the same manufacturer and a primary quiz image',()=>{
 let guides=0;const used=new Set();
 for(const c of courses)for(const m of c.models){guides++;assert.ok(m.photos?.length,`${c.id}/${m.id}`);assert.equal(m.image,m.photos[0]);assert.equal(new Set(m.photos).size,m.photos.length);for(const id of m.photos){const photo=photos[id];assert.ok(photo,id);assert.equal(photo.make,c.name,id);used.add(id)}}
 assert.equal(guides,166);assert.equal(used.size,214);assert.equal(used.size,Object.keys(photos).length);
});
test('every shipped photo is a real local WebP with dimensions and a complete licensed source credit',()=>{
 for(const [id,p] of Object.entries(photos)){const bytes=readFileSync(new URL('../public/cars/'+p.file,import.meta.url));assert.equal(bytes.subarray(0,4).toString(),'RIFF',id);assert.equal(bytes.subarray(8,12).toString(),'WEBP',id);assert.ok(p.width>0&&p.height>0);assert.match(p.source,/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,id);assert.match(p.license,/CC BY|CC0|Public domain|PDM|FAL/,id);assert.ok(p.artist&&p.label&&p.reference);assert.match(p.licenseUrl,/^https?:\/\//);const credit=credits.find(c=>c.key===id);assert.equal(credit?.page,p.source);assert.equal(credit?.license,p.license);assert.ok(credit?.changes);}
 assert.equal(credits.length,Object.keys(photos).length);
});
test('easily confused cars and body styles use distinct labelled photos',()=>{
 for(const ids of [['mazda-3-sedan','mazda-3-hatch'],['vw-gti','vw-golf-r'],['mb-glc','mb-glc-coupe'],['mb-gle','mb-gle-coupe'],['bmw-2-coupe','bmw-2-gran'],['bmw-4','bmw-4-gran'],['mitsubishi-outlander','mitsubishi-outlander-phev'],['subaru-brz','toyota-bz4x'],['mini-hatch','mini-5door'],['hyundai-kona','hyundai-kona-electric']]){assert.equal(new Set(ids.map(id=>photos[id].source)).size,ids.length);}
 assert.match(photos['toyota-corolla'].label,/sedan/);assert.match(photos['toyota-corolla'].description,/Corolla LE/i);assert.match(photos['honda-hrv'].description,/HR-V Sport/);assert.match(photos['mb-maybach-s'].description,/S 680/);
});

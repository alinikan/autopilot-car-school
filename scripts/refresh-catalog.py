"""Refresh Canadian government vehicle data. No API keys required."""
import csv,io,json,urllib.request,pathlib,datetime
ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCE='https://open.canada.ca/data/en/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64'
meta=json.load(urllib.request.urlopen('https://open.canada.ca/data/api/action/package_show?id=98f1a129-f628-4ce4-b24d-6f16bf24dd64'))['result']
resources=[r for r in meta['resources'] if r.get('format')=='CSV' and 'en' in r.get('language',[]) and ('2026 Fuel' in r['name'] or '2025 Fuel' in r['name'] or 'Battery-electric' in r['name'] or 'Plug-in hybrid' in r['name'])]
vehicles=[];sources=[]
for r in resources:
 blob=urllib.request.urlopen(r['url']).read()
 try:raw=blob.decode('utf-8-sig')
 except UnicodeDecodeError:raw=blob.decode('cp1252')
 rows=list(csv.reader(io.StringIO(raw)))
 print(r['name'],len(rows),'header:',rows[0])
 sources.append({'name':r['name'],'url':r['url'],'updated':r.get('last_modified')})
 # Files have a bilingual multi-line header. Actual data always begins with a four-digit year.
 for row in rows:
  if not row or not row[0].strip().isdigit() or len(row[0].strip())!=4:continue
  if int(row[0])<2025:continue
  try:
   bev='Battery-electric' in r['name'];phev='Plug-in hybrid' in r['name']
   vehicles.append({'id':str(len(vehicles)), 'year':int(row[0]),'make':row[1].strip(),'model':row[2].strip(),'body':row[3].strip(),'engine':None if bev else row[5] if phev else row[4], 'cylinders':None if bev else row[6] if phev else row[5], 'transmission':row[5] if bev else row[7] if phev else row[6], 'fuel':'Electric' if bev else ('Plug-in hybrid' if phev else {'X':'Regular gasoline','Z':'Premium gasoline','D':'Diesel','E':'Ethanol E85','N':'Natural gas'}.get(row[7],row[7])), 'city':None if (bev or phev) else row[8], 'highway':None if (bev or phev) else row[9], 'combined':None if (bev or phev) else row[10], 'kwh':row[9] if bev else None,'range':row[13] if bev else row[10] if phev else None,'motor':row[4] if (bev or phev) else None,'gasCombined':row[15] if phev else None})
  except IndexError:continue
out={'source':SOURCE,'checked':datetime.datetime.now(datetime.timezone.utc).isoformat(),'resources':sources,'vehicles':vehicles,'coverage':'Canadian 2025–2026 fuel-consumption records plus battery-electric and plug-in hybrid records. Trims are separate records. Excludes unlisted, historical, and non-Canadian models.'}
(ROOT/'public'/'catalog.json').write_text(json.dumps(out,separators=(',',':')))
print('Saved',len(vehicles),'records')

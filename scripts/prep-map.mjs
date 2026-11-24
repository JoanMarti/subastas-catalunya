import fs from 'fs';
import * as topo from 'topojson-client';
import { geoCentroid, geoPath, geoTransform } from 'd3-geo';
const P = ['08','17','25','43'];
const m = JSON.parse(fs.readFileSync('node_modules/es-atlas/es/municipalities.json'));
const pr = JSON.parse(fs.readFileSync('node_modules/es-atlas/es/provinces.json'));
console.log(Object.keys(m.objects), Object.keys(pr.objects));
const mun = topo.feature(m, m.objects.municipalities).features.filter(f=>P.includes(String(f.id).slice(0,2)));
console.log(mun.length, mun[0].id, mun[0].properties);
const prov = topo.feature(pr, pr.objects.provinces).features.filter(f=>P.includes(String(f.id)));
console.log(prov.map(f=>[f.id,f.properties]));
// projection
const lat0=41.7, lon0=0.15, K=1000, c=Math.cos(lat0*Math.PI/180);
const proj=(lon,lat)=>[ (lon-lon0)*K*c, (lat0-lat)*K*1.0 ];
const t = geoTransform({point(x,y){const p=proj(x,y);this.stream.point(+p[0].toFixed(1),+p[1].toFixed(1));}});
const path=geoPath(t);
const provPaths = prov.map(f=>({id:f.id,name:f.properties.name,d:path(f)}));
// merged comarca-free municipality mesh (internal borders) for light lines
const meshG = topo.mesh(m, {type:'GeometryCollection',geometries:m.objects.municipalities.geometries.filter(g=>P.includes(String(g.id).slice(0,2)))}, (a,b)=>a!==b);
const meshD = path(meshG);
const munis = mun.map(f=>{const [lo,la]=geoCentroid(f);return [String(f.id),f.properties.name,+lo.toFixed(4),+la.toFixed(4)];}).sort((a,b)=>a[1].localeCompare(b[1],'ca'));
// bounds
let xs=[],ys=[];for(const [, ,lo,la] of munis){const p=proj(lo,la);xs.push(p[0]);ys.push(p[1]);}
console.log(Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys));
const out={proj:{lat0,lon0,K,c},prov:provPaths,mesh:meshD,munis};

fs.writeFileSync('catalunya.json',JSON.stringify(out));
console.log('size',fs.statSync('catalunya.json').size, 'mesh',meshD.length);
console.log(munis.filter(x=>/Barcelona|Girona|Lleida|Tarragona|Hospitalet|Sabadell/.test(x[1])));

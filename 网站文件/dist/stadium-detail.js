export function detailStadium(T,scene,renderer){
let seed=781;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const material=(color,r=.8)=>new T.MeshStandardMaterial({color,roughness:r});
const metal=material('#667674',.46),dark=material('#1a2528'),concrete=material('#65716b'),yellow=material('#b9a158');
const mesh=(g,m,p)=>{const o=new T.Mesh(g,m);o.position.set(...p);scene.add(o);return o;};
const box=(x,y,z,p,m=metal)=>mesh(new T.BoxGeometry(x,y,z),m,p);
const rod=(a,b,r=.018,m=metal)=>{const d=new T.Vector3(...b).sub(new T.Vector3(...a));const o=mesh(new T.CylinderGeometry(r,r,d.length(),7),m,new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5).toArray());o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;};
// Fine, repeating turf fibres complement the broad mowing bands.
const c=document.createElement('canvas');c.width=c.height=512;const cx=c.getContext('2d');cx.fillStyle='#777';cx.fillRect(0,0,512,512);for(let i=0;i<38000;i++){let x=rnd()*512,y=rnd()*512,v=60+rnd()*150;cx.strokeStyle=`rgb(${v},${v},${v})`;cx.lineWidth=.4+rnd()*.6;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+(rnd()-.5)*2,y-1-rnd()*5);cx.stroke();}const bump=new T.CanvasTexture(c);bump.wrapS=bump.wrapT=T.RepeatWrapping;bump.repeat.set(34,52.5);bump.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
scene.traverse(o=>{if(o.isMesh&&o.geometry.type==='PlaneGeometry'&&o.geometry.parameters.width===68){o.material.bumpMap=bump;o.material.bumpScale=.055;o.material.color.set('#c9d2aa');o.receiveShadow=true;o.material.needsUpdate=true;}});
// A narrow, close-range strip of individual grass blades gives eye-height depth.
const bladeGeo=new T.PlaneGeometry(.005,.025),bladeMat=new T.MeshStandardMaterial({color:'#ffffff',side:T.DoubleSide,roughness:1});const grass=new T.InstancedMesh(bladeGeo,bladeMat,14000),dummy=new T.Object3D(),col=new T.Color();for(let i=0;i<14000;i++){const x=-34+rnd()*68,z=.18+rnd()*6;dummy.position.set(x,.018,z);dummy.rotation.set(0,rnd()*Math.PI,0);dummy.scale.set(.7+rnd(),.6+rnd()*1.2,1);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);col.setHSL(.29+rnd()*.025,.18+rnd()*.1,.16+rnd()*.065);grass.setColorAt(i,col);}scene.add(grass);
// Drainage grate and paving joints along the photographer's walking strip.
box(76,.022,.24,[-1,.004,-3.5],dark);const grate=new T.InstancedMesh(new T.BoxGeometry(.014,.012,.22),metal,850);for(let i=0;i<850;i++){dummy.position.set(-38+i*.089,.023,-3.5);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();grate.setMatrixAt(i,dummy.matrix);}scene.add(grate);
for(let x=-40;x<=40;x+=2)box(.012,.006,8,[x,-.025,-7.6],material('#2b3535'));
// Front-row rails, intermediate bars and entrance aisles create layered seating.
for(let z of [-15.6,120.5]){for(let x=-42;x<=42;x+=2.5){rod([x,0,z],[x,1.15,z],.026);rod([x,.55,z],[Math.min(x+2.5,42),.55,z],.018);}rod([-42,1.15,z],[42,1.15,z],.037);}
for(let aisle of [-30,-12,12,30]){for(let j=0;j<20;j++){const y=.18+j*.36,z=-16.8-j*.7;box(1.1,.12,.7,[aisle,y,z],concrete);box(1.1,.014,.05,[aisle,y+.067,z+.3],yellow);}for(let side of [-.5,.5]){rod([aisle+side,.85,-17],[aisle+side,7.7,-30.3],.026);for(let j=0;j<5;j++)rod([aisle+side,j*1.44,-17-j*2.8],[aisle+side,.85+j*1.44,-17-j*2.8],.021);}}
// Truss diagonals and roof purlins replace the silhouette of a single roof slab.
for(let z of [-22,-29,-36,127,134,141]){rod([-47,12.65,z],[47,12.65,z],.065);for(let x=-46;x<46;x+=7){rod([x,12.1,z],[x+3.5,12.85,z],.035);rod([x+3.5,12.85,z],[x+7,12.1,z],.035);}}
for(let x of [-43,-51,43,51]){rod([x,12.65,-25],[x,12.65,133],.065);for(let z=-20;z<130;z+=9){rod([x,12,z],[x,12.8,z+4.5],.035);rod([x,12.8,z+4.5],[x,12,z+9],.035);}}
// End-stand portal, row signage, and a restrained AP1 board.
const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=128;let sx=signCanvas.getContext('2d');sx.fillStyle='#1b303c';sx.fillRect(0,0,1024,128);sx.fillStyle='#b7c8cb';sx.font='500 29px sans-serif';sx.textAlign='center';sx.fillText('FROM THE TOUCHLINE',512,77);let signTex=new T.CanvasTexture(signCanvas);signTex.colorSpace=T.SRGBColorSpace;let sign=mesh(new T.PlaneGeometry(16,1.8),new T.MeshStandardMaterial({map:signTex,roughness:.8}),[0,2.6,-17]);
for(let x of [-12,12]){box(3.4,3.6,.3,[x,1.8,-24.5],dark);box(3.8,.2,.5,[x,3.7,-24.3],metal);for(let side of [-1.8,1.8])box(.15,3.7,.5,[x+side,1.85,-24.3],metal);}
// Photographer's case: lid seam, metal corners, latches, wheels and handle.
const caseMat=material('#222d30'),rubber=material('#101817');box(1.0,.48,.6,[-26,.25,-6.5],caseMat);for(let x of [-26.49,-25.51])for(let z of [-6.78,-6.22])box(.035,.5,.035,[x,.27,z]);box(1.04,.025,.64,[-26,.49,-6.5]);for(let x of [-26.3,-25.7])box(.07,.12,.025,[x,.38,-6.185]);rod([-26.16,.53,-6.5],[-26.16,.59,-6.5],.018);rod([-25.84,.53,-6.5],[-25.84,.59,-6.5],.018);rod([-26.16,.59,-6.5],[-25.84,.59,-6.5],.018);
for(let x of [-26.35,-25.65]){let wheel=mesh(new T.CylinderGeometry(.065,.065,.05,12),rubber,[x,.07,-6.8]);wheel.rotation.z=Math.PI/2;}
// A folded stool and bottle suggest a working spot rather than a pristine render.
for(let x of [-24.4,-24]){rod([x,0,-5.1],[x,.48,-5.65],.018);rod([x,0,-5.65],[x,.48,-5.1],.018);}box(.52,.035,.58,[-24.2,.49,-5.38],rubber);mesh(new T.CylinderGeometry(.037,.042,.22,12),material('#7d9992',.35),[-23.8,.11,-5.45]);
// Subtle contact shadows keep props and floating photographic windows grounded.
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;let sc=shadowCanvas.getContext('2d'),sg=sc.createRadialGradient(64,64,4,64,64,64);sg.addColorStop(0,'rgba(0,0,0,.6)');sg.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);const st=new T.CanvasTexture(shadowCanvas);for(let [x,z,w,d] of [[-26,-6.5,1.5,1],[-24.2,-5.38,.8,.8]]){let sh=mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:st,transparent:true,depthWrite:false}),[x,.003,z]);sh.rotation.x=-Math.PI/2;}
for(const x of [-22,22]){const light=new T.PointLight('#bfd4df',55,42,2);light.position.set(x,7,-12);scene.add(light);}
return {shadow:st};
}

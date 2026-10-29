// Single-photo perspective study. No player reconstruction or source-image editing.
// The foreground below row 0.81 contains grass only; project it onto the ground.
export function createGoalProjection(T,scene,photo,eye,texture){
 const columns=64,rows=80,cut=.81,floor=.035;
 photo.group.updateMatrixWorld(true);
 const centerCut=new T.Vector3(0,(.5-cut)*photo.height,0).applyMatrix4(photo.group.matrixWorld);
 const denominator=centerCut.y-eye.y;
 if(denominator>=-.05)throw new Error('The grass seam must be below eye height');
 const wallScale=(floor-eye.y)/denominator;
 const positions=[],uvs=[],indices=[];
 for(let row=0;row<=rows;row++){
  const v=row/rows;
  for(let col=0;col<=columns;col++){
   const u=col/columns;
   const original=new T.Vector3((u-.5)*photo.width,(.5-v)*photo.height,0).applyMatrix4(photo.group.matrixWorld);
   const ray=original.sub(eye);
   const scale=v<=cut?wallScale:(floor-eye.y)/ray.y;
   const p=eye.clone().addScaledVector(ray,scale);
   positions.push(p.x,Math.max(floor,p.y),p.z);uvs.push(u,1-v);
  }
 }
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const a=row*(columns+1)+col,b=a+1,c=a+columns+1,d=c+1;
  indices.push(a,c,b,b,c,d);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=new T.MeshBasicMaterial({map:texture,transparent:true,side:T.DoubleSide,toneMapped:false,fog:false,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
 material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
#ifdef USE_MAP
 
 float sides=smoothstep(0.0,0.028,min(vMapUv.x,1.0-vMapUv.x));
 float top=smoothstep(0.0,0.018,1.0-vMapUv.y);
 float foreground=smoothstep(0.0,0.12,vMapUv.y);
 diffuseColor.a *= sides*top*foreground;
#endif`);};
 const mesh=new T.Mesh(geometry,material);mesh.renderOrder=2;scene.add(mesh);
 return {mesh,dispose(){scene.remove(mesh);geometry.dispose();material.dispose();}};
}

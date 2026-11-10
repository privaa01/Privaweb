import test from 'node:test';
import assert from 'node:assert/strict';
import {spotifyEpisode,validatedImageUrl,validateFirebaseStory} from '../src/lib/firebase-story.ts';

test('normaliza el enlace aprobado de Spotify sin parámetros de seguimiento',()=>{
 assert.deepEqual(spotifyEpisode('https://open.spotify.com/episode/52y1zIOZ1J4WgW1PKxeWiu?si=prueba'),{
  provider:'spotify',episodeId:'52y1zIOZ1J4WgW1PKxeWiu',publicUrl:'https://open.spotify.com/episode/52y1zIOZ1J4WgW1PKxeWiu',embedUrl:'https://open.spotify.com/embed/episode/52y1zIOZ1J4WgW1PKxeWiu',
 });
});
test('rechaza imagen sin HTTPS y enlace que no sea episodio',()=>{
 assert.throws(()=>validatedImageUrl('http://example.test/cover.png'));
 assert.throws(()=>spotifyEpisode('https://open.spotify.com/show/52y1zIOZ1J4WgW1PKxeWiu'));
});
test('valida el documento completo de Firestore',()=>{
 const spotify=spotifyEpisode('52y1zIOZ1J4WgW1PKxeWiu');
 const story=validateFirebaseStory({schemaVersion:1,slug:'contrasena-compartida',title:'La contraseña compartida',personName:'Luisa',category:'Contraseñas',description:'Descripción',transcript:'Transcripción',question:'¿Qué ocurrió?',options:[1,2,3].map(n=>({id:`opcion-${n}`,label:`Opción ${n}`,explanation:'Explicación'})),image:{url:'https://priva-785cb.web.app/images/stories/contrasena-luisa.png',alt:'Caso de Luisa',width:421,height:129},podcast:{...spotify,durationSeconds:138},status:'published',active:true,order:3});
 assert.equal(story.podcast.embedUrl,'https://open.spotify.com/embed/episode/52y1zIOZ1J4WgW1PKxeWiu');
});

import type { PublicStory } from '../lib/stories-contract';
export function connectExercise(card:HTMLElement,story:PublicStory):()=>void{
 const fieldset=card.querySelector<HTMLFieldSetElement>('[data-exercise]')!;
 const container=fieldset.querySelector<HTMLElement>('[data-options]')!;
 const feedback=fieldset.querySelector<HTMLElement>('[data-feedback]')!;
 for(const option of story.options){
  const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');
  input.type='radio';input.name=`story-${story.id}`;input.id=`story-${story.id}--option-${option.id}`;input.value=option.id;
  label.htmlFor=input.id;text.textContent=option.label;label.append(input,text);container.append(label);
 }
 const reset=()=>{container.querySelectorAll<HTMLInputElement>('input').forEach(i=>i.checked=false);feedback.textContent='';};
 const change=(event:Event)=>{const target=event.target;if(target instanceof HTMLInputElement){const option=story.options.find(o=>o.id===target.value);if(option)feedback.textContent=option.explanation;}};
 fieldset.addEventListener('change',change);window.addEventListener('pageshow',reset);reset();
 return()=>{fieldset.removeEventListener('change',change);window.removeEventListener('pageshow',reset);reset();};
}

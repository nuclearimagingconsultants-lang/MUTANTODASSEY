/* Long-form conversations and consequential dialogue. Additive schema-v2 state only. */
(function(root){'use strict';
 const C=root.OdysseyCore,Q=root.OdysseyQuests,V=root.VampireExpansion;
 const themes=[
  ['belonging','A frightened mind is still a person, even when two worlds call it an anomaly.'],
  ['responsibility','Power can open a path, but somebody must decide who gets to walk through first.'],
  ['memory','What people choose to remember can protect the living—or trap them inside somebody else’s story.'],
  ['trust','A team becomes real when disagreement does not send everyone running for separate doors.'],
  ['temptation','The easiest power to use is often the one that asks the highest price afterward.'],
  ['accountability','Evidence matters because authority should have to answer the people it affects.'],
  ['mercy','Stopping a threat and understanding it are not always opposite choices.'],
  ['cooperation','Two plans can share the same promise: everyone comes home.'],
  ['community','A bridge is more than concrete when an entire neighborhood depends on who controls it.'],
  ['care','A cure that ignores the patient is only another kind of weapon.'],
  ['mentorship','The younger class learns as much from restraint as it does from victory.'],
  ['courage','Darkness changes what people can see, not what they owe one another.'],
  ['truth','A record can expose a crime, but it can also expose the people who survived it.'],
  ['rescue','No timetable is more important than the person still waiting at the dock.'],
  ['grief','Escaping a painful memory is different from abandoning the people still inside it.'],
  ['possibility','When every offered future is cruel, refusing the choice can become an act of creation.'],
  ['shelter','Winning means very little if the doors behind you never opened.'],
  ['rebuilding','A city returns through small promises kept on ordinary streets.'],
  ['homecoming','Time changes a home, but it does not erase the welcome promised at its door.'],
  ['leadership','A safe institution must belong to the students who live inside it.'],
  ['stewardship','Living power grows through relationship, not possession.'],
  ['solidarity','The strongest person at the gate should not have to stand there alone.'],
  ['judgment','A system cannot excuse its maker merely because it followed the rules it was given.'],
  ['hope','A lasting ending is not a closed door; it is a future where everyone still has choices.']
 ];
 const approaches={
  mercy:{label:'Compassion',color:'#7ee6c5',intent:'Protect people first and earn deeper companion trust.',result:'You slow the moment down long enough for the people inside it to be heard.'},
  duty:{label:'Evidence',color:'#73b8ff',intent:'Preserve proof, preparation and long-term accountability.',result:'You build a record strong enough to survive denial, pressure and fear.'},
  freedom:{label:'Defiance',color:'#f2b36d',intent:'Challenge the system directly and create a new route.',result:'You refuse the choices offered by the people who built the trap.'}
 };
 const allyLines={
  goldie:{mercy:'If we make space for them to breathe, they may tell us what the report cannot.',duty:'Keep the evidence safe. Kindness needs something solid to stand on tomorrow.',freedom:'Then we make our own opening—but we keep everyone behind us out of the blast.'},
  juno:{mercy:'I can quiet the signal while you talk. Machines are easier to repair after people feel safe.',duty:'Give me thirty seconds with the relay. I can make a copy nobody can quietly rewrite.',freedom:'Their system assumes we will obey its menu. I can add another option.'},
  yara:{mercy:'Strength is also knowing when to kneel beside someone instead of towering over them.',duty:'Roots remember every footprint. We can leave the truth where it cannot be uprooted.',freedom:'A wall is only permanent until the ground beneath it decides otherwise.'}
 };
 const companionName=id=>C.allies[id]?.name||'Your companion';
 function state(s){s.odyssey??={};const n=s.odyssey.narrative??={version:1,decisions:[],relationships:{goldie:0,juno:0,yara:0},sceneVisits:{},vampireChoices:[],threads:{}};n.decisions??=[];n.relationships??={goldie:0,juno:0,yara:0};n.sceneVisits??={};n.vampireChoices??=[];n.threads??={};return n}
 function key(s,m){return [s.odyssey.act,s.odyssey.episode||0,m.stepIndex||0].join(':')}
 function dominant(s){const m=s.morals||{};return Object.entries({mercy:m.mercy||0,duty:m.duty||0,freedom:m.freedom||0}).sort((a,b)=>b[1]-a[1])[0][0]}
 function present(s,index=0){const ids=(s.party||[]).filter(id=>C.allies[id]);return ids.length?ids[index%ids.length]:'goldie'}
 function recent(s){return state(s).decisions.at(-1)}
 function scene(s,m){const n=state(s),k=key(s,m),theme=themes[Math.min(23,s.odyssey.act||0)],ally=present(s,(m.stepIndex||0)+(s.odyssey.episode||0)),last=recent(s),isBattle=m.action==='battle',isDebrief=m.action==='debrief',isPuzzle=m.action==='puzzle';n.sceneVisits[k]=(n.sceneVisits[k]||0)+1;
  let beats=[
   {speaker:m.speaker,text:m.line},
   {speaker:companionName(ally),portrait:ally,text:isBattle?'I am with you. Let us read the field before anybody moves.':allyLines[ally]?.[last?.approach||dominant(s)]||'We should hear everyone before we decide.'},
   {speaker:s.name,text:last?'Last time, I chose '+last.label.toLowerCase()+'. I need to remember what that changed.':'I want a plan that protects people and still leaves us able to face the truth.'},
   {speaker:m.speaker,text:theme[1]+' The question here is not only whether we can win. It is what our victory teaches everyone watching.'}
  ];
  if(isPuzzle)beats.push({speaker:'Juno',portrait:'juno',text:'The clue is enough. We can reason through it together, and if you would rather test your strength, the guardian route remains available.'});
  if(isBattle)beats.push({speaker:companionName(ally),portrait:ally,text:'Choose our opening carefully. After your command, give each of us an order. We fight as a team now.'});
  if(isDebrief){const missionDecisions=n.decisions.filter(x=>x.act===s.odyssey.act&&x.episode===(s.odyssey.episode||0));beats=[
   {speaker:m.speaker,text:m.line},
   {speaker:companionName(ally),portrait:ally,text:missionDecisions.length?'You made '+missionDecisions.length+' decisions in the field. None of them disappeared when the fighting stopped.':'The report should include the people we met, not only the enemy we defeated.'},
   {speaker:s.name,text:missionDecisions.length?'I chose '+missionDecisions.map(x=>x.label.toLowerCase()).join(', ')+'. I will explain why.':'I will tell the truth about what happened and what we still owe the people there.'},
   {speaker:m.speaker,text:'Then the record will carry more than a victory. It will carry responsibility into the next chapter.'}
  ]}
  return{k,theme:theme[0],ally,beats,choices:(m.choices||[]).map((label,i)=>choiceInfo(label,i,m)),action:m.action,title:m.label};
 }
 function choiceInfo(label,i,m){const approach=['mercy','duty','freedom'][i%3],a=approaches[approach];return{index:i,label,approach,approachLabel:a.label,intent:m.action==='puzzle'?'Use the evidence in the conversation.':a.intent,color:a.color}}
 function choose(s,m,index){const label=m.choices?.[index];if(label===undefined)return{error:'Choose one of the available responses.'};if(m.action==='puzzle'){const error=Q?.check(s,label);return error?{error}:{label,response:'The evidence fits. The route ahead opens without losing anyone to a guess.',approach:'reason'}}
  const n=state(s),k=key(s,m),existing=n.decisions.find(x=>x.key===k);if(existing)return{...existing,response:existing.response||'Your earlier decision still stands.'};const approach=['mercy','duty','freedom'][index%3],a=approaches[approach],ally=present(s,index),decision={key:k,act:s.odyssey.act,episode:s.odyssey.episode||0,step:m.stepIndex||0,label,approach,response:a.result+' '+(allyLines[ally]?.[approach]||'Your party understands the direction you chose.')};n.decisions.push(decision);s.morals??={mercy:0,duty:0,freedom:0};s.morals[approach]=(s.morals[approach]||0)+2;n.relationships[ally]=(n.relationships[ally]||0)+2;s.npcTrust??={};s.npcTrust[ally]=(s.npcTrust[ally]||0)+1;n.threads[themes[Math.min(23,s.odyssey.act||0)][0]]=approach;return decision}
 function relationship(s,id){return state(s).relationships[id]||0}
 function summary(s){const n=state(s),counts={mercy:0,duty:0,freedom:0};for(const d of n.decisions)if(counts[d.approach]!==undefined)counts[d.approach]++;return{decisions:n.decisions.length,counts,dominant:dominant(s),relationships:{...n.relationships}}}
 const vampireChoices={
  elemental:[['Evacuate the flooded block first','Map the ritual and preserve proof','Ask the river spirits what was stolen'],['Shield the residents from the weather','Disrupt the elemental anchor','Turn the storm against the regent']],
  brawn:[['Free the unwilling fighters first','Document every name in the challenge ring','Enter the arena and break its rules'],['Protect the injured challengers','Expose the champion’s bargain','Call the crowd to reject the trial']],
  steel:[['Clear civilians from the magnetic streets','Preserve the forge records','Take control of the weapon field'],['Destroy only the dangerous machines','Seize the maker’s command ledger','Reverse the blade storm']],
  arcane:[['Separate the curse from its host','Study the exact language of the spell','Rewrite the bargain in public'],['Protect the marked families','Preserve the grimoire as evidence','Turn the circle against its sorcerer']]
 };
 function vampireScene(s,f){const q=V.quest(s,f),v=V.state(s),stage=Math.min(1,v.stages[f]||0),fac=V.factions[f],ally=present(s,(q?.level||1)+stage),choices=vampireChoices[f]?.[stage]||[];if(!q)return null;const first=stage===0;return{key:'v:'+f+':'+q.level+':'+stage,title:q.title,ally,beats:[
   {speaker:fac.champion,text:first?'New Orleans remembers every promise made after midnight. If you enter '+fac.district+', you enter under our law.':'You returned with questions when most hunters return with weapons.'},
   {speaker:companionName(ally),portrait:ally,text:first?'Then tell us who that law protects. We came for the people caught inside it.':'We followed the trail. The story your regent tells and the marks on the street do not agree.'},
   {speaker:s.name,text:'I am building the Shadow Covenant, but I will decide what kind of covenant it becomes.'},
   {speaker:fac.champion,text:(first?q.task:'The trail now points to '+q.boss+'.')+' Choose carefully. The city will repeat the answer you give tonight.'}
  ],choices:choices.map((label,i)=>choiceInfo(label,i,{action:'choice'})),faction:f,stage};}
 function chooseVampire(s,f,stage,index){const sc=vampireScene(s,f),choice=sc?.choices[index];if(!choice)return{error:'Choose one of the covenant responses.'};const n=state(s),key='v:'+f+':'+V.quest(s,f).level+':'+stage,existing=n.vampireChoices.find(x=>x.key===key);if(existing)return existing;const approach=choice.approach,a=approaches[approach],record={key,faction:f,level:V.quest(s,f).level,stage,label:choice.label,approach,response:a.result+' The '+V.factions[f].short+' court will remember this answer.'};n.vampireChoices.push(record);s.morals??={mercy:0,duty:0,freedom:0};s.morals[approach]=(s.morals[approach]||0)+1;V.state(s).notes.push(choice.label+' · '+a.label);return record}
 const oldPrepare=C.prepare;C.prepare=w=>{const out=oldPrepare(w);state(out.save);return out};
 root.OdysseyNarrative={themes,approaches,state,scene,choose,summary,relationship,vampireScene,chooseVampire};
})(window);

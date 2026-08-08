/* TuJugada - client scripts */
(function(){
  // Mobile menu
  var t=document.querySelector('.menu-toggle'),n=document.querySelector('.mainnav');
  if(t&&n){t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);});}

  // Generador de números
  var gForm=document.getElementById('gen-form');
  if(gForm){
    gForm.addEventListener('submit',function(e){
      e.preventDefault();
      var cant=Math.max(1,Math.min(20,parseInt(document.getElementById('gen-cant').value)||1));
      var max=Math.max(1,Math.min(999,parseInt(document.getElementById('gen-max').value)||99));
      var min=Math.max(0,Math.min(max,parseInt(document.getElementById('gen-min').value)||0));
      var unico=document.getElementById('gen-unico').checked;
      var out=[],pool=[];
      if(unico){
        for(var i=min;i<=max;i++)pool.push(i);
        for(var k=0;k<cant&&pool.length;k++){var idx=Math.floor(Math.random()*pool.length);out.push(pool.splice(idx,1)[0]);}
      }else{
        for(var j=0;j<cant;j++)out.push(min+Math.floor(Math.random()*(max-min+1)));
      }
      out=out.map(function(x){return (max<100&&x<10)?('0'+x):(''+x);});
      document.getElementById('gen-out').innerHTML='<span class="num-out">'+out.join(' · ')+'</span>';
    });
  }

  // Control de jugadas (checker)
  var cForm=document.getElementById('control-form');
  if(cForm){
    cForm.addEventListener('submit',function(e){
      e.preventDefault();
      var mine=(document.getElementById('control-num').value||'').replace(/\D/g,'');
      var pos=parseInt(document.getElementById('control-pos').value)||20;
      var box=document.getElementById('control-out');
      if(mine.length<2){box.innerHTML='<span class="lose">Ingresá al menos 2 cifras de tu número.</span>';return;}
      if(!window.__RES){box.innerHTML='Cargando resultados…';return;}
      var data=window.__RES;
      var hits=[];
      Object.keys(data).forEach(function(juris){
        (data[juris].turnos||[]).forEach(function(turno){
          var nums=turno.numeros||[];
          for(var i=0;i<nums.length&&i<pos;i++){
            var full=(''+nums[i]).padStart(4,'0');
            // match by last N digits of the played number
            if(full.slice(-mine.length)===mine || full===mine){
              hits.push({juris:data[juris].nombre,turno:turno.nombre,pos:i+1,num:full});
            }
          }
        });
      });
      if(hits.length){
        var rows=hits.map(function(h){return '<tr><td>'+h.juris+'</td><td>'+h.turno+'</td><td>'+h.pos+'º</td><td class="cabeza">'+h.num+'</td></tr>';}).join('');
        box.innerHTML='<p class="win">¡Tu número apareció '+hits.length+' vez/veces en los sorteos de hoy!</p><div class="res-wrap"><table><thead><tr><th>Lotería</th><th>Turno</th><th>Posición</th><th>Número</th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="muted" style="font-size:.82rem">Verificá siempre contra el extracto oficial antes de cobrar.</p>';
      }else{
        box.innerHTML='<p class="lose">Tu número ('+mine+') no aparece dentro de los primeros '+pos+' puestos en los sorteos cargados de hoy.</p>';
      }
    });
  }

  // Load results JSON where needed
  if(document.querySelector('[data-needs-results]')){
    fetch('/resultados.json').then(function(r){return r.json();}).then(function(d){window.__RES=d;
      document.dispatchEvent(new Event('results-ready'));}).catch(function(){});
  }
})();

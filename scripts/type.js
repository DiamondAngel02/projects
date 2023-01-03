

const displayWords = async () => {
    const response = await fetch('/scripts/words.json');
    const words = await response.json();
    let html = '';
    for (let i = 0; i < 200; i++) {
      const index = Math.floor(Math.random() * words.words.length);
      html += `<div class="word"><span class="letter">${words.words[index].split('').join('</span><span class="letter">')}</span></div> `;
    }
    document.getElementById('words').innerHTML = html;
  }

//   function addClass(current,name) {
//     current.className += ' '+name;
//   }
  
//   const current = document.querySelector('.word');
//   addClass(current, 'current');
  



  
  //focus
  const focus = document.getElementById('focus-error');
  focus.style.display = 'none';
 
  const focusMe = () => {
    focus.style.display = 
    'block';
  };
  
  const focusGa = () => {
    focus.style.display = 
    'none';
  };

// display words 
  document.getElementById('button').addEventListener('click', displayWords);
  
  document.getElementById('button').addEventListener('click', focusMe);
  
  //focus 
  document.getElementById('game').addEventListener('focus', focusGa)

  document.getElementById('game').addEventListener('blur', focusMe)

  document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
  })
  
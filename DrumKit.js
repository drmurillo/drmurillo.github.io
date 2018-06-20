window.addEventListener('keydown', playSound);

function removeTransition(e) {
  if (e.propertyName !== 'transform') {
    return; //skip if it's not a transition
  } else {
    this.classList.remove('playing');
  }
}

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  if (!audio) {
    return; // if there nothing to select, audio will be null and we will exit the function
  } else {
    audio.currentTime = 0; //rewind to the start
    audio.play();
    key.classList.add('playing');
  }
  const keys = document.querySelectorAll('.key');
  keys.forEach(key => key.addEventListener('transitionend', removeTransition));
}

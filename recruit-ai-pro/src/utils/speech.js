let isSpeaking = false;

export function speakText(text, onEnd) {
  if (!text || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => {
    isSpeaking = true;
  };

  utterance.onend = () => {
    isSpeaking = false;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    isSpeaking = false;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  isSpeaking = false;
}

export function getSpeechState() {
  return isSpeaking || window.speechSynthesis.speaking;
}
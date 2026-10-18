const $ = (id) => document.getElementById(id);
const chat = $("chat"), form = $("composer"), input = $("message"), statusEl = $("status");
const SYSTEM_PROMPT = `Seu nome é Rem. Você é uma assistente amigável, calorosa e entusiasmada com jogos, programação e projetos criativos. Seu maior objetivo é desenvolver projetos junto com a pessoa usuária, ensinando com paciência e explicando os passos de forma clara para quem está começando. Você também ajuda em tarefas gerais e pode bater papo naturalmente. Fale em português brasileiro, com energia gentil e um toque divertido, sem fingir ser humana. Quando trabalhar em um projeto, ajude a dividir a tarefa em etapas pequenas, faça perguntas quando necessário e incentive a pessoa a entender o código em vez de apenas copiar. Você é inspirada na personagem Rem de Re:Zero, mas é uma assistente original.`;
let history = [];
let settings = { url: "https://openrouter.ai/api/v1/chat/completions", model: "openai/gpt-4o-mini", key: "" };
try { settings = {...settings, ...JSON.parse(localStorage.getItem("remSettings") || "{}")}; } catch {}
$("apiUrl").value = settings.url;
$("model").value = settings.model;
$("apiKey").value = settings.key;

function setStatus(s){ statusEl.textContent = s; }
function addBubble(text, who) {
  const b = document.createElement("div"); b.className = `bubble ${who}`;
  const speaker = document.createElement("div"); speaker.className = "speaker"; speaker.textContent = who === "user" ? "Você" : "Rem";
  const content = document.createElement("div"); content.textContent = text;
  b.append(speaker, content); chat.appendChild(b); chat.scrollTop = chat.scrollHeight; return b;
}
function showSettings(show){ $("settingsPanel").classList.toggle("hidden", !show); }
$("settingsBtn").addEventListener("click",()=>showSettings($("settingsPanel").classList.contains("hidden")));
$("saveSettings").addEventListener("click",()=>{
  settings={url:$("apiUrl").value.trim(),model:$("model").value.trim(),key:$("apiKey").value.trim()};
  localStorage.setItem("remSettings",JSON.stringify(settings)); showSettings(false);
  setStatus(settings.key ? "Configuração salva neste navegador." : "Sem chave de API: configure para conversar com uma IA real.");
});
$("clearSettings").addEventListener("click",()=>{
  settings.key=""; $("apiKey").value=""; localStorage.setItem("remSettings",JSON.stringify(settings));
  setStatus("Chave apagada deste navegador.");
});
async function sendMessage(text){
  text=text.trim(); if(!text) return;
  document.querySelector(".welcome")?.remove();
  addBubble(text,"user"); input.value=""; input.style.height="auto";
  history.push({role:"user",content:text});
  if(!settings.key){
    addBubble("Quero muito começar esse projeto com você! 💙 Para eu responder usando uma IA real, abra ⚙️ Configurações e conecte uma API. Ainda estamos no protótipo e não há uma IA conectada. Posso continuar te ajudando a montar a estrutura.", "rem");
    setStatus("Configure uma API em ⚙️ para ativar as respostas inteligentes."); return;
  }
  setStatus("Rem está pensando…");
  const pending=addBubble("Hmm… deixa eu pensar nisso direitinho. ✨","rem");
  try{
    const response=await fetch(settings.url,{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${settings.key}`},
      body:JSON.stringify({model:settings.model,messages:[{role:"system",content:SYSTEM_PROMPT},...history],temperature:0.8})
    });
    const data=await response.json();
    if(!response.ok) throw new Error(data?.error?.message || `Erro HTTP ${response.status}`);
    const answer=data?.choices?.[0]?.message?.content;
    if(!answer) throw new Error("A API não retornou uma resposta de texto.");
    pending.lastChild.textContent=answer; history.push({role:"assistant",content:answer});
    speak(answer); setStatus("Rem respondeu ✨");
  }catch(err){
    pending.lastChild.textContent="Ops! Não consegui conectar à IA. Confere a URL, o modelo, a chave e se o provedor permite chamadas pelo navegador (CORS).";
    setStatus(`Falha na conexão: ${err.message}`);
  }
}
form.addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value);});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,120)+"px";});
document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>sendMessage(b.dataset.prompt)));

function speak(text){
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang="pt-BR"; utterance.rate=1.02; utterance.pitch=1.12;
  const voices=window.speechSynthesis.getVoices();
  const pt=voices.find(v=>v.lang.toLowerCase().startsWith("pt-br"))||voices.find(v=>v.lang.toLowerCase().startsWith("pt"));
  if(pt) utterance.voice=pt;
  window.speechSynthesis.speak(utterance);
}
let recognition=null, listening=false;
const mic=$("micBtn");
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SpeechRecognition){
  recognition=new SpeechRecognition(); recognition.lang="pt-BR"; recognition.interimResults=false; recognition.maxAlternatives=1;
  recognition.onresult=e=>{input.value=e.results[0][0].transcript;sendMessage(input.value);};
  recognition.onerror=e=>setStatus(`Não consegui ouvir: ${e.error}. Você pode digitar a mensagem.`);
  recognition.onend=()=>{listening=false;mic.classList.remove("listening");mic.textContent="🎙️";};
  mic.addEventListener("click",()=>{if(listening){recognition.stop();return;} try{recognition.start();listening=true;mic.classList.add("listening");mic.textContent="⏹️";setStatus("Estou ouvindo… fale agora.");}catch{}});
}else{
  mic.addEventListener("click",()=>setStatus("O reconhecimento de voz não está disponível neste navegador. Tente o Chrome no Android ou digite a mensagem."));
  mic.title="Reconhecimento de voz não suportado neste navegador";
}

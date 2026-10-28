const $ = (id) => document.getElementById(id);
const questions = [
  { q: "Qual é a capital do Brasil?", a: ["São Paulo", "Brasília", "Salvador"], correct: 1 },
  { q: "Quanto é 7 × 8?", a: ["54", "56", "64"], correct: 1 },
  { q: "Qual planeta é conhecido como planeta vermelho?", a: ["Marte", "Vênus", "Júpiter"], correct: 0 }
];
let points = 0, questionIndex = 0, answered = false;
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === name));
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.page === name));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b => b.addEventListener("click", () => showPage(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showPage(b.dataset.go)));
function renderQuestion() {
  answered = false;
  $("quiz-feedback").textContent = "";
  $("restart-quiz").classList.add("hidden");
  if (questionIndex >= questions.length) {
    $("question-count").textContent = "RODADA CONCLUÍDA";
    $("question").textContent = "Parabéns por concluir o quiz!";
    $("answers").innerHTML = "";
    $("quiz-feedback").textContent = "Você terminou a rodada. Os pontos são apenas demonstrativos.";
    $("restart-quiz").classList.remove("hidden");
    return;
  }
  const item = questions[questionIndex];
  $("question-count").textContent = `PERGUNTA ${questionIndex + 1} DE ${questions.length}`;
  $("question").textContent = item.q;
  $("answers").innerHTML = "";
  item.a.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "answer"; btn.textContent = answer;
    btn.addEventListener("click", () => chooseAnswer(index, btn));
    $("answers").appendChild(btn);
  });
}
function chooseAnswer(index, button) {
  if (answered) return;
  answered = true;
  const item = questions[questionIndex];
  document.querySelectorAll(".answer").forEach((b, i) => {
    b.disabled = true;
    if (i === item.correct) b.classList.add("correct");
  });
  if (index === item.correct) {
    points += 10; $("points").textContent = points;
    $("quiz-feedback").textContent = "Resposta correta! +10 pontos de demonstração — sem valor monetário.";
  } else {
    button.classList.add("wrong");
    $("quiz-feedback").textContent = "Não foi dessa vez. Vamos para a próxima pergunta.";
  }
  const next = document.createElement("button");
  next.className = "primary"; next.style.marginTop = "12px";
  next.textContent = questionIndex === questions.length - 1 ? "Ver resultado" : "Próxima pergunta";
  next.addEventListener("click", () => { questionIndex++; renderQuestion(); });
  $("answers").appendChild(next);
}
$("restart-quiz").addEventListener("click", () => { questionIndex = 0; renderQuestion(); });
$("video-status").addEventListener("click", () => {
  $("video-feedback").textContent = "Ainda sem campanhas, receita ou recompensas reais. Nenhum anúncio foi exibido.";
});
$("pix-info").addEventListener("click", () => openInfo("Pix ainda não conectado",
  "Para pagar de verdade, o projeto precisa de um servidor seguro, receita e orçamento para recompensas, um provedor de pagamentos Pix de saída e testes. Os segredos de pagamento devem ficar no servidor, nunca dentro do aplicativo. Não será cobrada taxa antecipada para liberar saque."));
$("copy-ref").addEventListener("click", async () => {
  const code = $("ref-code").textContent;
  try {
    await navigator.clipboard.writeText(code);
    $("ref-feedback").textContent = "Código demonstrativo copiado. Ele ainda não rastreia cadastros nem gera comissão.";
  } catch {
    $("ref-feedback").textContent = "Seu código é RP-DEMO-2026. Selecione e copie manualmente. Ainda não rastreia cadastros.";
  }
});
$("share-ref").addEventListener("click", async () => {
  const invite = {title:"Recompensa Pix", text:"Conheça o protótipo Recompensa Pix. Atenção: ainda é uma demonstração e não paga dinheiro.", url:location.href.split("?")[0] + "?ref=RP-DEMO-2026"};
  if (navigator.share) {
    try { await navigator.share(invite); } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(invite.url);
      $("ref-feedback").textContent = "Link demonstrativo copiado. O rastreamento de indicação ainda não está conectado.";
    } catch {
      $("ref-feedback").textContent = invite.url + " — link demonstrativo, sem rastreamento real.";
    }
  }
});
function openInfo(title, text) {
  $("dialog-title").textContent = title;
  $("dialog-text").textContent = text;
  $("info-dialog").showModal();
}
$("close-dialog").addEventListener("click", () => $("info-dialog").close());
renderQuestion();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

import { useState, useEffect, useRef } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const C = {
  bg:"#0A0A0A", surface:"#0F0F0F", card:"#141414", card2:"#1A1A1A",
  border:"#202020", accent:"#66FFF0", accent2:"#00D4C8",
  accentDim:"rgba(102,255,240,0.12)", green:"#22c55e", purple:"#a78bfa",
  text:"#FFFFFF", muted:"#666666", lgray:"#BBBBBB", glow:"rgba(102,255,240,0.15)",
  red:"#ef4444", orange:"#f97316",
};

// ── STORAGE ───────────────────────────────────────────────────────────────────
function salvar(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}
function carregar(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}

// ── AI ────────────────────────────────────────────────────────────────────────
async function perguntarIA(msg, tipo, usuario) {
  try {
    const sistema = tipo === "treino"
      ? `Você é um personal trainer especialista do app IRONCUT 21D. Perfil: ${usuario.nome}, ${usuario.idade} anos, ${usuario.peso}kg, objetivo: ${usuario.objetivo}, nível: ${usuario.nivel}, local: ${usuario.local}. Responda em português, de forma prática e motivadora. Máximo 200 palavras.`
      : `Você é uma nutricionista especialista do app IRONCUT 21D. Perfil: ${usuario.nome}, ${usuario.idade} anos, ${usuario.peso}kg, objetivo: ${usuario.objetivo}. Responda em português, de forma prática e motivadora. Máximo 200 palavras.`;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: sistema + "\n\nMensagem: " + msg }]
      })
    });
    const d = await res.json();
    const txt = d?.content?.[0]?.text;
    if (!txt) throw new Error("sem resposta");
    return txt;
  } catch(e) {
    return "Não consegui processar. Tente novamente.";
  }
}

// ── PROTOCOL GENERATOR ────────────────────────────────────────────────────────
function gerarProtocolo(perfil) {
  const isCasa = perfil.local === "Casa";
  const isFem = perfil.sexo === "Feminino";

  const treinoAcad = {
    SEG: { nome:"Peito + Tríceps", exercicios:[
      {n:"Supino Reto",s:4,r:"8-12",carga:0},{n:"Supino Inclinado",s:4,r:"10-12",carga:0},
      {n:"Crucifixo",s:3,r:"12-15",carga:0},{n:"Tríceps Corda",s:4,r:"12-15",carga:0},
      {n:"Tríceps Testa",s:3,r:"12-15",carga:0}
    ]},
    TER: { nome:"Costas + Bíceps", exercicios:[
      {n:"Puxada Alta",s:4,r:"8-12",carga:0},{n:"Remada Curvada",s:4,r:"8-12",carga:0},
      {n:"Remada Unilateral",s:3,r:"10-12",carga:0},{n:"Rosca Direta",s:4,r:"12-15",carga:0},
      {n:"Rosca Martelo",s:3,r:"12-15",carga:0}
    ]},
    QUA: { nome:"Cardio + Core", exercicios:[
      {n:"Esteira 30min",s:1,r:"30min",carga:0},{n:"Prancha",s:4,r:"45s",carga:0},
      {n:"Abdominal",s:4,r:"20",carga:0},{n:"Elevação de Pernas",s:3,r:"15",carga:0},
      {n:"Mountain Climber",s:3,r:"30s",carga:0}
    ]},
    QUI: { nome:"Ombro + Trapézio", exercicios:[
      {n:"Desenvolvimento",s:4,r:"8-12",carga:0},{n:"Elevação Lateral",s:4,r:"15",carga:0},
      {n:"Elevação Frontal",s:3,r:"12",carga:0},{n:"Encolhimento",s:4,r:"15",carga:0},
      {n:"Remada Alta",s:3,r:"12",carga:0}
    ]},
    SEX: { nome:"Pernas", exercicios:[
      {n:"Agachamento Livre",s:4,r:"8-12",carga:0},{n:"Leg Press",s:4,r:"12-15",carga:0},
      {n:"Cadeira Extensora",s:4,r:"15",carga:0},{n:"Mesa Flexora",s:4,r:"12",carga:0},
      {n:"Panturrilha",s:4,r:"20",carga:0}
    ]},
    SAB: { nome:"HIIT + Mobilidade", exercicios:[
      {n:"Burpee",s:4,r:"15",carga:0},{n:"Agachamento Jump",s:4,r:"20",carga:0},
      {n:"Flexão",s:3,r:"15",carga:0},{n:"Polichinelo",s:3,r:"60s",carga:0},
      {n:"Corrida Estac.",s:5,r:"20s",carga:0}
    ]},
    DOM: { nome:"Descanso Ativo", exercicios:[
      {n:"Caminhada Leve",s:1,r:"30min",carga:0},{n:"Alongamento",s:1,r:"20min",carga:0},
      {n:"Foam Roller",s:1,r:"15min",carga:0}
    ]}
  };

  const treinoCasa = {
    SEG: { nome:"Upper A", exercicios:[
      {n:"Flexão",s:4,r:"15",carga:0},{n:"Flexão Diamante",s:3,r:"12",carga:0},
      {n:"Flexão Inclinada",s:3,r:"15",carga:0},{n:"Tríceps no Banco",s:4,r:"12",carga:0},
      {n:"Superman",s:3,r:"15",carga:0}
    ]},
    TER: { nome:"Lower A", exercicios:[
      {n:"Agachamento",s:4,r:"20",carga:0},{n:"Agachamento Sumô",s:3,r:"20",carga:0},
      {n:"Avanço",s:3,r:"12 p/lado",carga:0},{n:"Elevação Pélvica",s:4,r:"20",carga:0},
      {n:"Panturrilha",s:4,r:"25",carga:0}
    ]},
    QUA: { nome:"Cardio + Core", exercicios:[
      {n:"Burpee",s:4,r:"15",carga:0},{n:"Prancha",s:4,r:"45s",carga:0},
      {n:"Mountain Climber",s:4,r:"30s",carga:0},{n:"Abdominal Bicicleta",s:3,r:"20",carga:0},
      {n:"Polichinelo",s:3,r:"60s",carga:0}
    ]},
    QUI: { nome:"Upper B", exercicios:[
      {n:"Flexão Wide",s:4,r:"15",carga:0},{n:"Dip no Banco",s:4,r:"12",carga:0},
      {n:"Prancha Lateral",s:3,r:"30s",carga:0},{n:"Superman",s:3,r:"15",carga:0},
      {n:"Flexão Pike",s:3,r:"10",carga:0}
    ]},
    SEX: { nome:"Lower B", exercicios:[
      {n:"Agachamento Jump",s:4,r:"20",carga:0},{n:"Stiff Unilateral",s:3,r:"12 p/lado",carga:0},
      {n:"Wall Squat",s:3,r:"45s",carga:0},{n:"Avanço Alternado",s:4,r:"12 p/lado",carga:0},
      {n:"Panturrilha",s:4,r:"25",carga:0}
    ]},
    SAB: { nome:"HIIT", exercicios:[
      {n:"Burpee",s:5,r:"15",carga:0},{n:"Agachamento Jump",s:4,r:"20",carga:0},
      {n:"Mountain Climber",s:4,r:"30s",carga:0},{n:"Sprint Estac.",s:5,r:"20s",carga:0},
      {n:"Polichinelo",s:3,r:"60s",carga:0}
    ]},
    DOM: { nome:"Descanso Ativo", exercicios:[
      {n:"Caminhada",s:1,r:"30min",carga:0},{n:"Alongamento",s:1,r:"20min",carga:0}
    ]}
  };

  const treino = isCasa ? treinoCasa : treinoAcad;

  const kcal = perfil.objetivo === "Fat Loss" ? 1600 : perfil.objetivo === "Ganho Muscular" ? 2400 : 1900;
  const prot = Math.round(parseFloat(perfil.peso) * 1.8);
  const carb = Math.round((kcal * 0.4) / 4);
  const gord = Math.round((kcal * 0.25) / 9);

  const dieta = {
    calorias: kcal, proteina: prot + "g", carboidrato: carb + "g", gordura: gord + "g",
    refeicoes: perfil.objetivo === "Ganho Muscular" ? [
      {h:"07:00",n:"Café da Manhã",it:"5 ovos + 100g aveia + mel + 2 bananas + 300ml leite"},
      {h:"10:00",n:"Pré-Treino",it:"2 fatias pão integral + 4 col. pasta amendoim + 1 maçã"},
      {h:"13:00",n:"Almoço",it:"250g frango + 200g arroz integral + 150g feijão + salada"},
      {h:"16:00",n:"Lanche",it:"Whey 40g + leite + 50g castanhas + 2 bananas"},
      {h:"20:00",n:"Jantar",it:"300g carne bovina ou salmão + 200g batata-doce + legumes"},
      {h:"22:00",n:"Ceia",it:"200g iogurte grego + 30g pasta amendoim"}
    ] : [
      {h:"07:00",n:"Café da Manhã",it:"3 ovos + 1 fatia pão integral + 1 fruta + café sem açúcar"},
      {h:"10:00",n:"Lanche Manhã",it:"1 scoop whey + 1 banana"},
      {h:"13:00",n:"Almoço",it:"200g frango grelhado + 80g arroz integral + salada verde + azeite"},
      {h:"16:00",n:"Lanche Tarde",it:"150g iogurte grego + 30g granola"},
      {h:"19:00",n:"Jantar",it:"150g peixe ou carne vermelha magra + legumes + batata doce"},
      {h:"21:30",n:"Ceia",it:"200g cottage + 1 col. pasta de amendoim"}
    ]
  };

  return { treino, dieta };
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function BtnPrimary({ children, onClick, style = {}, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#333" : `linear-gradient(135deg,${C.accent},${C.accent2})`,
      color: disabled ? C.muted : "#000", border:"none", borderRadius:10,
      padding:"14px 28px", fontWeight:800, fontSize:15, cursor: disabled ? "not-allowed" : "pointer",
      width:"100%", boxShadow: disabled ? "none" : `0 4px 20px ${C.glow}`, ...style
    }}>{children}</button>
  );
}

function BtnOutline({ children, onClick, active = false, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: active ? C.accentDim : "transparent",
      color: active ? C.accent : C.lgray,
      border:`1.5px solid ${active ? C.accent : C.border}`,
      borderRadius:8, padding:"10px 20px", fontWeight:600, fontSize:13,
      cursor:"pointer", transition:"all 0.2s", ...style
    }}>{children}</button>
  );
}

function Input({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{marginBottom:16}}>
      {label && <div style={{color:C.lgray, fontSize:13, marginBottom:6, fontWeight:600}}>{label}</div>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:"100%", background:C.card2, border:`1.5px solid ${C.border}`,
          borderRadius:8, padding:"12px 14px", color:C.text, fontSize:14,
          outline:"none", boxSizing:"border-box"
        }}
      />
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────────────────────
function Landing({ onLogin, onCadastro }) {
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center",maxWidth:400,width:"100%"}}>
        <div style={{marginBottom:8}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:22,color:"#000",boxShadow:`0 0 32px ${C.glow}`}}>IC</div>
          <div style={{fontWeight:900,fontSize:26,letterSpacing:3,color:C.accent}}>IRONCUT 21D</div>
        </div>
        <h1 style={{fontSize:38,fontWeight:900,color:C.text,lineHeight:1.1,margin:"20px 0 8px"}}>
          TRANSFORME<br/><span style={{color:C.accent}}>SEU CORPO</span><br/>EM 21 DIAS
        </h1>
        <p style={{color:C.muted,fontSize:14,marginBottom:32,lineHeight:1.6}}>
          Protocolo personalizado de treino e dieta com Personal IA e Nutricionista IA.
        </p>
        <div style={{display:"flex",gap:8,marginBottom:28,justifyContent:"center",flexWrap:"wrap"}}>
          {["🔥 Fat Loss","💪 Hipertrofia","⚡ HIIT","🥗 Dieta IA"].map(t => (
            <span key={t} style={{background:C.accentDim,color:C.accent,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700}}>{t}</span>
          ))}
        </div>
        <BtnPrimary onClick={onCadastro}>COMEÇAR AGORA — GRÁTIS</BtnPrimary>
        <button onClick={onLogin} style={{marginTop:14,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>
          Já tenho conta → Entrar
        </button>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onSuccess, onVoltar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function entrar() {
    const contas = carregar("ic_contas", {});
    const u = contas[email];
    if (!u) return setErro("Conta não encontrada. Cadastre-se!");
    if (u.senha !== senha) return setErro("Senha incorreta.");
    onSuccess(u);
  }

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{marginBottom:28,textAlign:"center"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:18,color:"#000"}}>IC</div>
          <div style={{fontWeight:900,fontSize:18,letterSpacing:2,color:C.accent}}>IRONCUT</div>
        </div>
        <h2 style={{color:C.text,marginBottom:4}}>Entrar</h2>
        <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Bem-vindo de volta!</p>
        <Input label="E-mail" value={email} onChange={setEmail} type="email" placeholder="seu@email.com" />
        <Input label="Senha" value={senha} onChange={setSenha} type="password" placeholder="••••••••" />
        {erro && <div style={{color:C.red,fontSize:13,marginBottom:12}}>{erro}</div>}
        <BtnPrimary onClick={entrar}>ENTRAR</BtnPrimary>
        <button onClick={onVoltar} style={{marginTop:12,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",width:"100%"}}>← Voltar</button>
      </div>
    </div>
  );
}

// ── CADASTRO ──────────────────────────────────────────────────────────────────
function Cadastro({ onSuccess, onVoltar }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nome:"", email:"", senha:"", peso:"", altura:"", idade:"",
    sexo:"Masculino", objetivo:"Fat Loss", nivel:"Iniciante", local:"Academia"
  });
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  function finalizar() {
    const proto = gerarProtocolo(form);
    const u = {
      ...form,
      protocolo: proto,
      dia: 1,
      peso_inicial: parseFloat(form.peso),
      peso_historico: [{ data: new Date().toLocaleDateString("pt-BR"), peso: parseFloat(form.peso) }],
      agua_hoje: 0,
      agua_data: new Date().toLocaleDateString("pt-BR"),
      criado: new Date().toISOString()
    };
    const contas = carregar("ic_contas", {});
    contas[form.email] = u;
    salvar("ic_contas", contas);
    salvar("ic_sessao", form.email);
    onSuccess(u);
  }

  const opcaoBtn = (key, val, emoji, desc) => (
    <button key={val} onClick={() => set(key, val)} style={{
      background: form[key]===val ? C.accentDim : C.card2,
      border:`1.5px solid ${form[key]===val ? C.accent : C.border}`,
      borderRadius:10, padding:"14px 16px", cursor:"pointer", textAlign:"left",
      display:"flex", alignItems:"center", gap:12, width:"100%", marginBottom:8
    }}>
      <span style={{fontSize:24}}>{emoji}</span>
      <div>
        <div style={{color:form[key]===val?C.accent:C.text, fontWeight:700, fontSize:14}}>{val}</div>
        <div style={{color:C.muted, fontSize:12}}>{desc}</div>
      </div>
    </button>
  );

  const steps = [
    // 1 — Dados
    <div key={1}>
      <h2 style={{color:C.text,marginBottom:4}}>Crie sua conta</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:20}}>Seus dados pessoais</p>
      <Input label="Nome completo" value={form.nome} onChange={v => set("nome",v)} placeholder="André Marquini" />
      <Input label="E-mail" value={form.email} onChange={v => set("email",v)} type="email" placeholder="seu@email.com" />
      <Input label="Senha (mín. 6 caracteres)" value={form.senha} onChange={v => set("senha",v)} type="password" placeholder="••••••••" />
      <BtnPrimary onClick={() => form.nome && form.email && form.senha.length >= 6 && setStep(2)} disabled={!(form.nome && form.email && form.senha.length >= 6)}>Continuar →</BtnPrimary>
    </div>,
    // 2 — Biometria
    <div key={2}>
      <h2 style={{color:C.text,marginBottom:4}}>Sua biometria</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:20}}>Para calcular seu protocolo</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Input label="Peso (kg)" value={form.peso} onChange={v => set("peso",v)} type="number" placeholder="75" />
        <Input label="Altura (cm)" value={form.altura} onChange={v => set("altura",v)} type="number" placeholder="175" />
      </div>
      <Input label="Idade" value={form.idade} onChange={v => set("idade",v)} type="number" placeholder="28" />
      <div style={{marginBottom:16}}>
        <div style={{color:C.lgray,fontSize:13,marginBottom:8,fontWeight:600}}>Sexo</div>
        <div style={{display:"flex",gap:8}}>
          {["Masculino","Feminino"].map(s => (
            <BtnOutline key={s} onClick={() => set("sexo",s)} active={form.sexo===s} style={{flex:1}}>{s}</BtnOutline>
          ))}
        </div>
      </div>
      <BtnPrimary onClick={() => form.peso && form.altura && form.idade && setStep(3)} disabled={!(form.peso && form.altura && form.idade)}>Continuar →</BtnPrimary>
    </div>,
    // 3 — Objetivo
    <div key={3}>
      <h2 style={{color:C.text,marginBottom:4}}>Seu objetivo</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:20}}>O que você quer em 21 dias?</p>
      {opcaoBtn("objetivo","Fat Loss","🔥","Perder gordura e definir o corpo")}
      {opcaoBtn("objetivo","Ganho Muscular","💪","Ganhar massa muscular magra")}
      {opcaoBtn("objetivo","Condicionamento","⚡","Melhorar resistência e desempenho")}
      <BtnPrimary onClick={() => setStep(4)}>Continuar →</BtnPrimary>
    </div>,
    // 4 — Nível
    <div key={4}>
      <h2 style={{color:C.text,marginBottom:4}}>Seu nível</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:20}}>Quanto tempo treina?</p>
      {opcaoBtn("nivel","Iniciante","🌱","Menos de 6 meses treinando")}
      {opcaoBtn("nivel","Intermediário","💪","6 meses a 2 anos de treino")}
      {opcaoBtn("nivel","Avançado","🏆","Mais de 2 anos treinando")}
      <BtnPrimary onClick={() => setStep(5)}>Continuar →</BtnPrimary>
    </div>,
    // 5 — Local
    <div key={5}>
      <h2 style={{color:C.text,marginBottom:4}}>Onde treina?</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:20}}>Vamos adaptar os exercícios</p>
      {opcaoBtn("local","Academia","🏋️","Acesso a equipamentos completos")}
      {opcaoBtn("local","Casa","🏠","Treino com ou sem equipamentos")}
      {opcaoBtn("local","Ar Livre","🌳","Parques e espaços abertos")}
      <BtnPrimary onClick={finalizar}>🚀 GERAR MEU PROTOCOLO</BtnPrimary>
    </div>
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontWeight:900,fontSize:18,letterSpacing:2,color:C.accent}}>IRONCUT</div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:20}}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{flex:1,height:3,borderRadius:4,background:i<=step?C.accent:C.border,transition:"background 0.3s"}} />
          ))}
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:20}}>Passo {step} de 5</div>
        {steps[step-1]}
        {step > 1 && (
          <button onClick={() => setStep(s => s-1)} style={{marginTop:12,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",width:"100%"}}>← Voltar</button>
        )}
        {step === 1 && (
          <button onClick={onVoltar} style={{marginTop:12,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",width:"100%"}}>← Início</button>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ usuario, onUpdate }) {
  const diasSemana = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"];
  const hoje = diasSemana[new Date().getDay()];
  const treino = usuario.protocolo?.treino?.[hoje];
  const nomesDias = {DOM:"Domingo",SEG:"Segunda",TER:"Terça",QUA:"Quarta",QUI:"Quinta",SEX:"Sexta",SAB:"Sábado"};

  const pesoAtual = usuario.peso;
  const pesoInicial = usuario.peso_inicial || parseFloat(usuario.peso);
  const perdeu = (pesoInicial - parseFloat(pesoAtual)).toFixed(1);
  const dia = usuario.dia || 1;
  const prog = Math.min((dia / 21) * 100, 100);

  const mot = [
    {icon:"🔥",txt:"Disciplina é a ponte entre metas e conquistas."},
    {icon:"💪",txt:"O corpo conquista quando a mente acredita."},
    {icon:"⚡",txt:"Cada rep é um voto para a versão mais forte de você."},
    {icon:"🎯",txt:"Não existe atalho para um lugar que vale a pena estar."},
  ][new Date().getDay() % 4];

  return (
    <div style={{padding:"0 0 80px"}}>
      <div style={{background:`linear-gradient(135deg,${C.card},${C.card2})`,padding:"22px 18px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{color:C.muted,fontSize:13}}>Olá,</div>
        <div style={{color:C.text,fontSize:22,fontWeight:800,margin:"2px 0"}}>{usuario.nome?.split(" ")[0]} 👋</div>
        <div style={{color:C.accent,fontSize:13}}>Dia {dia} de 21 • {21-dia} dias restantes</div>
        <div style={{marginTop:14,background:C.bg,borderRadius:8,height:8,overflow:"hidden"}}>
          <div style={{width:`${prog}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},${C.accent2})`,borderRadius:8,transition:"width 0.5s"}} />
        </div>
        <div style={{color:C.muted,fontSize:12,marginTop:4}}>{prog.toFixed(0)}% completo</div>
      </div>

      <div style={{padding:"18px 16px"}}>
        {/* Motivacional */}
        <div style={{background:C.accentDim,border:`1px solid ${C.accent}33`,borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontSize:22,marginBottom:6}}>{mot.icon}</div>
          <div style={{color:C.text,fontSize:14,fontStyle:"italic",fontWeight:500}}>"{mot.txt}"</div>
          <div style={{color:C.accent,fontSize:11,marginTop:6}}>— IRONCUT</div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
          {[
            {l:"Peso Atual",v:`${pesoAtual}kg`,icon:"⚖️"},
            {l:"Perdeu",v:`${parseFloat(perdeu)>0?"-":""}${Math.abs(parseFloat(perdeu)).toFixed(1)}kg`,icon:"📉",c:parseFloat(perdeu)>0?C.green:C.text},
            {l:"Objetivo",v:usuario.objetivo?.split(" ")[0],icon:"🎯"},
          ].map(s => (
            <div key={s.l} style={{background:C.card,borderRadius:10,padding:"12px 10px",border:`1px solid ${C.border}`,textAlign:"center"}}>
              <div style={{fontSize:18}}>{s.icon}</div>
              <div style={{color:s.c||C.accent,fontWeight:700,fontSize:13,marginTop:4}}>{s.v}</div>
              <div style={{color:C.muted,fontSize:10}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Treino de hoje */}
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:14}}>
          <div style={{color:C.accent,fontWeight:700,fontSize:14,marginBottom:8}}>🏋️ Treino de Hoje — {nomesDias[hoje]}</div>
          {treino ? (
            <>
              <div style={{color:C.text,fontWeight:600,marginBottom:4}}>{treino.nome}</div>
              <div style={{color:C.muted,fontSize:13}}>{treino.exercicios?.length} exercícios • {hoje}</div>
            </>
          ) : (
            <div style={{color:C.muted,fontSize:13}}>Dia de descanso hoje! 🛌</div>
          )}
        </div>

        {/* Água */}
        <Hidratacao usuario={usuario} onUpdate={onUpdate} />

        {/* Peso */}
        <RegistrarPeso usuario={usuario} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

// ── HIDRATAÇÃO ────────────────────────────────────────────────────────────────
function Hidratacao({ usuario, onUpdate }) {
  const meta = 3000;
  const hoje = new Date().toLocaleDateString("pt-BR");
  const aguaData = usuario.agua_data;
  const atual = aguaData === hoje ? (usuario.agua_hoje || 0) : 0;
  const perc = Math.min((atual / meta) * 100, 100);

  function add(ml) {
    const novo = Math.min(atual + ml, meta);
    const u = { ...usuario, agua_hoje: novo, agua_data: hoje };
    onUpdate(u);
    const contas = carregar("ic_contas", {});
    contas[u.email] = u;
    salvar("ic_contas", contas);
    salvar("ic_sessao", u.email);
  }

  return (
    <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{color:C.accent,fontWeight:700,fontSize:14}}>💧 Hidratação</div>
        <div style={{color:C.text,fontWeight:700,fontSize:16}}>{atual}ml<span style={{color:C.muted,fontSize:12,fontWeight:400}}> / {meta}ml</span></div>
      </div>
      <div style={{background:C.bg,borderRadius:8,height:8,overflow:"hidden",marginBottom:12}}>
        <div style={{width:`${perc}%`,height:"100%",background:`linear-gradient(90deg,#3b82f6,#60a5fa)`,borderRadius:8,transition:"width 0.3s"}} />
      </div>
      <div style={{display:"flex",gap:8}}>
        {[200,300,500].map(ml => (
          <BtnOutline key={ml} onClick={() => add(ml)} style={{flex:1,fontSize:12,padding:"8px 4px"}}>+{ml}ml</BtnOutline>
        ))}
        {atual > 0 && <BtnOutline onClick={() => add(-atual)} style={{fontSize:11,padding:"8px 10px",color:C.red,borderColor:C.red}}>Reset</BtnOutline>}
      </div>
      {atual >= meta && <div style={{marginTop:8,color:C.green,fontSize:12,fontWeight:700,textAlign:"center"}}>✅ Meta atingida! Excelente!</div>}
    </div>
  );
}

// ── REGISTRAR PESO ────────────────────────────────────────────────────────────
function RegistrarPeso({ usuario, onUpdate }) {
  const [val, setVal] = useState("");

  function registrar() {
    if (!val || parseFloat(val) < 30 || parseFloat(val) > 250) return;
    const hist = [...(usuario.peso_historico || []), { data: new Date().toLocaleDateString("pt-BR"), peso: parseFloat(val) }];
    const u = { ...usuario, peso: parseFloat(val), peso_historico: hist };
    onUpdate(u);
    const contas = carregar("ic_contas", {});
    contas[u.email] = u;
    salvar("ic_contas", contas);
    setVal("");
  }

  return (
    <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:14}}>
      <div style={{color:C.accent,fontWeight:700,fontSize:14,marginBottom:10}}>⚖️ Registrar Peso</div>
      <div style={{display:"flex",gap:8}}>
        <input type="number" value={val} onChange={e => setVal(e.target.value)}
          placeholder={`Peso atual (${usuario.peso}kg)`}
          style={{flex:1,background:C.card2,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:14,outline:"none"}}
        />
        <BtnPrimary onClick={registrar} style={{width:"auto",padding:"10px 20px",fontSize:13}}>Salvar</BtnPrimary>
      </div>
      {(usuario.peso_historico?.length || 0) > 1 && (
        <div style={{marginTop:8,color:C.muted,fontSize:12}}>
          Anterior: {usuario.peso_historico.at(-2)?.peso}kg em {usuario.peso_historico.at(-2)?.data}
        </div>
      )}
    </div>
  );
}

// ── TREINOS ───────────────────────────────────────────────────────────────────
function Treinos({ usuario, onUpdate }) {
  const diasSemana = ["SEG","TER","QUA","QUI","SEX","SAB","DOM"];
  const hoje = diasSemana[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const [diaAtivo, setDiaAtivo] = useState(hoje);
  const treino = usuario.protocolo?.treino?.[diaAtivo];
  const nomesDias = {SEG:"Segunda",TER:"Terça",QUA:"Quarta",QUI:"Quinta",SEX:"Sexta",SAB:"Sábado",DOM:"Domingo"};

  function atualizarCarga(idx, val) {
    const u = JSON.parse(JSON.stringify(usuario));
    if (u.protocolo.treino[diaAtivo]?.exercicios[idx]) {
      u.protocolo.treino[diaAtivo].exercicios[idx].carga = parseFloat(val) || 0;
      onUpdate(u);
      const contas = carregar("ic_contas", {});
      contas[u.email] = u;
      salvar("ic_contas", contas);
    }
  }

  return (
    <div style={{padding:"0 0 80px"}}>
      <div style={{padding:"20px 16px 0"}}>
        <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:14}}>Protocolo de Treino</div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14}}>
          {diasSemana.map(d => (
            <button key={d} onClick={() => setDiaAtivo(d)} style={{
              background: diaAtivo===d ? C.accent : C.card,
              color: diaAtivo===d ? "#000" : C.lgray,
              border:`1px solid ${diaAtivo===d ? C.accent : C.border}`,
              borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap"
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"0 16px"}}>
        {treino ? (
          <>
            <div style={{color:C.accent,fontWeight:700,fontSize:15,marginBottom:14}}>
              {nomesDias[diaAtivo]} — {treino.nome}
            </div>
            {treino.exercicios?.map((ex, i) => (
              <div key={i} style={{background:C.card,borderRadius:10,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{color:C.text,fontWeight:600,fontSize:14}}>
                    <span style={{color:C.accent,marginRight:8,fontFamily:"monospace"}}>0{i+1}</span>{ex.n}
                  </div>
                  <div style={{color:C.muted,fontSize:12,background:C.card2,padding:"3px 10px",borderRadius:4}}>{ex.s}×{ex.r}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:C.muted,fontSize:12}}>CARGA:</span>
                  <input
                    type="number" value={ex.carga || 0}
                    onChange={e => atualizarCarga(i, e.target.value)}
                    style={{width:70,background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 8px",color:C.accent,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}
                  />
                  <span style={{color:C.muted,fontSize:12}}>kg</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{color:C.muted,textAlign:"center",padding:40,fontSize:14}}>Nenhum treino para {nomesDias[diaAtivo]}</div>
        )}
      </div>

      <IAChat
        tipo="treino"
        usuario={usuario}
        titulo="PERSONAL IA"
        placeholder="Ex: Não gosto de Leg Press, pode substituir?"
        sugestoes={[
          "Não gosto de Leg Press, pode substituir?",
          "Substitua Supino por exercício em casa",
          "Não tenho halteres, como adaptar?",
          "Exercício alternativo para Puxada Frente",
          "Quero focar mais em glúteos",
          "Como aumentar a intensidade do treino?",
        ]}
      />
    </div>
  );
}

// ── DIETA ─────────────────────────────────────────────────────────────────────
function Dieta({ usuario }) {
  const dieta = usuario.protocolo?.dieta;

  return (
    <div style={{padding:"0 0 80px"}}>
      <div style={{padding:"20px 16px"}}>
        <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:16}}>Plano Alimentar</div>

        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:16}}>
          <div style={{color:C.accent,fontWeight:700,marginBottom:12}}>📊 Metas Diárias</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {l:"Calorias",v:`${dieta?.calorias} kcal`,c:C.orange},
              {l:"Proteína",v:dieta?.proteina,c:C.accent},
              {l:"Carboidrato",v:dieta?.carboidrato,c:C.purple},
              {l:"Gordura",v:dieta?.gordura,c:C.green},
            ].map(m => (
              <div key={m.l} style={{background:C.card2,borderRadius:8,padding:12,textAlign:"center"}}>
                <div style={{color:m.c,fontWeight:800,fontSize:16}}>{m.v}</div>
                <div style={{color:C.muted,fontSize:12}}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {dieta?.refeicoes?.map((r, i) => (
          <div key={i} style={{background:C.card,borderRadius:10,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{color:C.accent,fontWeight:700,fontSize:14}}>{r.n}</div>
              <div style={{color:C.muted,fontSize:12}}>{r.h}</div>
            </div>
            <div style={{color:C.lgray,fontSize:13,lineHeight:1.5}}>{r.it}</div>
          </div>
        ))}
      </div>

      <IAChat
        tipo="dieta"
        usuario={usuario}
        titulo="NUTRICIONISTA IA"
        placeholder="Ex: Não gosto de frango, o que posso substituir?"
        sugestoes={[
          "Não gosto de frango, substitua por outra proteína",
          "Sou vegetariano, adapte minha dieta",
          "Opções de café da manhã rápido",
          "Como aumentar proteína sem carne",
          "Lanches saudáveis para levar ao trabalho",
          "O que comer pré-treino em 5 minutos?",
        ]}
      />
    </div>
  );
}

// ── IA CHAT ───────────────────────────────────────────────────────────────────
function IAChat({ tipo, usuario, titulo, placeholder, sugestoes }) {
  const nomeAluno = usuario.nome?.split(" ")[0] || "aluno";
  const [msgs, setMsgs] = useState([{
    de:"ia",
    texto:`Olá ${nomeAluno}! Sou seu ${tipo === "treino" ? "Personal" : "Nutricionista"} IA 💪 Posso substituir exercícios e o plano será ATUALIZADO automaticamente! É só pedir!`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  async function enviar(texto) {
    const msg = texto || input;
    if (!msg.trim() || loading) return;
    setInput("");
    const novasMsgs = [...msgs, {de:"user",texto:msg}];
    setMsgs(novasMsgs);
    setLoading(true);
    const resposta = await perguntarIA(msg, tipo, usuario);
    setMsgs([...novasMsgs, {de:"ia",texto:resposta}]);
    setLoading(false);
    setTimeout(() => endRef.current?.scrollIntoView({behavior:"smooth"}), 100);
  }

  return (
    <div style={{margin:"16px",background:C.card,borderRadius:14,border:`1.5px solid ${C.border}`,overflow:"hidden"}}>
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.accentDim,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:C.accent,fontWeight:800,fontSize:13}}>⚡ {titulo}</span>
        <span style={{color:C.muted,fontSize:11}}>Substitua exercícios e personalize seu treino</span>
      </div>

      <div style={{maxHeight:280,overflowY:"auto",padding:"12px 14px"}}>
        {msgs.map((m, i) => (
          <div key={i} style={{marginBottom:10,display:"flex",justifyContent:m.de==="user"?"flex-end":"flex-start"}}>
            {m.de === "ia" ? (
              <div style={{background:C.card2,borderRadius:"10px 10px 10px 0",padding:"10px 14px",maxWidth:"88%",color:C.text,fontSize:13,lineHeight:1.55,border:`1px solid ${C.border}`}}>
                {m.texto}
              </div>
            ) : (
              <div style={{background:C.accentDim,border:`1px solid ${C.accent}33`,borderRadius:"10px 10px 0 10px",padding:"10px 14px",maxWidth:"88%",color:C.text,fontSize:13}}>
                {m.texto}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{background:C.card2,borderRadius:"10px 10px 10px 0",padding:"10px 14px",width:50,border:`1px solid ${C.border}`}}>
            <span style={{color:C.accent,fontSize:16}}>...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{padding:"6px 12px 8px",display:"flex",gap:6,overflowX:"auto"}}>
        {sugestoes.slice(0,3).map(s => (
          <button key={s} onClick={() => enviar(s)} style={{
            background:C.card2, border:`1px solid ${C.border}`, borderRadius:20,
            padding:"5px 10px", color:C.lgray, fontSize:11, cursor:"pointer", whiteSpace:"nowrap"
          }}>{s}</button>
        ))}
      </div>

      <div style={{padding:"8px 12px 12px",display:"flex",gap:8,borderTop:`1px solid ${C.border}`}}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && enviar()}
          placeholder={placeholder}
          style={{flex:1,background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:13,outline:"none"}}
        />
        <button onClick={() => enviar()} disabled={loading} style={{
          background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
          color:"#000",border:"none",borderRadius:8,padding:"10px 16px",fontWeight:800,fontSize:13,cursor:"pointer",
          opacity:loading?0.6:1
        }}>ENVIAR</button>
      </div>
    </div>
  );
}

// ── PERFIL ────────────────────────────────────────────────────────────────────
function Perfil({ usuario, onLogout }) {
  const pesoInicial = usuario.peso_inicial || parseFloat(usuario.peso);
  const pesoAtual = parseFloat(usuario.peso);
  const perdeu = (pesoInicial - pesoAtual).toFixed(1);

  return (
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:20}}>Meu Perfil</div>

      <div style={{background:`linear-gradient(135deg,${C.accentDim},${C.card})`,borderRadius:14,padding:20,border:`1px solid ${C.accent}33`,marginBottom:20,textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#000"}}>
          {usuario.nome?.charAt(0).toUpperCase()}
        </div>
        <div style={{color:C.text,fontSize:18,fontWeight:800}}>{usuario.nome}</div>
        <div style={{color:C.muted,fontSize:13}}>{usuario.email}</div>
        <div style={{marginTop:8,color:C.accent,fontSize:13,fontWeight:600}}>{usuario.objetivo} • {usuario.nivel}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {l:"Peso Inicial",v:`${pesoInicial}kg`},
          {l:"Peso Atual",v:`${pesoAtual}kg`},
          {l:"Resultado",v:`${parseFloat(perdeu)>=0?"-":"+"} ${Math.abs(parseFloat(perdeu)).toFixed(1)}kg`,c:parseFloat(perdeu)>0?C.green:C.red},
          {l:"Dia Protocolo",v:`${usuario.dia || 1}/21`},
        ].map(s => (
          <div key={s.l} style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{color:s.c||C.accent,fontWeight:700,fontSize:18}}>{s.v}</div>
            <div style={{color:C.muted,fontSize:12}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`,marginBottom:20}}>
        <div style={{color:C.accent,fontWeight:700,marginBottom:10}}>📋 Dados</div>
        {[["Sexo",usuario.sexo],["Idade",`${usuario.idade} anos`],["Altura",`${usuario.altura}cm`],["Local",usuario.local]].map(([k,v]) => (
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.muted,fontSize:13}}>{k}</span>
            <span style={{color:C.text,fontSize:13,fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>

      {/* Histórico de peso */}
      {(usuario.peso_historico?.length || 0) > 1 && (
        <div style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`,marginBottom:20}}>
          <div style={{color:C.accent,fontWeight:700,marginBottom:10}}>📈 Histórico de Peso</div>
          {usuario.peso_historico.slice(-5).reverse().map((h, i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.muted,fontSize:13}}>{h.data}</span>
              <span style={{color:C.text,fontSize:13,fontWeight:600}}>{h.peso}kg</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onLogout} style={{width:"100%",background:"transparent",border:`1.5px solid ${C.red}`,borderRadius:10,padding:14,color:C.red,fontWeight:700,fontSize:14,cursor:"pointer"}}>
        Sair da Conta
      </button>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
function BottomNav({ aba, setAba }) {
  const itens = [
    {id:"dashboard",icon:"🏠",label:"Início"},
    {id:"treinos",icon:"🏋️",label:"Treinos"},
    {id:"dieta",icon:"🥗",label:"Dieta"},
    {id:"perfil",icon:"👤",label:"Perfil"},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,maxWidth:480,margin:"0 auto"}}>
      {itens.map(item => (
        <button key={item.id} onClick={() => setAba(item.id)} style={{
          flex:1, padding:"10px 4px", background:"transparent", border:"none", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", gap:2
        }}>
          <span style={{fontSize:20}}>{item.icon}</span>
          <span style={{fontSize:10,fontWeight:700,color:aba===item.id?C.accent:C.muted}}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tela, setTela] = useState("landing");
  const [usuario, setUsuario] = useState(null);
  const [aba, setAba] = useState("dashboard");

  // Restaurar sessão
  useEffect(() => {
    const email = carregar("ic_sessao");
    if (email) {
      const contas = carregar("ic_contas", {});
      if (contas[email]) {
        setUsuario(contas[email]);
        setTela("app");
      }
    }
  }, []);

  function atualizar(u) {
    setUsuario(u);
    const contas = carregar("ic_contas", {});
    contas[u.email] = u;
    salvar("ic_contas", contas);
  }

  function logout() {
    salvar("ic_sessao", null);
    setUsuario(null);
    setTela("landing");
  }

  if (tela === "landing") return <Landing onLogin={() => setTela("login")} onCadastro={() => setTela("cadastro")} />;
  if (tela === "login")   return <Login onSuccess={u => { atualizar(u); salvar("ic_sessao",u.email); setTela("app"); }} onVoltar={() => setTela("landing")} />;
  if (tela === "cadastro") return <Cadastro onSuccess={u => { setUsuario(u); setTela("app"); }} onVoltar={() => setTela("landing")} />;

  if (tela === "app" && usuario) {
    return (
      <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"system-ui,sans-serif",maxWidth:480,margin:"0 auto",position:"relative"}}>
        {aba === "dashboard" && <Dashboard usuario={usuario} onUpdate={atualizar} />}
        {aba === "treinos"   && <Treinos   usuario={usuario} onUpdate={atualizar} />}
        {aba === "dieta"     && <Dieta     usuario={usuario} />}
        {aba === "perfil"    && <Perfil    usuario={usuario} onLogout={logout} />}
        <BottomNav aba={aba} setAba={setAba} />
      </div>
    );
  }

  return null;
}

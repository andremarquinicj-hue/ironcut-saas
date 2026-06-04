import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// ── FIREBASE ──────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyExample",
  authDomain: "ironcut-21d.firebaseapp.com",
  projectId: "ironcut-21d",
  storageBucket: "ironcut-21d.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000000000000000"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch(e) {
  console.log("Firebase init error:", e.message);
}

// ── THEME ─────────────────────────────────────────────────────────────────────
const C = {
  bg:"#0A0A0A", surface:"#0F0F0F", card:"#141414", card2:"#1A1A1A",
  border:"#202020", accent:"#66FFF0", accent2:"#00D4C8",
  accentDim:"rgba(102,255,240,0.12)", green:"#22c55e", purple:"#a78bfa",
  text:"#FFFFFF", muted:"#666666", lgray:"#BBBBBB", glow:"rgba(102,255,240,0.15)",
  red:"#ef4444", orange:"#f97316",
};

// ── LOGO ──────────────────────────────────────────────────────────────────────
const LOGO = () => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#000",boxShadow:`0 0 16px ${C.glow}`}}>IC</div>
    <span style={{fontWeight:900,fontSize:20,letterSpacing:2,color:C.accent}}>IRONCUT</span>
  </div>
);

// ── AI FUNCTION ───────────────────────────────────────────────────────────────
async function perguntarIA(msg, tipo, perfil, protocolo) {
  try {
    const sistema = tipo === "treino"
      ? `Você é um personal trainer especialista do app IRONCUT 21D. Protocolo de 21 dias de perda de peso. Perfil do aluno: ${JSON.stringify(perfil)}. Protocolo atual: ${JSON.stringify(protocolo?.treino || {})}. Responda em português de forma motivadora, prática e direta. Máximo 200 palavras.`
      : `Você é uma nutricionista especialista do app IRONCUT 21D. Protocolo de 21 dias de perda de peso. Perfil do aluno: ${JSON.stringify(perfil)}. Protocolo atual: ${JSON.stringify(protocolo?.dieta || {})}. Responda em português de forma motivadora, prática e direta. Máximo 200 palavras.`;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [
          { role: "user", content: sistema + "\n\nMensagem do aluno: " + msg }
        ]
      })
    });
    const d = await res.json();
    const txt = d?.content?.[0]?.text;
    if (!txt) throw new Error("sem resposta");
    return { texto: txt };
  } catch(e) {
    return { texto: "Não consegui processar. Tente novamente." };
  }
}

// ── PROTOCOLS ─────────────────────────────────────────────────────────────────
function gerarProtocolo(perfil) {
  const { objetivo, nivel, local } = perfil;
  const treinos = {
    "Fat Loss": {
      SEG: { nome:"HIIT + Core", exercicios:[
        {n:"Burpee",s:4,r:"6-15",carga:0},{n:"Agachamento Jump",s:4,r:"4-20",carga:0},
        {n:"Flexão",s:4,r:"3-15",carga:0},{n:"Polichinelo",s:5,r:"5-60s",carga:0},
        {n:"Corrida Estac.",s:5,r:"5-20s",carga:0}
      ]},
      TER: { nome:"Membros Superiores", exercicios:[
        {n:"Supino Reto",s:4,r:"6-12",carga:0},{n:"Puxada Alta",s:4,r:"6-12",carga:0},
        {n:"Desenvolvimento",s:3,r:"8-12",carga:0},{n:"Rosca Direta",s:3,r:"10-15",carga:0},
        {n:"Tríceps Testa",s:3,r:"10-15",carga:0}
      ]},
      QUA: { nome:"Membros Inferiores", exercicios:[
        {n:"Agachamento Livre",s:4,r:"8-12",carga:0},{n:"Leg Press",s:4,r:"10-15",carga:0},
        {n:"Stiff",s:3,r:"10-12",carga:0},{n:"Cadeira Ext.",s:3,r:"12-15",carga:0},
        {n:"Panturrilha",s:4,r:"15-20",carga:0}
      ]},
      QUI: { nome:"Cardio Moderado", exercicios:[
        {n:"Esteira 40min",s:1,r:"40min",carga:0},{n:"Bicicleta 20min",s:1,r:"20min",carga:0},
        {n:"Abdominal",s:3,r:"20",carga:0}
      ]},
      SEX: { nome:"Full Body", exercicios:[
        {n:"Levantamento Terra",s:4,r:"6-10",carga:0},{n:"Agachamento",s:3,r:"8-12",carga:0},
        {n:"Remada Curvada",s:4,r:"8-12",carga:0},{n:"Supino Inclinado",s:3,r:"10-12",carga:0},
        {n:"Prancha",s:3,r:"45s",carga:0}
      ]},
      SAB: { nome:"HIIT Intenso", exercicios:[
        {n:"Burpee",s:5,r:"6-15",carga:0},{n:"Agachamento Jump",s:4,r:"4-20",carga:0},
        {n:"Mountain Climber",s:4,r:"30s",carga:0},{n:"Sprint Estac.",s:5,r:"20s",carga:0},
        {n:"Flexão Explosiva",s:3,r:"8-12",carga:0}
      ]},
      DOM: { nome:"Descanso Ativo", exercicios:[
        {n:"Caminhada Leve",s:1,r:"30min",carga:0},{n:"Alongamento",s:1,r:"20min",carga:0},
        {n:"Foam Roller",s:1,r:"15min",carga:0}
      ]}
    }
  };

  const dieta = {
    calorias: perfil.objetivo === "Fat Loss" ? 1600 : 2000,
    proteina: "160g",
    carboidrato: "120g",
    gordura: "55g",
    refeicoes: [
      {horario:"07:00",nome:"Café da Manhã",alimentos:"3 ovos mexidos + 1 fatia pão integral + 1 fruta"},
      {horario:"10:00",nome:"Lanche Manhã",alimentos:"1 scoop whey + 1 banana"},
      {horario:"13:00",nome:"Almoço",alimentos:"150g frango + 80g arroz integral + salada verde + legumes"},
      {horario:"16:00",nome:"Lanche Tarde",alimentos:"150g iogurte grego + 30g granola"},
      {horario:"19:00",nome:"Jantar",alimentos:"150g peixe ou carne vermelha magra + vegetais + batata doce"},
      {horario:"21:30",nome:"Ceia",alimentos:"200g cottage + 1 col. pasta de amendoim"}
    ]
  };

  return { treino: treinos["Fat Loss"] || treinos["Fat Loss"], dieta };
}

// ── SAVE/LOAD ─────────────────────────────────────────────────────────────────
async function salvarDados(uid, dados) {
  if (!db) return;
  try { await setDoc(doc(db, "usuarios", uid), dados, { merge: true }); } catch(e) {}
}

async function carregarDados(uid) {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "usuarios", uid));
    return snap.exists() ? snap.data() : null;
  } catch(e) { return null; }
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function BtnPrimary({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
      color:"#000", border:"none", borderRadius:10, padding:"14px 28px",
      fontWeight:700, fontSize:15, cursor:"pointer", width:"100%",
      boxShadow:`0 4px 20px ${C.glow}`, ...style
    }}>{children}</button>
  );
}

function BtnOutline({ children, onClick, style = {}, active = false }) {
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
      {label && <div style={{color:C.lgray,fontSize:13,marginBottom:6,fontWeight:600}}>{label}</div>}
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
        <LOGO />
        <div style={{marginTop:32,marginBottom:8}}>
          <span style={{fontSize:42,fontWeight:900,color:C.text,lineHeight:1.1}}>
            TRANSFORME<br/><span style={{color:C.accent}}>SEU CORPO</span><br/>EM 21 DIAS
          </span>
        </div>
        <p style={{color:C.muted,fontSize:15,marginBottom:36}}>
          Protocolo personalizado de treino e dieta com Personal IA e Nutricionista IA.
        </p>
        <div style={{display:"flex",gap:8,marginBottom:24,justifyContent:"center",flexWrap:"wrap"}}>
          {["🔥 Fat Loss","💪 Ganho Muscular","⚡ HIIT","🥗 Dieta Personalizada"].map(t => (
            <span key={t} style={{background:C.accentDim,color:C.accent,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600}}>{t}</span>
          ))}
        </div>
        <BtnPrimary onClick={onCadastro}>COMEÇAR AGORA — GRÁTIS</BtnPrimary>
        <button onClick={onLogin} style={{marginTop:14,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>
          Já tenho conta — Entrar
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

  async function entrar() {
    if (!email || !senha) return setErro("Preencha todos os campos.");
    const uid = btoa(email).replace(/=/g,"");
    const dados = await carregarDados(uid);
    if (!dados) return setErro("Conta não encontrada. Cadastre-se!");
    onSuccess({ uid, ...dados });
  }

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:380}}>
        <LOGO />
        <h2 style={{color:C.text,marginTop:28,marginBottom:4}}>Entrar</h2>
        <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Bem-vindo de volta!</p>
        <Input label="E-mail" value={email} onChange={setEmail} type="email" placeholder="seu@email.com" />
        <Input label="Senha" value={senha} onChange={setSenha} type="password" placeholder="••••••••" />
        {erro && <div style={{color:C.red,fontSize:13,marginBottom:12}}>{erro}</div>}
        <BtnPrimary onClick={entrar}>ENTRAR</BtnPrimary>
        <button onClick={onVoltar} style={{marginTop:14,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",width:"100%"}}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}

// ── CADASTRO ──────────────────────────────────────────────────────────────────
function Cadastro({ onSuccess, onVoltar }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nome:"", email:"", senha:"", peso:"", altura:"", idade:"",
    sexo:"Masculino", objetivo:"Fat Loss", nivel:"Iniciante",
    local:"Academia", restricoes:""
  });
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  async function finalizar() {
    const uid = btoa(form.email).replace(/=/g,"");
    const protocolo = gerarProtocolo(form);
    const dados = { ...form, uid, protocolo, dia: 1, peso_historico:[{data:new Date().toLocaleDateString("pt-BR"),peso:parseFloat(form.peso)}], agua_hoje:0, criado_em: new Date().toISOString() };
    await salvarDados(uid, dados);
    onSuccess({ uid, ...dados });
  }

  const steps = [
    // Step 1 — Nome e email
    <div key={1}>
      <h2 style={{color:C.text,marginBottom:4}}>Seu nome</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Vamos personalizar sua experiência</p>
      <Input label="Nome completo" value={form.nome} onChange={v => set("nome",v)} placeholder="André Marquini" />
      <Input label="E-mail" value={form.email} onChange={v => set("email",v)} type="email" placeholder="seu@email.com" />
      <Input label="Senha" value={form.senha} onChange={v => set("senha",v)} type="password" placeholder="Mínimo 6 caracteres" />
      <BtnPrimary onClick={() => form.nome && form.email && form.senha.length >= 6 && setStep(2)}>Continuar →</BtnPrimary>
    </div>,
    // Step 2 — Biometria
    <div key={2}>
      <h2 style={{color:C.text,marginBottom:4}}>Sua biometria</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Para calcular seu protocolo ideal</p>
      <Input label="Peso atual (kg)" value={form.peso} onChange={v => set("peso",v)} type="number" placeholder="75" />
      <Input label="Altura (cm)" value={form.altura} onChange={v => set("altura",v)} type="number" placeholder="175" />
      <Input label="Idade" value={form.idade} onChange={v => set("idade",v)} type="number" placeholder="28" />
      <div style={{marginBottom:16}}>
        <div style={{color:C.lgray,fontSize:13,marginBottom:8,fontWeight:600}}>Sexo</div>
        <div style={{display:"flex",gap:8}}>
          {["Masculino","Feminino"].map(s => (
            <BtnOutline key={s} onClick={() => set("sexo",s)} active={form.sexo===s} style={{flex:1}}>{s}</BtnOutline>
          ))}
        </div>
      </div>
      <BtnPrimary onClick={() => form.peso && form.altura && form.idade && setStep(3)}>Continuar →</BtnPrimary>
    </div>,
    // Step 3 — Objetivo
    <div key={3}>
      <h2 style={{color:C.text,marginBottom:4}}>Seu objetivo</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:24}}>O que você quer alcançar em 21 dias?</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {[["Fat Loss","🔥","Perder gordura e definir o corpo"],["Ganho Muscular","💪","Ganhar massa muscular magra"],["Condicionamento","⚡","Melhorar resistência e desempenho"]].map(([v,i,d]) => (
          <button key={v} onClick={() => set("objetivo",v)} style={{
            background: form.objetivo===v ? C.accentDim : C.card2,
            border:`1.5px solid ${form.objetivo===v ? C.accent : C.border}`,
            borderRadius:10,padding:"14px 16px",cursor:"pointer",textAlign:"left",
            display:"flex",alignItems:"center",gap:12
          }}>
            <span style={{fontSize:24}}>{i}</span>
            <div><div style={{color:form.objetivo===v?C.accent:C.text,fontWeight:700,fontSize:14}}>{v}</div><div style={{color:C.muted,fontSize:12}}>{d}</div></div>
          </button>
        ))}
      </div>
      <BtnPrimary onClick={() => setStep(4)}>Continuar →</BtnPrimary>
    </div>,
    // Step 4 — Nível
    <div key={4}>
      <h2 style={{color:C.text,marginBottom:4}}>Seu nível</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Quanto tempo treina regularmente?</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {[["Iniciante","🌱","Menos de 6 meses"],["Intermediário","💪","6 meses a 2 anos"],["Avançado","🏆","Mais de 2 anos"]].map(([v,i,d]) => (
          <button key={v} onClick={() => set("nivel",v)} style={{
            background: form.nivel===v ? C.accentDim : C.card2,
            border:`1.5px solid ${form.nivel===v ? C.accent : C.border}`,
            borderRadius:10,padding:"14px 16px",cursor:"pointer",textAlign:"left",
            display:"flex",alignItems:"center",gap:12
          }}>
            <span style={{fontSize:24}}>{i}</span>
            <div><div style={{color:form.nivel===v?C.accent:C.text,fontWeight:700,fontSize:14}}>{v}</div><div style={{color:C.muted,fontSize:12}}>{d}</div></div>
          </button>
        ))}
      </div>
      <BtnPrimary onClick={() => setStep(5)}>Continuar →</BtnPrimary>
    </div>,
    // Step 5 — Local
    <div key={5}>
      <h2 style={{color:C.text,marginBottom:4}}>Onde treina?</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Vamos adaptar os exercícios ao seu ambiente</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {[["Academia","🏋️","Acesso a equipamentos completos"],["Casa","🏠","Treino com ou sem equipamentos"],["Ar Livre","🌳","Parques, ruas e espaços abertos"]].map(([v,i,d]) => (
          <button key={v} onClick={() => set("local",v)} style={{
            background: form.local===v ? C.accentDim : C.card2,
            border:`1.5px solid ${form.local===v ? C.accent : C.border}`,
            borderRadius:10,padding:"14px 16px",cursor:"pointer",textAlign:"left",
            display:"flex",alignItems:"center",gap:12
          }}>
            <span style={{fontSize:24}}>{i}</span>
            <div><div style={{color:form.local===v?C.accent:C.text,fontWeight:700,fontSize:14}}>{v}</div><div style={{color:C.muted,fontSize:12}}>{d}</div></div>
          </button>
        ))}
      </div>
      <BtnPrimary onClick={() => setStep(6)}>Continuar →</BtnPrimary>
    </div>,
    // Step 6 — Restrições
    <div key={6}>
      <h2 style={{color:C.text,marginBottom:4}}>Alguma restrição?</h2>
      <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Lesões, alergias ou limitações alimentares</p>
      <div style={{marginBottom:16}}>
        <textarea
          value={form.restricoes}
          onChange={e => set("restricoes", e.target.value)}
          placeholder="Ex: tenho dor no joelho direito, sou intolerante à lactose... (ou deixe em branco)"
          rows={4}
          style={{width:"100%",background:C.card2,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"12px 14px",color:C.text,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box"}}
        />
      </div>
      <BtnPrimary onClick={finalizar}>🚀 GERAR MEU PROTOCOLO</BtnPrimary>
    </div>
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:400}}>
        <LOGO />
        <div style={{display:"flex",gap:4,margin:"20px 0"}}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{flex:1,height:3,borderRadius:4,background:i<=step?C.accent:C.border,transition:"background 0.3s"}} />
          ))}
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:20}}>Passo {step} de 6</div>
        {steps[step-1]}
        {step > 1 && (
          <button onClick={() => setStep(s => s-1)} style={{marginTop:12,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",width:"100%"}}>
            ← Voltar
          </button>
        )}
        {step === 1 && (
          <button onClick={onVoltar} style={{marginTop:12,background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",width:"100%"}}>
            ← Voltar para início
          </button>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ usuario, onUpdate }) {
  const diasPassados = usuario.dia || 1;
  const diasRestantes = 21 - diasPassados;
  const progresso = Math.min((diasPassados / 21) * 100, 100);
  const diasSemana = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"];
  const hoje = diasSemana[new Date().getDay()];

  const treino = usuario.protocolo?.treino?.[hoje];

  return (
    <div style={{padding:"0 0 80px"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.card} 0%,${C.card2} 100%)`,padding:"24px 20px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{color:C.muted,fontSize:13,marginBottom:4}}>Olá,</div>
        <div style={{color:C.text,fontSize:22,fontWeight:800}}>{usuario.nome?.split(" ")[0]} 👋</div>
        <div style={{color:C.accent,fontSize:13,marginTop:4}}>Dia {diasPassados} de 21 • {diasRestantes} dias restantes</div>
        <div style={{marginTop:14,background:C.bg,borderRadius:8,height:8,overflow:"hidden"}}>
          <div style={{width:`${progresso}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},${C.accent2})`,borderRadius:8,transition:"width 0.5s"}} />
        </div>
        <div style={{color:C.muted,fontSize:12,marginTop:4}}>{progresso.toFixed(0)}% completo</div>
      </div>

      <div style={{padding:"20px 16px"}}>
        {/* Stats rápidos */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {label:"Peso Atual",val:`${usuario.peso}kg`,icon:"⚖️"},
            {label:"Objetivo",val:usuario.objetivo,icon:"🎯"},
            {label:"Nível",val:usuario.nivel,icon:"📊"},
          ].map(s => (
            <div key={s.label} style={{background:C.card,borderRadius:10,padding:12,border:`1px solid ${C.border}`,textAlign:"center"}}>
              <div style={{fontSize:20}}>{s.icon}</div>
              <div style={{color:C.text,fontWeight:700,fontSize:13,marginTop:4}}>{s.val}</div>
              <div style={{color:C.muted,fontSize:11}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Treino de hoje */}
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{color:C.accent,fontWeight:700,fontSize:15}}>🏋️ Treino de Hoje</div>
            <div style={{color:C.muted,fontSize:12}}>{hoje}</div>
          </div>
          {treino ? (
            <>
              <div style={{color:C.text,fontWeight:600,marginBottom:8}}>{treino.nome}</div>
              <div style={{color:C.muted,fontSize:13}}>{treino.exercicios?.length} exercícios programados</div>
            </>
          ) : (
            <div style={{color:C.muted,fontSize:13}}>Nenhum treino programado para hoje</div>
          )}
        </div>

        {/* Hidratação */}
        <Hidratacao usuario={usuario} onUpdate={onUpdate} />

        {/* Registrar peso */}
        <RegistrarPeso usuario={usuario} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

// ── HIDRATAÇÃO ────────────────────────────────────────────────────────────────
function Hidratacao({ usuario, onUpdate }) {
  const meta = 3000;
  const atual = usuario.agua_hoje || 0;
  const perc = Math.min((atual / meta) * 100, 100);

  async function adicionar(ml) {
    const novo = Math.min((usuario.agua_hoje || 0) + ml, meta);
    const updated = { ...usuario, agua_hoje: novo };
    onUpdate(updated);
    await salvarDados(usuario.uid, { agua_hoje: novo });
  }

  return (
    <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:16}}>
      <div style={{color:C.accent,fontWeight:700,fontSize:15,marginBottom:12}}>💧 Hidratação Hoje</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{color:C.text,fontWeight:700,fontSize:18}}>{atual}ml</span>
        <span style={{color:C.muted,fontSize:13}}>meta: {meta}ml</span>
      </div>
      <div style={{background:C.bg,borderRadius:8,height:8,overflow:"hidden",marginBottom:12}}>
        <div style={{width:`${perc}%`,height:"100%",background:`linear-gradient(90deg,#3b82f6,#60a5fa)`,borderRadius:8,transition:"width 0.3s"}} />
      </div>
      <div style={{display:"flex",gap:8}}>
        {[200,300,500].map(ml => (
          <BtnOutline key={ml} onClick={() => adicionar(ml)} style={{flex:1,fontSize:12}}>+{ml}ml</BtnOutline>
        ))}
      </div>
    </div>
  );
}

// ── REGISTRAR PESO ────────────────────────────────────────────────────────────
function RegistrarPeso({ usuario, onUpdate }) {
  const [valor, setValor] = useState("");

  async function registrar() {
    if (!valor) return;
    const hist = [...(usuario.peso_historico || []), { data: new Date().toLocaleDateString("pt-BR"), peso: parseFloat(valor) }];
    const updated = { ...usuario, peso: parseFloat(valor), peso_historico: hist };
    onUpdate(updated);
    await salvarDados(usuario.uid, { peso: parseFloat(valor), peso_historico: hist });
    setValor("");
  }

  return (
    <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:16}}>
      <div style={{color:C.accent,fontWeight:700,fontSize:15,marginBottom:12}}>⚖️ Registrar Peso</div>
      <div style={{display:"flex",gap:8}}>
        <input
          type="number" value={valor} onChange={e => setValor(e.target.value)}
          placeholder={`${usuario.peso}kg atual`}
          style={{flex:1,background:C.card2,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:14,outline:"none"}}
        />
        <BtnPrimary onClick={registrar} style={{width:"auto",padding:"10px 20px"}}>Salvar</BtnPrimary>
      </div>
      {usuario.peso_historico && usuario.peso_historico.length > 1 && (
        <div style={{marginTop:10,color:C.muted,fontSize:12}}>
          Último: {usuario.peso_historico[usuario.peso_historico.length-2]?.peso}kg em {usuario.peso_historico[usuario.peso_historico.length-2]?.data}
        </div>
      )}
    </div>
  );
}

// ── TREINOS ───────────────────────────────────────────────────────────────────
function Treinos({ usuario, onUpdate }) {
  const diasSemana = ["SEG","TER","QUA","QUI","SEX","SAB","DOM"];
  const [diaAtivo, setDiaAtivo] = useState(diasSemana[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const treino = usuario.protocolo?.treino?.[diaAtivo];

  const nomesDias = { SEG:"Segunda",TER:"Terça",QUA:"Quarta",QUI:"Quinta",SEX:"Sexta",SAB:"Sábado",DOM:"Domingo" };

  async function atualizarCarga(idx, val) {
    const updated = { ...usuario };
    if (!updated.protocolo.treino[diaAtivo].exercicios[idx]) return;
    updated.protocolo.treino[diaAtivo].exercicios[idx].carga = parseFloat(val) || 0;
    onUpdate(updated);
    await salvarDados(usuario.uid, { protocolo: updated.protocolo });
  }

  return (
    <div style={{padding:"0 0 80px"}}>
      <div style={{padding:"20px 16px 0"}}>
        <div style={{color:C.text,fontSize:20,fontWeight:800,marginBottom:16}}>Protocolo de Treino</div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:16}}>
          {diasSemana.map(d => (
            <button key={d} onClick={() => setDiaAtivo(d)} style={{
              background: diaAtivo===d ? C.accent : C.card,
              color: diaAtivo===d ? "#000" : C.lgray,
              border:`1px solid ${diaAtivo===d ? C.accent : C.border}`,
              borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"0 16px"}}>
        {treino ? (
          <>
            <div style={{color:C.accent,fontWeight:700,fontSize:16,marginBottom:16}}>
              {nomesDias[diaAtivo]} — {treino.nome}
            </div>
            {treino.exercicios?.map((ex, i) => (
              <div key={i} style={{background:C.card,borderRadius:10,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{color:C.text,fontWeight:600,fontSize:14}}>
                    <span style={{color:C.accent,marginRight:8}}>0{i+1}</span>{ex.n}
                  </div>
                  <div style={{color:C.muted,fontSize:12}}>{ex.s}×{ex.r}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:C.muted,fontSize:12}}>CARGA:</span>
                  <input
                    type="number" value={ex.carga || 0}
                    onChange={e => atualizarCarga(i, e.target.value)}
                    style={{width:70,background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 8px",color:C.text,fontSize:13,outline:"none"}}
                  />
                  <span style={{color:C.muted,fontSize:12}}>kg</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{color:C.muted,textAlign:"center",padding:40}}>Nenhum treino para {nomesDias[diaAtivo]}</div>
        )}
      </div>

      {/* Personal IA */}
      <IAChat tipo="treino" usuario={usuario} titulo="PERSONAL IA" placeholder="Ex: Não gosto de agachamento, o que posso substituir?" sugestoes={["Não gosto de Leg Press, pode substituir?","Substitua Supino Reto por exercício em casa","Não tenho halteres, como adaptar?","Exercício alternativo para Puxada Frente","Quero focar mais em glúteos","Como aumentar a intensidade do treino?"]} />
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

        {/* Macros */}
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16,marginBottom:16}}>
          <div style={{color:C.accent,fontWeight:700,marginBottom:12}}>📊 Metas Diárias</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {label:"Calorias",val:`${dieta?.calorias} kcal`,color:C.orange},
              {label:"Proteína",val:dieta?.proteina,color:C.accent},
              {label:"Carboidrato",val:dieta?.carboidrato,color:C.purple},
              {label:"Gordura",val:dieta?.gordura,color:C.green},
            ].map(m => (
              <div key={m.label} style={{background:C.card2,borderRadius:8,padding:12,textAlign:"center"}}>
                <div style={{color:m.color,fontWeight:700,fontSize:16}}>{m.val}</div>
                <div style={{color:C.muted,fontSize:12}}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Refeições */}
        {dieta?.refeicoes?.map((r, i) => (
          <div key={i} style={{background:C.card,borderRadius:10,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{color:C.accent,fontWeight:700,fontSize:14}}>{r.nome}</div>
              <div style={{color:C.muted,fontSize:12}}>{r.horario}</div>
            </div>
            <div style={{color:C.lgray,fontSize:13}}>{r.alimentos}</div>
          </div>
        ))}
      </div>

      {/* Nutricionista IA */}
      <IAChat tipo="dieta" usuario={usuario} titulo="NUTRICIONISTA IA" placeholder="Ex: Não gosto de frango, o que posso substituir?" sugestoes={["Substitua o frango por outra proteína","Sou vegetariano, adapte minha dieta","Opções de café da manhã rápido","Como aumentar a proteína sem carne","Substituto para whey protein","Lanches saudáveis para levar ao trabalho"]} />
    </div>
  );
}

// ── IA CHAT ───────────────────────────────────────────────────────────────────
function IAChat({ tipo, usuario, titulo, placeholder, sugestoes }) {
  const [msgs, setMsgs] = useState([
    { de:"ia", texto:`Olá ${usuario.nome?.split(" ")[0]}! Sou seu ${tipo === "treino" ? "Personal" : "Nutricionista"} IA 💪 Posso substituir exercícios e o plano será ATUALIZADO automaticamente! É só pedir!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  async function enviar(texto) {
    const msg = texto || input;
    if (!msg.trim()) return;
    setInput("");
    setMsgs(m => [...m, { de:"user", texto:msg }]);
    setLoading(true);
    const resp = await perguntarIA(msg, tipo, usuario, usuario.protocolo);
    setMsgs(m => [...m, { de:"ia", texto:resp.texto }]);
    setLoading(false);
    setTimeout(() => ref.current?.scrollIntoView({ behavior:"smooth" }), 100);
  }

  return (
    <div style={{margin:"16px",background:C.card,borderRadius:14,border:`1.5px solid ${C.border}`,overflow:"hidden"}}>
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.accentDim}}>
        <span style={{color:C.accent,fontWeight:800,fontSize:13}}>⚡ {titulo}</span>
        <span style={{color:C.muted,fontSize:11}}>Substitua exercícios e personalize seu treino</span>
      </div>
      <div style={{maxHeight:300,overflowY:"auto",padding:16}}>
        {msgs.map((m, i) => (
          <div key={i} style={{marginBottom:12,display:"flex",justifyContent:m.de==="user"?"flex-end":"flex-start"}}>
            {m.de==="ia" ? (
              <div style={{background:C.card2,borderRadius:"12px 12px 12px 0",padding:"10px 14px",maxWidth:"85%",color:C.text,fontSize:13,lineHeight:1.5}}>{m.texto}</div>
            ) : (
              <div style={{background:C.accentDim,border:`1px solid ${C.accent}33`,borderRadius:"12px 12px 0 12px",padding:"10px 14px",maxWidth:"85%",color:C.text,fontSize:13}}>{m.texto}</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{background:C.card2,borderRadius:"12px 12px 12px 0",padding:"10px 14px",width:60,color:C.accent,fontSize:18}}>...</div>
        )}
        <div ref={ref} />
      </div>
      {/* Sugestões */}
      <div style={{padding:"0 12px 8px",display:"flex",gap:6,overflowX:"auto"}}>
        {sugestoes.slice(0,3).map(s => (
          <button key={s} onClick={() => enviar(s)} style={{
            background:C.card2,border:`1px solid ${C.border}`,borderRadius:20,
            padding:"6px 12px",color:C.lgray,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"
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
        <button onClick={() => enviar()} style={{
          background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
          color:"#000",border:"none",borderRadius:8,padding:"10px 16px",fontWeight:700,fontSize:13,cursor:"pointer"
        }}>ENVIAR</button>
      </div>
    </div>
  );
}

// ── PERFIL ────────────────────────────────────────────────────────────────────
function Perfil({ usuario, onLogout }) {
  const pesoInicial = usuario.peso_historico?.[0]?.peso || usuario.peso;
  const pesoAtual = usuario.peso;
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

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {label:"Peso Inicial",val:`${pesoInicial}kg`},
          {label:"Peso Atual",val:`${pesoAtual}kg`},
          {label:"Perdeu",val:`${perdeu}kg`,color:parseFloat(perdeu)>0?C.green:C.text},
          {label:"Dia do Protocolo",val:`${usuario.dia || 1}/21`},
        ].map(s => (
          <div key={s.label} style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{color:s.color||C.accent,fontWeight:700,fontSize:18}}>{s.val}</div>
            <div style={{color:C.muted,fontSize:12}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`,marginBottom:20}}>
        <div style={{color:C.accent,fontWeight:700,marginBottom:8}}>📋 Dados do Perfil</div>
        {[
          ["Sexo",usuario.sexo],["Idade",`${usuario.idade} anos`],
          ["Altura",`${usuario.altura}cm`],["Local de Treino",usuario.local],
        ].map(([k,v]) => (
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.muted,fontSize:13}}>{k}</span>
            <span style={{color:C.text,fontSize:13,fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>

      <button onClick={onLogout} style={{
        width:"100%",background:"transparent",border:`1.5px solid ${C.red}`,
        borderRadius:10,padding:14,color:C.red,fontWeight:700,fontSize:14,cursor:"pointer"
      }}>Sair da Conta</button>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function BottomNav({ aba, setAba }) {
  const itens = [
    {id:"dashboard",icon:"🏠",label:"Início"},
    {id:"treinos",icon:"🏋️",label:"Treinos"},
    {id:"dieta",icon:"🥗",label:"Dieta"},
    {id:"perfil",icon:"👤",label:"Perfil"},
  ];
  return (
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,
      background:C.surface,borderTop:`1px solid ${C.border}`,
      display:"flex",zIndex:100
    }}>
      {itens.map(item => (
        <button key={item.id} onClick={() => setAba(item.id)} style={{
          flex:1,padding:"10px 4px",background:"transparent",border:"none",cursor:"pointer",
          display:"flex",flexDirection:"column",alignItems:"center",gap:2
        }}>
          <span style={{fontSize:20}}>{item.icon}</span>
          <span style={{fontSize:10,fontWeight:600,color:aba===item.id?C.accent:C.muted}}>{item.label}</span>
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

  function atualizarUsuario(dados) {
    setUsuario(dados);
  }

  if (tela === "landing") {
    return <Landing onLogin={() => setTela("login")} onCadastro={() => setTela("cadastro")} />;
  }
  if (tela === "login") {
    return <Login onSuccess={u => { setUsuario(u); setTela("app"); }} onVoltar={() => setTela("landing")} />;
  }
  if (tela === "cadastro") {
    return <Cadastro onSuccess={u => { setUsuario(u); setTela("app"); }} onVoltar={() => setTela("landing")} />;
  }
  if (tela === "app" && usuario) {
    return (
      <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Inter',sans-serif",maxWidth:480,margin:"0 auto",position:"relative"}}>
        {aba === "dashboard" && <Dashboard usuario={usuario} onUpdate={atualizarUsuario} />}
        {aba === "treinos" && <Treinos usuario={usuario} onUpdate={atualizarUsuario} />}
        {aba === "dieta" && <Dieta usuario={usuario} />}
        {aba === "perfil" && <Perfil usuario={usuario} onLogout={() => { setUsuario(null); setTela("landing"); }} />}
        <BottomNav aba={aba} setAba={setAba} />
      </div>
    );
  }
  return null;
}

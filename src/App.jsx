import { useState, useEffect } from "react";

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const LOGO_SRC = "/logo.png";
// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0A0A0A",
  surface: "#0F0F0F",
  card:    "#141414",
  card2:   "#1A1A1A",
  border:  "#202020",
  accent:  "#66FFF0",
  accent2: "#00D4C8",
  accentDim:"rgba(102,255,240,0.12)",
  green:   "#22c55e",
  purple:  "#a78bfa",
  text:    "#FFFFFF",
  muted:   "#666666",
  lgray:   "#BBBBBB",
  glow:    "rgba(102,255,240,0.15)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap');`;

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: ${C.bg}; color: ${C.text}; font-family: 'Barlow', sans-serif; overflow-x: hidden; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: ${C.bg}; }
::-webkit-scrollbar-thumb { background: ${C.accent2}; border-radius: 2px; }

@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse   { 0%,100%{box-shadow:0 0 20px rgba(102,255,240,.35);transform:scale(1)} 50%{box-shadow:0 0 40px rgba(102,255,240,.65);transform:scale(1.015)} }
@keyframes pulseG  { 0%,100%{box-shadow:0 0 16px rgba(34,197,94,.35)} 50%{box-shadow:0 0 32px rgba(34,197,94,.65)} }
@keyframes glow    { 0%,100%{opacity:.07} 50%{opacity:.15} }
@keyframes slideIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
@keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes logoIn  { 0%{opacity:0;transform:scale(.85) translateY(20px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
@keyframes glowPulse { 0%,100%{filter:drop-shadow(0 0 24px #66FFF0) drop-shadow(0 0 60px #00D4C8) drop-shadow(0 0 100px rgba(102,255,240,.3))} 50%{filter:drop-shadow(0 0 48px #66FFF0) drop-shadow(0 0 120px #00D4C8) drop-shadow(0 0 180px rgba(102,255,240,.4))} }
@keyframes waterFill { from{width:0} to{width:var(--w)} }
@keyframes typing  { 0%,80%,100%{opacity:0} 40%{opacity:1} }

.landing { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:28px; position:relative; overflow:hidden; }
.land-glow { position:absolute; inset:0; background:radial-gradient(ellipse 65% 55% at 50% 55%, rgba(102,255,240,.07) 0%, transparent 70%); pointer-events:none; animation:glow 4s ease-in-out infinite; }
.land-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(102,255,240,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(102,255,240,.03) 1px,transparent 1px); background-size:48px 48px; pointer-events:none; }
.logo-wrap { position:relative; margin-bottom:24px; animation:logoIn .9s cubic-bezier(.34,1.56,.64,1) both; width:320px; height:320px; display:flex; align-items:center; justify-content:center; }
.logo-img  { width:400px; height:400px; object-fit:contain; animation:glowPulse 2.5s ease-in-out infinite; }
.logo-ring { position:absolute; inset:0; border-radius:50%; border:1px solid rgba(102,255,240,.2); animation:spin 8s linear infinite; }
.logo-ring2{ position:absolute; inset:-20px; border-radius:50%; border:1px dashed rgba(102,255,240,.1); animation:spin 14s linear infinite reverse; }
.land-brand { font-family:'Bebas Neue',cursive; font-size:36px; letter-spacing:8px; color:${C.text}; margin-bottom:6px; }
.land-brand span { color:${C.accent}; text-shadow:0 0 20px ${C.accent}; }
.land-badge { display:inline-flex; align-items:center; gap:6px; padding:6px 18px; border-radius:999px; border:1px solid rgba(102,255,240,.25); background:rgba(102,255,240,.06); font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:${C.accent}; margin-bottom:20px; }
.land-title { font-family:'Bebas Neue',cursive; font-size:clamp(48px,9vw,80px); line-height:.95; letter-spacing:2px; text-align:center; margin-bottom:6px; }
.land-title span { color:${C.accent}; text-shadow:0 0 30px rgba(102,255,240,.4); }
.land-sub  { font-size:12px; color:${C.muted}; text-align:center; letter-spacing:4px; text-transform:uppercase; margin-bottom:24px; }
.land-desc { font-size:15px; color:${C.lgray}; text-align:center; max-width:460px; line-height:1.7; margin-bottom:36px; }
.land-stats { display:flex; gap:28px; flex-wrap:wrap; justify-content:center; margin-bottom:36px; }
.land-stat-n { font-family:'Bebas Neue',cursive; font-size:34px; color:${C.accent}; line-height:1; text-shadow:0 0 16px rgba(102,255,240,.4); }
.land-stat-l { font-size:10px; color:${C.muted}; letter-spacing:2px; text-transform:uppercase; margin-top:2px; }
.land-btns  { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }

.btn { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:16px; letter-spacing:1.5px; text-transform:uppercase; padding:14px 30px; border-radius:7px; border:none; cursor:pointer; transition:all .2s; display:inline-flex; align-items:center; justify-content:center; gap:8px; }
.btn-accent { background:linear-gradient(135deg,${C.accent2},${C.accent}); color:#000; animation:pulse 2s ease-in-out infinite; font-weight:800; }
.btn-accent:hover { filter:brightness(1.1); }
.btn-green  { background:linear-gradient(135deg,#15803d,#16a34a); color:#fff; animation:pulseG 2s ease-in-out infinite; }
.btn-outline{ background:transparent; color:${C.lgray}; border:1px solid ${C.border}; }
.btn-outline:hover { border-color:${C.accent}; color:${C.accent}; }
.btn-sm { padding:10px 20px; font-size:13px; }

.modal { position:fixed; inset:0; background:rgba(0,0,0,.93); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; }
.modal-box { background:${C.card}; border:1px solid ${C.border}; border-radius:16px; max-width:540px; width:100%; max-height:92vh; overflow-y:auto; padding:32px; animation:fadeUp .4s ease; }

.cad-steps { display:flex; gap:6px; margin-bottom:24px; align-items:center; }
.cad-step-dot { flex:1; height:3px; border-radius:2px; background:${C.border}; transition:background .3s; }
.cad-step-dot.done { background:${C.accent}; }
.cad-title { font-family:'Bebas Neue',cursive; font-size:28px; letter-spacing:2px; margin-bottom:4px; }
.cad-title span { color:${C.accent}; }
.cad-sub   { font-size:13px; color:${C.muted}; margin-bottom:22px; }
.field { margin-bottom:14px; }
.field label { display:block; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${C.accent}; margin-bottom:6px; }
.field input,.field select { width:100%; padding:12px 14px; background:#0D0D0D; border:1px solid #222; border-radius:8px; color:#fff; font-family:'Barlow',sans-serif; font-size:14px; outline:none; transition:border-color .2s; }
.field input:focus,.field select:focus { border-color:${C.accent}; }
.field input::placeholder { color:#333; }
.field select option { background:#111; }
.fields-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.pill-group { display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
.pill { padding:8px 16px; border-radius:6px; border:1px solid ${C.border}; cursor:pointer; font-size:13px; font-weight:600; transition:all .2s; background:#0D0D0D; color:${C.lgray}; }
.pill.sel { border-color:${C.accent}; color:${C.accent}; background:rgba(102,255,240,.07); }
.goal-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:4px; }
.goal-card { padding:20px 16px; border-radius:12px; border:2px solid ${C.border}; cursor:pointer; text-align:center; transition:all .2s; background:#0D0D0D; }
.goal-card.sel-fat  { border-color:${C.accent}; background:rgba(102,255,240,.07); }
.goal-card.sel-mass { border-color:${C.purple}; background:rgba(167,139,250,.07); }
.goal-card .gi { font-size:32px; margin-bottom:8px; }
.goal-card .gn { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:15px; text-transform:uppercase; letter-spacing:1px; }
.goal-card .gd { font-size:12px; color:${C.muted}; margin-top:4px; }
.check-group { display:flex; flex-direction:column; gap:8px; }
.check-item { display:flex; align-items:center; gap:10px; font-size:14px; color:${C.lgray}; cursor:pointer; }
.check-item input { accent-color:${C.accent}; width:16px; height:16px; }
.cad-nav { display:flex; gap:10px; margin-top:20px; }
.imc-result { background:rgba(102,255,240,.06); border:1px solid rgba(102,255,240,.2); border-radius:10px; padding:16px; margin-top:14px; }
.imc-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:13px; }
.imc-val { font-family:'Bebas Neue',cursive; font-size:28px; color:${C.accent}; line-height:1; }

.app-wrap { display:flex; min-height:100vh; }
.sidebar { width:220px; background:${C.surface}; border-right:1px solid ${C.border}; display:flex; flex-direction:column; padding:24px 0; flex-shrink:0; }
.slogo-wrap { padding:0 20px; margin-bottom:28px; display:flex; align-items:center; gap:10px; }
.slogo-img  { width:38px; height:38px; object-fit:contain; filter:drop-shadow(0 0 8px ${C.accent}); }
.slogo-text { font-family:'Bebas Neue',cursive; font-size:20px; letter-spacing:3px; color:${C.text}; }
.slogo-text span { color:${C.accent}; }
.navbtn { display:flex; align-items:center; gap:10px; padding:13px 20px; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; letter-spacing:1.5px; text-transform:uppercase; color:${C.muted}; background:none; border:none; cursor:pointer; transition:all .2s; text-align:left; width:100%; }
.navbtn:hover { color:${C.text}; background:rgba(255,255,255,.03); }
.navbtn.on { color:${C.accent}; background:rgba(102,255,240,.07); border-left:2px solid ${C.accent}; }
.sbottom { margin-top:auto; padding:16px 20px; font-size:12px; color:${C.muted}; border-top:1px solid ${C.border}; line-height:1.6; }
.mcontent { flex:1; overflow-y:auto; padding:32px; }
.mob-header { display:none; }
.mob-nav { display:none; }

.sec-label { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:${C.accent}; margin-bottom:6px; }
.sec-title { font-family:'Bebas Neue',cursive; font-size:34px; letter-spacing:1px; margin-bottom:20px; }

.card { background:${C.card}; border:1px solid ${C.border}; border-radius:12px; }
.card-accent { background:${C.card}; border:1px solid rgba(102,255,240,.2); border-radius:12px; }

.dash-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:20px; }
.dc { padding:18px 20px; }
.dc .dc-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${C.muted}; margin-bottom:4px; }
.dc .dc-val   { font-family:'Bebas Neue',cursive; font-size:38px; color:${C.accent}; line-height:1; text-shadow:0 0 16px rgba(102,255,240,.3); }
.dc .dc-sub   { font-size:11px; color:${C.muted}; margin-top:4px; }
.prog-wrap { height:8px; background:#1a1a1a; border-radius:4px; overflow:hidden; margin:10px 0 6px; }
.prog-fill { height:100%; background:linear-gradient(90deg,${C.accent2},${C.accent}); border-radius:4px; transition:width .8s ease; }
.chart-wrap { position:relative; height:150px; }
.weight-form { display:flex; gap:8px; margin-top:14px; }
.weight-form input { flex:1; padding:10px 14px; background:#0D0D0D; border:1px solid #222; border-radius:7px; color:#fff; font-family:'Barlow',sans-serif; font-size:14px; outline:none; }
.weight-form input:focus { border-color:${C.accent}; }
.weight-form button { padding:10px 20px; background:${C.accent}; color:#000; border:none; border-radius:7px; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:13px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; }

.motiv-card { padding:20px 22px; margin-bottom:18px; position:relative; overflow:hidden; }
.motiv-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(102,255,240,.06),transparent); pointer-events:none; }
.motiv-icon { font-size:28px; margin-bottom:8px; }
.motiv-text { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:18px; line-height:1.3; color:${C.text}; }
.motiv-author { font-size:11px; color:${C.muted}; margin-top:6px; letter-spacing:1px; }

.water-section { padding:20px 22px; margin-bottom:18px; }
.water-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.water-title  { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:16px; text-transform:uppercase; letter-spacing:1px; }
.water-meta   { font-size:12px; color:${C.muted}; }
.water-bar-bg { height:10px; background:#1a1a1a; border-radius:5px; overflow:hidden; margin-bottom:12px; }
.water-bar-fill { height:100%; background:linear-gradient(90deg,${C.accent2},${C.accent}); border-radius:5px; transition:width .5s ease; box-shadow:0 0 10px rgba(102,255,240,.3); }
.water-bottles { display:flex; gap:8px; flex-wrap:wrap; }
.bottle { display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; transition:transform .2s; }
.bottle:hover { transform:scale(1.1); }
.bottle-icon { font-size:26px; filter:grayscale(1) opacity(.35); transition:all .3s; }
.bottle-icon.full { filter:none; }
.bottle-label { font-size:9px; color:${C.muted}; letter-spacing:1px; text-transform:uppercase; }
.water-total  { font-family:'Bebas Neue',cursive; font-size:22px; color:${C.accent}; margin-top:8px; text-align:center; }

.macro-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
.macro-card { padding:14px; text-align:center; border-radius:10px; }
.macro-val  { font-family:'Bebas Neue',cursive; font-size:26px; color:${C.accent}; line-height:1; }
.macro-label{ font-size:10px; text-transform:uppercase; letter-spacing:2px; color:${C.muted}; margin-top:3px; }

.week-grid { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
.wcard { padding:0; border-radius:12px; overflow:hidden; }
.wcard-n    { font-family:'Bebas Neue',cursive; font-size:36px; color:${C.accent}; line-height:1; }
.wcard-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:14px; text-transform:uppercase; margin:4px 0 2px; letter-spacing:.5px; }
.wcard-desc { font-size:11px; color:${C.muted}; }
.treino-list { border-radius:12px; overflow:hidden; margin-bottom:20px; }
.treino-item { display:flex; align-items:center; gap:14px; padding:13px 18px; border-bottom:1px solid ${C.border}; transition:background .2s; }
.treino-item:last-child { border-bottom:none; }
.treino-item:hover { background:rgba(102,255,240,.04); }
.treino-num  { font-family:'Bebas Neue',cursive; font-size:17px; color:${C.accent}; min-width:24px; }
.treino-name { flex:1; font-size:14px; color:${C.text}; }
.treino-sets { font-size:11px; font-weight:700; color:${C.muted}; background:#1a1a1a; padding:3px 10px; border-radius:4px; }
.carga-row { display:flex; align-items:center; gap:8px; padding:8px 18px 12px; border-bottom:1px solid ${C.border}; background:rgba(102,255,240,.02); }
.carga-label { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:${C.muted}; white-space:nowrap; }
.carga-input { width:80px; padding:6px 10px; background:#111; border:1px solid #2a2a2a; border-radius:6px; color:${C.accent}; font-family:'Bebas Neue',cursive; font-size:18px; outline:none; text-align:center; transition:border-color .2s; }
.carga-input:focus { border-color:${C.accent}; }
.carga-unit { font-size:11px; color:${C.muted}; }
.carga-hist { display:flex; gap:4px; flex-wrap:wrap; margin-top:4px; }
.carga-hist-item { font-size:10px; color:${C.muted}; background:#1a1a1a; padding:2px 7px; border-radius:3px; }

.food-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:6px; }
.food-item { display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px; border-radius:8px; border:2px solid ${C.border}; cursor:pointer; transition:all .2s; background:#0D0D0D; text-align:center; }
.food-item.sel { border-color:${C.accent}; background:rgba(102,255,240,.07); }
.food-item .fi { font-size:22px; line-height:1; }
.food-item .fn { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:${C.lgray}; line-height:1.2; }
.food-item.sel .fn { color:${C.accent}; }
@media(max-width:768px){ .food-grid{ grid-template-columns:repeat(3,1fr); } }

.meal-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:20px; }
.meal-card  { border-radius:12px; overflow:hidden; }
.meal-head  { padding:12px 16px; background:${C.card2}; border-bottom:1px solid ${C.border}; }
.meal-time  { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${C.accent}; margin-bottom:2px; }
.meal-name  { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:16px; text-transform:uppercase; }
.meal-body  { padding:12px 16px; }
.meal-item  { font-size:13px; color:${C.lgray}; padding:3px 0; display:flex; gap:8px; }
.meal-item::before { content:'—'; color:${C.accent}; font-size:10px; flex-shrink:0; }

.ia-section { border-radius:12px; overflow:hidden; margin-top:20px; }
.ia-header  { padding:14px 18px; background:${C.card2}; border-bottom:1px solid ${C.border}; display:flex; align-items:center; gap:10px; }
.ia-dot { width:8px; height:8px; border-radius:50%; background:${C.accent}; box-shadow:0 0 8px ${C.accent}; }
.ia-title   { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:14px; text-transform:uppercase; letter-spacing:1px; }
.ia-sub     { font-size:11px; color:${C.muted}; margin-left:auto; }
.chat-msgs  { padding:16px; max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; }
.cmsg { max-width:88%; font-size:13px; line-height:1.6; padding:10px 14px; border-radius:10px; animation:slideIn .3s ease; }
.cmsg.ai   { background:${C.card2}; color:${C.lgray}; border:1px solid ${C.border}; align-self:flex-start; }
.cmsg.user { background:rgba(102,255,240,.1); border:1px solid rgba(102,255,240,.2); color:${C.text}; align-self:flex-end; }
.cmsg.update { background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.25); color:#22c55e; align-self:flex-start; font-weight:600; }
.cmsg.typing span { display:inline-block; width:6px; height:6px; border-radius:50%; background:${C.muted}; margin:0 2px; animation:typing 1.2s ease-in-out infinite; }
.cmsg.typing span:nth-child(2) { animation-delay:.2s; }
.cmsg.typing span:nth-child(3) { animation-delay:.4s; }
.chips { display:flex; gap:8px; flex-wrap:wrap; padding:10px 16px; border-top:1px solid ${C.border}; }
.chip { padding:5px 12px; border-radius:20px; border:1px solid ${C.border}; font-size:12px; color:${C.muted}; cursor:pointer; transition:all .2s; background:#0D0D0D; }
.chip:hover { border-color:${C.accent}; color:${C.accent}; }
.chat-input-row { display:flex; gap:8px; padding:12px 16px; border-top:1px solid ${C.border}; }
.chat-input { flex:1; padding:10px 14px; background:#0D0D0D; border:1px solid #222; border-radius:7px; color:#fff; font-family:'Barlow',sans-serif; font-size:13px; outline:none; }
.chat-input:focus { border-color:${C.accent}; }
.chat-send  { padding:10px 18px; background:${C.accent}; color:#000; border:none; border-radius:7px; font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:13px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:filter .2s; }
.chat-send:hover { filter:brightness(1.1); }

.perfil-row { display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid ${C.border}; font-size:14px; }
.perfil-row:last-child { border-bottom:none; }
.pr-label { color:${C.muted}; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px; }
.pr-val   { color:${C.text}; font-weight:600; }
.badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:4px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; }
.badge-fat  { background:rgba(102,255,240,.1); border:1px solid rgba(102,255,240,.25); color:${C.accent}; }
.badge-mass { background:rgba(167,139,250,.1); border:1px solid rgba(167,139,250,.25); color:${C.purple}; }

@media(max-width:768px){
  .sidebar { display:none; }
  .mob-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:${C.surface}; border-bottom:1px solid ${C.border}; margin-bottom:14px; }
  .mob-nav { display:flex; justify-content:space-around; position:fixed; bottom:0; left:0; right:0; background:${C.surface}; border-top:1px solid ${C.border}; padding:6px 0 10px; z-index:50; }
  .mob-nav-btn { display:flex; flex-direction:column; align-items:center; gap:1px; font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:${C.muted}; cursor:pointer; padding:2px 6px; background:none; border:none; min-width:0; flex:1; }
  .mob-nav-btn.on { color:${C.accent}; }
  .mcontent { padding:14px 14px 72px; }
  .dash-grid { grid-template-columns:1fr 1fr; gap:10px; }
  .meal-grid { grid-template-columns:1fr; }
  .fields-row { grid-template-columns:1fr; }
}
`;

// ─── UTILS ────────────────────────────────────────────────────────────────────
const MOTIVS = [
  { text: "Disciplina é a ponte entre metas e conquistas.", author: "Jim Rohn", icon: "⚡" },
  { text: "O corpo conquista quando a mente acredita.", author: "IRONCUT", icon: "🧠" },
  { text: "Cada rep é um voto para a versão mais forte de você.", author: "James Clear", icon: "🏋️" },
  { text: "Não existe atalho para um lugar que vale a pena estar.", author: "IRONCUT", icon: "🔥" },
  { text: "Seu único limite é o que você aceita como limite.", author: "IRONCUT", icon: "💪" },
  { text: "A dor de hoje é a força de amanhã.", author: "IRONCUT", icon: "⚔️" },
  { text: "Transformação exige desconforto. Sem exceção.", author: "IRONCUT", icon: "🌊" },
  { text: "Sucesso é a soma de pequenos esforços repetidos todos os dias.", author: "Robert Collier", icon: "✨" },
];

function getDayMotiv() { return MOTIVS[new Date().getDay() % MOTIVS.length]; }
function hoje() { const d=new Date(); return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`; }
function calcIMC(p,a){ const h=parseFloat(a)/100; return (parseFloat(p)/(h*h)).toFixed(1); }
function clsIMC(v){ if(v<18.5)return"Abaixo do peso"; if(v<25)return"Peso normal"; if(v<30)return"Sobrepeso"; if(v<35)return"Obesidade I"; if(v<40)return"Obesidade II"; return"Obesidade III"; }
function pesoIdeal(a,s){ const h=parseFloat(a)/100; return s==="feminino"?(21.5*h*h).toFixed(1):(23*h*h).toFixed(1); }
function aguaDia(p){ return Math.round(parseFloat(p)*35/1000*10)/10; }

const ATIVIDADE = {
  "Sedentário (quase sem exercício)":1.2,
  "Levemente ativo (1-2x/semana)":1.375,
  "Moderadamente ativo (3-4x/semana)":1.55,
  "Muito ativo (5-6x/semana)":1.725,
  "Extremamente ativo (2x/dia)":1.9,
};

function tmb(p,a,id,s){ const pe=parseFloat(p),al=parseFloat(a),i=parseInt(id); return s==="feminino"?Math.round(10*pe+6.25*al-5*i-161):Math.round(10*pe+6.25*al-5*i+5); }

// ─── LOCAL PROTOCOL ───────────────────────────────────────────────────────────
function gerarLocal(f){
  const isMassa=f.objetivo==="massa", isFem=f.sexo==="feminino";
  const base=tmb(f.peso,f.altura,f.idade,f.sexo), fator=ATIVIDADE[f.nivelAtividade]||1.55;
  const tdee=Math.round(base*fator), kcal=isMassa?tdee+400:tdee-500;
  const prot=Math.round(parseFloat(f.peso)*(isMassa?2.2:1.8));
  const carb=Math.round((kcal*.4)/4), gord=Math.round((kcal*.25)/9);
  const isAcad=f.localTreino!=="Em casa"&&f.localTreino!=="Ao ar livre";

  const treinosA={
    "Seg":{nome:"Peito + Tríceps",ex:[["Supino Reto","4×10"],["Supino Inclinado","4×10"],["Crucifixo","3×12"],["Tríceps Corda","4×12"],["Tríceps Testa","3×12"]]},
    "Ter":{nome:"Costas + Bíceps",ex:[["Puxada Frente","4×10"],["Remada Curvada","4×10"],["Remada Unilateral","3×12"],["Rosca Direta","4×12"],["Rosca Martelo","3×12"]]},
    "Qua":{nome:"Cardio + Core",ex:[["Esteira 30min","Intens. 7"],["Prancha","4×45s"],["Abdominal","4×20"],["Elevação Pernas","3×15"],["Mountain Climber","3×30s"]]},
    "Qui":{nome:"Ombro + Trapézio",ex:[["Desenvolvimento","4×10"],["Elevação Lateral","4×15"],["Elevação Frontal","3×12"],["Encolhimento","4×15"],["Remada Alta","3×12"]]},
    "Sex":{nome:"Pernas",ex:[["Agachamento Livre","4×10"],["Leg Press","4×12"],["Cadeira Extensora","4×15"],["Mesa Flexora","4×12"],["Panturrilha","4×20"]]},
    "Sáb":{nome:"HIIT + Mobilidade",ex:[["Burpee","4×15"],["Agachamento Jump","4×20"],["Flexão","3×15"],["Polichinelo","3×60s"],["Corrida Estac.","5×20s"]]},
    "Dom":{nome:"Descanso Ativo",ex:[["Caminhada Leve","30min"],["Alongamento","20min"],["Foam Roller","15min"]]},
  };
  const treinosAF={
    "Seg":{nome:"Glúteo + Posterior A",ex:[["Agachamento Livre","4×12"],["Stiff com Halteres","4×12"],["Cadeira Flexora","4×15"],["Elevação Pélvica","4×20"],["Passada com Halter","3×12 p/lado"]]},
    "Ter":{nome:"Upper + Core",ex:[["Remada Curvada","4×12"],["Puxada Aberta","4×10"],["Desenvolvimento","3×12"],["Prancha","4×45s"],["Abdominal Infra","4×20"]]},
    "Qua":{nome:"Quadríceps + Glúteo A",ex:[["Leg Press 45°","4×15"],["Cadeira Extensora","4×15"],["Agachamento Sumô","4×15"],["Abdução no Cabo","4×20"],["Panturrilha","4×25"]]},
    "Qui":{nome:"Cardio HIIT + Core",ex:[["Esteira 25min","Intens. 8"],["Mountain Climber","4×30s"],["Polichinelo","3×60s"],["Prancha Lateral","3×30s p/lado"],["Abdominal Bicicleta","4×20"]]},
    "Sex":{nome:"Glúteo + Posterior B",ex:[["Levantamento Terra","4×10"],["Coice no Cabo","4×20 p/lado"],["Agachamento Búlgaro","4×12 p/lado"],["Mesa Flexora","4×12"],["Elevação Pélvica com Barra","4×15"]]},
    "Sáb":{nome:"Quadríceps + Cardio",ex:[["Agachamento Hack","4×12"],["Leg Press Unilateral","3×15 p/lado"],["Step Up","4×12 p/lado"],["Caminhada Inclinada 20min","— Inclin. 8"],["Alongamento MMII","15min"]]},
    "Dom":{nome:"Descanso Ativo",ex:[["Caminhada Leve","30min"],["Yoga / Alongamento","20min"],["Foam Roller MMII","15min"]]},
  };
  const treinosC={
    "Seg":{nome:"Upper A",ex:[["Flexão","4×15"],["Flexão Diamante","3×12"],["Flexão Inclinada","3×15"],["Tríceps Banco","4×12"]]},
    "Ter":{nome:"Lower A",ex:[["Agachamento","4×20"],["Agachamento Sumô","3×20"],["Afundo","3×12 p/lado"],["Elevação Quadril","4×20"]]},
    "Qua":{nome:"Cardio + Core",ex:[["Burpee","4×15"],["Prancha","4×45s"],["Mountain Climber","4×30s"],["Abdominal Bicicleta","3×20"]]},
    "Qui":{nome:"Upper B",ex:[["Flexão Wide","4×15"],["Dip no Banco","4×12"],["Superman","3×15"],["Prancha Lateral","3×30s"]]},
    "Sex":{nome:"Lower B",ex:[["Wall Squat","3×45s"],["Avanço","4×12 p/lado"],["Stiff","4×15"],["Panturrilha","4×25"]]},
    "Sáb":{nome:"HIIT",ex:[["Polichinelo","3×60s"],["Agachamento Jump","4×20"],["Corrida Estac.","5×20s"],["Burpee","3×15"]]},
    "Dom":{nome:"Descanso",ex:[["Caminhada","30min"],["Alongamento","20min"]]},
  };
  const treinosCF={
    "Seg":{nome:"Glúteo + Posterior A",ex:[["Agachamento","4×20"],["Stiff Unilateral","4×12 p/lado"],["Elevação Pélvica","4×25"],["Afundo","3×12 p/lado"],["Abdominal Infra","3×20"]]},
    "Ter":{nome:"Upper + Core",ex:[["Flexão Wide","4×15"],["Superman","4×15"],["Prancha","4×45s"],["Prancha Lateral","3×30s p/lado"],["Abdominal Bicicleta","3×20"]]},
    "Qua":{nome:"Quadríceps + Glúteo A",ex:[["Agachamento Sumô","4×20"],["Agachamento Jump","4×15"],["Afundo Lateral","4×12 p/lado"],["Elevação Pélvica Unilateral","4×15 p/lado"],["Panturrilha","4×25"]]},
    "Qui":{nome:"Cardio HIIT",ex:[["Burpee","4×15"],["Mountain Climber","4×30s"],["Polichinelo","3×60s"],["Corrida Estac.","5×20s"],["Agachamento Isométrico","3×45s"]]},
    "Sex":{nome:"Glúteo + Posterior B",ex:[["Elevação Pélvica com Elástico","4×20"],["Coice Traseiro","4×20 p/lado"],["Agachamento Búlgaro","4×12 p/lado"],["Agachamento Sumô Pulsado","3×20"],["Stiff Bilateral","4×15"]]},
    "Sáb":{nome:"Lower + Cardio",ex:[["Agachamento","4×20"],["Afundo Alternado","4×12 p/lado"],["Step Up Cadeira","4×15 p/lado"],["Caminhada 20min","— Ritmo Rápido"],["Alongamento MMII","15min"]]},
    "Dom":{nome:"Descanso Ativo",ex:[["Caminhada","30min"],["Yoga / Alongamento","20min"],["Auto-Massagem","15min"]]},
  };

  const prefs=f.alimentosPref||[];
  const proteina=prefs.includes("Carne Bovina")?"200g carne bovina magra grelhada":prefs.includes("Frango")?"200g frango grelhado":prefs.includes("Peixe/Atum")?"200g salmão ou atum":prefs.includes("Ovos")?"4 ovos mexidos":"200g frango grelhado";
  const carbo2=prefs.includes("Batata-Doce")?"150g batata-doce":prefs.includes("Arroz Integral")?"100g arroz integral":prefs.includes("Mandioca")?"150g mandioca cozida":prefs.includes("Pão Integral")?"2 fatias pão integral":"100g arroz integral";
  const fruta=prefs.includes("Banana")?"1 banana":prefs.includes("Maçã")?"1 maçã":prefs.includes("Frutas Vermelhas")?"1 xícara frutas vermelhas":"1 banana";
  const gordura=prefs.includes("Pasta Amendoim")?"30g pasta amendoim":prefs.includes("Castanhas")?"30g castanhas":prefs.includes("Abacate")?"½ abacate":"30g castanhas";
  const cafe=prefs.includes("Ovos")?"3 ovos mexidos":prefs.includes("Omelete")?"2 ovos omelete":"3 ovos mexidos";
  const cereal=prefs.includes("Aveia")?"40g aveia":prefs.includes("Pão Integral")?"2 fatias pão integral":"40g aveia";
  const lanche=prefs.includes("Whey Protein")?"1 dose whey protein":prefs.includes("Queijo")?"2 fatias queijo":"1 dose whey protein";
  const salada=prefs.includes("Salada Verde")?"Salada verde":prefs.includes("Brócolis")?"Brócolis no vapor":"Salada verde";

  const refFat=[
    {h:"07:00",n:"Café da Manhã",it:[cafe,cereal,fruta,"Café sem açúcar"]},
    {h:"12:30",n:"Almoço",it:[proteina,carbo2,salada,"Fio de azeite"]},
    {h:"16:00",n:"Lanche",it:[lanche,fruta,gordura]},
    {h:"20:00",n:"Jantar",it:[proteina,"Legumes no vapor","Salada + azeite"]},
    {h:"22:00",n:"Ceia (opcional)",it:["150g iogurte grego",gordura]},
  ];
  const refMassa=[
    {h:"07:00",n:"Café da Manhã",it:["5 "+cafe.replace("3 ",""),cereal+" + mel",fruta,"300ml leite integral"]},
    {h:"10:00",n:"Pré-Treino",it:["2 fatias pão integral","4 col. "+gordura,fruta]},
    {h:"13:00",n:"Almoço",it:["250g "+proteina.replace("200g ",""),carbo2,prefs.includes("Feijão")?"150g feijão":"150g lentilha",salada]},
    {h:"16:00",n:"Lanche",it:[lanche+" 40g + leite",gordura,fruta]},
    {h:"20:00",n:"Jantar",it:["300g "+proteina.replace("200g ",""),carbo2,"Legumes refogados"]},
    {h:"22:00",n:"Ceia",it:["200g iogurte grego",gordura,"1 col. whey"]},
  ];
  const supl=isMassa?["Whey Protein 40g pós-treino","Creatina 5g/dia","Hipercalórico 2x dias de treino","ZMA antes de dormir","Maltodextrina intra-treino"]:["Whey Protein 30g pós-treino","Creatina 5g/dia","Ômega 3 — 2 caps com refeição","Vitamina D 2000UI/dia","Cafeína 200mg pré-treino"];
  const treinos=isAcad?(isFem?treinosAF:treinosA):(isFem?treinosCF:treinosC);
  return{kcal,prot,carb,gord,treinos,refeicoes:isMassa?refMassa:refFat,suplementos:supl,isMassa,isFem};
}

async function gerarProtocolo(f){
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Protocolo de ${f.objetivo==="massa"?"ganho de massa":"emagrecimento"} para: sexo ${f.sexo}, ${f.idade} anos, ${f.peso}kg, ${f.altura}cm, nível ${f.nivelAtividade}, local ${f.localTreino}. Restrições: ${f.restricoes?.join(",")||"nenhuma"}.\nPreferências alimentares do usuário: ${f.alimentosPref?.length>0?f.alimentosPref.join(", "):"sem preferências específicas"}.\nIMPORTANTE: Monte as refeições usando prioritariamente os alimentos preferidos do usuário.\nResponda APENAS JSON válido sem markdown: {"kcal":number,"prot":number,"carb":number,"gord":number,"dica":"string personalizada de 1 frase"}`}]})});
    const d=await res.json();
    const txt=d?.content?.[0]?.text||"";
    const json=JSON.parse(txt.replace(/```json|```/g,"").trim());
    return{...gerarLocal(f),...json};
  }catch{return gerarLocal(f);}
}

async function perguntarIA(msg,tipo,perfil,protocolo){
  const ctx=tipo==="treino"?`Você é um personal trainer especialista do app IRONCUT.\nPerfil: sexo ${perfil.sexo}, ${perfil.idade} anos, ${perfil.peso}kg, objetivo: ${perfil.objetivo==="massa"?"ganho de massa":"emagrecimento"}, local: ${perfil.localTreino}.\nTreino atual: ${JSON.stringify(protocolo?.treinos||{})}.\n\nREGRAS:\n1. Se pedir para TROCAR UM DIA INTEIRO: responda com texto curto E retorne:\n   |||JSON_TREINO|||{"diaAlvo":"Qua","novosDia":true,"novoNome":"Pernas","novosExercicios":[["Agachamento Livre","4×10"],["Leg Press","4×12"],["Cadeira Extensora","4×15"],["Mesa Flexora","4×12"],["Panturrilha","4×20"]]}|||FIM_JSON|||\n2. Se pedir SUBSTITUIÇÃO de exercício único: responda com texto E retorne:\n   |||JSON_TREINO|||{"exercicioAntigo":"nome","exercicioNovo":"nome novo","series":"4×12"}|||FIM_JSON|||\n3. Pergunta geral: só texto, sem JSON.\nSeja direto e motivador.`:`Você é uma nutricionista especialista e amigável do app IRONCUT.\nPerfil: sexo ${perfil.sexo}, ${perfil.idade} anos, ${perfil.peso}kg, objetivo: ${perfil.objetivo==="massa"?"ganho de massa":"emagrecimento"}. Calorias: ${protocolo?.kcal}kcal, proteína: ${protocolo?.prot}g.\nCardápio atual completo: ${JSON.stringify(protocolo?.refeicoes||[])}.\n\nREGRAS IMPORTANTES:\n1. Se o aluno pedir SUBSTITUIÇÃO ou ALTERAÇÃO de alimento/refeição: responda com texto curto (2-3 linhas) E retorne no final um bloco JSON válido no formato:\n   |||JSON_DIETA|||{"refeicaoNome":"Café da Manhã","alimentoAntigo":"3 ovos mexidos","alimentoNovo":"200g iogurte grego + 30g granola"}|||FIM_JSON|||\n2. Se for pergunta geral: responda normalmente em texto, SEM bloco JSON.\n3. Seja direta, prática e motivadora.`;
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:ctx+"\n\nMensagem do aluno: "+msg}]})});
    if(!res.ok){const err=await res.text();console.error("API error:",res.status,err);throw new Error("API status "+res.status);}
    const d=await res.json();
    const txt=d?.content?.[0]?.text||"Não consegui processar. Tente novamente.";
    if(tipo==="treino"){const match=txt.match(/\|\|\|JSON_TREINO\|\|\|(.*?)\|\|\|FIM_JSON\|\|\|/s);if(match){try{const upd=JSON.parse(match[1].trim());const texto=txt.replace(/\|\|\|JSON_TREINO\|\|\|.*?\|\|\|FIM_JSON\|\|\|/s,"").trim();return{texto,atualizacaoTreino:upd};}catch{}}}else{const match=txt.match(/\|\|\|JSON_DIETA\|\|\|(.*?)\|\|\|FIM_JSON\|\|\|/s);if(match){try{const upd=JSON.parse(match[1].trim());const texto=txt.replace(/\|\|\|JSON_DIETA\|\|\|.*?\|\|\|FIM_JSON\|\|\|/s,"").trim();return{texto,atualizacaoDieta:upd};}catch{}}}
    return{texto:txt};
  }catch(e){
    console.error("IA error:",e);
    if(tipo==="treino"){const resps=["Para substituir Leg Press: Agachamento Búlgaro 4×12 por perna — trabalha quadríceps e glúteos.","Para substituir Supino: Flexão com pegada larga 4×15 ou Flexão com pés elevados 3×12.","Para mais glúteo: Hip Thrust 4×15 ou Elevação Pélvica com elástico 4×20."];return{texto:resps[Math.floor(Math.random()*resps.length)]};}
    else{const resps=["Para substituir ovos: 200g iogurte grego + 30g granola + frutas.","Para substituir frango: Atum em lata 150g + azeite + salada.","Para substituir batata-doce: Arroz integral + feijão é uma ótima combinação."];return{texto:resps[Math.floor(Math.random()*resps.length)]};}
  }
}

function aplicarAtualizacaoTreino(protocolo,upd){
  if(!upd)return protocolo;
  const novoTreinos=JSON.parse(JSON.stringify(protocolo.treinos));
  if(upd.diaAlvo&&upd.novosExercicios){for(const d of Object.keys(novoTreinos)){if(d===upd.diaAlvo){novoTreinos[d]={nome:upd.novoNome||novoTreinos[d].nome,ex:upd.novosExercicios};break;}}return{...protocolo,treinos:novoTreinos};}
  if(upd.exercicioAntigo&&upd.exercicioNovo){for(const d of Object.keys(novoTreinos)){const idx=novoTreinos[d].ex.findIndex(([n])=>n.toLowerCase().includes(upd.exercicioAntigo.toLowerCase())||upd.exercicioAntigo.toLowerCase().includes(n.toLowerCase().split(" ")[0]));if(idx!==-1){novoTreinos[d].ex[idx]=[upd.exercicioNovo,upd.series||novoTreinos[d].ex[idx][1]];break;}}}
  return{...protocolo,treinos:novoTreinos};
}

function aplicarAtualizacaoDieta(protocolo,upd){
  if(!upd||!upd.refeicaoNome||!upd.alimentoNovo)return protocolo;
  const novasRef=protocolo.refeicoes.map(ref=>{
    const nomeMatch=ref.n.toLowerCase().includes(upd.refeicaoNome.toLowerCase())||upd.refeicaoNome.toLowerCase().includes(ref.n.toLowerCase());
    if(!nomeMatch)return ref;
    if(upd.alimentoAntigo){const novosIt=ref.it.map(item=>{const match=item.toLowerCase().includes(upd.alimentoAntigo.toLowerCase())||upd.alimentoAntigo.toLowerCase().includes(item.toLowerCase().split(" ").slice(0,2).join(" "));return match?upd.alimentoNovo:item;});return{...ref,it:novosIt};}
    return{...ref,it:[upd.alimentoNovo]};
  });
  return{...protocolo,refeicoes:novasRef};
}

// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAUIoV7tDLGwDQy0NVqZq8bYjJJfOAPIJU",
  authDomain: "ironcut-21d.firebaseapp.com",
  projectId: "ironcut-21d",
  storageBucket: "ironcut-21d.firebasestorage.app",
  messagingSenderId: "991217655866",
  appId: "1:991217655866:web:32cf3efa7fc4f6f1439503"
};

let _db=null, _auth=null;
function getFirebase(){
  const fb=window.firebase;
  if(!fb)return null;
  if(!fb.apps.length)fb.initializeApp(FIREBASE_CONFIG);
  if(!_db)_db=fb.firestore();
  if(!_auth)_auth=fb.auth();
  return{db:_db,auth:_auth};
}

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const DB_KEY="ic_contas_v2";
async function saveContaFirebase(email,dados){const fb=getFirebase();if(fb&&fb.db){try{await fb.db.collection("usuarios").doc(email).set(dados);}catch(e){console.warn("Firebase save error:",e);}}const contas=getContasLocal();contas[email]=dados;localStorage.setItem(DB_KEY,JSON.stringify(contas));}
async function getContaFirebase(email){const fb=getFirebase();if(fb&&fb.db){try{const doc=await fb.db.collection("usuarios").doc(email).get();if(doc.exists)return doc.data();}catch(e){console.warn("Firebase get error:",e);}}const contas=getContasLocal();return contas[email]||null;}
function getContasLocal(){try{return JSON.parse(localStorage.getItem(DB_KEY)||"{}");}catch{return{};}}
function getContas(){return getContasLocal();}
function saveContas(c){localStorage.setItem(DB_KEY,JSON.stringify(c));}
function saveSession(email,senha){localStorage.setItem("ic_sess_v2",JSON.stringify({email,senha}));}
function clearSession(){localStorage.removeItem("ic_sess_v2");}
function getSession(){try{return JSON.parse(localStorage.getItem("ic_sess_v2")||"null");}catch{return null;}}

// ─── VERIFICAÇÃO DE COMPRADOR ────────────────────────────────────────────────
async function verificarComprador(email) {
  if (email === "demo@ironcut.app") return true;
  const chave = email.replace(/\./g, "_").replace(/@/g, "__at__");
  try {
    const res = await fetch(`https://ironcut-21d-default-rtdb.firebaseio.com/compradores/${chave}.json`);
    const data = await res.json();
    if (data && data.status === "ativo") return true;
    return false;
  } catch {
    const fb = getFirebase();
    if (fb && fb.db) {
      try {
        const doc = await fb.db.collection("compradores").doc(email).get();
        return doc.exists && doc.data().status === "ativo";
      } catch { return false; }
    }
    return false;
  }
}

// ─── TELA DE ACESSO BLOQUEADO ────────────────────────────────────────────────
function AcessoBloqueado({ email, onLogout }) {
  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Barlow', sans-serif"}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:480,width:"100%",background:"#141414",border:"1px solid #202020",borderRadius:16,padding:40,textAlign:"center",animation:"fadeUp .4s ease"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(255,60,60,0.08)",border:"2px solid rgba(255,60,60,0.25)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:32}}>🔒</div>
        <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:32,letterSpacing:2,marginBottom:8,color:"#fff"}}>ACESSO NEGADO</p>
        <p style={{fontSize:14,color:"#666",marginBottom:8,lineHeight:1.6}}>O e-mail <strong style={{color:"#fff"}}>{email}</strong> não possui uma compra ativa do IRONCUT 21D.</p>
        <p style={{fontSize:13,color:"#444",marginBottom:28,lineHeight:1.7}}>Se você comprou recentemente, aguarde alguns minutos e tente novamente. O acesso é liberado automaticamente após a confirmação do pagamento.</p>
        <a href="https://pay.kiwify.com.br/DqjU8H4" target="_blank" rel="noreferrer" style={{display:"block",background:"linear-gradient(135deg,#00D4C8,#66FFF0)",color:"#000",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,letterSpacing:1.5,textTransform:"uppercase",padding:"15px 32px",borderRadius:8,textDecoration:"none",marginBottom:12}}>Adquirir IRONCUT 21D →</a>
        <button onClick={onLogout} style={{background:"transparent",border:"1px solid #202020",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1.5,textTransform:"uppercase",padding:"11px 24px",borderRadius:8,cursor:"pointer",width:"100%"}}>Sair da conta</button>
        <p style={{marginTop:20,fontSize:11,color:"#333"}}>Dúvidas? ironcut21D@outlook.com</p>
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({ onStart, onDemo, onLogin }) {
  return (
    <div className="landing">
      <div className="land-glow"/><div className="land-grid"/>
      <div className="logo-wrap">
        <div className="logo-ring"/><div className="logo-ring2"/>
        <img src={LOGO_SRC} alt="IRONCUT" className="logo-img"/>
      </div>
      <div className="land-brand"><span>IRON</span>CUT</div>
      <div className="land-badge">⚡ Protocolo de Elite com IA</div>
      <h1 className="land-title">TRANSFORME<br/><span>SEU CORPO</span><br/>EM 21 DIAS</h1>
      <p className="land-sub">Protocolo de Transformação Corporal</p>
      <p className="land-desc">Plano alimentar, treinos e acompanhamento personalizados por Inteligência Artificial para o seu perfil único.</p>
      <div className="land-stats">
        {[["500+","Alunos"],["4,8kg","Perda média"],["IA","Protocolo inteligente"],["21D","Transformação"]].map(([n,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div className="land-stat-n">{n}</div>
            <div className="land-stat-l">{l}</div>
          </div>
        ))}
      </div>
      <div className="land-btns">
        <button className="btn btn-accent" onClick={onStart}>Começar Agora →</button>
        <button className="btn btn-outline" onClick={onDemo}>Ver Demo</button>
      </div>
      <p style={{marginTop:16,fontSize:12,color:C.muted,cursor:"pointer"}} onClick={onLogin}>
        Já tenho conta → <span style={{color:C.accent}}>Entrar</span>
      </p>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin, onBack }) {
  const [email,setEmail]=useState("");
  const [senha,setSenha]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  async function handle(){
    if(!email||!senha){ setErr("Preencha e-mail e senha."); return; }
    setLoading(true); setErr("");
    try {
      const conta = await getContaFirebase(email);
      if(conta && conta.senha===senha){
        const comprou = await verificarComprador(email);
        saveSession(email, senha);
        onLogin(conta.perfil, conta.protocolo, conta.pesosLog||[], conta.aguaLog||{}, comprou);
      } else {
        setErr("E-mail ou senha incorretos.");
      }
    } catch(e){ setErr("Erro ao conectar. Tente novamente."); }
    setLoading(false);
  }

  return (
    <div className="modal">
      <div className="modal-box">
        <div style={{textAlign:"center",marginBottom:20}}>
          <img src={LOGO_SRC} alt="" style={{width:60,height:60,objectFit:"contain",filter:`drop-shadow(0 0 12px ${C.accent})`}}/>
        </div>
        <p className="cad-title">ENTRAR <span>IRONCUT</span></p>
        <p className="cad-sub">Acesse sua conta e continue sua jornada</p>
        <div className="field"><label>E-mail</label><input type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div className="field"><label>Senha</label><input type="password" placeholder="••••••••" value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        {err&&<p style={{color:C.accent,fontSize:13,marginBottom:12}}>{err}</p>}
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-accent" style={{flex:1,opacity:loading?0.6:1}} onClick={handle} disabled={loading}>{loading?"Verificando...":"Entrar"}</button>
          <button className="btn btn-outline" onClick={onBack}>Voltar</button>
        </div>
      </div>
    </div>
  );
}

// ─── CADASTRO ─────────────────────────────────────────────────────────────────
const ALIMENTOS_PREF = [
  {emoji:"🥩",nome:"Carne Bovina"},{emoji:"🍗",nome:"Frango"},{emoji:"🐟",nome:"Peixe/Atum"},
  {emoji:"🥚",nome:"Ovos"},{emoji:"🧀",nome:"Queijo"},{emoji:"🫘",nome:"Feijão"},
  {emoji:"🥜",nome:"Pasta Amendoim"},{emoji:"🥛",nome:"Whey Protein"},{emoji:"🍚",nome:"Arroz Integral"},
  {emoji:"🍠",nome:"Batata-Doce"},{emoji:"🌽",nome:"Mandioca"},{emoji:"🍞",nome:"Pão Integral"},
  {emoji:"🌿",nome:"Salada Verde"},{emoji:"🥦",nome:"Brócolis"},{emoji:"🥕",nome:"Legumes"},
  {emoji:"🍌",nome:"Banana"},{emoji:"🍎",nome:"Maçã"},{emoji:"🫐",nome:"Frutas Vermelhas"},
  {emoji:"🥑",nome:"Abacate"},{emoji:"🌾",nome:"Aveia"},{emoji:"🌰",nome:"Castanhas"},
  {emoji:"🫒",nome:"Azeite"},{emoji:"🍳",nome:"Omelete"},{emoji:"🥗",nome:"Salada Proteica"},
];

function Cadastro({ onCadastro }) {
  const TOTAL=6;
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [f,setF]=useState({nome:"",email:"",senha:"",objetivo:"fat",sexo:"masculino",idade:"",peso:"",altura:"",nivelAtividade:"Moderadamente ativo (3-4x/semana)",localTreino:"Academia completa",restricoes:[],condicoes:["Nenhuma"],alimentosPref:[]});
  const upd=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleArr=(k,v)=>setF(p=>{const arr=p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v];return{...p,[k]:arr};});

  const imcAtual=f.peso&&f.altura?calcIMC(f.peso,f.altura):null;
  const clsAtual=imcAtual?clsIMC(parseFloat(imcAtual)):null;
  const ideal=f.peso&&f.altura?pesoIdeal(f.altura,f.sexo):null;

  function canNext(){
    if(step===1)return!!f.objetivo;
    if(step===2)return!!(f.nome&&f.email&&f.senha&&f.senha.length>=6);
    if(step===3)return!!(f.sexo&&f.idade&&f.peso&&f.altura&&parseInt(f.idade)>10&&parseFloat(f.peso)>20&&parseFloat(f.altura)>100);
    if(step===6)return f.alimentosPref.length>=3;
    return true;
  }

  async function handleSubmit(){
    if(loading)return;
    setLoading(true);
    try{
      const proto=gerarLocal(f);
      const pesosLog=[{val:parseFloat(f.peso),data:hoje()}];
      const aguaLog={};
      const dadosConta={senha:f.senha,perfil:f,protocolo:proto,pesosLog,aguaLog};
      await saveContaFirebase(f.email,dadosConta);
      saveSession(f.email,f.senha);
      gerarProtocolo(f).then(protoIA=>{saveContaFirebase(f.email,{...dadosConta,protocolo:protoIA}).catch(()=>{});}).catch(()=>{});
      onCadastro(f,proto,pesosLog,aguaLog);
    }catch(e){console.error("Erro cadastro:",e);setLoading(false);alert("Erro inesperado. Tente novamente.");}
  }

  function next(){if(!canNext())return;if(step<TOTAL){setStep(s=>s+1);}else{handleSubmit();}}
  function prev(){if(step>1)setStep(s=>s-1);}

  const restricoes=["Sem lactose","Sem glúten","Vegetariano","Vegano","Sem carne vermelha"];
  const condicoes=["Nenhuma","Diabetes","Hipertensão","Problema no joelho","Problema na coluna","Cardíaco"];

  if(loading)return(
    <div className="modal"><div className="modal-box" style={{textAlign:"center",padding:48}}>
      <img src={LOGO_SRC} alt="" style={{width:80,height:80,objectFit:"contain",filter:`drop-shadow(0 0 16px ${C.accent})`,marginBottom:20}}/>
      <p style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:4,color:C.accent,marginBottom:8}}>Gerando Seu Protocolo...</p>
      <p style={{color:C.muted,fontSize:13}}>A IA está personalizando seu plano. Aguarde!</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:20}}>
        {[0,1,2].map(i=>(<div key={i} style={{width:10,height:10,borderRadius:"50%",background:C.accent,animation:`typing 1.2s ease-in-out ${i*0.2}s infinite`}}/>))}
      </div>
    </div></div>
  );

  return(
    <div className="modal"><div className="modal-box">
      <div className="cad-steps">{Array.from({length:TOTAL},(_,i)=>(<div key={i} className={`cad-step-dot${i<step?" done":""}`}/>))}</div>
      {step===1&&(<><p className="cad-title">SEU <span>OBJETIVO</span></p><p className="cad-sub">Passo 1 de 6 — O que você quer conquistar?</p><div className="goal-grid"><div className={`goal-card${f.objetivo==="fat"?" sel-fat":""}`} onClick={()=>upd("objetivo","fat")}><div className="gi">🔥</div><div className="gn">Emagrecer</div><div className="gd">Queimar gordura e definir o corpo com déficit calórico</div></div><div className={`goal-card${f.objetivo==="massa"?" sel-mass":""}`} onClick={()=>upd("objetivo","massa")}><div className="gi">💪</div><div className="gn">Ganhar Massa</div><div className="gd">Hipertrofia muscular com superávit calórico e força</div></div></div></>)}
      {step===2&&(<><p className="cad-title">CRIE SUA <span>CONTA</span></p><p className="cad-sub">Passo 2 de 6 — Dados de acesso</p><div className="field"><label>Nome Completo</label><input placeholder="Seu nome" value={f.nome} onChange={e=>upd("nome",e.target.value)}/></div><div className="field"><label>E-mail</label><input type="email" placeholder="seu@email.com" value={f.email} onChange={e=>upd("email",e.target.value)}/></div><div className="field"><label>Senha (mín. 6 caracteres)</label><input type="password" placeholder="Crie uma senha" value={f.senha} onChange={e=>upd("senha",e.target.value)}/></div></>)}
      {step===3&&(<><p className="cad-title">SEU <span>PERFIL</span></p><p className="cad-sub">Passo 3 de 6 — IMC e peso ideal calculados automaticamente</p><div className="field"><label>Sexo</label><div className="pill-group">{["masculino","feminino"].map(s=>(<div key={s} className={`pill${f.sexo===s?" sel":""}`} onClick={()=>upd("sexo",s)} style={{textTransform:"capitalize"}}>{s}</div>))}</div></div><div className="fields-row"><div className="field"><label>Idade</label><input type="number" placeholder="Ex: 28" value={f.idade} onChange={e=>upd("idade",e.target.value)}/></div><div className="field"><label>Peso Atual (kg)</label><input type="number" placeholder="Ex: 85" value={f.peso} onChange={e=>upd("peso",e.target.value)}/></div></div><div className="field"><label>Altura (cm)</label><input type="number" placeholder="Ex: 175" value={f.altura} onChange={e=>upd("altura",e.target.value)}/></div>{imcAtual&&(<div className="imc-result"><div className="imc-row"><span style={{color:C.muted}}>Seu IMC</span><span className="imc-val">{imcAtual}</span></div><div className="imc-row"><span style={{color:C.muted}}>Classificação</span><span style={{fontWeight:700,color:C.text}}>{clsAtual}</span></div><div className="imc-row"><span style={{color:C.muted}}>Peso Ideal</span><span style={{fontWeight:700,color:C.accent}}>{ideal}kg</span></div><div className="imc-row" style={{marginBottom:0}}><span style={{color:C.muted}}>Meta sugerida</span><span style={{fontWeight:700,color:C.text}}>{ideal}kg</span></div></div>)}</>)}
      {step===4&&(<><p className="cad-title">TREINO & <span>ATIVIDADE</span></p><p className="cad-sub">Passo 4 de 6 — Onde e como você treina</p><div className="field"><label>Nível de Atividade</label><select value={f.nivelAtividade} onChange={e=>upd("nivelAtividade",e.target.value)}>{Object.keys(ATIVIDADE).map(k=><option key={k} value={k}>{k}</option>)}</select></div><div className="field"><label>Local de Treino</label><div className="pill-group">{["Academia completa","Academia básica","Em casa","Ao ar livre"].map(l=>(<div key={l} className={`pill${f.localTreino===l?" sel":""}`} onClick={()=>upd("localTreino",l)}>{l}</div>))}</div></div><div className="field" style={{marginTop:16}}><label>Pratica algum esporte físico?</label><div className="pill-group">{["Sim","Não"].map(s=>(<div key={s} className={`pill${f.praticaEsporte===s?" sel":""}`} onClick={()=>upd("praticaEsporte",s)}>{s}</div>))}</div></div>{f.praticaEsporte==="Sim"&&(<div className="field" style={{marginTop:12}}><label>Qual esporte?</label><div className="pill-group">{[{emoji:"⚽",nome:"Futebol"},{emoji:"🏐",nome:"Futevôlei"},{emoji:"🏐",nome:"Vôlei"},{emoji:"🎾",nome:"Beach Tênis"},{emoji:"🏊",nome:"Natação"},{emoji:"🥊",nome:"Luta/MMA"}].map(e=>(<div key={e.nome} className={`pill${f.esporte===e.nome?" sel":""}`} onClick={()=>upd("esporte",e.nome)}>{e.emoji} {e.nome}</div>))}</div></div>)}</>)}
      {step===5&&(<><p className="cad-title">SAÚDE & <span>RESTRIÇÕES</span></p><p className="cad-sub">Passo 5 de 6 — Para personalizar seu protocolo</p><div className="field"><label>Restrições Alimentares</label><div className="check-group">{restricoes.map(r=>(<label key={r} className="check-item"><input type="checkbox" checked={f.restricoes.includes(r)} onChange={()=>toggleArr("restricoes",r)}/>{r}</label>))}</div></div><div className="field" style={{marginTop:16}}><label>Condições de Saúde</label><div className="check-group">{condicoes.map(cd=>(<label key={cd} className="check-item"><input type="checkbox" checked={f.condicoes.includes(cd)} onChange={()=>{if(cd==="Nenhuma"){upd("condicoes",["Nenhuma"]);return;}const arr=f.condicoes.filter(x=>x!=="Nenhuma");setF(p=>({...p,condicoes:arr.includes(cd)?arr.filter(x=>x!==cd):[...arr,cd]}));}}/>{cd}</label>))}</div></div></>)}
      {step===6&&(<><p className="cad-title">SUAS <span>PREFERÊNCIAS</span></p><p className="cad-sub">Passo 6 de 6 — Selecione os alimentos que você gosta!</p><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><p style={{fontSize:12,color:C.muted}}>Selecione pelo menos <strong style={{color:C.accent}}>3 alimentos</strong></p><p style={{fontSize:13,fontWeight:700,color:f.alimentosPref.length>=3?C.accent:C.muted}}>{f.alimentosPref.length} / {ALIMENTOS_PREF.length} selecionados</p></div><div className="food-grid">{ALIMENTOS_PREF.map(a=>(<div key={a.nome} className={`food-item${f.alimentosPref.includes(a.nome)?" sel":""}`} onClick={()=>toggleArr("alimentosPref",a.nome)}><div className="fi">{a.emoji}</div><div className="fn">{a.nome}</div></div>))}</div>{f.alimentosPref.length>=3&&(<div style={{marginTop:12,padding:"10px 14px",background:"rgba(102,255,240,.06)",border:`1px solid rgba(102,255,240,.2)`,borderRadius:8,fontSize:12,color:C.lgray}}>✅ <strong style={{color:C.accent}}>Ótimo!</strong> Sua dieta será montada priorizando: {f.alimentosPref.slice(0,5).join(", ")}{f.alimentosPref.length>5?` e mais ${f.alimentosPref.length-5} alimentos`:""}</div>)}</>)}
      <div className="cad-nav" style={{marginTop:20}}>
        {step>1&&(<button className="btn btn-outline" onClick={prev}>← Voltar</button>)}
        <button className="btn btn-accent" style={{flex:1,opacity:canNext()?1:0.5}} onClick={next} disabled={!canNext()}>{step===TOTAL?"🔥 Gerar Meu Protocolo":"Continuar →"}</button>
      </div>
    </div></div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ perfil, protocolo, pesosLog, onAddPeso, aguaLog, onToggleAgua, checkLog, toggleCheck, calcScore, calcStreak, pesoIdealReal }) {
  const [newP,setNewP]=useState("");
  const [calTreino,setCalTreino]=useState(()=>{try{return parseInt(localStorage.getItem(`ic_cal_${perfil.email}_${hoje()}`)||"0");}catch{return 0;}});
  function salvarCalTreino(v){const n=parseInt(v)||0;setCalTreino(n);localStorage.setItem(`ic_cal_${perfil.email}_${hoje()}`,String(n));}
  const motiv=getDayMotiv();
  const pesoAtual=pesosLog.length?pesosLog[pesosLog.length-1].val:parseFloat(perfil.peso);
  const ideal=pesoIdealReal||parseFloat(pesoIdeal(perfil.altura,perfil.sexo));
  const perdido=(parseFloat(perfil.peso)-pesoAtual).toFixed(1);
  const falta=Math.abs(pesoAtual-ideal).toFixed(1);
  const imc=calcIMC(String(pesoAtual),perfil.altura);
  const isMassa=perfil.objetivo==="massa";
  const progPct=Math.min(100,Math.max(0,((parseFloat(perfil.peso)-pesoAtual)/(parseFloat(perfil.peso)-ideal))*100)).toFixed(0);
  const litrosNecessarios=aguaDia(perfil.peso);
  const garrafas=Math.ceil(litrosNecessarios/0.5);
  const dHoje=hoje();
  const aguaHoje=aguaLog[dHoje]||0;
  const litrosHoje=(aguaHoje*0.5).toFixed(1);
  const aguaPct=Math.min(100,(aguaHoje/garrafas)*100).toFixed(0);
  const cW=500,cH=120;
  function buildPath(){if(pesosLog.length<2)return null;const vals=pesosLog.map(p=>p.val);const mn=Math.min(...vals)-.5,mx=Math.max(...vals)+.5;const pts=vals.map((v,i)=>{const x=(i/(vals.length-1))*cW;const y=cH-((v-mn)/(mx-mn))*cH;return`${x},${y}`;});return`M${pts.join(" L")}`;}
  const path=buildPath();

  return(
    <div>
      <div className="card-accent motiv-card" style={{marginBottom:18}}><div className="motiv-icon">{motiv.icon}</div><div className="motiv-text">"{motiv.text}"</div><div className="motiv-author">— {motiv.author}</div></div>
      <div className="sec-label">Bem-vindo de volta</div>
      <p style={{fontFamily:"'Bebas Neue'",fontSize:30,letterSpacing:1,marginBottom:18}}>OLÁ, {perfil.nome.split(" ")[0].toUpperCase()}!{" "}<span className={`badge ${isMassa?"badge-mass":"badge-fat"}`}>{isMassa?"💪 MASSA":"🔥 FAT LOSS"}</span></p>
      <div className="dash-grid" style={{marginBottom:18}}>
        <div className="card-accent dc"><div className="dc-label">Peso Atual</div><div className="dc-val">{pesoAtual}kg</div><div className="dc-sub">Meta: {ideal}kg</div></div>
        <div className="card dc">
          <div className="dc-label">{isMassa?(parseFloat(perdido)>=0?"Ganho":"Perdido"):(parseFloat(perdido)>=0?"Perdido":"Ganhou")}</div>
          <div className="dc-val" style={{color:isMassa?(parseFloat(perdido)>=0?C.purple:"#ff6b6b"):(parseFloat(perdido)>=0?C.accent:"#ff6b6b"),fontSize:32}}>{parseFloat(perdido)<0?"+":""}{Math.abs(parseFloat(perdido)).toFixed(1)}kg</div>
          <div className="dc-sub">Desde o início</div>
        </div>
        <div className="card dc"><div className="dc-label">Falta</div><div className="dc-val" style={{fontSize:32}}>{falta}kg</div><div className="dc-sub">Para o peso ideal</div></div>
        <div className="card dc"><div className="dc-label">IMC Atual</div><div className="dc-val" style={{fontSize:30}}>{imc}</div><div className="dc-sub">{clsIMC(parseFloat(imc))}</div></div>
      </div>
      <div className="card" style={{padding:"18px 20px",marginBottom:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Progresso na Meta</p><div className="prog-wrap"><div className="prog-fill" style={{width:`${progPct}%`}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted}}><span>{perfil.peso}kg</span><span style={{color:C.accent,fontWeight:700}}>{progPct}% concluído</span><span>{ideal}kg</span></div></div>
      {(()=>{
        const dias7=[];
        for(let i=6;i>=0;i--){
          const d=new Date();d.setDate(d.getDate()-i);
          const str=`${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
          const nomes=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
          const chk=checkLog[str]||{};const agua=aguaLog[str]||0;const garrafas=Math.ceil(aguaDia(perfil.peso)/0.5);
          const treinou=!!chk.treino,dietou=!!chk.dieta,hidratou=agua>=garrafas,isHoje=str===hoje();
          const total=(treinou?1:0)+(dietou?1:0)+(hidratou?1:0);
          dias7.push({str,dia:nomes[d.getDay()],num:d.getDate(),treinou,dietou,hidratou,isHoje,total});
        }
        return(
          <div className="card" style={{padding:"18px 20px",marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>📅 Semana em Revista</p>
              <div style={{display:"flex",gap:10,fontSize:11,color:C.muted}}><span>🏋️ Treino</span><span>🥩 Dieta</span><span>💧 Água</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
              {dias7.map(({str,dia,num,treinou,dietou,hidratou,isHoje,total})=>{
                const cor=total===3?"#22c55e":total===2?C.accent:total===1?"#f59e0b":"#333";
                const bg=total===3?"rgba(34,197,94,.08)":total===2?"rgba(102,255,240,.06)":total===1?"rgba(245,158,11,.06)":"transparent";
                return(<div key={str} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 4px",borderRadius:8,border:`1px solid ${isHoje?cor:"#1a1a1a"}`,background:isHoje?bg:"transparent",transition:"all .2s"}}>
                  <span style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:isHoje?C.accent:C.muted}}>{dia}</span>
                  <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:18,color:isHoje?C.text:"#444",lineHeight:1}}>{num}</span>
                  <div style={{display:"flex",flexDirection:"column",gap:2,width:"100%",alignItems:"center"}}>
                    <div style={{width:20,height:4,borderRadius:2,background:treinou?"#22c55e":"#1a1a1a"}}/>
                    <div style={{width:20,height:4,borderRadius:2,background:dietou?C.accent:"#1a1a1a"}}/>
                    <div style={{width:20,height:4,borderRadius:2,background:hidratou?"#60a5fa":"#1a1a1a"}}/>
                  </div>
                  {total===3&&<span style={{fontSize:10}}>⭐</span>}
                </div>);
              })}
            </div>
            <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap"}}>
              {[{cor:"#22c55e",label:"Verde = dia perfeito (3/3)"},{cor:C.accent,label:"Ciano = 2/3"},{cor:"#f59e0b",label:"Amarelo = 1/3"},{cor:"#333",label:"Cinza = sem registro"}].map(({cor,label})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.muted}}><div style={{width:8,height:8,borderRadius:"50%",background:cor,flexShrink:0}}/>{label}</div>
              ))}
            </div>
          </div>
        );
      })()}
      <div className="card" style={{padding:"18px 20px",marginBottom:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Evolução do Peso</p>{pesosLog.length>=2?(<div className="chart-wrap"><svg width="100%" height="100%" viewBox={`0 0 ${cW} ${cH+20}`} preserveAspectRatio="none"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity=".25"/><stop offset="100%" stopColor={C.accent} stopOpacity="0"/></linearGradient></defs>{path&&<><path d={`${path} L${cW},${cH} L0,${cH} Z`} fill="url(#cg)"/><path d={path} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{pesosLog.map((p,i)=>{const vals=pesosLog.map(x=>x.val);const mn=Math.min(...vals)-.5,mx=Math.max(...vals)+.5;const x=(i/(vals.length-1||1))*cW;const y=cH-((p.val-mn)/(mx-mn||1))*cH;return(<g key={i}><circle cx={x} cy={y} r="5" fill={C.accent} style={{filter:`drop-shadow(0 0 4px ${C.accent})`}}/><text x={x} y={cH+14} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="Barlow">{p.data.split("/").slice(0,2).join("/")}</text></g>);})}</>}</svg></div>):(<p style={{color:C.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>Registre seu peso diariamente para ver a evolução aqui.</p>)}<div className="weight-form"><input type="number" placeholder="Registrar peso de hoje (kg)" value={newP} onChange={e=>setNewP(e.target.value)}/><button onClick={()=>{if(newP){onAddPeso(parseFloat(newP));setNewP("");}}}> + Registrar</button></div></div>
      {(()=>{
        const score=calcScore(),streak=calcStreak(),dHoje=hoje(),checkHoje=checkLog[dHoje]||{treino:false,dieta:false};
        const nivel=score>=91?"🏆 Elite IRONCUT":score>=71?"⚡ Consistente":score>=41?"📈 Em Progresso":"🌱 Iniciante";
        const corScore=score>=71?C.accent:score>=41?"#f59e0b":"#666";
        return(
          <div className="card" style={{padding:"20px 22px",marginBottom:18,background:"#0F0F0F",border:`1px solid rgba(102,255,240,.2)`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div><p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.muted,marginBottom:4}}>Score IRONCUT</p><div style={{fontFamily:"'Bebas Neue'",fontSize:52,lineHeight:1,color:corScore,textShadow:`0 0 20px ${corScore}40`}}>{score}</div><p style={{fontSize:12,color:corScore,fontWeight:700,marginTop:4}}>{nivel}</p></div>
              <div style={{textAlign:"right"}}><p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:4}}>Sequência</p><div style={{fontFamily:"'Bebas Neue'",fontSize:36,color:streak>0?"#f59e0b":C.muted,lineHeight:1}}>🔥 {streak}</div><p style={{fontSize:11,color:C.muted}}>dias seguidos</p></div>
            </div>
            <div style={{height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden",marginBottom:16}}><div style={{height:"100%",width:`${score}%`,background:`linear-gradient(90deg,${C.accent2},${corScore})`,borderRadius:3,transition:"width .8s ease"}}/></div>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:10}}>Check-list de Hoje</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{tipo:"treino",icon:"🏋️",label:"Fui Treinar Hoje",pontos:35},{tipo:"dieta",icon:"🥩",label:"Segui a Dieta Hoje",pontos:25}].map(({tipo,icon,label,pontos})=>(
                <div key={tipo} onClick={()=>toggleCheck(tipo)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:8,border:`1px solid ${checkHoje[tipo]?C.accent:C.border}`,background:checkHoje[tipo]?"rgba(102,255,240,.06)":"#0D0D0D",cursor:"pointer",transition:"all .2s"}}>
                  <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checkHoje[tipo]?C.accent:C.border}`,background:checkHoje[tipo]?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>{checkHoje[tipo]&&<span style={{fontSize:12,color:"#000",fontWeight:900}}>✓</span>}</div>
                  <span style={{fontSize:14,color:checkHoje[tipo]?C.text:C.muted}}>{icon} {label}</span>
                  <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:checkHoje[tipo]?C.accent:C.muted}}>+{pontos}pts</span>
                </div>
              ))}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:8,border:`1px solid ${(aguaLog[dHoje]||0)>=Math.ceil(aguaDia(perfil.peso)/0.5)?C.accent:C.border}`,background:(aguaLog[dHoje]||0)>=Math.ceil(aguaDia(perfil.peso)/0.5)?"rgba(102,255,240,.06)":"#0D0D0D"}}>
                <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${(aguaLog[dHoje]||0)>=Math.ceil(aguaDia(perfil.peso)/0.5)?C.accent:C.border}`,background:(aguaLog[dHoje]||0)>=Math.ceil(aguaDia(perfil.peso)/0.5)?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{(aguaLog[dHoje]||0)>=Math.ceil(aguaDia(perfil.peso)/0.5)&&<span style={{fontSize:12,color:"#000",fontWeight:900}}>✓</span>}</div>
                <span style={{fontSize:14,color:(aguaLog[dHoje]||0)>=Math.ceil(aguaDia(perfil.peso)/0.5)?C.text:C.muted}}>💧 Meta de Água Atingida</span>
                <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:(aguaLog[dHoje]||0)>=Math.ceil(aguaDia(perfil.peso)/0.5)?C.accent:C.muted}}>+25pts</span>
              </div>
            </div>
          </div>
        );
      })()}
      <div className="card-accent water-section"><div className="water-header"><div><p className="water-title">💧 Hidratação Diária</p><p className="water-meta">Meta: {litrosNecessarios}L por dia ({garrafas} garrafas de 500ml)</p></div><div style={{textAlign:"right"}}><div className="water-total">{litrosHoje}L / {litrosNecessarios}L</div><div style={{fontSize:11,color:C.muted}}>{aguaPct}% da meta</div></div></div><div className="water-bar-bg"><div className="water-bar-fill" style={{width:`${aguaPct}%`}}/></div><div className="water-bottles">{Array.from({length:garrafas},(_,i)=>(<div key={i} className="bottle" onClick={()=>onToggleAgua(i+1)}><div className={`bottle-icon${aguaHoje>i?" full":""}`}>💧</div><div className="bottle-label">{(i+1)*500}ml</div></div>))}</div>{aguaHoje>=garrafas&&(<p style={{textAlign:"center",marginTop:10,fontSize:13,color:C.accent,fontWeight:700}}>✅ Meta de hidratação atingida hoje!</p>)}</div>
      {protocolo?.kcal&&(<div className="card" style={{padding:"18px 20px",marginTop:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Distribuição de Macros</p><div className="macro-grid"><div className="card macro-card"><div className="macro-val">{protocolo.kcal}</div><div className="macro-label">kcal/dia</div></div><div className="card macro-card"><div className="macro-val">{protocolo.prot}g</div><div className="macro-label">Proteína</div></div><div className="card macro-card"><div className="macro-val">{protocolo.carb}g</div><div className="macro-label">Carboidrato</div></div></div>{protocolo.dica&&(<div style={{background:"rgba(102,255,240,.05)",border:`1px solid rgba(102,255,240,.15)`,borderRadius:8,padding:"12px 16px",fontSize:13,color:C.lgray}}>💡 <strong style={{color:C.accent}}>Dica IA:</strong> {protocolo.dica}</div>)}</div>)}
      {(()=>{
        const tmbVal=tmb(perfil.peso,perfil.altura,perfil.idade,perfil.sexo);
        const fator=ATIVIDADE[perfil.nivelAtividade]||1.55;
        const tdeeVal=Math.round(tmbVal*fator);
        const metaKcal=protocolo?.kcal||(isMassa?tdeeVal+400:tdeeVal-500);
        const gastoTotal=calTreino>0?tmbVal+calTreino:tdeeVal;
        const deficitComTreino=isMassa?metaKcal-gastoTotal:gastoTotal-metaKcal;
        const corDeficit=isMassa?(deficitComTreino>=300?"#22c55e":deficitComTreino>=0?"#f59e0b":"#ff6b6b"):(deficitComTreino>=500?"#22c55e":deficitComTreino>=200?"#f59e0b":"#ff6b6b");
        const labelDeficit=isMassa?(deficitComTreino>=300?"🔥 Superávit ideal!":deficitComTreino>=0?"⚠️ Superávit baixo":"❌ Déficit — coma mais"):(deficitComTreino>=500?"🔥 Déficit ideal!":deficitComTreino>=200?"⚠️ Déficit moderado":"❌ Déficit insuficiente");
        return (
          <div className="card" style={{padding:"20px 22px",marginTop:18,border:"1px solid rgba(102,255,240,.15)"}}>
            <p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>⚡ Taxa Metabólica & Déficit</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {[{label:"TMB",val:tmbVal,sub:"Em repouso"},{label:"TDEE",val:tdeeVal,sub:"Gasto c/ atividade"},{label:"Meta",val:metaKcal,sub:isMassa?"Superávit":"Déficit"}].map(({label,val,sub})=>(
                <div key={label} style={{background:"#0D0D0D",border:"1px solid #1a1a1a",borderRadius:8,padding:"12px",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:4}}>{label}</div>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:24,color:C.accent,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:10,color:C.muted,marginTop:3}}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{height:1,background:"rgba(255,255,255,.05)",marginBottom:16}}/>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:8}}>⌚ Calorias queimadas no treino hoje</p>
            <p style={{fontSize:11,color:"#444",marginBottom:8,lineHeight:1.5}}>Informe o gasto do seu relógio. O déficit será calculado como <strong style={{color:C.muted}}>TMB + Treino − Dieta</strong>.</p>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <input type="number" placeholder="Ex: 450 kcal (do seu relógio)" value={calTreino||""} onChange={e=>salvarCalTreino(e.target.value)} style={{flex:1,padding:"10px 14px",background:"#0D0D0D",border:"1px solid #222",borderRadius:7,color:"#fff",fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none"}} onFocus={e=>e.target.style.borderColor="#66FFF0"} onBlur={e=>e.target.style.borderColor="#222"}/>
              <button onClick={()=>salvarCalTreino(0)} style={{padding:"10px 16px",background:"transparent",border:"1px solid #333",borderRadius:7,color:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>Limpar</button>
            </div>
            <div style={{background:"rgba(0,0,0,.3)",border:`1px solid ${corDeficit}40`,borderRadius:10,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>{isMassa?"Superávit":"Déficit"} do dia</span>
                <span style={{fontSize:12,fontWeight:700,color:corDeficit}}>{labelDeficit}</span>
              </div>
              {calTreino>0?(<><div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}><span style={{color:C.muted}}>TMB</span><span style={{color:C.muted,fontWeight:600}}>{tmbVal} kcal</span></div><div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}><span style={{color:C.muted}}>+ Treino (relógio)</span><span style={{color:"#22c55e",fontWeight:600}}>+{calTreino} kcal</span></div><div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}><span style={{color:C.muted}}>− Meta dieta</span><span style={{color:"#ff6b6b",fontWeight:600}}>−{metaKcal} kcal</span></div></>):(<><div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}><span style={{color:C.muted}}>TDEE (sem treino informado)</span><span style={{color:C.muted,fontWeight:600}}>{tdeeVal} kcal</span></div><div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}><span style={{color:C.muted}}>− Meta dieta</span><span style={{color:"#ff6b6b",fontWeight:600}}>−{metaKcal} kcal</span></div></>)}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700,marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.08)"}}>
                <span style={{color:C.text}}>{isMassa?"= Superávit real":"= Déficit real"}</span>
                <span style={{color:corDeficit,fontFamily:"'Bebas Neue',cursive",fontSize:22}}>{deficitComTreino>0?"+":""}{deficitComTreino} kcal</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── RELATÓRIO SEMANAL IA ── */}
      {(()=>{
        const RELATORIO_KEY = `ic_relatorio_${perfil.email}`;
        const [relatorio, setRelatorio] = useState(()=>{try{return JSON.parse(localStorage.getItem(RELATORIO_KEY)||"null");}catch{return null;}});
        const [gerandoRel, setGerandoRel] = useState(false);

        // Coleta dados dos últimos 7 dias
        function coletarDadosSemana() {
          const dias7 = [];
          for(let i=6;i>=0;i--){
            const d=new Date(); d.setDate(d.getDate()-i);
            const str=`${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
            const chk=checkLog[str]||{};
            const agua=aguaLog[str]||0;
            const garrafas=Math.ceil(aguaDia(perfil.peso)/0.5);
            dias7.push({ data:str, treinou:!!chk.treino, dieta:!!chk.dieta, agua, metaAgua:garrafas });
          }
          const treinos7 = dias7.filter(d=>d.treinou).length;
          const dieta7   = dias7.filter(d=>d.dieta).length;
          const agua7    = dias7.filter(d=>d.agua>=d.metaAgua).length;
          const pesoAtual = pesosLog.length?pesosLog[pesosLog.length-1].val:parseFloat(perfil.peso);
          const pesoSemAntras = pesosLog.length>=2?pesosLog[Math.max(0,pesosLog.length-8)].val:parseFloat(perfil.peso);
          const varPeso = (pesoAtual - pesoSemAntras).toFixed(1);
          return { dias7, treinos7, dieta7, agua7, pesoAtual, pesoSemAntras, varPeso, score:calcScore(), streak:calcStreak() };
        }

        async function gerarRelatorio() {
          setGerandoRel(true);
          const dados = coletarDadosSemana();
          const prompt = `Você é o coach de elite do app IRONCUT 21D. Gere um relatório semanal motivador e profissional em JSON.

Dados do aluno ${perfil.nome.split(" ")[0]} (${perfil.sexo}, ${perfil.idade} anos, objetivo: ${perfil.objetivo==="massa"?"ganho de massa":"emagrecimento"}):
- Treinos realizados: ${dados.treinos7}/7 dias
- Dias seguindo a dieta: ${dados.dieta7}/7 dias  
- Dias com meta de hidratação: ${dados.agua7}/7 dias
- Variação de peso na semana: ${dados.varPeso}kg
- Score atual: ${dados.score}/100
- Sequência atual: ${dados.streak} dias
- Meta calórica: ${protocolo?.kcal||0} kcal/dia
- Proteína diária: ${protocolo?.prot||0}g

Retorne SOMENTE JSON válido sem markdown:
{
  "titulo": "título impactante da semana (ex: SEMANA DE FOGO 🔥)",
  "nota": número de 0 a 10,
  "resumo": "parágrafo curto e direto sobre a semana (2-3 frases)",
  "destaques": ["ponto positivo 1", "ponto positivo 2", "ponto positivo 3"],
  "melhorar": ["ponto a melhorar 1", "ponto a melhorar 2"],
  "desafio": "desafio específico para a próxima semana (1 frase motivadora)",
  "mensagem": "mensagem final personalizada e motivadora (2 frases)"
}`;

          try {
            const res = await fetch("/api/chat", {
              method:"POST", headers:{"Content-Type":"application/json"},
              body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
                messages:[{ role:"user", content:prompt }]
              })
            });
            const d = await res.json();
            const txt = d?.content?.[0]?.text||"";
            const json = JSON.parse(txt.replace(/```json|```/g,"").trim());
            const novoRel = { ...json, dados, geradoEm: new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}), geradoHora: new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) };
            setRelatorio(novoRel);
            localStorage.setItem(RELATORIO_KEY, JSON.stringify(novoRel));
          } catch { alert("Erro ao gerar relatório. Tente novamente."); }
          setGerandoRel(false);
        }

        function exportarRelatorio() {
          if(!relatorio) return;
          const dados = relatorio.dados;
          const notaCor = relatorio.nota>=8?"#22c55e":relatorio.nota>=6?"#66FFF0":relatorio.nota>=4?"#f59e0b":"#ff6b6b";
          const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório IRONCUT — ${perfil.nome}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0A0A0A;color:#fff;font-family:'Barlow',sans-serif;padding:0;min-height:100vh}
  .page{max-width:700px;margin:0 auto;padding:40px 32px}
  
  /* HEADER */
  .header{display:flex;justify-content:space-between;align-items:center;padding-bottom:24px;border-bottom:1px solid #202020;margin-bottom:32px}
  .logo-area{display:flex;align-items:center;gap:14px}
  .logo-img{width:56px;height:56px;object-fit:contain}
  .logo-text{font-family:'Bebas Neue',cursive;font-size:28px;letter-spacing:6px;color:#fff}
  .logo-text span{color:#66FFF0}
  .logo-sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#555;margin-top:2px}
  .header-right{text-align:right}
  .header-badge{display:inline-block;background:rgba(102,255,240,.1);border:1px solid rgba(102,255,240,.25);color:#66FFF0;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;border-radius:4px;margin-bottom:6px}
  .header-data{font-size:11px;color:#555;letter-spacing:1px}

  /* HERO */
  .hero{background:linear-gradient(135deg,#0F0F0F 0%,#141414 100%);border:1px solid #202020;border-radius:16px;padding:32px;margin-bottom:24px;position:relative;overflow:hidden}
  .hero::before{content:'';position:absolute;top:0;right:0;width:200px;height:200px;background:radial-gradient(circle,rgba(102,255,240,.08) 0%,transparent 70%);pointer-events:none}
  .hero-label{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#66FFF0;margin-bottom:8px}
  .hero-titulo{font-family:'Bebas Neue',cursive;font-size:42px;letter-spacing:2px;line-height:1;margin-bottom:16px;color:#fff}
  .hero-aluno{display:flex;align-items:center;gap:12px;margin-bottom:20px}
  .hero-aluno-nome{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:1px}
  .hero-aluno-info{font-size:12px;color:#666;margin-top:2px}
  .hero-nota-wrap{display:flex;align-items:center;gap:16px}
  .hero-nota{font-family:'Bebas Neue',cursive;font-size:72px;line-height:1;color:${notaCor};text-shadow:0 0 30px ${notaCor}40}
  .hero-nota-label{font-size:11px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-top:4px}
  .hero-resumo{font-size:14px;color:#BBBBBB;line-height:1.8;margin-top:16px;padding-top:16px;border-top:1px solid #1a1a1a}

  /* STATS */
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
  .stat{background:#0F0F0F;border:1px solid #1a1a1a;border-radius:10px;padding:16px;text-align:center}
  .stat-val{font-family:'Bebas Neue',cursive;font-size:32px;line-height:1;margin-bottom:4px}
  .stat-label{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555}
  .stat-sub{font-size:10px;color:#444;margin-top:3px}

  /* SEMANA VISUAL */
  .semana-card{background:#0F0F0F;border:1px solid #1a1a1a;border-radius:12px;padding:20px 24px;margin-bottom:24px}
  .card-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:14px}
  .semana-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
  .dia-box{text-align:center;padding:10px 4px;border-radius:8px;border:1px solid #1a1a1a}
  .dia-nome{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#555;margin-bottom:6px}
  .dia-num{font-family:'Bebas Neue',cursive;font-size:20px;color:#fff;line-height:1;margin-bottom:6px}
  .dia-bars{display:flex;flex-direction:column;gap:3px;align-items:center}
  .dia-bar{width:20px;height:4px;border-radius:2px}

  /* DESTAQUES / MELHORAR */
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
  .info-card{background:#0F0F0F;border-radius:12px;padding:20px;border:1px solid #1a1a1a}
  .info-card.green{border-color:rgba(34,197,94,.2);background:rgba(34,197,94,.04)}
  .info-card.yellow{border-color:rgba(245,158,11,.2);background:rgba(245,158,11,.04)}
  .info-item{display:flex;gap:10px;font-size:13px;color:#BBBBBB;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);line-height:1.5}
  .info-item:last-child{border-bottom:none}
  .info-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px}

  /* DESAFIO */
  .desafio-card{background:linear-gradient(135deg,rgba(102,255,240,.08),rgba(102,255,240,.02));border:1px solid rgba(102,255,240,.2);border-radius:12px;padding:24px;margin-bottom:24px;text-align:center}
  .desafio-label{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#66FFF0;margin-bottom:8px}
  .desafio-texto{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:20px;color:#fff;line-height:1.4}

  /* MENSAGEM FINAL */
  .mensagem-card{background:#0F0F0F;border:1px solid #202020;border-radius:12px;padding:24px;margin-bottom:32px;text-align:center}
  .mensagem-texto{font-size:15px;color:#BBBBBB;line-height:1.8;font-style:italic}

  /* FOOTER */
  .footer{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid #1a1a1a}
  .footer-logo{font-family:'Bebas Neue',cursive;font-size:16px;letter-spacing:4px;color:#333}
  .footer-logo span{color:#66FFF0}
  .footer-text{font-size:10px;color:#333;letter-spacing:1px}

  @media print{body{background:#0A0A0A!important}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
</style></head><body><div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="logo-area">
      <div style="width:56px;height:56px;background:linear-gradient(135deg,#00D4C8,#66FFF0);border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',cursive;font-size:22px;color:#000;letter-spacing:2px;flex-shrink:0">IC</div>
      <div>
        <div class="logo-text"><span>IRON</span>CUT</div>
        <div class="logo-sub">Protocolo de Transformação Corporal</div>
      </div>
    </div>
    <div class="header-right">
      <div class="header-badge">📊 Relatório Semanal</div>
      <div class="header-data">Gerado em ${relatorio.geradoEm} às ${relatorio.geradoHora}</div>
    </div>
  </div>

  <!-- HERO -->
  <div class="hero">
    <div class="hero-label">Avaliação da Semana</div>
    <div class="hero-titulo">${relatorio.titulo}</div>
    <div class="hero-aluno">
      <div>
        <div class="hero-aluno-nome">${perfil.nome}</div>
        <div class="hero-aluno-info">${perfil.sexo.charAt(0).toUpperCase()+perfil.sexo.slice(1)} • ${perfil.idade} anos • ${perfil.objetivo==="massa"?"Ganho de Massa":"Emagrecimento"}</div>
      </div>
    </div>
    <div class="hero-nota-wrap">
      <div>
        <div class="hero-nota">${relatorio.nota}</div>
        <div class="hero-nota-label">/ 10 pontos</div>
      </div>
      <div style="flex:1;height:8px;background:#1a1a1a;border-radius:4px;overflow:hidden;margin-left:8px">
        <div style="height:100%;width:${relatorio.nota*10}%;background:linear-gradient(90deg,${notaCor},${notaCor}cc);border-radius:4px"></div>
      </div>
    </div>
    <div class="hero-resumo">${relatorio.resumo}</div>
  </div>

  <!-- STATS -->
  <div class="stats-grid">
    ${[
      {label:"Treinos",val:`${dados.treinos7}/7`,sub:"dias treinados",cor:dados.treinos7>=5?"#22c55e":dados.treinos7>=3?"#f59e0b":"#ff6b6b"},
      {label:"Dieta",val:`${dados.dieta7}/7`,sub:"dias no plano",cor:dados.dieta7>=5?"#22c55e":dados.dieta7>=3?"#f59e0b":"#ff6b6b"},
      {label:"Hidratação",val:`${dados.agua7}/7`,sub:"metas atingidas",cor:dados.agua7>=5?"#22c55e":dados.agua7>=3?"#f59e0b":"#ff6b6b"},
      {label:"Score",val:dados.score,sub:"pontos IRONCUT",cor:dados.score>=71?"#66FFF0":dados.score>=41?"#f59e0b":"#666"},
    ].map(s=>`<div class="stat"><div class="stat-val" style="color:${s.cor}">${s.val}</div><div class="stat-label">${s.label}</div><div class="stat-sub">${s.sub}</div></div>`).join("")}
  </div>

  <!-- SEMANA VISUAL -->
  <div class="semana-card">
    <div class="card-title">📅 Dias da Semana</div>
    <div class="semana-grid">
      ${dados.dias7.map(d=>{
        const nomes=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
        const partes=d.data.split("/");
        const dt=new Date(partes[2],partes[1]-1,partes[0]);
        const nomeDia=nomes[dt.getDay()];
        const total=(d.treinou?1:0)+(d.dieta?1:0)+(d.agua>=d.metaAgua?1:0);
        const borCor=total===3?"rgba(34,197,94,.3)":total===2?"rgba(102,255,240,.2)":total===1?"rgba(245,158,11,.2)":"#1a1a1a";
        return `<div class="dia-box" style="border-color:${borCor}">
          <div class="dia-nome">${nomeDia}</div>
          <div class="dia-num">${partes[0]}</div>
          <div class="dia-bars">
            <div class="dia-bar" style="background:${d.treinou?"#22c55e":"#1a1a1a"}"></div>
            <div class="dia-bar" style="background:${d.dieta?"#66FFF0":"#1a1a1a"}"></div>
            <div class="dia-bar" style="background:${d.agua>=d.metaAgua?"#60a5fa":"#1a1a1a"}"></div>
          </div>
        </div>`;
      }).join("")}
    </div>
    <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap">
      ${[["#22c55e","Treino"],["#66FFF0","Dieta"],["#60a5fa","Hidratação"]].map(([cor,label])=>`<div style="display:flex;align-items:center;gap:6px;font-size:10px;color:#555"><div style="width:8px;height:8px;border-radius:2px;background:${cor}"></div>${label}</div>`).join("")}
    </div>
  </div>

  <!-- DESTAQUES + MELHORAR -->
  <div class="two-col">
    <div class="info-card green">
      <div class="card-title">✅ Destaques da Semana</div>
      ${relatorio.destaques.map(d=>`<div class="info-item"><div class="info-dot" style="background:#22c55e"></div>${d}</div>`).join("")}
    </div>
    <div class="info-card yellow">
      <div class="card-title">⚠️ Pontos a Melhorar</div>
      ${relatorio.melhorar.map(d=>`<div class="info-item"><div class="info-dot" style="background:#f59e0b"></div>${d}</div>`).join("")}
    </div>
  </div>

  <!-- DESAFIO -->
  <div class="desafio-card">
    <div class="desafio-label">🎯 Desafio da Próxima Semana</div>
    <div class="desafio-texto">${relatorio.desafio}</div>
  </div>

  <!-- MENSAGEM FINAL -->
  <div class="mensagem-card">
    <div style="font-size:24px;margin-bottom:12px">💬</div>
    <div class="mensagem-texto">"${relatorio.mensagem}"</div>
    <div style="margin-top:12px;font-size:11px;color:#444;letter-spacing:2px;text-transform:uppercase">— Coach IRONCUT IA</div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-logo"><span>IRON</span>CUT 21D</div>
    <div class="footer-text">appironcut.com • ${relatorio.geradoEm}</div>
  </div>

</div></body></html>`;

          const blob = new Blob([html], {type:"text/html;charset=utf-8"});
          const url = URL.createObjectURL(blob);
          const win = window.open(url,"_blank");
          if(win){ win.onload=()=>{ setTimeout(()=>{ win.print(); },600); }; }
        }

        return (
          <div className="card" style={{padding:"20px 22px",marginTop:18,background:"#0F0F0F",border:"1px solid rgba(102,255,240,.15)"}}>
            {/* HEADER DO CARD */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,color:C.text}}>📊 RELATÓRIO SEMANAL</p>
                <p style={{fontSize:11,color:C.muted,marginTop:2}}>Análise completa gerada pela IA com base nos seus dados</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                {relatorio&&<button onClick={exportarRelatorio} style={{padding:"7px 14px",background:"transparent",border:"1px solid rgba(102,255,240,.3)",borderRadius:7,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer"}}>📄 PDF</button>}
                <button onClick={gerarRelatorio} disabled={gerandoRel} style={{padding:"7px 16px",background:gerandoRel?"rgba(102,255,240,.1)":"linear-gradient(135deg,#00D4C8,#66FFF0)",color:gerandoRel?"#66FFF0":"#000",border:"none",borderRadius:7,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:gerandoRel?"not-allowed":"pointer",opacity:gerandoRel?0.7:1}}>
                  {gerandoRel?"⏳ Gerando...":relatorio?"🔄 Atualizar":"⚡ Gerar Relatório"}
                </button>
              </div>
            </div>

            {/* ESTADO VAZIO */}
            {!relatorio&&!gerandoRel&&(
              <div style={{textAlign:"center",padding:"28px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>📋</div>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Nenhum relatório gerado</p>
                <p style={{fontSize:13,color:C.muted,lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>Clique em <strong style={{color:C.accent}}>Gerar Relatório</strong> para receber uma análise completa da sua semana com destaques, pontos de melhora e desafios.</p>
              </div>
            )}

            {/* LOADING */}
            {gerandoRel&&(
              <div style={{textAlign:"center",padding:"28px 0"}}>
                <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
                  {[0,1,2].map(i=>(<div key={i} style={{width:10,height:10,borderRadius:"50%",background:C.accent,animation:`typing 1.2s ease-in-out ${i*0.2}s infinite`}}/>))}
                </div>
                <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:18,letterSpacing:3,color:C.accent}}>Analisando sua semana...</p>
                <p style={{fontSize:12,color:C.muted,marginTop:6}}>A IA está revisando treinos, dieta, hidratação e evolução</p>
              </div>
            )}

            {/* RELATÓRIO INLINE */}
            {relatorio&&!gerandoRel&&(()=>{
              const dados = relatorio.dados;
              const notaCor = relatorio.nota>=8?"#22c55e":relatorio.nota>=6?C.accent:relatorio.nota>=4?"#f59e0b":"#ff6b6b";
              return(
                <div style={{animation:"fadeUp .4s ease"}}>
                  {/* NOTA + TÍTULO */}
                  <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px 20px",background:"rgba(0,0,0,.3)",borderRadius:10,marginBottom:16}}>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:56,lineHeight:1,color:notaCor,textShadow:`0 0 20px ${notaCor}40`}}>{relatorio.nota}</div>
                      <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>/ 10</div>
                    </div>
                    <div style={{flex:1}}>
                      <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:2,color:C.text,lineHeight:1,marginBottom:6}}>{relatorio.titulo}</p>
                      <div style={{height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden",marginBottom:6}}>
                        <div style={{height:"100%",width:`${relatorio.nota*10}%`,background:`linear-gradient(90deg,${notaCor}88,${notaCor})`,borderRadius:3,transition:"width .8s ease"}}/>
                      </div>
                      <p style={{fontSize:11,color:C.muted}}>Gerado em {relatorio.geradoEm} às {relatorio.geradoHora}</p>
                    </div>
                  </div>

                  {/* STATS 4 COLUNAS */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                    {[
                      {label:"Treinos",val:`${dados.treinos7}/7`,cor:dados.treinos7>=5?"#22c55e":dados.treinos7>=3?"#f59e0b":"#ff6b6b"},
                      {label:"Dieta",val:`${dados.dieta7}/7`,cor:dados.dieta7>=5?"#22c55e":dados.dieta7>=3?"#f59e0b":"#ff6b6b"},
                      {label:"Hidratação",val:`${dados.agua7}/7`,cor:dados.agua7>=5?"#22c55e":dados.agua7>=3?"#f59e0b":"#ff6b6b"},
                      {label:"Score",val:dados.score,cor:dados.score>=71?C.accent:dados.score>=41?"#f59e0b":"#666"},
                    ].map(({label,val,cor})=>(
                      <div key={label} style={{background:"#0D0D0D",border:"1px solid #1a1a1a",borderRadius:8,padding:"12px",textAlign:"center"}}>
                        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:26,color:cor,lineHeight:1}}>{val}</div>
                        <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1.5,marginTop:3}}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* RESUMO */}
                  <div style={{background:"rgba(102,255,240,.04)",border:"1px solid rgba(102,255,240,.1)",borderRadius:8,padding:"14px 16px",marginBottom:16,fontSize:13,color:C.lgray,lineHeight:1.8}}>
                    {relatorio.resumo}
                  </div>

                  {/* DESTAQUES + MELHORAR */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                    <div style={{background:"rgba(34,197,94,.05)",border:"1px solid rgba(34,197,94,.2)",borderRadius:10,padding:"14px 16px"}}>
                      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1.5,color:"#22c55e",marginBottom:10}}>✅ Destaques</p>
                      {relatorio.destaques.map((d,i)=>(
                        <div key={i} style={{display:"flex",gap:8,fontSize:12,color:C.lgray,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)",lineHeight:1.5}}>
                          <span style={{color:"#22c55e",flexShrink:0}}>▸</span>{d}
                        </div>
                      ))}
                    </div>
                    <div style={{background:"rgba(245,158,11,.05)",border:"1px solid rgba(245,158,11,.2)",borderRadius:10,padding:"14px 16px"}}>
                      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1.5,color:"#f59e0b",marginBottom:10}}>⚠️ Melhorar</p>
                      {relatorio.melhorar.map((d,i)=>(
                        <div key={i} style={{display:"flex",gap:8,fontSize:12,color:C.lgray,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)",lineHeight:1.5}}>
                          <span style={{color:"#f59e0b",flexShrink:0}}>▸</span>{d}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DESAFIO */}
                  <div style={{background:"rgba(102,255,240,.06)",border:"1px solid rgba(102,255,240,.2)",borderRadius:10,padding:"16px 20px",marginBottom:16,textAlign:"center"}}>
                    <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.accent,marginBottom:8}}>🎯 Desafio da Próxima Semana</p>
                    <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,color:C.text,lineHeight:1.4}}>{relatorio.desafio}</p>
                  </div>

                  {/* MENSAGEM FINAL */}
                  <div style={{background:"#0D0D0D",border:"1px solid #1a1a1a",borderRadius:10,padding:"16px 20px",textAlign:"center"}}>
                    <p style={{fontSize:13,color:C.muted,lineHeight:1.8,fontStyle:"italic"}}>"{relatorio.mensagem}"</p>
                    <p style={{fontSize:10,color:"#333",letterSpacing:2,textTransform:"uppercase",marginTop:8}}>— Coach IRONCUT IA</p>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}
    </div>
  );
}
function Treinos({ protocolo, perfil, onUpdateProtocolo }) {
  const [msgs,setMsgs]=useState([{role:"ai",text:`Olá ${perfil.nome.split(" ")[0]}! Sou seu Personal IA 💪 Posso substituir exercícios e o plano será ATUALIZADO automaticamente!`}]);
  const [input,setInput]=useState(""); const [load,setLoad]=useState(false);
  const dias=protocolo?.treinos?Object.entries(protocolo.treinos):[];
  const CARGA_KEY=`ic_cargas_${perfil.email}`;
  const [cargas,setCargas]=useState(()=>{try{return JSON.parse(localStorage.getItem(CARGA_KEY)||"{}");}catch{return{};}});

  // ── CALCULADORA 1RM ──────────────────────────────────────────────────────
  const [modal1RM, setModal1RM] = useState(null); // {nome, carga, reps}
  const [reps1RM, setReps1RM] = useState("8");

  // Fórmulas 1RM (usamos média das 3 principais)
  function calc1RM(carga, reps) {
    const c = parseFloat(carga), r = parseInt(reps);
    if (!c || !r || r < 1) return null;
    if (r === 1) return c;
    const epley   = c * (1 + r / 30);
    const brzycki = c * (36 / (37 - r));
    const lander  = (100 * c) / (101.3 - 2.67123 * r);
    const media   = (epley + brzycki + lander) / 3;
    return parseFloat(media.toFixed(1));
  }

  // Tabela de % do 1RM por reps
  function tabelaReps(rm1) {
    return [1,2,3,4,5,6,8,10,12,15].map(r => ({
      reps: r,
      carga: parseFloat((rm1 * [1,.97,.94,.92,.89,.86,.81,.75,.70,.64][r===1?0:r===2?1:r===3?2:r===4?3:r===5?4:r===6?5:r===8?6:r===10?7:r===12?8:9]).toFixed(1))
    }));
  }
  const [timer, setTimer] = useState(null);        // segundos restantes ou null
  const [timerTotal, setTimerTotal] = useState(60); // total configurado
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [timerExercicio, setTimerExercicio] = useState("");
  const timerRef = useEffect;

  useEffect(() => {
    if (!timerAtivo || timer === null) return;
    if (timer <= 0) {
      setTimerAtivo(false);
      // Vibrar se suportado
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      // Notificação sonora via AudioContext
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [880, 1108, 1318].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = "sine";
          gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.4);
          osc.start(ctx.currentTime + i * 0.18);
          osc.stop(ctx.currentTime + i * 0.18 + 0.4);
        });
      } catch {}
      return;
    }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, timerAtivo]);

  function iniciarTimer(segundos, exercicio) {
    setTimer(segundos);
    setTimerTotal(segundos);
    setTimerAtivo(true);
    setTimerExercicio(exercicio);
  }
  function pausarTimer() { setTimerAtivo(false); }
  function retormarTimer() { if (timer > 0) setTimerAtivo(true); }
  function resetarTimer() { setTimer(timerTotal); setTimerAtivo(false); }

  const timerPct = timer !== null ? Math.round((timer / timerTotal) * 100) : 100;
  const timerCor = timer !== null
    ? (timer > timerTotal * 0.5 ? "#22c55e" : timer > timerTotal * 0.25 ? "#f59e0b" : "#ff6b6b")
    : C.accent;
  const formatTimer = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  function salvarCarga(dia,idx,val){if(!val.trim())return;const key=`${dia}-${idx}`;const atual=cargas[key]||{carga:"",historico:[]};const hist=atual.historico.filter(h=>h!==val).slice(-4);hist.push(val);const novo={...cargas,[key]:{carga:val,historico:hist}};setCargas(novo);localStorage.setItem(CARGA_KEY,JSON.stringify(novo));}

  function sugestaoProgressao(key){
    const dado=cargas[key]||{carga:"",historico:[]};
    const hist=dado.historico;
    if(hist.length<3)return null;
    const ultimas3=hist.slice(-3).map(h=>parseFloat(h)||0);
    const todasIguais=ultimas3.every(v=>v===ultimas3[0]&&v>0);
    if(!todasIguais)return null;
    const cargaAtual=ultimas3[0];
    const aumento=cargaAtual<=20?2.5:5;
    return{cargaAtual,sugerida:cargaAtual+aumento,aumento};
  }

  async function send(msg){
    const m=msg||input; if(!m.trim())return;
    setMsgs(p=>[...p,{role:"user",text:m}]); setInput(""); setLoad(true);
    setMsgs(p=>[...p,{role:"ai",text:"typing"}]);
    const resp=await perguntarIA(m,"treino",perfil,protocolo);
    const texto=resp.texto||resp;
    if(resp.atualizacaoTreino&&onUpdateProtocolo){const novoProto=aplicarAtualizacaoTreino(protocolo,resp.atualizacaoTreino);onUpdateProtocolo(novoProto);setMsgs(p=>[...p.filter(x=>x.text!=="typing"),{role:"ai",text:texto},{role:"ai",text:"✅ Treino atualizado! O exercício foi substituído no seu plano.",isUpdate:true}]);}
    else{setMsgs(p=>[...p.filter(x=>x.text!=="typing"),{role:"ai",text:texto}]);}
    setLoad(false);
  }

  const quickChips=["Não gosto de Leg Press, pode substituir?","Substitua Supino Reto por exercício em casa","Não tenho halteres, como adaptar?","Exercício alternativo para Puxada Frente","Quero focar mais em glúteos","Como aumentar a intensidade do treino?"];

  return(
    <div>
      <div className="sec-label">Protocolo de Treinos</div>
      <p className="sec-title">TREINOS {perfil.objetivo==="massa"?"HIPERTROFIA":"IRONCUT"}</p>

      {/* ── TEMPORIZADOR FIXO NO TOPO ── */}
      <div className="card" style={{padding:"16px 20px",marginBottom:18,border:`1px solid ${timer===0?"rgba(102,255,240,.4)":timerAtivo?"rgba(34,197,94,.3)":"rgba(255,255,255,.08)"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:1,color:C.muted}}>⏱️ Descanso Entre Séries</p>
            {timerExercicio&&<p style={{fontSize:11,color:C.accent,marginTop:2}}>{timerExercicio}</p>}
          </div>
          <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:42,lineHeight:1,color:timer===0?"#66FFF0":timerCor,textShadow:timerAtivo?`0 0 20px ${timerCor}60`:"none",transition:"color .3s"}}>
            {timer!==null ? (timer===0?"✓ PRONTO!":formatTimer(timer)) : "--:--"}
          </div>
        </div>

        {/* Barra de progresso circular via SVG linear */}
        {timer !== null && timer > 0 && (
          <div style={{height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden",marginBottom:12}}>
            <div style={{height:"100%",width:`${timerPct}%`,background:`linear-gradient(90deg,${timerCor},${timerCor})`,borderRadius:3,transition:"width 1s linear",boxShadow:`0 0 8px ${timerCor}60`}}/>
          </div>
        )}
        {timer===0&&(
          <div style={{height:6,background:"rgba(102,255,240,.3)",borderRadius:3,marginBottom:12,animation:"pulse 1s ease-in-out infinite"}}/>
        )}

        {/* Botões de tempo rápido */}
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {[["30s",30],["45s",45],["1min",60],["90s",90],["2min",120],["3min",180]].map(([label,seg])=>(
            <button key={label} onClick={()=>iniciarTimer(seg, timerExercicio)}
              style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${timer!==null&&timerTotal===seg?"rgba(102,255,240,.5)":"#2a2a2a"}`,background:timer!==null&&timerTotal===seg?"rgba(102,255,240,.1)":"#0D0D0D",color:timer!==null&&timerTotal===seg?C.accent:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer",transition:"all .2s"}}>
              {label}
            </button>
          ))}
        </div>

        {/* Controles */}
        <div style={{display:"flex",gap:8}}>
          {timerAtivo
            ? <button onClick={pausarTimer} style={{flex:1,padding:"9px",background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",borderRadius:7,color:"#f59e0b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer"}}>⏸ Pausar</button>
            : <button onClick={retormarTimer} disabled={timer===null||timer===0} style={{flex:1,padding:"9px",background:timer===null||timer===0?"rgba(255,255,255,.04)":"rgba(34,197,94,.15)",border:`1px solid ${timer===null||timer===0?"#1a1a1a":"rgba(34,197,94,.3)"}`,borderRadius:7,color:timer===null||timer===0?C.muted:"#22c55e",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,letterSpacing:1.5,textTransform:"uppercase",cursor:timer===null||timer===0?"not-allowed":"pointer"}}>▶ Retomar</button>
          }
          <button onClick={resetarTimer} disabled={timer===null} style={{padding:"9px 16px",background:"transparent",border:"1px solid #2a2a2a",borderRadius:7,color:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>↺ Reset</button>
        </div>
      </div>

      <div className="week-grid">{dias.map(([dia,info])=>{
        // SVG anatômico por grupo muscular
        const svgMusculo = (nome) => {
          const n = nome.toLowerCase();
          // Peito + Tríceps
          if(n.includes("peito")||n.includes("tríceps")||n.includes("triceps")){return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              {/* torso base */}
              <path d="M30 45 Q40 30 60 28 Q80 30 90 45 L92 100 Q60 112 28 100 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
              {/* peitoral esquerdo highlight */}
              <path d="M33 50 Q42 38 58 40 L60 72 Q42 74 30 68 Z" fill={`rgba(102,255,240,0.5)`} filter="url(#glow)"/>
              {/* peitoral direito highlight */}
              <path d="M87 50 Q78 38 62 40 L60 72 Q78 74 90 68 Z" fill={`rgba(102,255,240,0.5)`} filter="url(#glow)"/>
              {/* tríceps laterais */}
              <path d="M22 55 Q18 60 19 78 Q24 82 30 78 Q28 65 30 52 Z" fill="rgba(102,255,240,0.3)"/>
              <path d="M98 55 Q102 60 101 78 Q96 82 90 78 Q92 65 90 52 Z" fill="rgba(102,255,240,0.3)"/>
              {/* linha central */}
              <line x1="60" y1="38" x2="60" y2="100" stroke="rgba(102,255,240,.2)" strokeWidth="1"/>
              {/* abs suave */}
              <path d="M48 76 Q60 78 72 76 L70 100 Q60 104 50 100 Z" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.06)" strokeWidth="1"/>
              <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            </svg>
          );}
          // Costas + Bíceps
          if(n.includes("costas")||n.includes("bíceps")||n.includes("biceps")){return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              <path d="M28 42 Q40 28 60 26 Q80 28 92 42 L95 105 Q60 118 25 105 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
              {/* trapézio */}
              <path d="M40 30 Q60 22 80 30 L75 50 Q60 44 45 50 Z" fill="rgba(102,255,240,0.4)"/>
              {/* grande dorsal esq */}
              <path d="M28 52 Q22 68 26 88 Q38 96 48 88 L50 58 Q38 48 28 52 Z" fill="rgba(102,255,240,0.5)"/>
              {/* grande dorsal dir */}
              <path d="M92 52 Q98 68 94 88 Q82 96 72 88 L70 58 Q82 48 92 52 Z" fill="rgba(102,255,240,0.5)"/>
              {/* romboides centro */}
              <path d="M46 46 Q60 40 74 46 L72 72 Q60 76 48 72 Z" fill="rgba(102,255,240,0.25)"/>
              {/* bíceps */}
              <ellipse cx="20" cy="70" rx="8" ry="16" fill="rgba(102,255,240,0.35)" transform="rotate(-10,20,70)"/>
              <ellipse cx="100" cy="70" rx="8" ry="16" fill="rgba(102,255,240,0.35)" transform="rotate(10,100,70)"/>
            </svg>
          );}
          // Pernas / Quadríceps / Glúteo / Posterior
          if(n.includes("perna")||n.includes("quadrícep")||n.includes("glúteo")||n.includes("posterior")||n.includes("lower")){return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              {/* quadríceps esq */}
              <path d="M28 30 Q42 26 50 30 L52 85 Q40 90 26 82 Z" fill="rgba(102,255,240,0.5)"/>
              {/* quadríceps dir */}
              <path d="M92 30 Q78 26 70 30 L68 85 Q80 90 94 82 Z" fill="rgba(102,255,240,0.5)"/>
              {/* separação quads */}
              <line x1="44" y1="30" x2="46" y2="84" stroke="rgba(0,0,0,.5)" strokeWidth="1.5"/>
              <line x1="76" y1="30" x2="74" y2="84" stroke="rgba(0,0,0,.5)" strokeWidth="1.5"/>
              {/* glúteos */}
              <path d="M32 20 Q60 10 88 20 L86 38 Q60 44 34 38 Z" fill="rgba(102,255,240,0.3)"/>
              {/* panturrilha */}
              <ellipse cx="40" cy="112" rx="10" ry="16" fill="rgba(102,255,240,0.2)"/>
              <ellipse cx="80" cy="112" rx="10" ry="16" fill="rgba(102,255,240,0.2)"/>
              {/* linha divisória pernas */}
              <line x1="60" y1="26" x2="60" y2="130" stroke="rgba(0,0,0,.4)" strokeWidth="2"/>
            </svg>
          );}
          // Ombro + Trapézio / Desenvolvimento
          if(n.includes("ombro")||n.includes("trapézio")||n.includes("trapezio")||n.includes("desenvolvimento")){return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              <path d="M32 50 Q42 36 60 34 Q78 36 88 50 L90 95 Q60 106 30 95 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
              {/* deltoide esq */}
              <path d="M14 44 Q10 36 20 30 Q30 26 38 34 L36 60 Q22 62 14 54 Z" fill="rgba(102,255,240,0.6)"/>
              {/* deltoide dir */}
              <path d="M106 44 Q110 36 100 30 Q90 26 82 34 L84 60 Q98 62 106 54 Z" fill="rgba(102,255,240,0.6)"/>
              {/* trapézio */}
              <path d="M36 28 Q60 18 84 28 L80 50 Q60 44 40 50 Z" fill="rgba(102,255,240,0.45)"/>
              {/* pescoço */}
              <path d="M52 18 Q60 12 68 18 L66 32 Q60 28 54 32 Z" fill="rgba(102,255,240,0.2)"/>
              {/* torso corpo */}
              <path d="M40 52 Q60 56 80 52 L78 95 Q60 100 42 95 Z" fill="rgba(255,255,255,.03)"/>
            </svg>
          );}
          // HIIT / Cardio / Core / Mobilidade
          if(n.includes("hiit")||n.includes("cardio")||n.includes("core")||n.includes("mobilidade")||n.includes("abs")){return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              <path d="M34 42 Q42 30 60 28 Q78 30 86 42 L88 105 Q60 115 32 105 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
              {/* abs 6 pack */}
              {[[48,52],[48,68],[48,84],[72,52],[72,68],[72,84]].map(([x,y],i)=>(
                <ellipse key={i} cx={x} cy={y} rx="9" ry="7" fill="rgba(102,255,240,0.4)" stroke="rgba(0,0,0,.3)" strokeWidth="1"/>
              ))}
              {/* linha alba */}
              <line x1="60" y1="42" x2="60" y2="96" stroke="rgba(0,0,0,.5)" strokeWidth="1.5"/>
              {/* linha horizontal */}
              <line x1="38" y1="62" x2="82" y2="62" stroke="rgba(0,0,0,.3)" strokeWidth="1"/>
              <line x1="38" y1="78" x2="82" y2="78" stroke="rgba(0,0,0,.3)" strokeWidth="1"/>
              {/* oblíquos */}
              <path d="M34 58 Q30 72 34 88 Q40 92 46 86 L46 52 Q40 50 34 58 Z" fill="rgba(102,255,240,0.25)"/>
              <path d="M86 58 Q90 72 86 88 Q80 92 74 86 L74 52 Q80 50 86 58 Z" fill="rgba(102,255,240,0.25)"/>
            </svg>
          );}
          // Upper / Peito + Costas / Full Body
          if(n.includes("upper")||n.includes("full")){return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              <path d="M28 42 Q42 28 60 26 Q78 28 92 42 L92 100 Q60 112 28 100 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
              {/* corpo inteiro highlight */}
              <path d="M34 44 Q44 34 58 36 L60 68 Q44 70 32 64 Z" fill="rgba(102,255,240,0.4)"/>
              <path d="M86 44 Q76 34 62 36 L60 68 Q76 70 88 64 Z" fill="rgba(102,255,240,0.4)"/>
              <path d="M36 68 Q48 72 60 70 Q72 72 84 68 L82 96 Q60 104 38 96 Z" fill="rgba(102,255,240,0.2)"/>
              <ellipse cx="18" cy="66" rx="9" ry="18" fill="rgba(102,255,240,0.3)" transform="rotate(-8,18,66)"/>
              <ellipse cx="102" cy="66" rx="9" ry="18" fill="rgba(102,255,240,0.3)" transform="rotate(8,102,66)"/>
            </svg>
          );}
          // Descanso
          if(n.includes("descanso")){return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              <path d="M32 44 Q42 30 60 28 Q78 30 88 44 L88 100 Q60 112 32 100 Z" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1"/>
              <text x="60" y="78" textAnchor="middle" fill="#333" fontSize="32" fontFamily="Arial">💤</text>
            </svg>
          );}
          // Default genérico
          return(
            <svg viewBox="0 0 120 140" width="100%" height="100%">
              <ellipse cx="60" cy="70" rx="52" ry="62" fill="#111" opacity=".6"/>
              <path d="M32 44 Q42 30 60 28 Q78 30 88 44 L88 100 Q60 112 32 100 Z" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
              <path d="M36 46 Q48 36 60 36 Q72 36 84 46 L82 94 Q60 102 38 94 Z" fill="rgba(102,255,240,0.2)"/>
            </svg>
          );
        };

        return(
          <div key={dia} className="card wcard" style={{cursor:"pointer",background:"#0F0F0F",border:"1px solid #1e1e1e",transition:"border-color .2s"}}
            onMouseOver={e=>e.currentTarget.style.borderColor="rgba(102,255,240,.2)"}
            onMouseOut={e=>e.currentTarget.style.borderColor="#1e1e1e"}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",position:"relative",overflow:"hidden",minHeight:90}}>
              {/* Fundo gradiente sutil */}
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(102,255,240,.03) 0%,transparent 60%)",pointerEvents:"none"}}/>
              {/* Texto */}
              <div style={{position:"relative",zIndex:1}}>
                <div className="wcard-n">{dia}</div>
                <div className="wcard-name">{info.nome}</div>
                <div className="wcard-desc">{info.ex.length} exercícios</div>
              </div>
              {/* SVG muscular */}
              <div style={{width:90,height:100,flexShrink:0,position:"relative",zIndex:1,opacity:.9}}>
                {svgMusculo(info.nome)}
              </div>
            </div>
          </div>
        );
      })}</div>

      {/* MODAL 1RM */}
      {modal1RM&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setModal1RM(null)}>
          <div style={{background:"#0F0F0F",border:"1px solid rgba(102,255,240,.25)",borderRadius:16,maxWidth:420,width:"100%",maxHeight:"90vh",overflowY:"auto",padding:24,animation:"fadeUp .3s ease"}} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,color:C.accent}}>💪 CALC. 1RM</p>
                <p style={{fontSize:11,color:C.muted,marginTop:2}}>{modal1RM.nome}</p>
              </div>
              <button onClick={()=>setModal1RM(null)} style={{background:"transparent",border:"1px solid #333",color:C.muted,borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:16}}>✕</button>
            </div>

            {/* Inputs */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div className="field" style={{margin:0}}>
                <label>Carga (kg)</label>
                <input type="number" placeholder="Ex: 80" value={modal1RM.carga}
                  onChange={e=>setModal1RM(p=>({...p,carga:e.target.value}))}
                  style={{width:"100%",padding:"12px 14px",background:"#0D0D0D",border:"1px solid #222",borderRadius:8,color:"#fff",fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none"}}
                  onFocus={e=>e.target.style.borderColor="#66FFF0"} onBlur={e=>e.target.style.borderColor="#222"}/>
              </div>
              <div className="field" style={{margin:0}}>
                <label>Repetições feitas</label>
                <input type="number" placeholder="Ex: 8" value={reps1RM}
                  onChange={e=>setReps1RM(e.target.value)}
                  style={{width:"100%",padding:"12px 14px",background:"#0D0D0D",border:"1px solid #222",borderRadius:8,color:"#fff",fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none"}}
                  onFocus={e=>e.target.style.borderColor="#66FFF0"} onBlur={e=>e.target.style.borderColor="#222"}/>
              </div>
            </div>

            {/* Chips de reps rápidas */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
              {[3,5,6,8,10,12].map(r=>(
                <button key={r} onClick={()=>setReps1RM(String(r))}
                  style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${reps1RM===String(r)?"rgba(102,255,240,.5)":"#2a2a2a"}`,background:reps1RM===String(r)?"rgba(102,255,240,.1)":"#0D0D0D",color:reps1RM===String(r)?C.accent:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer"}}>
                  {r} reps
                </button>
              ))}
            </div>

            {/* Resultado 1RM */}
            {(()=>{
              const rm = calc1RM(modal1RM.carga, reps1RM);
              if (!rm) return null;
              const tabela = tabelaReps(rm);
              return(
                <>
                  {/* 1RM em destaque */}
                  <div style={{background:"rgba(102,255,240,.06)",border:"1px solid rgba(102,255,240,.2)",borderRadius:12,padding:"20px",textAlign:"center",marginBottom:16}}>
                    <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.muted,marginBottom:4}}>Seu 1RM Estimado</p>
                    <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:64,lineHeight:1,color:C.accent,textShadow:`0 0 30px rgba(102,255,240,.4)`}}>{rm}<span style={{fontSize:28,color:C.muted,marginLeft:4}}>kg</span></div>
                    <p style={{fontSize:11,color:C.muted,marginTop:6}}>Média Epley + Brzycki + Lander</p>
                  </div>

                  {/* Tabela de % */}
                  <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:10}}>Tabela de Cargas por Repetição</p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6,marginBottom:20}}>
                    {tabela.map(({reps,carga})=>{
                      const pct = Math.round((carga/rm)*100);
                      const cor = pct>=95?"#66FFF0":pct>=85?"#22c55e":pct>=75?"#f59e0b":"#888";
                      const isAtual = String(reps)===String(reps1RM);
                      return(
                        <div key={reps} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:isAtual?"rgba(102,255,240,.08)":"#0D0D0D",border:`1px solid ${isAtual?"rgba(102,255,240,.3)":"#1a1a1a"}`,borderRadius:7}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:18,color:isAtual?C.accent:C.text,lineHeight:1}}>{reps}×</span>
                            <span style={{fontSize:9,color:C.muted,letterSpacing:1}}>{pct}%</span>
                          </div>
                          <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,color:cor}}>{carga}<span style={{fontSize:11,color:C.muted,marginLeft:2}}>kg</span></span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Zonas de treino */}
                  <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:10}}>Zonas de Treino</p>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {[
                      {zona:"Força Máxima",reps:"1–3",pct:"93–100%",carga:`${parseFloat((rm*.96).toFixed(1))}–${rm}kg`,cor:"#66FFF0"},
                      {zona:"Força / Hipertrofia",reps:"4–6",pct:"85–92%",carga:`${parseFloat((rm*.85).toFixed(1))}–${parseFloat((rm*.92).toFixed(1))}kg`,cor:"#22c55e"},
                      {zona:"Hipertrofia",reps:"7–12",pct:"70–84%",carga:`${parseFloat((rm*.70).toFixed(1))}–${parseFloat((rm*.84).toFixed(1))}kg`,cor:"#a78bfa"},
                      {zona:"Resistência Muscular",reps:"13–20",pct:"55–69%",carga:`${parseFloat((rm*.55).toFixed(1))}–${parseFloat((rm*.69).toFixed(1))}kg`,cor:"#f59e0b"},
                    ].map(({zona,reps,pct,carga,cor})=>(
                      <div key={zona} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0D0D0D",border:"1px solid #1a1a1a",borderRadius:7}}>
                        <div>
                          <p style={{fontSize:12,fontWeight:600,color:cor}}>{zona}</p>
                          <p style={{fontSize:10,color:C.muted}}>{reps} reps • {pct}</p>
                        </div>
                        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:C.lgray}}>{carga}</p>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {dias.map(([dia,info])=>(<div key={dia} style={{marginBottom:16}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:8,color:C.accent}}>{dia} — {info.nome}</p><div className="treino-list card">{info.ex.map(([nome,sets],i)=>{const key=`${dia}-${i}`;const dadoCarga=cargas[key]||{carga:"",historico:[]};return(<div key={i}><div className="treino-item" style={{cursor:"pointer"}} onClick={()=>iniciarTimer(timerTotal||60, nome)}><div className="treino-num">{String(i+1).padStart(2,"0")}</div><div className="treino-name">{nome}</div><div style={{display:"flex",alignItems:"center",gap:8}}><div className="treino-sets">{sets}</div><span style={{fontSize:10,color:"#444",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>▶ INICIAR</span></div></div>{(()=>{const prog=sugestaoProgressao(key);const rm=dadoCarga.carga?calc1RM(dadoCarga.carga,8):null;return(<><div className="carga-row"><span className="carga-label">Carga:</span><input className="carga-input" type="number" placeholder="0" value={dadoCarga.carga} onChange={e=>{const novo={...cargas,[key]:{...dadoCarga,carga:e.target.value}};setCargas(novo);localStorage.setItem(CARGA_KEY,JSON.stringify(novo));}} onBlur={e=>salvarCarga(dia,i,e.target.value)} onClick={e=>e.stopPropagation()}/><span className="carga-unit">kg</span>{dadoCarga.historico.length>1&&(<div className="carga-hist"><span style={{fontSize:10,color:"#444",marginRight:2}}>Histórico:</span>{dadoCarga.historico.slice(0,-1).slice(-3).map((h,j)=>(<span key={j} className="carga-hist-item">{h}kg</span>))}</div>)}{dadoCarga.carga&&(<button onClick={e=>{e.stopPropagation();setReps1RM("8");setModal1RM({nome,carga:dadoCarga.carga});}} style={{marginLeft:"auto",padding:"3px 10px",background:"rgba(102,255,240,.08)",border:"1px solid rgba(102,255,240,.25)",borderRadius:5,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>1RM</button>)}</div>{rm&&dadoCarga.carga&&(<div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 18px 8px",fontSize:11,color:C.muted}}><span>Estimativa 1RM (8×):</span><span style={{fontFamily:"'Bebas Neue',cursive",fontSize:16,color:C.accent}}>{rm}kg</span></div>)}{prog&&(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 18px 10px",background:"rgba(34,197,94,.06)",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>⬆️</span><div><span style={{fontSize:11,fontWeight:700,color:"#22c55e",letterSpacing:1}}>HORA DE EVOLUIR!</span><span style={{fontSize:11,color:"#666",marginLeft:6}}>Mesma carga por 3x seguidas</span></div></div><button onClick={e=>{e.stopPropagation();const novoVal=String(prog.sugerida);const novo={...cargas,[key]:{...dadoCarga,carga:novoVal}};setCargas(novo);localStorage.setItem(CARGA_KEY,JSON.stringify(novo));}} style={{padding:"4px 12px",background:"#22c55e",color:"#000",border:"none",borderRadius:5,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,letterSpacing:1,cursor:"pointer",whiteSpace:"nowrap"}}>+{prog.aumento}kg → {prog.sugerida}kg</button></div>)}</>);})()}</div>);})}</div></div>))}
      <div className="card ia-section"><div className="ia-header"><div className="ia-dot"/><p className="ia-title">Personal IA</p><p className="ia-sub">Substitua exercícios e personalize seu treino</p></div><div className="chat-msgs">{msgs.map((m,i)=>(m.text==="typing"?<div key={i} className="cmsg ai typing"><span/><span/><span/></div>:<div key={i} className={`cmsg ${m.isUpdate?"update":m.role}`}>{m.text}</div>))}</div><div className="chips">{quickChips.map(c=><div key={c} className="chip" onClick={()=>send(c)}>{c}</div>)}</div><div className="chat-input-row"><input className="chat-input" placeholder="Ex: Não gosto de agachamento, o que posso substituir?" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="chat-send" onClick={()=>send()} disabled={load}>Enviar</button></div></div>
    </div>
  );
}

// ─── CALCULADORA DE REFEIÇÃO LIVRE ───────────────────────────────────────────
function CalcRefeicao({ perfil, protocolo }) {
  const [input, setInput] = useState("");
  const [load, setLoad] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`ic_calc_${perfil.email}_${hoje()}`) || "[]"); }
    catch { return []; }
  });

  const totalDia = historico.reduce((acc, r) => ({
    kcal: acc.kcal + (r.kcal || 0), prot: acc.prot + (r.prot || 0),
    carb: acc.carb + (r.carb || 0), gord: acc.gord + (r.gord || 0),
  }), { kcal: 0, prot: 0, carb: 0, gord: 0 });

  const metaKcal = protocolo?.kcal || 2000;
  const metaProt = protocolo?.prot || 150;
  const pctKcal = Math.min(100, Math.round((totalDia.kcal / metaKcal) * 100));
  const pctProt = Math.min(100, Math.round((totalDia.prot / metaProt) * 100));

  async function calcular() {
    if (!input.trim()) return;
    setLoad(true); setResultado(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 600,
          messages: [{ role: "user", content: `Você é um nutricionista especialista. Analise a refeição e retorne SOMENTE JSON válido sem markdown.\n\nRefeição: "${input}"\n\nFormato EXATO:\n{"descricao":"resumo curto","kcal":número,"prot":número,"carb":número,"gord":número,"alimentos":[{"nome":"item","kcal":número,"prot":número,"carb":número,"gord":número}],"dica":"1 frase de feedback"}\n\nSe não conseguir: {"erro":"motivo"}` }]
        })
      });
      const d = await res.json();
      const txt = d?.content?.[0]?.text || "";
      const json = JSON.parse(txt.replace(/```json|```/g, "").trim());
      if (json.erro) { setResultado({ erro: json.erro }); }
      else {
        setResultado(json);
        const novo = { ...json, hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
        const novoHist = [...historico, novo];
        setHistorico(novoHist);
        localStorage.setItem(`ic_calc_${perfil.email}_${hoje()}`, JSON.stringify(novoHist));
        setInput("");
      }
    } catch { setResultado({ erro: "Erro ao calcular. Tente novamente." }); }
    setLoad(false);
  }

  function limparDia() { setHistorico([]); localStorage.removeItem(`ic_calc_${perfil.email}_${hoje()}`); setResultado(null); }

  const exemplos = ["2 ovos mexidos, 40g aveia e 1 banana","Arroz com feijão, frango grelhado e salada","1 dose de whey com leite e 1 maçã","2 fatias de pão integral com pasta de amendoim","Filé de salmão 200g com batata-doce","Big Mac + batata média + Coca-Cola"];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: "#0F0F0F", border: "1px solid rgba(102,255,240,.2)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", background: "rgba(102,255,240,.04)", borderBottom: "1px solid rgba(102,255,240,.1)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🍽️</span>
          <div>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 1, color: "#fff" }}>Calculadora de Refeição Livre</p>
            <p style={{ fontSize: 11, color: "#666", marginTop: 1 }}>Descreva o que comeu e a IA calcula calorias e macros</p>
          </div>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {/* TOTAL DO DIA */}
          {historico.length > 0 && (
            <div style={{ background: "rgba(0,0,0,.3)", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>📊 Total do Dia</p>
                <button onClick={limparDia} style={{ background: "transparent", border: "1px solid #333", color: "#555", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "3px 10px", borderRadius: 4, cursor: "pointer" }}>Limpar</button>
              </div>
              {[{ label: "Calorias", val: `${totalDia.kcal} / ${metaKcal} kcal`, pct: pctKcal, cor: pctKcal >= 100 ? "#ff6b6b" : "#66FFF0", bg: pctKcal >= 100 ? "linear-gradient(90deg,#ff6b6b,#ff4444)" : "linear-gradient(90deg,#00D4C8,#66FFF0)" },
                { label: "Proteína", val: `${totalDia.prot}g / ${metaProt}g`, pct: pctProt, cor: pctProt >= 100 ? "#22c55e" : "#66FFF0", bg: "linear-gradient(90deg,#15803d,#22c55e)" }
              ].map(({ label, val, pct, cor, bg }) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#888" }}>{label}</span>
                    <span style={{ color: cor, fontWeight: 700 }}>{val} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: bg, borderRadius: 3, transition: "width .5s ease" }} />
                  </div>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginTop: 10 }}>
                {[{ label: "Kcal", val: totalDia.kcal, cor: "#66FFF0" }, { label: "Prot", val: `${totalDia.prot}g`, cor: "#22c55e" }, { label: "Carb", val: `${totalDia.carb}g`, cor: "#f59e0b" }, { label: "Gord", val: `${totalDia.gord}g`, cor: "#a78bfa" }].map(({ label, val, cor }) => (
                  <div key={label} style={{ background: "#0D0D0D", border: "1px solid #1a1a1a", borderRadius: 6, padding: "7px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 16, color: cor, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INPUT */}
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); calcular(); } }}
            placeholder="Descreva sua refeição... Ex: 200g frango grelhado, 150g arroz integral, salada"
            rows={3} style={{ width: "100%", padding: "12px 14px", background: "#0D0D0D", border: "1px solid #222", borderRadius: 8, color: "#fff", fontFamily: "'Barlow',sans-serif", fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6, marginBottom: 10 }}
            onFocus={e => e.target.style.borderColor = "#66FFF0"} onBlur={e => e.target.style.borderColor = "#222"}
          />
          <button onClick={calcular} disabled={load || !input.trim()} style={{ width: "100%", padding: "12px", background: load || !input.trim() ? "rgba(102,255,240,.1)" : "linear-gradient(135deg,#00D4C8,#66FFF0)", color: load || !input.trim() ? "#66FFF0" : "#000", border: "none", borderRadius: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: load || !input.trim() ? "not-allowed" : "pointer", marginBottom: 12 }}>
            {load ? "⏳ Calculando..." : "⚡ Calcular Macros"}
          </button>

          {/* EXEMPLOS */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {exemplos.map(ex => (
              <button key={ex} onClick={() => setInput(ex)} style={{ padding: "4px 10px", borderRadius: 20, border: "1px solid #222", fontSize: 11, color: "#555", cursor: "pointer", background: "#0D0D0D", fontFamily: "'Barlow',sans-serif" }}
                onMouseOver={e => { e.target.style.borderColor = "#66FFF0"; e.target.style.color = "#66FFF0"; }}
                onMouseOut={e => { e.target.style.borderColor = "#222"; e.target.style.color = "#555"; }}>
                {ex.length > 32 ? ex.slice(0, 29) + "..." : ex}
              </button>
            ))}
          </div>

          {/* RESULTADO */}
          {resultado && !resultado.erro && (
            <div style={{ background: "rgba(102,255,240,.04)", border: "1px solid rgba(102,255,240,.2)", borderRadius: 10, padding: "14px 16px", animation: "fadeUp .3s ease", marginBottom: 14 }}>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "#66FFF0", marginBottom: 10 }}>📋 {resultado.descricao}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
                {[{ label: "Kcal", val: resultado.kcal, cor: "#66FFF0", emoji: "🔥" }, { label: "Proteína", val: `${resultado.prot}g`, cor: "#22c55e", emoji: "💪" }, { label: "Carb", val: `${resultado.carb}g`, cor: "#f59e0b", emoji: "⚡" }, { label: "Gordura", val: `${resultado.gord}g`, cor: "#a78bfa", emoji: "🫒" }].map(({ label, val, cor, emoji }) => (
                  <div key={label} style={{ background: "#0D0D0D", border: `1px solid ${cor}25`, borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, marginBottom: 3 }}>{emoji}</div>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: cor, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              {resultado.alimentos?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Breakdown:</p>
                  {resultado.alimentos.map((al, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,.04)", fontSize: 12 }}>
                      <span style={{ color: "#bbb", flex: 1 }}>{al.nome}</span>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <span style={{ color: "#66FFF0", fontWeight: 700 }}>{al.kcal}kcal</span>
                        <span style={{ color: "#22c55e" }}>{al.prot}g P</span>
                        <span style={{ color: "#f59e0b" }}>{al.carb}g C</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {resultado.dica && <div style={{ background: "rgba(0,0,0,.3)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#aaa" }}>💡 <strong style={{ color: "#66FFF0" }}>Dica:</strong> {resultado.dica}</div>}
            </div>
          )}
          {resultado?.erro && <div style={{ background: "rgba(255,107,107,.06)", border: "1px solid rgba(255,107,107,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ff6b6b", marginBottom: 14 }}>⚠️ {resultado.erro}</div>}

          {/* HISTÓRICO DO DIA */}
          {historico.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 8 }}>Refeições de hoje:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {historico.map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#0D0D0D", border: "1px solid #1a1a1a", borderRadius: 8 }}>
                    <div><span style={{ fontSize: 10, color: "#555", marginRight: 8 }}>{r.hora}</span><span style={{ fontSize: 12, color: "#bbb" }}>{r.descricao}</span></div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: "#66FFF0", fontWeight: 700 }}>{r.kcal}kcal</span>
                      <span style={{ fontSize: 11, color: "#22c55e" }}>{r.prot}g P</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DIETA ────────────────────────────────────────────────────────────────────
function Dieta({ protocolo, perfil, onUpdateProtocolo }) {
  const [msgs,setMsgs]=useState([{role:"ai",text:`Olá ${perfil.nome.split(" ")[0]}! Sou sua Nutricionista IA 🥗 Posso substituir alimentos e o cardápio será ATUALIZADO automaticamente!`}]);
  const [input,setInput]=useState(""); const [load,setLoad]=useState(false);
  const [showLista, setShowLista]=useState(false);
  const [showCalc, setShowCalc]=useState(false);

  function gerarPDF() {
    const isMassa = perfil.objetivo === "massa";
    const tipoDieta = isMassa ? "BULKING" : "CUTTING";
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Dieta IRONCUT — ${perfil.nome}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;background:#fff;color:#111;padding:32px}.header{text-align:center;border-bottom:3px solid #00D4C8;padding-bottom:20px;margin-bottom:24px}.logo{font-size:32px;font-weight:900;letter-spacing:6px;color:#111}.logo span{color:#00D4C8}.subtitle{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#999;margin-top:4px}.tipo{display:inline-block;background:#00D4C8;color:#000;font-size:12px;font-weight:700;letter-spacing:2px;padding:4px 16px;text-transform:uppercase;margin-top:10px}.info-row{display:flex;justify-content:space-between;background:#f5f5f5;padding:12px 20px;margin-bottom:24px;border-left:4px solid #00D4C8}.info-item{text-align:center}.info-val{font-size:22px;font-weight:900;color:#00D4C8}.info-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#999}.section-title{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#999;margin-bottom:12px}.meal{margin-bottom:16px;border:1px solid #eee;page-break-inside:avoid}.meal-head{background:#f9f9f9;border-bottom:1px solid #eee;padding:10px 16px;display:flex;align-items:center;gap:12px}.meal-time{font-size:11px;font-weight:700;letter-spacing:2px;color:#00D4C8}.meal-name{font-size:14px;font-weight:700;text-transform:uppercase}.meal-body{padding:10px 16px}.meal-item{font-size:13px;color:#444;padding:3px 0;display:flex;gap:8px;align-items:flex-start}.meal-item::before{content:"—";color:#00D4C8;flex-shrink:0;font-size:10px;margin-top:2px}.supl{margin-top:20px}.supl-item{display:flex;gap:8px;font-size:13px;color:#444;padding:6px 0;border-bottom:1px solid #f0f0f0}.supl-item::before{content:"💊";flex-shrink:0}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#bbb;letter-spacing:1px}@media print{body{padding:16px}}</style></head><body><div class="header"><div class="logo"><span>IRON</span>CUT</div><div class="subtitle">Protocolo de Transformação Corporal com IA</div><div class="tipo">Dieta ${tipoDieta}</div></div><div class="info-row"><div class="info-item"><div class="info-val">${protocolo.kcal}</div><div class="info-label">Kcal / Dia</div></div><div class="info-item"><div class="info-val">${protocolo.prot}g</div><div class="info-label">Proteína</div></div><div class="info-item"><div class="info-val">${protocolo.carb}g</div><div class="info-label">Carboidrato</div></div><div class="info-item"><div class="info-val">${protocolo.gord}g</div><div class="info-label">Gordura</div></div><div class="info-item"><div class="info-val">${perfil.nome.split(" ")[0]}</div><div class="info-label">Aluno</div></div></div><div class="section-title">Plano Alimentar Diário</div>${(protocolo.refeicoes||[]).map(ref=>`<div class="meal"><div class="meal-head"><div class="meal-time">${ref.h}</div><div class="meal-name">${ref.n}</div></div><div class="meal-body">${ref.it.map(it=>`<div class="meal-item">${it}</div>`).join("")}</div></div>`).join("")}${protocolo.suplementos?.length?`<div class="supl"><div class="section-title" style="margin-top:20px">Suplementação</div>${protocolo.suplementos.map(s=>`<div class="supl-item">${s}</div>`).join("")}</div>`:""}<div class="footer">IRONCUT 21D — Gerado em ${new Date().toLocaleDateString("pt-BR")} • appironcut.com</div></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) { win.onload = () => { setTimeout(() => { win.print(); }, 500); }; }
  }

  function gerarListaCompras() {
    if (!protocolo?.refeicoes) return {};
    const todosItens = protocolo.refeicoes.flatMap(ref => ref.it);
    function parsearItem(texto) {
      const match = texto.match(/^([\d½¼¾,.]+\s*(?:g|kg|ml|l|col|dose|fatia|fatias|xícara|xícaras|porção)?\s*(?:de\s*)?)/i);
      const qtd = match ? match[1].trim() : "1x";
      const nome = texto.replace(/^[\d½¼¾,.]+\s*(?:g|kg|ml|l|col\.?|dose|fatia|fatias|xícara|xícaras|porção)?\s*(?:de\s*)?/i, "").trim();
      return { qtd, nome: nome || texto };
    }
    const categorias = {"🥩 Proteínas":[],"🍚 Carboidratos":[],"🥗 Vegetais e Frutas":[],"🥛 Laticínios e Ovos":[],"🫒 Gorduras e Temperos":[],"💊 Suplementos":[],"☕ Bebidas":[],"📦 Outros":[]};
    function categorizar(texto) {
      const t = texto.toLowerCase();
      if(/(frango|carne|atum|salmão|peixe|whey|proteína|ovo|peito)/i.test(t))return"🥩 Proteínas";
      if(/(arroz|batata|pão|aveia|macarrão|mandioca|feijão|lentilha|carboidrato|granola|mel)/i.test(t))return"🍚 Carboidratos";
      if(/(banana|maçã|fruta|salada|brócolis|legume|tomate|alface|espinafre|pepino|vegetal|verdura|iogurte)/i.test(t))return"🥗 Vegetais e Frutas";
      if(/(iogurte|leite|queijo|ovo|requeijão)/i.test(t))return"🥛 Laticínios e Ovos";
      if(/(azeite|castanha|amendoim|abacate|pasta|óleo|gordura)/i.test(t))return"🫒 Gorduras e Temperos";
      if(/(creatina|whey|suplemento|vitamina|cafeína|dose|ômega)/i.test(t))return"💊 Suplementos";
      if(/(café|chá|água|suco)/i.test(t))return"☕ Bebidas";
      return"📦 Outros";
    }
    const agrupado = {};
    todosItens.forEach(item => {
      const { qtd, nome } = parsearItem(item);
      const chave = nome.toLowerCase().trim();
      if (!agrupado[chave]) { agrupado[chave] = { nome, qtd, count: 0, categoria: categorizar(item) }; }
      agrupado[chave].count++;
    });
    Object.values(agrupado).forEach(({ nome, qtd, count, categoria }) => {
      const numMatch = qtd.match(/[\d.]+/);
      const unidadeMatch = qtd.match(/[a-zA-ZgGkKmMlLç½¼¾]+/g);
      const unidade = unidadeMatch ? unidadeMatch.join("") : "x";
      let qtdSemanal;
      if (numMatch) { const num = parseFloat(numMatch[0]); const total = (num * count * 7).toFixed(0); qtdSemanal = `${total}${unidade}`; }
      else { qtdSemanal = `${count * 7}x`; }
      if (categorias[categoria]) {
        const jaExiste = categorias[categoria].find(i => i.nome.toLowerCase() === nome.toLowerCase());
        if (!jaExiste) { categorias[categoria].push({ nome, qtd: qtdSemanal }); }
      }
    });
    return Object.fromEntries(Object.entries(categorias).filter(([, itens]) => itens.length > 0));
  }

  async function send(msg){
    const m=msg||input; if(!m.trim())return;
    setMsgs(p=>[...p,{role:"user",text:m}]); setInput(""); setLoad(true);
    setMsgs(p=>[...p,{role:"ai",text:"typing"}]);
    const resp=await perguntarIA(m,"dieta",perfil,protocolo);
    const texto=resp.texto||resp;
    if(resp.atualizacaoDieta&&onUpdateProtocolo){const novoProto=aplicarAtualizacaoDieta(protocolo,resp.atualizacaoDieta);onUpdateProtocolo(novoProto);setMsgs(p=>[...p.filter(x=>x.text!=="typing"),{role:"ai",text:texto},{role:"ai",text:"✅ Cardápio atualizado! O alimento foi substituído no seu plano.",isUpdate:true}]);}
    else{setMsgs(p=>[...p.filter(x=>x.text!=="typing"),{role:"ai",text:texto}]);}
    setLoad(false);
  }

  const quickChips=["Não gosto de ovo de manhã, o que substituir?","Opção vegetariana para o almoço","Substitua frango por outra proteína","Não tenho batata-doce, alternativas?","Lanche rápido sem precisar cozinhar","O que comer pré-treino em 5 minutos?"];
  const lista = showLista ? gerarListaCompras() : {};

  return(
    <div>
      <div className="sec-label">Plano Alimentar</div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap"}}>
        <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:34,letterSpacing:1,margin:0}}>DIETA {perfil.objetivo==="massa"?"BULKING":"CUTTING"}</p>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <button onClick={gerarPDF} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:"transparent",border:`1px solid rgba(102,255,240,.3)`,borderRadius:7,color:"#66FFF0",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}} onMouseOver={e=>e.currentTarget.style.background="rgba(102,255,240,.08)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>📄 Exportar PDF</button>
          <button onClick={()=>setShowCalc(s=>!s)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:showCalc?"rgba(102,255,240,.15)":"transparent",border:`1px solid ${showCalc?"rgba(102,255,240,.5)":"rgba(102,255,240,.3)"}`,borderRadius:7,color:"#66FFF0",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>🍽️ Calc. Refeição</button>
          <button onClick={()=>setShowLista(s=>!s)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:showLista?"rgba(102,255,240,.15)":"transparent",border:`1px solid ${showLista?"rgba(102,255,240,.5)":"rgba(102,255,240,.3)"}`,borderRadius:7,color:"#66FFF0",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>🛒 Lista</button>
        </div>
      </div>
      {showCalc && <CalcRefeicao perfil={perfil} protocolo={protocolo}/>}
      {showLista&&(<div style={{background:"#0F0F0F",border:"1px solid rgba(102,255,240,.2)",borderRadius:12,padding:"20px 24px",marginBottom:20,animation:"fadeUp .3s ease"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div><p style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:2,color:"#66FFF0"}}>🛒 LISTA DE COMPRAS — 7 DIAS</p><p style={{fontSize:11,color:"#666",marginTop:2}}>Quantidades calculadas para uma semana completa</p></div><button onClick={()=>{const texto=Object.entries(lista).map(([cat,itens])=>`${cat}\n${itens.map(i=>`  • ${i.qtd} ${i.nome}`).join("\n")}`).join("\n\n");navigator.clipboard.writeText(texto).then(()=>alert("Lista copiada! 📋"));}} style={{padding:"6px 14px",background:"transparent",border:"1px solid #333",borderRadius:6,color:"#666",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>📋 Copiar</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>{Object.entries(lista).map(([categoria,itens])=>(<div key={categoria} style={{background:"rgba(255,255,255,.02)",border:"1px solid #1a1a1a",borderRadius:8,padding:"14px 16px"}}><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1,color:"#888",marginBottom:10}}>{categoria}</p>{itens.map((item,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)",fontSize:13}}><span style={{color:"#ccc"}}>{item.nome}</span><span style={{color:"#66FFF0",fontWeight:700,fontSize:12,background:"rgba(102,255,240,.08)",padding:"2px 8px",borderRadius:4,whiteSpace:"nowrap",marginLeft:8}}>{item.qtd}</span></div>))}</div>))}</div></div>)}
      {protocolo?.kcal&&(<div className="macro-grid" style={{marginBottom:18}}><div className="card macro-card"><div className="macro-val">{protocolo.kcal}</div><div style={{fontSize:11,color:"#66FFF0",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>kcal/dia</div><div className="macro-label">Calorias</div></div><div className="card macro-card"><div className="macro-val">{protocolo.prot}<span style={{fontSize:14,color:"#666"}}> g</span></div><div style={{fontSize:11,color:"#66FFF0",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>por dia</div><div className="macro-label">Proteína</div></div><div className="card macro-card"><div className="macro-val">{protocolo.carb}<span style={{fontSize:14,color:"#666"}}> g</span></div><div style={{fontSize:11,color:"#66FFF0",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>por dia</div><div className="macro-label">Carboidrato</div></div></div>)}
      {protocolo?.refeicoes&&(<div className="meal-grid">{protocolo.refeicoes.map((ref,i)=>(<div key={i} className="card meal-card"><div className="meal-head"><div className="meal-time">{ref.h}</div><div className="meal-name">{ref.n}</div></div><div className="meal-body">{ref.it.map((it,j)=><div key={j} className="meal-item">{it}</div>)}</div></div>))}</div>)}
      {protocolo?.suplementos&&(<div className="card" style={{padding:"18px 20px",marginBottom:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Suplementação</p>{protocolo.suplementos.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid #202020`,fontSize:13}}><span style={{color:"#66FFF0"}}>💊</span><span style={{color:"#BBBBBB"}}>{s}</span></div>))}</div>)}
      <div className="card ia-section"><div className="ia-header"><div className="ia-dot"/><p className="ia-title">Nutricionista IA</p><p className="ia-sub">Adapte seu cardápio livremente</p></div><div className="chat-msgs">{msgs.map((m,i)=>(m.text==="typing"?<div key={i} className="cmsg ai typing"><span/><span/><span/></div>:<div key={i} className={`cmsg ${m.isUpdate?"update":m.role}`}>{m.text}</div>))}</div><div className="chips">{quickChips.map(c=><div key={c} className="chip" onClick={()=>send(c)}>{c}</div>)}</div><div className="chat-input-row"><input className="chat-input" placeholder="Ex: Não gosto de ovo, o que posso comer no café?" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="chat-send" onClick={()=>send()} disabled={load}>Enviar</button></div></div>
    </div>
  );
}

// ─── PERFIL ───────────────────────────────────────────────────────────────────
function Perfil({ perfil, onLogout, onRefazerProtocolo, onAtualizarDados }) {
  const [modal,setModal]=useState(false);
  const [modalDados,setModalDados]=useState(false);
  const [novoObj,setNovoObj]=useState(perfil.objetivo);
  const [novaAtiv,setNovaAtiv]=useState(perfil.nivelAtividade);
  const [novoLocal,setNovoLocal]=useState(perfil.localTreino);
  // Campos editáveis de dados pessoais
  const [editNome,setEditNome]=useState(perfil.nome);
  const [editAltura,setEditAltura]=useState(perfil.altura);
  const [editIdade,setEditIdade]=useState(perfil.idade);
  const [editPeso,setEditPeso]=useState(perfil.peso);

  const isMassa=perfil.objetivo==="massa";
  const ideal=pesoIdeal(perfil.altura,perfil.sexo);
  const imc=calcIMC(perfil.peso,perfil.altura);
  const rows=[["Nome",perfil.nome],["E-mail",perfil.email],["Sexo",perfil.sexo.charAt(0).toUpperCase()+perfil.sexo.slice(1)],["Idade",`${perfil.idade} anos`],["Altura",`${perfil.altura}cm`],["Peso Inicial",`${perfil.peso}kg`],["IMC",`${imc} — ${clsIMC(parseFloat(imc))}`],["Peso Ideal",`${ideal}kg`],["Nível de Atividade",perfil.nivelAtividade],["Local de Treino",perfil.localTreino]];

  return(
    <div>
      <div className="sec-label">Meu Perfil</div>
      <p className="sec-title">DADOS <span style={{color:C.accent}}>PESSOAIS</span></p>
      <div style={{marginBottom:14}}><span className={`badge ${isMassa?"badge-mass":"badge-fat"}`} style={{fontSize:14,padding:"6px 16px"}}>{isMassa?"💪 Objetivo: Ganho de Massa":"🔥 Objetivo: Emagrecimento"}</span></div>
      <div className="card" style={{padding:"6px 20px",marginBottom:14}}>
        {rows.map(([l,v])=>(<div key={l} className="perfil-row"><span className="pr-label">{l}</span><span className="pr-val">{v}</span></div>))}
        {perfil.restricoes?.length>0&&(<div className="perfil-row"><span className="pr-label">Restrições</span><span className="pr-val">{perfil.restricoes.join(", ")}</span></div>)}
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <button className="btn btn-accent" onClick={()=>setModal(true)}>🔄 Refazer Protocolo</button>
        <button className="btn btn-outline" onClick={()=>{setEditNome(perfil.nome);setEditAltura(perfil.altura);setEditIdade(perfil.idade);setEditPeso(perfil.peso);setModalDados(true);}}>✏️ Editar Dados</button>
        <button className="btn btn-outline" onClick={onLogout}>Sair da Conta</button>
      </div>

      {/* MODAL EDITAR DADOS PESSOAIS */}
      {modalDados&&(
        <div className="modal"><div className="modal-box">
          <p className="cad-title">EDITAR <span>DADOS</span></p>
          <p className="cad-sub">Atualize seus dados pessoais. Isso afeta o cálculo de IMC, hidratação e composição corporal.</p>
          <div className="field"><label>Nome</label><input placeholder="Seu nome" value={editNome} onChange={e=>setEditNome(e.target.value)}/></div>
          <div className="fields-row">
            <div className="field"><label>Altura (cm)</label><input type="number" placeholder="Ex: 175" value={editAltura} onChange={e=>setEditAltura(e.target.value)}/></div>
            <div className="field"><label>Idade</label><input type="number" placeholder="Ex: 28" value={editIdade} onChange={e=>setEditIdade(e.target.value)}/></div>
          </div>
          <div className="field"><label>Peso de Referência (kg)</label><input type="number" placeholder="Ex: 85" value={editPeso} onChange={e=>setEditPeso(e.target.value)}/><p style={{fontSize:10,color:C.muted,marginTop:4}}>⚠️ Isso altera o peso inicial do gráfico. Para registrar pesagens use o Dashboard.</p></div>
          {editAltura&&editPeso&&(()=>{
            const imcNovo=calcIMC(editPeso,editAltura);
            const idealNovo=pesoIdeal(editAltura,perfil.sexo);
            return(<div className="imc-result"><div className="imc-row"><span style={{color:C.muted}}>Novo IMC</span><span className="imc-val">{imcNovo}</span></div><div className="imc-row"><span style={{color:C.muted}}>Classificação</span><span style={{fontWeight:700,color:C.text}}>{clsIMC(parseFloat(imcNovo))}</span></div><div className="imc-row" style={{marginBottom:0}}><span style={{color:C.muted}}>Peso Ideal</span><span style={{fontWeight:700,color:C.accent}}>{idealNovo}kg</span></div></div>);
          })()}
          <div style={{display:"flex",gap:10,marginTop:20}}>
            <button className="btn btn-accent" style={{flex:1}} onClick={()=>{
              if(!editNome||!editAltura||!editIdade||!editPeso){alert("Preencha todos os campos.");return;}
              if(parseFloat(editAltura)<100||parseFloat(editAltura)>250){alert("Altura inválida.");return;}
              onAtualizarDados({...perfil,nome:editNome,altura:editAltura,idade:editIdade,peso:editPeso});
              setModalDados(false);
            }}>💾 Salvar</button>
            <button className="btn btn-outline" onClick={()=>setModalDados(false)}>Cancelar</button>
          </div>
        </div></div>
      )}

      {/* MODAL REFAZER PROTOCOLO */}
      {modal&&(<div className="modal"><div className="modal-box"><p className="cad-title">REFAZER <span>PROTOCOLO</span></p><p className="cad-sub">Atualize seu objetivo e seu plano será regenerado!</p><div className="field"><label>Novo Objetivo</label><div className="goal-grid"><div className={`goal-card${novoObj==="fat"?" sel-fat":""}`} onClick={()=>setNovoObj("fat")}><div className="gi">🔥</div><div className="gn">Emagrecer</div><div className="gd">Déficit calórico e definição</div></div><div className={`goal-card${novoObj==="massa"?" sel-mass":""}`} onClick={()=>setNovoObj("massa")}><div className="gi">💪</div><div className="gn">Ganhar Massa</div><div className="gd">Hipertrofia e superávit</div></div></div></div><div className="field"><label>Nível de Atividade</label><select value={novaAtiv} onChange={e=>setNovaAtiv(e.target.value)}>{Object.keys(ATIVIDADE).map(k=><option key={k} value={k}>{k}</option>)}</select></div><div className="field"><label>Local de Treino</label><div className="pill-group">{["Academia completa","Academia básica","Em casa","Ao ar livre"].map(l=>(<div key={l} className={`pill${novoLocal===l?" sel":""}`} onClick={()=>setNovoLocal(l)}>{l}</div>))}</div></div><div style={{display:"flex",gap:10,marginTop:20}}><button className="btn btn-accent" style={{flex:1}} onClick={()=>{onRefazerProtocolo({...perfil,objetivo:novoObj,nivelAtividade:novaAtiv,localTreino:novoLocal});setModal(false);}}>🔥 Gerar Novo Protocolo</button><button className="btn btn-outline" onClick={()=>setModal(false)}>Cancelar</button></div></div></div>)}

      {/* NOTIFICAÇÕES */}
      <div style={{marginTop:28}}>
        <div style={{height:1,background:"#1a1a1a",marginBottom:24}}/>
        <Notificacoes/>
      </div>
    </div>
  );
}

// ─── ESPORTE ──────────────────────────────────────────────────────────────────
function Esporte({ perfil }) {
  const esporte=perfil.esporte||null;
  const [msgs,setMsgs]=useState([{role:"ai",text:`Olá ${perfil.nome.split(" ")[0]}! Sou seu Professor IA 🏆 Especialista em performance esportiva. Pergunte sobre ${esporte||"qualquer esporte"}!`}]);
  const [input,setInput]=useState(""); const [load,setLoad]=useState(false);

  const PROTOCOLOS={"Futebol":{aquecimento:["Corrida leve 5min","Mobilidade quadril","Agachamento dinâmico","Passes leves","Dribles curtos"],treino:["Potência: Agachamento explosivo 4×8","Agilidade: Ladder drill 4×30s","Core: Prancha 4×45s","Sprints curtos 6×20m","Mobilidade 10min"],recuperacao:["Banho frio 10min","Alongamento 20min","Rolo de espuma","Proteína 30g + carboidrato","Hidratação 500ml"],nutricaoDia:["Café reforçado 3h antes","Carboidrato 2h antes","Banana 30min antes","Isotônico durante","Proteína pós-jogo"]},"Futevôlei":{aquecimento:["Mobilidade tornozelo","Saltos verticais","Toque de bola","Manchetes leves","Deslocamento lateral"],treino:["Salto vertical: Box jump 4×10","Potência: Hip thrust 4×15","Estabilidade: Prancha unilateral 3×30s","Velocidade de reação 4×20s","Treino técnico 30min"],recuperacao:["Gelo no tornozelo se necessário","Rolo glúteo e posterior","Proteína 30g","Hidratação reforçada","Sono 8h"],nutricaoDia:["Aveia + banana 2h antes","Fruta 30min antes","Água gelada durante","Whey pós-jogo","Refeição completa 1h depois"]},"Vôlei":{aquecimento:["Rotação ombros","Saltos alternados","Bloqueio simulado","Deslocamento lateral","Toque e manchete"],treino:["Salto: Pliometria 4×12","Ombro: Rotação externa 3×15","Core rotacional 4×12","Velocidade lateral 4×20s","Força explosiva membros superiores"],recuperacao:["Gelo no ombro se necessário","Alongamento membros superiores","Foam roller costas","Proteína + carboidrato","Sono reparador"],nutricaoDia:["Carboidrato complexo 3h antes","Fruta 1h antes","Hidratação constante","Evitar gordura no dia","Whey pós"]},"Beach Tênis":{aquecimento:["Rotação quadril","Mobilidade ombro","Deslocamento lateral","Golpes leves","Sprints 5×10m"],treino:["Resistência: Circuito 4×45s","Potência ombro: Remada 4×12","Agilidade: Cone drill 4×30s","Core anti-rotação 3×15","Técnica de golpe 20min"],recuperacao:["Gelo no cotovelo/ombro","Alongamento membros superiores","Hidratação reforçada","Proteína 30min pós","Descanso ativo no dia seguinte"],nutricaoDia:["Café leve 2h antes","Fruta 30min antes","Água + sal durante","Whey + banana pós","Refeição anti-inflamatória"]},"Natação":{aquecimento:["Rotação ombros 2min","Mobilidade quadril","Alongamento costas","Pernada em seco","Braçada simulada"],treino:["Técnica: Séries curtas 8×50m","Resistência: 4×200m","Força: Puxada com elástico","Core: Prancha 4×45s","Mobilidade ombro 15min"],recuperacao:["Alongamento na piscina","Rolo de espuma costas","Proteína + carboidrato","Vitamina C","Hidratação mesmo na água"],nutricaoDia:["Carboidrato leve 1h antes","Evitar refeição pesada","Gel se treino longo","Whey pós","Refeição completa 30min depois"]},"Luta/MMA":{aquecimento:["Sombra 3min","Mobilidade geral","Agachamento dinâmico","Rotação tronco","Pular corda 3min"],treino:["Condicionamento: HIIT 4×3min","Força: Supino + agachamento","Explosão: Medicine ball 4×10","Core: Rotação com peso 3×15","Técnica específica 30min"],recuperacao:["Banho frio","Proteína imediata","Rolo de espuma","Sono 8-9h","Anti-inflamatório natural"],nutricaoDia:["Carboidrato + proteína 2h antes","Fruta 30min antes","Água durante","Evitar treinar em jejum","Refeição completa pós"]}};
  const proto=esporte?PROTOCOLOS[esporte]:null;

  async function send(msg){
    const m=msg||input; if(!m.trim())return;
    setMsgs(p=>[...p,{role:"user",text:m}]); setInput(""); setLoad(true);
    setMsgs(p=>[...p,{role:"ai",text:"typing"}]);
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,messages:[{role:"user",content:`Você é um Professor de Educação Física e Coach Esportivo especialista do app IRONCUT. Responda SEMPRE em português, de forma direta e motivadora.\nPerfil: ${perfil.sexo}, ${perfil.idade} anos, ${perfil.peso}kg, objetivo: ${perfil.objetivo==="massa"?"massa":"emagrecimento"}.\nEsporte: ${esporte||"não definido"}.\nPergunta: ${m}`}]})});
      const d=await res.json();
      const txt=d?.content?.[0]?.text||"Não consegui processar. Tente novamente.";
      setMsgs(p=>[...p.filter(x=>x.text!=="typing"),{role:"ai",text:txt}]);
    }catch{setMsgs(p=>[...p.filter(x=>x.text!=="typing"),{role:"ai",text:"Erro de conexão. Tente novamente!"}]);}
    setLoad(false);
  }

  const quickChips=esporte?[`Como melhorar minha performance no ${esporte}?`,`Aquecimento ideal antes do ${esporte}`,`Como me recuperar após um jogo intenso?`,"O que comer no dia do jogo?",`Treino complementar para ${esporte}`,`Como prevenir lesões no ${esporte}?`]:["Qual esporte é melhor para emagrecer?","Como começar no beach tênis?","Futebol ou futevôlei para condicionamento?","Treino funcional para esportes"];
  const emojis={"Futebol":"⚽","Futevôlei":"🏐","Vôlei":"🏐","Beach Tênis":"🎾","Natação":"🏊","Luta/MMA":"🥊"};

  return(
    <div>
      <div className="sec-label">Performance Esportiva</div>
      <p className="sec-title">MÓDULO <span style={{color:C.accent}}>ESPORTE</span></p>
      {!esporte?(<div className="card-accent" style={{padding:"28px",marginBottom:20,textAlign:"center"}}><div style={{fontSize:52,marginBottom:12}}>🏆</div><p style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:2,marginBottom:8}}>Nenhum esporte cadastrado</p><p style={{color:C.muted,fontSize:13,lineHeight:1.6}}>Vá em <strong style={{color:C.accent}}>Perfil → Refazer Protocolo</strong> e selecione seu esporte.</p></div>):(
        <><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:"16px 20px",background:C.card,border:`1px solid rgba(102,255,240,.2)`,borderRadius:12}}><div style={{fontSize:40}}>{emojis[esporte]||"🏆"}</div><div><p style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:2,color:C.accent}}>{esporte}</p><p style={{fontSize:12,color:C.muted}}>Protocolo de performance ativo</p></div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          {[{titulo:"🔥 Aquecimento Pré-Jogo",itens:proto.aquecimento,cor:"rgba(102,255,240,.04)"},{titulo:"💪 Treino Complementar",itens:proto.treino,cor:"rgba(167,139,250,.04)"},{titulo:"🧊 Recuperação Pós-Jogo",itens:proto.recuperacao,cor:"rgba(34,197,94,.04)"},{titulo:"🍽️ Nutrição no Dia do Jogo",itens:proto.nutricaoDia,cor:"rgba(251,191,36,.04)"}].map(({titulo,itens,cor})=>(
            <div key={titulo} className="card" style={{padding:"16px 18px",background:cor}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:1,marginBottom:10,color:C.lgray}}>{titulo}</p>{itens.map((it,i)=>(<div key={i} style={{display:"flex",gap:8,fontSize:13,color:C.lgray,padding:"4px 0",borderBottom:`1px solid rgba(255,255,255,.04)`}}><span style={{color:C.accent,fontSize:10,marginTop:4,flexShrink:0}}>▸</span>{it}</div>))}</div>
          ))}
        </div></>
      )}
      <div className="card ia-section"><div className="ia-header"><div className="ia-dot"/><p className="ia-title">Professor IA</p><p className="ia-sub">Especialista em performance esportiva</p></div><div className="chat-msgs">{msgs.map((m,i)=>(m.text==="typing"?<div key={i} className="cmsg ai typing"><span/><span/><span/></div>:<div key={i} className={`cmsg ${m.role}`}>{m.text}</div>))}</div><div className="chips">{quickChips.map(c=><div key={c} className="chip" onClick={()=>send(c)}>{c}</div>)}</div><div className="chat-input-row"><input className="chat-input" placeholder="Pergunte sobre treino, nutrição, recuperação..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="chat-send" onClick={()=>send()} disabled={load}>Enviar</button></div></div>
    </div>
  );
}

// ─── UTILS COMPOSIÇÃO CORPORAL ────────────────────────────────────────────────
function calcGorduraUSNavy(sexo, altura, cintura, pescoco, quadril) {
  // ── A fórmula US Navy foi desenvolvida em POLEGADAS. Convertemos cm → pol. ──
  const h = parseFloat(altura) / 2.54;
  const c = parseFloat(cintura) / 2.54;
  const p = parseFloat(pescoco) / 2.54;
  const q = quadril ? parseFloat(quadril) / 2.54 : null;

  if (!h || !c || !p) return null;

  if (sexo === "masculino") {
    if (c <= p) return null;
    const g = 86.010 * Math.log10(c - p) - 70.041 * Math.log10(h) + 36.76;
    return Math.max(3, Math.min(50, parseFloat(g.toFixed(1))));
  } else {
    if (!q || c + q <= p) return null;
    const g = 163.205 * Math.log10(c + q - p) - 97.684 * Math.log10(h) - 78.387;
    return Math.max(10, Math.min(55, parseFloat(g.toFixed(1))));
  }
}

function classGordura(pct, sexo) {
  if (sexo === "masculino") {
    if (pct < 6)  return { cls: "Essencial",   cor: "#60a5fa", emoji: "💙" };
    if (pct < 14) return { cls: "Atlético",    cor: "#22c55e", emoji: "🏆" };
    if (pct < 18) return { cls: "Fitness",     cor: "#66FFF0", emoji: "💪" };
    if (pct < 25) return { cls: "Aceitável",   cor: "#f59e0b", emoji: "⚠️" };
    return        { cls: "Obesidade",          cor: "#ff6b6b", emoji: "❌" };
  } else {
    if (pct < 14) return { cls: "Essencial",   cor: "#60a5fa", emoji: "💙" };
    if (pct < 21) return { cls: "Atlético",    cor: "#22c55e", emoji: "🏆" };
    if (pct < 25) return { cls: "Fitness",     cor: "#66FFF0", emoji: "💪" };
    if (pct < 32) return { cls: "Aceitável",   cor: "#f59e0b", emoji: "⚠️" };
    return        { cls: "Obesidade",          cor: "#ff6b6b", emoji: "❌" };
  }
}

function pesoIdealPorGordura(pesoAtual, pctGordura, objetivo, sexo) {
  const alvo = objetivo === "massa"
    ? (sexo === "masculino" ? 12 : 18)
    : (sexo === "masculino" ? 15 : 22);
  const massaMagra = pesoAtual * (1 - pctGordura / 100);
  const ideal = massaMagra / (1 - alvo / 100);
  return { ideal: parseFloat(ideal.toFixed(1)), alvo, massaMagra: parseFloat(massaMagra.toFixed(1)) };
}

// ─── ABA MEDIDAS ──────────────────────────────────────────────────────────────
function Medidas({ perfil, pesosLog, onPesoIdealAtualizado }) {
  const MED_KEY = `ic_medidas_${perfil.email}`;
  const [showGuia, setShowGuia] = useState(false);
  const [historico, setHistorico] = useState(() => {
    try { return JSON.parse(localStorage.getItem(MED_KEY) || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({ pescoco: "", cintura: "", quadril: "", braco: "", coxa: "" });
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const pesoAtual = pesosLog.length ? pesosLog[pesosLog.length - 1].val : parseFloat(perfil.peso);
  const isFem = perfil.sexo === "feminino";

  const pctAtual = historico.length > 0
    ? calcGorduraUSNavy(perfil.sexo, perfil.altura, historico[historico.length-1].cintura, historico[historico.length-1].pescoco, historico[historico.length-1].quadril)
    : null;
  const formPct = calcGorduraUSNavy(perfil.sexo, perfil.altura, form.cintura, form.pescoco, form.quadril);
  const classAtual = pctAtual ? classGordura(pctAtual, perfil.sexo) : null;
  const idealInfo = pctAtual ? pesoIdealPorGordura(pesoAtual, pctAtual, perfil.objetivo, perfil.sexo) : null;

  function salvar() {
    if (!form.pescoco || !form.cintura || (isFem && !form.quadril)) {
      alert("Preencha pelo menos Pescoço, Cintura" + (isFem ? " e Quadril" : "") + " para calcular o % de gordura.");
      return;
    }
    const novo = { data: hoje(), ...form, pct: formPct };
    const novoHist = [...historico, novo];
    setHistorico(novoHist);
    localStorage.setItem(MED_KEY, JSON.stringify(novoHist));
    setForm({ pescoco: "", cintura: "", quadril: "", braco: "", coxa: "" });
    if (formPct && onPesoIdealAtualizado) {
      const info = pesoIdealPorGordura(pesoAtual, formPct, perfil.objetivo, perfil.sexo);
      onPesoIdealAtualizado(info.ideal);
    }
  }

  const ultimo = historico.length > 0 ? historico[historico.length - 1] : null;
  const penultimo = historico.length > 1 ? historico[historico.length - 2] : null;
  function diff(campo) {
    if (!ultimo || !penultimo || !ultimo[campo] || !penultimo[campo]) return null;
    return (parseFloat(ultimo[campo]) - parseFloat(penultimo[campo])).toFixed(1);
  }
  const campos = [
    { key: "pescoco", label: "Pescoço", emoji: "📏", obrig: true },
    { key: "cintura", label: "Cintura", emoji: "📐", obrig: true },
    { key: "quadril", label: "Quadril", emoji: "🍑", obrig: isFem },
    { key: "braco",   label: "Braço",   emoji: "💪", obrig: false },
    { key: "coxa",    label: "Coxa",    emoji: "🦵", obrig: false },
  ];

  return (
    <div>
      <div className="sec-label">Composição Corporal</div>
      <p className="sec-title">📏 MEDIDAS <span style={{color:C.accent}}>& GORDURA</span></p>

      {pctAtual && classAtual && (
        <div className="card-accent" style={{padding:"20px 22px",marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.muted,marginBottom:4}}>% Gordura Corporal</p>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:56,lineHeight:1,color:classAtual.cor,textShadow:`0 0 20px ${classAtual.cor}40`}}>{pctAtual}%</div>
              <p style={{fontSize:14,fontWeight:700,color:classAtual.cor,marginTop:4}}>{classAtual.emoji} {classAtual.cls}</p>
            </div>
            {idealInfo && (
              <div style={{textAlign:"right",background:"rgba(102,255,240,.06)",border:"1px solid rgba(102,255,240,.15)",borderRadius:10,padding:"14px 18px"}}>
                <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:4}}>Peso Ideal Real</p>
                <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:32,color:C.accent,lineHeight:1}}>{idealInfo.ideal}kg</div>
                <p style={{fontSize:11,color:C.muted,marginTop:4}}>Alvo: {idealInfo.alvo}% gordura</p>
                <p style={{fontSize:11,color:C.muted}}>Massa magra: {idealInfo.massaMagra}kg</p>
              </div>
            )}
          </div>
          {(()=>{
            const max = isFem ? 50 : 40;
            const pct = Math.min(100, (pctAtual / max) * 100);
            const zonas = isFem
              ? [{w:28,label:"Atlético",cor:"#22c55e"},{w:8,label:"Fitness",cor:"#66FFF0"},{w:14,label:"Aceitável",cor:"#f59e0b"},{w:50,label:"Obesidade",cor:"#ff6b6b"}]
              : [{w:35,label:"Atlético",cor:"#22c55e"},{w:10,label:"Fitness",cor:"#66FFF0"},{w:17.5,label:"Aceitável",cor:"#f59e0b"},{w:37.5,label:"Obesidade",cor:"#ff6b6b"}];
            return (
              <div>
                <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:6}}>Faixa de classificação</p>
                <div style={{position:"relative",height:12,borderRadius:6,overflow:"hidden",display:"flex",marginBottom:6}}>
                  {zonas.map((z,i)=><div key={i} style={{width:`${z.w}%`,background:z.cor,opacity:.6}}/>)}
                  <div style={{position:"absolute",left:`${Math.min(97,pct)}%`,top:-2,width:4,height:16,background:"#fff",borderRadius:2,boxShadow:"0 0 6px rgba(255,255,255,.8)"}}/>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {zonas.map((z,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}><div style={{width:8,height:8,borderRadius:"50%",background:z.cor}}/>{z.label}</div>))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {ultimo && (
        <div className="card" style={{padding:"18px 20px",marginBottom:18}}>
          <p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Últimas Medidas — {ultimo.data}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>
            {campos.filter(c=>ultimo[c.key]).map(({key,label,emoji})=>{
              const d = diff(key);
              const melhorou = d && (key==="cintura"||key==="quadril"||key==="coxa") ? parseFloat(d)<0 : parseFloat(d)>0;
              return (
                <div key={key} style={{background:"#0D0D0D",border:"1px solid #1a1a1a",borderRadius:8,padding:"12px",textAlign:"center"}}>
                  <div style={{fontSize:16,marginBottom:4}}>{emoji}</div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:C.muted,marginBottom:2}}>{label}</div>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:C.accent,lineHeight:1}}>{ultimo[key]}cm</div>
                  {d && <div style={{fontSize:10,color:melhorou?"#22c55e":"#ff6b6b",marginTop:2,fontWeight:700}}>{parseFloat(d)>0?"+":""}{d}cm</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card" style={{padding:"20px 22px",marginBottom:18}}>
        <p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Registrar Novas Medidas</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{fontSize:11,color:C.muted,lineHeight:1.5}}>Use uma fita métrica. Pescoço + Cintura{isFem?" + Quadril":""} são obrigatórios para calcular o % de gordura pela <strong style={{color:C.lgray}}>Fórmula US Navy</strong>.</p>
          <button onClick={()=>setShowGuia(true)} style={{flexShrink:0,marginLeft:12,padding:"6px 14px",background:"transparent",border:`1px solid rgba(102,255,240,.3)`,borderRadius:6,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap"}}>📐 Ver como medir</button>
        </div>

        {showGuia && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setShowGuia(false)}>
            <div style={{background:"#0F0F0F",border:"1px solid rgba(102,255,240,.2)",borderRadius:16,maxWidth:580,width:"100%",maxHeight:"90vh",overflowY:"auto",padding:24,animation:"fadeUp .3s ease"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,color:C.accent}}>📐 GUIA DE MEDIÇÕES</p>
                <button onClick={()=>setShowGuia(false)} style={{background:"transparent",border:"1px solid #333",color:C.muted,borderRadius:6,padding:"4px 12px",cursor:"pointer",fontSize:16}}>✕</button>
              </div>
              <p style={{fontSize:13,color:C.lgray,lineHeight:1.7,marginBottom:12}}>Use uma fita métrica flexível. Meça sempre no mesmo horário (preferencialmente pela manhã em jejum).</p>
              {[
                {emoji:"📏",titulo:"PESCOÇO",desc:"Meça abaixo do pomo de adão (gogó), na parte mais estreita do pescoço. Cabeça reta, olhando para frente."},
                {emoji:"📐",titulo:"CINTURA / ABDÔMEN",desc:"Na parte mais larga do abdômen — geralmente na altura do umbigo. Não prenda a barriga!"},
                {emoji:"🍑",titulo:"QUADRIL (feminino)",desc:"Na parte mais larga do quadril/glúteos, pés juntos. Fita paralela ao chão."},
                {emoji:"💪",titulo:"BRAÇO",desc:"Bíceps relaxado, parte mais larga entre ombro e cotovelo."},
                {emoji:"🦵",titulo:"COXA",desc:"Parte mais larga da coxa, logo abaixo da dobra do glúteo."},
              ].map(({emoji,titulo,desc})=>(
                <div key={titulo} style={{padding:"12px 0",borderBottom:"1px solid #1a1a1a"}}>
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textTransform:"uppercase",letterSpacing:1,color:C.accent,marginBottom:4}}>{emoji} {titulo}</p>
                  <p style={{fontSize:12,color:C.lgray,lineHeight:1.7}}>{desc}</p>
                </div>
              ))}
              {isFem && (
                <div style={{marginTop:16,padding:"14px",background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.2)",borderRadius:8}}>
                  <p style={{fontSize:11,color:"#f59e0b",lineHeight:1.7}}>⚠️ <strong>Nota para tipo "ampulheta":</strong> Se seu quadril for muito maior que sua cintura (diferença acima de 28cm), o app aplica uma correção automática no cálculo para compensar a limitação da fórmula US Navy com esse biotipo corporal.</p>
                </div>
              )}
              <button className="btn btn-accent" style={{width:"100%",marginTop:16}} onClick={()=>setShowGuia(false)}>Entendido! ✓</button>
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {campos.map(({key,label,emoji,obrig})=>(
            <div key={key} className="field" style={{margin:0}}>
              <label>{emoji} {label} (cm){obrig&&<span style={{color:C.accent}}> *</span>}</label>
              <input type="number" placeholder={`Ex: ${key==="pescoco"?38:key==="cintura"?85:key==="quadril"?100:key==="braco"?35:55}`} value={form[key]} onChange={e=>upd(key,e.target.value)} step="0.1"/>
            </div>
          ))}
        </div>

        {formPct && (()=>{
          const cls = classGordura(formPct, perfil.sexo);
          const inf = pesoIdealPorGordura(pesoAtual, formPct, perfil.objetivo, perfil.sexo);
          return (
            <div style={{background:`${cls.cor}10`,border:`1px solid ${cls.cor}40`,borderRadius:8,padding:"12px 16px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontSize:12,fontWeight:700,color:cls.cor}}>{cls.emoji} {cls.cls}</span>
                  <span style={{fontSize:11,color:C.muted,marginLeft:8}}>% Gordura estimado</span>
                </div>
                <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:28,color:cls.cor}}>{formPct}%</span>
              </div>
              <div style={{fontSize:11,color:C.muted,marginTop:6}}>
                Peso ideal com {inf.alvo}% de gordura: <strong style={{color:C.accent}}>{inf.ideal}kg</strong> — Massa magra atual: <strong style={{color:C.lgray}}>{inf.massaMagra}kg</strong>
              </div>
            </div>
          );
        })()}

        <button className="btn btn-accent" style={{width:"100%"}} onClick={salvar}>💾 Salvar Medidas</button>
      </div>

      {historico.length > 0 && (
        <div className="card" style={{padding:"18px 20px",marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>Histórico de Registros</p>
            <button
              onClick={()=>{
                if(window.confirm("Apagar todo o histórico de medidas? Esta ação não pode ser desfeita.")){
                  setHistorico([]);
                  localStorage.removeItem(MED_KEY);
                }
              }}
              style={{padding:"5px 12px",background:"transparent",border:"1px solid rgba(255,107,107,.3)",borderRadius:6,color:"#ff6b6b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}
            >
              🗑️ Limpar tudo
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...historico].reverse().slice(0,6).map((reg,i)=>{
              const idxReal = historico.length - 1 - i;
              const cls = reg.pct ? classGordura(reg.pct, perfil.sexo) : null;
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"#0D0D0D",border:"1px solid #1a1a1a",borderRadius:8,gap:8}}>
                  <span style={{fontSize:12,color:C.muted,fontWeight:700,flexShrink:0}}>{reg.data}</span>
                  <div style={{display:"flex",gap:10,alignItems:"center",fontSize:12,flexWrap:"wrap",flex:1}}>
                    {reg.cintura && <span style={{color:C.lgray}}>Cin: <strong style={{color:C.text}}>{reg.cintura}cm</strong></span>}
                    {reg.braco && <span style={{color:C.lgray}}>Br: <strong style={{color:C.text}}>{reg.braco}cm</strong></span>}
                    {reg.pct && cls && <span style={{color:cls.cor,fontWeight:700}}>{reg.pct}% {cls.emoji}</span>}
                  </div>
                  <button
                    onClick={()=>{
                      const novo = historico.filter((_,j)=>j!==idxReal);
                      setHistorico(novo);
                      localStorage.setItem(MED_KEY, JSON.stringify(novo));
                    }}
                    style={{flexShrink:0,background:"transparent",border:"none",color:"#444",fontSize:16,cursor:"pointer",padding:"2px 6px",lineHeight:1,transition:"color .2s"}}
                    onMouseOver={e=>e.target.style.color="#ff6b6b"}
                    onMouseOut={e=>e.target.style.color="#444"}
                    title="Apagar este registro"
                  >✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!historico.length && (
        <div className="card" style={{padding:"28px",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>📏</div>
          <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:2,marginBottom:8}}>Nenhuma medida registrada</p>
          <p style={{color:C.muted,fontSize:13,lineHeight:1.6}}>Registre suas medidas acima para calcular seu % de gordura corporal e descobrir seu peso ideal real!</p>
        </div>
      )}
    </div>
  );
}

// ─── FOTOS DE PROGRESSO ───────────────────────────────────────────────────────
function Fotos({ perfil }) {
  const FOTOS_KEY = `ic_fotos_${perfil.email}`;
  const [fotos, setFotos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FOTOS_KEY) || "[]"); } catch { return []; }
  });
  const [modalFoto, setModalFoto] = useState(null); // foto em fullscreen
  const [comparando, setComparando] = useState(false);
  const [comp1, setComp1] = useState(null);
  const [comp2, setComp2] = useState(null);
  const [categoria, setCategoria] = useState("Frente");
  const [descricao, setDescricao] = useState("");
  const [peso, setPeso] = useState("");
  const inputRef = useState(null);

  const categorias = ["Frente","Costas","Lateral","Abdômen","Outros"];

  function salvarFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const nova = {
        id: Date.now(),
        data: hoje(),
        dataISO: new Date().toISOString(),
        categoria,
        descricao,
        peso: peso || null,
        src: ev.target.result,
      };
      const novas = [nova, ...fotos];
      setFotos(novas);
      try { localStorage.setItem(FOTOS_KEY, JSON.stringify(novas)); }
      catch { alert("Armazenamento cheio. Exclua fotos antigas para liberar espaço."); }
      setDescricao(""); setPeso("");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function excluirFoto(id) {
    if (!window.confirm("Excluir esta foto?")) return;
    const novas = fotos.filter(f => f.id !== id);
    setFotos(novas);
    localStorage.setItem(FOTOS_KEY, JSON.stringify(novas));
    if (modalFoto?.id === id) setModalFoto(null);
  }

  // Agrupa por categoria
  const porCategoria = categorias.reduce((acc, cat) => {
    acc[cat] = fotos.filter(f => f.categoria === cat);
    return acc;
  }, {});

  const fotosFiltradas = fotos.filter(f => f.categoria === categoria);

  return (
    <div>
      <div className="sec-label">Transformação Visual</div>
      <p className="sec-title">📸 FOTOS DE <span style={{color:C.accent}}>PROGRESSO</span></p>

      {/* UPLOAD */}
      <div className="card" style={{padding:"20px 22px",marginBottom:18}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Registrar Nova Foto</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div className="field" style={{margin:0}}>
            <label>Categoria</label>
            <select value={categoria} onChange={e=>setCategoria(e.target.value)}>
              {categorias.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label>Peso atual (kg)</label>
            <input type="number" placeholder="Ex: 85.5" value={peso} onChange={e=>setPeso(e.target.value)} step="0.1"/>
          </div>
        </div>
        <div className="field" style={{marginBottom:12}}>
          <label>Descrição (opcional)</label>
          <input placeholder="Ex: Semana 3 — início do cutting" value={descricao} onChange={e=>setDescricao(e.target.value)}/>
        </div>
        <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"14px",background:"rgba(102,255,240,.06)",border:"2px dashed rgba(102,255,240,.25)",borderRadius:10,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,letterSpacing:1.5,textTransform:"uppercase",color:C.accent,transition:"all .2s"}}
          onMouseOver={e=>e.currentTarget.style.background="rgba(102,255,240,.1)"}
          onMouseOut={e=>e.currentTarget.style.background="rgba(102,255,240,.06)"}>
          <span style={{fontSize:22}}>📷</span> Selecionar Foto
          <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={salvarFoto}/>
        </label>
      </div>

      {/* STATS */}
      {fotos.length > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
          {[
            {label:"Total de Fotos",val:fotos.length,icon:"📸"},
            {label:"Semanas",val:Math.ceil(fotos.length/3)||1,icon:"📅"},
            {label:"Última Foto",val:fotos[0]?.data||"—",icon:"🕐"},
          ].map(({label,val,icon})=>(
            <div key={label} className="card" style={{padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:C.accent,lineHeight:1}}>{val}</div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1.5,marginTop:3}}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {fotos.length > 0 && (
        <>
          {/* TABS + COMPARAR */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {categorias.filter(c=>porCategoria[c].length>0).map(cat=>(
                <button key={cat} onClick={()=>{setCategoria(cat);setComparando(false);setComp1(null);setComp2(null);}}
                  style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${categoria===cat?"rgba(102,255,240,.5)":"#2a2a2a"}`,background:categoria===cat?"rgba(102,255,240,.1)":"#0D0D0D",color:categoria===cat?C.accent:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer"}}>
                  {cat} <span style={{fontSize:10,opacity:.7}}>({porCategoria[cat].length})</span>
                </button>
              ))}
            </div>
            {fotosFiltradas.length >= 2 && (
              <button onClick={()=>{setComparando(s=>!s);setComp1(null);setComp2(null);}}
                style={{padding:"6px 16px",borderRadius:6,border:`1px solid ${comparando?"rgba(167,139,250,.5)":"#2a2a2a"}`,background:comparando?"rgba(167,139,250,.1)":"#0D0D0D",color:comparando?C.purple:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer"}}>
                ⚖️ Comparar
              </button>
            )}
          </div>

          {/* MODO COMPARAÇÃO */}
          {comparando && (
            <div className="card" style={{padding:"16px 20px",marginBottom:18,border:"1px solid rgba(167,139,250,.2)"}}>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1.5,color:C.purple,marginBottom:12}}>⚖️ Selecione 2 fotos para comparar</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                {[{slot:comp1,setSlot:setComp1,label:"ANTES"},{slot:comp2,setSlot:setComp2,label:"DEPOIS"}].map(({slot,setSlot,label})=>(
                  <div key={label}>
                    <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.muted,marginBottom:6}}>{label}</p>
                    {slot ? (
                      <div style={{position:"relative"}}>
                        <img src={slot.src} alt={label} style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",borderRadius:8,border:`2px solid ${C.purple}`}}/>
                        <div style={{position:"absolute",bottom:6,left:6,right:6,background:"rgba(0,0,0,.8)",borderRadius:5,padding:"4px 8px",fontSize:10,color:"#fff"}}>{slot.data}{slot.peso&&` • ${slot.peso}kg`}</div>
                        <button onClick={()=>setSlot(null)} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.8)",border:"none",color:"#fff",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:12}}>✕</button>
                      </div>
                    ) : (
                      <div style={{aspectRatio:"3/4",background:"#0D0D0D",border:"2px dashed #2a2a2a",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,fontSize:12}}>Clique em uma foto abaixo</div>
                    )}
                  </div>
                ))}
              </div>
              {comp1&&comp2&&(
                <div style={{background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.2)",borderRadius:8,padding:"12px 16px",fontSize:12,color:C.lgray}}>
                  {comp1.peso&&comp2.peso&&(<p style={{marginBottom:4}}>⚖️ Variação de peso: <strong style={{color:parseFloat(comp2.peso)<parseFloat(comp1.peso)?C.accent:"#ff6b6b"}}>{(parseFloat(comp2.peso)-parseFloat(comp1.peso)).toFixed(1)}kg</strong></p>)}
                  <p>📅 Período: <strong style={{color:C.text}}>{comp1.data}</strong> → <strong style={{color:C.text}}>{comp2.data}</strong></p>
                </div>
              )}
            </div>
          )}

          {/* GRID DE FOTOS */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {fotosFiltradas.map(foto=>{
              const selecionada = comp1?.id===foto.id||comp2?.id===foto.id;
              const slotNumero = comp1?.id===foto.id?1:comp2?.id===foto.id?2:null;
              return(
                <div key={foto.id} style={{position:"relative",cursor:"pointer"}}
                  onClick={()=>{
                    if(comparando){
                      if(comp1?.id===foto.id){setComp1(null);return;}
                      if(comp2?.id===foto.id){setComp2(null);return;}
                      if(!comp1){setComp1(foto);}
                      else if(!comp2){setComp2(foto);}
                    } else { setModalFoto(foto); }
                  }}>
                  <img src={foto.src} alt={foto.categoria}
                    style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",borderRadius:8,border:`2px solid ${selecionada?"rgba(167,139,250,.8)":"rgba(255,255,255,.06)"}`,transition:"all .2s"}}/>
                  {/* Badge slot comparação */}
                  {slotNumero&&(
                    <div style={{position:"absolute",top:6,left:6,background:C.purple,color:"#fff",fontFamily:"'Bebas Neue',cursive",fontSize:14,padding:"2px 8px",borderRadius:4}}>{slotNumero===1?"ANTES":"DEPOIS"}</div>
                  )}
                  {/* Info overlay */}
                  <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.9))",borderRadius:"0 0 7px 7px",padding:"16px 8px 8px"}}>
                    <p style={{fontSize:10,fontWeight:700,color:C.accent,letterSpacing:1}}>{foto.data}</p>
                    {foto.peso&&<p style={{fontSize:10,color:"#bbb"}}>{foto.peso}kg</p>}
                  </div>
                  {/* Botão excluir */}
                  {!comparando&&(
                    <button onClick={e=>{e.stopPropagation();excluirFoto(foto.id);}}
                      style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.8)",border:"none",color:"#888",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:12,lineHeight:1}}
                      onMouseOver={e=>e.target.style.color="#ff6b6b"}
                      onMouseOut={e=>e.target.style.color="#888"}>✕</button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ESTADO VAZIO */}
      {fotos.length === 0 && (
        <div className="card" style={{padding:"40px 28px",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:16}}>📸</div>
          <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,marginBottom:8}}>Nenhuma foto registrada</p>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.8,maxWidth:340,margin:"0 auto"}}>Registre fotos semanais para acompanhar sua transformação visual. A evolução que o espelho não mostra, as fotos revelam.</p>
        </div>
      )}

      {/* MODAL FULLSCREEN */}
      {modalFoto&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.97)",zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setModalFoto(null)}>
          <div style={{maxWidth:500,width:"100%",animation:"fadeUp .3s ease"}} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:18,letterSpacing:2,color:C.accent}}>{modalFoto.categoria}</p>
                <p style={{fontSize:11,color:C.muted}}>{modalFoto.data}{modalFoto.peso&&` • ${modalFoto.peso}kg`}</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>excluirFoto(modalFoto.id)} style={{padding:"6px 14px",background:"rgba(255,107,107,.1)",border:"1px solid rgba(255,107,107,.3)",borderRadius:6,color:"#ff6b6b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>🗑️ Excluir</button>
                <button onClick={()=>setModalFoto(null)} style={{padding:"6px 14px",background:"transparent",border:"1px solid #333",borderRadius:6,color:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>✕ Fechar</button>
              </div>
            </div>
            {/* Foto */}
            <img src={modalFoto.src} alt="" style={{width:"100%",maxHeight:"70vh",objectFit:"contain",borderRadius:12,border:"1px solid #202020"}}/>
            {/* Descrição */}
            {modalFoto.descricao&&<p style={{marginTop:12,fontSize:13,color:C.lgray,textAlign:"center",lineHeight:1.6}}>"{modalFoto.descricao}"</p>}
            {/* Navegação */}
            {fotosFiltradas.length > 1 && (
              <div style={{display:"flex",justifyContent:"space-between",marginTop:12,gap:8}}>
                {(()=>{
                  const idx = fotosFiltradas.findIndex(f=>f.id===modalFoto.id);
                  const prev = fotosFiltradas[idx+1];
                  const next = fotosFiltradas[idx-1];
                  return(
                    <>
                      <button onClick={()=>prev&&setModalFoto(prev)} disabled={!prev} style={{flex:1,padding:"8px",background:"transparent",border:`1px solid ${prev?"#333":"#1a1a1a"}`,borderRadius:7,color:prev?C.muted:"#333",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:prev?"pointer":"not-allowed"}}>← Anterior</button>
                      <button onClick={()=>next&&setModalFoto(next)} disabled={!next} style={{flex:1,padding:"8px",background:"transparent",border:`1px solid ${next?"#333":"#1a1a1a"}`,borderRadius:7,color:next?C.muted:"#333",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:next?"pointer":"not-allowed"}}>Próxima →</button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICAÇÕES SERVICE WORKER ─────────────────────────────────────────────
const NOTIF_KEY = "ic_notificacoes_config";

function registrarSW() {
  if (!("serviceWorker" in navigator)) return Promise.reject("SW não suportado");
  return navigator.serviceWorker.register("/sw.js").then(reg => reg);
}

async function enviarMensagemSW(dados) {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  if (reg.active) reg.active.postMessage(dados);
}

async function solicitarPermissao() {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

function Notificacoes() {
  const CONFIG_DEFAULT = {
    ativo: false,
    horarioTreino:   "07:00",
    horarioDieta:    "12:00",
    horarioAgua:     "09:00",
    horarioPeso:     "07:30",
    lembrarTreino:   true,
    lembrarDieta:    true,
    lembrarAgua:     true,
    lembrarPeso:     true,
    frequenciaAgua:  3, // horas entre lembretes de água
  };

  const [config, setConfig] = useState(() => {
    try { return { ...CONFIG_DEFAULT, ...JSON.parse(localStorage.getItem(NOTIF_KEY) || "{}") }; }
    catch { return CONFIG_DEFAULT; }
  });
  const [permissao, setPermissao] = useState(Notification?.permission || "default");
  const [swOk, setSwOk] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    registrarSW().then(() => setSwOk(true)).catch(() => setSwOk(false));
  }, []);

  function upd(k, v) {
    setConfig(p => ({ ...p, [k]: v }));
  }

  function msAte(horario) {
    const [h, m] = horario.split(":").map(Number);
    const agora = new Date();
    const alvo = new Date();
    alvo.setHours(h, m, 0, 0);
    if (alvo <= agora) alvo.setDate(alvo.getDate() + 1); // amanhã
    return alvo - agora;
  }

  async function salvar() {
    setSalvando(true);

    // Pede permissão se ainda não tem
    const perm = await solicitarPermissao();
    setPermissao(perm);

    if (perm !== "granted") {
      setSalvando(false);
      alert("Permissão de notificação negada. Acesse as configurações do browser e ative manualmente.");
      return;
    }

    // Cancela tudo antes de reagendar
    await enviarMensagemSW({ tipo: "CANCELAR_TODAS" });

    const novoConfig = { ...config, ativo: true };
    setConfig(novoConfig);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(novoConfig));

    // Agenda notificações
    const notifs = [];

    if (novoConfig.lembrarTreino) notifs.push({
      id: "treino",
      titulo: "🏋️ Hora do Treino, IRONCUT!",
      corpo: "Seu protocolo de hoje está esperando. Vamos lá, sem desculpas! 💪",
      delay: msAte(novoConfig.horarioTreino),
    });

    if (novoConfig.lembrarDieta) notifs.push({
      id: "dieta",
      titulo: "🥩 Lembrete de Refeição",
      corpo: "Hora de seguir o cardápio. Cada refeição te aproxima do resultado. ✅",
      delay: msAte(novoConfig.horarioDieta),
    });

    if (novoConfig.lembrarPeso) notifs.push({
      id: "peso",
      titulo: "⚖️ Registrar Peso",
      corpo: "Bom dia! Registre seu peso de hoje para acompanhar a evolução.",
      delay: msAte(novoConfig.horarioPeso),
    });

    if (novoConfig.lembrarAgua) {
      // Lembretes de água a cada X horas a partir do horário configurado
      const [hI, mI] = novoConfig.horarioAgua.split(":").map(Number);
      const inicio = new Date(); inicio.setHours(hI, mI, 0, 0);
      if (inicio <= new Date()) inicio.setDate(inicio.getDate() + 1);
      const freq = parseInt(novoConfig.frequenciaAgua) * 3600000;
      for (let i = 0; i < 4; i++) {
        notifs.push({
          id: `agua_${i}`,
          titulo: "💧 Beba Água!",
          corpo: `Hidratação em dia = performance máxima. Tome sua próxima garrafa agora!`,
          delay: (inicio - new Date()) + i * freq,
        });
      }
    }

    for (const n of notifs) {
      await enviarMensagemSW({ tipo: "AGENDAR_NOTIFICACAO", payload: { ...n, icone: "/logo.png" } });
    }

    setSalvando(false);
  }

  async function desativar() {
    await enviarMensagemSW({ tipo: "CANCELAR_TODAS" });
    const novoConfig = { ...config, ativo: false };
    setConfig(novoConfig);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(novoConfig));
  }

  const suportado = "Notification" in window && "serviceWorker" in navigator;

  return (
    <div>
      <div className="sec-label">Lembretes</div>
      <p className="sec-title">🔔 NOTIFICAÇÕES</p>

      {/* STATUS */}
      <div className="card" style={{padding:"16px 20px",marginBottom:18,border:`1px solid ${config.ativo&&permissao==="granted"?"rgba(34,197,94,.3)":"rgba(255,255,255,.06)"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:config.ativo&&permissao==="granted"?"#22c55e":"#333",boxShadow:config.ativo&&permissao==="granted"?"0 0 8px #22c55e":"none"}}/>
            <div>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textTransform:"uppercase",letterSpacing:1}}>
                {!suportado?"Não suportado":permissao==="denied"?"Bloqueado pelo browser":config.ativo?"Notificações ativas":"Notificações desativadas"}
              </p>
              <p style={{fontSize:11,color:C.muted,marginTop:2}}>
                {!suportado?"Use Chrome/Edge ou adicione à tela inicial no iOS":
                 permissao==="denied"?"Ative nas configurações do browser → Notificações":
                 config.ativo?"Lembretes agendados diariamente":
                 "Configure os horários e ative abaixo"}
              </p>
            </div>
          </div>
          {config.ativo&&permissao==="granted"&&(
            <button onClick={desativar} style={{padding:"6px 14px",background:"transparent",border:"1px solid rgba(255,107,107,.3)",borderRadius:7,color:"#ff6b6b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:1,cursor:"pointer"}}>Desativar</button>
          )}
        </div>
      </div>

      {/* iOS AVISO */}
      {/iphone|ipad/i.test(navigator.userAgent) && (
        <div style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.2)",borderRadius:10,padding:"14px 16px",marginBottom:18,fontSize:12,color:"#f59e0b",lineHeight:1.7}}>
          📱 <strong>iOS:</strong> Para receber notificações no iPhone, adicione o app à tela inicial primeiro: Safari → Compartilhar → "Adicionar à Tela de Início".
        </div>
      )}

      {/* CONFIGURAÇÕES */}
      <div className="card" style={{padding:"20px 22px",marginBottom:18}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Configurar Lembretes</p>

        {/* TREINO */}
        <div style={{padding:"14px 0",borderBottom:"1px solid #1a1a1a"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:config.lembrarTreino?10:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>🏋️</span>
              <div>
                <p style={{fontSize:14,fontWeight:600}}>Lembrete de Treino</p>
                <p style={{fontSize:11,color:C.muted}}>Hora de ir treinar</p>
              </div>
            </div>
            <div onClick={()=>upd("lembrarTreino",!config.lembrarTreino)} style={{width:42,height:24,borderRadius:12,background:config.lembrarTreino?C.accent:"#333",cursor:"pointer",position:"relative",transition:"background .2s"}}>
              <div style={{position:"absolute",top:3,left:config.lembrarTreino?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
            </div>
          </div>
          {config.lembrarTreino&&<input type="time" value={config.horarioTreino} onChange={e=>upd("horarioTreino",e.target.value)} style={{padding:"8px 12px",background:"#0D0D0D",border:"1px solid #222",borderRadius:7,color:C.accent,fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none",width:"140px"}} onFocus={e=>e.target.style.borderColor="#66FFF0"} onBlur={e=>e.target.style.borderColor="#222"}/>}
        </div>

        {/* DIETA */}
        <div style={{padding:"14px 0",borderBottom:"1px solid #1a1a1a"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:config.lembrarDieta?10:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>🥩</span>
              <div>
                <p style={{fontSize:14,fontWeight:600}}>Lembrete de Refeição</p>
                <p style={{fontSize:11,color:C.muted}}>Seguir o cardápio</p>
              </div>
            </div>
            <div onClick={()=>upd("lembrarDieta",!config.lembrarDieta)} style={{width:42,height:24,borderRadius:12,background:config.lembrarDieta?C.accent:"#333",cursor:"pointer",position:"relative",transition:"background .2s"}}>
              <div style={{position:"absolute",top:3,left:config.lembrarDieta?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
            </div>
          </div>
          {config.lembrarDieta&&<input type="time" value={config.horarioDieta} onChange={e=>upd("horarioDieta",e.target.value)} style={{padding:"8px 12px",background:"#0D0D0D",border:"1px solid #222",borderRadius:7,color:C.accent,fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none",width:"140px"}} onFocus={e=>e.target.style.borderColor="#66FFF0"} onBlur={e=>e.target.style.borderColor="#222"}/>}
        </div>

        {/* ÁGUA */}
        <div style={{padding:"14px 0",borderBottom:"1px solid #1a1a1a"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:config.lembrarAgua?10:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>💧</span>
              <div>
                <p style={{fontSize:14,fontWeight:600}}>Lembrete de Hidratação</p>
                <p style={{fontSize:11,color:C.muted}}>Repetido a cada X horas</p>
              </div>
            </div>
            <div onClick={()=>upd("lembrarAgua",!config.lembrarAgua)} style={{width:42,height:24,borderRadius:12,background:config.lembrarAgua?C.accent:"#333",cursor:"pointer",position:"relative",transition:"background .2s"}}>
              <div style={{position:"absolute",top:3,left:config.lembrarAgua?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
            </div>
          </div>
          {config.lembrarAgua&&(
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <div>
                <p style={{fontSize:10,color:C.muted,marginBottom:4}}>Primeiro lembrete</p>
                <input type="time" value={config.horarioAgua} onChange={e=>upd("horarioAgua",e.target.value)} style={{padding:"8px 12px",background:"#0D0D0D",border:"1px solid #222",borderRadius:7,color:C.accent,fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none",width:"140px"}} onFocus={e=>e.target.style.borderColor="#66FFF0"} onBlur={e=>e.target.style.borderColor="#222"}/>
              </div>
              <div>
                <p style={{fontSize:10,color:C.muted,marginBottom:4}}>Repetir a cada</p>
                <div style={{display:"flex",gap:6}}>
                  {[1,2,3,4].map(h=>(
                    <button key={h} onClick={()=>upd("frequenciaAgua",h)}
                      style={{padding:"7px 12px",borderRadius:6,border:`1px solid ${config.frequenciaAgua===h?"rgba(102,255,240,.5)":"#2a2a2a"}`,background:config.frequenciaAgua===h?"rgba(102,255,240,.1)":"#0D0D0D",color:config.frequenciaAgua===h?C.accent:C.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PESO */}
        <div style={{padding:"14px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:config.lembrarPeso?10:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>⚖️</span>
              <div>
                <p style={{fontSize:14,fontWeight:600}}>Registrar Peso</p>
                <p style={{fontSize:11,color:C.muted}}>Lembrete diário pela manhã</p>
              </div>
            </div>
            <div onClick={()=>upd("lembrarPeso",!config.lembrarPeso)} style={{width:42,height:24,borderRadius:12,background:config.lembrarPeso?C.accent:"#333",cursor:"pointer",position:"relative",transition:"background .2s"}}>
              <div style={{position:"absolute",top:3,left:config.lembrarPeso?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
            </div>
          </div>
          {config.lembrarPeso&&<input type="time" value={config.horarioPeso} onChange={e=>upd("horarioPeso",e.target.value)} style={{padding:"8px 12px",background:"#0D0D0D",border:"1px solid #222",borderRadius:7,color:C.accent,fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none",width:"140px"}} onFocus={e=>e.target.style.borderColor="#66FFF0"} onBlur={e=>e.target.style.borderColor="#222"}/>}
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <button onClick={salvar} disabled={salvando||!suportado||permissao==="denied"}
        style={{width:"100%",padding:"15px",background:salvando||!suportado||permissao==="denied"?"rgba(102,255,240,.1)":"linear-gradient(135deg,#00D4C8,#66FFF0)",color:salvando||!suportado||permissao==="denied"?"#66FFF0":"#000",border:"none",borderRadius:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,letterSpacing:2,textTransform:"uppercase",cursor:salvando||!suportado||permissao==="denied"?"not-allowed":"pointer",transition:"all .2s"}}>
        {salvando?"⏳ Ativando...":"🔔 Ativar Notificações"}
      </button>

      {/* INFO */}
      <div style={{marginTop:16,padding:"14px 16px",background:"rgba(0,0,0,.3)",border:"1px solid #1a1a1a",borderRadius:10,fontSize:11,color:C.muted,lineHeight:1.8}}>
        <p style={{fontWeight:700,color:C.lgray,marginBottom:4}}>ℹ️ Como funciona</p>
        <p>• As notificações são agendadas diariamente nos horários configurados.</p>
        <p>• Para reagendar (ex: mudar horário), clique em <strong style={{color:C.accent}}>Ativar</strong> novamente.</p>
        <p>• No iPhone, adicione o app à tela inicial para receber notificações com o app fechado.</p>
      </div>
    </div>
  );
}

// ─── DEMO PERFIL ─────────────────────────────────────────────────────────────
const DEMO_PERFIL={nome:"Carlos Mendes",email:"demo@ironcut.app",senha:"demo123",objetivo:"fat",sexo:"masculino",idade:"34",peso:"92",altura:"178",nivelAtividade:"Moderadamente ativo (3-4x/semana)",localTreino:"Academia completa",restricoes:[],condicoes:["Nenhuma"]};

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [tela,setTela]=useState("landing");
  const [aba,setAba]=useState("dashboard");
  const [perfil,setPerfil]=useState(null);
  const [proto,setProto]=useState(null);
  const [pesosLog,setPesos]=useState([]);
  const [aguaLog,setAguaLog]=useState({});
  const [loading,setLoading]=useState(false);
  const [showLogin,setLogin]=useState(false);
  const [bloqueado,setBloqueado]=useState(false);
  const [checkLog,setCheckLog]=useState({});
  const [pesoIdealReal,setPesoIdealReal]=useState(null);

  // Lê o histórico de medidas do localStorage e retorna o peso ideal calculado
  function carregarPesoIdealSalvo(email, pesoAtual, objetivo, sexo) {
    try {
      const hist = JSON.parse(localStorage.getItem(`ic_medidas_${email}`) || "[]");
      if (!hist.length) return null;
      const ultimo = hist[hist.length - 1];
      if (!ultimo.pct) return null;
      const info = pesoIdealPorGordura(pesoAtual, ultimo.pct, objetivo, sexo);
      return info.ideal;
    } catch { return null; }
  }

  useEffect(()=>{
    // Registrar Service Worker para notificações
    registrarSW().catch(()=>{});

    const sess=getSession();
    if(sess){
      (async()=>{
        const conta=await getContaFirebase(sess.email).catch(()=>null);
        if(conta&&conta.senha===sess.senha){
          const liberado=await verificarComprador(sess.email).catch(()=>true);
          setPerfil(conta.perfil);setProto(conta.protocolo);setPesos(conta.pesosLog||[]);
          const savedCheck1=JSON.parse(localStorage.getItem(`ic_check_${conta.perfil.email}`)||"{}");
          setCheckLog(savedCheck1);setAguaLog(conta.aguaLog||{});setBloqueado(!liberado);
          const pesoAtual1=(conta.pesosLog||[]).length?conta.pesosLog[conta.pesosLog.length-1].val:parseFloat(conta.perfil.peso);
          setPesoIdealReal(carregarPesoIdealSalvo(conta.perfil.email,pesoAtual1,conta.perfil.objetivo,conta.perfil.sexo));
          setTela("app");
        } else {
          const c=getContas();
          if(c[sess.email]&&c[sess.email].senha===sess.senha){
            const liberado=await verificarComprador(sess.email).catch(()=>true);
            setPerfil(c[sess.email].perfil);
            const savedCheck2=JSON.parse(localStorage.getItem(`ic_check_${c[sess.email].perfil.email}`)||"{}");
            setCheckLog(savedCheck2);setProto(c[sess.email].protocolo);setPesos(c[sess.email].pesosLog||[]);setAguaLog(c[sess.email].aguaLog||{});setBloqueado(!liberado);
            const pesoAtual2=(c[sess.email].pesosLog||[]).length?c[sess.email].pesosLog[c[sess.email].pesosLog.length-1].val:parseFloat(c[sess.email].perfil.peso);
            setPesoIdealReal(carregarPesoIdealSalvo(c[sess.email].perfil.email,pesoAtual2,c[sess.email].perfil.objetivo,c[sess.email].perfil.sexo));
            setTela("app");
          }
        }
      })();
    }
  },[]);

  function syncStorage(p,pr,pl,al){const dados={senha:p.senha||"",perfil:p,protocolo:pr,pesosLog:pl,aguaLog:al};saveContaFirebase(p.email,dados).catch(()=>{});}
  function onCadastro(p,pr,pl,al){setPerfil(p);setProto(pr);setPesos(pl);setAguaLog(al);setBloqueado(false);setTela("app");}
  function onLogin(p,pr,pl,al,comprou=true){
    setPerfil(p);setProto(pr);setPesos(pl);setAguaLog(al);setBloqueado(!comprou);setLogin(false);
    const pesoAtualLogin=pl.length?pl[pl.length-1].val:parseFloat(p.peso);
    setPesoIdealReal(carregarPesoIdealSalvo(p.email,pesoAtualLogin,p.objetivo,p.sexo));
    setTela("app");
  }
  function onLogout(){clearSession();setPerfil(null);setProto(null);setPesos([]);setAguaLog({});setBloqueado(false);setTela("landing");}

  function addPeso(v){
    const dataHoje=hoje();
    if(pesosLog.length&&pesosLog[pesosLog.length-1].data===dataHoje){alert("Você já registrou seu peso hoje! Volte amanhã. 💪");return;}
    const nl=[...pesosLog,{val:v,data:dataHoje}];setPesos(nl);syncStorage(perfil,proto,nl,aguaLog);
  }

  function toggleCheck(tipo){
    const d=hoje();const diaAtual=checkLog[d]||{treino:false,dieta:false};
    const novo={...checkLog,[d]:{...diaAtual,[tipo]:!diaAtual[tipo]}};
    setCheckLog(novo);localStorage.setItem(`ic_check_${perfil.email}`,JSON.stringify(novo));
  }

  function calcScore(){
    let total=0,dias=0;const ultimos21=Object.keys(checkLog).slice(-21);
    for(const d of ultimos21){dias++;const c=checkLog[d]||{};const agua=aguaLog[d]||0;const garrafas=Math.ceil(aguaDia(perfil.peso)/0.5);let pontos=0;if(c.treino)pontos+=35;if(c.dieta)pontos+=25;if(agua>=garrafas)pontos+=25;if(pesosLog.some(p=>p.data===d))pontos+=15;total+=pontos;}
    return dias?Math.round(total/dias):0;
  }

  function calcStreak(){
    let streak=0;const d=new Date();
    while(true){const data=`${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;const c=checkLog[data]||{};const agua=aguaLog[data]||0;const garrafas=Math.ceil(aguaDia(perfil.peso)/0.5);if(c.treino&&c.dieta&&agua>=garrafas){streak++;d.setDate(d.getDate()-1);}else break;}
    return streak;
  }

  function toggleAgua(n){const d=hoje();const cur=aguaLog[d]||0;const novo={...aguaLog,[d]:cur>=n?n-1:n};setAguaLog(novo);syncStorage(perfil,proto,pesosLog,novo);}

  async function onDemo(){
    setLoading(true);const pr=await gerarProtocolo(DEMO_PERFIL);
    const pl=[{val:92,data:"01/04/2025"},{val:91.2,data:"08/04/2025"},{val:90.5,data:"15/04/2025"},{val:89.8,data:"22/04/2025"},{val:89.0,data:hoje()}];
    setPerfil(DEMO_PERFIL);setProto(pr);setPesos(pl);setAguaLog({});setBloqueado(false);setLoading(false);setTela("app");
  }

  const navItems=[
    {id:"dashboard",icon:"⬡",label:"Dashboard"},
    {id:"treinos",  icon:"🏋",label:"Treinos"},
    {id:"dieta",    icon:"🥩",label:"Dieta"},
    {id:"medidas",  icon:"📏",label:"Medidas"},
    {id:"fotos",    icon:"📸",label:"Progresso"},
    {id:"esporte",  icon:"⚡",label:"Esporte"},
    {id:"perfil",   icon:"👤",label:"Perfil"},
  ];

  return(
    <div>
      <style>{FONTS}{CSS}</style>

      {tela==="landing"&&!showLogin&&(
        <>
          <Landing onStart={()=>setTela("cadastro")} onDemo={onDemo} onLogin={()=>setLogin(true)}/>
          {loading&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.94)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,zIndex:200}}><img src={LOGO_SRC} alt="" style={{width:120,height:120,objectFit:"contain",animation:"glowPulse 1.5s ease-in-out infinite"}}/><p style={{fontFamily:"'Bebas Neue'",fontSize:20,letterSpacing:4,color:C.accent}}>Forjando Protocolo...</p></div>)}
        </>
      )}

      {tela==="landing"&&showLogin&&<Login onLogin={onLogin} onBack={()=>setLogin(false)}/>}

      {tela==="cadastro"&&(
        <>
          <Landing onStart={()=>{}} onDemo={onDemo} onLogin={()=>setLogin(true)}/>
          <Cadastro onCadastro={onCadastro}/>
        </>
      )}

      {tela==="app"&&perfil&&bloqueado&&(<AcessoBloqueado email={perfil.email} onLogout={onLogout}/>)}

      {tela==="app"&&perfil&&!bloqueado&&(
        <div className="app-wrap">
          <div className="sidebar">
            <div className="slogo-wrap">
              <img src={LOGO_SRC} alt="" className="slogo-img"/>
              <div className="slogo-text"><span>IRON</span>CUT</div>
            </div>
            {navItems.map(n=>(<button key={n.id} className={`navbtn${aba===n.id?" on":""}`} onClick={()=>setAba(n.id)}><span style={{fontSize:18}}>{n.icon}</span>{n.label}</button>))}
            <div className="sbottom">{perfil.nome.split(" ")[0]}<br/><span style={{color:C.accent}}>{perfil.objetivo==="massa"?"💪 Massa":"🔥 Fat Loss"}</span></div>
          </div>

          <div className="mcontent">
            <div className="mob-header">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <img src={LOGO_SRC} alt="" style={{width:30,height:30,objectFit:"contain",filter:`drop-shadow(0 0 6px ${C.accent})`}}/>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:20,letterSpacing:3}}><span style={{color:C.accent}}>IRON</span>CUT</div>
              </div>
              <div style={{fontSize:11,color:C.muted,fontFamily:"'Barlow Condensed'",fontWeight:700,letterSpacing:2}}>{navItems.find(n=>n.id===aba)?.label.toUpperCase()}</div>
            </div>

            {aba==="dashboard"&&<Dashboard perfil={perfil} protocolo={proto} pesosLog={pesosLog} onAddPeso={addPeso} aguaLog={aguaLog} onToggleAgua={toggleAgua} checkLog={checkLog} toggleCheck={toggleCheck} calcScore={calcScore} calcStreak={calcStreak} pesoIdealReal={pesoIdealReal}/>}
            {aba==="treinos"&&proto&&<Treinos protocolo={proto} perfil={perfil} onUpdateProtocolo={p=>{setProto(p);syncStorage(perfil,p,pesosLog,aguaLog);}}/>}
            {aba==="dieta"&&proto&&<Dieta protocolo={proto} perfil={perfil} onUpdateProtocolo={p=>{setProto(p);syncStorage(perfil,p,pesosLog,aguaLog);}}/>}
            {aba==="medidas"&&<Medidas perfil={perfil} pesosLog={pesosLog} onPesoIdealAtualizado={v=>setPesoIdealReal(v)}/>}
            {aba==="fotos"&&<Fotos perfil={perfil}/>}
            {aba==="esporte"&&<Esporte perfil={perfil}/>}
            {aba==="perfil"&&<Perfil perfil={perfil} onLogout={onLogout} onAtualizarDados={novoPerfil=>{setPerfil(novoPerfil);syncStorage(novoPerfil,proto,pesosLog,aguaLog);}} onRefazerProtocolo={async(novoPerfil)=>{
              setLoading(true);
              const novoProto=await gerarProtocolo(novoPerfil);
              setPerfil(novoPerfil);setProto(novoProto);
              syncStorage(novoPerfil,novoProto,pesosLog,aguaLog);
              setLoading(false);setAba("dashboard");
            }}/>}
          </div>

          <div className="mob-nav">
            {navItems.map(n=>(<button key={n.id} className={`mob-nav-btn${aba===n.id?" on":""}`} onClick={()=>setAba(n.id)}><span style={{fontSize:16}}>{n.icon}</span>{n.label}</button>))}
          </div>
        </div>
      )}
    </div>
  );
}

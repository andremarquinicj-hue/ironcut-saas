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

.week-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:20px; }
.wcard { padding:14px 16px; border-radius:10px; }
.wcard-n    { font-family:'Bebas Neue',cursive; font-size:30px; color:${C.accent}; line-height:1; }
.wcard-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; text-transform:uppercase; margin:4px 0 2px; }
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
  .mob-nav { display:flex; justify-content:space-around; position:fixed; bottom:0; left:0; right:0; background:${C.surface}; border-top:1px solid ${C.border}; padding:8px 0 14px; z-index:50; }
  .mob-nav-btn { display:flex; flex-direction:column; align-items:center; gap:2px; font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${C.muted}; cursor:pointer; padding:4px 12px; background:none; border:none; }
  .mob-nav-btn.on { color:${C.accent}; }
  .mcontent { padding:14px 14px 80px; }
  .dash-grid { grid-template-columns:1fr 1fr; gap:10px; }
  .week-grid { grid-template-columns:1fr; }
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

// ─── ✅ NOVO: VERIFICAÇÃO DE COMPRADOR ───────────────────────────────────────
async function verificarComprador(email) {
  // Emails de demo e admin sempre liberados
  if (email === "demo@ironcut.app") return true;

  const chave = email.replace(/\./g, "_").replace(/@/g, "__at__");
  try {
    const res = await fetch(
      `https://ironcut-21d-default-rtdb.firebaseio.com/compradores/${chave}.json`
    );
    const data = await res.json();
    if (data && data.status === "ativo") return true;
    return false;
  } catch {
    // Se Firebase Realtime DB falhar, tenta Firestore
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

// ─── ✅ NOVO: TELA DE ACESSO BLOQUEADO ───────────────────────────────────────
function AcessoBloqueado({ email, onLogout }) {
  return (
    <div style={{
      minHeight:"100vh", background:"#0A0A0A", display:"flex",
      alignItems:"center", justifyContent:"center", padding:24,
      fontFamily:"'Barlow', sans-serif"
    }}>
      <style>{FONTS}</style>
      <div style={{
        maxWidth:480, width:"100%", background:"#141414",
        border:"1px solid #202020", borderRadius:16, padding:40, textAlign:"center",
        animation:"fadeUp .4s ease"
      }}>
        <div style={{
          width:72, height:72, borderRadius:"50%",
          background:"rgba(255,60,60,0.08)", border:"2px solid rgba(255,60,60,0.25)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 24px", fontSize:32
        }}>🔒</div>

        <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:32,letterSpacing:2,marginBottom:8,color:"#fff"}}>
          ACESSO NEGADO
        </p>
        <p style={{fontSize:14,color:"#666",marginBottom:8,lineHeight:1.6}}>
          O e-mail <strong style={{color:"#fff"}}>{email}</strong> não possui uma compra ativa do IRONCUT 21D.
        </p>
        <p style={{fontSize:13,color:"#444",marginBottom:28,lineHeight:1.7}}>
          Se você comprou recentemente, aguarde alguns minutos e tente novamente.
          O acesso é liberado automaticamente após a confirmação do pagamento.
        </p>

        <a
          href="https://pay.kiwify.com.br/DqjU8H4"
          target="_blank"
          rel="noreferrer"
          style={{
            display:"block",
            background:"linear-gradient(135deg,#00D4C8,#66FFF0)",
            color:"#000", fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:800, fontSize:15, letterSpacing:1.5,
            textTransform:"uppercase", padding:"15px 32px",
            borderRadius:8, textDecoration:"none", marginBottom:12
          }}
        >
          Adquirir IRONCUT 21D →
        </a>

        <button
          onClick={onLogout}
          style={{
            background:"transparent", border:"1px solid #202020", color:"#555",
            fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700,
            fontSize:13, letterSpacing:1.5, textTransform:"uppercase",
            padding:"11px 24px", borderRadius:8, cursor:"pointer", width:"100%"
          }}
        >
          Sair da conta
        </button>

        <p style={{marginTop:20,fontSize:11,color:"#333"}}>
          Dúvidas? ironcut21D@outlook.com
        </p>
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
        // ✅ VERIFICAÇÃO DE COMPRA
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
function Dashboard({ perfil, protocolo, pesosLog, onAddPeso, aguaLog, onToggleAgua, checkLog, toggleCheck, calcScore, calcStreak }) {
  const [newP,setNewP]=useState("");
  const motiv=getDayMotiv();
  const pesoAtual=pesosLog.length?pesosLog[pesosLog.length-1].val:parseFloat(perfil.peso);
  const ideal=parseFloat(pesoIdeal(perfil.altura,perfil.sexo));
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
      <div className="card-accent motiv-card" style={{marginBottom:18}}><div className="motiv-icon">{motiv.icon}</div><div className="motiv-text">"{motiv.text}"</div><div className="motiv-author">— {motiv.author}</div></div>
      <div className="sec-label">Bem-vindo de volta</div>
      <p style={{fontFamily:"'Bebas Neue'",fontSize:30,letterSpacing:1,marginBottom:18}}>OLÁ, {perfil.nome.split(" ")[0].toUpperCase()}!{" "}<span className={`badge ${isMassa?"badge-mass":"badge-fat"}`}>{isMassa?"💪 MASSA":"🔥 FAT LOSS"}</span></p>
      <div className="dash-grid" style={{marginBottom:18}}>
        <div className="card-accent dc"><div className="dc-label">Peso Atual</div><div className="dc-val">{pesoAtual}kg</div><div className="dc-sub">Meta: {ideal}kg</div></div>
        <div className="card dc">
          <div className="dc-label">
            {isMassa
              ? (parseFloat(perdido)>=0?"Ganho":"Perdido")
              : (parseFloat(perdido)>=0?"Perdido":"Ganhou")
            }
          </div>
          <div className="dc-val" style={{
            color: isMassa
              ? (parseFloat(perdido)>=0?C.purple:"#ff6b6b")
              : (parseFloat(perdido)>=0?C.accent:"#ff6b6b"),
            fontSize:32
          }}>
            {parseFloat(perdido)<0?"+":""}{Math.abs(parseFloat(perdido)).toFixed(1)}kg
          </div>
          <div className="dc-sub">Desde o início</div>
        </div>
        <div className="card dc"><div className="dc-label">Falta</div><div className="dc-val" style={{fontSize:32}}>{falta}kg</div><div className="dc-sub">Para o peso ideal</div></div>
        <div className="card dc"><div className="dc-label">IMC Atual</div><div className="dc-val" style={{fontSize:30}}>{imc}</div><div className="dc-sub">{clsIMC(parseFloat(imc))}</div></div>
      </div>
      <div className="card" style={{padding:"18px 20px",marginBottom:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Progresso na Meta</p><div className="prog-wrap"><div className="prog-fill" style={{width:`${progPct}%`}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted}}><span>{perfil.peso}kg</span><span style={{color:C.accent,fontWeight:700}}>{progPct}% concluído</span><span>{ideal}kg</span></div></div>
      <div className="card" style={{padding:"18px 20px",marginBottom:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Evolução do Peso</p>{pesosLog.length>=2?(<div className="chart-wrap"><svg width="100%" height="100%" viewBox={`0 0 ${cW} ${cH+20}`} preserveAspectRatio="none"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity=".25"/><stop offset="100%" stopColor={C.accent} stopOpacity="0"/></linearGradient></defs>{path&&<><path d={`${path} L${cW},${cH} L0,${cH} Z`} fill="url(#cg)"/><path d={path} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{pesosLog.map((p,i)=>{const vals=pesosLog.map(x=>x.val);const mn=Math.min(...vals)-.5,mx=Math.max(...vals)+.5;const x=(i/(vals.length-1||1))*cW;const y=cH-((p.val-mn)/(mx-mn||1))*cH;return(<g key={i}><circle cx={x} cy={y} r="5" fill={C.accent} style={{filter:`drop-shadow(0 0 4px ${C.accent})`}}/><text x={x} y={cH+14} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="Barlow">{p.data.split("/").slice(0,2).join("/")}</text></g>);})}</>}</svg></div>):(<p style={{color:C.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>Registre seu peso diariamente para ver a evolução aqui.</p>)}<div className="weight-form"><input type="number" placeholder="Registrar peso de hoje (kg)" value={newP} onChange={e=>setNewP(e.target.value)}/><button onClick={()=>{if(newP){onAddPeso(parseFloat(newP));setNewP("");}}}> + Registrar</button></div></div>
      <div className="card-accent water-section"><div className="water-header"><div><p className="water-title">💧 Hidratação Diária</p><p className="water-meta">Meta: {litrosNecessarios}L por dia ({garrafas} garrafas de 500ml)</p></div><div style={{textAlign:"right"}}><div className="water-total">{litrosHoje}L / {litrosNecessarios}L</div><div style={{fontSize:11,color:C.muted}}>{aguaPct}% da meta</div></div></div><div className="water-bar-bg"><div className="water-bar-fill" style={{width:`${aguaPct}%`}}/></div><div className="water-bottles">{Array.from({length:garrafas},(_,i)=>(<div key={i} className="bottle" onClick={()=>onToggleAgua(i+1)}><div className={`bottle-icon${aguaHoje>i?" full":""}`}>💧</div><div className="bottle-label">{(i+1)*500}ml</div></div>))}</div>{aguaHoje>=garrafas&&(<p style={{textAlign:"center",marginTop:10,fontSize:13,color:C.accent,fontWeight:700}}>✅ Meta de hidratação atingida hoje!</p>)}</div>
      {protocolo?.kcal&&(<div className="card" style={{padding:"18px 20px",marginTop:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Distribuição de Macros</p><div className="macro-grid"><div className="card macro-card"><div className="macro-val">{protocolo.kcal}</div><div className="macro-label">kcal/dia</div></div><div className="card macro-card"><div className="macro-val">{protocolo.prot}g</div><div className="macro-label">Proteína</div></div><div className="card macro-card"><div className="macro-val">{protocolo.carb}g</div><div className="macro-label">Carboidrato</div></div></div>{protocolo.dica&&(<div style={{background:"rgba(102,255,240,.05)",border:`1px solid rgba(102,255,240,.15)`,borderRadius:8,padding:"12px 16px",fontSize:13,color:C.lgray}}>💡 <strong style={{color:C.accent}}>Dica IA:</strong> {protocolo.dica}</div>)}</div>)}
    </div>
  );
}

// ─── TREINOS ──────────────────────────────────────────────────────────────────
function Treinos({ protocolo, perfil, onUpdateProtocolo }) {
  const [msgs,setMsgs]=useState([{role:"ai",text:`Olá ${perfil.nome.split(" ")[0]}! Sou seu Personal IA 💪 Posso substituir exercícios e o plano será ATUALIZADO automaticamente!`}]);
  const [input,setInput]=useState(""); const [load,setLoad]=useState(false);
  const dias=protocolo?.treinos?Object.entries(protocolo.treinos):[];
  const CARGA_KEY=`ic_cargas_${perfil.email}`;
  const [cargas,setCargas]=useState(()=>{try{return JSON.parse(localStorage.getItem(CARGA_KEY)||"{}");}catch{return{};}});

  function salvarCarga(dia,idx,val){if(!val.trim())return;const key=`${dia}-${idx}`;const atual=cargas[key]||{carga:"",historico:[]};const hist=atual.historico.filter(h=>h!==val).slice(-4);hist.push(val);const novo={...cargas,[key]:{carga:val,historico:hist}};setCargas(novo);localStorage.setItem(CARGA_KEY,JSON.stringify(novo));}

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
      <div className="week-grid">{dias.map(([dia,info])=>(<div key={dia} className="card wcard"><div className="wcard-n">{dia}</div><div className="wcard-name">{info.nome}</div><div className="wcard-desc">{info.ex.length} exercícios</div></div>))}</div>
      {dias.map(([dia,info])=>(<div key={dia} style={{marginBottom:16}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:8,color:C.accent}}>{dia} — {info.nome}</p><div className="treino-list card">{info.ex.map(([nome,sets],i)=>{const key=`${dia}-${i}`;const dadoCarga=cargas[key]||{carga:"",historico:[]};return(<div key={i}><div className="treino-item"><div className="treino-num">{String(i+1).padStart(2,"0")}</div><div className="treino-name">{nome}</div><div className="treino-sets">{sets}</div></div><div className="carga-row"><span className="carga-label">Carga:</span><input className="carga-input" type="number" placeholder="0" value={dadoCarga.carga} onChange={e=>{const novo={...cargas,[key]:{...dadoCarga,carga:e.target.value}};setCargas(novo);localStorage.setItem(CARGA_KEY,JSON.stringify(novo));}} onBlur={e=>salvarCarga(dia,i,e.target.value)}/><span className="carga-unit">kg</span>{dadoCarga.historico.length>1&&(<div className="carga-hist"><span style={{fontSize:10,color:"#444",marginRight:2}}>Histórico:</span>{dadoCarga.historico.slice(0,-1).slice(-3).map((h,j)=>(<span key={j} className="carga-hist-item">{h}kg</span>))}</div>)}</div></div>);})}</div></div>))}
      <div className="card ia-section"><div className="ia-header"><div className="ia-dot"/><p className="ia-title">Personal IA</p><p className="ia-sub">Substitua exercícios e personalize seu treino</p></div><div className="chat-msgs">{msgs.map((m,i)=>(m.text==="typing"?<div key={i} className="cmsg ai typing"><span/><span/><span/></div>:<div key={i} className={`cmsg ${m.isUpdate?"update":m.role}`}>{m.text}</div>))}</div><div className="chips">{quickChips.map(c=><div key={c} className="chip" onClick={()=>send(c)}>{c}</div>)}</div><div className="chat-input-row"><input className="chat-input" placeholder="Ex: Não gosto de agachamento, o que posso substituir?" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="chat-send" onClick={()=>send()} disabled={load}>Enviar</button></div></div>
    </div>
  );
}

// ─── DIETA ────────────────────────────────────────────────────────────────────
// SUBSTITUA toda a função Dieta por esta versão atualizada

function Dieta({ protocolo, perfil, onUpdateProtocolo }) {
  const [msgs,setMsgs]=useState([{role:"ai",text:`Olá ${perfil.nome.split(" ")[0]}! Sou sua Nutricionista IA 🥗 Posso substituir alimentos e o cardápio será ATUALIZADO automaticamente!`}]);
  const [input,setInput]=useState(""); const [load,setLoad]=useState(false);
  const [showLista, setShowLista]=useState(false);

  // ── GERAR PDF DA DIETA ─────────────────────────────────────────────────────
  function gerarPDF() {
    const isMassa = perfil.objetivo === "massa";
    const tipoDieta = isMassa ? "BULKING" : "CUTTING";

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Dieta IRONCUT — ${perfil.nome}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family: Arial, sans-serif; background: #fff; color: #111; padding: 32px; }
  .header { text-align:center; border-bottom: 3px solid #00D4C8; padding-bottom: 20px; margin-bottom: 24px; }
  .logo { font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #111; }
  .logo span { color: #00D4C8; }
  .subtitle { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 4px; }
  .tipo { display: inline-block; background: #00D4C8; color: #000; font-size: 12px; font-weight: 700; letter-spacing: 2px; padding: 4px 16px; text-transform: uppercase; margin-top: 10px; }
  .info-row { display: flex; justify-content: space-between; background: #f5f5f5; padding: 12px 20px; margin-bottom: 24px; border-left: 4px solid #00D4C8; }
  .info-item { text-align: center; }
  .info-val { font-size: 22px; font-weight: 900; color: #00D4C8; }
  .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; }
  .section-title { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-bottom: 12px; }
  .meal { margin-bottom: 16px; border: 1px solid #eee; page-break-inside: avoid; }
  .meal-head { background: #f9f9f9; border-bottom: 1px solid #eee; padding: 10px 16px; display: flex; align-items: center; gap: 12px; }
  .meal-time { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #00D4C8; }
  .meal-name { font-size: 14px; font-weight: 700; text-transform: uppercase; }
  .meal-body { padding: 10px 16px; }
  .meal-item { font-size: 13px; color: #444; padding: 3px 0; display: flex; gap: 8px; align-items: flex-start; }
  .meal-item::before { content: "—"; color: #00D4C8; flex-shrink: 0; font-size: 10px; margin-top: 2px; }
  .supl { margin-top: 20px; }
  .supl-item { display: flex; gap: 8px; font-size: 13px; color: #444; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
  .supl-item::before { content: "💊"; flex-shrink:0; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #bbb; letter-spacing: 1px; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo"><span>IRON</span>CUT</div>
    <div class="subtitle">Protocolo de Transformação Corporal com IA</div>
    <div class="tipo">Dieta ${tipoDieta}</div>
  </div>

  <div class="info-row">
    <div class="info-item"><div class="info-val">${protocolo.kcal}</div><div class="info-label">Kcal / Dia</div></div>
    <div class="info-item"><div class="info-val">${protocolo.prot}g</div><div class="info-label">Proteína</div></div>
    <div class="info-item"><div class="info-val">${protocolo.carb}g</div><div class="info-label">Carboidrato</div></div>
    <div class="info-item"><div class="info-val">${protocolo.gord}g</div><div class="info-label">Gordura</div></div>
    <div class="info-item"><div class="info-val">${perfil.nome.split(" ")[0]}</div><div class="info-label">Aluno</div></div>
  </div>

  <div class="section-title">Plano Alimentar Diário</div>

  ${(protocolo.refeicoes||[]).map(ref => `
  <div class="meal">
    <div class="meal-head">
      <div class="meal-time">${ref.h}</div>
      <div class="meal-name">${ref.n}</div>
    </div>
    <div class="meal-body">
      ${ref.it.map(it => `<div class="meal-item">${it}</div>`).join("")}
    </div>
  </div>`).join("")}

  ${protocolo.suplementos?.length ? `
  <div class="supl">
    <div class="section-title" style="margin-top:20px">Suplementação</div>
    ${protocolo.suplementos.map(s => `<div class="supl-item">${s}</div>`).join("")}
  </div>` : ""}

  <div class="footer">
    IRONCUT 21D — Gerado em ${new Date().toLocaleDateString("pt-BR")} • appironcut.com
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        setTimeout(() => { win.print(); }, 500);
      };
    }
  }

  // ── GERAR LISTA DE COMPRAS SEMANAL ────────────────────────────────────────
  function gerarListaCompras() {
    if (!protocolo?.refeicoes) return {};

    // Extrai todos os itens de todas as refeições
    const todosItens = protocolo.refeicoes.flatMap(ref => ref.it);

    // Parser para extrair quantidade e item
    function parsearItem(texto) {
      // Padrões: "200g frango", "3 ovos", "1 banana", "40g aveia", "½ abacate"
      const match = texto.match(/^([\d½¼¾,.]+\s*(?:g|kg|ml|l|col|dose|fatia|fatias|xícara|xícaras|porção)?\s*(?:de\s*)?)/i);
      const qtd = match ? match[1].trim() : "1x";
      const nome = texto.replace(/^[\d½¼¾,.]+\s*(?:g|kg|ml|l|col\.?|dose|fatia|fatias|xícara|xícaras|porção)?\s*(?:de\s*)?/i, "").trim();
      return { qtd, nome: nome || texto };
    }

    // Agrupa por categoria
    const categorias = {
      "🥩 Proteínas": [],
      "🍚 Carboidratos": [],
      "🥗 Vegetais e Frutas": [],
      "🥛 Laticínios e Ovos": [],
      "🫒 Gorduras e Temperos": [],
      "💊 Suplementos": [],
      "☕ Bebidas": [],
      "📦 Outros": [],
    };

    function categorizar(texto) {
      const t = texto.toLowerCase();
      if (/(frango|carne|atum|salmão|peixe|whey|proteína|ovo|peito)/i.test(t)) return "🥩 Proteínas";
      if (/(arroz|batata|pão|aveia|macarrão|mandioca|feijão|lentilha|carboidrato|granola|mel)/i.test(t)) return "🍚 Carboidratos";
      if (/(banana|maçã|fruta|salada|brócolis|legume|tomate|alface|espinafre|pepino|vegetal|verdura|iogurte)/i.test(t)) return "🥗 Vegetais e Frutas";
      if (/(iogurte|leite|queijo|ovo|requeijão)/i.test(t)) return "🥛 Laticínios e Ovos";
      if (/(azeite|castanha|amendoim|abacate|pasta|óleo|gordura)/i.test(t)) return "🫒 Gorduras e Temperos";
      if (/(creatina|whey|suplemento|vitamina|cafeína|dose|ômega)/i.test(t)) return "💊 Suplementos";
      if (/(café|chá|água|suco)/i.test(t)) return "☕ Bebidas";
      return "📦 Outros";
    }

    // Agrupa itens iguais e multiplica por 7
    const agrupado = {};
    todosItens.forEach(item => {
      const { qtd, nome } = parsearItem(item);
      const chave = nome.toLowerCase().trim();
      if (!agrupado[chave]) {
        agrupado[chave] = { nome, qtd, count: 0, categoria: categorizar(item) };
      }
      agrupado[chave].count++;
    });

    // Organiza por categoria com quantidade semanal
    Object.values(agrupado).forEach(({ nome, qtd, count, categoria }) => {
      // Extrai número da quantidade para multiplicar
      const numMatch = qtd.match(/[\d.]+/);
      const unidadeMatch = qtd.match(/[a-zA-ZgGkKmMlLç½¼¾]+/g);
      const unidade = unidadeMatch ? unidadeMatch.join("") : "x";

      let qtdSemanal;
      if (numMatch) {
        const num = parseFloat(numMatch[0]);
        const total = (num * count * 7).toFixed(0);
        qtdSemanal = `${total}${unidade}`;
      } else {
        qtdSemanal = `${count * 7}x`;
      }

      if (categorias[categoria]) {
        // Evita duplicatas
        const jaExiste = categorias[categoria].find(i => i.nome.toLowerCase() === nome.toLowerCase());
        if (!jaExiste) {
          categorias[categoria].push({ nome, qtd: qtdSemanal });
        }
      }
    });

    // Remove categorias vazias
    return Object.fromEntries(
      Object.entries(categorias).filter(([, itens]) => itens.length > 0)
    );
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

      {/* TÍTULO + BOTÕES */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap"}}>
        <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:34,letterSpacing:1,margin:0}}>
          DIETA {perfil.objetivo==="massa"?"BULKING":"CUTTING"}
        </p>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <button
            onClick={gerarPDF}
            style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"8px 14px",background:"transparent",
              border:`1px solid rgba(102,255,240,.3)`,borderRadius:7,
              color:"#66FFF0",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:700,fontSize:12,letterSpacing:1.5,
              textTransform:"uppercase",cursor:"pointer",
              transition:"all .2s",whiteSpace:"nowrap"
            }}
            onMouseOver={e=>e.currentTarget.style.background="rgba(102,255,240,.08)"}
            onMouseOut={e=>e.currentTarget.style.background="transparent"}
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={()=>setShowLista(s=>!s)}
            style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"8px 14px",
              background:showLista?"rgba(102,255,240,.15)":"transparent",
              border:`1px solid ${showLista?"rgba(102,255,240,.5)":"rgba(102,255,240,.3)"}`,
              borderRadius:7,color:"#66FFF0",
              fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:700,fontSize:12,letterSpacing:1.5,
              textTransform:"uppercase",cursor:"pointer",
              transition:"all .2s",whiteSpace:"nowrap"
            }}
          >
            🛒 Lista de Compras
          </button>
        </div>
      </div>

      {/* LISTA DE COMPRAS SEMANAL */}
      {showLista && (
        <div style={{
          background:"#0F0F0F",border:"1px solid rgba(102,255,240,.2)",
          borderRadius:12,padding:"20px 24px",marginBottom:20,
          animation:"fadeUp .3s ease"
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <p style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:2,color:"#66FFF0"}}>
                🛒 LISTA DE COMPRAS — 7 DIAS
              </p>
              <p style={{fontSize:11,color:"#666",marginTop:2}}>
                Quantidades calculadas para uma semana completa
              </p>
            </div>
            <button
              onClick={()=>{
                // Copia para clipboard
                const texto = Object.entries(lista).map(([cat, itens]) =>
                  `${cat}\n${itens.map(i => `  • ${i.qtd} ${i.nome}`).join("\n")}`
                ).join("\n\n");
                navigator.clipboard.writeText(texto).then(()=>alert("Lista copiada! 📋"));
              }}
              style={{
                padding:"6px 14px",background:"transparent",
                border:"1px solid #333",borderRadius:6,
                color:"#666",fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:700,fontSize:11,letterSpacing:1,
                textTransform:"uppercase",cursor:"pointer"
              }}
            >
              📋 Copiar
            </button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {Object.entries(lista).map(([categoria, itens]) => (
              <div key={categoria} style={{
                background:"rgba(255,255,255,.02)",border:"1px solid #1a1a1a",
                borderRadius:8,padding:"14px 16px"
              }}>
                <p style={{
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:12,textTransform:"uppercase",letterSpacing:1,
                  color:"#888",marginBottom:10
                }}>{categoria}</p>
                {itens.map((item, i) => (
                  <div key={i} style={{
                    display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)",
                    fontSize:13
                  }}>
                    <span style={{color:"#ccc"}}>{item.nome}</span>
                    <span style={{
                      color:"#66FFF0",fontWeight:700,fontSize:12,
                      background:"rgba(102,255,240,.08)",padding:"2px 8px",
                      borderRadius:4,whiteSpace:"nowrap",marginLeft:8
                    }}>{item.qtd}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {protocolo?.kcal&&(<div className="macro-grid" style={{marginBottom:18}}><div className="card macro-card"><div className="macro-val">{protocolo.kcal}</div><div style={{fontSize:11,color:"#66FFF0",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>kcal/dia</div><div className="macro-label">Calorias</div></div><div className="card macro-card"><div className="macro-val">{protocolo.prot}<span style={{fontSize:14,color:"#666"}}> g</span></div><div style={{fontSize:11,color:"#66FFF0",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>por dia</div><div className="macro-label">Proteína</div></div><div className="card macro-card"><div className="macro-val">{protocolo.carb}<span style={{fontSize:14,color:"#666"}}> g</span></div><div style={{fontSize:11,color:"#66FFF0",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>por dia</div><div className="macro-label">Carboidrato</div></div></div>)}
      {protocolo?.refeicoes&&(<div className="meal-grid">{protocolo.refeicoes.map((ref,i)=>(<div key={i} className="card meal-card"><div className="meal-head"><div className="meal-time">{ref.h}</div><div className="meal-name">{ref.n}</div></div><div className="meal-body">{ref.it.map((it,j)=><div key={j} className="meal-item">{it}</div>)}</div></div>))}</div>)}
      {protocolo?.suplementos&&(<div className="card" style={{padding:"18px 20px",marginBottom:18}}><p style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Suplementação</p>{protocolo.suplementos.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid #202020`,fontSize:13}}><span style={{color:"#66FFF0"}}>💊</span><span style={{color:"#BBBBBB"}}>{s}</span></div>))}</div>)}
      <div className="card ia-section"><div className="ia-header"><div className="ia-dot"/><p className="ia-title">Nutricionista IA</p><p className="ia-sub">Adapte seu cardápio livremente</p></div><div className="chat-msgs">{msgs.map((m,i)=>(m.text==="typing"?<div key={i} className="cmsg ai typing"><span/><span/><span/></div>:<div key={i} className={`cmsg ${m.isUpdate?"update":m.role}`}>{m.text}</div>))}</div><div className="chips">{quickChips.map(c=><div key={c} className="chip" onClick={()=>send(c)}>{c}</div>)}</div><div className="chat-input-row"><input className="chat-input" placeholder="Ex: Não gosto de ovo, o que posso comer no café?" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="chat-send" onClick={()=>send()} disabled={load}>Enviar</button></div></div>
    </div>
  );
}


// ─── PERFIL ───────────────────────────────────────────────────────────────────
function Perfil({ perfil, onLogout, onRefazerProtocolo }) {
  const [modal,setModal]=useState(false);
  const [novoObj,setNovoObj]=useState(perfil.objetivo);
  const [novaAtiv,setNovaAtiv]=useState(perfil.nivelAtividade);
  const [novoLocal,setNovoLocal]=useState(perfil.localTreino);
  const isMassa=perfil.objetivo==="massa";
  const ideal=pesoIdeal(perfil.altura,perfil.sexo);
  const imc=calcIMC(perfil.peso,perfil.altura);
  const rows=[["Nome",perfil.nome],["E-mail",perfil.email],["Sexo",perfil.sexo.charAt(0).toUpperCase()+perfil.sexo.slice(1)],["Idade",`${perfil.idade} anos`],["Altura",`${perfil.altura}cm`],["Peso Inicial",`${perfil.peso}kg`],["IMC Inicial",`${imc} — ${clsIMC(parseFloat(imc))}`],["Peso Ideal",`${ideal}kg`],["Nível de Atividade",perfil.nivelAtividade],["Local de Treino",perfil.localTreino]];

  return(
    <div>
      <div className="sec-label">Meu Perfil</div>
      <p className="sec-title">DADOS <span style={{color:C.accent}}>PESSOAIS</span></p>
      <div style={{marginBottom:14}}><span className={`badge ${isMassa?"badge-mass":"badge-fat"}`} style={{fontSize:14,padding:"6px 16px"}}>{isMassa?"💪 Objetivo: Ganho de Massa":"🔥 Objetivo: Emagrecimento"}</span></div>
      <div className="card" style={{padding:"6px 20px",marginBottom:14}}>{rows.map(([l,v])=>(<div key={l} className="perfil-row"><span className="pr-label">{l}</span><span className="pr-val">{v}</span></div>))}{perfil.restricoes?.length>0&&(<div className="perfil-row"><span className="pr-label">Restrições</span><span className="pr-val">{perfil.restricoes.join(", ")}</span></div>)}</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <button className="btn btn-accent" onClick={()=>setModal(true)}>🔄 Refazer Protocolo</button>
        <button className="btn btn-outline" onClick={onLogout}>Sair da Conta</button>
      </div>
      {modal&&(<div className="modal"><div className="modal-box"><p className="cad-title">REFAZER <span>PROTOCOLO</span></p><p className="cad-sub">Atualize seu objetivo e seu plano será regenerado!</p><div className="field"><label>Novo Objetivo</label><div className="goal-grid"><div className={`goal-card${novoObj==="fat"?" sel-fat":""}`} onClick={()=>setNovoObj("fat")}><div className="gi">🔥</div><div className="gn">Emagrecer</div><div className="gd">Déficit calórico e definição</div></div><div className={`goal-card${novoObj==="massa"?" sel-mass":""}`} onClick={()=>setNovoObj("massa")}><div className="gi">💪</div><div className="gn">Ganhar Massa</div><div className="gd">Hipertrofia e superávit</div></div></div></div><div className="field"><label>Nível de Atividade</label><select value={novaAtiv} onChange={e=>setNovaAtiv(e.target.value)}>{Object.keys(ATIVIDADE).map(k=><option key={k} value={k}>{k}</option>)}</select></div><div className="field"><label>Local de Treino</label><div className="pill-group">{["Academia completa","Academia básica","Em casa","Ao ar livre"].map(l=>(<div key={l} className={`pill${novoLocal===l?" sel":""}`} onClick={()=>setNovoLocal(l)}>{l}</div>))}</div></div><div style={{display:"flex",gap:10,marginTop:20}}><button className="btn btn-accent" style={{flex:1}} onClick={()=>{onRefazerProtocolo({...perfil,objetivo:novoObj,nivelAtividade:novaAtiv,localTreino:novoLocal});setModal(false);}}>🔥 Gerar Novo Protocolo</button><button className="btn btn-outline" onClick={()=>setModal(false)}>Cancelar</button></div></div></div>)}
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
        <>{
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:"16px 20px",background:C.card,border:`1px solid rgba(102,255,240,.2)`,borderRadius:12}}>
            <div style={{fontSize:40}}>{emojis[esporte]||"🏆"}</div>
            <div><p style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:2,color:C.accent}}>{esporte}</p><p style={{fontSize:12,color:C.muted}}>Protocolo de performance ativo</p></div>
          </div>
        }
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

// ─── DEMO PERFIL ─────────────────────────────────────────────────────────────
const DEMO_PERFIL={nome:"Carlos Mendes",email:"demo@ironcut.app",senha:"demo123",objetivo:"fat",sexo:"masculino",idade:"34",peso:"92",altura:"178",nivelAtividade:"Moderadamente ativo (3-4x/semana)",localTreino:"Academia completa",restricoes:[],condicoes:["Nenhuma"]};

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [tela,     setTela]    = useState("landing");
  const [aba,      setAba]     = useState("dashboard");
  const [perfil,   setPerfil]  = useState(null);
  const [proto,    setProto]   = useState(null);
  const [pesosLog, setPesos]   = useState([]);
  const [aguaLog,  setAguaLog] = useState({});
  const [loading,  setLoading] = useState(false);
  const [showLogin,setLogin]   = useState(false);
  // ✅ NOVO: estado de bloqueio
  const [bloqueado, setBloqueado] = useState(false);
const [checkLog, setCheckLog] = useState({});

  // Restore session on mount
  useEffect(()=>{
    const sess=getSession();
    if(sess){
      (async()=>{
        const conta=await getContaFirebase(sess.email).catch(()=>null);
        if(conta&&conta.senha===sess.senha){
          // ✅ VERIFICAÇÃO DE COMPRA na restauração de sessão
          const liberado = await verificarComprador(sess.email).catch(()=>true);
          setPerfil(conta.perfil);
          setProto(conta.protocolo);
          setPesos(conta.pesosLog||[]);
          const savedCheck = JSON.parse(localStorage.getItem(`ic_check_${conta.perfil.email}`) || "{}");
setCheckLog(savedCheck);
          setAguaLog(conta.aguaLog||{});
          setBloqueado(!liberado);
          setTela("app");
        } else {
          const c=getContas();
          if(c[sess.email]&&c[sess.email].senha===sess.senha){
            const liberado = await verificarComprador(sess.email).catch(()=>true);
            setPerfil(c[sess.email].perfil);
            const savedCheck = JSON.parse(localStorage.getItem(`ic_check_${c[sess.email].perfil.email}`) || "{}");
setCheckLog(savedCheck);
            setProto(c[sess.email].protocolo);
            setPesos(c[sess.email].pesosLog||[]);
            setAguaLog(c[sess.email].aguaLog||{});
            setBloqueado(!liberado);
            setTela("app");
          }
        }
      })();
    }
  },[]);

  function syncStorage(p,pr,pl,al){
    const dados={senha:p.senha||"",perfil:p,protocolo:pr,pesosLog:pl,aguaLog:al};
    saveContaFirebase(p.email,dados).catch(()=>{});
  }

  function onCadastro(p,pr,pl,al){
    // Novos cadastros NÃO verificam compra — eles acabaram de criar conta
    // A verificação ocorre apenas no login
    setPerfil(p);setProto(pr);setPesos(pl);setAguaLog(al);
    setBloqueado(false); // recém cadastrado, libera para ver o app
    setTela("app");
  }

  // ✅ ATUALIZADO: recebe parâmetro "comprou"
  function onLogin(p,pr,pl,al, comprou=true){
    setPerfil(p);setProto(pr);setPesos(pl);setAguaLog(al);
    setBloqueado(!comprou);
    setLogin(false);setTela("app");
  }

  function onLogout(){
    clearSession();setPerfil(null);setProto(null);setPesos([]);
    setAguaLog({});setBloqueado(false);setTela("landing");
  }

  function addPeso(v){
    const dataHoje=hoje();
    if(pesosLog.length&&pesosLog[pesosLog.length-1].data===dataHoje){alert("Você já registrou seu peso hoje! Volte amanhã. 💪");return;}
    const nl=[...pesosLog,{val:v,data:dataHoje}];
    setPesos(nl);syncStorage(perfil,proto,nl,aguaLog);
  }

  function toggleCheck(tipo){
    const d=hoje();
    const diaAtual=checkLog[d]||{treino:false,dieta:false};
    const novo={...checkLog,[d]:{...diaAtual,[tipo]:!diaAtual[tipo]}};
    setCheckLog(novo);
    localStorage.setItem(`ic_check_${perfil.email}`,JSON.stringify(novo));
  }

  function calcScore(){
    let total=0,dias=0;
    const ultimos21=Object.keys(checkLog).slice(-21);
    for(const d of ultimos21){
      dias++;
      const c=checkLog[d]||{};
      const agua=aguaLog[d]||0;
      const garrafas=Math.ceil(aguaDia(perfil.peso)/0.5);
      let pontos=0;
      if(c.treino)pontos+=35;
      if(c.dieta)pontos+=25;
      if(agua>=garrafas)pontos+=25;
      if(pesosLog.some(p=>p.data===d))pontos+=15;
      total+=pontos;
    }
    return dias?Math.round(total/dias):0;
  }

  function calcStreak(){
    let streak=0;
    const d=new Date();
    while(true){
      const data=`${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
      const c=checkLog[data]||{};
      const agua=aguaLog[data]||0;
      const garrafas=Math.ceil(aguaDia(perfil.peso)/0.5);
      if(c.treino&&c.dieta&&agua>=garrafas){streak++;d.setDate(d.getDate()-1);}
      else break;
    }
    return streak;
  }

  function toggleAgua(n){
    const d=hoje();
    const cur=aguaLog[d]||0;
    const novo={...aguaLog,[d]:cur>=n?n-1:n};
    setAguaLog(novo);syncStorage(perfil,proto,pesosLog,novo);
  }

  async function onDemo(){
    setLoading(true);
    const pr=await gerarProtocolo(DEMO_PERFIL);
    const pl=[{val:92,data:"01/04/2025"},{val:91.2,data:"08/04/2025"},{val:90.5,data:"15/04/2025"},{val:89.8,data:"22/04/2025"},{val:89.0,data:hoje()}];
    setPerfil(DEMO_PERFIL);setProto(pr);setPesos(pl);setAguaLog({});
    setBloqueado(false); // demo sempre liberado
    setLoading(false);setTela("app");
  }

  const navItems=[
    {id:"dashboard",icon:"⬡",label:"Dashboard"},
    {id:"treinos",  icon:"🏋",label:"Treinos"},
    {id:"dieta",    icon:"🥩",label:"Dieta"},
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

      {/* ✅ TELA DE BLOQUEIO — exibida quando usuário logou mas não comprou */}
      {tela==="app" && perfil && bloqueado && (
        <AcessoBloqueado email={perfil.email} onLogout={onLogout}/>
      )}

      {/* APP NORMAL — só exibido quando liberado */}
      {tela==="app" && perfil && !bloqueado && (
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

            {aba==="dashboard"&&<Dashboard perfil={perfil} protocolo={proto} pesosLog={pesosLog} onAddPeso={addPeso} aguaLog={aguaLog} onToggleAgua={toggleAgua} checkLog={checkLog} toggleCheck={toggleCheck} calcScore={calcScore} calcStreak={calcStreak}/>}
            {aba==="treinos"&&proto&&<Treinos protocolo={proto} perfil={perfil} onUpdateProtocolo={p=>{setProto(p);syncStorage(perfil,p,pesosLog,aguaLog);}}/>}
            {aba==="dieta"&&proto&&<Dieta protocolo={proto} perfil={perfil} onUpdateProtocolo={p=>{setProto(p);syncStorage(perfil,p,pesosLog,aguaLog);}}/>}
            {aba==="esporte"&&<Esporte perfil={perfil}/>}
            {aba==="perfil"&&<Perfil perfil={perfil} onLogout={onLogout} onRefazerProtocolo={async(novoPerfil)=>{
              setLoading(true);
              const novoProto=await gerarProtocolo(novoPerfil);
              setPerfil(novoPerfil);setProto(novoProto);
              syncStorage(novoPerfil,novoProto,pesosLog,aguaLog);
              setLoading(false);setAba("dashboard");
            }}/>}
          </div>

          <div className="mob-nav">
            {navItems.map(n=>(<button key={n.id} className={`mob-nav-btn${aba===n.id?" on":""}`} onClick={()=>setAba(n.id)}><span style={{fontSize:20}}>{n.icon}</span>{n.label}</button>))}
          </div>
        </div>
      )}
    </div>
  );
}

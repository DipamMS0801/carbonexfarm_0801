import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #080F08;
  --surface:   #0D1A0D;
  --surface2:  #122012;
  --border:    #1E3A1E;
  --lime:      #8FD400;
  --lime2:     #B8FF00;
  --cyan:      #00C8D8;
  --amber:     #F59E0B;
  --red:       #EF4444;
  --muted:     #4A6741;
  --text:      #E8F5E2;
  --text2:     #8BAF84;
  --font-head: 'Syne', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--surface); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

@keyframes fadeIn  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
@keyframes spin    { to { transform:rotate(360deg) } }
.fade-in { animation: fadeIn .4s ease both; }
.spin     { animation: spin 1s linear infinite; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  transition: border-color .2s;
}
.card:hover { border-color: var(--lime); }

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 8px; border: none;
  font-family: var(--font-body); font-weight: 600; font-size: 14px;
  cursor: pointer; transition: all .2s; white-space: nowrap;
}
.btn-lime   { background: var(--lime);  color: #000; }
.btn-lime:hover   { background: var(--lime2); transform: translateY(-1px); }
.btn-outline{ background: transparent; color: var(--lime); border: 1px solid var(--lime); }
.btn-outline:hover{ background: rgba(143,212,0,.1); }
.btn-ghost  { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
.btn-ghost:hover { border-color: var(--lime); color: var(--lime); }
.btn-sm     { padding: 6px 14px; font-size: 13px; }
.btn:disabled { opacity: .4; cursor: not-allowed; transform: none !important; }

.input {
  width: 100%; background: var(--surface2); border: 1px solid var(--border);
  border-radius: 8px; padding: 10px 14px; color: var(--text);
  font-family: var(--font-body); font-size: 14px; outline: none;
  transition: border-color .2s;
}
.input:focus { border-color: var(--lime); }
.input::placeholder { color: var(--muted); }

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
}
.badge-lime { background: rgba(143,212,0,.15); color: var(--lime); border: 1px solid rgba(143,212,0,.3); }
.badge-cyan { background: rgba(0,200,216,.15); color: var(--cyan); border: 1px solid rgba(0,200,216,.3); }
.badge-amber{ background: rgba(245,158,11,.15); color: var(--amber); border: 1px solid rgba(245,158,11,.3); }
.badge-red  { background: rgba(239,68,68,.15);  color: var(--red);   border: 1px solid rgba(239,68,68,.3); }

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--lime), var(--cyan));
}

.progress-bar { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
.progress-fill {
  height: 100%; border-radius: 3px;
  background: linear-gradient(90deg, var(--lime), var(--cyan));
  transition: width .8s ease;
}

.tab-btn {
  padding: 8px 18px; border: none; background: transparent;
  color: var(--text2); font-family: var(--font-body); font-size: 14px; font-weight: 500;
  cursor: pointer; border-radius: 8px; transition: all .2s;
  display: inline-flex; align-items: center; gap: 6px;
}
.tab-btn.active { background: var(--surface2); color: var(--lime); }
.tab-btn:hover:not(.active) { color: var(--text); background: rgba(255,255,255,.03); }

.tag {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  background: rgba(143,212,0,.1); color: var(--lime);
  font-size: 11px; font-weight: 600; border: 1px solid rgba(143,212,0,.2);
}

.tx-hash { font-family: var(--font-mono); font-size: 12px; color: var(--cyan); }

.section-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.section-sub   { font-size: 13px; color: var(--text2); margin-bottom: 20px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
@media(max-width:900px){ .grid-4,.grid-3 { grid-template-columns: 1fr 1fr; } }
@media(max-width:600px){ .grid-4,.grid-3,.grid-2 { grid-template-columns: 1fr; } }

.tx-card {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 10px; padding: 16px;
  font-family: var(--font-mono); font-size: 12px; transition: border-color .2s;
}
.tx-card:hover { border-color: var(--cyan); }
.tx-row { display:flex; justify-content:space-between; padding: 5px 0; border-bottom: 1px solid var(--border); }
.tx-row:last-child { border-bottom: none; }
.tx-label { color: var(--muted); flex-shrink:0; margin-right:12px; }
.tx-val   { color: var(--text); text-align:right; word-break:break-all; }

.notif {
  position: fixed; bottom: 24px; right: 24px; z-index: 999;
  background: var(--surface); border: 1px solid var(--lime);
  border-radius: 10px; padding: 14px 18px; font-size: 14px;
  max-width: 340px; box-shadow: 0 8px 32px rgba(0,0,0,.5);
  animation: fadeIn .3s ease both;
}
.notif.error { border-color: var(--red); }

.listing-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; transition: all .2s;
}
.listing-card:hover { border-color: var(--lime); transform: translateY(-1px); }

.spinner {
  width: 36px; height: 36px; border: 3px solid var(--border);
  border-top-color: var(--lime); border-radius: 50%;
  animation: spin .8s linear infinite;
}
`;

/* ─── IN-MEMORY DB ──────────────────────────── */
let DB = {
  users: [
    { id:"u1", email:"rajesh@farm.com", password:"farm123", role:"farmer",
      name:"Rajesh Kumar", location:"Punjab, India", farmSize:45,
      points:320, credits:82, revenue:41000, listings:3, totalSold:140,
      monthlyCredits:[28,34,31,42,38,44,51,48,53,61,58,65],
      monthlyRevenue:[14000,17000,15500,21000,19000,22000,25500,24000,26500,30500,29000,32500] },
    { id:"u2", email:"admin@greentech.com", password:"corp123", role:"company",
      name:"GreenTech Solutions", location:"Mumbai, India",
      points:580, totalPurchased:420, totalSpend:210000,
      monthlySpend:[12000,18000,15000,22000,28000,19000,31000,27000,34000,29000,38000,42000] },
  ],
  listings: [
    { id:"l1", farmerId:"u1", farmerName:"Rajesh Kumar", location:"Punjab, India",
      credits:50, pricePerCredit:12.5, totalValue:625, cropType:"Rice",
      practices:["Organic Farming","No-Till Farming"], co2Offset:47.5, confidence:89, verified:true,
      createdAt:"2026-01-15", status:"active" },
    { id:"l2", farmerId:"u3", farmerName:"Priya Sharma", location:"Maharashtra, India",
      credits:80, pricePerCredit:11.0, totalValue:880, cropType:"Soybean",
      practices:["Agroforestry","Drip Irrigation","Cover Crops"], co2Offset:76.0, confidence:93, verified:true,
      createdAt:"2026-02-01", status:"active" },
    { id:"l3", farmerId:"u4", farmerName:"Arjun Patel", location:"Tamil Nadu, India",
      credits:35, pricePerCredit:14.0, totalValue:490, cropType:"Sugarcane",
      practices:["Organic Farming","Cover Crops"], co2Offset:33.25, confidence:86, verified:false,
      createdAt:"2026-02-10", status:"active" },
    { id:"l4", farmerId:"u5", farmerName:"Meera Nair", location:"Tamil Nadu, India",
      credits:120, pricePerCredit:10.5, totalValue:1260, cropType:"Rice",
      practices:["No-Till Farming","Drip Irrigation","Agroforestry"], co2Offset:114.0, confidence:95, verified:true,
      createdAt:"2026-02-18", status:"active" },
    { id:"l5", farmerId:"u6", farmerName:"Suresh Reddy", location:"Haryana, India",
      credits:60, pricePerCredit:13.0, totalValue:780, cropType:"Wheat",
      practices:["No-Till Farming","Cover Crops"], co2Offset:57.0, confidence:84, verified:true,
      createdAt:"2026-03-01", status:"active" },
  ],
  transactions: [
    { id:"tx1", buyerId:"u2", sellerId:"u1", credits:30, pricePerCredit:12.0, total:360,
      txHash:"0x4a8f2b9c1d3e5f7a0b2c4d6e8f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6",
      blockNumber:18234561, gasUsed:21000, network:"carbonex-mainnet-1",
      timestamp:"2026-01-20T14:32:00Z", status:"confirmed",
      farmerName:"Rajesh Kumar", buyerName:"GreenTech Solutions" },
    { id:"tx2", buyerId:"u2", sellerId:"u3", credits:80, pricePerCredit:11.0, total:880,
      txHash:"0x9b2e5f1a3c6d8e0f2a4b7c9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9",
      blockNumber:18289442, gasUsed:21000, network:"carbonex-mainnet-1",
      timestamp:"2026-02-05T09:15:00Z", status:"confirmed",
      farmerName:"Priya Sharma", buyerName:"GreenTech Solutions" },
  ],
};

/* ─── ML MODEL ──────────────────────────────── */
const CROP_MULT     = { Rice:1.20,Wheat:0.80,Corn:0.90,Soybean:1.10,Cotton:0.85,Sugarcane:1.05,Other:1.00 };
const PRACTICE_BONUS= { "Organic Farming":0.30,"No-Till Farming":0.20,"Cover Crops":0.15,"Drip Irrigation":0.10,"Agroforestry":0.25 };
const REGION_MULT   = { Punjab:1.05,Haryana:1.02,Maharashtra:1.08,"Tamil Nadu":1.10,"Uttar Pradesh":0.98 };

function runML({ farmSize, cropType, practices, location }) {
  const cm = CROP_MULT[cropType]||1;
  const pm = 1 + practices.reduce((s,p)=>s+(PRACTICE_BONUS[p]||0),0);
  const rk = Object.keys(REGION_MULT).find(r=>(location||"").includes(r))||null;
  const rm = rk ? REGION_MULT[rk] : 1;
  const base = farmSize * 1.8;
  const total = Math.round(base * cm * pm * rm);
  const conf = Math.min(97, 68 + Math.min(10,farmSize/20) + practices.length*4 + (rk?5:0));
  return {
    credits:total, co2Offset:+(total*0.95).toFixed(2), confidence:Math.round(conf),
    breakdown:{ base:Math.round(base), cropBonus:Math.round(base*(cm-1)), practiceBonus:Math.round(base*cm*(pm-1)), regionalCorr:Math.round(base*cm*pm*(rm-1)) },
    marketValue:{ min:+(total*9.5).toFixed(0), avg:+(total*12.5).toFixed(0), max:+(total*16).toFixed(0) },
  };
}

/* ─── BLOCKCHAIN UTILS ──────────────────────── */
function genHash(){ const h="0123456789abcdef"; return "0x"+Array.from({length:64},()=>h[Math.floor(Math.random()*16)]).join(""); }
function genBlock(){ return Math.floor(18000000+Math.random()*500000); }
function genId(){ return Math.random().toString(36).slice(2,10); }

/* ─── CHART HELPERS ─────────────────────────── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS  = ["#8FD400","#00C8D8","#F59E0B","#EF4444","#A78BFA","#34D399"];
const tick    = { fontFamily:"'Outfit',sans-serif", fontSize:12, fill:"#8BAF84" };

const Tip = ({ active, payload, label, pre="", suf="" }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"#0D1A0D", border:"1px solid #1E3A1E", borderRadius:8, padding:"10px 14px", fontSize:13 }}>
      <p style={{ color:"#8BAF84", marginBottom:6 }}>{label}</p>
      {payload.map((p,i)=>(
        <p key={i} style={{ color:p.color||"#8FD400" }}>{p.name}: <strong>{pre}{typeof p.value==="number"?p.value.toLocaleString():p.value}{suf}</strong></p>
      ))}
    </div>
  );
};

/* ─── ICON ──────────────────────────────────── */
const PATHS = {
  leaf:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
  home:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  chart:"M3 3v18h18M9 17V9m4 8v-5m4 5V5",
  list:"M4 6h16M4 10h16M4 14h16M4 18h16",
  plus:"M12 5v14M5 12h14",
  check:"M20 6L9 17l-5-5",
  shop:"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  lock:"M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  chain:"M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  logout:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  wallet:"M21 12V7H5a2 2 0 010-4h14v4M21 12a2 2 0 010 4H5a2 2 0 000 4h16v-4",
  upload:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
};
const Icon = ({ name, size=16, color="currentColor" }) => {
  const p = PATHS[name]; if (!p) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={p}/>
    </svg>
  );
};

/* ─── NOTIFICATION ──────────────────────────── */
function Notification({ msg, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,4500); return()=>clearTimeout(t); },[onClose]);
  return (
    <div className={`notif${type==="error"?" error":""}`}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12 }}>
        <span>{msg}</span>
        <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text2)",cursor:"pointer",fontSize:16 }}>✕</button>
      </div>
    </div>
  );
}

/* ─── AUTH ──────────────────────────────────── */
function AuthPage({ onLogin }) {
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("farmer");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [name,setName]=useState("");
  const [err,setErr]=useState("");

  const submit = () => {
    setErr("");
    if (mode==="login") {
      const u=DB.users.find(u=>u.email===email&&u.password===pw);
      if (!u){ setErr("Invalid email or password."); return; }
      onLogin(u);
    } else {
      if (!name||!email||!pw){ setErr("All fields are required."); return; }
      if (DB.users.find(u=>u.email===email)){ setErr("Email already registered."); return; }
      const nu={ id:genId(),email,password:pw,role,name,points:0,credits:0,revenue:0,listings:0,totalSold:0,totalPurchased:0,totalSpend:0,monthlyCredits:Array(12).fill(0),monthlyRevenue:Array(12).fill(0),monthlySpend:Array(12).fill(0) };
      DB.users.push(nu); onLogin(nu);
    }
  };

  return (
    <div style={{ minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 50%,rgba(143,212,0,.06),transparent 50%),radial-gradient(circle at 80% 20%,rgba(0,200,216,.04),transparent 40%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(143,212,0,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(143,212,0,.03) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none" }}/>
      <div className="fade-in" style={{ width:"100%",maxWidth:440,position:"relative",zIndex:1 }}>
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:12,marginBottom:14 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,var(--lime),var(--cyan))",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Icon name="leaf" size={22} color="#000"/>
            </div>
            <span style={{ fontFamily:"var(--font-head)",fontSize:26,fontWeight:800 }}>CarboNex<span style={{ color:"var(--lime)" }}>Farm</span></span>
          </div>
          <p style={{ color:"var(--text2)",fontSize:14 }}>Carbon Credit Trading Platform</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          <div style={{ display:"flex",background:"var(--surface2)",borderRadius:10,padding:4,marginBottom:28 }}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{
                flex:1,padding:"8px 0",border:"none",borderRadius:8,cursor:"pointer",
                background:mode===m?"var(--surface)":"transparent",
                color:mode===m?"var(--lime)":"var(--text2)",
                fontFamily:"var(--font-body)",fontWeight:600,fontSize:14,transition:"all .2s"
              }}>{m==="login"?"Sign In":"Register"}</button>
            ))}
          </div>

          {mode==="register"&&(
            <>
              <label style={{ display:"block",marginBottom:6,fontSize:13,color:"var(--text2)" }}>Full Name</label>
              <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} style={{ marginBottom:16 }}/>
              <label style={{ display:"block",marginBottom:8,fontSize:13,color:"var(--text2)" }}>Role</label>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
                {["farmer","company"].map(r=>(
                  <button key={r} onClick={()=>setRole(r)} style={{
                    padding:"12px 0",border:`1px solid ${role===r?"var(--lime)":"var(--border)"}`,
                    borderRadius:8,background:role===r?"rgba(143,212,0,.1)":"var(--surface2)",
                    color:role===r?"var(--lime)":"var(--text2)",cursor:"pointer",
                    fontFamily:"var(--font-body)",fontWeight:600,fontSize:13,transition:"all .2s"
                  }}>{r==="farmer"?"🌾 Farmer":"🏢 Company"}</button>
                ))}
              </div>
            </>
          )}

          <label style={{ display:"block",marginBottom:6,fontSize:13,color:"var(--text2)" }}>Email</label>
          <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{ marginBottom:16 }}/>
          <label style={{ display:"block",marginBottom:6,fontSize:13,color:"var(--text2)" }}>Password</label>
          <input className="input" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} style={{ marginBottom:24 }} onKeyDown={e=>e.key==="Enter"&&submit()}/>

          {err&&<div style={{ background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"10px 14px",marginBottom:16,color:"var(--red)",fontSize:13 }}>{err}</div>}

          <button className="btn btn-lime" style={{ width:"100%",justifyContent:"center",padding:"12px 0",fontSize:15 }} onClick={submit}>
            {mode==="login"?"Sign In →":"Create Account →"}
          </button>

          {mode==="login"&&(
            <div style={{ marginTop:20,background:"var(--surface2)",borderRadius:8,padding:14,fontSize:12,color:"var(--text2)" }}>
              <p style={{ color:"var(--lime)",fontWeight:600,marginBottom:6 }}>Demo Accounts</p>
              <p>🌾 Farmer: rajesh@farm.com / farm123</p>
              <p style={{ marginTop:4 }}>🏢 Company: admin@greentech.com / corp123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── NAVBAR ────────────────────────────────── */
function Navbar({ user, page, setPage, onLogout }) {
  return (
    <nav style={{ background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:100 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,var(--lime),var(--cyan))",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon name="leaf" size={16} color="#000"/>
        </div>
        <span style={{ fontFamily:"var(--font-head)",fontWeight:800,fontSize:18 }}>CarboNex<span style={{ color:"var(--lime)" }}>Farm</span></span>
      </div>
      <div style={{ display:"flex",gap:4 }}>
        <button className={`tab-btn${page==="dashboard"?" active":""}`} onClick={()=>setPage("dashboard")}>Dashboard</button>
        {user.role==="company"&&<button className={`tab-btn${page==="explorer"?" active":""}`} onClick={()=>setPage("explorer")}>⛓ Explorer</button>}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:13,fontWeight:600 }}>{user.name}</div>
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <span className={`badge ${user.role==="farmer"?"badge-lime":"badge-cyan"}`} style={{ fontSize:11 }}>{user.role==="farmer"?"🌾 Farmer":"🏢 Company"}</span>
            <span style={{ fontSize:12,color:"var(--amber)" }}>⭐{user.points}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icon name="logout" size={14}/>Logout</button>
      </div>
    </nav>
  );
}

/* ─── FARMER DASHBOARD ──────────────────────── */
function FarmerDashboard({ user, setUser, showNotif }) {
  const [tab,setTab]=useState("overview");
  const tabs=[{id:"overview",label:"Overview",icon:"home"},{id:"generate",label:"Generate Credits",icon:"upload"},{id:"listings",label:"My Listings",icon:"list"},{id:"analytics",label:"Analytics",icon:"chart"}];
  return (
    <div style={{ padding:24,maxWidth:1200,margin:"0 auto" }}>
      <div style={{ display:"flex",gap:4,marginBottom:28,background:"var(--surface)",borderRadius:12,padding:6,border:"1px solid var(--border)",width:"fit-content" }}>
        {tabs.map(t=><button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}><Icon name={t.icon} size={14}/>{t.label}</button>)}
      </div>
      {tab==="overview"  && <FarmerOverview  user={user}/>}
      {tab==="generate"  && <FarmerGenerate  user={user} setUser={setUser} showNotif={showNotif}/>}
      {tab==="listings"  && <FarmerListings  user={user}/>}
      {tab==="analytics" && <FarmerAnalytics user={user}/>}
    </div>
  );
}

function FarmerOverview({ user }) {
  const u=DB.users.find(x=>x.id===user.id)||user;
  const data=MONTHS.map((m,i)=>({month:m,credits:u.monthlyCredits[i]||0,revenue:u.monthlyRevenue[i]||0}));
  const myTx=DB.transactions.filter(tx=>tx.sellerId===user.id);
  return (
    <div className="fade-in">
      <div className="section-title">Farm Overview</div>
      <div className="section-sub">Track your carbon credit performance and earnings</div>
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          {label:"Total Credits",   val:`${u.credits||82} tCO₂`,                    icon:"leaf",  color:"var(--lime)"},
          {label:"Total Revenue",   val:`₹${(u.revenue||41000).toLocaleString()}`,   icon:"wallet",color:"var(--cyan)"},
          {label:"Active Listings", val:`${DB.listings.filter(l=>l.farmerId===user.id&&l.status==="active").length}`, icon:"list",color:"var(--amber)"},
          {label:"Reward Points",   val:`${u.points} pts`,                           icon:"star",  color:"var(--amber)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
              <span style={{ fontSize:13,color:"var(--text2)" }}>{s.label}</span>
              <Icon name={s.icon} size={18} color={s.color}/>
            </div>
            <div style={{ fontFamily:"var(--font-head)",fontSize:24,fontWeight:700,color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ marginBottom:24 }}>
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Monthly Credits Generated</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8FD400" stopOpacity={0.3}/><stop offset="95%" stopColor="#8FD400" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A1E"/>
              <XAxis dataKey="month" tick={tick}/><YAxis tick={tick}/>
              <Tooltip content={<Tip suf=" tCO₂"/>}/>
              <Area type="monotone" dataKey="credits" name="Credits" stroke="#8FD400" fill="url(#gc)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Market Price Trend (₹/credit)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[10.2,11.5,10.8,12.0,11.8,13.2,12.5,14.0,13.8,15.2,14.5,16.0].map((v,i)=>({month:MONTHS[i],price:v}))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A1E"/>
              <XAxis dataKey="month" tick={tick}/><YAxis tick={tick} domain={[9,17]}/>
              <Tooltip content={<Tip pre="₹"/>}/>
              <Line type="monotone" dataKey="price" name="Price" stroke="#00C8D8" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <p style={{ fontWeight:600,marginBottom:16 }}>Recent Sales</p>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead><tr style={{ borderBottom:"1px solid var(--border)" }}>{["Buyer","Credits","Price","Total","Date","Status"].map(h=><th key={h} style={{ padding:"8px 12px",textAlign:"left",color:"var(--text2)",fontWeight:500 }}>{h}</th>)}</tr></thead>
            <tbody>
              {myTx.map(tx=>(
                <tr key={tx.id} style={{ borderBottom:"1px solid var(--border)" }}>
                  <td style={{ padding:"10px 12px" }}>{tx.buyerName}</td>
                  <td style={{ padding:"10px 12px",color:"var(--lime)" }}>{tx.credits} tCO₂</td>
                  <td style={{ padding:"10px 12px" }}>₹{tx.pricePerCredit}</td>
                  <td style={{ padding:"10px 12px",color:"var(--cyan)" }}>₹{tx.total.toLocaleString()}</td>
                  <td style={{ padding:"10px 12px",color:"var(--text2)" }}>{tx.timestamp.split("T")[0]}</td>
                  <td style={{ padding:"10px 12px" }}><span className="badge badge-lime">✓ Confirmed</span></td>
                </tr>
              ))}
              {myTx.length===0&&<tr><td colSpan={6} style={{ padding:"20px 12px",textAlign:"center",color:"var(--text2)" }}>No sales yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FarmerGenerate({ user, setUser, showNotif }) {
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({farmSize:"",cropType:"Rice",practices:[],location:""});
  const [prog,setProg]=useState(0);
  const [stage,setStage]=useState(0);
  const [result,setResult]=useState(null);
  const [price,setPrice]=useState("");
  const [listed,setListed]=useState(false);

  const CROPS=["Rice","Wheat","Corn","Soybean","Cotton","Sugarcane","Other"];
  const PRACTICES=["Organic Farming","No-Till Farming","Cover Crops","Drip Irrigation","Agroforestry"];
  const STAGES=["Extracting farm features…","Applying crop multipliers…","Evaluating practices…","Regional climate correction…","Computing confidence score…"];

  const toggleP = p => setForm(f=>({...f,practices:f.practices.includes(p)?f.practices.filter(x=>x!==p):[...f.practices,p]}));

  const generate = async () => {
    if (!form.farmSize||!form.location){ showNotif("Fill in all required fields.","error"); return; }
    setStep(1); setProg(0); setStage(0);
    for(let i=0;i<5;i++){ await new Promise(r=>setTimeout(r,600)); setStage(i); setProg((i+1)*20); }
    const r=runML({farmSize:parseFloat(form.farmSize),cropType:form.cropType,practices:form.practices,location:form.location});
    setResult(r); setStep(2);
  };

  const listCredits = () => {
    if (!price||isNaN(parseFloat(price))){ showNotif("Enter a valid price.","error"); return; }
    const L={id:genId(),farmerId:user.id,farmerName:user.name,location:form.location,credits:result.credits,pricePerCredit:parseFloat(price),totalValue:+(result.credits*parseFloat(price)).toFixed(2),cropType:form.cropType,practices:form.practices,co2Offset:result.co2Offset,confidence:result.confidence,verified:false,createdAt:new Date().toISOString().split("T")[0],status:"active"};
    DB.listings.push(L);
    const u=DB.users.find(x=>x.id===user.id);
    if(u){u.credits=(u.credits||0)+result.credits;u.listings=(u.listings||0)+1;u.points+= Math.floor(result.credits*2);}
    setUser({...user,credits:(user.credits||0)+result.credits,listings:(user.listings||0)+1,points:(user.points||0)+50});
    setListed(true);
    showNotif(`✅ ${result.credits} credits listed on marketplace! +50 reward points earned.`);
  };

  const reset = () => { setStep(0);setResult(null);setListed(false);setPrice("");setForm({farmSize:"",cropType:"Rice",practices:[],location:""}); };

  if (step===0) return (
    <div className="fade-in">
      <div className="section-title">Generate Carbon Credits</div>
      <div className="section-sub">Enter farm details — ML model computes verified carbon sequestration</div>
      <div style={{ maxWidth:660 }}>
        <div className="card" style={{ marginBottom:16 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
            <div>
              <label style={{ display:"block",marginBottom:6,fontSize:13,color:"var(--text2)" }}>Farm Size (hectares) *</label>
              <input className="input" type="number" placeholder="e.g. 50" value={form.farmSize} onChange={e=>setForm(f=>({...f,farmSize:e.target.value}))}/>
            </div>
            <div>
              <label style={{ display:"block",marginBottom:6,fontSize:13,color:"var(--text2)" }}>Location *</label>
              <input className="input" placeholder="e.g. Punjab, India" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block",marginBottom:8,fontSize:13,color:"var(--text2)" }}>Crop Type</label>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {CROPS.map(c=>(
                <button key={c} onClick={()=>setForm(f=>({...f,cropType:c}))} style={{ padding:"6px 14px",border:`1px solid ${form.cropType===c?"var(--lime)":"var(--border)"}`,borderRadius:6,background:form.cropType===c?"rgba(143,212,0,.1)":"var(--surface2)",color:form.cropType===c?"var(--lime)":"var(--text2)",cursor:"pointer",fontFamily:"var(--font-body)",fontSize:13,transition:"all .15s" }}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display:"block",marginBottom:8,fontSize:13,color:"var(--text2)" }}>Sustainable Practices</label>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {PRACTICES.map(p=>(
                <button key={p} onClick={()=>toggleP(p)} style={{ padding:"6px 14px",border:`1px solid ${form.practices.includes(p)?"var(--cyan)":"var(--border)"}`,borderRadius:6,background:form.practices.includes(p)?"rgba(0,200,216,.1)":"var(--surface2)",color:form.practices.includes(p)?"var(--cyan)":"var(--text2)",cursor:"pointer",fontFamily:"var(--font-body)",fontSize:13,transition:"all .15s" }}>{form.practices.includes(p)?"✓ ":""}{p}</button>
              ))}
            </div>
          </div>
        </div>
        <button className="btn btn-lime" onClick={generate} style={{ width:"100%",justifyContent:"center",padding:"12px 0" }}>
          <Icon name="upload" size={16}/> Run ML Model & Generate Credits
        </button>
      </div>
    </div>
  );

  if (step===1) return (
    <div className="fade-in" style={{ maxWidth:480,margin:"40px auto",textAlign:"center" }}>
      <div style={{ width:68,height:68,borderRadius:"50%",background:"var(--surface2)",border:"2px solid var(--lime)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}>
        <div className="spinner"/>
      </div>
      <div style={{ fontFamily:"var(--font-head)",fontSize:22,fontWeight:700,marginBottom:8 }}>Processing ML Model</div>
      <div style={{ color:"var(--lime)",fontSize:13,marginBottom:24,fontFamily:"var(--font-mono)" }}>{STAGES[Math.min(stage,4)]}</div>
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13 }}>
          <span style={{ color:"var(--text2)" }}>CNF-ML-v2.4.1</span>
          <span style={{ color:"var(--lime)",fontFamily:"var(--font-mono)" }}>{prog}%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width:`${prog}%` }}/></div>
      </div>
      {STAGES.map((s,i)=>(
        <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"5px 0",fontSize:13,color:i<=stage?"var(--lime)":"var(--border)",transition:"color .3s" }}>
          <span>{i<=stage?"✓":"○"}</span><span>{s}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth:680 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
        <div style={{ width:36,height:36,borderRadius:"50%",background:"rgba(143,212,0,.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon name="check" size={18} color="var(--lime)"/>
        </div>
        <div>
          <div className="section-title" style={{ marginBottom:0 }}>Credits Generated!</div>
          <div style={{ fontSize:13,color:"var(--text2)" }}>Model CNF-ML-v2.4.1 · Verra VCS + Gold Standard</div>
        </div>
      </div>
      <div className="grid-3" style={{ marginBottom:20 }}>
        {[{label:"Credits",val:`${result.credits} tCO₂`,c:"var(--lime)"},{label:"CO₂ Offset",val:`${result.co2Offset}t`,c:"var(--cyan)"},{label:"Confidence",val:`${result.confidence}%`,c:"var(--amber)"}].map((s,i)=>(
          <div key={i} className="stat-card" style={{ textAlign:"center" }}>
            <div style={{ fontSize:13,color:"var(--text2)",marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"var(--font-head)",fontSize:28,fontWeight:800,color:s.c }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom:16 }}>
        <p style={{ fontWeight:600,marginBottom:12 }}>Credit Breakdown</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
          {[["Base Credits",result.breakdown.base,"var(--text2)"],["Crop Bonus",result.breakdown.cropBonus,"var(--lime)"],["Practice Bonus",result.breakdown.practiceBonus,"var(--cyan)"],["Regional Correction",result.breakdown.regionalCorr,"var(--amber)"]].map(([k,v,c])=>(
            <div key={k} style={{ background:"var(--surface2)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between" }}>
              <span style={{ fontSize:13,color:"var(--text2)" }}>{k}</span>
              <span style={{ fontWeight:600,color:c,fontFamily:"var(--font-mono)" }}>+{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12,padding:"10px 14px",background:"rgba(143,212,0,.05)",border:"1px solid rgba(143,212,0,.2)",borderRadius:8 }}>
          <p style={{ fontSize:13,color:"var(--text2)" }}>Market Value Estimate</p>
          <p style={{ fontFamily:"var(--font-mono)",fontSize:14,color:"var(--lime)",marginTop:4 }}>₹{result.marketValue.min.toLocaleString()} – ₹{result.marketValue.avg.toLocaleString()} – ₹{result.marketValue.max.toLocaleString()}</p>
        </div>
      </div>
      {!listed ? (
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:4 }}>List on Marketplace</p>
          <p style={{ fontSize:13,color:"var(--text2)",marginBottom:14 }}>Suggested price: ₹{Math.round(result.marketValue.avg/result.credits)}/credit</p>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            <input className="input" type="number" placeholder="Price per credit (₹)" value={price} onChange={e=>setPrice(e.target.value)} style={{ maxWidth:200 }}/>
            <button className="btn btn-lime" onClick={listCredits}><Icon name="shop" size={14}/>List Credits</button>
            <button className="btn btn-ghost" onClick={reset}>Start Over</button>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
          <div className="card" style={{ flex:1,background:"rgba(143,212,0,.05)",border:"1px solid rgba(143,212,0,.3)" }}>
            <p style={{ color:"var(--lime)",fontWeight:600 }}>✅ Listed on Marketplace!</p>
            <p style={{ fontSize:13,color:"var(--text2)",marginTop:4 }}>+50 reward points earned</p>
          </div>
          <button className="btn btn-ghost" onClick={reset}>Generate More</button>
        </div>
      )}
    </div>
  );
}

function FarmerListings({ user }) {
  const L=DB.listings.filter(l=>l.farmerId===user.id);
  return (
    <div className="fade-in">
      <div className="section-title">My Listings</div>
      <div className="section-sub">Active carbon credit listings on the marketplace</div>
      {L.length===0 ? (
        <div className="card" style={{ textAlign:"center",padding:48,color:"var(--text2)" }}>
          <Icon name="list" size={32} color="var(--border)"/>
          <p style={{ marginTop:12 }}>No listings yet. Generate credits first.</p>
        </div>
      ) : (
        <div style={{ display:"grid",gap:16 }}>
          {L.map(l=>(
            <div key={l.id} className="listing-card">
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
                <div>
                  <div style={{ fontWeight:600,marginBottom:6 }}>{l.cropType} Farm · {l.location}</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>{l.practices.map(p=><span key={p} className="tag">{p}</span>)}</div>
                  <div style={{ display:"flex",gap:10 }}>
                    <span className="badge badge-cyan">CO₂: {l.co2Offset}t</span>
                    <span className="badge badge-amber">Confidence: {l.confidence}%</span>
                    <span className={`badge ${l.verified?"badge-lime":"badge-amber"}`}>{l.verified?"✓ Verified":"⏳ Pending"}</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"var(--font-head)",fontSize:24,fontWeight:800,color:"var(--lime)" }}>{l.credits} tCO₂</div>
                  <div style={{ fontSize:13,color:"var(--text2)" }}>@ ₹{l.pricePerCredit}/credit</div>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:13,color:"var(--cyan)",marginTop:4 }}>Total: ₹{l.totalValue.toLocaleString()}</div>
                  <div style={{ fontSize:11,color:"var(--text2)",marginTop:6 }}>Listed {l.createdAt}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FarmerAnalytics({ user }) {
  const u=DB.users.find(x=>x.id===user.id)||user;
  const data=MONTHS.map((m,i)=>({month:m,credits:u.monthlyCredits[i]||0,revenue:u.monthlyRevenue[i]||0}));
  return (
    <div className="fade-in">
      <div className="section-title">Analytics</div>
      <div className="section-sub">Carbon credit production and revenue history</div>
      <div className="grid-2">
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Credits Generated (Monthly)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A1E"/>
              <XAxis dataKey="month" tick={tick}/><YAxis tick={tick}/>
              <Tooltip content={<Tip suf=" tCO₂"/>}/>
              <Bar dataKey="credits" name="Credits" fill="#8FD400" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Revenue (Monthly ₹)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00C8D8" stopOpacity={0.3}/><stop offset="95%" stopColor="#00C8D8" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A1E"/>
              <XAxis dataKey="month" tick={tick}/><YAxis tick={tick}/>
              <Tooltip content={<Tip pre="₹"/>}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00C8D8" fill="url(#rv)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── COMPANY DASHBOARD ─────────────────────── */
function CompanyDashboard({ user, setUser, showNotif }) {
  const [tab,setTab]=useState("overview");
  const tabs=[
  {id:"overview",label:"Overview",icon:"home"},
  {id:"marketplace",label:"Marketplace",icon:"shop"},
  {id:"portfolio",label:"Portfolio",icon:"chart"},
  {id:"blockchain",label:"Blockchain",icon:"chain"},
  {id:"rewards",label:"Rewards",icon:"star"} //  ADD THIS
];
  return (
    <div style={{ padding:24,maxWidth:1200,margin:"0 auto" }}>
      <div style={{ display:"flex",gap:4,marginBottom:28,background:"var(--surface)",borderRadius:12,padding:6,border:"1px solid var(--border)",width:"fit-content" }}>
        {tabs.map(t=><button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}><Icon name={t.icon} size={14}/>{t.label}</button>)}
      </div>
      {tab==="overview"    && <CompanyOverview    user={user}/>}
      {tab==="marketplace" && <CompanyMarketplace user={user} setUser={setUser} showNotif={showNotif}/>}
      {tab==="portfolio"   && <CompanyPortfolio   user={user}/>}
      {tab==="blockchain"  && <CompanyBlockchain  user={user}/>}
      {tab==="rewards"     && <CompanyRewards     user={user}/>}
    </div>
  );
}

function CompanyOverview({ user }) {
  const u=DB.users.find(x=>x.id===user.id)||user;
  const myTx=DB.transactions.filter(tx=>tx.buyerId===user.id);
  const spendData=MONTHS.map((m,i)=>({month:m,spend:u.monthlySpend[i]||0}));
  return (
    <div className="fade-in">
      <div className="section-title">Company Overview</div>
      <div className="section-sub">Track carbon offset procurement and blockchain-secured spend</div>
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          {label:"Total Purchased",val:`${u.totalPurchased||420} tCO₂`,icon:"download",color:"var(--lime)"},
          {label:"Total Spend",val:`₹${(u.totalSpend||210000).toLocaleString()}`,icon:"wallet",color:"var(--cyan)"},
          {label:"Transactions",val:`${myTx.length}`,icon:"chain",color:"var(--amber)"},
          {label:"Reward Points",val:`${u.points} pts`,icon:"star",color:"var(--amber)"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
              <span style={{ fontSize:13,color:"var(--text2)" }}>{s.label}</span>
              <Icon name={s.icon} size={18} color={s.color}/>
            </div>
            <div style={{ fontFamily:"var(--font-head)",fontSize:24,fontWeight:700,color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ marginBottom:24 }}>
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Monthly Spend (₹)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spendData}>
              <defs><linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00C8D8" stopOpacity={0.3}/><stop offset="95%" stopColor="#00C8D8" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A1E"/>
              <XAxis dataKey="month" tick={tick}/><YAxis tick={tick}/>
              <Tooltip content={<Tip pre="₹"/>}/>
              <Area type="monotone" dataKey="spend" name="Spend" stroke="#00C8D8" fill="url(#sp)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Market Overview</p>
          <div style={{ display:"grid",gap:10 }}>
            {[
              ["Available Listings",DB.listings.filter(l=>l.status==="active").length,"var(--lime)"],
              ["Verified Credits",DB.listings.filter(l=>l.verified&&l.status==="active").reduce((s,l)=>s+l.credits,0)+" tCO₂","var(--cyan)"],
              ["Avg Price/Credit","₹"+(DB.listings.reduce((s,l)=>s+l.pricePerCredit,0)/Math.max(DB.listings.length,1)).toFixed(1),"var(--amber)"],
              ["Total Available",DB.listings.filter(l=>l.status==="active").reduce((s,l)=>s+l.credits,0)+" tCO₂","var(--lime)"],
            ].map(([k,v,c])=>(
              <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"var(--surface2)",borderRadius:8 }}>
                <span style={{ fontSize:13,color:"var(--text2)" }}>{k}</span>
                <span style={{ fontWeight:600,color:c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <p style={{ fontWeight:600,marginBottom:16 }}>Recent Purchases</p>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead><tr style={{ borderBottom:"1px solid var(--border)" }}>{["Farmer","Credits","Total","Tx Hash","Date"].map(h=><th key={h} style={{ padding:"8px 12px",textAlign:"left",color:"var(--text2)",fontWeight:500 }}>{h}</th>)}</tr></thead>
            <tbody>
              {myTx.map(tx=>(
                <tr key={tx.id} style={{ borderBottom:"1px solid var(--border)" }}>
                  <td style={{ padding:"10px 12px" }}>{tx.farmerName}</td>
                  <td style={{ padding:"10px 12px",color:"var(--lime)" }}>{tx.credits} tCO₂</td>
                  <td style={{ padding:"10px 12px",color:"var(--cyan)" }}>₹{tx.total.toLocaleString()}</td>
                  <td style={{ padding:"10px 12px" }}><span className="tx-hash">{tx.txHash.slice(0,14)}…</span></td>
                  <td style={{ padding:"10px 12px",color:"var(--text2)" }}>{tx.timestamp.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompanyMarketplace({ user, setUser, showNotif }) {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const [sort,setSort]=useState("price_asc");
  const [buying,setBuying]=useState(null);
  const [bcStep,setBcStep]=useState(0);
  const BC=["Initiating blockchain transaction…","Broadcasting to network…","Awaiting miner confirmation…","✅ Transaction confirmed!"];

  let L=DB.listings.filter(l=>l.status==="active"&&l.farmerId!==user.id);
  if (search) L=L.filter(l=>l.farmerName.toLowerCase().includes(search.toLowerCase())||l.cropType.toLowerCase().includes(search.toLowerCase())||l.location.toLowerCase().includes(search.toLowerCase()));
  if (filter==="verified") L=L.filter(l=>l.verified);
  L.sort((a,b)=>sort==="price_asc"?a.pricePerCredit-b.pricePerCredit:sort==="price_desc"?b.pricePerCredit-a.pricePerCredit:b.credits-a.credits);

const buy = async (listing) => {
  setBuying(listing.id); setBcStep(0);
  for(let i=0;i<4;i++){ await new Promise(r=>setTimeout(r,700)); setBcStep(i); }
  const tx={id:genId(),buyerId:user.id,sellerId:listing.farmerId,listingId:listing.id,credits:listing.credits,pricePerCredit:listing.pricePerCredit,total:listing.totalValue,txHash:genHash(),blockNumber:genBlock(),gasUsed:21000,network:"carbonex-mainnet-1",timestamp:new Date().toISOString(),status:"confirmed",farmerName:listing.farmerName,buyerName:user.name};
  DB.transactions.push(tx);
  const li=DB.listings.find(l=>l.id===listing.id); if(li) li.status="sold";
  const buyer=DB.users.find(x=>x.id===user.id);
  const rewardPoints = Math.floor(listing.totalValue / 10);
  buyer.points = (buyer.points || 0) + rewardPoints;
  buyer.totalPurchased=(buyer.totalPurchased||0)+listing.credits;
  buyer.totalSpend=(buyer.totalSpend||0)+listing.totalValue;
  const seller=DB.users.find(x=>x.id===listing.farmerId); 
  if(seller){seller.points=(seller.points||0)+100;seller.revenue=(seller.revenue||0)+listing.totalValue;seller.totalSold=(seller.totalSold||0)+listing.credits;}
  setUser({...user,points:(user.points||0)+rewardPoints,totalPurchased:(user.totalPurchased||0)+listing.credits});
  setBuying(null);
  showNotif(`✅ ${listing.credits} tCO₂ purchased! Hash: ${tx.txHash.slice(0,12)}… +50 pts earned.`);
};
  return (
    <div className="fade-in">
      <div className="section-title">Marketplace</div>
      <div className="section-sub">Browse and purchase verified carbon credits via blockchain</div>
      <div style={{ display:"flex",gap:12,marginBottom:24,flexWrap:"wrap" }}>
        <input className="input" placeholder="Search by farmer, crop, location…" value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1,minWidth:200 }}/>
        <select className="input" value={filter} onChange={e=>setFilter(e.target.value)} style={{ width:"auto" }}>
          <option value="all">All Listings</option>
          <option value="verified">Verified Only</option>
        </select>
        <select className="input" value={sort} onChange={e=>setSort(e.target.value)} style={{ width:"auto" }}>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="credits_desc">Most Credits</option>
        </select>
      </div>
      {L.length===0 ? (
        <div className="card" style={{ textAlign:"center",padding:48,color:"var(--text2)" }}>No listings found.</div>
      ) : (
        <div style={{ display:"grid",gap:16 }}>
          {L.map(l=>(
            <div key={l.id} className="listing-card">
              {buying===l.id ? (
                <div style={{ textAlign:"center",padding:"20px 0" }}>
                  <div className="spinner" style={{ margin:"0 auto 16px" }}/>
                  <div style={{ color:"var(--cyan)",fontFamily:"var(--font-mono)",fontSize:13 }}>{BC[Math.min(bcStep,3)]}</div>
                  <div className="progress-bar" style={{ marginTop:12 }}><div className="progress-fill" style={{ width:`${(bcStep+1)*25}%` }}/></div>
                </div>
              ) : (
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
                      <span style={{ fontWeight:600 }}>{l.farmerName}</span>
                      {l.verified&&<span className="badge badge-lime" style={{ fontSize:11 }}>✓ Verified</span>}
                    </div>
                    <div style={{ fontSize:13,color:"var(--text2)",marginBottom:8 }}>{l.cropType} · {l.location}</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>{l.practices.map(p=><span key={p} className="tag">{p}</span>)}</div>
                    <div style={{ display:"flex",gap:10 }}>
                      <span className="badge badge-cyan">CO₂: {l.co2Offset}t</span>
                      <span className="badge badge-amber">Conf: {l.confidence}%</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right",minWidth:160 }}>
                    <div style={{ fontFamily:"var(--font-head)",fontSize:26,fontWeight:800,color:"var(--lime)" }}>{l.credits} tCO₂</div>
                    <div style={{ fontSize:13,color:"var(--text2)",marginBottom:2 }}>₹{l.pricePerCredit} / credit</div>
                    <div style={{ fontFamily:"var(--font-mono)",color:"var(--cyan)",fontSize:14,fontWeight:600,marginBottom:12 }}>₹{l.totalValue.toLocaleString()}</div>
                    <button className="btn btn-lime btn-sm" onClick={()=>buy(l)} disabled={!!buying}>
                      <Icon name="lock" size={13}/>Buy via Blockchain
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

  

function CompanyPortfolio({ user }) {
  const myTx=DB.transactions.filter(tx=>tx.buyerId===user.id);
  const byFarmer={};
  myTx.forEach(tx=>{byFarmer[tx.farmerName]=(byFarmer[tx.farmerName]||0)+tx.credits;});
  const pieData=Object.entries(byFarmer).map(([name,value])=>({name,value}));
  const total=myTx.reduce((s,tx)=>s+tx.credits,0);
  return (
    <div className="fade-in">
      <div className="section-title">Carbon Portfolio</div>
      <div className="section-sub">Your carbon offset holdings and purchase history</div>
      <div className="grid-2" style={{ marginBottom:24 }}>
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Credits by Source</p>
          {pieData.length>0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" label={({name,percent})=>`${(percent*100).toFixed(0)}%`}>
                  {pieData.map((entry,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip content={<Tip suf=" tCO₂"/>}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:220,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)" }}>No purchases yet</div>
          )}
        </div>
        <div className="card">
          <p style={{ fontWeight:600,marginBottom:16 }}>Portfolio Summary</p>
          <div style={{ display:"grid",gap:10 }}>
            {[
              ["Total CO₂ Offset",`${total} tCO₂`,"var(--lime)"],
              ["Total Invested",`₹${myTx.reduce((s,tx)=>s+tx.total,0).toLocaleString()}`,"var(--cyan)"],
              ["Transactions",`${myTx.length}`,"var(--amber)"],
              ["Avg Price",myTx.length?`₹${(myTx.reduce((s,tx)=>s+tx.pricePerCredit,0)/myTx.length).toFixed(1)}/credit`:"—","var(--lime)"],
            ].map(([k,v,c])=>(
              <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"var(--surface2)",borderRadius:8 }}>
                <span style={{ fontSize:13,color:"var(--text2)" }}>{k}</span>
                <span style={{ fontWeight:600,color:c,fontFamily:"var(--font-mono)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <p style={{ fontWeight:600,marginBottom:16 }}>Purchase History</p>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead><tr style={{ borderBottom:"1px solid var(--border)" }}>{["Date","Farmer","Credits","Price","Total","Tx Hash"].map(h=><th key={h} style={{ padding:"8px 12px",textAlign:"left",color:"var(--text2)",fontWeight:500 }}>{h}</th>)}</tr></thead>
            <tbody>
              {myTx.map(tx=>(
                <tr key={tx.id} style={{ borderBottom:"1px solid var(--border)" }}>
                  <td style={{ padding:"10px 12px",color:"var(--text2)" }}>{tx.timestamp.split("T")[0]}</td>
                  <td style={{ padding:"10px 12px" }}>{tx.farmerName}</td>
                  <td style={{ padding:"10px 12px",color:"var(--lime)" }}>{tx.credits} tCO₂</td>
                  <td style={{ padding:"10px 12px" }}>₹{tx.pricePerCredit}</td>
                  <td style={{ padding:"10px 12px",color:"var(--cyan)" }}>₹{tx.total.toLocaleString()}</td>
                  <td style={{ padding:"10px 12px" }}><span className="tx-hash">{tx.txHash.slice(0,14)}…</span></td>
                </tr>
              ))}
              {myTx.length===0&&<tr><td colSpan={6} style={{ padding:"20px 12px",textAlign:"center",color:"var(--text2)" }}>No purchases yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function CompanyRewards({ user }) {
  const u = DB.users.find(x => x.id === user.id) || user;

  const rewards = [
    { title: "Green Starter", points: 100, unlocked: u.points >= 100 },
    { title: "Carbon Neutral", points: 300, unlocked: u.points >= 300 },
    { title: "Climate Champion", points: 600, unlocked: u.points >= 600 },
    { title: "Net Zero Leader", points: 1000, unlocked: u.points >= 1000 },
  ];

  return (
    <div className="fade-in">
      <div className="section-title">Rewards & Achievements</div>
      <div className="section-sub">Earn points by purchasing carbon credits</div>

      {/* Points Card */}
      <div className="card" style={{ marginBottom:20 }}>
        <p style={{ color:"var(--text2)", fontSize:13 }}>Total Points</p>
        <h2 style={{ color:"var(--amber)" }}>{u.points} pts</h2>

        <div className="progress-bar" style={{ marginTop:10 }}>
          <div
            className="progress-fill"
            style={{ width: `${Math.min((u.points / 1000) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Rewards Levels */}
      <div className="grid-2">
        {rewards.map((r, i) => (
          <div key={i} className="card">
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span>{r.title}</span>
              <span className={`badge ${r.unlocked ? "badge-lime" : "badge-amber"}`}>
                {r.unlocked ? "Unlocked" : `${r.points} pts`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="card" style={{ marginTop:20 }}>
        <p style={{ fontWeight:600, marginBottom:10 }}>Benefits</p>
        <ul style={{ fontSize:13, color:"var(--text2)" }}>
          <li>🌱 Discount on purchases</li>
          <li>📊 ESG score boost</li>
          <li>🏆 Leaderboard ranking</li>
          <li>🔗 Blockchain badge</li>
        </ul>
      </div>
    </div>
  );
}
function CompanyBlockchain({ user }) {
  const myTx=DB.transactions.filter(tx=>tx.buyerId===user.id);
  return (
    <div className="fade-in">
      <div className="section-title">Blockchain Transactions</div>
      <div className="section-sub">Immutable on-chain records · carbonex-mainnet-1</div>
      {myTx.length===0 ? (
        <div className="card" style={{ textAlign:"center",padding:48,color:"var(--text2)" }}>
          <Icon name="chain" size={32} color="var(--border)"/>
          <p style={{ marginTop:12 }}>No transactions yet. Buy credits to see blockchain records.</p>
        </div>
      ) : (
        <div style={{ display:"grid",gap:16 }}>
          {myTx.map(tx=>(
            <div key={tx.id} className="tx-card">
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:"var(--lime)",boxShadow:"0 0 8px var(--lime)" }}/>
                  <span style={{ color:"var(--lime)",fontWeight:700,letterSpacing:1 }}>CONFIRMED</span>
                </div>
                <span className="badge badge-lime">Block #{tx.blockNumber.toLocaleString()}</span>
              </div>
              {[["Hash",tx.txHash],["Network",tx.network],["From (buyer)",tx.buyerName],["To (farmer)",tx.farmerName],["Credits",`${tx.credits} tCO₂ @ ₹${tx.pricePerCredit}/credit`],["Value",`₹${tx.total.toLocaleString()}`],["Gas Used",`${tx.gasUsed.toLocaleString()} wei`],["Timestamp",tx.timestamp.replace("T"," ").replace("Z","")]].map(([k,v])=>(
                <div key={k} className="tx-row">
                  <span className="tx-label">{k}</span>
                  <span className="tx-val">{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── BLOCKCHAIN EXPLORER ───────────────────── */
function BlockchainExplorer() {
  const [search,setSearch]=useState("");
  const all=DB.transactions;
  const filtered=search?all.filter(tx=>tx.txHash.includes(search)||tx.farmerName.toLowerCase().includes(search.toLowerCase())||tx.buyerName.toLowerCase().includes(search.toLowerCase())):all;
  return (
    <div style={{ padding:24,maxWidth:1200,margin:"0 auto" }}>
      <div className="section-title fade-in">⛓ Blockchain Explorer</div>
      <div className="section-sub fade-in">All verified carbon credit transactions on carbonex-mainnet-1</div>
      <div style={{ display:"flex",gap:12,marginBottom:24 }}>
        <input className="input" placeholder="Search by hash, farmer, or buyer…" value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1 }}/>
      </div>
      <div className="grid-3" style={{ marginBottom:24 }}>
        {[
          {label:"Total Transactions",val:all.length},
          {label:"Total CO₂ Traded",  val:`${all.reduce((s,t)=>s+t.credits,0)} tCO₂`},
          {label:"Total Value",       val:`₹${all.reduce((s,t)=>s+t.total,0).toLocaleString()}`},
        ].map((s,i)=>(
          <div key={i} className="stat-card" style={{ textAlign:"center" }}>
            <div style={{ fontSize:13,color:"var(--text2)",marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"var(--font-head)",fontSize:26,fontWeight:800,color:"var(--lime)" }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gap:16 }}>
        {filtered.map(tx=>(
          <div key={tx.id} className="tx-card fade-in">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:"var(--lime)",boxShadow:"0 0 8px var(--lime)" }}/>
                <span style={{ color:"var(--lime)",fontWeight:700,letterSpacing:1 }}>CONFIRMED</span>
              </div>
              <span className="badge badge-lime">#{tx.blockNumber.toLocaleString()}</span>
            </div>
            {[["Tx Hash",tx.txHash],["Network",tx.network],["Buyer",tx.buyerName],["Seller",tx.farmerName],["Credits",`${tx.credits} tCO₂`],["Value",`₹${tx.total.toLocaleString()} @ ₹${tx.pricePerCredit}/credit`],["Gas",`${tx.gasUsed} wei`],["Time",tx.timestamp.replace("T"," ").replace("Z","")]].map(([k,v])=>(
              <div key={k} className="tx-row">
                <span className="tx-label">{k}</span>
                <span className="tx-val">{v}</span>
              </div>
            ))}
          </div>
        ))}
        {filtered.length===0&&<div className="card" style={{ textAlign:"center",padding:40,color:"var(--text2)" }}>No transactions found.</div>}
      </div>
    </div>
  );
}

/* ─── APP ROOT ──────────────────────────────── */
export default function App() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [notif,setNotif]=useState(null);
  const showNotif=useCallback((msg,type="success")=>setNotif({msg,type,id:Date.now()}),[]);
  const syncUser = u => {
    setUser(u);
    const i=DB.users.findIndex(x=>x.id===u.id);
    if(i>=0) DB.users[i]={...DB.users[i],...u};
  };
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {!user ? (
        <AuthPage onLogin={u=>{setUser(u);setPage("dashboard");}}/>
      ) : (
        <div style={{ minHeight:"100vh" }}>
          <Navbar user={user} page={page} setPage={setPage} onLogout={()=>{setUser(null);setPage("dashboard");}}/>
          {page==="dashboard"&&user.role==="farmer"&&<FarmerDashboard  user={user} setUser={syncUser} showNotif={showNotif}/>}
          {page==="dashboard"&&user.role==="company"&&<CompanyDashboard user={user} setUser={syncUser} showNotif={showNotif}/>}
          {page==="explorer"&&<BlockchainExplorer/>}
        </div>
      )}
      {notif&&<Notification key={notif.id} msg={notif.msg} type={notif.type} onClose={()=>setNotif(null)}/>}
    </>
  );
}

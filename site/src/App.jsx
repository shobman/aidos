import { useState } from "react";

const ARTIFACTS = ["Problem", "Solution", "Tech Design", "Testing"];
const LENSES = ["Product", "Analysis", "Architecture", "Quality"];
const GRID = "72px repeat(4, 1fr)";

const NAMES = {
  "Problem-Epic": "Problem", "Problem-Feature": "Problem", "Problem-Story": "Context",
  "Solution-Epic": "Solution", "Solution-Feature": "Solution", "Solution-Story": "User Story",
  "Tech Design-Epic": "Tech Design", "Tech Design-Feature": "Tech Design", "Tech Design-Story": "Technical Approach",
  "Testing-Epic": "Test Strategy", "Testing-Feature": "Test Plan", "Testing-Story": "Acceptance Criteria",
};
const DEPTHS = {
  "Problem-Epic": "Full depth", "Problem-Feature": "Focused", "Problem-Story": "A few sentences",
  "Solution-Epic": "System-level", "Solution-Feature": "Feature-scope", "Solution-Story": "As a / I want / So that",
  "Tech Design-Epic": "Architecture", "Tech Design-Feature": "Implementation brief", "Tech Design-Story": "Guardrails",
  "Testing-Epic": "Approach & priorities", "Testing-Feature": "Full scenarios", "Testing-Story": "What done looks like",
};

const DOCS = {
  "epic-Problem": { label: "Problem", cells: [["Problem", "Epic"]] },
  "epic-Solution": { label: "Solution", cells: [["Solution", "Epic"]] },
  "epic-Tech Design": { label: "Tech Design", cells: [["Tech Design", "Epic"]] },
  "epic-Testing": { label: "Test Strategy", cells: [["Testing", "Epic"]] },
  "feature-combined": { label: "Feature Document", cells: [["Problem", "Feature"], ["Solution", "Feature"], ["Tech Design", "Feature"]] },
  "feature-testing": { label: "Test Plan", cells: [["Testing", "Feature"]] },
  "story-all": { label: "Story Document", cells: [["Problem", "Story"], ["Solution", "Story"], ["Tech Design", "Story"], ["Testing", "Story"]] },
};

function docGroupId(a, s) {
  if (s === "Epic") return `epic-${a}`;
  if (s === "Feature") return a === "Testing" ? "feature-testing" : "feature-combined";
  return "story-all";
}

function getAuditTargets(a, s) {
  const t = { rubrics: ["Core", a], cells: [] };
  const ai = ARTIFACTS.indexOf(a), si = ["Epic", "Feature", "Story"].indexOf(s);
  if (si > 0) t.cells.push({ artifact: a, scale: ["Epic", "Feature", "Story"][si - 1], relation: "parent" });
  if (a === "Testing") { t.cells.push({ artifact: "Tech Design", scale: s, relation: "preceding" }); t.cells.push({ artifact: "Solution", scale: s, relation: "preceding" }); }
  else if (ai > 0) t.cells.push({ artifact: ARTIFACTS[ai - 1], scale: s, relation: "preceding" });
  return t;
}

function getRubricGoverns(r) {
  if (r === "Core") return ["Epic", "Feature", "Story"].flatMap(s => ARTIFACTS.map(a => ({ artifact: a, scale: s })));
  return ["Epic", "Feature", "Story"].map(s => ({ artifact: r, scale: s }));
}

function Cell({ artifact, scale, state, onClick }) {
  const k = `${artifact}-${scale}`;
  const styles = {
    selected: { border: "#8cb89390", bg: "#4A635030", name: "#8cb893", shadow: "0 0 20px #4A635020" },
    parent: { border: "#6b8f7270", bg: "#4A635018", name: "#6b8f72", badge: "\u2191 parent" },
    preceding: { border: "#6b8f7270", bg: "#4A635018", name: "#6b8f72", badge: "\u2190 preceding" },
    "governed-core": { border: "#c8a96e50", bg: "#c8a96e08", name: "#c8a96e" },
    governed: { border: "#8cb89350", bg: "#4A635012", name: "#6b8f72" },
    "doc-contents": { border: "#8cb89370", bg: "#4A635020", name: "#8cb893" },
  };
  const s = styles[state] || { border: "transparent", bg: "#222822", name: "#e8e6e1" };

  return (
    <button onClick={onClick} style={{
      width: "100%", height: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 6,
      border: `1.5px solid ${s.border}`, background: s.bg,
      cursor: "pointer", transition: "all 0.25s", outline: "none",
      fontFamily: "inherit", boxShadow: s.shadow || "none", position: "relative",
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: s.name, marginBottom: 2, transition: "color 0.25s" }}>{NAMES[k]}</div>
      <div style={{ fontSize: 11, color: "#908c84" }}>{DEPTHS[k]}</div>
      {s.badge && <div style={{ position: "absolute", top: 4, right: 8, fontSize: 9, color: "#6b8f72", fontStyle: "italic" }}>{s.badge}</div>}
    </button>
  );
}

function DocWrap({ label, active, children, onClick }) {
  return (
    <fieldset onClick={e => { if (e.target === e.currentTarget || e.target.tagName === "LEGEND") onClick(); }}
      style={{ border: `1.5px dashed ${active ? "#8cb89360" : "#4a5a4e70"}`, borderRadius: 8, padding: "14px 10px 10px", margin: 0, transition: "border-color 0.3s", cursor: "pointer" }}>
      <legend onClick={e => { e.stopPropagation(); onClick(); }}
        style={{ fontSize: 10, color: active ? "#8cb893cc" : "#908c8490", fontStyle: "italic", padding: "0 6px", marginLeft: 8, cursor: "pointer", transition: "color 0.3s" }}>
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

export default function App() {
  const [sel, setSel] = useState(null);
  const [selRubric, setSelRubric] = useState(null);
  const [selDoc, setSelDoc] = useState(null);

  const targets = sel ? getAuditTargets(sel.artifact, sel.scale) : null;
  const governed = selRubric ? getRubricGoverns(selRubric) : null;
  const docCells = selDoc ? DOCS[selDoc]?.cells : null;

  const isRH = r => { if (selRubric) return r === selRubric; return targets?.rubrics.includes(r); };
  const cTarget = (a, s) => targets?.cells.find(c => c.artifact === a && c.scale === s) || null;
  const isCG = (a, s) => governed?.some(g => g.artifact === a && g.scale === s);
  const isDC = (a, s) => docCells?.some(([ca, cs]) => ca === a && cs === s);
  const isDA = id => { if (selDoc === id) return true; if (sel) return docGroupId(sel.artifact, sel.scale) === id; return false; };

  const hCell = (a, s) => { setSelRubric(null); setSelDoc(null); if (sel?.artifact === a && sel?.scale === s) setSel(null); else setSel({ artifact: a, scale: s }); };
  const hRub = r => { setSel(null); setSelDoc(null); if (selRubric === r) setSelRubric(null); else setSelRubric(r); };
  const hDoc = id => { setSel(null); setSelRubric(null); if (selDoc === id) setSelDoc(null); else setSelDoc(id); };

  const cState = (a, s) => {
    if (sel) { if (sel.artifact === a && sel.scale === s) return "selected"; const ct = cTarget(a, s); if (ct) return ct.relation; }
    if (selRubric) { if (isCG(a, s)) return selRubric === "Core" ? "governed-core" : "governed"; }
    if (docCells && isDC(a, s)) return "doc-contents";
    return null;
  };

  const gold = "#c8a96e", green = "#8cb893", gd = "#6b8f72", muted = "#908c84", card = "#222822", border = "#4a5a4e";

  let summary = null;
  if (sel && targets) {
    const parts = [{ text: "Core Rubric", color: gold }, { text: `${sel.artifact} Rubric`, color: green },
      ...targets.cells.map(c => ({ text: `${NAMES[`${c.artifact}-${c.scale}`]} (${c.relation === "parent" ? `${c.scale} parent` : "preceding"})`, color: gd }))];
    summary = { type: "audit", label: NAMES[`${sel.artifact}-${sel.scale}`], scale: sel.scale, parts };
  } else if (selRubric) {
    summary = { type: "rubric", rubric: selRubric, scope: selRubric === "Core" ? "all artifacts at every scale" : `all ${selRubric} artifacts across Epic, Feature, and Story`, count: governed.length };
  } else if (selDoc && DOCS[selDoc]) {
    summary = { type: "doc", label: DOCS[selDoc].label, contents: DOCS[selDoc].cells.map(([a, s]) => NAMES[`${a}-${s}`]) };
  }

  const footerDocs = [
    { label: "Repository", href: "https://github.com/shobman/aidos" },
    { label: "Framework", href: "https://github.com/shobman/aidos/blob/main/src/framework.md" },
    { label: "Rubrics", href: "https://github.com/shobman/aidos/tree/main/src/rubrics" },
    { label: "Prompts", href: "https://github.com/shobman/aidos/tree/main/src/prompts" },
    { label: "Manifesto", href: "https://github.com/shobman/aidos/blob/main/docs/manifesto.md" },
  ];
  const footerTemplates = [
    { label: "Problem", href: "https://github.com/shobman/aidos/blob/main/src/templates/problem.md" },
    { label: "Solution", href: "https://github.com/shobman/aidos/blob/main/src/templates/solution.md" },
    { label: "Tech Design", href: "https://github.com/shobman/aidos/blob/main/src/templates/tech-design.md" },
    { label: "Testing", href: "https://github.com/shobman/aidos/blob/main/src/templates/testing.md" },
    { label: "Issues Log", href: "https://github.com/shobman/aidos/blob/main/src/templates/issues-log.md" },
    { label: "Overflow Log", href: "https://github.com/shobman/aidos/blob/main/src/templates/overflow-log.md" },
    { label: "Meeting Minutes", href: "https://github.com/shobman/aidos/blob/main/src/templates/meeting-minutes.md" },
    { label: "Retrospective", href: "https://github.com/shobman/aidos/blob/main/src/templates/retrospective.md" },
  ];

  const base = import.meta.env.BASE_URL;

  return (
    <div style={{ minHeight: "100vh", background: "#1a1f1c", color: "#e8e6e1", fontFamily: "'Source Sans 3', sans-serif", position: "relative" }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url(${base}aidos.jpg)`,
        backgroundSize: "80%", backgroundPosition: "center top", backgroundRepeat: "no-repeat",
        opacity: 0.15, pointerEvents: "none",
        maskImage: "linear-gradient(to right, transparent 5%, black 20%, black 82%, transparent 88%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 5%, black 20%, black 82%, transparent 88%)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${border}`, background: "linear-gradient(180deg, #1e2420, #1a1f1c)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 20px", display: "flex", alignItems: "center", gap: 18 }}>
          <img src={`${base}aidos.jpg`} alt="Aidos" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", objectPosition: "center 20%", opacity: 0.85, flexShrink: 0 }} />
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 26, fontWeight: 700, letterSpacing: "0.12em", fontVariant: "small-caps", margin: 0 }}>aidos</h1>
              <span style={{ fontSize: 13, color: muted }}>AI Delivery Operating System</span>
            </div>
            <p style={{ fontSize: 14, color: "#b0aca4", margin: 0, lineHeight: 1.5, maxWidth: 600 }}>
              An AI-era delivery assurance framework. Think clearly, decide well, audit before you build.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 48px" }}>
        <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 16 }}>
          Framework Explorer
        </div>

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, marginBottom: 6 }}>
          <div></div>
          {ARTIFACTS.map((a, i) => (
            <div key={a} style={{ paddingLeft: 2 }}>
              <div style={{ fontSize: 13, fontFamily: "'Merriweather', Georgia, serif", fontWeight: 700, color: (sel?.artifact === a || selRubric === a) ? green : selRubric === "Core" ? green : "#d0cec8", transition: "color 0.2s" }}>{a}</div>
              <div style={{ fontSize: 11, color: muted, fontFamily: "'Source Sans 3', sans-serif", fontWeight: 400, marginTop: 1 }}>{LENSES[i]} lens</div>
            </div>
          ))}
        </div>

        {/* Core Rubric */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#b0aca4", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Rubrics</span>
          </div>
          <div style={{ gridColumn: "2 / 6" }}>
            <button onClick={() => hRub("Core")} style={{
              width: "100%", padding: "10px 16px", borderRadius: 7, textAlign: "center",
              border: `1.5px solid ${isRH("Core") ? gold + "80" : border}`,
              background: isRH("Core") ? gold + "10" : card,
              transition: "all 0.3s", cursor: "pointer", outline: "none", fontFamily: "inherit",
            }}>
              <div style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 13, fontWeight: 700, color: isRH("Core") ? gold : "#c0beb8", transition: "color 0.3s" }}>Core Rubric</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>Applied to every artifact</div>
            </button>
          </div>
        </div>

        {/* Discipline Rubrics */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, marginBottom: 24 }}>
          <div></div>
          {ARTIFACTS.map(a => {
            const h = isRH(a);
            return (
              <button key={a} onClick={() => hRub(a)} style={{
                padding: "10px 12px", borderRadius: 7, textAlign: "left",
                border: `1.5px solid ${h ? green + "80" : border}`,
                background: h ? "#4A635020" : card,
                transition: "all 0.3s", cursor: "pointer", outline: "none", fontFamily: "inherit",
              }}>
                <div style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 12, fontWeight: 700, color: h ? green : "#c0beb8", transition: "color 0.3s" }}>{a} Rubric</div>
              </button>
            );
          })}
        </div>

        {/* Epic */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 13, fontWeight: 700, color: sel?.scale === "Epic" ? green : "#c0beb8", transition: "color 0.2s" }}>Epic</span>
          </div>
          {ARTIFACTS.map(a => (
            <DocWrap key={a} label={a === "Testing" ? "Test Strategy" : a} active={isDA(`epic-${a}`)} onClick={() => hDoc(`epic-${a}`)}>
              <Cell artifact={a} scale="Epic" state={cState(a, "Epic")} onClick={() => hCell(a, "Epic")} />
            </DocWrap>
          ))}
        </div>

        {/* Feature */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 13, fontWeight: 700, color: sel?.scale === "Feature" ? green : "#c0beb8", transition: "color 0.2s" }}>Feature</span>
          </div>
          <div style={{ gridColumn: "2 / 5" }}>
            <DocWrap label="Feature Document ×N" active={isDA("feature-combined")} onClick={() => hDoc("feature-combined")}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {["Problem", "Solution", "Tech Design"].map(a => <Cell key={a} artifact={a} scale="Feature" state={cState(a, "Feature")} onClick={() => hCell(a, "Feature")} />)}
              </div>
            </DocWrap>
          </div>
          <DocWrap label="Test Plan ×N" active={isDA("feature-testing")} onClick={() => hDoc("feature-testing")}>
            <Cell artifact="Testing" scale="Feature" state={cState("Testing", "Feature")} onClick={() => hCell("Testing", "Feature")} />
          </DocWrap>
        </div>

        {/* Story */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 13, fontWeight: 700, color: sel?.scale === "Story" ? green : "#c0beb8", transition: "color 0.2s" }}>Story</span>
          </div>
          <div style={{ gridColumn: "2 / 6" }}>
            <DocWrap label="Story Document ×N" active={isDA("story-all")} onClick={() => hDoc("story-all")}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {ARTIFACTS.map(a => <Cell key={a} artifact={a} scale="Story" state={cState(a, "Story")} onClick={() => hCell(a, "Story")} />)}
              </div>
            </DocWrap>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#4A635012", border: `1px solid ${border}` }}>
            {summary.type === "audit" && (
              <>
                <div style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 15, fontWeight: 700, color: green, marginBottom: 6 }}>
                  {summary.label}<span style={{ fontSize: 12, color: muted, fontWeight: 400, fontFamily: "'Source Sans 3', sans-serif", marginLeft: 10 }}>{summary.scale} scale</span>
                </div>
                <div style={{ fontSize: 13, color: "#b0aca4", lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 600, color: "#e8e6e1" }}>Audited against: </span>
                  {summary.parts.map((p, i) => <span key={i}>{i > 0 && " + "}<span style={{ color: p.color }}>{p.text}</span></span>)}
                </div>
              </>
            )}
            {summary.type === "rubric" && (
              <>
                <div style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 15, fontWeight: 700, color: summary.rubric === "Core" ? gold : green, marginBottom: 6 }}>{summary.rubric} Rubric</div>
                <div style={{ fontSize: 13, color: "#b0aca4", lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 600, color: "#e8e6e1" }}>Governs: </span>{summary.scope}<span style={{ color: muted }}> — {summary.count} artifacts</span>
                </div>
              </>
            )}
            {summary.type === "doc" && (
              <>
                <div style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: 15, fontWeight: 700, color: green, marginBottom: 6 }}>{summary.label}</div>
                <div style={{ fontSize: 13, color: "#b0aca4", lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 600, color: "#e8e6e1" }}>Contains: </span>
                  {summary.contents.map((c, i) => <span key={i}>{i > 0 && ", "}<span style={{ color: green }}>{c}</span></span>)}
                </div>
              </>
            )}
          </div>
        )}

        {!summary && (
          <div style={{ marginTop: 20, textAlign: "center", padding: "24px 20px", borderRadius: 8, border: `1px dashed ${border}` }}>
            <p style={{ fontSize: 13, color: muted, margin: 0 }}>Select an artifact to see its audit chain, a rubric to see what it governs, or a document to see its contents.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 24px" }}>
          {/* Doc links */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 8 }}>
              Docs
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {footerDocs.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "#b0aca4", textDecoration: "none", borderBottom: "1px solid #4a5a4e60", paddingBottom: 1, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.color = "#e8e6e1"; e.target.style.borderColor = "#8cb893"; }}
                  onMouseLeave={e => { e.target.style.color = "#b0aca4"; e.target.style.borderColor = "#4a5a4e60"; }}
                >{link.label}</a>
              ))}
            </div>
          </div>
          {/* Template links */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 8 }}>
              Templates
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {footerTemplates.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "#b0aca4", textDecoration: "none", borderBottom: "1px solid #4a5a4e60", paddingBottom: 1, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.color = "#e8e6e1"; e.target.style.borderColor = "#8cb893"; }}
                  onMouseLeave={e => { e.target.style.color = "#b0aca4"; e.target.style.borderColor = "#4a5a4e60"; }}
                >{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

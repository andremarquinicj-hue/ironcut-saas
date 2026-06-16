import { useState, useMemo } from "react";
import exerciciosDB from "./exercicios-ironcut.json";

/**
 * ExercicioImagem
 * Mostra a imagem de execução de um exercício, com toggle entre
 * posição inicial (0) e final (1). Fonte: Free Exercise DB (domínio público).
 *
 * Uso:
 *   <ExercicioImagem nome="Puxada Frente (Pulldown)" />
 *   <ExercicioImagem nome="Supino Reto" />   // casa por aproximação
 */

// Achata o JSON agrupado em um índice { nomeNormalizado: exercicio }
function normalizar(txt) {
  return (txt || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9 ]/g, " ")      // remove pontuação
    .replace(/\s+/g, " ")
    .trim();
}

const INDICE = (() => {
  const idx = {};
  Object.values(exerciciosDB).forEach((grupo) => {
    grupo.forEach((ex) => {
      idx[normalizar(ex.nome)] = ex;
    });
  });
  return idx;
})();

function buscarExercicio(nome) {
  const n = normalizar(nome);
  // 1) match exato
  if (INDICE[n]) return INDICE[n];
  // 2) match por aproximação: a chave contém o nome buscado ou vice-versa
  const chaves = Object.keys(INDICE);
  const aproximado = chaves.find((k) => k.includes(n) || n.includes(k));
  return aproximado ? INDICE[aproximado] : null;
}

export default function ExercicioImagem({ nome, className = "", compact = false }) {
  const [fase, setFase] = useState(0); // 0 = início, 1 = final
  const [aberto, setAberto] = useState(false);
  const ex = useMemo(() => buscarExercicio(nome), [nome]);

  // Sem imagem mapeada
  if (!ex || !ex.imagens?.length) {
    // No modo compact, simplesmente não renderiza nada (não polui a lista)
    if (compact) return null;
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 120,
          background: "#0c1b1b",
          border: "1px solid #163230",
          borderRadius: 12,
          color: "#8fb5b0",
          fontSize: 13,
          textAlign: "center",
          padding: 12,
        }}
      >
        Imagem em breve
      </div>
    );
  }

  const temDuasC = ex.imagens.length > 1;
  const srcC = ex.imagens[temDuasC ? fase : 0];

  // ── MODO COMPACT: miniatura na lista, abre modal ao tocar ──
  if (compact) {
    return (
      <>
        <img
          src={srcC}
          alt={ex.nome}
          loading="lazy"
          onClick={(e) => {
            e.stopPropagation();
            setAberto(true);
          }}
          className={className}
          style={{
            width: 46,
            height: 46,
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #163230",
            background: "#fff",
            cursor: "pointer",
            flexShrink: 0,
          }}
        />
        {aberto && (
          <ModalExecucao
            ex={ex}
            fase={fase}
            setFase={setFase}
            fechar={() => setAberto(false)}
          />
        )}
      </>
    );
  }

  const temDuas = ex.imagens.length > 1;
  const src = ex.imagens[temDuas ? fase : 0];

  return (
    <>
      <div className={className} style={{ position: "relative" }}>
        <img
          src={src}
          alt={`Execução: ${ex.nome}`}
          loading="lazy"
          onClick={() => setAberto(true)}
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid #163230",
            background: "#fff",
            cursor: "pointer",
            display: "block",
          }}
        />

        {/* Toggle início/final */}
        {temDuas && (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 8,
              justifyContent: "center",
            }}
          >
            {["Início", "Final"].map((label, i) => (
              <button
                key={label}
                onClick={() => setFase(i)}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor: fase === i ? "#00FFD1" : "#163230",
                  background: fase === i ? "rgba(0,255,209,0.12)" : "transparent",
                  color: fase === i ? "#00FFD1" : "#8fb5b0",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {aberto && (
        <ModalExecucao
          ex={ex}
          fase={fase}
          setFase={setFase}
          fechar={() => setAberto(false)}
        />
      )}
    </>
  );
}

// ── Modal de tela cheia com toggle Início/Final (usado pelos dois modos) ──
function ModalExecucao({ ex, fase, setFase, fechar }) {
  const temDuas = ex.imagens.length > 1;
  const src = ex.imagens[temDuas ? fase : 0];
  return (
    <div
      onClick={fechar}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <img
        src={src}
        alt={ex.nome}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "100%",
          maxHeight: "65vh",
          borderRadius: 16,
          background: "#fff",
        }}
      />
      {temDuas && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {["Início", "Final"].map((label, i) => (
            <button
              key={label}
              onClick={(e) => {
                e.stopPropagation();
                setFase(i);
              }}
              style={{
                padding: "8px 22px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                border: "1px solid",
                borderColor: fase === i ? "#00FFD1" : "#333",
                background: fase === i ? "rgba(0,255,209,0.15)" : "transparent",
                color: fase === i ? "#00FFD1" : "#8fb5b0",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <p style={{ color: "#fff", marginTop: 16, fontSize: 16, fontWeight: 600 }}>
        {ex.nome}
      </p>
      <p style={{ color: "#8fb5b0", marginTop: 4, fontSize: 13 }}>
        Toque fora para fechar
      </p>
    </div>
  );
}

import { useState, useEffect } from "react";
import ChunkyButton from "./ChunkyButton";
import { cn } from "@/lib/utils";

/**
 * QuestionCard supports 7 formats. Calls onSubmit(answer) when user submits.
 * Parent shows feedback after submit.
 */
export default function QuestionCard({ question, onSubmit, disabled }) {
  const [answer, setAnswer] = useState(null);

  useEffect(() => { setAnswer(null); }, [question.id]);

  const canSubmit = () => {
    if (answer == null) return false;
    if (question.format === "match_pairs") {
      const pairs = answer || [];
      return pairs.length === question.lefts.length && pairs.every((p) => p.right);
    }
    if (question.format === "order_sentence") {
      return (answer || []).length === question.words.length;
    }
    return true;
  };

  return (
    <div className="bg-[#FFF8EA] rounded-3xl border-2 border-slate-200 p-5 sm:p-7 shadow-[0_8px_0_0_rgba(226,232,240,1)]" data-testid="question-card">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1A2A4F] bg-[#F5EFE0] px-2 py-1 rounded-full" data-testid="question-format-tag">
          {formatLabel(question.format)}
        </span>
        {question.badge && (
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5A934] bg-[#FFF8E1] px-2 py-1 rounded-full">
            ⭐ Power Question
          </span>
        )}
      </div>
      {question.question && (
        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-800 leading-snug mb-5" data-testid="question-text">
          {question.question}
        </h3>
      )}

      {/* Format renderers */}
      {(question.format === "mcq" || question.format === "fill_blank" || question.format === "scenario") && (
        <OptionsGrid options={question.options} value={answer} onChange={setAnswer} disabled={disabled} />
      )}
      {question.format === "true_false" && (
        <TrueFalse value={answer} onChange={setAnswer} disabled={disabled} />
      )}
      {question.format === "order_sentence" && (
        <OrderSentence words={question.words} value={answer} onChange={setAnswer} disabled={disabled} />
      )}
      {question.format === "match_pairs" && (
        <MatchPairs lefts={question.lefts} rights={question.rights} value={answer} onChange={setAnswer} disabled={disabled} />
      )}

      <div className="mt-6">
        <ChunkyButton
          data-testid="submit-answer-button"
          onClick={() => canSubmit() && onSubmit(answer)}
          disabled={!canSubmit() || disabled}
          variant="primary"
        >
          Check
        </ChunkyButton>
      </div>
    </div>
  );
}

function formatLabel(f) {
  return {
    mcq: "Pick One",
    fill_blank: "Fill the blank",
    scenario: "What would you do?",
    true_false: "True or False",
    order_sentence: "Order the sentence",
    match_pairs: "Match the pairs",
  }[f] || f;
}

// ---------- Option grid ----------
function OptionsGrid({ options, value, onChange, disabled }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt, i) => (
        <button
          key={i}
          data-testid={`option-${i}`}
          disabled={disabled}
          onClick={() => onChange(i)}
          className={cn(
            "text-left px-4 py-3 rounded-2xl border-2 font-semibold transition-all",
            "border-b-[4px] active:translate-y-[3px] active:border-b-2",
            value === i
              ? "border-[#1A2A4F] bg-[#F5EFE0] text-[#1A2A4F]"
              : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
          )}
        >
          <span className="inline-block w-6 h-6 rounded-full bg-slate-100 text-center text-sm mr-3 leading-6">
            {String.fromCharCode(65 + i)}
          </span>
          {opt}
        </button>
      ))}
    </div>
  );
}

// ---------- True / False ----------
function TrueFalse({ value, onChange, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { v: true, label: "TRUE", color: "#2D6A4F" },
        { v: false, label: "FALSE", color: "#B71C1C" },
      ].map((o) => (
        <button
          key={String(o.v)}
          data-testid={`tf-${o.label.toLowerCase()}`}
          onClick={() => onChange(o.v)}
          disabled={disabled}
          className={cn(
            "py-6 rounded-2xl border-2 border-b-[5px] font-bold text-lg uppercase active:translate-y-[4px] active:border-b-2 transition-all",
            value === o.v ? "text-white" : "bg-white text-slate-700 border-slate-200"
          )}
          style={value === o.v ? { backgroundColor: o.color, borderColor: o.color } : {}}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Order the sentence ----------
function OrderSentence({ words, value, onChange, disabled }) {
  const picked = value || [];
  const remaining = words.map((w, i) => i).filter((i) => !picked.includes(i));

  const pick = (i) => onChange([...picked, i]);
  const unpick = (i) => onChange(picked.filter((x) => x !== i));

  return (
    <div>
      <div className="min-h-[70px] p-3 border-2 border-dashed border-slate-200 rounded-2xl mb-4 flex flex-wrap gap-2 bg-white" data-testid="order-tray">
        {picked.length === 0 && <span className="text-slate-400 text-sm">Tap words below to build the sentence</span>}
        {picked.map((idx) => (
          <button
            key={idx}
            data-testid={`picked-word-${idx}`}
            disabled={disabled}
            onClick={() => unpick(idx)}
            className="px-3 py-2 bg-[#1A2A4F] text-white rounded-xl font-bold shadow"
          >
            {words[idx]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" data-testid="order-bank">
        {remaining.map((idx) => (
          <button
            key={idx}
            data-testid={`bank-word-${idx}`}
            disabled={disabled}
            onClick={() => pick(idx)}
            className="px-3 py-2 bg-white border-2 border-slate-200 border-b-[3px] rounded-xl font-bold text-slate-800 active:translate-y-[2px]"
          >
            {words[idx]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Match pairs ----------
function MatchPairs({ lefts, rights, value, onChange, disabled }) {
  const pairs = value || lefts.map((l) => ({ left: l, right: null }));
  const usedRights = pairs.filter((p) => p.right).map((p) => p.right);
  const [activeLeft, setActiveLeft] = useState(null);

  const pickLeft = (l) => setActiveLeft(l);
  const pickRight = (r) => {
    if (activeLeft == null) return;
    const next = pairs.map((p) => {
      if (p.left === activeLeft) return { ...p, right: r };
      if (p.right === r) return { ...p, right: null };
      return p;
    });
    onChange(next);
    setActiveLeft(null);
  };
  const clear = (l) => {
    onChange(pairs.map((p) => (p.left === l ? { ...p, right: null } : p)));
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2" data-testid="match-lefts">
        {lefts.map((l) => {
          const paired = pairs.find((p) => p.left === l)?.right;
          return (
            <button
              key={l}
              data-testid={`left-${l}`}
              disabled={disabled}
              onClick={() => (paired ? clear(l) : pickLeft(l))}
              className={cn(
                "px-3 py-3 rounded-2xl border-2 border-b-[4px] font-bold text-sm",
                activeLeft === l ? "border-[#1A2A4F] bg-[#F5EFE0]" : "border-slate-200 bg-white",
                paired && "bg-[#E8F5E9] border-[#2D6A4F]"
              )}
            >
              {l}
              {paired && <div className="text-xs text-[#2D6A4F] mt-1">↔ {paired}</div>}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2" data-testid="match-rights">
        {rights.map((r) => {
          const isUsed = usedRights.includes(r);
          return (
            <button
              key={r}
              data-testid={`right-${r}`}
              disabled={disabled || isUsed}
              onClick={() => pickRight(r)}
              className={cn(
                "px-3 py-3 rounded-2xl border-2 border-b-[4px] font-bold text-sm",
                isUsed ? "bg-slate-100 text-slate-400 border-slate-200" : "border-slate-200 bg-white",
                activeLeft && !isUsed && "border-[#1A2A4F]"
              )}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { ChevronDown, ChevronUp } from "lucide-react";
import { faq } from "@/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
export function FAQSection() {
  return (
    <section className="section faq-section">
      <div className="container">
        <SectionHeading
          eyebrow="Estamos aqui para ajudar"
          title="Perguntas frequentes"
          center
        />
        <div className="faq-list">
          {faq.map((item, i) => (
            <div className={`faq-item${i === 0 ? " open" : ""}`} key={item.q}>
              <button aria-expanded={i === 0} aria-controls={`faq-${i}`}>
                <span>{item.q}</span>
                {i === 0 ? <ChevronUp /> : <ChevronDown />}
              </button>
              {i === 0 ? <p id={`faq-${i}`}>{item.a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

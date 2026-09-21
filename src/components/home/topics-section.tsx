import { ArrowLeft, ArrowRight } from "lucide-react";
import { topics } from "@/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
const initials = ["LM", "AS", "CR"];
export function TopicsSection() {
  return (
    <section className="section topics">
      <div className="container">
        <div className="topics-head">
          <SectionHeading
            eyebrow="Comece em poucos minutos"
            title="Explore psicólogos por tema"
            description="Encontre profissionais especializados no que você precisa, com atendimento online ou presencial."
          />
          <div className="carousel-controls">
            <button aria-label="Anterior">
              <ArrowLeft />
            </button>
            <button aria-label="Próximo">
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="topics-row">
          {topics.map((topic, i) => (
            <article className="topic-card" key={topic}>
              <h3>{topic}</h3>
              <div className="avatar-group">
                {initials.map((x, j) => (
                  <span
                    key={x}
                    style={{
                      backgroundColor: ["#DDEEE7", "#E9DDCF", "#D7E1D5"][
                        (i + j) % 3
                      ],
                    }}
                  >
                    {x}
                  </span>
                ))}
              </div>
              <a href="#buscar">
                Ver psicólogos <ArrowRight />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

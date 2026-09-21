import Image from "next/image";
import { benefits } from "@/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
export function BenefitsSection() { return <section className="section benefits" id="como-funciona"><div className="container"><SectionHeading eyebrow="Processo simples + resultados reais" title="O que você sente ao encontrar o profissional certo"/><div className="benefit-grid">{benefits.map(({title,text,image,icon:Icon})=><article className="benefit-card" key={title}><Image src={image} alt="" fill sizes="(max-width: 767px) 82vw, (max-width: 1023px) 50vw, 25vw"/><div className="card-overlay"/><h3>{title}</h3><div className="benefit-meta"><span><Icon/></span><p>{text}</p></div></article>)}</div></div></section>; }

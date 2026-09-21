"use client";

import { useState } from "react";
import {
  LockKeyhole,
  MapPin,
  Monitor,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eyebrow } from "@/components/ui/section-heading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const perks = [
  { icon: ShieldCheck, text: "Profissionais verificados" },
  { icon: Users, text: "Atendimento em todo o Brasil" },
  { icon: LockKeyhole, text: "Seus dados são protegidos" },
];

const therapyTopics = [
  { label: "Selecione um tema", value: null },
  { label: "Relacionamentos", value: "relacionamentos" },
  { label: "Ansiedade", value: "ansiedade" },
  { label: "Depressão", value: "depressao" },
  { label: "Autoestima", value: "autoestima" },
  { label: "Vida pessoal e mudanças", value: "vida-pessoal" },
  { label: "Luto e perdas", value: "luto" },
  { label: "Estresse e burnout", value: "estresse-burnout" },
  { label: "Outro tema", value: "outro" },
];

type TherapyMode = "online" | "presencial";

export function Hero() {
  const [therapyMode, setTherapyMode] = useState<TherapyMode>("online");
  const isInPerson = therapyMode === "presencial";

  function handleModeChange(value: unknown[]) {
    const nextMode = value[0];

    if (nextMode === "online" || nextMode === "presencial") {
      setTherapyMode(nextMode);
    }
  }

  return (
    <section className="hero" id="buscar">
      <div className="hero-image" />
      <div className="container hero-content">
        <Eyebrow light>Saúde mental para uma vida mais plena</Eyebrow>
        <h1>
          Encontre o psicólogo
          <br />
          certo para você
        </h1>
        <p className="hero-copy">
          Escolha terapia online ou presencial e encontre atendimento de forma
          simples.
        </p>

        <ToggleGroup
          aria-label="Modalidade de terapia"
          className="therapy-toggle"
          spacing={0}
          value={[therapyMode]}
          onValueChange={handleModeChange}
        >
          <ToggleGroupItem value="online" aria-label="Terapia online">
            <Monitor data-icon="inline-start" />
            Terapia online
          </ToggleGroupItem>
          <ToggleGroupItem value="presencial" aria-label="Terapia presencial">
            <MapPin data-icon="inline-start" />
            Terapia presencial
          </ToggleGroupItem>
        </ToggleGroup>

        <form
          className="search-form"
          data-mode={therapyMode}
          onSubmit={(event) => event.preventDefault()}
        >
          <FieldGroup className="search-fields">
            {isInPerson ? (
              <Field className="search-field">
                <FieldLabel htmlFor="therapy-cep">CEP</FieldLabel>
                <Input
                  id="therapy-cep"
                  name="cep"
                  inputMode="numeric"
                  maxLength={9}
                  pattern="[0-9]{5}-?[0-9]{3}"
                  placeholder="Digite seu CEP"
                  required
                />
              </Field>
            ) : null}

            <Field className="search-field">
              <FieldLabel htmlFor="therapy-topic">Tema da conversa</FieldLabel>
              <Select items={therapyTopics} name="topic" defaultValue={null}>
                <SelectTrigger id="therapy-topic" aria-label="Tema da conversa">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  <SelectGroup>
                    {therapyTopics.map((topic) => (
                      <SelectItem
                        key={topic.value ?? "placeholder"}
                        value={topic.value}
                      >
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <Button className="button primary" type="submit">
            Encontrar psicólogos
            <Search data-icon="inline-end" />
          </Button>
        </form>

        <div className="hero-perks">
          {perks.map(({ icon: Icon, text }) => (
            <span key={text}>
              <Icon />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

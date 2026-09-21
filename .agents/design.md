# Design System — PsicoEncontre

> Design system extraído do layout final da landing page **PsicoEncontre**.  
> Este arquivo deve ser tratado como a **fonte de verdade visual** da implementação front-end.
>
> As cores, dimensões e espaçamentos abaixo são aproximações visuais coerentes com a referência gerada. Quando necessário, preserve primeiro a proporção e a hierarquia visual antes de buscar equivalência pixel-perfect.

---

# 1. Visão geral

## 1.1 Direção visual

A identidade da PsicoEncontre combina:

- saúde mental;
- acolhimento;
- confiança;
- simplicidade;
- credibilidade;
- sofisticação editorial;
- tecnologia discreta.

O layout evita a aparência tradicional de:

- hospital;
- dashboard;
- SaaS corporativo;
- plataforma excessivamente tecnológica.

A experiência deve parecer humana antes de parecer tecnológica.

A interface combina:

- grandes áreas claras;
- verde profundo;
- verde suave;
- creme/off-white;
- fotografia real;
- títulos serifados;
- interface funcional em sans-serif;
- cards com fotografia;
- bordas discretas;
- sombras mínimas;
- radius moderado;
- grande quantidade de whitespace.

---

## 1.2 Personalidade da marca

A marca deve parecer:

**acolhedora, confiável, contemporânea, humana, segura e premium.**

Palavras-chave:

- cuidado;
- proximidade;
- segurança;
- calma;
- conexão;
- bem-estar;
- orientação;
- acessibilidade.

Evitar:

- neon;
- gradientes chamativos;
- azul hospitalar dominante;
- roxo genérico de saúde;
- glassmorphism;
- sombras fortes;
- componentes excessivamente arredondados;
- linguagem visual infantil.

---

# 2. Paleta de cores

## 2.1 Cores principais

| Token | HEX aproximado | Uso |
|---|---:|---|
| `--color-brand-950` | `#03382C` | Footer e áreas de maior contraste |
| `--color-brand-900` | `#064B3B` | Header escuro, botões, textos de destaque |
| `--color-brand-800` | `#0A5A46` | Hover e superfícies verdes |
| `--color-brand-700` | `#116F55` | Interações secundárias |
| `--color-brand-100` | `#DDEEE7` | CTA inferior e superfícies suaves |
| `--color-brand-50` | `#EFF7F3` | Backgrounds claros com identidade |
| `--color-bg-page` | `#F8F7F2` | Fundo principal |
| `--color-bg-white` | `#FFFFFF` | Inputs, cards, superfícies |
| `--color-bg-warm` | `#F3F0E8` | Sessões editoriais |
| `--color-text-primary` | `#123A30` | Títulos e conteúdo principal |
| `--color-text-body` | `#3F4D48` | Texto corrido |
| `--color-text-muted` | `#6F7975` | Metadata e apoio |
| `--color-border` | `#DDE3DE` | Bordas e divisores |
| `--color-border-strong` | `#C8D1CC` | Inputs focados e cards |
| `--color-white` | `#FFFFFF` | Texto sobre fundos escuros |
| `--color-overlay` | `rgba(7, 25, 21, 0.48)` | Overlay do Hero |

---

## 2.2 Uso das cores

### Verde profundo

Utilizar em:

- botões principais;
- footer;
- CTA;
- labels importantes;
- links ativos;
- ícones de benefícios;
- detalhes de navegação.

### Verde claro

Utilizar em:

- badges;
- fundo de CTA;
- estado selecionado;
- pequenas áreas de destaque;
- ícones suaves.

### Creme / off-white

É o fundo dominante da landing page.

Deve transmitir:

- calma;
- sofisticação;
- leveza.

Não substituir por cinza frio.

---

## 2.3 Tokens CSS

```css
:root {
  --color-brand-950: #03382c;
  --color-brand-900: #064b3b;
  --color-brand-800: #0a5a46;
  --color-brand-700: #116f55;
  --color-brand-100: #ddeee7;
  --color-brand-50: #eff7f3;

  --color-bg-page: #f8f7f2;
  --color-bg-white: #ffffff;
  --color-bg-warm: #f3f0e8;

  --color-text-primary: #123a30;
  --color-text-body: #3f4d48;
  --color-text-muted: #6f7975;

  --color-border: #dde3de;
  --color-border-strong: #c8d1cc;

  --color-white: #ffffff;
  --color-overlay: rgba(7, 25, 21, 0.48);
}
```

---

# 3. Tipografia

O layout utiliza claramente duas famílias tipográficas.

---

## 3.1 Fonte serifada

Usar em:

- Hero;
- títulos de seção;
- headings institucionais;
- CTA editorial.

Fontes sugeridas:

```css
--font-serif: "Cormorant Garamond", "Libre Baskerville", Georgia, serif;
```

Alternativas:

- Lora;
- Source Serif 4;
- DM Serif Display.

Evitar pesos muito altos.

---

## 3.2 Fonte sans-serif

Usar em:

- navegação;
- botões;
- inputs;
- labels;
- cards;
- FAQ;
- footer;
- descrições.

Sugestão:

```css
--font-sans: "Inter", "Geist", Arial, sans-serif;
```

---

## 3.3 Escala tipográfica

| Token | Desktop | Mobile | Peso | Uso |
|---|---:|---:|---:|---|
| `display-xl` | `64px` | `42px` | `400` | Hero |
| `display-lg` | `48px` | `36px` | `400` | Títulos grandes |
| `h2` | `38px` | `30px` | `400` | Seções |
| `h3` | `26px` | `22px` | `500` | Subtítulos |
| `h4` | `20px` | `18px` | `600` | Cards |
| `body-lg` | `18px` | `17px` | `400` | Introduções |
| `body` | `16px` | `15px` | `400` | Texto |
| `small` | `14px` | `14px` | `400` | Apoio |
| `label` | `12px` | `12px` | `600` | Eyebrow |
| `button` | `14px` | `14px` | `600` | Botões |

---

## 3.4 Hero

```css
.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.625rem, 5vw, 4rem);
  line-height: 0.98;
  font-weight: 400;
  letter-spacing: -0.03em;
}
```

---

## 3.5 Títulos editoriais

```css
.section-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3vw, 2.75rem);
  line-height: 1.08;
  font-weight: 400;
  letter-spacing: -0.02em;
}
```

---

## 3.6 Eyebrows

```css
.eyebrow {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--color-brand-700);
}
```

---

# 4. Espaçamento

A página possui bastante espaço negativo.

Escala recomendada:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}
```

---

## 4.1 Espaçamento entre seções

Desktop:

```text
96px a 128px
```

Mobile:

```text
64px a 80px
```

Padrão:

```css
.section {
  padding-block: 96px;
}
```

---

## 4.2 Container

```css
.container {
  width: min(calc(100% - 48px), 1240px);
  margin-inline: auto;
}
```

Valores:

- Desktop: `max-width: 1240px`
- Tablet: padding lateral `24px`
- Mobile: `20px`
- Mobile pequeno: `16px`

---

# 5. Grid e composição

## 5.1 Grid base

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 24px;
}
```

---

## 5.2 Estrutura geral

```text
Announcement Bar
Header
Hero
Benefit Cards
Psychology Themes
Institutional Section
FAQ
Final CTA
Footer
```

---

# 6. Announcement Bar

Barra fina no topo.

Características:

- fundo verde escuro;
- texto branco;
- alinhamento central;
- altura aproximada de `36px`;
- tipografia pequena.

Exemplo:

```css
.announcement {
  min-height: 36px;
  background: var(--color-brand-900);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
```

---

# 7. Header

## 7.1 Estrutura

```text
Logo | Navegação | Entrar | Criar conta
```

---

## 7.2 Altura

```text
64px a 72px
```

---

## 7.3 Desktop

Logo na esquerda.

Links:

- Sobre nós;
- Como funciona;
- Blog.

Ações na direita:

- Entrar;
- Criar conta.

---

## 7.4 Mobile

Estrutura:

```text
Logo | Menu
```

O menu deve abrir drawer ou dropdown.

---

# 8. Hero

O Hero é a seção de maior impacto.

---

## 8.1 Estrutura

Usar uma fotografia de fundo ocupando toda a largura.

Elementos:

```text
Eyebrow
Headline
Descrição
Toggle
Formulário
Benefícios
```

---

## 8.2 Imagem

A imagem deve mostrar:

- ambiente de terapia;
- pessoa confortável;
- terapeuta parcialmente visível;
- tons quentes;
- luz natural;
- sensação de acolhimento.

A imagem deve utilizar:

```css
background-size: cover;
background-position: center;
```

---

## 8.3 Overlay

```css
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(5, 18, 15, 0.62) 0%,
      rgba(5, 18, 15, 0.42) 48%,
      rgba(5, 18, 15, 0.18) 100%
    );
}
```

---

## 8.4 Altura

Desktop:

```text
680px a 760px
```

Mobile:

```text
760px a 900px
```

dependendo da quebra dos campos.

---

## 8.5 Headline

Exemplo:

```text
Encontre o psicólogo
certo para você
```

Largura recomendada:

```text
650px
```

---

# 9. Toggle Online / Presencial

Este componente é central na experiência.

---

## 9.1 Estrutura

```text
[Terapia online] [Terapia presencial]
```

---

## 9.2 Container

```css
.therapy-toggle {
  display: inline-flex;
  padding: 4px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
}
```

---

## 9.3 Opção selecionada

```css
.therapy-toggle__option--active {
  background: var(--color-brand-100);
  color: var(--color-brand-900);
}
```

---

## 9.4 Opção comum

```css
.therapy-toggle__option {
  height: 44px;
  padding-inline: 20px;
  border-radius: 999px;
  font-weight: 600;
}
```

---

# 10. Formulário de busca

## 10.1 Estrutura presencial

```text
[CEP] [Convênio opcional] [Encontrar psicólogos]
```

---

## 10.2 Estrutura online

Quando terapia online estiver selecionada:

```text
[Convênio opcional] [Encontrar psicólogos online]
```

Ou apenas:

```text
[Encontrar psicólogos online]
```

dependendo da experiência definida.

---

## 10.3 Container

```css
.search-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;

  max-width: 820px;
  padding: 8px;

  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
}
```

---

## 10.4 Input

```css
.input {
  height: 54px;
  padding-inline: 18px;

  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;

  font-size: 14px;
}
```

---

## 10.5 Focus

```css
.input:focus {
  outline: none;
  border-color: var(--color-brand-700);
  box-shadow: 0 0 0 3px rgba(17, 111, 85, 0.14);
}
```

---

# 11. Botões

## 11.1 Primário

```css
.btn-primary {
  min-height: 48px;
  padding-inline: 22px;

  border: none;
  border-radius: 999px;

  background: var(--color-brand-900);
  color: #ffffff;

  font-size: 14px;
  font-weight: 600;
}
```

Hover:

```css
background: var(--color-brand-800);
transform: translateY(-1px);
```

---

## 11.2 Secundário

```css
.btn-secondary {
  background: #ffffff;
  color: var(--color-brand-900);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}
```

---

## 11.3 CTA claro

Usado em seções institucionais.

```css
.btn-soft {
  background: var(--color-brand-100);
  color: var(--color-brand-900);
}
```

---

# 12. Benefícios abaixo do formulário

Três pequenos blocos inline:

```text
Profissionais verificados
Atendimento em todo o Brasil
Seus dados são protegidos
```

Estrutura:

```css
.hero-benefits {
  display: flex;
  gap: 40px;
}
```

Cada item:

```text
ícone + texto
```

Ícones:

- shield;
- users;
- lock.

---

# 13. Cards editoriais de benefício

Seção:

```text
PROCESSO SIMPLES + RESULTADOS REAIS
O que você sente ao encontrar o profissional certo
```

---

## 13.1 Layout

Desktop:

```text
4 cards
```

Grid:

```css
grid-template-columns: repeat(4, 1fr);
gap: 16px;
```

---

## 13.2 Card

Formato vertical.

```css
.benefit-card {
  min-height: 420px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}
```

Imagem ocupa todo o card.

Overlay:

```css
background:
  linear-gradient(
    180deg,
    rgba(0,0,0,.14) 0%,
    rgba(0,0,0,.12) 35%,
    rgba(0,0,0,.64) 100%
  );
```

---

## 13.3 Conteúdo

Topo:

```text
Frase principal
```

Base:

```text
ícone
frase complementar
```

Exemplos:

- Cuidado que cabe no seu bolso;
- Encontre sua compatibilidade;
- Sinta-se melhor;
- Comece rapidamente.

---

# 14. Cards por tema

Seção:

```text
COMECE EM POUCOS MINUTOS
Explore psicólogos por tema
```

---

## 14.1 Layout

Horizontal carousel.

Desktop:

```text
5 cards visíveis
```

---

## 14.2 Card

```css
.topic-card {
  min-height: 180px;
  padding: 20px;

  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}
```

---

## 14.3 Conteúdo

```text
Título
Avatares sobrepostos
CTA
```

---

## 14.4 Avatar group

```css
.avatar-group img {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 2px solid #ffffff;
}
```

Sobreposição:

```css
.avatar-group img + img {
  margin-left: -10px;
}
```

---

## 14.5 Categorias iniciais

```text
Ansiedade e depressão
Relacionamentos e casamento
Autoconhecimento
Luto e perda
Estresse e burnout
```

---

# 15. Seção institucional

Título:

```text
Cuidar da sua saúde mental
é investir em uma vida melhor
```

---

## 15.1 Layout

Desktop:

```text
Texto | Imagem
```

Distribuição aproximada:

```text
48% | 52%
```

---

## 15.2 Conteúdo

Esquerda:

- eyebrow;
- título;
- descrição;
- três benefícios;
- CTA.

Direita:

- fotografia de ambiente acolhedor.

---

## 15.3 Benefícios

Formato:

```text
ícone circular + texto
```

Ícone dentro de círculo mint.

---

# 16. FAQ

Seção clara.

---

## 16.1 Cabeçalho

```text
ESTAMOS AQUI PARA AJUDAR
Perguntas frequentes
```

Centralizado.

---

## 16.2 Container

```css
.faq {
  max-width: 880px;
  margin-inline: auto;
}
```

---

## 16.3 Item

```css
.faq-item {
  border-bottom: 1px solid var(--color-border);
}
```

Header:

```css
.faq-question {
  width: 100%;
  padding-block: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: transparent;
  border: 0;
}
```

---

## 16.4 Perguntas iniciais

```text
Como funciona a terapia online?
Preciso informar convênio?
Posso buscar psicólogos por CEP?
Como agendo uma consulta?
Os profissionais são verificados?
Posso escolher atendimento presencial?
```

---

# 17. CTA final

Bloco verde claro antes do footer.

---

## 17.1 Estrutura

Desktop:

```text
Texto | CTA
```

---

## 17.2 Estilo

```css
.final-cta {
  padding: 32px 40px;
  background: var(--color-brand-100);
  border-radius: 16px;
}
```

Título:

```text
Sua saúde mental importa.
Encontre o psicólogo ideal hoje.
```

---

# 18. Footer

Fundo:

```css
background: var(--color-brand-950);
```

Texto branco.

---

## 18.1 Grid

Desktop:

```text
Brand | Sobre | Começar | Para profissionais | Informações
```

```css
.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr repeat(4, 1fr);
  gap: 48px;
}
```

---

## 18.2 Colunas

### Sobre

```text
Sobre nós
FAQ
Blog
Contato
Nossa missão
```

### Começar

```text
Encontrar psicólogos
Como funciona
Terapia online
Terapia presencial
Planos e convênios
```

### Para profissionais

```text
Para psicólogos
Benefícios
Recursos
Carreiras
Central de ajuda
```

### Informações

```text
Termos de uso
Política de privacidade
Cookies
DEI e impacto social
Mapa do site
```

---

# 19. Radius

Escala recomendada:

```css
:root {
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 999px;
}
```

Uso:

- inputs: `12px`;
- cards pequenos: `12px`;
- benefit cards: `20px`;
- grandes banners: `16px`;
- botões: `999px`;
- toggle: `999px`.

---

# 20. Bordas

Padrão:

```css
border: 1px solid var(--color-border);
```

Evitar:

- bordas escuras;
- 2px sem necessidade;
- outlines permanentes.

---

# 21. Sombras

A interface é quase flat.

Card:

```css
box-shadow: 0 4px 16px rgba(6, 43, 34, 0.04);
```

Hover:

```css
box-shadow: 0 10px 30px rgba(6, 43, 34, 0.08);
```

Dropdown/modal:

```css
box-shadow: 0 14px 40px rgba(6, 43, 34, 0.14);
```

Evitar sombras no:

- Hero;
- footer;
- FAQ;
- grandes seções editoriais.

---

# 22. Ícones

Utilizar ícones outline.

Características:

- stroke médio;
- sem preenchimentos pesados;
- geometria simples.

Bibliotecas compatíveis:

- Lucide;
- Phosphor;
- Heroicons.

Tamanhos:

```text
14px — micro
16px — inputs
18px — botões
20px — cards
24px — benefícios
```

---

# 23. Fotografia

A fotografia é uma parte estrutural da identidade.

Direção:

- pessoas reais;
- expressões naturais;
- ambientes confortáveis;
- luz quente;
- tons terrosos;
- vegetação;
- sofás;
- espaços residenciais;
- consultório acolhedor.

Evitar:

- hospital;
- jaleco;
- fundo clínico branco;
- stock corporativo genérico;
- poses artificiais.

---

# 24. Responsividade

## Desktop — ≥ 1200px

- container: `1240px`;
- Hero largo;
- 4 benefit cards;
- 5 topic cards;
- seção institucional em duas colunas;
- footer em 5 colunas.

---

## Laptop — 1024 a 1199px

- container fluido;
- Hero preserva composição;
- reduzir gaps;
- cards de benefício ainda podem permanecer em 4 colunas.

---

## Tablet — 768 a 1023px

- Hero reorganizado;
- formulário pode quebrar em duas linhas;
- cards de benefício: 2 × 2;
- temas: 3 cards ou carousel;
- institucional em 1 coluna;
- footer: 2 ou 3 colunas.

---

## Mobile — < 768px

### Hero

Ordem:

```text
Eyebrow
Título
Texto
Toggle
CEP / Convênio
CTA
Benefícios
```

O formulário vira stack.

```css
.search-form {
  grid-template-columns: 1fr;
}
```

---

### Benefit cards

Carousel horizontal.

---

### Topics

Carousel horizontal.

---

### Institucional

Imagem abaixo do conteúdo.

---

### FAQ

100% da largura disponível.

---

### Footer

1 coluna ou accordion.

---

# 25. Breakpoints

```css
:root {
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}
```

---

# 26. Motion

Interface calma.

```css
:root {
  --duration-fast: 140ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

---

## 26.1 Hover de botão

```css
transition:
  background-color var(--duration-normal) var(--ease-standard),
  transform var(--duration-normal) var(--ease-standard);
```

---

## 26.2 Card

```css
.card:hover {
  transform: translateY(-2px);
}
```

Não utilizar:

- scale grande;
- bounce;
- pulse;
- animações contínuas.

---

# 27. Acessibilidade

## Contraste

Garantir contraste AA.

---

## Inputs

Sempre usar `<label>`.

Placeholder não substitui label.

---

## Toggle

O seletor Online / Presencial deve utilizar semântica adequada:

```html
role="radiogroup"
```

ou inputs reais:

```html
<input type="radio">
```

---

## Carousel

Controles devem ter:

```html
aria-label="Anterior"
aria-label="Próximo"
```

---

## FAQ

Usar `<button>` para perguntas.

Associar:

```text
aria-expanded
aria-controls
```

---

# 28. Tokens consolidados

```css
:root {
  /* Colors */
  --color-brand-950: #03382c;
  --color-brand-900: #064b3b;
  --color-brand-800: #0a5a46;
  --color-brand-700: #116f55;
  --color-brand-100: #ddeee7;
  --color-brand-50: #eff7f3;

  --color-bg-page: #f8f7f2;
  --color-bg-white: #ffffff;
  --color-bg-warm: #f3f0e8;

  --color-text-primary: #123a30;
  --color-text-body: #3f4d48;
  --color-text-muted: #6f7975;

  --color-border: #dde3de;
  --color-border-strong: #c8d1cc;

  --color-white: #ffffff;

  /* Typography */
  --font-serif: "Cormorant Garamond", "Libre Baskerville", Georgia, serif;
  --font-sans: "Inter", "Geist", Arial, sans-serif;

  /* Layout */
  --container-max: 1240px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  /* Radius */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 999px;

  /* Motion */
  --duration-fast: 140ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

---

# 29. Arquitetura de componentes sugerida

```text
components/
│
├── layout/
│   ├── AnnouncementBar.tsx
│   ├── Header.tsx
│   ├── Container.tsx
│   └── Footer.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── IconButton.tsx
│   ├── SectionHeading.tsx
│   ├── Eyebrow.tsx
│   └── AvatarGroup.tsx
│
└── home/
    ├── Hero.tsx
    ├── TherapyModeToggle.tsx
    ├── TherapistSearchForm.tsx
    ├── HeroBenefits.tsx
    ├── BenefitsSection.tsx
    ├── BenefitCard.tsx
    ├── TopicsSection.tsx
    ├── TopicCard.tsx
    ├── AboutSection.tsx
    ├── FAQSection.tsx
    ├── FAQItem.tsx
    └── FinalCTA.tsx
```

---

# 30. Estados do formulário

## Terapia online

Quando selecionado:

- destaque visual no botão “Terapia online”;
- CEP pode desaparecer;
- convênio continua opcional;
- CTA muda para:

```text
Encontrar psicólogos online
```

---

## Terapia presencial

Quando selecionado:

mostrar:

```text
CEP
Convênio (opcional)
Encontrar psicólogos
```

CEP deve ser obrigatório.

Convênio não deve ser obrigatório.

---

# 31. Comportamento esperado

## CEP

Placeholder:

```text
Digite seu CEP
```

Aplicar máscara:

```text
00000-000
```

---

## Convênio

Placeholder:

```text
Convênio (opcional)
```

Opções iniciais:

```text
Unimed
Bradesco Saúde
SulAmérica
Amil
NotreDame Intermédica
Porto Saúde
Particular
```

---

# 32. Copy principal

## Hero

Eyebrow:

```text
SAÚDE MENTAL PARA UMA VIDA MAIS PLENA
```

Título:

```text
Encontre o psicólogo
certo para você
```

Descrição:

```text
Escolha terapia online ou presencial e encontre
atendimento de forma simples.
```

---

## Benefícios

```text
Cuidado que cabe no seu bolso
Encontre sua compatibilidade
Sinta-se melhor
Comece rapidamente
```

---

## Temas

```text
Ansiedade e depressão
Relacionamentos e casamento
Autoconhecimento
Luto e perda
Estresse e burnout
```

---

## Institucional

```text
Cuidar da sua saúde mental
é investir em uma vida melhor
```

---

## FAQ

```text
Perguntas frequentes
```

---

## CTA final

```text
Sua saúde mental importa.
Encontre o psicólogo ideal hoje.
```

---

# 33. Regras finais de consistência

1. Hero sempre deve ser a maior área visual da página.
2. Verde profundo é a cor de ação principal.
3. Off-white é o fundo predominante.
4. Serif deve aparecer apenas em títulos e conteúdo editorial.
5. Sans-serif deve dominar toda a UI funcional.
6. Cards de benefício usam fotografia.
7. Cards de temas usam fundo branco e avatares.
8. Não usar grandes sombras.
9. Não usar glassmorphism.
10. Não utilizar gradientes decorativos.
11. Gradiente só pode existir sobre imagens para melhorar contraste.
12. Não criar visual de dashboard.
13. Não criar sidebar.
14. Radius deve ser moderado.
15. Botões principais usam formato pill.
16. Inputs usam radius menor que os botões.
17. Footer deve ser verde profundo.
18. FAQ deve ser extremamente clean.
19. Ilustrações e fotografias devem transmitir acolhimento.
20. A busca pelo psicólogo é a ação mais importante da interface.
21. Online e presencial devem aparecer logo no Hero.
22. CEP só é obrigatório no atendimento presencial.
23. Convênio sempre é opcional.
24. O layout deve continuar premium sem parecer luxuoso demais.
25. A interface deve transmitir calma antes de transmitir tecnologia.

---

# Resumo

A identidade visual da **PsicoEncontre** pode ser resumida como:

> **editorial + acolhedora + humana + premium + simples + confiável**

A fórmula visual principal é:

> **off-white + verde profundo + serif elegante + UI sans-serif + fotografia humana + bastante whitespace + cards discretos + CTAs em pill**

Na implementação, este arquivo deve possuir prioridade sobre decisões visuais improvisadas.

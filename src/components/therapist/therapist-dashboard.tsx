"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  HeartHandshake,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { type FormEvent, useState } from "react";

type Appointment = {
  date: string;
  start: string;
  end: string;
  patient: string;
  type: string;
  paid: boolean;
  tone: "green" | "coral" | "lavender";
};

type CalendarDay = { short: string; date: number; iso: string; month: string };

const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const calendarStart = new Date(Date.UTC(2024, 4, 20));

function getWeekDays(offset: number): CalendarDay[] {
  return dayNames.map((short, index) => {
    const date = new Date(calendarStart);
    date.setUTCDate(calendarStart.getUTCDate() + offset * 7 + index);
    return { short, date: date.getUTCDate(), iso: date.toISOString().slice(0, 10), month: date.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", "") };
  });
}

function formatWeekLabel(days: CalendarDay[]) {
  const first = days[0];
  const last = days[days.length - 1];
  return `${first.date} de ${first.month} — ${last.date} de ${last.month} de ${last.iso.slice(0, 4)}`;
}

function formatMonthLabel(day: CalendarDay) {
  return new Date(`${day.iso}T00:00:00Z`).toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
}

function isPastDate(iso: string) {
  return iso < "2024-05-22";
}

const initialAppointments: Appointment[] = [
  { date: "2024-05-20", start: "08:30", end: "09:30", patient: "Marina S.", type: "Terapia online", paid: true, tone: "green" },
  { date: "2024-05-21", start: "10:00", end: "11:00", patient: "Lucas R.", type: "Terapia social", paid: false, tone: "coral" },
  { date: "2024-05-21", start: "14:00", end: "15:00", patient: "Ana C.", type: "Terapia online", paid: true, tone: "lavender" },
  { date: "2024-05-22", start: "09:00", end: "10:00", patient: "João P.", type: "Terapia presencial", paid: true, tone: "green" },
  { date: "2024-05-23", start: "15:30", end: "16:30", patient: "Carla M.", type: "Terapia social", paid: false, tone: "coral" },
  { date: "2024-05-24", start: "11:00", end: "12:00", patient: "Rafael T.", type: "Terapia online", paid: true, tone: "lavender" },
];

const timeline = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function TherapistDashboard() {
  const [socialAccepted, setSocialAccepted] = useState(true);
  const [view, setView] = useState<"week" | "today">("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState("");
  const [newDate, setNewDate] = useState("2024-05-22");
  const [newTime, setNewTime] = useState("15:00");
  const [newType, setNewType] = useState("Terapia online");
  const [newPaid, setNewPaid] = useState("pending");
  const [availabilityDays, setAvailabilityDays] = useState([0, 1, 2, 3, 4]);
  const [availabilityStart, setAvailabilityStart] = useState("08:00");
  const [availabilityEnd, setAvailabilityEnd] = useState("18:00");
  const [availabilitySaved, setAvailabilitySaved] = useState(false);

  const weekDays = getWeekDays(weekOffset);
  const visibleDays = view === "today" ? weekDays.filter((day) => day.iso === "2024-05-22") : weekDays;
  const currentLabel = formatWeekLabel(weekDays);

  function handleSchedulePatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newPatient.trim() || isPastDate(newDate)) return;
    const endHour = `${String(Number(newTime.slice(0, 2)) + 1).padStart(2, "0")}:${newTime.slice(3)}`;
    const tone = newPaid === "paid" ? "green" : newType === "Terapia social" ? "coral" : "lavender";
    setAppointments((current) => [...current, { date: newDate, start: newTime, end: endHour, patient: newPatient.trim(), type: newType, paid: newPaid === "paid", tone }]);
    setIsScheduleModalOpen(false);
    setNewPatient("");
  }

  function openScheduleForDate(date = weekDays.find((day) => day.iso === "2024-05-22")?.iso ?? weekDays[0].iso) {
    if (isPastDate(date)) return;
    setNewDate(date);
    setIsScheduleModalOpen(true);
  }

  function toggleAvailabilityDay(dayIndex: number) {
    setAvailabilitySaved(false);
    setAvailabilityDays((current) => current.includes(dayIndex) ? current.filter((day) => day !== dayIndex) : [...current, dayIndex].sort());
  }

  return (
    <main className="therapist-app">
      <aside className="therapist-sidebar">
        <a className="therapist-brand" href="/">Psico<span>Encontre</span></a>
        <div className="therapist-profile-mini">
          <div className="therapist-avatar">MC</div>
          <div><strong>Marina Costa</strong><span>Psicóloga clínica</span></div>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
        <nav className="therapist-nav" aria-label="Navegação do perfil profissional">
          <a className="active" href="#visao-geral"><LayoutDashboard size={18} /> Visão geral</a>
          <a href="#agenda"><CalendarDays size={18} /> Minha agenda <span className="nav-count">6</span></a>
          <a href="#pacientes"><Users size={18} /> Pacientes</a>
          <a href="#financeiro"><WalletCards size={18} /> Financeiro</a>
          <a href="#perfil"><HeartHandshake size={18} /> Meu perfil</a>
        </nav>
        <div className="sidebar-help"><span>Precisa de ajuda?</span><a href="#central">Acesse a central de ajuda</a></div>
      </aside>

      <section className="therapist-main">
        <header className="therapist-topbar">
          <button className="mobile-menu" aria-label="Abrir menu"><Menu size={20} /></button>
          <div><p className="date-kicker">Quarta-feira, 22 de maio</p><h1>Olá, Marina <span>●</span></h1></div>
          <div className="topbar-actions"><button className="notification-button" aria-label="Ver notificações"><span>2</span><CircleDollarSign size={20} /></button><button className="outline-button">Ver meu perfil <ArrowRight size={16} /></button></div>
        </header>

        <div className="therapist-content" id="visao-geral">
          <section className="social-setting" aria-labelledby="social-title">
            <div className="social-setting-icon"><HeartHandshake size={22} /></div>
            <div className="social-setting-copy"><p className="section-label">Impacto social</p><h2 id="social-title">Terapia social</h2><p>Atenda pessoas com renda reduzida com valores combinados pela plataforma.</p></div>
            <div className="social-setting-control">
              <span className={socialAccepted ? "status-on" : "status-off"}>{socialAccepted ? "Você aceita" : "Você não aceita"}</span>
              <button className={`switch ${socialAccepted ? "on" : ""}`} onClick={() => setSocialAccepted(!socialAccepted)} aria-pressed={socialAccepted} aria-label="Alternar aceitação de terapia social"><span /></button>
            </div>
          </section>

          <section className="availability-settings" id="perfil" aria-labelledby="availability-title">
            <div className="availability-heading"><div><p className="section-label">Meu perfil</p><h2 id="availability-title">Padrão de atendimento</h2><p>Escolha os dias e horários que ficam disponíveis para novos agendamentos.</p></div><Clock3 size={22} /></div>
            <div className="availability-controls"><div className="weekday-picker"><span className="control-label">Dias de atendimento</span><div className="weekday-options">{dayNames.map((day, index) => <button type="button" key={day} className={availabilityDays.includes(index) ? "weekday selected" : "weekday"} onClick={() => toggleAvailabilityDay(index)} aria-pressed={availabilityDays.includes(index)}>{day}</button>)}</div></div><div className="time-pickers"><label><span className="control-label">Das</span><select value={availabilityStart} onChange={(event) => { setAvailabilityStart(event.target.value); setAvailabilitySaved(false); }}>{["07:00", "08:00", "09:00", "10:00"].map((time) => <option key={time}>{time}</option>)}</select></label><span className="time-divider">até</span><label><span className="control-label">Às</span><select value={availabilityEnd} onChange={(event) => { setAvailabilityEnd(event.target.value); setAvailabilitySaved(false); }}>{["16:00", "17:00", "18:00", "19:00", "20:00"].map((time) => <option key={time}>{time}</option>)}</select></label></div><button className="save-availability" type="button" onClick={() => setAvailabilitySaved(true)}>{availabilitySaved ? <><Check size={15} /> Salvo</> : "Salvar horários"}</button></div>
          </section>

          <section className="stats-grid" aria-label="Resumo da agenda">
            <article className="stat-card"><div className="stat-icon green"><CalendarDays size={18} /></div><div><strong>{appointments.length}</strong><span>consultas esta semana</span></div><small className="positive">+2 vs. semana passada</small></article>
            <article className="stat-card"><div className="stat-icon coral"><Clock3 size={18} /></div><div><strong>8</strong><span>horários disponíveis</span></div><small>Próximo: hoje, 16h</small></article>
            <article className="stat-card"><div className="stat-icon yellow"><CircleDollarSign size={18} /></div><div><strong>R$ 1.240</strong><span>a receber</span></div><small className="warning">2 pagamentos pendentes</small></article>
          </section>

          <section className="agenda-section" id="agenda">
            <div className="agenda-heading"><div><p className="section-label">Sua semana</p><h2>Agenda de consultas</h2></div><div className="agenda-actions"><button className="today-button" onClick={() => { setWeekOffset(0); setView("today"); }}>Hoje</button><button className="icon-button" onClick={() => { setWeekOffset((current) => current - 1); setView("week"); }} aria-label="Semana anterior"><ArrowLeft size={17} /></button><button className="icon-button" onClick={() => { setWeekOffset((current) => current + 1); setView("week"); }} aria-label="Próxima semana"><ArrowRight size={17} /></button><button className="primary-button" onClick={() => openScheduleForDate()}><Plus size={17} /> Novo horário</button></div></div>
            <div className="calendar-toolbar"><button className="month-selector">{formatMonthLabel(weekDays[0])} <ChevronDown size={16} /></button><div className="view-switcher"><button className={view === "week" ? "selected" : ""} onClick={() => setView("week")}>Semana</button><button className={view === "today" ? "selected" : ""} onClick={() => setView("today")}>Hoje</button></div><div className="calendar-legend"><span><i className="legend-dot green" />Pago</span><span><i className="legend-dot coral" />Aguardando pagamento</span><span><i className="legend-dot available" />Disponível</span></div></div>
            <div className={`calendar-shell ${view === "today" ? "today-view" : ""}`}>
              <div className="calendar-caption"><span>{currentLabel}</span><span className="timezone">Horário de Brasília (GMT−3)</span></div>
              <div className="calendar-grid">
                <div className="time-column"><div className="time-head" />{timeline.map((time) => <span key={time}>{time}</span>)}</div>
                {visibleDays.map((day) => { const dayIndex = dayNames.indexOf(day.short); const dayAppointments = appointments.filter((item) => item.date === day.iso); const canAdd = !isPastDate(day.iso) && availabilityDays.includes(dayIndex); const availabilityTop = Math.max(0, (Number(availabilityStart.slice(0, 2)) - 8) * 10); return <div className="day-column" key={day.iso}><div className={`day-head ${day.iso === "2024-05-22" ? "current" : ""}`}><span>{day.short}</span><strong>{day.date}</strong></div><div className="day-slots">{timeline.map((time) => <div className="hour-slot" key={`${day.iso}-${time}`} />)}{dayAppointments.map((item) => <AppointmentCard key={`${item.date}-${item.start}-${item.patient}`} appointment={item} />)}{dayAppointments.length === 0 && canAdd && <button className="available-slot" style={{ top: `${availabilityTop}%` }} onClick={() => openScheduleForDate(day.iso)}><Plus size={13} /> horário livre</button>}</div></div>; })}
              </div>
            </div>
          </section>

          <section className="bottom-grid">
            <article className="upcoming-card" id="pacientes"><div className="card-heading"><div><p className="section-label">Próximos encontros</p><h2>Hoje, 22 de maio</h2></div><button className="more-button" aria-label="Mais opções"><MoreHorizontal size={20} /></button></div><div className="upcoming-list"><UpcomingItem time="09:00" name="João Pereira" type="Terapia presencial" paid /><UpcomingItem time="13:30" name="Intervalo reservado" type="Horário pessoal" /><UpcomingItem time="16:00" name="Horário disponível" type="Abra para novos agendamentos" available /></div></article>
            <article className="payment-card" id="financeiro"><div className="payment-top"><div><p className="section-label">Atenção necessária</p><h2>Pagamentos pendentes</h2></div><div className="payment-total">R$ 480</div></div><p className="payment-description">Duas consultas aguardam confirmação de pagamento.</p><div className="payment-row"><span className="patient-avatar">LR</span><div><strong>Lucas R.</strong><span>Consulta de 21 mai · R$ 240</span></div><span className="pending-pill">Pendente</span></div><div className="payment-row"><span className="patient-avatar blue">CM</span><div><strong>Carla M.</strong><span>Consulta de 23 mai · R$ 240</span></div><span className="pending-pill">Pendente</span></div><button className="link-button">Ver todos os pagamentos <ArrowRight size={15} /></button></article>
          </section>
        </div>
      </section>
      {isScheduleModalOpen ? <div className="schedule-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsScheduleModalOpen(false); }}><section className="schedule-modal" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title"><div className="schedule-modal-header"><div><p className="section-label">Agenda manual</p><h2 id="schedule-modal-title">Agendar paciente</h2></div><button className="modal-close" onClick={() => setIsScheduleModalOpen(false)} aria-label="Fechar agendamento"><X size={19} /></button></div><p className="schedule-modal-intro">Adicione uma consulta diretamente à sua agenda. O paciente receberá a confirmação depois.</p><form className="schedule-form" onSubmit={handleSchedulePatient}><label><span>Nome do paciente</span><input value={newPatient} onChange={(event) => setNewPatient(event.target.value)} placeholder="Ex.: Beatriz Almeida" autoFocus required /></label><div className="schedule-form-grid"><label><span>Dia</span><select value={newDate} onChange={(event) => setNewDate(event.target.value)}>{weekDays.map((day) => <option value={day.iso} key={day.iso} disabled={isPastDate(day.iso)}>{day.short}, {day.date} de {day.month}{isPastDate(day.iso) ? " · passado" : ""}</option>)}</select></label><label><span>Horário</span><select value={newTime} onChange={(event) => setNewTime(event.target.value)}>{["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].filter((time) => time >= availabilityStart && time < availabilityEnd).map((time) => <option value={time} key={time}>{time}</option>)}</select></label></div><label><span>Modalidade</span><select value={newType} onChange={(event) => setNewType(event.target.value)}><option>Terapia online</option><option>Terapia presencial</option><option>Terapia social</option></select></label><fieldset><legend>Status do pagamento</legend><label className="radio-choice"><input type="radio" name="payment-status" value="paid" checked={newPaid === "paid"} onChange={() => setNewPaid("paid")} /><span>Pago</span></label><label className="radio-choice"><input type="radio" name="payment-status" value="pending" checked={newPaid === "pending"} onChange={() => setNewPaid("pending")} /><span>Aguardando pagamento</span></label></fieldset><div className="schedule-form-actions"><button type="button" className="cancel-button" onClick={() => setIsScheduleModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={isPastDate(newDate)}>Agendar paciente <Check size={16} /></button></div></form></section></div> : null}
    </main>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const top = `${((Number(appointment.start.slice(0, 2)) - 8) + Number(appointment.start.slice(3)) / 60) * 10}%`;
  return <div className={`appointment-card ${appointment.tone}`} style={{ top }}><div><strong>{appointment.start} — {appointment.end}</strong><span>{appointment.patient} · {appointment.type}</span></div><span className={`payment-mark ${appointment.paid ? "paid" : "waiting"}`} aria-label={appointment.paid ? "Pago" : "Aguardando pagamento"}>{appointment.paid ? <Check size={11} /> : <CircleDollarSign size={11} />}</span></div>;
}

function UpcomingItem({ time, name, type, paid, available }: { time: string; name: string; type: string; paid?: boolean; available?: boolean }) {
  return <div className="upcoming-item"><time>{time}</time><div className={`upcoming-line ${available ? "open" : ""}`} /><div className="upcoming-copy"><strong>{name}</strong><span>{type}</span></div>{paid ? <span className="paid-label"><CheckCircle2 size={14} /> Pago</span> : available ? <button className="small-action">Abrir horário</button> : <span className="reserved-label">Reservado</span>}</div>;
}

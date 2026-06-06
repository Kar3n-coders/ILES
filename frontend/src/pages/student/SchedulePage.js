import { PageHead, Card, Chip } from "../../components/common/Primitives";
import "./SchedulePage.css";

const SCHEDULE = [
    {week: "Week 5", date: "2026-05-12 - 2026-05-16", title: "Workplace supervisor visit", type: "visit" },
    {week: "Week 5", date: "2026-05-16", title: "Weekly log due", type: "deadline" },
    {week: "Week 6", date: "2026-05-19 -2026-05-23", title: "Mid-placement review", type: "review" },
    { week: "Week 6", date: "2026-05-23", title: "Weekly log due", type: "deadline" },
    { week: "Week 8", date: "2026-06-02 – 2026-06-06", title: "Academic supervisor visit", type: "visit" },
    { week: "Week 12", date: "2026-06-30", title: "Final evaluation", type: "review" },
];

const TYPE_KIND = { visit: "info", deadline: "warn", review: "ok" };

export default function SchedulePage() { 
  return (
    <div className="page">
      <PageHead title="Schedule" sub="Upcoming supervisor visits, reviews, and log deadlines." />
      <Card label="Upcoming Events">
        {SCHEDULE.length === 0 ? (
          <p className="schedule-empty">No events scheduled yet.</p>
        ) : (
          <div className="schedule-list">
            {SCHEDULE.map((ev, i) => (
              <div key={i} className="schedule-row">
                <div className="schedule-row__week">{ev.week}</div>
                <div className="schedule-row__body">
                  <span className="schedule-row__title">{ev.title}</span>
                  <span className="schedule-row__date">{ev.date}</span>
                </div>
                <Chip kind={TYPE_KIND[ev.type]}>{ev.type}</Chip>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
      




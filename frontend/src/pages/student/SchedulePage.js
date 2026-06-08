import { PageHead, Card, Chip } from "../../components/common/Primitives";
import "./SchedulePage.css";

const SCHEDULE = [];

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
      




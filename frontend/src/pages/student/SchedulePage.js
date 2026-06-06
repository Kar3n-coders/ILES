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




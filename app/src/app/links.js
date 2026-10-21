import { IconDoc, IconExam, IconSlides, IconCalendar, IconTarget, IconChat, IconChart } from '../ui/Icons';

/* The standalone pages at the repository root. guest: visible to guests; teacher: teacher-only. */
export const LINKS = {
  worksheets: { href: 'worksheets.html', label: 'Worksheets', icon: IconDoc, guest: true },
  exam: { href: 'exam.html', label: 'Exam practice', icon: IconExam, guest: true },
  slides: { href: 'slides.html', label: 'Slides', icon: IconSlides, guest: true },
  daily: { href: 'daily.html', label: 'Daily practice', icon: IconCalendar, guest: false },
  recommend: { href: 'recommend.html', label: 'For you', icon: IconTarget, guest: false },
  feedback: { href: 'feedback.html', label: 'Feedback', icon: IconChat, guest: false },
  analytics: { href: 'analytics.html', label: 'Analytics', icon: IconChart, teacher: true },
};

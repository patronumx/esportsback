import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ events }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const daysInMonth = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 bg-gray-700/50 border-b border-gray-700">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 text-center bg-gray-700/30 text-gray-400 py-2 text-sm font-medium uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 bg-gray-800">
                {daysInMonth.map((day, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.startTime), day));
                    return (
                        <div
                            key={i}
                            className={`min-h-[100px] border-b border-r border-gray-700/50 p-2 transition-colors ${!isSameMonth(day, monthStart)
                                    ? "bg-gray-900/50 text-gray-600"
                                    : "text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`text-right text-sm mb-1 ${isSameDay(day, new Date()) ? 'text-blue-400 font-bold' : ''}`}>
                                {format(day, dateFormat)}
                            </div>
                            <div className="space-y-1">
                                {dayEvents.map((event, idx) => (
                                    <div key={idx} className={`text-xs p-1 rounded truncate ${event.type === 'tournament' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                            event.type === 'scrim' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                'bg-gray-600/20 text-gray-300 border border-gray-600/30'
                                        }`}>
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;

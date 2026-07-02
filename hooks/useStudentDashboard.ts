import { useState, useEffect, useCallback } from 'react';
import { statsService } from '@/services/stats.service';
import { examsService } from '@/services/exams.service';
import { useAuthContext } from '@/contexts/AuthContext';
import { Student, Exam, Homework, Attendance } from '@/utils/types';

export interface StudentDashboardData {
    stats: any;
    results: any;
    loading: boolean;
    error: string | null;
    gpa: string;
    rankText: string | null;
    attendancePercent: string;
    attendanceStatus: 'GOOD' | 'AVERAGE' | 'POOR';
    activeAssignmentsCount: number;
    pendingAssignments: any[];
    streak: number;
    performanceData: { name: string; score: number }[];
}

export function useStudentDashboard() {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<StudentDashboardData | null>(null);

    const calculateGPA = (results: any[]) => {
        if (!results || results.length === 0) return '0.0';

        // Simple 4.0 scale conversion for demonstration
        // Grade to Points mapping
        const gradePoints: Record<string, number> = {
            'A+': 4.0, 'A': 3.8, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D': 1.0, 'F': 0.0
        };

        const totalPoints = results.reduce((sum, res) => sum + (gradePoints[res.grade] || 0), 0);
        return (totalPoints / results.length).toFixed(1);
    };

    const calculateStreak = (attendance: any[]) => {
        if (!attendance || attendance.length === 0) return 0;

        let streak = 0;
        for (const record of attendance) {
            if (record.status === 'PRESENT') {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Fetch Basic Stats (already filtered for current student in backend)
            const stats = await statsService.getStats('STUDENT');
            const studentId = stats.studentId;

            let results = { results: [], statistics: {} };

            // 2. If we have studentId, fetch detailed results for GPA and charts
            if (studentId) {
                results = await examsService.generateReportCard(studentId, ''); // Using empty academicYearId for now
            }

            // 4. Process the data
            const gpa = calculateGPA(results.results || []);
            const attendancePercent = stats.statistics?.attendanceRate || 0;

            let attendanceStatus: 'GOOD' | 'AVERAGE' | 'POOR' = 'POOR';
            if (attendancePercent >= 85) attendanceStatus = 'GOOD';
            else if (attendancePercent >= 75) attendanceStatus = 'AVERAGE';

            // 5. Format performance data for chart
            // Map results to subject performance
            const performanceMap: Record<string, { total: number; count: number }> = {};
            (results.results || []).forEach((res: any) => {
                const subjectName = res.exam?.subject?.name || res.exam?.name || 'Unknown';
                if (!performanceMap[subjectName]) {
                    performanceMap[subjectName] = { total: 0, count: 0 };
                }
                performanceMap[subjectName].total += parseFloat(res.percentage);
                performanceMap[subjectName].count += 1;
            });

            const performanceData = Object.entries(performanceMap).map(([name, data]) => ({
                name: name.toUpperCase().slice(0, 4),
                score: Math.round(data.total / data.count)
            }));

            setData({
                stats: {
                    ...stats,
                    todaySchedule: stats.todaySchedule || [],
                    notices: stats.notices || []
                },
                results,
                loading: false,
                error: null,
                gpa,
                rankText: null, // Hiding as requested since real comparison data API is unavailable
                attendancePercent: `${attendancePercent}%`,
                attendanceStatus,
                activeAssignmentsCount: stats.statistics?.pendingHomework || 0,
                pendingAssignments: (stats.homework || []).map((hw: any) => ({
                    title: hw.title,
                    due: new Date(hw.dueDate).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' :
                        new Date(hw.dueDate).toLocaleDateString() === new Date(Date.now() + 86400000).toLocaleDateString() ? 'Tomorrow' :
                            new Date(hw.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    priority: new Date(hw.dueDate).getTime() - Date.now() < 86400000 ? 'HIGH' : 'LOW',
                    progress: 0,
                    subject: hw.subject?.name
                })),
                streak: calculateStreak(stats.recentAttendance || []),
                performanceData: performanceData.length > 0 ? performanceData : []
            });

        } catch (err: any) {
            console.error('Error fetching student dashboard data:', err);
            setError(err.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return { data, loading, error, refetch: fetchDashboardData };
}

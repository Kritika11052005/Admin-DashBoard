'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Info,
    Sparkles,
    RefreshCw,
    ChevronRight,
    Zap
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface Insight {
    type: 'success' | 'warning' | 'critical' | 'info';
    category: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low' | 'positive';
    actionable: boolean;
    recommendation: string;
}

interface AIInsightsData {
    insights: Insight[];
    metrics: {
        totalUsers: number;
        conversionRate: number;
        avgCVScore: number;
        avgFeedbackRating: number;
        recentAnalyses: number;
    };
}

export default function AIInsights() {
    const [data, setData] = useState<AIInsightsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            setRefreshing(true);
            setError(null);
            const response = await fetch('/api/analytics/ai-insights');
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || 'Failed to generate insights');
            }
        } catch (error) {
            console.error('Failed to fetch AI insights:', error);
            setError('Failed to connect to AI service. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'info': return <Info className="w-5 h-5 text-blue-500" />;
            default: return <Info className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`} />;
        }
    };

    const getInsightColor = (type: string) => {
        if (isDark) {
            switch (type) {
                case 'success': return 'border-green-500/50 bg-green-500/10';
                case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
                case 'critical': return 'border-red-500/50 bg-red-500/10';
                case 'info': return 'border-blue-500/50 bg-blue-500/10';
                default: return 'border-zinc-500/50 bg-zinc-500/10';
            }
        } else {
            switch (type) {
                case 'success': return 'border-green-300 bg-green-50';
                case 'warning': return 'border-yellow-300 bg-yellow-50';
                case 'critical': return 'border-red-300 bg-red-50';
                case 'info': return 'border-blue-300 bg-blue-50';
                default: return 'border-gray-300 bg-gray-50';
            }
        }
    };

    const getImpactBadge = (impact: string) => {
        if (isDark) {
            const colors = {
                high: 'bg-red-500/20 text-red-400 border-red-500/50',
                medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
                low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
                positive: 'bg-green-500/20 text-green-400 border-green-500/50',
            };
            return colors[impact as keyof typeof colors] || colors.low;
        } else {
            const colors = {
                high: 'bg-red-100 text-red-700 border-red-300',
                medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                low: 'bg-blue-100 text-blue-700 border-blue-300',
                positive: 'bg-green-100 text-green-700 border-green-300',
            };
            return colors[impact as keyof typeof colors] || colors.low;
        }
    };

    if (loading) {
        return (
            <Card className={`${isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-900/20 border-zinc-800' : 'bg-white border-gray-200'} p-6 transition-colors`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} rounded-lg`}>
                        <Brain className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Generating AI Insights...</h3>
                        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm`}>Analyzing your data with Gemini AI</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-24 ${isDark ? 'bg-zinc-800/50' : 'bg-gray-100'} rounded-lg animate-pulse`}></div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={`${isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-900/20 border-zinc-800 hover:border-purple-500/50' : 'bg-white border-gray-200 hover:border-purple-400/50'} p-6 transition-all`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} rounded-lg`}>
                            <Brain className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                AI-Powered Insights
                                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                            </h3>
                            <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm`}>Real-time analytics powered by AI</p>
                        </div>
                    </div>

                    <Button
                        onClick={fetchInsights}
                        disabled={refreshing}
                        variant="outline"
                        size="sm"
                        className={isDark ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    <div className={`${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border transition-colors`}>
                        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-xs mb-1`}>Total Users</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>{data?.metrics.totalUsers}</p>
                    </div>
                    <div className={`${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border transition-colors`}>
                        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-xs mb-1`}>Conversion</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>{data?.metrics.conversionRate}%</p>
                    </div>
                    <div className={`${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border transition-colors`}>
                        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-xs mb-1`}>Avg Score</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>{data?.metrics.avgCVScore}/100</p>
                    </div>
                    <div className={`${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border transition-colors`}>
                        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-xs mb-1`}>Rating</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>{data?.metrics.avgFeedbackRating}/5</p>
                    </div>
                    <div className={`${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border transition-colors`}>
                        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-xs mb-1`}>Recent Activity</p>
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>{data?.metrics.recentAnalyses}</p>
                    </div>
                </div>

                {error && (
                    <div className={`mb-6 p-4 ${isDark ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-300'} border rounded-lg`}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'} mt-0.5`} />
                            <div>
                                <p className={`${isDark ? 'text-red-400' : 'text-red-700'} font-semibold mb-1`}>AI Insights Unavailable</p>
                                <p className={`${isDark ? 'text-zinc-300' : 'text-gray-700'} text-sm`}>{error}</p>
                                <p className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-xs mt-2`}>Check your Gemini API key in .env.local</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Insights List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {data?.insights.map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.1 }}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${getInsightColor(insight.type)}`}
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">{getInsightIcon(insight.type)}</div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h4 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{insight.title}</h4>
                                            <Badge className={`text-xs ${getImpactBadge(insight.impact)}`}>
                                                {insight.impact === 'positive' ? '✨ Positive' : `⚡ ${insight.impact} impact`}
                                            </Badge>
                                            {insight.actionable && (
                                                <Badge className={`text-xs ${isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-purple-100 text-purple-700 border-purple-300'}`}>
                                                    <Zap className="w-3 h-3 mr-1" />
                                                    Actionable
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className={`text-xs ${isDark ? 'border-zinc-600 text-zinc-400' : 'border-gray-300 text-gray-600'}`}>
                                                {insight.category}
                                            </Badge>
                                        </div>

                                        <p className={`${isDark ? 'text-zinc-300' : 'text-gray-700'} text-sm mb-2`}>{insight.description}</p>

                                        <AnimatePresence>
                                            {expandedIndex === index && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className={`mt-3 pt-3 border-t ${isDark ? 'border-zinc-700' : 'border-gray-300'}`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <TrendingUp className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'} mt-1 flex-shrink-0`} />
                                                        <div>
                                                            <p className={`${isDark ? 'text-purple-400' : 'text-purple-700'} text-xs font-semibold mb-1`}>AI Recommendation:</p>
                                                            <p className={`${isDark ? 'text-zinc-300' : 'text-gray-700'} text-sm`}>{insight.recommendation}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <ChevronRight
                                        className={`w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-gray-400'} transition-transform ${expandedIndex === index ? 'rotate-90' : ''}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className={`mt-6 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
                    <p className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-xs text-center`}>
                        💡 AI insights are generated based on real-time data analysis • Last updated: {new Date().toLocaleString()}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, Trash2, Calendar, User } from 'lucide-react';

interface SavedReport {
  userId: string;
  timestamp: string;
  firstName: string;
  country: string;
}

interface ReportData {
  fileName: string;
  content: string;
  timestamp: string;
  size: number;
}

export function ReportViewer() {
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [showReportContent, setShowReportContent] = useState(false);

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = () => {
    try {
      const allProfiles = JSON.parse(localStorage.getItem('all_user_profiles') || '[]');
      setSavedReports(allProfiles);
    } catch (error) {
      console.error('Failed to load saved reports:', error);
    }
  };

  const viewReport = (userId: string) => {
    try {
      const reportData = JSON.parse(localStorage.getItem(`report_${userId}`) || '{}');
      if (reportData.fileName) {
        setSelectedReport(reportData);
        setShowReportContent(true);
      } else {
        alert('Report not found for this user.');
      }
    } catch (error) {
      console.error('Failed to load report:', error);
      alert('Error loading report.');
    }
  };

  const downloadReport = (userId: string) => {
    try {
      const reportData = JSON.parse(localStorage.getItem(`report_${userId}`) || '{}');
      if (reportData.content) {
        const blob = new Blob([reportData.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = reportData.fileName || `${userId}_report.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Error downloading report.');
    }
  };

  const deleteReport = (userId: string) => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        localStorage.removeItem(`report_${userId}`);
        localStorage.removeItem(`financial_profile_${userId}`);
        
        // Update the list
        const updatedProfiles = savedReports.filter(report => report.userId !== userId);
        localStorage.setItem('all_user_profiles', JSON.stringify(updatedProfiles));
        setSavedReports(updatedProfiles);
        
        if (selectedReport && userId.includes(selectedReport.fileName)) {
          setSelectedReport(null);
          setShowReportContent(false);
        }
      } catch (error) {
        console.error('Failed to delete report:', error);
        alert('Error deleting report.');
      }
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Saved Financial Reports</h2>
              <p className="text-gray-600">View and manage your saved financial analysis reports</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {savedReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-500">Complete a financial assessment to generate your first report.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reports List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Reports ({savedReports.length})
                </h3>
                
                {savedReports.map((report, index) => (
                  <motion.div
                    key={report.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">
                            {report.firstName || 'Anonymous'}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {report.country}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(report.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewReport(report.userId)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => downloadReport(report.userId)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteReport(report.userId)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Report Viewer */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                {!showReportContent ? (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Report</h3>
                    <p className="text-gray-500">Click the view button on any report to see its contents here.</p>
                  </div>
                ) : selectedReport ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedReport.fileName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedReport.size)} • {formatDate(selectedReport.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowReportContent(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto border">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                        {selectedReport.content}
                      </pre>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => downloadReport(selectedReport.fileName.split('_')[1])}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
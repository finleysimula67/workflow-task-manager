import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Task } from '../types';

export function exportTasksCSV(tasks: Task[]) {
  const headers = ['Title', 'Status', 'Priority', 'Due Date', 'Created', 'Categories'];
  const rows = tasks.map(t => [
    t.title,
    t.status,
    t.priority,
    t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
    new Date(t.createdAt).toLocaleDateString(),
    t.categories?.map(c => c.name).join('; ') || '',
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTasksPDF(tasks: Task[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Task Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total tasks: ${tasks.length}`, 14, 36);

  const rows = tasks.map(t => [
    t.title,
    t.status,
    t.priority,
    t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-',
    t.categories?.map(c => c.name).join(', ') || '-',
  ]);

  doc.autoTable({
    startY: 42,
    head: [['Title', 'Status', 'Priority', 'Due Date', 'Categories']],
    body: rows,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [99, 102, 241] },
    alternateRowStyles: { fillColor: [245, 245, 250] },
  });

  doc.save(`tasks-${new Date().toISOString().slice(0, 10)}.pdf`);
}
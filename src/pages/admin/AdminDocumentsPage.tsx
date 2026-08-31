import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Download,
  Upload,
  Calendar,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const AdminDocumentsPage: React.FC = () => {
  const { documents, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Audit Report' | 'Legal Charter' | 'Curriculum Guide' | 'Fatwa Decree' | 'Annual Statement'>('Audit Report');
  const [description, setDescription] = useState('');

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      addToast('Missing Title', 'Please enter document title.', 'warning');
      return;
    }

    addToast('Document Uploaded', `Published "${title}" to council repository.`, 'success');
    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleDownload = (docTitle: string) => {
    addToast('Download Started', `Downloading document: "${docTitle}"`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Document Repository & Council Archives
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Official circulars, Fatwa decrees, curriculum frameworks, and quarterly audit statements.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Upload className="w-4 h-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <Card key={doc.id} className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="slate">{doc.category}</Badge>
                <span className="text-[11px] text-stone-400 font-mono">{doc.fileSize}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {doc.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-mono">Date: {doc.date}</span>
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => handleDownload(doc.title)}
                className="text-xs"
              >
                {doc.fileType}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Council Document"
        subtitle="Publish official policy or report to the digital archive."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q2 2026 Zakat Audit & Distribution Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            >
              <option value="Audit Report">Audit Report</option>
              <option value="Legal Charter">Legal Charter</option>
              <option value="Curriculum Guide">Curriculum Guide</option>
              <option value="Fatwa Decree">Fatwa Decree</option>
              <option value="Annual Statement">Annual Statement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Summary Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of the document's content and legal scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button variant="ghost" type="button" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

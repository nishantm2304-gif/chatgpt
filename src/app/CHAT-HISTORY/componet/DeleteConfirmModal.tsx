'use client';

import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  conversationTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  conversationTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-150 p-1 rounded-lg hover:bg-muted"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <Trash2 size={18} className="text-red-400" />
        </div>

        <h2 id="delete-modal-title" className="text-base font-semibold text-foreground mb-1">
          Delete conversation?
        </h2>
        <p className="text-sm text-muted-foreground mb-1">
          This will permanently delete:
        </p>
        <p className="text-sm text-foreground font-medium mb-5 bg-muted/50 px-3 py-2 rounded-lg border border-border truncate">
          {conversationTitle}
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          This action cannot be undone. All messages in this conversation will be lost.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors duration-150 active:scale-95"
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors duration-150 active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
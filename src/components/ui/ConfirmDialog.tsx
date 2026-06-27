'use client';

/**
 * ConfirmDialog component.
 * Prevents accidental actions by requiring confirmation.
 * 
 * Part of Heuristic 5: Error Prevention
 * - Design to prevent errors from happening in the first place
 */

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface ConfirmDialogProps {
  /** Title of the confirmation dialog */
  title: string;
  /** Description of what will happen */
  description: string;
  /** Text for confirm button */
  confirmText?: string;
  /** Text for cancel button */
  cancelText?: string;
  /** Whether the confirm action is destructive */
  isDestructive?: boolean;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when canceled */
  onCancel?: () => void;
  /** Whether the dialog is open (controlled mode) */
  open?: boolean;
  /** Callback when open state changes (controlled mode) */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element (for uncontrolled mode) */
  children?: React.ReactNode;
  /** Whether the dialog is disabled */
  disabled?: boolean;
}

/**
 * ConfirmDialog component.
 * Can be used in controlled or uncontrolled mode.
 */
export function ConfirmDialog({
  title,
  description,
  confirmText,
  cancelText,
  isDestructive = true,
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  children,
  disabled = false,
}: ConfirmDialogProps) {
  const t = useTranslations('common');
  
  const handleConfirm = () => {
    onConfirm();
  };
  
  const handleCancel = () => {
    onCancel?.();
  };
  
  const defaultConfirmText = t('confirm') || 'Confirm';
  const defaultCancelText = t('cancel') || 'Cancel';
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText || defaultCancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={isDestructive ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}
          >
            {confirmText || defaultConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Hook to use confirm dialog programmatically.
 * Returns open state and handlers.
 */
export function useConfirmDialog() {
  const [open, setOpen] = React.useState(false);
  
  const showConfirm = () => setOpen(true);
  const hideConfirm = () => setOpen(false);
  
  return {
    open,
    setOpen,
    showConfirm,
    hideConfirm,
  };
}

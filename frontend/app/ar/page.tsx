'use client';

import { useState } from 'react';
import { Camera, Download, AlertTriangle, ArrowLeft, MessageCircle, ClipboardList } from 'lucide-react';
import Link from 'next/link';

const EFFECTS = ['Aging (5yr)', 'Aging (10yr)', 'Skin damage', 'Eye effects'];

export default function ARPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">🪞 See What Drugs Do</h1>
            <p className="text-sm text-jeewan-muted mt-1">AR face simulation for educational awareness.</p>
          </div>
          <span className="text-[10px] bg-jeewan-warn-light text-jeewan-warn px-2.5 py-1 rounded-full font-bold">Camera Required</span>
        </div>

        {/* Camera Preview */}
        <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden mb-4 relative" style={{ height: '320px' }}>
          {!isCameraActive ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
              <Camera className="w-12 h-12" />
              <p className="text-sm">Camera inactive</p>
              <button
                onClick={() => setIsCameraActive(true)}
                className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl text-white/80 text-sm hover:bg-white/15 transition"
              >
                Allow camera access to begin
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/60 text-sm text-center px-6">
                {activeEffect ? `AR effect: ${activeEffect} — simulation active` : 'Camera active — choose an effect below'}
              </p>
              {activeEffect && <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 mix-blend-multiply" />}
            </div>
          )}
        </div>

        {/* Effect Selector */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider mb-2">Choose effect to simulate</p>
          <div className="flex gap-2 flex-wrap">
            {EFFECTS.map((effect) => (
              <button
                key={effect}
                onClick={() => setActiveEffect(activeEffect === effect ? null : effect)}
                disabled={!isCameraActive}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeEffect === effect
                    ? 'bg-jeewan-warn text-white'
                    : 'border border-border text-jeewan-muted hover:border-jeewan-warn hover:text-jeewan-warn disabled:opacity-40'
                }`}
              >
                {effect}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => { setIsCameraActive(!isCameraActive); setActiveEffect(null); }}
            className={`py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
              isCameraActive ? 'bg-jeewan-warn text-white' : 'bg-jeewan-calm text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            {isCameraActive ? 'Stop' : 'Start Camera'}
          </button>
          <button
            disabled={!isCameraActive}
            className="py-3 rounded-xl font-bold text-sm bg-jeewan-calm text-white transition disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Capture
          </button>
        </div>

        {/* Disclaimer - Always visible */}
        <div className="bg-jeewan-warn-light border border-jeewan-warn/30 rounded-xl p-4">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-jeewan-warn flex-shrink-0 mt-0.5" />
            <p className="text-xs text-jeewan-ink2 dark:text-jeewan-muted">
              <strong>Educational only.</strong> This simulation shows real documented consequences of long-term drug abuse. Effects are artistic representations.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Link href="/" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-bold transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <Link href="/quiz" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-bold transition">
            <ClipboardList className="w-3.5 h-3.5" /> Take Quiz
          </Link>
          <Link href="/chat" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-bold transition">
            <MessageCircle className="w-3.5 h-3.5" /> Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

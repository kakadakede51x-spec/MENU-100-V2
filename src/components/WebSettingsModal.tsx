import React, { useState } from 'react';
import { ThemeMode, DatabaseConfig } from '../types';
import { dbService } from '../services/dbService';
import { 
  X, 
  Moon, 
  Sun, 
  Database, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Shield, 
  Sparkles,
  RefreshCw,
  Server
} from 'lucide-react';

interface WebSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  dbConfig: DatabaseConfig;
  onConfigUpdated: (newConfig: DatabaseConfig) => void;
}

export const WebSettingsModal: React.FC<WebSettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
  dbConfig,
  onConfigUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'database'>('theme');
  const [supabaseUrl, setSupabaseUrl] = useState(dbConfig.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(dbConfig.supabaseAnonKey || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSaveDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setStatusMessage(null);

    const res = await dbService.setSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    setIsConnecting(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      onConfigUpdated(dbService.getConfig());
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleCopySchemaSql = () => {
    const sql = `-- menu100 Supabase Schema
CREATE TABLE IF NOT EXISTS foods (id TEXT PRIMARY KEY, name TEXT NOT NULL, name_en TEXT, category TEXT NOT NULL, origin TEXT, country_code TEXT, image TEXT, description TEXT, tags TEXT[], regular_votes BIGINT DEFAULT 0, royal_votes BIGINT DEFAULT 0, rank INT, previous_rank INT, is_global_top20 BOOLEAN, calories INT, flavor_profile TEXT[]);
CREATE TABLE IF NOT EXISTS restaurants (id TEXT PRIMARY KEY, name TEXT NOT NULL, province_id TEXT, province_name TEXT, region TEXT, address TEXT, verified_stars INT, menu100_score INT, is_sme BOOLEAN, is_street_food BOOLEAN, league_tier TEXT, image TEXT, cuisine TEXT, price_range TEXT, highlight_dishes TEXT[], open_hours TEXT, phone TEXT, review_count INT, description TEXT, rank_in_province INT);
CREATE TABLE IF NOT EXISTS merch (id TEXT PRIMARY KEY, name TEXT NOT NULL, name_en TEXT, category TEXT, price NUMERIC, royal_discount_percent INT, image TEXT, description TEXT, sizes TEXT[], colors TEXT[], in_stock BOOLEAN, stock_count INT, featured BOOLEAN);
CREATE TABLE IF NOT EXISTS user_accounts (id TEXT PRIMARY KEY, username TEXT UNIQUE, password TEXT, display_name TEXT, avatar TEXT, is_royal BOOLEAN, role TEXT, vote_count INT, total_spent NUMERIC, created_at TIMESTAMP WITH TIME ZONE DEFAULT now());
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, customer_name TEXT, customer_username TEXT, items JSONB, total_amount NUMERIC, is_royal_discount_applied BOOLEAN, status TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT now());`;
    
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                ตั้งค่าเว็บไซต์ (Website Settings)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ปรับธีมแสดงผล และการเชื่อมต่อฐานข้อมูลภายนอก (Database)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'theme'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ธีมและหน้าตาเว็บ (Theme)</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'database'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>ฐานข้อมูลแยก (Supabase / DB)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'theme' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  เลือกโทนสีการแสดงผล
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  เปลี่ยนบรรยากาศของเว็บไซต์ menu100 ตามความชอบของคุณ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dark Theme Card */}
                <div
                  id="theme-option-dark"
                  onClick={() => onSelectTheme('dark')}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all relative overflow-hidden ${
                    theme === 'dark'
                      ? 'border-amber-500 bg-slate-950 text-white shadow-md'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Moon className="w-5 h-5" />
                    </div>
                    {theme === 'dark' && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> กำลังใช้งาน
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white mb-0.5">
                    Dark Luxury (มืด สุขุม ดำเข้ม)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    พื้นหลังดำเข้มสนิท ขอบทอง สไตล์ไฟน์ไดนิ่งพรีเมียม สบายสายตา
                  </p>
                </div>

                {/* Light Theme Card */}
                <div
                  id="theme-option-light"
                  onClick={() => onSelectTheme('light')}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all relative overflow-hidden ${
                    theme === 'light'
                      ? 'border-orange-500 bg-white text-slate-900 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Sun className="w-5 h-5" />
                    </div>
                    {theme === 'light' && (
                      <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> กำลังใช้งาน
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-0.5">
                    Clean Light (สีขาว สว่างสดใส)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    สว่าง สะอาดตา เน้นรูปภาพอาหารคมชัด สดใส ชวนน่ารับประทาน
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                💡 <strong>เคล็ดลับ:</strong> ระบบจะจดจำธีมที่คุณเลือกไว้โดยอัตโนมัติ ไม่ว่าจะเปิดหน้าเว็บขึ้นมาใหม่เมื่อไหร่
              </div>
            </div>
          ) : (
            /* Database Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    สถานะการเชื่อมต่อฐานข้อมูล
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    เชื่อมต่อฐานข้อมูล Supabase ภายนอก หรือใช้ Local Persistent Storage
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  dbConfig.provider === 'supabase' && dbConfig.isConnected
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  <Server className="w-3.5 h-3.5" />
                  {dbConfig.provider === 'supabase' && dbConfig.isConnected ? 'Supabase Connected' : 'Local Persistent DB'}
                </span>
              </div>

              {statusMessage && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  statusMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveDatabase} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Supabase Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                    <span>{supabaseUrl ? 'บันทึก & เชื่อมต่อ Supabase' : 'สลับกลับเป็น Local Database'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySchemaSql}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    title="คัดลอกคำสั่ง SQL ไปวางใน Supabase SQL Editor"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSql ? 'คัดลอกแล้ว!' : 'คัดลอก SQL Schema'}</span>
                  </button>
                </div>
              </form>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>ไฟล์ SQL Schema พร้อมใช้งาน:</span>
                </div>
                <p>
                  โปรเจกต์มีไฟล์ <code>supabase-schema.sql</code> อยู่ที่ root directory สามารถนำไปรันใน Supabase เพื่อสร้างตาราง foods, restaurants, merch, user_accounts, และ orders ได้ทันที!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

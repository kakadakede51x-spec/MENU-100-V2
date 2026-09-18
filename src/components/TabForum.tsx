import React, { useState } from 'react';
import { ForumThread, ForumComment, UserProfile, RoyalSticker } from '../types';
import { FORUM_THREADS, ROYAL_STICKERS } from '../data/mockData';
import { 
  MessageSquare, 
  Plus, 
  Crown, 
  Heart, 
  Sparkles, 
  Send, 
  Pin, 
  Flame, 
  Smile, 
  Tag, 
  CheckCircle,
  X,
  MessageCircle,
  ThumbsUp,
  UserCheck
} from 'lucide-react';

interface TabForumProps {
  user: UserProfile;
  isAuthenticated: boolean;
  onRequireAuth: (reason: 'forum') => void;
}

export const TabForum: React.FC<TabForumProps> = ({ 
  user,
  isAuthenticated,
  onRequireAuth 
}) => {
  const [threads, setThreads] = useState<ForumThread[]>(FORUM_THREADS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  
  // New thread state
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'noodle' | 'street' | 'finedining' | 'dessert' | 'cooking' | 'shabu'>('street');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // Comment box state
  const [commentText, setCommentText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  const forumRooms = [
    { id: 'all', name: 'รวมทุกกระทู้', icon: '💬' },
    { id: 'street', name: 'ห้องสตรีทฟู้ด & ร้านลับ', icon: '🍢' },
    { id: 'noodle', name: 'ห้องก๋วยเตี๋ยว & เส้น', icon: '🍜' },
    { id: 'finedining', name: 'ห้องไฟน์ไดน์นิ่ง & รีวิว', icon: '🥂' },
    { id: 'dessert', name: 'ห้องคาเฟ่ & ขนมหวาน', icon: '🍰' },
    { id: 'cooking', name: 'ห้องทำอาหาร & สูตรลับ', icon: '🍳' },
  ];

  const filteredThreads = threads.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleLikeThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onRequireAuth('forum');
      return;
    }
    setThreads(threads.map((t) => (t.id === threadId ? { ...t, likes: t.likes + 1 } : t)));
    if (activeThread?.id === threadId) {
      setActiveThread({ ...activeThread, likes: activeThread.likes + 1 });
    }
  };

  const handleStartCreateThread = () => {
    if (!isAuthenticated) {
      onRequireAuth('forum');
      return;
    }
    setIsCreatingThread(true);
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onRequireAuth('forum');
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThreadItem: ForumThread = {
      id: `thread-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      authorName: user.name,
      authorAvatar: user.avatar,
      isRoyalMember: user.isRoyal,
      content: newContent,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      likes: 1,
      views: 12,
      createdAt: 'เมื่อสักครู่',
      comments: [],
    };

    setThreads([newThreadItem, ...threads]);
    setIsCreatingThread(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setActiveThread(newThreadItem);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onRequireAuth('forum');
      return;
    }
    if (!commentText.trim() && !selectedSticker) return;
    if (!activeThread) return;

    const newComment: ForumComment = {
      id: `comment-${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      isRoyalMember: user.isRoyal,
      royalBadgeTitle: user.isRoyal ? 'Royal Foodie Member 👑' : undefined,
      content: commentText,
      stickerUrl: selectedSticker || undefined,
      likes: 0,
      createdAt: 'เมื่อสักครู่',
    };

    const updatedThread = {
      ...activeThread,
      comments: [...activeThread.comments, newComment],
    };

    setActiveThread(updatedThread);
    setThreads(threads.map((t) => (t.id === activeThread.id ? updatedThread : t)));
    setCommentText('');
    setSelectedSticker(null);
    setShowStickerPicker(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>menu100 FOODIE COMMUNITY FORUM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              กระทู้ห้องสนทนานักชิม <span className="text-amber-400">ทั่วประเทศ</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              พื้นที่ถกประเด็นรสชาติ เถียงเรื่องผัดกะเพรา แลกเปลี่ยนพิกัดร้านลับริมทาง และรีวิวเมนูเด็ด สมาชิก <strong className="text-amber-400">Royal Member 👑</strong> สามารถใช้สติกเกอร์พิเศษและมีตราประทับทองคำการันตีความเห็น
            </p>
          </div>

          <button
            id="forum-create-topic-btn"
            onClick={handleStartCreateThread}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/30 flex items-center gap-2 shrink-0 transition-transform hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>เปิดกระทู้ใหม่ / ชวนคุย</span>
          </button>
        </div>
      </section>

      {/* Forum Rooms Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {forumRooms.map((room) => (
          <button
            key={room.id}
            id={`forum-room-${room.id}`}
            onClick={() => {
              setSelectedCategory(room.id);
              setActiveThread(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategory === room.id && !activeThread
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{room.icon}</span>
            <span>{room.name}</span>
          </button>
        ))}
      </div>

      {/* Thread Content View (If a thread is clicked) */}
      {activeThread ? (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-200">
          {/* Thread Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <button
              id="forum-back-to-list-btn"
              onClick={() => setActiveThread(null)}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline mb-3 inline-block"
            >
              ← กลับสู่รายการกระทู้ทั้งหมด
            </button>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {activeThread.isPinned && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Pin className="w-3 h-3 fill-amber-700 text-amber-700" />
                  <span>กระทู้ปักหมุด</span>
                </span>
              )}
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {forumRooms.find((r) => r.id === activeThread.category)?.name || activeThread.category}
              </span>
              <span className="text-xs text-slate-400">{activeThread.createdAt}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {activeThread.title}
            </h2>

            {/* Author info */}
            <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeThread.authorAvatar}
                  alt={activeThread.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {activeThread.authorName}
                    </span>
                    {activeThread.isRoyalMember && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Crown className="w-3 h-3 text-amber-600" />
                        <span>Royal Member</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">นักชิมระดับยอดเยี่ยม</span>
                </div>
              </div>

              <button
                id="forum-like-thread-active-btn"
                onClick={(e) => handleLikeThread(activeThread.id, e)}
                className="flex items-center gap-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{activeThread.likes} ถูกใจ</span>
              </button>
            </div>
          </div>

          {/* Thread Body */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {activeThread.content}
            </p>

            {activeThread.image && (
              <div className="rounded-2xl overflow-hidden max-h-96 border border-slate-200">
                <img
                  src={activeThread.image}
                  alt="Post attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeThread.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-orange-600" />
              <span>ความคิดเห็นทั้งหมด ({activeThread.comments.length})</span>
            </h4>

            {activeThread.comments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                ยังไม่มีความคิดเห็น เป็นคนแรกที่มาร่วมถกประเด็นนี้กันเลย!
              </p>
            ) : (
              <div className="space-y-3">
                {activeThread.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      comment.isRoyalMember
                        ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {comment.authorName}
                            </span>
                            {comment.isRoyalMember && (
                              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
                                <Crown className="w-3 h-3 fill-amber-950" />
                                <span>{comment.royalBadgeTitle || 'Royal Member'}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                        </div>
                      </div>

                      {comment.stickerUrl && (
                        <div className="bg-white/80 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded-xl text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1 shadow-2xs">
                          <span>{comment.stickerUrl}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-2.5 pl-10 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="bg-white dark:bg-[#0c101b] p-3 rounded-2xl border border-slate-300 dark:border-slate-800 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all space-y-2">
                <textarea
                  id="forum-comment-textarea"
                  rows={2}
                  placeholder={`ร่วมแสดงความคิดเห็นในฐานะ ${user.name}${user.isRoyal ? ' (Royal Member 👑)' : ''}...`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent resize-none focus:outline-none"
                />

                {/* Selected sticker preview */}
                {selectedSticker && (
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 px-3 py-1 rounded-xl text-xs text-amber-900 dark:text-amber-300 w-fit">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-bold">สติกเกอร์ที่เลือก: {selectedSticker}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSticker(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {/* Sticker button for Royal Members */}
                  <div className="relative">
                    {user.isRoyal ? (
                      <button
                        id="forum-sticker-picker-toggle"
                        type="button"
                        onClick={() => setShowStickerPicker(!showStickerPicker)}
                        className="flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 px-2.5 py-1 rounded-xl transition-colors border border-amber-300 dark:border-amber-800/60"
                      >
                        <Smile className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>สติกเกอร์ VIP Royal 👑</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        <span>Royal Member ใช้สติกเกอร์พิเศษได้</span>
                      </div>
                    )}

                    {/* Sticker Popover */}
                    {showStickerPicker && user.isRoyal && (
                      <div className="absolute bottom-10 left-0 bg-white dark:bg-[#111624] border border-amber-300 dark:border-amber-800 shadow-xl rounded-2xl p-3 w-64 z-20 space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                          <span>คลังสติกเกอร์ Royal VIP</span>
                          <button onClick={() => setShowStickerPicker(false)}>✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {ROYAL_STICKERS.map((stk) => (
                            <button
                              key={stk.id}
                              type="button"
                              onClick={() => {
                                setSelectedSticker(`${stk.emoji} ${stk.name}`);
                                setShowStickerPicker(false);
                              }}
                              className="p-1.5 rounded-lg text-left hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                            >
                              <span className="text-base">{stk.emoji}</span>
                              <span className="truncate">{stk.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    id="forum-submit-comment-btn"
                    type="submit"
                    className="py-1.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ส่งความคิดเห็น</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      ) : (
        /* Threads List View */
        <section className="space-y-3">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setActiveThread(thread)}
              className="bg-white dark:bg-[#0c101b] rounded-3xl p-5 border border-slate-200 dark:border-slate-800/90 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {thread.isPinned && (
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-300 dark:border-amber-800/60">
                        <Pin className="w-3 h-3 fill-amber-700 dark:fill-amber-400 text-amber-700 dark:text-amber-400" />
                        <span>ปักหมุด</span>
                      </span>
                    )}
                    <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-800/50">
                      {forumRooms.find((r) => r.id === thread.category)?.name || thread.category}
                    </span>
                    <span className="text-[11px] text-slate-400">• {thread.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {thread.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {thread.content}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={thread.authorAvatar}
                        alt={thread.authorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{thread.authorName}</span>
                      {thread.isRoyalMember && (
                        <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      )}
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {thread.comments.length} ตอบ
                    </span>
                    <span>•</span>
                    <span>{thread.views.toLocaleString()} ผู้เข้าชม</span>
                  </div>
                </div>

                <button
                  id={`forum-like-btn-${thread.id}`}
                  onClick={(e) => handleLikeThread(thread.id, e)}
                  className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>{thread.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* New Topic Modal */}
      {isCreatingThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white dark:bg-[#0e121e] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                <h3 className="text-xl font-bold">สร้างกระทู้เปิดประเด็นใหม่</h3>
              </div>
              <button
                onClick={() => setIsCreatingThread(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  หัวข้อกระทู้ <span className="text-red-500">*</span>
                </label>
                <input
                  id="forum-new-thread-title"
                  type="text"
                  required
                  placeholder="เช่น แนะนำร้านกะเพราเนื้อโคขุนรสจัด หรือ ร้านเด็ดในหาดใหญ่"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141928] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  เลือกห้องหมวดหมู่อาหาร
                </label>
                <select
                  id="forum-new-thread-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141928] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="street">🍢 ห้องสตรีทฟู้ด & ร้านลับ</option>
                  <option value="noodle">🍜 ห้องก๋วยเตี๋ยว & เส้น</option>
                  <option value="finedining">🥂 ห้องไฟน์ไดน์นิ่ง & รีวิว</option>
                  <option value="dessert">🍰 ห้องคาเฟ่ & ขนมหวาน</option>
                  <option value="cooking">🍳 ห้องทำอาหาร & สูตรลับ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  เนื้อหากระทู้ / รีวิว <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="forum-new-thread-content"
                  rows={4}
                  required
                  placeholder="บอกเล่าความอร่อย แลกเปลี่ยนความคิดเห็น หรือแชร์ประสบการณ์รสชาติ..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141928] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  แท็กคำค้นหา (คั่นด้วยจุลภาค)
                </label>
                <input
                  id="forum-new-thread-tags"
                  type="text"
                  placeholder="เช่น ก๋วยเตี๋ยว, กรุงเทพ, น้ำซุปหอม"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141928] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingThread(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  id="forum-submit-new-thread-btn"
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/30"
                >
                  โพสต์กระทู้ทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

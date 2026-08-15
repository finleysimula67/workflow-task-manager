import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamApi, type Team, type TeamMember } from '../api/teamApi';
import toast from 'react-hot-toast';
import { Users, ArrowLeft, Plus, X, Trash2, Mail, User as UserIcon, Crown, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');

  useEffect(() => { if (id) loadData(); }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamRes, membersRes] = await Promise.all([
        teamApi.getTeam(Number(id)),
        teamApi.getMembers(Number(id)),
      ]);
      if (teamRes.success) setTeam(teamRes.data);
      if (membersRes.success) setMembers(membersRes.data);
    } catch { toast.error('Failed to load team'); navigate('/teams'); }
    finally { setLoading(false); }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      const res = await teamApi.addMember(Number(id), { email: inviteEmail, role: inviteRole });
      if (res.success) { toast.success('Member added!'); setShowInvite(false); setInviteEmail(''); loadData(); }
    } catch (err: any) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('not found') || msg.includes('User not found')) {
        toast.error('No user found with this email. They need to register first.');
      } else {
        toast.error(msg || 'Failed to add member');
      }
    }
  };

  const handleRemove = async (memberId: number) => {
    if (!confirm('Remove this member?')) return;
    try {
      await teamApi.removeMember(Number(id), memberId);
      toast.success('Member removed'); loadData();
    } catch { toast.error('Failed to remove member'); }
  };

  const roleIcon = (role: string) => {
    if (role === 'OWNER') return <Crown size={16} className="text-amber-400" />;
    if (role === 'ADMIN') return <Shield size={16} className="text-primary-400" />;
    return <UserIcon size={16} className="text-slate-400" />;
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition";

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-white/10 border-t-primary-400 rounded-full animate-spin" /></div>;
  if (!team) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-2xl mx-auto">
      <motion.button whileHover={{ x: -2 }} onClick={() => navigate('/teams')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition">
        <ArrowLeft size={16} /> Back to Teams
      </motion.button>

      <div className="glass-panel p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">{team.name}</h1>
            {team.description && <p className="text-sm text-slate-500 mt-1 leading-relaxed">{team.description}</p>}
            <p className="text-xs text-slate-500 mt-3">Created by {team.ownerName} &middot; {team.memberCount} members</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <Users size={22} className="text-primary-400" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Members ({members.length})</h2>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-500/20">
            <Plus size={16} /> Invite
          </motion.button>
        </div>
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }} className="space-y-1">
          {members.map((m) => (
            <motion.div key={m.id} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
              className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-white/[0.02] transition group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-400/10 flex items-center justify-center border border-white/[0.06]">
                <span className="text-white text-sm font-bold">{m.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{m.username}</p>
                  {roleIcon(m.role)}
                  <span className="text-xs text-slate-500">{m.role}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{m.email}</p>
              </div>
              {m.role !== 'OWNER' && (
                <button onClick={() => handleRemove(m.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100">
                  <Trash2 size={15} />
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Invite Member</h2>
                <button onClick={() => setShowInvite(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"><X size={18} /></button>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="email" placeholder="member@example.com" value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className={`${inputCls} pl-10`} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Role</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                    className={inputCls}>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition text-sm">Invite</button>
                  <button type="button" onClick={() => setShowInvite(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition text-sm">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default TeamDetail;

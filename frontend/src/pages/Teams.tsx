import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamApi, type Team } from '../api/teamApi';
import toast from 'react-hot-toast';
import { Users, Plus, X, Trash2, Edit3, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<Team | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { loadTeams(); }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getTeams();
      if (res.success) setTeams(res.data);
    } catch { toast.error('Failed to load teams'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Team name is required'); return; }
    try {
      const res = await teamApi.createTeam({ name: form.name, description: form.description });
      if (res.success) { toast.success('Team created!'); setShowCreate(false); setForm({ name: '', description: '' }); loadTeams(); }
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to create team'); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEdit || !form.name.trim()) return;
    try {
      await teamApi.updateTeam(showEdit.id, { name: form.name, description: form.description });
      toast.success('Team updated!'); setShowEdit(null); loadTeams();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to update team'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this team?')) return;
    try {
      await teamApi.deleteTeam(id);
      toast.success('Team deleted'); loadTeams();
    } catch { toast.error('Failed to delete team'); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition";

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-white/10 border-t-primary-400 rounded-full animate-spin" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Teams</h1>
          <p className="text-slate-500 mt-1 text-sm">{teams.length} team{teams.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setForm({ name: '', description: '' }); setShowCreate(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-500/20">
          <Plus size={18} /> New Team
        </motion.button>
      </div>

      {teams.length === 0 ? (
        <div className="glass-panel py-16 text-center">
          <Users size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-base font-semibold text-white mb-1">No teams yet</h3>
          <p className="text-sm text-slate-500 mb-6">Create your first team to collaborate</p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-500/20">
            <Plus size={16} /> Create Team
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {teams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className="glass-panel-hover p-5 group cursor-pointer"
                onClick={() => navigate(`/teams/${team.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                    <Users size={20} className="text-primary-400" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setForm({ name: team.name, description: team.description || '' }); setShowEdit(team); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(team.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{team.name}</h3>
                {team.description && <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">{team.description}</p>}
                <div className="flex items-center gap-2 text-sm text-slate-400 pt-3 border-t border-white/[0.04]">
                  <UserPlus size={14} className="shrink-0" /> {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Create Team</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"><X size={18} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <input type="text" placeholder="Team name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputCls} required />
                <textarea placeholder="Description (optional)" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={`${inputCls} h-24 resize-none`} />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition text-sm">Create</button>
                  <button type="button" onClick={() => setShowCreate(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition text-sm">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Edit Team</h2>
                <button onClick={() => setShowEdit(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"><X size={18} /></button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input type="text" placeholder="Team name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputCls} required />
                <textarea placeholder="Description (optional)" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={`${inputCls} h-24 resize-none`} />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition text-sm">Save</button>
                  <button type="button" onClick={() => setShowEdit(null)}
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

export default Teams;

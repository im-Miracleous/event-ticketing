import React, { useState } from 'react';
import { Search, Edit2, Trash2, Eye, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

// Kamus Lokal
// - EventStatus: Tipe data status event
// - events: Array state yang menampung daftar mock event
// - viewMode: State transisi 'list' (tabel) atau 'form' (create/edit)
// - editingId: Menampung ID event yang sedang diedit (null jika create)
// - formData: State input formulir (Nama, Deskripsi, Kategori, Lokasi)
// - tickets: Dynamic Array untuk Manajemen Tiket (Nama, Harga, Kuota)
// - realTimeSummary: Helper untuk menghitung total kuota tiket secara dinamis

type EventStatus = 'Published' | 'Draft' | 'Past';
interface TicketType { id: string; name: string; price: number; quota: number; }

export default function EventManagement() {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [sysMessage, setSysMessage] = useState('');
    
    // State Formulir Event
    const [events, setEvents] = useState([
        { id: '1', title: 'Tech Innovation Summit 2026', date: '2026-04-15', location: 'Jakarta Convention Center', status: 'Published' as EventStatus },
        { id: '2', title: 'Indie Music Festival', date: '2026-05-20', location: 'GBK Senayan', status: 'Published' as EventStatus },
        { id: '3', title: 'Digital Marketing Workshop', date: '2026-06-10', location: 'Bandung', status: 'Draft' as EventStatus },
    ]);

    const [formData, setFormData] = useState({ title: '', description: '', category: '', location: '', date: '' });
    const [tickets, setTickets] = useState<TicketType[]>([{ id: 'T1', name: 'Regular', price: 150000, quota: 100 }]);

    const totalQuota = tickets.reduce((acc, curr) => acc + (Number(curr.quota) || 0), 0);

    const handleAddTicket = () => {
        setTickets([...tickets, { id: Math.random().toString(), name: '', price: 0, quota: 0 }]);
    };

    const handleRemoveTicket = (id: string) => {
        setTickets(tickets.filter(t => t.id !== id));
    };

    const handleTicketChange = (id: string, field: keyof TicketType, value: any) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const StatusBadge = ({ status }: { status: EventStatus }) => {
        const styles = {
            Published: 'bg-green-100 text-green-700 border-green-200',
            Draft: 'bg-gray-100 text-slate-300 border-white/10',
            Past: 'bg-primary-100 text-primary-700 border-primary-200'
        };
        const icons = { Published: <CheckCircle className="w-3 h-3 mr-1"/>, Draft: <Clock className="w-3 h-3 mr-1"/>, Past: <Calendar className="w-3 h-3 mr-1"/> };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border inline-flex items-center ${styles[status]}`}>
                {icons[status]}{status}
            </span>
        );
    };

    const saveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        setSysMessage('Sistem sedang memproses penyimpanan data event...');
        setTimeout(() => {
            setViewMode('list');
            setSysMessage('Data berhasil diperbarui.');
            setTimeout(() => setSysMessage(''), 3000);
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {sysMessage && (
                <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2"></span>
                    {sysMessage}
                </div>
            )}

            {viewMode === 'list' && (
                <div className="bg-navy-900 border border-white/5 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-lg font-bold text-white">Daftar Event</h2>
                        <button onClick={() => setViewMode('form')} className="btn-primary px-4 py-2 text-sm">
                            + Buat Event Baru
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4">Nama Event</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Lokasi</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{event.title}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm whitespace-pre-wrap">{event.date}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm"><MapPin className="w-4 h-4 inline mr-1 text-gray-400"/> {event.location}</td>
                                        <td className="px-6 py-4"><StatusBadge status={event.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setViewMode('form')} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewMode === 'form' && (
                <form onSubmit={saveEvent} className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Manajemen Event & Tiket</h2>
                        <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:text-white">Batal</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulir Utama */}
                        <div className="lg:col-span-2 space-y-6 bg-navy-900 p-6 rounded-2xl border border-white/5 shadow-sm">
                            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 mb-4">Informasi Dasar</h3>
                            
                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-1 block">Nama Event</label>
                                <input type="text" className="w-full text-sm py-2 px-3 border border-white/10 rounded-lg text-white bg-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="Ketik nama event..." required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-1 block">Kategori</label>
                                    <select className="w-full text-sm py-2 px-3 border border-white/10 rounded-lg text-white bg-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"><option>Pilih Kategori</option><option>Musik</option><option>Workshop</option></select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-1 block">Tanggal Diselenggarakan</label>
                                    <input type="date" className="w-full text-sm py-2 px-3 border border-white/10 rounded-lg text-white bg-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" required />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-1 block">Lokasi Lengkap</label>
                                <input type="text" className="w-full text-sm py-2 px-3 border border-white/10 rounded-lg text-white bg-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="Gedung, Jalan, Kota..." required />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-1 block">Deskripsi Lengkap</label>
                                <textarea className="w-full text-sm py-2 px-3 border border-white/10 rounded-lg text-white bg-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-h-[120px]" placeholder="Ceritakan detail event ini..." required></textarea>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-1 block">Unggah Poster</label>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                    <span className="text-sm text-slate-500">Klik untuk unggah gambar (PNG, JPG)</span>
                                </div>
                            </div>
                        </div>

                        {/* Manajemen Tiket (Dynamic Row) */}
                        <div className="space-y-6 bg-navy-900 p-6 rounded-2xl border border-white/5 shadow-sm self-start">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                                <h3 className="text-lg font-bold text-white">Tipe Tiket</h3>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block">Total Kuota</span>
                                    <span className="font-black text-primary-600 text-lg">{totalQuota}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {tickets.map((t, index) => (
                                    <div key={t.id} className="p-4 border border-white/5 bg-gray-50/50 rounded-xl space-y-3 relative group">
                                        {index > 0 && (
                                            <button type="button" onClick={() => handleRemoveTicket(t.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500">Nama Tipe</label>
                                            <input type="text" value={t.name} onChange={(e) => handleTicketChange(t.id, 'name', e.target.value)} className="w-full text-sm py-1.5 px-3 border border-white/10 rounded text-white" placeholder="e.g. VIP" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500">Harga (Rp)</label>
                                                <input type="number" value={t.price} onChange={(e) => handleTicketChange(t.id, 'price', e.target.value)} className="w-full text-sm py-1.5 px-3 border border-white/10 rounded text-white" placeholder="0" required />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500">Kuota</label>
                                                <input type="number" value={t.quota} onChange={(e) => handleTicketChange(t.id, 'quota', e.target.value)} className="w-full text-sm py-1.5 px-3 border border-white/10 rounded text-white" placeholder="0" required />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="button" onClick={handleAddTicket} className="w-full py-2.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-primary-200 border-dashed">
                                + Tambah Tipe Tiket
                            </button>

                            <hr className="border-white/5" />
                            <button type="submit" className="btn-primary w-full py-3">Simpan Publish Draf</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

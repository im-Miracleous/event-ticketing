import React, { useState } from 'react';
import { QrCode, Search, CheckCircle, AlertTriangle, XCircle, Users } from 'lucide-react';

// Kamus Lokal
// - scanStatus: Status dari hasil validasi (idle, success, warning, error)
// - scannedData: Objek data peserta jika validasi berhasil (nama, tiket)
// - bookingCode: State input manual untuk kode tiket
// - attendance: Objek statistik kehadiran (hadir, total)

type ScanStatus = 'idle' | 'success' | 'warning' | 'error';
interface ValidationData { name: string; ticket: string; message: string; }

export default function ValidationCheckIn() {
    const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
    const [scannedData, setScannedData] = useState<ValidationData | null>(null);
    const [bookingCode, setBookingCode] = useState('');
    const [attendance, setAttendance] = useState({ present: 450, total: 500 });
    const [sysMessage, setSysMessage] = useState('');

    const handleSimulateScan = (type: ScanStatus) => {
        setSysMessage('Sistem sedang memproses validasi tiket...');
        setScanStatus('idle');
        setScannedData(null);
        
        setTimeout(() => {
            setScanStatus(type);
            setSysMessage('');
            if (type === 'success') {
                setScannedData({ name: 'Alex Johnson', ticket: 'VIP Access - TIX-001', message: 'Check-in Berhasil' });
                setAttendance(prev => ({ ...prev, present: prev.present + 1 }));
            } else if (type === 'warning') {
                setScannedData({ name: 'Budi Santoso', ticket: 'Regular - TIX-042', message: 'Tiket sudah digunakan pada 09:12 WIB' });
            } else if (type === 'error') {
                setScannedData({ name: '-', ticket: '-', message: 'Kode tiket tidak ditemukan' });
            }
        }, 800);
    };

    const handleManualCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingCode) return;
        // Mock random success/error
        const types: ScanStatus[] = ['success', 'warning', 'error'];
        handleSimulateScan(types[Math.floor(Math.random() * types.length)]);
    };

    return (
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
            {/* Attendance Tracker */}
            <div className="bg-primary-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-primary-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-primary-200" />
                    <span className="text-sm font-medium text-primary-100">Statistik Kehadiran</span>
                </div>
                <div className="text-4xl font-black">{attendance.present} <span className="text-2xl text-primary-300">/ {attendance.total}</span></div>
                <div className="w-full bg-primary-900/40 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-navy-900 h-full rounded-full transition-all duration-500" style={{ width: `${(attendance.present / attendance.total) * 100}%` }} />
                </div>
            </div>

            {sysMessage && (
                <div className="text-center text-sm font-medium text-slate-500 animate-pulse bg-gray-100 py-2 rounded-lg">
                    {sysMessage}
                </div>
            )}

            {/* Validation Logic UI */}
            {scanStatus !== 'idle' && (
                <div className={`p-6 rounded-2xl border flex flex-col items-center text-center shadow-sm animate-in zoom-in-95 duration-300 ${
                    scanStatus === 'success' ? 'bg-green-50 border-green-200' :
                    scanStatus === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                }`}>
                    {scanStatus === 'success' && <CheckCircle className="w-16 h-16 text-green-500 mb-4" />}
                    {scanStatus === 'warning' && <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />}
                    {scanStatus === 'error' && <XCircle className="w-16 h-16 text-red-500 mb-4" />}
                    
                    <h3 className={`text-lg font-black mb-1 ${
                        scanStatus === 'success' ? 'text-green-800' :
                        scanStatus === 'warning' ? 'text-yellow-800' : 'text-red-800'
                    }`}>
                        {scannedData?.message}
                    </h3>
                    
                    {scanStatus !== 'error' && (
                        <div className="space-y-1 mt-3">
                            <p className="text-sm font-medium text-slate-300">{scannedData?.name}</p>
                            <span className="text-xs px-2 py-1 bg-navy-900 border border-white/10 rounded-md font-bold text-slate-400 block w-max mx-auto shadow-sm">
                                {scannedData?.ticket}
                            </span>
                        </div>
                    )}

                    <button onClick={() => setScanStatus('idle')} className="mt-6 text-sm font-semibold underline text-slate-500 hover:text-white">
                        Scan tiket selanjutnya
                    </button>
                </div>
            )}

            {/* Scanning Interface */}
            {scanStatus === 'idle' && (
                <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 shadow-sm text-center">
                    <div className="w-48 h-48 mx-auto border-2 border-dashed border-primary-200 rounded-2xl flex flex-col items-center justify-center bg-primary-50/50 mb-6 relative overflow-hidden group cursor-pointer hover:border-primary-400 transition-colors">
                        <QrCode className="w-12 h-12 text-primary-300 group-hover:text-primary-500 transition-colors mb-2" />
                        <span className="text-sm font-medium text-primary-400 group-hover:text-primary-600">Scan QR Code</span>
                        
                        {/* Scanner Laser Simulation */}
                        <div className="absolute top-0 w-full h-1 bg-primary-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                    </div>

                    <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-4">Atau input manual</p>
                    
                    <form onSubmit={handleManualCheckIn} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="M-TIX-XXXXX" 
                            value={bookingCode}
                            onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-24 py-3.5 text-sm font-bold border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all uppercase placeholder:font-normal"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">
                            Cek
                        </button>
                    </form>

                    {/* Developer Mock Buttons untuk simulasi */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-xs text-gray-400 mb-3 text-left">Simulasi Scanner (DEV):</p>
                        <div className="flex gap-2 justify-center">
                            <button onClick={() => handleSimulateScan('success')} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">Test Success</button>
                            <button onClick={() => handleSimulateScan('warning')} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-lg border border-yellow-200">Test Used</button>
                            <button onClick={() => handleSimulateScan('error')} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200">Test Invalid</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

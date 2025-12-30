
import React from 'react';
import { Copyright, ArrowLeft, Mail, Gavel, AlertCircle, Send } from 'lucide-react';

interface DMCAProps {
  onBack: () => void;
}

const DMCA: React.FC<DMCAProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#0b0e14] pt-28 pb-20 animate-fade-in">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold uppercase text-[10px] tracking-widest">KEMBALI KE BERANDA</span>
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
            <Copyright className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-bebas text-white tracking-widest leading-none">DMCA Policy</h1>
            <p className="text-slate-500 text-sm font-medium mt-2 uppercase tracking-wider">Pemberitahuan Hak Cipta</p>
          </div>
        </div>

        <div className="bg-[#161b22]/40 rounded-[2.5rem] border border-white/5 p-8 md:p-12 space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Gavel className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">1. Kebijakan Hak Cipta</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              <strong>KomikUo</strong> menghormati hak kekayaan intelektual orang lain. Kami adalah penyedia layanan akses konten komik yang bersumber dari berbagai penyedia pihak ketiga melalui teknologi indexing. Kami tidak meng-host file secara langsung di server kami.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">2. Prosedur Take-down</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Jika Anda adalah pemilik hak cipta dan percaya bahwa konten yang diakses melalui situs kami melanggar hak cipta Anda, silakan ajukan pemberitahuan resmi yang mencakup:
            </p>
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
              <ul className="list-decimal list-inside text-slate-400 text-sm font-medium space-y-3 ml-2">
                <li>Tanda tangan fisik atau elektronik dari pemilik hak cipta atau perwakilannya.</li>
                <li>Identifikasi karya berhak cipta yang diklaim telah dilanggar.</li>
                <li>Identifikasi materi yang diklaim melanggar (sertakan URL spesifik).</li>
                <li>Informasi kontak Anda (Alamat, No Telp, Email).</li>
                <li>Pernyataan bahwa Anda yakin penggunaan materi tersebut tidak diizinkan oleh hukum.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-500" />
              <h2 className="text-2xl font-bebas text-white tracking-widest">3. Alamat Kontak DMCA</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              Kirimkan keluhan DMCA Anda secara eksklusif ke alamat email berikut:
            </p>
            <div className="flex items-center gap-4 bg-orange-500 text-white p-6 rounded-3xl shadow-xl shadow-orange-500/10">
              <Send className="w-8 h-8 opacity-50" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Email Support</p>
                <p className="text-xl font-bold">dmca@komikuo.com</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs font-medium italic mt-4">
              Catatan: Keluhan yang tidak menyertakan bukti kepemilikan hak cipta yang sah mungkin tidak dapat diproses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DMCA;

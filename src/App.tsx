/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Zap, 
  Copy, 
  CheckCircle2, 
  LayoutDashboard, 
  Megaphone, 
  FileText, 
  Smartphone, 
  Globe, 
  Briefcase,
  ChevronDown,
  Loader2,
  AlertCircle,
  MessageSquare,
  Image as ImageIcon,
  Search,
  Send,
  User,
  Bot,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

// Types for our categories
type Category = 'pemasaran' | 'sebutharga' | 'appsheet' | 'lookerstudio' | 'website' | 'onepagereport' | 'tender' | 'analisiskewangan' | 'cashflow' | 'pengurusanprojek' | 'ganttchart';
type AppMode = 'expert' | 'chat' | 'image';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface InputFields {
  servis?: string;
  kelebihan?: string;
  targetAudience?: string;
  cta?: string;
  tujuanFormula?: string;
  dataAppsheet?: string;
  logikKhusus?: string;
  matlamatDashboard?: string;
  kpiDashboard?: string;
  sumberData?: string;
  tajukTender?: string;
  nilaiTambah?: string;
  syaratWajib?: string;
  butiranAm?: string;
  pendapatan?: string;
  perbelanjaan?: string;
  tempohAnalisis?: string;
  matlamatKewangan?: string;
  namaProjek?: string;
  fasaProjek?: string;
  milestoneUtama?: string;
  risikoUtama?: string;
  syaratPembayaran?: string;
  tempohSah?: string;
  gayaVisual?: string;
  fungsiKhas?: string;
  fokusUtama?: string;
}

export default function App() {
  const [mode, setMode] = useState<AppMode>('expert');
  const [category, setCategory] = useState<Category>('pemasaran');
  const [inputs, setInputs] = useState<InputFields>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Image Lab State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const tunjukToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    tunjukToast('✅ Hasil kepakaran AI berjaya disalin!');
  };

  const generateAIResponse = async () => {
    setLoading(true);
    setResult(null);

    let promptText = "";

    if (category === 'pemasaran') {
      promptText = `Hasilkan satu strategi pemasaran dan copywriting jualan aras tinggi untuk servis: "${inputs.servis || "Servis Kontraktor"}". 
      Kelebihan utama kami: "${inputs.kelebihan || "Pakar & Bertauliah"}". 
      Target Audiens: "${inputs.targetAudience || "Umum"}". 
      Call to Action (CTA): "${inputs.cta || "Hubungi kami sekarang"}". 
      Butiran Tambahan: "${inputs.butiranAm || "Tiada"}".
      Gunakan psikologi jualan B2B dan B2C. Pastikan ia tular, memukau, dan memaksa pelanggan bertindak sekarang.`;
    } else if (category === 'sebutharga') {
      promptText = `Draf satu surat iringan (cover letter) sebut harga korporat yang sangat profesional dan meyakinkan. 
      Butiran Projek: "${inputs.butiranAm || "Sila draf surat iringan sebut harga."}".
      Syarat Pembayaran: "${inputs.syaratPembayaran || "Standard"}".
      Tempoh Sah Sebut Harga: "${inputs.tempohSah || "30 hari"}".`;
    } else if (category === 'appsheet') {
      promptText = `Sediakan formula dan ekspresi Google AppSheet bertaraf pakar. 
      Matlamat: "${inputs.tujuanFormula || "Automasi asas"}". 
      Data rujukan: "${inputs.dataAppsheet || "Tiada jadual spesifik"}". 
      Logik Khusus: "${inputs.logikKhusus || "Tiada"}".
      Berikan kod formula yang tepat, penerangan logik, dan cara elak ralat.`;
    } else if (category === 'lookerstudio') {
      promptText = `Rangka pelan tindakan dan reka bentuk papan pemuka (dashboard) Looker Studio tahap korporat. 
      Matlamat: "${inputs.matlamatDashboard || "Pemantauan"}". 
      KPI: "${inputs.kpiDashboard || "KPI Utama"}". 
      Sumber Data: "${inputs.sumberData || "Google Sheets/SQL"}".
      Cadangkan fungsi 'calculated fields', struktur visual (UI/UX) dan data blending yang bersesuaian.`;
    } else if (category === 'website') {
      promptText = `Rangka struktur laman web korporat yang moden dan berimpak tinggi. 
      Butiran syarikat/servis: "${inputs.butiranAm || "Sila rangka struktur website."}".
      Gaya Visual: "${inputs.gayaVisual || "Profesional & Moden"}".
      Fungsi Khas: "${inputs.fungsiKhas || "Tiada"}".`;
    } else if (category === 'onepagereport') {
      promptText = `Hasilkan draf Laporan Eksekutif Satu Muka (One-Page Report) yang padat dan informatif. 
      Butiran laporan: "${inputs.butiranAm || "Sila hasilkan laporan eksekutif."}".
      Fokus Utama: "${inputs.fokusUtama || "Prestasi Keseluruhan"}".`;
    } else if (category === 'tender') {
      promptText = `Tulis satu Ringkasan Eksekutif (Executive Summary) bidaan tender yang sangat meyakinkan, elit dan berautoriti tinggi. 
      Projek: "${inputs.tajukTender || "Projek Skala Besar"}". 
      Kelebihan pemikat: "${inputs.nilaiTambah || "Berpengalaman"}". 
      Syarat Wajib Dipenuhi: "${inputs.syaratWajib || "Tiada"}".
      Pastikan ia menunjukkan pihak kami sangat berkapasiti tinggi, bebas risiko, dan pilihan paling tepat.`;
    } else if (category === 'analisiskewangan') {
      promptText = `Lakukan analisis risiko kewangan terperinci. 
      Pendapatan: "RM${inputs.pendapatan || "0"}". 
      Perbelanjaan: "RM${inputs.perbelanjaan || "0"}". 
      Tempoh Analisis: "${inputs.tempohAnalisis || "Bulanan"}".
      Matlamat Kewangan: "${inputs.matlamatKewangan || "Meningkatkan keuntungan"}".
      Senaraikan potensi risiko kewangan, anggaran kesan kewangan (impact), dan langkah mitigasi yang strategik.`;
    } else if (category === 'cashflow') {
      promptText = `Hasilkan unjuran aliran tunai (cash flow projection) untuk 12 bulan akan datang berdasarkan data berikut: "${inputs.butiranAm || "Tiada data spesifik"}". 
      Matlamat: "${inputs.matlamatKewangan || "Kestabilan tunai"}".
      Kenal pasti bulan-bulan kritikal dan cadangkan strategi rizab tunai.`;
    } else if (category === 'pengurusanprojek') {
      promptText = `Rangka Pelan Pengurusan Projek (PMP) yang lengkap untuk projek: "${inputs.namaProjek || "Projek Baharu"}". 
      Fasa: "${inputs.fasaProjek || "Permulaan"}". 
      Milestone Utama: "${inputs.milestoneUtama || "Tiada"}".
      Risiko Utama: "${inputs.risikoUtama || "Tiada"}".
      Pelan mestilah merangkumi: 1. Skop Projek, 2. Jadual Utama, 3. Anggaran Bajet, 4. Pengurusan Risiko, dan 5. Pelan Komunikasi Pasukan.`;
    } else if (category === 'ganttchart') {
      promptText = `Sediakan struktur Carta Gantt (Gantt Chart) yang terperinci untuk projek: "${inputs.namaProjek || "Projek Baharu"}". 
      Senaraikan tugasan utama (WBS), tempoh masa (hari/minggu), dan kaitan (dependencies) antara tugasan tersebut. 
      Butiran Tambahan: "${inputs.butiranAm || "Tiada"}".`;
    } else {
      promptText = `Tolong laksanakan arahan ini dengan standard tertinggi untuk kategori ${category}: ${inputs.butiranAm || "Sila bantu saya membuat tugasan korporat."}`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: promptText }] }],
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `Anda adalah Ketua Pegawai Operasi (COO), Pakar Strategi Pendigitalan, dan Jurutera Eksekutif Bertaraf Dunia yang berkhidmat secara eksklusif untuk syarikat "BENA FLASH GLOBAL PLT".
Matlamat anda adalah untuk sentiasa menghasilkan kerja bertahap 10/10. Gunakan bahasa Melayu korporat, profesional, dan padat.

ARAHAN WAJIB (SANGAT PENTING):
1. Jawab permintaan pengguna secara TERUS dan TEPAT (berikan skrip, kod, atau laporan yang diminta dengan kualiti tertinggi).
2. Gunakan format Markdown yang kemas dengan pengasingan bahagian yang jelas menggunakan '###' untuk sub-tajuk.
3. Gunakan alat Google Search untuk mendapatkan maklumat terkini jika perlu (terutama untuk tender, analisis pasaran, dan teknologi).
4. Di hujung jawapan anda, anda WAJIB mencipta satu tajuk baharu: "### 💡 CADANGAN PAKAR (1000X LEBIH KUAT)".
5. Dalam bahagian "Cadangan Pakar" tersebut, cadangkan inovasi, aliran kerja (workflow), teknologi baharu (seperti automasi AI, IoT, atau strategi perniagaan tahap elit) yang JAUH LEBIH HEBAT daripada apa yang pengguna asalnya minta. Tunjukkan kepakaran sebenar BENA FLASH GLOBAL PLT.
6. Akhir sekali, anda WAJIB menyediakan satu bahagian bertajuk "### 🚀 PROMPT MASTER (PROMPT ENGINEERING TAHAP TINGGI)".
7. Bahagian ini mestilah mengandungi satu prompt lengkap yang boleh disalin dan digunakan pada mana-mana LLM (seperti ChatGPT, Claude, atau Gemini) untuk melaksanakan tugasan yang sama dengan kualiti pakar. Prompt ini mestilah menggunakan teknik prompt engineering tahap tertinggi (Persona, Konteks, Objektif, Kekangan, Format Output).`,
        }
      });

      setResult(response.text || "Tiada respons diterima.");
    } catch (error: any) {
      console.error(error);
      setResult(`**Ralat Sistem:** Gagal berhubung dengan pelayan AI. Sila cuba lagi sebentar lagi.\n\nButiran teknikal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...chatMessages, userMsg].map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "Anda adalah asisten AI pakar dari BENA FLASH GLOBAL PLT. Berikan jawapan yang sangat profesional, teknikal, dan berwibawa dalam Bahasa Melayu. Gunakan format Markdown yang kemas dengan pengasingan bahagian yang jelas menggunakan '###' untuk sub-tajuk. Gunakan Google Search untuk fakta terkini."
        }
      });

      const modelMsg: ChatMessage = { role: 'model', text: response.text || "Maaf, saya tidak dapat memproses permintaan anda." };
      setChatMessages(prev => [...prev, modelMsg]);
    } catch (error: any) {
      console.error(error);
      tunjukToast("Ralat menghantar mesej.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setLoading(true);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: imagePrompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: imageSize
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          tunjukToast("Imej berjaya dijana!");
          break;
        }
      }
    } catch (error: any) {
      console.error(error);
      tunjukToast("Ralat menjana imej.");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    const inputClass = "w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all mt-1";
    const labelClass = "block text-sm font-bold text-slate-300 tracking-wide";

    switch (category) {
      case 'pemasaran':
        return (
          <>
            <div>
              <label className={labelClass}>Servis/Produk Yang Ingin Dipasarkan:</label>
              <input type="text" id="servis" className={inputClass} placeholder="Cth: Kontrak Pendawaian Industri / Servis Aircond Korporat" onChange={handleInputChange} value={inputs.servis || ''} />
            </div>
            <div>
              <label className={labelClass}>Keunikan (USP) / Tawaran Hebat:</label>
              <input type="text" id="kelebihan" className={inputClass} placeholder="Cth: Pasukan Jurutera Bertauliah, Jaminan 2 Tahun, Bebas Cukai" onChange={handleInputChange} value={inputs.kelebihan || ''} />
            </div>
            <div>
              <label className={labelClass}>Target Audiens:</label>
              <input type="text" id="targetAudience" className={inputClass} placeholder="Cth: Pemilik Kilang, Pengurus Fasiliti" onChange={handleInputChange} value={inputs.targetAudience || ''} />
            </div>
            <div>
              <label className={labelClass}>Call to Action (CTA):</label>
              <input type="text" id="cta" className={inputClass} placeholder="Cth: Klik link WhatsApp di bawah untuk sebut harga percuma" onChange={handleInputChange} value={inputs.cta || ''} />
            </div>
            <div>
              <label className={labelClass}>Butiran Tambahan:</label>
              <textarea id="butiranAm" rows={3} className={inputClass} placeholder="Terangkan apa yang anda mahukan secara terperinci..." onChange={handleInputChange} value={inputs.butiranAm || ''}></textarea>
            </div>
          </>
        );
      case 'sebutharga':
        return (
          <>
            <div>
              <label className={labelClass}>Butiran Projek/Tugas:</label>
              <textarea id="butiranAm" rows={3} className={inputClass} placeholder="Cth: Kerja-kerja penyelenggaraan elektrikal di Bangunan A" onChange={handleInputChange} value={inputs.butiranAm || ''}></textarea>
            </div>
            <div>
              <label className={labelClass}>Syarat Pembayaran:</label>
              <input type="text" id="syaratPembayaran" className={inputClass} placeholder="Cth: 30% Deposit, 70% Selepas Siap" onChange={handleInputChange} value={inputs.syaratPembayaran || ''} />
            </div>
            <div>
              <label className={labelClass}>Tempoh Sah Sebut Harga:</label>
              <input type="text" id="tempohSah" className={inputClass} placeholder="Cth: 30 Hari" onChange={handleInputChange} value={inputs.tempohSah || ''} />
            </div>
          </>
        );
      case 'appsheet':
        return (
          <>
            <div>
              <label className={labelClass}>Apa Matlamat Formula Ini?:</label>
              <input type="text" id="tujuanFormula" className={inputClass} placeholder="Cth: Mengira baki stok secara automatik dan hantar notis jika habis" onChange={handleInputChange} value={inputs.tujuanFormula || ''} />
            </div>
            <div>
              <label className={labelClass}>Maklumat Jadual (Table & Column):</label>
              <input type="text" id="dataAppsheet" className={inputClass} placeholder="Cth: Table [Inventori], Kolum [Masuk] dan [Keluar]" onChange={handleInputChange} value={inputs.dataAppsheet || ''} />
            </div>
            <div>
              <label className={labelClass}>Logik Khusus (Jika Ada):</label>
              <textarea id="logikKhusus" rows={2} className={inputClass} placeholder="Cth: Jika stok kurang dari 10, warna teks jadi merah" onChange={handleInputChange} value={inputs.logikKhusus || ''}></textarea>
            </div>
          </>
        );
      case 'lookerstudio':
        return (
          <>
            <div>
              <label className={labelClass}>Fokus Utama Dashboard:</label>
              <input type="text" id="matlamatDashboard" className={inputClass} placeholder="Cth: Pemantauan Aliran Tunai Projek (Cashflow) & Status Kehadiran Pekerja" onChange={handleInputChange} value={inputs.matlamatDashboard || ''} />
            </div>
            <div>
              <label className={labelClass}>Metrik Yang Ingin Diukur (KPI):</label>
              <input type="text" id="kpiDashboard" className={inputClass} placeholder="Cth: Keuntungan Kasar, Kadar Kelewatan Projek, Kos Bahan Mentah" onChange={handleInputChange} value={inputs.kpiDashboard || ''} />
            </div>
            <div>
              <label className={labelClass}>Sumber Data:</label>
              <input type="text" id="sumberData" className={inputClass} placeholder="Cth: Google Sheets, SQL Database, AppSheet" onChange={handleInputChange} value={inputs.sumberData || ''} />
            </div>
          </>
        );
      case 'website':
        return (
          <>
            <div>
              <label className={labelClass}>Butiran Syarikat/Servis:</label>
              <textarea id="butiranAm" rows={3} className={inputClass} placeholder="Terangkan latar belakang syarikat dan servis utama..." onChange={handleInputChange} value={inputs.butiranAm || ''}></textarea>
            </div>
            <div>
              <label className={labelClass}>Gaya Visual:</label>
              <input type="text" id="gayaVisual" className={inputClass} placeholder="Cth: Minimalis, High-Tech, Korporat Elit" onChange={handleInputChange} value={inputs.gayaVisual || ''} />
            </div>
            <div>
              <label className={labelClass}>Fungsi Khas:</label>
              <input type="text" id="fungsiKhas" className={inputClass} placeholder="Cth: Borang Tempahan, Integrasi Payment Gateway" onChange={handleInputChange} value={inputs.fungsiKhas || ''} />
            </div>
          </>
        );
      case 'onepagereport':
        return (
          <>
            <div>
              <label className={labelClass}>Butiran Laporan:</label>
              <textarea id="butiranAm" rows={3} className={inputClass} placeholder="Masukkan data atau ringkasan aktiviti yang ingin dilaporkan..." onChange={handleInputChange} value={inputs.butiranAm || ''}></textarea>
            </div>
            <div>
              <label className={labelClass}>Fokus Utama:</label>
              <input type="text" id="fokusUtama" className={inputClass} placeholder="Cth: Pencapaian KPI, Masalah & Penyelesaian" onChange={handleInputChange} value={inputs.fokusUtama || ''} />
            </div>
          </>
        );
      case 'tender':
        return (
          <>
            <div>
              <label className={labelClass}>Tajuk Tender / Projek:</label>
              <input type="text" id="tajukTender" className={inputClass} placeholder="Cth: Penyelenggaraan Sistem Mekanikal & Elektrikal Bangunan Kerajaan" onChange={handleInputChange} value={inputs.tajukTender || ''} />
            </div>
            <div>
              <label className={labelClass}>Kelebihan Bena Flash Global (Untuk Menang):</label>
              <input type="text" id="nilaiTambah" className={inputClass} placeholder="Cth: Status kewangan sangat stabil, 15 tahun pengalaman, zero accident record" onChange={handleInputChange} value={inputs.nilaiTambah || ''} />
            </div>
            <div>
              <label className={labelClass}>Syarat Wajib Dipenuhi:</label>
              <textarea id="syaratWajib" rows={2} className={inputClass} placeholder="Cth: Mesti ada CIDB G7, Sijil ISO 9001" onChange={handleInputChange} value={inputs.syaratWajib || ''}></textarea>
            </div>
          </>
        );
      case 'analisiskewangan':
        return (
          <>
            <div>
              <label className={labelClass}>Anggaran Pendapatan (RM):</label>
              <input type="text" id="pendapatan" className={inputClass} placeholder="Cth: 500,000" onChange={handleInputChange} value={inputs.pendapatan || ''} />
            </div>
            <div>
              <label className={labelClass}>Anggaran Perbelanjaan (RM):</label>
              <input type="text" id="perbelanjaan" className={inputClass} placeholder="Cth: 350,000" onChange={handleInputChange} value={inputs.perbelanjaan || ''} />
            </div>
            <div>
              <label className={labelClass}>Tempoh Analisis:</label>
              <input type="text" id="tempohAnalisis" className={inputClass} placeholder="Cth: Suku Tahun Pertama 2024" onChange={handleInputChange} value={inputs.tempohAnalisis || ''} />
            </div>
            <div>
              <label className={labelClass}>Matlamat Kewangan:</label>
              <input type="text" id="matlamatKewangan" className={inputClass} placeholder="Cth: Mengurangkan kos operasi sebanyak 15%" onChange={handleInputChange} value={inputs.matlamatKewangan || ''} />
            </div>
          </>
        );
      case 'cashflow':
        return (
          <>
            <div>
              <label className={labelClass}>Data Aliran Tunai Semasa:</label>
              <textarea id="butiranAm" rows={3} className={inputClass} placeholder="Masukkan baki tunai, akaun belum terima, dan akaun belum bayar..." onChange={handleInputChange} value={inputs.butiranAm || ''}></textarea>
            </div>
            <div>
              <label className={labelClass}>Matlamat Aliran Tunai:</label>
              <input type="text" id="matlamatKewangan" className={inputClass} placeholder="Cth: Memastikan rizab tunai sentiasa positif untuk 6 bulan" onChange={handleInputChange} value={inputs.matlamatKewangan || ''} />
            </div>
          </>
        );
      case 'pengurusanprojek':
        return (
          <>
            <div>
              <label className={labelClass}>Nama Projek:</label>
              <input type="text" id="namaProjek" className={inputClass} placeholder="Cth: Projek Solar Farm Cyberjaya" onChange={handleInputChange} value={inputs.namaProjek || ''} />
            </div>
            <div>
              <label className={labelClass}>Fasa Semasa:</label>
              <input type="text" id="fasaProjek" className={inputClass} placeholder="Cth: Fasa Perancangan" onChange={handleInputChange} value={inputs.fasaProjek || ''} />
            </div>
            <div>
              <label className={labelClass}>Milestone Utama:</label>
              <textarea id="milestoneUtama" rows={2} className={inputClass} placeholder="Cth: Siap pondasi (Minggu 4), Pemasangan Panel (Minggu 12)" onChange={handleInputChange} value={inputs.milestoneUtama || ''}></textarea>
            </div>
            <div>
              <label className={labelClass}>Risiko Utama:</label>
              <input type="text" id="risikoUtama" className={inputClass} placeholder="Cth: Kelewatan bekalan bahan, Cuaca buruk" onChange={handleInputChange} value={inputs.risikoUtama || ''} />
            </div>
          </>
        );
      case 'ganttchart':
        return (
          <>
            <div>
              <label className={labelClass}>Nama Projek:</label>
              <input type="text" id="namaProjek" className={inputClass} placeholder="Cth: Projek Solar Farm Cyberjaya" onChange={handleInputChange} value={inputs.namaProjek || ''} />
            </div>
            <div>
              <label className={labelClass}>Senarai Tugasan Utama:</label>
              <textarea id="butiranAm" rows={4} className={inputClass} placeholder="Senaraikan tugasan satu demi satu..." onChange={handleInputChange} value={inputs.butiranAm || ''}></textarea>
            </div>
          </>
        );
      default:
        return (
          <div>
            <label className={labelClass}>Butiran Lengkap Tugas:</label>
            <textarea id="butiranAm" rows={3} className={inputClass} placeholder="Terangkan apa yang anda mahukan secara terperinci..." onChange={handleInputChange} value={inputs.butiranAm || ''}></textarea>
          </div>
        );
    }
  };

  const getButtonText = () => {
    if (loading) return "Sistem Sedang Memproses...";
    
    switch (category) {
      case 'pemasaran': return "Jana Iklan Tular Sekarang";
      case 'sebutharga': return "Draf Sebut Harga Sekarang";
      case 'appsheet': return "Jana Formula AppSheet Sekarang";
      case 'lookerstudio': return "Rangka Dashboard Sekarang";
      case 'website': return "Rangka Struktur Website Sekarang";
      case 'onepagereport': return "Jana Laporan Eksekutif Sekarang";
      case 'tender': return "Draf Bidaan Tender Sekarang";
      case 'analisiskewangan': return "Analisis Kewangan Sekarang";
      case 'cashflow': return "Jana Unjuran Aliran Tunai Sekarang";
      case 'pengurusanprojek': return "Rangka Pelan Projek Sekarang";
      case 'ganttchart': return "Jana Struktur Gantt Sekarang";
      default: return "Jana Hasil Pakar Sekarang";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl mb-4 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            <Zap className="h-10 w-10 text-white fill-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            BENA FLASH <span className="text-blue-500">GLOBAL PLT</span>
          </h1>
          <p className="text-blue-200 mt-3 text-sm md:text-base font-medium tracking-wide uppercase">
            Sistem Pakar AI & Pendigitalan Korporat (V4)
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-800/50 p-1 rounded-2xl mb-8 border border-slate-700 max-w-md mx-auto">
          <button 
            onClick={() => setMode('expert')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'expert' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Briefcase className="h-4 w-4" />
            Sistem Pakar
          </button>
          <button 
            onClick={() => setMode('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </button>
          <button 
            onClick={() => setMode('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <ImageIcon className="h-4 w-4" />
            Image Lab
          </button>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {mode === 'expert' && (
            <motion.div 
              key="expert"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-700"
            >
              <div className="mb-6">
                <label htmlFor="kategori" className="block text-sm font-bold text-slate-300 mb-2">Pilih Kepakaran Yang Anda Perlukan:</label>
                <div className="relative">
                  <select 
                    id="kategori" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="block w-full appearance-none bg-slate-900 border border-slate-600 text-white py-4 px-5 pr-12 rounded-xl leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer font-medium text-lg"
                  >
                    <optgroup label="Pengurusan Pelanggan & Pemasaran">
                      <option value="pemasaran">📢 Hasilkan Iklan Tular (Copywriting Premium)</option>
                      <option value="sebutharga">📝 Draf Surat Iringan Sebut Harga Korporat</option>
                    </optgroup>
                    <optgroup label="Pendigitalan & Automasi (Level Pro)">
                      <option value="appsheet">📱 Penjana Formula AppSheet (Automasi)</option>
                      <option value="lookerstudio">📊 Struktur Dashboard Looker Studio</option>
                      <option value="website">🌐 Rangka Struktur Website Korporat</option>
                    </optgroup>
                    <optgroup label="Pengurusan Projek & Korporat">
                      <option value="onepagereport">📄 Laporan Eksekutif (One-Page Report)</option>
                      <option value="tender">💼 Penulisan Strategik Bidaan Tender</option>
                      <option value="pengurusanprojek">🏗️ Pelan Pengurusan Projek (PMP)</option>
                      <option value="ganttchart">📅 Struktur Carta Gantt (Timeline)</option>
                    </optgroup>
                    <optgroup label="Analisis Kewangan & Strategi">
                      <option value="analisiskewangan">💰 Analisis Untung Rugi (Financial)</option>
                      <option value="cashflow">📉 Unjuran Aliran Tunai (Cash Flow)</option>
                    </optgroup>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-slate-700 my-6"></div>

              {/* Dynamic Fields Container */}
              <div className="space-y-5">
                {renderFields()}
              </div>

              {/* Generate Button */}
              <button 
                onClick={generateAIResponse}
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 text-white font-black text-lg py-4 px-6 rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex justify-center items-center gap-3"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Zap className="h-6 w-6 fill-current" />
                )}
                <span>{getButtonText()}</span>
              </button>
            </motion.div>
          )}

          {mode === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 flex flex-col h-[600px] overflow-hidden"
            >
              <div className="p-4 border-bottom border-slate-700 bg-slate-800/50 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">BENA Chat AI</h3>
                  <p className="text-xs text-slate-400">Pakar Strategi Digital Anda</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <Bot className="h-12 w-12 text-slate-600 mb-4" />
                    <h4 className="text-lg font-bold text-slate-300">Selamat Datang ke BENA Chat</h4>
                    <p className="text-sm text-slate-500 max-w-xs">Tanya apa sahaja mengenai strategi perniagaan, teknologi, atau bantuan korporat.</p>
                  </div>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                      <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] font-bold uppercase tracking-wider">
                        {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        {msg.role === 'user' ? 'Anda' : 'BENA AI'}
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tulis mesej anda di sini..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={loading || !chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white p-3 rounded-xl transition-all"
                  >
                    <Send className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'image' && (
            <motion.div 
              key="image"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Image Lab</h3>
                  <p className="text-sm text-slate-400">Visualisasikan Idea Perniagaan Anda</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Terangkan Imej Yang Anda Mahukan:</label>
                  <textarea 
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Cth: Reka bentuk pejabat korporat moden dengan elemen futuristik, pencahayaan neon biru, kualiti 4K, sinematik..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['1K', '2K', '4K'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all border ${imageSize === size ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      {size} Resolution
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleGenerateImage}
                  disabled={loading || !imagePrompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-black text-lg py-4 px-6 rounded-xl shadow-xl transition-all flex justify-center items-center gap-3"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                  Jana Visual Sekarang
                </button>

                {generatedImage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 rounded-2xl overflow-hidden border-4 border-slate-700 shadow-2xl relative group"
                  >
                    <img src={generatedImage} alt="Generated" className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = generatedImage;
                          link.download = 'bena-ai-visual.png';
                          link.click();
                        }}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all"
                      >
                        Muat Turun
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Section (Only for Expert Mode) */}
        <AnimatePresence>
          {mode === 'expert' && result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Respons AI Eksekutif
                </h3>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-5 rounded-full text-sm font-bold transition-colors shadow-lg border border-slate-600"
                >
                  <Copy className="h-4 w-4" />
                  Salin Keputusan
                </button>
              </div>
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-blue-900/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400"></div>
                <div className="ai-content max-w-none">
                  <Markdown>{result}</Markdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-slate-500 text-xs mt-10 font-medium">
          © 2026 BENA FLASH GLOBAL PLT. Sistem Dikuasakan oleh Gemini AI.
        </p>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 right-5 bg-teal-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 font-bold"
          >
            <CheckCircle2 className="h-6 w-6" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { GoogleGenAI } from '@google/genai';
import { MOCK_TOURISM_DATA } from './data';

// Initialize the Gemini client
// Using the recommended pattern for client-side API key access in this sandbox
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Anda adalah analis data AI ahli untuk "Nusantara Analytics", pusat analitik pariwisata Indonesia. 
Pengguna Anda adalah eksekutif perusahaan yang memerlukan wawasan yang jelas, ringkas, dan dapat ditindaklanjuti. Mereka mungkin bukan ahli teknis.
Jaga agar jawaban Anda singkat, profesional, dan mudah dibaca secara visual (gunakan format markdown standar, poin bullet, teks tebal).
Jawab selalu dalam Bahasa Indonesia.
Jangan pernah menyebutkan bahwa ini adalah data tiruan atau lingkungan simulasi. Perlakukan konteks data yang diberikan sebagai kebenaran mutlak untuk tahun 2025.

Konteks Data Pariwisata Indonesia (2025):
- Total Kedatangan tahun ini: ${MOCK_TOURISM_DATA.keyMetrics.totalArrivals.toLocaleString()} (+${MOCK_TOURISM_DATA.keyMetrics.yoyGrowth}% YoY)
- Rata-rata Pengeluaran: $${MOCK_TOURISM_DATA.keyMetrics.avgSpendPerTourist} per wisatawan
- Rata-rata Menginap: ${MOCK_TOURISM_DATA.keyMetrics.avgStayLength} hari
- Destinasi Teratas: ${MOCK_TOURISM_DATA.topDestinations.map(d => `${d.name} (${d.visitors.toLocaleString()} pengunjung, +${d.growth}% pertumbuhan)`).join(', ')}
- Sentimen Pengunjung: ${MOCK_TOURISM_DATA.sentiment.positive}% Positif, ${MOCK_TOURISM_DATA.sentiment.neutral}% Netral, ${MOCK_TOURISM_DATA.sentiment.negative}% Negatif

Jika diminta untuk memprediksi atau meramalkan, gunakan logika yang masuk akal berdasarkan tren pariwisata Indonesia (misalnya, puncak musim pada bulan Juli/Agustus dan Desember).
`;

export async function askTourismAI(question: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Keep it factual and analytical
      }
    });

    return response.text() || "Saya tidak dapat memproses permintaan tersebut.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Saya saat ini tidak dapat mengakses mesin analitik. Silakan coba lagi nanti.";
  }
}

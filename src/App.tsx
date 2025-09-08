import { useState, useEffect } from "react";

// Provider Checker App (single-file React component for Vite + Tailwind)
// Default export a React component so it can be used as src/App.jsx

interface Match {
  prefix: string;
  provider: string;
  partial?: boolean;
}

interface CheckResult {
  normalized: string;
  matches: Match[];
  reason: string;
}

const PREFIX_MAP: Record<string, string[]> = {
  "Telkomsel": [
    "0852","0853","0811","0812","0813","0821","0822","0851"
  ],
  "XL Axiata": [
    "0817","0818","0819","0859","0877","0878","0879"
  ],
  "Indosat Ooredoo": [
    "0814","0815","0816","0855","0856","0857","0858"
  ],
  "Three (3)": [
    "0896","0897","0898","0899"
  ],
  "Axis": [
    "0831","0838"
  ],
  "Smartfren": [
    "0881","0882","0883","0884"
  ]
};

// Build a reverse lookup: prefix -> provider (fast checking)
const PREFIX_TO_PROVIDER: Record<string, string> = Object.entries(PREFIX_MAP).reduce((acc, [provider, prefixes]) => {
  prefixes.forEach(p => (acc[p] = provider));
  return acc;
}, {} as Record<string, string>);

function normalizeNumber(input: string): string {
  if (!input) return "";
  // keep only digits and plus
  let s = input.trim();
  // remove spaces, dashes, parentheses
  s = s.replace(/[^0-9+]/g, "");
  // handle +62 -> 0
  if (s.startsWith("+62")) s = "0" + s.slice(3);
  // handle leading 62 without plus
  if (s.startsWith("62") && !s.startsWith("0")) s = "0" + s.slice(2);
  return s;
}

function findProvidersByNumber(raw: string): CheckResult {
  const n = normalizeNumber(raw);
  if (!n) return { normalized: "", matches: [], reason: "Nomor kosong" };
  if (!/^0\d{2,}$/.test(n)) {
    return { normalized: n, matches: [], reason: "Format nomor tidak dikenali" };
  }

  // try 4-digit prefix first
  const first4 = n.slice(0, 4);
  const first3 = n.slice(0, 3);
  const matches = [];

  if (PREFIX_TO_PROVIDER[first4]) matches.push({ prefix: first4, provider: PREFIX_TO_PROVIDER[first4] });
  // also check 3-digit (fallback) in case some ranges are 3-digit
  if (PREFIX_TO_PROVIDER[first3] && first3 !== first4) matches.push({ prefix: first3, provider: PREFIX_TO_PROVIDER[first3] });

  // additionally, try scanning if any mapping starts with the number (useful if input is incomplete)
  if (matches.length === 0) {
    Object.keys(PREFIX_TO_PROVIDER).forEach(p => {
      if (p.startsWith(n.slice(0, p.length))) {
        matches.push({ prefix: p, provider: PREFIX_TO_PROVIDER[p], partial: true });
      }
    });
  }

  const reason = matches.length ? "Ditemukan" : "Tidak ditemukan prefix yang cocok";
  return { normalized: n, matches, reason };
}

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    setLoading(true);
    const timer = setTimeout(() => {
      const r = findProvidersByNumber(input);
      setResult(r);
      setLoading(false);
    }, 300); // 300ms debounce
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [input]);

  function handleQuickPick(number: string) {
    setInput(number);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black flex items-start justify-center p-4 sm:p-6 md:p-8" style={{fontFamily: 'Asimovian, sans-serif'}}>
      <div className="w-full max-w-5xl bg-white border-8 border-black p-4 sm:p-6 md:p-8">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-blue-600">Provider Checker</h1>
          <p className="text-base sm:text-lg text-green-600 mt-2 font-bold">CEK OPERATOR DARI NOMOR TELEPON</p>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">Masukkan nomor telepon Indonesia (contoh: 08520098374 atau +628520098374) dan dapatkan informasi operator secara real-time.</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            aria-label="Nomor telepon"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border-4 border-black bg-white text-black px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base"
            placeholder="Masukkan nomor, mis. 08520098374 atau +6285..."
          />
          <button type="button" onClick={() => { setInput(""); setResult(null); }} className="px-4 py-2 border-4 border-black bg-yellow-400 text-black font-bold uppercase text-sm sm:text-base">Reset</button>
        </div>

        <section className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 border-8 border-black bg-green-200">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-green-800">Hasil Pencarian</h2>
            {!result && !loading && <p className="text-base sm:text-lg text-blue-600 mt-4 font-bold">MASUKKAN NOMOR UNTUK MULAI</p>}
            {loading && <p className="text-base sm:text-lg text-orange-600 mt-4 font-bold animate-pulse">MENCARI PROVIDER...</p>}

            {result && (
              <div className="mt-4">
                <p className="text-base sm:text-lg text-black font-bold">Nomor Normal: <span className=" bg-white border-2 border-black px-2 py-1 text-black text-sm">{result.normalized || '-'}</span></p>
                <p className="text-base sm:text-lg text-black mt-2 font-bold">Status: <span className="bg-yellow-400 text-black px-2 py-1 border-2 border-black text-sm">{result.reason}</span></p>

                {result.matches && result.matches.length > 0 && (
                  <ul className="mt-4 space-y-3">
                    {result.matches.map((m, i) => (
                      <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-4 border-black bg-white">
                        <div className="mb-2 sm:mb-0">
                          <div className="text-lg sm:text-xl font-black text-blue-600">{m.provider}</div>
                          <div className="text-xs sm:text-sm text-gray-700">Prefix: <span className=" bg-gray-200 text-black px-1 border text-xs">{m.prefix}</span> {m.partial ? '(PERKIRAAN)' : ''}</div>
                        </div>
                        <div className="text-base sm:text-lg font-bold text-green-600">{m.partial ? 'PERKIRAAN' : 'TEPAT'}</div>
                      </li>
                    ))}
                  </ul>
                )}

                {result.matches && result.matches.length === 0 && (
                  <p className="mt-4 text-base sm:text-lg text-red-600 font-bold bg-white p-3 border-4 border-red-600">TIDAK ADA PROVIDER YANG COCOK - MUNGKIN NOMOR BARU ATAU PREFIX LAIN</p>
                )}

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={async () => {
                      await navigator.clipboard?.writeText(result.normalized || "");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 sm:px-4 py-2 border-4 border-black bg-blue-500 text-white font-bold uppercase hover:bg-blue-600 text-sm sm:text-base"
                  >{copied ? "COPIED!" : "SALIN NOMOR"}</button>
                  <button
                    onClick={() => setInput("")}
                    className="px-3 sm:px-4 py-2 border-4 border-black bg-red-500 text-white font-bold uppercase hover:bg-red-600 text-sm sm:text-base"
                  >BERSIHKAN</button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 border-8 border-black bg-blue-200">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-blue-800">Daftar Prefix</h2>
            <p className="text-base sm:text-lg text-black mt-2 font-bold">RINGKASAN PREFIX OPERATOR INDONESIA</p>
            <div className="mt-4 space-y-3">
              {Object.entries(PREFIX_MAP).map(([prov, prefixes]) => (
                <div key={prov} className="p-3 sm:p-4 border-4 border-black bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="text-lg sm:text-xl font-black text-green-600 mb-2 sm:mb-0">{prov}</div>
                    <button onClick={() => handleQuickPick(prefixes[0] + "0000000")} className="text-xs sm:text-sm px-3 py-2 border-4 border-black bg-green-500 text-white font-bold uppercase hover:bg-green-600">Contoh</button>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 mt-2 ">{prefixes.join(", ")}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-700 bg-white p-3 border-4 border-black">
              <strong className="text-blue-600">TIPS:</strong> Kamu bisa menambahkan/mengubah daftar PREFIX_MAP pada file <span className=" bg-gray-200 text-black px-1 border text-xs">src/App.tsx</span> jika ada perubahan operator atau prefix baru.
            </div>
          </div>
        </section>

        <footer className="mt-6 sm:mt-8 text-base sm:text-lg text-blue-600 font-black uppercase bg-yellow-200 p-4 border-8 border-black">
          <p>Built with Vite + React + Tailwind CSS. Raw and Real-Time Provider Detection.</p>
          <div className="mt-4 text-sm text-gray-700">
            <p><strong>Source Code:</strong> <a href="https://github.com/naandan/numera" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GitHub Repository</a></p>
            <p><strong>Author:</strong> Nandan</p>
            <p><strong>License:</strong> MIT</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

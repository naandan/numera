import { useState } from "react";

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
  Telkomsel: ["0852", "0853", "0811", "0812", "0813", "0821", "0822", "0851"],
  "XL Axiata": ["0817", "0818", "0819", "0859", "0877", "0878", "0879"],
  "Indosat Ooredoo": ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
  "Three (3)": ["0896", "0897", "0898", "0899"],
  Axis: ["0831", "0838"],
  Smartfren: ["0881", "0882", "0883", "0884"],
};

const PREFIX_TO_PROVIDER: Record<string, string> = Object.entries(
  PREFIX_MAP,
).reduce(
  (acc, [provider, prefixes]) => {
    prefixes.forEach((p) => (acc[p] = provider));
    return acc;
  },
  {} as Record<string, string>,
);

function normalizeNumber(input: string): string {
  if (!input) return "";
  let s = input.trim().replace(/[^0-9+]/g, "");
  if (s.startsWith("+62")) s = "0" + s.slice(3);
  if (s.startsWith("62") && !s.startsWith("0")) s = "0" + s.slice(2);
  return s;
}

function findProvidersByNumber(raw: string): CheckResult {
  const n = normalizeNumber(raw);
  if (!n) return { normalized: "", matches: [], reason: "Nomor kosong" };
  if (!/^0\d{2,}$/.test(n)) {
    return {
      normalized: n,
      matches: [],
      reason: "Format nomor tidak dikenali",
    };
  }

  const first4 = n.slice(0, 4);
  const first3 = n.slice(0, 3);
  const matches: Match[] = [];

  if (PREFIX_TO_PROVIDER[first4])
    matches.push({ prefix: first4, provider: PREFIX_TO_PROVIDER[first4] });
  if (PREFIX_TO_PROVIDER[first3] && first3 !== first4)
    matches.push({ prefix: first3, provider: PREFIX_TO_PROVIDER[first3] });

  if (matches.length === 0) {
    Object.keys(PREFIX_TO_PROVIDER).forEach((p) => {
      if (p.startsWith(n.slice(0, p.length))) {
        matches.push({
          prefix: p,
          provider: PREFIX_TO_PROVIDER[p],
          partial: true,
        });
      }
    });
  }

  const reason = matches.length
    ? "Ditemukan"
    : "Tidak ditemukan prefix yang cocok";
  return { normalized: n, matches, reason };
}

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const r = findProvidersByNumber(input);
      setResult(r);
      setLoading(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className="max-w-md mx-auto p-4"
      style={{
        fontFamily: "Boogaloo, sans-serif",
      }}
    >
      <div className="w-full max-w-sm bg-white border-8 border-black p-5 rounded-2xl shadow-[8px_8px_0_#000] transition-transform hover:scale-[1.01]">
        <header className="mb-5 text-center">
          <h1 className="text-3xl font-black uppercase text-blue-600 tracking-wide">
            Provider Checker
          </h1>
          <p className="text-sm text-green-700 font-bold mt-1">
            Cek Operator Nomor HP
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            aria-label="Nomor telepon"
            value={input}
            min={0}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-4 border-black rounded-xl bg-white text-black px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm shadow-[3px_3px_0_#000] transition-all"
            placeholder="Masukkan nomor, mis. 08520098374"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 border-4 border-black bg-blue-500 text-white font-bold uppercase text-sm rounded-xl shadow-[3px_3px_0_#000] hover:bg-blue-600 hover:translate-y-[1px] transition-all"
          >
            Cari
          </button>
        </div>

        {result && (
          <section className="mt-5 border-8 border-black bg-green-200 p-4 rounded-xl shadow-[5px_5px_0_#000] transition-all">
            <h2 className="text-lg font-black uppercase text-green-800">
              Hasil
            </h2>
            {loading && (
              <p className="mt-2 text-orange-600 font-bold animate-pulse">
                Mencari provider...
              </p>
            )}

            {!loading && result && (
              <div className="mt-3 space-y-2">
                <div>
                  <p className="font-bold text-black">Nomor Normal:</p>
                  <p className="bg-white border-2 border-black rounded-lg px-2 py-1 text-sm inline-block">
                    {result.normalized || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-bold mt-2 text-black">Status:</p>
                  <p className="bg-yellow-400 border-2 border-black rounded-lg px-2 py-1 text-sm inline-block">
                    {result.reason}
                  </p>
                </div>

                {result.matches.length > 0 && (
                  <div className="mt-3 p-3 border-4 border-black bg-white rounded-lg shadow-[3px_3px_0_#000]">
                    {result.matches.map((m, i) => (
                      <div key={i} className="py-1">
                        <p className="text-blue-600 font-black text-lg leading-tight">
                          {m.provider}
                        </p>
                        <p className="text-xs text-gray-700">
                          Prefix: {m.prefix} {m.partial ? "(Perkiraan)" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {result.matches.length === 0 && (
                  <p className="mt-3 text-sm font-bold text-red-600 bg-white p-3 border-4 border-red-600 rounded-lg shadow-[3px_3px_0_#000]">
                    Tidak ada provider cocok.
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={async () => {
                      await navigator.clipboard?.writeText(
                        result.normalized || "",
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex-1 px-3 py-2 border-4 border-black bg-green-500 text-white font-bold uppercase hover:bg-green-600 text-xs rounded-xl shadow-[3px_3px_0_#000] transition-all hover:translate-y-[1px]"
                  >
                    {copied ? "Tersalin!" : "Salin Nomor"}
                  </button>
                  <button
                    onClick={() => {
                      setInput("");
                      setResult(null);
                    }}
                    className="flex-1 px-3 py-2 border-4 border-black bg-red-500 text-white font-bold uppercase hover:bg-red-600 text-xs rounded-xl shadow-[3px_3px_0_#000] transition-all hover:translate-y-[1px]"
                  >
                    Bersihkan
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="mt-6 text-center text-xs text-gray-700">
          <p>
            © 2025{" "}
            <a
              href="https://github.com/naandan"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600 transition-colors"
            >
              Nandan
            </a>{" "}
            — Provider Checker
          </p>
        </footer>
      </div>
    </div>
  );
}

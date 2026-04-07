"use client";

import { useState } from "react";
import { Tag, Check, X, Loader2 } from "lucide-react";

interface CuponAplicado {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  valor: number;
}

interface CuponInputProps {
  subtotal: number;
  onCuponAplicado: (cupon: CuponAplicado, descuento: number) => void;
  onCuponEliminado: () => void;
  cuponActual?: CuponAplicado | null;
  descuentoActual?: number;
}

export function CuponInput({
  subtotal,
  onCuponAplicado,
  onCuponEliminado,
  cuponActual,
  descuentoActual = 0
}: CuponInputProps) {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const aplicarCupon = async () => {
    if (!codigo.trim()) {
      setError("Ingresa un código de cupón");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/cupones/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: codigo.trim(), subtotal }),
      });

      const data = await res.json();

      if (!data.valido) {
        setError(data.mensaje);
        return;
      }

      setSuccess(data.mensaje);
      onCuponAplicado(data.cupon, data.descuento);
      setCodigo("");
    } catch {
      setError("Error al aplicar el cupón");
    } finally {
      setLoading(false);
    }
  };

  const eliminarCupon = () => {
    onCuponEliminado();
    setSuccess(null);
    setError(null);
  };

  if (cuponActual) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-green-800">{cuponActual.nombre}</p>
              <p className="text-sm text-green-600">{cuponActual.codigo}</p>
              <p className="text-lg font-black text-green-700 mt-1">
                -${descuentoActual.toLocaleString('es-CO')}
              </p>
            </div>
          </div>
          <button
            onClick={eliminarCupon}
            className="text-green-600 hover:text-green-800 p-1"
            title="Eliminar cupón"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.toUpperCase());
              setError(null);
              setSuccess(null);
            }}
            placeholder="Código de cupón"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#dc2626] uppercase"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                aplicarCupon();
              }
            }}
          />
        </div>
        <button
          onClick={aplicarCupon}
          disabled={loading || !codigo.trim()}
          className="px-6 py-3 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#991b1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Aplicando...
            </>
          ) : (
            "Aplicar"
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}
    </div>
  );
}

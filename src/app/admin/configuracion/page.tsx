"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  CreditCard,
  Upload,
} from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";

interface Config {
  general: {
    nombre_restaurante: string;
    slogan: string;
    telefono: string;
    telefono_secundario: string;
    email: string;
    direccion: string;
    domicilio_gratis_desde: string;
    costo_domicilio: string;
    horario_apertura: string;
    horario_cierre: string;
  };
  social: {
    facebook_url: string;
    instagram_url: string;
    whatsapp: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
  };
}

export default function AdminConfiguracion() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/admin/configuracion", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConfig(data.configuracion);
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (clave: string, valor: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch("/api/admin/configuracion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clave, valor }),
      });
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  const handleChange = (group: keyof Config, key: string, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      [group]: {
        ...config[group],
        [key]: value,
      },
    });
  };

  const handleBlur = async (clave: string, valor: string) => {
    setSaving(true);
    await handleSave(clave, valor);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        await handleSave("logo_url", data.url);
        setConfig((prev) =>
          prev ? { ...prev, general: { ...prev.general, nombre_restaurante: prev.general.nombre_restaurante } } : prev
        );
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#dc2626] border-t-transparent"></div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Gestiona la información de tu restaurante</p>
        </div>
        {saved && (
          <span className="flex items-center gap-2 text-green-600 font-medium animate-pulse">
            <Save className="w-5 h-5" />
            Guardado
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* General Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#dc2626]/10 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#dc2626]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Información General</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Restaurante</label>
              <input
                type="text"
                value={config.general.nombre_restaurante}
                onChange={(e) => handleChange("general", "nombre_restaurante", e.target.value)}
                onBlur={(e) => handleBlur("nombre_restaurante", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
              <input
                type="text"
                value={config.general.slogan}
                onChange={(e) => handleChange("general", "slogan", e.target.value)}
                onBlur={(e) => handleBlur("slogan", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Principal</label>
                <input
                  type="text"
                  value={config.general.telefono}
                  onChange={(e) => handleChange("general", "telefono", e.target.value)}
                  onBlur={(e) => handleBlur("telefono", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Secundario</label>
                <input
                  type="text"
                  value={config.general.telefono_secundario}
                  onChange={(e) => handleChange("general", "telefono_secundario", e.target.value)}
                  onBlur={(e) => handleBlur("telefono_secundario", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={config.general.email}
                onChange={(e) => handleChange("general", "email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <input
                type="text"
                value={config.general.direccion}
                onChange={(e) => handleChange("general", "direccion", e.target.value)}
                onBlur={(e) => handleBlur("direccion", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horario Apertura</label>
                <input
                  type="time"
                  value={config.general.horario_apertura || '10:00'}
                  onChange={(e) => handleChange("general", "horario_apertura", e.target.value)}
                  onBlur={(e) => handleBlur("horario_apertura", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horario Cierre</label>
                <input
                  type="time"
                  value={config.general.horario_cierre || '22:00'}
                  onChange={(e) => handleChange("general", "horario_cierre", e.target.value)}
                  onBlur={(e) => handleBlur("horario_cierre", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Estos horarios determinan si el negocio aparece como "Abierto" o "Cerrado" en el navbar
            </p>
          </div>
        </div>

        {/* Domicilio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Configuración de Domicilio</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domicilio gratis desde (COP)
              </label>
              <input
                type="number"
                value={config.general.domicilio_gratis_desde}
                onChange={(e) => handleChange("general", "domicilio_gratis_desde", e.target.value)}
                onBlur={(e) => handleBlur("domicilio_gratis_desde", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pedidos mayores a este valor tendrán domicilio gratis
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo de domicilio (COP)
              </label>
              <input
                type="number"
                value={config.general.costo_domicilio}
                onChange={(e) => handleChange("general", "costo_domicilio", e.target.value)}
                onBlur={(e) => handleBlur("costo_domicilio", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <SocialIcon platform="facebook" className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Redes Sociales</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input
                type="text"
                placeholder="573009047298"
                value={config.social.whatsapp}
                onChange={(e) => handleChange("social", "whatsapp", e.target.value)}
                onBlur={(e) => handleBlur("whatsapp", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                placeholder="https://facebook.com/tu-pagina"
                value={config.social.facebook_url}
                onChange={(e) => handleChange("social", "facebook_url", e.target.value)}
                onBlur={(e) => handleBlur("facebook_url", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                placeholder="https://instagram.com/tu-cuenta"
                value={config.social.instagram_url}
                onChange={(e) => handleChange("social", "instagram_url", e.target.value)}
                onBlur={(e) => handleBlur("instagram_url", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">SEO</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={config.seo.meta_title}
                onChange={(e) => handleChange("seo", "meta_title", e.target.value)}
                onBlur={(e) => handleBlur("meta_title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Título que aparece en buscadores (máx. 60 caracteres)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={3}
                value={config.seo.meta_description}
                onChange={(e) => handleChange("seo", "meta_description", e.target.value)}
                onBlur={(e) => handleBlur("meta_description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Descripción que aparece en buscadores (máx. 160 caracteres)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

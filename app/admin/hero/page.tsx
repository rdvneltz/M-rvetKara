'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import ImageUploader from '@/components/ImageUploader'

interface Hero {
  id: string
  title: string
  subtitle: string
  description: string
  buttonText: string
  buttonLink: string
  logo?: string
  logoWidth: number
  logoHeight: number
  showButton: boolean
  titleColor?: string
  subtitleColor?: string
  descriptionColor?: string
  active: boolean
}

export default function HeroPage() {
  const { status } = useSession()
  const router = useRouter()
  const [hero, setHero] = useState<Hero | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    logo: '/assets/mk-logo.png',
    logoWidth: 200,
    logoHeight: 200,
    showButton: true,
    titleColor: '#ffffff',
    subtitleColor: '#ffffffE6',
    descriptionColor: '#d4a574',
    active: true,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchHero()
  }, [])

  const fetchHero = async () => {
    try {
      const { data } = await axios.get('/api/hero')
      if (data) {
        setHero(data)
        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          buttonText: data.buttonText,
          buttonLink: data.buttonLink,
          logo: data.logo || '/assets/mk-logo.png',
          logoWidth: data.logoWidth || 200,
          logoHeight: data.logoHeight || 200,
          showButton: data.showButton !== undefined ? data.showButton : true,
          titleColor: data.titleColor || '#ffffff',
          subtitleColor: data.subtitleColor || '#ffffffE6',
          descriptionColor: data.descriptionColor || '#d4a574',
          active: data.active,
        })
      }
    } catch (error) {
      console.error('Hero yüklenemedi', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updatedData = { ...formData }

      if (hero) {
        await axios.put('/api/hero', { id: hero.id, ...updatedData })
      } else {
        await axios.post('/api/hero', updatedData)
      }
      alert('Hero bölümü başarıyla güncellendi!')
      fetchHero()
    } catch (error) {
      console.error('Kaydetme başarısız', error)
      alert('Bir hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-gold-500 hover:text-gold-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-white">Hero Bölümü Yönetimi</h1>
        </div>

        <div className="glass rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Hero Logo</h3>
              <ImageUploader
                currentUrl={formData.logo}
                onUrlChange={(url) => setFormData({ ...formData, logo: url })}
                label="Logo"
                folder="images/logos"
              />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-white mb-2">Logo Genişliği (px)</label>
                  <input
                    type="number"
                    value={formData.logoWidth}
                    onChange={(e) => setFormData({ ...formData, logoWidth: parseInt(e.target.value) || 200 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                    min="50"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Logo Yüksekliği (px)</label>
                  <input
                    type="number"
                    value={formData.logoHeight}
                    onChange={(e) => setFormData({ ...formData, logoHeight: parseInt(e.target.value) || 200 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                    min="50"
                    max="500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Alt Başlık</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                rows={3}
                required
              />
            </div>

            {/* Metin Renkleri */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Metin Renkleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2 text-sm">Başlık Rengi</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.titleColor?.substring(0, 7) || '#ffffff'}
                      onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-white/20 bg-white/10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.titleColor}
                      onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="#ffffff"
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-1" style={{ color: formData.titleColor }}>Önizleme</p>
                </div>
                <div>
                  <label className="block text-white mb-2 text-sm">Alt Başlık Rengi</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.subtitleColor?.substring(0, 7) || '#ffffff'}
                      onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-white/20 bg-white/10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.subtitleColor}
                      onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="#ffffffE6"
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-1" style={{ color: formData.subtitleColor }}>Önizleme</p>
                </div>
                <div>
                  <label className="block text-white mb-2 text-sm">Açıklama Rengi</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.descriptionColor?.substring(0, 7) || '#d4a574'}
                      onChange={(e) => setFormData({ ...formData, descriptionColor: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-white/20 bg-white/10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.descriptionColor}
                      onChange={(e) => setFormData({ ...formData, descriptionColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="#d4a574"
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-1" style={{ color: formData.descriptionColor }}>Önizleme</p>
                </div>
              </div>
              <p className="text-white/40 text-sm mt-4">
                Hex renk kodları desteklenir. Şeffaflık için sonuna 2 karakter ekleyin (ör. #ffffffE6 = %90 beyaz).
              </p>
            </div>

            {/* Buton Ayarları */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Buton Ayarları</h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-white gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={formData.showButton}
                      onChange={(e) => setFormData({ ...formData, showButton: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 text-gold-500 focus:ring-gold-500"
                    />
                    <span className="font-medium">Butonu Göster</span>
                  </label>
                </div>

                {formData.showButton && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                    <div>
                      <label className="block text-white mb-2">Buton Metni</label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                        required={formData.showButton}
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">Buton Linki</label>
                      <input
                        type="text"
                        value={formData.buttonLink}
                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                        required={formData.showButton}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-white gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5"
                />
                Hero Bölümü Aktif
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

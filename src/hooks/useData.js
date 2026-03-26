import { useState, useEffect } from 'react'
import { initialData } from '../data/initialData'

const STORAGE_KEY = 'pns-succession-plan-v1'

export function useData() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialData
    } catch {
      return initialData
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const updateCollaborator = (id, updates) => {
    setData(prev => ({
      ...prev,
      collaborators: prev.collaborators.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }))
  }

  const updateMeta = (updates) => {
    setData(prev => ({ ...prev, meta: { ...prev.meta, ...updates } }))
  }

  const updateHeatmap = (newHeatmap) => {
    setData(prev => ({ ...prev, heatmap: newHeatmap }))
  }

  const importData = (jsonData) => {
    try {
      setData(jsonData)
    } catch (err) {
      console.error('Error importing data', err)
    }
  }

  const addCollaborator = (newCollab) => {
    setData(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, newCollab],
    }))
  }

  const resetData = () => {
    if (window.confirm('¿Restaurar todos los datos al estado inicial? Esta acción no se puede deshacer.')) {
      setData(initialData)
    }
  }

  return { data, setData, updateCollaborator, addCollaborator, updateMeta, updateHeatmap, importData, resetData }
}

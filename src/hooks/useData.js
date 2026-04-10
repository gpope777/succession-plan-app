import { useState, useEffect } from 'react'
import { initialData } from '../data/initialData'

const DEPTS_KEY   = 'pns-depts-v1'
const deptKey     = (id) => `pns-dept-${id}-v1`
const LEGACY_KEY  = 'pns-succession-plan-v1'

const DEFAULT_DEPTS = [
  { id: 'bi', name: 'Business Intelligence', icon: '📊' },
]

function emptyDeptData(name) {
  return {
    ...initialData,
    collaborators: [],
    heatmap: initialData.heatmap
      ? Object.fromEntries(Object.entries(initialData.heatmap).map(([k, v]) =>
          [k, typeof v === 'object' ? Object.fromEntries(Object.keys(v).map(kk => [kk, 3])) : 3]
        ))
      : {},
    meta: { ...initialData.meta, department: name },
  }
}

function loadAllDeptData(depts) {
  const map = {}
  depts.forEach(dept => {
    try {
      const saved = localStorage.getItem(deptKey(dept.id))
      if (saved) {
        map[dept.id] = JSON.parse(saved)
      } else if (dept.id === 'bi') {
        // migrate legacy key
        const legacy = localStorage.getItem(LEGACY_KEY)
        map[dept.id] = legacy ? JSON.parse(legacy) : initialData
      } else {
        map[dept.id] = emptyDeptData(dept.name)
      }
    } catch {
      map[dept.id] = dept.id === 'bi' ? initialData : emptyDeptData(dept.name)
    }
  })
  return map
}

export function useData() {
  const [departments, setDepartments] = useState(() => {
    try {
      const s = localStorage.getItem(DEPTS_KEY)
      return s ? JSON.parse(s) : DEFAULT_DEPTS
    } catch { return DEFAULT_DEPTS }
  })

  const [activeDeptId, setActiveDeptId] = useState('bi')
  const [pendingDelete, setPendingDelete] = useState(null) // { dept, data, timerId }

  const [deptDataMap, setDeptDataMap] = useState(() =>
    loadAllDeptData((() => {
      try { const s = localStorage.getItem(DEPTS_KEY); return s ? JSON.parse(s) : DEFAULT_DEPTS }
      catch { return DEFAULT_DEPTS }
    })())
  )

  // persist departments list
  useEffect(() => {
    localStorage.setItem(DEPTS_KEY, JSON.stringify(departments))
  }, [departments])

  // persist each dept's data
  useEffect(() => {
    Object.entries(deptDataMap).forEach(([id, d]) => {
      localStorage.setItem(deptKey(id), JSON.stringify(d))
    })
  }, [deptDataMap])

  // ── helpers ─────────────────────────────────────────────────────────────
  const updDept = (deptId, updater) =>
    setDeptDataMap(prev => ({
      ...prev,
      [deptId]: typeof updater === 'function' ? updater(prev[deptId] || emptyDeptData('')) : updater,
    }))

  // ── active dept data (backward-compat for all existing pages) ───────────
  const data = deptDataMap[activeDeptId] || initialData

  // ── operations (all operate on activeDeptId) ────────────────────────────
  const updateCollaborator = (id, updates) =>
    updDept(activeDeptId, prev => ({
      ...prev,
      collaborators: prev.collaborators.map(c => {
        if (c.id !== id) return c
        const merged = { ...c, ...updates }
        // Auto-append to evaluationHistory whenever rubricScores or potentialScores is saved
        if (updates.rubricScores || updates.potentialScores) {
          const snapshot = {
            id: `eval_${Date.now()}`,
            date: updates.rubricScores?.lastEvaluated
              || updates.potentialScores?.lastEvaluated
              || new Date().toISOString().split('T')[0],
            type: updates.rubricScores ? 'desempeno' : 'potencial',
            period: updates.rubricScores?.period || c.rubricScores?.period || '',
            targetRole: updates.rubricScores?.targetRole || c.rubricScores?.targetRole || '',
            nineBox: updates.nineBox
              ? { ...c.nineBox, ...updates.nineBox }
              : { ...c.nineBox },
            readinessPercentage: updates.readinessPercentage ?? c.readinessPercentage,
            readinessStatus: updates.readinessStatus ?? c.readinessStatus,
            rubricScores: updates.rubricScores || c.rubricScores || null,
            potentialScores: updates.potentialScores || c.potentialScores || null,
            idpDone: c.idp ? c.idp.flatMap(p => p.actions).filter(a => a.status === 'done').length : 0,
            idpTotal: c.idp ? c.idp.flatMap(p => p.actions).length : 0,
          }
          merged.evaluationHistory = [...(c.evaluationHistory || []), snapshot]
        }
        return merged
      }),
    }))

  const addCollaborator = (newCollab) =>
    updDept(activeDeptId, prev => ({
      ...prev,
      collaborators: [...prev.collaborators, newCollab],
    }))

  const updateMeta = (updates) =>
    updDept(activeDeptId, prev => ({ ...prev, meta: { ...prev.meta, ...updates } }))

  const updateHeatmap = (newHeatmap) =>
    updDept(activeDeptId, prev => ({ ...prev, heatmap: newHeatmap }))

  const importData = (jsonData) => {
    try { updDept(activeDeptId, () => jsonData) } catch (e) { console.error(e) }
  }

  const resetData = () => {
    if (window.confirm('¿Restaurar los datos de este departamento al estado inicial? Esta acción no se puede deshacer.')) {
      updDept(activeDeptId, activeDeptId === 'bi' ? initialData : emptyDeptData(
        departments.find(d => d.id === activeDeptId)?.name || ''
      ))
    }
  }

  const deleteEvaluation = (collabId, evalId) =>
    updDept(activeDeptId, prev => ({
      ...prev,
      collaborators: prev.collaborators.map(c =>
        c.id !== collabId ? c : {
          ...c,
          evaluationHistory: (c.evaluationHistory || []).filter(ev => ev.id !== evalId),
        }
      ),
    }))

  const updateRubricEvaluation = (collabId, rubricData) =>
    updDept(activeDeptId, prev => ({
      ...prev,
      collaborators: prev.collaborators.map(c =>
        c.id === collabId
          ? { ...c,
              nineBox: rubricData.nineBox ?? c.nineBox,
              readinessPercentage: rubricData.readinessPercentage ?? c.readinessPercentage,
              readinessStatus: rubricData.readinessStatus ?? c.readinessStatus,
              rubricScores: rubricData.rubricScores,
            }
          : c
      ),
    }))

  // ── department management ────────────────────────────────────────────────
  const addDepartment = (name, icon = '🏢') => {
    const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) + '_' + Date.now().toString(36)
    const newDept = { id, name, icon }
    setDepartments(prev => [...prev, newDept])
    setDeptDataMap(prev => ({ ...prev, [id]: emptyDeptData(name) }))
    setActiveDeptId(id)
    return id
  }

  const renameDepartment = (id, name) =>
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, name } : d))

  const deleteDepartment = (id) => {
    if (id === 'bi') return // protect default
    const dept     = departments.find(d => d.id === id)
    const deptData = deptDataMap[id]
    if (!dept) return

    // If there was already a pending delete, permanently remove it now
    if (pendingDelete) {
      localStorage.removeItem(deptKey(pendingDelete.dept.id))
    }

    // Remove from UI immediately
    setDepartments(prev => prev.filter(d => d.id !== id))
    setDeptDataMap(prev => { const n = { ...prev }; delete n[id]; return n })
    setActiveDeptId('bi')

    // Keep in memory until user explicitly dismisses or undoes
    setPendingDelete({ dept, data: deptData })
  }

  const undoDelete = () => {
    if (!pendingDelete) return
    setDepartments(prev => [...prev, pendingDelete.dept])
    setDeptDataMap(prev => ({ ...prev, [pendingDelete.dept.id]: pendingDelete.data }))
    setPendingDelete(null)
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    localStorage.removeItem(deptKey(pendingDelete.dept.id))
    setPendingDelete(null)
  }

  return {
    // multi-dept
    departments,
    activeDeptId,
    setActiveDeptId,
    deptDataMap,
    addDepartment,
    renameDepartment,
    deleteDepartment,
    pendingDelete,
    undoDelete,
    confirmDelete,
    // single-dept (backward compat)
    data,
    setData: (d) => updDept(activeDeptId, d),
    updateCollaborator,
    addCollaborator,
    updateMeta,
    updateHeatmap,
    deleteEvaluation,
    updateRubricEvaluation,
    importData,
    resetData,
  }
}

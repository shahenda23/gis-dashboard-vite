import { supabase } from '../lib/supabase'

export interface DashboardPayload {
  id: string
  user_id: string
  title: string
  widgets: any[]
  layers: any[]
  is_public: boolean
  thumbnail: string
  updated_at: string
}

export function getUserDashboards(userId: string) {
  return supabase
    .from('dashboards')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
}

export function getUserPublicDashboards(userId: string) {
  return supabase
    .from('dashboards')
    .select('*')
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
}

export function getDashboardById(id: string) {
  return supabase
    .from('dashboards')
    .select('*')
    .eq('id', id)
    .single()
}

export function saveDashboardRecord(payload: DashboardPayload) {
  return supabase
    .from('dashboards')
    .upsert(payload, { onConflict: 'id' })
}

export function deleteDashboardById(id: string) {
  return supabase
    .from('dashboards')
    .delete()
    .eq('id', id)
}

export function countDashboards() {
  return supabase
    .from('dashboards')
    .select('*', { count: 'exact', head: true })
}

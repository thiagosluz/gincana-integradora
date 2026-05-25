'use server';

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function login(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set('admin_token', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return { success: true };
  }
  return { success: false, error: 'Senha incorreta' };
}

export async function logout() {
  (await cookies()).delete('admin_token');
  revalidatePath('/admin');
}

export async function addScore(formData: FormData) {
  // (Antiga função addScore, mantida caso necessário, mas agora usaremos batch)
  const adminToken = (await cookies()).get('admin_token');
  if (adminToken?.value !== 'true') return { success: false, error: 'Não autorizado' };

  const teamId = formData.get('teamId') as string;
  const pointsStr = formData.get('points') as string;
  const activityId = formData.get('activityId') as string;

  if (!teamId || !pointsStr || !activityId) return { success: false, error: 'Preencha todos os campos' };

  const points = parseInt(pointsStr, 10);
  if (isNaN(points)) {
    return { success: false, error: 'Pontos inválidos' };
  }

  // Transaction via 2 requests (since we don't have RPC setup in SQL)
  // First update team score
  
  // 1. Get current score
  const { data: team, error: fetchError } = await supabaseAdmin
    .from('teams')
    .select('total_score')
    .eq('id', teamId)
    .single();

  if (fetchError || !team) {
    return { success: false, error: 'Erro ao buscar equipe' };
  }

  const newTotal = team.total_score + points;

  // 2. Update team score
  const { error: updateError } = await supabaseAdmin
    .from('teams')
    .update({ total_score: newTotal })
    .eq('id', teamId);

  if (updateError) {
    return { success: false, error: 'Erro ao atualizar pontos da equipe' };
  }

  // 3. Insert score log
  const { error: insertError } = await supabaseAdmin
    .from('score_logs')
    .insert({
      team_id: teamId,
      points: points,
      activity_id: activityId,
    });

  if (insertError) {
    console.error(insertError);
    return { success: false, error: 'Erro ao salvar histórico de pontos' };
  }

  revalidatePath('/');
  return { success: true };
}

export async function addBatchScores(formData: FormData) {
  const adminToken = (await cookies()).get('admin_token');
  if (adminToken?.value !== 'true') return { success: false, error: 'Não autorizado' };

  const activityId = formData.get('activityId') as string;
  if (!activityId) return { success: false, error: 'Selecione uma atividade' };

  // Fetch current teams to do the math safely
  const { data: teams, error: fetchError } = await supabaseAdmin
    .from('teams')
    .select('id, total_score');

  if (fetchError || !teams) return { success: false, error: 'Erro ao buscar equipes' };

  // Collect all updates and inserts
  const updates = [];
  const inserts = [];

  for (const team of teams) {
    const pointsStr = formData.get(`points_${team.id}`) as string;
    if (!pointsStr) continue;
    
    const points = parseInt(pointsStr, 10);
    if (points === 0 || isNaN(points)) continue; // Skip zero points

    updates.push({
      id: team.id,
      total_score: team.total_score + points
    });

    inserts.push({
      team_id: team.id,
      activity_id: activityId,
      points: points
    });
  }

  if (inserts.length === 0) {
    return { success: false, error: 'Nenhuma pontuação maior que zero foi informada' };
  }

  // Execute inserts
  const { error: insertError } = await supabaseAdmin.from('score_logs').insert(inserts);
  if (insertError) {
    console.error(insertError);
    return { success: false, error: 'Erro ao salvar histórico' };
  }

  // Execute updates in a loop since it's only 4 teams and avoids the upsert NOT NULL constraints
  for (const update of updates) {
    const { error: updateError } = await supabaseAdmin
      .from('teams')
      .update({ total_score: update.total_score })
      .eq('id', update.id);
      
    if (updateError) {
      console.error(updateError);
      return { success: false, error: 'Erro ao atualizar pontuação total' };
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function manageActivity(formData: FormData) {
  const adminToken = (await cookies()).get('admin_token');
  if (adminToken?.value !== 'true') return { success: false, error: 'Não autorizado' };

  const name = formData.get('name') as string;
  const action = formData.get('action') as string;

  if (action === 'create') {
    if (!name) return { success: false, error: 'Nome da atividade obrigatório' };

    const { error } = await supabaseAdmin.from('activities').insert({ name });
    if (error) {
      console.error(error);
      return { success: false, error: 'Erro ao criar atividade' };
    }
  }

  revalidatePath('/admin/atividades');
  revalidatePath('/admin/lancamentos');
  return { success: true };
}

export async function manageTeam(formData: FormData) {
  const adminToken = (await cookies()).get('admin_token');
  if (adminToken?.value !== 'true') return { success: false, error: 'Não autorizado' };

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const color = formData.get('color') as string;
  const action = formData.get('action') as string;

  if (!name || !color) return { success: false, error: 'Preencha todos os campos' };

  if (action === 'create') {
    const { error } = await supabaseAdmin.from('teams').insert({ name, color });
    if (error) {
      console.error(error);
      return { success: false, error: 'Erro ao criar equipe' };
    }
  } else if (action === 'update') {
    if (!id) return { success: false, error: 'ID da equipe não informado' };
    const { error } = await supabaseAdmin.from('teams').update({ name, color }).eq('id', id);
    if (error) {
      console.error(error);
      return { success: false, error: 'Erro ao atualizar equipe' };
    }
  }

  revalidatePath('/admin/equipes');
  revalidatePath('/'); // Revalidate public ranking because color/name might have changed
  return { success: true };
}

export async function deleteScoreLog(logId: string) {
  const adminToken = (await cookies()).get('admin_token');
  if (adminToken?.value !== 'true') return { success: false, error: 'Não autorizado' };

  // 1. Fetch the log to get points and team_id before deleting
  const { data: log, error: fetchLogErr } = await supabaseAdmin
    .from('score_logs')
    .select('points, team_id')
    .eq('id', logId)
    .single();

  if (fetchLogErr || !log) return { success: false, error: 'Log não encontrado' };

  // 2. Delete the log
  const { error: deleteErr } = await supabaseAdmin.from('score_logs').delete().eq('id', logId);
  if (deleteErr) return { success: false, error: 'Erro ao excluir log' };

  // 3. Revert points from team
  // First fetch current team points
  const { data: team } = await supabaseAdmin.from('teams').select('total_score').eq('id', log.team_id).single();
  if (team) {
    const newScore = team.total_score - log.points;
    await supabaseAdmin.from('teams').update({ total_score: newScore }).eq('id', log.team_id);
  }

  revalidatePath('/admin/historico');
  revalidatePath('/');
  return { success: true };
}

export async function updateScoreLog(formData: FormData) {
  const adminToken = (await cookies()).get('admin_token');
  if (adminToken?.value !== 'true') return { success: false, error: 'Não autorizado' };

  const id = formData.get('id') as string;
  const newPoints = parseInt(formData.get('points') as string, 10);
  
  if (!id || isNaN(newPoints)) return { success: false, error: 'Dados inválidos' };

  // 1. Fetch current log
  const { data: log, error: fetchLogErr } = await supabaseAdmin
    .from('score_logs')
    .select('points, team_id')
    .eq('id', id)
    .single();

  if (fetchLogErr || !log) return { success: false, error: 'Log não encontrado' };

  const difference = newPoints - log.points;

  if (difference === 0) return { success: true }; // No changes

  // 2. Update log
  const { error: updateErr } = await supabaseAdmin.from('score_logs').update({ points: newPoints }).eq('id', id);
  if (updateErr) return { success: false, error: 'Erro ao atualizar log' };

  // 3. Update team score
  const { data: team } = await supabaseAdmin.from('teams').select('total_score').eq('id', log.team_id).single();
  if (team) {
    const newScore = team.total_score + difference;
    await supabaseAdmin.from('teams').update({ total_score: newScore }).eq('id', log.team_id);
  }

  revalidatePath('/admin/historico');
  revalidatePath('/');
  return { success: true };
}

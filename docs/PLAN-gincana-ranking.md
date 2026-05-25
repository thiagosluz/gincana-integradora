# Plan: Gincana IFG Jataí Ranking

## Overview
Painel de ranking em tempo real para a gincana escolar.
- **Project Type:** WEB (Mobile-first UI)
- **Tech Stack:** Next.js (App Router), Supabase (Realtime, Postgres), Tailwind CSS, Framer Motion.
- **Success Criteria:** 
  1. Ranking público acessível por celular atualiza instantaneamente sem recarregar a página.
  2. Área admin segura permite lançar pontos de forma rápida e eficiente.
  3. Design Light Theme + Brutalist + Arcade (bordas afiadas, sombras sólidas, tipografia pesada).

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS (Vanilla), Framer Motion (Animações).
- Backend/DB: Supabase (Auth, Database, Realtime).
- UI Elements: Customizados 100% (Sem Shadcn/Radix para respeitar o Brutalism).

## File Structure
- `app/page.tsx`: Home pública (Ranking).
- `app/admin/page.tsx`: Dashboard Admin privado.
- `components/ui/`: Cartões brutalistas e tipografia arcade.
- `lib/supabase/`: Configuração e instâncias do cliente Supabase.

## Task Breakdown

1. **[ ] Task 1: Setup Inicial Next.js & Supabase**
   - Agent: `backend-specialist`
   - Skills: `app-builder`, `clean-code`
   - Priority: P0
   - Dependencies: None
   - INPUT: Vazio -> OUTPUT: App Next.js rodando com Supabase Client conectado e variáveis de ambiente configuradas. -> VERIFY: `npm run dev` roda sem erros na porta 3000.

2. **[ ] Task 2: Banco de Dados & RLS (Supabase)**
   - Agent: `database-architect`
   - Skills: `database-design`
   - Priority: P0
   - Dependencies: Task 1
   - INPUT: Supabase Client -> OUTPUT: Tabelas (`teams`, `score_logs`) populadas com equipes Iniciais (Vermelha, Azul, Amarela, Verde) e RLS. -> VERIFY: Consegue puxar as 4 equipes do banco.

3. **[ ] Task 3: Design System (Light Brutalist Arcade)**
   - Agent: `frontend-specialist`
   - Skills: `frontend-design`, `tailwind-patterns`
   - Priority: P1
   - Dependencies: Task 1
   - INPUT: Tailwind puro -> OUTPUT: Configuração de temas, fontes grossas (ex: Space Grotesk/Pixel) e classes utilitárias no `globals.css` para cartões de sombra sólida. -> VERIFY: Card renderizado tem 0px radius e borda preta grossa.

4. **[ ] Task 4: UI do Ranking Público (Mobile-First)**
   - Agent: `frontend-specialist`
   - Skills: `react-best-practices`, `mobile-design`
   - Priority: P2
   - Dependencies: Task 2, Task 3
   - INPUT: Schema DB -> OUTPUT: Lista vertical mobile com design aprovado no plano de implementação. Top 1 em destaque. -> VERIFY: Fica perfeito em viewport de celular no browser.

5. **[ ] Task 5: Supabase Realtime & Animações**
   - Agent: `frontend-specialist`
   - Skills: `react-best-practices`
   - Priority: P2
   - Dependencies: Task 4
   - INPUT: Static UI -> OUTPUT: UI escuta o channel do Supabase. Cartões trocam de lugar usando `<AnimatePresence>` do Framer Motion. -> VERIFY: Nova pontuação injetada direto no painel web muda as ordens sem recarregar.

6. **[ ] Task 6: UI do Painel Admin e Autenticação**
   - Agent: `frontend-specialist`
   - Skills: `clean-code`
   - Priority: P2
   - Dependencies: Task 2, Task 3
   - INPUT: DB Schema -> OUTPUT: Formulário rápido no `/admin` para proteger a rota e postar logs de pontos. -> VERIFY: Rota protegida bloqueia anônimos; form salva ponto no banco com sucesso.

## Phase X: Verification
- [ ] Lint: `npm run lint` passa limpo.
- [ ] Build: `npm run build` cria a versão de produção.
- [ ] UX Audit: Design rigorosamente "Light Brutalism" sem roxo e acessível.

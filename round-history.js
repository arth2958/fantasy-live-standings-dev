/* ROUND HISTORY, shared by standings and projections.
 * Actual scores only: forecasts and Elo estimates stay in the current roster.
 * No season number here. Each page supplies its own published round_scores.
 * To reuse next season, keep this file and its CSS links on both pages.
 */
window.roundHistory = function(scores, current) {
  const section = document.createElement('section');
  section.className = 'round-scores round-history';
  section.setAttribute('aria-label', 'Round scores and player results');
  if (!scores || !scores.length) return section;
  const heading = document.createElement('h3'); heading.textContent = 'Round scores';
  const grid = document.createElement('div'); grid.className = 'round-score-grid';
  const note = document.createElement('p'); note.className = 'round-score-note';
  note.textContent = 'Actual points only. Tap a round to see player results.';
  const panel = document.createElement('div'); panel.className = 'round-result-panel'; panel.hidden = true;
  const reset = document.createElement('button'); reset.className = 'round-reset';
  reset.textContent = 'Back to current roster'; reset.hidden = true;
  const number = n => String(Number(n));
  const buttons = [];
  const gameURL = u => /^https:\/\/lichess\.org\/[A-Za-z0-9]{8,12}(\/(white|black))?$/.test(String(u || ''));
  function show(round, button) {
    buttons.forEach(b => {b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button));});
    section.parentElement.classList.add('view-history');
    panel.replaceChildren(); panel.hidden = false; reset.hidden = false;
    const title = document.createElement('h4');
    title.textContent = `Round ${round.round} · ${number(round.points)} actual points · ${round.finished}/${round.paired} games finished`;
    panel.append(title);
    const players = document.createElement('div'); players.className = 'round-result-players';
    (round.players || []).forEach(player => {
      const card = document.createElement('div'); card.className = 'history-player';
      const games = player.games || [];
      // Multiple games must remain visible, even when a player fills two boards.
      const decided = games.filter(g => g.actual_result != null);
      const status = !games.length ? 'unpaired' : decided.length < games.length ? 'pending' :
        games.length === 1 ? games[0].status : 'mixed';
      card.classList.add(status);
      const name = document.createElement('b'); name.textContent = player.handle;
      const score = document.createElement('small'); score.className = 'history-score';
      score.textContent = `${number(player.points || 0)} pts / ${decided.length} games`;
      card.append(name, score);
      if (!games.length) {
        const line = document.createElement('small'); line.textContent = 'Not playing this round'; card.append(line);
      }
      games.forEach(game => {
        const line = document.createElement('small'); line.className = 'history-game';
        const word = game.actual_result == null ? (game.game_url ? 'Playing' : 'Pending') :
          ({won: 'Win', draw: 'Draw', lost: 'Loss'}[game.status] || 'Final');
        const text = `${word}${game.no_play ? ' (no play)' : ''} vs ${game.opponent}`;
        if (gameURL(game.game_url)) {
          const link = document.createElement('a'); link.href = game.game_url;
          link.target = '_blank'; link.rel = 'noopener'; link.textContent = text;
          link.setAttribute('aria-label', `${player.handle}: ${text}. Open round ${round.round} game`);
          line.append(link);
        } else line.textContent = text;
        card.append(line);
      });
      players.append(card);
    });
    if (!(round.players || []).length) {
      const empty = document.createElement('p'); empty.textContent = 'Player results are not available in this published snapshot yet.'; panel.append(empty);
    }
    panel.append(players);
  }
  scores.forEach(round => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'round-score';
    if (Number(round.round) === Number(current)) button.classList.add('current');
    const available = round.points != null && round.state !== 'unavailable';
    if (!available) button.classList.add('future');
    button.disabled = !available; button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Round ${round.round}: ${available ? number(round.points) + ' actual points. Show player results' : round.state === 'unavailable' ? 'Results unavailable' : 'Upcoming'}`);
    const label = document.createElement('label'); label.textContent = 'R' + round.round;
    const points = document.createElement('b'); points.textContent = available ? number(round.points) : '-';
    const state = document.createElement('small'); state.textContent = round.state === 'final' ? 'Final' : round.state === 'unavailable' ? 'No data' : !available ? 'Upcoming' : 'So far';
    button.append(label, points, state); button.onclick = () => show(round, button);
    buttons.push(button); grid.append(button);
  });
  reset.onclick = () => {
    section.parentElement.classList.remove('view-history'); panel.hidden = true; reset.hidden = true;
    buttons.forEach(b => {b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false');});
  };
  section.append(heading, grid, note, reset, panel);
  return section;
};

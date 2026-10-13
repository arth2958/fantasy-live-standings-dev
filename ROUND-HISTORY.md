# Round scores and player results

This preview adds actual per-round scores to expanded projection teams. On both
Standings and Projections, press R1, R2, or another published round to see the
players, opponents, actual points, and win/draw/loss. A game link opens that
round's game. Pending results are not counted as points. Future rounds have no
results and cannot be opened. "Back to current roster" restores the existing
current-round view and its Elo detail.

Fantasy teams keep their original drafted players. League teams show the
players who actually played for that team in the selected round, including
replacements. A player with two games has both results listed. Forfeits and
other no-play results count as actual points and say "no play"; no game link
is invented. Unpaired fantasy players say "Not playing this round".

## Where to find the changes

- `round-history.js`: the shared buttons and player result cards. All labels
  are plain text, not HTML supplied by team names. It does not calculate
  projections or change official scores.
- `round-history.css`: the shared layout. Four round buttons per row on phones,
  eight on desktops. Card colors use the existing `--result-*` colors in
  `style.css`, so changing the palette there updates history too.
- `s50/app.js`: replaces the old display-only round strip with the shared strip.
- `projections/app.js`: attaches checked fantasy history by owner and league
  history by team name. Actual history does not enter projection rankings.
- `scripts/update_s50.py`: keeps opponents, game links and each individual
  result during the existing pairing pass. The same pass still computes
  official points. Round totals must still equal season points and games.
- `scripts/build_league_players.py`: builds league history from all published
  season games and each round's pairings. Prior totals must match history.
- `s50/index.html`, `projections/index.html`: load the shared files before
  the page app and bump the app cache version.

## Next season

1. Follow the existing season rollover instructions for the standings,
   projections, data paths and entries sheet. In both Python builders change
   the marked `SEASON` setting and season-specific data filenames as usual.
2. If the league changes the number of rounds, change `ROUNDS` in
   `update_s50.py` and the marked `range(1, 9)` in `build_league_players.py`.
   The shared display automatically uses the rounds supplied in the data.
3. Keep the links to `../round-history.css` and `../round-history.js` on the
   new standings and projections pages. Neither shared file has a season
   number to update.
4. Bump every changed CSS/JS `?v=` value before a release so phones do not
   keep using old files.
5. Check the dev site on a phone and desktop. Compare an owner's round
   scores across both pages, open a past round, a current round, an unpaired
   player, a no-play result and a league replacement. Ship only after review.

No workflows were changed for this feature. The existing standings and league
builders already publish their own data files. Projections still runs
independently from production's official standings workflow.

import { html, render } from "lit";

function subset(arra, arra_size) {
  var result_set = [],
    result;

  for (var x = 0; x < Math.pow(2, arra.length); x++) {
    result = [];
    let i = arra.length - 1;
    do {
      if ((x & (1 << i)) !== 0) {
        result.push(arra[i]);
      }
    } while (i--);

    if (result.length == arra_size) {
      result_set.push(result);
    }
  }

  return result_set;
}

function findComplementTeam(group, firstTeam) {
  var complement = [];
  // console.log(firstTeam);
  group.forEach(function (player) {
    if (!firstTeam.includes(player)) {
      complement.push(player);
    }
  });

  return complement;
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export let currentMatch;

/**
 * @param {{name:string, rating:number}[]} players
 * @param {number} players
 */
export function matchmakingBalanced(players, teamSize) {
  var group = getRandom(players, teamSize * 2);

  var possibleFirstTeams = subset(group, teamSize);

  var possibleMatchups = [];

  possibleFirstTeams.forEach(function (team) {
    possibleMatchups.push([team, findComplementTeam(group, team)]);
  });

  possibleMatchups.forEach(function (matchup) {
    var team1sum = 0;
    matchup[0].forEach(function (player) {
      team1sum += player.rating;
    });
    matchup[0].push(team1sum);

    var team2sum = 0;
    matchup[1].forEach(function (player) {
      team2sum += player.rating;
    });
    matchup[1].push(team2sum);

    matchup.push(Math.abs(team1sum - team2sum));
  });

  possibleMatchups.sort(function (a, b) {
    return a[2] - b[2];
  });

  var match = possibleMatchups[0];

  const team1Container = document.getElementById("team1");
  const team2Container = document.getElementById("team2");

  const teamResultTemplate = (players, totalMMR) => {
    return html`
      ${players.map((player) => html` <span>${player.name} - ${player.rating}</span><br />`)}
      <span>Total team MMR: ${totalMMR}</span>
    `;
  };

  render(teamResultTemplate(match[0].slice(0, teamSize), match[0].at(-1)), team1Container);

  render(teamResultTemplate(match[1].slice(0, teamSize), match[1].at(-1)), team2Container);

  document.querySelectorAll(".victoryButton").forEach((button) => {
    button.classList.remove("hidden");
  });

  // console.log(match);
  currentMatch = match;
}

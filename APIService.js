angular.module('tpDP').service.service('APIService',
  ['$http',
  function ($http) {

    const championGGApiKey = 'a2d37013e5dde9b1a81c6af9fc452b18';
    const riotApiKey = 'RGAPI-a2a65d2a-3287-4e3c-8ca9-6d368d3ac000';
    const rhoskoID = 119997;
    const rhoskoAccID = 124898;
    
    this.getChampions = () => {
      $http.get('https://la2.api.riotgames.com/lol/static-data/v3/champions?champListData=image&api_key='+riotApiKey).then((response) => {
        championList = response.data.data;
        _.forEach(championList,(c) => {
          c.games = 0;
          c.wins = 0;
          c.loses = 0;
        })
      })
      return championList;
    }
    
    this.getChampions = (championList) => {
      $http.get('https://la2.api.riotgames.com/lol/match/v3/matchlists/by-account/'+rhoskoAccID +'?api_key='+riotApiKey).then((response)=>{
          const totalMatches = response.data.totalGames;
          const matches = response.data.matches;
          const matchesDate = _(matches).map('timestamp').map((t) => new Date(t)).value();
          let gameDuration = {};
          _.forEach(matches, (mtc) => {
            $interval(() => {
              $http.get('https://la2.api.riotgames.com/lol/match/v3/matches/'+mtc.gameId+'?api_key='+riotApiKey).then((response)=>{
                const match = response.data;
                gameDuration.total += match.gameDuration;
                gameDuration[match.seasonId].total += match.gameDuration;
                const myParticipant = _.filter(match.participantIdentities, (p) => p.player.summonerId === rhoskoID)[0];
                const myTeam = _.filter(match.participants, (p) => p.participantId === myParticipant.participantId)[0];
                if( _.filter(match.teams, (t) => t.teamId === myTeam.teamId)[0].win === 'Win') {
                  match.win=true;
                  _.filter(championList, (c) => c.id === mtc.champion)[0].wins += 1;
                } else {;
                  match.win=false;
                  _.filter(championList, (c) => c.id === mtc.champion)[0].loses += 1;
                }
                _.filter(championList, (c) => c.id === mtc.champion)[0].games += 1;
            })
            },2000);
          });
      });
      return {totalMatches, matchesDate, championList, gameDuration}
    }
  }]);
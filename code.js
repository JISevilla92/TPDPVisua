
//myApp.directive('myDirective', function() {});
//myApp.factory('myService', function() {});
angular.module('tpDP').directive('backImg', function(){
    return {
    scope: { url:'@backImg' },
    link: function(scope, element, attrs){
        scope.$watch('url', function(newValue, oldValue) {
        element.css({
            'background-image': 'url(' + newValue +')'
        });
        });
    }
    };
});
  angular.module('tpDP').controller('DataController', [ 'data', '$timeout',function (data,$timeout) {


    this.show='other';
    const defaultchamp = this.champSelected = {key:'Total'};
    this.backimg = 'images/Total_Splash_0.jpg';

    this.champions = _.orderBy(data.champions().data, 'games', 'desc');
    this.matches = data.matches().matches;
    this.matchesDate = _.map(_.map(this.matches,'timestamp'), (t) => new Date(t));
    this.orderedByYear = _.groupBy(this.matchesDate, (m) => m.getYear());
    this.orderedByYearMonth = _.forEach(this.orderedByYear, (y) => {
      this.orderedByMonth = _.groupBy(y, (m) => m.getMonth())
    });
    this.orderedBySeason  = this.champOrderedBySeason = _.groupBy(this.matches,(m) => m.season);
    this.onclick = (id) => {
      this.champSelected = _.filter(this.champions, (c) => c.id==id)[0];
      this.backimg = 'images/'+this.champSelected.key+'_Splash_0.jpg';
      this.champMatches = _.filter(this.matches, (m) => m.champion === id);
      this.champOrderedBySeason = _.groupBy(this.champMatches,(m) => m.season);
      if(this.show==='season'){
        this.lineChartData  = calculateData();
      } else if (this.show==='monthly') {
        this.lineChartMonthlyData = calculateMonthlyData();
      } else if (this.show==='other') {
        this.barChartCGSData = calculateChampGamesSeason();
      };
    }

    this.champPressed = (id) => {
      this.show='other';
      this.onclick(id);
    }

    this.resetGraph = () => {
      this.champSelected = defaultchamp;
      this.backimg = 'images/Total_Splash_0.jpg';
      this.champMatches = this.matches;
      this.champOrderedBySeason = _.groupBy(this.champMatches,(m) => m.season);
      if(this.show==='season'){
        this.lineChartData  = calculateData();
      } else if (this.show==='monthly') {
        this.lineChartMonthlyData = calculateMonthlyData();
      } else if (this.show==='other') {
        this.barChartCGSData = calculateChampGamesSeason();
      };
    }
    let calculateData = () => {
      return [
      this.champOrderedBySeason[3] ? _.reduce(this.champOrderedBySeason[3], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getDay()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0]) : [0, 0, 0, 0, 0, 0, 0],
      this.champOrderedBySeason[5] ? _.reduce(this.champOrderedBySeason[5], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getDay()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0]) : [0, 0, 0, 0, 0, 0, 0],
      this.champOrderedBySeason[7] ? _.reduce(this.champOrderedBySeason[7], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getDay()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0]) : [0, 0, 0, 0, 0, 0, 0],
      this.champOrderedBySeason[8] ? _.reduce(this.champOrderedBySeason[8], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getDay()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0]) : [0, 0, 0, 0, 0, 0, 0]]
      //return [_.map(_.groupBy(this.champOrderedBySeason[3], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length),
      // _.map(_.groupBy(this.champOrderedBySeason[5], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length),
      // _.map(_.groupBy(this.champOrderedBySeason[7], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length)
      // ,_.map(_.groupBy(this.champOrderedBySeason[8], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length)];
    }
    //console.log(this.orderedBySeason);

    this.recalculate = () => {
        this.lineChartMonthlyData = calculateMonthlyData();
        this.lineChartData  = calculateData();
        this.barChartCGSData = calculateChampGamesSeason();
    };
    let calculateMonthlyData = () => {
      return [_.reduce(this.champOrderedBySeason[3], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getMonth()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      _.reduce(this.champOrderedBySeason[5], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getMonth()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      _.reduce(this.champOrderedBySeason[7], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getMonth()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      _.reduce(this.champOrderedBySeason[8], (dateArray, champ) => {   dateArray[new Date(champ.timestamp).getMonth()] += 1;   return dateArray; }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])]
      //return [_.map(_.groupBy(this.champOrderedBySeason[3], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length),
      // _.map(_.groupBy(this.champOrderedBySeason[5], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length),
      // _.map(_.groupBy(this.champOrderedBySeason[7], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length)
      // ,_.map(_.groupBy(this.champOrderedBySeason[8], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length)];
    }


    let calculateChampGamesSeason = () => {
      return [this.champOrderedBySeason[3] ? this.champOrderedBySeason[3].length : 0,
      this.champOrderedBySeason[5] ? this.champOrderedBySeason[5].length : 0,
      this.champOrderedBySeason[7] ? this.champOrderedBySeason[7].length : 0,
      this.champOrderedBySeason[8] ? this.champOrderedBySeason[8].length : 0]
      //return [_.map(_.groupBy(this.champOrderedBySeason[3], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length),
      // _.map(_.groupBy(this.champOrderedBySeason[5], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length),
      // _.map(_.groupBy(this.champOrderedBySeason[7], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length)
      // ,_.map(_.groupBy(this.champOrderedBySeason[8], (d) => new Date(d.timestamp).getDay()), (wd) => wd.length)];
    }

    this.barChartCGSOptions = {scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }};
    this.barChartCGSColors = ['#0000AA','#00AA00','#AA0000', '#BBBB60']
    this.barChartCGSLabels = ['Season 4','Season 5','Season 6','Season 7'];
    this.barChartCGSSeries = ['Season 4','Season 5','Season 6','Season 7'];
    this.barChartCGSData = calculateChampGamesSeason();

    let mostPlayedChamps = _.take(this.champions,5);
    this.barChartOptions = { legend: { display: true },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }};
    this.barChartColors = ['#0000AA','#00AA00','#AA0000', '#BBBB60']
    this.barChartLabels = _.map(mostPlayedChamps,'key');
    this.barChartSeries = ['Jugadas', 'Ganadas', 'Perdidas'];
    this.barChartData = [_.map(mostPlayedChamps,'games'),
    _.map(mostPlayedChamps,'won'),
    _.map(mostPlayedChamps,'lose')
    ];

    this.lineChartOptions = { legend: { display: true } };
    this.lineChartColors = ['#0000DD','#00DD00','#DD0000', '#BBBB60']
    this.lineChartLabels = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    this.lineChartSeries = ['Season 4','Season 5','Season 6','Season 7'];
    this.lineChartData = calculateData();

    this.lineChartMonthlyOptions = { legend: { display: true } };
    this.lineChartMonthlyColors = ['#0000DD','#00DD00','#DD0000', '#BBBB60']
    this.lineChartMonthlyLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.lineChartMonthlySeries = ['Season 4','Season 5','Season 6','Season 7'];
    this.lineChartMonthlyData = calculateMonthlyData();

    //this.lineChartData = [[10,5,6,3,2,1,7],[1,5,61,32,2,1,7],[102,15,56,33,22,11,7],[10,5,65,35,25,15,17]]
    //this.gameDuration = gameDuration;
    //this.matchesDate = matchesDate;
    
  }]);
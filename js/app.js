// Funcionalidad del producto
window.onload = function() {
  var options = document.getElementById('options-icon');
  options.addEventListener('click', filterPromotions);
}

// funcion para mostrar las promociones de Laboratoria

function filterPromotions(event) {
  var listPromotions = document.getElementById('list-promotions');
  listPromotions.classList.replace('display-none','display-block');
  for (var i = 0; i < listPromotions.children.length; i++) {
    listPromotions.children[i].addEventListener('click',showPromotions);
  }
}

// funvion para mostrar promociones

function showPromotions(event) {
  var newOfficeName = this.textContent;
  var oldOfficeName = document.getElementById('office-name');
  var liPromo = document.createElement('ul');
  liPromo.id = 'li-promo';
  liPromo.innerHTML = '<li>2015-1</li><li>2015-2</li><li>2016-1</li><li>2016-2</li><li>2017-1</li><li>2017-2</li>';
  var promotionsPeriod = this.parentElement.children;
  for (var i = 0; i < promotionsPeriod.length; i++) {
    if (this === promotionsPeriod[i]) {
      this.parentElement.insertBefore(liPromo, promotionsPeriod[i+1]);
    }
  }
  for (var i = 0; i < liPromo.children.length; i++) {
    liPromo.children[i].addEventListener('click', function() {
      var period = this.textContent;
      oldOfficeName.textContent = newOfficeName + ' ' + period;
      var listPromotions = document.getElementById('list-promotions');
      listPromotions.classList.replace('display-block', 'display-none');
      searchData(newOfficeName, period);
    });
  }
}

// funcion para buscar la data correspondiente al filtro de sede y promocion

function searchData(newOfficeName, period) {
  var local;
  if (newOfficeName === 'Lima') {
    local = data['LIM'];
  } else if (newOfficeName === 'Arequipa') {
    local = data['AQP']
  } else if (newOfficeName === 'Santiago de Chile') {
    local = data['SCL'];
  } else if (newOfficeName === 'Ciudad de México') {
    local = data['CDMX'];
  }
  getData(local, period);  
} 

// funcion para obtener la data de la promocion y sede

function getData(local, period) {
  var dataProm = Object.keys(local);
  for (var i = 0; i < dataProm.length; i++) {
    if (dataProm[i] === period) {
      var choiceProm = local[dataProm[i]];
      getValues(choiceProm);
    }
  } 
}

// funcion para obtener los 'valores' de la data 

function getValues(choiceProm) {
  var ratings = choiceProm['ratings'];  
  // enrolled values
  var enrolled = choiceProm['students'].length;
  for (var i = 0; i < enrolled; i++) {
    var numberOfStudentsLeaving = 0;    
    if (choiceProm['students'][i]['active'] === false) {
      numberOfStudentsLeaving++;
    }
  }
  var percentageDropout = Math.round((numberOfStudentsLeaving * 100) / enrolled) ;
  var studentsActive = enrolled - numberOfStudentsLeaving;

  // achievement values
  var targetStudents = 0;  
  for (var i = 0; i < enrolled;) {
    if (choiceProm['students'][i]['active'] === true) {
      var sprints = choiceProm['students'][i]['sprints'];
      var studentAverage = 0;    
      for (var j = 0; j < sprints.length; j++) {
        var scoreTech = sprints[j]['score']['tech'];
        var scoreHse = sprints[j]['score']['hse'];
        var averageForSprint = (scoreTech + scoreHse) / 2 ;
        studentAverage = studentAverage + averageForSprint;  
      }
      if (studentAverage >= 1050 * sprints.length) {
        targetStudents++;
      }
      var targetStudentsPercentage = Math.round((targetStudents * 100) / (studentsActive));
    } 
    i++;
  }

  // NPS values
  var nps = 0;
  for (var i = 0; i < ratings.length; i++) {
    var dataPromoters = ratings[i]['nps']['promoters'];
    var dataPassive = ratings[i]['nps']['passive'];
    var dataDetractors = ratings[i]['nps']['detractors'];
    var numberOfAnswers = dataPromoters + dataPassive + dataDetractors;
    var promoters = dataPromoters / numberOfAnswers * 100 ;
    var passive = dataPassive / numberOfAnswers * 100 ;
    var detractors = dataDetractors / numberOfAnswers * 100 ;    
    var nps = nps + (promoters - detractors);
  }
  var percentageNps = Math.round(nps / ratings.length);
  // enviar values a la función para poder insertarlos
  insertValuesHtml(enrolled, percentageDropout, targetStudents, targetStudentsPercentage, studentsActive, percentageNps);          
}

// funcion para insertar los valores en el document

function insertValuesHtml(enrolled, percentageDropout, targetStudents, targetStudentsPercentage, studentsActive, percentageNps) {
  var enrolledHtml = document.getElementById('enrolled');
  var percentageDropoutHtml = document.getElementById('percentage-dropout');
  var targetStudentsHtml = document.getElementById('target-students');
  var targetStudentsPercentageHtml = document.getElementById('target-students-percentage');
  var totalStudentsHtml = document.getElementById('total-students');
  var percentageNpsHtml = document.getElementById('percentage-NPS');
  enrolledHtml.textContent = enrolled;
  percentageDropoutHtml.textContent = percentageDropout;
  targetStudentsHtml.textContent = targetStudents;
  targetStudentsPercentageHtml.textContent = targetStudentsPercentage;
  totalStudentsHtml.textContent = studentsActive;
  percentageNpsHtml.textContent = percentageNps;
}

// funcionalidad de gráficos


// Puedes hacer uso de la base de datos a través de la variable `data
console.log(data);
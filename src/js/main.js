function readFile(file, callback) {
  const rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == '200') {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

function sendData() {
  const formData = new FormData();
  formData.append('name_property', 'value');
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      console.log(xmlHttp.responseText);
    }
  }
  xmlHttp.open("post", "./php/update.php"); 
  xmlHttp.send(formData);
}

//usage:
readFile('./data.json', function(text) {
  const data = JSON.parse(text);
  const app = document.getElementById('app');
  const _ul = document.createElement('ul');
  _ul.classList.add('list');
  app.appendChild(_ul);
  data.data.forEach(element => {
    const prop = Object.getOwnPropertyNames(element)[0];
    const _li_ul = document.createElement('li');
    _li_ul.classList.add('list-item');
    const link = document.createElement('a');
    link.href = '#';
    link.classList.add('list-item__link');
    link.innerHTML = element[prop][0].name_cat;
    _ul.appendChild(_li_ul);
    _li_ul.appendChild(link);
  });
  const btnSend = document.createElement('button');
  btnSend.textContent ='Отправить';
  btnSend.classList.add('btn-send');
  btnSend.onclick = () => {
    console.log('click');
    sendData();
  }
  app.appendChild(btnSend);

  
});
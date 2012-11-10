$(document).ready(function() {

  renderCharacters();

});

function bindEvents() {
  $('.character-new .save').on('click', function(e) {
    e.preventDefault();
    var container = $(this).closest('.character-new');
    var name = container.find('.name').val();
    var dexterity = container.find('.dexterity').val();
    var wits = container.find('.wits').val();
    var modifier = container.find('.modifier').val();

    if(newCharacter(name, dexterity, wits, modifier)) {
      renderCharacters();
      container.find('input').attr('value','');
    } else {
      alert('Character name must be unique.');
    }
  });

  $('.character button[data-action="save"]').on('click', function(e) {
    console.log("updating character");
    e.preventDefault();
    var container = $(this).closest('.character');
    var character = {
      name: container.find('.name').text(),
      dexterity: container.find('.dexterity').val(),
      wits: container.find('.wits').val(),
      modifier: container.find('.modifier').val()
    };
    setCharacter(character.name,character);
    renderCharacters();
  });

  $('.character button[data-action="delete"]').on('click', function(e) {
    e.preventDefault();
    deleteCharacter($(this).closest('.character').find('.name').text());
    renderCharacters();
  });

  $('#refresh').on('click', function(e) {
    e.preventDefault();
    rollInitiative();
  });
}

function rollInitiative() {
  var characters = loadCharacters();
  $("#init tbody").html('');
  var charlist = [];
  for(var i in characters) {
    console.log(characters[i].name);
    var init = parseInt(characters[i].dexterity) + parseInt(characters[i].wits) + parseInt(characters[i].modifier) + d10();

    console.log(init);
    var charac = characters[i];
    charac.init = init;

    charlist.push(charac);
  }
  charlist.sort(compare);
  console.log(charlist);

  for(var i in charlist) {
    $("#init tbody").append('<tr><td>'+charlist[i].name+'</td><td>'+charlist[i].init+'</td></tr>');
  }
}

function compare(a,b) {
  if (a.init < b.init)
    return 1;
  if (a.init > b.init)
    return -1;
  return 0;
}

function d10() {
  return randomFromInterval(1,10);
}

function randomFromInterval(from,to) {
  return Math.floor(Math.random()*(to-from+1)+from);
}

function renderCharacters() {
  console.log("Rendering...");
  var characters = loadCharacters();
  var charEl = $("#characters tbody");
  charEl.html('');

  for(var i in characters) {
    var html = characterTemplate(characters[i].name, characters[i].dexterity, characters[i].wits, characters[i].modifier);
    charEl.append(html);
  }

  charEl.append('<tr class="character-new">' +
    '<td><input type="text" class="name" name="name"></td>' +
    '<td><input type="text" class="dexterity" name="dexterity"></td>' +
    '<td><input type="text" class="wits" name="wits"></td>' +
    '<td><input type="text" class="modifier" name="modifier"></td>' +
    '<td><button class="btn save"><i class="icon-plus"></i></button></td>' +
  '</tr>');

  bindEvents();
}

function characterTemplate(name, dexterity, wits, modifier) {
  var html = '<tr class="character" id="'+name+'">' +
    '<td><strong class="name">'+name+'</strong></td>' +
    '<td><input type="text" class="dexterity" name="dexterity" value="'+dexterity+'"></td>' +
    '<td><input type="text" class="wits" name="wits" value="'+wits+'"></td>' +
    '<td><input type="text" class="modifier" name="modifier" value="'+modifier+'"></td>' +
    '<td><button class="btn" data-action="save"><i class="icon-pencil"></i></button> <button class="btn" data-action="delete"><i class="icon-remove"></i></button></td>' +
  '</tr>';

  return html;
}

function newCharacter(name, dexterity, wits, modifier) {
  if(typeof modifier == 'undefined') {
    modifier = 0;
  }

  var character = {
    name: name,
    dexterity: dexterity,
    wits: wits,
    modifier: modifier
  }

  var characters = loadCharacters();
  if(typeof characters[name] == 'undefined') {
    console.log('Creating new');
    setCharacter(name,character);
    return true;
  } else {
    console.log('Already exists, returning false...');
    return false;
  }
}

function assertCharacters() {
  if(typeof localStorage.characters == 'undefined') {
    localStorage.characters = JSON.stringify({});
  }
}

function loadCharacters() {
  assertCharacters();
  return JSON.parse(localStorage.characters);
}

function saveCharacters(characters) {
  localStorage.characters = JSON.stringify(characters);
  console.log(characters);
  console.log(localStorage.characters);
}

function getCharacter(name) {
  assertCharacters();
  var characters = loadCharacters();
  return characters[name];
}

function setCharacter(name, character) {
  console.log(name);
  console.log(character);
  assertCharacters();
  var characters = loadCharacters();
  characters[name] = character;
  saveCharacters(characters);
}

function deleteCharacter(name) {
  assertCharacters();
  var characters = loadCharacters();
  delete characters[name];
  saveCharacters(characters);
}


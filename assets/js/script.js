const q = el => document.querySelector(el);
const qAll = el => document.querySelectorAll(el);

const btnKey = qAll('.keyboard > .key');
const btnAction = q('.keyboard .action')
const screenLeft = q('.result-left--screen');
const screenRight = q('.result-right--screen');
const governmentPosition = q('.governmentPosition');
const candidateName = q('.candidateName > span');
const areaDigits = q('.partyDigits > div');
const partyName = q('.partyName > span');
const warning = q('.warning');
const listCandidates = q('#listCandidates');

let data;
let numbers = [];
let currentStage = 0;

let onKeyboard = false, 
    onKeyWhite = false,
    onKeyConfirm = false;

btnKey.forEach(button => button.addEventListener('click', keyboard_Numbers));
btnAction.querySelector('.white').addEventListener('click', btn_White);
btnAction.querySelector('.correct').addEventListener('click', btn_Correct);
btnAction.querySelector('.confirm').addEventListener('click', btn_Confirm);

async function load_Screen() {
    let req = await fetch('assets/js/data.json');
    data = await req.json();

    clean_Screen()
}

load_Screen()

function clean_Screen(){
    areaDigits.innerHTML = '';

    for (i = 0; i < data[currentStage].digits; i++) {
        let span = document.createElement('span');
        
        areaDigits.appendChild(span);
        areaDigits.firstChild.classList.add('blank')
    }

    numbers = [];

    onKeyboard = true;
    onKeyWhite = false;
    onKeyConfirm = false;

    governmentPosition.innerHTML = data[currentStage].title;
    areaDigits.closest('.partyDigits').classList.remove('invisible');

    warning.innerHTML = '';
    screenRight.innerHTML = '';
    screenLeft.querySelector('.candidateName > span').innerHTML = '';
    screenLeft.querySelector('.partyName > span').innerHTML = '';
    
    warning.classList.add('invisible');
    screenLeft.querySelector('h1').classList.add('invisible');
    screenLeft.querySelector('.candidateName').classList.add('invisible');
    screenLeft.querySelector('.candidateName').classList.remove('displayNone');
    screenLeft.querySelector('.partyName').classList.add('invisible');
    screenLeft.querySelector('.partyName').classList.remove('displayNone');
    screenLeft.querySelector('ul').classList.remove('displayNone');

    listCandidates.querySelector('tbody').innerHTML = '';

    table();
}

function keyboard_Numbers(event){
    const key = event.target.innerHTML;
    const highlighted = areaDigits.querySelector('.blank');

    if (onKeyboard) {
        numbers.push(key);

        highlighted.innerHTML = key;
        highlighted.classList.remove('blank');
    }
    
    if (numbers.length !== data[currentStage].digits) {

        highlighted.nextElementSibling.classList.add('blank');

    } else if(onKeyboard){
        onKeyboard = false;

        verify_Candidate()
    }
}

function verify_Candidate() {
    onKeyboard = false;

    let V_numbers = numbers.join('');
    let V_candidates = data[currentStage].candidates

    let candidate = V_candidates.find(c => (c.number == V_numbers) ? true : false );

    if(candidate !== undefined) {
        new is_Identified(candidate);
    } else {
        new no_Identified(candidate);
    }
}

class is_Identified {
    constructor(candidate){
        qAll('.invisible').forEach(el => el.classList.remove('invisible'));

        screenLeft.querySelector('.candidateName > span').innerHTML = candidate.name;
        screenLeft.querySelector('.partyName > span').innerHTML = candidate.party;

        for (let i = 0; i < candidate.pictures.length; i++) {
            let c = candidate.pictures[i];

            let El_figure = document.createElement('figure');
            let El_img = document.createElement('img');
            let El_figcaption = document.createElement('figcaption');

            screenRight.appendChild(El_figure);
            El_figure.appendChild(El_img);
            El_figure.appendChild(El_figcaption);

            if (c.small) {
                El_figure.classList.add('smallPicture')
            }

            El_img.src = "media/"+c.url;
            El_figcaption.innerHTML = c.subtitle;
        }

        onKeyConfirm = true;
    }
}

class no_Identified {
    constructor(candidate) {
        onKeyWhite = false;

        screenLeft.querySelector('.candidateName').classList.add('displayNone');
        screenLeft.querySelector('.partyName').classList.add('displayNone');

        warning.classList.remove('invisible');

        warning.innerHTML = 'Wrong number';
    }
}

function btn_White() {
    if (numbers.length < areaDigits.children.length) {
        onKeyWhite = true;
        
        screenLeft.querySelector('ul').classList.add('displayNone');
        screenLeft.querySelector('h1').classList.remove('invisible');
        warning.classList.remove('invisible');

        warning.innerHTML = 'Annul the vote';
    }
}

function btn_Correct() {
    if ((numbers.length > 0 ) || onKeyWhite) {
        clean_Screen()
    } 
}

function btn_Confirm() {

   switch(true) {
        case (onKeyConfirm || onKeyWhite):

            if(data[(currentStage+1)] !== undefined) {
                currentStage++;
    
                clean_Screen()
            } else {
                finish()
            }

        ; break;
   }
}

function finish() {

    btnKey.forEach(button => button.removeEventListener('click', keyboard_Numbers));
    btnAction.querySelector('.white').removeEventListener('click', btn_White);
    btnAction.querySelector('.correct').removeEventListener('click', btn_Correct);
    btnAction.querySelector('.confirm').removeEventListener('click', btn_Confirm);

    screenLeft.querySelector('h1').classList.add('invisible');
    screenLeft.querySelector('ul').classList.add('displayNone');
    screenRight.classList.add('displayNone');
    q('.guide-screen').classList.add('invisible');

    warning.innerHTML = '';
    warning.style.fontSize = 6 + 'em';
    warning.classList.remove('blank');
    warning.classList.remove('invisible');

    let El_span = document.createElement('span');
    let El_progress = document.createElement('progress');

    let percentage = 0;
    let maximumLimit = 100;

    let percentageIndex = setInterval(()=>{
        
        percentage++;
        
        governmentPosition.innerHTML = 'Salving vote...';

        El_span.innerHTML = percentage+'%';
        El_progress.setAttribute('id', 'bar-loading');
        El_progress.setAttribute('value', percentage);
        El_progress.setAttribute('max', maximumLimit);

        warning.innerHTML = '';
        warning.appendChild( El_span);
        warning.appendChild(El_progress);

        if (percentage == maximumLimit) {
            clearInterval(percentageIndex);

            setTimeout(() => {
                governmentPosition.classList.add('invisible');
                warning.classList.add('blank');

                warning.innerHTML = 'END';
            }, 1000)
        }
        
    }, 20)

    listCandidates.querySelector('tbody').innerHTML = '';
}

function table() {
    let tbody = listCandidates.querySelector('tbody');

    data[currentStage].candidates.map((candidate, index) => {
        let El_tr = document.createElement('tr');
        
        tbody.appendChild(El_tr);

        for (let i in candidate) {
            let El_td = document.createElement('td');
    
            El_tr.appendChild(El_td);
        }

        var Item_td = tbody.querySelector(`tr:nth-child(${(index+1)})`).children;

        Item_td.item(0).innerHTML = `<img src="media/${candidate.pictures[0].url}" alt="${candidate.name.replace(" ", "_")}">`;
        Item_td.item(1).innerHTML = candidate.name;
        Item_td.item(2).innerHTML = candidate.party;
        Item_td.item(3).innerHTML = candidate.number;
    })
}


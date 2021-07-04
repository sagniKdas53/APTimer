let current = 0;
let max = 0;
let perUnit = 0;
let now = 0;
let end = 0;
let savedAt = 0;
let expiresAt = 0;
let timeinterval = 0;
let accumulator = 0;
let refresh = 2000;

function loadData() {
    try {
        savedAt = parseInt(Cookies.get("savedAt"));
        expiresAt = parseInt(Cookies.get("ExpAt"));
        perUnit = parseInt(Cookies.get("perUnit"));
        max = parseInt(Cookies.get("max"));
        current = parseInt(Cookies.get("current"));
        //console.log(typeof max);
        if (Cookies.get("saveMaxState") == 'true') {
            document.getElementById("MaxEn").checked = true;
            document.getElementById("max").value = max;
        } else {
            document.getElementById("MaxEn").checked = false;
            document.getElementById("max").value = "";
        }
        if (Cookies.get("savePerState") == 'true') {
            document.getElementById("perEn").checked = true;
            document.getElementById("perUnit").value = perUnit;
        } else {
            document.getElementById("perEn").checked = false;
            document.getElementById("perUnit").value = "";
        }
        if (Cookies.get("CurrState") == 'true') {
            let instant =Date.now();
            //console.log(new Date(instant),new Date(expiresAt));
            //if time has alredy passed
            if(instant>expiresAt){
                current = max;
            }else{
                //calc ap now
                current = current+Math.floor(((expiresAt - instant)/(perUnit*600000)));
            }
            document.getElementById("SavedEn").checked = true;
            document.getElementById("current").value = current;
            getData();
        } else {
            document.getElementById("SavedEn").checked = false;
            document.getElementById("current").value = "";
        }
    } catch (err) {
        savedAt = 0;
        expiresAt = 0;
        perUnit = 0;
        max = 0;
        current = 0;
        document.getElementById("MaxEn").checked = false;
        document.getElementById("perEn").checked = false;
    }
    //saveCookies();
}


function saveCookies() {
    Cookies.set("max", max, { expires: 30 });
    Cookies.set("savedAt", savedAt, { expires: 30 });
    Cookies.set("ExpAt", expiresAt, { expires: 30 });
    Cookies.set("current", current, { expires: 30 });
    Cookies.set("perUnit", perUnit, { expires: 30 });
    Cookies.set("saveMaxState", document.getElementById("MaxEn").checked, { expires: 30 });
    Cookies.set("savePerState", document.getElementById("perEn").checked, { expires: 30 });
    Cookies.set("CurrState", document.getElementById("SavedEn").checked, { expires: 30 });
}

function getData() {
    current = parseInt(document.getElementById("current").value);
    max = parseInt(document.getElementById("max").value);
    perUnit = parseInt(document.getElementById("perUnit").value);
    if (isNaN(current) || isNaN(max) || isNaN(perUnit)) {
        alert("Fill up the fields");
    } else {
        now = Date.now();
        end = getEnd();
        savedAt = now;
        expiresAt = end;
        saveCookies();
        //updateClock();
        timeinterval = setInterval(updateClock, refresh);
    }
    return false;
}

function getEnd() {
    return parseInt(now + ((max - current) * perUnit) * 60000);
}

// clock 

function getTimeRemaining(endtime) {
    const total = endtime - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
}

function initClock(endtime) {
    //const clock = document.getElementById('clockdiv');
    const daysSpan = document.getElementById('days');
    const hoursSpan =document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const t = getTimeRemaining(endtime);

    daysSpan.innerHTML = ('0'+t.days).slice(-2);
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
}

function updateClock() {
    accumulator += 1;
    //console.log(accumulator);
    //const clock = document.getElementById('clockdiv');
    const daysSpan = document.getElementById('days');
    const hoursSpan =document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const t = getTimeRemaining(end);

    daysSpan.innerHTML = ('0'+t.days).slice(-2);
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    if (accumulator == ((perUnit * 60000) / refresh)) {
        console.log('updated');
        accumulator = 0;
        current = parseInt(document.getElementById("current").value) + 1;
        document.getElementById("current").value = current;
        Cookies.set("current", current, { expires: 30 });
        Cookies.set("savedAt", Date.now(), { expires: 30 });
        /* this can be used to calcuale on initilaization if the tumer has run out and if it has, 
        then we can show default values else load the new ones and upate the current one
        there is a log in savinng the cookies for example this: 1624391420967-1624391362958 = 58009
        insted of 60000
        (a comment end was here)*/
    }
    if (t.total <= 0) {
        clearInterval(timeinterval);
        daysSpan.innerHTML = '00';
        hoursSpan.innerHTML = '00';
        minutesSpan.innerHTML = '00';
        secondsSpan.innerHTML = '00';
    }
    //updateClock();
}

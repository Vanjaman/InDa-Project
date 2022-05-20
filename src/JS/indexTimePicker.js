// This file makes it possible to pick a date & time in the index.html file.
// The default date & time shown is the current date & time.
// The date & time picked will be the time & date used when clicking on a building
// and entering the building view.
//
// (in future update) Picking a date & time will color the different buildings depending
// on how booked they are.
// 
// Author: Vincent Lindvall
// Date: 2022-05-17

var d = new Date(); // used only temporary to set initial values for date- and time-picker
// Set initial date to current date
const inputDate = document.querySelector('#date-picker');
inputDate.value = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2, '0')+'-'+String(d.getDate()).padStart(2, '0');
// set initial time to current time
const inputTime = document.querySelector('#time-picker');
inputTime.value = String(d.getHours()).padStart(2, '0')+':'+String(d.getMinutes()).padStart(2, '0');

// store the date & time selected
sessionStorage.setItem("date", inputDate.value);
sessionStorage.setItem("time", inputTime.value);

// Change stored date when changing it
inputDate.addEventListener('input', () => {
    sessionStorage.setItem("date", inputDate.value);
  });
// Change stored time when changing it
inputTime.addEventListener('input', () => {
    sessionStorage.setItem("time", inputTime.value);
})
const maxepisodes = 300;
let currentepisodes = 15;

const percentageCircle = document.querySelector('.percentage-circle');
const increButton = document.getElementById('testbutton');

increButton.addEventListener('click', () => {
    currentepisodes = parseFloat(currentepisodes)
    let percent = (currentepisodes/maxepisodes) * 100;
    console.log(percent);
    document.getElementById('narutopercent').style.setProperty('--percentage', percent);
    currentepisodes += 1;
});

percentageCircle.addEventListener('mouseenter', () => {
    percentageCircle.classList.add('persistent-animation');
});

percentageCircle.addEventListener('mouseleave', () => {
    percentageCircle.classList.remove('persistent-animation');
});
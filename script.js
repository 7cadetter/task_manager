const maxepisodes = 300;
let currentepisodes = 15;

const percentageCircle = document.querySelector('.percentage-circle');
const increButton = document.getElementById('testbutton');

increButton.addEventListener('click', () => {
    currentepisodes += 1; // Increment the value first
    let currentepisodes2 = parseFloat(currentepisodes)
    let percent = (currentepisodes2/maxepisodes) * 100;
    console.log(percent);
    document.getElementById('narutopercent').style.setProperty('--percentage', percent);
    const episodesContent = `${currentepisodes}/300`;
    console.log(episodesContent); // Log the content value
    document.getElementById('narutoinner').innerText = episodesContent;
    
});

percentageCircle.addEventListener('mouseenter', () => {
    percentageCircle.classList.add('persistent-animation');
});

percentageCircle.addEventListener('mouseleave', () => {
    percentageCircle.classList.remove('persistent-animation');
});
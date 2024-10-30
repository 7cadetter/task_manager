const maxepisodes = 300;
let currentepisodes = 295;

const percentageCircle = document.querySelector('.percentage-circle');
const innerCircle = document.querySelector('.innercircle');
const text1 = document.querySelector('.text1');
const increButtons = document.getElementsByClassName('addbutton');
const decreButtons = document.getElementsByClassName('removebutton');

fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => {
        const mediaContainer = document.getElementById('mediaContainer');
        data.forEach(item => {
            const div = document.createElement('div');
            const title = item.title;
            const episodes = item.episodes;
            const watched = item.watched;
            div.innerHTML = `${title}, ${episodes}, ${watched}`;
            mediaContainer.appendChild(div);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

Array.from(increButtons).forEach(button => {
    button.addEventListener('click', () => {
        if (currentepisodes < maxepisodes)
        {
            currentepisodes += 1;
            let currentepisodes2 = parseFloat(currentepisodes);
            let percent = (currentepisodes2 / maxepisodes) * 100;
            console.log(percent);
            document.getElementById('narutopercent').style.setProperty('--percentage', percent);
            const episodesContent = `${currentepisodes}/300`;
            document.querySelector('.text1').innerText = episodesContent;
            let percentage = parseInt(percent);
            document.querySelector('.text2').innerText = `${percentage}%`;
        }
    });
});

Array.from(decreButtons).forEach(button => {
    button.addEventListener('click', () => {
        if (currentepisodes > 0)
        {
            currentepisodes -= 1;
            let currentepisodes2 = parseFloat(currentepisodes);
            let percent = (currentepisodes2 / maxepisodes) * 100;
            console.log(percent);
            document.getElementById('narutopercent').style.setProperty('--percentage', percent);
            const episodesContent = `${currentepisodes}/300`;
            document.querySelector('.text1').innerText = episodesContent;
            let percentage = parseInt(percent);
            document.querySelector('.text2').innerText = `${percentage}%`;
        }
    });
});

percentageCircle.addEventListener('mouseenter', () => {
    percentageCircle.classList.add('persistent-animation');
    text1.classList.add('lowering_anim');
});

percentageCircle.addEventListener('mouseleave', () => {
    percentageCircle.classList.remove('persistent-animation');
    text1.classList.remove('lowering_anim');
});
const percentageCircles = document.querySelectorAll('.percentage-circle');

fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => {

        data.forEach(item => {
            const episodes = item.episodes;
            const watched = item.watched;
            const percent = (watched / episodes) * 100;

            const box = document.querySelector(`.itembox[id="${item.id}"]`)

            box.setAttribute('data-current', item.watched);
            box.setAttribute('data-max', item.episodes);
            const circle = box.querySelector(`.percentage-circle`);
            if (circle) {
                circle.style.setProperty('--percentage', percent);

                const innerText = circle.querySelector('.innercircle .text1');
                const percentageText = circle.querySelector('.innercircle .text2');

                if (innerText) innerText.textContent = `${watched}/${episodes}`;
                if (percentageText) percentageText.textContent = `${Math.round(percent)}%`;
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));


const addButtons = document.querySelectorAll('.addbutton');
const removeButtons = document.querySelectorAll('.removebutton');

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const itemBox = button.closest('.itembox');
        const currentEpisodes = parseInt(itemBox.getAttribute('data-current'));
        const maxEpisodes = parseInt(itemBox.getAttribute('data-max'));

        if (currentEpisodes < maxEpisodes) {
            incrementWatched(itemBox.id, '+');
            const newEpisodes = currentEpisodes + 1;
            itemBox.setAttribute('data-current', newEpisodes);
            const percent = (newEpisodes / maxEpisodes) * 100;

            const percentCircle = itemBox.querySelector('.percentage-circle');
            percentCircle.style.setProperty('--percentage', percent);

            const innerCircle = itemBox.querySelector('.innercircle');
            innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
            innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
        }
    });
});

removeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const itemBox = button.closest('.itembox');
        const currentEpisodes = parseInt(itemBox.getAttribute('data-current'));
        const maxEpisodes = parseInt(itemBox.getAttribute('data-max'));

        if (currentEpisodes > 0) {
            incrementWatched(itemBox.id, '-');
            const newEpisodes = currentEpisodes - 1;
            itemBox.setAttribute('data-current', newEpisodes);
            const percent = (newEpisodes / maxEpisodes) * 100;

            const percentCircle = itemBox.querySelector('.percentage-circle');
            percentCircle.style.setProperty('--percentage', percent);

            const innerCircle = itemBox.querySelector('.innercircle');
            innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
            innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
        }
    });
});

percentageCircles.forEach(circle => {
    const innerCircle = circle.querySelector('.innercircle');
    const text1 = innerCircle.querySelector('.text1');

    circle.addEventListener('mouseenter', () => {
        circle.classList.add('persistent-animation');
        text1.classList.add('lowering_anim');
    });

    circle.addEventListener('mouseleave', () => {
        circle.classList.remove('persistent-animation');
        text1.classList.remove('lowering_anim');
    });
});

function incrementWatched(id, inorde) {
    fetch(`http://localhost:3000/data/${inorde}/${id}`, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to increment record');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error incrementing data:', error));
}

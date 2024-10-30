const percentageCircle = document.querySelector('.percentage-circle');
const innerCircle = document.querySelector('.innercircle');
const text1 = document.querySelector('.text1');

// fetch('http://localhost:3000/data')
//     .then(response => response.json())
//     .then(data => {
//         const mediaContainer = document.getElementById('mediaContainer');
//         data.forEach(item => {
//             const div = document.createElement('div');
//             const title = item.title;
//             const episodes = item.episodes;
//             const watched = item.watched;
//             div.innerHTML = `${title}, ${episodes}, ${watched}`;
//             mediaContainer.appendChild(div);
//         });
//     })
//     .catch(error => console.error('Error fetching data:', error));

document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.addbutton');
    const removeButtons = document.querySelectorAll('.removebutton');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemBox = button.closest('.itembox');
            const currentEpisodes = parseInt(itemBox.getAttribute('data-current'));
            const maxEpisodes = parseInt(itemBox.getAttribute('data-max'));

            if (currentEpisodes < maxEpisodes) {
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
});

percentageCircle.addEventListener('mouseenter', () => {
    percentageCircle.classList.add('persistent-animation');
    text1.classList.add('lowering_anim');
});

percentageCircle.addEventListener('mouseleave', () => {
    percentageCircle.classList.remove('persistent-animation');
    text1.classList.remove('lowering_anim');
});
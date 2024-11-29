const titleInput = document.getElementById('titleInput');
const episodesInput = document.getElementById('episodesInput');
const addItemButton = document.getElementById('addItemButton');

// Connect to Render database and create item box for each data
fetch('https://taskmanager-5si3.onrender.com/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(item => {
            createItemBox(item);
        })
    })
    .catch(error => console.error('Error fetching data:', error));


// If a button is clicked
document.body.addEventListener('click', function(event) {
    // If the button is the add button
    if (event.target.classList.contains('addbutton')) {
        const parentbox = event.target.closest('.itembox');
        const currentEpisodes = parseInt(parentbox.getAttribute('data-current'));
        const maxEpisodes = parseInt(parentbox.getAttribute('data-max'));

        // Increment the episodes of the item
        if (currentEpisodes < maxEpisodes) {
            incrementWatched(parentbox.id, '+');
            const newEpisodes = currentEpisodes + 1;
            parentbox.setAttribute('data-current', newEpisodes);
            const percent = (newEpisodes / maxEpisodes) * 100;

            // Update the percentage circle with new percentage
            const percentCircle = parentbox.querySelector('.percentage-circle');
            percentCircle.style.setProperty('--percentage', percent);

            const innerCircle = parentbox.querySelector('.innercircle');
            innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
            innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
        }
    // If the button is the remove button
    } else if (event.target.classList.contains('removebutton')) {
        const parentbox = event.target.closest('.itembox');
        const currentEpisodes = parseInt(parentbox.getAttribute('data-current'));
        const maxEpisodes = parseInt(parentbox.getAttribute('data-max'));

        // Decrement the episodes of the item
        if (currentEpisodes > 0) {
            incrementWatched(parentbox.id, '-');
            const newEpisodes = currentEpisodes - 1;
            parentbox.setAttribute('data-current', newEpisodes);
            const percent = (newEpisodes / maxEpisodes) * 100;

            // Update the percentage circle with new percentage
            const percentCircle = parentbox.querySelector('.percentage-circle');
            percentCircle.style.setProperty('--percentage', percent);

            const innerCircle = parentbox.querySelector('.innercircle');
            innerCircle.querySelector('.text1').innerText = `${newEpisodes}/${maxEpisodes}`;
            innerCircle.querySelector('.text2').innerText = `${Math.round(percent)}%`;
        }  
    // If the button is the finish button
    } else if (event.target.classList.contains('finishbutton')) {
        const parentbox = event.target.closest('.itembox');

        // Remove the item after confirming through warning
        if (confirm("Are you sure you want to remove " + parentbox.querySelector('.boxtitle').innerText + "?") == true) {
            deleteRow(parentbox.id);
        }
    }
})

/*
Will update the watched episodes in the database when called. 'inorde' contains a + or - to know if it's
incremented or decrementing the episodes
*/
function incrementWatched(id, inorde) {
    fetch(`https://taskmanager-5si3.onrender.com/data/${inorde}/${id}`, {
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

// If the add item button is clicked, add a row with details entered
addItemButton.addEventListener('click', () => {
    const title = titleInput.value;
    const episodes = parseInt(episodesInput.value);

    if (title && episodes > 0) {
        addRow(title, episodes);
        
        titleInput.value = '';
        episodesInput.value = '';
    } else {
        alert('Please enter a valid title and number of episodes.');
    }
});

// Adds inputted item's data into the database
function addRow(title, episodes) {
    console.log("Adding row with title:", title, "and episodes:", episodes);

    fetch('https://taskmanager-5si3.onrender.com/data', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            episodes: episodes,
        }),
    })
    .then(response => {
        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error('Failed to add data');
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received from server:", data);
        createItemBox(data);
    })
    .catch(error => console.error('Error adding data:', error));
}

// Deletes the data of the item from the database
function deleteRow(id) {
    console.log("Removing row ID", id);
    const itemBox = document.querySelector(`.itembox[id='${id}']`);
    
    fetch('https://taskmanager-5si3.onrender.com/data', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        }),
    })
    .then(response => {
        console.log("Response received:", response);
        if (!response.ok) {
            throw new Error('Failed to remove data');
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received from server:", data);
        if (itemBox) {
            itemBox.remove();
        }
    })
    .catch(error => console.error('Error removing data:', error));
}


// Visually creates the HTML element to show on the website
function createItemBox(item) {
    const percent = (item.watched / item.episodes) * 100;

    // Outer box
    const box = document.createElement("div");
    box.className = "itembox";
    box.setAttribute('id', item.id);

    // Image on left of box
    const boximg = document.createElement("img");
    boximg.className = "boximg";
    box.appendChild(boximg);

    // Content in right of box
    const content = document.createElement("div");
    content.className = "boxcontent";
    box.appendChild(content);

    // Title of the item
    const boxtitle = document.createElement("p");
    boxtitle.className = "boxtitle";
    content.appendChild(boxtitle);

    // Outer percentage circle (with gradient)
    const circle = document.createElement("div");
    circle.className = "percentage-circle";
    content.appendChild(circle);
    circle.style.setProperty('--percentage', percent);
    
    // Inner percentage circle (with details)
    const inner = document.createElement("div");
    inner.className = "innercircle";
    circle.appendChild(inner);

    // Amount of episodes watched in inner circle
    const text1 = document.createElement("span");
    text1.className = "text1";
    inner.appendChild(text1);
    text1.textContent = `${item.watched}/${item.episodes}`;

    // Play animation when circle is hovered over, and back to normal when mouse leaves
    circle.addEventListener('mouseenter', () => {
        circle.classList.add('persistent-animation');
        text1.classList.add('lowering_anim');
    });

    circle.addEventListener('mouseleave', () => {
        circle.classList.remove('persistent-animation');
        text1.classList.remove('lowering_anim');
    });

    // Percentage out of max episodes in inner circle
    const text2 = document.createElement("span");
    text2.className = "text2";
    inner.appendChild(text2);
    text2.textContent = `${Math.round(percent)}%`;

    // Box of actions at bottom of box
    const actions = document.createElement("div");
    actions.className = "actionsbox";
    content.appendChild(actions);

    // Add an episode
    const addbutton = document.createElement("button");
    addbutton.className = "addbutton";
    actions.appendChild(addbutton);
    addbutton.setAttribute('type', 'button');
    addbutton.textContent = "Add Episode";

    // Remove an episode
    const removebutton = document.createElement("button");
    removebutton.className = "removebutton";
    actions.appendChild(removebutton);
    removebutton.setAttribute('type', 'button');
    removebutton.textContent = "Remove Episode";

    // Finish series (remove element)
    const finishbutton = document.createElement("button");
    finishbutton.className = "finishbutton";
    actions.appendChild(finishbutton);
    finishbutton.setAttribute('type', 'button');
    finishbutton.textContent = "Finish";

    // Add data to attributes
    boxtitle.innerText = item.title;
    box.setAttribute('data-current', item.watched);
    box.setAttribute('data-max', item.episodes);
    boximg.setAttribute('src', item.image);
    boximg.setAttribute('alt', item.title);

    document.body.appendChild(box);
}
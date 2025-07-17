document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-bar').value;
    fetch(`/api/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '';
            data.forEach(patent => {
                const patentCard = document.createElement('div');
                patentCard.className = 'patent-card';
                patentCard.innerHTML = `
                    <h3>${patent.title}</h3>
                    <p><strong>ID:</strong> ${patent.id}</p>
                    <p>${patent.abstract}</p>
                `;
                resultsContainer.appendChild(patentCard);
            });
        });
});

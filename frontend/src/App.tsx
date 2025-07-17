import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import PatentTable from './components/PatentTable';
import { Patent } from './types/patent';

function App() {
  const [status, setStatus] = useState('loading...');
  const [patents, setPatents] = useState<Patent[]>([]);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'));

    // Initial search to load all patents
    handleSearch('');
  }, []);

  const handleSearch = (query: string) => {
    fetch('/api/patents/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword: query }),
    })
      .then((res) => res.json())
      .then((data) => setPatents(data))
      .catch(() => setPatents([]));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PatentScope Navigator</h1>
        <p>Backend status: {status}</p>
      </header>
      <main>
        <SearchBar onSearch={handleSearch} />
        <PatentTable patents={patents} />
      </main>
    </div>
  );
}

export default App;

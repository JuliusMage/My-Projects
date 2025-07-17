import React from 'react';
import { Patent } from '../types/patent';

interface PatentTableProps {
  patents: Patent[];
}

const PatentTable: React.FC<PatentTableProps> = ({ patents }) => {
  if (patents.length === 0) {
    return <p>No patents found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Publication Date</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {patents.map((patent) => (
          <tr key={patent.id}>
            <td>{patent.id}</td>
            <td>{patent.title}</td>
            <td>{patent.publication_date}</td>
            <td>{patent.country}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatentTable;

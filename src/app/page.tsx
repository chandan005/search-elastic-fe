'use client';
import { useState } from 'react';
import axios from 'axios';

interface SearchResult {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: {
    abn: {
      status: string;
      statusFromDate: string;
      value: string;
    };
    entityType: {
      type: string;
      value: string;
    };
    mainEntity: {
      nonIndividualName: {
        type: string;
        value: string;
      };
      businessAddress: {
        state: string;
        postCode: string;
      };
    };
    asic: {
      type: string;
      value: string;
    };
    gst: {
      status: string;
      statusFromDate: string;
    };
    otherEntity?: {
      nonIndividualName?: {
        type: string;
        value: string;
      };
    };
  };
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [template, setTemplate] = useState('wildcard_search_template');
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    try {
      const searchResponse = await axios.post('http://localhost:9200/abn/_search/template', {
        id: template,
        params: {
          field: field,
          value: value,
        },
      });
      console.log(searchResponse);
      setResults(searchResponse.data.hits.hits);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ABN Search</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Template</label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-md text-black"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="wildcard_search_template">Wildcard Search</option>
          <option value="range_query_template">Range Query</option>
          <option value="exact_match_template">Exact Match</option>
          <option value="fuzzy_proximity_template">Fuzzy Proximity</option>
          <option value="phrase_proximity_template">Phrase Proximity</option>
          <option value="multi_match_boost_template">Multi-Match Boost</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Field</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md text-black"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Value</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md text-black"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleSearch}
      >
        Search
      </button>
      <ul className="mt-4">
        {results.map((result, index) => (
          <li key={index} className="border-b border-gray-300 py-2">
            <div><strong>ABN:</strong> {result._source.abn.value} ({result._source.abn.status})</div>
            <div><strong>Entity Type:</strong> {result._source.entityType.value}</div>
            <div><strong>Main Entity Name:</strong> {result._source.mainEntity.nonIndividualName.value}</div>
            <div><strong>Business Address:</strong> {result._source.mainEntity.businessAddress.state} {result._source.mainEntity.businessAddress.postCode}</div>
            {result._source.otherEntity?.nonIndividualName?.value && (
              <div><strong>Other Entity Name:</strong> {result._source.otherEntity.nonIndividualName.value}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

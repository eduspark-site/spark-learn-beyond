import { Batch, Subject, Lecture } from './types';

const BASE_URL = 'https://bkl-tawny.vercel.app/api';

export async function fetchBatches(): Promise<Batch[]> {
  console.log('[API] Fetching batches...');
  const response = await fetch(`${BASE_URL}/batches`);
  if (!response.ok) throw new Error('Failed to fetch batches');
  const json = await response.json();
  console.log('[API] Raw batches response:', json);
  const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
  console.log('[API] Batches parsed:', data.length, 'items');
  if (data.length > 0) {
    console.log('[API] First batch:', JSON.stringify(data[0]));
  }
  return data;
}

export async function fetchSubjects(batchId: string): Promise<Subject[]> {
  console.log('[API] Fetching subjects with batchId:', batchId);
  const url = `${BASE_URL}/subjects?batchId=${batchId}`;
  console.log('[API] Subjects URL:', url);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch subjects');
  const json = await response.json();
  console.log('[API] Raw subjects response:', json);
  // API returns: { data: { subjects: [...] } }
  const data = json.data?.subjects || [];
  console.log('[API] Subjects parsed:', data.length, 'items');
  if (data.length > 0) {
    console.log('[API] First subject:', JSON.stringify(data[0]));
  }
  return data;
}

export async function fetchLectures(batchId: string, subjectId: string): Promise<Lecture[]> {
  console.log('[API] Fetching lectures for batchId:', batchId, 'subjectId:', subjectId);
  const url = `${BASE_URL}/lectures?batchId=${batchId}&subjectId=${subjectId}`;
  console.log('[API] Lectures URL:', url);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch lectures');
  const json = await response.json();
  console.log('[API] Raw lectures response:', json);
  // API returns: { data: { chapters: [...] } }
  const data = json.data?.chapters || [];
  console.log('[API] Lectures parsed:', data.length, 'items');
  return data;
}

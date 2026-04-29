import fs from 'fs';
import path from 'path';

export interface College {
  name: string;
  type: string;
  location: string;
}

export interface CounsellingInfo {
  id: string;
  name: string;
  url: string;
  status: string;
  colleges: College[];
}

const DATA_DIR = path.join(process.cwd(), 'apna_counsellor', 'counselings_data');

export async function getAllCounsellingIds() {
  if (!fs.existsSync(DATA_DIR)) return [];
  const dirs = fs.readdirSync(DATA_DIR);
  return dirs.filter(dir => fs.statSync(path.join(DATA_DIR, dir)).isDirectory());
}

export async function getCounsellingData(id: string): Promise<CounsellingInfo | null> {
  const counsellingDir = path.join(DATA_DIR, id);
  if (!fs.existsSync(counsellingDir)) return null;

  const infoPath = path.join(counsellingDir, 'info.json');
  const collegesPath = path.join(counsellingDir, 'colleges.json');

  let info = { name: id, url: '', status: '' };
  if (fs.existsSync(infoPath)) {
    info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
  }

  let colleges: College[] = [];
  if (fs.existsSync(collegesPath)) {
    colleges = JSON.parse(fs.readFileSync(collegesPath, 'utf8'));
  }

  return {
    id,
    ...info,
    colleges,
  };
}

export async function getAllCounsellingData(): Promise<CounsellingInfo[]> {
  const ids = await getAllCounsellingIds();
  const data = await Promise.all(ids.map(id => getCounsellingData(id)));
  return data.filter((item): item is CounsellingInfo => item !== null);
}

export interface CategorizedCounselling {
  national: { id: string; name: string }[];
  state: { id: string; name: string }[];
  international: { id: string; name: string }[];
}

export async function getCategorizedCounselling(): Promise<CategorizedCounselling> {
  const ids = (await getAllCounsellingIds()) || [];
  const all = await Promise.all(ids.map(async id => {
    try {
      const counsellingDir = path.join(DATA_DIR, id);
      const infoPath = path.join(counsellingDir, 'info.json');
      let name = id.replace(/_/g, ' ');
      if (fs.existsSync(infoPath)) {
        const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
        name = info.name || name;
      }
      return { id, name };
    } catch (e) {
      return { id, name: id.replace(/_/g, ' ') };
    }
  }));
  
  const nationalIds = ['JoSAA', 'CSAB', 'NEET_UG', 'MCC_Medical', 'AACCC_AYUSH', 'JEE_Main', 'JEE_Advanced', 'DASA'];
  const stateIds = [
    'Maharashtra', 'Madhya_Pradesh', 'Uttar_Pradesh', 'Delhi', 'Gujarat', 
    'Karnataka', 'Kerala', 'Tamil_Nadu', 'Telangana', 'West_Bengal', 
    'Andhra_Pradesh', 'Bihar', 'Chhattisgarh', 'Goa', 'Haryana', 
    'Himachal', 'Jharkhand', 'Odisha', 'Punjab', 'Rajasthan', 'Uttarakhand'
  ];
  
  return {
    national: (all || []).filter(c => nationalIds.includes(c.id)),
    state: (all || []).filter(c => stateIds.includes(c.id)),
    international: (all || []).filter(c => !nationalIds.includes(c.id) && !stateIds.includes(c.id)).slice(0, 20)
  };
}

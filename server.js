import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_MASTER_KEY = process.env.ADMIN_MASTER_KEY || 'woosung8949';

// Supabase client initialization (optional)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ewaxcjwygzfvsbuxnyix.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (supabaseKey && supabaseKey.trim() !== '') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase] Initialized successfully with URL:', supabaseUrl);
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client, using local database mode:', err.message);
  }
} else {
  console.log('[Database Mode] Running in local JSON storage mode (Supabase keys not set).');
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directory for file uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Data file setup for local storage
const dataDir = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'trucks.json');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Multer Storage Setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'truck-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('이미지 파일(jpg, jpeg, png)만 첨부 가능합니다.'));
  }
});

// Utility functions for local JSON DB
const readLocalTrucks = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const content = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading local trucks json:', err);
    return [];
  }
};

const writeLocalTrucks = (trucks) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(trucks, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local trucks json:', err);
  }
};

const getTodayDateFormatted = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// ==========================================
// API Endpoints
// ==========================================

// File Upload endpoint
app.post('/api/upload', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'refImages', maxCount: 10 }
]), (req, res) => {
  try {
    const mainFile = req.files?.mainImage ? req.files.mainImage[0] : null;
    const refFiles = req.files?.refImages || [];

    const mainImageUrl = mainFile ? `/uploads/${mainFile.filename}` : null;
    const referenceImageUrls = refFiles.map(f => `/uploads/${f.filename}`);

    return res.json({
      success: true,
      mainImageUrl,
      referenceImageUrls
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// Single image upload
app.post('/api/upload/single', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.json({ success: true, imageUrl });
});

// GET /api/trucks - List trucks with filtering & search
app.get('/api/trucks', async (req, res) => {
  try {
    const {
      search,
      registration_type,
      category,
      manufacturer,
      year,
      month,
      location,
      sort
    } = req.query;

    let trucks = [];

    if (supabase) {
      let query = supabase.from('trucks').select('*');
      if (registration_type && registration_type !== '전체') {
        query = query.eq('registration_type', registration_type);
      }
      if (category && category !== '전체') {
        query = query.eq('category', category);
      }
      if (manufacturer && manufacturer !== '전체') {
        query = query.eq('manufacturer', manufacturer);
      }
      if (location && location !== '전체') {
        query = query.eq('location', location);
      }
      const { data, error } = await query;
      if (!error && data) {
        trucks = data;
      } else {
        console.warn('Supabase query error, fallback to local DB:', error);
        trucks = readLocalTrucks();
      }
    } else {
      trucks = readLocalTrucks();
    }

    // In-memory Filtering & Search logic
    let filtered = trucks.filter(item => {
      if (registration_type && registration_type !== '전체' && item.registration_type !== registration_type) {
        return false;
      }
      if (category && category !== '전체' && item.category !== category) {
        return false;
      }
      if (manufacturer && manufacturer !== '전체' && item.manufacturer !== manufacturer) {
        return false;
      }
      if (location && location !== '전체' && item.location !== location) {
        return false;
      }
      if (year && year !== '전체') {
        const itemYear = item.year_month ? item.year_month.split('.')[0] : '';
        if (itemYear !== year) return false;
      }
      if (month && month !== '전체') {
        const itemMonth = item.year_month ? String(parseInt(item.year_month.split('.')[1] || '0', 10)) : '';
        if (itemMonth !== String(parseInt(month, 10))) return false;
      }
      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        const searchTarget = `${item.model_name || ''} ${item.company_name || ''} ${item.manufacturer || ''} ${item.location || ''} ${item.description || ''}`.toLowerCase();
        if (!searchTarget.includes(q)) return false;
      }
      return true;
    });

    // Sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'views_desc') {
      filtered.sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
    } else {
      // Default: Latest created_at / id
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    console.error('GET /api/trucks error:', err);
    return res.status(500).json({ success: false, message: '게시물 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// GET /api/trucks/:id - Detail view with auto view counter increment
app.get('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      // Increment view counter via RPC or standard update
      await supabase.rpc('increment_truck_views', { truck_id: id }).catch(() => {});
      const { data, error } = await supabase.from('trucks').select('*').eq('id', id).single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    // Local DB fallback
    const trucks = readLocalTrucks();
    const index = trucks.findIndex(t => String(t.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
    }

    // Auto increment views count
    trucks[index].views = (trucks[index].views || 0) + 1;
    writeLocalTrucks(trucks);

    return res.json({ success: true, data: trucks[index] });
  } catch (err) {
    console.error('GET /api/trucks/:id error:', err);
    return res.status(500).json({ success: false, message: '게시물 상세 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// Password verification helper ( 영문 + 숫자 4자 이상 )
const isValidPassword = (pwd) => {
  if (!pwd || typeof pwd !== 'string') return false;
  // Must be alphanumeric and at least 4 characters long
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,}$/;
  return regex.test(pwd);
};

// Verify authorization (Author Password or Admin Master Key)
app.post('/api/verify-auth', async (req, res) => {
  const { id, password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: '비밀번호를 입력해주세요.' });
  }

  // Check Admin Master Key
  if (password === ADMIN_MASTER_KEY) {
    return res.json({ success: true, isAdmin: true, message: '관리자 마스터 키로 인증되었습니다.' });
  }

  if (!id) {
    return res.status(400).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
  }

  // Check Author Password
  let targetTruck = null;
  if (supabase) {
    const { data } = await supabase.from('trucks').select('password_hash').eq('id', id).single();
    if (data) targetTruck = data;
  }

  if (!targetTruck) {
    const trucks = readLocalTrucks();
    targetTruck = trucks.find(t => String(t.id) === String(id));
  }

  if (!targetTruck) {
    return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
  }

  if (targetTruck.password_hash === password) {
    return res.json({ success: true, isAdmin: false, message: '작성자 비밀번호가 확인되었습니다.' });
  }

  return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
});

// POST /api/trucks - Create new truck post
app.post('/api/trucks', async (req, res) => {
  try {
    const {
      registration_type,
      category,
      year_month,
      condition_grade,
      manufacturer,
      location,
      model_name,
      price,
      company_name,
      contact_number,
      password,
      main_image_url,
      engine_power,
      transmission,
      payment_type,
      mileage,
      reference_images,
      description
    } = req.body;

    // Required fields validation
    if (!registration_type || !category || !year_month || !condition_grade || !manufacturer || !location || !model_name || price === undefined || price === '' || !company_name || !contact_number || !password || !main_image_url) {
      return res.status(400).json({
        success: false,
        message: '필수 항목(구분, 분류, 제작년월, 상태, 제작사, 위치, 모델명, 가격, 상호, 연락처, 비밀번호, 대표 사진)을 모두 입력 및 첨부해 주세요.'
      });
    }

    // Password rule validation (영문+숫자 4자 이상)
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 영문과 숫자를 조합하여 4자 이상 입력해야 합니다.'
      });
    }

    const todayDate = getTodayDateFormatted();
    const newTruck = {
      id: String(Date.now()),
      registration_type,
      category,
      year_month,
      condition_grade,
      manufacturer,
      location,
      model_name,
      price: Number(price),
      company_name,
      contact_number,
      password_hash: password,
      main_image_url,
      engine_power: engine_power ? Number(engine_power) : null,
      transmission: transmission || null,
      payment_type: payment_type || null,
      mileage: mileage ? Number(mileage) : null,
      reference_images: Array.isArray(reference_images) ? reference_images : [],
      description: description || '',
      views: 0,
      created_at: todayDate,
      updated_at: todayDate
    };

    if (supabase) {
      const { data, error } = await supabase.from('trucks').insert([newTruck]).select().single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
      console.warn('Supabase insert error, saving to local database:', error);
    }

    // Local DB save
    const trucks = readLocalTrucks();
    trucks.unshift(newTruck);
    writeLocalTrucks(trucks);

    return res.json({ success: true, data: newTruck });
  } catch (err) {
    console.error('POST /api/trucks error:', err);
    return res.status(500).json({ success: false, message: '게시물 등록 중 오류가 발생했습니다.' });
  }
});

// PUT /api/trucks/:id - Update truck post
app.put('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      auth_password,
      registration_type,
      category,
      year_month,
      condition_grade,
      manufacturer,
      location,
      model_name,
      price,
      company_name,
      contact_number,
      new_password,
      main_image_url,
      engine_power,
      transmission,
      payment_type,
      mileage,
      reference_images,
      description
    } = req.body;

    const trucks = readLocalTrucks();
    const targetIndex = trucks.findIndex(t => String(t.id) === String(id));
    const targetLocalTruck = targetIndex !== -1 ? trucks[targetIndex] : null;

    // Verify Password or Master Key
    const isMasterKey = auth_password === ADMIN_MASTER_KEY;
    const isCorrectPassword = targetLocalTruck && targetLocalTruck.password_hash === auth_password;

    if (!isMasterKey && !isCorrectPassword) {
      return res.status(401).json({ success: false, message: '수정 권한이 없습니다. 작성 시 비밀번호 또는 관리자 마스터 키가 일치하지 않습니다.' });
    }

    const updatedDate = getTodayDateFormatted();
    const finalPassword = new_password && isValidPassword(new_password) ? new_password : (targetLocalTruck ? targetLocalTruck.password_hash : auth_password);

    const updatedData = {
      registration_type,
      category,
      year_month,
      condition_grade,
      manufacturer,
      location,
      model_name,
      price: Number(price),
      company_name,
      contact_number,
      password_hash: finalPassword,
      main_image_url,
      engine_power: engine_power ? Number(engine_power) : null,
      transmission: transmission || null,
      payment_type: payment_type || null,
      mileage: mileage ? Number(mileage) : null,
      reference_images: Array.isArray(reference_images) ? reference_images : [],
      description: description || '',
      updated_at: updatedDate
    };

    if (supabase) {
      const { data, error } = await supabase.from('trucks').update(updatedData).eq('id', id).select().single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    if (targetIndex !== -1) {
      trucks[targetIndex] = { ...trucks[targetIndex], ...updatedData };
      writeLocalTrucks(trucks);
      return res.json({ success: true, data: trucks[targetIndex] });
    }

    return res.status(404).json({ success: false, message: '수정할 게시물을 찾을 수 없습니다.' });
  } catch (err) {
    console.error('PUT /api/trucks/:id error:', err);
    return res.status(500).json({ success: false, message: '게시물 수정 중 오류가 발생했습니다.' });
  }
});

// DELETE /api/trucks/:id - Delete truck post
app.delete('/api/trucks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { auth_password } = req.body;

    if (!auth_password) {
      return res.status(400).json({ success: false, message: '비밀번호 또는 관리자 마스터 키를 입력해야 합니다.' });
    }

    const trucks = readLocalTrucks();
    const targetIndex = trucks.findIndex(t => String(t.id) === String(id));
    const targetLocalTruck = targetIndex !== -1 ? trucks[targetIndex] : null;

    const isMasterKey = auth_password === ADMIN_MASTER_KEY;
    const isCorrectPassword = targetLocalTruck && targetLocalTruck.password_hash === auth_password;

    if (!isMasterKey && !isCorrectPassword) {
      return res.status(401).json({ success: false, message: '삭제 권한이 없습니다. 작성 시 비밀번호 또는 관리자 마스터 키가 일치하지 않습니다.' });
    }

    if (supabase) {
      await supabase.from('trucks').delete().eq('id', id);
    }

    if (targetIndex !== -1) {
      trucks.splice(targetIndex, 1);
      writeLocalTrucks(trucks);
    }

    return res.json({ success: true, message: '게시물이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error('DELETE /api/trucks/:id error:', err);
    return res.status(500).json({ success: false, message: '게시물 삭제 중 오류가 발생했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 우성특장차매매 Server running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});

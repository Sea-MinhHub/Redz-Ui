import { db } from '../../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// DANH SÁCH CÁC CHUỖI USER-AGENT CỦA TRÌNH DUYỆT PHỔ BIẾN
const BROWSER_AGENTS = ['Mozilla', 'Chrome', 'Safari', 'Firefox', 'Edg'];

// HÀM NÀY CHẠY TRÊN SERVER CỦA VERCEL (BACKEND)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).send('Method Not Allowed');
  }

  const rawId = req.query.id;
  const userAgent = req.headers['user-agent'] || '';
  
  // 1. KIỂM TRA USER-AGENT: NẾU LÀ TRÌNH DUYỆT -> CHUYỂN HƯỚNG
  const isBrowser = BROWSER_AGENTS.some(agent => userAgent.includes(agent));
  
  if (isBrowser) {
      // Chuyển hướng người dùng sang trang kiểm tra/đếm ngược
      return res.redirect(302, `/raw/check/${rawId}`);
  }
  
  // 2. NẾU KHÔNG PHẢI TRÌNH DUYỆT (loadstring, curl, etc.)
  
  if (!rawId) {
    return res.status(400).send('Bad Request: Missing ID');
  }

  try {
    const q = query(collection(db, 'raw_codes'), where('rawId', '==', rawId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return res.status(404).send('Not Found');
    }

    const docData = snapshot.docs[0].data();

    // 3. KIỂM TRA QUYỀN TRUY CẬP:
    if (!docData.isPublic) {
        // Nếu là Riêng Tư, Backend chặn truy cập
        return res.status(403).send('Forbidden: This code is private.');
    }

    // 4. Nếu là Công Khai VÀ không phải trình duyệt: TRẢ VỀ RAW SẠCH
    
    // Đặt Content-Type thành text/plain
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    return res.status(200).send(docData.code);

  } catch (error) {
    console.error('Error fetching raw code:', error);
    return res.status(500).send('Internal Server Error');
  }
}

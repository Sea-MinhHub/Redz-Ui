import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut, MAX_RAW_LIMIT } from '../utils/firebase';
import CodeList from '../components/CodeList';

const DarkBlue = 'var(--dark-blue)';
const PrimaryColor = 'var(--primary-color)';

const Container = styled.div`
  max-width: 900px;
  margin: 30px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  text-align: center;
`;

const Title = styled.h1`
  color: ${DarkBlue};
  margin-bottom: 25px;
  border-bottom: 2px solid ${PrimaryColor};
  padding-bottom: 10px;
`;

const AuthStatus = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${PrimaryColor};
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.3s;
  margin: 5px;
  background-color: ${props => props.primary ? DarkBlue : '#f44336'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const CodeArea = styled.div`
  text-align: left;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid ${PrimaryColor};
  border-radius: 8px;
  background-color: #f9f9f9;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const CodeInput = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: monospace;
  font-size: 14px;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & > * {
    margin-left: 10px;
  }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    position: relative;
    text-align: left;
`;

const RawDisplay = styled.pre`
    white-space: pre-wrap;
    background-color: #272822;
    color: #f8f8f2;
    padding: 10px;
    border-radius: 6px;
    overflow-x: auto;
    max-height: 200px;
    margin-top: 10px;
`;

// HÀM TẠO ID MỚI (Từ 2 đến 20 chữ và số, mặc định 12)
const generateShortId = (length = 12) => {
    length = Math.min(Math.max(length, 2), 20); 
    
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [code, setCode] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [userRaws, setUserRaws] = useState([]);
  const [limitMessage, setLimitMessage] = useState('');
  const [modal, setModal] = useState({ visible: false, id: '', content: '' });

  const loadUserRawCodes = async (uid) => {
    if (!uid) return;
    try {
      const q = query(collection(db, 'raw_codes'), where('userId', '==', uid));
      const snapshot = await getDocs(q);
      const raws = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserRaws(raws.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));

      if (raws.length >= MAX_RAW_LIMIT) {
        setLimitMessage(`Đã đạt giới hạn ${MAX_RAW_LIMIT} raw code.`);
      } else {
        setLimitMessage(`Bạn đã tạo ${raws.length}/${MAX_RAW_LIMIT} raw code.`);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách code:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserRawCodes(user.uid);
    } else {
      setUserRaws([]);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return alert('Bạn cần đăng nhập để thực hiện chức năng này.');
    if (!code.trim()) return alert('Vui lòng nhập code.');

    if (userRaws.length >= MAX_RAW_LIMIT) {
      return alert(limitMessage);
    }

    try {
      let rawCodeId = generateShortId();
      let isDuplicate = true;
      let attempts = 0;
      while (isDuplicate && attempts < 5) {
          const q = query(collection(db, 'raw_codes'), where('rawId', '==', rawCodeId));
          const snapshot = await getDocs(q);
          if (snapshot.empty) {
              isDuplicate = false;
          } else {
              rawCodeId = generateShortId(); 
              attempts++;
          }
      }
      if (isDuplicate) throw new Error("Không thể tạo ID duy nhất.");

      await addDoc(collection(db, 'raw_codes'), {
        code: code,
        isPublic: isPublic,
        userId: user.uid,
        createdAt: serverTimestamp(),
        rawId: rawCodeId, 
      });

      setModal({ visible: true, id: rawCodeId, content: code });
      setCode('');
      setIsPublic(true);
      loadUserRawCodes(user.uid); 
    } catch (error) {
      console.error("Lỗi khi lưu code:", error);
      alert("Lỗi khi lưu code: " + error.message);
    }
  };

  const handleDelete = async (rawId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa raw code này?')) return;
    if (!user) return alert('Lỗi xác thực.');

    try {
        const itemToDelete = userRaws.find(raw => raw.rawId === rawId);
        if (!itemToDelete) return alert('Không tìm thấy Raw Code này.');
        
        await deleteDoc(doc(db, 'raw_codes', itemToDelete.id));
        alert('Xóa thành công!');
        loadUserRawCodes(user.uid);
    } catch (error) {
        console.error("Lỗi khi xóa code:", error);
        alert("Lỗi khi xóa code.");
    }
  };

  if (loading) return <Container><h1>Đang tải...</h1></Container>;

  return (
    <Container>
      <Title>Sea | Minh Protect</Title>

      <AuthStatus>
        {user ? (
          <>
            <p>Xin chào, **{user.displayName}** ({user.email}).</p>
            <Button onClick={logOut}>Đăng xuất</Button>
          </>
        ) : (
          <Button primary onClick={signInWithGoogle}>Đăng nhập bằng Google</Button>
        )}
      </AuthStatus>

      <CodeArea visible={!!user}>
        <h3>Khung Code Mới</h3>
        <CodeInput
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập code của bạn vào đây..."
        />
        
        <ControlButtons>
          <input 
            type="radio" 
            id="public-radio" 
            name="privacy" 
            checked={isPublic} 
            onChange={() => setIsPublic(true)}
          />
          <label htmlFor="public-radio">Công Khai</label>
          
          <input 
            type="radio" 
            id="private-radio" 
            name="privacy" 
            checked={!isPublic} 
            onChange={() => setIsPublic(false)}
          />
          <label htmlFor="private-radio">Riêng Tư</label>
          
          <Button primary onClick={handleSubmit}>Nhập (Submit)</Button>
        </ControlButtons>
      </CodeArea>

      {user && (
        <>
          <h3 style={{ marginTop: '30px', textAlign: 'left' }}>
            Các Raw Code Của Bạn (Tối đa {MAX_RAW_LIMIT})
          </h3>
          <p style={{ color: userRaws.length >= MAX_RAW_LIMIT ? 'red' : DarkBlue, textAlign: 'left' }}>
            {limitMessage}
          </p>
          <CodeList 
            raws={userRaws} 
            onDelete={handleDelete}
            onShowModal={setModal}
          />
        </>
      )}
      
      {/* Modal hiển thị Raw Link và Code */}
      {modal.visible && (
        <ModalOverlay onClick={() => setModal({ visible: false, id: '', content: '' })}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <span 
                    style={{ float: 'right', cursor: 'pointer', fontSize: '28px' }}
                    onClick={() => setModal({ visible: false, id: '', content: '' })}
                >&times;</span>
                <h2>Raw Code Đã Tạo</h2>
                <p>Link Raw Sạch (ID: **{modal.id}**):</p>
                <a href={`/raw/${modal.id}`} target="_blank" rel="noopener noreferrer">
                    {`${window.location.origin}/raw/${modal.id}`}
                </a>
                <p>Nội dung:</p>
                <RawDisplay>{modal.content}</RawDisplay>
                <Button primary onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/raw/${modal.id}`);
                    alert('Đã copy link!');
                }}>Copy Link Raw</Button>
            </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

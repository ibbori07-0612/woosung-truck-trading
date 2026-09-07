import React, { useState } from 'react';
import { X, Lock, Key, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthPasswordModal({ actionType, truck, onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('비밀번호 또는 관리자 마스터 키를 입력해주세요.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      await onConfirm(password);
    } catch (err) {
      setErrorMsg(err.message || '비밀번호 검증 실패: 일치하지 않습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key className="count-highlight" size={20} />
            <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>
              {actionType === 'delete' ? '게시물 삭제 비밀번호 검증' : actionType === 'edit' ? '게시물 수정 비밀번호 검증' : '관리자 마스터 키 인증'}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
            {actionType === 'admin'
              ? '관리자 마스터 키를 입력하여 전체 관리자 권한을 활성화합니다.'
              : '게시물 등록 시 입력한 작성자 비밀번호(영문+숫자 4자 이상) 또는 관리자 마스터 키를 입력해 주세요.'}
          </p>

          {errorMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--accent-red)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', marginBottom: 16, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>비밀번호 / 마스터 키</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 42, width: '100%' }}
                placeholder="비밀번호 또는 마스터 키 입력..."
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                autoFocus
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              취소
            </button>
            <button type="submit" className={`btn ${actionType === 'delete' ? 'btn-danger' : 'btn-primary'}`} disabled={isVerifying}>
              <CheckCircle size={16} />
              <span>{isVerifying ? '확인 중...' : '인증 완료'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

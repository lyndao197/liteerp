import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ActivationResetPassword.css';

export default function ActivationResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const username = useMemo(() => {
    const email = searchParams.get('email');
    const user = searchParams.get('username');
    return email || user || 'trang@viettel.com.vn';
  }, [searchParams]);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password.length < 8) {
      setError('Mật khẩu mới cần tối thiểu 8 ký tự.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.');
      return;
    }

    setError('');
    setIsSuccess(true);
  };

  return (
    <div className="activation-reset-page">
      <div className="activation-reset-glow activation-reset-glow-left" />
      <div className="activation-reset-glow activation-reset-glow-right" />

      <div className="activation-reset-card">
        {!isSuccess ? (
          <>
            <header className="activation-reset-header">
              <h1>Đặt lại mật khẩu</h1>
              <p>Vui lòng đặt mật khẩu mới để kích hoạt tài khoản của bạn.</p>
            </header>

            <form className="activation-reset-form" onSubmit={handleSubmit}>
              <div className="field-group">
                <label>Tên đăng nhập</label>
                <div className="field-input with-icon field-disabled">
                  <User size={16} />
                  <input type="text" value={username} disabled />
                </div>
              </div>

              <div className="field-group">
                <label>Mật khẩu mới</label>
                <div className="field-input with-icon">
                  <Lock size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label>Xác nhận mật khẩu mới</label>
                <div className="field-input with-icon">
                  <Lock size={16} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error ? <p className="field-error">{error}</p> : null}

              <button className="reset-submit-btn" type="submit">
                Đặt lại mật khẩu
              </button>
            </form>
          </>
        ) : (
          <div className="activation-success-state">
            <h2>Kích hoạt thành công</h2>
            <p>Bạn đã đặt mật khẩu mới thành công. Hãy đăng nhập để bắt đầu sử dụng hệ thống.</p>
            <button className="reset-submit-btn" type="button" onClick={() => navigate('/')}>
              Về trang chính
            </button>
          </div>
        )}

        <button type="button" className="back-login-link" onClick={() => navigate('/')}>
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
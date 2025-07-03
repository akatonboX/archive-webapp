import React from 'react';
import styles from './Input.module.css';

export interface InputProps {
  /**
   * インプットの値
   */
  value?: string;
  /**
   * プレースホルダーテキスト
   */
  placeholder?: string;
  /**
   * インプットタイプ
   */
  type?: 'text' | 'email' | 'password' | 'number';
  /**
   * インプットのサイズ
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * インプットが無効かどうか
   */
  disabled?: boolean;
  /**
   * インプットが必須かどうか
   */
  required?: boolean;
  /**
   * エラー状態かどうか
   */
  error?: boolean;
  /**
   * 値が変更された時のハンドラ
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * フォーカスイベントハンドラ
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * ブラーイベントハンドラ
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  type = 'text',
  size = 'medium',
  disabled = false,
  required = false,
  error = false,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const getInputClass = () => {
    const classes = [
      styles['ts-input'],
      styles[`ts-input--${size}`],
      error && styles['ts-input--error']
    ].filter(Boolean);
    
    return classes.join(' ');
  };

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      className={getInputClass()}
      disabled={disabled}
      required={required}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    />
  );
};

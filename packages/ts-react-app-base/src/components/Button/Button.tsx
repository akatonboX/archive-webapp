import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /**
   * ボタンのテキスト
   */
  children: React.ReactNode;
  /**
   * ボタンのサイズ
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * ボタンのバリアント
   */
  variant?: 'primary' | 'secondary' | 'outline';
  /**
   * ボタンが無効かどうか
   */
  disabled?: boolean;
  /**
   * クリックイベントハンドラ
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  onClick,
  ...props
}) => {
  const getButtonClass = () => {
    const classes = [
      styles['ts-button'],
      styles[`ts-button--${size}`],
      styles[`ts-button--${variant}`]
    ].filter(Boolean);
    
    return classes.join(' ');
  };

  return (
    <button
      className={getButtonClass()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

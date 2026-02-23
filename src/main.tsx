import {StrictMode, Component, ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('siteContent');
    localStorage.removeItem('ranhrang_cafe_content'); // Clear new key too just in case
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
          <div className="text-center space-y-4 max-w-lg">
            <h1 className="text-2xl font-bold text-red-600 bg-red-100 px-4 py-2 rounded inline-block">Đã xảy ra lỗi!</h1>
            <p className="text-gray-600">Dữ liệu có thể bị hỏng hoặc kết nối gặp vấn đề.</p>
            
            {/* Show error details for debugging */}
            {this.state.error && (
              <div className="bg-gray-100 p-4 rounded text-left overflow-auto max-h-40 text-sm font-mono text-red-500 border border-red-200">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-4 justify-center mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand-dark text-white rounded hover:bg-brand-dark/90"
              >
                Tải lại trang
              </button>
              <button 
                onClick={this.handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Đặt lại dữ liệu gốc
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

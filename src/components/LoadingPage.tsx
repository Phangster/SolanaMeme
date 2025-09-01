'use client';
import Image from 'next/image';

interface LoadingPageProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'fullscreen';
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = "Loading...", 
  showSpinner = true,
  className = "",
  variant = "fullscreen"
}) => {
  const getContainerClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'flex flex-col items-center justify-center p-8 w-full';
      case 'fullscreen':
        return 'fixed inset-0 flex flex-col items-center justify-center min-h-screen w-full z-50';
      default:
        return 'flex flex-col items-center justify-center min-h-screen w-full';
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <div className="text-center text-white w-full max-w-md mx-auto px-4">
        {showSpinner && (
          <div className="mb-4 flex justify-center">
            <Image 
              src="/ym-left.png"
              alt="Loading Yao Ming Face" 
              width={400}
              height={400}
              className="animate-spin rounded-lg"
              priority
              draggable={false}
            />
          </div>
        )}
        <p className="text-lg font-semibold text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingPage;

interface HomeContentProps {
  onNavigate: (route: string) => void;
}

const HomeContent = ({ onNavigate }: HomeContentProps) => {
  return (
    <div className="max-w-4xl mx-auto text-center pb-16">
      <h1 className="text-6xl md:text-8xl font-bold mb-8 text-yellow-400 font-pixel">
        troll
      </h1>
      
      {/* Contract Address */}
      <div className="mb-12 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-400 mb-2 font-pixel">Contract Address:</p>
        <p className="font-mono text-lg text-yellow-400 break-all font-pixel">
          5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2
        </p>
      </div>

      {/* Troll Definition */}
      <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-pixel">
        a troll, someone who annoys others on the internet for their own amusement. 
        The original comic by Ramirez mocked trolls; however, the image is widely used by trolls.
      </p>

      <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-pixel">
        a troll, someone who annoys others on the internet for their own amusement. 
        The original comic by Ramirez mocked trolls; however, the image is widely used by trolls.
      </p>

      <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-pixel">
        a troll, someone who annoys others on the internet for their own amusement. 
        The original comic by Ramirez mocked trolls; however, the image is widely used by trolls.
      </p>

      <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-pixel">
        a troll, someone who annoys others on the internet for their own amusement. 
        The original comic by Ramirez mocked trolls; however, the image is widely used by trolls.
      </p>

      <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-pixel">
        a troll, someone who annoys others on the internet for their own amusement. 
        The original comic by Ramirez mocked trolls; however, the image is widely used by trolls.
      </p>

      {/* Call to Action Button */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('/how-to-buy')}
          className="inline-block bg-yellow-400 text-black px-8 py-4 text-xl font-bold rounded-lg hover:bg-yellow-300 transition-colors transform hover:scale-105 font-pixel"
        >
          BECOME A TROLL NOW
        </button>
      </div>

      {/* Description */}
      <p className="text-lg text-gray-400 max-w-2xl mx-auto font-pixel">
        To learn how to buy, where to buy, and all other information about $TROLL as a memecoin, click the button above.
      </p>
    </div>
  );
};

export default HomeContent;

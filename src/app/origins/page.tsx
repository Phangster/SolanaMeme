'use client';
import Layout from '@/components/Layout';

export default function OriginsPage() {
  return (
    <Layout currentRoute="/origins">
      <div className="max-w-4xl mx-auto pb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-yellow-400 text-center">
          The Origins of $YAO
        </h1>
        
        <div className="space-y-8 text-center md:">
          {/* The Original Comic */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Original Event</h2>
            <p className="text-gray-300 leading-relaxed">
              The legendary moment happened during a 2009 NBA press conference. Yao Ming, the 7'6" giant who conquered basketball, heard his teammate crack a joke about his performance. What followed was pure internet gold - that iconic smirk, the raised eyebrow, the "are you serious?" expression that would become the ultimate "Bitch Please" face. One moment of pure disbelief became the face of a generation.
            </p>
          </div>

          {/* Internet Culture */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Internet Culture Phenomenon</h2>
            <p className="text-gray-300 leading-relaxed">
              From NBA courts to every corner of the internet, Yao's face became the universal symbol of "really, bro?" The meme exploded across forums, social media, and group chats worldwide. It transcended language barriers - everyone understood what that face meant. The "Bitch Please" expression became the perfect response to life's absurdities. Yao didn't just play basketball; he accidentally created the most versatile meme weapon ever.
            </p>
          </div>

          {/* Memecoin Movement */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Memecoin Movement</h2>
            <p className="text-gray-300 leading-relaxed">
              In 2024, legends don't retire - they evolve. $YAO represents the next chapter of this iconic face's journey. We're not just launching a token; we're weaponizing a cultural phenomenon. This isn't another dog coin or frog token. This is the face that already conquered the internet, now ready to conquer DeFi. The meme that broke the internet is about to break the bank.
            </p>
          </div>

          {/* Community */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Building the $YAO Community</h2>
            <p className="text-gray-300 leading-relaxed">
              $YAO isn't just a community - it's a brotherhood of degenerates who understand true meme royalty. We're building an army of diamond-handed legends who know that Yao's face is the ultimate flex. Every holder becomes part of internet history. We don't just hodl tokens; we hodl the legacy of the most iconic "Bitch Please" moment ever captured.
            </p>
          </div>

          {/* The Future */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Future of $YAO</h2>
            <p className="text-gray-300 leading-relaxed">
              Yao Ming dominated basketball. His face dominated memes. Now $YAO will dominate crypto. We're not just going to the moon - we're taking that legendary smirk to every galaxy. The face that launched a billion reactions is about to launch a billion-dollar movement. This is just the beginning of the Yao Ming crypto dynasty.
            </p>
          </div>

          {/* Fun Facts */}
          <div className="p-6 bg-yellow-900/20 rounded-lg border border-yellow-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Fun Facts About $YAO</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>The original photo was snapped during a Houston Rockets press conference in May 2009</li>
              <li>Yao's expression lasted exactly 2.3 seconds but became eternal</li>
              <li>The meme has been used over 500 million times across all platforms</li>
              <li>Yao Ming is probably still making that face reading this right now</li>
              <li>$YAO holders automatically inherit Yao's legendary height (results may vary)</li>
            </ul>
          </div>

          {/* Join the Movement */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Join the $YAO Movement</h2>
            <p className="text-gray-300 mb-6">
              Ready to become part of internet history? Join the $YAO community and help us build 
              the future of memecoins.
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.href = '/how-to-buy'}
                className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
              >
                Buy $YAO Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

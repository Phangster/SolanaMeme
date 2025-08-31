'use client';
import Layout from '@/components/Layout';

export default function OriginsPage() {
  return (
    <Layout currentRoute="/origins">
      <div className="max-w-4xl mx-auto pb-16 pt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 text-center">
          The Origins of $$YAO
        </h1>
        
        <div className="space-y-8">
          {/* The Original Comic */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Original Comic</h2>
            <p className="text-gray-300 leading-relaxed">
              The iconic $YAO face originated from a 2008 comic by artist Matt Furie, known as &ldquo;Pepe the Frog.&rdquo;
              However, the specific $YAO face that became an internet phenomenon was created by artist Carlos Ramirez
              in 2008. The comic was originally meant to mock internet $YAOs - people who deliberately provoke
              others online for their own amusement.
            </p>
          </div>

          {/* Internet Culture */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Internet Culture Phenomenon</h2>
            <p className="text-gray-300 leading-relaxed">
              What started as a satirical comic quickly became one of the most recognizable memes on the internet.
              The $YAO face, with its characteristic grin and raised eyebrows, became synonymous with $YAOing
              behavior. Ironically, the very people the comic was mocking began using the image as their own 
              calling card, turning it into a symbol of internet culture itself.
            </p>
          </div>

          {/* Memecoin Movement */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Memecoin Movement</h2>
            <p className="text-gray-300 leading-relaxed">
              In 2024, the $YAO face found new life in the world of cryptocurrency. $$YAO was born as a 
              tribute to this internet legend, representing not just a memecoin, but a celebration of the 
              chaotic, unpredictable nature of both internet culture and the crypto market. It&apos;s a token that
              embraces the spirit of $YAOing - not to harm, but to challenge the status quo.
            </p>
          </div>

          {/* Community */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Building the $YAO Community</h2>
            <p className="text-gray-300 leading-relaxed">
              $$YAO isn&apos;t just about the meme - it&apos;s about building a community of people who understand
              internet culture, who appreciate the humor in $YAOing, and who want to be part of something 
              bigger than themselves. The community is built on the principles of fun, inclusivity, and 
              embracing the absurdity of the internet.
            </p>
          </div>

          {/* The Future */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">The Future of $$YAO</h2>
            <p className="text-gray-300 leading-relaxed">
              As internet culture continues to evolve, $$YAO aims to be at the forefront of the memecoin 
              revolution. We&apos;re not just another token - we&apos;re a movement that celebrates the creativity,
              humor, and community that makes the internet such a unique place. The $YAO face may have 
              started as a joke, but $$YAO is building something real and lasting.
            </p>
          </div>

          {/* Fun Facts */}
          <div className="p-6 bg-yellow-900/20 rounded-lg border border-yellow-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🎭 Fun Facts About $YAOs</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>The $YAO face was originally drawn in MS Paint</li>
              <li>It first gained popularity on 4chan in 2008</li>
              <li>The image has been parodied and remixed thousands of times</li>
              <li>It&apos;s considered one of the most successful memes ever created</li>
              <li>The $YAO face transcends language barriers worldwide</li>
            </ul>
          </div>

          {/* Join the Movement */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Join the $YAO Movement</h2>
            <p className="text-gray-300 mb-6">
              Ready to become part of internet history? Join the $$YAO community and help us build 
              the future of memecoins.
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.href = '/how-to-buy'}
                className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
              >
                Buy $$YAO Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

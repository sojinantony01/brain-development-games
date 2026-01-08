import React, { useState } from 'react'

interface HowToPlayProps {
  title: string
  instructions: string[]
  tips?: string[]
}

export default function HowToPlay({ title, instructions, tips }: HowToPlayProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-50 hover:bg-blue-100 px-4 py-3 text-left font-semibold text-blue-900 flex items-center justify-between transition-colors"
      >
        <span>📖 How to Play: {title}</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>
      
      {isOpen && (
        <div className="bg-white p-4 border-t">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          
          {tips && tips.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Made with Bob

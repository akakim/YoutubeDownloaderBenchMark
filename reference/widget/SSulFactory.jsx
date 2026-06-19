import { useState } from 'react'
import axios from 'axios'
import OpenAI from 'openai'

import '../App.css'

function SSulFactory() {
  const [inputs, setInputs] = useState([{ situation: '', prompt: '' }])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const addInput = () => {
    setInputs([...inputs, { situation: '', prompt: '' }])
  }

  const updateInput = (index, field, value) => {
    const newInputs = [...inputs]
    newInputs[index][field] = value
    setInputs(newInputs)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const scenes = inputs.map((input, index) => ({cut: index + 1, situation: input.situation, prompt: input.prompt }))
    try {
      // Get API key from server
      const keyResponse = await axios.get('http://localhost:3000/api/getApiKey')
      const apiKey = keyResponse.data.apiKey
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

      // Generate images for each scene
      const generatedResults = []
      for (const scene of scenes) {
        const response = await openai.images.generate({
          prompt: scene.prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'b64_json'
        })
        generatedResults.push({
          cut: scene.cut,
          situation: scene.situation,
          prompt: scene.prompt,
          image: `data:image/png;base64,${response.data[0].b64_json}`
        })
      }
      setResults(generatedResults)
      alert('이미지 생성 성공!')
    } catch (error) {
      alert('데이터 전송 실패: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ssul-factory">
      <h1>썰쇼츠 공장</h1>
      <button className="add-btn" onClick={addInput}>+</button>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, index) => (
          <div key={index} className="input-form">
            <div className="input-group">
              <label htmlFor={`situation-${index}`}>상황:</label>
              <input
                id={`situation-${index}`}
                type="text"
                value={input.situation}
                onChange={(e) => updateInput(index, 'situation', e.target.value)}
                placeholder="상황을 입력하세요"
              />
            </div>
            <div className="input-group">
              <label htmlFor={`prompt-${index}`}>프롬프트:</label>
              <input
                id={`prompt-${index}`}
                type="text"
                value={input.prompt}
                onChange={(e) => updateInput(index, 'prompt', e.target.value)}
                placeholder="프롬프트를 입력하세요"
              />
            </div>
          </div>
        ))}
        <button type="submit" className="submit-btn" disabled={loading}>{loading ? '생성 중...' : '생성'}</button>
      </form>

      {/* 이미지 갤러리 */}
      {results.length > 0 && (
        <div className="gallery">
          <h2>생성된 이미지</h2>
          <div className="images-container">
            {results.map((result, index) => (
              <div key={index} className="image-card">
                <div className="image-number">Cut {result.cut}</div>
                <img src={result.image} alt={result.situation} />
                <div className="image-info">
                  <p className="situation"><strong>상황:</strong> {result.situation}</p>
                  <p className="prompt"><strong>프롬프트:</strong> {result.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SSulFactory
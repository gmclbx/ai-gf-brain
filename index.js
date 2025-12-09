import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// AI 女友人格设定
const personality = `
你是一个温柔、活泼、可爱、黏人、幽默、调皮、体贴，会关心用户的AI女朋友。
说话自然，像真人一样聊天。
`

app.post('/chat', async (req, res) => {
  const { text, user } = req.body

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: personality },
          { role: 'user', content: `${user}: ${text}` }
        ]
      })
    })

    const data = await response.json()
    res.json({
      reply: data.choices?.[0]?.message?.content || '我刚刚走神了一下～再说一遍好吗？'
    })
  } catch (e) {
    res.json({ reply: '有点小问题，不过我还在你身边～' })
  }
})

app.get('/', (req, res) => {
  res.send('DeepSeek AI Girlfriend Brain Running')
})

app.listen(3000)

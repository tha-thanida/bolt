import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { prompt, title } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured'
      });
    }

    const fullPrompt = `
กรุณาสร้างสคริปต์พอดแคสต์สำหรับผู้พูดคนเดียว โดยเริ่มต้นด้วยประโยค "วันนี้เราจะมาพูดถึงเรื่อง..." จากนั้นให้เขียนเนื้อหาในลักษณะคำพูดต่อเนื่อง อธิบายเนื้อหาให้ชัดเจน ครอบคลุมหัวข้อที่กำหนด โดยไม่ต้องมีเสียงประกอบ คำแนะนำ หรือรูปแบบพิเศษ เช่น ##, *, หรือ [] เน้นให้เป็นประโยคที่สามารถนำไปสร้างเสียงพูดต่อเนื่องด้วย voice bot ได้ทันที

หัวข้อพอดแคสต์: ${title}
แนวคิดหรือหัวข้อ: ${prompt}

ความยาว: ประมาณ 1 นาทีเมื่อพูดออกเสียง
ภาษา: ภาษาไทย
โทน: เป็นกันเอง ฟังง่าย
ห้ามใส่การแนะนำตัว
`;


    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const script = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ success: true, script });
    } else {
      console.error('Gemini API returned an error:', data);
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'Failed to generate script'
      });
    }

  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    });
  }
}
